import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MapView from '../shared/MapView';
import { useAuth } from '../context/AuthContext';
import {
  createRideRequest,
  getAvailableDrivers,
  rateDriver,
  cancelRide,
  DriverForMap
} from '../utils/api';

interface AssignedDriver {
  ride_id?: number;
  driver_id: number;
  driver_name: string;
  driver_location: string;
  pickup_location: string;
  dropoff_location: string;
  status?: string;
  otp?: string;
}

export default function Ride() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [drivers, setDrivers] = useState<DriverForMap[]>([]);
  const [rideId, setRideId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'pickup' | 'dropoff'>('pickup');
  const [assignedDriver, setAssignedDriver] = useState<AssignedDriver | null>(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState<'auto' | 'school_pool' | 'school_priority'>('auto');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [lastCompletedRide, setLastCompletedRide] = useState<{ id: number, driverId: number } | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'school_priority') {
      setSelectedRideType('school_priority');
    }
  }, [searchParams]);

  // Default center (Bangalore)
  const mapCenter: [number, number] = [12.9716, 77.5946];

  useEffect(() => {
    fetchDrivers();
    const interval = setInterval(fetchDrivers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${user.id}/ride-status`);
        if (response.ok) {
          const data = await response.json();

          if (data.has_ride) {
            setWaitingForDriver(false);

            if (data.status === 'matched' || data.status === 'accepted' || data.status === 'in_progress') {
              console.log('📊 Ride status data:', data);
              console.log('🔐 OTP value:', data.otp);
              setAssignedDriver({
                ride_id: data.ride_id,
                driver_id: data.driver_id,
                driver_name: `Driver ${data.driver_id}`,
                driver_location: data.driver_location || 'Unknown',
                pickup_location: data.pickup_location,
                dropoff_location: data.dropoff_location,
                status: data.status,
                otp: data.otp
              });

              // Parse driver location for map
              if (data.driver_location) {
                const [dLat, dLng] = data.driver_location.split(',').map(Number);
                // Create a live driver object for the map
                setDrivers([{
                  driver_id: data.driver_id,
                  lat: dLat,
                  lng: dLng,
                  available: false // Busy with this ride
                }]);
              }

              if (data.ride_id) {
                setRideId(data.ride_id);
              }
            } else if (data.status === 'completed' && assignedDriver) {
              // Ride just completed
              setLastCompletedRide({ id: assignedDriver.ride_id!, driverId: assignedDriver.driver_id });
              setAssignedDriver(null);
              setShowRatingModal(true);
            }
          } else if (assignedDriver && (assignedDriver.status === 'in_progress' || assignedDriver.status === 'accepted')) {
            // Handle case where has_ride becomes false (Completed)
            // Catch both 'in_progress' and 'accepted' to handle race conditions where polling misses the in_progress state
            console.log("🏁 Ride finished (detected via polling). Showing rating.");
            setLastCompletedRide({ id: assignedDriver.ride_id!, driverId: assignedDriver.driver_id });
            setAssignedDriver(null);
            setShowRatingModal(true);
          }
        }
      } catch (error) {
        console.error('Failed to poll ride status:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [user, assignedDriver]);

  const fetchDrivers = async () => {
    const driverData = await getAvailableDrivers();
    setDrivers(driverData);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    if (selectionMode === 'pickup') {
      setPickupLocation({ lat, lng });
      setSelectionMode('dropoff');
    } else {
      setDropoffLocation({ lat, lng });
    }
  };

  const calculateFare = (rideType: 'auto' | 'school_pool' | 'school_priority'): number => {
    switch (rideType) {
      case 'auto':
        return 100;
      case 'school_pool':
        return 150;
      case 'school_priority':
        return 250;
      default:
        return 100;
    }
  };

  const handleRequestRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      alert('Please select both pickup and dropoff locations');
      return;
    }

    setLoading(true);
    try {
      const fare = calculateFare(selectedRideType);
      const response = await createRideRequest(
        pickupLocation,
        dropoffLocation,
        user?.id || 7000,
        selectedRideType,
        fare
      );

      setRideId(response.data.id);
      setWaitingForDriver(true);
    } catch (error: any) {
      console.error('❌ Failed to create ride:', error);
      alert(`Failed to create ride: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!rideId) return;

    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to cancel the ride?')) {
      try {
        await cancelRide(rideId);
        handleNewRide();
        alert('Ride cancelled successfully');
      } catch (error) {
        console.error('Failed to cancel ride:', error);
        alert('Failed to cancel ride');
      }
    }
  };

  const handleNewRide = () => {
    setRideId(null);
    setAssignedDriver(null);
    setWaitingForDriver(false);
    setPickupLocation(null);
    setDropoffLocation(null);
    setSelectionMode('pickup');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white font-sans">
        <div className="text-center bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-8 shadow-xl max-w-sm">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Login Required</h2>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">Please authenticate with your credentials to access the Velo ride booking platform.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (showRatingModal) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans text-white">
        <div className="bg-gradient-to-b from-[#0c0721]/95 to-[#030014]/95 border border-white/[0.08] shadow-[0_0_50px_rgba(59,130,246,0.35)] rounded-2xl p-8 max-w-md w-full animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Ride Completed!</h2>
            <p className="text-xs text-gray-400">How was your ride with Driver #{lastCompletedRide?.driverId}?</p>
          </div>

          <div className="flex justify-center gap-2.5 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all duration-200 hover:scale-110 ${rating >= star ? 'grayscale-0 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'grayscale opacity-25'}`}
              >
                ⭐
              </button>
            ))}
          </div>

          <textarea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Add comments or telemetry feedback (optional)..."
            className="w-full bg-[#050218]/60 border border-white/10 p-4 rounded-xl mb-6 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] resize-none h-28 transition-all"
          />

          <button
            onClick={async () => {
              if (rating === 0) {
                alert('Please select a rating');
                return;
              }
              try {
                await rateDriver(lastCompletedRide!.driverId, user!.id, lastCompletedRide!.id, rating, ratingComment);
                setShowRatingModal(false);
                setRating(0);
                setRatingComment('');
                setLastCompletedRide(null);
                handleNewRide();
              } catch (error) {
                console.error('Failed to submit rating:', error);
                alert('Failed to submit rating');
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3.5 rounded-xl font-semibold text-base hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
          >
            Submit Rating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden relative bg-[#030014] text-white selection:bg-blue-500 font-sans">
      {/* Sidebar Panel */}
      <div className="w-full md:w-[450px] bg-gradient-to-b from-[#08051e] to-[#030014] border-r border-white/[0.08] z-20 shadow-2xl flex flex-col h-[50vh] md:h-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06] bg-[#030014]/40 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-widest cursor-pointer bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent" onClick={() => navigate('/')}>VELO</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-gray-300 text-xs font-semibold">{user.name}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 bg-transparent">
          {assignedDriver ? (
            <div className="space-y-6 animate-fade-in">
              {assignedDriver.status === 'in_progress' ? (
                <div className="bg-cyan-500/10 p-6 rounded-2xl border border-cyan-500/20 text-center shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <div className="text-6xl mb-4 animate-bounce">🛺</div>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-2">On Ride</h2>
                  <p className="text-cyan-400 text-sm">Heading to destination</p>
                </div>
              ) : (
                <div className="bg-gradient-to-b from-blue-950/40 to-[#030014]/40 border border-blue-500/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">🛺</div>
                    <h2 className="text-xl font-bold text-cyan-400">Driver Arriving</h2>
                    <p className="text-gray-400 text-xs mt-1">{assignedDriver.driver_name}</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                      <span className="text-gray-400 uppercase tracking-wider font-mono">Status</span>
                      <span className="font-semibold text-cyan-300 capitalize">{assignedDriver.status?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                      <span className="text-gray-400 uppercase tracking-wider font-mono">Vehicle</span>
                      <span className="font-semibold text-gray-300">Piaggio Ape • KA 01 AB 5789</span>
                    </div>
                    {assignedDriver.otp && (
                      <div className="flex items-center justify-between p-4 bg-cyan-500/10 text-cyan-200 border border-cyan-500/25 rounded-xl shadow-lg">
                        <span className="text-cyan-400 uppercase font-mono tracking-wider font-semibold">OTP Verification</span>
                        <span className="font-mono text-2xl font-bold tracking-widest text-cyan-300">{assignedDriver.otp}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleNewRide}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
              >
                New Ride
              </button>
            </div>
          ) : waitingForDriver ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-4xl">📡</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Finding your ride</h2>
                <p className="text-gray-400 text-sm">Connecting you with nearby drivers...</p>
              </div>
              <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                <div className="h-full bg-cyan-400 w-1/2 animate-[shimmer_1.5s_infinite]"></div>
              </div>

              <button
                onClick={handleCancelRide}
                className="mt-6 px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 rounded-full font-semibold transition-all text-xs uppercase tracking-wider"
              >
                Cancel Request
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Get a ride</h1>

              {/* Input Fields */}
              <div className="relative space-y-4">
                {/* Connecting Line */}
                <div className="absolute left-4 top-10 bottom-10 w-0.5 bg-white/10"></div>

                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${selectionMode === 'pickup' ? 'bg-cyan-400 ring-4 ring-cyan-400/20' : 'bg-gray-600'}`}></div>
                  <input
                    type="text"
                    readOnly
                    value={pickupLocation ? `${pickupLocation.lat.toFixed(4)}, ${pickupLocation.lng.toFixed(4)}` : ''}
                    placeholder="Pickup location"
                    onClick={() => setSelectionMode('pickup')}
                    className={`w-full bg-[#050218]/60 border border-white/10 p-3.5 pl-10 rounded-xl text-white cursor-pointer placeholder-gray-500 focus:outline-none ${selectionMode === 'pickup' ? 'border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-[#050218]' : ''}`}
                  />
                </div>

                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 ${selectionMode === 'dropoff' ? 'ring-4 ring-blue-500/20' : ''}`}></div>
                  <input
                    type="text"
                    readOnly
                    value={dropoffLocation ? `${dropoffLocation.lat.toFixed(4)}, ${dropoffLocation.lng.toFixed(4)}` : ''}
                    placeholder="Dropoff location"
                    onClick={() => setSelectionMode('dropoff')}
                    className={`w-full bg-[#050218]/60 border border-white/10 p-3.5 pl-10 rounded-xl text-white cursor-pointer placeholder-gray-500 focus:outline-none ${selectionMode === 'dropoff' ? 'border-blue-400 ring-1 ring-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-[#050218]' : ''}`}
                  />
                </div>
              </div>

              {/* Ride Options */}
              {pickupLocation && dropoffLocation && (
                <div className="space-y-3 pt-4">
                  <h3 className="font-mono text-[10px] tracking-wider text-gray-500 uppercase mb-2">Suggested Rides</h3>

                  <div
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${selectedRideType === 'auto' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03]'}`}
                    onClick={() => setSelectedRideType('auto')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14"><img src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_188,h_188/v1548646935/assets/64/93c255-87c8-4e2e-9429-cf709bf1b838/original/3.png" alt="Auto" /></div>
                      <div>
                        <div className="font-bold text-base text-gray-200 flex items-center gap-2">VELO Auto <span className="text-[10px] font-mono text-gray-500">👤 3</span></div>
                        <div className="text-xs text-gray-400 mt-0.5">Affordable, everyday rides</div>
                      </div>
                    </div>
                    <div className="font-bold text-base text-cyan-400 font-mono">₹100</div>
                  </div>

                  <div
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${selectedRideType === 'school_pool' ? 'border-blue-500 bg-blue-500/10 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03]'}`}
                    onClick={() => setSelectedRideType('school_pool')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 flex items-center justify-center text-3xl">🎒</div>
                      <div>
                        <div className="font-bold text-base text-gray-200 flex items-center gap-2">Priority Rides <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded-full border border-blue-500/30">Priority</span></div>
                        <div className="text-xs text-gray-400 mt-0.5">Priority pickup for urgent rides</div>
                      </div>
                    </div>
                    <div className="font-bold text-base text-blue-400 font-mono">₹150</div>
                  </div>

                  <div
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${selectedRideType === 'school_priority' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03]'}`}
                    onClick={() => setSelectedRideType('school_priority')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 flex items-center justify-center text-3xl">🚨</div>
                      <div>
                        <div className="font-bold text-base text-gray-200 flex items-center gap-2">School Ride <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] rounded-full border border-cyan-500/30">Safe Driver</span></div>
                        <div className="text-xs text-gray-400 mt-0.5">Verified safe driver • Immediate pickup</div>
                      </div>
                    </div>
                    <div className="font-bold text-base text-cyan-400 font-mono">₹250</div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-white/[0.05] rounded-2xl bg-white/[0.01] cursor-not-allowed opacity-40">
                    <div className="flex items-center gap-4">
                      <div className="w-14"><img src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_188,h_188/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x312_Logo_0690d9.png" alt="Moto" /></div>
                      <div>
                        <div className="font-bold text-base text-gray-400 flex items-center gap-2">Moto <span className="text-[10px] font-mono text-gray-600">👤 1</span></div>
                        <div className="text-xs text-gray-600 mt-0.5">Affordable motorcycle rides</div>
                      </div>
                    </div>
                    <div className="font-bold text-xs text-gray-600">Coming Soon</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleRequestRide}
                disabled={!pickupLocation || !dropoffLocation || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 disabled:border-white/5 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all mt-4"
              >
                {loading ? 'Requesting...' : 'Request Velo'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-[50vh] md:h-full bg-[#030014]">
        {/* Floating Mode Indicator */}
        {!assignedDriver && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-[#030014]/85 backdrop-blur-md border border-white/[0.08] px-4 py-2.5 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)] font-medium text-xs flex items-center gap-2 text-white">
            <span className={selectionMode === 'pickup' ? 'text-cyan-400 font-bold' : 'text-blue-400 font-bold'}>
              {selectionMode === 'pickup' ? '📍 Set Pickup Point' : '🏁 Set Destination'}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-gray-400 text-[10px]">Click on map coordinates</span>
          </div>
        )}

        <MapView
          center={mapCenter}
          zoom={14}
          onLocationSelect={!assignedDriver ? handleLocationSelect : undefined}
          pickupMarker={pickupLocation}
          dropoffMarker={dropoffLocation}
          drivers={drivers}
        />
      </div>
    </div>
  );
}
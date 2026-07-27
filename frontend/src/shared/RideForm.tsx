import { formatLocationForDisplay } from '../utils/locationUtils';

interface RideFormProps {
  pickupLocation: { lat: number; lng: number } | null;
  dropoffLocation: { lat: number; lng: number } | null;
  pickupAddress?: string;
  dropoffAddress?: string;
  onRequestRide: () => void;
  loading: boolean;
  rideId: number | null;
  drivers: any[];
  selectionMode: 'pickup' | 'dropoff';
  onSelectionModeChange: (mode: 'pickup' | 'dropoff') => void;
  waitingForDriver: boolean;
  assignedDriver: any;
  onNewRide: () => void;
}

export default function RideForm({
  pickupLocation,
  dropoffLocation,
  pickupAddress = '',
  dropoffAddress = '',
  onRequestRide,
  loading,
  rideId,
  drivers,
  selectionMode,
  onSelectionModeChange,
  waitingForDriver,
  assignedDriver,
  onNewRide
}: RideFormProps) {
  return (
    <div className="bg-white p-6 overflow-y-auto">
      {assignedDriver ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-4 text-center">
              ✅ Driver Assigned!
            </h3>

            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🚗</div>
              <div className="text-xl font-bold text-gray-800">{assignedDriver.driver_name}</div>
              <div className="text-xs text-gray-500 mt-1">ID: #{assignedDriver.driver_id}</div>

              {assignedDriver.status && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                  assignedDriver.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-700'
                    : assignedDriver.status === 'accepted'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {assignedDriver.status === 'in_progress' ? '🚦 Ride In Progress' :
                   assignedDriver.status === 'accepted' ? '✅ Driver Accepted' :
                   '⏳ Driver Assigned'}
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-white border border-gray-100 p-3 rounded-lg">
                <div className="font-semibold text-gray-500 text-xs uppercase mb-1">📍 Pickup</div>
                <div className="text-gray-700">{assignedDriver.pickup_location}</div>
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg">
                <div className="font-semibold text-gray-500 text-xs uppercase mb-1">🎯 Dropoff</div>
                <div className="text-gray-700">{assignedDriver.dropoff_location}</div>
              </div>
              {assignedDriver.otp && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-800 uppercase">One-Time Password</span>
                  <span className="text-2xl font-mono font-bold tracking-widest">{assignedDriver.otp}</span>
                </div>
              )}
            </div>

            <button
              onClick={onNewRide}
              className="w-full mt-4 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Request Another Ride
            </button>
          </div>
        </div>
      ) : waitingForDriver ? (
        <div className="space-y-4 text-center py-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-4xl">📡</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Finding Drivers...</h3>
            <p className="text-sm text-gray-500">Broadcasting to nearby drivers.</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3 text-xs text-left">
            <div>
              <span className="font-semibold text-gray-500 uppercase text-xs">📍 Pickup</span>
              <div className="text-gray-700 mt-1">{pickupAddress || 'Selected location'}</div>
            </div>
            <div className="border-t pt-2">
              <span className="font-semibold text-gray-500 uppercase text-xs">🎯 Destination</span>
              <div className="text-gray-700 mt-1">{dropoffAddress || 'Selected location'}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Request a Ride</h2>
            <p className="text-xs text-gray-400">Click on the map to set pickup and dropoff</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onSelectionModeChange('pickup')}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold border transition-all text-sm ${
                selectionMode === 'pickup'
                  ? 'bg-green-50 border-green-400 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              📍 Set Pickup
            </button>
            <button
              onClick={() => onSelectionModeChange('dropoff')}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold border transition-all text-sm ${
                selectionMode === 'dropoff'
                  ? 'bg-red-50 border-red-400 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              🎯 Set Dropoff
            </button>
          </div>

          <div className="space-y-3">
            <div className={`p-4 rounded-xl border transition-all ${
              pickupLocation ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="text-xs font-semibold uppercase text-gray-500 mb-1">📍 Pickup Location</div>
              {pickupLocation ? (
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{pickupAddress || 'Getting address...'}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">Pin pickup on the map</div>
              )}
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              dropoffLocation ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="text-xs font-semibold uppercase text-gray-500 mb-1">🎯 Dropoff Location</div>
              {dropoffLocation ? (
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{dropoffAddress || 'Getting address...'}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {dropoffLocation.lat.toFixed(4)}, {dropoffLocation.lng.toFixed(4)}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">Pin destination on the map</div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Available Captains</span>
            <span className="text-2xl font-bold text-blue-600">{drivers.length}</span>
          </div>

          <button
            onClick={onRequestRide}
            disabled={!pickupLocation || !dropoffLocation || loading}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-base disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Creating Ride...' : '🛺 Request Ride'}
          </button>
        </div>
      )}
    </div>
  );
}
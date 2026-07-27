import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import cabImage from './cab_in_motion.png';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride');

  return (
    <div className="min-h-screen flex flex-col bg-[#030014] text-white overflow-x-hidden relative selection:bg-blue-500 selection:text-white font-sans">
      {/* Background Canvas Elements */}
      <div 
        className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-[0.12] pointer-events-none animate-grid-scroll"
        style={{ 
          maskImage: 'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)', 
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)' 
        }}
      ></div>

      {/* Floating Ambient Glowing Blobs (Blue Theme Accent) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/25 rounded-full blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute top-[20%] right-[-10%] w-[55vw] h-[55vw] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none animate-float-medium"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[45vw] h-[45vw] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#030014]/65 border-b border-white/[0.08] py-4 px-6 md:px-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div 
            className="text-2xl font-bold tracking-widest cursor-pointer bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent hover:opacity-85 transition-opacity" 
            onClick={() => navigate('/')}
          >
            VELO
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <button 
              onClick={() => navigate('/ride')} 
              className="text-gray-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Ride
            </button>
            <button 
              onClick={() => navigate('/driver')} 
              className="text-gray-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Drive
            </button>
            <button 
              className="text-gray-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-500 hover:after:w-full after:transition-all after:duration-300"
            >
              Business
            </button>
            <button 
              onClick={() => navigate('/admin')} 
              className="text-gray-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-500 hover:after:w-full after:transition-all after:duration-300"
            >
              Admin
            </button>
            <button 
              className="text-gray-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gray-400 hover:after:w-full after:transition-all after:duration-300"
            >
              About
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button className="hidden md:block text-gray-400 hover:text-white transition-colors">EN</button>
          <button className="hidden md:block text-gray-400 hover:text-white transition-colors">Help</button>
          <button 
            onClick={() => navigate('/login')} 
            className="hidden md:block text-gray-300 hover:text-white transition-colors px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-1.5 rounded-full hover:shadow-[0_0_15px_rgba(59,130,246,0.45)] transition-all font-semibold"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow relative flex items-center py-12 md:py-20 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Glassmorphic Panel */}
            <div className="lg:col-span-5 w-full bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)] rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/[0.06] bg-[#030014]/40">
                <button
                  className={`flex-1 py-4 text-center font-semibold text-xs md:text-sm flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'ride' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
                  onClick={() => setActiveTab('ride')}
                >
                  <span className="text-base">🚗</span>
                  <span>Ride</span>
                </button>
                <button
                  className={`flex-1 py-4 text-center font-semibold text-xs md:text-sm flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'drive' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
                  onClick={() => setActiveTab('drive')}
                >
                  <span className="text-base">🔑</span>
                  <span>Drive</span>
                </button>
                <button
                  className={`flex-1 py-4 text-center font-semibold text-xs md:text-sm flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'school' ? 'text-cyan-300 border-b-2 border-cyan-300 bg-cyan-300/5' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
                  onClick={() => setActiveTab('school')}
                >
                  <span className="text-base">🎒</span>
                  <span>School Pass</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {activeTab === 'ride' ? (
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      Request a ride now
                    </h1>
                    
                    <div className="space-y-4">
                      {/* Pickup Input */}
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter pickup location"
                          className="w-full bg-[#050218]/60 border border-white/10 p-3.5 pl-12 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                        />
                      </div>

                      {/* Destination Input */}
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter destination"
                          className="w-full bg-[#050218]/60 border border-white/10 p-3.5 pl-12 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate('/login')}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
                      >
                        Request Now
                      </button>
                      <button
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3.5 px-6 rounded-xl transition-colors"
                      >
                        Schedule for later
                      </button>
                    </div>

                    {/* School Pool Promo badge (Blue Theme) */}
                    <div
                      onClick={() => setActiveTab('school')}
                      className="mt-6 p-4 bg-gradient-to-r from-blue-950/20 to-cyan-950/20 border border-blue-500/20 rounded-xl cursor-pointer hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all flex items-center gap-4 group"
                    >
                      <div className="text-3xl bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 group-hover:scale-105 transition-transform">🎒</div>
                      <div>
                        <div className="font-bold text-base text-blue-300 flex items-center gap-1.5">
                          School Pool Pass
                          <span className="text-[10px] font-normal bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full border border-blue-500/30">Popular</span>
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors mt-0.5">Safe, priority rides for students. Get started →</div>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'school' ? (
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                      School Pool Pass
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      Safe, reliable, and priority student transportation with verified safe-drivers and real-time OTP confirmation. Subscriptions available monthly, quarterly, or annually.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => navigate('/school-pool')}
                        className="w-full bg-gradient-to-r from-blue-500 via-cyan-600 to-blue-600 hover:from-blue-400 hover:via-cyan-500 hover:to-blue-500 text-white font-semibold py-3.5 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
                      >
                        Get Started
                      </button>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-blue-400">🛡️</span>
                      <span>Includes verified background check and real-time alerts.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Ahoy! Captain
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      Become a driver on the Velo platform. Make competitive rates, manage your own schedule, and tap into our dedicated networks like school ride channels.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => navigate('/driver')}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all"
                      >
                        Sign up to drive
                      </button>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06] text-xs">
                      <a href="#" className="text-cyan-400 hover:underline">Learn more about driving and delivering →</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Cyber Cab Photo */}
            <div className="lg:col-span-7 hidden lg:block w-full">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.25)] h-[440px] group bg-[#050218]">
                {/* Dark Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/20 to-black/10 z-10"></div>
                
                {/* Cab Image */}
                <img 
                  src={cabImage} 
                  alt="Futuristic Velo Cab in Motion" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Cyber badge border */}
                <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl pointer-events-none z-20 group-hover:border-cyan-400/40 transition-colors duration-500"></div>

                {/* Lower HUD Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="text-xl font-bold text-white tracking-wide">Autonomous & Assisted Transit</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm">Smart routing dynamically maps routes with verified drivers in real-time.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Why Velo Features Section */}
      <section className="py-24 px-6 md:px-16 relative z-10 border-t border-white/[0.06] bg-[#05021a]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase bg-cyan-400/10 px-3.5 py-1.5 rounded-full border border-cyan-400/20">Our Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-4 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent leading-tight">
              Designed for Future Mobility
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Experience the next generation of urban transportation with verified safety, real-time tracking, and automated school subscription passes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: School Pool */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-8 rounded-2xl hover:border-pink-500/40 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-bl-full pointer-events-none group-hover:bg-pink-500/10 transition-colors"></div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-transform">🎒</div>
              <h3 className="text-xl font-bold mb-3 text-pink-300">School Pool Pass</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dedicated monthly, quarterly, or annual subscription passes for students. Features verified safe-drivers, optimized route scheduling, and parents OTP dropoff confirmations.
              </p>
            </div>

            {/* Feature 2: Smart Ride Hailing */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-8 rounded-2xl hover:border-cyan-500/40 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-transform">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Real-Time Dispatch</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Book instantly and get matched with auto/moto drivers in real-time. Transparent pricing, dynamic Leaflet map plotting, and live tracking ensure a seamless transit experience.
              </p>
            </div>

            {/* Feature 3: Driver Ecosystem */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-8 rounded-2xl hover:border-purple-500/40 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-transform">🔑</div>
              <h3 className="text-xl font-bold mb-3 text-purple-300">Driver Freedom</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Take command of your schedule. Leverage school pool routes and high demand centers to boost earnings. Receive verified bookings with low commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#02000d] text-gray-400 py-16 px-6 md:px-16 border-t border-white/[0.06] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Velo</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate('/help')} className="hover:text-cyan-400 transition-colors">Visit Help Center</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate('/about')} className="hover:text-cyan-400 transition-colors">About us</button></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Our offerings</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Products</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate('/ride')} className="hover:text-cyan-400 transition-colors">Ride</button></li>
              <li><button onClick={() => navigate('/driver')} className="hover:text-cyan-400 transition-colors">Drive</button></li>
              <li><button onClick={() => navigate('/school-pool')} className="hover:text-cyan-400 transition-colors">School Pool Pass</button></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Velo for Business</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Global Citizenship</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate('/safety')} className="hover:text-cyan-400 transition-colors">Safety</button></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Diversity and Inclusion</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Sustainability</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.06] text-xs text-gray-500">
          <div className="mb-4 md:mb-0">
            © 2025 Velo Cabs Inc.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
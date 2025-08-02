"use client"
import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Wallet, Shield, Clock, BarChart3, ArrowRight, Star, Users, DollarSign, Activity } from 'lucide-react';
import Navbar from './components/Navbar';

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { value: '$2.4M+', label: 'Gas Fees Saved' },
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '3', label: 'Chains Supported' }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const GridBackground = () => (
    <div className="fixed inset-0 z-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
          <pattern id="smallGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
          </pattern>
          <radialGradient id="mouseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
        <circle
          cx={mousePos.x}
          cy={mousePos.y}
          r="400"
          fill="url(#mouseGlow)"
          className="transition-all duration-300 ease-out"
        />
      </svg>
    </div>
  );

  const GlassCard = ({ children, className = "", hover = true }) => (
    <div className={`
      bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl
      ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:scale-105' : ''}
      transition-all duration-500 ease-out
      ${className}
    `}>
      {children}
    </div>
  );

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time Gas Tracking",
      description: "Monitor live gas prices across Ethereum, Polygon, and Arbitrum with sub-second updates directly from native RPC endpoints.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Smart Wallet Simulation",
      description: "Calculate exact transaction costs before sending. Input any ETH amount and see real-time USD costs across all chains.",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Interactive candlestick charts showing gas price volatility over 15-minute intervals with historical trend analysis.",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "No Third-Party APIs",
      description: "Direct blockchain connection ensures maximum reliability, privacy, and accuracy. Your data never leaves your browser.",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Perfect Timing",
      description: "Get notified when gas prices drop below your threshold. Never overpay for transactions again.",
      gradient: "from-red-400 to-rose-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Cross-Chain Optimization",
      description: "Compare costs across chains instantly. Find the cheapest route for your DeFi operations and NFT trades.",
      gradient: "from-indigo-400 to-purple-500"
    }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "DeFi Trader",
      content: "Saved me over $5K in gas fees this month alone. The real-time alerts are game-changing.",
      avatar: "AC"
    },
    {
      name: "Sarah Kim",
      role: "NFT Artist",
      content: "Finally, a gas tracker that actually works. The wallet simulation is incredibly accurate.",
      avatar: "SK"
    },
    {
      name: "Mike Torres",
      role: "Web3 Developer",
      content: "As a developer, I appreciate the direct RPC approach. No API keys, no rate limits, just works.",
      avatar: "MT"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GridBackground />
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative mt-15 z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <GlassCard className="inline-flex items-center transition duration-300  hover:border-white space-x-2 px-4 py-2 mb-6" hover={false}>
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300 ">Track Ethereum, Polygon & Arbitrum Gas</span>
            </GlassCard>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-white bg-clip-text text-transparent ">
              Stop Overpaying
            </span>
            <br />
            <span className="bg-white bg-clip-text text-transparent">
              Gas Fees
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            The most advanced real-time cross-chain gas tracker for Web3. 
            Monitor Ethereum, Polygon, and Arbitrum with precision timing and smart wallet simulation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button className="group bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-500 hover:to-blue-1000 transition-all duration-300 flex items-center space-x-2 hover:scale-105">
              <span>Start Tracking Gas</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/5 transition-all duration-300 hover:scale-105">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className={`text-3xl font-bold mb-2 transition-all duration-500 ${
                  index === currentStat ? 'text-blue-400 scale-110' : 'text-white'
                }`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Why Choose GasTracker Pro?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built by Web3 natives for Web3 natives. Every feature designed to save you money and time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} className="p-8 group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-400">Simple, powerful, and completely transparent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Connect Directly</h3>
              <p className="text-gray-400">
                We connect directly to Ethereum, Polygon, and Arbitrum RPC endpoints. No middlemen, no delays.
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Real-Time Analysis</h3>
              <p className="text-gray-400">
                Advanced algorithms parse Uniswap V3 events for accurate ETH/USD pricing and gas calculations.
              </p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Decisions</h3>
              <p className="text-gray-400">
                Get instant notifications, simulate costs, and make informed decisions before every transaction.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Loved by Web3 Community
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={index} className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <GlassCard className="p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Save on Gas?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of Web3 users who save money every day with GasTracker Pro
            </p>
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 mx-auto hover:scale-105">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">GasTracker Pro</span>
          </div>
          <p className="text-gray-500 mb-6">
            The future of gas fee optimization is here
          </p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
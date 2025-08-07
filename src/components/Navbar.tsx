import React from 'react'
import image from "next/image"
const Navbar = () => {
  return (
    <div className=' fixed top-0 left-0    w-full z-50 '>
        <nav className="relative z-10 backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-103 duration-500 delay-100  rounded-3xl p-0.2 mt-5 m-5 bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-sans font-extrabold hover:bg-blue-500 hover:scale-105 duration-300 delay-130 bg-white bg-clip-text text-transparent">
                MetaGas
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200 relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-700 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200 relative group">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-700 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200 relative group">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-700 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200 relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-700 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <div className="flex items-center space-x-3">
                <button className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                  Login
                </button>
                <button className="bg-gradient-to-r from-blue-800 to-blue-800 px-6 py-2 rounded-lg hover:from-blue-800 hover:to-blue-700 hover:scale-105 transition-all duration-900 font-medium shadow-lg shadow-blue-500/25">
                  Get Started
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        </nav>
      </div>
  )
}

export default Navbar
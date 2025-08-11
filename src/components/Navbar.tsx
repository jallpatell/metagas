import React from 'react'
import NavHover from "./ChartHover"
import { useRouter } from 'next/navigation'


const Navbar = () => {
  const router = useRouter()
  const handleHome = () => {
    router.push("/")
  }
  const handleFeatures = () => {
    router.push("/#features")
  }
  const handleAboutme = () => {
    router.push("/#aboutMe")
  }
  return (
    <div className=' fixed top-0 left-0    w-full z-50 '>
        <nav className="relative z-10 backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-102 duration-500 delay-100  rounded-3xl p-0.2 mt-5 m-5 bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span onClick={handleHome} className="text-3xl hover:cursor-pointer font-sans font-extrabold hover:bg-blue-500 hover:scale-105 duration-300 delay-130 bg-white bg-clip-text text-transparent">
                MetaGas
              </span>
            </div>
            <div className="hidden hover:cursor-pointer md:flex font-sans font-extralight items-center space-x-8">
              <a onClick={handleHome} className="text-gray-300 hover:text-white hover:text-2xl hover:scale-105 transition-all duration-200 relative group">
                Home
              </a>
              <a onClick={handleFeatures} className="text-gray-300 hover:text-white hover:text-2xl hover:scale-105 transition-all duration-200 relative group">
                Features
              </a>
              <div className='relative group'>
                <a href="#testimonials" className="text-gray-300 hover:text-white hover:text-2xl hover:scale-105 transition-colors duration-600  relative group">
                  Charts
                </a>
                <div className='hidden group-hover:block'>
                  <NavHover />
                </div>
              </div>
              
              <a onClick={handleAboutme} className="text-gray-300 hover:text-white hover:text-2xl hover:scale-105 transition-all duration-200 relative group">
                About Me
              </a>
            </div>
          </div>
        </div>
        </nav>
      </div>
  )
}

export default Navbar
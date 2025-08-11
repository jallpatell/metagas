import React, { ReactNode } from 'react'

interface GlassCard {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    href?: () => void;
}


const GlassCard: React.FC<GlassCard> = ( { children, className = "", hover = true, href } ) => {
  return (
    <div
    className={`
      bg-[#131313] backdrop-blur-sm border border-white/10 rounded-2xl shadow-md
      ${hover ? "    hover:border-white/20" : ""}
      transition-all duration-500 ease-out
      ${className}
    `}
  >
    {children}
  </div>
  )
}

export default GlassCard
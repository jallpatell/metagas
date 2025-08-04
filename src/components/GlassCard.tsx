import React, { ReactNode } from 'react'

interface GlassCard {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}


const GlassCard: React.FC<GlassCard> = ( { children, className = "", hover = true } ) => {
  return (
    <div
    className={`
      bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-md
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
import React from 'react';
import GasChart from '@/app/gasChartEth/page'
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  padding = 'lg',
  rounded = 'lg',
  shadow = 'lg',
  onClick
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div
        className={`
          w-[65vw] 
          h-[65vh] 
          bg-gray-900 
          border 
          border-gray-800 
          ${rounded === 'sm' ? 'rounded-sm' : ''}
          ${rounded === 'md' ? 'rounded-md' : ''}
          ${rounded === 'lg' ? 'rounded-lg' : ''}
          ${rounded === 'xl' ? 'rounded-xl' : ''}
          ${shadow === 'sm' ? 'shadow-sm' : ''}
          ${shadow === 'md' ? 'shadow-md' : ''}
          ${shadow === 'lg' ? 'shadow-lg' : ''}
          ${shadow === 'xl' ? 'shadow-xl' : ''}
          ${padding === 'sm' ? 'p-4' : ''}
          ${padding === 'md' ? 'p-6' : ''}
          ${padding === 'lg' ? 'p-8' : ''}
          ${padding === 'xl' ? 'p-10' : ''}
          transition-all 
          duration-300 
          ease-in-out
          hover:bg-gray-800
          hover:border-gray-700
          hover:shadow-2xl
          hover:shadow-blue-500/10
          hover:-translate-y-1
          hover:scale-105
          group
          relative
          overflow-hidden
          flex
          flex-col
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        onClick={onClick}
      >
      {/* Header Section */}
      {(title || subtitle) && (
        <div className="mb-6 relative z-10">
          {title && (
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                content check   
                
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Content Section */}
      <div className="relative z-10 flex-1 flex flex-col">
        <GasChart />
      </div>
      
      {/* Subtle gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
      
      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-lg border border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
    </div>
  );
};

export default Card;
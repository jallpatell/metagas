import React from 'react'
import Image from "next/image"

const ChartHover = () => {
  
  const menuItems = [
    { label: "Ethereum Gas", link: "/liveEth", icon: "/assets/ethlogo.svg" },
    { label: "Polygon Gas", link: "/livePol", icon: "/assets/polygon-matic-logo.svg" },
    { label: "Arbitrum Gas", link: "/liveArb", icon: "/assets/arbitrum-logo.svg" },
    { label: "Simulate Transactions", link: "#custom-analysis", icon: "/icons/transaction-simulate.png" },
  ];

  return (
    <div className="absolute top-full left-0 -mt-1 w-48 bg-black text-white rounded-lg shadow-lg border border-white/10 z-50">
      <ul className="flex flex-col">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.link}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors duration-200"
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={18}
                height={18}
                className="object-contain"
              />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChartHover
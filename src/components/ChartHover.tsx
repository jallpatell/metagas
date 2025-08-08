import React from 'react'

const ChartHover = () => {
  const menuItems = [
    { label: "Ethereum Gas", link: "#price-chart" },
    { label: "Polygon Gas", link: "#volume-chart" },
    { label: "Arbitrum Gas", link: "#market-cap" },
    { label: "Simulate Transactions", link: "#custom-analysis" },
  ];

  return (
    <div className="absolute top-full left-0 mt-2 w-48 bg-black text-white rounded-lg shadow-lg border border-white/10 z-50">
      <ul className="flex flex-col">
        {menuItems.map((item, index) => (
          <li key={index} className='hover:text-blue-500'>
            <a
              href={item.link}
              className="block px-4 py-2 hover:bg-white/10 transition-colors duration-900"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChartHover
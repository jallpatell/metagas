import React from "react";

type BlockchainDetailsProps = {
  blockchainName: string;
};

const BlockchainDetails: React.FC<BlockchainDetailsProps> = ({ blockchainName }) => {
  // Mock data for each blockchain - in a real app, this would come from an API
  const getBlockchainData = (name: string) => {
    switch (name) {
      case "Ethereum":
        return {
          price: "$3,245.67",
          dayChange: "+2.34%",
          monthChange: "+8.76%",
          yearChange: "+45.23%",
          isPositive: true
        };
      case "Polygon":
        return {
          price: "$0.847",
          dayChange: "-1.23%",
          monthChange: "+12.45%",
          yearChange: "+67.89%",
          isPositive: false
        };
      case "Arbitrum":
        return {
          price: "$1.234",
          dayChange: "+3.45%",
          monthChange: "+15.67%",
          yearChange: "+89.12%",
          isPositive: true
        };
      default:
        return {
          price: "$0.00",
          dayChange: "0.00%",
          monthChange: "0.00%",
          yearChange: "0.00%",
          isPositive: true
        };
    }
  };

  const data = getBlockchainData(blockchainName);

  return (
    <div className="bg-black p-1 h-30 mt-0 lg:w-95 rounded-xl">
      
      
      <div className="px-1 py-1 mb-0">
        <div className="grid grid-cols-2 gap-1">
          
          
          {/* 24H Change */}
          <div className={`rounded-lg p-1 min-w-0 ${
            data.isPositive ? 'bg-green-400/20' : 'bg-red-400/20'
          }`}>
            <h2 className="text-xs font-blod font-mono text-gray-500 truncate">24H</h2>
            <h2 className={`font-sans font-bold text-sm truncate ${
              data.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {data.dayChange}
            </h2>
          </div>
          
          {/* 30D Change */}
          <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
            <h2 className="text-xs font-light font-mono text-gray-500 truncate">30D</h2>
            <h2 className="font-sans font-bold text-sm text-blue-400 truncate">{data.monthChange}</h2>
          </div>
          
          {/* 1Y Change */}
          <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
            <h2 className="text-xs font-light font-mono text-gray-500 truncate">1Y</h2>
            <h2 className="font-sans font-bold text-sm text-blue-400 truncate">{data.yearChange}</h2>
          </div>
          
          
          {/* Volume 24H */}
          <div className="rounded-lg p-2 bg-blue-400/20 min-w-0">
            <h2 className="text-xs font-light font-mono text-gray-500 truncate">Volume</h2>
            <h2 className="font-sans font-bold text-sm text-blue-400 truncate">
              {blockchainName === "Ethereum" ? "$12.8B" : 
               blockchainName === "Polygon" ? "$234.5M" : "$89.2M"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDetails;

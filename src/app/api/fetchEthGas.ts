import dotenv from 'dotenv'
dotenv.config() 

type JsonRpcRequest = {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
};

type JsonRpcResponse = {
  jsonrpc: string;
  id: number;
  result: string;
};

const url = process.env.NODE_URL

export default async function getGasPrice(): Promise<void> {
  const requestBody: JsonRpcRequest = {
    jsonrpc: "2.0",
    method: "eth_gasPrice",
    params: [],
    id: 1
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data: JsonRpcResponse = await response.json();

    if (!data.result) {
      throw new Error("Invalid response from JSON-RPC");
    }

    const gasPriceWei = BigInt(data.result);

    console.log(`🚀Ethereum Gas Price: ${gasPriceWei} Gwei`);
  } catch (error) {
    console.error("❌ Error fetching gas price:", error);
  }
}

getGasPrice();

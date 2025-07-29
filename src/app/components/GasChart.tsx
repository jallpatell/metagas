'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ChartData = {
  name: string;
  uv: number;
  pv: number;
};

const data: ChartData[] = [
  { name: '-15', uv: 8, pv: 8.56 },
  { name: '-14', uv: 9, pv: 8.2 },
  { name: 'Mar', uv: 8.2, pv: 8.45 },
  { name: 'Apr', uv: 9.3, pv: 8.56 },
  { name: 'May', uv: 8, pv: 9.348 },
  { name: 'Jun', uv: 8.7, pv: 9.18 },
  { name: 'Jul', uv: 9.6, pv: 8.9 },
  { name: 'Jan', uv: 8.8, pv: 9.8 },
  { name: 'Feb', uv: 7.9, pv: 8.1 },
  { name: 'Mar', uv: 5.6, pv: 8.5 },
  { name: 'Apr', uv: 4.5, pv: 8.2 },
  { name: 'May', uv: 9.0, pv: 8.9 },
  { name: 'Jun', uv: 7.9, pv: 2.3 },
  { name: 'Jun', uv: 7.9, pv: 2.3 },
  { name: 'Jun', uv: 7.9, pv: 2.3 },
  { name: 'Jun', uv: 7.9, pv: 2.3 },
  { name: 'Jul', uv: 4.5, pv: 8.12 },
  { name: 'Jun', uv: 7.9, pv: 2.3 },
  { name: 'Jan', uv: 8, pv: 3.3 },
  { name: 'Feb', uv: 8, pv: 8.4 },
  { name: 'Mar', uv: 8, pv: 9.1 },
  { name: 'Apr', uv: 8, pv: 8.7 },
];

export default function MyAreaChart() {
  return (
    <ResponsiveContainer width="100%" className=" p-10 " height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="pv"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

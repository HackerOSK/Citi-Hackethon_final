import React from 'react';
import { Bar } from 'recharts';
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const CashFlowChart = () => {
  // Sample data - replace with your actual data
  const transactionFlowData = [
    { month: 'Jan', income: 4000, expenses: 2400 },
    { month: 'Feb', income: 3000, expenses: 1398 },
    { month: 'Mar', income: 2000, expenses: 3800 },
    { month: 'Apr', income: 2780, expenses: 3908 },
    { month: 'May', income: 1890, expenses: 4800 },
    { month: 'Jun', income: 2390, expenses: 3800 },
    { month: 'Jul', income: 3490, expenses: 2300 },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Cash Flow</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transactionFlowData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#cbd5e1' }} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }} 
            />
            <YAxis 
              tick={{ fill: '#cbd5e1' }} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
  contentStyle={{ 
    backgroundColor: '#1e293b', 
    borderColor: '#475569',
    color: '#e2e8f0' 
  }}
  itemStyle={{ color: '#e2e8f0' }}
  formatter={(value, name) => [`$${value}`, name]} // <-- Fix applied
  labelStyle={{ color: '#e2e8f0' }}
/>
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowChart;
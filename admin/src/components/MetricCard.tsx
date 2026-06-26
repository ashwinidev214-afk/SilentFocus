import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function MetricCard({ title, value, icon, description, trend }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
          {icon}
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`font-medium mr-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
          )}
          {description && <span className="text-gray-500">{description}</span>}
        </div>
      )}
    </div>
  );
}

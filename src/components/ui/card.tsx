import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${paddings[padding]} 
      ${hover ? 'hover:shadow-md hover:border-primary-200 transition-all cursor-pointer' : 'shadow-sm'} 
      ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, change }: { label: string; value: string | number; icon?: string; change?: string }) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {change && <span className="text-xs text-green-600">{change} 较上周</span>}
    </Card>
  );
}

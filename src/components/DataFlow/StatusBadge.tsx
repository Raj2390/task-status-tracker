
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'inProgress' | 'completed' | 'failed';
  className?: string;
  pulse?: boolean;
  progress?: number;
}

const StatusBadge = ({ status, className, pulse = true, progress }: StatusBadgeProps) => {
  let color = '';
  let bgColor = '';
  let icon = null;
  let label = '';

  switch (status) {
    case 'inProgress':
      color = 'text-status-inProgress';
      bgColor = 'bg-status-inProgress/10';
      icon = <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />;
      label = progress !== undefined ? `In Progress (${progress}%)` : 'In Progress';
      break;
    case 'completed':
      color = 'text-status-completed';
      bgColor = 'bg-status-completed/10';
      label = 'Completed';
      break;
    case 'failed':
      color = 'text-status-failed';
      bgColor = 'bg-status-failed/10';
      label = 'Failed';
      break;
  }

  return (
    <div 
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        color,
        bgColor,
        pulse && status === 'inProgress' && 'animate-pulse-subtle',
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default StatusBadge;

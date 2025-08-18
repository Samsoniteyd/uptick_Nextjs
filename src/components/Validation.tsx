import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ValidationProps {
  type: 'error' | 'success' | 'info';
  message: string;
  className?: string;
}

export const Validation = ({ type, message, className = '' }: ValidationProps) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className={`${getColorClasses()} ${className} p-3 rounded-md border flex items-start gap-3`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="text-sm">
        {message}
      </div>
    </div>
  );
};
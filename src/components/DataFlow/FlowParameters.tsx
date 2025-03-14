
import { useState, useEffect } from 'react';
import { Flow, FlowParameter, API } from '@/services/api';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface FlowParametersProps {
  flow: Flow;
  onTrigger: (flowId: string, parameters: Record<string, any>) => void;
  className?: string;
}

const FlowParameters = ({ flow, onTrigger, className }: FlowParametersProps) => {
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize parameters with default values
  useEffect(() => {
    const defaultParams: Record<string, any> = {};
    flow.parameters.forEach(param => {
      if (param.default !== undefined) {
        defaultParams[param.id] = param.default;
      }
    });
    setParameters(defaultParams);
  }, [flow]);

  const handleChange = (paramId: string, value: any) => {
    setParameters(prev => ({ ...prev, [paramId]: value }));
    
    // Clear error if value is set
    if (value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[paramId];
        return newErrors;
      });
    }
  };

  const handleDateChange = (paramId: string, date: Date | undefined) => {
    if (date) {
      handleChange(paramId, format(date, 'yyyy-MM-dd'));
    }
  };

  const handleSubmit = () => {
    // Validate required parameters
    const newErrors: Record<string, string> = {};
    
    flow.parameters.forEach(param => {
      if (param.required && !parameters[param.id]) {
        newErrors[param.id] = 'This field is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Trigger the flow with parameters
    onTrigger(flow.id, parameters);
  };

  const renderParameter = (param: FlowParameter) => {
    switch (param.type) {
      case 'text':
        return (
          <Input
            id={param.id}
            value={parameters[param.id] || ''}
            onChange={(e) => handleChange(param.id, e.target.value)}
            className={cn(errors[param.id] && 'border-destructive')}
          />
        );
      
      case 'number':
        return (
          <Input
            id={param.id}
            type="number"
            value={parameters[param.id] || ''}
            onChange={(e) => handleChange(param.id, e.target.value ? Number(e.target.value) : '')}
            className={cn(errors[param.id] && 'border-destructive')}
          />
        );
      
      case 'select':
        return (
          <Select
            value={parameters[param.id] || ''}
            onValueChange={(value) => handleChange(param.id, value)}
          >
            <SelectTrigger className={cn(errors[param.id] && 'border-destructive')}>
              <SelectValue placeholder={`Select ${param.name}`} />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !parameters[param.id] && "text-muted-foreground",
                  errors[param.id] && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {parameters[param.id] ? parameters[param.id] : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={parameters[param.id] ? new Date(parameters[param.id]) : undefined}
                onSelect={(date) => handleDateChange(param.id, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4">
        {flow.parameters.map((param) => (
          <div key={param.id} className="space-y-2">
            <Label htmlFor={param.id}>
              {param.name} {param.required && <span className="text-destructive">*</span>}
            </Label>
            {renderParameter(param)}
            {errors[param.id] && (
              <p className="text-xs text-destructive">{errors[param.id]}</p>
            )}
          </div>
        ))}
      </div>
      
      <Button onClick={handleSubmit} className="w-full">
        Trigger Extraction
      </Button>
    </div>
  );
};

export default FlowParameters;

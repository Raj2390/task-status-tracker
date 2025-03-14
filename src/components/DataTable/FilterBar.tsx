
import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DataFilter } from '@/services/api';

interface FilterBarProps {
  fields: { id: string; label: string }[];
  onApplyFilters: (filters: DataFilter[]) => void;
}

const operators = [
  { id: 'equals', label: 'Equals' },
  { id: 'contains', label: 'Contains' },
  { id: 'gt', label: 'Greater Than' },
  { id: 'lt', label: 'Less Than' },
  { id: 'between', label: 'Between' }
];

const FilterBar = ({ fields, onApplyFilters }: FilterBarProps) => {
  const [filters, setFilters] = useState<DataFilter[]>([]);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [currentOperator, setCurrentOperator] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<string>('');
  
  const handleAddFilter = () => {
    if (!currentField || !currentOperator || !currentValue) return;
    
    const newFilter: DataFilter = {
      field: currentField,
      operator: currentOperator as any,
      value: currentValue
    };
    
    setFilters([...filters, newFilter]);
    setCurrentField(null);
    setCurrentOperator(null);
    setCurrentValue('');
  };
  
  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };
  
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };
  
  const getFieldLabel = (fieldId: string) => {
    return fields.find(field => field.id === fieldId)?.label || fieldId;
  };
  
  const getOperatorLabel = (operatorId: string) => {
    return operators.find(op => op.id === operatorId)?.label || operatorId;
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <div 
            key={index}
            className="flex items-center gap-1.5 py-1 px-2.5 bg-secondary rounded-full text-sm"
          >
            <span className="font-medium">{getFieldLabel(filter.field)}</span>
            <span className="text-muted-foreground">{getOperatorLabel(filter.operator)}</span>
            <span>{filter.value}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => handleRemoveFilter(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="justify-between min-w-32"
            >
              {currentField ? getFieldLabel(currentField) : "Select field"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0">
            <Command>
              <CommandInput placeholder="Search field..." />
              <CommandEmpty>No field found.</CommandEmpty>
              <CommandGroup>
                {fields.map((field) => (
                  <CommandItem
                    key={field.id}
                    value={field.id}
                    onSelect={() => setCurrentField(field.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentField === field.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {field.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="justify-between min-w-32"
              disabled={!currentField}
            >
              {currentOperator ? getOperatorLabel(currentOperator) : "Select operator"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0">
            <Command>
              <CommandInput placeholder="Search operator..." />
              <CommandEmpty>No operator found.</CommandEmpty>
              <CommandGroup>
                {operators.map((op) => (
                  <CommandItem
                    key={op.id}
                    value={op.id}
                    onSelect={() => setCurrentOperator(op.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentOperator === op.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {op.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Input
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          placeholder="Value"
          className="max-w-28 h-9"
          disabled={!currentOperator}
        />
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddFilter}
          disabled={!currentField || !currentOperator || !currentValue}
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Filter
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleApplyFilters}
          disabled={filters.length === 0}
          className="h-9 ml-auto"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

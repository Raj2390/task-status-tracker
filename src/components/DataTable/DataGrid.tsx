
import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  format?: (value: any) => React.ReactNode;
}

interface DataGridProps {
  data: any[];
  columns: Column[];
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

const DataGrid = ({ data, columns, className }: DataGridProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Handle sort
  const handleSort = (columnId: string) => {
    // If clicking on the same column
    if (sortColumn === columnId) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      // New column, start with ascending
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };
  
  // Sort data
  const sortedData = [...data];
  if (sortColumn && sortDirection) {
    sortedData.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      
      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      // Handle number comparison
      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }
  
  // Render sort icon
  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="ml-1 h-4 w-4" />;
    }
    return <ChevronDown className="ml-1 h-4 w-4" />;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Data Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto rounded-md border">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.id}
                    className="border-b px-4 py-3 text-left font-medium text-muted-foreground"
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.id)}
                        className="h-auto p-0 font-medium"
                      >
                        {column.label}
                        {renderSortIcon(column.id)}
                      </Button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                    No data available
                  </td>
                </tr>
              ) : (
                sortedData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50",
                      rowIndex % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                    )}
                  >
                    {columns.map((column) => (
                      <td 
                        key={`${rowIndex}-${column.id}`}
                        className="px-4 py-3"
                      >
                        {column.format 
                          ? column.format(row[column.id]) 
                          : row[column.id]?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataGrid;

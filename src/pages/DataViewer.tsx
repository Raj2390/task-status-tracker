
import { useState, useEffect } from 'react';
import { API, Flow, DataFilter } from '@/services/api';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterBar from '@/components/DataTable/FilterBar';
import DataGrid from '@/components/DataTable/DataGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Database, Filter, TableProperties } from 'lucide-react';

const DataViewer = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [viewType, setViewType] = useState<'table' | 'cards'>('table');
  
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const flowsData = await API.getFlows();
        setFlows(flowsData);
        
        // Auto-select the first flow if available
        if (flowsData.length > 0 && !selectedFlowId) {
          setSelectedFlowId(flowsData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch flows:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlows();
  }, []);
  
  useEffect(() => {
    if (selectedFlowId) {
      fetchData();
    }
  }, [selectedFlowId]);
  
  const fetchData = async (filters?: DataFilter[]) => {
    if (!selectedFlowId) return;
    
    setDataLoading(true);
    try {
      const extractedData = await API.getExtractedData(selectedFlowId, filters);
      setData(extractedData);
      
      // Dynamically determine columns from the first data item
      if (extractedData.length > 0) {
        const firstItem = extractedData[0];
        const cols = Object.keys(firstItem).map(key => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          sortable: true
        }));
        setColumns(cols);
      } else {
        setColumns([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setDataLoading(false);
    }
  };
  
  const handleApplyFilters = (filters: DataFilter[]) => {
    fetchData(filters);
  };
  
  // Generate filter fields based on columns
  const filterFields = columns.map(col => ({
    id: col.id,
    label: col.label
  }));

  return (
    <PageTransition>
      <div className="container py-8 px-4 w-full max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Data Viewer</h1>
          <p className="text-lg text-muted-foreground mt-2">
            View and filter extracted data
          </p>
        </header>
        
        <div className="mb-8">
          <GlassCard className="mb-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="max-w-md space-y-1">
                <label className="text-sm font-medium">Select Data Source</label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={selectedFlowId || ''}
                    onValueChange={setSelectedFlowId}
                  >
                    <SelectTrigger className="w-full md:w-72">
                      <SelectValue placeholder="Select a data flow" />
                    </SelectTrigger>
                    <SelectContent>
                      {flows.map(flow => (
                        <SelectItem key={flow.id} value={flow.id}>
                          {flow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Tabs 
                  value={viewType} 
                  onValueChange={(value) => setViewType(value as 'table' | 'cards')}
                >
                  <TabsList>
                    <TabsTrigger value="table">
                      <TableProperties className="h-4 w-4 mr-2" />
                      Table
                    </TabsTrigger>
                    <TabsTrigger value="cards">
                      <Database className="h-4 w-4 mr-2" />
                      Cards
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </GlassCard>
          
          {selectedFlowId && columns.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
                <CardDescription>
                  Filter the data to find specific information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FilterBar fields={filterFields} onApplyFilters={handleApplyFilters} />
              </CardContent>
            </Card>
          )}
        </div>
        
        {dataLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : (
          <>
            {!selectedFlowId ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Database className="h-16 w-16 text-muted stroke-1 mb-4" />
                <h3 className="text-xl font-medium">Select a data source</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Choose a data flow from the dropdown above to view extracted data
                </p>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <TableProperties className="h-16 w-16 text-muted stroke-1 mb-4" />
                <h3 className="text-xl font-medium">No data available</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  There is no data available for this flow. Try running an extraction first.
                </p>
              </div>
            ) : (
              <>
                {viewType === 'table' ? (
                  <DataGrid data={data} columns={columns} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((item, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            {columns.map(column => (
                              <div key={column.id} className="mb-3 last:mb-0">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  {column.label}
                                </h4>
                                <p className="text-lg">
                                  {item[column.id]?.toString() || '-'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DataViewer;

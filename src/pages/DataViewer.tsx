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
import { Database, Filter, TableProperties, FolderOpen, ChevronRight } from 'lucide-react';
import DataTreeNav from '@/components/DataTree/DataTreeNav';
import { cn } from '@/lib/utils';

const DataViewer = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [viewType, setViewType] = useState<'table' | 'cards'>('table');
  const [selectedLevel1, setSelectedLevel1] = useState<string | null>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<string | null>(null);
  const [expandedTree, setExpandedTree] = useState(true);
  
  window.handleTreeSelection = (level1: string, level2: string) => {
    setSelectedLevel1(level1);
    setSelectedLevel2(level2);
  };

  const toggleTree = () => {
    setExpandedTree(!expandedTree);
  };
  
  const handleTreeSelect = (level1: string, level2: string) => {
    setSelectedLevel1(level1);
    setSelectedLevel2(level2);
  };
  
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const flowsData = await API.getFlows();
        setFlows(flowsData);
        
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
    if (selectedFlowId && selectedLevel1 && selectedLevel2) {
      fetchDataWithLevels();
    } else if (selectedFlowId) {
      fetchData();
    }
  }, [selectedFlowId, selectedLevel1, selectedLevel2]);
  
  const fetchData = async (filters?: DataFilter[]) => {
    if (!selectedFlowId) return;
    
    setDataLoading(true);
    try {
      const extractedData = await API.getExtractedData(selectedFlowId, filters);
      setData(extractedData);
      
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

  const fetchDataWithLevels = async (filters?: DataFilter[]) => {
    if (!selectedFlowId || !selectedLevel1 || !selectedLevel2) return;
    
    setDataLoading(true);
    try {
      console.log(`Fetching data with level1=${selectedLevel1} and level2=${selectedLevel2}`);
      
      const levelFilters: DataFilter[] = [
        { field: 'level1', value: selectedLevel1, operator: 'equals' },
        { field: 'level2', value: selectedLevel2, operator: 'equals' }
      ];
      
      const combinedFilters = filters ? [...filters, ...levelFilters] : levelFilters;
      const extractedData = await API.getExtractedData(selectedFlowId, combinedFilters);
      setData(extractedData);
      
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
      console.error('Failed to fetch data with levels:', error);
    } finally {
      setDataLoading(false);
    }
  };
  
  const handleApplyFilters = (filters: DataFilter[]) => {
    if (selectedLevel1 && selectedLevel2) {
      fetchDataWithLevels(filters);
    } else {
      fetchData(filters);
    }
  };
  
  const filterFields = columns.map(col => ({
    id: col.id,
    label: col.label
  }));

  return (
    <PageTransition>
      <div className="container py-8 px-4 w-full max-w-7xl mx-auto">
        <header className="mb-6">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <FolderOpen className="h-5 w-5 mr-2" />
                  Data Categories
                </CardTitle>
                <CardDescription>
                  Browse available categories
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTreeNav onSelect={handleTreeSelect} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              {selectedFlowId && columns.length > 0 ? (
                <>
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
                </>
              ) : (
                <CardContent className="py-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Filter className="h-10 w-10 text-muted stroke-1 mb-3" />
                    <h3 className="text-lg font-medium">Select a data source</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      Choose a data flow from the dropdown above to view filtering options
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
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
                  There is no data available for this flow. Try running an extraction first or selecting different categories.
                </p>
                {selectedLevel1 && selectedLevel2 && (
                  <div className="mt-2 px-4 py-2 bg-muted rounded-md">
                    <p className="text-sm">Currently viewing: <span className="font-medium">{selectedLevel1} &gt; {selectedLevel2}</span></p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {selectedLevel1 && selectedLevel2 && (
                  <div className="mb-4 px-4 py-2 bg-muted rounded-md inline-block">
                    <p className="text-sm">Currently viewing: <span className="font-medium">{selectedLevel1} &gt; {selectedLevel2}</span></p>
                  </div>
                )}
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

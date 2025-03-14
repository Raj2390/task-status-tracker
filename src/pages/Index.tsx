
import { useEffect, useState } from 'react';
import { API, Flow, FlowRun } from '@/services/api';
import { useFlowStatus } from '@/hooks/useFlowStatus';
import FlowCard from '@/components/DataFlow/FlowCard';
import { GlassCard } from '@/components/ui/GlassCard';
import StatusBadge from '@/components/DataFlow/StatusBadge';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, CheckCircle, Database, XCircle } from 'lucide-react';

const Index = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const { flowRuns } = useFlowStatus();
  
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const data = await API.getFlows();
        setFlows(data);
      } catch (error) {
        console.error('Failed to fetch flows:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlows();
  }, []);
  
  // Count flow runs by status
  const statusCounts = {
    inProgress: flowRuns.filter(run => run.status === 'inProgress').length,
    completed: flowRuns.filter(run => run.status === 'completed').length,
    failed: flowRuns.filter(run => run.status === 'failed').length,
    total: flowRuns.length
  };
  
  // Get recent runs
  const recentRuns = [...flowRuns].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  ).slice(0, 5);

  return (
    <PageTransition>
      <div className="container py-8 px-4 w-full max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Data Extraction Manager</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Configure, trigger, and monitor your data extraction flows
          </p>
        </header>
        
        {/* Dashboard stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="flex items-center">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 mr-4">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Extractions</p>
              <h3 className="text-2xl font-bold">{statusCounts.inProgress}</h3>
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-status-completed/10 mr-4">
              <CheckCircle className="h-6 w-6 text-status-completed" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Successful Extractions</p>
              <h3 className="text-2xl font-bold">{statusCounts.completed}</h3>
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-status-failed/10 mr-4">
              <XCircle className="h-6 w-6 text-status-failed" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed Extractions</p>
              <h3 className="text-2xl font-bold">{statusCounts.failed}</h3>
            </div>
          </GlassCard>
        </div>
        
        <Tabs defaultValue="flows" className="w-full">
          <TabsList>
            <TabsTrigger value="flows">
              <Database className="h-4 w-4 mr-2" /> 
              Extraction Flows
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Activity className="h-4 w-4 mr-2" /> 
              Recent Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="flows" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <Card key={i} className="w-full min-h-64 animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-2/3 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-full bg-muted rounded opacity-50"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-full bg-muted rounded opacity-25 mb-2"></div>
                      <div className="h-4 w-2/3 bg-muted rounded opacity-25"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                flows.map(flow => (
                  <FlowCard key={flow.id} flow={flow} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Extraction Activity</CardTitle>
                <CardDescription>
                  Latest status updates from your data extraction flows
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentRuns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Database className="h-12 w-12 text-muted stroke-1 mb-3" />
                    <h3 className="text-lg font-medium">No extraction history yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Trigger a flow extraction to see activity here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentRuns.map((run) => {
                      // Find the flow name
                      const flow = flows.find(f => f.id === run.flowId);
                      
                      return (
                        <div key={run.id} className="flex flex-col p-4 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{flow?.name || 'Unknown Flow'}</h4>
                              <div className="flex items-center mt-1">
                                <StatusBadge status={run.status} />
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(run.startTime).toLocaleString()}
                            </div>
                          </div>
                          
                          {run.status === 'inProgress' && run.progress !== undefined && (
                            <div className="mt-3">
                              <Progress value={run.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1 text-right">
                                {run.progress}% complete
                              </p>
                            </div>
                          )}
                          
                          {run.status === 'failed' && run.error && (
                            <div className="mt-3">
                              <p className="text-xs text-destructive">
                                Error: {run.error}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Index;

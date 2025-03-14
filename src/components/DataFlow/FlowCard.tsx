
import { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock, Play } from 'lucide-react';
import { Flow, FlowRun, API } from '@/services/api';
import StatusBadge from './StatusBadge';
import FlowParameters from './FlowParameters';
import { useFlowStatus } from '@/hooks/useFlowStatus';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface FlowCardProps {
  flow: Flow;
  className?: string;
}

const FlowCard = ({ flow, className }: FlowCardProps) => {
  const [parametersOpen, setParametersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [latestRunId, setLatestRunId] = useState<string | null>(null);

  // Get flow runs for this specific flow
  const { flowRuns } = useFlowStatus();
  const flowHistory = flowRuns.filter(run => run.flowId === flow.id);
  
  const handleTriggerFlow = useCallback(async (flowId: string, parameters: Record<string, any>) => {
    try {
      const run = await API.triggerFlow(flowId, parameters);
      setLatestRunId(run.id);
      setParametersOpen(false);
      setHistoryOpen(true);
    } catch (error) {
      console.error('Failed to trigger flow:', error);
    }
  }, []);

  return (
    <Card className={cn("w-full overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{flow.name}</CardTitle>
            <CardDescription className="mt-1.5">{flow.description}</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 h-8"
            onClick={() => setParametersOpen(!parametersOpen)}
          >
            <Play className="h-4 w-4 mr-1" /> 
            Run
          </Button>
        </div>
      </CardHeader>
      
      <Collapsible open={parametersOpen} onOpenChange={setParametersOpen}>
        <CollapsibleContent className="px-6 pt-2 pb-4 border-t border-border/50">
          <FlowParameters flow={flow} onTrigger={handleTriggerFlow} />
        </CollapsibleContent>
      </Collapsible>
      
      <CardFooter className="flex-col items-start pt-3 pb-4 px-6">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> 
            Last run: {flowHistory.length > 0 
              ? formatDistanceToNow(new Date(flowHistory[0].startTime), { addSuffix: true }) 
              : 'Never'}
          </div>
          
          {flowHistory.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setHistoryOpen(!historyOpen)}
              className="h-7 px-2"
            >
              History {historyOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
            </Button>
          )}
        </div>
        
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="w-full">
          <CollapsibleContent className="pt-3 w-full">
            <div className="space-y-2 w-full">
              {flowHistory.slice(0, 5).map((run) => (
                <div key={run.id} className="flex justify-between items-center py-2 px-3 bg-muted/50 rounded-md text-sm">
                  <div className="flex items-center">
                    <StatusBadge status={run.status} progress={run.progress} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(run.startTime), { addSuffix: true })}
                  </div>
                </div>
              ))}
              
              {flowHistory.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Show more
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};

export default FlowCard;

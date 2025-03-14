import { toast } from "sonner";

// Types for our API
export interface FlowParameter {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  required: boolean;
  default?: string | number;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  parameters: FlowParameter[];
}

export interface FlowRun {
  id: string;
  flowId: string;
  status: 'inProgress' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  parameters: Record<string, any>;
  error?: string;
  progress?: number;
}

export interface DataFilter {
  field: string;
  value: string | number | boolean;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
}

// Simulated API endpoints
// In a real scenario, these would make fetch/axios calls to backend APIs

// Mock data for flows
const mockFlows: Flow[] = [
  {
    id: 'flow-1',
    name: 'Customer Data Extraction',
    description: 'Extract customer data from the CRM system',
    parameters: [
      { id: 'param-1', name: 'Date Range', type: 'select', options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom'], required: true, default: 'Last 30 days' },
      { id: 'param-2', name: 'Customer Segment', type: 'select', options: ['All', 'Premium', 'Standard', 'Basic'], required: true, default: 'All' },
      { id: 'param-3', name: 'Include Deleted', type: 'select', options: ['Yes', 'No'], required: false, default: 'No' }
    ]
  },
  {
    id: 'flow-2',
    name: 'Sales Analytics Extraction',
    description: 'Extract sales data for analytics',
    parameters: [
      { id: 'param-1', name: 'Start Date', type: 'date', required: true },
      { id: 'param-2', name: 'End Date', type: 'date', required: true },
      { id: 'param-3', name: 'Region', type: 'select', options: ['Global', 'North America', 'Europe', 'Asia', 'Other'], required: true, default: 'Global' }
    ]
  },
  {
    id: 'flow-3',
    name: 'Inventory Analysis',
    description: 'Extract and analyze inventory data',
    parameters: [
      { id: 'param-1', name: 'Warehouse', type: 'select', options: ['All', 'North', 'South', 'East', 'West'], required: true, default: 'All' },
      { id: 'param-2', name: 'Product Category', type: 'text', required: false },
      { id: 'param-3', name: 'Min Stock Level', type: 'number', required: false }
    ]
  }
];

// Keep track of flow runs in memory (in real app, this would be server-side)
let mockFlowRuns: FlowRun[] = [];

// Mock data for extracted data
const mockExtractedData = {
  'flow-1': [
    { id: 1, name: 'John Doe', email: 'john@example.com', segment: 'Premium', lastPurchase: '2023-05-15', totalSpent: 1250 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', segment: 'Standard', lastPurchase: '2023-06-20', totalSpent: 450 },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', segment: 'Premium', lastPurchase: '2023-04-10', totalSpent: 2800 },
    // ... more data
  ],
  'flow-2': [
    { id: 1, date: '2023-05-01', product: 'Product A', quantity: 120, revenue: 5400, region: 'North America' },
    { id: 2, date: '2023-05-15', product: 'Product B', quantity: 85, revenue: 4250, region: 'Europe' },
    { id: 3, date: '2023-06-01', product: 'Product C', quantity: 200, revenue: 8000, region: 'Asia' },
    // ... more data
  ],
  'flow-3': [
    { id: 1, product: 'Widget X', category: 'Electronics', warehouse: 'North', quantity: 532, reorderPoint: 100 },
    { id: 2, product: 'Widget Y', category: 'Home Goods', warehouse: 'South', quantity: 350, reorderPoint: 75 },
    { id: 3, product: 'Widget Z', category: 'Office Supplies', warehouse: 'East', quantity: 125, reorderPoint: 50 },
    // ... more data
  ]
};

// API class
export class API {
  static async getFlows(): Promise<Flow[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFlows];
  }

  static async getFlow(id: string): Promise<Flow | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFlows.find(flow => flow.id === id);
  }

  static async triggerFlow(flowId: string, parameters: Record<string, any>): Promise<FlowRun> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const flow = await this.getFlow(flowId);
    if (!flow) {
      throw new Error('Flow not found');
    }
    
    // Create a new flow run
    const flowRun: FlowRun = {
      id: `run-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      flowId,
      status: 'inProgress',
      startTime: new Date().toISOString(),
      parameters,
      progress: 0
    };
    
    mockFlowRuns.push(flowRun);
    
    // In a real app, this would call a backend API endpoint
    console.log(`Triggered flow ${flow.name} with parameters:`, parameters);
    toast.success(`Started "${flow.name}" extraction`);
    
    // Simulate background progress (in a real app, this would be server-side)
    this.simulateProgress(flowRun.id);
    
    return flowRun;
  }

  static async getFlowRuns(): Promise<FlowRun[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFlowRuns].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  static async getFlowRun(runId: string): Promise<FlowRun | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFlowRuns.find(run => run.id === runId);
  }

  static async getExtractedData(flowId: string, filters?: DataFilter[]): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get the mock data for this flow
    const data = mockExtractedData[flowId as keyof typeof mockExtractedData] || [];
    
    // Apply filters if provided
    if (filters && filters.length > 0) {
      return data.filter(item => {
        return filters.every(filter => {
          const fieldValue = item[filter.field];
          
          switch (filter.operator) {
            case 'equals':
              return fieldValue === filter.value;
            case 'contains':
              return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'gt':
              return fieldValue > filter.value;
            case 'lt':
              return fieldValue < filter.value;
            case 'between':
              // Assuming filter.value is a string with format "min,max"
              if (typeof filter.value === 'string') {
                const [min, max] = filter.value.split(',').map(Number);
                return fieldValue >= min && fieldValue <= max;
              }
              return true;
            default:
              return true;
          }
        });
      });
    }
    
    return data;
  }

  private static simulateProgress(runId: string): void {
    const run = mockFlowRuns.find(r => r.id === runId);
    if (!run) return;

    const updateInterval = setInterval(() => {
      const runIndex = mockFlowRuns.findIndex(r => r.id === runId);
      if (runIndex === -1) {
        clearInterval(updateInterval);
        return;
      }

      const currentRun = mockFlowRuns[runIndex];
      
      // Update progress
      if (currentRun.progress === undefined) {
        currentRun.progress = 0;
      }
      
      currentRun.progress += Math.floor(Math.random() * 15) + 5;
      
      if (currentRun.progress >= 100) {
        currentRun.progress = 100;
        
        // Simulate success with 90% probability, failure with 10%
        if (Math.random() < 0.9) {
          currentRun.status = 'completed';
        } else {
          currentRun.status = 'failed';
          currentRun.error = 'Simulated random failure';
        }
        
        currentRun.endTime = new Date().toISOString();
        clearInterval(updateInterval);
        
        // Show toast notification for completion
        if (currentRun.status === 'completed') {
          toast.success(`"${mockFlows.find(f => f.id === currentRun.flowId)?.name}" extraction completed`);
        } else {
          toast.error(`"${mockFlows.find(f => f.id === currentRun.flowId)?.name}" extraction failed: ${currentRun.error}`);
        }
      }
      
      // Update the run in the array
      mockFlowRuns[runIndex] = { ...currentRun };
    }, 1500);
  }
}

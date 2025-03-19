
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

// Mock data for hierarchical categories
const mockCategoryData = {
  'Sales Data': {
    'Quarterly Reports': [
      { id: 1, reportName: 'Q1 2023', revenue: 125000, growth: '5.2%', topProduct: 'Product A' },
      { id: 2, reportName: 'Q2 2023', revenue: 142000, growth: '13.6%', topProduct: 'Product B' },
      { id: 3, reportName: 'Q3 2023', revenue: 138000, growth: '-2.8%', topProduct: 'Product A' }
    ],
    'Annual Reports': [
      { id: 1, reportName: 'Annual 2022', revenue: 510000, growth: '12.1%', departments: 5, highlights: 'Regional expansion' },
      { id: 2, reportName: 'Annual 2021', revenue: 455000, growth: '8.3%', departments: 4, highlights: 'New product line' }
    ],
    'Sales Forecasts': [
      { id: 1, quarter: 'Q4 2023', projectedRevenue: 150000, confidence: '85%', keyFactors: 'Holiday season' },
      { id: 2, quarter: 'Q1 2024', projectedRevenue: 130000, confidence: '72%', keyFactors: 'New product launch' }
    ]
  },
  'Customer Data': {
    'Customer Profiles': [
      { id: 1, segment: 'Enterprise', avgSpend: 75000, retention: '92%', growthOpportunity: 'Upselling' },
      { id: 2, segment: 'SMB', avgSpend: 12000, retention: '78%', growthOpportunity: 'Service packages' },
      { id: 3, segment: 'Startup', avgSpend: 3000, retention: '65%', growthOpportunity: 'Education' }
    ],
    'Demographics': [
      { id: 1, region: 'North America', customers: 1200, avgAge: 42, topIndustry: 'Technology' },
      { id: 2, region: 'Europe', customers: 850, avgAge: 39, topIndustry: 'Finance' },
      { id: 3, region: 'Asia', customers: 650, avgAge: 35, topIndustry: 'Manufacturing' }
    ],
    'Customer Feedback': [
      { id: 1, source: 'Survey', sentiment: 'Positive', score: 4.2, topRequest: 'Mobile features' },
      { id: 2, source: 'Support tickets', sentiment: 'Neutral', score: 3.1, topRequest: 'Documentation' },
      { id: 3, source: 'Social media', sentiment: 'Mixed', score: 3.8, topRequest: 'Integrations' }
    ]
  },
  'Product Data': {
    'Inventory Status': [
      { id: 1, product: 'Product A', stock: 521, reorderPoint: 100, supplier: 'Supplier X' },
      { id: 2, product: 'Product B', stock: 283, reorderPoint: 75, supplier: 'Supplier Y' },
      { id: 3, product: 'Product C', stock: 56, reorderPoint: 50, supplier: 'Supplier Z' }
    ],
    'Product Performance': [
      { id: 1, product: 'Product A', monthlySales: 320, returns: '2.1%', satisfaction: '94%' },
      { id: 2, product: 'Product B', monthlySales: 150, returns: '4.5%', satisfaction: '87%' },
      { id: 3, product: 'Product C', monthlySales: 90, returns: '1.2%', satisfaction: '96%' }
    ],
    'Product Lifecycle': [
      { id: 1, product: 'Product A', stage: 'Maturity', monthsActive: 18, nextAction: 'Feature enhancement' },
      { id: 2, product: 'Product B', stage: 'Growth', monthsActive: 8, nextAction: 'Market expansion' },
      { id: 3, product: 'Product D', stage: 'Introduction', monthsActive: 2, nextAction: 'User feedback' }
    ]
  }
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
    
    // Check if this is a level-based query
    const level1Filter = filters?.find(f => f.field === 'level1');
    const level2Filter = filters?.find(f => f.field === 'level2');
    
    if (level1Filter?.value && level2Filter?.value) {
      // Return category-based data
      const level1 = level1Filter.value.toString();
      const level2 = level2Filter.value.toString();
      
      // Check if we have data for these categories
      if (mockCategoryData[level1] && mockCategoryData[level1][level2]) {
        return mockCategoryData[level1][level2];
      }
      
      // If no specific category data, return empty array
      return [];
    }
    
    // Get the mock data for this flow (original behavior)
    const data = mockExtractedData[flowId as keyof typeof mockExtractedData] || [];
    
    // Apply filters if provided
    if (filters && filters.length > 0) {
      return data.filter(item => {
        return filters.every(filter => {
          // Skip our special level filters
          if (filter.field === 'level1' || filter.field === 'level2') {
            return true;
          }
          
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

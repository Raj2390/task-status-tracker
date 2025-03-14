
import { GlassCard } from '@/components/ui/GlassCard';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Filter, HelpCircle, Link, Settings, User } from 'lucide-react';

const About = () => {
  return (
    <PageTransition>
      <div className="container py-8 px-4 w-full max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">About</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Learn more about the DataFlow Manager application
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <GlassCard className="flex flex-col">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Data Extraction</h2>
            <p className="text-muted-foreground">
              The DataFlow Manager allows you to configure, trigger, and monitor data extraction processes. 
              Each extraction can be customized with specific parameters to suit your needs.
            </p>
          </GlassCard>
          
          <GlassCard className="flex flex-col">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Real-time Monitoring</h2>
            <p className="text-muted-foreground">
              Monitor the progress and status of your data extraction flows in real-time. 
              The system provides detailed status updates and notifications for each process.
            </p>
          </GlassCard>
        </div>
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Overview of the data extraction workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-secondary w-16 h-16 flex items-center justify-center mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">1. Configure</h3>
                <p className="text-sm text-muted-foreground">
                  Select a data flow and configure the necessary parameters such as date ranges, 
                  data sources, and filtering options.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-secondary w-16 h-16 flex items-center justify-center mb-4">
                  <Link className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">2. Extract</h3>
                <p className="text-sm text-muted-foreground">
                  Trigger the extraction process, which connects to your data sources and retrieves 
                  information based on your configuration.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-secondary w-16 h-16 flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">3. Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Once extraction is complete, view and analyze your data with filtering options 
                  and visualization tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>
                Common questions about the DataFlow Manager
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  What types of data can I extract?
                </h3>
                <p className="text-muted-foreground">
                  The system supports extraction from various data sources including databases, APIs, 
                  file systems, and web services. Each flow is pre-configured for specific data sources.
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  How long do extractions typically take?
                </h3>
                <p className="text-muted-foreground">
                  Extraction times vary based on the data volume and source complexity. 
                  Small to medium extractions typically complete within minutes, while larger 
                  operations may take longer.
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Can I schedule recurring extractions?
                </h3>
                <p className="text-muted-foreground">
                  Scheduled extractions will be available in a future update. Currently, 
                  all extractions must be triggered manually.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>
                Need help with the DataFlow Manager?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Support Team
                </h3>
                <p className="text-muted-foreground">
                  Our support team is available to help with any questions or issues 
                  you may have with the DataFlow Manager.
                </p>
                <p className="mt-2">
                  <a href="mailto:support@dataflow.example.com" className="text-primary hover:underline">
                    support@dataflow.example.com
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Documentation
                </h3>
                <p className="text-muted-foreground">
                  Comprehensive documentation is available in our knowledge base, 
                  including tutorials, API references, and troubleshooting guides.
                </p>
                <p className="mt-2">
                  <a href="#" className="text-primary hover:underline">
                    View Documentation
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;

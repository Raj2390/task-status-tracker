
import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

// Mock data for the tree structure
const treeData = [
  {
    id: 'sales',
    label: 'Sales Data',
    children: [
      { id: 'quarterly', label: 'Quarterly Reports' },
      { id: 'annual', label: 'Annual Reports' },
      { id: 'forecasts', label: 'Sales Forecasts' }
    ]
  },
  {
    id: 'customers',
    label: 'Customer Data',
    children: [
      { id: 'profiles', label: 'Customer Profiles' },
      { id: 'demographics', label: 'Demographics' },
      { id: 'feedback', label: 'Customer Feedback' }
    ]
  },
  {
    id: 'products',
    label: 'Product Data',
    children: [
      { id: 'inventory', label: 'Inventory Status' },
      { id: 'performance', label: 'Product Performance' },
      { id: 'lifecycle', label: 'Product Lifecycle' }
    ]
  }
];

interface DataTreeNavProps {
  onSelect: (level1: string, level2: string) => void;
}

const DataTreeNav = ({ onSelect }: DataTreeNavProps) => {
  const [selectedLevel1, setSelectedLevel1] = useState<string | null>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<string | null>(null);
  const [expandedLevel1, setExpandedLevel1] = useState<string | null>(null);
  const location = useLocation();

  // Reset selections when navigating away from DataViewer page
  useEffect(() => {
    if (location.pathname !== '/data-viewer') {
      setSelectedLevel1(null);
      setSelectedLevel2(null);
    }
  }, [location.pathname]);

  const handleLevel1Click = (level1Id: string) => {
    setExpandedLevel1(expandedLevel1 === level1Id ? null : level1Id);
    setSelectedLevel1(level1Id);
  };

  const handleLevel2Click = (level1Id: string, level2Id: string) => {
    // Find the corresponding labels
    const level1Item = treeData.find(item => item.id === level1Id);
    const level2Item = level1Item?.children.find(child => child.id === level2Id);
    
    const level1Label = level1Item?.label || level1Id;
    const level2Label = level2Item?.label || level2Id;
    
    // Update local state
    setSelectedLevel1(level1Id);
    setSelectedLevel2(level2Id);
    
    // Notify parent component
    onSelect(level1Label, level2Label);
    
    // Also notify the DataViewer component via global handler
    if (window.handleTreeSelection) {
      console.log(`Triggering global handler with: ${level1Label} > ${level2Label}`);
      window.handleTreeSelection(level1Label, level2Label);
    }
  };

  return (
    <div className="text-sm">
      <Accordion
        type="single"
        collapsible
        value={expandedLevel1 || undefined}
        className="space-y-1"
      >
        {treeData.map((level1) => (
          <AccordionItem key={level1.id} value={level1.id} className="border-0">
            <AccordionTrigger 
              onClick={() => handleLevel1Click(level1.id)}
              className={cn(
                "py-1.5 px-2 rounded-md hover:bg-muted text-sm font-medium flex",
                selectedLevel1 === level1.id && "bg-muted"
              )}
            >
              <span className="flex items-center">
                <FolderOpen className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                {level1.label}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-2 pt-1">
              <ul className="space-y-1">
                {level1.children.map((level2) => (
                  <li key={level2.id}>
                    <button
                      onClick={() => handleLevel2Click(level1.id, level2.id)}
                      className={cn(
                        "py-1 px-2 rounded-md hover:bg-muted text-xs w-full text-left flex items-center",
                        selectedLevel1 === level1.id && selectedLevel2 === level2.id && 
                          "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <FileText className="h-3 w-3 mr-1.5 text-muted-foreground" />
                      {level2.label}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default DataTreeNav;

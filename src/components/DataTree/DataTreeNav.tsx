
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleLevel1Click = (level1Id: string) => {
    setExpandedLevel1(expandedLevel1 === level1Id ? null : level1Id);
    setSelectedLevel1(level1Id);
  };

  const handleLevel2Click = (level1Id: string, level2Id: string) => {
    setSelectedLevel1(level1Id);
    setSelectedLevel2(level2Id);
    
    // Get the labels instead of IDs for display purposes
    const level1Item = treeData.find(item => item.id === level1Id);
    const level2Item = level1Item?.children.find(child => child.id === level2Id);
    
    // Notify both local component and global handler
    onSelect(level1Item?.label || level1Id, level2Item?.label || level2Id);
    
    // Also notify the DataViewer component
    if (window.handleTreeSelection) {
      window.handleTreeSelection(level1Item?.label || level1Id, level2Item?.label || level2Id);
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
                          "bg-primary/10 text-primary font-medium" // Changed from bg-muted to bg-primary/10 and added text-primary
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

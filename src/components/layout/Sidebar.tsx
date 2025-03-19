
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Database, BarChart3, Info, 
  ChevronRight, ChevronLeft, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DataTreeNav from '../DataTree/DataTreeNav';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dataViewerExpanded, setDataViewerExpanded] = useState(false);
  const location = useLocation();
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto expand Data Viewer submenu when on the data-viewer page
  useEffect(() => {
    if (location.pathname === '/data-viewer') {
      setDataViewerExpanded(true);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDataViewer = () => {
    setDataViewerExpanded(!dataViewerExpanded);
  };

  const handleCategorySelect = (level1: string, level2: string) => {
    // Notify the DataViewer component if it's listening
    if (window.handleTreeSelection) {
      window.handleTreeSelection(level1, level2);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-full bg-sidebar text-sidebar-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground z-20 transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!collapsed && (
              <div className="animate-fade-in flex items-center">
                <Database size={24} className="text-sidebar-primary mr-2" />
                <h1 className="font-semibold text-lg text-sidebar-foreground">DataFlow</h1>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 ml-auto rounded-full hover:bg-sidebar-accent transition-colors duration-200"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav items */}
          <nav className="py-4 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center py-2 px-4 text-sm transition-all duration-200",
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <item.icon 
                        size={20} 
                        className={cn(
                          "transition-all duration-200",
                          isActive ? "text-sidebar-primary" : "text-sidebar-foreground",
                          !collapsed && "mr-3"
                        )} 
                      />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
              
              {/* Data Viewer with submenu */}
              <li>
                <div className="flex flex-col">
                  <div 
                    className={cn(
                      "flex items-center py-2 px-4 text-sm transition-all duration-200 cursor-pointer",
                      location.pathname === '/data-viewer' 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Link
                      to="/data-viewer"
                      className="flex items-center flex-1"
                    >
                      <Database 
                        size={20} 
                        className={cn(
                          "transition-all duration-200",
                          location.pathname === '/data-viewer' ? "text-sidebar-primary" : "text-sidebar-foreground",
                          !collapsed && "mr-3"
                        )} 
                      />
                      {!collapsed && <span>Data Viewer</span>}
                    </Link>
                    {!collapsed && (
                      <button 
                        onClick={toggleDataViewer}
                        className="ml-auto text-sidebar-foreground"
                      >
                        <ChevronDown 
                          size={16} 
                          className={cn(
                            "transition-transform",
                            dataViewerExpanded ? "rotate-180" : ""
                          )}
                        />
                      </button>
                    )}
                  </div>
                  
                  {/* Data Categories Tree Menu */}
                  {!collapsed && dataViewerExpanded && (
                    <div className="ml-6 mt-1 pl-2 border-l border-sidebar-border">
                      <div className="text-xs font-medium text-sidebar-foreground/70 mb-1 ml-2">
                        Data Categories
                      </div>
                      <DataTreeNav onSelect={handleCategorySelect} />
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto p-4 border-t border-sidebar-border">
            {!collapsed && (
              <div className="text-xs text-sidebar-foreground/70 animate-fade-in">
                <p>DataFlow Manager v1.0</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

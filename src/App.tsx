
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Index from "./pages/Index";
import DataViewer from "./pages/DataViewer";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PageTransition from "@/components/layout/PageTransition";
import Chat from "./pages/Chat";
import ChatButton from "@/components/layout/ChatButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <div className="min-h-screen flex w-full bg-pattern">
          <Sidebar />
          <main className="flex-1 pl-0 lg:pl-[20%] transition-all duration-300">
            <div className="min-h-screen">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                  <Route path="/data-viewer" element={<PageTransition><DataViewer /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                  <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
                  <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
          <ChatButton />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

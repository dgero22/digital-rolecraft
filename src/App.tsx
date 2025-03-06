
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import CreatePersona from "./pages/CreatePersona";
import PersonaLibrary from "./pages/PersonaLibrary";
import Simulator from "./pages/Simulator";
import OrgChart from "./pages/OrgChart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreatePersona />} />
            <Route path="/library" element={<PersonaLibrary />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/group-chat" element={<Simulator />} />
            <Route path="/org-chart" element={<OrgChart />} />
            <Route path="/org-chart/:id" element={<OrgChart />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

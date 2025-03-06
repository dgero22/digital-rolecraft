
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import OrgChartEditor from '@/components/OrgChartEditor';
import OrgChartList from '@/components/OrgChartList';
import type { OrgChart as OrgChartType, Persona } from '@/types';

const OrgChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orgCharts, setOrgCharts] = useState<OrgChartType[]>([]);
  const [currentChart, setCurrentChart] = useState<OrgChartType | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load org charts and personas from localStorage
    const storedOrgCharts = JSON.parse(localStorage.getItem('orgCharts') || '[]');
    const storedPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    
    setOrgCharts(storedOrgCharts);
    setPersonas(storedPersonas);
    
    if (id) {
      const chart = storedOrgCharts.find((c: OrgChartType) => c.id === id);
      if (chart) {
        setCurrentChart(chart);
      } else {
        navigate('/org-chart');
      }
    }
    
    setIsLoading(false);
  }, [id, navigate]);

  const createNewChart = () => {
    const newChart: OrgChartType = {
      id: nanoid(),
      name: 'New Organization Chart',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentChart(newChart);
    navigate(`/org-chart/${newChart.id}`);
  };

  const saveChart = (chart: OrgChartType) => {
    // Check if chart already exists in storage
    const chartIndex = orgCharts.findIndex(c => c.id === chart.id);
    
    // Update the chart updatedAt timestamp
    const updatedChart = {
      ...chart,
      updatedAt: new Date().toISOString()
    };
    
    let updatedCharts;
    if (chartIndex >= 0) {
      // Update existing chart
      updatedCharts = [
        ...orgCharts.slice(0, chartIndex),
        updatedChart,
        ...orgCharts.slice(chartIndex + 1)
      ];
    } else {
      // Add new chart
      updatedCharts = [...orgCharts, updatedChart];
    }
    
    // Save to localStorage
    localStorage.setItem('orgCharts', JSON.stringify(updatedCharts));
    setOrgCharts(updatedCharts);
    setCurrentChart(updatedChart);
    
    toast.success('Organization chart saved');
  };

  const deleteChart = (chartId: string) => {
    const updatedCharts = orgCharts.filter(c => c.id !== chartId);
    localStorage.setItem('orgCharts', JSON.stringify(updatedCharts));
    setOrgCharts(updatedCharts);
    
    if (currentChart && currentChart.id === chartId) {
      setCurrentChart(null);
      navigate('/org-chart');
    }
    
    toast.success('Organization chart deleted');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : id && currentChart ? (
              <OrgChartEditor 
                orgChart={currentChart} 
                personas={personas}
                onSave={saveChart}
                onDelete={() => deleteChart(currentChart.id)}
              />
            ) : (
              <OrgChartList 
                orgCharts={orgCharts} 
                onCreateNew={createNewChart}
                onDelete={deleteChart}
              />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OrgChart;

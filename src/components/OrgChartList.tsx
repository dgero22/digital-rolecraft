
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GitBranch, 
  Plus, 
  Calendar, 
  Edit, 
  Trash2 
} from "lucide-react";
import type { OrgChart } from '@/types';

interface OrgChartListProps {
  orgCharts: OrgChart[];
  onCreateNew: () => void;
  onDelete: (id: string) => void;
}

const OrgChartList = ({ orgCharts, onCreateNew, onDelete }: OrgChartListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Organization Charts</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage organizational hierarchies with your personas
          </p>
        </div>
        
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Chart
        </Button>
      </div>
      
      {orgCharts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/50 rounded-lg">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <GitBranch className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">No organization charts yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first organization chart to visualize relationships between your personas.
          </p>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Chart
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgCharts.map((chart) => (
            <motion.div
              key={chart.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden glass-card border transition-all duration-300 hover:shadow-md">
                <div className="p-5 flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg tracking-tight line-clamp-1">
                        {chart.name}
                      </h3>
                      <GitBranch className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Created {formatDate(chart.createdAt)}</span>
                      </div>
                      <div>
                        {chart.nodes.length} nodes • {chart.edges.length} connections
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    <Button asChild variant="default" size="sm" className="flex-1">
                      <Link to={`/org-chart/${chart.id}`}>
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(chart.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgChartList;

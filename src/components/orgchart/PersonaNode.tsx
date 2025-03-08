
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const PersonaNode = ({ data, selected }: any) => {
  const initials = data.label
    ? data.label
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '??';

  return (
    <div 
      className={`px-4 py-3 rounded-lg shadow-sm border-2 bg-card ${
        selected ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
      }`}
      onDoubleClick={(e) => {
        // Prevent default behavior and stop propagation
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        className="w-3 h-3 rounded-full border-2 border-background bg-muted-foreground"
      />
      
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={data.avatar} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{data.label}</p>
          {data.role && (
            <p className="text-xs text-muted-foreground truncate">{data.role}</p>
          )}
          {data.department && (
            <p className="text-xs text-muted-foreground truncate">{data.department}</p>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            // Pass personaId to the onEdit function if it exists
            if (data.onEdit) {
              if (data.personaId) {
                data.onEdit(data.personaId);
              } else {
                // Show a message that this node needs to be linked to a persona first
                console.log("No persona associated with this node");
                // We could also use toast here to show an error message
                const toast = document.querySelector('[role="status"]');
                if (toast) {
                  const event = new CustomEvent('toast', { 
                    detail: { message: 'Please select a persona for this node first', type: 'error' } 
                  });
                  document.dispatchEvent(event);
                }
              }
            }
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        className="w-3 h-3 rounded-full border-2 border-background bg-muted-foreground"
      />
    </div>
  );
};

export default memo(PersonaNode);

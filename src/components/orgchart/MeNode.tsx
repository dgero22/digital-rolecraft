
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const MeNode = ({ data, selected }: any) => {
  const initials = data.label
    ? data.label
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'ME';

  return (
    <div className={`px-4 py-3 rounded-lg shadow-sm border-2 bg-card ${
      selected ? 'border-primary bg-primary/5' : 'border-primary/40'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        className="w-3 h-3 rounded-full border-2 border-background bg-muted-foreground"
      />
      
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border bg-primary/20">
          <AvatarImage src={data.avatar} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{data.label || 'Me'}</p>
          {data.role && (
            <p className="text-xs text-muted-foreground truncate">{data.role}</p>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            if (data.onEdit) data.onEdit();
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

export default memo(MeNode);


import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

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
    <div className={`px-4 py-3 rounded-lg shadow-sm border bg-card ${
      selected ? 'ring-2 ring-primary' : ''
    }`}>
      <Handle
        type="target"
        position={Position.Top}
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
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 rounded-full border-2 border-background bg-muted-foreground"
      />
    </div>
  );
};

export default memo(PersonaNode);

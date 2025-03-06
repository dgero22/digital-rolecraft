
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Building } from "lucide-react";

const DepartmentNode = ({ data, selected }: any) => {
  return (
    <div className={`px-4 py-3 rounded-lg shadow-sm border-2 border-dashed ${
      selected ? 'border-primary bg-primary/5' : 'border-muted bg-card/60'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 rounded-full border-2 border-background bg-muted-foreground"
      />
      
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-secondary">
          <Building className="h-4 w-4 text-secondary-foreground" />
        </div>
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 rounded-full border-2 border-background bg-muted-foreground"
      />
    </div>
  );
};

export default memo(DepartmentNode);

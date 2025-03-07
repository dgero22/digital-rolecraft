
import { 
  MessageCircle, 
  Link, 
  Unlink,
  ChevronRight
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ConnectionContextMenuProps {
  children: React.ReactNode;
  onStartConversation: () => void;
  onDefineRelationship: (type: string) => void;
  onDeleteConnection: () => void;
}

const ConnectionContextMenu = ({
  children,
  onStartConversation,
  onDefineRelationship,
  onDeleteConnection,
}: ConnectionContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={onStartConversation}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Start conversation
        </ContextMenuItem>
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Link className="h-4 w-4 mr-2" />
            Define relationship
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => onDefineRelationship('reports-to')}>
              <ChevronRight className="h-4 w-4 mr-2" />
              Reports to
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDefineRelationship('no-report')}>
              <ChevronRight className="h-4 w-4 mr-2" />
              No report
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDefineRelationship('future-report')}>
              <ChevronRight className="h-4 w-4 mr-2" />
              Future report
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={onDeleteConnection}
          className="text-destructive focus:text-destructive"
        >
          <Unlink className="h-4 w-4 mr-2" />
          Delete connection
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ConnectionContextMenu;

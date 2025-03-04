
import React, { useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isGenerating: boolean;
  persona: { name: string };
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  isGenerating,
  persona
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isGenerating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGenerating]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex space-x-2">
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${persona.name}...`}
          className="min-h-12 max-h-32 resize-none"
          disabled={isGenerating}
        />
        <Button
          className="flex-shrink-0"
          size="icon"
          disabled={isGenerating || !inputValue.trim()}
          onClick={onSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;

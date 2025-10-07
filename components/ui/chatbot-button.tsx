"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAI } from "@/contexts/ai-context";
import { cn } from "@/lib/utils";

export function ChatbotButton() {
  const [input, setInput] = useState("");
  const { chatMessages, sendMessage, isProcessing } = useAI();
  const [open, setOpen] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-[400px] p-0 flex flex-col h-[600px]">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                SmartShop Assistant
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {chatMessages.length === 0 ? (
                <div className="py-8 text-center">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">How can I help?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ask me about products, recommendations, orders or anything
                    else!
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-2">
                    {["What's new in stock?", "Help me find a gift", "Track my order", "Return policy"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          sendMessage(suggestion);
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "px-4 py-3 max-w-[80%]",
                      message.isUser
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-muted"
                    )}
                  >
                    {message.text}
                  </Card>
                ))
              )}
              {isProcessing && (
                <Card className="mr-auto bg-muted px-4 py-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t flex gap-2"
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
            />
            <Button type="submit" disabled={!input.trim() || isProcessing}>
              Send
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
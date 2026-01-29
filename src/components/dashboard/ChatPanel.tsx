import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, SupportedLanguage, SUPPORTED_LANGUAGES } from "@/types";
import { Mic, Send, Sparkles, User, Globe, Check, ChevronDown } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isProcessing: boolean;
  selectedLanguage: SupportedLanguage;
}

const ChatPanel = ({ messages, onSendMessage, isProcessing, selectedLanguage }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-saffron flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">CrewNexusAI</h2>
              <p className="text-xs text-muted-foreground">Vernacular Sales Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-2xl gradient-saffron flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Start a Conversation</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Type a sales lead in Hindi, Tamil, Bengali, or English. I'll analyze it instantly!
            </p>
            
            {/* Quick examples */}
            <div className="mt-6 space-y-2 w-full max-w-xs">
              {[
                { lang: 'hi', text: 'भैया, 50 किलो चावल चाहिए' },
                { lang: 'ta', text: '100 மீட்டர் சில்க் வேண்டும்' },
                { lang: 'bn', text: '২০০ লিটার তেল দরকার' },
              ].map((example) => (
                <button
                  key={example.lang}
                  onClick={() => setInput(example.text)}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
                >
                  <span className="text-xs text-primary font-medium uppercase">{example.lang}</span>
                  <span className="ml-2">{example.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'gradient-saffron'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div className={`space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`px-4 py-2.5 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-secondary text-secondary-foreground rounded-tr-sm'
                          : 'bg-accent text-accent-foreground rounded-tl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {/* Analysis indicator */}
                      {message.analysis && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <Globe className="w-3 h-3" />
                          <span>{SUPPORTED_LANGUAGES.find(l => l.code === message.analysis?.detectedLanguage)?.nativeName}</span>
                          <span>•</span>
                          <span>{message.analysis.region}</span>
                          <Check className="w-3 h-3 text-success" />
                        </motion.div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Processing indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-sm bg-accent/50">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-accent"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">Analyzing in AI...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-border bg-card">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a sales lead in any language..."
            className="min-h-[60px] max-h-[120px] resize-none pr-24 text-base"
            disabled={isProcessing}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              disabled={isProcessing}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 gradient-saffron"
              disabled={!input.trim() || isProcessing}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Auto-detect language</span>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;

import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  MessageCircle, 
  Heart,
  User,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const aiResponses = [
  "I hear you, and I want you to know that what you're feeling is completely valid. Let's explore this together.",
  "That sounds like a really thoughtful reflection. What do you think might be behind those feelings?",
  "Thank you for sharing that with me. It takes courage to be so open about your experiences.",
  "I can sense the depth of what you're going through. Would it help to talk about what support looks like for you right now?",
  "Your self-awareness is really growing. How does it feel to notice these patterns in yourself?",
  "That's a beautiful insight. Sometimes the most profound growth happens in moments like these.",
];

const welcomeMessages = [
  "Hi there! I'm here to listen and support you. What's on your mind today? 🌸",
  "Welcome back! How are you feeling right now? Remember, there's no judgment here - just understanding.",
  "Hello! I'm glad you're here. What would you like to talk about or explore today?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-2rem)]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">Chat with Your AI Mentor</h1>
            <p className="text-lg text-muted-foreground">A safe, judgment-free conversation</p>
          </div>

          {/* Chat Container */}
          <Card className="flex-1 flex flex-col bg-card/80 backdrop-blur-sm shadow-card border-0">
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className={`w-10 h-10 ${message.sender === 'ai' ? 'bg-gradient-primary' : 'bg-gradient-warm'}`}>
                      <AvatarFallback className="text-white">
                        {message.sender === 'ai' ? <Heart className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block p-4 rounded-2xl shadow-soft ${
                          message.sender === 'user'
                            ? 'bg-gradient-primary text-white'
                            : 'bg-background border border-border'
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 bg-gradient-primary">
                      <AvatarFallback className="text-white">
                        <Heart className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-background border border-border rounded-2xl p-4 shadow-soft">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border bg-background/50 p-4">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share what's on your mind..."
                      className="bg-card border-border text-lg py-3 pr-4 resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-primary text-white hover:shadow-glow transition-bounce px-6"
                    size="lg"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send • Your conversations are private and secure
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  Mic, 
  MicOff,
  Lightbulb,
  Utensils,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { chatService } from '@/services/chatService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FoodAssistant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: t('food_assistant_welcome'),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { 
      icon: Heart, 
      text: t('qa_heart_healthy'), 
      color: "text-red-500",
      bg: "bg-red-50 hover:bg-red-100"
    },
    { 
      icon: Utensils, 
      text: t('qa_healthier_alternatives'), 
      color: "text-green-500",
      bg: "bg-green-50 hover:bg-green-100"
    },
    { 
      icon: AlertTriangle, 
      text: t('qa_harmful_additives'), 
      color: "text-orange-500",
      bg: "bg-orange-50 hover:bg-orange-100"
    },
    { 
      icon: Lightbulb, 
      text: t('qa_explain_label'), 
      color: "text-blue-500",
      bg: "bg-blue-50 hover:bg-blue-100"
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    const trimmed = inputMessage.trim();
    console.log('🤖 [FOOD ASSISTANT] Sending message...', {
      message: trimmed,
      messageLength: trimmed.length,
      isTyping,
      sessionId
    });
    
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    console.log('🤖 [FOOD ASSISTANT] Adding user message to chat:', userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    console.log('🤖 [FOOD ASSISTANT] Set typing state to true');

    try {
      console.log('🤖 [FOOD ASSISTANT] Calling chat service...');
      const response = await chatService.sendMessage(trimmed, sessionId ?? undefined);
      console.log('🤖 [FOOD ASSISTANT] Chat service response received:', response);
      
      setSessionId(response.sessionId);
      console.log('🤖 [FOOD ASSISTANT] Session ID updated:', response.sessionId);

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        type: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };

      console.log('🤖 [FOOD ASSISTANT] Adding assistant message to chat:', assistantMessage);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('🤖 [FOOD ASSISTANT] ❌ Chat error:', error);
      const fallback = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      const assistantMessage: Message = {
        id: `${Date.now()}-error`,
        type: 'assistant',
        content: fallback,
        timestamp: new Date(),
      };
      console.log('🤖 [FOOD ASSISTANT] Adding error message to chat:', assistantMessage);
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      console.log('🤖 [FOOD ASSISTANT] Setting typing state to false');
      setIsTyping(false);
    }
  };


  const handleQuickQuestion = (question: string) => {
    console.log('🤖 [FOOD ASSISTANT] Quick question selected:', question);
    setInputMessage(question);
  };

  const toggleVoiceInput = () => {
    console.log('🤖 [FOOD ASSISTANT] Toggling voice input...', { isListening });
    setIsListening(!isListening);
    // Voice input implementation would go here
    if (!isListening) {
      console.log('🤖 [FOOD ASSISTANT] Starting voice input simulation...');
      // Start speech recognition
      setTimeout(() => {
        console.log('🤖 [FOOD ASSISTANT] Voice input simulation completed');
        setIsListening(false);
        setInputMessage("Is this product suitable for diabetics?");
      }, 2000);
    }
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center gap-4 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">{t('food_assistant')}</h1>
                <p className="text-xs text-muted-foreground">{t('your_nutrition_expert')}</p>
              </div>
            </div>

            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              {t('online')}
            </Badge>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  message.type === 'user'
                    ? 'bg-gradient-primary text-white ml-12'
                    : 'bg-card shadow-material-sm mr-12'
                )}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                      <MessageCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Food Assistant</span>
                  </div>
                )}
                <p className="leading-relaxed">{message.content}</p>
                <p className={cn(
                  "text-xs mt-2",
                  message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card shadow-material-sm rounded-2xl px-4 py-3 mr-12">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Food Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-3">{t('quick_questions')}</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Card
                  key={index}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-material-md border-0",
                    question.bg
                  )}
                  onClick={() => handleQuickQuestion(question.text)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <question.icon className={cn("w-4 h-4", question.color)} />
                      <span className="text-xs font-medium">{question.text}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t p-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('assistant_input_placeholder')}
                className="pr-12 h-12 rounded-2xl border-0 bg-muted/50 focus:bg-card shadow-material-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceInput}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full",
                  isListening && "bg-primary text-primary-foreground"
                )}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-12 w-12 rounded-full bg-gradient-primary hover:shadow-glow"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          {isListening && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary">{t('listening')}</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default FoodAssistant;


















import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  useSendChatMessage,
  useChatHistory,
  useClearChatHistory,
} from "../../hooks/useAi";
import { useAuthStore } from "../../store/authStore";
import { Bot, User as UserIcon, Send, Sparkles, Trash2 } from "lucide-react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  const { mutate: sendMessage, isPending } = useSendChatMessage();
  const { data: historyData } = useChatHistory();
  const { mutate: clearHistory } = useClearChatHistory();

  const messages = historyData?.data?.messages || [];

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length, isPending]);

  const handleSend = (msg?: string) => {
    const textToSend = msg || message;
    if (!textToSend.trim() || isPending) return;

    sendMessage(
      { message: textToSend },
      {
        onSuccess: (response) => {
          setSuggestions(response.data?.suggestions || []);
          setMessage("");
        },
      },
    );
    if (!msg) setMessage("");
  };

  const starterQuestions = [
    "How can I improve my sleep quality?",
    "What are healthy meal ideas for lunch?",
    "How to manage daily stress?",
    "Tips for staying hydrated",
  ];

  return (
    <div className="h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 flex justify-center overflow-hidden">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight">
                Nova Assistant
              </h1>
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                Online
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              onClick={() => confirm("Clear chat?") && clearHistory()}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </div>

        {/* Chat Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth"
        >
          {messages.length === 0 && !isPending ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border border-slate-200">
                <Sparkles className="text-slate-400" size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                How can I help you today?
              </h2>
              <p className="text-sm text-slate-500 mb-8">
                I'm a specialized AI trained to answer your health, nutrition,
                and wellness questions.
              </p>

              <div className="w-full space-y-2">
                {starterQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg: any) => {
                const isMe = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 mt-auto">
                        <Bot size={14} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 ${isMe ? "bg-slate-900 text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"}`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 mt-auto">
                <Bot size={14} />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center h-[44px]">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          {suggestions.length > 0 && !isPending && (
            <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="shrink-0 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a health question..."
              disabled={isPending}
              className="flex-1 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-slate-400 shadow-inner"
            />
            <Button
              type="submit"
              disabled={isPending || !message.trim()}
              className="h-12 w-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shrink-0 p-0"
            >
              <Send
                size={18}
                className={
                  message.trim() ? "translate-x-0.5 -translate-y-0.5" : ""
                }
              />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] font-medium text-slate-400">
              AI can make mistakes. Consider verifying important clinical
              information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

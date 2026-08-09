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

const Chat = () => {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  const { mutate: sendMessage, isPending } = useSendChatMessage();
  const { data: historyData } = useChatHistory();
  const { mutate: clearHistory } = useClearChatHistory();

  const messages = historyData?.data?.messages || [];

  // Auto scroll ONLY chat container
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

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear all messages?")) {
      clearHistory();
      setSuggestions([]);
    }
  };

  const starterQuestions = [
    "How can I improve my sleep quality?",
    "What are healthy meal ideas?",
    "How to reduce stress?",
    "Tips for staying hydrated",
    "How to boost immunity naturally?",
    "Best exercises for beginners?",
  ];

  const getInitial = (name?: string) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-4xl"
              >
                💬
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  AI Health Assistant
                </h1>
                <p className="text-white/90 text-xs">
                  Ask me anything about your health
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                onClick={handleClearChat}
                variant="outline"
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                🗑️ Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Chat Container - Balanced Size */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[550px]">
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-5 space-y-3"
          >
            {messages.length === 0 && !isPending ? (
              /* Empty State - Compact */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-4"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  🤖
                </motion.div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  Hi {user?.name?.split(" ")[0] || "there"}! 👋
                </h2>
                <p className="text-slate-500 text-sm mb-4">
                  I'm your AI health assistant. Ask me anything!
                </p>

                {/* Compact Starter Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-xl">
                  {starterQuestions.map((question, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(question)}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-left transition border border-emerald-100 text-sm"
                    >
                      <p className="font-medium text-slate-700">{question}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((msg: any, i: number) => (
                  <motion.div
                    key={msg.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                        🤖
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.role === "user"
                            ? "text-white/70"
                            : "text-slate-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {msg.role === "user" && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {getInitial(user?.name)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Typing Indicator */}
            {isPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white">
                  🤖
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 pb-2"
            >
              <p className="text-xs text-slate-500 mb-1.5">💡 Suggested:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="text-xs px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 p-3 bg-slate-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your health question..."
                disabled={isPending}
                className="flex-1 h-11 border-slate-200 focus-visible:ring-emerald-500"
              />
              <Button
                type="submit"
                disabled={isPending || !message.trim()}
                className="h-11 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
              >
                {isPending ? "..." : "Send 📤"}
              </Button>
            </form>
            <p className="text-[10px] text-slate-500 mt-1.5 text-center">
              Press Enter to send • AI-generated, consult a doctor for medical
              advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

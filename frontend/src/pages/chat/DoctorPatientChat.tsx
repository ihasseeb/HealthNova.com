import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  sendMessageSchema,
  SendMessageFormData,
} from "../../schemas/chatSchema";
import {
  useGetMyRooms,
  useGetRoomMessages,
  useSendMessage,
} from "../../hooks/useChat";
import { useAuthStore } from "../../store/authStore";
import { connectSocket, disconnectSocket } from "../../services/chatService";
import { useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Send,
  Stethoscope,
  User as UserIcon,
} from "lucide-react";

const DoctorPatientChat = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: roomsData, isLoading: loadingRooms } = useGetMyRooms();
  const { data: messagesData } = useGetRoomMessages(selectedRoomId);
  const sendMessageMutation = useSendMessage();

  const rooms = roomsData?.data?.rooms || [];
  const messages = messagesData?.data?.messages || [];

  // 1. Fixed Resolver Type
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SendMessageFormData>({
    resolver: zodResolver(sendMessageSchema) as any,
    mode: "onChange",
    defaultValues: {
      roomId: selectedRoomId,
      content: "",
      messageType: "TEXT",
    },
  });

  const contentValue = watch("content");

  useEffect(() => {
    setValue("roomId", selectedRoomId);
  }, [selectedRoomId, setValue]);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    if (selectedRoomId) {
      socket.emit("join_room", selectedRoomId);
    }

    const handleNewMessage = (newMsg: any) => {
      if (newMsg.roomId === selectedRoomId) {
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", selectedRoomId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);

    return () => {
      if (selectedRoomId) {
        socket.emit("leave_room", selectedRoomId);
      }
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      disconnectSocket();
    };
  }, [token, selectedRoomId, queryClient, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessageMutation.isPending]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("content", e.target.value);
    const socket = connectSocket(token || "");
    if (selectedRoomId && socket) {
      socket.emit("typing", {
        roomId: selectedRoomId,
        isTyping: e.target.value.length > 0,
      });
    }
  };

  // 2. Fixed Submit Handler
  const handleFormSubmit = (data: SendMessageFormData) => {
    sendMessageMutation.mutate(data, {
      onSuccess: () => {
        reset({ roomId: selectedRoomId, content: "", messageType: "TEXT" });
        const socket = connectSocket(token || "");
        if (selectedRoomId && socket) {
          socket.emit("typing", { roomId: selectedRoomId, isTyping: false });
        }
      },
    });
  };

  const getInitial = (name?: string) => name?.charAt(0).toUpperCase() || "U";
  const contentRegister = register("content");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[80vh] min-h-[600px]"
      >
        {/* SIDEBAR: Conversations List */}
        <div className="border-r border-slate-100 bg-slate-50/50 flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              <MessageSquare size={20} className="text-primary-600" />{" "}
              Consultations
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
            {loadingRooms ? (
              <div className="p-4 text-center text-slate-400 font-medium text-sm animate-pulse">
                Loading active chats...
              </div>
            ) : rooms.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                  <MessageSquare size={20} />
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  No active consultations yet.
                </p>
              </div>
            ) : (
              rooms.map((room: any) => {
                const isDoctorRole = user?.role === "DOCTOR";
                const otherUserName = isDoctorRole
                  ? room.patient?.name
                  : `Dr. ${room.doctor?.user?.name || "Doctor"}`;

                const lastMsg =
                  room.messages?.[0]?.content || "Start the conversation";
                const isSelected = selectedRoomId === room.id;

                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                        : "bg-white hover:bg-slate-100 border border-slate-100/50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 ${
                        isSelected
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-primary-50 border-primary-100 text-primary-700"
                      }`}
                    >
                      {getInitial(otherUserName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-bold text-sm truncate ${
                          isSelected ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {otherUserName}
                      </p>
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          isSelected ? "text-primary-100" : "text-slate-500"
                        }`}
                      >
                        {lastMsg}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="md:col-span-2 flex flex-col bg-white relative">
          {!selectedRoomId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 mb-6 shadow-sm">
                <MessageSquare size={32} className="text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Select a Conversation
              </h2>
              <p className="text-sm font-medium text-slate-500 max-w-sm">
                Choose a patient or doctor from the sidebar to start a secure,
                end-to-end encrypted medical consultation.
              </p>
            </div>
          ) : (
            <>
              {/* Active Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center border border-primary-100">
                    {user?.role === "DOCTOR" ? (
                      <UserIcon size={18} />
                    ) : (
                      <Stethoscope size={18} />
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 leading-tight">
                      Live Consultation
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Connected Securely
                      </span>
                    </div>
                  </div>
                </div>
                {isTyping && (
                  <span className="text-xs font-bold text-primary-500 bg-primary-50 px-3 py-1 rounded-full animate-pulse">
                    Typing...
                  </span>
                )}
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-thin">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-xs font-medium">
                      This is the beginning of your consultation.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((msg: any) => {
                      const isMe = msg.senderId === user?.id;

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex gap-3 ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold shrink-0 mt-auto shadow-sm">
                              {user?.role === "DOCTOR" ? "P" : "D"}
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] px-5 py-3 shadow-sm ${
                              isMe
                                ? "bg-slate-900 text-white rounded-2xl rounded-br-sm"
                                : "bg-white text-slate-800 border border-slate-200/60 rounded-2xl rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <span
                              className={`text-[10px] font-bold block text-right mt-1.5 ${
                                isMe ? "text-slate-400" : "text-slate-400"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form
                  onSubmit={handleSubmit((data: any) =>
                    handleFormSubmit(data as SendMessageFormData),
                  )}
                  className="flex items-center gap-3 bg-slate-50/80 p-2 rounded-2xl border border-slate-200/60 shadow-inner"
                >
                  <Input
                    {...contentRegister}
                    onChange={(e) => {
                      contentRegister.onChange(e);
                      handleInputChange(e);
                    }}
                    placeholder="Type your medical query here..."
                    disabled={sendMessageMutation.isPending}
                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium placeholder:text-slate-400"
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    disabled={
                      sendMessageMutation.isPending || !contentValue?.trim()
                    }
                    className="h-10 w-10 md:w-auto md:px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md shadow-primary-600/20 shrink-0 p-0"
                  >
                    <Send size={16} className="md:mr-2" />
                    <span className="hidden md:inline">Send</span>
                  </Button>
                </form>
                {errors.content && (
                  <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold">
                    {errors.content.message}
                  </p>
                )}
                <p className="text-[10px] font-medium text-slate-400 mt-2 text-center uppercase tracking-widest">
                  End-to-End Encrypted Consultation
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorPatientChat;

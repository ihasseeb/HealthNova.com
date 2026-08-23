import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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

const DoctorPatientChat = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TanStack Hooks
  const { data: roomsData, isLoading: loadingRooms } = useGetMyRooms();
  const { data: messagesData } = useGetRoomMessages(selectedRoomId);
  const sendMessageMutation = useSendMessage();

  const rooms = roomsData?.data?.rooms || [];
  const messages = messagesData?.data?.messages || [];

  // React Hook Form for sending messages with Zod Validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      roomId: selectedRoomId,
      content: "",
      messageType: "TEXT",
    },
  });

  // Keep Form's roomId synchronized with selectedRoomId state
  useEffect(() => {
    setValue("roomId", selectedRoomId);
  }, [selectedRoomId, setValue]);

  // Connect Socket.io on Mount & Listen to Events
  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    if (selectedRoomId) {
      socket.emit("join_room", selectedRoomId);
    }

    // Listen for Real-Time New Messages from backend emit
    const handleNewMessage = (newMsg: any) => {
      if (newMsg.roomId === selectedRoomId) {
        queryClient.invalidateQueries({
          queryKey: ["chatMessages", selectedRoomId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    };

    // Listen for Typing Events
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

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPendingMessage()]);

  function isPendingMessage() {
    return sendMessageMutation.isPending;
  }

  // Emit Typing Event on Input Change
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

  const onSubmit = (data: SendMessageFormData) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 grid grid-cols-1 md:grid-cols-3 min-h-[600px]"
      >
        {/* Sidebar: Chat Rooms List */}
        <div className="border-r border-slate-200 p-4 space-y-4 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            💬 Conversations
          </h2>

          {loadingRooms ? (
            <div className="p-4 text-center text-slate-400">
              Loading chats...
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No active conversations yet. Book an appointment with a doctor to
              start chatting!
            </div>
          ) : (
            <div className="space-y-2">
              {rooms.map((room: any) => {
                const otherUser =
                  user?.role === "DOCTOR"
                    ? room.patient?.name
                    : `Dr. ${room.doctor?.user?.name || "Doctor"}`;

                const lastMsg =
                  room.messages?.[0]?.content || "No messages yet";

                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition ${
                      selectedRoomId === room.id
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white hover:bg-emerald-50 border border-slate-100"
                    }`}
                  >
                    <p className="font-bold text-sm">{otherUser}</p>
                    <p
                      className={`text-xs truncate mt-1 ${
                        selectedRoomId === room.id
                          ? "text-emerald-100"
                          : "text-slate-500"
                      }`}
                    >
                      {lastMsg}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="md:col-span-2 flex flex-col justify-between h-[600px]">
          {!selectedRoomId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="text-6xl mb-3">💬</div>
              <p className="font-medium text-slate-600">
                Select a conversation
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Choose a doctor or patient from the left panel to start
                messaging in real-time.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                <span className="font-bold text-slate-800">
                  ⚡ Real-Time Consultation Room
                </span>
                {isTyping && (
                  <span className="text-xs text-emerald-600 font-semibold animate-pulse">
                    Typing...
                  </span>
                )}
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-8">
                    Send a message to start the consultation.
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const isMe = msg.senderId === user?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                            isMe
                              ? "bg-emerald-600 text-white rounded-br-none"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span
                            className={`text-[10px] block text-right mt-1 ${
                              isMe ? "text-emerald-200" : "text-slate-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form with React Hook Form & Zod Validation */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center"
              >
                <div className="flex-1">
                  <Input
                    placeholder="Type your message..."
                    {...register("content")}
                    onChange={handleInputChange}
                    className="h-11 border-slate-200 focus-visible:ring-emerald-500"
                  />
                  {errors.content && (
                    <p className="text-[10px] text-red-500 mt-0.5 ml-1">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending}
                  className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
                >
                  {sendMessageMutation.isPending ? "..." : "Send 📤"}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorPatientChat;

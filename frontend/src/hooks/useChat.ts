import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrGetRoom,
  getMyRooms,
  getRoomMessages,
  sendChatMessage,
} from "../services/chatService";
import { SendMessageFormData, CreateRoomFormData } from "../schemas/chatSchema";
import { toast } from "sonner";

// Get My Rooms Hook
export const useGetMyRooms = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: getMyRooms,
  });
};

// Get Room Messages Hook
export const useGetRoomMessages = (roomId: string) => {
  return useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: () => getRoomMessages(roomId),
    enabled: !!roomId,
  });
};

// Create / Open Room Hook
export const useCreateOrGetRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomFormData) => createOrGetRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Could not open chat room");
    },
  });
};

// Send Message Hook
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageFormData) => sendChatMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", variables.roomId],
      });
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });
};

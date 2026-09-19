import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { connectSocket, disconnectSocket } from "../services/chatService";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";

const VideoConsultation = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "waiting" | "connected" | "ended"
  >("connecting");

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!token || !appointmentId) return;

    // 1. Initialize Socket
    const socket = connectSocket(token);
    socketRef.current = socket;

    // 2. Initialize WebRTC Peer Connection
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Free Google STUN server
      ],
    });
    peerConnectionRef.current = pc;

    // 3. Get User Media (Camera & Mic)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // Add tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Tell backend we joined
        socket.emit("join_video_room", appointmentId);
        setCallStatus("waiting");
      })
      .catch((err) => {
        toast.error("Failed to access camera/microphone");
        console.error("Media Error:", err);
      });

    // 4. Listen for Remote Video Stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setCallStatus("connected");
      }
    };

    // 5. Handle ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc_ice_candidate", {
          appointmentId,
          candidate: event.candidate,
        });
      }
    };

    // ================= Socket Events ================= //

    // Another user joined, initiate call (Offer)
    socket.on("user_joined_video", async () => {
      toast.info("Other participant joined, connecting...");
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc_offer", { appointmentId, offer });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    });

    // Receive Offer, Send Answer
    socket.on("webrtc_offer", async (data: any) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc_answer", { appointmentId, answer });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    // Receive Answer
    socket.on("webrtc_answer", async (data: any) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    // Receive ICE Candidates
    socket.on("webrtc_ice_candidate", async (data: any) => {
      try {
        if (data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error("Error adding ice candidate:", err);
      }
    });

    // Remote Hangup
    socket.on("video_call_ended", () => {
      toast.info("Call ended by the other participant");
      handleEndCall();
    });

    return () => {
      handleEndCall(false); // Cleanup on unmount without emitting if just leaving
    };
  }, [token, appointmentId]);

  // Controls Handlers
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const handleEndCall = (emitEvent = true) => {
    setCallStatus("ended");

    if (emitEvent && socketRef.current) {
      socketRef.current.emit("end_video_call", appointmentId);
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col gap-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center text-white px-4 py-3 bg-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🔴</span>
            <h1 className="text-xl font-bold">HealthNova Telemedicine</h1>
          </div>
          <div className="text-sm font-semibold bg-slate-700 px-3 py-1 rounded-full">
            {callStatus === "waiting" && "Waiting for other participant..."}
            {callStatus === "connecting" && "Connecting camera..."}
            {callStatus === "connected" && "Call Connected 🔒"}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[60vh] md:h-[70vh]">
          {/* Main Remote Video (Bigger) */}
          <div className="md:col-span-2 bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700">
            {callStatus !== "connected" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <div className="text-6xl mb-4 opacity-50">👨‍⚕️</div>
                <p>Waiting for connection...</p>
              </div>
            )}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${callStatus === "connected" ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          {/* Local Video (Smaller) */}
          <div className="bg-slate-800 rounded-3xl overflow-hidden relative shadow-xl border border-slate-700 h-64 md:h-full">
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted // Mute local video to prevent echo
              className="w-full h-full object-cover mirror"
              style={{ transform: "scaleX(-1)" }} // Mirror effect
            />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-semibold">
              You
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-6 mt-4 p-4 bg-slate-800 rounded-3xl max-w-sm mx-auto shadow-2xl"
        >
          <Button
            onClick={toggleMic}
            variant={isMicOn ? "outline" : "destructive"}
            className={`rounded-full w-14 h-14 flex items-center justify-center ${isMicOn ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600" : ""}`}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>

          <Button
            onClick={() => handleEndCall()}
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
          >
            <PhoneOff size={28} />
          </Button>

          <Button
            onClick={toggleVideo}
            variant={isVideoOn ? "outline" : "destructive"}
            className={`rounded-full w-14 h-14 flex items-center justify-center ${isVideoOn ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600" : ""}`}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoConsultation;

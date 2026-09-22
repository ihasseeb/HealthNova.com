import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetPatientAppointments,
  useCancelAppointment,
} from "../../hooks/useAppointment";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Video,
  XCircle,
  AlertCircle,
} from "lucide-react";

const PatientAppointments = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetPatientAppointments();
  const cancelMutation = useCancelAppointment();

  const appointments = data?.data?.appointments || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
              <Calendar size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                My Appointments
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Track, join, or cancel your medical consultations
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/doctors")}
            className="w-full md:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-12"
          >
            + Book New Appointment
          </Button>
        </div>

        {/* Appointments Grid */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-200/60">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No Appointments Booked
            </h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              You don't have any scheduled consultations at the moment.
            </p>
            <Button
              onClick={() => navigate("/doctors")}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl"
            >
              Find a Doctor
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {appointments.map((apt: any) => (
              <motion.div
                key={apt.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Dr. {apt.doctor?.user?.name || "Medical Specialist"}
                    </h3>
                    <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mt-0.5">
                      {apt.doctor?.specialization}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(
                      apt.status,
                    )}`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs font-medium text-slate-600 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={14} /> Date
                    </span>
                    <span className="font-bold text-slate-800">
                      {new Date(apt.appointmentDate).toLocaleDateString(
                        undefined,
                        { dateStyle: "medium" },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={14} /> Time
                    </span>
                    <span className="font-bold text-slate-800">
                      {apt.startTime} - {apt.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={14} /> Type
                    </span>
                    <span className="font-bold text-slate-800">
                      {apt.type?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <CreditCard size={14} /> Fee
                    </span>
                    <span className="font-bold text-primary-600 text-sm">
                      ${apt.consultationFee}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  <span className="font-bold text-slate-700">Reason:</span>{" "}
                  {apt.reason}
                </div>

                {/* Video Call Button */}
                {apt.status === "CONFIRMED" && apt.type === "VIDEO_CALL" && (
                  <Button
                    onClick={() => navigate(`/video-call/${apt.id}`)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold h-11 flex items-center justify-center gap-2"
                  >
                    <Video size={16} /> Join Video Consultation
                  </Button>
                )}

                {/* Cancel Button */}
                {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                  <Button
                    variant="outline"
                    onClick={() => cancelMutation.mutate(apt.id)}
                    disabled={cancelMutation.isPending}
                    className="w-full border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-bold h-10 rounded-xl"
                  >
                    <XCircle size={14} className="mr-1.5" /> Cancel Appointment
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PatientAppointments;

import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetPatientAppointments,
  useCancelAppointment,
} from "../../hooks/useAppointment";

const PatientAppointments = () => {
  const { data, isLoading } = useGetPatientAppointments();
  const cancelMutation = useCancelAppointment();

  const appointments = data?.data?.appointments || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">📅</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              📅 My Appointments
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Track and manage all your medical consultations
            </p>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="text-xl font-bold text-slate-800">
              No Appointments Found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              You haven't booked any medical visits yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {appointments.map((apt: any) => (
              <motion.div
                key={apt.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow border border-emerald-100 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      Dr. {apt.doctor?.user?.name || "Doctor"}
                    </h3>
                    <p className="text-xs text-emerald-600 font-semibold">
                      {apt.doctor?.specialization}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      apt.status,
                    )}`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>🗓️ Date:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>⏰ Time:</span>
                    <span className="font-medium text-slate-800">
                      {apt.startTime} - {apt.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>📍 Type:</span>
                    <span className="font-medium text-slate-800">
                      {apt.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>💳 Fee:</span>
                    <span className="font-bold text-emerald-600">
                      ${apt.consultationFee}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  <strong>Reason:</strong> {apt.reason}
                </div>

                {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                  <Button
                    variant="outline"
                    onClick={() => cancelMutation.mutate(apt.id)}
                    disabled={cancelMutation.isPending}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 text-xs"
                  >
                    ❌ Cancel Appointment
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

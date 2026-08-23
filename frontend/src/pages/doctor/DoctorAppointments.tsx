import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetDoctorAppointments,
  useUpdateAppointmentStatus,
  useSetDoctorAvailability,
} from "../../hooks/useAppointment";

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState<"appointments" | "schedule">(
    "appointments",
  );
  const { data, isLoading } = useGetDoctorAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const setSchedule = useSetDoctorAvailability();

  const appointments = data?.data?.appointments || [];

  // Weekly Schedule State (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const [schedule, setScheduleState] = useState([
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
  ]);

  const daysName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleSaveSchedule = () => {
    setSchedule.mutate({ slots: schedule });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">🩺</div>
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
        {/* Header & Tabs */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              👨‍⚕️ Doctor Portal: Appointments & Schedule
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Review patient visits and set your weekly availability
            </p>
          </div>
          <div className="flex bg-white/20 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "appointments"
                  ? "bg-white text-emerald-700"
                  : "text-white"
              }`}
            >
              📅 Appointments
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "schedule"
                  ? "bg-white text-emerald-700"
                  : "text-white"
              }`}
            >
              🕒 Set Schedule
            </button>
          </div>
        </div>

        {/* Tab 1: Patient Appointments */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100">
                <div className="text-5xl mb-2">📭</div>
                <p className="text-slate-500">No patient bookings found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {appointments.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl p-6 shadow border border-emerald-100 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-lg">
                        {apt.patient?.name}
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      {apt.patient?.email}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
                      <div>
                        🗓️ <strong>Date:</strong>{" "}
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </div>
                      <div>
                        ⏰ <strong>Time:</strong> {apt.startTime} -{" "}
                        {apt.endTime} ({apt.type})
                      </div>
                      <div>
                        💬 <strong>Reason:</strong> {apt.reason}
                      </div>
                    </div>

                    {/* Action Buttons for Doctor */}
                    {apt.status === "PENDING" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus.mutate({
                              appointmentId: apt.id,
                              data: { status: "CONFIRMED" },
                            })
                          }
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs"
                        >
                          ✅ Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateStatus.mutate({
                              appointmentId: apt.id,
                              data: { status: "CANCELLED" },
                            })
                          }
                          className="flex-1 border-red-300 text-red-600 text-xs"
                        >
                          ❌ Decline
                        </Button>
                      </div>
                    )}

                    {apt.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatus.mutate({
                            appointmentId: apt.id,
                            data: { status: "COMPLETED" },
                          })
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        🏁 Mark as Completed
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manage Schedule Slots */}
        {activeTab === "schedule" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow border border-emerald-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">
              🕒 Set Your Weekly Working Hours
            </h2>
            <p className="text-slate-500 text-xs">
              Patients will be able to book slots within your selected hours.
            </p>

            <div className="space-y-4">
              {schedule.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-xl gap-3"
                >
                  <span className="font-bold text-slate-700 text-sm w-32">
                    {daysName[slot.dayOfWeek]}
                  </span>

                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].startTime = e.target.value;
                        setScheduleState(updated);
                      }}
                      className="border p-2 rounded text-xs bg-white"
                    />
                    <span className="text-slate-400 text-xs">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].endTime = e.target.value;
                        setScheduleState(updated);
                      }}
                      className="border p-2 rounded text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveSchedule}
              disabled={setSchedule.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {setSchedule.isPending ? "Saving..." : "💾 Save Working Hours"}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorAppointments;

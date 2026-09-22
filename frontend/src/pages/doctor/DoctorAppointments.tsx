import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetDoctorAppointments,
  useUpdateAppointmentStatus,
  useSetDoctorAvailability,
} from "../../hooks/useAppointment";
import { CalendarDays, Clock, Check, X, User } from "lucide-react";

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState<"appointments" | "schedule">(
    "appointments",
  );
  const { data, isLoading } = useGetDoctorAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const setSchedule = useSetDoctorAvailability();

  const appointments = data?.data?.appointments || [];
  const daysName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [schedule, setScheduleState] = useState(
    [1, 2, 3, 4, 5].map((day) => ({
      dayOfWeek: day,
      startTime: "09:00",
      endTime: "17:00",
    })),
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  function handleSaveSchedule(
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    event.preventDefault();

    const payload = schedule
      .filter((slot) => slot.startTime && slot.endTime)
      .map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

    if (payload.length === 0) return;

    setSchedule.mutate({ slots: payload });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header & Tabs */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
              <CalendarDays size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Schedule Manager
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Review bookings & working hours
              </p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-full w-full md:w-auto">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === "appointments" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Visits
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === "schedule" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Availability
            </button>
          </div>
        </div>

        {/* Tab 1: Appointments */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                <User size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">
                  No Patient Bookings
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 hover:border-primary-200 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">
                          {apt.patient?.name}
                        </h3>
                        <p className="text-xs font-medium text-slate-500">
                          {apt.patient?.email}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${apt.status === "PENDING" ? "bg-amber-100 text-amber-700" : apt.status === "CONFIRMED" ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-700"}`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-600 mb-4 border border-slate-100 space-y-2">
                      <div className="flex justify-between">
                        <span>Date:</span>{" "}
                        <span className="text-slate-900">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>{" "}
                        <span className="text-slate-900">
                          {apt.startTime} - {apt.endTime} ({apt.type})
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <span className="text-xs text-slate-500 block mb-1">
                          Reason:
                        </span>
                        <span className="text-slate-800">{apt.reason}</span>
                      </div>
                    </div>

                    {apt.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            updateStatus.mutate({
                              appointmentId: apt.id,
                              data: { status: "CONFIRMED" },
                            })
                          }
                          className="flex-1 bg-slate-900 hover:bg-slate-800 h-10 rounded-xl text-xs font-bold"
                        >
                          <Check size={14} className="mr-1" /> Confirm
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            updateStatus.mutate({
                              appointmentId: apt.id,
                              data: { status: "CANCELLED" },
                            })
                          }
                          className="flex-1 border-slate-200 h-10 rounded-xl text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          <X size={14} className="mr-1" /> Decline
                        </Button>
                      </div>
                    )}
                    {apt.status === "CONFIRMED" && (
                      <Button
                        onClick={() =>
                          updateStatus.mutate({
                            appointmentId: apt.id,
                            data: { status: "COMPLETED" },
                          })
                        }
                        className="w-full bg-primary-600 hover:bg-primary-700 h-10 rounded-xl text-xs font-bold text-white"
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manage Schedule */}
        {activeTab === "schedule" && (
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="text-primary-500" size={20} /> Set Availability
            </h2>

            <div className="space-y-4 mb-8">
              {schedule.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 gap-4"
                >
                  <span className="font-bold text-slate-700 text-sm w-32">
                    {daysName[slot.dayOfWeek]}
                  </span>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].startTime = e.target.value;
                        setScheduleState(updated);
                      }}
                      className="border border-slate-200 p-2 rounded-lg text-sm bg-white font-medium outline-none focus:border-primary-500 flex-1"
                    />
                    <span className="text-slate-400 text-sm font-bold">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].endTime = e.target.value;
                        setScheduleState(updated);
                      }}
                      className="border border-slate-200 p-2 rounded-lg text-sm bg-white font-medium outline-none focus:border-primary-500 flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveSchedule}
              disabled={setSchedule.isPending}
              className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg"
            >
              {setSchedule.isPending ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorAppointments;

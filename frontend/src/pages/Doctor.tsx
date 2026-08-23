import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useBookAppointment } from "../hooks/useAppointment";
import { useGetAllVerifiedDoctors } from "../hooks/useDoctor";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Doctors = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Real API Hooks
  const { data, isLoading } = useGetAllVerifiedDoctors();
  const { mutate: bookAppointment, isPending } = useBookAppointment();

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  });

  const doctors = data?.data?.doctors || [];

  const handleBookClick = (doctor: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    setSelectedDoctor(doctor);
    setFormData({ date: "", time: "", reason: "" });
  };

  const handleClose = () => setSelectedDoctor(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.time) {
      toast.error("Please select a time slot");
      return;
    }

    const endTime =
      (parseInt(formData.time.split(":")[0]) + 1).toString().padStart(2, "0") +
      ":00";

    bookAppointment(
      {
        doctorId: selectedDoctor.id, // REAL Doctor Profile UUID from DB
        appointmentDate: new Date(formData.date).toISOString(),
        startTime: formData.time,
        endTime: endTime,
        type: "IN_PERSON",
        reason: formData.reason,
        notes: "Booked via HealthNova Platform",
      },
      {
        onSuccess: () => {
          handleClose();
          navigate("/appointments");
        },
      },
    );
  };

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  const today = new Date().toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">👨‍⚕️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl">
          <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
            <span>👨‍⚕️</span> Verified Doctors
          </h1>
          <p className="text-white/90 text-sm mt-2">
            Book consultations with verified medical professionals
          </p>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <h3 className="text-xl font-bold text-slate-800">
              No Verified Doctors Yet
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Check back soon! Our admin team is currently verifying doctor
              profiles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {doctors.map((doctor: any) => (
              <motion.div
                key={doctor.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100 hover:shadow-2xl transition space-y-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl font-bold">
                    👨‍⚕️
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Dr. {doctor.user?.name || "Medical Expert"}
                    </h3>
                    <p className="text-sm text-emerald-600 font-semibold">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-semibold text-slate-800">
                      {doctor.experience} Years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultation Fee:</span>
                    <span className="font-bold text-emerald-600">
                      ${doctor.consultationFee}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hospital:</span>
                    <span className="font-semibold text-slate-800">
                      {doctor.hospital || "Private Practice"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {doctor.bio}
                </p>

                <Button
                  onClick={() => handleBookClick(doctor)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
                >
                  📅 Book Appointment
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={handleClose}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
                  <h2 className="font-bold text-lg">
                    Book with Dr. {selectedDoctor.user?.name}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-xl hover:text-red-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        min={today}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Slot *</Label>
                      <select
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        required
                        className="w-full h-10 px-3 border rounded-md focus:border-emerald-500 outline-none text-sm"
                      >
                        <option value="">Select</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Reason for Visit *</Label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      required
                      minLength={10}
                      className="w-full min-h-[80px] p-3 border rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      placeholder="Describe your symptoms/concern (min 10 chars)..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 mt-2"
                  >
                    {isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

const Doctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    reason: "",
  });

  const doctors = [
    {
      name: "Dr. Sarah Ahmed",
      specialization: "Cardiologist",
      experience: "15 years",
      rating: 4.9,
      reviews: 234,
      image: "👩‍⚕️",
      available: true,
      fee: "$50",
    },
    {
      name: "Dr. Ali Khan",
      specialization: "Neurologist",
      experience: "12 years",
      rating: 4.8,
      reviews: 189,
      image: "👨‍⚕️",
      available: true,
      fee: "$60",
    },
    {
      name: "Dr. Fatima Malik",
      specialization: "Dermatologist",
      experience: "10 years",
      rating: 4.9,
      reviews: 312,
      image: "👩‍⚕️",
      available: false,
      fee: "$45",
    },
    {
      name: "Dr. Ahmed Hassan",
      specialization: "Pediatrician",
      experience: "18 years",
      rating: 5.0,
      reviews: 456,
      image: "👨‍⚕️",
      available: true,
      fee: "$40",
    },
    {
      name: "Dr. Ayesha Siddiqui",
      specialization: "Nutritionist",
      experience: "8 years",
      rating: 4.7,
      reviews: 145,
      image: "👩‍⚕️",
      available: true,
      fee: "$35",
    },
    {
      name: "Dr. Bilal Sheikh",
      specialization: "Orthopedic",
      experience: "14 years",
      rating: 4.8,
      reviews: 267,
      image: "👨‍⚕️",
      available: true,
      fee: "$55",
    },
    {
      name: "Dr. Zara Anwar",
      specialization: "Psychologist",
      experience: "11 years",
      rating: 4.9,
      reviews: 198,
      image: "👩‍⚕️",
      available: true,
      fee: "$70",
    },
    {
      name: "Dr. Usman Ali",
      specialization: "General Physician",
      experience: "20 years",
      rating: 4.9,
      reviews: 523,
      image: "👨‍⚕️",
      available: true,
      fee: "$30",
    },
  ];

  const handleBookClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      reason: "",
    });
  };

  const handleClose = () => {
    setSelectedDoctor(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Appointment booked with ${selectedDoctor?.name} on ${formData.date} at ${formData.time}! 📅`,
    );
    handleClose();
  };

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  // Minimum date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">👨‍⚕️</span>
              Our Doctors
            </h1>
            <p className="text-white/90 text-lg">
              Connect with certified healthcare professionals
            </p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100">
            <div className="text-4xl mb-2">👨‍⚕️</div>
            <p className="text-3xl font-bold text-emerald-600">500+</p>
            <p className="text-sm text-slate-500">Expert Doctors</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100">
            <div className="text-4xl mb-2">🏥</div>
            <p className="text-3xl font-bold text-teal-600">50+</p>
            <p className="text-sm text-slate-500">Specializations</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-3xl font-bold text-cyan-600">4.9</p>
            <p className="text-sm text-slate-500">Average Rating</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100">
            <div className="text-4xl mb-2">😊</div>
            <p className="text-3xl font-bold text-emerald-600">10K+</p>
            <p className="text-sm text-slate-500">Happy Patients</p>
          </div>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-2xl hover:border-emerald-300 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-6xl">{doctor.image}</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-emerald-600 font-semibold">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>
                {doctor.available && (
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-semibold text-slate-700">
                    {doctor.experience}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Rating:</span>
                  <span className="font-semibold text-slate-700">
                    ⭐ {doctor.rating} ({doctor.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Consultation:</span>
                  <span className="font-bold text-emerald-600">
                    {doctor.fee}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                {doctor.available ? (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    ✅ Available Now
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                    ⏰ Available Tomorrow
                  </span>
                )}
              </div>

              <Button
                onClick={() => handleBookClick(doctor)}
                disabled={!doctor.available}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 disabled:opacity-50"
              >
                {doctor.available ? "📅 Book Appointment" : "Not Available"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white text-center shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">
            Can't find the right doctor?
          </h2>
          <p className="text-white/90 mb-4">
            Use our AI Symptom Checker to get instant health guidance
          </p>
          <Button className="bg-white text-emerald-600 hover:bg-slate-50">
            🩺 Try AI Symptom Checker
          </Button>
        </motion.div>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={handleClose}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-t-3xl p-6 text-white relative">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{selectedDoctor.image}</div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedDoctor.name}
                      </h2>
                      <p className="text-white/90">
                        {selectedDoctor.specialization}
                      </p>
                      <p className="text-white/80 text-sm mt-1">
                        Fee: {selectedDoctor.fee} • ⭐ {selectedDoctor.rating}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    📅 Book Your Appointment
                  </h3>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+92 300 1234567"
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Date *</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        min={today}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Time *</Label>
                      <select
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        required
                        className="w-full h-11 px-3 border-2 border-slate-200 rounded-md focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label>Reason for Visit *</Label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      placeholder="Briefly describe your health concern..."
                      required
                      minLength={10}
                      className="w-full min-h-[100px] p-3 border-2 border-slate-200 rounded-md focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-sm text-emerald-800">
                      💡 <strong>Note:</strong> You will receive a confirmation
                      email once the appointment is booked.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={handleClose}
                      variant="outline"
                      className="flex-1 h-12"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
                    >
                      📅 Confirm Booking
                    </Button>
                  </div>
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

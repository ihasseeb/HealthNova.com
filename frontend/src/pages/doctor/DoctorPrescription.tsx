import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetDoctorPrescriptions } from "../../hooks/usePrescription";

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetDoctorPrescriptions();
  const prescriptions = data?.data?.prescriptions || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">📋</div>
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
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <span>📋</span> Issued Prescriptions
            </h1>
            <p className="text-white/90 text-sm mt-1">
              History of all digital prescriptions created by you
            </p>
          </div>
          <Button
            onClick={() => navigate("/doctor/create-prescription")}
            className="bg-white text-emerald-600 hover:bg-slate-50 font-semibold shadow-lg"
          >
            + Issue New Rx
          </Button>
        </div>

        {/* List */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100 space-y-4">
            <div className="text-5xl">📭</div>
            <h3 className="text-xl font-bold text-slate-800">
              No Prescriptions Issued Yet
            </h3>
            <p className="text-slate-500 text-sm">
              Click the button below to write your first digital prescription.
            </p>
            <Button
              onClick={() => navigate("/doctor/create-prescription")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              + Issue First Prescription
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx: any) => (
              <motion.div
                key={rx.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl p-6 shadow border border-emerald-100 space-y-4"
              >
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      Patient: {rx.patient?.name || "Patient"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {rx.patient?.email}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-xl text-sm">
                  <strong className="text-slate-800">Diagnosis:</strong>{" "}
                  <span className="text-slate-700">{rx.diagnosis}</span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-700 mb-2">
                    Prescribed Medicines:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rx.medicines?.map((med: any) => (
                      <span
                        key={med.id}
                        className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-xs font-medium text-slate-700"
                      >
                        💊 {med.medicineName} ({med.dosage}) - {med.frequency} [
                        {med.duration}]
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorPrescriptions;

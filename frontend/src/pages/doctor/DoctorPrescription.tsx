import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetDoctorPrescriptions } from "../../hooks/usePrescription";
import { ScrollText, Plus } from "lucide-react";

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetDoctorPrescriptions();
  const prescriptions = data?.data?.prescriptions || [];

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
              <ScrollText size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Rx Records
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                History of all digital prescriptions
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/doctor/create-prescription")}
            className="w-full md:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-12"
          >
            <Plus size={18} className="mr-2" /> Issue New Rx
          </Button>
        </div>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-slate-100">
            <ScrollText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">
              No Prescriptions Issued
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx: any) => (
              <motion.div
                key={rx.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 transition-all"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {rx.patient?.name || "Patient"}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                      {rx.patient?.email}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Diagnosis
                  </span>
                  <p className="text-sm font-medium text-slate-800">
                    {rx.diagnosis}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Medications
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {rx.medicines?.map((med: any) => (
                      <div
                        key={med.id}
                        className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 flex flex-col gap-0.5"
                      >
                        <span className="font-bold text-slate-900">
                          {med.medicineName}{" "}
                          <span className="text-slate-500 font-normal">
                            ({med.dosage})
                          </span>
                        </span>
                        <span className="text-slate-500">
                          {med.frequency} • {med.duration}
                        </span>
                      </div>
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

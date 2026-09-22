import { motion } from "framer-motion";
import { useGetPatientPrescriptions } from "../../hooks/usePrescription";
import { Pill, FileText, Calendar, User } from "lucide-react";

const PatientPrescriptions = () => {
  const { data, isLoading } = useGetPatientPrescriptions();
  const prescriptions = data?.data?.prescriptions || [];

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
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
              <Pill size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                My Prescriptions
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Digital Rx records issued by certified doctors
              </p>
            </div>
          </div>
        </div>

        {/* List */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-200/60">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No Prescriptions Found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              You haven't received any digital prescriptions yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((rx: any) => (
              <motion.div
                key={rx.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 space-y-5"
              >
                {/* Rx Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        Dr. {rx.doctor?.user?.name || "Attending Physician"}
                      </h3>
                      <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">
                        {rx.doctor?.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Issued On
                    </span>
                    <p className="text-xs font-bold text-slate-700">
                      {new Date(rx.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  <span className="font-bold text-slate-800">Diagnosis: </span>
                  <span className="text-slate-600 font-medium">
                    {rx.diagnosis}
                  </span>
                </div>

                {/* Medications Table */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                    Prescribed Medications
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3 rounded-l-xl">Medicine</th>
                          <th className="p-3">Dosage</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3 rounded-r-xl">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rx.medicines?.map((med: any) => (
                          <tr key={med.id}>
                            <td className="p-3 font-bold text-slate-900">
                              {med.medicineName}
                            </td>
                            <td className="p-3 font-mono font-medium">
                              {med.dosage}
                            </td>
                            <td className="p-3 font-medium">{med.frequency}</td>
                            <td className="p-3 font-medium">{med.duration}</td>
                            <td className="p-3 text-slate-500 font-medium">
                              {med.instructions || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Doctor Notes */}
                {rx.notes && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                    <strong className="text-slate-700">Doctor Notes:</strong>{" "}
                    {rx.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PatientPrescriptions;

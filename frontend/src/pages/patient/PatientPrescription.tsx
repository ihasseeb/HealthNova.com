import { motion } from "framer-motion";
import { useGetPatientPrescriptions } from "../../hooks/usePrescription";

const PatientPrescriptions = () => {
  const { data, isLoading } = useGetPatientPrescriptions();
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
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
            <span>💊</span> My Prescriptions
          </h1>
          <p className="text-white/90 text-sm mt-1">
            Digital records of all medications issued by your doctors
          </p>
        </div>

        {/* Prescription List */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="text-xl font-bold text-slate-800">
              No Prescriptions Found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              You haven't received any medical prescriptions yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((rx: any) => (
              <motion.div
                key={rx.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 space-y-4"
              >
                {/* Prescription Header */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      Dr. {rx.doctor?.user?.name || "Doctor"}
                    </h3>
                    <p className="text-xs text-emerald-600 font-semibold">
                      {rx.doctor?.specialization}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Issued On</span>
                    <p className="text-xs font-bold text-slate-700">
                      {new Date(rx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-sm">
                  <span className="font-bold text-slate-800">Diagnosis: </span>
                  <span className="text-slate-700">{rx.diagnosis}</span>
                </div>

                {/* Medicines Table */}
                <div>
                  <h4 className="font-bold text-sm text-slate-800 mb-2">
                    💊 Prescribed Medications:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-100 text-slate-800 uppercase font-bold">
                        <tr>
                          <th className="p-2.5 rounded-l-lg">Medicine</th>
                          <th className="p-2.5">Dosage</th>
                          <th className="p-2.5">Frequency</th>
                          <th className="p-2.5">Duration</th>
                          <th className="p-2.5 rounded-r-lg">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-b">
                        {rx.medicines?.map((med: any) => (
                          <tr key={med.id}>
                            <td className="p-2.5 font-bold text-slate-800">
                              {med.medicineName}
                            </td>
                            <td className="p-2.5">{med.dosage}</td>
                            <td className="p-2.5">{med.frequency}</td>
                            <td className="p-2.5">{med.duration}</td>
                            <td className="p-2.5 text-slate-500">
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
                  <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <strong>Doctor Notes:</strong> {rx.notes}
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

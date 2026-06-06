const StatCard = ({ icon: Icon, label, value, accent = "text-teal-600" }) => (
  <div className="card flex items-center gap-4">
    <div className={`rounded-md bg-slate-100 p-3 dark:bg-slate-800 ${accent}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="label">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value ?? 0}</p>
    </div>
  </div>
);

export default StatCard;

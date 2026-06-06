const toneMap = {
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  closed: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  applied: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  reviewing: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  shortlisted: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  selected: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
  placed: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
};

const StatusBadge = ({ value }) => {
  const label = String(value || "unknown").replaceAll("_", " ");
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneMap[value] || toneMap.closed}`}>{label}</span>;
};

export default StatusBadge;

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Building2, CheckCircle2, FileText, GraduationCap, Star } from "lucide-react";
import api, { getData } from "../../api/client.js";
import StatCard from "../../components/StatCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(getData(res)));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={GraduationCap} label="Students" value={stats?.totalStudents} accent="text-teal-600" />
        <StatCard icon={Building2} label="Companies" value={stats?.totalCompanies} accent="text-amber-600" />
        <StatCard icon={BriefcaseBusiness} label="Jobs" value={stats?.totalJobs} accent="text-indigo-600" />
        <StatCard icon={FileText} label="Applications" value={stats?.totalApplications} accent="text-sky-600" />
        <StatCard icon={Star} label="Shortlisted" value={stats?.shortlistedCandidates} accent="text-rose-600" />
        <StatCard icon={CheckCircle2} label="Placed" value={stats?.placedStudents} accent="text-emerald-600" />
      </div>
      <section className="card space-y-4">
        <h2 className="text-xl font-bold">Recent Applications</h2>
        <div className="grid gap-3">
          {stats?.latestApplications?.map((app) => (
            <div key={app._id} className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{app.student?.user?.name} applied for {app.job?.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{app.company?.companyName}</p>
              </div>
              <StatusBadge value={app.status} />
            </div>
          ))}
        </div>
        {!stats?.latestApplications?.length && <EmptyState title="No applications to show." />}
      </section>
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import api, { getData } from "../../api/client.js";
import EmptyState from "../../components/EmptyState.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const statuses = ["applied", "reviewing", "shortlisted", "rejected", "selected"];

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);

  const load = async () => {
    const res = await api.get("/applications/company");
    setApplications(getData(res));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/applications/${id}/status`, { status });
    load();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Applications Received</h2>
      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app._id} className="card grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div>
              <h3 className="font-bold">{app.student?.user?.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{app.student?.user?.email} • {app.job?.title}</p>
              {app.resumeUrl && <a className="mt-1 inline-block text-sm font-semibold text-teal-700 dark:text-teal-300" href={app.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}
            </div>
            <StatusBadge value={app.status} />
            <select className="input w-full lg:w-44" value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        ))}
      </div>
      {!applications.length && <EmptyState title="No applications received yet." />}
    </div>
  );
};

export default CompanyApplications;

import { useEffect, useState } from "react";
import api, { getData } from "../../api/client.js";
import EmptyState from "../../components/EmptyState.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/applications/mine").then((res) => setApplications(getData(res)));
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Application Tracking</h2>
      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app._id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold">{app.job?.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{app.company?.companyName} • {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <StatusBadge value={app.status} />
          </div>
        ))}
      </div>
      {!applications.length && <EmptyState title="No applications yet." />}
    </div>
  );
};

export default StudentApplications;

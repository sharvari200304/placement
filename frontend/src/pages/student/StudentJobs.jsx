import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import api, { getData } from "../../api/client.js";
import EmptyState from "../../components/EmptyState.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    const res = await api.get(`/jobs?status=open&q=${encodeURIComponent(q)}`);
    setJobs(getData(res));
  };

  useEffect(() => { load(); }, []);

  const apply = async (jobId) => {
    try {
      await api.post(`/applications/jobs/${jobId}`, {});
      setNotice("Application submitted");
    } catch (error) {
      setNotice(error.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Available Jobs</h2>
        <div className="flex gap-2">
          <input className="input w-64" placeholder="Search jobs" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn-secondary" onClick={load}>Search</button>
        </div>
      </div>
      {notice && <p className="rounded-md bg-teal-50 p-3 text-sm font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-200">{notice}</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        {jobs.map((job) => (
          <article key={job._id} className="card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{job.company?.companyName} • {job.location}</p>
              </div>
              <StatusBadge value={job.status} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{job.description}</p>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired?.map((skill) => <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{skill}</span>)}
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>{job.salaryPackage || "Package not disclosed"}</span>
              <button className="btn-primary" onClick={() => apply(job._id)}><Send size={16} /> Apply</button>
            </div>
          </article>
        ))}
      </div>
      {!jobs.length && <EmptyState title="No open jobs found." />}
    </div>
  );
};

export default StudentJobs;

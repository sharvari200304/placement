import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api, { getData } from "../../api/client.js";
import EmptyState from "../../components/EmptyState.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const emptyJob = {
  title: "",
  description: "",
  roleType: "full_time",
  location: "",
  salaryPackage: "",
  minCgpa: "",
  departments: "",
  graduationYears: "",
  skillsRequired: "",
  deadline: ""
};

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [notice, setNotice] = useState("");

  const load = async () => {
    const res = await api.get("/jobs/mine");
    setJobs(getData(res));
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      roleType: form.roleType,
      location: form.location,
      salaryPackage: form.salaryPackage,
      deadline: form.deadline,
      eligibility: {
        minCgpa: Number(form.minCgpa || 0),
        departments: form.departments.split(",").map((item) => item.trim()).filter(Boolean),
        graduationYears: form.graduationYears.split(",").map((item) => Number(item.trim())).filter(Boolean)
      },
      skillsRequired: form.skillsRequired.split(",").map((item) => item.trim()).filter(Boolean)
    };
    await api.post("/jobs", payload);
    setNotice("Job posted");
    setForm(emptyJob);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/jobs/${id}`);
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="card space-y-4">
        <h2 className="text-xl font-bold">Create Job Posting</h2>
        {notice && <p className="rounded-md bg-teal-50 p-3 text-sm font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-200">{notice}</p>}
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="input" value={form.roleType} onChange={(e) => setForm({ ...form, roleType: e.target.value })}>
            <option value="full_time">Full time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
          <input className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
        </div>
        <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <input className="input" placeholder="Salary package" value={form.salaryPackage} onChange={(e) => setForm({ ...form, salaryPackage: e.target.value })} />
        <input className="input" placeholder="Minimum CGPA" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} />
        <input className="input" placeholder="Departments, comma separated" value={form.departments} onChange={(e) => setForm({ ...form, departments: e.target.value })} />
        <input className="input" placeholder="Graduation years, comma separated" value={form.graduationYears} onChange={(e) => setForm({ ...form, graduationYears: e.target.value })} />
        <input className="input" placeholder="Skills required, comma separated" value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
        <button className="btn-primary w-full"><Plus size={18} /> Post Job</button>
      </form>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">My Jobs</h2>
        {jobs.map((job) => (
          <article key={job._id} className="card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{job.location} • {job.salaryPackage}</p>
              </div>
              <StatusBadge value={job.status} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{job.description}</p>
            <button className="btn-secondary text-rose-700 dark:text-rose-300" onClick={() => remove(job._id)}><Trash2 size={16} /> Delete</button>
          </article>
        ))}
        {!jobs.length && <EmptyState title="No jobs posted yet." />}
      </section>
    </div>
  );
};

export default CompanyJobs;

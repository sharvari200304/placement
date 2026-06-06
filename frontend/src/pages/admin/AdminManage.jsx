import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api, { getData } from "../../api/client.js";
import EmptyState from "../../components/EmptyState.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const AdminManage = () => {
  const [tab, setTab] = useState("students");
  const [data, setData] = useState({ students: [], companies: [], jobs: [], applications: [] });

  const load = async () => {
    const [students, companies, jobs, applications] = await Promise.all([
      api.get("/students"),
      api.get("/companies"),
      api.get("/jobs"),
      api.get("/applications")
    ]);
    setData({
      students: getData(students),
      companies: getData(companies),
      jobs: getData(jobs),
      applications: getData(applications)
    });
  };

  useEffect(() => { load(); }, []);

  const remove = async (type, id) => {
    const map = {
      students: `/students/${id}`,
      companies: `/companies/${id}`,
      jobs: `/jobs/${id}`,
      applications: `/applications/${id}`
    };
    await api.delete(map[type]);
    load();
  };

  const renderRows = () => {
    if (tab === "students") return data.students.map((item) => (
      <Row key={item._id} title={item.user?.name} subtitle={`${item.department || "No department"} • CGPA ${item.cgpa || "-"}`} meta={<StatusBadge value={item.placementStatus} />} onDelete={() => remove("students", item._id)} />
    ));
    if (tab === "companies") return data.companies.map((item) => (
      <Row key={item._id} title={item.companyName} subtitle={`${item.industry || "Industry not set"} • ${item.location || "Location not set"}`} meta={item.isVerified ? "Verified" : "Pending"} onDelete={() => remove("companies", item._id)} />
    ));
    if (tab === "jobs") return data.jobs.map((item) => (
      <Row key={item._id} title={item.title} subtitle={`${item.company?.companyName || "Company"} • ${item.location}`} meta={<StatusBadge value={item.status} />} onDelete={() => remove("jobs", item._id)} />
    ));
    return data.applications.map((item) => (
      <Row key={item._id} title={`${item.student?.user?.name || "Student"} -> ${item.job?.title || "Job"}`} subtitle={item.company?.companyName} meta={<StatusBadge value={item.status} />} onDelete={() => remove("applications", item._id)} />
    ));
  };

  const rows = renderRows();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Manage Records</h2>
        <div className="flex flex-wrap gap-2">
          {["students", "companies", "jobs", "applications"].map((item) => (
            <button key={item} className={tab === item ? "btn-primary" : "btn-secondary"} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <section className="space-y-3">
        {rows}
        {!rows.length && <EmptyState title={`No ${tab} found.`} />}
      </section>
    </div>
  );
};

const Row = ({ title, subtitle, meta, onDelete }) => (
  <div className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-sm font-semibold">{meta}</div>
      <button className="btn-secondary px-3 text-rose-700 dark:text-rose-300" onClick={onDelete} title="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

export default AdminManage;

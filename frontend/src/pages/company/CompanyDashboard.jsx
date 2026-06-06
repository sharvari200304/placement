import { useEffect, useState } from "react";
import { BriefcaseBusiness, FileText, ShieldCheck } from "lucide-react";
import api, { getData } from "../../api/client.js";
import StatCard from "../../components/StatCard.jsx";

const CompanyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [profileRes, jobsRes, appsRes] = await Promise.all([
      api.get("/companies/me"),
      api.get("/jobs/mine"),
      api.get("/applications/company")
    ]);
    const profile = getData(profileRes);
    setProfile(profile);
    setJobs(getData(jobsRes));
    setApplications(getData(appsRes));
    setForm({
      companyName: profile?.companyName || "",
      industry: profile?.industry || "",
      website: profile?.website || "",
      location: profile?.location || "",
      contactPerson: profile?.contactPerson || "",
      phone: profile?.phone || "",
      description: profile?.description || ""
    });
  };

  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.put("/companies/me", form);
      setMessage("Profile updated");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const detailRows = [
    ["Company name", profile?.companyName],
    ["Industry", profile?.industry],
    ["Location", profile?.location],
    ["Contact person", profile?.contactPerson],
    ["Phone", profile?.phone],
    ["Email", profile?.user?.email]
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={BriefcaseBusiness} label="Jobs Posted" value={jobs.length} accent="text-teal-600" />
        <StatCard icon={FileText} label="Applications" value={applications.length} accent="text-amber-600" />
        <StatCard icon={ShieldCheck} label="Verified" value={profile?.isVerified ? "Yes" : "No"} accent="text-indigo-600" />
      </div>
      <section className="card space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">Current Company Details</h2>
          <span className={`text-sm font-semibold ${profile?.isVerified ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
            {profile?.isVerified ? "Verified" : "Pending"}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {detailRows.map(([label, value]) => (
            <DetailItem key={label} label={label} value={value} />
          ))}
        </div>
        {profile?.description && (
          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <p className="label">Description</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{profile.description}</p>
          </div>
        )}
        {profile?.website && <a className="inline-block text-sm font-semibold text-teal-700 dark:text-teal-300" href={profile.website} target="_blank" rel="noreferrer">Website</a>}
      </section>
      <form onSubmit={save} className="card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Company Profile</h2>
          {message && <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">{message}</span>}
        </div>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["companyName", "Company name"],
            ["industry", "Industry"],
            ["website", "Website"],
            ["location", "Location"],
            ["contactPerson", "Contact person"],
            ["phone", "Phone"]
          ].map(([key, label]) => (
            <label key={key} className="space-y-1">
              <span className="label">{label}</span>
              <input className="input" value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
          ))}
        </div>
        <label className="space-y-1">
          <span className="label">Description</span>
          <textarea className="input min-h-24" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <button className="btn-primary">Save Profile</button>
      </form>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
    <p className="label">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{value || "-"}</p>
  </div>
);

export default CompanyDashboard;

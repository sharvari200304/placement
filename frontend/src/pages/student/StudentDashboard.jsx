import { useEffect, useState } from "react";
import { BriefcaseBusiness, FileText, GraduationCap } from "lucide-react";
import api, { getData } from "../../api/client.js";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [profileRes, jobsRes, appsRes] = await Promise.all([
      api.get("/students/me"),
      api.get("/jobs?status=open"),
      api.get("/applications/mine")
    ]);
    const profile = getData(profileRes);
    setProfile(profile);
    setForm({
      rollNumber: profile?.rollNumber || "",
      department: profile?.department || "",
      graduationYear: profile?.graduationYear || "",
      cgpa: profile?.cgpa || "",
      skills: profile?.skills?.join(", ") || "",
      phone: profile?.phone || "",
      resumeUrl: profile?.resumeUrl || "",
      portfolioUrl: profile?.portfolioUrl || ""
    });
    setJobs(getData(jobsRes));
    setApplications(getData(appsRes));
  };

  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    const payload = {
      ...form,
      graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      cgpa: form.cgpa ? Number(form.cgpa) : undefined,
      skills: (form.skills || "").split(",").map((item) => item.trim()).filter(Boolean)
    };
    try {
      await api.put("/students/me", payload);
      setMessage("Profile updated");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const detailRows = [
    ["Name", profile?.user?.name],
    ["Email", profile?.user?.email],
    ["Roll number", profile?.rollNumber],
    ["Department", profile?.department],
    ["Graduation year", profile?.graduationYear],
    ["CGPA", profile?.cgpa],
    ["Phone", profile?.phone]
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={BriefcaseBusiness} label="Open Jobs" value={jobs.length} accent="text-teal-600" />
        <StatCard icon={FileText} label="Applications" value={applications.length} accent="text-amber-600" />
        <StatCard icon={GraduationCap} label="Status" value={<StatusBadge value={profile?.placementStatus} />} accent="text-indigo-600" />
      </div>
      <section className="card space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">Current Profile Details</h2>
          <StatusBadge value={profile?.placementStatus} />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {detailRows.map(([label, value]) => (
            <DetailItem key={label} label={label} value={value} />
          ))}
        </div>
        {!!profile?.skills?.length && (
          <div className="space-y-2">
            <p className="label">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {profile?.resumeUrl && <a className="text-sm font-semibold text-teal-700 dark:text-teal-300" href={profile.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}
          {profile?.portfolioUrl && <a className="text-sm font-semibold text-teal-700 dark:text-teal-300" href={profile.portfolioUrl} target="_blank" rel="noreferrer">Portfolio</a>}
        </div>
      </section>
      <form onSubmit={save} className="card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Student Profile</h2>
          {message && <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">{message}</span>}
        </div>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["rollNumber", "Roll number"],
            ["department", "Department"],
            ["graduationYear", "Graduation year"],
            ["cgpa", "CGPA"],
            ["phone", "Phone"],
            ["resumeUrl", "Resume URL"],
            ["portfolioUrl", "Portfolio URL"],
            ["skills", "Skills, comma separated"]
          ].map(([key, label]) => (
            <label key={key} className="space-y-1">
              <span className="label">{label}</span>
              <input className="input" value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
          ))}
        </div>
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

export default StudentDashboard;

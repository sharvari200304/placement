import { BriefcaseBusiness, Building2, GraduationCap, LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const navByRole = {
  student: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/jobs", label: "Jobs", icon: BriefcaseBusiness },
    { to: "/student/applications", label: "Applications", icon: GraduationCap }
  ],
  company: [
    { to: "/company", label: "Dashboard", icon: LayoutDashboard },
    { to: "/company/jobs", label: "Jobs", icon: BriefcaseBusiness },
    { to: "/company/applications", label: "Applications", icon: GraduationCap }
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/manage", label: "Manage", icon: Building2 }
  ]
};

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="rounded-md bg-teal-600 p-2 text-white"><GraduationCap size={22} /></div>
          <div>
            <p className="font-bold">Placement Cell</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {navByRole[user?.role]?.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split("/").length === 2}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
              <h1 className="text-lg font-bold">{user?.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary px-3" onClick={() => setDark((value) => !value)} title="Toggle dark mode">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="btn-secondary px-3" onClick={signOut} title="Sign out">
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {navByRole[user?.role]?.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to.split("/").length === 2} className="btn-secondary whitespace-nowrap px-3">
                <item.icon size={16} /> {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

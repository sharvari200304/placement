import { GraduationCap } from "lucide-react";

const AuthShell = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div className="grid min-h-screen lg:grid-cols-[1fr_480px]">
      <section className="hidden bg-slate-900 text-white lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-teal-500 p-2"><GraduationCap size={28} /></div>
            <span className="text-xl font-bold">Placement Cell Portal</span>
          </div>
          <div>
            <p className="max-w-xl text-4xl font-bold leading-tight">Campus recruitment, tracked from profile to placement.</p>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {["Students", "Companies", "Admins"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold">{item}</div>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-300">Local MongoDB, JWT auth, and role-based workflows.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 inline-flex rounded-md bg-teal-600 p-2 text-white"><GraduationCap size={24} /></div>
            <p className="text-xl font-bold">Placement Cell Portal</p>
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </div>
  </div>
);

export default AuthShell;

import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentJobs from "./pages/student/StudentJobs.jsx";
import StudentApplications from "./pages/student/StudentApplications.jsx";
import CompanyDashboard from "./pages/company/CompanyDashboard.jsx";
import CompanyJobs from "./pages/company/CompanyJobs.jsx";
import CompanyApplications from "./pages/company/CompanyApplications.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminManage from "./pages/admin/AdminManage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const HomeRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user ? `/${user.role}` : "/login"} replace />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute roles={["student"]} />}>
      <Route element={<AppLayout />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/jobs" element={<StudentJobs />} />
        <Route path="/student/applications" element={<StudentApplications />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute roles={["company"]} />}>
      <Route element={<AppLayout />}>
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/company/jobs" element={<CompanyJobs />} />
        <Route path="/company/applications" element={<CompanyApplications />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute roles={["admin"]} />}>
      <Route element={<AppLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manage" element={<AdminManage />} />
      </Route>
    </Route>
    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);

export default App;

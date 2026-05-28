import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import Create_form from "./components/Create_form";
import MyFormsPage from "./pages/MyFormsPage";
import ViewFormPage from "./pages/ViewFormPage";
import SendEmailPage from "./pages/SendEmailPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import UserPage from "./pages/UserPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import FillFormPage from "./pages/FillFormPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registo" element={<RegisterPage />} />
      <Route path="/passwd" element={<SendEmailPage />} />
      <Route path="/passwd/:id" element={<PasswordResetPage />} />

      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />

      <Route
        path="/criar-formulario"
        element={
          <AdminRoute>
            <Create_form />
          </AdminRoute>
        }
      />

      <Route
        path="/criar-formulario/:id"
        element={
          <AdminRoute>
            <Create_form />
          </AdminRoute>
        }
      />

      <Route
        path="/meus-formularios"
        element={
          <AdminRoute>
            <MyFormsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/formulario/:id"
        element={
          <AdminRoute>
            <ViewFormPage />
          </AdminRoute>
        }
      />

      <Route path="/profile"
        element={
          <PrivateRoute>
            <UserPage/>
          </PrivateRoute>
        }
      />

      <Route
        path="/inicio"
        element={
          <UserRoute>
            <UserDashboardPage />
          </UserRoute>
        }
      />

      <Route
        path="/inicio/preenchimentos"
        element={
          <UserRoute>
            <MySubmissionsPage />
          </UserRoute>
        }
      />

      <Route
        path="/preencher/:id"
        element={
          <UserRoute>
            <FillFormPage />
          </UserRoute>
        }
      />

      <Route
        path="/preencher/:id/continuar/:submissionId"
        element={
          <UserRoute>
            <FillFormPage />
          </UserRoute>
        }
      />
    </Routes>
  );
}

export default App;

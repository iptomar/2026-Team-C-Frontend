import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import Create_form from "./components/Create_form";
import MyFormsPage from "./pages/MyFormsPage";
import ViewFormPage from "./pages/ViewFormPage";
import SendEmailPage from "./pages/SendEmailPage";
import PasswordResetPage from "./pages/PasswordResetPage";

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
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/criar-formulario"
        element={
          <PrivateRoute>
            <Create_form />
          </PrivateRoute>
        }
      />

      <Route
        path="/criar-formulario/:id"
        element={
          <PrivateRoute>
            <Create_form />
          </PrivateRoute>
        }
      />

      <Route
        path="/meus-formularios"
        element={
          <PrivateRoute>
            <MyFormsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/formulario/:id"
        element={
          <PrivateRoute>
            <ViewFormPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

import "../css/UserPage.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getUser, removeToken} from "../utils/session";

export default function UserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser().user);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function resetPass(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError("A nova palavra-passe e a confirmação não coincidem.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getUser()?.token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to change password");
      }
      setSuccess("Password changed successfully");
      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });

      setTimeout(() => {
        setSuccess("");
        removeToken();
        navigate("/login");
        //clear cookies
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div id="userpage">
      <div id="user-info">
          <h1>User Profile</h1>
          <p><strong>Name:</strong> {user?.name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Role:</strong> {user?.role || "N/A"}</p>
      </div>
      <div>
        <p> change password </p>
        <form onSubmit={resetPass}>
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
          />
          <button type="submit">Change Password</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );

}
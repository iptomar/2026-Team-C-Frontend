import "../css/UserPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {getUser} from "../utils/session";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(getUser());



  return (
    <div id="userpage">
        <h1>User Profile</h1>
        <p><strong>Name:</strong> {user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
        <p><strong>Role:</strong> {user?.role || "N/A"}</p>
    </div>
  );

}
import "../css/UserPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);   




  return (
    <div id="userpage">
        <h1>User Profile</h1>
        
    </div>
  );

}
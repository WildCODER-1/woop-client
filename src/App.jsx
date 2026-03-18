import { useState, useEffect } from "react";
import LoginPage from "./features/auth/components/Loginpage";
import CustomerApp from "./features/customer/components/Customerapp";
import WasherApp from "./features/washer/components/Washerapp";
import AdmindDashboard from "./features/admin/components/Admindashboard";
import { getSession, logout } from "./features/auth/services/Auth";


export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setReady(true);
  }, []);

  const handleLogin  = (u) => setUser(u);
  const handleLogout = () => { logout(); setUser(null); };

  if (!ready) return null;

  if (!user) return <LoginPage onLogin={handleLogin}/>;

  if (user.role === "washer") return <WasherApp       user={user} onLogout={handleLogout}/>;
  // if (user.role === "admin")  return <AdminDashboard  user={user} onLogout={handleLogout}/>;
  return                             <CustomerApp     user={user} onLogout={handleLogout}/>;
}
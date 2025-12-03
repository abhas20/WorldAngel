import useAuth from "../../auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestLayout() {
  const { auth } = useAuth();


 if (auth?.accessToken) {
   return <Navigate to="/" replace />;
 }

 return <Outlet />;
}

import { useEffect, useState } from "react";
import useAuth from "../../auth/hooks/useAuth"
import useRefreshToken from "../../auth/hooks/useRefreshToken";
import Loader from "../ui/Loader";
import { Outlet } from "react-router-dom";
import Headers from "../ui/Headers";



function PersistentLayount() {
    const {auth,fetchUser}=useAuth();
    const refresh=useRefreshToken();
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const verify=async () => {
            try {
                await refresh();
                await fetchUser();
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }
        !auth?.accessToken? verify() :setLoading(false)

    },[])


  return (
    <>
    {loading?<Loader/>:
    <>
    <Outlet/>
    </>}
    </>
  )
}



export default PersistentLayount


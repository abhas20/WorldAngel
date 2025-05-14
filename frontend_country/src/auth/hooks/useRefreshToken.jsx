import { refreshToken } from "../../api/authApi";
import useAuth from "./useAuth"


function useRefreshToken() {

    const {setAuth}=useAuth();

    const newrefreshToken=async()=>{
        const res=await refreshToken();
        setAuth(prev=>{
            console.log(prev);
            return {...prev,accessToken:res.data.message.accessToken}
        })
        return res.data.message.accessToken;
    }
  return newrefreshToken
}

export default useRefreshToken

import React, { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth';
import { privateApi } from '../../api/authApi';

const useAxiosPrivate = () => {
    const refresh=useRefreshToken();
    const {auth}=useAuth();

    useEffect(()=>{

        const requestIntercept=privateApi.interceptors.request.use(
            config=>{
                if(!config.headers['Authorization']){
                    config.headers['Authorization']= `Bearer ${auth?.accessToken}`
                }
                return config;
            },error=>Promise.reject(error)
        )

        const responseIntercept= privateApi.interceptors.response.use(
            response=>response,
            async error=>{
                const prevRequest=error?.config;
                if(error?.response?.status===401 && !prevRequest?.sent) {
                    prevRequest.sent=true;
                    const newAccessToken=await refresh();
                    prevRequest.headers['Authorization']=`Bearer ${newAccessToken}`;

                    return privateApi(prevRequest);
                }
                return Promise.reject(error)
            }
        )
        return ()=>{
            privateApi.interceptors.request.eject(requestIntercept);
            privateApi.interceptors.response.eject(responseIntercept);
        }

    },[auth,refresh])

  return privateApi;
}

export default useAxiosPrivate

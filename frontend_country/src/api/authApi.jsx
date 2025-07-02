import axios from 'axios'
axios.defaults.withCredentials = true;

const api=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1/user",
    withCredentials:true
})

export const privateApi=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    headers:{"Content-Type":"application/json"},
    withCredentials:true
})


export const register=async(data)=>{
    const signup=await api.post("/signup",data,{headers:{
        'Content-Type':"application/json"
    }})
    return signup;
}

export const login=async(data)=>{
    const logedUser=await api.post("/login",data,{headers:{
        'Content-Type':"application/json"
    }})
    return logedUser;
}

export const logout=async()=>{
    const loggedoutUser=await api.post("/logout",{headers:{
        "Content-Type":"application/json"
    }})
    return loggedoutUser;
}

export const refreshToken=async()=>{
    const response=await api.post("/refresh-token",null,{withCredentials:true})
    return response;
}

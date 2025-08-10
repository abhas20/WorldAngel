import axios from "axios";
axios.defaults.withCredentials = true;

const api=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1",
    withCredentials:true
})

export const createRoom= async (data) => {
    const response = await api.post("/chat/create-room", data, {
        headers: {
            'Content-Type': "application/json"
        }
    });
    return response;
}

export const joinRoom = async (data) => {
    const response = await api.post("/chat/join-room", data, {
        headers: {
            'Content-Type': "application/json"
        }
    });
    return response;
}

export const getAllRooms = async () => {
    const response = await api.get("/chat/get-all-rooms");
    // console.log(response);
    return response;
}

export const sendMessage = async (data) => {
    const response = await api.post("/chat/send-message", data, {
        headers: {
            'Content-Type': "multipart/form-data"
        }
    });
    return response;
}

export const getMessages = async (room_name) => {
    const response = await api.get("/chat/get-messages", {
        params: { room_name },
        headers: {
            'Content-Type': "application/json"
        }
    });
    return response;
}
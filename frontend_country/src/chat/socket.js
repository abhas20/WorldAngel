import {io} from 'socket.io-client'

const socket=io(import.meta.env.VITE_BACKEND_URL_SOCKET ,{
    withCredentials:true,
    transports: ['websocket'],
})

export default socket;
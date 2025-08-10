import {io} from 'socket.io-client'

const socket=io(import.meta.env.VITE_BACKEND_URL_SOCKET || "http://localhost:8080")

export default socket;


const setUpSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected: ", socket.id);

        socket.on("join_room_socket",(roomName)=>{
            socket.join(roomName);
            console.log(`Socket with ID: ${socket.id} joined room: ${roomName}`);
        })

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });

        socket.on("error", (err) => {
            console.error("Socket error: ", err);
        });
    });
}

export default setUpSocket;
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected");
  socket.emit("me", socket.id);

  socket.on("sendMessage", (data) => {
    const receiver = onlineUsers.find(
      (user) => user.userId === data.receiverId
    );
    if (receiver) {
      io.to(receiver.socketId).emit("message", data);
    }
  });

  socket.on("addUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
  });

  socket.on("getOnlineUsers", () => {
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnect", () => {
    const index = onlineUsers.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      onlineUsers.splice(index, 1);
    }
    socket.broadcast.emit("callended");
    console.log("User disconnected");
  });
});

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB connected");
});

db.on("error", (error) => {
  console.log(error);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// ROUTES
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import itemRoutes from "./routes/itemRoute.js";
import forumRoutes from "./routes/forumRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import complaintRouter from "../server/routes/complaintRoutes.js";
import botRoutes from "../server/routes/botRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://tourista-two.vercel.app"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://tourista-two.vercel.app"],
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
app.use("/item", itemRoutes);
app.use("/business", businessRoutes);
app.use("/order", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/forum", forumRoutes);
app.use("/reply", replyRoutes);
app.use("/notification", notificationRoutes);
app.use("/complaint", complaintRouter);
app.use("/conversation", conversationRoutes);
app.use("/message", messageRoutes);
app.use("/bot", botRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

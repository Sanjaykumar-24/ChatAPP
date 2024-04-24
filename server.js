let express = require("express");
let app = express();
let bodyParser = require("body-parser");
const cors = require("cors");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { router } = require("./routes/AuthRoutes.js");
const { router2 } = require("./routes/MessageRoutes.js");
const { Server } = require("socket.io");

// MIDDLEWARE

let count = 1;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(count, "->", req.body, req.method);
  count++;
  next();
});
app.use("/api/auth", router);
app.use("/api/messages", router2);

// DB with Server ini

mongoose
  .connect(process.env.DATABASE_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    const server = app.listen(process.env.PORT, callback);

    const io = new Server(server, {
      cors: {
        origin: "https://bytechat.netlify.app",
      },
    });

    // ! Origin of socket connection
    global.onlineUsers = new Map();

    io.on("connection", (socket) => {
      console.log("SOCKET ", socket.id);

      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        console.log("USERinfo", userId);
        onlineUsers.set(userId, socket.id);
      });

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        console.log("DATA", sendUserSocket, onlineUsers);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-receive", {
            from: data.from,
            message: data.message,
          });
        }
      });
    });
  });

function callback() {
  console.log(
    `DataBase is connected and SERVER is running on ${process.env.PORT}`
  );
}

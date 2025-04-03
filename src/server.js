const passport = require("passport");
const dotenv = require("dotenv");
const connectDb = require("./configs/databaseConfig");
dotenv.config();
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
// Routes
const userRoute = require("./routes/userRoutes");
const classRoute = require("./routes/classRoutes");
const courseRoute = require("./routes/courseRoutes");
const messageRoute = require("./routes/messageRoutes");
const callRoute = require("./routes/callRoutes");
const blogRoute = require("./routes/blogRoutes");
// Config
const corsConfig = require("./configs/corsConfig");
const { app, server } = require("./utils/socket");

const port = process.env.PORT || 8080;

// Middleware
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Khóa bí mật cho session, thêm vào file .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Nếu bạn dùng HTTPS, hãy set `secure: true`
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use(cors(corsConfig));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", userRoute);
app.use("/class", classRoute);
app.use("/course", courseRoute);
app.use("/message", messageRoute);
app.use("/call", callRoute);
app.use("/blog", blogRoute);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is working on port: ${port}`);
  connectDb();
});

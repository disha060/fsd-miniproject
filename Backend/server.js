const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const IndexRoute = require("./Routers/index");
const story = require("./Routers/story");
const connectDatabase = require("./Helpers/database/connectDatabase");
const customErrorHandler = require("./Middlewares/Errors/customErrorHandler");

dotenv.config({
  path: "./Config/config.env",
});

connectDatabase();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Default route (fix for "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend server is running successfully 🚀");
});

// ✅ Your other routes
app.use("/api", IndexRoute); 
app.use("/story", story);

// ✅ Error Handler
app.use(customErrorHandler);

// ✅ Static files (optional)
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} : ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error : ${err}`);
  server.close(() => process.exit(1));
});

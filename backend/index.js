// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/connectDB");
// const cookieParser = require("cookie-parser");
// const authRoutes = require("./routes/authRoutes");
// const noteRoutes = require("./routes/noteRoutes");
// const tenantRoutes = require("./routes/tenantRoutes");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;


// app.use(cors({
//   origin: true, 
//   credentials: true, 
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use("/api/auth", authRoutes)
// app.use("/api/notes", noteRoutes)
// app.use("/api/tenants", tenantRoutes)

// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });



// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error.message);
//     process.exit(1);
//   }
// };

// startServer();


const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tenants", tenantRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Connect DB
connectDB();

// ⚡ Export app for Vercel
module.exports = app;


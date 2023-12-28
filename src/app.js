// Server
const express = require("express");
const cors = require("cors");
// ENV
require("dotenv").config();
// Routes
const extractText = require("./routes/extractText.router.js");

const secret_cookie = process.env.SECRET_COOKIE;

const app = express();
const port = process.env.PORT || 3000;

const corsOption = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};
const cookieOption = {
  httpOnly: true,
  maxAge: 7200000,
};
// Configuracion Server
// app.use(cookieParser(secret_cookie, cookieOption));
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Router
app.use("/api/vision", extractText);

app.listen(port, () => {
  console.log(`Servidor iniciado en puerto: ${port}`);
});

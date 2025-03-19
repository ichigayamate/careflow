if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors")
const {errorHandler} = require("./helpers/error");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => res.json({message: "Please use /api to access API"}));
app.use("/api", require("./routes"));

app.use(errorHandler);

module.exports = app;

require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const { connection } = require("./configs/db");
const { userrouter } = require("./routes/userroute");
const { postrouter } = require("./routes/postroute");

app.get("/", async (req, res) => {
  res.send("This is HOMEPAGE");
});

app.use("/users", userrouter);
app.use("/posts", postrouter);

app.listen(4300, async (req, res) => {
  try {
    await connection;
    console.log("you are connected to mongodb");
  } catch (err) {
    console.log(err);
  }
  console.log("your server is running at 4300");
});

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routeAuth = require("./src/routes/auth");

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get("/", (_req, res) => {
  const data = {
    success: true,
    message: "Hello World!",
  };
  return res.json(data);
});
app.use("/auth", routeAuth);

app.listen(port, () => {
  console.log(`App is running in port ${port}`);
});

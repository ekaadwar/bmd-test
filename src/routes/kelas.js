const route = require("express").Router();
const { getKelas, addKelas } = require("../controllers/kelas");
const auth = require("../middlewares/auth");

route.get("/", auth, getKelas);
route.post("/", auth, addKelas);

module.exports = route;

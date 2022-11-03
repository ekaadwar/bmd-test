const route = require("express").Router();
const { getKelas } = require("../controllers/kelas");
const auth = require("../middlewares/auth");

route.get("/", auth, getKelas);

module.exports = route;

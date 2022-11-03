const route = require("express").Router();
const {
  getKelas,
  addKelas,
  updateKelasById,
  deleteKelasById,
} = require("../controllers/kelas");
const auth = require("../middlewares/auth");

route.get("/", auth, getKelas);
route.post("/", auth, addKelas);
route.patch("/:id", auth, updateKelasById);
route.delete("/:id", auth, deleteKelasById);

module.exports = route;

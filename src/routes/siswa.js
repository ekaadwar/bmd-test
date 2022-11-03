const route = require("express").Router();
const {
  getSiswa,
  addSiswa,
  updateSiswaById,
  deleteSiswaById,
} = require("../controllers/siswa");
const auth = require("../middlewares/auth");

route.get("/", auth, getSiswa);
route.post("/", auth, addSiswa);
route.patch("/:id", auth, updateSiswaById);
route.delete("/:id", auth, deleteSiswaById);

module.exports = route;

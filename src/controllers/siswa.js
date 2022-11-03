const bcrypt = require("bcrypt");
const fs = require("fs");
const modelSiswa = require("../models/siswa");
const modelKelas = require("../models/kelas");
const { response } = require("../helpers/standardResponse");
const { APP_URL } = process.env;

// ---------- create ----------
// ---------- create ----------
// ---------- create ----------

exports.addSiswa = (req, res) => {
  if (req.authUser.role === "admin") {
    const data = req.body;
    modelKelas.getKelasById(data.idKelas, (error, resKelas) => {
      if (!error) {
        modelSiswa.createSiswaByAdmin(data, (error) => {
          if (!error) {
            const updateKelas = resKelas[0].jumlahSiswa + 1;
            const dataUpdate = {
              id: resKelas[0].id,
              col: "jumlah_siswa",
              val: updateKelas,
            };
            console.log(dataUpdate);
            modelKelas.updateKelasPart(dataUpdate, (err) => {
              if (!err) {
                return response(
                  res,
                  200,
                  true,
                  "Data has been inserted succesfully!"
                );
              } else {
                return response(
                  res,
                  500,
                  false,
                  "Gagal saat meng-update data kelas"
                );
              }
            });
          } else {
            response(res, 500, false, error);
          }
        });
      } else {
        return response(res, 500, false, "Kelas tidak tersedia.");
      }
    });
  } else {
    return response(res, 400, false, "Sorry, you have no authority!");
  }
};

// ---------- read ----------
// ---------- read ----------
// ---------- read ----------

exports.getSiswa = (req, res) => {
  console.log(req.authUser);
  if (req.authUser.role === "admin") {
    const condition = req.query;
    condition.search = condition.search || "";
    condition.limit = parseInt(condition.limit) || 5;
    condition.offset = parseInt(condition.offset) || 0;
    condition.page = parseInt(condition.page) || 1;
    condition.offset = condition.page * condition.limit - condition.limit;

    let pageInfo = {};

    modelSiswa.getSiswaByCond(condition, (error, resSiswa) => {
      if (!error) {
        modelSiswa.getTotalSiswa(condition, (errTotal, resTotal) => {
          if (!errTotal) {
            const totalData = resTotal[0].count;
            const lastPage = Math.ceil(totalData / condition.limit);

            pageInfo.totalData = totalData;
            pageInfo.currentPage = condition.page;
            pageInfo.lastPage = lastPage;
            pageInfo.limit = condition.limit;
            pageInfo.nextPage =
              condition.page < lastPage
                ? `${APP_URL}/siswa?page=${pageInfo.currentPage + 1}`
                : null;
            pageInfo.prevPage =
              condition.page > 1
                ? `${APP_URL}/siswa?page=${pageInfo.currentPage - 1}`
                : null;

            return response(
              res,
              200,
              true,
              "Search data succesfully",
              resSiswa,
              pageInfo
            );
          } else {
            return response(res, 404, false, "Data not found!", results);
          }
        });
      } else {
        response(res, 500, false, `An error occured : ${error}`);
      }
    });
  } else {
    return response(res, 400, false, "Sorry, you have no authority!");
  }
};

// ----------------------------
// ---------- update ----------
// ----------------------------

exports.updateSiswaById = (req, res) => {
  const { id: idUser } = req.params;
  const id = parseInt(idUser);
  console.log(req.body);

  if (req.authUser.role === "admin") {
    modelSiswa.getSiswaById(idUser, (error, results) => {
      if (!error) {
        const column = Object.keys(req.body);
        const value = Object.values(req.body);
        const countColumn = column.length;

        if (countColumn > 0) {
          for (let i = 0; i < countColumn; i++) {
            const col = column[i];
            const val = value[i];

            const data = { id, col, val };

            modelSiswa.updateSiswaPart(data, (errorUpdate) => {
              if (!errorUpdate) {
                console.log(`${col} column has been successfully updated`);
              } else {
                console.log(`${col} column has been failed to update`);
              }
            });
          }

          return response(
            res,
            200,
            true,
            "the update process has been completed"
          );
        } else {
          return response(res, 400, false, "you have to enter data!");
        }
      } else {
        return response(
          res,
          404,
          false,
          `Data not found! error : ${error.sqlMessage}`
        );
      }
    });
  } else {
    return response(res, 400, false, "Sorry, you have no authority!");
  }
};

// ----------------------------
// ---------- delete ----------
// ----------------------------

exports.deleteSiswaById = (req, res) => {
  const { id: idUser } = req.params;
  const id = parseInt(idUser);

  if (req.authUser.role === "admin") {
    modelSiswa.getSiswaById(id, (error, results) => {
      if (!error) {
        if (results.length > 0) {
          modelSiswa.deleteSiswaById(id, (error) => {
            if (!error) {
              return response(
                res,
                200,
                true,
                "deleting data has been successful."
              );
            } else {
              return response(res, 500, false, "Failed to delete data.");
            }
          });
        } else {
          return response(res, 404, false, "Data not found.");
        }
      } else {
        return response(res, 500, false, "an error occured.");
      }
    });
  }
};

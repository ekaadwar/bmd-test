const bcrypt = require("bcrypt");
const fs = require("fs");
const modelKelas = require("../models/kelas");
const { response } = require("../helpers/standardResponse");
const { APP_URL } = process.env;

exports.addKelas = (req, res) => {
  if (req.authUser.role === "admin") {
    const data = req.body;
    modelKelas.createKelasByAdmin(data, (error, results) => {
      if (!error) {
        return response(res, 200, true, "Data has been inserted succesfully!");
      } else {
        response(res, 500, false, error);
      }
    });
  } else {
    return response(res, 400, false, "Sorry, you have no authority!");
  }
};

exports.getKelas = (req, res) => {
  console.log(req.authUser);
  if (req.authUser.role === "admin") {
    const condition = req.query;
    condition.search = condition.search || "";
    condition.limit = parseInt(condition.limit) || 5;
    condition.offset = parseInt(condition.offset) || 0;
    condition.page = parseInt(condition.page) || 1;
    condition.offset = condition.page * condition.limit - condition.limit;

    let pageInfo = {};

    modelKelas.getKelasByCond(condition, (error, resKelas) => {
      if (!error) {
        modelKelas.getTotalKelas(condition, (errTotal, resTotal) => {
          if (!errTotal) {
            const totalData = resTotal[0].count;
            const lastPage = Math.ceil(totalData / condition.limit);

            pageInfo.totalData = totalData;
            pageInfo.currentPage = condition.page;
            pageInfo.lastPage = lastPage;
            pageInfo.limit = condition.limit;
            pageInfo.nextPage =
              condition.page < lastPage
                ? `${APP_URL}/kelas?page=${pageInfo.currentPage + 1}`
                : null;
            pageInfo.prevPage =
              condition.page > 1
                ? `${APP_URL}/kelas?page=${pageInfo.currentPage - 1}`
                : null;

            return response(
              res,
              200,
              true,
              "Search data succesfully",
              resKelas,
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

exports.updateKelasById = (req, res) => {
  const { id: idUser } = req.params;
  const id = parseInt(idUser);

  if (req.authUser.role === "admin") {
    modelKelas.getKelasById(idUser, (error, results) => {
      if (!error) {
        const column = Object.keys(req.body);
        const value = Object.values(req.body);
        const countColumn = column.length;

        if (countColumn > 0) {
          for (let i = 0; i < countColumn; i++) {
            const col = column[i];
            const val = value[i];

            const data = { id, col, val };

            modelKelas.updateKelasPart(data, (errorUpdate) => {
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

exports.deleteKelasById = (req, res) => {
  const { id: idUser } = req.params;
  const id = parseInt(idUser);

  if (req.authUser.role === "admin") {
    modelKelas.getKelasById(id, (error, results) => {
      if (!error) {
        if (results.length > 0) {
          modelKelas.deleteKelasById(id, (error) => {
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

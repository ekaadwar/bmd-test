const bcrypt = require("bcrypt");
const fs = require("fs");
const modelKelas = require("../models/kelas");
const { response } = require("../helpers/standardResponse");
const { APP_URL } = process.env;

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

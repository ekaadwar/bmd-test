const connection = require("../helpers/database");
const table = "admin";

exports.createUsers = (data, cb) => {
  connection.query(
    `INSERT INTO ${table} (email, password, no_hp, nama) VALUES (?, ?, ?, ?)`,
    [data.email, data.password, data.noHp, data.nama],
    cb
  );
};

exports.getUserByEmail = (email, cb) => {
  connection.query(
    `
      SELECT ${table}.id, ${table}.nama, ${table}.email, ${table}.password, ${table}.role
      FROM ${table}
      WHERE ${table}.email=?
    `,
    [email],
    cb
  );
};

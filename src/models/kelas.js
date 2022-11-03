const connection = require("../helpers/database");
const table = "kelas";

exports.getKelasByCond = (cond, cb) => {
  let where = `${table}.nama LIKE '%${cond.search}%'`;
  connection.query(
    `
    SELECT 
      ${table}.id,
      ${table}.nama,
      ${table}.jumlah_siswa AS jumlahSiswa,
      ${table}.tahun_ajaran AS tahunAjaran,
      ${table}.status
    FROM ${table} 
    WHERE ${where}
    LIMIT ? OFFSET ?`,
    [cond.limit, cond.offset],
    cb
  );
};

exports.getTotalKelas = (cond, cb) => {
  let whereVar = `${table}.nama LIKE '%${cond.search}%' `;
  connection.query(
    `SELECT COUNT(${table}.id) as count FROM ${table} WHERE ${whereVar}`,
    cb
  );
};
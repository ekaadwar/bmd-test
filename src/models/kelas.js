const connection = require("../helpers/database");
const table = "kelas";

// ------------ create ------------
// ------------ create ------------
// ------------ create ------------

exports.createKelasByAdmin = (data, cb) => {
  connection.query(
    `INSERT INTO ${table} (nama, jenjang_kelas, tahun_ajaran, status) VALUES (?, ?, ?, ?)`,
    [data.nama, data.jenjangKelas, data.tahunAjaran, data.status],
    cb
  );
};

// ------------ read ------------
// ------------ read ------------
// ------------ read ------------

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

exports.getKelasById = (id, cb) => {
  connection.query(
    `
    SELECT 
    ${table}.id,
    ${table}.nama,
    ${table}.jenjang_kelas,
    ${table}.jumlah_siswa,
    ${table}.tahun_ajaran,
    ${table}.status
    FROM ${table} 
    WHERE ${table}.id=${id}
    `,
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

// ------------ update ------------
// ------------ update ------------
// ------------ update ------------

exports.updateKelasPart = (data, cb) => {
  const sql = `UPDATE ${table} SET ${data.col}='${data.val}' WHERE id=${data.id}`;
  connection.query(sql, cb);
};

// ------------ delete ------------
// ------------ delete ------------
// ------------ delete ------------

exports.deleteKelasById = (id, cb) => {
  connection.query(`DELETE FROM ${table} WHERE id = ${id}`, cb);
};

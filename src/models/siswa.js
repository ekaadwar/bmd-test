const connection = require("../helpers/database");
const table = "siswa";

// ------------ create ------------
// ------------ create ------------
// ------------ create ------------

exports.createSiswaByAdmin = (data, cb) => {
  connection.query(
    `INSERT INTO ${table} (nis, nama, id_kelas, jenis_kelamin, nama_ayah, nama_ibu, alamat) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.nis,
      data.nama,
      data.idKelas,
      data.jenisKelamin,
      data.namaAyah,
      data.namaIbu,
      data.alamat,
    ],
    cb
  );
};

// ------------ read ------------
// ------------ read ------------
// ------------ read ------------

exports.getSiswaByCond = (cond, cb) => {
  let where = `${table}.nama LIKE '%${cond.search}%'`;
  if (cond.kelas) {
    where += ` AND id_kelas = ${cond.kelas}`;
  }
  connection.query(
    `
    SELECT nis, ${table}.nama AS nama, kelas.nama AS kelas, jenis_kelamin, nama_ayah, nama_ibu, alamat
    FROM ${table} LEFT JOIN kelas ON ${table}.id_kelas = kelas.id
    WHERE ${where}
    LIMIT ? OFFSET ?`,
    [cond.limit, cond.offset],
    cb
  );
};

exports.getSiswaById = (id, cb) => {
  connection.query(
    `
    SELECT nis, ${table}.nama, kelas.nama, jenis_kelamin, nama_ayah, nama_ibu, alamat
    FROM ${table} LEFT JOIN kelas ON ${table}.id_kelas = kelas.id
    WHERE ${table}.id=${id}
    `,
    cb
  );
};

exports.getTotalSiswa = (cond, cb) => {
  let whereVar = `${table}.nama LIKE '%${cond.search}%' `;
  if (cond.kelas) {
    whereVar += ` AND id_kelas = ${cond.kelas}`;
  }
  connection.query(
    `SELECT COUNT(${table}.id) as count FROM ${table} WHERE ${whereVar}`,
    cb
  );
};

// ------------ update ------------
// ------------ update ------------
// ------------ update ------------

exports.updateSiswaPart = (data, cb) => {
  const sql = `UPDATE ${table} SET ${data.col}='${data.val}' WHERE id=${data.id}`;
  connection.query(sql, cb);
};

// ------------ delete ------------
// ------------ delete ------------
// ------------ delete ------------

exports.deleteSiswaById = (id, cb) => {
  connection.query(`DELETE FROM ${table} WHERE id = ${id}`, cb);
};

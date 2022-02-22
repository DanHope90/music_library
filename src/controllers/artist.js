const { query } = require('express');
const getDb = require('../services/db');

exports.create = async (req, res) => {
  const db = await getDb();
  const { name, genre } = req.body;

  try {
    await db.query(`INSERT INTO Artist (name, genre) VALUES (?, ?)`, [
      name,
      genre,
    ]);

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500).json(err);
  }

  db.close();
};

exports.read = async (req, res) => {
  const db = await getDb();

  try {
    const [artists] = await db.query(`SELECT * FROM Artist`);

    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json(err);
  }
  db.close();
};

exports.readById = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;

  const [[artist]] = await db.query(`SELECT * FROM Artist WHERE id = ?`, [
    artistId,
  ]);

  if (!artist) {
    res.sendStatus(404);
  } else {
    res.status(200).json(artist);
  }
  db.close();
};

exports.updateId = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params; // why in curly braces here
  const data = req.body; // why not in the curly braces here
  try {
    const [{ affectedRows }] = await db.query(
      `UPDATE Artist SET ? WHERE id =?`,
      [data, artistId]
    );

    if (!affectedRows) {
      res.sendStatus(404);
    } else {
      res.status(200).json(affectedRows);
    }
  } catch (err) {
    res.sendStatus(500); // why send error here if use of 404 above
  }
  db.close();
};

exports.deleteId = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;

  try {
    const [{ affectedRows }] = await db.query(
      'DELETE FROM Artist WHERE id = ?',
      [artistId]
    );

    if (!affectedRows) {
      res.sendStatus(404);
    } else {
      res.status(200).json();
    }
  } catch (err) {
    res.sendStatus(500);
  }
  db.close();
};

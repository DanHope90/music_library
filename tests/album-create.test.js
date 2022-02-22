
const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('create album', () => {
  let db;
  let artists;
  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        'Tame Impala',
        'rock',
      ]),
    ]);

    [artists] = await db.query('SELECT * FROM Artist')
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/artist/:artistId/album', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        const artistId = artists.id
        const res = await request(app).post(`/artist/${artistId}/album`).send({
          name: 'Terrible Hits',
          year: 2590,
          artistId
        });

        expect(res.status).to.equal(201);
        
        const [[albumEntries]] = await db.query(
          `SELECT * FROM Album WHERE name = 'Terrible Hits'`
        );

        expect(albumEntries.name).to.equal('Terrible Hits');
        expect(albumEntries.year).to.equal(2590);
      });
    });
  });
});
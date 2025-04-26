// tests/2_functional-tests.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/solve', () => {
    test('Solve a puzzle that cannot be solved', done => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1'.repeat(81) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
          done();
        });
    });
  });

  suite('POST /api/check', () => {
    test('Check a puzzle placement with single placement conflict', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '5' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ['row']);
          done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.sameMembers(res.body.conflict, ['row', 'region']);
          done();
        });
    });
    test('Check a puzzle placement with all placement conflicts', done => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '1' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.sameMembers(res.body.conflict, ['row','column','region']);
          done();
        });
    });
  });
});

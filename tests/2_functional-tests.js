const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"

suite('Functional Tests', () => {

test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done){
        chai.request(server)
          .post(`/api/solve`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": puzzle
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'solution', solution);
            done();
            });
  });

test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done){
        chai.request(server)
          .post(`/api/solve`)
          .set('content-type', 'application/json')
          .send({
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Required field missing");
            done();
            });
  });


test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done){
        chai.request(server)
          .post(`/api/solve`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": "x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Invalid characters in puzzle");
            done();
            });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done){
        chai.request(server)
          .post(`/api/solve`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": "123"
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Expected puzzle to be 81 characters long");
            done();
            });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done){
        chai.request(server)
          .post(`/api/solve`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', 'Puzzle cannot be solved');
            done();
            });
  });


  test('Check a puzzle placement with all fields: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": puzzle,
            "coordinate": "A1",
            "value": 7
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'valid', true);
            done();
            });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": puzzle,
            "coordinate": "A1",
            "value": 6
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            //assert.propertyVal(res.body, 'conflict', ["column"] );
            expect(res.body.conflict).to.include.ordered.members(["column"])
            done();
            });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": puzzle,
            "coordinate": "A1",
            "value": 1
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            //assert.propertyVal(res.body, 'conflict', ["row", "column"] );
            expect(res.body.conflict).to.include.ordered.members(["row", "column"])
            done();
            });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": puzzle,
            "coordinate": "A1",
            "value": 5
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'valid', false);
            //assert.propertyVal(res.body, 'conflict', ["row", "column", "region"]);
            expect(res.body.conflict).to.include.ordered.members(["row", "column", "region"])
            done();
            });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Required field(s) missing");
            done();
            });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": "x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            "coordinate": "A1",
            "value": 7
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Invalid characters in puzzle");
            done();
            });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": "1234",
            "coordinate": "A1",
            "value": 7
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Expected puzzle to be 81 characters long");
            done();
            });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": puzzle,
            "coordinate": "K1",
            "value": 7
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Invalid coordinate");
            done();
            });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done){
        chai.request(server)
          .post(`/api/check`)
          .set('content-type', 'application/json')
          .send({
            "puzzle": puzzle,
            "coordinate": "A1",
            "value": 10
            })
          .end(function(err, res){
            //assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'error', "Invalid value");
            done();
            });
  });


});


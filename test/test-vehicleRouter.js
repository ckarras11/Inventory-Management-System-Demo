const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Vehicle } = require('../models/vehicle');

const should = chai.should();
chai.use(chaiHttp);


function seedData() {
    console.info('Seeding Data');
    const seedData = [];
    for (let i = 0; i <= 10; i++) {
        seedData.push(generateData());
    }
    return Vehicle.insertMany(seedData);
}

function generateData() {
    return {
        image: faker.name.lastName(),
        vehicleName: faker.name.firstName(),
    };
}

function tearDown() {
    console.warn('Deleting DB');
    return mongoose.connection.dropDatabase();
}


describe('Testing api/vehicle', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedData();
    });

    afterEach(function () {
        return tearDown();
    });

    after(function () {
        return closeServer();
    });

    describe('GET api/vehicle', function () {
        it('should retrieve all vehicle from db', function () {
            let res;
            return chai.request(app)
                .get('/api/vehicle')
                .then(function (_res) {
                    res = _res;
                    res.should.have.status(200);
                    return Vehicle.count()
                })
                .then(function (count) {
                    res.body.length.should.equal(count);
                });
        });
        it('should retrieve vehicles with the correct keys', function () {
            let resVehicle;
            return chai.request(app)
                .get('/api/vehicle')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.forEach(function (vehicle) {
                        vehicle.should.be.a('object');
                        vehicle.should.include.keys('vehicleName', 'id');
                    })
                    resVehicle = res.body[0]
                    return Vehicle.findById(resVehicle.id)
                })
                .then(function (vehicle) {
                    resVehicle.id.should.equal(vehicle.id);
                    resVehicle.vehicleName.should.equal(vehicle.vehicleName);
                });
        });
    });

    describe('POST api/vehicle', function () {
        it('should create a new vehicle', function () {
            const newVehicle = generateData();
            return chai.request(app)
                .post('/api/vehicle')
                .send(newVehicle)
                .then(function (res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'vehicleName');
                    res.body.id.should.not.be.null;
                    return Vehicle.findById(res.body.id)
                })
                .then(function (vehicle) {
                    vehicle.vehicleName.should.equal(newVehicle.vehicleName);
                });
        });
    });

    describe('PUT api/vehicle', function () {
        it('should update a vehicle in the db', function () {
            const updateData = { vehicleName: 'New Vehicle' };
            return Vehicle
                .findOne()
                .then(function (vehicle) {
                    updateData.id = vehicle.id
                    return chai.request(app)
                        .put(`/api/vehicle/${updateData.id}`)
                        .send(updateData)
                })
                .then(function (res) {
                    res.should.have.status(204);
                    return Vehicle.findById(updateData.id)
                })
                .then(function (vehicle) {
                    vehicle.vehicleName.should.equal(updateData.vehicleName);
                    vehicle.id.should.equal(updateData.id);
                });
        });
    });

    describe('DELETE api/vehicle', function () {
        it('should remove a vehicle from the db', function () {
            let resVehicle;
            return Vehicle
                .findOne()
                .then(function (_vehicle) {
                    resVehicle = _vehicle
                    return chai.request(app).delete(`/api/vehicle/${resVehicle.id}`)
                })
                .then(function (res) {
                    res.should.have.status(204);
                    return Vehicle.findById(resVehicle.id);
                })
                .then(function (_vehicle) {
                    should.not.exist(_vehicle);
                });
        });
    });
});

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

        });
    });

    describe('POST api/vehicle', function () {
        it('should create a new vehicle', function () {

        });
    });

    describe('PUT api/vehicle', function () {
        it('should update a vehicle in the db', function () {

        });
    });

    describe('DELETE api/vehicle', function () {
        it('should remove a vehicle from the db', function () {

        });
    });
});

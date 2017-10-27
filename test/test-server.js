const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Item } = require('../models/item');

const should = chai.should();
chai.use(chaiHttp);

function tearDown() {
    console.warn('Deleting DB');
    return mongoose.connection.dropDatabase();
}
describe('Testing', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });
    // ROOT ENDPOINT
    describe('/', function () {
        it('should return index.html', function () {
            return chai.request(app)
                .get('/')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.html;
                });
        });
    });
    // HOME ENDPOINT
    describe('/home', function () {
        it('should return home.html', function () {
            return chai.request(app)
                .get('/home')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.html;
                });
        });
    });
    // INVENTORY ENDPOINT
    describe('/inventory', function () {
        it('should return inventory.html', function () {
            return chai.request(app)
                .get('/inventory')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.html;
                });
        });
    });
    // REPORTS ENDPOINT
    describe('/reports', function () {
        it('should return reports.html', function () {
            return chai.request(app)
                .get('/reports')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.html;
                });
        });
    });
    // LOGOUT ENDPOINT
    describe('/logout', function () {
        it('should return index.html', () => {
            return chai.request(app)
                .get('/logout')
                .then((res) => {
                    res.should.have.status(200);
                    res.should.be.html;
                });
        });
    });
});

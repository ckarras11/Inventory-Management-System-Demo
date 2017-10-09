const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Item } = require('../models/item');

const should = chai.should();
chai.use(chaiHttp);

function seedData() {
    console.info('Seeding Data');
    const seedData = [];
    for (let i = 0; i <= 10; i++) {
        seedData.push(generateData());
    }
    return Item.insertMany(seedData);
}

function generateData() {
    return {
        item: faker.name.firstName(),
        listPrice: faker.random.number(),
        quantityOnHand: faker.random.number(),
        reorderPoint: faker.random.number(),
        vehicle_id: faker.name.firstName(),
    };
}

function tearDown() {
    console.warn('Deleting DB');
    return mongoose.connection.dropDatabase();

}
describe('Testing', function () {

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
    // GET /api/inventory ENDPOINT, gets all inventory items
    describe('GET /api/inventory', function () {
        it('should retreive all items', function () {
            let res;
            return chai.request(app)
                .get('/api/inventory')
                .then(function (_res) {
                    res = _res;
                    res.should.have.status(200);
                    return Item.count();
                })
                .then(function (count) {
                    res.body.length.should.equal(count);
                });
        });
        it('should return data with the correct fields', function () {
            let resItem = {};
            return chai.request(app)
                .get('/api/inventory')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);
                    res.body.forEach(function (item) {
                        item.should.be.a('object');
                        item.should.include.keys('id', 'item', 'listPrice', 'quantityOnHand', 'reorderPoint', 'vehicle_id');
                    });
                    resItem = res.body[0];
                    return Item.findById(resItem.id);
                })
                .then(function (item) {
                    resItem.id.should.equal(item.id);
                    resItem.item.should.equal(item.item);
                    resItem.listPrice.should.equal(item.listPrice);
                    resItem.quantityOnHand.should.equal(item.quantityOnHand);
                    resItem.reorderPoint.should.equal(item.reorderPoint);
                    resItem.vehicle_id.should.equal(item.vehicle_id);
                });
        });
    });
    // POST /api/inventory ENDPOINT, creates new item in db
    describe('POST /api/inventory', function () {
        it('should create a new item in the db', function () {
            const newItem = generateData();
            return chai.request(app)
                .post('/api/inventory')
                .send(newItem)
                .then(function (res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'item', 'listPrice', 'quantityOnHand', 'reorderPoint', 'vehicle_id');
                    res.body.id.should.not.be.null;
                    res.body.item.should.equal(newItem.item);
                    return Item.findById(res.body.id);
                })
                .then(function (item) {
                    item.item.should.equal(newItem.item);
                    item.listPrice.should.equal(newItem.listPrice);
                    item.quantityOnHand.should.equal(newItem.quantityOnHand);
                    item.reorderPoint.should.equal(newItem.reorderPoint);
                    item.vehicle_id.should.equal(newItem.vehicle_id);
                });
        });
    });

    describe('PUT api/inventory/:id', function () {
        it('should update an item with supplied fields by id', function () {
            const updateData = {
                item: 'new item',
                listPrice: 1000,
                quantityOnHand: 15,
                reorderPoint: 1,
                vehicle_id: 'new vehicle',
            };
            return Item
                .findOne()
                .then(function (item) {
                    updateData.id = item.id;
                    return chai.request(app)
                        .put(`/api/inventory/${updateData.id}`)
                        .send(updateData);
                })
                .then(function (res) {
                    res.should.have.status(204);
                    return Item.findById(updateData.id);
                })
                .then(function (item) {
                    item.item.should.equal(updateData.item);
                    item.listPrice.should.equal(updateData.listPrice);
                    item.quantityOnHand.should.equal(updateData.quantityOnHand);
                    item.reorderPoint.should.equal(updateData.reorderPoint);
                    item.vehicle_id.should.equal(updateData.vehicle_id);
                });
        });
    });

    // DELETE /api/inventory/:id removes item from db
    describe('DELETE api/inventory/:id', function () {
        it('should delete an item by id', function () {
            let resItem;
            return Item
                .findOne()
                .then(function (_item) {
                    resItem = _item;
                    return chai.request(app).delete(`/api/inventory/${resItem.id}`);
                })
                .then(function (res) {
                    res.should.have.status(204);
                    return Item.findById(resItem.id);
                })
                .then(function (_item) {
                    should.not.exist(_item);
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
        it('should return index.html', () => chai.request(app)
            .get('/logout')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.html;
            }));
    });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server.js')



const should = chai.should()
chai.use(chaiHttp)


describe('Testing', function () {

    before(function() {
        return runServer();
    })

    after(function() {
        return closeServer();
    })

    describe('/', function () {
        it('should return index.html', function () {
            return chai.request(app)
            .get('/')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.html;
            })
        })
    })

    describe('/home', function () {
        it('should return home.html', function () {
            return chai.request(app)
            .get('/home')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.html;
            })
        })
    })

    describe('/inventory', function () {
        it('should return inventory.html', function () {
            return chai.request(app)
            .get('/inventory')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.html;
            })
        })
    })

    describe('/reports', function () {
        it('should return reports.html', function () {
            return chai.request(app)
            .get('/reports')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.html;
            })
        })
    })
})

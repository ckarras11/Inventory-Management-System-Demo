const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Vehicle } = require('../models/vehicle');

const router = express.Router();
const jsonParser = bodyParser.json();

// Express Validator
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// Gets vehicle from DB
router.get('/', (req, res) => {
    Vehicle
        .find()
        .then((vehicles) => {
            res.json(vehicles.map(vehicle => vehicle.apiRepr()));
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

// Creates a new vehicle
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['vehicleName', 'image'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            console.log(req.body);
            return res.status(400).send(message);
        }
    }
    Vehicle
        .find({ vehicleName: req.body.vehicleName })
        .then((vehicle) => {
            console.log(`===============>${vehicle.length}`);
            if (vehicle.length !== 0) {
                const message = 'Vehicle already exists';
                return res.status(409).send(message);
            }
        });
    Vehicle
        .create({
            image: req.body.image,
            vehicleName: req.body.vehicleName,
        })
        .then(vehicle => res.status(201).json(vehicle.apiRepr()))
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

// Edits a vehicle in the DB
router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match',
        });
    }
    const updated = {};
    const updateableFields = ['vehicleName', 'image'];
    updateableFields.forEach((field) => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });
    Vehicle
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedItem => res.status(204).end())
        .catch(err => res.status(500).json({ error: 'Something went wrong' }));
});

// Deletes a vehicle from DB
router.delete('/:id', (req, res) => {
    Vehicle
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleting vehicle ${req.params.id}`);
            res.status(204).end();
        });
});

module.exports = router;

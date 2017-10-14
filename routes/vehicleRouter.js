const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Vehicle } = require('../models/vehicle');

const router = express.Router();
const jsonParser = bodyParser.json();


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
    console.log(req.body);
    const requiredFields = ['vehicleName'];
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
        .create({
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
            error: 'Request parth id and request body id values must match'
        });
    }
    const updated = {};
    const updateableFields = ['vehicleName'];
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

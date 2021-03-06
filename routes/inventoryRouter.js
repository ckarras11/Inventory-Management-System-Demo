const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Item } = require('../models/item');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();


// Gets inventory items from DB
router.get('/', (req, res) => {
    Item
        .find()
        .then((items) => {
            res.json(items.map(item => item.apiRepr()));
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

// Get a single item from DB
router.get('/:id', (req, res) => {
    Item
        .findById(req.params.id)
        .then(item => res.json(item.apiRepr()))
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

// Creates new inventory items
router.post('/', jsonParser, (req, res) => {
    console.log(req.body);
    const requiredFields = ['item', 'listPrice', 'quantityOnHand', 'reorderPoint', 'vehicle_id'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            // console.error(message);
            console.log(req.body);
            console.log(message);
            return res.status(400).send(message);
        }
    }
    Item
        .create({
            item: req.body.item,
            partNumber: req.body.partNumber,
            listPrice: req.body.listPrice,
            quantityOnHand: req.body.quantityOnHand,
            reorderPoint: req.body.reorderPoint,
            vehicle_id: req.body.vehicle_id,
        })
        .then(item => res.status(201).json(item.apiRepr()))
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
});
// Edits an item in the DB
router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match',
        });
    }
    const updated = {};
    const updateableFields = ['item', 'partNumber', 'listPrice', 'quantityOnHand', 'reorderPoint', 'vehicle_id'];
    updateableFields.forEach((field) => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });
    Item
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedItem => res.status(204).end())
        .catch(err => res.status(500).json({ error: 'Something went wrong' }));
});

// Deletes an item from DB
router.delete('/:id', (req, res) => {
    Item
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleting item ${req.params.id}`);
            res.status(204).end();
        });
});

module.exports = router;

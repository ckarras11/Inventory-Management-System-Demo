const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    image: String,
    item: {type: String, required: true},
    partNumber: String,
    listPrice: {type: Number, required: true},
    quantityOnHand: {type: Number, required: true},
    reorderPoint: {type: Number, required: true}

});

itemSchema.methods.apiRepr = function() {
    return {
        id: this.id,
        image: this.image,
        partNumber: this.partNumber,
        listPrice: this.listPrice,
        quantityOnHand: this.quantityOnHand,
        reorderPoint: this.reorderPoint
    }
};

const Item = mongoose.model('Item', itemSchema, 'Item');

module.exports = {Item};
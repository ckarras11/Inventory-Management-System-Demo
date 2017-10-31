const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    image: String,
    vehicleName: { type: String, required: true, unique: true },
});

vehicleSchema.methods.apiRepr = function () {
    return {
        id: this.id,
        image: this.image,
        vehicleName: this.vehicleName,
    };
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema, 'Vehicle');

module.exports = { Vehicle };

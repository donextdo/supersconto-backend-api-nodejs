const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinate: {
        type: [Number],
        index: '2d'
    }
})

module.exports = GeoSchema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: String,
    phoneNumber: String,
    address: String,
    measurements: {
        shirt: { type: Schema.Types.ObjectId, ref: 'Shirt' },
        pant: { type: Schema.Types.ObjectId, ref: 'Pant' }
    },
    deadline: Date
});

module.exports = mongoose.model('Customer', CustomerSchema);

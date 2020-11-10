const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    provider: {
        type: String,
        default: "Random Shop"
    }
});

module.exports = mongoose.model('Product', productSchema);
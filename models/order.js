const mongoose = require('mongoose');
// const { productModel } = require('./product.js');

const orderSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});
 
module.exports = mongoose.model('Order', orderSchema);
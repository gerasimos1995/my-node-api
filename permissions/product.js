const { ROLES } = require('../models/role.js');
const productModel = require('../models/product.js');
const product = require('../models/product.js');

function scopedProducts(user, products) {
    return new Promise((resolve, reject) => {
        const filtered_products = products.filter(product => product.trader == user.id );
        
        console.log("Filtered products: ", filtered_products);
        //if (!filtered_products) reject(null);
        resolve(filtered_products);
    });
}

module.exports = {
    scopedProducts
}
const { ROLES } = require('../models/role.js');
const productModel = require('../models/product.js');
const product = require('../models/product.js');
const Logger = require('../util/logger');

async function getProducts(req, res, next) {
    try {
        const data = await productModel.find({ });
        if (!data) return res.status(400).json({ message: "No products were found" });

        // If the user is shop owner return only the products he had created
        if (req.user.role === ROLES.SHOP_OWNER){
            const filtered_products = await scopedProducts(req.user, data);
            //console.log("In router: ", filtered_products);
            if (!filtered_products) return res.status(400).json({ message: "No products found for the logged in user" });
            req.products = filtered_products;
            next();
        }

        // The user is a client so return all the products found
        req.products = data;
        next();
    } catch (error) {
        //console.error(error);
        Logger.error(error);
        return res.status(500).json({ message: error.message });
    }
}

function scopedProducts(user, products) {
    return new Promise((resolve, reject) => {
        const filtered_products = products.filter(product => product.trader == user.id );
        Logger.info(filtered_products);
        //console.log("Filtered products: ", filtered_products);
        //if (!filtered_products) reject(null);
        resolve(filtered_products);
    });
}

module.exports = {
    getProducts,
    scopedProducts
}
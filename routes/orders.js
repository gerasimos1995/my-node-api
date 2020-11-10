const express = require('express');
const router = express.Router();

const { orderValidator } = require('../util/validators.js');

const orderModel = require('../models/order.js');
const productModel = require('../models/product.js');
const userModel = require('../models/user.js');

router.get('/:id', async (req, res) => {
    const order_id = req.params.id;

    try {
        const data = await orderModel.findOne({ _id : order_id });
        if (!data) return res.status(400).json({ message: "Order was not found" });
        return res.status(200).json({ order: data });
    } catch (error) {
        console.error(error);
        // That occurs if the id given has wrong length (most likely)
        return res.status(500).json({ message: error.message });
    }
});

router.post('/:id', async (req, res) => {
    // Validate that data is in proper format
    const { error } = orderValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if the user given as client exists
    const data = await userModel.findOne({ _id : req.body.client });
    if (!data) return res.status(400).json({ message: `The user ${req.body.client} does not exist` });

    const products = req.body.products;

    const checkedProducts = [];
    
    const start = async () => {
        await asyncForEach(products, async (product_id) => {
          const temp = await productModel.findOne({ _id: product_id });
          if (temp) checkedProducts.push(temp);
          if (!temp) console.log(`Product:${product_id} does not exist`);
        });
        // Check if the numbers of products existing in the database match the number of products provided
        if (checkedProducts.length < products.length){
            return res.status(400).json({ message: "One of the products does not exist" });
        }

        try {
            const order = new orderModel({
                client: req.body.client,
                products: req.body.products
            });
    
            const data = await order.save();
            if (!data) return res.status(400).json({ message: "Failed saving the order" });
    
            return res.status(201).json({ order: data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }
    start();
});

module.exports = router;

// Helper
// My own asyncForEach function
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}


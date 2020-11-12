const express = require('express');
const router = express.Router();

const { orderValidator } = require('../util/validators.js');

const orderModel = require('../models/order.js');
const productModel = require('../models/product.js');
const userModel = require('../models/user.js');
const { ROLES } = require('../models/role.js');

const { authenticateToken, roleAuthentication } = require('../util/jwt.js');
const { getSpecificOrder, authGetOrder, scopedOrders } = require('../permissions/order.js');

// Get all the orders of the logged in user
router.get('/', authenticateToken, roleAuthentication(ROLES.CLIENT, ROLES.ADMIN), async (req, res) => {
    try {
        const data = await orderModel.find({ });
        if (!data) return res.status(400).json({ message: "No orders were found" });

        // If the user is client return only the orders he had created
        if (req.user.role == ROLES.CLIENT){
            const filtered_orders = await scopedOrders(req.user, data);
            //console.log("In router: ", filtered_orders);
            if (!filtered_orders) return res.status(400).json({ message: "No orders found for the logged in user" });
            return res.status(200).json({ orders: filtered_orders });
        }

        // The user is an admin so return all the orders found
        return res.status(200).json({ orders: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});

router.get('/:id', authenticateToken, roleAuthentication(ROLES.CLIENT),
            getSpecificOrder, authGetOrder, async (req, res) => {

    // This one calls two middlewares to get the order requested
    // then the result is passed to the request body in to the next middleware 
    // where I check if the user requested to see the order is the 
    // user that made the order
    res.json(req.order);
});

router.post('/', authenticateToken, roleAuthentication(ROLES.CLIENT), async (req, res) => {
    // Validate that data is in proper format
    const { error } = orderValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Removed this because user logged in already exists
    // I was giving the client in the body but he exists already in req.user

    //const data = await userModel.findOne({ _id : req.body.client });
    //if (!data) return res.status(400).json({ message: `The user ${req.body.client} does not exist` });

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
                client: req.user.id,
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


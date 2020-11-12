const express = require('express');
const router = express.Router();

const { authenticateToken, roleAuthentication } = require('../util/jwt.js');

const { productValidator } = require('../util/validators.js');

const productModel = require('../models/product.js');
const { ROLES } = require('../models/role.js');

const { scopedProducts } = require('../permissions/product.js');

router.get('/', authenticateToken, roleAuthentication(ROLES.SHOP_OWNER, ROLES.CLIENT), async (req, res) => {

    try {
        const data = await productModel.find({ });
        if (!data) return res.status(400).json({ message: "No products were found" });

        // If the user is shop owner return only the products he had created
        if (req.user.role === ROLES.SHOP_OWNER){
            const filtered_products = await scopedProducts(req.user, data);
            //console.log("In router: ", filtered_products);
            if (!filtered_products) return res.status(400).json({ message: "No products found for the logged in user" });
            return res.status(200).json({ products: filtered_products });
        }

        // The user is a client so return all the products found
        return res.status(200).json({ products: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});

router.get('/:id', authenticateToken, roleAuthentication(ROLES.SHOP_OWNER, ROLES.CLIENT), async (req, res) => {
    const product_id = req.params.id;

    try {
        const data = await productModel.findOne({ _id : product_id });
        if (!data) return res.status(400).json({ message: "Product was not found" });
        return res.status(200).json({ product: data });
    } catch (error) {
        console.error(error);
        // That occurs if the id given has wrong length (most likely)
        return res.status(500).json({ message: error.message });
    }
});

router.post('/', authenticateToken, roleAuthentication(ROLES.SHOP_OWNER), async (req, res) => {
    // Checking if the provided product has the appropriate information
    const { error } = productValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        // Creating a new product to save in the database
        const product = new productModel({
            category: req.body.category,
            title: req.body.title,
            price: req.body.price,
            provider: req.body.provider,
            trader: req.user.id
        });

        const data = await product.save();
        if (!data) return res.status(400).json({ message: "Failed saving the product" });

        return res.status(201).json({ product: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', authenticateToken, roleAuthentication(ROLES.SHOP_OWNER), async (req, res) => {
    // Checking if the provided product has the appropriate information
    const { error } = productValidator(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Checking if the requested product for update exists in database
    const product_id = req.params.id;
    const product = await productModel.findOne({ _id : product_id });
    if (!product) return res.status(400).json({ message: "Product was not found" });

    try {
        product.category = req.body.category;
        product.title = req.body.title;
        product.price = req.body.price;
        product.provider = req.body.provider;
        const updated_product = await product.save();

        if (!updated_product) return res.status(500).json({ message: "Something went wrong updating the product" });
        return res.status(200).json({ product: updated_product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "There was a server error" });
    }
});

router.delete('/:id', authenticateToken, roleAuthentication(ROLES.SHOP_OWNER), async (req, res) => {
    // Checking if the requested product for update exists in database
    const product_id = req.params.id;
    const product = await productModel.findOne({ _id : product_id });
    if (!product) return res.status(400).json({ message: "Product was not found" });

    try {
        const data = await product.deleteOne({ _id: product_id });
        if (!data) return res.status(500).json({ message: "Something went wrong during deletion of product" });

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
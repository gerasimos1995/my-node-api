const { ROLES } = require("../models/role");
const orderModel = require("../models/order.js");
const Logger = require('../util/logger');

async function getSpecificOrder(req, res , next){
    const order_id = req.params.id;
    try {
        const data = await orderModel.findOne({ _id : order_id });
        if (!data) return res.status(400).json({ message: "Order was not found" });
        req.order = data;
        next();
    } catch (error) {
        Logger.error(error);
        //console.error(error);
        // That occurs if the id given has wrong length (most likely)
        return res.status(500).json({ message: error.message });
    }
}

function authGetOrder(req, res, next){
    if (!canViewOrder(req.user, req.order)) {
        res.status(401);
        return res.send("Not allowed to view this order");
    }
    next();
}

function canViewOrder(user, order){
    //console.log("User: ", user);
    //console.log("Order: ", order);
    return (
       user.role === ROLES.ADMIN || 
       order.client == user.id
    )
}

function scopedOrders(user, orders) {
    return new Promise((resolve, reject) => {
        const filtered_orders = orders.filter(order => order.client == user.id );
        Logger.info(filtered_orders);
        //console.log("Filtered orders: ", filtered_orders);
        //if (!filtered_orders) reject(null);
        resolve(filtered_orders);
    });
}

module.exports = {
    getSpecificOrder,
    authGetOrder,
    scopedOrders
}
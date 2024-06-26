import CartItem from "../models/cart.js";
import AuthModel from "../models/Auth.js";

export const addItemToCart = async (req, res) => {
    try {
        const { itemId, selectedDate, persons, totalPrice } = req.body;
        const newCartItem = new CartItem({ itemId, selectedDate, persons, totalPrice });
        const user = await AuthModel.findById(req.userId);
        user.cart.push(newCartItem);
        await user.save();
        await newCartItem.save();
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getCartItems = async (req, res) => {
    try {
        const user = await AuthModel.findById(req.userId);
        const cartIds = user.cart;
        const cartItems = await CartItem.find({ _id: { $in: cartIds } }).populate("itemId");
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        const cartItem = await CartItem.findById(id);
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemId, selectedDate, persons, totalPrice } = req.body;
        const updatedCartItem = { itemId, selectedDate, persons, totalPrice };
        const user = await AuthModel.findById(req.userId);

        if (!user.cart.includes(id)) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await CartItem.findByIdAndUpdate
            (id, updatedCartItem, { new: true });

        res.json(updatedCartItem);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const removeItemFromCart = async (req, res) => {
    try {
        const user = await AuthModel.findById(req.userId);
        user.cart = user.cart.filter((cartItem) => cartItem.toString() !== req.params.id.toString());
        await user.save();

        const deletedCartItem = await CartItem.findByIdAndRemove(req.params.id);

        res.json(deletedCartItem);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
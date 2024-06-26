import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthModel from "../models/Auth.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      birthday,
      state,
      country,
      postalCode,
      phoneNumber,
      address,
      city,
      preferences,
    } = req.body;

    // Check if the user exists
    const oldUser = await AuthModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exists with this email");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await AuthModel.create({
      name,
      email,
      hashedPassword: encryptedPassword,
      birthday,
      state,
      country,
      city,
      postalCode,
      phoneNumber,
      address,
      preferences,
    });

    // Create token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await AuthModel.findOne({ email });

    if (!user) {
      return res.status(404).send("User doesn't exist");
    }

    // Validate password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );

    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }

    // Create token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await AuthModel.findOne({ email });

    if (!user) {
      return res.status(404).send("User doesn't exist");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    user.hashedPassword = encryptedPassword;
    await user.save();

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, picture, preferences } = req.body;
    console.log(name, picture, preferences)
    const user = await AuthModel.findById(req.userId);
    if (name) {
      user.name = name;
    }
    if (picture) {
      user.picture = picture;
    }

    if (preferences) {
      user.preferences = preferences;
    }

    await user.save();
    res.status(201).send("User has been updated!");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await AuthModel.findById(req.userId);

    if (!user) {
      return res.status(404).send("User doesn't exist");
    }
    if (!user.wishlist.includes(itemId.toString())) {
      return res.status(400).send("Item not found in wishlist!");
    } else {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== itemId.toString()
      );
    }

    await user.save();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const appendToWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await AuthModel.findById(req.userId);
    if (!user) {
      return res.status(404).send("User doesn't exist");
    }
    if (user.wishlist.includes(itemId)) {
      return res.status(400).send("Item already in wishlist!");
    }
    user.wishlist.push(itemId);
    await user.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.userId).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
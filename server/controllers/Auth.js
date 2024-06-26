import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthModel from "../models/Auth.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";
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

    // creating a verification token
    const verificationToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    user.verificationToken = verificationToken;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Welcome!",
      text: `Welcome, ${user.name}. We are glad to have you on board! Please verify your email from the following link:
        http://localhost:4000/auth/verify/${verificationToken}
        `,
    });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await AuthModel.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.isVerified = true;
    user.verificationToken = "";
    await user.save();
    res.redirect("http://localhost:5173/login");
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const resetPassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Check if the user exists
    const user = await AuthModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.hashedPassword
    );

    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid credentials");
    }

    // Check if the new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.hashedPassword = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while trying to reset password",
      error: error.message,
    });
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
    console.log(name, picture, preferences);
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
    res.status(201).json(user.wishlist);
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
    res.status(201).json(user.wishlist);
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

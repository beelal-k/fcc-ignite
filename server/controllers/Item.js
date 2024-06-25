import Item from "../models/ItemModel.js";
import AuthModel from "../models/Auth.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const createItem = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  const user = await AuthModel.findById(userId);
  if (!user.businessId) {
    return res.status(401).json({ error: "You are not a business owner" });
  }
  let {
    title,
    category,
    images,
    videos,
    content,
    location,
    price,
    available_dates,
  } = req.body;
  try {
    const cat = category;
    category = category.toLowerCase().split(" ").join("-");
    const item = await Item.create({
      title,
      category,
      images,
      videos,
      businessId: user.businessId,
      content,
      location,
      price,
      available_dates,
    });

    const users = await AuthModel.find({ preferences: { $in: [cat] } });
    console.log(`sending mails to ${users.length} users`);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tbcgulfmarketing@gmail.com",
        pass: "gyqj dwxp nrmo qobv",
      },
    });
    {
      users.map(async (user) => {
        const mailOptions = {
          from: "tbcgulfmarketing@gmail.com",
          to: user.email,
          subject: "New Tourist Attraction",
          text: `
        Hi ${user.name},
        A new tourist attraction has been added to the ${cat} category.
        `,
        };
        await transporter.sendMail(mailOptions);
        user.notifications.push({
          content: `A new tourist attraction has been added to the ${cat} category.`,
          createdAt: new Date(),
        });
        await user.save();
      });
    }
    res.status(200).send(item);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getMyItems = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  try {
    const items = await Item.find({ businessId: user.businessId });
    res.status(200).send(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const getItems = async (req, res) => {
  try {
    const cat = req.query.category;
    const items = await Item.find(
      cat ? (cat !== "all" ? { category: cat } : {}) : {}
    );
    res.status(200).send(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    let item = await Item.findById(id).populate({
      path: "reviews.user_id",
      select: "name _id picture email",
    });
    if (!item) {
      return res.status(404).json({ error: "Item not found!" });
    }
    const user = await AuthModel.findOne({
      businessId: item.businessId,
    });
    if (!user) {
      return res.status(404).json({ error: "Seller not found!" });
    }
    item = item.toObject(); // Convert the mongoose document to a plain JavaScript object
    item.sellerId = user._id; // Attach sellerId to the item
    res.status(200).send(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(500).json({ error: "Item not found!" });
    }
    res.status(200).send(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItemByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const items = await Item.find({
      businessId,
    });

    if (!items) {
      return res.status(500).json({ error: "Items not found!" });
    }

    res.status(200).send(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { itemId, review, rating } = req.body;
    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        $push: {
          reviews: {
            user_id: req.userId,
            review,
            rating,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { itemId, review, rating } = req.body;
    const item = await Item.findOneAndUpdate(
      { _id: itemId, "reviews.user_id": req.userId },
      {
        $set: {
          "reviews.$.review": review,
          "reviews.$.rating": rating,
        },
      },
      { new: true }
    );

    return res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findOneAndUpdate(
      {
        _id: itemId,
        "reviews.user_id": req.userId,
      },
      {
        $pull: {
          reviews: { user_id: req.userId },
        },
      },
      { new: true }
    );

    return res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analytics = async (req, res) => {
  try {
    const items = await Item.find({
      businessId: req.params.id,
    });

    res.status(200).json(items.length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateSurprise = async (req, res) => {
  try {
    const { budget } = req.params;
    const userId = req.userId;

    const user = await AuthModel.findById(userId);
    const pref = user.preferences;
    // parsing the categories
    const arr = [];
    pref.forEach(element => {
      arr.push(element.replace(/\s+/g, '-').toLowerCase());
    });
    const items = await Item.find();
    // filter once to get the right categories
    const filteredItems = await items.filter((item) => arr.includes(item.category));
    // filter again to get the right budget
    const evenMoreFilteredItems = filteredItems.filter((item) => item.price <= budget);

    res.status(200).send(evenMoreFilteredItems);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
import Item from "../models/ItemModel.js";
import AuthModel from "../models/Auth.js";
import dotenv from "dotenv";
dotenv.config();
import AWS from 'aws-sdk';

dotenv.config();



// const comprehend = new AWS.Comprehend();
// SECRET REMOVED

export const moderateContent = async (text) => {
  const params = {
    TextList: [text],
    LanguageCode: 'en'
  };

  const data = await comprehend.batchDetectSentiment(params).promise();
  const sentiment = data.ResultList[0].SentimentScore;

  if (sentiment.Negative > 0.5) {
    return false;
  }
  return true;
};

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
    availableDates,
    personsCapacity,
  } = req.body;

  const isContentSafe = await moderateContent(title);
  if (!isContentSafe) {
    return res.status(400).send("Content is not safe");
  }

  if (
    !title ||
    !category ||
    !images ||
    !content ||
    !location ||
    !price ||
    !availableDates ||
    !personsCapacity
  ) {
    return res.status(400).send("All fields are required");
  }
  try {
    const item = await Item.create({
      title,
      category,
      images,
      videos,
      businessId: user.businessId,
      content,
      location,
      personsCapacity,
      price,
      availableDates,
    });
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
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      images,
      videos,
      content,
      location,
      price,
      availableDates,
      personsCapacity,
    } = req.body;
    if (
      !title ||
      !category ||
      !images ||
      !content ||
      !location ||
      !price ||
      !availableDates ||
      !personsCapacity
    ) {
      return res.status(400).send("All fields are required");
    }

    const item = await Item.findByIdAndUpdate(
      id,
      {
        title,
        category,
        images,
        videos,
        content,
        location,
        price,
        availableDates,
        personsCapacity,
      },
      { new: true }
    );
    res.status(200).send(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const { region, checkIn, checkOut, guests, category } = req.query;
    const filter = {};

    // Filter by region
    if (region) {
      const formattedRegion = region.toLowerCase().replace(/\s+/g, "-");
      filter["location.region"] = { $regex: formattedRegion, $options: "i" };
    }

    // Filter by guests
    if (guests) {
      filter["personsCapacity"] = { $gte: parseInt(guests, 10) };
    }

    // Filter by date range
    if (checkIn && checkOut) {
      filter.$and = [
        { "availableDates.dates.0": { $lte: new Date(checkIn) } },
        { "availableDates.dates.1": { $gte: new Date(checkIn) } },
        { "availableDates.dates.0": { $lte: new Date(checkOut) } },
        { "availableDates.dates.1": { $gte: new Date(checkOut) } },
      ];
    } else if (checkIn) {
      filter.$and = [
        { "availableDates.dates.0": { $lte: new Date(checkIn) } },
        { "availableDates.dates.1": { $gte: new Date(checkIn) } },
      ];
    } else if (checkOut) {
      filter.$and = [
        { "availableDates.dates.0": { $lte: new Date(checkOut) } },
        { "availableDates.dates.1": { $gte: new Date(checkOut) } },
      ];
    }

    const items = await Item.find(filter).populate("businessId");

    if (category) {
      const filteredItems = items.filter(
        (item) => item.category.toLowerCase().replace(/\s+/g, "-") === category
      );
      return res.status(200).send(filteredItems);
    }

    res.status(200).send(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItemsByCat = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Item.find();
    const filteredItems = items.filter(
      (item) => item.category.toLowerCase().replace(/\s+/g, "-") === category
    );
    res.status(200).send(filteredItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    let item = await Item.findById(id)
      .populate({
        path: "reviews.user_id",
        select: "name _id picture email",
      })
      .populate({ path: "businessId", populate: { path: "postedItems" } });

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
    item.seller = user; // Attach sellerId to the item
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
    const isContentSafe = await moderateContent(review);
    if (!isContentSafe) {
      return res.status(400).send("Content is not safe");
    }
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
    pref.forEach((element) => {
      arr.push(element.replace(/\s+/g, "-").toLowerCase());
    });
    const items = await Item.find();
    // filter once to get the right categories
    const filteredItems = await items.filter((item) =>
      arr.includes(item.category)
    );
    // filter again to get the right budget
    const evenMoreFilteredItems = filteredItems.filter(
      (item) => item.price <= budget
    );

    res.status(200).send(evenMoreFilteredItems);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

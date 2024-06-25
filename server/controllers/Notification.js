import AuthModel from "../models/Auth.js";

export const createNotification = async (req, res) => {
  try {
    const userId = await AuthModel.findById(req.body.userId);
    if (!userId) {
      return res.status(404).send("User doesn't exist");
    }
    const notification = {
      content: req.body.content,
      createdAt: new Date().toISOString(),
    };
    userId.notifications.push(notification);
    await userId.save();
    res.status(201).send("Notification has been created!");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

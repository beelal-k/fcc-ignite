import AuthModel from "../models/Auth.js";
import Complaint from "../models/complaint.js";
import nodemailer from "nodemailer";

export const createComplaint = async (req, res) => {
  try {
    const { message, itemId, businessId } = req.body;
    const userId = req.userId;
    const complaint = new Complaint({ userId, message, itemId, businessId });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getComplaintsByUser = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.userId,
    })
      .populate("itemId")
      .populate("userId");

    res.status(200).json(complaints);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await Complaint.findByIdAndDelete(id);
    res.status(200).json("Complaint has been deleted");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getComplaintsByBusiness = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      businessId: req.params.id,
    })
      .populate("itemId")
      .populate("userId");

    res.status(200).json(complaints);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const analytics = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      businessId: req.params.id,
    });

    res.status(200).json(complaints.length);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const replyToComplaint = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
       return res.status(400).send("No text found!");
    }
    const complaint = await Complaint.findById(req.params.id);
    const userId = complaint.userId;
    const user = await AuthModel.findById(userId);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tbcgulfmarketing@gmail.com",
        pass: "gyqj dwxp nrmo qobv",
      },
    });

    const mailOptions = {
      from: "tbcgulfmarketing@gmail.com",
      to: user.email,
      subject: "Response to your complaint",
      text: `
              Hi ${user.name},
              ${text}
              `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).send("Response sent successfully!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

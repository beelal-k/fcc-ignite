import Item from "../models/ItemModel.js";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 150, 
      messages: [
        {
          role: "system",
          content: `You are a helpful tour guide and you are helping a group of tourists.`,
        },
        {
          role: "user",
          content: prompt,
        },
        
      ],
    });

    let answer = chatResponse.choices[0].message.content;
    res.status(200).json({
      success: true,
      message: answer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

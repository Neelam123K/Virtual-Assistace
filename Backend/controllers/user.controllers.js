import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "get current user error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    const assistantImage = req.file
      ? await uploadOnCloudinary(req.file.path)
      : imageUrl;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "update assistant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.assistantName) return res.status(400).json({ message: "Please set your assistant name first" });
    if (!user.name) return res.status(400).json({ message: "Please set your name in profile first" });
    if (!command || !command.trim()) return res.status(400).json({ message: "Command is required" });

    // Save history
    user.history.push(command);
    await user.save();

    const gemResult = await geminiResponse(command, user.name, user.assistantName);

    // Fallback if Gemini fails
    if (!gemResult) {
      return res.json({
        type: "general",
        userinput: command,
        response: "Sorry, I didn't understand that.",
      });
    }

    // Always have a type
    const type = gemResult.type || "general";
    const userinput = gemResult.userInput || command;
    const responseText = gemResult.response || "Sorry, I didn't understand that.";

    // Handle special date/time commands
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userinput,
          response: `Current date is ${moment().format("MMMM Do YYYY")}`,
        });
      case "get_time":
        return res.json({
          type,
          userinput,
          response: `Current time is ${moment().format("h:mm:ss A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userinput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userinput,
          response: `This month is ${moment().format("MMMM")}`,
        });
      default:
        // For all other commands, just return Gemini's response
        return res.json({
          type,
          userinput,
          response: responseText,
        });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(400).json({ message: "ask to assistant error", error: error.message });
  }
};

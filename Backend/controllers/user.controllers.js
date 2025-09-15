import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "get current user error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "update assistant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    user.save()
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } else if (!user.assistantName) {
      return res
        .status(400)
        .json({ message: "Please set your assistant name first" });
    } else if (!user.name) {
      return res
        .status(400)
        .json({ message: "Please set your name in profile first" });
    } else if (!command) {
      return res.status(400).json({ message: "Command is required" });
    }
    const userName = user.name;
    const assistantName = user.assistantName;
    
    console.log("Calling geminiResponse with:", userName, assistantName, command);
    
    const result = await geminiResponse(command, assistantName, userName);
    
    console.log("Raw Gemini Response:", result);
    console.log("Type of result:", typeof result);
    
     const jsonMatch = result?.match(/{[\s\S]*}/);
    console.log("JSON Match:", jsonMatch);
    
    if (!jsonMatch) {
      console.log("No JSON found in response");
      return res.status(400).json({ 
        message: "Invalid response from assistant, I can't understand",
        debug: { rawResponse: result }
      });
    }
    
    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
      console.log("Parsed JSON:", gemResult);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return res.status(400).json({ 
        message: "Failed to parse assistant response",
        debug: { rawResponse: result, jsonMatch: jsonMatch[0] }
  });
    }
    
    const type = gemResult.type;
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: `Current date is ${moment().format("MMMM Do YYYY")}`,
        });
      case "get_time":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: `Current time is ${moment().format("h:mm:ss A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userinput: gemResult.userinput,
 response: `Today month is ${moment().format("MMMM")}`,
 
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: gemResult.response,
        });
      default:
        return res.status(400).json({
          message:
            "Invalid response from assistant, I can't understand that command",
        });
    }
  } catch (error) {
    console.error("Full error:", error);
    res.status(400).json({ message: "ask to assistant error", error: error.message });
  }
};
const Message = require("../models/message");
const users = require("../models/users");
//
exports.getAllConversationService = async (userId) => {
  try {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: user._id }, { receiverId: user._id }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              {
                $eq: ["$senderId", user._id],
              },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $last: "$message" },
          lastMessageTime: { $last: "$createdAt" },
        },
      },
      { $sort: { lastUpdated: -1 } },
    ]);
    return { success: true, conversations };
  } catch (error) {}
};

exports.getMessageService = async (userId, receiverId) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });
    if (!messages) {
      throw new Error("Messages not found");
    }
    return { success: true, messages };
  } catch (error) {}
};

exports.sendMessageService = async (userId, receiverId, message) => {
  try {
    const senderUser = await users.findById(userId);
    if (!senderUser) {
      throw new Error("Sender user not found");
    }
    const receiverUser = await users.findById(receiverId);
    if (!receiverUser) {
      throw new Error("Receiver user not found");
    }

    await Message.create({
      senderId: userId,
      receiverId: receiverUser._id,
      message,
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

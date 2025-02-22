const Call = require("../models/call");
const users = require("../models/users");
const { getReceiverSocketId, io } = require("../utils/socket");
exports.makePhoneCallService = async (userId, receiverId) => {
  try {
    const userValid = await users.findById(userId);
    if (!userValid) {
      throw new Error("User not found");
    }
    const receiverValid = await users.findById(receiverId);
    if (!receiverValid) {
      throw new Error("Receiver user not found");
    }
    const newCall = await Call.create({
      senderId: userId,
      receiverId: receiverId,
      isSuccess: false,
    });
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-call", newCall);
    
    } else {
      console.log("Receiver is not connected:", receiverId);
    }
    return { success: true, call: newCall };
  } catch (error) {
    console.log(error);
  }
};

exports.acceptPhoneCallService = async (callId) => {
  try {
    const callValid = Call.findById(callId);
    if (!callValid) {
      throw new Error("Call not found");
    }
    const callUpdate = await Call.findByIdAndUpdate(callId, {
      isSuccess: true,
    });
    if (callUpdate) {
      const receiverSocketId = getReceiverSocketId(callUpdate.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call-accepted", callUpdate);
      }
      return { success: true };
    }
    return { success: false, message: "Call not found" };
  } catch (error) {
    console.log(error);
  }
};

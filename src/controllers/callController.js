const callService = require("../services/callService");
// make phone call
exports.makePhoneCall = async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.id;
    const response = await callService.makePhoneCallService(userId, receiverId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// accept phone call
exports.acceptPhoneCall = async (req, res) => {
  try {
    const callId = req.params.id;
    const response = await callService.acceptPhoneCallService(callId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Call accepted successfully");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

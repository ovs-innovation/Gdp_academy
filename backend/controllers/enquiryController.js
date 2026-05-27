/**
 * Enquiry Controller (CommonJS version)
 */
const Enquiry = require("../models/enquiryModel.js");
require("../models/programModel.js");
const {
  sendEnquiryConfirmationEmail,
  sendEnquiryNotificationToAdmin,
} = require("../utils/emailService.js");

const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, programId, workshopId, source, subject, whatsappConsent } =
      req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        message: "Name, email, phone, and message are required",
      });
    }

    const validSources = ["program", "workshop", "contact_form", "general"];
    if (source && !validSources.includes(source)) {
      return res.status(400).json({
        message: "Invalid source",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      subject: subject || "",
      whatsappConsent: Boolean(whatsappConsent),
      programId: programId || null,
      workshopId: workshopId || null,
      source: source || "general",
      userId: req.user?.id || null,
    });

    try {
      await sendEnquiryConfirmationEmail({ name, email });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    try {
      await sendEnquiryNotificationToAdmin({ enquiry: enquiry.toObject() });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    return res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry: enquiry.toObject(),
    });
  } catch (error) {
    next(error);
  }
};

const getAllEnquiries = async (req, res, next) => {
  try {
    const { status, source, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const enquiries = await Enquiry.find(query)
      .populate("userId", "name email")
      .populate("programId", "name")
      .populate("workshopId", "name")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments(query);

    return res.json({
      enquiries,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

const getEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findById(id)
      .populate("userId", "name email")
      .populate("programId")
      .populate("workshopId")
      .populate("assignedTo", "name email");

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    return res.json(enquiry);
  } catch (error) {
    next(error);
  }
};

const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const validStatuses = ["new", "in_progress", "closed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(notes && { notes }),
        ...(assignedTo && { assignedTo }),
      },
      { new: true },
    )
      .populate("userId", "name email")
      .populate("programId")
      .populate("workshopId")
      .populate("assignedTo", "name email");

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    return res.json({
      message: "Enquiry updated successfully",
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    return res.json({
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getEnquiryStats = async (req, res, next) => {
  try {
    const total = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: "new" });
    const inProgress = await Enquiry.countDocuments({ status: "in_progress" });
    const closed = await Enquiry.countDocuments({ status: "closed" });

    const bySource = await Enquiry.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.json({
      total,
      newEnquiries,
      inProgress,
      closed,
      bySource,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  getEnquiryStats,
};

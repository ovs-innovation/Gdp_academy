const ContactMessage = require("../models/contactMessageModel");
const {
  sendContactMessageNotificationToAdmin,
} = require("../utils/emailService.js");
const { validateLeadFields } = require("../utils/enquiryValidation.js");

// Public – submit a contact message
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const validation = validateLeadFields({ name, email, phone, message });
    if (!validation.ok) {
      return res.status(400).json({
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
    } = validation.values;

    const contact = await ContactMessage.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: subject?.trim() || "Contact Page Enquiry",
      message: cleanMessage,
      source: "contact_page",
    });

    try {
      await sendContactMessageNotificationToAdmin(contact.toObject());
    } catch (emailErr) {
      console.error("Contact form admin email failed:", emailErr.message);
    }

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (err) {
    next(err);
  }
};

// Admin – get all contact messages (with filters & pagination)
const getAllContactMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {
      $or: [
        { source: "contact_page" },
        {
          source: { $exists: false },
          subject: { $not: /Homepage Let's Catch up/i },
        },
      ],
    };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ContactMessage.countDocuments(query);

    res.json({
      messages,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// Admin – get single message by ID
const getContactMessageById = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: msg,
    });
  } catch (err) {
    next(err);
  }
};

// Admin – update status (new → read → closed)
const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Status updated",
      contact: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin – delete contact message
const deleteContactMessage = async (req, res, next) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message deleted",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
};

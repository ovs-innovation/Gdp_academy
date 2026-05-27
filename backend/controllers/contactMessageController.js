const ContactMessage = require("../models/contactMessageModel");

// Public – submit a contact message
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "Name, email, phone, and message are required",
      });
    }

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject?.trim() || "Contact Page Enquiry",
      message: message.trim(),
      source: "contact_page",
    });

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

/**
 * Enquiry Controller (CommonJS version)
 */
const Enquiry = require("../models/enquiryModel.js");
const Role = require("../models/roleModel.js");
const { rolePermissions } = require("../lib/roles.js");
require("../models/programModel.js");
const {
  sendEnquiryConfirmationEmail,
  sendEnquiryNotificationToAdmin,
} = require("../utils/emailService.js");
const { validateLeadFields } = require("../utils/enquiryValidation.js");

const POPULATE = [
  { path: "userId", select: "name email" },
  { path: "programId", select: "name" },
  { path: "workshopId", select: "name" },
  { path: "assignedTo", select: "name email role" },
  { path: "assignedBy", select: "name email" },
  { path: "closedBy", select: "name email" },
];

const resolveUserPermissions = async (roleKey) => {
  if (!roleKey) return [];
  if (roleKey === "admin" || roleKey === "super_admin") {
    return rolePermissions.admin || [];
  }
  const role = await Role.findOne({ key: roleKey });
  const dbPerms = role?.permissions || [];
  const defaultPerms = rolePermissions[roleKey] || [];
  return dbPerms.length > 0 ? dbPerms : defaultPerms;
};

const canManageAllEnquiries = async (req) => {
  const roleKey = req.user?.role;
  if (roleKey === "admin" || roleKey === "super_admin") return true;
  const perms = await resolveUserPermissions(roleKey);
  return perms.includes("enquiries.assign");
};

const getAssigneeId = (value) => {
  if (!value) return null;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const assertCanAccessEnquiry = async (req, enquiry) => {
  if (await canManageAllEnquiries(req)) return true;
  const assigneeId = getAssigneeId(enquiry.assignedTo);
  if (!assigneeId) return true; // unassigned pool
  return assigneeId === String(req.user.id);
};

const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, programId, workshopId, source, subject, whatsappConsent } =
      req.body;

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

    const validSources = ["program", "workshop", "contact_form", "general"];
    if (source && !validSources.includes(source)) {
      return res.status(400).json({
        message: "Invalid source",
      });
    }

    const enquiry = await Enquiry.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
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
    const {
      status,
      source,
      page = 1,
      limit = 10,
      search,
      assignedTo,
      unassigned,
      mine,
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};
    const manageAll = await canManageAllEnquiries(req);
    const andClauses = [];

    if (status) query.status = status;
    if (source) query.source = source;

    if (!manageAll) {
      // Staff queue: own assignments + unassigned pool they can claim
      andClauses.push({
        $or: [{ assignedTo: req.user.id }, { assignedTo: null }],
      });
    } else if (mine === "true") {
      query.assignedTo = req.user.id;
    } else if (unassigned === "true") {
      query.assignedTo = null;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      andClauses.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (andClauses.length === 1) {
      Object.assign(query, andClauses[0]);
    } else if (andClauses.length > 1) {
      query.$and = andClauses;
    }

    const enquiries = await Enquiry.find(query)
      .populate(POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments(query);

    return res.json({
      enquiries,
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

const getEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findById(id).populate(POPULATE);

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    if (!(await assertCanAccessEnquiry(req, enquiry))) {
      return res.status(403).json({ message: "Forbidden" });
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
    const actorId = req.user?.id;
    const manageAll = await canManageAllEnquiries(req);

    const validStatuses = ["new", "in_progress", "closed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    const currentAssignee = getAssigneeId(enquiry.assignedTo);
    const isOwn = currentAssignee === String(actorId);
    const isUnassigned = !currentAssignee;

    if (!manageAll) {
      const tryingToAssign =
        Object.prototype.hasOwnProperty.call(req.body, "assignedTo") &&
        assignedTo !== undefined;

      if (tryingToAssign) {
        const nextAssignee =
          assignedTo === null || assignedTo === "" ? null : String(assignedTo);
        // Staff can only claim unassigned for themselves
        if (!(isUnassigned && nextAssignee === String(actorId))) {
          return res.status(403).json({
            message: "You can only claim unassigned enquiries for yourself",
          });
        }
      } else if (!isOwn && !isUnassigned) {
        return res.status(403).json({ message: "Forbidden" });
      } else if (isUnassigned && !tryingToAssign) {
        // Allow status/notes only after claiming, or auto-claim on edit
        enquiry.assignedTo = actorId;
        enquiry.assignedBy = actorId;
        enquiry.assignedAt = new Date();
        if (!status && enquiry.status === "new") {
          enquiry.status = "in_progress";
        }
      }
    }

    if (status) {
      enquiry.status = status;
      if (status === "closed") {
        enquiry.closedBy = actorId;
        enquiry.closedAt = new Date();
      } else {
        enquiry.closedBy = null;
        enquiry.closedAt = null;
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "notes")) {
      enquiry.notes = notes ?? "";
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "assignedTo") && manageAll) {
      if (assignedTo === null || assignedTo === "" || assignedTo === "unassigned") {
        enquiry.assignedTo = null;
        enquiry.assignedBy = null;
        enquiry.assignedAt = null;
      } else {
        const nextId = String(assignedTo);
        const prevId = currentAssignee;
        if (nextId !== prevId) {
          enquiry.assignedTo = nextId;
          enquiry.assignedBy = actorId;
          enquiry.assignedAt = new Date();
          if (enquiry.status === "new") {
            enquiry.status = "in_progress";
          }
        }
      }
    } else if (
      Object.prototype.hasOwnProperty.call(req.body, "assignedTo") &&
      !manageAll &&
      (assignedTo === null || assignedTo === "" ? null : String(assignedTo)) ===
        String(actorId)
    ) {
      enquiry.assignedTo = actorId;
      enquiry.assignedBy = actorId;
      enquiry.assignedAt = new Date();
      if (enquiry.status === "new") {
        enquiry.status = "in_progress";
      }
    }

    await enquiry.save();
    await enquiry.populate(POPULATE);

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

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    if (!(await canManageAllEnquiries(req))) {
      return res.status(403).json({
        message: "Only managers can delete enquiries",
      });
    }

    await Enquiry.findByIdAndDelete(id);

    return res.json({
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getEnquiryStats = async (req, res, next) => {
  try {
    const manageAll = await canManageAllEnquiries(req);
    const base = manageAll ? {} : { assignedTo: req.user.id };

    const total = await Enquiry.countDocuments(base);
    const newEnquiries = await Enquiry.countDocuments({ ...base, status: "new" });
    const inProgress = await Enquiry.countDocuments({ ...base, status: "in_progress" });
    const closed = await Enquiry.countDocuments({ ...base, status: "closed" });
    const unassigned = manageAll
      ? await Enquiry.countDocuments({ assignedTo: null })
      : 0;
    const mine = await Enquiry.countDocuments({ assignedTo: req.user.id });

    const bySource = await Enquiry.aggregate([
      { $match: base },
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
        },
      },
    ]);

    const byAssignee = manageAll
      ? await Enquiry.aggregate([
          { $match: { assignedTo: { $ne: null } } },
          {
            $group: {
              _id: "$assignedTo",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              count: 1,
              name: "$user.name",
              email: "$user.email",
            },
          },
          { $sort: { count: -1 } },
        ])
      : [];

    return res.json({
      total,
      newEnquiries,
      inProgress,
      closed,
      unassigned,
      mine,
      bySource,
      byAssignee,
      scoped: !manageAll,
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

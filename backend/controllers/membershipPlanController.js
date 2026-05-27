const MembershipPlan = require("../models/membershipPlanModel.js");

// Create membership plan (admin only)
const createMembershipPlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json({ message: "Membership plan created", plan });
  } catch (err) {
    next(err);
  }
};

// Get all membership plans (public – filter by status)
const getAllMembershipPlans = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const plans = await MembershipPlan.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await MembershipPlan.countDocuments(query);
    res.json({ plans, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// Get single plan by ID
const getMembershipPlanById = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ plan });
  } catch (err) {
    next(err);
  }
};

// Update membership plan (admin only)
const updateMembershipPlan = async (req, res, next) => {
  try {
    const updated = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan updated", plan: updated });
  } catch (err) {
    next(err);
  }
};

// Delete membership plan (admin only)
const deleteMembershipPlan = async (req, res, next) => {
  try {
    const deleted = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    next(err);
  }
};

// Reorder plans (admin only) – expect array of { id, order }
const reorderMembershipPlans = async (req, res, next) => {
  try {
    const { plans } = req.body;
    if (!Array.isArray(plans))
      return res.status(400).json({ message: "plans must be an array" });
    for (const { id, order } of plans) {
      await MembershipPlan.findByIdAndUpdate(id, { order });
    }
    res.json({ message: "Plans reordered" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMembershipPlan,
  getAllMembershipPlans,
  getMembershipPlanById,
  updateMembershipPlan,
  deleteMembershipPlan,
  reorderMembershipPlans,
};

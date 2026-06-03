const {
  getTransport,
  isEmailReady,
  getEmailUser,
  getAdminEmail,
  canSendEmail: hasEmailConfig,
} = require("../lib/emailTransport.js");
const {
  buildAdminLeadEmail,
  buildCustomerThankYouEmail,
  withLogoAttachment,
} = require("./emailTemplates.js");

const canSendEmail = () => hasEmailConfig() && isEmailReady();

const sendMail = async (mailOptions) => {
  if (!canSendEmail()) {
    throw new Error("Email not ready — check backend startup logs for Gmail setup");
  }
  await getTransport().sendMail(mailOptions);
};

const sendOTPEmail = async (email, otp, userName) => {
  try {
    const mailOptions = {
      from: `"GDP Studio Security" <${getEmailUser()}>`,
      to: email,
      subject: "Your Login Verification Code",
      html: `
        <div style="margin:0;padding:32px 0;background:#0b1021;font-family:'Inter',Arial,sans-serif;color:#e2e8f0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:560px;width:100%;background:#0e1426;border:1px solid #1f2a44;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,0.35);">
            <tr>
              <td style="padding:0;">
                <div style="background:linear-gradient(135deg,#6d28d9,#6366f1,#22d3ee);padding:26px 22px;text-align:center;color:#f8fafc;position:relative;">
                  <div style="margin:0 auto 10px auto;width:54px;height:54px;border-radius:16px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);font-size:26px;">
                    🔑
                  </div>
                  <div style="font-size:13px;letter-spacing:1.4px;text-transform:uppercase;opacity:0.92;">Security Verification</div>
                  <div style="font-size:24px;font-weight:700;margin-top:6px;">Login One-Time Code</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 26px 10px 26px;">
                <p style="margin:0 0 10px 0;font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px;">
                  <span style="font-size:16px;">👤</span>
                  Hello ${userName || email},
                </p>
                <p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;color:#cbd5e1;">
                  Use this code to continue signing in. It expires in <strong>10 minutes</strong>.
                </p>
                <div style="text-align:center;margin:18px 0 20px 0;">
                  <div style="display:inline-block;padding:16px 22px;border-radius:14px;background:linear-gradient(135deg,#6d28d9,#6366f1,#22d3ee);color:#fff;font-size:30px;letter-spacing:12px;font-weight:800;box-shadow:0 12px 30px rgba(99,102,241,0.45);">
                    ${otp}
                  </div>
                </div>
                <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#94a3b8;display:flex;align-items:flex-start;gap:8px;">
                  <span style="font-size:14px;margin-top:2px;">⏳</span>
                  If you didn’t request this, please reset your password and review recent activity.
                </p>
                <p style="margin:0 0 6px 0;font-size:13px;color:#94a3b8;">Stay secure,</p>
                <p style="margin:0;font-size:13px;color:#e2e8f0;font-weight:600;">GDP Studio Security</p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 26px 20px 26px;border-top:1px solid #1f2a44;text-align:center;color:#64748b;font-size:12px;background:#0e1426;">
                This is an automated message; no reply is monitored.
              </td>
            </tr>
          </table>
        </div>
      `,
    };
    await sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

const sendResetPasswordEmail = async (email, otp, userName) => {
  try {
    const mailOptions = {
      from: `"GDP Studio Security" <${getEmailUser()}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <div style="margin:0;padding:32px 0;background:#0b1021;font-family:'Inter',Arial,sans-serif;color:#e2e8f0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:560px;width:100%;background:#0e1426;border:1px solid #1f2a44;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,0.35);">
            <tr>
              <td style="padding:0;">
                <div style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:26px 22px;text-align:center;color:#f8fafc;">
                  <div style="font-size:13px;letter-spacing:1.4px;text-transform:uppercase;opacity:0.92;">Password Reset</div>
                  <div style="font-size:24px;font-weight:700;margin-top:6px;">Reset Verification Code</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 26px 10px 26px;">
                <p style="margin:0 0 10px 0;font-size:16px;font-weight:600;">Hello ${userName || email},</p>
                <p style="margin:0 0 18px 0;font-size:15px;line-height:1.6;color:#cbd5e1;">
                  Use this code to reset your password. It expires in <strong>10 minutes</strong>.
                </p>
                <div style="text-align:center;margin:18px 0 20px 0;">
                  <div style="display:inline-block;padding:16px 22px;border-radius:14px;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;font-size:30px;letter-spacing:12px;font-weight:800;box-shadow:0 12px 30px rgba(99,102,241,0.45);">
                    ${otp}
                  </div>
                </div>
                <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#94a3b8;">
                  If you didn't request this, you can ignore this email—your password will remain unchanged.
                </p>
                <p style="margin:0;font-size:13px;color:#e2e8f0;font-weight:600;">GDP Studio Security</p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 26px 20px 26px;border-top:1px solid #1f2a44;text-align:center;color:#64748b;font-size:12px;background:#0e1426;">
                This is an automated message; no reply is monitored.
              </td>
            </tr>
          </table>
        </div>
      `,
    };
    await sendMail(mailOptions);
    console.log(`Reset password email sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};

const sendTeacherRegistrationNotificationToAdmin = async (teacherData) => {
  try {
    const adminEmail = getAdminEmail();
    const mailOptions = {
      from: `"GDP Studio System" <${getEmailUser()}>`,
      to: adminEmail,
      subject: "New Instructor Registration Pending Approval",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6366f1;">New Instructor Signup</h2>
          <p>A new instructor has registered and is waiting for your approval.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Name:</strong> ${teacherData.name}</p>
            <p><strong>Email:</strong> ${teacherData.email}</p>
            <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="margin-top: 20px;">Please login to the admin panel to review and approve this account.</p>
          <p>Regards,<br/>GDP Studio System</p>
        </div>
      `,
    };
    await sendMail(mailOptions);
    console.log(
      `Admin notification sent for new teacher: ${teacherData.email}`,
    );
  } catch (error) {
    console.error("Error sending admin notification email:", error);
  }
};

const sendInstructorApprovalEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: `"GDP Studio Team" <${getEmailUser()}>`,
      to: email,
      subject: "Your Instructor Account has been Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">Congratulations!</h2>
          <p>Hello ${userName},</p>
          <p>Your instructor account on GDP Studio has been approved by the administrators.</p>
          <p>You can now log in to the platform and start managing your profile.</p>
          <div style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login" style="background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to your Account</a>
          </div>
          <p style="margin-top: 30px;">Welcome to the GDP Studio community!</p>
          <p>Regards,<br/>GDP Studio Team</p>
        </div>
      `,
    };
    await sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

const sendEnquiryConfirmationEmail = async ({ name, email }) => {
  if (!canSendEmail()) {
    console.log(
      "Email credentials missing; skipping enquiry confirmation email.",
    );
    return;
  }

  await sendMail(
    withLogoAttachment({
      from: `"GDP Studio" <${getEmailUser()}>`,
      to: email,
      subject: "We received your enquiry — GDP Studio",
      html: buildCustomerThankYouEmail({ name }),
    }),
  );
};

const sendContactMessageNotificationToAdmin = async (contact) => {
  if (!canSendEmail()) {
    console.log("Email not ready; skipping contact form admin notification.");
    return;
  }

  await sendMail(
    withLogoAttachment({
      from: `"GDP Studio" <${getEmailUser()}>`,
      to: getAdminEmail(),
      subject: `New enquiry · ${contact.name}`,
      html: buildAdminLeadEmail({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
      }),
    }),
  );
};

const sendEnquiryNotificationToAdmin = async ({ enquiry }) => {
  if (!canSendEmail()) {
    console.log(
      "Email credentials missing; skipping enquiry admin notification.",
    );
    return;
  }

  await sendMail(
    withLogoAttachment({
      from: `"GDP Studio" <${getEmailUser()}>`,
      to: getAdminEmail(),
      subject: `New enquiry · ${enquiry.name}`,
      html: buildAdminLeadEmail({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
        whatsappConsent: enquiry.whatsappConsent,
      }),
    }),
  );
};

const formatWorkshopWhen = (workshop) => {
  const parts = [];
  if (workshop.workshopDate) {
    const d = new Date(workshop.workshopDate);
    if (!Number.isNaN(d.getTime())) {
      parts.push(d.toLocaleDateString("en-IN", { dateStyle: "medium" }));
    }
  }
  if (workshop.workshopTime) parts.push(workshop.workshopTime);
  if (workshop.workshopEndTime) parts.push(`– ${workshop.workshopEndTime}`);
  return parts.join(" · ") || "Schedule announced soon";
};

const sendWorkshopNotificationToAdmin = async (workshop, action = "published") => {
  if (!canSendEmail()) return;

  const title = getLanguageValue(workshop.name) || "Workshop";
  const when = formatWorkshopWhen(workshop);
  const zoom = workshop.zoomLink || "Link will be shared with enrolled students";
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";

  const mailOptions = {
    from: `"GDP Studio" <${getEmailUser()}>`,
    to: getAdminEmail(),
    subject: `Workshop ${action}: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
        <h2 style="color: #634BFA;">Workshop ${action}</h2>
        <p><strong>${title}</strong></p>
        <p><strong>When:</strong> ${when}</p>
        <p><strong>Price:</strong> ${workshop.price ? `₹${workshop.price}` : "TBD"}</p>
        <p><strong>Zoom:</strong> <a href="${zoom}">${zoom}</a></p>
        <p><a href="${frontend}/workshops">View on website</a></p>
      </div>
    `,
  };

  await sendMail(mailOptions);
};

const sendWorkshopNotificationToStudent = async (student, workshop) => {
  if (!canSendEmail() || !student?.email) return;

  const title = getLanguageValue(workshop.name) || "GDP Workshop";
  const when = formatWorkshopWhen(workshop);
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  const joinBlock = workshop.zoomLink
    ? `<p><a href="${workshop.zoomLink}" style="background:#634BFA;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Join Zoom Session</a></p>`
    : `<p>Visit <a href="${frontend}/live-zoom">Live Zoom page</a> for the join link.</p>`;

  const mailOptions = {
    from: `"GDP Studio" <${getEmailUser()}>`,
    to: student.email,
    subject: `New workshop: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
        <h2 style="color: #634BFA;">You're invited — ${title}</h2>
        <p>Hello ${student.name || "Dancer"},</p>
        <p>A new live class / workshop is scheduled at Garima Dance Productions.</p>
        <p><strong>When:</strong> ${when}</p>
        ${joinBlock}
        <p><a href="${frontend}/workshops">See all workshops</a></p>
        <p style="margin-top:24px;">Regards,<br/>GDP Studio</p>
      </div>
    `,
  };

  await sendMail(mailOptions);
};

/** Notify admin + all active students when a workshop goes live */
const notifyWorkshopClassEmails = async (workshop, options = {}) => {
  const { action = "published", notifyStudents = true } = options;
  if (!canSendEmail()) {
    console.log("Email not configured — skipping class notifications");
    return { sent: false };
  }

  if (workshop.type !== "workshop" || workshop.status !== "active") {
    return { sent: false, reason: "not_active_workshop" };
  }

  try {
    await sendWorkshopNotificationToAdmin(workshop, action);

    let studentCount = 0;
    if (notifyStudents && process.env.CLASS_EMAIL_NOTIFY_STUDENTS !== "false") {
      const User = require("../models/userModel.js");
      const students = await User.find({
        role: "student",
        status: "active",
      })
        .select("name email")
        .lean();

      for (const student of students) {
        try {
          await sendWorkshopNotificationToStudent(student, workshop);
          studentCount += 1;
        } catch (err) {
          console.warn(`Class email failed for ${student.email}:`, err.message);
        }
      }
    }

    console.log(
      `✅ Workshop emails sent (admin + ${studentCount} students): ${getLanguageValue(workshop.name)}`,
    );
    return { sent: true, studentCount };
  } catch (err) {
    console.error("Workshop notification emails failed:", err.message);
    return { sent: false, error: err.message };
  }
};

const getLanguageValue = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val.en) return val.en;
  return String(val);
};

module.exports = {
  sendOTPEmail,
  sendResetPasswordEmail,
  sendTeacherRegistrationNotificationToAdmin,
  sendInstructorApprovalEmail,
  sendEnquiryConfirmationEmail,
  sendEnquiryNotificationToAdmin,
  sendContactMessageNotificationToAdmin,
  sendWorkshopNotificationToAdmin,
  sendWorkshopNotificationToStudent,
  notifyWorkshopClassEmails,
  canSendEmail,
};

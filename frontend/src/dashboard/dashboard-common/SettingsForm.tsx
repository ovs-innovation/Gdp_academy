import React, { useEffect, useState } from "react";
import {
  getSiteSettings,
  updateSiteSettings,
  type SiteSettings,
} from "../../services/settingsService";
import { useTranslation } from "react-i18next";

// Helper to parse JSON fields safely
const safeParse = (str: string, fallback: any) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const SettingsForm: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Load settings on mount
  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...(prev as SiteSettings), [field]: value }));
  };

  const handleAnnouncementChange = (
    field: keyof NonNullable<SiteSettings["announcementBar"]>,
    value: any,
  ) => {
    setSettings((prev) => {
      const current = prev as SiteSettings;
      return {
        ...(current as SiteSettings),
        announcementBar: {
          ...(current.announcementBar ?? {
            enabled: false,
            text: "",
            buttonLabel: "",
            buttonUrl: "",
            backgroundColor: "#060606",
            textColor: "#FFFFFF",
          }),
          [field]: value,
        },
      };
    });
  };

  const handleArrayChange = (field: keyof SiteSettings, raw: string) => {
    const parsed = safeParse(raw, []);
    handleChange(field, parsed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await updateSiteSettings(settings);
      console.log("Settings saved");
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  // Render a simple text input for scalar values and a textarea for JSON arrays/objects
  const renderInput = (
    labelKey: string,
    field: keyof SiteSettings,
    isJson = false,
  ) => (
    <div
      className="form-group"
      key={field as string}
      style={{ marginBottom: "1rem" }}
    >
      <label>{t(labelKey)}</label>
      {isJson ? (
        <textarea
          rows={4}
          style={{ width: "100%", fontFamily: "monospace" }}
          value={JSON.stringify(settings?.[field] ?? "", null, 2)}
          onChange={(e) => handleArrayChange(field, e.target.value)}
        />
      ) : (
        <input
          type="text"
          style={{ width: "100%" }}
          value={(settings?.[field] as any) ?? ""}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      )}
    </div>
  );

  const renderAnnouncementInput = (
    labelKey: string,
    field: keyof NonNullable<SiteSettings["announcementBar"]>,
    isJson = false,
  ) => {
    const current = settings?.announcementBar;
    const value = current ? (current as any)[field] : "";

    return (
      <div
        className="form-group"
        key={field as string}
        style={{ marginBottom: "1rem" }}
      >
        <label>{t(labelKey)}</label>
        {isJson ? (
          <textarea
            rows={4}
            style={{ width: "100%", fontFamily: "monospace" }}
            value={JSON.stringify(value ?? "", null, 2)}
            onChange={(e) =>
              handleAnnouncementChange(field, safeParse(e.target.value, value))
            }
          />
        ) : (
          <input
            type="text"
            style={{ width: "100%" }}
            value={(value as any) ?? ""}
            onChange={(e) => handleAnnouncementChange(field, e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <form
      className="admin-settings-form"
      onSubmit={handleSubmit}
      style={{ maxWidth: "800px", margin: "auto" }}
    >
      <h2 className="admin-section-title">{t("admin.site_settings")}</h2>
      {/* Global fields */}
      {renderInput("admin.site_name", "siteName")}
      {renderInput("admin.hero_badge", "heroBadge")}
      {renderInput("admin.hero_title", "heroTitle")}
      {renderInput("admin.hero_subtitle", "heroSubtitle")}
      {renderInput("admin.hero_statistics", "heroStatistics")}
      {renderInput("admin.hero_trust_logos", "heroTrustLogos")}
      {/* Arrays / complex objects */}
      {renderInput("admin.hero_cta_buttons", "heroCTAButtons", true)}
      {renderInput("admin.hero_videos", "heroVideos", true)}
      {/* Announcement Bar */}
      {renderAnnouncementInput("admin.announcement_enabled", "enabled")}
      {renderAnnouncementInput("admin.announcement_text", "text")}
      {renderAnnouncementInput(
        "admin.announcement_button_label",
        "buttonLabel",
      )}
      {renderAnnouncementInput("admin.announcement_button_url", "buttonUrl")}
      {renderAnnouncementInput(
        "admin.announcement_bg_color",
        "backgroundColor",
      )}
      {renderAnnouncementInput("admin.announcement_text_color", "textColor")}
      {/* Services Section */}
      {renderInput("admin.services_hero_label", "servicesHeroLabel")}
      {renderInput("admin.services_title", "servicesTitle")}
      {renderInput("admin.services_subtitle", "servicesSubtitle")}
      {renderInput(
        "admin.services_overview_label",
        "servicesDetailOverviewLabel",
      )}
      {renderInput(
        "admin.services_overview_title",
        "servicesDetailOverviewTitle",
      )}
      {renderInput(
        "admin.services_cta_label_primary",
        "servicesDetailCtaLabelPrimary",
      )}
      {renderInput(
        "admin.services_cta_label_secondary",
        "servicesDetailCtaLabelSecondary",
      )}
      {/* Service Details */}
      {renderInput(
        "admin.services_detail_hero_label",
        "servicesDetailHeroLabel",
      )}
      {renderInput(
        "admin.services_detail_hero_subtitle",
        "servicesDetailHeroSubtitle",
      )}
      {renderInput(
        "admin.services_detail_overview_label",
        "servicesDetailOverviewLabel",
      )}
      {renderInput(
        "admin.services_detail_overview_title",
        "servicesDetailOverviewTitle",
      )}
      {renderInput(
        "admin.services_detail_key_modules_label",
        "servicesDetailKeyModulesLabel",
      )}
      {renderInput(
        "admin.services_detail_cta_label_primary",
        "servicesDetailCtaLabelPrimary",
      )}
      {renderInput(
        "admin.services_detail_cta_label_secondary",
        "servicesDetailCtaLabelSecondary",
      )}
      {renderInput(
        "admin.services_detail_book_enquiry_button",
        "servicesDetailBookEnquiryButton",
      )}
      {renderInput(
        "admin.services_detail_explore_other_options_label",
        "servicesDetailExploreOtherOptionsLabel",
      )}
      {renderInput(
        "admin.services_detail_explore_other_services_label",
        "servicesDetailExploreOtherServicesLabel",
      )}
      {/* Contact Section */}
      {renderInput("admin.contact_section_title", "contactSectionTitle")}
      {renderInput("admin.contact_section_subtitle", "contactSectionSubtitle")}
      {/* Layout Settings - removed from this compile-only form because they are not part of the current SiteSettings type */}
      <button
        type="submit"
        className="primary-btn"
        style={{ marginTop: "1rem" }}
      >
        {t("admin.save_changes")}
      </button>
    </form>
  );
};

export default SettingsForm;

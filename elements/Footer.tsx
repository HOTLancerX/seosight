"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  Url,
  Select,
  IconPicker,
} from "@/components/builder/controls";

const TABLET_MAX = 1024;
const MOBILE_MAX = 768;

function getTypographyStyles(value: any) {
  if (!value || typeof value !== "object") return {};
  const styles: React.CSSProperties = {};
  if (value.fontFamily) styles.fontFamily = value.fontFamily;
  if (value.fontSize) styles.fontSize = `${value.fontSize}${value.fontSizeUnit || "px"}`;
  if (value.fontWeight) styles.fontWeight = value.fontWeight;
  if (value.textTransform) styles.textTransform = value.textTransform as any;
  if (value.fontStyle) styles.fontStyle = value.fontStyle;
  if (value.textDecoration) styles.textDecoration = value.textDecoration;
  if (value.lineHeight && value.lineHeight > 0)
    styles.lineHeight = `${value.lineHeight}${value.lineHeightUnit || "px"}`;
  if (value.letterSpacing !== undefined && value.letterSpacing !== 0)
    styles.letterSpacing = `${value.letterSpacing}${value.letterSpacingUnit || "px"}`;
  return styles;
}

function getDimensionsStyles(obj: any, property: "margin" | "padding") {
  if (!obj || typeof obj !== "object") return {};
  const u = obj.unit || "px";
  if (u === "auto") return { [property]: "auto" };
  const t = obj.top === "" || obj.top === undefined ? 0 : obj.top;
  const r = obj.right === "" || obj.right === undefined ? 0 : obj.right;
  const b = obj.bottom === "" || obj.bottom === undefined ? 0 : obj.bottom;
  const l = obj.left === "" || obj.left === undefined ? 0 : obj.left;
  if (t === 0 && r === 0 && b === 0 && l === 0) return {};
  return { [property]: `${t}${u} ${r}${u} ${b}${u} ${l}${u}` };
}

interface SocialItem {
  id: string;
  icon: string;
  link: { url: string; target: string; nofollow: boolean; customAttributes: string };
  hoverColor: string;
}

interface ServiceItem {
  id: string;
  label: string;
  link: { url: string; target: string; nofollow: boolean; customAttributes: string };
}

/* ── Frontend ───────────────────────────────────────── */
function FooterFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content Left
  const companyTitle: string = s.content?.companyTitle || "Seosight Company!";
  const companyDesc: string = s.content?.companyDesc || "";
  const socials: SocialItem[] = s.content?.socials || [];

  // Content Right
  const servicesTitle: string = s.content?.servicesTitle || "Services Provided";
  const services: ServiceItem[] = s.content?.services || [];

  // Contact Info
  const phoneIcon: string = s.content?.phoneIcon || "solar:phone-calling-rounded-outline";
  const phoneTitle: string = s.content?.phoneTitle || "8 800 567.890.11";
  const phoneSub: string = s.content?.phoneSub || "Mon-Fri 9am-6pm";

  const emailIcon: string = s.content?.emailIcon || "solar:letter-outline";
  const emailTitle: string = s.content?.emailTitle || "info@seosight.com";
  const emailSub: string = s.content?.emailSub || "online support";

  const addressIcon: string = s.content?.addressIcon || "solar:compass-outline";
  const addressTitle: string = s.content?.addressTitle || "Melbourne, Australia";
  const addressSub: string = s.content?.addressSub || "795 South Park Avenue";

  // Copyright text
  const copyrightText: string = s.content?.copyrightText || "2026 © Seosight, Best Agency WP Theme";

  // Style Settings
  const footerBg: string = s.style?.footerBg || "#151f28";
  const bottomBarBg: string = s.style?.bottomBarBg || "#0d141a";
  const dividerLineColor: string = s.style?.dividerLineColor || "#2c3e50";
  
  const textClr: string = s.style?.textClr || "#8c9ca7";
  const titleClr: string = s.style?.titleClr || "#ffffff";
  const accentClr: string = s.style?.accentClr || "#3cb878";
  const iconAccentClr: string = s.style?.iconAccentClr || "#e25c34";
  
  const serviceHoverColor: string = s.style?.serviceHoverColor || "#3cb878";

  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const bodyTyp = getTypographyStyles(s.style?.bodyTypography || {});
  const linkTyp = getTypographyStyles(s.style?.linkTypography || {});

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  return (
    <footer
      style={{
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: footerBg,
        color: textClr,
        ...marginStyle,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .${cls}-main-wrap {
          display: flex;
          gap: 60px;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-main-wrap { gap: 40px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-main-wrap { flex-direction: column; gap: 48px; }
        }
        .${cls}-col-left {
          flex: 1.2 1 0%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .${cls}-col-right {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .${cls}-header {
          margin: 0 0 14px 0;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.3;
          color: ${titleClr};
        }
        .${cls}-divider {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
        }
        .${cls}-divider-short {
          width: 10px;
          height: 2px;
          background-color: ${accentClr};
          border-radius: 1px;
        }
        .${cls}-divider-long {
          width: 40px;
          height: 2px;
          background-color: ${accentClr};
          border-radius: 1px;
        }
        .${cls}-desc {
          font-size: 15px;
          line-height: 1.7;
          margin: 0 0 28px 0;
        }
        /* Social icons */
        .${cls}-socials {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .${cls}-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background-color: rgba(255,255,255,0.04);
          color: ${textClr};
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .${cls}-social-link:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }
        /* Services grid */
        .${cls}-services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 24px;
          width: 100%;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-services-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
        .${cls}-service-item {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: ${textClr};
          font-size: 14px;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .${cls}-service-item:hover {
          color: ${serviceHoverColor};
          transform: translateX(4px);
        }
        .${cls}-service-arrow {
          flex-shrink: 0;
          color: ${accentClr};
          opacity: 0.8;
        }
        /* Contact Information Row */
        .${cls}-contact-row {
          border-top: 1px solid ${dividerLineColor};
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          width: 100%;
          box-sizing: border-box;
          padding: 40px 0;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-contact-row { gap: 20px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-contact-row {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 36px 0;
          }
        }
        .${cls}-contact-box {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .${cls}-contact-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${iconAccentClr};
          flex-shrink: 0;
          background: rgba(255,255,255,0.01);
        }
        .${cls}-contact-texts {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .${cls}-contact-title {
          font-size: 18px;
          font-weight: 600;
          color: ${titleClr};
          margin: 0 0 4px 0;
          line-height: 1.25;
        }
        .${cls}-contact-sub {
          font-size: 13px;
          opacity: 0.7;
          margin: 0;
          line-height: 1.35;
        }
        /* Copyright bottom bar */
        .${cls}-bottom-bar {
          background-color: ${bottomBarBg};
          width: 100%;
          padding: 24px 0;
          box-sizing: border-box;
          text-align: center;
        }
        .${cls}-copyright {
          font-size: 13px;
          opacity: 0.6;
          margin: 0;
          letter-spacing: 0.3px;
        }
      `}} />

      {/* Main Footer Body */}
      <div className="container" style={{ ...paddingStyle }}>
        <div className={`${cls}-main-wrap py-10`}>
          {/* Company Column */}
          <div className={`${cls}-col-left`}>
            {companyTitle && (
              <h3 className={`${cls}-header`} style={{ ...titleTyp }}>
                {companyTitle}
              </h3>
            )}
            <div className={`${cls}-divider`}>
              <div className={`${cls}-divider-short`} />
              <div className={`${cls}-divider-long`} />
            </div>

            {companyDesc && (
              <p className={`${cls}-desc`} style={{ ...bodyTyp }}>
                {companyDesc}
              </p>
            )}

            {socials.length > 0 && (
              <div className={`${cls}-socials`}>
                {socials.map((social, idx) => (
                  <a
                    key={social.id || idx}
                    href={social.link?.url || "#"}
                    target={social.link?.target || "_blank"}
                    rel={social.link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                    className={`${cls}-social-link`}
                    onMouseEnter={(e) => {
                      if (social.hoverColor) {
                        e.currentTarget.style.backgroundColor = social.hoverColor;
                        e.currentTarget.style.color = "#ffffff";
                      } else {
                        e.currentTarget.style.backgroundColor = accentClr;
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = textClr;
                    }}
                  >
                    <Icon icon={social.icon || "solar:share-bold"} width="18" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services Column */}
          <div className={`${cls}-col-right`}>
            {servicesTitle && (
              <h3 className={`${cls}-header`} style={{ ...titleTyp }}>
                {servicesTitle}
              </h3>
            )}
            <div className={`${cls}-divider`}>
              <div className={`${cls}-divider-short`} />
              <div className={`${cls}-divider-long`} />
            </div>

            {services.length > 0 && (
              <div className={`${cls}-services-grid`}>
                {services.map((item, idx) => (
                  <a
                    key={item.id || idx}
                    href={item.link?.url || "#"}
                    target={item.link?.target || "_self"}
                    rel={item.link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                    className={`${cls}-service-item`}
                    style={{ ...linkTyp }}
                  >
                    <Icon
                      icon="solar:play-bold"
                      width="10"
                      className={`${cls}-service-arrow`}
                    />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Row */}
        <div className={`${cls}-contact-row`}>
          {/* Phone */}
          <div className={`${cls}-contact-box`}>
            <div className={`${cls}-contact-icon-wrap`}>
              <Icon icon={phoneIcon} width="24" />
            </div>
            <div className={`${cls}-contact-texts`}>
              <h4 className={`${cls}-contact-title`}>{phoneTitle}</h4>
              <p className={`${cls}-contact-sub`}>{phoneSub}</p>
            </div>
          </div>

          {/* Email */}
          <div className={`${cls}-contact-box`}>
            <div className={`${cls}-contact-icon-wrap`}>
              <Icon icon={emailIcon} width="24" />
            </div>
            <div className={`${cls}-contact-texts`}>
              <h4 className={`${cls}-contact-title`}>{emailTitle}</h4>
              <p className={`${cls}-contact-sub`}>{emailSub}</p>
            </div>
          </div>

          {/* Address */}
          <div className={`${cls}-contact-box`}>
            <div className={`${cls}-contact-icon-wrap`}>
              <Icon icon={addressIcon} width="24" />
            </div>
            <div className={`${cls}-contact-texts`}>
              <h4 className={`${cls}-contact-title`}>{addressTitle}</h4>
              <p className={`${cls}-contact-sub`}>{addressSub}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className={`${cls}-bottom-bar`}>
        <p className={`${cls}-copyright`}>
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}

/* ── Element Definition ─────────────────────────────── */
const footerElement = {
  type: "footer",
  category: "seosight",
  label: "Footer",
  icon: "solar:window-frame-bold-duotone",

  schema: {
    content: {
      companyTitle: "Seosight Company!",
      companyDesc: "Qolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibham liber tempor cum soluta nobis eleifend option congue nihil uarta decima et quinta. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat eleifend option nihil. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius parum claram.",
      socials: [
        {
          id: "soc_1",
          icon: "ri:facebook-fill",
          link: { url: "#", target: "_blank", nofollow: false, customAttributes: "" },
          hoverColor: "#3b5998",
        },
        {
          id: "soc_2",
          icon: "ri:twitter-x-fill",
          link: { url: "#", target: "_blank", nofollow: false, customAttributes: "" },
          hoverColor: "#1da1f2",
        },
        {
          id: "soc_3",
          icon: "ri:google-fill",
          link: { url: "#", target: "_blank", nofollow: false, customAttributes: "" },
          hoverColor: "#dd4b39",
        },
        {
          id: "soc_4",
          icon: "ri:youtube-fill",
          link: { url: "#", target: "_blank", nofollow: false, customAttributes: "" },
          hoverColor: "#ff0000",
        },
        {
          id: "soc_5",
          icon: "ri:dribbble-fill",
          link: { url: "#", target: "_blank", nofollow: false, customAttributes: "" },
          hoverColor: "#ea4c89",
        },
      ],
      servicesTitle: "Services Provided",
      services: [
        {
          id: "serv_1",
          label: "SEO Services",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_2",
          label: "Pay-per-click",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_3",
          label: "Social Media",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_4",
          label: "Web Analytics",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_5",
          label: "Web Development",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_6",
          label: "Virtual Marketing",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_7",
          label: "Email Marketing",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_8",
          label: "Keyword Analytics",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_9",
          label: "Content Management",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "serv_10",
          label: "Blog Management",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
      ],
      phoneIcon: "solar:phone-calling-rounded-outline",
      phoneTitle: "8 800 567.890.11",
      phoneSub: "Mon-Fri 9am-6pm",
      emailIcon: "solar:letter-outline",
      emailTitle: "info@seosight.com",
      emailSub: "online support",
      addressIcon: "solar:compass-outline",
      addressTitle: "Melbourne, Australia",
      addressSub: "795 South Park Avenue",
      copyrightText: "2026 © Seosight, Best Agency WP Theme",
    },

    style: {
      footerBg: "#151f28",
      bottomBarBg: "#0d141a",
      dividerLineColor: "#212d38",
      textClr: "#8c9ca7",
      titleClr: "#ffffff",
      accentClr: "#3cb878",
      iconAccentClr: "#e25c34",
      serviceHoverColor: "#3cb878",
      titleTypography: { fontSize: 24, fontSizeUnit: "px", fontWeight: "700" },
      bodyTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },
      linkTypography: { fontSize: 14, fontSizeUnit: "px", fontWeight: "400" },
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
    },
  },

  controls: [
    // ═══════════════════ CONTENT TAB ════════════════
    {
      tab: "Content",
      section: "Company (Left)",
      controls: [
        {
          name: "companyTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Company Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "companyDesc",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Company Description" value={value || ""} onChange={onChange} rows={4} />
          ),
        },
        {
          name: "socials",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Social Link #${idx + 1}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <IconPicker
                      label="Social Icon (Iconify)"
                      value={item.icon || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], icon: v }; onChange(u);
                      }}
                    />
                    <Url
                      label="Social URL"
                      value={item.link || { url: "#", target: "_blank", nofollow: false, customAttributes: "" }}
                      onChange={(v: any) => {
                        const u = [...value]; u[idx] = { ...u[idx], link: v }; onChange(u);
                      }}
                    />
                    <ColorPickerPopup
                      label="Hover Background Color"
                      value={item.hoverColor || "#3cb878"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], hoverColor: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    id: `soc_${Date.now()}`,
                    icon: "ri:link",
                    link: { url: "#", target: "_blank", nofollow: false, customAttributes: "" },
                    hoverColor: "#3cb878",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-[12px] font-medium cursor-pointer transition-colors"
              >
                + Add Social Link
              </button>
            </div>
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Services (Right)",
      controls: [
        {
          name: "servicesTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Services Column Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "services",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Service Link #${idx + 1}: ${item.label || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <Text
                      label="Service Name"
                      value={item.label || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], label: v }; onChange(u);
                      }}
                    />
                    <Url
                      label="Service Link"
                      value={item.link || { url: "#", target: "_self", nofollow: false, customAttributes: "" }}
                      onChange={(v: any) => {
                        const u = [...value]; u[idx] = { ...u[idx], link: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    id: `serv_${Date.now()}`,
                    label: "New Service",
                    link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-[12px] font-medium cursor-pointer transition-colors"
              >
                + Add Service Link
              </button>
            </div>
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Contact Info Row",
      controls: [
        {
          name: "phoneIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <IconPicker label="Phone Icon" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "phoneTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Phone Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "phoneSub",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Phone Subtext" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "emailIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <IconPicker label="Email Icon" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "emailTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Email Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "emailSub",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Email Subtext" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "addressIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <IconPicker label="Address Icon" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "addressTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Address Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "addressSub",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Address Subtext" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Copyright Bottom",
      controls: [
        {
          name: "copyrightText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Copyright Text" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Footer Colors",
      controls: [
        {
          name: "footerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Footer Background" value={value ?? "#151f28"} onChange={onChange} />
          ),
        },
        {
          name: "bottomBarBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Copyright Bar Background" value={value ?? "#0d141a"} onChange={onChange} />
          ),
        },
        {
          name: "dividerLineColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Divider Borders Color" value={value ?? "#2c3e50"} onChange={onChange} />
          ),
        },
        {
          name: "titleClr",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Heading Titles Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "textClr",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Regular Text Color" value={value ?? "#8c9ca7"} onChange={onChange} />
          ),
        },
        {
          name: "accentClr",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Accent Divider Line Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "iconAccentClr",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Contact Icon Color" value={value ?? "#e25c34"} onChange={onChange} />
          ),
        },
        {
          name: "serviceHoverColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Service Link Hover Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography",
      controls: [
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Heading Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "bodyTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Description Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "linkTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Link Text Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ ADVANCED TAB ═══════════════
    {
      tab: "Advanced",
      section: "Spacing",
      controls: [
        {
          name: "margin",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Dimensions type="margin" value={value} onChange={onChange} />
          ),
        },
        {
          name: "padding",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Dimensions type="padding" value={value} onChange={onChange} />
          ),
        },
      ],
    },
  ],

  render: (element: any) => <FooterFrontend element={element} />,
};

export default footerElement;

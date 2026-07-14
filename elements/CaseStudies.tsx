"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  Url,
  NumberControl,
  Select,
  ButtonGroup,
  ColorPickerPopup,
  Dimensions,
  ImageGallery,
  Typography,
  Section,
} from "@/components/builder/controls";

const TABLET_MAX = 1024;
const MOBILE_MAX = 768;

function getTypographyStyles(value: any) {
  if (!value || typeof value !== "object") return {};
  const styles: React.CSSProperties = {};
  if (value.fontFamily) styles.fontFamily = value.fontFamily;
  if (value.fontSize) styles.fontSize = `${value.fontSize}${value.fontSizeUnit || "px"}`;
  if (value.fontWeight) styles.fontWeight = value.fontWeight;
  if (value.textTransform) styles.textTransform = value.textTransform;
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

interface ProjectCard {
  id: string;
  image: string;
  title: string;
  categories: string;
  link: { url: string; target: string; nofollow: boolean };
  active: boolean;
}

function CaseStudiesFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const title: string = s.content?.title || "";
  const subtitle: string = s.content?.subtitle || "";
  const items: ProjectCard[] = s.content?.items || [];
  const btnLabel: string = s.content?.btnLabel || "";
  const btnUrl: string = s.content?.btnUrl || "#";
  const btnTarget: string = s.content?.btnTarget || "_self";

  // Grid
  const colsDesktop: number = parseInt(s.content?.colsDesktop || "3");
  const colsTablet: number = parseInt(s.content?.colsTablet || "2");
  const colsMobile: number = parseInt(s.content?.colsMobile || "1");
  const gap: number = s.style?.gap ?? 30;

  // Header Styles
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const titleTypography = s.style?.titleTypography || {};
  const accentLineColor: string = s.style?.accentLineColor || "#26c6b0";

  const subtitleColor: string = s.style?.subtitleColor || "#555555";
  const subtitleTypography = s.style?.subtitleTypography || {};

  // Card Card Styles
  const defaultBg: string = s.style?.cardDefaultBg || "#f0f4f8";
  const activeBg: string = s.style?.cardActiveBg || "#26c6b0";
  const cardBorderRadius: number = s.style?.cardBorderRadius ?? 8;
  const cardPadding = s.style?.cardPadding || { top: 30, right: 30, bottom: 30, left: 30, unit: "px" };

  const itemTitleColor: string = s.style?.itemTitleColor || "#1d293f";
  const activeTitleColor: string = s.style?.activeTitleColor || "#ffffff";
  const itemTitleTypography = s.style?.itemTitleTypography || {};

  const itemCatColor: string = s.style?.itemCatColor || "#555555";
  const activeCatColor: string = s.style?.activeCatColor || "#e0fdf9";
  const itemCatTypography = s.style?.itemCatTypography || {};

  // Action Button Styles
  const actionBtnBg: string = s.style?.actionBtnBg || "#222222";
  const actionBtnTextColor: string = s.style?.actionBtnTextColor || "#ffffff";
  const actionBtnHoverBg: string = s.style?.actionBtnHoverBg || "#26c6b0";
  const actionBtnHoverTextColor: string = s.style?.actionBtnHoverTextColor || "#ffffff";
  const actionBtnBorderRadius: number = s.style?.actionBtnBorderRadius ?? 30;

  // Advanced Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const tTyp = getTypographyStyles(titleTypography);
  const stTyp = getTypographyStyles(subtitleTypography);
  const itTyp = getTypographyStyles(itemTitleTypography);
  const icTyp = getTypographyStyles(itemCatTypography);

  const cardPaddingStyle = getDimensionsStyles(cardPadding, "padding");

  return (
    <div
      className={`${cls}-wrap`}
      style={{ width: "100%", boxSizing: "border-box", ...marginStyle, ...paddingStyle }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .${cls}-wrap { box-sizing: border-box; }
        .${cls}-header {
          text-align: center;
          margin-bottom: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .${cls}-grid {
          display: grid;
          grid-template-columns: repeat(${colsDesktop}, minmax(0, 1fr));
          gap: ${gap}px;
          width: 100%;
          margin-bottom: 50px;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-grid {
            grid-template-columns: repeat(${colsTablet}, minmax(0, 1fr));
          }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-grid {
            grid-template-columns: repeat(${colsMobile}, minmax(0, 1fr));
            gap: ${Math.round(gap * 0.8)}px;
          }
        }
        .${cls}-card {
          border-radius: ${cardBorderRadius}px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        .${cls}-card:hover {
          background-color: ${activeBg} !important;
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        .${cls}-card:hover .${cls}-title {
          color: ${activeTitleColor} !important;
        }
        .${cls}-card:hover .${cls}-cats {
          color: ${activeCatColor} !important;
        }
        .${cls}-img-container {
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: ${Math.max(0, cardBorderRadius - 4)}px;
          overflow: hidden;
          background: #e2e8f0;
          margin-bottom: 24px;
        }
        .${cls}-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .${cls}-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
          text-align: center;
          transition: color 0.3s ease;
        }
        .${cls}-cats {
          font-size: 13px;
          text-align: center;
          line-height: 1.4;
          transition: color 0.3s ease;
        }
        .${cls}-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 28px;
          background: ${actionBtnBg};
          color: ${actionBtnTextColor};
          border: 2px solid ${actionBtnBg};
          border-radius: ${actionBtnBorderRadius}px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
          box-sizing: border-box;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
        }
        .${cls}-btn:hover {
          background: ${actionBtnHoverBg};
          border-color: ${actionBtnHoverBg};
          color: ${actionBtnHoverTextColor};
          transform: translateY(-2px);
        }
      `
      }} />

      {/* Header Title Area */}
      {(title || subtitle) && (
        <div className={`${cls}-header`}>
          {title && (
            <h2
              style={{
                margin: "0 0 10px 0",
                color: titleColor,
                lineHeight: 1.2,
                fontWeight: 700,
                fontSize: "36px",
                ...tTyp,
              }}
            >
              {title}
            </h2>
          )}

          {/* Teal Underline Accent */}
          <div
            style={{
              width: "50px",
              height: "3px",
              backgroundColor: accentLineColor,
              marginBottom: "20px",
              borderRadius: "2px",
            }}
          />

          {subtitle && (
            <p
              style={{
                margin: 0,
                color: subtitleColor,
                fontSize: "16px",
                lineHeight: 1.7,
                maxWidth: "800px",
                ...stTyp,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Projects Cards Grid */}
      <div className={`${cls}-grid`}>
        {items.map((item, idx) => {
          const isLink = !!item.link?.url;
          const Tag = isLink ? "a" : "div";
          const tagProps = isLink
            ? {
                href: item.link.url,
                target: item.link.target || undefined,
                rel: item.link.nofollow ? "nofollow" : undefined,
              }
            : {};

          const isCardActive = item.active === true;
          const currentBg = isCardActive ? activeBg : defaultBg;
          const currentTitleColor = isCardActive ? activeTitleColor : itemTitleColor;
          const currentCatColor = isCardActive ? activeCatColor : itemCatColor;

          return (
            <Tag
              key={item.id || idx}
              {...tagProps}
              className={`${cls}-card`}
              style={{
                backgroundColor: currentBg,
                ...cardPaddingStyle,
              }}
            >
              {/* Image box */}
              <div className={`${cls}-img-container`}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || "Project preview"}
                    className={`${cls}-img`}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCardActive ? "rgba(255,255,255,0.4)" : "#9ca3af",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <Icon icon="mdi:image-area" width="48" />
                    <span style={{ fontSize: "12px" }}>No Image</span>
                  </div>
                )}
              </div>

              {/* Title */}
              {item.title && (
                <h3
                  className={`${cls}-title`}
                  style={{
                    color: currentTitleColor,
                    ...itTyp,
                  }}
                >
                  {item.title}
                </h3>
              )}

              {/* Categories */}
              {item.categories && (
                <div
                  className={`${cls}-cats`}
                  style={{
                    color: currentCatColor,
                    ...icTyp,
                  }}
                >
                  {item.categories}
                </div>
              )}
            </Tag>
          );
        })}
      </div>

      {/* Action Button at the bottom */}
      {btnLabel && (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <a href={btnUrl} target={btnTarget} className={`${cls}-btn`}>
            <Icon icon="mdi:arrow-top-right-thin-circle-outline" width="18" />
            {btnLabel}
          </a>
        </div>
      )}
    </div>
  );
}

const caseStudiesElement = {
  type: "case-studies",
  category: "seosight",
  label: "Case Studies",
  icon: "solar:folder-with-files-bold-duotone",

  schema: {
    content: {
      title: "Recent Case Studies",
      subtitle: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium.",
      colsDesktop: "3",
      colsTablet: "2",
      colsMobile: "1",
      btnLabel: "All Projects",
      btnUrl: "#",
      btnTarget: "_self",
      items: [
        {
          id: "item_1",
          image: "",
          title: "PROJECT CUSTOM TITLE",
          categories: "SMM, Technologies",
          link: { url: "", target: "", nofollow: false },
          active: false,
        },
        {
          id: "item_2",
          image: "",
          title: "PROJECT GALLERY",
          categories: "SEO, SMM",
          link: { url: "", target: "", nofollow: false },
          active: true,
        },
        {
          id: "item_3",
          image: "",
          title: "PROJECT CENTERED IMAGE",
          categories: "Ecommerce, SEO, SMM",
          link: { url: "", target: "", nofollow: false },
          active: false,
        },
      ],
    },

    style: {
      gap: 30,
      titleColor: "#1d293f",
      titleTypography: { fontSize: 36, fontSizeUnit: "px", fontWeight: "700" },
      accentLineColor: "#26c6b0",

      subtitleColor: "#555555",
      subtitleTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "400" },

      cardDefaultBg: "#f0f4f8",
      cardActiveBg: "#26c6b0",
      cardBorderRadius: 8,
      cardPadding: { top: 30, right: 30, bottom: 30, left: 30, unit: "px" },

      itemTitleColor: "#1d293f",
      activeTitleColor: "#ffffff",
      itemTitleTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "700" },

      itemCatColor: "#555555",
      activeCatColor: "#e0fdf9",
      itemCatTypography: { fontSize: 13, fontSizeUnit: "px", fontWeight: "400" },

      actionBtnBg: "#222222",
      actionBtnTextColor: "#ffffff",
      actionBtnHoverBg: "#26c6b0",
      actionBtnHoverTextColor: "#ffffff",
      actionBtnBorderRadius: 30,
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 50, right: 0, bottom: 50, left: 0, unit: "px" },
    },
  },

  controls: [
    // ══════════════════════════════════════════ CONTENT TAB ══════
    {
      tab: "Content",
      section: "Header Content",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "subtitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Subtitle / Description" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Case Study Items",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Card #${idx + 1}: ${item.title || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Card
                      </button>
                    </div>

                    <Text
                      label="Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], title: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Categories / Subtitle"
                      value={item.categories || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], categories: v }; onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Project Thumbnail Image"
                      value={item.image || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], image: v }; onChange(u);
                      }}
                    />

                    <Url
                      label="Target Link"
                      value={item.link || { url: "", target: "", nofollow: false }}
                      onChange={(v: any) => {
                        const u = [...value]; u[idx] = { ...u[idx], link: v }; onChange(u);
                      }}
                    />

                    <ButtonGroup
                      label="Card Highlight (Active style)"
                      value={item.active === true ? "active" : "normal"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], active: v === "active" }; onChange(u);
                      }}
                      options={[
                        { value: "normal", label: "Default Style" },
                        { value: "active", label: "Teal Active Background" },
                      ]}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: ProjectCard = {
                    id: `item_${Date.now()}`,
                    image: "",
                    title: `Project #${(value?.length || 0) + 1}`,
                    categories: "",
                    link: { url: "", target: "", nofollow: false },
                    active: false,
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Project Card
              </button>
            </div>
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Grid Columns",
      controls: [
        {
          name: "colsDesktop",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Columns (Desktop)"
              value={value || "3"}
              onChange={onChange}
              options={[
                { value: "1", label: "1 Column" },
                { value: "2", label: "2 Columns" },
                { value: "3", label: "3 Columns" },
                { value: "4", label: "4 Columns" },
                { value: "5", label: "5 Columns" },
                { value: "6", label: "6 Columns" },
              ]}
            />
          ),
        },
        {
          name: "colsTablet",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Columns (Tablet)"
              value={value || "2"}
              onChange={onChange}
              options={[
                { value: "1", label: "1 Column" },
                { value: "2", label: "2 Columns" },
                { value: "3", label: "3 Columns" },
                { value: "4", label: "4 Columns" },
              ]}
            />
          ),
        },
        {
          name: "colsMobile",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Columns (Mobile)"
              value={value || "1"}
              onChange={onChange}
              options={[
                { value: "1", label: "1 Column" },
                { value: "2", label: "2 Columns" },
                { value: "3", label: "3 Columns" },
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Footer Button",
      controls: [
        {
          name: "btnLabel",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btnUrl",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button URL" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btnTarget",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Button Target"
              value={value || "_self"}
              onChange={onChange}
              options={[
                { value: "_self", label: "Same Tab" },
                { value: "_blank", label: "New Tab" },
              ]}
            />
          ),
        },
      ],
    },

    // ══════════════════════════════════════════ STYLE TAB ════════
    {
      tab: "Style",
      section: "Header Styles",
      controls: [
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "accentLineColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Underline Accent Color" value={value ?? "#26c6b0"} onChange={onChange} />
          ),
        },
        {
          name: "subtitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Subtitle Color" value={value ?? "#555555"} onChange={onChange} />
          ),
        },
        {
          name: "subtitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Subtitle Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Card Spacing & Shape",
      controls: [
        {
          name: "gap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Spacing Gap (px)"
              value={value ?? 30}
              onChange={onChange}
              min={0}
              max={150}
              step={5}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "cardBorderRadius",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Card Border Radius (px)"
              value={value ?? 8}
              onChange={onChange}
              min={0}
              max={60}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "cardPadding",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Dimensions type="padding" label="Card Inner Padding" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Card Colors",
      controls: [
        {
          name: "cardDefaultBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Default Card Background" value={value ?? "#f0f4f8"} onChange={onChange} />
          ),
        },
        {
          name: "cardActiveBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active/Hover Card Background" value={value ?? "#26c6b0"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography",
      controls: [
        {
          name: "itemTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Default Title Color" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
        {
          name: "activeTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Title Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "itemTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Card Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "itemCatColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Default Categories Color" value={value ?? "#555555"} onChange={onChange} />
          ),
        },
        {
          name: "activeCatColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Categories Color" value={value ?? "#e0fdf9"} onChange={onChange} />
          ),
        },
        {
          name: "itemCatTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Card Categories Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Action Button Styles",
      controls: [
        {
          name: "actionBtnBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Background" value={value ?? "#222222"} onChange={onChange} />
          ),
        },
        {
          name: "actionBtnTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "actionBtnHoverBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Hover Background" value={value ?? "#26c6b0"} onChange={onChange} />
          ),
        },
        {
          name: "actionBtnHoverTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Hover Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "actionBtnBorderRadius",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Button Border Radius (px)"
              value={value ?? 30}
              onChange={onChange}
              min={0}
              max={60}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
      ],
    },

    // ══════════════════════════════════════════ ADVANCED TAB ═════
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

  render: (element: any) => <CaseStudiesFrontend element={element} />,
};

export default caseStudiesElement;

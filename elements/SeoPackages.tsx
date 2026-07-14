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

interface PackageItem {
  id: string;
  image: string;
  icon: string;
  circleBg: string;
  title: string;
  description: string;
}

interface BtnItem {
  id: string;
  label: string;
  url: string;
  target: string;
  bg?: string;
  hoverBg?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

function SeoPackagesFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const title: string = s.content?.title || "";
  const subtitle: string = s.content?.subtitle || "";
  const items: PackageItem[] = s.content?.items || [];
  const buttons: BtnItem[] = s.content?.buttons || [];

  // Grid / Columns
  const colsDesktop: number = parseInt(s.content?.colsDesktop || "4");
  const colsTablet: number = parseInt(s.content?.colsTablet || "2");
  const colsMobile: number = parseInt(s.content?.colsMobile || "1");
  const gap: number = s.style?.gap ?? 30;

  // Header Style
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const titleTypography = s.style?.titleTypography || {};
  const accentLineColor: string = s.style?.accentLineColor || "#26c6b0";

  const subtitleColor: string = s.style?.subtitleColor || "#555555";
  const subtitleTypography = s.style?.subtitleTypography || {};

  // Package Item Styles
  const circleSize: number = s.style?.circleSize ?? 150;
  const iconColor: string = s.style?.iconColor || "#374151";
  const iconSizePercent: number = s.style?.iconSizePercent ?? 50;

  const itemTitleColor: string = s.style?.itemTitleColor || "#1d293f";
  const itemTitleTypography = s.style?.itemTitleTypography || {};
  const itemDescColor: string = s.style?.itemDescColor || "#656565";
  const itemDescTypography = s.style?.itemDescTypography || {};

  // Default Button Styles (from ButtonsGroup)
  const defaultBg: string = s.style?.defaultBg || "#222222";
  const defaultHoverBg: string = s.style?.defaultHoverBg || "#26c6b0";
  const defaultTextColor: string = s.style?.defaultTextColor || "#ffffff";
  const defaultHoverTextColor: string = s.style?.defaultHoverTextColor || "#ffffff";
  const defaultBorderColor: string = s.style?.defaultBorderColor || "transparent";
  const defaultHoverBorderColor: string = s.style?.defaultHoverBorderColor || "transparent";
  const defaultBorderWidth: number = s.style?.defaultBorderWidth ?? 2;
  const defaultBorderRadius: number = s.style?.defaultBorderRadius ?? 30;
  const btnPaddingV: number = s.style?.btnPaddingV ?? 12;
  const btnPaddingH: number = s.style?.btnPaddingH ?? 28;
  const buttonTypography = s.style?.buttonTypography || {};

  // Advanced Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const tTyp = getTypographyStyles(titleTypography);
  const stTyp = getTypographyStyles(subtitleTypography);
  const itTyp = getTypographyStyles(itemTitleTypography);
  const idTyp = getTypographyStyles(itemDescTypography);
  const btnTyp = getTypographyStyles(buttonTypography);

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
        .${cls}-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .${cls}-circle {
          width: ${circleSize}px;
          height: ${circleSize}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .${cls}-circle:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }
        .${cls}-circle-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .${cls}-buttons-container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        ${buttons.map((btn, i) => {
          const bg = btn.bg || defaultBg;
          const hbg = btn.hoverBg || defaultHoverBg;
          const tc = btn.textColor || defaultTextColor;
          const htc = btn.hoverTextColor || defaultHoverTextColor;
          const bc = btn.borderColor || defaultBorderColor;
          const hbc = btn.hoverBorderColor || defaultHoverBorderColor;
          const bw = btn.borderWidth ?? defaultBorderWidth;
          const br = btn.borderRadius ?? defaultBorderRadius;
          return `
          .${cls}-btn-${i} {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: ${btnPaddingV}px ${btnPaddingH}px;
            background: ${bg};
            color: ${tc};
            border: ${bw}px solid ${bc === "transparent" ? bg : bc};
            border-radius: ${br}px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
            box-sizing: border-box;
            transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          }
          .${cls}-btn-${i}:hover {
            background: ${hbg};
            color: ${htc};
            border-color: ${hbc === "transparent" ? hbg : hbc};
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          }`;
        }).join("")}
      `
      }} />

      {/* Header Area */}
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

          {/* Underline Decoration */}
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

      {/* Grid Packages Area */}
      <div className={`${cls}-grid`}>
        {items.map((item, idx) => {
          const hasImage = !!item.image;
          const hasIcon = !!item.icon;

          return (
            <div key={item.id || idx} className={`${cls}-item`}>
              {/* Circular Container */}
              <div
                className={`${cls}-circle`}
                style={{ backgroundColor: item.circleBg || "#e5e7eb" }}
              >
                {hasImage ? (
                  <img
                    src={item.image}
                    alt={item.title || "Package icon"}
                    className={`${cls}-circle-img`}
                  />
                ) : hasIcon ? (
                  <Icon
                    icon={item.icon}
                    width={`${iconSizePercent}%`}
                    height={`${iconSizePercent}%`}
                    style={{ color: iconColor }}
                  />
                ) : (
                  <Icon
                    icon="solar:widget-bold-duotone"
                    width={`${iconSizePercent}%`}
                    height={`${iconSizePercent}%`}
                    style={{ color: iconColor }}
                  />
                )}
              </div>

              {/* Title */}
              {item.title && (
                <h3
                  style={{
                    margin: "0 0 12px 0",
                    color: itemTitleColor,
                    fontSize: "20px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    lineHeight: 1.3,
                    ...itTyp,
                  }}
                >
                  {item.title}
                </h3>
              )}

              {/* Description */}
              {item.description && (
                <p
                  style={{
                    margin: 0,
                    color: itemDescColor,
                    fontSize: "14px",
                    lineHeight: 1.6,
                    ...idTyp,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Centered Action Buttons */}
      {buttons.length > 0 && (
        <div className={`${cls}-buttons-container`}>
          {buttons.map((btn, i) => (
            <a
              key={btn.id || i}
              href={btn.url || "#"}
              target={btn.target || "_self"}
              className={`${cls}-btn-${i}`}
              style={btnTyp}
            >
              {btn.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const seoPackagesElement = {
  type: "seo-packages",
  category: "seosight",
  label: "SEO Packages",
  icon: "solar:shop-2-bold-duotone",

  schema: {
    content: {
      title: "Affordable SEO Services Packages",
      subtitle: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium.",
      colsDesktop: "4",
      colsTablet: "2",
      colsMobile: "1",
      items: [
        {
          id: "item_1",
          image: "",
          icon: "solar:target-bold-duotone",
          circleBg: "#fcd34d", // Yellow
          title: "OBJECTIVE",
          description: "Investigationes demonstraverunt lectores legere.",
        },
        {
          id: "item_2",
          image: "",
          icon: "solar:routing-bold-duotone",
          circleBg: "#f87171", // Red
          title: "STRATEGY",
          description: "Dolor sit amet, consectetuer adipiscing elit.",
        },
        {
          id: "item_3",
          image: "",
          icon: "solar:cpu-bold-duotone",
          circleBg: "#60a5fa", // Blue
          title: "TECHNOLOGY",
          description: "Nam liber tempor cum soluta nobis eleifend.",
        },
        {
          id: "item_4",
          image: "",
          icon: "solar:graph-bold-duotone",
          circleBg: "#4ade80", // Green
          title: "ANALYTICS",
          description: "Eodem modo typi, qui nunc nobis videntur parum.",
        },
      ],
      buttons: [
        {
          id: "btn_1",
          label: "More Info",
          url: "#",
          target: "_self",
          bg: "#222222",
          hoverBg: "#26c6b0",
          textColor: "#ffffff",
          hoverTextColor: "#ffffff",
          borderColor: "transparent",
          hoverBorderColor: "transparent",
          borderWidth: 2,
          borderRadius: 50,
        },
        {
          id: "btn_2",
          label: "Get Started!",
          url: "#",
          target: "_self",
          bg: "#26c6b0",
          hoverBg: "#1aa090",
          textColor: "#ffffff",
          hoverTextColor: "#ffffff",
          borderColor: "transparent",
          hoverBorderColor: "transparent",
          borderWidth: 2,
          borderRadius: 50,
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

      circleSize: 150,
      iconColor: "#ffffff",
      iconSizePercent: 45,

      itemTitleColor: "#1d293f",
      itemTitleTypography: { fontSize: 20, fontSizeUnit: "px", fontWeight: "600" },
      itemDescColor: "#656565",
      itemDescTypography: { fontSize: 14, fontSizeUnit: "px", fontWeight: "400" },

      defaultBg: "#222222",
      defaultHoverBg: "#26c6b0",
      defaultTextColor: "#ffffff",
      defaultHoverTextColor: "#ffffff",
      defaultBorderColor: "transparent",
      defaultHoverBorderColor: "transparent",
      defaultBorderWidth: 2,
      defaultBorderRadius: 50,
      btnPaddingV: 12,
      btnPaddingH: 28,
      buttonTypography: { fontSize: 13, fontSizeUnit: "px", fontWeight: "700" },
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
      section: "Packages / Grid Items",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Item #${idx + 1}: ${item.title || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Item
                      </button>
                    </div>

                    <Text
                      label="Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], title: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Description"
                      value={item.description || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], description: v }; onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Custom Image (Optional)"
                      value={item.image || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], image: v }; onChange(u);
                      }}
                    />

                    <IconPicker
                      label="Fallback Iconify Icon"
                      value={item.icon || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], icon: v }; onChange(u);
                      }}
                    />

                    <ColorPickerPopup
                      label="Circle Background Color"
                      value={item.circleBg || "#e5e7eb"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], circleBg: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: PackageItem = {
                    id: `item_${Date.now()}`,
                    image: "",
                    icon: "solar:widget-bold-duotone",
                    circleBg: "#e5e7eb",
                    title: `Service #${(value?.length || 0) + 1}`,
                    description: "",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Item
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
              value={value || "4"}
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
      section: "Action Buttons",
      controls: [
        {
          name: "buttons",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((btn: any, idx: number) => (
                <Section key={btn.id || idx} label={`Button #${idx + 1}: ${btn.label || ""}`}>
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
                      label="Label"
                      value={btn.label || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], label: v }; onChange(u);
                      }}
                    />

                    <Url
                      label="URL"
                      value={btn.url || ""}
                      onChange={(v: any) => {
                        const u = [...value]; u[idx] = { ...u[idx], url: v?.url || "" }; onChange(u);
                      }}
                    />

                    <Select
                      label="Open in"
                      value={btn.target || "_self"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], target: v }; onChange(u);
                      }}
                      options={[
                        { value: "_self", label: "Same Tab" },
                        { value: "_blank", label: "New Tab" },
                      ]}
                    />

                    <Section label="Colors Override">
                      <div className="space-y-2 pt-1">
                        <ColorPickerPopup
                          label="Background"
                          value={btn.bg || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], bg: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Hover Background"
                          value={btn.hoverBg || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], hoverBg: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Text Color"
                          value={btn.textColor || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], textColor: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Hover Text Color"
                          value={btn.hoverTextColor || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], hoverTextColor: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Border Color"
                          value={btn.borderColor || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], borderColor: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Hover Border Color"
                          value={btn.hoverBorderColor || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], hoverBorderColor: v }; onChange(u);
                          }}
                        />
                      </div>
                    </Section>
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newBtn = {
                    id: `btn_${Date.now()}`,
                    label: "Button",
                    url: "#",
                    target: "_self",
                    bg: "",
                    hoverBg: "",
                    textColor: "",
                    hoverTextColor: "",
                    borderColor: "",
                    hoverBorderColor: "",
                  };
                  onChange([...(value || []), newBtn]);
                }}
                className="w-full py-2 text-[12px] font-medium text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 cursor-pointer"
              >
                + Add Button
              </button>
            </div>
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
            <ColorPickerPopup label="Accent Line Color" value={value ?? "#26c6b0"} onChange={onChange} />
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
      section: "Package Circle Options",
      controls: [
        {
          name: "circleSize",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Circle Diameter (px)"
              value={value ?? 150}
              onChange={onChange}
              min={60}
              max={300}
              step={5}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "iconColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Icon Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "iconSizePercent",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Icon size (%) of circle"
              value={value ?? 45}
              onChange={onChange}
              min={20}
              max={80}
              step={5}
              showSlider
              grid={2}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Package Item Typography",
      controls: [
        {
          name: "itemTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Item Title Color" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
        {
          name: "itemTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Item Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "itemDescColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Item Description Color" value={value ?? "#656565"} onChange={onChange} />
          ),
        },
        {
          name: "itemDescTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Item Description Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Default Button Styles",
      controls: [
        {
          name: "defaultBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Background" value={value ?? "#222222"} onChange={onChange} />
          ),
        },
        {
          name: "defaultHoverBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Hover Background" value={value ?? "#26c6b0"} onChange={onChange} />
          ),
        },
        {
          name: "defaultTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "defaultHoverTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Hover Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "defaultBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Border Color" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "defaultHoverBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Hover Border Color" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "defaultBorderWidth",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Border Width (px)"
              value={value ?? 2}
              onChange={onChange}
              min={0}
              max={10}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "defaultBorderRadius",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Border Radius (px)"
              value={value ?? 50}
              onChange={onChange}
              min={0}
              max={100}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "btnPaddingV",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Padding Top/Bottom (px)"
              value={value ?? 12}
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
          name: "btnPaddingH",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Padding Left/Right (px)"
              value={value ?? 28}
              onChange={onChange}
              min={0}
              max={100}
              step={2}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "buttonTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Button Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <SeoPackagesFrontend element={element} />,
};

export default seoPackagesElement;

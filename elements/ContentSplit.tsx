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
  Section,
  ImageGallery,
  Typography,
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

function ContentSplitFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const title: string = s.content?.title || "";
  const titleAccent: string = s.content?.titleAccent || "";
  const subtitle: string = s.content?.subtitle || "";
  const listItems: { id: string; icon?: string; text: string }[] = s.content?.listItems || [];
  const image: string = s.content?.image || "";

  const btn1Label: string = s.content?.btn1Label || "Learn More";
  const btn1Url: string = s.content?.btn1Url || "#";
  const btn1Target: string = s.content?.btn1Target || "_self";
  const btn2Label: string = s.content?.btn2Label || "Get a Quote";
  const btn2Url: string = s.content?.btn2Url || "#";
  const btn2Target: string = s.content?.btn2Target || "_self";

  // Style
  const reverseLayout: boolean = s.style?.reverseLayout === true;
  const gap: number = s.style?.gap ?? 60;
  const vertAlign: string = s.style?.vertAlign || "center";

  const titleColor: string = s.style?.titleColor || "#1a202c";
  const titleTypography = s.style?.titleTypography || {};
  const accentColor: string = s.style?.accentColor || "#26c6b0";
  const accentLineColor: string = s.style?.accentLineColor || "#26c6b0";

  const subtitleColor: string = s.style?.subtitleColor || "#555555";
  const subtitleTypography = s.style?.subtitleTypography || {};

  const checkColor: string = s.style?.checkColor || "#26c6b0";
  const listColor: string = s.style?.listColor || "#444444";
  const listTypography = s.style?.listTypography || {};

  const btn1Bg: string = s.style?.btn1Bg || "transparent";
  const btn1TextColor: string = s.style?.btn1TextColor || "#26c6b0";
  const btn1BorderColor: string = s.style?.btn1BorderColor || "#26c6b0";
  const btn1BorderRadius: number = s.style?.btn1BorderRadius ?? 4;

  const btn2Bg: string = s.style?.btn2Bg || "#26c6b0";
  const btn2TextColor: string = s.style?.btn2TextColor || "#ffffff";
  const btn2BorderRadius: number = s.style?.btn2BorderRadius ?? 30;

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const tTyp = getTypographyStyles(titleTypography);
  const stTyp = getTypographyStyles(subtitleTypography);
  const lTyp = getTypographyStyles(listTypography);

  return (
    <div
      className={`${cls}-wrap`}
      style={{ width: "100%", boxSizing: "border-box", ...marginStyle, ...paddingStyle }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .${cls}-wrap { box-sizing: border-box; }
        .${cls}-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${gap}px;
          align-items: ${vertAlign};
          width: 100%;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-grid {
            grid-template-columns: 1fr;
          }
          .${cls}-img-col {
            order: -1;
          }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-grid {
            gap: ${Math.round(gap * 0.6)}px;
          }
        }
        .${cls}-btn1 {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 22px;
          background: ${btn1Bg};
          color: ${btn1TextColor};
          border: 2px solid ${btn1BorderColor};
          border-radius: ${btn1BorderRadius}px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s ease;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .${cls}-btn1:hover { opacity: 0.75; }
        .${cls}-btn2 {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 28px;
          background: ${btn2Bg};
          color: ${btn2TextColor};
          border: 2px solid ${btn2Bg};
          border-radius: ${btn2BorderRadius}px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s ease;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .${cls}-btn2:hover { opacity: 0.85; }
      `
      }} />

      <div
        className={`${cls}-grid`}
        style={{ direction: reverseLayout ? "rtl" : "ltr" }}
      >
        {/* ── Left / Content column ── */}
        <div style={{ direction: "ltr" }}>
          {/* Title */}
          {(title || titleAccent) && (
            <h2
              style={{
                margin: "0 0 8px 0",
                color: titleColor,
                lineHeight: 1.2,
                fontWeight: 700,
                fontSize: "34px",
                ...tTyp,
              }}
            >
              {title}
              {titleAccent && (
                <span style={{ color: accentColor }}>{` ${titleAccent}`}</span>
              )}
            </h2>
          )}

          {/* Accent underline decoration */}
          <div
            style={{
              width: "50px",
              height: "3px",
              backgroundColor: accentLineColor,
              marginBottom: "20px",
              borderRadius: "2px",
            }}
          />

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                margin: "0 0 20px 0",
                color: subtitleColor,
                fontSize: "16px",
                lineHeight: 1.7,
                ...stTyp,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Checklist */}
          {listItems.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                margin: "0 0 28px 0",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {listItems.map((item, idx) => (
                <li
                  key={item.id || idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    color: listColor,
                    fontSize: "15px",
                    lineHeight: 1.5,
                    ...lTyp,
                  }}
                >
                  <Icon
                    icon={item.icon || "mdi:check"}
                    width="18"
                    height="18"
                    style={{ color: checkColor, flexShrink: 0, marginTop: "2px" }}
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
            {btn1Label && (
              <a href={btn1Url} target={btn1Target} className={`${cls}-btn1`}>
                <Icon icon="mdi:arrow-top-right-thin-circle-outline" width="18" />
                {btn1Label}
              </a>
            )}
            {btn2Label && (
              <a href={btn2Url} target={btn2Target} className={`${cls}-btn2`}>
                <Icon icon="mdi:arrow-top-right-thin-circle-outline" width="18" />
                {btn2Label}
              </a>
            )}
          </div>
        </div>

        {/* ── Right / Image column ── */}
        <div
          className={`${cls}-img-col`}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {image ? (
            <img
              src={image}
              alt={title || "Content image"}
              style={{ maxWidth: "100%", height: "auto", display: "block" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "4/3",
                background: "#f3f4f6",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
                color: "#9ca3af",
              }}
            >
              <Icon icon="mdi:image-area" width="64" />
              <span style={{ fontSize: "13px" }}>Select an image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const contentSplitElement = {
  type: "content-split",
  category: "seosight",
  label: "Content Split",
  icon: "solar:sidebar-minimalistic-bold-duotone",

  schema: {
    content: {
      title: "We Offer a Full Range of",
      titleAccent: "Digital Marketing Services!",
      subtitle:
        "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium.",
      listItems: [
        {
          id: "li_1",
          icon: "",
          text: "Qolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh;",
        },
        { id: "li_2", icon: "", text: "Investigationes demonstraverunt;" },
        {
          id: "li_3",
          icon: "",
          text: "Dam liber tempor cum soluta nobis eleifend option congue nihil;",
        },
        { id: "li_4", icon: "", text: "Quarta decima et quinta." },
      ],
      image: "",
      btn1Label: "Learn More",
      btn1Url: "#",
      btn1Target: "_self",
      btn2Label: "Get a Quote",
      btn2Url: "#",
      btn2Target: "_self",
    },

    style: {
      reverseLayout: false,
      gap: 60,
      vertAlign: "center",

      titleColor: "#1a202c",
      titleTypography: {
        fontSize: 34,
        fontSizeUnit: "px",
        fontWeight: "700",
        lineHeight: 42,
        lineHeightUnit: "px",
      },
      accentColor: "#26c6b0",
      accentLineColor: "#26c6b0",

      subtitleColor: "#555555",
      subtitleTypography: {
        fontSize: 16,
        fontSizeUnit: "px",
        fontWeight: "400",
        lineHeight: 28,
        lineHeightUnit: "px",
      },

      checkColor: "#26c6b0",
      listColor: "#444444",
      listTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },

      btn1Bg: "transparent",
      btn1TextColor: "#26c6b0",
      btn1BorderColor: "#26c6b0",
      btn1BorderRadius: 4,

      btn2Bg: "#26c6b0",
      btn2TextColor: "#ffffff",
      btn2BorderRadius: 30,
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 40, right: 0, bottom: 40, left: 0, unit: "px" },
    },
  },

  controls: [
    // ══════════════════════════════════════════ CONTENT TAB ══════
    {
      tab: "Content",
      section: "Title & Subtitle",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "titleAccent",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text
              label="Title Accent (colored part)"
              value={value || ""}
              onChange={onChange}
            />
          ),
        },
        {
          name: "subtitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea
              label="Subtitle / Description"
              value={value || ""}
              onChange={onChange}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Checklist Items",
      controls: [
        {
          name: "listItems",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Item #${idx + 1}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          onChange(
                            (value || []).filter(
                              (_: any, i: number) => i !== idx
                            )
                          )
                        }
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Item
                      </button>
                    </div>
                    <IconPicker
                      label="Icon (overrides default checkmark)"
                      value={item.icon || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], icon: v };
                        onChange(u);
                      }}
                    />
                    <Text
                      label="Text"
                      value={item.text || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], text: v };
                        onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    id: `li_${Date.now()}`,
                    icon: "",
                    text: "New list item",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full py-2 text-[12px] font-medium text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 cursor-pointer"
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
      section: "Image",
      controls: [
        {
          name: "image",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery
              label="Right Side Image"
              value={value || ""}
              onChange={onChange}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Buttons",
      controls: [
        {
          name: "btn1Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button 1 Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn1Url",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button 1 URL" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn1Target",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Button 1 Target"
              value={value || "_self"}
              onChange={onChange}
              options={[
                { value: "_self", label: "Same Tab" },
                { value: "_blank", label: "New Tab" },
              ]}
            />
          ),
        },
        {
          name: "btn2Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button 2 Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn2Url",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button 2 URL" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn2Target",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Button 2 Target"
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
      section: "Layout",
      controls: [
        {
          name: "reverseLayout",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ButtonGroup
              label="Column Order"
              value={value === true ? "reversed" : "normal"}
              onChange={(v: string) => onChange(v === "reversed")}
              options={[
                { value: "normal", label: "Text Left / Image Right" },
                { value: "reversed", label: "Image Left / Text Right" },
              ]}
            />
          ),
        },
        {
          name: "vertAlign",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ButtonGroup
              label="Vertical Alignment"
              value={value || "center"}
              onChange={onChange}
              options={[
                { value: "flex-start", label: "Top" },
                { value: "center", label: "Center" },
                { value: "flex-end", label: "Bottom" },
              ]}
            />
          ),
        },
        {
          name: "gap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Column Gap (px)"
              value={value ?? 60}
              onChange={onChange}
              min={0}
              max={200}
              step={4}
              showSlider
              grid={2}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Title",
      controls: [
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Title Color"
              value={value ?? "#1a202c"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "accentColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Accent Text Color"
              value={value ?? "#26c6b0"}
              onChange={onChange}
            />
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
            <ColorPickerPopup
              label="Underline Accent Color"
              value={value ?? "#26c6b0"}
              onChange={onChange}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Subtitle",
      controls: [
        {
          name: "subtitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Subtitle Color"
              value={value ?? "#555555"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "subtitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography
              label="Subtitle Typography"
              value={value}
              onChange={onChange}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Checklist",
      controls: [
        {
          name: "checkColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Checkmark Color"
              value={value ?? "#26c6b0"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "listColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="List Text Color"
              value={value ?? "#444444"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "listTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="List Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Button 1 (Outline)",
      controls: [
        {
          name: "btn1TextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Text Color"
              value={value ?? "#26c6b0"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "btn1BorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Border Color"
              value={value ?? "#26c6b0"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "btn1Bg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Background"
              value={value ?? "transparent"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "btn1BorderRadius",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Border Radius (px)"
              value={value ?? 4}
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

    {
      tab: "Style",
      section: "Button 2 (Filled)",
      controls: [
        {
          name: "btn2Bg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Background Color"
              value={value ?? "#26c6b0"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "btn2TextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup
              label="Text Color"
              value={value ?? "#ffffff"}
              onChange={onChange}
            />
          ),
        },
        {
          name: "btn2BorderRadius",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Border Radius (px)"
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

  render: (element: any) => <ContentSplitFrontend element={element} />,
};

export default contentSplitElement;

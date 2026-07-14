"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Url,
  NumberControl,
  Select,
  ButtonGroup,
  ColorPickerPopup,
  Dimensions,
  Section,
  IconPicker,
  Typography,
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

function getBorderStyle(value: any) {
  if (!value || typeof value !== "object") return {};
  const side = value.normal !== undefined ? value.normal : value;
  if (!side) return {};
  const type = side.type ?? side.style ?? "";
  if (type === "" || type === "none") return {};
  const color = side.color || "#000000";
  const rawWidth = side.width;
  const styles: React.CSSProperties = {};
  if (rawWidth && typeof rawWidth === "object") {
    const u = rawWidth.unit || "px";
    styles.borderStyle = type;
    styles.borderColor = color;
    styles.borderWidth = `${rawWidth.top||0}${u} ${rawWidth.right||0}${u} ${rawWidth.bottom||0}${u} ${rawWidth.left||0}${u}`;
  } else {
    const w = typeof rawWidth === "number" ? rawWidth : 1;
    styles.border = `${w}px ${type} ${color}`;
  }
  const r = side.radius;
  if (r && typeof r === "object") {
    const u = r.unit || "px";
    styles.borderRadius = `${r.top||0}${u} ${r.right||0}${u} ${r.bottom||0}${u} ${r.left||0}${u}`;
  } else if (typeof r === "number" && r > 0) {
    styles.borderRadius = `${r}px`;
  }
  return styles;
}

function getBoxShadowStyle(value: any) {
  if (!value || typeof value !== "object") return {};
  const normal = value.normal || value;
  const { x = 0, y = 0, blur = 0, spread = 0, color = "rgba(0,0,0,0.15)" } = normal;
  const inset = normal.inset === true || normal.inset === "true";
  if (blur === 0 && spread === 0 && x === 0 && y === 0) return {};
  return { boxShadow: `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}` };
}

interface BtnItem {
  id: string;
  label: string;
  url: string;
  target: string;
  icon: string;
  iconPosition: "left" | "right";
  showIcon?: boolean;
  // per-button overrides (optional)
  bg?: string;
  hoverBg?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
}

function ButtonsGroupFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  const buttons: BtnItem[] = s.content?.buttons || [];

  // Grid
  const colsDesktop: number = parseInt(s.content?.colsDesktop || "3");
  const colsTablet: number = parseInt(s.content?.colsTablet || "2");
  const colsMobile: number = parseInt(s.content?.colsMobile || "1");
  const gap: number = s.style?.gap ?? 16;
  const justify: string = s.style?.justify || "flex-start";

  // Global button defaults
  const defaultBg: string = s.style?.defaultBg || "#222222";
  const defaultHoverBg: string = s.style?.defaultHoverBg || "#26c6b0";
  const defaultTextColor: string = s.style?.defaultTextColor || "#ffffff";
  const defaultHoverTextColor: string = s.style?.defaultHoverTextColor || "#ffffff";
  const defaultBorderColor: string = s.style?.defaultBorderColor || "transparent";
  const defaultHoverBorderColor: string = s.style?.defaultHoverBorderColor || "transparent";
  const defaultBorderRadius: number = s.style?.defaultBorderRadius ?? 50;
  const btnPaddingV: number = s.style?.btnPaddingV ?? 12;
  const btnPaddingH: number = s.style?.btnPaddingH ?? 28;
  const iconSize: number = s.style?.iconSize ?? 18;
  const iconGap: number = s.style?.iconGap ?? 8;
  const typography = s.style?.typography || {};

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const typStyles = getTypographyStyles(typography);

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
          grid-template-columns: repeat(${colsDesktop}, auto);
          gap: ${gap}px;
          justify-content: ${justify};
          width: 100%;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-grid {
            grid-template-columns: repeat(${colsTablet}, auto);
          }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-grid {
            grid-template-columns: repeat(${colsMobile}, auto);
          }
        }
        ${buttons.map((btn, i) => {
          const bg = btn.bg || defaultBg;
          const hbg = btn.hoverBg || defaultHoverBg;
          const tc = btn.textColor || defaultTextColor;
          const htc = btn.hoverTextColor || defaultHoverTextColor;
          const bc = btn.borderColor || defaultBorderColor;
          const hbc = btn.hoverBorderColor || defaultHoverBorderColor;
          return `
          .${cls}-btn-${i} {
            display: inline-flex;
            align-items: center;
            gap: ${iconGap}px;
            padding: ${btnPaddingV}px ${btnPaddingH}px;
            background: ${bg};
            color: ${tc};
            border: 2px solid ${bc === "transparent" ? bg : bc};
            border-radius: ${defaultBorderRadius}px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
            width: 100%;
            justify-content: center;
            box-sizing: border-box;
            transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          }
          .${cls}-btn-${i}:hover {
            background: ${hbg};
            color: ${htc};
            border-color: ${hbc === "transparent" ? hbg : hbc};
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }`;
        }).join("")}
      `
      }} />

      <div className={`${cls}-grid`}>
        {buttons.map((btn, i) => (
          <a
            key={btn.id || i}
            href={btn.url || "#"}
            target={btn.target || "_self"}
            className={`${cls}-btn-${i}`}
            style={typStyles}
          >
            {btn.icon && btn.showIcon !== false && btn.iconPosition !== "right" && (
              <Icon icon={btn.icon} width={iconSize} height={iconSize} />
            )}
            {btn.label}
            {btn.icon && btn.showIcon !== false && btn.iconPosition === "right" && (
              <Icon icon={btn.icon} width={iconSize} height={iconSize} />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

const buttonsGroupElement = {
  type: "buttons-group",
  category: "seosight",
  label: "Buttons Group",
  icon: "solar:widget-5-bold-duotone",

  schema: {
    content: {
      colsDesktop: "3",
      colsTablet: "2",
      colsMobile: "1",
      buttons: [
        {
          id: "btn_1",
          label: "More Info",
          url: "#",
          target: "_self",
          icon: "mdi:arrow-top-right-thin-circle-outline",
          iconPosition: "left",
          showIcon: true,
          bg: "#222222",
          hoverBg: "#26c6b0",
          textColor: "#ffffff",
          hoverTextColor: "#ffffff",
          borderColor: "transparent",
          hoverBorderColor: "transparent",
        },
        {
          id: "btn_2",
          label: "Get Started!",
          url: "#",
          target: "_self",
          icon: "mdi:arrow-top-right-thin-circle-outline",
          iconPosition: "left",
          showIcon: true,
          bg: "#26c6b0",
          hoverBg: "#1aa090",
          textColor: "#ffffff",
          hoverTextColor: "#ffffff",
          borderColor: "transparent",
          hoverBorderColor: "transparent",
        },
      ],
    },

    style: {
      gap: 16,
      justify: "flex-start",
      defaultBg: "#222222",
      defaultHoverBg: "#26c6b0",
      defaultTextColor: "#ffffff",
      defaultHoverTextColor: "#ffffff",
      defaultBorderColor: "transparent",
      defaultHoverBorderColor: "transparent",
      defaultBorderRadius: 50,
      btnPaddingV: 12,
      btnPaddingH: 28,
      iconSize: 18,
      iconGap: 8,
      typography: { fontSize: 13, fontSizeUnit: "px", fontWeight: "700", letterSpacing: 0.5, letterSpacingUnit: "px" },
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
    },
  },

  controls: [
    // ══════════════════════════════════════════ CONTENT TAB ══════
    {
      tab: "Content",
      section: "Buttons",
      controls: [
        {
          name: "buttons",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
            {(value || []).map((btn: any, idx: number) => (
                <Section key={btn.id || idx} label={`Button #${idx + 1}: ${btn.label || ""}`}>
                <div className="space-y-2 pt-1">
                    {/* Remove */}
                    <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                    >
                        Remove
                    </button>
                    </div>

                    {/* Label */}
                    <Text
                    label="Label"
                    value={btn.label || ""}
                    onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], label: v }; onChange(u); }}
                    />

                    {/* URL */}
                    <Url
                    label="URL"
                    value={btn.url || ""}
                    onChange={(v: any) => { const u = [...value]; u[idx] = { ...u[idx], url: v?.url || "" }; onChange(u); }}
                    />

                    {/* Target */}
                    <Select
                    label="Open in"
                    value={btn.target || "_self"}
                    onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], target: v }; onChange(u); }}
                    options={[
                        { value: "_self", label: "Same Tab" },
                        { value: "_blank", label: "New Tab" },
                    ]}
                    />

                    {/* Icon */}
                    <IconPicker
                    label="Icon (optional)"
                    value={btn.icon || ""}
                    onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], icon: v }; onChange(u); }}
                    />

                    {/* Icon position */}
                    {btn.icon && (
                    <div className="space-y-2">
                        <ButtonGroup
                        label="Show Icon"
                        value={btn.showIcon !== false ? "yes" : "no"}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], showIcon: v === "yes" }; onChange(u); }}
                        options={[
                            { value: "yes", label: "Show" },
                            { value: "no", label: "Hide" },
                        ]}
                        />
                        <ButtonGroup
                        label="Icon Position"
                        value={btn.iconPosition || "left"}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], iconPosition: v }; onChange(u); }}
                        options={[
                            { value: "left", label: "Left" },
                            { value: "right", label: "Right" },
                        ]}
                        />
                    </div>
                    )}

                    {/* Per-button colors */}
                    <Section label="Colors (override global)">
                    <div className="space-y-2 pt-1">
                        <ColorPickerPopup
                        label="Background"
                        value={btn.bg || ""}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], bg: v }; onChange(u); }}
                        />
                        <ColorPickerPopup
                        label="Hover Background"
                        value={btn.hoverBg || ""}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], hoverBg: v }; onChange(u); }}
                        />
                        <ColorPickerPopup
                        label="Text Color"
                        value={btn.textColor || ""}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], textColor: v }; onChange(u); }}
                        />
                        <ColorPickerPopup
                        label="Hover Text Color"
                        value={btn.hoverTextColor || ""}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], hoverTextColor: v }; onChange(u); }}
                        />
                        <ColorPickerPopup
                        label="Border Color"
                        value={btn.borderColor || ""}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], borderColor: v }; onChange(u); }}
                        />
                        <ColorPickerPopup
                        label="Hover Border Color"
                        value={btn.hoverBorderColor || ""}
                        onChange={(v: string) => { const u = [...value]; u[idx] = { ...u[idx], hoverBorderColor: v }; onChange(u); }}
                        />
                    </div>
                    </Section>
                </div>
                </Section>
            ))}

            {/* Add button */}
            <button
                type="button"
                onClick={() => {
                const newBtn = {
                    id: `btn_${Date.now()}`,
                    label: "Button",
                    url: "#",
                    target: "_self",
                    icon: "",
                    iconPosition: "left",
                    showIcon: true,
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

    // ══════════════════════════════════════════ STYLE TAB ════════
    {
      tab: "Style",
      section: "Grid Layout",
      controls: [
        {
          name: "gap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Gap Between Buttons (px)"
              value={value ?? 16}
              onChange={onChange}
              min={0}
              max={80}
              step={2}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "justify",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ButtonGroup
              label="Alignment"
              value={value || "flex-start"}
              onChange={onChange}
              options={[
                { value: "flex-start", label: "Left" },
                { value: "center", label: "Center" },
                { value: "flex-end", label: "Right" },
                { value: "stretch", label: "Full Width" },
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Default Button Colors",
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
      ],
    },

    {
      tab: "Style",
      section: "Button Shape & Size",
      controls: [
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
      ],
    },

    {
      tab: "Style",
      section: "Icon",
      controls: [
        {
          name: "iconSize",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Icon Size (px)"
              value={value ?? 18}
              onChange={onChange}
              min={10}
              max={48}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "iconGap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Icon Gap (px)"
              value={value ?? 8}
              onChange={onChange}
              min={0}
              max={30}
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
      section: "Typography",
      controls: [
        {
          name: "typography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Button Text" value={value} onChange={onChange} />
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

  render: (element: any) => <ButtonsGroupFrontend element={element} />,
};

export default buttonsGroupElement;

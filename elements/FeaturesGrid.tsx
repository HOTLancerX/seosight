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
  Border,
  Dimensions,
  IconPicker,
  Section,
  Tabs,
  ImageGallery,
  BoxShadow,
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
  if (value.textDecoration) styles.textDecoration = value.textDecoration;
  if (value.lineHeight && value.lineHeight > 0) styles.lineHeight = `${value.lineHeight}${value.lineHeightUnit || "px"}`;
  if (value.letterSpacing !== undefined && value.letterSpacing !== 0) styles.letterSpacing = `${value.letterSpacing}${value.letterSpacingUnit || "px"}`;
  if (value.wordSpacing !== undefined && value.wordSpacing !== 0) styles.wordSpacing = `${value.wordSpacing}${value.wordSpacingUnit || "px"}`;
  return styles;
}

function getDimensionsStyles(obj: any, property: "margin" | "padding") {
  if (!obj || typeof obj !== "object") return {};
  const u = obj.unit || "px";
  if (u === "auto") {
    return { [property]: "auto" };
  }
  const t = obj.top === "" || obj.top === undefined ? 0 : obj.top;
  const r = obj.right === "" || obj.right === undefined ? 0 : obj.right;
  const b = obj.bottom === "" || obj.bottom === undefined ? 0 : obj.bottom;
  const l = obj.left === "" || obj.left === undefined ? 0 : obj.left;
  if (t === 0 && r === 0 && b === 0 && l === 0) return {};
  return {
    [property]: `${t}${u} ${r}${u} ${b}${u} ${l}${u}`
  };
}

function getBorderStyle(value: any) {
  if (!value || typeof value !== "object") return {};
  const side = value.normal !== undefined ? value.normal : value;
  if (!side) return {};
  const type = side.type ?? side.style ?? "";
  if (type === "" || type === "none") return { border: "none" };

  const styles: React.CSSProperties = {};
  const color = side.color || "#000000";

  const rawWidth = side.width;
  if (rawWidth && typeof rawWidth === "object") {
    const u = rawWidth.unit || "px";
    const t = rawWidth.top || 0;
    const r = rawWidth.right || 0;
    const b = rawWidth.bottom || 0;
    const l = rawWidth.left || 0;
    styles.borderStyle = type;
    styles.borderColor = color;
    styles.borderWidth = `${t}${u} ${r}${u} ${b}${u} ${l}${u}`;
  } else {
    const width = typeof rawWidth === "number" ? rawWidth : 1;
    styles.border = `${width}px ${type} ${color}`;
  }

  const r = side.radius;
  if (r && typeof r === "object") {
    const u = r.unit || "px";
    styles.borderRadius = `${r.top || 0}${u} ${r.right || 0}${u} ${r.bottom || 0}${u} ${r.left || 0}${u}`;
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
  return {
    boxShadow: `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`
  };
}

function FeaturesGridFrontend({ element }: { element: any }) {
  const s = element.schema;
  const items: any[] = s.content?.items || [];
  const desktopCols = parseInt(s.content?.columnsDesktop || "3");
  const tabletCols = parseInt(s.content?.columnsTablet || "2");
  const mobileCols = parseInt(s.content?.columnsMobile || "1");

  const gap = s.style?.gap ?? 30;
  const itemLayout = s.style?.layout || "image-left";
  const itemBg = s.style?.itemBg || "transparent";
  const itemPadding = s.style?.itemPadding || { top: 10, right: 10, bottom: 10, left: 10, unit: "px" };
  const itemBorder = s.style?.itemBorder || {};
  const itemRadius = s.style?.itemBorderRadius || { top: 8, right: 8, bottom: 8, left: 8, unit: "px" };
  const itemShadow = s.style?.itemBoxShadow || {};

  const imageWidth = s.style?.imageWidth ?? 70;
  const imageBg = s.style?.imageBg || "#e5e7eb";
  const imageColor = s.style?.imageColor || "#374151";
  const imagePadding = s.style?.imagePadding ?? 10;
  const imageBorderRadius = s.style?.imageBorderRadius || { top: 50, right: 50, bottom: 50, left: 50, unit: "%" };

  const titleTypography = s.style?.titleTypography || {};
  const titleColor = s.style?.titleColor || "#111827";
  const descTypography = s.style?.descTypography || {};
  const descColor = s.style?.descColor || "#4b5563";

  const cls = `bel-${element.id}`;

  return (
    <div className={`${cls} w-full`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .${cls}-container {
          display: grid;
          grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr));
          gap: ${gap}px;
          width: 100%;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-container {
            grid-template-columns: repeat(${tabletCols}, minmax(0, 1fr));
          }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-container {
            grid-template-columns: repeat(${mobileCols}, minmax(0, 1fr));
          }
        }
      ` }} />

      <div className={`${cls}-container`}>
        {items.map((item, idx) => {
          const hasImage = !!item.image;
          const hasIcon = !!item.icon;

          const itemLink = item.link || {};
          const isLinked = !!itemLink.url;

          // Spacing padding styling
          const paddingStyle = getDimensionsStyles(itemPadding, "padding");
          const borderStyle = getBorderStyle(itemBorder);
          const radiusStyle = getDimensionsStyles(itemRadius, "padding"); // radius stored as dimensions
          const shadowStyle = getBoxShadowStyle(itemShadow);

          // Image radius
          const imgRadiusStyle = getDimensionsStyles(imageBorderRadius, "padding");

          // Build outer wrapper style for each feature item
          const wrapperStyle: React.CSSProperties = {
            backgroundColor: itemBg,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: itemLayout === "image-top" ? "column" : (itemLayout === "image-right" ? "row-reverse" : "row"),
            alignItems: itemLayout === "image-top" ? "center" : "flex-start",
            textAlign: itemLayout === "image-top" ? "center" : "left",
            width: "100%",
            transition: "all 0.2s ease-in-out",
            ...paddingStyle,
            ...borderStyle,
            ...radiusStyle,
            ...shadowStyle,
          };

          // Circle icon container styling
          const iconWrapperStyle: React.CSSProperties = {
            width: `${imageWidth}px`,
            height: `${imageWidth}px`,
            minWidth: `${imageWidth}px`,
            minHeight: `${imageWidth}px`,
            borderRadius: imgRadiusStyle.padding || "50%",
            backgroundColor: item.imageBg || imageBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            padding: `${imagePadding}px`,
            marginBottom: itemLayout === "image-top" ? "16px" : "0px",
            marginRight: itemLayout === "image-left" ? "20px" : "0px",
            marginLeft: itemLayout === "image-right" ? "20px" : "0px",
            flexShrink: 0,
            overflow: "hidden",
          };

          const imgStyle: React.CSSProperties = {
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          };

          const textWrapperStyle: React.CSSProperties = {
            flex: "1 1 0%",
            minWidth: 0,
          };

          const tTypography = getTypographyStyles(titleTypography);
          const dTypography = getTypographyStyles(descTypography);

          const innerContent = (
            <>
              {/* Image/Icon Circle */}
              <div style={iconWrapperStyle}>
                {hasImage ? (
                  <img src={item.image} alt={item.title || ""} style={imgStyle} />
                ) : hasIcon ? (
                  <Icon icon={item.icon} width="100%" height="100%" style={{ color: imageColor }} />
                ) : (
                  <Icon icon="solar:widget-bold-duotone" width="100%" height="100%" style={{ color: imageColor }} />
                )}
              </div>

              {/* Text content */}
              <div style={textWrapperStyle}>
                {item.title && (
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: titleColor,
                      lineHeight: 1.3,
                      fontWeight: 600,
                      ...tTypography,
                    }}
                  >
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p
                    style={{
                      margin: 0,
                      color: descColor,
                      lineHeight: 1.5,
                      ...dTypography,
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </>
          );

          if (isLinked) {
            return (
              <a
                key={item.id || idx}
                href={itemLink.url}
                target={itemLink.target || undefined}
                rel={itemLink.nofollow ? "nofollow" : undefined}
                style={{ ...wrapperStyle, textDecoration: "none", color: "inherit" }}
              >
                {innerContent}
              </a>
            );
          }

          return (
            <div key={item.id || idx} style={wrapperStyle}>
              {innerContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const featuresGridElement = {
  type: "features-grid",
  category: "seosight",
  label: "Features Grid",
  icon: "solar:widget-bold-duotone",

  schema: {
    content: {
      items: [
        {
          id: "item_1",
          image: "",
          icon: "solar:map-point-bold-duotone",
          title: "Local Search Strategy",
          description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
          imageBg: "#edf5f6",
          link: { url: "", target: "", nofollow: false },
        },
        {
          id: "item_2",
          image: "",
          icon: "solar:map-bold-duotone",
          title: "Maps SEO",
          description: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium.",
          imageBg: "#fef8e7",
          link: { url: "", target: "", nofollow: false },
        },
        {
          id: "item_3",
          image: "",
          icon: "solar:anchor-bold-duotone",
          title: "Link Building & Content",
          description: "Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius notare.",
          imageBg: "#ebfbf7",
          link: { url: "", target: "", nofollow: false },
        },
        {
          id: "item_4",
          image: "",
          icon: "solar:target-bold-duotone",
          title: "Paid Search Advertising",
          description: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium.",
          imageBg: "#ebfbf7",
          link: { url: "", target: "", nofollow: false },
        },
        {
          id: "item_5",
          image: "",
          icon: "solar:balloon-bold-duotone",
          title: "Custom Website Design",
          description: "Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius notare.",
          imageBg: "#edf9fd",
          link: { url: "", target: "", nofollow: false },
        },
        {
          id: "item_6",
          image: "",
          icon: "solar:letter-bold-duotone",
          title: "Custom Email Design",
          description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
          imageBg: "#faf9eb",
          link: { url: "", target: "", nofollow: false },
        },
      ],
      columnsDesktop: "3",
      columnsTablet: "2",
      columnsMobile: "1",
    },

    style: {
      gap: 30,
      layout: "image-left",
      itemBg: "transparent",
      itemPadding: { top: 10, right: 10, bottom: 10, left: 10, unit: "px" },
      itemBorder: {
        normal: {
          type: "",
          width: 1,
          color: "#000000",
          radius: { top: 8, right: 8, bottom: 8, left: 8, unit: "px" },
        },
      },
      itemBorderRadius: { top: 8, right: 8, bottom: 8, left: 8, unit: "px" },
      itemBoxShadow: {
        normal: { x: 0, y: 0, blur: 0, spread: 0, color: "rgba(0,0,0,0.15)", inset: false },
      },
      imageWidth: 70,
      imageBg: "#e5e7eb",
      imageColor: "#f0623a",
      imagePadding: 15,
      imageBorderRadius: { top: 50, right: 50, bottom: 50, left: 50, unit: "%" },
      titleColor: "#2c3e50",
      titleTypography: {
        fontSize: 20,
        fontSizeUnit: "px",
        fontWeight: "600",
      },
      descColor: "#656565",
      descTypography: {
        fontSize: 14,
        fontSizeUnit: "px",
        fontWeight: "400",
      },
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
      section: "Grid Items",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Item #${idx + 1}: ${item.title || ""}`}>
                  <div className="space-y-2 pt-1">
                    {/* Remove */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange(value.filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Item
                      </button>
                    </div>

                    {/* Image */}
                    <ImageGallery
                      label="Image"
                      value={item.image || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], image: v }; onChange(u);
                      }}
                    />

                    {/* Fallback Icon */}
                    <IconPicker
                      label="Iconify Icon"
                      value={item.icon || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], icon: v }; onChange(u);
                      }}
                    />

                    {/* Image Circle Background Override */}
                    <ColorPickerPopup
                      label="Circle Bg Override"
                      value={item.imageBg || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], imageBg: v }; onChange(u);
                      }}
                    />

                    {/* Title */}
                    <Text
                      label="Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], title: v }; onChange(u);
                      }}
                    />

                    {/* Description */}
                    <Textarea
                      label="Description"
                      value={item.description || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], description: v }; onChange(u);
                      }}
                    />

                    {/* Link */}
                    <Url
                      label="Link"
                      value={item.link || { url: "", target: "", nofollow: false }}
                      onChange={(v: any) => {
                        const u = [...value]; u[idx] = { ...u[idx], link: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              {/* Add Item */}
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    id: `item_${Date.now()}`,
                    image: "",
                    icon: "solar:widget-bold-duotone",
                    title: `Feature #${(value?.length || 0) + 1}`,
                    description: "",
                    imageBg: "",
                    link: { url: "", target: "", nofollow: false },
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Grid Item
              </button>
            </div>
          ),
        },
      ],
    },
    {
      tab: "Content",
      section: "Grid Configuration",
      controls: [
        {
          name: "columnsDesktop",
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
          name: "columnsTablet",
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
          name: "columnsMobile",
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
      section: "Layout",
      controls: [
        {
          name: "layout",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Image Position"
              value={value || "image-left"}
              onChange={onChange}
              options={[
                { value: "image-left", label: "Left" },
                { value: "image-top", label: "Top" },
                { value: "image-right", label: "Right" },
              ]}
            />
          ),
        },
        {
          name: "gap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Grid Spacing Gap (px)"
              value={value ?? 30}
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
      section: "Item Spacing & Box Styles",
      controls: [
        {
          name: "itemPadding",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Dimensions type="padding" label="Item Inner Spacing" value={value} onChange={onChange} />
          ),
        },
        {
          name: "itemBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Item Background" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "itemBorder",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Border label="Item Border" value={value} onChange={onChange} />
          ),
        },
        {
          name: "itemBoxShadow",
          responsive: false,
          render: (value: any, onChange: any) => (
            <BoxShadow label="Item Shadow" value={value} onChange={onChange} />
          ),
        },
      ],
    },
    {
      tab: "Style",
      section: "Circle Image/Icon",
      controls: [
        {
          name: "imageWidth",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Circle Width (px)"
              value={value ?? 70}
              onChange={onChange}
              min={30}
              max={200}
              step={5}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "imageBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Circle Background" value={value ?? "#e5e7eb"} onChange={onChange} />
          ),
        },
        {
          name: "imageColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Icon Color" value={value ?? "#374151"} onChange={onChange} />
          ),
        },
        {
          name: "imagePadding",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Circle Padding (px)"
              value={value ?? 10}
              onChange={onChange}
              min={0}
              max={60}
              step={2}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "imageBorderRadius",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Dimensions type="padding" label="Circle Border Radius" value={value} onChange={onChange} />
          ),
        },
      ],
    },
    {
      tab: "Style",
      section: "Typography",
      controls: [
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color" value={value ?? "#111827"} onChange={onChange} />
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
          name: "descColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "descTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Description Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <FeaturesGridFrontend element={element} />,
};

export default featuresGridElement;

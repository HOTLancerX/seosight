"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

function getYoutubeId(url: string) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
}

function VideoSectionFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Content
  const title: string = s.content?.title || "Watch Our Video";
  const subtitle: string = s.content?.subtitle || "";
  const description: string = s.content?.description || "";
  const image: string = s.content?.image || "";
  const videoUrl: string = s.content?.videoUrl || "";

  const btnLabel: string = s.content?.btnLabel || "";
  const btnUrl: string = s.content?.btnUrl || "#";
  const btnTarget: string = s.content?.btnTarget || "_self";

  // Style
  const reverseLayout: boolean = s.style?.reverseLayout === true;
  const gap: number = s.style?.gap ?? 60;
  const vertAlign: string = s.style?.vertAlign || "center";

  // Title
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const titleTypography = s.style?.titleTypography || {};
  const accentLineColor: string = s.style?.accentLineColor || "#26c6b0";

  // Subtitle
  const subtitleColor: string = s.style?.subtitleColor || "#2c3e50";
  const subtitleTypography = s.style?.subtitleTypography || {};

  // Description
  const descColor: string = s.style?.descColor || "#656565";
  const descTypography = s.style?.descTypography || {};

  // Play Button
  const playBg: string = s.style?.playBg || "#26c6b0";
  const playIconColor: string = s.style?.playIconColor || "#ffffff";
  const playSize: number = s.style?.playSize ?? 70;

  // CTA Button
  const btnBg: string = s.style?.btnBg || "#f0623a";
  const btnTextColor: string = s.style?.btnTextColor || "#ffffff";
  const btnBorderRadius: number = s.style?.btnBorderRadius ?? 30;

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const tTyp = getTypographyStyles(titleTypography);
  const stTyp = getTypographyStyles(subtitleTypography);
  const dTyp = getTypographyStyles(descTypography);

  const videoId = getYoutubeId(videoUrl);

  const modalContent = isOpen && videoId ? (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "20px",
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "960px",
          aspectRatio: "16/9",
          backgroundColor: "#000",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(0, 0, 0, 0.5)",
            border: "none",
            color: "#fff",
            fontSize: "20px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.8)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")}
        >
          ✕
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    </div>
  ) : null;

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
          .${cls}-video-col {
            order: -1;
          }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-grid {
            gap: ${Math.round(gap * 0.6)}px;
          }
        }
        .${cls}-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 28px;
          background: ${btnBg};
          color: ${btnTextColor};
          border: 2px solid ${btnBg};
          border-radius: ${btnBorderRadius}px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s, opacity 0.2s;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .${cls}-btn:hover { opacity: 0.9; }
        .${cls}-play-btn {
          width: ${playSize}px;
          height: ${playSize}px;
          background-color: ${playBg};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
          border: none;
          padding: 0;
          color: ${playIconColor};
        }
        .${cls}-play-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
      `
      }} />

      <div className={`${cls}-grid`} style={{ direction: reverseLayout ? "rtl" : "ltr" }}>
        {/* Video Thumbnail Column */}
        <div className={`${cls}-video-col`} style={{ direction: "ltr", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              aspectRatio: "16/9",
            }}
          >
            {image ? (
              <img
                src={image}
                alt={title || "Video thumbnail"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
            {/* Play Button Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <button className={`${cls}-play-btn`} onClick={() => setIsOpen(true)}>
                <Icon icon="mdi:play" width={playSize * 0.5} height={playSize * 0.5} style={{ marginLeft: "4px" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Text Content Column */}
        <div style={{ direction: "ltr" }}>
          {title && (
            <h2
              style={{
                margin: "0 0 8px 0",
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

          {/* Teal underline accent line */}
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
            <h4
              style={{
                margin: "0 0 16px 0",
                color: subtitleColor,
                lineHeight: 1.5,
                fontSize: "18px",
                fontWeight: "500",
                ...stTyp,
              }}
            >
              {subtitle}
            </h4>
          )}

          {description && (
            <p
              style={{
                margin: "0 0 28px 0",
                color: descColor,
                fontSize: "14px",
                lineHeight: 1.8,
                ...dTyp,
              }}
            >
              {description}
            </p>
          )}

          {btnLabel && (
            <a href={btnUrl} target={btnTarget} className={`${cls}-btn`}>
              <Icon icon="mdi:arrow-top-right-thin-circle-outline" width="18" />
              {btnLabel}
            </a>
          )}
        </div>
      </div>

      {/* Render YouTube player Modal in document.body via Portal */}
      {mounted && createPortal(modalContent, document.body)}
    </div>
  );
}

const videoSectionElement = {
  type: "video-section",
  category: "seosight",
  label: "Video Section",
  icon: "solar:video-library-bold-duotone",

  schema: {
    content: {
      title: "Watch Our Video",
      subtitle: "Qolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibham.",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      image: "",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      btnLabel: "About Us",
      btnUrl: "#",
      btnTarget: "_self",
    },

    style: {
      reverseLayout: false,
      gap: 60,
      vertAlign: "center",

      titleColor: "#1d293f",
      titleTypography: { fontSize: 36, fontSizeUnit: "px", fontWeight: "700" },
      accentLineColor: "#26c6b0",

      subtitleColor: "#2c3e50",
      subtitleTypography: { fontSize: 18, fontSizeUnit: "px", fontWeight: "500" },

      descColor: "#656565",
      descTypography: { fontSize: 14, fontSizeUnit: "px", fontWeight: "400" },

      playBg: "#26c6b0",
      playIconColor: "#ffffff",
      playSize: 70,

      btnBg: "#f0623a",
      btnTextColor: "#ffffff",
      btnBorderRadius: 30,
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
      section: "Video Source",
      controls: [
        {
          name: "videoUrl",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="YouTube Video URL or ID" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "image",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Thumbnail Placeholder Image" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Text Content",
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
            <Textarea label="Subtitle" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "description",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Description Paragraph" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Button",
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
                { value: "normal", label: "Video Left / Text Right" },
                { value: "reversed", label: "Text Left / Video Right" },
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
      section: "Play Button",
      controls: [
        {
          name: "playBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Play Button Background" value={value ?? "#26c6b0"} onChange={onChange} />
          ),
        },
        {
          name: "playIconColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Play Icon Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "playSize",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Play Button Size (px)"
              value={value ?? 70}
              onChange={onChange}
              min={40}
              max={150}
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
      section: "Typography",
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
            <ColorPickerPopup label="Subtitle Color" value={value ?? "#2c3e50"} onChange={onChange} />
          ),
        },
        {
          name: "subtitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Subtitle Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "descColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description Color" value={value ?? "#656565"} onChange={onChange} />
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

    {
      tab: "Style",
      section: "CTA Button",
      controls: [
        {
          name: "btnBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Background" value={value ?? "#f0623a"} onChange={onChange} />
          ),
        },
        {
          name: "btnTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "btnBorderRadius",
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

  render: (element: any) => <VideoSectionFrontend element={element} />,
};

export default videoSectionElement;

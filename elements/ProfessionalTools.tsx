"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  Url,
  NumberControl,
  Select,
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

interface ToolItem {
  id: string;
  title: string;
  desc: string;
  percentage: number;
  color: string;
  link: { url: string; target: string; nofollow: boolean; customAttributes: string };
  readMoreText: string;
}

/* ── Circular Progress Sub-component with viewport entry & count-up trigger ── */
function CircularProgressBar({
  percentage,
  color,
  circleSize,
  trackColor,
  strokeWidth,
  textColor,
  textTyp,
  duration = 1500,
}: {
  percentage: number;
  color: string;
  circleSize: number;
  trackColor: string;
  strokeWidth: number;
  textColor: string;
  textTyp: React.CSSProperties;
  duration?: number;
}) {
  const [currentVal, setCurrentVal] = useState(0);
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // SVG Calculations
  const radius = (circleSize - strokeWidth - 6) / 2;
  const center = circleSize / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out quad
      const easedProgress = progress * (2 - progress);
      setCurrentVal(Math.floor(easedProgress * percentage));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCurrentVal(percentage);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [visible, percentage, duration]);

  // Dashoffset calculation
  const targetOffset = circumference - (currentVal / 100) * circumference;

  return (
    <div
      ref={elementRef}
      style={{
        position: "relative",
        width: circleSize,
        height: circleSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={circleSize}
        height={circleSize}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      >
        {/* Outer Background Glow / Shadow circle track (optional style) */}
        <circle
          cx={center}
          cy={center}
          r={radius + 3}
          fill="none"
          stroke="rgba(0, 0, 0, 0.015)"
          strokeWidth={strokeWidth + 2}
        />

        {/* Empty Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth - 2}
        />

        {/* Active Progress stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={visible ? targetOffset : circumference}
          strokeLinecap="round"
          style={{
            transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.1, 0.76, 0.55, 0.94)`,
          }}
        />
      </svg>

      {/* Percentage Count-Up Text inside Center */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: textColor,
          fontWeight: 700,
          fontSize: `${Math.round(circleSize * 0.22)}px`,
          ...textTyp,
        }}
      >
        {currentVal}%
      </div>
    </div>
  );
}

/* ── Frontend ───────────────────────────────────────── */
function ProfessionalToolsFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const mainTitle: string = s.content?.mainTitle || "Professional Tools for Your Business";
  const mainSubtitle: string = s.content?.mainSubtitle || "Qumonstraverunt lectores legere me lius saepius.";
  const tools: ToolItem[] = s.content?.tools || [];
  const animDuration: number = s.content?.animDuration ?? 1600;

  // Grid
  const colsDesktop: number = parseInt(s.content?.colsDesktop || "2");
  const colsTablet: number = parseInt(s.content?.colsTablet || "2");
  const colsMobile: number = parseInt(s.content?.colsMobile || "1");
  const gap: number = s.style?.gap ?? 40;

  // Style Settings
  const containerBg: string = s.style?.containerBg || "transparent";
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const descColor: string = s.style?.descColor || "#5e6e82";
  const dividerColor: string = s.style?.dividerColor || "#3cb878";
  
  const circleSize: number = s.style?.circleSize ?? 120;
  const trackColor: string = s.style?.trackColor || "rgba(0, 0, 0, 0.06)";
  const strokeWidth: number = s.style?.strokeWidth ?? 8;
  const progressTextColor: string = s.style?.progressTextColor || "#1d293f";

  const readMoreColor: string = s.style?.readMoreColor || "#3cb878";
  const readMoreHoverColor: string = s.style?.readMoreHoverColor || "#2ea86a";

  // Typography
  const mainTitleTyp = getTypographyStyles(s.style?.mainTitleTypography || {});
  const mainSubtitleTyp = getTypographyStyles(s.style?.mainSubtitleTypography || {});
  
  const toolTitleTyp = getTypographyStyles(s.style?.toolTitleTypography || {});
  const toolDescTyp = getTypographyStyles(s.style?.toolDescTypography || {});
  const progressTextTyp = getTypographyStyles(s.style?.progressTextTypography || {});

  // Advanced Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: containerBg,
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .${cls}-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          text-align: left;
          box-sizing: border-box;
        }
        .${cls}-title {
          font-size: 32px;
          font-weight: 700;
          color: ${titleColor};
          margin: 0 0 16px 0;
          line-height: 1.25;
        }
        .${cls}-divider-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
        }
        .${cls}-divider-short {
          width: 12px;
          height: 2px;
          background-color: ${dividerColor};
          border-radius: 1px;
        }
        .${cls}-divider-long {
          width: 44px;
          height: 2px;
          background-color: ${dividerColor};
          border-radius: 1px;
        }
        .${cls}-subtitle {
          font-size: 16px;
          color: ${descColor};
          margin: 0 0 48px 0;
          line-height: 1.6;
        }
        /* Grid */
        .${cls}-grid {
          display: grid;
          grid-template-columns: repeat(${colsDesktop}, minmax(0, 1fr));
          gap: ${gap}px;
          width: 100%;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-grid {
            grid-template-columns: repeat(${colsTablet}, minmax(0, 1fr));
            gap: ${Math.round(gap * 0.85)}px;
          }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-grid {
            grid-template-columns: repeat(${colsMobile}, minmax(0, 1fr));
            gap: ${Math.round(gap * 0.75)}px;
          }
          .${cls}-title { font-size: 26px; }
          .${cls}-subtitle { margin-bottom: 32px; }
        }
        /* Grid Item Card */
        .${cls}-item {
          display: flex;
          align-items: flex-start;
          gap: 24px;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-item {
            gap: 20px;
          }
        }
        .${cls}-content {
          display: flex;
          flex-direction: column;
          text-align: left;
          align-items: flex-start;
        }
        .${cls}-tool-title {
          font-size: 20px;
          font-weight: 700;
          color: ${titleColor};
          margin: 4px 0 12px 0;
          line-height: 1.3;
        }
        .${cls}-tool-desc {
          font-size: 14.5px;
          color: ${descColor};
          line-height: 1.6;
          margin: 0 0 16px 0;
        }
        .${cls}-readmore {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: ${readMoreColor};
          text-decoration: none;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .${cls}-readmore:hover {
          color: ${readMoreHoverColor};
        }
        .${cls}-readmore:hover .${cls}-arrow {
          transform: translateX(4px);
        }
        .${cls}-arrow {
          transition: transform 0.25s ease;
        }
      `}} />

      <div className={`${cls}-container`}>
        {/* Main Title Headers */}
        {mainTitle && (
          <h2
            className={`${cls}-title`}
            style={{ color: titleColor, ...mainTitleTyp }}
          >
            {mainTitle}
          </h2>
        )}

        <div className={`${cls}-divider-wrap`}>
          <div className={`${cls}-divider-short`} />
          <div className={`${cls}-divider-long`} />
        </div>

        {mainSubtitle && (
          <p
            className={`${cls}-subtitle`}
            style={{ color: descColor, ...mainSubtitleTyp }}
          >
            {mainSubtitle}
          </p>
        )}

        {/* Tools Progress Cards Grid */}
        <div className={`${cls}-grid`}>
          {tools.map((item, idx) => (
            <div key={item.id || idx} className={`${cls}-item`}>
              
              {/* Circular percentage progress SVG bar */}
              <CircularProgressBar
                percentage={item.percentage}
                color={item.color}
                circleSize={circleSize}
                trackColor={trackColor}
                strokeWidth={strokeWidth}
                textColor={progressTextColor}
                textTyp={progressTextTyp}
                duration={animDuration}
              />

              {/* Tool Text content split right */}
              <div className={`${cls}-content`}>
                <h3
                  className={`${cls}-tool-title`}
                  style={{ ...toolTitleTyp }}
                >
                  {item.title}
                </h3>
                
                {item.desc && (
                  <p
                    className={`${cls}-tool-desc`}
                    style={{ ...toolDescTyp }}
                  >
                    {item.desc}
                  </p>
                )}

                {item.readMoreText && (
                  <a
                    className={`${cls}-readmore`}
                    href={item.link?.url || "#"}
                    target={item.link?.target || "_self"}
                    rel={item.link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  >
                    <span>{item.readMoreText}</span>
                    <Icon
                      icon="solar:alt-arrow-right-outline"
                      width="14"
                      className={`${cls}-arrow`}
                    />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Element Definition ─────────────────────────────── */
const professionalToolsElement = {
  type: "professional-tools",
  category: "seosight",
  label: "Professional Tools",
  icon: "solar:compass-window-bold-duotone",

  schema: {
    content: {
      mainTitle: "Professional Tools for Your Business",
      mainSubtitle: "Qumonstraverunt lectores legere me lius saepius.",
      animDuration: 1600,
      colsDesktop: "2",
      colsTablet: "2",
      colsMobile: "1",
      tools: [
        {
          id: "tool_1",
          title: "Brand Monitoring",
          desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
          percentage: 43,
          color: "#f5a623",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          readMoreText: "Read More",
        },
        {
          id: "tool_2",
          title: "Social Media Contests",
          desc: "Nam liber tempor cum soluta nobis eleifend option congue nihil.",
          percentage: 68,
          color: "#3cb878",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          readMoreText: "Read More",
        },
        {
          id: "tool_3",
          title: "Social Media Management",
          desc: "Mirum est notare quam littera gothica, quam nunc putamus parum.",
          percentage: 90,
          color: "#25c2d9",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          readMoreText: "Read More",
        },
        {
          id: "tool_4",
          title: "Setup & Custom Profile Design",
          desc: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum sollemnes.",
          percentage: 19,
          color: "#e25c34",
          link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          readMoreText: "Read More",
        },
      ],
    },

    style: {
      gap: 40,
      containerBg: "transparent",
      titleColor: "#1d293f",
      descColor: "#5e6e82",
      dividerColor: "#3cb878",
      
      circleSize: 120,
      trackColor: "rgba(0, 0, 0, 0.05)",
      strokeWidth: 8,
      progressTextColor: "#1d293f",

      readMoreColor: "#3cb878",
      readMoreHoverColor: "#2ea86a",

      mainTitleTypography: { fontSize: 32, fontSizeUnit: "px", fontWeight: "700" },
      mainSubtitleTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "400" },
      toolTitleTypography: { fontSize: 20, fontSizeUnit: "px", fontWeight: "700" },
      toolDescTypography: { fontSize: 14.5, fontSizeUnit: "px", fontWeight: "400" },
      progressTextTypography: { fontSize: 26, fontSizeUnit: "px", fontWeight: "700" },
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 60, right: 20, bottom: 60, left: 20, unit: "px" },
    },
  },

  controls: [
    // ═══════════════════ CONTENT TAB ════════════════
    {
      tab: "Content",
      section: "Header Settings",
      controls: [
        {
          name: "mainTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Main Title Heading" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "mainSubtitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Main Subtitle / Paragraph" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "animDuration",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Count-Up Duration (ms)"
              value={value ?? 1600}
              onChange={onChange}
              min={500}
              max={5000}
              step={100}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Columns Layout",
      controls: [
        {
          name: "colsDesktop",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Columns (Desktop)"
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
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Professional Tools list",
      controls: [
        {
          name: "tools",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Tool #${idx + 1}: ${item.title || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Tool
                      </button>
                    </div>

                    <Text
                      label="Tool Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], title: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Tool Description"
                      value={item.desc || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], desc: v }; onChange(u);
                      }}
                      rows={3}
                    />

                    <NumberControl
                      label="Progress Percentage (%)"
                      value={item.percentage ?? 50}
                      onChange={(v: number) => {
                        const u = [...value]; u[idx] = { ...u[idx], percentage: Math.min(100, Math.max(0, v)) }; onChange(u);
                      }}
                      min={0}
                      max={100}
                      showSlider
                    />

                    <ColorPickerPopup
                      label="Active Ring Color"
                      value={item.color || "#3cb878"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], color: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Read More Text"
                      value={item.readMoreText || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], readMoreText: v }; onChange(u);
                      }}
                    />

                    <Url
                      label="Link URL"
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
                  const newTool: ToolItem = {
                    id: `tool_${Date.now()}`,
                    title: `Tool ${(value?.length || 0) + 1}`,
                    desc: "Tool description text goes here.",
                    percentage: 50,
                    color: "#3cb878",
                    link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                    readMoreText: "Read More",
                  };
                  onChange([...(value || []), newTool]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Tool Item
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Layout & Spacing Defaults",
      controls: [
        {
          name: "gap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Grid Space Gap (px)"
              value={value ?? 40}
              onChange={onChange}
              min={0}
              max={120}
              step={5}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "containerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Container Background" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
      ],
    },

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
          name: "descColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description / Subtitle Color" value={value ?? "#5e6e82"} onChange={onChange} />
          ),
        },
        {
          name: "dividerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Divider Line Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Circular Progress Appearance",
      controls: [
        {
          name: "circleSize",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Circle Size (Diameter)"
              value={value ?? 120}
              onChange={onChange}
              min={60}
              max={240}
              step={5}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "strokeWidth",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Active Stroke Thickness"
              value={value ?? 8}
              onChange={onChange}
              min={2}
              max={20}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "trackColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Empty Track Color" value={value ?? "rgba(0, 0, 0, 0.05)"} onChange={onChange} />
          ),
        },
        {
          name: "progressTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Center Text Color" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Read More Link Color",
      controls: [
        {
          name: "readMoreColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Link Normal Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "readMoreHoverColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Link Hover Color" value={value ?? "#2ea86a"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography",
      controls: [
        {
          name: "mainTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Main Heading Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "mainSubtitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Main Subtitle Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "toolTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Tool Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "toolDescTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Tool Desc Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "progressTextTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Center Text Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <ProfessionalToolsFrontend element={element} />,
};

export default professionalToolsElement;

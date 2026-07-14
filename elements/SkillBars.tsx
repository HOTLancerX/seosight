"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  Textarea,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  Url,
  NumberControl,
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

interface SkillItem {
  id: string;
  label: string;
  percentage: number;
  barColor: string;
}

/* ── Progress Bar Sub-component with viewport trigger & number counter animation ── */
function SingleProgressBar({
  label,
  percentage,
  barColor,
  barHeight,
  emptyBarBg,
  handleBorderColor,
  textColor,
  textTyp,
  duration = 1500,
}: {
  label: string;
  percentage: number;
  barColor: string;
  barHeight: number;
  emptyBarBg: string;
  handleBorderColor: string;
  textColor: string;
  textTyp: React.CSSProperties;
  duration?: number;
}) {
  const [currentVal, setCurrentVal] = useState(0);
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

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

  const handleSize = barHeight + 10;

  return (
    <div ref={elementRef} style={{ width: "100%", marginBottom: "28px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          alignItems: "center",
          color: textColor,
          ...textTyp,
        }}
      >
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ fontWeight: 600, opacity: 0.85 }}>{currentVal} %</span>
      </div>

      <div
        style={{
          width: "100%",
          height: barHeight,
          backgroundColor: emptyBarBg,
          borderRadius: barHeight / 2,
          position: "relative",
        }}
      >
        {/* Animated fill */}
        <div
          style={{
            height: "100%",
            width: `${visible ? percentage : 0}%`,
            backgroundColor: barColor,
            borderRadius: barHeight / 2,
            transition: `width ${duration}ms cubic-bezier(0.1, 0.76, 0.55, 0.94)`,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />

        {/* Circle handle */}
        <div
          style={{
            width: handleSize,
            height: handleSize,
            borderRadius: "50%",
            backgroundColor: barColor,
            border: `3px solid ${handleBorderColor}`,
            position: "absolute",
            left: `calc(${visible ? percentage : 0}% - ${handleSize / 2}px)`,
            top: `-${(handleSize - barHeight) / 2}px`,
            transition: `left ${duration}ms cubic-bezier(0.1, 0.76, 0.55, 0.94)`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

/* ── Frontend ───────────────────────────────────────── */
function SkillBarsFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Left Content
  const title: string = s.content?.title || "Quality Skills";
  const desc: string = s.content?.desc || "";
  const btnLabel: string = s.content?.btnLabel || "Free SEO Consultation";
  const btnLink = s.content?.btnLink || { url: "#", target: "_self", nofollow: false, customAttributes: "" };

  // Right Content
  const skills: SkillItem[] = s.content?.skills || [];
  const duration: number = s.content?.duration ?? 1800;

  // Style Settings
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const descColor: string = s.style?.descColor || "#5e6e82";
  const dividerColor: string = s.style?.dividerColor || "#3cb878";
  
  // Progress bar custom styles
  const barHeight: number = s.style?.barHeight ?? 6;
  const emptyBarBg: string = s.style?.emptyBarBg || "rgba(0, 0, 0, 0.15)";
  const handleBorderColor: string = s.style?.handleBorderColor || "#ffffff";
  const skillTextColor: string = s.style?.skillTextColor || "#1d293f";

  // CTA Button colors
  const btnBg: string = s.style?.btnBg || "#3cb878";
  const btnTextColor: string = s.style?.btnTextColor || "#ffffff";
  const btnBorderColor: string = s.style?.btnBorderColor || "#3cb878";
  const btnHoverBg: string = s.style?.btnHoverBg || "#2ea86a";
  const btnHoverTextColor: string = s.style?.btnHoverTextColor || "#ffffff";
  const btnBorderRadius: number = s.style?.btnBorderRadius ?? 40;

  // Typography
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const descTyp = getTypographyStyles(s.style?.descTypography || {});
  const skillTyp = getTypographyStyles(s.style?.skillTypography || {});

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .${cls}-row {
          display: flex;
          align-items: center;
          gap: 60px;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-row { gap: 40px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-row { flex-direction: column; gap: 40px; align-items: stretch; }
        }
        .${cls}-left {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .${cls}-right {
          flex: 1.2 1 0%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .${cls}-title {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 16px;
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
        .${cls}-desc {
          font-size: 15px;
          line-height: 1.7;
          margin: 0 0 32px;
        }
        .${cls}-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          border-width: 2px;
          border-style: solid;
          box-sizing: border-box;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
        }
        .${cls}-btn:hover {
          transform: translateY(-2px);
        }
      `}} />

      <div className={`${cls}-row`}>
        {/* Left Column (Content & Call to Action) */}
        <div className={`${cls}-left`}>
          {title && (
            <h2
              className={`${cls}-title`}
              style={{ color: titleColor, ...titleTyp }}
            >
              {title}
            </h2>
          )}

          <div className={`${cls}-divider-wrap`}>
            <div className={`${cls}-divider-short`} />
            <div className={`${cls}-divider-long`} />
          </div>

          {desc && (
            <p
              className={`${cls}-desc`}
              style={{ color: descColor, ...descTyp }}
            >
              {desc}
            </p>
          )}

          {btnLabel && (
            <a
              className={`${cls}-btn`}
              href={btnLink?.url || "#"}
              target={btnLink?.target || "_self"}
              rel={btnLink?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
              style={{
                backgroundColor: btnBg,
                color: btnTextColor,
                borderColor: btnBorderColor,
                borderRadius: `${btnBorderRadius}px`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = btnHoverBg;
                e.currentTarget.style.color = btnHoverTextColor;
                e.currentTarget.style.borderColor = btnHoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = btnBg;
                e.currentTarget.style.color = btnTextColor;
                e.currentTarget.style.borderColor = btnBorderColor;
              }}
            >
              {btnLabel}
            </a>
          )}
        </div>

        {/* Right Column (Animated Skill Progress Bars) */}
        <div className={`${cls}-right`}>
          {skills.map((skill, idx) => (
            <SingleProgressBar
              key={skill.id || idx}
              label={skill.label}
              percentage={skill.percentage}
              barColor={skill.barColor}
              barHeight={barHeight}
              emptyBarBg={emptyBarBg}
              handleBorderColor={handleBorderColor}
              textColor={skillTextColor}
              textTyp={skillTyp}
              duration={duration}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Element Definition ─────────────────────────────── */
const skillBarsElement = {
  type: "skill-bars",
  category: "seosight",
  label: "Skill Bars",
  icon: "solar:ranking-bold-duotone",

  schema: {
    content: {
      title: "Quality Skills",
      desc: "Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, sollemnes in futurum.",
      btnLabel: "Free SEO Consultation",
      btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
      duration: 1600,
      skills: [
        { id: "s1", label: "Content marketing strategy", percentage: 62, barColor: "#f5a623" },
        { id: "s2", label: "Digital consultancy", percentage: 86, barColor: "#3cb878" },
        { id: "s3", label: "Mobile Marketing", percentage: 52, barColor: "#e25c34" },
        { id: "s4", label: "Reputation management", percentage: 40, barColor: "#25c2d9" },
      ],
    },

    style: {
      titleColor: "#1d293f",
      descColor: "#5e6e82",
      dividerColor: "#3cb878",
      
      barHeight: 6,
      emptyBarBg: "rgba(0, 0, 0, 0.08)",
      handleBorderColor: "#ffffff",
      skillTextColor: "#1d293f",

      btnBg: "#3cb878",
      btnTextColor: "#ffffff",
      btnBorderColor: "#3cb878",
      btnHoverBg: "#2ea86a",
      btnHoverTextColor: "#ffffff",
      btnBorderRadius: 40,

      titleTypography: { fontSize: 36, fontSizeUnit: "px", fontWeight: "700" },
      descTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },
      skillTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "600" },
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
      section: "Header & Button (Left)",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "desc",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Description Paragraph" value={value || ""} onChange={onChange} rows={4} />
          ),
        },
        {
          name: "btnLabel",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button Text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btnLink",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button Link" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Skills Config (Right)",
      controls: [
        {
          name: "duration",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Animation Duration (ms)"
              value={value ?? 1600}
              onChange={onChange}
              min={500}
              max={5000}
              step={100}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "skills",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((skill: any, idx: number) => (
                <Section key={skill.id || idx} label={`Skill Bar #${idx + 1}: ${skill.label || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Skill
                      </button>
                    </div>

                    <Text
                      label="Skill Label / Name"
                      value={skill.label || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], label: v }; onChange(u);
                      }}
                    />

                    <NumberControl
                      label="Target Percentage (%)"
                      value={skill.percentage ?? 50}
                      onChange={(v: number) => {
                        const u = [...value]; u[idx] = { ...u[idx], percentage: v }; onChange(u);
                      }}
                      min={0}
                      max={100}
                      step={1}
                      showSlider
                    />

                    <ColorPickerPopup
                      label="Bar & Handle Color"
                      value={skill.barColor || "#3cb878"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], barColor: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newSkill = {
                    id: `s_${Date.now()}`,
                    label: `Skill ${(value?.length || 0) + 1}`,
                    percentage: 60,
                    barColor: "#3cb878",
                  };
                  onChange([...(value || []), newSkill]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Skill Bar
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Typography & Text Colors",
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
            <ColorPickerPopup label="Description Color" value={value ?? "#5e6e82"} onChange={onChange} />
          ),
        },
        {
          name: "dividerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Divider Line Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "skillTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Skill Text Color" value={value ?? "#1d293f"} onChange={onChange} />
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
          name: "descTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Description Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "skillTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Skill Labels Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Progress Bars Appearance",
      controls: [
        {
          name: "barHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Progress Line Height (px)"
              value={value ?? 6}
              onChange={onChange}
              min={2}
              max={24}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "emptyBarBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Empty Track Color" value={value ?? "rgba(0, 0, 0, 0.08)"} onChange={onChange} />
          ),
        },
        {
          name: "handleBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Handle Inner Border" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Button Styling",
      controls: [
        {
          name: "btnBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Background" value={value ?? "#3cb878"} onChange={onChange} />
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
          name: "btnBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Border Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "btnHoverBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Hover Background" value={value ?? "#2ea86a"} onChange={onChange} />
          ),
        },
        {
          name: "btnHoverTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button Hover Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "btnBorderRadius",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Button Corner Radius (px)"
              value={value ?? 40}
              onChange={onChange}
              min={0}
              max={50}
              step={1}
              showSlider
              grid={2}
            />
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

  render: (element: any) => <SkillBarsFrontend element={element} />,
};

export default skillBarsElement;

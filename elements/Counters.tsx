"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  NumberControl,
  Select,
  ButtonGroup,
  ColorPickerPopup,
  Dimensions,
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

// Sub-component for individual counting items
function AnimatedCounter({
  target,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback if IntersectionObserver not available
      animateCount();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  const animateCount = () => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad: progress * (2 - progress)
      const easedProgress = progress * (2 - progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  };

  return (
    <div ref={elementRef} style={{ display: "inline-block" }}>
      {prefix}
      {count}
      {suffix}
    </div>
  );
}

interface CounterItemData {
  id: string;
  target: number;
  prefix: string;
  suffix: string;
  label: string;
}

function CountersFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  const items: CounterItemData[] = s.content?.items || [];
  const duration: number = s.content?.duration ?? 2000;

  // Grid / Columns
  const colsDesktop: number = parseInt(s.content?.colsDesktop || "4");
  const colsTablet: number = parseInt(s.content?.colsTablet || "2");
  const colsMobile: number = parseInt(s.content?.colsMobile || "1");
  const gap: number = s.style?.gap ?? 30;

  // Global styles
  const containerBg: string = s.style?.containerBg || "#3cb878";
  const numColor: string = s.style?.numColor || "#ffffff";
  const numTypography = s.style?.numTypography || {};

  const labelColor: string = s.style?.labelColor || "#ffffff";
  const labelTypography = s.style?.labelTypography || {};

  // Advanced Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const numTypStyles = getTypographyStyles(numTypography);
  const labelTypStyles = getTypographyStyles(labelTypography);

  return (
    <div
      className={`${cls}-wrap`}
      style={{
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: containerBg,
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .${cls}-wrap { box-sizing: border-box; }
        .${cls}-grid {
          display: grid;
          grid-template-columns: repeat(${colsDesktop}, minmax(0, 1fr));
          gap: ${gap}px;
          width: 100%;
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
          padding: 20px 10px;
        }
        .${cls}-number {
          font-size: 72px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 12px;
          opacity: 0.95;
          letter-spacing: -1px;
        }
        .${cls}-label {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.4;
          opacity: 0.9;
        }
      `
      }} />

      <div className={`${cls}-grid`}>
        {items.map((item, idx) => (
          <div key={item.id || idx} className={`${cls}-item`}>
            {/* Animated Number */}
            <div
              className={`${cls}-number`}
              style={{ color: numColor, ...numTypStyles }}
            >
              <AnimatedCounter
                target={item.target || 0}
                duration={duration}
                prefix={item.prefix || ""}
                suffix={item.suffix || ""}
              />
            </div>

            {/* Label */}
            {item.label && (
              <div
                className={`${cls}-label`}
                style={{ color: labelColor, ...labelTypStyles }}
              >
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const countersElement = {
  type: "counters",
  category: "seosight",
  label: "Counters",
  icon: "solar:clock-square-bold-duotone",

  schema: {
    content: {
      duration: 1800,
      colsDesktop: "4",
      colsTablet: "2",
      colsMobile: "1",
      items: [
        {
          id: "item_1",
          target: 96,
          prefix: "",
          suffix: "%",
          label: "Client retention",
        },
        {
          id: "item_2",
          target: 10,
          prefix: "",
          suffix: "",
          label: "Years of service",
        },
        {
          id: "item_3",
          target: 70,
          prefix: "",
          suffix: "+",
          label: "PROFESSIONALS",
        },
        {
          id: "item_4",
          target: 690,
          prefix: "",
          suffix: "+",
          label: "Satisfied clients",
        },
      ],
    },

    style: {
      containerBg: "#3cb878",
      gap: 30,

      numColor: "#ffffff",
      numTypography: { fontSize: 72, fontSizeUnit: "px", fontWeight: "700" },

      labelColor: "#ffffff",
      labelTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "500" },
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 60, right: 20, bottom: 60, left: 20, unit: "px" },
    },
  },

  controls: [
    // ══════════════════════════════════════════ CONTENT TAB ══════
    {
      tab: "Content",
      section: "Settings",
      controls: [
        {
          name: "duration",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Animation Duration (ms)"
              value={value ?? 2000}
              onChange={onChange}
              min={500}
              max={5000}
              step={100}
              showSlider
              grid={2}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Counter Stats Items",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Counter #${idx + 1}: ${item.label || ""}`}>
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

                    <NumberControl
                      label="Target Number"
                      value={item.target ?? 0}
                      onChange={(v: number) => {
                        const u = [...value]; u[idx] = { ...u[idx], target: v }; onChange(u);
                      }}
                      min={0}
                      max={1000000}
                      step={1}
                    />

                    <Text
                      label="Prefix Text"
                      value={item.prefix || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], prefix: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Suffix Text"
                      value={item.suffix || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], suffix: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Label / Description"
                      value={item.label || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], label: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: CounterItemData = {
                    id: `item_${Date.now()}`,
                    target: 100,
                    prefix: "",
                    suffix: "",
                    label: `Stat #${(value?.length || 0) + 1}`,
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Counter Item
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

    // ══════════════════════════════════════════ STYLE TAB ════════
    {
      tab: "Style",
      section: "Section Layout",
      controls: [
        {
          name: "containerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Container Background" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
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
      ],
    },

    {
      tab: "Style",
      section: "Number Typography",
      controls: [
        {
          name: "numColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Number Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "numTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Number Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Label Typography",
      controls: [
        {
          name: "labelColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Label Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "labelTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Label Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <CountersFrontend element={element} />,
};

export default countersElement;

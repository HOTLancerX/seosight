"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  ImageGallery,
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

interface TimelineItem {
  id: string;
  year: string;
  date: string;
  title: string;
  desc: string;
  image: string;
}

/* ── Frontend ───────────────────────────────────────── */
function TimelineFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const items: TimelineItem[] = s.content?.items || [];

  // Style Settings
  const containerBg: string = s.style?.containerBg || "transparent";
  const trackColor: string = s.style?.trackColor || "#f5a623";
  const dotBorderColor: string = s.style?.dotBorderColor || "#f5a623";
  const dotActiveColor: string = s.style?.dotActiveColor || "#3cb878";
  
  const arrowColor: string = s.style?.arrowColor || "#e2e8f0";
  const arrowHoverColor: string = s.style?.arrowHoverColor || "#3cb878";
  
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const descColor: string = s.style?.descColor || "#5e6e82";
  const dateColor: string = s.style?.dateColor || "#889097";

  // Typography
  const yearTyp = getTypographyStyles(s.style?.yearTypography || {});
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const descTyp = getTypographyStyles(s.style?.descTypography || {});

  // Advanced Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Embla Slider Content
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (i: number) => emblaApi && emblaApi.scrollTo(i),
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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
          width: 100%;
          box-sizing: border-box;
        }
        /* Top Navigation Timeline Bar */
        .${cls}-timeline-nav {
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
          margin-bottom: 54px;
          gap: 16px;
        }
        .${cls}-track-line {
          position: absolute;
          left: 48px;
          right: 48px;
          height: 3px;
          background-color: ${trackColor};
          top: 10px;
          z-index: 1;
        }
        .${cls}-dots-container {
          flex: 1 1 auto;
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 2;
          padding: 0 44px;
        }
        .${cls}-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
        }
        .${cls}-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid ${dotBorderColor};
          background-color: #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.08);
          box-sizing: border-box;
          transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
        }
        .${cls}-node-active .${cls}-dot {
          background-color: ${dotActiveColor};
          border-color: ${dotActiveColor};
          transform: scale(1.15);
        }
        .${cls}-year-label {
          font-size: 15px;
          font-weight: 600;
          color: ${descColor};
          margin-top: 10px;
          transition: color 0.3s ease, font-weight 0.3s ease;
        }
        .${cls}-node-active .${cls}-year-label {
          color: ${dotActiveColor};
          font-weight: 700;
        }
        /* Nav Arrow Buttons at track ends */
        .${cls}-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid ${arrowColor};
          color: ${arrowColor};
          background: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 3;
          flex-shrink: 0;
          outline: none;
        }
        .${cls}-arrow:hover {
          color: ${arrowHoverColor};
          border-color: ${arrowHoverColor};
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }
        .${cls}-arrow-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Bottom Detail Slider Panel */
        .${cls}-viewport {
          overflow: hidden;
          width: 100%;
        }
        .${cls}-slider-container {
          display: flex;
        }
        .${cls}-slide {
          flex: 0 0 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .${cls}-slide-content {
          display: flex;
          gap: 60px;
          align-items: center;
          width: 100%;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-slide-content { gap: 40px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-slide-content { flex-direction: column; gap: 32px; text-align: center; align-items: stretch; }
          .${cls}-timeline-nav { gap: 8px; margin-bottom: 40px; }
          .${cls}-track-line { left: 40px; right: 40px; }
          .${cls}-dots-container { padding: 0 32px; }
        }
        .${cls}-image-wrap {
          flex: 0 0 35%;
          max-width: 35%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-image-wrap { flex: 0 0 100%; max-width: 100%; }
        }
        .${cls}-img {
          max-width: 100%;
          height: auto;
          max-height: 200px;
          object-fit: contain;
          display: block;
        }
        .${cls}-text-wrap {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-text-wrap { align-items: center; text-align: center; }
        }
        .${cls}-date {
          font-size: 14px;
          font-weight: 500;
          color: ${dateColor};
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .${cls}-event-title {
          font-size: 26px;
          font-weight: 700;
          color: ${titleColor};
          margin: 0 0 16px 0;
          line-height: 1.3;
        }
        .${cls}-desc {
          font-size: 15px;
          line-height: 1.7;
          color: ${descColor};
          margin: 0;
        }
      `}} />

      <div className={`${cls}-container`}>
        {/* Top Timeline Navigation Track Bar */}
        {items.length > 0 && (
          <div className={`${cls}-timeline-nav`}>
            {/* Left Track Arrow */}
            <button
              className={`${cls}-arrow ${selectedIndex === 0 ? `${cls}-arrow-disabled` : ""}`}
              onClick={scrollPrev}
              aria-label="Previous milestone"
            >
              <Icon icon="solar:alt-arrow-left-outline" width="16" />
            </button>

            {/* Horizontal Line Path overlay */}
            <div className={`${cls}-track-line`} />

            {/* Circle Node Dots */}
            <div className={`${cls}-dots-container`}>
              {items.map((item, idx) => {
                const isActive = selectedIndex === idx;
                return (
                  <button
                    key={item.id || idx}
                    className={`${cls}-node ${isActive ? `${cls}-node-active` : ""}`}
                    onClick={() => scrollTo(idx)}
                  >
                    <div className={`${cls}-dot`} />
                    <span className={`${cls}-year-label`} style={{ ...yearTyp }}>
                      {item.year}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Track Arrow */}
            <button
              className={`${cls}-arrow ${selectedIndex === items.length - 1 ? `${cls}-arrow-disabled` : ""}`}
              onClick={scrollNext}
              aria-label="Next milestone"
            >
              <Icon icon="solar:alt-arrow-right-outline" width="16" />
            </button>
          </div>
        )}

        {/* Bottom Detail Embla slider panels */}
        {items.length > 0 && (
          <div className={`${cls}-viewport`} ref={emblaRef}>
            <div className={`${cls}-slider-container`}>
              {items.map((item, idx) => (
                <div key={item.id || idx} className={`${cls}-slide`}>
                  <div className={`${cls}-slide-content`}>
                    
                    {/* Event image milestone graphic */}
                    {item.image && (
                      <div className={`${cls}-image-wrap`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className={`${cls}-img`}
                        />
                      </div>
                    )}

                    {/* Event Description details block right */}
                    <div className={`${cls}-text-wrap`}>
                      <span className={`${cls}-date`}>
                        {item.date}
                      </span>
                      
                      <h3
                        className={`${cls}-event-title`}
                        style={{ ...titleTyp }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`${cls}-desc`}
                        style={{ ...descTyp }}
                      >
                        {item.desc}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Element Definition ─────────────────────────────── */
const timelineElement = {
  type: "timeline",
  category: "seosight",
  label: "Timeline Slider",
  icon: "solar:history-bold-duotone",

  schema: {
    content: {
      items: [
        {
          id: "t1",
          year: "2011",
          date: "February, 2011",
          title: "Startup Project Launched",
          desc: "Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium.",
          image: "",
        },
        {
          id: "t2",
          year: "2012",
          date: "October, 2012",
          title: "First Major Investment",
          desc: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros.",
          image: "",
        },
        {
          id: "t3",
          year: "2013",
          date: "August, 2013",
          title: "Team of 20 Specialists",
          desc: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
          image: "",
        },
        {
          id: "t4",
          year: "2014",
          date: "June, 2014",
          title: "Global Markets Entry",
          desc: "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.",
          image: "",
        },
        {
          id: "t5",
          year: "2015",
          date: "December, 2015",
          title: "Top Digital Agency Title",
          desc: "Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula.",
          image: "",
        },
        {
          id: "t6",
          year: "2016",
          date: "May, 2016",
          title: "Foundation of the Company",
          desc: "Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo est usus legentis in iis qui facit eorum.",
          image: "",
        },
      ],
    },

    style: {
      containerBg: "transparent",
      trackColor: "#f5a623",
      dotBorderColor: "#f5a623",
      dotActiveColor: "#3cb878",
      arrowColor: "#e2e8f0",
      arrowHoverColor: "#3cb878",
      titleColor: "#1d293f",
      descColor: "#5e6e82",
      dateColor: "#889097",
      yearTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "600" },
      titleTypography: { fontSize: 26, fontSizeUnit: "px", fontWeight: "700" },
      descTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },
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
      section: "Timeline Milestone Items",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Milestone #${idx + 1}: ${item.year || ""}`}>
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
                      label="Year Navigation Label"
                      value={item.year || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], year: v }; onChange(u);
                      }}
                      placeholder="e.g. 2016"
                    />

                    <Text
                      label="Full Date Tag"
                      value={item.date || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], date: v }; onChange(u);
                      }}
                      placeholder="e.g. May, 2016"
                    />

                    <Text
                      label="Milestone Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], title: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Milestone Description"
                      value={item.desc || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], desc: v }; onChange(u);
                      }}
                      rows={3}
                    />

                    <ImageGallery
                      label="Milestone Graphic Image"
                      value={item.image || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], image: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: TimelineItem = {
                    id: `t_${Date.now()}`,
                    year: "2020",
                    date: "September, 2020",
                    title: "New Achievement",
                    desc: "Milestone detail and accomplishment description.",
                    image: "",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Milestone Item
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Timeline Navigation Track",
      controls: [
        {
          name: "trackColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Horizontal Line Track" value={value ?? "#f5a623"} onChange={onChange} />
          ),
        },
        {
          name: "dotBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Nodes Outer Border" value={value ?? "#f5a623"} onChange={onChange} />
          ),
        },
        {
          name: "dotActiveColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Node filled Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "arrowColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Navigation Arrows Border" value={value ?? "#e2e8f0"} onChange={onChange} />
          ),
        },
        {
          name: "arrowHoverColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Navigation Arrows Hover" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Milestone Content Colors",
      controls: [
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Milestone Title Color" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
        {
          name: "descColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description Text Color" value={value ?? "#5e6e82"} onChange={onChange} />
          ),
        },
        {
          name: "dateColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Milestone Date Tag Color" value={value ?? "#889097"} onChange={onChange} />
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
      section: "Typography",
      controls: [
        {
          name: "yearTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Navigation Year Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Milestone Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "descTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Milestone Description Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <TimelineFrontend element={element} />,
};

export default timelineElement;

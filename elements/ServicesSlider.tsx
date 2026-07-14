"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  Url,
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

interface ServiceSlide {
  id: string;
  tabTitle: string;
  tabSubtitle: string;
  tabBgColor: string;
  mainTitle: string;
  mainDesc: string;
  bgImage: string;
  contentAlign: "left" | "center" | "right";
  btn1Label: string;
  btn1Link: { url: string; target: string; nofollow: boolean; customAttributes: string };
  btn2Label: string;
  btn2Link: { url: string; target: string; nofollow: boolean; customAttributes: string };
}

/* ── Frontend ───────────────────────────────────────── */
function ServicesSliderFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const slides: ServiceSlide[] = s.content?.slides || [];

  // Style Settings
  const containerBg: string = s.style?.containerBg || "transparent";
  const arrowColor: string = s.style?.arrowColor || "#ffffff";
  const arrowHoverColor: string = s.style?.arrowHoverColor || "#f5a623";
  const overlayBg: string = s.style?.overlayBg || "rgba(0, 0, 0, 0.4)";
  
  const minHeight: number = s.style?.minHeight ?? 480;
  const tabHeight: number = s.style?.tabHeight ?? 110;

  // Colors
  const mainTitleColor: string = s.style?.mainTitleColor || "#ffffff";
  const mainDescColor: string = s.style?.mainDescColor || "#ffffff";
  const tabTextColor: string = s.style?.tabTextColor || "#ffffff";

  // Typography
  const mainTitleTyp = getTypographyStyles(s.style?.mainTitleTypography || {});
  const mainDescTyp = getTypographyStyles(s.style?.mainDescTypography || {});
  const tabTitleTyp = getTypographyStyles(s.style?.tabTitleTypography || {});

  // Advanced Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Embla setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
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
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }
        /* Top Main Slider Area */
        .${cls}-top-area {
          position: relative;
          min-height: ${minHeight}px;
          width: 100%;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
        .${cls}-viewport {
          overflow: hidden;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }
        .${cls}-container-slides {
          display: flex;
          height: 100%;
        }
        .${cls}-slide {
          flex: 0 0 100%;
          min-width: 0;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        /* Stretch background image inside left, right and bottom */
        .${cls}-bg-img {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;
          z-index: 1;
        }
        .${cls}-overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background: ${overlayBg};
          z-index: 2;
        }
        /* Content wrap overlays overlay */
        .${cls}-slide-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 600px;
          padding: 80px 48px;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }
        .${cls}-slide-content-left {
          margin-right: auto;
          margin-left: 8%;
          align-items: flex-start;
          text-align: left;
        }
        .${cls}-slide-content-center {
          margin: 0 auto;
          align-items: center;
          text-align: center;
        }
        .${cls}-slide-content-right {
          margin-left: auto;
          margin-right: 8%;
          align-items: flex-start;
          text-align: left;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-slide-content { padding: 60px 24px; }
          .${cls}-slide-content-left, .${cls}-slide-content-right {
            margin: 0 auto;
            align-items: center;
            text-align: center;
          }
          .${cls}-top-area { min-height: ${Math.round(minHeight * 0.9)}px; }
        }
        .${cls}-main-title {
          font-size: 42px;
          font-weight: 700;
          color: ${mainTitleColor};
          margin: 0 0 18px 0;
          line-height: 1.2;
        }
        .${cls}-main-desc {
          font-size: 16px;
          line-height: 1.75;
          color: ${mainDescColor};
          margin: 0 0 32px 0;
          opacity: 0.9;
        }
        /* Slide Buttons */
        .${cls}-btn-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-btn-row { flex-direction: column; gap: 12px; width: 100%; max-width: 240px; }
        }
        .${cls}-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 26px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
          border: 2px solid #ffffff;
          color: #ffffff;
          border-radius: 40px;
          transition: all 0.3s ease;
        }
        .${cls}-btn-outline:hover {
          background-color: #ffffff;
          color: #111111;
        }
        .${cls}-btn-solid {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 26px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
          background-color: #f5a623;
          border: 2px solid #f5a623;
          color: #ffffff;
          border-radius: 40px;
          transition: all 0.3s ease;
        }
        .${cls}-btn-solid:hover {
          background-color: #e09212;
          border-color: #e09212;
        }

        /* Nav Side Arrows overlaying main area */
        .${cls}-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          color: ${arrowColor};
          z-index: 5;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .${cls}-nav-arrow:hover {
          color: ${arrowHoverColor};
        }
        .${cls}-nav-arrow-left {
          left: 20px;
        }
        .${cls}-nav-arrow-right {
          right: 20px;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-nav-arrow { display: none; }
        }

        /* Bottom tabs bar */
        .${cls}-bottom-tabs {
          display: flex;
          width: 100%;
          min-height: ${tabHeight}px;
          z-index: 6;
          box-sizing: border-box;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-bottom-tabs { flex-wrap: wrap; }
        }
        .${cls}-tab {
          flex: 1 1 0%;
          min-width: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          text-align: left;
          padding: 24px 28px;
          cursor: pointer;
          box-sizing: border-box;
          position: relative;
          transition: opacity 0.3s ease;
          border-bottom: 4px solid transparent;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-tab { flex: 1 0 33.333%; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-tab { flex: 1 0 50%; padding: 18px 20px; }
        }
        .${cls}-tab-active {
          border-bottom-color: ${arrowHoverColor};
        }
        .${cls}-tab-title {
          font-size: 15px;
          font-weight: 700;
          color: ${tabTextColor};
          line-height: 1.35;
          margin: 0;
          position: relative;
          z-index: 3;
        }
        .${cls}-tab-num {
          position: absolute;
          right: 20px;
          bottom: 12px;
          font-size: 54px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.08);
          line-height: 1;
          user-select: none;
          z-index: 2;
        }
        .${cls}-tab-active .${cls}-tab-num {
          color: rgba(255, 255, 255, 0.14);
        }
      `}} />

      <div className={`${cls}-container`}>
        {/* Top Slider Viewport Container */}
        <div className={`${cls}-top-area`}>
          {slides.length > 0 && (
            <div className={`${cls}-viewport`} ref={emblaRef}>
              <div className={`${cls}-container-slides`}>
                {slides.map((slide, idx) => (
                  <div key={slide.id || idx} className={`${cls}-slide`}>
                    
                    {/* Background image covers inside */}
                    {slide.bgImage && (
                      <div
                        className={`${cls}-bg-img`}
                        style={{ backgroundImage: `url(${slide.bgImage})` }}
                      />
                    )}

                    {/* Dark/color filter overlay */}
                    <div className={`${cls}-overlay`} />

                    {/* Text and buttons details overlay */}
                    <div className={`${cls}-slide-content ${cls}-slide-content-${slide.contentAlign || "center"}`}>
                      <h2
                        className={`${cls}-main-title`}
                        style={{ ...mainTitleTyp }}
                      >
                        {slide.mainTitle}
                      </h2>
                      
                      {slide.mainDesc && (
                        <p
                          className={`${cls}-main-desc`}
                          style={{ ...mainDescTyp }}
                        >
                          {slide.mainDesc}
                        </p>
                      )}

                      {/* Buttons */}
                      <div className={`${cls}-btn-row`}>
                        {slide.btn1Label && (
                          <a
                            className={`${cls}-btn-outline`}
                            href={slide.btn1Link?.url || "#"}
                            target={slide.btn1Link?.target || "_self"}
                            rel={slide.btn1Link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                          >
                            {slide.btn1Label}
                          </a>
                        )}

                        {slide.btn2Label && (
                          <a
                            className={`${cls}-btn-solid`}
                            href={slide.btn2Link?.url || "#"}
                            target={slide.btn2Link?.target || "_self"}
                            rel={slide.btn2Link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                          >
                            {slide.btn2Label}
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Left Navigation Arrow */}
          {slides.length > 1 && (
            <button
              className={`${cls}-nav-arrow ${cls}-nav-arrow-left`}
              onClick={scrollPrev}
              aria-label="Previous service"
            >
              <svg
                width="42"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M41 8H1M8 1L1 8l7 7" />
              </svg>
            </button>
          )}

          {/* Right Navigation Arrow */}
          {slides.length > 1 && (
            <button
              className={`${cls}-nav-arrow ${cls}-nav-arrow-right`}
              onClick={scrollNext}
              aria-label="Next service"
            >
              <svg
                width="42"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 8h40M34 1l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Bottom service selection tabs bar */}
        {slides.length > 0 && (
          <div className={`${cls}-bottom-tabs`}>
            {slides.map((slide, idx) => {
              const isActive = selectedIndex === idx;
              const formattedNum = String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={slide.id || idx}
                  className={`${cls}-tab ${isActive ? `${cls}-tab-active` : ""}`}
                  style={{
                    backgroundColor: slide.tabBgColor || "#3cb878",
                    opacity: isActive ? 1 : 0.82,
                  }}
                  onClick={() => scrollTo(idx)}
                >
                  {/* Huge index number in back */}
                  <span className={`${cls}-tab-num`}>
                    {formattedNum}
                  </span>
                  
                  {/* Title */}
                  <h4
                    className={`${cls}-tab-title`}
                    style={{ ...tabTitleTyp }}
                  >
                    {slide.tabTitle}
                  </h4>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Element Definition ─────────────────────────────── */
const servicesSliderElement = {
  type: "services-slider",
  category: "seosight",
  label: "Services Tabs Slider",
  icon: "solar:slideshow-bold-duotone",

  schema: {
    content: {
      slides: [
        {
          id: "slide_1",
          tabTitle: "Search Engine Optimization",
          tabSubtitle: "01",
          tabBgColor: "#2b303b",
          mainTitle: "Search Engine Optimization",
          mainDesc: "Pay Per Click has an instant impact and gives your brand a much larger reach and exposure as a result of first-page exposure on major search engines.",
          bgImage: "",
          contentAlign: "center",
          btn1Label: "Learn More",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get Started",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "slide_2",
          tabTitle: "Local SEO",
          tabSubtitle: "02",
          tabBgColor: "#25c2d9",
          mainTitle: "Local Search Optimization",
          mainDesc: "Target clients in your specific region and capture ready-to-buy local consumers directly from Google maps and local business directories.",
          bgImage: "",
          contentAlign: "center",
          btn1Label: "Learn More",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get Started",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "slide_3",
          tabTitle: "Social Media Marketing",
          tabSubtitle: "03",
          tabBgColor: "#e25c34",
          mainTitle: "Social Media Marketing",
          mainDesc: "Build dynamic brand visibility, foster deep client relations, and drive organic traffic through custom-designed social media campaigns.",
          bgImage: "",
          contentAlign: "center",
          btn1Label: "Learn More",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get Started",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "slide_4",
          tabTitle: "Email Marketing",
          tabSubtitle: "04",
          tabBgColor: "#f5a623",
          mainTitle: "Email Marketing Campaigns",
          mainDesc: "Deliver tailored messages directly into the inbox of your hot leads and segment your subscribers to maximize conversions and engagement.",
          bgImage: "",
          contentAlign: "right",
          btn1Label: "Learn More",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get Started",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "slide_5",
          tabTitle: "Pay Per Click Management",
          tabSubtitle: "05",
          tabBgColor: "#3cb878",
          mainTitle: "Pay Per Click (PPC) Management",
          mainDesc: "Pay Per Click has an instant impact and gives your brand a much larger reach and exposure as a result of first-page exposure on major search engines.",
          bgImage: "",
          contentAlign: "center",
          btn1Label: "Learn More",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get Started",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
      ],
    },

    style: {
      containerBg: "transparent",
      arrowColor: "#ffffff",
      arrowHoverColor: "#f5a623",
      overlayBg: "rgba(0, 0, 0, 0.4)",
      
      minHeight: 480,
      tabHeight: 110,

      mainTitleColor: "#ffffff",
      mainDescColor: "#ffffff",
      tabTextColor: "#ffffff",

      mainTitleTypography: { fontSize: 42, fontSizeUnit: "px", fontWeight: "700" },
      mainDescTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "400" },
      tabTitleTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "700" },
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
    },
  },

  controls: [
    // ═══════════════════ CONTENT TAB ════════════════
    {
      tab: "Content",
      section: "Service Slides & Tabs",
      controls: [
        {
          name: "slides",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((slide: any, idx: number) => (
                <Section key={slide.id || idx} label={`Slide #${idx + 1}: ${slide.tabTitle || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Slide
                      </button>
                    </div>

                    <Text
                      label="Tab Label Title"
                      value={slide.tabTitle || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], tabTitle: v }; onChange(u);
                      }}
                    />

                    <ColorPickerPopup
                      label="Tab Box Background Color"
                      value={slide.tabBgColor || "#3cb878"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], tabBgColor: v }; onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Slide Background Image"
                      value={slide.bgImage || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], bgImage: v }; onChange(u);
                      }}
                    />

                    <Select
                      label="Content Text Position"
                      value={slide.contentAlign || "center"}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], contentAlign: v }; onChange(u);
                      }}
                      options={[
                        { value: "left", label: "Left Aligned" },
                        { value: "center", label: "Center Aligned" },
                        { value: "right", label: "Right Aligned" },
                      ]}
                    />

                    <Text
                      label="Slide Main Title Heading"
                      value={slide.mainTitle || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], mainTitle: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Slide Description Text"
                      value={slide.mainDesc || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], mainDesc: v }; onChange(u);
                      }}
                      rows={3}
                    />

                    <Section label="Button 1 (Outline)">
                      <div className="space-y-2 pt-1">
                        <Text
                          label="Button Label"
                          value={slide.btn1Label || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn1Label: v }; onChange(u);
                          }}
                        />
                        <Url
                          label="Button URL"
                          value={slide.btn1Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" }}
                          onChange={(v: any) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn1Link: v }; onChange(u);
                          }}
                        />
                      </div>
                    </Section>

                    <Section label="Button 2 (Solid)">
                      <div className="space-y-2 pt-1">
                        <Text
                          label="Button Label"
                          value={slide.btn2Label || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn2Label: v }; onChange(u);
                          }}
                        />
                        <Url
                          label="Button URL"
                          value={slide.btn2Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" }}
                          onChange={(v: any) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn2Link: v }; onChange(u);
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
                  const newSlide: ServiceSlide = {
                    id: `slide_${Date.now()}`,
                    tabTitle: `New Service ${(value?.length || 0) + 1}`,
                    tabSubtitle: "",
                    tabBgColor: "#3cb878",
                    mainTitle: "Main Slide Title",
                    mainDesc: "Main slide details and description.",
                    bgImage: "",
                    contentAlign: "center",
                    btn1Label: "Learn More",
                    btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                    btn2Label: "Get Started",
                    btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                  };
                  onChange([...(value || []), newSlide]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Service Slide
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Sizes & Dimensions",
      controls: [
        {
          name: "minHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Slider Min Height (px)"
              value={value ?? 480}
              onChange={onChange}
              min={300}
              max={800}
              step={10}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "tabHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Tabs Bar Height (px)"
              value={value ?? 110}
              onChange={onChange}
              min={70}
              max={200}
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
      section: "Main Slide Colors",
      controls: [
        {
          name: "mainTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Heading Title Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "mainDescColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "overlayBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Slide Overlay Filter" value={value ?? "rgba(0, 0, 0, 0.4)"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Tab Bar appearance",
      controls: [
        {
          name: "tabTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Tab Titles Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "arrowColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Navigation Arrows" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "arrowHoverColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Arrows Hover & Indicator" value={value ?? "#f5a623"} onChange={onChange} />
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
          name: "mainDescTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Description Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "tabTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Tab Title Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <ServicesSliderFrontend element={element} />,
};

export default servicesSliderElement;

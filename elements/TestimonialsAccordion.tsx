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
  Url,
  Toggle,
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

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

interface TestimonialItem {
  id: string;
  quote: string;
  avatar: string;
  authorName: string;
  authorRole: string;
  rating: number; // 1-5
  youtubeUrl: string; // opens video on card click or play click
}

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

/* ── Frontend ───────────────────────────────────────── */
function TestimonialsAccordionFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const testTitle: string = s.content?.testTitle || "Testimonials";
  const testimonials: TestimonialItem[] = s.content?.testimonials || [];

  const accordionTitle: string = s.content?.accordionTitle || "Accordion";
  const accordions: AccordionItem[] = s.content?.accordions || [];

  // Style Settings
  const containerBg: string = s.style?.containerBg || "transparent";
  const dividerColor: string = s.style?.dividerColor || "#3cb878";
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const textColor: string = s.style?.textColor || "#5e6e82";

  // Card specific styles
  const cardBg: string = s.style?.cardBg || "#ffffff";
  const cardFoldColor: string = s.style?.cardFoldColor || "#f4f7f6";
  const ratingActiveColor: string = s.style?.ratingActiveColor || "#f5a623";
  const dotActiveColor: string = s.style?.dotActiveColor || "#3cb878";
  const dotInactiveColor: string = s.style?.dotInactiveColor || "#e2e8f0";

  // Accordion specific styles
  const accHeaderBg: string = s.style?.accHeaderBg || "#ffffff";
  const accHeaderActiveBg: string = s.style?.accHeaderActiveBg || "#ffffff";
  const accTitleColor: string = s.style?.accTitleColor || "#1d293f";
  const accTitleActiveColor: string = s.style?.accTitleActiveColor || "#3cb878";
  const accContentBg: string = s.style?.accContentBg || "#ffffff";
  const accBorderColor: string = s.style?.accBorderColor || "#eef2f5";
  const accBorderRadius: number = s.style?.accBorderRadius ?? 30;

  // Typography
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const bodyTyp = getTypographyStyles(s.style?.bodyTypography || {});
  const accTitleTyp = getTypographyStyles(s.style?.accTitleTypography || {});

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // State: YouTube lightbox
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // State: Testimonials slider
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

  // State: Accordion expand (only one open, default item index 0)
  const [openAccIndex, setOpenAccIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenAccIndex(openAccIndex === idx ? null : idx);
  };

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
        .${cls}-row {
          display: flex;
          gap: 60px;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-row { gap: 40px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-row { flex-direction: column; gap: 48px; }
        }
        .${cls}-left {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
        }
        .${cls}-right {
          flex: 1.1 1 0%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .${cls}-header {
          font-size: 32px;
          font-weight: 700;
          color: ${titleColor};
          margin: 0 0 16px;
          line-height: 1.25;
        }
        .${cls}-divider-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 36px;
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
        /* Slider Viewport */
        .${cls}-embla-viewport {
          overflow: hidden;
          width: 100%;
          margin-bottom: 24px;
          padding: 8px 4px;
        }
        .${cls}-embla-container {
          display: flex;
        }
        .${cls}-embla-slide {
          flex: 0 0 100%;
          min-width: 0;
          padding: 4px;
          box-sizing: border-box;
        }
        /* Testimonial Bubble Card */
        .${cls}-card {
          position: relative;
          background-color: ${cardBg};
          border-radius: 16px 16px 0 16px;
          box-sizing: border-box;
          padding: 40px 44px 36px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 28px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .${cls}-card-top {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .${cls}-quote-text {
          font-size: 16px;
          line-height: 1.7;
          color: ${textColor};
          margin: 0;
        }
        .${cls}-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        .${cls}-author-box {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .${cls}-avatar-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #f1f3f5;
          flex-shrink: 0;
          border: 2px solid #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          position: relative;
          cursor: pointer;
        }
        .${cls}-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .${cls}-avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, ${dividerColor}55, ${dividerColor}aa);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
          font-size: 18px;
        }
        /* Play Icon Overlay */
        .${cls}-play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }
        .${cls}-play-overlay:hover {
          background: rgba(0,0,0,0.5);
        }
        .${cls}-author-details {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .${cls}-author-name {
          font-size: 15px;
          font-weight: 700;
          color: ${titleColor};
          margin: 0 0 2px 0;
        }
        .${cls}-author-role {
          font-size: 12px;
          color: ${textColor};
          margin: 0 0 6px 0;
          opacity: 0.8;
        }
        .${cls}-rating {
          display: flex;
          gap: 3px;
          color: ${ratingActiveColor};
        }
        .${cls}-rating-empty {
          color: #e2e8f0;
        }
        .${cls}-quote-icon {
          font-size: 80px;
          line-height: 0.2;
          font-family: Georgia, serif;
          opacity: 0.06;
          color: ${titleColor};
          user-select: none;
          position: absolute;
          right: 0;
          bottom: 12px;
        }
        /* Folded Corner */
        .${cls}-card::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 24px;
          height: 24px;
          background: ${cardFoldColor};
          border-top-left-radius: 12px;
          box-shadow: -4px -4px 6px rgba(0,0,0,0.04);
        }
        /* Dots Navigation */
        .${cls}-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }
        .${cls}-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .${cls}-dot-active {
          background-color: ${dotActiveColor};
          transform: scale(1.1);
        }
        .${cls}-dot-inactive {
          background-color: ${dotInactiveColor};
        }

        /* Accordion Styles */
        .${cls}-accordion-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }
        .${cls}-acc-item {
          border-radius: ${accBorderRadius}px;
          border: 1.5px solid ${accBorderColor};
          overflow: hidden;
          background-color: ${accHeaderBg};
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .${cls}-acc-item-active {
          border-color: ${accTitleActiveColor}aa;
          box-shadow: 0 8px 24px rgba(0,0,0,0.03);
        }
        .${cls}-acc-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 22px 30px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.3s ease;
          gap: 20px;
          outline: none;
        }
        .${cls}-acc-icon-wrap {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${textColor};
          transition: transform 0.3s ease, color 0.3s ease;
          flex-shrink: 0;
          border-right: 1.5px solid ${accBorderColor};
          padding-right: 14px;
        }
        .${cls}-acc-item-active .${cls}-acc-icon-wrap {
          transform: rotate(90deg);
          color: ${accTitleActiveColor};
        }
        .${cls}-acc-title {
          color: ${accTitleColor};
          transition: color 0.3s ease;
          margin: 0;
          flex: 1 1 auto;
        }
        .${cls}-acc-item-active .${cls}-acc-title {
          color: ${accTitleActiveColor};
        }
        .${cls}-acc-content-wrap {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
          background-color: ${accContentBg};
        }
        .${cls}-acc-content {
          padding: 0px 30px 24px 84px;
          font-size: 14px;
          line-height: 1.65;
          color: ${textColor};
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-acc-header { padding: 18px 20px; }
          .${cls}-acc-content { padding: 0 20px 20px 62px; }
          .${cls}-header { font-size: 26px; }
        }
      `}} />

      <div className={`${cls}-row`}>
        {/* Left Side: Testimonials Slider */}
        <div className={`${cls}-left`}>
          {testTitle && (
            <h2 className={`${cls}-header`} style={{ ...titleTyp }}>
              {testTitle}
            </h2>
          )}

          <div className={`${cls}-divider-wrap`}>
            <div className={`${cls}-divider-short`} />
            <div className={`${cls}-divider-long`} />
          </div>

          {testimonials.length > 0 && (
            <>
              <div className={`${cls}-embla-viewport`} ref={emblaRef}>
                <div className={`${cls}-embla-container`}>
                  {testimonials.map((item, idx) => {
                    const stars = Array.from({ length: 5 }).map((_, si) => {
                      const active = si < (item.rating || 5);
                      return (
                        <Icon
                          key={si}
                          icon="solar:star-bold"
                          width="14"
                          className={active ? "" : `${cls}-rating-empty`}
                        />
                      );
                    });

                    return (
                      <div key={item.id || idx} className={`${cls}-embla-slide`}>
                        <div className={`${cls}-card`}>
                          <div className={`${cls}-card-top`}>
                            <p className={`${cls}-quote-text`} style={{ ...bodyTyp }}>
                              {item.quote}
                            </p>
                          </div>

                          <div className={`${cls}-card-bottom`}>
                            {/* Author */}
                            <div className={`${cls}-author-box`}>
                              <div
                                className={`${cls}-avatar-wrap`}
                                onClick={() => {
                                  const vidId = getYouTubeId(item.youtubeUrl);
                                  if (vidId) setActiveVideoId(vidId);
                                }}
                                title={item.youtubeUrl ? "Click to play video" : ""}
                              >
                                {item.avatar ? (
                                  <img
                                    src={item.avatar}
                                    alt={item.authorName}
                                    className={`${cls}-avatar-img`}
                                  />
                                ) : (
                                  <div className={`${cls}-avatar-placeholder`}>
                                    {(item.authorName || "?")[0].toUpperCase()}
                                  </div>
                                )}
                                
                                {/* Play Overlay */}
                                {item.youtubeUrl && (
                                  <div className={`${cls}-play-overlay`}>
                                    <Icon icon="solar:play-bold" width="16" />
                                  </div>
                                )}
                              </div>

                              <div className={`${cls}-author-details`}>
                                <h4 className={`${cls}-author-name`}>
                                  {item.authorName}
                                </h4>
                                <span className={`${cls}-author-role`}>
                                  {item.authorRole}
                                </span>
                                <div className={`${cls}-rating`}>
                                  {stars}
                                </div>
                              </div>
                            </div>

                            {/* Quote icon deco */}
                            <span className={`${cls}-quote-icon`} aria-hidden="true">
                              ”
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dots navigation */}
              {testimonials.length > 1 && (
                <div className={`${cls}-dots`}>
                  {testimonials.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      className={`${cls}-dot ${
                        selectedIndex === dotIdx ? `${cls}-dot-active` : `${cls}-dot-inactive`
                      }`}
                      onClick={() => scrollTo(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side: Accordion */}
        <div className={`${cls}-right`}>
          {accordionTitle && (
            <h2 className={`${cls}-header`} style={{ ...titleTyp }}>
              {accordionTitle}
            </h2>
          )}

          <div className={`${cls}-divider-wrap`}>
            <div className={`${cls}-divider-short`} />
            <div className={`${cls}-divider-long`} />
          </div>

          <div className={`${cls}-accordion-wrap`}>
            {accordions.map((item, idx) => {
              const isOpen = openAccIndex === idx;
              return (
                <div
                  key={item.id || idx}
                  className={`${cls}-acc-item ${isOpen ? `${cls}-acc-item-active` : ""}`}
                >
                  <button
                    className={`${cls}-acc-header`}
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                  >
                    <div className={`${cls}-acc-icon-wrap`}>
                      <Icon icon="solar:alt-arrow-right-bold" width="16" />
                    </div>
                    <span className={`${cls}-acc-title`} style={{ ...accTitleTyp }}>
                      {item.title}
                    </span>
                  </button>

                  <div
                    className={`${cls}-acc-content-wrap`}
                    style={{
                      maxHeight: isOpen ? "300px" : "0px",
                    }}
                  >
                    <div className={`${cls}-acc-content`} style={{ ...bodyTyp }}>
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox YouTube Modal overlay */}
      {activeVideoId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setActiveVideoId(null)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              aspectRatio: "16/9",
              margin: "0 16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              style={{
                position: "absolute",
                top: "-40px",
                right: "0px",
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "30px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setActiveVideoId(null)}
            >
              &times;
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
              title="Testimonial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                borderRadius: "8px",
                boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Element Definition ─────────────────────────────── */
const testimonialsAccordionElement = {
  type: "testimonials-accordion",
  category: "seosight",
  label: "Testimonials & Accordion",
  icon: "solar:widget-3-bold-duotone",

  schema: {
    content: {
      testTitle: "Testimonials",
      testimonials: [
        {
          id: "t1",
          quote: "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim.",
          avatar: "",
          authorName: "Angelina Johnson",
          authorRole: "Codecanyon",
          rating: 4,
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          id: "t2",
          quote: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum investigationes.",
          avatar: "",
          authorName: "Sara Williams",
          authorRole: "Envato",
          rating: 5,
          youtubeUrl: "",
        },
        {
          id: "t3",
          quote: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat vel illum dolore.",
          avatar: "",
          authorName: "Michael Carter",
          authorRole: "Themeforest",
          rating: 5,
          youtubeUrl: "",
        },
      ],
      accordionTitle: "Accordion",
      accordions: [
        {
          id: "a1",
          title: "Qectores Legere Melius",
          content: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum investigationes demonstraverunt.",
        },
        {
          id: "a2",
          title: "Nam Liber Tempor Cum Soluta",
          content: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat vel illum dolore eu feugiat nulla.",
        },
        {
          id: "a3",
          title: "Eodem Modo Quinunc Nobis Videntur",
          content: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
        },
        {
          id: "a4",
          title: "Mirum Quam Littera Gothica",
          content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
        },
      ],
    },

    style: {
      containerBg: "transparent",
      dividerColor: "#3cb878",
      titleColor: "#1d293f",
      textColor: "#5e6e82",

      cardBg: "#ffffff",
      cardFoldColor: "#f4f7f6",
      ratingActiveColor: "#f5a623",
      dotActiveColor: "#3cb878",
      dotInactiveColor: "#eef2f6",

      accHeaderBg: "#ffffff",
      accHeaderActiveBg: "#ffffff",
      accTitleColor: "#1d293f",
      accTitleActiveColor: "#3cb878",
      accContentBg: "#ffffff",
      accBorderColor: "#eef2f5",
      accBorderRadius: 30,

      titleTypography: { fontSize: 32, fontSizeUnit: "px", fontWeight: "700" },
      bodyTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },
      accTitleTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "600" },
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
      section: "Testimonials Settings (Left)",
      controls: [
        {
          name: "testTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Testimonials Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "testimonials",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Slide #${idx + 1}: ${item.authorName || ""}`}>
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

                    <ImageGallery
                      label="Author Avatar"
                      value={item.avatar || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], avatar: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Quote Text"
                      value={item.quote || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], quote: v }; onChange(u);
                      }}
                      rows={3}
                    />

                    <Text
                      label="Author Name"
                      value={item.authorName || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], authorName: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Author Role"
                      value={item.authorRole || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], authorRole: v }; onChange(u);
                      }}
                    />

                    <NumberControl
                      label="Rating Stars (1-5)"
                      value={item.rating ?? 5}
                      onChange={(v: number) => {
                        const u = [...value]; u[idx] = { ...u[idx], rating: Math.min(5, Math.max(1, v)) }; onChange(u);
                      }}
                      min={1}
                      max={5}
                    />

                    <Text
                      label="YouTube Video Link (Adds Video Overlay)"
                      value={item.youtubeUrl || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], youtubeUrl: v }; onChange(u);
                      }}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: TestimonialItem = {
                    id: `t_${Date.now()}`,
                    quote: "Write new testimonial here.",
                    avatar: "",
                    authorName: "New Author",
                    authorRole: "Co-worker",
                    rating: 5,
                    youtubeUrl: "",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Testimonial Slide
              </button>
            </div>
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Accordions Settings (Right)",
      controls: [
        {
          name: "accordionTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Accordion Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "accordions",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Accordion Item #${idx + 1}: ${item.title || ""}`}>
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
                      label="Item Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], title: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Item Content / Description"
                      value={item.content || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], content: v }; onChange(u);
                      }}
                      rows={3}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: AccordionItem = {
                    id: `a_${Date.now()}`,
                    title: "New Question / Title",
                    content: "This is the description text that expands on header click.",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Accordion Item
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Typography & Headers Color",
      controls: [
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Heading Titles Color" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
        {
          name: "textColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Descriptions Text Color" value={value ?? "#5e6e82"} onChange={onChange} />
          ),
        },
        {
          name: "dividerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Divider Accent Lines" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Main Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "bodyTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Body Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Testimonials Appearance",
      controls: [
        {
          name: "cardBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "cardFoldColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Fold Corner Color" value={value ?? "#f4f7f6"} onChange={onChange} />
          ),
        },
        {
          name: "ratingActiveColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Rating Star Active Color" value={value ?? "#f5a623"} onChange={onChange} />
          ),
        },
        {
          name: "dotActiveColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Navigation Dot" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "dotInactiveColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Inactive Navigation Dot" value={value ?? "#eef2f6"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Accordion Appearance",
      controls: [
        {
          name: "accHeaderBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "accContentBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Expanded Content Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "accTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color (Normal)" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
        {
          name: "accTitleActiveColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color (Active)" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
        {
          name: "accBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Border Color" value={value ?? "#eef2f5"} onChange={onChange} />
          ),
        },
        {
          name: "accBorderRadius",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Corner Radius (px)"
              value={value ?? 30}
              onChange={onChange}
              min={0}
              max={50}
              step={2}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "accTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Header Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <TestimonialsAccordionFrontend element={element} />,
};

export default testimonialsAccordionElement;

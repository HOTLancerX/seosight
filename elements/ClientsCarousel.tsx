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
  Url,
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

interface ClientItem {
  id: string;
  image: string;
  alt: string;
  link: { url: string; target: string; nofollow: boolean; customAttributes: string };
}

/* ── Frontend ───────────────────────────────────────── */
function ClientsCarouselFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const title: string = s.content?.title || "Our Valuable Clients";
  const subtitle: string = s.content?.subtitle || "Qui mutationem consuetudium.";
  const items: ClientItem[] = s.content?.items || [];

  // Slide visible options
  const slidesToScroll: number = s.content?.slidesToScroll ?? 1;
  const colsDesktop: number = parseInt(s.content?.colsDesktop || "4");
  const colsTablet: number = parseInt(s.content?.colsTablet || "3");
  const colsMobile: number = parseInt(s.content?.colsMobile || "2");

  // Style
  const containerBg: string = s.style?.containerBg || "transparent";
  const titleColor: string = s.style?.titleColor || "#1d293f";
  const subtitleColor: string = s.style?.subtitleColor || "#5e6e82";
  const dividerColor: string = s.style?.dividerColor || "#3cb878";
  
  const logoOpacity: number = s.style?.logoOpacity ?? 0.6;
  const logoHoverOpacity: number = s.style?.logoHoverOpacity ?? 1;
  const logoHeight: number = s.style?.logoHeight ?? 50;

  const arrowColor: string = s.style?.arrowColor || "#1d293f";
  const arrowHoverColor: string = s.style?.arrowHoverColor || "#3cb878";

  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const subtitleTyp = getTypographyStyles(s.style?.subtitleTypography || {});

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Embla
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: slidesToScroll,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

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
          align-items: center;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
        }
        .${cls}-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 16px 0;
          line-height: 1.25;
        }
        .${cls}-divider-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 20px;
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
          margin: 0 0 48px 0;
          line-height: 1.6;
        }
        /* Embla slider */
        .${cls}-embla {
          overflow: hidden;
          width: 100%;
          margin-bottom: 36px;
        }
        .${cls}-embla-container {
          display: flex;
          align-items: center;
        }
        .${cls}-embla-slide {
          flex: 0 0 ${100 / colsDesktop}%;
          min-width: 0;
          padding: 0 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-embla-slide {
            flex: 0 0 ${100 / colsTablet}%;
          }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-embla-slide {
            flex: 0 0 ${100 / colsMobile}%;
            padding: 0 12px;
          }
          .${cls}-title { font-size: 26px; }
          .${cls}-subtitle { margin-bottom: 32px; }
        }
        .${cls}-logo-link {
          display: block;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: ${logoOpacity};
          text-decoration: none;
        }
        .${cls}-logo-link:hover {
          opacity: ${logoHoverOpacity};
          transform: scale(1.03);
        }
        .${cls}-logo-img {
          display: block;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
        /* Navigation controls */
        .${cls}-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
        }
        .${cls}-arrow {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, color 0.3s ease;
          color: ${arrowColor};
        }
        .${cls}-arrow:hover {
          color: ${arrowHoverColor};
        }
        .${cls}-arrow:active {
          transform: scale(0.95);
        }
        .${cls}-arrow-svg {
          width: 54px;
          height: 16px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}} />

      <div className={`${cls}-container`}>
        {/* Title */}
        {title && (
          <h2
            className={`${cls}-title`}
            style={{ color: titleColor, ...titleTyp }}
          >
            {title}
          </h2>
        )}

        {/* Custom double line divider */}
        <div className={`${cls}-divider-wrap`}>
          <div className={`${cls}-divider-short`} />
          <div className={`${cls}-divider-long`} />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={`${cls}-subtitle`}
            style={{ color: subtitleColor, ...subtitleTyp }}
          >
            {subtitle}
          </p>
        )}

        {/* Slider Carousel */}
        {items.length > 0 && (
          <div className={`${cls}-embla`} ref={emblaRef}>
            <div className={`${cls}-embla-container`}>
              {items.map((item, idx) => {
                const inner = item.image ? (
                  <img
                    src={item.image}
                    alt={item.alt || `Client Logo ${idx + 1}`}
                    className={`${cls}-logo-img`}
                    style={{ height: logoHeight }}
                  />
                ) : (
                  <div
                    style={{
                      height: logoHeight,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 18,
                      fontWeight: 700,
                      color: subtitleColor,
                    }}
                  >
                    {item.alt || `CLIENT ${idx + 1}`}
                  </div>
                );

                return (
                  <div key={item.id || idx} className={`${cls}-embla-slide`}>
                    {item.link?.url ? (
                      <a
                        href={item.link.url}
                        target={item.link.target || "_blank"}
                        rel={item.link.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                        className={`${cls}-logo-link`}
                      >
                        {inner}
                      </a>
                    ) : (
                      <span className={`${cls}-logo-link`}>
                        {inner}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation arrows (Thin lines matching screenshot style) */}
        {items.length > 0 && (
          <div className={`${cls}-nav`}>
            {/* Left Thin Arrow */}
            <button
              className={`${cls}-arrow`}
              onClick={scrollPrev}
              aria-label="Previous Slide"
            >
              <svg className={`${cls}-arrow-svg`} viewBox="0 0 54 16">
                <path d="M53 8H1M8 1L1 8l7 7" />
              </svg>
            </button>

            {/* Right Thin Arrow */}
            <button
              className={`${cls}-arrow`}
              onClick={scrollNext}
              aria-label="Next Slide"
            >
              <svg className={`${cls}-arrow-svg`} viewBox="0 0 54 16">
                <path d="M1 8h52M46 1l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Element Definition ─────────────────────────────── */
const clientsCarouselElement = {
  type: "clients-carousel",
  category: "seosight",
  label: "Clients Carousel",
  icon: "solar:users-group-two-round-bold-duotone",

  schema: {
    content: {
      title: "Our Valuable Clients",
      subtitle: "Qui mutationem consuetudium.",
      slidesToScroll: 1,
      colsDesktop: "4",
      colsTablet: "3",
      colsMobile: "2",
      items: [
        {
          id: "c1",
          image: "",
          alt: "The Barber",
          link: { url: "", target: "_blank", nofollow: false, customAttributes: "" },
        },
        {
          id: "c2",
          image: "",
          alt: "Cafe Royal",
          link: { url: "", target: "_blank", nofollow: false, customAttributes: "" },
        },
        {
          id: "c3",
          image: "",
          alt: "Brian Smith",
          link: { url: "", target: "_blank", nofollow: false, customAttributes: "" },
        },
        {
          id: "c4",
          image: "",
          alt: "H.R. Frank",
          link: { url: "", target: "_blank", nofollow: false, customAttributes: "" },
        },
      ],
    },

    style: {
      containerBg: "transparent",
      titleColor: "#1d293f",
      subtitleColor: "#5e6e82",
      dividerColor: "#3cb878",
      logoOpacity: 0.6,
      logoHoverOpacity: 1,
      logoHeight: 55,
      arrowColor: "#1d293f",
      arrowHoverColor: "#3cb878",
      titleTypography: { fontSize: 32, fontSizeUnit: "px", fontWeight: "700" },
      subtitleTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "400" },
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
            <Textarea label="Subtitle" value={value || ""} onChange={onChange} rows={2} />
          ),
        },
        {
          name: "slidesToScroll",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Slides To Scroll"
              value={value ?? 1}
              onChange={onChange}
              min={1}
              max={4}
              step={1}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Columns Display",
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
              value={value || "3"}
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
      ],
    },

    {
      tab: "Content",
      section: "Client Logos",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Logo #${idx + 1}: ${item.alt || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    </div>

                    <ImageGallery
                      label="Logo Image"
                      value={item.image || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], image: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Alt Text"
                      value={item.alt || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], alt: v }; onChange(u);
                      }}
                    />

                    <Url
                      label="Link URL (optional)"
                      value={item.link || { url: "", target: "_blank", nofollow: false, customAttributes: "" }}
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
                  const newItem: ClientItem = {
                    id: `c_${Date.now()}`,
                    image: "",
                    alt: `Client ${(value?.length || 0) + 1}`,
                    link: { url: "", target: "_blank", nofollow: false, customAttributes: "" },
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Client Logo
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
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
          name: "subtitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Subtitle Color" value={value ?? "#5e6e82"} onChange={onChange} />
          ),
        },
        {
          name: "dividerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Divider Accent Color" value={value ?? "#3cb878"} onChange={onChange} />
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
          name: "subtitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Subtitle Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Logos & Navigation",
      controls: [
        {
          name: "logoHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Logo Max Height (px)"
              value={value ?? 55}
              onChange={onChange}
              min={20}
              max={150}
              step={5}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "logoOpacity",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Logo Opacity"
              value={value ?? 0.6}
              onChange={onChange}
              min={0.1}
              max={1}
              step={0.05}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "logoHoverOpacity",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Logo Hover Opacity"
              value={value ?? 1}
              onChange={onChange}
              min={0.1}
              max={1}
              step={0.05}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "arrowColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Arrow Normal Color" value={value ?? "#1d293f"} onChange={onChange} />
          ),
        },
        {
          name: "arrowHoverColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Arrow Hover Color" value={value ?? "#3cb878"} onChange={onChange} />
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

  render: (element: any) => <ClientsCarouselFrontend element={element} />,
};

export default clientsCarouselElement;

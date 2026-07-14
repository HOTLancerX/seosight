"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Text,
  Textarea,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  ImageGallery,
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

interface TestimonialItem {
  id: string;
  avatar: string;
  quote: string;
  authorName: string;
  authorRole: string;
}

/* ── Embla Dots ─────────────────────────────────────── */
function EmblaCarouselDots({
  count,
  selected,
  onSelect,
  activeColor,
  inactiveColor,
}: {
  count: number;
  selected: number;
  onSelect: (i: number) => void;
  activeColor: string;
  inactiveColor: string;
}) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28 }}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          style={{
            width: i === selected ? 28 : 12,
            height: 12,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            transition: "all 0.35s ease",
            backgroundColor: i === selected ? activeColor : inactiveColor,
            padding: 0,
            outline: "none",
          }}
        />
      ))}
    </div>
  );
}

/* ── Frontend ───────────────────────────────────────── */
function TestimonialsFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  // Content
  const items: TestimonialItem[] = s.content?.items || [];
  const leftTitle: string = s.content?.leftTitle || "Happy Clients About Us";
  const leftSubtitle: string = s.content?.leftSubtitle || "Claritas est etiam processus dynamicus, qui lectorum.";
  const leftSignatureImage: string = s.content?.leftSignatureImage || "";

  // Style
  const leftBg: string = s.style?.leftBg || "#f5a623";
  const leftTitleColor: string = s.style?.leftTitleColor || "#1a1a2e";
  const leftSubtitleColor: string = s.style?.leftSubtitleColor || "#1a1a2e";
  const leftDividerColor: string = s.style?.leftDividerColor || "#1a1a2e";

  const cardBg: string = s.style?.cardBg || "#2a2a3e";
  const quoteColor: string = s.style?.quoteColor || "#ffffff";
  const authorNameColor: string = s.style?.authorNameColor || "#f5a623";
  const authorRoleColor: string = s.style?.authorRoleColor || "#aaaaaa";

  const dotActiveColor: string = s.style?.dotActiveColor || "#f5a623";
  const dotInactiveColor: string = s.style?.dotInactiveColor || "#555";

  const rightBg: string = s.style?.rightBg || "#1a1a2e";

  const leftTitleTyp = getTypographyStyles(s.style?.leftTitleTypography || {});
  const leftSubtitleTyp = getTypographyStyles(s.style?.leftSubtitleTypography || {});
  const quoteTyp = getTypographyStyles(s.style?.quoteTypography || {});
  const authorNameTyp = getTypographyStyles(s.style?.authorNameTypography || {});
  const authorRoleTyp = getTypographyStyles(s.style?.authorRoleTypography || {});

  // Advanced
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Embla
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

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        ...marginStyle,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .${cls}-wrap {
          display: flex;
          box-sizing: border-box;
          overflow: hidden;
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-wrap { flex-direction: column; }
        }
        .${cls}-left {
          flex: 0 0 38%;
          max-width: 38%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          padding: 60px 48px;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-left { flex: 0 0 42%; max-width: 42%; padding: 48px 36px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-left { flex: 0 0 100%; max-width: 100%; padding: 40px 28px; }
        }
        .${cls}-right {
          flex: 1 1 0%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          padding: 60px 48px 60px 40px;
          overflow: hidden;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-right { padding: 48px 28px 48px 24px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-right { padding: 40px 24px 48px; }
        }
        .${cls}-divider {
          width: 40px;
          height: 3px;
          border-radius: 2px;
          margin: 18px 0 22px;
        }
        .${cls}-title {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.18;
          margin: 0;
        }
        .${cls}-subtitle {
          font-size: 15px;
          line-height: 1.65;
          margin: 0 0 24px;
        }
        .${cls}-signature {
          max-width: 140px;
          height: auto;
          margin-top: 8px;
          opacity: 0.85;
        }
        /* Embla Viewport */
        .${cls}-embla-viewport {
          overflow: hidden;
          width: 100%;
        }
        .${cls}-embla-container {
          display: flex;
          gap: 24px;
        }
        .${cls}-embla-slide {
          flex: 0 0 100%;
          min-width: 0;
        }
        /* Card */
        .${cls}-card {
          border-radius: 20px;
          padding: 36px 40px 32px;
          box-sizing: border-box;
          position: relative;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .${cls}-avatar-wrap {
          position: absolute;
          top: -28px;
          left: 32px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid ${leftBg};
          background: #e2e8f0;
          flex-shrink: 0;
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
          background: linear-gradient(135deg, ${leftBg}55, ${leftBg}99);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
        }
        .${cls}-quote-mark {
          font-size: 80px;
          line-height: 0.5;
          opacity: 0.08;
          font-family: Georgia, serif;
          position: absolute;
          right: 28px;
          bottom: 24px;
          user-select: none;
        }
        .${cls}-quote-text {
          font-size: 15px;
          line-height: 1.7;
          margin: 0;
          padding-top: 32px;
        }
        .${cls}-author-name {
          font-size: 14px;
          font-weight: 700;
          margin: 0;
        }
        .${cls}-author-role {
          font-size: 12px;
          margin: 4px 0 0;
        }
        @media (max-width: ${TABLET_MAX}px) {
          .${cls}-card { padding: 32px 28px 28px; }
        }
        @media (max-width: ${MOBILE_MAX}px) {
          .${cls}-card { padding: 28px 22px 24px; }
          .${cls}-title { font-size: 28px; }
        }
      `}} />

      <div className={`${cls}-wrap`}>
        {/* Left Panel */}
        <div
          className={`${cls}-left`}
          style={{ backgroundColor: leftBg, ...paddingStyle }}
        >
          <h2
            className={`${cls}-title`}
            style={{ color: leftTitleColor, ...leftTitleTyp }}
          >
            {leftTitle}
          </h2>

          <div
            className={`${cls}-divider`}
            style={{ backgroundColor: leftDividerColor }}
          />

          {leftSubtitle && (
            <p
              className={`${cls}-subtitle`}
              style={{ color: leftSubtitleColor, ...leftSubtitleTyp }}
            >
              {leftSubtitle}
            </p>
          )}

          {leftSignatureImage && (
            <img
              src={leftSignatureImage}
              alt="Signature"
              className={`${cls}-signature`}
            />
          )}
        </div>

        {/* Right Panel — Embla Carousel */}
        <div
          className={`${cls}-right`}
          style={{ backgroundColor: rightBg }}
        >
          <div
            className={`${cls}-embla-viewport`}
            ref={emblaRef}
            style={{ paddingTop: 36 }}
          >
            <div className={`${cls}-embla-container`}>
              {items.map((item, idx) => (
                <div key={item.id || idx} className={`${cls}-embla-slide`}>
                  <div
                    className={`${cls}-card`}
                    style={{ backgroundColor: cardBg }}
                  >
                    {/* Avatar */}
                    <div className={`${cls}-avatar-wrap`}>
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
                    </div>

                    {/* Quote */}
                    <p
                      className={`${cls}-quote-text`}
                      style={{ color: quoteColor, ...quoteTyp }}
                    >
                      {item.quote}
                    </p>

                    {/* Author */}
                    <div>
                      <p
                        className={`${cls}-author-name`}
                        style={{ color: authorNameColor, ...authorNameTyp }}
                      >
                        {item.authorName}
                      </p>
                      <p
                        className={`${cls}-author-role`}
                        style={{ color: authorRoleColor, ...authorRoleTyp }}
                      >
                        {item.authorRole}
                      </p>
                    </div>

                    {/* Decorative quote mark */}
                    <span
                      className={`${cls}-quote-mark`}
                      style={{ color: quoteColor }}
                      aria-hidden="true"
                    >
                      "
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {items.length > 1 && (
            <EmblaCarouselDots
              count={items.length}
              selected={selectedIndex}
              onSelect={scrollTo}
              activeColor={dotActiveColor}
              inactiveColor={dotInactiveColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Element Definition ─────────────────────────────── */
const testimonialsElement = {
  type: "testimonials",
  category: "seosight",
  label: "Testimonials",
  icon: "solar:chat-square-like-bold-duotone",

  schema: {
    content: {
      leftTitle: "Happy Clients About Us",
      leftSubtitle: "Claritas est etiam processus dynamicus, qui lectorum.",
      leftSignatureImage: "",
      items: [
        {
          id: "t1",
          avatar: "",
          quote: "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim.",
          authorName: "Angelina Johnson",
          authorRole: "Sales Manager",
        },
        {
          id: "t2",
          avatar: "",
          quote: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.",
          authorName: "Michael Carter",
          authorRole: "CEO & Founder",
        },
        {
          id: "t3",
          avatar: "",
          quote: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut.",
          authorName: "Sara Williams",
          authorRole: "Marketing Director",
        },
      ],
    },

    style: {
      leftBg: "#f5a623",
      leftTitleColor: "#1a1a2e",
      leftSubtitleColor: "#1a1a2e",
      leftDividerColor: "#1a1a2e",
      leftTitleTypography: { fontSize: 36, fontSizeUnit: "px", fontWeight: "700" },
      leftSubtitleTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },

      rightBg: "#1a1a2e",
      cardBg: "#2a2a3e",
      quoteColor: "#ffffff",
      quoteTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },
      authorNameColor: "#f5a623",
      authorNameTypography: { fontSize: 14, fontSizeUnit: "px", fontWeight: "700" },
      authorRoleColor: "#888888",
      authorRoleTypography: { fontSize: 12, fontSizeUnit: "px", fontWeight: "400" },

      dotActiveColor: "#f5a623",
      dotInactiveColor: "#444460",
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
      section: "Left Panel",
      controls: [
        {
          name: "leftTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "leftSubtitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Subtitle / Description" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "leftSignatureImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Signature Image (optional)" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Testimonial Items",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Testimonial #${idx + 1}: ${item.authorName || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <ImageGallery
                      label="Avatar Image"
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
                      label="Author Role / Position"
                      value={item.authorRole || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], authorRole: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: TestimonialItem = {
                    id: `t_${Date.now()}`,
                    avatar: "",
                    quote: "Write your testimonial here.",
                    authorName: "Author Name",
                    authorRole: "Position",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Testimonial
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Left Panel Colors",
      controls: [
        {
          name: "leftBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Left Background" value={value ?? "#f5a623"} onChange={onChange} />
          ),
        },
        {
          name: "leftTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color" value={value ?? "#1a1a2e"} onChange={onChange} />
          ),
        },
        {
          name: "leftSubtitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Subtitle Color" value={value ?? "#1a1a2e"} onChange={onChange} />
          ),
        },
        {
          name: "leftDividerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Divider Color" value={value ?? "#1a1a2e"} onChange={onChange} />
          ),
        },
        {
          name: "leftTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "leftSubtitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Subtitle Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Right Panel & Cards",
      controls: [
        {
          name: "rightBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Right Panel Background" value={value ?? "#1a1a2e"} onChange={onChange} />
          ),
        },
        {
          name: "cardBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Background" value={value ?? "#2a2a3e"} onChange={onChange} />
          ),
        },
        {
          name: "quoteColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Quote Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "quoteTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Quote Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "authorNameColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Author Name Color" value={value ?? "#f5a623"} onChange={onChange} />
          ),
        },
        {
          name: "authorNameTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Author Name Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "authorRoleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Author Role Color" value={value ?? "#888888"} onChange={onChange} />
          ),
        },
        {
          name: "authorRoleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Author Role Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Slider Dots",
      controls: [
        {
          name: "dotActiveColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Dot Color" value={value ?? "#f5a623"} onChange={onChange} />
          ),
        },
        {
          name: "dotInactiveColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Inactive Dot Color" value={value ?? "#444460"} onChange={onChange} />
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

  render: (element: any) => <TestimonialsFrontend element={element} />,
};

export default testimonialsElement;

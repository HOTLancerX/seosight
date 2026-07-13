"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "@iconify/react";
import {
    Text,
    Textarea,
    Toggle,
    NumberControl,
    Select,
    ColorPickerPopup,
    Dimensions,
    Section,
    ImageGallery,
} from "@/components/builder/controls";

// ─── Slide layout type ────────────────────────────────────────────────────────
// "image-right"   → content left, image right   (slide 1 green)
// "image-left"    → image left, content right   (slide 2 orange)
// "image-bottom"  → content top-center, image below (slide 3 light)

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function padNum(n: number): string {
    return String(n).padStart(2, "0");
}

// ─── SlideContent ─────────────────────────────────────────────────────────────
function SlideContent({ slide, style }: { slide: any; style: any }) {
    const layout = slide.layout || "image-right";
    const isCenter = layout === "image-bottom";

    const titleColor = slide.titleColor || style.titleColor || "#ffffff";
    const descColor  = slide.descriptionColor || style.descriptionColor || "#ffffff";

    const btn1 = slide.button1 || {};
    const btn2 = slide.button2 || {};

    return (
        <div
            className="flex flex-col gap-4"
            style={{
                alignItems: isCenter ? "center" : "flex-start",
                textAlign:  isCenter ? "center" : "left",
                maxWidth:   isCenter ? "600px" : "100%",
            }}
        >
            {slide.title && (
                <h2
                    className="font-bold leading-tight"
                    style={{ fontSize: "2rem", color: titleColor, margin: 0 }}
                >
                    {slide.title}
                </h2>
            )}
            {slide.description && (
                <p
                    className="leading-relaxed"
                    style={{ fontSize: "1rem", color: descColor, margin: 0, maxWidth: "420px" }}
                >
                    {slide.description}
                </p>
            )}
            {(btn1.label || btn2.label) && (
                <div className="flex flex-wrap gap-3 mt-2">
                    {btn1.label && (
                        <a
                            href={btn1.url || "#"}
                            style={{
                                display: "inline-block",
                                padding: "10px 24px",
                                borderRadius: "9999px",
                                fontSize: "13px",
                                fontWeight: 600,
                                textDecoration: "none",
                                transition: "opacity 0.2s",
                                backgroundColor: btn1.style === "outlined" ? "transparent" : (btn1.color || "#1f2937"),
                                color: btn1.style === "outlined" ? (btn1.color || titleColor) : (btn1.textColor || "#ffffff"),
                                border: `2px solid ${btn1.style === "outlined" ? (btn1.color || titleColor) : "transparent"}`,
                            }}
                        >
                            {btn1.label}
                        </a>
                    )}
                    {btn2.label && (
                        <a
                            href={btn2.url || "#"}
                            style={{
                                display: "inline-block",
                                padding: "10px 24px",
                                borderRadius: "9999px",
                                fontSize: "13px",
                                fontWeight: 600,
                                textDecoration: "none",
                                transition: "opacity 0.2s",
                                backgroundColor: btn2.style === "outlined" ? "transparent" : (btn2.color || "#1f2937"),
                                color: btn2.style === "outlined" ? (btn2.color || titleColor) : (btn2.textColor || "#ffffff"),
                                border: `2px solid ${btn2.style === "outlined" ? (btn2.color || titleColor) : "transparent"}`,
                            }}
                        >
                            {btn2.label}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── SlideImage ───────────────────────────────────────────────────────────────
function SlideImage({ slide }: { slide: any }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            {slide.image ? (
                <img
                    src={slide.image}
                    alt={slide.title || ""}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "240px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                    }}
                >
                    <Icon icon="mdi:image-outline" width={64} style={{ opacity: 0.4, color: "#fff" }} />
                </div>
            )}
        </div>
    );
}

// ─── SingleSlide ──────────────────────────────────────────────────────────────
function SingleSlide({ slide, style, slideHeight, slidePadding }: { slide: any; style: any; slideHeight: number; slidePadding: number }) {
    const layout = slide.layout || "image-right";
    const bg = slide.backgroundColor || style.slideBackgroundColor || "#4cb87e";
    const p = slidePadding || 0;
    const baseH = `${slideHeight}px`;
    const innerPad = `${60 + p}px ${0 + p}px`;

    return (
        <div
            style={{
                backgroundColor: bg,
                width: "100%",
                height: baseH,
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {layout === "image-bottom" ? (
                <div className="container gap-6" style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", padding: innerPad }}>
                    <SlideContent slide={slide} style={style} />
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
                        <SlideImage slide={slide} />
                    </div>
                </div>
            ) : layout === "image-left" ? (
                <div className="container" style={{ display: "flex", alignItems: "center", height: "100%", padding: innerPad }}>
                    <div style={{ flex: "0 0 50%", height: "100%", display: "flex", alignItems: "center" }}>
                        <SlideImage slide={slide} />
                    </div>
                    <div style={{ flex: "0 0 50%", paddingLeft: "40px" }}>
                        <SlideContent slide={slide} style={style} />
                    </div>
                </div>
            ) : (
                <div className="container" style={{ display: "flex", alignItems: "center", height: "100%", padding: innerPad }}>
                    <div style={{ flex: "0 0 50%", paddingRight: "40px" }}>
                        <SlideContent slide={slide} style={style} />
                    </div>
                    <div style={{ flex: "0 0 50%", height: "100%", display: "flex", alignItems: "center" }}>
                        <SlideImage slide={slide} />
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── SliderFrontend ───────────────────────────────────────────────────────────
function SliderFrontend({ element }: { element: any }) {
    const s = element.schema;
    const slides: any[] = s.content?.slides || [];
    const settings = s.settings || {};
    const style    = s.style    || {};

    const autoplay           = settings.autoplay !== false;
    const scrollSpeed        = settings.scrollSpeed || 5000;
    const infiniteScroll     = settings.infiniteScroll !== false;
    const pauseOnHover       = settings.pauseOnHover !== false;
    const transitionDuration = settings.transitionDuration || 500;
    const slowSlide          = settings.slowSlide === true;
    const showArrows         = settings.showArrows !== false;
    const slideHeight        = settings.slideHeight || 480;
    const tabHeight          = settings.tabHeight || 80;
    const slideGap           = settings.slideGap ?? 0;
    const slidePadding       = settings.slidePadding ?? 0;

    // loop is a static Embla option — key forces remount when it changes
    const emblaKey = infiniteScroll ? "loop" : "no-loop";

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop:     infiniteScroll,
        align:    "start",
        duration: slowSlide ? 80 : transitionDuration,
        dragFree: slowSlide,
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canPrev, setCanPrev]   = useState(false);
    const [canNext, setCanNext]   = useState(true);
    const [isAutoPlay, setIsAuto] = useState(autoplay);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanPrev(emblaApi.canScrollPrev());
        setCanNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    const onInit = useCallback(() => { if (emblaApi) onSelect(); }, [emblaApi, onSelect]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("init", onInit);
        emblaApi.on("reInit", onInit);
        emblaApi.on("select", onSelect);
        emblaApi.on("pointerDown", () => setIsAuto(false));
        return () => {
            emblaApi.off("init", onInit);
            emblaApi.off("reInit", onInit);
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onInit, onSelect]);

    const scrollPrev = useCallback(() => { emblaApi?.scrollPrev(); setIsAuto(false); }, [emblaApi]);
    const scrollNext = useCallback(() => { emblaApi?.scrollNext(); setIsAuto(false); }, [emblaApi]);
    const scrollTo   = useCallback((i: number) => { emblaApi?.scrollTo(i); setIsAuto(false); }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi || !isAutoPlay || !autoplay) return;
        const t = setInterval(() => emblaApi.scrollNext(), scrollSpeed);
        return () => clearInterval(t);
    }, [emblaApi, isAutoPlay, autoplay, scrollSpeed]);

    const arrowColor = style.arrowColor || "rgba(255,255,255,0.85)";

    return (
        <div
            style={{ width: "100%", position: "relative", userSelect: "none" }}
            onMouseEnter={() => pauseOnHover && setIsAuto(false)}
            onMouseLeave={() => pauseOnHover && setIsAuto(autoplay)}
        >
            {/* ── Slide track ── */}
            <div style={{ position: "relative" }}>
                <div key={emblaKey} ref={emblaRef} style={{ overflow: "hidden" }}>
                    <div style={{ display: "flex", gap: `${slideGap}px` }}>
                        {slides.map((slide) => (
                            <SingleSlide
                                key={slide.id}
                                slide={slide}
                                style={style}
                                slideHeight={slideHeight}
                                slidePadding={slidePadding}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Prev arrow ── */}
                {showArrows && (
                    <button
                        type="button"
                        onClick={scrollPrev}
                        disabled={!canPrev && !infiniteScroll}
                        style={{
                            position: "absolute", left: "16px", top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: arrowColor, opacity: (!canPrev && !infiniteScroll) ? 0.3 : 1,
                            padding: "8px", lineHeight: 1, zIndex: 10,
                        }}
                    >
                        <Icon icon="mdi:arrow-left" width={28} />
                    </button>
                )}

                {/* ── Next arrow ── */}
                {showArrows && (
                    <button
                        type="button"
                        onClick={scrollNext}
                        disabled={!canNext && !infiniteScroll}
                        style={{
                            position: "absolute", right: "16px", top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: arrowColor, opacity: (!canNext && !infiniteScroll) ? 0.3 : 1,
                            padding: "8px", lineHeight: 1, zIndex: 10,
                        }}
                    >
                        <Icon icon="mdi:arrow-right" width={28} />
                    </button>
                )}
            </div>

            {/* ── Bottom tab bar ── */}
            <div style={{ display: "flex", width: "100%" }}>
                {slides.map((slide, idx) => {
                    const isActive  = idx === selectedIndex;
                    const tabBg     = slide.tabColor || style.tabColor || "#4cb87e";
                    const activeBg  = tabBg;
                    const inactiveBg = hexToRgba(tabBg.startsWith("#") ? tabBg : "#888888", 0.45);
                    const tabTextColor = slide.tabTextColor || style.tabTextColor || "#ffffff";

                    return (
                        <button
                            key={slide.id}
                            type="button"
                            onClick={() => scrollTo(idx)}
                            style={{
                                flex: "1 1 0",
                                height: `${tabHeight}px`,
                                background: isActive ? activeBg : inactiveBg,
                                border: "none",
                                cursor: "pointer",
                                padding: "0 16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                                transition: "background 0.3s",
                                textAlign: "left",
                                overflow: "hidden",
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        color: tabTextColor,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {slide.title || `Slide ${idx + 1}`}
                                </div>
                                {slide.tabSubtitle && (
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: tabTextColor,
                                            opacity: 0.8,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            marginTop: "2px",
                                        }}
                                    >
                                        {slide.tabSubtitle}
                                    </div>
                                )}
                            </div>
                            <div
                                style={{
                                    fontSize: "28px",
                                    fontWeight: 800,
                                    color: tabTextColor,
                                    opacity: 0.4,
                                    lineHeight: 1,
                                    flexShrink: 0,
                                }}
                            >
                                {padNum(idx + 1)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Element Definition ───────────────────────────────────────────────────────
const sliderElement = {
    type:     "seosight-slider",
    category: "Slider",
    label:    "Hero Slider",
    icon:     "solar:carousel-bold",

    schema: {
        content: {
            slides: [
                {
                    id: "slide_1",
                    layout: "image-right",
                    backgroundColor: "#4cb87e",
                    title: "Pay Per Click (PPC) Management",
                    description: "Pay Per Click has an instant impact and gives your brand a much larger reach and exposure as a result of first page exposure on major search engines.",
                    titleColor: "#ffffff",
                    descriptionColor: "#ffffff",
                    image: "",
                    tabColor: "#4cb87e",
                    tabTextColor: "#ffffff",
                    tabSubtitle: "",
                    button1: { label: "LEARN MORE", url: "#", style: "filled",   color: "#1f2937", textColor: "#ffffff" },
                    button2: { label: "GET STARTED", url: "#", style: "outlined", color: "#ffffff", textColor: "#ffffff" },
                },
                {
                    id: "slide_2",
                    layout: "image-right",
                    backgroundColor: "#4cb87e",
                    title: "Local SEO",
                    description: "Mirum est notare quam littera.",
                    titleColor: "#ffffff",
                    descriptionColor: "#ffffff",
                    image: "",
                    tabColor: "#5bc8d0",
                    tabTextColor: "#ffffff",
                    tabSubtitle: "Mirum est notare quam littera.",
                    button1: { label: "LEARN MORE", url: "#", style: "filled",   color: "#1f2937", textColor: "#ffffff" },
                    button2: { label: "GET STARTED", url: "#", style: "outlined", color: "#ffffff", textColor: "#ffffff" },
                },
                {
                    id: "slide_3",
                    layout: "image-bottom",
                    backgroundColor: "#f0f4f5",
                    title: "Search Engine Optimization!",
                    description: "Discover More About Our SEO Expertise!",
                    titleColor: "#2d3748",
                    descriptionColor: "#4a5568",
                    image: "",
                    tabColor: "#f0623a",
                    tabTextColor: "#ffffff",
                    tabSubtitle: "",
                    button1: { label: "LEARN MORE", url: "#", style: "filled",   color: "#1f2937", textColor: "#ffffff" },
                    button2: { label: "",            url: "",  style: "outlined", color: "#ffffff", textColor: "#ffffff" },
                },
                {
                    id: "slide_4",
                    layout: "image-left",
                    backgroundColor: "#f0623a",
                    title: "Social Media Marketing Services",
                    description: "An effective social strategy can help you grow your business, maintain your social presence and engage with the audience.",
                    titleColor: "#ffffff",
                    descriptionColor: "#ffffff",
                    image: "",
                    tabColor: "#f5a623",
                    tabTextColor: "#ffffff",
                    tabSubtitle: "",
                    button1: { label: "LEARN MORE", url: "#", style: "filled",   color: "#1f2937", textColor: "#ffffff" },
                    button2: { label: "GET STARTED", url: "#", style: "outlined", color: "#ffffff", textColor: "#ffffff" },
                },
                {
                    id: "slide_5",
                    layout: "image-right",
                    backgroundColor: "#4cb87e",
                    title: "Pay Per Click Management",
                    description: "",
                    titleColor: "#ffffff",
                    descriptionColor: "#ffffff",
                    image: "",
                    tabColor: "#3a9e8f",
                    tabTextColor: "#ffffff",
                    tabSubtitle: "",
                    button1: { label: "LEARN MORE", url: "#", style: "filled",   color: "#1f2937", textColor: "#ffffff" },
                    button2: { label: "GET STARTED", url: "#", style: "outlined", color: "#ffffff", textColor: "#ffffff" },
                },
            ],
        },

        settings: {
            autoplay:           true,
            scrollSpeed:        5000,
            pauseOnHover:       true,
            infiniteScroll:     true,
            slowSlide:          false,
            transitionDuration: 500,
            showArrows:         true,
            slideHeight:        480,
            tabHeight:          80,
            slideGap:           0,
            slidePadding:       0,
        },

        style: {
            arrowColor:          "rgba(255,255,255,0.85)",
            titleColor:          "#ffffff",
            descriptionColor:    "#ffffff",
            slideBackgroundColor:"#4cb87e",
            tabColor:            "#4cb87e",
            tabTextColor:        "#ffffff",
        },

        advanced: {
            margin:  { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
            padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
        },
    },

    controls: [
        // ══════════════════════════════════════════ CONTENT TAB ══════
        {
            tab:      "Content",
            section:  "Slides",
            controls: [
                {
                    name:       "slides",
                    responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Slides" defaultOpen>
                            <div className="space-y-3">
                                {(value || []).map((slide: any, idx: number) => (
                                    <Section key={slide.id} label={`Slide #${idx + 1}`}>
                                        <div className="space-y-2 pt-1">
                                            {/* Remove */}
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => onChange(value.filter((_: any, i: number) => i !== idx))}
                                                    className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                                                >
                                                    Remove slide
                                                </button>
                                            </div>

                                            {/* Layout */}
                                            <Select
                                                label="Image Position"
                                                value={slide.layout || "image-right"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], layout: v }; onChange(u);
                                                }}
                                                options={[
                                                    { value: "image-right",  label: "Image Right" },
                                                    { value: "image-left",   label: "Image Left" },
                                                    { value: "image-bottom", label: "Image Bottom (centered)" },
                                                ]}
                                            />

                                            {/* Background */}
                                            <ColorPickerPopup
                                                label="Slide Background"
                                                value={slide.backgroundColor || "#4cb87e"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], backgroundColor: v }; onChange(u);
                                                }}
                                            />

                                            {/* Image */}
                                            <ImageGallery
                                                label="Image"
                                                value={slide.image || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], image: v }; onChange(u);
                                                }}
                                            />

                                            {/* Title */}
                                            <Text
                                                label="Title"
                                                value={slide.title || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], title: v }; onChange(u);
                                                }}
                                            />
                                            <ColorPickerPopup
                                                label="Title Color"
                                                value={slide.titleColor || "#ffffff"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], titleColor: v }; onChange(u);
                                                }}
                                            />

                                            {/* Description */}
                                            <Textarea
                                                label="Description"
                                                value={slide.description || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], description: v }; onChange(u);
                                                }}
                                            />
                                            <ColorPickerPopup
                                                label="Description Color"
                                                value={slide.descriptionColor || "#ffffff"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], descriptionColor: v }; onChange(u);
                                                }}
                                            />
                                        </div>
                                    </Section>
                                ))}

                                {/* Buttons per slide */}
                                {(value || []).map((slide: any, idx: number) => (
                                    <Section key={`btn-${slide.id}`} label={`Slide #${idx + 1} — Buttons`}>
                                        <div className="space-y-2 pt-1">
                                            {/* Button 1 */}
                                            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Button 1</p>
                                            <Text label="Label" value={slide.button1?.label || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button1: { ...u[idx].button1, label: v } }; onChange(u);
                                                }} />
                                            <Text label="URL" value={slide.button1?.url || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button1: { ...u[idx].button1, url: v } }; onChange(u);
                                                }} />
                                            <Select label="Style" value={slide.button1?.style || "filled"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button1: { ...u[idx].button1, style: v } }; onChange(u);
                                                }}
                                                options={[{ value: "filled", label: "Filled" }, { value: "outlined", label: "Outlined" }]}
                                            />
                                            <ColorPickerPopup label="Button Color" value={slide.button1?.color || "#1f2937"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button1: { ...u[idx].button1, color: v } }; onChange(u);
                                                }} />
                                            <ColorPickerPopup label="Text Color" value={slide.button1?.textColor || "#ffffff"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button1: { ...u[idx].button1, textColor: v } }; onChange(u);
                                                }} />

                                            {/* Button 2 */}
                                            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mt-2">Button 2</p>
                                            <Text label="Label" value={slide.button2?.label || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button2: { ...u[idx].button2, label: v } }; onChange(u);
                                                }} />
                                            <Text label="URL" value={slide.button2?.url || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button2: { ...u[idx].button2, url: v } }; onChange(u);
                                                }} />
                                            <Select label="Style" value={slide.button2?.style || "outlined"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button2: { ...u[idx].button2, style: v } }; onChange(u);
                                                }}
                                                options={[{ value: "filled", label: "Filled" }, { value: "outlined", label: "Outlined" }]}
                                            />
                                            <ColorPickerPopup label="Button Color" value={slide.button2?.color || "#ffffff"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button2: { ...u[idx].button2, color: v } }; onChange(u);
                                                }} />
                                            <ColorPickerPopup label="Text Color" value={slide.button2?.textColor || "#ffffff"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], button2: { ...u[idx].button2, textColor: v } }; onChange(u);
                                                }} />
                                        </div>
                                    </Section>
                                ))}

                                {/* Tab bar per slide */}
                                {(value || []).map((slide: any, idx: number) => (
                                    <Section key={`tab-${slide.id}`} label={`Slide #${idx + 1} — Tab`}>
                                        <div className="space-y-2 pt-1">
                                            <ColorPickerPopup label="Tab Color" value={slide.tabColor || "#4cb87e"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], tabColor: v }; onChange(u);
                                                }} />
                                            <ColorPickerPopup label="Tab Text Color" value={slide.tabTextColor || "#ffffff"}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], tabTextColor: v }; onChange(u);
                                                }} />
                                            <Text label="Tab Subtitle" value={slide.tabSubtitle || ""}
                                                onChange={(v: string) => {
                                                    const u = [...value]; u[idx] = { ...u[idx], tabSubtitle: v }; onChange(u);
                                                }} />
                                        </div>
                                    </Section>
                                ))}

                                {/* Add slide */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newSlide = {
                                            id: `slide_${Date.now()}`,
                                            layout: "image-right",
                                            backgroundColor: "#4cb87e",
                                            title: `Slide #${(value?.length || 0) + 1}`,
                                            description: "",
                                            titleColor: "#ffffff",
                                            descriptionColor: "#ffffff",
                                            image: "",
                                            tabColor: "#4cb87e",
                                            tabTextColor: "#ffffff",
                                            tabSubtitle: "",
                                            button1: { label: "LEARN MORE",  url: "#", style: "filled",   color: "#1f2937", textColor: "#ffffff" },
                                            button2: { label: "GET STARTED", url: "#", style: "outlined", color: "#ffffff", textColor: "#ffffff" },
                                        };
                                        onChange([...(value || []), newSlide]);
                                    }}
                                    className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
                                >
                                    + Add Slide
                                </button>
                            </div>
                        </Section>
                    ),
                },
            ],
        },

        // ══════════════════════════════════════════ SETTINGS TAB ═════
        {
            tab:      "Content",
            section:  "Settings",
            controls: [
                {
                    name: "autoplay", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Playback">
                            <Toggle value={value} onChange={onChange} label="Autoplay" />
                            <p className="text-[11px] text-gray-400 mt-1">Inactive while editing — preview to test.</p>
                        </Section>
                    ),
                },
                {
                    name: "scrollSpeed", responsive: false,
                    render: (value: any, onChange: any) => (
                        <NumberControl value={value} onChange={onChange} label="Scroll Speed (ms)"
                            min={1000} max={10000} step={500} showSlider={false} grid={2} />
                    ),
                },
                {
                    name: "pauseOnHover", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Toggle value={value} onChange={onChange} label="Pause on Hover" />
                    ),
                },
                {
                    name: "infiniteScroll", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Toggle value={value} onChange={onChange} label="Infinite Scroll (Loop)" />
                    ),
                },
                {
                    name: "slowSlide", responsive: false,
                    render: (value: any, onChange: any) => (
                        <div>
                            <Toggle value={value} onChange={onChange} label="Slow Slide" />
                            <p className="text-[11px] text-gray-400 mt-1">Enables smooth drag-free slow scrolling.</p>
                        </div>
                    ),
                },
                {
                    name: "transitionDuration", responsive: false,
                    render: (value: any, onChange: any) => (
                        <NumberControl value={value} onChange={onChange} label="Transition (ms)"
                            min={100} max={2000} step={50} showSlider={false} grid={2} />
                    ),
                },
                {
                    name: "slideGap", responsive: false,
                    render: (value: any, onChange: any) => (
                        <NumberControl value={value} onChange={onChange} label="Gap Between Slides (px)"
                            min={0} max={100} step={2} showSlider grid={2} />
                    ),
                },
                {
                    name: "slidePadding", responsive: false,
                    render: (value: any, onChange: any) => (
                        <NumberControl value={value} onChange={onChange} label="Slide Inner Padding (px)"
                            min={0} max={120} step={4} showSlider grid={2} />
                    ),
                },
                {
                    name: "showArrows", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Toggle value={value} onChange={onChange} label="Show Arrows" />
                    ),
                },
                {
                    name: "slideHeight", responsive: false,
                    render: (value: any, onChange: any) => (
                        <NumberControl value={value} onChange={onChange} label="Slide Height (px)"
                            min={200} max={900} step={10} showSlider grid={2} />
                    ),
                },
                {
                    name: "tabHeight", responsive: false,
                    render: (value: any, onChange: any) => (
                        <NumberControl value={value} onChange={onChange} label="Tab Bar Height (px)"
                            min={40} max={160} step={4} showSlider grid={2} />
                    ),
                },
            ],
        },

        // ══════════════════════════════════════════ STYLE TAB ════════
        {
            tab:      "Style",
            section:  "Global Defaults",
            controls: [
                {
                    name: "arrowColor", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Arrows" defaultOpen>
                            <ColorPickerPopup label="Arrow Color" value={value ?? "rgba(255,255,255,0.85)"} onChange={onChange} />
                        </Section>
                    ),
                },
                {
                    name: "slideBackgroundColor", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Default Slide Background">
                            <ColorPickerPopup label="Background" value={value ?? "#4cb87e"} onChange={onChange} />
                        </Section>
                    ),
                },
                {
                    name: "titleColor", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Default Title Color">
                            <ColorPickerPopup label="Color" value={value ?? "#ffffff"} onChange={onChange} />
                        </Section>
                    ),
                },
                {
                    name: "descriptionColor", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Default Description Color">
                            <ColorPickerPopup label="Color" value={value ?? "#ffffff"} onChange={onChange} />
                        </Section>
                    ),
                },
                {
                    name: "tabColor", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Default Tab Color">
                            <ColorPickerPopup label="Color" value={value ?? "#4cb87e"} onChange={onChange} />
                        </Section>
                    ),
                },
                {
                    name: "tabTextColor", responsive: false,
                    render: (value: any, onChange: any) => (
                        <Section label="Default Tab Text Color">
                            <ColorPickerPopup label="Color" value={value ?? "#ffffff"} onChange={onChange} />
                        </Section>
                    ),
                },
            ],
        },

        // ══════════════════════════════════════════ ADVANCED TAB ═════
        {
            tab:      "Advanced",
            section:  "Spacing",
            controls: [
                {
                    name: "margin", responsive: true,
                    render: (value: any, onChange: any) => (
                        <Dimensions type="margin" value={value} onChange={onChange} />
                    ),
                },
                {
                    name: "padding", responsive: true,
                    render: (value: any, onChange: any) => (
                        <Dimensions type="padding" value={value} onChange={onChange} />
                    ),
                },
            ],
        },
    ],

    render: (element: any) => <SliderFrontend element={element} />,
};

export default sliderElement;

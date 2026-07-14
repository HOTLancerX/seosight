"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  Url,
  NumberControl,
  Select,
  ColorPickerPopup,
  Dimensions,
  ImageGallery,
  Typography,
  Section,
  Toggle,
  IconPicker,
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

interface FeatureItem {
  id: string;
  text: string;
  bold: boolean;
  strikethrough: boolean;
}

interface PricingPlan {
  id: string;
  image: string;
  useIcon: boolean;
  icon: string;
  iconColor: string;
  circleBg: string;
  planName: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  features: FeatureItem[];
  currency: string;
  price: string;
  period: string;
  priceColor: string;
  btnLabel: string;
  btnLink: { url: string; target: string; nofollow: boolean; customAttributes: string };
  btnBg: string;
  btnTextColor: string;
  btnHoverBg: string;
  btnHoverTextColor: string;
  cardBg: string;
  borderColor: string;
  featured: boolean;
}

/* ── Frontend ───────────────────────────────────────────────────── */
function PricingCardsFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cls = `bel-${element.id}`;

  const plans: PricingPlan[] = s.content?.plans || [];

  // Grid
  const colsDesktop: number = parseInt(s.content?.colsDesktop || "3");
  const colsTablet: number = parseInt(s.content?.colsTablet || "2");
  const colsMobile: number = parseInt(s.content?.colsMobile || "1");
  const gap: number = s.style?.gap ?? 30;

  // Global styles
  const containerBg: string = s.style?.containerBg || "transparent";
  const defaultCardBg: string = s.style?.defaultCardBg || "#ffffff";
  const defaultBorderColor: string = s.style?.defaultBorderColor || "#e5e7eb";
  const defaultPriceColor: string = s.style?.defaultPriceColor || "#3cb878";
  const planNameColor: string = s.style?.planNameColor || "#1a1a2e";
  const featureColor: string = s.style?.featureColor || "#4b5563";
  const circleSize: number = s.style?.circleSize ?? 90;

  const planNameTyp = getTypographyStyles(s.style?.planNameTypography || {});
  const priceTyp = getTypographyStyles(s.style?.priceTypography || {});
  const featureTyp = getTypographyStyles(s.style?.featureTypography || {});

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
        backgroundColor: containerBg,
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
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
            gap: ${Math.round(gap * 0.75)}px;
          }
        }
        .${cls}-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 16px;
          padding: 40px 32px 36px;
          box-sizing: border-box;
          border-width: 2px;
          border-style: solid;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }
        .${cls}-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
        }
        .${cls}-circle {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .${cls}-plan-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .${cls}-plan-name {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        .${cls}-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          line-height: 1.6;
        }
        .${cls}-features {
          list-style: none;
          margin: 0 0 28px;
          padding: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .${cls}-feature-item {
          font-size: 14px;
          line-height: 1.5;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .${cls}-feature-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .${cls}-price {
          font-size: 38px;
          font-weight: 700;
          line-height: 1;
          margin: 0 0 8px;
          letter-spacing: -1px;
        }
        .${cls}-period {
          font-size: 12px;
          opacity: 0.6;
          margin-bottom: 28px;
          letter-spacing: 0.5px;
        }
        .${cls}-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 14px 28px;
          border-radius: 40px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
          transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
        }
        .${cls}-btn:hover {
          transform: translateY(-2px);
        }
      `}} />

      <div className={`${cls}-grid`}>
        {plans.map((plan, idx) => {
          const cardBg = plan.cardBg || defaultCardBg;
          const borderColor = plan.borderColor || defaultBorderColor;
          const priceColor = plan.priceColor || defaultPriceColor;
          const btnBg = plan.btnBg || "#3cb878";
          const btnTextColor = plan.btnTextColor || "#ffffff";
          const btnHoverBg = plan.btnHoverBg || "#2ea86a";
          const btnHoverTextColor = plan.btnHoverTextColor || "#ffffff";

          return (
            <div
              key={plan.id || idx}
              className={`${cls}-card`}
              style={{
                backgroundColor: cardBg,
                borderColor: borderColor,
              }}
            >
              {/* Icon / Image Circle */}
              <div
                className={`${cls}-circle`}
                style={{
                  width: circleSize,
                  height: circleSize,
                  backgroundColor: plan.circleBg || "#edf9f4",
                }}
              >
                {plan.useIcon ? (
                  <Icon
                    icon={plan.icon || "mdi:rocket-launch-outline"}
                    width={Math.round(circleSize * 0.52)}
                    style={{ color: plan.iconColor || "#3cb878" }}
                  />
                ) : plan.image ? (
                  <img
                    src={plan.image}
                    alt={plan.planName}
                    style={{
                      width: "70%",
                      height: "70%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <Icon
                    icon="mdi:rocket-launch-outline"
                    width={Math.round(circleSize * 0.52)}
                    style={{ color: plan.iconColor || "#3cb878" }}
                  />
                )}
              </div>

              {/* Plan name + badge */}
              <div className={`${cls}-plan-row`}>
                <h3
                  className={`${cls}-plan-name`}
                  style={{ color: planNameColor, ...planNameTyp }}
                >
                  {plan.planName || "Plan"}
                </h3>
                {plan.badge && (
                  <span
                    className={`${cls}-badge`}
                    style={{
                      backgroundColor: plan.badgeBg || "#3cb878",
                      color: plan.badgeColor || "#ffffff",
                    }}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Features list */}
              <ul className={`${cls}-features`}>
                {(plan.features || []).map((feat, fi) => (
                  <li
                    key={feat.id || fi}
                    className={`${cls}-feature-item`}
                    style={{
                      color: featureColor,
                      fontWeight: feat.bold ? "700" : "400",
                      textDecoration: feat.strikethrough ? "line-through" : "none",
                      opacity: feat.strikethrough ? 0.45 : 1,
                      ...featureTyp,
                    }}
                  >
                    {feat.text}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div
                className={`${cls}-price`}
                style={{ color: priceColor, ...priceTyp }}
              >
                {plan.currency || "$"}{plan.price || "0"}
              </div>
              {plan.period && (
                <div
                  className={`${cls}-period`}
                  style={{ color: featureColor }}
                >
                  {plan.period}
                </div>
              )}

              {/* CTA Button */}
              <a
                className={`${cls}-btn`}
                href={plan.btnLink?.url || "#"}
                target={plan.btnLink?.target || "_self"}
                rel={plan.btnLink?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                style={{ backgroundColor: btnBg, color: btnTextColor }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = btnHoverBg;
                  (e.currentTarget as HTMLAnchorElement).style.color = btnHoverTextColor;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = btnBg;
                  (e.currentTarget as HTMLAnchorElement).style.color = btnTextColor;
                }}
              >
                {plan.btnLabel || "Purchase"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Element Definition ─────────────────────────────────────────── */
const pricingCardsElement = {
  type: "pricing-cards",
  category: "seosight",
  label: "Pricing Cards",
  icon: "solar:tag-price-bold-duotone",

  schema: {
    content: {
      colsDesktop: "3",
      colsTablet: "2",
      colsMobile: "1",
      plans: [
        {
          id: "plan_1",
          image: "",
          useIcon: true,
          icon: "mdi:rocket-launch-outline",
          iconColor: "#3cb878",
          circleBg: "#edf9f4",
          planName: "Basic",
          badge: "",
          badgeBg: "#3cb878",
          badgeColor: "#ffffff",
          features: [
            { id: "f1", text: "3 Analytics Campaigns", bold: false, strikethrough: false },
            { id: "f2", text: "150 Keywords", bold: false, strikethrough: false },
            { id: "f3", text: "100,000 Crawled Pages", bold: true, strikethrough: false },
            { id: "f4", text: "-", bold: false, strikethrough: false },
            { id: "f5", text: "5 Social Accounts", bold: false, strikethrough: false },
          ],
          currency: "$",
          price: "29.99",
          period: "/ month",
          priceColor: "#3cb878",
          btnLabel: "Purchase",
          btnUrl: "#",
          btnTarget: "_self",
          btnBg: "#3cb878",
          btnTextColor: "#ffffff",
          btnHoverBg: "#2ea86a",
          btnHoverTextColor: "#ffffff",
          cardBg: "#ffffff",
          borderColor: "#e5e7eb",
          featured: false,
        },
        {
          id: "plan_2",
          image: "",
          useIcon: true,
          icon: "mdi:airship",
          iconColor: "#3cb878",
          circleBg: "#edf9f4",
          planName: "Personal",
          badge: "POPULAR",
          badgeBg: "#3cb878",
          badgeColor: "#ffffff",
          features: [
            { id: "f1", text: "5 Analytics Campaigns", bold: false, strikethrough: false },
            { id: "f2", text: "300 Keywords", bold: false, strikethrough: false },
            { id: "f3", text: "250,000 Crawled Pages", bold: true, strikethrough: false },
            { id: "f4", text: "-", bold: false, strikethrough: false },
            { id: "f5", text: "15 Social Accounts", bold: false, strikethrough: false },
          ],
          currency: "$",
          price: "49.99",
          period: "/ month",
          priceColor: "#3cb878",
          btnLabel: "Purchase",
          btnUrl: "#",
          btnTarget: "_self",
          btnBg: "#3cb878",
          btnTextColor: "#ffffff",
          btnHoverBg: "#2ea86a",
          btnHoverTextColor: "#ffffff",
          cardBg: "#ffffff",
          borderColor: "#e5e7eb",
          featured: true,
        },
        {
          id: "plan_3",
          image: "",
          useIcon: true,
          icon: "mdi:crown-outline",
          iconColor: "#3cb878",
          circleBg: "#edf9f4",
          planName: "Business",
          badge: "",
          badgeBg: "#3cb878",
          badgeColor: "#ffffff",
          features: [
            { id: "f1", text: "10 Analytics Campaigns", bold: false, strikethrough: false },
            { id: "f2", text: "900 Keywords", bold: false, strikethrough: false },
            { id: "f3", text: "1,000,000 Crawled Pages", bold: true, strikethrough: false },
            { id: "f4", text: "Competitors Analysis", bold: false, strikethrough: false },
            { id: "f5", text: "30 Social Accounts", bold: false, strikethrough: false },
          ],
          currency: "$",
          price: "99.99",
          period: "/ month",
          priceColor: "#3cb878",
          btnLabel: "Purchase",
          btnUrl: "#",
          btnTarget: "_self",
          btnBg: "#3cb878",
          btnTextColor: "#ffffff",
          btnHoverBg: "#2ea86a",
          btnHoverTextColor: "#ffffff",
          cardBg: "#ffffff",
          borderColor: "#e5e7eb",
          featured: false,
        },
      ],
    },

    style: {
      gap: 30,
      containerBg: "transparent",
      defaultCardBg: "#ffffff",
      defaultBorderColor: "#e5e7eb",
      defaultPriceColor: "#3cb878",
      planNameColor: "#1a1a2e",
      featureColor: "#4b5563",
      circleSize: 90,
      planNameTypography: { fontSize: 22, fontSizeUnit: "px", fontWeight: "700" },
      priceTypography: { fontSize: 38, fontSizeUnit: "px", fontWeight: "700" },
      featureTypography: { fontSize: 14, fontSizeUnit: "px", fontWeight: "400" },
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
      section: "Grid Columns",
      controls: [
        {
          name: "colsDesktop",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Columns (Desktop)"
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
      section: "Pricing Plans",
      controls: [
        {
          name: "plans",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((plan: any, idx: number) => (
                <Section key={plan.id || idx} label={`Plan #${idx + 1}: ${plan.planName || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Plan
                      </button>
                    </div>

                    <Text
                      label="Plan Name"
                      value={plan.planName || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], planName: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Badge Text (e.g. POPULAR)"
                      value={plan.badge || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], badge: v }; onChange(u);
                      }}
                    />

                    <Section label="Icon / Image">
                      <div className="space-y-2 pt-1">
                        <Toggle
                          label="Use Icon (instead of image)"
                          value={plan.useIcon ?? true}
                          onChange={(v: boolean) => {
                            const u = [...value]; u[idx] = { ...u[idx], useIcon: v }; onChange(u);
                          }}
                        />
                        {plan.useIcon ? (
                          <>
                            <IconPicker
                              label="Icon"
                              value={plan.icon || ""}
                              onChange={(v: string) => {
                                const u = [...value]; u[idx] = { ...u[idx], icon: v }; onChange(u);
                              }}
                            />
                            <ColorPickerPopup
                              label="Icon Color"
                              value={plan.iconColor || "#3cb878"}
                              onChange={(v: string) => {
                                const u = [...value]; u[idx] = { ...u[idx], iconColor: v }; onChange(u);
                              }}
                            />
                          </>
                        ) : (
                          <ImageGallery
                            label="Plan Image"
                            value={plan.image || ""}
                            onChange={(v: string) => {
                              const u = [...value]; u[idx] = { ...u[idx], image: v }; onChange(u);
                            }}
                          />
                        )}
                        <ColorPickerPopup
                          label="Circle Background"
                          value={plan.circleBg || "#edf9f4"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], circleBg: v }; onChange(u);
                          }}
                        />
                      </div>
                    </Section>

                    <Section label="Pricing">
                      <div className="space-y-2 pt-1">
                        <Text
                          label="Currency Symbol"
                          value={plan.currency || "$"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], currency: v }; onChange(u);
                          }}
                        />
                        <Text
                          label="Price"
                          value={plan.price || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], price: v }; onChange(u);
                          }}
                        />
                        <Text
                          label="Period (e.g. / month)"
                          value={plan.period || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], period: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Price Color"
                          value={plan.priceColor || "#3cb878"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], priceColor: v }; onChange(u);
                          }}
                        />
                      </div>
                    </Section>

                    <Section label="Features List">
                      <div className="space-y-2 pt-1">
                        {(plan.features || []).map((feat: any, fi: number) => (
                          <Section key={feat.id || fi} label={`Feature #${fi + 1}`}>
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const u = [...value];
                                    u[idx] = {
                                      ...u[idx],
                                      features: (u[idx].features || []).filter((_: any, fj: number) => fj !== fi),
                                    };
                                    onChange(u);
                                  }}
                                  className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                              <Text
                                label="Feature Text"
                                value={feat.text || ""}
                                onChange={(v: string) => {
                                  const u = [...value];
                                  const feats = [...(u[idx].features || [])];
                                  feats[fi] = { ...feats[fi], text: v };
                                  u[idx] = { ...u[idx], features: feats };
                                  onChange(u);
                                }}
                              />
                              <Toggle
                                label="Bold"
                                value={feat.bold ?? false}
                                onChange={(v: boolean) => {
                                  const u = [...value];
                                  const feats = [...(u[idx].features || [])];
                                  feats[fi] = { ...feats[fi], bold: v };
                                  u[idx] = { ...u[idx], features: feats };
                                  onChange(u);
                                }}
                              />
                              <Toggle
                                label="Strikethrough"
                                value={feat.strikethrough ?? false}
                                onChange={(v: boolean) => {
                                  const u = [...value];
                                  const feats = [...(u[idx].features || [])];
                                  feats[fi] = { ...feats[fi], strikethrough: v };
                                  u[idx] = { ...u[idx], features: feats };
                                  onChange(u);
                                }}
                              />
                            </div>
                          </Section>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const u = [...value];
                            const newFeat = { id: `f_${Date.now()}`, text: "New Feature", bold: false, strikethrough: false };
                            u[idx] = { ...u[idx], features: [...(u[idx].features || []), newFeat] };
                            onChange(u);
                          }}
                          className="w-full flex items-center justify-center gap-1 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-[12px] font-medium cursor-pointer transition-colors"
                        >
                          + Add Feature
                        </button>
                      </div>
                    </Section>

                    <Section label="Button">
                      <div className="space-y-2 pt-1">
                        <Text
                          label="Button Label"
                          value={plan.btnLabel || "Purchase"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btnLabel: v }; onChange(u);
                          }}
                        />
                        <Url
                          label="Button URL"
                          value={plan.btnLink || { url: plan.btnUrl || "#", target: plan.btnTarget || "", nofollow: false, customAttributes: "" }}
                          onChange={(v: any) => {
                            const u = [...value]; u[idx] = { ...u[idx], btnLink: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Button Background"
                          value={plan.btnBg || "#3cb878"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btnBg: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Button Text Color"
                          value={plan.btnTextColor || "#ffffff"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btnTextColor: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Button Hover Background"
                          value={plan.btnHoverBg || "#2ea86a"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btnHoverBg: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Button Hover Text Color"
                          value={plan.btnHoverTextColor || "#ffffff"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btnHoverTextColor: v }; onChange(u);
                          }}
                        />
                      </div>
                    </Section>

                    <Section label="Card Appearance">
                      <div className="space-y-2 pt-1">
                        <ColorPickerPopup
                          label="Card Background"
                          value={plan.cardBg || "#ffffff"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], cardBg: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Border Color"
                          value={plan.borderColor || "#e5e7eb"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], borderColor: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Badge Background"
                          value={plan.badgeBg || "#3cb878"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], badgeBg: v }; onChange(u);
                          }}
                        />
                        <ColorPickerPopup
                          label="Badge Text Color"
                          value={plan.badgeColor || "#ffffff"}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], badgeColor: v }; onChange(u);
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
                  const newPlan: PricingPlan = {
                    id: `plan_${Date.now()}`,
                    image: "",
                    useIcon: true,
                    icon: "mdi:star-outline",
                    iconColor: "#3cb878",
                    circleBg: "#edf9f4",
                    planName: `Plan ${(value?.length || 0) + 1}`,
                    badge: "",
                    badgeBg: "#3cb878",
                    badgeColor: "#ffffff",
                    features: [
                      { id: "f1", text: "Feature One", bold: false, strikethrough: false },
                      { id: "f2", text: "Feature Two", bold: false, strikethrough: false },
                    ],
                    currency: "$",
                    price: "0",
                    period: "/ month",
                    priceColor: "#3cb878",
                    btnLabel: "Purchase",
                    btnLink: { url: "#", target: "", nofollow: false, customAttributes: "" },
                    btnBg: "#3cb878",
                    btnTextColor: "#ffffff",
                    btnHoverBg: "#2ea86a",
                    btnHoverTextColor: "#ffffff",
                    cardBg: "#ffffff",
                    borderColor: "#e5e7eb",
                    featured: false,
                  };
                  onChange([...(value || []), newPlan]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Pricing Plan
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Layout",
      controls: [
        {
          name: "gap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Gap (px)"
              value={value ?? 30}
              onChange={onChange}
              min={0}
              max={100}
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
        {
          name: "circleSize",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Icon Circle Size (px)"
              value={value ?? 90}
              onChange={onChange}
              min={50}
              max={180}
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
      section: "Card Defaults",
      controls: [
        {
          name: "defaultCardBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Default Card Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "defaultBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Default Border Color" value={value ?? "#e5e7eb"} onChange={onChange} />
          ),
        },
        {
          name: "planNameColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Plan Name Color" value={value ?? "#1a1a2e"} onChange={onChange} />
          ),
        },
        {
          name: "featureColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Feature Text Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "defaultPriceColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Default Price Color" value={value ?? "#3cb878"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography",
      controls: [
        {
          name: "planNameTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Plan Name Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "priceTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Price Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "featureTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Feature Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <PricingCardsFrontend element={element} />,
};

export default pricingCardsElement;

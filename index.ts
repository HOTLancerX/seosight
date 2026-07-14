/**
 * plugin/seosight/index.ts — SeoSight Slider plugin.
 *
 * Provides a hero slider element with:
 *   - Image on the left side
 *   - Content (title, description) on the right
 *   - Auto-rotating slides with highlighted active box
 *   - Uses embla-carousel for smooth transitions
 */

import { addBuilderElement, type PluginMeta } from "@/hook";
import sliderElement from "./elements/Slider";
import featuresGridElement from "./elements/FeaturesGrid";
import contentSplitElement from "./elements/ContentSplit";
import buttonsGroupElement from "./elements/ButtonsGroup";
import videoSectionElement from "./elements/VideoSection";
import seoPackagesElement from "./elements/SeoPackages";
import countersElement from "./elements/Counters";
import caseStudiesElement from "./elements/CaseStudies";
import testimonialsElement from "./elements/Testimonials";
import pricingCardsElement from "./elements/PricingCards";
import clientsCarouselElement from "./elements/ClientsCarousel";
import footerElement from "./elements/Footer";
import skillBarsElement from "./elements/SkillBars";
import testimonialsAccordionElement from "./elements/TestimonialsAccordion";
import professionalToolsElement from "./elements/ProfessionalTools";
import timelineElement from "./elements/Timeline";
import servicesSliderElement from "./elements/ServicesSlider";

export const PLUGINS: PluginMeta = {
    nx:          "com.system.seosight",
    name:        "seosight",
    version:     "1.0.0",
    description: "Hero slider with image and content boxes.",
    author:      "SeoSight",
    path:        "https://github.com/HOTLancerX/seosight.git",
    icon:        "streamline-ultimate-color:seo-search-graph",
    color:       "from-blue-500 to-indigo-600",
};

export function register() {
    addBuilderElement(sliderElement, PLUGINS.nx);
    addBuilderElement(featuresGridElement, PLUGINS.nx);
    addBuilderElement(contentSplitElement, PLUGINS.nx);
    addBuilderElement(buttonsGroupElement, PLUGINS.nx);
    addBuilderElement(videoSectionElement, PLUGINS.nx);
    addBuilderElement(seoPackagesElement, PLUGINS.nx);
    addBuilderElement(countersElement, PLUGINS.nx);
    addBuilderElement(caseStudiesElement, PLUGINS.nx);
    addBuilderElement(testimonialsElement, PLUGINS.nx);
    addBuilderElement(pricingCardsElement, PLUGINS.nx);
    addBuilderElement(clientsCarouselElement, PLUGINS.nx);
    addBuilderElement(footerElement, PLUGINS.nx);
    addBuilderElement(skillBarsElement, PLUGINS.nx);
    addBuilderElement(testimonialsAccordionElement, PLUGINS.nx);
    addBuilderElement(professionalToolsElement, PLUGINS.nx);
    addBuilderElement(timelineElement, PLUGINS.nx);
    addBuilderElement(servicesSliderElement, PLUGINS.nx);
}

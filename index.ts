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
}

import type { ComponentType } from "react";
import type { LayoutId } from "@/hooks/useLayout";
import Console from "@/layouts/Console";
import Bento from "@/layouts/Bento";

/** Maps each layout id to the component that renders it. */
export const LAYOUT_COMPONENTS: Record<LayoutId, ComponentType> = {
  console: Console,
  bento: Bento,
};

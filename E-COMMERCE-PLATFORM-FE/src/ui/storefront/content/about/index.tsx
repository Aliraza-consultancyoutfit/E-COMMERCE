"use client";

import AboutTemplate from "@/ui/storefront/content/templates/about-template";
import {
  ABOUT_TITLE,
  ABOUT_INTRO,
  ABOUT_STATS,
  ABOUT_VALUES,
} from "@/ui/storefront/content/content.data";

export default function About() {
  return (
    <AboutTemplate
      title={ABOUT_TITLE}
      intro={ABOUT_INTRO}
      stats={ABOUT_STATS}
      values={ABOUT_VALUES}
    />
  );
}

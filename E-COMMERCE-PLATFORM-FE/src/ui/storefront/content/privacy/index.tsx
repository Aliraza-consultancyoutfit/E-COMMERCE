"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { PRIVACY_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Privacy() {
  return <ArticleTemplate {...PRIVACY_ARTICLE} />;
}

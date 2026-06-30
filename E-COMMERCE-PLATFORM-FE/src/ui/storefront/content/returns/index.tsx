"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { RETURNS_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Returns() {
  return <ArticleTemplate {...RETURNS_ARTICLE} />;
}

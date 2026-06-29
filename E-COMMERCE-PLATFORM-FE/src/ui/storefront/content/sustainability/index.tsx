"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { SUSTAINABILITY_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Sustainability() {
  return <ArticleTemplate {...SUSTAINABILITY_ARTICLE} />;
}

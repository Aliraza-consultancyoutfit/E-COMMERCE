"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { PRESS_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Press() {
  return <ArticleTemplate {...PRESS_ARTICLE} />;
}

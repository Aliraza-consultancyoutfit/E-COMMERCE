"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { TERMS_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Terms() {
  return <ArticleTemplate {...TERMS_ARTICLE} />;
}

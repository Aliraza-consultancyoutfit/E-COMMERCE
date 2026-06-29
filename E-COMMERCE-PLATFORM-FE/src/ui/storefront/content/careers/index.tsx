"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { CAREERS_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Careers() {
  return <ArticleTemplate {...CAREERS_ARTICLE} />;
}

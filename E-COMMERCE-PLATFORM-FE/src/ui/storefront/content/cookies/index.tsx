"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { COOKIES_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Cookies() {
  return <ArticleTemplate {...COOKIES_ARTICLE} />;
}

"use client";

import ArticleTemplate from "@/ui/storefront/content/templates/article-template";
import { SHIPPING_ARTICLE } from "@/ui/storefront/content/content.data";

export default function Shipping() {
  return <ArticleTemplate {...SHIPPING_ARTICLE} />;
}

import { ShieldIcon, TrendIcon, StarIcon, PhoneIcon } from "@/assets/icons/common";
import { IArticleTemplateProps } from "./templates/article-template/article-template.interface";
import {
  IAboutStat,
  IAboutValue,
} from "./templates/about-template/about-template.interface";

const LEGAL_EYEBROW = "Legal";
const LEGAL_UPDATED = "Last updated June 2026";

export const ABOUT_TITLE = "Building commerce people trust";
export const ABOUT_INTRO =
  "EliteCart is a curated electronics store built on a simple idea: great products, fair prices, and support that actually helps. We obsess over the details so shopping feels effortless.";

export const ABOUT_STATS: IAboutStat[] = [
  { number: "8,540+", label: "Happy customers" },
  { number: "64", label: "Curated products" },
  { number: "4.8★", label: "Avg rating" },
  { number: "30-day", label: "Easy returns" },
];

export const ABOUT_VALUES: IAboutValue[] = [
  {
    Icon: ShieldIcon,
    heading: "Quality first",
    paragraph:
      "Every product is hand-picked and tested. If it isn't something we'd use ourselves, it doesn't make the catalog.",
  },
  {
    Icon: TrendIcon,
    heading: "Fair pricing",
    paragraph:
      "No inflated list prices or fake discounts. We price transparently and pass savings straight to you.",
  },
  {
    Icon: StarIcon,
    heading: "Sustainable",
    paragraph:
      "Recyclable packaging, carbon-aware shipping, and partners who share our commitment to doing better.",
  },
  {
    Icon: PhoneIcon,
    heading: "Real support",
    paragraph:
      "Talk to real people, seven days a week. We're here before, during, and long after your purchase.",
  },
];

export const CAREERS_ARTICLE: IArticleTemplateProps = {
  eyebrow: "Careers",
  title: "Build the future of retail with us",
  intro:
    "We're a small, senior team that ships fast and cares deeply about the customer experience. If that sounds like you, we'd love to talk.",
  sections: [
    {
      heading: "Why EliteCart",
      paragraph:
        "We move quickly without the bureaucracy. Everyone here owns meaningful work, sees its impact, and has a real say in where the product goes next.",
    },
    {
      heading: "How we work",
      paragraph:
        "Remote-friendly, async by default, and outcome-driven. We trust people to manage their own time and judge work by what it delivers, not hours logged.",
    },
    {
      heading: "Benefits",
      paragraph:
        "Competitive pay and equity, generous paid time off, a learning budget, top-tier hardware, and an employee discount on everything we sell.",
    },
    {
      heading: "Open roles",
      paragraph:
        "We're hiring across engineering, design, and customer experience. Don't see your exact role? Reach out anyway — we make room for great people.",
    },
  ],
};

export const PRESS_ARTICLE: IArticleTemplateProps = {
  eyebrow: "Press",
  title: "Press & media",
  intro:
    "Resources for journalists, partners, and creators covering EliteCart. For interviews or assets, get in touch with our communications team.",
  sections: [
    {
      heading: "About the company",
      paragraph:
        "EliteCart is a curated electronics retailer focused on premium audio, computing, and smart home gear, serving thousands of customers with fair pricing and standout service.",
    },
    {
      heading: "Media inquiries",
      paragraph:
        "For interviews, quotes, or background, email press@elitecart.com. We aim to respond to all media requests within one business day.",
    },
    {
      heading: "Brand assets",
      paragraph:
        "Logos, product imagery, and brand guidelines are available on request. Please use approved assets only and follow the spacing and color rules in the kit.",
    },
  ],
};

export const SUSTAINABILITY_ARTICLE: IArticleTemplateProps = {
  eyebrow: "Sustainability",
  title: "Commerce that respects the planet",
  intro:
    "Doing right by our customers means doing right by the world they live in. Here's how we're reducing our footprint, step by step.",
  sections: [
    {
      heading: "Responsible packaging",
      paragraph:
        "We've moved to recyclable and right-sized packaging across our catalog, cutting plastic and shipping volume without compromising protection.",
    },
    {
      heading: "Lower-impact shipping",
      paragraph:
        "We consolidate shipments where we can and partner with carriers offering carbon-aware delivery options to keep transport emissions down.",
    },
    {
      heading: "Built to last",
      paragraph:
        "We favor durable, repairable products and provide clear care guidance so the things you buy stay useful for longer and out of landfills.",
    },
    {
      heading: "Always improving",
      paragraph:
        "Sustainability is a journey, not a checkbox. We review our practices regularly and share honest progress rather than greenwashed promises.",
    },
  ],
};

export const SHIPPING_ARTICLE: IArticleTemplateProps = {
  eyebrow: "Support",
  title: "Shipping information",
  intro:
    "Everything you need to know about how, when, and where your order ships.",
  sections: [
    {
      heading: "Processing times",
      paragraph:
        "Most in-stock orders are processed within one business day. You'll get an email with tracking as soon as your package leaves our warehouse.",
    },
    {
      heading: "Delivery estimates",
      paragraph:
        "Standard delivery typically arrives in 3–5 business days. Expedited options are available at checkout for faster delivery where eligible.",
    },
    {
      heading: "Free shipping",
      paragraph:
        "Orders over $100 ship free. For orders below that threshold, a flat shipping rate is calculated and shown clearly before you pay.",
    },
    {
      heading: "Tracking your order",
      paragraph:
        "Track any order in real time from the Orders page in your account, or from the tracking link in your shipping confirmation email.",
    },
  ],
};

export const RETURNS_ARTICLE: IArticleTemplateProps = {
  eyebrow: "Support",
  title: "Returns & refunds",
  intro:
    "Changed your mind? No problem. Our 30-day return policy is designed to be simple and fair.",
  sections: [
    {
      heading: "30-day window",
      paragraph:
        "You can return most items within 30 days of delivery. Products should be in their original condition and packaging where possible.",
    },
    {
      heading: "How to start a return",
      paragraph:
        "Open the Orders page in your account, select the order, and choose the items you'd like to return. We'll generate a prepaid label for eligible returns.",
    },
    {
      heading: "Refund timing",
      paragraph:
        "Once we receive and inspect your return, refunds are issued to your original payment method, typically within 5–7 business days.",
    },
    {
      heading: "Exceptions",
      paragraph:
        "A few items — such as opened consumables or final-sale products — can't be returned. Any exceptions are clearly noted on the product page.",
    },
  ],
};

export const PRIVACY_ARTICLE: IArticleTemplateProps = {
  eyebrow: LEGAL_EYEBROW,
  title: "Privacy policy",
  lastUpdated: LEGAL_UPDATED,
  intro:
    "Your privacy matters to us. This policy explains what data we collect, why we collect it, and the choices you have.",
  sections: [
    {
      heading: "Information we collect",
      paragraph:
        "We collect the details you give us — like your name, email, and shipping address — along with order history and basic usage data needed to run the store.",
    },
    {
      heading: "How we use your data",
      paragraph:
        "We use your information to process orders, provide support, prevent fraud, and improve the experience. We never sell your personal data to third parties.",
    },
    {
      heading: "Your rights",
      paragraph:
        "You can access, correct, or delete your personal data at any time from your account, or by contacting support. We'll honor verified requests promptly.",
    },
    {
      heading: "Data security",
      paragraph:
        "We use encryption in transit and at rest, restrict internal access, and follow industry best practices to keep your information protected.",
    },
  ],
};

export const TERMS_ARTICLE: IArticleTemplateProps = {
  eyebrow: LEGAL_EYEBROW,
  title: "Terms of service",
  lastUpdated: LEGAL_UPDATED,
  intro:
    "These terms govern your use of EliteCart. By using our store, you agree to the conditions outlined below.",
  sections: [
    {
      heading: "Using our store",
      paragraph:
        "You agree to use EliteCart lawfully and not to misuse the platform, interfere with its operation, or attempt to access accounts that aren't yours.",
    },
    {
      heading: "Orders & pricing",
      paragraph:
        "All orders are subject to availability and acceptance. Prices and promotions may change, and we reserve the right to correct errors and cancel affected orders.",
    },
    {
      heading: "Accounts",
      paragraph:
        "You're responsible for keeping your account credentials secure and for activity under your account. Notify us right away if you suspect unauthorized use.",
    },
    {
      heading: "Limitation of liability",
      paragraph:
        "EliteCart is provided on an \"as is\" basis. To the extent permitted by law, we are not liable for indirect or consequential damages arising from its use.",
    },
  ],
};

export const COOKIES_ARTICLE: IArticleTemplateProps = {
  eyebrow: LEGAL_EYEBROW,
  title: "Cookie policy",
  lastUpdated: LEGAL_UPDATED,
  intro:
    "This policy explains how we use cookies and similar technologies to keep EliteCart working and to improve your experience.",
  sections: [
    {
      heading: "What cookies are",
      paragraph:
        "Cookies are small files stored on your device that help websites remember your preferences, keep you signed in, and understand how the site is used.",
    },
    {
      heading: "How we use them",
      paragraph:
        "We use essential cookies to run core features like your cart and session, plus optional analytics cookies to understand and improve the experience.",
    },
    {
      heading: "Managing cookies",
      paragraph:
        "You can control or delete cookies through your browser settings. Disabling essential cookies may affect features like staying signed in or checking out.",
    },
  ],
};

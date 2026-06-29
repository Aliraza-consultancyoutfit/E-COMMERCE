export interface IArticleSection {
  heading: string;
  paragraph: string;
}

export interface IArticleTemplateProps {
  eyebrow: string;
  title: string;
  intro: string;
  /** Optional "Last updated …" note shown under the title (legal pages). */
  lastUpdated?: string;
  sections: IArticleSection[];
}

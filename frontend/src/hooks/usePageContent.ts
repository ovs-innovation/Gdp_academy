import { useEffect, useState } from "react";
import { getPageContentBySlug } from "../services/cmsService";

export type PageContentFields = Record<string, string | string[] | unknown>;

/** Load published page content by slug from CMS (MongoDB). */
export function usePageContent(slug: string) {
  const [content, setContent] = useState<PageContentFields>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    getPageContentBySlug(slug)
      .then((page) => {
        if (mounted) setContent(page?.content || {});
      })
      .catch(() => {
        if (mounted) setContent({});
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  return { content, loaded };
}

/** Split hero title: before + gradient highlight */
export function renderSplitHeroTitle(
  content: PageContentFields,
  defaults: { before: string; highlight: string },
) {
  return {
    before: (content.heroTitleBefore as string) || defaults.before,
    highlight: (content.heroTitleHighlight as string) || defaults.highlight,
  };
}

/** Three-line hero (Programs / Services style) */
export function renderMultiLineHeroTitle(
  content: PageContentFields,
  defaults: [string, string, string],
) {
  return [
    (content.heroTitleLine1 as string) || defaults[0],
    (content.heroTitleLine2 as string) || defaults[1],
    (content.heroTitleLine3 as string) || defaults[2],
  ] as const;
}

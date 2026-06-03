import { Helmet } from 'react-helmet-async';
import { buildShareUrl } from '../utils/share';

const DEFAULT_DESCRIPTION =
  'Garima Dance Productions (GDP) — premium dance training, workshops, live Zoom classes, and performance programs in Ghaziabad and online.';

interface SEOProps {
  pageTitle: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string;
  image?: string;
}

const SEO = ({
  pageTitle,
  description = DEFAULT_DESCRIPTION,
  path = '',
  noIndex = false,
  keywords,
  image = '/logo.png',
}: SEOProps) => {
  const fullTitle = pageTitle.includes('GDP') ? pageTitle : `${pageTitle} | GDP — Garima Dance Productions`;
  const canonical = buildShareUrl(path);
  const imageUrl = image.startsWith('http') ? image : buildShareUrl(image);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Garima Dance Productions" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SEO;

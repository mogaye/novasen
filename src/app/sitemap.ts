import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novasen.sn';

  const routes = [
    '',
    '/accueil',
    '/marche',
    '/transport',
    '/livraison',
    '/tarifs',
    '/publier',
    '/vendeur',
    '/livreur',
    '/contact',
    '/compte',
    '/connexion',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/marche' || route === '/transport' ? 'hourly' : 'daily',
    priority: route === '' || route === '/accueil' ? 1.0 : 0.8,
  }));
}

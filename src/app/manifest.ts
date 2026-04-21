import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Formo — Matemaatika tahvel',
    short_name: 'Formo',
    description: 'Kiire visuaalne tahvel matemaatika õpetajatele',
    start_url: '/app',
    display: 'standalone',
    orientation: 'any',
    background_color: '#fafaf5',
    theme_color: '#8fb569',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

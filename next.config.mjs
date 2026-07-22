/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/project',
        destination: '/properties',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'a.tile.openstreetmap.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'b.tile.openstreetmap.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'c.tile.openstreetmap.org',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;

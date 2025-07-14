/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/media/**',
        },
        {
          protocol: 'https',
          hostname: 'your-backend-domain.com', // заменишь на домен Render или другого хоста
          pathname: '/media/**',
        },
      ],
    },
  
    async rewrites() {
      return [
        {
          source: '/dashboard',
          destination: '/protected/dashboard',
        },
        {
          source: '/store',
          destination: '/protected/store',
        },
        {
          source: '/courses',
          destination: '/protected/courses',
        },
      ];
    },
  };
  
  export default nextConfig;
  
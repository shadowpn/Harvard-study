/** @type {import('next').NextConfig} */
const nextConfig = {
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
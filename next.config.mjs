/** @type {import('next').NextConfig} */
const staticContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://groq.com https://*.groq.com https://api.groq.com https://*.vercel-storage.com wss://*.vercel.com",
  "img-src 'self' data: https://*.vercel-storage.com",
  "font-src 'self'",
  "worker-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/diagnosis/big-five",
        destination: "/diagnosis/play/big-five",
        permanent: true,
      },
      {
        source: "/diagnosis/enneagram",
        destination: "/diagnosis/play/motivation-spectrum",
        permanent: true,
      },
      {
        source: "/rubel",
        destination: "/",
        permanent: true,
      },
      {
        source: "/assessment",
        destination: "/diagnosis/play/personality-spectrum",
        permanent: true,
      },
      {
        source: "/diagnosis/legacy",
        destination: "/diagnosis/play/personality-spectrum",
        permanent: true,
      },
      {
        source: "/diagnosis/v2/big-five",
        destination: "/diagnosis/play/big-five",
        permanent: true,
      },
      {
        source: "/diagnosis/v2/enneagram",
        destination: "/diagnosis/play/motivation-spectrum",
        permanent: true,
      },
      {
        source: "/diagnosis/v2/assessment",
        destination: "/diagnosis/play/personality-spectrum",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/play/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: staticContentSecurityPolicy,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

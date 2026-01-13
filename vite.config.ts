import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "0.0.0.0", // Change from :: to 0.0.0.0
    port: 5173,
    https: false,
    headers: {
      "Cross-Origin-Embedder-Policy": "credentialless",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    proxy: {
      // Place specific rule BEFORE the general '/api' rule so it isn't shadowed
      '/api/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => '/health',
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('🔧 [PROXY] API Health proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔧 [PROXY] API Health check request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('🔧 [PROXY] API Health check response:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('🔧 [PROXY] Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔧 [PROXY] Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('🔧 [PROXY] Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('🔧 [PROXY] Health proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔧 [PROXY] Health check request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('🔧 [PROXY] Health check response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['@zxing/browser'],
  },
}));

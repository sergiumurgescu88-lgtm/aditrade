import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import http from 'http';
import { defineConfig, Plugin } from 'vite';

// Middleware plugin to proxy /api requests to Python backend at 127.0.0.1:5000 with graceful fallback
function pythonBackendGatewayPlugin(): Plugin {
  return {
    name: 'python-backend-gateway',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        const serveFallback = () => {
          if (res.headersSent) return;
          res.setHeader('Content-Type', 'application/json');

          if (req.url?.startsWith('/api/bots/status')) {
            res.writeHead(200);
            res.end(JSON.stringify([
              { id: 'alpha', name: 'ALPHA', status: 'LIVE', latency: 11, memory: 142.8, cpu: 1.2, route: 'DIRECT' },
              { id: 'beta', name: 'BETA', status: 'LIVE', latency: 13, memory: 138.4, cpu: 0.9, route: 'DIRECT' },
              { id: 'gamma', name: 'GAMMA', status: 'LIVE', latency: 7, memory: 156.1, cpu: 2.1, route: 'DIRECT' },
              { id: 'epsilon', name: 'EPSILON', status: 'LIVE', latency: 12, memory: 145.0, cpu: 1.4, route: 'DIRECT' },
              { id: 'sergiu', name: 'SERGIU', status: 'LIVE', latency: 10, memory: 162.7, cpu: 1.8, route: 'DIRECT' },
              { id: 'zeus', name: 'ZEUS', status: 'GATEWAY', latency: 22, memory: 184.2, cpu: 0.6, route: 'GATEWAY' },
              { id: 'ares', name: 'ARES', status: 'GATEWAY', latency: 20, memory: 178.5, cpu: 0.8, route: 'GATEWAY' },
              { id: 'hermes', name: 'HERMES', status: 'GATEWAY', latency: 24, memory: 181.9, cpu: 0.7, route: 'GATEWAY' },
              { id: 'chronos', name: 'CHRONOS', status: 'VETO', latency: 5, memory: 92.4, cpu: 0.3, route: 'CIRCUIT BREAKER' },
              { id: 'hades', name: 'HADES', status: 'VETO', latency: 8, memory: 104.1, cpu: 0.4, route: 'CIRCUIT BREAKER' },
            ]));
            return;
          }

          if (req.url?.startsWith('/api/logs')) {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'standby', logs: [] }));
            return;
          }

          res.writeHead(200);
          res.end(JSON.stringify({ status: 'standby', message: 'Backend service in standby mode' }));
        };

        // Try forwarding to local Python backend at 127.0.0.1:5000
        const proxyReq = http.request(
          {
            hostname: '127.0.0.1',
            port: 5000,
            path: req.url,
            method: req.method,
            headers: {
              ...req.headers,
              host: '127.0.0.1:5000',
            },
            timeout: 500,
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
            proxyRes.pipe(res);
          }
        );

        proxyReq.on('timeout', () => {
          proxyReq.destroy();
          serveFallback();
        });

        proxyReq.on('error', () => {
          // Port 5000 is offline; serve fallback response cleanly without logging ECONNREFUSED
          serveFallback();
        });

        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          req.pipe(proxyReq);
        } else {
          proxyReq.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), pythonBackendGatewayPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo local (npm run dev) Vite hace de proxy hacia la API,
// igual que Nginx en el contenedor: el navegador nunca sale del mismo origen.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': process.env.VITE_API_PROXY || 'http://localhost:3000' },
  },
});

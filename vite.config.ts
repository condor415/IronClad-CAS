import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' ensures we load all variables, not just VITE_*
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // CRITICAL FIX: Look for env.VITE_API_KEY (from your Vercel setup)
      // and map it to process.env.API_KEY (what the Google SDK expects).
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || process.env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
    },
  };
});
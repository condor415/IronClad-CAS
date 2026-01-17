import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // ROBUST KEY FETCHING STRATEGY:
  // We prioritize VITE_API_KEY as it is the standard for Vite applications.
  // We also check API_KEY as a fallback.
  const apiKey = env.VITE_API_KEY || process.env.VITE_API_KEY || env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // This allows us to use process.env.API_KEY in our code, 
      // even if the variable in Vercel is named VITE_API_KEY
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});
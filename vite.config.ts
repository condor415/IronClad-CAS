import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' ensures we load all variables, not just VITE_*
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // CRITICAL FIX: Check all possible sources for the key.
      // 1. process.env.VITE_API_KEY (Vercel System Env)
      // 2. env.VITE_API_KEY (Loaded from .env file)
      // 3. env.API_KEY (Legacy .env)
      // 4. process.env.API_KEY (System Env)
      'process.env.API_KEY': JSON.stringify(
        process.env.VITE_API_KEY || 
        env.VITE_API_KEY || 
        env.API_KEY || 
        process.env.API_KEY || 
        ''
      )
    },
    build: {
      outDir: 'dist',
    },
  };
});
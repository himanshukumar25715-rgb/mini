import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    
    if (!apiKey && mode === 'production') {
      console.warn('⚠️  WARNING: GEMINI_API_KEY is not set. The app will not work without it.');
      console.warn('Set GEMINI_API_KEY in your deployment platform\'s environment variables.');
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

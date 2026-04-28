import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     tailwindcss()],
    //   visualizer({
    //   open: true, // Automatically open in browser
    //   filename: 'stats.html', // Output file in root
    //   gzipSize: true,
    //   brotliSize: true,
    //   template: 'treemap', // or 'sunburst', 'network'
    // }),
  build:{
    sourcemap: false
  }
  
});
// vite.config.js
// export default {
//   build: {
//     sourcemap: false
//   }
// }

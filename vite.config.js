import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // 개발 서버(npm run dev)에서만 동작: /api 요청을 실제 API 서버로 대신 전달
      // 운영 API가 localhost를 CORS 허용하지 않아서, 브라우저는 같은 주소로 요청하고 Vite가 서버에 전달
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          configure: (proxy) => {
            // 서버가 허용되지 않은 출처(Origin)를 거절하지 않도록 출처 정보를 빼고 전달
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin')
              proxyReq.removeHeader('referer')
            })
          },
        },
      },
    },
  }
})

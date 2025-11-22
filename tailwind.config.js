/** @type {import('tailwindcss').Config} */
export default {
  // ⭐ 핵심: src 폴더 내의 모든 JSX 파일을 스캔하도록 지정 ⭐
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
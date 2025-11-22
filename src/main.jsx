// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // <---- App 컴포넌트 가져오기
import './index.css' // 전역 스타일 파일 (Tailwind CSS 포함)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
)
// src/App.jsx

// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage.jsx'; // 아직 생성 안 함
import DetailBetPage from './pages/DetailBetPage.jsx';
import WalletPage from './pages/WalletPage.jsx';
import CreateBetPage from './pages/CreateBetPage.jsx';
import ResolveBetPage from './pages/ResolveBetPage.jsx';
import CallbackPage from './pages/CallbackPage';


// import CreateBetPage from './pages/CreateBetPage'; // 아직 생성 안 함

// 임시 인증 함수 (실제로는 JWT 등 확인)
// const isAuthenticated = () => {
//     return localStorage.getItem('authToken') !== null;
// };

// // 인증된 사용자만 접근 가능한 라우트 보호
// const ProtectedRoute = ({ element: Element, ...rest }) => {
//     return isAuthenticated() ? <Element {...rest} /> : <Navigate to="/login" replace />;
// };

function App() {
    return (
        <Router>
            <Routes>
                {/* 1. 로그인 화면 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/callback" element={<CallbackPage />} />

                {/* 2. 메인 화면 (인증 필요) */}
                {/* <Route path="/" element={<ProtectedRoute element={MainPage} />} /> */}
                 <Route path="/" element={<MainPage />} />
                <Route path="/Wallet" element={<WalletPage/>} />
                <Route path="/Create" element={<CreateBetPage/>} />
                <Route path="/Resolve" element={<ResolveBetPage/>} />
                <Route path="/detail/:marketId" element={<DetailBetPage />} />
                
                {/* 다른 경로시 메인으로 */}
                <Route path="*" element={<Navigate to="/" />}/>

            </Routes>
        </Router>
    );
}

export default App;
// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage.jsx';
import DetailBetPage from './pages/DetailBetPage.jsx';
import WalletPage from './pages/WalletPage.jsx';
import CreateBetPage from './pages/CreateBetPage.jsx';
import ResolveBetPage from './pages/ResolveBetPage.jsx';
import CallbackPage from './pages/CallbackPage';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* ============================================
                    공개 페이지 (인증 불필요)
                ============================================ */}
                
                {/* 로그인 */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Google 로그인 콜백 */}
                <Route path="/callback" element={<CallbackPage />} />
                
                {/* 메인 페이지 (로그인 없이도 조회 가능) */}
                <Route path="/" element={<MainPage />} />
                
                {/* 베팅 상세 (로그인 없이도 조회 가능, 로그인 시 베팅 가능) */}
                <Route path="/detail/:marketId" element={<DetailBetPage />} />
                
                {/* ============================================
                    보호된 페이지 (로그인 필요)
                ============================================ */}
                
                {/* 지갑 */}
                <Route 
                    path="/wallet" 
                    element={
                        <ProtectedRoute>
                            <WalletPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* ============================================
                    관리자 전용 페이지
                ============================================ */}
                
                {/* 베팅 생성 (관리자만) */}
                <Route 
                    path="/create" 
                    element={
                        <AdminRoute>
                            <CreateBetPage />
                        </AdminRoute>
                    } 
                />
                
                {/* 베팅 확정 (관리자만) */}
                <Route 
                    path="/resolve" 
                    element={
                        <AdminRoute>
                            <ResolveBetPage />
                        </AdminRoute>
                    } 
                />
                
                {/* 다른 경로는 메인으로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/api';

// 로그인 필수 라우트
export const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn()) {
        alert('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// 관리자 전용 라우트
export const AdminRoute = ({ children }) => {
    if (!isLoggedIn()) {
        alert('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }
    
    // 관리자 여부 체크 (JWT에서 확인)
    const isAdmin = checkAdminStatus();
    
    if (!isAdmin) {
        alert('관리자 권한이 필요합니다.');
        return <Navigate to="/" replace />;
    }
    
    return children;
};

// JWT에서 관리자 여부 확인
const checkAdminStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        // JWT 디코딩 (payload 부분)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        return payload.admin || false;
    } catch (error) {
        console.error('토큰 디코딩 실패:', error);
        return false;
    }
};

export default ProtectedRoute;
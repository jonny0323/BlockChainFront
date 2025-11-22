// src/services/api.js
const API_URL = 'http://localhost:3000';

// Google 로그인
export const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/user/login`;
};

// 로그인 여부 체크
export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

// 로그아웃
export const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    try {
        await fetch(`${API_URL}/user/logout`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('로그아웃 실패:', error);
    } finally {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};


// ============================================
// 지갑 API
// ============================================

// ✅ 지갑 잔액 조회
export const getWallet = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/user/wallet`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error('지갑 정보 조회 실패');
    }
    
    return response.json();
};

// ✅ 입금 주소 조회
export const getAddress = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/user/address`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error('주소 조회 실패');
    }
    
    return response.json();
};

// ✅ 출금
export const withdraw = async (targetAddress, amount) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/user/withdraw`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetAddress, amount })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '출금 실패');
    }
    
    return response.json();
};


// ============================================
// 메인 API
// ============================================

export const getMainData = async () => {
    const response = await fetch(`${API_URL}/betting/GetMainData`);
    
    if (!response.ok) {
        throw new Error('베팅 목록 조회 실패');
    }
    
    return response.json();
};
export const getDetailData = async (marketId) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/betting/GetDetailData/${marketId}`, {
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
    });
    
    if (!response.ok) {
        throw new Error('베팅 상세 조회 실패');
    }
    
    return response.json();
};

export const createBetting = async (betData) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/betting/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(betData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '베팅 생성 실패');
    }
    
    return response.json();
};

// src/services/api.js

// ✅ 베팅하기
export const placeBet = async (marketId, amount, isAbove) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('로그인이 필요합니다.');
    }
    
    const response = await fetch(`${API_URL}/betting/${marketId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            amount: parseFloat(amount),
            isAbove: isAbove
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '베팅 실패');
    }
    
    return response.json();
};
// src/services/api.js
const API_URL = 'https://blockchainbetting.duckdns.org';

// ============================================
// API 호출 헬퍼 함수
// ============================================

const apiCall = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        
        // ✅ 401 Unauthorized - 로그인 필요
        if (response.status === 401) {
            const error = await response.json();
            localStorage.removeItem('token');
            alert('로그인이 필요합니다.');
            window.location.href = '/login';
            throw new Error(error.message || '인증 실패');
        }
        
        // ✅ 403 Forbidden - 권한 없음
        if (response.status === 403) {
            const error = await response.json();
            alert('권한이 없습니다: ' + error.message);
            throw new Error(error.message || '권한 없음');
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API 호출 실패');
        }
        
        return response.json();
    } catch (error) {
        // 네트워크 에러 등
        if (error.message.includes('fetch')) {
            throw new Error('서버에 연결할 수 없습니다.');
        }
        throw error;
    }
};

// ============================================
// 로그인 및 인증 관련
// ============================================

export const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/user/login`;
};

export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

export const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload.admin || false;
    } catch (error) {
        return false;
    }
};

export const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    try {
        await apiCall(`${API_URL}/user/logout`, {
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

export const getWallet = async () => {
    const token = localStorage.getItem('token');
    
    return apiCall(`${API_URL}/user/wallet`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const getAddress = async () => {
    const token = localStorage.getItem('token');
    
    return apiCall(`${API_URL}/user/address`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const withdraw = async (targetAddress, amount) => {
    const token = localStorage.getItem('token');
    
    return apiCall(`${API_URL}/user/withdraw`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetAddress, amount })
    });
};


// ============================================
// 메인 API
// ============================================

export const getMainData = async () => {
    return apiCall(`${API_URL}/betting/GetMainData`);
};

export const getDetailData = async (marketId) => {
    const token = localStorage.getItem('token');
    
    return apiCall(`${API_URL}/betting/GetDetailData/${marketId}`, {
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
    });
};

export const createBetting = async (betData) => {
    const token = localStorage.getItem('token');
    
    return apiCall(`${API_URL}/betting/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(betData)
    });
};

export const placeBet = async (marketId, amount, isAbove) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('로그인이 필요합니다.');
    }
    
    return apiCall(`${API_URL}/betting/${marketId}`, {
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
};

// ============================================
// 베팅 확정 API (관리자 전용)
// ============================================

export const getFinalizableBets = async () => {
    const token = localStorage.getItem('token');
    
    return apiCall(`${API_URL}/betting/finalizeable`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const finalizeBets = async (marketIds) => {
    const token = localStorage.getItem('token');
    
    return apiCall(`${API_URL}/betting/finalize`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ marketIds })
    });
};
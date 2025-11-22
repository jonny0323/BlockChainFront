// src/pages/CallbackPage.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CallbackPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    console.log("!@!!@!@!")

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            localStorage.setItem('token', token);
            console.log('✅ 로그인 성공!');
            navigate('/');
        } else {
            alert('로그인 실패: 토큰이 없습니다.');
            navigate('/login');
        }
    }, [navigate, searchParams]);

    return (
        <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#1c0a3c',
            color: 'white',
            fontSize: '24px'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '20px' }}>🔄</div>
                <h2>로그인 처리 중...</h2>
            </div>
        </div>
    );
};

export default CallbackPage;
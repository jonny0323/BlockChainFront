import React from 'react';
// 아이콘 라이브러리 사용을 가정합니다. (실제 프로젝트에서 설치 필요: npm install react-icons)
import { FiTrendingUp, FiLock, FiDollarSign, FiSmartphone } from 'react-icons/fi';
import { FaTwitter, FaYoutube, FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import bitcoinImg from '../assets/images/bitcoin_img.png';
// import { handleGoogleLogin, isLoggedIn } from '../services/api';
import { handleGoogleLogin, isLoggedIn } from '../services/api';
import { useNavigate } from 'react-router-dom';  // ✅ 추가

// 기본 색상 및 스타일 변수 (CSS 파일이나 Styled Components로 분리하는 것이 이상적입니다)
const styles = {
    bitcoin : '#ff9900',
    primaryColor: '#8a2be2', // BlueViolet 계열
    secondaryColor: '#9370db', // MediumPurple 계열
    bgColor: '#1c0a3c', // Dark Purple Background
    cardColor: 'rgba(255, 255, 255, 0.08)', // Light semi-transparent for cards
    gradientBg: 'linear-gradient(180deg, #3c0c7a, #1c0a3c)', // Deep purple gradient
    padding: '80px 5%',
    maxWidth: '1200px',
};
// 재사용 가능한 버튼 스타일
const buttonStyle = (backgroundColor, color, isPrimary = false) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: isPrimary ? `2px solid ${backgroundColor}` : 'none',
    backgroundColor: isPrimary ? backgroundColor : 'transparent',
    color: color,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
});

// 1. Header Component
const Header = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        if (isLoggedIn()) {
            navigate('/dashboard');
        } else {
            handleGoogleLogin();
        }
    };

    return (
        <header style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            padding: '20px 5%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 10,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '24px' }}>
                <span style={{ color: styles.bitcoin, marginRight: '10px' }}>₿</span>
                Price Prediction
            </div>
            <div>
                <button 
                    onClick={handleLoginClick}
                    style={buttonStyle('transparent', 'white')}
                >
                    {isLoggedIn() ? '대시보드' : '로그인'}
                </button>
            </div>
        </header>
    );
};


// 2. Hero Section
const HeroSection = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        if (isLoggedIn()) {
            navigate('/');
        } else {
            handleGoogleLogin();
        }
    };

    return (
        <section style={{
            backgroundImage: styles.gradientBg,
            color: 'white',
            padding: '150px 5% 80px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            position: 'relative',
        }}>
            <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                    <h1 style={{ fontSize: '50px', marginBottom: '20px', lineHeight: '1.2' }}>
                        탈중앙화 배팅
                    </h1>
                    <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '500px' }}>
                        비트코인의 가격을 예측하는 탈중앙화 배팅 플랫폼입니다. 
                    </p>
                    {/* ✅ Link 제거하고 onClick 추가 */}
                    <button 
                        onClick={handleStartClick}
                        style={{ 
                            ...buttonStyle('#ff007f', 'white', true), 
                            fontSize: '18px', 
                            padding: '15px 30px', 
                            background: 'linear-gradient(90deg, #ff007f, #cc00ff)' 
                        }}
                    >
                        지금 시작하기
                    </button>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '240px', height: '240px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundImage: `url(${bitcoinImg})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            boxShadow: '0 0 30px rgba(150, 0, 255, 0.8)'
                        }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
    <div style={{
        backgroundColor: styles.cardColor,
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'left',
        width: '23%',
        minWidth: '200px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
        <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'inline-block',
            fontSize: '30px',
            color: styles.primaryColor,
            border: '2px solid' + styles.secondaryColor
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#ccc' }}>{description}</p>
    </div>
);

// 3. Features Section
const FeaturesSection = () => {
    const features = [
        { icon: <FiTrendingUp />, title: '실시간 가격 예측', description: '실시간으로 비트코인의 가격을 예측해보세요!' },
        { icon: <FiLock />, title: '안전한 거래', description: 'ERC-4337 기반 탈중앙화 기술을 사용하였습니다.' },
        { icon: <FiDollarSign />, title: '수수료 최저', description: '스마트 컨트랙트에 필요한 최저 비용만을 수수료로 걷습니다!' },
    ];

    return (
        <section style={{ backgroundImage: styles.gradientBg, color: 'white', padding: styles.padding, textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>왜 Price Prediction 입니까?</h2>
            <p style={{ fontSize: '18px', marginBottom: '50px', color: '#ccc' }}>
                저희를 믿지 마십시오! 기술을 신뢰하십시오!
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', maxWidth: styles.maxWidth, margin: '0 auto' }}>
                {features.map((f, index) => <FeatureCard key={index} {...f} />)}
            </div>
        </section>
    );
};

// Asset Card Component
const AssetCard = ({ name, ticker, price, prediction, odds, isLive }) => {
    const navigate = useNavigate();

    const handlePredictClick = () => {
        if (isLoggedIn()) {
            navigate('/');
        } else {
            handleGoogleLogin();
        }
    };

    return (
        <div style={{
            backgroundColor: styles.cardColor,
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            width: '23%',
            minWidth: '220px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '20px' }}>{name} ({ticker})</h4>
                {isLive && <span style={{ backgroundColor: '#ff007f', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>LIVE</span>}
                {!isLive && <span style={{ backgroundColor: styles.secondaryColor, padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>예정</span>}
            </div>
            <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '15px' }}>현재가: ${price.toLocaleString()}</p>

            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '16px', color: '#ffcc00' }}>예측: {prediction}</p>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: styles.primaryColor }}>{odds.toFixed(2)}</p>
            </div>

            <button 
                onClick={handlePredictClick}
                style={{ 
                    ...buttonStyle('#ff007f', 'white', true), 
                    background: 'linear-gradient(90deg, #ff007f, #cc00ff)', 
                    width: '100%' 
                }}
            >
                예측하기
            </button>
        </div>
    );
};


// 4. Popular Assets Section
const PopularAssetsSection = () => {
    const assets = [
        { name: '비트코인', ticker: 'BTC', price: 100000, prediction: '상승', odds: 2.45, isLive: true },
    ];

    return (
        <section style={{ backgroundImage: styles.gradientBg, color: 'white', padding: styles.padding, textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>인기 자산 예측</h2>
            <p style={{ fontSize: '18px', marginBottom: '40px', color: '#ccc' }}>
                24시간 언제든, 자유롭게 배팅하십시오!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', maxWidth: styles.maxWidth, margin: '0 auto' }}>
                {assets.map((asset, index) => <AssetCard key={index} {...asset} />)}
            </div>
        </section>
    );
};

// Step Component
const Step = ({ number, title, description }) => (
    <div style={{ textAlign: 'center', width: '30%', minWidth: '250px' }}>
        <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: styles.primaryColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0 auto 20px',
            color: 'white',
            border: '5px solid #ff007f'
        }}>
            {number}
        </div>
        <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>{title}</h3>
        <p style={{ fontSize: '16px', color: '#ccc' }}>{description}</p>
    </div>
);

// 5. How It Works Section
const HowItWorksSection = () => {
    const steps = [
        { number: 1, title: '배팅 결정', description: '비트코인이 언제 얼마 이상을 갈지 예상해보세요!' },
        { number: 2, title: '배팅 하기', description: '특정 시간에 특정 금액 이상인지 예측하고 베팅 금액을 설정하세요' },
        { number: 3, title: '결과 확인', description: '설정한 시간이 되면 자동으로 결과가 확인되고 수익이 지급됩니다' },
    ];
    return (
        <section style={{ backgroundImage: styles.gradientBg, color: 'white', padding: styles.padding, textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>어떻게 작동하나요?</h2>
            <p style={{ fontSize: '18px', marginBottom: '50px', color: '#ccc' }}>
                간단한 3단계로 가격 예측 베팅을 시작하세요
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap', maxWidth: styles.maxWidth, margin: '0 auto' }}>
                {steps.map((step, index) => <Step key={index} {...step} />)}
            </div>
        </section>
    );
};

// 6. Call to Action Section
const CallToActionSection = () => (
    <section style={{
        backgroundImage: styles.gradientBg,
        color: 'white',
        padding: '50px 5%',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
        <h2 style={{ fontSize: '30px', marginBottom: '15px' }}>지금 바로 시작하세요!</h2>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#ccc' }}>
            Google 계정으로 간편하게 가입하세요! 보안을 위해 오로지 Google을 통한 로그인을 받습니다!
        </p>
        <button 
            onClick={handleGoogleLogin}
            style={{
                ...buttonStyle('white', 'black', true),
                fontSize: '18px',
                padding: '15px 40px',
                background: 'linear-gradient(90deg, #ff007f, #cc00ff)',
                color: 'white',
                border: 'none',
            }}
        >
            Google로 시작하기
        </button>
    </section>
);

// 7. Footer Component
const Footer = () => (
    <footer style={{ backgroundColor: '#110425', color: '#ccc', padding: '50px 5%', fontSize: '14px' }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            maxWidth: styles.maxWidth,
            margin: '0 auto',
            flexWrap: 'wrap',
            gap: '30px'
        }}>
            <div style={{ flex: 2, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '20px', color: 'white', marginBottom: '10px' }}>
                    <span style={{ color: styles.bitcoin, marginRight: '10px' }}>₿</span>
                    Price Prediction
                </div>
                <p>차세대 블록체인 기반 가격 예측 플랫폼으로 안전하고 투명한 베팅 경험을 제공합니다.</p>
            </div>

            <div style={{ flex: 1, minWidth: '100px' }}>
                <h5 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>자산</h5>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>비트코인</li>
                </ul>
            </div>

            <div style={{ flex: 1, minWidth: '100px' }}>
                <h5 style={{ color: 'white', marginBottom: '15px', fontSize: '16px' }}>지원</h5>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>도움말</li>
                    <li>FAQ</li>
                    <li>이용약관</li>
                    <li>개인정보처리방침</li>
                </ul>
            </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            © 2025 Price Prediction. All rights reserved. | Powered by Leetaejoon
        </div>
    </footer>
);

const LoginPage = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: styles.bgColor }}>
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
                <PopularAssetsSection />
                <HowItWorksSection />
                <CallToActionSection />
            </main>
            <Footer />
            {/* Talk with Us 버튼은 실제로는 Floating Button 컴포넌트가 필요합니다. */}
        </div>
    );
};

export default LoginPage;
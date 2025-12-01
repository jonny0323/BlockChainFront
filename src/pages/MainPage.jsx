import React, { useState, useEffect } from 'react';  
import { FaTwitter, FaYoutube, FaDiscord } from 'react-icons/fa';
import { FiPlus, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ResolveBetPage from './ResolveBetPage'; 
import WalletPage from './WalletPage';
import { getWallet, handleLogout, isLoggedIn, isAdmin, getMainData } from '../services/api.js'

// ============================================
// 해당 화면 기본 세팅
// ============================================

const styles = {
    bitcoin : '#ff9900',
    primaryColor: '#5c6bc0',
    secondaryColor: '#4caf50',
    dangerColor: '#f44336',
    bgColor: '#f4f7f9',
    cardBgColor: 'white',
    padding: '40px 5%',
    maxWidth: '1200px',
    headerHeight: '80px',
};

const buttonStyle = (backgroundColor, color, padding = '10px 20px') => ({
    padding: padding,
    borderRadius: '8px',
    border: 'none',
    backgroundColor: backgroundColor,
    color: color,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

// ============================================
// 메인 헤더
// ============================================

const Header = ({ onResolveClick, onWalletClick, balance, onRefreshBalance }) => {
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

    useEffect(() => {
        // 로그인 및 관리자 여부 체크
        setUserIsLoggedIn(isLoggedIn());
        setUserIsAdmin(isAdmin());
    }, []);

    return (
        <header style={{
            backgroundColor: styles.cardBgColor,
            color: '#333',
            padding: '0 5%',
            height: styles.headerHeight,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '24px' }}>
                <span style={{ color: styles.bitcoin, marginRight: '10px' }}>₿</span>
                Betting DApp
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* 관리자만 Create 버튼 보이기 */}
                {userIsAdmin && (
                    <Link to="/create" style={{ textDecoration: 'none' }}>
                        <button style={{ ...buttonStyle(styles.primaryColor, 'white', '8px 15px') }}>
                            <FiPlus style={{ marginRight: '5px' }} /> Create
                        </button>
                    </Link>
                )}
                
                {/* 관리자만 확정하기 버튼 보이기 */}
                {userIsAdmin && (
                    <button 
                        style={{ ...buttonStyle(styles.secondaryColor, 'white', '8px 15px') }}
                        onClick={onResolveClick}
                    >
                        <FiCheckCircle style={{ marginRight: '5px' }} /> 확정시키기
                    </button>
                )}
                
                {/* 로그인한 사용자만 지갑 버튼 보이기 */}
                {userIsLoggedIn && (
                    <button 
                        style={{
                            padding: '8px 15px',
                            borderRadius: '8px',
                            border: `1px solid ${styles.primaryColor}`,
                            backgroundColor: 'transparent',
                            color: styles.primaryColor,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onClick={() => {
                            onWalletClick();
                            onRefreshBalance();
                        }}
                    >
                        내 지갑: {balance !== null ? `${balance.toFixed(2)} POL` : '로딩 중...'}
                    </button>
                )}

                {/* 로그인 여부에 따라 Logout/Login 버튼 */}
                {userIsLoggedIn ? (
                    <button 
                        style={{ ...buttonStyle('#ccc', 'black', '8px 15px') }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button 
                            style={{ ...buttonStyle(styles.primaryColor, 'white', '8px 15px') }}
                        >
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
};

// Betting Card Component
const BettingCard = ({ idx, title, smartDeadline, smartBetting, participants, totalBet, status }) => (
    <div style={{
        backgroundColor: styles.cardBgColor,
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #ddd',
        width: '30%',
        minWidth: '350px',
    }}>
        {/* 제목 한 줄로 표시 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', flex: 1 }}>
                {title}
            </h3>
            <span style={{ color: styles.primaryColor, fontWeight: 'bold', marginLeft: '10px' }}>{status}</span>
        </div>

        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            스마트 마감: {smartDeadline}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ flex: 1, borderRight: '1px solid #eee' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>찬성 베팅 수익률</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: styles.secondaryColor }}>{smartBetting.toFixed(2)}x</p>
            </div>
            <div style={{ flex: 1, borderRight: '1px solid #eee' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>참여자 수</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{participants}명</p>
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#666' }}>총 베팅액</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: styles.dangerColor }}>{totalBet} POL</p>
            </div>
        </div>
        
        <Link to={`/detail/${idx}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex' }}>
                <button 
                    style={{ 
                        ...buttonStyle(styles.primaryColor, 'white', '12px 0'), 
                        flex: 1,
                        background: `linear-gradient(90deg, ${styles.primaryColor}, #8c9eff)`
                    }}
                >
                    JOIN
                </button>
            </div>
        </Link>
    </div>
);

// BettingListSection에서 props 수정
const BettingListSection = () => {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBets();
    }, []);

    const loadBets = async () => {
        try {
            const data = await getMainData();
            setBets(data.bets);
        } catch (error) {
            console.error('베팅 목록 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section style={{ backgroundColor: styles.bgColor, padding: styles.padding, minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ fontSize: '18px', color: '#666' }}>로딩 중...</p>
            </section>
        );
    }

    return (
        <section style={{ backgroundColor: styles.bgColor, padding: styles.padding, minHeight: 'calc(100vh - 80px)', alignItems:'center' }}>
            <div style={{ maxWidth: styles.maxWidth, margin: '0 auto', textAlign:'center' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '10px', color: '#333' }}>진행 중인 베팅</h2>
                <p style={{ fontSize: '16px', marginBottom: '30px', color: '#666'}}>
                    실시간으로 진행되는 가격 예측 베팅에 참여해보세요
                </p>

                {bets.length === 0 ? (
                    <p style={{ fontSize: '16px', color: '#999', padding: '50px 0' }}>
                        진행 중인 베팅이 없습니다.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                        {bets.map((bet) => (
                            <BettingCard 
                                key={bet.idx}
                                idx={bet.idx}
                                title={bet.title}  
                                smartDeadline={new Date(bet.settlementTime).toLocaleDateString('ko-KR')}
                                smartBetting={parseFloat(bet.yesOdds)}
                                participants={bet.participantCount}
                                totalBet={parseFloat(bet.totalBetAmount)}
                                status={bet.status}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};



// Footer
const Footer = () => (
    <footer style={{ backgroundColor: styles.cardBgColor, color: '#666', padding: '50px 5%', fontSize: '14px', borderTop: '1px solid #eee' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '20px', color: '#333', marginBottom: '10px' }}>
                    <span style={{ color: styles.bitcoin, marginRight: '10px' }}>₿</span>
                    Betting DApp
                </div>
                <p>블록체인 기반 가격 예측 베팅 플랫폼으로 안전하고 투명한 베팅 경험을 제공합니다.</p>
            </div>

            <div style={{ flex: 1, minWidth: '100px' }}>
                <h5 style={{ color: '#333', marginBottom: '15px', fontSize: '16px' }}>자산</h5>
                <ul style={{ listStyle: 'none', padding: 0, lineHeight: '25px' }}>
                    <li>비트코인</li>
                </ul>
            </div>

            <div style={{ flex: 1, minWidth: '100px' }}>
                <h5 style={{ color: '#333', marginBottom: '15px', fontSize: '16px' }}>지원</h5>
                <ul style={{ listStyle: 'none', padding: 0, lineHeight: '25px' }}>
                    <li>도움말</li>
                    <li>FAQ</li>
                    <li>이용약관</li>
                    <li>개인정보처리방침</li>
                </ul>
            </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            © 2025 Price Prediction. All rights reserved. | Powered by Leetaejoon
        </div>
    </footer>
);

// Main Component
const MainPage = () => {
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [balance, setBalance] = useState(null);

    // 잔액 로드
    useEffect(() => {
        if (isLoggedIn()) {
            loadBalance();
        }
    }, []);

    const loadBalance = async () => {
        try {
            const walletData = await getWallet();
            setBalance(parseFloat(walletData.balance || 0));
        } catch (error) {
            console.error('잔액 조회 실패:', error);
            setBalance(0);
        }
    };

    // 지갑 모달 닫을 때 잔액 갱신
    const handleWalletClose = () => {
        setIsWalletModalOpen(false);
        loadBalance();
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: styles.bgColor, minHeight: '100vh' }}>
            <Header 
                onResolveClick={() => setIsResolveModalOpen(true)} 
                onWalletClick={() => setIsWalletModalOpen(true)}
                balance={balance}
                onRefreshBalance={loadBalance}
            />
            <main>
                <BettingListSection />
            </main>
            <Footer />
            
            {isResolveModalOpen && (
                <ResolveBetPage onClose={() => setIsResolveModalOpen(false)} />
            )}
            
            {isWalletModalOpen && (
                <WalletPage onClose={handleWalletClose} />
            )}
        </div>
    );
};

export default MainPage;
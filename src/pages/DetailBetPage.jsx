import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCheckCircle, FiCopy, FiExternalLink, FiX } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetailData, getWallet, isLoggedIn, placeBet } from '../services/api';

// 스타일 변수 (동일)
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
    statusBlue: '#2196f3',
    statusGrey: '#757575',
    infoColor: '#42a5f5',
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
    justifyContent: 'center',
});

// ✅ 베팅 성공 모달 추가
const BettingSuccessModal = ({ onClose, transactionHash, amount, direction, odds }) => {
    const handleCopyHash = () => {
        navigator.clipboard.writeText(transactionHash);
        alert('트랜잭션 해시가 복사되었습니다.');
    };

    const polygonscanUrl = `https://polygonscan.com/tx/${transactionHash}`;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: styles.cardBgColor,
                borderRadius: '15px',
                width: '90%',
                maxWidth: '450px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
            }}>
                {/* Modal Header */}
                <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: styles.headerColor }}>
                        베팅 완료
                    </h2>
                    <FiX style={{ fontSize: '20px', cursor: 'pointer', color: styles.statusGrey }} onClick={onClose} />
                </div>

                {/* Modal Content */}
                <div style={{ padding: '25px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#e8f5e9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <FiCheckCircle style={{ fontSize: '40px', color: styles.secondaryColor }} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: styles.headerColor, marginBottom: '10px' }}>
                            베팅 성공!
                        </h3>
                        <p style={{ fontSize: '16px', color: styles.statusGrey }}>
                            베팅이 성공적으로 처리되었습니다
                        </p>
                    </div>

                    {/* 베팅 정보 */}
                    <div style={{
                        backgroundColor: '#f9f9f9',
                        padding: '20px',
                        borderRadius: '10px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '5px' }}>베팅 금액</p>
                            <p style={{ fontSize: '20px', fontWeight: 'bold', color: styles.headerColor }}>
                                {amount} POL
                            </p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '5px' }}>선택</p>
                            <p style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold',
                                color: direction === 'YES' ? styles.secondaryColor : styles.dangerColor
                            }}>
                                {direction}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '5px' }}>배당률</p>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: styles.headerColor }}>
                                {odds}x
                            </p>
                        </div>
                    </div>

                    {/* 트랜잭션 해시 */}
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>트랜잭션 해시</h4>
                    <div 
                        style={{ 
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}
                    >
                        <span style={{ 
                            fontSize: '14px', 
                            overflowWrap: 'break-word', 
                            wordBreak: 'break-all',
                            flex: 1
                        }}>
                            {transactionHash}
                        </span>
                        <FiCopy 
                            style={{ cursor: 'pointer', color: styles.primaryColor, marginLeft: '10px' }} 
                            onClick={handleCopyHash} 
                        />
                    </div>

                    {/* PolygonScan 링크 */}
                    <a 
                        href={polygonscanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                    >
                        <button 
                            style={{
                                ...buttonStyle(styles.infoColor, 'white', '12px 25px'),
                                width: '100%',
                                marginBottom: '15px'
                            }}
                        >
                            <FiExternalLink style={{ marginRight: '8px' }} />
                            PolygonScan에서 확인하기
                        </button>
                    </a>

                    <button 
                        style={{ ...buttonStyle(styles.primaryColor, 'white', '12px 25px'), width: '100%' }} 
                        onClick={onClose}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

// 1. Header Component
const Header = ({ balance }) => {
    const navigate = useNavigate();
    
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
                <FiArrowLeft 
                    style={{ marginRight: '15px', cursor: 'pointer', fontSize: '20px' }} 
                    onClick={() => navigate('/')}
                />
                <span style={{ color: styles.bitcoin, marginRight: '10px' }}>₿</span>
                Betting DApp
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                    style={{
                        padding: '8px 15px',
                        borderRadius: '8px',
                        border: `1px solid ${styles.primaryColor}`,
                        backgroundColor: 'transparent',
                        color: styles.primaryColor,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                >
                    내 지갑: {balance !== null ? `${balance.toFixed(2)} POL` : '로딩 중...'}
                </button>
            </div>
        </header>
    );
};

// 2. 베팅 상세 정보 섹션
const BettingDetail = ({ market, betting }) => {
    if (!market || !betting) return null;

    const commonCardStyle = {
        backgroundColor: styles.cardBgColor,
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const valueCardStyle = (color) => ({
        padding: '20px 10px',
        borderRadius: '10px',
        color: 'white',
        backgroundColor: color,
        fontWeight: 'bold',
        fontSize: '22px',
        boxShadow: `0 4px 10px ${color}40`,
        minWidth: '130px'
    });

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(market.contractAddress);
        alert('컨트랙트 주소가 복사되었습니다.');
    };

    return (
        <section style={{ ...commonCardStyle, textAlign: 'left' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                {market.title}
            </h2>
            <div style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '10px' }}>
                <span style={{ marginRight: '20px' }}>
                    ⊙ 마감: {new Date(market.settlementTime).toLocaleString('ko-KR')}
                </span>
                <span style={{ marginRight: '20px' }}>
                    ⊙ 생성자: 스마트 컨트랙트
                </span>
                <span>⊙ 현재가: ${parseFloat(market.currentPrice).toLocaleString()}</span>
            </div>

            {/* ✅ 스마트 컨트랙트 주소 추가 */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginBottom: '20px',
                padding: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
            }}>
                <span style={{ fontSize: '14px', color: styles.statusGrey, fontWeight: 'bold' }}>
                    📄 컨트랙트:
                </span>
                <span style={{ 
                    fontSize: '13px', 
                    color: '#333',
                    fontFamily: 'monospace',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {market.contractAddress}
                </span>
                <button
                    onClick={handleCopyAddress}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#e3f2fd',
                        color: styles.primaryColor,
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <FiCopy size={12} />
                    복사
                </button>
                <a
                    href={`https://polygonscan.com/address/${market.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                >
                    <button
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: styles.primaryColor,
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <FiExternalLink size={12} />
                        PolygonScan에서 보기
                    </button>
                </a>
            </div>

            <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                {market.description}
            </p>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                textAlign: 'center',
                gap: '20px'
            }}>
                <div style={{ flex: 1, minWidth: '150px' }}> 
                    <p style={{ fontSize: '16px', color: styles.statusGrey }}>총 베팅액</p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                        {parseFloat(betting.totalAmount).toLocaleString()} POL
                    </p>
                </div>

                <div style={{ flex: 1, ...valueCardStyle(styles.secondaryColor) }}>
                    <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                        YES 베팅액 ({betting.yesParticipants}명)
                    </p>
                    {parseFloat(betting.yesAmount).toLocaleString()} POL
                    <p style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '5px' }}>
                        배당률: {betting.yesOdds}x
                    </p>
                </div>

                <div style={{ flex: 1, ...valueCardStyle(styles.dangerColor) }}>
                    <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                        NO 베팅액 ({betting.noParticipants}명)
                    </p>
                    {parseFloat(betting.noAmount).toLocaleString()} POL
                    <p style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '5px' }}>
                        배당률: {betting.noOdds}x
                    </p>
                </div>
            </div>
        </section>
    );
};

// 3. 베팅 참여 섹션
const BettingForm = ({ betting, balance, marketId, onBetSuccess }) => {
    if (!betting) return null;

    const [selectedOption, setSelectedOption] = useState('YES'); 
    const [betAmount, setBetAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const { yesOdds, noOdds } = betting;
    const availableWeth = balance || 0;

    const commonCardStyle = {
        backgroundColor: styles.cardBgColor,
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        marginBottom: '20px',
    };

    const choiceCardStyle = (option) => ({ 
        flex: 1,
        padding: '20px',
        borderRadius: '10px',
        border: `2px solid ${selectedOption === option ? (option === 'YES' ? styles.secondaryColor : styles.dangerColor) : '#eee'}`,
        backgroundColor: selectedOption === option ? (option === 'YES' ? `${styles.secondaryColor}10` : `${styles.dangerColor}10`) : 'white',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
    });

    const quickBetAmounts = [10, 25, 50, 100];

    const handleQuickBet = (amount) => {
        if (amount === '전액') {
            const estimatedGasFee = 0.5; // 
            const maxBetAmount = Math.max(0, availableWeth - estimatedGasFee);
            
            if (maxBetAmount <= 0) {
                alert(
                    `베팅 가능한 금액이 없습니다.\n\n` +
                    `현재 잔액: ${availableWeth.toFixed(4)} POL\n` +
                    `예상 가스비: ${estimatedGasFee} POL\n\n` +
                    `💡 최소 ${estimatedGasFee} POL이 필요합니다.`
                );
                return;
            }
            
            setBetAmount(maxBetAmount.toFixed(4));
            } else {
                setBetAmount(amount.toString());
        }
    };

    const handleBet = async () => {
    try {
        // ✅ 검증
        if (!isLoggedIn()) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!betAmount || parseFloat(betAmount) <= 0) {
            alert('유효한 베팅 금액을 입력하세요.');
            return;
        }

        const estimatedGasFee = 0.1; 
        const totalNeeded = parseFloat(betAmount) + estimatedGasFee;
        
        if (totalNeeded > availableWeth) {
            const shortage = (totalNeeded - availableWeth).toFixed(4);
            alert(
                `잔액이 부족합니다.\n\n` +
                `필요 금액: ${totalNeeded.toFixed(4)} POL\n` +
                `- 베팅액: ${parseFloat(betAmount).toFixed(4)} POL\n` +
                `- 예상 가스비: ${estimatedGasFee} POL\n\n` +
                `현재 잔액: ${availableWeth.toFixed(4)} POL\n` +
                `부족 금액: ${shortage} POL\n\n` +
                `💡 지갑에 POL을 충전해주세요.`
            );
            return;
        }

        setLoading(true);

        const isAbove = selectedOption === 'YES';
        
        console.log("📤 베팅 요청:", {
            marketId,
            amount: betAmount,
            isAbove
        });

        const result = await placeBet(marketId, betAmount, isAbove);

        console.log("✅ 베팅 성공:", result);

        onBetSuccess({
            transactionHash: result.transactionHash,
            amount: betAmount,
            direction: selectedOption,
            odds: isAbove ? yesOdds : noOdds
        });

        setBetAmount('');

    } catch (error) {
        console.error('베팅 실패:', error);
        
        // ✅ 에러 타입에 따른 메시지 표시
        let errorMessage = '베팅 처리 중 오류가 발생했습니다.';
        
        if (error.errorType === 'INSUFFICIENT_GAS') {
            errorMessage = '⛽ 가스비가 부족하여 베팅에 실패했습니다.\n\n' +
                          '지갑에 POL을 충전한 후 다시 시도해주세요.';
        } else if (error.message) {
            // 에러 메시지에서 가스비 관련 키워드 체크
            if (error.message.includes('insufficient funds') || 
                error.message.includes('gas') ||
                error.message.includes('가스')) {
                errorMessage = '⛽ 가스비가 부족하여 베팅에 실패했습니다.\n\n' +
                              '지갑에 POL을 충전한 후 다시 시도해주세요.';
            } else {
                errorMessage = `베팅 실패: ${error.message}`;
            }
        }
        
        alert(errorMessage);
    } finally {
        setLoading(false);
    }
};

    return (
        <section style={commonCardStyle}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: '#333' }}>
                베팅하기
            </h2>
            
            <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#333' }}>선택</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div 
                    style={choiceCardStyle('YES')}
                    onClick={() => !loading && setSelectedOption('YES')}
                >
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: styles.secondaryColor, marginBottom: '5px' }}>YES</p>
                    <p style={{ fontSize: '16px', color: styles.statusGrey }}>배당률: {yesOdds}x</p>
                </div>
                
                <div 
                    style={choiceCardStyle('NO')}
                    onClick={() => !loading && setSelectedOption('NO')}
                >
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: styles.dangerColor, marginBottom: '5px' }}>NO</p>
                    <p style={{ fontSize: '16px', color: styles.statusGrey }}>배당률: {noOdds}x</p>
                </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#333' }}>베팅 금액 (POL)</h3>
            <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input
                    type="number"
                    placeholder="베팅할 금액을 입력하세요"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    disabled={loading}
                    style={{
                        width: '85%',
                        padding: '15px',
                        paddingRight: '60px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'text'
                    }}
                />
                <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: styles.statusGrey }}>
                    POL
                </span>
            </div>
            <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '20px' }}>
                사용 가능: {availableWeth.toFixed(4)} POL
                <br/>
                <span style={{ fontSize: '12px', color: '#ff9800' }}>
                    💡 가스비 약 0.5 POL 별도 필요
                </span>
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'space-between' }}>
                {quickBetAmounts.map((amount, index) => {
                    const estimatedGasFee = 0.5;
                    const isDisabled = loading || (amount + estimatedGasFee > availableWeth);
                    
                    return (
                        <button 
                            key={index}
                            onClick={() => handleQuickBet(amount)}
                            disabled={isDisabled}
                            style={{
                                ...buttonStyle('#eee', styles.statusGrey, '8px 15px'),
                                flex: 1, 
                                minWidth: '0',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                opacity: isDisabled ? 0.4 : 1,
                                backgroundColor: isDisabled ? '#f5f5f5' : '#eee'
                            }}
                        >
                            {amount} POL
                        </button>
                    );
                })}
                <button 
                    onClick={() => handleQuickBet('전액')}
                    disabled={loading || availableWeth <= 0.5}
                    style={{
                        ...buttonStyle('#eee', styles.primaryColor, '8px 15px'),
                        flex: 1, 
                        minWidth: '0',
                        fontWeight: 'bold',
                        cursor: (loading || availableWeth <= 0.5) ? 'not-allowed' : 'pointer',
                        opacity: (loading || availableWeth <= 0.5) ? 0.4 : 1,
                        backgroundColor: (loading || availableWeth <= 0.5) ? '#f5f5f5' : '#eee'
                    }}
                >
                    전액
                </button>
            </div>

            <button 
                style={{ 
                    ...buttonStyle(styles.secondaryColor, 'white', '15px 0'), 
                    width: '100%',
                    fontSize: '18px',
                    background: loading ? '#ccc' : (selectedOption === 'YES' 
                        ? `linear-gradient(90deg, ${styles.secondaryColor}, #81c784)`
                        : `linear-gradient(90deg, ${styles.dangerColor}, #ff7070)`),
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onClick={handleBet}
                disabled={loading}
            >
                {loading ? '베팅 처리 중...' : `${selectedOption} 베팅하기`}
            </button>
        </section>
    );
};


// 4. 내 베팅 내역 섹션
const BettingHistory = ({ userBets }) => {
    if (!userBets || userBets.length === 0) {
        return (
            <section style={{
                backgroundColor: styles.cardBgColor,
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
                    내 베팅 내역
                </h2>
                <p style={{ color: styles.statusGrey }}>베팅 내역이 없습니다.</p>
            </section>
        );
    }

    const commonCardStyle = {
        backgroundColor: styles.cardBgColor,
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    };
    
    const statusTagStyle = (status) => {
        let color = styles.statusBlue;
        if (status === '승리') color = styles.secondaryColor;
        if (status === '패배') color = styles.dangerColor;
        
        return {
            backgroundColor: color,
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block',
            minWidth: '40px',
            textAlign: 'center'
        };
    };

    return (
        <section style={commonCardStyle}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
                내 베팅 내역
            </h2>
            
            {userBets.map((item, index) => (
                <div key={index} style={{ 
                    borderBottom: index < userBets.length - 1 ? '1px solid #eee' : 'none',
                    paddingBottom: '20px',
                    paddingTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '8px' }}>
                            {new Date(item.date).toLocaleDateString('ko-KR')} &middot; 
                            <span style={{ color: item.direction === 'YES' ? styles.secondaryColor : styles.dangerColor }}>
                                {' '}{item.direction}
                            </span> &middot; 
                            배당률: {item.odds}x
                        </p>
                        
                        <span style={statusTagStyle(item.status)}>{item.status}</span>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '150px' }}>
                        <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '5px' }}>베팅액</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                            {parseFloat(item.amount).toLocaleString()} POL
                        </p>
                        
                        {item.profit !== '0.00' && (
                            <div style={{ color: parseFloat(item.profit) >= 0 ? styles.secondaryColor : styles.dangerColor, fontWeight: 'bold' }}>
                                <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '5px' }}>수익</p>
                                <p style={{ fontSize: '16px' }}>
                                    {parseFloat(item.profit) >= 0 ? '+' : ''}{parseFloat(item.profit).toLocaleString()} POL
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
};

// 5. Main Component
const DetailBetPage = () => {
    const { marketId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [balance, setBalance] = useState(null);
    const [betResult, setBetResult] = useState(null); //  베팅 결과 저장

    useEffect(() => {
        loadData();
    }, [marketId]);

    const loadData = async () => {
        try {
            const promises = [getDetailData(marketId)];
            
            if (isLoggedIn()) {
                promises.push(getWallet());
            }
            
            const results = await Promise.all(promises);
            
            setData(results[0]);
            
            if (results[1]) {
                setBalance(parseFloat(results[1].balance || 0));
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            alert('데이터를 불러올 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    //  베팅 성공 후 호출
    const handleBetSuccess = (result) => {
        setBetResult(result);
        loadData(); // 데이터 새로고침
    };

    //  모달 닫기
    const handleCloseModal = () => {
        setBetResult(null);
    };

    if (loading) {
        return (
            <div style={{ 
                fontFamily: 'Arial, sans-serif', 
                backgroundColor: styles.bgColor, 
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <p style={{ fontSize: '18px', color: '#666' }}>로딩 중...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ 
                fontFamily: 'Arial, sans-serif', 
                backgroundColor: styles.bgColor, 
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <p style={{ fontSize: '18px', color: '#666' }}>데이터를 불러올 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: styles.bgColor, minHeight: '100vh' }}>
            <Header balance={balance} />
            <main style={{ padding: '30px 5%', maxWidth: styles.maxWidth, margin: '0 auto' }}>
                <BettingDetail market={data.market} betting={data.betting} />
                
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <BettingForm 
                            betting={data.betting} 
                            balance={balance} 
                            marketId={marketId}
                            onBetSuccess={handleBetSuccess}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <BettingHistory userBets={data.userBets} />
                    </div>
                </div>
            </main>

            {/*  베팅 성공 모달 */}
            {betResult && (
                <BettingSuccessModal
                    onClose={handleCloseModal}
                    transactionHash={betResult.transactionHash}
                    amount={betResult.amount}
                    direction={betResult.direction}
                    odds={betResult.odds}
                />
            )}
        </div>
    );
};

export default DetailBetPage;
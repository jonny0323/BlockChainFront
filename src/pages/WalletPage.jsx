import React, { useState, useEffect } from 'react';  

import { FiX, FiCopy, FiCheckCircle, FiExternalLink } from 'react-icons/fi'; 
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import { getWallet, getAddress, withdraw } from '../services/api';  
// ============================================
// 해당 화면 기본 세팅
// ============================================

const styles = {
    primaryColor: '#5c6bc0',
    secondaryColor: '#4caf50', // 녹색 (입금 버튼)
    infoColor: '#42a5f5', // 파란색 (출금 버튼)
    dangerColor: '#f44336', // 빨간색 (경고)
    cardBgColor: 'white',
    headerColor: '#333',
    statusGrey: '#757575', 
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
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

const ModalContainer = ({ title, children, onClose }) => (
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
                    {title}
                </h2>
                <FiX style={{ fontSize: '20px', cursor: 'pointer', color: styles.statusGrey }} onClick={onClose} />
            </div>
            {/* Modal Content */}
            <div style={{ padding: '25px', overflowY: 'auto' }}>
                {children}
            </div>
        </div>
    </div>
);

// ============================================
// 메인화면
// ============================================

// 1. 내 지갑 - 메인 화면
const WalletMainView = ({ currentBalance, onActionClick }) => {
    // 그라데이션 카드 스타일
    const balanceCardStyle = {
        background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
        color: 'white',
        padding: '30px 20px',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    };

    return (
        <>
            <div style={balanceCardStyle}>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>현재 잔액</p>
                <h3 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {currentBalance.toLocaleString()} POL
                </h3>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>POLYGON MAINET</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                {/* 입금 버튼 */}
                <button 
                    style={{ ...buttonStyle(styles.secondaryColor, 'white', '12px 25px'), flex: 1 }}
                    onClick={() => onActionClick('Deposit')}
                >
                    <FaChevronDown style={{ marginRight: '8px' }} /> 입금
                </button>
                {/* 출금 버튼 */}
                <button 
                    style={{ ...buttonStyle(styles.infoColor, 'white', '12px 25px'), flex: 1 }}
                    onClick={() => onActionClick('Withdraw')}
                >
                    <FaChevronUp style={{ marginRight: '8px' }} /> 출금
                </button>
            </div>
        </>
    );
};


// 2. 입금하기 화면
const DepositView = ({ onBack, depositAddress }) => {
    
    const handleCopy = () => {
        navigator.clipboard.writeText(depositAddress);
        alert('주소가 클립보드에 복사되었습니다.');
    };

    return (
        <>
            <p style={{ marginBottom: '20px', color: styles.statusGrey }}>
                아래 주소로 POL를 전송하세요
            </p>
            
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>공개키 주소</h4>
            <div 
                style={{ 
                    border: '1px solid #ddd', 
                    padding: '15px', 
                    borderRadius: '8px',
                    backgroundColor: styles.bgColor,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}
            >
                <span style={{ fontSize: '14px', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                    {depositAddress}
                </span>
                <FiCopy style={{ cursor: 'pointer', color: styles.primaryColor, marginLeft: '10px' }} onClick={handleCopy} />
            </div>

            <div 
                style={{ 
                    backgroundColor: '#fffbe5', 
                    border: `1px solid #ffe57f`, 
                    color: styles.headerColor,
                    padding: '15px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <span style={{ color: styles.dangerColor, fontWeight: 'bold', marginRight: '10px' }}>⚠️</span>
                주의: POL만 전송하세요. 다른 토큰을 전송하면 손실될 수 있습니다.
            </div>

            <button 
                style={{ ...buttonStyle('#ccc', styles.headerColor, '12px 25px'), width: '100%' }} 
                onClick={onBack}
            >
                닫기
            </button>
        </>
    );
};


// 3. 출금하기 화면 (수정)
const WithdrawView = ({ onBack, currentBalance, onSuccess }) => {  //  onSuccess props 추가
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = async () => {
        if (!recipientAddress || !withdrawAmount) {
            alert('출금 주소와 금액을 입력하세요.');
            return;
        }

        if (Number(withdrawAmount) > currentBalance) {
            alert('잔액이 부족합니다.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await withdraw(recipientAddress, withdrawAmount);
            
            onSuccess({
                transactionHash: result.transactionHash,
                amount: result.amount,
                targetAddress: result.to
            });
        } catch (error) {
            alert('출금 실패: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <p style={{ fontSize: '16px', color: styles.statusGrey, marginBottom: '20px' }}>
                사용 가능 잔액
                <span style={{ float: 'right', fontWeight: 'bold', color: styles.headerColor }}>
                    {currentBalance ? currentBalance.toFixed(4) : '0.0000'} POL
                </span>
            </p>
            
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>출금 금액</h4>
            <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input
                    type="number"
                    placeholder="출금 금액을 입력하세요"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{
                        width: '74%',
                        padding: '15px',
                        paddingRight: '80px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                    }}
                />
                <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: styles.statusGrey }}>
                    POL
                </span>
            </div>
            
            <button 
                style={{ ...buttonStyle('#eee', styles.primaryColor, '8px 15px'), marginBottom: '20px' }}
                onClick={() => setWithdrawAmount(currentBalance.toString())}
            >
                전액 출금
            </button>

            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>출금 주소</h4>
            <input
                type="text"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                style={{
                    width: '90%',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    marginBottom: '20px'
                }}
            />

            <div 
                style={{ 
                    backgroundColor: '#fbe5e5', 
                    border: `1px solid ${styles.dangerColor}`, 
                    color: styles.headerColor,
                    padding: '15px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <span style={{ color: styles.dangerColor, fontWeight: 'bold', marginRight: '10px' }}>⚠️</span>
                주의: 출금 주소를 정확히 확인하세요. 잘못된 주소로 전송하면 복구할 수 없습니다.
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button 
                    style={buttonStyle('#ccc', styles.headerColor, '12px 25px')} 
                    onClick={onBack}
                    disabled={isLoading}
                >
                    취소
                </button>
                <button 
                    style={{
                        ...buttonStyle(styles.primaryColor, 'white', '12px 25px'),
                        opacity: isLoading ? 0.6 : 1
                    }}
                    onClick={handleWithdraw}
                    disabled={isLoading}
                >
                    {isLoading ? '처리 중...' : '출금하기'}
                </button>
            </div>
        </>
    );
};

const WithdrawSuccessView = ({ onClose, transactionHash, amount, targetAddress }) => {
    const handleCopyHash = () => {
        navigator.clipboard.writeText(transactionHash);
        alert('트랜잭션 해시가 복사되었습니다.');
    };

    const polygonscanUrl = `https://polygonscan.com/tx/${transactionHash}`;

    return (
        <>
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
                    출금 완료!
                </h3>
                <p style={{ fontSize: '16px', color: styles.statusGrey }}>
                    출금이 성공적으로 처리되었습니다
                </p>
            </div>

            {/* 출금 정보 */}
            <div style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px'
            }}>
                <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '5px' }}>출금 금액</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: styles.headerColor }}>
                        {amount} POL
                    </p>
                </div>
                <div>
                    <p style={{ fontSize: '14px', color: styles.statusGrey, marginBottom: '5px' }}>출금 주소</p>
                    <p style={{ 
                        fontSize: '14px', 
                        color: styles.headerColor,
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all'
                    }}>
                        {targetAddress}
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
        </>
    );
};

// 메인 WalletPage (수정)
const WalletPage = ({ onClose }) => {
    const [currentView, setCurrentView] = useState('Main');
    const [currentBalance, setCurrentBalance] = useState(0);
    const [depositAddress, setDepositAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [withdrawResult, setWithdrawResult] = useState(null);  //  출금 결과 저장

    useEffect(() => {
        const loadWalletData = async () => {
            try {
                const [walletData, addressData] = await Promise.all([
                    getWallet(),
                    getAddress()
                ]);

                setCurrentBalance(parseFloat(walletData.balance || 0));
                setDepositAddress(addressData.depositAddress || '');
            } catch (error) {
                console.error('지갑 데이터 로드 실패:', error);
                alert('지갑 정보를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadWalletData();
    }, []);

    const refreshBalance = async () => {
        try {
            const walletData = await getWallet();
            setCurrentBalance(parseFloat(walletData.balance || 0));
        } catch (error) {
            console.error('잔액 갱신 실패:', error);
        }
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
        if (view === 'Main') {
            refreshBalance();
        }
    };

    // 출금 성공 핸들러
    const handleWithdrawSuccess = (result) => {
        setWithdrawResult(result);
        setCurrentView('Success');
        refreshBalance();  // 잔액 갱신
    };

    // 성공 화면에서 닫기
    const handleSuccessClose = () => {
        setCurrentView('Main');
        setWithdrawResult(null);
    };

    if (loading) {
        return (
            <ModalContainer title="내 지갑" onClose={onClose}>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <p>로딩 중...</p>
                </div>
            </ModalContainer>
        );
    }

    let title = '';
    let content = null;

    switch (currentView) {
        case 'Deposit':
            title = '입금하기';
            content = <DepositView onBack={() => handleViewChange('Main')} depositAddress={depositAddress} />;
            break;
        case 'Withdraw':
            title = '출금하기';
            content = <WithdrawView 
                onBack={() => handleViewChange('Main')} 
                currentBalance={currentBalance}
                onSuccess={handleWithdrawSuccess}  // 성공 핸들러 전달
            />;
            break;
        case 'Success':  // 성공 화면 추가
            title = '출금 완료';
            content = withdrawResult && <WithdrawSuccessView 
                onClose={handleSuccessClose}
                transactionHash={withdrawResult.transactionHash}
                amount={withdrawResult.amount}
                targetAddress={withdrawResult.targetAddress}
            />;
            break;
        case 'Main':
        default:
            title = '내 지갑';
            content = <WalletMainView currentBalance={currentBalance} onActionClick={handleViewChange} />;
            break;
    }

    return (
        <ModalContainer title={title} onClose={onClose}>
            {content}
        </ModalContainer>
    );
};

export default WalletPage;
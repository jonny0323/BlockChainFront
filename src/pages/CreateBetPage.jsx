import React, { useState } from 'react';
import { FiArrowLeft, FiPlus, FiArrowUp, FiArrowDown, FiCheckCircle, FiCopy, FiExternalLink, FiX } from 'react-icons/fi';
import { FaBitcoin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createBetting } from '../services/api';

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

// ✅ 베팅 생성 성공 모달 추가
const CreateBetSuccessModal = ({ onClose, marketAddress, transactionHash }) => {
    const handleCopyAddress = () => {
        navigator.clipboard.writeText(marketAddress);
        alert('마켓 주소가 복사되었습니다.');
    };

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
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                        베팅 생성 완료
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
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                            베팅 생성되었습니다!
                        </h3>
                        <p style={{ fontSize: '16px', color: styles.statusGrey }}>
                            베팅이 성공적으로 생성되었습니다
                        </p>
                    </div>

                    {/* 마켓 주소 */}
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>마켓 주소</h4>
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
                            {marketAddress}
                        </span>
                        <FiCopy 
                            style={{ cursor: 'pointer', color: styles.primaryColor, marginLeft: '10px' }} 
                            onClick={handleCopyAddress} 
                        />
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

const Header = () => {
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
        </header>
    );
};

const CreateBetForm = ({ onSuccess }) => {
    const navigate = useNavigate();
    
    const [selectedAsset, setSelectedAsset] = useState('bitcoin');
    const [selectedCondition, setSelectedCondition] = useState('above');
    const [targetPrice, setTargetPrice] = useState('');
    const [year, setYear] = useState('2025');
    const [month, setMonth] = useState('12');
    const [day, setDay] = useState('31');
    const [time, setTime] = useState('23:59');
    const [loading, setLoading] = useState(false);

    const assets = [
        { id: 'bitcoin', name: '비트코인', price: '$98,750', icon: <FaBitcoin /> },
    ];

    const commonCardContainerStyle = {
        backgroundColor: styles.cardBgColor,
        padding: '50px 7%',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        margin: '0 auto'
    };
    
    const selectCardStyle = (isSelected, color) => ({
        flex: 1,
        padding: '20px',
        borderRadius: '10px',
        border: `2px solid ${isSelected ? color : '#eee'}`,
        backgroundColor: isSelected ? `${color}10` : 'white',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
        minWidth: '100px',
    });

    const yearOptions = ['2025', '2026', '2027'];
    const monthOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    const timeOptions = ['00:00', '06:00', '12:00', '18:00', '23:59'];

    const selectStyle = {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        marginRight: '10px',
        fontSize: '16px',
        cursor: 'pointer'
    };

    const handleSubmit = async () => {
        try {
            // ✅ 검증
            if (!targetPrice || parseFloat(targetPrice) <= 0) {
                alert('유효한 목표 가격을 입력하세요.');
                return;
            }

            setLoading(true);

            // ✅ 1. 타이틀 생성
            const title = `${year}년 ${month}월 ${day}일 비트코인 $${parseFloat(targetPrice).toLocaleString()} ${selectedCondition === 'above' ? '이상' : '이하'}?`;

            // ✅ 2. settlementTime (UNIX timestamp)
            const dateTimeString = `${year}-${month}-${day}T${time}:00`;
            const settlementTime = Math.floor(new Date(dateTimeString).getTime() / 1000);

            // ✅ 3. targetPrice (Chainlink 8 decimals)
            const targetPriceFormatted = Math.floor(parseFloat(targetPrice) * 100000000).toString();

            // ✅ 4. priceFeedAddress (BTC/USD Polygon Mainnet)
            const priceFeedAddress = "0xc907E116054Ad103354f2D350FD2514433D57F6f";

            const betData = {
                title,
                settlementTime,
                targetPrice: targetPriceFormatted,
                assetType: 1, // 1 = Bitcoin
                priceFeedAddress
            };

            console.log("📤 전송 데이터:", betData);

            const result = await createBetting(betData);

            console.log("✅ 베팅 생성 성공:", result);

            // ✅ 모달로 성공 메시지 표시
            onSuccess({
                marketAddress: result.marketAddress,
                transactionHash: result.transactionHash
            });

        } catch (error) {
            console.error('베팅 생성 실패:', error);
            alert(`베팅 생성 실패: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={commonCardContainerStyle}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                새 베팅 생성
            </h1>

            {/* 베팅 자산 선택 */}
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                베팅 자산 선택
            </h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                {assets.map((asset) => (
                    <div 
                        key={asset.id}
                        style={selectCardStyle(selectedAsset === asset.id, styles.primaryColor)}
                        onClick={() => setSelectedAsset(asset.id)}
                    >
                        <div style={{ fontSize: '30px', marginBottom: '5px', color: selectedAsset === asset.id ? styles.primaryColor : '#333' }}>
                            {asset.icon}
                        </div>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{asset.name}</p>
                        <p style={{ fontSize: '14px', color: styles.statusGrey }}>{asset.price}</p>
                    </div>
                ))}
            </div>
            
            {/* 목표 가격 */}
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                목표 가격
            </h3>
            <div style={{ position: 'relative', marginBottom: '40px' }}>
                <input
                    type="number"
                    placeholder="목표 가격을 입력하세요 (예: 100000)"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    style={{
                        width: '85%',
                        padding: '15px',
                        paddingRight: '60px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                    }}
                />
                <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: styles.statusGrey }}>
                    $
                </span>
            </div>

            {/* 조건 선택 */}
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                조건 선택
            </h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div 
                    style={selectCardStyle(selectedCondition === 'above', styles.secondaryColor)}
                    onClick={() => setSelectedCondition('above')}
                >
                    <FiArrowUp style={{ fontSize: '24px', color: styles.secondaryColor, marginBottom: '5px' }} />
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: styles.secondaryColor }}>이상</p>
                    <p style={{ fontSize: '14px', color: styles.statusGrey }}>목표 가격 이상</p>
                </div>
                
                <div 
                    style={selectCardStyle(selectedCondition === 'below', styles.dangerColor)}
                    onClick={() => setSelectedCondition('below')}
                >
                    <FiArrowDown style={{ fontSize: '24px', color: styles.dangerColor, marginBottom: '5px' }} />
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: styles.dangerColor }}>이하</p>
                    <p style={{ fontSize: '14px', color: styles.statusGrey }}>목표 가격 이하</p>
                </div>
            </div>

            {/* 마감일 선택 */}
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                마감일 선택
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 0', marginBottom: '50px' }}>
                <select style={selectStyle} value={year} onChange={(e) => setYear(e.target.value)}>
                    {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                
                <select style={selectStyle} value={month} onChange={(e) => setMonth(e.target.value)}>
                    {monthOptions.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
                
                <select style={selectStyle} value={day} onChange={(e) => setDay(e.target.value)}>
                    {dayOptions.map(d => <option key={d} value={d}>{d}일</option>)}
                </select>
                
                <select style={selectStyle} value={time} onChange={(e) => setTime(e.target.value)}>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* 베팅 생성 버튼 */}
            <button 
                style={{ 
                    ...buttonStyle(styles.primaryColor, 'white', '15px 0'), 
                    width: '100%',
                    fontSize: '18px',
                    background: loading ? '#ccc' : `linear-gradient(90deg, #42a5f5, ${styles.primaryColor}, #9c27b0)`,
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    '생성 중...'
                ) : (
                    <>
                        <FiPlus style={{ marginRight: '10px' }} /> 베팅 생성하기
                    </>
                )}
            </button>
        </div>
    );
};

const CreateBetPage = () => {
    const navigate = useNavigate();
    const [createResult, setCreateResult] = useState(null);

    const handleCreateSuccess = (result) => {
        setCreateResult(result);
    };

    const handleCloseModal = () => {
        setCreateResult(null);
        navigate('/'); // 메인 페이지로 이동
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: styles.bgColor, minHeight: '100vh' }}>
            <Header />
            <main style={{ padding: '50px 5%' }}>
                <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                    <CreateBetForm onSuccess={handleCreateSuccess} />
                </div>
            </main>

            {/* ✅ 베팅 생성 성공 모달 */}
            {createResult && (
                <CreateBetSuccessModal
                    onClose={handleCloseModal}
                    marketAddress={createResult.marketAddress}
                    transactionHash={createResult.transactionHash}
                />
            )}
        </div>
    );
};

export default CreateBetPage;
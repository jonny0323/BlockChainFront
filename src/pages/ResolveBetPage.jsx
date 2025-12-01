import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { getFinalizableBets, finalizeBets } from '../services/api';

// ============================================
// 해당 화면 기본 세팅
// ============================================

const styles = {
    primaryColor: '#5c6bc0',
    secondaryColor: '#4caf50', 
    dangerColor: '#f44336',
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

// ============================================
// 함수들
// ============================================

// 베팅 항목 카드 컴포넌트
const ResolveBetItem = ({ bet, onToggle, isSelected }) => {
    const predictedWinner = parseFloat(bet.currentPrice) >= parseFloat(bet.targetPrice) ? 'YES' : 'NO';
    const winStyle = predictedWinner === 'YES' ? styles.secondaryColor : styles.dangerColor;

    return (
        <div style={{
            backgroundColor: styles.cardBgColor,
            padding: '20px',
            borderRadius: '10px',
            border: isSelected ? `2px solid ${winStyle}` : '1px solid #eee',
            marginBottom: '15px',
            boxShadow: styles.boxShadow,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
        }} onClick={() => onToggle(bet.idx)}>
            
            {/* 체크박스 영역 */}
            <input 
                type="checkbox" 
                checked={isSelected}
                readOnly 
                style={{ 
                    marginRight: '15px', 
                    width: '20px', 
                    height: '20px',
                    accentColor: styles.secondaryColor
                }}
            />

            {/* 내용 영역 */}
            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {bet.title}
                </h3>
                <div style={{ fontSize: '13px', color: styles.statusGrey, marginBottom: '10px' }}>
                    <span style={{ marginRight: '15px' }}>
                        만료일: {new Date(bet.settlementTime).toLocaleString('ko-KR')}
                    </span>
                    <span style={{ marginRight: '15px' }}>
                        참여자: {bet.participantCount}명
                    </span>
                </div>
                <div style={{ fontSize: '13px', color: styles.statusGrey, marginBottom: '10px' }}>
                    <span style={{ marginRight: '15px' }}>
                        목표가: ${parseFloat(bet.targetPrice).toLocaleString()}
                    </span>
                    <span>현재가: ${parseFloat(bet.currentPrice).toLocaleString()}</span>
                </div>

                {/* 베팅 금액 요약 */}
                <div style={{ display: 'flex', fontSize: '14px', marginTop: '10px' }}>
                    <div style={{ flex: 1, padding: '10px', backgroundColor: `${styles.secondaryColor}10`, borderRadius: '6px 0 0 6px', textAlign: 'center' }}>
                        YES 베팅액<br/>{parseFloat(bet.yesBetAmount).toFixed(2)} MATIC
                    </div>
                    
                    <div style={{ flex: 1, padding: '10px', backgroundColor: `${styles.dangerColor}10`, borderRadius: '0 6px 6px 0', textAlign: 'center' }}>
                        NO 베팅액<br/>{parseFloat(bet.noBetAmount).toFixed(2)} MATIC
                    </div>
                </div>
            </div>

            {/* 총 베팅액 및 예상 결과 영역 */}
            <div style={{ textAlign: 'right', minWidth: '120px', marginLeft: '20px' }}>
                <p style={{ fontSize: '14px', color: styles.statusGrey }}>총 베팅액</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: styles.headerColor, marginBottom: '10px' }}>
                    {parseFloat(bet.totalBetAmount).toFixed(2)} MATIC
                </p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: winStyle }}>
                    예상: {predictedWinner} 승리
                </p>
            </div>
        </div>
    );
};

// 메인 모달 컴포넌트
const ResolveBetPage = ({ onClose, onSuccess }) => {
    const [selectedBetIds, setSelectedBetIds] = useState([]);
    const [betsToResolve, setBetsToResolve] = useState([]);
    const [loading, setLoading] = useState(true);
    const [finalizing, setFinalizing] = useState(false);
    const [finalizeResults, setFinalizeResults] = useState(null);

    useEffect(() => {
        loadFinalizableBets();
    }, []);

    const loadFinalizableBets = async () => {
        try {
            const response = await getFinalizableBets();
            setBetsToResolve(response.bets || []);
        } catch (error) {
            console.error('정산 가능한 베팅 조회 실패:', error);
            alert('데이터를 불러올 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 선택/해제 토글 핸들러
    const handleToggle = (betId) => {
        setSelectedBetIds(prev => 
            prev.includes(betId)
                ? prev.filter(id => id !== betId)
                : [...prev, betId]
        );
    };

    // 확정 처리
    const handleFinalize = async () => {
        if (selectedBetIds.length === 0) {
            alert('확정할 베팅을 선택해주세요.');
            return;
        }

        if (!window.confirm(`${selectedBetIds.length}개의 베팅을 확정하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }

        setFinalizing(true);

        try {
            const response = await finalizeBets(selectedBetIds);
            

            // 성공 모달 표시
            setFinalizeResults(response.results);
            
            // 목록 새로고침
            await loadFinalizableBets();
            
            // 선택 초기화
            setSelectedBetIds([]);
            
        } catch (error) {
            console.error('❌ 확정 실패:', error);
            alert(`확정 실패: ${error.message}`);
        } finally {
            setFinalizing(false);
        }
    };

    // 성공 모달 닫기
    const handleCloseSuccessModal = () => {
        setFinalizeResults(null);
        if (onSuccess) {
            onSuccess(); // 메인 페이지 새로고침
        }
    };

    // 모달 배경 스타일
    const modalBackdropStyle = {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    // 모달 컨테이너 스타일
    const modalContentStyle = {
        backgroundColor: styles.cardBgColor,
        borderRadius: '15px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    };

    return (
        <>
            <div style={modalBackdropStyle}>
                <div style={modalContentStyle}>
                    
                    {/* 모달 헤더 */}
                    <div style={{ padding: '25px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: styles.headerColor }}>
                            베팅 확정하기
                        </h2>
                        <FiX style={{ fontSize: '24px', cursor: 'pointer', color: styles.statusGrey }} onClick={onClose} />
                    </div>
                    
                    {/* 모달 내용 */}
                    <div style={{ padding: '0 30px', overflowY: 'auto', flexGrow: 1 }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                <p style={{ color: styles.statusGrey }}>로딩 중...</p>
                            </div>
                        ) : betsToResolve.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                <p style={{ fontSize: '16px', color: styles.statusGrey }}>
                                    확정 가능한 베팅이 없습니다.
                                </p>
                            </div>
                        ) : (
                            <>
                                <p style={{ fontSize: '14px', color: styles.statusGrey, padding: '20px 0 10px 0' }}>
                                    시간이 지난 베팅들을 확정하여 결과를 처리합니다. 확정할 베팅을 선택해주세요.
                                </p>
                                
                                {/* 베팅 목록 */}
                                {betsToResolve.map(bet => (
                                    <ResolveBetItem 
                                        key={bet.idx} 
                                        bet={bet}
                                        onToggle={handleToggle}
                                        isSelected={selectedBetIds.includes(bet.idx)}
                                    />
                                ))}
                            </>
                        )}
                    </div>

                    {/* 모달 푸터 (액션 버튼) */}
                    {!loading && betsToResolve.length > 0 && (
                        <div style={{ padding: '15px 30px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: styles.headerColor }}>
                                {selectedBetIds.length}개 선택됨
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    style={buttonStyle('#ccc', styles.headerColor)} 
                                    onClick={onClose}
                                    disabled={finalizing}
                                >
                                    취소
                                </button>
                                <button 
                                    style={{ 
                                        ...buttonStyle(styles.secondaryColor, 'white'), 
                                        opacity: (selectedBetIds.length > 0 && !finalizing) ? 1 : 0.6,
                                        cursor: (selectedBetIds.length > 0 && !finalizing) ? 'pointer' : 'not-allowed',
                                    }}
                                    onClick={handleFinalize}
                                    disabled={selectedBetIds.length === 0 || finalizing}
                                >
                                    {finalizing ? (
                                        '처리 중...'
                                    ) : (
                                        <>
                                            <span style={{ marginRight: '5px' }}>✔️</span> 
                                            확정하기 ({selectedBetIds.length})
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 성공 모달 */}
            {finalizeResults && (
                <FinalizeSuccessModal
                    onClose={handleCloseSuccessModal}
                    results={finalizeResults}
                />
            )}
        </>
    );
};

// ============================================
// 추가 페이지
// ============================================

// 확정 성공 모달
const FinalizeSuccessModal = ({ onClose, results }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
        }}>
            <div style={{
                backgroundColor: styles.cardBgColor,
                borderRadius: '15px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
            }}>
                {/* Modal Header */}
                <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: styles.headerColor }}>
                        베팅 확정 완료
                    </h2>
                    <FiX style={{ fontSize: '20px', cursor: 'pointer', color: styles.statusGrey }} onClick={onClose} />
                </div>

                {/* Modal Content */}
                <div style={{ padding: '25px', maxHeight: '60vh', overflowY: 'auto' }}>
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
                            확정 완료!
                        </h3>
                        <p style={{ fontSize: '16px', color: styles.statusGrey }}>
                            {results.length}개의 베팅이 성공적으로 확정되었습니다
                        </p>
                    </div>

                    {/* 결과 목록 */}
                    <div style={{ marginBottom: '20px' }}>
                        {results.map((result, index) => (
                            <div key={index} style={{
                                backgroundColor: '#f9f9f9',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '10px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: styles.headerColor }}>
                                        마켓 #{result.marketId}
                                    </span>
                                    <span style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 'bold',
                                        color: result.winner === 'Above' ? styles.secondaryColor : styles.dangerColor
                                    }}>
                                        {result.winner === 'Above' ? 'YES 승리 ⬆️' : 'NO 승리 ⬇️'}
                                    </span>
                                </div>
                                
                                <div style={{ fontSize: '12px', color: styles.statusGrey, marginBottom: '8px' }}>
                                    <div>최종가: ${parseFloat(result.finalPrice).toLocaleString()}</div>
                                    <div>목표가: ${parseFloat(result.targetPrice).toLocaleString()}</div>
                                </div>

                                <a 
                                    href={`https://polygonscan.com/tx/${result.transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ 
                                        fontSize: '12px', 
                                        color: styles.primaryColor,
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    <FiExternalLink size={12} />
                                    트랜잭션 확인
                                </a>
                            </div>
                        ))}
                    </div>

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

export default ResolveBetPage;
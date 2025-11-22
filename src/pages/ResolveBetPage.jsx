import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
// 🔴 MainPage에서 styles를 공유하기 어렵기 때문에 모달 내에서 기본 스타일을 재정의합니다.
// 실제 앱에서는 CSS 파일을 통해 스타일을 분리하여 사용하세요.

// 스타일 변수 재정의 (MainPage와 동일)
const styles = {
    primaryColor: '#5c6bc0',
    secondaryColor: '#4caf50', 
    dangerColor: '#f44336',
    cardBgColor: 'white',
    headerColor: '#333',
    statusGrey: '#757575', 
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
};

// 재사용 가능한 버튼 스타일 (MainPage와 동일)
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

// 베팅 항목 카드 컴포넌트 (모달 내부에 사용)
const ResolveBetItem = ({ bet, onToggle, isSelected }) => {
    const winStyle = bet.result === 'YES 승리' ? styles.secondaryColor : styles.dangerColor;

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
        }} onClick={() => onToggle(bet.id)}>
            
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
                    <span style={{ marginRight: '15px' }}>만료일: {bet.deadline}</span>
                    <span style={{ marginRight: '15px' }}>참여자: {bet.participants}명</span>
                </div>
                <div style={{ fontSize: '13px', color: styles.statusGrey, marginBottom: '10px' }}>
                    <span style={{ marginRight: '15px' }}>목표가: {bet.targetPrice}</span>
                    <span>현재가: {bet.currentPrice}</span>
                </div>

                {/* 베팅 금액 요약 */}
                <div style={{ display: 'flex', fontSize: '14px', marginTop: '10px' }}>
                    <div style={{ flex: 1, padding: '10px', backgroundColor: `${styles.secondaryColor}10`, borderRadius: '6px 0 0 6px', textAlign: 'center' }}>
                        YES 베팅액<br/>{bet.yesBet} WETH
                    </div>
                    
                    <div style={{ flex: 1, padding: '10px', backgroundColor: `${styles.dangerColor}10`, borderRadius: '0 6px 6px 0', textAlign: 'center' }}>
                        NO 베팅액<br/>{bet.noBet} WETH
                    </div>
                </div>
            </div>

            {/* 총 베팅액 및 결과 영역 */}
            <div style={{ textAlign: 'right', minWidth: '120px', marginLeft: '20px' }}>
                <p style={{ fontSize: '14px', color: styles.statusGrey }}>총 베팅액</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: styles.headerColor, marginBottom: '10px' }}>
                    {bet.totalBet.toLocaleString()} WETH
                </p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: winStyle }}>
                    {bet.result}
                </p>
            </div>
        </div>
    );
};

// 메인 모달 컴포넌트
const ResolveBetPage = ({ onClose }) => {
    const [selectedBetIds, setSelectedBetIds] = useState([]);
    
    // 임시 베팅 데이터
    const betsToResolve = [
        { id: 1, title: '2024년 11월 15일 비트코인 $95K 이상?', deadline: '2024-11-15', participants: 45, targetPrice: '$95,000 이상', currentPrice: '$97,250', totalBet: 2000, yesBet: 1200, noBet: 800, result: 'YES 승리' },
        { id: 2, title: '2024년 11월 10일 석유 $70 이하?', deadline: '2024-11-10', participants: 28, targetPrice: '$70.00 이하', currentPrice: '$68.50', totalBet: 800, yesBet: 500, noBet: 300, result: 'YES 승리' },
        { id: 3, title: '2024년 11월 12일 금 $2,100 이상?', deadline: '2024-11-12', participants: 67, targetPrice: '$2,100 이상', currentPrice: '$2,085', totalBet: 2000, yesBet: 750, noBet: 1250, result: 'NO 승리' },
    ];

    // 선택/해제 토글 핸들러
    const handleToggle = (betId) => {
        setSelectedBetIds(prev => 
            prev.includes(betId)
                ? prev.filter(id => id !== betId)
                : [...prev, betId]
        );
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
                    <p style={{ fontSize: '14px', color: styles.statusGrey, padding: '20px 0 10px 0' }}>
                        시간이 지난 베팅들을 확정하여 결과를 처리합니다. 확정할 베팅을 선택해주세요.
                    </p>
                    
                    {/* 베팅 목록 */}
                    {betsToResolve.map(bet => (
                        <ResolveBetItem 
                            key={bet.id} 
                            bet={bet}
                            onToggle={handleToggle}
                            isSelected={selectedBetIds.includes(bet.id)}
                        />
                    ))}
                </div>

                {/* 모달 푸터 (액션 버튼) */}
                <div style={{ padding: '15px 30px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: styles.headerColor }}>
                        {selectedBetIds.length}개 선택됨
                    </span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={buttonStyle('#ccc', styles.headerColor)} onClick={onClose}>
                            취소
                        </button>
                        <button 
                            style={{ 
                                ...buttonStyle(styles.secondaryColor, 'white'), 
                                opacity: selectedBetIds.length > 0 ? 1 : 0.6,
                                cursor: selectedBetIds.length > 0 ? 'pointer' : 'not-allowed',
                            }}
                            disabled={selectedBetIds.length === 0}
                        >
                            <span style={{ marginRight: '5px' }}>✔️</span> 확정하기 ({selectedBetIds.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResolveBetPage;
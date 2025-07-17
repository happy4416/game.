# 🎨 디자인 가이드

## 디자인 철학

1.5초 결정 게임의 디자인은 **빠른 반응**과 **직관적 사용성**을 중심으로 설계되었습니다.

### 핵심 원칙
- **명확성**: 짧은 시간 안에 정보를 파악할 수 있는 명확한 UI
- **반응성**: 사용자 행동에 즉각적인 시각적 피드백 제공
- **일관성**: 모든 요소에서 일관된 디자인 언어 사용
- **접근성**: 다양한 사용자가 쉽게 사용할 수 있는 포용적 디자인

## 색상 시스템

### 주요 색상 팔레트

#### 그라데이션 배경
```css
background: linear-gradient(135deg, 
  #667eea 0%,    /* 보라빛 파랑 */
  #764ba2 25%,   /* 진한 보라 */
  #ff6b6b 50%,   /* 코랄 핑크 */
  #4ecdc4 75%,   /* 터키석 */
  #45b7d1 100%   /* 하늘색 */
);
```

#### 기능별 색상
```css
/* 성공/정답 */
--success-color: #4CAF50;
--success-hover: #45a049;

/* 오류/오답 */
--error-color: #f44336;
--error-hover: #d32f2f;

/* 경고/시간초과 */
--warning-color: #ff6b6b;
--warning-hover: #ee5a24;

/* 정보/중성 */
--info-color: #667eea;
--info-hover: #764ba2;

/* 배경 */
--bg-primary: #ffffff;
--bg-secondary: #f8f9ff;
--bg-glass: rgba(255, 255, 255, 0.8);
```

### 색상 사용 가이드

#### 정답 표시
- **배경**: `#4CAF50` (초록)
- **텍스트**: `#ffffff` (흰색)
- **그림자**: `rgba(76, 175, 80, 0.4)`

#### 오답 표시
- **배경**: `#f44336` (빨강)
- **텍스트**: `#ffffff` (흰색)
- **그림자**: `rgba(244, 67, 54, 0.4)`

## 타이포그래피

### 폰트 스택
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### 폰트 크기 시스템
```css
/* 제목 */
--font-size-h1: 2.8rem;    /* 게임 제목 */
--font-size-h2: 2rem;      /* 섹션 제목 */
--font-size-h3: 1.8rem;    /* 문제 텍스트 */

/* 본문 */
--font-size-large: 1.2rem; /* 버튼, 중요 텍스트 */
--font-size-base: 1rem;    /* 기본 텍스트 */
--font-size-small: 0.9rem; /* 라벨, 보조 텍스트 */

/* 특수 */
--font-size-timer: 2rem;   /* 타이머 표시 */
--font-size-stats: 1.3rem; /* 통계 수치 */
```

### 폰트 가중치
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 600;
--font-weight-bold: 700;
--font-weight-extra-bold: 800;
```

## 레이아웃 시스템

### 컨테이너 구조
```css
.game-container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  border-radius: 25px;
  /* 글래스모피즘 효과 */
  background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
  backdrop-filter: blur(10px);
}
```

### 그리드 시스템
```css
/* 4등분 선택지 레이아웃 */
.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.8rem;
  height: 200px;
}

/* 통계 표시 */
.stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}
```

### 반응형 브레이크포인트
```css
/* 태블릿 */
@media (max-width: 768px) {
  .game-container {
    padding: 1.5rem;
    max-width: 95vw;
  }
  
  .options {
    display: flex;
    flex-direction: column;
    height: auto;
  }
}

/* 모바일 */
@media (max-width: 480px) {
  .game-container {
    padding: 1rem;
    border-radius: 15px;
  }
  
  .stats {
    flex-direction: column;
    gap: 0.8rem;
  }
}
```

## 컴포넌트 디자인

### 버튼 시스템

#### 기본 버튼
```css
.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
```

#### 선택지 버튼
```css
.option-btn {
  padding: 0.8rem;
  border: 3px solid transparent;
  border-radius: 15px;
  background: linear-gradient(145deg, #ffffff, #f8f9ff);
  min-height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.option-btn:hover {
  transform: translateY(-5px) scale(1.03);
  border-color: rgba(102, 126, 234, 0.4);
}
```

### 카드 시스템

#### 게임 컨테이너
```css
.game-container {
  /* 글래스모피즘 효과 */
  background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  /* 그림자 */
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
```

#### 통계 카드
```css
.stats {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 
    0 8px 25px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

### 타이머 시스템

#### 타이머 바
```css
.timer-bar {
  width: 100%;
  height: 12px;
  background: linear-gradient(145deg, #e0e0e0, #f5f5f5);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    #4CAF50 0%,    /* 초록 (충분한 시간) */
    #8BC34A 30%,   /* 연두 */
    #FFC107 70%,   /* 노랑 (주의) */
    #FF9800 85%,   /* 주황 */
    #FF5722 100%   /* 빨강 (위험) */
  );
  transition: width 0.1s linear;
}
```

## 애니메이션 시스템

### 키프레임 애니메이션

#### 배경 그라데이션
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

#### 컨테이너 플로팅
```css
@keyframes containerFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(0.5deg); }
}
```

#### 제목 애니메이션
```css
@keyframes titleBounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(1deg); }
}
```

#### 정답/오답 피드백
```css
@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### 트랜지션 시스템
```css
/* 기본 트랜지션 */
.transition-base {
  transition: all 0.3s ease;
}

/* 부드러운 트랜지션 */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 빠른 트랜지션 */
.transition-fast {
  transition: all 0.15s ease;
}
```

## 시각적 효과

### 글래스모피즘
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### 네온 글로우
```css
.neon-glow {
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}
```

### 쉬머 효과
```css
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.shimmer::before {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
}
```

## 접근성 고려사항

### 색상 대비
- 모든 텍스트는 WCAG 2.1 AA 기준 이상의 대비율 유지
- 색상에만 의존하지 않는 정보 전달

### 키보드 네비게이션
```css
.btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

### 모션 감소 지원
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 다크 모드 준비

### CSS 변수 시스템
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9ff;
  --text-primary: #333333;
  --text-secondary: #666666;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
  }
}
```

## 성능 최적화

### CSS 최적화
- GPU 가속을 위한 `transform` 사용
- `will-change` 속성으로 최적화 힌트 제공
- 불필요한 리플로우 방지

### 애니메이션 최적화
```css
.optimized-animation {
  will-change: transform;
  transform: translateZ(0); /* GPU 레이어 생성 */
}
```

## 브랜드 가이드라인

### 로고 사용
- 게임 제목: "⚡ 1초 결정 게임"
- 번개 이모지는 브랜드 아이덴티티의 핵심 요소

### 톤앤매너
- **활기찬**: 밝고 에너지 넘치는 색상 사용
- **현대적**: 최신 디자인 트렌드 반영
- **친근한**: 접근하기 쉬운 인터페이스
- **전문적**: 세련된 마감과 디테일
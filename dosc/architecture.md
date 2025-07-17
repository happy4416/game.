# 🏗️ 프로젝트 아키텍처

## 전체 구조

1.5초 결정 게임은 클라이언트 사이드 웹 애플리케이션으로 구성되어 있습니다.

```
Quick Decision Game
├── Presentation Layer (HTML/CSS)
├── Business Logic Layer (JavaScript)
└── Data Layer (In-Memory)
```

## 파일 구조

```
project/
├── quick-game.html          # 메인 HTML 파일
├── quick-game.css           # 스타일시트
├── quick-game.js            # 게임 로직
├── simple_server.py         # 로컬 개발 서버
├── README.md               # 프로젝트 개요
└── dosc/                   # 문서화 폴더
    ├── README.md           # 게임 가이드
    ├── architecture.md     # 아키텍처 문서
    ├── api.md             # API 문서
    ├── design.md          # 디자인 가이드
    └── development.md     # 개발 가이드
```

## 컴포넌트 구조

### 1. HTML 구조 (quick-game.html)
```html
<body>
  <div class="game-container">
    <header class="game-header">
      <!-- 게임 제목 및 통계 -->
    </header>
    <div class="game-area">
      <!-- 게임 화면들 -->
      <div class="start-screen">...</div>
      <div class="question-screen">...</div>
      <div class="result-screen">...</div>
      <div class="game-over-screen">...</div>
    </div>
  </div>
</body>
```

### 2. CSS 아키텍처 (quick-game.css)
- **기본 스타일**: 리셋, 폰트, 색상 변수
- **레이아웃**: 그리드, 플렉스박스 기반 반응형 레이아웃
- **컴포넌트**: 버튼, 카드, 타이머 등 재사용 가능한 컴포넌트
- **애니메이션**: CSS 키프레임과 트랜지션
- **반응형**: 미디어 쿼리를 통한 다양한 화면 크기 지원

### 3. JavaScript 아키텍처 (quick-game.js)
```javascript
class QuickDecisionGame {
  // 게임 상태 관리
  constructor()
  
  // 초기화 및 이벤트 설정
  init()
  setupEventListeners()
  
  // 게임 플로우 제어
  startGame()
  nextRound()
  gameOver()
  resetGame()
  
  // 문제 생성 시스템
  generateQuestion()
  generateMathQuestion()
  generateColorQuestion()
  generateWordQuestion()
  
  // 게임 로직
  startTimer()
  selectAnswer()
  timeUp()
  
  // UI 업데이트
  displayQuestion()
  showResult()
  updateStats()
  showScreen()
}
```

## 데이터 플로우

```
사용자 입력 → 이벤트 핸들러 → 게임 로직 → 상태 업데이트 → UI 렌더링
```

### 게임 상태 관리
- **점수 (score)**: 현재 획득한 점수
- **라운드 (round)**: 현재 라운드 번호
- **생명 (lives)**: 남은 생명 개수
- **게임 모드 (gameMode)**: 선택된 문제 유형
- **현재 문제 (currentQuestion)**: 출제된 문제 정보
- **반응 시간 (reactionTimes)**: 각 라운드별 반응 시간 기록

## 화면 전환 시스템

```
시작 화면 → 문제 화면 → 결과 화면 → (반복) → 게임 종료 화면
```

각 화면은 `showScreen()` 메서드를 통해 관리되며, CSS 클래스 `active`를 통해 표시/숨김이 제어됩니다.

## 타이머 시스템

```javascript
// 타이머 시작
startTimer() {
  this.startTime = Date.now();
  this.timer = setInterval(() => {
    // 시간 업데이트 및 UI 반영
  }, 10);
}
```

- 10ms 간격으로 업데이트
- 시각적 타이머 바와 숫자 표시 동기화
- 시간 초과 시 자동 처리

## 문제 생성 시스템

### 문제 유형별 생성기
1. **수학 문제**: 4가지 하위 유형 (기본연산, 수열, 비교, 분수)
2. **색깔 문제**: 4가지 하위 유형 (스트룹, 혼합, 색조, 무지개)
3. **단어 문제**: 6가지 하위 유형 (반대말, 수도, 동물, 음식, 한국어, 영어)

### 문제 구조
```javascript
{
  text: "문제 텍스트",
  options: ["선택지1", "선택지2", "선택지3", "선택지4"],
  correct: "정답"
}
```

## 점수 계산 시스템

```javascript
점수 = 기본점수(100) + 시간보너스 + 라운드보너스
시간보너스 = (1.5 - 반응시간) × 100
라운드보너스 = 라운드 × 10
```

## 반응형 디자인 전략

### 브레이크포인트
- **데스크톱**: 769px 이상
- **태블릿**: 481px - 768px
- **모바일**: 480px 이하

### 적응형 요소
- 그리드 레이아웃 → 플렉스 레이아웃
- 4개 선택지 그리드 → 세로 나열
- 폰트 크기 및 패딩 조정
- 터치 친화적 버튼 크기

## 성능 최적화

### CSS 최적화
- CSS 애니메이션 사용 (JavaScript 애니메이션 대신)
- GPU 가속을 위한 `transform` 속성 활용
- 효율적인 선택자 사용

### JavaScript 최적화
- 이벤트 위임 패턴 사용
- 타이머 정리를 통한 메모리 누수 방지
- DOM 조작 최소화

## 확장성 고려사항

### 새로운 문제 유형 추가
```javascript
// 새로운 문제 생성기 추가
generateNewTypeQuestion() {
  // 문제 생성 로직
}

// 메인 생성기에 등록
generateQuestion() {
  const modes = [...existing, 'newType'];
  // 기존 로직 활용
}
```

### 다국어 지원 준비
- 문제 텍스트 외부화
- 언어별 문제 데이터 분리
- UI 텍스트 국제화

### 서버 연동 준비
- 게임 상태 API 설계
- 랭킹 시스템 연동 포인트
- 사용자 데이터 저장 구조
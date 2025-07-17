# 📡 API 문서

## 클래스 API 문서

### QuickDecisionGame 클래스

게임의 핵심 로직을 담당하는 메인 클래스입니다.

#### 생성자 (Constructor)

```javascript
new QuickDecisionGame()
```

게임 인스턴스를 생성하고 초기 상태를 설정합니다.

**초기 상태:**
- `score`: 0
- `round`: 1
- `lives`: 3
- `gameMode`: 'mixed'
- `currentQuestion`: null
- `startTime`: 0
- `reactionTimes`: []
- `timer`: null
- `timeLeft`: 1.5

#### 공개 메서드 (Public Methods)

##### init()
```javascript
game.init()
```
게임을 초기화하고 이벤트 리스너를 설정합니다.

##### startGame()
```javascript
game.startGame()
```
새 게임을 시작합니다. 모든 상태를 초기화하고 첫 번째 라운드를 시작합니다.

##### nextRound()
```javascript
game.nextRound()
```
다음 라운드로 진행합니다. 생명이 0 이하이면 게임 종료 화면으로 이동합니다.

##### resetGame()
```javascript
game.resetGame()
```
게임을 완전히 초기화하고 시작 화면으로 돌아갑니다.

##### shareScore()
```javascript
game.shareScore()
```
현재 게임 결과를 공유합니다. Web Share API 또는 클립보드 복사를 사용합니다.

#### 문제 생성 메서드

##### generateQuestion()
```javascript
game.generateQuestion()
```
현재 게임 모드에 따라 적절한 문제를 생성합니다.

**지원하는 모드:**
- `'math'`: 수학 문제
- `'color'`: 색깔 문제  
- `'word'`: 단어 문제
- `'mixed'`: 랜덤 모드

##### generateMathQuestion()
```javascript
game.generateMathQuestion()
```
수학 문제를 생성합니다.

**하위 유형:**
- `basic`: 기본 연산 (+, -, ×, ÷)
- `sequence`: 수열 문제
- `comparison`: 크기 비교
- `fraction`: 분수 변환

##### generateColorQuestion()
```javascript
game.generateColorQuestion()
```
색깔 관련 문제를 생성합니다.

**하위 유형:**
- `stroop`: 스트룹 테스트
- `mixing`: 색상 혼합
- `shade`: 색조 구분
- `rainbow`: 무지개 순서

##### generateWordQuestion()
```javascript
game.generateWordQuestion()
```
단어 관련 문제를 생성합니다.

**하위 유형:**
- `antonym`: 반대말
- `capital`: 수도
- `animal`: 동물
- `food`: 음식
- `korean`: 한국어
- `english`: 영어

#### 게임 플로우 메서드

##### selectAnswer(selectedAnswer, buttonElement)
```javascript
game.selectAnswer("답", buttonElement)
```
사용자가 선택한 답을 처리합니다.

**매개변수:**
- `selectedAnswer` (string): 선택된 답
- `buttonElement` (HTMLElement): 클릭된 버튼 요소

##### startTimer()
```javascript
game.startTimer()
```
1.5초 타이머를 시작합니다. 10ms 간격으로 업데이트됩니다.

##### timeUp()
```javascript
game.timeUp()
```
시간이 초과되었을 때 호출됩니다. 자동으로 오답 처리합니다.

#### UI 업데이트 메서드

##### displayQuestion()
```javascript
game.displayQuestion()
```
현재 문제를 화면에 표시합니다.

##### showResult(isCorrect, reactionTime)
```javascript
game.showResult(true, 0.8)
```
라운드 결과를 표시합니다.

**매개변수:**
- `isCorrect` (boolean): 정답 여부
- `reactionTime` (number): 반응 시간 (초)

##### updateStats()
```javascript
game.updateStats()
```
게임 통계 (점수, 라운드, 생명)를 업데이트합니다.

##### showScreen(screenId)
```javascript
game.showScreen('questionScreen')
```
지정된 화면을 표시합니다.

**화면 ID:**
- `'startScreen'`: 시작 화면
- `'questionScreen'`: 문제 화면
- `'resultScreen'`: 결과 화면
- `'gameOverScreen'`: 게임 종료 화면

#### 유틸리티 메서드

##### generateWrongAnswers(correct, count)
```javascript
game.generateWrongAnswers(42, 3)
```
정답을 기준으로 오답 선택지를 생성합니다.

**매개변수:**
- `correct` (number): 정답
- `count` (number): 생성할 오답 개수

**반환값:** `Array<number>` - 오답 배열

## 데이터 구조

### 문제 객체 (Question Object)
```javascript
{
  text: "문제 텍스트",           // string
  options: ["선택지1", "선택지2", "선택지3", "선택지4"], // Array<string>
  correct: "정답"               // string
}
```

### 게임 상태 (Game State)
```javascript
{
  score: 0,                     // number - 현재 점수
  round: 1,                     // number - 현재 라운드
  lives: 3,                     // number - 남은 생명
  gameMode: 'mixed',            // string - 게임 모드
  currentQuestion: null,        // Question | null - 현재 문제
  startTime: 0,                 // number - 문제 시작 시간
  reactionTimes: [],            // Array<number> - 반응 시간 기록
  timer: null,                  // number | null - 타이머 ID
  timeLeft: 1.5                 // number - 남은 시간
}
```

## 이벤트 시스템

### DOM 이벤트

#### 게임 모드 선택
```javascript
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // 모드 변경 로직
  });
});
```

#### 게임 시작
```javascript
document.getElementById('startBtn').addEventListener('click', () => {
  game.startGame();
});
```

#### 답 선택
```javascript
button.addEventListener('click', () => {
  game.selectAnswer(option, button);
});
```

#### 다음 라운드
```javascript
document.getElementById('nextBtn').addEventListener('click', () => {
  game.nextRound();
});
```

#### 게임 재시작
```javascript
document.getElementById('restartBtn').addEventListener('click', () => {
  game.resetGame();
});
```

#### 점수 공유
```javascript
document.getElementById('shareBtn').addEventListener('click', () => {
  game.shareScore();
});
```

## 점수 계산 공식

### 기본 점수 계산
```javascript
const baseScore = 100;
const timeBonus = Math.max(0, Math.floor((1.5 - reactionTime) * 100));
const roundBonus = round * 10;
const totalScore = baseScore + timeBonus + roundBonus;
```

### 평균 반응시간 계산
```javascript
const avgReactionTime = reactionTimes.length > 0
  ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
  : 0;
```

## 브라우저 호환성

### 필수 기능
- ES6+ 클래스 문법
- `setInterval` / `clearInterval`
- `Date.now()`
- DOM 조작 메서드
- CSS3 애니메이션

### 선택적 기능
- Web Share API (공유 기능)
- Clipboard API (클립보드 복사)

### 지원 브라우저
- Chrome 49+
- Firefox 45+
- Safari 10+
- Edge 13+

## 에러 처리

### 타이머 정리
```javascript
// 컴포넌트 정리 시 타이머 해제
if (this.timer) {
  clearInterval(this.timer);
  this.timer = null;
}
```

### 공유 기능 폴백
```javascript
if (navigator.share) {
  // Web Share API 사용
  navigator.share(shareData);
} else {
  // 클립보드 복사 폴백
  navigator.clipboard.writeText(shareText);
}
```

## 성능 고려사항

### 메모리 관리
- 타이머 정리를 통한 메모리 누수 방지
- 이벤트 리스너 적절한 해제
- DOM 참조 최소화

### 렌더링 최적화
- CSS 애니메이션 활용
- DOM 조작 배치 처리
- 불필요한 리플로우 방지
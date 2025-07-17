class QuickDecisionGame {
    constructor() {
        this.score = 0;
        this.round = 1;
        this.lives = 3;
        this.gameMode = 'mixed';
        this.currentQuestion = null;
        this.startTime = 0;
        this.reactionTimes = [];
        this.timer = null;
        this.timeLeft = 1.5;
        


        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('startScreen');
    }

    setupEventListeners() {
        // 게임 모드 선택
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.gameMode = e.target.dataset.mode;
            });
        });

        // 게임 시작
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });

        // 다음 라운드
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextRound();
        });

        // 게임 재시작
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // 점수 공유
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareScore();
        });
    }

    startGame() {
        this.score = 0;
        this.round = 1;
        this.lives = 3;
        this.reactionTimes = [];
        this.updateStats();
        this.nextRound();
    }

    nextRound() {
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }

        this.generateQuestion();
        this.showScreen('questionScreen');
        this.startTimer();
    }

    generateQuestion() {
        const modes = this.gameMode === 'mixed' ? ['math', 'color', 'word'] : [this.gameMode];
        const selectedMode = modes[Math.floor(Math.random() * modes.length)];

        switch (selectedMode) {
            case 'math':
                this.generateMathQuestion();
                break;
            case 'color':
                this.generateColorQuestion();
                break;
            case 'word':
                this.generateWordQuestion();
                break;
        }
    }

    generateMathQuestion() {
        const mathTypes = ['basic', 'sequence', 'comparison', 'fraction'];
        const mathType = mathTypes[Math.floor(Math.random() * mathTypes.length)];
        
        if (mathType === 'basic') {
            this.generateBasicMath();
        } else if (mathType === 'sequence') {
            this.generateSequenceMath();
        } else if (mathType === 'comparison') {
            this.generateComparisonMath();
        } else {
            this.generateFractionMath();
        }
    }
    
    generateBasicMath() {
        const operations = ['+', '-', '×', '÷'];
        const operation = operations[Math.floor(Math.random() * operations.length)];

        let a, b, correctAnswer;

        if (operation === '+') {
            a = Math.floor(Math.random() * 80) + 1;
            b = Math.floor(Math.random() * 80) + 1;
            correctAnswer = a + b;
        } else if (operation === '-') {
            a = Math.floor(Math.random() * 80) + 20;
            b = Math.floor(Math.random() * (a - 1)) + 1;
            correctAnswer = a - b;
        } else if (operation === '×') {
            a = Math.floor(Math.random() * 15) + 1;
            b = Math.floor(Math.random() * 15) + 1;
            correctAnswer = a * b;
        } else {
            b = Math.floor(Math.random() * 12) + 1;
            correctAnswer = Math.floor(Math.random() * 20) + 1;
            a = b * correctAnswer;
        }

        const wrongAnswers = this.generateWrongAnswers(correctAnswer, 3);
        const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        this.currentQuestion = {
            text: `${a} ${operation} ${b} = ?`,
            options: allAnswers,
            correct: correctAnswer
        };

        this.displayQuestion();
    }
    
    generateSequenceMath() {
        const sequences = [
            { seq: [2, 4, 6, 8], next: 10, pattern: '+2' },
            { seq: [1, 3, 5, 7], next: 9, pattern: '+2' },
            { seq: [5, 10, 15, 20], next: 25, pattern: '+5' },
            { seq: [1, 4, 7, 10], next: 13, pattern: '+3' },
            { seq: [2, 6, 10, 14], next: 18, pattern: '+4' },
            { seq: [1, 2, 4, 8], next: 16, pattern: '×2' },
            { seq: [3, 6, 12, 24], next: 48, pattern: '×2' },
            { seq: [100, 90, 80, 70], next: 60, pattern: '-10' },
            { seq: [50, 45, 40, 35], next: 30, pattern: '-5' },
            { seq: [1, 1, 2, 3], next: 5, pattern: 'fibonacci' }
        ];
        
        const selected = sequences[Math.floor(Math.random() * sequences.length)];
        const wrongAnswers = [
            selected.next + 1,
            selected.next - 1,
            selected.next + Math.floor(Math.random() * 5) + 2
        ];
        const allAnswers = [selected.next, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: `다음 수는? ${selected.seq.join(', ')}, ?`,
            options: allAnswers,
            correct: selected.next
        };
        
        this.displayQuestion();
    }
    
    generateComparisonMath() {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        
        let correctAnswer;
        if (a > b) correctAnswer = '>';
        else if (a < b) correctAnswer = '<';
        else correctAnswer = '=';
        
        const allAnswers = ['>', '<', '=', '≠'].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: `${a} ? ${b}`,
            options: allAnswers,
            correct: correctAnswer
        };
        
        this.displayQuestion();
    }
    
    generateFractionMath() {
        const fractions = [
            { text: '1/2', decimal: 0.5, percent: '50%' },
            { text: '1/4', decimal: 0.25, percent: '25%' },
            { text: '3/4', decimal: 0.75, percent: '75%' },
            { text: '1/3', decimal: 0.33, percent: '33%' },
            { text: '2/3', decimal: 0.67, percent: '67%' },
            { text: '1/5', decimal: 0.2, percent: '20%' }
        ];
        
        const selected = fractions[Math.floor(Math.random() * fractions.length)];
        const questionTypes = ['toDecimal', 'toPercent'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        if (questionType === 'toDecimal') {
            const wrongAnswers = fractions
                .filter(f => f.decimal !== selected.decimal)
                .slice(0, 3)
                .map(f => f.decimal);
            const allAnswers = [selected.decimal, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            this.currentQuestion = {
                text: `${selected.text} = ?`,
                options: allAnswers,
                correct: selected.decimal
            };
        } else {
            const wrongAnswers = fractions
                .filter(f => f.percent !== selected.percent)
                .slice(0, 3)
                .map(f => f.percent);
            const allAnswers = [selected.percent, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            this.currentQuestion = {
                text: `${selected.text} = ?`,
                options: allAnswers,
                correct: selected.percent
            };
        }
        
        this.displayQuestion();
    }

    generateColorQuestion() {
        const colorTypes = ['stroop', 'mixing', 'shade', 'rainbow'];
        const colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
        
        if (colorType === 'stroop') {
            this.generateStroopTest();
        } else if (colorType === 'mixing') {
            this.generateColorMixing();
        } else if (colorType === 'shade') {
            this.generateShadeQuestion();
        } else {
            this.generateRainbowQuestion();
        }
    }
    
    generateStroopTest() {
        const colors = [
            { name: '빨강', color: '#ff4757', korean: '빨강' },
            { name: '파랑', color: '#3742fa', korean: '파랑' },
            { name: '초록', color: '#2ed573', korean: '초록' },
            { name: '노랑', color: '#ffa502', korean: '노랑' },
            { name: '보라', color: '#a55eea', korean: '보라' },
            { name: '주황', color: '#ff6348', korean: '주황' },
            { name: '분홍', color: '#ff3838', korean: '분홍' },
            { name: '갈색', color: '#8b4513', korean: '갈색' },
            { name: '회색', color: '#747d8c', korean: '회색' },
            { name: '검정', color: '#2f3542', korean: '검정' }
        ];

        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        const textColor = colors[Math.floor(Math.random() * colors.length)];

        const questionText = `<span style="color: ${textColor.color}; font-weight: bold; font-size: 2rem;">${targetColor.korean}</span>`;

        const wrongAnswers = colors
            .filter(c => c.korean !== textColor.korean)
            .slice(0, 3)
            .map(c => c.korean);

        const allAnswers = [textColor.korean, ...wrongAnswers].sort(() => Math.random() - 0.5);

        this.currentQuestion = {
            text: `이 글자의 색깔은?<br>${questionText}`,
            options: allAnswers,
            correct: textColor.korean
        };

        this.displayQuestion();
    }
    
    generateColorMixing() {
        const mixings = [
            { colors: ['빨강', '파랑'], result: '보라' },
            { colors: ['빨강', '노랑'], result: '주황' },
            { colors: ['파랑', '노랑'], result: '초록' },
            { colors: ['빨강', '하양'], result: '분홍' },
            { colors: ['검정', '하양'], result: '회색' },
            { colors: ['초록', '빨강'], result: '갈색' }
        ];
        
        const selected = mixings[Math.floor(Math.random() * mixings.length)];
        const wrongAnswers = ['보라', '주황', '초록', '분홍', '회색', '갈색']
            .filter(c => c !== selected.result)
            .slice(0, 3);
        
        const allAnswers = [selected.result, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: `${selected.colors[0]} + ${selected.colors[1]} = ?`,
            options: allAnswers,
            correct: selected.result
        };
        
        this.displayQuestion();
    }
    
    generateShadeQuestion() {
        const shades = [
            { light: '연분홍', dark: '진분홍', base: '분홍' },
            { light: '연파랑', dark: '진파랑', base: '파랑' },
            { light: '연초록', dark: '진초록', base: '초록' },
            { light: '연보라', dark: '진보라', base: '보라' }
        ];
        
        const selected = shades[Math.floor(Math.random() * shades.length)];
        const questionTypes = ['lighter', 'darker'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        if (questionType === 'lighter') {
            const wrongAnswers = shades
                .filter(s => s.light !== selected.light)
                .slice(0, 3)
                .map(s => s.light);
            const allAnswers = [selected.light, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            this.currentQuestion = {
                text: `${selected.base}보다 밝은 색은?`,
                options: allAnswers,
                correct: selected.light
            };
        } else {
            const wrongAnswers = shades
                .filter(s => s.dark !== selected.dark)
                .slice(0, 3)
                .map(s => s.dark);
            const allAnswers = [selected.dark, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            this.currentQuestion = {
                text: `${selected.base}보다 어두운 색은?`,
                options: allAnswers,
                correct: selected.dark
            };
        }
        
        this.displayQuestion();
    }
    
    generateRainbowQuestion() {
        const rainbow = ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라'];
        const position = Math.floor(Math.random() * rainbow.length);
        
        let questionText, correctAnswer;
        
        if (position === 0) {
            questionText = '무지개의 첫 번째 색은?';
            correctAnswer = rainbow[0];
        } else if (position === rainbow.length - 1) {
            questionText = '무지개의 마지막 색은?';
            correctAnswer = rainbow[rainbow.length - 1];
        } else {
            questionText = `무지개에서 ${rainbow[position - 1]} 다음 색은?`;
            correctAnswer = rainbow[position];
        }
        
        const wrongAnswers = rainbow
            .filter(c => c !== correctAnswer)
            .slice(0, 3);
        
        const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: questionText,
            options: allAnswers,
            correct: correctAnswer
        };
        
        this.displayQuestion();
    }

    generateWordQuestion() {
        const wordTypes = ['antonym', 'capital', 'animal', 'food', 'korean', 'english'];
        const wordType = wordTypes[Math.floor(Math.random() * wordTypes.length)];
        
        if (wordType === 'antonym') {
            this.generateAntonymQuestion();
        } else if (wordType === 'capital') {
            this.generateCapitalQuestion();
        } else if (wordType === 'animal') {
            this.generateAnimalQuestion();
        } else if (wordType === 'food') {
            this.generateFoodQuestion();
        } else if (wordType === 'korean') {
            this.generateKoreanQuestion();
        } else {
            this.generateEnglishQuestion();
        }
    }
    
    generateAntonymQuestion() {
        const antonyms = [
            { question: '반대말: 크다', answer: '작다', wrong: ['높다', '넓다', '길다'] },
            { question: '반대말: 빠르다', answer: '느리다', wrong: ['늦다', '천천히', '조용히'] },
            { question: '반대말: 밝다', answer: '어둡다', wrong: ['흐리다', '검다', '캄캄하다'] },
            { question: '반대말: 뜨겁다', answer: '차갑다', wrong: ['시원하다', '얼다', '춥다'] },
            { question: '반대말: 무겁다', answer: '가볍다', wrong: ['작다', '얇다', '적다'] },
            { question: '반대말: 높다', answer: '낮다', wrong: ['작다', '짧다', '얕다'] },
            { question: '반대말: 길다', answer: '짧다', wrong: ['작다', '좁다', '낮다'] },
            { question: '반대말: 넓다', answer: '좁다', wrong: ['작다', '짧다', '얇다'] },
            { question: '반대말: 많다', answer: '적다', wrong: ['없다', '조금', '부족하다'] },
            { question: '반대말: 어렵다', answer: '쉽다', wrong: ['간단하다', '편하다', '가볍다'] }
        ];
        
        const selected = antonyms[Math.floor(Math.random() * antonyms.length)];
        const allAnswers = [selected.answer, ...selected.wrong].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: selected.question,
            options: allAnswers,
            correct: selected.answer
        };
        
        this.displayQuestion();
    }
    
    generateCapitalQuestion() {
        const capitals = [
            { question: '수도: 프랑스', answer: '파리', wrong: ['런던', '베를린', '로마'] },
            { question: '수도: 일본', answer: '도쿄', wrong: ['오사카', '교토', '나고야'] },
            { question: '수도: 미국', answer: '워싱턴', wrong: ['뉴욕', '로스앤젤레스', '시카고'] },
            { question: '수도: 영국', answer: '런던', wrong: ['맨체스터', '리버풀', '버밍엄'] },
            { question: '수도: 독일', answer: '베를린', wrong: ['뮌헨', '함부르크', '쾰른'] },
            { question: '수도: 이탈리아', answer: '로마', wrong: ['밀라노', '나폴리', '베네치아'] },
            { question: '수도: 스페인', answer: '마드리드', wrong: ['바르셀로나', '세비야', '발렌시아'] },
            { question: '수도: 중국', answer: '베이징', wrong: ['상하이', '광저우', '선전'] },
            { question: '수도: 러시아', answer: '모스크바', wrong: ['상트페테르부르크', '노보시비르스크', '예카테린부르크'] },
            { question: '수도: 호주', answer: '캔버라', wrong: ['시드니', '멜버른', '브리즈번'] }
        ];
        
        const selected = capitals[Math.floor(Math.random() * capitals.length)];
        const allAnswers = [selected.answer, ...selected.wrong].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: selected.question,
            options: allAnswers,
            correct: selected.answer
        };
        
        this.displayQuestion();
    }
    
    generateAnimalQuestion() {
        const animals = [
            { question: '동물: 바다의 왕', answer: '고래', wrong: ['상어', '돌고래', '문어'] },
            { question: '동물: 정글의 왕', answer: '사자', wrong: ['호랑이', '표범', '치타'] },
            { question: '동물: 목이 가장 긴', answer: '기린', wrong: ['코끼리', '타조', '낙타'] },
            { question: '동물: 가장 큰 육지동물', answer: '코끼리', wrong: ['하마', '코뿔소', '기린'] },
            { question: '동물: 가장 빠른', answer: '치타', wrong: ['사자', '표범', '늑대'] },
            { question: '동물: 검은색과 흰색 줄무늬', answer: '얼룩말', wrong: ['호랑이', '표범', '하이에나'] },
            { question: '동물: 주머니가 있는', answer: '캥거루', wrong: ['코알라', '웜뱃', '오포섬'] },
            { question: '동물: 대나무를 먹는', answer: '판다', wrong: ['코알라', '원숭이', '곰'] },
            { question: '동물: 뿔이 하나인', answer: '코뿔소', wrong: ['사슴', '소', '염소'] },
            { question: '동물: 혹이 있는', answer: '낙타', wrong: ['코끼리', '하마', '코뿔소'] }
        ];
        
        const selected = animals[Math.floor(Math.random() * animals.length)];
        const allAnswers = [selected.answer, ...selected.wrong].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: selected.question,
            options: allAnswers,
            correct: selected.answer
        };
        
        this.displayQuestion();
    }
    
    generateFoodQuestion() {
        const foods = [
            { question: '과일: 빨갛고 둥글다', answer: '사과', wrong: ['토마토', '체리', '딸기'] },
            { question: '과일: 노랗고 길다', answer: '바나나', wrong: ['옥수수', '레몬', '파인애플'] },
            { question: '과일: 초록 껍질, 빨간 속', answer: '수박', wrong: ['멜론', '키위', '아보카도'] },
            { question: '과일: 오렌지색이고 둥글다', answer: '오렌지', wrong: ['감', '복숭아', '살구'] },
            { question: '채소: 주황색이고 길다', answer: '당근', wrong: ['고구마', '단호박', '옥수수'] },
            { question: '채소: 초록색이고 동그랗다', answer: '양배추', wrong: ['상추', '브로콜리', '시금치'] },
            { question: '곡물: 흰색이고 작다', answer: '쌀', wrong: ['보리', '밀', '콩'] },
            { question: '음료: 하얗고 영양가 높다', answer: '우유', wrong: ['두유', '요구르트', '치즈'] },
            { question: '고기: 바다에서 나는', answer: '생선', wrong: ['새우', '게', '조개'] },
            { question: '간식: 달고 갈색이다', answer: '초콜릿', wrong: ['캐러멜', '쿠키', '케이크'] }
        ];
        
        const selected = foods[Math.floor(Math.random() * foods.length)];
        const allAnswers = [selected.answer, ...selected.wrong].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: selected.question,
            options: allAnswers,
            correct: selected.answer
        };
        
        this.displayQuestion();
    }
    
    generateKoreanQuestion() {
        const korean = [
            { question: '계절: 눈이 온다', answer: '겨울', wrong: ['가을', '봄', '여름'] },
            { question: '계절: 꽃이 핀다', answer: '봄', wrong: ['여름', '가을', '겨울'] },
            { question: '계절: 가장 덥다', answer: '여름', wrong: ['봄', '가을', '겨울'] },
            { question: '계절: 단풍이 든다', answer: '가을', wrong: ['봄', '여름', '겨울'] },
            { question: '방향: 해가 뜨는 곳', answer: '동쪽', wrong: ['서쪽', '남쪽', '북쪽'] },
            { question: '방향: 해가 지는 곳', answer: '서쪽', wrong: ['동쪽', '남쪽', '북쪽'] },
            { question: '시간: 하루의 시작', answer: '아침', wrong: ['점심', '저녁', '밤'] },
            { question: '시간: 하루의 끝', answer: '밤', wrong: ['아침', '점심', '저녁'] },
            { question: '가족: 아버지의 아버지', answer: '할아버지', wrong: ['삼촌', '외할아버지', '아저씨'] },
            { question: '가족: 어머니의 어머니', answer: '할머니', wrong: ['이모', '외할머니', '고모'] }
        ];
        
        const selected = korean[Math.floor(Math.random() * korean.length)];
        const allAnswers = [selected.answer, ...selected.wrong].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: selected.question,
            options: allAnswers,
            correct: selected.answer
        };
        
        this.displayQuestion();
    }
    
    generateEnglishQuestion() {
        const english = [
            { question: '영어: 안녕하세요', answer: 'Hello', wrong: ['Goodbye', 'Thank you', 'Sorry'] },
            { question: '영어: 감사합니다', answer: 'Thank you', wrong: ['Hello', 'Goodbye', 'Please'] },
            { question: '영어: 죄송합니다', answer: 'Sorry', wrong: ['Hello', 'Thank you', 'Excuse me'] },
            { question: '영어: 사과', answer: 'Apple', wrong: ['Orange', 'Banana', 'Grape'] },
            { question: '영어: 고양이', answer: 'Cat', wrong: ['Dog', 'Bird', 'Fish'] },
            { question: '영어: 개', answer: 'Dog', wrong: ['Cat', 'Bird', 'Fish'] },
            { question: '영어: 물', answer: 'Water', wrong: ['Fire', 'Air', 'Earth'] },
            { question: '영어: 책', answer: 'Book', wrong: ['Pen', 'Paper', 'Desk'] },
            { question: '영어: 학교', answer: 'School', wrong: ['Home', 'Park', 'Store'] },
            { question: '영어: 친구', answer: 'Friend', wrong: ['Family', 'Teacher', 'Student'] }
        ];
        
        const selected = english[Math.floor(Math.random() * english.length)];
        const allAnswers = [selected.answer, ...selected.wrong].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            text: selected.question,
            options: allAnswers,
            correct: selected.answer
        };
        
        this.displayQuestion();
    }

    generateWrongAnswers(correct, count) {
        const wrongAnswers = [];
        while (wrongAnswers.length < count) {
            const wrong = correct + Math.floor(Math.random() * 20) - 10;
            if (wrong !== correct && !wrongAnswers.includes(wrong) && wrong > 0) {
                wrongAnswers.push(wrong);
            }
        }
        return wrongAnswers;
    }

    displayQuestion() {
        document.getElementById('questionText').innerHTML = this.currentQuestion.text;
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        this.currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(option, button));
            optionsContainer.appendChild(button);
        });
    }

    startTimer() {
        this.startTime = Date.now();
        this.timeLeft = 1.5;
        const timerFill = document.getElementById('timerFill');
        const timeDisplay = document.getElementById('timeLeft');

        this.timer = setInterval(() => {
            this.timeLeft -= 0.01;
            const percentage = (this.timeLeft / 1.0) * 100;

            timerFill.style.width = `${Math.max(0, percentage)}%`;
            timeDisplay.textContent = Math.max(0, this.timeLeft).toFixed(1);

            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 10);
    }

    selectAnswer(selectedAnswer, buttonElement) {
        clearInterval(this.timer);
        const reactionTime = (Date.now() - this.startTime) / 1000;
        this.reactionTimes.push(reactionTime);

        const isCorrect = selectedAnswer === this.currentQuestion.correct;

        // 모든 버튼 비활성화
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.style.pointerEvents = 'none';
        });

        // 정답/오답 표시
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.handleCorrectAnswer(reactionTime);
        } else {
            buttonElement.classList.add('wrong');
            // 정답 버튼 표시
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.textContent === this.currentQuestion.correct) {
                    btn.classList.add('correct');
                }
            });
            this.handleWrongAnswer(reactionTime);
        }

        setTimeout(() => {
            this.showResult(isCorrect, reactionTime);
        }, 1000);
    }

    timeUp() {
        clearInterval(this.timer);
        this.reactionTimes.push(1.0);

        // 정답 표시
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.style.pointerEvents = 'none';
            if (btn.textContent === this.currentQuestion.correct) {
                btn.classList.add('correct');
            }
        });

        this.handleWrongAnswer(1.0);

        setTimeout(() => {
            this.showResult(false, 1.0);
        }, 1000);
    }

    handleCorrectAnswer(reactionTime) {
        const timeBonus = Math.max(0, Math.floor((1.5 - reactionTime) * 100));
        const roundBonus = this.round * 10;
        const totalPoints = 100 + timeBonus + roundBonus;

        this.score += totalPoints;
        this.updateStats();
    }

    handleWrongAnswer(_reactionTime) {
        this.lives--;
        this.updateStats();
    }

    showResult(isCorrect, reactionTime) {
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const reactionTimeDisplay = document.getElementById('reactionTime');
        const earnedPoints = document.getElementById('earnedPoints');

        if (isCorrect) {
            const timeBonus = Math.max(0, Math.floor((1.0 - reactionTime) * 100));
            const roundBonus = this.round * 10;
            const totalPoints = 100 + timeBonus + roundBonus;

            resultTitle.textContent = '🎉 정답!';
            resultTitle.style.color = '#4CAF50';
            resultMessage.textContent = '훌륭합니다! 빠른 판단력이네요!';
            earnedPoints.textContent = `+${totalPoints}`;
            earnedPoints.style.color = '#4CAF50';
        } else {
            resultTitle.textContent = '❌ 틀렸습니다';
            resultTitle.style.color = '#f44336';
            if (reactionTime >= 1.0) {
                resultMessage.textContent = '시간이 초과되었습니다!';
            } else {
                resultMessage.textContent = '다음에는 더 신중하게 생각해보세요!';
            }
            earnedPoints.textContent = '+0';
            earnedPoints.style.color = '#f44336';
        }

        reactionTimeDisplay.textContent = `${reactionTime.toFixed(2)}초`;

        this.showScreen('resultScreen');

        // 다음 라운드 준비
        this.round++;
        this.updateStats();
    }

    gameOver() {
        const finalScore = document.getElementById('finalScore');
        const finalRound = document.getElementById('finalRound');
        const avgReactionTime = document.getElementById('avgReactionTime');

        finalScore.textContent = this.score;
        finalRound.textContent = this.round - 1;

        const avgTime = this.reactionTimes.length > 0
            ? (this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length).toFixed(2)
            : '0.00';
        avgReactionTime.textContent = `${avgTime}초`;



        this.showScreen('gameOverScreen');
    }

    resetGame() {
        this.score = 0;
        this.round = 1;
        this.lives = 3;
        this.reactionTimes = [];
        this.updateStats();
        this.showScreen('startScreen');
    }

    shareScore() {
        const shareText = `🎮 1.5초 결정 게임 결과!\n⚡ 점수: ${this.score}점\n🏆 라운드: ${this.round - 1}\n⏱️ 평균 반응시간: ${this.reactionTimes.length > 0 ? (this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length).toFixed(2) : '0.00'}초\n\n당신도 도전해보세요!`;

        if (navigator.share) {
            navigator.share({
                title: '1.5초 결정 게임 결과',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('결과가 클립보드에 복사되었습니다!');
            });
        }
    }

    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('round').textContent = this.round;

        const heartsDisplay = '❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives);
        document.getElementById('lives').textContent = heartsDisplay;
    }

    showScreen(screenId) {
        document.querySelectorAll('.start-screen, .question-screen, .result-screen, .game-over-screen')
            .forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }


}

// 게임 시작
const game = new QuickDecisionGame();
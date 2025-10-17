document.addEventListener('DOMContentLoaded', () => {
    // Screen elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    // Buttons
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const purchaseLink = document.getElementById('purchase-link');

    // Form selections
    const genderOptions = document.querySelectorAll('.option[data-group="gender"]');
    const ageOptions = document.querySelectorAll('.option[data-group="age"]');

    // Quiz elements
    const progressBar = document.getElementById('progress');
    const questionText = document.getElementById('question-text');
    const answerOptionsContainer = document.getElementById('answer-options');

    // Result elements
    const resultImg = document.getElementById('result-img');
    const scentName = document.getElementById('scent-name');
    const mbtiTypeDisplay = document.getElementById('mbti-type');
    const scentDescription = document.getElementById('scent-description');

    let userGender = null;
    let userAge = null;
    let currentQuestionIndex = 0;
    let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    let activeQuestionSet = [];

    const scents = {
        '백화산 (Mountain Mist)': { img: '1.백화산.jpg', desc: '계획적이고 전략적인 당신에게, 숲의 고요함은 머릿속의 복잡함을 맑게 정리해 줍니다. 레몬유칼립투스의 깔끔한 향이 깊은 사고와 집중을 도와주는 숲속 명상 같은 시간.' },
        '할미·할아비바위 (Eternal Love)': { img: '8.할미 할아비바위.jpg', desc: '섬세한 감성과 깊은 내면을 가진 당신에게, 장미와 바닐라의 향은 오래된 사랑의 기억처럼 따뜻하게 스며듭니다. 감정이 흐르고 머물 수 있는 공간 같은 향기.' },
        '안흥진성 (Ocean Wake)': { img: '2. 안흥진성.jpg', desc: '분명하고 책임감 있는 당신에게, 바다의 기운이 새로운 결단의 힘이 되어줍니다. 페퍼민트와 유칼립투스가 머릿속을 정리하고 나아갈 방향을 선명하게 밝혀줍니다.' },
        '안면송림 (Pine Whisper)': { img: '3.안면송림.jpg', desc: '배려 깊고 따뜻한 당신에게, 소나무 숲의 향은 마음에 잔잔한 안식을 선물합니다. 피톤치드의 부드러운 울림이 온기를 품은 안정감을 만들어줍니다.' },
        '만리포 (Sunset Breeze)': { img: '4.만리포.jpg', desc: '사람을 이끄는 따뜻한 리더십을 가진 당신에게, 노을빛 향기는 정서적 공감을 넓히는 다리입니다. 유자와 오렌지의 부드러운 감귤향은 마음을 열고 포용하게 합니다.' },
        '신두사구 (Golden Sand)': { img: '5.신두사구.jpg', desc: '감성이 풍부한 당신에게, 따사로운 모래의 향기는 예술적인 상상을 자극합니다. 프랑킨센스와 샌달우드의 조화는 내면의 감정을 부드럽게 꺼내줍니다.' },
        '가의도 (Island Bloom)': { img: '6.가의도.jpg', desc: '아이디어가 넘치는 당신에게, 햇살 속 꽃내음은 영감을 가득 품은 아침 같은 향. 시트러스와 꽃향이 긍정 에너지를 더해줍니다.' },
        '몽산해변 (Wave of Sleep)': { img: '7.몽산해변.jpg', desc: '깊이 있는 통찰과 감성을 가진 당신에게, 파도에 잠긴 향기는 내면의 평화를 회복시켜 줍니다. 네롤리와 라벤더가 조용한 밤의 안식처가 되어줍니다.' },
    };

    const mbtiScentMapping = {
        INTJ: '백화산 (Mountain Mist)', ESFP: '백화산 (Mountain Mist)',
        INFP: '할미·할아비바위 (Eternal Love)', ESTP: '할미·할아비바위 (Eternal Love)',
        ESTJ: '안흥진성 (Ocean Wake)', INFP: '안흥진성 (Ocean Wake)',
        ISFJ: '안면송림 (Pine Whisper)', ENTP: '안면송림 (Pine Whisper)',
        ENFJ: '만리포 (Sunset Breeze)', ISTP: '만리포 (Sunset Breeze)',
        ISFP: '신두사구 (Golden Sand)', ENTJ: '신두사구 (Golden Sand)',
        ENFP: '가의도 (Island Bloom)', ISTJ: '가의도 (Island Bloom)',
        INFJ: '몽산해변 (Wave of Sleep)', ESTP: '몽산해변 (Wave of Sleep)'
    };

    const questions = {
        tens: [
            { q: '주말에 친구가 갑자기 PC방 가자고 한다면?', a: [{t:'신난다! 바로 간다', v:'E'}, {t:'음.. 좀 피곤한데.. 다음에..', v:'I'}, {t:'다른 친구도 부를까? 같이가자!', v:'E'}, {t:'혼자 집에서 유튜브 보는게 좋은데..', v:'I'}] },
            { q: '시험공부 계획을 세울 때 나는?', a: [{t:'시험 전날까지 미루다 벼락치기 한다', v:'P'}, {t:'2주 전부터 과목별로 계획을 다 세운다', v:'J'}, {t:'중요한 과목만 대충 계획한다', v:'P'}, {t:'계획표 없으면 불안해서 공부가 안된다', v:'J'}] },
            { q: '새로운 게임이 출시됐다. 나의 선택은?', a: [{t:'일단 해본다. 재밌어 보인다', v:'S'}, {t:'게임의 세계관, 스토리가 더 중요하다', v:'N'}, {t:'유명 유튜버의 리뷰를 먼저 찾아본다', v:'S'}, {t:'이 게임이 앞으로 어떻게 될지 상상해본다', v:'N'}] },
            { q: '친구가 "나 머리 잘랐어" 라고 한다면?', a: [{t:'"오, 얼마주고 잘랐어?"', v:'T'}, {t:'"헐, 너무 잘어울린다! 예쁘다!"', v:'F'}, {t:'"음.. 전이 더 나은 것 같기도.."', v:'T'}, {t:'"분위기가 확 달라졌네! 좋아보여!"', v:'F'}] },
            { q: '내일 학교 갈 준비를 할 때 나는?', a: [{t:'자기 전에 미리 다 챙겨놓는다', v:'J'}, {t:'아침에 일어나서 허둥지둥 챙긴다', v:'P'}, {t:'시간표 맞춰서 교과서를 챙긴다', v:'J'}, {t:'일단 생각나는대로 가방에 넣는다', v:'P'}] },
            { q: '진로를 고민할 때, 나의 생각은?', a: [{t:'내가 뭘 잘하는지, 현실적으로 가능한게 뭘까?', v:'S'}, {t:'10년 뒤에 나는 뭘 하고 있을까? 어떤 사람이 되고 싶지?', v:'N'}, {t:'일단 성적 맞춰서 대학가야지', v:'S'}, {t:'돈 많이 버는 미래의 내 모습을 상상한다', v:'N'}] },
            { q: '조별 과제에서 갈등이 생겼을 때 나는?', a: [{t:'"싸우지 말고 좋게 해결하자" 분위기를 살핀다', v:'F'}, {t:'"누가 맞고 틀렸는지 확실하게 정하자"', v:'T'}, {t:'"다들 기분 안좋아보이네.." 눈치본다', v:'F'}, {t:'"자료에 따르면 이게 맞아" 팩트를 제시한다', v:'T'}] },
            { q: '학교 끝나고 집에 왔을 때, 나는?', a: [{t:'일단 친구에게 톡 보내서 수다 떤다', v:'E'}, {t:'방에 들어가서 혼자 조용히 쉰다', v:'I'}, {t:'오늘 있었던 일을 가족들에게 이야기한다', v:'E'}, {t:'혼자 노래를 듣거나 영상을 보며 재충전한다', v:'I'}] },
        ],
        twentiesThirties: [
            { q: '주말 약속, 당신의 선택은?', a: [{t:'활기찬 모임에서 새로운 사람들을 만난다', v:'E'}, {t:'집에서 편안하게 OTT를 보며 휴식한다', v:'I'}, {t:'친구들과의 약속을 손꼽아 기다린다', v:'E'}, {t:'혼자만의 시간을 보내며 에너지를 충전한다', v:'I'}] },
            { q: '여행 계획을 세울 때 당신은?', a: [{t:'항공권과 숙소만 예약하고 자유롭게 다닌다', v:'P'}, {t:'분 단위로 동선과 맛집을 정리한 엑셀 파일을 만든다', v:'J'}, {t:'가보고 싶은 곳 목록만 대충 만든다', v:'P'}, {t:'여행 가이드북처럼 완벽한 계획을 세워야 마음이 편하다', v:'J'}] },
            { q: '이직을 고민할 때, 더 중요한 것은?', a: [{t:'회사의 성장 가능성과 비전', v:'N'}, {t:'당장의 연봉과 출퇴근 거리', v:'S'}, {t:'미래에 내가 어떻게 성장할 수 있을까?', v:'N'}, {t:'실제적인 업무 환경과 복지 혜택', v:'S'}] },
            { q: '친구가 힘든 일이 있다고 할 때, 당신의 반응은?', a: [{t:'"그래서 해결책은 생각해봤어?" 라며 방법을 제시한다', v:'T'}, {t:'"정말 힘들었겠다" 라며 감정에 깊이 공감한다', v:'F'}, {t:'객관적인 상황을 분석하고 조언한다', v:'T'}, {t:'따뜻한 말로 위로하며 곁에 있어준다', v:'F'}] },
            { q: '업무를 처리할 때, 당신의 스타일은?', a: [{t:'마감일이 닥쳤을 때 초인적인 힘을 발휘한다', v:'P'}, {t:'업무 시작 전에 모든 계획을 세팅해야 한다', v:'J'}, {t:'여러 일을 동시에 처리하며 즉흥적으로 해결한다', v:'P'}, {t:'주간 계획, 월간 계획을 세워 체계적으로 관리한다', v:'J'}] },
            { q: '새로운 것을 배울 때, 당신의 스타일은?', a: [{t:'일단 부딪혀보며 경험으로 배운다', v:'S'}, {t:'원리와 개념, 전체적인 그림을 먼저 이해한다', v:'N'}, {t:'실용적인 팁과 노하우 위주로 습득한다', v:'S'}, {t:'이 지식이 미래에 어떻게 연결될지 생각한다', v:'N'}] },
            { q: '회의 중 의견 대립이 있을 때, 당신은?', a: [{t:'"좋은 게 좋은 거지" 팀의 조화를 우선시한다', v:'F'}, {t:'가장 효율적이고 논리적인 결론을 도출하려 한다', v:'T'}, {t:'상대방의 기분이 상하지 않게 돌려 말한다', v:'F'}, {t:'감정 배제하고 데이터에 기반하여 토론한다', v:'T'}] },
            { q: '퇴근 후, 당신은 주로 무엇을 하나요?', a: [{t:'약속 장소로 달려가 사람들과 어울린다', v:'E'}, {t:'집에 와서 방해받지 않고 조용히 쉰다', v:'I'}, {t:'동호회나 스터디 등 외부 활동을 즐긴다', v:'E'}, {t:'혼자만의 취미 생활에 깊이 몰두한다', v:'I'}] },
        ],
        fortiesFifties: [
            { q: '오랜만에 찾아온 휴일, 어떻게 보내시겠어요?', a: [{t:'가족, 친구들과 함께 시간을 보낸다', v:'E'}, {t:'혼자 조용히 재충전의 시간을 갖는다', v:'I'}, {t:'평소 가보고 싶었던 곳으로 떠난다', v:'E'}, {t:'집에서 편안하게 휴식을 취한다', v:'I'}] },
            { q: '건강 관리를 위해 새로운 운동을 시작한다면?', a: [{t:'꼼꼼하게 계획을 세우고 꾸준히 실천한다', v:'J'}, {t:'그날의 컨디션에 따라 자유롭게 운동한다', v:'P'}, {t:'목표를 정하고 체계적으로 관리한다', v:'J'}, {t:'마음이 내킬 때 즉흥적으로 시작한다', v:'P'}] },
            { q: '자녀 혹은 가까운 후배가 진로 고민을 한다면?', a: [{t:'현실적인 조언과 구체적인 정보를 제공한다', v:'S'}, {t:'다양한 가능성을 열어두고 꿈을 지지한다', v:'N'}, {t:'안정적인 길을 가는 것이 좋다고 말해준다', v:'S'}, {t:'스스로의 잠재력을 믿으라고 격려한다', v:'N'}] },
            { q: '힘든 결정을 내려야 할 때, 가장 중요한 것은?', a: [{t:'나와 주변 사람들에게 미칠 영향을 고려한다', v:'F'}, {t:'무엇이 가장 합리적이고 올바른 결정인지 따져본다', v:'T'}, {t:'마음이 시키는 대로, 끌리는 대로 결정한다', v:'F'}, {t:'객관적 데이터와 사실에 근거하여 판단한다', v:'T'}] },
            { q: '은퇴 후의 삶을 상상해본다면?', a: [{t:'구체적인 계획과 자금 계획을 세운다', v:'J'}, {t:'그때 가보면 알겠지, 흘러가는 대로 살고 싶다', v:'P'}, {t:'미리 제2의 인생 계획을 준비한다', v:'J'}, {t:'상상만으로도 즐겁다, 자유롭게 살고 싶다', v:'P'}] },
            { q: '과거를 돌아볼 때, 주로 어떤 생각이 드시나요?', a: [{t:'"그때 이랬더라면.." 미래를 위한 교훈을 얻는다', v:'N'}, {t:'"그런 일도 있었지" 있었던 사실 그대로를 기억한다', v:'S'}, {t:'과거의 경험들이 현재에 미치는 의미를 생각한다', v:'N'}, {t:'좋았던 기억, 즐거웠던 추억을 떠올린다', v:'S'}] },
            { q: '주변 사람들은 나를 어떤 사람이라고 말하나요?', a: [{t:'따뜻하고 인정이 많은 사람', v:'F'}, {t:'논리적이고 분석적인 사람', v:'T'}, {t:'다른 사람의 말을 잘 들어주는 사람', v:'F'}, {t:'이성적이고 명확한 사람', v:'T'}] },
            { q: '오랜만에 만난 친구들과의 대화, 당신의 역할은?', a: [{t:'주로 대화를 주도하며 분위기를 이끈다', v:'E'}, {t:'주로 다른 사람의 이야기를 듣는 편이다', v:'I'}, {t:'오랜만인 친구들에게 먼저 다가가 말을 건다', v:'E'}, {t:'소수의 친구와 깊이 있는 대화를 나눈다', v:'I'}] },
        ],
        senior: [
            { q: '혼자 있는 시간보다 사람들과 어울리는 것이 더 즐겁다.', a: [{t:'네', v:'E'}, {t:'아니오', v:'I'}] },
            { q: '과거의 경험을 통해 문제를 해결하는 편이다.', a: [{t:'네', v:'S'}, {t:'아니오', v:'N'}] },
            { q: '어떤 일이든 미리 계획을 세워야 마음이 편하다.', a: [{t:'네', v:'J'}, {t:'아니오', v:'P'}] },
            { q: '다른 사람의 감정을 이해하고 위로하는 것을 잘한다.', a: [{t:'네', v:'F'}, {t:'아니오', v:'T'}] },
            { q: '새로운 방식보다는 익숙한 방식이 더 편하고 좋다.', a: [{t:'네', v:'S'}, {t:'아니오', v:'N'}] },
        ]
    };

    // --- Event Listeners ---

    function checkSelections() {
        if (userGender && userAge) {
            startBtn.disabled = false;
        }
    }

    genderOptions.forEach(option => {
        option.addEventListener('click', () => {
            genderOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            userGender = option.dataset.value;
            checkSelections();
        });
    });

    ageOptions.forEach(option => {
        option.addEventListener('click', () => {
            ageOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            userAge = option.dataset.value;
            checkSelections();
        });
    });

    startBtn.addEventListener('click', () => {
        switch (userAge) {
            case '10s':
                activeQuestionSet = questions.tens;
                break;
            case '20s':
            case '30s':
                activeQuestionSet = questions.twentiesThirties;
                break;
            case '40s':
            case '50s':
                activeQuestionSet = questions.fortiesFifties;
                break;
            case '60s+':
                activeQuestionSet = questions.senior;
                break;
            default:
                activeQuestionSet = questions.twentiesThirties; // Default case
        }
        
        switchScreen(startScreen, quizScreen);
        displayQuestion();
    });

    restartBtn.addEventListener('click', () => {
        resetQuiz();
        switchScreen(resultScreen, startScreen);
    });

    // --- Functions ---

    function switchScreen(from, to) {
        from.classList.remove('active');
        to.classList.add('active');
    }

    function displayQuestion() {
        const question = activeQuestionSet[currentQuestionIndex];
        questionText.textContent = question.q;
        answerOptionsContainer.innerHTML = '';

        question.a.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.t;
            button.classList.add('option', 'quiz-option');
            button.addEventListener('click', () => handleAnswer(answer.v));
            answerOptionsContainer.appendChild(button);
        });

        updateProgress();
    }

    function handleAnswer(value) {
        scores[value]++;
        currentQuestionIndex++;

        if (currentQuestionIndex < activeQuestionSet.length) {
            displayQuestion();
        } else {
            displayResult();
            switchScreen(quizScreen, resultScreen);
        }
    }

    function updateProgress() {
        const progress = (currentQuestionIndex / activeQuestionSet.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function calculateMbti() {
        let mbti = '';
        mbti += scores.E > scores.I ? 'E' : 'I';
        mbti += scores.S > scores.N ? 'S' : 'N';
        mbti += scores.T > scores.F ? 'T' : 'F';
        mbti += scores.J > scores.P ? 'J' : 'P';
        return mbti;
    }

    function displayResult() {
        const mbtiResult = calculateMbti();
        const finalScentName = mbtiScentMapping[mbtiResult];
        const scentData = scents[finalScentName];

        mbtiTypeDisplay.textContent = mbtiResult;
        scentName.textContent = finalScentName;
        scentDescription.textContent = scentData.desc;
        resultImg.src = `t8/사진/${scentData.img}`;
        purchaseLink.href = 'https://smartstore.naver.com/makanature/category/1c62f089aed3466692e2b3357212df06?cp=1';
    }

    function resetQuiz() {
        userGender = null;
        userAge = null;
        currentQuestionIndex = 0;
        scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        activeQuestionSet = [];
        startBtn.disabled = true;
        progressBar.style.width = '0%';
        document.querySelectorAll('.option.selected').forEach(o => o.classList.remove('selected'));
    }
});
    "use strict";
    /* ==================================================================
       QUESTION DATA - loaded from questions.json
       ================================================================== */
    let QUESTIONS = [];

    async function loadQuestions() {
        const resp = await fetch('questions.json');
        QUESTIONS = await resp.json();
    }

    /* ==================================================================
       MOCK EXAM & SHUFFLE UTILITIES
       ================================================================== */
    let wrongShuffleCache = {};
    let examTimerId = null;

    function getWrongShuffledQuestion(question, qIndex) {
        if (question.type === 'judge') return question;
        if (wrongShuffleCache[qIndex]) {
            return wrongShuffleCache[qIndex];
        }

        var originalOptions = question.options.slice();
        var shuffledOptions = originalOptions.slice();
        
        for (var i = shuffledOptions.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffledOptions[i];
            shuffledOptions[i] = shuffledOptions[j];
            shuffledOptions[j] = temp;
        }

        var correctTexts = new Set();
        originalOptions.forEach(function(opt) {
            if (question.answer.indexOf(opt.label) !== -1) {
                correctTexts.add(opt.text);
            }
        });

        var newOptions = shuffledOptions.map(function(opt, idx) {
            var newLabel = String.fromCharCode(65 + idx);
            return {
                label: newLabel,
                text: opt.text
            };
        });

        var newAnswerChars = [];
        newOptions.forEach(function(opt) {
            if (correctTexts.has(opt.text)) {
                newAnswerChars.push(opt.label);
            }
        });
        var newAnswer = newAnswerChars.sort().join('');

        var shuffledQuestion = Object.assign({}, question, {
            options: newOptions,
            answer: newAnswer
        });

        wrongShuffleCache[qIndex] = shuffledQuestion;
        return shuffledQuestion;
    }

    function generateExamPaper() {
        var judgeIndices = [];
        var singleIndices = [];
        var multiIndices = [];

        for (var i = 0; i < QUESTIONS.length; i++) {
            var q = QUESTIONS[i];
            if (q.type === 'judge') judgeIndices.push(i);
            else if (q.type === 'single') singleIndices.push(i);
            else if (q.type === 'multi') multiIndices.push(i);
        }

        function getRandomSubarray(arr, size) {
            var shuffled = arr.slice();
            for (var i = shuffled.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = shuffled[i];
                shuffled[i] = shuffled[j];
                shuffled[j] = temp;
            }
            return shuffled.slice(0, size);
        }

        var selectedJudges = getRandomSubarray(judgeIndices, 20);
        var selectedSingles = getRandomSubarray(singleIndices, 40);
        var selectedMultis = getRandomSubarray(multiIndices, 20);

        return selectedJudges.concat(selectedSingles).concat(selectedMultis);
    }

    function startExamTimer() {
        if (examTimerId) clearInterval(examTimerId);
        
        examTimerId = setInterval(function() {
            var state = State.getCurrent();
            if (!state || !state.exam || !state.exam.inExam || state.exam.isCompleted) {
                clearInterval(examTimerId);
                examTimerId = null;
                return;
            }

            var elapsed = Math.floor((Date.now() - new Date(state.exam.startTime).getTime()) / 1000);
            var timeLeft = state.exam.duration - elapsed;

            if (timeLeft <= 0) {
                timeLeft = 0;
                state.exam.timeLeft = 0;
                clearInterval(examTimerId);
                examTimerId = null;
                State.persist();
                submitExam(true);
            } else {
                state.exam.timeLeft = timeLeft;
                if (timeLeft % 5 === 0) {
                    State.persist();
                }
            }
            UI.renderExamTimer();
        }, 1000);
    }

    function stopExamTimer() {
        if (examTimerId) {
            clearInterval(examTimerId);
            examTimerId = null;
        }
    }

    function submitExam(isForce) {
        var state = State.getCurrent();
        if (!state || !state.exam || !state.exam.inExam || state.exam.isCompleted) return;

        stopExamTimer();
        state.exam.isCompleted = true;
        state.exam.submitTime = new Date().toISOString();

        var score = 0;
        var correctCount = 0;
        var wrongCount = 0;

        var examQuestions = state.exam.questions;
        for (var i = 0; i < examQuestions.length; i++) {
            var qIdx = examQuestions[i];
            var q = QUESTIONS[qIdx];
            var userAns = state.exam.userAnswers[qIdx];

            if (userAns !== undefined) {
                var isCorrect = (userAns === q.answer);
                if (isCorrect) {
                    correctCount++;
                    if (q.type === 'judge') score += 1;
                    else if (q.type === 'single') score += 1;
                    else if (q.type === 'multi') score += 2;
                    Storage.removeWrong(qIdx);
                } else {
                    wrongCount++;
                    Storage.saveWrong(qIdx);
                    Storage.saveHistory({
                        questionIndex: qIdx,
                        userAnswer: userAns,
                        correctAnswer: q.answer,
                        isCorrect: false,
                        timestamp: new Date().toISOString()
                    });
                }
            } else {
                wrongCount++;
                Storage.saveWrong(qIdx);
            }
        }

        state.exam.score = score;
        state.exam.isReviewMode = true;
        State.persist();

        document.body.classList.add('review-mode');
        UI.render();

        if (isForce) {
            UI.showToast('答题时间已到，系统已自动交卷！', 'error');
        } else {
            UI.showToast('交卷成功！', 'success');
        }

        showExamReportModal(score, correctCount, wrongCount);
    }

    function showExamReportModal(score, correctCount, wrongCount) {
        var state = State.getCurrent();
        var isPass = score >= 60;
        var badgeClass = isPass ? 'pass' : 'fail';
        var badgeText = isPass ? '考试及格' : '不及格';
        
        var start = new Date(state.exam.startTime).getTime();
        var end = state.exam.submitTime ? new Date(state.exam.submitTime).getTime() : Date.now();
        var durationSec = Math.floor((end - start) / 1000);
        var durationText = Math.floor(durationSec / 60) + '分' + (durationSec % 60) + '秒';

        var html = '<div class="exam-report">' +
            '<div class="report-header">' +
            '<span class="report-badge ' + badgeClass + '">' + badgeText + '</span>' +
            '<div class="report-score-box">' +
            '<span class="report-score">' + score + '<span class="score-unit">分</span></span>' +
            '</div>' +
            '<div class="report-title">三级人工智能训练师 模拟考试结果</div>' +
            '</div>' +
            '<div class="report-stats-grid">' +
            '<div class="report-stat-item">' +
            '<div class="stat-num">' + durationText + '</div>' +
            '<div class="stat-desc">考试用时</div>' +
            '</div>' +
            '<div class="report-stat-item">' +
            '<div class="stat-num">' + correctCount + ' 题</div>' +
            '<div class="stat-desc">答对题目</div>' +
            '</div>' +
            '<div class="report-stat-item">' +
            '<div class="stat-num">' + (80 - correctCount) + ' 题</div>' +
            '<div class="stat-desc">答错/未答</div>' +
            '</div>' +
            '</div>' +
            '<div class="report-btn-group">' +
            '<button class="report-btn btn-review" id="btnExamReview">查看卷子解析</button>' +
            '<button class="report-btn btn-exit" id="btnExamExit">退出考试模式</button>' +
            '</div></div>';

        Modal.open('考试成绩单', html);

        document.getElementById('btnExamReview').addEventListener('click', function() {
            Modal.close();
            state.currentIndex = 0;
            State.persist();
            UI.render();
        });

        document.getElementById('btnExamExit').addEventListener('click', function() {
            Modal.close();
            exitExamMode();
        });
    }

    function startExamMode() {
        if (!QUESTIONS || QUESTIONS.length === 0) return;

        var examQuestions = generateExamPaper();
        if (examQuestions.length === 0) {
            UI.showToast('题库加载中，请稍后再试', 'error');
            return;
        }

        var state = State.getCurrent();
        state.exam = {
            inExam: true,
            questions: examQuestions,
            userAnswers: {},
            startTime: new Date().toISOString(),
            duration: 3600,
            timeLeft: 3600,
            isCompleted: false,
            score: 0,
            submitTime: null,
            isReviewMode: false
        };

        state.order = examQuestions;
        state.currentIndex = 0;
        
        State.persist();

        document.body.classList.add('exam-mode');
        document.body.classList.remove('review-mode');

        startExamTimer();
        UI.render();
        UI.showToast('考试开始，限时 60 分钟！请认真答题！', 'info');
    }

    function exitExamMode() {
        stopExamTimer();
        var state = State.getCurrent();
        if (state.exam) {
            state.exam.inExam = false;
            state.exam.isReviewMode = false;
        }

        state.order = Array.from({length: QUESTIONS.length}, function(_, i) { return i; });
        state.currentIndex = 0;
        
        State.setCategory('all'); 
        State.persist();

        document.body.classList.remove('exam-mode');
        document.body.classList.remove('review-mode');

        UI.render();
        UI.showToast('已退出考试模式，恢复顺序练习', 'info');
    }

    function showModeSwitchModal() {
        var state = State.getCurrent();
        var isExamActive = state.exam && state.exam.inExam;
        
        var html = '<div class="mode-select-container">' +
            '<p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">请选择练习或考试模式：</p>' +
            '<div class="wrong-book-item" style="border-left-color: var(--accent);" id="optSequential">' +
            '<div class="wb-question">🔄 顺序刷题模式</div>' +
            '<div class="wb-meta" style="font-size:0.75rem;">按官方题库顺序进行系统性巩固练习，适合第一阶段备考。</div>' +
            '</div>' +
            '<div class="wrong-book-item" style="border-left-color: var(--accent);" id="optRandom">' +
            '<div class="wb-question">🔀 随机刷题模式</div>' +
            '<div class="wb-meta" style="font-size:0.75rem;">打破原题库顺序随机练习，快速检验各知识点的熟练度。</div>' +
            '</div>' +
            '<div class="wrong-book-item" style="border-left-color: var(--correct);" id="optExam">' +
            '<div class="wb-question">📝 模拟考试模式</div>' +
            '<div class="wb-meta" style="font-size:0.75rem;">精选官方题配比（20判断 + 40单选 + 20多选），60分钟闭卷考。</div>' +
            '</div>' +
            '</div>';

        Modal.open('选择刷题模式', html);

        document.getElementById('optSequential').addEventListener('click', function() {
            Modal.close();
            if (state.mode === 'sequential' && !isExamActive) return;
            
            App.showConfirm('🔄', '切换到顺序模式将重置当前练习或考试进度，是否继续？', function() {
                if (isExamActive) stopExamTimer();
                State.reset();
                State.setMode('sequential');
                UI.render();
                UI.showToast('已切换为顺序刷题模式', 'info');
            });
        });

        document.getElementById('optRandom').addEventListener('click', function() {
            Modal.close();
            if (state.mode === 'random' && !isExamActive) return;

            App.showConfirm('🔄', '切换到随机模式将重置当前练习或考试进度，是否继续？', function() {
                if (isExamActive) stopExamTimer();
                State.reset();
                State.setMode('random');
                UI.render();
                UI.showToast('已切换为随机刷题模式', 'info');
            });
        });

        document.getElementById('optExam').addEventListener('click', function() {
            Modal.close();
            App.showConfirm('📝', '确定开始模拟考试吗？这将重置您当前的答题进度并开始60分钟倒计时。', function() {
                startExamMode();
            });
        });
    }




    /* ==================================================================
       MODULE PLACEHOLDERS
       These IIFE modules will be implemented in subsequent tasks.
       ================================================================== */

    /* ------- Storage Module (Task 2) ------- */
    const Storage = (function() {
        const KEYS = {
            progress: 'quiz_progress',
            history: 'quiz_history',
            wrong: 'quiz_wrong'
        };

        function _get(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        }

        function _set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                // Silently fail if localStorage is unavailable
            }
        }

        return {
            saveProgress(progress) {
                _set(KEYS.progress, progress);
            },

            loadProgress() {
                return _get(KEYS.progress);
            },

            saveHistory(record) {
                const history = _get(KEYS.history) || [];
                history.push(record);
                _set(KEYS.history, history);
            },

            loadHistory() {
                return _get(KEYS.history) || [];
            },

            saveWrong(questionId) {
                const list = _get(KEYS.wrong) || [];
                if (!list.includes(questionId)) {
                    list.push(questionId);
                    _set(KEYS.wrong, list);
                }
            },

            removeWrong(questionId) {
                const list = _get(KEYS.wrong) || [];
                const index = list.indexOf(questionId);
                if (index !== -1) {
                    list.splice(index, 1);
                    _set(KEYS.wrong, list);
                }
            },

            getWrongList() {
                return _get(KEYS.wrong) || [];
            },

            clearAll() {
                try {
                    localStorage.removeItem(KEYS.progress);
                    localStorage.removeItem(KEYS.history);
                    localStorage.removeItem(KEYS.wrong);
                } catch (e) {
                    // Silently fail if localStorage is unavailable
                }
            }
        };
    })();

    /* ------- Modal Helpers ------- */
    const Modal = (function() {
        var _overlay = null;
        var _content = null;

        function _getRefs() {
            if (!_overlay) _overlay = document.getElementById('modalOverlay');
            if (!_content) _content = document.getElementById('modalContent');
            return { overlay: _overlay, content: _content };
        }

        return {
            open: function(title, bodyHtml, extraClass) {
                var refs = _getRefs();
                var closeId = 'modalClose_' + Date.now();
                var html = '<div class="modal-header">' +
                    '<h2 class="modal-title">' + title + '</h2>' +
                    '<button class="modal-close-btn" id="' + closeId + '">&times;</button>' +
                    '</div><div class="modal-body">' + bodyHtml + '</div>';
                refs.content.innerHTML = html;
                refs.content.className = 'modal-content' + (extraClass ? ' ' + extraClass : '');
                refs.overlay.classList.add('visible');
                document.getElementById(closeId).addEventListener('click', function() {
                    Modal.close();
                });
                return refs;
            },
            close: function() {
                _getRefs().overlay.classList.remove('visible');
            },
            getOverlay: function() { return _getRefs().overlay; },
            getContent: function() { return _getRefs().content; }
        };
    })();

    /*
     * ------- Sync Module (Firebase Realtime Database) -------
     *
     * Uses a shared "sync code" (6-char alphanumeric) instead of anonymous UID
     * so that multiple devices with the same sync code read/write to the same
     * Firebase path: /groups/{syncCode}/
     *
     * Firebase Realtime Database rules should allow authenticated users to
     * read/write under /groups/:
     * {
     *   "rules": {
     *     "groups": {
     *       "$code": {
     *         ".read": "auth != null",
     *         ".write": "auth != null"
     *       }
     *     }
     *   }
     * }
     */
    const Sync = (function() {
        var app = null;
        var auth = null;
        var db = null;
        var uid = null;
        var syncCode = null;
        var connected = false;
        var syncing = false;
        var saveTimer = null;
        var initialized = false;

        // Characters used for sync code generation (no ambiguous chars: 0/O, 1/I/L)
        var SYNC_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
        var SYNC_CODE_KEY = 'quiz_sync_code';

        function generateSyncCode() {
            var code = '';
            for (var i = 0; i < 6; i++) {
                code += SYNC_CHARS.charAt(Math.floor(Math.random() * SYNC_CHARS.length));
            }
            return code;
        }

        function getSyncCode() {
            return localStorage.getItem(SYNC_CODE_KEY) || '';
        }

        function setSyncCode(code) {
            syncCode = code.toUpperCase();
            localStorage.setItem(SYNC_CODE_KEY, syncCode);
            updateStatusUI();
            // Reload data from the new group path - force cloud data when switching codes
            if (initialized && db) {
                Sync.loadFromCloud(true);
            }
        }

        function validateSyncCode(code) {
            if (!code || typeof code !== 'string') return false;
            var normalized = code.toUpperCase().trim();
            if (normalized.length !== 6) return false;
            for (var i = 0; i < normalized.length; i++) {
                if (SYNC_CHARS.indexOf(normalized[i]) === -1) return false;
            }
            return true;
        }

        function joinSyncCode(code) {
            if (!validateSyncCode(code)) {
                return { ok: false, error: '同步码格式不正确（需要6位字母数字）' };
            }
            setSyncCode(code.toUpperCase().trim());
            return { ok: true };
        }

        function getDataPath() {
            if (!syncCode) return null;
            return '/groups/' + syncCode;
        }

        function updateStatusUI() {
            var el = document.getElementById('syncStatus');
            if (!el) return;
            var dot = el.querySelector('.sync-dot');
            var text = el.querySelector('.sync-text');
            if (!dot || !text) return;

            if (!initialized) {
                dot.className = 'sync-dot offline';
                text.textContent = '离线模式';
            } else if (syncing) {
                dot.className = 'sync-dot syncing';
                text.textContent = '同步中...';
            } else if (connected) {
                dot.className = 'sync-dot online';
                text.textContent = '已同步';
            } else {
                dot.className = 'sync-dot offline';
                text.textContent = '离线模式';
            }

            // Show sync code in UI
            var displayEl = document.getElementById('syncCodeDisplay');
            var codeTextEl = document.getElementById('syncCodeText');
            if (displayEl && codeTextEl && syncCode) {
                displayEl.style.display = 'inline-flex';
                codeTextEl.textContent = syncCode;
            }
        }

        function getLocalData() {
            var stored = localStorage.getItem('quiz_last_modified');
            return {
                progress: Storage.loadProgress(),
                wrong: Storage.getWrongList(),
                history: Storage.loadHistory(),
                lastModified: stored || new Date().toISOString()
            };
        }

        function markLocalModified() {
            var now = new Date().toISOString();
            localStorage.setItem('quiz_last_modified', now);
            return now;
        }

        function applyCloudData(data) {
            if (data.progress) {
                localStorage.setItem('quiz_progress', JSON.stringify(data.progress));
            }
            if (data.wrong) {
                localStorage.setItem('quiz_wrong', JSON.stringify(data.wrong));
            }
            if (data.history) {
                localStorage.setItem('quiz_history', JSON.stringify(data.history));
            }
            if (data.lastModified) {
                localStorage.setItem('quiz_last_modified', data.lastModified);
            }
        }

        function showSyncDialog() {
            var overlay = document.getElementById('modalOverlay');
            var content = document.getElementById('modalContent');
            if (!overlay || !content) return;

            var currentCode = syncCode || '';

            var html = '<div class="modal-header">' +
                '<h2 class="modal-title">设备同步</h2>' +
                '<button class="modal-close-btn" id="syncDialogCloseBtn">&times;</button>' +
                '</div><div class="modal-body">' +
                '<div class="sync-current-section">' +
                '<div class="sync-current-label">当前同步码</div>' +
                '<div class="sync-current-code">' + currentCode + '</div>' +
                '<br><button class="sync-copy-btn" id="syncCopyBtn">复制同步码</button>' +
                '</div>' +
                '<hr class="sync-divider">' +
                '<div class="sync-join-section">' +
                '<div class="sync-join-label">输入另一设备的同步码进行连接</div>' +
                '<div class="sync-join-input-row">' +
                '<input type="text" class="sync-join-input" id="syncJoinInput" maxlength="6" placeholder="输入6位同步码" autocomplete="off" spellcheck="false">' +
                '<button class="sync-join-btn" id="syncJoinBtn">连接</button>' +
                '</div>' +
                '<div class="sync-feedback" id="syncFeedback"></div>' +
                '</div>' +
                '</div>';

            content.innerHTML = html;
            content.className = 'modal-content sync-dialog';
            overlay.classList.add('visible');

            // Bind close
            document.getElementById('syncDialogCloseBtn').addEventListener('click', function() {
                overlay.classList.remove('visible');
            });

            // Bind copy
            document.getElementById('syncCopyBtn').addEventListener('click', function() {
                var btn = this;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(currentCode).then(function() {
                        btn.textContent = '已复制';
                        btn.classList.add('copied');
                        setTimeout(function() {
                            btn.textContent = '复制同步码';
                            btn.classList.remove('copied');
                        }, 2000);
                    }).catch(function() {
                        fallbackCopy(currentCode, btn);
                    });
                } else {
                    fallbackCopy(currentCode, btn);
                }
            });

            // Bind join input - auto-uppercase
            var joinInput = document.getElementById('syncJoinInput');
            joinInput.addEventListener('input', function() {
                this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            });

            // Bind join button
            document.getElementById('syncJoinBtn').addEventListener('click', function() {
                var code = joinInput.value.trim();
                var feedback = document.getElementById('syncFeedback');
                var result = joinSyncCode(code);
                if (result.ok) {
                    feedback.className = 'sync-feedback success';
                    feedback.textContent = '已切换到同步码: ' + syncCode;
                    // Update displayed code
                    document.querySelector('.sync-current-code').textContent = syncCode;
                    joinInput.value = '';
                } else {
                    feedback.className = 'sync-feedback error';
                    feedback.textContent = result.error;
                }
            });

            // Enter key on input
            joinInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('syncJoinBtn').click();
                }
            });

            // Focus input
            joinInput.focus();
        }

        function fallbackCopy(text, btn) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                btn.textContent = '已复制';
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.textContent = '复制同步码';
                    btn.classList.remove('copied');
                }, 2000);
            } catch (e) {
                btn.textContent = '复制失败';
                setTimeout(function() {
                    btn.textContent = '复制同步码';
                }, 2000);
            }
            document.body.removeChild(ta);
        }

        return {
            init: function() {
                try {
                    if (!firebase.apps.length) {
                        app = firebase.initializeApp({
                            apiKey: "AIzaSyD4lbUsQFn496u8Hv6crhYvk_7paL47hLI",
                            authDomain: "ai-trainer-quiz-2777d.firebaseapp.com",
                            databaseURL: "https://ai-trainer-quiz-2777d-default-rtdb.asia-southeast1.firebasedatabase.app",
                            projectId: "ai-trainer-quiz-2777d",
                            storageBucket: "ai-trainer-quiz-2777d.firebasestorage.app",
                            messagingSenderId: "1017229865832",
                            appId: "1:1017229865832:web:075581ba26ac97ec2adcdd"
                        });
                    } else {
                        app = firebase.app();
                    }
                    auth = firebase.auth();
                    db = firebase.database();

                    // Connection status listener
                    db.ref('.info/connected').on('value', function(snap) {
                        connected = snap.val() === true;
                        updateStatusUI();
                    });

                    // Check for existing sync code or generate a new one
                    syncCode = getSyncCode();
                    if (!syncCode) {
                        syncCode = generateSyncCode();
                        localStorage.setItem(SYNC_CODE_KEY, syncCode);
                    }

                    // Sign in anonymously (needed for database rules)
                    auth.signInAnonymously().then(function() {
                        uid = auth.currentUser.uid;
                        initialized = true;
                        updateStatusUI();
                        Sync.loadFromCloud();
                    }).catch(function(err) {
                        console.warn('Firebase anonymous auth failed:', err);
                        updateStatusUI();
                    });

                    // Bind sync switch button
                    var switchBtn = document.getElementById('syncSwitchBtn');
                    if (switchBtn) {
                        switchBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            showSyncDialog();
                        });
                    }
                } catch (err) {
                    console.warn('Firebase init failed:', err);
                    updateStatusUI();
                }
            },

            loadFromCloud: function(forceCloud) {
                if (!db || !uid || !syncCode) return;
                var path = getDataPath();
                if (!path) return;

                try {
                    syncing = true;
                    updateStatusUI();

                    db.ref(path).once('value').then(function(snap) {
                        syncing = false;
                        var cloudData = snap.val();
                        var localData = getLocalData();
                        var localProgress = localData.progress;

                        if (cloudData && cloudData.progress) {
                            var cloudTime = cloudData.lastModified || '';
                            var localTime = localData.lastModified || '';

                            // Use cloud if: forced, cloud is newer, or local has no real data
                            var localHasData = localProgress && localProgress.totalAnswered > 0;
                            if (forceCloud || cloudTime > localTime || !localHasData) {
                                applyCloudData(cloudData);
                                State.init();
                                UI.render();
                            } else {
                                Sync.saveToCloud(true);
                            }
                        } else if (localProgress && localProgress.totalAnswered > 0) {
                            // No cloud data but local has real data - push to cloud
                            Sync.saveToCloud(true);
                        }
                        updateStatusUI();
                    }).catch(function(err) {
                        syncing = false;
                        console.warn('Firebase read failed:', err);
                        UI.showToast('同步失败: ' + (err.message || '网络错误'), 'error');
                        updateStatusUI();
                    });
                } catch (err) {
                    syncing = false;
                    console.warn('loadFromCloud failed:', err);
                    UI.showToast('同步初始化失败', 'error');
                    updateStatusUI();
                }
            },

            saveToCloud: function(immediate) {
                if (!db || !uid || !syncCode) return;
                var path = getDataPath();
                if (!path) return;

                if (saveTimer) {
                    clearTimeout(saveTimer);
                    saveTimer = null;
                }

                function doSave() {
                    try {
                        syncing = true;
                        updateStatusUI();
                        var data = getLocalData();
                        data.lastModified = markLocalModified();
                        db.ref(path).set(data).then(function() {
                            syncing = false;
                            updateStatusUI();
                        }).catch(function(err) {
                            syncing = false;
                            console.warn('Firebase write failed:', err);
                            UI.showToast('同步写入失败: ' + (err.message || '权限不足'), 'error');
                            updateStatusUI();
                        });
                    } catch (err) {
                        syncing = false;
                        console.warn('saveToCloud failed:', err);
                        updateStatusUI();
                    }
                }

                if (immediate) {
                    doSave();
                } else {
                    saveTimer = setTimeout(doSave, 500);
                }
            },

            isConnected: function() {
                return connected;
            },

            getStatus: function() {
                if (!initialized) return 'offline';
                if (syncing) return 'syncing';
                if (connected) return 'synced';
                return 'offline';
            },

            getUid: function() {
                return uid;
            },

            getSyncCode: function() {
                return syncCode;
            },

            setSyncCode: function(code) {
                setSyncCode(code);
            },

            joinSyncCode: function(code) {
                return joinSyncCode(code);
            },

            generateSyncCode: function() {
                return generateSyncCode();
            },

            showSyncDialog: function() {
                showSyncDialog();
            }
        };
    })();

    /* ------- State Module (Task 2) ------- */
    const State = (function() {
        let current = null;
        let category = 'all';

        function createDefault() {
            return {
                mode: 'sequential',
                currentIndex: 0,
                order: Array.from({length: QUESTIONS.length}, (_, i) => i),
                answered: {},
                score: 0,
                totalAnswered: 0,
                startTime: new Date().toISOString(),
                completed: false,
                categoryIndex: {},
                exam: {
                    inExam: false,
                    questions: [],
                    userAnswers: {},
                    startTime: null,
                    duration: 3600,
                    timeLeft: 3600,
                    isCompleted: false,
                    score: 0,
                    submitTime: null,
                    isReviewMode: false
                }
            };
        }

        function shuffleOrder(order) {
            const arr = [...order];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function getQuestionsByCategory(cat) {
            if (cat === 'all') return QUESTIONS;
            return QUESTIONS.filter(function(q) { return q.type === cat; });
        }

        function getFilteredIndices(cat) {
            if (cat === 'wrong') {
                return Storage.getWrongList().slice();
            }
            var indices = [];
            for (var i = 0; i < QUESTIONS.length; i++) {
                if (cat === 'all' || QUESTIONS[i].type === cat) {
                    indices.push(i);
                }
            }
            return indices;
        }

        function persist() {
            Storage.saveProgress(current);
            if (typeof Sync !== 'undefined' && Sync.saveToCloud) Sync.saveToCloud();
        }

        return {
            init() {
                const saved = Storage.loadProgress();
                if (saved && typeof saved.currentIndex === 'number' && Array.isArray(saved.order)) {
                    current = Object.assign(createDefault(), saved);
                    if (!current.exam) {
                        current.exam = createDefault().exam;
                    }
                } else {
                    current = createDefault();
                }

                // If in exam and not finished, resume timer
                if (current.exam && current.exam.inExam && !current.exam.isCompleted) {
                    document.body.classList.add('exam-mode');
                    startExamTimer();
                } else if (current.exam && current.exam.inExam && current.exam.isCompleted) {
                    document.body.classList.add('exam-mode');
                    document.body.classList.add('review-mode');
                }
            },

            persist: persist,

            getCurrent() {
                return current;
            },

            getCategory() {
                return category;
            },

            setCategory(cat) {
                if (!current.categoryIndex) current.categoryIndex = {};
                current.categoryIndex[category] = current.currentIndex;

                category = cat;
                var indices = getFilteredIndices(cat);

                if (cat === 'wrong') {
                    for (var i = 0; i < indices.length; i++) {
                        this.clearAnswer(indices[i]);
                    }
                }

                if (current.mode === 'random') {
                    indices = shuffleOrder(indices);
                }
                current.order = indices;
                var savedIndex = current.categoryIndex[cat];
                current.currentIndex = (savedIndex !== undefined && savedIndex < indices.length) ? savedIndex : 0;
                persist();
            },

            setMode(mode) {
                var indices = getFilteredIndices(category);
                current.mode = mode;
                current.order = (mode === 'random') ? shuffleOrder(indices) : indices;
                current.currentIndex = 0;
                persist();
            },

            getCurrentQuestion() {
                var idx = current.order[current.currentIndex];
                var q = QUESTIONS[idx] || null;
                if (q && category === 'wrong') {
                    return getWrongShuffledQuestion(q, idx);
                }
                return q;
            },

            getFilteredQuestions() {
                return getQuestionsByCategory(category);
            },

            getCurrentQuestionIndex() {
                return current.order[current.currentIndex];
            },

            answerQuestion(userAnswer) {
                var qIndex = current.order[current.currentIndex];
                var question = this.getCurrentQuestion();

                if (current.exam && current.exam.inExam) {
                    if (current.exam.isCompleted) return false;
                    current.exam.userAnswers[qIndex] = userAnswer;
                    persist();
                    return true;
                }

                if (current.answered[qIndex] !== undefined) {
                    return current.answered[qIndex] === question.answer;
                }

                var isCorrect = (userAnswer === question.answer);
                current.answered[qIndex] = userAnswer;
                current.totalAnswered++;

                if (isCorrect) {
                    current.score++;
                    Storage.removeWrong(qIndex);
                } else {
                    Storage.saveWrong(qIndex);
                }

                Storage.saveHistory({
                    questionIndex: qIndex,
                    userAnswer: userAnswer,
                    correctAnswer: question.answer,
                    isCorrect: isCorrect,
                    timestamp: new Date().toISOString()
                });

                persist();
                return isCorrect;
            },

            clearAnswer(qIndex) {
                if (wrongShuffleCache[qIndex]) {
                    delete wrongShuffleCache[qIndex];
                }

                if (current.exam && current.exam.inExam) {
                    if (current.exam.userAnswers[qIndex] !== undefined) {
                        delete current.exam.userAnswers[qIndex];
                        persist();
                    }
                    return;
                }

                if (current.answered[qIndex] !== undefined) {
                    if (current.answered[qIndex] === QUESTIONS[qIndex].answer) {
                        current.score--;
                    }
                    current.totalAnswered--;
                    delete current.answered[qIndex];
                    persist();
                }
            },

            getCategoryStats() {
                var answered = 0, correct = 0;
                for (var i = 0; i < current.order.length; i++) {
                    var qIdx = current.order[i];
                    if (this.isAnswered(qIdx)) {
                        answered++;
                        // If exam mode, check exam answers, otherwise check normal answers
                        var userAns = this.getAnswer(qIdx);
                        var actualAns = QUESTIONS[qIdx].answer;
                        if (userAns === actualAns) {
                            correct++;
                        }
                    }
                }
                return { total: current.order.length, answered: answered, correct: correct, wrong: answered - correct };
            },

            goNext() {
                if (this.canGoNext()) {
                    current.currentIndex++;
                    persist();
                }
            },

            goPrev() {
                if (this.canGoPrev()) {
                    current.currentIndex--;
                    persist();
                }
            },

            canGoNext() {
                return current.currentIndex < current.order.length - 1;
            },

            canGoPrev() {
                return current.currentIndex > 0;
            },

            isAnswered(qIndex) {
                if (current.exam && current.exam.inExam) {
                    return current.exam.userAnswers.hasOwnProperty(qIndex);
                }
                return current.answered.hasOwnProperty(qIndex);
            },

            getAnswer(qIndex) {
                if (current.exam && current.exam.inExam) {
                    return current.exam.userAnswers[qIndex];
                }
                return current.answered[qIndex];
            },

            reset() {
                Storage.clearAll();
                wrongShuffleCache = {};
                current = createDefault();
                category = 'all';
                persist();
            }
        };
    })();

    /* ------- UI Module (Task 3) ------- */
    const UI = (function() {
        return {
            render() {
                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                this.updateModeBadge();
                this.renderStats();
                this.renderCategoryTabs();
                
                var question = State.getCurrentQuestion();
                if (!question) {
                    if (State.getCategory() === 'wrong') {
                        document.getElementById('questionText').textContent = '暂无错题，继续保持！';
                        document.getElementById('judgeButtons').style.display = 'none';
                        document.getElementById('choiceOptions').style.display = 'none';
                        document.getElementById('btnSubmit').style.display = 'none';
                    } else {
                        document.getElementById('questionText').textContent = '题目加载失败，请刷新页面重试。';
                    }
                    document.getElementById('feedbackContainer').classList.remove('visible');
                    this.renderNavigation();
                    return;
                }

                var qIndex = State.getCurrentQuestionIndex();
                this.renderQuestion(question, qIndex);

                // 考试中未交卷，隐藏反馈区
                if (isExamActive && !isExamCompleted) {
                    document.getElementById('feedbackContainer').classList.remove('visible');
                    this.renderExamTimer();
                } else {
                    if (State.isAnswered(qIndex)) {
                        var userAnswer = State.getAnswer(qIndex);
                        var isCorrect = (userAnswer === question.answer);
                        this.renderFeedback(question, userAnswer, isCorrect);
                    } else {
                        document.getElementById('feedbackContainer').classList.remove('visible');
                    }
                }
                this.renderNavigation();
            },

            renderCategoryTabs() {
                var currentCat = State.getCategory();
                var tabs = document.querySelectorAll('.cat-tab');
                for (var i = 0; i < tabs.length; i++) {
                    var cat = tabs[i].getAttribute('data-category');
                    if (cat === currentCat) {
                        tabs[i].classList.add('active');
                    } else {
                        tabs[i].classList.remove('active');
                    }
                }
            },

            updateModeBadge() {
                var state = State.getCurrent();
                var badgeEl = document.getElementById('modeBadge');
                if (badgeEl) {
                    if (state.exam && state.exam.inExam) {
                        badgeEl.textContent = '模拟考试';
                    } else {
                        badgeEl.textContent = state.mode === 'sequential' ? '顺序刷题' : '随机刷题';
                    }
                }
            },

            renderExamTimer() {
                var state = State.getCurrent();
                if (!state || !state.exam || !state.exam.inExam) return;

                var timerEl = document.getElementById('examTimer');
                var progressTextEl = document.getElementById('examProgressText');

                if (timerEl) {
                    var timeLeft = state.exam.timeLeft;
                    var mins = Math.floor(timeLeft / 60);
                    var secs = timeLeft % 60;
                    var timeStr = '⏱️ ' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
                    timerEl.textContent = timeStr;

                    if (timeLeft < 600) { // 小于10分钟变红并闪烁
                        timerEl.classList.add('urgent');
                    } else {
                        timerEl.classList.remove('urgent');
                    }
                }

                if (progressTextEl) {
                    var answeredCount = Object.keys(state.exam.userAnswers).length;
                    progressTextEl.textContent = '已答 ' + answeredCount + '/' + state.exam.questions.length;
                }
            },

            renderStats() {
                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;

                if (isExamActive) {
                    var answeredCount = Object.keys(state.exam.userAnswers).length;
                    var totalCount = state.exam.questions.length;
                    var pct = totalCount > 0 ? (answeredCount / totalCount * 100) : 0;
                    document.getElementById('progressBarFill').style.width = pct + '%';
                    return;
                }

                var stats = State.getCategoryStats();
                var wrongList = Storage.getWrongList();
                var wrongSet = new Set(wrongList);
                var categoryWrongFromBook = 0;
                for (var i = 0; i < state.order.length; i++) {
                    if (wrongSet.has(state.order[i])) {
                        categoryWrongFromBook++;
                    }
                }

                document.querySelector('#statTotal .stat-value').textContent = stats.answered + '/' + stats.total;
                document.querySelector('#statCorrect .stat-value').textContent = stats.correct;
                document.querySelector('#statWrong .stat-value').textContent = categoryWrongFromBook;

                var pct = stats.total > 0 ? (stats.answered / stats.total * 100) : 0;
                document.getElementById('progressBarFill').style.width = pct + '%';

                var countEl = document.getElementById('wrongBookCount');
                if (countEl) {
                    countEl.textContent = wrongList.length > 0 ? '(' + wrongList.length + ')' : '';
                }
            },

            renderQuestion(question, qIndex) {
                var state = State.getCurrent();
                var judgeButtons = document.getElementById('judgeButtons');
                var choiceOptions = document.getElementById('choiceOptions');
                var btnSubmit = document.getElementById('btnSubmit');

                // Build question number with type badge
                var typeLabels = {judge: '判断题', single: '单选题', multi: '多选题'};
                var typeBadge = '<span class="question-type-badge type-' + question.type + '">' +
                    (typeLabels[question.type] || '') + '</span>';
                document.getElementById('questionNumber').innerHTML =
                    '第 ' + (state.currentIndex + 1) + ' 题' + typeBadge;
                document.getElementById('questionText').textContent = question.question;

                // Show/hide based on question type
                if (question.type === 'judge') {
                    judgeButtons.style.display = 'flex';
                    choiceOptions.style.display = 'none';
                    btnSubmit.style.display = 'none';
                    this._renderJudgeButtons(question, qIndex);
                } else {
                    judgeButtons.style.display = 'none';
                    choiceOptions.style.display = 'flex';
                    this._renderChoiceOptions(question, qIndex);
                    
                    var isExamActive = state.exam && state.exam.inExam;
                    var isExamCompleted = state.exam && state.exam.isCompleted;

                    if (question.type === 'multi') {
                        if (isExamActive && !isExamCompleted) {
                            btnSubmit.style.display = 'block';
                            var selectedCount = choiceOptions.querySelectorAll('.choice-option.selected').length;
                            btnSubmit.disabled = selectedCount === 0;
                            btnSubmit.textContent = '确认选择';
                        } else {
                            if (!State.isAnswered(qIndex)) {
                                btnSubmit.style.display = 'block';
                                btnSubmit.disabled = true;
                                btnSubmit.textContent = '提交答案';
                            } else {
                                btnSubmit.style.display = 'none';
                            }
                        }
                    } else {
                        btnSubmit.style.display = 'none';
                    }
                }
            },

            _renderJudgeButtons(question, qIndex) {
                var btnTrue = document.getElementById('btnTrue');
                var btnFalse = document.getElementById('btnFalse');

                btnTrue.className = 'answer-btn btn-true';
                btnFalse.className = 'answer-btn btn-false';

                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                if (isExamActive && !isExamCompleted) {
                    btnTrue.disabled = false;
                    btnFalse.disabled = false;

                    var userAnswer = State.getAnswer(qIndex);
                    if (userAnswer === '√') {
                        btnTrue.classList.add('selected');
                    } else if (userAnswer === '×') {
                        btnFalse.classList.add('selected');
                    }
                } else if (State.isAnswered(qIndex)) {
                    btnTrue.disabled = true;
                    btnFalse.disabled = true;

                    var userAnswer = State.getAnswer(qIndex);
                    if (userAnswer === question.answer) {
                        if (userAnswer === '√') {
                            btnTrue.classList.add('selected-correct');
                        } else {
                            btnFalse.classList.add('selected-correct');
                        }
                    } else {
                        if (userAnswer === '√') {
                            btnTrue.classList.add('selected-wrong');
                        } else {
                            btnFalse.classList.add('selected-wrong');
                        }
                        if (question.answer === '√') {
                            btnTrue.classList.add('correct-answer-highlight');
                        } else {
                            btnFalse.classList.add('correct-answer-highlight');
                        }
                    }
                } else {
                    btnTrue.disabled = false;
                    btnFalse.disabled = false;
                }
            },

            _renderChoiceOptions(question, qIndex) {
                var container = document.getElementById('choiceOptions');
                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                var answered = State.isAnswered(qIndex);
                var userAnswer = answered ? State.getAnswer(qIndex) : null;
                var html = '';

                for (var i = 0; i < question.options.length; i++) {
                    var opt = question.options[i];
                    var isSelected = false;
                    var isCorrectOption = false;
                    var extraClass = '';

                    if (isExamActive && !isExamCompleted) {
                        if (question.type === 'single') {
                            isSelected = (opt.label === userAnswer);
                        } else {
                            isSelected = userAnswer && userAnswer.indexOf(opt.label) !== -1;
                        }
                        if (isSelected) {
                            extraClass = ' selected';
                        }
                    } else if (answered) {
                        if (question.type === 'single') {
                            isCorrectOption = (opt.label === question.answer);
                        } else {
                            isCorrectOption = question.answer.indexOf(opt.label) !== -1;
                        }

                        if (question.type === 'single') {
                            isSelected = (opt.label === userAnswer);
                        } else {
                            isSelected = userAnswer && userAnswer.indexOf(opt.label) !== -1;
                        }

                        if (isCorrectOption) {
                            extraClass = ' correct disabled';
                        } else if (isSelected && !isCorrectOption) {
                            extraClass = ' wrong disabled';
                        } else {
                            extraClass = ' disabled';
                        }
                    }

                    html += '<button class="choice-option' + extraClass + '" data-label="' + opt.label + '">' +
                        '<span class="option-label">' + opt.label + '</span>' +
                        '<span class="option-text">' + opt.text + '</span>' +
                        '</button>';
                }

                container.innerHTML = html;
            },

            renderFeedback(question, userAnswer, isCorrect) {
                var feedbackContainer = document.getElementById('feedbackContainer');
                var feedbackBox = document.getElementById('feedbackBox');
                var feedbackTitle = document.getElementById('feedbackTitle');
                var feedbackExplanation = document.getElementById('feedbackExplanation');

                feedbackContainer.classList.add('visible');
                feedbackBox.className = 'feedback-box';

                if (isCorrect) {
                    feedbackBox.classList.add('feedback-correct');
                    feedbackTitle.textContent = '✓ 回答正确';
                    feedbackExplanation.textContent = question.explanation;
                } else {
                    feedbackBox.classList.add('feedback-wrong');
                    feedbackTitle.textContent = '✗ 回答错误';
                    feedbackExplanation.innerHTML = question.explanation +
                        '<br><button class="btn-redo redo-btn">重做本题</button>';
                    feedbackExplanation.querySelector('.redo-btn').addEventListener('click', function() {
                        State.clearAnswer(State.getCurrentQuestionIndex());
                        State.persist();
                        UI.render();
                        UI.showToast('已清除答题记录，请重新作答', 'info');
                    });
                }
            },

            renderNavigation() {
                document.getElementById('btnPrev').disabled = !State.canGoPrev();
                document.getElementById('btnNext').disabled = !State.canGoNext();
            },

            showWrongBook() {
                var wrongIndices = Storage.getWrongList();
                var bodyHtml = '';

                if (wrongIndices.length === 0) {
                    bodyHtml += '<div class="wrong-book-empty">' +
                        '<div class="empty-icon">🎉</div>' +
                        '<div class="empty-text">暂无错题，继续保持！</div>' +
                        '</div>';
                } else {
                    for (var i = 0; i < wrongIndices.length; i++) {
                        var qIndex = wrongIndices[i];
                        var question = QUESTIONS[qIndex];
                        if (!question) continue;

                        var truncated = question.question.length > 40
                            ? question.question.substring(0, 40) + '...'
                            : question.question;

                        var answerDisplay = question.answer;
                        if (question.type === 'judge') {
                            answerDisplay = question.answer === '√' ? '√ 正确' : '× 错误';
                        }

                        var typeLabel = {judge: '判断', single: '单选', multi: '多选'}[question.type] || '';

                        bodyHtml += '<div class="wrong-book-item" data-question-index="' + qIndex + '">' +
                            '<div class="wb-question">[' + typeLabel + '] ' + truncated + '</div>' +
                            '<div class="wb-meta">' +
                            '<span>正确答案：<span class="wb-answer correct">' + answerDisplay + '</span></span>' +
                            '<button class="btn-redo btn-redo-sm" data-question-index="' + qIndex + '">重做</button>' +
                            '</div></div>';
                    }
                }

                Modal.open('错题本', bodyHtml);
            },

            showCompletion() {
                var stats = State.getCategoryStats();
                var accuracy = stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
                var icon = accuracy >= 80 ? '🎉' : (accuracy >= 60 ? '👍' : '💪');

                var bodyHtml = '<div class="completion-summary">' +
                    '<div class="summary-icon">' + icon + '</div>' +
                    '<div class="summary-title">练习完成！</div>' +
                    '<div class="summary-subtitle">你已完成当前分类下所有 ' + stats.total + ' 道题目</div>' +
                    '<div class="summary-accuracy">' + accuracy + '%</div>' +
                    '<div class="summary-accuracy-label">正确率</div>' +
                    '<div class="summary-stats">' +
                    '<div class="summary-stat-item correct"><div class="summary-stat-value">' + stats.correct + '</div><div class="summary-stat-label">答对</div></div>' +
                    '<div class="summary-stat-item wrong"><div class="summary-stat-value">' + stats.wrong + '</div><div class="summary-stat-label">答错</div></div>' +
                    '<div class="summary-stat-item total"><div class="summary-stat-value">' + stats.total + '</div><div class="summary-stat-label">已答</div></div>' +
                    '</div>' +
                    '<div class="completion-btn-group">' +
                    '<button class="completion-btn btn-retry" id="btnRetry">重新开始</button>' +
                    '<button class="completion-btn btn-wrong-book" id="btnCompletionWrongBook">查看错题本</button>' +
                    '</div></div>';

                Modal.open('练习完成', bodyHtml);

                document.getElementById('btnRetry').addEventListener('click', function() {
                    Modal.close();
                    State.reset();
                    UI.render();
                    UI.showToast('已重新开始', 'success');
                });
                document.getElementById('btnCompletionWrongBook').addEventListener('click', function() {
                    Modal.close();
                    UI.showWrongBook();
                });
            },

            showToast(message, type) {
                var container = document.getElementById('toastContainer');
                var toast = document.createElement('div');
                toast.className = 'toast';

                if (type === 'success') {
                    toast.style.background = 'rgba(82, 196, 26, 0.9)';
                } else if (type === 'error') {
                    toast.style.background = 'rgba(255, 77, 79, 0.9)';
                } else if (type === 'info') {
                    toast.style.background = 'rgba(74, 144, 217, 0.9)';
                }

                toast.textContent = message;
                container.appendChild(toast);

                setTimeout(function() {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 3000);
            },

            showQuestionList() {
                var state = State.getCurrent();
                var currentCategory = State.getCategory();
                var currentQIndex = State.getCurrentQuestionIndex();
                var categoryLabels = {all: '全部', judge: '判断题', single: '单选题', multi: '多选题'};

                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                var bodyHtml = '<div class="question-list-tabs">';
                var categories = ['all', 'judge', 'single', 'multi'];
                for (var i = 0; i < categories.length; i++) {
                    var cat = categories[i];
                    var activeClass = cat === currentCategory ? ' active' : '';
                    bodyHtml += '<button class="question-list-tab' + activeClass + '" data-category="' + cat + '">' +
                        categoryLabels[cat] + '</button>';
                }
                bodyHtml += '</div>';
                bodyHtml += '<div class="question-list-header">' +
                    '<span class="question-list-count">共 ' + state.order.length + ' 题</span></div>';
                bodyHtml += '<div class="question-grid" id="questionGrid">';

                for (var i = 0; i < state.order.length; i++) {
                    var qIndex = state.order[i];
                    var question = QUESTIONS[qIndex];
                    if (!question) continue;

                    var itemClass = 'question-grid-item';
                    var statusIcon = '';
                    if (qIndex === currentQIndex) itemClass += ' current';

                    if (isExamActive && !isExamCompleted) {
                        if (State.isAnswered(qIndex)) {
                            itemClass += ' answered-dot';
                        }
                    } else {
                        var userAns = State.getAnswer(qIndex);
                        if (userAns !== undefined) {
                            if (userAns === question.answer) {
                                itemClass += ' correct';
                                statusIcon = '<span class="item-status">✓</span>';
                            } else {
                                itemClass += ' wrong';
                                statusIcon = '<span class="item-status">✗</span>';
                            }
                        }
                    }
                    bodyHtml += '<div class="' + itemClass + '" data-question-index="' + qIndex +
                        '" data-order-pos="' + i + '">' + (i + 1) + statusIcon + '</div>';
                }
                bodyHtml += '</div>';

                var refs = Modal.open('题目目录', bodyHtml);

                var tabs = refs.content.querySelectorAll('.question-list-tab');
                for (var i = 0; i < tabs.length; i++) {
                    tabs[i].addEventListener('click', function() {
                        State.setCategory(this.getAttribute('data-category'));
                        UI.render();
                        UI.showQuestionList();
                    });
                }

                var gridItems = refs.content.querySelectorAll('.question-grid-item');
                for (var i = 0; i < gridItems.length; i++) {
                    gridItems[i].addEventListener('click', function() {
                        var position = parseInt(this.getAttribute('data-order-pos'), 10);
                        var s = State.getCurrent();
                        s.currentIndex = position;
                        State.persist();
                        Modal.close();
                        UI.render();
                    });
                }
            }
        };
    })();

    /* ------- Events Module (Task 3) ------- */
    const Events = (function() {
        function toggleMultiChoice(label) {
            var state = State.getCurrent();
            var isExamActive = state.exam && state.exam.inExam;
            var isExamCompleted = state.exam && state.exam.isCompleted;

            var question = State.getCurrentQuestion();
            var qIndex = State.getCurrentQuestionIndex();
            if (!question) return;
            if ((!isExamActive || isExamCompleted) && State.isAnswered(qIndex)) return;

            var option = document.querySelector('#choiceOptions .choice-option[data-label="' + label + '"]');
            if (!option) return;

            option.classList.toggle('selected');
            var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
            document.getElementById('btnSubmit').disabled = selected.length === 0;
        }

        function handleAnswer(userAnswer) {
            var state = State.getCurrent();
            var isExamActive = state.exam && state.exam.inExam;
            var isExamCompleted = state.exam && state.exam.isCompleted;

            var question = State.getCurrentQuestion();
            var qIndex = State.getCurrentQuestionIndex();

            if (!isExamActive || isExamCompleted) {
                if (State.isAnswered(qIndex)) return;
            }

            var isCorrect = State.answerQuestion(userAnswer);
            UI.render();

            if (isExamActive && !isExamCompleted) {
                // 考试中未交卷，300ms 后自动跳下一题
                if (question.type === 'single' || question.type === 'judge') {
                    if (State.canGoNext()) {
                        setTimeout(function() {
                            var s = State.getCurrent();
                            if (s.exam && s.exam.inExam && !s.exam.isCompleted && s.order[s.currentIndex] === qIndex) {
                                State.goNext();
                                UI.render();
                            }
                        }, 300);
                    }
                }
            } else {
                if (isCorrect) {
                    UI.showToast('回答正确！', 'success');
                } else {
                    UI.showToast('回答错误', 'error');
                }

                if (State.getCategory() !== 'wrong') {
                    var stats = State.getCategoryStats();
                    if (stats.answered >= stats.total) {
                        setTimeout(function() {
                            UI.showCompletion();
                        }, 600);
                    }
                }
            }
        }

        return {
            init() {
                // Judge answer buttons
                document.getElementById('btnTrue').addEventListener('click', function() {
                    handleAnswer('√');
                });
                document.getElementById('btnFalse').addEventListener('click', function() {
                    handleAnswer('×');
                });

                // Category tab clicks (event delegation)
                document.getElementById('categoryTabs').addEventListener('click', function(e) {
                    var target = e.target;
                    if (target.classList.contains('cat-tab')) {
                        var cat = target.getAttribute('data-category');
                        State.setCategory(cat);
                        UI.render();
                    }
                });

                // Choice options (event delegation on choiceOptions container)
                document.getElementById('choiceOptions').addEventListener('click', function(e) {
                    var option = e.target.closest('.choice-option');
                    if (!option || option.classList.contains('disabled')) return;

                    var question = State.getCurrentQuestion();
                    var qIndex = State.getCurrentQuestionIndex();
                    
                    var state = State.getCurrent();
                    var isExamActive = state.exam && state.exam.inExam;
                    var isExamCompleted = state.exam && state.exam.isCompleted;

                    if (!question) return;
                    if ((!isExamActive || isExamCompleted) && State.isAnswered(qIndex)) return;

                    if (question.type === 'single') {
                        var label = option.getAttribute('data-label');
                        handleAnswer(label);
                    } else if (question.type === 'multi') {
                        option.classList.toggle('selected');
                        var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
                        document.getElementById('btnSubmit').disabled = selected.length === 0;
                    }
                });

                // Submit button for multi-choice
                document.getElementById('btnSubmit').addEventListener('click', function() {
                    var question = State.getCurrentQuestion();
                    var qIndex = State.getCurrentQuestionIndex();
                    
                    var state = State.getCurrent();
                    var isExamActive = state.exam && state.exam.inExam;
                    var isExamCompleted = state.exam && state.exam.isCompleted;

                    if (!question) return;
                    if ((!isExamActive || isExamCompleted) && State.isAnswered(qIndex)) return;

                    var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
                    if (selected.length === 0) return;

                    var answer = '';
                    for (var i = 0; i < selected.length; i++) {
                        answer += selected[i].getAttribute('data-label');
                    }
                    answer = answer.split('').sort().join('');
                    handleAnswer(answer);
                });

                // Navigation: previous
                document.getElementById('btnPrev').addEventListener('click', function() {
                    State.goPrev();
                    UI.render();
                });

                // Navigation: next
                document.getElementById('btnNext').addEventListener('click', function() {
                    State.goNext();
                    UI.render();
                });

                // Bottom bar: wrong book
                document.getElementById('btnWrongBook').addEventListener('click', function() {
                    UI.showWrongBook();
                });

                // Modal overlay click to close
                Modal.getOverlay().addEventListener('click', function(e) {
                    if (e.target === this) Modal.close();
                });

                // Event delegation for wrong book "重做" buttons
                document.getElementById('modalContent').addEventListener('click', function(e) {
                    var target = e.target;
                    if (target.classList.contains('btn-redo')) {
                        var qIndex = parseInt(target.getAttribute('data-question-index'), 10);
                        var state = State.getCurrent();
                        var orderIndex = state.order.indexOf(qIndex);
                        if (orderIndex !== -1) {
                            state.currentIndex = orderIndex;
                            State.clearAnswer(qIndex);
                            State.persist();
                        }
                        Modal.close();
                        UI.render();
                        UI.showToast('已清除答题记录，请重新作答', 'info');
                    }
                });

                // 交卷按钮
                document.getElementById('btnSubmitExam').addEventListener('click', function() {
                    var state = State.getCurrent();
                    if (!state || !state.exam || !state.exam.inExam || state.exam.isCompleted) return;

                    var totalQuestions = state.exam.questions.length;
                    var answeredCount = Object.keys(state.exam.userAnswers).length;
                    var unanswered = totalQuestions - answeredCount;

                    if (unanswered > 0) {
                        App.showConfirm('📝', '您还有 ' + unanswered + ' 道题未作答，确定现在交卷吗？', function() {
                            submitExam(false);
                        });
                    } else {
                        App.showConfirm('📝', '确定交卷并查看考试结果吗？', function() {
                            submitExam(false);
                        });
                    }
                });

                // 退出按钮
                document.getElementById('btnExitExam').addEventListener('click', function() {
                    var state = State.getCurrent();
                    if (!state || !state.exam || !state.exam.inExam) return;

                    if (!state.exam.isCompleted) {
                        App.showConfirm('⚠️', '退出考试将无法保存本次成绩，确认退出吗？', function() {
                            exitExamMode();
                        });
                    } else {
                        exitExamMode();
                    }
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        if (Modal.getOverlay().classList.contains('visible')) {
                            e.preventDefault();
                            Modal.close();
                        }
                        return;
                    }

                    if (Modal.getOverlay().classList.contains('visible')) return;

                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        if (State.canGoPrev()) { State.goPrev(); UI.render(); }
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        if (State.canGoNext()) { State.goNext(); UI.render(); }
                    } else if (e.key === 'Enter') {
                        var q = State.getCurrentQuestion();
                        var qIdx = State.getCurrentQuestionIndex();
                        
                        var state = State.getCurrent();
                        var isExamActive = state.exam && state.exam.inExam;
                        var isExamCompleted = state.exam && state.exam.isCompleted;

                        if (q && q.type === 'multi') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
                                if (selected.length > 0) {
                                    var answer = '';
                                    for (var i = 0; i < selected.length; i++) answer += selected[i].getAttribute('data-label');
                                    handleAnswer(answer.split('').sort().join(''));
                                }
                            }
                        }
                    } else {
                        var keyMap = {'1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E'};
                        var label = keyMap[e.key];
                        if (!label) return;
                        var q = State.getCurrentQuestion();
                        if (!q) return;
                        var qIdx = State.getCurrentQuestionIndex();

                        var state = State.getCurrent();
                        var isExamActive = state.exam && state.exam.inExam;
                        var isExamCompleted = state.exam && state.exam.isCompleted;

                        if (q.type === 'judge') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                handleAnswer(label === 'A' ? '√' : '×');
                            }
                        } else if (q.type === 'single') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                handleAnswer(label);
                            }
                        } else if (q.type === 'multi') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                toggleMultiChoice(label);
                            }
                        }
                    }
                });
            }
        };
    })();

    /* ------- App Module (Task 4) ------- */
    const App = (function() {
        // --- Confirm Modal ---
        function showConfirm(icon, message, onConfirm) {
            var bodyHtml = '<div class="confirm-body">' +
                '<div class="confirm-icon">' + icon + '</div>' +
                '<div class="confirm-message">' + message + '</div>' +
                '<div class="confirm-btn-group">' +
                '<button class="confirm-btn confirm-btn-cancel" id="confirmCancelBtn">取消</button>' +
                '<button class="confirm-btn confirm-btn-confirm" id="confirmOkBtn">确定</button>' +
                '</div></div>';

            Modal.open('确认操作', bodyHtml);

            document.getElementById('confirmCancelBtn').addEventListener('click', function() {
                Modal.close();
            });
            document.getElementById('confirmOkBtn').addEventListener('click', function() {
                Modal.close();
                onConfirm();
            });
        }

        // --- Reset Handler ---
        function bindResetButton() {
            document.getElementById('btnReset').addEventListener('click', function() {
                showConfirm('⚠️', '确定要重置所有进度吗？此操作不可撤销。', function() {
                    State.reset();
                    UI.render();
                    UI.showToast('已重置所有进度', 'success');
                });
            });
        }

        // --- Mode Switch Confirmation ---
        function bindModeSwitchConfirmation() {
            document.getElementById('btnModeSwitch').addEventListener('click', function() {
                showModeSwitchModal();
            });
        }

        // --- Question List Button ---
        function bindQuestionListButton() {
            document.getElementById('btnQuestionList').addEventListener('click', function() {
                UI.showQuestionList();
            });
        }

        // --- Init ---
        async function init() {
            await loadQuestions();
            State.init();
            if (typeof Sync !== 'undefined') {
                try { Sync.init(); } catch (e) { /* ignore */ }
            }
            UI.render();
            Events.init();
            bindResetButton();
            bindModeSwitchConfirmation();
            bindQuestionListButton();

            // Pull latest from Firebase when tab becomes visible
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible' && typeof Sync !== 'undefined') {
                    try { Sync.loadFromCloud(); } catch (e) { /* ignore */ }
                }
            });
        }

        return { init: init };
    })();

    document.addEventListener('DOMContentLoaded', function() {
        App.init();
    });



/* =============================================
   EduAI — Universal Dashboard Script
   Handles Student, Teacher, and Parent Panels
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- User Data Initialization ---
    const userName = localStorage.getItem('eduai_user') || "Foydalanuvchi";
    const userRole = localStorage.getItem('eduai_role') || "student";
    
    const uiUserName = document.getElementById('userName');
    const uiWelcomeName = document.getElementById('welcomeName');
    const uiUserAvatar = document.getElementById('userAvatar');

    if(uiUserName) uiUserName.textContent = userName;
    if(uiWelcomeName) uiWelcomeName.textContent = userName;
    if(uiUserAvatar) {
        let avatarBg = '6366f1';
        if(userRole === 'teacher') avatarBg = '8b5cf6';
        if(userRole === 'parent') avatarBg = '10b981';
        uiUserAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=${avatarBg}&color=fff`;
    }

    // --- Sidebar View Switching ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.dashboard-view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const viewId = item.getAttribute('data-view');
            if(!viewId) return;
            
            e.preventDefault();

            // Toggle active class on nav
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Show relevant view
            views.forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(`view-${viewId}`);
            if(targetView) targetView.classList.add('active');
        });
    });

    // --- Pomodoro Timer Logic ---
    let timerInterval;
    let timeLeft = 1500; // 25 minutes default
    let isRunning = false;

    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    const modeBtns = document.querySelectorAll('.timer-mode');

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Vaqt tugadi! Tanaffus qiling yoki davom eting.');
            resetTimer();
        }
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
        }, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    }

    function resetTimer() {
        pauseTimer();
        // Reset to active mode time
        const activeMode = document.querySelector('.timer-mode.active');
        timeLeft = parseInt(activeMode.dataset.time);
        updateTimer();
    }

    if (startBtn) {
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                timeLeft = parseInt(btn.dataset.time);
                updateTimer();
                pauseTimer();
            });
        });
    }

    // --- Dedicated To-Do List Logic ---
    const todoInputDed = document.getElementById('todoInputDedicated');
    const addTodoBtnDed = document.getElementById('addTodoDedicated');
    const todoListDed = document.getElementById('todoListDedicated');
    const clearCompBtnDed = document.getElementById('clearCompletedDedicated');

    if (addTodoBtnDed && todoInputDed && todoListDed) {
        addTodoBtnDed.addEventListener('click', () => {
            const text = todoInputDed.value.trim();
            if (text) {
                createTodoItem(text, todoListDed);
                todoInputDed.value = '';
            }
        });

        todoInputDed.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = todoInputDed.value.trim();
                if (text) {
                    createTodoItem(text, todoListDed);
                    todoInputDed.value = '';
                }
            }
        });

        clearCompBtnDed.addEventListener('click', () => {
            const items = todoListDed.querySelectorAll('.todo-item');
            items.forEach(item => item.remove());
        });
    }

    function createTodoItem(text, container) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox">
            <span>${text}</span>
            <button class="delete-todo">&times;</button>
        `;
        
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => li.classList.toggle('completed', checkbox.checked));

        const deleteBtn = li.querySelector('.delete-todo');
        deleteBtn.addEventListener('click', () => li.remove());

        container.appendChild(li);
    }

    // Initialize items
    if (todoListDed) {
        const existingItems = todoListDed.querySelectorAll('.todo-item');
        existingItems.forEach(item => {
            const checkbox = item.querySelector('input');
            checkbox.addEventListener('change', () => item.classList.toggle('completed', checkbox.checked));
            const deleteBtn = item.querySelector('.delete-todo');
            deleteBtn.addEventListener('click', () => item.remove());
        });
    }

    // --- Chat File Upload Simulation ---
    const toolBtns = document.querySelectorAll('.chat-tool-btn');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('title');
            
            if (title === 'Ovozli xabar') {
                appendMessage(`[Ovoz yozilmoqda...] 🎙️`, 'user');
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    appendMessage(`Ovozingizni qabul qildim! Tushunishimcha, siz darslardagi so'nggi natijalarni tahlil qilishni xohlayapsiz. To'g'rimi?`, 'bot');
                }, 2000);
                return;
            }

            // Trigger file picker
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if(file) {
                    appendMessage(`[Tizim]: **${file.name}** fayli yuklandi. Tahlil qilinmoqda...`, 'bot');
                    showTyping();
                    setTimeout(() => {
                        hideTyping();
                        appendMessage(`Fayl tahlili yakunlandi. Men ushbu hujjatda **${title.split(' ')[0]}** mavzusiga oid muhim ma'lumotlarni aniqladim. Savolingiz bo'lsa bering!`, 'bot');
                    }, 1500);
                }
            };
            fileInput.click();
        });
    });
    
    // --- Subject-Specific Isolated AI Chat Logic ---
    const subjectMessages = document.getElementById('subjectChatMessages');
    const subjectForm = document.getElementById('subjectChatForm');
    const subjectInput = document.getElementById('subjectChatInput');
    const chatSubjectName = document.getElementById('chatSubjectName');
    const chatSubjectIcon = document.getElementById('chatSubjectIcon');
    const backToHubBtn = document.querySelector('.back-to-hub');

    let activeSubject = null;
    let subjectHistories = {
        'matematika': [],
        'ingliz': [],
        'fizika': [],
        'kimyo': [],
        'ona-tili': [],
        'xitoy': [],
        'rus': []
    };

    const subjectDisplayNames = {
        'matematika': 'Matematika',
        'ingliz': 'Ingliz tili',
        'fizika': 'Fizika',
        'kimyo': 'Kimyo',
        'ona-tili': 'Ona tili',
        'xitoy': 'Xitoy tili',
        'rus': 'Rus tili'
    };

    if (subjectInput) {
        subjectInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    if (subjectForm) {
        subjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = subjectInput.value.trim();
            if (!text || !activeSubject) return;

            appendSubjectMessage(text, 'user');
            subjectInput.value = '';
            subjectInput.style.height = 'auto';

            showSubjectTyping();

            setTimeout(() => {
                hideSubjectTyping();
                const response = getAIResponse(text, activeSubject);
                appendSubjectMessage(response, 'bot');
            }, 800 + Math.random() * 400);
        });
    }

    if (backToHubBtn) {
        backToHubBtn.addEventListener('click', () => {
            views.forEach(v => v.classList.remove('active'));
            document.getElementById('view-ai-hub').classList.add('active');
        });
    }

    function appendSubjectMessage(text, type) {
        if (!subjectMessages) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\n/g, '<br>');
        
        bubble.innerHTML = formatted;
        msgDiv.appendChild(bubble);
        subjectMessages.appendChild(msgDiv);
        
        // Save to history
        subjectHistories[activeSubject].push({ text, type });
        
        setTimeout(() => {
            subjectMessages.scrollTop = subjectMessages.scrollHeight;
        }, 10);
    }

    function showSubjectTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator-msg';
        typingDiv.id = 'subjectTyping';
        typingDiv.innerHTML = `<div class="bubble"><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span></div>`;
        subjectMessages.appendChild(typingDiv);
        subjectMessages.scrollTop = subjectMessages.scrollHeight;
    }

    function hideSubjectTyping() {
        const el = document.getElementById('subjectTyping');
        if (el) el.remove();
    }
    function hideTyping() {
        const el = document.getElementById('aiTyping');
        if (el) el.remove();
    }

    // --- Logout Handler ---
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            if(confirm('Tizimdan chiqishni xohlaysizmi?')) {
                localStorage.removeItem('eduai_user');
                localStorage.removeItem('eduai_role');
            } else {
                e.preventDefault();
            }
        });
    }

    // --- AI Hub Subject Selection & Chat Switching ---
    const subjectCards = document.querySelectorAll('.subject-card');

    subjectCards.forEach(card => {
        card.addEventListener('click', () => {
            const subject = card.getAttribute('data-subject');
            activeSubject = subject;
            
            // Switch view
            views.forEach(v => v.classList.remove('active'));
            const chatView = document.getElementById('view-subject-chat');
            chatView.classList.add('active');

            // Set UI details
            if (chatSubjectName) chatSubjectName.textContent = subjectDisplayNames[subject];
            if (chatSubjectIcon) {
                const sourceIcon = card.querySelector('.subject-icon');
                chatSubjectIcon.style.background = sourceIcon.style.background;
                chatSubjectIcon.style.color = sourceIcon.style.color;
                chatSubjectIcon.innerHTML = sourceIcon.innerHTML;
            }

            // Restore History
            subjectMessages.innerHTML = '';
            if (subjectHistories[subject].length === 0) {
                // Initial Greeting
                setTimeout(() => {
                    appendSubjectMessage(`Assalomu alaykum! **${subjectDisplayNames[subject]}** bo'limiga xush kelibsiz! Men ushbu fan bo'yicha Sizga shaxsiy repetitorlik qilaman. Qaysi mavzudan boshlaymiz?`, 'bot');
                }, 400);
            } else {
                subjectHistories[subject].forEach(msg => {
                    const msgDiv = document.createElement('div');
                    msgDiv.className = `message ${msg.type}`;
                    const bubble = document.createElement('div');
                    bubble.className = 'bubble';
                    bubble.innerHTML = msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                    msgDiv.appendChild(bubble);
                    subjectMessages.appendChild(msgDiv);
                });
                subjectMessages.scrollTop = subjectMessages.scrollHeight;
            }
        });
    });

    function getAIResponse(input, subject) {
        const q = input.toLowerCase();
        
        const knowledgeBase = {
            'matematika': "Matematika fanidan Sizga yordam berishga tayyorman! Algebra, Geometriya yoki Trigonometriya? Masalaning shartini yuboring.",
            'ingliz': "English tutoring activated! Grammatika, so'z boyligi yoki Speaking mashq qilamizmi?",
            'xitoy': "Xitoy tili (Hànyǔ) — kelajak tili! Ierogliflar yoki tonlarni o'rganimiz.",
            'kimyo': "Kimyo olamiga xush kelibsiz! Mendeleyev jadvali va reaksiyalarni tahlil qilamiz.",
            'fizika': "Fizika — koinot sirlarini o'rganamiz! Nyuton qonunlari yoki elektr zanjirlari?",
            'ona-tili': "Ona tili va adabiyot — millat ruhi! Grammatika qoidalari yoki imlo?",
            'rus': "Rus tili (Русский язык) darslariga xush kelibsiz! Grammatika va so'zlashuv."
        };

        if (q.includes('salom') || q.includes('assalom')) {
            return `Assalomu alaykum! **${subjectDisplayNames[subject]}** fani bo'yicha Sizga qanday yordam bera olaman?`;
        }
        
        if (q.includes('tushunmadim') || q.includes('yordam')) {
            return `Xavotir olmang! Ushbu mavzuni Sizga noldan, eng tushunarli usulda tushuntirib berishga tayyorman.`;
        }

        return knowledgeBase[subject] || `Tushunarli. **${subjectDisplayNames[subject]}** fani bo'yicha suhbatni davom ettiramiz.`;
    }

    // --- Chart Data Visual Animation ---
    function animateCharts() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            const height = bar.dataset.height || bar.style.height;
            if(!bar.dataset.height) bar.dataset.height = height;
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.height = height;
            }, 100);
        });
    }
    animateCharts();

    // Re-animate when switching to stats
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if(item.getAttribute('data-view') === 'stats') {
                setTimeout(animateCharts, 400);
            }
        });
    });

    // --- Interactive Elements Feedback ---
    const gridCards = document.querySelectorAll('.grid-card, .stat-card, .class-card, .topic-item');
    gridCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => { card.style.transform = ''; }, 100);
        });
    });

});



// ========== CONFIG ==========
const CONFIG = {
    musicFile: 'music.mp3',
    giftVideo: 'gift.mp4', // حط ملف الفيديو هنا
    noGif: 'no.gif', // GIF أو صورة لما تضغط "ما موافقة" 3 مرات
    proposalImage: 'proposal.png', // صورة الشخص اللي بيطلب الزواج
    phoneNumber: '201551406032', // رقم الواتساب والتيليجرام
    warningMessages: [
        { text: 'اوعا تفكري 🔪', image: 'sticker1.png' },
        { text: 'انا ما بهزر 🙂', image: 'sticker2.png' },
        { text: 'بطلع ليك بره الشاشه بعده 🙂🔪', image: 'sticker3.png' }
    ]
};

// ========== GLOBALS ==========
let exitAttempts = 0;
let noAttempts = 0;
let backgroundMusic = null;

// ========== START ==========
window.onload = function() {
    console.log('🎬 Starting...');
    prepareMusic();
    createFloatingParticles();
    
    setTimeout(function() {
        transitionScene('intro', 'buttons-screen');
        initButtons();
    }, 5000);
};

// ========== MUSIC ==========
function prepareMusic() {
    backgroundMusic = new Audio(CONFIG.musicFile);
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.7;
}

function startMusic() {
    if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play().catch(e => console.log('Music error:', e));
    }
}

function stopMusic() {
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
    }
}

// ========== SCENE TRANSITION ==========
function transitionScene(from, to) {
    const fromScene = document.getElementById(from);
    const toScene = document.getElementById(to);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(fromScene, {
            opacity: 0,
            duration: 0.8,
            onComplete: function() {
                fromScene.classList.remove('active');
                toScene.classList.add('active');
                gsap.fromTo(toScene, 
                    { opacity: 0 },
                    { opacity: 1, duration: 0.8 }
                );
            }
        });
    } else {
        fromScene.classList.remove('active');
        toScene.classList.add('active');
    }
}

// ========== PARTICLES ==========
function createFloatingParticles() {
    const container = document.querySelector('.floating-particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(212, 175, 55, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(p);
    }
}

function createPetals() {
    document.querySelectorAll('.petals-container').forEach(container => {
        container.innerHTML = '';
        const petals = ['🌹', '🌺', '🌸', '💐', '🌷'];
        
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.textContent = petals[Math.floor(Math.random() * petals.length)];
            p.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 25 + 15}px;
                left: ${Math.random() * 100}%;
                top: -50px;
                opacity: 0.7;
                animation: petalFall ${Math.random() * 5 + 4}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(p);
        }
    });
}

// ========== BUTTONS SCREEN ==========
function initButtons() {
    const nextBtn = document.getElementById('next-btn');
    const exitBtn = document.getElementById('exit-btn');
    
    nextBtn.onclick = function() {
        startMusic();
        transitionScene('buttons-screen', 'warning-screen');
        
        setTimeout(function() {
            transitionScene('warning-screen', 'main-message-screen');
            createPetals();
            initMessageNext();
        }, 3000);
    };
    
    exitBtn.onclick = function() {
        if (exitAttempts < 3) {
            showWarning(exitAttempts);
            exitAttempts++;
            
            if (exitAttempts === 3) {
                setTimeout(replaceExitWithNext, 3000);
            }
        }
    };
}

function showWarning(index) {
    const overlay = document.getElementById('warning-overlay');
    const content = overlay.querySelector('.warning-content');
    const msg = CONFIG.warningMessages[index];
    
    content.innerHTML = `
        <img src="${msg.image}" class="warning-img" onerror="this.style.display='none'">
        <div class="warning-text">${msg.text}</div>
    `;
    
    overlay.classList.add('show');
    setTimeout(() => overlay.classList.remove('show'), 3000);
}

function replaceExitWithNext() {
    const exitBtn = document.getElementById('exit-btn');
    
    if (typeof gsap !== 'undefined') {
        gsap.to(exitBtn, {
            scale: 0,
            duration: 0.5,
            onComplete: function() {
                exitBtn.classList.remove('exit');
                exitBtn.classList.add('next');
                exitBtn.innerHTML = '<span class="btn-text">NEXT</span>';
                exitBtn.onclick = function() {
                    startMusic();
                    transitionScene('buttons-screen', 'warning-screen');
                    setTimeout(function() {
                        transitionScene('warning-screen', 'main-message-screen');
                        createPetals();
                        initMessageNext();
                    }, 3000);
                };
                gsap.to(exitBtn, { scale: 1, duration: 0.5 });
            }
        });
    }
}

// ========== MESSAGE NEXT ==========
function initMessageNext() {
    const btn = document.getElementById('message-next-btn');
    if (btn) {
        btn.onclick = function() {
            transitionScene('main-message-screen', 'game-intro-screen');
            
            // Auto transition after 5 seconds
            setTimeout(function() {
                transitionScene('game-intro-screen', 'game-screen');
                initGame();
            }, 5000);
        };
    }
}

// ========== GAME ==========
function initGame() {
    createPetals();
    
    document.querySelectorAll('.choice-card').forEach(card => {
        card.onclick = function() {
            const choice = this.getAttribute('data-choice');
            playGame(choice);
        };
    });
}

function playGame(playerChoice) {
    let result;
    
    if (playerChoice === 'scissors') result = 'lose';
    else if (playerChoice === 'rock') result = 'tie';
    else if (playerChoice === 'paper') result = 'win';
    
    const resultDiv = document.getElementById('game-result');
    const choices = { rock: 'حجر ✊', paper: 'ورقة ✋', scissors: 'مقص ✌️' };
    
    resultDiv.textContent = `اخترتي: ${choices[playerChoice]} | اخترت: ${choices.rock}`;
    
    setTimeout(function() {
        if (result === 'win') {
            transitionScene('game-screen', 'choose-box-screen');
            initBoxChoice();
        } else if (result === 'lose') {
            transitionScene('game-screen', 'lose-message-screen');
            setTimeout(function() {
                transitionScene('lose-message-screen', 'my-box-screen');
                initMyBox();
            }, 3000);
        } else {
            resultDiv.textContent = 'تعادل! جربي مرة تانية';
            setTimeout(() => resultDiv.textContent = '', 2000);
        }
    }, 2000);
}

// ========== BOX CHOICE ==========
function initBoxChoice() {
    document.querySelectorAll('.gift-box').forEach(box => {
        box.onclick = function() {
            openGiftBox(this);
        };
    });
}

function openGiftBox(boxElement) {
    stopMusic();
    
    if (typeof gsap !== 'undefined') {
        gsap.to(boxElement, {
            scale: 0,
            rotation: 360,
            duration: 0.8,
            onComplete: function() {
                showVideo();
            }
        });
    } else {
        showVideo();
    }
}

function showVideo() {
    const container = document.getElementById('video-container');
    const video = document.getElementById('gift-video');
    
    video.src = CONFIG.giftVideo;
    container.style.display = 'flex';
    
    // Show close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'video-close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = function() {
        video.pause();
        container.style.display = 'none';
        closeBtn.remove();
        startMusic();
        transitionScene('choose-box-screen', 'force-box-message');
        setTimeout(function() {
            transitionScene('force-box-message', 'my-box-screen');
            initMyBox();
        }, 3000);
    };
    container.appendChild(closeBtn);
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(video,
            { scale: 0.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: 'back.out(1.7)' }
        );
    }
    
    video.play();
    
    video.onended = function() {
        startMusic();
        container.style.display = 'none';
        closeBtn.remove();
        transitionScene('choose-box-screen', 'force-box-message');
        setTimeout(function() {
            transitionScene('force-box-message', 'my-box-screen');
            initMyBox();
        }, 3000);
    };
}

// ========== MY BOX ==========
function initMyBox() {
    const box = document.getElementById('special-box');
    
    box.onclick = function() {
        explodeBox(box);
    };
}

function explodeBox(box) {
    // Light effect
    box.style.filter = 'brightness(3)';
    
    setTimeout(function() {
        if (typeof gsap !== 'undefined') {
            gsap.to(box, {
                scale: 0,
                rotation: 720,
                opacity: 0,
                duration: 1.5,
                ease: 'power2.in',
                onComplete: function() {
                    transitionScene('my-box-screen', 'proposal-screen');
                    initProposal();
                }
            });
        } else {
            transitionScene('my-box-screen', 'proposal-screen');
            initProposal();
        }
    }, 500);
}

// ========== PROPOSAL ==========
function initProposal() {
    // Set proposal image
    const proposalImg = document.getElementById('proposal-character');
    proposalImg.src = CONFIG.proposalImage;
    
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    
    yesBtn.onclick = function() {
        transitionScene('proposal-screen', 'contact-screen');
        initContact();
    };
    
    noBtn.onclick = function() {
        noAttempts++;
        
        if (noAttempts < 3) {
            moveNoButton(noBtn);
        } else {
            hideNoButton(noBtn);
        }
    };
}

function moveNoButton(btn) {
    const maxX = window.innerWidth - btn.offsetWidth - 50;
    const maxY = window.innerHeight - btn.offsetHeight - 50;
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
            x: newX,
            y: newY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

function hideNoButton(btn) {
    if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                showNoVideo();
            }
        });
    } else {
        btn.style.display = 'none';
        showNoVideo();
    }
}

function showNoVideo() {
    const overlay = document.getElementById('video-overlay');
    const video = document.getElementById('no-video');
    
    // Don't stop music - keep playing
    
    // Change video element to img for GIF
    const gifImg = document.createElement('img');
    gifImg.src = CONFIG.noGif;
    gifImg.className = 'no-gif';
    gifImg.style.maxWidth = '90%';
    gifImg.style.maxHeight = '90%';
    gifImg.style.borderRadius = '20px';
    
    // Hide video, show gif
    video.style.display = 'none';
    overlay.appendChild(gifImg);
    overlay.style.display = 'flex';
    
    // Show close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'video-close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = function() {
        overlay.style.display = 'none';
        gifImg.remove();
        closeBtn.remove();
    };
    overlay.appendChild(closeBtn);
    
    // Auto close after 5 seconds
    setTimeout(function() {
        if (overlay.style.display === 'flex') {
            overlay.style.display = 'none';
            gifImg.remove();
            closeBtn.remove();
        }
    }, 5000);
}

// ========== CONTACT ==========
function initContact() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const telegramBtn = document.getElementById('telegram-btn');
    
    const message = encodeURIComponent('ايوا موافقة❤️');
    
    whatsappBtn.onclick = function() {
        window.open(`https://wa.me/${CONFIG.phoneNumber}?text=${message}`, '_blank');
    };
    
    telegramBtn.onclick = function() {
        window.open(`https://t.me/${CONFIG.phoneNumber}?text=${message}`, '_blank');
    };
}

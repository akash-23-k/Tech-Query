// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.loginModal = document.getElementById('loginModal');
        this.signupModal = document.getElementById('signupModal');
        this.authButtons = document.getElementById('authButtons');
        this.userSection = document.getElementById('userSection');
        this.userName = document.getElementById('userName');

        this.init();
    }

    init() {
        // Set initial UI state
        this.updateUI();

        // Modal controls
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('signupBtn').addEventListener('click', () => this.showSignupModal());
        document.getElementById('closeLoginModal').addEventListener('click', () => this.hideLoginModal());
        document.getElementById('closeSignupModal').addEventListener('click', () => this.hideSignupModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Modal switching
        document.getElementById('switchToSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideLoginModal();
            this.showSignupModal();
        });
        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideSignupModal();
            this.showLoginModal();
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));

        // Password toggle functionality
        this.setupPasswordToggles();

        // Close modals on overlay click
        this.loginModal.addEventListener('click', (e) => {
            if (e.target === this.loginModal) this.hideLoginModal();
        });
        this.signupModal.addEventListener('click', (e) => {
            if (e.target === this.signupModal) this.hideSignupModal();
        });
    }

    setupPasswordToggles() {
        const toggles = [
            'toggleLoginPassword',
            'toggleSignupPassword', 
            'toggleConfirmPassword'
        ];

        toggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            const input = toggle.parentElement.querySelector('input');

            toggle.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    toggle.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });
    }

    showLoginModal() {
        this.loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideLoginModal() {
        this.loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showSignupModal() {
        this.signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideSignupModal() {
        this.signupModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate API call
        try {
            const user = await this.authenticateUser(email, password);
            this.setCurrentUser(user, rememberMe);
            this.hideLoginModal();
            this.showNotification('Login successful! Welcome back.', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const mobile = document.getElementById('signupMobile').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!name || !email || !mobile || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showNotification('Please agree to the terms and conditions', 'error');
            return;
        }

        // Simulate API call
        try {
            const user = await this.createUser(name, email, mobile, password);
            this.setCurrentUser(user, true);
            this.hideSignupModal();
            this.showNotification('Account created successfully! Welcome to Tech Query.', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async authenticateUser(email, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check stored users (demo purposes)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => 
            (u.email === email || u.mobile === email) && u.password === password
        );

        if (!user) {
            throw new Error('Invalid email/mobile or password');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        };
    }

    async createUser(name, email, mobile, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check for existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find(u => u.email === email)) {
            throw new Error('Email already exists');
        }

        if (users.find(u => u.mobile === mobile)) {
            throw new Error('Mobile number already exists');
        }

        // Create new user
        const user = {
            id: Date.now(),
            name,
            email,
            mobile,
            password // In real app, this would be hashed
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        };
    }

    setCurrentUser(user, remember) {
        this.currentUser = user;
        if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.updateUI();
        this.showNotification('Logged out successfully', 'success');
    }

    updateUI() {
        if (this.currentUser) {
            this.authButtons.style.display = 'none';
            this.userSection.style.display = 'flex';
            this.userName.textContent = this.currentUser.name;
        } else {
            this.authButtons.style.display = 'flex';
            this.userSection.style.display = 'none';
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// AI Integration Manager
class AIManager {
    constructor() {
        this.apiKey = null; // Set your API key here
        this.promptInput = document.getElementById('promptInput');
        this.submitBtn = document.getElementById('submitQuery');
        this.responseContainer = document.getElementById('responseContainer');
        this.responseContent = document.getElementById('responseContent');
        this.clearBtn = document.getElementById('clearResponse');

        this.init();
    }

    init() {
        this.submitBtn.addEventListener('click', () => this.handleQuery());
        this.clearBtn.addEventListener('click', () => this.clearResponse());

        // Enter key submission
        this.promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleQuery();
            }
        });
    }

    async handleQuery() {
        const query = this.promptInput.value.trim();

        if (!query) {
            this.showNotification('Please enter a query', 'error');
            return;
        }

        // Check if user is logged in (optional)
        const authManager = window.authManager;
        if (!authManager.currentUser) {
            this.showNotification('Please login to use AI features', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const response = await this.queryAI(query);
            this.displayResponse(response);
        } catch (error) {
            this.showNotification('Error processing query: ' + error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async queryAI(query) {
        // Option 1: OpenAI GPT API (requires API key)
        if (this.apiKey) {
            return await this.queryOpenAI(query);
        }

        // Option 2: Free alternative - simulate AI response
        return await this.simulateAIResponse(query);
    }

    async queryOpenAI(query) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a technical assistant specializing in programming, debugging, and technology solutions. Provide clear, helpful, and accurate responses.'
                    },
                    {
                        role: 'user',
                        content: query
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('AI service unavailable');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async simulateAIResponse(query) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate context-aware responses based on keywords
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('python')) {
            return `I can help you with Python! Here are some suggestions:

**For Python Programming:**
- Use proper indentation (4 spaces)
- Follow PEP 8 style guidelines
- Use virtual environments for projects
- Consider using \`requirements.txt\` for dependencies

**Common Python Libraries:**
- \`pandas\` for data manipulation
- \`requests\` for HTTP requests
- \`numpy\` for numerical computing
- \`flask\` or \`django\` for web development

**Example Code:**
\`\`\`python
def hello_world():
    print("Hello, World!")
    return "Success"
\`\`\`

Would you like me to help with a specific Python problem?`;
        }

        if (lowerQuery.includes('javascript') || lowerQuery.includes('js')) {
            return `JavaScript assistance at your service! ðŸš€

**Modern JavaScript Best Practices:**
- Use \`const\` and \`let\` instead of \`var\`
- Leverage arrow functions: \`const add = (a, b) => a + b\`
- Use async/await for asynchronous operations
- Implement proper error handling with try/catch

**Popular Frameworks:**
- **React**: For building user interfaces
- **Vue.js**: Progressive framework
- **Node.js**: Server-side JavaScript
- **Express.js**: Web framework for Node.js

**Example:**
\`\`\`javascript
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
\`\`\`

What specific JavaScript challenge can I help you solve?`;
        }

        if (lowerQuery.includes('debug') || lowerQuery.includes('error')) {
            return `Debugging Made Easy! ðŸ›

**Debugging Strategy:**
1. **Reproduce the issue** consistently
2. **Check the console** for error messages
3. **Use breakpoints** to pause execution
4. **Log variables** to understand data flow
5. **Test incrementally** with smaller code blocks

**Common Debugging Tools:**
- Browser DevTools (F12)
- \`console.log()\` statements
- Debugger statements: \`debugger;\`
- Linting tools (ESLint, Pylint)

**Quick Tips:**
- Read error messages carefully
- Check for typos in variable names
- Verify API endpoints and data formats
- Test with simplified inputs first

Share your specific error message, and I'll help you solve it step by step!`;
        }

        if (lowerQuery.includes('web development') || lowerQuery.includes('html') || lowerQuery.includes('css')) {
            return `Web Development Guidance! ðŸŒ

**Frontend Technologies:**
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox/grid
- **JavaScript**: Interactive functionality
- **Responsive Design**: Mobile-first approach

**CSS Best Practices:**
\`\`\`css
/* Use CSS Custom Properties */
:root {
    --primary-color: #2563eb;
    --text-color: #1e293b;
}

/* Mobile-first responsive design */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}
\`\`\`

**Modern Web Tools:**
- Build tools: Webpack, Vite
- CSS frameworks: Tailwind CSS, Bootstrap
- Version control: Git and GitHub
- Package managers: npm, yarn

What aspect of web development would you like to explore further?`;
        }

        // Default response for general queries
        return `Thank you for your query! I'm here to help with technical problems and programming challenges.

**I can assist with:**
- ðŸ Python programming and debugging
- ðŸŒ Web development (HTML, CSS, JavaScript)
- ðŸ“± Mobile app development concepts
- ðŸ¤– AI and machine learning basics
- ðŸ”§ Code optimization and best practices
- ðŸ› Debugging and troubleshooting

**To get the best help:**
1. Be specific about your problem
2. Include error messages if any
3. Mention your programming language/framework
4. Share relevant code snippets

**Your query:** "${query}"

Please provide more details about what you'd like help with, and I'll give you a more targeted response!`;
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<div class="loading"></div> Processing...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Query';
        }
    }

    displayResponse(response) {
        this.responseContent.innerHTML = this.formatResponse(response);
        this.responseContainer.style.display = 'block';
        this.responseContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    formatResponse(text) {
        // Convert markdown-like syntax to HTML
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${formatted}</p>`;
    }

    clearResponse() {
        this.responseContainer.style.display = 'none';
        this.responseContent.innerHTML = '';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Enhanced Theme Manager
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.currentTheme = localStorage.getItem('theme') || 'light';

        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            this.themeIcon.className = 'fas fa-moon';
        } else {
            this.themeIcon.className = 'fas fa-sun';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Enhanced Mobile Menu
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.navLinks = document.querySelector('.nav-links');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        document.addEventListener('click', (e) => {
            if (!this.menuToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.navLinks.style.display = 'flex';
        this.navLinks.style.flexDirection = 'column';
        this.navLinks.style.position = 'absolute';
        this.navLinks.style.top = '100%';
        this.navLinks.style.left = '0';
        this.navLinks.style.right = '0';
        this.navLinks.style.backgroundColor = 'var(--surface-color)';
        this.navLinks.style.padding = '1rem';
        this.navLinks.style.boxShadow = 'var(--shadow-lg)';
        this.navLinks.style.borderTop = '1px solid var(--border-color)';
        this.navLinks.style.zIndex = '1001';
        this.isOpen = true;

        this.menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    }

    closeMenu() {
        this.navLinks.style.cssText = '';
        this.isOpen = false;
        this.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Enhanced Tag Manager
class TagManager {
    constructor() {
        this.tags = document.querySelectorAll('.tag');
        this.promptInput = document.getElementById('promptInput');

        this.init();
    }

    init() {
        this.tags.forEach(tag => {
            tag.addEventListener('click', () => this.handleTagClick(tag.textContent));
        });
    }

    handleTagClick(tagText) {
        const currentText = this.promptInput.value.trim();
        const newText = currentText ? `${currentText} ${tagText}` : tagText;
        this.promptInput.value = newText;
        this.promptInput.focus();
        this.autoResize();
    }

    autoResize() {
        this.promptInput.style.height = 'auto';
        this.promptInput.style.height = Math.min(this.promptInput.scrollHeight, 200) + 'px';
    }
}

// Voice Input Manager
class VoiceManager {
    constructor() {
        this.voiceBtn = document.getElementById('voiceBtn');
        this.promptInput = document.getElementById('promptInput');
        this.isRecording = false;

        this.init();
    }

    init() {
        this.voiceBtn.addEventListener('click', () => this.handleVoiceInput());
    }

    handleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            this.startRecording();

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.promptInput.value = transcript;
                this.autoResize();
            };

            recognition.onerror = (event) => {
                this.showNotification('Voice recognition error: ' + event.error, 'error');
            };

            recognition.onend = () => {
                this.stopRecording();
            };

            recognition.start();
        } else {
            this.showNotification('Voice recognition is not supported in this browser.', 'error');
        }
    }

    startRecording() {
        this.isRecording = true;
        this.voiceBtn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
        this.voiceBtn.style.backgroundColor = '#ef4444';
        this.voiceBtn.style.animation = 'pulse 1s infinite';
    }

    stopRecording() {
        this.isRecording = false;
        this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        this.voiceBtn.style.backgroundColor = 'var(--accent-color)';
        this.voiceBtn.style.animation = '';
    }

    autoResize() {
        this.promptInput.style.height = 'auto';
        this.promptInput.style.height = Math.min(this.promptInput.scrollHeight, 200) + 'px';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make managers globally accessible
    window.authManager = new AuthManager();
    window.aiManager = new AIManager();
    window.themeManager = new ThemeManager();
    window.mobileMenu = new MobileMenu();
    window.tagManager = new TagManager();
    window.voiceManager = new VoiceManager();

    // Add page loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Add pulse animation for recording
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('Page is now visible');
    } else {
        console.log('Page is now hidden');
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    console.log('Page loaded in', performance.now().toFixed(2), 'ms');
});


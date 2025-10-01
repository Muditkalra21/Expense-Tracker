//app.js style.css index.html

const API_BASE_URL = 'http://localhost:8080/api';

let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
let isLoading = false;

document.addEventListener('DOMContentLoaded', function() {
    if (token && currentUser.username) {
        showDashboard();
    } else {
        showLogin();
    }

    // Auth forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('show-register').addEventListener('click', showRegister);
    document.getElementById('show-login').addEventListener('click', showLogin);

    // Dashboard controls
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('refresh-btn').addEventListener('click', refreshData);

    // Company actions
    document.getElementById('load-companies-btn').addEventListener('click', loadCompanies);
    document.getElementById('add-company-form').addEventListener('submit', addCompany);
    
    // Show/hide company form
    document.getElementById('show-add-company-btn').addEventListener('click', function() {
        const form = document.getElementById('add-company-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Expense actions
    document.getElementById('load-expenses-btn').addEventListener('click', loadExpenses);
    document.getElementById('add-expense-form').addEventListener('submit', addExpense);
    
    // Show/hide expense form
    document.getElementById('show-add-expense-btn').addEventListener('click', function() {
        const form = document.getElementById('add-expense-form');
        const isVisible = form.style.display !== 'none';
        form.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            setDefaultDate();
        }
    });
});

function showLogin() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('register-section').classList.add('hidden');
}

function showRegister() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.remove('hidden');
}

function showDashboard() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    
    // Display username in dashboard
    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement && currentUser.username) {
        welcomeElement.textContent = `Welcome, ${currentUser.username}!`;
    }
    
    refreshData();
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function setLoading(loading, buttonId = null) {
    isLoading = loading;
    const loadingOverlay = document.getElementById('loading-overlay') || createLoadingOverlay();
    
    if (loading) {
        loadingOverlay.style.display = 'flex';
        if (buttonId) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = true;
                button.textContent = 'Loading...';
            }
        }
    } else {
        loadingOverlay.style.display = 'none';
        if (buttonId) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = false;
                // Reset button text based on its original purpose
                resetButtonText(button);
            }
        }
    }
}

function resetButtonText(button) {
    const textMap = {
        'login-btn': 'Login',
        'register-btn': 'Register',
        'load-companies-btn': 'Load Companies',
        'load-expenses-btn': 'Load Expenses',
        'show-add-company-btn': 'Add New Company',
        'show-add-expense-btn': 'Add New Expense'
    };
    button.textContent = textMap[button.id] || button.textContent.replace('Loading...', '');
}

// Enhanced message function with better styling
function showMessage(elementId, message, isSuccess = true, duration = 5000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `
        <div class="message-content">
            <i class="icon ${isSuccess ? 'success-icon' : 'error-icon'}"></i>
            <span>${message}</span>
        </div>
    `;
    element.className = isSuccess ? 'message success' : 'message error';
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
        element.textContent = '';
    }, duration);
}

function clearAuthForms() {
    // Clear login form
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    
    // Clear register form
    document.getElementById('register-username').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    
    // Clear any error messages
    document.getElementById('login-message').textContent = '';
    document.getElementById('register-message').textContent = '';
}

async function handleLogin(event) {
    event.preventDefault();
    setLoading(true, 'login-btn');
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            currentUser = {
                id: data.id,
                username: data.username,
                email: data.email
            };
            
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Clear forms after successful login
            clearAuthForms();
            
            showMessage('login-message', 'Login successful! Welcome back.', true);
            setTimeout(() => showDashboard(), 1000);
        } else {
            const error = await response.text();
            showMessage('login-message', error, false);
        }
    } catch (error) {
        showMessage('login-message', 'Login failed: ' + error.message, false);
    } finally {
        setLoading(false, 'login-btn');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            currentUser = {
                id: data.id,
                username: data.username,
                email: data.email
            };
            
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Clear forms after successful registration
            clearAuthForms();
            
            showDashboard();
        } else {
            const error = await response.text();
            showMessage('register-message', error, false);
        }
    } catch (error) {
        showMessage('register-message', 'Registration failed: ' + error.message, false);
    }
}

function handleLogout() {
    token = null;
    currentUser = {};
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Clear all form fields and messages for security
    clearAuthForms();
    
    showLogin();
}

async function refreshData() {
    await Promise.all([loadCompanies(), loadExpenses()]);
}

// Global variable to store companies for lookup
let companiesMap = {};

async function loadCompanies() {
    try {
        const response = await fetch(`${API_BASE_URL}/companies`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const companies = await response.json();
            
            // Store companies in a map for easy lookup
            companiesMap = {};
            companies.forEach(company => {
                companiesMap[company.id] = company;
            });
            
            displayCompanies(companies);
        } else if (response.status === 401) {
            handleLogout();
        } else {
            showMessage('login-message', 'Failed to load companies', false);
        }
    } catch (error) {
        showMessage('login-message', 'Error loading companies: ' + error.message, false);
    }
}

function displayCompanies(companies) {
    const container = document.getElementById('companies-list');
    const companySelect = document.getElementById('expense-company');
    
    container.innerHTML = '';
    companySelect.innerHTML = '<option value="">Select Company</option>';

    if (companies.length === 0) {
        container.innerHTML = '<p>No companies found.</p>';
        return;
    }

    companies.forEach(company => {
        const companyDiv = document.createElement('div');
        companyDiv.className = 'company-item';
        companyDiv.innerHTML = `
            <h4>${company.name}</h4>
            <p>Address: ${company.address || 'No address provided'}</p>
        `;
        container.appendChild(companyDiv);
        
        // Add to expense company dropdown
        const option = document.createElement('option');
        option.value = company.id;
        option.textContent = company.name;
        companySelect.appendChild(option);
    });
}

async function addCompany(event) {
    event.preventDefault();
    const name = document.getElementById('company-name').value;
    const address = document.getElementById('company-address').value;

    try {
        const response = await fetch(`${API_BASE_URL}/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name, address }),
        });

        if (response.ok) {
            document.getElementById('add-company-form').reset();
            document.getElementById('add-company-form').style.display = 'none';
            loadCompanies();
            showMessage('login-message', 'Company added successfully!', true);
        } else if (response.status === 401) {
            handleLogout();
        } else {
            const error = await response.text();
            showMessage('login-message', error, false);
        }
    } catch (error) {
        showMessage('login-message', 'Error adding company: ' + error.message, false);
    }
}

async function loadExpenses() {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const expenses = await response.json();
            displayExpenses(expenses);
        } else if (response.status === 401) {
            handleLogout();
        } else {
            showMessage('login-message', 'Failed to load expenses', false);
        }
    } catch (error) {
        showMessage('login-message', 'Error loading expenses: ' + error.message, false);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getCategoryIcon(category) {
    const icons = {
        'FOOD': '🍽️',
        'TRANSPORT': '🚗',
        'ENTERTAINMENT': '🎭',
        'UTILITIES': '⚡',
        'OFFICE': '🏢',
        'TRAVEL': '✈️',
        'OTHER': '📝'
    };
    return icons[category] || '📝';
}

// Enhanced expense display with better formatting
function displayExpenses(expenses) {
    const container = document.getElementById('expenses-list');
    container.innerHTML = '';

    if (expenses.length === 0) {
        container.innerHTML = '<div class="empty-state">No expenses found. Add your first expense to get started!</div>';
        return;
    }

    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Add summary
    const summary = document.createElement('div');
    summary.className = 'expense-summary';
    summary.innerHTML = `
        <h4>📊 Summary</h4>
        <p><strong>Total Expenses:</strong> ${formatCurrency(total)}</p>
        <p><strong>Number of Expenses:</strong> ${expenses.length}</p>
    `;
    container.appendChild(summary);

    expenses.forEach(expense => {
        const companyName = companiesMap[expense.companyId]?.name || 'Unknown Company';
        
        const expenseDiv = document.createElement('div');
        expenseDiv.className = 'expense-item';
        expenseDiv.innerHTML = `
            <h4>${expense.description}</h4>
            <p><strong>🏢 Company:</strong> ${companyName}</p>
            <p><strong>💰 Amount:</strong> ${formatCurrency(expense.amount)}</p>
            <p><strong>📁 Category:</strong> ${getCategoryIcon(expense.category)} ${expense.category || 'N/A'}</p>
            <p><strong>📅 Date:</strong> ${new Date(expense.date).toLocaleDateString()}</p>
        `;
        container.appendChild(expenseDiv);
    });
}

// Auto-set today's date for expense form
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
}

// Add input validation
function validateExpenseForm() {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const description = document.getElementById('expense-description').value.trim();
    
    if (amount <= 0) {
        showMessage('expense-message', 'Amount must be greater than $0.00', false);
        return false;
    }
    
    if (amount > 10000) {
        if (!confirm('This is a large expense (over $10,000). Are you sure?')) {
            return false;
        }
    }
    
    if (description.length < 3) {
        showMessage('expense-message', 'Description must be at least 3 characters long', false);
        return false;
    }
    
    return true;
}

// Update the addExpense function to include validation
async function addExpense(event) {
    event.preventDefault();
    
    if (!validateExpenseForm()) {
        return;
    }
    
    setLoading(true);
    
    const companyId = parseInt(document.getElementById('expense-company').value);
    const description = document.getElementById('expense-description').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    if (!companyId) {
        showMessage('expense-message', 'Please select a company', false);
        setLoading(false);
        return;
    }

    if (amount <= 0) {
        showMessage('expense-message', 'Amount must be greater than 0', false);
        setLoading(false);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ companyId, description, amount, category, date }),
        });

        if (response.ok) {
            document.getElementById('add-expense-form').reset();
            document.getElementById('add-expense-form').style.display = 'none';
            await loadExpenses();
            showMessage('expense-message', 'Expense added successfully!', true);
        } else if (response.status === 401) {
            handleLogout();
        } else {
            const error = await response.text();
            showMessage('expense-message', error, false);
        }
    } catch (error) {
        showMessage('expense-message', 'Error adding expense: ' + error.message, false);
    } finally {
        setLoading(false);
    }
}


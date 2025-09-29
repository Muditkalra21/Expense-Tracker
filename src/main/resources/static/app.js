const API_BASE_URL = 'http://localhost:8080/api';

let token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', function() {
    if (token) {
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
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
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
    refreshData();
}

function showMessage(elementId, message, isSuccess = true) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = isSuccess ? 'message success' : 'message error';
    setTimeout(() => element.textContent = '', 5000);
}

async function handleLogin(event) {
    event.preventDefault();
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
            localStorage.setItem('token', token);
            showDashboard();
        } else {
            const error = await response.text();
            showMessage('login-message', error, false);
        }
    } catch (error) {
        showMessage('login-message', 'Login failed: ' + error.message, false);
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
            localStorage.setItem('token', token);
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
    localStorage.removeItem('token');
    showLogin();
}

async function refreshData() {
    await Promise.all([loadCompanies(), loadExpenses()]);
}

async function loadCompanies() {
    try {
        const response = await fetch(`${API_BASE_URL}/companies`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const companies = await response.json();
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
    container.innerHTML = '';

    if (companies.length === 0) {
        container.innerHTML = '<p>No companies found.</p>';
        return;
    }

    companies.forEach(company => {
        const companyDiv = document.createElement('div');
        companyDiv.className = 'company-item';
        companyDiv.innerHTML = `
            <h4>${company.name}</h4>
            <p>Address: ${company.address}</p>
        `;
        container.appendChild(companyDiv);
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
            loadCompanies();
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

function displayExpenses(expenses) {
    const container = document.getElementById('expenses-list');
    container.innerHTML = '';

    if (expenses.length === 0) {
        container.innerHTML = '<p>No expenses found.</p>';
        return;
    }

    expenses.forEach(expense => {
        const expenseDiv = document.createElement('div');
        expenseDiv.className = 'expense-item';
        expenseDiv.innerHTML = `
            <h4>${expense.description}</h4>
            <p>Amount: $${expense.amount.toFixed(2)}</p>
            <p>Category: ${expense.category}</p>
            <p>Date: ${new Date(expense.date).toLocaleDateString()}</p>
        `;
        container.appendChild(expenseDiv);
    });
}

async function addExpense(event) {
    event.preventDefault();
    const description = document.getElementById('expense-description').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;

    try {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ description, amount, category, date }),
        });

        if (response.ok) {
            document.getElementById('add-expense-form').reset();
            loadExpenses();
        } else if (response.status === 401) {
            handleLogout();
        } else {
            const error = await response.text();
            showMessage('login-message', error, false);
        }
    } catch (error) {
        showMessage('login-message', 'Error adding expense: ' + error.message, false);
    }
}

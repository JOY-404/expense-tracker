const expList = document.querySelector('#expense-list');
const expenseId = document.getElementById('expenseId');

document.getElementById('date').value =new Date().toISOString().substring(0, 10); 

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchExpenses();
});

function fetchCategories() {
    const token = localStorage.getItem('token');
    const drpCategory = document.getElementById('category');

    axios.get(`${baseURL}/user/getcategory`, { headers: { 'Authorization': token } })
        .then(res => {
            res.data.forEach(category => {
                const cat = document.createElement('option');
                cat.value = category.id;
                cat.innerText = category.category;
                drpCategory.appendChild(cat);
            });
        })
        .catch(err => {
            if (err.response) {
                if (err.response.status == 401) {
                    // token invalid - go to login page
                    window.location.replace('login.html')
                }
                else {
                    showNotification(`${err.response.data.msg}`, true);
                }
            }
            else if (err.request) {
                showNotification('Error: No Response From Server', true);
            }
            else {
                showNotification(err.message, true);
            }
        });
}

function fetchExpenses() {
    const token = localStorage.getItem('token');
    expList.innerHTML = '';

    axios.get(`${baseURL}/user/getexpense`, { headers: { 'Authorization': token } })
        .then(res => {
            if (res.data.length > 0) {
                expList.parentNode.parentNode.style.visibility = 'visible';

                const headerLI = document.createElement('li');
                headerLI.classList.add('expense-list-item', 'expense-header');
                headerLI.innerHTML = `<span class="exp-date">Date</span>
                    <span class="exp-cat">Category</span>
                    <span class="exp-desc">Description</span>
                    <span class="exp-amt">Amount</span>
                    <span class="tbl-edit-del"></span>`;
                expList.appendChild(headerLI);

                res.data.forEach(expense => {
                    const expLI = document.createElement('li');
                    expLI.className = 'expense-list-item';
                    expLI.setAttribute('id', `exp${expense.id}`);
                    expLI.innerHTML = `<span class="exp-date">${formatDate(expense.expenseDate)}</span>
                    <span class="exp-cat">${expense.category}</span>
                    <span class="exp-desc">${expense.description}</span>
                    <span class="exp-amt">₹&nbsp;${expense.amount.toFixed(2)}</span>
                    <span class="tbl-edit-del">
                        <i class="fa fa-edit tbl-edit"></i>
                        <i class="fa fa-trash-o tbl-delete"></i>
                        <input type="hidden" name="" class="exp-cat-id" value="${expense.categoryId}">
                    </span>`;
                    expList.appendChild(expLI);
                });
            }
            loader.classList.add('display-none');
        })
        .catch(err => {
            loader.classList.add('display-none');
            if (err.response) {
                if (err.response.status == 401) {
                    // token invalid - go to login page
                    window.location.replace('login.html')
                }
                else {
                    showNotification(`${err.response.data.msg}`, true);
                }
            }
            else if (err.request) {
                showNotification('Error: No Response From Server', true);
            }
            else {
                showNotification(err.message, true);
            }
        });
}

// Add/Update expense
const btnAddExpense = document.querySelector('.btn-add-expense');
btnAddExpense.addEventListener('click', () => {
    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const catTag = document.getElementById('category');
    const categoryId = catTag.value;
    const categoryText = catTag.options[catTag.selectedIndex].text;
    const token = localStorage.getItem('token');
    //console.log(date, amount, description, category, token);

    if (amount.trim() == '' || parseFloat(amount) <= 0) {
        showNotification('Enter valid amount', true);
        document.getElementById('amount').focus();
    }
    else if (date.trim() == '') {
        showNotification('Please Enter Date', true);
        document.getElementById('date').focus();
    }
    else {
        const expenseDetails = {
            date: date,
            amount: amount,
            description: description,
            categoryId: categoryId
        }

        if (expenseId.value.trim() == '') {
            // Add new expense
            loader.classList.remove('display-none');

            axios.post(`${baseURL}/user/addexpense`, expenseDetails, { headers: { 'Authorization': token } })
                .then(res => {
                    fetchExpenses();
                    clearAll();
                    showNotification('Expense Added Successfully');
                })
                .catch(err => {
                    loader.classList.add('display-none');
                    if (err.response) {
                        if (err.response.status == 401) {
                            // token invalid - go to login page
                            window.location.replace('login.html')
                        }
                        else {
                            showNotification(`${err.response.data.msg}`, true);
                        }
                    }
                    else if (err.request) {
                        showNotification('Error: No Response From Server', true);
                    }
                    else {
                        showNotification(err.message, true);
                    }
                });
        }
        else {
            // Update Expense

            axios.post(`${baseURL}/user/update-expense/${expenseId.value}`, expenseDetails,
                { headers: { 'Authorization': token } })
                .then(res => {
                    showNotification('Expense Updated Successfully');
                    expList.querySelector(`#exp${expenseId.value} .exp-date`).innerText = formatDate(date);
                    expList.querySelector(`#exp${expenseId.value} .exp-cat`).innerText = categoryText;
                    expList.querySelector(`#exp${expenseId.value} .exp-cat-id`).value = categoryId;
                    expList.querySelector(`#exp${expenseId.value} .exp-desc`).innerText = description;
                    expList.querySelector(`#exp${expenseId.value} .exp-amt`).innerText = `₹ ${parseFloat(amount).toFixed(2)}`;
                    clearAll();
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status == 401) {
                            // token invalid - go to login page
                            window.location.replace('login.html')
                        }
                        else {
                            showNotification(`${err.response.data.msg}`, true);
                        }
                    }
                    else if (err.request) {
                        showNotification('Error: No Response From Server', true);
                    }
                    else {
                        showNotification(err.message, true);
                    }
                });
        }
    }
});

// edit/delete expense
expList.addEventListener('click', (e) => {
    if (e.target.className.includes('tbl-edit')) {
        // edit expense
        const expLI = e.target.parentNode.parentNode;
        expenseId.value = expLI.id.substr(3);
        document.getElementById('date').value = getDateForInput(expLI.querySelector('.exp-date').innerText);
        document.getElementById('amount').value = expLI.querySelector('.exp-amt').innerText.substr(2);
        document.getElementById('description').value = expLI.querySelector('.exp-desc').innerText;
        document.getElementById('category').value = expLI.querySelector('.exp-cat-id').value;
        document.querySelector('.btn-add-expense').innerText = 'Update Expense';
    }
    else if (e.target.className.includes('tbl-delete')) {
        // delete expense
        if (confirm('Are you sure to delete this expense ?')) {
            const expLI = e.target.parentNode.parentNode;

            axios.delete(`${baseURL}/user/delete-expense/${expLI.id.substr(3)}`, { headers: { 'Authorization': token } })
                .then(res => {
                    if (res.data.success) {
                        expLI.parentNode.removeChild(expLI);
                        showNotification(`Expense Deleted Successfully`);
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status == 401) {
                            // token invalid - go to login page
                            window.location.replace('login.html')
                        }
                        else {
                            showNotification(`${err.response.data.msg}`, true);
                        }
                    }
                    else if (err.request) {
                        showNotification('Error: No Response From Server', true);
                    }
                    else {
                        showNotification(err.message, true);
                    }
                });
        }
    }
});

function getDateForInput(date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().substring(0, 10); 
}

function formatDate(date) {
    // use moment.js if any problem arises
    let d = Date.parse(date);
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${da}-${mo}-${ye}`;
}

function clearAll() {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').selectedIndex = 0;
    document.querySelector('.btn-add-expense').innerText = 'Add Expense';
    expenseId.value = '';
}

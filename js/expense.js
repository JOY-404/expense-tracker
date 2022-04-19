const baseURL = 'http://localhost:4000';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    axios.get(`${baseURL}/auth/authenticate`, { headers: { 'Authorization': token } })
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
    fetchCategories();
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
            })
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

const btnAddExpense = document.querySelector('.btn-add-expense');
btnAddExpense.addEventListener('click', () => {
    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
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
            categoryId: category
        }
        axios.post(`${baseURL}/user/addexpense`, expenseDetails, { headers: { 'Authorization': token } })
            .then(res => {
                clearAll();
                showNotification('Expense Added Successfully');
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
});

function clearAll() {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = 1;
}

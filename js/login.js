const baseURL = 'http://localhost:4000';

const btnLogin = document.querySelector('.btn-signup');
btnLogin.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email.trim() == '') {
        showNotification('Email ID is Mandatory', true);
        document.getElementById('email').focus();
    }
    else if (password.trim() == '') {
        showNotification('Password cannot be Blank', true);
        document.getElementById('password').focus();
    }
    else {
        axios.post(`${baseURL}/auth/login`, {
            email: email,
            password: password
        })
            .then(res => {
                showNotification('Successfuly Logged In');
                window.location.href = 'expense.html';
            })
            .catch(err => {
                if (err.response) {
                    showNotification(`${err.response.data.msg}`, true);
                }
                else if (err.request) {
                    showNotification('Error: No Response From Server', true);
                }
                else {
                    showNotification(err.message, true);
                }
            });
    }
})
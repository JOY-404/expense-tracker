const baseURL = 'http://localhost:4000';

// If password has been changed
location.search.substring(1).split("&").forEach(item => { 
    if(item.split("=")[0] == 'pr')
        showNotification('Your password has been changed successfully.', false, 6000);
});

const btnLogin = document.querySelector('.btn-signup');
btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
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
                //showNotification('Successfuly Logged In');
                //console.log(res.data);
                localStorage.setItem('userDetails', JSON.stringify(res.data.userDetails));
                localStorage.setItem('token', res.data.token);
                window.location.replace('dashboard.html');
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
});

const btnForgot = document.querySelector('.forgot-pw');
btnForgot.addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('password-form').style.display = 'block';
});

const btnReset = document.querySelector('.btn-reset');
btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    if (email.trim() == '') {
        showNotification('Email ID is Mandatory', true);
        document.getElementById('reset-email').focus();
    }
    else {
        axios.post(`${baseURL}/password/forgotpassword`, { email: email })
            .then(res => {
                document.getElementById('reset-email').value = '';
                document.getElementById('login-form').style.display = 'block';
                document.getElementById('password-form').style.display = 'none';
                showNotification('You will receive an email with instructions on how to reset your password in a few minutes.', false, 6000);
            })
            .catch(err => {
                if (err.response) {
                    showNotification(`${err.response.data}`, true);
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


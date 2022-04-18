const baseURL = 'http://localhost:4000';

const btnSignup = document.querySelector('.btn-signup');
btnSignup.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    if(name.trim() == '') {
        showNotification('Name is Mandatory', true);
        document.getElementById('name').focus();
    }
    else if (email.trim() == '') {
        showNotification('Email ID is Mandatory', true);
        document.getElementById('email').focus();
    }
    else if (phone.trim() == '') {
        showNotification('Phone No. is Mandatory', true);
        document.getElementById('phone').focus();
    }
    else if (password.trim() == '') {
        showNotification('Password cannot be Blank', true);
        document.getElementById('password').focus();
    }
    else {
        axios.post(`${baseURL}/auth/signup`, {
            name: name,
            email: email,
            phone: phone,
            password: password
        })
            .then(res => {
                if (res.data.msg == 'User Already Exists') {
                    showNotification('User already exists, Please Login', true);
                }
                else {
                    showNotification('Successfuly Signed Up');
                }
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
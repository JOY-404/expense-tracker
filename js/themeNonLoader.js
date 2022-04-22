const loader = document.getElementById('loading');

if (sessionStorage.getItem('isPremium')) {
    if (sessionStorage.getItem('isPremium') === 'true') {
        document.body.classList.add('dark');
        document.getElementById('buy-premium').style.display = 'none';
    }
}
else {
    const token = localStorage.getItem('token');
    axios.get(`${baseURL}/auth/authenticate`, { headers: { 'Authorization': token } })
        .then(res => {
            sessionStorage.setItem('isPremium', res.data.isPremium);
            if (res.data.isPremium) {
                document.body.classList.add('dark');
                document.getElementById('buy-premium').style.display = 'none';
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
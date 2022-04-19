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
});

const btnAddCategory = document.querySelector('.btn-add-category');
btnAddCategory.addEventListener('click', () => {
    const category = document.getElementById('category').value;
    const token = localStorage.getItem('token');

    if (category.trim() == '') {
        showNotification('Category should not be blank', true);
        document.getElementById('category').focus();
    }
    else {
        axios.post(`${baseURL}/user/addcategory`, { category: category }, 
        { headers: { 'Authorization': token } })
            .then(res => {
                if (res.data.msg == 'Duplicate') {
                    showNotification('Category Already Exists', true);
                }
                else {
                    showNotification('Category Added Successfully');
                }
            })
            .catch(err => {
                if (err.response) {
                    if(err.response.status == 401) {
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
})
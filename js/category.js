const catList = document.querySelector('#cat-list');
const categoryId = document.getElementById('categoryId');

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
});

function fetchCategories() {
    const token = localStorage.getItem('token');
    catList.innerHTML = '';

    axios.get(`${baseURL}/user/getcategory`, { headers: { 'Authorization': token } })
        .then(res => {
            if (res.data.length > 0) {
                catList.parentNode.parentNode.style.visibility = 'visible';
                
                const headerLI = document.createElement('li');
                headerLI.classList.add('expense-list-item','expense-header');
                headerLI.innerHTML = `<span class="cat-cat">Category</span>
                    <span class="tbl-edit-del"></span>`;
                catList.appendChild(headerLI);

                res.data.forEach(category => {
                    const catLI = document.createElement('li');
                    catLI.className = 'expense-list-item';
                    catLI.setAttribute('id', `cat${category.id}`);
                    catLI.innerHTML = `<span class="cat-cat">${category.category}</span>
                    <span class="tbl-edit-del">
                        <i class="fa fa-edit tbl-edit"></i>
                        <i class="fa fa-trash-o tbl-delete"></i>
                    </span>`;
                    catList.appendChild(catLI);
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

// add/update category
const btnAddCategory = document.querySelector('.btn-add-category');
btnAddCategory.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    const category = document.getElementById('category').value;
    if (category.trim() == '') {
        showNotification('Category should not be blank', true);
        document.getElementById('category').focus();
    }
    else {
        if (categoryId.value.trim() == '') {
            // Add new category
            loader.classList.remove('display-none');

            axios.post(`${baseURL}/user/addcategory`, { category: category },
                { headers: { 'Authorization': token } })
                .then(res => {
                    if (res.data.msg == 'Duplicate') {
                        loader.classList.add('display-none');
                        showNotification('Category Already Exists', true);
                    }
                    else {
                        fetchCategories();
                        showNotification('Category Added Successfully');
                        document.getElementById('category').value = '';
                    }
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
            // Update Category

            axios.post(`${baseURL}/user/update-category/${categoryId.value}`, { category: category },
                { headers: { 'Authorization': token } })
                .then(res => {
                    if (res.data.msg == 'Duplicate') {
                        showNotification('Category Already Exists', true);
                    }
                    else {
                        showNotification('Category Updated Successfully');
                        catList.querySelector(`#cat${categoryId.value} .cat-cat`).innerText = category;
                        document.querySelector('.btn-add-category').innerText = 'Add Category';
                        document.getElementById('category').value = '';
                        categoryId.value = '';
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

// edit/delete category
catList.addEventListener('click', (e) => {
    if (e.target.className.includes('cat-edit')) {
        // edit category
        const catLI = e.target.parentNode.parentNode;
        categoryId.value = catLI.id.substr(3);
        document.getElementById('category').value = catLI.querySelector('.cat-cat').innerText;
        document.querySelector('.btn-add-category').innerText = 'Update Category';
    } 
    else if (e.target.className.includes('cat-delete')) {
        // delete category
        if (confirm('Are you sure to delete this category ?')) {
            const catLI = e.target.parentNode.parentNode;
            const catName = catLI.querySelector('.cat-cat').innerText;

            axios.delete(`${baseURL}/user/delete-category/${catLI.id.substr(3)}`, { headers: { 'Authorization': token } })
                .then(res => {
                    if (res.data.msg == 'Dependency') {
                        showNotification('This Category is already in use! Cannot Delete Now!', true);
                    }
                    else {
                        catLI.parentNode.removeChild(catLI);
                        showNotification(`${catName} Deleted Successfully`);
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
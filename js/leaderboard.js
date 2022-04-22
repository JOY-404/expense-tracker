
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    axios.get(`${baseURL}/user/leaderboard`, { headers: { 'Authorization': token } })
        .then(res => {
            const leaderForm = document.querySelector('.my-form');
            if(res.data.isPremium) {
                // load leaderboard
                const lbTbl = document.createElement('div');
                lbTbl.className = 'leader-tbl';
                lbTbl.innerHTML = `<div class="tbl-row tbl-header">
                    <span class="tbl-col tbl-col1">Rank</span>
                    <span class="tbl-col tbl-col2">Name</span>
                    <span class="tbl-col tbl-col3">Expenses</span>
                </div>`;
                const tblItems = document.createElement('div');
                tblItems.className = 'tbl-items';
                res.data.LBdata.forEach(userDet => {
                    const userDiv = document.createElement('div');
                    userDiv.className = 'tbl-row';
                    if(userDet.id == res.data.userId) {
                        userDiv.classList.add('active');
                    }
                    userDiv.setAttribute('id',`user${userDet.id}`);
                    userDiv.innerHTML = `<span class='tbl-col1 tbl-col'>${userDet.rank}</span>
                        <span class='tbl-col2 tbl-col get-expense'>${userDet.name}</span>
                        <span class='tbl-col3 tbl-col'>₹&nbsp;${userDet.expAmount.toFixed(2)}</span>`;
                    tblItems.appendChild(userDiv);
                });
                lbTbl.appendChild(tblItems);
                leaderForm.appendChild(lbTbl);
            }
            else {
                // Get Premium Membership
                const div = document.createElement('div');
                div.style.marginTop = '1rem';
                div.innerText = 'Buy Premium Membership to view Leaderboard';
                leaderForm.appendChild(div);
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
});

const container = document.querySelector('.popup-container');
const LBItems = document.querySelector('.my-form');

LBItems.addEventListener('click', (e) => {
    if (e.target.className.includes('get-expense')) {
        loader.classList.remove('display-none');
        const userId = e.target.parentNode.id.substr(4);
        const userName = e.target.innerText;
        axios.get(`${baseURL}/user/leaderboard/${userId}`, { headers: { 'Authorization': token } })
            .then(res => {
                const popup = document.querySelector('.popup');
                popup.innerHTML = '';

                const popupClose = document.createElement('button');
                popupClose.setAttribute('id', 'close');
                popupClose.setAttribute('onclick','removePopup();');
                popupClose.innerText = 'x'
                popup.appendChild(popupClose);
                
                if (res.data.isPremium) {
                    const popupContent = document.createElement('div');
                    popupContent.className = 'popup-content';
                    popupContent.innerHTML = `<h1>${userName}</h1>
                    <div class="tbl-row tbl-header">
                        <span class="tbl-col tbl-col4">Category</span>
                        <span class="tbl-col tbl-col5">Expenses</span>
                    </div>`;
                
                    const tblItems = document.createElement('div');
                    tblItems.className = 'tbl-items';
                    res.data.userExp.forEach(expense => {
                        const tblRow = document.createElement('div');
                        tblRow.className = 'tbl-row';
                        tblRow.innerHTML = `<span class="tbl-col tbl-col4">${expense.category}</span>
                        <span class="tbl-col tbl-col5">₹&nbsp;${expense.expAmount.toFixed(2)}</span>`;
                        tblItems.appendChild(tblRow);
                    });
                    popupContent.appendChild(tblItems);
                    popup.appendChild(popupContent);
                }
                else {
                    // Get Premium Membership
                    const div = document.createElement('div');
                    div.style.marginTop = '1rem';
                    div.innerText = 'Buy Premium Membership to view Leaderboard';
                    popup.appendChild(div);
                }
                container.classList.add('active');
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
})

function removePopup() {
    container.classList.remove('active');
}

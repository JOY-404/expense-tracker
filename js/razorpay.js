const token = localStorage.getItem('token');

const btnPremium = document.getElementById('buy-premium');
btnPremium.addEventListener('click', () => {
    //alert(token);
    loader.classList.remove('display-none');
    axios.post(`${baseURL}/user/create-premium-order`, {}, { headers: { 'Authorization': token } })
        .then(res => {
            loader.classList.add('display-none');
            //console.log(2);
            const order = res.data.pmtGtwyOrder;
            //console.log(order);
            const userDetails = JSON.parse(localStorage.getItem('userDetails'));
            let options = {
                "key": "rzp_test_BVaFJ5t21b1sif", // Enter the Key ID generated from the Dashboard
                "amount": order.amount_due , // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Expense Tracker",
                "description": "Premium Membership",
                "order_id": order.id, 
                "handler": handleSuccess,
                "prefill": {
                    "name": userDetails.name,
                    "email": userDetails.email,
                    "contact": userDetails.phone
                },
                "theme": {
                    "color": "#28a746"
                }
            };
            let rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', handleFailure);
            rzp1.open();
        })
        .catch(err => {
            loader.classList.add('display-none');
            if (err.response) {
                // if (err.response.status == 401) {
                //     // token invalid - go to login page
                //     window.location.replace('login.html')
                // }
                // else {

                //console.log(err);
                    showNotification(`${err.response}`, true);
                //}
            }
            else if (err.request) {
                showNotification('Error: No Response From Server', true);
            }
            else {
                showNotification(err.message, true);
            }
        });
});

function handleSuccess(response) {
    //console.log(response.razorpay_payment_id);
    loader.classList.remove('display-none');
    axios.post(`${baseURL}/user/rzpay-success`, {
        rzpay_payment_id: response.razorpay_payment_id,
        rzpay_order_id: response.razorpay_order_id,
        rzpay_signature: response.razorpay_signature
    }, { headers: { 'Authorization': token } })
        .then(res => {
            loader.classList.add('display-none');
            // change account to Premium
            localStorage.setItem('token', res.data.token);
            document.body.classList.add('dark');
            document.getElementById('buy-premium').style.display = 'none';
            showNotification('Transaction Successful');
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


function handleFailure(response) {
    // alert(response.error.code);
    // alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);

    axios.post(`${baseURL}/user/rzpay-failure`, {
        rzpay_payment_id: response.error.metadata.payment_id,
        rzpay_order_id: response.error.metadata.order_id
    }, { headers: { 'Authorization': token } })
        .then(res => {
            // do nothing
            //showNotification('Transaction Failed', true);
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
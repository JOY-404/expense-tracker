
const theme = localStorage.getItem('theme');

if (theme === 'true') {
    document.body.classList.add('dark');
    document.getElementById('buy-premium').style.display = 'none';
}
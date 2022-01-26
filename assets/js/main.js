window.onload = ()=>{

    if (document.getElementById('show-password')) {
        let showPasswordButton = document.getElementById('show-password');
        let passwordInput = document.getElementById('password');
        let showIcon = document.getElementById('show-icon');

        showPasswordButton.addEventListener('click', ()=>{
            if (passwordInput.type == 'password'){
                passwordInput.type = 'text';
                showIcon.classList.remove('bi-eye');
                showIcon.classList.add('bi-eye-slash');
            }
            else {
                passwordInput.type = 'password'
                showIcon.classList.remove('bi-eye-slash');
                showIcon.classList.add('bi-eye');
            }
        })
    }
}
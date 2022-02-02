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
    
    function deleteCookie(name){
        let date = new Date(2000,0,01);
        date = date.toUTCString();
        document.cookie = name +'=; expires=' + date + ';path=/';
        window.location.href = '/login.html';
    
    }

    if (!getCookie('authorization') && location.href != 'http://127.0.0.1:5500/login.html') {
        Swal.fire({
            icon: 'error',
            title: 'Sessão Expirada!',
            text: 'Por favor, entre com suas credenciais',
            showCloseButton: false,
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login.html';
            }
          })
        
    }

    if (document.getElementById('exit')){
        let exitLink = document.getElementById('exit');
        exitLink.addEventListener('click', ()=> {
            deleteCookie('authorization');
        })
    }

  
}
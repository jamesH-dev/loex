const baseUrl = 'http://localhost:8080/api/';

    
if (document.querySelector('#signup')){
    const signUp = document.querySelector('#signup');

    signUp.addEventListener('submit', (e)=>{
        e.preventDefault();
        let data = new FormData(signUp);
        let json = JSON.stringify(Object.fromEntries(data));
        console.log(data.getAll);
        axios({
            method: 'post',
            url: baseUrl + 'clients/create',
            headers: {'Content-Type': 'application/json'},
            data: json,
        })
        .then((response)=>{
            console.log(response);
            window.location.href = '/login.html';
        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Entre em contato com o administrador!',
            })
        });
    });
}

if (document.querySelector('#signin')){
    const signIn = document.querySelector('#signin');
    
    signIn.addEventListener('submit', (e)=>{
        e.preventDefault();
        let data = new FormData(signIn);
        let json = JSON.stringify(Object.fromEntries(data));
        console.log(data.getAll);
        axios({
            method: 'post',
            url: 'http://localhost:8080/login',
            headers: {'Content-Type': 'application/json'},
            data: json,
        })
        .then((response)=>{
            console.log(response);
            document.cookie = 'authorization='+ response.headers.authorization;
            window.location.href = '/';
        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usuário e/ou senha incorretos',
            })
        });
    });
}
    

const baseUrl = 'http://localhost:8080/api/';

function createCookie(value){
    let date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    date = date.toUTCString();
    document.cookie = 'authorization='+ value + '; expires=' + date + ';path=/';    
}

function getCookie(name) {
    var cookieName = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(cookieName) == 0) return c.substring(cookieName.length, c.length);
    }
    return null;
}
   
if (document.querySelector('#signup')){
    const signUp = document.querySelector('#signup');

    signUp.addEventListener('submit', (e)=>{
        e.preventDefault();
        let data = new FormData(signUp);
        let json = JSON.stringify(Object.fromEntries(data));
        // console.log(data.getAll);
        axios({
            method: 'post',
            url: baseUrl + 'clients/create',
            headers: {'Content-Type': 'application/json'},
            data: json,
        })
        .then((response)=>{
            // console.log(response);
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
        // console.log(data.getAll);
        axios({
            method: 'post',
            url: 'http://localhost:8080/login',
            headers: {'Content-Type': 'application/json'},
            data: json,
        })
        .then((response)=>{
            // console.log(response);
            createCookie(response.headers.authorization);
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

let auth = getCookie('authorization');
let dataPersonLink = document.getElementById('dataPersonLink');

if (dataPersonLink){
    dataPersonLink.addEventListener('click', ()=>{
        axios({
            method: 'get',
            url: baseUrl + 'clients',
            headers: (
                {'Content-Type': 'application/json'},
                {'Authorization': auth}
            ),
            
        })
        .then((response)=>{
            document.getElementById('fullName').value = response.data.fullName;
            document.getElementById('income').value = response.data.income;
            document.getElementById('email').value = response.data.email;
            document.getElementById('cpf').value = response.data.cpf;
            document.getElementById('rg').value = response.data.rg;
            document.getElementById('fullAddress').value = response.data.fullAddress;
        })
        .catch((err) => {
            window.location.href = '/';
            console.log(err);
    
        });
    }) 
}

   



    

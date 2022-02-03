const baseUrl = 'http://localhost:8080/api/';

function createCookie(name, value){
    let date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    date = date.toUTCString();
    document.cookie = name + '=' + value + '; expires=' + date + ';path=/';    
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

function number_format (number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function currencyFormat(element) {
    let value = element.value;

    value = value + '';
    value = parseInt(value.replace(/[\D]+/g, ''));
    value = value + '';
    value = value.replace(/([0-9]{2})$/g, ",$1");

    if (value.length > 6) {
        value = value.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    element.value = value;

    if (value.length >= 11){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Valor máximo permitido: R$ 999.999,00',
        })
        element.value = '';
    }
    if(value == 'NaN') element.value = '';
}

function cpfFormat(element){
    let value = element.value;

    value = value + '';
    value = value.replace(/[^\d]+/g,'');

    element.value = value;
}

  
if (document.querySelector('#signup')){
    const signUp = document.querySelector('#signup');
    let cpf = document.getElementById('cpf');


    cpf.addEventListener("blur", function(){
        if(cpf.value) cpf.value = cpf.value.match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/,"-");
     });


    signUp.addEventListener('submit', (e)=>{
        e.preventDefault();
        let data = new FormData(signUp);
        let obj = Object.fromEntries(data);
        obj.income = obj.income.replace('.', '');
        obj.income = obj.income.replace(',', '.');
        axios({
            method: 'post',
            url: baseUrl + 'clients/create',
            headers: {'Content-Type': 'application/json'},
            data: obj,
        })
        .then((response)=>{
            window.location.href = '/login.html';
        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response.data,
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
            createCookie('authorization', response.headers.authorization);
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
            document.getElementById('income').value = number_format(response.data.income, 2, ',', '.');
            document.getElementById('email').value = response.data.email;
            document.getElementById('cpf').value = response.data.cpf;
            document.getElementById('rg').value = response.data.rg;
            document.getElementById('fullAddress').value = response.data.fullAddress;
            createCookie('id', response.data.id);
        })
        .catch((err) => {
            window.location.href = '/';
            console.log(err);
    
        });
    }) 
}

if (document.getElementById('newLoanForm')){
    let newLoanModal = new bootstrap.Modal(document.getElementById('newLoan'));
    let newLoanForm = document.getElementById('newLoanForm');

    document.getElementById('newLoan').addEventListener('show.bs.modal', ()=>{
        document.getElementById('amount').value = '';
        document.getElementById('installments').value = '';
        document.getElementById('firstInstallment').value = '';
    })

    newLoanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let data = new FormData(newLoanForm);
        let obj = Object.fromEntries(data);
        obj.amount = obj.amount.replace('.','');
        obj.amount = obj.amount.replace(',','.');
        axios({
            method: 'post',
            url: baseUrl + 'loans/create',
            headers: (
                {'Content-Type': 'application/json'},
                {'Authorization': auth}
            ),
            data: obj,
        })
        .then(()=>{
            Swal.fire({
                icon: 'success',
                title: 'Solicitação realizada com sucesso!',
            })
            newLoanModal.hide();

        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response.data,
            })
        });
    });
}

if (document.getElementById('loanDetailsLink')){
    loanDetailsLink = document.getElementById('loanDetailsLink');
    loanDetailsLink.addEventListener('click', ()=>{
        axios({
            method: 'get',
            url: baseUrl + 'clients/',
            headers: (
                {'Content-Type': 'application/json'},
                {'Authorization': auth}
            ),
            
        })
        .then((response)=>{
            let loanDetailsContent = document.getElementById('loanDetailsContent');
            loanDetailsContent.innerHTML = '';
            response.data.loans.forEach(loan => {
                let content = `
                <tr>
                    <td>
                        ${new Date(loan.dateLoan).toLocaleString()}
                    </td>
                    <td>
                        R$ ${number_format(loan.amount, 2, ',', '.')}
                    </td>
                    <td>
                        ${loan.installments}
                    </td>
                    <td>
                        ${new Date(loan.firstInstallment).toLocaleDateString()}
                    </td>
                </tr>
                `;
                loanDetailsContent.insertAdjacentHTML('afterbegin', content);
            });
        })
        .catch((err) => {
            console.log(err);
            
        });
    })
}

   



    

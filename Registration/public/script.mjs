const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
/*const regUsername = document.querySelector('regUsername').value;
const regEmail = document.querySelector('regEmail').value;
const regPassword = document.querySelector('regPassword').value;*/
const regButton = document.getElementById('regButton');

registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});

loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});

regButton.addEventListener('click', (e) => {
    
    var data = {};
    data.username = `${regUsername}`;
    data.email = `${regEmail}`;
    data.password = `${regPassword}`;
                            e.preventDefault();
                        console.log('select_link clicked');
        $.ajax('http://localhost:4000/register', {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',					
            success: Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
              })
        });})
    
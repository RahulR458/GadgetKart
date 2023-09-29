var loginEmailError = document.getElementById("loginEmail_error");
var loginSubmitError = document.getElementById("loginSubmit_error");
var loginPasswordError = document.getElementById("loginPassword_error");
var validateNameError = document.getElementById("name_error");
var validateEmailError = document.getElementById("email_error");
var validateNumberError = document.getElementById("number_error")
var validatePasswordError = document.getElementById("password_error");
var validateConfirmPassError = document.getElementById("confirmP_error");
var validateSubmitError = document.getElementById('submit_error');

//login validation

function validateLoginEmail(){
    var email = document.getElementById("loginEmail").value;
    if(email.length === 0){
        loginEmailError.innerHTML = "Enter your valid email id";
        return false
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        loginEmailError.innerHTML = "Invalid email";
        return false;
    }
    loginEmailError.innerHTML = "";
    return true;
}

function validateLoginPassword(){
    let password = document.getElementById("loginPassword").value;
    if(password.length === 0){
        loginPasswordError.innerHTML="Please enter your Password";
        return false;
    }
    loginPasswordError.innerHTML="";
    return true;
}

function validateLoginSubmit(){
    if (!validateLoginEmail() ||!validateLoginPassword()) {
        loginSubmitError.innerHTML = "Enter your email and password";
        return false;
    }
    loginSubmitError.innerHTML =''
    return true;
}

//registration form validation 

function validateName(){
    let name = document.getElementById("validate_name").value
    if(name.length === 0){
        validateNameError.innerHTML= 'Please Enter Your Name';
        return false;
    }
    if(name.length < 3){
        validateNameError.innerHTML= 'Name must be more than 3 characters';
        return false;
    }
    validateNameError.innerHTML=''
    return true;
}

function validateEmail(){
    let email =document.getElementById('validate_email').value
    if (email.length == 0) {
        validateEmailError.innerHTML='Please Enter Email'
        return false;
    }
    if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        validateEmailError.innerHTML='Invalid Email'
        return false;
    }
    validateEmailError.innerHTML=""
    return true;
}

function validateNumber(){
    let number = document.getElementById('validate_number').value;
    if(number.length === 0){
        validateNumberError.innerHTML ='Please Enter Number';
        return false;
    }
    if(number.length < 10){
        validateNumberError.innerHTML ='Number Must Be 10 Digits'
        return false;
    }
    validateNumberError.innerHTML=''
    return true;

}

function validatePassword(){
    let password = document.getElementById('validate_password').value
    if(password.length === 0){
        validatePasswordError.innerHTML ='Please Enter a Passowrd'
        return false;
    }
    if(password.length < 8){
        validatePasswordError.innerHTML ='Password should be 8 characters'
        return false
    }
    validatePasswordError.innerHTML=''
    return true;
}

function validateConfirmPassword(){
    let confirmPass = document.getElementById('validate_confirm_p').value
    if(confirmPass.length === 0){
        validateConfirmPassError.innerHTML = 'Please Re-enter your password'
        return false;
    } 
    if(!(confirmPass===document.getElementById("validate_password").value)){
        validateConfirmPassError.innerHTML = 'Re-entered Password is Worng'
        return false;
    }
    validateConfirmPassError.innerHTML=''
    return true;

}

function validateSubmit(){
    if(!validateName() ||!validateEmail() ||!validateNumber() ||!validatePassword() ||!validateConfirmPassword()){
        validateSubmitError.innerHTML = "Enter your Details"
        return false
    }
    validateSubmitError.innerHTML = ''
    return true
}
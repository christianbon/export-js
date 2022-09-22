// const webflowUrl = 'https://alta-talent-dashboard.webflow.io/';
// const beUrl = 'https://assessment-alta.as.r.appspot.com';
const webflowUrl = 'https://talent.alta.id/';
const beUrl = 'https://assessment-alta-prod.as.r.appspot.com';

let form = document.getElementById('register-form');
form.addEventListener('submit', handlerCallback, true);
const url = beUrl + '/api/auth/local/register';
const urlGetUser = beUrl + '/api/users/'

let options = {  
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
    'Content-Type': 'application/json',
  },
};

function handlerCallback(event) {
  event.preventDefault();
  event.stopPropagation();
  if(document.querySelector('#Password-2').value !== document.querySelector('#Konfirmasi-Password').value) {
    alert('password does not match');
  }else{
    if(document.querySelector('#Nama').value !== '' &&
      document.querySelector('#Nama-Institusi').value !== '' &&
      document.querySelector('#No-Hp').value !== '' &&
      document.querySelector('#Email-4').value !== '' &&
      document.querySelector('#Password-2').value !== '' &&
      document.querySelector('#Konfirmasi-Password').value !== '' ){

      let formData = new FormData();
      
      const companyData = JSON.stringify({
        companyName: document.querySelector('#Nama-Institusi').value,
        phoneNumber: document.querySelector('#No-Hp').value,
      })
      
      formData.append("username", document.querySelector('#Nama').value);
      formData.append("clientProfile", companyData);
      formData.append("email", document.querySelector('#Email-4').value);
      formData.append("password", document.querySelector('#Password-2').value);
      fetch(url,{
        method : 'POST',
        body : formData         
      })
      .then(data => {return data.json()})
      .then(res => {
        if(res.error?.status === 400) throw res.error

          fetch(urlGetUser+ res.user.id + '?populate=*')
          .then(data => {return data.json()})
          .then(res => {
            if(res.client_profile === null) throw 'User is not a client'
            if (res) {
              sessionStorage.setItem("username", res.client_profile.fullName);
            }
          })
          sessionStorage.setItem("authToken", res.jwt);
          sessionStorage.setItem("userId", res.user.id);
        window.location.replace(webflowUrl);
      })
      .catch(err => {
        alert(err.message);
      });
    } else {
      alert('please fill all required field')
    }
  }
}
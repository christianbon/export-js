const webflowUrl = 'https://alta-talent-dashboard.webflow.io/';
const beUrl = 'https://assessment-alta.as.r.appspot.com';
// const webflowUrl = 'https://talent.alta.id/';
// const beUrl = 'https://assessment-alta-prod.as.r.appspot.com';

let form = document.getElementById('login-form');
const url = beUrl + '/api/auth/local/';
form.addEventListener('submit', handlerCallback, true);

function handlerCallback(event) {
  event.preventDefault();
  event.stopPropagation();
  if(document.querySelector('#Email-Institusi').value !== '' &&
    document.querySelector('#Password').value !== '' ){
      let formData = new FormData();
  
      formData.append("identifier", document.querySelector('#Email-Institusi').value);
      formData.append("password", document.querySelector('#Password').value);
  
      fetch(url,{
        method : 'POST',
        body : formData         
      })
      .then(data => {return data.json()})
      .then(res => {
      		if(res.error?.status === 400) throw res.error
          sessionStorage.setItem("authToken", res.jwt);
          sessionStorage.setItem("username", res.user.username);
          sessionStorage.setItem("userId", res.user.id);
          window.location.replace(webflowUrl);
      })
      .catch(err => {
      	alert(err.message);
      });
    }
}
  
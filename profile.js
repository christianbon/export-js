
(function logout() {
  const button = document.getElementById("confirm-logout");
  button.addEventListener("click", event => {
    sessionStorage.setItem("authToken", null);
    window.location.replace("https://alta-talent-dashboard.webflow.io/login");
  });
})();

function chechAuth() {
  const loginStatus = sessionStorage.getItem("userId");
  if(loginStatus === null) window.location.replace("https://alta-talent-dashboard.webflow.io/login");
}

function changeUsername() {
  const username = document.getElementById('profile-name');
  username.innerHTML = sessionStorage.getItem("username");
}


const url = 'https://assessment-alta.as.r.appspot.com/api/users/' + sessionStorage.getItem("userId") + '?populate=*';
const updateUrl = ''

function getSelfData() {
  let options = {  
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
      'Content-Type': 'application/json',
    },
  };
  fetch(url, options)
  .then(data => {return data.json()})
  .then(res => {
    document.getElementById("field-fullname").value = res.fullName ? res.fullName : '';
    document.getElementById("field-email").value = res.email ? res.email : '';
    document.getElementById("field-whatsapp").value = res.phoneNumber ? res.phoneNumber : '';
    document.getElementById("field-role").value = res.client_profile?.userPosition ? res.client_profile?.userPosition : '';
    document.getElementById("field-department").value = res.client_profile?.department ? res.client_profile?.department : '';
    
    document.getElementById("profile-fullname").innerHTML = res.fullName ? res.fullName : '-';
    document.getElementById("profile-email").innerHTML = res.email ? res.email : '-';
    document.getElementById("profile-whatsapp").innerHTML = res.phoneNumber ? res.phoneNumber : '-';
    document.getElementById("profile-role").innerHTML = res.client_profile?.userPosition ? res.client_profile?.userPosition : '-';
    document.getElementById("field-department").innerHTML = res.client_profile?.department ? res.client_profile?.department : '-';

    document.getElementById("profile-company-name").innerHTML = res.client_profile?.companyName ? res.client_profile?.companyName : '-';
    document.getElementById("profile-about").innerHTML = res.client_profile?.about ? res.client_profile?.about : '-';
    document.getElementById("profile-industry").innerHTML = res.client_profile?.industry ? res.client_profile?.industry : '-';
    document.getElementById("profile-address").innerHTML = res.client_profile?.address ? res.client_profile?.address : '-';
    document.getElementById("profile-website").innerHTML = res.client_profile?.companyWebsite ? res.client_profile?.companyWebsite : '-';
    document.getElementById("profile-instagram").innerHTML = res.client_profile?.instagram ? res.client_profile?.instagram : '-';
    document.getElementById("profile-company-size").innerHTML = res.client_profile?.size ? res.client_profile?.size : '-';
  })
}

(function updateData() {
  const button = document.getElementById("update-button");
  button.addEventListener("click", event => {
    fetch(updateUrl, {  
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data:{
            clientId: String(sessionStorage.getItem('userId')),
            clientIdentifier: sessionStorage.getItem("username"),
            talentId: String(talent.id),
            watchedPage: "Secondary",
            talentName: talent.talent_profile.name
        }})
    })
  });
})();

// This fires all of the defined functions when the document is "ready" or loaded
(function() {
    chechAuth()
    changeUsername()
    getSelfData()
})();

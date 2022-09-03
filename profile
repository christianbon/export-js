
function chechAuth() {
  const loginStatus = sessionStorage.getItem("userId");
  if(loginStatus === null) window.location.replace("https://alta-talent-dashboard.webflow.io/login");
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
    console.log(res);
    document.getElementById("field-fullname").value = res.fullName ? res.fullName : '';
    document.getElementById("field-email").value = res.email ? res.email : '';
    document.getElementById("field-whatsapp").value = res.phoneNumber ? res.phoneNumber : '';
    document.getElementById("field-role").value = res.client_profile?.userPosition ? res.client_profile?.userPosition : '';
    document.getElementById("field-department").value = res.client_profile?.department ? res.client_profile?.department : '';
    
    document.getElementById("profile-fullname").value = res.fullName ? res.fullName : '-';
    document.getElementById("profile-email").value = res.email ? res.email : '-';
    document.getElementById("profile-whatsapp").value = res.phoneNumber ? res.phoneNumber : '-';
    document.getElementById("profile-role").value = res.client_profile?.userPosition ? res.client_profile?.userPosition : '-';
    document.getElementById("field-department").value = res.client_profile?.department ? res.client_profile?.department : '-';

    document.getElementById("profile-company-name").value = res.client_profile?.companyName ? res.client_profile?.companyName : '-';
    document.getElementById("profile-about").value = res.client_profile?.about ? res.client_profile?.about : '-';
    document.getElementById("profile-industry").value = res.client_profile?.industry ? res.client_profile?.industry : '-';
    document.getElementById("profile-address").value = res.client_profile?.address ? res.client_profile?.address : '-';
    document.getElementById("profile-website").value = res.client_profile?.companyWebsite ? res.client_profile?.companyWebsite : '-';
    document.getElementById("profile-instagram").value = res.client_profile?.instagram ? res.client_profile?.instagram : '-';
    document.getElementById("profile-company-size").value = res.client_profile?.size ? res.client_profile?.size : '-';
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
    getSelfData()
})();

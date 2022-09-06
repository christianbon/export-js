
(function logout() {
    const button = document.getElementById("confirm-logout");
    button.addEventListener("click", event => {
      sessionStorage.setItem("authToken", null);
      window.location.replace("https://alta-talent-dashboard.webflow.io/login");
    });
  })();
  
  function changeUsername() {
    const username = document.getElementById('profile-name');
    username.innerHTML = sessionStorage.getItem("username");
  }
  
  function chechAuth() {
    const loginStatus = sessionStorage.getItem("userId");
    if(loginStatus === null) window.location.replace("https://alta-talent-dashboard.webflow.io/login");
  }
  
  
  let url = new URL('https://assessment-alta.as.r.appspot.com/api/users?filters[role][name][$eq]=Talent&populate[talent_profile][populate]=%2A');
  let trackingURL = new URL('https://assessment-alta.as.r.appspot.com/api/client-histories');
  
  function getTalent() {
    let options = {  
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        'Content-Type': 'application/json',
      },
    };
  
    const container = document.getElementById("card-container-frontend")
  
    function mappingData(talent, developerCategory){
      const style = document.getElementById('card-talent-ui')
      const card = style.cloneNode(true)
      card.setAttribute('id', '');
      card.style.display = 'block';
  
      // talentID
      const talentID = card.childNodes[0].childNodes[0].childNodes[1];
      talentID.innerHTML = 'ID - ' + talent.id;
  
      // talent category
      const talentCategory = card.getElementsByTagName('H4')[0];
      talentCategory.innerHTML = talent.talent_profile.talentCategory;
      
      // years of experience
      const yearsExperience = card.childNodes[1].childNodes[1];
      yearsExperience.innerHTML = talent.talent_profile.yearsOfExperience + ' Years Experience';
  
      // assessment score
  
  
      if(developerCategory === 'FE') cardContainerFE.appendChild(card);
      if(developerCategory === 'BE') cardContainerBE.appendChild(card);
    }
  
    fetch(url, options)
      .then(data => {return data.json()})
      .then(res => {
        if (res.length > 0) {
          const dataDevBE = res.filter((data)=>{
            return data.talent_profile.talentCategory === 'Back End'
          })
          const dataDevFE = res.filter((data)=>{
            return data.talent_profile.talentCategory === 'Front End'
          })
          dataDevFE.forEach(talent => {
            mappingData(talent,'FE')
          })
          dataDevBE.forEach(talent => {
            mappingData(talent,'BE')
          })
          cardContainerFE.childNodes[0].remove();
          cardContainerBE.childNodes[0].remove();
        }
      })
  }
  
  // This fires all of the defined functions when the document is "ready" or loaded
  (function() {
    chechAuth()
    changeUsername()
    getTalent();
  })();
  
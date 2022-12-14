const webflowUrl = 'https://alta-talent-dashboard.webflow.io/';
const beUrl = 'https://assessment-alta.as.r.appspot.com';
// const webflowUrl = 'https://talent.alta.id/';
// const beUrl = 'https://assessment-alta-prod.as.r.appspot.com';

(function logout() {
    const button = document.getElementById("confirm-logout");
    button.addEventListener("click", event => {
      sessionStorage.setItem("authToken", null);
      window.location.replace(webflowUrl + "login");
    });
  })();
  
  function changeUsername() {
    const username = document.getElementById('profile-name');
    username.innerHTML = sessionStorage.getItem("username");
  }
  
  function chechAuth() {
    const loginStatus = sessionStorage.getItem("userId");
    if(loginStatus === null) window.location.replace(webflowUrl + "login");
  }
  
  
  let url = beUrl + '/api/users/';
  let trackingURL = new URL(beUrl + '/api/client-histories');
  
  function getTalent() {
    let options = {  
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        'Content-Type': 'application/json',
      },
    };
  
    const container = document.getElementById("experience-container-scroll")
  
    function mappingData(talent){
      document.getElementById("talent-name").innerHTML = talent.talent_profile?.name ? talent.talent_profile.name : '-';
      document.getElementById("talent-email").innerHTML = talent.email ? talent.email : '-';
      document.getElementById("talent-phone").innerHTML = talent.talent_profile.phoneNumber ? talent.talent_profile.phoneNumber : '-';
      document.getElementById("talent-linkedin").innerHTML = talent.talent_profile?.linkedIn ? talent.talent_profile?.linkedIn : '-';
      document.getElementById("talent-github").innerHTML = talent.talent_profile?.github ? talent.talent_profile?.github : '-';

      if(talent.talent_profile.experiences.length > 0) {
        
        talent.talent_profile.experiences.map((data,index)=>{
          const styleExperience = document.getElementById('experience-list')
          const cardExperience = styleExperience.cloneNode(true)
          const experiencePosition = cardExperience.getElementsByTagName('H4')[0];
          experiencePosition.innerHTML = data?.position;

          const companyName =  cardExperience.childNodes[1];
          companyName.innerHTML = data?.companyName

          const yearsExperience =  cardExperience.childNodes[2];
          let endyear, endmonth, startyear, startmonth
          const startDate = new Date(data.dateStart)
          startyear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(startDate);
          startmonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(startDate);
          if(!data.present) {
            const endDate = new Date(data.dateStart)
            endyear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(endDate);
            endmonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(endDate);
          }
          yearsExperience.innerHTML = startmonth + ' ' + startyear + ' - ' + (data.present ? 'Present' : endmonth + ' ' + endyear)

          const jobDescription =  cardExperience.childNodes[4];
          jobDescription.innerHTML = '<pre style="font-family: poppins">' + data.jobDescription + '</pre>'
          container.insertBefore(cardExperience, container.children[2+index]);
        })
        
        container.childNodes[4+talent.talent_profile.experiences.length].remove();
        container.childNodes[3+talent.talent_profile.experiences.length].remove();
        container.childNodes[2+talent.talent_profile.experiences.length].remove();
      }

      const stringProgramming = talent.talent_profile.programming_languages.map((data) => {
        return data.name
      })
      const stringTools = talent.talent_profile.tools.map((data) => {
        return data.name
      })
      const stringDevMethod = talent.talent_profile.development_methods.map((data) => {
        return data.name
      })
      const stringAddSkill = talent.talent_profile.additional_skills.map((data) => {
        return data.name
      })
      const stringSoftSkill = talent.talent_profile.soft_skills.map((data) => {
        return data.name
      })
      const modalSkill = document.getElementById('modal-skill')
      modalSkill.innerHTML = 
      '<p><strong>Technical Skill</strong></p>' + 
      '<p>Programming: ' + stringProgramming.join(', ') + '</p>'+ 
      '<p>Tools: ' + stringTools.join(', ') + '</p>'+ 
      '<p>Development Method: ' + stringDevMethod.join(', ') + '</p>'+ 
      '<p>Additional Skill: ' + stringAddSkill.join(', ') + '</p>'+ 
      '<p><strong>Other Skill</strong></p>' + 
      '<p>Soft Skill: ' + stringSoftSkill.join(', ') + '</p>';

      document.getElementById('modal-achievement').innerHTML = talent.talent_profile.achievement ? talent.talent_profile.achievement : '-';
      document.getElementById('modal-education').innerHTML = talent.talent_profile.education ? '<pre style="font-family: poppins">' + talent.talent_profile.education + '</pre>' : '-';
      document.getElementById('modal-certification').innerHTML = talent.talent_profile.certification ? talent.talent_profile.certification : '-';
    }
  
    fetch(url+ sessionStorage.getItem('selectedTalent') +'?populate[talent_profile][populate]=%2A', options)
      .then(data => {return data.json()})
      .then(res => {
        if (res) {
          mappingData(res)
          // container.childNodes[0].remove();
        }
      })
  }
  
  // This fires all of the defined functions when the document is "ready" or loaded
  (function() {
    chechAuth()
    changeUsername()
    getTalent();
  })();
  
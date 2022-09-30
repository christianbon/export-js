// const webflowUrl = 'https://alta-talent-dashboard.webflow.io/';
// const beUrl = 'https://assessment-alta.as.r.appspot.com';
const webflowUrl = 'https://talent.alta.id/';
const beUrl = 'https://assessment-alta-prod.as.r.appspot.com';

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
      document.getElementById("talent-city").innerHTML = talent.talent_profile.currentCity ? talent.talent_profile.currentCity : '-';
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
          if(data.dateStart) {
            const startDate = new Date(data.dateStart)
            startyear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(startDate);
            startmonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(startDate);
          }else{
            startyear = 'not specified'
          }
          if(!data.present) {
            if(data.dateEnd) {
              const endDate = new Date(data.dateEnd)
              endyear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(endDate);
              endmonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(endDate);
            }else{
              endyear = 'not specified'
            }
          }
          yearsExperience.innerHTML = startmonth + ' ' + startyear + ' - ' + (data.present ? 'Present' : endmonth + ' ' + endyear)

          const jobDescription =  cardExperience.childNodes[4];
          jobDescription.innerHTML = data.jobDescription ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + data.jobDescription + '</code>' : '-'
          container.insertBefore(cardExperience, container.children[3+index]);
        })
        container.childNodes[2].remove();
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
      '<p style="font-size: 14px; font-family: poppins"><strong>Technical Skill</strong></p>' + 
      '<p style="font-size: 14px; font-family: poppins">Programming: ' + stringProgramming ? stringProgramming.join(', ') : '-' + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins">Tools: ' + stringTools ? stringTools.join(', ') : '-' + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins">Development Method: ' + stringDevMethod ? stringDevMethod.join(', ') : '-' + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins">Additional Skill: ' + stringAddSkill ? stringAddSkill.join(', ') : '-' + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins"><strong>Other Skill</strong></p>' + 
      '<p style="font-size: 14px; font-family: poppins">Soft Skill: ' + stringSoftSkill ? stringSoftSkill.join(', ') : '-' + '</p>';

      document.getElementById('modal-achievement').innerHTML = talent.talent_profile.achievement ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.achievement + '</code>'  : '-';
      document.getElementById('modal-education').innerHTML = talent.talent_profile.education ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.education + '</code>' : '-';
      document.getElementById('modal-course').innerHTML = talent.talent_profile.course ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.course + '</code>' : '-';
      document.getElementById('modal-certification').innerHTML = talent.talent_profile.certification ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.certification + '</code>' : '-';
      document.getElementById('modal-portfolio').innerHTML = talent.talent_profile.portofolio ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.portofolio + '</code>' : '-';
      document.getElementById('modal-project').innerHTML = talent.talent_profile.project ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.project + '</code>' : '-';
      const arrLanguage = talent.talent_profile.languages.map((data) => {
        return data.name
      })
      document.getElementById('modal-language').innerHTML = talent.talent_profile.arrLanguage.length > 0 ? arrLanguage.join(', ') : '-';
    }
  
    fetch(url+ sessionStorage.getItem('selectedTalent') +'?populate[talent_profile][populate]=%2A', options)
      .then(data => {return data.json()})
      .then(res => {
        if (res) {
          mappingData(res)
        }
      })
  }
  
  // This fires all of the defined functions when the document is "ready" or loaded
  (function() {
    chechAuth()
    changeUsername()
    getTalent();
  })();
  
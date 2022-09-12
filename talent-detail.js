
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
  
  
  let url = 'https://assessment-alta.as.r.appspot.com/api/users/';
  let trackingURL = new URL('https://assessment-alta.as.r.appspot.com/api/client-histories');
  
  function getTalent() {
    let options = {  
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        'Content-Type': 'application/json',
      },
    };
  
    const container = document.getElementById("cexperience-contailer-scroll")
  
    function mappingData(talent){
      console.log({talent})
      document.getElementById("talent-name").innerHTML = talent.fullName ? talent.fullName : '-';
      document.getElementById("talent-email").innerHTML = talent.email ? talent.email : '-';
      document.getElementById("talent-phone").innerHTML = talent.phoneNumber ? talent.phoneNumber : '-';
      document.getElementById("talent-linkedin").innerHTML = talent.talent_profile?.linkedIn ? talent.talent_profile?.linkedIn : '-';
      document.getElementById("talent-github").innerHTML = talent.talent_profile?.github ? talent.talent_profile?.github : '-';

      if(talent.talent_profile.experiences.length > 0) {
        const styleExperience = document.getElementById('experience-list')
        const cardExperience = styleExperience.cloneNode(true)
        console.log({styleExperience})
        
        talent.talent_profile.experiences.map((data)=>{
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
          console.log({cardExperience})
          container.appendChild(cardExperience);
        })
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

      const modalAchievement = document.getElementById('modal-achievement')
      modalAchievement.innerHTML = talent.talent_profile.achievement;

      const modalEducation = document.getElementById('modal-education')
      modalEducation.innerHTML = '<pre style="font-family: poppins">' + talent.talent_profile.education + '</pre>';

      const modalCertification = document.getElementById('modal-certification')
      modalCertification.innerHTML = talent.talent_profile.certification;


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
  
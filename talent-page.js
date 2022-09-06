
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

  const cardContainerFE = document.getElementById("card-container-frontend")
  const cardContainerBE = document.getElementById("card-container-backend")

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
    const assessmentScore = card.childNodes[2].childNodes[1];
    assessmentScore.innerHTML = talent.talent_profile.assessmentScore;

    // programming language
      const programming1 = card.childNodes[4].childNodes[0];
      const programming2 = card.childNodes[4].childNodes[1];
      const programming3 = card.childNodes[4].childNodes[2];

    if(talent.talent_profile.programming_languages.length > 0) {
      programming1.innerHTML = talent.talent_profile.programming_languages[0].name;
    } else {
      programming1.remove();
    }
    
    if(talent.talent_profile.programming_languages.length > 1) {
      programming2.innerHTML = talent.talent_profile.programming_languages[1].name;
    } else {
      programming2.remove();
    }
    
    if(talent.talent_profile.programming_languages.length > 2) {
      programming3.innerHTML = '...';
    } else {
      programming3.remove();
    }

    
    // tools
    const tools1 = card.childNodes[6].childNodes[0];
    const tools2 = card.childNodes[6].childNodes[1];
    const tools3 = card.childNodes[6].childNodes[2];

    if(talent.talent_profile.tools.length > 0) {
      tools1.innerHTML = talent.talent_profile.tools[0].name;
    } else {
      tools1.remove();
    }
    
    if(talent.talent_profile.tools.length > 1) {
      tools2.innerHTML = talent.talent_profile.tools[1].name;
    } else {
      tools2.remove();
    }
    
    if(talent.talent_profile.tools.length > 2) {
      tools3.innerHTML = '...';
    } else {
      tools3.remove();
    }

    ////////////////////////////////////////////////////////////////////////
    // when clicked
    card.addEventListener('click', function() {
      // about talent tab
      const modalTalentId = document.getElementById('modal-talent-id')
      modalTalentId.innerHTML = 'ID - ' + talent.id;
      
      const modalTalentCategory = document.getElementById('modal-talent-category')
      modalTalentCategory.innerHTML = talent.talent_profile.talentCategory + ' Developer';
      
      const modalTalentLocation = document.getElementById('modal-talent-location')
      modalTalentLocation.innerHTML = talent.talent_profile.currentCity + ', ' + talent.talent_profile.currentProvince;
      
      const modalAssessmentScore = document.getElementById('modal-assessment-score')
      modalAssessmentScore.innerHTML = talent.talent_profile.assessmentScore;
      
      const modalStatus = document.getElementById('modal-status')
      modalStatus.innerHTML = talent.talent_profile.status;
      
      const modalYearsExperience = document.getElementById('modal-years-experience')
      modalYearsExperience.innerHTML = talent.talent_profile.yearsOfExperience + ' Years';
      
      const modalGender = document.getElementById('modal-gender')
      modalGender.innerHTML = talent.talent_profile.gender;
      
      const modalTalentAge = document.getElementById('modal-age')
      modalTalentAge.innerHTML = talent.talent_profile.age;

      const modalProfileSummary = document.getElementById('modal-profile-summary')
      modalProfileSummary.innerHTML = talent.talent_profile.profileSummary;

      const modalAchievement = document.getElementById('modal-achievement')
      modalAchievement.innerHTML = talent.talent_profile.achievement;

      const modalEducation = document.getElementById('modal-education')
      modalEducation.innerHTML = '<pre style="font-family: poppins">' + talent.talent_profile.education + '</pre>';

      const modalCertification = document.getElementById('modal-certification')
      modalCertification.innerHTML = talent.talent_profile.certification;

      const modalPortfolio = document.getElementById('modal-portfolio')
      modalPortfolio.innerHTML = '<pre style="font-family: poppins">' + talent.talent_profile.portofolio + '</pre>';

      const modalProject = document.getElementById('modal-project')
      modalProject.innerHTML = '<pre style="font-family: poppins">' + talent.talent_profile?.project + '</pre>';

      const modalExpectedSalary = document.getElementById('modal-expected-salary')
      modalExpectedSalary.innerHTML = 'Rp. ' + Number(talent.talent_profile.expectedSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

      const modalPreferedLocation = document.getElementById('modal-work-location')
      modalPreferedLocation.innerHTML = talent.talent_profile.preferredWorkLocation;

      const modalSpecialization = document.getElementById('modal-specialization')
      modalSpecialization.innerHTML = talent.talent_profile.preferredSpecialization;

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

      // experience tab
      const modalExperienceTab = document.getElementById('modal-experience-long')
      const styleExperience = document.getElementById('modal-experience-list')
      const cardExperience = styleExperience.cloneNode(true)

      // talent.talent_profile.experiences.map((data)=>{
      //   const detailExperience = 
      //   '<div>' + 
      //   '<h4 class="heading-8">' +
      //   data.position +
      //   '</h4>' + 
      //   '<div class="text-block-35">' +
      //   data.companyName +
      //   '</div>' + 
      //   '<div class="text-block-34">' +
      //   data.dateStart + ' - ' + (data.present ? 'Present' : data.dateEnd) +
      //   '</div>' + 
      //   '<h5 class="heading-9">Job Description</h5>' + 
      //   '<pre style="font-family: poppins">' + data.jobDescription + '</pre>' +
      //   '</div>'
      //   console.log(detailExperience)
      //   modalExperienceTab.appendChild(detailExperience);
      // })
      
      // post tracking
      fetch(trackingURL, {  
        method: 'POST',
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

      // open modal and background
      $('#talent-modal').fadeIn();
      $('#talent-modal-background').fadeIn();
    });

    // when #bookmark clicked
    const bookmark = card.childNodes[0].childNodes[1];
    bookmark.addEventListener('click',function(){
      console.log('bookmarked')
      // fetch(bookmarkURL, {  
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     data:{
      //         clientId: String(sessionStorage.getItem('userId')),
      //         clientIdentifier: sessionStorage.getItem("username"),
      //         talentId: String(talent.id),
      //         watchedPage: "Secondary",
      //         talentName: talent.talent_profile.name
      //     }})
      // })
    })

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

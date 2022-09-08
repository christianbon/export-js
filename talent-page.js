
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

function isBookmarked(id) {
  const bookmarkData = JSON.parse(sessionStorage.getItem('bookmarked'))
  console.log({bookmarkData})
  return bookmarkData.filter((data)=> {
    return data.talentId === id
  }).length === 0
}

let url = new URL('https://assessment-alta.as.r.appspot.com/api/users?filters[role][name][$eq]=Talent&populate[talent_profile][populate]=%2A');
let trackingURL = new URL('https://assessment-alta.as.r.appspot.com/api/client-histories');
let bookmarkURL = new URL('https://assessment-alta.as.r.appspot.com/api/bookmarks');
let getBookmarkURL = new URL('https://assessment-alta.as.r.appspot.com/api/bookmarks?filters[clientId][$eq]=');


function getTalent() {
  let options = {  
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
      'Content-Type': 'application/json',
    },
  };
  let bookmarkOptions = {  
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
      'Content-Type': 'application/json',
    },
  };

  // get bookmarks data
  fetch(getBookmarkURL+String(sessionStorage.getItem('userId')), bookmarkOptions)
    .then(data => {return data.json()})
    .then(res => {
      const bookmarkList = res.data.map((data)=>{
        return {id: data.id, talentId: data.attributes.talentId }
      })
      console.log({bookmarkList})
      console.log(JSON.stringify(bookmarkList))
      sessionStorage.setItem('bookmarked', JSON.stringify(bookmarkList))
    })

  const cardContainerFE = document.getElementById("card-container-frontend")
  const cardContainerBE = document.getElementById("card-container-backend")


  function mappingData(talent, developerCategory){
    const style = document.getElementById('card-talent-ui')
    const card = style.cloneNode(true)
    card.setAttribute('id', '');
    card.style.display = 'block';
    console.log({card})

    // talentID
    const talentID = card.childNodes[0].childNodes[0].childNodes[1];
    talentID.innerHTML = 'ID - ' + talent.id;

    // bookmark color
    if(isBookmarked(talent.id)) 
      console.log(card.childNodes[0].childNodes[0])
      console.log(talent.id)
      // card.childNodes[0].childNodes[0].childNodes[card.childNodes[0].childNodes[0].length-1].style.fontFamily = "'Fa solid 900'";
    }

    // alta graduates
    const altaGraduate = card.childNodes[0].childNodes[0].childNodes[2];
    altaGraduate.style.display = talent.talent_profile.altaGraduate ? 'block' : 'none'

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

      if(isBookmarked(talent.id)) modalBookmark.style.fontFamily = "'Fa solid 900'"; 
      
      const modalTalentLocation = document.getElementById('modal-talent-location')
      modalTalentLocation.innerHTML = talent.talent_profile.currentCity + ', ' + talent.talent_profile.currentProvince;
      
      const modalAssessmentScore = document.getElementById('modal-assessment-score')
      modalAssessmentScore.innerHTML = talent.talent_profile.assessmentScore ? talent.talent_profile.assessmentScore : '-';

      const modalLevel = document.getElementById('modal-level')
      modalLevel.innerHTML = talent.talent_profile.assessmentLevel ? talent.talent_profile.assessmentLevel : '-';

      const modalHackerrank = document.getElementById('modal-hackerrank')
      modalHackerrank.innerHTML = talent.talent_profile.hackerrankScore ? talent.talent_profile.hackerrankScore : '-';
      
      const modalStatus = document.getElementById('modal-status')
      modalStatus.innerHTML = talent.talent_profile.status ? talent.talent_profile.status : '-';
      
      const modalYearsExperience = document.getElementById('modal-years-experience')
      modalYearsExperience.innerHTML = talent.talent_profile.yearsOfExperience + ' Years';
      
      const modalGender = document.getElementById('modal-gender')
      modalGender.innerHTML = talent.talent_profile.gender ? talent.talent_profile.gender : '-';
      
      const modalTalentAge = document.getElementById('modal-age')
      modalTalentAge.innerHTML = talent.talent_profile.age ? talent.talent_profile.age : '-';

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

      // when #bookmark clicked
      const modalBookmark = document.getElementById('modal-bookmark')
      modalBookmark.addEventListener('click',function(){
        console.log('bookmarked')

        if(isBookmarked(talent.id)) {
          // set bookmark
          modalBookmark.style.fontFamily = "'Fa solid 900'";
          card.childNodes[0].childNodes[0].childNodes[3].style.fontFamily = "'Fa solid 900'";
          fetch(bookmarkURL, {  
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data:{
                  clientId: String(sessionStorage.getItem('userId')),
                  talentId: talent.id,
              }})
          })
          .then((resBookmark)=> {
            console.log({resBookmark})
          })
        } else {
          // remove bookmark
          modalBookmark.style.fontFamily = "'Fa 400'";
          card.childNodes[0].childNodes[0].childNodes[1].style.fontFamily = "'Fa 400'";
          const filteredBookmark = sessionStorage.getItem('bookmarked').filter((data)=>{
            return data.talentId !== talent.id
          })
          const getDeletedBookmark = sessionStorage.getItem('bookmarked').filter((data)=>{
            return data.talentId === talent.id
          })
          sessionStorage.setItem('bookmarked', JSON.stringify(filteredBookmark))
          fetch(bookmarkURL+'/'+ getDeletedBookmark[0].id, {  
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          })
        }
      })

      // experience tab
      const modalExperienceTab = document.getElementById('modal-experience-long')
      if(talent.talent_profile.experiences.length > 0) {
        modalExperienceTab.style.display = 'block'
        const styleExperience = document.getElementById('modal-experience-list')
        const cardExperience = styleExperience.cloneNode(true)
        while (modalExperienceTab.hasChildNodes()) {
          modalExperienceTab.removeChild(modalExperienceTab.firstChild);
        }
        talent.talent_profile.experiences.map((data)=>{

          const experiencePosition = cardExperience.getElementsByTagName('H4')[0];
          experiencePosition.innerHTML = data?.position

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
    
          modalExperienceTab.appendChild(cardExperience);
        })
      } else {
        modalExperienceTab.style.display = 'none'
      }
      
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

    // when #bookmark changes notdone
    const bookmark = card.childNodes[0].childNodes[0].childNodes[1];
    

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

// This fires all of the defined functions when the document is "ready" or loaded
(function() {
  chechAuth()
  changeUsername()
  getTalent();
})();

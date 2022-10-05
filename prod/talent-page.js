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
  let options = {  
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
      'Content-Type': 'application/json',
    },
  };
  const urlGetUser = beUrl + '/api/users/'
  fetch(urlGetUser+ sessionStorage.getItem('userId') + '?populate=*', options)
  .then(data => {return data.json()})
  .then(res => {
    if(res.client_profile === null) throw 'User is not a client'
    if (res) {
      sessionStorage.setItem("username", res.client_profile.fullName);
      username.innerHTML =  res.client_profile.fullName ?  res.client_profile.fullName : '-'
    }
  })
  const username = document.getElementById('profile-name');
}

function chechAuth() {
  const loginStatus = sessionStorage.getItem("userId");
  if(loginStatus === null) window.location.replace(webflowUrl + "login");
}

function isBookmarked(id) {
  const bookmarkData = JSON.parse(sessionStorage.getItem('bookmarked'))
  const filteredBookmark = bookmarkData.filter((data)=> {
    return String(data.talentId) === String(id)
  })
  return filteredBookmark.length !== 0
}

function makeCardListText(data) {
  return data.length > 3 ? data[0].name + ', ' + data[1].name + ', ' + data[2].name + ', ..' : data.map((data)=>{return data.name}).join(', ')
}

let url = new URL(beUrl + '/api/users?filters[role][name][$eq]=Talent&populate[talent_profile][populate]=%2A&sort[0]=talent_profile[assessmentLevel]%3Adesc&sort[1]=talent_profile[assessmentScore]%3Adesc&sort[2]=talent_profile[hackerrankScore]%3Adesc&sort[3]=talent_profile[yearsOfExperience]%3Adesc');
let trackingURL = new URL(beUrl + '/api/client-histories');
let bookmarkURL = new URL(beUrl + '/api/bookmarks');
let getBookmarkURL = new URL(beUrl + '/api/bookmarks?filters[clientId][$eq]=');


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
      sessionStorage.setItem('bookmarked', JSON.stringify(bookmarkList))
    })

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

    // bookmark color
    if(isBookmarked(talent.id)) {
      card.childNodes[0].childNodes[1].childNodes[0].style.fontFamily = "'Fa solid 900'";
    }

    // alta graduates
    const altaGraduate = card.childNodes[0].childNodes[0].childNodes[2];
    if(talent.talent_profile.altaGraduate === 'none' || !talent.talent_profile.altaGraduate || talent.talent_profile.altaGraduate === null) {
      altaGraduate.style.display = 'none'
    } else {
      altaGraduate.style.display = 'flex'
    }
    if(talent.talent_profile.altaGraduate === 'graduate') altaGraduate.innerHTML = 'Alta Graduate'
    if(talent.talent_profile.altaGraduate === 'on training') altaGraduate.innerHTML = 'Alta On Training'
     

    // talent category
    const talentCategory = card.childNodes[1].getElementsByTagName('H4')[0];
    talentCategory.innerHTML = talent.talent_profile.talentCategory;
    
    // years of experience
    const yearsExperience = card.childNodes[1].childNodes[0].childNodes[1];
    yearsExperience.innerHTML = talent.talent_profile.yearsOfExperience ? talent.talent_profile.yearsOfExperience  + ' Years Experience' : '- Years Experience';

    // assessment score
    const level = card.childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0];
    level.innerHTML = talent.talent_profile.assessmentLevel ? (talent.talent_profile.assessmentLevel === 0 ? '-' : talent.talent_profile.assessmentLevel) : '-';
    const score = card.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[0];
    score.innerHTML = talent.talent_profile.assessmentScore ? (talent.talent_profile.assessmentScore === 0 ? '-' : talent.talent_profile.assessmentScore) : '-';
    const hackerrank = card.childNodes[1].childNodes[1].childNodes[2].childNodes[1].childNodes[0];
    hackerrank.innerHTML = talent.talent_profile.hackerrankScore ? (talent.talent_profile.hackerrankScore === 0 ? '-' : talent.talent_profile.hackerrankScore) : '-';

    // programming language
    const programming = card.childNodes[1].childNodes[2].childNodes[1];
    if(talent.talent_profile.programming_languages.length > 0) {
      programming.innerHTML = makeCardListText(talent.talent_profile.programming_languages);
    } else {
      programming.innerHTML = 'none';
    }

    // tools
    const tools = card.childNodes[1].childNodes[3].childNodes[1];
    if(talent.talent_profile.tools.length > 0) {
      tools.innerHTML = makeCardListText(talent.talent_profile.tools);
    } else {
      tools.innerHTML = 'none';
    }

    // when clicked
    card.childNodes[1].addEventListener('click', function() {
      // set selected talent ID
      sessionStorage.setItem('selectedTalent', talent.id)

      // about talent tab
      const modalTalentId = document.getElementById('modal-talent-id')
      modalTalentId.innerHTML = 'ID - ' + talent.id;
      
      const modalTalentCategory = document.getElementById('modal-talent-category')
      modalTalentCategory.innerHTML = talent.talent_profile.talentCategory + ' Developer';

      const modalAltaGraduates = document.getElementById('modal-alta-graduate')
      if(talent.talent_profile.altaGraduate === 'none' || !talent.talent_profile.altaGraduate || talent.talent_profile.altaGraduate === null) {
        modalAltaGraduates.style.display = 'none'
      } else {
        modalAltaGraduates.style.display = 'flex'
      }
      if(talent.talent_profile.altaGraduate === 'graduate') modalAltaGraduates.innerHTML = 'Alta Graduate'
      if(talent.talent_profile.altaGraduate === 'on training') modalAltaGraduates.innerHTML = 'Alta On Training'

      const modalBookmark = document.getElementById('modal-bookmark')
      if(isBookmarked(talent.id)) {
        modalBookmark.style.fontFamily = "'Fa solid 900'"; 
      } else {
        modalBookmark.style.fontFamily = "'Fa 400'"; 
      }
      
      const modalTalentLocation = document.getElementById('modal-talent-location')
      modalTalentLocation.innerHTML =  talent.talent_profile.currentCity ? talent.talent_profile.currentCity : '-' + ', ' + talent.talent_profile.currentProvince ? talent.talent_profile.currentProvince : '-';
      
      const modalAssessmentScore = document.getElementById('modal-assessment-score')
      modalAssessmentScore.innerHTML = talent.talent_profile.assessmentScore ? talent.talent_profile.assessmentScore : '-';

      const modalLevel = document.getElementById('modal-level')
      modalLevel.innerHTML = talent.talent_profile.assessmentLevel ? talent.talent_profile.assessmentLevel : '-';

      const modalHackerrank = document.getElementById('modal-hackerrank')
      modalHackerrank.innerHTML = talent.talent_profile.hackerrankScore ? talent.talent_profile.hackerrankScore : '-';
      
      const modalStatus = document.getElementById('modal-status')
      modalStatus.innerHTML = talent.talent_profile.status ? talent.talent_profile.status : '-';
      
      const modalYearsExperience = document.getElementById('modal-years-experience')
      modalYearsExperience.innerHTML = talent.talent_profile.yearsOfExperience ? talent.talent_profile.yearsOfExperience + ' Years' : '-';
      
      const modalGender = document.getElementById('modal-gender')
      modalGender.innerHTML = talent.talent_profile.gender ? talent.talent_profile.gender : '-';
      
      const modalTalentAge = document.getElementById('modal-age')
      modalTalentAge.innerHTML = talent.talent_profile.age ? talent.talent_profile.age : '-';

      const modalProfileSummary = document.getElementById('modal-profile-summary')
      modalProfileSummary.innerHTML = talent.talent_profile.profileSummary ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.profileSummary + '</code>'  : '-';

      const modalAchievement = document.getElementById('modal-achievement')
      modalAchievement.innerHTML = talent.talent_profile.achievement ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.achievement + '</code>'  : '-';

      const modalEducation = document.getElementById('modal-education')
      modalEducation.innerHTML = talent.talent_profile.education ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.education + '</code>' : '-';

      const modalCertification = document.getElementById('modal-certification')
      modalCertification.innerHTML = talent.talent_profile.certification ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.certification + '</code>' : '-';

      const modalPortfolio = document.getElementById('modal-portfolio')
      modalPortfolio.innerHTML = talent.talent_profile.portofolio ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile.portofolio + '</code>' : '-';

      const modalProject = document.getElementById('modal-project')
      modalProject.innerHTML = talent.talent_profile?.project ? '<code style="font-size: 14px; font-family: poppins; white-space:pre-wrap">' + talent.talent_profile?.project + '</code>' : '-';

      const modalExpectedSalary = document.getElementById('modal-expected-salary')
      modalExpectedSalary.innerHTML = talent.talent_profile.expectedSalary ? 'Rp. ' + Number(talent.talent_profile.expectedSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 'Rp. -';

      const modalPreferedLocation = document.getElementById('modal-work-location')
      modalPreferedLocation.innerHTML = talent.talent_profile.preferredWorkLocation ? talent.talent_profile.preferredWorkLocation : '-';

      const modalSpecialization = document.getElementById('modal-specialization')
      modalSpecialization.innerHTML = talent.talent_profile.preferredSpecialization ? talent.talent_profile.preferredSpecialization : '-';

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
      '<p style="font-size: 14px; font-family: poppins">Programming: ' + (stringProgramming ? stringProgramming.join(', ') : '-') + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins">Tools: ' + (stringTools ? stringTools.join(', ') : '-') + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins">Development Method: ' + (stringDevMethod ? stringDevMethod.join(', ') : '-') + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins">Additional Skill: ' + (stringAddSkill ? stringAddSkill.join(', ') : '-') + '</p>'+ 
      '<p style="font-size: 14px; font-family: poppins"><strong>Other Skill</strong></p>' + 
      '<p style="font-size: 14px; font-family: poppins">Soft Skill: ' + (stringSoftSkill ? stringSoftSkill.join(', ') : '-') + '</p>';

      // when #bookmark clicked
      modalBookmark.addEventListener('click',function handler(){
        if(!isBookmarked(talent.id)) {
          // set bookmark
          modalBookmark.style.fontFamily = "'Fa solid 900'";
          card.childNodes[0].childNodes[1].childNodes[0].style.fontFamily = "'Fa solid 900'";
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
                  talentId: String(talent.id),
              }})
          })
          .then(data => {return data.json()})
          .then((res)=> {
            const newBookmark = [...JSON.parse(sessionStorage.getItem('bookmarked')), {id: res.data.id, talentId: res.data.attributes.talentId }]
            sessionStorage.setItem('bookmarked', JSON.stringify(newBookmark))
          })
        } else {
          // remove bookmark
          modalBookmark.style.fontFamily = "'Fa 400'";
          card.childNodes[0].childNodes[1].childNodes[0].style.fontFamily = "'Fa 400'";
          const filteredBookmark = JSON.parse(sessionStorage.getItem('bookmarked')).filter((data)=>{
            return String(data.talentId) !== String(talent.id)
          })
          const getDeletedBookmark = JSON.parse(sessionStorage.getItem('bookmarked')).filter((data)=>{
            return String(data.talentId) === String(talent.id)
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
        this.removeEventListener('click', handler);
        $('#talent-modal-background').css("display", "none");
      })

      // experience tab
      const modalExperienceTab = document.getElementById('modal-experience-long')
      if(talent.talent_profile.experiences.length > 0) {
        modalExperienceTab.style.display = 'block'
        const styleExperience = document.getElementById('modal-experience-list')
        while (modalExperienceTab.hasChildNodes()) {
          modalExperienceTab.removeChild(modalExperienceTab.firstChild);
        }
        talent.talent_profile.experiences.map((data)=>{
          const cardExperience = styleExperience.cloneNode(true)
          const experiencePosition = cardExperience.getElementsByTagName('H4')[0];
          experiencePosition.innerHTML = data?.position

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

    // Bookmark card clicked
    card.childNodes[0].childNodes[1].childNodes[0].addEventListener('click', function() {
      if(!isBookmarked(talent.id)) {
        // set bookmark
        modalBookmark.style.fontFamily = "'Fa solid 900'";
        card.childNodes[0].childNodes[1].childNodes[0].style.fontFamily = "'Fa solid 900'";
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
                talentId: String(talent.id),
            }})
        })
        .then(data => {return data.json()})
        .then((res)=> {
          const newBookmark = [...JSON.parse(sessionStorage.getItem('bookmarked')), {id: res.data.id, talentId: res.data.attributes.talentId }]
          sessionStorage.setItem('bookmarked', JSON.stringify(newBookmark))
        })
      } else {
        // remove bookmark
        modalBookmark.style.fontFamily = "'Fa 400'";
        card.childNodes[0].childNodes[1].childNodes[0].style.fontFamily = "'Fa 400'";
        const filteredBookmark = JSON.parse(sessionStorage.getItem('bookmarked')).filter((data)=>{
          return String(data.talentId) !== String(talent.id)
        })
        const getDeletedBookmark = JSON.parse(sessionStorage.getItem('bookmarked')).filter((data)=>{
          return String(data.talentId) === String(talent.id)
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

    if(developerCategory === 'FE') cardContainerFE.appendChild(card);
    if(developerCategory === 'BE') cardContainerBE.appendChild(card);
  }

  function addEmptyCard(developerCategory){
    const style = document.getElementById('card-talent-ui')
    const card = style.cloneNode(true)
    card.setAttribute('id', '');
    card.style.display = 'block';
    card.style.opacity = 0;
    if(developerCategory === 'FE') cardContainerFE.appendChild(card);
    if(developerCategory === 'BE') cardContainerBE.appendChild(card);
  }

  fetch(url, options)
    .then(data => {return data.json()})
    .then(res => {
      if (res.length > 0) {

        // modal close
        document.getElementById('modal-close').addEventListener('click', function(){
          document.getElementById('modal-bookmark').removeEventListener('click', function(){})
        })

        const dataDevBE = res.filter((data)=>{
          return data.talent_profile.talentCategory === 'Back End'
        })
        const dataDevFE = res.filter((data)=>{
          return data.talent_profile.talentCategory === 'Front End'
        })
        if(dataDevBE.length > 0) {
          document.getElementById('no-data-be').style.display = 'none';
        } else {
          document.getElementById('no-data-be').style.display = 'block';
        }
        if(dataDevFE.length > 0) {
          document.getElementById('no-data-fe').style.display = 'none';
        } else {
          document.getElementById('no-data-fe').style.display = 'block';
        }

        dataDevFE.forEach(talent => {
          mappingData(talent,'FE')
        })
        const lastRowFe = dataDevFE.length % 3
        for(let i = 0; i < (3-lastRowFe);i++){
          addEmptyCard('FE');
        }
        dataDevBE.forEach(talent => {
          mappingData(talent,'BE')
        })
        const lastRowBe = dataDevBE.length % 3
        for(let i = 0; i < (3-lastRowBe);i++){
          addEmptyCard('BE');
        }
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

// const webflowUrl = 'https://alta-talent-dashboard.webflow.io/';
// const beUrl = 'https://assessment-alta.as.r.appspot.com';
const webflowUrl = 'https://talent.alta.id/';
const beUrl = 'https://assessment-alta-prod.as.r.appspot.com';

var Email = {
  send: function (a) {
      return new Promise(function (n, e) {
          (a.nocache = Math.floor(1e6 * Math.random() + 1)), (a.Action = "Send");
          var t = JSON.stringify(a);
          Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
              n(e);
          });
      });
  },
  ajaxPost: function (e, n, t) {
      var a = Email.createCORSRequest("POST", e);
      a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
          (a.onload = function () {
              var e = a.responseText;
              null != t && t(e);
          }),
          a.send(n);
  },
  ajax: function (e, n) {
      var t = Email.createCORSRequest("GET", e);
      (t.onload = function () {
          var e = t.responseText;
          null != n && n(e);
      }),
          t.send();
  },
  createCORSRequest: function (e, n) {
      var t = new XMLHttpRequest();
      return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest()).open(e, n) : (t = null), t;
  },
};

(function logout() {
  const button = document.getElementById("confirm-logout");
  button.addEventListener("click", event => {
    sessionStorage.setItem("authToken", null);
    window.location.replace(webflowUrl + "login");
  });
})();

function chechAuth() {
  const loginStatus = sessionStorage.getItem("userId");
  if(loginStatus === null) window.location.replace(webflowUrl + "login");
}

function changeUsername() {
  const username = document.getElementById('profile-name');
  username.innerHTML = sessionStorage.getItem("username");
}

function makeCardListText(data) {
  return data.length > 3 ? data[0].name + ', ' + data[1].name + ', ' + data[2].name + ', ..' : data.map((data)=>{return data.name}).join(', ')
}

function isBookmarked(id) {
  const bookmarkData = JSON.parse(sessionStorage.getItem('bookmarked'))
  const filteredBookmark = bookmarkData.filter((data)=> {
    return String(data.talentId) === String(id)
  })
  return filteredBookmark.length !== 0
}



const url = beUrl + '/api/users/' + sessionStorage.getItem("userId") + '?populate[client_profile][populate]=%2A';
const savedBookmarkUrl = beUrl + '/api/users?'
const getBookmarkURL = new URL(beUrl + '/api/bookmarks?filters[clientId][$eq]=');
const updateUrl = beUrl + '/api/users/'

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
    document.getElementById("field-fullname").value = res.client_profile?.fullName ? res.client_profile?.fullName : '';
    document.getElementById("field-email").value = res.email ? res.email : '';
    document.getElementById("field-whatsapp").value = res.client_profile?.phoneNumber ? res.client_profile?.phoneNumber : '';
    document.getElementById("field-role").value = res.client_profile?.userPosition ? res.client_profile?.userPosition : '';
    document.getElementById("field-department").value = res.client_profile?.department ? res.client_profile?.department : '';
    
    document.getElementById("field-email").disabled = true;
    document.getElementById("field-fullname").style.color = '#000000';
    document.getElementById("field-whatsapp").style.color = '#000000';
    document.getElementById("field-role").style.color = '#000000';
    document.getElementById("field-department").style.color = '#000000';

    document.getElementById("field-company-name").value = res.client_profile?.companyName ? res.client_profile?.companyName : '';
    document.getElementById("field-about").value = res.client_profile?.about ? res.client_profile?.about : '';
    document.getElementById("field-industry").value = res.client_profile?.industryTypes ? res.client_profile?.industryTypes : '';
    document.getElementById("field-address").value = res.client_profile?.address ? res.client_profile?.address : '';
    document.getElementById("field-website").value = res.client_profile?.companyWebsite ? res.client_profile?.companyWebsite : '';
    document.getElementById("field-instagram").value = res.client_profile?.instagram ? res.client_profile?.instagram : '';
    document.getElementById("field-company-size").value = res.client_profile?.size ? res.client_profile?.size : '';
    
    document.getElementById("field-company-name").style.color = '#000000';
    document.getElementById("field-about").style.color = '#000000';
    document.getElementById("field-industry").style.color = '#000000';
    document.getElementById("field-address").style.color = '#000000';
    document.getElementById("field-website").style.color = '#000000';
    document.getElementById("field-instagram").style.color = '#000000';
    document.getElementById("field-company-size").style.color = '#000000';
    
    document.getElementById("profile-fullname").innerHTML = res.client_profile?.fullName ? res.client_profile?.fullName : '-';
    document.getElementById("profile-email").innerHTML = res.email ? res.email : '-';
    document.getElementById("profile-whatsapp").innerHTML = res.client_profile?.phoneNumber ? res.client_profile?.phoneNumber : '-';
    document.getElementById("profile-role").innerHTML = res.client_profile?.userPosition ? res.client_profile?.userPosition : '-';
    document.getElementById("profile-department").innerHTML = res.client_profile?.department ? res.client_profile?.department : '-';

    document.getElementById("profile-company-name").innerHTML = res.client_profile?.companyName ? res.client_profile?.companyName : '-';
    document.getElementById("profile-about").innerHTML = res.client_profile?.about ? res.client_profile?.about : '-';
    document.getElementById("profile-industry").innerHTML = res.client_profile?.industryTypes ? res.client_profile?.industryTypes : '-';
    document.getElementById("profile-address").innerHTML = res.client_profile?.address ? res.client_profile?.address : '-';
    document.getElementById("profile-website").innerHTML = res.client_profile?.companyWebsite ? res.client_profile?.companyWebsite : '-';
    document.getElementById("profile-instagram").innerHTML = res.client_profile?.instagram ? res.client_profile?.instagram : '-';
    document.getElementById("profile-company-size").innerHTML = res.client_profile?.size ? res.client_profile?.size : '-';
  })
}

(function updateDataUser() {
  const button = document.getElementById("update-button-user");
  button.addEventListener("click", event => {
    fetch(updateUrl+sessionStorage.getItem('userId'), {  
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_profile: {
          fullName: document.getElementById('field-fullname').value,
          phoneNumber:  document.getElementById('field-whatsapp').value,
          userPosition: document.getElementById('field-role').value,
          department:  document.getElementById('field-department').value
        }
      })
    })
    sessionStorage.setItem('username', document.getElementById('field-fullname').value);
    document.getElementById("profile-fullname").innerHTML = document.getElementById('field-fullname').value;
    document.getElementById("profile-whatsapp").innerHTML = document.getElementById('field-whatsapp').value;
    document.getElementById("profile-role").innerHTML = document.getElementById('field-role').value;
    document.getElementById("profile-department").innerHTML = document.getElementById('field-department').value;
    $('#modal-update-user').css("display", "none");
    changeUsername();
  });
})();

(function updateDataCompany() {
  const button = document.getElementById("update-button-company");
  button.addEventListener("click", event => {
    fetch(updateUrl+sessionStorage.getItem('userId'), {  
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_profile: {
          companyName: document.getElementById('field-company-name').value,
          companyWebsite:  document.getElementById('field-website').value,
          about:  document.getElementById('field-about').value,
          address:  document.getElementById('field-address').value,
          instagram:  document.getElementById('field-instagram').value,
          size:  document.getElementById('field-company-size').value,
          industryTypes:  document.getElementById('field-industry').value,
        }
      })
    })
    document.getElementById("profile-company-name").innerHTML = document.getElementById('field-company-name').value;
    document.getElementById("profile-about").innerHTML = document.getElementById('field-about').value;
    document.getElementById("profile-industry").innerHTML = document.getElementById('field-industry').value ;
    document.getElementById("profile-address").innerHTML = document.getElementById('field-address').value;
    document.getElementById("profile-website").innerHTML = document.getElementById('field-website').value;
    document.getElementById("profile-instagram").innerHTML = document.getElementById('field-instagram').value;
    document.getElementById("profile-company-size").innerHTML = document.getElementById('field-company-size').value;
    $('#modal-update-company').css("display", "none");
  });
})();

function getSavedTalent() {
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
      let filterString = ''
      bookmarkList.map((data,index)=>{
        filterString = filterString + 'filters[id][$in][' + index + ']=' + data.talentId + '&'
      })
      sessionStorage.setItem('bookmarked', JSON.stringify(bookmarkList))

      if(bookmarkList.length === 0) {
        document.getElementById('profile-notalent').style.display = 'flex'
        document.getElementById('profile-notalent').style.justifyContent = 'center'
        document.getElementById('card-container').style.display = 'none'
      }else{
        document.getElementById('profile-notalent').style.display = 'none'
        document.getElementById('card-container').style.display = 'flex'
        // fetch bookmarked talent list
        fetch(savedBookmarkUrl+filterString+'populate[talent_profile][populate]=%2A', options)
        .then(data => {return data.json()})
        .then(res => {
          if (res.length > 0) {
            res.forEach(talent => {
              mappingData(talent)
            })
            cardContainer.childNodes[0].remove();
            cardContainer.childNodes[0].remove();
            cardContainer.childNodes[0].remove();
          }
        })
      }
    })

  const cardContainer = document.getElementById("card-container");

  function mappingData(talent){
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
    cardContainer.appendChild(card);
  }

}

function addEmailClick() {
  document.getElementById("tab-3").addEventListener('click', function() {
    console.log('kirim')
    Email.send({
      SecureToken: 'b9dae6a0-94a2-45b3-931c-b33e9e018248',
      To : 'christianbonafena7@gmail.com',
      From : "bonafena@alterra.id",
      Subject : "Someone clicked",
      Body : "PerusahaanA telah mengklik profile talentB"
    })
  })
}

// This fires all of the defined functions when the document is "ready" or loaded
(function() {
    chechAuth();
    changeUsername();
    getSelfData();
    getSavedTalent();
    addEmailClick();
})();

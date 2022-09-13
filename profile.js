
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


const url = 'https://assessment-alta.as.r.appspot.com/api/users/' + sessionStorage.getItem("userId") + '?populate[client_profile][populate]=%2A';
const savedBookmarkUrl = 'https://assessment-alta.as.r.appspot.com/api/users?'
const getBookmarkURL = new URL('https://assessment-alta.as.r.appspot.com/api/bookmarks?filters[clientId][$eq]=');
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

    const industryList =  res.client_profile?.industry_types.length > 0 ?  res.client_profile?.industry_types.map((data)=>{
      return data.name
    }) : []
    document.getElementById("profile-company-name").innerHTML = res.client_profile?.companyName ? res.client_profile?.companyName : '-';
    document.getElementById("profile-about").innerHTML = res.client_profile?.about ? res.client_profile?.about : '-';
    document.getElementById("profile-industry").innerHTML = res.client_profile?.industry_types.length > 0 ? industryList.toString() : '-';
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
    card.style.marginBottom = '19px'

    // talentID
    const talentID = card.childNodes[0].childNodes[0].childNodes[1];
    talentID.innerHTML = 'ID - ' + talent.id;

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
    cardContainer.appendChild(card);
  }

}

// This fires all of the defined functions when the document is "ready" or loaded
(function() {
    chechAuth();
    changeUsername();
    getSelfData();
    getSavedTalent();
})();

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
    card.style.marginBottom = '10px'

    // talentID
    const talentID = card.childNodes[0].childNodes[0].childNodes[1];
    talentID.innerHTML = 'ID - ' + talent.id;

    // alta graduates
    const altaGraduate = card.childNodes[0].childNodes[0].childNodes[2];
    altaGraduate.style.display = talent.talent_profile.altaGraduate ? 'flex' : 'none'

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
    const programming = card.childNodes[3].childNodes[1];
    if(talent.talent_profile.programming_languages.length > 0) {
      programming.innerHTML = makeCardListText(talent.talent_profile.programming_languages);
    } else {
      programming.innerHTML = 'none';
    }

    // tools
    const tools = card.childNodes[4].childNodes[1];
    if(talent.talent_profile.tools.length > 0) {
      tools.innerHTML = makeCardListText(talent.talent_profile.tools);
    } else {
      tools.innerHTML = 'none';
    }
    cardContainer.appendChild(card);
  }

}

function addEmailClick() {
  document.getElementById("tab-3").addEventListener('click', function() {
    console.log('kirim')
    Email.send({
      SecureToken: 'b9dae6a0-94a2-45b3-931c-b33e9e018248',
      To : 'bonafena@alterra.id',
      From : "talent-assessment@alterra.id",
      Subject : "Someone clicked",
      Body : "And this is the body"
    }).then(
      message => alert(message)
    );
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

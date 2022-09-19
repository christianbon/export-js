// const webflowUrl = 'https://alta-talent-dashboard.webflow.io/';
// const beUrl = 'https://assessment-alta.as.r.appspot.com';
const webflowUrl = 'https://talent.alta.id/';
const beUrl = 'https://assessment-alta-prod.as.r.appspot.com';

(function logout() {
    const button = document.getElementById("confirm-logout");
    button.addEventListener("click", event => {
      sessionStorage.setItem("authToken", null);
      window.location.replace(beUrl + "login");
    });
  })();
  
function chechAuth() {
  const loginStatus = sessionStorage.getItem("userId");
  if(loginStatus === null) window.location.replace(beUrl + "login");
}
function changeUsername() {
  const username = document.getElementById('profile-name');
  username.innerHTML = sessionStorage.getItem("username");
}
  
// This fires all of the defined functions when the document is "ready" or loaded
(function() {
    chechAuth()
    changeUsername()
})();
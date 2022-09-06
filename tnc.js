
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
  
// This fires all of the defined functions when the document is "ready" or loaded
(function() {
    chechAuth()
    changeUsername()
})();
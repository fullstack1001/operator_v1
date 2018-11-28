// var AUTH0_CLIENT_ID='HFDoRtAWuAKNBhxDQrGm3XAGcEgRH13t';
// var AUTH0_CALLBACK_URL=location.href;
// var AUTH0_DOMAIN='mark-campbell.auth0.com';
var port = '8081';
var ip = '192.168.8.1';
//var ip = '192.168.7.2';
//var ip ="12";
var profile_auth0_name = "Guest";
var reloadScorePage = 0;
var gameHasBeenPlayed = 0;


console.log("******************* CALLING UID() ********************")
var uid = uid();
console.log(uid);
function uid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + ''+ s4()  +''+  s4() +''+  s4() 
}
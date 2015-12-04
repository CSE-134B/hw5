var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
var cHabitsRef = oFirebaseRef.child("currentHabit");

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData) {
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);

    } else {
        console.log("User is logged out");
        Rollbar.info("Unauthorized user attempted to access page", {page: "list.html"});
        window.location = "login.html";
    }
}

window.onload = function () {
   
    function showMsg(element) {
        var msgElement =     (element.parentNode.parentNode.getElementsByClassName("message"))[0];
        msgElement.style.visibility = "visible";
    }

    var progressBarAnimate = function (doneButton) {
        console.log("entered function op-done");	
    };

    document.querySelector(".op-del").onclick = function(){
        alert("nimab");
        console.log("entered function op-del");
  	    var oHabit = this.parentNode.parentNode;
  	    var sHabitId = oHabit.querySelector('input[name=habit-id]').value;
        var oHabitsList = oHabit.parentNode;
  	    var oHabitRef = oFirebaseRef.child("habits" + sHabitId);
        var oNotificationRef = oFirebaseRef.child("notifications" + sHabitId);

  	    oHabitRef.remove(onCompleteHabit);

  	    var onCompleteHabit = function (error) {
  		    if (error) {
  			    console.log('Synchronization failed');
                Rollbar.error("Habit did not complete successfully", {habitId: sHabitId, error: error})
  		    } else {
  			    console.log('Synchronization succeeded');
                oNotificationRef.remove(onCompleteNotification);
  		    }
        };

    var onCompleteNotification = function(error) {
      if (error) {
        console.log('Synchronization failed');
        Rollbar.error("Notification did not complete successfully", {habitId: sHabitId, error:error});
      } else {
        console.log('Synchronization succeeded');
        oHabitsList.removeChild(oHabit);
      }
    }
}


};

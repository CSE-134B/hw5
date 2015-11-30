var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');


window.onload = function() {

    
function showMsg(element){
    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message"))[0];
    msgElement.style.visibility="visible";
}

var progressBarAnimate = function(doneButton){
    console.log("entered function op-done");
	
}

document.querySelector(".op-del").onclick = function(){
    console.log("entered function op-del");
  	var oHabit = this.parentNode.parentNode;
  	var sHabitId = oHabit.querySelector('input[name=habit-id]').value;
    var oHabitsList = oHabit.parentNode;
  	var oHabitRef = oFirebaseRef.child("habits" + sHabitId);
    var oNotificationRef = oFirebaseRef.child("notifications" + sHabitId);

  	oHabitRef.remove(onCompleteHabit);

  	var onCompleteHabit = function(error) {
  		if (error) {
  			console.log('Synchronization failed');
  		} else {
  			console.log('Synchronization succeeded');
        oNotificationRef.remove(onCompleteNotification);
  		}
    }

    var onCompleteNotification = function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        console.log('Synchronization succeeded');
        oHabitsList.removeChild(oHabit);
      }
    }
}



};
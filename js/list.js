var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
var cHabitsRef;
var oHabitsRef;

oFirebaseRef.onAuth(authDataCallback);
var uId = 0;


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
        //console.log("User " + authData.uid + " is logged in with " + authData.provider);
      uId = authData.uid;
      cHabitsRef = oFirebaseRef.child("users/" + uId + "/currentHabit");
      oHabitsRef = oFirebaseRef.child('/users/' + uId + '/habits');


    } else{
        //console.log("User is logged out");
        Rollbar.info("Unauthorized user attempted to access page", {page: "list.html"});
        window.location = "login.html";
    }
}

window.onload = function() {
    var habitList = document.getElementById("habit-list");
    var index = 0;
    oHabitsRef.once("value", function(snapshot){
    var sBestRecords = [];
    var sDaily_frequencys = [];
    var sDaysInARows = [];
    var sDescriptions = [];
    var sIcons = [];
    var sTitles = [];
    var sWeekly_frequencys = [];
    var sNumCompleted = [];
    var sTotalTodays = [];

    document.querySelector("#noHabits").style.display = 'none';
    
    snapshot.forEach(function(childSnapshot){
        
    var data = childSnapshot.val();
    sBestRecords[index] = data.bestRecord;
    sDaily_frequencys[index] = data.daily_frequency;
    sDaysInARows[index] = data.daysInARow;
    sDescriptions[index] = data.description;
    sIcons[index] = data.icon;
    sTitles[index] = data.title;
    sWeekly_frequencys[index] = data.weekly_frequency;
    sNumCompleted[index] = data.numCompleted;
    
    index++;
        
  });
       
  for(i = 0; i<index; i++){
      var habitListItem = document.getElementById("habits").content.cloneNode(true);
      habitList.appendChild(habitListItem);
      document.getElementsByClassName("habit-name")[i].innerHTML = sTitles[i];
      document.getElementsByClassName("habit-icon")[i].src = ".." + sIcons[i];
      document.getElementsByClassName("habit-desc")[i].innerHTML = sDescriptions[i];
      document.getElementsByClassName("completed")[i].innerHTML = sNumCompleted[i];
      document.getElementsByClassName("totalNum")[i].innerHTML = sDaily_frequencys[i];
      habitList.appendChild(habitListItem); 
  
      // console.log(document.getElementsByClassName("habit-name")[i].innerHTML = sTitles[i]);
      // console.log(document.getElementsByClassName("habit-icon")[i].src = ".." + sIcons[i]);
      // console.log(document.getElementsByClassName("habit-desc")[i].innerHTML = sDescriptions[i]);
      // console.log(document.getElementsByClassName("completed")[i].innerHTML = sNumCompleted[i]);
      // console.log(document.getElementsByClassName("totalNum")[i].innerHTML = sDaily_frequencys[i]);
  

  }
  if(index > 0){
    document.querySelector(".op-del").onclick = function(){
    alert("nimab");
      console.log("entered function op-del");
      var oHabit = this.parentNode.parentNode;
      var sHabitId = oHabit.querySelector('input[name=habit-id]').value;
      var oHabitsList = oHabit.parentNode;
      var oHabitRef = oFirebaseRef.child("users/" + uId + "/habits" + sHabitId);
      var oNotificationRef = oFirebaseRef.child("users/" + uId + "/notifications" + sHabitId);

      oHabitRef.remove(onCompleteHabit);

      var onCompleteHabit = function(error) {
        if (error) {
          console.log('Synchronization failed');
          Rollbar.error("Habit did not complete successfully", {habitId: sHabitId, error: error})
        } else {
          console.log('Synchronization succeeded');
          oNotificationRef.remove(onCompleteNotification);
        }
      }

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

  } else{
    document.querySelector("#noHabits").style.display = 'block';
  }
   

  document.querySelector("#logOut").onclick = function(){
    oFirebaseRef.unauth();
    window.location("login.html");
  }
        
  });

    
  function showMsg(element){
      var msgElement = (element.parentNode.parentNode.getElementsByClassName("message"))[0];
      msgElement.style.visibility="visible";
  }

  var progressBarAnimate = function(doneButton){
      console.log("entered function op-done");
  	
  }

}

   
function done(currentButton){
    //var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/habits');
    var oHabitsRef = oFirebaseRef.child("users/" + uId + "/habits");

    var oParentLi = currentButton.parentNode.parentNode;
    var aChildren = oParentLi.getElementsByTagName('progress');
    var oProgress = aChildren[0];
    
    var habitTitle = currentButton.parentNode.previousElementSibling.previousElementSibling.firstElementChild.firstElementChild.innerHTML;
    oHabitsRef.orderByChild("title").equalTo(habitTitle).once("value", function(snapshot){
                                          
    currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.style.visibility= "visible";
        snapshot.forEach(function(childSnapshot){
           var data = childSnapshot.val(); 
            var index = 0;
        
        var countstop = data.daily_frequency;
            
        var counter = data.numCompleted;
      
        var newCount = counter + 1;
        
        oHabitsRef.child(childSnapshot.key()).update({numCompleted : newCount});
            var oCheckedNotificationRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/users/' + uId + '/notifications/' + childSnapshot.key());
            var oUpdatedDate = Date.now();
            oCheckedNotificationRef.update({'last_updated': oUpdatedDate});
           
        if (newCount >= countstop) {
            //message if habit is completed
           currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerHTML = "Completed Habit!";
            //console.log("complete!");
            animator(oProgress, 100, 100);
            
            mixpanel.track("Completed a Habit");
        }
        else {
          currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.innerHTML=newCount;
            
          currentButton.parentNode.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.innerHTML=countstop;
          animator(oProgress, newCount, countstop);
            
          mixpanel.track("Did a Habit");
        }
        });
      });
}
var animator = function(oProgress, denom, num){
    //console.log(denom, num);
    var iMsecsPerUpdate = 1000/60;  // # of milliseconds between updates, this gives 60fps
    var iDuration = 3;              // secs to animate for
    var iInterval = ((denom/num) * oProgress.getAttribute('max'))/(iDuration*1000/iMsecsPerUpdate); //Edit this to change the amount the bar animates for
    oProgress.value = oProgress.value + iInterval;
    if (oProgress.value + iInterval < ((denom/num) * oProgress.getAttribute('max'))){
       setTimeout(animator(oProgress, denom, num), iMsecsPerUpdate);
    } else {
        oProgress.value = ((denom/num) * oProgress.getAttribute('max'));
    }
}


//delete habit alert and transition
function deleteHabit(element) {
    
    swal({ title: "Delete Habit?", text: "Are you sure you want to delete this habit?", type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!", closeOnConfirm: false }, 
         
         function(){ 
        
            var child = element.parentNode.parentNode.parentNode;
            child.className = child.className + " animated fadeOutLeft";
            $(child).one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(event) {
                $(this).remove();
            });
        
            var habitTitle = element.previousElementSibling.innerHTML;
            var oHabitsRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/users/' + uId + '/habits');
            var oNotificationRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/users/' + uId + '/notifications');
            
            oHabitsRef.orderByChild("title").equalTo(habitTitle).once("value", function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    sHabitKey = childSnapshot.key();
                    oHabitsRef.child(childSnapshot.key()).remove();
                    oNotificationRef.child(sHabitKey).remove();
                });
            });
            swal({   title: "Deleted!",   text: "Habit successfully deleted.",   timer: 800,   showConfirmButton: false });
        
            mixpanel.track("Deleted a Habit");
        });
    
}

var data = null;
oHabitsRef.once("value", function(snapshot){
    data = snapshot.val();
});


function editHabit(habit){
    var habitTitle = habit.previousElementSibling.previousElementSibling.innerHTML;
        for(var keys in data){
            if(data[keys].title == habitTitle)
            {   
                currentKey = keys;
                break;
            }
        }
    cHabitsRef
    .set({
        key: currentKey
    });     
    mixpanel.track("Habit Edited");
    location.href='edit.html';
}

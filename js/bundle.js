if(oFirebaseRef == null){
	var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
}

var oNotificationsRef = oFirebaseRef.child("notifications");

//Get all notifications, check which ones have not been displayed, and display them and update the timestamp

var oCurDate = Date.now();

oNotificationsRef.once("value", function(data) {
	// do some stuff once
	data.forEach(function(childSnapshot){
		var oNotification = childSnapshot.val();
		var sNotificationKey = childSnapshot.key();
		checkNotification(oNotification, sNotificationKey);
	});
});

var checkNotification = function(oNotification, sNotificationKey){
	oCurDate = new Date(oCurDate);
	var iMissedNotifications = 0;
	var oLastUpdated = new Date(oNotification.last_updated);
	
	var aDays = getWeeklyFrequency(oNotification.weekly_frequency);

	var iDateDifference = oCurDate.getDate() - oLastUpdated.getDate();
	var iWeeks = 0;

	if(iDateDifference > 1){		//Not on same date
		if(iDateDifference > 7){
			iWeeks = iDateDifference / 7;
			iMissedNotifications = aDays.length * oNotification.daily_frequency * iWeeks;
		} else{
			var iCurDay = oCurDate.getDay();
			var iNotDay = oNotification.getDay();
			var iMinDay = 0;
			if(iCurDay > iNotDay){
				iMinDay = iNotDay;
				for(i=0; i<aDays.length; i++){
					if(aDays[i] > iMinDay){
						iMissedNotifications+= oNotification.daily_frequency;
					}
				}
			} else{
				iMinDay = iCurDay;
				for(i=0; i<aDays.length; i++){
					if(aDays[i] < iCurDay){
						iMissedNotifications+= oNotification.daily_frequency;
					}
				}
			}
		}
	} else{
		//Hourly Notifications here
		var iCurHour =oCurDate.getHours();
		var iNotHour = oLastUpdated.getHours();
		var hourlyCheck = 12/oNotification.daily_frequency;
		for(i=1; i<oNotification.daily_frequency+1; i++){
			if(iCurHour > (8+(i*hourlyCheck))){		//starting at 8AM and increment by the hourly check
				iMissedNotifications+=1;
			}

		}



	}


	if(iMissedNotifications > 0){
		//TODO: GET HABIT HERE
		var oHabitRef = oFirebaseRef.child("habits/" + sNotificationKey);
			oHabitRef.once("value", function(data){
				var oHabit = data.val();
				showUserNotifications(iMissedNotifications, oHabit.title);
				var oCheckedNotificationRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/notifications/' + sNotificationKey);
				var oUpdatedDate = Date.now();

				oCheckedNotificationRef.update({'last_updated': oUpdatedDate});
			});
			
		}

	
}


var getWeeklyFrequency = function(sDays){
	aDays = [];
	if(sDays.indexOf("sunday") > -1){
		aDays.push(0);
	}
	if(sDays.indexOf("monday") > -1){
		aDays.push(1);
	}
	if(sDays.indexOf("tuesday") > -1){
		aDays.push(2);
	}
	if(sDays.indexOf("wednesday") > -1){
		aDays.push(3);
	}
	if(sDays.indexOf("thursday") > -1){
		aDays.push(4);
	}
	if(sDays.indexOf("friday") > -1){
		aDays.push(5);
	}
	if(sDays.indexOf("saturday") > -1){
		aDays.push(6);
	}

	return aDays;

}

var showUserNotifications = function(iNotificationCount, sHabitTitle){
    alert("You have missed your habit: " + sHabitTitle + " " + iNotificationCount.round() + " times!");
}

var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
        console.log("User " + authData.uid + " is logged in with " + authData.provider);

    } else{
        console.log("User is logged out");
        window.location = "login.html";
    }
}

function selectImage(name) {
	//Clear all the other effects
	document.getElementById('icon1').style.border = "none";
	document.getElementById('icon2').style.border = "none";
	document.getElementById('icon3').style.border = "none";

	document.getElementById('icon1').setAttribute("data-active", "false");
	document.getElementById('icon2').setAttribute("data-active", "false");
	document.getElementById('icon3').setAttribute("data-active", "false");

	var image = document.getElementById(name);
	image.style.border = "5px solid #42A5F5";
	image.setAttribute("data-active", "true");
}

//To allow users to toggle the radio buttons
$("input:radio").on("click",function (e) {

    //if the radio button is selected, set checked to false and remove class
    if($(this).is(".theone")) { 
        $(this).prop("checked",false).removeClass("theone");
        return;
    }
            
    //add class back to the radio button
    $("input:radio[name='"+$(this).prop("name")+"'].theone").removeClass("theone");
    $(this).addClass("theone");
});


//Save button pressed
document.querySelector('#save_p').onclick = function(){

    //checks to ensure form is filled in correctly before submitting
	//if no title, alert user
    if(!$('#title').val()) {
        document.getElementById("noTitle").style.display=""
        return;
    }
            
    //if a weekly frequency isn't selected, alert user
    if(!$('input:checkbox').is(':checked')){
        document.getElementById("noWFreq").style.display=""
        return;
    }
              
    //if a daily frequency or others frequency isn't selected, alert user
    if(!$('input:radio').is(':checked')){                 
         if(!$('#others').val()){
            document.getElementById("noDFreq").style.display=""
            return;
        }
        //if user enters number less than the minimum, alert user 
        if($('#others').val() < $('#others').attr('min')){
            swal("Oops!", "Please enter a valid Daily Frequency", "error");
            return;
        }
    }
            
    //if both a daily frequency and others frequency are chosen, go with others frequency
    if($('input:radio').is(':checked')) {
        if ($('#others').val() > 3) {
            $('input:radio').prop("checked",false);  //or .attr
        }
        else
            $('#others').attr('value','0');
    }
            
    //if a habit icon isn't chosen, use default add icon
    if(document.getElementById('icon1').getAttribute("data-active") == "false"){
        if(document.getElementById('icon2').getAttribute("data-active") == "false"){
            if(document.getElementById('icon3').getAttribute("data-active") == "false"){
                document.getElementById('icon4').setAttribute("data-active", "true");
            }
        }       
    }
       
    
    var images = document.getElementsByClassName("icon");
	var image = "";

	for(var i = 0; i< images.length; i++){
		if(images[i].getAttribute("data-active") == "true"){
			image = images[i].src.substring(images[i].src.indexOf("/img/"), images[i].src.length);
		}
	}
    
    
	var sHabitTitle = document.querySelector('#title').value;
	var sHabitIcon = image;
	var sWeeklyFreq = "";
	var sDailyFreq = 0;
    var sBestRecord = 0;
    var sDaysInARow = 0;
    var sNumCompletedToday = 0;
    var sTotalToday = 5;
    var sDescription = document.querySelector('#description').value;
	var sOthers = document.querySelector('#others').value;

	var aWeeklyElements = document.getElementsByClassName("weekly-freq");
	var aDailyElements = document.getElementsByClassName("daily-freq");

	console.log(aWeeklyElements);
	console.log(aDailyElements);
	for(var i=0; i < aWeeklyElements.length; i++){
		if(aWeeklyElements[i].checked){
			sWeeklyFreq += aWeeklyElements[i].value + ",";
		}
	}

	for(var i=0; i < aDailyElements.length; i++){
		if(aDailyElements[i].checked){
			sDailyFreq = parseInt(aDailyElements[i].value);
		}
	}

	console.log("title", sHabitTitle);
	console.log("Icon", sHabitIcon);
	console.log("Weekly", sWeeklyFreq);
	console.log("Daily", sDailyFreq);
	console.log("Others", sOthers);


	var oHabitsRef = oFirebaseRef.child("habits");

	oNewHabitRef = oHabitsRef.push();
	sHabitId = oNewHabitRef.key();
	
	oNewHabitRef.set({
		title: 				sHabitTitle,
		icon: 				sHabitIcon,
		weekly_frequency: 	sWeeklyFreq,
		daily_frequency: 	sDailyFreq,
        description:        sDescription,
        bestRecord:         sBestRecord,
        daysInARow:         sDaysInARow, 
        numCompleted:  sNumCompletedToday,
	});

	var oNotificationsRef = oFirebaseRef.child("notifications");
	var date = Date.now();
	
	var oNewNotificationRef = oNotificationsRef.child(sHabitId);

	oNewNotificationRef.set({
    	habitTitle:			sHabitTitle,
    	weekly_frequency: 	sWeeklyFreq,
    	daily_frequency: 	sDailyFreq,
    	last_updated: 		date
    });				

	window.location = "list.html";
}


var oFirebaseRef = new Firebase("https://boiling-torch-2236.firebaseio.com/web/");

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
	if(authData){
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		window.location = "list.html";

	} else{
		console.log("User is logged out");
	}
}

//function that handles the login callback from firebase
function authHandler(error, authData){
	if(error){
		console.log("Login Failed!", error);
		//TODO: show error on screen
	} else{
		console.log("Authenticated successfully with payload:", authData);
		firebasePersistUserAuth(authData);
	}
}

function firebaseLogin(userEmail, password){
	oFirebaseRef.authWithPassword({
		email		: userEmail,
		password	: password
		}, authHandler
	);
}

function firebasePersistUserAuth(authData){
	oFirebaseRef.child("users").child(authData.uid).set({
		provider: authData.provider,
		name: authData.password.email.replace(/@.*/, '')
	});
	window.location = "list.html";
}

function firebaseCreateUser(userEmail, password){
	oFirebaseRef.createUser({
		email: userEmail,
		password: password
	}, function(error, userData){
		if (error){
			console.log("Error creating user:", error);
		} else{
			console.log("Successfully created user account with uid:", userData.uid);
			//Notify that your username has been created
			document.querySelector('#signInMessage').style.display;

			//clear text fields
			document.querySelector('#usermail').value = "";
			document.querySelector('#password').value = "";
		}
	});
}

document.querySelector('#loginButton').onclick=function(){
	var userEmail = document.querySelector('#usermail').value;
	var password = document.querySelector('#password').value; 
	firebaseLogin(userEmail, password);
	
};

document.querySelector('#signUpButton').onclick=function(){
	var userEmail = document.querySelector('#usermail').value;
	var password = document.querySelector('#password').value;
	firebaseCreateUser(userEmail, password);
	
}

// document.querySelector('#signUpButton').onclick=function(){
// 	var signUpText = document.getElementById("signInMessage");
//   	signUpText.style.display = "block";
// };


var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
var cHabitsRef = oFirebaseRef.child("currentHabit");

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
        console.log("User " + authData.uid + " is logged in with " + authData.provider);

    } else{
        console.log("User is logged out");
        window.location = "login.html";
    }
}

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

var currentKey = "";
var flag = null;
var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
        console.log("User " + authData.uid + " is logged in with " + authData.provider);

    } else{
        console.log("User is logged out");
        window.location = "login.html";
    }
}

var cHabitsRef = oFirebaseRef.child("currentHabit");

function selectImage(name) {
	//Clear all the other effects
	document.getElementById('icon1').style.border = "none";
	document.getElementById('icon2').style.border = "none";
	document.getElementById('icon3').style.border = "none";

	document.getElementById('icon1').setAttribute("data-active", "false");
	document.getElementById('icon2').setAttribute("data-active", "false");
	document.getElementById('icon3').setAttribute("data-active", "false");

	var image = document.getElementById(name);
	image.style.border = "5px solid #42A5F5";
	image.setAttribute("data-active", "true");
}
document.querySelector('#save_p').onclick = function(){
	   //checks to ensure form is filled in correctly before submitting
	//if no title, alert user
    if(!$('#title').val()) {
        document.getElementById("noTitle").style.display=""
        return;
    }
            
    //if a weekly frequency isn't selected, alert user
    if(!$('input:checkbox').is(':checked')){
        document.getElementById("noWFreq").style.display=""
        return;
    }
              
    //if a daily frequency or others frequency isn't selected, alert user
    if(!$('input:radio').is(':checked')){                 
         if(!$('#others').val()){
            document.getElementById("noDFreq").style.display=""
            return;
        }
        //if user enters number less than the minimum, alert user 
        if($('#others').val() < $('#others').attr('min')){
            swal("Oops!", "Please enter a valid Daily Frequency", "error");
            return;
        }
    }
            
    //if both a daily frequency and others frequency are chosen, go with others frequency
    if($('input:radio').is(':checked')) {
        if ($('#others').val() > 3) {
            $('input:radio').prop("checked",false);  //or .attr
        }
        else
            $('#others').attr('value','0');
    }
            
    //if a habit icon isn't chosen, use default add icon
    if(document.getElementById('icon1').getAttribute("data-active") == "false"){
        if(document.getElementById('icon2').getAttribute("data-active") == "false"){
            if(document.getElementById('icon3').getAttribute("data-active") == "false"){
                document.getElementById('icon4').setAttribute("data-active", "true");
            }
        }       
    }
	cHabitsRef.once("value", function(snapshot){
		var ch = snapshot.val();
		
	 	var images = document.getElementsByClassName("icon");
		var image = "";

		for(var i = 0; i< images.length; i++){
			if(images[i].getAttribute("data-active") == "true"){
				image = images[i].src.substring(images[i].src.indexOf("/img/"), images[i].src.length);
			}
		}


		var sHabitTitle = document.querySelector('#title').value;
		var sHabitIcon = image;
		var sWeeklyFreq = "";
		var sDailyFreq = 0;
	    var sBestRecord = 0;
	    var sDaysInARow = 0;
	    var sNumCompletedToday = 0;
	    var sTotalToday = 5;
	    var sDescription = document.querySelector('#description').value;
		var sOthers = document.querySelector('#others').value;

		var aWeeklyElements = document.getElementsByClassName("weekly-freq");
		var aDailyElements = document.getElementsByClassName("daily-freq");

		console.log(aWeeklyElements);
		console.log(aDailyElements);
		for(var i=0; i < aWeeklyElements.length; i++){
			if(aWeeklyElements[i].checked){
				sWeeklyFreq += aWeeklyElements[i].value + ",";
			}
		}

		for(var i=0; i < aDailyElements.length; i++){
			if(aDailyElements[i].checked){
				sDailyFreq = parseInt(aDailyElements[i].value);
			}
		}

		console.log("title", sHabitTitle);
		console.log("Icon", sHabitIcon);
		console.log("Weekly", sWeeklyFreq);
		console.log("Daily", sDailyFreq);
		console.log("Others", sOthers);

		var oHabitsRef = oFirebaseRef.child("habits");
		//the path of current editing habit in firebase database
		oHabitsRef = oHabitsRef.child(ch.key);
		sHabitId = 	oHabitsRef.key();
		
		oHabitsRef
		.set({
			title: 				sHabitTitle,
			icon: 				sHabitIcon,
			weekly_frequency: 	sWeeklyFreq,
			daily_frequency: 	sDailyFreq,
	        description:        sDescription,
	        bestRecord:         sBestRecord,
	        daysInARow:         sDaysInARow, 
	        numCompleted:  sNumCompletedToday,
		});

		var oNotificationsRef = oFirebaseRef.child("notifications");
		var date = Date.now();
		
		var oNewNotificationRef = oNotificationsRef.child(sHabitId);

		oNewNotificationRef.set({
	    	habitTitle:			sHabitTitle,
	    	weekly_frequency: 	sWeeklyFreq,
	    	daily_frequency: 	sDailyFreq,
	    	last_updated: 		date
	    });		
	    	location.href='list.html';
	});		
}
window.onload = function()
{

	cHabitsRef.once("value", function(snapshot){
		var ch = snapshot.val();
		var oHabitsRef = oFirebaseRef.child("habits");
		//the path of current editing habit in firebase database
		oHabitsRef = oHabitsRef.child(ch.key);

		oHabitsRef.once("value", function(snapshot){
			 var data = snapshot.val();
			 document.getElementById("title").value = data.title;
			 document.getElementById("description").value = data.description;
			 document.getElementById("title").value = data.title;
			 if(data.icon == "/img/shopping.png")
			 {
			 	selectImage("icon1");
			 }
			 else if(data.icon == "/img/food.png")
			 {
			 	selectImage("icon2");
			 }
			 else if(data.icon == "/img/run.png")
			 {
			 	selectImage("icon3");
			 }
			  else if(data.icon == "/img/add.png")
			 {
			 	selectImage("icon4");
			 }
			 var checkedFreq = "";
			 var aWeeklyElements = document.getElementsByClassName("weekly-freq");
			 var aDailyElements = document.getElementsByClassName("daily-freq");
			 for(var i = 0; i<data.weekly_frequency.length;i++)
			 {
			 	if(data.weekly_frequency[i]==',')
			 	{
					for(var j=0; j < aWeeklyElements.length; j++){
						if(aWeeklyElements[j].value == checkedFreq){
							aWeeklyElements[j].checked = true;
							break;
						}
					}
					checkedFreq = "";
			 	}
			 	else
			 	{
			 		checkedFreq += data.weekly_frequency[i];
			 	}
			 }
			 switch(data.daily_frequency)
			 {
			 	case 1:
			 		aDailyElements[0].checked = true;
			 		break;
			 	case 2:
			 		aDailyElements[1].checked = true;
			 		break;
			 	case 3:
			 		aDailyElements[2].checked = true;
			 		break;
			 }


		});	
	});	

}
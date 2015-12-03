var currentKey = "";
var flag = null;
var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');
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
			 if(data.icon == "/img/sleep.jpg")
			 {
			 	selectImage("icon1");
			 }
			 else if(data.icon == "/img/salad.jpg")
			 {
			 	selectImage("icon2");
			 }
			 else if(data.icon == "/img/run.jpg")
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


		});	
	});	

}

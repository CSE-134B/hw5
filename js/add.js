var oFirebaseRef = new Firebase('http://boiling-torch-2236.firebaseIO.com/web/');

oFirebaseRef.onAuth(authDataCallback);


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
    if(authData){
        console.log("User " + authData.uid + " is logged in with " + authData.provider);

    } else{
        console.log("User is logged out");
        Rollbar.info("Unauthorized user attempted to access page", {page: "add.html"});
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


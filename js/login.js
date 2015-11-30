var oFirebaseRef = new Firebase("https://boiling-torch-2236.firebaseio.com/web/");

oFirebaseRef.getAuth();


//This function is called as soon as the authenticate information is received
function authDataCallback(authData){
	if(authData){
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
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
	}
}

document.querySelector('#loginButton').onclick=function(){
	var userEmail = document.querySelector('#usermail').value;
	var password = document.querySelector('#password').value; 

	oFirebaseRef.authWithPassword({
		email		: userEmail,
		password	: password
		}, authHandler
	);
};

document.querySelector('#signUpButton').onclick=function(){
	var signUpText = document.getElementById("signInMessage");
  	signUpText.style.display = "block";
};


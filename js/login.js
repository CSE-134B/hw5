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


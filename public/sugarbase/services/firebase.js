
import "/__/firebase/8.6.8/firebase-app.js"
import "/__/firebase/8.6.8/firebase-auth.js"
import "/__/firebase/8.6.8/firebase-firestore.js"
import "/__/firebase/init.js?useEmulator=true"

if(!window.Services) window.Services = {}

Services.db = {}

Services.db.firebase = firebase
Services.db.firestore = firebase.firestore()

Services.db.login = function() {
	// not needed
}

Services.db.signout = function() {
	Services.db.firebase.auth().signOut()
	if(Services.state)Services.state.currentParty = 0
}

Services.onauth = function(callback) {
	firebase.auth().onAuthStateChanged(user => {
		if(Services.state) Services.state.currentParty = user
		callback(user)
	});
}

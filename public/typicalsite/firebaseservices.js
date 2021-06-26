
import "/__/firebase/8.6.8/firebase-app.js"
import "/__/firebase/8.6.8/firebase-auth.js"
import "/__/firebase/8.6.8/firebase-firestore.js"
import "/__/firebase/init.js?useEmulator=true"

import "/basicsite/services.js"

Services.firebase = firebase
Services.firestore = firebase.firestore()

Services.login = function() {
}

Services.signout = function() {
	Services.firebase.auth().signOut()
	Services.currentParty = 0
}

Services.onchange = function(callback) {
	firebase.auth().onAuthStateChanged(user => {
		Services.set({currentParty:user})
		callback()
	});
}


import "/__/firebase/8.6.8/firebase-app.js"
import "/__/firebase/8.6.8/firebase-auth.js"
import "/__/firebase/8.6.8/firebase-firestore.js"
import "/__/firebase/init.js?useEmulator=true"

let firestore = firebase.firestore()

class FireDB = {

	authenticate(user=0) {
		// login is not handled here but rather magically calls onauth due to firebase
		if(user) return
		// logout... (which will trigger an onauth as well by firebase)
		firebase.auth().signOut()
	}

	onauth(callback) {
		firebase.auth().onAuthStateChanged(user => {
			callback(user)
		});
	}
}

export default new FireDB();

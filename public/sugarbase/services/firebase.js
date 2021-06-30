
import "/__/firebase/8.6.8/firebase-app.js"
import "/__/firebase/8.6.8/firebase-auth.js"
import "/__/firebase/8.6.8/firebase-firestore.js"
import "/__/firebase/init.js?useEmulator=true"

let firestore = firebase.firestore()

export class DB = {

	login() {
		// not needed
	}

	signout() {
		firebase.auth().signOut()
	}

	onauth(callback) {
		firebase.auth().onAuthStateChanged(user => {
			callback(user)
		});
	}
}

export let db = new DB();

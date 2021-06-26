
/*
<script defer src="/__/firebase/8.6.8/firebase-app.js"></script>
<script defer src="/__/firebase/8.6.8/firebase-analytics.js"></script>
<script defer src="/__/firebase/8.6.8/firebase-auth.js"></script>
<script defer src="/__/firebase/8.6.8/firebase-firestore.js"></script>
<script defer src="/__/firebase/8.6.8/firebase-functions.js"></script>
<script defer src="/__/firebase/8.6.8/firebase-storage.js"></script>
<script defer src="/__/firebase/init.js?useEmulator=true"></script>
<script src="https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.js"></script>
<link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css" />
*/

import "/__/firebase/8.6.8/firebase-app.js"
import "/__/firebase/8.6.8/firebase-auth.js"
import "/__/firebase/8.6.8/firebase-firestore.js"
import "/__/firebase/init.js?useEmulator=true"
import "https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.js"

// https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css ??

export function startup() {
	console.log("demo2")

firebase.auth().onAuthStateChanged(user => {
	console.log("User state change from firebase")
	console.log(user)
});

}

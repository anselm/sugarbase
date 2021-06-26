
// build on top of the routing demo

import '/routing-site/basicsite.js'

// but revise these bits and pieces

import '/firebasesite/firebaseservices.js'
import '/firebasesite/pages/party-login-firebase-page.js'

window.router.unshift((segments) => {
	if(segments.length == 1 && segments[0]=="login") return "party-login-firebase-page"
	return 0
})

// start site

export async function run() {

	// set app name
	Services.set({appName:"firebasesite"})

	// this is called whenever the user changes

	Services.onchange( ()=> {

		// prevent duplicate nav bars due to on change

		if(!document.body.querySelector("nav-bar-component")) {
			document.body.appendChild(document.createElement("nav-bar-component"))
		}

		// reset router

		window.router.reset();

	})

}

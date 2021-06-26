
// css - you may want to statically declare these in header to reduce flickering

let url = "https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css"
document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="${url}">`

// use some basic site parts

import '/basicsite/basicsite.js'

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

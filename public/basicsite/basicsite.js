
// borrow the mobile style for this demo

document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/styledsite/style/mobile/basic.css">`

// app components

import '/basicsite/services.js'
import '/basicsite/components/nav-bar-component.js'
import '/basicsite/pages/splash-page.js'
import '/basicsite/pages/party-profile-page.js'
import '/basicsite/pages/party-login-page.js'
import '/basicsite/pages/party-signout-page.js'
import '/sugarbase/generic-404-page.js'

// routes

export let routes = (segments) => {
	if(!segments || segments.length < 1 || segments[0].length==0) {
		return "splash-page"
	}
	switch(segments[0]) {
		case "profile": return "party-profile-page"
		case "login": return "party-login-page"
		case "signout": return "party-signout-page"
		default: break
	}
	return "generic-404-page"
}

import {Router} from '/sugarbase/router.js'

let router = window.router = Router.new().push(routes)

// start site

export async function run() {

	// set app name

	Services.set({appName:"basicsite"})

	// nav bar

	document.body.appendChild(document.createElement("nav-bar-component"))

	// start routing

	window.router.reset();

}

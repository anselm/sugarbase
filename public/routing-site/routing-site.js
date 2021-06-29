
// sugar helpers

import '/utils/sugarbase/sugar-element.js'
import '/utils/sugarbase/sugar-404-page.js'
import {Router} from '/utils/sugarbase/sugar-router.js'

// app routes

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

let router = window.router = Router.new().push(routes)

// app pages

import {NavBarComponent} from './components/nav-bar-component.js'
import './pages/splash-page.js'
import './pages/party-profile-page.js'
import './pages/party-login-page.js'
import './pages/party-signout-page.js'

// app data model

import '/data-site/services.js'

// start app

export async function run() {

	// directly add nav bar and some state fiddling for example

	if(false) {
		let nav = document.createElement("nav-bar-component")
		document.body.appendChild(nav)
		nav.title = "❤️"
	} else {
		let nav = new NavBarComponent({title:"😀😀😀"})
		document.body.appendChild(nav)
		nav.title = "❤️"
	}

	// start routing

	window.router.reset();

	// set app name as an example of global observers

	Services.set({appName:"routing demo"})

}

// minimalist mobile friendly styling - just stuff this in right now - typically you should put it in index.html to reduce flickering

document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/styles-site/style/mobile/basic.css">`

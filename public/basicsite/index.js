
// router

import {Router,LoadCSS} from '/sugarbase/router.js'

// app specific state

import './services.js'

// app components

import './components/nav-bar-component.js'
import './pages/splash-page.js'
import './pages/party-profile-page.js'
import './pages/party-login-page.js'
import './pages/party-signout-page.js'
import '/sugarbase/generic-404-page.js'

// start services

Services.startup(async ()=>{

	// load css now

	await LoadCSS([`/basicsite/common.css`])

	// add nav bar now

	document.body.appendChild(document.createElement("nav-bar-component"))

	// add route resolvers

	let routing = (segments) => {
		if(!segments || segments.length < 1 || segments[0].length==0) {
			return "splash-page"
		}
		switch(segments[0]) {
			case "profile": return "party-profile-page"
			case "login": return "party-login-page"
			case "signout": return "party-signout-page"
		}
		return "generic-404-page"
	}

	// start routing

	Router.new().use(routing).reset();

})

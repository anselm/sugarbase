
document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-mobile.css">`


// sugar elements used in this app

import '/sugarbase/elements/sugar-element.js'
import "/sugarbase/elements/sugar-collection.js"
import "/sugarbase/elements/sugar-sigil.js"
import "/sugarbase/elements/sugar-card.js"
import '/sugarbase/elements/sugar-form.js'
import '/sugarbase/elements/sugar-404-page.js'
import '/sugarbase/elements/sugar-router.js'

// app local elements

import './nav-bar-component.js'
import './splash-page.js'
import './party-profile-page.js'
import './party-signout-page.js'

// app routes

export let user_router = (segments) => {
	if(!segments || segments.length < 1 || segments[0].length==0) {
		return "splash-page"
	}
	switch(segments[0]) {
		case "profile": return "party-profile-page"
		case "login": return "party-login-page"
		case "signout": return "party-signout-page"
		default: break
	}
	return "sugar-404-page"
}

// bring in a service layer with a trivial state observer callback system - mounted at window.Services.state

// start app

export async function run() {

	// build a global services layer that handles non display logic - in this case tacking on a state concept with observers

	let services = window.Services = {}
	let {state} = await import('/sugarbase/services/state.js')
	services.state = state

	// this helper swaps in some fake login page support and a fake ramdb and some fake data

	let ram = async () => {

		await import('./party-login-page.js')

		// add a ram db
		let {db} = await import('/sugarbase/services/ramdb.js')
		console.log(db)
		services.db = db

		// add some fake data
		let {somedata} = await import('/sugarbase/services/somedata.js')
		somedata(db)

		// fake an auth event (with 0 as the argument)
		setTimeout(Services.onauth,1000)
	}

	// this helper stuffs firebase into our services layer instead - and also a real login page at sugar-login-page

	let fire = async () => {

		// add firebase login page
		await import('./party-login-firebase-page.js')

		// add firebase db instead
		let {db} = await import('/sugarbase/services/firebase.js')
		services.db = db
	}

	// run either real or fake as desired

	if(true) {
		// run the fake ram db - and fake an auth event for consistency
		await ram()
	} else {
		// run the real firebase db - it will always respond with an auth event right away even if user is undefined
		await fire()
	}

	// wait for auth event to set the party

	Services.db.onauth( (user)=> {
		Services.state.set({currentParty:user})
	})

	// paint view

	htmlify2dom(document.body,
		htmlify`<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-mobile.css" />
				<nav-bar-component></nav-bar-component>
				<sugar-router user_router=${user_router}></sugar-router>`
	)

}

// - your logged in profile page should
//		- show buttons for events, rooms and so on
//		- have an events page that enumerates events
//		- have an event adder page that adds an event
//		- have a delete button for events
//		- allow edit also

// are short tags like <nav-bar-component /> supported?











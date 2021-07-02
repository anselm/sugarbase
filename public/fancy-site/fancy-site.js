
document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-mobile.css">`

// sugar elements used in this app

import '/sugarbase/elements/sugar-element.js'
import "/sugarbase/elements/sugar-collection.js"
import "/sugarbase/elements/sugar-sigil.js"
import "/sugarbase/elements/sugar-card.js"
import '/sugarbase/elements/sugar-form.js'
import '/sugarbase/elements/sugar-404-page.js'
import '/sugarbase/elements/sugar-router.js'

// app elements

import './splash-page.js'
import './events-page.js'
import './party-profile-page.js'
import './party-signout-page.js'
import './nav-bar-component.js'

// app routes

export let user_router = (segments) => {
	if(!segments || segments.length < 1 || segments[0].length==0) {
		return "splash-page"
	}
	switch(segments[0]) {
		case "profile": return "party-profile-page"
		case "login": return "party-login-page"
		case "signout": return "party-signout-page"
		case "events": return "events-page"
		default: break
	}
	return "sugar-404-page"
}

// bring in a service layer with a trivial state observer callback system - mounted at window.Services.state

// start app

export async function run() {

	// build a services layer that handles core logic

	let services = window.Services = {}
	let {state} = await import('/sugarbase/services/state.js')
	services.state = state

	// this helper swaps in some fake login page support and a fake ramdb and some fake data

	if(true) {

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

	else {

		// add firebase login page
		await import('./party-login-firebase-page.js')

		// add firebase db instead
		let {db} = await import('/sugarbase/services/firebase.js')
		services.db = db
	}

	// wait for auth event to set the party; often in a real app the entire display would not be built till after this

	Services.db.onauth( (user)=> {
		Services.state.set({currentParty:user})
	})

	// paint view - in a real app the css would be loaded way earlier so as to reduce flickering

	htmlify2dom(document.body,
		htmlify`<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-mobile.css" />
				<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-forms-large.css" />
				<nav-bar-component/>
				<sugar-router user_router=${user_router}></sugar-router>`
	)

}

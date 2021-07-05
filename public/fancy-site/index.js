// useful layout

import '/sugarbase/elements/sugar-element.js'
import '/sugarbase/elements/sugar-404-page.js'
import '/sugarbase/elements/crud/sugar-collection.js'
import '/sugarbase/elements/crud/sugar-sigil.js'
import '/sugarbase/elements/crud/sugar-card.js'
import '/sugarbase/elements/crud/sugar-form.js'
import '/sugarbase/elements/auth/sugar-login-page.js'
import '/sugarbase/elements/auth/sugar-profile-page.js'
import '/sugarbase/elements/auth/sugar-signup-page.js'
import '/sugarbase/elements/auth/sugar-signout-page.js'
import {router} from '/sugarbase/elements/sugar-router.js'

// app specific layout

import {NavBarElement} from '/fancy-site/nav-bar-element.js'
import '/fancy-site/splash-page.js'
import '/fancy-site/menu-page.js'
import '/fancy-site/groups.js'
import '/fancy-site/events.js'
import '/fancy-site/members.js'

// make these useful services globally available to my code

import {db} from '/sugarbase/services/ramdb.js'
import {state} from '/sugarbase/services/state.js'

// TODO i think actually i can avoid this - examine
window.Services = {
	db:db,
	state:state,
	useFirebase:0.
}

/*
router.bundle({
	splash:{
		conditions:(segments)=>{ return (!segments || segments.length<1 || !segments[0].length) },
		success:{element:"splash-page",state:state},
	},
	login:{
		conditions:()=>{ if(state.currentParty) return "/" } // should return a new choice
		success:{element:"login-element",login:db.login.bind(db)}
	},
	signup:{

	},
})
*/

// route splash page

router.unshift( (segments) => {
	if(!segments || segments.length < 1 || segments[0].length==0) {
		return { element:"splash-page", state:state }
	}
	return 0
})

// route login

router.push( (segments) => {
	console.log(segments)
	if(!segments || segments.length < 1 || segments[0].length==0) return 0
	switch(segments[0]) {
		case "login":
			if(state.currentParty) {
				// TODO hack - if we land here with a user - send them to home page - can i send an empty page? in the mean time?
				window.history.pushState({},"/","/")
				return { element:"splash-page", state:state }
			}
			return {element:"sugar-login-page",login:db.login.bind(db)}
		case "signup":
			return {element:"sugar-signup-page",signup:db.signup.bind(db)}
		case "signout":
			return {element:"sugar-signout-page",signout:db.signout.bind(db)}
	}
	return 0
})

// route menu

router.push( (segments) => {
	switch(segments[0]) {
		case "menu": return "menu-page"
	}
	return 0
})


// route groups

router.push( (segments) => {
	switch(segments[0]) {
		case "group":
			if(segments.length>1 && segments[1] == "edit") return "group-edit-page"
			return "group-detail-page"
		case "groups":
			return "groups-page"
	}
	return 0
})

// route members

router.push( (segments) => {
	switch(segments[0]) {
		case "member":
			if(segments.length>1 && segments[1] == "edit") return "member-edit-page"
			return "member-detail-page"
		case "members":
			return "members-page"
	}
	return 0
})

// route events

router.push( (segments) => {
	switch(segments[0]) {
		case "event":
			if(segments.length>1 && segments[1] == "edit") return "event-edit-page"
			return "event-detail-page"
		case "groups":
			return "events-page"
	}
	return 0
})

// 404

router.push( ()=> { return "sugar-404-page" })

// force insert nav bar once (this could be done after auth to reduce flickering)

document.body.appendChild( new NavBarElement() )

// boot up

export async function run() {

	// use firebase or not?

	if(Services.useFirebase) {
		await import('./party-login-firebase-page.js')
		let {db} = await import('/sugarbase/services/firebase.js')
	} else {
		let {somedata} = await import('/sugarbase/services/somedata.js')
		somedata(db)		
	}

	// i prefer to refresh the current page after an auth event so that pages do not have to watch for auth transitions

	db.onauth( (user)=> {
		Services.state.set({currentParty:user})
		router.reset()
	})

	// fake an auth event if not using a real datastore

	if(!Services.useFirebase) db.authchange(0)

}

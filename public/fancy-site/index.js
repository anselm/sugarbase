
////////////////////////////////////////////////////////////////////////
// useful pieces from sugarbase
////////////////////////////////////////////////////////////////////////

import '/sugarbase/core/sugar-element.js'

import {db} from '/sugarbase/fakedb/fakedb.js'
import {state} from '/sugarbase/utils/state.js'
import {router} from '/sugarbase/core/sugar-router.js'

window.Services = {
	state:state,
	db:db
}

db.volatile = function(obj) {
	obj.volatile = {}
	console.log(obj)
	switch(obj.table) {
		case "activity":
			obj.volatile.url = `/group/${obj.parentid}/${obj.table}/${obj.id}`
			break
		case "member":
			obj.volatile.url = `/group/${obj.parentid}/${obj.table}/${obj.id}`
			break
		default:
			obj.volatile.url = `/${obj.table}/${obj.id}`
	}
	console.log(obj.volatile.url)
}

db.routing = function(tablename) {
	return tablename
}

////////////////////////////////////////////////////////////////////////
// authentication support
////////////////////////////////////////////////////////////////////////

import '/sugarbase/fakedb/sugar-login-page.js'
import '/sugarbase/fakedb/sugar-profile-page.js'
import '/sugarbase/fakedb/sugar-signup-page.js'
import '/sugarbase/fakedb/sugar-signout-page.js'

import '/sugarbase/firebase/sugar-firebase-login-page.js'

router.push( (segments) => {
	switch(segments.length == 1 ? segments[0] : "") {
		case "fblogin":   return {element:"sugar-firebase-login-page",nextpage:"/profile",authenticate:db.authenticate}
		case "login":   return {element:"sugar-login-page",nextpage:"/profile",authenticate:db.authenticate}
		case "profile": return {element:"sugar-profile-page"}
		case "signup":  return {element:"sugar-signup-page",nextpage:"/profile",authenticate:db.authenticate}
		case "signout": return {element:"sugar-signout-page",nextpage:"/",authenticate:db.authenticate}
		default: return 0
	}
})

////////////////////////////////////////////////////////////////////////
// bring in and route pages for the app specific experience
////////////////////////////////////////////////////////////////////////

import '/sugarbase/crud/sugar-collection.js'
import '/sugarbase/crud/sugar-sigil.js'
import '/sugarbase/crud/sugar-card.js'
import '/sugarbase/crud/sugar-card-medium.js'
import '/sugarbase/crud/sugar-form.js'
import '/sugarbase/crud/sugar-decorators.js'
import '/sugarbase/error/sugar-404-page.js'
import '/sugarbase/sticky/sticky-note.js'

import '/fancy-site/splash-page.js'
import '/fancy-site/menu-page.js'
import '/fancy-site/groups.js'
import '/fancy-site/activities.js'
import '/fancy-site/members.js'

import {NavBarElement} from '/fancy-site/nav-bar-element.js'

// route splash page

router.unshift( (segments) => {
	if(!segments || segments.length < 1 || segments[0].length==0) {
		return { element:"splash-page", state:state }
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

// route groups of the form
//
//	/groups						<- all groups
//  /group/create
//	/group/5000					<- a specific group (activity shows up in here never by itself)
//	/group/5000/edit			<- edit a group
//  /group/5000/activities		<- (x) no point
//	/group/5000/activity/create
//	/group/5000/activity/1234
//	/group/5000/activity/1234/edit
//  /group/5000/members			<- this is needed
//	/group/5000/member/create
//	/group/5000/member/1234
//	/group/5000/member/1234/edit

router.push( async (segments) => {
	if(segments[0] == "groups") return "groups-page"
	if(segments[0] != "group") return 0
	if(segments.length < 2) return 0
	if(segments[1] == "create") return {element:"group-edit-page",subject:0}
	let groupid = parseInt( segments[1] ) || 0
	if(!groupid) return 0
	let group = await db.byid("group",groupid)
	if(!group) return 0
	if(segments.length < 3) return {element:"group-detail-page",subject:group}
	if(segments[2] == "edit") return {element:"group-edit-page",subject:group}
	//if(segments[2] == "activities") return {element:"activities-page",parent:group}
	if(segments[2] == "activity") {
		if(segments.length < 4) return 0
		if(segments[3] == "create") return {element:"activity-edit-page",parent:group,subject:0}
		let id = parseInt( segments[3] ) || 0
		if(!id) return 0
		let activity = await db.byid("activity",id)
		if(!activity) return 0
		if(segments.length < 5) return {element:"activity-detail-page",parent:group,subject:activity}
		if(segments[4] == "edit") return {element:"activity-edit-page",parent:group,subject:activity}
	}
	if(segments[2] == "members") return {element:"members-page",parent:group}
	if(segments[2] == "member") {
		if(segments.length < 4) return 0
		if(segments[3] == "create") return {element:"member-edit-page",parent:group,subject:0}
		let id = parseInt( segments[3] ) || 0
		if(!id) return 0
		let member = await db.byid("member",id)
		if(!member) return 0
		if(segments.length < 5) return {element:"member-detail-page",parent:group,subject:member}
		if(segments[4] == "edit") return {element:"member-edit-page",parent:group,subject:member}
	}
	return 0
})

// 404

router.push( ()=> { return "sugar-404-page" })

/////////////////////////////////////////////////////////////////////////////////////
// start app
/////////////////////////////////////////////////////////////////////////////////////

// force insert nav bar once (this could be done after auth to reduce flickering)

document.body.appendChild( new NavBarElement() )

// boot up
let FIREBASE = false

export async function run() {

	// use firebase or not?

	if(FIREBASE) {
		let {db} = await import('/sugarbase/firebase/firebase.js')
	} else {
		let {fakedata} = await import('/sugarbase/fakedb/fakedata.js')
		await fakedata(db)		
	}

	// i prefer to refresh the current page after an auth event so that pages do not have to watch for auth transitions

	db.onauth( (user)=> {
		console.warn("******** Forcing re-render due to auth change!")
		state.set({currentParty:user})
		router.reset()
	})

	// fake an auth if not using a real datastore

	if(!FIREBASE) db.authenticate(0)

}

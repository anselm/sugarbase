
///
/// Bind to your custom pages - in this example they look for window.router and attach themselves
///

import '/js/components/nav_bar_component.js'
import '/js/pages/splash_page.js'
import '/js/pages/party_home_page.js'
import '/js/pages/party_login_page.js'
import '/js/pages/party_signout_page.js'
import '/js/pages/generic_404_page.js'

///
/// A handler for home page
///

router.use((segments)=>{
	if(segments && segments.length && segments[0].length) return 0
	return "splash-page"
	//return window.appstate.currentParty ? "party-home-page" : "splash-page"
})

///
/// A handler for single segment paths - these are stored as a list in the router itself optionally
///

router.use((segments)=>{
	if(!segments || segments.length != 1 || segments[0].length<1) return 0
	let route = router.routes[segments[0]]

	if(!route) return 0
	if(route.condition && !route.condition()) return "sugar-403-page"
	return route.elem
})

///
/// add handler to handle fancier routes
///
///		/party
///		/party/login
///		/party/logout
///

router.use(async (segments)=>{

	if(!segments || segments.length < 2 || segments[1].length<1) return 0
	let slug = segments[0]

	if(slug!="party") return 0

	let command = segments[1]

	switch(command) {
		case "login": return "party-login-page"
		case "logout":  // fall thru - (i prefer to differentiate login from logout by using the term signout)
		case "signout": return "party-signout-page"
		default: break
	}

	return 0
})

///
/// error handling
///

router.use(async ()=> {
	return "generic-404-page"
})

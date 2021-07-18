export class SplashPage extends SugarElement {
	render() {


		let party = Services.state.currentParty
		let moniker = party ? party.displayName : 0

console.log("********** being asked to render splash")
console.log(party)

		return htmlify
			`<sugar-page>
				<sugar-content>
					<h1>Sugarbase</h1>
					<br/>
					Sugarbase is a collection of the various pieces required to build a data driven website with real time updates.
					<br/>
					<br/>
<!--
					<ol>
					<li> CRUD ( See <a href="https://en.wikipedia.org/wiki/Create,_read,_update_and_delete">https://en.wikipedia.org/wiki/Create,_read,_update_and_delete</a> ) to allow creating and editing objects (such as users, posts and other activity) </li>
					<li> Firebase integration for persistence </li>
					<li> Real-time multi-participant observability (changes on one view of the website are reflected to all other viewers instantly) </li>
					<li> Isolation of style so that the website can be styled in different ways (dark mode for example) </li>
					<li> ThreeJS support for 3d objects (it's often convenient to render 3d objects on the web) </li>
					<li> Routing - typically modern web apps are broken into pages, and those pages appear based on user activity </li>
					<li> Collections - most web-apps are glorified lists of objects </li>
					<li> Reactivity - most web-apps have some kind of way to make it easier to cleanly update a page when content changes </li>
					</ol>
-->
					Actions you may take here:
					<ul>
						<li style="display:${moniker?"none":"normal"}"><a href="/login">go to login</a></li>
						<li style="display:${moniker?"normal":"none"}"><a href="/profile">go to your page</a></li>
						<li style="display:${moniker?"normal":"none"}"><a href="/signout">go to signout</a></li>
					</ul>
					<font color="white">Login Status: ${moniker}</font>

					<h1>Public Group Areas</h1>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"group",visibility:"public"}}
						card="sugar-card-medium">
					</sugar-collection>
				</sugar-content>
			</sugar-page>

<sticky-note contenteditable="true">
<h2>Splash Page</h2>
<br/>
Typically a splash page helps people get signed in, and/or, if they are signed in, it shows general ambient activity or actions a user can take.
</sticky-note>


			`
	}
}
customElements.define('splash-page', SplashPage )

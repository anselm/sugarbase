export class SplashPage extends SugarElement {
	render() {


		let party = Services.state.currentParty
		let moniker = party ? party.displayName : 0

console.log("********** being asked to render splash")
console.log(party)

		return htmlify
			`<sugar-page>
				<sugar-content>
					<h1>Hello x!</h1>
					<br/>
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

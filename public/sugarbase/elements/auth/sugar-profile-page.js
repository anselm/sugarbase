export class SugarProfilePage extends HTMLElement {
	connectedCallback() {
		let moniker = Services.state.currentParty ? Services.state.currentParty.displayName : 0

		// TODO - this page can kick them away if not signed in - OR the router can do it
		// And in general I prefer not to make this page have to listen to logged in status

		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>Profile page - you are ${moniker?"":"not"} logged in</h1>
					<br/>
					This page might typically show a stream of your recent activity. In general most complex options should be consolidated and reached from a general options page rather than here.
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('sugar-profile-page', SugarProfilePage )


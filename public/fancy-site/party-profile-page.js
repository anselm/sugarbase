export class PartyProfilePage extends HTMLElement {
	connectedCallback() {
		let moniker = Services.state.currentParty ? Services.state.currentParty.displayName : 0

// kick them away if not signed in todo

		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>You are ${moniker?"":"not"} logged in</h1>
					<br/>
					Actions you may take here:
					<ul>
						<li><a href="/">go to home page</a>
						<li><a href="/events">go events</a>
						<li><a href="/signout">go to signout</a>
					</ul>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('party-profile-page', PartyProfilePage )


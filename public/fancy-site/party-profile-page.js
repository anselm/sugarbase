export class PartyProfilePage extends HTMLElement {
	connectedCallback() {
		let moniker = Services.state.currentParty ? Services.state.currentParty.displayName : 0
		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>You are ${moniker?"":"not"} logged in</h1>
					<br/>
					Actions you may take here:
					<ul>
						<li><a href="/">go to home page</a>
						<li style="display:${moniker?"normal":"none"}"><a href="/profile">go to your page</a>
						<li style="display:${moniker?"normal":"none"}"><a href="/signout">go to signout</a>
					</ul>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('party-profile-page', PartyProfilePage )


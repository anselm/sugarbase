export class PartyProfilePage extends HTMLElement {
	connectedCallback() {
		let moniker = Services.currentParty ? Services.currentParty.displayName : 0
		this.className="sugar-page"
		this.innerHTML =
			`<div class='sugar-content'>
				<h1>You are ${moniker?"":"not"} logged in</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li><a href="/">go to home page</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/profile">go to your page</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/signout">go to signout</a>
				</ul>
			</div>`
	}
}
customElements.define('party-profile-page', PartyProfilePage )


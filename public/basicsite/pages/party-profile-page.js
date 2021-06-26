
class PartyProfilePage extends HTMLElement {
	connectedCallback() {
		this.className="page"

		let moniker = Services.currentParty ? Services.currentParty.displayName : 0

		this.innerHTML =
			`
			<div class='subpage' style="background:rgba(255,255,255,0.7);font-size:2em;">
				<h1>You are ${moniker?"":"not"} logged in</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li><a href="/">go to home page</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/profile">go to your page</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/signout">go to signout</a>
				</ul>
			</div>
			`
	}
}

customElements.define('party-profile-page', PartyProfilePage )


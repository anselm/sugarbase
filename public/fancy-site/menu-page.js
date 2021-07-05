export class MenuPage extends HTMLElement {
	connectedCallback() {
		let party = Services.state.currentParty
		let moniker = party ? party.displayName : 0
		this.innerHTML =
			`<sugar-page>
			<sugar-content>

			<h1>Menu</h1>
			<br/>
			<ul>

			<li><a href="/groups/edit">create group</a>
			<br/>
			<li><a href="/groups">groups</a>
			<li><a href="/events">events</a>
			<li><a href="/worlds">worlds</a>
			<li><a href="/artifacts">artifacts</a>
			<br/>
			<li><a href="/profile">profile</a>
			<li><a href="/settings">settings</a>
			<li><a href="/signout">go to signout</a>
			<br/>
			<li><a href="/about">📜 About</a>
			<li><a href="/terms">📜 Terms</a>
			<li><a href="/privacy">📜 Privacy</a>
			<li><a href="/faq">📜 FAQ</a>

			</ul>
			<font color="white">Login Status: ${moniker}</font>
			</sugar-content>
			</sugar-page>`
	}
}
customElements.define('menu-page', MenuPage )

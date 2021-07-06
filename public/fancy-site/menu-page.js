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
			<li><a href="/group/edit">create group</a>
			</ul>

			<ul>
			<li><a href="/groups">your groups</a>
			<li><a href="/events">your events</a>
			<li><a href="/worlds">your worlds</a>
			<li><a href="/artifacts">your artifacts</a>
			</ul>

			<ul>
			<li><a href="/profile">profile</a>
			<li><a href="/settings">settings</a>
			<li><a href="/signout">go to signout</a>
			</ul>

			<ul>
			<li><a href="/about">📜 About</a>
			<li><a href="/terms">📜 Terms</a>
			<li><a href="/privacy">📜 Privacy</a>
			<li><a href="/faq">📜 FAQ</a>
			</ul>

			<font color="white">Login Status: ${moniker}</font>
			</sugar-content>
			</sugar-page>

<sticky-note contenteditable="true">
<h2>About the Menu</h2>
<br/>
It is easier for users to consolidate actions in one page rather than scattering powers all over.
</sticky-note>


			`
	}
}
customElements.define('menu-page', MenuPage )

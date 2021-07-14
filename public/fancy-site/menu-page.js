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
			<li><a href="/group/create">create group</a>
			</ul>

			<ul>
			<li><a href="/groups">your groups</a>
			<li><a href="/worlds">your worlds</a>
			<li><a href="/artifacts">your artifacts</a>
			</ul>

			<ul>
			<li><a href="/profile">profile</a>
			<li><a href="/avatar">avatar</a>
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
<h2>About this Menu</h2>
<br/>
For convenience most powers can be accessed here.
<br/>
<br/>
Groups are the main organizing principle. You may be a member of multiple groups and there may be public groups you can join.
<br/>
<br/>
Worlds will be a list of rooms that you can use when creating activities in a Group.
<br/>
<br/>
Artifacts is an idea that you may have some of your own artifacts that you can carry around.
</sticky-note>


			`
	}
}
customElements.define('menu-page', MenuPage )

export class SplashPage extends HTMLElement {
	connectedCallback() {
		let party = Services.currentParty
		let moniker = party ? party.displayName : 0
		this.className="sugar-page"
		this.innerHTML =
			`<div class='sugar-content'>
				<h1>Hello World!</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li style="display:${moniker?"none":"normal"}"><a href="/login">go to login</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/profile">go to your page</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/signout">go to signout</a>
				</ul>
				<font color="white">Login Status: ${moniker}</font>
			</div>`
	}
}
customElements.define('splash-page', SplashPage )
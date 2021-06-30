export class SplashPage extends HTMLElement {
	connectedCallback() {
		let party = Services.currentParty
		let moniker = party ? party.displayName : 0
		this.className="sugar-page"
		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>Hello World!</h1>
					<br/>
					Actions you may take here:
					<ul>
						<li style="display:${moniker?"none":"normal"}"><a href="/login">go to login</a>
						<li style="display:${moniker?"normal":"none"}"><a href="/profile">go to your page</a>
						<li style="display:${moniker?"normal":"none"}"><a href="/signout">go to signout</a>
					</ul>
					<font color="white">Login Status: ${moniker}</font>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('splash-page', SplashPage )

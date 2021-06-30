export class PartySignoutPage extends HTMLElement {
	connectedCallback() {
		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>You have been signed out</h1>
					<br/>
					Actions you may take here:
					<ul>
						<li><a href="/">return to home page</a>
						<li><a href="/login">go to login</a>
					</ul>
				</sugar-content>
			</sugar-page>`

		Services.db.signout()
	}
}
customElements.define('party-signout-page', PartySignoutPage )



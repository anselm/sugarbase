export class PartySignoutPage extends HTMLElement {
	connectedCallback() {
		this.className="sugar-page"
		this.innerHTML =
			`<div class='sugar-content'>
				<h1>You have been signed out</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li><a href="/">return to home page</a>
					<li><a href="/login">go to login</a>
				</ul>
			</div>`
		Services.signout()
	}
}
customElements.define('party-signout-page', PartySignoutPage )



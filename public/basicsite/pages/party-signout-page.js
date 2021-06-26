
class PartySignoutPage extends HTMLElement {
	connectedCallback() {
		this.className="page"
		this.innerHTML =
			`
			<div class='subpage' style="background:rgba(255,255,255,0.7);font-size:2em;">
				<h1>You have been signed out</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li><a href="/">return to home page</a>
					<li><a href="/login">go to login</a>
				</ul>
			</div>
			`

		Services.signout()
	}
}

customElements.define('party-signout-page', PartySignoutPage )



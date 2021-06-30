
export class PartyLoginPage extends HTMLElement {
	connectedCallback() {
		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>You have been logged in</h1>
					<br/>
					Actions you may take here:
					<ul>
						<li><a href="/">go to splash page</a>
						<li><a href="/profile">go to your profile page</a>
						<li><a href="/signout">go to signout</a>
					</ul>
				</sugar-content>
			</sugar-page>`
		Services.db.login({id:1000,displayName:"Blake Jenkins"})
	}
}

customElements.define('party-login-page', PartyLoginPage )


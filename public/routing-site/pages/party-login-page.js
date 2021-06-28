
export class PartyLoginPage extends HTMLElement {
	connectedCallback() {
		this.className="sugar-page"
		this.innerHTML =
			`<div class='sugar-content'>
				<h1>You have been logged in</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li><a href="/">go to splash page</a>
					<li><a href="/profile">go to your profile page</a>
					<li><a href="/signout">go to signout</a>
				</ul>
			</div>
			`
		Services.login()
	}
}

customElements.define('party-login-page', PartyLoginPage )


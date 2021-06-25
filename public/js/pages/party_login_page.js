
class PartyLoginPage extends HTMLElement {
	componentWillShow() {
		this.className="page"
		this.innerHTML =
			`
			<div class='subpage' style="background:rgba(255,255,255,0.7);font-size:2em;">
				<h1>You have been logged in</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li><a href="/">go to home page</a>
					<li><a href="/party">go to your page</a>
					<li><a href="/party/signout">go to signout</a>
				</ul>
			</div>
			`
		window.appstate.login()
	}
}

customElements.define('party-login-page', PartyLoginPage )

router.add("login", "party-login-page")


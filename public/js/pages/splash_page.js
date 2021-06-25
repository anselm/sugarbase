
class SplashPage extends HTMLElement {
	componentWillShow() {
		this.className="page"

		let moniker = window.appstate.currentParty ? window.appstate.currentParty.moniker : 0

		this.innerHTML =
			`
			<div class='subpage' style="background:rgba(255,255,255,0.7);font-size:2em;">
				<h1>Hello World!</h1>
				<br/>
				Actions you may take here:
				<ul>
					<li style="display:${moniker?"none":"normal"}"><a href="/party/login">go to login</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/party">go to your page</a>
					<li style="display:${moniker?"normal":"none"}"><a href="/party/signout">go to signout</a>
				</ul>
				<font color="white">Login Status: ${moniker}</font>
			</div>
			`
	}
}

customElements.define('splash-page', SplashPage )

router.add("splash", "splash-page")

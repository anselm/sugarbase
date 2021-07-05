
export class SugarLoginPage extends SugarElement {
	constructor(args) {
		super()
		this.login = args.login
		this.userinfo = {}
	}
	render() {
		let onclick=()=>{
			console.log(this.userinfo)
			this.login(this.userinfo)
		}
		let oninput = (e) => {
			this.userinfo[e.target.id] = e.target.value
		}

		return htmlify`<sugar-page>
				<sugar-content>
					<h1>Login</h1>
					<br/>
					<h3>name</h3>
					<input id="name" oninput=${oninput}></input>
					<h3>password</h3>
					<input type=password id="password" oninput=${oninput}></input>
					<button id="submit" onclick=${onclick}>submit</button>
				</sugar-content>
			</sugar-page>`
	}
}

customElements.define('sugar-login-page', SugarLoginPage )


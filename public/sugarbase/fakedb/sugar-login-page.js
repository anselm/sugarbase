
///
/// Bare bones authentication example for a traditional name/password
/// The caller should inject properties .nextpage and .authenticate
///

export class SugarLoginPage extends SugarElement {
	render() {
		if(!this.authenticate) throw "Authentication handler should be injected"
		let oninput = (e)=>{ this[e.target.id] = e.target.value }
		let onclick = (e)=>{
			this.authenticate({name:this.name,password:this.password}).then( (results)=>{
				window.history.pushState({},this.nextpage||"/",this.nextpage||"/")
			}).catch(err=>{
				// TODO redraw with error
			})
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



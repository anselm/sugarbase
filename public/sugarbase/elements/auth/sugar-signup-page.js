
export class SugarSignupPage extends HTMLElement {
	connectedCallback() {
		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>Login</h1>
					<br/>
					<h3>name</h3>
					<input id="name"></input>
					<h3>password</h3>
					<input id="password"></input>
					<button id="submit"></button>
				</sugar-content>
			</sugar-page>`
		this.querySelector("button").onclick= ()=>{
			Services.db.login({id:1000,displayName:"Blake Jenkins"})
				window.history.pushState({},"/","/")
		}
	}
}

customElements.define('sugar-signup-page', SugarSignupPage )


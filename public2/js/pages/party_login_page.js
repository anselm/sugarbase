
class PartyLoginPage extends HTMLElement {
	componentWillShow() {
		this.className="page"
		this.innerHTML =
			`<div class='subpage' style="background:rgba(255,255,255,0.7);font-size:2em;">
			<div id="firebaseui-auth-container"></div>
			</div>
			`

		let authinfo = this.querySelector("#firebaseui-auth-container")

		var uiConfig = {
			credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
			tosUrl: '/terms',
			privacyPolicyUrl: '/privacy',
			signInFlow: 'popup',
			signInSuccessUrl: "/",
			callbacks: {
				signInSuccessWithAuthResult: (authResult, redirectUrl) => {
					document.location.href = "/"
					return false;
				},
				signInFailure: (error) => {
					console.error("login: sad login")
					console.error(error)
				},
				uiShown: () => {
				}
			},
			signInOptions: [
				{
					provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
					signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
					forceSameDevice: false,
					emailLinkSignIn: function() {
						return {
							url: 'https://sugarbase99.web.app',
						}
					},
				},
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				//firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
				firebase.auth.FacebookAuthProvider.PROVIDER_ID,
				firebase.auth.TwitterAuthProvider.PROVIDER_ID,
				firebase.auth.GithubAuthProvider.PROVIDER_ID,
				firebase.auth.PhoneAuthProvider.PROVIDER_ID
			],
		}

		if(!window.appstate.currentParty && !this.latch) {
			this.latch = 1
			var ui = new firebaseui.auth.AuthUI(firebase.auth())
			ui.start('#firebaseui-auth-container', uiConfig )
		}

	}

}

customElements.define('party-login-page', PartyLoginPage )

router.add("login", "party-login-page")


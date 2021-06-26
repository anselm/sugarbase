
import "https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.js"

// css - you may want to statically declare these in header to reduce flickering

let url = "https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css"
document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="${url}">`

class PartyLoginFirebasePage extends HTMLElement {

	connectedCallback() {

		this.className="sugar-page"
		this.innerHTML =
			`<div class='sugar-content'>
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

		if(!this.ui) {
			this.ui = new firebaseui.auth.AuthUI(firebase.auth())
		}
		if(!Services.currentParty) {
			this.ui.start('#firebaseui-auth-container', uiConfig )
		}

	}

}

customElements.define('party-login-firebase-page', PartyLoginFirebasePage )


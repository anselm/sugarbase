///
/// Typically a developer will have some application state somewhere... here are some of my practices:
///
/// I like to make that state a global resource
/// I tend to also not mix display and control (MVC pattern). This layer should not know HTML exists as a concept at all.
/// I often do my own reactivity scheme; this here is just an example; https://mobx.js.org is also nice.
///

window.appstate = {

	realstate:{},
	observers:{},
	observerid:0,

	///
	/// a custom simple reactivity / observability pattern
	///

	observe: function(name,callback) {
		this.observerid++;
		let scope = this
		if(!this.realstate.hasOwnProperty(name)) {
			this.realstate[name] = 0
			Object.defineProperty(scope,name,{
				get: function() { return scope.realstate[name] },
				set: function(value) {
					scope.realstate[name] = value
					if(!scope.observers[name]) return
					scope.observers[name].forEach( callback => { callback(); })
				}
			})
		}
		if(!this.observers[name]) this.observers[name] = []
		let obs = this.observers[name]
		obs[this.observerid] = callback
		return this.observerid
	},

	/// business logic

	signout: function() {
		this.firebase.auth().signOut()
		this.currentParty = 0
	},

	startup: async function(callback) {
		this.firebase = firebase
		this.firestore = firebase.firestore()
		firebase.auth().onAuthStateChanged(user => {
			console.log("User state change from firebase")
			console.log(user)
			this.currentParty = user
			callback()
		});
	}
}



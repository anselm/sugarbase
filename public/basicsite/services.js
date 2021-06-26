
window.Services = {

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

	login: function() {
		this.currentParty = {displayName:"george"}
	},

	signout: function() {
		this.currentParty = 0
	},

	startup: async function(callback) {
		this.currentParty = 0
		callback()
	}
}


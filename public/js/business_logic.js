///
/// Typically a developer will have some application state somewhere...
/// I like to make appstate a global resource
/// I tend to also throw all non display work here
/// And also I do my own reactivity scheme; this here is just an example; https://mobx.js.org is also nice
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
					console.log(value)
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
		this.currentParty = {moniker:"george"}
	},

	signout: function() {
		this.currentParty = 0
	},
}


# SugarBase JS Framework

R1 Jan 2021

SugarBase is a transparent javascript minimalist framework for building SPA (single page app) websites. No compilation phase is required, and I don't rely on the shadow dom, or a pre-parsing phase for html tags. This is designed to be programmer friendly, and it is not as designerly friendly as other frameworks.

## Examples

This repository is organized as a series of separate standalone demos where arranged from very simple capabilities such as basic routing and pages to more opinionated approaches to supporting reactivity and observables in firebase to styling, css elements and mixing 2d and 3d elements together in a page layout.

## Comparisons to React, Svelte and others

Modern web apps are demanding both visually, from a design perspective, and technically from an engineering perspective. Often a designer works in HTML, laying out and arranging the basic visual building blocks of the user experience. This can include simple things like the color of a button, but can also include complex things such as what information each page displays, transitions between pages, what to do if there is an error and so on. But these building blocks are not magically created. Behind the scenes a programmer often creates those building blocks themselves for the designer using javascript.

Tools like React help teams with both designers and coders. React exposes HTML in a fairly conventional way that is comfortable to designers, while also providing a consistent way for programmers to create new building blocks or components in a consistent way as well. Today there are thousands of libraries of useful visual widgets and components based on React, and React has been very successful as a pattern.

Despite how nice React can be in terms of providing a high level abstraction and understanding of a complex system it does have serious implementation defects. No abstraction is perfect, and it means that designers have to now often know React and HTML and Javascript. As well React itself is inefficient - it's simply attempting to abstract in a way that insulates designers from real issues. The fact is if you need to deal with procedural logic, and you need to be efficient, then you should use javascript - which exposes the right powers in the right ways. Here is a critique of React:

	https://svelte.dev/blog/virtual-dom-is-pure-overhead

Of course it’s not hard to build web apps from scratch. If you stand back and look at frameworks from a 10000 foot view the general pattern is that a framework will define either a new meta-language or a set of conventions, and often that language will be similar to patterns that typical designers and developers are expected to know. That is to say that often you’ll see some slight variation of HTML, and then some formal way of defining new components that can be expressed in HTML.

Here are a few links to a few deep dives on other frameworks and framework related issues if you are interested:

	https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
	https://css-tricks.com/creating-a-custom-element-from-scratch/
	https://lit-element.polymer-project.org/guide
	https://dev.to/jfbrennan/custom-html-tags-4788
	https://mobx.js.org/README.html
	https://preactjs.com/
	https://svelte.dev/
	https://lit.dev/

## Basic Lifecycle

1. New Component Types: New kinds of elements can be invented using an optional thin wrapper on HTMLElement. You're welcome to use observedAttributes() and attributeChangedCallback() but I tend to find them to be a fairly weak concept (cannot handle complex types, cannot set a value during construction, cannot set a default, cannot be modified) so instead we have a "defaults" concept and observers on that.

	<pre>
		class MyWidget extends SugarElement {

			// defaults
			static defaults = { color:blue }

			// props can show up here and are passed through to be stuffed into self with observer support
			constructor(props) {
				super(props)
			}

			// this is invoked by the dom when an element is connected to display; rendering is up to you
			connectedCallback() {
				render()
			}

			// invoked on disconnect; such as a page being hidden
			disconnectedCallback() {
			}

			// a state change observer on props
			propChanged() {
				this.render();
			}

			render() {
				// rendering and strategies here are up to you
				this.innerHTML = "your display"
			}
		}
	</pre>


2. Creation: elements can be instanced from javascript or from html

	let elem = new MyWidget({color:”blue”});

	// or

	document.body.innerHTML=“<my-widget color=“blue”></my-widget>”


3. Observability

	You can change trivial properties to force an event - at the moment this does not update attribute

		let widget = new Widget({color:"blue"});
		widget.color = "red"

	You cannot trigger an update from sub property change

		widget.palette.primary = "red"

	These are separate from attributes at the moment - so this is unrelated to the above:

		widget.setAttribute("color","red");

	With a database wrapper such as firebase you can attach observers to system state change - but repainting is up to you

	<pre>
		class DatabaseWidget extends SugarElement {
			connectedCallback() {
				// connected can be called more than once... up to you to decide how you want to deal with that
				if(!this.observers) {
					// in this example (using a database wrapper) a full refresh of state is triggered
					this.observers = Services.observe({table:"activity",kind:"post",offset:0,limit:10,orderby:"created"},(item)=>{
						// - if this is a delete then try find child and delete
						// - if this is an insert or update then search and see if children exist and make
						// - pass item to child as a property to paint if desired
					})
				}
			}
			disconnectedCallback() {
				// sometimes it makes sense to stop observing if not visible; it's up to you
				Services.stop(this.observers)
			}
			render() {
				// sometimes it makes sense to not bother drawing if not attached to dom
				if(!this.isConnected()) return
			}
		}
	</pre>

	Widgets that expert programmers build can be then exposed to novice html designers:

		<pre>
			<sugar-groups class="sugar-page">
				<sugar-header></sugar-header>
				<sugar-database-cards class="sugar-content" observe="groups">
					<sugar-image-card>example</sugar-image-card>
				</sugar-database-cards>
			</sugar->groups>
		</pre>


---

## *elements-site demo*

This shows off some simple elements such as cards and lists and loaders:

	1. cards
	2. lists
	3. *image loader* for adding images and sending them to a server
	4. *preview*
	5. *send to datastore* -> implementation of actually storing in a datastore
	6. *generate different scales* -> i like to generate all of the different preview sizes on client
	7. *picker* for picking from say a bunch of cards and previewing a choice

---

## *routing-site demo*

This first demo is a bare bones SPA example. I use it to articulate several of the lifecycle events around component creation and rendering and event handling. To run this demo checkout the repo and run it like below and then visit the supplied url in a browser:

	npm update
	npm start

Here's a running example:

	https://sugarbase-example.glitch.me/

Key principles here:

 - lifecycle -> articulate!
 - i find it is inexpresive to do conditional logic in html, basically might as well use js, so designers have to learn js

This layer shows a few key principles of this framework:

1. *Pages*. A SPA website typically shows one page at a time and switches between them. A page is simply an HTMLElement that is registered with the router. A page has 3 opportunities to paint its content. There is the constructor() which has some limits (see https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and there is also connectedCallback() which is invoked by the DOM when a node is added to the scene. And there is an optional method componentWillShow() that I provide (via the router) whenever the page is about to be foregrounded. There's no built-in observer pattern or react pattern provided by default, nor any shadow dom usage or so on. * Note that it's arguable if componentWillShow() is the best pattern (because it is a new method and then this diverges from vanilla HTMLElement) and another way to do this would be to use a MutationObserver but that gets bulky.

2. *Router*. The developer has to register a router.use(handler) to resolve a user specified url.

3. *Observing state change*. I do very little in terms of repainting changes to state. In this first demo I do update one element (a nav bar) dynamically based on if a (pretend) user is logged in or not but the source code for this responsiveness is visible in the app.  Note that MobX is also a good choice and there are many observability bindings out there in the wild that are quite nice that developers can use.

4. *Webpack*. I tacked in webpack although you'll have to specifically cite the bundle produced - just to show that this can be packed a bit. It is important to do this because websites can be noticably slow otherwise. In general I do try to get the first page up ASAP and I don't pre-load other pages - but it can take a while before the DOM is ready with many separate file loads.

5. *No compilation required*. It doesn't require compilation (if you don't use webpack).

---

## *firebase-site demo*

This demo builds on top of the previous demo adding new capabilities - mainly using firebase to login a user and show observability and update display elements when there are state changes.

To run this tack on ?demo=firebase onto the URL - for example:

	https://localhost:5000?demo=firebase

Of course painting the correct state is a highly desirable quality in web frameworks. Systems such as React use tools like Redux and then use the shadow DOM to effectively maintain a change list for what to repaint. Tools like MobX are a nicer alternative to Redux in some ways as well for this chore. The Svelte framework compiles your source so that it understands exactly where changes may occur. Here I push the labor to somewhat to the developer; providing some observer like abilities but requiring a developer to apply them to the right DOM elements.

You'll need to to some additional setup:

	1. Setup a firebase web app on google firebase (you can google for how to do this)
	2. Use firestore as the database (not the other similarily named-by-marketing one called realtime database)
	3. Turn on firebase hosting also
	4. "firebase login" on the command line
	5. "firebase init" on the command line
	6. "firebase deploy" or "firebase serve" to run the service locally

The demo here should allow you to login and log out and show the correct state at all times.

---

## *styles-site*

The style practice here is to have some global style elements that can be layered to apply to all objects. This is arranged like so:

* *mobile/basic* is a minimalist style foundation with these features:

	1. *large font* -> headers; tends to be somewhat idiomatic and "on brand" showing character of site
	2. *small font* -> content with an emphasis on legibility
	3. *navbar* -> a separate element that I tend to prefer to show on all screens for a consistent look
	4. *page* -> a backdrop for centering; I tend to allow overflow:auto
	5. *subpage* -> a centered column for all content, typically 800px wide; I tend to force room for nav bar
	6. *color* -> is not set at this level; default colors are used

* *bigform* bold large style inputs and buttons for capturing user input

	1. *buttons*
	2. *input* -> for inputting text
	3. *radio* -> radio and other buttons are not provided

* *cards* for card centric layout styles - with these features:

	1. *sizes* -> from tiny to large
	2. *role* -> visual hints to indicate if interactive or passive or if a primary call out or a response
	3. *tiling* -> various ways of arranging cards
	4. *observable* -> efficiently updating displayed card lists based on state change on server

TODO
	- perhaps provide example app here of these
	- Cards can be built out in more depth with various kinds of cards in more detail - see https://rebassjs.org/

* *color/springtime* is a set of color choices that styles the above style sets

* *color/warnings* colors for alerts and buttons to indicate safe and dangerous actions

TODO perhaps provide example app here of layering these
TODO add dark mode

* *card-effects* for card related effects

* *effect-general* various general transitions and effects

* *effect-loading* a loading effect

TODO
	- I wouldn't mind exploring fun effects in far more depth;
	- ie; recreate things like https://www.domestika.org/en/courses/1373-psychedelic-animation-with-photoshop-and-after-effect

	- Also may be worth just enumerating practical transitions and effects:
	- also : https://www.youtube.com/watch?v=YHQ820W8FRw

---

## *three-site*

* *3d* for picking from 3d objects and snapshotting them as images

* *3d map* for floating 3d objects on a map

TODO add examples

---

## *cms-site*

Here is a sketch of a typical full blown data driven back end content management website with:

	1. A splash page
	2. Login
	3. Logout
	4. A logged in home page of some kind that enumerates powers
	5. Content page; show a list of content that was created and allow sorting; using card layouts
	6. Content Creation / Edit page; create a new content, including images.
	7. Content detail; examine a content and possibly delete it.
	8. Upload images
	9. Layout collections

TODO build


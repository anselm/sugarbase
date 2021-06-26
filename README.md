# SugarBase JS Framework

R1 Jan 2021

SugarBase is a javascript minimalist framework for building SPA (single page app) websites. This framework is simpler than say preact or svlelte. No compilation phase is required, and I don't rely on the shadow dom.

This repository is organized as a series of separate standalone demos where arranged from very simple capabilities such as basic routing and pages to more opinionated approaches to supporting reactivity and observables in firebase to styling, css elements and mixing 2d and 3d elements together in a page layout in a performant way.

---

## SimpleSite Demo

This shows off a bare bones SPA framework example. It runs by default. To run this demo checkout the repo and run it like below and then visit the supplied url in a browser:

	npm update
	npm start

Here's a running example:

	https://sugarbase-example.glitch.me/

This layer shows a few key principles of this framework:

1. *Pages*. A SPA website typically shows one page at a time and switches between them. A page is simply an HTMLElement that is registered with the router. A page has 3 opportunities to paint its content. There is the constructor() which has some limits (see https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and there is also connectedCallback() which is invoked by the DOM when a node is added to the scene. And there is an optional method componentWillShow() that I provide (via the router) whenever the page is about to be foregrounded. There's no built-in observer pattern or react pattern provided by default, nor any shadow dom usage or so on. * Note that it's arguable if componentWillShow() is the best pattern (because it is a new method and then this diverges from vanilla HTMLElement) and another way to do this would be to use a MutationObserver but that gets bulky.

2. *Router*. The developer has to register a router.use(handler) to resolve a user specified url.

3. *Observing state change*. I do very little in terms of repainting changes to state. In this first demo I do update one element (a nav bar) dynamically based on if a (pretend) user is logged in or not but the source code for this responsiveness is visible in the app.  Note that MobX is also a good choice and there are many observability bindings out there in the wild that are quite nice that developers can use.

4. *Webpack*. I tacked in webpack although you'll have to specifically cite the bundle produced - just to show that this can be packed a bit. It is important to do this because websites can be noticably slow otherwise. In general I do try to get the first page up ASAP and I don't pre-load other pages - but it can take a while before the DOM is ready with many separate file loads.

5. *No compilation required*. It doesn't require compilation (if you don't use webpack).

---

## Firebase Demo

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

## Style

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

* *card-effects* for card related effects

* *effect-general* various general transitions and effects

* *effect-loading* a loading effect

## Colors

* *color/springtime* is a set of color choices that styles the above style sets

* *color/warnings* colors for alerts and buttons to indicate safe and dangerous actions

## Widgets

* *image loader* for adding images and sending them to a server

	1. *preview*
	2. *send to firebase* -> implementation of actually storing in firebase (firestore)
	3. *generate different scales* -> i like to generate all of the different preview sizes on client

* *picker* for picking from say a bunch of cards and previewing a choice

## Typical Site

Here is a sketch of a typical full blown website with:

	1. A splash page
	2. Login
	3. Logout
	4. A logged in home page of some kind that enumerates powers
	5. Content page; show a list of content that was created and allow sorting
	6. Content Creation / Edit page; create a new content.
	7. Content detail; examine a content and possibly delete it.


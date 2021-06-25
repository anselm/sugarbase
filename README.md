# SugarBase JS Framework

R1 Jan 2021

SugarBase is a javascript framework for SPA apps with these features:

1. Not reactive.
2. Does not need to be compiled; is pure js.
3. "Pages" are pure HTMLElements where you have to write all your layout yourself.
4. Router routes between registered pages, showing only one page at a time.
5. Router intercepts all hyperlink clicks and switches to the relevant page.
6. Router uses "/" paths rather than "#" paths.
7. Router decorates page with "hidden" css class rather than relying on element.visible which doesn't always work

There are three separate demos here:

1. Demo 1 -> delivering a basic SPA service
2. Demo 2 -> delivering some opinions around handling input forms, table layouts and CSS style.
3. Demo 3 -> delivering opinions around integration with Firebase and reactivity overall

---

## Demo #1 - getting started

Here's how to run this demo:

git checkout ...
cd into the folder
npm update
npm start [mode:nothing,css,firebase]

And here's a running example that should be stable on the net for a while

https://sugarbase-example.glitch.me/

## Demo #1: The concept of "Pages"

SugarBase only shows one "page" at a time and hides the rest. See /public/js/pages for examples.

SugarBase does not have any reactive features built in - pages and page contents don't get "triggered" or "refreshed" or "updated" in the background by any state change.

HTMLElements in pure javascript are used to represent a page. This is largely built in to modern browsers and although there is a bit of extra extension support with componentWillShow() this is otherwise largely vanilla. 

## Demo #1: Components

Fragments are also HTMLElements... there is nothing magical about them. Use at will. See /public/js/components for examples.

## Demo #1: Routing

Routing is the cornerstone of the app. To start the router make an instance of it and call reset. This forces it to attempt to produce the current URL. To go to a page you build a hyper link to it... all links are intercepted. The router itself is at /public/js/router.js ... typically I include it in index.html and then I register my pages with it. Also you need to register custom routes

Note that it's a design choice that all routes are evaluated by route.use( yourfunction ). I personally enjoy having short form routes that resolve on dynamic database queries rather than static routes such as /username instead of /user?name=blah . It can take a bit of design thinking about your routes overall because there is more possibility of collision of namespaces when you do this but but it is a nicer experience for the user.

## Demo #1: Reactions to state change

For Demo 1 I do very little in terms of repainting changes to state. I only update the nav bar dynamically based on if a user is logged in or not. I have a small observer capability built directly into business_logic.js in the js folder. Note that MobX is also a good choice and there are many observability bindings out there in the wild as well that are quite nice - and fancier that what I am doing - you can also switch to those.

---

## Demo 2: Firebase 

For this demo I now integrate with firebase and provide a bit richer examples of observability / reactions. Of course painting the correct state is a highly desirable quality in web frameworks. But often state can change often and it can be a hassle to repaint a page. Traditional systems such as React use tools like Redux and then use the shadow DOM and look for deltas or differences between what is presented and what is not presented to repaint the layout on changes. A main point of this SPA system is that I do this somewhat more directly in code rather than with wrappers.

You'll need to to some additional setup:

	1. Setup a firebase web app on google firebase (you can google for how to do this)
	2. Use firestore as the database (not the other similarily named-by-marketing one called realtime database)
	3. Turn on firebase hosting also
	4. "firebase login" on the command line
	5. "firebase init" on the command line
	6. "firebase deploy" or "firebase serve" to run the service locally

This should now support proper login backed by the cloud.

---

## Demo 3: Handling Input and Style with reactivity

Demo 1: I do use a concept of "class hidden" but otherwise this framework doesn't think about CSS or do any input.

Demo 2: I present some opinions on handling inputs and styling outputs with CSS. My own practice is to have a few different CSS files, one for absolute bare bones global elements, and then a few for differences that are increasingly specialized. This way I can layer CSS together to produce a final effect. I also have some opinions around button styles more complex form handling.


# SugarBase JS Framework
R1 July 2021

# Overview

SugarBase is a yet another javascript minimalist framework for building SPA (single page app) web experiences riffing on the React/Preact model of a JSX dom parser and components. No compilation phase is required and it doesn't try to optimize rewrites to the dom. There's a strong emphasis on useful components, back end firebase integration and 3d widgets.

## Running

I've built a couple of examples to show off elements (such as routing, pages, forms, lists, 3d widgets):

You can see this running if you visit:

	https://sugarbase-example.glitch.me/

Also there is a /basic-site.html that you can examine if you want to see a simpler example (view source helps also):

	https://sugarbase-example.glitch.me/basic-site.html

Or you can fetch it run it yourself:

	open a shell window or bring up git somehow
	git checkout https://github.com/anselm/sugarbase
	cd sugarbase
	npm update
	npm start
	visit https://localhost:3456/

There is a firebase demo as well that you can run separately. You'll need to to some additional setup:

	1. Setup a firebase web app on google firebase (you can google for how to do this)
	2. Use firestore as the database (not the other similarily named-by-marketing one called realtime database)
	3. Turn on firebase hosting also
	4. "firebase login" on the command line
	5. "firebase init" on the command line
	6. "firebase deploy" or "firebase serve" to run the service locally

The firebase demo should allow you to login and log out and show the correct state at all times persistently.

## Other docs

This is very much a work in progress. There's nothing like an API document - only examples. Some of the other thinking can be found here:

[Theory](docs/theory.md)
[Practices](docs/practices.md)
[Data Models](docs/datamodels.md)


// todo may delete this example

// example services layer and data
import '/sugarbase/db/data-services.js'
import '/sugarbase/db/data-somedata.js'

// elements used here
import "/sugarbase/elements/sugar-element.js"
import "/sugarbase/elements/sugar-collection.js"
import "/sugarbase/elements/sugar-sigil.js"
import "/sugarbase/elements/sugar-card.js"
import '/sugarbase/elements/sugar-form.js'

// run

export async function run() {
	htmlify2dom(document.body,
		htmlify`
			<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-mobile.css" />
			<link type="text/css" rel="stylesheet" href="/sugarbase/style/sugar-forms-large.css" />
			<sugar-page>
				<sugar-content>
					<h1>A collection example</h1>
					<sugar-form></sugar-form>
					<sugar-collection
						db=${Services.observe.bind(Services)}
						query=${{table:"event"}}
						card="sugar-card">
					</sugar-collection>
				</sugar-content>
			</sugar-page>`
	)
}

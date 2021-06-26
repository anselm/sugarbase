
export let LoadCSS = (url) => {
	return new Promise((resolve, reject) => {
		let link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.onload = resolve
		link.setAttribute("href", url);
		link.href = url;
		document.head.appendChild(link);
	});
}

export function LoadCSSMany(urls=[],settletime=100){
	return new Promise((resolve, reject)=>{
		Promise.all(urls.map(async url => await LoadCSS(url))).then(()=>{
			setTimeout(()=>{
				resolve()
			},settletime)
		})
	})
}


(function(self){
	"use strict";
	const CACHE_NAME="online-text-editor";
	const CACHE_VERSION="v1.0";
	self.addEventListener("fetch",function(event){
		event.respondWith(caches.match(event.request).then(function(response){
			if(response!=undefined){
				return response;
			}
			return fetch(event.request);
		}));
	},false);
	self.addEventListener("install",function(event){
		event.waitUntil(caches.open(`${CACHE_NAME}-${CACHE_VERSION}`).then(function(cache){
			return cache.addAll([
				"/re-frain-org.github.io/res/app.css",
				"/re-frain-org.github.io/res/app.js",
				`/re-frain-org.github.io/${CACHE_NAME}/index.html`,
				`/re-frain-org.github.io/${CACHE_NAME}/script.js`,
				`/re-frain-org.github.io/${CACHE_NAME}/style.css`
			]);
		}));
	},false);
})(this);

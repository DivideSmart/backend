!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=772)}({772:function(e,n,t){"use strict";var r=["/","/static/bundle/main/index.js"];self.addEventListener("install",function(e){e.waitUntil(caches.open("weshare-0.0.1").then(function(e){return console.log("SW: installed and cache data"),e.addAll(r).then(function(){return self.skipWaiting()})}))}),self.addEventListener("activate",function(e){console.log("SW: active and control this domain"),e.waitUntil(self.clients.claim().then(function(){caches.keys().then(function(e){return Promise.all(e.map(function(e){if("weshare-0.0.1"!==e)return console.log("SW: clearing old cache"),caches.delete(e)}))})}))}),self.addEventListener("fetch",function(e){e.request.url.includes("login")||"GET"!=e.request.method||e.respondWith(fetch(e.request).then(function(n){var t=n.clone();return(e.request.url.includes("/static/")||e.request.url.includes("/api/"))&&caches.open("weshare-0.0.1").then(function(n){n.put(e.request.url,t)}),n}).catch(function(n){return caches.open("weshare-0.0.1").then(function(n){return n.match(e.request.url)}).then(function(t){return t?(console.log("SW offline: hit  -  "+e.request.url),t):n})}))})}});
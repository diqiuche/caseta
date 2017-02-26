!(function(){"use strict";function e(e){return{type:"auth",api_password:e}}function t(){return{type:"get_states"}}function n(){return{type:"get_config"}}function r(){return{type:"get_services"}}function i(){return{type:"get_panels"}}function s(e,t,n){var r={type:"call_service",domain:e,service:t};return n&&(r.service_data=n),r}function o(e){var t={type:"subscribe_events"};return e&&(t.event_type=e),t}function u(e){return{type:"unsubscribe_events",subscription:e}}function c(){return{type:"ping"}}function a(e,t){return{type:"result",success:!1,error:{code:e,message:t}}}function d(t,n){function r(i,s,o){var u=new WebSocket(t),c=!1,a=function(){if(c)return void o(C);if(0===i)return void o(O);var e=i===-1?-1:i-1;setTimeout((function(){return r(e,s,o)}),1e3)},d=function(t){var r=JSON.parse(t.data);switch(r.type){case"auth_required":"authToken"in n?u.send(JSON.stringify(e(n.authToken))):(c=!0,u.close());break;case"auth_invalid":c=!0,u.close();break;case"auth_ok":u.removeEventListener("message",d),u.removeEventListener("close",a),s(u)}};u.addEventListener("message",d),u.addEventListener("close",a)}return new Promise(function(e,t){return r(n.setupRetry||0,e,t)})}function f(e){return e.result}function v(e,t){return void 0===t&&(t={}),d(e,t).then((function(n){var r=new j(e,t);return r.setSocket(n),r}))}function h(e,t){return e._subscribeConfig?e._subscribeConfig(t):new Promise(function(n,r){function i(e){a=Object.assign({},a,e);for(var t=0;t<f.length;t++)f[t](a)}function s(e){if(null!==a){var t=Object.assign({},a.core,{components:a.core.components.concat(e.data.component)});i({core:t})}}function o(e){if(null!==a){var t,n=e.data,r=n.domain,s=n.service,o=Object.assign({},a.services[r]||{},(t={},t[s]={description:"",fields:{}},t));i({services:Object.assign({},a.services,(u={},u[r]=o,u))});var u}}function u(){return Promise.all([e.getConfig(),e.getPanels(),e.getServices()]).then((function(e){var t=e[0],n=e[1],r=e[2];i({core:t,panels:n,services:r})}))}function c(e){e&&f.splice(f.indexOf(e),1),0===f.length&&d()}var a=null,d=null,f=[],v=null;t&&f.push(t),e._subscribeConfig=function(e){return e&&(f.push(e),null!==a&&e(a)),v.then((function(){return function(){return c(e)}}))},v=Promise.all([e.subscribeEvents(s,"component_loaded"),e.subscribeEvents(o,"service_registered"),u()]),v.then((function(r){var i=r[0],s=r[1];d=function(){removeEventListener("ready",u),i(),s()},e.addEventListener("ready",u),n((function(){return c(t)}))}),(function(){return r()}))})}function l(e){for(var t={},n=0;n<e.length;n++){var r=e[n];t[r.entity_id]=r}return t}function p(e,t){var n=Object.assign({},e);return n[t.entity_id]=t,n}function b(e,t){var n=Object.assign({},e);return delete n[t],n}function g(e,t){return e._subscribeEntities?e._subscribeEntities(t):new Promise(function(n,r){function i(e){if(null!==u){var t=e.data,n=t.entity_id,r=t.new_state;u=r?p(u,r):b(u,n);for(var i=0;i<a.length;i++)a[i](u)}}function s(){return e.getStates().then((function(e){u=l(e);for(var t=0;t<a.length;t++)a[t](u)}))}function o(t){t&&a.splice(a.indexOf(t),1),0===a.length&&(c(),e.removeEventListener("ready",s),e._subscribeEntities=null)}var u=null,c=null,a=[],d=null;t&&a.push(t),e._subscribeEntities=function(e){return e&&(a.push(e),null!==u&&e(u)),d.then((function(){return function(){return o(e)}}))},d=Promise.all([e.subscribeEvents(i,"state_changed"),s()]),d.then((function(r){var i=r[0];c=i,e.addEventListener("ready",s),n((function(){return o(t)}))}),(function(){return r()}))})}function m(e){return e.substr(0,e.indexOf("."))}function y(e){return e.substr(e.indexOf(".")+1)}function _(e,t){var n={};return t.attributes.entity_id.forEach((function(t){var r=e[t];r&&(n[r.entity_id]=r)})),n}function w(e){var t=[],n={};return Object.keys(e).forEach((function(r){var i=e[r];"group"===m(r)?t.push(i):n[r]=i})),t.sort((function(e,t){return e.attributes.order-t.attributes.order})),t.forEach((function(e){return e.attributes.entity_id.forEach((function(e){delete n[e]}))})),{groups:t,ungrouped:n}}function E(e,t){var n={};return t.attributes.entity_id.forEach((function(t){var r=e[t];if(r&&!r.attributes.hidden&&(n[r.entity_id]=r,"group"===m(r.entity_id))){var i=_(e,r);Object.keys(i).forEach((function(e){var t=i[e];t.attributes.hidden||(n[e]=t)}))}})),n}function k(e){var t=[];return Object.keys(e).forEach((function(n){var r=e[n];r.attributes.view&&t.push(r)})),t.sort((function(e,t){return e.entity_id===P?-1:t.entity_id===P?1:e.attributes.order-t.attributes.order})),t}var O=1,C=2,L=3,j=function(e,t){this.url=e,this.options=t||{},this.commandId=1,this.commands={},this.eventListeners={},this.closeRequested=!1,this._handleMessage=this._handleMessage.bind(this),this._handleClose=this._handleClose.bind(this)};j.prototype.setSocket=function(e){var t=this,n=this.socket;if(this.socket=e,e.addEventListener("message",this._handleMessage),e.addEventListener("close",this._handleClose),n){var r=this.commands;this.commandId=1,this.commands={},Object.keys(r).forEach((function(e){var n=r[e];n.eventType&&t.subscribeEvents(n.eventCallback,n.eventType).then((function(e){n.unsubscribe=e}))})),this.fireEvent("ready")}},j.prototype.addEventListener=function(e,t){var n=this.eventListeners[e];n||(n=this.eventListeners[e]=[]),n.push(t)},j.prototype.removeEventListener=function(e,t){var n=this.eventListeners[e];if(n){var r=n.indexOf(t);r!==-1&&n.splice(r,1)}},j.prototype.fireEvent=function(e){var t=this;(this.eventListeners[e]||[]).forEach((function(e){return e(t)}))},j.prototype.close=function(){this.closeRequested=!0,this.socket.close()},j.prototype.getStates=function(){return this.sendMessagePromise(t()).then(f)},j.prototype.getServices=function(){return this.sendMessagePromise(r()).then(f)},j.prototype.getPanels=function(){return this.sendMessagePromise(i()).then(f)},j.prototype.getConfig=function(){return this.sendMessagePromise(n()).then(f)},j.prototype.callService=function(e,t,n){return this.sendMessagePromise(s(e,t,n))},j.prototype.subscribeEvents=function(e,t){var n=this;return this.sendMessagePromise(o(t)).then((function(r){var i={eventCallback:e,eventType:t,unsubscribe:function(){return n.sendMessagePromise(u(r.id)).then((function(){delete n.commands[r.id]}))}};return n.commands[r.id]=i,function(){return i.unsubscribe()}}))},j.prototype.ping=function(){return this.sendMessagePromise(c())},j.prototype.sendMessage=function(e){this.socket.send(JSON.stringify(e))},j.prototype.sendMessagePromise=function(e){var t=this;return new Promise(function(n,r){t.commandId+=1;var i=t.commandId;e.id=i,t.commands[i]={resolve:n,reject:r},t.sendMessage(e)})},j.prototype._handleMessage=function(e){var t=JSON.parse(e.data);switch(t.type){case"event":this.commands[t.id].eventCallback(t.event);break;case"result":t.success?this.commands[t.id].resolve(t):this.commands[t.id].reject(t.error),delete this.commands[t.id];break;case"pong":}},j.prototype._handleClose=function(){var e=this;if(Object.keys(this.commands).forEach((function(t){var n=e.commands[t],r=n.reject;r&&r(a(L,"Connection lost"))})),!this.closeRequested){this.fireEvent("disconnected");var t=Object.assign({},this.options,{setupRetry:0}),n=function(r){setTimeout((function(){d(e.url,t).then((function(t){return e.setSocket(t)}),(function(){return n(r+1)}))}),1e3*Math.min(r,5))};n(0)}};var P="group.default_view",S=Object.freeze({ERR_CANNOT_CONNECT:O,ERR_INVALID_AUTH:C,createConnection:v,subscribeConfig:h,subscribeEntities:g,getGroupEntities:_,splitByGroups:w,getViewEntities:E,extractViews:k,extractDomain:m,extractObjectId:y});window.HAWS=S,window.HASS_DEMO=!1;var M=window.createHassConnection=function(e){var t="https:"===window.location.protocol?"wss":"ws",n=t+"://"+window.location.host+"/api/websocket",r={setupRetry:10};return void 0!==e&&(r.authToken=e),v(n,r).then((function(e){return g(e),h(e),e}))};window.noAuth?window.hassConnection=M():window.localStorage.authToken?window.hassConnection=M(window.localStorage.authToken):window.hassConnection=null,"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/service_worker.js")}))})();
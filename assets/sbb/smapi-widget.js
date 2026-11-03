(function(e){typeof define==`function`&&define.amd?define([],e):e()})(function(){var e=(e,t)=>()=>(e&&(t=e(e=0)),t),t=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),n=e((()=>{})),r=e((()=>{}));function i(e,t,n,r,i,a){function o(e){if(e!==void 0&&typeof e!=`function`)throw TypeError(`Function expected`);return e}for(var s=r.kind,c=s===`getter`?`get`:s===`setter`?`set`:`value`,l=!t&&e?r.static?e:e.prototype:null,u=t||(l?Object.getOwnPropertyDescriptor(l,r.name):{}),d,f=!1,p=n.length-1;p>=0;p--){var m={};for(var h in r)m[h]=h===`access`?{}:r[h];for(var h in r.access)m.access[h]=r.access[h];m.addInitializer=function(e){if(f)throw TypeError(`Cannot add initializers after decoration has completed`);a.push(o(e||null))};var g=(0,n[p])(s===`accessor`?{get:u.get,set:u.set}:u[c],m);if(s===`accessor`){if(g===void 0)continue;if(typeof g!=`object`||!g)throw TypeError(`Object expected`);(d=o(g.get))&&(u.get=d),(d=o(g.set))&&(u.set=d),(d=o(g.init))&&i.unshift(d)}else (d=o(g))&&(s===`field`?i.unshift(d):u[c]=d)}l&&Object.defineProperty(l,r.name,u),f=!0}function a(e,t,n){for(var r=arguments.length>2,i=0;i<t.length;i++)n=r?t[i].call(e,n):t[i].call(e);return r?n:void 0}var o=e((()=>{})),s,c=e((()=>{s=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer((()=>{customElements.define(e,t)}))}})),l,u,d,f,p,m,h,g,_,v=e((()=>{l=globalThis,u=l.ShadowRoot&&(l.ShadyCSS===void 0||l.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,d=Symbol(),f=new WeakMap,p=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==d)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(u&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=f.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&f.set(t,e))}return e}toString(){return this.cssText}},m=e=>new p(typeof e==`string`?e:e+``,void 0,d),h=(e,...t)=>new p(e.length===1?e[0]:t.reduce(((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1]),e[0]),e,d),g=(e,t)=>{if(u)e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(let n of t){let t=document.createElement(`style`),r=l.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},_=u?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return m(t)})(e):e})),y,b,x,S,C,ee,w,T,te,ne,E,D,O,re,k,ie=e((()=>{v(),{is:y,defineProperty:b,getOwnPropertyDescriptor:x,getOwnPropertyNames:S,getOwnPropertySymbols:C,getPrototypeOf:ee}=Object,w=globalThis,T=w.trustedTypes,te=T?T.emptyScript:``,ne=w.reactiveElementPolyfillSupport,E=(e,t)=>e,D={toAttribute(e,t){switch(t){case Boolean:e=e?te:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},O=(e,t)=>!y(e,t),re={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:O},Symbol.metadata??=Symbol(`metadata`),w.litPropertyMetadata??=new WeakMap,k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=re){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&b(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=x(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??re}static _$Ei(){if(this.hasOwnProperty(E(`elementProperties`)))return;let e=ee(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(E(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E(`properties`))){let e=this.properties,t=[...S(e),...C(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(_(e))}else e!==void 0&&t.push(_(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return g(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?D:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?D:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n){if(e!==void 0){let r=this.constructor,i=this[e];if(n??=r.getPropertyOptions(e),!((n.hasChanged??O)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}},k.elementStyles=[],k.shadowRootOptions={mode:`open`},k[E(`elementProperties`)]=new Map,k[E(`finalized`)]=new Map,ne?.({ReactiveElement:k}),(w.reactiveElementVersions??=[]).push(`2.1.1`)}));function A(e){return(t,n)=>typeof n==`object`?oe(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}var ae,oe,se=e((()=>{ie(),ae={attribute:!0,type:String,converter:D,reflect:!1,hasChanged:O},oe=(e=ae,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e)}}throw Error(`Unsupported decorator location: `+r)}}));function j(e){return A({...e,state:!0,attribute:!1})}var ce=e((()=>{se()}));function le(e){return(t,n)=>{let r=typeof t==`function`?t:t[n];Object.assign(r,e)}}var ue=e((()=>{})),de=e((()=>{})),fe=e((()=>{})),pe=e((()=>{})),me=e((()=>{})),he=e((()=>{})),M=e((()=>{c(),se(),ce(),ue(),de(),fe(),pe(),me(),he()}));function ge(e,t){if(!Oe(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return be===void 0?t:be.createHTML(t)}function _e(e,t,n=e,r){if(t===Ve)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=De(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=_e(e,i._$AS(e,t.values),i,r)),t}var ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,N,ze,Be,Ve,P,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt=e((()=>{ve=globalThis,ye=ve.trustedTypes,be=ye?ye.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,xe=`$lit$`,Se=`lit$${Math.random().toFixed(9).slice(2)}$`,Ce=`?`+Se,we=`<${Ce}>`,Te=document,Ee=()=>Te.createComment(``),De=e=>e===null||typeof e!=`object`&&typeof e!=`function`,Oe=Array.isArray,ke=e=>Oe(e)||typeof e?.[Symbol.iterator]==`function`,Ae=`[ 	
\f\r]`,je=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Me=/-->/g,Ne=/>/g,Pe=RegExp(`>|${Ae}(?:([^\\s"'>=/]+)(${Ae}*=${Ae}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),Fe=/'/g,Ie=/"/g,Le=/^(?:script|style|textarea|title)$/i,Re=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),N=Re(1),ze=Re(2),Be=Re(3),Ve=Symbol.for(`lit-noChange`),P=Symbol.for(`lit-nothing`),He=new WeakMap,Ue=Te.createTreeWalker(Te,129),We=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=je;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===je?c[1]===`!--`?o=Me:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=Pe):(Le.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=Pe):o=Ne:o===Pe?c[0]===`>`?(o=i??je,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?Pe:c[3]===`"`?Ie:Fe):o===Ie||o===Fe?o=Pe:o===Me||o===Ne?o=je:(o=Pe,i=void 0);let d=o===Pe&&e[t+1].startsWith(`/>`)?` `:``;a+=o===je?n+we:l>=0?(r.push(s),n.slice(0,l)+xe+n.slice(l)+Se+d):n+Se+(l===-2?t:d)}return[ge(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Ge=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=We(t,n);if(this.el=e.createElement(l,r),Ue.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=Ue.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(xe)){let t=u[o++],n=i.getAttribute(e).split(Se),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ye:r[1]===`?`?Xe:r[1]===`@`?Ze:Je}),i.removeAttribute(e)}else e.startsWith(Se)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Le.test(i.tagName)){let e=i.textContent.split(Se),t=e.length-1;if(t>0){i.textContent=ye?ye.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],Ee()),Ue.nextNode(),c.push({type:2,index:++a});i.append(e[t],Ee())}}}else if(i.nodeType===8)if(i.data===Ce)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(Se,e+1))!==-1;)c.push({type:7,index:a}),e+=Se.length-1}a++}}static createElement(e,t){let n=Te.createElement(`template`);return n.innerHTML=e,n}},Ke=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??Te).importNode(t,!0);Ue.currentNode=r;let i=Ue.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new qe(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Qe(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=Ue.nextNode(),a++)}return Ue.currentNode=Te,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},qe=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=P,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=_e(this,e,t),De(e)?e===P||e==null||e===``?(this._$AH!==P&&this._$AR(),this._$AH=P):e!==this._$AH&&e!==Ve&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ke(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==P&&De(this._$AH)?this._$AA.nextSibling.data=e:this.T(Te.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Ge.createElement(ge(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ke(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=He.get(e.strings);return t===void 0&&He.set(e.strings,t=new Ge(e)),t}k(t){Oe(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(Ee()),this.O(Ee()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Je=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=P,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=P}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=_e(this,e,t,0),a=!De(e)||e!==this._$AH&&e!==Ve,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=_e(this,r[n+o],t,o),s===Ve&&(s=this._$AH[o]),a||=!De(s)||s!==this._$AH[o],s===P?e=P:e!==P&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===P?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ye=class extends Je{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===P?void 0:e}},Xe=class extends Je{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==P)}},Ze=class extends Je{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=_e(this,e,t,0)??P)===Ve)return;let n=this._$AH,r=e===P&&n!==P||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==P&&(n===P||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Qe=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){_e(this,e)}},$e={M:xe,P:Se,A:Ce,C:1,L:We,R:Ke,D:ke,V:_e,I:qe,H:Je,N:Xe,U:Ze,B:Ye,F:Qe},et=ve.litHtmlPolyfillSupport,et?.(Ge,qe),(ve.litHtmlVersions??=[]).push(`3.3.1`),tt=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new qe(t.insertBefore(Ee(),e),e,void 0,n??{})}return i._$AI(e),i}})),rt,F,it,at=e((()=>{ie(),ie(),nt(),nt(),rt=globalThis,F=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=tt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ve}},F._$litElement$=!0,F.finalized=!0,rt.litElementHydrateSupport?.({LitElement:F}),it=rt.litElementPolyfillSupport,it?.({LitElement:F}),(rt.litElementVersions??=[]).push(`4.2.1`)})),ot=e((()=>{})),I=e((()=>{ie(),nt(),at(),ot()})),L,st=e((()=>{L=e=>(t,n)=>{let{kind:r,metadata:i,name:a}=n,o=globalThis.litPropertyMetadata.get(i)?.get(a)?.type??String;if(e??=o,e===String?e=e=>e==null?``:String(e):e===Number&&(e=e=>e==null?NaN:Number(e)),r===`accessor`)return{set(n){t.set.call(this,e(n))}};if(r===`setter`)return function(n){t.call(this,e(n))};throw Error(`Unsupported decorator location: ${r}`)}})),ct,lt=e((()=>{ct=e=>(t,n)=>{let{kind:r}=n;if(r===`accessor`)return{set(r){let i=n.access.get(this);t.set.call(this,r);let a=n.access.get(this);a!==i&&e(this,a,i)}};throw Error(`Unsupported decorator location: ${r}`)}}));function ut(e,t){for(let[n,r]of Object.entries(t))r?e.setAttribute(n,r):e.toggleAttribute(n,r!==null)}var dt,ft=e((()=>{I(),dt=e=>t=>t.addInitializer(t=>{t.addController({hostConnected(){ut(t,e),t.removeController(this)},hostUpdate(){ut(t,e),t.removeController(this)}})})})),pt,mt,ht,gt=e((()=>{I(),pt=new WeakMap,mt=new WeakMap,ht=()=>(e,t)=>{let{kind:n,metadata:r,name:i}=t;if(n===`accessor`){let n=globalThis.litPropertyMetadata.get(r)?.get(i)?.attribute,a=typeof n==`string`?n:i;return t.addInitializer(function(){this.addController({host:this,rootNode:null,checkIdReference(e){let n=this.host.getAttribute(a)??mt.get(this.host);if(n&&typeof n==`string`&&(!e||e.has(n))){let e=this.rootNode?.getElementById?.(n)??null;t.access.get(this.host)!==e&&t.access.set(this.host,e)}},hostConnected(){this.rootNode=this.host.getRootNode(),this.checkIdReference();let e=pt.get(this.rootNode);if(e)e.controllers.add(this);else{let e=new Set([this]),t=new MutationObserver(t=>{let n=new Set;for(let e of t)if(e.type===`attributes`)e.oldValue&&n.add(e.oldValue),e.target.id&&n.add(e.target.id);else if(e.type===`childList`)for(let t of[...e.addedNodes,...e.removedNodes])t instanceof HTMLElement&&(t.id&&n.add(t.id),t.querySelectorAll(`[id]`).forEach(e=>{e.id&&n.add(e.id)}));e.forEach(e=>e.checkIdReference(n))});t.observe(this.rootNode,{attributeFilter:[`id`],attributeOldValue:!0,childList:!0,subtree:!0}),pt.set(this.rootNode,{observer:t,controllers:e})}},hostDisconnected(){if(!this.rootNode)return;let e=pt.get(this.rootNode);if(!e){this.rootNode=null;return}e.controllers.delete(this),e.controllers.size===0&&(e.observer.disconnect(),pt.delete(this.rootNode)),this.rootNode=null}})}),{set(t){if(typeof t!=`string`)mt.delete(this),t instanceof HTMLElement&&this.hasAttribute(a)&&t.id!==this.getAttribute(a)&&this.removeAttribute(a);else{if(this.hasAttribute(a)&&this.getAttribute(a)!==t)return;{let e=t?this.getRootNode?.()?.getElementById?.(t):null;e?t=e:t&&=(mt.set(this,t),null)}}e.set.call(this,t)}}}throw Error(`Unsupported decorator location: ${n}`)}})),_t,vt=e((()=>{I(),_t={toAttribute(e,t){return(t===String||t===void 0)&&e===``||t===Number&&isNaN(e)?null:D.toAttribute(e,t)}}}));function yt(){return`sbbConfig`in globalThis||(globalThis.sbbConfig={}),globalThis.sbbConfig}var bt=e((()=>{})),xt=e((()=>{bt()})),St,Ct,wt,Tt=e((()=>{St=/(0?[1-9]|[12][0-9]|3[01])[.,\\/\-\s](0?[1-9]|1[0-2])[.,\\/\-\s]([0-9]{1,4}$)?/,Ct=/^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-3][0-9])$/,wt=class{deserialize(e){return e==null||this.isDateInstance(e)&&this.isValid(e)?e:this.invalid()}format(e,t){if(!this.isValid(e))return``;let n=new Date(this.toIso8601(e)+`T00:00:00`),r=new Intl.DateTimeFormat(`de-CH`,{day:`2-digit`,month:`2-digit`,year:`numeric`});if(t?.weekdayStyle===`none`)return r.format(n);let i=t?.weekdayStyle??`short`,a=this.getDayOfWeekNames(i)[this.getDayOfWeek(e)];return a=a.charAt(0).toUpperCase()+a.substring(1),i===`short`&&(a=a.substring(0,2)),`${a}, ${r.format(n)}`}toIso8601(e){let t=(e,t=2)=>`${e}`.padStart(t,`0`);return`${t(this.getYear(e),4)}-${t(this.getMonth(e))}-${t(this.getDate(e))}`}getValidDateOrNull(e){return this.isDateInstance(e)&&this.isValid(e)?e:null}getFirstWeekOffset(e){let t=this.createDate(this.getYear(e),this.getMonth(e),1);return(7+this.getDayOfWeek(t)-this.getFirstDayOfWeek())%7}compareDate(e,t){return this.getYear(e)-this.getYear(t)||this.getMonth(e)-this.getMonth(t)||this.getDate(e)-this.getDate(t)}sameDate(e,t){if(e&&t){let n=this.isValid(e),r=this.isValid(t);return n&&r?!this.compareDate(e,t):n==r}return e==t}clampDate(e,t,n){return t&&this.compareDate(e,t)<0?t:n&&this.compareDate(e,n)>0?n:e}}})),Et,Dt,Ot=e((()=>{I(),Et=[],window.addEventListener(`keydown`,e=>{e.key===`Escape`&&!e.defaultPrevented&&(e.preventDefault(),Et.at(-1)?.escapeStrategy())}),Dt=class{constructor(e,t=Et){this._host=e,this._overlayStack=t,this._host.addController?.(this)}hostDisconnected(){this.disconnect()}connect(){this.disconnect(),this._overlayStack.push(this._host)}disconnect(){if(this._overlayStack.length){let e=this._overlayStack.findIndex(e=>e===this._host);e!==-1&&this._overlayStack.splice(e,1)}}}})),kt=e((()=>{I()})),At,R,jt=e((()=>{I(),xt(),At=class e{static get current(){let t=((yt().language??document.documentElement.getAttribute(`lang`))||e._defaultLanguage).split(`-`)[0];return e._supportedLocales.includes(t)?t:e._defaultLanguage}get current(){return e.current}constructor(e){this._host=e,this._handlers=[],this._host.addController(this)}withHandler(e){return this._handlers.unshift(e),this}hostConnected(){e._listeners.size||e._observer.observe(document.documentElement,e._observerConfig),e._listeners.add(this),this._previousLanguage!==this.current&&this._callHandlers(this._previousLanguage!==void 0)}hostDisconnected(){this._previousLanguage=this.current,e._listeners.delete(this),e._listeners.size||e._observer.disconnect()}_callHandlers(e=!0){this._handlers.forEach(e=>e()),e&&this._host.requestUpdate()}},At._defaultLanguage=`en`,At._supportedLocales=[`en`,`de`,`fr`,`it`],At._listeners=new Set,At._observer=new MutationObserver(e=>{e[0].oldValue!==document.documentElement.getAttribute(`lang`)&&At._listeners.forEach(e=>e._callHandlers())}),At._observerConfig={attributeFilter:[`lang`],attributeOldValue:!0},R=At})),Mt,Nt=e((()=>{Mt=1023})),Pt,Ft,It,Lt,Rt,zt,Bt,Vt=e((()=>{Nt(),I(),Pt=e=>e/16,Ft=`(prefers-color-scheme: dark)`,It=`(pointer: coarse)`,Lt=`(min-width: ${Pt(840)}rem)`,`${Pt(Mt)}`,`${Pt(839)}`,Rt=new Map,zt=class{constructor(e,t){this._queries=t,e.addController(this)}matches(e){return matchMedia(e).matches}hostConnected(){for(let[e,t]of Object.entries(this._queries)){let n=Rt.get(e);if(n)n.handlers.add(t);else{let n=matchMedia(e),r=new Set([t]),i=e=>r.forEach(t=>t(e.matches));n.addEventListener(`change`,i),Rt.set(e,{mediaQueryList:n,handlers:r,eventHandler:i})}}}hostDisconnected(){for(let[e,t]of Object.entries(this._queries)){let n=Rt.get(e);n&&(n.handlers.delete(t),n.handlers.size||Rt.delete(e))}}},Bt=class e extends zt{constructor(e,t){let n=()=>{t(this.matches()),this._host.toggleState(`dark`,this.matches())};super(e,{[Ft]:n}),this._host=e,this._onChangeWithStateUpdater=n}static _readLightDarkClass(){let e=document.documentElement.classList;return[`light-dark`,`dark`,`light`].find(t=>e.contains(`sbb-${t}`))??null}static requestUpdate(){let e=Rt.get(Ft);e&&e.handlers.forEach(t=>t(e.mediaQueryList.matches))}hostConnected(){let t=(Rt.get(`(prefers-color-scheme: dark)`)?.handlers.size??0)===0;super.hostConnected(),t&&e._observer.observe(document.documentElement,e._observerConfig),this._onChangeWithStateUpdater()}hostDisconnected(){super.hostDisconnected(),(Rt.get(`(prefers-color-scheme: dark)`)?.handlers.size??0)===0&&e._observer.disconnect()}matches(){let e=getComputedStyle(this._host).getPropertyValue(`color-scheme`),t=e.includes(`dark`),n=e.trim()===`dark`;return super.matches(`(prefers-color-scheme: dark)`)&&t||n}},Bt._currentMode=Bt._readLightDarkClass(),Bt._observer=new MutationObserver(e=>{if(e[0].oldValue!==document.documentElement.getAttribute(`class`)){let e=Bt._readLightDarkClass();Bt._currentMode!==e&&(Bt.requestUpdate(),Bt._currentMode=e)}}),Bt._observerConfig={attributeFilter:[`class`],attributeOldValue:!0}})),Ht,Ut=e((()=>{I(),Ht=class{constructor(e,t=null){this._host=e,this._onChangeCallback=t,this.slots=new Set,this._textObserver=new MutationObserver(()=>{Array.from(this._host.childNodes).filter(e=>e.nodeType===e.TEXT_NODE).some(e=>e.textContent?.trim())?this.slots.add(`unnamed`):Array.from(this._host.children).every(e=>e.slot)&&this.slots.delete(`unnamed`),this._updateSlotNameAttribute()}),this._slotchangeHandler=e=>{this._syncSlots(e.target)},this._host.addController(this)}hostConnected(){this._syncSlots(...this._host.shadowRoot?.querySelectorAll?.(`slot`)??[]),this._host.shadowRoot?.addEventListener(`slotchange`,this._slotchangeHandler)}hostDisconnected(){this._host.shadowRoot?.removeEventListener(`slotchange`,this._slotchangeHandler),this._textObserver.disconnect()}_syncSlots(...e){this._textObserver.disconnect();for(let t of e){let e=t.name||`unnamed`;t.assignedNodes().some(e=>`tagName`in e||e.textContent?.trim())?this.slots.add(e):this.slots.delete(e),this._updateSlotNameAttribute()}e.find(e=>!e.name)?.assignedNodes().filter(e=>e.nodeType===e.TEXT_NODE).forEach(e=>this._textObserver.observe(e,{characterData:!0}))}_updateSlotNameAttribute(){let e=this._host.getAttribute(`data-slot-names`),t=[...this.slots].sort().join(` `);t?this._host.getAttribute(`data-slot-names`)!==t&&this._host.setAttribute(`data-slot-names`,t):this._host.removeAttribute(`data-slot-names`),t!==e&&this._onChangeCallback?.()}}})),Wt=e((()=>{I(),CSS.supports(`anchor-name`,`--test`)})),z=e((()=>{Ot(),kt(),jt(),Vt(),Ut(),Wt()})),Gt,Kt,qt,Jt=e((()=>{z(),Tt(),Gt=/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/,Kt=class extends wt{constructor(e=15){super(),this._cutoffYearOffset=e}getYear(e){return e.getFullYear()}getMonth(e){return e.getMonth()+1}getDate(e){return e.getDate()}getDayOfWeek(e){return e.getDay()}getAccessibilityFormatDate(e){return new Intl.DateTimeFormat(R.current,{year:`numeric`,month:`long`,day:`numeric`}).format(new Date(e))}getMonthNames(e){let t=new Intl.DateTimeFormat(R.current,{month:e});return this._range(12,e=>t.format(new Date(2017,e,1)))}getDateNames(){let e=new Intl.DateTimeFormat(R.current,{day:`numeric`});return this._range(31,t=>e.format(new Date(2017,0,t+1)))}getDayOfWeekNames(e){let t=new Intl.DateTimeFormat(R.current,{weekday:e});return this._range(7,e=>t.format(new Date(2017,0,e+1)))}getFirstDayOfWeek(){return 1}getNumDaysInMonth(e){return this.getDate(this._createDateWithOverflow(this.getYear(e),this.getMonth(e),0))}today(){return new Date(new Date().setHours(0,0,0,0))}createDate(e,t,n){if(t<1||t>12)throw Error(`Invalid month index "${t}". Month index has to be between 1 and 12.`);if(n<1)throw Error(`Invalid date "${n}". Date has to be greater than 0.`);let r=this._createDateWithOverflow(e,t-1,n);if(r.getMonth()+1!==t)throw Error(`Invalid date "${n}" for month with index "${t}".`);return r}isDateInstance(e){return e instanceof Date}isValid(e){return!!e&&!isNaN(e.valueOf())}clone(e){return new Date(e.valueOf())}addCalendarYears(e,t){return this.addCalendarMonths(e,t*12)}addCalendarMonths(e,t){let n=e.getMonth()+t,r=new Date(e.getFullYear(),n,1,0,0,0,0),i=this.getNumDaysInMonth(r);return new Date(this.clone(e).setMonth(n,Math.min(i,e.getDate())))}addCalendarDays(e,t){let n=e.getDate()+t;return new Date(e.getFullYear(),e.getMonth(),n,0,0,0,0)}deserialize(e){if(typeof e==`string`)if(e){if(Gt.test(e))return this.getValidDateOrNull(new Date(e.includes(`T`)?e:e+`T00:00:00`))}else return null;return super.deserialize(e)}parse(e){if(!e)return null;let t=null,n=e.match(Ct);try{t=n?this.createDate(+n[1],+n[2],+n[3]):null}catch{}if(this.isValid(t))return t;let r=e.replace(/\D/g,` `).trim()?.match(St);if(!r||r.index!==0||r.length<=2||r.some(e=>e===void 0)||!this.isValid(this.createDate(+r[3],+r[2],+r[1])))return null;let i=+r[3];if(typeof i==`number`&&i<100&&i>=0){let e=this.today().getFullYear()-2e3+this._cutoffYearOffset;i=i<=e?2e3+i:1900+i}return new Date(i,r[2]-1,+r[1])}invalid(){return new Date(NaN)}_range(e,t){return Array.from({length:e}).map((e,n)=>t(n))}_createDateWithOverflow(e,t,n){let r=new Date(e,t,n);return e>=0&&e<100&&r.setFullYear(this.getYear(r)-1900),r}},qt=new Kt})),Yt=e((()=>{Tt(),Jt()})),Xt,Zt,Qt=e((()=>{xt(),Yt(),Xt={toAttribute(e,t){let n=yt().datetime?.dateAdapter??qt;return n.isValid(e)?n.toIso8601(e):null}},Zt=e=>(t,n)=>{let{kind:r}=n;if(r===`accessor`)return{set(e){let n=yt().datetime?.dateAdapter??qt;e=n.getValidDateOrNull(n.deserialize(e)),e=e?n.createDate(n.getYear(e),n.getMonth(e),n.getDate(e)):null,t.set.call(this,e)},get(){let n=yt().datetime?.dateAdapter??qt,r=t.get.call(this);return n.isValid(r)?n.clone(r):e?.fallback?.(n)}};throw Error(`Unsupported decorator location: ${r}`)}})),$t,en=e((()=>{I(),z(),$t=()=>e=>{e.addInitializer(e=>new Ht(e))}})),B=e((()=>{st(),lt(),ft(),gt(),vt(),Qt(),en()})),tn,nn,rn,an,on,V,sn,cn,ln=e((()=>{o(),M(),B(),tn=e=>{throw TypeError(e)},nn=(e,t,n)=>t.has(e)||tn(`Cannot `+n),rn=(e,t,n)=>(nn(e,t,`read from private field`),n?n.call(e):t.get(e)),an=(e,t,n)=>t.has(e)?tn(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),on=(e,t,n,r)=>(nn(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),V=e=>(()=>{var t,n;let r=e,o=[],s;return n=class extends r{constructor(){super(...arguments),an(this,t,(a(this,o),!1))}set disabled(e){on(this,t,!!e),this.toggleAttribute(`disabled`,this.disabled)}get disabled(){return rn(this,t)||this.isDisabledExternally()}isDisabledExternally(){return!1}},t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;s=[A({type:Boolean,reflect:!0})],i(n,null,s,{kind:`setter`,name:`disabled`,static:!1,private:!1,access:{has:e=>`disabled`in e,set:(e,t)=>{e.disabled=t}},metadata:e},null,o),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n})(),sn=e=>(()=>{var t,n;let r=e,o,s=[],c=[];return n=class extends r{constructor(){super(...arguments),an(this,t,a(this,s,!1)),a(this,c)}get disabledInteractive(){return rn(this,t)}set disabledInteractive(e){on(this,t,e)}},t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;o=[L(),A({attribute:`disabled-interactive`,type:Boolean,reflect:!0})],i(n,null,o,{kind:`accessor`,name:`disabledInteractive`,static:!1,private:!1,access:{has:e=>`disabledInteractive`in e,get:e=>e.disabledInteractive,set:(e,t)=>{e.disabledInteractive=t}},metadata:e},s,c),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n})(),cn=e=>{class t extends sn(V(e)){willUpdate(e){super.willUpdate(e),e.has(`disabledInteractive`)&&(this.internals.ariaDisabled=this.disabledInteractive?`true`:null),e.has(`disabled`)&&(this.disabled?this.removeAttribute(`tabindex`):this.setAttribute(`tabindex`,`0`))}}return t}})),un,dn,fn,pn,mn=e((()=>{I(),un=CSS.supports(`selector(:state(loading))`)?null:class extends Set{constructor(e){super(),this._host=e,this._host.addController(this)}add(e){return this._host.isConnected&&this._toggleState(e,!0),super.add(e)}delete(e){return this._toggleState(e,!1),super.delete(e)}clear(){this.forEach(e=>this.delete(e))}hostConnected(){this.forEach(e=>this._toggleState(e,!0))}_toggleState(e,t){this._host.toggleAttribute(`state--${e}`,t)}};{let e=0,t=e=>e.shadowRoot?.host??(e instanceof Element?e:(()=>{throw Error(`Unable to resolve related element! This should never happen.`)})()),n={attributes:!0,attributeFilter:[`id`]},r=(t,n,r)=>{let i=r[Element.name]??r[ElementInternals.name];t.setAttribute(n,i.id||=`aria-ref-${e++}`)},i=(t,n,r)=>{t.setAttribute(n,Object.values(r).reduce((e,t)=>e.concat(t)).filter((e,t,n)=>n.indexOf(e)===t).map(t=>t.id||=`aria-ref-${e++}`).join(` `))};for(let e of[ElementInternals,Element]){let a=e.prototype;if(!(`ariaActiveDescendantElement`in a)){let i=`aria-activedescendant`,o=new WeakMap;Object.defineProperty(a,`ariaActiveDescendantElement`,{enumerable:!0,configurable:!0,get(){let e=t(this),n=e.getAttribute(i)?.split(/\s+/)[0]??null;return n?e.getRootNode().getElementById?.(n)??null:null},set(a){if(a!==null&&!(a instanceof Element))throw TypeError(`Failed to set the 'ariaActiveDescendantElement' property on '${e.name}': Failed to convert value to 'Element'.`);let s=t(this),c=o.get(s);if(c?.observer?.disconnect(),a===null)c&&(delete c.elements[e.name],Object.keys(c).length?c.observer.observe(Object.values(c.elements)[0],n):(o.delete(s),s.removeAttribute(i)));else if(c)c.elements[e.name]=a,r(s,i,c.elements),Object.values(c.elements).forEach(e=>c.observer.observe(e,n));else{let t={[e.name]:a};r(s,i,t);let c=new MutationObserver(()=>r(s,i,t));c.observe(a,n),o.set(s,{elements:t,observer:c})}}})}for(let r of[`ariaControlsElements`,`ariaDescribedByElements`,`ariaDetailsElements`,`ariaErrorMessageElements`,`ariaLabelledByElements`,`ariaOwnsElements`])if(!(r in a)){let o=new WeakMap,s=`aria-${r.slice(4,-8).toLowerCase()}`;Object.defineProperty(a,r,{enumerable:!0,configurable:!0,get(){let e=t(this),n=e.getAttribute(s)?.split(/\s+/).filter((e,t,n)=>n.indexOf(e)===t).map(t=>e.getRootNode().getElementById?.(t)).filter(e=>e instanceof Element);return n?.length?Object.freeze(n):null},set(a){if(a!==null&&(!Array.isArray(a)||a.some(e=>!(e instanceof Element))))throw TypeError(`Failed to set the '${r}' property on '${e.name}': Failed to convert value to 'Element'.`);let c=t(this);a=a?.filter((e,t,n)=>n.indexOf(e)===t)??null;let l=o.get(c);if(l?.observer?.disconnect(),a===null)l&&(delete l.elements[e.name],Object.keys(l.elements).length?Object.values(l.elements).reduce((e,t)=>e.concat(t)).forEach(e=>l.observer.observe(e,n)):o.delete(c));else if(l)l.elements[e.name]=a,i(c,s,l.elements),Object.values(l.elements).reduce((e,t)=>e.concat(t)).forEach(e=>l.observer.observe(e,n));else{let t={[e.name]:a};i(c,s,t);let r=new MutationObserver(()=>i(c,s,t));a.forEach(e=>r.observe(e,n)),o.set(c,{elements:t,observer:r})}}})}}}dn=(e,...t)=>{let n=t.filter(e=>!!e);return e?.length?e.concat(n):t.length?n:null},fn=(e,...t)=>{t=t.filter(e=>!!e);let n=e?.filter(e=>!t.includes(e))??null;return n?.length?n:null},pn=e=>{class t extends e{constructor(...e){if(super(...e),this.internals=this.attachInternals(),un)Object.defineProperty(this.internals,`states`,{value:new un(this),writable:!1,configurable:!1,enumerable:!1});else for(let e of this.getAttributeNames().filter(e=>e.startsWith(`state--`)))this.internals.states.add(e.slice(7)),this.removeAttribute(e);let t=this.constructor.role;t&&(this.internals.role=t)}toggleState(e,t){t||t!==!1&&!this.internals.states.has(e)?this.internals.states.add(e):this.internals.states.delete(e)}}return t}}));function hn(e,t,n=null){let r=e.composedPath(),i=r.findIndex(e=>e===n);return i===-1&&(i=void 0),r.slice(0,i).find(e=>e instanceof window.HTMLElement&&e.hasAttribute(t))}var gn=e((()=>{}));function _n(e){return e.composedPath?e.composedPath()[0]:e.target}var vn=e((()=>{}));async function yn(e){return await new Promise(e=>setTimeout(e)),e.defaultPrevented}var bn=e((()=>{})),xn=e((()=>{gn(),vn(),bn()})),Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Bn,Vn,Hn,Un,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn=e((()=>{Sn={de:`(optional)`,en:`(optional)`,fr:`(facultatif)`,it:`(facoltativo)`},Cn={de:`Linkziel öffnet in neuem Fenster.`,en:`Link target opens in a new window.`,fr:`Le lien s'ouvre dans une nouvelle fenêtre.`,it:`Il link si apre in una nuova finestra.`},wn={de:`Hinweis schliessen`,en:`Close note`,fr:`Fermer la note`,it:`Chiudere la nota`},Tn={de:`Heute`,en:`Today`,fr:`Aujourd’hui`,it:`Oggi`},En={de:`Zum nächsten Monat wechseln`,en:`Change to the next month`,fr:`Passer au mois suivant`,it:`Passare al mese successivo`},Dn={de:`Zum letzten Monat wechseln`,en:`Change to the previous month`,fr:`Passer au mois précédent`,it:`Passare al mese precedente`},On={de:`Nächster Tag`,en:`Next day`,fr:`Le prochain jour`,it:`Giorno successivo`},kn={de:`Vorheriger Tag`,en:`Previous day`,fr:`Jour précédent`,it:`Giorno precedente`},An={de:`Jahr und Monat auswählen`,en:`Choose year and month`,fr:`Choisir l’année et le mois`,it:`Seleziona anno e mese`},jn={de:`Datum auswählen`,en:`Choose date`,fr:`Choisir une date`,it:`Seleziona una data`},Mn=e=>({de:`Wechsel zu den nächsten ${e} Jahren`,en:`Change to the next ${e} years`,fr:`Passer aux ${e} prochaines années`,it:`Passare ai successivi ${e} anni`}),Nn=e=>({de:`Wechsel zu den vorherigen ${e} Jahren`,en:`Change to the previous ${e} years`,fr:`Passage aux ${e} précédentes années`,it:`Passare ai precedenti ${e} anni`}),Pn={de:`Zum nächsten Jahr wechseln`,en:`Change to the next year`,fr:`Passer à l'année suivante`,it:`Passare all'anno successivo`},Fn={de:`Zum letzten Jahr wechseln`,en:`Change to the previous year`,fr:`Passer à l'année précédent`,it:`Passare all'anno precedente`},In=e=>({de:`Zum nächsten Tag wechseln, derzeit ausgewählt ${e}.`,en:`Change to the next day, currently selected ${e}.`,fr:`Passer au jour suivant, actuellement sélectionné ${e}.`,it:`Passare al giorno successivo, attualmente selezionato ${e}.`}),Ln=e=>({de:`Zum vorherigen Tag wechseln, derzeit ausgewählt ${e}.`,en:`Change to the previous day, currently selected ${e}.`,fr:`Passer au jour précédent, actuellement sélectionné ${e}.`,it:`Passare al giorno precedente, attualmente selezionato ${e}.`}),Rn={de:`Kalender anzeigen`,en:`Show calendar`,fr:`Afficher le calendrier`,it:`Visualizza il calendario`},zn={de:`TT.MM.JJJJ`,en:`DD.MM.YYYY`,fr:`JJ.MM.AAAA`,it:`GG.MM.AAAA`},Bn={de:`Datum geändert auf`,en:`Date changed to`,fr:`Date modifiée au`,it:`Data modificata in`},Vn={de:`Feldinhalt löschen`,en:`Clear input value`,fr:`Effacer la valeur d’entrée`,it:`Cancella il valore dell’input`},Hn={de:`Eingabe erforderlich.`,en:`Input required.`,fr:`Entrée obligatoire.`,it:`Inserimento necessario.`},Un={de:`Bitte gültiges Datum eingeben.`,en:`Please provide a valid date.`,fr:`Veuillez saisir une date valide.`,it:`Inserire una data valida.`},Wn=e=>({de:`Datum darf nicht vor ${e} sein.`,en:`Date must not be before ${e}.`,fr:`La date ne doit pas être antérieure au ${e}.`,it:`La data non deve essere anteriore al ${e}.`}),Gn=e=>({de:`Datum darf nicht nach ${e} sein.`,en:`Date must not be after ${e}.`,fr:`La date ne doit pas être postérieure au ${e}.`,it:`La data non deve essere successiva al ${e}.`}),Kn=e=>({de:`Zeit geändert zu ${e}.`,en:`Time changed to ${e}.`,fr:`Heure modifiée: ${e}.`,it:`Orario modificata alle ${e}.`}),qn={de:`Bitte gültige Zeit eingeben.`,en:`Please provide a valid time.`,fr:`Veuillez saisir une heure valide.`,it:`Inserisci un orario valido.`},Jn={de:`Zeit darf nicht nach 23:59 sein.`,en:`Time must not be after 23:59.`,fr:`L’heure ne doit pas être postérieure à 23h59.`,it:`L’orario non può essere successivo alle 23.59.`},Yn={de:`Die Zeiteingabe darf nicht mehr als fünf Zeichen haben.`,en:`The time input must not exceed five characters.`,fr:`La saisie de l’heure ne doit pas comporter plus de cinq caractères.`,it:`L’indicazione temporale non può contenere più di cinque caratteri.`},Xn={de:`Woche`,en:`Week`,fr:`Semaine`,it:`Settimana`},Zn={de:`Von und Nach tauschen`,en:`Swap from and to`,fr:`Échanger de et à`,it:`Inverti Da e A`}})),H=e((()=>{Qn()}));function $n(e,t){let n=getComputedStyle(e).getPropertyValue(t);return parseFloat(n)===0}var er=e((()=>{I()})),tr=e((()=>{I()}));function nr(e,t){let n=t;for(;n;){if(n===e)return!0;n=n instanceof ShadowRoot?n.host:n.parentNode}return!1}var rr=e((()=>{}));function ir(e,t){for(t=t.parentElement??t.getRootNode().host;t&&t!==document&&t!==window;){let n=t.closest(e);if(n)return n;t=t.getRootNode().host}return null}var ar=e((()=>{I()}));function or(){return document.documentElement.classList.contains(`sbb-lean`)}var sr=e((()=>{I()}));function cr(e,t,n){n?e.setAttribute(t,n):e.removeAttribute(t)}var lr=e((()=>{})),ur,dr,fr,pr,mr,hr,gr,_r,vr,yr=e((()=>{I();try{ur=typeof Intl<`u`&&Intl.v8BreakIterator}catch{ur=!1}dr=/(edge)/i.test(navigator.userAgent),fr=/(msie|trident)/i.test(navigator.userAgent),pr=!!(window.chrome||ur)&&typeof CSS<`u`&&!dr&&!fr,mr=/AppleWebKit/i.test(navigator.userAgent)&&!pr&&!dr&&!fr,hr=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!(`MSStream`in window),/(Mac)/i.test(navigator.platform),gr=/(firefox|minefield)/i.test(navigator.userAgent),_r=/android/i.test(navigator.userAgent)&&!fr,vr=/safari/i.test(navigator.userAgent)&&mr})),U=e((()=>{er(),tr(),rr(),ar(),sr(),lr(),yr()})),br,xr,Sr,Cr,wr,Tr,Er,Dr=e((()=>{if(o(),M(),U(),br=e=>{throw TypeError(e)},xr=(e,t,n)=>t.has(e)||br(`Cannot `+n),Sr=(e,t,n)=>(xr(e,t,`read from private field`),n?n.call(e):t.get(e)),Cr=(e,t,n)=>t.has(e)?br(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),wr=(e,t,n,r)=>(xr(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Tr={badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valueMissing:!1},typeof ValidityState>`u`){let e=class{get valid(){return!0}constructor(){throw TypeError(`Illegal constructor`)}};Object.entries(Tr).forEach(([t,n])=>Object.assign(e.prototype,{get[t](){return n}})),globalThis.ValidityState=e}Er=e=>(()=>{var t,n;let r=e,o=[],s,c,l=[],u=[];return n=class extends r{constructor(...e){super(...e),Cr(this,t),this._validityStates=(a(this,o),new Map),wr(this,t,a(this,l,!1)),a(this,u),this.addEventListener?.(`invalid`,e=>e.preventDefault())}get form(){return this.internals.form}set name(e){this.setAttribute(`name`,`${e}`),this.updateFormValue()}get name(){return this.getAttribute(`name`)??``}get type(){return this.localName}get validity(){return this.internals.validity}get validationMessage(){return this.internals.validationMessage}get willValidate(){return this.internals.willValidate}get formDisabled(){return Sr(this,t)}set formDisabled(e){wr(this,t,e)}attributeChangedCallback(e,t,n){(e!==`name`||t!==n)&&super.attributeChangedCallback(e,t,n)}checkValidity(){return this.internals.checkValidity()}reportValidity(){return this.internals.reportValidity()}setCustomValidity(e){e?this.setValidityFlag(`customError`,e):this.removeValidityFlag(`customError`)}formDisabledCallback(e){this.formDisabled=this._hasDisabledAncestor()}_hasDisabledAncestor(){let e=this.parentElement;for(;e;){if(e.localName===`fieldset`&&e.hasAttribute(`disabled`))return!0;e=e.parentElement}return!1}requestUpdate(e,t,n){super.requestUpdate(e,t,n),e===`value`&&this.updateFormValue(),this.hasUpdated&&this.shouldValidate(e)&&this.validate()}firstUpdated(e){super.firstUpdated(e),this.validate()}updateFormValue(){let e,t=this.name??this.getAttribute(`name`);typeof this.value==`string`||this.value==null?e=this.value:Array.isArray(this.value)?(e=new FormData,this.value.forEach(n=>{e.append(t,typeof n==`string`?n:new Blob([JSON.stringify(n)],{type:`application/json`}))})):(e=new FormData,e.append(t,new Blob([JSON.stringify(this.value)],{type:`application/json`}))),this.internals.setFormValue(e,this.formState?.())}setValidityFlag(e,t,n){n??=!0;let r=this._validityStates.get(e);(!r||r.message!==t||r.flagValue!==n)&&(this._validityStates.set(e,{flagValue:n,message:t}),this._setInternalValidity())}removeValidityFlag(e){this._validityStates.has(e)&&(this._validityStates.delete(e),this._setInternalValidity())}validate(){}shouldValidate(e){return!e}_setInternalValidity(){let e=this._validityStates.get(`customError`)?.message,t={};this._validityStates.forEach(({flagValue:n,message:r},i)=>{t[i]=n,e||=r});let n=Object.keys(ValidityState.prototype).filter(e=>!(e in Tr)&&e!==`valid`);for(let e of n){let n=e in t?t[e]:!1;Object.defineProperty(this.internals.validity,e,{value:n,configurable:!0}),n&&(t.customError=!0)}this.internals.setValidity(t,e),mr&&Object.defineProperty(this.internals.validity,`customError`,{value:this._validityStates.has(`customError`)||!!t.customError,configurable:!0})}},t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;s=[A()],c=[j()],i(n,null,s,{kind:`setter`,name:`name`,static:!1,private:!1,access:{has:e=>`name`in e,set:(e,t)=>{e.name=t}},metadata:e},null,o),i(n,null,c,{kind:`accessor`,name:`formDisabled`,static:!1,private:!1,access:{has:e=>`formDisabled`in e,get:e=>e.formDisabled,set:(e,t)=>{e.formDisabled=t}},metadata:e},l,u),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.formAssociated=!0,n})()})),Or,kr=e((()=>{o(),M(),Or=e=>(()=>{var t;let n=e,r=[],o;return t=class extends n{constructor(){super(...arguments),this._required=(a(this,r),!1)}set required(e){this._required=!!e}get required(){return this._required||this.isRequiredExternally()}willUpdate(e){super.willUpdate(e),e.has(`required`)&&(this.internals.ariaRequired=`${this.required}`)}isRequiredExternally(){return!1}},(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;o=[A({reflect:!0,type:Boolean})],i(t,null,o,{kind:`setter`,name:`required`,static:!1,private:!1,access:{has:e=>`required`in e,set:(e,t)=>{e.required=t}},metadata:e},null,r),e&&Object.defineProperty(t,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t})()})),Ar=e((()=>{I(),M(),z(),B(),ln(),mn(),Dr(),kr()}));function jr(){return document.documentElement.matches(`:dir(rtl)`)?{prevKey:`ArrowRight`,nextKey:`ArrowLeft`}:{prevKey:`ArrowLeft`,nextKey:`ArrowRight`}}function Mr(e){return[`ArrowRight`,`ArrowLeft`,`ArrowUp`,`ArrowDown`].includes(e.key)}function Nr(e){return Mr(e)||[`PageUp`,`PageDown`,`Home`,`End`].includes(e.key)}function Pr(e,t,n){return(e+n+t)%t}function Fr(e){return e-1}function Ir(e,t,n){let{prevKey:r,nextKey:i}=jr();return!e||e.key===i||e.key===`ArrowDown`?t>=n?Lr:Pr(t,n,1):e.key===r||e.key===`ArrowUp`?t<Lr?Fr(n):Pr(t,n,-1):t}var Lr,Rr=e((()=>{Lr=0}));function zr(e){return e.buttons===0||e.detail===0}function Br(e){let t=e.touches&&e.touches[0]||e.changedTouches&&e.changedTouches[0];return!!t&&t.identifier===-1&&(t.radiusX==null||t.radiusX===1)&&(t.radiusY==null||t.radiusY===1)}var Vr=e((()=>{})),Hr,Ur,Wr,Gr,Kr,qr=e((()=>{I(),xn(),Vr(),Hr={ignoreKeys:[18,17,224,91,16]},Ur=650,Wr={passive:!0,capture:!0},Gr=class{get mostRecentModality(){return this._mostRecentModality}get mostRecentTarget(){return this._mostRecentTarget}constructor(){this._mostRecentModality=`mouse`,this._mostRecentTarget=null,this._options={...Hr},this._lastTouchMs=0,this._onKeydown=e=>{this._options?.ignoreKeys?.some(t=>t===e.keyCode)||this._updateState(`keyboard`,e)},this._onMousedown=e=>{Date.now()-this._lastTouchMs<Ur||this._updateState(zr(e)?`keyboard`:`mouse`,e)},this._onTouchstart=e=>{if(Br(e)){this._updateState(`keyboard`,e);return}this._lastTouchMs=Date.now(),this._updateState(`touch`,e)},document.addEventListener(`keydown`,this._onKeydown,Wr),document.addEventListener(`mousedown`,this._onMousedown,Wr),document.addEventListener(`touchstart`,this._onTouchstart,Wr)}reset(){this._updateState(`mouse`,null),this._lastTouchMs=0}_updateState(e,t){this._mostRecentModality&&document.documentElement.classList.remove(`sbb-focus-modality-${this._mostRecentModality}`),this._mostRecentModality=e,this._mostRecentTarget=t?_n(t):null,document.documentElement.classList.add(`sbb-focus-modality-${this._mostRecentModality}`)}},Kr=new Gr})),Jr=e((()=>{qr()})),Yr,Xr=e((()=>{Yr=[`button`,`[href]`,`input`,`select`,`textarea`,`details`,`summary`,`[tabindex]`].map(e=>`${e}:not([disabled],:disabled,[tabindex="-1"],[inert])`).join(`,`)}));function Zr(e){return!!(e.offsetWidth||e.offsetHeight||typeof e.getClientRects==`function`&&e.getClientRects().length)}function Qr(e){let t=e.nodeName.toLowerCase();return t===`input`||t===`select`||t===`button`||t===`textarea`}function $r(e){return ti(e)&&e.type==`hidden`}function ei(e){return ni(e)&&e.hasAttribute(`href`)}function ti(e){return e.nodeName.toLowerCase()==`input`}function ni(e){return e.nodeName.toLowerCase()==`a`}function ri(e){if(!e.hasAttribute(`tabindex`)||e.tabIndex===void 0)return!1;let t=e.getAttribute(`tabindex`);return!!(t&&!isNaN(parseInt(t,10)))}function ii(e){if(!ri(e))return null;let t=parseInt(e.getAttribute(`tabindex`)||``,10);return isNaN(t)?-1:t}function ai(e){let t=e.nodeName.toLowerCase(),n=t===`input`&&e.type;return n===`text`||n===`password`||t===`select`||t===`textarea`}function oi(e){return $r(e)?!1:Qr(e)||ei(e)||e.hasAttribute(`contenteditable`)||ri(e)}var si,ci,li=e((()=>{I(),yr(),si=class{isDisabled(e){return e.hasAttribute(`disabled`)||e.matches(`:disabled`)}isVisible(e){return Zr(e)&&getComputedStyle(e).visibility===`visible`}isTabbable(e){let t=e.nodeName.toLowerCase(),n=ii(e);return e.hasAttribute(`contenteditable`)?n!==-1:t===`iframe`||t===`object`||mr&&hr&&!ai(e)?!1:t===`audio`?e.hasAttribute(`controls`)?n!==-1:!1:t===`video`?n===-1?!1:n===null?gr||e.hasAttribute(`controls`):!0:e.tabIndex>=0}isFocusable(e,t){return oi(e)&&!e.inert&&!this.isDisabled(e)&&(t?.ignoreVisibility||this.isVisible(e))}},ci=new si})),ui,di=e((()=>{li(),ui=class{set enabled(e){e?this._trap():this._untrap()}get enabled(){return!!this._abortController}constructor(e){this._host=e,this._abortController=null,this._host.addController?.(this)}hostDisconnected(){this._untrap()}focusInitialElement(e){let t=this._host.querySelector(`[sbb-focus-initial]`);if(t){if(!ci.isFocusable(t)){let n=this._getFirstTabbableElement(t);return n?.focus(e),!!n}return t.focus(e),!0}return this.focusFirstTabbableElement(e)}focusFirstTabbableElement(e){let t=this._getFirstTabbableElement(this._host);return t&&t.focus(e),!!t}focusLastTabbableElement(e){let t=this._getLastTabbableElement(this._host);return t&&t.focus(e),!!t}_trap(){this._abortController=new AbortController,this._host.addEventListener(`keydown`,e=>{if(e.key===`Tab`)if(e.shiftKey){let t=this._getFirstTabbableElement(this._host);t&&e.composedPath().includes(t)&&(this._getLastTabbableElement(this._host)?.focus(),e.preventDefault())}else{let t=this._getLastTabbableElement(this._host);t&&e.composedPath().includes(t)&&(this._getFirstTabbableElement(this._host)?.focus(),e.preventDefault())}},{signal:this._abortController.signal})}_getFirstTabbableElement(e){if(e!==this._host&&ci.isFocusable(e)&&ci.isTabbable(e))return e;let t=e.shadowRoot?e.shadowRoot.children:e.localName===`slot`?e.assignedElements():e.children;for(let e=0;e<t.length;e++){let n=t[e].nodeType===document.ELEMENT_NODE?this._getFirstTabbableElement(t[e]):null;if(n)return n}return null}_getLastTabbableElement(e){if(e!==this._host&&ci.isFocusable(e)&&ci.isTabbable(e))return e;let t=e.shadowRoot?e.shadowRoot.children:e.localName===`slot`?e.assignedElements():e.children;for(let e=t.length-1;e>=0;e--){let n=t[e].nodeType===document.ELEMENT_NODE?this._getLastTabbableElement(t[e]):null;if(n)return n}return null}_untrap(){this._abortController?.abort(),this._abortController=null}}})),fi,pi,mi,hi=e((()=>{I(),fi=0,pi=class{constructor(){document.body?this._liveElement=this._createLiveElement():document.addEventListener(`DOMContentLoaded`,()=>{this._liveElement=this._createLiveElement()})}announce(e,...t){if(!this._liveElement)return Promise.resolve();let n={},r,i;return t.length===1&&typeof t[0]==`number`?i=t[0]:[r,i]=t,this.clear(),clearTimeout(this._previousTimeout),r??=n?.politeness??`polite`,i??=n?.duration,this._liveElement.setAttribute(`aria-live`,r),this._currentPromise??=new Promise(e=>this._currentResolve=e),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{this._liveElement.textContent=e,typeof i==`number`&&(this._previousTimeout=setTimeout(()=>this.clear(),i)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise}clear(){this._liveElement&&(this._liveElement.textContent=``)}destroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let e=`sbb-live-announcer-element`,t=document.getElementsByClassName(e),n=document.createElement(`div`);for(let e=0;e<t.length;e++)t[e].remove();return n.classList.add(e),n.classList.add(`sbb-screen-reader-only`),n.setAttribute(`aria-atomic`,`true`),n.setAttribute(`aria-live`,`polite`),n.id=`sbb-live-announcer-${fi++}`,document.body.appendChild(n),n}},mi=new pi})),gi=e((()=>{Rr(),Vr(),Jr(),Xr(),di(),li(),qr(),hi()})),_i,vi,yi,bi,xi,Si,Ci=e((()=>{o(),M(),_i=e=>{throw TypeError(e)},vi=(e,t,n)=>t.has(e)||_i(`Cannot `+n),yi=(e,t,n)=>(vi(e,t,`read from private field`),n?n.call(e):t.get(e)),bi=(e,t,n)=>t.has(e)?_i(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),xi=(e,t,n,r)=>(vi(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Si=e=>(()=>{var t,n;let r=e,o=[],s;return n=class extends r{constructor(){super(...arguments),bi(this,t,(a(this,o),!1))}set readOnly(e){xi(this,t,!!e),this.toggleAttribute(`readonly`,yi(this,t))}get readOnly(){return yi(this,t)}},t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;s=[A({type:Boolean,attribute:`readonly`})],i(n,null,s,{kind:`setter`,name:`readOnly`,static:!1,private:!1,access:{has:e=>`readOnly`in e,set:(e,t)=>{e.readOnly=t}},metadata:e},null,o),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n})()})),wi,Ti,Ei,Di=e((()=>{o(),I(),M(),gi(),z(),U(),H(),ln(),mn(),Dr(),Ci(),kr(),wi=()=>{let e=document.createElement(`div`);return e.setAttribute(`contenteditable`,`PLAINTEXT-ONLY`),e.contentEditable===`plaintext-only`},Ti=wi(),Ei=e=>(()=>{var t;let n=Si(V(Or(Er(pn(e))))),r=[],o,s,c;return t=class extends n{get type(){return`text`}set value(e){this._value=this._cleanText(e),this.hasUpdated&&this._assignValue(this._value),this.dispatchEvent(new Event(`displayvaluechange`,{bubbles:!0,composed:!0}))}get value(){return this._value??``}set placeholder(e){e?this.setAttribute(`placeholder`,e):this.removeAttribute(`placeholder`),this.internals.ariaPlaceholder=e||null}get placeholder(){return this.getAttribute(`placeholder`)??``}constructor(){super(),this._shouldEmitChange=(a(this,r),!1),this._shouldTriggerSubmit=!1,this.language=new R(this),this._value=``,this.addEventListener?.(`input`,()=>{let e=this._value;this._value=this._cleanText(this.textContent??``),this.requestUpdate(`value`,e),this.internals.states.add(`interacted`),this._shouldEmitChange=!0},{capture:!0}),this.addEventListener?.(`change`,()=>this._shouldEmitChange=!1,{capture:!0}),this.addEventListener?.(`keydown`,e=>{if(this._requiresEmptyPatch()&&this._assignValue(``),(e.key===`Enter`||e.key===`
`)&&e.isTrusted)e.preventDefault(),e.stopImmediatePropagation(),this._shouldTriggerSubmit=this.dispatchEvent(new KeyboardEvent(`keydown`,e));else if(mr&&this.value&&(e.key===`Backspace`||e.key===`Delete`)&&e.isTrusted){if(e.preventDefault(),e.stopImmediatePropagation(),!this.dispatchEvent(new KeyboardEvent(`keydown`,e)))return;let t=window.getSelection()?.getRangeAt(0);if(!t)return;t.startOffset===t.endOffset?e.key===`Backspace`&&t.startOffset>0?(t.setStart(t.startContainer,t.startOffset-1),t.deleteContents(),this._dispatchInputEvent()):e.key===`Delete`&&t.endOffset<this.value.length&&(t.setEnd(t.endContainer,t.endOffset+1),t.deleteContents(),this._dispatchInputEvent()):(t.deleteContents(),this._dispatchInputEvent())}},{capture:!0}),this.addEventListener?.(`keyup`,e=>{e.key===`Enter`||e.key===`
`?(this._emitChangeIfNecessary(),this._shouldTriggerSubmit&&(this._shouldTriggerSubmit=!1,this.form?.requestSubmit())):this._requiresEmptyPatch()&&this._setCursorAt(0)},{capture:!0}),this.addEventListener?.(`paste`,e=>{e.preventDefault(),this._requiresEmptyPatch()&&this._assignValue(``);let t=this._cleanText(e.clipboardData?.getData(`text/plain`)??``),n=window.getSelection()?.getRangeAt(0);!n||!t||(n.deleteContents(),n.insertNode(document.createTextNode(this.preparePastedText(t))),n.setStart(n.endContainer,n.endOffset),this._dispatchInputEvent())}),this.addEventListener?.(`focus`,()=>{Kr.mostRecentModality===`keyboard`&&window.getSelection()?.selectAllChildren(this)}),this.addEventListener?.(`touchend`,()=>{this._requiresEmptyPatch()&&(this._assignValue(`&nbsp;`),this._setCursorAt(0))}),this.addEventListener?.(`click`,()=>{this._requiresEmptyPatch()&&Kr.mostRecentModality===`touch`&&this._setCursorAt(0)}),this.addEventListener?.(`blur`,()=>{window.getSelection()?.removeAllRanges(),this.value===``&&this._assignValue(``),this._emitChangeIfNecessary(),this.scrollLeft=0},{capture:!0})}isDisabledExternally(){return this.formDisabled}connectedCallback(){super.connectedCallback(),this.internals.ariaMultiLine=`false`,this._updateContenteditable(),this._assignValue(this.value)}focus(e){if(super.focus(e),this._canSelect()){let e=window.getSelection();if(!e)return;let t=e.rangeCount>0?e.getRangeAt(0):null;if(t&&t.startOffset!==0)return;this._setCursorAt(this.textContent.length)}}attributeChangedCallback(e,t,n){(e!==`value`||!this.internals.states.has(`interacted`))&&super.attributeChangedCallback(e,t,n)}formResetCallback(){this.internals.states.delete(`interacted`),this.value=this.getAttribute(`value`)??``}formStateRestoreCallback(e,t){e&&typeof e==`string`&&(this.value=e)}select(){window.getSelection()?.selectAllChildren(this)}firstUpdated(e){super.firstUpdated(e),this.value&&!this.innerHTML.length&&this._assignValue(this.value)}requestUpdate(e,t,n){super.requestUpdate(e,t,n),this.isConnected&&(e===`disabled`||e===`formDisabled`||e===`readOnly`)&&this._updateContenteditable()}shouldValidate(e){return super.shouldValidate(e)||e===`value`||e===`required`}validate(){super.validate(),this.required&&!this.value?this.setValidityFlag(`valueMissing`,Hn[this.language.current]):this.removeValidityFlag(`valueMissing`)}preparePastedText(e){return e}_requiresEmptyPatch(){return pr&&this.value===``&&window.matchMedia(`(pointer: coarse)`).matches}_assignValue(e){this.innerHTML=e}_setCursorAt(e){let t=window.getSelection();if(!t)return;let n=document.createRange();n.setStart(this.firstChild,e),n.collapse(!0),t.removeAllRanges(),t.addRange(n)}_cleanText(e){return e===null?``:`${e}`.replace(/[\n\r]+/g,``)}_dispatchInputEvent(){this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))}_cleanChildren(){if(this.childElementCount)for(let e of this.children)e.remove()}_updateContenteditable(){if(this.isConnected){this.internals.ariaReadOnly=this.readOnly?`true`:null,this.internals.ariaDisabled=this.disabled?`true`:null;let e=this.disabled||this.readOnly?`false`:Ti?`plaintext-only`:`true`;this.setAttribute(`contenteditable`,e),this.readOnly?this.setAttribute(`tabindex`,`0`):this.removeAttribute(`tabindex`)}}_emitChangeIfNecessary(){this._shouldEmitChange&&(this._shouldEmitChange=!1,this.dispatchEvent(new Event(`change`,{bubbles:!0})))}_canSelect(){return!this.disabled&&!this.readOnly&&!!this.value}render(){return N`<slot @slotchange=${this._cleanChildren}></slot>`}},(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;o=[A()],s=[A({attribute:!1})],c=[le({passive:!0})],i(t,null,o,{kind:`setter`,name:`value`,static:!1,private:!1,access:{has:e=>`value`in e,set:(e,t)=>{e.value=t}},metadata:e},null,r),i(t,null,s,{kind:`setter`,name:`placeholder`,static:!1,private:!1,access:{has:e=>`placeholder`in e,set:(e,t)=>{e.placeholder=t}},metadata:e},null,r),i(t,null,c,{kind:`method`,name:`_cleanChildren`,static:!1,private:!1,access:{has:e=>`_cleanChildren`in e,get:e=>e._cleanChildren},metadata:e},null,r),e&&Object.defineProperty(t,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t.role=`textbox`,t.formFieldAssociated=!0,t})()})),Oi=e((()=>{I(),M(),gi(),z(),ln(),mn(),Dr(),kr()})),ki,Ai=e((()=>{ki=e=>{class t extends e{get hydrationComplete(){return this._hydrationComplete}get hydrationRequired(){return this._hydrationRequired}constructor(...e){if(super(...e),this._hydrationComplete=new Promise(e=>this._resolveHydration=e),this._hydrationRequired=!!this.shadowRoot,!this._hydrationRequired)this._resolveHydration(!1);else{let e=e=>{this._hydrationRequired&&e.stopImmediatePropagation()},t={capture:!0},n=this.shadowRoot?.querySelectorAll(`slot`);n?.length&&(n.forEach(n=>n.addEventListener(`slotchange`,e,t)),this.hydrationComplete.then(()=>n.forEach(n=>{n.removeEventListener(`slotchange`,e,t),n.assignedNodes().length&&n.dispatchEvent(new Event(`slotchange`,{bubbles:!0}))})))}}update(e){super.update(e),this._hydrationRequired&&(this._hydrationRequired=!1,this._resolveHydration(!0))}}return t}})),ji,Mi=e((()=>{o(),I(),M(),ji=h`:host{border:0;clip-path:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}`,(()=>{var e;let t=[s(`sbb-screen-reader-only`)],n,r=[],o,c=F;return e=class extends c{render(){return N`<slot></slot>`}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=ji,a(o,r),o})()})),Ni=e((()=>{Mi()})),Pi,Fi,Ii,Li,Ri,zi,Bi,Vi,Hi=e((()=>{o(),I(),M(),Ai(),Ni(),Pi=e=>{throw TypeError(e)},Fi=(e,t,n)=>t.has(e)||Pi(`Cannot `+n),Ii=(e,t,n)=>(Fi(e,t,`read from private field`),n?n.call(e):t.get(e)),Li=(e,t,n)=>t.has(e)?Pi(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Ri=(e,t,n,r)=>(Fi(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),zi=`data-ssr-child-count`,Bi=`li`,Vi=e=>(()=>{var t,n;let r=ki(e),o,s=[],c=[];return n=class extends r{constructor(){super(...arguments),Li(this,t),Ri(this,t,a(this,s,[])),this._handleSlotchange=(a(this,c),()=>{let e=Array.from(this.children??[]).filter(e=>this.listChildLocalNames.includes(e.localName));e.length===this.listChildren.length&&this.listChildren.every((t,n)=>e[n]===t)||(this.listChildren.filter(t=>!e.includes(t)).forEach(e=>e.removeAttribute(`slot`)),this.listChildren=e,this.listChildren.forEach((e,t)=>e.setAttribute(`slot`,`${Bi}-${t}`)),this.removeAttribute(zi))})}get listChildren(){return Ii(this,t)}set listChildren(e){Ri(this,t,e)}connectedCallback(){super.connectedCallback(),this.shadowRoot?.addEventListener(`slotchange`,this._handleSlotchange,{passive:!0})}disconnectedCallback(){super.disconnectedCallback(),this.shadowRoot?.removeEventListener(`slotchange`,this._handleSlotchange)}renderList(e={},t={}){let n=this.listSlotEntries(t);return n.length>=2?N`
          <ul
            class=${e.class||this.localName}
            aria-label=${e.ariaLabel||P}
            aria-labelledby=${e.ariaLabelledby||P}
          >
            ${n.map(e=>N`
                <li aria-hidden=${e.ariaHidden||P}>
                  <slot name=${e.name}></slot>
                </li>
              `)}
          </ul>
          ${this.renderHiddenSlot()}
        `:n.length===1?N`<sbb-screen-reader-only>${e.ariaLabel}</sbb-screen-reader-only>
          <span class=${e.class||this.localName}>
            <span><slot name=${n[0].name}></slot></span>
          </span>
          ${this.renderHiddenSlot()} `:this.renderHiddenSlot()}listSlotEntries(e){return(this.listChildren.length?this.listChildren:Array.from({length:+(this.getAttribute(zi)??0)})).map((t,n)=>({name:`${Bi}-${n}`,ariaHidden:e?.localNameVisualOnly?.includes(t.localName)??!1}))}renderHiddenSlot(){return N`<span hidden><slot></slot></span>`}},t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;o=[j()],i(n,null,o,{kind:`accessor`,name:`listChildren`,static:!1,private:!1,access:{has:e=>`listChildren`in e,get:e=>e.listChildren,set:(e,t)=>{e.listChildren=t}},metadata:e},s,c),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n})()})),Ui,Wi,Gi,Ki,qi,W,Ji=e((()=>{o(),M(),B(),Ui=e=>{throw TypeError(e)},Wi=(e,t,n)=>t.has(e)||Ui(`Cannot `+n),Gi=(e,t,n)=>(Wi(e,t,`read from private field`),n?n.call(e):t.get(e)),Ki=(e,t,n)=>t.has(e)?Ui(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),qi=(e,t,n,r)=>(Wi(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),W=e=>(()=>{var t,n;let r=e,o,s=[],c=[];return n=class extends r{constructor(){super(...arguments),Ki(this,t,a(this,s,!1)),a(this,c)}get negative(){return Gi(this,t)}set negative(e){qi(this,t,e)}},t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;o=[L(),A({reflect:!0,type:Boolean})],i(n,null,o,{kind:`accessor`,name:`negative`,static:!1,private:!1,access:{has:e=>`negative`in e,get:e=>e.negative,set:(e,t)=>{e.negative=t}},metadata:e},s,c),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n})()})),Yi=e((()=>{M(),B()})),Xi=e((()=>{I(),M(),B(),mn()})),Zi,Qi=e((()=>{Zi=e=>{class t extends e{constructor(){super(...arguments),this._updatePromise=Promise.resolve(),this._updateResolve=()=>{}}startUpdate(){this._updatePromise=new Promise(e=>this._updateResolve=e)}completeUpdate(){this._updateResolve()}async getUpdateComplete(){let e=await super.getUpdateComplete();return await this._updatePromise,e}}return t}})),G=e((()=>{ln(),mn(),Ar(),Di(),Dr(),Oi(),Ai(),Hi(),Ji(),Yi(),kr(),Ci(),Xi(),Qi(),I(),h`:host{--sbb-selection-panel-background: var( --sbb-selection-panel-inner-background, var(--sbb-background-color-1) );--sbb-selection-panel-border-color: var(--sbb-border-color-4-inverted);--sbb-selection-panel-border-radius: var( --sbb-selection-expansion-panel-border-radius, var(--sbb-border-radius-4x) );--sbb-selection-panel-border-width: var( --sbb-selection-panel-inner-border-width, var(--sbb-border-width-1x) );--sbb-selection-panel-input-padding: var(--sbb-spacing-responsive-xs) var(--sbb-spacing-responsive-xxs);--sbb-selection-panel-animation-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-4x) );--sbb-selection-panel-cursor: pointer;--sbb-selection-panel-suffix-color: var(--sbb-color-3);--sbb-selection-panel-subtext-color: var(--sbb-color-granite);--sbb-selection-panel-subtext-color: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));display:block;outline:none!important}:host([size=s]){--sbb-selection-panel-input-padding: var(--sbb-spacing-responsive-xxs) var(--sbb-spacing-responsive-xxxs)}:host([color=milk]){--sbb-selection-panel-background: var( --sbb-selection-panel-inner-background, var(--sbb-background-color-3) )}:host([borderless]:not([data-checked])){--sbb-selection-panel-border-color: transparent}:host(:is([data-checked]):not(:disabled,[disabled])){--sbb-selection-panel-border-color: var(--sbb-border-color-3);--sbb-selection-panel-border-width: var( --sbb-selection-panel-inner-border-width, var(--sbb-border-width-2x) )}:host(:is(:disabled,[disabled])){--sbb-selection-panel-cursor: default}.sbb-selection-panel{display:block;cursor:var(--sbb-selection-panel-cursor);position:relative;border-radius:var(--sbb-selection-panel-border-radius);box-shadow:inset 0 0 0 var(--sbb-selection-panel-border-width) var(--sbb-selection-panel-border-color);padding:var(--sbb-selection-panel-input-padding);background-color:var(--sbb-selection-panel-background);transition-duration:var(--sbb-selection-panel-animation-duration);transition-timing-function:var(--sbb-animation-easing);transition-property:box-shadow}@media(forced-colors:active){.sbb-selection-panel:after{content:"";display:block;position:absolute;inset:0;pointer-events:none;border:var(--sbb-selection-panel-border-width) solid var(--sbb-selection-panel-border-color);border-radius:var(--sbb-selection-panel-border-radius)}}:host(:focus-visible) .sbb-selection-panel{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}.sbb-selection-panel__badge{-webkit-user-select:none;user-select:none;pointer-events:none;position:absolute;inset:0;border-radius:var(--sbb-selection-panel-border-radius);overflow:hidden}slot[name=suffix]{color:var(--sbb-selection-panel-suffix-color)}slot[name=subtext]{display:block;color:var(--sbb-selection-panel-subtext-color);padding-inline-start:var(--sbb-spacing-fixed-8x)}:host(:not([data-slot-names~=subtext])) slot[name=subtext]{display:none}`})),$i,ea=e((()=>{o(),I(),B(),G(),$i=(()=>{var e;let t=[dt({"data-action":``})],n,r=[],o,s=pn(F);return e=class extends s{get maybeDisabled(){let e=this;return e.disabled||e.formDisabled}get maybeDisabledInteractive(){return this.disabledInteractive}connectedCallback(){super.connectedCallback()}setupBaseEventHandlers(){this.addEventListener(`click`,e=>{this.maybeDisabled&&!this.maybeDisabledInteractive&&(e.preventDefault(),e.stopImmediatePropagation())},{capture:!0})}renderTemplate(){throw Error(`Implementation needed!`)}render(){return N`<span class="sbb-action-base ${this.localName}">${this.renderTemplate()}</span>`}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(s[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e}),a(o,r)})(),o})()})),ta,na,ra,ia,aa,oa,sa,ca=e((()=>{o(),I(),M(),B(),xn(),G(),ea(),ta=e=>{throw TypeError(e)},na=(e,t,n)=>t.has(e)||ta(`Cannot `+n),ra=(e,t,n)=>(na(e,t,`read from private field`),n?n.call(e):t.get(e)),ia=(e,t,n)=>t.has(e)?ta(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),aa=(e,t,n,r)=>(na(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),oa=(()=>{var e;let t=[dt({tabindex:`0`,"data-button":``})],n,r=[],o,s=Er($i);return e=class extends s{constructor(){if(super(),this._preventScrollOnSpaceKeydown=e=>{e.key===` `&&(e.preventDefault(),e.target.toggleAttribute(`data-active`,!0))},this._removeActiveMarker=e=>{e.target.removeAttribute(`data-active`)},this._dispatchClickEventOnSpaceKeyup=e=>{e.key===` `&&(this._removeActiveMarker(e),this._dispatchClickEvent(e))},this._dispatchClickEvent=e=>{let{altKey:t,ctrlKey:n,metaKey:r,shiftKey:i}=e;e.target.dispatchEvent(new PointerEvent(`click`,{bubbles:!0,cancelable:!0,composed:!0,pointerId:-1,pointerType:``,altKey:t,ctrlKey:n,metaKey:r,shiftKey:i}))},!0){this.setupBaseEventHandlers();let e={passive:!0};this.addEventListener(`keydown`,this._preventScrollOnSpaceKeydown),this.addEventListener(`keyup`,this._dispatchClickEventOnSpaceKeyup,e),this.addEventListener(`blur`,this._removeActiveMarker,e),this.addEventListener(`keypress`,e=>{(e.key===`Enter`||e.key===`
`)&&this._dispatchClickEvent(e)},e)}}attributeChangedCallback(e,t,n){(![`name`,`value`].includes(e)||t!==n)&&super.attributeChangedCallback(e,t,n)}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(s[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.role=`button`,a(o,r),o})(),sa=(()=>{var e,t;let n=oa,r=[],o,s=[],c=[],l,u;return t=class extends n{constructor(){super(),ia(this,e),this._elementsOnWhichEnterPressTriggersSubmit=(a(this,r),[`input`,`sbb-date-input`,`sbb-time-input`]),aa(this,e,a(this,s,``)),this._formId=(a(this,c),``),this._handleButtonClick=async e=>{if(this.type===`button`||await yn(e))return;let t=this.form;if(t)this.type===`submit`?this._requestSubmit(t):this.type===`reset`&&t.reset();else return},this._formKeyDown=e=>{let t=this.form;this.type===`submit`&&t&&(e.key===`Enter`||e.key===`
`)&&this._elementsOnWhichEnterPressTriggersSubmit.includes(e.target?.localName)&&e.isTrusted&&(e.stopImmediatePropagation(),e.preventDefault(),e.composedPath()[0].dispatchEvent(new KeyboardEvent(e.type,e))&&!this.matches(`:disabled`)&&this._requestSubmit(t))},this.addEventListener(`click`,this._handleButtonClick)}get value(){return ra(this,e)}set value(t){aa(this,e,t)}set type(e){this.setAttribute(`type`,`${e}`)}get type(){return this.getAttribute(`type`)??`button`}set form(e){this._formId=e,this.form?.addEventListener(`keydown`,this._formKeyDown,{capture:!0})}get form(){return this._formId?this.getRootNode?.()?.getElementById?.(this._formId)??null:this.internals.form}connectedCallback(){super.connectedCallback(),this.form?.addEventListener(`keydown`,this._formKeyDown,{capture:!0})}disconnectedCallback(){super.disconnectedCallback(),this.form?.removeEventListener(`keydown`,this._formKeyDown,{capture:!0})}_requestSubmit(e){let t=document.createElement(`button`);t.inert=!0,t.hidden=!0,t.name=this.name,t.value=this.value??``,e.append(t),e.requestSubmit(t),t.remove()}formResetCallback(){}formStateRestoreCallback(e,t){}updateFormValue(){}},e=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;o=[L(),A()],l=[A()],u=[A()],i(t,null,o,{kind:`accessor`,name:`value`,static:!1,private:!1,access:{has:e=>`value`in e,get:e=>e.value,set:(e,t)=>{e.value=t}},metadata:e},s,c),i(t,null,l,{kind:`setter`,name:`type`,static:!1,private:!1,access:{has:e=>`type`in e,set:(e,t)=>{e.type=t}},metadata:e},null,r),i(t,null,u,{kind:`setter`,name:`form`,static:!1,private:!1,access:{has:e=>`form`in e,set:(e,t)=>{e.form=t}},metadata:e},null,r),e&&Object.defineProperty(t,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t})()})),la,ua,da,fa,K,pa,ma=e((()=>{o(),I(),M(),z(),B(),H(),ea(),Ni(),la=e=>{throw TypeError(e)},ua=(e,t,n)=>t.has(e)||la(`Cannot `+n),da=(e,t,n)=>(ua(e,t,`read from private field`),n?n.call(e):t.get(e)),fa=(e,t,n)=>t.has(e)?la(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),K=(e,t,n,r)=>(ua(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),pa=(()=>{var e,t,n,r,o,s,c;let l=[dt({"data-link":``})],u,d=[],f,p=$i,m,h=[],g=[],_,v=[],y=[],b,x=[],S=[],C,ee=[],w=[],T,te=[],ne=[],E,D=[],O=[];return c=class extends p{constructor(){super(),fa(this,e),fa(this,t),fa(this,n),fa(this,r),fa(this,o),fa(this,s),K(this,e,a(this,h,``)),K(this,t,(a(this,g),a(this,v,``))),K(this,n,(a(this,y),a(this,x,``))),K(this,r,(a(this,S),a(this,ee,!1))),K(this,o,(a(this,w),a(this,te,``))),K(this,s,(a(this,ne),a(this,D,``))),this.language=(a(this,O),new R(this)),this.anchorRole=null,this._evaluateRelAttribute=()=>this.rel?this.rel:this.target===`_blank`?`external noopener nofollow`:P,this.setupBaseEventHandlers()}get href(){return da(this,e)}set href(t){K(this,e,t)}get target(){return da(this,t)}set target(e){K(this,t,e)}get rel(){return da(this,n)}set rel(e){K(this,n,e)}get download(){return da(this,r)}set download(e){K(this,r,e)}get accessibilityLabel(){return da(this,o)}set accessibilityLabel(e){K(this,o,e)}get accessibilityCurrent(){return da(this,s)}set accessibilityCurrent(e){K(this,s,e)}focus(e){this.shadowRoot.querySelector(`a`)?.focus(e)}blur(){this.shadowRoot.querySelector(`a`)?.blur()}click(){this.shadowRoot.querySelector(`a`)?.click()}render(){return this.renderLink(this.renderTemplate())}renderLink(e){return N`
      <a
        class="sbb-action-base ${this.localName}"
        href=${this.href||P}
        ?download=${this.download}
        target=${this.target||P}
        rel=${this._evaluateRelAttribute()}
        role=${this.anchorRole||P}
        aria-label=${this.accessibilityLabel||P}
        aria-current=${this.accessibilityCurrent||P}
        tabindex=${this.maybeDisabled&&!this.maybeDisabledInteractive?`-1`:P}
        aria-disabled=${this.maybeDisabled?`true`:P}
      >
        ${e}
        ${this.href&&this.target===`_blank`?N`<sbb-screen-reader-only
              >. ${Cn[this.language.current]}</sbb-screen-reader-only
            >`:P}
      </a>
    `}},e=new WeakMap,t=new WeakMap,n=new WeakMap,r=new WeakMap,o=new WeakMap,s=new WeakMap,f=c,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(p[Symbol.metadata]??null):void 0;m=[L(),A({reflect:!0,converter:_t})],_=[L(),A({reflect:!0,converter:_t})],b=[L(),A({reflect:!0,converter:_t})],C=[L(),A({type:Boolean,reflect:!0})],T=[L(),A({attribute:`accessibility-label`})],E=[L(),A({attribute:`accessibility-current`})],i(c,null,m,{kind:`accessor`,name:`href`,static:!1,private:!1,access:{has:e=>`href`in e,get:e=>e.href,set:(e,t)=>{e.href=t}},metadata:e},h,g),i(c,null,_,{kind:`accessor`,name:`target`,static:!1,private:!1,access:{has:e=>`target`in e,get:e=>e.target,set:(e,t)=>{e.target=t}},metadata:e},v,y),i(c,null,b,{kind:`accessor`,name:`rel`,static:!1,private:!1,access:{has:e=>`rel`in e,get:e=>e.rel,set:(e,t)=>{e.rel=t}},metadata:e},x,S),i(c,null,C,{kind:`accessor`,name:`download`,static:!1,private:!1,access:{has:e=>`download`in e,get:e=>e.download,set:(e,t)=>{e.download=t}},metadata:e},ee,w),i(c,null,T,{kind:`accessor`,name:`accessibilityLabel`,static:!1,private:!1,access:{has:e=>`accessibilityLabel`in e,get:e=>e.accessibilityLabel,set:(e,t)=>{e.accessibilityLabel=t}},metadata:e},te,ne),i(c,null,E,{kind:`accessor`,name:`accessibilityCurrent`,static:!1,private:!1,access:{has:e=>`accessibilityCurrent`in e,get:e=>e.accessibilityCurrent,set:(e,t)=>{e.accessibilityCurrent=t}},metadata:e},D,O),i(null,u={value:f},l,{kind:`class`,name:f.name,metadata:e},null,d),f=u.value,e&&Object.defineProperty(f,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e}),a(f,d)})(),f})()})),ha,ga,_a=e((()=>{I(),G(),ha=class extends pn(F){set state(e){this.setAttribute(`data-state`,e)}get state(){return this.getAttribute(`data-state`)}get isOpen(){return this.state===`opened`}connectedCallback(){super.connectedCallback(),this.state||=`closed`}escapeStrategy(){this.close()}dispatchBeforeOpenEvent(){return this.dispatchEvent(new Event(`beforeopen`,{cancelable:!0}))}dispatchOpenEvent(){return this.dispatchEvent(new Event(`open`))}dispatchBeforeCloseEvent(){return this.dispatchEvent(new Event(`beforeclose`,{cancelable:!0}))}dispatchCloseEvent(){return this.dispatchEvent(new Event(`close`))}},ha.events={beforeopen:`beforeopen`,open:`open`,beforeclose:`beforeclose`,close:`close`},ga=ha})),q=e((()=>{ea(),ca(),ma(),_a()})),va,ya,ba,xa,Sa,Ca=e((()=>{nt(),va=Symbol.for(``),ya=e=>{if(e?.r===va)return e?._$litStatic$},ba=new Map,xa=e=>(t,...n)=>{let r=n.length,i,a,o=[],s=[],c,l=0,u=!1;for(;l<r;){for(c=t[l];l<r&&(a=n[l],i=ya(a))!==void 0;)c+=i+t[++l],u=!0;l!==r&&s.push(a),o.push(c),l++}if(l===r&&o.push(t[r]),u){let e=o.join(`$$lit$$`);(t=ba.get(e))===void 0&&(o.raw=o,ba.set(e,t=o)),n=s}return e(t,...n)},Sa=xa(N),xa(ze),xa(Be)})),wa=e((()=>{Ca()})),Ta,Ea,Da,Oa=e((()=>{Ta={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ea=e=>(...t)=>({_$litDirective$:e,values:t}),Da=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}})),ka,Aa,ja=e((()=>{nt(),Oa(),ka=class extends Da{constructor(e){if(super(e),this.it=P,e.type!==Ta.CHILD)throw Error(this.constructor.directiveName+`() can only be used in child bindings`)}render(e){if(e===P||e==null)return this._t=void 0,this.it=e;if(e===Ve)return e;if(typeof e!=`string`)throw Error(this.constructor.directiveName+`() called with a non-string value`);if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}},ka.directiveName=`unsafeHTML`,ka.resultType=1,Aa=Ea(ka)})),Ma=e((()=>{ja()})),Na,Pa,Fa,Ia=e((()=>{nt(),{I:Na}=$e,Pa=e=>e===null||typeof e!=`object`&&typeof e!=`function`,Fa=e=>e.strings===void 0}));function La(e){this._$AN===void 0?this._$AM=e:(Ba(this),this._$AM=e,Va(this))}function Ra(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let e=n;e<r.length;e++)za(r[e],!1),Ba(r[e]);else r!=null&&(za(r,!1),Ba(r));else za(this,e)}var za,Ba,Va,Ha,Ua,Wa=e((()=>{Ia(),Oa(),za=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),za(e,t);return!0},Ba=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Va=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Ha(t)}},Ha=e=>{e.type==Ta.CHILD&&(e._$AP??=Ra,e._$AQ??=La)},Ua=class extends Da{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),Va(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(za(this,e),Ba(this))}setValue(e){if(Fa(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}})),Ga,Ka,qa=e((()=>{Ga=class{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}},Ka=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise((e=>this.Z=e))}resume(){this.Z?.(),this.Y=this.Z=void 0}}})),Ja,Ya,Xa,Za,Qa=e((()=>{nt(),Ia(),Wa(),qa(),Oa(),Ja=e=>!Pa(e)&&typeof e.then==`function`,Ya=1073741823,Xa=class extends Ua{constructor(){super(...arguments),this._$Cwt=Ya,this._$Cbt=[],this._$CK=new Ga(this),this._$CX=new Ka}render(...e){return e.find((e=>!Ja(e)))??Ve}update(e,t){let n=this._$Cbt,r=n.length;this._$Cbt=t;let i=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){let o=t[e];if(!Ja(o))return this._$Cwt=e,o;e<r&&o===n[e]||(this._$Cwt=Ya,r=0,Promise.resolve(o).then((async e=>{for(;a.get();)await a.get();let t=i.deref();if(t!==void 0){let n=t._$Cbt.indexOf(o);n>-1&&n<t._$Cwt&&(t._$Cwt=n,t.setValue(e))}})))}return Ve}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},Za=Ea(Xa)})),$a=e((()=>{Qa()})),eo,to,no,ro=e((()=>{eo=e=>typeof e==`string`,to=e=>{if(e.nodeType===1){if(e.nodeName.toLowerCase()===`script`)return!1;for(let t=0;t<e.attributes.length;t++){let n=e.attributes[t].name;if(eo(n)&&n.toLowerCase().indexOf(`on`)===0)return!1}for(let t=0;t<e.childNodes.length;t++)if(!to(e.childNodes[t]))return!1}return!0},no=(e,t=!0,n=!1)=>{let r=document.createElement(`div`);r.innerHTML=e;for(let e=r.childNodes.length-1;e>=0;e--)r.childNodes[e].nodeName.toLowerCase()!==`svg`&&r.removeChild(r.childNodes[e]);let i=r.firstElementChild;return i&&i.nodeName.toLowerCase()===`svg`&&(n&&!i.classList.contains(`color-immutable`)&&i.classList.add(`color-immutable`),t===!1||to(i))?r.innerHTML:``}})),io,ao,oo,so,co=e((()=>{I(),xt(),ro(),io=`https://icons.app.sbb.ch/`,ao=new Map().set(`default`,`${io}icons/`).set(`picto`,`${io}picto/`),oo=new Map,so=(e,t,n)=>{let r=yt().icon??{},i=r.namespaces?.get(e)??ao.get(e);if(i==null)throw Error(`Unable to find the namespace "${e}". Please register your custom namespace.`);let a=`${i}${t}.svg`,o=oo.get(a);if(!o)if(typeof fetch<`u`)o=(r.interceptor??(e=>e.request()))({namespace:e,name:t,url:a,request:()=>fetch(a).then(async r=>{if(!r.ok)throw Error(`Failed to load icon ${e}:${t}`);return no(await r.text(),n)}).catch(e=>{throw Error(e)})}),oo.set(a,o);else return Promise.resolve(``);return o}})),lo,uo,fo,po,mo,ho,go,_o,vo=e((()=>{o(),I(),M(),Ma(),$a(),B(),G(),co(),lo=e=>{throw TypeError(e)},uo=(e,t,n)=>t.has(e)||lo(`Cannot `+n),fo=(e,t,n)=>(uo(e,t,`read from private field`),n?n.call(e):t.get(e)),po=(e,t,n)=>t.has(e)?lo(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),mo=(e,t,n,r)=>(uo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),ho=h`*,:before,:after{box-sizing:border-box}:host{display:inline-block;line-height:0;-webkit-tap-highlight-color:transparent}:host([data-empty]){--sbb-icon-default-dimension: 0}:host([data-empty][data-namespace=default][name$=-extra-small]){--sbb-icon-default-dimension: var(--sbb-size-icon-ui-extra-small)}:host([data-empty][data-namespace=default][name$=-small]){--sbb-icon-default-dimension: var(--sbb-size-icon-ui-small)}:host([data-empty][data-namespace=default][name$=-medium]){--sbb-icon-default-dimension: var(--sbb-size-icon-ui-medium)}:host([data-empty][data-namespace=default][name$=-large]){--sbb-icon-default-dimension: var(--sbb-size-icon-ui-large)}svg{width:var(--sbb-icon-svg-width, var(--sbb-icon-default-dimension));height:var(--sbb-icon-svg-height, var(--sbb-icon-default-dimension));stroke:var(--sbb-icon-svg-stroke-color);stroke-width:var(--sbb-icon-svg-stroke-width)}svg:not(.color-immutable) [fill]:not([fill=none]){fill:currentcolor}svg:not(.color-immutable) [stroke]:not([stroke=none]){stroke:currentcolor}svg:not(.color-immutable)>:where(path,polygon,polyline):where(:not([stroke]):not([fill])),svg:not(.color-immutable) :where(:not([stroke]):not([fill])) :where(path,polygon,polyline):where(:not([stroke]):not([fill])){fill:currentcolor}`,go=`default`,_o=(()=>{var e,t,n,r;let o=[dt({"data-namespace":go,"data-empty":``})],s,c=[],l,u=pn(F),d,f=[],p=[],m,h=[],g=[],_,v=[],y=[];return r=class extends u{constructor(){super(...arguments),po(this,e,a(this,f,go)),po(this,t,(a(this,p),a(this,h,null))),po(this,n,(a(this,g),a(this,v,!1))),a(this,y)}get _svgNamespace(){return fo(this,e)}set _svgNamespace(t){mo(this,e,t)}get _svgIcon(){return fo(this,t)}set _svgIcon(e){mo(this,t,e)}get noSanitize(){return fo(this,n)}set noSanitize(e){mo(this,n,e)}async loadSvgIcon(e){if(!e)return;let[t,n]=this._splitIconName(e);this._svgNamespace=t,this.setAttribute(`data-namespace`,this._svgNamespace);let r=this.fetchSvgIcon(this._svgNamespace,n);this._svgIcon=r.then(e=>Aa(e));try{this.toggleAttribute(`data-empty`,!await r)}catch{this.toggleAttribute(`data-empty`,!0)}}async fetchSvgIcon(e,t){return await so(e,t,!this.noSanitize)}_splitIconName(e){if(!e)return[``,``];let t=e.split(`:`);switch(t.length){case 1:return[go,t[0]];case 2:return t;default:throw Error(`Invalid icon name: "${e}"`)}}render(){return N`<span class="sbb-icon-inner"
      >${Za(this._svgIcon,N`<svg width="0" height="0"></svg>`)}</span
    >`}},e=new WeakMap,t=new WeakMap,n=new WeakMap,l=r,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(u[Symbol.metadata]??null):void 0;d=[j()],m=[j()],_=[L(),A({attribute:`no-sanitize`,type:Boolean})],i(r,null,d,{kind:`accessor`,name:`_svgNamespace`,static:!1,private:!1,access:{has:e=>`_svgNamespace`in e,get:e=>e._svgNamespace,set:(e,t)=>{e._svgNamespace=t}},metadata:e},f,p),i(r,null,m,{kind:`accessor`,name:`_svgIcon`,static:!1,private:!1,access:{has:e=>`_svgIcon`in e,get:e=>e._svgIcon,set:(e,t)=>{e._svgIcon=t}},metadata:e},h,g),i(r,null,_,{kind:`accessor`,name:`noSanitize`,static:!1,private:!1,access:{has:e=>`noSanitize`in e,get:e=>e.noSanitize,set:(e,t)=>{e.noSanitize=t}},metadata:e},v,y),i(null,s={value:l},o,{kind:`class`,name:l.name,metadata:e},null,c),l=s.value,e&&Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),r.styles=ho,r.role=`img`,a(l,c),l})()})),yo,bo,xo,So,Co,wo=e((()=>{o(),I(),M(),B(),vo(),yo=e=>{throw TypeError(e)},bo=(e,t,n)=>t.has(e)||yo(`Cannot `+n),xo=(e,t,n)=>(bo(e,t,`read from private field`),n?n.call(e):t.get(e)),So=(e,t,n)=>t.has(e)?yo(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Co=(e,t,n,r)=>(bo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),(()=>{var e,t,n;let r=[s(`sbb-icon`)],o,c=[],l,u=_o,d,f=[],p=[],m,h=[],g=[];return n=class extends u{constructor(){super(...arguments),So(this,e,a(this,f,``)),So(this,t,(a(this,p),a(this,h,!1))),a(this,g)}static get observedAttributes(){return super.observedAttributes.concat(`svgicon`)}get name(){return xo(this,e)}set name(t){Co(this,e,t)}get _sbbAngularCompatibility(){return xo(this,t)}set _sbbAngularCompatibility(e){Co(this,t,e)}connectedCallback(){super.connectedCallback(),this.internals.ariaHidden=`true`}async fetchSvgIcon(e,t){return this.internals.ariaLabel=`Icon ${t.replace(/-/g,` `)}`,super.fetchSvgIcon(e,t)}willUpdate(e){super.willUpdate(e),e.has(`name`)&&this.name&&this.loadSvgIcon(this.name)}attributeChangedCallback(e,t,n){e===`svgicon`?this._sbbAngularCompatibility=!!n:super.attributeChangedCallback(e,t,n)}render(){return this._sbbAngularCompatibility?N`<slot></slot>`:super.render()}},e=new WeakMap,t=new WeakMap,l=n,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(u[Symbol.metadata]??null):void 0;d=[L(),A({reflect:!0,converter:_t})],m=[j()],i(n,null,d,{kind:`accessor`,name:`name`,static:!1,private:!1,access:{has:e=>`name`in e,get:e=>e.name,set:(e,t)=>{e.name=t}},metadata:e},f,p),i(n,null,m,{kind:`accessor`,name:`_sbbAngularCompatibility`,static:!1,private:!1,access:{has:e=>`_sbbAngularCompatibility`in e,get:e=>e._sbbAngularCompatibility,set:(e,t)=>{e._sbbAngularCompatibility=t}},metadata:e},h,g),i(null,o={value:l},r,{kind:`class`,name:l.name,metadata:e},null,c),l=o.value,e&&Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e}),a(l,c)})(),l})()})),To,Eo,Do,Oo,ko,Ao,jo=e((()=>{o(),I(),M(),B(),wo(),To=e=>{throw TypeError(e)},Eo=(e,t,n)=>t.has(e)||To(`Cannot `+n),Do=(e,t,n)=>(Eo(e,t,`read from private field`),n?n.call(e):t.get(e)),Oo=(e,t,n)=>t.has(e)?To(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),ko=(e,t,n,r)=>(Eo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ao=e=>(()=>{var t,n;let r=e,o,s=[],c=[];return n=class extends r{constructor(){super(...arguments),Oo(this,t,a(this,s,``)),a(this,c)}get iconName(){return Do(this,t)}set iconName(e){ko(this,t,e)}renderIconSlot(e){return N`
        <slot name="icon">
          ${this.iconName?N`<sbb-icon name=${this.iconName} class=${e||P}></sbb-icon>`:P}
        </slot>
      `}},t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;o=[L(),A({attribute:`icon-name`,reflect:!0,converter:_t})],i(n,null,o,{kind:`accessor`,name:`iconName`,static:!1,private:!1,access:{has:e=>`iconName`in e,get:e=>e.iconName,set:(e,t)=>{e.iconName=t}},metadata:e},s,c),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n})()})),Mo=e((()=>{wo(),vo(),co(),jo()})),No,Po,Fo,Io,Lo,J,Ro=e((()=>{o(),I(),M(),wa(),B(),U(),G(),Mo(),No=e=>{throw TypeError(e)},Po=(e,t,n)=>t.has(e)||No(`Cannot `+n),Fo=(e,t,n)=>(Po(e,t,`read from private field`),n?n.call(e):t.get(e)),Io=(e,t,n)=>t.has(e)?No(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Lo=(e,t,n,r)=>(Po(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),J=e=>(()=>{var t,n,r;let o=[dt({"data-sbb-button":``}),$t()],s,c=[],l,u=W(Ao(e)),d,f=[],p=[],m,h=[],g=[];return r=class extends u{constructor(){super(...arguments),Io(this,t,a(this,f,or()?`s`:`l`)),Io(this,n,(a(this,p),a(this,h,!1))),a(this,g)}get size(){return Fo(this,t)}set size(e){Lo(this,t,e)}get loading(){return Fo(this,n)}set loading(e){Lo(this,n,e)}willUpdate(e){if(super.willUpdate(e),e.has(`loading`))if(this.loading){this.internals.ariaBusy=`true`,this.internals.ariaDisabled=`true`;let e=this.offsetWidth;this.style?.setProperty(`--sbb-button-width`,`${e||136}px`)}else this.internals.ariaBusy=null,this.style?.removeProperty(`--sbb-button-width`),this.maybeDisabledInteractive||(this.internals.ariaDisabled=null)}renderTemplate(){return Sa`
        ${super.renderIconSlot()}
        <span class="sbb-button__label">
          <slot></slot>
        </span>
        ${this.loading&&!this.maybeDisabled?Sa`<div class="sbb-button-loading-border"></div>`:P}
      `}},t=new WeakMap,n=new WeakMap,l=r,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(u[Symbol.metadata]??null):void 0;d=[A({reflect:!0})],m=[L(),A({reflect:!0,type:Boolean})],i(r,null,d,{kind:`accessor`,name:`size`,static:!1,private:!1,access:{has:e=>`size`in e,get:e=>e.size,set:(e,t)=>{e.size=t}},metadata:e},f,p),i(r,null,m,{kind:`accessor`,name:`loading`,static:!1,private:!1,access:{has:e=>`loading`in e,get:e=>e.loading,set:(e,t)=>{e.loading=t}},metadata:e},h,g),i(null,s={value:l},o,{kind:`class`,name:l.name,metadata:e},null,c),l=s.value,e&&Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e}),a(l,c)})(),l})()})),Y,zo,Bo,Vo,Ho,Uo=e((()=>{I(),Y=h`*,:before,:after{box-sizing:border-box}:host{display:inline-block;outline:none!important;--sbb-button-icon-size: var(--sbb-size-icon-ui-small);--sbb-button-shadow-1-offset-y: var(--sbb-shadow-elevation-level-3-shadow-1-offset-y);--sbb-button-shadow-2-offset-y: var(--sbb-shadow-elevation-level-3-shadow-2-offset-y);--sbb-button-shadow-1-blur: var(--sbb-shadow-elevation-level-3-shadow-1-blur);--sbb-button-shadow-2-blur: var(--sbb-shadow-elevation-level-3-shadow-2-blur);--sbb-button-color-disabled-background: var(--sbb-background-color-3);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-color-disabled-text: light-dark( var(--sbb-color-granite), var(--sbb-color-aluminium) );--sbb-button-border-disabled-style: dashed;--sbb-button-border-width: var(--sbb-border-width-2x);--sbb-button-border-disabled-width: var(--sbb-border-width-1x);--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-min-height: var(--sbb-size-element-m);--sbb-button-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing);--sbb-button-padding-block-min: var(--sbb-spacing-fixed-1x);--sbb-button-padding-inline: var(--sbb-spacing-fixed-8x);--sbb-button-gap: var(--sbb-spacing-fixed-2x);--sbb-button-box-shadow: transparent 0 0;--sbb-button-box-shadow-definition: var(--sbb-shadow-elevation-level-3-shadow-2-offset-x) var(--sbb-button-shadow-2-offset-y) var(--sbb-button-shadow-2-blur) var(--sbb-shadow-elevation-level-3-shadow-2-spread) var(--sbb-button-shadow-2-color), var(--sbb-shadow-elevation-level-3-shadow-1-offset-x) var(--sbb-button-shadow-1-offset-y) var(--sbb-button-shadow-1-blur) var(--sbb-shadow-elevation-level-3-shadow-1-spread) var(--sbb-button-shadow-1-color);--sbb-button-loading-border-width: var(--sbb-border-width-3x);--sbb-button-loading-delay: .3s;--_width: unset;--_min-height-modifier: 0rem;--_border-color: var(--sbb-button-color-default-border);--_background-color: var(--sbb-button-color-default-background);--_color: var(--sbb-button-color-default-text);--_button-inset: 0;--_border: calc(var(--sbb-button-border-width) + var(--sbb-button-border-overlap-fix, 1px)) solid var(--_border-color)}@media(min-width:52.5rem){:host{--sbb-button-padding-inline: var(--sbb-spacing-fixed-10x)}}@media(forced-colors:active){:host{--sbb-button-color-default-border: CanvasText !important;--sbb-button-color-active-border: Highlight !important;--sbb-button-color-default-background: Canvas !important;--sbb-button-color-hover-background: Canvas !important;--sbb-button-color-active-background: Canvas !important;--sbb-button-color-disabled-background: Canvas !important;--sbb-button-color-disabled-text: GrayText !important;--sbb-button-color-loading-border: Highlight !important;--sbb-button-color-default-text: CanvasText !important;--sbb-button-color-hover-text: CanvasText !important;--sbb-button-color-active-text: CanvasText !important;--sbb-button-border-overlap-fix: 0rem}}@media(forced-colors:active){:host([data-button]){--sbb-button-color-default-text: ButtonText !important;--sbb-button-color-hover-text: ButtonText !important;--sbb-button-color-active-text: ButtonText !important}}@media(forced-colors:active){:host([data-link]){--sbb-button-color-default-text: LinkText !important;--sbb-button-color-hover-text: LinkText !important;--sbb-button-color-active-text: LinkText !important}}:host([negative]){--sbb-button-color-disabled-background: var(--sbb-background-color-3-negative);--sbb-button-color-disabled-text: var(--sbb-color-aluminium)}:host([size=m]){--sbb-button-min-height: var(--sbb-size-element-s);--sbb-button-padding-inline: var(--sbb-spacing-fixed-5x)}@media(min-width:52.5rem){:host([size=m]){--sbb-button-padding-inline: var(--sbb-spacing-fixed-8x)}}:host([size=s]){--sbb-button-min-height: var(--sbb-size-element-xs);--sbb-button-padding-inline: var(--sbb-spacing-fixed-4x);--sbb-button-gap: var(--sbb-spacing-fixed-1x)}@media(min-width:52.5rem){:host([size=s]){--sbb-button-padding-inline: var(--sbb-spacing-fixed-5x)}}:host(:where([data-slot-names~=icon],[icon-name]):not([data-slot-names~=unnamed])){--sbb-button-padding-inline: 0;--_width: calc(var(--sbb-button-min-height) + var(--_min-height-modifier))}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],:active,[data-active],[loading]):hover){--sbb-button-translate-y-content-hover: -.0625rem;--sbb-button-shadow-1-offset-y: calc( .5 * var(--sbb-shadow-elevation-level-3-shadow-1-offset-y) );--sbb-button-shadow-1-blur: calc(.5 * var(--sbb-shadow-elevation-level-3-shadow-1-blur));--sbb-button-shadow-2-blur: calc(.5 * var(--sbb-shadow-elevation-level-3-shadow-2-blur));--sbb-button-cursor: pointer;--_border-color: var(--sbb-button-color-hover-border);--_color: var(--sbb-button-color-hover-text);--_background-color: var(--sbb-button-color-hover-background);--_button-inset: calc(var(--sbb-button-border-width) * -1)}}@media(forced-colors:active){:host(:not([disabled],:disabled,[disabled-interactive],:active,[data-active],[loading]):hover){--sbb-button-color-hover-border: Highlight !important}}:host(:is([disabled],:disabled,[disabled-interactive])){--sbb-button-cursor: default;--_color: var(--sbb-button-color-disabled-text);--_background-color: var(--sbb-button-color-disabled-background);--_border-color: var(--sbb-button-color-disabled-border);--_border: var(--sbb-button-border-disabled-width) var(--sbb-button-border-disabled-style) var(--_border-color)}:host(:not([disabled],:disabled,[disabled-interactive]):is(:active,[data-active],[loading])){--_color: var(--sbb-button-color-active-text);--_background-color: var(--sbb-button-color-active-background);--_border-color: var(--sbb-button-color-active-border)}:host([loading]:not([disabled],:disabled,[disabled-interactive])){--_min-height-modifier: calc(-2 * var(--sbb-button-loading-border-width));--sbb-button-focus-outline-offset-override: calc( var(--sbb-focus-outline-offset) + var(--sbb-button-loading-border-width) );--_border: none;--_transform-style: preserve-3d}.sbb-action-base{--sbb-text-font-size: var(--sbb-font-size-text-xs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);font-weight:700;display:flex;gap:var(--sbb-button-gap);align-items:center;justify-content:center;text-align:left;white-space:nowrap;text-decoration:none;min-height:calc(var(--sbb-button-min-height) + var(--_min-height-modifier));outline:none;width:var(--_width);border-radius:var(--sbb-button-border-radius);color:var(--_color);cursor:var(--sbb-button-cursor);-webkit-user-select:none;user-select:none;background-color:var(--_background-color);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color,background-color;transform-style:var(--_transform-style, flat);padding-block:var(--sbb-button-padding-block-min);padding-inline:var(--sbb-button-padding-inline);position:relative}.sbb-action-base:before{content:"";position:absolute;inset:var(--_button-inset);border:var(--_border);border-radius:var(--sbb-button-border-radius);pointer-events:none;box-shadow:var(--sbb-button-box-shadow);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,border,box-shadow}:host([loading]:not([disabled],:disabled,[disabled-interactive])) .sbb-action-base{margin:var(--sbb-button-loading-border-width);padding-inline:calc(var(--sbb-button-padding-inline) - var(--sbb-button-loading-border-width));transition-property:none}:host([data-focus-visible]) .sbb-action-base:before,:host(:focus-visible) .sbb-action-base:before,.sbb-action-base:focus-visible:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width);outline-offset:var(--sbb-button-focus-outline-offset-override, var(--sbb-focus-outline-offset))}.sbb-button__label{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host(:where([data-slot-names~=icon],[icon-name]):not([data-slot-names~=unnamed])) .sbb-button__label{display:none}.sbb-button__label,::slotted([slot=icon]),sbb-icon{transition:translate var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);translate:0 var(--sbb-button-translate-y-content-hover, 0)}.sbb-button-loading-border{position:absolute;inset:calc(-1 * var(--sbb-button-loading-border-width));clip-path:border-box;border-radius:var(--sbb-button-border-radius);background:var(--_background-color);transform:translateZ(-1px);z-index:-1;container-type:inline-size;contain:paint;animation:background-fade-in var(--sbb-disable-animation-duration, var(--sbb-animation-duration-6x)) var(--sbb-disable-animation-duration, var(--sbb-button-loading-delay)) linear;animation-fill-mode:forwards}.sbb-button-loading-border:before{content:"";display:block;width:64cqmin;max-height:var(--sbb-button-min-height);aspect-ratio:2/1;position:absolute;background:radial-gradient(100% 100% at right,var(--sbb-button-color-active-text),transparent 50%);offset-path:border-box;offset-anchor:100% 50%;opacity:0;animation:snake-fade-in var(--sbb-disable-animation-duration, calc(var(--sbb-animation-duration-12x) * 2)) var(--sbb-disable-animation-duration, calc(var(--sbb-button-loading-delay) + var(--sbb-animation-duration-5x))) var(--sbb-animation-easing),snake-position var(--sbb-disable-animation-duration, calc(max(tan(atan2(var(--sbb-button-width), 1px)) / 136, .5)*3s) ) infinite linear;animation-fill-mode:forwards;transform-style:preserve-3d}@keyframes snake-position{to{offset-distance:100%}}@keyframes snake-fade-in{to{opacity:1}}@keyframes background-fade-in{to{background:var(--sbb-button-color-loading-border)}}`,zo=h`:host{--sbb-button-color-active-background: var(--sbb-color-primary150);--sbb-button-color-active-border: var(--sbb-color-primary150);--sbb-button-color-active-text: var(--sbb-color-4-negative);--sbb-button-color-default-background: var(--sbb-color-primary);--sbb-button-color-default-border: var(--sbb-color-primary);--sbb-button-color-default-text: var(--sbb-color-1-negative);--sbb-button-color-hover-background: var(--sbb-color-primary125);--sbb-button-color-hover-border: var(--sbb-color-primary125);--sbb-button-color-hover-text: var(--sbb-color-3-negative);--sbb-button-color-loading-border: color-mix( in srgb, var(--sbb-button-color-active-background) 50%, var(--sbb-button-color-default-text) );--sbb-button-color-loading-border: light-dark( color-mix( in srgb, var(--sbb-button-color-active-background) 50%, var(--sbb-button-color-default-text) ), color-mix( in srgb, var(--sbb-button-color-active-background) 70%, var(--sbb-button-color-default-text) ) );--sbb-button-shadow-1-color: color-mix(in srgb, var(--sbb-color-primary) 20%, transparent);--sbb-button-shadow-1-color: light-dark( color-mix(in srgb, var(--sbb-color-primary) 20%, transparent), color-mix(in srgb, var(--sbb-color-primary) 40%, transparent) );--sbb-button-shadow-2-color: color-mix(in srgb, var(--sbb-color-primary125) 20%, transparent);--sbb-button-shadow-2-color: light-dark( color-mix(in srgb, var(--sbb-color-primary125) 20%, transparent), color-mix(in srgb, var(--sbb-color-primary125) 40%, transparent) )}:host([negative]){--sbb-button-color-active-background: var(--sbb-color-primary150);--sbb-button-color-active-border: var(--sbb-color-primary150);--sbb-button-color-active-text: var(--sbb-color-4-negative);--sbb-button-color-default-background: var(--sbb-color-primary);--sbb-button-color-default-border: var(--sbb-color-primary);--sbb-button-color-default-text: var(--sbb-color-1-negative);--sbb-button-color-hover-background: var(--sbb-color-primary125);--sbb-button-color-hover-border: var(--sbb-color-primary125);--sbb-button-color-hover-text: var(--sbb-color-3-negative);--sbb-button-color-loading-border: color-mix( in srgb, var(--sbb-button-color-active-background) 70%, var(--sbb-button-color-default-text) );--sbb-button-shadow-1-color: color-mix(in srgb, var(--sbb-color-primary) 60%, transparent);--sbb-button-shadow-1-color: light-dark( color-mix(in srgb, var(--sbb-color-primary) 60%, transparent), color-mix(in srgb, var(--sbb-color-primary) 40%, transparent) );--sbb-button-shadow-2-color: color-mix(in srgb, var(--sbb-color-primary125) 60%, transparent);--sbb-button-shadow-2-color: light-dark( color-mix(in srgb, var(--sbb-color-primary125) 60%, transparent), color-mix(in srgb, var(--sbb-color-primary125) 40%, transparent) )}:host(:not([disabled],:disabled,[disabled-interactive],:active,[data-active],[loading])){--sbb-button-box-shadow: var(--sbb-button-box-shadow-definition)}`,Bo=h`:host{--sbb-button-color-active-background: var(--sbb-background-color-3);--sbb-button-color-active-border: var(--sbb-border-color-4-inverted);--sbb-button-color-active-text: var(--sbb-color-anthracite);--sbb-button-color-active-text: light-dark( var(--sbb-color-anthracite), var(--sbb-color-graphite) );--sbb-button-color-default-background: var(--sbb-background-color-1);--sbb-button-color-default-border: var(--sbb-border-color-4-inverted);--sbb-button-color-default-text: var(--sbb-color-3);--sbb-button-color-hover-background: var(--sbb-background-color-1);--sbb-button-color-hover-border: var(--sbb-border-color-4-inverted);--sbb-button-color-hover-text: var(--sbb-color-4);--sbb-button-color-loading-border: var(--sbb-border-color-4-inverted);--sbb-button-shadow-1-color: color-mix(in srgb, var(--sbb-color-platinum) 20%, transparent);--sbb-button-shadow-1-color: light-dark( color-mix(in srgb, var(--sbb-color-platinum) 20%, transparent), color-mix(in srgb, var(--sbb-color-black) 30%, transparent) );--sbb-button-shadow-2-color: color-mix(in srgb, var(--sbb-color-cement) 20%, transparent);--sbb-button-shadow-2-color: light-dark( color-mix(in srgb, var(--sbb-color-cement) 20%, transparent), color-mix(in srgb, var(--sbb-color-black) 30%, transparent) );--sbb-button-border-overlap-fix: 0rem}:host([negative]){--sbb-button-color-active-background: var(--sbb-background-color-2-negative);--sbb-button-color-active-border: var(--sbb-border-color-4-negative-inverted);--sbb-button-color-active-text: var(--sbb-color-graphite);--sbb-button-color-default-background: var(--sbb-background-color-1-negative);--sbb-button-color-default-border: var(--sbb-border-color-4-negative-inverted);--sbb-button-color-default-text: var(--sbb-color-3-negative);--sbb-button-color-hover-background: var(--sbb-background-color-1-negative);--sbb-button-color-hover-border: var(--sbb-border-color-4-negative-inverted);--sbb-button-color-hover-text: var(--sbb-color-4-negative);--sbb-button-color-loading-border: var(--sbb-border-color-4-negative-inverted);--sbb-button-shadow-1-color: color-mix(in srgb, var(--sbb-color-black) 30%, transparent);--sbb-button-shadow-2-color: color-mix(in srgb, var(--sbb-color-black) 30%, transparent)}:host(:not([disabled],:disabled,[disabled-interactive],:active,[data-active])){--sbb-button-box-shadow: var(--sbb-button-box-shadow-definition)}`,Vo=h`:host{--sbb-button-color-active-background: var(--sbb-background-color-1-inverted);--sbb-button-color-active-border: var(--sbb-border-color-1);--sbb-button-color-active-text: var(--sbb-color-cloud);--sbb-button-color-active-text: light-dark(var(--sbb-color-cloud), var(--sbb-color-anthracite));--sbb-button-color-default-background: var(--sbb-background-color-3-inverted);--sbb-button-color-default-border: var(--sbb-border-color-3);--sbb-button-color-default-text: var(--sbb-color-1-inverted);--sbb-button-color-hover-background: var(--sbb-background-color-3-inverted);--sbb-button-color-hover-border: var(--sbb-border-color-3);--sbb-button-color-hover-text: var(--sbb-color-3-inverted);--sbb-button-color-loading-border: var(--sbb-color-iron);--sbb-button-color-loading-border: light-dark(var(--sbb-color-iron), var(--sbb-color-silver));--sbb-button-shadow-1-color: color-mix(in srgb, var(--sbb-color-platinum) 20%, transparent);--sbb-button-shadow-1-color: light-dark( color-mix(in srgb, var(--sbb-color-platinum) 20%, transparent), color-mix(in srgb, var(--sbb-color-black) 30%, transparent) );--sbb-button-shadow-2-color: color-mix(in srgb, var(--sbb-color-cement) 20%, transparent);--sbb-button-shadow-2-color: light-dark( color-mix(in srgb, var(--sbb-color-cement) 20%, transparent), color-mix(in srgb, var(--sbb-color-black) 30%, transparent) )}:host([negative]){--sbb-button-color-active-background: var(--sbb-background-color-1-negative-inverted);--sbb-button-color-active-border: var(--sbb-border-color-1-negative);--sbb-button-color-active-text: var(--sbb-color-anthracite);--sbb-button-color-default-background: var(--sbb-background-color-3-negative-inverted);--sbb-button-color-default-border: var(--sbb-border-color-3-negative);--sbb-button-color-default-text: var(--sbb-color-1-negative-inverted);--sbb-button-color-hover-background: var(--sbb-background-color-3-negative-inverted);--sbb-button-color-hover-border: var(--sbb-border-color-3-negative);--sbb-button-color-hover-text: var(--sbb-color-4-negative-inverted);--sbb-button-color-loading-border: var(--sbb-color-silver);--sbb-button-shadow-1-color: color-mix(in srgb, var(--sbb-color-black) 30%, transparent);--sbb-button-shadow-2-color: color-mix(in srgb, var(--sbb-color-black) 30%, transparent)}:host(:not([disabled],:disabled,[disabled-interactive],:active,[data-active],[loading])){--sbb-button-box-shadow: var(--sbb-button-box-shadow-definition)}`,Ho=h`:host{--sbb-button-color-active-background: var(--sbb-background-color-4);--sbb-button-color-active-border: var(--sbb-border-color-4-inverted);--sbb-button-color-active-text: var(--sbb-color-1);--sbb-button-color-default-background: transparent;--sbb-button-color-default-border: transparent;--sbb-button-color-default-text: var(--sbb-color-1);--sbb-button-color-hover-background: var(--sbb-background-color-3);--sbb-button-color-hover-border: var(--sbb-border-color-3-inverted);--sbb-button-color-hover-text: var(--sbb-color-1);--sbb-button-color-loading-border: var(--sbb-color-silver);--sbb-button-color-loading-border: light-dark(var(--sbb-color-silver), var(--sbb-color-granite))}:host([negative]){--sbb-button-color-active-background: var(--sbb-background-color-4-negative);--sbb-button-color-active-border: var(--sbb-border-color-4-negative-inverted);--sbb-button-color-active-text: var(--sbb-color-1-negative);--sbb-button-color-default-background: transparent;--sbb-button-color-default-border: transparent;--sbb-button-color-default-text: var(--sbb-color-1-negative);--sbb-button-color-hover-background: var(--sbb-background-color-3-negative);--sbb-button-color-hover-border: var(--sbb-border-color-3-negative-inverted);--sbb-button-color-hover-text: var(--sbb-color-1-negative);--sbb-button-color-loading-border: var(--sbb-color-granite)}`})),Wo=e((()=>{Ro(),Uo()})),Go=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-button`)],n,r=[],o,c=J(cn(sa));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,zo],a(o,r),o})()})),Ko,qo=e((()=>{o(),M(),q(),G(),Wo(),Ko=(()=>{var e;let t=[s(`sbb-secondary-button`)],n,r=[],o,c=J(cn(sa));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Bo],a(o,r),o})()})),Jo=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-accent-button`)],n,r=[],o,c=J(cn(sa));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Vo],a(o,r),o})()})),Yo=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-transparent-button`)],n,r=[],o,c=J(cn(sa));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Ho],a(o,r),o})()})),Xo,Zo=e((()=>{o(),M(),wa(),q(),B(),G(),Mo(),I(),Xo=h`*,:before,:after{box-sizing:border-box}:host{display:block;outline:none!important;--sbb-mini-button-gap: .125rem;--sbb-mini-button-padding-inline: var(--sbb-spacing-fixed-2x);--sbb-mini-button-label-display: block;--sbb-mini-button-label-height: var(--sbb-size-icon-ui-small)}:host(:where([data-slot-names~=icon],[icon-name]):not([data-slot-names~=unnamed])){--sbb-mini-button-padding-inline: 0;--sbb-mini-button-label-display: none;--sbb-mini-button-label-height: unset}:host{display:inline-block;-webkit-tap-highlight-color:transparent;height:fit-content;outline:none!important;--sbb-button-color-text: var(--sbb-color-3);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3);--sbb-button-color-active-background: var(--sbb-background-color-4);--sbb-button-color-disabled-background: var(--sbb-background-color-3);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-color-disabled-text: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-button-border-disabled-width: var(--sbb-border-width-1x);--sbb-button-border-disabled-style: dashed;--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing)}@media(forced-colors:active){:host{--sbb-button-color-text: ButtonText !important;--sbb-button-color-hover-background: Highlight !important;--sbb-button-color-active-background: Highlight !important;--sbb-button-color-disabled-background: Canvas !important;--sbb-button-color-disabled-border: GrayText !important;--sbb-button-color-disabled-text: GrayText !important}}:host .sbb-mini-button{position:relative;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;border-radius:var(--sbb-button-border-radius);color:var(--sbb-button-color-text);cursor:pointer;-webkit-user-select:none;user-select:none;display:flex}:host .sbb-mini-button:before{position:absolute;content:"";inset:0;border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color}::slotted(sbb-icon),sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem));display:flex}:host([negative]){--sbb-button-color-text: var(--sbb-color-3-negative);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3-negative);--sbb-button-color-active-background: var(--sbb-background-color-4-negative);--sbb-button-color-disabled-background: var(--sbb-background-color-3-negative);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-5)}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-mini-button{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-mini-button:before{background-color:var(--sbb-button-color-disabled-background);border:var(--sbb-button-border-disabled-width) var(--sbb-button-border-disabled-style) var(--sbb-button-color-disabled-border)}:host(:is([data-focus-visible],:focus-visible)) .sbb-mini-button:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}:host([data-focus-visible]){--sbb-focus-outline-style: initial}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover){--sbb-button-translate-y-content-hover: -.0625rem}}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover) .sbb-mini-button:before{background-color:var(--sbb-button-color-hover-background)}}:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled]):is(:active,[data-active])) .sbb-mini-button:before{background-color:var(--sbb-button-color-active-background)}.sbb-mini-button{height:var(--sbb-mini-button-label-height);gap:var(--sbb-mini-button-gap);align-items:center;justify-content:center;padding-inline:var(--sbb-mini-button-padding-inline)}.sbb-mini-button__label{--sbb-text-font-size: var(--sbb-font-size-text-xxs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:var(--sbb-mini-button-label-display);transition:translate var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);translate:0 var(--sbb-button-translate-y-content-hover, 0)}`,(()=>{var e;let t=[s(`sbb-mini-button`),$t()],n,r=[],o,c=cn(W(Ao(sa)));return e=class extends c{renderTemplate(){return Sa`
      ${super.renderIconSlot()}
      <span class="sbb-mini-button__label">
        <slot></slot>
      </span>
    `}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=Xo,a(o,r),o})()})),Qo,$o,es,ts,ns,rs,is=e((()=>{o(),I(),M(),B(),U(),G(),Qo=e=>{throw TypeError(e)},$o=(e,t,n)=>t.has(e)||Qo(`Cannot `+n),es=(e,t,n)=>($o(e,t,`read from private field`),n?n.call(e):t.get(e)),ts=(e,t,n)=>t.has(e)?Qo(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),ns=(e,t,n,r)=>($o(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),rs=h`*,:before,:after{box-sizing:border-box}:host{display:block;--sbb-mini-button-group-background: var(--sbb-background-color-1);--sbb-mini-button-group-border-color: var(--sbb-border-color-4-inverted);--sbb-mini-button-group-border-width: var(--sbb-border-width-2x);--sbb-mini-button-group-border: var(--sbb-mini-button-group-border-width) solid var(--sbb-mini-button-group-border-color);--sbb-mini-button-group-gap: var(--sbb-spacing-fixed-2x);--sbb-mini-button-group-min-height: var(--sbb-size-element-s);--sbb-mini-button-group-padding-inline: var(--sbb-spacing-fixed-3x)}:host([negative]){--sbb-mini-button-group-background: var(--sbb-background-color-1-negative);--sbb-mini-button-group-border-color: var(--sbb-border-color-4-negative-inverted);--sbb-focus-outline-color: var(--sbb-focus-outline-color-dark)}:host([size=s]){--sbb-mini-button-group-min-height: var(--sbb-size-element-xs);--sbb-mini-button-group-padding-inline: var(--sbb-spacing-fixed-2x)}:host([size=l]){--sbb-mini-button-group-min-height: var(--sbb-size-element-m)}:host([size=xl]){--sbb-mini-button-group-min-height: var(--sbb-size-element-l);--sbb-mini-button-group-padding-inline: var(--sbb-spacing-fixed-4x)}::slotted(:is(sbb-mini-button,sbb-divider)){display:flex}::slotted(sbb-divider){--sbb-divider-border-width: var(--sbb-border-width-1x);padding-block:var(--sbb-spacing-fixed-1x);padding-inline:var(--sbb-spacing-fixed-1x);height:var(--sbb-size-icon-ui-small)}.sbb-mini-button-group{list-style:none;margin:0;padding:0;font-size:inherit;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--sbb-mini-button-group-gap);width:fit-content;min-height:var(--sbb-mini-button-group-min-height);background-color:var(--sbb-mini-button-group-background);border:var(--sbb-mini-button-group-border);border-radius:var(--sbb-border-radius-infinity);padding-inline:calc(var(--sbb-mini-button-group-padding-inline) - var(--sbb-mini-button-group-border-width))}`,(()=>{var e,t,n;let r=[s(`sbb-mini-button-group`)],o,c=[],l,u=W(Vi(F)),d,f=[],p=[],m,h=[],g=[];return n=class extends u{constructor(){super(...arguments),ts(this,e),ts(this,t),this.listChildLocalNames=[`sbb-mini-button`,`sbb-divider`],ns(this,e,a(this,f,``)),ns(this,t,(a(this,p),a(this,h,or()?`s`:`m`))),a(this,g)}get accessibilityLabel(){return es(this,e)}set accessibilityLabel(t){ns(this,e,t)}get size(){return es(this,t)}set size(e){ns(this,t,e)}willUpdate(e){super.willUpdate(e),e.has(`negative`)&&this._proxyNegative()}_proxyNegative(){this.querySelectorAll?.(`sbb-divider, sbb-mini-button`).forEach(e=>e.negative=this.negative)}render(){return N`
      ${this.renderList({ariaLabel:this.accessibilityLabel},{localNameVisualOnly:[`sbb-divider`]})}
    `}},e=new WeakMap,t=new WeakMap,l=n,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(u[Symbol.metadata]??null):void 0;d=[L(),A({attribute:`accessibility-label`})],m=[A({reflect:!0})],i(n,null,d,{kind:`accessor`,name:`accessibilityLabel`,static:!1,private:!1,access:{has:e=>`accessibilityLabel`in e,get:e=>e.accessibilityLabel,set:(e,t)=>{e.accessibilityLabel=t}},metadata:e},f,p),i(n,null,m,{kind:`accessor`,name:`size`,static:!1,private:!1,access:{has:e=>`size`in e,get:e=>e.size,set:(e,t)=>{e.size=t}},metadata:e},h,g),i(null,o={value:l},r,{kind:`class`,name:l.name,metadata:e},null,c),l=o.value,e&&Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.styles=rs,a(l,c),l})()})),as=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-button-link`)],n,r=[],o,c=J(sn(V(pa)));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,zo],a(o,r),o})()})),os=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-secondary-button-link`)],n,r=[],o,c=J(sn(V(pa)));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Bo],a(o,r),o})()})),ss=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-accent-button-link`)],n,r=[],o,c=J(sn(V(pa)));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Vo],a(o,r),o})()})),cs=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-transparent-button-link`)],n,r=[],o,c=J(sn(V(pa)));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Ho],a(o,r),o})()})),ls=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-button-static`)],n,r=[],o,c=J(V($i));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,zo],a(o,r),o})()})),us=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-secondary-button-static`)],n,r=[],o,c=J(V($i));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Bo],a(o,r),o})()})),ds=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-accent-button-static`)],n,r=[],o,c=J(V($i));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Vo],a(o,r),o})()})),fs=e((()=>{o(),M(),q(),G(),Wo(),(()=>{var e;let t=[s(`sbb-transparent-button-static`)],n,r=[],o,c=J(V($i));return e=class extends c{},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Y,Ho],a(o,r),o})()})),ps=e((()=>{Go(),qo(),Jo(),Yo(),Zo(),is(),as(),os(),ss(),cs(),ls(),us(),ds(),fs(),Ro(),Uo()})),ms,hs,gs,_s,vs,ys,bs=e((()=>{o(),I(),M(),B(),ms=e=>{throw TypeError(e)},hs=(e,t,n)=>t.has(e)||ms(`Cannot `+n),gs=(e,t,n)=>(hs(e,t,`read from private field`),n?n.call(e):t.get(e)),_s=(e,t,n)=>t.has(e)?ms(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),vs=(e,t,n,r)=>(hs(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),ys=h`*,:before,:after{box-sizing:border-box}:host{display:block;height:var(--sbb-signet-height);--sbb-signet-background-color: var(--sbb-color-brand);--sbb-signet-panel-color: var(--sbb-color-brand);--sbb-signet-icon-color: var(--sbb-color-white);--sbb-signet-aspect-ratio: 2 / 1;--sbb-signet-svg-container-height: auto}@media(forced-colors:active){:host{--sbb-signet-background-color: ButtonText !important;--sbb-signet-panel-color: ButtonText !important;--sbb-signet-icon-color: Canvas !important}}:host([protective-room=minimal]){--sbb-signet-aspect-ratio: 108 / 64;--sbb-signet-svg-container-height: 68.75% }:host([protective-room=ideal]){--sbb-signet-aspect-ratio: 128 / 84;--sbb-signet-svg-container-height: calc(44 / 84 * 100%)}:host([protective-room=panel]){--sbb-signet-aspect-ratio: 143 / 48;--sbb-signet-background-color: unset}@media(forced-colors:active){:host([protective-room=panel]){--sbb-signet-background-color: unset !important}}.sbb-signet{display:flex;align-items:center;justify-content:center;background-color:var(--sbb-signet-background-color);aspect-ratio:var(--sbb-signet-aspect-ratio);width:100%;height:100%}.sbb-signet .sbb-signet__svg-container{display:flex;height:var(--sbb-signet-svg-container-height)}.sbb-signet svg{width:100%;height:100%}#sbb-signet__panel{fill:var(--sbb-signet-panel-color);stroke:var(--sbb-signet-panel-color)}#sbb-signet__icon{fill:var(--sbb-signet-icon-color)}`,(()=>{var e,t,n;let r=[s(`sbb-signet`)],o,c=[],l,u=F,d,f=[],p=[],m,h=[],g=[];return n=class extends u{constructor(){super(...arguments),_s(this,e,a(this,f,`ideal`)),_s(this,t,(a(this,p),a(this,h,`Logo`))),a(this,g)}get protectiveRoom(){return gs(this,e)}set protectiveRoom(t){vs(this,e,t)}get accessibilityLabel(){return gs(this,t)}set accessibilityLabel(e){vs(this,t,e)}render(){return N`
      <span class="sbb-signet">
        <span class="sbb-signet__svg-container">
          ${this.protectiveRoom===`panel`?N`
                <svg focusable="false" viewBox="0 0 143 48" xmlns="http://www.w3.org/2000/svg">
                  <title .textContent=${this.accessibilityLabel}></title>
                  <path id="sbb-signet__panel" stroke-width="1" d="M1 47h141V1H1v46z"></path>
                  <path
                    id="sbb-signet__icon"
                    d="M87 40h9.3L83.8 27.7h15.5V40h7.4V27.7h15.6L109.7 40h9.3l16-16-15.9-16h-9.3l12.5 12.3h-15.6V8h-7.4v12.3H83.8L96.3 8H87L71 24l16 16z"
                  ></path>
                </svg>
              `:N`
                <svg focusable="false" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
                  <title .textContent=${this.accessibilityLabel}></title>
                  <path
                    id="sbb-signet__icon"
                    d="M20.0265 40H31.6821L16 24.6154H35.3907V40H44.6093V24.6154H64.106L48.4238 40H60.0795L80 20.0531L60.0795 0H48.4238L64.106 15.3846H44.6093V0H35.3907V15.3846H16L31.6821 0H20.0265L0 20.0531L20.0265 40Z"
                  ></path>
                </svg>
              `}
        </span>
      </span>
    `}},e=new WeakMap,t=new WeakMap,l=n,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(u[Symbol.metadata]??null):void 0;d=[A({attribute:`protective-room`,reflect:!0})],m=[L(),A({attribute:`accessibility-label`})],i(n,null,d,{kind:`accessor`,name:`protectiveRoom`,static:!1,private:!1,access:{has:e=>`protectiveRoom`in e,get:e=>e.protectiveRoom,set:(e,t)=>{e.protectiveRoom=t}},metadata:e},f,p),i(n,null,m,{kind:`accessor`,name:`accessibilityLabel`,static:!1,private:!1,access:{has:e=>`accessibilityLabel`in e,get:e=>e.accessibilityLabel,set:(e,t)=>{e.accessibilityLabel=t}},metadata:e},h,g),i(null,o={value:l},r,{kind:`class`,name:l.name,metadata:e},null,c),l=o.value,e&&Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.styles=ys,a(l,c),l})()})),xs=e((()=>{bs()})),Ss,Cs=e((()=>{o(),I(),M(),Ss=h`*,:before,:after{box-sizing:border-box}:host{--sbb-timetable-form-background-color: var(--sbb-background-color-1);--sbb-timetable-form-border-radius: var(--sbb-border-radius-4x);border-radius:var(--sbb-timetable-form-border-radius);background-color:var(--sbb-timetable-form-background-color);display:flex;flex-direction:column}`,(()=>{var e;let t=[s(`sbb-timetable-form`)],n,r=[],o,c=F;return e=class extends c{render(){return N`<slot></slot>`}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=Ss,a(o,r),o})()})),ws,Ts=e((()=>{o(),I(),M(),ws=h`*,:before,:after{box-sizing:border-box}:host{--sbb-timetable-form-details-padding-block: var(--sbb-spacing-fixed-1x);--sbb-timetable-form-details-padding-inline: var(--sbb-spacing-responsive-xxs);--sbb-timetable-form-details-horizontal-divider-height: 1.5rem;display:flex;flex-wrap:wrap;gap:var(--sbb-spacing-fixed-1x);border-block-start:var(--sbb-border-width-1x) solid var(--sbb-border-color-4-inverted);padding-block:var(--sbb-timetable-form-details-padding-block);padding-inline-start:calc(var(--sbb-size-icon-ui-small) + var(--sbb-spacing-responsive-xxxs));align-items:center}::slotted(sbb-form-field){--sbb-form-field-border-radius: var(--sbb-border-radius-6x);--sbb-form-field-outline-offset: -.3125rem}::slotted(sbb-divider[orientation=vertical]){height:var(--sbb-timetable-form-details-horizontal-divider-height)}::slotted(:last-child){margin-inline-end:var(--sbb-timetable-form-details-padding-inline)}`,(()=>{var e;let t=[s(`sbb-timetable-form-details`)],n,r=[],o,c=F;return e=class extends c{render(){return N`<slot></slot>`}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=ws,a(o,r),o})()})),Es,Ds,Os,ks,X,As,js,Ms,Ns,Ps,Fs=e((()=>{o(),I(),M(),gi(),z(),B(),U(),H(),G(),Mo(),Es=e=>{throw TypeError(e)},Ds=(e,t,n)=>t.has(e)||Es(`Cannot `+n),Os=(e,t,n)=>(Ds(e,t,`read from private field`),n?n.call(e):t.get(e)),ks=(e,t,n)=>t.has(e)?Es(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),X=(e,t,n,r)=>(Ds(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),As=h`@charset "UTF-8";*,:before,:after{box-sizing:border-box}:host{display:inline-block;color:var(--sbb-color-3);--sbb-form-field-background-color: var(--sbb-background-color-1);--sbb-form-field-border-color: var(--sbb-border-color-5);--sbb-form-field-border-style: solid;--sbb-form-field-border-radius: var(--sbb-border-radius-4x);--sbb-form-field-border-width: var(--sbb-border-width-1x);--sbb-form-field-min-height: var(--sbb-size-element-m);--sbb-form-field-label-color: var(--sbb-color-metal);--sbb-form-field-label-color: light-dark(var(--sbb-color-metal), var(--sbb-color-smoke));--sbb-form-field-prefix-color: var(--sbb-color-metal);--sbb-form-field-prefix-color: light-dark(var(--sbb-color-metal), var(--sbb-color-smoke));--sbb-form-field-padding-inline: var(--sbb-spacing-fixed-3x);--sbb-form-field-text-color: var(--sbb-color-3);--sbb-form-field-arrow-color: var(--sbb-color-3);--sbb-form-field-error-divider-width: var(--sbb-spacing-fixed-1x);--sbb-form-field-error-padding-block-start: var(--sbb-form-field-error-divider-width);--sbb-form-field-gap: var(--sbb-spacing-fixed-2x);--sbb-form-field-label-to-input-overlapping: var(--sbb-spacing-fixed-1x);--sbb-form-field-select-inline-padding-end: calc( var(--sbb-icon-svg-width) + var(--sbb-form-field-gap) );--sbb-form-field-overflow: hidden;--sbb-form-field-input-text-size: var(--sbb-font-size-text-m);--sbb-form-field-label-text-size: var(--sbb-font-size-text-xs);--sbb-form-field-label-size: calc( var(--sbb-form-field-label-text-size) * var(--sbb-typo-line-height-body-text) );--sbb-form-field-text-line-height: calc( var(--sbb-form-field-input-text-size) * var(--sbb-typo-line-height-body-text) );--sbb-form-field-margin-block-start: calc( ( var(--sbb-form-field-min-height) - var(--sbb-form-field-label-size) - var( --sbb-form-field-text-line-height ) + var(--sbb-form-field-label-to-input-overlapping) ) / 2 );--sbb-form-field-spacer-margin-block-end: calc( -1 * var(--sbb-form-field-label-to-input-overlapping) );--sbb-form-field-floating-label-transform: .53125rem;--sbb-icon-svg-width: var(--sbb-size-icon-ui-small);--sbb-icon-svg-height: var(--sbb-size-icon-ui-small);--sbb-focus-outline-color: var(--sbb-focus-outline-color-default);--sbb-focus-outline-color: light-dark( var(--sbb-focus-outline-color-default), var(--sbb-focus-outline-color-dark) )}@media(min-width:52.5rem){:host{--sbb-form-field-floating-label-transform: .65625rem}}@media(forced-colors:active){:host{--sbb-form-field-border-color: ButtonBorder}}:host(:where(:not([width=collapse]))){min-width:9.375rem;width:min(18.75rem,100%)}:host([negative]){color:var(--sbb-color-3-negative);--sbb-form-field-background-color: var(--sbb-background-color-1-negative);--sbb-form-field-border-color: var(--sbb-border-color-5);--sbb-form-field-label-color: var(--sbb-color-5);--sbb-form-field-prefix-color: var(--sbb-color-5);--sbb-form-field-text-color: var(--sbb-color-3-negative);--sbb-focus-outline-color: var(--sbb-focus-outline-color-dark);--sbb-form-field-arrow-color: var(--sbb-color-3-negative)}@media(forced-colors:active){:host([negative]){--sbb-form-field-border-color: ButtonBorder}}:host([size=s]){--sbb-form-field-min-height: var(--sbb-size-element-xs);--sbb-form-field-padding-inline: var(--sbb-spacing-fixed-2x);--sbb-form-field-input-text-size: var(--sbb-font-size-text-s);--sbb-form-field-label-text-size: var(--sbb-font-size-text-xxs);--sbb-form-field-label-to-input-overlapping: .625rem;--sbb-form-field-floating-label-transform: .34375rem;--sbb-form-field-spacer-margin-block-end: -.53125rem}@media(min-width:52.5rem){:host([size=s]){--sbb-form-field-label-to-input-overlapping: .6875rem;--sbb-form-field-floating-label-transform: .3125rem;--sbb-form-field-spacer-margin-block-end: -.5rem}}:host([size=l]){--sbb-form-field-min-height: var(--sbb-size-element-l);--sbb-form-field-padding-inline: var(--sbb-spacing-responsive-xxxs)}:host([error-space=reserve]){--sbb-form-field-error-min-height: calc( var(--sbb-typo-line-height-body-text) * var(--sbb-font-size-text-xs) );--sbb-form-field-error-padding-block-start-override: var(--sbb-form-field-error-divider-width)}:host(:where(:is(:state(readonly),[state--readonly]),:is(:state(disabled),[state--disabled]))){--sbb-form-field-background-color: var(--sbb-background-color-3);--sbb-form-field-border-color: var(--sbb-color-graphite);--sbb-form-field-border-color: light-dark(var(--sbb-color-graphite), var(--sbb-color-smoke));--sbb-form-field-arrow-color: var(--sbb-color-granite);--sbb-form-field-arrow-color: light-dark(var(--sbb-color-granite), var(--sbb-color-storm))}@media(forced-colors:active){:host(:where(:is(:state(readonly),[state--readonly]),:is(:state(disabled),[state--disabled]))){--sbb-form-field-border-color: ButtonBorder}}:host(:where(:is(:state(readonly),[state--readonly]),:is(:state(disabled),[state--disabled]))[negative]){--sbb-form-field-background-color: var(--sbb-background-color-3-negative);--sbb-form-field-border-color: var(--sbb-border-color-5);--sbb-form-field-arrow-color: var(--sbb-border-color-5)}:host(:where(:is(:state(disabled),[state--disabled]))){--sbb-form-field-label-color: var(--sbb-color-granite);--sbb-form-field-label-color: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-form-field-prefix-color: var(--sbb-color-granite);--sbb-form-field-prefix-color: light-dark(var(--sbb-color-granite), var(--sbb-color-storm));--sbb-form-field-border-style: dashed}@media(forced-colors:active){:host(:where(:is(:state(disabled),[state--disabled]))){--sbb-form-field-label-color: GrayText !important;--sbb-form-field-prefix-color: GrayText !important;--sbb-form-field-text-color: GrayText !important;--sbb-form-field-border-color: GrayText !important}}:host(:where(:is(:state(disabled),[state--disabled]))[negative]){--sbb-form-field-text-color: var(--sbb-color-5);--sbb-form-field-label-color: var(--sbb-color-5);--sbb-form-field-prefix-color: var(--sbb-color-5)}:host(:where(:is(:state(readonly),[state--readonly])):not([negative])){--sbb-form-field-label-color: var(--sbb-color-granite);--sbb-form-field-label-color: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-form-field-prefix-color: var(--sbb-color-granite);--sbb-form-field-prefix-color: light-dark(var(--sbb-color-granite), var(--sbb-color-storm))}:host(:where(:is(:state(focus),[state--focus]))){--sbb-form-field-border-color: var(--sbb-border-color-3);--sbb-form-field-prefix-color: var(--sbb-color-3);--sbb-form-field-border-width: var(--sbb-border-width-2x)}:host(:where(:is(:state(focus),[state--focus]))[negative]){--sbb-form-field-border-color: var(--sbb-border-color-3-negative);--sbb-form-field-prefix-color: var(--sbb-color-3-negative)}@media(forced-colors:active){:host(:is(:state(focus),[state--focus])){--sbb-form-field-border-color: Highlight;--sbb-form-field-prefix-color: Highlight}}:host(:not(:where(:is(:state(has-error),[state--has-error])))){--sbb-form-field-error-padding-block-start: 0}:host([floating-label]){--sbb-select-placeholder-color: transparent}@media(forced-colors:active){:host([floating-label]){--sbb-select-placeholder-color: Canvas}}:host(:is(:not([data-slot-names~=label]),[hidden-label])){--sbb-form-field-label-size: 0rem;--sbb-form-field-label-to-input-overlapping: 0rem}:host(:where(:is(:state(input-type-sbb-slider),[state--input-type-sbb-slider]))){--sbb-form-field-overflow: visible}:host(:where(:is(:state(input-type-textarea),[state--input-type-textarea]))){--sbb-form-field-max-height: fit-content}.sbb-form-field__space-wrapper{display:flex;flex-direction:column}.sbb-form-field__space-wrapper:before{content:"​";-webkit-user-select:none;user-select:none;width:0;height:0}.sbb-form-field__wrapper{display:flex;gap:var(--sbb-form-field-gap);padding-inline:var(--sbb-form-field-padding-inline);border-radius:var(--sbb-form-field-border-radius);min-height:var(--sbb-form-field-min-height);max-height:var(--sbb-form-field-max-height);background-color:var(--sbb-form-field-background-color);position:relative}.sbb-form-field__wrapper:before{content:"";display:block;position:absolute;inset:0;border:var(--sbb-form-field-border-width) var(--sbb-form-field-border-style) var(--sbb-form-field-border-color);border-radius:var(--sbb-form-field-border-radius)}:host(:where(:is(:state(focus),[state--focus]):is(:state(focus-origin-keyboard),[state--focus-origin-keyboard]))) .sbb-form-field__wrapper{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width);outline-offset:var(--sbb-form-field-outline-offset, var(--sbb-focus-outline-offset))}@media(forced-colors:none){:host(:is([borderless],:is(:state(input-type-sbb-slider),[state--input-type-sbb-slider]))) .sbb-form-field__wrapper:before{border-color:transparent}:host(:where(:is(:state(focus),[state--focus]),:is(:state(disabled),[state--disabled]))[borderless]) .sbb-form-field__wrapper:after{content:"";position:absolute;border-block-end:var(--sbb-border-width-1x) var(--sbb-form-field-border-style) var(--sbb-form-field-border-color);inset-inline:var(--sbb-form-field-padding-inline);inset-block-end:0;z-index:var(--sbb-form-field-focus-underline-z-index, initial)}}::slotted(*[slot=prefix]){color:var(--sbb-form-field-prefix-color)}::slotted(*[slot=prefix]),::slotted(*[slot=suffix]){display:flex;min-width:var(--sbb-icon-svg-width);margin-block-start:calc((var(--sbb-form-field-min-height) - var(--sbb-size-icon-ui-small)) / 2)}:host(:where(:is(:state(empty),[state--empty]),:is(:state(disabled),[state--disabled]),:is(:state(readonly),[state--readonly]))) ::slotted(sbb-form-field-clear){display:none}::slotted(sbb-datepicker-toggle){padding-block-end:calc((var(--sbb-form-field-min-height) - var(--sbb-size-icon-ui-small)) / 2)}@media(forced-colors:active){::slotted(*[slot=suffix]){color:var(--sbb-form-field-prefix-color)}}.sbb-form-field__select-input-icon{top:50%;transform:translateY(-50%);position:absolute;inset-inline-end:0;margin-block-start:calc(-1 * var(--sbb-form-field-margin-block-start) / 2);pointer-events:none;color:var(--sbb-form-field-arrow-color)}.sbb-form-field__input-container{flex:1 1 auto;position:relative;margin-block-start:var(--sbb-form-field-margin-block-start);min-width:0}.sbb-form-field__label-spacer{display:flex;height:calc(var(--sbb-form-field-label-text-size) * var(--sbb-typo-line-height-body-text));margin-block-end:var(--sbb-form-field-spacer-margin-block-end)}:host(:not([data-slot-names~=label])) :is(.sbb-form-field__label,.sbb-form-field__label-spacer){display:none}:host([hidden-label]) :is(.sbb-form-field__label,.sbb-form-field__label-spacer){border:0;clip-path:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.sbb-form-field__label{display:flex;max-width:100%;cursor:default;position:absolute;inset-block-start:0;color:var(--sbb-form-field-label-color);--sbb-text-font-size: var(--sbb-font-size-text-xs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size)}:host([size=s]) .sbb-form-field__label{--sbb-text-font-size: var(--sbb-font-size-text-xxs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size)}:host(:where(:is(:state(input-type-select),[state--input-type-select]),:is(:state(input-type-sbb-select),[state--input-type-sbb-select]))) .sbb-form-field__label{padding-inline-end:var(--sbb-form-field-select-inline-padding-end)}:host([floating-label]) .sbb-form-field__label{transform-origin:0 0;pointer-events:none;backface-visibility:hidden;will-change:transform,font-size;transition-duration:var(--sbb-disable-animation-duration, var(--sbb-animation-duration-2x));transition-timing-function:var(--sbb-animation-easing);transition-property:transform,font-size}:host([floating-label]:is(:not(:where(:is(:state(focus),[state--focus])):not(:where(:is(:state(input-type-sbb-select),[state--input-type-sbb-select]))),:where(:is(:state(has-popup-open),[state--has-popup-open]))),:where(:is(:state(readonly),[state--readonly]))):where(:is(:state(empty),[state--empty]))) .sbb-form-field__label{font-size:var(--sbb-form-field-input-text-size);transform:translateY(var(--sbb-form-field-floating-label-transform))}@media(forced-colors:active){:host(:where(:is(:state(input-type-textarea),[state--input-type-textarea]))) .sbb-form-field__label{z-index:1}}.sbb-form-field__label-ellipsis{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.sbb-form-field__input{display:flex}:host([size=s]:is(:is(:state(input-type-input),[state--input-type-input]),:is(:state(input-type-select),[state--input-type-select]),:is(:state(input-type-sbb-select),[state--input-type-sbb-select]),:is(:state(input-type-sbb-date-input),[state--input-type-sbb-date-input]),:is(:state(input-type-sbb-time-input),[state--input-type-sbb-time-input]))) .sbb-form-field__input{margin-block-end:-.125rem}.sbb-form-field__error{display:flex;min-height:var(--sbb-form-field-error-min-height);margin-block-start:var(--sbb-form-field-error-padding-block-start-override, var(--sbb-form-field-error-padding-block-start))}`,js=0,Ms=new WeakMap,Ns=[`input`,`textarea`,`select`],Ps=(()=>{var e,t,n,r,o,c,l,u,d,f,p;let m=[s(`sbb-form-field`),$t()],h,g=[],_,v=W(pn(ki(F))),y,b=[],x=[],S,C=[],ee=[],w,T=[],te=[],ne,E=[],D=[],O,re=[],k=[],ie,ae=[],oe=[],se,ce=[],le=[],ue,de=[],fe=[],pe,me=[],he=[],M,ge=[],_e=[];return p=class extends v{constructor(){super(),ks(this,e),ks(this,t),ks(this,n),ks(this,r),ks(this,o),ks(this,c),ks(this,l),ks(this,u),ks(this,d),ks(this,f),this._excludedFocusElements=[`button`,`sbb-popover`,`sbb-option`,`sbb-chip`],this._floatingLabelSupportedInputElements=[`input`,`select`,`textarea`,`sbb-select`],this._floatingLabelSupportedInputTypes=[`email`,`number`,`password`,`search`,`tel`,`text`,`url`],X(this,e,a(this,b,`none`)),X(this,t,(a(this,x),a(this,C,!1))),X(this,n,(a(this,ee),a(this,T,or()?`s`:`m`))),X(this,r,(a(this,te),a(this,E,!1))),X(this,o,(a(this,D),a(this,re,`default`))),X(this,c,(a(this,k),a(this,ae,!1))),X(this,l,(a(this,oe),a(this,ce,!1))),X(this,u,(a(this,le),a(this,de,[]))),X(this,d,(a(this,fe),a(this,me,null))),X(this,f,(a(this,he),a(this,ge,void 0))),this._language=(a(this,_e),new R(this)),this._formFieldAttributeObserver=new MutationObserver(e=>{e.some(e=>e.type===`attributes`)&&this._input&&(this._readInputState(),this._registerInputFormListener(),this._checkAndUpdateInputEmpty())}),this._inputFormAbortController=new AbortController,this._control=null,this.addEventListener?.(`focusin`,e=>{(e.target===this.inputElement||e.target===this.inputElement?.inputElement)&&(this.internals.states.add(`focus`),this.internals.states.add(`focus-origin-${Kr.mostRecentModality}`))},{passive:!0}),this.addEventListener?.(`focusout`,e=>{if(e.target===this.inputElement||e.target===this.inputElement?.inputElement){this._checkAndUpdateInputEmpty(),this.internals.states.delete(`focus`);for(let e of this.internals.states)e.startsWith(`focus-origin-`)&&this.internals.states.delete(e)}},{passive:!0}),this.addEventListener(`input`,()=>this._checkAndUpdateInputEmpty()),this.addEventListener(`displayvaluechange`,()=>this._checkAndUpdateInputEmpty()),this.addEventListener(`invalid`,e=>e.preventDefault(),{capture:!0}),this.addEventListener(`formfieldcontrol`,e=>{this._control=e.control,this._connectInputElement()===`unchanged`&&(this._assignErrorMessageElements(),this._readInputState(),this._checkAndUpdateInputEmpty())})}get errorSpace(){return Os(this,e)}set errorSpace(t){X(this,e,t)}get optional(){return Os(this,t)}set optional(e){X(this,t,e)}get size(){return Os(this,n)}set size(e){X(this,n,e)}get borderless(){return Os(this,r)}set borderless(e){X(this,r,e)}get width(){return Os(this,o)}set width(e){X(this,o,e)}get hiddenLabel(){return Os(this,c)}set hiddenLabel(e){X(this,c,e)}get floatingLabel(){return Os(this,l)}set floatingLabel(e){X(this,l,e)}get _errorElements(){return Os(this,u)}set _errorElements(e){X(this,u,e)}get _input(){return Os(this,d)}set _input(e){X(this,d,e)}get _label(){return Os(this,f)}set _label(e){X(this,f,e)}get inputElement(){return this._input}connectedCallback(){super.connectedCallback(),this._assignSlots(),this._connectInputElement(),this._syncNegative(),this._syncSize()}willUpdate(e){super.willUpdate(e),e.has(`negative`)&&this._syncNegative(),e.has(`size`)&&this._syncSize()}disconnectedCallback(){super.disconnectedCallback(),this._formFieldAttributeObserver?.disconnect(),this._inputFormAbortController.abort(),this._input?.localName===`input`&&this._unpatchInputValue()}_handleWrapperClick(e){this._isElementFocusExcluded(e)||(this._control?.onContainerClick?this._control?.onContainerClick(e):e.target.localName!==`label`&&(this._input?.localName===`sbb-select`&&e.target.localName!==`sbb-select`&&this._input.click(),this._input?.focus()))}_isElementFocusExcluded(e){return e.composedPath().some(e=>e instanceof window.HTMLElement&&(e.getAttribute(`tabindex`)===`0`||e.hasAttribute(`contenteditable`))||this._excludedFocusElements.includes(e.localName))}_onSlotLabelChange(){this._label=Array.from(this.querySelectorAll(`label`))[0],this._syncLabelInputReferences()}_onSlotInputChange(){this._assignSlots(),this._connectInputElement()}_assignSlots(){this.querySelectorAll(`label:not([slot])`).forEach(e=>e.setAttribute(`slot`,`label`)),this.querySelectorAll(`sbb-form-error:not([slot])`).forEach(e=>e.setAttribute(`slot`,`error`))}_connectInputElement(){let e=null;if(this._control?.id)e=this.getRootNode().getElementById(this._control.id);else{let t=Array.from(this.querySelectorAll(`*:not([slot],sbb-chip-group)`));e=(t.find(e=>this._isInputElement(e))||t[0])??null}return e===this._input?`unchanged`:(this._input&&(this.internals.states.delete(`input-type-${this._input.localName}`),this._input.localName===`input`&&this._unpatchInputValue()),e?(this._input=e,this._registerInputFormListener(),this._assignErrorMessageElements(),this._readInputState(),this._checkAndUpdateInputEmpty(),this._input.localName===`textarea`?this._input.setAttribute(`rows`,this._input.getAttribute(`rows`)||`3`):this._input.localName===`input`?this._patchInputValue():(this._input.localName===`select`||this._input.localName===`sbb-select`)&&!this.hasUpdated&&this.hydrationComplete.then(()=>this.requestUpdate()),this._formFieldAttributeObserver?.disconnect(),this._formFieldAttributeObserver?.observe(this._input,{attributes:!0,attributeFilter:[`readonly`,`disabled`,`form`,`class`,`data-expanded`]}),this.internals.states.add(`input-type-${this._input.localName}`),this._syncLabelInputReferences(),`changed`):(this._input=null,`no-input`))}_syncLabelInputReferences(){if(!(!this._input||!this._label))if(Ns.includes(this._input.localName)||customElements.get(this._input.localName)?.formAssociated)this._input.id||=`sbb-form-field-input-${js++}`,this._label.htmlFor=this._input.id;else{this._label.id||=`sbb-form-field-label-${js++}`;let e=this._input.getAttribute(`aria-labelledby`)?.split(` `).filter(e=>!!e&&e!==this._label.id)??[];this._input.setAttribute(`aria-labelledby`,[...e,this._label.id].join(` `))}}_isInputElement(e){return Ns.includes(e.localName)||!!customElements.get(e.localName)?.formAssociated}_readInputState(){this.toggleState(`readonly`,this._control?.readOnly??this._input.hasAttribute(`readonly`)),this.toggleState(`disabled`,this._control?.disabled??this._input.hasAttribute(`disabled`)),this.toggleState(`has-popup-open`,this._input.hasAttribute(`data-expanded`))}_registerInputFormListener(){this._inputFormAbortController.abort();let{signal:e}=this._inputFormAbortController=new AbortController;(this._input?.form??this._input?.closest(`form`))?.addEventListener(`reset`,()=>setTimeout(()=>this.reset()),{signal:e})}_patchInputValue(){let e=this._input;if(!e||Ms.has(e))return;let t=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e),`value`);if(!t||!t.set||!t.get)return;Ms.set(e,t);let{get:n,set:r}=t,i=()=>this._checkAndUpdateInputEmpty();Object.defineProperty(e,`value`,{...t,get(){return n.call(this)},set(e){r.call(this,e),i()}})}_unpatchInputValue(){let e=this._input,t=Ms.get(e);t&&(Object.defineProperty(e,`value`,t),Ms.delete(e))}_checkAndUpdateInputEmpty(){this.toggleState(`empty`,this._control?.empty??(((this._floatingLabelSupportedInputElements.includes(this._input?.localName)||this._input?.constructor?.formFieldAssociated)??!1)&&this._isInputEmpty()))}_isInputEmpty(){let e=this.querySelector(`sbb-chip-group`);return e?this._isInputValueEmpty()&&(Array.isArray(e.value)?e.value.length===0:!e.querySelector(`sbb-chip`)):this._input instanceof HTMLInputElement?this._floatingLabelSupportedInputTypes.includes(this._input.type)&&this._isInputValueEmpty():this._input instanceof HTMLSelectElement?this._input.selectedOptions?.item(0)?.label?.trim()===``:this._input?.localName===`sbb-select`?this._input.getDisplayValue?.()?.trim()===``:this._isInputValueEmpty()}_isInputValueEmpty(){let e=this._input.value;return[``,void 0,null].includes(e)||Array.isArray(e)&&e.length===0}_onSlotErrorChange(e){let t=e.target.assignedElements();this._input&&this._input.ariaDescribedByElements?.length&&(this._input.ariaDescribedByElements=fn(this._input.ariaDescribedByElements,...this._errorElements??[])),this._errorElements=t;for(let e of this._errorElements)e.role||=`status`;this._assignErrorMessageElements(),this.toggleState(`has-error`,!!this._errorElements.length),this._syncNegative()}_assignErrorMessageElements(){this._input&&(this._input.ariaDescribedByElements=dn(this._input.ariaDescribedByElements,...this._errorElements))}reset(){this._checkAndUpdateInputEmpty()}clear(){this._input?.localName===`input`&&(this._input.value=``,this._checkAndUpdateInputEmpty())}_syncNegative(){this.querySelectorAll?.(`sbb-form-error,sbb-mini-button,sbb-popover-trigger,sbb-form-field-clear,sbb-datepicker-next-day,sbb-datepicker-previous-day,sbb-datepicker-toggle,sbb-select,sbb-autocomplete,sbb-autocomplete-grid,sbb-chip-group`).forEach(e=>e.toggleAttribute(`negative`,this.negative))}_syncSize(){this.querySelectorAll?.(`sbb-autocomplete,sbb-autocomplete-grid,sbb-select`).forEach(e=>e.size=this.size===`s`?`s`:`m`)}render(){return N`
      <div class="sbb-form-field__space-wrapper">
        ${``}
        <div @click=${this._handleWrapperClick} class="sbb-form-field__wrapper" id="overlay-anchor">
          <slot name="prefix" @slotchange=${this._syncNegative}></slot>
          <div class="sbb-form-field__input-container">
            <span class="sbb-form-field__label-spacer" aria-hidden="true"></span>
            <span class="sbb-form-field__label">
              <span class="sbb-form-field__label-ellipsis">
                <slot name="label" @slotchange=${this._onSlotLabelChange}></slot>
                ${this.optional?N` <span aria-hidden="true"> ${Sn[this._language.current]} </span>`:P}
              </span>
            </span>
            <div class="sbb-form-field__input">
              <slot @slotchange=${this._onSlotInputChange}></slot>
            </div>
            ${this.hasUpdated&&[`select`,`sbb-select`].includes(this._input?.localName)?N`<sbb-icon
                  name="chevron-small-down-small"
                  class="sbb-form-field__select-input-icon"
                ></sbb-icon>`:P}
          </div>
          <slot name="suffix" @slotchange=${this._syncNegative}></slot>
        </div>

        <div class="sbb-form-field__error">
          <slot name="error" @slotchange=${this._onSlotErrorChange}></slot>
        </div>
      </div>
    `}},e=new WeakMap,t=new WeakMap,n=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,l=new WeakMap,u=new WeakMap,d=new WeakMap,f=new WeakMap,_=p,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(v[Symbol.metadata]??null):void 0;y=[A({attribute:`error-space`,reflect:!0})],S=[L(),A({type:Boolean})],w=[A({reflect:!0})],ne=[L(),A({reflect:!0,type:Boolean})],O=[A({reflect:!0})],ie=[L(),A({attribute:`hidden-label`,reflect:!0,type:Boolean})],se=[L(),A({attribute:`floating-label`,reflect:!0,type:Boolean})],ue=[j()],pe=[j()],M=[j()],i(p,null,y,{kind:`accessor`,name:`errorSpace`,static:!1,private:!1,access:{has:e=>`errorSpace`in e,get:e=>e.errorSpace,set:(e,t)=>{e.errorSpace=t}},metadata:e},b,x),i(p,null,S,{kind:`accessor`,name:`optional`,static:!1,private:!1,access:{has:e=>`optional`in e,get:e=>e.optional,set:(e,t)=>{e.optional=t}},metadata:e},C,ee),i(p,null,w,{kind:`accessor`,name:`size`,static:!1,private:!1,access:{has:e=>`size`in e,get:e=>e.size,set:(e,t)=>{e.size=t}},metadata:e},T,te),i(p,null,ne,{kind:`accessor`,name:`borderless`,static:!1,private:!1,access:{has:e=>`borderless`in e,get:e=>e.borderless,set:(e,t)=>{e.borderless=t}},metadata:e},E,D),i(p,null,O,{kind:`accessor`,name:`width`,static:!1,private:!1,access:{has:e=>`width`in e,get:e=>e.width,set:(e,t)=>{e.width=t}},metadata:e},re,k),i(p,null,ie,{kind:`accessor`,name:`hiddenLabel`,static:!1,private:!1,access:{has:e=>`hiddenLabel`in e,get:e=>e.hiddenLabel,set:(e,t)=>{e.hiddenLabel=t}},metadata:e},ae,oe),i(p,null,se,{kind:`accessor`,name:`floatingLabel`,static:!1,private:!1,access:{has:e=>`floatingLabel`in e,get:e=>e.floatingLabel,set:(e,t)=>{e.floatingLabel=t}},metadata:e},ce,le),i(p,null,ue,{kind:`accessor`,name:`_errorElements`,static:!1,private:!1,access:{has:e=>`_errorElements`in e,get:e=>e._errorElements,set:(e,t)=>{e._errorElements=t}},metadata:e},de,fe),i(p,null,pe,{kind:`accessor`,name:`_input`,static:!1,private:!1,access:{has:e=>`_input`in e,get:e=>e._input,set:(e,t)=>{e._input=t}},metadata:e},me,he),i(p,null,M,{kind:`accessor`,name:`_label`,static:!1,private:!1,access:{has:e=>`_label`in e,get:e=>e._label,set:(e,t)=>{e._label=t}},metadata:e},ge,_e),i(null,h={value:_},m,{kind:`class`,name:_.name,metadata:e},null,g),_=h.value,e&&Object.defineProperty(_,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),p.styles=As,a(_,g),_})()})),Is=e((()=>{Fs()})),Ls,Rs=e((()=>{o(),I(),M(),Is(),Ls=h`*,:before,:after{box-sizing:border-box}:host{display:flex;--sbb-form-field-border-radius: var(--sbb-border-radius-6x);--sbb-form-field-outline-offset: -.3125rem;--sbb-timetable-form-field-route-icon-color: var(--sbb-color-2);--sbb-timetable-form-field-route-icon-background-color: var(--sbb-background-color-1)}:host(:first-of-type){--sbb-timetable-form-field-route-icon-rotate: 90deg}:host(:last-of-type){--sbb-timetable-form-field-route-icon-rotate: -90deg;--sbb-timetable-form-field-route-icon-translate: -.0625rem 0}:host(:where(:not(:last-of-type))) .sbb-form-field__wrapper:after{content:"";position:absolute;border-block-end:var(--sbb-border-width-1x) var(--sbb-form-field-border-style) var(--sbb-border-color-4-inverted);inset-inline:var(--sbb-form-field-padding-inline);inset-block-end:0}.sbb-timetable-form-field__start-route-icon{align-self:center;margin-inline-start:var(--sbb-form-field-padding-inline);rotate:var(--sbb-timetable-form-field-route-icon-rotate);translate:var(--sbb-timetable-form-field-route-icon-translate)}.sbb-timetable-form-field__start-route-icon:after{--connecting-line-offset: .1875rem;--connecting-line-width: calc( (var(--sbb-form-field-min-height) - var(--sbb-icon-svg-height)) / 2 + var(--connecting-line-offset) );content:"";position:absolute;inset-block-start:50%;border-block-start:var(--sbb-border-width-1x) solid var(--sbb-timetable-form-field-route-icon-color);width:var(--connecting-line-width);margin-left:calc(var(--connecting-line-offset) * -1)}.sbb-timetable-form-field__via-route-icon{align-self:stretch;position:relative;width:var(--sbb-size-icon-ui-small);margin-inline-start:var(--sbb-form-field-padding-inline)}.sbb-timetable-form-field__via-route-icon:before{content:"";position:absolute;inset-inline-start:50%;height:100%;margin-inline-start:-.0625rem;border-inline-start:var(--sbb-border-width-1x) solid var(--sbb-timetable-form-field-route-icon-color)}.sbb-timetable-form-field__via-route-icon:after{content:"";position:absolute;inset-block-start:50%;inset-inline-start:50%;translate:-50% -50%;width:.4375rem;height:.4375rem;border:var(--sbb-border-width-1x) solid var(--sbb-timetable-form-field-route-icon-color);border-radius:var(--sbb-border-radius-infinity);background-color:var(--sbb-timetable-form-field-route-icon-background-color);margin-inline-start:-.03125rem}.sbb-form-field__space-wrapper{flex-grow:1}`,(()=>{var e;let t=[s(`sbb-timetable-form-field`)],n,r=[],o,c=Ps;return e=class extends c{constructor(){super(),this._routeIcon=!1,this.borderless=!0,this.floatingLabel=!0,this.width=`collapse`,this.size=`l`}connectedCallback(){super.connectedCallback(),this.hydrationComplete.then(()=>this._routeIcon=this.matches(`:first-of-type, :last-of-type`))}render(){return N`
      ${this._routeIcon?N` <sbb-icon
            name="route-circle-start-small"
            class="sbb-timetable-form-field__start-route-icon"
          ></sbb-icon>`:N` <span class="sbb-timetable-form-field__via-route-icon"></span> `}
      ${super.render()}
    `}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Ps.styles,Ls],a(o,r),o})()})),zs=e((()=>{qo()})),Bs,Vs=e((()=>{o(),M(),zs(),z(),H(),I(),Bs=h`*,:before,:after{box-sizing:border-box}:host(:is(:state(timetable-form-context),[state--timetable-form-context])){--sbb-timetable-form-swap-button-margin-inline-end: var(--sbb-spacing-fixed-6x);--sbb-timetable-form-swap-button-translate: 0 -50%;--sbb-timetable-form-swap-button-z-index: 1;--sbb-timetable-form-swap-button-position: absolute;position:relative}.sbb-timetable-form-swap-button{position:var(--sbb-timetable-form-swap-button-position, relative);margin-inline-end:var(--sbb-timetable-form-swap-button-margin-inline-end);translate:var(--sbb-timetable-form-swap-button-translate);z-index:var(--sbb-timetable-form-swap-button-z-index);inset-inline-end:0}`,(()=>{var e;let t=[s(`sbb-timetable-form-swap-button`)],n,r=[],o,c=Ko;return e=class extends c{constructor(){super(),this._languageController=new R(this),this.iconName=`arrow-change-small`,this.addEventListener(`click`,()=>this._invertFieldValues())}connectedCallback(){super.connectedCallback(),this.toggleState(`timetable-form-context`,!!this.closest(`sbb-timetable-form`))}willUpdate(e){super.willUpdate(e),this.internals.ariaLabel=Zn[this._languageController.current]}_invertFieldValues(){let e=this.closest(`sbb-timetable-form`),t=Array.from(e?.querySelectorAll(`sbb-timetable-form-field`)||[]),n=t.map(e=>e.inputElement?.value);!e||n.length===0||n.every(e=>!e)||n.reverse().forEach((e,n)=>{let r=t[n].inputElement;r instanceof HTMLInputElement&&(r.value=e,r.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),r.dispatchEvent(new Event(`change`,{bubbles:!0})))})}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=[Ko.styles,Bs],a(o,r),o})()})),Hs=e((()=>{Cs(),Ts(),Rs(),Vs()}));function Us(){return N`
    <div class="sbb-gap-fix-wrapper">
      <div class="sbb-gap-fix-corner" id="left"></div>
    </div>
    <div class="sbb-gap-fix-wrapper">
      <div class="sbb-gap-fix-corner" id="right"></div>
    </div>
  `}var Ws=e((()=>{I()}));function Gs(e){let t=window.getComputedStyle(e),n=t.display,r=parseInt(t.maxHeight,10).toString();if(n!==`none`&&r!==`0`)return{scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,offsetHeight:e.offsetHeight,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,offsetWidth:e.offsetWidth};e.style.position=`absolute`,e.style.visibility=`hidden`,e.style.display=`block`;let i=e.scrollHeight,a=e.clientHeight,o=e.offsetHeight,s=e.scrollWidth,c=e.clientWidth,l=e.offsetWidth;return e.style.display=``,e.style.position=``,e.style.visibility=``,{scrollHeight:i,clientHeight:a,offsetHeight:o,scrollWidth:s,clientWidth:c,offsetWidth:l}}function Ks(e,t){if(!e||!t)return!1;let n=e.getBoundingClientRect();return n.top<=t.clientY&&t.clientY<=n.top+n.height&&n.left<=t.clientX&&t.clientX<=n.left+n.width}function qs(e,t,n,r){let i=r?.verticalOffset||0,a=r?.horizontalOffset||0,o=r?.responsiveHeight||!1,s=t.getBoundingClientRect(),c=Gs(e),l=s.left,u=s.top,d=document.documentElement.clientWidth-(l+s.width),f=u-i,p=document.documentElement.clientHeight-(u+s.height+i),m=l,h=u+s.height+i,g=c.offsetWidth-s.width,_={horizontal:`start`,vertical:`below`},v=`${p-i}px`;r?.centered&&l-16+s.width/2>c.offsetWidth/2&&d-16>g/2&&(m-=g/=2,_.horizontal=`center`),d<g&&l>g&&(m-=g,_.horizontal=`end`),a&&_.horizontal!==`center`&&s.width/2<a&&(m+=a*(_.horizontal===`start`?-1:1)),(l<g&&d<g||document.documentElement.clientWidth<c.offsetWidth)&&(m=document.documentElement.clientWidth/2-c.offsetWidth/2);let y=p-i<c.scrollHeight&&f-i>(o?c.clientHeight:c.scrollHeight)||f>p&&p-i<c.clientHeight&&!o;!r?.forceBelow&&(r?.forceAbove||y)&&(h=f<c.scrollHeight?h-s.height-f-i:u-c.clientHeight-i,v=`${f-i}px`,_.vertical=`above`);let b=n.getBoundingClientRect();return b.left<0&&(m-=b.left),b.top<0&&(h-=b.top),{top:h,left:m,maxHeight:v,alignment:_}}var Js=e((()=>{}));function Ys(e,t,n,r,i,a=`auto`){if(!e||!t)return;i.style.setProperty(`--sbb-options-panel-width`,`${t.offsetWidth}px`),i.style.setProperty(`--sbb-options-panel-origin-height`,`${t.offsetHeight}px`);let o=qs(n,t,r,{forceBelow:a===`below`,forceAbove:a===`above`});i.style.setProperty(`--sbb-options-panel-position-x`,`${o.left}px`),i.style.setProperty(`--sbb-options-panel-position-y`,`${o.top}px`),i.style.setProperty(`--sbb-options-panel-max-height`,o.maxHeight),i.setAttribute(`data-options-panel-position`,o.alignment.vertical),t.setAttribute(`data-options-panel-position`,o.alignment.vertical)}var Xs=e((()=>{Js()})),Zs,Qs=e((()=>{U(),Zs=class{constructor(){this._overlays=new Set,this._pointerDownListener=e=>{this._pointerDownEventTarget=e.composedPath()[0]},this._clickListener=e=>{let t=e.composedPath()[0],n=e.type===`click`&&this._pointerDownEventTarget?this._pointerDownEventTarget:t;this._pointerDownEventTarget=void 0;for(let e of Array.from(this._overlays).reverse()){if(nr(e,t)||nr(e,n))break;e.dispatchEvent(new CustomEvent(`overlayOutsidePointer`))}}}connect(e){this._overlays.size||(this._addGlobalEventListeners(),hr&&(this._cursorOriginalValue=document.body.style.cursor,document.body.style.cursor=`pointer`)),this._overlays.add(e)}disconnect(e){this._overlays.delete(e),this._overlays.size||(this._abortController?.abort(),this._abortController=void 0,hr&&(document.body.style.cursor=this._cursorOriginalValue))}_addGlobalEventListeners(){let e=document.body;this._abortController=new AbortController;let t={capture:!0,passive:!0,signal:this._abortController.signal};e.addEventListener(`click`,this._clickListener,t),!_r&&!hr&&(e.addEventListener(`pointerdown`,this._pointerDownListener,t),e.addEventListener(`auxclick`,this._clickListener,t),e.addEventListener(`contextmenu`,this._clickListener,t))}},new Zs}));function $s(e,t,n,r){e&&(e.setAttribute(`aria-haspopup`,t),e.setAttribute(`aria-controls`,n),e.setAttribute(`aria-expanded`,`${r===`opening`||r===`opened`}`))}function ec(e){e&&(e.removeAttribute(`aria-haspopup`),e.removeAttribute(`aria-controls`),e.removeAttribute(`aria-expanded`))}function tc(e,t,n,r=`listbox`){e&&(e.setAttribute(`autocomplete`,`off`),e.setAttribute(`role`,`combobox`),e.setAttribute(`aria-autocomplete`,`list`),e.setAttribute(`aria-haspopup`,r),e.setAttribute(`aria-controls`,t),e.setAttribute(`aria-owns`,t),e.setAttribute(`aria-expanded`,`${n}`))}function nc(e){e&&(e.removeAttribute(`autocomplete`),e.removeAttribute(`role`),e.removeAttribute(`aria-autocomplete`),e.removeAttribute(`aria-haspopup`),e.removeAttribute(`aria-controls`),e.removeAttribute(`aria-owns`),e.removeAttribute(`aria-expanded`))}var rc=e((()=>{})),ic=e((()=>{Ws(),Xs(),Qs(),rc(),Js()})),ac,oc=e((()=>{ot(),ac=class{constructor(e,{target:t,config:n,callback:r,skipInitial:i}){this.t=new Set,this.o=!1,this.i=!1,this.h=e,t!==null&&this.t.add(t??e),this.l=n,this.o=i??this.o,this.callback=r,window.ResizeObserver?(this.u=new ResizeObserver((e=>{this.handleChanges(e),this.h.requestUpdate()})),e.addController(this)):console.warn(`ResizeController error: browser does not support ResizeObserver.`)}handleChanges(e){this.value=this.callback?.(e,this.u)}hostConnected(){for(let e of this.t)this.observe(e)}hostDisconnected(){this.disconnect()}async hostUpdated(){!this.o&&this.i&&this.handleChanges([]),this.i=!1}observe(e){this.t.add(e),this.u.observe(e,this.l),this.i=!0,this.h.requestUpdate()}unobserve(e){this.t.delete(e),this.u.unobserve(e)}disconnect(){this.u.disconnect()}}})),sc,cc,lc=e((()=>{nt(),Wa(),Oa(),sc=new WeakMap,cc=Ea(class extends Ua{render(e){return P}update(e,[t]){let n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),P}rt(e){if(this.isConnected||(e=void 0),typeof this.G==`function`){let t=this.ht??globalThis,n=sc.get(t);n===void 0&&(n=new WeakMap,sc.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G==`function`?sc.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}})})),uc=e((()=>{lc()})),dc,fc,pc,mc,Z,hc,gc,_c,vc=e((()=>{o(),oc(),I(),M(),uc(),q(),z(),B(),U(),G(),ic(),dc=e=>{throw TypeError(e)},fc=(e,t,n)=>t.has(e)||dc(`Cannot `+n),pc=(e,t,n)=>(fc(e,t,`read from private field`),n?n.call(e):t.get(e)),mc=(e,t,n)=>t.has(e)?dc(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Z=(e,t,n,r)=>(fc(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),hc=h`*,:before,:after{box-sizing:border-box}.sbb-gap-fix-wrapper{position:relative;overflow:hidden;width:var(--sbb-options-panel-border-radius);height:var(--sbb-options-panel-border-radius);background-color:transparent}.sbb-gap-fix-corner{position:absolute;border-radius:50%;border:calc(var(--sbb-options-panel-border-radius) / 2) solid var(--sbb-options-panel-background-color);width:calc(var(--sbb-options-panel-border-radius) * 3);height:calc(var(--sbb-options-panel-border-radius) * 3);bottom:calc(var(--sbb-options-panel-border-radius) / 2 * -1)}.sbb-gap-fix-corner#left{left:calc(var(--sbb-options-panel-border-radius) / 2 * -1)}:host(:dir(rtl)) .sbb-gap-fix-corner#left{right:calc(var(--sbb-options-panel-border-radius) / 2 * -1);left:unset}.sbb-gap-fix-corner#right{right:calc(var(--sbb-options-panel-border-radius) / 2 * -1)}:host(:dir(rtl)) .sbb-gap-fix-corner#right{left:calc(var(--sbb-options-panel-border-radius) / 2 * -1);right:unset}:host{--sbb-scrollbar-thumb-width: .125rem;--sbb-scrollbar-thumb-width-hover: .25rem;--sbb-scrollbar-width-firefox: thin;--sbb-scrollbar-color: color-mix(in srgb, var(--sbb-color-black) 30%, transparent);--sbb-scrollbar-color: light-dark( color-mix(in srgb, var(--sbb-color-black) 30%, transparent), color-mix(in srgb, var(--sbb-color-white) 30%, transparent) );--sbb-scrollbar-color-hover: color-mix(in srgb, var(--sbb-color-black) 60%, transparent);--sbb-scrollbar-color-hover: light-dark( color-mix(in srgb, var(--sbb-color-black) 60%, transparent), color-mix(in srgb, var(--sbb-color-white) 60%, transparent) );--sbb-scrollbar-track-color: transparent;--sbb-options-panel-position-x: 0;--sbb-options-panel-position-y: 0;--sbb-options-panel-active-option-y: 0;--sbb-options-panel-max-height: calc(85vh - var(--sbb-spacing-fixed-8x));--sbb-options-panel-min-height: var(--sbb-options-panel-origin-height);--sbb-options-panel-visibility: visible;--sbb-options-panel-width: fit-content;--sbb-options-panel-border-radius: var(--sbb-border-radius-4x);--sbb-options-panel-options-border-radius: 0 0 var(--sbb-options-panel-border-radius) var(--sbb-options-panel-border-radius);--sbb-options-panel-animation-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-4x) );--sbb-options-panel-animation-timing-function: ease;--sbb-options-panel-gap-fix-opacity: 0;--sbb-options-panel-gap-fix-transform: none;--sbb-options-panel-gap-fix-top: calc( var(--sbb-options-panel-position-y) - var(--sbb-options-panel-border-radius) );--sbb-options-panel-background-color: var(--sbb-background-color-1);--sbb-options-panel-padding-block: var(--sbb-spacing-fixed-2x);--sbb-options-panel-divider-margin-block: var(--sbb-spacing-fixed-3x);--sbb-focus-outline-color: var(--sbb-focus-outline-color-default);--sbb-focus-outline-color: light-dark( var(--sbb-focus-outline-color-default), var(--sbb-focus-outline-color-dark) );--sbb-options-pointer-events: all;--sbb-options-panel-internal-z-index: var( --sbb-autocomplete-z-index, var(--sbb-overlay-default-z-index) );display:none}:host([size=s]){--sbb-options-panel-padding-block: var(--sbb-spacing-fixed-1x)}:host([data-state]:not([data-state=closed])){display:block}:host([negative]){--sbb-scrollbar-color: color-mix(in srgb, var(--sbb-color-white) 30%, transparent);--sbb-scrollbar-color-hover: color-mix(in srgb, var(--sbb-color-white) 60%, transparent);--sbb-options-panel-background-color: var(--sbb-background-color-1-negative);--sbb-focus-outline-color: var(--sbb-focus-outline-color-dark)}:host(:not([data-state])),:host([data-state=closed]){--sbb-options-panel-visibility: hidden;--sbb-options-pointer-events: none}:host([data-state=opening]){--sbb-options-panel-animation-name: open}:host([data-state=closing]){--sbb-options-panel-animation-name: close}:host([data-state=opened]),:host([data-state=opening]){--sbb-options-panel-gap-fix-opacity: 1}:host([data-options-panel-position=below]){--sbb-options-panel-animation-transform: translateY( calc((var(--sbb-options-panel-origin-height) / 2) * -1) )}:host([data-options-panel-position=above]){--sbb-options-panel-options-border-radius: var(--sbb-options-panel-border-radius) var(--sbb-options-panel-border-radius) 0 0;--sbb-options-panel-gap-fix-top: var(--sbb-options-panel-max-height);--sbb-options-panel-gap-fix-transform: rotate(180deg);--sbb-options-panel-animation-transform: translateY( calc(var(--sbb-options-panel-origin-height) / 2) )}:host([preserve-icon-space]){--sbb-option-icon-container-display: block}::slotted(sbb-divider){margin-block:var(--sbb-options-panel-divider-margin-block)}.sbb-autocomplete__container{position:fixed;pointer-events:none;inset:0;z-index:var(--sbb-options-panel-internal-z-index)}.sbb-autocomplete__gap-fix{display:flex;justify-content:space-between;position:fixed;visibility:var(--sbb-options-panel-visibility);opacity:var(--sbb-options-panel-gap-fix-opacity);background-color:transparent;width:var(--sbb-options-panel-width);height:var(--sbb-options-panel-border-radius);top:var(--sbb-options-panel-gap-fix-top);left:var(--sbb-options-panel-position-x);transform:var(--sbb-options-panel-gap-fix-transform);transition:opacity var(--sbb-options-panel-animation-duration) var(--sbb-options-panel-animation-timing-function)}.sbb-autocomplete__panel{display:block;position:absolute;visibility:var(--sbb-options-panel-visibility);overflow:hidden;background-color:transparent;border:none;border-radius:var(--sbb-options-panel-border-radius);top:var(--sbb-options-panel-position-y);left:var(--sbb-options-panel-position-x);width:var(--sbb-options-panel-width);transition:box-shadow var(--sbb-options-panel-animation-duration) var(--sbb-options-panel-animation-timing-function)}.sbb-autocomplete__panel:before,.sbb-autocomplete__panel:after{content:"";display:none;position:relative;width:100%;height:var(--sbb-options-panel-origin-height);background-color:transparent;border-radius:var(--sbb-options-panel-border-radius);pointer-events:none;transition:box-shadow var(--sbb-options-panel-animation-duration) var(--sbb-options-panel-animation-timing-function);z-index:1}:host([data-options-panel-position=below]) .sbb-autocomplete__panel{inset-block-start:calc(var(--sbb-options-panel-position-y) - var(--sbb-options-panel-origin-height))}:host(:is([data-state=opened],[data-state=opening])) .sbb-autocomplete__panel{box-shadow:var(--sbb-shadow-elevation-level-5-shadow-2-offset-x) var(--sbb-shadow-elevation-level-5-shadow-2-offset-y) var(--sbb-shadow-elevation-level-5-shadow-2-blur) var(--sbb-shadow-elevation-level-5-shadow-2-spread) var(--sbb-shadow-color-hard-2),var(--sbb-shadow-elevation-level-5-shadow-1-offset-x) var(--sbb-shadow-elevation-level-5-shadow-1-offset-y) var(--sbb-shadow-elevation-level-5-shadow-1-blur) var(--sbb-shadow-elevation-level-5-shadow-1-spread) var(--sbb-shadow-color-hard-1)}:host(:is([data-state=opened],[data-state=opening])[negative]) .sbb-autocomplete__panel{box-shadow:var(--sbb-shadow-elevation-level-5-shadow-2-offset-x) var(--sbb-shadow-elevation-level-5-shadow-2-offset-y) var(--sbb-shadow-elevation-level-5-shadow-2-blur) var(--sbb-shadow-elevation-level-5-shadow-2-spread) var(--sbb-shadow-color-hard-2-negative),var(--sbb-shadow-elevation-level-5-shadow-1-offset-x) var(--sbb-shadow-elevation-level-5-shadow-1-offset-y) var(--sbb-shadow-elevation-level-5-shadow-1-blur) var(--sbb-shadow-elevation-level-5-shadow-1-spread) var(--sbb-shadow-color-hard-1-negative)}:host([data-options-panel-position=below]) .sbb-autocomplete__panel:before{display:block}:host([data-options-panel-position=above]) .sbb-autocomplete__panel:after{display:block}:host(:is([data-state=opened],[data-state=opening])[data-option-panel-origin-borderless]) .sbb-autocomplete__panel:before,:host(:is([data-state=opened],[data-state=opening])[data-option-panel-origin-borderless]) .sbb-autocomplete__panel:after{box-shadow:var(--sbb-shadow-elevation-level-5-shadow-2-offset-x) var(--sbb-shadow-elevation-level-5-shadow-2-offset-y) var(--sbb-shadow-elevation-level-5-shadow-2-blur) var(--sbb-shadow-elevation-level-5-shadow-2-spread) var(--sbb-shadow-color-hard-2),var(--sbb-shadow-elevation-level-5-shadow-1-offset-x) var(--sbb-shadow-elevation-level-5-shadow-1-offset-y) var(--sbb-shadow-elevation-level-5-shadow-1-blur) var(--sbb-shadow-elevation-level-5-shadow-1-spread) var(--sbb-shadow-color-hard-1)}:host(:is([data-state=opened],[data-state=opening])[data-option-panel-origin-borderless][negative]) .sbb-autocomplete__panel:before,:host(:is([data-state=opened],[data-state=opening])[data-option-panel-origin-borderless][negative]) .sbb-autocomplete__panel:after{box-shadow:var(--sbb-shadow-elevation-level-5-shadow-2-offset-x) var(--sbb-shadow-elevation-level-5-shadow-2-offset-y) var(--sbb-shadow-elevation-level-5-shadow-2-blur) var(--sbb-shadow-elevation-level-5-shadow-2-spread) var(--sbb-shadow-color-hard-2-negative),var(--sbb-shadow-elevation-level-5-shadow-1-offset-x) var(--sbb-shadow-elevation-level-5-shadow-1-offset-y) var(--sbb-shadow-elevation-level-5-shadow-1-blur) var(--sbb-shadow-elevation-level-5-shadow-1-spread) var(--sbb-shadow-color-hard-1-negative)}.sbb-autocomplete__wrapper{overflow:hidden}.sbb-autocomplete__options{background-color:var(--sbb-options-panel-background-color);padding-block:var(--sbb-options-panel-padding-block);padding-inline:0;border-radius:var(--sbb-options-panel-options-border-radius);max-height:var(--sbb-options-panel-max-height);min-height:var(--sbb-options-panel-min-height);pointer-events:all;overflow-y:auto;animation-name:var(--sbb-options-panel-animation-name);animation-duration:var(--sbb-options-panel-animation-duration);animation-timing-function:var(--sbb-options-panel-animation-timing-function);--sbb-scrollbar-width: var(--sbb-spacing-fixed-3x)}.sbb-autocomplete__options::-webkit-scrollbar{width:var(--sbb-scrollbar-width);height:var(--sbb-scrollbar-width);background-color:var(--sbb-scrollbar-track-color, transparent)}.sbb-autocomplete__options::-webkit-scrollbar-corner{background-color:var(--sbb-scrollbar-track-color, transparent)}.sbb-autocomplete__options::-webkit-scrollbar-thumb{background-color:var(--sbb-scrollbar-color, currentcolor);border:calc(.5 * (var(--sbb-scrollbar-width) - var(--sbb-scrollbar-thumb-width))) solid transparent;border-radius:var(--sbb-border-radius-4x);background-clip:padding-box}.sbb-autocomplete__options::-webkit-scrollbar-thumb:hover{background-color:var(--sbb-scrollbar-color-hover, currentcolor);border-width:calc(.5 * (var(--sbb-scrollbar-width) - var(--sbb-scrollbar-thumb-width-hover)))}.sbb-autocomplete__options::-webkit-scrollbar-button,.sbb-autocomplete__options::-webkit-scrollbar-corner{display:none}@supports not selector(::-webkit-scrollbar){.sbb-autocomplete__options{scrollbar-width:var(--sbb-scrollbar-width-firefox);scrollbar-color:var(--sbb-scrollbar-color, currentcolor) var(--sbb-scrollbar-track-color, transparent)}}.sbb-autocomplete__options{pointer-events:var(--sbb-options-pointer-events)}@media(forced-colors:active){.sbb-autocomplete__options{border:var(--sbb-border-width-1x) solid CanvasText;border-top:none}}@keyframes open{0%{transform:var(--sbb-options-panel-animation-transform);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes close{0%{transform:translateY(0);opacity:1}to{transform:var(--sbb-options-panel-animation-transform);opacity:0}}`,gc=vr,_c=(()=>{var e,t,n,r,o,s,c,l,u,d;let f=W(ki(ga)),p,m=[],h=[],g,_=[],v=[],y,b=[],x=[],S,C=[],ee=[],w,T=[],te=[],ne,E=[],D=[],O,re=[],k=[],ie,ae=[],oe=[],se,j=[],ce=[];return d=class extends f{constructor(){super(...arguments),mc(this,e),mc(this,t),mc(this,n),mc(this,r),mc(this,o),mc(this,s),mc(this,c),mc(this,l),mc(this,u),Z(this,e,a(this,m,null)),Z(this,t,(a(this,h),a(this,_,null))),Z(this,n,(a(this,v),a(this,b,!1))),Z(this,r,(a(this,x),a(this,C,!1))),Z(this,o,(a(this,ee),a(this,T,null))),Z(this,s,(a(this,te),a(this,E,or()?`s`:`m`))),Z(this,c,(a(this,D),a(this,re,!1))),Z(this,l,(a(this,k),a(this,ae,!1))),Z(this,u,(a(this,oe),a(this,j,`auto`))),this._triggerElement=a(this,ce),this.activeOption=null,this._originResizeObserver=new ac(this,{target:null,skipInitial:!0,callback:()=>{this.state===`opened`&&this._setOverlayPosition()}}),this._triggerAttributeObserver=new MutationObserver(e=>{let t=e[0].target;(t.hasAttribute(`disabled`)||t.hasAttribute(`readonly`))&&this.close()}),this._isPointerDownEventOnMenu=!1,this._escapableOverlayController=new Dt(this),this._optionsCount=0,this._lastUserInput=null,this._pointerDownListener=e=>{this._isPointerDownEventOnMenu=Ks(this._overlay,e)},this._closeOnBackdropClick=e=>{!this._isPointerDownEventOnMenu&&!Ks(this._overlay,e)&&!Ks(this.originElement,e)&&this.close()}}get origin(){return pc(this,e)}set origin(t){Z(this,e,t)}get trigger(){return pc(this,t)}set trigger(e){Z(this,t,e)}get preserveIconSpace(){return pc(this,n)}set preserveIconSpace(e){Z(this,n,e)}get autoActiveFirstOption(){return pc(this,r)}set autoActiveFirstOption(e){Z(this,r,e)}get displayWith(){return pc(this,o)}set displayWith(e){Z(this,o,e)}get size(){return pc(this,s)}set size(e){Z(this,s,e)}get autoSelectActiveOption(){return pc(this,c)}set autoSelectActiveOption(e){Z(this,c,e)}get requireSelection(){return pc(this,l)}set requireSelection(e){Z(this,l,e)}get position(){return pc(this,u)}set position(e){Z(this,u,e)}get originElement(){return this.origin??this.closest?.(`sbb-form-field`)?.shadowRoot?.querySelector?.(`#overlay-anchor`)??this.trigger??null}get triggerElement(){return this._triggerElement??null}open(){if(this.state!==`closed`||!this._overlay||this.options.length===0||this._readonly()||!this.dispatchBeforeOpenEvent())return;this.showPopover?.(),this.state=`opening`,this._triggerElement?.toggleAttribute(`data-expanded`,!0);let e=this.originElement;if(!e)throw Error(`Cannot find the origin element. Please specify a valid element or check the usage of the "origin" property from the documentation`);this._setOverlayPosition(e),this._setNextActiveOptionIfAutoActiveFirstOption(),this._isZeroAnimationDuration()&&this._handleOpening()}close(){this.state!==`opened`||!this.dispatchBeforeCloseEvent()||(this.state=`closing`,this._triggerElement?.toggleAttribute(`data-expanded`,!1),this._openPanelEventsController.abort(),this.originElement&&this._originResizeObserver.unobserve(this.originElement),this._isZeroAnimationDuration()&&this._handleClosing())}_isZeroAnimationDuration(){return $n(this,`--sbb-options-panel-animation-duration`)}connectedCallback(){this.popover=`manual`,super.connectedCallback(),gc&&(this.id||=this.overlayId);let e=this.closest(`sbb-form-field`)??this.closest(`[data-form-field]`);e&&(this.negative=e.hasAttribute(`negative`)),this.hasUpdated&&this._componentSetup(),this.syncNegative()}willUpdate(e){super.willUpdate(e),e.has(`negative`)&&this.syncNegative(),e.has(`autoActiveFirstOption`)&&this.isOpen&&this._setNextActiveOptionIfAutoActiveFirstOption()}firstUpdated(e){super.firstUpdated(e),this._componentSetup()}disconnectedCallback(){super.disconnectedCallback(),this._triggerElement=null,this._triggerAbortController?.abort(),this._openPanelEventsController?.abort()}requestUpdate(e,t,n){super.requestUpdate(e,t,n),this.hasUpdated&&(!e||e===`trigger`?this._configureTrigger():(!e||e===`origin`)&&this.isOpen&&this._setOverlayPosition())}onOptionSelected(e){let t=e.target;this._setValueAndDispatchEvents(t),this.close()}onOptionArrowsSelected(e){e.selected=!0,this._setValueAndDispatchEvents(e)}_setValueAndDispatchEvents(e){if(this.options.filter(t=>t.id!==e.id&&t.selected).forEach(e=>e.selected=!1),this.triggerElement){let t=this.displayWith?.(e.value)??e.value;Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,`value`).set.call(this.triggerElement,t),this.triggerElement.dispatchEvent(new Event(`change`,{bubbles:!0})),this.triggerElement.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),this._lastUserInput=null,this.triggerElement.dispatchEvent(new CustomEvent(`inputAutocomplete`,{detail:{option:e}})),this.triggerElement.focus()}}_handleSlotchange(){this._highlightOptions(this.triggerElement?.value),this.isOpen?(this._setOverlayPosition(),this._setNextActiveOptionIfAutoActiveFirstOption(),this._optionsCount>0&&this.options.length===0&&this.close()):document?.activeElement===this.triggerElement&&this._optionsCount===0&&this.options.length>0&&this.open(),this._optionsCount=this.options.length}_setNextActiveOptionIfAutoActiveFirstOption(){this.autoActiveFirstOption&&(this.resetActiveElement(),this.setNextActiveOption())}_readonly(){return this.triggerElement?.hasAttribute(`readonly`)??!1}_componentSetup(){this.toggleAttribute(`data-option-panel-origin-borderless`,!!this.closest?.(`sbb-form-field`)?.hasAttribute(`borderless`)),this._configureTrigger()}_configureTrigger(){let e=this.trigger??this.closest?.(`sbb-form-field`)?.querySelector(`input`);if(e===this._triggerElement||(this._triggerAbortController?.abort(),nc(this.triggerElement),this._triggerElement=e,!this.triggerElement))return;let t=this.originElement;this.triggerElement===t&&this.isOpen&&this._setOverlayPosition(t),this._triggerAttributeObserver?.observe(this._triggerElement,{attributes:!0,attributeFilter:[`disabled`,`readonly`]}),this.setTriggerAttributes(this.triggerElement),this._triggerAbortController=new AbortController,this.triggerElement.addEventListener(`focus`,()=>this.open(),{signal:this._triggerAbortController.signal}),this.triggerElement.addEventListener(`click`,()=>this.open(),{signal:this._triggerAbortController.signal}),this.triggerElement.addEventListener(`input`,e=>{this.open();let t=e.target.value;this._highlightOptions(t),this._lastUserInput=t},{signal:this._triggerAbortController.signal}),this.triggerElement.addEventListener(`keydown`,e=>this._closedPanelKeyboardInteraction(e),{signal:this._triggerAbortController.signal,capture:!0})}_setOverlayPosition(e=this.originElement){e&&Ys(this._overlay,e,this._optionContainer,this.shadowRoot.querySelector(`.sbb-autocomplete__container`),this,this.position)}_onAnimationEnd(e){e.animationName===`open`&&this.state===`opening`?this._handleOpening():e.animationName===`close`&&this.state===`closing`&&this._handleClosing()}_handleOpening(){this.state=`opened`,this._attachOpenPanelEvents(),this.originElement&&this._originResizeObserver.observe(this.originElement),this.triggerElement?.setAttribute(`aria-expanded`,`true`),this._escapableOverlayController.connect(),this.dispatchOpenEvent()}_handleClosing(){this.state=`closed`,this.hidePopover?.(),this.triggerElement?.setAttribute(`aria-expanded`,`false`),this.requireSelection&&this.triggerElement&&this._lastUserInput&&(Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,`value`).set.call(this.triggerElement,``),this._highlightOptions(``),this.triggerElement.dispatchEvent(new Event(`change`,{bubbles:!0})),this.triggerElement.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))),this.resetActiveElement(),this._optionContainer.scrollTop=0,this._escapableOverlayController.disconnect(),this.dispatchCloseEvent()}_attachOpenPanelEvents(){this._openPanelEventsController=new AbortController,document.addEventListener(`scroll`,()=>this._setOverlayPosition(),{passive:!0,signal:this._openPanelEventsController.signal,capture:!0}),window.addEventListener(`resize`,()=>this._setOverlayPosition(),{passive:!0,signal:this._openPanelEventsController.signal}),window.addEventListener(`pointerdown`,e=>this._pointerDownListener(e),{signal:this._openPanelEventsController.signal}),window.addEventListener(`pointerup`,e=>this._closeOnBackdropClick(e),{signal:this._openPanelEventsController.signal}),this.addEventListener(`ɵdisabledchange`,()=>{this.activeOption?.disabled&&this.resetActiveElement(),this._setNextActiveOptionIfAutoActiveFirstOption()},{signal:this._openPanelEventsController.signal}),this.triggerElement?.addEventListener(`keydown`,e=>this.openedPanelKeyboardInteraction(e),{signal:this._openPanelEventsController.signal,capture:!0})}_closedPanelKeyboardInteraction(e){if(this.state===`closed`)switch(e.key){case`Enter`:case`ArrowDown`:case`ArrowUp`:this.open();break}}_highlightOptions(e){e!=null&&this.options.forEach(t=>t.highlight(e))}render(){return N`
      <div class="sbb-autocomplete__gap-fix"></div>
      <div class="sbb-autocomplete__container">
        <div class="sbb-autocomplete__gap-fix">${Us()}</div>
        <div
          @animationend=${this._onAnimationEnd}
          class="sbb-autocomplete__panel"
          ?data-open=${this.state===`opened`||this.state===`opening`}
          ${cc(e=>this._overlay=e)}
        >
          <div class="sbb-autocomplete__wrapper">
            <div
              class="sbb-autocomplete__options"
              role=${gc?P:this.panelRole}
              id=${gc?P:this.overlayId}
              ${cc(e=>this._optionContainer=e)}
            >
              <slot @slotchange=${this._handleSlotchange}></slot>
            </div>
          </div>
        </div>
      </div>
    `}},e=new WeakMap,t=new WeakMap,n=new WeakMap,r=new WeakMap,o=new WeakMap,s=new WeakMap,c=new WeakMap,l=new WeakMap,u=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(f[Symbol.metadata]??null):void 0;p=[ht(),A()],g=[ht(),A()],y=[L(),A({attribute:`preserve-icon-space`,reflect:!0,type:Boolean})],S=[L(),A({attribute:`auto-active-first-option`,type:Boolean})],w=[A({attribute:!1})],ne=[A({reflect:!0})],O=[L(),A({attribute:`auto-select-active-option`,type:Boolean})],ie=[L(),A({attribute:`require-selection`,type:Boolean})],se=[A()],i(d,null,p,{kind:`accessor`,name:`origin`,static:!1,private:!1,access:{has:e=>`origin`in e,get:e=>e.origin,set:(e,t)=>{e.origin=t}},metadata:e},m,h),i(d,null,g,{kind:`accessor`,name:`trigger`,static:!1,private:!1,access:{has:e=>`trigger`in e,get:e=>e.trigger,set:(e,t)=>{e.trigger=t}},metadata:e},_,v),i(d,null,y,{kind:`accessor`,name:`preserveIconSpace`,static:!1,private:!1,access:{has:e=>`preserveIconSpace`in e,get:e=>e.preserveIconSpace,set:(e,t)=>{e.preserveIconSpace=t}},metadata:e},b,x),i(d,null,S,{kind:`accessor`,name:`autoActiveFirstOption`,static:!1,private:!1,access:{has:e=>`autoActiveFirstOption`in e,get:e=>e.autoActiveFirstOption,set:(e,t)=>{e.autoActiveFirstOption=t}},metadata:e},C,ee),i(d,null,w,{kind:`accessor`,name:`displayWith`,static:!1,private:!1,access:{has:e=>`displayWith`in e,get:e=>e.displayWith,set:(e,t)=>{e.displayWith=t}},metadata:e},T,te),i(d,null,ne,{kind:`accessor`,name:`size`,static:!1,private:!1,access:{has:e=>`size`in e,get:e=>e.size,set:(e,t)=>{e.size=t}},metadata:e},E,D),i(d,null,O,{kind:`accessor`,name:`autoSelectActiveOption`,static:!1,private:!1,access:{has:e=>`autoSelectActiveOption`in e,get:e=>e.autoSelectActiveOption,set:(e,t)=>{e.autoSelectActiveOption=t}},metadata:e},re,k),i(d,null,ie,{kind:`accessor`,name:`requireSelection`,static:!1,private:!1,access:{has:e=>`requireSelection`in e,get:e=>e.requireSelection,set:(e,t)=>{e.requireSelection=t}},metadata:e},ae,oe),i(d,null,se,{kind:`accessor`,name:`position`,static:!1,private:!1,access:{has:e=>`position`in e,get:e=>e.position,set:(e,t)=>{e.position=t}},metadata:e},j,ce),e&&Object.defineProperty(d,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),d.styles=hc,d})()})),yc,bc,xc=e((()=>{o(),M(),gi(),U(),ic(),vc(),yc=0,bc=vr,(()=>{var e;let t=[s(`sbb-autocomplete`)],n,r=[],o,c=_c;return e=class extends c{get options(){return Array.from(this.querySelectorAll?.(`sbb-option`)??[])}constructor(){super(),this.overlayId=`sbb-autocomplete-${++yc}`,this.panelRole=`listbox`,this.addEventListener?.(`optionselected`,e=>this.onOptionSelected(e))}syncNegative(){this.querySelectorAll?.(`sbb-divider, sbb-option-hint`).forEach(e=>e.negative=this.negative),this.querySelectorAll?.(`sbb-option, sbb-optgroup`).forEach(e=>e.toggleAttribute(`data-negative`,this.negative))}openedPanelKeyboardInteraction(e){if(this.state===`opened`)switch(e.key){case`Tab`:this.close();break;case`Enter`:this.selectByKeyboard(e);break;case`ArrowDown`:case`ArrowUp`:this.setNextActiveOption(e);break}}selectByKeyboard(e){e.preventDefault(),this.activeOption?.selectViaUserInteraction(!0)}setNextActiveOption(e){let t=this.options.filter(e=>!e.disabled&&!e.hasAttribute(`data-group-disabled`));if(this.activeOption?.setActive(!1),this.triggerElement?.removeAttribute(`aria-activedescendant`),!t.length){this.activeOption=null;return}this.activeOption=t[Ir(e,this.activeOption?t.indexOf(this.activeOption):-1,t.length)],this.activeOption.setActive(!0),this.triggerElement?.setAttribute(`aria-activedescendant`,this.activeOption.id),this.activeOption.scrollIntoView({block:`nearest`}),this.autoSelectActiveOption&&this.onOptionArrowsSelected(this.activeOption)}resetActiveElement(){this.activeOption?.setActive(!1),this.triggerElement?.removeAttribute(`aria-activedescendant`),this.activeOption=null}setTriggerAttributes(e){tc(e,bc?this.id:this.overlayId,!1)}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.role=bc?`listbox`:null,a(o,r),o})()})),Sc=e((()=>{xc(),vc()})),Cc,wc=e((()=>{ot(),Cc=class{constructor(e,{target:t,config:n,callback:r,skipInitial:i}){this.t=new Set,this.o=!1,this.i=!1,this.h=e,t!==null&&this.t.add(t??e),this.l=n,this.o=i??this.o,this.callback=r,window.MutationObserver?(this.u=new MutationObserver((e=>{this.handleChanges(e),this.h.requestUpdate()})),e.addController(this)):console.warn(`MutationController error: browser does not support MutationObserver.`)}handleChanges(e){this.value=this.callback?.(e,this.u)}hostConnected(){for(let e of this.t)this.observe(e)}hostDisconnected(){this.disconnect()}async hostUpdated(){let e=this.u.takeRecords();(e.length||!this.o&&this.i)&&this.handleChanges(e),this.i=!1}observe(e){this.t.add(e),this.u.observe(e,this.l),this.i=!0,this.h.requestUpdate()}disconnect(){this.u.disconnect()}}})),Tc,Ec,Dc,Oc,kc,Ac,jc=e((()=>{o(),I(),M(),G(),Tc=e=>{throw TypeError(e)},Ec=(e,t,n)=>t.has(e)||Tc(`Cannot `+n),Dc=(e,t,n)=>(Ec(e,t,`read from private field`),n?n.call(e):t.get(e)),Oc=(e,t,n)=>t.has(e)?Tc(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),kc=(e,t,n,r)=>(Ec(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ac=h`*,:before,:after{box-sizing:border-box}:host{--sbb-divider-color: var(--sbb-background-color-4);--sbb-divider-border-width: var(--sbb-border-width-1x);display:block}:host([orientation=vertical]){height:100%}:host([negative]){--sbb-divider-color: var(--sbb-background-color-4-negative)}:host([orientation=horizontal]) .sbb-divider{border-top:var(--sbb-divider-border-width) solid var(--sbb-divider-color)}:host([orientation=vertical]) .sbb-divider{height:100%;border-left:var(--sbb-divider-border-width) solid var(--sbb-divider-color)}`,(()=>{var e,t;let n=[s(`sbb-divider`)],r,o=[],c,l=W(pn(F)),u,d=[],f=[];return t=class extends l{constructor(){super(...arguments),Oc(this,e,a(this,d,`horizontal`)),a(this,f)}get orientation(){return Dc(this,e)}set orientation(t){kc(this,e,t)}willUpdate(e){super.willUpdate(e),e.has(`orientation`)&&(this.internals.ariaOrientation=this.orientation)}render(){return N` <div class="sbb-divider"></div> `}},e=new WeakMap,c=t,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(l[Symbol.metadata]??null):void 0;u=[A({reflect:!0})],i(t,null,u,{kind:`accessor`,name:`orientation`,static:!1,private:!1,access:{has:e=>`orientation`in e,get:e=>e.orientation,set:(e,t)=>{e.orientation=t}},metadata:e},d,f),i(null,r={value:c},n,{kind:`class`,name:c.name,metadata:e},null,o),c=r.value,e&&Object.defineProperty(c,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t.role=`separator`,t.styles=Ac,a(c,o),c})()})),Mc=e((()=>{jc()})),Nc,Pc,Fc,Ic,Lc,Rc,zc,Bc,Vc=e((()=>{o(),wc(),I(),M(),B(),U(),G(),Mc(),Nc=e=>{throw TypeError(e)},Pc=(e,t,n)=>t.has(e)||Nc(`Cannot `+n),Fc=(e,t,n)=>(Pc(e,t,`read from private field`),n?n.call(e):t.get(e)),Ic=(e,t,n)=>t.has(e)?Nc(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Lc=(e,t,n,r)=>(Pc(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Rc=h`*,:before,:after{box-sizing:border-box}:host{--sbb-optgroup-divider-display: block;--sbb-optgroup-label-padding-end: var(--sbb-spacing-fixed-2x);--sbb-optgroup-label-padding-inline: var(--sbb-spacing-responsive-xxxs);--sbb-optgroup-label-font-size: var(--sbb-typo-scale-0-75x);--sbb-optgroup-label-color: var(--sbb-color-metal);--sbb-optgroup-label-color: light-dark(var(--sbb-color-metal), var(--sbb-color-smoke));display:block}:host(:first-child){--sbb-optgroup-divider-display: none}:host([data-variant=select]){--sbb-optgroup-label-font-size: inherit}:host([data-negative]){--sbb-optgroup-label-color: var(--sbb-color-5)}.sbb-optgroup{margin-block:var(--sbb-spacing-fixed-4x);margin-inline:var(--sbb-spacing-fixed-4x)}.sbb-optgroup__label{--sbb-text-font-size: var(--sbb-font-size-text-xxs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);display:flex;column-gap:var(--sbb-spacing-responsive-xxxs);color:var(--sbb-optgroup-label-color);-webkit-text-fill-color:var(--sbb-optgroup-label-color);padding-inline:var(--sbb-optgroup-label-padding-inline);padding-block-end:var(--sbb-optgroup-label-padding-end)}.sbb-optgroup__divider{display:var(--sbb-optgroup-divider-display);padding-block:var(--sbb-options-panel-divider-margin-block)}.sbb-optgroup__icon-space{display:var(--sbb-option-icon-container-display, none);min-width:var(--sbb-size-icon-ui-small)}::slotted(sbb-divider){margin-block:var(--sbb-options-panel-divider-margin-block)}`,zc=vr,Bc=(()=>{var e,t,n,r;let o=V(pn(ki(F))),s,c=[],l=[],u,d=[],f=[],p,m=[],h=[];return r=class extends o{constructor(){super(),Ic(this,e,a(this,c,``)),Ic(this,t,(a(this,l),a(this,d,!1))),Ic(this,n,(a(this,f),a(this,m,!1))),a(this,h),this.addController(new Cc(this,{config:{attributes:!0,attributeFilter:[`data-negative`]},callback:()=>this._onNegativeChange()})),zc&&(this.hydrationRequired?this.hydrationComplete.then(()=>this._inertAriaGroups=zc):this._inertAriaGroups=zc)}get label(){return Fc(this,e)}set label(t){Lc(this,e,t)}get negative(){return Fc(this,t)}set negative(e){Lc(this,t,e)}get _inertAriaGroups(){return Fc(this,n)}set _inertAriaGroups(e){Lc(this,n,e)}connectedCallback(){super.connectedCallback(),this.setAttributeFromParent(),this._proxyGroupLabelToOptions()}willUpdate(e){super.willUpdate(e),e.has(`disabled`)&&(this._inertAriaGroups||(this.internals.ariaDisabled=this.disabled?`true`:null),this.proxyDisabledToOptions()),e.has(`label`)&&this._proxyGroupLabelToOptions()}_handleSlotchange(){this.proxyDisabledToOptions(),this._proxyGroupLabelToOptions(),this._highlightOptions(),this.dispatchEvent(new Event(`ɵoptgroupslotchange`))}_proxyGroupLabelToOptions(){if(this._inertAriaGroups)if(this.label){this.internals.ariaLabel=null;for(let e of this.options)e.setAttribute(`data-group-label`,this.label),e.requestUpdate?.()}else for(let e of this.options)e.removeAttribute(`data-group-label`),e.requestUpdate?.();else{this.internals.ariaLabel=this.label;return}}proxyDisabledToOptions(){for(let e of this.options)e.toggleAttribute(`data-group-disabled`,this.disabled)}_highlightOptions(){let e=this.getAutocompleteParent();if(!e)return;let t=e.triggerElement?.value;t&&this.options.forEach(e=>e.highlight(t))}_onNegativeChange(){this.negative=this.hasAttribute(`data-negative`)}render(){return N`
      <div class="sbb-optgroup__divider">
        <sbb-divider ?negative=${this.negative}></sbb-divider>
      </div>
      ${this.label?N`
            <div class="sbb-optgroup__label" aria-hidden="true">
              <div class="sbb-optgroup__icon-space"></div>
              <span>${this.label}</span>
            </div>
          `:P}
      <slot @slotchange=${this._handleSlotchange}></slot>
    `}},e=new WeakMap,t=new WeakMap,n=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(o[Symbol.metadata]??null):void 0;s=[L(),A()],u=[j()],p=[j()],i(r,null,s,{kind:`accessor`,name:`label`,static:!1,private:!1,access:{has:e=>`label`in e,get:e=>e.label,set:(e,t)=>{e.label=t}},metadata:e},c,l),i(r,null,u,{kind:`accessor`,name:`negative`,static:!1,private:!1,access:{has:e=>`negative`in e,get:e=>e.negative,set:(e,t)=>{e.negative=t}},metadata:e},d,f),i(r,null,p,{kind:`accessor`,name:`_inertAriaGroups`,static:!1,private:!1,access:{has:e=>`_inertAriaGroups`in e,get:e=>e._inertAriaGroups,set:(e,t)=>{e._inertAriaGroups=t}},metadata:e},m,h),e&&Object.defineProperty(r,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),r.role=zc?null:`group`,r.styles=Rc,r})()})),Hc=e((()=>{o(),M(),Vc(),(()=>{var e;let t=[s(`sbb-optgroup`)],n,r=[],o,c=Bc;return e=class extends c{get options(){return Array.from(this.querySelectorAll?.(`sbb-option`)??[])}getAutocompleteParent(){return this.closest?.(`sbb-autocomplete`)||null}setAttributeFromParent(){this.negative=!!this.closest?.(`:is(sbb-autocomplete, sbb-select, sbb-form-field)[negative]`),this.toggleAttribute(`data-negative`,this.negative)}connectedCallback(){super.connectedCallback(),this.toggleAttribute(`data-multiple`,!!this.closest(`sbb-select[multiple]`)),this._setVariantByContext()}_setVariantByContext(){this.closest?.(`sbb-autocomplete`)?this.setAttribute(`data-variant`,`autocomplete`):this.closest?.(`sbb-select`)&&this.setAttribute(`data-variant`,`select`)}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e}),a(o,r)})(),o})()})),Uc,Wc,Gc,Kc,qc,Jc,Yc,Xc,Zc,Qc=e((()=>{o(),wc(),I(),M(),B(),U(),G(),Mo(),Ni(),Uc=e=>{throw TypeError(e)},Wc=(e,t,n)=>t.has(e)||Uc(`Cannot `+n),Gc=(e,t,n)=>(Wc(e,t,`read from private field`),n?n.call(e):t.get(e)),Kc=(e,t,n)=>t.has(e)?Uc(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),qc=(e,t,n,r)=>(Wc(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Jc=0,Yc=vr,Xc={attributeFilter:[`data-group-disabled`,`data-negative`],attributes:!0,childList:!0,subtree:!0,characterData:!0},Zc=(()=>{var e,t,n,r,o,s,c;let l=[$t()],u,d=[],f,p=V(Ao(pn(ki(F)))),m=[],h,g,_,v=[],y=[],b,x=[],S=[],C,ee=[],w=[],T,te=[],ne=[],E,D=[],O=[],re,k=[],ie=[];return c=class extends p{constructor(){super(),Kc(this,e),Kc(this,t),Kc(this,n),Kc(this,r),Kc(this,o),Kc(this,s),this._value=(a(this,m),null),qc(this,e,a(this,v,!1)),qc(this,t,(a(this,y),a(this,x,!1))),qc(this,n,(a(this,S),a(this,ee,void 0))),qc(this,r,(a(this,w),a(this,te,!1))),qc(this,o,(a(this,ne),a(this,D,null))),qc(this,s,(a(this,O),a(this,k,!1))),a(this,ie),this.addEventListener?.(`click`,e=>this.selectByClick(e),{passive:!0}),this.addController(new Cc(this,{config:Xc,callback:e=>this.onExternalMutation(e)})),Yc&&(this.hydrationRequired?this.hydrationComplete.then(()=>this._inertAriaGroups=Yc):this._inertAriaGroups=Yc)}set value(e){typeof e==`string`?(this.setAttribute(`value`,`${e}`),this._value=null):this._value=e}get value(){return this._value??this.getAttribute(`value`)}set selected(e){this.toggleAttribute(`selected`,e),this._updateAriaSelected()}get selected(){return this.hasAttribute(`selected`)}get negative(){return Gc(this,e)}set negative(t){qc(this,e,t)}get disabledFromGroup(){return Gc(this,t)}set disabledFromGroup(e){qc(this,t,e)}get label(){return Gc(this,n)}set label(e){qc(this,n,e)}get disableLabelHighlight(){return Gc(this,r)}set disableLabelHighlight(e){qc(this,r,e)}get _highlightString(){return Gc(this,o)}set _highlightString(e){qc(this,o,e)}get _inertAriaGroups(){return Gc(this,s)}set _inertAriaGroups(e){qc(this,s,e)}attributeChangedCallback(e,t,n){(e!==`value`||t!==n)&&super.attributeChangedCallback(e,t,n)}highlight(e){this._highlightString=e}selectViaUserInteraction(e){this.selected=e,this.selected&&this.dispatchEvent(new Event(`optionselected`,{bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),this.id||=`${this.optionId}-${Jc++}`,this.hydrationRequired?this.hydrationComplete.then(()=>this.init()):this.init()}willUpdate(e){super.willUpdate(e),e.has(`disabled`)&&(cr(this,`tabindex`,_r&&!this.disabled&&0),this.updateAriaDisabled())}firstUpdated(e){super.firstUpdated(e),this._updateAriaSelected()}updateDisableHighlight(e){this.disableLabelHighlight=e,this.toggleAttribute(`data-disable-highlight`,e)}setActive(e){this.toggleAttribute(`data-active`,e)}init(){this.setAttributeFromParent()}updateAriaDisabled(){this.disabled||this.disabledFromGroup?this.setAttribute(`aria-disabled`,`true`):this.removeAttribute(`aria-disabled`),this.dispatchEvent(new Event(`ɵdisabledchange`,{bubbles:!0}))}_updateAriaSelected(){this.setAttribute(`aria-selected`,`${this.selected}`)}onExternalMutation(e){let t=!1;for(let n of e)n.attributeName===`data-group-disabled`?(this.disabledFromGroup=this.hasAttribute(`data-group-disabled`),this.updateAriaDisabled()):n.attributeName===`data-negative`?this.negative=this.hasAttribute(`data-negative`):t=!0;t&&(this.handleHighlightState(),this.dispatchEvent(new Event(`optionLabelChanged`,{bubbles:!0})))}handleHighlightState(){let e=Array.from(this.childNodes??[]).filter(e=>e.nodeType!==Node.COMMENT_NODE&&(!(e instanceof Element)||e.slot!==`icon`)),t=e.filter(e=>e.nodeType===Node.TEXT_NODE);if(t.length===0||e.filter(e=>!(e instanceof Element)||e.localName!==`template`).length!==t.length){this.updateDisableHighlight(!0);return}this.label=t.map(e=>e.wholeText).filter(e=>e.trim()).join()}getHighlightedLabel(){if(!this._highlightString||!this._highlightString.trim())return N`${this.label}`;let e=this.label.toLowerCase().indexOf(this._highlightString.toLowerCase());return e===-1?N`${this.label}`:N`
      <span class="sbb-option__label--highlight">${this.label.substring(0,e)}</span><span>${this.label.substring(e,e+this._highlightString.length)}</span
      ><span class="sbb-option__label--highlight">${this.label.substring(e+this._highlightString.length)}</span>
    `}renderIcon(){return N` <span class="sbb-option__icon"> ${this.renderIconSlot()} </span>`}renderLabel(){return this.label&&!this.disableLabelHighlight?this.getHighlightedLabel():P}renderTick(){return P}render(){return N`
      <div class="sbb-option__container">
        <div class="sbb-option">
          ${this.renderIcon()}
          <span class="sbb-option__label">
            <slot @slotchange=${this.handleHighlightState}></slot>
            ${this.renderLabel()}
            ${this._inertAriaGroups&&this.getAttribute(`data-group-label`)?N`<sbb-screen-reader-only>
                  (${this.getAttribute(`data-group-label`)})</sbb-screen-reader-only
                >`:P}
          </span>
          ${this.renderTick()}
        </div>
      </div>
    `}},e=new WeakMap,t=new WeakMap,n=new WeakMap,r=new WeakMap,o=new WeakMap,s=new WeakMap,f=c,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(p[Symbol.metadata]??null):void 0;h=[A()],g=[A({type:Boolean})],_=[j()],b=[j()],C=[j()],T=[j()],E=[j()],re=[j()],i(c,null,h,{kind:`setter`,name:`value`,static:!1,private:!1,access:{has:e=>`value`in e,set:(e,t)=>{e.value=t}},metadata:e},null,m),i(c,null,g,{kind:`setter`,name:`selected`,static:!1,private:!1,access:{has:e=>`selected`in e,set:(e,t)=>{e.selected=t}},metadata:e},null,m),i(c,null,_,{kind:`accessor`,name:`negative`,static:!1,private:!1,access:{has:e=>`negative`in e,get:e=>e.negative,set:(e,t)=>{e.negative=t}},metadata:e},v,y),i(c,null,b,{kind:`accessor`,name:`disabledFromGroup`,static:!1,private:!1,access:{has:e=>`disabledFromGroup`in e,get:e=>e.disabledFromGroup,set:(e,t)=>{e.disabledFromGroup=t}},metadata:e},x,S),i(c,null,C,{kind:`accessor`,name:`label`,static:!1,private:!1,access:{has:e=>`label`in e,get:e=>e.label,set:(e,t)=>{e.label=t}},metadata:e},ee,w),i(c,null,T,{kind:`accessor`,name:`disableLabelHighlight`,static:!1,private:!1,access:{has:e=>`disableLabelHighlight`in e,get:e=>e.disableLabelHighlight,set:(e,t)=>{e.disableLabelHighlight=t}},metadata:e},te,ne),i(c,null,E,{kind:`accessor`,name:`_highlightString`,static:!1,private:!1,access:{has:e=>`_highlightString`in e,get:e=>e._highlightString,set:(e,t)=>{e._highlightString=t}},metadata:e},D,O),i(c,null,re,{kind:`accessor`,name:`_inertAriaGroups`,static:!1,private:!1,access:{has:e=>`_inertAriaGroups`in e,get:e=>e._inertAriaGroups,set:(e,t)=>{e._inertAriaGroups=t}},metadata:e},k,ie),i(null,u={value:f},l,{kind:`class`,name:f.name,metadata:e},null,d),f=u.value,e&&Object.defineProperty(f,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),c.events={optionselected:`optionselected`},a(f,d),f})()})),$c,el,tl,nl,rl,il,al=e((()=>{o(),I(),M(),B(),U(),G(),$c=e=>{throw TypeError(e)},el=(e,t,n)=>t.has(e)||$c(`Cannot `+n),tl=(e,t,n)=>(el(e,t,`read from private field`),n?n.call(e):t.get(e)),nl=(e,t,n)=>t.has(e)?$c(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),rl=(e,t,n,r)=>(el(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),il=h`*,:before,:after{box-sizing:border-box}:host{display:block;--sbb-visual-checkbox-dimension: var(--sbb-size-icon-ui-small);--sbb-visual-checkbox-background-color: var(--sbb-background-color-1);--sbb-visual-checkbox-border-color: var(--sbb-border-color-5);--sbb-visual-checkbox-border-style: solid;--sbb-visual-checkbox-border-width: var(--sbb-border-width-1x);--sbb-visual-checkbox-selection-color: var(--sbb-color-primary);--sbb-visual-checkbox-cursor: pointer}@media(forced-colors:active){:host{--sbb-visual-checkbox-selection-color: Canvas;--sbb-visual-checkbox-border-width: 0}}:host([size=xs]){--sbb-visual-checkbox-dimension: 1.25rem}:host([negative]){--sbb-visual-checkbox-background-color: var(--sbb-background-color-1-negative);--sbb-visual-checkbox-border-color: var(--sbb-border-color-5);--sbb-visual-checkbox-selection-color: var(--sbb-color-primary85)}@media(forced-colors:active){:host([negative]){--sbb-visual-checkbox-selection-color: Canvas}}:host([disabled]){--sbb-visual-checkbox-background-color: var(--sbb-background-color-3);--sbb-visual-checkbox-border-color: var(--sbb-border-color-5);--sbb-visual-checkbox-border-style: dashed;--sbb-visual-checkbox-selection-color: var(--sbb-color-2);--sbb-visual-checkbox-cursor: default}@media(forced-colors:active){:host([disabled]){--sbb-visual-checkbox-selection-color: Canvas}}:host([disabled][negative]){--sbb-visual-checkbox-background-color: var(--sbb-background-color-3-negative);--sbb-visual-checkbox-border-color: var(--sbb-border-color-5);--sbb-visual-checkbox-selection-color: var(--sbb-color-2-negative)}@media(forced-colors:active){:host([disabled][negative]){--sbb-visual-checkbox-selection-color: Canvas}}@media(forced-colors:active){:host([indeterminate]){--sbb-visual-checkbox-selection-color: ButtonBorder}}@media(forced-colors:active){:host([indeterminate][disabled]){--sbb-visual-checkbox-selection-color: GrayText}}.sbb-visual-checkbox{position:relative;display:flex;align-items:center;justify-content:center;width:var(--sbb-visual-checkbox-dimension);height:var(--sbb-visual-checkbox-dimension);border-radius:var(--sbb-border-radius-2x);border:var(--sbb-visual-checkbox-border-width) var(--sbb-visual-checkbox-border-style) var(--sbb-visual-checkbox-border-color);background-color:var(--sbb-visual-checkbox-background-color);cursor:var(--sbb-visual-checkbox-cursor)}@media(forced-colors:active){.sbb-visual-checkbox{outline:var(--sbb-border-width-2x) solid ButtonBorder;outline-offset:calc(-1 * var(--sbb-border-width-2x))}:host([checked]:not([indeterminate])) .sbb-visual-checkbox{background-color:HighLight;outline:none}:host([disabled]) .sbb-visual-checkbox{outline-color:GrayText}:host([checked][disabled]:not([indeterminate])) .sbb-visual-checkbox{background-color:GrayText}}.sbb-visual-checkbox__icon{display:inline-flex;width:var(--sbb-visual-checkbox-dimension);height:var(--sbb-visual-checkbox-dimension)}.sbb-visual-checkbox__icon svg{margin:auto}.sbb-visual-checkbox__icon path{stroke:var(--sbb-visual-checkbox-selection-color)}`,(()=>{var e,t,n,r;let o=[s(`sbb-visual-checkbox`)],c,l=[],u,d=V(W(F)),f,p=[],m=[],h,g=[],_=[],v,y=[],b=[];return r=class extends d{constructor(){super(...arguments),nl(this,e,a(this,p,!1)),nl(this,t,(a(this,m),a(this,g,!1))),nl(this,n,(a(this,_),a(this,y,or()?`xs`:`m`))),a(this,b)}get checked(){return tl(this,e)}set checked(t){rl(this,e,t)}get indeterminate(){return tl(this,t)}set indeterminate(e){rl(this,t,e)}get size(){return tl(this,n)}set size(e){rl(this,n,e)}render(){return N`
      <span class="sbb-visual-checkbox">
        <span class="sbb-visual-checkbox__icon">
          ${this.checked||this.indeterminate?N`<svg
                width=${this.size===`xs`?`20`:`24`}
                height=${this.size===`xs`?`20`:`24`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d=${this.indeterminate?`M9 12H15`:`M8 12.3304L10.4615 15L16 9`}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`:P}
        </span>
      </span>
    `}},e=new WeakMap,t=new WeakMap,n=new WeakMap,u=r,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(d[Symbol.metadata]??null):void 0;f=[L(),A({reflect:!0,type:Boolean})],h=[L(),A({reflect:!0,type:Boolean})],v=[A({reflect:!0})],i(r,null,f,{kind:`accessor`,name:`checked`,static:!1,private:!1,access:{has:e=>`checked`in e,get:e=>e.checked,set:(e,t)=>{e.checked=t}},metadata:e},p,m),i(r,null,h,{kind:`accessor`,name:`indeterminate`,static:!1,private:!1,access:{has:e=>`indeterminate`in e,get:e=>e.indeterminate,set:(e,t)=>{e.indeterminate=t}},metadata:e},g,_),i(r,null,v,{kind:`accessor`,name:`size`,static:!1,private:!1,access:{has:e=>`size`in e,get:e=>e.size,set:(e,t)=>{e.size=t}},metadata:e},y,b),i(null,c={value:u},o,{kind:`class`,name:u.name,metadata:e},null,l),u=c.value,e&&Object.defineProperty(u,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),r.styles=il,a(u,l),u})()})),ol=e((()=>{al()})),sl,cl=e((()=>{o(),I(),M(),Qc(),ol(),sl=h`*,:before,:after{box-sizing:border-box}:host{--sbb-option-color: var(--sbb-color-3);--sbb-option-background-color: inherit;--sbb-option-background-color-hover: var(--sbb-background-color-3);--sbb-option-background-color-active: var(--sbb-background-color-4);--sbb-option-disabled-border-color: var(--sbb-color-graphite);--sbb-option-disabled-border-color: light-dark(var(--sbb-color-graphite), var(--sbb-color-smoke));--sbb-option-disabled-background-color: var(--sbb-background-color-3);--sbb-option-padding-inline: var(--sbb-spacing-responsive-xxxs);--sbb-option-min-height: var(--sbb-size-element-s);--sbb-option-column-gap: var(--sbb-spacing-responsive-xxxs);--sbb-option-justify-content: start;--sbb-option-cursor: pointer;--sbb-option-border-radius: var(--sbb-border-radius-4x);--sbb-option-icon-color: var(--sbb-color-metal);--sbb-option-icon-color: light-dark(var(--sbb-color-metal), var(--sbb-color-smoke));--sbb-option-focus-outline-color: transparent;--sbb-option-focus-outline-inset: var(--sbb-spacing-fixed-1x);display:block}:host([data-negative]){--sbb-option-color: var(--sbb-color-3-negative);--sbb-option-icon-color: var(--sbb-color-5);--sbb-option-background-color-hover: var(--sbb-background-color-3-negative);--sbb-option-background-color-active: var(--sbb-background-color-4-negative);--sbb-option-disabled-border-color: var(--sbb-border-color-5);--sbb-option-disabled-background-color: var(--sbb-background-color-3-negative);--sbb-focus-outline-color: var(--sbb-focus-outline-color-dark)}@media(any-hover:hover){:host(:hover:not([disabled],[data-group-disabled])){--sbb-option-background-color: var(--sbb-option-background-color-hover)}}:host(:active:not([disabled],[data-group-disabled])){--sbb-option-background-color: var(--sbb-option-background-color-active)}:host(:not([data-disable-highlight])) .sbb-option__label slot{display:none}:host(:is([data-group-disabled],[disabled])){--sbb-option-cursor: default}@media(forced-colors:active){:host(:is([data-group-disabled],[disabled])){--sbb-option-color: GrayText}}:host([data-variant=select]){--sbb-option-column-gap: var(--sbb-spacing-fixed-2x);--sbb-option-justify-content: space-between}:host([data-variant=select][data-multiple]){--sbb-option-justify-content: start}:host([data-active]){--sbb-option-focus-outline-color: var(--sbb-focus-outline-color)}:host(:not(:is([disabled],[data-group-disabled]))) .sbb-option__label--highlight{font-weight:700}@media(forced-colors:active){:host(:not(:is([disabled],[data-group-disabled]))) .sbb-option__label--highlight{color:Highlight}}.sbb-option__container{background-color:var(--sbb-option-background-color)}.sbb-option{--sbb-text-font-size: var(--sbb-font-size-text-s);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);position:relative;display:flex;min-height:var(--sbb-option-min-height);align-items:center;column-gap:var(--sbb-option-column-gap);padding-inline:var(--sbb-option-padding-inline);justify-content:var(--sbb-option-justify-content);color:var(--sbb-option-color);cursor:var(--sbb-option-cursor);-webkit-tap-highlight-color:transparent;-webkit-text-fill-color:var(--sbb-option-color)}.sbb-option:after{content:"";display:block;position:absolute;inset:var(--sbb-option-focus-outline-inset);pointer-events:none;border:var(--sbb-focus-outline-width) solid var(--sbb-option-focus-outline-color);border-radius:var(--sbb-option-border-radius)}:host(:is([data-group-disabled],[disabled]):not([data-multiple])) .sbb-option{position:relative;z-index:0}:host(:is([data-group-disabled],[disabled]):not([data-multiple])) .sbb-option:before{content:"";display:block;position:absolute;inset:.375rem;border:var(--sbb-border-width-1x) dashed var(--sbb-option-disabled-border-color);border-radius:var(--sbb-border-radius-2x);background-color:var(--sbb-option-disabled-background-color);z-index:-1}@media(forced-colors:active){:host(:is([data-group-disabled],[disabled]):not([data-multiple])) .sbb-option:before{border-color:GrayText}}.sbb-option__icon{display:flex;min-width:var(--sbb-size-icon-ui-small);min-height:var(--sbb-size-icon-ui-small);color:var(--sbb-option-icon-color)}:host(:not([data-slot-names~=icon],[icon-name])) .sbb-option__icon{display:var(--sbb-option-icon-container-display, none)}.sbb-option__label{text-overflow:var(--sbb-option-text-overflow);overflow:var(--sbb-option-overflow);white-space:var(--sbb-option-white-space, initial)}`,(()=>{var e;let t=[s(`sbb-option`)],n,r=[],o,c=Zc;return e=class extends c{constructor(){super(...arguments),this.optionId=`sbb-option`}set _variant(e){e&&this.setAttribute(`data-variant`,e)}get _variant(){return this.getAttribute(`data-variant`)}set _isMultiple(e){this.toggleAttribute(`data-multiple`,e)}get _isMultiple(){return!this.hydrationRequired&&this.hasAttribute(`data-multiple`)}setAttributeFromParent(){let e=this.closest?.(`sbb-optgroup`);e&&(this.disabledFromGroup=e.disabled,this.updateAriaDisabled()),this.negative=!!this.closest?.(`sbb-autocomplete[negative],sbb-form-field[negative]`),this.toggleAttribute(`data-negative`,this.negative),this.toggleAttribute(`data-multiple`,this._isMultiple)}selectByClick(e){if(this.disabled||this.disabledFromGroup){e.stopPropagation();return}this._isMultiple?(e.stopPropagation(),this.selectViaUserInteraction(!this.selected)):this.selectViaUserInteraction(!0)}selectViaUserInteraction(e){super.selectViaUserInteraction(e),this.dispatchEvent(new Event(`optionselectionchange`,{bubbles:!0,composed:!0}))}init(){super.init(),this._setVariantByContext(),this.handleHighlightState()}_setVariantByContext(){this.closest?.(`sbb-autocomplete`)?this._variant=`autocomplete`:this.closest?.(`sbb-select`)&&(this._variant=`select`),this._isMultiple=!!this.closest?.(`sbb-select[multiple]`)}handleHighlightState(){if(this._variant!==`autocomplete`){this.updateDisableHighlight(!0);return}super.handleHighlightState()}renderIcon(){return N`
      <!-- Icon -->
      ${this._isMultiple?P:N` <span class="sbb-option__icon"> ${this.renderIconSlot()} </span>`}

      <!-- Checkbox -->
      ${this._isMultiple?N`
            <sbb-visual-checkbox
              ?checked=${this.selected}
              ?disabled=${this.disabled||this.disabledFromGroup}
              ?negative=${this.negative}
            ></sbb-visual-checkbox>
          `:P}
    `}renderLabel(){return this._variant===`autocomplete`&&this.label&&!this.disableLabelHighlight?this.getHighlightedLabel():P}renderTick(){return this._variant===`select`&&!this._isMultiple&&this.selected?N`<sbb-icon name="tick-small"></sbb-icon>`:P}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.role=`option`,e.styles=sl,e.events={optionselectionchange:`optionselectionchange`,optionselected:`optionselected`},a(o,r),o})()})),ll,ul=e((()=>{o(),I(),M(),G(),ll=h`*,:before,:after{box-sizing:border-box}:host{display:block;--sbb-option-hint-color: var(--sbb-color-metal);--sbb-option-hint-color: light-dark(var(--sbb-color-metal), var(--sbb-color-smoke));--sbb-option-hint-column-gap: var(--sbb-spacing-responsive-xxxs);--sbb-option-hint-padding-block-end: var(--sbb-spacing-fixed-2x);--sbb-option-hint-padding-inline: var(--sbb-spacing-responsive-xxxs)}:host([negative]){--sbb-option-hint-color: var(--sbb-color-5)}.sbb-option-hint__wrapper{display:flex;column-gap:var(--sbb-option-hint-column-gap);padding-inline:var(--sbb-option-hint-padding-inline);padding-block-end:var(--sbb-option-hint-padding-block-end)}.sbb-optgroup__icon-space{display:var(--sbb-option-icon-container-display, none);min-width:var(--sbb-size-icon-ui-small)}.sbb-option-hint{--sbb-text-font-size: var(--sbb-font-size-text-xxs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);color:var(--sbb-option-hint-color);-webkit-text-fill-color:var(--sbb-option-hint-color)}`,(()=>{var e;let t=[s(`sbb-option-hint`)],n,r=[],o,c=W(F);return e=class extends c{render(){return N`
      <div class="sbb-option-hint__wrapper">
        <div class="sbb-optgroup__icon-space"></div>
        <span class="sbb-option-hint">
          <slot></slot>
        </span>
      </div>
    `}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=ll,a(o,r),o})()})),dl=e((()=>{Hc(),Vc(),cl(),Qc(),ul()})),fl,pl=e((()=>{o(),I(),M(),q(),z(),H(),G(),Mo(),fl=h`*,:before,:after{box-sizing:border-box}:host{display:block;outline:none!important}:host{display:inline-block;-webkit-tap-highlight-color:transparent;height:fit-content;outline:none!important;--sbb-button-color-text: var(--sbb-color-3);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3);--sbb-button-color-active-background: var(--sbb-background-color-4);--sbb-button-color-disabled-background: var(--sbb-background-color-3);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-color-disabled-text: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-button-border-disabled-width: var(--sbb-border-width-1x);--sbb-button-border-disabled-style: dashed;--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing)}@media(forced-colors:active){:host{--sbb-button-color-text: ButtonText !important;--sbb-button-color-hover-background: Highlight !important;--sbb-button-color-active-background: Highlight !important;--sbb-button-color-disabled-background: Canvas !important;--sbb-button-color-disabled-border: GrayText !important;--sbb-button-color-disabled-text: GrayText !important}}:host .sbb-form-field-clear{position:relative;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;border-radius:var(--sbb-button-border-radius);color:var(--sbb-button-color-text);cursor:pointer;-webkit-user-select:none;user-select:none;display:flex}:host .sbb-form-field-clear:before{position:absolute;content:"";inset:0;border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color}sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem));display:flex}:host([negative]){--sbb-button-color-text: var(--sbb-color-3-negative);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3-negative);--sbb-button-color-active-background: var(--sbb-background-color-4-negative);--sbb-button-color-disabled-background: var(--sbb-background-color-3-negative);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-5)}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-form-field-clear{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-form-field-clear:before{background-color:var(--sbb-button-color-disabled-background);border:var(--sbb-button-border-disabled-width) var(--sbb-button-border-disabled-style) var(--sbb-button-color-disabled-border)}:host(:is([data-focus-visible],:focus-visible)) .sbb-form-field-clear:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}:host([data-focus-visible]){--sbb-focus-outline-style: initial}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover){--sbb-button-translate-y-content-hover: -.0625rem}}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover) .sbb-form-field-clear:before{background-color:var(--sbb-button-color-hover-background)}}:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled]):is(:active,[data-active])) .sbb-form-field-clear:before{background-color:var(--sbb-button-color-active-background)}`,(()=>{var e;let t=[s(`sbb-form-field-clear`)],n,r=[],o,c=W(sa);return e=class extends c{constructor(){super(),this._language=new R(this),this.addEventListener?.(`click`,()=>this._handleClick())}connectedCallback(){super.connectedCallback(),this._formField=this.closest(`sbb-form-field, [data-form-field]`),this._formField&&(this.slot||=`suffix`,this.negative=this._formField.hasAttribute(`negative`))}async _handleClick(){let e=this._formField?.inputElement;!e||e.localName!==`input`||(this._formField?.clear(),e.focus(),e.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),e.dispatchEvent(new Event(`change`,{bubbles:!0})))}willUpdate(e){super.willUpdate(e),this.internals.ariaLabel=Vn[this._language.current]}renderTemplate(){return N` <sbb-icon name="cross-small"></sbb-icon> `}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=fl,a(o,r),o})()})),ml=e((()=>{Fs(),pl()})),hl,gl,_l,vl,yl,bl,xl,Sl=e((()=>{o(),I(),M(),xt(),Yt(),B(),H(),G(),hl=e=>{throw TypeError(e)},gl=(e,t,n)=>t.has(e)||hl(`Cannot `+n),_l=(e,t,n)=>(gl(e,t,`read from private field`),n?n.call(e):t.get(e)),vl=(e,t,n)=>t.has(e)?hl(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),yl=(e,t,n,r)=>(gl(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),bl=h`:host{display:inline-flex;min-width:9.375rem;max-width:100%;cursor:text;align-items:center}@media(forced-colors:active){:host{color:FieldText}}:host(:disabled){cursor:default}:host(:focus){text-overflow:initial!important}:host(:empty):after{content:attr(placeholder);color:var(--sbb-color-5);-webkit-text-fill-color:var(--sbb-color-5);opacity:1}@media(forced-colors:active){:host(:empty):after{color:GrayText}}`,Object.assign(ValidityState.prototype,{get sbbDateFilter(){return!1}}),xl=(()=>{var e,t,n,r;let o=[s(`sbb-date-input`)],c,l=[],u,d=Ei(F),f=[],p,m,h=[],g=[],_,v=[],y=[],b,x,S=[],C=[];return r=class extends d{constructor(){super(),vl(this,e),vl(this,t),vl(this,n),this._valueAsDate=a(this,f),yl(this,e,a(this,h,null)),yl(this,t,(a(this,g),a(this,v,null))),yl(this,n,(a(this,y),a(this,S,`short`))),this._valueCache=a(this,C),this._dateAdapter=yt().datetime?.dateAdapter??qt,this._placeholderMutable=!1,this._dateFilter=()=>!0,this.addEventListener?.(`change`,()=>this._updateValueDateFormat(),{capture:!0})}set value(e){this._tryParseValue(e),!this.matches(`:focus`)&&this.valueAsDate!==null&&(e=this._formatDate()),super.value=e}get value(){return super.value??``}set valueAsDate(e){if(e=this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(e)),!e)this._valueAsDate=null,this._valueCache=[``,null],this.value=``;else if(!this._dateAdapter.isDateInstance(this._valueAsDate)||this._dateAdapter.compareDate(this._valueAsDate,e)!==0){this._valueAsDate=this._dateAdapter.createDate(this._dateAdapter.getYear(e),this._dateAdapter.getMonth(e),this._dateAdapter.getDate(e));let t=this._formatDate();this._valueCache=[t,this._valueAsDate],this.value=t}}get valueAsDate(){return this._valueAsDate?this._dateAdapter.clone(this._valueAsDate):null}get empty(){return!this.value||this.value.trim()===``}get min(){return _l(this,e)}set min(t){yl(this,e,t)}get max(){return _l(this,t)}set max(e){yl(this,t,e)}set dateFilter(e){this._dateFilter=e}get dateFilter(){return this._dateFilter}get weekdayStyle(){return _l(this,n)}set weekdayStyle(e){yl(this,n,e)}get datepicker(){return this.parentElement.querySelector(`sbb-datepicker`)}static resolveAssociation(e){if(e.hasAttribute(`input`)||e.input)return;let t=e.closest(`sbb-form-field`)?.querySelector(`sbb-date-input`);t&&(e.input=t)}connectedCallback(){super.connectedCallback(),this.placeholder||=(this._placeholderMutable=!0,zn[this.language.current]);for(let e of Array.from(this.closest(`sbb-form-field`)?.children??[]))customElements.upgrade?.(e),e.constructor.sbbDateInputAssociated&&!e.hasAttribute(`input`)&&!e.input&&(e.input=this)}requestUpdate(e,t,n){super.requestUpdate(e,t,n),this.hasUpdated&&!e?(this._updateValueDateFormat(),this._placeholderMutable&&(this.placeholder=zn[this.language.current])):e===`weekdayStyle`&&this._updateValueDateFormat(),this.isConnected&&this.dispatchEvent(new Event(`ɵchange`))}updateFormValue(){this._tryParseValue();let e=this.valueAsDate===null?null:this._dateAdapter.toIso8601(this.valueAsDate);this.internals.setFormValue(e,this.value)}_tryParseValue(e=this.value){this._valueCache?.[0]!==e&&(this._valueAsDate=this._dateAdapter.parse(e),this._valueCache=[e,this._valueAsDate])}_updateValueDateFormat(){if(this.valueAsDate){let e=this._formatDate();this.value!==e&&(super.value=e)}}_formatDate(){return this._dateAdapter.format(this.valueAsDate,{weekdayStyle:this.weekdayStyle})}shouldValidate(e){return super.shouldValidate(e)||[`valueAsDate`,`min`,`max`,`dateFilter`].includes(e)}validate(){super.validate(),this.value?this._dateAdapter.isValid(this.valueAsDate)?this._dateAdapter.isValid(this.min)&&this._dateAdapter.compareDate(this.min,this.valueAsDate)>0?this.setValidityFlag(`rangeUnderflow`,Wn(this._dateAdapter.format(this.min,{weekdayStyle:`none`}))[this.language.current]):this._dateAdapter.isValid(this.max)&&this._dateAdapter.compareDate(this.valueAsDate,this.max)>0?this.setValidityFlag(`rangeOverflow`,Gn(this._dateAdapter.format(this.max,{weekdayStyle:`none`}))[this.language.current]):this.dateFilter&&!this.dateFilter(this.valueAsDate)?this.setValidityFlag(`sbbDateFilter`,Un[this.language.current]):this._removeValidityErrors():this.setValidityFlag(`badInput`,Un[this.language.current]):this._removeValidityErrors()}_removeValidityErrors(){[`badInput`,`rangeUnderflow`,`rangeOverflow`,`sbbDateFilter`].forEach(e=>this.removeValidityFlag(e))}},e=new WeakMap,t=new WeakMap,n=new WeakMap,u=r,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(d[Symbol.metadata]??null):void 0;p=[A({attribute:!1})],m=[Zt(),A({converter:Xt,reflect:!0})],_=[Zt(),A({converter:Xt,reflect:!0})],b=[A({attribute:!1})],x=[A({attribute:`weekday-style`})],i(r,null,p,{kind:`setter`,name:`valueAsDate`,static:!1,private:!1,access:{has:e=>`valueAsDate`in e,set:(e,t)=>{e.valueAsDate=t}},metadata:e},null,f),i(r,null,m,{kind:`accessor`,name:`min`,static:!1,private:!1,access:{has:e=>`min`in e,get:e=>e.min,set:(e,t)=>{e.min=t}},metadata:e},h,g),i(r,null,_,{kind:`accessor`,name:`max`,static:!1,private:!1,access:{has:e=>`max`in e,get:e=>e.max,set:(e,t)=>{e.max=t}},metadata:e},v,y),i(r,null,b,{kind:`setter`,name:`dateFilter`,static:!1,private:!1,access:{has:e=>`dateFilter`in e,set:(e,t)=>{e.dateFilter=t}},metadata:e},null,f),i(r,null,x,{kind:`accessor`,name:`weekdayStyle`,static:!1,private:!1,access:{has:e=>`weekdayStyle`in e,get:e=>e.weekdayStyle,set:(e,t)=>{e.weekdayStyle=t}},metadata:e},S,C),i(null,c={value:u},o,{kind:`class`,name:u.name,metadata:e},null,l),u=c.value,e&&Object.defineProperty(u,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),r.styles=bl,a(u,l),u})()})),Cl=e((()=>{Sl()})),wl,Tl,El,Dl,Ol,kl,Al,jl,Ml,Nl,Pl,Fl,Il=e((()=>{o(),I(),M(),uc(),gi(),q(),xt(),z(),B(),U(),xn(),H(),G(),ic(),zs(),wl=e=>{throw TypeError(e)},Tl=(e,t,n)=>t.has(e)||wl(`Cannot `+n),El=(e,t,n)=>(Tl(e,t,`read from private field`),n?n.call(e):t.get(e)),Dl=(e,t,n)=>t.has(e)?wl(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Ol=(e,t,n,r)=>(Tl(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),kl=h`*,:before,:after{box-sizing:border-box}:host{--sbb-popover-position: absolute;--sbb-popover-position-x: 0;--sbb-popover-position-y: 0;--sbb-popover-arrow-size: var(--sbb-spacing-fixed-4x);--sbb-popover-arrow-position-x: 0;--sbb-popover-max-width: calc(100% - var(--sbb-spacing-fixed-2x));--sbb-popover-inset: 0 auto auto 0;--sbb-popover-border-radius: var(--sbb-border-radius-8x);--sbb-popover-padding: var(--sbb-spacing-fixed-4x);--sbb-popover-background: var(--sbb-background-color-1);--sbb-popover-animation-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-4x) );--sbb-popover-animation-easing: ease-out;--sbb-popover-transform: translateY(var(--sbb-spacing-fixed-2x));--sbb-focus-outline-color: var(--sbb-focus-outline-color-default);--sbb-focus-outline-color: light-dark( var(--sbb-focus-outline-color-default), var(--sbb-focus-outline-color-dark) );outline:none!important;display:none}:host([data-state]:not([data-state=closed])){display:block;--sbb-popover-inset: 0}:host([data-position=above]){--sbb-popover-transform: translateY(calc(var(--sbb-spacing-fixed-2x) * -1))}.sbb-popover:after,.sbb-popover__content:before{content:"";position:absolute;display:block;width:var(--sbb-popover-arrow-size);height:var(--sbb-popover-arrow-size);left:var(--sbb-popover-arrow-position-x);bottom:calc(100% - var(--sbb-popover-arrow-size) / 2);background-color:var(--sbb-popover-background);border-radius:var(--sbb-border-radius-2x) 0;transform:rotate(45deg)}.sbb-popover__container{position:fixed;inset:var(--sbb-popover-inset);pointer-events:none;z-index:var(--sbb-popover-z-index, var(--sbb-overlay-default-z-index))}.sbb-popover{box-shadow:var(--sbb-shadow-elevation-level-5-shadow-2-offset-x) var(--sbb-shadow-elevation-level-5-shadow-2-offset-y) var(--sbb-shadow-elevation-level-5-shadow-2-blur) var(--sbb-shadow-elevation-level-5-shadow-2-spread) var(--sbb-shadow-color-hard-2),var(--sbb-shadow-elevation-level-5-shadow-1-offset-x) var(--sbb-shadow-elevation-level-5-shadow-1-offset-y) var(--sbb-shadow-elevation-level-5-shadow-1-blur) var(--sbb-shadow-elevation-level-5-shadow-1-spread) var(--sbb-shadow-color-hard-1);display:none;position:var(--sbb-popover-position);pointer-events:all;top:var(--sbb-popover-position-y);bottom:unset;left:var(--sbb-popover-position-x);right:unset;border:none;border-radius:var(--sbb-popover-border-radius);padding:0;max-width:var(--sbb-popover-max-width);width:max-content;background-color:var(--sbb-popover-background);outline:none}:host(:focus-visible) .sbb-popover{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}:host([data-state]:not([data-state=closed])) .sbb-popover{display:block;animation-name:open;animation-duration:var(--sbb-popover-animation-duration);animation-timing-function:var(--sbb-popover-animation-easing)}:host([data-state][data-state=closing]) .sbb-popover{pointer-events:none;animation-name:close;animation-duration:var(--sbb-popover-animation-duration);animation-timing-function:var(--sbb-popover-animation-easing)}.sbb-popover:after{z-index:-1;box-shadow:var(--sbb-shadow-elevation-level-5-shadow-2-offset-x) var(--sbb-shadow-elevation-level-5-shadow-2-offset-y) var(--sbb-shadow-elevation-level-5-shadow-2-blur) var(--sbb-shadow-elevation-level-5-shadow-2-spread) var(--sbb-shadow-color-hard-2),var(--sbb-shadow-elevation-level-5-shadow-1-offset-x) var(--sbb-shadow-elevation-level-5-shadow-1-offset-y) var(--sbb-shadow-elevation-level-5-shadow-1-blur) var(--sbb-shadow-elevation-level-5-shadow-1-spread) var(--sbb-shadow-color-hard-1)}@media(forced-colors:active){.sbb-popover:after{outline:var(--sbb-border-width-1x) solid CanvasText}}:host([data-position=above]) .sbb-popover:after{top:calc(100% - var(--sbb-popover-arrow-size) / 2)}@media(forced-colors:active){.sbb-popover{outline:var(--sbb-border-width-1x) solid CanvasText}}.sbb-popover:before{content:"";display:block;position:absolute;inset:0;z-index:-1;background-color:transparent}:host([data-position=below]) .sbb-popover:before{inset-block-start:calc(-1 * var(--sbb-spacing-fixed-6x))}:host([data-position=above]) .sbb-popover:before{inset-block-end:calc(-1 * var(--sbb-spacing-fixed-6x))}.sbb-popover__content{display:flex;gap:var(--sbb-spacing-fixed-4x);border-radius:var(--sbb-popover-border-radius);padding:var(--sbb-popover-padding);outline:none;background-color:var(--sbb-popover-background);overflow:hidden;flex-direction:row-reverse}:host([data-position=above]) .sbb-popover__content:before{top:calc(100% - var(--sbb-popover-arrow-size) / 2)}@keyframes open{0%{opacity:0;transform:var(--sbb-popover-transform)}to{opacity:1;transform:translateY(0)}}@keyframes close{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:var(--sbb-popover-transform)}}`,Al=16,jl=32,Ml=0,Nl=new Set,Pl=matchMedia(It).matches,Fl=(()=>{var e,t;let n=ki(ga),r,o=[],s=[];return t=class extends n{constructor(){super(...arguments),Dl(this,e),Ol(this,e,a(this,o,null)),this._nextFocusedElement=a(this,s),this._skipCloseFocus=!1,this._escapableOverlayController=new Dt(this),this._focusTrapController=new ui(this),this._blurTimeout=null,this._pointerDownListener=e=>{this._isPointerDownEventOnPopover=Ks(this.overlay,e)},this._closeOnBackdropClick=e=>{!this._isPointerDownEventOnPopover&&!Ks(this.overlay,e)&&(this._nextFocusedElement=e.composedPath().filter(e=>e instanceof window.HTMLElement).find(e=>e.matches(Yr)),clearTimeout(this.closeTimeout),this.close())}}get trigger(){return El(this,e)}set trigger(t){Ol(this,e,t)}open(){if(!(this.state!==`closed`&&this.state!==`closing`||!this.overlay||!this.dispatchBeforeOpenEvent())){for(let e of Nl){let t=e.getAttribute(`data-state`);t&&(t===`opened`||t===`opening`)&&e.close()}this.showPopover?.(),this.state=`opening`,this.inert=!0,this._setPopoverPosition(),this._triggerElement?.setAttribute(`aria-expanded`,`true`),this._nextFocusedElement=void 0,this._skipCloseFocus=!1,this._isZeroAnimationDuration()&&this._handleOpening()}}close(e){this.state!==`opened`&&this.state!==`opening`||(this._popoverCloseElement=e,this.dispatchBeforeCloseEvent({closeTarget:e??null})&&(this.state=`closing`,this.inert=!0,this._triggerElement?.setAttribute(`aria-expanded`,`false`),this._isZeroAnimationDuration()&&this._handleClosing()))}_isZeroAnimationDuration(){return $n(this,`--sbb-popover-animation-duration`)}_handleClosing(){this.state=`closed`,this.hidePopover?.(),this.overlay?.firstElementChild?.scrollTo(0,0),this.removeAttribute(`tabindex`),this._skipCloseFocus||(this._nextFocusedElement||this._triggerElement)?.focus(),this._escapableOverlayController.disconnect(),this.dispatchCloseEvent({closeTarget:this._popoverCloseElement??null}),this._openStateController?.abort(),this._focusTrapController.enabled=!1}_handleOpening(){this.state=`opened`,this.inert=!1,this._attachWindowEvents(),this._escapableOverlayController.connect(),this._setPopoverFocus(),this._focusTrapController.enabled=!0,this.dispatchOpenEvent()}connectedCallback(){this.popover=`manual`,super.connectedCallback(),this.id||=`sbb-popover-${++Ml}`,this.state=`closed`,Nl.add(this),this.hasUpdated&&this._configureTrigger()}requestUpdate(e,t,n){super.requestUpdate(e,t,n),(!e||e===`trigger`||e===`hoverTrigger`)&&this.hasUpdated&&this._configureTrigger()}firstUpdated(e){super.firstUpdated(e),this._configureTrigger()}disconnectedCallback(){super.disconnectedCallback(),this._triggerElement=null,this._triggerAbortController?.abort(),this._openStateController?.abort(),Nl.delete(this),this._blurTimeout&&clearTimeout(this._blurTimeout)}_configureTrigger(){if(this.hydrationRequired){this.hydrationComplete.then(()=>this._configureTrigger());return}this.configureTrigger(this._triggerElement??null)}configureTrigger(e){this._triggerAbortController?.abort(),ec(this._triggerElement),this._triggerElement=this.trigger,this._triggerElement&&($s(this._triggerElement,`dialog`,this.id,this.state),this._triggerAbortController=new AbortController,this.registerTriggerListeners(this._triggerAbortController.signal))}registerTriggerListeners(e){this._triggerElement.addEventListener(`click`,()=>this.open(),{signal:e})}_attachWindowEvents(){this._openStateController=new AbortController,document.addEventListener(`scroll`,()=>this._setPopoverPosition(),{passive:!0,signal:this._openStateController.signal,capture:!0}),window.addEventListener(`resize`,()=>this._setPopoverPosition(),{passive:!0,signal:this._openStateController.signal}),window.addEventListener(`pointerdown`,this._pointerDownListener,{signal:this._openStateController.signal}),window.addEventListener(`pointerup`,this._closeOnBackdropClick,{signal:this._openStateController.signal})}_closeOnSbbPopoverCloseClick(e){let t=hn(e,`sbb-popover-close`,this);t&&!t.hasAttribute(`disabled`)&&(clearTimeout(this.closeTimeout),this.close(t))}_onPopoverAnimationEnd(e){e.animationName===`open`&&this.state===`opening`?this._handleOpening():e.animationName===`close`&&this.state===`closing`&&this._handleClosing()}_setPopoverFocus(){this._focusTrapController.focusInitialElement()||(this.setAttribute(`tabindex`,`0`),this.focus(),this.addEventListener(`blur`,e=>{this._blurTimeout=setTimeout(()=>{if(document.visibilityState!==`hidden`){if(this.removeAttribute(`tabindex`),this.contains(e.relatedTarget))return;(this.state===`opened`||this.state===`opening`)&&(this._skipCloseFocus=!0),this.close()}})},{signal:this._openStateController.signal}))}_setPopoverPosition(){if(!this.overlay||!this._triggerElement)return;let e=qs(this.overlay,this._triggerElement,this.shadowRoot.querySelector(`.sbb-popover__container`),{verticalOffset:Al,horizontalOffset:jl,centered:!0,responsiveHeight:!0});this.setAttribute(`data-position`,e.alignment.vertical);let t=this._triggerElement.getBoundingClientRect().left-e.left+this._triggerElement.clientWidth/2-8;this.style.setProperty(`--sbb-popover-position-x`,`${e.left}px`),this.style.setProperty(`--sbb-popover-position-y`,`${e.top}px`),this.style.setProperty(`--sbb-popover-arrow-position-x`,`${t}px`)}dispatchBeforeCloseEvent(e){return this.dispatchEvent(new CustomEvent(`beforeclose`,{detail:e,cancelable:!0}))}dispatchCloseEvent(e){return this.dispatchEvent(new CustomEvent(`close`,{detail:e}))}render(){return N`
      <div class="sbb-popover__container">
        <div
          @animationend=${this._onPopoverAnimationEnd}
          class="sbb-popover"
          role="tooltip"
          ${cc(e=>this.overlay=e)}
        >
          <div
            @click=${e=>this._closeOnSbbPopoverCloseClick(e)}
            class="sbb-popover__content"
          >
            ${this.renderContent()}
          </div>
        </div>
      </div>
    `}},e=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;r=[ht(),A()],i(t,null,r,{kind:`accessor`,name:`trigger`,static:!1,private:!1,access:{has:e=>`trigger`in e,get:e=>e.trigger,set:(e,t)=>{e.trigger=t}},metadata:e},o,s),e&&Object.defineProperty(t,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t.styles=kl,t})(),(()=>{var e,t,n,r;let o=[s(`sbb-popover`)],c,l=[],u,d=Fl,f=[],p,m=[],h=[],g,_=[],v=[],y,b,x,S=[],C=[];return r=class extends d{constructor(){super(...arguments),Dl(this,e),Dl(this,t),Dl(this,n),Ol(this,e,(a(this,f),a(this,m,!1))),Ol(this,t,(a(this,h),a(this,_,!1))),this._openDelay=a(this,v),Ol(this,n,a(this,S,``)),this._hoverTrigger=(a(this,C),!1),this._language=new R(this),this._overlayAbortController=null,this._onTriggerMouseEnter=()=>{this.state===`closed`||this.state===`closing`?this._openTimeout=setTimeout(()=>{Kr.reset(),this.open()},this.openDelay):clearTimeout(this.closeTimeout)},this._onTriggerMouseLeave=()=>{this.state===`opened`||this.state===`opening`?this.closeTimeout=setTimeout(()=>this.close(),this.closeDelay):clearTimeout(this._openTimeout)},this._onOverlayMouseEnter=()=>{this.state!==`opening`&&clearTimeout(this.closeTimeout)},this._onOverlayMouseLeave=()=>{this.state!==`opening`&&(this.closeTimeout=setTimeout(()=>this.close(),this.closeDelay))}}get hideCloseButton(){return El(this,e)}set hideCloseButton(t){Ol(this,e,t)}get hoverTrigger(){return El(this,t)}set hoverTrigger(e){Ol(this,t,e)}set openDelay(e){this._openDelay=+e}get openDelay(){return this._openDelay??yt().popover?.openDelay??0}set closeDelay(e){this._closeDelay=+e}get closeDelay(){return this._closeDelay??yt().popover?.closeDelay??0}get accessibilityCloseLabel(){return El(this,n)}set accessibilityCloseLabel(e){Ol(this,n,e)}configureTrigger(e){let t=this.hoverTrigger&&!Pl;this.trigger===e&&t===this._hoverTrigger||(this._hoverTrigger!==t&&(this._hoverTrigger=t,this._registerOverlayListeners()),super.configureTrigger(e))}_registerOverlayListeners(){this._overlayAbortController?.abort(),this._hoverTrigger&&(this._overlayAbortController=new AbortController,this.overlay?.addEventListener(`mouseenter`,()=>this._onOverlayMouseEnter(),{signal:this._overlayAbortController.signal}),this.overlay?.addEventListener(`mouseleave`,()=>this._onOverlayMouseLeave(),{signal:this._overlayAbortController.signal}))}registerTriggerListeners(e){this._hoverTrigger&&this.trigger?(this.trigger.addEventListener(`mouseenter`,this._onTriggerMouseEnter,{signal:e}),this.trigger.addEventListener(`mouseleave`,this._onTriggerMouseLeave,{signal:e}),this.trigger.addEventListener(`keydown`,e=>{(e.code===`Space`||e.code===`Enter`)&&this.open()},{signal:e}),this.trigger.addEventListener(`mousedown`,e=>{zr(e)&&this.open()},{signal:e})):super.registerTriggerListeners(e)}firstUpdated(e){super.firstUpdated(e),this._registerOverlayListeners()}renderContent(){let e=N`
      <span class="sbb-popover__close">
        <sbb-secondary-button
          aria-label=${this.accessibilityCloseLabel||wn[this._language.current]}
          size="s"
          type="button"
          icon-name="cross-small"
          sbb-popover-close
        ></sbb-secondary-button>
      </span>
    `;return N`
      ${!this.hideCloseButton&&!this._hoverTrigger?e:P}
      <span>
        <slot>No content</slot>
      </span>
    `}},e=new WeakMap,t=new WeakMap,n=new WeakMap,u=r,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(d[Symbol.metadata]??null):void 0;p=[L(),A({attribute:`hide-close-button`,type:Boolean})],g=[L(),A({attribute:`hover-trigger`,type:Boolean})],y=[A({attribute:`open-delay`,type:Number})],b=[A({attribute:`close-delay`,type:Number})],x=[L(),A({attribute:`accessibility-close-label`})],i(r,null,p,{kind:`accessor`,name:`hideCloseButton`,static:!1,private:!1,access:{has:e=>`hideCloseButton`in e,get:e=>e.hideCloseButton,set:(e,t)=>{e.hideCloseButton=t}},metadata:e},m,h),i(r,null,g,{kind:`accessor`,name:`hoverTrigger`,static:!1,private:!1,access:{has:e=>`hoverTrigger`in e,get:e=>e.hoverTrigger,set:(e,t)=>{e.hoverTrigger=t}},metadata:e},_,v),i(r,null,y,{kind:`setter`,name:`openDelay`,static:!1,private:!1,access:{has:e=>`openDelay`in e,set:(e,t)=>{e.openDelay=t}},metadata:e},null,f),i(r,null,b,{kind:`setter`,name:`closeDelay`,static:!1,private:!1,access:{has:e=>`closeDelay`in e,set:(e,t)=>{e.closeDelay=t}},metadata:e},null,f),i(r,null,x,{kind:`accessor`,name:`accessibilityCloseLabel`,static:!1,private:!1,access:{has:e=>`accessibilityCloseLabel`in e,get:e=>e.accessibilityCloseLabel,set:(e,t)=>{e.accessibilityCloseLabel=t}},metadata:e},S,C),i(null,c={value:u},o,{kind:`class`,name:u.name,metadata:e},null,l),u=c.value,e&&Object.defineProperty(u,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e}),a(u,l)})(),u})()})),Ll,Rl=e((()=>{o(),I(),M(),q(),U(),G(),Mo(),Ll=h`*,:before,:after{box-sizing:border-box}:host{display:inline-block;outline:none!important;--sbb-popover-color: inherit}@media(forced-colors:active){:host{--sbb-popover-color: ButtonText !important}}@media(any-hover:hover){:host(:hover){--sbb-popover-color: var(--sbb-color-4)}:host(:hover[negative]){--sbb-popover-color: var(--sbb-color-4-negative)}}:host([negative]){--sbb-focus-outline-color: var(--sbb-focus-outline-color-dark)}:host(:is(:active,[data-active])){--sbb-popover-color: var(--sbb-color-anthracite);--sbb-popover-color: light-dark(var(--sbb-color-anthracite), var(--sbb-color-cement))}:host(:is(:active,[data-active])[negative]){--sbb-popover-color: var(--sbb-color-cement)}:host(:is(:disabled,[disabled-interactive])){pointer-events:none;--sbb-popover-color: var(--sbb-color-graphite);--sbb-popover-color: light-dark(var(--sbb-color-graphite), var(--sbb-color-smoke))}@media(forced-colors:active){:host(:is(:disabled,[disabled-interactive])){--sbb-popover-color: GrayText !important}}:host(:is(:disabled,[disabled-interactive])[negative]){--sbb-popover-color: var(--sbb-color-5)}:host([data-icon-small]){display:inline-block;-webkit-tap-highlight-color:transparent;height:fit-content;outline:none!important;--sbb-button-color-text: var(--sbb-color-3);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3);--sbb-button-color-active-background: var(--sbb-background-color-4);--sbb-button-color-disabled-background: var(--sbb-background-color-3);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-color-disabled-text: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-button-border-disabled-width: var(--sbb-border-width-1x);--sbb-button-border-disabled-style: dashed;--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing)}@media(forced-colors:active){:host([data-icon-small]){--sbb-button-color-text: ButtonText !important;--sbb-button-color-hover-background: Highlight !important;--sbb-button-color-active-background: Highlight !important;--sbb-button-color-disabled-background: Canvas !important;--sbb-button-color-disabled-border: GrayText !important;--sbb-button-color-disabled-text: GrayText !important}}:host([data-icon-small]) .sbb-popover-trigger{position:relative;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;border-radius:var(--sbb-button-border-radius);color:var(--sbb-button-color-text);cursor:pointer;-webkit-user-select:none;user-select:none;display:flex}:host([data-icon-small]) .sbb-popover-trigger:before{position:absolute;content:"";inset:0;border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color}sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem));display:flex}:host([data-icon-small][negative]){--sbb-button-color-text: var(--sbb-color-3-negative);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3-negative);--sbb-button-color-active-background: var(--sbb-background-color-4-negative);--sbb-button-color-disabled-background: var(--sbb-background-color-3-negative);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-5)}:host([data-icon-small]:is(:disabled,[disabled-interactive])) .sbb-popover-trigger{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none}:host([data-icon-small]:is(:disabled,[disabled-interactive])) .sbb-popover-trigger:before{background-color:var(--sbb-button-color-disabled-background);border:var(--sbb-button-border-disabled-width) var(--sbb-button-border-disabled-style) var(--sbb-button-color-disabled-border)}:host([data-icon-small]:focus-visible) .sbb-popover-trigger:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}@media(any-hover:hover){:host([data-icon-small]:not(:disabled,[disabled-interactive],active):hover){--sbb-button-translate-y-content-hover: -.0625rem}}@media(any-hover:hover){:host([data-icon-small]:not(:disabled,[disabled-interactive],active):hover) .sbb-popover-trigger:before{background-color:var(--sbb-button-color-hover-background)}}:host([data-icon-small]:is(active)) .sbb-popover-trigger:before{background-color:var(--sbb-button-color-active-background)}:host(:not([data-icon-small])) .sbb-popover-trigger{font-family:inherit;font-weight:inherit;line-height:inherit;letter-spacing:inherit;font-size:inherit;text-align:inherit;display:flex;cursor:pointer;color:var(--sbb-popover-color)}:host(:focus-visible:not([data-icon-small])) .sbb-popover-trigger{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width);border-radius:var(--sbb-border-radius-4x)}sbb-icon{min-width:var(--sbb-size-icon-ui-small);min-height:var(--sbb-size-icon-ui-small)}`,(()=>{var e;let t=[s(`sbb-popover-trigger`)],n,r=[],o,c=cn(W(Ao(sa)));return e=class extends c{connectedCallback(){super.connectedCallback();let e=ir(`sbb-form-field`,this)??ir(`[data-form-field]`,this);e&&(this.toggleAttribute(`data-icon-small`,!0),this.negative=e.hasAttribute(`negative`))}renderTemplate(){return N`
      <slot>
        <sbb-icon name=${this.iconName||`circle-information-small`}></sbb-icon>
      </slot>
    `}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=Ll,a(o,r),o})()})),zl=e((()=>{Il(),Rl()})),Bl,Vl=e((()=>{nt(),Oa(),Bl=Ea(class extends Da{constructor(e){if(super(e),e.type!==Ta.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter((t=>e[t])).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter((e=>e!==``))));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return Ve}})})),Hl=e((()=>{Vl()}));function Ul(e,t){return typeof e==`function`?e(t):e&&typeof e==`object`&&su in e?e[su](t):e instanceof Date?new e.constructor(t):new Date(t)}function Wl(e,t){return Ul(t||e,e)}function Gl(e,t,n){let r=Wl(e,n?.in);return isNaN(t)?Ul(e,NaN):(t&&r.setDate(r.getDate()+t),r)}function Kl(){return cu}function ql(e,t){let n=Kl(),r=t?.weekStartsOn??t?.locale?.options?.weekStartsOn??n.weekStartsOn??n.locale?.options?.weekStartsOn??0,i=Wl(e,t?.in),a=i.getDay(),o=(a<r?7:0)+a-r;return i.setDate(i.getDate()-o),i.setHours(0,0,0,0),i}function Jl(e,...t){let n=Ul.bind(null,e||t.find(e=>typeof e==`object`));return t.map(n)}function Yl(e,t,n){return Gl(e,t*7,n)}function Xl(e,t){let n=Wl(e,t?.in),r=n.getMonth();return n.setFullYear(n.getFullYear(),r+1,0),n.setHours(23,59,59,999),n}function Zl(e,t){let[n,r]=Jl(e,t.start,t.end);return{start:n,end:r}}function Ql(e,t){let{start:n,end:r}=Zl(t?.in,e),i=+n>+r,a=ql(i?r:n,t),o=ql(i?n:r,t);a.setHours(15),o.setHours(15);let s=+o.getTime(),c=a,l=t?.step??1;if(!l)return[];l<0&&(l=-l,i=!i);let u=[];for(;+c<=s;)c.setHours(0),u.push(Ul(n,c)),c=Yl(c,l),c.setHours(15);return i?u.reverse():u}function $l(e,t){let n=Wl(e,t?.in);return n.setDate(1),n.setHours(0,0,0,0),n}function eu(e,t){let n=Wl(e,t?.in),r=n.getFullYear(),i=Kl(),a=t?.firstWeekContainsDate??t?.locale?.options?.firstWeekContainsDate??i.firstWeekContainsDate??i.locale?.options?.firstWeekContainsDate??1,o=Ul(t?.in||e,0);o.setFullYear(r+1,0,a),o.setHours(0,0,0,0);let s=ql(o,t),c=Ul(t?.in||e,0);c.setFullYear(r,0,a),c.setHours(0,0,0,0);let l=ql(c,t);return+n>=+s?r+1:+n>=+l?r:r-1}function tu(e,t){let n=Kl(),r=t?.firstWeekContainsDate??t?.locale?.options?.firstWeekContainsDate??n.firstWeekContainsDate??n.locale?.options?.firstWeekContainsDate??1,i=eu(e,t),a=Ul(t?.in||e,0);return a.setFullYear(i,0,r),a.setHours(0,0,0,0),ql(a,t)}function nu(e,t){let n=Wl(e,t?.in),r=ql(n,t)-+tu(n,t);return Math.round(r/ou)+1}var ru,iu,au,Q,$,ou,su,cu,lu,uu=e((()=>{o(),I(),M(),Hl(),gi(),xt(),z(),Yt(),B(),H(),G(),zs(),Mo(),Ni(),ru=e=>{throw TypeError(e)},iu=(e,t,n)=>t.has(e)||ru(`Cannot `+n),au=(e,t,n)=>(iu(e,t,`read from private field`),n?n.call(e):t.get(e)),Q=(e,t,n)=>t.has(e)?ru(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),$=(e,t,n,r)=>(iu(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),ou=6048e5,su=Symbol.for(`constructDateFrom`),cu={},lu=h`*,:before,:after{box-sizing:border-box}:host{display:block;width:max-content;--sbb-calendar-cell-size: 2.5rem;--sbb-calendar-hover-shift: .0625rem;--sbb-calendar-wide-cell-size: 4.375rem;--sbb-calendar-header-color: var(--sbb-color-granite);--sbb-calendar-header-color: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-calendar-cell-background-color: transparent;--sbb-calendar-cell-padding: .125rem;--sbb-calendar-cell-color: var(--sbb-color-2);--sbb-calendar-cell-selected-color: var(--sbb-color-1-inverted);--sbb-calendar-cell-selected-background-color: var(--sbb-background-color-2-inverted);--sbb-calendar-cell-disabled-height: .09375rem;--sbb-calendar-cell-disabled-width: 1.59375rem;--sbb-calendar-cell-disabled-color: var(--sbb-color-granite);--sbb-calendar-cell-disabled-color: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-calendar-cell-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-calendar-cell-transition-easing-function: var(--sbb-animation-easing);--sbb-calendar-tables-gap: var(--sbb-spacing-fixed-10x);--sbb-calendar-table-animation-shift: .00625rem;--sbb-calendar-table-animation-duration: .1ms;--sbb-calendar-table-column-spaces: 12;--sbb-calendar-control-view-change-height: 2.75rem;--sbb-calendar-control-view-change-color: var(--sbb-color-3);--sbb-calendar-control-view-change-background: var(--sbb-background-color-1)}@media(min-width:22.5rem){:host{--sbb-calendar-cell-size: 2.75rem;--sbb-calendar-wide-cell-size: 4.8125rem;--sbb-calendar-control-view-change-height: 3rem}}.sbb-calendar__wrapper{width:100%;display:block;transition-duration:var(--sbb-calendar-cell-transition-duration)}.sbb-calendar__controls{width:100%;display:inline-flex;align-items:center;gap:var(--sbb-spacing-fixed-2x);margin-block-end:var(--sbb-spacing-fixed-4x)}.sbb-calendar__controls-month{width:100%;display:flex;gap:var(--sbb-calendar-tables-gap)}#sbb-calendar__controls-previous,#sbb-calendar__controls-next{-webkit-tap-highlight-color:transparent}.sbb-calendar__controls-change-date{-webkit-appearance:none;-moz-appearance:none;box-sizing:border-box;outline:none;border:none;border-radius:0;padding:0;background:none;-webkit-tap-highlight-color:transparent;color:inherit;--sbb-text-font-size: var(--sbb-font-size-text-s);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);display:flex;align-items:center;margin:auto;height:var(--sbb-calendar-control-view-change-height);text-transform:capitalize;cursor:pointer;padding-inline:var(--sbb-spacing-fixed-5x) var(--sbb-spacing-fixed-2x);border-radius:var(--sbb-border-radius-infinity);background-color:var(--sbb-calendar-control-view-change-background);color:var(--sbb-calendar-control-view-change-color);transition-duration:var(--sbb-calendar-cell-transition-duration);transition-timing-function:var(--sbb-calendar-cell-transition-easing-function);transition-property:background-color,padding-block-end}.sbb-calendar__controls-change-date:disabled{--sbb-calendar-control-view-change-background: var(--sbb-color-milk);--sbb-calendar-control-view-change-background: light-dark( var(--sbb-color-milk), var(--sbb-color-anthracite) );--sbb-calendar-control-view-change-color: var(--sbb-color-granite);--sbb-calendar-control-view-change-color: light-dark( var(--sbb-color-granite), var(--sbb-color-aluminium) );cursor:unset}.sbb-calendar__controls-change-date:focus-visible{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width);outline-offset:var(--sbb-spacing-fixed-1x)}@media(any-hover:hover){.sbb-calendar__controls-change-date:not(:active,:disabled):hover{padding-block-end:var(--sbb-calendar-hover-shift)}}.sbb-calendar__controls-change-date:not(:disabled):active{--sbb-calendar-control-view-change-background: var(--sbb-background-color-3)}.sbb-calendar__table-month-view,.sbb-calendar__table-year-view{--sbb-calendar-table-column-spaces: 6}.sbb-calendar__table-container{display:flex;gap:var(--sbb-calendar-tables-gap);margin-inline:var(--sbb-calendar-margin);--sbb-calendar-min-width: calc(7 * var(--sbb-calendar-cell-size));--sbb-calendar-overflow: calc(100% - var(--sbb-calendar-min-width));--sbb-calendar-start-offset: min( 0px, -1 * (var(--sbb-calendar-overflow) / var(--sbb-calendar-table-column-spaces)) );--sbb-calendar-margin: var(--sbb-calendar-start-offset)}:host([data-wide]) .sbb-calendar__table-container{--sbb-calendar-min-width: calc( 2 * 7 * var(--sbb-calendar-cell-size) + var(--sbb-calendar-tables-gap) );--sbb-calendar-margin: calc(.5 * var(--sbb-calendar-start-offset))}:host([orientation=horizontal][week-numbers]) .sbb-calendar__table-container{--sbb-calendar-min-width: calc(8 * var(--sbb-calendar-cell-size))}:host([orientation=horizontal][week-numbers][data-wide]) .sbb-calendar__table-container{--sbb-calendar-min-width: calc( 2 * 8 * var(--sbb-calendar-cell-size) + var(--sbb-calendar-tables-gap) )}:host([orientation=vertical]) .sbb-calendar__table-container{min-width:var(--sbb-calendar-min-width);--sbb-calendar-start-offset: 0}:host([orientation=vertical][data-wide]) .sbb-calendar__table-container{--sbb-calendar-min-width: calc( 13 * var(--sbb-calendar-cell-size) + var(--sbb-calendar-tables-gap) )}.sbb-calendar__table{width:100%;border-collapse:collapse;height:max-content;animation-name:show;animation-duration:var(--sbb-calendar-table-animation-duration)}.sbb-calendar__table.sbb-calendar__table-hide{--sbb-calendar-cell-transition-duration: 0ms;animation-name:hide;animation-duration:var(--sbb-calendar-table-animation-duration)}:host(:not([data-wide])) .sbb-calendar__table{min-width:100%}.sbb-calendar__table-header,.sbb-calendar__table-body{text-align:center}.sbb-calendar__table-header-cell{--sbb-text-font-size: var(--sbb-font-size-text-xs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);width:var(--sbb-calendar-cell-size);color:var(--sbb-calendar-header-color);padding:0}:host(:not([multiple])) .sbb-calendar__table-header-cell{height:var(--sbb-calendar-cell-size)}.sbb-calendar__table-data{position:relative;padding:0;text-align:center}.sbb-calendar__header-cell,.sbb-calendar__cell{-webkit-appearance:none;-moz-appearance:none;box-sizing:border-box;margin:0;outline:none;border:none;border-radius:0;padding:0;background:none;-webkit-tap-highlight-color:transparent;color:inherit;--sbb-text-font-size: var(--sbb-font-size-text-s);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);height:var(--sbb-calendar-cell-size);color:var(--sbb-calendar-cell-color);cursor:pointer;position:relative;z-index:0}.sbb-calendar__header-cell:before,.sbb-calendar__cell:before{content:"";position:absolute;inset:var(--sbb-calendar-cell-padding);background-color:var(--sbb-calendar-cell-background-color);border-radius:50%;z-index:-1;transition-duration:var(--sbb-calendar-cell-transition-duration);transition-timing-function:var(--sbb-calendar-cell-transition-easing-function);transition-property:background-color}@media(any-hover:hover){.sbb-calendar__header-cell:not(.sbb-calendar__selected,:active,:disabled):hover,.sbb-calendar__cell:not(.sbb-calendar__selected,:active,:disabled):hover{--sbb-calendar-cell-background-color: var(--sbb-background-color-3);padding-block-end:var(--sbb-calendar-hover-shift)}}@media(any-hover:hover)and (forced-colors:active){.sbb-calendar__header-cell:not(.sbb-calendar__selected,:active,:disabled):hover:before,.sbb-calendar__cell:not(.sbb-calendar__selected,:active,:disabled):hover:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width);--sbb-focus-outline-style: initial}}.sbb-calendar__header-cell:disabled,.sbb-calendar__cell:disabled{--sbb-calendar-cell-color: var(--sbb-calendar-cell-disabled-color);cursor:unset}.sbb-calendar__header-cell:focus-visible:before,.sbb-calendar__cell:focus-visible:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}.sbb-calendar__header-cell:not(.sbb-calendar__selected,:disabled):active,.sbb-calendar__cell:not(.sbb-calendar__selected,:disabled):active{--sbb-calendar-cell-background-color: var(--sbb-background-color-4)}@media(forced-colors:active){.sbb-calendar__header-cell:not(.sbb-calendar__selected,:disabled):active:before,.sbb-calendar__cell:not(.sbb-calendar__selected,:disabled):active:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width);--sbb-focus-outline-style: initial}}.sbb-calendar__header-cell{--sbb-text-font-size: var(--sbb-font-size-text-xs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);color:var(--sbb-calendar-header-color)}.sbb-calendar__weekday,.sbb-calendar__day{border-radius:50%;width:var(--sbb-calendar-cell-size)}.sbb-calendar__weekday:before,.sbb-calendar__day:before{border-radius:50%}.sbb-calendar__pill{width:var(--sbb-calendar-wide-cell-size);border-radius:var(--sbb-border-radius-infinity)}.sbb-calendar__pill:before{border-radius:var(--sbb-border-radius-infinity)}.sbb-calendar__crossed-out:after{content:"";height:var(--sbb-calendar-cell-disabled-height);width:var(--sbb-calendar-cell-disabled-width);position:absolute;background-color:var(--sbb-calendar-cell-disabled-color);top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg)}.sbb-calendar__cell-current{--sbb-text-font-size: var(--sbb-font-size-text-s);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);font-weight:700}.sbb-calendar__selected{--sbb-calendar-cell-color: var(--sbb-calendar-cell-selected-color);--sbb-calendar-cell-background-color: var(--sbb-calendar-cell-selected-background-color)}@media(forced-colors:active){.sbb-calendar__selected{--sbb-calendar-cell-background-color: ButtonText !important}}@keyframes show{0%{opacity:0;transform:translateY(var(--sbb-calendar-table-animation-shift))}to{opacity:1;transform:translateY(0)}}@keyframes hide{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(var(--sbb-calendar-table-animation-shift))}}`,(()=>{var e,t,n,r,o,c,l,u,d,f,p,m,h;let g=[s(`sbb-calendar`)],_,v=[],y,b=ki(F),x=[],S,C=[],ee=[],w,T=[],te=[],ne,E=[],D=[],O,re=[],k=[],ie,ae=[],oe=[],se,ce,le=[],ue=[],de,fe=[],pe=[],me,he=[],M=[],ge,_e=[],ve=[],ye,be=[],xe=[],Se,Ce,we=[],Te=[],Ee,De=[],Oe=[];return h=class extends b{constructor(){super(),Q(this,e),Q(this,t),Q(this,n),Q(this,r),Q(this,o),Q(this,c),Q(this,l),Q(this,u),Q(this,d),Q(this,f),Q(this,p),Q(this,m),$(this,e,(a(this,x),a(this,C,!1))),$(this,t,(a(this,ee),a(this,T,`day`))),$(this,n,(a(this,te),a(this,E,null))),$(this,r,(a(this,D),a(this,re,null))),$(this,o,(a(this,k),a(this,ae,!1))),$(this,c,(a(this,oe),a(this,le,null))),$(this,l,(a(this,ue),a(this,fe,null))),$(this,u,(a(this,pe),a(this,he,`horizontal`))),$(this,d,(a(this,M),a(this,_e,!1))),this._dateAdapter=(a(this,ve),yt().datetime?.dateAdapter??qt),$(this,f,a(this,be,this._dateAdapter.today())),$(this,p,(a(this,xe),a(this,we,`day`))),this._nextCalendarView=(a(this,Te),`day`),this._keyboardNavigationDayViewParameters={firstDayInView:null,lastDayInView:null,firstMonthOffset:0,firstMonthLength:0,secondMonthOffset:0},this._weeks=[],this._monthNames=this._dateAdapter.getMonthNames(`long`),this._resetFocus=!1,$(this,m,a(this,De,!1)),this._language=(a(this,Oe),new R(this).withHandler(()=>{this._monthNames=this._dateAdapter.getMonthNames(`long`),this._createMonthRows()})),this._mediaMatcher=new zt(this,{[Lt]:()=>this._init()}),this._createMonthRows(),this._setWeekdays()}get wide(){return au(this,e)}set wide(t){$(this,e,t)}get view(){return au(this,t)}set view(e){$(this,t,e)}get min(){return au(this,n)}set min(e){$(this,n,e)}get max(){return au(this,r)}set max(e){$(this,r,e)}get multiple(){return au(this,o)}set multiple(e){$(this,o,e)}set selected(e){if(Array.isArray(e))this._selected=e.map(e=>this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(e))).filter(e=>e!==null).filter(e=>!this._isDayInRange(this._dateAdapter.toIso8601(e))||this._dateFilter(e));else{let t=this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(e));t&&(!this._isDayInRange(this._dateAdapter.toIso8601(t))||this._dateFilter(t))?this._selected=t:this._selected=null}}get selected(){return this._selected}get _selected(){return au(this,c)}set _selected(e){$(this,c,e)}get dateFilter(){return au(this,l)}set dateFilter(e){$(this,l,e)}get orientation(){return au(this,u)}set orientation(e){$(this,u,e)}get weekNumbers(){return au(this,d)}set weekNumbers(e){$(this,d,e)}get _activeDate(){return au(this,f)}set _activeDate(e){$(this,f,e)}set _wide(e){this.toggleAttribute(`data-wide`,e)}get _wide(){return this.hasAttribute(`data-wide`)}get _calendarView(){return au(this,p)}set _calendarView(e){$(this,p,e)}get _cells(){return Array.from(this.shadowRoot.querySelectorAll(`.sbb-calendar__cell`)??[])}get _initialized(){return au(this,m)}set _initialized(e){$(this,m,e)}_dateFilter(e){return this.dateFilter?.(e)??!0}resetPosition(){this._resetCalendarView(),this._init()}connectedCallback(){super.connectedCallback(),this.resetPosition()}focus(){this._resetFocus=!0,this._focusCell()}willUpdate(e){super.willUpdate(e),this._initialized&&((e.has(`wide`)||e.has(`orientation`))&&this.resetPosition(),e.has(`view`)&&(this._setChosenYear(),this._chosenMonth=void 0,this._nextCalendarView=this._calendarView=this.view))}updated(e){super.updated(e),this._setTabIndex(),Kr.mostRecentModality===`keyboard`&&this._focusCell()}_onMultipleChanged(e){e&&!Array.isArray(this._selected)&&(this._selected=this._selected?[this._selected]:[]),!e&&Array.isArray(this._selected)&&(this._selected=this._selected.length?this._selected[0]:null)}_init(e){if(this.hydrationRequired){this.hydrationComplete.then(()=>this._init());return}if(e&&this._assignActiveDate(e),this._wide=(this._mediaMatcher.matches(Lt)??!1)&&this.wide,this._weeks=this._createWeekRows(this._activeDate),this._years=this._createYearRows(),this._weekNumbers=this._createWeekNumbers(this._activeDate),this._nextMonthWeeks=[[]],this._nextMonthYears=[[]],this._wide){let e=this._dateAdapter.addCalendarMonths(this._activeDate,1);this._nextMonthWeeks=this._createWeekRows(e,!0),this._nextMonthYears=this._createYearRows(24),this._nextMonthWeekNumbers=this._createWeekNumbers(e)}this._initialized=!0}_focusCell(){this._resetFocus&&=(this._getFirstFocusable()?.focus(),!1)}_setWeekdays(){let e=this._dateAdapter.getDayOfWeekNames(`narrow`),t=this._dateAdapter.getDayOfWeekNames(`long`).map((t,n)=>({long:t,narrow:e[n]})),n=this._dateAdapter.getFirstDayOfWeek();this._weekdays=t.slice(n).concat(t.slice(0,n))}_createWeekNumbers(e){return Ql({start:$l(e),end:Xl(e)},{weekStartsOn:1}).map(e=>nu(e,{weekStartsOn:1,firstWeekContainsDate:4}))}_createWeekRows(e,t=!1){let n=this._dateAdapter.getDateNames(),r=this._dateAdapter.getNumDaysInMonth(e),i=this._dateAdapter.getFirstWeekOffset(e);return t?(this._keyboardNavigationDayViewParameters.secondMonthOffset=i,this._keyboardNavigationDayViewParameters.lastDayInView=this._dateAdapter.toIso8601(this._dateAdapter.createDate(this._dateAdapter.getYear(e),this._dateAdapter.getMonth(e),r))):(this._keyboardNavigationDayViewParameters.firstMonthLength=r,this._keyboardNavigationDayViewParameters.firstMonthOffset=i,this._keyboardNavigationDayViewParameters.firstDayInView=this._dateAdapter.toIso8601(this._dateAdapter.createDate(this._dateAdapter.getYear(e),this._dateAdapter.getMonth(e),1)),this._keyboardNavigationDayViewParameters.lastDayInView=this._dateAdapter.toIso8601(this._dateAdapter.createDate(this._dateAdapter.getYear(e),this._dateAdapter.getMonth(e),r))),this.orientation===`horizontal`?this._createWeekRowsHorizontal(e,n,r,i):this._createWeekRowsVertical(e,n,r,i)}_createWeekRowsHorizontal(e,t,n,r){let i=[[]];for(let a=0,o=r;a<n;a++,o++){o===7&&(i.push([]),o=0);let n=this._dateAdapter.createDate(this._dateAdapter.getYear(e),this._dateAdapter.getMonth(e),a+1),r=this._dateAdapter.toIso8601(n);i[i.length-1].push({value:r,dateValue:n,dayValue:t[a],monthValue:String(this._dateAdapter.getMonth(n)),yearValue:String(this._dateAdapter.getYear(n)),weekValue:nu(r,{weekStartsOn:1,firstWeekContainsDate:4}),weekDayValue:this._dateAdapter.getDayOfWeek(n)})}return i}_createWeekRowsVertical(e,t,n,r){let i=Array.from({length:7},()=>[]);for(let a=0,o=r;a<n;a++,o++){o===7&&(o=0);let n=this._dateAdapter.createDate(this._dateAdapter.getYear(e),this._dateAdapter.getMonth(e),a+1),r=this._dateAdapter.toIso8601(n);i[o].push({value:r,dateValue:n,dayValue:t[a],monthValue:String(this._dateAdapter.getMonth(n)),yearValue:String(this._dateAdapter.getYear(n)),weekValue:nu(r,{weekStartsOn:1,firstWeekContainsDate:4}),weekDayValue:this._dateAdapter.getDayOfWeek(n)})}return i}_createMonthRows(){let e=this._dateAdapter.getMonthNames(`short`),t=Array(12).fill(null).map((t,n)=>({value:e[n],longValue:this._monthNames[n],monthValue:n+1})),n=[];for(let e=0;e<3;e++)n.push(t.slice(4*e,4*(e+1)));this._months=n}_createYearRows(e=0){let t=this._getStartValueYearView(),n=Array(24).fill(0).map((n,r)=>t+e+r),r=[];for(let e=0;e<6;e++)r.push(n.slice(4*e,4*(e+1)));return r}_getStartValueYearView(){let e=0;this.max?e=this._dateAdapter.getYear(this.max)-24+1:this.min&&(e=this._dateAdapter.getYear(this.min));let t=this._dateAdapter.getYear(this._activeDate);return t-((t-e)%24+24)%24}_isDayInRange(e){if(!this.min&&!this.max)return!0;let t=this._dateAdapter.isValid(this.min)&&this._dateAdapter.compareDate(this.min,this._dateAdapter.deserialize(e))>0,n=this._dateAdapter.isValid(this.max)&&this._dateAdapter.compareDate(this.max,this._dateAdapter.deserialize(e))<0;return!(t||n)}_isMonthInRange(e,t){if(!this.min&&!this.max)return!0;let n=this._dateAdapter.isValid(this.min)&&(t<this._dateAdapter.getYear(this.min)||t===this._dateAdapter.getYear(this.min)&&e<this._dateAdapter.getMonth(this.min)),r=this._dateAdapter.isValid(this.max)&&(t>this._dateAdapter.getYear(this.max)||t===this._dateAdapter.getYear(this.max)&&e>this._dateAdapter.getMonth(this.max));return!(n||r)}_isYearInRange(e){if(!this.min&&!this.max)return!0;let t=this._dateAdapter.isValid(this.min)&&this._dateAdapter.getYear(this.min)>e,n=this._dateAdapter.isValid(this.max)&&this._dateAdapter.getYear(this.max)<e;return!(t||n)}_isMonthFilteredOut(e,t){if(!this.dateFilter)return!0;let n=this._dateAdapter.createDate(t,e,1);for(let t=n;this._dateAdapter.getMonth(t)==e;t=this._dateAdapter.addCalendarDays(t,1))if(this.dateFilter(t))return!0;return!1}_isYearFilteredOut(e){if(!this.dateFilter)return!0;let t=this._dateAdapter.createDate(e,1,1);for(let n=t;this._dateAdapter.getYear(n)==e;n=this._dateAdapter.addCalendarDays(n,1))if(this.dateFilter(n))return!0;return!1}_selectDate(e){if(this._chosenMonth=void 0,this._setChosenYear(),this.multiple){if(this._selected&&this._selected.length>0){let t=this._selected.findIndex(t=>this._dateAdapter.compareDate(t,e)===0);t===-1?this._selected=[...this._selected,e]:this._selected=this._selected.filter((e,n)=>n!==t)}else this._selected=[e];this._emitDateSelectedEvent(this._selected.map(e=>this._dateAdapter.deserialize(e)))}else (!this._selected||this._dateAdapter.compareDate(this._selected,e)!==0)&&(this._selected=e,this._emitDateSelectedEvent(this._dateAdapter.deserialize(e)))}_selectMultipleDates(e){let t=this._cells.filter(e=>!e.disabled).map(e=>e.value),n=e.map(e=>e.value).filter(e=>t.includes(e)),r=new Set(n),i=new Set(this._selected.map(e=>this._dateAdapter.toIso8601(e)));this._selected=this._updateSelectedWithMultipleDates(n,r,i).map(e=>this._dateAdapter.deserialize(e)),this._emitDateSelectedEvent(this._selected.map(e=>this._dateAdapter.deserialize(e)))}_emitDateSelectedEvent(e){this.dispatchEvent(new CustomEvent(`dateselected`,{detail:e,composed:!0,bubbles:!0}))}_updateSelectedWithMultipleDates(e,t,n){return e.every(e=>n.has(e))?t.forEach(e=>n.delete(e)):t.forEach(e=>n.add(e)),Array.from(n)}_setChosenYear(){if(this.view===`month`){let e;e=this.multiple?this.selected.at(-1):this.selected,this._chosenYear=this._dateAdapter.getYear(e??this._dateAdapter.today())}else this._chosenYear=void 0}_assignActiveDate(e){if(this.min&&this._dateAdapter.compareDate(this.min,e)>0){this._activeDate=this.min;return}if(this.max&&this._dateAdapter.compareDate(this.max,e)<0){this._activeDate=this.max;return}this._activeDate=e}_goToDifferentMonth(e){this._init(this._dateAdapter.addCalendarMonths(this._activeDate,e))}_goToDifferentYear(e){this._chosenYear+=e,this._activeDate=this._dateAdapter.createDate(this._chosenYear,this._dateAdapter.getMonth(this._activeDate),this._dateAdapter.getDate(this._activeDate)),this._init()}_goToDifferentYearRange(e){this._init(this._dateAdapter.addCalendarYears(this._activeDate,e))}_prevDisabled(e){return this.min?this._dateAdapter.compareDate(e,this.min)<0:!1}_nextDisabled(e){return this.max?this._dateAdapter.compareDate(e,this.max)>0:!1}_previousMonthDisabled(){let e=this._dateAdapter.addCalendarDays(this._activeDate,this._dateAdapter.getDate(this._activeDate)*-1);return this._prevDisabled(e)}_nextMonthDisabled(){let e=this._dateAdapter.addCalendarMonths(this._activeDate,this._wide?2:1);return e=this._dateAdapter.createDate(this._dateAdapter.getYear(e),this._dateAdapter.getMonth(e),1),this._nextDisabled(e)}_previousYearDisabled(){let e=this._dateAdapter.createDate(this._dateAdapter.getYear(this._activeDate)-1,12,31);return this._prevDisabled(e)}_nextYearDisabled(){let e=this._dateAdapter.createDate(this._dateAdapter.getYear(this._activeDate)+(this._wide?2:1),1,1);return this._nextDisabled(e)}_previousYearRangeDisabled(){let e=this._dateAdapter.createDate(this._years[0][0]-1,12,31);return this._prevDisabled(e)}_nextYearRangeDisabled(){let e=this._wide?this._nextMonthYears:this._years,t=e[e.length-1],n=t[t.length-1],r=this._dateAdapter.createDate(n+1,1,1);return this._nextDisabled(r)}_handleTableBlur(e){e?.localName!==`button`&&this._setTabIndex()}_setTabIndex(){Array.from(this.shadowRoot.querySelectorAll(`.sbb-calendar__cell[tabindex="0"]`)??[]).forEach(e=>e.tabIndex=-1);let e=this._getFirstFocusable();e&&(e.tabIndex=0)}_getFirstFocusable(){let e;e=this.multiple?this._selected?.length?[...this._selected].sort()[0]:this._dateAdapter.today():this._selected??this._dateAdapter.today();let t=this.shadowRoot.querySelector(`.sbb-calendar__selected`)??this.shadowRoot.querySelector(`[value="${this._dateAdapter.toIso8601(e)}"]`)??this.shadowRoot.querySelector(`[data-month="${this._dateAdapter.getMonth(e)}"]`)??this.shadowRoot.querySelector(`[data-year="${this._dateAdapter.getYear(e)}"]`);return(!t||t?.disabled)&&(t=this._calendarView===`day`?this._getFirstFocusableDay():this.shadowRoot.querySelector(`.sbb-calendar__cell:not([disabled])`)),t||null}_getFirstFocusableDay(){let e=Array.from(this.shadowRoot.querySelectorAll(`.sbb-calendar__cell:not([disabled])`));if(!e||e.length===0)return null;{let t=e.map(e=>e.value).sort()[0];return this.shadowRoot.querySelector(`.sbb-calendar__cell[value="${t}"]`)}}_handleKeyboardEvent(e,t){Nr(e)&&e.preventDefault();let n=this._cells,r=n.findIndex(t=>t===e.target),i;i=t?this._navigateByKeyboardDayView(e,r,n,t):this._navigateByKeyboard(e,r,n);let a=this.shadowRoot.activeElement;i!==a&&(i.tabIndex=0,i?.focus(),a.tabIndex=-1)}_navigateByKeyboardDayView(e,t,n,r){let i=this.orientation===`horizontal`?{leftRight:1,upDown:7}:{leftRight:7,upDown:1},a=t<this._keyboardNavigationDayViewParameters.firstMonthLength?this._keyboardNavigationDayViewParameters.firstMonthOffset:this._keyboardNavigationDayViewParameters.secondMonthOffset;switch(e.key){case`ArrowUp`:return this._findDayArrows(n,t,r.dateValue,-i.upDown);case`ArrowDown`:return this._findDayArrows(n,t,r.dateValue,i.upDown);case`ArrowLeft`:return this._findDayArrows(n,t,r.dateValue,-i.leftRight);case`ArrowRight`:return this._findDayArrows(n,t,r.dateValue,i.leftRight);case`PageUp`:if(this.orientation===`horizontal`){let e=(r.dayValue%7||7)-r.dayValue;return this._findDayPageUpDown(n,t,r,e,i.upDown)}else{let e=(Math.ceil((+r.dayValue+a)/7)-1)*7-a+1-r.dayValue;return this._findDayPageUpDown(n,t,r,e,i.upDown)}case`PageDown`:if(this.orientation===`horizontal`){let e=+r.monthValue+1>12?1:+r.monthValue+1,a=+r.monthValue+1>12?+r.yearValue+1:+r.yearValue,o=this._dateAdapter.createDate(a,e,1),s=this._dateAdapter.getDate(this._dateAdapter.addCalendarDays(o,-1)),c=Math.trunc((s-+r.dayValue)/7)*7;return this._findDayPageUpDown(n,t,r,c,-i.upDown)}else{let e=Math.ceil((+r.dayValue+a)/7)*7-a-r.dayValue;return this._findDayPageUpDown(n,t,r,e,-i.upDown)}case`Home`:return this._findDayFirst(n,t,r,1);case`End`:{let e=+r.monthValue+1>12?1:+r.monthValue+1,i=+r.monthValue+1>12?+r.yearValue+1:+r.yearValue,a=this._dateAdapter.createDate(i,e,1);return this._findDayLast(n,t,a)}default:return n[t]}}_isDayOutOfView(e){return e<this._keyboardNavigationDayViewParameters.firstDayInView||e>this._keyboardNavigationDayViewParameters.lastDayInView}_findDayArrows(e,t,n,r){let i=this._dateAdapter.toIso8601(this._dateAdapter.addCalendarDays(n,r));if(this._isDayOutOfView(i))return e[t];let a=e.find(e=>e.value===i);return!a||a.disabled?this._findDayArrows(e,t,this._dateAdapter.deserialize(i),r):a}_findDayPageUpDown(e,t,n,r,i){let a=this._dateAdapter.toIso8601(this._dateAdapter.addCalendarDays(n.dateValue,r));if(this._isDayOutOfView(a))return e[t];let o=e.find(e=>e.value===a);return!o||o.disabled?this._findDayPageUpDown(e,t,n,r+i,i):o}_findDayFirst(e,t,n,r){let i=this._dateAdapter.toIso8601(this._dateAdapter.createDate(+n.yearValue,+n.monthValue,r));if(this._isDayOutOfView(i))return e[t];let a=e.find(e=>e.value===i);return!a||a.disabled?this._findDayFirst(e,t,n,r+1):a}_findDayLast(e,t,n){let r=this._dateAdapter.toIso8601(this._dateAdapter.addCalendarDays(n,-1));if(this._isDayOutOfView(r))return e[t];let i=e.find(e=>e.value===r);return!i||i.disabled?this._findDayLast(e,t,this._dateAdapter.deserialize(r)):i}_navigateByKeyboard(e,t,n){let{elementIndexForWideMode:r,offsetForWideMode:i,lastElementIndexForWideMode:a,verticalOffset:o}=this._calculateParametersForKeyboardNavigation(t,this._calendarView===`year`);switch(e.key){case`ArrowUp`:return this._findNext(n,t,-o);case`ArrowDown`:return this._findNext(n,t,o);case`ArrowLeft`:return this._findNext(n,t,-1);case`ArrowRight`:return this._findNext(n,t,1);case`Home`:return this._findFirst(n,i);case`PageUp`:return this._findFirstOnColumn(n,r,i,o);case`PageDown`:return this._findLastOnColumn(n,t,a,o);case`End`:return this._findLast(n,a-1);default:return n[t]}}_calculateParametersForKeyboardNavigation(e,t){let n=t?24:12,r=Math.trunc(e/n)*n,i=r===0?e:e-n;return{verticalOffset:4,elementIndexForWideMode:i,offsetForWideMode:e-i,lastElementIndexForWideMode:r===0?n:n*2}}_findNext(e,t,n){let r=t+n;for(;r<e.length&&e[r]?.disabled;)r+=n;return e[r]??e[t]}_findFirst(e,t){return e[t].disabled?this._findNext(e,t,1):e[t]}_findLast(e,t){return e[t].disabled?this._findNext(e,t,-1):e[t]}_findFirstOnColumn(e,t,n,r){let i=t%r+n;return e[i].disabled?this._findNext(e,i,r):e[i]}_findLastOnColumn(e,t,n,r){let i=t+Math.trunc((n-t-1)/r)*r;return e[i].disabled?this._findNext(e,i,-r):e[i]}_resetCalendarView(e=!1){this._resetFocus=!0,this._activeDate=(this.multiple?this._selected.at(-1):this._selected)??this._dateAdapter.today(),this._setChosenYear(),this._chosenMonth=void 0,this._nextCalendarView=this._calendarView=this.view,e&&this._startTableTransition()}_renderDayView(){let e=this._wide?this._dateAdapter.addCalendarMonths(this._activeDate,1):void 0;return N`
      <div class="sbb-calendar__controls">
        ${this._getArrow(`left`,()=>this._goToDifferentMonth(-1),Dn[this._language.current],this._previousMonthDisabled())}
        <div class="sbb-calendar__controls-month">
          ${this._createLabelForDayView(this._activeDate)}
          ${this._wide?this._createLabelForDayView(e):P}
          <sbb-screen-reader-only role="status">
            ${this._createAriaLabelForDayView(this._activeDate,e)}
          </sbb-screen-reader-only>
        </div>
        ${this._getArrow(`right`,()=>this._goToDifferentMonth(1),En[this._language.current],this._nextMonthDisabled())}
      </div>
      <div class="sbb-calendar__table-container sbb-calendar__table-day-view">
        ${this.orientation===`horizontal`?N`
              ${this._createDayTable(this._weeks,this._weekNumbers)}
              ${this._wide?this._createDayTable(this._nextMonthWeeks,this._nextMonthWeekNumbers,!0):P}
            `:N`
              ${this._createDayTableVertical(this._weeks,this._weekNumbers)}
              ${this._wide?this._createDayTableVertical(this._nextMonthWeeks,this._nextMonthWeekNumbers,e):P}
            `}
      </div>
    `}_createLabelForDayView(e){let t=`${this._monthNames[this._dateAdapter.getMonth(e)-1]} ${this._dateAdapter.getYear(e)}`;return N`
      <button
        type="button"
        class="sbb-calendar__date-selection sbb-calendar__controls-change-date"
        aria-label="${An[this._language.current]} ${t}"
        @click=${()=>{this._resetFocus=!0,this._nextCalendarView=`year`,this._startTableTransition()}}
      >
        ${t}
        <sbb-icon name="chevron-small-down-small"></sbb-icon>
      </button>
    `}_createAriaLabelForDayView(...e){let t=``;for(let n of e)n&&(t+=`${this._monthNames[this._dateAdapter.getMonth(n)-1]} ${this._dateAdapter.getYear(n)} `);return t}_createDayTable(e,t,n=!1){let r=this._dateAdapter.toIso8601(this._dateAdapter.today()),i=(this._wide?[...this._weeks,...this._nextMonthWeeks]:n?this._nextMonthWeeks:this._weeks).flat(),a=(n?this._nextMonthWeeks:this._weeks).flat();return N`
      <table
        class="sbb-calendar__table"
        @focusout=${e=>this._handleTableBlur(e.relatedTarget)}
        @animationend=${e=>this._tableAnimationEnd(e)}
      >
        <thead class="sbb-calendar__table-header">
          <tr>
            ${this.weekNumbers?N`<th class="sbb-calendar__table-header-cell"></th>`:P}
            ${this._weekdays.map((e,t)=>N`
                <th class="sbb-calendar__table-header-cell">
                  ${this.multiple?N`
                        <button
                          class="sbb-calendar__header-cell sbb-calendar__weekday"
                          aria-label=${e.long}
                          @click=${()=>{let e=a.filter(e=>e.weekDayValue===(t+1)%7);this._selectMultipleDates(e)}}
                        >
                          ${e.narrow}
                        </button>
                      `:N`
                        <sbb-screen-reader-only>${e.long}</sbb-screen-reader-only>
                        <span aria-hidden="true">${e.narrow}</span>
                      `}
                </th>
              `)}
          </tr>
        </thead>
        <tbody class="sbb-calendar__table-body">
          ${e.map((e,n)=>{let a=7-e.length;return n===0&&a?N`
                <tr>
                  ${this.weekNumbers?N`
                        <td class="sbb-calendar__table-header-cell">
                          ${this.multiple?N`
                                <button
                                  class="sbb-calendar__header-cell sbb-calendar__weekday"
                                  aria-label=${`${Xn[this._language.current]} ${t[0]}`}
                                  @click=${()=>{let e=i.filter(e=>e.weekValue===t[0]);this._selectMultipleDates(e)}}
                                >
                                  ${t[0]}
                                </button>
                              `:N`
                                <sbb-screen-reader-only
                                  >${`${Xn[this._language.current]} ${t[0]}`}</sbb-screen-reader-only
                                >
                                <span aria-hidden="true">${t[0]}</span>
                              `}
                        </td>
                      `:P}
                  ${[...Array(a).keys()].map(()=>N`<td class="sbb-calendar__table-data"></td>`)}
                  ${this._createDayCells(e,r)}
                </tr>
              `:N`
              <tr>
                ${this.weekNumbers?N`
                      <td class="sbb-calendar__table-header-cell">
                        ${this.multiple?N`
                              <button
                                class="sbb-calendar__header-cell sbb-calendar__weekday"
                                aria-label=${`${Xn[this._language.current]} ${t[n]}`}
                                @click=${()=>{let e=i.filter(e=>e.weekValue===t[n]);this._selectMultipleDates(e)}}
                              >
                                ${t[n]}
                              </button>
                            `:N`
                              <sbb-screen-reader-only
                                >${`${Xn[this._language.current]} ${t[n]}`}</sbb-screen-reader-only
                              >
                              <span aria-hidden="true">${t[n]}</span>
                            `}
                      </td>
                    `:P}
                ${this._createDayCells(e,r)}
              </tr>
            `})}
        </tbody>
      </table>
    `}_createDayTableVertical(e,t,n){let r=this._dateAdapter.toIso8601(this._dateAdapter.today()),i=this._dateAdapter.getFirstWeekOffset(n??this._activeDate),a=(this._wide?[...this._weeks,...this._nextMonthWeeks]:n?this._nextMonthWeeks:this._weeks).flat();return N`
      <table
        class="sbb-calendar__table"
        @focusout=${e=>this._handleTableBlur(e.relatedTarget)}
        @animationend=${e=>this._tableAnimationEnd(e)}
      >
        ${this.weekNumbers?N`
              <thead class="sbb-calendar__table-header">
                <tr>
                  ${n?P:N`<th class="sbb-calendar__table-data"></th>`}
                  ${t.map(e=>N`
                      <th class="sbb-calendar__table-header-cell">
                        ${this.multiple?N`
                              <button
                                class="sbb-calendar__header-cell sbb-calendar__weekday"
                                aria-label=${`${Xn[this._language.current]} ${e}`}
                                @click=${()=>{let t=a.filter(t=>t.weekValue===e);this._selectMultipleDates(t)}}
                              >
                                ${e}
                              </button>
                            `:N`
                              <sbb-screen-reader-only
                                >${`${Xn[this._language.current]} ${e}`}</sbb-screen-reader-only
                              >
                              <span aria-hidden="true">${e}</span>
                            `}
                      </th>
                    `)}
                </tr>
              </thead>
            `:P}
        <tbody class="sbb-calendar__table-body">
          ${e.map((e,t)=>{let a=this._weekdays[t],o=this._wide?[...e,...this._nextMonthWeeks[t]]:e;return N`
              <tr>
                ${n?P:N`
                      <td class="sbb-calendar__table-header-cell">
                        ${this.multiple?N`
                              <button
                                class="sbb-calendar__header-cell sbb-calendar__weekday"
                                aria-label=${a.long}
                                @click=${()=>this._selectMultipleDates(o)}
                              >
                                ${a.narrow}
                              </button>
                            `:N`
                              <sbb-screen-reader-only>${a.long}</sbb-screen-reader-only>
                              <span aria-hidden="true">${a.narrow}</span>
                            `}
                      </td>
                    `}
                ${t<i?N`<td class="sbb-calendar__table-data"></td>`:P}
                ${this._createDayCells(e,r)}
              </tr>
            `})}
        </tbody>
      </table>
    `}_createDayCells(e,t){return e.map(e=>{let n=!this._isDayInRange(e.value),r=!this._dateFilter(this._dateAdapter.deserialize(e.value)),i=e.value===t,a;return a=this.multiple?this._selected.find(t=>this._dateAdapter.compareDate(e.dateValue,t)===0)!==void 0:!!this._selected&&this._dateAdapter.compareDate(e.dateValue,this._selected)===0,N`
        <td
          class=${Bl({"sbb-calendar__table-data":!0,"sbb-calendar__table-data-selected":a})}
        >
          <button
            class=${Bl({"sbb-calendar__cell":!0,"sbb-calendar__day":!0,"sbb-calendar__cell-current":i,"sbb-calendar__selected":a,"sbb-calendar__crossed-out":!n&&r})}
            @click=${()=>this._selectDate(e.dateValue)}
            ?disabled=${n||r}
            value=${e.value}
            type="button"
            aria-label=${this._dateAdapter.getAccessibilityFormatDate(e.value)}
            aria-pressed=${a}
            aria-disabled=${n||r}
            aria-current=${i?`date`:P}
            tabindex="-1"
            @keydown=${t=>this._handleKeyboardEvent(t,e)}
            sbb-popover-close
          >
            ${e.dayValue}
          </button>
        </td>
      `})}_renderMonthView(){return N`
      <div class="sbb-calendar__controls">
        ${this._getArrow(`left`,()=>this._goToDifferentYear(-1),Fn[this._language.current],this._previousYearDisabled())}
        <div class="sbb-calendar__controls-month">${this._createLabelForMonthView()}</div>
        ${this._getArrow(`right`,()=>this._goToDifferentYear(1),Pn[this._language.current],this._nextYearDisabled())}
      </div>
      <div class="sbb-calendar__table-container sbb-calendar__table-month-view">
        ${this._createMonthTable(this._months,this._chosenYear)}
        ${this._wide?this._createMonthTable(this._months,this._chosenYear+1):P}
      </div>
    `}_createLabelForMonthView(){return N` <button
        type="button"
        id="sbb-calendar__month-selection"
        class="sbb-calendar__controls-change-date"
        aria-label=${`${jn[this._language.current]} ${this._chosenYear}`}
        @click=${()=>this._resetCalendarView(!0)}
      >
        ${this._chosenYear} ${this._wide?` - ${this._chosenYear+1}`:P}
        <sbb-icon name="chevron-small-up-small"></sbb-icon>
      </button>
      <sbb-screen-reader-only role="status"> ${this._chosenYear} </sbb-screen-reader-only>`}_createMonthTable(e,t){return N`
      <table
        class="sbb-calendar__table"
        @animationend=${e=>this._tableAnimationEnd(e)}
      >
        ${this._wide?N`<thead class="sbb-calendar__table-header" aria-hidden="true">
              <tr>
                <th class="sbb-calendar__table-header-cell" colspan=${4}>${t}</th>
              </tr>
            </thead>`:P}
        <tbody class="sbb-calendar__table-body">
          ${e.map(e=>N`
              <tr>
                ${e.map(e=>{let n;if(this.multiple)n=this._selected.find(n=>t===this._dateAdapter.getYear(n)&&e.monthValue===this._dateAdapter.getMonth(n))!==void 0;else{let r=this._selected?this._dateAdapter.getMonth(this._selected):void 0,i=this._selected?this._dateAdapter.getYear(this._selected):void 0;n=!!this._selected&&t===i&&e.monthValue===r}let r=!this._isMonthInRange(e.monthValue,t),i=!this._isMonthFilteredOut(e.monthValue,t),a=t===this._dateAdapter.getYear(this._dateAdapter.today())&&this._dateAdapter.getMonth(this._dateAdapter.today())===e.monthValue;return N` <td
                    class=${Bl({"sbb-calendar__table-data":!0,"sbb-calendar__table-month":!0})}
                  >
                    <button
                      class=${Bl({"sbb-calendar__cell":!0,"sbb-calendar__pill":!0,"sbb-calendar__cell-current":a,"sbb-calendar__crossed-out":!r&&i,"sbb-calendar__selected":n})}
                      @click=${()=>this._onMonthSelection(e.monthValue,t)}
                      ?disabled=${r||i}
                      aria-label=${`${e.longValue} ${t}`}
                      aria-pressed=${n}
                      aria-disabled=${String(r||i)}
                      tabindex="-1"
                      data-month=${e.monthValue||P}
                      @keydown=${e=>this._handleKeyboardEvent(e)}
                    >
                      ${e.value}
                    </button>
                  </td>`})}
              </tr>
            `)}
        </tbody>
      </table>
    `}_onMonthSelection(e,t){this._chosenMonth=e,this._nextCalendarView=`day`,this._init(this._dateAdapter.createDate(t,this._chosenMonth,this._dateAdapter.getDate(this._activeDate))),this._startTableTransition()}_renderYearView(){return N`
      <div class="sbb-calendar__controls">
        ${this._getArrow(`left`,()=>this._goToDifferentYearRange(-24),Nn(24)[this._language.current],this._previousYearRangeDisabled())}
        <div class="sbb-calendar__controls-month">${this._createLabelForYearView()}</div>
        ${this._getArrow(`right`,()=>this._goToDifferentYearRange(24),Mn(24)[this._language.current],this._nextYearRangeDisabled())}
      </div>
      <div class="sbb-calendar__table-container sbb-calendar__table-year-view">
        ${this._createYearTable(this._years)}
        ${this._wide?this._createYearTable(this._nextMonthYears,!0):P}
      </div>
    `}_getArrow(e,t,n,r){return N`<sbb-secondary-button
      size="m"
      icon-name="chevron-small-${e}-small"
      aria-label=${n}
      @click=${t}
      ?disabled=${r}
      id="sbb-calendar__controls-${e===`left`?`previous`:`next`}"
    ></sbb-secondary-button>`}_createLabelForYearView(){let e=this._years.flat()[0],t=(this._wide?this._nextMonthYears:this._years).flat(),n=`${e} - ${t[t.length-1]}`;return N`
      <button
        type="button"
        id="sbb-calendar__year-selection"
        class="sbb-calendar__controls-change-date"
        aria-label="${jn[this._language.current]} ${n}"
        @click=${()=>this._resetCalendarView(!0)}
      >
        ${n}
        <sbb-icon name="chevron-small-up-small"></sbb-icon>
      </button>
      <sbb-screen-reader-only role="status"> ${n} </sbb-screen-reader-only>
    `}_createYearTable(e,t=!1){let n=this._dateAdapter.today();return N` <table
      class="sbb-calendar__table"
      @animationend=${e=>this._tableAnimationEnd(e)}
    >
      <tbody class="sbb-calendar__table-body">
        ${e.map(e=>N` <tr>
              ${e.map(e=>{let r;if(this.multiple)r=this._selected.find(t=>e===this._dateAdapter.getYear(t))!==void 0;else{let t=this._selected?this._dateAdapter.getYear(this._selected):void 0;r=!!this._selected&&e===t}let i=!this._isYearInRange(e),a=!this._isYearFilteredOut(e),o=this._dateAdapter.getYear(n)===e;return N` <td class="sbb-calendar__table-data sbb-calendar__table-year">
                  <button
                    class=${Bl({"sbb-calendar__cell":!0,"sbb-calendar__pill":!0,"sbb-calendar__cell-current":o,"sbb-calendar__crossed-out":!i&&a,"sbb-calendar__selected":r})}
                    @click=${()=>this._onYearSelection(e,t)}
                    ?disabled=${i||a}
                    aria-label=${e}
                    aria-pressed=${r}
                    aria-disabled=${String(i||a)}
                    tabindex="-1"
                    data-year=${e||P}
                    @keydown=${e=>this._handleKeyboardEvent(e)}
                  >
                    ${e}
                  </button>
                </td>`})}
            </tr>`)}
      </tbody>
    </table>`}_onYearSelection(e,t){this._chosenYear=t?e-1:e,this._nextCalendarView=`month`,this._assignActiveDate(this._dateAdapter.createDate(this._chosenYear,this._dateAdapter.getMonth(this._activeDate),this._dateAdapter.getDate(this._activeDate))),this._startTableTransition()}_getView(){if(this.hydrationRequired)return N`${P}`;switch(this._calendarView){case`year`:return this._renderYearView();case`month`:return this._renderMonthView();default:return this._renderDayView()}}_tableAnimationEnd(e){let t=e.target;e.animationName===`hide`?(t.classList.remove(`sbb-calendar__table-hide`),this._resetFocus=!0,this._calendarView=this._nextCalendarView):e.animationName===`show`&&this.removeAttribute(`data-transition`)}_startTableTransition(){this.toggleAttribute(`data-transition`,!0),this.shadowRoot?.querySelectorAll(`table`)?.forEach(e=>e.classList.toggle(`sbb-calendar__table-hide`))}render(){return N`<div class="sbb-calendar__wrapper">${this._getView()}</div>`}},e=new WeakMap,t=new WeakMap,n=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,l=new WeakMap,u=new WeakMap,d=new WeakMap,f=new WeakMap,p=new WeakMap,m=new WeakMap,y=h,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(b[Symbol.metadata]??null):void 0;S=[L(),A({type:Boolean})],w=[A()],ne=[Zt(),A()],O=[Zt(),A()],ie=[L(),ct((e,t)=>e._onMultipleChanged(t)),A({type:Boolean})],se=[A()],ce=[j()],de=[A({attribute:`date-filter`})],me=[A({reflect:!0})],ge=[L(),A({attribute:`week-numbers`,type:Boolean})],ye=[j()],Se=[j()],Ce=[j()],Ee=[j()],i(h,null,S,{kind:`accessor`,name:`wide`,static:!1,private:!1,access:{has:e=>`wide`in e,get:e=>e.wide,set:(e,t)=>{e.wide=t}},metadata:e},C,ee),i(h,null,w,{kind:`accessor`,name:`view`,static:!1,private:!1,access:{has:e=>`view`in e,get:e=>e.view,set:(e,t)=>{e.view=t}},metadata:e},T,te),i(h,null,ne,{kind:`accessor`,name:`min`,static:!1,private:!1,access:{has:e=>`min`in e,get:e=>e.min,set:(e,t)=>{e.min=t}},metadata:e},E,D),i(h,null,O,{kind:`accessor`,name:`max`,static:!1,private:!1,access:{has:e=>`max`in e,get:e=>e.max,set:(e,t)=>{e.max=t}},metadata:e},re,k),i(h,null,ie,{kind:`accessor`,name:`multiple`,static:!1,private:!1,access:{has:e=>`multiple`in e,get:e=>e.multiple,set:(e,t)=>{e.multiple=t}},metadata:e},ae,oe),i(h,null,se,{kind:`setter`,name:`selected`,static:!1,private:!1,access:{has:e=>`selected`in e,set:(e,t)=>{e.selected=t}},metadata:e},null,x),i(h,null,ce,{kind:`accessor`,name:`_selected`,static:!1,private:!1,access:{has:e=>`_selected`in e,get:e=>e._selected,set:(e,t)=>{e._selected=t}},metadata:e},le,ue),i(h,null,de,{kind:`accessor`,name:`dateFilter`,static:!1,private:!1,access:{has:e=>`dateFilter`in e,get:e=>e.dateFilter,set:(e,t)=>{e.dateFilter=t}},metadata:e},fe,pe),i(h,null,me,{kind:`accessor`,name:`orientation`,static:!1,private:!1,access:{has:e=>`orientation`in e,get:e=>e.orientation,set:(e,t)=>{e.orientation=t}},metadata:e},he,M),i(h,null,ge,{kind:`accessor`,name:`weekNumbers`,static:!1,private:!1,access:{has:e=>`weekNumbers`in e,get:e=>e.weekNumbers,set:(e,t)=>{e.weekNumbers=t}},metadata:e},_e,ve),i(h,null,ye,{kind:`accessor`,name:`_activeDate`,static:!1,private:!1,access:{has:e=>`_activeDate`in e,get:e=>e._activeDate,set:(e,t)=>{e._activeDate=t}},metadata:e},be,xe),i(h,null,Se,{kind:`setter`,name:`_wide`,static:!1,private:!1,access:{has:e=>`_wide`in e,set:(e,t)=>{e._wide=t}},metadata:e},null,x),i(h,null,Ce,{kind:`accessor`,name:`_calendarView`,static:!1,private:!1,access:{has:e=>`_calendarView`in e,get:e=>e._calendarView,set:(e,t)=>{e._calendarView=t}},metadata:e},we,Te),i(h,null,Ee,{kind:`accessor`,name:`_initialized`,static:!1,private:!1,access:{has:e=>`_initialized`in e,get:e=>e._initialized,set:(e,t)=>{e._initialized=t}},metadata:e},De,Oe),i(null,_={value:y},g,{kind:`class`,name:y.name,metadata:e},null,v),y=_.value,e&&Object.defineProperty(y,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),h.styles=lu,h.events={dateselected:`dateselected`},a(y,v),y})()})),du=e((()=>{uu()})),fu,pu,mu,hu,gu,_u,vu,yu=e((()=>{o(),I(),M(),xt(),z(),Yt(),B(),H(),G(),Cl(),zl(),du(),fu=e=>{throw TypeError(e)},pu=(e,t,n)=>t.has(e)||fu(`Cannot `+n),mu=(e,t,n)=>(pu(e,t,`read from private field`),n?n.call(e):t.get(e)),hu=(e,t,n)=>t.has(e)?fu(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),gu=(e,t,n,r)=>(pu(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),_u=h`#status-container{border:0;clip-path:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}`,vu=0,(()=>{var e,t,n,r;let o=[s(`sbb-datepicker`)],c,l=[],u,d=Zi(Fl),f,p=[],m=[],h,g=[],_=[],v,y=[],b=[];return r=class extends d{constructor(){super(),hu(this,e),hu(this,t),hu(this,n),gu(this,e,a(this,p,!1)),gu(this,t,(a(this,m),a(this,g,null))),gu(this,n,(a(this,_),a(this,y,`day`))),this._inputAbortController=a(this,b),this._dateAdapter=yt().datetime?.dateAdapter??qt,this._language=new R(this),this._ready=!1,this.startUpdate(),this.addEventListener(Fl.events.beforeopen,()=>{this.shadowRoot?.querySelector(`sbb-calendar`)?.resetPosition?.()}),this.hydrationRequired&&this.hydrationComplete.then(()=>this.requestUpdate())}get wide(){return mu(this,e)}set wide(t){gu(this,e,t)}get input(){return mu(this,t)}set input(e){gu(this,t,e)}get view(){return mu(this,n)}set view(e){gu(this,n,e)}connectedCallback(){this.id||=`sbb-datepicker-${++vu}`,super.connectedCallback();let e=this.closest?.(`sbb-form-field`);if(e){xl.resolveAssociation(this);let t=e.querySelector(`sbb-datepicker-toggle`);t&&!t.hasAttribute(`datepicker`)&&(t.datepicker??=this)}}requestUpdate(e,t,n){if(super.requestUpdate(e,t,n),e===`input`&&this.input!==t&&(this._inputAbortController?.abort(),this.input)){let{signal:e}=this._inputAbortController=new AbortController;this.input?.addEventListener(`ɵchange`,()=>{super.requestUpdate(),this._updateStatus()},{signal:e})}}firstUpdated(e){super.firstUpdated(e),setTimeout(()=>{this._ready=!0,this.requestUpdate(),this.completeUpdate()})}_updateStatus(){let e=this.shadowRoot?.getElementById(`status-container`);if(!e)return;let t=this._dateAdapter.isValid(this.input?.valueAsDate)?`${Bn[this._language.current]} ${this._dateAdapter.format(this.input.valueAsDate,{weekdayStyle:`long`})}`:``;e.textContent!==t&&(e.textContent=t)}renderContent(){return N`
      <p id="status-container" role="status"></p>
      <sbb-calendar
        .view=${this.view}
        .min=${this.input?.min??null}
        .max=${this.input?.max??null}
        .dateFilter=${this.input?.dateFilter??null}
        .selected=${this.input?.valueAsDate??null}
        ?wide=${this.wide}
        @dateselected=${e=>{this.input&&(this.input.valueAsDate=e.detail,this.input.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),this.input.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.input.dispatchEvent(new Event(`blur`,{composed:!0})))}}
      ></sbb-calendar>
    `}render(){return this.hydrationRequired||!this._ready?N`${P}`:super.render()}},e=new WeakMap,t=new WeakMap,n=new WeakMap,u=r,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(d[Symbol.metadata]??null):void 0;f=[L(),A({type:Boolean})],h=[ht(),A()],v=[A()],i(r,null,f,{kind:`accessor`,name:`wide`,static:!1,private:!1,access:{has:e=>`wide`in e,get:e=>e.wide,set:(e,t)=>{e.wide=t}},metadata:e},p,m),i(r,null,h,{kind:`accessor`,name:`input`,static:!1,private:!1,access:{has:e=>`input`in e,get:e=>e.input,set:(e,t)=>{e.input=t}},metadata:e},g,_),i(r,null,v,{kind:`accessor`,name:`view`,static:!1,private:!1,access:{has:e=>`view`in e,get:e=>e.view,set:(e,t)=>{e.view=t}},metadata:e},y,b),i(null,c={value:u},o,{kind:`class`,name:u.name,metadata:e},null,l),u=c.value,e&&Object.defineProperty(u,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),r.styles=[Fl.styles,_u],r.sbbDateInputAssociated=!0,a(u,l),u})()})),bu,xu,Su,Cu,wu,Tu,Eu,Du=e((()=>{o(),I(),M(),q(),xt(),z(),Yt(),B(),H(),G(),Cl(),Mo(),bu=e=>{throw TypeError(e)},xu=(e,t,n)=>t.has(e)||bu(`Cannot `+n),Su=(e,t,n)=>(xu(e,t,`read from private field`),n?n.call(e):t.get(e)),Cu=(e,t,n)=>t.has(e)?bu(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),wu=(e,t,n,r)=>(xu(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Tu=(()=>{var e,t;let n=W(sa),r,o=[],s=[];return t=class extends n{constructor(){super(...arguments),Cu(this,e),wu(this,e,a(this,o,null)),this._inputDisabled=(a(this,s),!0),this.dateAdapter=yt().datetime?.dateAdapter??qt,this.language=new R(this)}get input(){return Su(this,e)}set input(t){wu(this,e,t)}get disabled(){return!!this._inputDisabled}connectedCallback(){super.connectedCallback(),this.toggleAttribute(`disabled`,this.disabled);let e=this.closest?.(`sbb-form-field`);e&&(customElements.upgrade?.(e),this.negative=e.negative,xl.resolveAssociation(this),this.slot||=this._findSlotPosition())}requestUpdate(e,t,n){super.requestUpdate(e,t,n),e===`input`&&this.input!==t?(this._inputAbortController?.abort(),this._inputDisabled=!0,this.input&&(this._inputAbortController=new AbortController,this.slot=this._findSlotPosition(),customElements.upgrade?.(this.input),this._sync(),this.input.addEventListener(`ɵchange`,()=>this._sync())),this.hasUpdated&&this.toggleAttribute(`disabled`,this.disabled)):!e&&this.hasUpdated&&this.input&&this._sync()}_findSlotPosition(){return!this.input||this.compareDocumentPosition(this.input)&Node.DOCUMENT_POSITION_FOLLOWING?`prefix`:`suffix`}_sync(){this.syncDateInputState(),this.toggleAttribute(`disabled`,this.disabled),this.disabled?this.removeAttribute(`tabindex`):this.setAttribute(`tabindex`,`0`)}syncDateInputState(){this._inputDisabled=this.input.disabled||this.input.readOnly}renderTemplate(){return N`<sbb-icon name=${this.iconName}></sbb-icon>`}},e=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(n[Symbol.metadata]??null):void 0;r=[ht(),A()],i(t,null,r,{kind:`accessor`,name:`input`,static:!1,private:!1,access:{has:e=>`input`in e,get:e=>e.input,set:(e,t)=>{e.input=t}},metadata:e},o,s),e&&Object.defineProperty(t,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t.sbbDateInputAssociated=!0,t})(),Eu=class extends Tu{get disabled(){return this._disabled||super.disabled}constructor(){super(),this._disabled=!0,this.addEventListener?.(`click`,()=>this._handleClick())}_handleClick(){if(!this.input||this.disabled)return;let e=this.input.valueAsDate??this.dateAdapter.today(),t=this.findAvailableDate(e);this.dateAdapter.isValid(t)&&this.dateAdapter.compareDate(t,e)!==0&&(this.input.valueAsDate=t,this.input.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),this.input.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.input.dispatchEvent(new Event(`blur`,{composed:!0})))}syncDateInputState(){if(super.syncDateInputState(),!this.dateAdapter.isValid(this.input.valueAsDate)){this._disabled=!0,this.internals.ariaLabel=this.i18nOffBoundaryDay[this.language.current];return}let e=this.findAvailableDate(this.input.valueAsDate);this._disabled=!this.dateAdapter.isValid(e)||this.dateAdapter.compareDate(e,this.input.valueAsDate)===0;let t=this.dateAdapter.compareDate(this.dateAdapter.today(),this.input.valueAsDate)===0?Tn[this.language.current].toLowerCase():this.dateAdapter.getAccessibilityFormatDate(this.input.valueAsDate);this.internals.ariaLabel=this.i18nSelectOffBoundaryDay(t)[this.language.current]}}})),Ou=e((()=>{Du()})),ku,Au=e((()=>{o(),M(),H(),Ou(),I(),ku=h`*,:before,:after{box-sizing:border-box}:host{display:inline-block;-webkit-tap-highlight-color:transparent;height:fit-content;outline:none!important;--sbb-button-color-text: var(--sbb-color-3);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3);--sbb-button-color-active-background: var(--sbb-background-color-4);--sbb-button-color-disabled-background: var(--sbb-background-color-3);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-color-disabled-text: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-button-border-disabled-width: var(--sbb-border-width-1x);--sbb-button-border-disabled-style: dashed;--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing)}@media(forced-colors:active){:host{--sbb-button-color-text: ButtonText !important;--sbb-button-color-hover-background: Highlight !important;--sbb-button-color-active-background: Highlight !important;--sbb-button-color-disabled-background: Canvas !important;--sbb-button-color-disabled-border: GrayText !important;--sbb-button-color-disabled-text: GrayText !important}}:host .sbb-datepicker-next-day{position:relative;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;border-radius:var(--sbb-button-border-radius);color:var(--sbb-button-color-text);cursor:pointer;-webkit-user-select:none;user-select:none;display:flex}:host .sbb-datepicker-next-day:before{position:absolute;content:"";inset:0;border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color}sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem));display:flex}:host([negative]){--sbb-button-color-text: var(--sbb-color-3-negative);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3-negative);--sbb-button-color-active-background: var(--sbb-background-color-4-negative);--sbb-button-color-disabled-background: var(--sbb-background-color-3-negative);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-5)}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-datepicker-next-day{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-datepicker-next-day:before{background-color:var(--sbb-button-color-disabled-background);border:var(--sbb-button-border-disabled-width) var(--sbb-button-border-disabled-style) var(--sbb-button-color-disabled-border)}:host(:is([data-focus-visible],:focus-visible)) .sbb-datepicker-next-day:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}:host([data-focus-visible]){--sbb-focus-outline-style: initial}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover){--sbb-button-translate-y-content-hover: -.0625rem}}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover) .sbb-datepicker-next-day:before{background-color:var(--sbb-button-color-hover-background)}}:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled]):is(:active,[data-active])) .sbb-datepicker-next-day:before{background-color:var(--sbb-button-color-active-background)}.sbb-datepicker-next-day{margin:auto;-webkit-tap-highlight-color:transparent}`,(()=>{var e;let t=[s(`sbb-datepicker-next-day`)],n,r=[],o,c=Eu;return e=class extends c{constructor(){super(...arguments),this.iconName=`chevron-small-right-small`,this.i18nOffBoundaryDay=On,this.i18nSelectOffBoundaryDay=In}findAvailableDate(e){let t=this.dateAdapter.addCalendarDays(e,1);if(this._isAfterMaxDate(t))return null;let n=this.input.dateFilter;if(n){for(;!n(t);)if(t=this.dateAdapter.addCalendarDays(t,1),this._isAfterMaxDate(t))return null}return t}_isAfterMaxDate(e){return!!this.input.max&&this.dateAdapter.compareDate(e,this.input.max)>0}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=ku,a(o,r),o})()})),ju,Mu=e((()=>{o(),M(),H(),Ou(),I(),ju=h`*,:before,:after{box-sizing:border-box}:host{display:inline-block;-webkit-tap-highlight-color:transparent;height:fit-content;outline:none!important;--sbb-button-color-text: var(--sbb-color-3);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3);--sbb-button-color-active-background: var(--sbb-background-color-4);--sbb-button-color-disabled-background: var(--sbb-background-color-3);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-color-disabled-text: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-button-border-disabled-width: var(--sbb-border-width-1x);--sbb-button-border-disabled-style: dashed;--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing)}@media(forced-colors:active){:host{--sbb-button-color-text: ButtonText !important;--sbb-button-color-hover-background: Highlight !important;--sbb-button-color-active-background: Highlight !important;--sbb-button-color-disabled-background: Canvas !important;--sbb-button-color-disabled-border: GrayText !important;--sbb-button-color-disabled-text: GrayText !important}}:host .sbb-datepicker-previous-day{position:relative;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;border-radius:var(--sbb-button-border-radius);color:var(--sbb-button-color-text);cursor:pointer;-webkit-user-select:none;user-select:none;display:flex}:host .sbb-datepicker-previous-day:before{position:absolute;content:"";inset:0;border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color}sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem));display:flex}:host([negative]){--sbb-button-color-text: var(--sbb-color-3-negative);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3-negative);--sbb-button-color-active-background: var(--sbb-background-color-4-negative);--sbb-button-color-disabled-background: var(--sbb-background-color-3-negative);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-5)}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-datepicker-previous-day{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-datepicker-previous-day:before{background-color:var(--sbb-button-color-disabled-background);border:var(--sbb-button-border-disabled-width) var(--sbb-button-border-disabled-style) var(--sbb-button-color-disabled-border)}:host(:is([data-focus-visible],:focus-visible)) .sbb-datepicker-previous-day:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}:host([data-focus-visible]){--sbb-focus-outline-style: initial}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover){--sbb-button-translate-y-content-hover: -.0625rem}}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover) .sbb-datepicker-previous-day:before{background-color:var(--sbb-button-color-hover-background)}}:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled]):is(:active,[data-active])) .sbb-datepicker-previous-day:before{background-color:var(--sbb-button-color-active-background)}.sbb-datepicker-previous-day{margin:auto;-webkit-tap-highlight-color:transparent}`,(()=>{var e;let t=[s(`sbb-datepicker-previous-day`)],n,r=[],o,c=Eu;return e=class extends c{constructor(){super(...arguments),this.iconName=`chevron-small-left-small`,this.i18nOffBoundaryDay=kn,this.i18nSelectOffBoundaryDay=Ln}findAvailableDate(e){let t=this.dateAdapter.addCalendarDays(e,-1);if(this._isBeforeMinDate(t))return null;let n=this.input.dateFilter;if(n){for(;!n(t);)if(t=this.dateAdapter.addCalendarDays(t,-1),this._isBeforeMinDate(t))return null}return t}_isBeforeMinDate(e){return!!this.input.min&&this.dateAdapter.compareDate(e,this.input.min)<0}},o=e,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:e},null,r),o=n.value,e&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),e.styles=ju,a(o,r),o})()})),Nu,Pu,Fu,Iu,Lu,Ru,zu=e((()=>{o(),M(),B(),H(),Ou(),I(),Nu=e=>{throw TypeError(e)},Pu=(e,t,n)=>t.has(e)||Nu(`Cannot `+n),Fu=(e,t,n)=>(Pu(e,t,`read from private field`),n?n.call(e):t.get(e)),Iu=(e,t,n)=>t.has(e)?Nu(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Lu=(e,t,n,r)=>(Pu(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ru=h`*,:before,:after{box-sizing:border-box}:host{display:inline-block;-webkit-tap-highlight-color:transparent;height:fit-content;outline:none!important;--sbb-button-color-text: var(--sbb-color-3);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3);--sbb-button-color-active-background: var(--sbb-background-color-4);--sbb-button-color-disabled-background: var(--sbb-background-color-3);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-granite);--sbb-button-color-disabled-text: light-dark(var(--sbb-color-granite), var(--sbb-color-smoke));--sbb-button-border-disabled-width: var(--sbb-border-width-1x);--sbb-button-border-disabled-style: dashed;--sbb-button-border-radius: var(--sbb-border-radius-infinity);--sbb-button-transition-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-2x) );--sbb-button-transition-easing-function: var(--sbb-animation-easing)}@media(forced-colors:active){:host{--sbb-button-color-text: ButtonText !important;--sbb-button-color-hover-background: Highlight !important;--sbb-button-color-active-background: Highlight !important;--sbb-button-color-disabled-background: Canvas !important;--sbb-button-color-disabled-border: GrayText !important;--sbb-button-color-disabled-text: GrayText !important}}:host .sbb-datepicker-toggle{position:relative;transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:color;border-radius:var(--sbb-button-border-radius);color:var(--sbb-button-color-text);cursor:pointer;-webkit-user-select:none;user-select:none;display:flex}:host .sbb-datepicker-toggle:before{position:absolute;content:"";inset:0;border-radius:var(--sbb-button-border-radius);background-color:var(--sbb-button-color-default-background);transition-duration:var(--sbb-button-transition-duration);transition-timing-function:var(--sbb-button-transition-easing-function);transition-property:inset,background-color}sbb-icon{transition:transform var(--sbb-button-transition-duration) var(--sbb-button-transition-easing-function);transform:translateY(var(--sbb-button-translate-y-content-hover, 0rem));display:flex}:host([negative]){--sbb-button-color-text: var(--sbb-color-3-negative);--sbb-button-color-default-background: transparent;--sbb-button-color-hover-background: var(--sbb-background-color-3-negative);--sbb-button-color-active-background: var(--sbb-background-color-4-negative);--sbb-button-color-disabled-background: var(--sbb-background-color-3-negative);--sbb-button-color-disabled-border: var(--sbb-border-color-5);--sbb-button-color-disabled-text: var(--sbb-color-5)}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-datepicker-toggle{color:var(--sbb-button-color-disabled-text);cursor:default;pointer-events:none}:host(:is([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled])) .sbb-datepicker-toggle:before{background-color:var(--sbb-button-color-disabled-background);border:var(--sbb-button-border-disabled-width) var(--sbb-button-border-disabled-style) var(--sbb-button-color-disabled-border)}:host(:is([data-focus-visible],:focus-visible)) .sbb-datepicker-toggle:before{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width)}:host([data-focus-visible]){--sbb-focus-outline-style: initial}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover){--sbb-button-translate-y-content-hover: -.0625rem}}@media(any-hover:hover){:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled],:active,[data-active]):hover) .sbb-datepicker-toggle:before{background-color:var(--sbb-button-color-hover-background)}}:host(:not([disabled],:disabled,[disabled-interactive],[data-disabled],[data-group-disabled]):is(:active,[data-active])) .sbb-datepicker-toggle:before{background-color:var(--sbb-button-color-active-background)}.sbb-datepicker-toggle{margin:auto;-webkit-tap-highlight-color:transparent}`,(()=>{var e,t;let n=[s(`sbb-datepicker-toggle`)],r,o=[],c,l=Tu,u,d=[],f=[];return t=class extends l{constructor(){super(),Iu(this,e),this.iconName=`calendar-small`,Lu(this,e,a(this,d,null)),a(this,f),this.addEventListener?.(`click`,()=>{this.datepicker?.isOpen||this.datepicker?.open()})}get datepicker(){return Fu(this,e)}set datepicker(t){Lu(this,e,t)}connectedCallback(){super.connectedCallback(),this.internals.ariaLabel=Rn[this.language.current];let e=this.closest?.(`sbb-form-field`);e&&!this.hasAttribute(`datepicker`)&&(this.datepicker??=e.querySelector(`sbb-datepicker`))}requestUpdate(e,t,n){super.requestUpdate(e,t,n),e===`datepicker`&&this.datepicker&&this.datepicker.trigger!==this?this.datepicker.trigger=this:!e&&this.hasUpdated&&(this.internals.ariaLabel=Rn[this.language.current])}},e=new WeakMap,c=t,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(l[Symbol.metadata]??null):void 0;u=[ht(),A()],i(t,null,u,{kind:`accessor`,name:`datepicker`,static:!1,private:!1,access:{has:e=>`datepicker`in e,get:e=>e.datepicker,set:(e,t)=>{e.datepicker=t}},metadata:e},d,f),i(null,r={value:c},n,{kind:`class`,name:c.name,metadata:e},null,o),c=r.value,e&&Object.defineProperty(c,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t.styles=Ru,a(c,o),c})()})),Bu=e((()=>{yu(),Au(),Mu(),zu(),Du()})),Vu,Hu,Uu,Wu,Gu,Ku,qu=e((()=>{o(),oc(),I(),M(),B(),U(),G(),Mo(),Vu=e=>{throw TypeError(e)},Hu=(e,t,n)=>t.has(e)||Vu(`Cannot `+n),Uu=(e,t,n)=>(Hu(e,t,`read from private field`),n?n.call(e):t.get(e)),Wu=(e,t,n)=>t.has(e)?Vu(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Gu=(e,t,n,r)=>(Hu(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ku=h`*,:before,:after{box-sizing:border-box}:host{--sbb-toggle-option-cursor: pointer;--sbb-toggle-option-color: var(--sbb-color-anthracite);--sbb-toggle-option-color: light-dark(var(--sbb-color-anthracite), var(--sbb-color-cloud));--sbb-toggle-option-icon-min-size: var(--sbb-size-icon-ui-small);display:inline-block;overflow:hidden;outline:none!important}:host([checked]){--sbb-toggle-option-color: var(--sbb-color-2)}:host([disabled]){--sbb-toggle-option-cursor: unset;--sbb-toggle-option-color: var(--sbb-color-anthracite);--sbb-toggle-option-color: light-dark(var(--sbb-color-anthracite), var(--sbb-color-cloud))}.sbb-toggle-option{--sbb-text-font-size: var(--sbb-font-size-text-xs);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);font-weight:700;display:flex;justify-content:center;align-items:center;gap:var(--sbb-spacing-fixed-1x);height:var(--sbb-toggle-height);padding-inline:var(--sbb-toggle-padding-inline);color:var(--sbb-toggle-option-color);cursor:var(--sbb-toggle-option-cursor)}.sbb-toggle-option__label{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}sbb-icon,::slotted(sbb-icon){min-width:var(--sbb-toggle-option-icon-min-size);min-height:var(--sbb-toggle-option-icon-min-size)}`,(()=>{var e,t,n;let r=[s(`sbb-toggle-option`),$t()],o,c=[],l,u=V(Ao(pn(F))),d,f=[],p=[],m,h=[],g=[];return n=class extends u{constructor(){super(),Wu(this,e),Wu(this,t),Gu(this,e,a(this,f,!1)),Gu(this,t,(a(this,p),a(this,h,null))),this._toggle=(a(this,g),null),this.addEventListener?.(`input`,()=>this._handleInput()),this.addEventListener?.(`click`,()=>{!this.disabled&&!this.checked&&this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))}),this.addController(new ac(this,{skipInitial:!0,callback:()=>this._toggle?.updatePillPosition?.(!0)}))}get checked(){return Uu(this,e)}set checked(t){Gu(this,e,t)}get value(){return Uu(this,t)}set value(e){Gu(this,t,e)}connectedCallback(){super.connectedCallback(),this._toggle=this.closest?.(`sbb-toggle`)??null,this._verifyTabindex(),this._toggle?.updatePillPosition?.(!0)}disconnectedCallback(){super.disconnectedCallback(),this._toggle=null}firstUpdated(e){super.firstUpdated(e),this._toggle?.updatePillPosition?.(!0)}willUpdate(e){super.willUpdate(e),e.has(`checked`)&&(this.internals.ariaChecked=`${this.checked}`,this._verifyTabindex(),this.checked&&this._uncheckOtherOptions()),e.has(`disabled`)&&this._handleDisabledChange()}_uncheckOtherOptions(){this._toggle?.options.filter(e=>e!==this).forEach(e=>e.checked=!1),this._toggle?.statusChanged()}_handleDisabledChange(){cr(this,`aria-disabled`,this.disabled?`true`:null),this._verifyTabindex()}_handleInput(){this.disabled||(this.checked=!0,this._uncheckOtherOptions())}_verifyTabindex(){this.tabIndex=this.checked&&!this.disabled?0:-1}render(){return N`
      <div class="sbb-toggle-option">
        ${this.renderIconSlot()}
        <span class="sbb-toggle-option__label">
          <slot></slot>
        </span>
      </div>
    `}},e=new WeakMap,t=new WeakMap,l=n,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(u[Symbol.metadata]??null):void 0;d=[L(),A({reflect:!0,type:Boolean})],m=[A()],i(n,null,d,{kind:`accessor`,name:`checked`,static:!1,private:!1,access:{has:e=>`checked`in e,get:e=>e.checked,set:(e,t)=>{e.checked=t}},metadata:e},f,p),i(n,null,m,{kind:`accessor`,name:`value`,static:!1,private:!1,access:{has:e=>`value`in e,get:e=>e.value,set:(e,t)=>{e.value=t}},metadata:e},h,g),i(null,o={value:l},r,{kind:`class`,name:l.name,metadata:e},null,c),l=o.value,e&&Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.role=`radio`,n.styles=Ku,a(l,c),l})()})),Ju=e((()=>{qu()})),Yu,Xu,Zu,Qu,$u,ed,td=e((()=>{o(),I(),M(),gi(),B(),U(),G(),Ju(),Yu=e=>{throw TypeError(e)},Xu=(e,t,n)=>t.has(e)||Yu(`Cannot `+n),Zu=(e,t,n)=>(Xu(e,t,`read from private field`),n?n.call(e):t.get(e)),Qu=(e,t,n)=>t.has(e)?Yu(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),$u=(e,t,n,r)=>(Xu(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),ed=h`*,:before,:after{box-sizing:border-box}:host{display:block;width:fit-content;border-radius:var(--sbb-toggle-border-radius);--sbb-toggle-width: fit-content;--sbb-toggle-min-width: calc( var(--sbb-toggle-padding-inline) * 4 + var(--sbb-size-icon-ui-small) );--sbb-toggle-selected-option-border-width: var(--sbb-border-width-1x);--sbb-toggle-selected-option-border-style: solid;--sbb-toggle-selected-option-border-color: var(--sbb-border-color-5);--sbb-toggle-selected-option-background-color: var(--sbb-background-color-1);--sbb-toggle-background-inset: .125rem;--sbb-toggle-padding-inline: var(--sbb-spacing-responsive-xs);--sbb-toggle-animation-duration: var( --sbb-disable-animation-duration, var(--sbb-animation-duration-6x) );--sbb-toggle-height: var(--sbb-size-element-m);--sbb-toggle-border-radius: var(--sbb-border-radius-infinity);--sbb-toggle-grid-template-columns: auto auto}@media(forced-colors:active){:host{--sbb-toggle-selected-option-border-color: Highlight;--sbb-toggle-selected-option-border-width: var(--sbb-border-width-2x)}}:host([even]){width:100%;--sbb-toggle-width: 100%;--sbb-toggle-grid-template-columns: 50% 50%}:host(:disabled){--sbb-toggle-selected-option-border-color: var(--sbb-color-graphite);--sbb-toggle-selected-option-border-color: light-dark( var(--sbb-color-graphite), var(--sbb-color-smoke) );--sbb-toggle-selected-option-border-style: dashed}@media(forced-colors:active){:host(:disabled){--sbb-toggle-selected-option-border-style: solid;--sbb-toggle-selected-option-border-color: GrayText}}:host([size=s]){--sbb-toggle-padding-inline: var(--sbb-spacing-responsive-xxxs);--sbb-toggle-height: var(--sbb-size-element-xxs)}:host(:is(:not([data-initialized]),[data-disable-animation-on-resizing])){--sbb-disable-animation-duration: 0s}.sbb-toggle{--sbb-text-font-size: var(--sbb-font-size-text-m);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);display:grid;grid-template-columns:var(--sbb-toggle-grid-template-columns);grid-template-areas:"start end";align-items:center;min-width:var(--sbb-toggle-min-width);width:var(--sbb-toggle-width);height:var(--sbb-toggle-height);max-width:100%;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;border-radius:var(--sbb-toggle-border-radius)}.sbb-toggle:before{content:"";display:block;grid-area:start/start/end/end;margin-inline:var(--sbb-toggle-option-left, 0) var(--sbb-toggle-option-right, 0);background-color:var(--sbb-toggle-selected-option-background-color);border-radius:var(--sbb-toggle-border-radius);max-width:100%;height:100%;border:var(--sbb-toggle-selected-option-border-width) var(--sbb-toggle-selected-option-border-style) var(--sbb-toggle-selected-option-border-color);transition-duration:var(--sbb-toggle-animation-duration);transition-timing-function:ease;transition-property:margin-inline-start,margin-inline-end}.sbb-toggle:after{content:"";grid-area:start/start/end/end;order:-1;background:var(--sbb-background-color-4);margin-inline:var(--sbb-toggle-background-inset);height:calc(100% - 2 * var(--sbb-toggle-background-inset));border-radius:var(--sbb-toggle-border-radius)}@media(forced-colors:active){.sbb-toggle:after{border:var(--sbb-border-width-1x) solid CanvasText}}::slotted(sbb-toggle-option:first-of-type){grid-area:start}::slotted(sbb-toggle-option:last-of-type){grid-area:end}`,(()=>{var e,t,n;let r=[s(`sbb-toggle`)],o,c=[],l,u=V(Er(pn(F))),d=[],f,p=[],m=[],h,g=[],_=[],v;return n=class extends u{constructor(){super(),Qu(this,e),Qu(this,t),$u(this,e,(a(this,d),a(this,p,!1))),$u(this,t,(a(this,m),a(this,g,or()?`s`:`m`))),this._fallbackValue=(a(this,_),null),this.addEventListener?.(`input`,()=>this._handleInput(),{passive:!0}),this.addEventListener?.(`keydown`,e=>this._handleKeyDown(e))}get even(){return Zu(this,e)}set even(t){$u(this,e,t)}get size(){return Zu(this,t)}set size(e){$u(this,t,e)}set value(e){this.hasUpdated?this._valueChanged(e):this._fallbackValue=e}get value(){return this.options.find(e=>e.checked)?.value??this.options[0]?.value??null}get options(){return Array.from(this.querySelectorAll?.(`sbb-toggle-option`)??[])}willUpdate(e){super.willUpdate(e),(e.has(`disabled`)||e.has(`formDisabled`))&&this._updateDisabled(),this.hasUpdated||this._valueChanged(this._fallbackValue)}statusChanged(){this.updateFormValue(),this.updatePillPosition()}formResetCallback(){this.value=this.hasAttribute(`value`)?this.getAttribute(`value`):null}formStateRestoreCallback(e,t){typeof e==`string`||e==null?this.value=e??null:e instanceof FormData&&this._readFormData(e).then(e=>{this.value=e})}async _readFormData(e){let t=e.get(this.name);return t instanceof Blob?JSON.parse(await t.text()):t}updatePillPosition(e=!1){let t=this.options,n=this.shadowRoot?.querySelector(`.sbb-toggle`);if(t.length<2||!n||t.every(e=>!e.checked)||t.every(e=>!e.clientWidth))return;this.toggleAttribute(`data-disable-animation-on-resizing`,e);let r=t[0],i=r.checked,a=i?`0px`:`${r.clientWidth}px`,o=i?`${n.clientWidth-r.clientWidth}px`:`0px`;o===`0px`&&a===`0px`||(this.style?.setProperty(`--sbb-toggle-option-left`,a),this.style?.setProperty(`--sbb-toggle-option-right`,o),this.offsetWidth,this.toggleAttribute(`data-initialized`,!0))}_updateToggle(){this._valueChanged(this.value),this._updateDisabled()}_valueChanged(e){let t=this.options,n=t.find(t=>e===t.value)??t.find(e=>e.checked)??t[0];n&&(n.checked=!0,this.statusChanged())}_updateDisabled(){for(let e of this.options)e.disabled=this.disabled||this.formDisabled}_handleInput(){this.statusChanged(),this.dispatchEvent(new Event(`change`,{bubbles:!0}))}_handleKeyDown(e){let t=this.options.filter(e=>!e.disabled&&ci.isVisible(e));if(!(!t||e.target!==this&&e.target.parentElement!==this)&&Mr(e)){let n=Ir(e,t.findIndex(e=>e.checked),t.length);t[n].checked||(t[n].checked=!0,t[n].focus(),t[n].dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))),e.preventDefault()}}render(){return N`
      <div class="sbb-toggle">
        <slot @slotchange=${this._updateToggle}></slot>
      </div>
    `}},e=new WeakMap,t=new WeakMap,l=n,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(u[Symbol.metadata]??null):void 0;f=[L(),A({reflect:!0,type:Boolean})],h=[A({reflect:!0})],v=[A()],i(n,null,f,{kind:`accessor`,name:`even`,static:!1,private:!1,access:{has:e=>`even`in e,get:e=>e.even,set:(e,t)=>{e.even=t}},metadata:e},p,m),i(n,null,h,{kind:`accessor`,name:`size`,static:!1,private:!1,access:{has:e=>`size`in e,get:e=>e.size,set:(e,t)=>{e.size=t}},metadata:e},g,_),i(n,null,v,{kind:`setter`,name:`value`,static:!1,private:!1,access:{has:e=>`value`in e,set:(e,t)=>{e.value=t}},metadata:e},null,d),i(null,o={value:l},r,{kind:`class`,name:l.name,metadata:e},null,c),l=o.value,e&&Object.defineProperty(l,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.role=`radiogroup`,n.styles=ed,n.events={change:`change`},a(l,c),l})()})),nd=e((()=>{td(),qu()})),rd,id,ad,od,sd,cd=e((()=>{o(),I(),M(),gi(),z(),H(),G(),rd=h`*,:before,:after{box-sizing:border-box}:host{display:inline-flex;min-width:var(--sbb-time-input-max-width);max-width:var(--sbb-time-input-max-width);cursor:text;align-items:center}@media(forced-colors:active){:host{color:FieldText}}:host(:disabled){cursor:default}:host(:focus){text-overflow:initial!important}:host(:empty):after{content:attr(placeholder);color:var(--sbb-color-5);-webkit-text-fill-color:var(--sbb-color-5);opacity:1}@media(forced-colors:active){:host(:empty):after{color:GrayText}}`,id=/[0-9.:,\-;_hH]/,ad=/[^0-9.:,\-;_hH]/g,od=/^([0-9]{1,2})([0-9]{2})$/,sd=/^([0-9]{1,2})?[.:,\-;_hH]?([0-9]{1,2})?$/,(()=>{var e;let t=[s(`sbb-time-input`)],n,r=[],o,c=Ei(F),l=[],u;return e=class extends c{set value(e){e=typeof e==`string`?e.replace(ad,``).substring(0,5):``,this._tryParseValue(e),!this.matches(`:focus`)&&this.valueAsDate!==null&&(e=this._formatTime()),super.value=e}get value(){return super.value??``}set valueAsDate(e){if(e instanceof Date&&!isNaN(e.valueOf())){this._valueAsTime={hours:e.getHours(),minutes:e.getMinutes()};let t=this._formatTime();this.value!==t&&(this.value=t)}else this._valueAsTime=null,this.value=``}get valueAsDate(){if(this._valueAsTime&&this._isTimeValid(this._valueAsTime)){let e=new Date(0);return e.setHours(this._valueAsTime.hours),e.setMinutes(this._valueAsTime.minutes),e}else return null}get empty(){return!this.value||this.value.trim()===``}constructor(){super(),this._valueAsTime=a(this,l),this._language=new R(this),this.addEventListener?.(`change`,()=>this._updateValueDateFormat(),{capture:!0}),this.addEventListener?.(`change`,()=>mi.announce(Kn(this.value)[this._language.current])),this.addEventListener?.(`keydown`,e=>this._preventCharInsert(e))}connectedCallback(){super.connectedCallback(),this.inputMode||=`numeric`,this.placeholder||=`HH:MM`}disconnectedCallback(){super.disconnectedCallback()}updateFormValue(){this._tryParseValue();let e=this.valueAsDate===null?null:this._formatTime();this.internals.setFormValue(e,this.value)}_tryParseValue(e=this.value){this._valueCache?.[0]!==e&&(this._valueAsTime=this._parseValue(e),this._valueCache=[e,this._valueAsTime??null])}_parseValue(e){let t=e?.trim();if(!t)return null;let n=t.match(od)??t.match(sd);return n?{hours:+n[1]||0,minutes:+n[2]||0}:null}_updateValueDateFormat(){if(this.valueAsDate){let e=this._formatTime();this.value!==e&&(super.value=e)}}_formatTime(){let e=this.valueAsDate;return e?`${String(e.getHours()).padStart(2,`0`)}:${String(e.getMinutes()).padStart(2,`0`)}`:``}preparePastedText(e){return e.replace(ad,``).substring(0,5-(this.textContent?.length??0))}shouldValidate(e){return super.shouldValidate(e)||[`valueAsDate`,`min`,`max`,`dateFilter`].includes(e)}validate(){super.validate(),this.value?this._valueAsTime?this._isTimeValid(this._valueAsTime)?this._removeValidityErrors():this.setValidityFlag(`rangeOverflow`,Jn[this.language.current]):this.setValidityFlag(`badInput`,qn[this.language.current]):this._removeValidityErrors()}_removeValidityErrors(){[`badInput`,`rangeOverflow`].forEach(e=>this.removeValidityFlag(e))}_isTimeValid(e){return e.hours<24&&e.minutes<60}_preventCharInsert(e){e.ctrlKey||e.altKey||e.metaKey||[`Backspace`,`Tab`,`Enter`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`PageUp`,`PageDown`,`Delete`].includes(e.key)||id.test(e.key)&&(this.value.length<5||this._hasSelection())||(e.preventDefault(),this.value.length>=5&&mi.announce(Yn[this._language.current]))}_hasSelection(){let e=window.getSelection()?.getRangeAt(0);return!!e&&e.startOffset!==e.endOffset}},o=e,(()=>{let a=typeof Symbol==`function`&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;u=[A({attribute:!1})],i(e,null,u,{kind:`setter`,name:`valueAsDate`,static:!1,private:!1,access:{has:e=>`valueAsDate`in e,set:(e,t)=>{e.valueAsDate=t}},metadata:a},null,l),i(null,n={value:o},t,{kind:`class`,name:o.name,metadata:a},null,r),o=n.value,a&&Object.defineProperty(o,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:a})})(),e.styles=rd,a(o,r),o})()})),ld=e((()=>{cd()})),ud,dd,fd,pd,md,hd,gd=e((()=>{o(),M(),wa(),q(),I(),Ni(),ud=e=>{throw TypeError(e)},dd=(e,t,n)=>t.has(e)||ud(`Cannot `+n),fd=(e,t,n)=>(dd(e,t,`read from private field`),n?n.call(e):t.get(e)),pd=(e,t,n)=>t.has(e)?ud(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),md=(e,t,n,r)=>(dd(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),hd=h`@charset "UTF-8";*,:before,:after{box-sizing:border-box}:host{display:inline-block;outline:none!important;--sbb-teaser-scale-hover: 1.02;--sbb-teaser-description-color: var(--sbb-color-granite);--sbb-teaser-description-color: light-dark(var(--sbb-color-granite), var(--sbb-color-silver));--sbb-teaser-flex-direction: row;--sbb-teaser-align-items: center;--sbb-teaser-gap: var(--sbb-spacing-fixed-4x);--sbb-teaser-width: fit-content;--sbb-teaser-border-radius: var(--sbb-border-radius-4x)}@media(forced-colors:active){:host{--sbb-teaser-description-color: LinkText;--sbb-title-text-color-normal-override: LinkText !important}}:host([alignment=after]){--sbb-teaser-align-items: start}:host([alignment=below]){--sbb-teaser-flex-direction: column;--sbb-teaser-align-items: baseline;--sbb-teaser-gap: var(--sbb-spacing-fixed-3x);--sbb-teaser-width: 100%}@media(any-hover:hover){:host(:hover){--sbb-teaser-scale: var(--sbb-teaser-scale-hover)}}.sbb-teaser__wrapper{display:flex;position:relative;cursor:pointer}.sbb-teaser__wrapper:before{content:"​";-webkit-user-select:none;user-select:none;width:0;height:0}.sbb-teaser{text-decoration:none;position:absolute;inset:0}.sbb-teaser:focus-visible{outline-offset:var(--sbb-focus-outline-offset);outline:var(--sbb-focus-outline-color) var(--sbb-focus-outline-style, solid) var(--sbb-focus-outline-width);border-radius:var(--sbb-teaser-border-radius)}@media(forced-colors:active){.sbb-teaser{outline-offset:var(--sbb-focus-outline-offset);outline:CanvasText solid var(--sbb-focus-outline-width);border-radius:var(--sbb-teaser-border-radius)}.sbb-teaser:hover{outline-color:Highlight}}.sbb-teaser__container{display:flex;flex-flow:var(--sbb-teaser-flex-direction) nowrap;align-items:var(--sbb-teaser-align-items);gap:var(--sbb-teaser-gap);max-width:100%;width:100%;pointer-events:none}.sbb-teaser__text{--sbb-text-font-size: var(--sbb-font-size-text-s);font-family:var(--sbb-typo-font-family);font-weight:400;line-height:var(--sbb-typo-line-height-body-text);letter-spacing:var(--sbb-typo-letter-spacing-body-text);font-size:var(--sbb-text-font-size);color:var(--sbb-teaser-description-color);overflow:hidden;max-width:100%}::slotted([slot=image]){width:18.75rem;display:block}.sbb-teaser__image-wrapper{flex-shrink:0;overflow:hidden;border-radius:var(--sbb-teaser-border-radius);transition:box-shadow var(--sbb-teaser-image-animation-duration) var(--sbb-animation-easing)}@media(any-hover:hover){:host(:hover) .sbb-teaser__image-wrapper{box-shadow:var(--sbb-shadow-elevation-level-9-shadow-2-offset-x) var(--sbb-shadow-elevation-level-9-shadow-2-offset-y) var(--sbb-shadow-elevation-level-9-shadow-2-blur) var(--sbb-shadow-elevation-level-9-shadow-2-spread) var(--sbb-shadow-color-hard-2),var(--sbb-shadow-elevation-level-9-shadow-1-offset-x) var(--sbb-shadow-elevation-level-9-shadow-1-offset-y) var(--sbb-shadow-elevation-level-9-shadow-1-blur) var(--sbb-shadow-elevation-level-9-shadow-1-spread) var(--sbb-shadow-color-hard-1)}}.sbb-teaser__description{display:inline-block;margin:0;padding:0}::slotted(sbb-chip-label){display:block;max-width:fit-content;margin-block-end:var(--sbb-spacing-fixed-1x)}::slotted(sbb-title){margin-block:0}`,(()=>{var e,t;let n=[s(`sbb-teaser`)],r,o=[],c,l=pa,u,d=[],f=[];return t=class extends l{constructor(){super(...arguments),pd(this,e,a(this,d,`after-centered`)),a(this,f)}get alignment(){return fd(this,e)}set alignment(t){md(this,e,t)}_handleSlotchange(){let e=Array.from(this.children).find(e=>e.localName===`sbb-chip-label`);e&&(e.slot=`chip`);let t=Array.from(this.children).find(e=>e.localName===`sbb-title`);t&&(t.slot=`title`)}_configureChip(e){let t=e.target.assignedElements().find(e=>e.localName===`sbb-chip-label`);t&&(customElements.upgrade(t),t.color=`charcoal`,t.size=`xxs`)}_configureTitle(e){let t=e.target.assignedElements().find(e=>e.localName===`sbb-title`);t&&(customElements.upgrade(t),t.visualLevel=`5`)}render(){return Sa`
      <div class="sbb-teaser__wrapper">
        ${this.renderLink(Sa`<sbb-screen-reader-only>${this.accessibilityLabel}</sbb-screen-reader-only>`)}
        ${this.renderContent()}
      </div>
    `}renderContent(){return Sa`
      <span class="sbb-teaser__container">
        <span class="sbb-teaser__image-wrapper">
          <slot name="image"></slot>
        </span>
        <span class="sbb-teaser__text">
          <slot name="chip" @slotchange=${this._configureChip}></slot>
          <slot name="title" @slotchange=${this._configureTitle}></slot>
          <p class="sbb-teaser__description">
            <slot @slotchange=${this._handleSlotchange}></slot>
          </p>
        </span>
      </span>
    `}},e=new WeakMap,c=t,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(l[Symbol.metadata]??null):void 0;u=[A({reflect:!0})],i(t,null,u,{kind:`accessor`,name:`alignment`,static:!1,private:!1,access:{has:e=>`alignment`in e,get:e=>e.alignment,set:(e,t)=>{e.alignment=t}},metadata:e},d,f),i(null,r={value:c},n,{kind:`class`,name:c.name,metadata:e},null,o),c=r.value,e&&Object.defineProperty(c,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t.styles=hd,a(c,o),c})()})),_d=e((()=>{gd()})),vd,yd,bd,xd,Sd,Cd,wd,Td=e((()=>{o(),I(),M(),wa(),G(),vd=e=>{throw TypeError(e)},yd=(e,t,n)=>t.has(e)||vd(`Cannot `+n),bd=(e,t,n)=>(yd(e,t,`read from private field`),n?n.call(e):t.get(e)),xd=(e,t,n)=>t.has(e)?vd(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Sd=(e,t,n,r)=>(yd(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Cd=h`*,:before,:after{box-sizing:border-box}:host{margin-block:var(--sbb-title-margin-block-start, 0) var(--sbb-title-margin-block-end, 0);margin-inline:0;font-family:var(--sbb-typo-font-family);font-weight:700;line-height:var(--sbb-title-line-height, var(--sbb-typo-line-height-titles));letter-spacing:var(--sbb-typo-letter-spacing-titles);font-size:var(--sbb-title-font-size);--sbb-title-text-color-normal: var(--sbb-title-text-color-normal-override, var(--sbb-color-3));display:block;color:var(--sbb-title-text-color-normal)}:host([id]){scroll-margin-block-start:var(--sbb-spacing-fixed-10x)}:host(:where([level="1"]:not([visual-level]),[visual-level="1"])){--sbb-title-font-size: var(--sbb-title-font-size-level-1)}:host(:where([level="2"]:not([visual-level]),[visual-level="2"])){--sbb-title-font-size: var(--sbb-title-font-size-level-2)}:host(:where([level="3"]:not([visual-level]),[visual-level="3"])){--sbb-title-font-size: var(--sbb-title-font-size-level-3)}:host(:where([level="4"]:not([visual-level]),[visual-level="4"])){--sbb-title-font-size: var(--sbb-title-font-size-level-4)}:host(:where([level="5"]:not([visual-level]),[visual-level="5"])){--sbb-title-font-size: var(--sbb-title-font-size-level-5)}:host(:where([level="6"]:not([visual-level]),[visual-level="6"])){--sbb-title-font-size: var(--sbb-title-font-size-level-6);--sbb-title-line-height: var(--sbb-typo-line-height-body-text)}`,wd=(()=>{var e,t,n;let r=pn(F),o,s=[],c=[],l,u=[],d=[];return n=class extends r{constructor(){super(...arguments),xd(this,e,a(this,s,`1`)),xd(this,t,(a(this,c),a(this,u,null))),a(this,d)}get level(){return bd(this,e)}set level(t){Sd(this,e,t)}get visualLevel(){return bd(this,t)}set visualLevel(e){Sd(this,t,e)}willUpdate(e){super.willUpdate(e),e.has(`level`)&&(this.internals.ariaLevel=this.level)}render(){return Sa`<slot></slot>`}},e=new WeakMap,t=new WeakMap,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;o=[A({reflect:!0})],l=[A({attribute:`visual-level`,reflect:!0})],i(n,null,o,{kind:`accessor`,name:`level`,static:!1,private:!1,access:{has:e=>`level`in e,get:e=>e.level,set:(e,t)=>{e.level=t}},metadata:e},s,c),i(n,null,l,{kind:`accessor`,name:`visualLevel`,static:!1,private:!1,access:{has:e=>`visualLevel`in e,get:e=>e.visualLevel,set:(e,t)=>{e.visualLevel=t}},metadata:e},u,d),e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.role=`heading`,n.styles=Cd,n})()})),Ed,Dd,Od,kd,Ad,jd,Md=e((()=>{o(),M(),G(),Td(),I(),Ed=e=>{throw TypeError(e)},Dd=(e,t,n)=>t.has(e)||Ed(`Cannot `+n),Od=(e,t,n)=>(Dd(e,t,`read from private field`),n?n.call(e):t.get(e)),kd=(e,t,n)=>t.has(e)?Ed(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Ad=(e,t,n,r)=>(Dd(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),jd=h`:host([negative]){--sbb-title-text-color-normal: var(--sbb-color-3-negative)}:host(:where([level="1"]:not([visual-level]),[visual-level="1"])){--sbb-title-margin-block-start: var(--sbb-title-margin-block-start-level-1);--sbb-title-margin-block-end: var(--sbb-title-margin-block-end-level-1)}:host(:where([level="2"]:not([visual-level]),[visual-level="2"])){--sbb-title-margin-block-start: var(--sbb-title-default-margin-block-start);--sbb-title-margin-block-end: var(--sbb-title-margin-block-end-level-2)}:host(:where([level="3"]:not([visual-level]),[visual-level="3"])){--sbb-title-margin-block-start: var(--sbb-title-default-margin-block-start);--sbb-title-margin-block-end: var(--sbb-title-margin-block-end-level-3)}:host(:where([level="4"]:not([visual-level]),[visual-level="4"])){--sbb-title-margin-block-start: var(--sbb-title-default-margin-block-start);--sbb-title-margin-block-end: var(--sbb-title-margin-block-end-level-4)}:host(:where([level="5"]:not([visual-level]),[visual-level="5"])){--sbb-title-margin-block-start: var(--sbb-title-default-margin-block-start);--sbb-title-margin-block-end: var(--sbb-title-margin-block-end-level-5)}:host(:where([level="6"]:not([visual-level]),[visual-level="6"])){--sbb-title-margin-block-start: var(--sbb-title-default-margin-block-start);--sbb-title-margin-block-end: var(--sbb-title-margin-block-end-level-6)}`,(()=>{var e,t;let n=[s(`sbb-title`)],r,o=[],c,l=W(wd),u,d=[],f=[];return t=class extends l{constructor(){super(...arguments),kd(this,e,a(this,d,null)),a(this,f)}get visualLevel(){return Od(this,e)}set visualLevel(t){Ad(this,e,t)}},e=new WeakMap,c=t,(()=>{let e=typeof Symbol==`function`&&Symbol.metadata?Object.create(l[Symbol.metadata]??null):void 0;u=[A({attribute:`visual-level`,reflect:!0})],i(t,null,u,{kind:`accessor`,name:`visualLevel`,static:!1,private:!1,access:{has:e=>`visualLevel`in e,get:e=>e.visualLevel,set:(e,t)=>{e.visualLevel=t}},metadata:e},d,f),i(null,r={value:c},n,{kind:`class`,name:c.name,metadata:e},null,o),c=r.value,e&&Object.defineProperty(c,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),t.styles=[wd.styles,jd],a(c,o),c})()})),Nd=e((()=>{Md(),Td()})),Pd,Fd=e((()=>{Pd=`﻿stations\r
Aadorf\r
Aadorf, Bahnhof\r
Aadorf, Zentrum\r
Aadorf, Matthofstrasse\r
Aadorf, Morgental\r
Aarau, Achenbergstrasse\r
Aarau, Sonnmattweg\r
Aarau, Schanz\r
Aarau, Roggenhausen\r
Aarau, Allmendweg\r
Aarau, Keba/Brügglifeld\r
Aarau, Käfergrund\r
Aarau, Ifang\r
Aarau, Friedhof\r
Aarau, Dufourstrasse\r
Aarau, Aarepark\r
Aarau, Binzenhof\r
Aarau, Berufsschule\r
Aarau, Dossenstrasse\r
Aarau, Dammweg\r
Aarau, Kantonsspital\r
Aarau, Herzogplatz\r
Aarau, Signalstrasse\r
Aarau, Hintere Bahnhofstrasse\r
Aarau, Delfterstrasse\r
Aarau, Buchenhof\r
Aarau, Pestalozzistrasse\r
Aarau, Wöschnauring\r
Aarau, Wasserfluhweg\r
Aarau, Wallerplatz\r
Aarau, Tellizentrum\r
Aarau, Neue Kantonsschule\r
Aarau, Amthaus\r
Aarau, Hans-Hässig-Strasse\r
Aarau, Gais\r
Aarau, Obere Vorstadt\r
Aarau, Hirslanden Klinik\r
Aarau, Binzenhofstrasse\r
Aarau\r
Aarau, Kunsthaus\r
Aarau, Heinerich-Wirri-Strasse\r
Aarau, Neumattstrasse\r
Aarau, Tannerstrasse\r
Aarau, Kantonsspital Ost\r
Aarau, Bahnhof\r
Aarau, Kettenbrücke\r
Aarau, Aarenau\r
Aarau, Alte Badanstalt\r
Aarau, Rathaus\r
Aarau, Holzmarkt\r
Aarau, General-Guisan-Strasse\r
Aarau Rohr, Rigistrasse\r
Aarau Rohr, Unterdorf\r
Aarau Rohr, Quellhölzli\r
Aarau Rohr, Salamatt\r
Aarau Rohr, Furorastrasse\r
Aarau Rohr, Gemeindehaus\r
Aarau Torfeld\r
Aarberg, Aarezelg\r
Aarberg, Schwimmbad\r
Aarberg, Post/Bahnhof\r
Aarberg, Spital\r
Aarberg, Bernfeld\r
Aarberg, Scheueracker\r
Aarberg, Bielstr/Friedhof\r
Aarberg, Nidaustrasse\r
Aarberg\r
Aarberg, Bifang\r
Aarberg, Murtenstrasse\r
Aarburg, Längacker\r
Aarburg, Höhe\r
Aarburg, Stadtgarten\r
Aarburg, Kloosmatte\r
Aarburg, Alter Friedhof\r
Aarburg, Städtli\r
Aarburg-Oftringen, Bahnhof\r
Aarburg-Oftringen\r
Aareschlucht, Ost\r
Aareschlucht Ost (Bahn)\r
Aareschlucht West\r
Aarwangen\r
Aarwangen Schloss\r
Aarwangen Vorstadt\r
Aathal\r
Abländschen, Jaungrund\r
Abländschen, Mittelberg\r
Abländschen, Chappelematte\r
Abländschen, Hubel\r
Abländschen, Zitbödeli\r
Abländschen, Ganderli\r
Abtwil AG, Auwerstrasse\r
Abtwil AG, Langegg\r
Abtwil AG, Hofmatt\r
Abtwil SG, Hüslenweg\r
Abtwil SG, Grund\r
Abtwil SG, Dorf\r
Abtwil SG, Ausserdorf\r
Abtwil SG, Wiesenbach/Cinedome\r
Abtwil SG, St. Josefen\r
Abtwil SG, Sonnenberg\r
Abtwil SG, Gemeindehaus\r
Abtwil SG, Friedhof\r
Abtwil SG, Säntispark\r
Abtwil SG, Dufourpark\r
Abtwil SG, Zentrumpark\r
Abtwil SG, Farnen\r
Achseten, Schmitten\r
Achseten, Tregel\r
Achseten, Bettbach\r
Achseten, Kirche\r
Achseten, Elsigbach/Luftseilb.\r
Achseten, Bönigen\r
Achseten, Höchst/Skilift\r
Achseten, Hoher Steg\r
Achseten, Marchbach\r
Acla da Fontauna, center sport\r
Acla da Fontauna\r
Aclens, collège\r
Acquacalda\r
Acquarossa, Casa Anziani\r
Acquarossa, Ospedale\r
Acquarossa, Scuole\r
Acquarossa-Comprovasco\r
Adelboden, Gulli\r
Adelboden, Heinrichseggen\r
Adelboden, Unter dem Birg\r
Adelboden, Rainweg\r
Adelboden, Hirschen\r
Adelboden, Schönbühl\r
Adelboden, Janz Team\r
Adelboden, Bollersgraben\r
Adelboden, Dürrenegge\r
Adelboden, Mühleport\r
Adelboden, Brügge\r
Adelboden, Schlegeli Hari\r
Adelboden, Geils\r
Adelboden, Chäli\r
Adelboden, Oey\r
Adelboden, Post\r
Adelboden, Tannermatte\r
Adelboden, Schreiner Bärtschi\r
Adelboden, Jugendh. Heilsarmee\r
Adelboden, Zürcherhaus\r
Adelboden, Wegscheide\r
Adelboden, Boden Wendeplatz\r
Adelboden, Schermtanne\r
Adelboden, Ausserschwand\r
Adelboden, Margeli\r
Adelboden, Raufmatte\r
Adelboden, Neuweg\r
Adelboden, Schlegeli Crystal\r
Adelboden, Bergläger\r
Adelboden, Altersheim\r
Adelboden, Dorf Sillerenbahn\r
Adelboden, Unter der Fluh\r
Adelboden, Hirzboden\r
Adelboden, Mudi\r
Adelboden, Gilbach des Alpes\r
Adelboden, Mineralquelle\r
Adelboden, Falkiport\r
Adelboden, Kreuzgasse\r
Adelboden, Hotel Alpina\r
Adelboden (Tschentenbahn)\r
Adelboden Aebi (Silleren)\r
Adelboden Bergläger (Höchsth.)\r
Adelboden Bergläger (Silleren)\r
Adelboden Bode (Chuenisbärgli)\r
Adelboden Dorf (Silleren)\r
Adelboden Eselmoos (Silleren)\r
Adelboden Geils (Hahnenmoos)\r
Adelboden Geils (Laveygrat)\r
Adelboden Geils (Luegli)\r
Adelboden Oey (Sillerenbahn)\r
Adetswil, Frowiesstrasse\r
Adetswil, Sunneberg\r
Adligenswil, Chliäbnet\r
Adligenswil, Sagi\r
Adligenswil, Rigiblick\r
Adligenswil, Dorf\r
Adligenswil, Luegisland\r
Adligenswil, Blatte\r
Adligenswil, Widspüel\r
Adligenswil, Stuben\r
Adlikon b. Andelfingen\r
Adlikon b. R., Sonnhalde\r
Adlikon b. R., Sonnhalde West\r
Adlikon b. R., Leematten\r
Adlikon b. R., Dorf\r
Adlikon b. R., Ziegelhütte\r
Adlikon b. R., Pächterried\r
Adliswil, Bodenacker\r
Adliswil, Schulhaus Kopfholz\r
Adliswil, Ahornweg\r
Adliswil, Rifertstrasse\r
Adliswil, Grüt\r
Adliswil, Badstrasse\r
Adliswil, Büchel\r
Adliswil, Zopf\r
Adliswil, Moos\r
Adliswil, Feldblumenstrasse\r
Adliswil, Hofackerstrasse\r
Adliswil, Poststrasse\r
Adliswil, Baldernstrasse\r
Adliswil, Rütistrasse/Wacht\r
Adliswil, Landolt-Junker-Str.\r
Adliswil, Wanneten-/Haldenstr.\r
Adliswil, Tiefacker\r
Adliswil\r
Adliswil, Bahnhof\r
Adliswil, Tobelhof\r
Adliswil, Dietlimoos\r
Adliswil, Friedhof\r
Adliswil, Grundstrasse\r
Adliswil, Krone\r
Adliswil, Sunnau\r
Adliswil (Luftseilbahnstation)\r
Aedermannsdorf, Güggel\r
Aedermannsdorf, Dorfplatz\r
Aedermannsdorf, Staatsstrasse\r
Aefligen, Bahnhof\r
Aefligen\r
Aefligen, Gemeindehaus\r
Aegerten, Stockfeld\r
Aegerten, Salismatte\r
Aegerten, Jurastrasse\r
Aemsigen\r
Aesch (Neftenbach)\r
Aesch bei Maur, Zollingerheim\r
Aesch bei Maur, Im Brünneli\r
Aesch bei Maur, Hellstrasse\r
Aesch BL, Herrenweg\r
Aesch BL, Neumatt\r
Aesch BL, Sportanl Löhrenacker\r
Aesch BL, Arlesheimerstrasse\r
Aesch BL, Alterszentrum\r
Aesch BL, Schützenmattschule\r
Aesch BL, Dorf\r
Aesch BL, Schwimmbad\r
Aesch BL, Schürhof\r
Aesch BL, Bahnhof\r
Aesch BL, Gewerbestrasse\r
Aesch BL, Höhenweg\r
Aesch BL, Sonnenweg\r
Aesch BL, Landskronstrasse\r
Aesch BL, Butthollen\r
Aesch BL\r
Aesch LU, Kreuz\r
Aesch LU, Vorderdorf\r
Aesch LU, Berg\r
Aesch LU (See)\r
Aesch ZH, Gemeindehaus\r
Aesch ZH, Heligenmattstrasse\r
Aeschau, Dorf\r
Aeschau, Gärtnerei\r
Aeschau, Horben Schmiede\r
Aeschau, Horben Schulhaus\r
Aeschau, Säge\r
Aeschi b. Spiez, Mustermattli\r
Aeschi b. Spiez, Wachthubel\r
Aeschi b. Spiez, Post\r
Aeschi b. Spiez, Adelmatt\r
Aeschi b. Spiez, Niederdorf\r
Aeschi b. Spiez, Längenboden\r
Aeschi b. Spiez, Alleestrasse\r
Aeschi b. Spiez, Lengmattli\r
Aeschi b. Spiez, Hasleren\r
Aeschi b. Spiez, Friedegg\r
Aeschi b. Spiez, Hundbüel\r
Aeschi SO, Dorf\r
Aeschi SO, Ost\r
Aeschi SO, Kirche\r
Aeschi SO, Bolkenstrasse\r
Aeschi SO, Schulhaus\r
Aeschiried, untere Allmi\r
Aeschiried, Staldeweid\r
Aeschiried, Kapelle\r
Aeschiried, Fuchsgraben\r
Aeschiried, Ebenen\r
Aeschiried, Schulhaus\r
Aeschiried, Suld Pochtenfall\r
Aeschiried, Chemihütte\r
Aeschlen b. O., Dorf\r
Aeschlen b. O., Bareichte\r
Aeschlen b. O., Abzw. Bleiken\r
Aeschlen b. O., Langenegg\r
Aeschlen ob Gunten, Dorf\r
Aeschlen ob Gunten, Mattikehr\r
Aeschlen ob Gunten, Erliboden\r
Aetigkofen, Dorf\r
Aetingen, Post\r
Aetingen, Fröscheren\r
Aetingen, Schulhaus\r
Aettenschwil, Oberdorf\r
Aettenschwil, Post\r
Aeugst a.A., Grossacher\r
Aeugst a.A., Höchweg\r
Aeugst a.A., Dorf\r
Aeugstertal, Müliberg\r
Aeugstertal, Landhus\r
Aeugstertal, Kloster\r
Aeusseres Emdthal\r
Affeltrangen, Dorf\r
Affoltern a.A., Lindenmoos\r
Affoltern a.A., Stigeli\r
Affoltern a.A., Bezirksspital\r
Affoltern a.A., Blitzgbach\r
Affoltern a.A., Friedhof\r
Affoltern a.A., Kronenplatz\r
Affoltern a.A., Weinberg\r
Affoltern a.A., Moosbach\r
Affoltern a.A., Bahnhof\r
Affoltern a.A., Lilienberg\r
Affoltern am Albis\r
Affoltern i.E., Dorf\r
Affoltern i.E., Bannholz\r
Affoltern-Weier, Bahnhof\r
Agarn, Dorf\r
Agarone, i Lög\r
Agarone, Paese\r
Agarone, Roccolo\r
Agarone, Bivio per Cugnasco\r
Agarone, Chiossette\r
Agarone, Piandesso\r
Agarone, Ronco Morasci\r
Agarone, Colletto\r
Agasul\r
Agiez, Vers-le-Pont\r
Agiez, L'Epine\r
Agno, Chiesa\r
Agno, Stazione\r
Agno\r
Agno, Scuola Media\r
Agra, Roncone\r
Agra, Paese\r
Agra, Bivio\r
Agra, Rondelli\r
Agriswil, Dorf\r
Aigle, Pautex\r
Aigle, Pré Neyroud\r
Aigle\r
Aigle, Les Glariers\r
Aigle, médiathèque\r
Aigle, Charmettes\r
Aigle, Orlons\r
Aigle, Marais\r
Aigle, av. Margencel\r
Aigle, Artisans\r
Aigle, gare\r
Aigle, place du Marché\r
Aigle, rte d'Evian\r
Aigle, La Mêlée\r
Aigle, Dents-du-Midi\r
Aigle, Marjolin\r
Aigle, collège Planchette\r
Aigle, Grand-Pré\r
Aigle, Levant\r
Aigle, Les Iles\r
Aigle, Pré d'Emoz/écoles\r
Aigle, Novassales\r
Aigle, Vergers\r
Aigle, Biole\r
Aigle, Golf\r
Aigle, piscine\r
Aigle, La Chapelle\r
Aigle, Champex\r
Aigle, ch. des Lieugex\r
Aigle-Château\r
Aigle-Dépôt\r
Aigle-Parc Aventure\r
Aigle-Place-du-Marché\r
Aiguille des Champeys\r
Aire-la-Ville, Treulaz\r
Aire-la-Ville, croisée\r
Aire-la-Ville, Pont-de-Peney\r
Aire-la-Ville, centre\r
Airolo, Centro Sportivo\r
Airolo, Biv. per Madrano\r
Airolo, Galleria Banchi\r
Airolo, Pian Secco Belvédère\r
Airolo, Cioss di fuori\r
Airolo, Buco dei Cavalli\r
Airolo, Caseificio/Funivia\r
Airolo, Bivio Funivia\r
Airolo, Stazione\r
Airolo, Bivio per Nante\r
Airolo\r
Airolo (Pesciüm)\r
Airside Center\r
Alabardia\r
Albanas\r
Alberswil, Unterdorf\r
Alberswil, Burgrain\r
Alberswil, Dorf\r
Albeuve, gare\r
Albeuve\r
Albigna\r
Albinen, Tschäss\r
Albinen, Schwelli\r
Albinen, Dorf\r
Albinen, Rhodania\r
Albinen, Schreinerei\r
Albinen, Dorben\r
Albinen, Tschingeren\r
Albinenleitern, Flaschen\r
Albinenleitern, Abzw. Flaschen\r
Albinenleitern (Torrentbahn)\r
Albligen, Dorf\r
Albligen, Kurried\r
Albonago, Sentiero Castagni\r
Albonago, al Bosco\r
Albonago, ai Ronchi\r
Albonago, Paese\r
Albonago, Roccolo\r
Albonago, Gradinata\r
Albonago, Via Ruscello\r
Albonago, Via Max Frisch\r
Albonago, Sentiero di Camà\r
Albonago\r
Albulapass, Hospiz\r
Alchenflüh, Bernstrasse Ost\r
Alchenstorf, Dorf\r
Alchenstorf, Oberalchenstorf\r
Alchenstorf, Wil\r
Alchenstorf, Unteralchenstorf\r
Aldesago, Arcate\r
Aldesago, Paese\r
Aldesago, Pontaccio\r
Aldesago\r
Aldesago, Via Rava\r
Aldesago, Narbostra\r
Aldesago, Ronchée\r
Aldesago Villaggio\r
Alesse\r
Algetshausen, Dorf\r
Alikon, Oberalikon\r
Alikon, Buchacher\r
All'Acqua\r
Allaman, gare\r
Allaman, Château\r
Allaman, Grand-Rue\r
Allaman\r
Alle, rue de l'église\r
Alle, zone industrielle\r
Alle\r
Alle, centre sportif / loisirs\r
Alle, poste/gare\r
Allenlüften, Dorf\r
Allens, village\r
Allenwinden, Grüt\r
Allenwinden, St. Meinrad\r
Allenwinden, Egg\r
Allenwinden, Dorf\r
Allenwinden, Inkenberg\r
Allerheiligenberg, Bergwirts.\r
Allerheiligenberg, Endhalt\r
Allières\r
Allmenalp\r
Allmend\r
Allmend (Sesselbahn)\r
Allmendhubel (Sesselbahn)\r
Allmendhubel (Standseilbahn)\r
Allmendingen b. B., Garten-C.\r
Allmendingen b. B., Hirschen\r
Allmendingen b. B., Käserei\r
Allmendingen b. Thun, RAZ\r
Allmendingen b. Thun, Dorf\r
Allmendingen b. Thun, Längmatt\r
Allmendingen b.Thun,Wendeplatz\r
Allmiboden\r
Allschwil, Merkurstrasse\r
Allschwil, Rosenberg\r
Allschwil, Ziegelhof\r
Allschwil, Im Brühl\r
Allschwil, Hagmattstrasse\r
Allschwil, Binningerstrasse\r
Allschwil, Engehollenweg\r
Allschwil, Lindenplatz\r
Allschwil, Reservoir\r
Allschwil, Wänglismatten\r
Allschwil, Letten\r
Allschwil, Kreuzstrasse\r
Allschwil, Gartenstrasse\r
Allschwil, Kirche\r
Allschwil, Grabenring\r
Allschwil, Friedhof\r
Allschwil, Parkallee\r
Allschwil, Bettenacker\r
Allschwil, Ziegelei\r
Allschwil, Paradies\r
Allschwil, Gartenhof\r
Allschwil, Spitzwald\r
Allschwil, Zum Sporn\r
Allschwil, Dorf\r
Almens, Dorf\r
Alosen, Hundtal\r
Alosen, Schmidte\r
Alosen, Raten\r
Alosen, Dorf\r
Alosen, Giregg\r
Alp Bella\r
Alp Camp\r
Alp Dado\r
Alp Dado (Bergstation)\r
Alp Dado (Talstation Fil)\r
Alp Darlux\r
Alp de Confin\r
Alp Grüm\r
Alp Languard\r
Alp Lavoz\r
Alp Lütholdsmatt\r
Alp Nova\r
Alp Pradaschier\r
Alp Scharmoin\r
Alp Sellamatt\r
Alp Sellamatt (Ruestel Talst.)\r
Alp Surlej\r
Alp Trida\r
Alpboden\r
Alpe Casaccia\r
Alpe des Chaux, Combe du Scex\r
Alpe des Chaux, Les Outanes\r
Alpe des Chaux, Aiguerousse\r
Alpe des Chaux, Les Ernets\r
Alpe des Chaux, Frience\r
Alpe des Chaux, Les Fracherets\r
Alpe des Chaux, Les Arsets\r
Alpe des Chaux, Les Verneys\r
Alpe des Chaux, Ptes Maraîches\r
Alpe di Nara\r
Alpe di Neggia, Alpe\r
Alpe di Neggia, Bv. Trecciura\r
Alpe Foppa\r
Alpetli\r
Alpiglen\r
Älpli\r
Alpnach Dorf, Brünigstrasse\r
Alpnach Dorf, untere Feldstr.\r
Alpnach Dorf, Spitzachen\r
Alpnach Dorf\r
Alpnach Dorf, Hofmättelikreuz\r
Alpnach Dorf, Schoried\r
Alpnach Dorf, Bahnhof\r
Alpnachstad, Bahnhof\r
Alpnachstad\r
Alpnachstad (See)\r
Alpnachstad PB\r
Alpthal, Schnüerlismatt\r
Alpthal, Stei\r
Alpthal, Grund\r
Alpthal, Gribsch\r
Alpthal, Rütli\r
Alpthal, Malosen\r
Alpthal, Eigen\r
Alpthal, Kirche\r
Alptrider Sattel\r
Alt St. Johann, Horb\r
Alt St. Johann, Starkenbach\r
Alt St. Johann, Dorf\r
Alt St. Johann (Sellamattbahn)\r
Altanca\r
Altanca (funicolare)\r
Altavilla\r
Altbüron, Post\r
Altbüron, Ludligen\r
Altbüron, Linden\r
Altbüron, Halde\r
Altbüron, Feld\r
Altbüron, Hiltbrunnen\r
Altdorf SH, Dorf\r
Altdorf UR, Chornmatt\r
Altdorf UR, Maihof\r
Altdorf UR, Langmatt\r
Altdorf UR, Pro Familia\r
Altdorf UR, Bahnhof West\r
Altdorf UR, Hagenschulhaus\r
Altdorf UR, Bahnhof Ost\r
Altdorf UR, Telldenkmal\r
Altdorf UR, Gemeindehaus\r
Altdorf UR, Ruberst/Neuland\r
Altdorf UR, Dätwyler AG\r
Altdorf UR, Kollegium\r
Altdorf UR, Steinmattstrasse\r
Altdorf UR, Eggberge/Moosbad\r
Altdorf UR\r
Altdorf UR, Post\r
Altdorf UR, Ringli\r
Altdorf UR, Spital\r
Altdorf UR, Allmend\r
Altdorf UR, Frauenkloster\r
Altendorf, Schweizerhofplatz\r
Altendorf, Bitzi\r
Altendorf, Lidwil\r
Altendorf, Stoglen\r
Altendorf, Bahnhof\r
Altendorf, Letzi\r
Altendorf, Talstrasse\r
Altendorf\r
Altendorf, Tevag\r
Altendorf Seestatt\r
Altenrhein, Dorf\r
Altenrhein, Schulhaus\r
Altenrhein, Hegi\r
Altenrhein, Am Rhein\r
Altenrhein, Flugplatz\r
Altenrhein, Markthalle\r
Altenrhein Schifflände\r
Alter Zoll\r
Alterswil FR, Beniwil\r
Alterswil FR, Wengliswil\r
Alterswil FR, Wilersguet\r
Alterswil FR, Geriwil\r
Alterswil FR, Hofmatt\r
Alterswil FR, Galteren\r
Alterswil FR, Dorfplatz\r
Alterswilen, Kirche\r
Altikon, Brückenwaage\r
Altikon, Herten\r
Altishofen, Unterdorf\r
Altishofen, Kreisel\r
Altishofen, Bäckerei\r
Altmatt\r
Altnau, Längiacker\r
Altnau, Rössli\r
Altnau, Kirche\r
Altnau, Schmitteweg\r
Altnau, Zentrum\r
Altnau, Unterhof\r
Altnau, Bahnhof\r
Altnau\r
Altnau (See)\r
Altreu, Mitte\r
Altreu, Info Zentrum Witi\r
Altreu\r
Altreu, Nord\r
Altstätten SG, Bächler\r
Altstätten SG, Spital/Heime\r
Altstätten SG, Fleuben\r
Altstätten SG, Industriestr.\r
Altstätten SG, Ruppenhalde\r
Altstätten SG, Baumert\r
Altstätten SG, Traube\r
Altstätten SG, Ruppendörfli\r
Altstätten SG, Breite\r
Altstätten SG, Depot\r
Altstätten SG, Unterlitten\r
Altstätten SG, Sägentobel\r
Altstätten SG, Kesselbach\r
Altstätten SG, Rathaus\r
Altstätten SG, Bahnhof\r
Altstätten SG, Tannenbaum\r
Altstätten SG, Wieswanne\r
Altstätten SG, Ruppen\r
Altstätten SG, Ergeten-Loch\r
Altstätten SG, Klosterguet\r
Altstätten SG, Hirschen\r
Altstätten SG, Stadt\r
Altstätten SG, Elsenacker\r
Altstätten SG, Kapf\r
Altstätten SG, Bleichi\r
Altstätten SG, Oberkirlen\r
Altstätten SG\r
Altstätten SG, Ergeten\r
Altstätten SG, Ziel-Kornberg\r
Altstätten SG, Forst\r
Altstätten SG, Feldstrasse\r
Altstätten SG, Eichbergerstr.\r
Altstätten Stadt\r
Altwis, Dorf\r
Alvaneu\r
Alvaneu, Bahnhof\r
Alvaneu Bad, Dorfplatz\r
Alvaneu Bad, Landwasserviadukt\r
Alvaneu Bad, Solas\r
Alvaneu Bad, Badezentrum\r
Alvaneu Dorf, Crappa Naira\r
Alvaneu Dorf, Schule\r
Alvaneu Dorf, Dorfplatz\r
Alvaschein, Gipsmühle\r
Alvaschein, vischnanca\r
Alvaschein, Solisbrücke\r
Ambrì, Chiesa\r
Ambrì, sotto\r
Ambrì, centro scolastico\r
Ambrì-Piotta, Stazione\r
Ambrì-Piotta\r
Amden, Soldanella\r
Amden, Dorf\r
Amden, Hinterstein\r
Amden, Montana\r
Amden, Vorderdorf\r
Amden, Mennweg\r
Amden, Sell\r
Amden, Lehni\r
Amden, Bellevue\r
Amden, Brugg\r
Amden, Forten\r
Amden, Stocksitten\r
Amden (Talstat. Niederschlag)\r
Amden Arvenbühl\r
Amden Brittertanne\r
Aminona\r
Aminona, Colombire\r
Aminona, Plumachit\r
Amlikon, Unterdorf\r
Amlikon, Oberdorf\r
Amlikon-Bissegg, Wolfikon\r
Amlikon-Bissegg, Bänikon\r
Ammerswil AG, Kirche\r
Ammerswil AG, Dorfplatz\r
Ammerswil AG, Rebrain\r
Ammerzwil BE, Unterdorf\r
Ammerzwil BE, Sandhubel\r
Amriswil, Strassenverkehrsamt\r
Amriswil, Grenzstrasse\r
Amriswil, Zentrum\r
Amriswil, Almensberg\r
Amriswil, Schrofen\r
Amriswil\r
Amriswil, Kirchstrasse\r
Amriswil, St. Gallerstrasse\r
Amriswil, Bahnhof\r
Amriswil, Säntisstrasse\r
Amriswil, Marktplatz\r
Amriswil, Maihalde\r
Amriswil, Hemmerswil\r
Amriswil, Quellenhof\r
Amriswil, Köpplishaus\r
Amriswil, Mühlebach\r
Amsoldingen, Sandgrube\r
Amsoldingen, Kirche\r
Amsoldingen, Steghalten\r
Amsoldingen, See\r
Amsoldingen, Kreuz\r
Amsteg, Grund/Seilbahn\r
Amsteg, Dorf\r
Amsteg, Schulhaus\r
Amsteg, St. Anton\r
Amsteg (Talstation Arnisee)\r
Andeer, Tgavugl\r
Andeer, Bärenburg\r
Andeer, Heilbad\r
Andeer, posta\r
Andeer, Rofflaschlucht\r
Andelfingen, Bahnhof\r
Andelfingen\r
Andelfingen, Thurbrücke Alten\r
Andermatt\r
Andermatt, Bahnhofplatz\r
Andermatt, Bodenstrasse 2\r
Andermatt, Gemeinde Werkhof\r
Andermatt, Gemeindehaus\r
Andermatt, Krone\r
Andermatt, Brücke\r
Andermatt, Konzerthalle\r
Andermatt, Bodenstrasse 1\r
Andermatt, Gemsstockbahn\r
Andermatt, Kreisel Oberalp Süd\r
Andermatt, Eiboden\r
Andermatt, Altkirch\r
Andermatt, Tourist Info\r
Andermatt, Bahnhof\r
Andermatt, Oberwiler\r
Andermatt, Unteralp\r
Andermatt, The Nordic House\r
Andermatt, Poststrasse\r
Andermatt, Reuss Parking\r
Andermatt, Unterwiler\r
Andermatt (Gemsstockbahn)\r
Andermatt (Gondelbahn Gütsch)\r
Andiast, vitg dado\r
Andiast, Plattatschas\r
Andiast, vitg\r
Andiast, S. Clau\r
Andwil SG, Otmarsegg\r
Andwil SG, Post\r
Andwil SG, Linden\r
Andwil SG, Grünau\r
Andwil SG, St. Margreten\r
Andwil TG, Volg\r
Andwil TG, Eckartshausen\r
Anglikon, Knobelstrasse\r
Anglikon, Bursthalde\r
Anglikon, Zentrum\r
Anglikon, Brändliacker\r
Anglikon, Schisgass\r
Anglikon, Kesselackerstrasse\r
Anières, Courbes\r
Anières, Marguerite\r
Anières, Nant-d'Aisy\r
Anières, Gravière\r
Anières, douane\r
Anières, Courson\r
Anières, Chevrens\r
Anières, village\r
Anières, Bassy\r
Anières, Sous-Chevrens\r
Anières, Chavannes\r
Anières, mairie\r
Anières, Foyer\r
Anières (lac)\r
Antagnes, Forêt\r
Antagnes, Pissot\r
Antagnes, place de la Dîme\r
Antagnes, rte d'Antagnes\r
Antagnes, Les Fontaines\r
Antagnes, Le Boët\r
Antagnes, Glutières\r
Anwil, Talweiher\r
Anwil, Ausserdorf\r
Anwil, Dorf\r
Anzère, Bisse d'Ayent\r
Anzère, Barrage de Tseuzier\r
Anzère, Pra Combère\r
Anzère, Utignou\r
Anzère, centre\r
Anzère, télécabine\r
Anzère, village sud\r
Anzère, Chamossaire\r
Anzère, Les Rousses\r
Anzère, Pralan\r
Anzère (télécabine)\r
Anzère Les Rousses\r
Anzonico, Paese\r
Anzonico, Bv. Calonico\r
Appenzell, Lank\r
Appenzell, Steig\r
Appenzell, Unterschlatt\r
Appenzell, Hallenbad\r
Appenzell, Kreuzhof\r
Appenzell, Bahnhof\r
Appenzell, Bleichenwald\r
Appenzell, Meistersrüte\r
Appenzell, Moren\r
Appenzell, Alpsteinstrasse\r
Appenzell, Schönenbüel\r
Appenzell, Sonnhalde\r
Appenzell, Mettlenbrücke\r
Appenzell, Kreuzstrasse\r
Appenzell, Bleuer\r
Appenzell, Zentrale\r
Appenzell, Adlerplatz\r
Appenzell, Hirschberg Station\r
Appenzell\r
Appenzell, Feldstrasse\r
Appenzell, Lädeli\r
Apples, La Mottaz\r
Apples\r
Apples, gare\r
Apples, Fondation Baud\r
Apples, collège\r
Apples, Hôtel de Commune\r
Apples, En Lèvremont\r
Aproz, village\r
Aproz, bif. Bieudron\r
Aproz, rte de Coor\r
Aquila, Sud\r
Aquila, Paese\r
Aquila, Cresedo\r
Aquila, Bivio Ponto-Aquilesco\r
Aran, Pra Forny\r
Aranno, Lusciè\r
Aranno, Maestà\r
Aranno, Flora\r
Aranno, Cappella di Aranno\r
Aranno, Prumé\r
Aranno, Paese\r
Arbaz, bif. Blignou\r
Arbaz, Barra\r
Arbaz, Pré-du-Loup\r
Arbaz, poste\r
Arbaz, café du Lac\r
Arbaz, Onna\r
Arbaz, Prozerbou\r
Arbaz, Planèje\r
Arbedo, Casa Comunale\r
Arbedo, Via Orbello\r
Arbedo, Molinazzo\r
Arbedo, Chiesa\r
Arbedo, Polveriera Nord\r
Arbedo, Polveriera\r
Arbedo, Ponte Pacciaredo\r
Arbedo, Rotondello\r
Arboldswil, Renggelts\r
Arboldswil, Dorf\r
Arboldswil, Mühletal\r
Arbon, Romanshornerstrasse\r
Arbon, Stahelplatz\r
Arbon, Bergli\r
Arbon, Frohmattstrasse\r
Arbon, Bahnhof Ost\r
Arbon, Kupferwiese\r
Arbon\r
Arbon, Alpenblick\r
Arbon, Schloss\r
Arbon, Bahnhof\r
Arbon, Landquartstrasse\r
Arbon, Bündnerhof\r
Arbon, Scheidweg\r
Arbon, Wildpark\r
Arbon, Alter Werkhof\r
Arbon, Friedenstrasse\r
Arbon, Seemoosholz\r
Arbon (See)\r
Arbon Seemoosriet\r
Arcegno, Altisio\r
Arcegno, Cruglio\r
Arcegno, Chiesa\r
Arch, Bahnhofstrasse\r
Arch, Aarestrasse\r
Arch, Arche\r
Arconciel, Sur-le-Moulin\r
Arconciel, Pelleret\r
Arconciel, Rialet\r
Arconciel, village\r
Ardez, Bröl\r
Ardez, staziun\r
Ardez\r
Ardon, Arnica\r
Ardon, centre\r
Ardon\r
Arenenberg, Schloss\r
Areuse, giratoire\r
Areuse, Les Isles\r
Areuse Les Isles Littorail\r
Areuse Littorail, gare\r
Areuse Littorail\r
Arezen, alte Post\r
Arezen, Fatscha\r
Argnou (Ayent), d'en Haut\r
Argnou (Ayent), centre\r
Argnou (Ayent), Les Frisses\r
Arisdorf, Kreuz\r
Arisdorf, Schulhaus\r
Arisdorf, Olsbergerstrasse\r
Arisdorf, Weieren\r
Arisdorf, Hofacker\r
Arisdorf, Mülimatt\r
Aristau, Dorf\r
Aristau, Birri\r
Aristau, Althäusern\r
Arlesheim, Stollenrain\r
Arlesheim, Im Lee\r
Arlesheim, Baselstrasse\r
Arlesheim, Schorenweg\r
Arlesheim, Walzwerk\r
Arlesheim, Dom\r
Arlesheim, Obesunne\r
Arlesheim, Untere Weide\r
Arlesheim, Dorf\r
Arlesheim, Birsweg\r
Arlesheim, Altenmatteweg\r
Arlesheim, Aliothstrasse\r
Arnegg, Weideggstrasse\r
Arnegg, Bahnhof\r
Arnegg, Geretschwilerstrasse\r
Arnegg, Restaurant Ilge\r
Arnegg\r
Arnex, poste\r
Arnex, gare\r
Arnex\r
Arnex-sur-Nyon\r
Arni AG, Dorf\r
Arni AG, Stockacker\r
Arni BE, Matte\r
Arni BE, Dorf\r
Arni BE, Walke\r
Arni BE, Tanne\r
Arni BE, Schwendelweg\r
Arni BE, Hämlismatt\r
Arni UR\r
Arnisäge BE, Post\r
Arnisee\r
Arnorengo\r
Arnouva (télécabine amont)\r
Arnouva (télésiège aval)\r
Arogno, Sasso Grosso\r
Arogno, Cà del Ferée\r
Arogno, S. Michele\r
Arogno, Paese\r
Arogno, Cà Nova\r
Arogno, Nebbia\r
Arogno, La Cassina\r
Aroleid\r
Arolla, Pramousse\r
Arolla, La Monta\r
Arolla, Mt-Collon\r
Arolla, Satarma\r
Arolla, poste\r
Arolla, La Gouille\r
Arolla, Magine\r
Arosa, Rathaus\r
Arosa, Bellevue\r
Arosa, Brüggli/Skischule\r
Arosa, Obersee\r
Arosa, Bahnhof\r
Arosa, Sandhubel\r
Arosa, Wetterweide\r
Arosa, Maran\r
Arosa, Weisshornbahn/Skischule\r
Arosa, Prätschli\r
Arosa, Hörnli\r
Arosa, Seehalde\r
Arosa, Alteinplatz\r
Arosa, Kulm\r
Arosa, Langlauf/Golf\r
Arosa, Gollrad\r
Arosa, Zentrum\r
Arosa, Seeboden\r
Arosa, Surlej\r
Arosa\r
Arosa, Gada\r
Arosa, Untersee\r
Arosa, Ochsenbühl\r
Arosa, Seilpark\r
Arosa (Mittelstation)Weisshorn\r
Arosa (Talstation Tschuggen)\r
Arosa (Talstation) Hörnli\r
Arosa (Talstation) Weisshorn\r
Arosa Bänkli\r
Arosa Geisstobel\r
Arosa Kirchli\r
Arosa Schönboden\r
Arosio, Paese\r
Arosio, Bivio per Arosio\r
Arosio, Bassa\r
Arosio, Cappella di Toma\r
Arosio, Cimaronco\r
Arpalle\r
Arrissoules, village\r
Arth, Chäppeli\r
Arth, Am See\r
Arth, Aazopf\r
Arth, Feld\r
Arth, Klostermatt\r
Arth, Dorf\r
Arth am See (Schiff)\r
Arth-Goldau\r
Arth-Goldau, Bahnhof\r
Arth-Goldau RB\r
Artore, Paese\r
Arvenbüel, Arven\r
Arvenbüel, Obern\r
Arvengarten (Arven)\r
Arvengarten (Eiger)\r
Arvengarten (Honegg)\r
Arveyes, gare\r
Arveyes, Regina\r
Arveyes\r
Arvigo, Al Canton\r
Arvigo, Paese\r
Arvigo, Filovia\r
Arvigo (Funivia)\r
Arzier\r
Arzo, Via Rossi\r
Arzo, Scuole\r
Arzo, Bagno Spiaggia\r
Arzo, Coop\r
Arzo, Posta\r
Arzo, San Grato\r
Ascharina, Bellawiese\r
Ascharina, Bartlischhus\r
Ascharina, Alpstrasse\r
Ascharina, alte Post\r
Ascharina, Alpbachbrücke\r
Ascharina, Tola\r
Ascharina, Gürgetsch\r
Ascona, Moscia\r
Ascona, Palestre\r
Ascona, Via Pascolo\r
Ascona, Parco dei Poeti\r
Ascona, Baraggie\r
Ascona, Manor Delta\r
Ascona, Scuole\r
Ascona, Via Medere\r
Ascona, Fiume Maggia\r
Ascona, Centro\r
Ascona, Via Pancaldi Mola\r
Ascona, Borgo\r
Ascona, San Materno\r
Ascona (lago)\r
Asp AG, Abzw.\r
Assens\r
Astano, La Bolla\r
Astano, Paese\r
Asuel, école\r
Asuel, La Malcôte\r
Asuel, Maison communale\r
Athenaz, école\r
Athenaz, village\r
Athenaz, Passeiry\r
Attalens, La Fin\r
Attalens, Corcelles\r
Attalens, Fin du Clos\r
Attalens, village\r
Attalens, Perrey\r
Attalens, Montessinge\r
Attelwil, Schule\r
Attelwil, alte Post\r
Attinghausen, Seilbahn\r
Attinghausen, Plätzli\r
Attinghausen, Galliried\r
Attinghausen, Wehrheim\r
Attinghausen (Luftseilbahn)\r
Attiswil, Post\r
Attiswil\r
Atzmännig, Atzmännigstrasse\r
Atzmännig, Schutt\r
Atzmännig (Bergstation)\r
Atzmännig Schutt (Talstation)\r
Au SG, Oberdorf\r
Au SG, Zinggen\r
Au SG, Gemeindehaus\r
Au SG\r
Au SG, Monstein\r
Au ZH, Naglikonerweg\r
Au ZH, Bahnhof\r
Au ZH, Austrasse\r
Au ZH, Schützenhaus\r
Au ZH, Strandbad\r
Au ZH, Grundstein\r
Au ZH, Seeguet\r
Au ZH, Moosacher\r
Au ZH, Appital\r
Au ZH, Alte Landstrasse\r
Au ZH, Unter Ort\r
Au ZH, Gwad\r
Au ZH, Stoffelstrasse\r
Au ZH, Aubrücke\r
Au ZH\r
Aubonne, Le Bornalet\r
Aubonne, Sermaret\r
Aubonne, Roveray\r
Aubonne, Bougy-St-Martin\r
Aubonne, La Levette\r
Aubonne, Pré-Baulan\r
Aubonne, hôpital\r
Aubonne, Curzilles\r
Aubonne, La Praz\r
Aubonne, gare\r
Auenstein, Eggen\r
Auenstein, Hausacher\r
Auenstein, Obermatt\r
Auenstein, Fahr\r
Auenstein, Gemeindehaus\r
Auenstein, Wiweg\r
Auenstein, Rütigasse\r
Auenstein, Kirche\r
Auenstein, Steinbr. Jakobsberg\r
Augio, Paese\r
Augio, Tarco\r
Augst BL, Langgass\r
Augst BL, Schwarzacker\r
Augst BL, Stundeglas\r
Augst BL Kraftwerk\r
Auliens, halte\r
Aumont, école\r
Aumont, village\r
Auressio, Paese\r
Auressio, Ronchetto\r
Auressio, Ri del Vò\r
Aurigeno-Moghegno\r
Auslikon, Schulhausstrasse\r
Auslikon, Ober Balm\r
Ausserberg, Stapfa\r
Ausserberg, Dorf\r
Ausserberg, Giblätt\r
Ausserberg, Brandenhütten\r
Ausserberg, Chronufluo\r
Ausserberg\r
Ausserberg, Distern\r
Ausserberg, Abzw. St. German\r
Ausserberg, Bahnhof\r
Ausserberg, Hohtenn\r
Ausserbinn, Dorfplatz\r
Ausserbinn, Wengi\r
Ausserbinn, Hubel\r
Ausserpraden, Hedwig\r
Ausserpraden, Krone\r
Autavaux, bif.\r
Autigny, Café de l'Ecu\r
Autigny, En Verdau\r
Autigny, Le Bas\r
Autigny, église\r
Auvernier, Pacotte\r
Auvernier, gare\r
Auvernier\r
Auvernier (bateau)\r
Auvernier Littorail\r
Auw, Unterdorf\r
Auw, Altersheim\r
Auw, Oberdorf\r
Auw, Mitteldorf\r
Auw, Sinserstrasse\r
Auw, Rüstenschwil Dorf\r
Avegno, Paese\r
Avegno, l'Acèss\r
Avegno, Grotti\r
Avegno di fuori\r
Aven, Motélon\r
Aven, village\r
Aven, Le Creux-d'Ortcheu\r
Aven, Courtenaz\r
Aven, La Croix\r
Aven, Le Brésil\r
Aven, Lac Bleu\r
Aven, pl. St-Bernard\r
Aven, Maduc\r
Avenches, gare\r
Avenches, Haras Fédéral\r
Avenches, route du Lac\r
Avenches, plage\r
Avenches, Pré-Vert\r
Avenches, Joli-Val\r
Avenches, EMS Marc-Aurèle\r
Avenches, Le Paon\r
Avenches, Bois de Châtel\r
Avenches, Collège Sous-Ville\r
Avenches, Hôtel de Ville\r
Avenches, Bibracte\r
Avenches, Milavy\r
Avenches, L'Eau-Noire\r
Avenches\r
Avenches, Faubourg\r
Avenches, Montmezard\r
Avers, Abzw. Valle di Lei\r
Avers, Am Bach\r
Avers, Rufana\r
Avers, Campsut\r
Avers, Juf\r
Avers, Podestats Haus\r
Avers, Cröt\r
Avers, Juppa\r
Avers, Lezibrücke\r
Avers, Cresta\r
Avers, Pürt\r
Avry-devant-Pont, village\r
Avry-devant-Pont, La Cantine\r
Avry-Matran, gare\r
Avry-Matran\r
Avry-sur-Matran, école\r
Avry-sur-Matran, Fontanettes\r
Avry-sur-Matran, Marie-Favre\r
Avry-sur-Matran, centre com.\r
Avry-sur-Matran, La Sonnaz\r
Avry-sur-Matran, Les Agges\r
Avry-sur-Matran, Courtaney\r
Avry-sur-Matran, village\r
Avully, Touvière\r
Avully, Printanière\r
Avully, Martinet\r
Avully, Bachères\r
Avully, école\r
Avully, village\r
Avully, Gennecy\r
Avully, Eaumorte hameau\r
Avusy, Sur-le-Moulin\r
Avusy, Les Quoattes\r
Avusy, village\r
Avusy, La Tuilière\r
Avusy, Creux-du-Loup\r
Avusy, Moulin de la Grave\r
Axalp, Sportbahnen\r
Axalp, Totzweg\r
Axalp, Bellevue\r
Axalp (Talstation Windegg)\r
Ayer, Val d'Uccle\r
Ayer, Prarrayer\r
Ayer, Blanche Pierre\r
Ayer, Les Morasses\r
Ayer, Les Grands Praz\r
Ayer, anc. poste\r
Ayer, Cuimey\r
Azmoos, Feld\r
Azmoos, Rathaus\r
Azmoos, Gatina\r
Baar, Paradies\r
Baar, Bachtalerhöhe\r
Baar, Bahnmatt\r
Baar, Moosrank (Höllgrotten)\r
Baar, Lättichstrasse\r
Baar, Ruessen\r
Baar, Kreuzplatz\r
Baar, Südstrasse\r
Baar, Hof Himmelrich\r
Baar, EW\r
Baar, Früebergstrasse\r
Baar, Geissbüel\r
Baar, Büelplatz\r
Baar, Blegistrasse\r
Baar, Kantonsspital\r
Baar, Altgasse\r
Baar, Schochenmühle\r
Baar, Oberneuhof\r
Baar, Arbach\r
Baar, Grund\r
Baar, Chriesimatt\r
Baar, Lindenhof\r
Baar\r
Baar, Tobelbrücke-Höllgrotten\r
Baar, Stadtgrenze\r
Baar, Bahnhof\r
Baar, Oberdorf\r
Baar, Walterswil\r
Baar, Lättich\r
Baar, Brauerei\r
Baar, Pfaffentobel\r
Baar, Waldmannhalle\r
Baar, Talacher\r
Baar, Rathaus\r
Baar, Metro\r
Baar, St. Martin\r
Baar (Nendaz), village\r
Baar (Nendaz), La Mury\r
Baar Lindenpark\r
Baar Neufeld\r
Bäch SZ, Badi\r
Bäch SZ, Usserbäch\r
Bäch SZ, Bahnhof\r
Bäch SZ, Schulhaus\r
Bäch SZ\r
Bachenbülach, Bramenstrasse\r
Bachenbülach, Schmiede\r
Bachenbülach, alte Post\r
Bachenbülach, Bramenländli\r
Bächital\r
Bächli, Dorf\r
Bächli, Wies\r
Bächli, Harzenmoos\r
Bachs, Milchhütte\r
Bachs, Neu-Bachs\r
Bachs, Alt-Bachs\r
Bachs, Weiherbach\r
Bad Ragaz, St. Leonhard\r
Bad Ragaz, Im Ochsenbrunnen\r
Bad Ragaz, Tamina Therme\r
Bad Ragaz, Bidems\r
Bad Ragaz, Zentrum\r
Bad Ragaz, Tobelbrücke\r
Bad Ragaz\r
Bad Ragaz, Post\r
Bad Ragaz, Pizolbahn\r
Bad Ragaz, Bahnhofstrasse\r
Bad Ragaz, Fluppi\r
Bad Ragaz, Freihof\r
Bad Ragaz, Kreisel Ausserfeld\r
Bad Ragaz, Maienfelderstrasse\r
Bad Ragaz, Dorfbad\r
Bad Ragaz, Bahnhof\r
Bad Ragaz, Schulhaus Kleinfeld\r
Bad Ragaz Matells (Talst.)\r
Bad Zurzach\r
Bad Zurzach, Tulpenweg\r
Bad Zurzach, Zurzacher Hof\r
Bad Zurzach, Feldblumenweg\r
Bad Zurzach, Triumph\r
Bad Zurzach, Dachsweg\r
Bad Zurzach, Turmhotel\r
Bad Zurzach, Höfli\r
Bad Zurzach, Thermalbad\r
Bad Zurzach, Tierpark\r
Bad Zurzach, Schlüsselstrasse\r
Bad Zurzach, Baslerstrasse\r
Bad Zurzach, Salzstrasse\r
Bad Zurzach, Rathaus\r
Bad Zurzach, Friedhof\r
Bad Zurzach, RehaClinic\r
Bad Zurzach, Regibad\r
Bad Zurzach, Uf Raine\r
Bad Zurzach, Promenade\r
Bad Zurzach, Seesteg\r
Bad Zurzach, Fliederweg\r
Bad Zurzach, Parkhotel\r
Bad Zurzach, Bahnhof\r
Bad Zurzach, Oberflecken\r
Baden, Römerstrasse\r
Baden, Freihof\r
Baden, Liebenfels\r
Baden, Belvédère\r
Baden, Spitalmatt\r
Baden, Schwimmbad\r
Baden, Lindeli\r
Baden, Lindenplatz\r
Baden, Postautostation\r
Baden, Historisches Museum\r
Baden, Schulhausplatz\r
Baden, Kantonsschule\r
Baden, Baldegg\r
Baden, Föhrenweg\r
Baden, Birkenweg\r
Baden, Grand Casino\r
Baden, Oberstadt\r
Baden, Kurtheater\r
Baden, Trafo\r
Baden, Ifang\r
Baden, Ruschebach\r
Baden, Bahnhof West\r
Baden, Alterszentrum\r
Baden, Rütistrasse\r
Baden, Müntzbergstrasse\r
Baden, Ziegelhau\r
Baden, Utostrasse\r
Baden, Stein\r
Baden, Eichtal\r
Baden, Bahnhof Ost\r
Baden, Kreuzliberg\r
Baden, Obere Kehlstrasse\r
Baden, Münzlishausen\r
Baden, Schlossbergplatz\r
Baden, Brunnmatt\r
Baden, Grosse Bäder\r
Baden, St. Ursus\r
Baden, Sonnmatt\r
Baden, Badener Tor\r
Baden\r
Baden, Schadenmühle\r
Baden, Kehl\r
Baden, Kapelle\r
Baden, Schellenacker\r
Baden, Bruggerstrasse\r
Baden, Kantonsspital\r
Baggwil, Dorf\r
Baggwil, Graben\r
Bains-de-l'Alliaz\r
Baldegg, Kantonsschule\r
Baldegg\r
Baldegg, Bahnhof\r
Baldegg Kloster\r
Baldingen, Unterdorf\r
Baldingen, Mitteldorf\r
Baldingen, Oberdorf\r
Balen-Gassaura, Alpenrösli\r
Balen-Gassaura, Dorf\r
Balerna, S. Antonio\r
Balerna, Piazza\r
Balerna, Stazione\r
Balerna, Croce Bianca\r
Balerna, Mezzana\r
Balerna, Bellavista (FFS)\r
Balerna, Via Sottobisio\r
Balerna, Rimessa AMSA\r
Balerna, Bisio\r
Balerna, Pontegana\r
Balerna, Mercole\r
Balerna, Industrie\r
Balerna, Via Ciseri\r
Balerna, Passeggiata\r
Balerna\r
Balerna, Prada\r
Balerna, Via Motta\r
Balgach, Optik\r
Balgach, Ländern\r
Balgach, Dorf\r
Balgach, Bad\r
Balgach, Rathaus\r
Ballaigues, Vers-chez-Barrat\r
Ballaigues, poste\r
Ballaigues, collège\r
Ballaigues, Maillefer\r
Ballaigues, cure\r
Ballaigues, Jura-Rosaly\r
Ballavaud\r
Ballenberg Ost, Museum\r
Ballenberg West, Museum\r
Ballens\r
Ballens-Froideville\r
Ballwil, Hochdorfstrasse\r
Ballwil\r
Balm (Klausen)\r
Balm b. Günsberg, Dorf\r
Balm b. Meiringen, Ey\r
Balm b. Meiringen, Zaunstrasse\r
Balm b. Meiringen, Urbachsey\r
Balm b. Meiringen, Dorf\r
Balm b. Meiringen, Schulhaus\r
Balm b. Meiringen, Camping\r
Balm b. Meiringen, Wirtschaft\r
Balm b. Messen, Wendeplatz\r
Balmberg, Mittler-Balmberg\r
Balmberg, Vorder-Balmberg\r
Balsthal, Zentrum\r
Balsthal, Thalbrücke\r
Balsthal, Brauerei\r
Balsthal, St. Wolfgang\r
Balsthal, Pfadiheim\r
Balsthal, Hinterrain\r
Balsthal, Post\r
Balsthal\r
Balsthal, Bahnhof\r
Baltenswil\r
Balterswil, Dorf\r
Balterswil, Schulhaus\r
Balterswil, Rietwies\r
Baltschieder, Hof\r
Baltschieder, Kreuzmatte\r
Baltschieder, Erb\r
Baltschieder, Kumme\r
Baltschieder, Cavallo\r
Baltschieder, Hofmatte\r
Baltschieder, Dorf\r
Balzers, Schlossweg\r
Balzers, Roxy\r
Balzers, Brückle\r
Balzers, Rheinstrasse\r
Balzers, Oksaboda\r
Balzers, St. Katrinabrunna\r
Balzers, Mariahilf\r
Balzers, Gemeindezentrum\r
Balzers, Haus Gutenberg\r
Balzers, Pralawisch\r
Balzers, Schlossgarten\r
Balzers, Unterm Stein\r
Balzers, Ramschwagweg\r
Balzers, Sportplatz\r
Balzers, Höfle\r
Balzers, Mälsnerdorf\r
Balzers, Alter Pfarrhof\r
Balzers, Wingerta\r
Balzers, Alte Churerstrasse\r
Balzers, Rietstrasse\r
Balzers, Gnetsch\r
Balzers, Stadel\r
Balzers, Gagoz\r
Balzers, Palduinstrasse\r
Balzers, Egerta\r
Banco, Paese\r
Banco, Cruséta\r
Bänk (Dägerlen), Hanfland\r
Bannalpsee\r
Bannwil\r
Bannwil, Bahnhof\r
Bärau, Bäraugrund\r
Bärau, Sonne\r
Bärau, Schärischachen\r
Bärau, Vorder Chammershus\r
Bärau, Bahnübergang\r
Bärau, Bäraupark\r
Bärau, Dorf\r
Bärau, Schwimmbad\r
Barbengo, Tassera\r
Barbengo, Sidema\r
Barbengo, Scuole\r
Barbengo, Via Balconi\r
Barbengo, Baldoria\r
Barbengo, Campagnore\r
Barbengo, Cà Rosa\r
Barbengo, La Cava\r
Barbengo, Casaccia\r
Bardonnex, Compesières\r
Bardonnex, Feuillat\r
Bardonnex, Charrot\r
Bardonnex, village\r
Bäretswil, Oberdorf\r
Bäretswil, Bärenplatz\r
Bäretswil, Bahnhof\r
Bäretswil, Gemeindehaus\r
Bäretswil, Bussental\r
Bäretswil\r
Bäretswil, Eishalle\r
Bargen BE, Gemeindeverwaltung\r
Bargen BE\r
Bargen BE, Bahnhof\r
Bargen SH, Schinderwies\r
Bargen SH, Dorf\r
Barico, Bivio per Barico\r
Barico, Paese\r
Bäriswil BE, Mätteli\r
Bäriswil BE, Brunnen\r
Barmelweid\r
Bärschwil, Oberdorf\r
Bärschwil, Dorf\r
Bärschwil, Hölzlirank\r
Bärschwil, Station\r
Barzheim, Junkholz\r
Barzheim, Dorf\r
Basadingen, Unterdorf\r
Basadingen, Grüt\r
Basel, Jakobsberg\r
Basel, Spitzacker\r
Basel, Steinenschanze\r
Basel, Münchensteinerstrasse\r
Basel, Grosspeterstrasse\r
Basel, St. Jakob\r
Basel, Bethesda-Spital\r
Basel, Bernerring\r
Basel, Falkensteinerstrasse\r
Basel, Birmannsgasse\r
Basel, Airolostrasse\r
Basel, Waldighoferstrasse\r
Basel, Eglisee\r
Basel, Frobenstrasse\r
Basel, Hechtliacker\r
Basel, Hardstrasse\r
Basel, Pilgerstrasse\r
Basel, Peter Rot-Strasse\r
Basel, Rigistrasse\r
Basel, Surinam\r
Basel, Wettsteinallee\r
Basel, Mönchsbergerstrasse\r
Basel, Sportzentrum Rankhof\r
Basel, Margarethen\r
Basel, Winkelriedplatz\r
Basel, Bernoullianum\r
Basel, Bläsiring\r
Basel, Hüningerstrasse\r
Basel, Feldbergstrasse\r
Basel, Dreirosenbrücke\r
Basel, J. Burckhardt-Strasse\r
Basel, Bahnhof St. Johann\r
Basel, Belforterstrasse\r
Basel, Bruderholz\r
Basel, Burgfelderplatz\r
Basel, Bruderholzstrasse\r
Basel, Drei Linden\r
Basel, Hammerstrasse\r
Basel, Hegenheimerstrasse\r
Basel, Nasenweg\r
Basel, Hoffmann-La Roche\r
Basel, Rankstrasse\r
Basel, St. Alban-Tor\r
Basel, Rütimeyerplatz\r
Basel, Kleinhüningeranlage\r
Basel, Waldenburgerstrasse\r
Basel, Neubad\r
Basel, Studio Basel\r
Basel, Wielandplatz\r
Basel, Wettsteinplatz\r
Basel, Universität\r
Basel, Rheingasse\r
Basel, Mülhauserstrasse\r
Basel, MParc\r
Basel, St. Johanns-Tor\r
Basel, Marktplatz\r
Basel, Kaserne\r
Basel, Universitätsspital\r
Basel, Zeughaus\r
Basel, St-Louis Grenze\r
Basel, IWB\r
Basel, Solothurnerstrasse\r
Basel, Heuwaage\r
Basel, Bankverein\r
Basel, Denkmal\r
Basel, Barfüsserplatz\r
Basel, Messeplatz\r
Basel, Grosspeteranlage\r
Basel, Otterbach Grenze\r
Basel, Morgartenring\r
Basel, Jakobsbergerholzweg\r
Basel, Breite\r
Basel, Dreiländereck\r
Basel, Theater\r
Basel, Felix Platter-Spital\r
Basel, Signalstrasse\r
Basel, Kinderspital\r
Basel, Metzerstrasse\r
Basel, Voltaplatz\r
Basel, Ciba\r
Basel, Emanuel-Büchel-Strasse\r
Basel, Leimgrubenweg\r
Basel, Karl Barth-Platz\r
Basel, Ulmenweg\r
Basel, Rheinhafen\r
Basel, Erasmusplatz\r
Basel, Brombacherstrasse\r
Basel, Gewerbeschule\r
Basel, Hauensteinstrasse\r
Basel, Im langen Loh\r
Basel, Kirschgarten\r
Basel, Tinguely Museum\r
Basel, Lerchenstrasse\r
Basel, Lange Erlen\r
Basel, Kunstmuseum\r
Basel, Wolfschlucht\r
Basel, Zwinglihaus\r
Basel, Zoo Dorenbach\r
Basel, Bhfeingang Gundeldingen\r
Basel, Markthalle\r
Basel, Aeschenplatz\r
Basel, Bahnhof SBB\r
Basel, Badischer Bahnhof\r
Basel, Bachgraben\r
Basel, Friedrich-Miescher-Str.\r
Basel, Peter-Merian\r
Basel, Gempenfluh\r
Basel, Johanniterbrücke\r
Basel, Zoo\r
Basel, Schifflände\r
Basel, Gellertstrasse\r
Basel, Hirzbodenweg\r
Basel, Redingstrasse\r
Basel, Allschwilerplatz\r
Basel, Blotzheimerstrasse\r
Basel, Bundesplatz\r
Basel, Buschweilerweg\r
Basel, General Guisan-Strasse\r
Basel, Hochbergerstrasse\r
Basel, Hirzbrunnen/Claraspital\r
Basel, Musical Theater\r
Basel, Holbeinstrasse\r
Basel, Im Heimatland\r
Basel, Kunsteisbahn\r
Basel, Rosengartenweg\r
Basel, Strassburgerallee\r
Basel, St. Galler-Ring\r
Basel, Käferholzstrasse\r
Basel, Schorenweg\r
Basel, Thiersteinerschule\r
Basel, Synagoge\r
Basel, Erlenmatt\r
Basel, Zoo Bachletten\r
Basel, Grellingerstrasse\r
Basel, Badenstrasse\r
Basel, Heiliggeistkirche\r
Basel, Wiesenplatz\r
Basel, Claraplatz\r
Basel, Bedrettostrasse\r
Basel, Ensisheimerstrasse\r
Basel, Allmendstrasse\r
Basel, Clarastrasse\r
Basel, Forellenweg\r
Basel, Musik-Akademie\r
Basel, Inselstrasse\r
Basel, Holee\r
Basel, Novartis Campus\r
Basel, Kleinhüningen\r
Basel, Riehenring\r
Basel, Laupenring\r
Basel, Wanderstrasse\r
Basel, Mattenstrasse\r
Basel, Schützenmattstrasse\r
Basel, Schützenhaus\r
Basel, Weil am Rhein Grenze\r
Basel, Spalentor\r
Basel, Burgfelderhof\r
Basel, Sevogelplatz\r
Basel, Stücki\r
Basel, Brausebad\r
Basel, Kannenfeldplatz\r
Basel, Im Wasenboden\r
Basel, Neuweilerstrasse\r
Basel, Thomaskirche\r
Basel, Dreispitz\r
Basel, Tellplatz\r
Basel Bad Bf\r
Basel Dreispitz\r
Basel SBB\r
Basel Schifflände\r
Basel St. Johann\r
Basse-Nendaz, Le Jaheux\r
Basse-Nendaz, village\r
Basse-Nendaz, La Poya\r
Basse-Nendaz, Peteré\r
Basse-Nendaz, Bouillet\r
Basse-Nendaz, Saclentz\r
Bassecourt, Colonel-Hoffmeyer\r
Bassecourt, Vieux-Moulin\r
Bassecourt, bif. sur Glovelier\r
Bassecourt, Pépinière\r
Bassecourt, école secondaire\r
Bassecourt, Pâquerettes\r
Bassecourt, Halle des Fêtes\r
Bassecourt, Claire-Fontaine\r
Bassecourt, Centre commercial\r
Bassecourt, Etangs\r
Bassecourt, EFEJ\r
Bassecourt, Jura Centre\r
Bassecourt\r
Bassecourt, Eglise\r
Bassecourt, Paddock\r
Bassecourt, Combe\r
Bassecourt, Fougères\r
Bassecourt, gare\r
Bassecourt, garage St-Hubert\r
Bassecourt, stade\r
Bassecourt, rue du Nord\r
Bassersdorf, Chlupfgasse\r
Bassersdorf, Bächli\r
Bassersdorf, Schmitte\r
Bassersdorf, Bahnhof Süd\r
Bassersdorf, Grindel\r
Bassersdorf, Dietlikonerstr.\r
Bassersdorf, Rietli\r
Bassersdorf, Löwen\r
Bassersdorf, Gemeindehaus\r
Bassersdorf, Sportanlage\r
Bassersdorf, Bahnhof\r
Bassersdorf\r
Bassersdorf, Talgüetli\r
Bassins, Tillette\r
Bassins, Piscine\r
Bassins, La Cézille\r
Bassins\r
Bätterkinden, Bahnhof\r
Bätterkinden\r
Bätterkinden, Sternen\r
Bätterkinden, Krone\r
Bätterkinden, Kreuz\r
Bätterkinden, Schützenstrasse\r
Bättwil, Dorf\r
Bauen, Dorf\r
Bauen (See)\r
Baulmes\r
Baulmes, gare\r
Baulmes, Cul de Villars\r
Bauma, Lipperschwändi\r
Bauma, Bahnhof\r
Bauma, Widen\r
Bauma, Schindlet\r
Bauma, Dorfmitti\r
Bauma, Holderbaum\r
Bauma\r
Bauma, Hörnen\r
Bauma, Seewadel\r
Bauma, Giesserei\r
Bauma, Musterplatz\r
Bavois\r
Bazenheid, Hochhaus\r
Bazenheid\r
Bazenheid, Ifang\r
Bazenheid, Ochsen\r
Bazenheid, Bahnhof\r
Bazenheid, altes Zeughaus\r
Beatenberg, Hubel\r
Beatenberg, Wydi\r
Beatenberg, Firnelicht\r
Beatenberg, Parkplatz Lood\r
Beatenberg, Waldegg\r
Beatenberg, Tourist-Center\r
Beatenberg, Station\r
Beatenberg\r
Beatenberg, Hohlenweg\r
Beatenberg, Altersheim\r
Beatenberg, Hohlen\r
Beatenberg, Schorren\r
Beatenberg, Bhendenchehr\r
Beatenberg, bei den Kirchen\r
Beatenberg, Mättli\r
Beatenberg, Ramsern\r
Beatenberg Vorsass\r
Beatenbucht\r
Beatenbucht (Beatenbergbahn)\r
Beatenbucht (See)\r
Beatushöhlen\r
Beatushöhlen-Sundlauenen\r
Beau-Site, route de Châtel\r
Beau-Site\r
Beckenried, Boden\r
Beckenried, Nidwaldnerhof\r
Beckenried, Niederdorf\r
Beckenried, Fellerwil\r
Beckenried, Hungacher\r
Beckenried, Post\r
Beckenried (Klewenalpbahn)\r
Beckenried (See)\r
Beckenried Niederdorf (Fähre)\r
Beckenried Stafel\r
Bedano, Casa per Anziani\r
Bedano, Via Mara\r
Bedano, S. Rocco\r
Bedano, Paese\r
Bedigliora, Nerocco\r
Bedigliora, Scuola Media\r
Bedigliora, Paese\r
Bedigliora, Feredino\r
Bedretto, Paese\r
Bedretto, Bivio per Ronco\r
Beffeux\r
Beggingen, Neumühle\r
Beggingen, Dorf\r
Begnins, Les Clavières\r
Begnins, Charbonnier\r
Begnins, Grange-Grèche\r
Begnins, La Chataigneraie\r
Begnins, Bellevue\r
Begnins, scierie\r
Begnins, Bois-du-Four\r
Begnins, poste\r
Bei den Weihern\r
Beinwil (Freiamt), Unterdorf\r
Beinwil (Freiamt), Ab.Winters.\r
Beinwil (Freiamt), Dorf\r
Beinwil am See, Bahnhof\r
Beinwil am See\r
Beinwil am See (See)\r
Beinwil SO, Bachmättli\r
Beinwil SO, Oberbuchen\r
Beinwil SO, Neuhüsli\r
Beinwil SO, Oberbeinwil\r
Beinwil SO, Kloster\r
Beinwil SO, Schachen\r
Beinwil SO, Reh\r
Bel-Air LEB\r
Belalp\r
Belalp Bruchegg\r
Belalp Chiematte\r
Belalp Hohbiel\r
Belalp Schönbiel\r
Belfaux, Arsenal\r
Belfaux, Laiterie\r
Belfaux, Château-du-Bois\r
Belfaux, route de Lossy\r
Belfaux, Cutterwil\r
Belfaux CFF\r
Belfaux CFF, gare\r
Belfaux-Village\r
Belfaux-Village, gare\r
Bellach, Zielweg\r
Bellach, Franziskanerhof\r
Bellach, Wallierenweg\r
Bellach, Rütti\r
Bellach, Bahnhof\r
Bellach, Turbensaal\r
Bellach, Gärisch\r
Bellach, Marktstrasse\r
Bellach, Hubel\r
Bellach, Hüslerhof\r
Bellach, Tell\r
Bellach, Schulhaus\r
Bellach, Weiher\r
Bellach, Webereistrasse\r
Bellach, Turmstrasse\r
Bellach, Breitenfeld\r
Bellach\r
Bellalui\r
Bellavista\r
Bellelay, Le Domaine\r
Bellelay, école\r
Bellelay, Route de Moron\r
Bellerive VD, village\r
Bellevue GE, Rilliet\r
Bellevue GE, Valavran\r
Bellevue GE, Colovrex\r
Bellevue GE, Vieux-Valavran\r
Bellevue GE, Planet\r
Bellevue GE, Chênaie\r
Bellevue GE, Roselière\r
Bellevue GE, Ermitage\r
Bellevue GE, Mollies\r
Bellevue GE, Limites\r
Bellevue GE, mairie\r
Bellevue GE (lac)\r
Bellevue GE Port Gitana\r
Bellikon, Rehaklinik\r
Bellikon, Abzw. Hausen\r
Bellikon, Dorf\r
Bellinzona, Piazza Mesolcina\r
Bellinzona, Via Lepori\r
Bellinzona, Biblioteca\r
Bellinzona, Viale Portone\r
Bellinzona, S. Anna\r
Bellinzona, Stazione\r
Bellinzona, Via Vela\r
Bellinzona, Espocentro\r
Bellinzona, Viale G. Motta\r
Bellinzona, Posta Semine\r
Bellinzona, Scuola Media 2\r
Bellinzona, dalla Bett\r
Bellinzona, Scuola Media 1\r
Bellinzona, Via Monte Gaggio\r
Bellinzona, Cast. Montebello\r
Bellinzona, P+R Tatti\r
Bellinzona, Via dei Gaggini\r
Bellinzona, Piazza Governo\r
Bellinzona, Via Vallone\r
Bellinzona, al Ramone\r
Bellinzona, al Persico\r
Bellinzona, Bagno Pubblico\r
Bellinzona, P. Indipendenza\r
Bellinzona, Via Mirasole\r
Bellinzona, SAMB\r
Bellinzona, Parco Giochi\r
Bellinzona, Ramarro\r
Bellinzona, Via Pellandini\r
Bellinzona, Via Pierino Tatti\r
Bellinzona, Via Gerretta\r
Bellinzona, al Maglio\r
Bellinzona, Via Borromini\r
Bellinzona, Officina FFS\r
Bellinzona, Saleggi\r
Bellinzona, Ospedale\r
Bellinzona\r
Bellinzona, Cimitero\r
Bellinzona, Bramantino\r
Bellinzona, Casa Greina\r
Bellinzona, Viale Franscini\r
Bellinzona, Business Center\r
Bellinzona, Nocca\r
Bellinzona, Isolabella\r
Bellinzona, Piazza Orico\r
Bellinzona, Lusanico\r
Bellinzona, Bivio Galbisio\r
Bellinzona, S. Paolo Posta\r
Bellinzona, Carmagnola\r
Bellinzona, Cast.Sasso Corbaro\r
Bellmund, Kornfeld\r
Bellmund, Bodenacher\r
Bellmund, Jäissbergweg\r
Bellmund, St. Niklaus\r
Bellmund, Dorf\r
Bellmund, Stöckleren\r
Bellwald (Bergstation)\r
Bellwald (Talstation Richinen)\r
Belmont-sur-L., Grands Champs\r
Belmont-sur-L., Chaffeises\r
Belmont-sur-L., Rouvène\r
Belmont-sur-L., Blessoney\r
Belmont-sur-L., Pâquis\r
Belmont-sur-L., Malavaux\r
Belmont-sur-L., centre\r
Belmont-sur-L., Burenoz\r
Belmont-sur-Montreux\r
Belmont-sur-Yverdon, Battoir\r
Belmont-sur-Yverdon, Les Prés\r
Belp, Rubigenstrasse\r
Belp, Riedli\r
Belp, Giessenbad\r
Belp, Lehn\r
Belp, Muristrasse Süd\r
Belp, Aemmenmatt\r
Belp\r
Belp, Holiebi\r
Belp, Käsereistrasse\r
Belp, Zelgweg\r
Belp, Mühlematt\r
Belp, Fahrhubelweg\r
Belp, Greulebach\r
Belp, Eissel\r
Belp, Steinbachkreisel\r
Belp, Bützacker\r
Belp, Schützen\r
Belp, Neumatt\r
Belp, Bahnhof\r
Belp Steinbach\r
Belprahon, Croix-Fédérale\r
Belprahon, Amatennes\r
Belvedere Furka\r
Bémont NE, sur-le-Pont\r
Bémont NE, restaurant\r
Bendern, Post\r
Bendern, Pinocchio\r
Bendern, Widagass\r
Bendern, Under Atzig\r
Bendlehn, Bahnhof\r
Bendlehn\r
Bendolla\r
Benglen, Gerlisbrunnen\r
Benglen, Bodenacher\r
Benglen, Langwis\r
Benken SG, Neubruch\r
Benken SG, Starrberg\r
Benken SG, Zentrum\r
Benken SG, Sand\r
Benken SG, Röten\r
Benken SG\r
Benken SG, Giessen\r
Benken ZH, Dorf\r
Benkerjoch, Passhöhe\r
Bennau, Schnabelsberg\r
Bennau, Wettertannen\r
Bennau, Moos\r
Bennau, Rappenäst\r
Bennau, Schwyzerbrugg\r
Bennau, Kirche\r
Bennau, Burgeren\r
Bennwil, Obere Matten\r
Bennwil, Dorf\r
Benzenschwil, Bahnhof\r
Benzenschwil\r
Bercher, gare\r
Bercher, Vers l'Eglise\r
Bercher\r
Bercher, 7 Fontaines\r
Bercher, village\r
Bercher, Vieux-Collège\r
Berg\r
Berg am Irchel\r
Berg FR, Restaurant\r
Berg SG, Dorf\r
Berg SG, Landquart\r
Berg SG, Seeblick\r
Berg SG, Brühl\r
Bergdietikon, Vorbühl\r
Bergdietikon, Rietwies\r
Bergdietikon, Dünni\r
Bergdietikon, Bergli\r
Bergdietikon, Baltenschwil\r
Bergdietikon, Bernold\r
Bergfrieden\r
Bergün/Bravuogn, staziun\r
Bergün/Bravuogn, Tuors Davant\r
Bergün/Bravuogn, posta\r
Bergün/Bravuogn\r
Bergün/Bravuogn, Tuors Chants\r
Bergün/Bravuogn Sagliaz\r
Beride, Paese\r
Berikon, Mattenhof\r
Berikon, Stalden\r
Berikon, Kesslernmatt\r
Berikon, Kreisschule\r
Berikon, Kirche\r
Berikon-Widen\r
Berikon-Widen, Bahnhof\r
Berikon-Widen, Bahnhof Nord\r
Beringen, Höhenweg\r
Beringen, Rain\r
Beringen, Rauhergete\r
Beringen, Hägli\r
Beringen, Eggeweg\r
Beringen, Belvedere\r
Beringen, Bifang\r
Beringen, Sonne\r
Beringen, Neuweg\r
Beringen, Oberdorf\r
Beringen, Brandplatz\r
Beringen, Bahnhof\r
Beringen, Beringerfeld\r
Beringen, Oberstieg\r
Beringen, Enge\r
Beringen Bad Bf\r
Beringerfeld\r
Berisal, Brände\r
Berisal, Eggen\r
Berisal, Kehr\r
Berlens, village\r
Berlincourt\r
Berlingen\r
Berlingen, Seestrasse/Werft\r
Berlingen (See)\r
Bern, Weltpostverein\r
Bern, Weyermannshaus\r
Bern, Brunnadernstrasse\r
Bern\r
Bern, Technologiepark\r
Bern, Giacomettistrasse\r
Bern, Stapfenacker\r
Bern, Dampfzentrale\r
Bern, Läuferplatz\r
Bern, Wankdorf Center\r
Bern, Breitfeld\r
Bern, Saali\r
Bern, Petruskirche\r
Bern, Willadingweg\r
Bern, Morgartenstrasse\r
Bern, Luternauweg\r
Bern, Eigerplatz\r
Bern, Wander\r
Bern, Hasler\r
Bern, Fischermätteli\r
Bern, Pestalozzi\r
Bern, Sonnenhof\r
Bern, Nydegg\r
Bern, Dändlikerweg\r
Bern, Steigerhubel\r
Bern, Seminar\r
Bern, Brunnhof\r
Bern, Galgenfeld\r
Bern, Dübystrasse\r
Bern, Bümpliz\r
Bern, Elfenau\r
Bern, Tillierstrasse\r
Bern, Schützenweg\r
Bern, Hallmattstrasse\r
Bern, Schulhaus Wylergut\r
Bern, Spital Sonnenhof\r
Bern, Brünnenstrasse\r
Bern, Hauptbahnhof\r
Bern, Riedbachstrasse\r
Bern, Aegertenstrasse\r
Bern, Wyleregg\r
Bern, Zieglerspital\r
Bern, Pillonweg\r
Bern, Bierhübeli\r
Bern, Liebegg\r
Bern, Schönegg\r
Bern, Henkerbrünnli\r
Bern, Kaufmännischer Verband\r
Bern, Güterbahnhof\r
Bern, Loryplatz\r
Bern, Jaunweg\r
Bern, Gäbelbach\r
Bern, Fährstrasse\r
Bern, Ka-We-De\r
Bern, Felsenaustrasse\r
Bern, Chueweid\r
Bern, Bodenweid\r
Bern, Scheibenrain\r
Bern, Wylerhuus\r
Bern, Dunkerstrasse\r
Bern, Marzilistrasse\r
Bern, Badgasse\r
Bern, Mühlenplatz\r
Bern, Zentrum Paul Klee\r
Bern, UPD Waldau\r
Bern, Kocherpark\r
Bern, Zytglogge\r
Bern, Weidmatt\r
Bern, Bremgartenfriedhof\r
Bern, Sulgenau\r
Bern, Bitziusstrasse\r
Bern, Grimselstrasse\r
Bern, Haldenstrasse\r
Bern, Sandrain\r
Bern, Stöckacker (Tram)\r
Bern, Schosshaldenfriedhof\r
Bern, Tscharnergut\r
Bern, Weissensteinstrasse\r
Bern, Hardegg Vidmar\r
Bern, Tierpark\r
Bern, Monbijoubrücke\r
Bern, Fellerstrasse\r
Bern, Bümpliz Unterführung\r
Bern, Bümpliz Post\r
Bern, Bethlehem Säge\r
Bern, Holenacker\r
Bern, Chäs und Brot\r
Bern, Schanzenstrasse\r
Bern, Bollwerk\r
Bern, Bärenplatz\r
Bern, Wittigkofen\r
Bern, Gewerbeschule\r
Bern, Manuelstrasse\r
Bern, Weyermannshaus Bad\r
Bern, Munzinger\r
Bern, Monbijou\r
Bern, Unitobler\r
Bern, Viktoriaplatz\r
Bern, Cäcilienstrasse\r
Bern, Schlossmatte\r
Bern, Wylergut\r
Bern, Neufeld P+R\r
Bern, Innere Enge\r
Bern, Dennigkofengässli\r
Bern, Rosengarten\r
Bern, Helvetiaplatz\r
Bern, Breitenrain\r
Bern, Schönburg\r
Bern, Salem\r
Bern, Burgernziel\r
Bern, Melchiorstrasse\r
Bern, Löchligut\r
Bern, Stauffacherbrücke\r
Bern, Zent\r
Bern, Niederbottigen\r
Bern, Obergericht\r
Bern, Markuskirche\r
Bern, Schermenweg\r
Bern, Holligen\r
Bern, Thunplatz\r
Bern, Parkstrasse\r
Bern, Wyler\r
Bern, Forsthaus\r
Bern, Brückfeld\r
Bern, Engeried\r
Bern, Beaumont\r
Bern, Bärenpark\r
Bern, Rathaus\r
Bern, Luisenstrasse\r
Bern, Aeussere Enge\r
Bern, Tavelweg\r
Bern, Kursaal\r
Bern, Sustenweg\r
Bern, Bundesplatz\r
Bern, Blumenfeld\r
Bern, Wylerbad\r
Bern, Ramuzstrasse\r
Bern, Rossfeld\r
Bern, Oberbottigen Flühli\r
Bern, Hohliebi\r
Bern, Weltistrasse\r
Bern, Dalmazibrücke\r
Bern, Lorraine\r
Bern, Moosweg\r
Bern, Bümpliz Höhe\r
Bern, Bümpliz Schloss\r
Bern, Bösstude\r
Bern, Hüsliacker\r
Bern, Bachmätteli\r
Bern, Statthalterstrasse\r
Bern, Riedernrain\r
Bern, Inselplatz\r
Bern, Länggasse\r
Bern, Mittelstrasse\r
Bern, Untermattweg\r
Bern, Schosshalde\r
Bern, Ostring\r
Bern, Inselspital\r
Bern, Gaskessel\r
Bern, Wölflistrasse\r
Bern, Inselpark\r
Bern, Wankdorfbrücke\r
Bern, Weissenbühl (Tram)\r
Bern, Egghölzli\r
Bern, Hirschengraben\r
Bern, Bahnhof\r
Bern, Wankdorf City\r
Bern, Guisanplatz Expo\r
Bern, Wankdorfplatz\r
Bern, Kasernenstrasse\r
Bern, Winkelriedstrasse\r
Bern, Lindenhofspital\r
Bern, Huberstrasse\r
Bern, Oberbottigen Dorf\r
Bern, Bethlehem Kirche\r
Bern, Universität\r
Bern (Marzilibahn)\r
Bern Brünnen Westside\r
Bern Brünnen Westside, Bahnhof\r
Bern Bümpliz Nord, Bahnhof\r
Bern Bümpliz Nord\r
Bern Bümpliz Süd, Bahnhof\r
Bern Bümpliz Süd\r
Bern Europaplatz\r
Bern Europaplatz, Bahnhof\r
Bern Felsenau, Bahnhof\r
Bern Felsenau\r
Bern Flughafen\r
Bern Marzili\r
Bern Matte\r
Bern Münsterplattform\r
Bern Riedbach\r
Bern Riedbach, Bahnhof\r
Bern Tiefenau\r
Bern Tiefenau, Bahnhof\r
Bern Wankdorf, Bahnhof\r
Bern Wankdorf, Bahnhof Nord\r
Bern Wankdorf\r
Bern Weissenbühl\r
Bern Weissenbühl, Bahnhof\r
Berneck, Rosenberg\r
Berneck, Maienhalde\r
Berneck, Auerstrasse\r
Berneck, Taa\r
Berneck, Industrie\r
Berneck, Neugass\r
Berneck, Rathaus\r
Berneck, Gemperenstrasse\r
Berneck, Schlossbrücke\r
Berneuse (Aï)\r
Berneuse (Leysin)\r
Bernex, Luchepelet\r
Bernex, Hainard\r
Bernex, Cottenets\r
Bernex, mairie\r
Bernex, Vailly\r
Bernex, Loëx Lanance\r
Bernex, église\r
Bernex, Cressy\r
Bernex, Aigues-Vertes\r
Bernex, Sézenove Ferrand\r
Bernex, Chèvres\r
Bernex, Malpertuis\r
Bernex, Saule\r
Bernex, Pré-Polly\r
Bernex, P+R\r
Bernex, Pré-Marais\r
Bernex, Maisonnette\r
Bernex, Lully village\r
Bernex, Pont-de-Lully\r
Bernex, Les Oulaines\r
Bernex, Loëx Hôpital\r
Bernex, Blanchards\r
Bernex, Vuillonnex\r
Bernex, Guillon\r
Bernex, Maison du Terroir\r
Bernex, Sézenove village\r
Bernex, place\r
Bernex, Lully croisée\r
Bernhardzell, Dorf\r
Bernhardzell, Lee\r
Bernhardzell, Schöntal\r
Bernhardzell, Engi\r
Bernhardzell, Toregg\r
Bernina, Lagalbbahn\r
Bernina Diavolezza, Bahnhof\r
Bernina Diavolezza\r
Bernina Diavolezza (Talstat.)\r
Bernina Lagalb\r
Bernina Suot, Bahnhof\r
Bernina Suot\r
Berolle, église\r
Berolle, Les Molliettes\r
Beromünster, Waldhus\r
Beromünster, Flecken\r
Beromünster, Flugplatz\r
Beromünster, Mooskapelle\r
Beromünster, Witwil\r
Beromünster, Post\r
Beromünster, Winon\r
Berschis, Unterdorf\r
Bertschikon b. G., Müselacher\r
Bertschikon b. G., Dorf\r
Bertschikon bei Attikon\r
Berzona (Onsernone)\r
Berzona (Onsernone), Salei\r
Berzona (Verzasca), rustici\r
Berzona (Verzasca), Fontöbbia\r
Berzona (Verzasca), Paese\r
Besazio, Paese\r
Besazio, Crusagh\r
Besazio, Via Rive\r
Besazio, Fornasella\r
Besenbüren, Schulhaus\r
Besenbüren, Dorf\r
Besencens, Clos Devant\r
Betlis\r
Betschwanden, Schulhaus\r
Betten Dorf\r
Bettenalp\r
Bettenhausen, Post\r
Bettenhausen, Dorf\r
Bettens, village\r
Bettens, croisée\r
Bettingen, Dorf\r
Bettingen, Bückenweg\r
Bettingen, St. Chrischona\r
Bettingen, Altes Zollhaus\r
Bettingen, Mennweg\r
Bettingen, Diakonissenhaus\r
Bettingen, Chrischonaklinik\r
Bettlach, Post\r
Bettlach\r
Bettlach, Krone\r
Bettlach, Mathys\r
Bettlach, Bahnhof\r
Bettlach, Ariston\r
Bettlach, St. Urs\r
Bettlach, Gesundheitszentrum\r
Bettlach, Dorfplatz\r
Bettlach, Bangertli\r
Bettlach, Hübeli\r
Bettlach, Hof\r
Bettlach, Allmend\r
Bettlach, Kastels\r
Bettlach, Buchenweg\r
Bettlach, Riedstrasse\r
Bettlach, Räbacher\r
Bettlach, Hofstrasse\r
Bettlach, Gummen\r
Bettlach, Ischlag\r
Bettlach, Hochhaus\r
Bettmeralp\r
Bettmeralp (Bettmerhorn)\r
Bettmeralp (Blausee)\r
Bettmeralp (Talst. Schönbiel)\r
Bettmeralp (Talst. Wurzenbord)\r
Bettmeralp Talstation,(Seilb.)\r
Bettmeralp Talstation\r
Bettmeralp Talstation (Seilb.)\r
Bettmergrat\r
Bettwiesen\r
Bettwil, Chäsiplatz\r
Bettwil, Oberdorf\r
Betzikon SG\r
Beurnevésin, poste\r
Beurnevésin, Le Péqui\r
Beurnevésin, Couronne\r
Beuson (Nendaz), bif.Veysonnaz\r
Beuson (Nendaz), village\r
Bevaix, Les Jonchères\r
Bevaix, Chauvigny\r
Bevaix, Centre\r
Bevaix\r
Bevaix, Giratoire 3 Communes\r
Bevaix, Les Yères\r
Bevaix (bateau)\r
Bever, Bahnhof\r
Bever, Dorfzentrum\r
Bever\r
Bévieux\r
Bévieux, gare\r
Bévilard, place du village\r
Bex, Mines de Sel\r
Bex, place de la gare\r
Bex, Les Luisances\r
Bex, L'Allex\r
Bex, Pont-Neuf\r
Bex, En Rond\r
Bex, sous-gare\r
Bex, Vasselin\r
Bex, Domaine du Rhône\r
Bex, Planche-de-Fy\r
Bex, La Pâtissière\r
Bex, Cotterd\r
Bex, Les Besses\r
Bex, La Pelouse\r
Bex, Pré Meuran\r
Bex\r
Bex, Valentines\r
Bex, Résidence\r
Bex, temple\r
Bex, Servanne\r
Bex, En Bellin\r
Bex, rte de Chiètres\r
Bex, bif. Salaz\r
Bex, route de Rivarotte\r
Bex, Le Châtel\r
Bex, Stand\r
Bex, route des Monts bif.\r
Bex, Les Véneresses\r
Bex, Grand Chêne\r
Bex, Gribannaz\r
Bex, Courtraits\r
Bex, Le Chêne\r
Bex, rte d'Aigle\r
Bex, Les Dévens\r
Bex, Le Chavalet\r
Bex Pont-Neuf\r
Bex-Place-du-Marché\r
Biasca, Mulino Sciaroni\r
Biasca, Stazione\r
Biasca, Centro Sportivo\r
Biasca, Monda del Turco\r
Biasca, Quaresima\r
Biasca, Via ai Grotti\r
Biasca, Prada\r
Biasca, al Ponte\r
Biasca, Vallone\r
Biasca, Centro/Borgo\r
Biasca, Municipio\r
Biasca, Parco Emma\r
Biasca\r
Biasca, Industrie\r
Biaufond, Les Avants\r
Biaufond, douane\r
Biaufond, La Rasse\r
Bibenlos-Sonnenhof\r
Biberbrugg\r
Biberbrugg, Bahnhof\r
Biberegg\r
Biberen, Bernstrasse\r
Biberist, Bromegg\r
Biberist, St. Urs\r
Biberist, Bernstrasse\r
Biberist, Aesplistrasse\r
Biberist, Waldstrasse\r
Biberist, Emmenbrücke\r
Biberist, Bleichenbergstrasse\r
Biberist, Kaiserstrasse\r
Biberist, Post\r
Biberist, St. Elisabeth\r
Biberist, Enge\r
Biberist Ost\r
Biberist RBS\r
Biberist RBS, Bahnhof\r
Bibern SH, Dorf\r
Bibern SO, Post\r
Biberstein, Dorf\r
Biberstein, Ihegi\r
Biberstein, Wissenbach\r
Biberstein, Post\r
Bichelsee, Niederhofen-Höfli\r
Bichelsee, Dorf\r
Bichelsee, Volg\r
Bichwil, Torackerstrasse\r
Bichwil, Dorf\r
Bichwil, Riggenschwil\r
Bidermatten\r
Bidmi\r
Bidogno, Treggia\r
Bidogno, Ai Mulini\r
Bidogno, Paese\r
Bidogno, Ventiga\r
Bidogno, Bivio per Carusio\r
Bidogno, Bivio per Somazzo\r
Biel (Goms)\r
Biel (Goms), Dorfplatz\r
Biel (Kinzig)\r
Biel Mett\r
Biel-Benken BL, Stöckmatten\r
Biel-Benken BL, Brücke\r
Biel-Benken BL, Breite\r
Biel-Benken BL, Bruggmatt\r
Biel-Benken BL, Im Wyler\r
Biel-Benken BL, Kirchgasse\r
Biel-Benken BL, Unterdorf\r
Biel-Benken BL, Dorf\r
Biel/Bienne, Falkenstrasse\r
Biel/Bienne, Redernweg\r
Biel/Bienne, Rolex\r
Biel/Bienne, Place Guisan\r
Biel/Bienne, Centre Boujean\r
Biel/Bienne, Neumarkt/Marché-N\r
Biel/Bienne, BBZ/CFP\r
Biel/Bienne, Kongresshaus\r
Biel/Bienne, Brunnenplatz\r
Biel/Bienne, Zukunftstrasse\r
Biel/Bienne, Zentralplatz\r
Biel/Bienne, Magglingenbahn\r
Biel/Bienne, Feldschützenweg\r
Biel/Bienne, Bellevue\r
Biel/Bienne, Tiefenmatt\r
Biel/Bienne, Räblus Vingelz\r
Biel/Bienne, Büttenbergstrasse\r
Biel/Bienne, Brühlplatz/Breuil\r
Biel/Bienne, Finkenweg/Pinsons\r
Biel/Bienne, Aegertenstrasse\r
Biel/Bienne, Tierpark/Zoo\r
Biel/Bienne, Sägefeldweg/Scie.\r
Biel/Bienne, Schüsspark\r
Biel/Bienne, Heilmann-Strasse\r
Biel/Bienne, Am Stutz\r
Biel/Bienne, Römergüetli\r
Biel/Bienne, Piasio\r
Biel/Bienne, Schlösslistrasse\r
Biel/Bienne, Bermenstrasse\r
Biel/Bienne, Beaulieuweg/Ch. B\r
Biel/Bienne, Heideweg/Landes\r
Biel/Bienne, Eichhölzli/Pt-Chê\r
Biel/Bienne, Mahlenwald/Malv.\r
Biel/Bienne,Bf Mett/gare Mâche\r
Biel/Bienne, Ländtestrasse/Déb\r
Biel/Bienne, Bärenhof\r
Biel/Bienne, Gassmann\r
Biel/Bienne, Fuchsenried\r
Biel/Bienne, Diamantstrasse\r
Biel/Bienne, Museen/Musées\r
Biel/Bienne, Mühle/Moulin\r
Biel/Bienne, Bubenbergstrasse\r
Biel/Bienne, Grausteinweg\r
Biel/Bienne, Goldgrube/Mine-Or\r
Biel/Bienne, Gurnigelstrasse\r
Biel/Bienne, Hohlenweg/Creux\r
Biel/Bienne, Friedweg/Ch. Paix\r
Biel/Bienne, Kloosweg/Ch. Clos\r
Biel/Bienne, Laubscherweg\r
Biel/Bienne, Bf Böz/gare Champ\r
Biel/Bienne, Taubenloch\r
Biel/Bienne, Spiegel/Miroir\r
Biel/Bienne, Löhre/Mauchamp\r
Biel/Bienne, Bloeschweg\r
Biel/Bienne, Helvetiaplatz\r
Biel/Bienne, Erlacherweg/Cerl.\r
Biel/Bienne, Rue Dunant\r
Biel/Bienne, Stadtpark/Parc m.\r
Biel/Bienne, Seehofweg/Cl.-Lac\r
Biel/Bienne, Forellenweg/Truit\r
Biel/Bienne, Grünweg/Ch. Vert\r
Biel/Bienne, Staufferstrasse\r
Biel/Bienne, Lienhardstrasse\r
Biel/Bienne, Tschärisplatz/Cha\r
Biel/Bienne, Schleusenweg/Eclu\r
Biel/Bienne, Längfeld/Long-Chp\r
Biel/Bienne, Schule Geyisried\r
Biel/Bienne, Gurzelen\r
Biel/Bienne, Residenz\r
Biel/Bienne, Orpundplatz\r
Biel/Bienne, Badhausstrasse\r
Biel/Bienne, Schulen Linde/Til\r
Biel/Bienne, Schüssinsel/Suze\r
Biel/Bienne, Klinik Linde/Til\r
Biel/Bienne, Südstrasse/Midi\r
Biel/Bienne, Mösliacker/Pt-Mar\r
Biel/Bienne, Pilatusstrasse\r
Biel/Bienne, Zihlplatz/Thielle\r
Biel/Bienne, Bahnhof/Gare\r
Biel/Bienne, Nidaugasse\r
Biel/Bienne, Bibliothek\r
Biel/Bienne, Friedhof/Cimetiè.\r
Biel/Bienne, 3 Tannen/3 Sapins\r
Biel/Bienne, Sonnhalde\r
Biel/Bienne, Bözingen/Boujean\r
Biel/Bienne, Swiss Tennis\r
Biel/Bienne, Zollhaus/Octroi\r
Biel/Bienne, Renferstrasse\r
Biel/Bienne, Battenberg\r
Biel/Bienne, Lechmann\r
Biel/Bienne, Beau-Rivage\r
Biel/Bienne, Ried\r
Biel/Bienne, Amthaus/Préfect.\r
Biel/Bienne, Mettlenweg\r
Biel/Bienne, Leubringenbahn\r
Biel/Bienne, Höheweg/Hte-Route\r
Biel/Bienne, Pavillonweg\r
Biel/Bienne, Spitalzentrum/CHB\r
Biel/Bienne, Kath. Kirche/Egl.\r
Biel/Bienne, Waldrain/Crêt-Bs\r
Biel/Bienne, Schiffländte/Déb.\r
Biel/Bienne, Schlösslifeld/Cha\r
Biel/Bienne, Stadien/Stades\r
Biel/Bienne, Anna-Haller-Platz\r
Biel/Bienne\r
Biel/Bienne, Flurweg\r
Biel/Bienne, Grenchenstrasse\r
Biel/Bienne, Bärletweg\r
Biel/Bienne, Omega\r
Biel/Bienne, Dahlienweg\r
Biel/Bienne, Eglise française\r
Biel/Bienne, Kreuzplatz/Croix\r
Biel/Bienne,rte.de Reuchenette\r
Biel/Bienne, Altstadt/V. Ville\r
Biel/Bienne, Mühlestr./Moulin\r
Biel/Bienne, Kutterweg\r
Biel/Bienne, Sydebusweg/Chaton\r
Biel/Bienne, Rebenweg/Vignes\r
Biel/Bienne, Vorhölzli/Bois-Dv\r
Biel/Bienne, Länggasse/Longue\r
Biel/Bienne (Schiff/bateau)\r
Biel/Bienne Beaumont\r
Biel/Bienne Bözingenfeld/Champ\r
Biel/Bienne Hohfluh\r
Biel/Bienne Leubringenb.(Funi)\r
Biel/Bienne Magglingenb.(Funi)\r
Bière\r
Bière, gare\r
Bière, collège\r
Biezwil, Dorf\r
Biezwil, Ausserdorf\r
Bigenthal\r
Biglen, Biglenrohr\r
Biglen, Bahnhof\r
Biglen, Bären\r
Biglen\r
Biglen, Dorf\r
Bignasco, Posta\r
Bigogno, Paese\r
Bigogno, Cappella di Bigogno\r
Billens, hôpital\r
Billens, église\r
Billens, village\r
Billens, La Bioleyre\r
Billens, Les Mottes\r
Bilten, Unterbilten\r
Bilten, Linth-Escherstrasse\r
Bilten, Gerbi\r
Bilten, Bahnhof\r
Bilten, Ussbühl\r
Bilten, Sägestrasse\r
Bilten\r
Bilten, Grabenstrasse\r
Bilten, Abzw. Seggenstrasse\r
Bilten, Zentrum\r
Binn, Giesse\r
Binn, Campingplatz\r
Binn, Brunnebiel\r
Binn, Dorf\r
Binn, Fäld\r
Binn, Langthal\r
Binningen, Oberdorf\r
Binningen, Zeigerweg\r
Binningen, Hohle Gasse\r
Binningen, Tiefengraben\r
Binningen, Bottmingermühle\r
Binningen, Schloss\r
Binningen, Hügliacker\r
Binningen, Allschwilerweg\r
Binningen, Drisselweg\r
Binningen, Kronenplatz\r
Binningen, Spiegelfeld\r
Binningen, Dorenbach\r
Binningen, Neubadrain\r
Binningen, Schwimmhalle\r
Binningen, Meiriacker\r
Binz bei Maur, Fridlimatt\r
Binz bei Maur, Bautacher\r
Binz bei Maur, Twäracher\r
Binz bei Maur, Gassacher\r
Binzenhof\r
Bioggio\r
Bioggio, Via Mondonico\r
Bioggio, Centro Commerciale\r
Bioggio, Cavezzolo\r
Bioggio, Pianazzo\r
Bioggio, Cuccarello\r
Bioggio, Paese\r
Bioggio, Scuole\r
Bioggio, Via Industria\r
Bioggio, Pianoni\r
Bioggio, Bivio per Zotta\r
Bioggio Molinazzo, Stazione\r
Bioggio Molinazzo\r
Biogno, Paese\r
Bioley-Magnoux, collège\r
Bioley-Magnoux, Moulin agr.\r
Bioley-Orjulaz, chapelle\r
Birchi\r
Birchwil (Nürensdorf)\r
Birg (Schilthornbahn)\r
Birgisch, Brunnuschiirli\r
Birgisch, Eiholz\r
Birgisch, Bord\r
Birgisch, Parkplatz\r
Birmensdorf ZH, Ristet\r
Birmensdorf ZH, Landikon Bach\r
Birmensdorf ZH, Altenberg\r
Birmensdorf ZH, Aescherstrasse\r
Birmensdorf ZH, Zentrum\r
Birmensdorf ZH, Untere Risi\r
Birmensdorf ZH, Obere Risi\r
Birmensdorf ZH, Sternen/WSL\r
Birmensdorf ZH, Weissenbrunnen\r
Birmensdorf ZH\r
Birmensdorf ZH, Landikon Dorf\r
Birmensdorf ZH, Bahnhof Süd\r
Birmensdorf ZH, Bahnhof\r
Birmenstorf AG, Heigelweg\r
Birmenstorf AG, Chrüz\r
Birmenstorf AG, Schinebüel\r
Birmenstorf AG, Strählgass\r
Birmenstorf AG, Gemeindehaus\r
Bironico, Piazza Guidetti\r
Bironico, Posta\r
Bironico, Superiore\r
Birr, Vorderdorf\r
Birr, Bahnhof\r
Birr\r
Birr, Kelmatt\r
Birr, Wyden\r
Birrhard, Gemeindehaus\r
Birrhard, Steibode\r
Birrhard, Unterdorf\r
Birrhard, Usserdorf\r
Birrwil\r
Birrwil (See)\r
Birsfelden, Hard\r
Birsfelden, Salinenstrasse\r
Birsfelden, Bären\r
Birsfelden, Friedhof\r
Birsfelden, Stausee\r
Birsfelden, Schulstrasse\r
Birsfelden, Kirchmatt\r
Birsfelden, Sternenfeld\r
Birsfelden Birschöpfli\r
Birwinken, Käserei\r
Bischofszell, Schwimmbad\r
Bischofszell, Pflegeheim\r
Bischofszell, Obertor\r
Bischofszell, Sattelbogen\r
Bischofszell, Waldschenke\r
Bischofszell, Ibergstrasse\r
Bischofszell, Bruggmühle\r
Bischofszell, Stocken\r
Bischofszell Nord\r
Bischofszell Nord, Bahnhof\r
Bischofszell Stadt\r
Bischofszell Stadt, Bahnhof\r
Bisikon, Dorf\r
Bisisthal, Zentrale EBS\r
Bisisthal, Schwarzenbach\r
Bisisthal, vorder Seeberg\r
Bisisthal, Dürrenboden\r
Bisisthal, Herrgott\r
Bisisthal, Sahli Seilbahnstat.\r
Bisisthal, Laui\r
Bisisthal, Mettlen\r
Bisisthal, Steinweid\r
Bisisthal, Schlänggen\r
Bissegg, Junkholz\r
Bissegg, Wilerstrasse\r
Bissone, Arco di Campione\r
Bissone, autostrada\r
Bissone (lago)\r
Bitsch, Sattel\r
Bitsch, Wasen\r
Bitsch, Schulhaus\r
Bitsch, Unners Äbnet\r
Bitsch, Chavez\r
Bitsch, Bitschschlüecht\r
Bitsch\r
Bitsch, Kraftwerk SBB\r
Bitsch, Baletscha\r
Bitsch, Eiche\r
Bitsch, Bahnhof\r
Bitsch, Z'Matt\r
Bitsch, Sand\r
Bitsch, ze Warmu Brunnu\r
Bitzinen, Abzw.\r
Bivio, Stalvedro\r
Bivio, Las Colonnas/Passhöhe\r
Bivio, Suracqua\r
Bivio, posta\r
Blacktenboden\r
Blais Gronda\r
Blankenburg\r
Blatten (Lötschen), Eisten\r
Blatten (Lötschen), Dorf\r
Blatten (Lötschen), Langglets.\r
Blatten (Lötschen), Brücke\r
Blatten (Lötschen), Kühmad\r
Blatten b. Naters, Soll\r
Blatten b. Naters,Luftseilbahn\r
Blatten b. Naters, Montanara\r
Blatten b. Naters, Eija\r
Blatten b. Naters (Belalpbahn)\r
Blauen, Dorfplatz\r
Blauherd\r
Blauherd (Patrullarve)\r
Blausee BE\r
Bleien Liebegg, Bahnhof\r
Bleien Liebegg\r
Bleienbach, Post\r
Bleienbach, Unterdorf\r
Blickensdorf, H. Waldmann-Str\r
Blickensdorf, Dorf\r
Blignou (Ayent), Promanson\r
Blignou (Ayent), Corbarare\r
Blitzingen, Dorfplatz\r
Blitzingen\r
Blonay, Portaz\r
Blonay, village\r
Blonay\r
Blonay, Planaz\r
Blonay, Champ Dodoz\r
Blonay, Novalles\r
Blonay, gare\r
Blonay, Tusinge\r
Blonay, Antiquaire\r
Bluche\r
Bluche, village\r
Bluematt\r
Blumenau\r
Blumenstein, Reckenbühl\r
Blumenstein, Dorf\r
Blumenstein, Secki\r
Blumenstein, Bad\r
Blumenstein, Bären\r
Blumenstein, Fallbach\r
Blumenstein, Lochmannsbühl\r
Böbikon, Dorfplatz\r
Böbikon, Schulhaus\r
Bochasse\r
Böckten, Dorf\r
Böckten, Rohrmatt\r
Boden\r
Bodio TI\r
Bodio TI, Biv. per Personico\r
Bodio TI, Stazione\r
Bodio TI, Sud\r
Bodme (Gstaad)\r
Boécourt, bureau communal\r
Boécourt, Pâquerettes\r
Boécourt, Dos l'Essert\r
Boécourt, Les Esserts\r
Boécourt, Chez le Minet\r
Boécourt, collège\r
Boécourt, La Monte\r
Boécourt, Chênois\r
Bofflens, laiterie\r
Bofflens, Sur Chaumy\r
Bogis-Bossey\r
Bogn Tenigia / Tenigerbad\r
Bogno, Ponte del Morel\r
Bogno, Paese\r
Bogno, Cappella di Bogno\r
Bogno, Magnan\r
Bois-de-Chexbres\r
Bôle, Pierre-à-Sisier\r
Bôle\r
Bôle, Solitude\r
Bôle, sous Le Pré\r
Bôle, collèges\r
Bolken, Dorf\r
Boll, Rüdenweg\r
Boll, Aeschiweg/Feldackerweg\r
Boll, Oberfeldstrasse\r
Boll, Schlossstrasse\r
Boll, Obermoosstrasse\r
Boll, Gumpisbühlweg\r
Boll-Utzigen\r
Boll-Utzigen, Rain\r
Boll-Utzigen, Vorderer Rain\r
Boll-Utzigen, Bahnhof\r
Bollement\r
Bolligen, Altes Schulhaus\r
Bolligen, Lutertal\r
Bolligen, Gerenstrasse\r
Bolligen, Rüttelerweg\r
Bolligen, Reckholtern\r
Bolligen, Halen\r
Bolligen, Bahnhof\r
Bolligen, Chrottengässli\r
Bolligen, Hallenbad\r
Bolligen, Stockeren\r
Bolligen, Lutzeren\r
Bolligen, Stampachgasse\r
Bolligen\r
Bolligen, Sternen\r
Bollion, village\r
Bollion, Mussillens\r
Bollodingen, Dorf\r
Bollodingen, Hegen\r
Boltigen, Eschi Abzw.\r
Boltigen, Reidenbach\r
Boltigen, Schüpfen\r
Boltigen, Bahnhof\r
Boltigen, Schüpfboden\r
Boltigen, Eschihalten\r
Boltigen, Eschiegg\r
Boltigen, Eschi Dorf\r
Boltigen\r
Boltigen, Sommerau\r
Boltigen, Rohrmoos\r
Boltigen, Garstatt\r
Bombinasco, Paese\r
Bonaduz, Crusch\r
Bonaduz, Zault/Rheinschlucht\r
Bonaduz\r
Bonaduz, Isla\r
Bonaduz, alte Post\r
Bonatchiesse\r
Boncourt, gare\r
Boncourt\r
Boncourt, piscine\r
Boncourt, poste\r
Boncourt, bif. Stand\r
Bondo, Strada Cantonale\r
Bonfol\r
Bonfol, gare\r
Bonfol, Place Louis-Chevrolet\r
Bönigen, Lütschinenbrücke\r
Bönigen, Dorf\r
Bönigen, Schlössli\r
Bönigen\r
Bönigen, See\r
Bönigen, Sand\r
Bönigen, Hauetenbach\r
Bönigen, Wäldli\r
Bönigen, Erschwanden\r
Boningen, Kreuzplatz\r
Boningen, Ruppoldingen\r
Boningen, Hausenmühli\r
Boningen, Kappelerstrasse\r
Boningen, Gsteigli\r
Bonistock (Bettenalp)\r
Bonistock (Distelboden)\r
Boniswil, Eichholz\r
Boniswil, Alte Schmiede\r
Boniswil, Bahnhof\r
Boniswil\r
Boniswil (See)\r
Bonnefontaine, bif.\r
Bonnefontaine, village\r
Bonstetten, Isenbach\r
Bonstetten, Dorfstrasse\r
Bonstetten, Dorfplatz\r
Bonstetten, Lärchenhof\r
Bonstetten, Lätten\r
Bonstetten, Sunnenberg\r
Bonstetten-Wettswil, Bahnhof\r
Bonstetten-Wettswil\r
Bonvillars, village\r
Bonvillars, Flusel\r
Bonvillars, la Croix\r
Bonvillars, La Cour\r
Bonvillars, bas du village\r
Boppelsen, Dorf\r
Boppelsen, Hand\r
Borex, centre\r
Borex, Le Chanelet\r
Borgonovo, Villaggio\r
Bort (Firstbahn)\r
Bosco Luganese, Chiesa\r
Bosco Luganese, Bassa\r
Bosco Luganese, Paese\r
Bosco Luganese, Luchina\r
Bosco Luganese, Campolungo\r
Bosco/Gurin, Ueberab\r
Bosco/Gurin, Paese\r
Bosco/Gurin (Talstation)\r
Bosco/Gurin Grossalp\r
Bösingen, Riederberg\r
Bösingen, Cholholz\r
Bösingen, Dorf\r
Bösingen, Litzistorf\r
Bösingen, Abzw. Tuftera\r
Bossière\r
Bossonnens, village\r
Bossonnens, gare\r
Bossonnens\r
Bossonnens, route d'Oron\r
Bossy\r
Bostgas\r
Boswil-Bünzen\r
Bottens, La Rustériaz\r
Bottens, croisée\r
Bottenwil, Unterdorf\r
Bottenwil, Vorstatt\r
Bottenwil, Stäpflistrasse\r
Bottenwil, Dorf\r
Botterens, village\r
Bottighofen, Turnhalle\r
Bottighofen, Post\r
Bottighofen\r
Bottighofen (See)\r
Bottmingen, Bodenackerstrasse\r
Bottmingen, Blauenstrasse\r
Bottmingen, Talholzstrasse\r
Bottmingen, Sichelweg\r
Bottmingen, Schloss\r
Bottmingen, Batteriestrasse\r
Bottmingen, Drosselstrasse\r
Bottmingen, Fiechthag\r
Bottmingen, Stallenstrasse\r
Böttstein, Schloss\r
Böttstein, Schmidberg\r
Böttstein, Birch\r
Botyre (Ayent), bif. Blignou\r
Botyre (Ayent), centre\r
Botyre (Ayent), Le Creux\r
Botyre (Ayent), La Croisée\r
Botyre(Ayent), centre scolaire\r
Boudevilliers, Bottes\r
Boudevilliers, Jonchère\r
Boudevilliers, centre\r
Boudevilliers, La Chotte\r
Boudry, Buchilles\r
Boudry, Pôle Economique\r
Boudry, Les Tilles\r
Boudry, Bellevue\r
Boudry, Addoz\r
Boudry, Petit Ruz\r
Boudry\r
Boudry, centre sportif\r
Boudry, Vauvilliers\r
Boudry, Conrardes\r
Boudry, Baconnière\r
Boudry, Sur-la-Forêt\r
Boudry, Praz\r
Boudry, gare\r
Boudry, Cèdres\r
Boudry Littorail, gare\r
Boudry Littorail\r
Boudry Tuilière\r
Bougnone (Col de Forcle)\r
Bougnone (Pré de Bougnone)\r
Bougy-Villars, Dessus\r
Bougy-Villars, centre\r
Boulens, croisée\r
Boulens, Moulin de l'Augine\r
Bouloz, Chavannaz\r
Bouloz, Les Esserts\r
Bouloz, école\r
Bouloz, En Praz Vert\r
Bouquetins\r
Bourg-St-Bernard\r
Bourg-St-Pierre, Raveire\r
Bourg-St-Pierre, Commune\r
Bourguillon, Niquille\r
Bourguillon, La Tour\r
Bournens, école\r
Bournens, Au Mont\r
Bourrignon, Lotissement\r
Bourrignon, bif. Bürgisberg\r
Bourrignon, haut du village\r
Bourrignon, Pré Poussin\r
Bourrignon, poste\r
Boussens, Chevrine\r
Boussens, village\r
Bouveret, école des Missions\r
Bouveret, Parc Bellossy\r
Bouveret, village\r
Bouveret, gare\r
Bouveret, Aquaparc\r
Bouveret, Swiss Vapeur Parc\r
Bouveret\r
Bouveret (lac)\r
Boveresse, Séchoir\r
Boveresse, Prise-Sèche\r
Boveresse, piscine\r
Boveresse, temple\r
Boveresse, gare\r
Bovernier\r
Bowil\r
Bözberg, Altstalden\r
Bözberg, Bächle\r
Bözberg, Hübel\r
Bözberg, Vierlinden\r
Bözberg, Gemeindehaus\r
Bözberg, Ursprung\r
Bözberg, Mittlerer Hafen\r
Bözberg, Unterer Hafen\r
Bözberg, Riemen\r
Bözberg, Sandbrunnen\r
Bözberg, Oberer Hafen\r
Bözberg, Haldensteinstrasse\r
Bözberg, Neustalden\r
Bözberg, Egenwil\r
Bözberg, Linn\r
Bözberg, Kirchbözberg\r
Bözberg, Riedacher\r
Bözberg, Gallenkirch\r
Bözberg, Gäbi\r
Bözen, Ausserdorf\r
Bözen, Mitteldorf\r
Braggio\r
Brail\r
Brämabüel\r
Bramboden, Glashütte\r
Bramboden, Seebli/Luogmoos\r
Bramboden, Kirchplatz\r
Brambrüesch\r
Bramois, La Crettaz\r
Bramois, Cassières\r
Bramois, Clodevis\r
Bramois, Institut\r
Bramois, Glarey\r
Bramois, La Borgne\r
Bramois, Est\r
Bramois, Petit-Champsec\r
Bramois, Pont de Bramois\r
Bramois, Orgues\r
Bramois, les Aulnes\r
Bramois, église\r
Bramois, Ecole\r
Bramois, Paradis\r
Brand (Breite Stäg)\r
Brand (Unterbäch)\r
Brandegg\r
Branson, La Colombière\r
Branson, Pont du Rhône\r
Branson, village\r
Bratsch, Dorf\r
Braunau, Dorf\r
Braunau, Hittingen\r
Braunau, Ebnet\r
Braunwald\r
Braunwald Leglerberg\r
Brè, S. Antonio\r
Brè, Paese\r
Brè sopra Locarno/S. Bernardo\r
Brè Villaggio\r
Breganzona, Prevagno\r
Breganzona, Medi\r
Breganzona, Crespera\r
Breganzona, Posta\r
Breganzona, Camara Medi\r
Breganzona, Biogno\r
Breganzona, Pianazzo\r
Breganzona, Via Casale\r
Breganzona, Vergiò\r
Breganzona, Camara Scuole\r
Breil/Brigels, Pundual\r
Breil/Brigels, Mirada sut\r
Breil/Brigels, Mirada su\r
Breil/Brigels, Tgariel\r
Breil/Brigels, Palius\r
Breil/Brigels, Plaun Rueun\r
Breil/Brigels, La Platta\r
Breil/Brigels, Cuort\r
Breil/Brigels, Crestas\r
Breil/Brigels, S. Giacun\r
Breil/Brigels, Crest la Crusch\r
Breil/Brigels, Campliun\r
Breil/Brigels, Pendicularas\r
Breil/Brigels, casa communala\r
Breil/Brigels, Cadruvi\r
Breil/Brigels, Ruast\r
Breil/Brigels (Sesselbahn)\r
Breite b. N'dorf, W'thurerstr.\r
Breite b. N'dorf,Grünenwaldstr\r
Breite b. Nürensdorf, Sternen\r
Breite Stäg\r
Breitenbach, Oberdorf\r
Breitenbach, Grien\r
Breitenbach, Margrieben\r
Breitenbach, TCS Rastplatz\r
Breitenbach, Ebne\r
Breitenbach, Bandfabrik\r
Breitenbach, Dorfplatz\r
Breitlauenen\r
Bremblens, bas du village\r
Bremgarten\r
Bremgarten AG, Waage\r
Bremgarten AG, Stockweier\r
Bremgarten AG, West\r
Bremgarten AG, Meyerhof\r
Bremgarten AG, Badenerstrasse\r
Bremgarten AG, Bahnhof\r
Bremgarten AG, Zelgli\r
Bremgarten AG, Obertorplatz\r
Bremgarten AG, Bibenlos\r
Bremgarten AG, Zufikerstrasse\r
Bremgarten AG, Fischbacherstr.\r
Bremgarten AG, Kaserne\r
Bremgarten BE, Schloss\r
Bremgarten BE, Friedhagweg\r
Bremgarten BE, Oeschenweg\r
Bremgarten BE, Seftau\r
Bremgarten BE, Aeschebrunnmatt\r
Bremgarten BE, Ländli\r
Bremgarten BE, Chutze\r
Bremgarten BE, Kunoweg\r
Bremgarten BE, Stuckishaus\r
Bremgarten BE, Kalchacker\r
Bremgarten BE, Zentrum\r
Bremgarten Isenlauf\r
Bremgarten Obertor\r
Bremgarten West\r
Brenles, La Gaîté\r
Brenles, village\r
Breno, alla Bolla\r
Breno, Ponte di Vello\r
Breno, Crocevia per Breno\r
Breno, Paese\r
Brent, village\r
Brenzikofen\r
Bressaucourt, Les Brussattes\r
Bressaucourt, aérodrome\r
Bressaucourt, bas du village\r
Bressaucourt, poste\r
Bressonnaz, village\r
Bretaye Conche\r
Bretigny-sur-Morrens, croisée\r
Bretonnières\r
Bretzwil, Mühle\r
Bretzwil, Oberdorf\r
Bretzwil, Eichhöhe\r
Bretzwil, Dorf\r
Brie, Chalais\r
Brie, bif. Chippis\r
Brienz\r
Brienz (See)\r
Brienz BE, Wisplatz\r
Brienz BE, Glyssibach\r
Brienz BE, Buscheli\r
Brienz BE, Abzw. Giessbach\r
Brienz BE, Engi\r
Brienz BE, Bahnhof\r
Brienz BE, Stegmatte\r
Brienz BE, Dindlen\r
Brienz BE, Fulbach\r
Brienz BE, Rössliplatz\r
Brienz BE, Lehriweg\r
Brienz BE, Chilchgasse\r
Brienz BE, Gärbi\r
Brienz BE, Lammbach\r
Brienz BE, Lauenen\r
Brienz BE, Altersheim\r
Brienz BE, Im Brunnen\r
Brienz BRB\r
Brienz West\r
Brienz/Brinzauls GR, Vazerol\r
Brienz/Brinzauls GR, Dorf\r
Brienz/Brinzauls GR, Belfort\r
Brienz/Brinzauls GR, Spisagger\r
Brienzer Rothorn\r
Brienzer Rothorn (Seilb.Eisee)\r
Brienzer Rothorn (Seilbahn)\r
Brienzerberg, Biel\r
Brienzerberg, Flielti\r
Brienzerberg, Balmi\r
Brienzerberg, Margel\r
Brienzerberg, Bramisegg\r
Brienzerberg, Teiffental\r
Brienzwiler, Eichhof\r
Brienzwiler, Schulhaus\r
Brienzwiler, Banholzfluh\r
Brienzwiler, Schlüssel\r
Brienzwiler\r
Brienzwiler, Dorf\r
Brienzwiler, Bahnhof\r
Briey (station intermédiaire)\r
Brig, Riedbach\r
Brig, Simplonhalle\r
Brig, Kollegium\r
Brig, untere Bielastrasse\r
Brig, Biela Mitte\r
Brig, Termerweg\r
Brig, Nordstrasse\r
Brig, Aletschstrasse\r
Brig, Biela\r
Brig, Bachji\r
Brig, Weri\r
Brig, Klostermatte\r
Brig, Wehrmannskapelle\r
Brig, Briggustutz\r
Brig\r
Brig, Geschina\r
Brig, Stadtplatz\r
Brig, Viktoriastrasse\r
Brig, Friedhof\r
Brig, Haus Schönstatt\r
Brig, Zirkusplatz\r
Brig, Bahnhof\r
Brig, Stützen\r
Brig Autoverlad\r
Brig Bahnhofplatz\r
Brigerbad, Mittagsfluh\r
Brigerbad, Dorf\r
Brigerbad, Thermalbad\r
Brignon (Nendaz), village\r
Brignon (Nendaz), Château\r
Brion (télésiège Le Fer aval)\r
Brion (télésiège Mayen aval)\r
Brione (Verzasca), Paese\r
Brione (Verzasca), Sottomuro\r
Brione (Verzasca), Chiossetto\r
Brione (Verzasca), Ganne\r
Brione (Verzasca), Piee\r
Brione (Verzasca), Alnasca\r
Brione (Verzasca), Motta\r
Brione s. Minusio, Albaredo\r
Brione s. Minusio, Chiesa\r
Brione s. Minusio, B. Val Resa\r
Brione s. Minusio, Ai Fanghi\r
Brione s. Minusio, Cimitero\r
Brione s. Minusio, Carmelo\r
Brislach, Lärchenweg\r
Brislach, Dorf\r
Brislach, Oberdorf\r
Brissago, Posta\r
Brissago, Co' di Campo\r
Brissago, Bivio Incella\r
Brissago, Nevedone\r
Brissago, Cagetto\r
Brissago, Incella\r
Brissago, Cadogno\r
Brissago, Noveledo\r
Brissago, Municipio\r
Brissago, Miralago\r
Brissago, Gadero\r
Brissago, Clinica Hildebrand\r
Brissago, S. Giorgio\r
Brissago, Piazza del Sole\r
Brissago, Bellavista\r
Brissago, Cartogna\r
Brissago, Piodina Paese\r
Brissago, Porta\r
Brissago (lago)\r
Bristen, Dorf\r
Bristen, Wideli\r
Bristen, Kohlplatz\r
Bristen, Talstation Golzern\r
Bristen (Talstation)\r
Brittern, Wirtschaft\r
Brittnau, Kleinfeld\r
Brittnau, Einmündung Zelgli\r
Brittnau, Nelkenweg\r
Brittnau, Bifang\r
Brittnau, Liebigen\r
Brittnau, Abzw. Bahnhof\r
Brittnau, Schulhaus\r
Brittnau, Abzw. Hard\r
Brittnau, Ausserdorf\r
Brittnau, Post\r
Brittnau, Lärchenweg\r
Brittnau, Grod\r
Brittnau-Wikon\r
Brittnau-Wikon, Bahnhof\r
Broc, Le Home\r
Broc, Bataille\r
Broc, bif. Botterens\r
Broc-Chocolaterie, gare\r
Broc-Chocolaterie\r
Broc-Village, gare\r
Broc-Village\r
Broch\r
Broglio, Somprei\r
Broglio, Paese\r
Bronschhofen, Maugwil\r
Bronschhofen, Feuerwehrdepot\r
Bronschhofen, Eggwilstrasse\r
Bronschhofen, Gemeindehaus\r
Bronschhofen, Himmelrich\r
Bronschhofen, Bildfeld Nord\r
Bronschhofen, Würe\r
Bronschhofen, Bildfeld Süd\r
Bronschhofen, Im Mösli\r
Bronschhofen\r
Bronschhofen, Bildfeld Mitte\r
Bronschhofen AMP\r
Brontallo, Bivio\r
Brontallo, Paese\r
Brot-Dessous\r
Brot-Dessus, Bureau Communal\r
Brot-Dessus, Le Joratel\r
Brot-Dessus, V-Ch-les-Brandt\r
Bruderholz, Kantonsspital\r
Brügg (Bürglen UR)\r
Brügg (Bürglen UR) (Seilbahn)\r
Brügg (Schiff)\r
Brugg AG, Eisi\r
Brugg AG, Bahnhof/Zentrum\r
Brugg AG, Wildischachen\r
Brugg AG, Aare AG\r
Brugg AG, Obergrüt/Badi\r
Brugg AG, Bodenackerstrasse\r
Brugg AG, Unterführung SBB\r
Brugg AG, Kaserne\r
Brugg AG, Brücke\r
Brugg AG, Gesundheitszentrum\r
Brugg AG, Au\r
Brugg AG, Bahnhof/Campus\r
Brugg AG\r
Brugg AG, Vorstadt\r
Brügg BE, Sonnhalde\r
Brügg BE, Möschler\r
Brügg BE, Brüggfeld\r
Brügg BE, Brüggmoos\r
Brügg BE, Mehrzweckhalle\r
Brügg BE, Bärletweg\r
Brügg BE, Chaletweg\r
Brügg BE, Bahnhof\r
Brügg BE, Pfeid\r
Brügg BE, Mooswäldli\r
Brügg BE\r
Brügg BE, Industriestrasse\r
Brügg BE, Jura\r
Brüggerhorn\r
Brügglen b. Kaltacker\r
Brügglen SO, alte Post\r
Brügglen SO,Ochsenbeinschmiede\r
Brülisau, Kastenbahn\r
Brülisau (Kastenbahn)\r
Brunegg, Arena\r
Brunegg, Industriestrasse\r
Brunegg, Zentrum\r
Brünig-Hasliberg\r
Brünig-Hasliberg, Bahnhof\r
Brünig-Hasliberg, Waldegg\r
Brünigen, Gnoll\r
Brünisried, Brügi\r
Brünisried, beim Kreuz\r
Brünisried, Riedgarten\r
Brünisried, Dorf\r
Brunnadern, Spreitenbach\r
Brunnadern, Alters-und Pflegeh\r
Brunnadern, Auboden\r
Brunnadern, Anker\r
Brunnadern, Furth\r
Brunnadern-Neckertal, Bahnhof\r
Brunnadern-Neckertal\r
Brunnen, Marina Fallenbach\r
Brunnen, Seilbahn Urmiberg\r
Brunnen, Seeschlössli\r
Brunnen, Wolfsprung\r
Brunnen\r
Brunnen, Kantonalbank\r
Brunnen, Schiller\r
Brunnen, Sportplatzweg\r
Brunnen, Fallenbach\r
Brunnen, Hafenstrasse\r
Brunnen, Heideweg\r
Brunnen, See/Schiffstation\r
Brunnen, Bahnhof\r
Brunnen, Axenstrasse\r
Brunnen, Hopfräben\r
Brunnen (See)\r
Brunnenthal, Dorf\r
Brunni (Engelberg)\r
Brunni SZ, Rest. Brunni\r
Brunni SZ, Talstation LBH\r
Brunni SZ (Talstation Holzegg)\r
Brunnwil, Weiler\r
Brusada\r
Brusata (Novazzano), Dogana\r
Brusata (Novazzano), Costa\r
Brusata (Novazzano), Paese\r
Brusata (Novazzano), Al Gaggio\r
Brusata (Novazzano), Nord\r
Brusino Arsizio, Casa Diana\r
Brusino Arsizio, S. Giorgio\r
Brusino Arsizio, Confine\r
Brusino Arsizio, Funivia\r
Brusino Arsizio, Rondello\r
Brusino Arsizio, Punta Poiana\r
Brusino Arsizio (funivia)\r
Brusino Arsizio (lago)\r
Brusino Arsizio Funivia (lago)\r
Brusio, Ginetto Deviazione\r
Brusio, Piazzo Paese\r
Brusio, Garbella\r
Brusio, Müreda\r
Brusio, Ginetto Paese\r
Brusio, Pergola\r
Brusio, I Prai\r
Brusio, Posta\r
Brusio, Selvaplana\r
Brusio, Büi\r
Brusio, La Presa Sur\r
Brusio, Scuole\r
Brusio, Piazzo Fermata\r
Brusio, La Presa Sot\r
Brusio, Cotongi\r
Brusio, Municipio\r
Brusio\r
Bruson, village\r
Bruson, Valbord\r
Brüsti\r
Brüttelen\r
Brüttelen, Bahnhofstrasse\r
Brütten, Zentrum\r
Brütten, Zelgli\r
Brütten, Harossen\r
Brütten, Hofacher\r
Brüttisellen, Zentrum\r
Brüttisellen, Haldenbrücke\r
Brüttisellen, Ob. Wangenstr.\r
Brüttisellen, Gsellhof\r
Brüttisellen, Neuwisen\r
Brüttisellen, Gemeindehaus\r
Bruzella, Cimitero\r
Bruzella, Paese\r
Bubendorf, Bad\r
Bubendorf, Talhaus\r
Bubendorf, Grosstannen\r
Bubendorf, Industrie Süd\r
Bubendorf, Unterdorf\r
Bubendorf, Steingasse\r
Bubendorf, Zentrum\r
Bubikon, Bahnhof\r
Bubikon, Wihalde\r
Bubikon, Platte\r
Bubikon, Tafleten\r
Bubikon, Dorf\r
Bubikon\r
Bubikon, Bad Kämmoos\r
Bubikon, Ritterhaus\r
Büblikon, Rössli\r
Büblikon, Reusstal\r
Buch am Irchel, Sägerei\r
Buch am Irchel, Unterbuch\r
Buch am Irchel, Desibach\r
Buch am Irchel, Oberbuch\r
Buch am Irchel, Irchelhof\r
Buch am Irchel, Bebikon\r
Buch am Irchel, Wiler\r
Buch b. Frauenfeld, Trüttlikon\r
Buch bei Frauenfeld, Dorf\r
Buch SH, Brücke\r
Buch SH, Dorf\r
Buchberg, Engel\r
Buchberg, Kirche\r
Buchberg (Fähre)\r
Buchegg, Post\r
Buchegg, Schloss/Dorf\r
Buchegg, Blumenhaus\r
Büchel bei Rüthi (Rheintal)\r
Buchen BE, Schulhaus\r
Buchen BE, Schmiedsegg\r
Buchen im Prättigau, Oberdorf\r
Buchen im Prättigau, Baschär\r
Buchen im Prättigau, Terfals\r
Buchillon, Grands-Bois\r
Buchillon, collège\r
Buchli\r
Buchrain, Dorf\r
Buchrain, Sagenwald\r
Buchrain, Kirchbreite\r
Buchrain, Ronstrasse\r
Buchrain, Eichmatt\r
Buchrain\r
Buchrain, Reussbrücke\r
Buchs AG, Trieschweg\r
Buchs AG, Torfeld\r
Buchs AG, Heuweg\r
Buchs AG, Gysistrasse\r
Buchs AG, Industrie\r
Buchs AG, Fabrikweg\r
Buchs AG, Brauerei\r
Buchs AG, Alterszentrum\r
Buchs AG, Brummelstrasse\r
Buchs AG, Wynenfeld\r
Buchs AG\r
Buchs LU, Wendeplatz\r
Buchs LU, Eintracht\r
Buchs SG, Langäulistrasse\r
Buchs SG, Flösweg\r
Buchs SG, Bahnhof\r
Buchs SG, Grünaustrasse\r
Buchs SG, Haus Wieden\r
Buchs SG, EW\r
Buchs SG, Sternstrasse\r
Buchs SG, Bahnhofstrasse Ost\r
Buchs SG, Kreuzgasse\r
Buchs SG, Kath. Kirche\r
Buchs SG\r
Buchs SG, Lilienweg\r
Buchs SG, Hallenbad Flös\r
Buchs SG, Aeuli\r
Buchs SG, Rathaus\r
Buchs SG, Rheinau\r
Buchs SG, Hightech Campus\r
Buchs SG, Distelweg\r
Buchs SG, Museümli Altendorf\r
Buchs SG, Brunnenstrasse\r
Buchs SG, Zentrum\r
Buchs SG, Stüdtli\r
Buchs SG, Rheinaustrasse\r
Buchs SG, Ackerweg\r
Buchs SG, Oberstufe Grof\r
Buchs SG, Röllweg\r
Buchs SG, Wiedenstrasse\r
Buchs SG, Werdenbergersee\r
Buchs ZH, Petermoos\r
Buchs ZH, Linde\r
Buchs ZH, Post\r
Buchs ZH, Furttalstrasse\r
Buchs ZH, Industrie\r
Buchs-Dällikon, Bahnhof\r
Buchs-Dällikon\r
Buchserberg, Brunnenbett\r
Buchserberg, Kurhaus\r
Buchserberg, Hölzig Alvier\r
Buchserberg, Rhynerhaus\r
Buchserberg, Berghaus\r
Büchslen, Eintracht\r
Buckten, Sonnengasse\r
Buckten\r
Buckten, Bahnhof\r
Buckten, Dorf\r
Büetigen, Dorf\r
Büetigen, Ausserdorf\r
Buffalora P10\r
Bugnei, via Alpsu\r
Bugnei\r
Bühl bei Aarberg, Dorf\r
Bühl bei Aarberg, Höll\r
Bühl bei Aarberg, Römerhof\r
Bühl-Oberzwirgi\r
Bühler, Bahnhof\r
Bühler\r
Buhwil, Dorf\r
Buhwil, Oberdorf\r
Buhwil, Hinterbach\r
Buix, gare\r
Buix\r
Buix, village\r
Bülach, Glasi\r
Bülach, Hinterbirch\r
Bülach, Kreuzstrasse\r
Bülach, Tiefengasse\r
Bülach, Kaffeestrasse\r
Bülach, Bahnhof Ost\r
Bülach, Moritz-Meyer-Weg\r
Bülach, Sonnenhof\r
Bülach, Soliboden\r
Bülach, Bahnhof\r
Bülach\r
Bülach, Spital\r
Bülach, Hohfuri\r
Bülach, Stadthalle\r
Bülach, Stubenchlaus\r
Bülach, Berufswahlschule\r
Bülach, Einkaufszentrum Süd\r
Bülach, Mettmenriet\r
Bülach, Gewerbehaus\r
Bülach, Schuemacher\r
Bülach, Kantonsschule\r
Bülach, Grampenweg\r
Bülach, Berglistrasse\r
Bülach, Soligänter\r
Bülach, Obere Frohalde\r
Bülach, Untere Frohalde\r
Bülach, Cholplatz\r
Bülach, Güterbahnhof\r
Bülach, Witenwisen\r
Bülach, Pfarrgässli\r
Bülach, Hirslen\r
Bülach, Niederflachs\r
Bülach, Kaserne\r
Bülach, Untertor\r
Bulle, Champ-Francey\r
Bulle, Jéricho\r
Bulle, Musée gruérien\r
Bulle, Pré-Vert\r
Bulle, Place de la Gare\r
Bulle, Place du Taureau\r
Bulle, Place des Alpes\r
Bulle, Verdel\r
Bulle, Pierre-Alex\r
Bulle, Bouleyres\r
Bulle, Saucens\r
Bulle, Espace Gruyère\r
Bulle, Palud\r
Bulle, Le Terraillet\r
Bulle, St-Denis\r
Bulle, Etang\r
Bulle, St-Joseph\r
Bulle, Les Mosseires\r
Bulle, Chalamala\r
Bulle, Industrie\r
Bulle, Xavier-de-Poret\r
Bulle, Prila\r
Bulle, Pays-d'Enhaut\r
Bulle, Part-Dieu\r
Bulle, jardin Anglais\r
Bulle, gare routière\r
Bulle, Château-d'en-Bas\r
Bulle\r
Bulle, Cimetière\r
Bulle, Côte du Moulin\r
Bullet, Grande Salle\r
Bullet, village\r
Bullet, bif. Granges Champod\r
Bullet, Les Cluds\r
Bullet, bif. Les Cluds\r
Bumbach, Skilift\r
Bumbach, Alpenrose\r
Bumbach, Bödeli\r
Bumbach, Schwand\r
Bünzen, Freienhof\r
Buochs, Schürmatt\r
Buochs, Post\r
Buochs, Unterfeld\r
Buochs, Ausserdorf\r
Buochs, Hotel Postillon\r
Buochs, Fadenbrücke\r
Buochs, Linden\r
Buochs (See)\r
Buonas, Neuhofstrasse\r
Buonas, Schmidhof\r
Buonas (See)\r
Bürchen, Zum Oberhüs\r
Bürchen, Bethania\r
Bürchen, Albenwald\r
Bürchen, Bürchnerhof\r
Bürchen, Station\r
Bürchen, Eischmatten\r
Bürchen, Ibri\r
Bürchen, Zenhäusern\r
Bürchen, Rest. Panorama\r
Bürchen, Diebjen\r
Bürchen, Bürchneralp\r
Bürchen, Ackermatte\r
Bürchen, Ronalp\r
Bürchen, Schigarten\r
Bürchen, Hasel\r
Bürchen, Obscha\r
Bürchen, Lischweide\r
Bürchen, Egga\r
Bürchen (Moosalpbahn)\r
Bürchen Chalte Bode\r
Bure, Casernes\r
Bure, haut du village\r
Bure, Mairie\r
Bure, Buratte\r
Büren (Schiff)\r
Büren an der Aare, Aarbergstr.\r
Büren an der Aare, Oberbüren\r
Büren an der Aare, Bahnhof\r
Büren an der Aare, Rütifeld\r
Büren an der Aare, Städtli\r
Büren an der Aare,Solothurnstr\r
Büren an der Aare\r
Büren an der Aare, Bahnhofstr.\r
Büren an der Aare, Gehrweg\r
Büren NW, Mühleplatz\r
Büren NW, Kirchenplatz\r
Büren SO, Unterdorf\r
Büren SO, Gemeindehaus\r
Büren SO, Dorf\r
Büren SO, Moosmatt\r
Büren zum Hof, Abzw.\r
Büren zum Hof\r
Bürersteig, Passhöhe\r
Burg AG, Rössligasse\r
Burg AG, Hinterdorf\r
Burg im Leimental, Dorfplatz\r
Burgäschi\r
Burgdorf, Pflegezentrum\r
Burgdorf, Katholische Kirche\r
Burgdorf, Mühlegasse\r
Burgdorf, Blattnerweg\r
Burgdorf, Meiefeld\r
Burgdorf, City\r
Burgdorf, Willestrasse\r
Burgdorf, Hasleweg\r
Burgdorf, Tiergarten\r
Burgdorf, Bahnhof\r
Burgdorf, Hallenbad\r
Burgdorf, Spital\r
Burgdorf, Parkhaus Oberstadt\r
Burgdorf, Oberdorf\r
Burgdorf, Schlossmatt\r
Burgdorf, Lerchenbühlweg\r
Burgdorf, Poststrasse\r
Burgdorf, Nationalplatz\r
Burgdorf, Grunerstrasse\r
Burgdorf, Friedhofweg\r
Burgdorf, Ziegelei\r
Burgdorf, Eyfeldweg\r
Burgdorf, Eybrücke\r
Burgdorf, Bleichimatt\r
Burgdorf, Lorraine\r
Burgdorf, Nassi\r
Burgdorf, Choserfeld\r
Burgdorf, Friedhof\r
Burgdorf, Gymnasium\r
Burgdorf, Schützenhaus\r
Burgdorf, Gsteighof\r
Burgdorf, Bernstrasse\r
Burgdorf, Fabrikweg\r
Burgdorf, Pulverweg\r
Burgdorf, Kornhaus\r
Burgdorf, Jungfraustrasse\r
Burgdorf, Gyri Ost\r
Burgdorf, Gyrischachen\r
Burgdorf, Im Choser\r
Burgdorf, Musikschule\r
Burgdorf, Kronenplatz\r
Burgdorf, Aebistrasse\r
Burgdorf, Zeughausstrasse\r
Burgdorf, Staldenstrasse\r
Burgdorf\r
Burgdorf, Fischermätteli\r
Burgdorf, Heimiswilstrasse\r
Burgdorf Buchmatt\r
Burgdorf Steinhof, Bahnhof\r
Burgdorf Steinhof\r
Bürgenstock, Ost\r
Bürgenstock, Waldhotel\r
Bürgenstock, Zentrum\r
Bürgenstock, Residenzen\r
Bürgenstock Resort\r
Burggeist (Rigi Scheidegg)\r
Burghalden\r
Burgholz\r
Burgistein, Weier\r
Burgistein\r
Burgistein, Elbschen\r
Burgistein, Badersmaad\r
Burgistein, Hohlenwegen\r
Burgistein, Bahnhof\r
Burglauenen\r
Burglauenen, Bahnhof\r
Bürglen TG, Bahnhof\r
Bürglen TG\r
Bürglen UR, St. Sebastian\r
Bürglen UR, Urnertor\r
Bürglen UR, Hartolfingen\r
Bürglen UR, Seminar\r
Bürglen UR, Sonneggstrasse\r
Bürglen UR, Loreto\r
Bürglen UR, Trudelingen\r
Bürglen UR, Dorf\r
Bürglen UR Brügg (Ruogigbahn)\r
Burgmatt (Fontannen)\r
Burier\r
Burleun (Bergstation)\r
Burleun (Talstation La Cauma)\r
Büron, Eichenmoos\r
Büron, Dorf\r
Büron, Triengenacker\r
Bursinel, Château\r
Bursinel, village\r
Bursins, Bourdouzan\r
Bursins, village\r
Burtigny, Le Battoir\r
Burtigny, village\r
Burtigny, Les Oches\r
Buseno, Paese\r
Buseno, Botteghe\r
Büsingen (Schifflände)\r
Bussalp\r
Büsserach, Schulhaus\r
Büsserach, Niederfeld\r
Büsserach, Alte Mühle\r
Büsserach, Ziegelhütte\r
Bussigny, Tatironne\r
Bussigny, Sauge\r
Bussigny, Vieux-Four\r
Bussigny, Croix de Plan\r
Bussigny, Buyère\r
Bussigny, gare\r
Bussigny\r
Bussigny, Condémine\r
Bussigny, Sullens\r
Bussigny, Jordil\r
Bussigny, gare sud\r
Bussigny, Cocagne\r
Bussigny, Bosquet\r
Bussigny, Rente\r
Bussigny, Reculan\r
Bussigny, Sottelles\r
Bussigny, Dallaz\r
Bussigny, Riettaz\r
Bussigny, Grand-Record\r
Bussigny, St-Germain\r
Bussigny, Vallon\r
Bussigny-sur-Oron, La Resse\r
Bussigny-sur-Oron, collège\r
Bussigny-sur-Oron, croisée\r
Busslingen, Hüsler\r
Busslingen, Stetterstrasse\r
Bussnang, Gemeindehaus\r
Bussnang, Alterszentrum\r
Bussnang, Stadler\r
Bussnang\r
Busswil BE\r
Busswil TG, Dorfplatz\r
Busswil TG, Kreuzstrasse\r
Busswil TG, Hauptstrasse\r
Bussy FR, croisée\r
Bussy-Chardonney\r
Bussy-sur-Moudon, collège\r
Bussy-sur-Moudon, La Cauderie\r
Bussy-sur-Moudon, village\r
Bussy-sur-Moudon,Foulaz-Verney\r
Bütschwil, Pflegeheim\r
Bütschwil, Bahnhof\r
Bütschwil, Au\r
Bütschwil\r
Bütschwil, Engi\r
Bütschwil, Gemeindehaus\r
Bütschwil, Hofwiesen\r
Büttenhardt, Reiathöfe\r
Büttenhardt, Dorf\r
Buttes, gare\r
Buttes\r
Buttes, bif. Les Gouttettes\r
Buttes (télésiège)\r
Büttikon AG, Rossweid\r
Büttikon AG, Brunnächer\r
Büttikon AG, Oberdorf\r
Büttikon AG, Brünishalden\r
Buttikon SZ, Oberstufenschule\r
Buttikon SZ, Mühlemoos\r
Buttikon SZ, Dorfplatz\r
Buttisholz, Dorf\r
Buttisholz, Gattwil\r
Buttisholz, Stalten\r
Buttisholz, Guglern\r
Buttisholz, Allmend\r
Buttisholz, Fürti\r
Buttwil, Weinmatten\r
Buttwil, Schule\r
Buttwil, Handlung Bartlome\r
Bützberg, Neuquartier\r
Bützberg, Tell\r
Bützberg, Käserei\r
Bützberg, Unterdorf\r
Bützberg, Wyssenried\r
Buus, Untere Farnsburg\r
Buus, Tagungszentrum Waldegg\r
Buus, Aufgend\r
Buus, Turnhalle\r
Buus, Dorf\r
Buus, Buuseregg\r
Cabane (Mont Noble)\r
Cabane-de-Bois\r
Cabane-des-Diablerets\r
Cabane-des-Violettes\r
Cabbio, Dossello\r
Cabbio, S. Rocco\r
Cabbio, Posta\r
Cabbiolo, sud\r
Cabbiolo, Ara\r
Cabbiolo, Chiesa\r
Cademario, Cetta\r
Cademario, S. Ambrogio\r
Cademario, Lisone\r
Cademario, Paese\r
Cademario, Belsito\r
Cademario, Kurhaus\r
Cademario, Chiesa\r
Cadempino, Municipio\r
Cadempino, Ronchetto\r
Cadenazzo, Scuole Elementari\r
Cadenazzo, Stazione\r
Cadenazzo, Ruscadella\r
Cadenazzo, Scuola Media\r
Cadenazzo, ex Segheria\r
Cadenazzo\r
Cadenazzo, Chiesa\r
Cadera\r
Cadro, Scuole\r
Cadro, Municipio\r
Cadro, Grescia\r
Cadro, Paese\r
Cadro, Pronuovo\r
Cagiallo, San Matteo\r
Cagiallo, Paese\r
Caischavedra (Disentis)\r
Caischavedra (Gendusas)\r
Calfreisen, Abzw.\r
Calfreisen, Dorf\r
Calmut\r
Calmut (Oberalppass)\r
Calonico, Paese\r
Calonico, Probello\r
Calpiogna\r
Cama, Villaggio\r
Cama, Municipio\r
Cama, Piani di Verdabbio\r
Cama, Bivio per Norantola\r
Camedo\r
Camignolo, Sopra\r
Camignolo, Sotto\r
Camignolo, Scuola Media\r
Camischolas, via Alpsu/Strem\r
Camischolas, Zarcuns vitg\r
Camorino, San Martino\r
Camorino, Ufficio Circolazione\r
Camorino, Pro Quadri\r
Camorino, in Cumlina\r
Camorino, centro scolastico\r
Camorino, Soabbia\r
Camorino, Bivio Comelina\r
Camorino, Busciurina\r
Camorino, Villaggio\r
Campascio, Strada\r
Campascio\r
Campascio, Asilo\r
Campascio, Zalende\r
Campello\r
Camperio, Alta\r
Camperio, Piera\r
Camperio, Pianezza\r
Camperio, Monte di Sacco\r
Camperio, Ospizio\r
Campo (Blenio), Paese\r
Campo (VMaggia), al Piano\r
Campo (VMaggia), Ganelle\r
Campo (VMaggia), Chiesa\r
Campo (VMaggia), Paese\r
Campocologno, Stazione\r
Campocologno\r
Campora, Valle\r
Campora, Chiesa\r
Campra, centro nordico\r
Campra, Bivio\r
Camuns, Sutscheins\r
Camuns, spv.\r
Camuns, Masauns\r
Camuns, vitg\r
Cancorì\r
Caneggio, La Costa\r
Caneggio, S. Antonio\r
Caneggio, Paese\r
Caneggio, Sotto Ronco\r
Canobbio, Mercato Resega\r
Canobbio, Cioss\r
Canobbio, Stazione\r
Canobbio, Paese\r
Canobbio, Corba\r
Canobbio, Ganna\r
Cantine di Gandria (lago)\r
Cantonetto di Gentilino\r
Capolago, Posta\r
Capolago, Piazza\r
Capolago, Stazione\r
Capolago (lago)\r
Capolago Lago\r
Capolago-Riva S. Vitale\r
Cappella-Agnuzzo, Stazione\r
Cappella-Agnuzzo\r
Caprino (lago)\r
Carabbia, Paese\r
Carabbia, Al Canvetto\r
Carabietta, Paese\r
Carasso\r
Cardada (Funivia)\r
Cardada (Seggiovia Cimetta)\r
Carena\r
Carì, Ticc di Dentro\r
Carì, Condomini\r
Carì, Paese\r
Carì Croce\r
Carjöl\r
Carnago, Chiesa\r
Carnago, Rotonda\r
Carnago, Deca\r
Carnago, Arbustello\r
Carnago, Paese\r
Carona, Ciona\r
Carona, Paese\r
Carona, Nodivra\r
Carona, Bellavista\r
Carouge GE, Pictet-Thellusson\r
Carouge GE, Fontenette\r
Carouge GE, Moraines\r
Carouge GE, Val-d'Arve\r
Carouge GE, Tours\r
Carouge GE, Rondeau\r
Carouge GE, Ancienne\r
Carouge GE, Grange-Collomb\r
Carouge GE, Fillion\r
Carouge GE, Gavard\r
Carouge GE, Marché\r
Carouge GE, Baumgartner\r
Carouge GE, Mouettes\r
Carouge GE, Armes\r
Carouge GE, Battelle\r
Carrouge VD, Ecorcheboeuf\r
Carrouge VD, Le Borgeau\r
Carrouge VD, Gustave Roud\r
Carrouge VD, Champ du Trey\r
Carrouge VD, centre\r
Carrouge VD, Croix d'Or\r
Cartigny, Petite-Grave\r
Cartigny, Eaumorte croisée\r
Cartigny, Croix-en-Champagne\r
Cartigny, Moulin-de-Vert\r
Cartigny, village\r
Cartigny, La Passe\r
Casaccia, Löbbia\r
Casaccia, Villaggio\r
Casaccia, Cavril\r
Casenzano, La Tempelina\r
Casenzano, Maggiolo\r
Casenzano, Paese\r
Casenzano, Roncaccio\r
Casima, Al Fosso\r
Casima, Paese\r
Caslano\r
Caslano, Stazione\r
Caslano (lago)\r
Casoro, Paese\r
Cassarate\r
Cassarate, Monte Brè\r
Cassarate, Lanchetta\r
Cassarate, Scuole\r
Cassarate, Lido\r
Cassarate (lago)\r
Cassina d'Agno,Centro Sportivo\r
Cassons\r
Castagnola, Salita Olivi\r
Castagnola, S. Michele\r
Castagnola, S. Giorgio\r
Castagnola, Roncaccio\r
Castagnola, S. Grato\r
Castagnola, S. Domenico\r
Castagnola, Villa Favorita\r
Castagnola, Vallée\r
Castagnola, Tamporiva\r
Castagnola, Paese\r
Castagnola, Serenella\r
Castagnola, Capolinea\r
Castagnola (lago)\r
Castagnola Heleneum (lago)\r
Castaneda, Alla Leura\r
Castaneda, Al Ronc\r
Castaneda, Paese\r
Castaneda, Tevegno\r
Castasegna, Dogana nuova\r
Castasegna, Sura\r
Castasegna, Farzett\r
Castasegna, Vecchia Dogana\r
Castel S. Pietro, Scuole\r
Castel S.Pietro, Posta\r
Castel S.Pietro, Al Roccolo\r
Castel S.Pietro, Bv. Corteglia\r
Castel S.Pietro, Al Mulino\r
Castel S.Pietro, Obino\r
Castel S.Pietro,Pte Loverciano\r
Castelrotto, Valleggiolo\r
Castelrotto, Ospedale\r
Castiel, Galgenbühl\r
Castiel, Dorf\r
Castione, Alle Cave\r
Castione, Via S. Bernardino\r
Castione, Stazione\r
Castione, Via Cantonale\r
Castione-Arbedo\r
Castrisch, vitg\r
Castrisch, Punt dal Glogn\r
Castrisch\r
Castrisch, Isla\r
Castrisch, Schleps\r
Castro, Molino di Castro\r
Castro, Paese\r
Catto\r
Cauco, Bodio\r
Cauco, ponte\r
Caux\r
Cavadura\r
Cavadürli\r
Cavaglia\r
Cavagnago\r
Cavaione\r
Cavallino (lago)\r
Cavardiras, Via Sogn Antoni\r
Cavergno, S. Luigi\r
Cavergno, Vingera\r
Cavergno, Paese\r
Caviano, Paese\r
Caviano, Casa Fois\r
Cavigliano, Bivio Onsernone\r
Cavigliano\r
Cazis, Ausserdorf\r
Cazis, Siedlung Realta\r
Cazis, Dorf\r
Cazis, Abzw. Klinik Beverin\r
Cazis\r
Cazis, Bündner Arena\r
Cazis, Cafluri\r
Celerina, Cresta Run\r
Celerina, Suot Mulin\r
Celerina, Panorama\r
Celerina, Trais Fluors\r
Celerina, Pradatsch Suot\r
Celerina, Talstation\r
Celerina, Nuschpigna\r
Celerina, Suot Crasta\r
Celerina, Provizel\r
Celerina, Buogl\r
Celerina, Cresta Kulm\r
Celerina, Olympia Bob Run\r
Celerina, Cresta Palace\r
Celerina\r
Celerina, Rosatsch\r
Celerina, Centrum\r
Celerina, Vietta Saluver\r
Celerina (Talstation Marguns)\r
Celerina Seglias\r
Celerina Staz\r
Celerina Tschinas\r
Céligny, gare\r
Céligny, village\r
Céligny (lac)\r
Cerentino, Pedipiodi\r
Cerentino, Paese\r
Cerentino, Bivio Corsopra\r
Cerentino, Chiesa\r
Cerentino, Ponte per Corino\r
Cergnat, Pied de Crettaz\r
Cergnat, Les Noisetiers\r
Cergnat, église\r
Cernesio, Paese\r
Cerniat FR, église\r
Cerniat FR, Les Riaux\r
Cerniat FR, bif.\r
Cerniat FR, L'Adde\r
Cerniat FR, village\r
Cerniaz VD, La Croisée\r
Cernier, Bois du Pâquier\r
Cernier, Crêt Debély\r
Cernier, centre\r
Certara, Paese\r
Certara, Cardaiolo\r
Certenago, Paese\r
Certoux, Foulon\r
Certoux, village\r
Cery-Fleur-de-Lys\r
Cevio, Boscioli\r
Cevio, Visletto\r
Cevio, Residenza Betulle\r
Cevio, Centro\r
Cevio, Rovana\r
Cevio, Posta\r
Cevio, Scuola Media\r
Cevio, centro scolastico\r
Châbles FR, école\r
Châbles FR, Béthanie\r
Châbles FR, Pales\r
Chabrey, village\r
Chailly-Montreux, Bonnettes\r
Chailly-Montreux, Combe\r
Chailly-Montreux, Poneyre\r
Chailly-Montreux, village\r
Chailly-Montreux, Saussaz\r
Chailly-Montreux, Rottaz\r
Chailly-Montreux, P+R\r
Chalais, Les Zittes\r
Chalais, Bozon\r
Chalais, téléphérique\r
Chalais, poste\r
Chalais, Les Noyers\r
Chalais (station aval)\r
Chalberhöni\r
Chälen\r
Challhöchi\r
Cham, Neudorf\r
Cham, Lorzenpark\r
Cham, Niederwil\r
Cham, Langweid\r
Cham, Enikerweg\r
Cham, Gewerbestrasse\r
Cham, Riedstrasse\r
Cham, Bahnhofstrasse\r
Cham, Pfad\r
Cham, Städtli\r
Cham, Oberwil\r
Cham, Niederwil Schulhaus\r
Cham, Chamerried\r
Cham, Gemeindehaus\r
Cham, Löbernmatt\r
Cham, Hammer\r
Cham, Bahnhof\r
Cham, Röhrliberg\r
Cham, Heiligkreuz\r
Cham, Eizmoos\r
Cham, Eich\r
Cham\r
Cham, Neuhof\r
Cham, Langacker\r
Cham, Lindencham\r
Cham, Alpenblick\r
Cham, Pavatex\r
Cham (See)\r
Cham Alpenblick\r
Chambésy, Plage du Vengeron\r
Chambésy, Foretaille\r
Chambésy, Caron\r
Chambésy, Ravin\r
Chambésy, Fontaine\r
Chambésy, Le Reposoir\r
Chambésy, place\r
Chambésy, gare\r
Chambésy, Pierrière\r
Chambésy\r
Chamblon, village-hôpital\r
Chamblon, casernes\r
Chamblon, La Meunière\r
Chamblon, réservoir\r
Chambrelien, La Sauge\r
Chambrelien, village\r
Chambrelien, gare\r
Chambrelien\r
Chamby\r
Chamby, Chaulin\r
Chamby, rte de Joli-Bois\r
Chamby, gare\r
Chamby, Brison\r
Chamby, Sous Chaulin\r
Chamby-Musée\r
Chamoille (Sembrancher)\r
Chamoson, Pierre-Olivier\r
Chamoson, La Tour\r
Chamoson, Palud\r
Chamoson, poste\r
Chamoson, Tsavez\r
Chamoson, Plantys\r
Chamoson, école\r
Chamoson, cimetière\r
Chamoson, église\r
Chamoson-St-Pierre-de-C., gare\r
Chamoson-St-Pierre-de-Clages\r
Chamossaire VD\r
Champ-du-Moulin\r
Champagne, Chèzeaux\r
Champagne, Le Moulin\r
Champagne, collège\r
Champéry, Grand-Paradis\r
Champéry, Les Lanches\r
Champéry, Rte des Ravines\r
Champéry\r
Champéry, Barme\r
Champéry, Les Arcys\r
Champéry, Chemin de Vièze\r
Champéry, La Combe/Arcys\r
Champéry, Rte de la Fin\r
Champéry (Planachaux)\r
Champéry Grand Paradis\r
Champéry-Village\r
Champex, Le Signal\r
Champex, piscine\r
Champex, Lac\r
Champex, télé\r
Champex (télésiège)\r
Champex-d'Alesse\r
Champex-Lac, Jardin alpin\r
Champfèr, Guardalej\r
Champfèr, Schulhaus\r
Champlan\r
Champlönch P1\r
Champmartin\r
Champoussin, village\r
Champoussin, téléski Champeys\r
Champoussin, Les Esserts\r
Champoussin (télésiège)\r
Champoussin En l'Au\r
Champsec\r
Champsec, Téléphérique\r
Champsec Téléphérique\r
Champtauroz, église\r
Champvent, village\r
Champvent, Croix fédérale\r
Champvent, Le Battoir\r
Chamues-ch, Müsella\r
Chamues-ch, plaz\r
Chancy, usine\r
Chancy, Les Bouveries\r
Chancy, douane\r
Chancy, Raclerets\r
Chancy, village\r
Chandolin, télésiège\r
Chandolin, Les Litettes\r
Chandolin, poste\r
Chandolin (télésiège)\r
Chandon, village\r
Chandossel, village\r
Chanéaz, village\r
Changins\r
Chantarella\r
Chapella, La Resgia\r
Chapelle (Glâne)\r
Chapelle-sur-Moudon, Mulles\r
Chapelle-sur-Moudon, poste\r
Chapelle-sur-Moudon, La Combe\r
Chappelbodenbrücke\r
Chardonne, funi\r
Chardonne, rte de Châtel\r
Chardonne-Jongny\r
Chardonney, village\r
Chardonney-Château\r
Charmet\r
Charmey (Gruyère), Les Fornis\r
Charmey (Gruyère),La Fulateyre\r
Charmey (Gruyère), village\r
Charmey (Gruyère), La Tzintre\r
Charmey (Gruyère), Le Chêne\r
Charmey (Gruyère), Corbettaz\r
Charmey (Gruyère), télécabine\r
Charmey (Gruyère) (télécabine)\r
Charmey La Scie\r
Charmoille, anc. poste\r
Charmoille, village\r
Charmoille, douane\r
Charmoille, Près de l'Epine\r
Charmoille, place de l'école\r
Charrat-Fully\r
Chäserrugg\r
Chäserrugg Breit (Stöfelibahn)\r
Chasseral, col\r
Chasseral, bif. Mét. de l'Isle\r
Chasseral, Hôtel\r
Chastè\r
Châtaigneriaz\r
Châtaignier\r
Château-d'Hauteville\r
Château-d'Oex, Granges d'Oex\r
Château-d'Oex\r
Château-d'Oex, gare\r
Château-d'Oex, Le Petit-Pré\r
Château-d'Oex La Palaz\r
Château-de-Blonay\r
Château-de-Chillon (lac)\r
Châteauneuf (Conthey), Pinède\r
Châteauneuf (Conthey), centre\r
Châteauneuf-Conthey\r
Châteauneuf-Conthey, gare\r
Châtel-St-Denis, Les Creuses\r
Châtel-St-Denis, L'Epine\r
Châtel-St-Denis, gare\r
Châtel-St-Denis, Les Moilles\r
Châtel-St-Denis\r
Châtel-St-Denis, Pra de Plan\r
Châtel-St-Denis, centre\r
Châtel-St-Denis, Le Scé\r
Châtel-St-Denis, Place d'Armes\r
Châtel-St-Denis, Pontille\r
Châtel-St-Denis,centre sportif\r
Châtel-St-Denis, Bellière\r
Châtel-St-Denis, Fruence\r
Châtel-sur-Montsalv.,Chésalles\r
Châtel-sur-Montsalvens, Rest.\r
Châtelard VD\r
Châtelat, village\r
Châtelat, bif. sur le Pichoux\r
Châtillens, collège\r
Châtillens, Le Péleret\r
Châtillens\r
Châtillens, gare\r
Châtillon FR, école\r
Châtillon FR, Tilleul\r
Châtillon JU, haut du village\r
Châtillon JU, bif. Courtételle\r
Châtillon JU, bas du village\r
Châtonnaye, Les Beauregard\r
Châtonnaye, poste\r
Châtonnaye, Station Radio\r
Châtonnaye, Champ-des-Forches\r
Châtonnaye, Pré Terrapon\r
Chaumont (FUNI)\r
Chaux Ronde (Gryon)\r
Chaux-de-Mont\r
Chaux-Ronde (Villars-s.-Ollon)\r
Chavannes-de-B., Champs-Blancs\r
Chavannes-de-B., centre comm.\r
Chavannes-de-Bogis, village\r
Chavannes-de-Bogis, poste\r
Chavannes-de-Bogis, douane\r
Chavannes-de-Bogis,La Sallivaz\r
Chavannes-des-Bois\r
Chavannes-le-Chêne, Hôtel\r
Chavannes-le-Veyron, croisée\r
Chavannes-le-Veyron, St-Denis\r
Chavannes-Les-Forts, La Pierra\r
Chavannes-Les-Forts, village\r
Chavannes-R., Cèdres\r
Chavannes-R., Planta\r
Chavannes-R., Berges\r
Chavannes-R., Plaine\r
Chavannes-R., Préfaully\r
Chavannes-R., Glycines\r
Chavannes-R., Talluchet\r
Chavannes-R., Dorigny\r
Chavannes-R., UNIL-Chamberonne\r
Chavannes-R., Mouline\r
Chavannes-R., Crochy\r
Chavannes-R., UNIL-Mouline\r
Chavannes-R., Concorde\r
Chavannes-sous-Ors, centre\r
Chavannes-sous-Ors, La Fortune\r
Chavannes-sur-Moudon, La Puçaz\r
Chavannes-sur-Moudon, Burinaux\r
Chavannes-sur-Moudon, La Croix\r
Chavannes-sur-Moudon, village\r
Chavornay, route de Corcelles\r
Chavornay\r
Chavornay, gare\r
Cheiry, village\r
Chemex\r
Chemin, Ecotteaux bif.\r
Chemin, contour du Botzaz\r
Chemin, sommet village\r
Chemin, Chez-Larzes\r
Chemin, Les Frênes\r
Chemin, Trois Limites\r
Chemin-Dessous\r
Chemin-Dessus\r
Chenarlier, école\r
Chenarlier, Tarpa\r
Chenarlier, Le Boiron\r
Chêne-Bougeries, Conches place\r
Chêne-Bougeries, Malagnou\r
Chêne-Bougeries, Grange-Canal\r
Chêne-Bougeries, C.-Florissant\r
Chêne-Bougeries, Vert-Pré\r
Chêne-Bougeries, Rigaud\r
Chêne-Bougeries, Villette\r
Chêne-Bougeries, Vallon\r
Chêne-Bougeries, L.-Sismondi\r
Chêne-Bougeries,Coll.Claparède\r
Chêne-Bougeries, Grangettes\r
Chêne-Bougeries, Calandrini\r
Chêne-Bougeries, Parc Stagni\r
Chêne-Bougeries,Grange-Falquet\r
Chêne-Bougeries, Fourches\r
Chêne-Bougeries, Castan\r
Chêne-Bougeries, village\r
Chêne-Bougeries, Seymaz\r
Chêne-Bougeries, Coq-d'Inde\r
Chêne-Bougeries, Conches école\r
Chêne-Bougeries, Gradelle\r
Chêne-Bougeries, Montagne\r
Chêne-Bourg, De-Haller\r
Chêne-Bourg\r
Chêne-Bourg, Place Favre\r
Chêne-Bourg, Petit-Bel-Air\r
Chêne-Bourg, gare-Place\r
Chêne-Bourg, Peillonnex\r
Chêne-Bourg, Saut-du-Loup\r
Chêne-Bourg, Stade Trois-Chêne\r
Chêne-Bourg, gare-Tour\r
Chêne-Pâquier, En Braye\r
Chêne-Pâquier, La Cure\r
Chêne-Pâquier, anc. poste\r
Chénens, gare\r
Chénens, Café\r
Chénens\r
Chermignon, Diogne\r
Chermignon, d'en Bas\r
Chermignon, Maze\r
Chermignon, d'en Haut\r
Chernex, gare\r
Chernex, Sottex\r
Chernex, village\r
Chernex\r
Chesalles-sur-Moudon\r
Chesalles-sur-Oron\r
Cheseaux\r
Cheseaux-N., Coteau des Ifs\r
Cheseaux-N., gymnase d'Yverdon\r
Cheseaux-Noréaz, Le Pré\r
Cheseaux-sur-L., gare\r
Cheseaux-sur-L., Bel-Air\r
Cheseaux-sur-L., Martheray\r
Cheseaux-sur-L., Châtelard\r
Cheseaux-sur-L., Pâquis\r
Cheselenfirst\r
Chéserex, Au Courtillet\r
Chéserex, poste\r
Chéserex, A l'Oche\r
Chesières, Chavasses\r
Chesières, Cornuit\r
Chesières, Crêt des Nex\r
Chesières, Cormanon\r
Chesières, Les Ecovets\r
Chesières, La Bercière\r
Chesières, La Prairie\r
Chesières, Aiglon Collège\r
Chesières, La Palette\r
Chesières, cimetière\r
Chesières, Hôtel du Soleil\r
Chésopelloz, Champ-Montant\r
Chésopelloz, Le Haut\r
Chésopelloz, village\r
Chessel, Grand-Bois\r
Chessel, village\r
Chevenez, St-Maurice\r
Chevenez, place la Grangette\r
Chevenez, les Barrières\r
Chevenez, Paléo Jura\r
Chevenez, Les Moissons\r
Chevilly, Fontaines\r
Chevroux, port\r
Chevroux, La Motte\r
Chevroux\r
Chevroux, Eglise\r
Chevroux, village\r
Chexbres, Bellevue\r
Chexbres, Les Pergolas\r
Chexbres, poste\r
Chexbres-Village\r
Chexbres-Village, gare\r
Cheyres, école\r
Cheyres\r
Chez-le-Baron\r
Chez-le-Bart, Platanes\r
Chez-le-Bart, Combamare\r
Chez-le-Bart, poste\r
Chez-le-Maître-Ecoles\r
Chézard-St-Martin,Grand-Chézar\r
Chézard-St-Martin, St-Martin\r
Chézard-St-Martin, Rebatte\r
Chézard-St-Martin,Petit-Chézar\r
Chiasso, Via Motta\r
Chiasso, al Sasso\r
Chiasso, Polo Nord\r
Chiasso, Chiesa\r
Chiasso, Rampa\r
Chiasso, Via Favre\r
Chiasso, Via Guisan\r
Chiasso, Stazione\r
Chiasso, Municipio\r
Chiasso, Boffalora\r
Chiasso, Piazza Indipendenza\r
Chiasso, Scuole\r
Chiasso, Via Volta\r
Chiasso, Centro Sportivo\r
Chiasso, Viale Stoppa\r
Chiasso, Crocione\r
Chiasso, Via Soldini\r
Chiasso, Via Franscini\r
Chiasso, Via Bossi\r
Chiasso\r
Chiggiogna, Fedoccio\r
Chiggiogna, Paese\r
Chigny\r
Chinchengo\r
Chippis, Eaux-Vives\r
Chippis, poste\r
Chippis, maison bourgeoisiale\r
Chironico, Paese\r
Chironico, Grumo\r
Chironico, Area Boulder\r
Choëx, Fin de Choëx\r
Choëx, Champmagnin\r
Choëx, Bercla\r
Choëx, ch. de la Montagne\r
Choëx, Champian\r
Choëx, Route du Montet\r
Choëx, Troillet\r
Choëx, Le Sépey\r
Choëx, Combasse\r
Choëx, Vieux Manoir\r
Choëx, Les Condémines\r
Choëx, Les Cerisiers\r
Choëx, Chez Pratey\r
Choëx, Chez Bollut\r
Choëx, Croix du Têt\r
Choëx, Outre-Vièze\r
Choëx, école\r
Choëx, Les Bessettes\r
Choëx, Massillon\r
Choëx, Les Vergottes\r
Choëx, La Bâtarde\r
Choindez, gare\r
Choindez, La Charbonnière\r
Choindez, La Verrerie\r
Cholplatz\r
Choulet - Le Fer\r
Choulex, village\r
Choulex, Rouette\r
Choulex, Petit-Miolan\r
Choulex, Bonvard\r
Choulex, Champ-Dollon-Sud\r
Choulex, Chevrier\r
Choulex, Jurets\r
Choulex, Champ-Dollon\r
Chrindi\r
Chrinnenboden (Schilt)\r
Chrüzhütte\r
Chuenisbärgli\r
Chur, Post I\r
Chur, Austrasse\r
Chur, Wiesental\r
Chur, Tulpenweg\r
Chur, Erlöserkirche\r
Chur, Sardona\r
Chur, Geissweid\r
Chur, Lachen\r
Chur, Strassenverkehrsamt\r
Chur, Kaserne/Kornquader\r
Chur, Hof\r
Chur, Städeli\r
Chur, Sattelweg\r
Chur, St. Antönierrank\r
Chur, Hinter Araschgen\r
Chur, Postautostation\r
Chur, Giacomettistrasse\r
Chur, Ruchenbergstrasse\r
Chur, Rheinfels\r
Chur, Alexanderplatz\r
Chur, Weisstorkel\r
Chur, Oldtimer\r
Chur, Bondastrasse\r
Chur, Benerpark\r
Chur, Kantonsspital\r
Chur, Heckenweg\r
Chur, Meiersboden\r
Chur, Rabiosabrücke\r
Chur, Turnhalle Sand\r
Chur, Sägenstrasse\r
Chur, Kleinwaldegg\r
Chur, Plantaweg\r
Chur, Planaterrastrasse\r
Chur, Böschenstrasse\r
Chur, City West\r
Chur, Scawoba\r
Chur, Fortunastrasse\r
Chur, Gewerbliche Berufsschule\r
Chur, Florentini\r
Chur, Altes Gaswerk\r
Chur, Kalchbühl\r
Chur, Halbmil\r
Chur, Vorder Araschgen\r
Chur, Sommerau\r
Chur, Lacuna\r
Chur, Schönmattweg\r
Chur, Plankis\r
Chur, Araschgerrank\r
Chur, Kleinbruggen\r
Chur, Weinbergstrasse\r
Chur, Heiligkreuz\r
Chur, Postplatz\r
Chur, Turnerwiese\r
Chur, Quaderwiese\r
Chur, Hof Masans\r
Chur, Kreuzgasse\r
Chur, Fürstenwald\r
Chur, Berggasse\r
Chur, Meierweg\r
Chur, Lochertstrasse\r
Chur, Industriestrasse\r
Chur, Sommeraustr. Rossboden\r
Chur, Schulhaus Quader\r
Chur, Sassal\r
Chur, Quader Center\r
Chur, Salvatorenstrasse\r
Chur, Sandstrasse\r
Chur, Calunastrasse\r
Chur, Seniorenzentrum Cadonau\r
Chur, Eulengut\r
Chur, Krematorium\r
Chur, Grossbruggerweg\r
Chur, Kreuzspital\r
Chur, Reichsgasse\r
Chur, Sonnenbergstrasse\r
Chur, Obere Au P+R\r
Chur, Cadonaustrasse\r
Chur, Fontanaplatz\r
Chur, Arlibonstrasse\r
Chur, Grischunaweg FHGR\r
Chur, Fontanaspital\r
Chur, Ringstrasse FHGR\r
Chur, Güterstrasse\r
Chur, Rossboden\r
Chur, Splügenstrasse\r
Chur, Waldhaus\r
Chur, Prasserieweg\r
Chur, Tellostrasse\r
Chur\r
Chur, Kantengut\r
Chur, Bahnhofplatz\r
Chur, Medienhaus/Rossboden\r
Chur, Rigahaus\r
Chur, Stelleweg\r
Chur, Bürgerheim\r
Chur, Fürstenwaldstrasse\r
Chur, Bodmer\r
Chur, Obere Au\r
Chur, Rätusstrasse\r
Chur, Fondeiweg\r
Chur, Plessurfall\r
Chur, Medienhaus\r
Chur, Boletta\r
Chur, Neubruchstrasse\r
Chur, Albula\r
Chur, Amselweg\r
Chur, Daleustrasse\r
Chur, Brambrüeschb./Stadthalle\r
Chur, Malteser\r
Chur (Brambrüeschbahn)\r
Chur Altstadt\r
Chur West\r
Chur Wiesental\r
Churwalden, Lax\r
Churwalden, Rathaus\r
Churwalden, Egga\r
Churwalden, Bergbahnen\r
Churwalden, Post\r
Churwalden, Furnerschhus\r
Churwalden, Rüti\r
Churwalden (Talst.Pradaschier)\r
Churwalden (Talstation)\r
Cimadera, Paese\r
Cimadera, Treciò\r
Cimalmotto\r
Cimetta\r
Cimo, Paese\r
Cimo, Canavée\r
Cinuos-chel, Suot il Chaunt\r
Cinuos-chel-Brail, staziun\r
Cinuos-chel-Brail\r
Cioss Prato (Bedretto)\r
Clarens, Tavel\r
Clarens, Pertuiset\r
Clarens\r
Clarens, Jaman\r
Clarens, gare\r
Clarens, Basset\r
Clarens, rue du Port\r
Clarens, dépôt VMCV\r
Clarens, Oche-Thorens\r
Clarens, Gambetta\r
Clarens, Baugy\r
Clarens, centre\r
Clarens, St-Georges\r
Clarens (lac)\r
Clarmont, village\r
Claro, Biv. per Scubiago\r
Claro, Sud\r
Claro, Scubiago\r
Claro, Bivio Ponton\r
Claro, Paese\r
Claro, San Nazzaro\r
Claro, Cassero\r
Claro, Ponton\r
Clavadeler Alp (Jakobshorn)\r
Clavadeler Alp (Jatzhorn)\r
Clavadeler Berg\r
Clèbes (Nendaz), Le Fio\r
Clèbes (Nendaz), village\r
Clünas\r
Clünas (Bergstation Ftan)\r
Coeuve, rte de Porrentruy\r
Coeuve, école\r
Coeuve, Le Crêt\r
Coffrane, La Pelleuse\r
Coffrane, Rue du Collège\r
Coglio\r
Coinsins, Auberge\r
Coinsins, Mimorey\r
Coinsins, Les Vettanes\r
Col Brunet\r
Col de Forcle (Leytron)\r
Col-de-Bretaye\r
Col-de-Bretaye (télésiège)\r
Col-de-Chassoure\r
Col-de-Chassoure (Tortin)\r
Col-de-la-Forclaz\r
Col-de-Soud\r
Col-des-Gentianes\r
Col-des-Planches\r
Col-du-Pillon, Glacier 3000\r
Col-du-Pillon (téléphérique)\r
Col-du-Sanetsch\r
Coldrerio, Colle degli Ulivi\r
Coldrerio, Mercole\r
Coldrerio, Ideal\r
Coldrerio, Paese\r
Colla, Paese\r
Colla, Chiesa di Colla\r
Collex, La Prêle\r
Collex, école\r
Collex, Seuchat\r
Collex, Bracasset\r
Collex, Emery\r
Collex, centre\r
Collex, Vireloup\r
Collex, Crest-d'El\r
Collinasca, Casa de Torri\r
Collinasca, Paese\r
Collinasca, L'Ovi\r
Collombey, rte de la Fin\r
Collombey, Centre commercial\r
Collombey, Guinchet\r
Collombey, Reutet-Bovéry\r
Collombey, Corbier\r
Collombey, ch. du Verger\r
Collombey, village\r
Collombey, église\r
Collombey, gare\r
Collombey, Les Perraires\r
Collombey, Les Neyres Raccot\r
Collombey, Les Neyres Chapelle\r
Collombey, Chapelle\r
Collombey, St Didier\r
Collombey, Charmettes\r
Collombey\r
Collombey, Fontaine\r
Collombey, Barme\r
Collombey-Village\r
Collonge (funi)\r
Collonge (funi), rue du Temple\r
Collonge-Bellerive, Collonge\r
Collonge-Bellerive, Bellerive\r
Collonge-Bellerive, Bois-Caran\r
Collonge-Bellerive, Savonnière\r
Collonge-Bellerive,Pré-d'Orsat\r
Collonge-Bellerive, La Gabiule\r
Collonges, école\r
Collonges VS\r
Cologny, croisée\r
Cologny, Chemin des Fours\r
Cologny, Pré-Picot\r
Cologny, Falquets\r
Cologny, Montalègre\r
Cologny, Tour-Carrée\r
Cologny, La Belotte\r
Cologny, Fraidieu\r
Cologny, Clos du Môlan\r
Cologny, temple\r
Cologny, Boissier\r
Cologny, mairie\r
Cologny, Ruth\r
Cologny, Rippaz\r
Cologny, Le-Fort\r
Cologny, Bessinge\r
Cologny, Righi\r
Colombier NE, ch. des Ecoliers\r
Colombier NE, Rue de L'Etang\r
Colombier NE, Bas-des-Allées\r
Colombier NE, Cescole\r
Colombier NE\r
Colombier NE, giratoire gare\r
Colombier NE, Cent-Pas\r
Colombier NE, St-Etienne\r
Colombier NE, Sources\r
Colombier NE Allées Littorail\r
Colombier NE Les Chézards\r
Colombier NE Littorail\r
Colombier VD, En Plan\r
Colombier VD, poste\r
Comano, Municipio\r
Comano, Studio TV\r
Comano, Rotonda\r
Comano, Quattro Strade\r
Comano, Chiesa\r
Comba Médran (Mayentset)\r
Comba Médran (Tête de Vaux)\r
Combatzeline\r
Combe de la Breya\r
Combe-de-la-Tournelle\r
Combe-Tabeillon\r
Combremont-le-Grand, Le Garage\r
Combremont-le-Grand, Crévy\r
Combremont-le-Grand, église\r
Combremont-le-Grand, village\r
Combremont-le-Petit, village\r
Combremont-le-Petit, poste\r
Commeire\r
Commugny, Monthoux\r
Commugny, centre\r
Commugny, Pins/centre comm.\r
Comologno, Paese\r
Comologno, Cappellino\r
Comologno, Dazio\r
Comprovasco, Biv. per Leontica\r
Comprovasco, Piazza\r
Conche (Ayent)\r
Concise, Camp de Vaumarcus\r
Concise, haut du village\r
Concise, Bas-du-Pavé\r
Concise, Les Biolles\r
Concise, La Raisse\r
Concise\r
Concise, village\r
Concise, Platet-Christine\r
Concise, Prise-Gaulaz\r
Concise (bateau)\r
Condémines\r
Confignon, Croix-de-Chavant\r
Confignon, mairie\r
Confignon, croisée\r
Confignon, Bains de Cressy\r
Confignon, La Dode\r
Confignon, Berthet\r
Confin Basso\r
Confin Basso (staz. a valle)\r
Constantine, collège\r
Conters im Prättigau, Malutt\r
Conters im Prättigau, Brunnen\r
Conters im Prättigau, Dorf\r
Conters im Prättigau,Cafilonga\r
Conthey, Chalet Le Duc\r
Conthey, salle polyvalente\r
Conthey, village\r
Conthey, Bourg\r
Conthey, centre commercial\r
Conthey, bif. Conthey-Plan\r
Conthey, Cave Provins\r
Conthey, Grands-Prés\r
Contone, Posta\r
Contra, Costa\r
Contra, Al Ronco\r
Contra, Diga\r
Contra, Alle Zotte\r
Contra, Paese\r
Contra, Moresio\r
Contra, di Sotto\r
Coppet, route du Jura\r
Coppet\r
Coppet, gare\r
Coppet, Les Rojalets\r
Coppet, Les Marais\r
Coppet, route de Tannay\r
Coppet, chemin des Rannaux\r
Coppet (Conthey)\r
Coppet (lac)\r
Corban, bas du village\r
Corban, place du 23 juin\r
Corban, Sous-Vassa\r
Corbella\r
Corbeyrier, Luan\r
Corbeyrier, place Champillon\r
Corbeyrier, Vers la Doey\r
Corbeyrier, poste\r
Corbeyrier, Vers-Cort\r
Corbeyrier, Vers-la-Crête\r
Corbeyrier, En Saconnex\r
Corbier\r
Corbières, Pont de Corbières\r
Corbières, le Vanel\r
Corbières, village\r
Corcapolo\r
Corcelles BE, village\r
Corcelles BE\r
Corcelles NE, église\r
Corcelles NE, haut du village\r
Corcelles NE, Pharmacie\r
Corcelles NE, Collège\r
Corcelles NE, rue à Jean\r
Corcelles NE, Les Vernets\r
Corcelles NE, Place de la Gare\r
Corcelles NE, Nicole\r
Corcelles-le-Jorat, Le Torel\r
Corcelles-le-Jorat, village\r
Corcelles-le-Jt, Champ-la-Dame\r
Corcelles-Nord\r
Corcelles-Peseux\r
Corcelles-près-Concise,village\r
Corcelles-Sud\r
Corcelles-Sud, gare\r
Corcelles-sur-Chav., rte Chav.\r
Corcelles-sur-Chav., Tuilerie\r
Corcelles-sur-Chav., village\r
Corcelles-sur-Chav., Longeraie\r
Cordast, Kirche\r
Cordast, Schulhaus\r
Corgémont\r
Corgémont, Place Stauffer\r
Corin-de-la-Crête, village\r
Corin-de-la-Crête, Corinna\r
Corippo, Pontid\r
Corippo, Bivio\r
Corjolens, La Croisée\r
Corjolens, village\r
Corjolens, Maison Rouge\r
Corjolens, Champ Thomas\r
Cormérod, Partiers\r
Cormérod, Paccoty\r
Cormérod, village\r
Corminboeuf, Amont\r
Corminboeuf, Centre-sportif\r
Corminboeuf, Jo-Siffert\r
Corminboeuf, village\r
Corminboeuf, Montaubert\r
Corminboeuf, anc. poste\r
Corminboeuf, Les Avudrans\r
Cormondrèche, Prieuré\r
Cormondrèche, Grand'Rue\r
Cormoret\r
Cormoret, Cour à Moret\r
Cornaux, gare\r
Cornaux NE\r
Corne de Sorebois\r
Cornol, haut du village\r
Cornol, bas du village\r
Cornol, église\r
Corpataux, village\r
Correvon, village\r
Corseaux, Gonelles\r
Corseaux, Châno\r
Corseaux, Cerisiers\r
Corseaux, Maraîche\r
Corseaux, Chatacombe\r
Corseaux, village\r
Corseaux, Grand-Pin\r
Corseaux, collège\r
Corseaux, salle de gym\r
Corseaux, Félix-Cornu\r
Corseaux, Délassement\r
Corseaux\r
Corseaux-Cornalles\r
Corserey, Café du Châtaignier\r
Corserey, village\r
Corserey, anc. poste\r
Corsier GE, Prés-Palais\r
Corsier GE, Maisons-Neuves\r
Corsier GE, village\r
Corsier GE, port\r
Corsier GE, Le Soleil\r
Corsier GE (lac)\r
Corsier-sur-Vevey, Omballes\r
Corsier-sur-Vevey, Chaplin\r
Corsier-sur-Vevey, Champ-Ban\r
Corsier-sur-Vevey, village\r
Corsier-sur-Vevey, Châtelard\r
Corsier-sur-Vevey, Nant\r
Corsier-sur-Vevey, Riant-Mont\r
Corsier-sur-Vevey, Sous-Nant\r
Corsier-Vevey, Cure d'Attalens\r
Cortaillod, Chanélaz\r
Cortaillod, Buffet d'un Tram\r
Cortaillod, Bas-de-Sachet\r
Cortaillod, Temple\r
Cortaillod, Cort'Agora\r
Cortaillod, Câbles\r
Cortaillod, Graviers\r
Cortaillod, Les Jordils\r
Cortaillod (bateau)\r
Cortébert, l'Ours\r
Cortébert\r
Cortemezzano di Peccia\r
Corticiasca, Puffino\r
Corticiasca, Vecchia\r
Corticiasca, Paese\r
Cortignelli\r
Cortivallo, Paese\r
Cortivallo, Casa Anziani\r
Corvatsch\r
Corviglia (Bergst. Marguns)\r
Corviglia (Bergstation)\r
Corviglia (Talst.Plateau Nair)\r
Corviglia (Talstat. Piz Nair)\r
Corzoneso, Roccabella\r
Corzoneso, Paese\r
Corzoneso, Sasso Rorina\r
Corzoneso, Valasci\r
Corzoneso Piano, Bivio\r
Corzoneso Piano, Scaradra\r
Cossonay-Penthalaz\r
Cossonay-Penthalaz, gare\r
Cossonay-Penthalaz (funi)\r
Cossonay-Ville, Bicentenaire\r
Cossonay-Ville, Chavannes\r
Cossonay-Ville, Chien-Boeuf\r
Cossonay-Ville, Champ-Vionnet\r
Cossonay-Ville\r
Cossonay-Ville, centre\r
Cossonay-Ville, Tannaz\r
Cossonay-Ville, Pré aux Moines\r
Cossonay-Ville, La Condémine\r
Costa (Funivia)\r
Cottens FR\r
Cottens FR, centre commercial\r
Cottens FR, gare\r
Cottens VD, La Tuilière\r
Cottens VD, La Caroline\r
Cottens VD, village\r
Cotterg, village\r
Cotterg-d'en-Haut\r
Courcelon\r
Courchapoix, village\r
Courchapoix, bas du village\r
Courchavon\r
Courchavon, route de la Gare\r
Courfaivre, centre\r
Courfaivre, Tuilerie\r
Courfaivre, centre sportif\r
Courfaivre\r
Courfaivre, gare\r
Courfaivre, rue du Chételay\r
Courgenay, zone industrielle\r
Courgenay, Petite Gilberte\r
Courgenay\r
Courgenay, gare\r
Courgenay, Noires Terres\r
Courgenay, haut du village\r
Courgenay, Pierre Percée\r
Courgevaux, village\r
Courlevon, Dorf\r
Cournillens, village\r
Cournillens, Es Mottes\r
Courrendlin, centre\r
Courrendlin, casino\r
Courrendlin, écoles\r
Courroux, Les 3 Farine\r
Courroux, Sous-Rosé\r
Courroux, Birse\r
Courroux, La Forge\r
Court, église\r
Court, gare\r
Court\r
Courtaman, Studenmatt\r
Courtaman, centre\r
Courtedoux, Place St. Martin\r
Courtedoux, le Clôtre\r
Courtelary\r
Courtelary, Place de la gare\r
Courtemaîche, gare\r
Courtemaîche, viaduc\r
Courtemaîche\r
Courtemaîche, Pont de la Gare\r
Courtemaîche, centre\r
Courtepin, gare\r
Courtepin\r
Courtételle, village\r
Courtételle\r
Courtételle, Courtemelon\r
Courtételle, Moulin\r
Courtételle, gare\r
Courtételle, Eglise\r
Courtételle, Sorne\r
Courtételle, Forge\r
Courtételle, Avenir\r
Courtételle, St.-Maurice\r
Courtion, bif.\r
Courtion, Oleyres bif.\r
Courtion, école\r
Courtion, Moulin-Neuf\r
Cousset, gare\r
Cousset, centre sportif\r
Cousset\r
Couvet, gare\r
Couvet, espaceVAL\r
Couvet, La Léchère\r
Couvet\r
Couvet, centre commercial\r
Couvet, hôpital\r
Couvet, bif. de Plancemont\r
Couvet, Viaduc\r
Couvet, Le Preyel\r
Cozzo, Paese\r
Crana, Alle Bolle\r
Crana, Paese\r
Crana, Ponte Oscuro\r
Crans VD, Port\r
Crans VD, La Versoix\r
Crans VD, village\r
Crans VD, Les Landes\r
Crans VD, Châtillon\r
Crans-Montana, Zier-Régent\r
Crans-Montana, Pirraparc\r
Crans-Montana, Genevois\r
Crans-Montana, Etoile\r
Crans-Montana, Comba\r
Crans-Montana, Vernaziet\r
Crans-Montana, bif.rte du Golf\r
Crans-Montana, télé Violettes\r
Crans-Montana, Lac Grenon\r
Crans-Montana, poste\r
Crans-Montana, Etang Long\r
Crans-Montana, Dent-Blanche\r
Crans-Montana, Les Ehripis\r
Crans-Montana, Devins\r
Crans-Montana, Lac Moubra\r
Crans-Montana, Sport Club\r
Crans-Montana, La Delége\r
Crans-Montana, Le Mèrignou\r
Crans-Montana, Pas de l'Ours\r
Crans-Montana, Pradouvan\r
Crans-Montana, gare\r
Crans-Montana, bif Centre Val.\r
Crans-Montana, Les Briesses\r
Crans-Montana, Victoria\r
Crans-Montana, Sur Moubra\r
Crans-Montana, Ycoor\r
Crans-Montana, télé Cry d'Er\r
Crans-Montana, Barzettes\r
Crans-Montana, télé Arnouva\r
Crans-Montana, Plans Mayens\r
Crans-Montana, Primeroses\r
Crans-Montana, Lucernois\r
Crans-Montana, Centre Moubra\r
Crans-Montana, Vermala Centre\r
Crans-Montana, Vermala Cervin\r
Crans-Montana, Essampilles\r
Crans-Montana, Sporting\r
Crans-Montana, Crans Forest\r
Crans-Montana, Clairière\r
Crans-Montana, Pirrazilina\r
Crans-Montana, Maroz\r
Crans-Montana, Vermala Soleil\r
Crans-Montana, Montagnette\r
Crans-Montana, Cocagne\r
Crans-Montana, Rive du Golf\r
Crans-Montana, Résidence Forêt\r
Crans-Montana, Scandia\r
Crans-Montana, Grand-Place\r
Crans-Montana gare\r
Crans-Montana Route Télé\r
Crans-Montana Route Vermala\r
Crans-Montana Tsaumiau\r
Crap Masegn (Vorab)\r
Crap Sogn Gion\r
Crassier, Ancienne Gare\r
Crassier, Levrioux\r
Crassier, La Scie du Verger\r
Crassier, collège secondaire\r
Crassier, Ferme du Château\r
Cremignone, Paese\r
Cremin, village\r
Crémines, centre du village\r
Crémines\r
Crémines-Zoo\r
Cresciano, Palazzi\r
Cresciano, Paese\r
Cresciano, Stazione\r
Cresmino, Funivia\r
Cresmino, Case\r
Cresmino, Cratolo\r
Cressier FR, bif.\r
Cressier FR, gare\r
Cressier FR\r
Cressier NE, Sansfoin\r
Cressier NE, gare\r
Cressier NE, Malpierres\r
Cressier NE\r
Crest la Siala\r
Crésuz, village\r
Crêt du Midi (station amont)\r
Crêt-d'y-Bau\r
Crêt-près-S.,Champ-de-l'Eglise\r
Crêt-près-Semsales, Bremudens\r
Crêt-près-Semsales, école\r
Creux-de-Genthod\r
Creux-du-Van, Le Soliat\r
Creux-du-Van, Chez les Favre\r
Cries\r
Crissier, Arc-en-Ciel\r
Crissier, Mongevon\r
Crissier, Lentillières\r
Crissier, Feleire\r
Crissier, Chisaz\r
Crissier, scierie\r
Crissier, Montremoën\r
Crissier, Closalet\r
Crissier, Jura\r
Crissier, Marcolet\r
Crissier, Timonet\r
Crissier, Vernie\r
Crissier, Noutes\r
Crissier, Place Centrale\r
Crissier, Chicorée\r
Crissier, bourg\r
Croglio, Ronco Regina\r
Croglio, Bivio di Luzzo\r
Croglio, Paese\r
Croglio, Peschiera\r
Croglio, Madonnone\r
Croix-de-Culet\r
Croix-de-Rozon, Route d'Annecy\r
Croix-de-Rozon, place\r
Croix-de-Rozon, Evordes\r
Croix-de-Rozon, douane\r
Croix-des-Ruinettes\r
Croix-du-Nant\r
Cronay, village\r
Cronay, Moulin du Pont\r
Cronay, église\r
Cronay, Le Crêt\r
Croy, collège\r
Croy, anc. Battoir\r
Croy, En Fochau\r
Croy-Romainmôtier\r
Croy-Romainmôtier, gare\r
Cruina\r
Crusch\r
Cry d'Er (Arnouva télés.amont)\r
Cry-d'Er (Bellalui)\r
Cry-d'Er (Crans-s.-S.)\r
Cry-d'Er (Marolires)\r
Cuarnens, Le Pont\r
Cuarny, église\r
Cudrefin, La Sauge\r
Cudrefin, Le Moulin\r
Cudrefin, camping\r
Cudrefin, Vers-chez-Jacot\r
Cudrefin, place de la Tour\r
Cudrefin\r
Cugnasco, Posta\r
Cugnasco, Massarescio\r
Cugy FR, gare\r
Cugy FR\r
Cugy VD, Le Moulin\r
Cugy VD, village\r
Cugy VD, Grillon\r
Cugy VD, Cavenette\r
Cugy VD, poste\r
Cully, gare\r
Cully\r
Cully, Hôpital de Lavaux\r
Cully (lac)\r
Cumascheals\r
Cumbel, Casa Miraval\r
Cumbel, Farmarins\r
Cumbel, vitg\r
Cumbel, Valgronda\r
Cumbel, Vitget Cuschnaus\r
Cumiasca, Campiroi\r
Cumiasca, Cortia\r
Cumiasca, Chiesa\r
Cumpadials, Casa Sogn Giusep\r
Cumpadials, vitg\r
Cumpadials, Laus\r
Cunter, Burvagn\r
Cunter, Sur Strada\r
Cunter, Mulegn\r
Cunter, Las Vals\r
Cunter, Sumvei\r
Cunter, vischnanca\r
Cunter, Dafora\r
Cuolm da Vi\r
Cuolm Sura (Piz Mundaun)\r
Cuolm Sura (Valata)\r
Cuolm Val\r
Curaglia, posta\r
Cureggia, Bassa\r
Cureggia, Paese\r
Cureglia, Paese\r
Cureglia, Grotti\r
Cureglia, Bellavista\r
Cureglia, Rotonda\r
Curio, Bivio\r
Curio, Molino di Curio\r
Curio, Paese\r
Curnius\r
Curtilles, village\r
Curtina, Posta Vecchia\r
Curtina, Paese\r
Curtinatsch\r
Curtinella\r
Curzútt/S. Barnard\r
Dachsen, Bahnhof\r
Dachsen, Lindenstrasse\r
Dachsen\r
Dägerlen, Oberwil\r
Dägerlen, Berg\r
Dägerlen, Lindenhof\r
Dagmersellen, Bildungspark\r
Dagmersellen, Industriepark\r
Dagmersellen\r
Dagmersellen, Bahnhof\r
Dagmersellen, Löwen\r
Daillens, village\r
Daillens, Les Montets\r
Daillon, la Chapelle\r
Daillon, Ferme Coppex\r
Daillon, la Vella\r
Dallenwil\r
Dallenwil (Wirzwelibahn)\r
Dällikon, Seitenacker\r
Dällikon, Dorf\r
Dällikon, Industrie\r
Dalpe, Valle\r
Dalpe, Villaggio\r
Dalpe, Campiano\r
Dalpe, Cornone\r
Damphreux, Sous la Côte\r
Damphreux, Le Coinat\r
Damvant, église\r
Dangio, Chiesa\r
Dangio, Paese\r
Däniken, Bahnhof\r
Däniken, Oberdorf\r
Däniken, Allmend\r
Däniken, Stapflenweg\r
Däniken, Kapelle\r
Däniken, Reformierte Kirche\r
Däniken, Prüssstrasse\r
Däniken, Eichweid\r
Däniken, Ettenberg\r
Däniken, Hogenweid\r
Däniken, Talhubel\r
Däniken, Aarefeld\r
Däniken, Kraftwerkstrasse\r
Däniken, Post\r
Däniken, Pumpwerk\r
Däniken, Kernkraftwerk\r
Däniken SO\r
Dänikon, Rotflue\r
Dänikon, Gemeindehaus\r
Danis, vitg\r
Danusa\r
Dardagny, douane\r
Dardagny, Route de Malval\r
Dardagny, château\r
Dardagny, Malval hameau\r
Dardagny, Les Tilleuls\r
Dardagny, Malval Centre Nature\r
Dardagny, Malval chapelle\r
Dardagny, Essertines\r
Dardagny, Le Roulave\r
Dardin, Patnasa\r
Dardin, vitg\r
Därligen, Bahnhof\r
Därligen, Dorf\r
Därligen, Tracht\r
Daro, Via Malmera\r
Daro, Pian Lorenzo\r
Daro, Scuole\r
Daro, Pichitt\r
Därstetten\r
Dättlikon\r
Dättwil AG, Täfere\r
Dättwil AG, Langacker\r
Dättwil AG, Segelhof\r
Dättwil AG, Pinte\r
Dättwil AG, Baregg\r
Dättwil AG, Dorf\r
Dättwil AG, Rüteli\r
Daubensee\r
Davesco, Ponte di Valle\r
Davesco, Casteldavesco\r
Davesco, Via Sonvico\r
Davesco, Paese\r
Daviaz, village\r
Daviaz, La Vorpillière\r
Daviaz, Charrière\r
Daviaz, Vers-chez-Combe\r
Davos Clavadel, Witi\r
Davos Clavadel, Klinik\r
Davos Clavadel,Abzw. Wanderweg\r
Davos Clavadel, Bäbi\r
Davos Clavadel, Klinikstrasse\r
Davos Clavadel, Eggeli\r
Davos Clavadel, Mühle Sertig\r
Davos Dischma, Jenatschalp\r
Davos Dischma, Dürrboden\r
Davos Dischma, Hof\r
Davos Dischma, Chaiseren\r
Davos Dischma, Abzw. Büelen\r
Davos Dischma, Gadmen\r
Davos Dischma, Teufi\r
Davos Dischma, In den Stücken\r
Davos Dorf, Dischmakreuzung\r
Davos Dorf, Duchli\r
Davos Dorf, Seehofseeli\r
Davos Dorf, Flüelastrasse\r
Davos Dorf, Meierhöfe\r
Davos Dorf, Solaria\r
Davos Dorf, Schiaweg\r
Davos Dorf, Dischmastrasse\r
Davos Dorf, Parsennbahn\r
Davos Dorf, Flüelakreuzung\r
Davos Dorf, Bahnhof\r
Davos Dorf, Stilli\r
Davos Dorf, Stäg\r
Davos Dorf, Schiabach\r
Davos Dorf, Bedra\r
Davos Dorf, Stilli Park\r
Davos Dorf, Tschuggen\r
Davos Dorf\r
Davos Dorf (Parsennbahn)\r
Davos Frauenkirch\r
Davos Frauenkirch, Landhaus\r
Davos Frauenkirch, Gadenstatt\r
Davos Glaris, Bahnhof\r
Davos Glaris, ARA\r
Davos Glaris, EW\r
Davos Glaris, Mühle\r
Davos Glaris, Ardüsch\r
Davos Glaris, Ortolfi\r
Davos Glaris\r
Davos Glaris, Löcher\r
Davos Glaris (Talst.Jatzmeder)\r
Davos Laret, Landhaus\r
Davos Laret, Ober Laret\r
Davos Laret, Unter Laret\r
Davos Laret\r
Davos Monstein, Schmelzboden\r
Davos Monstein, Bahnhof\r
Davos Monstein, Rotsch\r
Davos Monstein, Hofweg\r
Davos Monstein\r
Davos Monstein, Dorf\r
Davos Platz, Postplatz\r
Davos Platz, Bahnhof\r
Davos Platz, Islen\r
Davos Platz, Crestannes\r
Davos Platz, Sportzentrum\r
Davos Platz, Tanzbühl\r
Davos Platz, Tourismuszentrum\r
Davos Platz, Kongresszentrum\r
Davos Platz, Horlauben\r
Davos Platz, Tobelmühlestrasse\r
Davos Platz, Spital\r
Davos Platz, Schatzalpbahn\r
Davos Platz, Hertistrasse\r
Davos Platz, Skistrasse\r
Davos Platz, AO Zentrum\r
Davos Platz, Auf dem Hof\r
Davos Platz\r
Davos Platz (Jakobshorn)\r
Davos Platz (Talstat. Carjöl)\r
Davos Platz Schatzalpbahn\r
Davos Wiesen\r
Davos Wiesen, Schluocht\r
Davos Wiesen, Kirche\r
Davos Wiesen, Valdanna\r
Davos Wolfgang, Seebüel\r
Davos Wolfgang, Hochgebirgskl.\r
Davos Wolfgang\r
Davos Wolfgang (Bus)\r
Degen, Sogn Vetger\r
Degen, Rampa\r
Degen, vitg\r
Degen, Rumein\r
Degersheim, Bahnhof\r
Degersheim, Ifang\r
Degersheim, Post\r
Degersheim, Kreuzstrasse\r
Degersheim\r
Degersheim, Wolfhag\r
Degersheim, Hintertschwil\r
Deggio\r
Deisswil, Bahnhof\r
Deisswil\r
Deitingen, Dorf\r
Deitingen\r
Delémont, gare\r
Delémont, La Golatte\r
Delémont, rue de l'Hôpital\r
Delémont, La Mandchourie\r
Delémont, Righi\r
Delémont, Hôtel de Ville\r
Delémont, rue de l'Avenir\r
Delémont, Château-Musée\r
Delémont, Vieille Ville\r
Delémont, Cras-des-Fourches\r
Delémont, La Promenade\r
Delémont, Sous-le-Mexique\r
Delémont, rue des Moissons\r
Delémont, rue du Poujet\r
Delémont, Sainte-Catherine\r
Delémont, rue St-Randoald\r
Delémont, rue Meret-Oppenheim\r
Delémont, Pont RDU\r
Delémont, Rue St-Sébastien\r
Delémont, zi Communance A16\r
Delémont, Voirnet\r
Delémont, Molière\r
Delémont, Emile-Boéchat\r
Delémont, Von Roll\r
Delémont, Hôpital\r
Delémont\r
Delémont, centre sportif\r
Delémont, Communance Sud\r
Delémont, Morépont\r
Delémont, rte de Bâle\r
Delémont, Bellerive\r
Delémont, rte de Porrentruy\r
Delémont, ch. du Puits\r
Delémont, Giratoire Vorbourg\r
Delémont, Jolimont\r
Delémont, rue des Bordgeais\r
Delémont, chemin du Palastre\r
Delémont, Pont de Rossemaison\r
Delémont, Pont Neuf\r
Delémont, rue des Moulins\r
Delémont, Bellevoie\r
Delémont, gare CFF sud\r
Delémont, Pré Mochel\r
Delémont, Pont La Blancherie\r
Delémont, Office des Véhicules\r
Delémont, La Deute\r
Delémont, rue des Sources\r
Delémont, Pré-Guillaume\r
Delémont, Parc Gros-Pré\r
Delémont, Denise-Péronne\r
Delémont, place de la Foire\r
Delémont, rue du stand\r
Delémont, rue des Andains\r
Delémont, Lilas\r
Delémont, La Blancherie\r
Delémont, Innodel\r
Delémont, Théâtre\r
Delémont, rte de Courroux\r
Delémont, Av. de la gare\r
Delémont, Le Ticle\r
Delley, école\r
Delley, En Roche\r
Démoret, haut du village\r
Démoret, La Rapas\r
Démoret, bas du village\r
Denens, village\r
Denens, Chatagny\r
Denezy, collège\r
Denges, Pierraz-Mur\r
Denges, La Pale\r
Denges, Sur les Moulins\r
Denges, Les Oches\r
Denges, village\r
Denges-Echandens\r
Densbüren, Breite\r
Densbüren, Gemeindehaus\r
Densbüren, Ausserdorf\r
Derborence\r
Derendingen, Floraplatz\r
Derendingen, Linde\r
Derendingen, Ritterplatz\r
Derendingen, Mühle\r
Derendingen, Freiheit\r
Derendingen, Oberstufenzentrum\r
Derendingen, Löhr\r
Derendingen, Kreuzplatz\r
Derendingen, Pestalozziplatz\r
Derrière Pertuis\r
Detligen, Schulhausweg\r
Detligen, Jucher\r
Detligen, Post\r
Dettenried\r
Dettighofen, Linde\r
Dettighofen, Lanzenneunfornstr\r
Dettighofen (Lengwil), Dorf\r
Develier, dessus\r
Develier, bas du village\r
Develier, Pré au Maire\r
Develier, Claude-Chappuis\r
Develier, poste\r
Develier, Le Cerf\r
Develier, Sur Cré\r
Develier, St-Christophe\r
Diavolezza\r
Diavolezzafirn (Bergstation)\r
Diavolezzafirn (Talstation)\r
Dicken b Dgh, Freihof\r
Dicken b Dgh, Schwindel\r
Dicken b Dgh, Dorf\r
Diegten, Mühle\r
Diegten, Oberdiegten\r
Diegten, Weinburg\r
Diegten, Eimatt\r
Diegten, Hirschen\r
Dielsdorf, Wehntalerstrasse\r
Dielsdorf, Dorfzentrum\r
Dielsdorf, Erlen\r
Dielsdorf, Spitalstrasse\r
Dielsdorf, Gesundheitszentrum\r
Dielsdorf\r
Dielsdorf, Altmoos\r
Dielsdorf, Bezirksgebäude\r
Dielsdorf, Ruchwiesen\r
Dielsdorf, Bahnhof\r
Diemtigen, Zelgli\r
Diemtigen, Schönbühl\r
Diemtigen, Dorf\r
Diemtigen, Friedhof\r
Diemtigen, Katzenlochbrücke\r
Diemtigen, Talweid\r
Diemtigen Nüegg\r
Diemtigen Riedli\r
Dieni, Pendicularas\r
Dieni\r
Dieni (pendicularas)\r
Diepflingen, Dorf\r
Diepflingen\r
Diepoldsau, Schmitter\r
Diepoldsau, Heimstrasse\r
Diepoldsau, Dorf\r
Diepoldsau, Storchenbühl\r
Diepoldsau, Rheinstrasse\r
Diepoldsau, Schweizer Zoll\r
Diepoldsau, Hennemoos\r
Dierikon, Migros\r
Diesbach GL, Feldstrasse\r
Diesbach-Betschwanden\r
Diessbach bei Büren, Dorf\r
Diessbach bei Büren, Gäu\r
Diesse, Chenaux\r
Diesse, village\r
Diessenhofen\r
Diessenhofen, Bahnhof\r
Diessenhofen, Landi\r
Diessenhofen (Schifflände)\r
Dieterswil, Dorf\r
Dietfurt, Bahnhof\r
Dietfurt\r
Dietfurt, Neudietfurt\r
Dietfurt, Feldeck\r
Dietfurt, Langensteig\r
Dietikon, Marmori-Weiher\r
Dietikon, Gjuchstrasse\r
Dietikon, Lätten\r
Dietikon, Weinberg\r
Dietikon, Stadthaus\r
Dietikon, Stadthalle Ost\r
Dietikon, Stelzenacker\r
Dietikon, Pestalozzi\r
Dietikon, Moosmatt\r
Dietikon, Bahnhofstrasse\r
Dietikon, Hagackerstrasse\r
Dietikon, Sommerau\r
Dietikon, Dörfli\r
Dietikon, Oberdorf\r
Dietikon, Weidstrasse\r
Dietikon, Maienweg\r
Dietikon, Niderfeld\r
Dietikon, Wasserburg\r
Dietikon, Oetwilerstrasse\r
Dietikon, Heimstrasse\r
Dietikon, Gyrhalden\r
Dietikon, Rapidplatz\r
Dietikon, Birmensdorferstrasse\r
Dietikon, Lerzen\r
Dietikon, Hätschen\r
Dietikon, Kirchplatz\r
Dietikon, Schönenwerd\r
Dietikon, Schäflibach\r
Dietikon, Silbern\r
Dietikon, Vorstadt\r
Dietikon, Staffelackerstrasse\r
Dietikon, Hofacker\r
Dietikon\r
Dietikon, Zentrum\r
Dietikon, Bahnhof\r
Dietikon Schöneggstrasse\r
Dietikon Stoffelbach\r
Dietingen, Abzweigung\r
Dietlikon, Hörnligraben\r
Dietlikon, Dübendorferstrasse\r
Dietlikon, Bahnhof/Bad\r
Dietlikon, Brandbachstrasse\r
Dietlikon, Hofwiesen\r
Dietlikon, Dornenstrasse\r
Dietlikon, Pappelstrasse\r
Dietlikon, Bahnhof\r
Dietlikon, In Lampitzäckern\r
Dietlikon, Hinentalstrasse\r
Dietlikon, Industriestrasse\r
Dietlikon, Aegert\r
Dietlikon\r
Dietlikon, Mäenriet\r
Dietlikon, Lettenstrasse\r
Dietlikon, Pünten\r
Dietlikon, Haldensteig\r
Dietlikon, Klimmweg\r
Dietlikon, Zentrum\r
Dietlikon, Riedenerstrasse\r
Dietlikon, Rebackerweg\r
Dietlikon, Kath. Kirche\r
Dietlikon, Lindenstrasse\r
Dietlikon, Fuchshalde\r
Dietschwil b. Kirchberg SG\r
Dietwil, Zubestrasse\r
Dietwil, Kirchenplatz\r
Dietwil, Wannenmatt\r
Diga di Luzzone/Ristorante\r
Diga Verzasca\r
Dingenhart, Stählibuck\r
Dingenhart, Dorf\r
Dingenhart, Brand\r
Dinhard, Grüt\r
Dinhard, Bahnhof/Welsikon\r
Dinhard, Gemeindehaus\r
Dinhard\r
Dino\r
Dintikon, Schule\r
Dintikon, Dorfstrasse\r
Dintikon, Oberdorf\r
Dintikon, Post\r
Dintikon, Ammerswilerstrasse\r
Dirinella, Bivio per Caviano\r
Dirinella, Confine\r
Disentis/Mustér, Punt Russein\r
Disentis/Mustér, Cucagna\r
Disentis/Mustér, Pendicularas\r
Disentis/Mustér, Acletta\r
Disentis/Mustér, Pardomat\r
Disentis/Mustér, Funsd./Clava.\r
Disentis/Mustér, Scola da Skis\r
Disentis/Mustér, Camping\r
Disentis/Mustér, Faltscharidas\r
Disentis/Mustér, Via Plauns\r
Disentis/Mustér, Raveras\r
Disentis/Mustér\r
Disentis/Mustér, staziun/posta\r
Disentis/Mustér, Vitg Dorfzen\r
Disentis/Mustér, Punt da Brulf\r
Disentis/Mustér, Claustra\r
Disentis/Mustér, Fontanivas\r
Disentis/Mustér, Salaplauna\r
Disentis/Mustér, Madernal\r
Disentis/Mustér, Sogn Placi\r
Disentis/Mustér (Talstation)\r
Distelberg\r
Distelboden (Talst. Bonistock)\r
Distelboden (Talst. Erzegg)\r
Dittingen, Buchholz\r
Dittingen, Dorf\r
Dittingen, Himmelrich\r
Dittingen, Industriezone Ried\r
Dixence, Le Chargeur\r
Dixence (téléphérique)\r
Dizy, village\r
Dock Midfield\r
Domat/Ems, Tuma Platta\r
Domat/Ems, Padrusa\r
Domat/Ems, Parc industrial\r
Domat/Ems, Calundis\r
Domat/Ems, Quadras\r
Domat/Ems, Abzw. Felsberg\r
Domat/Ems, La Val\r
Domat/Ems, Marchesa\r
Domat/Ems, Plarenga\r
Domat/Ems, Unterdorf\r
Domat/Ems, Post\r
Domat/Ems, Chemie\r
Domat/Ems, Plaz\r
Domat/Ems\r
Domat/Ems, Ardisla\r
Domat/Ems, Riel\r
Domat/Ems, Crusch\r
Domat/Ems Werk\r
Dombresson, Bas des Crêts\r
Dombresson, temple\r
Dombresson, collège\r
Domdidier, l'Arbogne\r
Domdidier, CO\r
Domdidier, rte de l'Industrie\r
Domdidier, gare\r
Domdidier\r
Dommartin, village\r
Dompierre FR, école\r
Dompierre FR\r
Dompierre VD, village\r
Donat, Pazen\r
Donat, Farden\r
Donat, vischnànca\r
Donatyre, école\r
Donatyre, village\r
Dongio, Industrie\r
Dongio, Piazza\r
Dongio, Municipio\r
Donneloye, croisée\r
Donneloye, En Jon\r
Donneloye, poste\r
Donneloye, collège\r
Donzhausen, Dorfplatz\r
Doppleschwand, Hohfuren\r
Doppleschwand, Brüggweid\r
Doppleschwand, Post\r
Doppleschwand, Spittel\r
Dorbagnon\r
Dorénaz, école\r
Dorénaz, téléphérique\r
Dorénaz (téléphérique)\r
Dorf, Gemeindehaus\r
Dorf b. Schänis, Landi\r
Dörfji\r
Dörflingen, Post\r
Dörflingen, Laag\r
Dörflingen, Neuhus\r
Dörflingen, Unterberg\r
Dörflingen, Kirche\r
Dornach, Ober-Erli\r
Dornach, Metallwerke\r
Dornach, Schlatt\r
Dornach, Quidum\r
Dornach, Unter-Erli\r
Dornach, Kirche\r
Dornach, Apfelsee\r
Dornach, Bahnhof\r
Dornach, Schiessstand\r
Dornach, Spital\r
Dornach, Museumsplatz\r
Dornach, Goetheanum\r
Dornach, Hügelweg\r
Dornach, Musikschule\r
Dornach, Oberi Tüflete\r
Dornach, Gwändweg\r
Dornach-Arlesheim\r
Dotnacht, Dorfplatz\r
Dottikon, Lehmhof\r
Dottikon, Güterstrasse\r
Dottikon, Sternenplatz\r
Dottikon, Bergstrasse\r
Dottikon, Alterswohnheim\r
Dottikon, Chrischona\r
Dottikon, Gemeindehaus\r
Dottikon-Dintikon, Bahnhof\r
Dottikon-Dintikon\r
Döttingen\r
Döttingen, Zentrum\r
Döttingen, Vorhard\r
Döttingen, Bahnhof\r
Döttingen, Kernkraftwerk\r
Döttingen, Chunte\r
Dotzigen, alte Käserei\r
Dotzigen\r
Dozwil, Pärkli\r
Dozwil, Oberdorfstrasse\r
Dreien, Hauptstrasse\r
Dreien, Tüfi\r
Dreien, Freihof\r
Drognens, caserne\r
Dübendorf, Sport Heerenschürli\r
Dübendorf, Högler\r
Dübendorf, Alterszentrum\r
Dübendorf, Im Grund\r
Dübendorf, Heidenrietstrasse\r
Dübendorf, Lindenbühl\r
Dübendorf, Kunsteisbahn\r
Dübendorf, Ringwiesen\r
Dübendorf, Grüzenstrasse\r
Dübendorf, Claridenstrasse\r
Dübendorf, Lindenplatz\r
Dübendorf, Sonnental\r
Dübendorf, Branzenäsch\r
Dübendorf, Am Ring\r
Dübendorf, Chriesmatt\r
Dübendorf, Flugplatz\r
Dübendorf, Kreuzbühl\r
Dübendorf, Kirche Wil\r
Dübendorf, Memphis\r
Dübendorf, Raubbühl\r
Dübendorf, Wasserfurren\r
Dübendorf, Zelglistrasse\r
Dübendorf, Zwinggarten\r
Dübendorf, Bauhof\r
Dübendorf, Kämmaten\r
Dübendorf, Hoffnung\r
Dübendorf, Sonnenberg\r
Dübendorf, Schwimmbad\r
Dübendorf, EMPA\r
Dübendorf, Innovationspark\r
Dübendorf, Meiershofstrasse\r
Dübendorf, Hochbord Süd\r
Dübendorf, Bettlistrasse\r
Dübendorf, Bahnhof Nord\r
Dübendorf, Glärnischstrasse\r
Dübendorf, City Center\r
Dübendorf, Breitibach\r
Dübendorf, Gfenn\r
Dübendorf, Schossacher\r
Dübendorf, Unterdorf\r
Dübendorf, Sunnhalde\r
Dübendorf, Neugut Süd\r
Dübendorf, Stadthaus\r
Dübendorf, Ringstrasse\r
Dübendorf, Post\r
Dübendorf\r
Dübendorf, Bahnhof\r
Dübendorf, Hochbord Nord\r
Düdingen, Käsereistrasse\r
Düdingen, Tennishalle\r
Düdingen, Haslerastrasse\r
Düdingen, Warpel\r
Düdingen, Weiermatt\r
Düdingen, Briegli\r
Düdingen, Kirche\r
Düdingen\r
Düdingen, Bahnhof\r
Düdingen, Kirchstrasse\r
Düdingen, Chännelmatt\r
Düdingen, Bundtels\r
Düdingen, Leimacker\r
Düdingen, Luggiwil\r
Düdingen, Angstorf\r
Düdingen, Gantrischweg\r
Düdingen, Mariahilf\r
Düdingen, Zelg\r
Düdingen, Blumenrain\r
Düdingen, Am Bach\r
Düdingen, Brugerastrasse\r
Düdingen, Schiffenen\r
Düdingen, Staumauer/Camping\r
Düdingen, Jetschwil\r
Duggingen\r
Dugny\r
Duillier, croisée de Trélex\r
Duillier, centre communal\r
Dulliken, Bahnhof\r
Dulliken, Schäfer\r
Dulliken, Bodenacker\r
Dulliken, Brüggli Park\r
Dulliken, Alte Gemeindekanzlei\r
Dulliken, Zentrum\r
Dulliken, Lehmgrube\r
Dulliken\r
Dully, St-Bonnet\r
Dully, Bourg d'Amont\r
Dully, Sous-Dully\r
Dultschegnas\r
Dürnten, Langacher\r
Dürnten, J.-C.-Heerstrasse\r
Dürnten, Breitenmattstrasse\r
Dürnten, Etzelstrasse\r
Dürnten, Kirche\r
Dürnten, Lättenmoos\r
Dürnten, Rothus\r
Dürnten, Oberdürnten\r
Dürrenäsch, Unterdorf\r
Dürrenäsch, Dorf\r
Dürrenäsch, Brunnen\r
Dürrenäsch, Ausserdorf\r
Dürrenäsch, Wolfacker\r
Dürrenroth, Gärbihof\r
Dürrenroth, Fuchsloch\r
Dürrenroth, Dorf\r
Dürrenroth, Hulligen\r
Dussnang, Frohsinn\r
Dussnang, Kirche/Klinik\r
Dussnang, Tannegg\r
Duvin, vitg\r
Duvin, Planezzas\r
Ebenalp\r
Ebersecken, Unterdorf\r
Ebersecken, Badachtal\r
Eberswil, Abzw. Lütschwil\r
Ebertswil, Schulhaus\r
Ebikon, Schweizerheim\r
Ebikon, Weichlen\r
Ebikon, Gerbe\r
Ebikon, Höchweid\r
Ebikon, Mühlegg\r
Ebikon, Sagenschulhaus\r
Ebikon, Höfli\r
Ebikon, Hartenfels\r
Ebikon, Ottigenbühl\r
Ebikon, Ladengasse\r
Ebikon, Hünenberg\r
Ebikon, Schmiedhof\r
Ebikon, Schindler\r
Ebikon, Schlössli\r
Ebikon, Bühl\r
Ebikon, Hofmatt\r
Ebikon, Fildern\r
Ebikon, Halte\r
Ebikon, Zentralschulhaus\r
Ebikon, Falken\r
Ebikon, Schachenweid\r
Ebikon, St. Klemens\r
Ebikon, Löwen\r
Ebikon, Bahnhof\r
Ebikon\r
Ebligen, Bahnhof\r
Ebligen\r
Ebmatingen, Leeacherstrasse\r
Ebmatingen, Looren\r
Ebmatingen, Dorf\r
Ebnat-Kappel, Bahnhof\r
Ebnat-Kappel, Kapplerhof\r
Ebnat-Kappel, Gieselbach\r
Ebnat-Kappel, Wier\r
Ebnat-Kappel, Mühlau\r
Ebnat-Kappel, Acker\r
Ebnat-Kappel, Mitteldorf\r
Ebnat-Kappel, Gemeindehaus\r
Ebnat-Kappel\r
Ebnat-Kappel, Au\r
Ebnet (Entlebuch), Schulhaus\r
Ebnet (Entlebuch), Sageli\r
Echallens, route de Cossonay\r
Echallens, gare\r
Echallens\r
Echallens, La Robellaz\r
Echallens, collège/parc\r
Echallens, Château\r
Echallens, Les Coulisses\r
Echallens, place Emile Gardaz\r
Echallens, La Fontaine\r
Echallens, Les Trois-Sapins\r
Echandens, centre\r
Echandens, poste\r
Echandens, Chocolatière\r
Echandens, collège\r
Echandens, Riaz\r
Echarlens, village\r
Echarlens, bif.\r
Echarlens, En Champotey\r
Echichens, Signal\r
Echichens, croisée\r
Echichens, église\r
Echichens, village\r
Echichens, Crêt\r
Echichens, Gravelines\r
Echichens, Haute-Pierre\r
Eclagnens, collège\r
Eclépens\r
Eclépens, gare\r
Eclépens, village\r
Eclépens, Cinq-Sous\r
Eclépens, collège\r
Ecoteaux, Platta-Pierraz\r
Ecoteaux, collège\r
Ecoteaux, laiterie\r
Ecublens VD, Parc\r
Ecublens VD, Ormet\r
Ecublens VD, Suchet-Forêt\r
Ecublens VD, Stand\r
Ecublens VD, Renges\r
Ecublens VD, Coquerellaz\r
Ecublens VD, Bassenges\r
Ecublens VD, Villars\r
Ecublens VD, Epenex/Pont-Bleu\r
Ecublens VD, Cerisaie\r
Ecublens VD, Campus des médias\r
Ecublens VD, EPFL\r
Ecublens VD, En Enjalin\r
Ecublens VD, Croset\r
Ecublens VD, Cocarde\r
Ecublens VD, Perrettes\r
Ecublens VD, Champs-Courbes\r
Ecublens VD, Veilloud\r
Ecublens VD, Champagne\r
Ecublens VD, Argand\r
Ecublens VD, Larges Pièces\r
Ecublens VD, UNIL-Sorge\r
Ecublens VD, Pontet\r
Ecublens VD, allée de Dorigny\r
Ecublens VD, place de sport\r
Ecublens VD, Motty\r
Ecublens VD, EPFL/Colladon\r
Ecublens VD, EPFL Piccard\r
Ecublens VD, EPFL (bus)\r
Ecublens VD, Blévallaire\r
Ecublens VD, Montaney\r
Ecublens VD, Epenex\r
Ecublens-Rue\r
Ecuvillens, église\r
Ecuvillens, Aérodrome\r
Ecuvillens, La Tuffière\r
Ecuvillens, Route de Posieux\r
Ecuvillens, Champ du Nod\r
Ederswiler, Jurastrasse\r
Ederswiler, Pré Strayat\r
Edlibach, Nidfuren\r
Edlibach, Hündlital\r
Edlibach, Oberedlibach\r
Edlibach, Bad Schönbrunn\r
Edlibach, Sonnhalde\r
Edlibach, Dorf\r
Effingen, Schwerzbrünneli\r
Effingen, Dorf\r
Effretikon, Kapelle Rikon\r
Effretikon, Zentrum\r
Effretikon, Lindenwiese\r
Effretikon, Langhag\r
Effretikon, Girhalde\r
Effretikon, Vogelbuckstrasse\r
Effretikon, Weiherstrasse\r
Effretikon, Brüttenerstrasse\r
Effretikon, Bahnhof\r
Effretikon, Moosburg\r
Effretikon\r
Effretikon, Wattspitz\r
Effretikon, Eselriet\r
Effretikon, Müselacher\r
Egerkingen, Thalrich\r
Egerkingen, Gäu Park\r
Egerkingen\r
Egerkingen, Bielgraben\r
Egerkingen, Widenfeld\r
Egerkingen, Gäupark Kreisel\r
Egerkingen, Zentrum\r
Egerkingen, Bahnhof\r
Egerkingen, Bifang\r
Egerkingen, Ganggeler\r
Egerkingen, Ramelen\r
Egetswil, Dorf\r
Egg\r
Egg SZ, Langrüti\r
Egg SZ, Eintracht\r
Egg SZ, Schlapprig\r
Egg SZ, Postplatz\r
Egg SZ, Roblosen\r
Eggberge\r
Eggen (Kinzig)\r
Eggenwil, Dorfplatz\r
Eggerberg, Mühlackern\r
Eggerberg, Sulzacker\r
Eggerberg, Eggen\r
Eggerberg, Dorf\r
Eggerberg, Schmitta\r
Eggerberg, Stärruacker\r
Eggerberg\r
Eggerberg, Stäga\r
Eggerberg, Schliecht\r
Eggerberg, Windegg\r
Eggerberg, Kummelti\r
Eggerberg, Engeruhüs\r
Eggerberg, Hohwang\r
Eggerberg, Weitmatten\r
Eggerberg, Berg\r
Eggerberg, Telli\r
Eggerberg, Finnen\r
Eggerberg, Wyer\r
Eggerberg, Burg\r
Eggersriet, Tannacker\r
Eggersriet, Ebne Eggersriet\r
Eggersriet, Gemeindehaus\r
Eggersriet, Oestran\r
Eggersriet, Wiesen\r
Eggerstanden, Kirche\r
Eggishorn\r
Eggiwil, Brambach\r
Eggiwil, obere Zilmatt\r
Eggiwil, Leimen\r
Eggiwil, Räbloch\r
Eggiwil, Dorf\r
Eggiwil, Skilift\r
Eggiwil, Zimmertsei\r
Eggiwil, Schwelli\r
Eggiwil, Tenndli\r
Eggiwil, Holzmatt\r
Eggiwil, Buchschachen\r
Eggiwil, Zilmatt\r
Eggiwil, Neuhof\r
Eggli (Fanas) (Luftseilbahn)\r
Eggli (Gstaad)\r
Eggweid (Mittelstation)\r
Eglisau\r
Eglisau, Städtli\r
Eglisau, Altersheim\r
Eglisau, Wiler\r
Eglisau, Steinboden\r
Eglisau, Breitistrasse\r
Eglisau, Viehmarkt\r
Eglisau, Tössriederen\r
Eglisau, Kaiserhof\r
Eglisau, Schlafapfelbaum\r
Eglisau, Oberseglingen\r
Eglisau bei der Kirche\r
Egliswil, Waageplatz\r
Egliswil, Industrie\r
Egliswil, Zopf\r
Egnach, Buech\r
Egnach, Bahnhof\r
Egnach, Kreisel\r
Egnach, Kehlhof\r
Egnach\r
Egnach, Mooswiesen\r
Egnach, Wiedehorn\r
Egolzwil, Moosmatt\r
Egolzwil, Unterdorf\r
Ehrendingen, Tiefenwaag\r
Ehrendingen, Niedermatt\r
Ehrendingen, Unterdorf\r
Ehrendingen, Höhtal\r
Ehrendingen, Breitwies\r
Ehrendingen, Post\r
Ehrikon\r
Eich, Seematt\r
Eich, Brand\r
Eich, Vogelsang\r
Eich, Eichberg\r
Eich, Eichhof\r
Eich, Dorf\r
Eichberg, Süesswinkel\r
Eichberg, Post\r
Eichberg, Härdli\r
Eichberg, Dorf\r
Eichholz, alte Post\r
Eichholz, Guglera\r
Eierhals (See)\r
Eierschwand\r
Eifeld\r
Eigenthal, Hochwäldli\r
Eigenthal, Talboden\r
Eigenthal, Eigenthalerhof\r
Eigergletscher\r
Eiken, Poststrasse\r
Eiken, West\r
Eiken, Ost\r
Eiken, Industriezone Rütti\r
Eiken\r
Einigen, Chanderbrügg\r
Einigen, Teller\r
Einigen, Dorf\r
Einigen (See)\r
Einsiedeln, Blüemenen\r
Einsiedeln, Friedhof\r
Einsiedeln, Bahnhof\r
Einsiedeln, Steinauerstrasse\r
Einsiedeln,Altersheim Langrüti\r
Einsiedeln, Rietstrasse\r
Einsiedeln, Binzenweg\r
Einsiedeln, Lärchenweg\r
Einsiedeln, Allmeindstrasse\r
Einsiedeln, Birchli/Garage\r
Einsiedeln, Badeanstalt\r
Einsiedeln, Birchli/Sternen\r
Einsiedeln, Wissmüli\r
Einsiedeln, Heidenbühl\r
Einsiedeln, Eschbach\r
Einsiedeln, Wäni\r
Einsiedeln\r
Einsiedeln, Birchli/Stollern\r
Einsiedeln, Rüti-Säge\r
Einsiedeln, Alpstrasse\r
Einsiedeln, Spital\r
Einsiedeln, Horgenberg\r
Einsiedeln, Grotzenmühlestr.\r
Einsiedeln, Steig\r
Einsiedeln, Brüel\r
Einsiedeln, Klosterplatz\r
Eischoll (Bergstation)\r
Eischoll (Striggen)\r
Eisee\r
Eison, village\r
Eison, Proveric\r
Eison, Felliny\r
Eison, La Crettaz\r
Eisten, Fluhbalmen\r
Eisten, Ganterbrücke\r
Eisten, Raftgarten\r
Eisten, Ahorn\r
Eisten, Bodenbrücke\r
Eisten, Randfluh\r
Eisten, Zen Eisten\r
Eisten, Ganter\r
Eisten, Zum Tann\r
Eisten, Dorf\r
Elfingen, Hiltematt\r
Elgg, Bahnhof\r
Elgg, Post\r
Elgg, Schloss\r
Elgg, Schwimmbad\r
Elgg, Sennhof\r
Elgg, Heurüti\r
Elgg, Torweiher\r
Elgg, Meisenplatz\r
Elgg\r
Elgg, Städtli\r
Ellighausen, Dorf\r
Ellikon a. d. Thur, Dorf\r
Ellikon a.R., Altes Schulhaus\r
Ellikon am Rhein\r
Elm, Dorf\r
Elm, Obererbs Höhenweg\r
Elm, Obererbs Skihütte\r
Elm, Schwändi\r
Elm, Station\r
Elm, Obmoos\r
Elm, Sportbahnen\r
Elm, Rüfi\r
Elm, Chappelen\r
Elm, Altersheim\r
Elm, Büelstafel\r
Elm, Meissenboden\r
Elm, Steinibach\r
Elm (Talstation)\r
Elm Töniberg (Tschinglenbahn)\r
Elm Tschinglenalp\r
Elsau, Bettli\r
Elsau, Melcher\r
Elsau, Pestalozzistrasse\r
Elsau, Bännebrett\r
Elsau, Dorf\r
Elsau, Sportplatz\r
Elsau, Tolhusen\r
Elsau, Ebnet\r
Elsigbach (Talstation)\r
Elsigenalp\r
Embd (Luftseilbahn)\r
Embd (Seilbahn) Bergstation\r
Embrach, Hard\r
Embrach, Embraport\r
Embrach, Zürcherstrasse\r
Embrach, Im Feld\r
Embrach, Illingerweg\r
Embrach, Dreispitz\r
Embrach, Alterszentrum\r
Embrach, Gemeindehaus\r
Embrach, Post\r
Embrach, Oberdorf\r
Embrach-Rorbas\r
Embrach-Rorbas, Bahnhof\r
Emdthal, Bad Heustrich\r
Emdthal, Dorf\r
Emmat\r
Emmen, Unterspitalhof\r
Emmen, Lindenheim\r
Emmen, Hasli\r
Emmen, Schwimmbad Mooshüsli\r
Emmen, Kirche\r
Emmen, Flugzeugwerke\r
Emmen, Kasernenstrasse\r
Emmen, Rüeggisingen\r
Emmen, Abendweg\r
Emmen, Allmendli\r
Emmen, Lindenfeldring\r
Emmen, Emmenfeld\r
Emmen, Sternen\r
Emmen, Fichtenstrasse\r
Emmenbrücke, Erlenmatte\r
Emmenbrücke, Schönbühl\r
Emmenbrücke, Strassenkreuz\r
Emmenbrücke, Krauerstrasse\r
Emmenbrücke, Riffig\r
Emmenbrücke, Schwanderhofstr.\r
Emmenbrücke, Untere Wiese\r
Emmenbrücke, Reform. Kirche\r
Emmenbrücke, Alp\r
Emmenbrücke, Benziwil Ost\r
Emmenbrücke, Erlenring\r
Emmenbrücke, Benziwil West\r
Emmenbrücke, Sedelstrasse\r
Emmenbrücke, Listrig\r
Emmenbrücke, Haldenring\r
Emmenbrücke, Schaubhus\r
Emmenbrücke, Emmen Center\r
Emmenbrücke, Bahnhof Ost\r
Emmenbrücke, Bösfeld\r
Emmenbrücke, Lohrensäge\r
Emmenbrücke, Viscosistadt\r
Emmenbrücke, Chörbli\r
Emmenbrücke, Waldstrasse\r
Emmenbrücke, Obere Erlen\r
Emmenbrücke, Ober Gersag\r
Emmenbrücke, Hübeli\r
Emmenbrücke, Holzhof\r
Emmenbrücke, Marienkirche\r
Emmenbrücke, Sprengi\r
Emmenbrücke, Bahnhof\r
Emmenbrücke, Geisselermoos\r
Emmenbrücke, Neuhof\r
Emmenbrücke\r
Emmenbrücke, Riffigrain\r
Emmenbrücke, Sonnenplatz\r
Emmenbrücke, Bahnhof Süd\r
Emmenbrücke Gersag, Bahnhof\r
Emmenbrücke Gersag\r
Emmenbrücke Kapf, Bahnhof\r
Emmenbrücke Kapf\r
Emmenmatt\r
Emmenmatt, Bahnhof\r
Emmenmatt, Obermatt\r
Emmenmatt, Moosbad\r
Emmetten, Sagendorf\r
Emmetten, Post\r
Emmetten, Schöneck\r
Emmetten, Hattig\r
Emmetten, March\r
Emmetten (Niederbauenbahn)\r
Emmetten (Talstation)\r
Emmetten Aengi\r
Empächli\r
En Charnet\r
Endingen, Zentrum\r
Endingen, Gemeindehaus\r
Endingen, Schöntal\r
Endingen, Israelit. Friedhof\r
Enge im Simmental\r
Engelberg, Gemeindehaus\r
Engelberg, Studentenweg\r
Engelberg, Brunnibahn\r
Engelberg, Dürrbächli\r
Engelberg, Langacher\r
Engelberg, Wetti\r
Engelberg, Golfplatz\r
Engelberg, Heimat\r
Engelberg, Neuschwändi\r
Engelberg, Waldegg\r
Engelberg, Kloster\r
Engelberg, Fellenrüti\r
Engelberg, Kurpark\r
Engelberg, Belmont\r
Engelberg, Schwandstrasse\r
Engelberg, Vorderstockli\r
Engelberg, Eien\r
Engelberg, Wasserfall\r
Engelberg, Dorf\r
Engelberg, Tellenstein\r
Engelberg, Boden\r
Engelberg, Bahnhof\r
Engelberg, Fürenalpbahn\r
Engelberg, Titlisbahn\r
Engelberg, Resort\r
Engelberg, Eienwäldli\r
Engelberg, Sunnmatt\r
Engelberg, Örtigen\r
Engelberg\r
Engelberg, Zelgli\r
Engelberg, Zügstrasse\r
Engelberg, Sporting Park\r
Engelberg, Hahnenblick\r
Engelberg (Brunni-Bahnen)\r
Engelberg (Fürenalp Bahn)\r
Engelberg (Talst. Kabinenb.)\r
Engelberg (Talstation Titlis)\r
Engelberg Flühmatt\r
Engelberg-Wingreis\r
Engelburg, Chapf\r
Engelburg, Ebnet\r
Engelburg, Freihof\r
Engelburg, Schulhaus\r
Engelburg, Abzw. Spisegg\r
Engelburg, Dorfplatz\r
Engelburg, Lindenwies\r
Engeloch VS\r
Enges, Lordel\r
Enges, village\r
Enges, collège\r
Enges, Verger-du-Bas\r
Enggistein, Dorf\r
Enggistein, Metzgerhüsi\r
Enggistein, Rüttihubelstrasse\r
Enggistein, Filzfabrik\r
Engi, Landesplattenberg\r
Engi, Vorderdorf\r
Engi, Hinterdorf\r
Engi, Weberei\r
Engi, Dorf\r
Engishofen, Oberdorf\r
Engishofen, Dorfplatz\r
Englisberg, Abzw. Kühlewil\r
Englisberg, Dorf\r
Englisberg, Eichholzacker\r
Englisberg, Neuhaus\r
Englisberg, Kühlewil\r
Engollon, piscine\r
Engollon, village\r
Engstlenalp\r
Engstlensee\r
Engstligenalp\r
Engwang, Dorf\r
Engwilen, Hauptstrasse\r
Ennenda, Seilbahn\r
Ennenda, Villastrasse\r
Ennenda, Wiese/Salem\r
Ennenda, Gemeindehaus\r
Ennenda, Bahnhof\r
Ennenda\r
Ennetbaden, Friedhof\r
Ennetbaden, Rebhalde\r
Ennetbaden, Kirche\r
Ennetbaden, Aeusserer Berg\r
Ennetbaden, Gemeindehaus\r
Ennetbaden, Neuacker\r
Ennetbaden, Schützenhaus\r
Ennetbaden, Goldwand\r
Ennetbaden, Schiefe Brücke\r
Ennetbaden, Schlieren\r
Ennetbaden, Geissbergstrasse\r
Ennetbaden, Rütenen-Felmen\r
Ennetbaden, Gärtnerweg\r
Ennetbühl, Gillsäge\r
Ennetbühl, Schiltmoos\r
Ennetbühl, Bernhalde/Lutert.\r
Ennetbühl, Seebensäge\r
Ennetbühl, Dorf\r
Ennetbühl, Rietbad\r
Ennetbürgen, Strandbad\r
Ennetbürgen, Flugplatz\r
Ennetbürgen, Herdern\r
Ennetbürgen, Schule/MZA\r
Ennetbürgen, Buochli\r
Ennetbürgen, Parkplatz Honegg\r
Ennetbürgen, Riedmatt\r
Ennetbürgen, Dorf\r
Ennetbürgen, Hasli\r
Ennetbürgen, Vorderbiel\r
Ennetbürgen, Oeltrotte\r
Ennetbürgen (See)\r
Ennetmoos, Morgenstern\r
Ennetmoos, Mueterschwandenberg\r
Ennetmoos, Abzw. Rütli\r
Ennetmoos, Ebnet\r
Ennetmoos, Allweg\r
Ennetmoos, Riedmatthof\r
Ennetmoos, Schützenhaus\r
Ennetmoos, Waldheim\r
Ennetmoos, Rohren\r
Ennetmoos, Abz. Vorsässstrasse\r
Enney, zone d'activités\r
Enney, village\r
Enney\r
Enson-la-Fin\r
Entlebuch\r
Entlebuch, Bahnhof\r
Entlebuch, Unteregg\r
Entlebuch, Marktplatz\r
Entlebuch, Spüelen\r
Entlebuch, Schwand\r
Entlebuch, Russacher\r
Entlebuch, Drei Könige\r
Entlebuch, Zeug\r
Epagny, aérodrome\r
Epagny, centre\r
Epagny, Motel\r
Epagny, Prâ Dêrê\r
Epagny, Les Gottes\r
Epagny, Croix-Blanche\r
Epalinges, Lion d'Or\r
Epalinges, Planches\r
Epalinges, Biolleyre\r
Epalinges, Croix-Blanche\r
Epalinges, Vaugueny\r
Epalinges, Ballègue\r
Epalinges, Grand Chemin\r
Epalinges, Bois-Murat\r
Epalinges, Tuileries\r
Epalinges, En Praz Bin\r
Epalinges, Pré-d'Yverdon\r
Epalinges, Polny\r
Epalinges, Girarde\r
Epalinges, Florimont\r
Epalinges, Montéclard\r
Epalinges, Bois-de-Ban\r
Epalinges, Croisettes\r
Epalinges, Giziaux\r
Epautheyres, croisée\r
Epauvillers, bif. sur Le Péca\r
Epauvillers, haut du village\r
Epauvillers, poste\r
Ependes FR, Invuet\r
Ependes FR, La Pala\r
Ependes FR, village\r
Ependes VD\r
Epesses\r
Epesses, village\r
Epesses, Crêt-Dessus\r
Epesses, Chapotannaz\r
Epinassey\r
Epiquerez, village\r
Epiquerez, Montbion\r
Epsach, Dorf\r
Epsach-Baar\r
Eptingen, Gemeindeplatz\r
Eptingen, Edelweiss\r
Erde, La Touaide\r
Erde, centre\r
Erdesson, bif.\r
Erdmannlistein\r
Ergisch, Dorf\r
Ergisch, Wasserleite\r
Ergisch, Tuminen\r
Ergisch, Linden\r
Erich/Tschuggen\r
Eriswil, Altersheim\r
Eriswil, Station\r
Eriswil, Thanweg\r
Eriswil, Schulhaus\r
Eriswil, Gässli\r
Eriswil, Hinterdorf\r
Eriswil, Ahorn\r
Eriz, Linden\r
Eriz, Schwand\r
Eriz, Bödeli\r
Eriz, Säge\r
Eriz, Moosboden\r
Eriz, Bieten Schulhaus\r
Eriz, Garage\r
Eriz, Bühl\r
Eriz, Losenegg\r
Eriz, Gysenbühl\r
Erlach, Oberstufenschule\r
Erlach, Stedtli\r
Erlach, Gostel\r
Erlach, unter den Halden\r
Erlach (Schiff)\r
Erlen\r
Erlenbach i.S. (Stockhornbahn)\r
Erlenbach im Simmental\r
Erlenbach ZH, Rankstrasse\r
Erlenbach ZH\r
Erlenbach ZH, Bahnhof\r
Erlenbach ZH, Erlenhöhe\r
Erlenbach ZH, Schulhaus\r
Erlenbach ZH, Bahnhofstrasse\r
Erlenbach ZH, Alterswohnheim\r
Erlenbach ZH, Im Loo\r
Erlenbach ZH, Föhrenstrasse\r
Erlenbach ZH, Chapf\r
Erlenbach ZH, Im Streuli\r
Erlenbach ZH, Sandfelsenstr.\r
Erlenbach ZH, Trottgatter\r
Erlenbach ZH, Pflugstein\r
Erlenbach ZH,Kirchgemeindehaus\r
Erlenbach ZH, Im Vogelsang\r
Erlenbach ZH, Rebstrasse\r
Erlenbach ZH, Im Bindschädler\r
Erlenbach ZH, Allmend\r
Erlenbach ZH (See)\r
Erlinsbach, Rössli\r
Erlinsbach, Kilbig\r
Erlinsbach, Laurenzenbad\r
Erlinsbach, Dorfplatz\r
Erlinsbach, Dägermoos\r
Erlinsbach, Sugen\r
Erlinsbach, Sagi\r
Erlinsbach, Abzw. Hard\r
Erlinsbach, Oberdorf\r
Erlinsbach, Breitmis\r
Erlinsbach, Plattenstrasse\r
Erlinsbach, Stüsslingerstrasse\r
Erlinsbach, Steinenbach\r
Erlinsbach, Rebberg\r
Ermatingen, Bahnhof\r
Ermatingen, Rathaus\r
Ermatingen, Friedhof\r
Ermatingen\r
Ermatingen (See)\r
Ermensee, Kapelle\r
Ermensee\r
Ermenswil, Stich\r
Ermenswil, Post\r
Ermenswil, Hirschen\r
Ernen, Wasen-Zauberwald\r
Ernen, Mossji\r
Ernen, Z'Brigg\r
Ernen, Dorfplatz\r
Ernen, Niederernen\r
Ernen, Uf dr Blatte\r
Ernen, Aragon\r
Ernetschwil, Hinterernetschwil\r
Ernetschwil, Häblingen\r
Ernetschwil, Dorf\r
Ernetschwil, Hof\r
Erschmatt, Kreuzmatten\r
Erschmatt, Dorf\r
Erschwil, St. Benedikt\r
Erschwil, Dorf\r
Ersigen, Gemeindehaus\r
Ersigen, Oberdorf\r
Ersigen, Unterdorf\r
Erstfeld, Oberdorf\r
Erstfeld, Reformierte Kirche\r
Erstfeld, Birtschen\r
Erstfeld, Unterdorf\r
Erstfeld, Bahnhof\r
Erstfeld\r
Erstfeld, Lindenried\r
Erzegg\r
Erzenholz, Schulhaus\r
Erzenholz, Dorfbrunnen\r
Eschen, Presta\r
Eschen, Kohlplatz\r
Eschen, Rofenberg Kapelle\r
Eschen, Eintracht\r
Eschen, Sportpark\r
Eschen, Brühl\r
Eschen, KiGa Schönabüel\r
Eschen, Dorfplatz\r
Eschen, Haldengasse\r
Eschen, Primarschule\r
Eschenbach LU, Luzernstrasse\r
Eschenbach LU, Lindenfeld\r
Eschenbach LU\r
Eschenbach SG, Twirren\r
Eschenbach SG, Mettlen\r
Eschenbach SG, Bildstöckli\r
Eschenbach SG, Post\r
Eschenbach SG, Säge\r
Eschenbach SG, Dorftreff\r
Eschenbach SG, Lettengasse\r
Eschenbach SG, Breiten\r
Eschenbach SG, Oberfeld\r
Eschenbach SG, Sternen\r
Eschenbach SG, Gublen\r
Eschenbach SG, Riet\r
Eschenbach SG, Kählen\r
Eschenz, Barriere\r
Eschenz\r
Eschenz, Höfen\r
Eschenz, Bornhausen\r
Eschenz, Mettlen\r
Eschert, village\r
Eschert, Sous-la-Rive\r
Eschlikon TG, Bahnhof Süd\r
Eschlikon TG, Mitteldorf\r
Eschlikon TG\r
Eschlikon TG, altes Schulhaus\r
Eschlikon TG, Industrie\r
Escholzmatt, Bahnhof\r
Escholzmatt\r
Escholzmatt, Riedgasse\r
Escholzmatt, Lehn\r
Escholzmatt, Feldmoos\r
Esmonts, bif.\r
Espel (Talst.Stöfelibahn)\r
Essert FR, bif.\r
Essert FR, La Riedera\r
Essert-Pittet\r
Essert-sous-Champvent, village\r
Essert-sous-Champvent\r
Essertes, village\r
Essertes, Le Pralet\r
Essertfallon\r
Essertines-s.-Yv., Gde Salle\r
Essertines-sur-Rolle, village\r
Essertines-sur-Rolle,Le Pontet\r
Esslingen, Loogarten\r
Esslingen\r
Esslingen, Lieburg\r
Esslingen, Oberesslingen\r
Esslingen, Bahnhof\r
Estavannens, Dessous\r
Estavannens, Dessus\r
Estavayer, Hôtel-de-ville\r
Estavayer-le-Gibloux, école\r
Estavayer-le-Gibloux, village\r
Estavayer-le-Gx,Les Planchette\r
Estavayer-le-Lac, hôpital\r
Estavayer-le-Lac, Plein Sud\r
Estavayer-le-Lac,rte d'Yverdon\r
Estavayer-le-Lac,Champ-de-Lune\r
Estavayer-le-Lac, Camus\r
Estavayer-le-Lac, port\r
Estavayer-le-Lac, plage\r
Estavayer-le-Lac, Tuillière\r
Estavayer-le-Lac, CO\r
Estavayer-le-Lac, La Corbière\r
Estavayer-le-Lac\r
Estavayer-le-Lac, Bel-Air\r
Estavayer-le-Lac, Esserpis\r
Estavayer-le-Lac, gare rout.\r
Estavayer-le-Lac (bateau)\r
Estévenens, dessus\r
Estévenens, dessous\r
Etablons de Riddes\r
Etablons de Riddes-Nord\r
Etagnières, village\r
Etagnières\r
Etiez\r
Etiez, gare\r
Etoy, En Folliar\r
Etoy, L'Espérance\r
Etoy, Bas du Rossé\r
Etoy\r
Etoy, gare\r
Etoy, Romanèche\r
Etoy, En Bellevue\r
Etoy, collège Les Communaux\r
Etoy, Grosses-Terres\r
Etoy, village\r
Etoy, Chenalette\r
Etoy, Route Suisse\r
Ettenhausen TG, Elggerstrasse\r
Ettenhausen-Emmetschloo\r
Ettingen, Oberdorf\r
Ettingen, Lebernweg\r
Ettingen, Chirsgärten\r
Ettingen, Dorf\r
Ettingen, Holle\r
Ettiswil, Schloss Wyher\r
Ettiswil, Surseestrasse\r
Ettiswil, Hinterdorf\r
Ettiswil, Oberdorf\r
Ettiswil, Post\r
Etzelkofen, Oberdorf\r
Etzelkofen, Dorf\r
Etzelwil\r
Etzgen, Rheintalstrasse\r
Etzgen, Schulhaus\r
Etzgen, Dorf\r
Etziken, Industrie\r
Etziken, Mehrzweckhalle\r
Etziken, Festgelände\r
Etziken, Dorf\r
Etzwilen\r
Euseigne, Pyramides d'Euseigne\r
Euseigne, bif. Mâche\r
Euseigne, Les Grangettes\r
Euseigne, Ritzé\r
Euseigne, Pont de Sauterot\r
Euseigne, la Combaz\r
Euseigne, village\r
Euthal, Ruostel\r
Euthal, Drusberg\r
Euthal, Ängi\r
Euthal, Alte Festung\r
Euthal, Steinbach\r
Euthal, Schulhaus\r
Euthal, Höhport\r
Euthal, Rüti\r
Evilard, place du village\r
Evilard, école\r
Evilard, La Lisière\r
Evilard, chapelle\r
Evilard/Leubringen\r
Evionnaz, grande salle\r
Evionnaz, gare\r
Evionnaz\r
Evolène, La Fauchère\r
Evolène, La Villettaz\r
Evolène, Les Flantzes\r
Evolène, centre scolaire\r
Evolène, Planchet\r
Evolène, Village\r
Evolène, Route de Lannaz\r
Ewil Maxon\r
Ewil Maxon, Bahnhof\r
Exergillod\r
Eyholz, Ritikapelle\r
Eyholz, Brücke\r
Eyholz, Einkaufszentren Riti\r
Eyholz, Abzw. Lalden\r
Eyholz, Heechriz\r
Eyholz\r
Eymatt b. Bern, Camping\r
Eysins, centre\r
Eysins, est\r
Eysins, Terre-Bonne nord\r
Eysins, Petit-Eysins\r
Fafleralp\r
Fahrni b. Thun, Dörfli\r
Fahrni b. Thun, Bach\r
Fahrni b. Thun, Lueg\r
Fahrni b. Thun, Obere Mürggen\r
Fahrni b. Thun, Schlierbach\r
Fahrni b. Thun, Lood\r
Fahrni b. Thun, Schmiede\r
Fahrni b. Thun, Rachholtern\r
Fahrni b.Thun, Abrahams Schoss\r
Fahrwangen, Spitzacker\r
Fahrwangen, Bahnhof\r
Fahrwangen, Bärenplatz\r
Fahrweid, Brunaustrasse\r
Fahrweid, Limmatbrücke\r
Fahrweid, Au\r
Fahy, poids public\r
Fahy, douane\r
Fahy, église\r
Faido, Stazione\r
Faido, Centrale telefoni\r
Faido, Pesa comunale\r
Faido, Birreria\r
Faido, Chia Meiza\r
Faido, Casa per Anziani\r
Faido, Balcengo\r
Faido, centro scolastico\r
Faido, Bivio Ospedale\r
Faido, Ospedale Distrettuale\r
Faido, Centrale elettrica\r
Faido, Posta\r
Faido\r
Fajauna, alte Post\r
Fajauna, Tanis\r
Fajauna, bi Däschers\r
Fajauna, Bodenrank\r
Falera, center\r
Falera, Pasternaria Veglia\r
Falera, Volg\r
Falera, Via Fuorns\r
Falera, Ponylift\r
Falera, Manduns\r
Falera, Bigliac\r
Falera, Parcadi\r
Falera, Sulom da Puoz\r
Falera, Giaus sura\r
Falera, Samun\r
Falera, La Fermata\r
Falera, Mulin\r
Falera, Lavintgin\r
Falera, Chintguns\r
Falera, Prau da Cuort\r
Falera (Talstation Curnius)\r
Fällanden, Gemeindehaus\r
Fällanden, Wigarten\r
Fällanden, Schützenhaus\r
Fällanden, Neuhus\r
Fällanden, Zil\r
Fällanden, Industrie\r
Fällanden, Eggler\r
Fällanden, Bruggacher\r
Fällanden, Jugendherberge\r
Fällanden (See)\r
Fallboden (Sesselbahn)\r
Fanas, Trügli\r
Fanas, Seilbahn\r
Fanas, Kapitelhof\r
Fanas, Kirche\r
Fanas, Neugaden\r
Fanas (Luftseilbahn)\r
Fang\r
Fankhaus (Trub), Schnidershus\r
Fankhaus (Trub), Schulhaus\r
Fankhaus (Trub),Zwüschengreben\r
Fankhaus (Trub), Gärstengraben\r
Faoug\r
Faoug débarcadère\r
Farnern, Jura\r
Färnigen\r
Farvagny-le-Grand, CO Gibloux\r
Farvagny-le-Grand, centre\r
Farvagny-le-Petit\r
Faulensee, Am See\r
Faulensee, Oberdorf\r
Faulensee, Dorf\r
Faulensee, Angernstrasse\r
Faulensee, Möve\r
Faulensee (See)\r
Fayaux\r
Fayot\r
Féchy, En Burnens\r
Féchy, Auberge\r
Féchy, Cassivettes\r
Feegletscher\r
Fehraltorf, Halden\r
Fehraltorf, Grundstrasse\r
Fehraltorf, Undermüli\r
Fehraltorf, Schrännenbrunnen\r
Fehraltorf, Sennerei\r
Fehraltorf, Zelgli\r
Fehraltorf\r
Fehraltorf, Am Wildbach\r
Fehraltorf, Bahnhof\r
Fehren, Steinenbühlhöhe\r
Fehren, Postmuseum\r
Felben, Ost\r
Felben, Unterdorf\r
Felben, Löwen\r
Felben, Römerstrasse\r
Felben-Wellhausen\r
Felben-Wellhausen, Schulhaus\r
Feldbach, Bahnhof\r
Feldbach\r
Feldbach, Viadukt\r
Feldbrunnen, Bahnhof\r
Feldbrunnen\r
Feldis/Veulden\r
Feldis/Veulden, Dorfplatz\r
Feldis/Veulden, Nurlagn\r
Feldis/Veulden, Sesselb. Mutta\r
Feldis/Veulden (Sesselbahn)\r
Fell\r
Fellboden\r
Felsberg, Kirchenstutz\r
Felsberg, Calanda\r
Felsberg, Bahnhofstrasse\r
Felsberg, Ringelweg\r
Felsberg, Brugg\r
Felsberg, Underchrüzli\r
Felsberg, Post\r
Felsberg, Rjterstutz/Aeuli\r
Felsberg, Schöneggstrasse\r
Felsberg, Abzw.\r
Felsberg\r
Felsenegg\r
Felskinn\r
Fenalet-sur-Bex, Grande Salle\r
Fenalet-sur-Bex, village\r
Fenil-sur-Corsier,zone indust.\r
Fenil-sur-Corsier, vieille rte\r
Fenil-sur-Corsier, Pont\r
Fenin\r
Fenkrieden, Linde\r
Fenkrieden, Kreuzstrasse\r
Fenkrieden, Dorf\r
Fenkrieden, Chüttig\r
Ferden, Schulhaus\r
Ferden, Bärsol\r
Ferden, Kummenalp\r
Ferden, Faldumalp\r
Ferden, Dorf\r
Ferenbalm, Jerisberg\r
Ferenbalm, Jerisberghof\r
Ferenbalm, Rütimatt\r
Ferenbalm, Dorf\r
Ferlens VD, Le Moulin\r
Ferlens VD, Champ des Oches\r
Ferpècle\r
Ferpicloz, bif. Praroman\r
Ferrera, Abzw. Val digl Uors\r
Ferrera, Ausserferrera\r
Ferrera, Schmelzi\r
Ferrera, Punt Martegn\r
Ferrera, Innerferrera\r
Ferrera, Plan Davains\r
Ferret\r
Ferreyres, village\r
Ferreyres, La Tine\r
Feschel, Dorf\r
Fescoggia, Paese\r
Fétigny, Grange-des-Bois\r
Fétigny, Pré de Ville\r
Fétigny, Vers la Croix\r
Fétigny, village\r
Fétigny, Les Sapelettes\r
Feuerthalen\r
Feuerthalen, Kirchstrasse\r
Feuerthalen, Lindenbuck\r
Feuerthalen, Bahnhof\r
Feuerthalen, Rhymarkt\r
Feuerthalen, Stumpenboden\r
Feuerthalen, Zentrum Kohlfirst\r
Feusisberg, Gemeindehaus\r
Feusisberg, Riedhof\r
Feusisberg, Feld\r
Feusisberg, First\r
Feusisberg, Alterszentrum\r
Feusisberg, Hotel Panorama\r
Feusisberg, Kreuzstrasse\r
Feusisberg, Ried\r
Feutersoey, Bühl\r
Feutersoey, Dorf\r
Fey, village\r
Fey\r
Fey (Nendaz), village\r
Fey (Nendaz), Les Bans\r
Fey (Nendaz), Crevey\r
Fey (Nendaz), Le Dinto\r
Fey (Nendaz), Moralla\r
Fey (Nendaz), Les Tsejas\r
Fiaugères, croisée\r
Fiaugères, Planches-Tuchet\r
Fiaugères, En Saubaz\r
Fidaz, Dorf\r
Fidaz, Pinut\r
Fidaz, Kirche\r
Fidaz, Bargis\r
Fidaz, Waldrand\r
Fideris, Au\r
Fideris, Madinis\r
Fideris, Rüfi\r
Fideris, Strahlegg\r
Fideris, Arieschbach\r
Fideris, Heuberg Arflina\r
Fideris, alte Sägerei\r
Fideris\r
Fideris, Dorf\r
Fideris, Bord\r
Fiesch, Moos\r
Fiesch, Bahnhof\r
Fiesch, Abzw. Feriendorf\r
Fiesch, Cheera\r
Fiesch, Schule\r
Fiesch\r
Fiesch, Dorf\r
Fiesch (Talstation)\r
Fiesch Feriendorf\r
Fiesch Flesch\r
Fiesch Heimatt (Talstation)\r
Fiesch Talegga\r
Fiescheralp\r
Fiescheralp (Bergst. Heimatt)\r
Fiescheralp (Flesch)\r
Fiescheralp (Talegga)\r
Fieschertal, Dorfplatz\r
Fieschertal, Wichel\r
Fiesso, Paese\r
Fiez, village\r
Fiez, collège\r
Figgione, Bivio per Figgione\r
Figino, Dogana\r
Figino, Posta\r
Figino (lago)\r
Fil da Rubi\r
Filisur, Valleglia\r
Filisur, Bahnhof\r
Filisur, Schöntal\r
Filisur, Dorf\r
Filisur\r
Filzbach, Römerturm\r
Filzbach, Milchzentrale\r
Filzbach, Garage\r
Filzbach, Sportzentrum\r
Filzbach, Reutegg\r
Filzbach (Habergschwänd Talst)\r
Fimmelsberg, Kreuz\r
Findelbach\r
Findeln\r
Finhaut, Le Pas\r
Finhaut, gare\r
Finhaut, La Léchère\r
Finhaut, Le Léamon\r
Finhaut\r
Finhaut, Corbes\r
Finhaut, Les Fontaines\r
Finstersee, Kirche\r
Finsterwald LU, alte Post\r
Finsterwald LU, Kirche\r
Finsterwald LU, Chilenwald\r
Finsterwald LU, Rotbach\r
Finsterwald LU, Erlengraben\r
Finsterwald LU, Schwändeli\r
Finsterwald LU, Entlematt\r
Finsterwald LU, Lippern\r
Finsterwald LU, Gründli\r
Fionnay\r
First (Grindelwald)\r
First (Oberjoch)\r
Fischbach LU, Leimbütz\r
Fischbach LU, Reiferswil\r
Fischbach LU, Krone\r
Fischbach LU, alte Post\r
Fischbach-Göslikon, Sternen\r
Fischbach-Göslikon, Kirchenack\r
Fischbach-Göslikon, Zentrum\r
Fischbach-Göslikon, Reusstal\r
Fischenthal, Bahnhof\r
Fischenthal, Fistel\r
Fischenthal\r
Fischenthal, Schmittenbach\r
Fischingen, Kloster\r
Fischingen, Grüner Baum\r
Fischingen, Sonne\r
Fischingen, Scheidweg\r
Fisibach, Schulhaus\r
Fislisbach, Monopol\r
Fislisbach, Niederrohrdorferst\r
Fislisbach, Sportanlage Esp\r
Fislisbach, Gemeindehaus\r
Fislisbach, Sommerhalde\r
Fislisbach, Dorfstrasse\r
Fislisbach, Alterszentrum\r
Fislisbach, Steinäcker\r
Fislisbach, Post\r
Flaach, Naturzentrum Thurauen\r
Flaach, Oberdorf\r
Flaach, Unterdorf\r
Flaach, Ellikerbrücke\r
Flaach, Kirche\r
Flaach, Ziegelhütte\r
Flaach, Wesenplatz\r
Flamatt, Oberflamatt\r
Flamatt, Chrummatt\r
Flamatt, Post\r
Flamatt, Bahnhof\r
Flamatt\r
Flamatt Dorf\r
Flanthey, poste\r
Flanthey, rte de Valençon\r
Flanthey, Vaas-d'en-Bas\r
Flanthey, Oasis\r
Flanthey, Chelin\r
Fläsch, Dorf\r
Flawil, Niederberg\r
Flawil, Badstrasse\r
Flawil, Herrensberg\r
Flawil, Wohn- und Pflegeheim\r
Flawil, Luegisland\r
Flawil, Rütistrasse\r
Flawil, Bärenplatz\r
Flawil, Schändrich\r
Flawil, Birkenstrasse\r
Flawil, Bahnhofstrasse\r
Flawil, Buebental\r
Flawil, Unterstrasse\r
Flawil, Reithalle\r
Flawil, Städeli\r
Flawil, Isnyplatz\r
Flawil, Wilerstrasse\r
Flawil, Oberglatt\r
Flawil, Oberstrasse\r
Flawil, Glatthalde\r
Flawil, Alpsteinstrasse\r
Flawil, Botsberg\r
Flawil, Scheidweg\r
Flawil, Maestrani\r
Flawil, Alterssiedlung\r
Flawil, Lindengut\r
Flawil, Bahnhof\r
Flawil\r
Flawil, Burgau\r
Flendruz\r
Flerden, Baria\r
Flerden, Pro Peua\r
Flerden, Dorf\r
Fleurier, Grand-Rue\r
Fleurier, gare\r
Fleurier, collège régional\r
Fleurier\r
Fleurier, Grands Clos\r
Fleurier, Hôtel de ville\r
Fli, Seestern\r
Fli, Hirschen\r
Flims Dorf, Wohnheim Plaids\r
Flims Dorf, Post\r
Flims Dorf, Fussweg Caglims\r
Flims Dorf, Sulten\r
Flims Dorf, Caglims\r
Flims Dorf, Oberdorf\r
Flims Dorf, Vallorca\r
Flims Dorf, Denter Vias\r
Flims Dorf, Auas sparsas\r
Flims Dorf, Val Tgiern\r
Flims Dorf, Dorfbrunnen\r
Flims Dorf, Cangina\r
Flims Dorf, Casa Caglims\r
Flims Dorf, Pleuncas\r
Flims Dorf, Conn\r
Flims Dorf, Fischeisch\r
Flims Dorf, Fischeisch Wendep.\r
Flims Dorf, Bergbahnen\r
Flims Dorf, Spielplatz Plaids\r
Flims Dorf (Talstation Foppa)\r
Flims Dorf (Talstation Plaun)\r
Flims Waldhaus, Camping\r
Flims Waldhaus, Prau la Selva\r
Flims Waldhaus, Abzw. Il Stuz\r
Flims Waldhaus, LL-Zentrum\r
Flims Waldhaus, Kath. Kirche\r
Flims Waldhaus, Promenada\r
Flims Waldhaus, Segnes\r
Flims Waldhaus, Spielplatz\r
Flims Waldhaus, Lieptgas\r
Flims Waldhaus, Surpunt\r
Flims Waldhaus, Caumasee\r
Flims Waldhaus, Sumandedas\r
Flimsattel\r
Flond, Platta Lada\r
Flond, vitg\r
Flüela, Ospiz\r
Flüelen, Altersheim\r
Flüelen, Matte\r
Flüelen, Hauptplatz\r
Flüelen, Gruonbach\r
Flüelen, Reider\r
Flüelen, Usserdorf\r
Flüelen\r
Flüelen, Bahnhof\r
Flüelen (See)\r
Flüelen (Talstation Eggberge)\r
Flüeli-Ranft, Z'Mos\r
Flüeli-Ranft, Kehrwäldli\r
Flüeli-Ranft, Chilchweg\r
Flüeli-Ranft, St. Dorothea\r
Flüeli-Ranft, Dorf\r
Flüeli-Ranft, Allmend\r
Flüh, Schulhaus\r
Flüh, Station\r
Flüh, Mühle\r
Flüh, Sternenbergstrasse\r
Flühli LU, Torbach\r
Flühli LU, Krutacher\r
Flühli LU, Hochwald\r
Flühli LU, Golfplatz\r
Flühli LU, Hirseggbrücke\r
Flühli LU, Schintmoos\r
Flühli LU, Usser-Lamm\r
Flühli LU, Hüttlenen\r
Flühli LU, Matzenbach\r
Flühli LU, Post\r
Flumenthal, Post\r
Flumenthal\r
Flums, Post\r
Flums, Platten\r
Flums, Bahnhof\r
Flums, Kirchplatz\r
Flums, Galserschstrasse\r
Flums, Wiesental\r
Flums, Alpenrösli\r
Flums, Lochriet\r
Flums, Rathaus\r
Flums, Hochwiese\r
Flums, Laurentius\r
Flums\r
Flums, Flumserei\r
Flums, Sportplatz\r
Flumserberg, Tannenbodenwiese\r
Flumserberg, Tannenboden\r
Flumserberg, Ruslen\r
Flumserberg, Brünsch\r
Flumserberg, Tannenboden Dorf\r
Flumserberg, Mittenwald\r
Flumserberg, Tannenheim\r
Flumserberg, Oberberg\r
Flumserberg, Plattewiese\r
Flumserberg, Gasella\r
Flumserberg, Bergheim\r
Flumserberg, Alpenhof\r
Flumserberg Arve (Talstation)\r
Flumserberg Chrüz (Bergstat.)\r
Flumserberg Chrüz (Twärchamm)\r
Flumserberg Grueb\r
Flumserberg Leist\r
Flumserberg Obersäss (Talst.)\r
Flumserberg Portels, Dorf\r
Flumserberg Portels, Höfli\r
Flumserberg Portels, Richtersr\r
Flumserberg Saxli, Rutz\r
Flumserberg Saxli, Mutten\r
Flumserberg Saxli, Saxlirank\r
Flumserberg Saxli, Saxli\r
Flumserberg Saxli, Stegen\r
Flumserberg Saxli, Hof\r
Flumserberg Stelli\r
Flumserberg Stellisattel\r
Flumserberg Tannenboden\r
Flumserberg Tannenheim\r
Flumserberg Twärchamm\r
Flurlingen, AROVA\r
Fondo del Bosco\r
Font, village\r
Font, école\r
Fontainemelon, Sous la Lisière\r
Fontainemelon, collège\r
Fontainemelon, Ferme Matile\r
Fontainemelon, sous l'Usine\r
Fontainemelon, centre\r
Fontaines NE, Les Bassins\r
Fontaines NE, Le Pavé\r
Fontaines NE, Le District\r
Fontaines-sur-Grandson,collège\r
Fontana, Cioss di dentro\r
Fontana, Paese\r
Fontana, Gerora\r
Fontana (Bavona)\r
Fontanellata (Bavona)\r
Fontanets\r
Fontanezier, bas du village\r
Fontanivent, Chantey\r
Fontanivent, gare\r
Fontanivent\r
Fontannaz-Seulaz\r
Fontanney\r
Fontany\r
Fontenais, sur Les Rochets\r
Fontenais, les Rochets\r
Fontenais,place de la Fontaine\r
Fontenelle\r
Fontnas, Dorf\r
Foppa\r
Forch\r
Forel (Lavaux), La Chesaude\r
Forel (Lavaux), Casard\r
Forel (Lavaux), Le Plane\r
Forel (Lavaux), La Tuilière\r
Forel (Lavaux), Cornes de Cerf\r
Forel (Lavaux), rte Industrie\r
Forel (Lavaux), Les Confréries\r
Forel (Lavaux), Pra Pélisson\r
Forel (Lavaux), La Chercotte\r
Forel (Lavaux), Grand Champ\r
Forel FR, Forestel\r
Forel FR, La Vernase\r
Forel FR, Les Planches\r
Forel FR, village\r
Forel-sur-Lucens, Dessous\r
Formangueires, Moulin\r
Fornasette, Villaggio vacanze\r
Fornasette, Dogana Svizzera\r
Fornet-Dessous, bif. Pré-Piat\r
Fornet-Dessous, village\r
Fornet-Dessous, La Matenne\r
Fornet-Dessus, village\r
Fornet-Dessus, Dos des Laves\r
Foroglio (Bavona)\r
Forst b. Längenbühl, Breite\r
Forst b. Längenbühl, Käserei\r
Fortunau (Ayent), centre\r
Fortunau (Ayent), Les Fiefs\r
Fortunau (Ayent),Torrent-Croix\r
Fortunau (Ayent), Les Giettes\r
Fortunau (Ayent), Samarin\r
Fortunau (Ayent), Les Flans\r
Fosano\r
Founex, village\r
Founex, est\r
Founex, ouest\r
Foyer Dents-du-Midi\r
Fräkmüntegg\r
Fräschels\r
Frasco, Paese\r
Frasco, Torbola\r
Frasco, Chiesa\r
Frasco, Campagne\r
Frasco, Mora di Fuori\r
Frasco, Mora\r
Frasco, Cantone\r
Frasnacht, Domino\r
Frasnacht, Rotbuch\r
Frasnacht, Bruderer\r
Frasnacht, Post\r
Frasnacht, Arbonia\r
Frasses\r
Fraubrunnen, Bahnhof\r
Fraubrunnen\r
Fraubrunnen, Rest. Löwen\r
Frauenfeld, Schaffhauserplatz\r
Frauenfeld, Walzmühle\r
Frauenfeld, Sonnmatt\r
Frauenfeld, Jugendmusikschule\r
Frauenfeld, Bahnhof\r
Frauenfeld, Rosenbergstrasse\r
Frauenfeld, Juch\r
Frauenfeld, Feldgasse\r
Frauenfeld, Messenriet\r
Frauenfeld, Auenfeld\r
Frauenfeld, Ahornweg\r
Frauenfeld, Brotegg\r
Frauenfeld, Im Steinacker\r
Frauenfeld, Huben\r
Frauenfeld, Erchingerhof\r
Frauenfeld, Grünmattweg\r
Frauenfeld, Langfeldkreisel\r
Frauenfeld, Obergriesen\r
Frauenfeld, Oberfeldstrasse\r
Frauenfeld, Paketpost\r
Frauenfeld, Sonnenhofstrasse\r
Frauenfeld, Soldatendenkmal\r
Frauenfeld, Sternwartestrasse\r
Frauenfeld, Staudenweg\r
Frauenfeld, Speerstrasse\r
Frauenfeld, General-Weber-Str.\r
Frauenfeld, Flurhof\r
Frauenfeld, Osterhalden\r
Frauenfeld, Altstadt\r
Frauenfeld, Friedhof\r
Frauenfeld, Graströchni\r
Frauenfeld, Breitfeld\r
Frauenfeld, Hilzinger\r
Frauenfeld, Im Moos\r
Frauenfeld, Thundorferstrasse\r
Frauenfeld, Reutenenstrasse\r
Frauenfeld, Langdorf\r
Frauenfeld, Hauptpost\r
Frauenfeld, Ochsen\r
Frauenfeld, Sportplatz\r
Frauenfeld, Thurstrasse\r
Frauenfeld, Neuhofstrasse\r
Frauenfeld, Talackerstrasse\r
Frauenfeld, Scheidweg\r
Frauenfeld, Sandbüel\r
Frauenfeld, Alterszentrum Park\r
Frauenfeld, Lachenstrasse\r
Frauenfeld, Rorerbrücke\r
Frauenfeld, Kirche Kurzdorf\r
Frauenfeld\r
Frauenfeld, Bühl\r
Frauenfeld, Marktplatz\r
Frauenfeld, Mittelrüti\r
Frauenfeld, Oberwiesen\r
Frauenfeld, Westfeld\r
Frauenfeld, Wellhauserweg\r
Frauenfeld, Talbach\r
Frauenfeld, Paulisguet\r
Frauenfeld, Staubeggstrasse\r
Frauenfeld, Spitzrüti\r
Frauenfeld, Bannhaldenstrasse\r
Frauenfeld, Eibenstrasse\r
Frauenfeld, Allmendweg\r
Frauenfeld, Buebenweg\r
Frauenfeld, Eisenwerk\r
Frauenfeld, Neuhauserstrasse\r
Frauenfeld, Zielweg\r
Frauenfeld, Oststrasse\r
Frauenfeld, Im Alexander\r
Frauenfeld, Oberkirchstrasse\r
Frauenfeld, Obholz\r
Frauenfeld, Wiesrain\r
Frauenfeld, Lärchenweg\r
Frauenfeld, Fliederstrasse\r
Frauenfeld, Bruder-K. Kapelle\r
Frauenfeld, Arche Noah\r
Frauenfeld, Eichholz\r
Frauenfeld, Algisser\r
Frauenfeld, Burgerholz\r
Frauenfeld, Lindenplatz\r
Frauenfeld, Kurzfeld\r
Frauenfeld, Kehlhof\r
Frauenfeld, Kantonsschule\r
Frauenfeld, Maiholzstrasse\r
Frauenfeld, Laubgasse\r
Frauenfeld, Neue Schule\r
Frauenfeld, Weinacker\r
Frauenfeld, Wannenfeld\r
Frauenfeld, Wydenstrasse\r
Frauenfeld, Schönenhof\r
Frauenfeld, Rötelimoos\r
Frauenfeld, Rathaus\r
Frauenfeld, Plättli Zoo\r
Frauenfeld, Wellauer\r
Frauenfeld, Schlosspark\r
Frauenfeld, Thurgipark\r
Frauenfeld, Kantonsspital\r
Frauenfeld, Aumühle\r
Frauenfeld Marktplatz\r
Frauenkappelen, Chrummacher\r
Frauenkappelen, Heggidorn\r
Frauenkappelen, Kirche\r
Frauenkappelen, Hübeli\r
Frauenkappelen, Längägerten\r
Fregiécourt, Sous le Montillat\r
Fregiécourt, place La Baroche\r
Freibergen\r
Freidorf TG, Kreuzegg\r
Freienbach, Obstgarten\r
Freienbach, Seeberg\r
Freienbach, Kirche\r
Freienbach, alte Post\r
Freienbach, Stationsweg\r
Freienbach, Chrummen\r
Freienbach, Bahnhof SOB\r
Freienbach, Sarenbach\r
Freienbach, Gehren\r
Freienbach, Leutschen\r
Freienbach, Grütze\r
Freienbach, Oechsli\r
Freienbach SBB\r
Freienbach SOB\r
Freienstein, Wohnschule\r
Freienstein, Dorf\r
Freienstein, Friedhof Federen\r
Freienstein, Alte Brücke\r
Freienstein, Breite\r
Freienwil, Dorf\r
Frenières-sur-Bex, bif.\r
Frenkendorf, Dorfplatz\r
Frenkendorf, Schule Egg\r
Frenkendorf, Bächliacker\r
Frenkendorf, Mühlacker\r
Frenkendorf, Friedhof\r
Frenkendorf-Füllinsdorf, Bhf\r
Frenkendorf-Füllinsdorf\r
Fresens, bas du village\r
Fresens, village centre\r
Fretereules\r
Freudwil, Im Dörfli\r
Fribourg, Gambach\r
Fribourg, Kessler\r
Fribourg, Chaley\r
Fribourg, Ploetscha\r
Fribourg, Stade-Patinoire\r
Fribourg, St-Pierre\r
Fribourg, Miséricorde\r
Fribourg, Planche-Inférieure\r
Fribourg, Plateau-de-Pérolles\r
Fribourg, Capucins\r
Fribourg, Pisciculture\r
Fribourg, Stadtberg\r
Fribourg, Boschung\r
Fribourg, Fonderie\r
Fribourg, Bellevue\r
Fribourg, Champ-des-Fontaines\r
Fribourg, Guintzet\r
Fribourg, Jardin botanique\r
Fribourg, Torry\r
Fribourg, Auge Sous-Pont\r
Fribourg, Neuveville/Motta\r
Fribourg, Palme\r
Fribourg, Place Georges Python\r
Fribourg, Bourg\r
Fribourg, Eglise-St-Jean\r
Fribourg, Bourgknecht\r
Fribourg, Guisan\r
Fribourg, Porte-de-Berne\r
Fribourg, bluefactory\r
Fribourg, Industrie\r
Fribourg, Champriond\r
Fribourg, Vignettaz-Daler\r
Fribourg, Arsent\r
Fribourg, Poya\r
Fribourg, Neuveville/Court-Ch.\r
Fribourg, Cité-Levant\r
Fribourg, Champ-Fleuri\r
Fribourg, Karrweg\r
Fribourg, Petit-St-Jean\r
Fribourg, Bertigny\r
Fribourg, Vuille\r
Fribourg, Charmettes\r
Fribourg, Ste-Thérèse\r
Fribourg, Université\r
Fribourg, J. Vogt\r
Fribourg, Bethléem\r
Fribourg, Schönberg Dunant\r
Fribourg, cimetière\r
Fribourg, Cité-Jardins\r
Fribourg, Musy 24\r
Fribourg, Musy 4\r
Fribourg, Bd Pérolles/gare\r
Fribourg, Beauregard\r
Fribourg, Beaumont\r
Fribourg, Fries\r
Fribourg, Mon-Repos\r
Fribourg, Windig\r
Fribourg, Jura Chassotte\r
Fribourg, Rte de la Glâne\r
Fribourg, Richemond/gare\r
Fribourg, Tilleul/Cathédrale\r
Fribourg, Arsenaux\r
Fribourg, Route-de-Tavel\r
Fribourg, Heitera\r
Fribourg, Vieux-Chênes\r
Fribourg, Pont-Zaehringen\r
Fribourg-Neuveville/Motta\r
Fribourg-St-Pierre\r
Fribourg/Freiburg, gare/Tivoli\r
Fribourg/Freiburg, Pl. Gare\r
Fribourg/Freiburg\r
Fribourg/Freiburg, gare rout.\r
Fribourg/Freiburg Poya\r
Frick, Neumatt\r
Frick, Oberdorf\r
Frick, Ebnet\r
Frick, Bahnhof\r
Frick, Bänihübel\r
Frick, Unterdorf\r
Frick, Firma Müller\r
Frick\r
Frick, Abzw. Ittenthal\r
Frienisberg, Dorf\r
Frienisberg, Elemoos\r
Frieswil, Dorf\r
Friltschen, Dorf\r
Frinvillier, village\r
Frinvillier, bif sur Vauffelin\r
Frinvillier, gare\r
Frinvillier-Taubenloch\r
Froideville, village\r
Froideville, Laiterie\r
Froideville, croisée\r
Fronalp (GL), Unter Stafel\r
Fronalpstock\r
Frümsen, Schäfli\r
Frümsen, Rathaus / Staubern\r
Frümsen, Stig\r
Frümsen, Frol\r
Frümsen (Luftseilbahn)\r
Fruthwilen, Schreinerei\r
Fruthwilen, Oberfruthwilen\r
Frutigen, Kreuzgasse\r
Frutigen, Ausser Rohrbach\r
Frutigen, Spital\r
Frutigen, Meise\r
Frutigen, Hohstalden\r
Frutigen, Marktplatz\r
Frutigen, Achere\r
Frutigen, Gantengraben\r
Frutigen, Ried\r
Frutigen, Tellenfeld\r
Frutigen\r
Frutigen, Tropenhaus\r
Frutigen, Widi\r
Frutigen, Ischlag\r
Frutigen, Rohrbach\r
Frutigen, Chriesbaum\r
Frutigen, Winklen\r
Frutigen, Innerbräschgen\r
Frutigen, Bahnhof\r
Frutigen, Widigasse\r
Frutigen, Landi\r
Frutigen, Zrydsbrügg\r
Frutigen, Rybrügg\r
Fruttli\r
Ftan, Baraigla\r
Ftan, Institut\r
Ftan, cumün\r
Ftan Baraigla\r
Ftan Fionas\r
Fuldera, cumün\r
Fuldera, Daint\r
Fuldera, Furom\r
Fulenbach, Boningerstrasse\r
Fulenbach, Höchi\r
Fulenbach, Aaretränke\r
Fulenbach, Altes Schulhaus\r
Fulenbach, Wolfwilerstrasse\r
Fulenbach, Oberdorf\r
Full, Fähre\r
Full, Mitte\r
Full, Schulweg\r
Füllinsdorf, Mühlematt\r
Füllinsdorf, Friedhofweg\r
Füllinsdorf, Giebenacherstr.\r
Füllinsdorf, Rössliplatz\r
Füllinsdorf, Ebene\r
Füllinsdorf, Obere Hofackerstr\r
Füllinsdorf, Schule Schönthal\r
Füllinsdorf, Niederschönthal\r
Füllinsdorf, Schnäggeberg\r
Füllinsdorf, Lehmattweg\r
Füllinsdorf, Kittler\r
Füllinsdorf, Schönthal\r
Fully, Stade de Charnot\r
Fully, Le Carroz\r
Fully, Londzet\r
Fully, Verdan\r
Fully, La Forêt\r
Fully, Le Chenil\r
Fully, poste\r
Fully, Cycle d'orientation\r
Fully, Creppier\r
Fully, Pont de la Louye\r
Fultigen, Abzw.\r
Fuorcla\r
Fuorcla da Sagogn\r
Fuorcla Glüna\r
Fuorcla Grischa\r
Fürenalp\r
Fürgangen, Abzw. Bahnhof\r
Fürgangen (Talstation)\r
Fürgangen-Bellwald Talstation\r
Furgg (Sandiger Boden)\r
Furgg (Trockener Steg)\r
Furggabüel\r
Furggsattel\r
Furggstalden (Heidbodme)\r
Furggstalden (Saas-Almagell)\r
Furggulti\r
Furi\r
Furka DFB\r
Furka Passhöhe\r
Furkapass, Furkablick\r
Furna, Hinterberg\r
Furna, Abzw. Platta\r
Furna, Rasitsch\r
Furna, Abzw. Hasenhaus\r
Furna, Kirche\r
Furna\r
Furna, Post\r
Furna, Boden\r
Furna, Riedji\r
Furna, Gärbi\r
Fürstenau, Dorf\r
Fürstenau, Schloss\r
Fürstenau, Fürstenaubruck\r
Furt (Bergstation)\r
Furt (Talstation)\r
Furtschellas Bergstation\r
Furtschellas Mittelstation\r
Fusio, Paese\r
Fuyens, laiterie\r
Gabi (Simplon)\r
Gächlingen, Höfe\r
Gächlingen, Dorf\r
Gächlingen, Siblingerstrasse\r
Gächliwil, alte Post\r
Gächliwil, Wendeplatz\r
Gachnang, Hofen\r
Gachnang, Trotte\r
Gachnang, Kath. Kirche\r
Gachnang, Oberwilerstrasse\r
Gadastatt\r
Gadenstätt\r
Gadmen, Saageli\r
Gadmen, Schwendibrücke\r
Gadmen, Hopflauenen\r
Gadmen, Tällibahn\r
Gadmen, Feldmoos\r
Gadmen, Post\r
Gadmen, Obermad\r
Gadmen, Fuhren\r
Gaffia (Bergstation)\r
Gaffia (Talstation)\r
Gaflei, Klinik\r
Gaflei, Matu\r
Gaggio, Righetto\r
Gaggio, Paese\r
Gaggiolo, Confine\r
Gähwil, Schmid Garage\r
Gähwil, Dorf\r
Gähwil, Sportstrasse\r
Gähwil, Waldwies\r
Gais, Bahnhof\r
Gais\r
Galenstock (Furka)\r
Galgenen, Hornbach\r
Galgenen, Kirche\r
Galgenen, Diga\r
Galmiz\r
Galmiz, Käserei\r
Gals, Gemeindehaus\r
Gals, Neuhaus\r
Gals, Dorf\r
Gals, Bethlehem\r
Gammen, Gammenrain\r
Gammen, Schulhaus\r
Gampel, Zentrum\r
Gampel, Talstation LGJ\r
Gampel, Schulhaus\r
Gampel, Burketen\r
Gampel, Dorf\r
Gampel (Talstation Jeizinen)\r
Gampel-Steg\r
Gampel-Steg, Bahnhof\r
Gampelen, West\r
Gampelen, Dorf\r
Gampelen, Gürle\r
Gampelen\r
Gamplüt\r
Gamprin, Gemeindehaus\r
Gamprin, Waldeck\r
Gamprin, Salums\r
Gamprin, Haldenstrasse\r
Gamprin, Michel-Oehri\r
Gamprin, Abzw. Badäl-Schlatt\r
Gamprin, Stelzagass\r
Gamprin, Bühl\r
Gamprin, Jedergass\r
Gamprin, Unterbühl\r
Gamprin, Mühlegass\r
Gamprin, Simmasguet\r
Gamprin, Grossabünt\r
Gams, Gasenzen\r
Gams, Simmirank\r
Gams, Gamschol\r
Gams, Schulhaus Höfli\r
Gams, Zentrum\r
Gams, Widen\r
Gams, Zollhaus\r
Gams, Golfplatz\r
Gams, Pilgerbrunnen\r
Gams, Madrusa\r
Gams, Chrezibach\r
Gams, Schutzgunten\r
Gamsalp\r
Gamsen, Crazy Palace\r
Gamsen, Dorf\r
Gamsen, Gewerbez. Olympica\r
Gamsen, Landmauer\r
Gamsen, Kantonsstrasse\r
Gandegg\r
Gandria, Paese\r
Gandria, Strada\r
Gandria, Dogana\r
Gandria (lago)\r
Gandria Confine (lago)\r
Gänsbrunnen, St. Josef\r
Gänsbrunnen, Hasenmattweg\r
Gänsbrunnen\r
Gänsbrunnen, Bahnhof\r
Gänsbrunnen, Wirtshof\r
Gansingen, Oberdorf\r
Gansingen, Oberbüren\r
Gansingen, Unterbüren\r
Gansingen, Dorfplatz\r
Ganterschwil, alte Post\r
Ganterschwil, Grund\r
Ganterschwil, Oetschwilerstr.\r
Ganterschwil, Hirschen\r
Garaverio, Paese\r
Gasel\r
Gasel, Schlatt\r
Gasenried, Hubeln\r
Gasenried, Erbji\r
Gasenried, Dorfplatz\r
Gasenried, Chäschermatte\r
Gasenried, alte Post\r
Gastlosen\r
Gattikon, Gattikerhof\r
Gattikon, Obstgarten\r
Gattikon, Gattikerhöhe\r
Gautier\r
Gebenstorf, Rieden\r
Gebenstorf, Vogelsang\r
Gebenstorf, Brühl\r
Gebenstorf, Gemeindehaus\r
Gebenstorf, Kinziggraben\r
Gebenstorf, Waldheim\r
Gebenstorf, Reuss\r
Gebenstorf, Cherne\r
Gebenstorf, alte Post\r
Gebertingen, Abzw.Schulstrasse\r
Gebertingen, Frohe Aussicht\r
Gebertingen, Freudwil\r
Gebertingen, Schulhaus\r
Geimen\r
Geissholz, Hori\r
Geissholz, Dorf\r
Gelfingen, Kreisel\r
Gelfingen\r
Gelmersee\r
Gelterfingen, Schulhaus\r
Gelterfingen, Dorf\r
Gelterkinden, Bahnhof\r
Gelterkinden, Rickenbacherstr.\r
Gelterkinden, obere Mühle\r
Gelterkinden, Schwimmbad\r
Gelterkinden, Musikschule\r
Gelterkinden, Mühlestett\r
Gelterkinden\r
Gelterkinden, Post\r
Gelterkinden, Rünenbergerbr.\r
Gelterkinden, Maloya\r
Geltwil, Isenbergschwil\r
Geltwil, Schulhaus\r
Geltwil, Dorf\r
Gemmipass\r
Gempen, Schulhaus\r
Gempen, Dorf\r
Gempen, Steinacker\r
Gempenach, Dorf\r
Gempenach, Schoren\r
Gempenach, Abzw. Lurtigen\r
Gemsstock\r
Gendusas\r
Genestrerio, Canova\r
Genestrerio, Piazza\r
Genestrerio, Cimitero\r
Genestrerio, Croce Grande\r
Genève, Plainpalais\r
Genève, Appia\r
Genève, Tour de Champel\r
Genève, Rive\r
Genève, Amandolier\r
Genève, Crêts-de-Champel\r
Genève, Camille-Martin\r
Genève, Grottes\r
Genève, Epinettes\r
Genève, Chantepoulet\r
Genève, Maison de la Paix\r
Genève, Hôpital\r
Genève, Lombard\r
Genève, Contamines\r
Genève, Jean-Jacques\r
Genève, Parc Plage Eaux-Vives\r
Genève, Riant-Parc\r
Genève, Pont-d'Arve\r
Genève, Stand\r
Genève, Tourelle\r
Genève, Uni-Mail\r
Genève, Trembley\r
Genève, Villereuse\r
Genève, Dancet\r
Genève, Ariana\r
Genève, Acacias\r
Genève, 31-Décembre\r
Genève, Augustins\r
Genève, Butini\r
Genève, Colladon\r
Genève, Coutance\r
Genève, Cathédrale\r
Genève, Guye\r
Genève, De-Chateaubriand\r
Genève, Florissant\r
Genève, Goulart\r
Genève, Miremont\r
Genève, Lyon\r
Genève, Monthoux\r
Genève, Philosophes\r
Genève, Petit-Saconnex\r
Genève, Place de Neuve\r
Genève, Sainte-Clotilde\r
Genève, Servette\r
Genève, Velours\r
Genève, Vernets\r
Genève, Terrassière\r
Genève, Concorde\r
Genève, Alpes\r
Genève, Blanche\r
Genève, Bains\r
Genève, Collège Rousseau\r
Genève, Baulacre\r
Genève, Ecole-de-Médecine\r
Genève, Dôle\r
Genève, Canonnière\r
Genève, Délices\r
Genève, Florence\r
Genève, Charmilles\r
Genève, Hôtel-de-Ville\r
Genève, Aubert\r
Genève, Contrat-Social\r
Genève, La Fenêtre\r
Genève, Krieg\r
Genève, Ormeaux\r
Genève, Molard\r
Genève, Prairie\r
Genève, Poterie\r
Genève, poste\r
Genève, Place des Eaux-Vives\r
Genève, Mont-Blanc\r
Genève, Queue-d'Arve\r
Genève, Perle du Lac\r
Genève, Vollandes\r
Genève, Nations\r
Genève, Plage\r
Genève, Beau-Séjour\r
Genève, Eglise Russe\r
Genève, Franchises\r
Genève, Jardin Botanique\r
Genève, Gautier\r
Genève, Cirque\r
Genève, Musée Voltaire\r
Genève, Miléant\r
Genève, Palladium\r
Genève, Métropole\r
Genève, Joli-Mont\r
Genève, Moillebeau\r
Genève, Motta\r
Genève, Rieu\r
Genève, Reverdin\r
Genève, Navigation\r
Genève, Saint-Antoine\r
Genève, Collège Sismondi\r
Genève, Taconnerie\r
Genève, Varembé\r
Genève, Valais\r
Genève, Weber\r
Genève, Vieusseux\r
Genève, gare Cornavin\r
Genève, Jonction\r
Genève, Bel-Air\r
Genève, OMS-BIT\r
Genève, Bovy-Lysberg\r
Genève, Musée d'ethnographie\r
Genève, Musée art et histoire\r
Genève, Athénée\r
Genève, Gos\r
Genève, Bout-du-Monde\r
Genève, Bourg-de-Four\r
Genève, Calas\r
Genève, Grand-Pré\r
Genève, Mervelet\r
Genève, Clinique Générale\r
Genève, Merle-d'Aubigné\r
Genève, Place Claparède\r
Genève, Maternité-Pédiatrie\r
Genève, Mercier\r
Genève, Maison des Parlements\r
Genève, Môle\r
Genève, Muséum\r
Genève, Seujet\r
Genève, Tranchées\r
Genève, Village-Suisse\r
Genève, Vidollet\r
Genève, Wendt\r
Genève, Pointe de la Jonction\r
Genève, Aubépine\r
Genève, Bains des Pâquis\r
Genève,Conservatoire populaire\r
Genève, Vermont\r
Genève, Industrielle\r
Genève, Intercontinental\r
Genève\r
Genève, Chausse-Coq\r
Genève, Saint-Léger\r
Genève, Rue du Lac\r
Genève, Clinique La Colline\r
Genève, Théâtre\r
Genève, Palais Eynard\r
Genève, Les Ouches\r
Genève, Pédiatrie\r
Genève-Aéroport, Tour-Contrôle\r
Genève-Aéroport, ICC\r
Genève-Aéroport, Terminal\r
Genève-Aéroport, WTC\r
Genève-Aéroport, Grand-Hangar\r
Genève-Aéroport, gare routière\r
Genève-Aéroport\r
Genève-Aéroport, gare-Arena\r
Genève-Champel, gare/Peschier\r
Genève-Champel, gare/Hôpital\r
Genève-Champel, gare\r
Genève-Champel\r
Genève-De-Châteaubriand (lac)\r
Genève-Eaux-Vives, gare/Bloch\r
Genève-Eaux-Vives\r
Genève-Eaux-Vives, gare\r
Genève-Eaux-Vives, gare/Vadier\r
Genève-Eaux-Vives (lac)\r
Genève-Jardin-Anglais (lac)\r
Genève-Molard (lac)\r
Genève-Mt-Blanc (lac)\r
Genève-Pâquis (lac)\r
Genève-Port Noir (lac)\r
Genève-Quai Gustave Ador (lac)\r
Genève-Sécheron, gare\r
Genève-Sécheron\r
Genolier\r
Genolier clinique/campus\r
Genolier Sus-Châtel\r
Genthod, Malagny\r
Genthod, La Pralay\r
Genthod, village\r
Genthod, Chênes\r
Genthod, Rennex\r
Genthod, Pierre-Grise\r
Genthod, Centre ornithologique\r
Genthod, Les Hauts\r
Genthod-Bellevue, gare\r
Genthod-Bellevue\r
Gentilino, S. Abbondio\r
Gentilino, Rubiana\r
Gentilino, Posta\r
Gerlafingen, Eisenhammer\r
Gerlafingen, Sonnenfeld\r
Gerlafingen, Dorfzentrum\r
Gerlafingen, Bolacker\r
Gerlafingen\r
Gerlafingen, Fluryhof\r
Gerlikon, Dorf\r
Gerlikon, Bausel\r
Gerlikon, Huggenbergerhaus\r
Geroldswil, Zentrum\r
Geroldswil, Dorfstrasse\r
Geroldswil, Grindlen\r
Geroldswil, Welbrig\r
Geroldswil, Schweizäcker\r
Gerolfingen, Bahnhof\r
Gerolfingen\r
Gerra (Gambarogno), Stazione\r
Gerra (Gambarogno), Cimitero\r
Gerra (Gambarogno), Paese\r
Gerra (Gambarogno), Bagno\r
Gerra (Gambarogno)\r
Gerra (Gambarogno) (lago)\r
Gerra (Verzasca), Paese\r
Gerra (Verzasca), Al Ponte\r
Gerra (Verzasca), Predell\r
Gerra (Verzasca), Croce\r
Gerra P., Centro Professionale\r
Gerra Piano, Paese\r
Gerra(Verzasca),Prato Maggiore\r
Gersau, Schiffstation\r
Gersau, Felsenegg\r
Gersau, Förstli\r
Gersau, Brand\r
Gersau, Wehri\r
Gersau, Kindli-Strandbad\r
Gersau, Rotacher\r
Gersau, Altes Rathaus\r
Gersau, Huob\r
Gersau, Rotschuo\r
Gersau (See)\r
Gersau Förstli (Fähre)\r
Gersau Gschwend\r
Gerschnialp\r
Gerzensee, Studienzentrum\r
Gerzensee, Thalgut\r
Gerzensee, Dorf\r
Gerzensee, Waldegg\r
Geschinen\r
Geschinen, Baschi\r
Geschinen, Kirche\r
Gettnau\r
Geuensee, Ausserdorf\r
Geuensee, Sternen\r
Geuensee, Chäppelimatt\r
Gfeld, Bahnhof\r
Gfeld\r
Gfellen\r
Ghirone, Aquilesco\r
Giand' Alva\r
Gibswil, Bahnhof\r
Gibswil\r
Giebenach, Lindenplatz\r
Giebenach, Rainweg\r
Giessbach Hotel\r
Giessbach See\r
Giessbach See (Talstation)\r
Giétroz\r
Giez, place du Collège\r
Giez, La Pommelaz\r
Giez, La Croix\r
Giffers, Vorderried\r
Giffers, Dorf\r
Gigerwald, Staudamm\r
Gigerwald, Restaurant\r
Gillarens, bif. rte cantonale\r
Gillarens, village\r
Gilly, église\r
Gilly, village\r
Gilly, Condémines\r
Gilly-Bursinel, gare sud\r
Gimel, En Péry-Béliaux\r
Gimel, La Vernette\r
Gimel, Sapin Siméon\r
Gimel, place de L'Union\r
Gimel, Le Prunier\r
Gimel, Côte Réviol\r
Gimel, Le Signal\r
Gimel, bas du village\r
Gimmelwald (Schilthornbahn)\r
Gingins, ouest\r
Gingins, poste\r
Giornico, Fraggio\r
Giornico, Biaschina\r
Giornico, Parondino\r
Giornico, Scuola Media\r
Giornico, Paese\r
Gipf-Oberfrick, Brücke\r
Gipf-Oberfrick, Rösslibrücke\r
Gipf-Oberfrick, alte Post\r
Gisikon, Weitblick\r
Gisikon-Root, Bahnhof\r
Gisikon-Root\r
Giswil, Rütimatt\r
Giswil, Abzw. Brosmatt\r
Giswil, Bahnhof\r
Giswil, Bärecken\r
Giswil, Kirche\r
Giswil, Emmenrank\r
Giswil, Jwi\r
Giswil\r
Giswil, Buechenegg\r
Giswil Camping\r
Giswil Zollhaus\r
Gitschenen\r
Giubiasco, Sottomontagna\r
Giubiasco, Stazione\r
Giubiasco, Seghezzone\r
Giubiasco, Via Bellinzona\r
Giubiasco, Via Ferriere\r
Giubiasco, Piazza\r
Giubiasco, Bivio Pedevilla\r
Giubiasco, Tre Castelli\r
Giubiasco, Caffè Locarno\r
Giubiasco, Lôro\r
Giubiasco, Borghetto\r
Giubiasco, Scuola Media\r
Giubiasco, Golena\r
Giubiasco, alla Morobbia\r
Giubiasco, Cimitero\r
Giubiasco, Sasso Piatto\r
Giubiasco\r
Giumaglio\r
Givisiez, La Faye\r
Givisiez, route de l'Epinay\r
Givisiez, Mont Carmel\r
Givisiez, Taconnets\r
Givisiez, Jean-Prouvé\r
Givisiez, Corbusier\r
Givisiez, Colombière\r
Givisiez, Toutvent\r
Givisiez, La Gaîté\r
Givisiez, Bellevue\r
Givisiez, Escale\r
Givisiez, Place d'Affry\r
Givisiez, route des Loisirs\r
Givisiez, gare\r
Givisiez, rte Stephan\r
Givisiez, rte des Fluides\r
Givisiez, rte du Bleuet\r
Givisiez\r
Givrins\r
Giw\r
Glacier du Sex Rouge\r
Glacier-de-la-Plaine-Morte\r
Glacier-des-Diablerets\r
Gland, La Falaise\r
Gland, UICN\r
Gland, Domaine Impérial\r
Gland, Riant-Coteau\r
Gland, Perron/Fleurs\r
Gland, Lignière-Dullive\r
Gland\r
Gland, Grand-Champ\r
Gland, Mont-Blanc/Dôle\r
Gland, Perron/Riant-Coteau\r
Gland, Sous-les-Vignes\r
Gland, Communet\r
Gland, gare nord\r
Gland, poste\r
Gland, Mont Blanc sud\r
Gland, Borgeaud\r
Gland, Mauverney\r
Gland, gare sud\r
Gland, Montoly\r
Gland, Les Tuillières\r
Glanzenberg, Bahnhof\r
Glanzenberg\r
Glarus, Bahnhof\r
Glarus, Buchholz\r
Glarus, Rathaus\r
Glarus, Kantonsschule/Spital\r
Glarus, Pfrundhaus\r
Glarus, Friedhof\r
Glarus\r
Glarus, Lurigenstrasse\r
Glarus, Schützenhaus\r
Glarus, Stampf\r
Glashütten, Kirche\r
Glattalp\r
Glattbrugg, Mode Center TMC\r
Glattbrugg, Post\r
Glattbrugg, Oberhusen\r
Glattbrugg, Riethofstrasse\r
Glattbrugg, Halden\r
Glattbrugg, Frohbühlstrasse\r
Glattbrugg, Bahnhof\r
Glattbrugg, Zentrum\r
Glattbrugg, Lättenwiesen\r
Glattbrugg\r
Glattbrugg, Giebeleichstrasse\r
Glattbrugg, Unterriet\r
Glattbrugg, Glatthof\r
Glattfelden, Post\r
Glattfelden, Staltigstrasse\r
Glattfelden\r
Glattfelden, Aarüti\r
Glattfelden, Stationsweg\r
Glattfelden, Schulhaus Hof\r
Glattfelden, Eichhölzli\r
Glattfelden, Schwimmbad\r
Glattfelden, Bahnhof\r
Glattpark, Chavez-Allee\r
Glattpark, Lindbergh-Allee\r
Glattpark, Wright-Strasse\r
Glattpark, Lindberghplatz\r
Glattpark, Glattpark\r
Glaubenberg, Passhöhe\r
Glaubenbielen, Parkplatz\r
Gleit\r
Gletsch\r
Gletsch, Post\r
Gletterens, lac\r
Gletterens, village\r
Gletterens, Fin de Gros Bois\r
Glion, funi\r
Glion\r
Glion (funi)\r
Glion-Alpes\r
Glion-Collège\r
Glis, ZeughausKultur\r
Glis, Saltina\r
Glis, Spital\r
Glis, untere Haselgasse\r
Glis, obere Haselgasse\r
Glis, Wickert\r
Glis, Poststrasse\r
Glis, Heilpädagogische Schule\r
Glis, Holowistutz\r
Glis, Oberdorf\r
Glis, Klosmatten\r
Glis, Tolaweg\r
Glis, Napoleon\r
Glis, Holowistrasse\r
Glis, untere Briggasse\r
Glis, Gstipf\r
Glis, Altersheim\r
Glis, Polenstrasse\r
Glis, Manus\r
Glis, Giardino\r
Glis, Grundbiel\r
Glis, Glismatten\r
Glis, Pfarreiheim\r
Glis, Dorf\r
Glis, Holzji\r
Glis, Kapelle Englisch-Gruss\r
Glis, Kapuzinerkloster\r
Glis, Zenhäusern\r
Glis, Romantica\r
Glis, Holzackerweg\r
Glis, Jesuitenweg\r
Glis, Tennisplatz\r
Glogghüs\r
Glovelier, la Roche\r
Glovelier, ZAM/rte de Boécourt\r
Glovelier, Croisée\r
Glovelier, église\r
Glovelier\r
Glovelier, La Morée\r
Glovelier,Croix des Longs-Prés\r
Glovelier, gare\r
Glüna\r
Gluringen, Abzw. Bahnhof\r
Gluringen\r
Gnosca, Centro\r
Gnosca, rifugio animali\r
Gnosca, Cusnà\r
Gockhausen, Ursprungstrasse\r
Gockhausen, Dorf\r
Godey\r
Gohl, Schulhaus\r
Gohl, Matten\r
Gohl, Widhus\r
Gohl, Mettlen\r
Gohl, Gmünden\r
Gohl, Obeningohl\r
Gohl, Grindlenbach\r
Gohl, Houetershus\r
Gohl, Dorf\r
Gohl, Schulhaus Chammershus\r
Gohl, Aeugsteren\r
Golaten, Dorf\r
Goldach, Mühlegut\r
Goldach, Rotenstein\r
Goldach, Stelzenreben\r
Goldach, Sternen\r
Goldach, Tübacherstrasse\r
Goldach, Sonnenhalde\r
Goldach, Rietli\r
Goldach, Klosterstrasse\r
Goldach, TZM/Kellen\r
Goldach, Raiffeisenbank\r
Goldach, Kronenplatz\r
Goldach, Bahnhof\r
Goldach, Blumenegg\r
Goldach, Appenzeller Strasse\r
Goldach, Rosenackerstrasse\r
Goldach\r
Goldach, Thannäcker\r
Goldach, Untereggerstrasse\r
Goldach, Sonnental\r
Goldau, Waage\r
Goldau, Kehlmattli\r
Goldau, Bernerhöhe\r
Goldau, Buosingen Camping\r
Goldau, Sportplatz\r
Goldau, Neu-Röthen\r
Goldau, Tierpark\r
Goldau, Bischofshusen\r
Goldau, Löwenplatz\r
Goldau A4\r
Goldingen, Baumgarten\r
Goldingen, Unterdorf\r
Goldingen, Löffel\r
Goldingen, Riedern\r
Goldingen, Wolfertingen\r
Goldingen, Ennetbach\r
Goldingen, Egligen\r
Goldingen, Oberdorf\r
Goldingen, Vordersagen\r
Goldiwil, Jungfrau\r
Goldiwil, Scheidweg\r
Goldiwil, Kirche\r
Goldiwil, Stägacher\r
Goldiwil, Obermatt\r
Goldiwil, Melli\r
Goldiwil, Montana\r
Goldiwil, Dorf\r
Goldiwil, Wendeplatz\r
Goldiwil, Hintermatt\r
Goldiwil, Blümlisalp\r
Goldswil, Dorf\r
Goldswil, Parkhotel\r
Golino, Posta\r
Golino, Ponte\r
Gollion, En Crausaz\r
Gollion, L'Arzillier\r
Gollion, grande salle\r
Gollion, village\r
Golzern (Bergstation)\r
Gommiswald, Hansjunger\r
Gommiswald, Alpenblick\r
Gommiswald, Dorf\r
Gommiswald, Breiten\r
Gommiswald, Schönenbach\r
Gommiswald, Gauenhof\r
Gommiswald, Schulhaus\r
Gondiswil, Hünigen\r
Gondiswil, Haltestelle\r
Gondiswil, Gemeindehaus\r
Gondo, Ramserna\r
Gondo, Kirche\r
Gonten\r
Gontenbad\r
Gontenschwil, Gemeindehaus\r
Gontenschwil, Bahnhof\r
Gontenschwil, Oberdorf\r
Gontenschwil\r
Gonzen Palfris, Scheidweg\r
Goppenstein, Bahnhof\r
Goppenstein\r
Goppenstein Autoverlad\r
Gordemo\r
Gordevio\r
Gordola, Bivio Verzasca\r
Gordola, Gnesa\r
Gordola, Municipio\r
Gordola, Gaggiole\r
Gordola\r
Gordola, Motto\r
Gordola, Nord\r
Gordola, Via Crespo\r
Gordola, Centro Professionale\r
Gordola, Roviscaglie\r
Gordola, Carcale\r
Gordola, Gaggiole Sopra\r
Gorduno, Alla Rivetta\r
Gorduno, Burgaio\r
Gorduno, San Carpoforo\r
Gorgier, Crêt-de-la-Fin\r
Gorgier-Chez-le-Bart\r
Gorgier-St-Aubin, collège\r
Gorgier-St-Aubin\r
Gorgier-St-Aubin, gare\r
Gornergrat\r
Gornergrat Gifthittli\r
Göschenen, Abfrutt\r
Göschenen, Abzw. Salbit\r
Göschenen, Bahnhof\r
Göschenen, Dorf\r
Göschenen, Jäntelboden\r
Göschenen, Ausserdorf\r
Göschenen, Abzw. Voralp\r
Göschenen, Grit\r
Göschenen\r
Göscheneralp, Dammagletscher\r
Gossau SG, Mooswies\r
Gossau SG, Herisauerstrasse\r
Gossau SG, Talstrasse\r
Gossau SG, Vogelsangweg\r
Gossau SG, Friedhof\r
Gossau SG, Coop BZ\r
Gossau SG, Schlachthofstrasse\r
Gossau SG, Geissberg\r
Gossau SG, Ulmenstrasse\r
Gossau SG, Oberdorf\r
Gossau SG, Watt\r
Gossau SG, Fennhof\r
Gossau SG, Niederdorf\r
Gossau SG, Isenringstrasse\r
Gossau SG, Migros BZ\r
Gossau SG, Kirchstrasse\r
Gossau SG, Degenau\r
Gossau SG\r
Gossau SG, Mettendorf\r
Gossau SG, Gerenstrasse\r
Gossau SG, Falkenstrasse\r
Gossau SG, Migros-Markt\r
Gossau SG, Bischofszellerstr.\r
Gossau SG, Schoretshuebstr.\r
Gossau SG, Zeughausstrasse\r
Gossau SG, Bruggwis\r
Gossau SG, Kühlhausstrasse\r
Gossau SG, Eichen\r
Gossau SG, Multstrasse\r
Gossau SG, Hofegg\r
Gossau SG, Fischergüetli\r
Gossau SG, Bedastrasse\r
Gossau SG, Lerchenstrasse\r
Gossau SG, Lindenhof\r
Gossau SG, Langfeld\r
Gossau SG, Walter Zoo\r
Gossau SG, Poststrasse\r
Gossau SG, Bahnhof\r
Gossau SG, Gerbhof\r
Gossau ZH, Mitteldorf\r
Gossau ZH, Ernst-Brugger-Platz\r
Gossau ZH, Unterhofen\r
Gossau ZH, Tannenberg\r
Gossau ZH, Moos\r
Gossau ZH, Rigistrasse\r
Gossau ZH, Oberstufe/Altrüti\r
Gossau ZH, Zentrum\r
Gossens, village\r
Gossens, La Cernia\r
Gossliwil, Dorf\r
Gotschnaboden\r
Gotschnagrat (Gruobenalp)\r
Gotschnagrat (Klosters)\r
Gotschnagrat (Schwarzseealp)\r
Gotthard Passhöhe\r
Gottlieben (Schifflände)\r
Goumoens-la-Ville, Eclagnens\r
Goumoens-la-Ville, Tuilerie\r
Goumoens-la-Ville, centre\r
Goumois, Belfond\r
Goumois, Tournant Theusseret\r
Goumois, douane\r
Grabs, Industrie\r
Grabs, Forst\r
Grabs, Kohlplatz\r
Grabs, Amasis\r
Grabs, Spital\r
Grabs, Säntisstrasse\r
Grabs, Unterdorf\r
Grabs, Hochhaus\r
Grabs, Lims\r
Grabs, Feld\r
Grabs, Abzw. Leversberg\r
Grabs, Post\r
Grabs, Feldgatter\r
Grabs, Pflegeheim\r
Grabs, Geriäls\r
Grabs, Mühlbachstrasse\r
Grabs, Quader\r
Grabserberg, Boden\r
Grabserberg, Winnewies\r
Grabserberg, Rogghalm\r
Grabserberg, Eggenberg\r
Grabserberg, Lehn\r
Grabserberg, Höhi\r
Grabserberg, Schluss\r
Grabserberg, Madang\r
Grächen, Stadlen\r
Grächen, Binen\r
Grächen, Matten\r
Grächen, Zentrum\r
Grächen, Nessien\r
Grächen, Schmidji\r
Grächen, Fuhrmatten\r
Grächen (Talstation Hannigalp)\r
Grächen Bärgji (Talstation)\r
Grächen Stafel\r
Grafenort\r
Grafenort, Bahnhof\r
Grafenried, Rest. Kreuz\r
Grafenried\r
Grafstal, Thalegg\r
Grafstal, Oberdorf\r
Grafstal, Engelacher\r
Grafstal, Unterdorf\r
Grancia, Molini di Grancia\r
Grancia, Centro Lugano Sud\r
Grancia, Paese\r
Grancia, Centro Commerciale 2\r
Grancy, Les Pâles\r
Grancy, collège\r
Grand-Blettay\r
Grand-Conche\r
Grand-Lancy, Palettes\r
Grand-Lancy, Stade de Genève\r
Grand-Lancy, Burgy\r
Grand-Lancy, Place du 1er-Août\r
Grand-Lancy, Mairie de Lancy\r
Grand-Lancy, Curé-Baud\r
Grand-Lancy, Pontets\r
Grand-Lancy, Lancy Piscine\r
Grand-Lancy, De-Staël\r
Grand-Lancy, La Chapelle\r
Grand-Lancy, Préventorium\r
Grand-Moulin\r
Grand-Saconnex, John Knox\r
Grand-Saconnex, Palexpo\r
Grand-Saconnex, CS Blanché\r
Grand-Saconnex, Fret\r
Grand-Saconnex, Gardiol\r
Grand-Saconnex, Le Pommier\r
Grand-Saconnex, P+R\r
Grand-Saconnex, Crêts-Morillon\r
Grand-Saconnex,Palexpo-Halle 7\r
Grand-Saconnex, temple\r
Grand-Saconnex, Corbillettes\r
Grand-Saconnex, Massettes\r
Grand-Saconnex, place\r
Grand-Saconnex, Burgondes\r
Grand-Saconnex, Le Nant\r
Grand-Saconnex, mairie\r
Grand-Saconnex, Machéry\r
Grand-Saconnex, Susette\r
Grand-Saconnex, Attenville\r
Grand-Saconnex, Taverney\r
Grand-Saconnex, Aéroport-P47\r
Grand-Saconnex, Morillons\r
Grand-Saconnex, Giacometti\r
Grand-Saconnex, Tunnel Routier\r
Grand-Saconnex, Sonnex\r
Grand-Zour\r
Grandcour, poste\r
Grandcour, rte d'Estavayer\r
Grandcour, rte de Chevroux\r
Grandevent, Battoir\r
Grandevent, village\r
Grandfontaine, haut du village\r
Grandfontaine, bas du village\r
Grandfontaine, poste\r
Grandfontaine, bif. Roche d'Or\r
Grandgourt, Pisciculture\r
Grandsivaz, village\r
Grandsivaz, Marais Martin\r
Grandson, Borné Nau\r
Grandson, Le Repuis\r
Grandson, Péroset\r
Grandson, Corcelettes\r
Grandson, croisée de Fiez\r
Grandson, Le Revelin\r
Grandson, place du Château\r
Grandson, gare\r
Grandson, Crêt-aux-Moines\r
Grandson\r
Grandson (bateau)\r
Grandval\r
Grandval, Chapeau Noir\r
Grandvaux, Pra Grana\r
Grandvaux, Le Signal\r
Grandvaux, gare sud\r
Grandvaux, Crêt-Mouton\r
Grandvaux, gare\r
Grandvaux, Chenaux\r
Grandvaux, Genevrey\r
Grandvaux\r
Grandvaux, Le Tronchet\r
Grandvaux, Chincuz\r
Grandvaux, Le Bougnon\r
Grandvillard, Lormo\r
Grandvillard, village\r
Granges (Veveyse), Le Rupan\r
Granges (Veveyse), La Cuvigne\r
Granges (Veveyse), village\r
Granges (Veveyse), Le Battiau\r
Granges (Veveyse), Sokymat\r
Granges VS, Grand Canal\r
Granges VS, Pissiour\r
Granges VS, Av. de la Gare\r
Granges VS, Crêtelongue\r
Granges VS, La Millière\r
Granges VS, sud\r
Granges VS, Centre PCI\r
Granges-de-Vesin, village\r
Granges-Marnand\r
Granges-Paccot, Forum/casino\r
Granges-Paccot, Chavully\r
Granges-Paccot, Chamblioux\r
Granges-Paccot, Chenevière\r
Granges-Paccot, Chantemerle\r
Granges-Paccot, Rte du Coteau\r
Granges-Paccot,ch. la Rappetta\r
Granges-Paccot, Agy\r
Granges-Paccot, P. de-Fribourg\r
Granges-Paccot,Ch. des Rosiers\r
Granges-près-Marnand,Le Canard\r
Granges-près-Marnand, poste\r
Granges-près-Marnand, gare\r
Granges-sous-Trey, village\r
Grangettes, village\r
Grangettes, La Neirigue\r
Gränichen, Töndler\r
Gränichen, Oberdorfstrasse\r
Gränichen\r
Gränichen, Bahnhof\r
Gränichen Oberdorf\r
Gränichen Töndler\r
Gräslikon\r
Grasswil, Post\r
Grasswil, Sonne\r
Grasswil, Oberdorf\r
Grasswil, Regenhalden\r
Grattavache, village\r
Grauberg\r
Gravesano, Grumo\r
Gravesano, Istituto Rusca\r
Gravesano, Bivio per Bedano\r
Gravesano, Paese\r
Gravesano, Istituto Rusca Nord\r
Gravesano, Vallone\r
Greich\r
Greifensee, Pfisterhölzli\r
Greifensee, Städtli\r
Greifensee, Tumigerstrasse\r
Greifensee, Im Hof\r
Greifensee, Im Langacher\r
Greifensee (See)\r
Greitspitz\r
Grellingen, Seefeld\r
Grellingen, Martisackerweg\r
Grellingen, Neutal\r
Grellingen, Bahnhof\r
Grellingen\r
Grenchen, Schlachthaus\r
Grenchen, Güterstrasse\r
Grenchen, Flughafenstrasse\r
Grenchen, Monbijou\r
Grenchen, Schmelzi\r
Grenchen, Bürgerhaus\r
Grenchen, Bergstrasse\r
Grenchen, Alpenblick\r
Grenchen, N. Wengi-Strasse\r
Grenchen, Riederen\r
Grenchen, Waldegg\r
Grenchen, Kastels Grenchen\r
Grenchen, Schwimmbad\r
Grenchen, Witmatt\r
Grenchen, Oele\r
Grenchen, Kirchstrasse\r
Grenchen, Cadotschstein\r
Grenchen, Unterer Grenchenberg\r
Grenchen, Mc Donald's\r
Grenchen, Flurstrasse Süd\r
Grenchen, Holzerhütte\r
Grenchen, Postplatz\r
Grenchen, Brücke\r
Grenchen, Wäsmeli\r
Grenchen, Sunnepark Süd\r
Grenchen, Flughafen\r
Grenchen, Bucheggstrasse\r
Grenchen, Lingeriz\r
Grenchen, Alpenstrasse\r
Grenchen, Rebgasse\r
Grenchen, Eichholz\r
Grenchen, Weinbergstrasse\r
Grenchen, Schönegg\r
Grenchen, Altersiedlung\r
Grenchen, Industrie Zentrum\r
Grenchen, Brüel\r
Grenchen, Postplatz Süd\r
Grenchen, Gummenweg\r
Grenchen, Rebhalde\r
Grenchen, Mattenstrasse\r
Grenchen, M. Schürer-Strasse\r
Grenchen, Veilchenstrasse\r
Grenchen, Friedhof\r
Grenchen, Am Weinberg\r
Grenchen, Sunnepark Nord\r
Grenchen, Jurastrasse\r
Grenchen, Obere Flurstrasse\r
Grenchen, Fichtenweg\r
Grenchen, Reibenstrasse\r
Grenchen, Simplon\r
Grenchen, Schmelzirain\r
Grenchen, Römerbrunnen\r
Grenchen, Standweg\r
Grenchen, Centralstrasse\r
Grenchen, Fuchsboden\r
Grenchen, Bettlachrank\r
Grenchen, Karl Mathy\r
Grenchen, Girardstrasse\r
Grenchen, Dammstrasse\r
Grenchen, Halden\r
Grenchen, Bellevue\r
Grenchen, Flurstrasse Nord\r
Grenchen, Leuzigenstrasse\r
Grenchen, Lebernstrasse\r
Grenchen, Storchengasse\r
Grenchen (Schiff)\r
Grenchen Nord\r
Grenchen Nord, Bahnhof\r
Grenchen Süd\r
Grenchen Süd, Bahnhof\r
Greng, Schlossallee\r
Grengiols, Abzw. Bahnhof\r
Grengiols, Oberdeisch\r
Grengiols\r
Grengiols, Dorfzufahrt Nord\r
Grenilles, village\r
Grens, village\r
Greppen, Oberhaus\r
Greppen\r
Greppon Blanc\r
Grésaley\r
Gresso\r
Gressy, Le Bas-des-Monts\r
Gressy, place du village\r
Gressy, Moulin\r
Gretschins, Dorf\r
Gretschins, Magletsch\r
Gretzenbach, Grabacker\r
Gretzenbach, Bielacker\r
Gretzenbach, Weid\r
Gretzenbach, Pfarrmatt\r
Gretzenbach, Staldenacker\r
Griesalp, Kurhaus\r
Griesenberg, Vogelsang\r
Griesenberg, Hub\r
Grillesses\r
Grimentz, télécabine\r
Grimentz, Carovilla\r
Grimentz, Le Boccard\r
Grimentz, Roua\r
Grimentz, Les Fioz\r
Grimentz, Morette\r
Grimentz, place du Mélèze\r
Grimentz, les Aires\r
Grimentz, Torrent\r
Grimentz, les Garnérés\r
Grimentz (télé)\r
Grimentz Grand Plan\r
Grimentz Tsarva\r
Grimentz Vijevy\r
Grimisuat, anc. poste\r
Grimisuat, Les Fermes\r
Grimisuat, Rte de Savièse\r
Grimisuat, Les Places\r
Grimisuat, Zegeard-Valan\r
Grimisuat, Home les Crêtes\r
Grimisuat, Zoudâne\r
Grimmialp\r
Grimsel, Summerloch\r
Grimsel, Hospiz\r
Grimsel, Rest. Grimselblick\r
Grimsel Passhöhe\r
Grindel, Oberdorf\r
Grindel, Mitte\r
Grindel, Unterdorf\r
Grindelwald, Terminal\r
Grindelwald, Waldspitz\r
Grindelwald, Pfingsteggbahn\r
Grindelwald, Steinbillen\r
Grindelwald, Bodmi\r
Grindelwald, Alfa\r
Grindelwald, Unterer Lauchbühl\r
Grindelwald, Kirche\r
Grindelwald, Lauberhorn\r
Grindelwald, Blümlisalp\r
Grindelwald, Oberäll\r
Grindelwald, Lochsteinen\r
Grindelwald, Rothenegg\r
Grindelwald, Mühlebach\r
Grindelwald, Oberer Gletscher\r
Grindelwald, Panorama\r
Grindelwald, Mettenberg\r
Grindelwald, Säge Grund\r
Grindelwald, Grindelwalderhof\r
Grindelwald, Hellbach\r
Grindelwald, Wasserbühlen\r
Grindelwald\r
Grindelwald, Stählisboden\r
Grindelwald, Sportzentrum\r
Grindelwald, Alpenrose\r
Grindelwald, Ischzaun\r
Grindelwald, Schluecht\r
Grindelwald, Halten\r
Grindelwald, Zollohaus\r
Grindelwald, Oberer Lauchbühl\r
Grindelwald, Gaggi Säge\r
Grindelwald, Tuftbach\r
Grindelwald, Engelshaus\r
Grindelwald, Sand\r
Grindelwald, Unter Eiger\r
Grindelwald, Vor dem Holz\r
Grindelwald, Bahnhof\r
Grindelwald, Steinacher\r
Grindelwald, Weidli\r
Grindelwald, Spillmättli\r
Grindelwald, Salzmannsegg\r
Grindelwald, Golf\r
Grindelwald, Naturfreundehaus\r
Grindelwald, Firstbahn\r
Grindelwald, Kreuzweg\r
Grindelwald, Gletscherschlucht\r
Grindelwald, Aspi\r
Grindelwald, Gemeindehaus\r
Grindelwald, Stein\r
Grindelwald, Rasthysi\r
Grindelwald, Glacier\r
Grindelwald, Alpenvogelpark\r
Grindelwald, Klusi\r
Grindelwald, Rotes Tor\r
Grindelwald, Itramen Egg\r
Grindelwald, U. Eiger Bärgman\r
Grindelwald, Jägerstübli\r
Grindelwald, Spillstatt\r
Grindelwald, Kirchbühl\r
Grindelwald, Schwandboden\r
Grindelwald, Nodhalten\r
Grindelwald, Abzw. Aellfluh\r
Grindelwald, Alpenblick\r
Grindelwald, Schwendi\r
Grindelwald, Truffersbrunnen\r
Grindelwald, Mettenbergbrücke\r
Grindelwald, Alpiglen\r
Grindelwald, Abzw. Gleckstein\r
Grindelwald, Holzmattenläger\r
Grindelwald, Aspen\r
Grindelwald, Landi\r
Grindelwald, Stutz\r
Grindelwald, Nirggen\r
Grindelwald, Endweg\r
Grindelwald, Spritzenhisi\r
Grindelwald, Uf Tuft\r
Grindelwald, Sibet Schirli\r
Grindelwald (Firstbahn)\r
Grindelwald (Pfingsteggbahn)\r
Grindelwald Grund\r
Grindelwald Grund, Bahnhof\r
Grindelwald Hinder der Egg\r
Grindelwald Läger (Sesselbahn)\r
Grindelwald Terminal\r
Grivalea\r
Grolley\r
Grolley, Rosière\r
Grolley, gare\r
Grône, écoles\r
Grône, Loos\r
Grône, Croix du Pont\r
Grône, poste\r
Grône, pramagnon\r
Grône, Daillet\r
Grône, La Coutoulaz\r
Grono, Clinica San Rocco\r
Grono, Paese\r
Grono, Bivio Calanca\r
Grono, Nord\r
Gross, Nügüetli\r
Gross, Rombüel\r
Gross, Ebenau\r
Gross, Grossbach\r
Gross Guschelmuth\r
Grossaffoltern, Schmidebach\r
Grossaffoltern, Reuenberg\r
Grossaffoltern, Post\r
Grossdietwil, Post\r
Grossdietwil, Sandgruebe\r
Grossdietwil, Schönegg\r
Grosse Scheidegg\r
Grosshöchstetten, Neuhaus\r
Grosshöchstetten, Talacker\r
Grosshöchstetten, Bahnhof\r
Grosshöchstetten\r
Grossteil, Unterni\r
Grossteil, Rüti\r
Grossteil, Schulhaus\r
Grossteil, Haltenrain\r
Grossteil, Zopf\r
Grosswangen, Schutz\r
Grosswangen, Hauelen\r
Grosswangen, Rot\r
Grosswangen, Post\r
Grosswangen, Ed.-Huberstrasse\r
Grotto Elvezia (lago)\r
Grotto Pescatori (lago)\r
Grotzenbüel (Hüttenberg)\r
Grotzenbüel (Seblengrat)\r
Grub AR, Halten\r
Grub AR, Riemen\r
Grub AR, Krähtobel\r
Grub AR, Ebne Grub\r
Grub AR, Dorf\r
Grub SG, Gruberhof\r
Gruben\r
Gruben VS\r
Grubenwald\r
Grubenwald, Cholplatz\r
Grubisbalm\r
Grüenfeld\r
Grugnay\r
Grugnay, bif.\r
Grumo (Blenio)\r
Grund b. Gstaad, Post\r
Grund b. Gstaad,Moosfangbrücke\r
Grund b. Gstaad, Klösterli\r
Grund b. Gstaad, Grundbrücke\r
Grund b. Gstaad, Moosfang\r
Grund b. Gstaad, Lädeli\r
Grünenboden\r
Grünenmatt, Dorfmitte\r
Grünenmatt\r
Grünenmatt, Bahnhof\r
Grünenmatt, Ramisberg\r
Grüningen, Stedtli\r
Grüningen, Heispel\r
Grüningen, Adler\r
Grüningen, Freihof\r
Grüningen, Station\r
Grüningen, Im Haufland\r
Gruobenalp\r
Gruobenalp (Talst. Parsennf.)\r
Gruppaldo, cappella\r
Gruppaldo, Bivio\r
Grüsch, Talstation Danusa\r
Grüsch, Salätschis\r
Grüsch, Oberdorf\r
Grüsch, Usserfeld\r
Grüsch, Arälja\r
Grüsch, Bahnhof\r
Grüsch, Ingerloch\r
Grüsch, Güllen\r
Grüsch\r
Grüsch, Danusa\r
Grüsch, Häri\r
Grüsch (Luftseilbahn Danusa)\r
Grüt (Gossau ZH), Bönler\r
Grüt (Gossau ZH), Lindenhof\r
Grüt (Gossau ZH), Grünau\r
Grüt (Gossau ZH), Hundsruggen\r
Grüt (Gossau ZH), Dorf\r
Grütschalp\r
Gruyères, gare\r
Gruyères\r
Gruyères, ville\r
Gryon, Les Saves\r
Gryon, Rabou\r
Gryon, Maison du Terroir\r
Gryon, Cergnement\r
Gryon, Le Closel\r
Gryon, gare\r
Gryon, Centre Gryonnais\r
Gryon, Le Chardon Bleu\r
Gryon, Les Combes\r
Gryon, La Cergnat\r
Gryon, chemin du Proulard\r
Gryon, La Benjamine\r
Gryon, télécabine\r
Gryon, rte de Bovonne\r
Gryon, bifurcation Cergnement\r
Gryon, Les Roseyres\r
Gryon, Solalex\r
Gryon, Sereunex\r
Gryon\r
Gryon, Combe à Jordan\r
Gryon, Les Châbles\r
Gryon Barboleuse, gare\r
Gryon Barboleuse\r
Gryon Bois-Gentil\r
Gryon-Chalméry\r
Gschwandtenmaad\r
Gspon (Bergstation)\r
Gstaad, Bahnhof\r
Gstaad, Bissen Schulhaus\r
Gstaad, Bissen Litzi\r
Gstaad, Bissenbrücke\r
Gstaad, Eggli Talstation\r
Gstaad, Marktplatz\r
Gstaad, Bissenegg\r
Gstaad, Staldenmatte\r
Gstaad, Gstaaderhof\r
Gstaad, Skischulplatz\r
Gstaad, Unter-Gstaad\r
Gstaad, Sportzentrum\r
Gstaad, Rütti Schulhaus\r
Gstaad, Eggli\r
Gstaad, Grubenstrasse\r
Gstaad, Trom\r
Gstaad, Tromsäge\r
Gstaad\r
Gstaad, Badweidli\r
Gstaad, Hotel Bellerive\r
Gstaad, Ober-Gstaad\r
Gstaad, Krambrücke\r
Gstaad, Wasserngratbahn\r
Gstaad, Wispile\r
Gstaad (Talstation Eggli)\r
Gstaad (Talstation Wispile)\r
Gstaad Bissen\r
Gsteig b. Gstaad, Gründ\r
Gsteig b. Gstaad, Höhe\r
Gsteig b. Gstaad, Schönenboden\r
Gsteig b. Gstaad, Post\r
Gsteig b. Gstaad, Saali\r
Gsteig b. Gstaad, Heitibrücke\r
Gsteigwiler, Dorf\r
Guarda, Pitschen\r
Guarda, cumün\r
Guarda\r
Guarda, staziun\r
Gudo, Serta\r
Gudo, Malcantone\r
Gudo, Chiesa\r
Gudo, Progero\r
Gudo, Pian Marnino\r
Guévaux, croisée\r
Guggisberg, Kalchstätten\r
Guggisberg, Post\r
Guggisberg, Gehlismatt\r
Guggisberg, Sand\r
Guggisberg, Hirschmatt Dorf\r
Guggisberg, Hirschmatt Allmend\r
Guggisberg, Eigen\r
Guggisberg, Riedacker\r
Guggisberg, Kirchhalten\r
Guggisberg, Multernboden\r
Guggisberg, Kapf\r
Guggisberg, Hirschmatt Fall\r
Gumefens, lac\r
Gumefens, Le Gérigno\r
Gumefens, village\r
Gümligen, Melchenbühl (Tram)\r
Gümligen, Siloah\r
Gümligen, Tannacker\r
Gümligen, Sonnenfeld\r
Gümligen, Rütibühl\r
Gümligen, Amselweg\r
Gümligen, Bahnhof (Bus)\r
Gümligen, Bahnhof (Tram)\r
Gümligen\r
Gümligen, Meisenweg\r
Gümligen, Seidenberg\r
Gümligen, Hofgut\r
Gümligen, Melchenbühl (Bus)\r
Gümligen, Moosstrasse\r
Gümmenen, Bahnhof\r
Gümmenen, Kleingümmenen\r
Gümmenen, Mauss\r
Gümmenen, Trüllern\r
Gümmenen\r
Gümmenen, Dorf\r
Gümmenen, Stutz\r
Gummi\r
Gundetswil\r
Gundetswil, Hofacker\r
Günsberg, Glutzenberg\r
Günsberg, Grüngli\r
Günsberg, Dorfplatz\r
Günsberg, Bangerten\r
Günsberg, Längmatt\r
Günsberg, Neue Balmbergstrasse\r
Guntalingen\r
Gunten, Örtliboden\r
Gunten, Wislikehr\r
Gunten, Du Lac\r
Gunten, Stampbach\r
Gunten, Dorf\r
Gunten, Bellevue\r
Gunten (See)\r
Guntershausen\r
Guntmadingen, Oberneuhaus\r
Guntmadingen, Dorf\r
Gunzgen, Unterdorf\r
Gunzgen, Zentrum\r
Gunzgen, Industrie\r
Gunzwil, Bäch\r
Gunzwil, Chommle\r
Gunzwil, Hasenhusen\r
Gunzwil, Kagiswil\r
Gunzwil, Dorf\r
Gunzwil, Linden\r
Gunzwil, Holdern\r
Gurbrü, Schulhaus\r
Gurmels, Dorf\r
Gurmels, Kirche\r
Gurmels, Sonneck\r
Gurmels, Dürrenberg\r
Gurnigel, Stierenhütte\r
Gurnigel, Gantrischhütte\r
Gurnigel, Bad\r
Gurnigel, Berghaus\r
Gurnigel, Oberer Gurnigel\r
Gurnigel, Wasserscheide\r
Gurschen\r
Gurschenalp\r
Gurschengrat\r
Gurten Kulm\r
Gurtnellen, Meitschligen\r
Gurtnellen, Graggental\r
Gurtnellen, Surüti\r
Gurtnellen, Fellital\r
Gurtnellen Wiler, Gotthardstr.\r
Gurzelen, Obergurzelen\r
Gurzelen, Schulhaus\r
Gurzelen, Stuffäri\r
Gurzelen, Kreuz\r
Gutenburg\r
Gutenswil, Unterdorf\r
Gutenswil, Sternen\r
Gutenswil, Grossenacher\r
Gütighausen\r
Gütsch (Bergst. Andermatt)\r
Guttannen, Aegerstein\r
Guttannen, Breitwald\r
Guttannen, Dorf\r
Guttannen, Boden\r
Guttannen, Bänzlaui\r
Guttet, Abzw. Umfahrung\r
Guttet, Amarona\r
Guttet, Grächmatten\r
Guttet, Dorf\r
Guttet-Feschel, Wiler\r
Güttingen, Schulhaus\r
Güttingen\r
Güttingen, Zentrum\r
Güttingen, Bahnhof\r
Güttingen (See)\r
Gwatt, Moos\r
Gwatt, Bonstettenpark\r
Gwatt, Gwattstutz\r
Gwatt, Camping\r
Gwatt, Deltapark\r
Gwatt Deltapark (See)\r
Gwüest\r
Gy, poste\r
Gy, temple\r
Gy, La Chêna\r
Gy, Turaines\r
Gy, Baraque-à-Cloud\r
Haag (Rheintal), Thalisstrasse\r
Haag (Rheintal), Rheinstrasse\r
Haag (Rheintal), Dorf\r
Haag (Rheintal), Haag-Center\r
Haag (Rheintal), Rütistrasse\r
Haag (Rheintal), Industriestr.\r
Hääggen\r
Habergschwänd\r
Habkern, Lombachbrücke\r
Habkern, Zäundli\r
Habkern, Gruebi\r
Habkern,Lombachalp-Roteschwand\r
Habkern, Post\r
Habkern, Steinacker\r
Habkern, Städeli\r
Habsburg, Dorfplatz\r
Habschwanden, Ennetegg/Bachg.\r
Habschwanden, Schulhaus\r
Habschwanden, Diepleschwand\r
Habstetten, Rössli\r
Habstetten, Linde\r
Häfelfingen, Weidweg\r
Häfelfingen, Bad Ramsach\r
Häfelfingen, Egg\r
Häfelfingen, Dorf\r
Häfelfingen, Rebenrank\r
Hagenbuch ZH, Egghof\r
Hagenbuch ZH, Dorf\r
Hagenbuch ZH, Hagenstal\r
Hägendorf, Gässli\r
Hägendorf, Nellen\r
Hägendorf, Höferbächli\r
Hägendorf, Bahnhof\r
Hägendorf, Bodenmatt\r
Hägendorf, Solothurnerstrasse\r
Hägendorf, Schulhaus\r
Hägendorf, Gnöd\r
Hägendorf\r
Hägendorf, Weinhalden\r
Hägendorf, Halbrüti\r
Hägendorf, Teufelsschlucht\r
Hägendorf, Spitzacker\r
Hagendorn, Hofmatt\r
Hagendorn, Lorzenmatt\r
Hagendorn, Rumentikon\r
Hagendorn, Blumenweg\r
Hagendorn, Ziegelei-Museum\r
Hagendorn, Grobenmoos\r
Hagenwil bei Amriswil, Käserei\r
Häggenschwil, Scheidweg\r
Häggenschwil, Agen\r
Häggenschwil, Täschlihus\r
Häggenschwil, Dorfplatz\r
Häggenschwil-Winden, Bahnhof\r
Häggenschwil-Winden\r
Hägglingen, Huematten\r
Hägglingen, Schulhaus\r
Hägglingen, Dottikerstrasse\r
Hägglingen, Dorfmatten\r
Hägglingen, Altersheim\r
Hägglingen, Mitteldorf\r
Hagneck, Bahnhof\r
Hagneck\r
Hahnenmoos\r
Hahnenmoos (Bühlberg Bergst.)\r
Halbinsel Au\r
Haldenstein, Dorf\r
Haldenstein, Schulhaus\r
Haldenstein, Hanfländer\r
Haldenstein, Usserdorfstrasse\r
Haldenstein\r
Haldenstein, Rheinbrücke\r
Haldi\r
Haldigrat\r
Hallau, Atlingen\r
Hallau, Brugg\r
Hallau, Gemeindehaus\r
Hallwil\r
Halten, Ausserdorf\r
Halten, Käserei\r
Haltikon, Kapelle\r
Haltikon, Säge\r
Hämikon, Stockmatt\r
Hämikon, Oberdorf\r
Hämikon, Berg\r
Hämikon, Schulhaus\r
Hammetschwand Bergstation\r
Hammetschwand Talstation\r
Handegg, Gelmerbahn\r
Handegg\r
Handegg, Kunzentännlein\r
Hannig\r
Hannigalp (Bergst. Bärgji)\r
Hannigalp (Bergst. Grächen)\r
Happerswil, Dorf\r
Hard-Mumenthal\r
Harder Kulm\r
Härkingen, Briefzentrum\r
Härkingen, Lischmatte\r
Härkingen, Pflug\r
Härkingen, Altgraben\r
Härkingen, Lamm\r
Härkingen, Pfannenstiel\r
Hartmanix\r
Hasle b.B., Eisbahnweg\r
Hasle b.B., Mühle\r
Hasle b.B., Dorf\r
Hasle LU, Post\r
Hasle LU, Schwesterehüsli\r
Hasle LU, Heiligkreuz Witebach\r
Hasle LU, Gruebehag\r
Hasle LU, Farbschachen\r
Hasle LU, Hohwald\r
Hasle LU, Hofstatt\r
Hasle LU, Dorf\r
Hasle LU, Bahnhof\r
Hasle LU, Haldenegg\r
Hasle LU, Ussercher\r
Hasle LU, Heiligkreuz Kirche\r
Hasle LU, Schulhaus\r
Hasle LU\r
Hasle LU, Sandboden\r
Hasle LU, Heiligkreuzstrasse\r
Hasle LU, Büelweid\r
Hasle-Rüegsau\r
Hasle-Rüegsau, Bahnhof\r
Haslen AI, Tanne\r
Haslen AI, Linde\r
Haslen AI, Schiessegg\r
Haslen AI, Hüsli\r
Haslen AI, Kastbühl\r
Haslen AI, List\r
Haslen AI, Dorf\r
Haslen GL, Zünli\r
Haslen GL, Tannenberg\r
Haslen GL, Hinterhaslen\r
Haslen GL, Chappeli\r
Hasliberg Goldern, Gletscherb.\r
Hasliberg Goldern, Sandhubel\r
Hasliberg Goldern, Post\r
Hasliberg Goldern, Urseni\r
Hasliberg Hohfluh, Dorf\r
Hasliberg Hohfluh, Bodemli\r
Hasliberg Hohfluh, Weisstannen\r
Hasliberg Hohfluh, Bären\r
Hasliberg Hohfluh, Post\r
Hasliberg Hohfluh, Wetterhorn\r
Hasliberg Hohfluh,Privatklinik\r
Hasliberg Reuti, Gondelbahn\r
Hasliberg Reuti, Dorf\r
Hasliberg Reuti (Gondelbahn)\r
Hasliberg Twing (Gondelbahn)\r
Hasliberg Wasserwendi, Twing\r
Hasliberg Wasserwendi, Dorf\r
Hasliberg Wasserwendi, Bidmi\r
Hattenhausen, Dorf\r
Hattenhausen, Golfpanorama\r
Hätzingen, Feuerwehr\r
Hätzingen, Rössliplatz\r
Hauenstein, Löwen\r
Hauptikon, Dorf\r
Hauptwil, Dorfplatz\r
Hauptwil\r
Hausen a.A., Türlersee\r
Hausen a.A., Tüfenbach\r
Hausen a.A., Weisbrod-Areal\r
Hausen a.A., Riedmatt\r
Hausen a.A., Heisch\r
Hausen a.A., Vollenweid\r
Hausen a.A., Albisbrunn\r
Hausen a.A., Post\r
Hausen a.A., Bifang\r
Hausen AG, Post\r
Hausen AG, Turnhalle\r
Hausen AG, Stollen\r
Hausen AG, Campus Reichhold\r
Hausen b. Meiringen, Platz\r
Hausen b. Meiringen,Dorfbrunn.\r
Hausen b. Meiringen,Summerauli\r
Häusernmoos, Dorf\r
Häuslenen, Moos\r
Häuslenen, Zentrum\r
Haut-de-Caux\r
Haute-Nendaz, télécabine\r
Haute-Nendaz, station/poste\r
Haute-Nendaz, église\r
Haute-Nendaz, bif. Planchouet\r
Haute-Nendaz, bif.Le Déserteur\r
Haute-Nendaz, Chapelle-Bleusy\r
Haute-Nendaz, bif. Pattier\r
Haute-Nendaz, Chalet Dardel\r
Haute-Nendaz, La Crettaz\r
Haute-Nendaz (télécabine)\r
Haute-Nendaz La Meina\r
Hauterive NE, Rouges-Terres\r
Hauterive NE, Château\r
Hauterive NE, Laténium\r
Hauterive NE, Port\r
Hauterive NE, Beaumont\r
Hauterive NE, poste\r
Hauterive NE, Longchamps\r
Hauterive NE débarcadère\r
Hauteville, Le Ruz\r
Hauteville, village\r
Hauteville, Les Fourches\r
Hauteville\r
Hebrig, Bahnhof\r
Hebrig\r
Hedingen, Güpf\r
Hedingen\r
Hedingen, Hausacker\r
Heerbrugg, Bahnhof Ost\r
Heerbrugg, Waldegg\r
Heerbrugg, Dornacherhof\r
Heerbrugg, Schloss\r
Heerbrugg, Kloteren\r
Heerbrugg, Neuwies\r
Heerbrugg, Rosenbergsaustrasse\r
Heerbrugg, Schulen\r
Heerbrugg, Bahnhof\r
Heerbrugg\r
Hefenhausen, Illharterstrasse\r
Hefenhofen, Hamisfeld\r
Hefenhofen, Brüschwil\r
Hefenhofen, Sonnenberg\r
Hefenhofen, Auenhofen\r
Hefenhofen, Hatswil\r
Hefenhofen, Sonne\r
Hefenhofen, Moos\r
Hefenhofen, Metropol\r
Hegdorn\r
Heidbodme\r
Heidbüel\r
Heiden, Dunant-Museum\r
Heiden, Rosental\r
Heiden, Bissau\r
Heiden, Bahnhof\r
Heiden, Asylstrasse\r
Heiden, Rosengarten\r
Heiden, Waldegg Heiden\r
Heiden, Hirschli\r
Heiden, Lindenplatz\r
Heiden, Post\r
Heiden\r
Heiligenschwendi, Multenegg\r
Heiligenschwendi, Kohlerensäge\r
Heiligenschwendi, Dörfli\r
Heiligenschwendi, Alte Post\r
Heiligenschwendi, Haltenegg\r
Heiligenschwendi, Reha Zentrum\r
Heiligenschwendi, Stapfebode\r
Heiligenschwendi, Schulhaus\r
Heiligenschwendi, Aebnit\r
Heiligenschwendi,Ober-Eichholz\r
Heiligenschwendi,Unt.-Eichholz\r
Heiligenschwendi, Alpenblick\r
Heiligenschwendi, Hundschüpfen\r
Heiligenschwendi, Hünibode\r
Heiligkreuz (Mels), Untergasse\r
Heiligkreuz (Mels), Ragnatsch\r
Heiligkreuz (Mels), Staatsstr.\r
Heimberg, Garage\r
Heimberg, Bahnhof\r
Heimberg, Lädeli\r
Heimberg, Aarhölzliweg\r
Heimberg, Riedackerstrasse\r
Heimberg, Sportzentrum\r
Heimberg, Bernstrasse/Lädeli\r
Heimberg, Laueligrabenweg\r
Heimberg, Haslikehr\r
Heimberg\r
Heimberg, Dornhalde\r
Heimberg, Buechwaldstrasse\r
Heimenhausen, Riedgasse\r
Heimenhausen, Post\r
Heimenhofen, Kreuzung\r
Heimenschwand, Badhaus\r
Heimenschwand, Rothachen\r
Heimenschwand, Rohrimoos Bad\r
Heimenschwand, Scheidweg\r
Heimenschwand, Hinterägerten\r
Heimenschwand, Bruchenbühl\r
Heimenschwand, Kuhstelle\r
Heimenschwand, Marbach\r
Heimenschwand, Post\r
Heimenschwand, Höh\r
Heimisbach, Steckshaus\r
Heimisbach, Sternen\r
Heimisbach, Furlimatt\r
Heimisbach, Krummholzbad\r
Heimisbach, Post\r
Heimisbach, Wagnershaus\r
Heimisbach, Thal\r
Heimiswil, Oberdorf\r
Heimiswil, Niederdorf\r
Heimiswil, Kipf\r
Heimiswil, Löwen\r
Heimwehfluh\r
Heinrichswil\r
Heitenried, Dorf\r
Heitenried, Sodbach\r
Heitenried, Abzw. Schwenny\r
Heitenried, Pfandmatta\r
Heitenried, St. Michael\r
Heiterswil, Krummbach\r
Heiterswil, Weier\r
Heiterswil, alte Post\r
Helgisried-Rohrbach, Säge\r
Helgisried-Rohrbach, Post\r
Helgisried-Rohrbach, Bühlstutz\r
Hellbühl, Unter Hellbühl\r
Hellbühl, Post\r
Hellbühl, Mittler Büel\r
Hellbühl, Moosschür\r
Hellikon, Mitteldorf\r
Hellikon, Ausserdorf\r
Hellikon, Unterdorf\r
Hellsau, Dorfmitte\r
Helsighausen, Kreuzung\r
Hemberg, Schwandsbrugg\r
Hemberg, Schlatt\r
Hemberg, Rütelirank\r
Hemberg, Rohr\r
Hemberg, Dorf\r
Hemberg, Dietschwil\r
Hemishofen, Dorf\r
Hemmental, Dorfplatz\r
Hemmental, Hochrahn\r
Hemmental, Mäserich (Randen)\r
Hemmental, Gehren\r
Hemmental, Kreuzweg (Randen)\r
Hemmiken, Friedhof\r
Hemmiken, Junkerschloss\r
Hemmiken, Dorf\r
Hemmiken, Stiegelmatt\r
Henau, Felsegg\r
Henau, Oberberg\r
Henau, Kirchplatz\r
Henau, Wirmeten\r
Hendschiken\r
Henggart\r
Henggart, Bahnhof\r
Hennens, village\r
Henniez, village\r
Henniez\r
Herbetswil, Mieschegg\r
Herbetswil, Wolfsschlucht\r
Herbetswil, Tannmatt\r
Herbetswil, Untere Tannmatt\r
Herbetswil, Hinterer Hammer\r
Herbetswil, Hinterer Brandberg\r
Herbetswil, Vorderer Brandberg\r
Herbetswil, Dorf\r
Herbligen, Dorf\r
Herblingen, Bahnhof\r
Herblingen\r
Herbriggen, Mattsand\r
Herbriggen, Bahnhof\r
Herbriggen, Biel\r
Herbriggen\r
Herbriggen, Breitmatten\r
Herdern, Dorf\r
Hérémence, La Crêta\r
Hérémence, Les Mélèzes\r
Hérémence, Piroua\r
Hérémence, Riod\r
Hérémence, Cerise\r
Hérémence, Ayer\r
Hérémence\r
Hérémence Les Masses\r
Hergiswald, Kirche\r
Hergiswil (See)\r
Hergiswil LU, Untere Schmiede\r
Hergiswil LU, Dorf\r
Hergiswil LU, Luegental\r
Hergiswil LU, Vordere Säge\r
Hergiswil Matt\r
Hergiswil NW, Badi\r
Hergiswil NW\r
Hergiswil NW, Grauenstein\r
Hergiswil NW, Allmendli\r
Hergiswil NW, Obermatt\r
Hergiswil NW, Althuserbrücke\r
Hergiswil NW, Sonnhaldenstr.\r
Hergiswil NW, Buolterlistrasse\r
Hergiswil NW, Käppelimattstr.\r
Hergiswil NW, Schifflände\r
Hergiswil NW, Schlüssel\r
Hergiswil NW, Renggstrasse\r
Hergiswil NW, Gemeindehaus\r
Hergiswil NW, Ober Buolterli\r
Hergiswil NW, Zwyden\r
Hergiswil NW, Wylpark\r
Hergiswil NW, Schulhaus Dorf\r
Hergiswil NW, Kurplatz\r
Hergiswil NW, Bahnhof\r
Hergiswil NW, Mattli\r
Hergiswil NW, Büelstrasse\r
Hergiswil NW, Sonnenbergstr.\r
Hergiswil NW, Dorfhaldenstr.\r
Herisau, Tüfi\r
Herisau, Obermoosberg\r
Herisau, Ebnet\r
Herisau, Ramsenhof\r
Herisau, Sonnenberg\r
Herisau, Saum\r
Herisau, Kreuzweg\r
Herisau, Nordhalde\r
Herisau, Rütihalde\r
Herisau, Sportzentrum\r
Herisau, Post/Casino\r
Herisau, Bergstrasse\r
Herisau, Müli\r
Herisau, Schloss\r
Herisau, Langelen\r
Herisau, Heinrichsbad\r
Herisau, Wiesental\r
Herisau, Huebstrasse\r
Herisau, Gemeindehaus\r
Herisau, Brüel\r
Herisau, Obstmarkt\r
Herisau, obere Fabrik\r
Herisau, Bahnhof\r
Herisau, Friedhof\r
Herisau, Säge\r
Herisau, Tüfenau\r
Herisau, Dreilinden\r
Herisau, Steinegg\r
Herisau, Witenschwendi\r
Herisau, Egg\r
Herisau, Scheibe\r
Herisau, Bruggeregg\r
Herisau, Lederbach\r
Herisau, Landersberg\r
Herisau, Walke\r
Herisau, Stelz\r
Herisau, Psych. Zentrum\r
Herisau, Talweg\r
Herisau, Wilen\r
Herisau, Migros/Spital\r
Herisau, Ramsen\r
Herisau, Ufem Berg\r
Herisau, Rohren\r
Herisau, am Bach\r
Herisau, Cilander\r
Herisau, Kaserne\r
Herisau, Johannesbad\r
Herisau, Rietwis\r
Herisau, Burghalde\r
Herisau, Glattmüli\r
Herisau\r
Herisau, Ifang\r
Herisau Wilen\r
Herlisberg, Oberreinach\r
Herlisberg, Steinhus\r
Herlisberg, Dorfplatz\r
Hermance, Villars\r
Hermance, Triaz\r
Hermance, village\r
Hermance (lac)\r
Hermenches, village\r
Hermenches, Moille-Robert\r
Hermetschwil, alte Post\r
Hermetschwil, Kloster\r
Hermiswil, Brücke\r
Hermitage\r
Hermrigen, Friedhof\r
Hermrigen, Dorf\r
Herrenhof, Dorf\r
Herrenschwanden, Halenbrücke\r
Herrenschwanden, Dorf\r
Herrenschwanden, Thalmatt\r
Herrenschwanden, Mööslimatt\r
Herrliberg, Harzerstrasse\r
Herrliberg, Bergstrasse\r
Herrliberg, Humrigen\r
Herrliberg, Kirche Wetzwil\r
Herrliberg, Rebberg\r
Herrliberg, Rain\r
Herrliberg, Rietli\r
Herrliberg, Forchstrasse\r
Herrliberg, Oberdorfweg\r
Herrliberg, Wetzwil\r
Herrliberg, Busenhardstrasse\r
Herrliberg, Holzwies\r
Herrliberg, Pfarrgasse\r
Herrliberg, Alterssiedlung\r
Herrliberg, Schulhaus\r
Herrliberg, Tennisplätze\r
Herrliberg, Sportplatz\r
Herrliberg, Aryanastrasse\r
Herrliberg, Gartenstrasse\r
Herrliberg, Grüt\r
Herrliberg, Vogtei\r
Herrliberg, Grundhofstrasse\r
Herrliberg, Freudacherstrasse\r
Herrliberg (See)\r
Herrliberg-Feldmeilen, Bahnhof\r
Herrliberg-Feldmeilen,Bhf West\r
Herrliberg-Feldmeilen\r
Herrliberg-Feldmeilen, Bhf Ost\r
Hersberg, Dorf\r
Hersberg, Schützen\r
Hersiwil, Dorf\r
Hertenstein (See)\r
Herznach, Post\r
Herznach, Oberherznach\r
Herzogenbuchsee, Bernstrasse\r
Herzogenbuchsee\r
Herzogenbuchsee, Bahnhof\r
Herzogenbuchsee, Friedhof\r
Herzogenbuchsee, Sonnenplatz\r
Herzogenbuchsee, Jurablick\r
Hessigkofen, Post\r
Hettenschwil, Etzwil Dorf\r
Hettenschwil, Lourdes-Grotte\r
Hettenschwil, Dorf\r
Hettiswil b. H., Kreuz\r
Hettiswil b. H., Dorf\r
Hettlingen, Dorf\r
Hettlingen\r
Hettlingen, Bahnhof\r
Hettlingen, Föhrenstrasse\r
Hettlingen, Gemeindehaus\r
Hildisrieden, Hapfern\r
Hildisrieden, Dorf\r
Hildisrieden, Post\r
Hildisrieden, Waldmatt\r
Hilfikon, Dorf\r
Hilfikon, Sandbüel\r
Hilterfingen, Weingartenstr.\r
Hilterfingen, Breitenweg\r
Hilterfingen, Kirche\r
Hilterfingen, Höhenstrasse\r
Hilterfingen, Hünibachstrasse\r
Hilterfingen, Bachgasse\r
Hilterfingen, Post\r
Hilterfingen, Friedhof\r
Hilterfingen (See)\r
Himmelried, Dorf\r
Himmelried, Schulhaus\r
Himmelried, vorderer Igraben\r
Himmelried, Waldeck\r
Hindelbank, Bahnhof\r
Hindelbank, Post\r
Hindelbank, Brunnenhof\r
Hindelbank, Obermoos\r
Hindelbank\r
Hinteregg\r
Hinterforst, Post\r
Hinterforst, Oberrüti\r
Hinterforst, Widenbach/Bächis\r
Hinterfultigen, Sonnhalde\r
Hinterfultigen, Dorf\r
Hinterfultigen, Thanhalten\r
Hinterfultigen, Wydernstrasse\r
Hintergoldingen, Kapelle\r
Hintergoldingen, Austrasse\r
Hintergoldingen, Sonne\r
Hinterkappelen, Bennenboden\r
Hinterkappelen, Post\r
Hinterkappelen, Aumatt\r
Hinterkappelen, Bernstrasse\r
Hinterkappelen, Schlossmatt\r
Hinterrhein, Tälialp\r
Hinterrhein, Dorf\r
Hinterrhein, Tunnel Nordportal\r
Hinterschellenberg\r
Hinterschwarzenegg\r
Hinwil, Industriestrasse\r
Hinwil, Bossikon\r
Hinwil, Wässeristrasse\r
Hinwil, Kreuzplatz\r
Hinwil, Friedhof\r
Hinwil, Alpenblick\r
Hinwil\r
Hinwil, Dorf\r
Hinwil, Zelgacher\r
Hinwil, Hinwil Center West\r
Hinwil, Hinwil Center Ost\r
Hinwil, Sportplatz\r
Hinwil, Gstalden\r
Hinwil, Unterdorf\r
Hinwil, Zürichstrasse\r
Hinwil, Girenbad\r
Hinwil, Langmatt\r
Hinwil, Bahnhof\r
Hinwil, Hadlikon\r
Hinwil, Ringwil\r
Hirli\r
Hirschberg\r
Hirschthal, Bahnhof\r
Hirschthal\r
Hirzel, Wolfisbühl\r
Hirzel, Neuhaus\r
Hirzel, Strickler\r
Hirzel, Wässeri\r
Hirzel, Spitzen\r
Hirzel, Vorderi Siten\r
Hirzel, Kirche\r
Hittnau, Oberhittnau\r
Hittnau, Luppmen\r
Hittnau, Hofhalden\r
Hittnau, Hasel/Schönau\r
Hittnau, Isikon\r
Hittnau, Furt\r
Hittnau, Oberdorf\r
Hittnau, Industrie\r
Hittnau, Sonne\r
Hitzeggen\r
Hitzkirch, Schönegg\r
Hitzkirch, Bahnhof\r
Hitzkirch, Friedhof\r
Hitzkirch, Dorf\r
Hitzkirch, Bleulikon\r
Hitzkirch, Lindenplatz\r
Hitzkirch, Schulhaus\r
Hitzkirch\r
Hoch-Ybrig, Talst. Weglosen\r
Hoch-Ybrig, Talst. Laucheren\r
Hoch-Ybrig Seebli\r
Hoch-Ybrig Seebli (Kl.Sternen)\r
Hoch-Ybrig Seebli Hesisbol\r
Hoch-Ybrig Seebliboden\r
Hochdorf, Sempachstrasse\r
Hochdorf, Schönau\r
Hochdorf, Bahnhof\r
Hochdorf, Industriestrasse\r
Hochdorf, Bankstrasse\r
Hochdorf, Heumoos\r
Hochdorf, Oberstufenzentrum\r
Hochdorf, Rigiring\r
Hochdorf\r
Hochdorf, Nunwilerstrasse\r
Hochdorf Schönau\r
Hochegg (Malbun)\r
Hochfelden, Martinsmühle\r
Hochfelden, Grabenstrasse\r
Höchstetten, Post\r
Höchsthorn\r
Hochwald, Rest. Rössli\r
Hochwald, Ziegelschüren\r
Hochwald, Dorfzentrum\r
Hockenhorngrat\r
Höfen b. Thun, Unteregg\r
Höfen b. Thun, Kistlern\r
Höfen b. Thun, Dorf\r
Höfen b. Thun, Speck\r
Hofen SH, Reiatschulhaus\r
Hofen SH, Dorf\r
Hoffeld, Säge-Waldbach\r
Hoffeld, Strickwald\r
Hoffeld, Ziegelhütte\r
Hoffeld, Post\r
Hofstatt, Dorf\r
Hofstatt, Rüediswil\r
Hofstatt, Grünenboden\r
Hofstatt, Schachen\r
Hofstatt, Gyrstock\r
Hofstetten b. B., Holzkuhplatz\r
Hofstetten b. Brienz, Seeli\r
Hofstetten b. Brienz, Dorfpl.\r
Hofstetten b. Brienz, Schried\r
Hofstetten b. Brienz, Tor\r
Hofstetten b. Brienz, Rüttiweg\r
Hofstetten SO, Milchhüsli\r
Hofstetten SO,Witterswilerstr.\r
Hofstetten SO, Bergmattenweg\r
Hofstetten SO, Unterdorf\r
Hofstetten SO, Mariasteinstr.\r
Hofstetten SO, Ettingerstrasse\r
Hofstetten ZH, Dorf\r
Hohenrain, Unterebersol\r
Hohenrain, Kreuz\r
Hohenrain, Landschau\r
Hohenrain, Post\r
Hohenrain, Oberebersol\r
Hohenrain, Günikon\r
Hohenrain, Ottenhusen\r
Höhenweg\r
Hoher Kasten\r
Hohfluh (Riederalp)\r
Höhi Wispile\r
Hohsaas\r
Hohsträss\r
Hohtenn\r
Hohtenn, Dorf\r
Holderbank AG\r
Holderbank SO, Steinbruch\r
Holderbank SO, Dorfplatz\r
Holderbank SO, Seblenhof\r
Holderkäppeli\r
Holenstein\r
Hölstein, Süd\r
Hölstein, Station\r
Hölstein, Oris\r
Holzegg\r
Holzhäusern\r
Holzhäusern ZG, St. Wendelin\r
Holzhäusern ZG, Kreisel\r
Holziken, Post\r
Holziken, Abzw. Bändli\r
Holziken, Hirschthalerstrasse\r
Homberg bei Thun, Kreuz\r
Homberg bei Thun, Hüttacker\r
Homberg bei Thun, Gappen\r
Homberg bei Thun, Käserei\r
Homberg bei Thun, Dreiligasse\r
Hombrechtikon, Krone\r
Hombrechtikon, Wisental\r
Hombrechtikon, Dörfli\r
Hombrechtikon, Eichberg\r
Hombrechtikon, Niderfeld\r
Hombrechtikon, Grossacher\r
Hombrechtikon, Hofacherstrasse\r
Hombrechtikon, Plattenhof\r
Hombrechtikon, Eichtal\r
Hombrechtikon, Garstlig\r
Hombrechtikon, Holflüe\r
Hombrechtikon, Tobel\r
Hombrechtikon, Post\r
Hombrechtikon, Grüt\r
Homburg, Dorf\r
Homburg, Eugerswil\r
Homburg, Jagdhaus\r
Homburg, Löhren\r
Honau, Hirschen\r
Hondrich, Bühlen\r
Hondrich, Schulhaus\r
Hondrich, Byfang\r
Hondrich, Stutz\r
Honegg (Arvengarten)\r
Honegg (Gummi)\r
Horboden, Sporthalle\r
Horboden, Wampflen\r
Horboden, Bühl\r
Horboden, Chirel\r
Horboden, Chollerenbrücke\r
Horgen, Heubach\r
Horgen, Schärbächli/Fähre\r
Horgen, Gumelenstrasse\r
Horgen, Bergli\r
Horgen, Stocker\r
Horgen, Meilibach\r
Horgen, Glärnischhof\r
Horgen, Wannenthal\r
Horgen, Teufenbach\r
Horgen, Gehren\r
Horgen, Rotweg\r
Horgen, Ebnetstrasse\r
Horgen, Scheller\r
Horgen, Reithy\r
Horgen, Waldegg\r
Horgen, Bahnhof\r
Horgen, Panorama\r
Horgen, Zentrum Tödi\r
Horgen, Bocken\r
Horgen, Spital\r
Horgen, Risi/Dow\r
Horgen, Rietli\r
Horgen, Bergwerk\r
Horgen, Schnegg\r
Horgen, Säntisstrasse\r
Horgen, untere Mühle\r
Horgen\r
Horgen, Käpfnach\r
Horgen, Dorfgasse\r
Horgen, Hanegg\r
Horgen, Enderholz\r
Horgen, Baumgärtlihof\r
Horgen, Wannerstrasse\r
Horgen, Widmerheim\r
Horgen, Aamüli\r
Horgen, Waldhof\r
Horgen, Fischenrüti\r
Horgen, Plattenhof\r
Horgen, Schinzenhof\r
Horgen, Waidli\r
Horgen, Altes Gemeindehaus\r
Horgen, Hüttenstrasse\r
Horgen (See)\r
Horgen Autoquai\r
Horgen Oberdorf, Bahnhof\r
Horgen Oberdorf\r
Horgenbach, Hauptstrasse\r
Horgenberg, Nordecke\r
Horgenberg, Widenbach\r
Horgenberg, Vorderklausen\r
Horgenberg, Moorschwand\r
Horgenberg, Hinterklausen\r
Horgenberg, Wührenbach\r
Horgenberg b. Einsied., Grütli\r
Horgenberg b. Einsied., Tanks.\r
Hörhausen, Freihof\r
Hörhausen, Dorf\r
Hörhausen, Käsereistrasse\r
Hörhausen, Haidenhaus\r
Hörhausen, Untersalen\r
Hörhausen, Obersalen\r
Hörhausen, Hochstrasse\r
Hörhausen, alte Post\r
Hörhausen, Reutenen\r
Höri, Gemeindehaus\r
Höri, Fuhrstrasse\r
Höri, Oberhöri\r
Horn, evang. Kirche\r
Horn, Grünau\r
Horn, Bahnhof\r
Horn, Rütiwiese\r
Horn\r
Horn (See)\r
Hornberg\r
Horneggli\r
Hörnligrat\r
Hornussen, Unterdorf\r
Hornussen, Oberdorf\r
Horriwil, Oberdorf\r
Horriwil, Post\r
Horw, Steinibach\r
Horw, Technikumstrasse\r
Horw, Hofrüti\r
Horw, Rank\r
Horw, Buholz\r
Horw, Steinen\r
Horw, Waldegg\r
Horw, Wegscheide\r
Horw, Kirchweg\r
Horw, Biregghof\r
Horw, Spitz\r
Horw, Felmis\r
Horw, Bahnhof\r
Horw\r
Horw, Zentrum\r
Horw, Seefeld\r
Horw, Ennethorw\r
Horw, Stegen/Kirchfeld\r
Horw, Spier\r
Hosenruck, Dorf\r
Hospental, Jugendherberge\r
Hospental, Gotthardreussbrücke\r
Hospental\r
Hospental, Dorf\r
Hospental, Zumdorf\r
Hottwil, Gassweg\r
Hottwil, Wendeplatz\r
Hub b. Krauchthal, Schulhaus\r
Hub b. Krauchthal,Spritzenhaus\r
Hub b. Krauchthal,Brünnliacker\r
Hübeli LU, Sagematt\r
Hübeli LU, Hintersagi\r
Hubersdorf, Siggern\r
Hubersdorf, Dietrich\r
Hubersdorf, Dorf\r
Huémoz, Bellevue\r
Huémoz, village\r
Huémoz, Les Combes\r
Hüenerchöpf\r
Hugelshofen, Langgasse\r
Hugelshofen, Unterdorf\r
Hugelshofen, Schlatt\r
Hühnerköpfe\r
Humlikon, Dorfplatz\r
Hundwil, Sonderau\r
Hundwil, Dorf\r
Hünenberg, Seeblick\r
Hünenberg, Bösch\r
Hünenberg, Ehret\r
Hünenberg, Huob\r
Hünenberg, Dorf\r
Hünenberg, Schmiedheim\r
Hünenberg, Badi Hünenberg\r
Hünenberg, Rothus\r
Hünenberg, Langrüti\r
Hünenberg, Moos\r
Hünenberg, Chrüzacher\r
Hünenberg, Zythus\r
Hünenberg, Rony\r
Hünenberg Chämleten\r
Hünenberg Zythus\r
Hünibach, Chartreuse\r
Hünibach, Eichbühl\r
Hünibach, Wartbodenstrasse\r
Hünibach, Blümlisalpweg\r
Hünibach, Riedstrasse\r
Hünibach, Abzw. Wartbodenstr.\r
Hünibach, Schlossweg\r
Hünibach, Flurweg\r
Hünibach, Rainweg\r
Hünibach, Mülinenstrasse\r
Hünibach, Stationsstrasse\r
Hünibach, Seematte\r
Hünibach, Höheweg\r
Hünibach (See)\r
Hüniken\r
Hünikon (Neftenbach)\r
Hünikon (Neftenbach), Vontobel\r
Hüntwangen, Dorf\r
Hüntwangen-Wil, Bahnhof\r
Hüntwangen-Wil\r
Hunzenschwil, Weiherweg\r
Hunzenschwil, Birkenweg\r
Hunzenschwil, Unterdorf\r
Hunzenschwil, Gemeindehaus\r
Hunzenschwil, Korbacher\r
Hunzenschwil, Oberdorf\r
Hunzenschwil\r
Hurden\r
Hüswil, Stoos\r
Hüswil\r
Hüswil, Bahnhof\r
Huteggen\r
Hütten, Schulhaus\r
Hütten, Friedhof\r
Hütten, Schöntal\r
Hütten, Segel\r
Hüttenberg\r
Hüttikon\r
Hüttlingen-Mettendorf\r
Huttwil, Fiechtenstrasse\r
Huttwil, Schwimmbad\r
Huttwil, Fiechten\r
Huttwil, Schwarzenbach\r
Huttwil, Friedhof\r
Huttwil\r
Huttwil, Alterssiedlung\r
Huttwil, Bahnhof\r
Huttwil, Schwende\r
Huttwil, Uech\r
Huttwil, Stadt\r
Huttwil, Weieracker\r
Hüttwilen, Oberdorf\r
Hüttwilen, Stutheien\r
Hüttwilen, Neumühle\r
Hüttwilen, Hörnliwald\r
Hüttwilen, Kalchrain\r
Hüttwilen, Zentrum\r
Ibach, Oberschönenbuch\r
Ibach, Plätzli\r
Ibach, Abzw. Unterschönenbuch\r
Ibach, Muotastrasse\r
Ibach, Rainweg\r
Ibach, Eichenweg\r
Ibach, Landsgemeindestrasse\r
Ibach, Rest. Rose\r
Ibach, Studenmatt\r
Ibach, Husmatt\r
Ibach, Schützenstrasse\r
Ibach, Kirche\r
Ibach, Erlen\r
Ibach, Mythen Center\r
Ibach, Eigenwies\r
Ibach, Kieswerk\r
Ibach, Kapelle\r
Ibach, Diesel\r
Ibach, Seilerstrasse\r
Ibergeregg, Alpstubli\r
Ibergeregg, Passhöhe\r
Ibergeregg, Riedmatt\r
Ibergeregg, Eseltritt\r
Ichertswil, alte Post\r
Icogne, Prasserin\r
Icogne, Les Vernasses\r
Icogne, village\r
Idjoch\r
Ifenthal, Kirche\r
Iffwil, Spritzenhaus\r
Iffwil, Moosgasse\r
Iffwil, Strücki\r
Ifwil b. B., Aadorferstrasse\r
Ifwil b. B., Ausserdorf\r
Igis, Kreuzwiese\r
Igis, Dorfplatz\r
Igis, Schulhaus\r
Igis, Rebhaldenweg\r
Igis, Gruobhof\r
Igis, Castaletweg\r
Igis\r
Il Fuorn P6\r
Ilanz, Sogn Martin\r
Ilanz, Via Schlifras\r
Ilanz, Obertor\r
Ilanz, Plazza Cumin\r
Ilanz, S. Clau sura\r
Ilanz, Strada\r
Ilanz\r
Ilanz, Via Santeri\r
Ilanz, Schulhaus\r
Ilanz, Grüneck\r
Ilanz, Bahnhof/Post\r
Ilanz, Spital\r
Ilanz, Albertushof\r
Illarsaz, canal\r
Illarsaz, village\r
Illarsaz, Sauges\r
Illgau (Luftseilbahn)\r
Illgau Dorf\r
Illhart, Oberdorf\r
Illhart, Sternen\r
Illighausen, Wilen\r
Illighausen, Dorf\r
Illnau, Weisslingerstrasse\r
Illnau, Steinacher\r
Illnau, Chrummenacher\r
Illnau, Wingert\r
Illnau, Bahnhof\r
Illnau, Löwen\r
Illnau, Gemeindehaus\r
Illnau, Kirche\r
Illnau, Horben\r
Illnau, Dorfplatz\r
Illnau\r
Iltios\r
Im Fang, Dorf\r
Im Fang, La Bochenaz\r
Im Fang, Praz-Jean\r
Im Fang, Zur Eich\r
Im Holz\r
Immensee, Dorf\r
Immensee, Sunnehof\r
Immensee, Gymnasium\r
Immensee, Bahnhof\r
Immensee, Post\r
Immensee\r
Immensee, Hohle Gasse\r
Immensee (See)\r
Indemini, Monti\r
Indemini, Paese\r
Indemini, Monti In Cima Al Pra\r
Indemini, Pezze\r
Indemini, Isolabella\r
Inden, Russengraben\r
Inden, Dorf\r
Inden, Rumeling\r
Ingenbohl, Gätzli\r
Ingenbohl, Fuchsenen\r
Ingenbohl, Klosterstrasse\r
Inkwil, Bahnhof\r
Inkwil, Dorf\r
Innerarosa (Talst. Tschuggen)\r
Innerberg BE, Dorf\r
Innerberg BE, Weidhaus\r
Innerberg BE, Frieswilfeld\r
Innerberg BE, Bergweid\r
Innergsteig\r
Innerthal, Staumauer\r
Innerthal, Gemeindeplatz\r
Innertkirchen, Winkel\r
Innertkirchen, Innere Urweid\r
Innertkirchen, Hinterflieli\r
Innertkirchen, Wagenkehr\r
Innertkirchen, Gentalhütten\r
Innertkirchen,Abzw. Riglisflie\r
Innertkirchen, Grimseltor\r
Innertkirchen, Eggi\r
Innertkirchen, Schwarzental\r
Innertkirchen, Mühletal\r
Innertkirchen, Wiler\r
Innertkirchen, Kraftwerk (Bus)\r
Innertkirchen Grimseltor\r
Innertkirchen Kraftwerk, Bhf\r
Innertkirchen Kraftwerk (Bahn)\r
Innertkirchen Unterwasser\r
Innerwengen\r
Ins, Bahnhof\r
Ins, Witzwil\r
Ins, West\r
Ins\r
Ins, Dorf\r
Ins, Brennerei\r
Ins Dorf\r
Insel Ufenau\r
Insone, ai Corte\r
Insone, Bivio per Insone\r
Insone, Stella\r
Insone, Paese\r
Interlaken, Zentralplatz\r
Interlaken, Kursaal\r
Interlaken, Drei Tannen\r
Interlaken, Zentrum Artos\r
Interlaken, Berufsschule BZI\r
Interlaken, Gymnasium\r
Interlaken, Geissgasse\r
Interlaken, Mittleres Moos\r
Interlaken, Lindenallee\r
Interlaken, Unt. Bönigstrasse\r
Interlaken, Heimwehfluhbahn\r
Interlaken, Rugenparkstrasse\r
Interlaken, Sonnenhof\r
Interlaken, Jungfraustrasse\r
Interlaken (Heimwehfluhbahn)\r
Interlaken Harderbahn\r
Interlaken Ost\r
Interlaken Ost, Bahnhof\r
Interlaken Ost (See)\r
Interlaken West, Bahnhof\r
Interlaken West\r
Interlaken West (See)\r
Intragna\r
Intragna, Ponte\r
Intragna (Funivia)\r
Intschi, Aelmen\r
Intschi, Seilbahn\r
Intschi (Luftseilbahn Arnisee)\r
Inwil, Nussbaum\r
Inwil, Pannerhof\r
Inwil, Oberhofen\r
Inwil, Dorf\r
Inwil, Körbligen\r
Inwil bei Baar, Huobhof\r
Inwil bei Baar, Kirche\r
Inwil bei Baar, Zuwebe\r
Inwil bei Baar, Rigistrasse\r
Inwil bei Baar, Ebel\r
Ipsach, Bahnweg\r
Ipsach\r
Ipsach Herdi\r
Iragna, Mairano Nord\r
Iragna, Prealberto\r
Iragna, Cave Mairano\r
Iragna, Ponte dei Ladri\r
Iragna, Blono\r
Iragna, Nord\r
Iragna, Buscerina\r
Ischalp\r
Ischalp (Talst. Jakobshorn)\r
Iselisberg, Abzweigung\r
Iselle Trasporto veicoli\r
Iseltwald, Unterschwand\r
Iseltwald, Sengg\r
Iseltwald, am Urfer\r
Iseltwald, Dorfplatz\r
Iseltwald, Mühle\r
Iseltwald (See)\r
Isenfluh, Dorf\r
Isenfluh (Luftseilbahn)\r
Isenthal, Weid-Furggelen\r
Isenthal, Stettli\r
Isenthal, Seilbahn St. Jakob\r
Isenthal, Schwybogenbrücke\r
Isenthal, Chäppeli\r
Isenthal, Luss\r
Isenthal, Dorf\r
Isenthal, Schwanden\r
Isenthal, Schluchen\r
Isenthal, Chliwäldli\r
Isenthal, Heissrüti\r
Iseo, Paese\r
Isérables, église\r
Isérables, Les Chenevieres\r
Isérables, téléphérique\r
Isérables, Auddes\r
Isérables, parc\r
Isérables\r
Isleten, Seegarten\r
Isleten, Schiffsstation\r
Isleten-Isenthal\r
Islikon, Bahnhof\r
Islikon, Zentrum\r
Islikon\r
Islisberg, Dorf\r
Islisberg, Räbacher\r
Isola (See)\r
Isole di Brissago\r
Isone, Gròssa\r
Isone, Piazzale\r
Isone, Paese\r
Isone, Mulino\r
Issert, Les Arlaches\r
Issert\r
Itaslen, Alte Landstrasse\r
Itingen\r
Itramen Egg\r
Itravers\r
Itschnach, Dorf\r
Itschnach, Fallacher\r
Itschnach, Tägermoos\r
Itschnach, Rebweg\r
Ittenthal, Rüttiweg\r
Ittenthal, Dorfmitte\r
Ittigen, Bahnhof\r
Ittigen, Talgut-Zentrum\r
Ittigen, Kappelisacker\r
Ittigen, Rain\r
Ittigen, Schermenwaldstrasse\r
Ittigen, Ittigenstrasse\r
Ittigen, Grauholzstrasse\r
Ittigen, Zulligerstrasse\r
Ittigen, Brunnenhof\r
Ittigen, Aespliz\r
Ittigen, Hausmattstrasse\r
Ittigen, Mannenberg\r
Ittigen, Pulverstutz\r
Ittigen, Talweg\r
Ittigen, Eyfeld\r
Ittigen bei Bern\r
Jakobsbad\r
Jakobsbad (Kronbergbahn)\r
Jakobshorn\r
Jakobshorn (Clavadelerberg)\r
Jakobshorn (Usser Isch)\r
Jakobstal\r
Jaman\r
Jassbach\r
Jatzhorn\r
Jatzmeder\r
Jaun, Weibelsried\r
Jaun, Weidli\r
Jaun, Bergbahnen\r
Jaun, Dorf\r
Jaun, Abzw. Chalet Grat\r
Jaun (Gastlosen Talstation)\r
Jaunpass, Restaurant\r
Jegenstorf, Risere\r
Jegenstorf, Bahnhof\r
Jegenstorf, Zentrum\r
Jegenstorf\r
Jeizinen (Bergstation)\r
Jeizinen SJN\r
Jenaz, Altersheim\r
Jenaz, Marktplatz\r
Jenaz\r
Jenaz, Mühlewiese\r
Jenaz,Rosengarten/Schulanlagen\r
Jenins, Rathaus\r
Jenins, Sonne\r
Jens, Kürze\r
Jens, Dorfplatz\r
Jens, Birkenweg\r
Jens, Moosgasse\r
Jens, Hungerberg\r
Jens, Herrenwald\r
Jeuss, Dorf Eingang\r
Jeuss, Schulhaus\r
Jochpass\r
Jochstock\r
Jona, Busskirchstrasse\r
Jona, Altersheim Meienberg\r
Jona, Feldlistrasse\r
Jona, Molkereistrasse\r
Jona, Vogelau/Bahnhof\r
Jona, Vita-Parcours\r
Jona, Geberit\r
Jona, Grüt\r
Jona, Grünfeld\r
Jona, Sonnenblickstrasse\r
Jona, Lenggisrain\r
Jona, Neuhof\r
Jona, Weiden\r
Jona, Wohnheim Balm\r
Jona, Raineggstrasse\r
Jona, Allmeindstrasse\r
Jona, Aubrigstrasse\r
Jona, Langrütistrasse\r
Jona, Schachen\r
Jona, Kreuz\r
Jona, Jona-Center\r
Jona, Erlen\r
Jona, Bollwies\r
Jona, Fluhstrasse\r
Jona, Hummelberg\r
Jona, Kindergarten Hummelberg\r
Jona, Hummelwaldstrasse\r
Jona, Tägernau\r
Jona, Rankstrasse\r
Jona, Lenggiserstrasse\r
Jona, Spitzenwies\r
Jona, Schönau\r
Jona\r
Jona, Buechstrasse Ost\r
Jona, Feldli\r
Jona, Buech Industrie\r
Jona, St. Dionys\r
Jona, Bahnhof\r
Jona, Kreuzackerstrasse\r
Jona, Buechstrasse West\r
Jonen, Käppeli\r
Jonen, Radmühle\r
Jonen, Weingasse\r
Jonen, Taverne\r
Jongny, Chaudette\r
Jongny, Combette\r
Jongny, Reposoir\r
Jongny, village\r
Jongny, Châtillon\r
Jonschwil, Steinacker\r
Jonschwil, Sonne\r
Jonschwil, Kreisel\r
Jonschwil, Winkel\r
Jonschwil, Oberbettenau\r
Jonvrai\r
Jor\r
Jorasse\r
Jouxtens-Mézery\r
Julier, La Veduta\r
Jungfraujoch\r
Juriens, village\r
Juriens, église\r
Juriens, Le Cosson\r
Jussy, Lullier\r
Jussy, Centre horticole\r
Jussy, Peupliers\r
Jussy, Bellebouche\r
Jussy, Les Mévaux\r
Jussy, Châtaignières\r
Jussy, place\r
Jussy, La Forge\r
Jussy, château\r
Jussy, Monniaz\r
Jussy, La Loure\r
Jussy, Sionnet\r
Jussy, Petit-Lullier\r
Jussy, Meurets\r
Jussy, Lullier Plantais\r
Kägiswil, Dorf\r
Kägiswil, Schlieren\r
Kaiseraugst, Bahnhof\r
Kaiseraugst, Sagerweg\r
Kaiseraugst, Hoffmann-La Roche\r
Kaiseraugst, Liebrüti\r
Kaiseraugst\r
Kaiseraugst Schifflände\r
Kaiseregg (Bergstation)\r
Kaiserstuhl AG, Bahnhof\r
Kaiserstuhl AG\r
Kaiserstuhl OW\r
Kaiserstuhl OW, Bahnhof\r
Kaisten, Unterdorf\r
Kaisten, Gemeindehaus\r
Kaisten, Kaisterberg\r
Kaisten, Ritanne\r
Kaisten, Lümberg\r
Kaisten, Eigenmatt\r
Kaisten, Steigstich\r
Kallnach, Bahnhof\r
Kallnach, Sternen\r
Kallnach\r
Kalpetran\r
Kalpetran (Seilbahn)Talstation\r
Kaltacker, Ramisberg\r
Kaltacker, Leumberg\r
Kaltbach, Sandsteinhöhle\r
Kaltbach, Dorf\r
Kaltbrunn, Müllisperg\r
Kaltbrunn, Aeuli\r
Kaltbrunn, Gasterstrasse\r
Kaltbrunn, Fischhausen\r
Kaltbrunn, Sonnhalde\r
Kaltbrunn, Stiggleten\r
Kaltbrunn\r
Kaltbrunn, Steinenbrücke\r
Kaltbrunn, Dorf\r
Kaltbrunn, Freigaden\r
Kaltenbach, Schööfferwis\r
Kaltenbach, Gemeindehaus\r
Kaltenbrunnen bei Meiringen\r
Kaltenherberg\r
Kalthäusern, Dorf\r
Kälti\r
Kandergrund, Bifige\r
Kandergrund, Altels\r
Kandergrund, Riegelsee\r
Kandergrund, Post\r
Kandersteg, Talstat. Sunnbüel\r
Kandersteg, Simplon\r
Kandersteg, Gemmi\r
Kandersteg, Kirche\r
Kandersteg, Hüttentürli\r
Kandersteg, Talstat. Oeschinen\r
Kandersteg, Erika\r
Kandersteg, Museum\r
Kandersteg\r
Kandersteg, Victoria\r
Kandersteg, Bahnhof\r
Kandersteg, Kasernement Bären\r
Kandersteg, Ruedi Hus\r
Kandersteg, Pfadizentrum\r
Kandersteg, Gemeindehaus\r
Kandersteg, Neubrücke/Waldhaus\r
Kandersteg, Blümlisalp\r
Kandersteg (Luftseilbahn)\r
Kandersteg (Talst. Oeschinen)\r
Kandersteg (Talst. Sunnbüel)\r
Kandersteg Autoverlad\r
Känerkinden, Mehrzweckhalle\r
Känerkinden, Dorf\r
Kanonenrohr (Schilthornhütte)\r
Känzeli (Chur)\r
Kappel a.A., Allenwinden\r
Kappel a.A., Kloster\r
Kappel SO, Schulhaus\r
Kappel SO, Kreuz\r
Kappel SO, Steinplatte\r
Kappelen, Oberdorf\r
Kappelen, Werdthof\r
Kappelen, Kirche\r
Kappelenring, Ost\r
Kappelenring, West\r
Kappelenring, Nord\r
Käppelimatt b. Willisau\r
Kartitscha\r
Käserstatt\r
Käserstatt (Talst. Hohsträss)\r
Käserstatt Chüemad\r
Kastanienbaum, Krämerstein\r
Kastanienbaum, Schiffstation\r
Kastanienbaum, Kreuzmatt\r
Kastanienbaum, Dorni\r
Kastanienbaum, Waldwinkel\r
Kastanienbaum (See)\r
Kaufdorf, Lochpinte\r
Kaufdorf, Bahnhof\r
Kaufdorf\r
Kehlhof\r
Kehrsatz\r
Kehrsatz, Tannacker\r
Kehrsatz, Bahnhof\r
Kehrsatz, Zimmerwaldstr/Talstr\r
Kehrsatz, Rössli\r
Kehrsatz Nord\r
Kehrsiten Dorf\r
Kehrsiten-Bürgenstock\r
Kemmeriboden\r
Kempraten, Bahnhof\r
Kempraten\r
Kempraten, Belsito\r
Kempten, Kreuzackerstrasse\r
Kempten, Talhof\r
Kempten, Emmetschloo\r
Kempten, Pfadacher\r
Kempten, Oberkempten\r
Kempten, Ochsen\r
Kempten, Summerau\r
Kempten, Schornäglen\r
Kempten\r
Kemptthal, Bahnhof\r
Kemptthal\r
Kernenried\r
Kerns, Sand\r
Kerns, Chäli-Burgflue\r
Kerns, Bodacher\r
Kerns, Post\r
Kerns, Boll\r
Kerns, Foribach\r
Kerns, Kernwald\r
Kerzers, Spittelgässli\r
Kerzers, Käserei\r
Kerzers, Reservoirweg\r
Kerzers, Alte Oele\r
Kerzers, Schwimmbad\r
Kerzers\r
Kerzers, Bahnhof\r
Kerzers, Mühlegasse\r
Kerzers Papiliorama\r
Kesswil\r
Kestenholz, Rain\r
Kestenholz, Dörfli\r
Kestenholz, Kastanienbaum\r
Kienberg, Hirschen\r
Kienberg, Kreuz\r
Kiental, Faulbrunni\r
Kiental, Dorf\r
Kiental, Schönegg\r
Kiental, Tschingel\r
Kiental, Rufenen\r
Kiental, Ramslauenen\r
Kiental, Loosplattenalp\r
Kiental, Rest. Alpenruhe\r
Kiental, Abzw. Spiggengrund\r
Kiental SKRa\r
Kies (Niederental)\r
Kies (Talstation)\r
Kiesen\r
Kilchberg BL, Gemeindehaus\r
Kilchberg ZH, Weinbergstrasse\r
Kilchberg ZH, Asp\r
Kilchberg ZH, Auf Brunnen\r
Kilchberg ZH, Paradiessteig\r
Kilchberg ZH, Lindt & Sprüngli\r
Kilchberg ZH, Stockengut\r
Kilchberg ZH, Bendlikon\r
Kilchberg ZH, Bächlerstrasse\r
Kilchberg ZH, Kirche\r
Kilchberg ZH, Alterszentrum\r
Kilchberg ZH, Gemeindehaus\r
Kilchberg ZH, Sanatorium\r
Kilchberg ZH, Paradiesstrasse\r
Kilchberg ZH,Schulhaus Dorfstr\r
Kilchberg ZH, Hornhaldenstr.\r
Kilchberg ZH, Mythenstrasse\r
Kilchberg ZH, Schlimbergstr.\r
Kilchberg ZH, Schwelle\r
Kilchberg ZH, Gottlieb-Binder\r
Kilchberg ZH, Bahnhof\r
Kilchberg ZH, Schooren\r
Kilchberg ZH, Schoorenstrasse\r
Kilchberg ZH, Neuweid\r
Kilchberg ZH\r
Kilchberg ZH, Emilienheim\r
Kilchberg ZH, Breitloo\r
Kilchberg ZH, Lätten\r
Kilchberg ZH, Obere Hornhalde\r
Kilchberg ZH (See)\r
Killwangen, Bahnhof\r
Killwangen, Bahnhof Nord\r
Killwangen, Mühlehalde\r
Killwangen-Spreitenbach\r
Kindhausen AG, Eichholz\r
Kindhausen AG\r
Kindhausen ZH, Geeren\r
Kindhausen ZH, Bodenacher\r
Kippel, Altersheim\r
Kippel, Dorf\r
Kirchberg BE, Grossmatt\r
Kirchberg BE, Neuhof Mitte\r
Kirchberg BE, Rosenweg\r
Kirchberg BE, Nyco\r
Kirchberg BE, Post\r
Kirchberg BE, Bütikofenstrasse\r
Kirchberg BE, Neuhof Süd\r
Kirchberg BE, Einkaufszentrum\r
Kirchberg BE, Wydenhof\r
Kirchberg BE, Elsässer\r
Kirchberg BE, Badimatte\r
Kirchberg BE, Neuhof Nord\r
Kirchberg SG, Neudorf\r
Kirchberg SG, Post\r
Kirchberg SG, Remis\r
Kirchberg SG, Fetzhof\r
Kirchberg SG, Strick\r
Kirchberg SG, Tüfrüti\r
Kirchberg SG, Salen\r
Kirchberg SG, Florastrasse\r
Kirchberg SG, Breiti\r
Kirchberg SG, Lamperswil\r
Kirchberg SG, Husen\r
Kirchberg-Alchenflüh\r
Kirchberg-Alchenflüh, Bahnhof\r
Kirchdorf AG, Landstrasse\r
Kirchdorf AG, Dorf\r
Kirchdorf AG, Aesch\r
Kirchdorf BE, Dorfstrasse\r
Kirchdorf BE, Kirchgasse\r
Kirchenthurnen, Mösli\r
Kirchenthurnen, Dorf\r
Kirchenthurnen, Abzw.\r
Kirchleerau, Fabrik Hunziker\r
Kirchleerau, Abzw./Bank\r
Kirchleerau-Moosleerau, Post\r
Kirchlindach, Kirche\r
Kirchlindach, Friedhof\r
Kirchlindach, Heimenhaus\r
Kirchlindach, Jetzikofenstr.\r
Kirchlindach, Oberlindach\r
Kirchrued, Kirche\r
Klarsreuti, Linde\r
Klausen Passhöhe\r
Klein Matterhorn\r
Klein Sternen\r
Kleinandelfingen, Dorf\r
Kleinandelfingen, Bad\r
Kleinbösingen\r
Kleindietwil, Wystägen\r
Kleindietwil, Post\r
Kleindietwil\r
Kleindöttingen, Breite\r
Kleindöttingen, Schwächeler\r
Kleindöttingen, Burlen\r
Kleindöttingen, Eien\r
Kleindöttingen, Zentrum\r
Kleine Scheidegg\r
Kleine Scheidegg (Arven)\r
Kleine Scheidegg (Lauberhorn)\r
Kleiner Gumen\r
Kleingurmels, Dorf\r
Kleinguschelmuth\r
Kleinikon\r
Kleinlützel, Frohmatt\r
Kleinlützel, Ölibächli\r
Kleinlützel, Schlossfabrik\r
Kleinlützel, Stollen\r
Kleinlützel, Schulhaus\r
Kleinlützel, Niedermatt\r
Kleinlützel, Chlösterli\r
Kleinlützel, Ziegelscheune\r
Kleinlützel, Huggerwald\r
Kleinlützel, Ring\r
Kleinteil, Post\r
Kleinwangen, Schmiede\r
Kleinwangen, Oberdorf\r
Kleinwangen, Post\r
Kleinwangen, Ferren\r
Klewen\r
Klewenalp\r
Klewenalp Wangiboden\r
Klewenstock\r
Klingenstock\r
Klingnau\r
Klingnau, Dorfstrasse\r
Klöntal, Eggliberg\r
Klöntal, Löntschtobel\r
Klöntal, Schwändeli\r
Klöntal, Richisau\r
Klöntal, Rhodannenberg\r
Klöntal, Plätz\r
Klöntal, Ruestelchopf\r
Klöntal, Vorauen\r
Klosters, Eggarain\r
Klosters, Madrisabahn\r
Klosters, Aeuja Alte Post\r
Klosters, Aeuja Brücke\r
Klosters, Au\r
Klosters, Brachweg\r
Klosters, Kirchplatz\r
Klosters, Gotschnastrasse\r
Klosters, Kath. Kirche\r
Klosters, Pardels\r
Klosters, Mälcheti\r
Klosters, Malein\r
Klosters, Monbiel Parkplatz\r
Klosters, Kraftwerk\r
Klosters, Bir Legi\r
Klosters, Hotel Sport\r
Klosters, Brügga\r
Klosters, Überm Bach\r
Klosters, Rüefa\r
Klosters, Oberselfranga\r
Klosters, Nutlihüschi\r
Klosters, Täschi\r
Klosters, Sportzentrum\r
Klosters, Russna\r
Klosters, Fuchsfarm\r
Klosters, Soldanella\r
Klosters, Bündnerhof\r
Klosters, Risweg\r
Klosters, Doggiboden\r
Klosters, Stütz\r
Klosters, Höhwald\r
Klosters, Rufinis\r
Klosters, Höfji\r
Klosters, Vereinapark\r
Klosters, Bündelti\r
Klosters Dorf\r
Klosters Dorf, Bahnhof\r
Klosters Dorf (Talst. Madrisa)\r
Klosters Platz, Bahnhof\r
Klosters Platz\r
Klosters Platz (Gotschnabahn)\r
Klosters Selfranga\r
Kloten\r
Kloten, Schulstrasse\r
Kloten, Schluefweg\r
Kloten, Lägernstrasse\r
Kloten, Härdlen\r
Kloten, Hohrainli\r
Kloten, Kaserne Ost\r
Kloten, Rankstrasse\r
Kloten, Grubenstrasse\r
Kloten, Sporthalle Ruebisbach\r
Kloten, Geissbergstrasse\r
Kloten, Buchhalden\r
Kloten, Weinbergstrasse\r
Kloten, Mühle\r
Kloten, Graswinkel\r
Kloten, Wohnheim\r
Kloten, Egetswil\r
Kloten, Chanzler\r
Kloten, Stadthaus\r
Kloten, Ackerstrasse\r
Kloten, Neubrunnenstrasse\r
Kloten, Bahnhof\r
Kloten, Breitistrasse/Bahnhof\r
Kloten, Wallisellenstrasse\r
Kloten, Balsberg Hardacher\r
Kloten, Freienberg\r
Kloten, Zum Wilden Mann\r
Kloten, Lindenstrasse\r
Kloten, Bramen\r
Kloten, Oberfeld\r
Kloten, Kirchgasse\r
Kloten, Waldeggweg\r
Kloten, Säntisstrasse\r
Kloten Balsberg, Bahnhof\r
Kloten Balsberg\r
Klus, Bahnhof\r
Klus, Maiacker\r
Klus\r
Klusstalden\r
Knonau, Uttenberg\r
Knonau\r
Knutwil, Dorf\r
Knutwil, alte Post\r
Knutwil, Hofacker\r
Koblenz\r
Koblenz, Bahnhof\r
Koblenz, Landstrasse/Dorf\r
Koblenz Dorf\r
Kollbrunn\r
Kollbrunn, Weissenthal\r
Kollbrunn, Bahnhof\r
Kölliken, Central\r
Kölliken, Oberdorf\r
Kölliken\r
Kölliken Oberdorf\r
Köniz, Stapfen Friedhof\r
Köniz, Leen\r
Köniz, Weiermatt\r
Köniz, Stapfenrain\r
Köniz\r
Köniz, Sandwürfi Friedhof\r
Köniz, Landorf\r
Köniz, Mösliweg\r
Köniz, Bahnhof\r
Köniz, Zentrum\r
Köniz, Schloss\r
Köniz, Brühlplatz\r
Konolfingen, Kreuzplatz\r
Konolfingen, Grünegg\r
Konolfingen, Dorf\r
Konolfingen, Ursellen\r
Konolfingen, Haldenweg\r
Konolfingen, Bahnhof\r
Konolfingen,Brunnhaldenstrasse\r
Konolfingen\r
Koppigen, Post\r
Koppigen, Schwimmbad\r
Koppigen, Gemeindeverwaltung\r
Koppigen, Sternen\r
Koppigen, Stöck\r
Kottwil, Seewagen\r
Kottwil, Zuswil\r
Kottwil, Dorf\r
Kräbel\r
Kräbel (Talstation Scheidegg)\r
Kradolf, Heldswilerstrasse\r
Kradolf, Bahnhof\r
Kradolf\r
Kräiligen, Restaurant Brücke\r
Krattigen, Oertlimatt\r
Krattigen, Kirche\r
Krattigen, Post\r
Krattigen, Dorf\r
Krattigen, Tschuppen\r
Krattigen, Stuhlegg\r
Krauchthal, Länggasse\r
Krauchthal, Buch\r
Krauchthal, Post\r
Kreuzboden\r
Kreuzlingen, Rebstockplatz\r
Kreuzlingen, Blaues-Haus-Platz\r
Kreuzlingen, Kirche Bernrain\r
Kreuzlingen, Kurzrickenbach\r
Kreuzlingen, Remisbergstrasse\r
Kreuzlingen, Gaissbergstrasse\r
Kreuzlingen, Karussell\r
Kreuzlingen, Fliegaufstrasse\r
Kreuzlingen, Helvetiaplatz\r
Kreuzlingen, Gaissberg\r
Kreuzlingen, Brunegg\r
Kreuzlingen, Ribistrasse\r
Kreuzlingen, Spiesshaldenstr.\r
Kreuzlingen, Sägenösch\r
Kreuzlingen, Felsenburg\r
Kreuzlingen, alte Bergstrasse\r
Kreuzlingen, Wolfagger\r
Kreuzlingen, Rosenegg\r
Kreuzlingen, Seminar\r
Kreuzlingen, Kolosseumplatz\r
Kreuzlingen, Löwenstrasse\r
Kreuzlingen, Bahnhof\r
Kreuzlingen, Jakobshöhe\r
Kreuzlingen, Zihlstrasse\r
Kreuzlingen, Hauptzoll\r
Kreuzlingen, Sonnenweg\r
Kreuzlingen, Seepark\r
Kreuzlingen, Alterszentrum\r
Kreuzlingen, Möösliweg\r
Kreuzlingen, Weiherstrasse\r
Kreuzlingen, Besmer\r
Kreuzlingen, Burg\r
Kreuzlingen, Schwimmbad\r
Kreuzlingen, Friedbergstrasse\r
Kreuzlingen, Paulistrasse\r
Kreuzlingen, Rosenweg\r
Kreuzlingen, Seeschau\r
Kreuzlingen, Sonnenwiesenstr.\r
Kreuzlingen, Esslenstrasse\r
Kreuzlingen, Granegg\r
Kreuzlingen, Kantonsschule\r
Kreuzlingen, Rothaus\r
Kreuzlingen, Dufourstrasse\r
Kreuzlingen, Seeblickstrasse\r
Kreuzlingen, Grenzstrasse\r
Kreuzlingen, Konstanzerstrasse\r
Kreuzlingen, Langhalden\r
Kreuzlingen, Wasenstrasse\r
Kreuzlingen, Käsbach\r
Kreuzlingen, Burggraben\r
Kreuzlingen, Bodensee-Arena\r
Kreuzlingen, Egelsee\r
Kreuzlingen, Bernegg\r
Kreuzlingen, Neudorfstrasse\r
Kreuzlingen, MOWAG\r
Kreuzlingen, Bergstr\r
Kreuzlingen, Breite\r
Kreuzlingen, Bärenplatz\r
Kreuzlingen\r
Kreuzlingen Bernrain, Bahnhof\r
Kreuzlingen Bernrain\r
Kreuzlingen Hafen\r
Kreuzlingen Hafen, Bahnhof\r
Kreuzlingen Hafen (See)\r
Kreuzstrasse, Bahnhof\r
Kreuzstrasse\r
Kriechenwil, Oberdorf\r
Kriechenwil, Schulhaus\r
Kriegstetten, Subingenstrasse\r
Kriegstetten, Dorfplatz\r
Kriegstetten, Reform. Kirche\r
Kriens, Friedhofstrasse\r
Kriens, Kirchbühl\r
Kriens, Senti\r
Kriens, Sternmatt\r
Kriens, Sportweg\r
Kriens, Roggernhalde\r
Kriens, Unter-Dattenberg\r
Kriens, Bachstrasse\r
Kriens, Gabeldingen Schulhaus\r
Kriens, Gabeldingen\r
Kriens, Grosshofstrasse\r
Kriens, Grabenhof\r
Kriens, Nidfeld\r
Kriens, Krauerhalle\r
Kriens, Sidhalde\r
Kriens, Oberkuonimatt\r
Kriens, Oberhusweg\r
Kriens, Schachenstrasse\r
Kriens, Oberhusrain\r
Kriens, Rosenstrasse\r
Kriens, St. Niklausengasse\r
Kriens, Pilatusmarkt\r
Kriens, Busschleife\r
Kriens, Alpenstrasse\r
Kriens, Dattenbergrain\r
Kriens, Himmelrichstrasse\r
Kriens, Eichenspes\r
Kriens, Grossfeldstrasse\r
Kriens, Josef Schryberstrasse\r
Kriens, Zentrum Pilatus\r
Kriens, Südstrasse\r
Kriens, Zumhofstrasse\r
Kriens, Pulvermühle\r
Kriens, Dattenmatt\r
Kriens, Klösterli\r
Kriens, Gemeindehaus\r
Kriens, Kuonimatt\r
Kriens, Mattenhof\r
Kriens,Obere Dattenbergstrasse\r
Kriens, Schappe-Center\r
Kriens, Pilatus-Bahnen\r
Kriens, Wiggenhof\r
Kriens, Südpol\r
Kriens, Ehrendingen\r
Kriens, Dattenberg\r
Kriens, Guetrüti\r
Kriens, Kupferhammer\r
Kriens, Hofmatt-Bellpark\r
Kriens, Lauerzweg\r
Kriens, Bergstrasse\r
Kriens, Zunacher\r
Kriens, Obere Weinhalde\r
Kriens, Zumhof\r
Kriens, Feldmühle\r
Kriens (Pilatusbahn)\r
Kriens (Sonnenbergbahn)\r
Kriens Mattenhof\r
Krienseregg\r
Kriessern, Dorf\r
Kriessern, Schützenwiese\r
Kriessern, Baggersee\r
Kriessern, Gassermadstrasse\r
Krinau, Mühle\r
Krinau, Fabrik Feldmoos\r
Krinau, Rössli\r
Kronberg\r
Kronbühl, alte Post\r
Kronbühl, Kantonalbank\r
Kronbühl, Bruggbach\r
Krummenau\r
Krummenau, Restaurant Adler\r
Krümmenswil\r
Küblis, Tälfsch\r
Küblis, Prada\r
Küblis, Abzw. innerer Stutz\r
Küblis, Dorfplatz\r
Küblis, Dalvazza\r
Küblis\r
Küblis, Bahnhof\r
Küblis, Fryegg\r
Kümmertshausen, Oberlöwenhaus\r
Kümmertshausen, Hauptstrasse\r
Küngoldingen\r
Küngoldingen, Post\r
Künten, Gried\r
Künten, Bodenacher/Breiti\r
Kurzrickenbach Seepark\r
Küsnacht Goldbach\r
Küsnacht ZH, Oberfeld\r
Küsnacht ZH, Schübel\r
Küsnacht ZH, Himmelistrasse\r
Küsnacht ZH, Bühlstrasse\r
Küsnacht ZH, Ob. Heslibachstr.\r
Küsnacht ZH, Ränkestrasse\r
Küsnacht ZH, Gartenstrasse\r
Küsnacht ZH, Hallenbad\r
Küsnacht ZH, Zentrum\r
Küsnacht ZH, Reform. Kirche\r
Küsnacht ZH, Bergstrasse\r
Küsnacht ZH, Oberwacht\r
Küsnacht ZH, Goldbacherstrasse\r
Küsnacht ZH, Schiedhaldensteig\r
Küsnacht ZH, Boglerenstrasse\r
Küsnacht ZH\r
Küsnacht ZH, Allmend\r
Küsnacht ZH, Bahnhof\r
Küsnacht ZH, Hesligenstrasse\r
Küsnacht ZH, Schiedhaldenstr.\r
Küsnacht ZH (See)\r
Küsnacht ZH Heslibach\r
Küssnacht am Rigi, Oberdorf\r
Küssnacht am Rigi, Ebnet\r
Küssnacht am Rigi, Fänn Süd\r
Küssnacht am Rigi, Chliarniweg\r
Küssnacht am Rigi, Eichholtern\r
Küssnacht am Rigi, Hauptplatz\r
Küssnacht am Rigi, Breitfeld\r
Küssnacht am Rigi, Gloritobel\r
Küssnacht am Rigi, Ellbögli\r
Küssnacht am Rigi, Bahnhof\r
Küssnacht am Rigi, Honegg\r
Küssnacht am Rigi, Plaza\r
Küssnacht am Rigi, Rotenhofstr\r
Küssnacht am Rigi, Räbmatt\r
Küssnacht am Rigi\r
Küssnacht am Rigi, Seilbahn\r
Küssnacht am Rigi, Litzi\r
Küssnacht am Rigi, Fänn Nord\r
Küssnacht am Rigi (See)\r
Küssnacht am Rigi (Talstation)\r
Küttigen, Abzw. Giebel\r
Küttigen, Kreuz\r
Küttigen, Grossmatt\r
Küttigen, Fischbach\r
Küttigen, Post\r
Küttigen, Oberdorf\r
Küttigen, Benken-Klus\r
Küttigen, Kirchberg\r
Küttigkofen, Bismarck\r
Küttigkofen, Dorf\r
Küttigkofen, Schulhaus\r
Kyburg, Dorf\r
Kyburg, Ausserdorf\r
Kyburg, Ettenhusen\r
Kyburg, Billikon\r
Kyburg Bad\r
L'Abbaye, Groenroud\r
L'Abbaye, Crêt-Blanc\r
L'Abbaye, Petra Félix\r
L'Abbaye, Les Collondés\r
L'Abbaye, place du village\r
L'Abergement, village\r
L'Asse\r
L'Auberson, Vers-chez-Gueissaz\r
L'Auberson, Vers-le-Bois\r
L'Auberson, La Grand'Borne\r
L'Auberson, ch. du Carre\r
L'Auberson, ch. des Grangettes\r
L'Auberson, Vers-chz-ls-Jaques\r
L'Auberson, La Combe\r
L'Auberson, Les Sapins\r
L'Auberson, école\r
L'Ethérolla\r
L'Etivaz, Les Vieux Bains\r
L'Etivaz, four à pain\r
L'Etivaz, Le Bouraz\r
L'Etivaz, Devant-de-l'Etivaz\r
L'Etivaz, Bains-de-l'Etivaz\r
L'Etivaz, Maison de L'Etivaz\r
L'Hospitalet\r
L'Isle, Les Tigneuses\r
L'Isle, gare\r
L'Isle\r
L'Orient, Paul Golay\r
L'Orient, centre\r
L'Orient, Crêt\r
La Barboleuse (télécabine)\r
La Baume, chemin des Roches\r
La Baume\r
La Belotte (lac)\r
La Berra\r
La Brévine, Ferme Baillod\r
La Brévine, bif. Chobert\r
La Brévine, Prés Berthoud\r
La Brévine, bif. Petit Baillod\r
La Brévine, Bois-de-l'Halle\r
La Brévine, ch. du Baillod\r
La Brévine, poste\r
La Breya\r
La Brinaz\r
La Caffe, bif.\r
La Caffe, hameau\r
La Cauma\r
La Châ\r
La Châtagne, Crêt-la Châtagne\r
La Châtagne, Milieu des Prés\r
La Châtagne, Le Moulinet\r
La Châtagne, Combe-la Racine\r
La Châtagne, anc. poste\r
La Chaudanne-Les Moulins\r
La Chaux (Cossonay), Ittens\r
La Chaux (Cossonay), village\r
La Chaux VS\r
La Chaux VS (télésiège)\r
La Chaux-d'Abel\r
La Chaux-de-Bavon\r
La Chaux-de-F, Eplatures-Jaune\r
La Chaux-de-F, Parc de l'Ouest\r
La Chaux-de-F, Eplatures Nord\r
La Chaux-de-F, Paysans-Horlog.\r
La Chaux-de-F, Abraham-Robert\r
La Chaux-de-F, Armes-Réunies\r
La Chaux-de-F, Chapeau-Rablé\r
La Chaux-de-F, Beaux-Dimanches\r
La Chaux-de-F, Bibliothèque\r
La Chaux-de-F,Prés-de-la-Ronde\r
La Chaux-de-F, Bonne-Fontaine\r
La Chaux-de-F, Cernil-Antoine\r
La Chaux-de-F, Conservatoire\r
La Chaux-de-F, Chemin blanc\r
La Chaux-de-F, Combe-à-l'Ours\r
La Chaux-de-F, Lycée-Blaise-C\r
La Chaux-de-F, Blaise-Cendrars\r
La Chaux-de-F, Jacob-Brandt\r
La Chaux-de-F, Villa Turque\r
La Chaux-de-F, Perret-Gentil\r
La Chaux-de-F, F.-Courvoisier\r
La Chaux-de-F, L'Eplattenier\r
La Chaux-de-F, La Joux-Perret\r
La Chaux-de-F, Tricentenaire\r
La Chaux-de-F, Point-du-jour\r
La Chaux-de-F,Stavay-Mollondin\r
La Chaux-de-F, Parc des sports\r
La Chaux-de-F, Ptes Crosettes\r
La Chaux-de-F, Allée du Quartz\r
La Chaux-de-Fonds, Entilles\r
La Chaux-de-Fonds, Gr Fontaine\r
La Chaux-de-Fonds, Espacité\r
La Chaux-de-Fonds,Musée paysan\r
La Chaux-de-Fonds, Frameries\r
La Chaux-de-Fonds, Breguet\r
La Chaux-de-Fonds, Grillon\r
La Chaux-de-Fonds, Tourelles\r
La Chaux-de-Fonds, Paix\r
La Chaux-de-Fonds, Forges\r
La Chaux-de-Fonds, Ormes\r
La Chaux-de-Fonds, Electrices\r
La Chaux-de-Fonds, 1er août\r
La Chaux-de-Fonds, Versoix\r
La Chaux-de-Fonds, Ronde\r
La Chaux-de-Fonds, Cerisier\r
La Chaux-de-Fonds, Grand-Pont\r
La Chaux-de-Fonds, Combettes\r
La Chaux-de-Fonds, Arc-en-Ciel\r
La Chaux-de-Fonds, Signal\r
La Chaux-de-Fonds, Helvétie\r
La Chaux-de-Fonds, Monbrillant\r
La Chaux-de-Fonds, Bougillons\r
La Chaux-de-Fonds, 22 Cantons\r
La Chaux-de-Fonds, Chapelle\r
La Chaux-de-Fonds, Musées\r
La Chaux-de-Fonds, Chasseral\r
La Chaux-de-Fonds, Patinoire\r
La Chaux-de-Fonds, Foulets\r
La Chaux-de-Fonds, Charrière\r
La Chaux-de-Fonds, Marais\r
La Chaux-de-Fonds, Arêtes\r
La Chaux-de-Fonds, Parc Sports\r
La Chaux-de-Fonds, Numaga\r
La Chaux-de-Fonds, Ami-Girard\r
La Chaux-de-Fonds, Abeille\r
La Chaux-de-Fonds, Cluse\r
La Chaux-de-Fonds, Prévoyance\r
La Chaux-de-Fonds, Sombaille\r
La Chaux-de-Fonds, Crêtets\r
La Chaux-de-Fonds, M St-Hélier\r
La Chaux-de-Fonds, Malakoff\r
La Chaux-de-Fonds,Combe-Perret\r
La Chaux-de-Fonds, Notre-Dame\r
La Chaux-de-Fonds, Tourbillon\r
La Chaux-de-Fonds, Recorne\r
La Chaux-de-Fonds, Pouillerel\r
La Chaux-de-Fonds, Gentianes\r
La Chaux-de-Fonds, Citadelle\r
La Chaux-de-Fonds, Promenade\r
La Chaux-de-Fonds, collège\r
La Chaux-de-Fonds, Pâquerette\r
La Chaux-de-Fonds, Hôpital\r
La Chaux-de-Fonds, Prés-Verts\r
La Chaux-de-Fonds, MUZOO\r
La Chaux-de-Fonds\r
La Chaux-de-Fonds, bif. Bul-Va\r
La Chaux-de-Fonds, gare\r
La Chaux-de-Fonds, Swin Golf\r
La Chaux-de-Fonds,Orée-du-Bois\r
La Chaux-de-Fonds, Progrès\r
La Chaux-de-Fonds, Morgarten\r
La Chaux-de-Fonds, Moulins\r
La Chaux-de-Fonds, Bassets-Cr\r
La Chaux-de-Fonds, Brenetets\r
La Chaux-de-Fonds, Succès\r
La Chaux-de-Fonds, Tête-de-Ran\r
La Chaux-de-Fonds, Nord\r
La Chaux-de-Fonds, Fusion\r
La Chaux-de-Fonds, Plaisance\r
La Chaux-de-Fonds, Bel-Air\r
La Chaux-de-Fonds, Théâtre\r
La Chaux-de-Fonds, Gibraltar\r
La Chaux-de-Fonds, Balancier\r
La Chaux-de-Fonds, Marché\r
La Chaux-de-Fonds, Etang\r
La Chaux-de-Fonds, Pont\r
La Chaux-de-Fonds, Etoile\r
La Chaux-de-Fonds, Esplanade\r
La Chaux-de-Fonds Les Forges\r
La Chaux-de-Fonds-Est\r
La Chaux-de-Fonds-Grenier\r
La Chaux-de-Ste-Croix\r
La Chaux-des-Breuleux\r
La Chaux-du-Milieu, Clef-d'Or\r
La Chaux-du-Milieu, Calame\r
La Chaux-du-Milieu, La Gr-Joux\r
La Chaux-du-Milieu, Les Jolys\r
La Chaux-du-Milieu, La Forge\r
La Chaux-du-Milieu, P-Chaux\r
La Chaux-du-Milieu, village\r
La Chèvrerie-Monterêt\r
La Chiésaz\r
La Cibourg\r
La Cibourg, village\r
La Clairière\r
La Comballaz, Le Pilet\r
La Comballaz, L'Ortier\r
La Comballaz, centre\r
La Comballaz, Les Voëttes\r
La Combaz VD (Romairon)\r
La Combe\r
La Combe (Mont Noble)\r
La Conversion, gare\r
La Conversion\r
La Corbatière\r
La Corbaz, ancienne école\r
La Côte-aux-Fées, Bolles-Vent\r
La Côte-aux-Fées, poste\r
La Côte-aux-Fées, Les Tattets\r
La Côte-aux-Fées, Les Leuba\r
La Côte-aux-Fées,Les Bourquins\r
La Côte-aux-Fées, Bellevue\r
La Côte-aux-Fées, Entre-Bolles\r
La Côte-aux-Fées, garage\r
La Coudre (L'Isle), village\r
La Coudre (L'Isle),bas village\r
La Cour\r
La Creusaz\r
La Creusaz (Le Vélard)\r
La Cure\r
La Dôle\r
La Douay, village\r
La Douay\r
La Faverge\r
La Ferrière, bif. Chaux-d'Abel\r
La Ferrière, gare\r
La Ferrière\r
La Foilleuse (Morgins)\r
La Foilleuse (Segneux)\r
La Fontaine, hameau\r
La Forclaz VD, village\r
La Forclaz VD, Les Granges\r
La Forclaz VD, Le Bouillet\r
La Forclaz VD, La Trappaz\r
La Forclaz VD, Vougny-Paluex\r
La Forclaz VS\r
La Fouly VS\r
La Fouly VS (télésiège)\r
La Gaité (Champtauroz)\r
La Garde (Sembrancher)\r
La Givrine\r
La Gottaz\r
La Heutte, Boccalino\r
La Heutte\r
La Jorasse\r
La Jorette\r
La Joux FR, village\r
La Joux FR, Scierie\r
La Large-Journée\r
La Lécherette,cont.de la Borne\r
La Lécherette, village\r
La Luette\r
La Maison-Monsieur, bif.\r
La Mauguettaz, croisée\r
La Médettaz\r
La Médettaz, camping\r
La Meina (Lana)\r
La Mothe, haut-du-village\r
La Mothe, Fontannet\r
La Motta, Dogana\r
La Motte\r
La Neirigue, village\r
La Neuveville, Ruis de Vaux\r
La Neuveville, collège\r
La Neuveville, Les Moulins\r
La Neuveville\r
La Neuveville, Château\r
La Neuveville, La Main\r
La Neuveville, poste\r
La Neuveville (bateau)\r
La Pasay\r
La Perche\r
La Place (Ayent), bif. Villa\r
La Place (Ayent), centre\r
La Place (Ayent), Rougenan\r
La Plaine, Le Moulin\r
La Plaine\r
La Plaine, La Donzelle\r
La Plaine, école\r
La Plaine, douane\r
La Plaine, gare\r
La Praz, La Scie\r
La Praz, Maison de commune\r
La Presta Mines d'asphalte\r
La Punt, Krone\r
La Punt, Alp Alesch\r
La Punt, Parkplatz Es-cha\r
La Punt Chamues-ch\r
La Punt Chamues-ch, Bahnhof\r
La Râpe VD\r
La Rippe, village\r
La Rippe, Tranchepied\r
La Robella (télésiège)\r
La Roche FR, La Berra\r
La Roche FR, Le Zible\r
La Roche FR, Le Stoutz\r
La Roche FR, Montsoflo\r
La Roche FR, Villaret\r
La Roche FR, école\r
La Roche FR, Serbache\r
La Roche FR, village\r
La Roche FR Le Brand\r
La Rogivue\r
La Rösa\r
La Rougève, village\r
La Roulaz\r
La Ruaz\r
La Sage, Taillau\r
La Sage, Borza\r
La Sage, Plan de la Sage\r
La Sage, Prafleuri\r
La Sage, Col-de-la-Forclaz\r
La Sage, Villaz\r
La Sage, Plan de Boë\r
La Sage, Sépey\r
La Sage, village\r
La Sagne\r
La Sagne-Eglise\r
La Sarraz, piscine\r
La Sarraz, collège Guébettes\r
La Sarraz\r
La Sarraz, centre\r
La Sarraz, gare\r
La Sarvaz\r
La Sauge (bateau)\r
La Seiloz, L'Amônaz\r
La Seiloz\r
La Siala\r
La Tène\r
La Tine\r
La Toula\r
La Tour\r
La Tour-de-Peilz,rte de Blonay\r
La Tour-de-Peilz, Vallon\r
La Tour-de-Peilz, gymnase\r
La Tour-de-Peilz,Mousquetaires\r
La Tour-de-Peilz\r
La Tour-de-Peilz, Pérouge\r
La Tour-de-Peilz, Gregnolet\r
La Tour-de-Peilz, Sichoz\r
La Tour-de-Peilz, Oyonne\r
La Tour-de-Peilz, Vignes\r
La Tour-de-Peilz, Bel-Air\r
La Tour-de-Peilz, Faraz\r
La Tour-de-Peilz, Baumes\r
La Tour-de-Peilz, La Becque\r
La Tour-de-Peilz,Crausaz/Doges\r
La Tour-de-Peilz,av. des Alpes\r
La Tour-de-Peilz,Portail-Blanc\r
La Tour-de-Peilz, Burier\r
La Tour-de-Peilz, Vassin\r
La Tour-de-Peilz, centre\r
La Tour-de-Peilz, Gérénaz\r
La Tour-de-Peilz, rte Chailly\r
La Tour-de-Peilz, Ile-Heureuse\r
La Tour-de-Peilz, Bulesses\r
La Tour-de-Peilz, Brécheresse\r
La Tour-de-Peilz, Perrausaz\r
La Tour-de-Peilz, Maladaire\r
La Tour-de-Pz,Entre-Deux-Crêts\r
La Tour-de-Trême, Centre\r
La Tour-de-Trême, St-Michel\r
La Tour-de-Trême, Le Pra\r
La Tour-de-Trême, Le Closalet\r
La Tour-de-Trême, Ronclina\r
La Tour-de-Trême\r
La Tour-de-Trême Ronclina\r
La Tourne, Col\r
La Tourne, La Mauvaise-Combe\r
La Tsât\r
La Tzoumaz, Les Crus\r
La Tzoumaz, Larzine\r
La Tzoumaz, Som de Proz\r
La Tzoumaz, Les Ravires\r
La Tzoumaz, Vouatère Parc\r
La Tzoumaz, Villy\r
La Tzoumaz, Domus\r
La Tzoumaz, Place de l'Ours\r
La Tzoumaz, centre\r
La Tzoumaz, Le Belochet\r
La Tzoumaz, Les Eriez\r
La Tzoumaz, Villy Centre\r
La Tzoumaz, Nevada\r
La Tzoumaz, Pramin\r
La Tzoumaz, centre Patinoire\r
La Tzoumaz, Les Esserts\r
La Tzoumaz, Baby Lift\r
La Tzoumaz, La Chapelle\r
La Tzoumaz, L'Eterpey\r
La Tzoumaz, Vouatère\r
La Tzoumaz, Taillay\r
La Tzoumaz, Maison de la Forêt\r
La Tzoumaz, télécabine\r
La Tzoumaz, Les Combes\r
La Tzoumaz, Rosselin (bif.)\r
La Tzoumaz, Ariana\r
La Tzoumaz, Prés Laurent\r
La Tzoumaz (téléc. Savoleyres)\r
La Tzoumaz (télés. Etablons)\r
La Vachette\r
La Valsainte, Couvent\r
La Valsainte, anc. poste\r
La Vernaz VS\r
La Vernaz VS, d'en-Haut\r
La Verrerie\r
La Verrerie, village\r
La Verrerie, gare\r
La Videmanette\r
La Vouarda\r
La Vounaise\r
La Vraconnaz, Les Rochettes\r
La Vraconnaz, bif. nord\r
La Vraconnaz, Noirvaux-Dessus\r
La Vuarpillière\r
La Vue-des-Alpes, Métairie\r
La Vue-des-Alpes, Crêt-Meuron\r
La Vue-des-Alpes, Tête-de-Ran\r
La Vue-des-Alpes, Les Loges\r
Laax GR, Marcau\r
Laax GR, Demvitg\r
Laax GR, Val Vau\r
Laax GR, Alp Nagens\r
Laax GR, Cons\r
Laax GR, posta\r
Laax GR, Fau\r
Laax GR, Via Plauna\r
Laax GR, Brutg\r
Laax GR, See/Lag\r
Laax GR, Abzw. Plaun\r
Laax GR, Acla\r
Laax GR, Oasa\r
Laax GR, Straussennest\r
Laax GR, Via Nagens\r
Laax GR, Caltgera\r
Laax GR, Rancho\r
Laax GR, Bergbahnen\r
Laax GR, Nagens\r
Laax GR, Salums sura\r
Laax GR, Staderas\r
Laax Murschetg (Talstation)\r
Lac d'Aï (Berneuse)\r
Lac d'Aï (Chaux-de-Mont)\r
Lac d'Emosson\r
Lac d'Emosson Minifunic\r
Lac-des-Dix (téléphérique)\r
Lac-des-Vaux\r
Lac-Noir (Chaux-Ronde)\r
Lac-Noir (Petit-Chamossaire)\r
Lachen SZ, Rotbach\r
Lachen SZ, Bahnhof\r
Lachen SZ, Kirche\r
Lachen SZ, Eschenweg\r
Lachen SZ, Schlössliweg\r
Lachen SZ, Kapelle\r
Lachen SZ\r
Lachen SZ, Obersee-Center\r
Lachen SZ, Spital\r
Lachen SZ, Spreite\r
Lachen SZ (See)\r
Laconnex, Mollaz\r
Laconnex, Stand de tir\r
Laconnex, village\r
Laconnex, Chemin de la Douane\r
Lädeli\r
Ladir, vitg\r
Ladir, Drascla\r
Ladstafel\r
Lago di Carì\r
Lago di Luzzone\r
Lago Tremorgio\r
Lai Alv (Gendusas)\r
Lajoux JU, école\r
Lajoux JU, La Loge\r
Lajoux JU, poste\r
Lajoux JU, Le Bois des Joux\r
Lajoux JU, Le Paigre\r
Lajoux JU, laiterie\r
Lajoux JU, Cras-des-Mottes\r
Lajoux JU, Les Vacheries\r
Lalden, Dorf\r
Lalden\r
Lally\r
Lamboing, Scierie\r
Lamboing, village\r
Lammi\r
Lamone, Ostarietta V.Cantonale\r
Lamone, Ostarietta\r
Lamone, Paese\r
Lamone, Posta Vecchia\r
Lamone-Cadempino, Stazione\r
Lamone-Cadempino, Posta/Staz.\r
Lamone-Cadempino\r
Lampenberg, Dorf\r
Lampenberg, Bündtenweg\r
Lampenberg-Ramlinsburg,Station\r
Lamperswil TG, Illharterstr.\r
Lana (télésiège)\r
Lancy-Bachet, gare\r
Lancy-Bachet\r
Lancy-Pont-Rouge\r
Lancy-Pont-Rouge, gare\r
Lancy-Pont-Rouge, gare/Etoile\r
Landarenca\r
Landecy, La Mûre\r
Landeyeux\r
Landiswil, Bärisbach\r
Landiswil, Dorf\r
Landiswil, Hinteregg\r
Landquart, Neuhof\r
Landquart, Marktplatz\r
Landquart, Primarschule\r
Landquart\r
Landquart, Im Lux\r
Landquart, Bahnhof\r
Landquart, Schulhaus Ried\r
Landquart, Fabriken\r
Landquart, Outlet Nord\r
Landquart, Sonnmatt\r
Landquart, Forum Landquart\r
Landquart, Ringstrasse\r
Landquart, Post\r
Landquart Ried\r
Landschlacht\r
Landschlacht, Schulstrasse\r
Landschlacht, Blindenzentrum\r
Langenbruck, Unterdorf\r
Langenbruck, Dürrenberg\r
Langenbruck, Spittel\r
Langenbruck, Passhöhe\r
Langenbruck, Dorf\r
Längenbühl, Bach\r
Längenbühl, Grizzlibär\r
Längenbühl, Weiermatt\r
Langendorf, Ladendorf\r
Langendorf, Chutz\r
Langendorf, Sunnerain\r
Langendorf, Bellacherstrasse\r
Langendorf, Friedhof\r
Langendorf\r
Langenloh\r
Langenthal, Industrie Nord\r
Langenthal, Spital\r
Langenthal, Sängeli\r
Langenthal, Passhöchi\r
Langenthal, Elzmatte\r
Langenthal, Hardau\r
Langenthal, Gaswerkstrasse\r
Langenthal, Waldhof\r
Langenthal, Dreilinden\r
Langenthal, Dennli\r
Langenthal, Bahnhof\r
Langenthal\r
Langenthal, Bäregg\r
Langenthal, Schwimmbad\r
Langenthal, Zelgligasse\r
Langenthal, Schulen Hard\r
Langenthal, Zelgli\r
Langenthal, Neuhüsli\r
Langenthal, Lindenhof\r
Langenthal, Blumenstrasse\r
Langenthal, Wiesenstrasse\r
Langenthal, Schoren-Ochsen\r
Langenthal, Mittelstrasse\r
Langenthal, Neuhof\r
Langenthal, Schoren-Eisbahn\r
Langenthal, Tell/Kantonalbank\r
Langenthal, Bleichestrasse\r
Langenthal, Rössli\r
Langenthal, Löwenplatz\r
Langenthal, Schorenstrasse\r
Langenthal, Rumimatte\r
Langenthal Gaswerk\r
Langenthal Industrie Nord\r
Langenthal Süd\r
Langenthal Süd, Bahnhof\r
Längfluh\r
Längfluh (Bergstation)\r
Längfluh (Talstation)\r
Langis\r
Langnau a.A.,Schwerzi-Wildpark\r
Langnau a.A., Albispasshöhe\r
Langnau am Albis, Hehlstrasse\r
Langnau am Albis, Altersheim\r
Langnau am Albis, Unterrengg\r
Langnau am Albis, Langmoos\r
Langnau am Albis, Hinteralbis\r
Langnau am Albis, Mittelalbis\r
Langnau am Albis, Dorf\r
Langnau am Albis, Unteralbis\r
Langnau am Albis,Oberrenggstr.\r
Langnau bei Reiden, Oberdorf\r
Langnau bei Reiden, Feld\r
Langnau bei Reiden, Lupfen\r
Langnau bei Reiden, Käserei\r
Langnau i.E., Sonnegg\r
Langnau i.E., Hirschenplatz\r
Langnau i.E., Hübeli\r
Langnau i.E., Sonnweg\r
Langnau i.E., Napfstrasse\r
Langnau i.E., Hotel Emmental\r
Langnau i.E., Lindenstrasse\r
Langnau i.E., unt. Beichlenstr\r
Langnau i.E., Sonnenfeld\r
Langnau i.E., Fansrütistrasse\r
Langnau i.E., Friedhof\r
Langnau i.E., Ilfis Center\r
Langnau i.E., Hinterdorf Mühle\r
Langnau i.E., Bernstrasse\r
Langnau i.E., Bärenplatz\r
Langnau i.E., Oberfeldstrasse\r
Langnau i.E.\r
Langnau i.E., Ilfis\r
Langnau i.E., Bahnhof\r
Langnau i.E., Marktstrasse\r
Langnau i.E., Hasenknubel\r
Langnau i.E., Kreuzstrasse\r
Langnau i.E., Knieplatz\r
Langnau i.E., Sonnenarena\r
Langnau i.E., Gerbeplatz\r
Langnau i.E., Kehr\r
Langnau i.E., Hüselmatte\r
Langnau i.E., Berufsschule\r
Langnau-Gattikon, Bahnhof\r
Langnau-Gattikon\r
Langrickenbach, Waldhof\r
Langrickenbach, Neuhof\r
Langrickenbach, Dorf\r
Langrickenbach, Rutishausen\r
Langwies, Abzw. Sapün\r
Langwies, Abzw. Schluocht\r
Langwies, Abzw. Bahnhof\r
Langwies GR\r
Langwies ZH\r
Langwiesen\r
Lanterswil, Schulhaus\r
Lanthen, Käserei\r
Lanthen, Abzw.\r
Lantsch/Lenz, Biathlon Arena\r
Lantsch/Lenz, St. Cassian\r
Lantsch/Lenz, Vischnanca\r
Lantsch/Lenz, Barbatschauns\r
Lantsch/Lenz, Scola\r
Lantsch/Lenz, Sudem Vischnanca\r
Lantsch/Lenz, Sozas\r
Lanzenhäusern, Aekenmatt Dorf\r
Lanzenhäusern\r
Lanzenhäusern, Bahnhof\r
Lanzenneunforn, Schweikhof\r
Lanzenneunforn, Dorf\r
Larescia\r
Larnags\r
Laschadura\r
Latsch\r
Lätti, Hauptstrasse\r
Lattigen bei Spiez\r
Lattrigen, Bahnhof\r
Lattrigen\r
Lauberhorn\r
Lauberhornschulter\r
Laucherenstöckli\r
Lauchernalp\r
Lauenen b. Gstaad, Stalden\r
Lauenen b. Gstaad, Bochte\r
Lauenen b. Gstaad, Rohrbrücke\r
Lauenen b. Gstaad, Rebwerk\r
Lauenen b. Gstaad, Enge\r
Lauenen b. Gstaad, Bruch\r
Lauenen b. Gstaad, Fängli\r
Lauenen b. Gstaad, Unterschüpf\r
Lauenen b. Gstaad, Moos\r
Lauenen b. Gstaad, Geltenhorn\r
Lauenen b. Gstaad,Under Tungel\r
Lauenensee\r
Lauerz, Dorf\r
Lauerz, Mühle\r
Lauerz, Seegütli\r
Lauerz, Otten\r
Lauerz, Schwanau\r
Laufböden (Bergstation)\r
Läufelfingen, Dorf\r
Läufelfingen, Herrenmatt\r
Läufelfingen, Bahnhof\r
Läufelfingen\r
Laufen, Katholische Kirche\r
Laufen, Bahnhof\r
Laufen\r
Laufen, Wahlenstrasse\r
Laufen, Delsbergerstrasse\r
Laufen, Bromberg\r
Laufen, Ricola/Spilag\r
Laufen, Wandplattenfabrik\r
Laufen, Stedtli\r
Laufenburg, Blauen\r
Laufenburg, Bahnhof\r
Laufenburg, Regionalspital\r
Laufenburg\r
Laufenburg, Werkstrasse\r
Laufenburg, Kreisschule\r
Lauffohr, Langmatt\r
Lauffohr, Platte\r
Lauffohr, Sommerhaldenstrasse\r
Lauffohr, Dorf\r
Laupen BE, Schützenstrasse\r
Laupen BE, Poly-Areal\r
Laupen BE, Laupenau\r
Laupen BE\r
Laupen BE, Bärenplatz\r
Laupen BE, Bahnhof\r
Laupen BE, Betagtenzentrum\r
Laupen ZH, Hubwies\r
Laupen ZH, Mürtschenstrasse\r
Laupen ZH, Hauptstrasse\r
Laupen ZH, Schulhaus\r
Laupersdorf, Alpenblick\r
Laupersdorf, Stierenberg\r
Laupersdorf, Dorf\r
Laupersdorf, Einschnitt\r
Laupersdorf, Vogelsmatt\r
Laupersdorf, Bremgarten\r
Laupersdorf, Höngen\r
Lausanne, Chalet à Matthey\r
Lausanne, Vers-chez-les-Blanc\r
Lausanne, Béthusy\r
Lausanne, Devin\r
Lausanne, Délices\r
Lausanne, Mémise\r
Lausanne, Presbytère\r
Lausanne, Molliettes\r
Lausanne, Montchoisi\r
Lausanne, Mont-Blanc\r
Lausanne, Montolieu\r
Lausanne, Trabandan\r
Lausanne, Montoie\r
Lausanne, Parc Rivier\r
Lausanne, Vallonnette\r
Lausanne, avenue du Léman\r
Lausanne, Bergières\r
Lausanne, Bonne-Espérance\r
Lausanne, Boissonnet\r
Lausanne, Verdeil\r
Lausanne, Virgile-Rossel\r
Lausanne, Bessières\r
Lausanne, Chalet-à-Gobet/Jorat\r
Lausanne, Riponne-M. Béjart\r
Lausanne, Champ-Rond\r
Lausanne, chemin du Cap\r
Lausanne, Dranse\r
Lausanne, Elysée\r
Lausanne, Eglantine\r
Lausanne, Grand Vennes\r
Lausanne, Cojonnex/EHL\r
Lausanne, Jurigoz\r
Lausanne, Cèdres\r
Lausanne, Figuiers\r
Lausanne, Cigale\r
Lausanne, CHUV\r
Lausanne, Chocolatière\r
Lausanne, Grey\r
Lausanne, Epinettes\r
Lausanne, Bossons\r
Lausanne, Libellules\r
Lausanne, Les Chavannes\r
Lausanne, Denantou\r
Lausanne, Chauderon-Ale\r
Lausanne, Languedoc\r
Lausanne, Mauvernay\r
Lausanne, Mont d'Or\r
Lausanne, Pavement\r
Lausanne, Rasude\r
Lausanne, Signal\r
Lausanne, St-Paul\r
Lausanne, Mousquines\r
Lausanne, St-Roch\r
Lausanne, Musée Olympique\r
Lausanne, Petit Château\r
Lausanne, Alpes\r
Lausanne, Allières/CHUV\r
Lausanne, Abeilles\r
Lausanne, Benj. Constant\r
Lausanne, Blécherette\r
Lausanne, Beau-Rivage\r
Lausanne, jardin botanique\r
Lausanne, Beaulieu\r
Lausanne, Vieux-Moulin\r
Lausanne, Vert-Bois/EHL\r
Lausanne, Sallaz\r
Lausanne, Provence\r
Lausanne, Hermitage\r
Lausanne, Couchirard\r
Lausanne, Cottages\r
Lausanne, Jordils\r
Lausanne, Beaulieu-Jomini\r
Lausanne, Cour\r
Lausanne, Rovéréaz\r
Lausanne, Ecole des Métiers\r
Lausanne, Valency\r
Lausanne, Pont-de-Chailly\r
Lausanne, Cécil\r
Lausanne, Chauderon\r
Lausanne, Rouvraie\r
Lausanne, Sablons\r
Lausanne, Piécettes\r
Lausanne, St-Etienne\r
Lausanne, Motte\r
Lausanne, Tivoli\r
Lausanne, Provence nord\r
Lausanne, Bel-Air\r
Lausanne, Bois de Vaux\r
Lausanne, Victor-Ruffy\r
Lausanne, Vulliemin\r
Lausanne, Vennes\r
Lausanne, Cascades\r
Lausanne, Villard\r
Lausanne, Ours\r
Lausanne, Georgette\r
Lausanne, Désert\r
Lausanne, gare\r
Lausanne, Fourmi\r
Lausanne, Parc Vélodrome\r
Lausanne, Mirabeau\r
Lausanne, Pierrefleur\r
Lausanne, Pont Marc Dufour\r
Lausanne, Pont Chauderon\r
Lausanne, Stade Olympique\r
Lausanne, Ouchy-Olympique\r
Lausanne, Valmont\r
Lausanne, Provence sud\r
Lausanne, Belvédère\r
Lausanne, Batelière\r
Lausanne, Barre\r
Lausanne, Béthanie\r
Lausanne, Vigie\r
Lausanne, En Marin\r
Lausanne, Tunnel\r
Lausanne, Bourdonnette\r
Lausanne, Maladière-Lac\r
Lausanne, Maladière-Figuiers\r
Lausanne, Bellevaux\r
Lausanne,Vallée de la Jeunesse\r
Lausanne, Foyer\r
Lausanne, Montbenon\r
Lausanne, St-François\r
Lausanne, Chailly-Village\r
Lausanne, Bourdonnette nord\r
Lausanne, Tour Haldimand-Lac\r
Lausanne, Montétan\r
Lausanne, Chalet des Enfants\r
Lausanne, Vulliette\r
Lausanne, Chalet-à-Gobet\r
Lausanne, Chandolin\r
Lausanne, Chevreuils\r
Lausanne, Grangette\r
Lausanne, Grande-Borde\r
Lausanne, casernes\r
Lausanne, Haute Combe\r
Lausanne, Lac Sauvabelin\r
Lausanne, Forêt\r
Lausanne, Croix d'Ouchy\r
Lausanne, Fontenay\r
Lausanne, Craivavers\r
Lausanne, Floreyres\r
Lausanne, Lisière\r
Lausanne, Maladière\r
Lausanne, Pêcheurs\r
Lausanne, Mon Repos\r
Lausanne, Riant-Cour\r
Lausanne, Valentin\r
Lausanne, Recordon\r
Lausanne, Mont-Fleuri\r
Lausanne, Rozavère\r
Lausanne, Praz-Berthoud\r
Lausanne, Ste-Catherine\r
Lausanne, Prélaz\r
Lausanne, Théâtre de Vidy\r
Lausanne, Praz-Séchaud\r
Lausanne, Praz-Collet\r
Lausanne, Oiseaux\r
Lausanne, Rapille\r
Lausanne, Bellerive\r
Lausanne, Aubépines\r
Lausanne, Beau-Site\r
Lausanne, Boisy\r
Lausanne, Bois-Gentil\r
Lausanne, Vinet\r
Lausanne, Parc Bourget\r
Lausanne, Flon\r
Lausanne, Druey\r
Lausanne, Entre-Bois\r
Lausanne, Montelly\r
Lausanne, Vidy-Port\r
Lausanne, EPSIC\r
Lausanne, Malley\r
Lausanne, César-Roux\r
Lausanne, Eugène-Rambert\r
Lausanne, Druey-Collège\r
Lausanne, Clochatte\r
Lausanne, Coudrette\r
Lausanne, Grancy\r
Lausanne, Faverges\r
Lausanne, Boveresses\r
Lausanne, Fauconnières\r
Lausanne, Closelet\r
Lausanne, Boston\r
Lausanne, Grattapaille\r
Lausanne, Dapples\r
Lausanne, Chalet-Fontaine\r
Lausanne, Stade de Coubertin\r
Lausanne, Siège du CIO\r
Lausanne, Parc Musée Olympique\r
Lausanne, sports UNIL-EPFL\r
Lausanne, Gymnase de Beaulieu\r
Lausanne, Hôpital ophtalmique\r
Lausanne, Halle de Sébeillon\r
Lausanne, Port-Franc\r
Lausanne\r
Lausanne-Chauderon\r
Lausanne-Flon\r
Lausanne-Ouchy (lac)\r
Lausen, Ziegelmatt\r
Lausen, Furlen\r
Lausen, Bahnhof Nord\r
Lausen, Ronda\r
Lausen, Kirchstrasse\r
Lausen, Gemeindeverwaltung\r
Lausen, Stutz\r
Lausen, Furlenboden\r
Lausen, Bettleten\r
Lausen\r
Lausen, Bahnhof Süd\r
Lausen, Mülizelg\r
Lausen, Langmatt\r
Lauterbrunnen, Ey\r
Lauterbrunnen, Kirche\r
Lauterbrunnen\r
Lauterbrunnen,Camping Jungfrau\r
Lauterbrunnen, Bahnhof\r
Lauterbrunnen, Lochbrücke\r
Lauterbrunnen, Heliport\r
Lauterbrunnen, Sandweidli\r
Lauterbrunnen, Schützenbach\r
Lauterbrunnen, Dorf\r
Lauterbrunnen (Seilbahn)\r
Lauwil, Dorf\r
Lavadinas\r
Lavanthier\r
Lavertezzo, Aquino\r
Lavertezzo, Ai Poss\r
Lavertezzo, Monda\r
Lavertezzo, Paese\r
Lavey, Front Bastionné\r
Lavey-les-Bains, place\r
Lavey-les-Bains, Et. Thermal\r
Lavey-Village, centre\r
Lavey-Village, Prés Râpets\r
Laveygrat\r
Lavigny, croisée de St-Livres\r
Lavigny, hôpital\r
Lavigny, café\r
Lavin\r
Lavin, staziun\r
Lavorgo\r
Lavorgo, Stazione\r
Lax, Bahnhof\r
Lax\r
Le Bas-du-Cerneux\r
Le Bâté\r
Le Bémont JU\r
Le Bémont JU, village\r
Le Bémont JU, Grand-Creux\r
Le Boéchet\r
Le Brassus, La Combe\r
Le Brassus, Piguet-Dessus\r
Le Brassus, place de la Lande\r
Le Brassus, Le Campe\r
Le Brassus, Combe des Amburnex\r
Le Brassus, Marchairuz\r
Le Brassus,ancienne imprimerie\r
Le Brassus, Tribillet\r
Le Brassus, Bas-du-Chenit\r
Le Brassus, gare\r
Le Brassus\r
Le Brocard\r
Le Brouillet, bif. les Jordan\r
Le Brouillet, Chez-Petoud\r
Le Brouillet, anc. poste\r
Le Brouillet, Bémont\r
Le Bry, Geneivroz\r
Le Bry, village\r
Le Cachot, Petit-Cachot\r
Le Cachot, Fromagerie\r
Le Cachot, Le Bas-du-Crêt\r
Le Cachot, carrefour\r
Le Cachot, Pt-Cachot de bise\r
Le Cachot, Cachot de Vent\r
Le Cergneux, bif.\r
Le Cergneux, hameau\r
Le Cerneux-Péquignot, M-Rochat\r
Le Cerneux-Péquignot, village\r
Le Cerneux-Péquignot, M-Lidor\r
Le Cerneux-Péquignot, Le Creux\r
Le Cerneux-Péquignot,M-Baillod\r
Le Cerneux-Péquignot, Etages\r
Le Cernil NE, restaurant\r
Le Châble TV\r
Le Châble VS, gare\r
Le Châble VS, Le Tarpin\r
Le Châble VS, rte Montagnier\r
Le Châble VS, Le Sapey\r
Le Châble VS, Maison Enfance\r
Le Châble VS, Montagnier\r
Le Châble VS,Fontenelle-Dessou\r
Le Châble VS, centre scolaire\r
Le Châble VS, place communale\r
Le Châble VS, La Condemine\r
Le Châble VS\r
Le Chapelet\r
Le Châtelard FR, Sâles\r
Le Châtelard FR, Pra Mottau\r
Le Châtelard FR, La Perreire\r
Le Châtelard FR, La Molleyre\r
Le Châtelard FR, village\r
Le Châtelard VS, village\r
Le Châtelard VS\r
Le Châtelard VS, gare\r
Le Châtelard VS, Frontière\r
Le Châtelard VS Funiculaire\r
Le Châtelard-d'en-Haut\r
Le Châtelard-Frontière\r
Le Chésal\r
Le Clou/Les Granges\r
Le Crêt-du-Locle,rte cantonale\r
Le Crêt-du-Locle\r
Le Creux-des-Biches\r
Le Day\r
Le Day, gare\r
Le Fays, bif.\r
Le Fays, village\r
Le Flon, village\r
Le Fuet, carrefour\r
Le Fuet, poste\r
Le Fuet, Chemin de la Bottière\r
Le Grand-St-Bernard, Hospice\r
Le Landeron, Montet-Dessus\r
Le Landeron, gare\r
Le Landeron, centre\r
Le Landeron, Bellevue\r
Le Landeron\r
Le Landeron, zone industrielle\r
Le Landeron, Vieille-Ville\r
Le Landeron débarcadère\r
Le Lieu\r
Le Lieu Roche Fendue (lac)\r
Le Locle, école des Girardet\r
Le Locle, Chemin-Blanc\r
Le Locle, La Combe-Jeanneret\r
Le Locle, Hôtel-de-Ville\r
Le Locle, Verger Est\r
Le Locle, Verger Nord\r
Le Locle, Tennis\r
Le Locle, Centenaire\r
Le Locle, Fiottets\r
Le Locle, Corbusier\r
Le Locle, Avenir\r
Le Locle, Georges-Perrenoud\r
Le Locle, collège\r
Le Locle, Tertre\r
Le Locle, Marie-Anne Calame\r
Le Locle, Croisette\r
Le Locle, Gérardmer\r
Le Locle, douane marchandises\r
Le Locle, Technicum\r
Le Locle, Les Replattes\r
Le Locle, Tilleuls\r
Le Locle, Raya\r
Le Locle, Abattes\r
Le Locle, Fritillaires\r
Le Locle, Jambe-Ducommun\r
Le Locle, cimetière\r
Le Locle, Haut-du-Quartier\r
Le Locle, Billodes\r
Le Locle, Cardamines\r
Le Locle, Hôpital\r
Le Locle, Combe-Girard\r
Le Locle, Piste Vita\r
Le Locle, Château des Monts\r
Le Locle, Ticino\r
Le Locle, Petits-Monts\r
Le Locle, Auguste-Lambelet\r
Le Locle, Côte de la Jaluse\r
Le Locle, Le Chalet\r
Le Locle, Malpierres\r
Le Locle, Beau-Site\r
Le Locle, Jolimont\r
Le Locle, Jeanneret\r
Le Locle, Gentianes\r
Le Locle\r
Le Locle, Chemin des Dolines\r
Le Locle, Joux-Pelichet\r
Le Locle, Verger Sud\r
Le Locle, Moulins souterrains\r
Le Locle, gare/centre ville\r
Le Locle, Lux\r
Le Locle, rue du Midi\r
Le Locle, La Jaluse\r
Le Locle, Foyer\r
Le Locle, G. Favre\r
Le Locle, Fleurs\r
Le Locle, Communal\r
Le Locle, Etangs\r
Le Locle, Daniel-JeanRichard\r
Le Locle, Primevères\r
Le Locle Le Chalet\r
Le Locle-Col-des-Roches\r
Le Locle-Col-des-Roches, gare\r
Le Manège\r
Le Marais\r
Le Marchairuz, col\r
Le Moléson\r
Le Mont-sur-L., Martines\r
Le Mont-sur-L., Fougères\r
Le Mont-sur-L., Coppoz\r
Le Mont-sur-L., Rionzi/collège\r
Le Mont-sur-L., Etavez\r
Le Mont-sur-L., Grand-Mont\r
Le Mont-sur-L., Coppoz-Poste\r
Le Mont-sur-L., Rionzi\r
Le Mont-sur-L., Planches\r
Le Mont-sur-L., Petit-Mont\r
Le Mont-sur-L., Budron\r
Le Mont-sur-L., Côtes\r
Le Mont-sur-L., Maillefer\r
Le Mouret, Praroman\r
Le Mouret, Moulin à Benz\r
Le Mouret, village\r
Le Mouret, Le Pafuet\r
Le Muids\r
Le Noirmont\r
Le Noirmont, gare\r
Le Pâquier NE, Crêt-du-Puy\r
Le Pâquier NE, Village\r
Le Pâquier-Montbarry\r
Le Pâquier-Montbarry, gare\r
Le Pâquier-Montbarry, village\r
Le Pied-d'Or\r
Le Plan-Marmet\r
Le Pont\r
Le Pont, église\r
Le Pont, Les Fougères\r
Le Pont, gare\r
Le Pont (lac)\r
Le Prédame\r
Le Prese, Stazione\r
Le Prese, Scuole\r
Le Prese, Cantone\r
Le Prese, Pagnoncini\r
Le Prese\r
Le Prévoux, La Soldanelle\r
Le Prévoux, Bas Du Prévoux\r
Le Prévoux, bif. sur Bétod\r
Le Prévoux, Haut du Prévoux\r
Le Prévoux, Les Combes\r
Le Quartier, La Couronne\r
Le Quartier, carrefour\r
Le Reymond\r
Le Rocheray\r
Le Rocheray (lac)\r
Le Rotsé (Chandolin)\r
Le Rotsé (St-Luc)\r
Le Séchey\r
Le Segneux\r
Le Sentier, hôpital\r
Le Sentier, La Golisse\r
Le Sentier, Les Tours\r
Le Sentier, temple\r
Le Sentier, Chez-le-Maître\r
Le Sentier, Chez les Aubert\r
Le Sentier, Chez le Christ\r
Le Sentier, Derrière-la-Côte\r
Le Sentier-L'Orient\r
Le Sentier-L'Orient, gare\r
Le Sépey, La Mosse\r
Le Sépey\r
Le Sépey, gare\r
Le Sépey, La Combaz\r
Le Sépey, Aux Caudreys\r
Le Solliat, Chez le Brigadier\r
Le Solliat, centre\r
Le Solliat-La Golisse\r
Le Stand\r
Le Taillay (télésiège)\r
Le Tremblex\r
Le Trétien\r
Le Trétien, entrée du village\r
Le Tronchet\r
Le Vaud, zoo\r
Le Vaud, place du Battoir\r
Le Vélard\r
Léchelles, gare\r
Léchelles\r
Léchelles, village\r
Léchereuse\r
Leggia, Redivolo\r
Leggia, Paese\r
Lehwil, Abzw.\r
Lehwil, Dorf\r
Leibstadt, Kernkraftwerk\r
Leibstadt, Milchhüsli\r
Leimbach AG\r
Leimbach AG, Bahnhof\r
Leimbach TG, Kreuzung\r
Leissigen, Bahnhof\r
Leissigen, Schulhaus\r
Leissigen, West\r
Leissigen (See)\r
Leiterli (Bergstation)\r
Lej da la Pêsch\r
Lej Saluver\r
Lelgio, Paese\r
Lendikon\r
Lengebrand\r
Lenggenwil, Wiesental\r
Lenggenwil, Dorf\r
Lenggenwil, Taa\r
Lengnau AG, Unterlengnau\r
Lengnau AG, Gewerbegebiet\r
Lengnau AG, Brücke\r
Lengnau AG, Abzw. Husen\r
Lengnau BE, Industrie\r
Lengnau BE, Grienberg\r
Lengnau BE\r
Lengnau BE, Kreisel Badmatt\r
Lengnau BE, Sportplatz\r
Lengnau BE, Friedhof\r
Lengnau BE, Kleinfeld\r
Lengnau BE, Schulhaus Dorf\r
Lengnau BE, Gemeindehaus\r
Lengnau BE, Erle\r
Lengnau BE, Chasseralweg\r
Lengnau BE, Rado\r
Lengwil, Dorf\r
Lengwil\r
Lengwil, Ekkharthof\r
Lengwil, Bahnhof\r
Lenk, Seiten\r
Lenk, Zelg\r
Lenk, Iffigenfall\r
Lenk, Neufeld (Camping)\r
Lenk, Talstation Betelberg\r
Lenk, Erlebnisbad\r
Lenk, Badgässli\r
Lenk, Litte\r
Lenk, Gerbi\r
Lenk, Hubelmatte\r
Lenk, Ritzdole\r
Lenk, Buggeli\r
Lenk, Fure\r
Lenk, Grün\r
Lenk, Metschbahnen\r
Lenk, Alpenrösli\r
Lenk, Simmenfälle\r
Lenk, Sumpfbach\r
Lenk, Boden Zentrum\r
Lenk, Rufeli\r
Lenk, Aegerten\r
Lenk, Lischmatte\r
Lenk, Innere Bleiken\r
Lenk, Mühleweidli\r
Lenk, Bühlberg\r
Lenk, Hubel\r
Lenk, Rohrbrücke\r
Lenk, Marktplatz\r
Lenk, Krummenbach\r
Lenk, Gemeindehaus\r
Lenk, Tennisplatz\r
Lenk, Guggernäll\r
Lenk, Gutenbrunnen\r
Lenk, Gütsch\r
Lenk, Schadauli\r
Lenk, Waldrand\r
Lenk, Flüehlistrasse\r
Lenk, Reitzentrum\r
Lenk, Höhe\r
Lenk, Brandegg\r
Lenk, Rothenbach\r
Lenk, Tannenbühl\r
Lenk, Iffigenalp\r
Lenk, Blatti\r
Lenk, Mittaghorn\r
Lenk, Kuspo\r
Lenk, Edelweiss\r
Lenk, Port\r
Lenk, Lehn\r
Lenk, Laubbärgli\r
Lenk, Äussere Bleiken\r
Lenk, Honeggli\r
Lenk, Stein\r
Lenk (Talstation Leiterli)\r
Lenk (Talstation Metschstand)\r
Lenk Bühlberg\r
Lenk im Simmental\r
Lenk im Simmental, Bahnhof\r
Lenk Stoss\r
Lenk Wallegg (Talstation)\r
Lens, Le Bouille\r
Lens, bif.\r
Lens, Centre d'art\r
Lens, Lyron-Biollaz\r
Lens, place de la Scie\r
Lens, poste\r
Lens, La Trionnaz\r
Lens, Les Rosiers\r
Lentigny, village\r
Lentigny, La Chapelle\r
Lentigny, Treysalles\r
Lenzburg, Ziegeleiweg\r
Lenzburg, Dufourstrasse\r
Lenzburg, Schule Lenzhard\r
Lenzburg, Angelrain\r
Lenzburg, Beyeler\r
Lenzburg, Augustin Kellerstr.\r
Lenzburg, Friedweg\r
Lenzburg, Fünflinden\r
Lenzburg, Poststrasse\r
Lenzburg, Autobahn-Viadukt\r
Lenzburg, Berufsschule\r
Lenzburg, Kronenplatz\r
Lenzburg, Neuhofstrasse\r
Lenzburg, Langsamstig\r
Lenzburg, Schloss\r
Lenzburg, Bachstrasse\r
Lenzburg, General Herzog-Str.\r
Lenzburg\r
Lenzburg, Ringstrasse Nord\r
Lenzburg, Othmarsingerstrasse\r
Lenzburg, Gexistrasse\r
Lenzburg, Traitafina\r
Lenzburg, Volg\r
Lenzburg, Bahnhof\r
Lenzburg, Mehrzweckhalle\r
Lenzburg, Hypiplatz\r
Lenzburg, Zeughaus\r
Lenzburg, Fünfweiher\r
Lenzerheide/Lai, Resgia\r
Lenzerheide/Lai, Clavadoiras\r
Lenzerheide/Lai, Post\r
Lenzerheide/Lai, Val Sporz\r
Lenzerheide/Lai, Skischulplatz\r
Lenzerheide/Lai, Tgantieni\r
Lenzerheide/Lai, Crapera\r
Lenzerheide/Lai, Gravas\r
Lenzerheide/Lai, La Riva\r
Lenzerheide/Lai, Neuhof\r
Lenzerheide/Lai, Tankstelle\r
Lenzerheide/Lai, Central\r
Lenzerheide/Lai, Sporz\r
Lenzerheide/Lai, Dieschen Sot\r
Lenzerheide/Lai, Altersheim\r
Lenzerheide/Lai, Fadail/Lido\r
Lenzerheide/Lai, Rothornbahn\r
Lenzerheide/Lai, Sportzentrum\r
Lenzerheide/Lai Canols\r
Lenzerheide/Lai Proschieri\r
Lenzerheide/Lai Val Sporz\r
Leontica, Combrescherio\r
Leontica\r
Leontica, Chiesa\r
Les Agettes, Crettaz-à-l'Oeil\r
Les Agettes, Tsamorés\r
Les Agettes, garage\r
Les Agettes, village\r
Les Agettes, contour du Pêchot\r
Les Agettes, Crételannaz\r
Les Agettes, d'en haut\r
Les Agettes,s Crettaz-à-l'Oeil\r
Les Agettes, Stade US\r
Les Agettes, Les Crêtes\r
Les Agettes, bif. M.-de-l'Ours\r
Les Arnoux\r
Les Ars\r
Les Attelas\r
Les Avants\r
Les Avants (funi)\r
Les Aviolats\r
Les Bayards, Bellevue\r
Les Bayards, gare\r
Les Bayards, Haut-de-la-Tour\r
Les Bayards, bif Place Jeannin\r
Les Bayards, Quartier du Vent\r
Les Bayards, Petit-Bayard\r
Les Bayards, village\r
Les Bioux, Les Tâches\r
Les Bioux, Les Charmilles\r
Les Bioux, école\r
Les Bioux, AVJ\r
Les Bioux (lac)\r
Les Bois\r
Les Bois, église\r
Les Bovets\r
Les Brenets, centre sportif\r
Les Brenets, camping\r
Les Brenets, Parc des Pargots\r
Les Brenets, centre village\r
Les Brenets, Grande Rue 27\r
Les Brenets, gare\r
Les Brenets, Les Pâquerettes\r
Les Brenets\r
Les Brenets (Lac)\r
Les Breuleux, Le Roselet\r
Les Breuleux\r
Les Breuleux, bif. Les Cerneux\r
Les Breuleux, école\r
Les Breuleux, est\r
Les Breuleux, gare\r
Les Breuleux-Eglise\r
Les Bugnenets\r
Les Cases\r
Les Cerlatez\r
Les Cerniers, restaurant\r
Les Charbonnières\r
Les Chaux (Barboleuse)\r
Les Chavannes-sous-Romont\r
Les Chevalleyres\r
Les Chevalleyres, gare\r
Les Clées-La Russille, croisée\r
Les Coeudres\r
Les Coeudres-Est\r
Les Collons, Les Plans Verneys\r
Les Collons, Cambuse\r
Les Collons, Le Grenier\r
Les Collons, Sporting\r
Les Collons, L'Ours\r
Les Collons, La Croisée\r
Les Collons, Trabanta\r
Les Collons, Office Tourisme\r
Les Collons, Les Thermes\r
Les Collons, Télémixte aval\r
Les Collons (l'Etherolla)\r
Les Collons (Les Masses)\r
Les Collons (Trabanta)\r
Les Combes\r
Les Combes-sur-Sion\r
Les Crêts\r
Les Crosets\r
Les Crosets, chapelle\r
Les Crosets, télésièges\r
Les Cullayes, village\r
Les Cullayes, Pra la Tête\r
Les Dappes\r
Les Deurres\r
Les Diablerets, Les Parchets\r
Les Diablerets, Le Planet\r
Les Diablerets, La Bierlaz\r
Les Diablerets, La Vuargnaz\r
Les Diablerets, Lac Retaud\r
Les Diablerets, Crétêt au Rot\r
Les Diablerets, Mon Abri\r
Les Diablerets, Droutzay\r
Les Diablerets, Les Ormonts\r
Les Diablerets, Lilas/Chamois\r
Les Diablerets,parc des sports\r
Les Diablerets, Les Vioz\r
Les Diablerets, Les Rochers\r
Les Diablerets, accrobranche\r
Les Diablerets,rte Creux Culan\r
Les Diablerets, La Moille\r
Les Diablerets, Les Mazots\r
Les Diablerets, Commune\r
Les Diablerets, Les Frasses\r
Les Diablerets, gare\r
Les Diablerets, Les Preises\r
Les Diablerets, La Marche\r
Les Diablerets\r
Les Diablerets, Le Rachy\r
Les Diablerets, Les Diablotins\r
Les Diablerets (Isenau aval)\r
Les Diablerets Le Vioz\r
Les Ecasseys\r
Les Echenards\r
Les Echets\r
Les Ecorcheresses\r
Les Emibois, gare\r
Les Emibois, école\r
Les Emibois\r
Les Emibois, village\r
Les Enfers, bif. Les Saignes\r
Les Enfers, restaurant\r
Les Eplatures, aéroport\r
Les Esserts-de-Rive\r
Les Evouettes, village\r
Les Evouettes\r
Les Fers (Brion)\r
Les Fers (Solepraz)\r
Les Fignards\r
Les Fontaines (Isérables)\r
Les Fontanelles\r
Les Frêtes\r
Les Fumeaux\r
Les Geneveys-sur-Coffrane,gare\r
Les Geneveys-sur-Coffrane\r
Les Genevez JU, bif.Le Prédame\r
Les Genevez JU, ch.de Tramelan\r
Les Genevez JU, Cernil-Bousset\r
Les Genevez JU, Les Vacheries\r
Les Genevez JU, poste\r
Les Giettes, Prafenne\r
Les Giettes, La Tardive\r
Les Giettes, pl. des Giettes\r
Les Giettes, Cheseaux\r
Les Giettes, La Loëx\r
Les Gouilles\r
Les Granges (Orbe), gare\r
Les Granges (Orbe)\r
Les Granges (Salvan), rte. Van\r
Les Granges (Salvan), bif.\r
Les Granges-de-Dompierre\r
Les Granges-Gérignoz\r
Les Grattes, bif.\r
Les Grattes de bise\r
Les Haudères, Praz do Lauc\r
Les Haudères, Molignon\r
Les Haudères, Farquèses\r
Les Haudères, Les Juttes\r
Les Haudères, centre\r
Les Haudères, La Coutaz\r
Les Haudères, Pralovin\r
Les Hauts-Geneveys, Gollières\r
Les Hauts-Geneveys, Crêt Jura\r
Les Hauts-Geneveys\r
Les Hauts-Geneveys, gare\r
Les Joux-Derrière, La Grébille\r
Les Joux-Derrière, restaurant\r
Les Joux-Derrière,44\r
Les Joux-Derrière,anc.collège\r
Les Marécottes, Le Bossenet\r
Les Marécottes, gare\r
Les Marécottes, télécabine\r
Les Marécottes\r
Les Marécottes, Zoo\r
Les Marécottes, Les Perrons\r
Les Marécottes, Les Bettex\r
Les Marécottes (télécabine)\r
Les Marolires\r
Les Masses, centre\r
Les Masses, Darbelenne\r
Les Masses, Chémô\r
Les Masses, Ferme Pédagogique\r
Les Masses, télésiège\r
Les Masses, La Brecca\r
Les Mayens-de-S., Bon Accueil\r
Les Mayens-de-Sion, Ste-Anne\r
Les Mayens-de-Sion,Les Plans\r
Les Mayens-de-Sion, Coliore\r
Les Mayens-de-Sion, Ouest\r
Les Mazots\r
Les Montuires\r
Les Mosses, Col des Mosses\r
Les Mosses, L'Arsaz\r
Les Mosses, église\r
Les Mosses, village\r
Les Motalles\r
Les Moulins, Pont-de-Pierre\r
Les Moulins, Les Crêts\r
Les Moulins, Les Chabloz\r
Les Moulins, village\r
Les Moulins, La Rosettaz\r
Les Neys\r
Les Nicolets\r
Les Paccots, Les Verollis\r
Les Paccots, La Saira\r
Les Paccots, Moille au Critsou\r
Les Paccots, Les Rosalys\r
Les Paccots, Ermitage\r
Les Paccots, La Borbuintze\r
Les Paccots, village\r
Les Pas\r
Les Petits-Ponts, carrefour\r
Les Petits-Ponts, Les Attis\r
Les Places, bif.\r
Les Planches (Aigle)\r
Les Planches (Aigle), gare\r
Les Planchettes, Le Dazenet\r
Les Planchettes, Sur-le-Ring\r
Les Planchettes, village\r
Les Plans-sur-Bex, Le Chamois\r
Les Plans-sur-Bex,Pont de Nant\r
Les Plans-sur-Bex, village\r
Les Plantaz\r
Les Pléiades\r
Les Pommerats, bas du village\r
Les Pommerats, village\r
Les Pontins, L'Egasse\r
Les Pontins, Mét.-des-Plânes\r
Les Pontins, restaurant\r
Les Pontis\r
Les Ponts-de-Martel, Pt-Bois\r
Les Ponts-de-Martel, rue Pury\r
Les Ponts-de-Martel, Molta-De.\r
Les Ponts-de-Martel, gare\r
Les Ponts-de-Martel\r
Les Ponts-de-Martel, Gde-Rue\r
Les Posses\r
Les Pralies\r
Les Prés-d'Orvin, Le Grillon\r
Les Prés-d'Orvin, Ch. Cernils\r
Les Prés-d'Orvin, Bellevue\r
Les Prises VS\r
Les Rappes VS\r
Les Rasses, village\r
Les Rasses, Grand-Hôtel\r
Les Rasses, Bois de Ban\r
Les Rasses, Crêt-Junod\r
Les Reussilles, bif Montfaucon\r
Les Reussilles, Les Gérinnes\r
Les Reussilles, La Chaux\r
Les Reussilles, Sous-la-Sagne\r
Les Reussilles, Le Préparotte\r
Les Reussilles\r
Les Reussilles, Le Saucy\r
Les Reussilles, gare\r
Les Ripes\r
Les Ripes, gare\r
Les Ronquoz\r
Les Sagnettes, anc. poste\r
Les Sagnettes, ch. Chenailleta\r
Les Sagnettes, bif. Charbonni.\r
Les Sagnettes, La Roche\r
Les Sagnettes, Chablais\r
Les Sairains\r
Les Salines\r
Les Sciernes\r
Les Taillères, bif. L'Ecrenaz\r
Les Taillères, Varodes\r
Les Taillères, Le Gousset\r
Les Taillères, Bout du Lac\r
Les Tavernes, collège\r
Les Têtes\r
Les Thioleyres, village\r
Les Tuileries, gare\r
Les Tuileries\r
Les Verrières, Le Crêt-sud\r
Les Verrières, douane\r
Les Verrières, Meudon\r
Les Verrières, Vy-Perroud\r
Les Verrières, Croix-Blanche\r
Les Verrières, gare\r
Lessoc\r
Lessoc, gare\r
Léteygeon\r
Leuggelbach, Abzw. Haslen\r
Leuggelbach\r
Leuggern, Schule\r
Leuggern, Zentrum/Spital\r
Leuggern, Hof\r
Leuggern, Gippingen Dorf\r
Leuggern, Felsenau Dorf\r
Leuk, St. Barbara\r
Leuk, Abzw. Erschmatt\r
Leuk, Feriendorf Thel\r
Leuk, Stadt\r
Leuk, Abzw. Guttet\r
Leuk, Brentjong\r
Leuk, Lichten\r
Leuk\r
Leuk, Hewald\r
Leuk, Hammerschmiede\r
Leuk, Thel\r
Leuk, Bahnhof\r
Leuk, Rotafen\r
Leukerbad, Lochwald\r
Leukerbad, Briggu\r
Leukerbad, Birchen\r
Leukerbad, Busterminal\r
Leukerbad, Schulen\r
Leukerbad, Diana\r
Leukerbad, Bristol\r
Leukerbad, Obere Maressen\r
Leukerbad, La Bohème\r
Leukerbad, Noyerstrasse\r
Leukerbad, Torrent-Bahnen\r
Leukerbad, Gemmi-Bahnen\r
Leukerbad, City\r
Leukerbad, Lärchenwald\r
Leukerbad (Talstation Gemmi)\r
Leukerbad (Torrentbahn)\r
Leutwil, Dorfplatz\r
Leutwil, Zopf\r
Leuzigen, Dézaley\r
Leuzigen, Schulhaus\r
Levron\r
Leysin, Centres Sportifs\r
Leysin, Village Camps\r
Leysin, Miremont\r
Leysin, place du Marché\r
Leysin, Grand Hôtel (virage)\r
Leysin, En Crettaz\r
Leysin, Fabiola\r
Leysin, Les Alpes\r
Leysin, Central Résidence\r
Leysin, patinoire\r
Leysin, Maison de Commune\r
Leysin, Esplanade-Kumon\r
Leysin, Tobogganing Park\r
Leysin, télécabine Berneuse\r
Leysin, place de la Tour d'Aï\r
Leysin, Les Esserts-Fontaine\r
Leysin, La Croisée\r
Leysin, American School\r
Leysin, Versmont (gare)\r
Leysin (station aval)\r
Leysin Tresseleire\r
Leysin-Feydey\r
Leysin-Feydey, gare\r
Leysin-Grand-Hôtel\r
Leysin-Village\r
Leytron, Union\r
Leytron, Haut de Dugny\r
Leytron, Les Prix\r
Leytron, rte de Saillon\r
Leytron, route Romaine\r
Leytron, rue du Collège\r
Leytron, caves Provins\r
Leytron, Sommet du Village\r
Leytron, Pré d'Enclon\r
Leytron, anc. poste\r
Li Curt, Madreda\r
Li Curt, Capitell\r
Li Curt, S. Antonio\r
Li Curt, Stazione\r
Li Curt\r
Li Curt, Selva\r
Li Curt, Annunziata\r
Li Curt, Prada\r
Li Mason, Fermata\r
Libingen, Hinterhofen\r
Libingen, Vorderhofen\r
Libingen, Dorf\r
Libingen, Lindenboden\r
Lichtensteig, Untertor\r
Lichtensteig, Hintergurtberg\r
Lichtensteig, Rest. Bahnhöfli\r
Lichtensteig, Gurtbergwald\r
Lichtensteig, Bahnhof\r
Lichtensteig, Rosengarten\r
Lichtensteig\r
Lichtensteig, St. Loreto\r
Lichtensteig, Obertor\r
Lichtensteig, Steigrüti\r
Lichtensteig, Hof\r
Lichtensteig, Gurtberg\r
Liddes\r
Liddes, Chapelle\r
Liddes, Fontaine\r
Liddes, Rive-Haute\r
Liebefeld, Hessstrasse\r
Liebefeld, Steinhölzli Märit\r
Liebefeld, Lerbermatt\r
Liebefeld, Neumattweg\r
Liebefeld, Sägestrasse\r
Liebefeld, Liebefeld Park\r
Liebefeld, Sportweg\r
Liebefeld, Neuhausplatz\r
Liebefeld, Bündenackerstrasse\r
Liebefeld, Thomasweg\r
Liebefeld\r
Liebefeld, Steinhölzli\r
Liebistorf, untere Mühle\r
Liebistorf, Sternen\r
Liebistorf, in der Rebe\r
Liebistorf, obere Mühle\r
Liedertswil, Dorf\r
Lienz, Dorf\r
Liesberg, Riederwald\r
Liesberg, Seemättli\r
Liesberg, Ochsengasse\r
Liesberg, Bebrunnenmatten\r
Liesberg, Station\r
Liesberg, Dorfplatz\r
Liestal, Oris\r
Liestal, Burg\r
Liestal, Bahnhof\r
Liestal, Altersheim\r
Liestal, Äussere Arisdörferstr\r
Liestal, Leisenberg\r
Liestal, Kessel\r
Liestal, Heidenloch\r
Liestal, Hallenbad\r
Liestal, Elektra\r
Liestal, Törli\r
Liestal, Gräubern\r
Liestal, Kantonsspital\r
Liestal, Altmarkt\r
Liestal, Stadion\r
Liestal, Radacker\r
Liestal, Gestadeckplatz\r
Liestal, Grammet\r
Liestal, Eglisacker\r
Liestal, Zeughaus\r
Liestal, Abzw. Hersberg\r
Liestal, Fraumatt\r
Liestal, Munzach\r
Liestal, Industriestrasse\r
Liestal, Waldenburgerbahn\r
Liestal, Ringwald\r
Liestal, Schildareal\r
Liestal\r
Liestal, Auf Berg\r
Liestal, Im Rank\r
Liestal, Bahnhof Süd\r
Ligaino\r
Ligerz, Schernelz\r
Ligerz, Bahnhof\r
Ligerz, Festi\r
Ligerz, Bipschal\r
Ligerz, Schafis\r
Ligerz (Schiff)\r
Ligerz (Talstation)\r
Ligerz Festi\r
Ligerz Pilgerweg\r
Lignerolle, CVE\r
Lignerolle, église\r
Lignerolle, Le Daillard\r
Lignières, Moulin Navilot\r
Lignières, bureau communal\r
Lignières, Les Sassels\r
Lignières, cimetière\r
Ligornetto, Posta\r
Ligornetto, Paese\r
Ligornetto, Crocevia Bullani\r
Ligornetto, alla Passeggiata\r
Limpach, Vorimholz\r
Limpach, Post\r
Lindau, Eschikon\r
Lindau, Nürensdorferstrasse\r
Lindau, Dorf\r
Lindau, Rigacher\r
Linden, Dorf\r
Linden, Gridenbühl\r
Linden, Grafenbühl\r
Lindenholz\r
Linescio, Paese\r
Linescio, di Dentro\r
Linescio, di Fuori\r
Linthal, Post\r
Linthal, Oberberg\r
Linthal, Bahnhof\r
Linthal, Stichplattenkehre\r
Linthal, Frittern\r
Linthal, Bergli\r
Linthal\r
Linthal, Bebie\r
Linthal, Braunwaldbahn\r
Linthal, Kantonsgrenze\r
Linthal Braunwaldbahn\r
Linthal Braunwaldbahn (Talst.)\r
Lipperswil, Conny Land\r
Lipperswil, Kellhof\r
Littenheid, Klinik\r
Littenheid, Sonnenmatt\r
Litzirüti\r
Livurcio\r
Lobsigen, Dorf\r
Loc, bif.\r
Loc\r
Locarno, Saleggi\r
Locarno, S. Caterina\r
Locarno, Sacra Famiglia\r
Locarno, In Selva\r
Locarno, Lido\r
Locarno, Palexpo\r
Locarno, Casa Bianca\r
Locarno, Pensione Olanda\r
Locarno, Villa India\r
Locarno, Atelier Remo Rossi\r
Locarno, Residenza Lido\r
Locarno, Piazza Castello\r
Locarno, Panorama\r
Locarno\r
Locarno, Monti della Trinità\r
Locarno, Città Vecchia\r
Locarno, Chiesa S. Antonio\r
Locarno, Paradiso\r
Locarno, S. Antonio Stazione\r
Locarno, Case Popolari\r
Locarno, Centro\r
Locarno, Cinque Vie\r
Locarno, Via Monteguzzo\r
Locarno, Belvedere\r
Locarno, Scuola Media Varesi\r
Locarno, Debarcadero\r
Locarno, Stazione\r
Locarno, Delta Maggia\r
Locarno, Rotonda\r
Locarno, Piazza Stazione\r
Locarno, Alle Torri\r
Locarno, Bosco Isolino\r
Locarno, Lungolago Motta\r
Locarno (lago)\r
Locarno FART\r
Locarno Funicolare\r
Locarno S. Antonio\r
Locarno-Muralto Belvedere\r
Loco, Chiesa/CSO\r
Loco, Paese\r
Lodano\r
Loderio, Bivio\r
Loderio, Nucleo\r
Lodrino, Paese\r
Lodrino, Sud\r
Lodrino, Rongei\r
Lodrino, Cave Bignasca\r
Lodrino, Posta\r
Lodrino, Bivio per Cresciano\r
Lodrino, Rodaglio\r
Lodrino, Balma\r
Lohn GR, spv. Lohn\r
Lohn GR, Dorf\r
Lohn GR, Val Vins\r
Lohn SH, Kreuz\r
Lohn SH, Dorf\r
Lohn-Ammannsegg, Ammannsegg\r
Lohn-Ammannsegg, Kirche\r
Lohn-Ammannsegg, Alte Schmitte\r
Lohn-Lüterkofen\r
Lohn-Lüterkofen, Bahnhof\r
Löhningen, Dorf\r
Lohnstorf, Dorf\r
Lömmenschwil, Romanshornerstr.\r
Lömmenschwil, Schöntal\r
Lommis, Matzingerstrasse\r
Lommis, Krattenbach\r
Lommiswil, Kirche\r
Lommiswil, Bahnhofstrasse\r
Lommiswil, Im Holz\r
Lommiswil\r
Lonay, parc\r
Lonay, Levant\r
Lonay, Grassiaz\r
Lonay, Vozy\r
Lonay, Carouge\r
Lonay, église\r
Lonay, Gracieuse\r
Lonay, Pressoirs\r
Lonay, collège sud\r
Lonay-Préverenges\r
Lonay-Préverenges, gare sud\r
Longirod, village\r
Lopagno, Paese\r
Lopagno, Ronchetto\r
Losone, Agricola\r
Losone, Arbigo\r
Losone, Zandone\r
Losone, Ponte Maggia\r
Losone, Sottochiesa\r
Losone, Canaa\r
Losone, Zandone Campeggio\r
Losone, Mercato Cattori\r
Losone, Via Cesura\r
Losone, Caserma\r
Losone, Scuola Media\r
Losone, Posta\r
Losone, ai Mulini\r
Losone, Municipio\r
Lossy, école\r
Lostallo, nord\r
Lostallo, Posta\r
Lostallo, Paese\r
Lostorf, Sportplatz\r
Lostorf, Kreisschule\r
Lostorf, Eintracht\r
Lostorf, Büechlen\r
Lostorf, Mahren\r
Lostorf, Pfarrhof\r
Lostorf, Mineralquelle\r
Lostorf, Buechehof\r
Lostorf, Dorfplatz\r
Lostorf, Mitte\r
Lottigna\r
Lotzwil\r
Lotzwil, Unterdorf\r
Lourtier, Le Mayen-du-Revers\r
Lourtier, village\r
Lourtier, La Barmasse\r
Lourtier, Brecholey\r
Lourtier, Pont de Mauvoisin\r
Lourtier, Les Epeneys\r
Lourtier, Lourtier-d'en-Haut\r
Lovatens, Prassy\r
Lovatens, village\r
Lovens, Le Réservoir\r
Lovens, Les Esserts\r
Lovens, village\r
Loye\r
Lü, Lüsai\r
Lü, Valpaschun\r
Lü, cumün\r
Luc (Ayent), centre\r
Luc (Ayent), Les Râches\r
Lucelle\r
Lucens, chemin de la Forêt\r
Lucens\r
Lucens, gare\r
Lucens, Pré au Loup\r
Lucens, centre\r
Lüchingen, Sportanlagen/GESA\r
Lüchingen, Kesselbrücke\r
Lüchingen, Wannelocher\r
Lüchingen, Feldbrugg\r
Lüchingen, Dorf\r
Luchsingen, Dorfplatz\r
Luchsingen-Hätzingen\r
Lüdem\r
Lüderenalp\r
Ludiano, Piazza Fiera\r
Lueg\r
Luegli\r
Lüen-Castiel\r
Lufingen, Hintermarchlen\r
Lufingen, Augwil\r
Lufingen, Dorf\r
Lufingen, Unterdorf\r
Lugaggia\r
Lugano, Cimitero\r
Lugano, Via Ciani/Cornaredo\r
Lugano, Palazzo Studi\r
Lugano, ai Frati\r
Lugano, S. Nicolao\r
Lugano, Stazione Nord\r
Lugano, Via Brentani\r
Lugano, Via Zurigo\r
Lugano, Piazza Rezzonico\r
Lugano, Stazione Via Sorengo\r
Lugano, Stazione/Via Basilea\r
Lugano, Studio Radio\r
Lugano, Bellavista\r
Lugano, Loreto\r
Lugano, Centro\r
Lugano, Ronchetto\r
Lugano, Piazza Molino Nuovo 2\r
Lugano, Osp. Civico/Torricelli\r
Lugano, Stadio\r
Lugano, Via Tesserete\r
Lugano, Via F. Pelli\r
Lugano, Vignola\r
Lugano, Piazza Luini\r
Lugano, Santa Birgitta\r
Lugano, Scuole Molino Nuovo\r
Lugano, Via Ginevra\r
Lugano, Via Balestra\r
Lugano, Piazza Loreto\r
Lugano, Gerra\r
Lugano, Stazione\r
Lugano, Cappuccine\r
Lugano, Campus Universitario\r
Lugano, Sacro cuore\r
Lugano, Piazza Molino Nuovo\r
Lugano, Stazione Piazza Besso\r
Lugano, Corso Elvezia\r
Lugano, Autosilo\r
Lugano, Genzana\r
Lugano, Cornaredo\r
Lugano, S. Maurizio\r
Lugano, Resega\r
Lugano, Palazzo Congressi\r
Lugano, Scuole Molino Nuovo 2\r
Lugano, Via Molinazzo\r
Lugano, Autosilo Balestra\r
Lugano, Moncucco Scuole\r
Lugano, Conservatorio\r
Lugano\r
Lugano, Via Beltramina\r
Lugano, Pista Ghiaccio\r
Lugano, Bressanella\r
Lugano, Università\r
Lugano, Via Domenico Fontana\r
Lugano, Ospedale Civico\r
Lugano, Cassarina\r
Lugano, Casa Serena\r
Lugano, Malpensata\r
Lugano, Tassino\r
Lugano, Cà Rezzonico\r
Lugano, Moncucco Clinica\r
Lugano, Via Olgiati\r
Lugano, Cinque Vie\r
Lugano, Piazza Manzoni\r
Lugano Cattedrale (funicolare)\r
Lugano Centrale (lago)\r
Lugano Città (funicolare)\r
Lugano Excelsior (lago)\r
Lugano FLP\r
Lugano Giardino (lago)\r
Lugano Stazione (funicolare)\r
Lugnez, Rauracienne\r
Lugnez, Terrain de football\r
Lugnez, Union\r
Lugnorre, école\r
Lugnorre, place du Pommeré\r
Lugnorre, Les Grottes\r
Lui Fleurie\r
Luins, village\r
Luins, Le Vernay\r
Lukmanier Passhöhe\r
Lully FR, village\r
Lully VD, village\r
Lumbrein, Mulina\r
Lumbrein, St. Andriu\r
Lumbrein, vitg\r
Lumbrein, spv. Surin\r
Lumbrein, Nussaus\r
Lumino, Al Dazio\r
Lumino, Paese\r
Lumino, Cappelletta\r
Lunden, Dorf\r
Lunden, im Aueli\r
Lunden, Hinterlunden\r
Lunden, Vorderlunden\r
Lunden, Büel\r
Lunden, ufm Tobel\r
Lungacqua\r
Lungern, Dorfkapelle\r
Lungern, Zihl\r
Lungern\r
Lungern (Turren-Bahn)\r
Lunschania\r
Lupfig, Dorfstrasse\r
Lupfig, Seebli\r
Lupfig, Trotte\r
Lupfig, Bahnhofstrasse\r
Lupfig, Frohsinn\r
Lupfig\r
Lupsingen, Gewerbe\r
Lupsingen, Pfarrhaus\r
Lupsingen, Schützenhaus\r
Lupsingen, Höfli\r
Lupsingen, Dorf\r
Lurengo\r
Lurtigen, Dorf\r
Lüscherz, Post\r
Lüscherz, Riedmatte\r
Lüscherz, Dorf\r
Lüscherz\r
Lüscherz, Bahnhof\r
Lussery-Villars, chapelle\r
Lussery-Villars, rue Villars\r
Lussery-Villars,pl. de Lussery\r
Lüsslingen, Hohberg\r
Lüsslingen, Käserei\r
Lussy FR, Le Quartz\r
Lussy FR, Les Epenettes\r
Lussy FR, bif.\r
Lussy-sur-Morges, village\r
Lussy-sur-Morges, Riettaz\r
Lustdorf, Kirche\r
Lustmühle, Bahnhof\r
Lustmühle, Hauteten\r
Lustmühle\r
Luterbach, Bahnhof Nordseite\r
Luterbach, Gemeindehaus\r
Luterbach, Reformierte Kirche\r
Luterbach, Kraftwerk\r
Luterbach, Nordstrasse\r
Luterbach, Attisholzstrasse\r
Luterbach-Attisholz\r
Lüterkofen, Dorf\r
Lüterkofen, Schulhaus\r
Lüterswil, Dorf\r
Lüterswil, Bank\r
Luthern, Dorf\r
Luthern, Wieden\r
Luthern Bad, Dreilindenplatz\r
Luthern Bad, Chrutzi\r
Lütisburg, Abzw. Tufertschwil\r
Lütisburg, Dorf\r
Lütisburg\r
Lütisburg, Grünhügel\r
Lutry, Corsy-Dessus\r
Lutry, Brûlées\r
Lutry, Brélaz\r
Lutry, Colline\r
Lutry, Sapelle\r
Lutry, Jordillon\r
Lutry, Savoie\r
Lutry, Grand-Pont\r
Lutry, Voisinand\r
Lutry, Landar\r
Lutry, port\r
Lutry, Rive\r
Lutry, Corniche\r
Lutry, Les Champs\r
Lutry, Gravesse\r
Lutry, Ponfilet\r
Lutry, Marionnettes\r
Lutry, Corsy-Dessous\r
Lutry, Croix/Lutry\r
Lutry, Echerins\r
Lutry, Orzens\r
Lutry, avenue William\r
Lutry, Savuit-place\r
Lutry\r
Lutry, Bossières\r
Lutry, gare\r
Lutry (lac)\r
Lütschental\r
Lütschental, Gemeindehaus\r
Lützelflüh-Goldbach, Bahnhof\r
Lützelflüh-Goldbach,alte Hueti\r
Lützelflüh-Goldbach\r
Lützelflüh-Goldbach, Sonnhalde\r
Lutzenberg, Friedegg\r
Lutzenberg, Haufen\r
Lutzenberg, Altersheim\r
Lutzenberg, Hellbüchel\r
Lutzenberg, Brenden\r
Luven, Panera\r
Luven, vitg\r
Luven, Sut vitg\r
Luven, Tegia Alva\r
Luven, Quadras\r
Luzein, Strilserrank\r
Luzein, alte Post\r
Luzein, Maris\r
Luzein, Schermen\r
Luzein, Sprecherhaus\r
Luzein, Langraus\r
Luzern, Schachenhof\r
Luzern, Gärtnerstrasse\r
Luzern, Schwanenplatz\r
Luzern, Haldensteig\r
Luzern, Bahnhof\r
Luzern, Ruopigen Schulhaus\r
Luzern, Berglistrasse\r
Luzern, Staffeln Schulhaus\r
Luzern, Giseli\r
Luzern, Eisfeldstrasse\r
Luzern, Gütsch\r
Luzern, Leumatt\r
Luzern, Bramberg\r
Luzern, Obergütschstrasse\r
Luzern, Obergütsch\r
Luzern, Würzenbach\r
Luzern, Steinhof\r
Luzern, Zwyssigplatz\r
Luzern, Untergütsch\r
Luzern, Tiefe\r
Luzern, Fluhmühle\r
Luzern, Grenzhof\r
Luzern, Bundesplatz\r
Luzern, Littau Dorf\r
Luzern, Urnerhof\r
Luzern, Büttenen\r
Luzern, Matthof\r
Luzern, Längweiher\r
Luzern, Geissenstein\r
Luzern, Gartenheim\r
Luzern, Friedbergstrasse\r
Luzern, Schützenhaus\r
Luzern, Mühlemattstrasse\r
Luzern, Säntihof\r
Luzern, Breitenlachen\r
Luzern, Kapuzinerweg\r
Luzern, Paulusplatz\r
Luzern, Kreuzstutz\r
Luzern, Sonnenbergstrasse\r
Luzern, Seeburg-Schifflände\r
Luzern, Schlösslihalde\r
Luzern, Steinhofrain\r
Luzern, Steghof\r
Luzern, St. Karli\r
Luzern, Zumbachhof\r
Luzern, Zihlmattweg\r
Luzern, Reussport\r
Luzern, Schlossberg\r
Luzern, Werkhofstrasse\r
Luzern, Staldenhof\r
Luzern, Hermitage\r
Luzern, Bodenhofterrasse\r
Luzern, Blattenmoos\r
Luzern, Eggen\r
Luzern, Rönnimoosrain\r
Luzern, Gigeliwald\r
Luzern, Europe\r
Luzern, Gütschwald\r
Luzern, Lützelmattstrasse\r
Luzern, Hochhüsliweid\r
Luzern, Mönchweg\r
Luzern, Schulhaus Unterlöchli\r
Luzern, Obergütschrain\r
Luzern, Konservatorium\r
Luzern, Oberseeburg\r
Luzern, Schädrütihalde\r
Luzern, Schlösslirain\r
Luzern, Wesemlinrain\r
Luzern, Rodtegg\r
Luzern, Steinhofstrasse\r
Luzern, Weggismatt\r
Luzern, Löwenplatz\r
Luzern, Waldschwimmbad\r
Luzern, Ruopigen Zentrum\r
Luzern, Brüggligasse\r
Luzern, Brüelstrasse\r
Luzern, Matt\r
Luzern, Dreilinden\r
Luzern, Büttenenhalde\r
Luzern, Maihofmatte-Rotsee\r
Luzern, Allmend/Messe\r
Luzern, Hubelmatt\r
Luzern, Moosegg\r
Luzern, Kantonsspital\r
Luzern, Obergütschhalde\r
Luzern, Kanonenstrasse\r
Luzern, Oberseeburghöhe\r
Luzern, Wartegg\r
Luzern, Sternmatt\r
Luzern, Weinbergli\r
Luzern, Unterlöchli\r
Luzern, Casino-Palace\r
Luzern, Seefeldstrasse\r
Luzern, Maihof\r
Luzern, Eichhof\r
Luzern, Brüel\r
Luzern, Brünigstrasse\r
Luzern, Gasshof\r
Luzern, Felsberg\r
Luzern, Geissmatthöhe\r
Luzern, Michaelshof\r
Luzern, Hirtenhof\r
Luzern, Friedental\r
Luzern, Morgenweg\r
Luzern, Hirzenhof\r
Luzern, Kantonalbank\r
Luzern, Rosenberg\r
Luzern, Zähringerstrasse\r
Luzern, Würzenbachmatte\r
Luzern, Rigistrasse\r
Luzern, Schiff\r
Luzern, Kloster Wesemlin\r
Luzern, Rothenhalde\r
Luzern, Luzernerhof\r
Luzern, Kasernenplatz\r
Luzern, Frohburg\r
Luzern, Verkehrshaus/Lido\r
Luzern, Château Gütsch\r
Luzern, Wey\r
Luzern, Hotel Seeburg\r
Luzern, Dietschiberg\r
Luzern, Schönbühl\r
Luzern, Klinik St. Anna\r
Luzern\r
Luzern, Pilatusplatz\r
Luzern, Waldstrasse\r
Luzern, Eichenstrasse\r
Luzern Allmend/Messe\r
Luzern Bahnhofquai\r
Luzern Gütsch (Talstation)\r
Luzern Littau, Bahnhof\r
Luzern Littau\r
Luzern Schweizerhofquai\r
Luzern Verkehrshaus\r
Lyss, Mühleplatz\r
Lyss, Bahnhof\r
Lyss, Beundengasse\r
Lyss, Industriezone Bernstr.\r
Lyss, Rainweg\r
Lyss, Jungfrauweg\r
Lyss, Oberfeldweg\r
Lyss, Bahnhof Ost\r
Lyss, Dreihubel\r
Lyss, Abzw. Hardern\r
Lyss, Eigerweg\r
Lyss, Lyssbachpark\r
Lyss, Berufsschulhaus\r
Lyss, Hirschenplatz\r
Lyss\r
Lyss, Industrie Süd\r
Lyss, Lehn\r
Lyss, Flurweg\r
Lyss, Grentschel\r
Lyss, Kornweg\r
Lyss, Stigli\r
Lyss, KUFA\r
Lyss, Seelandhalle\r
Lyss, Seelandweg\r
Lyss, Parkschwimmbad\r
Lyss Grien\r
Lyssach, Lyssachschachen\r
Lyssach, Kernenriedstrasse\r
Lyssach\r
Lyssach, Dorfstrasse\r
Lyssach, Bahnhof\r
Lyssach, Bernstrasse (Ikea)\r
Lyssach, Bernstrasse West\r
Lyssach, Schachengut\r
Mâche\r
Madetswil, Dorf\r
Madetswil, Bläsimühle\r
Madiswil\r
Madonna del Piano, Paese\r
Madrisa\r
Madulain, vih\r
Madulain\r
Magadino, Debarcadero\r
Magadino, Farmacia\r
Magadino, Casa Comunale\r
Magadino, Al Ponte\r
Magadino (lago)\r
Magadino-Vira, Stazione\r
Magadino-Vira\r
Magden, Unterdorf\r
Magden, Schwimmbad\r
Magden, Lanzenberg\r
Magden, Post\r
Mägenwil, Bahnhof\r
Mägenwil, Electrolux\r
Mägenwil, Dorf\r
Mägenwil, Gewerbepark\r
Mägenwil, Gemeindehaus\r
Mägenwil, Eckwil\r
Mägenwil\r
Maggia, centro\r
Maggia, Ospedale\r
Magglingen, Lärchenplatz\r
Magglingen, Epicerie\r
Magglingen,Zum Alten Schweizer\r
Magglingen, Kapellenweg\r
Magglingen, End der Welt\r
Magglingen, Alte Sporthalle\r
Magglingen, Seilbahn\r
Magglingen/Macolin\r
Mägisalp\r
Mägisalp (Talstation Hääggen)\r
Magliaso, Stazione\r
Magliaso\r
Magliaso Paese\r
Maglio di Colla, Paese\r
Maglio di Colla, Malpensata\r
Magnedens, bif. Bulle\r
Magnedens, bif. Corpataux\r
Magnedens, bif. Fribourg\r
Magnedens, village\r
Magnot\r
Maiacher\r
Maienberg\r
Maienfeld\r
Maienfeld, Bahnhof\r
Maienfeld, Herrenfeld\r
Maienfeld, St. Luzisteig\r
Maienfeld, Im Loretscher\r
Maienfeld, Post\r
Maienfeld, Heididorf\r
Maienfeld, Pardell\r
Maienfeld, Heidibrunnen\r
Mairengo, Selva\r
Mairengo, Campasc\r
Mairengo, Paese\r
Maisprach, Dorf\r
Maisprach, Hofmet\r
Maladers, Sax\r
Maladers, Chisgruob\r
Maladers, Brandacker\r
Maladers, Cholplatz\r
Maladers, Schule\r
Maladers, Dorf\r
Maladers, alte Post\r
Maladers, Tumma\r
Malans (Älplibahn Talstation)\r
Malans GR, Älplibahn\r
Malans GR, Karlihof\r
Malans GR, Postplatz\r
Malans GR, Valära\r
Malans GR, Unterdorf\r
Malans GR\r
Malans SG, Bettlerstein\r
Malans SG, Dorf\r
Malbun, Jugendhaus\r
Malbun, Schneeflucht\r
Malbun, Zentrum\r
Malbun, Jöraboda\r
Malbun, Bergbahnen\r
Malbun (Hochegg Talst.)\r
Malbun (Sareis Talstation)\r
Malbun (Vaduzer Täli Talst.)\r
Maligue\r
Malix, Rezia\r
Malix, Kreuz\r
Malix, Dorf\r
Malleray, place du village\r
Malleray-Bévilard, gare\r
Malleray-Bévilard\r
Maloja, Capolago\r
Maloja, Cad'Maté\r
Maloja, Posta\r
Maloja (See)\r
Malters\r
Malters, Ennigen\r
Malters, Hinter-Widenmatt\r
Malters, Oberdorf\r
Malters, Mattgut\r
Malters, Allmendli\r
Malters, Schürmatt\r
Malters, Bahnhof\r
Malters, Blatten\r
Malters, Emmenstrasse\r
Malters, Liebetsegg\r
Malters, Hirzli\r
Malters, Stegmättli\r
Malvaglia, Orino\r
Malvaglia, Filovia\r
Malvaglia, Rongie\r
Malvaglia, Brugaio\r
Malvaglia, Piazza d'armi\r
Malvaglia, Chiesa\r
Mamishaus, Hostatt\r
Mamishaus, Dorf\r
Mamishaus, Wyden\r
Mamishaus, Abzw. Borbezried\r
Mamishaus, Wengerli\r
Mamishaus, Schönentannen\r
Mammern, Bahnhofstrasse\r
Mammern\r
Mammern (See)\r
Mandach, Dorf\r
Mandra\r
Männedorf, Dammstrasse\r
Männedorf, Im Russer\r
Männedorf, Kirchweg\r
Männedorf, Bahnhof\r
Männedorf, Allmendhof\r
Männedorf, Asylstrasse\r
Männedorf, Sonnenfeld\r
Männedorf, Glärnischstrasse\r
Männedorf, Büelen\r
Männedorf, Boldernstrasse\r
Männedorf, Spital\r
Männedorf, Widenbad\r
Männedorf, Zentrum Leue\r
Männedorf, Auf Dorf\r
Männedorf, Allenberg\r
Männedorf\r
Männedorf (See)\r
Mannenbach (See)\r
Mannenbach-Salenstein\r
Mannenbach-Salenstein, Bahnhof\r
Mannens, école\r
Männlichen (Gondelbahn)\r
Männlichen (Luftseilb. Wengen)\r
Männlichen (Sesselbahn)\r
Männlichen Klein Tschuggen\r
Manno, Scuole\r
Manno, Uovo di Manno\r
Manno, Paese\r
Manno, Centro di Calcolo\r
Manno, Michelino\r
Manno, Boschetti\r
Manno, La Monda\r
Manno, Suglio\r
Maracon, La Crosettaz\r
Maracon, bif.\r
Marbach (Talstation)\r
Marbach LU, Mösli\r
Marbach LU, Ey\r
Marbach LU, Dorf\r
Marbach LU, Bergkäserei\r
Marbach LU, Geissenmoos\r
Marbach LU, Untergasse\r
Marbach LU, Neugaden\r
Marbach LU, Laui\r
Marbach LU, Schufelbühl\r
Marbach SG, Gehren\r
Marbach SG, Ranft\r
Marbach SG, Dorf\r
Marbach SG, Bruggtobel\r
Marbachegg, Talstation\r
Marbachegg\r
Marcheusson\r
Marchissy, Les Raisses\r
Marchissy, village\r
Margun Vegl\r
Marguns (Val Saluver)\r
Mariastein, Abzw. Rotberg\r
Mariastein, Kloster\r
Marin, Couviers\r
Marin, Village\r
Marin, Les Microtechniques\r
Marin, Indiennes\r
Marin-Epagnier\r
Marin-Epagnier, Marin Centre\r
Marin-Epagnier, Paul-Vouga\r
Marin-Epagnier, Henripolis\r
Marin-Epagnier, La Tène\r
Marin-Epagnier,Champs-Montants\r
Marin-Epagnier, gare\r
Marly, Ancienne-Papeterie\r
Marly, Innovation Center\r
Marly, Cité\r
Marly, Les Rittes\r
Marly, Grand Pré\r
Marly, Gérine\r
Marly, Bel-Air\r
Marly, Pré de la Croix\r
Marly, Préalpes\r
Marly, Jonction\r
Marly, piscine\r
Marmorera, rampar/Staudamm\r
Marmorera, vischnanca\r
Marmorera, Scalotta\r
Marnand, village\r
Maroggia (lago)\r
Maroggia-Melano, Stazione\r
Maroggia-Melano\r
Marogno\r
Marsens, village\r
Märstetten, Muggenwinggel\r
Märstetten, Bahnhof\r
Märstetten, Gemeindehaus\r
Märstetten\r
Märstetten, Weitsicht\r
Märstetten, Obstgarten\r
Martegnas\r
Marthalen\r
Marthalen, Bahnhof\r
Marthalen, Dorf\r
Martigny, Fond. Gianadda\r
Martigny, Portes du Rhône\r
Martigny, hôpital\r
Martigny, Rosel-Les Iles\r
Martigny, Finettes\r
Martigny, Rue des Meillerettes\r
Martigny, Rossettan\r
Martigny, St-Théodule\r
Martigny, ch. des Ecoliers\r
Martigny\r
Martigny, Vorziers\r
Martigny, Praille\r
Martigny, Verdan\r
Martigny, Grand Verger\r
Martigny, gare\r
Martigny, ch. du Scex\r
Martigny, Pré de Foire\r
Martigny, Farquet\r
Martigny, Bassin du Manoir\r
Martigny, Place de Rome\r
Martigny, Chemin du Milieu\r
Martigny, Le Guercet\r
Martigny, Levant\r
Martigny, rue du Castel\r
Martigny, La Bâtiaz\r
Martigny, Rhodania\r
Martigny, Grandes Maresches\r
Martigny, Bonnes Luites\r
Martigny, Prés Aubert\r
Martigny, Ottan\r
Martigny-Bourg\r
Martigny-Bourg, Pl. St-Michel\r
Martigny-Combe, cont. Chanton\r
Martigny-Combe, sur-le-Scex\r
Martigny-Combe, Le Chanton\r
Martigny-Combe,Pied-du-Château\r
Martigny-Combe, Drapeau Suisse\r
Martigny-Combe, Chalet Forêt\r
Martigny-Combe, Mayens-Basses\r
Martigny-Croix, croisée\r
Martigny-Croix\r
Martigny-Croix, Chanton-Bas\r
Martigny-Croix, Pl. Centrale\r
Martina, cunfin\r
Martinet\r
Märwil\r
Maschgenkamm\r
Maschwanden, Sagi\r
Maschwanden, Dorf\r
Mase, village\r
Mase, Les Terresses\r
Mase, La Fougère\r
Mase, église\r
Masein, Cresta\r
Masein, Martinsruh\r
Masein, Dorf\r
Masein, Dalaus\r
Masein, Unterdorf\r
Masescha, Kapelle\r
Masescha, Foppa\r
Massagno, al Sole\r
Massagno, Praccio\r
Massagno, Santa Lucia\r
Massagno, Sassa\r
Massagno, Vicolo Vecchio\r
Massagno, Cappella due Mani\r
Massongex, Grand-Clos\r
Massongex\r
Massongex, rte du Chablais\r
Massongex, Le Moulin\r
Massongex, Les Paluds\r
Massongex, gare\r
Massongex, Vers-chez-Revet\r
Massongex, Le Bras\r
Massongex, Fontany\r
Massonnens, Ferlens FR\r
Massonnens, Mottex\r
Massonnens, village\r
Massonnens, Malapalud\r
Mastrils, Feld\r
Mastrils, Birke\r
Mastrils, Isla\r
Mastrils, Höf\r
Mastrils, Rösliplatz\r
Mastrils, Tretsch\r
Mastrils, Tobel\r
Mastrils, Tardisbrücke\r
Mastrils, Piz Alun\r
Mathod, Bras d'Or\r
Mathod, collège\r
Mathod, Moulin de Mathod\r
Mathon, Muntsulej\r
Mathon, Dorf\r
Matran, école\r
Matran, village\r
Matran, Rte de la Tire\r
Matran, Champ-Riond\r
Matt, Station\r
Matt, Brummbach\r
Matt, Dorf\r
Matt (Seilbahn)\r
Mätteli\r
Matten b. I., Hotel Sonne\r
Matten b. I., Kesslergasse\r
Matten b. I., Brunnen-Haus\r
Matten b. I., Hertigässli\r
Matten b. I., Wychelstrasse\r
Matten b. I., Gsteigstrasse\r
Matten b. I., Mattenstrasse\r
Matten b. I., Jungfrau Park\r
Matten b. I., Bahnhof\r
Matten b. I., Jungfraublick\r
Matten b. I., Hotel Regina\r
Matten b. Interlaken\r
Matten i.S.\r
Matten i.S., Färmelbach\r
Matten i.S., Stocken\r
Matten i.S., Dorf\r
Mattmark\r
Mattsand, Kapelle\r
Mattstetten, Dorf\r
Mattwil, Ochsen\r
Mattwil, Schule\r
Matzendorf, Horngraben\r
Matzendorf, Mühle\r
Matzendorf, Brunnersberg\r
Matzendorf, Schulen\r
Matzendorf, Unterdorf\r
Matzingen, Kirche\r
Matzingen\r
Mauborget, anc. poste\r
Mauborget, Les Pièces\r
Mauborget, village\r
Mauborget, bif. La Magnenaz\r
Mauensee, Dorf\r
Mauensee, Schloss\r
Mauensee, Breiten\r
Maulerhubel\r
Maules, village\r
Maules, bif\r
Maur, Kirche\r
Maur, Platten\r
Maur, See\r
Maur, Dorf\r
Maur, Aschbach\r
Maur (See)\r
Mauraz\r
Mauren FL, Freihof\r
Mauren FL, Wegacker\r
Mauren FL, Freiendorf\r
Mauren FL, Krummenacker\r
Mauren FL, Auf Berg\r
Mauren FL, Vogelparadies\r
Mauren FL, Kirche\r
Mauren FL, Fallsgass\r
Mauren FL, Binza\r
Mauren FL, Post\r
Mauren FL, Purtscher\r
Mauren TG, Dorfstrasse\r
Mauvoisin\r
Mayen (Leysin)\r
Mayen-sur-Vionnaz\r
Mayens de Bruson\r
Mayens-de-Chamoson, Prili\r
Mayens-de-Chamoson, Berze\r
Mayens-de-Chamoson, Ravoire\r
Mayens-de-Chamoson,Prili-Plane\r
Mayens-de-Chamoson, Chapelle\r
Mayens-de-l'Hôpital\r
Mayens-de-l'Ours, télécabine\r
Mayentset\r
Mazembroz\r
Medeglia, Drossa\r
Medeglia, Sorgai\r
Medeglia, Alla Motta\r
Medeglia, Paese\r
Medeglia, Campaccio\r
Medels im Rheinwald, Abzw.\r
Medoscio, Sotto\r
Medoscio, Paese\r
Meggen, Buchmatt\r
Meggen, Piuskirche\r
Meggen, Klösterli\r
Meggen, Rosenhalde\r
Meggen, Obermattstrasse\r
Meggen, Kreuz\r
Meggen, Neuhabsburg\r
Meggen, Schiffstation\r
Meggen, Schwerzihöhe\r
Meggen, Altstadstrasse\r
Meggen, Hochrüti\r
Meggen, Gottlieben\r
Meggen, Meggenhorn\r
Meggen, Englischer Friedhof\r
Meggen, Fischerdörfli\r
Meggen, St. Charles Hall\r
Meggen, Huob\r
Meggen, Balm\r
Meggen, Schlössli\r
Meggen\r
Meggen, Böschenacher\r
Meggen, Tschädigen\r
Meggen, Stampfiweg\r
Meggen, Lerchenbühl\r
Meggen, Kapelle\r
Meggen (See)\r
Meggen Zentrum, Bahnhof\r
Meggen Zentrum\r
Meggenhorn\r
Meien, Sustenbrüggli\r
Meien, Gorezmettlen\r
Meien, Husen\r
Meien, Dörfli\r
Meien, Aderbogen\r
Meierhoftälli\r
Meierskappel, Dorfplatz\r
Meierskappel, Feissenacher\r
Meierskappel, Robmatt\r
Meierskappel, Käppelihof\r
Meikirch, Gassacker\r
Meikirch, Postgässli\r
Meikirch, Käserei\r
Meikirch, Feld\r
Meikirch, Grächwil\r
Meikirch, Abzw. Weissenstein\r
Meikirch, Abzw. Aetzikofen\r
Meilen, Eichholz\r
Meilen, Allmend\r
Meilen, Grüt\r
Meilen, Zentrum Feldmeilen\r
Meilen, Hohenegg\r
Meilen\r
Meilen, Bezibüel/Chilchbüel\r
Meilen, Au\r
Meilen, Grueb\r
Meilen, Roren\r
Meilen, Tobel\r
Meilen, Obermeilen\r
Meilen, Hallenbad\r
Meilen, Charrhalten\r
Meilen, Plätzli\r
Meilen, Parkresidenz\r
Meilen, Vorderer Pfannenstiel\r
Meilen, Schulhaus Obermeilen\r
Meilen, Dollikon\r
Meilen, Beugen\r
Meilen, Bundi\r
Meilen, Rebbergstrasse\r
Meilen, Ormis\r
Meilen, Zur Au\r
Meilen, Schwabach\r
Meilen, Alte Sonne\r
Meilen, Aebleten\r
Meilen, Schulhaus Feld\r
Meilen, In der Au\r
Meilen, Halten\r
Meilen, Bahnhof\r
Meilen, Weid\r
Meilen, Friedhof\r
Meilen (See)\r
Meilen Autoquai\r
Meilleret\r
Meilleret (Mi-Laouissalet)\r
Meinier, Tour\r
Meinier, Merlinge\r
Meinier, église\r
Meinier, Murailles\r
Meinier, Compois\r
Meinier, Route de Corsinge\r
Meinier, Route de Compois\r
Meinier, Carre-d'Amont\r
Meinier, Pralys\r
Meinier, Essert\r
Meinier, Rouelbeau\r
Meinier, Corsinge village\r
Meinisberg, Unterdorf\r
Meinisberg, Niesenstrasse\r
Meinisberg, Dorfplatz\r
Meinisberg, Rosenweg\r
Meinisberg, Rütti\r
Meiringen, Bahnhof\r
Meiringen, Isenbolgen\r
Meiringen, Alpbach Parkplatz\r
Meiringen, Luftseilbahn\r
Meiringen, Altersheim\r
Meiringen, Molki\r
Meiringen, Casinoplatz\r
Meiringen, Hallenbad\r
Meiringen, Spitalstrasse\r
Meiringen,Alpbach Sportanlagen\r
Meiringen, Gilli\r
Meiringen, Kirchgemeindehaus\r
Meiringen\r
Meiringen, Gesundheitszentrum\r
Meiringen, Alpencamping\r
Meiringen (Luftseilbahn)\r
Meiringen Alpbach\r
Meisterschwanden, Schulhaus\r
Meisterschwanden, Oberdorf\r
Meisterschwanden, Delphinweg\r
Meisterschwanden Delphin\r
Meisterschwanden Seerose\r
Melano, Tre Pini\r
Melano, Piazza\r
Melano, Posta\r
Melano, Cappelletta per Rovio\r
Melano, Al Ponte\r
Melano (lago)\r
Melchnau, Gjuch\r
Melchnau, Rotwald\r
Melchnau, Unterdorf\r
Melchnau, Fabrik\r
Melchnau, Oberdorf\r
Melchsee-Frutt, Tannalp\r
Melchsee-Frutt, Kapelle\r
Melchsee-Frutt, Panoramalift\r
Melchsee-Frutt, Fachshubel\r
Melchsee-Frutt, Tannendamm\r
Melchsee-Frutt, alte Bergstat.\r
Melchsee-Frutt, Dörfli\r
Melchsee-Frutt, Tannensee\r
Melchsee-Frutt, Distelboden\r
Melchsee-Frutt (Bergstation)\r
Melchtal, Sportcamp\r
Melchtal, Weidli\r
Melchtal, Turrenbach\r
Melchtal, Plätzli\r
Melchtal, Dorf\r
Melchtal, Sportcamp Nord\r
Melchtal, gedeckte Brücke\r
Melchtal Stöckalp (Talstation)\r
Melera\r
Melide, Piazza Moretti\r
Melide, Cantine\r
Melide, Villa Magnolia\r
Melide, Stazione\r
Melide\r
Melide Cantine (lago)\r
Melide Swissminiatur (lago)\r
Mellikon, Chessel\r
Mellikon\r
Mellingen, Stetterstrasse\r
Mellingen, Krone\r
Mellingen, Geerig\r
Mellingen, Zentralplatz\r
Mellingen, Lindenplatz\r
Mellingen, Friedhof\r
Mellingen, Gheid\r
Mellingen, Meierhofer\r
Mellingen Heitersberg\r
Mellingen Heitersberg, Bahnhof\r
Mellstorf, Dorf\r
Mels, Oberdorf\r
Mels, Hienzi\r
Mels, Huob\r
Mels, Oberheiligkreuz\r
Mels, Aussicht\r
Mels\r
Mels, Wolfriet\r
Mels, Altersheim\r
Mels, Pizolcenter\r
Mels, Steigs\r
Mels, Fabrik\r
Mels, Bahnhofstrasse\r
Mels, Feldackerstrasse\r
Mels, Altes Kino\r
Mels, Collina\r
Mels, Messmerhölzli\r
Mels, Hallenbad\r
Mels, Kleinfeld\r
Mels, Pizolpark\r
Mels, Lütsch\r
Mels, Waldheim\r
Mels, Bahnhof\r
Mels, Schwarzackerstrasse\r
Mels, Verrucano\r
Mels, Schurs\r
Meltingen, Gemeindezentrum\r
Meltingen, Meltingerbrücke\r
Mendrisio, Autosilo\r
Mendrisio, Borgo\r
Mendrisio, Stazione\r
Mendrisio, Morgana\r
Mendrisio, Cantine di Sotto\r
Mendrisio, Vignalunga\r
Mendrisio, Via Morée\r
Mendrisio, Ospedale B. Vergine\r
Mendrisio\r
Mendrisio, Macello\r
Mendrisio, Banchette\r
Mendrisio, Filanda\r
Mendrisio, Centro Studi 1\r
Mendrisio, S. Giovanni\r
Mendrisio, Cimitero\r
Mendrisio, Stand di Tiro\r
Mendrisio, S. Martino\r
Mendrisio, Casa Anziani\r
Mendrisio, Centro Studi 2\r
Mendrisio, Cantine Delizie\r
Mendrisio, Asilo Sud\r
Mendrisio, Via Motta\r
Mendrisio, OSC\r
Mendrisio S. Martino\r
Ménières, village\r
Menzberg, Buchen\r
Menzberg, Hasenrank\r
Menzberg, Gutenegg\r
Menzberg, Oberlehn/Napf\r
Menzberg, Dorfplatz\r
Menzberg, Buchensäge\r
Menziken, Maihuserstrasse\r
Menziken, Bahnhof\r
Menziken\r
Menziken, Spital\r
Menziken, Altersh. Falkenstein\r
Menzingen, Weid\r
Menzingen, Moosstrasse\r
Menzingen, Dorf\r
Menzingen,Institut/Bernardapl.\r
Menzingen, Kreuzegg\r
Menziswil\r
Menznau, Bahnhof\r
Menznau, Höhe\r
Menznau\r
Menznau, Tanzeren\r
Menznau, Obertreien\r
Menznau, Untertreien\r
Menznau, Twerenegg\r
Menzonio, Paese\r
Menzonio, Mulini\r
Menzonio, Bivio\r
Menzonio, Sentiero\r
Merbé\r
Merenschwand, Unterdorf\r
Merenschwand, Allmend Gut\r
Merenschwand, Unterrüti\r
Merenschwand, Zentrum\r
Merenschwand, Hinterdorf\r
Mergoscia, Ai Mulini\r
Mergoscia, Bivio Ropiana\r
Mergoscia, Busada\r
Mergoscia, Posta\r
Méribé\r
Meride, Alla Guana\r
Meride, Campeggio\r
Meride, Paese\r
Merishausen, Gemeindehaus\r
Merishausen, im Kerr\r
Merishausen, Eichwis\r
Merishausen, Schlauch\r
Merishausen, Brunngasse\r
Merligen, Ralligen\r
Merligen, Kreuz\r
Merligen, Beatus\r
Merligen, Bäregg\r
Merligen, Vorderdorf\r
Merligen, Nastel\r
Merligen (See)\r
Merlischachen, Sumpf\r
Merlischachen, Räbe\r
Merlischachen\r
Merlischachen, Dorf\r
Merlischachen (See)\r
Mervelier, poste\r
Mervelier, haut du Village\r
Mervelier, scierie\r
Mervelier, Rue des Prés\r
Mervelier, Chapelle\r
Merzligen, Holzmattweg\r
Merzligen, Linde\r
Merzligen, Grossackerweg\r
Mesocco, Ponte Anzone\r
Mesocco, Castello\r
Mesocco, Nord\r
Mesocco, Posta\r
Mesocco, Stazione\r
Messen, Ischbad\r
Messen, Kindergarten\r
Messen, Dorfplatz\r
Messen, Post\r
Messen, Eichholz\r
Messen, Schulhaus\r
Messen, Räzlirain\r
Metsch\r
Metschmaad\r
Metschstand\r
Mettau, Kirche\r
Mettau, Linde\r
Mettembert, bif. sur Forme\r
Mettembert, bas du village\r
Mettembert, école\r
Mettlen\r
Mettlen, Unterdorf\r
Mettlen, Wilerstrasse\r
Mettlenalp (Napf)\r
Mettli\r
Mettmen\r
Mettmenstetten, Schulhaus\r
Mettmenstetten, Rossauerstr.\r
Mettmenstetten, Rossau\r
Mettmenstetten, Wissenbach\r
Mettmenstetten, Bahnhof\r
Mettmenstetten, Oberdorf\r
Mettmenstetten\r
Mettmenstetten, Rennweg\r
Mettmenstetten, Zentrum\r
Metzerlen, Dorf\r
Metzerlen, Allmendhalle\r
Metzerlen, Challstrasse\r
Metzerlen, Burgstrasse\r
Mex VD, Trésy\r
Mex VD, village\r
Mex VD, Les Esserts\r
Mex VD, Faraz\r
Mex VS\r
Meyriez, Chemin du Village\r
Meyriez, Hôpital\r
Meyriez, Fin de Meyriez\r
Meyrin, village\r
Meyrin, Sainte-Cécile\r
Meyrin, Bugnons\r
Meyrin, Mategnin\r
Meyrin, ZIMEYSA centre\r
Meyrin, Veyrot\r
Meyrin, CERN\r
Meyrin, Champs-Fréchets\r
Meyrin, Maisonnex\r
Meyrin, Bois-du-Lan\r
Meyrin, De-Joinville\r
Meyrin, mairie\r
Meyrin, Vaudagne\r
Meyrin, Jardin-Alpin-Vivarium\r
Meyrin, Vernes\r
Meyrin, Hôpital de La Tour\r
Meyrin, Marcinhes\r
Meyrin, Forumeyrin\r
Meyrin, Citadelle\r
Meyrin, Kammacher\r
Meyrin, Marais-Long\r
Meyrin, Stierlin\r
Meyrin, Prulay\r
Meyrin\r
Meyrin, Maillard\r
Meyrin, Gravière\r
Meyrin, gare\r
Mézery-près-Donneloye, village\r
Mézières FR, village\r
Mézières FR, Parqueterie\r
Mézières FR, église\r
Mézières VD, collège Raffort\r
Mézières VD, village\r
Mézières VD, Praz Joret\r
Mézières VD, centre médical\r
Mézières VD, station\r
Mezzovico, S. Mamete\r
Mezzovico, Fontana\r
Mezzovico, Bivio per Vira\r
Mezzovico, Stazione\r
Mezzovico\r
Mi-Laouissalet (Conche)\r
Mi-Laouissalet (Meilleret)\r
Mi-Ruvine\r
Middes, bif.\r
Miécourt, village\r
Miège, Les Vergers\r
Miège, église\r
Mies, village\r
Mies\r
Mies, gare\r
Miex, Membran\r
Miex, rte de Vésenand\r
Miex, Le Flon\r
Miex, village\r
Miex, Plan-du-Chêne\r
Miglieglia, Tortoglio\r
Miglieglia, Cassinelle\r
Miglieglia, Paese\r
Miglieglia (Funivia)\r
Milez\r
Milken, Zumholz\r
Milken, Steinern\r
Milken, Hofland\r
Milken, Dorf\r
Minusio, Ignifera\r
Minusio, Moranda\r
Minusio, S. Martino\r
Minusio, Ai Foll\r
Minusio, Paradiso di Vacanze\r
Minusio, Crocifisso\r
Minusio, Ponte Navegna\r
Minusio, Scuole Medie\r
Minusio, Bivio Via Frizzi\r
Minusio, Esplanade\r
Minusio, Remorino\r
Minusio, Lido Mappo\r
Minusio, Via Verbano\r
Minusio, Centro Elisarion\r
Minusio\r
Minusio, Via ai Colli\r
Minusio, Mappo\r
Minusio, Piazza\r
Miralago, Stazione\r
Miralago\r
Miserez-Dessus\r
Misery, village\r
Mission\r
Missy, nord\r
Missy, village\r
Mitholz, Underem Büel\r
Mitholz, Balmhorn\r
Mitholz, Unter der Fluh\r
Mitlödi\r
Mitlödi, Schulhaus\r
Mitlödi, Kirche\r
Mitlödi, Hauptstrasse\r
Mittelallalin\r
Mittelhäusern\r
Mittelmuhen, Bahnhof\r
Mittelmuhen\r
Mittlerschwanden\r
Moay (télésiège)\r
Mogelsberg\r
Mogno, Colonia Pazzalino\r
Mogno, Paese\r
Möhlin, Obermatt\r
Möhlin, Aeschengasse\r
Möhlin, Bata Park\r
Möhlin, Bäumlimatt Mitte\r
Möhlin, Bäumlimatt Ost\r
Möhlin, Schwimmbad\r
Möhlin, Helvetierstrasse\r
Möhlin, Dammstrasse\r
Möhlin, Bahnhof\r
Möhlin, Unter der Halde\r
Möhlin, Kanzleistrasse\r
Möhlin, Industriestrasse\r
Möhlin, Sportzentrum\r
Möhlin, Efeuweg\r
Möhlin\r
Möhlin, Volg-Riburg\r
Möhlin, Kleemattstrasse\r
Möhlin, Schallen\r
Möhlin, Zeiningerstrasse\r
Möhlin, Hölzlistrasse\r
Möhlin, Post\r
Moiry VD, collège\r
Moiry VS, glacier\r
Moiry VS, barrage\r
Molare, Stella Alpina\r
Molare, Campi\r
Molare, Barescia\r
Molare, Paese\r
Moleno\r
Moléson-sur-Gruyères\r
Moléson-sur-Gruyères (funi)\r
Molinazzo di Monteggio,Ramello\r
Molinazzo di Monteggio, Lisora\r
Molinazzo di Monteggio,Ressega\r
Molinazzo di Monteggio, Posta\r
Molinis, Dorf\r
Molinis, Quadra\r
Mollendruz, Fontaine froide\r
Mollendruz, col\r
Mollens VD, Forchy\r
Mollens VD, Les Chaux\r
Mollens VD, village\r
Mollens VD, Champou\r
Mollens VS, Panorama\r
Mollens VS, bif. Aminona\r
Mollens VS, St-Maurice-Laques\r
Mollens VS\r
Mollie-Margot, centre\r
Mollis, Haltli\r
Mollis, Kirchplatz\r
Mollis, Chapellenstutz\r
Mollis, Kanalstrasse\r
Mollis, Oberrütelistrasse\r
Mollis, Vorderdorf\r
Mollis, Post\r
Mollis, Winden\r
Mollis, Baumgartenstrasse\r
Mollis, Beglingen\r
Molondin, village\r
Mols, Bahnhof\r
Mols (See)\r
Mon, avant porta\r
Mon, plaz\r
Mönchaltorf, Huebstock\r
Mönchaltorf, Traube\r
Mönchaltorf, Wihalde\r
Mönchaltorf, Mönchhof\r
Mönchaltorf, Langenmatt\r
Mönchaltorf (See)\r
Mondacce\r
Mondada (Bavona)\r
Monnaz, village\r
Monnaz, Trésy\r
Mont Bonvin\r
Mont Major\r
Mont Noble\r
Mont-Crosin, restaurants\r
Mont-Crosin, Le Sergent\r
Mont-Crosin, col\r
Mont-de-Buttes\r
Mont-Fort\r
Mont-Gelé\r
Mont-la-Ville, Le Battoir\r
Mont-la-Ville, poste\r
Mont-Pèlerin, funi\r
Mont-Pèlerin\r
Mont-Soleil (funiculaire)\r
Mont-sur-Rolle, Bugnaux\r
Mont-sur-Rolle, Sans Souci\r
Mont-sur-Rolle, La Ferme\r
Mont-sur-Rolle, église\r
Mont-sur-Rolle, Bellefontaine\r
Mont-sur-Rolle, Mont-Dessus\r
Mont-sur-Rolle,Maison de Ville\r
Mont-sur-Rolle, Jeune Suisse\r
Mont-sur-Rolle, Les Granges\r
Mont-Tramelan, La Paule\r
Mont-Tramelan, scierie\r
Mont-Tramelan, Ferme Houriet\r
Mont-Tramelan, b. Les Breuleux\r
Montagnola, Ghiera\r
Montagnola, Poporino\r
Montagnola, Paese\r
Montagnola, Il Maggio\r
Montagnola, Pianroncate\r
Montagnola, Bellevue\r
Montagnon\r
Montagny, Les Arbognes\r
Montagny-la-Ville, école\r
Montagny-les-Monts, croisée\r
Montagny-les-Monts, école\r
Montagny-p.-Yv., Clos Lucens\r
Montagny-p.-Yv., Chamard poste\r
Montagny-p.-Yv., La Brinaz\r
Montagny-près-Yverdon, village\r
Montagny-près-Yverdon, Chamard\r
Montalchez, La Comballaz\r
Montalchez, centre du village\r
Montana, Maison Général Guisan\r
Montana, village\r
Montaubion, croisée\r
Montavon, La Vélie\r
Montavon, village\r
Montblesson, Centenaire\r
Montblesson, Perronnaz\r
Montbovon, gare\r
Montbovon\r
Montbrelloz, école\r
Montbrelloz, bif.\r
Montbrelloz, village\r
Montcherand, Usine électrique\r
Montcherand, poste\r
Montcherand, haut du village\r
Montcherand, Pique-Raisinets\r
Monte, Paese\r
Monte, Grotto del Lauro\r
Monte Brè\r
Monte Carasso, Urènn/Funivia\r
Monte Carasso, Cunvént\r
Monte Carasso, Camp di Nav\r
Monte Carasso (funivia)\r
Monte Generoso Vetta\r
Monte Lema\r
Monte San Salvatore\r
Monteggio, Tiradelza\r
Monteggio, Paese\r
Monteggio, Castello\r
Monteggio, Bivio Fornasette\r
Monteggio, Bruciata\r
Montenol, village\r
Montenol, école\r
Montenol, Prés-de-Montenol\r
Montet (Broye), Petit Montet\r
Montet (Broye), village\r
Montet (Glâne), Les Jordils\r
Montet (Glâne), village\r
Montet (Vully), La Fenette\r
Montet (Vully), village\r
Montezillon, La Guérite\r
Montezillon, Les Pommerets\r
Montfaucon, poste\r
Montfaucon, Péchillard\r
Montfaucon, bif. Les Enfers\r
Mönthal, Unterdorf\r
Montherod, village\r
Montherod, Battoir\r
Monthey, Aunaires\r
Monthey, Poisieux\r
Monthey, place centrale\r
Monthey, En Place\r
Monthey, piscine\r
Monthey, Tronchet\r
Monthey, Rte de l'Ille-au-Bois\r
Monthey, hôpital\r
Monthey, Collège de l'Europe\r
Monthey, Reposieux\r
Monthey, Dailles\r
Monthey, Les Ilettes\r
Monthey, Malévoz\r
Monthey, Stade Pottier\r
Monthey, Trollietta\r
Monthey, Europe/Plantaud\r
Monthey\r
Monthey, home les Tilleuls\r
Monthey, Le Closillon\r
Monthey, centre sportif Verney\r
Monthey, Vers le Nant de Choëx\r
Monthey, Sous Hautavy\r
Monthey, Vieux-Pont\r
Monthey, gare CFF\r
Monthey Clos Donroux\r
Monthey-En Place\r
Monthey-Hôpital\r
Monthey-Ville, gare\r
Monthey-Ville\r
Monti di Fosano, Monti\r
Monti di Fosano, Oratorio\r
Monti di Fosano, Bv. Piazzogna\r
Montignez, bif. Grandgourt\r
Montignez\r
Montlingen, Hirschen\r
Montlingen, Wiesenweg\r
Montlingen, Reitzentrum\r
Montlingen, Tänneli\r
Montlingen, Bitziweg\r
Montlingen, Letzau\r
Montlingen, Anger\r
Montmagny, croisée\r
Montmollin, Haut-du-Village\r
Montmollin, Route de la Tourne\r
Montpreveyres, Riau-Graubon\r
Montpreveyres, village\r
Montpreveyres, Balances\r
Montreux, Le Taux\r
Montreux, midi\r
Montreux, débarcadère\r
Montreux, rue du Marché\r
Montreux, rue du Centre\r
Montreux, Théâtre Mtx Riviera\r
Montreux, rue de la Gare\r
Montreux, av. Nestlé\r
Montreux, Doyen-Bridel\r
Montreux, Vernex-Dessus\r
Montreux, Le Pont\r
Montreux, Belmont\r
Montreux, Ballallaz\r
Montreux, Vernex\r
Montreux, Vuarennes\r
Montreux, La Paix\r
Montreux, La Corsaz\r
Montreux, gare\r
Montreux, Marché\r
Montreux, Bon-Port\r
Montreux, Les Planches\r
Montreux, rue Industrielle\r
Montreux, Centre des Congrès\r
Montreux, casino\r
Montreux, Escaliers de la Gare\r
Montreux\r
Montreux (lac)\r
Montreux-Collège\r
Montreux-Les Planches\r
Montricher,Fondation Michalski\r
Montricher, Petit Faubourg\r
Montricher, Grand Faubourg\r
Montricher, gare\r
Montricher, village\r
Montricher, Champet\r
Monts-de-Corsier, Dautère\r
Monts-de-Corsier, L'Hautigny\r
Monts-de-Corsier, Longpraz\r
Monts-de-Corsier, Mur-Blanc\r
Monts-de-Corsier, Banderette\r
Monts-de-Corsier, La Chaux\r
Montsevelier, village\r
Montsevelier, poste\r
Moos, Bahnhof\r
Moos\r
Moosalp\r
Moosegg, Hotel\r
Moosfluh\r
Moosleerau, Unterdorf\r
Moosleerau, Abzw.\r
Moosseedorf, Rest. Utiger\r
Moosseedorf\r
Morbio Inferiore, Polenta\r
Morbio Inferiore, Pascuritt\r
Morbio Inferiore, Campo Sport.\r
Morbio Inferiore, Piano\r
Morbio Inferiore, Serfontana\r
Morbio Inferiore, Via Vela\r
Morbio Inferiore, Posta\r
Morbio Inferiore, S. Lucia\r
Morbio Inferiore, Pianelle\r
Morbio Inferiore, Villette\r
Morbio Inferiore, Scuole Medie\r
Morbio Inferiore, Basilica\r
Morbio Inferiore, Ghitello\r
Morbio Inferiore, Fontanella\r
Morbio Superiore, Verana\r
Morbio Superiore, Posta\r
Morbio Superiore, Ponte Sagno\r
Morbio Superiore, zona Ronco\r
Morbio Superiore, Lattecaldo\r
Morbio Superiore, Chiavarino\r
Morbio Superiore, Croce\r
Morbio Superiore, Scuole\r
Morbio Superiore, Campagna\r
Morbio Superiore, Buée\r
Morbio Superiore, Chiesa\r
Morcote, Parco Scherrer\r
Morcote, Arbostora\r
Morcote, Cantine\r
Morcote, Preda dei Buchi\r
Morcote, Vedo\r
Morcote, La Canva\r
Morcote, Casa per Anziani\r
Morcote, Burò\r
Morcote, Piazza Grande\r
Morcote (lago)\r
Moreillon\r
Mörel, Schulhaus\r
Mörel, Luftseilbahn\r
Mörel\r
Mörel (Riederalpbahn)\r
Morens FR\r
Morgarten, Hotel\r
Morgarten, Eierhals\r
Morgarten, Haselmatt\r
Morgarten, Denkmal\r
Morgarten, Sydefade\r
Morgarten, Oberbüel\r
Morgarten Denkmal (See)\r
Morgarten Hotel (See)\r
Morgenholz\r
Morges, ch. du Bochet\r
Morges, Auguste-Forel\r
Morges, La Tour\r
Morges, Patinoire\r
Morges, Grosse-Pierre\r
Morges, Eglantine\r
Morges, Longeraie\r
Morges, Delay\r
Morges, Prélionne\r
Morges, St-Jean sud\r
Morges, Banc-Vert\r
Morges, de Beausobre\r
Morges, St-Louis\r
Morges, Blancherie\r
Morges, La Prairie\r
Morges, hôpital\r
Morges, Bief\r
Morges, gare\r
Morges, St-Jean nord\r
Morges, Riond-Bosson\r
Morges, Grassey\r
Morges, Moulin\r
Morges, Bellevue\r
Morges, temple\r
Morges, Charpentiers\r
Morges, Casino\r
Morges, En Bonjean\r
Morges, Vogéaz\r
Morges, Marcelin\r
Morges, Les Pétoleyres\r
Morges, Pâquis\r
Morges\r
Morges (lac)\r
Morges-St-Jean\r
Morgins, école\r
Morgins, Bayèse\r
Morgins, Chemin du Four\r
Morgins, Es-Cadraux\r
Morgins, Chemin Joli-Bois\r
Morgins, Le Géant / C. sportif\r
Morgins, Fenebet\r
Morgins, La Cergnat\r
Morgins, Chemin des Oiseaux\r
Morgins, Camping\r
Morgins, Les Buttes\r
Morgins, Télécabine\r
Morgins, Pierre du Four\r
Morgins, Chemin Brun\r
Morgins, Lac\r
Morgins, Chemin du Hameau\r
Morgins, Les Planoz\r
Morgins, Pont rte Forestière\r
Morgins, Chemin d'Arche\r
Morgins, En Archoz\r
Morgins, Rière\r
Morgins, le Corbeau\r
Morgins, poste\r
Morgins (La Foilleuse)\r
Morgins (Les Têtes)\r
Mörigen\r
Mörigen, Bahnhof\r
Möriken AG, Züriacker\r
Möriken AG, Schloss Wildegg\r
Möriken AG, Oberäsch\r
Möriken AG, Bösenrain\r
Möriken AG, Gemeindehaus\r
Möriken AG, Steinler\r
Morissen, Padrus\r
Morissen, center communal\r
Morissen, Mulin\r
Morissen, Cuschnaus\r
Mörlialp\r
Mörlialp (Talstation)\r
Morlon, En Perrey\r
Morlon, Eglise\r
Morlon, La Croix\r
Morlon, école/lac\r
Mornera\r
Morrens VD, village\r
Morschach, Wil\r
Morschach, Schwyzerhöhe\r
Morschach, Luftseilbahn\r
Morschach, Dorf\r
Morschach, Swiss Holiday Park\r
Morschach Talstat. (Luftseilb)\r
Mörschwil, Alberenberg\r
Mörschwil, Bitzi\r
Mörschwil, Altes Gemeindehaus\r
Mörschwil, Kirche\r
Mörschwil, Riederen\r
Mörschwil\r
Mörschwil, Lantschen\r
Mörschwil, Fahrn\r
Morteratsch\r
Morteratsch, Abzweigung\r
Morthey, En Rion\r
Morthey, Pont-de-Pierre\r
Morthey, centre\r
Morthey, Préplan\r
Mosen, Campingstrasse\r
Mosen\r
Mosen (See)\r
Mosnang, Schreinersberg\r
Mosnang, Aufeld\r
Mosnang, Winkeln\r
Mosnang, Dietenwil\r
Mosnang, Dorf\r
Mosnang, Grütli\r
Mosnang, Weiher\r
Mosogno, Sotto\r
Mosogno, Chiosso\r
Mosogno, Barione\r
Mosogno, Paese\r
Mossel, village\r
Mossel, bif.\r
Mot da Ri\r
Môtier (Vully), village\r
Môtier (Vully)\r
Môtiers, collège\r
Môtiers NE\r
Motta Naluns\r
Mottec\r
Motto Bartola\r
Motto-Ludiano\r
Moudon, Belflori\r
Moudon, Chalet-Blanc\r
Moudon, Sorbiers\r
Moudon, Le Vallon\r
Moudon, L'Ochette\r
Moudon, Verger\r
Moudon\r
Moudon, Grange-Verney\r
Moudon, La Prairie\r
Moudon, av. de Bussy\r
Moudon, gare\r
Moutier, Les Fauvettes\r
Moutier, Chantemerle\r
Moutier, Petite-Fin\r
Moutier, Suisse Est\r
Moutier, Aux Laives\r
Moutier\r
Moutier, Suisse Ouest\r
Moutier, Hôpital\r
Moutier, patinoire\r
Moutier, Banque cantonale\r
Moutier, La Foule\r
Moutier, Château\r
Moutier, Rue de Soleure\r
Moutier, cimetière\r
Moutier, gare\r
Moutier, Place du Marché\r
Moutier, Hôtel de Ville\r
Moutier, Neusté\r
Moutier, Crèche\r
Moutier, Etoile\r
Movelier,Pl. de la Distillerie\r
Movelier, poste\r
Movelier, haut du village\r
Movelier, Place du 23 Juin\r
Mts-de-Corsier, Petit Hautigny\r
Mugena, Nava\r
Mugena, Paese\r
Muggio, Casarno\r
Muggio, Bivio Casiroli\r
Muggio, Meri\r
Muggio, Camasciora\r
Muggio, Marenca\r
Muggio, Fontane\r
Muggio, Cassino\r
Muggio, Paese\r
Muggio, Butigia\r
Muggio, Casa Leone\r
Muhen, Bahnhof\r
Muhen\r
Muhen Nord, Bahnhof\r
Muhen Nord\r
Mühlau\r
Mühlau, Dorf\r
Mühlebach (Goms), Dorf\r
Mühlebach (Goms), Ernergalen\r
Mühlebach (Goms), Brücke\r
Mühlebach (Goms), beim Kreuz\r
Mühleberg, Leimere\r
Mühleberg, Steinriesel\r
Mühleberg, Post\r
Mühleberg, Dällenbach\r
Mühleberg, Dorf\r
Mühleberg, Fuchsenried\r
Mühleberg, Oberei\r
Mühleberg, Buttenried\r
Mühleberg, Säge\r
Mühledorf BE, Dorf\r
Mühledorf BE, Müliacher\r
Mühledorf BE, Rüsch\r
Mühledorf SO, Kirche\r
Mühledorf SO, Sternen\r
Mühlehorn, Oberdorf\r
Mühlehorn, Beerenboden\r
Mühlehorn\r
Mühlehorn, Bahnhof\r
Mühlehorn, Dorf\r
Mühlehorn, Stutz\r
Mühlehorn, Hohrain\r
Mühlehorn (See)\r
Mühlethal, Weiher\r
Mühlethal, Milchhüsli\r
Mühlethal, Linden\r
Mühlethurnen, Adler\r
Mühlethurnen, Mühle\r
Mühlethurnen, Pontel\r
Mühlrüti, Mühle\r
Mühlrüti, Hulftegg\r
Mühlrüti, Dorf\r
Mülchi, Spritzenhaus\r
Mulegns, vischnanca\r
Mülenen, Bahnhof\r
Mülenen\r
Mülenen, Suldbrücke\r
Mülenen, Chappelegand\r
Mülenen (Niesenbahn)\r
Mulinatsch\r
Mülkerblatten\r
Muller\r
Mullerenberg\r
Müllheim, Ober Hungerbüel\r
Müllheim Dorf, Rosengasse\r
Müllheim Dorf, Himmelbrunnen\r
Müllheim Dorf, Kirche\r
Müllheim Dorf, Alterssiedlung\r
Müllheim Dorf, Grüneck\r
Müllheim Dorf, Post\r
Müllheim Dorf, Felsenau\r
Müllheim Dorf, Bahnhofstrasse\r
Müllheim-Wigoltingen\r
Müllheim-Wigoltingen, Bahnhof\r
Mülligen, Löh\r
Mülligen, Stock\r
Mülligen, Rösslimatte\r
Mümliswil, Lobisei\r
Mümliswil, Kammfabrik\r
Mümliswil, Schulhaus\r
Mümliswil, Bank\r
Mumpé Medel, spartavias\r
Mumpé Tujetsch, Via Alpsu\r
Mumpé Tujetsch\r
Mumpf, Dorf\r
Mumpf, Bahnhofstrasse\r
Mumpf, Bahnhof\r
Mumpf, Ankengasse\r
Mumpf, Adlerplatz\r
Mumpf\r
Münchenbuchsee, Lindenweg\r
Münchenbuchsee, Kirche\r
Münchenbuchsee, Schönegg\r
Münchenbuchsee, Mätteli\r
Münchenbuchsee, Coop\r
Münchenbuchsee, Sagi\r
Münchenbuchsee, Bahnhof\r
Münchenbuchsee\r
Münchenbuchsee, Kipfgasse\r
Münchenbuchsee, Hofwilstrasse\r
Münchenbuchsee, Hüslimoos\r
Münchenbuchsee, Buechlimatt\r
Münchenbuchsee, Waldegg\r
Münchenstein, Neuewelt\r
Münchenstein, Schaulager\r
Münchenstein, Elektra Birseck\r
Münchenstein, Limmeren\r
Münchenstein, Pumpwerkstrasse\r
Münchenstein, Gstad\r
Münchenstein, Heiligholz\r
Münchenstein\r
Münchenstein, Birseckstrasse\r
Münchenstein, Freilager\r
Münchenstein, Florastrasse\r
Münchenstein, Grabenacker\r
Münchenstein, Gartenstadt\r
Münchenstein, Zollweiden\r
Münchenstein, Spengler\r
Münchenstein, Dorf\r
Münchenstein, Hofmatt\r
Münchenstein, Bahnhof\r
Münchenstein, APH Hofmatt\r
Münchenstein, Friedhof\r
Münchenstein, Schlossmatt\r
Münchenstein, Loogstrasse\r
Münchenstein, Sportplatz Au\r
Münchenstein, MFP\r
Münchenstein, Zelgweg\r
Münchenwiler, Dorf\r
Münchenwiler, Bahnhof\r
Münchenwiler-Courgevaux\r
Münchwilen AG, Dorfplatz\r
Münchwilen AG, Dell\r
Münchwilen Pflegeheim\r
Münchwilen TG, Brunnenstrasse\r
Münchwilen TG, Sirnacherstr.\r
Münchwilen TG, Bahnhof Nord\r
Münchwilen TG, Bahnhof Süd\r
Münchwilen TG, Oberhofen\r
Münchwilen TG\r
Münchwilen TG, Eschlikonerstr.\r
Mund, Dorf\r
Mund, Brunnen\r
Mund, Kummegga\r
Mund, untere Wartfluh\r
Mund, Bachtola\r
Münsingen, Neuhaus\r
Münsingen, Industrie/USM\r
Münsingen, PZM West\r
Münsingen, Dorfmatt\r
Münsingen, Erlenauweg\r
Münsingen, Brückreuti\r
Münsingen, Aarweg\r
Münsingen, Sägematt\r
Münsingen, Juraweg\r
Münsingen, Bärenmatte\r
Münsingen, Spital\r
Münsingen, Höheacker\r
Münsingen, Schützenhaus\r
Münsingen, Bächlen\r
Münsingen, PZM Rondell\r
Münsingen, Sonnhalde\r
Münsingen, PZM\r
Münsingen, Aeschistrasse\r
Münsingen, Zelgweg\r
Münsingen, Krankenhausweg\r
Münsingen, Kapellenweg\r
Münsingen, Lindenweg\r
Münsingen, Lorraine\r
Münsingen, Friedhof\r
Münsingen, Schwand\r
Münsingen\r
Münsingen, Finkenweg\r
Münsingen, Erlenau\r
Münsingen, Walke\r
Münsingen, Zwischengiesse\r
Münsingen, Chäsi\r
Münsingen, Badi\r
Münsingen, Schöneggweg\r
Münsingen, Rosenweg\r
Münsingen, Stierenmatte\r
Münsingen, Allmendweg\r
Münsingen, Schlossmatt\r
Münsingen, Bärenstutz\r
Münsingen, Au\r
Münsingen, Trimsteinstrasse\r
Münsingen, Dorfplatz\r
Münsingen, Bahnhof\r
Münster VS, Schulhaus\r
Münster VS\r
Münsterlingen, Spitaleingang\r
Münsterlingen, Nonnenpförtli\r
Münsterlingen Spital\r
Münsterlingen-Scherzingen\r
Munt da San Murezzan\r
Muntatsch\r
Muntelier, Expodrom\r
Muntelier, Schloss\r
Muntelier-Löwenberg, Station\r
Muntelier-Löwenberg\r
Müntschemier, Dorf\r
Müntschemier\r
Muolen, Sonnental\r
Muolen, Bahnhof\r
Muolen, Dorf\r
Muolen, Hirschen\r
Muolen, Bahnhofstrasse\r
Muolen\r
Muotathal, Hölloch\r
Muotathal, Militärspital\r
Muotathal, Lustnau\r
Muotathal, Stützli\r
Muotathal, Sternen\r
Muotathal, Balm\r
Muotathal, Säge\r
Muotathal, Föllmisbrücke\r
Muotathal, Buebenmatt\r
Muotathal, hintere Brücke\r
Muotathal, Schulhaus\r
Muotathal, Weid\r
Muotathal, Nuschlau\r
Muotathal, Post\r
Muotta Rodunda\r
Muottas Muragl\r
Mur, village\r
Muralto, Bellavista\r
Muralto, Residenza Montana\r
Muralto, Palazzo dei Congressi\r
Muralto, Croce Bianca\r
Muralto, Via Pioda\r
Muralto, Al Parco\r
Muralto, Casa S. Agnese\r
Muralto, Lorio\r
Muralto, Via Sociale\r
Muralto, Simposio\r
Muraz (Collombey), ch. Andains\r
Muraz (Collombey), Raffinerie\r
Muraz (Collombey), Millière\r
Muraz (Collombey), Pré Court\r
Muraz (Collombey), Paquaire\r
Muraz (Collombey), Bochets\r
Muraz (Collombey), Pré Géroux\r
Murg, Bahnhof\r
Murg\r
Murg Ost (See)\r
Murg West (See)\r
Murgenthal, Hohwart\r
Murgenthal\r
Murgenthal, Bahnhof\r
Murgenthal, Fahracker\r
Murgenthal, Gadligen\r
Murgenthal, Gemeindehaus\r
Murgenthal, Moosmatt\r
Murgenthal, Rank\r
Muri AG, Egg\r
Muri AG, Marktstrasse\r
Muri AG, Grüth\r
Muri AG, Dorf\r
Muri AG, Spital\r
Muri AG\r
Muri AG, Bachmatten-Schulhaus\r
Muri AG, Luzernstrasse\r
Muri AG, Kreisel\r
Muri AG, im Roos\r
Muri AG, Grindelstrasse\r
Muri AG, Industriestrasse\r
Muri AG, Lindenberg\r
Muri AG, Industriegebiet\r
Muri AG, Bahnhof\r
Muri b. Bern, Gümligenfeld\r
Muri b. Bern, Waldried\r
Muri b. Bern, Villette\r
Muri b. Bern, Hübeliweg\r
Muri b. Bern, Kräyigen\r
Muri bei Bern\r
Muriaux\r
Muriaux, gare\r
Murist, village\r
Mürren (Allmendhubelbahn)\r
Mürren (Schilthornbahn)\r
Mürren BLM\r
Mürren Unterwald\r
Murtèl\r
Murten, Burg\r
Murten, Neugut\r
Murten, Bernstrasse\r
Murten, Orientierungsschule\r
Murten, Hafen\r
Murten, Combette\r
Murten, Löwenberg Einkaufsztr.\r
Murten, Museum\r
Murten, Merlachfeld\r
Murten, Schwimmbad\r
Murten/Morat, Bahnhof\r
Murten/Morat\r
Murten/Morat (Schiff/bateau)\r
Murzelen, Dorf\r
Murzelen, Sandbühl\r
Museo doganale svizzero (lago)\r
Müstair, Somvih\r
Müstair, scoula\r
Müstair, posta\r
Müstair, cunfin\r
Müstair, Clostra Son Jon\r
Müswangen, Sonnmatt\r
Müswangen, Dorf\r
Mutrux, anc. poste\r
Mutrux, Le Ravin (Sylvabella)\r
Mutta\r
Muttbach-Belvédère\r
Mutten, Stafel\r
Mutten, Oberdorf\r
Mutten, Unterdorf\r
Muttenz, Bizenen\r
Muttenz, Schweizerhalle\r
Muttenz, Freidorf\r
Muttenz, Käppeli\r
Muttenz, Rothausstrasse\r
Muttenz, Zum Park\r
Muttenz, Bahnhof\r
Muttenz, Kriegacker\r
Muttenz, Auhafen\r
Muttenz, Kirschgartenstrasse\r
Muttenz, Mittenza\r
Muttenz, Hallenbad\r
Muttenz, Fachhochschule\r
Muttenz, Rothus\r
Muttenz, Lachmatt\r
Muttenz\r
Muttenz, Industriepark\r
Muttenz, Pantheon\r
Muttenz, Hardstrasse\r
Muttenz, Schützenhausstrasse\r
Muttenz, Waldhaus\r
Muttenz, Hagnau\r
Muttenz, Unterwart\r
Muttenz, Untere Hard\r
Muttenz, Dorf\r
Muttleren\r
Muzzano, Paese\r
Naas (See)\r
Näfels, Freulerpalast\r
Näfels, Lintharena\r
Näfels, Letz\r
Näfels, Kino\r
Näfels, Oberdorf\r
Näfels, Krumm\r
Näfels, Post\r
Näfels, Schönegg\r
Näfels-Mollis\r
Näfels-Mollis, Bahnhof\r
Nagens\r
Nagens Sura\r
Nänikon, Heuwinkelstrasse\r
Nänikon, Grossriet\r
Nänikon-Greifensee\r
Nante\r
Naters, Massa-Wildi\r
Naters, Bine\r
Naters, Kelchbach\r
Naters, Junkerbiel\r
Naters, Sportplatz\r
Naters, Venezia\r
Naters, Schulhaus Bammatte\r
Naters, Rafji\r
Naters, Judengasse\r
Naters, Aletsch Campus\r
Naters, Tünnelstrasse\r
Naters, Massegga\r
Naters, Bellavista\r
Naters, Birchegga\r
Naters, Mehlbaum\r
Naters, Schwendibiel\r
Naters, Tschill-Bammatte\r
Naters, Saaser Müra\r
Naters, Bammatte\r
Naters, Amerika\r
Naters, Seniorenzentrum\r
Naters, Rottubrigga\r
Naters, Moos\r
Naters, Massaegg\r
Naters, Ahorn\r
Naters, Fiischter-Fäld\r
Naters, Naterloch\r
Naters, Weingarten\r
Naters, Sengg\r
Naters, alte Post\r
Naters, Panorama\r
Naters, Bitschji\r
Naters, Marktplatz\r
Nätschen, Abzw. Bahnhof\r
Nätschen\r
Nätschen (Gondelbahn)\r
Nax, Creux-de-Nax\r
Nax, Villettaz\r
Nax, Via Ferrata\r
Nax\r
Nax, La Crettaz\r
Nax, piscine\r
Nax, Erbioz\r
Nax, centre\r
Naz, laiterie\r
Nebikon, Maschinenfabrik\r
Nebikon\r
Nebikon, Bahnhof West\r
Nebikon, Bahnhof Ost\r
Nebikon, Käserei\r
Necker, Grütli\r
Neerach, Post\r
Neerach, Gemeindehaus\r
Neftenbach, Wolfzangen\r
Neftenbach, Tössallmend\r
Neftenbach, Herrgass\r
Neftenbach, Wolfgässli\r
Neftenbach, alte Post\r
Neftenbach, Chlimberg\r
Neggio, Bivio per Neggio\r
Neggio, Paese\r
Neirivue, gare\r
Neirivue\r
Nendeln, Tonwarenfabrik\r
Nendeln, Bahnhof\r
Nendeln, Clunia\r
Nendeln, Oberwiesen\r
Nendeln, Kohlmahd\r
Nennigkofen, Rössli\r
Nenzlingen, Unterdorf\r
Nenzlingen, Dorfplatz\r
Neschwil, Post\r
Nesselboden\r
Nesselnbach, Unterdorf\r
Nesselnbach, Mitteldorf\r
Nessental, Marmorsäge\r
Nessental, Schwendi\r
Nessental, Dorf\r
Nessental, Triftbahn\r
Nesslau, Dicken\r
Nesslau, Germen\r
Nesslau-Neu St. Johann\r
Nesslau-Neu St.Johann, Bahnhof\r
Netstal, Wiggis Park\r
Netstal, Gemeinde\r
Netstal, Wydeli\r
Netstal, Altersheim\r
Netstal, Kublihoschet\r
Netstal, Post\r
Netstal, Bahnhof\r
Netstal\r
Neu St. Johann, Stocken\r
Neu St. Johann, Klosterkirche\r
Neuägeri, Schmittli\r
Neuägeri, Alte Post\r
Neuägeri, Rössli\r
Neubrück VS\r
Neuchâtel, gare sud\r
Neuchâtel, Esplanade du Mail\r
Neuchâtel, Les Carrels\r
Neuchâtel, Pierre-à-Bot\r
Neuchâtel, Plan\r
Neuchâtel, Temple Valangines\r
Neuchâtel, Lycée D.-Rougemont\r
Neuchâtel, Verger-Rond\r
Neuchâtel, St-Honoré\r
Neuchâtel, Matile 34\r
Neuchâtel, Av. des Alpes\r
Neuchâtel, Cheminée\r
Neuchâtel, Bachelin\r
Neuchâtel, Chemin des Mulets\r
Neuchâtel, Rue de la Côte\r
Neuchâtel, Collège des Parcs\r
Neuchâtel, Oriette\r
Neuchâtel, Rochettes\r
Neuchâtel, Numa-Droz\r
Neuchâtel\r
Neuchâtel, Vauseyon\r
Neuchâtel, La Coudre (FUNI)\r
Neuchâtel, Côte (FUNI)\r
Neuchâtel, Boine (FUNI)\r
Neuchâtel, Ecluse (FUNI)\r
Neuchâtel, Caselle\r
Neuchâtel, Poudrières\r
Neuchâtel, Porte-des-Acacias\r
Neuchâtel, Trois-Chênes\r
Neuchâtel, Denis-de-Rougemont\r
Neuchâtel, Pont des Parcs\r
Neuchâtel, Matile 16\r
Neuchâtel, Piscines\r
Neuchâtel, Université\r
Neuchâtel, CSEM/Bas-du-Mail\r
Neuchâtel, Maladière\r
Neuchâtel, Serrières (bus)\r
Neuchâtel, Ch. des Valangines\r
Neuchâtel, Battieux\r
Neuchâtel, Louis-Favre\r
Neuchâtel, Jardin-Anglais\r
Neuchâtel, Hôpital Pourtalès\r
Neuchâtel, St-Nicolas MEN\r
Neuchâtel, Liserons\r
Neuchâtel, Marronniers\r
Neuchâtel, Fontaine-André\r
Neuchâtel, Régional\r
Neuchâtel, Microcity\r
Neuchâtel, Saars 55\r
Neuchâtel, Rocher\r
Neuchâtel, Terreaux Muséum\r
Neuchâtel, gare nord\r
Neuchâtel, Stand\r
Neuchâtel, Av. des Cadolles\r
Neuchâtel, Beauregard\r
Neuchâtel, Tivoli\r
Neuchâtel, Bas-de-la-Main\r
Neuchâtel, Poste\r
Neuchâtel, Rosière\r
Neuchâtel, Châble\r
Neuchâtel, Boine\r
Neuchâtel, Saars 17\r
Neuchâtel, Portes-Rouges\r
Neuchâtel, Monruz\r
Neuchâtel,Vallon de l'Ermitage\r
Neuchâtel, Place Pury\r
Neuchâtel, Case à Chocs\r
Neuchâtel, Cimetière\r
Neuchâtel, La Coudre\r
Neuchâtel, Gouttes d'or\r
Neuchâtel, Falaises\r
Neuchâtel, Nid-du-Crô\r
Neuchâtel, Riveraine\r
Neuchâtel, Port-Roulant\r
Neuchâtel, Plan (FUNI)\r
Neuchâtel, écluse\r
Neuchâtel, Draizes\r
Neuchâtel, Grise-Pierre\r
Neuchâtel, Champ-Coco\r
Neuchâtel, Acacias\r
Neuchâtel, Prébarreau\r
Neuchâtel, Fahys\r
Neuchâtel, Pierre-qui-Roule\r
Neuchâtel, Croix-du-Marché\r
Neuchâtel, Ste-Hélène\r
Neuchâtel, Favarge\r
Neuchâtel (bateau)\r
Neuchâtel Champ-Bougin\r
Neuchâtel Evole\r
Neuchâtel Place Pury Littorail\r
Neuchâtel Port-de-Serrières\r
Neuchâtel Serrières Ruau\r
Neuchâtel-gare (FUNI)\r
Neuchâtel-Serrières\r
Neuchâtel-Université (FUNI)\r
Neudorf, Paradisli\r
Neudorf, Post\r
Neudorf, Dorf\r
Neudorf, Gormund\r
Neue Forch\r
Neuendorf, Migrosstrasse\r
Neuendorf, Hardeck\r
Neuendorf, Migros\r
Neuendorf, Industrie\r
Neuendorf, Unterdorf\r
Neuendorf, Kirche\r
Neuendorf, Schulhaus\r
Neuendorf, Weier\r
Neuenegg, Tennis\r
Neuenegg, Striten\r
Neuenegg, Bahnhof\r
Neuenegg\r
Neuenegg, Flamingo\r
Neuenegg, Dorfzentrum\r
Neuenegg, Louelemoos\r
Neuenhof, Posthorn\r
Neuenhof, Klosterrüti\r
Neuenhof, Webermühle\r
Neuenhof, Kreuzstein\r
Neuenhof, Eich\r
Neuenhof, Kirchfeld\r
Neuenhof, Landhaus\r
Neuenhof\r
Neuenkirch, Feldmatt\r
Neuenkirch, Weierhüsli\r
Neuenkirch, Kirche\r
Neuenkirch, Lippenrüti\r
Neuenkirch, Post\r
Neuenkirch, Klösterli\r
Neuhaus (Unterseen) (See)\r
Neuhaus bei Hinteregg\r
Neuhaus SG, Post\r
Neuhaus SG, Schwärzi\r
Neuhaus SG, Hinterwis\r
Neuhaus SG, Lenzikon\r
Neuhaus SG, Industrie\r
Neuhaus SG, Bürg\r
Neuhaus SG, Ochsen\r
Neuhausen, Zuba\r
Neuhausen, Bahnhof SBB\r
Neuhausen, Bahnhofstr.\r
Neuhausen, Fernblick\r
Neuhausen, Rheinstrasse\r
Neuhausen, Neue Welt\r
Neuhausen, Zentrum\r
Neuhausen, Scheidegg\r
Neuhausen, Durstgraben\r
Neuhausen, Gemeindewiesen\r
Neuhausen, Burgunwiese\r
Neuhausen, Hohfluh\r
Neuhausen, Rhenania\r
Neuhausen, Rhytech\r
Neuhausen, Industrieplatz\r
Neuhausen, Trubegüetli\r
Neuhausen, Engestrasse\r
Neuhausen, Gemeindehaus\r
Neuhausen, Herbstäcker\r
Neuhausen\r
Neuhausen, Kreuzstrasse\r
Neuhausen, Rheinhof\r
Neuhausen Bad Bf\r
Neuhausen Rheinfall\r
Neuheim, Baarburgrank\r
Neuheim, Tal\r
Neuheim, Dorf\r
Neuheim, Hinterburg\r
Neuheim, Falken\r
Neuheim, Felderhus\r
Neuheim, Sarbach\r
Neukirch (Egnach), Ost\r
Neukirch (Egnach), Dorf\r
Neukirch (Egnach), Haldenring\r
Neukirch an der Thur, Dorf\r
Neukirch-Egnach, Bahnhof\r
Neukirch-Egnach\r
Neumühle\r
Neumühle, Dorf\r
Neunkirch\r
Neunkirch, Bahnhof\r
Neunkirch, Schulstrasse\r
Neunkirch, Schweizerbund\r
Neuthal\r
Neuthal bei Bäretswil\r
Neuwilen, Dorf\r
Neuwilen, Käserei\r
Neyruz FR, village\r
Neyruz FR\r
Neyruz-sur-Moudon, collège\r
Neyruz-sur-Moudon,Les Rutannes\r
Nidau, Grasgarten\r
Nidau, Kirche/Eglise\r
Nidau, Schlossstrasse\r
Nidau, Strandweg\r
Nidau, Burgerallee\r
Nidau, Milanweg/Chemin Milan\r
Nidau, Schloss/Château\r
Nidau, Guglerstr./Rue Gugler\r
Nidau\r
Nidau, Herrenmoosweg\r
Nidau, Bahnhof\r
Nidau, Ruferheim\r
Nidau (Schiff)\r
Nidau Beunden\r
Nidau Beunden, Bahnhof\r
Nidfurn, Abzw. Bahnhof\r
Nidfurn-Haslen, Bahnhof\r
Nidfurn-Haslen\r
Nieder- und Oberurnen\r
Niederbauen\r
Niederbipp, Braui-Kreisel\r
Niederbipp, Dorf\r
Niederbipp, Holzhäusern\r
Niederbipp, Aengi\r
Niederbipp, Scharnageln\r
Niederbipp\r
Niederbipp Dorf\r
Niederbipp Industrie\r
Niederbuchsiten, Linde\r
Niederbuchsiten, Sonne\r
Niederbüren, Freizeitpark\r
Niederbüren, Dorf\r
Niederbüren, Museum\r
Niederbüren, Nellen\r
Niederbüren, Husen\r
Niederbüren, Sorntal\r
Niederdorf, Station\r
Niederdorf, Hirschlang\r
Niedergampel,Zivilschutzanlage\r
Niedergesteln, Kiesfang\r
Niedergesteln, Industrie\r
Niedergesteln, Gesch\r
Niedergesteln, Weiderli\r
Niedergesteln, Wannumoos\r
Niederglatt ZH,altes Schulhaus\r
Niederglatt ZH, Nöschikon\r
Niederglatt ZH, Seeblerstrasse\r
Niederglatt ZH\r
Niederglatt ZH, Sonnenbergstr.\r
Niederglatt ZH, Zentrum\r
Niedergösgen, Bank\r
Niedergösgen, Jurastrasse\r
Niedergösgen, Mühledorf\r
Niedergösgen, Falkenstein\r
Niedergösgen, Knoblez\r
Niedergösgen, Kraftwerk\r
Niedergrächen\r
Niedergut\r
Niederhasli, Bahnhof\r
Niederhasli, Heisel\r
Niederhasli, Dorf\r
Niederhasli, Hofstetterstrasse\r
Niederhasli, Nassenwil\r
Niederhasli\r
Niederhäusern\r
Niederhelfenschwil, Gemeinde\r
Niederhelfenschwil, Neudorf\r
Niederhelfenschwil, Waldhof\r
Niederhelfenschwil, Sonnenberg\r
Niederhelfenschwil, Dorf\r
Niederhof, Feuerwehrdepot\r
Niederhorn\r
Niederlenz, Hetex\r
Niederlenz, Dorfplatz\r
Niederlenz, Staufbergstrasse\r
Niederlenz, Schürz\r
Niedermuhlern, Käserei\r
Niedermuhlern, Bachmühle\r
Niedermuhlern, Baumgärtli\r
Niedermuhlern, Uecht\r
Niedermuhren, Burg\r
Niedermuhren, Dorf\r
Niederneunforn, Dorf\r
Niederönz, Gemeindehaus\r
Niederönz, Eggen\r
Niederönz, Schürchhaus\r
Niederösch, Oberdorf\r
Niederösch, Unterdorf\r
Niederrickenbach Dorf\r
Niederrickenbach Station\r
Niederrickenbach Talstation\r
Niederried\r
Niederried (See)\r
Niederried b.I'laken, Wendepl\r
Niederried b.I'laken, Dorf\r
Niederrohrdorf, Fohrhölzli\r
Niederrohrdorf, Holzrüti\r
Niederrohrdorf, Vogelrüti\r
Niederrohrdorf, Egro\r
Niederrohrdorf, Hiltimatt\r
Niederrohrdorf,Gemeindezentrum\r
Niederrohrdorf, Hiltiberg\r
Niederrohrdorf, Welschland\r
Niederrohrdorf, Oberdorf\r
Niederscherli, Halten\r
Niederscherli, Farnernstrasse\r
Niederscherli, Bahnhof\r
Niederscherli, Burisholzweg\r
Niederscherli\r
Niederscherli, Zentrum\r
Niederschlacht\r
Niederschlag\r
Niederstocken, Säge\r
Niederstocken, Stockhorn\r
Niederstocken, Schwand\r
Niederteufen, alte Post\r
Niederteufen\r
Niederteufen, Schwanen\r
Niederteufen, Sternen b. T.\r
Niederteufen, Battenhaus\r
Niederurnen, Ochsenplatz\r
Niederurnen, Badstrasse\r
Niederurnen, Friedhof\r
Niederurnen\r
Niederurnen, Fennen\r
Niederurnen, Ziegelbrückstr.\r
Niederuzwil, Marienfried\r
Niederuzwil, Sonnmatt\r
Niederuzwil, Post\r
Niederuzwil, Gaswerk\r
Niederuzwil, Luxenburg\r
Niederuzwil, Friedeck\r
Niederuzwil, Augarten\r
Niederuzwil, Wespiwiese\r
Niederuzwil, Bienenstrasse\r
Niederwald, Bahnhof\r
Niederwald\r
Niederwangen, Schule Ried\r
Niederwangen, Bahnhof\r
Niederwangen, Guetmatt\r
Niederwangen, Moos\r
Niederwangen, Meriedweg\r
Niederwangen, Riedmoosbrücke\r
Niederwangen, Brüggbühlstrasse\r
Niederwangen, Erle\r
Niederwangen, Papillon\r
Niederwangen\r
Niederwangen, Hallmatt Parc\r
Niederwangen, Riedmoosstrasse\r
Niederwangen, Tubetränki\r
Niederweningen\r
Niederweningen, Bahnhof\r
Niederweningen, Dorf\r
Niederweningen Dorf\r
Niederwil AG, Gnadenthal\r
Niederwil AG, Zentrum\r
Niederwil SG, Oberhus\r
Niederwil SG, Wiesental\r
Niederwil SG, Bergwis\r
Niederwil SG, Büelen\r
Niederwil SG, Dorf\r
Niederwil SO, Dorf\r
Niederwil SO, Feuerwehrmagazin\r
Niederwil TG, Egelsee\r
Niederwil TG, Dorf\r
Niederwil ZH\r
Nierlet-les-Bois, Prali Simon\r
Nierlet-les-Bois, centre\r
Niesen Kulm\r
Niouc, Les Saints Innocents\r
Niouc, village\r
Niva (Vallemaggia)\r
Nivo, Paese\r
Nivo, Campagna\r
Niwenschulter\r
Nods, école\r
Nods, La Ruine\r
Nods, bas du village\r
Noës, Champsabé\r
Noës, Ecole\r
Noës, Ecossia\r
Noiraigue, gare\r
Noiraigue\r
Noranco, Asilo Bagion\r
Noranco, Furnas\r
Noranco, Paese\r
Noréaz, Pra-Moux\r
Noréaz, Le Haut\r
Noréaz, Laiterie\r
Nottwil, Abzw. Bahnhof\r
Nottwil, Büel\r
Nottwil, Eymatt\r
Nottwil\r
Nottwil, Oberdorf\r
Nottwil, Wysshüsli\r
Nottwil, Rüteli\r
Nottwil, SPZ\r
Novaggio, Clinica\r
Novaggio, Posta\r
Novaggio, Alla Colombina\r
Novaggio, Riveri\r
Novalles, collège\r
Novazzano, Chiesa\r
Novazzano, Bivio Boscherina\r
Novazzano, Ronco\r
Novazzano, Boscherina 1\r
Novazzano, Via Purà\r
Novazzano, Fercasa\r
Novazzano, Ponte Pobbia\r
Novazzano, Marcetto\r
Novazzano, Torraccia\r
Novazzano, Paese\r
Novazzano, Casate\r
Novazzano, Moronaccio\r
Noville, La Mouniaz\r
Noville, Les Saviez\r
Noville, Pré des Fourches\r
Noville, Collège\r
Noville, Chotron\r
Noville, Crebelley\r
Nufenen, Dorf\r
Nufenen Passhöhe\r
Nuglar, Dorfplatz\r
Nuglar, Neumatt\r
Nuglar, Neunuglar\r
Nuglar, Schulhaus\r
Nuglar, Orismühle\r
Nuglar, St. Pantaleonstrasse\r
Nunningen, See\r
Nunningen, Engi\r
Nunningen, Musslistrasse\r
Nunningen, Oberkirch\r
Nunningen, Engimühle\r
Nunningen, Post\r
Nunningen, Roderis\r
Nunningen, Riseten\r
Nuolen, Kirche\r
Nuolen, Ochsenboden\r
Nürensdorf, Lindauerstrasse\r
Nürensdorf, Berg\r
Nürensdorf, Chrüzstrass\r
Nürensdorf, Oberwil\r
Nürensdorf, Zentrum\r
Nürensdorf, Zentrum Süd\r
Nussbaumen AG, Markthof\r
Nussbaumen AG, Landschreiber\r
Nussbaumen AG, Breite\r
Nussbaumen TG, Schulhaus\r
Nussbaumen TG, Tobelbrunnen\r
Nusshof, Dorf\r
Nusshof, Hübel\r
Nuvilly, village\r
Nyon, Colovray\r
Nyon, gare\r
Nyon, route de Genève\r
Nyon\r
Nyon, Usine à Gaz\r
Nyon, Fontaine\r
Nyon, Musée du Léman\r
Nyon, Conservatoire\r
Nyon, plage\r
Nyon, centre ville\r
Nyon, chemin de Bourgogne\r
Nyon, ch. Valmont\r
Nyon, Les Jouvencelles\r
Nyon, chemin des Pensées\r
Nyon, route du Stand\r
Nyon, chemin des Plantaz\r
Nyon, route de Divonne\r
Nyon, rue St-Jean\r
Nyon, La Levratte\r
Nyon, chemin du Reposoir\r
Nyon, rte de l'Etraz\r
Nyon, Marens\r
Nyon, Mafroi\r
Nyon, route du Boiron\r
Nyon, Petit Perdtemps\r
Nyon, hôpital\r
Nyon, Martavaux\r
Nyon, Bel Automne\r
Nyon, Chantemerle\r
Nyon, chemin du Vallon\r
Nyon, chemin des Tines\r
Nyon, La Paix\r
Nyon, rte de Saint-Cergue\r
Nyon, Petite Prairie\r
Nyon, CESSOUEST\r
Nyon, Terre-Bonne\r
Nyon, route de Signy\r
Nyon, Terre-Bonne sud\r
Nyon, La Redoute\r
Nyon, ch. Monastier\r
Nyon, Le Groseillier\r
Nyon, Tattes d'Oie\r
Nyon (lac)\r
Obbürgen, Unter-Misli\r
Obbürgen, Grabacher\r
Obbürgen, alte Post\r
Obbürgen, Moos\r
Obbürgen, Abzw. Trogen\r
Ober Empächli\r
Oberaach, Bahnhof\r
Oberaach, Schlösslipark\r
Oberaach\r
Oberägeri, Eggboden\r
Oberägeri, Fichtenstrasse\r
Oberägeri, Hagen\r
Oberägeri, Grund\r
Oberägeri, Breiten\r
Oberägeri, Pfrundhaus\r
Oberägeri, Hofmatt\r
Oberägeri, Erliberg\r
Oberägeri, Maienmatt\r
Oberägeri, Winzrüti\r
Oberägeri, Lohmatt\r
Oberägeri, Fischmatt\r
Oberägeri, Station\r
Oberägeri, Gehrenrank\r
Oberägeri, Haltenbühl\r
Oberägeri, Oberhaltenbühl\r
Oberägeri, Ländli\r
Oberägeri (See)\r
Oberägeri Ländli (See)\r
Oberalikon, Tönihof\r
Oberalikon, Egg\r
Oberalp Hinter Börtli (Talst.)\r
Oberalp Platten (Mittelst.)\r
Oberalp Vordere Felli (Talst.)\r
Oberalppass, Bahnhof\r
Oberalppass\r
Oberalppass (Talstat. Calmut)\r
Oberalppass(Schneehüenerstock)\r
Oberarth, Bifang\r
Oberarth, Dorf\r
Oberarth, Rischi\r
Oberbalm, Dorf\r
Oberbalm, Bach\r
Oberbalmberg, Kurhaus\r
Oberberg St. Karl\r
Oberbipp, Eintracht\r
Oberbipp\r
Oberbipp, Bahnhof\r
Oberbipp, Buchli\r
Oberbuchsiten, Löwen\r
Oberbuchsiten, Bahnhof\r
Oberbuchsiten\r
Oberbüren, Unterzil\r
Oberbüren, Rüti\r
Oberbüren, Oberstufe Thurzelg\r
Oberbüren, Werkhof\r
Oberbüren, Buchental\r
Oberbüren, Eich/Au\r
Oberbüren, Zentrum\r
Oberbüren, Staubhusen\r
Oberbüren, Kloster Glattburg\r
Oberbüren, Glattfeld\r
Oberburg, Pfisternstrasse\r
Oberburg, Schulstrasse\r
Oberburg, Schwandgasse\r
Oberburg, Bärenstrasse\r
Oberburg, Geissrütti\r
Oberburg\r
Oberburg, Gemeindeverwaltung\r
Oberburg, Schulhaus Stöckern\r
Oberburg, Ziegelgut\r
Oberburg, Brunnmattstrasse\r
Oberbussnang, Feuerwehrdepot\r
Oberbütschel, Holzweid\r
Oberbütschel, Gschneit\r
Oberbütschel, Bernstrasse\r
Oberdiessbach\r
Oberdiessbach, Bahnhof\r
Oberdiessbach, Kastanienpark\r
Oberdorf, Liedertswilerstrasse\r
Oberdorf BL, Station\r
Oberdorf BL, Winkelweg\r
Oberdorf BL, Gritt\r
Oberdorf BL, Schulhaus\r
Oberdorf BL, Dorfmatt\r
Oberdorf NW, Schulhaus\r
Oberdorf NW, Wilrank\r
Oberdorf NW, Kaserne\r
Oberdorf NW, Schulhausstrasse\r
Oberdorf SO, Mühlebrücke\r
Oberdorf SO, Dorfplatz\r
Oberdorf SO, Endhalt\r
Oberdorf SO\r
Oberdorf SO (Talstation)\r
Obere Chaltebrunne\r
Oberegg AI, Unterdorf\r
Oberegg AI, Eugst\r
Oberegg AI, Bäumen\r
Oberegg AI, Wässern\r
Oberegg AI, Riethof\r
Oberegg AI, Sonderegg\r
Oberegg AI, Haggen\r
Oberegg AI, Rutlenstrasse\r
Oberegg AI, Honegg\r
Oberegg AI, St. Anton Kapelle\r
Oberegg AI, Landmark\r
Oberegg AI, St. Anton\r
Oberegg AI, Post\r
Oberembrach, Dorf\r
Oberems, Seilbahn\r
Oberems\r
Oberengstringen, Paradies\r
Oberengstringen, Eggbühl\r
Oberengstringen, Zentrum\r
Oberengstringen, Lanzrain\r
Oberentfelden, Bahnhof\r
Oberentfelden, Uerkenbrücke\r
Oberentfelden, Engelplatz\r
Oberentfelden\r
Oberentfelden Engelplatz\r
Oberentfelden Uerkenbrücke\r
Oberflachs, Kasteln\r
Oberflachs, Mitteldorf\r
Oberfrittenbach, Stockmatte\r
Oberfrittenbach, Aeugstmatt\r
Oberfrittenbach, Badmätteli\r
Oberfrittenbach, Deckhus\r
Oberfrittenbach, Stock\r
Oberfrittenbach, Grebli\r
Oberfrittenbach, Schulhaus\r
Oberfrittenbach, Buuchi\r
Oberfrittenbach, Im Bach\r
Oberfrittenbach, Bad\r
Obergerlafingen, Dorf\r
Obergesteln, Dorfplatz\r
Obergesteln\r
Obergetwing, Rottenbrücke\r
Oberglatt ZH, Rietli\r
Oberglatt ZH, Mösli Hofstetten\r
Oberglatt ZH, Bahnhof\r
Oberglatt ZH, Pistenende\r
Oberglatt ZH, Zentrum\r
Oberglatt ZH, Bälen\r
Oberglatt ZH\r
Obergoldbach, Längacker\r
Obergoldbach, Abzw. Landiswil\r
Obergoldbach, Post\r
Obergösgen, Fähre\r
Obergösgen, Schulhaus\r
Obergösgen, Dorf\r
Obergösgen, Sandacker\r
Obergösgen, Bollenfeld\r
Oberhallau, Trottengasse\r
Oberhasli, Hasliberg\r
Oberhasli, Industrie\r
Oberhasli, Dorf\r
Oberhasli, Spielplatz\r
Oberhasli, Post\r
Oberhasli, Moosacker\r
Oberhelfenschwil, Metzwil\r
Oberhelfenschwil, Tobelacker\r
Oberhelfenschwil, Dorf\r
Oberhelfenschwil, Wigetshof\r
Oberhof, Rohr\r
Oberhof, Benkenhöfe\r
Oberhof, Adlerplatz\r
Oberhofen a. T., Wichterheer\r
Oberhofen a. T., Dorf\r
Oberhofen a. T., Aebnitstrasse\r
Oberhofen a. T., Schneckenbühl\r
Oberhofen a. T., Längenschach.\r
Oberhofen a. T., Allmendweg\r
Oberhofen a. T., Tannackerstr.\r
Oberhofen a. T., Tannacker\r
Oberhofen a. T., Sonnenbühl\r
Oberhofen a.T., Örtlibach\r
Oberhofen AG, Kreuz\r
Oberhofen AG, Ausserdorf\r
Oberhofen am Thunersee\r
Oberhofen TG, Dorf\r
Oberhörstetten, Abzw.\r
Oberiberg, Neuseewen\r
Oberiberg, Wandli\r
Oberiberg, Oberjessenen\r
Oberiberg, Laburg\r
Oberiberg, Tschalun\r
Oberiberg (Talstation)\r
Oberjoch\r
Oberkirch LU, Münigen\r
Oberkirch LU, Zum gold. Wagen\r
Oberkirch LU, CAMPUS Sursee\r
Oberkirch LU, Feldhöfli\r
Oberkirch LU, Länggasse\r
Oberkirch LU, Terra Alta\r
Oberkirch LU\r
Oberkirch LU, Schule\r
Oberkirch LU, Dorf\r
Oberkulm, Bahnhof\r
Oberkulm\r
Oberlangenegg, Fischbach\r
Oberlangenegg, Stalden\r
Oberlangenegg, Inn. Kreuzweg\r
Oberlunkhofen, Oberdorf\r
Oberlunkhofen, Post\r
Oberlunkhofen, Dorfplatz\r
Oberlunkhofen, Haldenmatten\r
Oberlunkhofen, Waldegg\r
Obermuhen, Bahnhof\r
Obermuhen\r
Obermumpf, Bündtematt\r
Obermumpf, Ausserdorf\r
Obermumpf, Alte Post\r
Obermutten, Dorf\r
Obernau, Dorf\r
Obernau, Hammerschmiede\r
Obernau, Feldmatt\r
Obernau, Stampfeli\r
Obernau, Schiessstand Stalden\r
Obernau, Schachenwald\r
Obernau, Oberrodel\r
Oberneunforn, Dorf\r
Oberneunforn, Hochberg\r
Oberneunforn, Stocke\r
Oberneunforn, Gemeindehaus\r
Oberneunforn, Langmüli\r
Oberohringen, Friedenstrasse\r
Oberohringen, Industrie Asp\r
Oberönz, Kreuzstr.-Burgäschi\r
Oberönz, Moos\r
Oberönz, Kreuz\r
Oberösch\r
Oberramsern\r
Oberrickenbach, Talstat. LFCH\r
Oberrickenbach, Burgholz\r
Oberrickenbach, alte Post\r
Oberrickenbach, Schürmatt\r
Oberried am B., Gmeindshuus\r
Oberried am B., Louwena\r
Oberried am Brienzersee, Bhf\r
Oberried am Brienzersee\r
Oberried am Brienzersee (See)\r
Oberrieden, Tannenbach\r
Oberrieden, Wattenbühlweg\r
Oberrieden, Hubstrasse\r
Oberrieden, Bahnhof\r
Oberrieden, Seehalde\r
Oberrieden\r
Oberrieden (See)\r
Oberrieden Dorf, Bahnhof\r
Oberrieden Dorf\r
Oberriet SG, Hirschensprung\r
Oberriet SG, Eichau\r
Oberriet SG, Mettlen\r
Oberriet SG\r
Oberriet SG, Finkenweg\r
Oberriet SG, Feldhof\r
Oberriet SG, Sekundarschule\r
Oberriet SG, Eichenwies\r
Oberriet SG, Moos\r
Oberriet SG, Oberdorf\r
Oberriet SG, Franziskusstrasse\r
Oberriet SG, Bahnhof Ost\r
Oberriet SG, Kobelwald\r
Oberriet SG, Kobelwies\r
Oberriet SG, Loogarten\r
Oberriet SG, Bahnhof\r
Oberriet SG, Rathaus\r
Oberrohrdorf, Friedhof\r
Oberrohrdorf, Brüggliacher\r
Oberrohrdorf, Im Feld\r
Oberrohrdorf, Zentrum\r
Oberrohrdorf, Staretschwil\r
Oberrüti, Dorf\r
Oberrüti\r
Obersäss\r
Obersaxen, St. Josef\r
Obersaxen, Tobel\r
Obersaxen, Tusen Abzw.\r
Obersaxen, Grosstobel\r
Obersaxen, Tschappinahüs\r
Obersaxen, Inder Miraniga\r
Obersaxen, Tschappina\r
Obersaxen, Chummenbüel\r
Obersaxen, Affeier Dorf\r
Obersaxen, Giraniga\r
Obersaxen, Friggahüs\r
Obersaxen, Egga\r
Obersaxen, St. Martin\r
Obersaxen, Ober Misanenga\r
Obersaxen, Bellaua\r
Obersaxen, Axastei\r
Obersaxen, Misanenga Talstat.\r
Obersaxen, Üsser Miraniga\r
Obersaxen, Meierhof Post\r
Obersaxen, Meierhof Talstation\r
Obersaxen, Affeier Kehrplatz\r
Obersaxen, Platta\r
Obersaxen, Chriegli\r
Obersaxen Meierhof (Talstat.)\r
Obersaxen Misanenga\r
Obersaxen Untermatt\r
Obersaxen Valata (Talstation)\r
Oberschan, Abzw. Hotel Alvier\r
Oberschan, Schnapsgrotzen\r
Oberschan, Schwimmbad\r
Oberschan, Museum\r
Oberschan,Abzw. Rest. Aufstieg\r
Oberschan, alte Post\r
Oberscherli, Leimen\r
Oberscherli, Scherliau\r
Oberscherli, Abzweigung\r
Oberscherli, Dorf\r
Oberscherli, Haltlirain\r
Oberscherli, Lehmackerweg\r
Oberschlatt TG, Dorf\r
Oberschrot, Ried\r
Oberschrot, Gousmatte\r
Oberschrot, Büel\r
Oberschwanden\r
Obersommeri, Dorf\r
Oberstammheim, Rietweg\r
Obersteckholz, Post\r
Obersteckholz, Am Wald\r
Oberstetten, Dorf\r
Oberstocken, Kreuzgasse\r
Oberstocken, Wolfbuchen\r
Oberstocken, Hofacker\r
Obersulz, Hauptstrasse\r
Oberterzen, Dorf\r
Oberterzen (Mittelstation)\r
Oberterzen Seeben (Talstation)\r
Obertschappina\r
Obertschappina, Skilift\r
Oberurmein, Skilift\r
Oberurmein, Aclas\r
Oberurmein, Caziela\r
Oberurnen, im Horn\r
Oberurnen, Feuerwehrplatz\r
Oberurnen, im Grütli\r
Oberuzwil, Rain\r
Oberuzwil, Schützenhaus\r
Oberuzwil, Drogerie\r
Oberuzwil, Post\r
Oberuzwil, Evangelische Kirche\r
Oberuzwil, Flawilerstrasse\r
Oberwald\r
Oberwald, Bahnhof\r
Oberwald Autoverlad\r
Oberwald VS, Rhonequelle\r
Oberwald VS, Muttbach\r
Oberwald VS, Schulhaus\r
Oberwald VS, Dorf\r
Oberwangen\r
Oberwangen b. Bern, Friedhof\r
Oberwangen TG, Sonnenhof\r
Oberwangen TG, Grueb\r
Oberweningen, Hüeblistrasse\r
Oberweningen, Im Hüebli\r
Oberwil b. Büren, Bad\r
Oberwil b. Büren, Dorf\r
Oberwil b. Zug, Räbmatt\r
Oberwil b. Zug, Leimatt\r
Oberwil b. Zug, Rigiblick\r
Oberwil b. Zug, Murpfli\r
Oberwil b. Zug, Fuchsloch\r
Oberwil b. Zug, Mülimatt\r
Oberwil b. Zug, Widenstrasse\r
Oberwil b. Zug,Klinik Zugersee\r
Oberwil b. Zug, Stolzengraben\r
Oberwil b. Zug, Kreuz\r
Oberwil b. Zug, Bahnhof\r
Oberwil bei Zug (See)\r
Oberwil BL, Goldbrunnen\r
Oberwil BL, Drei Linden\r
Oberwil BL, Stallen\r
Oberwil BL, Bleimatt\r
Oberwil BL, Bündtenweg\r
Oberwil BL, Bertschenacker\r
Oberwil BL, Baumgartenweg\r
Oberwil BL, Hohestrasse\r
Oberwil BL, Mühlematt\r
Oberwil BL, Hallenrain\r
Oberwil BL, Hochletten\r
Oberwil BL, Langegasse\r
Oberwil BL, Vorderberg\r
Oberwil BL, Gymnasium\r
Oberwil BL, Im Buech\r
Oberwil BL, Auf der Wacht\r
Oberwil BL, Rüti\r
Oberwil BL, Bottmingerstrasse\r
Oberwil BL, Lätten\r
Oberwil BL, Rohrhagstrasse\r
Oberwil BL, Zentrum\r
Oberwil BL, Hüslimatt\r
Oberwil BL, Schwanen\r
Oberwil im Simmental\r
Oberwil TG, Dorf\r
Oberwil-Lieli, Dreispitz\r
Oberwil-Lieli, Englisächer\r
Oberwil-Lieli, im Moos\r
Oberwil-Lieli, Bündtenmättli\r
Oberwil-Lieli, Lieli Dorf\r
Oberwilen, Seefuren\r
Oberwilen, Mos\r
Oberwilen, Forst\r
Oberwilen, Mätteli\r
Oberwinterthur, Bahnhof\r
Oberwinterthur\r
Oberzollikofen\r
Oberzollikofen, Bahnhof\r
Obfelden, Bachstrasse\r
Obfelden, Bickwil\r
Obfelden, Gessnerstrasse\r
Obfelden, Unterlunnern\r
Obfelden, Hölibachstrasse\r
Obfelden, alte Post\r
Obfelden, Toussen\r
Obstalden, Walenguflen\r
Obstalden, Bödeli\r
Obstalden, Post\r
Obstalden, Stocken\r
Ocourt, Moulin-du-Doubs\r
Ocourt\r
Odogno, Piana\r
Odogno, Paese\r
Odogno, Bivio per Bettagno\r
Oekingen, Horriwilstrasse\r
Oekingen, Schulhaus\r
Oensingen, Bahnhof\r
Oensingen, Bahnhof Süd\r
Oensingen, Sternenplatz\r
Oensingen, Jurastrasse\r
Oensingen, Schlossstrasse\r
Oensingen, Roggen\r
Oensingen, Lehngasse\r
Oensingen, Rebhöfli\r
Oensingen, Post\r
Oensingen, Gallihof\r
Oensingen\r
Oensingen, Katholische Kirche\r
Oensingen, Leuenfeld\r
Oensingen, Kreisschule\r
Oensingen, Schule Oberdorf\r
Oensingen, Neu Bechburg\r
Oensingen, Bauamt\r
Oerlingen\r
Oeschberg\r
Oeschenbach, Bleuen\r
Oeschenbach, Säge\r
Oeschenbach, Wyssacker\r
Oeschenbach, Heimeli\r
Oeschgen, Brückenwaage\r
Oeschgen, Hinterdorf\r
Oeschgen, Gemeindehaus\r
Oeschinen (Bergstation)\r
Oeschseite\r
Oeschseite Chaltebrunne\r
Oetwil a.d.L., Gässliacker\r
Oetwil a.d.L., Schweizäcker\r
Oetwil am See, Beichlen\r
Oetwil am See, Holzhusen\r
Oetwil am See, Willikon\r
Oetwil am See, Zelgli\r
Oetwil am See, Buacher\r
Oetwil am See, Langholz\r
Oetwil am See, Gusch\r
Oetwil am See, Zentrum\r
Oetwil am See, Bergstrasse\r
Oetwil am See, Felsengrund\r
Oetwil an der Limmat, Oberdorf\r
Oetwil an der Limmat, Zentrum\r
Oetwil an der Limmat, Halde\r
Oey, Marktplatz\r
Oey, Chirelgand\r
Oey-Diemtigen\r
Oey-Diemtigen, Bahnhof\r
Oftringen, Döbeligut\r
Oftringen, Wirtshüsli\r
Oftringen, alte Strasse\r
Oftringen,Kallernhag/Center A1\r
Oftringen, Neuquartier\r
Oftringen, Bühnenberg-Sonnmatt\r
Oftringen, Schulhaus/Kirche\r
Oftringen, Ruhbank\r
Oftringen, Kreuzplatz\r
Oftringen, Lerchenfeld\r
Oftringen, Perry-Center\r
Oftringen, Eggenscheide\r
Oftringen, Oberfeld\r
Oftringen, Obristhof\r
Oftringen, Baslerstrasse\r
Oftringen, Gilam\r
Ogens, village\r
Oggio, Paese\r
Oggio, Fiume bello\r
Oggio, Fornaci\r
Olden\r
Oldenegg\r
Oleyres, collège\r
Oleyres, Les Carrières\r
Olivone, Bivio Sommascona\r
Olivone, Posta\r
Olivone, Municipio\r
Olivone, Petullo\r
Olivone, Scona\r
Ollon VD, bif. rte d'Antagnes\r
Ollon VD\r
Ollon VD, gare\r
Ollon VD,collège de Perrosalle\r
Ollon VD, cimetière\r
Ollon VD, Via Francigena\r
Ollon VD, Les Arnoux\r
Ollon VD, Vergers\r
Ollon VD, bif. Forchex\r
Ollon VD, Plan-d'Essert\r
Ollon VD, Crettaz-Tavez\r
Ollon VD, Le Moulin\r
Ollon VS, village\r
Ollon VS, bif.\r
Ollon VS, bif. Valençon\r
Olsberg, Schönenbühl\r
Olsberg, Chloster\r
Olsberg, Vorstadt\r
Olsberg, Mitteldorf\r
Olten, Bornblick\r
Olten, Reiserstrasse\r
Olten, Meierhof\r
Olten, Dreitannenstrasse\r
Olten, Riggenbachstrasse\r
Olten, Schützenmatt\r
Olten, Feldstrasse\r
Olten, Bifang\r
Olten, Knoblauch\r
Olten, Friedhof\r
Olten, Stadthalle\r
Olten, Gerolag Center\r
Olten, Usego\r
Olten, Jurastrasse\r
Olten, Industriewerk\r
Olten, Baslerstrasse\r
Olten, Spital\r
Olten, Amthausquai\r
Olten, Sälipark\r
Olten, Meisenhardweg\r
Olten, Gartenstrasse\r
Olten, Höhenstrasse Ost\r
Olten, Chalchofen\r
Olten, Hammer BOGG\r
Olten, Hammermühle\r
Olten, Solothurnerstrasse\r
Olten, Maienstrasse\r
Olten, Museen\r
Olten, Kunsteisbahn\r
Olten, Käppeli\r
Olten, Hausmattrain\r
Olten, Höhenstrasse West\r
Olten, Fustlighalde\r
Olten, Leberngasse\r
Olten, Passerelle\r
Olten, Sälistrasse\r
Olten, Fustligweg\r
Olten, Südwest\r
Olten, Fachhochschule\r
Olten, Bornfeld\r
Olten\r
Olten, Postplatz\r
Olten, Wilerfeld\r
Olten, Trimbacherbrücke\r
Olten, Haslistrasse\r
Olten, Bahnhof\r
Olten Hammer\r
Oltingen, Postplatz\r
Oltingen, Schulhaus\r
Oltingen, Lehmatt\r
Ondallaz-L'Alliaz\r
Onex, Salle communale\r
Onex, Rochette\r
Onex, Bois Carrien\r
Onex, Duret\r
Onex, cité\r
Onex, Belle-Cour\r
Onex, Montesquiou\r
Onex, Bandol\r
Onex, Vallet\r
Onex, La Traille\r
Onex, marché\r
Onex, Gros-Chêne\r
Onex, Genévrière\r
Onex, Galeries du Loup\r
Onex, Maison Onésienne\r
Onnens FR, Pierra Fatta\r
Onnens FR, église\r
Onnens VD, croisée\r
Opfershofen TG, Dorf\r
Opfertshofen SH, Reiatstube\r
Opfertshofen SH, Dorf\r
Opfikon, Austrasse\r
Opfikon, Bubenholz\r
Opfikon, Grossacker\r
Opfikon, Grätzli\r
Opfikon, Dorf\r
Opfikon, Neuwiesen\r
Opfikon, Zil\r
Opfikon, Schulstrasse\r
Opfikon, Bahnhof\r
Opfikon, Aublick\r
Opfikon, Fernsicht\r
Opfikon, Vreniker\r
Opfikon\r
Opfikon, Schwimmbad\r
Oppens, La Tuilière\r
Oppens, croisée\r
Oppikon\r
Oppligen, Schütz\r
Oppligen, Gemeindehaus\r
Orbe, Gruvatiez\r
Orbe, Le Devin\r
Orbe, Chantemerle\r
Orbe\r
Orbe, route de Valeyres\r
Orbe, Plamont\r
Orbe, Couronne\r
Orbe, collège\r
Orbe, croisée Agiez\r
Orbe, Suchet\r
Orbe, gare\r
Orbe, rue Neuve\r
Orbe, Penchèvre\r
Orbe, Fleurs-de-Lys\r
Orbe, Dame\r
Orbe, route de Chavornay\r
Orbe, Les Moulins\r
Orbe, Montchoisi\r
Orbe, hôpital\r
Orbe, Petit-Bois\r
Orbe, Les Mosaïques\r
Orbe, Champ de la Pierre\r
Orbe, La Croix\r
Orbe, poste\r
Orbe, Taborneires\r
Orges, Gret\r
Orges, village\r
Orgnana, Cavriana\r
Orgnana, Paese\r
Orgnana, Rozzolo\r
Orgnana, Molina\r
Orgnana, Monda\r
Origlio, Paese\r
Ormalingen, Hemmikerstrasse\r
Ormalingen, Unterdorf\r
Ormalingen, Schulhaus\r
Ormalingen, Oberdorf\r
Ormalingen, Zwischbach\r
Orny, village\r
Oron\r
Oron-la-Ville, Pré à l'Abbé\r
Oron-la-Ville, Pralets\r
Oron-la-Ville, gare routière\r
Oron-la-Ville, centre\r
Oron-le-Châtel, La Chavanne\r
Oron-le-Châtel, Château\r
Oron-le-Châtel, gare\r
Orpund, Neumatt\r
Orpund, Gottstatt\r
Orpund, Bürenstrasse\r
Orpund, Post\r
Orpund, Zumbach\r
Orpund, Byfang\r
Orselina, ai Gerbi\r
Orselina, Caselle\r
Orselina, Case di sotto\r
Orselina, Clinica S. Croce\r
Orselina, Posta\r
Orselina, al Ponte\r
Orselina, Chiesa\r
Orselina, Clinica Varini\r
Orselina, Stazione Funivia\r
Orselina, Albergo Orselina\r
Orselina (Funivia Cardada)\r
Orselina Funicolare\r
Orselina Madonna del Sasso\r
Orsières, Biolley\r
Orsières, Chamoille\r
Orsières, La Place\r
Orsières, gare\r
Orsières\r
Orsières, Chez-les-Reuses\r
Orsières, La Proz\r
Orsières, la Rosière\r
Orsières, La Tannerie\r
Orsières, école de la Proz\r
Orsières, Prassurny\r
Orsières, Chez-Les-Addy\r
Orsonnens, Gottaz\r
Orsonnens, village\r
Ortschwaben, Schützenrain\r
Ortschwaben, Gehracker\r
Ortschwaben, Postgasse\r
Ortschwaben, Ausserortschwaben\r
Ortschwaben, Schulhaus\r
Orvin, Petit-Moulin\r
Orvin, église\r
Orvin, Cheval Blanc\r
Orvin, Sous les Roches\r
Orvin, place du village\r
Orzens, village\r
Osco, Piottino\r
Osco, Paese\r
Osogna, Toboga\r
Osogna, Maestos\r
Ospizio Bernina, Albergo\r
Ospizio Bernina\r
Ossasco (Bedretto)\r
Ossingen\r
Ossingen, Usserdorf\r
Ossingen, Bahnhof\r
Osterfingen, Lindenhof\r
Ostermundigen, Oberfeld\r
Ostermundigen, Waldheimstrasse\r
Ostermundigen, Sportplatzweg\r
Ostermundigen, Freibad\r
Ostermundigen, Hubel\r
Ostermundigen\r
Ostermundigen, Tiefenmösli\r
Ostermundigen, Milchstrasse\r
Ostermundigen, Waldeck\r
Ostermundigen, Blankweg\r
Ostermundigen, Wegmühlegässli\r
Ostermundigen, Zollgasse\r
Ostermundigen, Oberdorf\r
Ostermundigen, Rüti\r
Ostermundigen, Dennigkofen\r
Ostermundigen, Kreuzweg\r
Ostermundigen, Bahnhof\r
Otelfingen, Schule\r
Otelfingen, Landstrasse\r
Otelfingen\r
Otelfingen, Bahnhof\r
Otelfingen, Alte Post\r
Otelfingen Golfpark\r
Othmarsingen, Militärbetriebe\r
Othmarsingen, Bahnhofstrasse\r
Othmarsingen, Högern\r
Othmarsingen\r
Othmarsingen, Bahnhof\r
Othmarsingen, Rössli\r
Ottenbach, Ulmenhof\r
Ottenbach, Hinterdorf\r
Ottenbach, Rickenbach\r
Ottenbach, Rigiblick\r
Ottenbach, Zentrum\r
Ottenbach, Geeren\r
Ottenbach, Engelwiese\r
Ottikon (Gossau),Herschmettlen\r
Ottikon (Gossau), Hellberg\r
Ottikon (Gossau), Kirschgarten\r
Ottikon (Gossau), Brüschweid\r
Ottikon (Gossau), Hasenacher\r
Ottikon (Gossau), Unterottikon\r
Ottikon (Gossau), Strick\r
Ottikon (Gossau), Kreisel\r
Ottikon b. Kemptthal\r
Ottoberg, Feldhof\r
Ottoberg, Gaishaus\r
Ottoberg, Wald\r
Ottoberg, Schulhaus\r
Ottoberg, Weinberg\r
Oulens-sous-Echallens,Gd Salle\r
Oulens-sous-Echallens, collège\r
Oulens-sur-Lucens, village\r
Oulens-sur-Lucens, La Crausaz\r
Ova Spin\r
Ovronnaz, télé/centre sportif\r
Ovronnaz, chapelle\r
Ovronnaz, croisée du centre\r
Ovronnaz, Centre therm. Melley\r
Ovronnaz, centre\r
Ovronnaz, Chevaley\r
Ovronnaz, Plein soleil\r
Ovronnaz (télésiège)\r
Paccot\r
Pagig, Abzw.\r
Pagig, Pudanal\r
Pagig, Dorf\r
Pagig, Tura\r
Paiardi, San Giulio\r
Paiardi, Al Maglio\r
Pailly, Moulin-Pacot\r
Pailly, village\r
Pailly, Le Rembloz\r
Palagnedra\r
Palézieux, zone ind. En Grivaz\r
Palézieux, En Plan\r
Palézieux\r
Palézieux, gare\r
Palézieux-Village\r
Palézieux-Village, centre\r
Palézieux-Village, collège\r
Pambio, Paese\r
Pambio, S. Pietro Chiesa\r
Pambio-Noranco, Posta\r
Pambio-Noranco, Igia\r
Pampigny, collège\r
Panex, Les Planches\r
Panex, Forêt des Esserts\r
Panex, réservoir\r
Panex, Bois de la Glaive\r
Panex, village\r
Panex, En Mers\r
Panex, La Croisée\r
Panex, Au Pomey rouge\r
Panüöl\r
Pany, Castannastrasse\r
Pany, Börtji\r
Pany, Riedwies\r
Pany, Hadereggstrasse\r
Pany, Maiensäss\r
Pany, Raggalia\r
Pany, Schwimmbad\r
Pany, Skilift\r
Pany, Dorf\r
Pany, Geissgrind\r
Pany, Schulhaus\r
Papiermühle, Bahnhof\r
Papiermühle\r
Paradiso, La Sguancia\r
Paradiso, Piscina\r
Paradiso, Carzo\r
Paradiso, Stazione/Scuole\r
Paradiso, Via Cattori\r
Paradiso, Via S. Salvatore\r
Paradiso, Calprino\r
Paradiso, Stazione\r
Paradiso, Brentino\r
Paradiso, Debarcadero\r
Paradiso, Via Calprino\r
Paradiso, Geretta\r
Paradiso, Fontana\r
Paradiso\r
Paradiso (funicolare)\r
Paradiso (lago)\r
Pardiel\r
Parlet\r
Parpan, Post\r
Parpan, Parpaner Höhe\r
Parpan, Obertor/Heimberg\r
Parpan Heimberg\r
Parpan Heimberg (Motta)\r
Parpan Motta\r
Parpan Motta (Talst. Urden)\r
Parpan Müli\r
Parpan Obertor\r
Parpaner Rothorn\r
Parsennfurgga\r
Parsennhütte\r
Parsonz, vischnanca\r
Parsonz Tigignas\r
Parwengesattel\r
Pas-de-Chavanette\r
Pas-de-Maimbré\r
Paspels, Dorf\r
Passugg, Hotelfachschule\r
Passugg, Abzw. Grida\r
Passugg, Brugg\r
Passugg, Schluocht\r
Passwang\r
Patrullarve\r
Paudex, Marronnier\r
Paudex, village\r
Paudex, Verrière\r
Paudo, Giro Trebbie\r
Paudo, Paese\r
Pauvre-Conche\r
Payerne, Grand'Rue\r
Payerne, Les Sorbiers\r
Payerne, Aéropôle\r
Payerne, Simplon\r
Payerne, Rives de la Broye\r
Payerne, gymnase\r
Payerne, Champ Aubert\r
Payerne, La Palaz\r
Payerne\r
Payerne, Stade\r
Payerne, Moulin à Pigeon\r
Payerne, Vuaz Vauchy\r
Payerne, hôpital\r
Payerne, Concorde\r
Payerne, Sansui\r
Payerne, Colline\r
Payerne, croisée de Cugy\r
Payerne, Beaulieu\r
Payerne, aérodrome\r
Payerne, Grandes Rayes\r
Payerne, caserne\r
Payerne, gare\r
Pazzallo, Ai Ronchi\r
Pazzallo, Senago\r
Pazzallo, P+R Fornaci\r
Pazzallo, Morchino\r
Pazzallo, Paese\r
Pazzallo, Senago Bassa\r
Pazzallo, Scuole Fano\r
Pazzallo (funicolare)\r
Peccia, Corgello\r
Peccia, Paese\r
Peccia, Cambleo\r
Pedra Grossa\r
Pedrinate, Cimitero\r
Pedrinate, Gasparina\r
Pedrinate, Chiesa\r
Pedrinate, Bellavista\r
Pedrinate, Grotto Paradiso\r
Pedrinate, Paese\r
Peiden, Bogn\r
Peiden, vitg\r
Peist, Schulhaus\r
Peist\r
Peney-le-Jorat, poste\r
Peney-le-Jorat, Chalet Renards\r
Peney-le-Jorat, Moulin Peney\r
Pensier, Buffet de la Gare\r
Pensier\r
Penthalaz, poste\r
Penthalaz, Verney\r
Penthalaz, village\r
Penthaz, village\r
Penthaz, La Vaux\r
Penthéréaz, Le Battoir\r
Penthéréaz, Champ-de-Vaud\r
Penthéréaz, village\r
Perlen, Holzplatz\r
Perlen, Dorf\r
Perlen, Fabrik\r
Perlen, Haslirain\r
Perly, Ravières\r
Perly, En Louche\r
Perly, douane\r
Perly, mairie\r
Perly, village\r
Perrefitte, poste\r
Perrefitte, Blocs\r
Perrefitte, Les Rouges-Champs\r
Perreux, Carrefour\r
Perreux, Est\r
Perreux, Pontareuse\r
Perroy, Vinicole\r
Perroy, Couronnette\r
Perroy, village\r
Personico, Piazza\r
Personico, Binenca\r
Pesciüm\r
Peseux, Cévenols\r
Peseux, Placeules\r
Peseux, Fornachon\r
Peseux, temple\r
Peseux, Tombet\r
Peseux, Vignoble\r
Petit Pré\r
Petit-Chamossaire\r
Petit-Lancy, Bossons\r
Petit-Lancy, De-Ternier\r
Petit-Lancy, Claire-Vue\r
Petit-Lancy, Quidort\r
Petit-Lancy, Chemin du Bac\r
Petit-Lancy, Pré-Monnard\r
Petit-Lancy, Les Marbriers\r
Petit-Lancy, Cimetière St-G.\r
Petit-Lancy, Morgines\r
Petit-Lancy, Les Esserts\r
Petit-Lancy, place\r
Petit-Martel\r
Petit-Martel-Est\r
Petit-Mont-Bonvin (Tsât amont)\r
Peyres-Possens, café\r
Peyres-Possens, Les Tuilières\r
Pezzolo, Canvetto Tiratori\r
Pezzolo, Paese\r
Pfäfers, Wiesli\r
Pfäfers, Altes Bad\r
Pfäfers, Postplatz\r
Pfäfers, Vaschnäris\r
Pfäfers, Eselrank\r
Pfäfers, Grosswies\r
Pfäfers, Bovel\r
Pfäfers, Schwattenfall\r
Pfäfers, Klinik\r
Pfaffhausen, Sängglen\r
Pfaffhausen, Pfaffenstein\r
Pfaffhausen, Müseren\r
Pfaffhausen, Feldhof\r
Pfäffikon SZ, Schiessstand\r
Pfäffikon SZ, Sonnenhof\r
Pfäffikon SZ, Zentrum\r
Pfäffikon SZ, Driesbüel\r
Pfäffikon SZ, Schweizerhof\r
Pfäffikon SZ, Buchberg\r
Pfäffikon SZ, Kantonsschulen\r
Pfäffikon SZ, Roggenacker\r
Pfäffikon SZ, Zeughaus\r
Pfäffikon SZ, Halten\r
Pfäffikon SZ, Talstrasse\r
Pfäffikon SZ, Tertianum\r
Pfäffikon SZ, Hofmatt\r
Pfäffikon SZ\r
Pfäffikon SZ, Campus\r
Pfäffikon SZ, Luegeten\r
Pfäffikon SZ, Abzw. Etzelpass\r
Pfäffikon SZ, Wannenweid\r
Pfäffikon SZ, Gräfli\r
Pfäffikon SZ, Seedamm-Center\r
Pfäffikon SZ, Rain\r
Pfäffikon SZ, Löwen\r
Pfäffikon SZ, Bahnhof\r
Pfäffikon SZ, Schützenstrasse\r
Pfäffikon SZ, Industrie Ost\r
Pfäffikon SZ (See)\r
Pfäffikon ZH, Wallikon\r
Pfäffikon ZH, Hörnlistrasse\r
Pfäffikon ZH, Grundstrasse\r
Pfäffikon ZH, Witzberg\r
Pfäffikon ZH, Mettlenstrasse\r
Pfäffikon ZH, Bahnhof\r
Pfäffikon ZH, Hermatswil\r
Pfäffikon ZH, Wiesengrund\r
Pfäffikon ZH, Bussenhausen\r
Pfäffikon ZH, Sulzberg\r
Pfäffikon ZH, im Spitz\r
Pfäffikon ZH, Ruetschbergstr.\r
Pfäffikon ZH, Matten\r
Pfäffikon ZH\r
Pfäffikon ZH, Humbel\r
Pfäffikon ZH, Berg\r
Pfäffikon ZH, Güchweg\r
Pfäffikon ZH, Rainstrasse\r
Pfäffikon ZH, Frohwies\r
Pfäffikon ZH, Steinwiesstrasse\r
Pfäffikon ZH, Faichrüti\r
Pfaffnau, Post\r
Pfaffnau, Dorfplatz\r
Pfaffnau, Steinacher\r
Pfaffnau, Brunnmatt\r
Pfeffingen, Bellevue\r
Pfeffingen, Bergmattenweg\r
Pfeffingen, Dorf\r
Pfingstegg\r
Pfungen\r
Pfungen, Bahnhof\r
Pfungen, Eskimo\r
Pfungen, Wani\r
Pfyn, Biberpfad\r
Pfyn, Ost\r
Pfyn, Grütli\r
Pfyn, Bürgi\r
Pfyn, Frohsinn\r
Pfyn, Gemeinde\r
Pian Geirett\r
Pian S. Giacomo, Paese\r
Pian Segno\r
Piandera, Bivio per Piandera\r
Piandera, Molini\r
Piandera, Bivio per Cimadera\r
Pianezzo, Mondella\r
Pianezzo, Carabella\r
Pianezzo, Tremozza\r
Pianezzo, Ronchetti\r
Pianezzo, Giro del Féé\r
Pianezzo, Giro Boschetto\r
Pianezzo, Paese\r
Pianezzo, Sabbione\r
Pianezzo, Giaghen\r
Pianezzo, Ghezz\r
Piano di Mora\r
Piano di Peccia\r
Piano Stampa, Capolinea\r
Piano Stampa, Maglio\r
Piano Stampa, Farera\r
Piansecco\r
Piazzogna, Belsito\r
Piazzogna, Parco Botanico\r
Piazzogna, Paese\r
Pied du barrage\r
Pientina\r
Pieterlen, Industrie West\r
Pieterlen, Schlössli\r
Pieterlen\r
Pieterlen, Gemeindehaus\r
Pieterlen, Schulhaus\r
Pieterlen, Bahnhof\r
Pignia, Abzw. Clugin\r
Pignia, Dorf\r
Pigniu, vitg\r
Pila\r
Pilatus Kulm\r
Piodella, Brusada\r
Piodella, Zona Industriale\r
Piodella, Mondino\r
Piodina\r
Piora\r
Piotta, Cresta\r
Piotta, Funicolare\r
Piotta, Bivio Funicolare Ritom\r
Piotta, Nord\r
Piotta, Posta\r
Piotta Centrale (funicolare)\r
Pischa\r
Pitasch, Mulin da Pitasch\r
Pitasch, vitg\r
Piz Lagalb\r
Piz Mundaun\r
Piz Nair\r
Piz Scalottas\r
Pizolhütte\r
Pizy, Le Courtillet\r
Pizy, village\r
Pizzamiglio, Dogana\r
Plaffeien, Oberi Matta\r
Plaffeien, Kloster\r
Plaffeien, Telmoos\r
Plaffeien, Schaferli\r
Plaffeien, Dorf\r
Plaffeien, Rufenen\r
Plagne, bas du village\r
Plagne, place du Cerf\r
Plain-Fahyn\r
Plambuit, Hameau\r
Plambuit, rte des Tailles\r
Plambuit, bifurcation\r
Plambuit\r
Plamproz\r
Plan du Fou\r
Plan Morier\r
Plan-Cernet\r
Plan-des-Conches\r
Plan-du-Croix (La Jorette)\r
Plan-du-Croix (Tronchey)\r
Plan-Francey\r
Plan-les-Ouates, Au Contour\r
Plan-les-Ouates, Aviateurs\r
Plan-les-Ouates, Vélodrome\r
Plan-les-Ouates, Badosse\r
Plan-les-Ouates, ZIPLO\r
Plan-les-Ouates, Saconnex-Arve\r
Plan-les-Ouates, Galaise\r
Plan-les-Ouates, Vuattes\r
Plan-les-Ouates, Le Rolliet\r
Plan-les-Ouates, Comm.-Réunies\r
Plan-les-Ouates, Champ-Filles\r
Plan-les-Ouates, Pré-Fleuri\r
Plan-les-Ouates, Bellins\r
Plan-les-Ouates, mairie\r
Plan-les-Ouates, Nant-Malet\r
Plan-les-Ouates, Arare\r
Plan-les-Ouates, Trèfle-Blanc\r
Plan-les-Ouates, Serves\r
Plan-les-Ouates, Laiteries\r
Plan-les-Ouates, Manufactures\r
Plan-les-Ouates, Moulins-Drize\r
Plan-les-Ouates, Pré-Jardinier\r
Plan-les-Ouates, Champ-Carré\r
Plan-les-Ouates, Roday\r
Plan-les-Ouates, Verbant\r
Planachaux\r
Planalp\r
Planchamp\r
Planer Salaas\r
Planken, Saroja\r
Planken, Vorderplanken\r
Planken, Schulhaus\r
Planken, Abzw. Egerta\r
Planplatten\r
Plasselb, March\r
Plasselb, Dorf\r
Plateau de Sorebois\r
Plateau Nair\r
Platta, Fuorns\r
Platta, Sogn Gions\r
Platta, Pardatsch\r
Platta, vitg\r
Platta, Sogn Gagl\r
Platta, Pardé\r
Platta, Acla\r
Plattatschas\r
Plattenhorn\r
Plattja\r
Plattjen\r
Plaun\r
Plaun da Lej\r
Plaun da Lej (See)\r
Pleigne, Place du 23-Juin\r
Pleigne, Dvain L'heu\r
Pleigne, bif. Bürgisberg\r
Pleujouse, bas du village\r
Plons (Mels), Rekrutierungsztr\r
Plons (Mels), Kaserne\r
Plons (Mels), Dorf\r
Pochtenalp, Abzw. Waldrand\r
Pohlern, Maad\r
Pohlern, Rohrmoos\r
Pohlern, Schlössli\r
Pohlern, Alte Post\r
Pohlern, Kreuzgasse\r
Pohlern, Hölzlibach\r
Pointe de l'Au\r
Pointe-des-Mossettes\r
Poliez-le-Grand, village\r
Poliez-le-Grand, Der. Le Chêne\r
Poliez-le-Grand, La Sauvenière\r
Poliez-le-Grand, Bois-la-Croix\r
Poliez-Pittet, Grands-Champs\r
Poliez-Pittet, Les Roches\r
Poliez-Pittet, collège\r
Poliez-Pittet, village\r
Pollegio, Centrale d'esercizio\r
Pollegio, Piazza\r
Pollegio, Pasquerio\r
Polmengo, di Sopra\r
Polmengo, Paese\r
Pompaples, La Colline\r
Pomy, collège\r
Pomy, Centre Orif\r
Pomy, croisée de Sermuz\r
Pomy, village\r
Pont (Veveyse), Perey-Martin\r
Pont (Veveyse), village\r
Pont de Fayot\r
Pont du Rhône\r
Pont-Céard\r
Pont-Céard, gare\r
Pont-de-Drapel\r
Pont-de-la-Morge, Mont d'Or\r
Pont-de-la-Morge, centre\r
Pont-la-Ville, Sur-Momont\r
Pont-la-Ville\r
Ponte Brolla, Stazione\r
Ponte Brolla\r
Ponte Capriasca, Nogo\r
Ponte Capriasca, Paese\r
Ponte Capriasca, Crano\r
Ponte Capriasca, Nogo Sopra\r
Ponte Cremenaga, Paese\r
Ponte Cremenaga, Roncaccio\r
Ponte Semina\r
Ponte Tresa, Dogana\r
Ponte Tresa, Stazione\r
Ponte Tresa, Fabbrica Tappeti\r
Ponte Tresa\r
Ponte Tresa, Chiesa\r
Ponte Tresa (lago)\r
Pontenet, gare\r
Pontenet\r
Ponthaux, auberge\r
Ponthaux, Les Chalosys\r
Ponthaux, école\r
Ponthaux, Les Ecovettes\r
Ponthaux, Marterex\r
Ponto Valentino, Fontana\r
Ponto Valentino, Paese\r
Pontresina, Godin\r
Pontresina, Post\r
Pontresina, Punt Ota Sur\r
Pontresina, Sportpavillon\r
Pontresina, Schlossgarage\r
Pontresina\r
Pontresina, Gitögla\r
Pontresina, Palü\r
Pontresina, Bahnhof\r
Pontresina, Rondo\r
Pontresina (Sesselb. Languard)\r
Porrentruy, Etang Corbat\r
Porrentruy, Belle-Croix\r
Porrentruy, Varandin\r
Porrentruy, Tarascon\r
Porrentruy, rte de Belfort\r
Porrentruy, Sous-Bellevue\r
Porrentruy, Rue Merguin\r
Porrentruy, route Bressaucourt\r
Porrentruy, avenue Cuenin\r
Porrentruy, les Rochattes\r
Porrentruy, JURASSICA Museum\r
Porrentruy, Bacavoine\r
Porrentruy, rue de l'Oiselier\r
Porrentruy, Minoux\r
Porrentruy, St-Paul\r
Porrentruy, Roche-de-Mars\r
Porrentruy, gare\r
Porrentruy, bif. de Beaupré\r
Porrentruy, Hôpital entrée\r
Porrentruy, Rte de Courgenay\r
Porrentruy, St-Michel\r
Porrentruy, Mont Terri\r
Porrentruy, Château\r
Porrentruy, Haute-Fin\r
Porrentruy, Joseph Trouillat\r
Porrentruy, Fbg St. Germain\r
Porrentruy, Ô Vergers d'Ajoie\r
Porrentruy, Planchettes\r
Porrentruy, les Tilleuls\r
Porrentruy, Petite Promenade\r
Porrentruy, sur le Banné\r
Porrentruy\r
Porrentruy, Voyeboeuf\r
Porrentruy, Patinoire\r
Porrentruy, Rasse\r
Porrentruy, Collège Thurmann\r
Porrentruy, Vauches/Perche\r
Porrentruy, ville\r
Porrentruy, Haut de la Presse\r
Porsel, village\r
Porsel, Les Bois\r
Port, Gummen\r
Port, Bellevue\r
Port, Porthof\r
Port, Neumatt\r
Port, Spittel\r
Port, Dorf\r
Port, Lindenweg\r
Port\r
Port, Moosgasse\r
Port, Schulweg\r
Port, Friedhof Hueb\r
Portalban\r
Portalban, école\r
Portalban, village\r
Portalban, Dessus\r
Porto Ronco, Rivabella\r
Porto Ronco, Acapulco\r
Porto Ronco, Posta\r
Porto Ronco, Crodolo Verbano\r
Porto Ronco, Murisc\r
Porto Ronco, la Rocca\r
Porto Ronco (lago)\r
Porza, Tavesio\r
Porza, Paese\r
Porza, Belvedere\r
Posat, village\r
Poschiavo, Stazione\r
Poschiavo, Scuole\r
Poschiavo\r
Poschiavo, Solch\r
Poschiavo, Municipio\r
Poschiavo, Ospedale\r
Poschiavo, Curtinell\r
Posieux, Agroscope Nord\r
Posieux, Vany\r
Posieux, Froideville\r
Posieux, Grangeneuve\r
Posieux, Agroscope\r
Posieux, Agroscope Ouest\r
Posieux, village\r
Pozzulasc, Fermata\r
Praden, alte Post\r
Praden, Kurhaus\r
Pragg, Jarella\r
Pragg, Bahnhof Furna\r
Pragg, Katzenboden\r
Pragg, Unterjarella\r
Pragg, Bänkli\r
Prahins, village\r
Prahins, Les Ivuez\r
Pralong, (Val d'Hérémence)\r
Prangins, Les Mélèzes\r
Prangins, Pont de la Redoute\r
Prangins, Vieux Pressoir\r
Prangins, Sadex\r
Prangins, La Bruyère\r
Prangins, gare\r
Prangins, La Tuilière\r
Prangins, Tour d'Eau\r
Prangins, Les Morettes\r
Prangins, La Banderolle\r
Prangins, temple\r
Prangins, hôpital\r
Prangins, Sus-Gare\r
Prangins, Bénex-Dessus\r
Prangins, Les Abériaux\r
Prangins, Les Clos\r
Prangins, Musée national\r
Pranzaira, Albigna\r
Pranzaira (Albigna)\r
Prapperot\r
Praratoud, Laiterie\r
Prarion\r
Prato, Ponte\r
Prato (Leventina), Paese\r
Prato (Leventina),Biv.Mascengo\r
Pratteln, Münchacker\r
Pratteln, Gempenstrasse\r
Pratteln, Bahnhof Süd\r
Pratteln, Krummeneich\r
Pratteln, Längipark\r
Pratteln, Schloss\r
Pratteln, Schlossstrasse\r
Pratteln, Schwimmbad\r
Pratteln, Rankacker\r
Pratteln, Lindli\r
Pratteln, Kästeli\r
Pratteln, Rührbergweg\r
Pratteln, Grüssen\r
Pratteln, Chästeli\r
Pratteln, Breiti\r
Pratteln, Zurlinden\r
Pratteln, Altersheim\r
Pratteln, Aegelmatt\r
Pratteln, Bahnhof Nord\r
Pratteln, Saline\r
Pratteln\r
Pratteln, Zentrum Grüssen\r
Pratteln, Rosenmatt\r
Pratteln, Wanne\r
Pratteln, Bahnhofstrasse\r
Pratteln, Hülften\r
Pratteln, Gehrenacker\r
Pratteln, Rütscheten\r
Pratteln, Steinhölzli\r
Pratteln Salina Raurica\r
Pratval, Dorf\r
Pratval, Gemeindehaus\r
Pratval, Rietberg\r
Pravidondaz (Salins), école\r
Prayon\r
Praz\r
Präz, Dalin\r
Präz, Dorf\r
Präz, Curscheglias\r
Praz (Vully), village\r
Praz-de-Fort, Le Revers\r
Praz-de-Fort, Branche d'en-Bas\r
Praz-de-Fort\r
Praz-de-Fort, Chalet Bérard\r
Praz-de-Fort, Branche en-Haut\r
Praz-Jean VS, village\r
Praz-Jean VS, Stand Mourty\r
Prazet\r
Pré de Bougnone\r
Pré-Petitjean\r
Preda, Lai da Palpuogna\r
Preda, Stazion\r
Preda, Hotel Kulm/Bahnhof\r
Preda, Crap Alv\r
Preda\r
Predelp\r
Pregassona, Ronco Villa\r
Pregassona, Fola\r
Pregassona, Bozzoreda\r
Pregassona, Boschina\r
Pregassona, Viarnetto\r
Pregassona, Croce Verde\r
Pregassona, Piazza di Giro\r
Pregassona, Paese\r
Pregny, Penthes\r
Pregny, Palud\r
Pregny, mairie\r
Pregny, village\r
Prélaz-sur-Blonay\r
Prêles\r
Prêles, Louvain\r
Prêles, gare\r
Prêles, lavage\r
Prêles, collège\r
Prélionne\r
Premier, croisée de Forel\r
Premier, village\r
Premier, collège\r
Premploz, village\r
Premploz, Saladin\r
Preonzo, Bivio per Claro\r
Preonzo, Nord\r
Preonzo, Piazza\r
Preonzo, Paese\r
Presinge, Bornes\r
Presinge, L'Avenir\r
Presinge, village\r
Presinge, L'Abbaye\r
Presinge, L'Avenir croisée\r
Presinge, Grand-Cara\r
Presinge, Cara-Douane\r
Presinge, Basselat\r
Préverenges, Capellan\r
Préverenges, Taudaz\r
Préverenges, village\r
Prévondavaux, village\r
Prévonloup, poste\r
Prévonloup, café\r
Prez-vers-Noréaz, scierie\r
Prez-vers-Noréaz, croisée\r
Prez-vers-Noréaz, Médecin\r
Prez-vers-Siviriez, Chaussets\r
Prez-vers-Siviriez, Les Combes\r
Prez-vers-Siviriez, village\r
Prilly, Grand Vigne\r
Prilly, Chasseur\r
Prilly, centre\r
Prilly, Flumeaux\r
Prilly, Coudraie\r
Prilly, Huttins\r
Prilly, Mont-Goulin\r
Prilly, Corminjoz\r
Prilly-Chasseur\r
Prilly-Malley\r
Prilly-Malley, Galicien\r
Prilly-Malley, gare\r
Prilly-Malley, gare/aréna\r
Primadengo\r
Pringy, village\r
Pringy, La Loue\r
Prodalp\r
Prodkamm\r
Prodör\r
Produit, bif.\r
Prolin\r
Promasens, Les Planches\r
Promasens, église\r
Promontogno, Punt Spizarun\r
Promontogno, Posta\r
Promontogno, Ospedale Flin\r
Promontogno, Spino\r
Pros da Darlux\r
Prosito, Paese\r
Prosito, Nord\r
Prosito, Sud\r
Provence, village\r
Provence, Les Rochats\r
Provence, poste\r
Provence, Le Couvent\r
Provence, anc. poste\r
Provence, La Grangette\r
Provence, Vuissens\r
Prugiasco, Valle\r
Prugiasco, Paese\r
Prui\r
Prui (Talstation Clünas)\r
Puidoux, village\r
Puidoux, Cité-de-Sully\r
Puidoux\r
Puidoux, Moreillon\r
Puidoux, Logis du Pont\r
Puidoux, Grangeneuve\r
Puidoux, La Lôche\r
Puidoux, En Botonnet\r
Puidoux, Drugex\r
Puidoux, gare\r
Pully, port\r
Pully, gare\r
Pully, Les Liaudes\r
Pully, Tour Haldimand\r
Pully, Roses\r
Pully, Chenaulaz\r
Pully, Rosiaz\r
Pully, Pré Pariset\r
Pully, Joliette\r
Pully, Perraudettaz\r
Pully, Monts-de-Pully\r
Pully, Val-Vert\r
Pully, Vallon\r
Pully, Osches\r
Pully, Châtaignier\r
Pully, Somais\r
Pully, Pierraz-Portay\r
Pully, Métairie\r
Pully, Pavillard\r
Pully, Caudoz\r
Pully, C. F. Ramuz\r
Pully, Montillier\r
Pully, Vignes\r
Pully, Verney\r
Pully, Moulins\r
Pully, Trois-Chasseurs\r
Pully, Boverattes\r
Pully, Rochettaz\r
Pully, Clergère\r
Pully, Reymondin\r
Pully, Daillettes\r
Pully, Ravessoud\r
Pully, Margerol\r
Pully, Bruyère\r
Pully, Bourdonnière\r
Pully,Centre Sportif Rochettaz\r
Pully\r
Pully, Ruisselet\r
Pully (lac)\r
Pully-Nord\r
Punt la Drossa P4\r
Punt Muragl, Talstation\r
Punt Muragl\r
Punt Muragl (Talstation)\r
Punt Muragl Staz\r
Puplinge, Aumônes\r
Puplinge, Les Petoux\r
Puplinge, Grésy\r
Puplinge, Brolliets\r
Puplinge, mairie\r
Puplinge, Cornière\r
Puplinge, Frémis\r
Puplinge, Pré-Marquis\r
Pura, Paese\r
Pura, Ai Ronchetti\r
Pura, Moriscio\r
Pura, Loco\r
Pura, Piazzale Latéria\r
Pura, Magliasina\r
Purasca, Paese\r
Purasca, Inferiore\r
Purasca, Posta Vecchia\r
Putz, Dorf\r
Putz, Spondatöbeli\r
Quarten, Kirche\r
Quarten, Dorf\r
Quartino, Chiesa\r
Quartino, Stazione\r
Quartino, Bivio\r
Quartino, Gerrascia\r
Quartino\r
Quartino, Scuole\r
Quartino, Centro Luserte\r
Quinten\r
Quinten Au\r
Quinto, Morenca\r
Quinto, Scruengo TCS\r
Quinto, Paese\r
Quinto, Scruengo Paese\r
Rabgiusa\r
Rabius, vitg\r
Rabius, Via Surrein\r
Rabius, scola\r
Rabius-Surrein\r
Rabius-Surrein, staziun\r
Radelfingen b. A., Mühlethal\r
Radelfingen b. A., Salzmatt\r
Radelfingen b. A., Dorf\r
Räfis, Weidweg\r
Räfis, Stationsstrasse\r
Räfis, Schulhaus\r
Räfis, Bäckereistrasse\r
Räfis, Gätterli\r
Rafz, Pflegeheim Peteracker\r
Rafz, Usserdorf\r
Rafz, Bleiki\r
Rafz, Bahnhof\r
Rafz\r
Rafz, Friedhof\r
Rafz, Post\r
Rain, Dorf\r
Rain, Sandblatten\r
Rain, Rüti\r
Ramersberg, Dörfli\r
Rämismühle-Zell\r
Ramiswil, Abzw. Scheltenstr.\r
Ramiswil, Kapelle\r
Ramiswil, Dorf\r
Ramiswil, Mühle\r
Ramiswil, Alpenblick\r
Ramlinsburg, Brunnacker\r
Ramlinsburg, Niderhof\r
Ramosch, Plaz\r
Ramosch, Fermada\r
Ramsei\r
Ramsei, Bahnhof\r
Ramsen, Sonne\r
Ramsen, Dorf\r
Ramsen, Brücke\r
Ramsen, Zoll\r
Ramsen, Petersburg\r
Ramslauenen\r
Rancate, Cantone\r
Rancate, Cimitero\r
Rancate, Piazza S. Stefano\r
Rancate, Posta\r
Rancate, Vallechiara\r
Rancate, Prati di Fondo\r
Rancate, ai Grotti\r
Rances, bif.\r
Rances, Praz-Riond\r
Randa\r
Randogne, centre scolaire\r
Randogne, village\r
Randogne, La Côte\r
Randolins\r
Randolins (Suvretta)\r
Ranflüh, Ranflühmatte\r
Ranflüh, Ranflühschachen\r
Ranflüh, Oberdorf\r
Ranzo, Bivio per S. Abbondio\r
Ranzo, Piccolo Mondo\r
Ranzo, Paese\r
Ranzo (lago)\r
Ranzo-S. Abbondio\r
Ranzo-S. Abbondio, Stazione\r
Raperswilen, Im Wiel\r
Raperswilen, Dorf\r
Raperswilen, Schulhaus\r
Rapperswil BE, Ziegelei\r
Rapperswil BE, Gemeindehaus\r
Rapperswil BE, Oberdorf\r
Rapperswil BE, Schönbrunnen\r
Rapperswil SG, Kreuzliplatz\r
Rapperswil SG, H.-Rathgeb-Weg\r
Rapperswil SG, Hanfländerstr.\r
Rapperswil SG, Attenhoferstr.\r
Rapperswil SG, Kinderzoo\r
Rapperswil SG, Bildau\r
Rapperswil SG, Sonnenhof\r
Rapperswil SG, Greithstrasse\r
Rapperswil SG, EW\r
Rapperswil SG, Sportanl. Lido\r
Rapperswil SG, Oberseeplatz\r
Rapperswil SG, Scheidweg\r
Rapperswil SG, Cityplatz\r
Rapperswil SG, Zeughaus\r
Rapperswil SG\r
Rapperswil SG, Glärnischstr.\r
Rapperswil SG, Hanfländer\r
Rapperswil SG, Schulstrasse\r
Rapperswil SG, Bahnhof Süd\r
Rapperswil SG, Bahnhof\r
Rapperswil SG (See)\r
Rapperswil SG Hochschule (See)\r
Raron, Turtig\r
Raron, Dorf\r
Raron, Schulhaus\r
Raron, Kanalstrasse\r
Raron, Bietschi\r
Raron\r
Raron, Industrie\r
Raron, Bahnhof\r
Raron, Bodmereia\r
Raron (Talstation Eischoll)\r
Raron (Talstation Unterbäch)\r
Rasa\r
Räterichsboden\r
Räterschen\r
Ravecchia, Paese\r
Ravecchia, Belsoggiorno\r
Ravecchia, Piazza Fontana\r
Ravecchia, Von Mentlen\r
Ravecchia, Madonna della Neve\r
Ravina\r
Ravoire, colonie\r
Ravoire, Planojean\r
Ravoire, hôtel\r
Ravoire, bif. La Forclaz\r
Ravoire, Le Feylet\r
Ravoire, Cretex\r
Realp\r
Realp, Post\r
Realp Autoverlad\r
Realp DFB\r
Realta, Industriezone\r
Rebeuvelier, poste\r
Rebeuvelier, Rest. du Moulin\r
Rebstein, Ausserdorf\r
Rebstein, Steinacker\r
Rebstein, Dorf\r
Rebstein, Betten\r
Rebstein-Marbach\r
Recherswil, Dorf\r
Recherswil, Freiheit\r
Recherswil, Unterdorf\r
Rechthalten, Weissenstein\r
Rechthalten, Wolfeich\r
Rechthalten, Rotkreuz\r
Rechthalten, Dorf\r
Réchy, village\r
Réchy, Grampraz\r
Reckenwil, Steinberg\r
Reckingen, Abzw. Bahnhof\r
Reckingen VS\r
Réclère, village\r
Réclère, Les Grottes\r
Recolaine, Pont de Cran\r
Recolaine, Es Montes\r
Recolaine, La Filature\r
Reconvilier\r
Reconvilier, FMB\r
Reconvilier, Bel-Air\r
Reconvilier, gare\r
Regensberg, Hirsmühle\r
Regensberg, Höfli\r
Regensberg, Dorf\r
Regensdorf, Pumpwerkstrasse\r
Regensdorf, Zentrum Ost\r
Regensdorf, Lettenhau\r
Regensdorf, Furtbächli\r
Regensdorf, Strassenverkehrs.\r
Regensdorf, Querstrasse\r
Regensdorf, Feldblumenstrasse\r
Regensdorf, Allmend\r
Regensdorf, Altersheim\r
Regensdorf, Sportanlage Wisa.\r
Regensdorf, Hardhölzli\r
Regensdorf, Ostring\r
Regensdorf, Obstgarten\r
Regensdorf, Gemeindehaus\r
Regensdorf, Holenbach\r
Regensdorf, Althard/Bahnhof\r
Regensdorf, Moosächer\r
Regensdorf, Spittelhölzli\r
Regensdorf, Zentrum\r
Regensdorf, Chrüzächer\r
Regensdorf, Dreispitz\r
Regensdorf-Watt, Bahnhof\r
Regensdorf-Watt\r
Rehetobel, Midegg\r
Rehetobel, Säntis\r
Rehetobel, Ausserkaien\r
Rehetobel, Nasen\r
Rehetobel, Kaien\r
Rehetobel, Sonder\r
Rehetobel, Hörnlirank\r
Rehetobel, Zweibrücken\r
Rehetobel, Dorf\r
Rehetobel, Schützenhaus\r
Rehetobel, Schulhaus\r
Rehetobel, Robach\r
Reichenau-Tamins, Adler\r
Reichenau-Tamins\r
Reichenbach b. B., Grubenweg\r
Reichenbach b. B., Känelgasse\r
Reichenbach i. K., Reudlen\r
Reichenbach i. K., Bären\r
Reichenbach i. K., Buchholz\r
Reichenbach i. K., Müli\r
Reichenbach i. K., Bahnhof\r
Reichenbach im Kandertal\r
Reichenbachfall\r
Reichenburg, Kreuzwies\r
Reichenburg, Altersheim\r
Reichenburg, Bahnhof\r
Reichenburg, Allmeind\r
Reichenburg\r
Reichenburg, Dorf\r
Reiden, Sonne\r
Reiden, Friedmattstrasse\r
Reiden, Industrie Weiher\r
Reiden, Kirche\r
Reiden, Mehlsecken\r
Reiden, Unterdorf\r
Reiden, Bahnhof\r
Reiden\r
Reigoldswil, Linde\r
Reigoldswil, Hoggen\r
Reigoldswil, Gemeindezentrum\r
Reigoldswil, Bütschen\r
Reigoldswil, Marchmatt\r
Reigoldswil, Dorfplatz\r
Reigoldswil, Bündten\r
Reigoldswil (Wasserfallenbahn)\r
Reinach AG, Sportanlagen\r
Reinach AG, Alte Strasse\r
Reinach AG, Saalbau\r
Reinach AG, Hochhaus\r
Reinach AG, Bahnhof\r
Reinach AG, Beinwiler Höhe\r
Reinach AG\r
Reinach AG Mitte\r
Reinach AG Nord\r
Reinach BL, Vogesenstrasse\r
Reinach BL, Landhof\r
Reinach BL, Neu-Reinach\r
Reinach BL, Habsmatte\r
Reinach BL, Lochacker\r
Reinach BL, Neuhofstrasse\r
Reinach BL, Chäppeli\r
Reinach BL, Bruggstrasse\r
Reinach BL, Aumatten\r
Reinach BL, Bodmenstrasse\r
Reinach BL, Bruggrain\r
Reinach BL, Surbaum\r
Reinach BL, Reinacherhof\r
Reinach BL, TechCenter Kägen\r
Reinach BL, Rebberg\r
Reinach BL, Landererstrasse\r
Reinach BL, Mischeli\r
Reinach BL, Weiermatten\r
Reinach BL, Dorf\r
Reinach BL, Süd\r
Reitnau, Oberdorf\r
Reitnau, Halde\r
Reitnau, Unterdorf\r
Rekingen AG, Rainächer\r
Rekingen AG\r
Rekingen AG, Dorf\r
Remaufens, Aux Pilons\r
Remaufens, village\r
Remaufens, gare\r
Remaufens\r
Remaufens, route du Crage\r
Remetschwil, Garage\r
Remetschwil, Dorf\r
Remigen, Abzw. Ueberthal\r
Remigen, Stig\r
Remigen, Zentrum\r
Renan, village\r
Renan BE\r
Renens VD, Caudray\r
Renens VD, Simplon\r
Renens VD, Hôtel-de-Ville/ECAL\r
Renens VD, Croisée/Tilleuls\r
Renens VD, Vorsiaz\r
Renens VD, Marais\r
Renens VD, 1er Mai\r
Renens VD, 1er Août\r
Renens VD, Bourg-Dessus\r
Renens VD, Borjod\r
Renens VD, Sous l'Eglise\r
Renens VD, Saugiaz\r
Renens VD, 14 Avril\r
Renens VD, Roche\r
Renens VD, Baumettes\r
Renens VD, Sur-la-Croix\r
Renens VD, Florissant\r
Renens VD, Longemalle\r
Renens VD, Industrie\r
Renens VD, Follieu\r
Renens VD, Censuy\r
Renens VD, Perrelet\r
Renens VD, Biondes\r
Renens VD, Temple de Broye\r
Renens VD, gare\r
Renens VD, rue du Lac\r
Renens VD, piscine\r
Renens VD, gare/Epenex\r
Renens VD, Avenir\r
Renens VD\r
Rennaz, centre commercial\r
Rennaz, village\r
Rennaz, hôpital\r
Rennaz (Leysin)\r
Reppaz\r
Reppischhof\r
Ressudens\r
Resti\r
Reuchenette-Péry, gare\r
Reuchenette-Péry\r
Reuenthal AG, Dorfplatz\r
Reusch, Talstation\r
Reusch\r
Reute AR, Brücke\r
Reute AR, Hinterdorf\r
Reute AR, Dorf\r
Reute AR, Bellevue\r
Reute AR, Grütli\r
Reute AR, Mohren\r
Reute AR, Sturzenhard\r
Reute AR, Steinegacht\r
Reuti b. Weinfelden, Hauptstr.\r
Reutigen, Kapf\r
Reutigen, Viehschauplatz\r
Reutigen, Dorf\r
Reutigen, Hintere Gasse\r
Reutigen, Hani\r
Reutlingen\r
Revereulaz\r
Reverolle, Chaniaz\r
Reverolle, village\r
Reverolle\r
Rhäzüns, Luftseilbahn LRF\r
Rhäzüns, Bahnhof\r
Rhäzüns, Dorfplatz\r
Rhäzüns, Mineralquelle\r
Rhäzüns, Ratiras\r
Rhäzüns\r
Rhäzüns (Luftseilbahn Feldis)\r
Rheinau, Galgenbuck\r
Rheinau, Hallenbad\r
Rheinau, Psych. Uniklinik\r
Rheinau, Schulplatz\r
Rheinau, Unterstadt\r
Rheinau Kraftwerk\r
Rheineck, Bahnhof\r
Rheineck, Schwimmbad\r
Rheineck, Brüggershofstrasse\r
Rheineck, Altensteig\r
Rheineck\r
Rheineck, National\r
Rheineck, Asylstrasse\r
Rheineck Schifflände\r
Rheinfall Schlössli Wörth\r
Rheinfelden, Bahnhof\r
Rheinfelden, Dianapark\r
Rheinfelden, Parkresort\r
Rheinfelden, Pappelnweg\r
Rheinfelden, Albrechtsplatz\r
Rheinfelden, Kohlplatz\r
Rheinfelden, Stadtpark\r
Rheinfelden, Spitaltreppe\r
Rheinfelden, Alte Saline\r
Rheinfelden, Flossländeweg\r
Rheinfelden, Reha\r
Rheinfelden, Untere Marktgasse\r
Rheinfelden, Strandbad\r
Rheinfelden, Töpferweg\r
Rheinfelden, Regionalspital\r
Rheinfelden, Eremitage\r
Rheinfelden, Salmen-Park\r
Rheinfelden, Augarten Zentrum\r
Rheinfelden, Waldfriedhof\r
Rheinfelden, Spitalhalde\r
Rheinfelden, HPS\r
Rheinfelden\r
Rheinfelden, Rosengässchen\r
Rheinfelden, Lichsweg\r
Rheinfelden, Kloos\r
Rheinfelden, Sonnenbergstrasse\r
Rheinfelden, Habich-Dietschy-S\r
Rheinfelden, Weiherfeld\r
Rheinfelden, Salzbodenstrasse\r
Rheinfelden, Post\r
Rheinfelden, Altersheim\r
Rheinfelden, Engerfeld\r
Rheinfelden Augarten\r
Rheinfelden Schifflände\r
Rheinsfelden\r
Rheinsulz, Dorf\r
Riaz, CO\r
Riaz, Champy\r
Riaz, Hôpital\r
Riaz, Centre\r
Riaz, poste\r
Riazzino, Al Bosco\r
Riazzino, Bugaro\r
Riazzino, Bivio Stradonino\r
Riazzino, Bolla\r
Riazzino, Scuole\r
Riazzino, Montedato Paese\r
Riazzino\r
Riazzino, Montedato Municipio\r
Riazzino, Stazione\r
Richenthal, Post\r
Richenthal, Kirche\r
Richenthal, Kurhaus\r
Richigen, Dorf\r
Richigen, Niederhaus\r
Richinen\r
Richterswil, Wisli\r
Richterswil, Speerstrasse\r
Richterswil, Bahnhof\r
Richterswil, Neuhus\r
Richterswil, Säumerstrasse\r
Richterswil, Schwyzerstrasse\r
Richterswil, Untere Schwanden\r
Richterswil, Obermatt\r
Richterswil, Im Leemann\r
Richterswil\r
Richterswil, Bächlistrasse\r
Richterswil, Kerag\r
Richterswil, Chrummbächli\r
Richterswil (See)\r
Ricken SG, Bildhaus\r
Ricken SG, Hinterer Schümberg\r
Ricken SG, Kirche\r
Ricken SG, Rittmarren\r
Ricken SG, Uznacherstrasse\r
Rickenbach AG, Zürichstrasse\r
Rickenbach bei Wil, Mühle\r
Rickenbach bei Wil, Pünt\r
Rickenbach bei Wil, Zentrum\r
Rickenbach bei Wil, Wilfeld\r
Rickenbach bei Wil, Breite\r
Rickenbach BL, Hinterdorf\r
Rickenbach BL, Weier\r
Rickenbach LU, Rüchlig\r
Rickenbach LU, Dorf\r
Rickenbach LU, Krümmigasse\r
Rickenbach LU, Bohler\r
Rickenbach SO, Dorf\r
Rickenbach Sulz, Mottlistrasse\r
Rickenbach Sulz, Sunnezirkel\r
Rickenbach SZ, Aufiberg/Gruobi\r
Rickenbach SZ, Handgruobi\r
Rickenbach SZ, Meinradsrank\r
Rickenbach SZ, Lauenen\r
Rickenbach SZ, Windstock\r
Rickenbach SZ, Chaisten\r
Rickenbach SZ, Gründel/St Karl\r
Rickenbach SZ, Bol\r
Rickenbach SZ, Dorf\r
Rickenbach SZ, Stalden\r
Rickenbach SZ, Oberberg\r
Rickenbach SZ, Rotenfluebahn\r
Rickenbach SZ (Rotenfluebahn)\r
Rickenbach ZH, Dorf\r
Rickenbach-Attikon\r
Rickenbach-Attikon, Bahnhof\r
Riddes, les Babioux\r
Riddes, téléphérique\r
Riddes, gare\r
Riddes\r
Riddes (téléphérique)\r
Ried (Lötschen)\r
Ried (Muotathal), Selgis\r
Ried (Muotathal), Hesigen\r
Ried (Muotathal), Grünenwald\r
Ried (Muotathal), Kappelmatt\r
Ried (Muotathal), Vord. Brücke\r
Ried (Muotathal), Mühlestuden\r
Ried (Muotathal), Seilb.Illgau\r
Ried (Muotathal) (Seilbahn)\r
Ried b. Kerzers, Abzw. Gurz.\r
Ried b. Kerzers, Post\r
Ried b. Kerzers, Dorf\r
Ried-Brig, Biela\r
Ried-Brig, Lingwurm\r
Ried-Brig, Brei\r
Ried-Brig, Mürini\r
Ried-Brig, Bleiken\r
Ried-Brig, Talstation LRR\r
Ried-Brig, Lauenen\r
Ried-Brig, Chavez\r
Ried-Brig, Altersheim\r
Ried-Brig, Rufigraben\r
Ried-Brig (Rosswald Talstat.)\r
Ried-Mörel\r
Rieden AG, Oederlin\r
Rieden AG, Boldi\r
Rieden AG, Alte Landstrasse\r
Rieden AG, Limmatsteg\r
Rieden SG, Dorf\r
Riederalp (Hohfluh)\r
Riederalp (Moosfluh)\r
Riederalp Bachtula\r
Riederalp Blausee\r
Riederalp Blausee (Moosfluh)\r
Riederalp Mitte\r
Riederalp Schenebodu\r
Riederalp West\r
Riederfurka\r
Riedern GL, Staldengarten\r
Riedern GL, Schulhaus\r
Riedern GL, Lerchen\r
Riedholz, Bahnhof\r
Riedholz, Bei den Weihern\r
Riedholz\r
Riedikon, Chis/Naturstation\r
Riedikon, Dorf\r
Riedli, Talstation Wiriehorn\r
Riedlig\r
Riedmatt SZ\r
Riedstätt, ob dem Wald\r
Riedstätt, Post\r
Riedt b. Neerach, Storchen\r
Riedt b. Neerach, Riedacher\r
Riedtwil, Schulhaus\r
Riedtwil, Mittlerer Kasten\r
Riedtwil, Bahnhof\r
Riehen, Bluttrainweg\r
Riehen, Bettingerstrasse\r
Riehen, Am Hang\r
Riehen, Wasserstelzen\r
Riehen, Hinter Gärten\r
Riehen, Wenkenhof\r
Riehen, Haidweg\r
Riehen, Im Schlipf\r
Riehen, Morystrasse\r
Riehen, Bahnhof\r
Riehen, Bahnübergang\r
Riehen, In der Au\r
Riehen, Mühlestieg\r
Riehen, Gotenstrasse\r
Riehen, Martinsrain\r
Riehen, Hohlweg\r
Riehen, Rudolf Wackernagel-St\r
Riehen, Weilstrasse\r
Riehen, Webergässchen\r
Riehen, Schmiedgasse\r
Riehen, Hörnli Grenze\r
Riehen, Auf dem Rücken\r
Riehen, Lachenweg\r
Riehen, Dinkelbergstrasse\r
Riehen, Grenze\r
Riehen, Tiefweg\r
Riehen, Talmattstrasse\r
Riehen, Gänshaldenweg\r
Riehen, Friedhof am Hörnli\r
Riehen, Rotengraben\r
Riehen, Chrischonaweg\r
Riehen, Moosrain\r
Riehen, Mohrhaldenstrasse\r
Riehen, Steingrubenweg\r
Riehen, Otto Wenk-Platz\r
Riehen, Habermatten\r
Riehen, Hungerbachhalde\r
Riehen, Burgstrasse\r
Riehen, Lörracherstrasse\r
Riehen, Fondation Beyeler\r
Riehen, Dorf\r
Riehen, Inzlinger Zoll\r
Riehen, Pfaffenloh\r
Riehen, Niederholzboden\r
Riehen, Hinterengeli\r
Riehen\r
Riehen, Albert Oeri-Strasse\r
Riehen Niederholz, Bahnhof\r
Riehen Niederholz\r
Riein, Giudem Vitg\r
Riein, vitg\r
Riemenstalden, Riedberg\r
Riemenstalden, alte Post\r
Riemenstalden, Hüsern\r
Riemenstalden, Chäppeliberg\r
Riemenstalden, Langrüti\r
Riet (Neftenbach)\r
Rietbach\r
Rietheim, Bahnhof\r
Rietheim\r
Rietheim, Badstrasse\r
Rietli, Bahnhof\r
Rietli\r
Riex, Mouniaz\r
Riex, fontaine\r
Riffelalp, Station\r
Riffelalp, Hotel\r
Riffelalp\r
Riffelberg\r
Riffelberg (Furi Bergstation)\r
Riffelberg (Gifthittli)\r
Riffenmatt, Giebel\r
Riffenmatt, Neuenmatt\r
Riffenmatt, Schwendi\r
Riffenmatt, Kreuzung\r
Rifferswil, Hausmatte\r
Rifferswil, Seleger Moor\r
Rifferswil, Unterrifferswil\r
Rifferswil, Oberrifferswil\r
Riggisalp (Bergstation)\r
Riggisalp (Talstat. Kaiseregg)\r
Riggisberg, Abegg-Stiftung\r
Riggisberg, Otzenbach\r
Riggisberg, Graben\r
Riggisberg, Beissern\r
Riggisberg, Post\r
Riggisberg, Spital\r
Riggisberg, Hasli\r
Riggli\r
Rigi Kaltbad (Luftseilbahn)\r
Rigi Kaltbad-First\r
Rigi Klösterli\r
Rigi Kulm\r
Rigi Scheidegg\r
Rigi Staffel\r
Rigi Staffelhöhe\r
Rigi Wölfertschen-First\r
Riken AG, Neustadt\r
Riken AG, Schule\r
Rikon\r
Rikon im Tösstal, Bahnhof\r
Rindal, Grütli\r
Rindal, Ritzenhüsli\r
Rindal, Ramsau\r
Rindal, Landhaus\r
Rindal, Unterrindal\r
Rindal, Oberrindal\r
Rinderberg\r
Rinderberg Büelti\r
Rinderhütte\r
Rindertitlis\r
Ringgenberg, Moosrain\r
Ringgenberg, Anhöhe-Burgseeli\r
Ringgenberg, Post\r
Ringgenberg\r
Ringgenberg, Säge\r
Ringgenberg (See)\r
Ringlikon, Gättern\r
Ringlikon, Dorf\r
Ringlikon, Langwies\r
Ringlikon\r
Ringoldingen\r
Riniken, Gemeindehaus\r
Riniken, Bruggerstrasse\r
Riniken, Post\r
Riom, spartaveias\r
Riom, vischnanca\r
Riom, Casti\r
Risch, Dorf\r
Risch, Stotzenacker\r
Risch, Eichengrundweg\r
Risch, Landhaus\r
Risch (See)\r
Ristis (Brunni-Bahnen)\r
Ritorto (Bavona)\r
Rittinen\r
Ritzingen\r
Riva S. Vitale, Battuta\r
Riva S. Vitale, Battistero\r
Riva S. Vitale, Cimitero\r
Riva S. Vitale, Scuola Media\r
Riva S. Vitale, Poiana (bus)\r
Riva S. Vitale, Piazza\r
Riva S. Vitale, Valserrata\r
Riva S. Vitale, Prati Maggi\r
Riva S. Vitale, Piazza Scuole\r
Riva S. Vitale, Roncaccio\r
Rivaz\r
Rivaz-St-Saphorin (lac)\r
Riveo, chiesa\r
Riveo, Paese\r
Rivera, Briccola\r
Rivera, Casa Comunale\r
Rivera, Protezione Civile\r
Rivera, Bivio Sorencino\r
Rivera, Bivio Capidogno\r
Rivera, Caslaccio\r
Rivera\r
Rivera, Passo del Ceneri\r
Rivera-Bironico, Posta/FFS\r
Rivera-Bironico\r
Rizenbach, Ofenhausstrasse\r
Rizenbach, Lerchenhubel\r
Robasacco, Curva Steiner\r
Robasacco, Paese\r
Robasacco, Bivio Sasselli\r
Robasacco, Via Cantonale\r
Robiei\r
Roc-d'Orsay\r
Roche VD, Rotzéranne-Pré-Clos\r
Roche VD\r
Roche VD, centre commercial\r
Roche VD, Salines\r
Rochefort, L'Erable\r
Rochefort, Carrefour\r
Rochefort, école\r
Rochers-de-Naye\r
Roches BE, Cheval blanc\r
Roches Grises\r
Rocourt\r
Rodels, Dorf\r
Rodels, Rèsch\r
Rodels-Realta, Abzw. Bahnhof\r
Rodels-Realta\r
Rodersdorf, Rösmatt\r
Rodersdorf, Station\r
Rodi, Posta\r
Rodi, Casa Gendotti\r
Rodi, Dazio Grande\r
Rodi, colonia Von Mentlen\r
Rodi (Funivia)\r
Roggenburg, Sägemühle\r
Roggenburg, Neumühle\r
Roggenburg, Abzw. Löwenburg\r
Roggenburg, Missionskreuz\r
Roggenburg, Dorf\r
Roggliswil, Post\r
Roggliswil, Niederwil\r
Roggliswil, Netzelen\r
Roggwil Buchägerten\r
Roggwil Dorf\r
Roggwil Schmitten\r
Roggwil TG, Ochsen\r
Roggwil TG, Frohheim\r
Roggwil TG, Ebnet\r
Roggwil TG, Post\r
Roggwil-Berg\r
Roggwil-Wynau\r
Rohr b. Olten\r
Rohrbach\r
Rolle, La Pièce\r
Rolle, Baccara\r
Rolle, Les Vernes\r
Rolle, centre ville\r
Rolle, place des Tilleuls\r
Rolle, hôpital\r
Rolle, La Pièce-Etraz\r
Rolle, déchetterie\r
Rolle, Quatre-Communes\r
Rolle, La Prairie\r
Rolle, Martinet\r
Rolle\r
Rolle, Les Eaux\r
Rolle, Uttins-Maupas\r
Rolle, route de Gilly\r
Rolle, gare nord\r
Rolle, Bellefontaine\r
Rolle (lac)\r
Romainmôtier, poste\r
Romainmôtier, Les Portes\r
Romainmôtier, église\r
Romainmôtier, Le Nid\r
Romairon, Les Rochats bif.\r
Romairon, village\r
Romairon, collège\r
Romanel-sur-Lausanne\r
Romanel-sur-Morges, Pra-Vuatte\r
Romanel-sur-Morges,Z.I. Moulin\r
Romanel-sur-Morges, poste\r
Romanens, laiterie\r
Romanens, Grotte\r
Romanshorn, Salmsacherstrasse\r
Romanshorn, Gärtliszelg\r
Romanshorn, Oberhüseren\r
Romanshorn, Holzgasse\r
Romanshorn, Hueb\r
Romanshorn, Alleestrasse\r
Romanshorn, Hofstrasse\r
Romanshorn, Weitenzelg\r
Romanshorn, Bahnhof\r
Romanshorn\r
Romanshorn, Coop\r
Romanshorn, Blumenweg\r
Romanshorn, Holzenstein\r
Romanshorn, Spitz\r
Romanshorn (See)\r
Romanshorn Autoquai\r
Rombach, Rombacherhof\r
Rombach, Hinterrain\r
Rombach, Widler\r
Rombach, Aabach\r
Rombach, Stock\r
Rombach, Obstgarten\r
Römerswil LU, Ludigen\r
Römerswil LU, Ludiswil\r
Römerswil LU, Eiholdern\r
Römerswil LU, Mur\r
Römerswil LU, Williswil\r
Römerswil LU, Gosperdingen\r
Römerswil LU, Rehag\r
Römerswil LU, Dorf\r
Römerswil LU, Niffel\r
Römerswil LU, Gehren\r
Romiti Felsentor\r
Romont BE\r
Romont BE, rte de Vauffelin\r
Romont FR, Les Echervettes\r
Romont FR, poste\r
Romont FR, école primaire\r
Romont FR\r
Romont FR, Esplanade Arruffens\r
Romont FR, Les Glânes\r
Romont FR, Grand Rue\r
Romont FR, La Halle\r
Romont FR, gare\r
Romont FR, Les Rochettes-PAA\r
Romont FR, route d'Arruffens\r
Romont FR, Belle-Croix\r
Romont FR, CO de la Glâne\r
Romont FR, Electroverre\r
Romont FR, La Maula bas\r
Romont FR, La Maula haut\r
Romoos, Schwändi Zyberlibahn\r
Romoos, Schmitteli\r
Romoos, Holzwäge\r
Romoos, Post\r
Romoos, Stude\r
Romoos, Talherrenburg\r
Romoos, Adlisberg\r
Romoos, Flühboden\r
Rona, vischnanca\r
Roncapiano, Paese\r
Ronchini, Paese\r
Ronco (Bedretto)\r
Ronco (Gambarogno), Str. Lozze\r
Ronco (Gambarogno), Paese\r
Ronco (Quinto)\r
Ronco s. Ascona, F.na Martina\r
Ronco sopra Ascona, Chiesa\r
Ronco sopra Ascona, Posta\r
Ronco sopra Ascona, Pontif\r
Ronco sopra Ascona, cimitero\r
Ronco sopra Ascona,Via Barcone\r
Rongellen, Abzw.\r
Rongellen, Dorf\r
Root, Wiesstrasse\r
Root, Wilweg\r
Root, Ronmatt\r
Root, Dorf\r
Root, Schlosshof\r
Root D4, Bahnhof\r
Root D4\r
Root D4, Oberfeld\r
Ropraz, Home du Jorat\r
Ropraz, Corcelles-Jorat\r
Ropraz, Ussières\r
Ropraz, village\r
Rorbas, Bütbergstrasse\r
Rorbas, Dorfplatz\r
Rorbas, Hirschen\r
Rorbas, Aubrücke\r
Rorbas, Bruggi\r
Rorschach, Löwengarten\r
Rorschach, Landhaus\r
Rorschach, Langmoosstrasse\r
Rorschach, Pestalozzi\r
Rorschach, Rathaus\r
Rorschach, Friedau\r
Rorschach, Fuchsschwanz\r
Rorschach, Päd. Hochschule\r
Rorschach, Signalstrasse\r
Rorschach, Hauptbahnhof Süd\r
Rorschach\r
Rorschach, Mühletobelstrasse\r
Rorschach, Bodan\r
Rorschach Hafen\r
Rorschach Hafen (See)\r
Rorschach Stadt, Bahnhof\r
Rorschach Stadt\r
Rorschacherberg, Rosenegg\r
Rorschacherberg, Z-Friedhof\r
Rorschacherberg, Bernerhüsli\r
Rorschacherberg, Burg\r
Rorschacherberg, Zelgstrasse\r
Rorschacherberg, Bleichi\r
Rorschacherberg, Bachwies\r
Rorschacherberg, Swissair\r
Rorschacherberg, Hörnlibuck\r
Rorschacherberg, Seehalde\r
Rorschacherberg, Rosenacker\r
Rorschacherberg, Gemeindehaus\r
Rorschacherberg, Wilen\r
Rorschacherberg, Pflegeheim\r
Rorschacherberg, Seebleiche\r
Rorschacherberg, Wilenrain\r
Rorschacherberg, Sonnenhof/MZH\r
Röschenz, Kohlrütti\r
Röschenz, Oberdorf\r
Röschenz, Mühle\r
Röschenz, Dorfplatz\r
Röschenz, In der Eich\r
Röschenz, Unterdorf\r
Rosé, gare\r
Rosenlaui, Hotel\r
Rosenlaui, Gletscherschlucht\r
Rosental\r
Roseto (Bavona)\r
Rossa, Villaggio\r
Rossboda (Grossalp)\r
Rossemaison, haut du village\r
Rossemaison, Copas de sel\r
Rossemaison, Les Quatre-Vents\r
Rossemaison, école/poste\r
Rossemaison, bas du village\r
Rossenges, croisée\r
Rossens FR, In-Riaux\r
Rossens FR, village\r
Rossens FR, Illens\r
Rossens FR, La Rossinoise\r
Rossens VD, La Rapette\r
Rossens VD, village\r
Rossfälli (Saanen)\r
Rosshäusern, Brünnemoos\r
Rosshäusern\r
Rosshäusern, Zilacher\r
Rosshäusern, Bahnhof\r
Rossinière\r
Rossrüti, Oberdorf\r
Rossrüti, Schule\r
Rossrüti, Altersheim\r
Rossrüti, Rislen\r
Rossrüti, Furtbach\r
Rossura, Paese\r
Rossura, Bivio per Rossura\r
Rosswald\r
Rossweid\r
Rote Nase\r
Rotenboden\r
Rotenflue (Mythenregion)\r
Röthenbach b. H., Schützenhaus\r
Röthenbach b. H., Post\r
Röthenbach b. H., Chrump\r
Röthenbach b. H., Rest. Post\r
Röthenbach i.E., Fischbachbrü\r
Röthenbach i.E., Würzbrunnen\r
Röthenbach i.E., Feldmatt\r
Röthenbach i.E., Schindellegi\r
Röthenbach i.E., Fambach\r
Röthenbach i.E., Fischbach\r
Röthenbach i.E., Fambach Gara\r
Röthenbach i.E., Chuderhüsi\r
Röthenbach i.E., Dorf\r
Rothenbrunnen, Abzw. Bahnhof\r
Rothenbrunnen, Bahnhof\r
Rothenbrunnen\r
Rothenbrunnen, Giuvaulta\r
Rothenbrunnen, Dorf\r
Rothenburg, Lindau\r
Rothenburg, Eichenring\r
Rothenburg, Bertiswil\r
Rothenburg, Mauritiusring\r
Rothenburg, Wegscheiden\r
Rothenburg, Wahligen Nord\r
Rothenburg, Eschenbachstrasse\r
Rothenburg, Buzibach\r
Rothenburg, Flecken\r
Rothenburg, Süesstannen\r
Rothenburg Station\r
Rothenburg Station, Bhf. Ost\r
Rothenburg Station, Bhf. West\r
Rothenfluh, Asphof\r
Rothenfluh, Hirschengasse\r
Rothenfluh, Säge\r
Rothenhausen, Dorf\r
Rothenthurm, Altmatt Bahnhof\r
Rothenthurm, Dorf\r
Rothenthurm, Bahnhof\r
Rothenthurm, Erste Altmatt\r
Rothenthurm, Schoosstrasse\r
Rothenthurm, Biberegg\r
Rothenthurm, Distel\r
Rothenthurm\r
Rothorn VS\r
Rothrist, Weier\r
Rothrist, Rössli\r
Rothrist, Hungerzelg\r
Rothrist, Neue Industriestr.\r
Rothrist, Gländ\r
Rothrist, Bahnhof\r
Rothrist, Brunnhalde\r
Rothrist\r
Rothrist, Sennhof-Dörfli\r
Rothrist, Flecken\r
Rothrist, Oberwil\r
Rothrist, Breitenpark\r
Rothrist, Schwimmbad\r
Rothrist, Grüebli\r
Rothrist, Gemeindehaus\r
Rothwald, Ganterwald\r
Rothwald, Schutzhaus\r
Rotkreuz, Rüti\r
Rotkreuz, Lindenplatz\r
Rotkreuz, Weidstrasse\r
Rotkreuz, Küntwil\r
Rotkreuz, Birkenstrasse\r
Rotkreuz, Weihermatt\r
Rotkreuz, Industriestrasse\r
Rotkreuz, Ried\r
Rotkreuz, Waldetenstrasse\r
Rotkreuz, Schulanlagen\r
Rotkreuz, Bahnhof Nord\r
Rotkreuz, Langmatt\r
Rotkreuz, Sagi\r
Rotkreuz, Blegi\r
Rotkreuz\r
Rotkreuz, Ibikon\r
Rotkreuz, Forren\r
Rotkreuz, Breitfeld\r
Rotkreuz, Bahnhof Süd\r
Rotschuo\r
Rotstöckli\r
Rottenschwil, Kapelle\r
Rottenschwil, Seematten\r
Rottenschwil, Abzw.\r
Rottenschwil, Hecht\r
Rottenschwil, Rebberg\r
Rotzloch\r
Rougemont, Les Adannes\r
Rougemont\r
Rougemont (télécabine)\r
Route de Morgins\r
Roveredo GR, Ponte di Ferro\r
Roveredo GR, Mondan\r
Roveredo GR, Terra Bianca\r
Roveredo GR, Centro\r
Roveredo GR, CRS\r
Roveredo TI, Miera\r
Roveredo TI, Paese\r
Rovio, Costa\r
Rovio, Paese\r
Rovio, Ala Materna\r
Rovio, Selvone\r
Rovio, Basso\r
Rovray, village\r
Rubigen, Hauptstrasse\r
Rubigen, Beitenwil\r
Rubigen, Schwarzbach\r
Rubigen, Hunzigenbrügg\r
Rubigen, Bahnhof\r
Rubigen, Dorfmatte\r
Rubigen\r
Rubigen, Thunstrasse Süd\r
Rubigen, Wydenhof\r
Rubigen, Mühle Hunziken\r
Ruderbach\r
Rüderswil, Kirche\r
Rüderswil, Dorf\r
Rüdlingen, Sandgruben\r
Rüdlingen, Spitzrüti\r
Rüdlingen, Brückenwaage\r
Rüdlingen, Gemeindehaus\r
Rüdlingen, Steinenkreuz\r
Rüdlingen (Schiffstation)\r
Rudolfingen, Dorf\r
Rudolfstetten\r
Rudolfstetten Hofacker\r
Rudswil\r
Rüdtligen, Käserei\r
Rue, La Grotte\r
Rue, Montet bif.\r
Rue, Chez Cottet\r
Rue, L'Abergement\r
Rue, ville\r
Rüediswil\r
Rüeggisberg, Mättiwil\r
Rüeggisberg, Tromwil\r
Rüeggisberg, Than\r
Rüeggisberg, Post\r
Rüeggisberg, Schulhaus\r
Rüeggisberg, Lauimatt\r
Rüeggisberg, Gemeindehaus\r
Rüegsau, Weghaus\r
Rüegsau, Dorf\r
Rüegsauschachen, Zentrum\r
Rüegsbach, Britternneumatt\r
Rüegsbach, Oberrinderbach\r
Rüegsbach, Britternmatte\r
Rüegsbach, Dorf\r
Rüegsbach, Bachhaus\r
Rueras, Via Alpsu/Flurin\r
Rueras, Dieni vitg\r
Rueras\r
Ruestel\r
Rüeterswil, Dorf\r
Rüeterswil, Käserei\r
Rueun, Minas da Gulatsch\r
Rueun\r
Rueun, Dacla\r
Rueun, S. Francestg\r
Rueun, S. Clau\r
Rueun, Grava\r
Rueun, Las Dretgs\r
Rueun, Gula\r
Rueun, Chiglina\r
Rueyres VD, croisée\r
Rueyres VD, Le Dejors\r
Rueyres-les-Prés, La Chavane\r
Rueyres-les-Prés, anc. poste\r
Rueyres-les-Prés, bif.\r
Rueyres-les-Prés, village\r
Rueyres-les-Prés, école\r
Rueyres-St-Laurent,En Borgogne\r
Rueyres-St-Laurent, village\r
Rueyres-St-Laurent, bif.\r
Rueyres-Treyfayes, chapelle\r
Rüfenach AG, Schulhaus\r
Rüfenach AG, Vorderrein\r
Rüfenach AG, Hinterrein\r
Rüfenach AG, Dorf\r
Rüfenacht, Sperlisacher\r
Rüfenacht\r
Rüfenacht, Längimoos\r
Rüfenacht, Schlössli\r
Rufi, Wiesental\r
Rufi, Zentrum\r
Rufi, Maseltrangen\r
Rufi, Sonne\r
Ruggell, Kreuzstrasse\r
Ruggell, Sennerei\r
Ruggell, REC\r
Ruggell, Noflerstrasse\r
Ruggell, Rathaus\r
Ruggell, Zollamt\r
Ruggell, Rössleplatz\r
Ruggell, Schulzentrum\r
Ruggell, Limsenegg\r
Ruggell, Flandera\r
Ruggell, Industriering\r
Ruggell, Oberwiler\r
Ruggell, Kirche\r
Rümikon AG\r
Rümikon AG, Schulhaus\r
Rümikon AG, Bahnhof\r
Rumisberg, Bären\r
Rumisberg, Weissacker\r
Rumisberg, Schoren\r
Rumistal\r
Rümlang, Gemeindehaus\r
Rümlang, Bahnhof\r
Rümlang, Oberdorf\r
Rümlang, Ifangstrasse\r
Rümlang, Bäuler\r
Rümlang, Riedmatt\r
Rümlang, Letten\r
Rümlang, Riedmattstrasse\r
Rümlang\r
Rümlang, Zürichweg\r
Rümlang, Hörnlistrasse\r
Rümlang, Chilestieg\r
Rümlang, Heuelstrasse\r
Rümlang, Hofwisenunterführung\r
Rümlang, Rümelbach\r
Rümligen, Kettenschmiede\r
Rümligen, Schwanen\r
Rumlikon, Stuketen\r
Rumlikon, Dorfstrasse\r
Rümlingen\r
Rümlingen, Dorf\r
Runcahez Val Sumvitg\r
Rünenberg, Frohe Aussicht\r
Rünenberg, Mitteldorf\r
Rünenberg, Unterdorf\r
Ruogig\r
Rupperswil, Bahnhof\r
Rupperswil\r
Rupperswil, Haldenweg\r
Ruppoldsried, Dorfplatz\r
Rüschegg Gambach, Dorf\r
Rüschegg Gambach, Linde\r
Rüschegg Gambach, Hirschhorn\r
Rüschegg Gambach, Bärenwart\r
Rüschegg Graben, Kreuzung\r
Rüschegg Graben, Rütiplötsch\r
Rüschegg Heubach, Post\r
Rüschegg Heubach, Längenboden\r
Rüschegg Schwarzenbühl,Kurhaus\r
Rüschegg Süfternen, Grön\r
Rüschegg Süfternen, Gäggersteg\r
Ruschein, vitg\r
Ruschein, Tischinas\r
Ruschein, Clis\r
Rüschlikon, Belvoir\r
Rüschlikon, Bahnhof\r
Rüschlikon, Moosstrasse\r
Rüschlikon, Bodengasse\r
Rüschlikon, Langhaldenstrasse\r
Rüschlikon, Säumerstrasse\r
Rüschlikon, Rebsteig\r
Rüschlikon, Park im Grüene\r
Rüschlikon, Weidstrasse\r
Rüschlikon, Eggrain\r
Rüschlikon, Loorain\r
Rüschlikon, Schlossstrasse\r
Rüschlikon\r
Rüschlikon (See)\r
Russikon, Kirche\r
Russikon, Morgenthal\r
Russikon, Platte\r
Russikon, Dorf\r
Russikon, Gemeindehaus\r
Russikon, Wilhof\r
Russikon, Tüfi\r
Russin, Noirettes\r
Russin, Les Baillets\r
Russin, La Chaumaz\r
Russin, village\r
Russin\r
Russo\r
Russo, Ai Mundaa\r
Russy, village\r
Rüstenschwil, Dorf\r
Rüstenschwil, Kreuzung\r
Ruswil, Rebstockstrasse\r
Ruswil, Rottalcenter\r
Ruswil, Ziswil\r
Ruswil, Sonnhöfli\r
Ruswil, Moos\r
Ruswil, Neumüli\r
Ruswil, Soppenstig\r
Ruswil, Schlatt\r
Ruswil, Althus\r
Ruswil, Freieck\r
Rüthi (Rheintal), Dorf\r
Rüthi (Rheintal),Feffetstrasse\r
Rüthi (Rheintal), Bahnhofstr.\r
Rüthi (Rheintal), Industrie\r
Rüthi SG\r
Rüti b. Büren, Archfeld\r
Rüti b. Büren, Hauptstrasse\r
Rüti b. R'berg, Neuhaus\r
Rüti b. R'berg, Unterplötsch\r
Rüti b. R'berg, Dürrbach\r
Rüti b. R'berg, Brügghüsi\r
Rüti b. R'berg, Laas\r
Rüti b. R'berg, Plötsch\r
Rüti GL, Dorfmitte\r
Rüti GL\r
Rüti ZH, Steinacher\r
Rüti ZH, Jonamarkt\r
Rüti ZH, Würzhalde\r
Rüti ZH, Bandwies\r
Rüti ZH, Steinstrasse\r
Rüti ZH, Pilgerhof\r
Rüti ZH, Moosstrasse\r
Rüti ZH, Rekrutierungszentrum\r
Rüti ZH, Seefeldstrasse\r
Rüti ZH, Gruebenplatz\r
Rüti ZH, Bergacher\r
Rüti ZH, Sonnenplatz\r
Rüti ZH, Laufenbach\r
Rüti ZH, Gubel\r
Rüti ZH\r
Rüti ZH, Sportplatz\r
Rüti ZH, Unterwiesstrasse\r
Rüti ZH, Weier\r
Rüti ZH, Ferrach\r
Rüti ZH, Löwen\r
Rüti ZH, Bahnhof\r
Rüti ZH, Waldau\r
Rütihof, Haberacher\r
Rütihof, Moosstrasse\r
Rütihof, Bohnacher\r
Rütli\r
Rutschwil\r
Rüttenen, Endhalt\r
Rüttenen, Dorf\r
Rüttenen, Brüggmoos\r
Rüttenen, Grünegg\r
Ruvigliana, Paese\r
Ruvigliana, Trona\r
Ruvigliana, Ronchetti\r
Ruvigliana, Scuole\r
Ruvigliana, Parco S. Michele\r
Ruvigliana, Fulmignano\r
S-chanf, Somvih\r
S-chanf, Varusch\r
S-chanf, Punt da Scrigns\r
S-chanf, staziun\r
S-chanf, Punt da Crap\r
S-chanf, Chesa cumünela\r
S-chanf\r
S-chanf, Parc Naziunal\r
S-chanf, Pradels\r
S-charl\r
S. Abbondio, Bivio Calgiano\r
S. Abbondio, Paese\r
S. Antonino, Stazione\r
S. Antonino, Nosetto\r
S. Antonino, Posta\r
S. Antonino, Vigana di sotto\r
S. Antonino, Monda\r
S. Antonino,Centri Commerciali\r
S. Antonino, Lati\r
S. Antonino, Paese\r
S. Antonino, Via Tellina\r
S. Antonino\r
S. Antonino, Matro\r
S. Antonino, Via Serrai\r
S. Antonio (Morob.), Bolla\r
S. Antonio (Morob.), Melirolo\r
S. Antonio (Val Morobbia)\r
S. Bernardino, Ospizio\r
S. Bernardino, Villaggio\r
S. Bernardino, Muc. Casa Cant.\r
S. Bernardino, Fornas\r
S. Bernardino, Albarella\r
S. Bernardino, Concheta\r
S. Bernardino, Funivia\r
S. Bernardino, Pian Cales\r
S. Bernardino, Lago Dosso\r
S. Bernardino, Chiesa Rotonda\r
S. Bernardino, Centro\r
S. Bernardino, Du Lagh\r
S. Bernardino, Campeggio\r
S. Bernardino, Bivio Fornas\r
S. Carlo (Bavona), Funivia\r
S. Carlo (Bavona), Ponte\r
S. Carlo (Bavona) Funivia\r
S. Carlo di Peccia, Centrale\r
S. Carlo di Peccia, Paese\r
S. Carlo GR, Permunt\r
S. Carlo GR, Angeli Custodi\r
S. Carlo GR, Centro\r
S. Carlo GR, Raviscé\r
S. Carlo GR, Val dal Teo\r
S. Carlo GR, Privilasco\r
S. Carlo GR, Percosta\r
S. Carlo GR, Mulino Aino\r
S. Martino (Quinto)\r
S. Nazzaro, Molinetto\r
S. Nazzaro, Taverna\r
S. Nazzaro, 5 Fonti\r
S. Nazzaro, Fontanella\r
S. Nazzaro, Paese\r
S. Nazzaro\r
S. Nazzaro (lago)\r
S. Pietro di Stabio, Posta\r
S. Rocco (lago)\r
S. Vittore, Sassello\r
S. Vittore, Zona industriale\r
S. Vittore, Sgravina\r
S. Vittore, Posta\r
S.Pietro, Bivio per S.Pietro\r
Saanen, Eggli Sesselbahn\r
Saanen, Unterbort\r
Saanen, Sagibrügg\r
Saanen, Gemeindeverwaltung\r
Saanen, Oberdorf\r
Saanen, Steigenberger\r
Saanen, Spitzhorn\r
Saanen, Bahnhof\r
Saanen, Bellerivestrasse\r
Saanen, Schwimmbad\r
Saanen, Wyssmülleri\r
Saanen, Walischistrasse\r
Saanen, Rübeldorf\r
Saanen\r
Saanen, Halten\r
Saanen, Crestalta\r
Saanen Rüebeldorf (Talstation)\r
Saanenmöser\r
Saanenmöser, Bahnhof\r
Saanenmöser, Birkheimweg\r
Saanenmöser, Mösching\r
Saanenmöser (Talstation)\r
Saanenwald\r
Saanersloch Chübeli\r
Saanerslochgrat\r
Saanerslochgrat (Chaltebrunne)\r
Saas i.P., Ufm Ried\r
Saas i.P., Haus Fluor\r
Saas i.P., Old-Inn\r
Saas i.P., Dorfplatz\r
Saas i.P., Sagarank\r
Saas i.P., Waldhof\r
Saas i.P., Mülitobel\r
Saas im Prättigau\r
Saas-Almagell, Waldegg\r
Saas-Almagell, Lehn\r
Saas-Almagell, Eienalp\r
Saas-Almagell, Dorfplatz\r
Saas-Almagell, Sportplatz\r
Saas-Almagell, Alpien\r
Saas-Almagell, Zermeiggern\r
Saas-Almagell (Furggstalden)\r
Saas-Balen, Edelweiss\r
Saas-Balen, zur kl. Kapelle\r
Saas-Balen, Dorf\r
Saas-Fee, Wildi\r
Saas-Fee, Fluh\r
Saas-Fee, Parkhaus\r
Saas-Fee, Spielbodenbahn\r
Saas-Fee, Parkplatz Nord\r
Saas-Fee, Allalin\r
Saas-Fee, Busterminal\r
Saas-Fee, Sunnmattu\r
Saas-Fee, Grosses Moos\r
Saas-Fee, Felsenegg\r
Saas-Fee, Gletscherbrücke\r
Saas-Fee, All In\r
Saas-Fee, Dorfplatz\r
Saas-Fee, Etoile\r
Saas-Fee, Central\r
Saas-Fee, Alphitta\r
Saas-Fee, AlpinExpress\r
Saas-Fee, Atlantic\r
Saas-Fee, Royal\r
Saas-Fee (Alpin Express)\r
Saas-Fee (Hannig)\r
Saas-Fee Bifig\r
Saas-Fee Bifig (Felskinn)\r
Saas-Fee Chalbermatten\r
Saas-Fee Mast 4\r
Saas-Fee Schopfen\r
Saas-Grund, Bergbahnen\r
Saas-Grund, Schulhaus\r
Saas-Grund, Unter den Bodmen\r
Saas-Grund, Zenlauinen\r
Saas-Grund, Unter dem Berg\r
Saas-Grund, Post\r
Saas-Grund, Niwi\r
Saas-Grund, Parkplatz Bergbahn\r
Saas-Grund, untere Brücke\r
Saas-Grund, Altersheim\r
Saas-Grund (Hohsaas Talst.)\r
Saaser Alp Donnerstein\r
Saaser Alp Zügenhüttli\r
Sabbione (Bavona)\r
Sachseln, Felsenheim\r
Sachseln\r
Sachseln, Steinen\r
Sachseln, Bahnhof\r
Sachseln, Seehof/Brüggi\r
Sachseln, Dorf\r
Sachseln, Brünigstrasse\r
Sachseln Schiffstation\r
Safenwil, Schule\r
Safenwil\r
Safien, Carfil\r
Safien, Rainmatte\r
Safien Platz\r
Safien Platz, Neukirch\r
Safien Platz, Schulhaus\r
Safien Platz, Abzw. Gün\r
Safnern, Kirchweg\r
Safnern, Moosweg\r
Safnern, Gürweg\r
Safnern, Industriestrasse\r
Safnern, Dorfplatz\r
Sagliains\r
Sagliains Autoverlad\r
Sagno, alla Madonnina\r
Sagno, Paese\r
Sagogn, Carnetg\r
Sagogn, Fanaus\r
Sagogn, Storta pintga\r
Sagogn, Vitg dado\r
Sagogn, Bargaus\r
Sagogn, Vitg dadens\r
Sahli (Luftseilbahn Glattalp)\r
Saicourt, poste\r
Saicourt, Scierie\r
Saignelégier, Moulin de Gruère\r
Saignelégier, La Neuvevie\r
Saignelégier, gare\r
Saignelégier, Centre Loisirs\r
Saignelégier, Bellevue\r
Saignelégier, Rouges-Terres\r
Saignelégier, Le Graiteux\r
Saignelégier, Rte de France\r
Saignelégier\r
Saignelégier, La Theurre\r
Saignelégier, voirie\r
Saignelégier, Brasserie\r
Saignelégier, Pâquier\r
Saillon, le Canal\r
Saillon, St-Laurent\r
Saillon, Collombeyres\r
Saillon, les Moilles\r
Saillon, Clos d'Avaux\r
Saillon, les Bains\r
Saint-George, Le Fort\r
Sala Capriasca, Paese\r
Saland, Dorf\r
Saland\r
Saland, Laubberg\r
Saland, Dillhus\r
Saland, Juckeren\r
Salaniva\r
Salastrains\r
Salavaux, poste\r
Salavaux, Cotterd\r
Salavaux, école\r
Salaz, Abbaye\r
Salaz, Vers les Moulins\r
Salaz, Les Glareys\r
Salenstein, Dorf\r
Sâles, laiterie\r
Sâles, Joretta\r
Sales (Sarine)\r
Salez, Löwen\r
Salez-Sennwald\r
Salez-Sennwald, Bahnhof\r
Salgesch, Bahnhof\r
Salgesch, Swiss-Plage\r
Salgesch\r
Salgesch, Kirche\r
Salhöhe\r
Salins, La Courtaz\r
Salins, village\r
Salins, Misériez\r
Salins, Arvillard\r
Salins, Pravidondaz\r
Salins, Le Parfait\r
Salins, Turin\r
Salmsach, Birkenweg\r
Salmsach, Bodana\r
Salmsach, Seestrasse\r
Salorino, Chiesa\r
Salorino, Bivio per Salorino\r
Salorino, Vicolo Fontanelle\r
Salorino, Ciappelloso\r
Salorino, Municipio\r
Salorino, Gruppello\r
Salorino, Somazzo Paese\r
Salouf, curt Del\r
Salouf, baselgia\r
Salouf, scola\r
Salouf, vischnanca\r
Salouf, Pulens\r
Salvan, La Matze\r
Salvan, Damont le Bioley\r
Salvan, Le Tinderet\r
Salvan, Le Crêtelet\r
Salvan, Cimetière\r
Salvan, Le Carre\r
Salvan, Les Diès\r
Salvan, La Kònba\r
Salvan, Van-d'en-Bas\r
Salvan, Le Danfieu\r
Salvan\r
Salvenach, Merzeli\r
Salvenach, Schulhaus\r
Salvenach, Wilerstrasse\r
Samedan, Spital\r
Samedan, Porta Samedan\r
Samedan, Sper l'En\r
Samedan, Golf\r
Samedan, Quadratscha\r
Samedan, Ariefa\r
Samedan, Plazzet\r
Samedan\r
Samedan, Bahnhof\r
Samedan, Central\r
Sammelplatz\r
Samnaun-Compatsch, Dorf\r
Samnaun-Compatsch, Erlebnisbad\r
Samnaun-Compatsch, Kirche\r
Samnaun-Compatsch, Abzweigung\r
Samnaun-Compatsch,Spissermühle\r
Samnaun-Compatsch, beim Kreuz\r
Samnaun-Dorf, Post\r
Samnaun-Dorf, Musella\r
Samnaun-Dorf, Pra Grond\r
Samnaun-Dorf, Votlas\r
Samnaun-Laret, Abzweigung\r
Samnaun-Laret, Dorf\r
Samnaun-Laret, West\r
Samnaun-Plan, Dorf\r
Samnaun-Plan, West\r
Samnaun-Ravaisch, Dorf\r
Samnaun-Ravaisch, Bergbahnen\r
Samnaun-Ravaisch, Sportanlagen\r
Samnaun-Ravaisch, Abzweigung\r
Samnaun-Ravaisch (Bergbahn)\r
Samstagern, Im Walder\r
Samstagern, Frohberg\r
Samstagern, Drei Eichen\r
Samstagern, Sagenbach\r
Samstagern, Zopfschmitten\r
Samstagern, Fälmis\r
Samstagern, Bahnhof\r
Samstagern\r
San Bernardino El Frach\r
Sandbüchel\r
Sandiger Boden\r
Sanetsch, hôtel\r
Sanetsch, barrage\r
Sanetsch-Stausee\r
Sangernboden, Ottenleuebad\r
Sangernboden, Dorf\r
Sangernboden, Steinbachbrücke\r
Sangernboden, Schwefelbergbad\r
Sangernboden, Rothenbach\r
Sangernboden, Hengstsense\r
Sangernboden, Moosvorsass\r
Säntis\r
Sareis\r
Sargans, Rose\r
Sargans, Post\r
Sargans, Vild\r
Sargans, Bahnhof\r
Sargans, Gutshof\r
Sargans, Stadterwingert\r
Sargans, Kantonsschule\r
Sargans, Neue Stadtergasse\r
Sargans, Zürcherstrasse\r
Sargans, Bahnhof Süd\r
Sargans, Markthalle\r
Sargans, Castels\r
Sargans, Oberstufenzentrum\r
Sargans, Römerweg\r
Sargans\r
Säriswil, Schulhaus\r
Säriswil, Birchi\r
Säriswil, Dorf\r
Säriswil, Wendeplatz\r
Sarmenstorf, Kirche\r
Sarmenstorf, Schulhaus\r
Sarmenstorf, Fahrwangerstrasse\r
Sarmenstorf, Altersheim\r
Sarmenstorf, Vorstadt\r
Sarn, Abzw. Lescha\r
Sarn, Dorf\r
Sarn, Lescha Gianal\r
Sarn, Sendas\r
Sarn, Lescha\r
Sarn Lescha\r
Sarnen, Sonnenberg\r
Sarnen, Ried\r
Sarnen, Kernserstrasse\r
Sarnen, Bünten\r
Sarnen, Kreuzstrasse\r
Sarnen, Kantonsschule\r
Sarnen, Bahnhof\r
Sarnen\r
Sarnen, Seefeld Park/Spital\r
Sarnen, Ei\r
Sarnen, Kirchhofen\r
Sarnen Kurhaus (See)\r
Sarnen Nord\r
Sarnen Seefeld\r
Sarreyer\r
Sarreyer Téléphérique\r
Sarzens, village\r
Sassel, village\r
Sassel, Chapalettaz\r
Sasso della Boggia\r
Satigny, Choully Nord\r
Satigny, Champ Magnin\r
Satigny, Maison-Rouge\r
Satigny, Les Maladières\r
Satigny, poste\r
Satigny, Rue Carrée\r
Satigny, Terre Mousson\r
Satigny, Camping Bois-de-Bay\r
Satigny, Bourdigny-Dessous\r
Satigny, Moulières\r
Satigny, Peissy\r
Satigny, Choully\r
Satigny, Bourdigny-Dessus\r
Satigny, Bois-de-Bay\r
Satigny, Bourdigny douane\r
Satigny, Pré-de-la-Fontaine\r
Satigny, gare\r
Satigny, Peney-Dessous\r
Satigny, Crédery\r
Satigny, Taboret\r
Satigny, Nant-d'Avril\r
Satigny, Chemin du Paradis\r
Satigny, mairie\r
Satigny, Champvigny\r
Satigny, Peney-Dessus\r
Satigny, ZIMEYSA Ouest\r
Satigny, temple\r
Satigny, Pré-Bouvier\r
Satigny, Centre sportif\r
Satigny\r
Satigny, Bergère\r
Satigny, La Boverie\r
Sattel, Schornen\r
Sattel, Talstation\r
Sattel, Lutzistrasse\r
Sattel, Krone\r
Sattel, Erli\r
Sattel, Bauernhof\r
Sattel, Gondelbahn\r
Sattel, Ecce Homo\r
Sattel, Bahnhofstrasse\r
Sattel\r
Sattel, Hageggli\r
Sattel (Talstat. Hochstuckli)\r
Sattel Mostelberg (Bergstat.)\r
Saubraz, village\r
Sauges, La Fontanette\r
Sauges-près-Saint-Aubin\r
Saulcy, bif. La Racine\r
Saulcy, Bonembez\r
Saulcy, village\r
Saules BE, poste\r
Saules NE\r
Saurenhorn, Abzw.\r
Saut-du-Doubs\r
Sauverny, Martinet\r
Sauverny, Combes Chapuis\r
Sauverny, douane\r
Savagnier, Les Prayes\r
Savagnier, Petit-Savagnier\r
Savagnier, Moulin des Sauges\r
Savagnier, Grand-Savagnier\r
Savagnières, parc\r
Savièse, Pradoumaye\r
Savièse, Zampelet\r
Savièse, Monteiller rte Binii\r
Savièse, La Muraz\r
Savièse, St-André\r
Savièse, Senin\r
Savièse, Dilogne\r
Savièse, Mayens-de-la-Zour\r
Savièse, Vouagno\r
Savièse, Roumaz\r
Savièse, Crettaz-di-Railles\r
Savièse, Ormône\r
Savièse, Crettaz\r
Savièse, Le Belvédère\r
Savièse, Chervignine\r
Savièse, rue du Patrimoine\r
Savièse, rue de Chandolin\r
Savièse, Déjane\r
Savièse, Pradubuis\r
Savièse, Drône parking\r
Savièse, Chandolin sommet\r
Savièse, La Tsatonire\r
Savièse, Etang de la Tzena\r
Savièse, Binii\r
Savièse, Etang des Rochers\r
Savièse, Granois p. de Jeux\r
Savièse, Monteiller village\r
Savièse, St-Germain centre\r
Savièse, Chandolin centre\r
Savièse, centre scolaire\r
Savièse, Fontany\r
Savièse, Roua\r
Savièse, Clos Chamorat\r
Savièse, Sur-le-Scex\r
Savièse, Plan-d'Agy\r
Savièse, Visse\r
Savièse, Prafirmin Torrent N.\r
Savièse, Tramillau\r
Savièse, Tsanfleuron\r
Savièse, Drône centre\r
Savièse, Mossévron\r
Savièse, Zambotte\r
Savièse, Prafirmin-d'en-Haut\r
Savièse, Granois\r
Savigny, Publoz\r
Savigny, Palaz\r
Savigny, Grange-la-Ville\r
Savigny, Crêt-Rouge\r
Savigny, ancienne poste\r
Savigny, Clair-Matin\r
Savigny, St-Amour\r
Savigny, Claie-aux-Moines\r
Savigny, centre\r
Savognin, Sot Spondas\r
Savognin, Grava\r
Savognin, Tect\r
Savognin, Sandeilas\r
Savognin, Strada\r
Savognin, posta\r
Savognin, Danilo\r
Savognin, Canetel\r
Savognin, scola/Skischule\r
Savognin, Soras\r
Savognin, Bursa\r
Savognin, Sur Ual\r
Savognin, Cresta\r
Savognin, pendicularas/Bahnen\r
Savognin, Tgampi\r
Savognin (Talstation)\r
Savoleyres\r
Savoleyres-Nord\r
Savosa, Paese\r
Savosa, Crocifisso\r
Savosa, Liceo Ovest\r
Savosa, Liceo\r
Savosa, Valgersa\r
Savosa, Roncaccio\r
Savosa, Municipio\r
Sax, Schlössli\r
Sax, Farnen\r
Sax, Hueb\r
Sax, Rofisbach\r
Saxé, garage Gay\r
Saxé, Café des Amis\r
Saxeten, Skipintli\r
Saxeten, Schattenhalb\r
Saxeten, Schulhaus\r
Saxon\r
Saxon, Route du Léman\r
Saxon, Rue de Gottefrey\r
Saxonne (Ayent), rte d'Anzère\r
Says, Lätsch\r
Says, Obersays\r
Says, Valtanna\r
Says, Büel\r
Scaiano, Casa Lulita\r
Scaiano, Paese\r
Scairolo, Bivio\r
Scairolo, Posteggio Nucleo\r
Scalate\r
Scansinas\r
Scareglia, Paese\r
Scesana\r
Sceut, poste\r
Schaan, Im Besch\r
Schaan, Hilti\r
Schaan, Bahnhof\r
Schaan, Duxgass\r
Schaan, Kinderheim\r
Schaan, Zollstrasse\r
Schaan, Rheindenkmal\r
Schaan, Malarsch\r
Schaan, Kresta\r
Schaan, Quader\r
Schaan, Wiesengass\r
Schaan, Specki\r
Schaan, Hilcona\r
Schaan, Laurentiusbad\r
Schaan, Ivoclar\r
Schaan, Fürstenweg\r
Schaan, Zentrum/LKW\r
Schaan, Obergass\r
Schaan, Steinegerta\r
Schaan, Bardellaweg\r
Schaan, Gapetsch\r
Schaan, Zagalzel\r
Schaan, Kloster\r
Schaan, Duxweg\r
Schaan, Torkelgass\r
Schaan, Haus St. Laurentius\r
Schaan, Rosengarten\r
Schaan, Im Rossfeld\r
Schaan, Im Duxer\r
Schaan, Tröxlegass\r
Schaan, SAL\r
Schaan, Theater\r
Schaan, Industriestrasse\r
Schaan, Pardiel\r
Schaan, Speckibünt\r
Schaan, Bierkeller\r
Schaanwald, Zollamt\r
Schaanwald, Industrie\r
Schaanwald, Zuschg\r
Schaanwald, Waldstrasse\r
Schabell\r
Schachen (Gais), Bahnhof\r
Schachen (Gais)\r
Schachen (Herisau)\r
Schachen (Reute), alte Post\r
Schachen LU, Industrie\r
Schachen LU, Dorf\r
Schachen LU\r
Schadau\r
Schaffhausen, Rheinhalde Mitte\r
Schaffhausen, Geisshof\r
Schaffhausen, Grünau\r
Schaffhausen, Kronenhalde\r
Schaffhausen, Hohberg\r
Schaffhausen, St. Peter\r
Schaffhausen, Wiesenweg\r
Schaffhausen, Vögelingässchen\r
Schaffhausen, Schweizersbild\r
Schaffhausen, Hohenstoffel\r
Schaffhausen, Sennerei\r
Schaffhausen, Schönenberg\r
Schaffhausen, Rosenbergstr.\r
Schaffhausen, Nordstrasse\r
Schaffhausen, Gemsstübli\r
Schaffhausen, Schützenhaus\r
Schaffhausen, Promenade\r
Schaffhausen, Finsterwaldstr.\r
Schaffhausen, Falkeneck\r
Schaffhausen, Schifflände\r
Schaffhausen, Heuberg\r
Schaffhausen, Post Herblingen\r
Schaffhausen, Lindli\r
Schaffhausen, Dachsenbüel\r
Schaffhausen, Brüggli\r
Schaffhausen, Dürstlingweg\r
Schaffhausen, Buchthalen\r
Schaffhausen, Feldstrasse\r
Schaffhausen, Gruben\r
Schaffhausen, Rebhangstr.\r
Schaffhausen, Quellenstrasse\r
Schaffhausen, Im Freien\r
Schaffhausen, Hornbergstieg\r
Schaffhausen, Riet\r
Schaffhausen, Wiesli\r
Schaffhausen, Hägli\r
Schaffhausen, Kleinbuchberg\r
Schaffhausen, Ebnatring\r
Schaffhausen, Ebnat\r
Schaffhausen, Bruderhöfli\r
Schaffhausen, Geissberg\r
Schaffhausen, Fulachbrücke\r
Schaffhausen, Gräfler\r
Schaffhausen, Grubenstieg\r
Schaffhausen, Grenzstrasse\r
Schaffhausen, Belairpark\r
Schaffhausen, Psychiatriezentr\r
Schaffhausen, Waldfriedhof\r
Schaffhausen, Plattenweg\r
Schaffhausen, Kinepolis\r
Schaffhausen, Kantonsspital\r
Schaffhausen, Pilgerbrunnen\r
Schaffhausen, Logierhaus\r
Schaffhausen, CMC\r
Schaffhausen, Birch\r
Schaffhausen, Alpenblick\r
Schaffhausen, Frohberg\r
Schaffhausen, Busdepot\r
Schaffhausen, Gewerbezentrum\r
Schaffhausen, Künzleheim\r
Schaffhausen, Krummacker\r
Schaffhausen, Pilgerweg\r
Schaffhausen, Huus Emmersberg\r
Schaffhausen, Trüllenbuck\r
Schaffhausen, Rosentalgässchen\r
Schaffhausen, Zündelgut\r
Schaffhausen, Kegelgässchen\r
Schaffhausen, Seidenhof\r
Schaffhausen, Neutal\r
Schaffhausen, Unterdorf\r
Schaffhausen, Forsthaus\r
Schaffhausen,E. Homberger-Str.\r
Schaffhausen, Bahnhof\r
Schaffhausen, Kreuz\r
Schaffhausen, Mühlentor\r
Schaffhausen, Plattenhalde\r
Schaffhausen,Rheinhalde Grenze\r
Schaffhausen, Steigbrunnen\r
Schaffhausen, Hohlenbaum\r
Schaffhausen, Bachstrasse\r
Schaffhausen, Stahlgiesserei\r
Schaffhausen, Talberg\r
Schaffhausen, Buchbrunnen\r
Schaffhausen, Bahnhof Nord\r
Schaffhausen, Durach\r
Schaffhausen, Cilag\r
Schaffhausen, Birkenstr.\r
Schaffhausen, Feuerwehrzentrum\r
Schaffhausen, Spendtrottengut\r
Schaffhausen, Felsentäli\r
Schaffhausen, Grafenbuckstieg\r
Schaffhausen, Glockengut\r
Schaffhausen, Klingenstrasse\r
Schaffhausen, Stokarbergstr.\r
Schaffhausen, Niklausen\r
Schaffhausen, Stimmerstrasse\r
Schaffhausen, Hanfpünt\r
Schaffhausen, Steingut\r
Schaffhausen, Säntisstrasse\r
Schaffhausen, Winkelriedstr.\r
Schaffhausen, Spiegelgutstr.\r
Schaffhausen, J.J.Wepferstr.\r
Schaffhausen, Herblinger Markt\r
Schaffhausen\r
Schaffhausen, Berghaldenweg\r
Schaffhausen, Otteregass\r
Schaffhausen, KSS Freizeitpark\r
Schaffhausen, Uhrenmanufaktur\r
Schaffhausen, Neubrunn\r
Schaffhausen, Sandlöchli\r
Schaffhausen, Buchbergstrasse\r
Schaffhausen, Rhybadi\r
Schaffhausen, Rheinbühl\r
Schaffhausen, Schlossweiher\r
Schaffhausen, Sommerwies\r
Schaffhausen, Sommerhalde\r
Schaffhausen (Schifflände)\r
Schaffürggli\r
Schafhausen i.E.\r
Schafisheim, Talhard\r
Schafisheim, Ausserdorf\r
Schafisheim, Milchgasse\r
Schafisheim, Gemeindehaus\r
Schafisheim, Jumbo\r
Schafisheim, Coop\r
Schalb\r
Schalchen, altes Schulhaus\r
Schallberg\r
Schallbett\r
Schallenberg Passhöhe\r
Schalunen, Rest. Eintracht\r
Schalunen\r
Schangnau, Waldegg\r
Schangnau, Stein\r
Schangnau, Wald\r
Schangnau, Post\r
Schangnau, Käserei\r
Schangnau, Leu\r
Schangnau, Grunachen\r
Schänis, Oberbirg\r
Schänis\r
Schänis, Warthausen\r
Schänis, Windegg\r
Schänis, Winklen\r
Schänis, Rathausplatz\r
Schänis, Mühlegasse\r
Scharans, St. Agatha\r
Scharans, Dorf\r
Scharans, Altersheim\r
Scharans, Mosterei\r
Scharmoin\r
Scharnachtal, Viesen\r
Scharnachtal, Haus Lengacher\r
Scharnachtal, Halten\r
Scharnachtal, Gasse\r
Scharnachtal, Schüelis\r
Scharnachtal, Schulhaus\r
Scharnageln\r
Schattdorf, Gandrütti\r
Schattdorf, Grund\r
Schattdorf, Adlergarten\r
Schattdorf, Rossgiessen\r
Schattdorf, Rynächt\r
Schattdorf, Rüttigarten\r
Schattdorf, Chastelen\r
Schattdorf, Dorf\r
Schattdorf (Talstation Haldi)\r
Schattenhalb, Schulhaus\r
Schatzalp\r
Schatzalp (Strelaalp Talst.)\r
Scheid, Resgia\r
Scheid, Oberscheid\r
Scheid, Giudem vitg\r
Scheid, Plazza\r
Scheid, Curgiola\r
Scheidbach, Mürni\r
Scheidbach, Bissen\r
Schellenberg, Tannwald\r
Schellenberg, Egerta\r
Schellenberg, Eschner Rütte\r
Schellenberg, Post\r
Schellenberg, Hinterschloss\r
Schellenberg, Stotz\r
Schellenberg, Sägaplatz\r
Schellenberg, Klenn\r
Schellenberg, Loch\r
Schellenberg, Widum\r
Schellenberg, Obergut\r
Schenkon, Zellfeld\r
Schenkon, Zellburg\r
Schenkon, Tann\r
Schenkon, Haldenweid\r
Schenkon, Tannberg\r
Schenkon, Dorf\r
Schenkon, Zentrum\r
Scherz, Dorfplatz\r
Scherz, Rüchlig\r
Scherzingen, Scheidweg\r
Scherzingen, Bäckerstübli\r
Scherzingen, Kirche\r
Scherzingen, Bahnhof\r
Scherzingen, Rohrenzelg\r
Scheuren, Station\r
Scheuren, Schulhaus\r
Scheuren, Räbhubel\r
Scheuren\r
Scheyenholz\r
Schiers, Unterpusserein\r
Schiers, Bazolis\r
Schiers, Kirchgemeindehaus\r
Schiers, Salginatobelbrücke\r
Schiers, EMS/Spital\r
Schiers, Molla\r
Schiers, Bahnhof\r
Schiers, Schibabüel\r
Schiers, Montagna\r
Schiers, Tersier\r
Schiers, Hinterdorf\r
Schiers, Rossgasse\r
Schiers\r
Schiers, Büel\r
Schiers, Quadara/Feld\r
Schiers, Palottis\r
Schiers, Ottenacher\r
Schiers, Maria\r
Schiers, Pusserein\r
Schiers, Obere Au\r
Schiers, Schälleria\r
Schifer\r
Schiltgrat\r
Schilthorn\r
Schilthornhütte\r
Schiltwald, Firma Michel\r
Schiltwald, Wendeplatz\r
Schindellegi, Sihlegg\r
Schindellegi, Sunnestrahl\r
Schindellegi, Pauli\r
Schindellegi, Kirche\r
Schindellegi, Schwandweg\r
Schindellegi, Zündi\r
Schindellegi, Chaltenboden\r
Schindellegi, Aesch\r
Schindellegi-Feusisberg\r
Schindellegi-Feusisberg, Bhf.\r
Schinznach Bad, Aquarena\r
Schinznach Bad, Steinbruch\r
Schinznach Bad\r
Schinznach Bad, Kurzentrum\r
Schinznach Dorf, Ausserdorf\r
Schinznach Dorf, Oberdorf\r
Schinznach Dorf, Gemeindehaus\r
Schinznach Dorf, Wallbach\r
Schinznach Dorf, Baumschule\r
Schinznach Dorf, Weisse Trotte\r
Schinznach Dorf, Steinachbr.\r
Schlans, vitg\r
Schlatt Paradies (Fähre)\r
Schlatt TG, Bahnhof\r
Schlatt TG, Held\r
Schlatt TG, Gemeindehaus\r
Schlatt TG\r
Schlatt TG, Mettschlatt\r
Schlatt TG, Dickihof\r
Schlatt TG, Turnhallenstrasse\r
Schlatt ZH, Schulhaus\r
Schlatt ZH, Oberschlatt\r
Schlatt ZH, Berg b.Waltenstein\r
Schlatt ZH, Waltenstein\r
Schlatt ZH, Unterschlatt\r
Schlattingen, Hauptstrasse\r
Schlattingen\r
Schlegwegbad\r
Schleinikon, Wasen\r
Schleinikon, Dachsleren\r
Schleinikon, Gemeindehaus\r
Schleitheim, Hohbrugg\r
Schleitheim, Gemeindehaus\r
Schleitheim, Juliomagus\r
Schleitheim, Bahnhofstrasse\r
Schleitheim, Mattenhof\r
Schleitheim, Poststrasse\r
Schleitheim, Adlerstrasse\r
Schleitheim, Schweizerbund\r
Schleitheim, Altersheim\r
Schlierbach, Oberdorf\r
Schlierbach, Dorf\r
Schlieren\r
Schlieren, Mülligen\r
Schlieren, Steinacker\r
Schlieren, Industrie Gaswerk\r
Schlieren, Gasometerbrücke\r
Schlieren, Feldstrasse\r
Schlieren, Bahnhof\r
Schlieren, Am Rietpark\r
Schlieren, Talacker-Windegg\r
Schlieren, Wagonsfabrik\r
Schlieren, Nassacker\r
Schlieren, Brunngasse\r
Schlieren, Spital Limmattal\r
Schlieren, Zentrum/Bahnhof\r
Schlieren, Goldschlägistrasse\r
Schlieren, Reitmen\r
Schlieren, Bahnhof Nord\r
Schlieren, Kesslerplatz\r
Schlieren, Heimeliweg\r
Schlieren, Rütistrasse\r
Schlieren, Geissweid\r
Schlieren, Kampstrasse\r
Schlieren, Meuchwis\r
Schliern, Muhlernstrasse\r
Schliern, Bus-Endstation\r
Schliern, Eichmatt\r
Schlivera\r
Schloss Laufen, Rheinfall\r
Schloss Laufen am Rheinfall\r
Schlossrued, Pfaffenbergstr.\r
Schlossrued, Längenthal\r
Schlossrued, Klack\r
Schlossrued, Dorf\r
Schlosswil, Kreuz\r
Schlosswil, Nest\r
Schlosswil, Unterführung\r
Schlosswil, Dorf\r
Schlosswil, Abzw. Lochi\r
Schlosswil, Mühlestrasse\r
Schlosswil, Lochi\r
Schlosswil, Ried\r
Schlucht\r
Schluein, Isla\r
Schluein, vitg\r
Schluein, Falerin\r
Schluein, industria\r
Schluein, Caglia Liunga\r
Schluein, Casanova\r
Schluein, center da cumpra\r
Schmerikon, Mürtschenstrasse\r
Schmerikon, Lanzenmoosstrasse\r
Schmerikon, Seeblick\r
Schmerikon, Bahnhof\r
Schmerikon\r
Schmerikon, Brücke\r
Schmerikon (See)\r
Schmidrüti, Buchenenstock\r
Schmidrüti, Dorf\r
Schmiedrued, Dorf\r
Schmiedrued, Matt\r
Schmitten (Albula), Chappali\r
Schmitten (Albula), Dorf\r
Schmitten (Albula), Innerdorf\r
Schmitten FR, Schlossmatte\r
Schmitten FR\r
Schmitten FR, Bahnhof\r
Schmitten FR, Ried b. Berg\r
Schmitten FR, Dorf\r
Schmitten GR, Viaduktplatz\r
Schmitten GR Landwasserviadukt\r
Schnaus, Plaun\r
Schneehüenerstock\r
Schneisingen, Murzlen\r
Schneisingen, Kreuzhof\r
Schneisingen, Mitteldorf\r
Schneisingen, Oberdorf\r
Schnottwil, Kreuzstrasse\r
Schnottwil, Oberdorf\r
Schnottwil, Post\r
Schnottwil, Kappeli\r
Schnottwil, Schulhaus\r
Schocherswil, alte Post\r
Schöfflisdorf, Gemeindehaus\r
Schöfflisdorf-Oberwen, Bahnhof\r
Schöfflisdorf-Oberweningen\r
Schöftland, Pikardie\r
Schöftland, Dorfstrasse\r
Schöftland, Holzikerstrasse\r
Schöftland, Sandplatten\r
Schöftland, Bahnhof\r
Schöftland\r
Schöftland, Dreistein\r
Schöftland, Abzw. Böhler\r
Schöftland Nordweg, Bahnhof\r
Schöftland Nordweg\r
Schönbiel (Bettmeralp)\r
Schönbühl, Solothurnstrasse\r
Schönbühl, Hohrain\r
Schönbühl, Platane\r
Schönbühl, Feldegg\r
Schönbühl RBS\r
Schönbühl RBS, Bahnhof\r
Schönbühl SBB\r
Schönbühl Shoppyland\r
Schönegg\r
Schönenbaumgarten, Dorf\r
Schönenberg ZH, Wolfbühl\r
Schönenberg ZH, Aesch\r
Schönenberg ZH, Neubad\r
Schönenberg ZH, Sonne\r
Schönenberg ZH, Dorfhuus\r
Schönenberg ZH, Zweierhof\r
Schönenberg ZH, Tanne\r
Schönenberg ZH, Mühlestalden\r
Schönenberg ZH, Müsli\r
Schönenbuch, Niederfeld\r
Schönenbuch, Dorf\r
Schönenbuch, Im Pfeiffensack\r
Schönengrund, Wohnheim\r
Schönengrund, Dorf\r
Schönengrund, Postgarage\r
Schönenwerd SO, Bahnhof\r
Schönenwerd SO, Lochmatt\r
Schönenwerd SO, Kreuzackerstr.\r
Schönenwerd SO, Tannheim\r
Schönenwerd SO, Bahnhof Nord\r
Schönenwerd SO,Schachenstrasse\r
Schönenwerd SO,Schenker Storen\r
Schönenwerd SO, Baumstrasse\r
Schönenwerd SO, Zentrum\r
Schönenwerd SO\r
Schongau, Erlebnispark\r
Schongau, Landi\r
Schongau, Gmeinwärch\r
Schongau, Oberschongau\r
Schongau, Mettmen\r
Schongau, Kreuz\r
Schönholzerswilen, Klingen\r
Schönholzerswilen, Toos\r
Schönholzerswilen, Häusern\r
Schönholzerswilen, Hagenwil\r
Schönholzerswilen, Hagenbuch\r
Schönholzerswilen,Ritzisbuhwil\r
Schönholzerswilen, Kirche\r
Schönholzerswilen,Gemeindehaus\r
Schönholzerswilen, Wartenwil\r
Schönried, Schulhaus\r
Schönried\r
Schönried, Bahnhof\r
Schönried (Talst. Horneggli)\r
Schottikon\r
Schötz, Moosbrücke\r
Schötz, Gläng\r
Schötz, Neubühl\r
Schötz, St. Mauritz\r
Schötz, Feld\r
Schreckfeld (Alp Grindel)\r
Schreckfeld (Firstbahn)\r
Schreckfeld (Schilt)\r
Schübelbach, Gramatt\r
Schübelbach, Oberhöfli\r
Schübelbach, West\r
Schübelbach, Dorf\r
Schübelbach, Gutenbrunnen\r
Schübelbach-Buttikon\r
Schuders, Dorf\r
Schuders, Abzw. Valmära\r
Schüpbach, Furen\r
Schüpbach, Emmenbrücke\r
Schüpbach, Bruuchbüel\r
Schüpbach, Rössli\r
Schüpbach, Buebenei\r
Schüpbach, Hölzli\r
Schüpbach, Buebeneibrücke\r
Schüpbach, Buebenei Sägerei\r
Schüpbach, Dorf\r
Schupfart, Mühle\r
Schupfart, Unterdorf\r
Schupfart, Dorf\r
Schüpfen, Bundkofen\r
Schüpfen, Bahnhof\r
Schüpfen\r
Schüpfen, Schwanden\r
Schüpfen, Schlattweg\r
Schüpfheim\r
Schüpfheim, Moosmättili\r
Schüpfheim, Schwändi\r
Schüpfheim, Bahnhof\r
Schüpfheim, Landbrücke\r
Schüpfheim, Badhus\r
Schüpfheim, Biberebrüggli\r
Schüpfheim, Wegmattensäge\r
Schützengarten, Bahnhof\r
Schützengarten\r
Schwäbis\r
Schwaderloch, Bahnhof\r
Schwaderloh, Dorf\r
Schwadernau, Sagibach\r
Schwadernau, Chrumenacher\r
Schwadernau, Gemeindehaus\r
Schwägalp, Säntis-Schwebebahn\r
Schwägalp, Passhöhe\r
Schwägalp (Säntis-Schwebebahn)\r
Schwalbennest\r
Schwammboden\r
Schwandegg\r
Schwanden (Sigriswil), Schulh.\r
Schwanden (Sigriswil), Dorf\r
Schwanden (Sigriswil), Säge\r
Schwanden (Sigriswil), Stalden\r
Schwanden b. Br., Derfliplatz\r
Schwanden b. Brienz, Stocki\r
Schwanden b. Brienz, Birgli\r
Schwanden b. Brienz, Weid\r
Schwanden GL, Hauptstrasse\r
Schwanden GL, Alpsteg\r
Schwanden GL, Fryberg\r
Schwanden GL, Bahnhof\r
Schwanden GL, Buchen\r
Schwanden GL\r
Schwanden GL, Spittel\r
Schwanden GL, Schulhausstrasse\r
Schwanden GL, Thon\r
Schwanden GL, Au\r
Schwanden i. E., Emmenknie\r
Schwanden i. E., Niederbach\r
Schwanden i. E., Nesselgraben\r
Schwanden i.E., Aeschli\r
Schwanden i.E., Schwandenmatt\r
Schwanden i.E., Post\r
Schwändi b. Schwanden,Lassigen\r
Schwändi b. Schwanden, Güetli\r
Schwändi b. Schwanden GL,Adler\r
Schwändi b. Schwanden GL, Post\r
Schwänzelegg (Cavadura)\r
Schwänzelegg (Danusa)\r
Schwarzenbach, Oberstettenstr.\r
Schwarzenbach LU, Löwen\r
Schwarzenbach SG, Thurbrücke\r
Schwarzenbach SG, Kapelle\r
Schwarzenbach SG, Wilerstrasse\r
Schwarzenbach(Huttwil),Bühlweg\r
Schwarzenberg LU, Kappelen\r
Schwarzenberg LU, Fabrikli\r
Schwarzenberg LU, Schlatt\r
Schwarzenberg LU, Ennenmatt\r
Schwarzenberg LU, Rössli\r
Schwarzenberg LU, Lifelen\r
Schwarzenberg LU, Ried\r
Schwarzenburg, Brüllen\r
Schwarzenburg, Schloss\r
Schwarzenburg, Häusern\r
Schwarzenburg, Freiburgstrasse\r
Schwarzenburg, Bahnhof\r
Schwarzenburg, Pöschen\r
Schwarzenburg, Waldgasse\r
Schwarzenburg, Milkenstrasse\r
Schwarzenburg, Zelg\r
Schwarzenburg\r
Schwarzenburg, Büblern\r
Schwarzenburg, Thunstrasse\r
Schwarzenegg, Dorf\r
Schwarzenegg, Bären\r
Schwarzenegg, Dürren\r
Schwarzenegg, Ried Schmiede\r
Schwarzenegg, Ried Käserei\r
Schwarzer Bären, Bahnhof\r
Schwarzer Bären\r
Schwarzsee, Kaspera\r
Schwarzsee, Bad\r
Schwarzsee, Mösli\r
Schwarzsee, Buntschena\r
Schwarzsee, Gypsera\r
Schwarzsee, Campus\r
Schwarzsee, Lichtena\r
Schwarzsee, Hostellerie\r
Schwarzsee, Tromooserli\r
Schwarzsee Gypsera (Talstat.)\r
Schwarzseealp\r
Schwarzwaldalp\r
Schwarzwasserbrücke\r
Schweinbrunnen\r
Schweizerhalle Schifflände\r
Schwellbrunn, Rotschwendi\r
Schwellbrunn, Tobelacker\r
Schwellbrunn, Sommertal\r
Schwellbrunn, Halden\r
Schwellbrunn, Einsiegele\r
Schwellbrunn, Teufen\r
Schwellbrunn, Dorf\r
Schwellbrunn, Brisig\r
Schwellbrunn, Winkfeld\r
Schwellbrunn, Risi\r
Schwende\r
Schwenden i. D., Geissboden\r
Schwenden i. D., Weid\r
Schwenden i. D., Winteregg\r
Schwenden i.D.,altes Schulhaus\r
Schwenden i.D., Fildrichbrücke\r
Schwenden i.D., Tiermatti\r
Schwenden i.D., Grimmialp\r
Schwendi bei Grindelwald\r
Schwendi bei Heiden\r
Schwendi i. W., Fischzucht\r
Schwendi i. W., Dorf\r
Schwendi i. W., Mühleboden\r
Schwendi i. W., Tschudi\r
Schwendibach, Stutz\r
Schwendibach, Käserei\r
Schwendiwald\r
Schwerzenbach ZH, Bahnhof\r
Schwerzenbach ZH, Dorf\r
Schwerzenbach ZH\r
Schwyz, Eglismatt\r
Schwyz, Dorfbach\r
Schwyz, Zentrum\r
Schwyz, Grundstrasse\r
Schwyz, Loostrasse\r
Schwyz, Hinterdorf\r
Schwyz, Lücken\r
Schwyz, Mettli\r
Schwyz, Nietenbachstrasse\r
Schwyz, Lützelmatt\r
Schwyz, Schützenhaus\r
Schwyz, Spital\r
Schwyz, Bierkeller\r
Schwyz, Stoosbahn\r
Schwyz, Hirschen\r
Schwyz, Sonnenplätzli\r
Schwyz, Rest. Mythen\r
Schwyz, Obermatt\r
Schwyz, Weidhuobli\r
Schwyz, Riedbrücke\r
Schwyz, Salesheim\r
Schwyz, Lärchenweg/Kollegi\r
Schwyz, Kollegi\r
Schwyz, Obstmühle/Friedhof\r
Schwyz, Laubstrasse\r
Schwyz, Kaltbach\r
Schwyz, Herrengasse\r
Schwyz, Verkehrsamt\r
Schwyz, Burg\r
Schwyz, Mangelegg\r
Schwyz, Grossfeld\r
Schwyz, Engiberg\r
Schwyz, Achermann\r
Schwyz, Gartenlaubenstrasse\r
Schwyz, Drei Könige\r
Schwyz, St. Martinstrasse\r
Schwyz, Bachmatt\r
Schwyz, Spital Haupteingang\r
Schwyz, Nietenbach\r
Schwyz, Grundkapelle\r
Schwyz, Steisteg\r
Schwyz\r
Schwyz, Bahnhof\r
Schwyz Stoosbahn (Talstation)\r
Schynige Platte\r
Scudellate, Paese\r
Scuol, Cuttüraplana\r
Scuol, Gurlaina\r
Scuol, Putschigls\r
Scuol, Brentsch/Tulai\r
Scuol, posta\r
Scuol, Stradun/Buorcha\r
Scuol, Val Mingèr\r
Scuol, Belvédère\r
Scuol, Chauennas\r
Scuol, Plan da Funtanas\r
Scuol, Ravitschana\r
Scuol, Serras\r
Scuol, Schmelzra\r
Scuol, Pütvia\r
Scuol, Plaz\r
Scuol, Porta\r
Scuol, Bügl Grond\r
Scuol, Chasa Puntota\r
Scuol, San Jon\r
Scuol, Bogn Engiadina\r
Scuol, Runà\r
Scuol, Clozza\r
Scuol, Chantröven\r
Scuol, Pratuor\r
Scuol, Manaröl\r
Scuol, Ospidal/Spital\r
Scuol, via dals Bogns\r
Scuol (pendicularas)\r
Scuol-Tarasp, staziun\r
Scuol-Tarasp\r
Seblengrat\r
Sédeilles, village\r
Sedrun, Tgèsa Communala\r
Sedrun, Niregl\r
Sedrun\r
Sedrun Cungieri (sortida)\r
Sedrun Salins (pendiculara)\r
Seeberg BE, Schlüssel\r
Seeberg BE, Stalderhof\r
Seebleiche\r
Seebodenalp\r
Seedorf BE, Aspi\r
Seedorf BE, Unterdorf\r
Seedorf BE, Schulhaus\r
Seedorf BE, Tannenmatte\r
Seedorf BE, Gemeindeverwaltung\r
Seedorf FR\r
Seedorf UR, Schloss A Pro\r
Seedorf UR, Wyden\r
Seedorf UR, Reussbrücke\r
Seedorf UR, Seehof\r
Seedorf UR, Dorf\r
Seedorf UR, Grund\r
Seedorf UR, Bolzbach\r
Seelisberg, Laui\r
Seelisberg, Dorf\r
Seelisberg, Bahnhof\r
Seelisberg, Schmidig\r
Seelisberg, Geissweg\r
Seelisberg, Hotel Sonnenberg\r
Seelisberg, Tanzplatz\r
Seelisberg, Seeli\r
Seelisberg (Bergstation)\r
Seengen, Schulstrasse\r
Seengen, Feldgarage\r
Seengen, Rotes Haus\r
Seengen, Brestenberg\r
Seengen, Unterdorf\r
Seengen, Poststrasse\r
Seengen, Schloss Hallwyl\r
Seengen (See)\r
Seetalhorn\r
Seewen SO, Säge\r
Seewen SO, Zelgli\r
Seewen SO, Rechtenberg\r
Seewen SO, Herrenmatt\r
Seewen SO, Bretzwilerstrasse\r
Seewen SO, Löhr\r
Seewen SZ, Bienenheimstrasse\r
Seewen SZ, Seewen Markt\r
Seewen SZ, Seewenfeld\r
Seewen SZ, Stelzli\r
Seewen SZ, Seemattli\r
Seewen SZ, Rösslimatt\r
Seewis Dorf, Parschientsch\r
Seewis Dorf, Bühelstrasse\r
Seewis-Pardisla, Bahnhof\r
Seewis-Pardisla, Pardisla\r
Seewis-Pardisla, Saldos\r
Seewis-Pardisla\r
Seewis-Schmitten\r
Seftigen, Bahnhof\r
Seftigen\r
Segnas, casa da scola\r
Segnas\r
Segnes\r
Seigneux, village\r
Seiry, village\r
Selden, Gasthaus Steinbock\r
Selden, Hotel Gasterntal\r
Selkingen\r
Selma, al Pont\r
Selma (Funivia)\r
Seltisberg, Sonnenblick\r
Seltisberg, Zentrum Schule\r
Seltisberg, Alte Post\r
Seltisberg, Verwaltung MZH\r
Selva, via Alpsu spv.\r
Selzach, Passionsplatz\r
Selzach, Bäriswil\r
Selzach, Pfarreizentrum\r
Selzach, Haag\r
Selzach, Schulhaus\r
Selzach, Bahnhof\r
Selzach, Schildmatte\r
Selzach, Hexengässli\r
Selzach\r
Sembrancher, école\r
Sembrancher\r
Sembrancher, gare\r
Sembrancher, Champlong\r
Sementina, Centro Somen\r
Sementina, Rotonda\r
Sementina, Motto\r
Sementina, Mondasce\r
Sementina, Campo sportivo\r
Sementina, Via Locarno\r
Sementina, Scuole\r
Sementina, Ponte sul Ticino\r
Semione, Cantonetto\r
Semione, Municipio\r
Sempach Stadt, Meierhöfli\r
Sempach Stadt, Hültschern\r
Sempach Stadt, Seemätteli\r
Sempach Stadt, Seesatz\r
Sempach Stadt, Luzernertor\r
Sempach Stadt, Vogelwarte\r
Sempach Station\r
Sempach Station, Mettenwilstr.\r
Sempach Station, Seefeld\r
Sempach-Neuenkirch\r
Semsales\r
Semsales, ancienne église\r
Semsales, gare\r
Senarclens, village\r
Sendy-Sollard\r
Senèdes, bif.\r
Sennhof-Kyburg\r
Sennwald, Kirche\r
Sennwald, Post\r
Sennwald, Hof\r
Sennwald, Forstegg\r
Sennwald, Dornen\r
Sennwald, Industrie\r
Sennwald, Äugstisriet\r
Sensine\r
Sent, Sur En\r
Sent, Chavriz Pitschen\r
Sent, Tuffera\r
Sent, via da Crusch\r
Sent, Tschern\r
Sent, Sur En Camping\r
Sent, Plaz\r
Sent, Sala\r
Seon, Birren Süd\r
Seon, Birren Nord\r
Seon, Hallenbad\r
Seon, Unterdorf\r
Seon\r
Seon, Post/Bahnhof\r
Seon Nord\r
Seon Nord, Bahnhof\r
Séprais\r
Séprais, bas du village\r
Sergey\r
Serneus, Gruoba\r
Serneus, Dorf\r
Serneus, Capeira\r
Serneus, Pagrüeg\r
Serneus, Mezzaselva\r
Serneus, Walki\r
Serocca\r
Serocca, Stazione\r
Serpiano (funivia)\r
Sertig, Sand\r
Sertig, Dörfli\r
Servion, Moléson\r
Servion, Vieux-Collège\r
Servion, Clos de l'Auberge\r
Servion, Grange Rouge\r
Servion, Zoo-Tropiquarium\r
Servion, Mannessivaz\r
Servion, poste/croisée\r
Seseglio, Villette\r
Seseglio, Paese\r
Seseglio, Centro sportivo\r
Sessa, S. Maria di Corte\r
Sessa, Bonzaglio\r
Sessa, Piazza\r
Sessa, Cimitero\r
Sessa, Sotto Chiesa\r
Sessa, La Costa\r
Sessa, Tortura\r
Sessa, Suvino\r
Sessa, Lanera\r
Sessa, Beredino\r
Seuzach, Gemeindehaus\r
Seuzach, Bahnhof\r
Seuzach, Alterszentrum\r
Seuzach, Forrenbergstrasse\r
Seuzach, Breitestrasse\r
Seuzach, Im Räbhag\r
Seuzach, Mörsburgstrasse\r
Seuzach\r
Sévaz, village\r
Sévaz, La Guérite\r
Sevelen, Post\r
Sevelen\r
Sevelen, Veltur\r
Sevelen, Büeli\r
Sevelen, Rathaus\r
Sevelen, Bahnhof\r
Sevelen, Schild\r
Sevelen, Abzw. Bad Rans\r
Sevelen, Rietli\r
Sévery, Moulin\r
Sévery, village\r
Sevgein, vitg\r
Sevgein, Plaun Gera\r
Sevgein, Curschetta\r
Sézegnin, village\r
Sézegnin, Le Renfort\r
Sezner\r
Sfazù, Fermata\r
Siat, Bual\r
Siat, vitg\r
Siat, Glix\r
Siat, Carrera\r
Siat, Schischiu\r
Siblingen, Dorf\r
Siblingen, Am Stei\r
Siblingen, Siblingerhöhe\r
Siblingen, Näppental\r
Sidelenbach (Furka)\r
Siebnen, Bettnau\r
Siebnen, Neudörfli\r
Siebnen, Stegweg\r
Siebnen, Schorrenstrasse\r
Siebnen, Zentralhof\r
Siebnen, Bitzi\r
Siebnen, Aabrücke\r
Siebnen, Mühle\r
Siebnen, Schulhaus\r
Siebnen-Wangen, Bahnhof\r
Siebnen-Wangen\r
Siegershausen\r
Sierre, Borzuat\r
Sierre, Beaulieu\r
Sierre, Signèse\r
Sierre, Glarey\r
Sierre, Sablons\r
Sierre, Ecoparc de Daval\r
Sierre, Beau-Site\r
Sierre, Hôpital\r
Sierre, Le Bourgeois\r
Sierre, Liddes\r
Sierre, Potence\r
Sierre, Piscine Guillamo\r
Sierre, Résidence Plantzette\r
Sierre, Parc de Finges\r
Sierre, TechnoArk\r
Sierre, Daval est\r
Sierre, Rossfeld\r
Sierre, Muraz Funi\r
Sierre, Muraz Riondaz\r
Sierre, Maison Rose\r
Sierre, Longs-Prés\r
Sierre, Hôtel de Ville/gare\r
Sierre, Sous-Géronde\r
Sierre, Maison Rouge\r
Sierre, Orzival\r
Sierre, Petit Lac\r
Sierre, Roussier\r
Sierre, Tservetta\r
Sierre, Glariers\r
Sierre, Résidence Beaulieu\r
Sierre, Muraz Ecole\r
Sierre, Devin\r
Sierre, Oasis\r
Sierre, Bonne Eau\r
Sierre, Itagne/TLH\r
Sierre, Les Tours\r
Sierre, Le Bourgeois Nord\r
Sierre, Ste-Croix\r
Sierre, Villa\r
Sierre, Hôpital ouest\r
Sierre, Manège\r
Sierre, Chemin des Pins\r
Sierre, Riondaz\r
Sierre, Pilette\r
Sierre, Notre-Dame-de-Lourdes\r
Sierre, Stand\r
Sierre, Ile Falcon\r
Sierre, Chapelle St-Antoine\r
Sierre, Sentier de Chippis\r
Sierre/Siders\r
Sierre/Siders, gare routière\r
Sierre/Siders,Place de la gare\r
Sierre/Siders (funi)\r
Sigeroula (station interméd.)\r
Siggenthal-W., Bahnhof\r
Siggenthal-Würenlingen\r
Sigirino, Bivio\r
Sigirino, Piazza\r
Siglistorf, Gemeindehaus\r
Siglistorf, Oberdorf\r
Signal (St. Moritz)\r
Signal-de-Bougy, Parc Pré Vert\r
Signau, Friedhof\r
Signau, Hof\r
Signau\r
Signau, Bahnhof\r
Signèse (Ayent), Les Granges\r
Signèse (Ayent), Plan Signèse\r
Signèse (Ayent), chapelle\r
Signôra, Crana\r
Signôra, Paese\r
Signy, centre commercial\r
Signy, village\r
Signy, Le Glassey\r
Sigriswil, Schärmtanne\r
Sigriswil, Dorf\r
Sigriswil, Port\r
Sigriswil, Endorf\r
Sihlau\r
Sihlbrugg, Alter Bahnhof\r
Sihlbrugg, Dorf\r
Sihlwald, Bahnhof\r
Sihlwald\r
Silenen, Dörfli\r
Silenen, Gemeindehaus\r
Silenen, Ellbogenkapelle\r
Silenen, Efibach\r
Silenen, Schützen\r
Silenen, Dägerlohn\r
Sillerenbühl\r
Sils im Domleschg, Prolung\r
Sils im Domleschg, Dorf\r
Sils im Domleschg, Campi\r
Sils im Domleschg, Cumparduns\r
Sils im Domleschg, Oberdorf\r
Sils Maria (Furtschellasbahn)\r
Sils/Segl Baselgia, Silserhof\r
Sils/Segl Baselgia, Margna\r
Sils/Segl Baselgia, Randolina\r
Sils/Segl Baselgia, Muttals\r
Sils/Segl Baselgia, Biblioteca\r
Sils/Segl Baselgia,San Lurench\r
Sils/Segl Maria, Maria\r
Sils/Segl Maria, Edelweiss\r
Sils/Segl Maria, Alpenrose\r
Sils/Segl Maria, Chesa Fonio\r
Sils/Segl Maria,Furtschellasb.\r
Sils/Segl Maria, Fainera\r
Sils/Segl Maria,Chesa Cumünela\r
Sils/Segl Maria, Pas-chs\r
Sils/Segl Maria, Föglias\r
Sils/Segl Maria, Seglias\r
Sils/Segl Maria, Posta\r
Sils/Segl Maria Barchiröls\r
Silvaplana, Baselgia\r
Silvaplana, Plazza dal Güglia\r
Silvaplana, Munteratsch\r
Silvaplana, Plazza dal Mastrel\r
Silvaplana, Rundella Curtins\r
Silvaplana, Camping\r
Silvaplana, Lej Tscheppa\r
Silvaplana, Mandra\r
Silvaplana, Alp Güglia\r
Silvaplana, Vallun\r
Silvaplana Surlej (Corvatsch)\r
Simplon, Monte Leone\r
Simplon Dorf, Niwen\r
Simplon Dorf, Maschihüs\r
Simplon Dorf, Eggen\r
Simplon Dorf, Blatt\r
Simplon Dorf, Post\r
Simplon Dorf, Alte Kaserne\r
Simplon Dorf, Hospiz-Niederalp\r
Simplon Hospiz, Hospiz\r
Simplon Kulm, Bellevue\r
Simplon Pass, Simplonblick\r
Sins, Küfermatt\r
Sins, Bahnhof\r
Sins, Freudenberg\r
Sins, Schützenhaus\r
Sins, Bachtal\r
Sins, Freudenberger Wegkreuz\r
Sins, Sonnhalde\r
Sins\r
Sins, Büel\r
Sins, Schulstrasse\r
Sins, Brand\r
Sion, Les Cèdres\r
Sion, Mont d'Orge\r
Sion, Nord\r
Sion, Hôpital Sud\r
Sion, Capucins\r
Sion, Corbassière\r
Sion, école d'infirmières\r
Sion, Clarté\r
Sion, Petit Chasseur\r
Sion, Pratifori\r
Sion, Vieux-Moulin\r
Sion, Treille\r
Sion, St-Guérin Ouest\r
Sion, Furet\r
Sion, Promenade du Rhône\r
Sion, Vissigen\r
Sion, Potences\r
Sion, Sacré Coeur\r
Sion, Auto-Pôle\r
Sion, St-Hubert\r
Sion, Blancherie\r
Sion, Amandiers\r
Sion, Jonction\r
Sion, Garenne\r
Sion, Pont-du-Rhône\r
Sion, Carrefour de Platta\r
Sion, Molignon\r
Sion, Batassé\r
Sion, Entrepôts\r
Sion, Cours Roger Bonvin\r
Sion, Gravière\r
Sion, Perdrix\r
Sion, St-Guérin\r
Sion, Tourbillon\r
Sion, Dames blanches\r
Sion, Envol Est\r
Sion, Châteauneuf\r
Sion, Platta\r
Sion, Dixence\r
Sion, Pôle Santé\r
Sion, Pénitencier\r
Sion, Casernes\r
Sion, Pâquerettes\r
Sion, poste/gare\r
Sion, gare sud\r
Sion, Route de la Drague\r
Sion, Chanoine Berchtold\r
Sion, collège Ella Maillart\r
Sion, Agasse\r
Sion, EMS Gravelone\r
Sion, Envol Ouest\r
Sion, Manège\r
Sion, Gravelone\r
Sion, Valais de Coeur Champsec\r
Sion, Roches-Brunes\r
Sion\r
Sion, Piscine de la Blancherie\r
Sion, Pont-sur-la-Sionne\r
Sion, Tennis Iles\r
Sion, Camping des Iles\r
Sion, Chapelle\r
Sion, Maragnénaz\r
Sion, Place du Midi\r
Sion, Pôle Musique\r
Sion, Ateliers St-Hubert\r
Sion, Carrefour Ouest\r
Sion, Planta\r
Sion, Clinique\r
Sion, Grand Champsec\r
Sion, Cité du Soleil\r
Sion, Gare Bus Sédunois\r
Sion, Hôpital de Sion\r
Sion, Aéroport\r
Sion, Tennis de Valère\r
Sion, Les Iles Est\r
Sion, Les Fournaises\r
Sion, SUVA\r
Sion, Anthémis\r
Sion, Matze\r
Sion, Voirie\r
Sion, Campus\r
Sion, Roseaux\r
Sirnach, Pumpwerkstrasse\r
Sirnach, Bad\r
Sirnach, Kläffler\r
Sirnach, Hofen\r
Sirnach, Breite\r
Sirnach, Gloten\r
Sirnach, Weberei\r
Sirnach, Bahnhof\r
Sirnach\r
Sirnach, Rosenberg\r
Sirnach, Ebnet\r
Sirnach, Sonnenberg\r
Sirnach, Kett\r
Siselen-Finsterhennen\r
Sisikon, Rampe\r
Sisikon\r
Sisikon, Bahnhof\r
Sisikon, Binzenegg\r
Sisikon (See)\r
Sissach\r
Sissach, Bahnhof\r
Sissach, Sissacher Fluh\r
Sissach, Kreuzmatt\r
Sissach, Güterstrasse\r
Sissach, Hinteregg\r
Sissach, Grienmatt\r
Sissach, Allmend\r
Sissach, Hofacker\r
Sissach, Letten\r
Sissach, Sekundarschule\r
Sissach, Pfarrgässli\r
Sissach, Bergweg\r
Sissach, Voregg\r
Sissach, Brüel\r
Sissach, Bützenen\r
Sisseln AG, DSM\r
Sisseln AG, Breitenacher\r
Sisseln AG, Unterdorf\r
Sisseln AG, Syngenta\r
Sitterdorf, Landhaus\r
Sitterdorf, Bruggfeld\r
Sitterdorf, Bahnhof\r
Sitterdorf, alte Post\r
Sitterdorf, Langäckerstrasse\r
Sitterdorf\r
Sitzberg, Sternen\r
Siviez (station aval)\r
Siviez (Super-Nendaz)\r
Siviriez, En Jogne\r
Siviriez, village\r
Siviriez, Les Genièvres\r
Six-Fontaines\r
Soazza, Boffalora\r
Soazza, Stazión\r
Sobrio, Ronzano\r
Sobrio, Paese\r
Sodoleuvre\r
Soglio, Paese\r
Soglio, Selva\r
Sogn Martin\r
Solduno\r
Solduno, Stazione\r
Solduno, Via S. Martino\r
Solduno, Passetto\r
Solduno S. Martino\r
Solepraz (télésiège)\r
Solothurn, St. Katharinen\r
Solothurn, Kofmehl\r
Solothurn, Kunstmuseum\r
Solothurn, Zentralbibliothek\r
Solothurn, Sternen\r
Solothurn, Schiffländte\r
Solothurn, Roamer\r
Solothurn, Allmend\r
Solothurn, Ulmenweg\r
Solothurn, Postplatz\r
Solothurn, Gibelinstrasse\r
Solothurn, Amthausplatz\r
Solothurn, Hunnenweg\r
Solothurn, Grenchenstrasse\r
Solothurn, Vorstadt\r
Solothurn, Industriestrasse\r
Solothurn, Hubelmatt\r
Solothurn, Schwimmbad\r
Solothurn, Casablanca\r
Solothurn, Obach\r
Solothurn, Sonnenpark\r
Solothurn, Brunngraben\r
Solothurn\r
Solothurn, Touring\r
Solothurn, Kantonsschule\r
Solothurn, Brühl\r
Solothurn, Bergstrasse\r
Solothurn, Schöngrünstrasse\r
Solothurn, Hauptbahnhof\r
Solothurn, Baseltor\r
Solothurn, Spital\r
Solothurn, Wildbachstrasse\r
Solothurn (Schiff)\r
Solothurn Allmend, Bahnhof\r
Solothurn Allmend\r
Solothurn Baseltor\r
Solothurn Sternen\r
Solothurn West\r
Som-la-Proz\r
Someo\r
Sommentier, En Cheseaux\r
Sommentier, Abri PC\r
Sommerau\r
Sommeri, Kirche\r
Sommet-des-Vignes\r
Somtgant\r
Sonceboz-Sombeval, gare\r
Sonceboz-Sombeval\r
Sonceboz-Sombeval, Couronne\r
Sonlerto, Bolla (Bavona)\r
Sonlerto (Bavona)\r
Sonloup\r
Sonnenberg (Kriens)\r
Sonnental, Schulhaus\r
Sonogno\r
Sonterswil, Volg\r
Sonvico, Rosone\r
Sonvico, Mugnai\r
Sonvico, al Nido\r
Sonvico, S. Nicolao\r
Sonvico, Opera Charitas\r
Sonvico, Madonna d'Arla\r
Sonvico, Stazione ARL\r
Sonvico, Scuole\r
Sonvico, Sassello\r
Sonvilier\r
Sonvilier, collège\r
Sonzier\r
Sood-Oberleimbach\r
Sool, Untersool\r
Sool, Dorfmitte\r
Sool, Schulhaus\r
Soragno\r
Soral, douane\r
Soral, Bois-de-By\r
Soral, église\r
Soral, Faubourg\r
Sorebois\r
Sörenberg, Camping\r
Sörenberg, Habchegg\r
Sörenberg, Südelhöchi\r
Sörenberg, Platz\r
Sörenberg, Flühhütten\r
Sörenberg, Hirsegg\r
Sörenberg, Höchistrasse\r
Sörenberg, Schulhaus\r
Sörenberg, Rischli\r
Sörenberg, Rothornbahn\r
Sörenberg, Post\r
Sörenberg, Mittlere Hirsegg\r
Sörenberg, Schwändili\r
Sörenberg (Talst. Rossweid)\r
Sörenberg Platz\r
Sörenberg Steinetli (Bergst.)\r
Sörenberg Steinetli (Talst.)\r
Sörenberg-Schönenboden\r
Sorengo, Clinica S. Anna\r
Sorengo, Moncucchetto\r
Sorengo, S. Grato\r
Sorengo\r
Sorengo Laghetto\r
Sorens, Vers-les-Masson\r
Sorens, La Croix\r
Sorens, Camping\r
Sorens, Foyer\r
Sorens, Malessert scierie\r
Sorens, Pont sur le Gérigno\r
Sorens, village\r
Sorens, Malessert laiterie\r
Sornard (Nendaz), Iggier\r
Sornard (Nendaz), village\r
Sornard (Nendaz), Le Mihi\r
Sornetan, Le Pichoux\r
Sornetan\r
Sornico, S. Martino\r
Sorte, Pre del Pont\r
Sorvilier\r
Sottens, Radio\r
Sottens, croisée\r
Soubey, village\r
Soubey, Chercenay\r
Soubey, restaurant Relais\r
Souboz, village\r
Soulce, milieu du village\r
Soulce, poste\r
Soyhières, Rue de la Réselle\r
Soyhières, place de la Liberté\r
Soyhières, La Combe\r
Speicher, Almenweg\r
Speicher\r
Speicher, Bahnhof\r
Speicher, Buchen\r
Speicher, Stoss\r
Speicher, Reutenen\r
Speicher, Sitz\r
Speicherschwendi,Hinter d. Ack\r
Speicherschwendi, Bären\r
Speicherschwendi, Sonne\r
Speicherschwendi, Halden\r
Spiegel, Zentrum\r
Spiegel, Gurten-Gartenstadt\r
Spiegel, Spiegel\r
Spiegel, Gartenstrasse\r
Spiegel, Blinzern\r
Spiegel, Weidli\r
Spiegel, Steingrubenweg\r
Spiegel, Hohliebe\r
Spiegel, Jurablick\r
Spielboden\r
Spiez, Spiezmoos\r
Spiez, Höhe\r
Spiez, Leimern\r
Spiez, Aeschiweg\r
Spiez, Bahnhof\r
Spiez, Doren\r
Spiez, Kapellenstrasse\r
Spiez, Altersheim\r
Spiez\r
Spiez, Krone\r
Spiez, Lötschbergplatz\r
Spiez, Kronenplatz\r
Spiez, Grueb\r
Spiez, Niesenbrücke\r
Spiez, Eden Hotel\r
Spiez, Schiffstation\r
Spiez, Parkplatz Regez\r
Spiez, Kreuz\r
Spiez, Längmaad\r
Spiez, Bürgstrasse\r
Spiez, Oberlandstrasse\r
Spiez, Schachen\r
Spiez, Rütti\r
Spiez, Sodmatte\r
Spiez, Ghei\r
Spiez, Des Alpes\r
Spiez, Eigen\r
Spiez, Sibirienkurve\r
Spiez Schiffstation\r
Spiezwiler, Neumatte\r
Spiezwiler, Schulhaus\r
Spiezwiler, Rössli\r
Spiezwiler, Stegweide\r
Spinas\r
Spinezman\r
Spiringen, Grindli\r
Spiringen, Locherbach\r
Spiringen, Kipfen-Tristel\r
Spiringen, Rütti\r
Spiringen, Holzboden\r
Spiringen, Glätti\r
Spiringen, Witerschwanden\r
Spiringen, Dorf\r
Spirstock\r
Spital Zollikerberg\r
Splügen, Hüscherenbach\r
Splügen, Abzw. Suretta Seen\r
Splügen, Bergbahnen\r
Splügen, Dorf\r
Splügen (Talstation)\r
Splügen Bodmastafel\r
Splügenpass, Berghaus\r
Splügenpass, ital. Zoll\r
Spreitenbach, Umwelt Arena\r
Spreitenbach, Shoppi Tivoli\r
Spreitenbach, Kreuzäcker\r
Spreitenbach, Rotzenbühl\r
Spreitenbach, Brüel\r
Spreitenbach, Furttalstrasse\r
Spreitenbach, Härdlistrasse\r
Spreitenbach, Fegistrasse\r
Spreitenbach, Spreiti West\r
Spreitenbach, Ratzengasse\r
Spreitenbach, Rütilochstrasse\r
Spreitenbach, Dorf\r
Spreitenbach, Breiti\r
Spreitenbach, IKEA\r
Spreitenbach, Shopping Center\r
Spreitenbach, West\r
Spreitenbach, Glattler\r
Spreitenbach, Seefeld\r
Spreitenbach, Altersheim\r
Spreitenbach, Raiacker\r
Spreitenbach, Langäcker\r
Spreitenbach, Geeracher\r
Spruga\r
St-Aubin FR, église\r
St-Aubin FR, bif.\r
St-Aubin FR, Le-Haut\r
St-Aubin NE, village\r
St-Aubin NE, Le Devens\r
St-Aubin NE, anc. poste\r
St-Aubin NE, hôpital\r
St-Aubin NE, Les Charrières\r
St-Aubin NE, Senet\r
St-Aubin NE, Tivoli\r
St-Aubin NE, Petites Vignes\r
St-Aubin NE, Pattus\r
St-Aubin NE (bateau)\r
St-Barthélemy, Champ Cadet\r
St-Barthélemy, village\r
St-Barthélemy, Château\r
St-Blaise, Voëns\r
St-Blaise, bif. sur Frochaux\r
St-Blaise, centre\r
St-Blaise, La Goulette\r
St-Blaise, Sous-les-Vignes\r
St-Blaise, gare CFF\r
St-Blaise, bif. sur Maley\r
St-Blaise, Gare Lac\r
St-Blaise, Vigner\r
St-Blaise, sentier de la Gare\r
St-Blaise (bateau)\r
St-Blaise CFF\r
St-Blaise-Lac\r
St-Brais, village\r
St-Brais, Le Péquie\r
St-Brais, Le Cerneux-Bénat\r
St-Cergue\r
St-Cergue Les Cheseaux\r
St-Cierges, Grande Salle\r
St-Cierges, Transformateur\r
St-Cierges, La Tondiaz\r
St-Eloi\r
St-George, village\r
St-George, Côte-Malherbe\r
St-George, Maison Neuve\r
St-Gingolph, Villa Eugénie\r
St-Gingolph (Suisse)\r
St-Gingolph (Suisse) (lac)\r
St-Imier, ceff santé social\r
St-Imier, Erguël\r
St-Imier, Tivoli\r
St-Imier, place du 16 mars\r
St-Imier, ceff industrie\r
St-Imier, hôpital\r
St-Imier, Fontenayes\r
St-Imier, Bethania\r
St-Imier, Collégiale\r
St-Imier, Bakounine\r
St-Imier, Les Grands-Champs\r
St-Imier\r
St-Imier, La Goule\r
St-Imier, gare\r
St-Imier, Champs de la Pelle\r
St-Imier (funiculaire)\r
St-Jean VS, village\r
St-Légier, Plateau de la Veyre\r
St-Légier, collège La Chiésaz\r
St-Légier, Bottassioux\r
St-Légier, tennis\r
St-Légier, La Veyre-d'En-Haut\r
St-Légier, village\r
St-Légier, Pont de Fenil\r
St-Légier, Grangette\r
St-Légier, Ferreyres\r
St-Légier-Gare\r
St-Légier-Village\r
St-Léonard, Le Lac\r
St-Léonard, centre\r
St-Léonard\r
St-Livres, village\r
St-Livres, grande salle\r
St-Loup, hôpital\r
St-Luc, Zattelet\r
St-Luc, La Forêt\r
St-Luc, Bella Tola\r
St-Luc, Beausite\r
St-Luc, Chemin des Caïds\r
St-Luc, Tsampetros\r
St-Luc, poste\r
St-Luc (Tignousa)\r
St-Luc Forêt du Rochet\r
St-Martin FR, Villard\r
St-Martin FR, La Prela\r
St-Martin FR, village\r
St-Martin FR, église\r
St-Martin FR, Le Jordil\r
St-Martin VS, centre\r
St-Martin VS, poste\r
St-Martin VS, Le Baunou\r
St-Martin VS, Liez\r
St-Martin VS, église\r
St-Maurice\r
St-Maurice, Les Perris\r
St-Maurice, L'Acquis-Chapelle\r
St-Maurice, En Savary\r
St-Maurice, Les Emonets\r
St-Maurice, Cantine\r
St-Maurice VS, Midi\r
St-Maurice VS, Grotte aux Fées\r
St-Maurice VS, Plan Bouron\r
St-Maurice VS, Terreaux\r
St-Maurice VS, gare\r
St-Oyens, église\r
St-Pierre-de-Clages, école\r
St-Pierre-de-Clages, église\r
St-Prex, Penguey\r
St-Prex, place d'Armes\r
St-Prex, Scierie\r
St-Prex\r
St-Prex, Taillecou\r
St-Prex, gare nord\r
St-Prex, Epondaz\r
St-Prex, Pont Rouge\r
St-Prex (lac)\r
St-Romain (Ayent), centre\r
St-Saphorin\r
St-Saphorin-sur-Morges,village\r
St-Saphorin-sur-Morges, Pavé\r
St-Séverin\r
St-Sulpice NE, bas du village\r
St-Sulpice NE, Terminus\r
St-Sulpice NE, La Foule\r
St-Sulpice NE, poste\r
St-Sulpice NE, Prise Milord\r
St-Sulpice NE, collège\r
St-Sulpice VD, centre\r
St-Sulpice VD, Bochet\r
St-Sulpice VD, Chantres\r
St-Sulpice VD, Russel\r
St-Sulpice VD, En Champagny\r
St-Sulpice VD, Laviau\r
St-Sulpice VD, Ochettaz-Ormet\r
St-Sulpice VD, Pré-Fleuri\r
St-Sulpice VD, Venoge nord\r
St-Sulpice VD, Parc Scient.\r
St-Sulpice VD, Pâqueret\r
St-Sulpice VD, Castolin\r
St-Sulpice VD, Venoge sud\r
St-Sulpice VD (lac)\r
St-Triphon, Les Andonces\r
St-Triphon, gare\r
St-Triphon, Charpigny\r
St-Triphon,gouille du Duzillet\r
St-Triphon, site d'escalade\r
St-Triphon, Monnaie\r
St-Triphon, centre\r
St-Triphon-Gare\r
St-Triphon-Village, gare\r
St-Ursanne, Le Tillot\r
St-Ursanne, Bellefontaine\r
St-Ursanne, Lorette\r
St-Ursanne, gare\r
St-Ursanne, porte St-Pierre\r
St-Ursanne\r
St-Ursanne, l'écluse\r
St-Ursanne, bif. sur Seleute\r
St-Ursanne, Chamsat\r
St-Ursanne, Pont St-Jean/ville\r
St. Antoni, Niedermonten\r
St. Antoni, Dorf\r
St. Antoni, Weissenbach\r
St. Antönien, Waldheim\r
St. Antönien, Rüti\r
St. Antönien, Meierhof\r
St. Antönien, Bord\r
St. Antönien, Sunnirütistrasse\r
St. Antönien, Sagaris\r
St. Antönien,PartnunAlpenrösli\r
St. Antönien, Partnun Sulzfluh\r
St. Antönien, Gafia Edelweiss\r
St. Antönien, Äbi\r
St. Antönien, Garstett P6\r
St. Antönien, Aschüel\r
St. Antönien, Abzw. Michelshof\r
St. Antönien, Stapfaschärma\r
St. Antönien, Platz\r
St. Antönien, Gafia Dörfji\r
St. Antönien, Bärgli\r
St. Antönien, Älpli\r
St. Erhard, Dorf\r
St. Erhard, Längmatt\r
St. Erhard, Galerie\r
St. Erhard, Heidenacher\r
St. Erhard, Wiberg\r
St. Erhard-Knutwil\r
St. Gallen, Ahorn\r
St. Gallen, Bruggen\r
St. Gallen, Russen\r
St. Gallen, Spisertor (Bus)\r
St. Gallen, Altenwegen\r
St. Gallen, Blumenwies\r
St. Gallen, Blumenberg\r
St. Gallen, Etzelbünt\r
St. Gallen, Heiligkreuz\r
St. Gallen, Iddastrasse\r
St. Gallen, Goethestrasse\r
St. Gallen, Post St. Georgen\r
St. Gallen, Sporthalle\r
St. Gallen, Ruhbergstrasse\r
St. Gallen, Storchenstrasse\r
St. Gallen, Rotmonten\r
St. Gallen, Vogelherd\r
St. Gallen, Uni/Dufourstrasse\r
St. Gallen, Waldacker\r
St. Gallen, Fähnernstrasse\r
St. Gallen, Sömmerli\r
St. Gallen, Grossacker\r
St. Gallen, Grütli\r
St. Gallen, Favrestrasse\r
St. Gallen, Unterschachen\r
St. Gallen, Kantonsspital\r
St. Gallen, Achslen\r
St. Gallen, Dierauerstrasse\r
St. Gallen, Kirche St. Georgen\r
St. Gallen, Grütlistrasse\r
St. Gallen, Sonne\r
St. Gallen, Seeblick\r
St. Gallen, Melonenstrasse\r
St. Gallen, Heimatstrasse\r
St. Gallen, Tigerberg\r
St. Gallen, Scheidweg\r
St. Gallen, Winkeln\r
St. Gallen, Ruhsitz\r
St. Gallen, Westcenter\r
St. Gallen, Im Feld\r
St. Gallen, Mühlegg Talstation\r
St. Gallen, Hechtacker\r
St. Gallen, Hinterberg\r
St. Gallen, Rickenweg\r
St. Gallen, Arena\r
St. Gallen, Flurhof\r
St. Gallen, Dietlistrasse\r
St. Gallen, Harzbüchelstrasse\r
St. Gallen, Friedhof Bruggen\r
St. Gallen, Hüttenwies\r
St. Gallen, Ostfriedhof\r
St. Gallen, Gröblistrasse\r
St. Gallen, Krontal\r
St. Gallen, Olma Messen\r
St. Gallen,Klinik Stephanshorn\r
St. Gallen, Stephanshorn\r
St. Gallen, Riederenholz\r
St. Gallen, Haggen\r
St. Gallen, Hagenbuch\r
St. Gallen, Lindenstrasse\r
St. Gallen, Guggeien\r
St. Gallen, Hölzli\r
St. Gallen, Talstrasse\r
St. Gallen, Schachenbüel\r
St. Gallen, Untere Kräzern\r
St. Gallen, Saturn\r
St. Gallen, Wilen\r
St. Gallen, Zil\r
St. Gallen, Schibenertor\r
St. Gallen, Oberhofstettenweg\r
St. Gallen, Hafnerwaldstrasse\r
St. Gallen, Stahl KV-Schule\r
St. Gallen, Walserstrasse\r
St. Gallen, Kantonsschule\r
St. Gallen, Einstein\r
St. Gallen, Spitalstrasse\r
St. Gallen, Haselstrasse\r
St. Gallen, Aetschberg\r
St. Gallen, Boppartshof\r
St. Gallen, Uni/Gatterstrasse\r
St. Gallen, Lachen\r
St. Gallen, Sonnenhalde\r
St. Gallen, Kräzern\r
St. Gallen, Oberstrasse\r
St. Gallen, Singenberg\r
St. Gallen, Moosweiher\r
St. Gallen, St. Fiden Zentrum\r
St. Gallen, Ruckhalde\r
St. Gallen, Mühlegg\r
St. Gallen, Röteli\r
St. Gallen, Winkelriedstrasse\r
St. Gallen, Pelikanstrasse\r
St. Gallen, Schönenwegen\r
St. Gallen, Wolfganghof\r
St. Gallen, Bernhardswies\r
St. Gallen, Oberhofstetten\r
St. Gallen, Uni/Curtistrasse\r
St. Gallen, Hochwacht\r
St. Gallen, Fürstenlandbrücke\r
St. Gallen, Bleicheli\r
St. Gallen, Schaugenhof\r
St. Gallen, Theater\r
St. Gallen, Bahnhof\r
St. Gallen, Remishueb / Klinik\r
St. Gallen, Neudorf/R'str.\r
St. Gallen, Spisegg\r
St. Gallen, Stahl\r
St. Gallen, Schützengarten\r
St. Gallen, Schülerhaus\r
St. Gallen, Bruggwiesen\r
St. Gallen, Bachstrasse\r
St. Gallen, Bach St. Georgen\r
St. Gallen, Berneggstrasse\r
St. Gallen, Naturmuseum\r
St. Gallen, Gallusmarkt\r
St. Gallen, Geltenwilenstrasse\r
St. Gallen, Rosenbergstrasse\r
St. Gallen, Halden\r
St. Gallen, Steingrüebli\r
St. Gallen, Poststrasse\r
St. Gallen, Lerchenfeld\r
St. Gallen, Obere Leimat\r
St. Gallen, Nussbaumstrasse\r
St. Gallen, Stocken\r
St. Gallen, Mövenstrasse\r
St. Gallen, Waldgutstrasse\r
St. Gallen, Schoren\r
St. Gallen, Waldau\r
St. Gallen, Schlössli\r
St. Gallen, Vonwil\r
St. Gallen, Solitüdenstrasse\r
St. Gallen, Hinterbergstrasse\r
St. Gallen, Mühlegg Bergstat.\r
St. Gallen, Rosenheimstrasse\r
St. Gallen, Kolosseumstrasse\r
St. Gallen, Hodlerstrasse\r
St. Gallen, Telltreppe\r
St. Gallen, Karlstor\r
St. Gallen, Obere Waid\r
St. Gallen\r
St. Gallen, Sonnrainweg\r
St. Gallen, Schuppisstrasse\r
St. Gallen, Lindenhof\r
St. Gallen, Wendeplatz Stocken\r
St. Gallen, Kirche Bruggen\r
St. Gallen, Müller-Friedberg\r
St. Gallen, Notkersegg\r
St. Gallen, Neudorf\r
St. Gallen, Athletik Zentrum\r
St. Gallen, Bruggwaldpark\r
St. Gallen, Moos\r
St. Gallen, Heiligkreuzstrasse\r
St. Gallen, Bruggwald\r
St. Gallen, Birnbäumen\r
St. Gallen, Schuppis Nord\r
St. Gallen, Stiftsbezirk\r
St. Gallen, Rosenbüchel\r
St. Gallen, St.Leonhard\r
St. Gallen, Riethüsli\r
St. Gallen, Marktplatz Bohl\r
St. Gallen, Langgass\r
St. Gallen Birnbäumen\r
St. Gallen Bruggen, Erlachstr.\r
St. Gallen Bruggen\r
St. Gallen Güterbahnhof\r
St. Gallen Haggen, Bahnhof\r
St. Gallen Haggen\r
St. Gallen Marktplatz\r
St. Gallen Notkersegg\r
St. Gallen Riethüsli\r
St. Gallen Schülerhaus\r
St. Gallen Spisertor\r
St. Gallen St. Fiden\r
St. Gallen St. Fiden, Bhf. Ost\r
St. Gallen St. Fiden, Bhf. Süd\r
St. Gallen Winkeln, Bhf. Süd\r
St. Gallen Winkeln\r
St. Gallen Winkeln, Bhf. Nord\r
St. Gallenkappel, Unterdorf\r
St. Gallenkappel, Post\r
St. Gallenkappel, Holz\r
St. Gallenkappel, Berg\r
St. Gallenkappel, Kronenwiese\r
St. Gallenkappel, Lindenbächli\r
St. Gallenkappel, Schule\r
St. German, Dorfplatz\r
St. Jakob (Ennetmoos)\r
St. Jakob (Isenthal)\r
St. Johannsen\r
St. Katharinen\r
St. Katharinental\r
St. Margarethen TG, Sedel\r
St. Margarethen TG, Dorf\r
St. Margrethen SG, Nebengraben\r
St. Margrethen SG, Mineralbad\r
St. Margrethen SG, Apfelberg\r
St. Margrethen SG, Bahnhof\r
St. Margrethen SG, Central\r
St. Margrethen SG, Gletscherh\r
St. Margrethen SG, Rheinpark\r
St. Margrethen SG, Heldsberg\r
St. Margrethen SG, Äueli\r
St. Margrethen SG\r
St. Margrethen SG,Schäflisberg\r
St. Margrethen SG,Industriestr\r
St. Margrethenberg, Dorf\r
St. Margrethenberg, Tristeli\r
St. Martin, Bucarischuna\r
St. Martin (Lugnez)\r
St. Moritz, Kulm\r
St. Moritz, Schulhausplatz\r
St. Moritz, Somplaz\r
St. Moritz, Bären\r
St. Moritz, Segantini Museum\r
St. Moritz\r
St. Moritz, Serlas\r
St. Moritz, Caspar Badrutt\r
St. Moritz, Bahnhof\r
St. Moritz (Standseilbahn)\r
St. Moritz Bad, Youth Hostel\r
St. Moritz Bad, Via Salet\r
St. Moritz Bad, Sonne\r
St. Moritz Bad, Via San Gian\r
St. Moritz Bad, Via Aruons\r
St. Moritz Bad, Kath. Kirche\r
St. Moritz Bad, Hallenbad\r
St. Moritz Bad, Post\r
St. Moritz Bad, Giand'Alva\r
St. Moritz Bad, Reithalle\r
St. Moritz Bad, Campingplatz\r
St. Moritz Bad, Signalbahn\r
St. Moritz Bad (Signalbahn)\r
St. Moritz Suvretta\r
St. Niklaus b. Koppigen, Heim\r
St. Niklaus b. Koppigen\r
St. Niklaus SO\r
St. Niklaus VS, Schulhaus\r
St. Niklaus VS, Bord\r
St. Niklaus VS, Wichel\r
St. Niklaus VS, Meiggern\r
St. Niklaus VS, Bahnhof\r
St. Niklaus VS, Zen-Achern\r
St. Niklaus VS, Rossen\r
St. Niklaus VS, Riedacker\r
St. Niklaus VS, Altersheim\r
St. Niklaus VS, Stock\r
St. Niklaus VS, Ballacker\r
St. Niklaus VS\r
St. Niklaus VS, Feuerwehrlokal\r
St. Niklaus VS, Sand\r
St. Niklaus VS, Gehri\r
St. Niklaus VS, Biffig\r
St. Niklaus VS, Flieltinen\r
St. Niklaus VS, Bodmen\r
St. Niklausen LU, Langensand\r
St. Niklausen LU, Haslihorn\r
St. Niklausen LU, Stutz\r
St. Niklausen LU, Mättiwil\r
St. Niklausen LU, Unterwil\r
St. Niklausen LU (See)\r
St. Niklausen OW, Eistlibach\r
St. Niklausen OW, alte Post\r
St. Niklausen OW, Alpenblick\r
St. Niklausen OW, Haueti\r
St. Pantaleon, bei den Tannen\r
St. Pantaleon, Degenmatt\r
St. Pelagiberg, Trön\r
St. Pelagiberg, Kurhaus\r
St. Pelagiberg, Rothen\r
St. Pelagiberg, Landhaus\r
St. Peter, Unterbofel\r
St. Peter, Abzw. Litzi\r
St. Peter, Oberbofel\r
St. Peter, Rathaus\r
St. Peter, Caflies\r
St. Peter, Gufa\r
St. Peter Fatschel, Hochwang\r
St. Peter Fatschel (Hochwang)\r
St. Peter Triemel, Gasthaus\r
St. Peter Triemel\r
St. Peter-Molinis\r
St. Peter-Molinis, Bahnhof\r
St. Petersinsel Nord\r
St. Peterzell, Rüti\r
St. Peterzell, Stafel\r
St. Peterzell, Schönenbühl\r
St. Peterzell, Mühle\r
St. Peterzell, Bächlistrasse\r
St. Peterzell, Dorf\r
St. Silvester, Plenefy\r
St. Silvester, Dorf\r
St. Silvester, Hangenried\r
St. Silvester, Muschels\r
St. Silvester, Ebnet\r
St. Silvester, Abzw.\r
St. Silvester, Chrache\r
St. Silvester, Fifermoos\r
St. Stephan, Bawald\r
St. Stephan, Lengebrand\r
St. Stephan, altes Moosschulh.\r
St. Stephan, Bahnhof\r
St. Stephan, Ried\r
St. Stephan, Bleiki\r
St. Stephan, Nageldach\r
St. Stephan\r
St. Stephan, Grodey\r
St. Stephan, Kirche\r
St. Stephan (Talstation)\r
St. Urban\r
St. Urban, Klinik\r
St. Urban, Birchmatt\r
St. Urban, Bahnhof\r
St. Urban, Sonnhalden\r
St. Urban, Unterberghof\r
St. Urban, Chlisonnhalde\r
St. Urban, Sonnhaldenhof\r
St. Urban, Tundwilerweg\r
St. Urban Ziegelei\r
St. Ursen, alte Post\r
St. Ursen, Dorf\r
St. Ursen, Tasberg\r
St. Ursen, Struss\r
St. Ursen, Römerswil\r
Sta. Domenica, Paese\r
Sta. Maria in Calanca, Paese\r
Sta. Maria in Calanca, Posta\r
Sta. Maria in Calanca, Pozzo B\r
Sta. Maria Val M., Blockhütte\r
Sta. Maria Val M., Pra da Vau\r
Sta. Maria Val M., Val Gronda\r
Sta. Maria Val Müstair, cumün\r
Sta. Maria Val Müstair, scoula\r
Sta. Maria Val Müstair, Sielva\r
Staad (Grenchen), Käserei\r
Staad (Grenchen), Reiherstr.\r
Staad (Grenchen), Staadstr.186\r
Staad SG, Hafen\r
Staad SG\r
Staad SG, Nagelstein\r
Staad SG, Risegg\r
Staad SG, Schönenbach\r
Staad SG, Bahnhof\r
Staad SG, Speck\r
Staad SG, Buechen\r
Staad SG Hafenmole\r
Stabelchod P8\r
Stabio\r
Stabio, Case Rapelli\r
Stabio, Madonnina\r
Stabio, Scuola Media\r
Stabio, Dazio Vecchio\r
Stabio, Municipio\r
Stabio, Bagni\r
Stabio, Stazione\r
Stabio, Posta\r
Stachen, Museum Momö\r
Stächenrain\r
Stadel b. N., Musterplatz\r
Stadel b. N., Neuwis-Huus\r
Stadel b. N., Stig\r
Stadel b. N., Zentrum\r
Stäfa, Wiesengrund\r
Stäfa, Echtlenbach\r
Stäfa, Wässerwies\r
Stäfa, Lindenbänkli\r
Stäfa, Tränkebachstrasse\r
Stäfa, Kniebreche\r
Stäfa, Mies\r
Stäfa, Grund\r
Stäfa, Rain\r
Stäfa, Lattenberg\r
Stäfa, Frohberg\r
Stäfa\r
Stäfa, Obstgarten\r
Stäfa, Phonak\r
Stäfa, Binz\r
Stäfa, Metzg\r
Stäfa, Strandbad\r
Stäfa, Schützenhaus Wanne\r
Stäfa, Dorf\r
Stäfa, Mühlehölzli\r
Stäfa, Laubisrüti\r
Stäfa, Uelikon\r
Stäfa, Landi\r
Stäfa, Krone\r
Stäfa, Bahnhof\r
Stäfa, Kehlhof\r
Stäfa (See)\r
Stafel (Lauchernalp)\r
Staffelbach, Gemeindehaus\r
Staffelbach, Suhrenbrücke\r
Staffelegg, Passhöhe\r
Staffeln AG, Gass\r
Staffeln AG, Schulhaus\r
Stalden (Sarnen), Brünischwand\r
Stalden (Sarnen), Sportplatz\r
Stalden (Sarnen), Geren\r
Stalden (Sarnen), Post\r
Stalden i.E.\r
Stalden OW, Abzw. Stockenmatt\r
Stalden VS, Walchgraben\r
Stalden VS, Grossacker\r
Stalden VS, Weng\r
Stalden VS, Mühlackern\r
Stalden VS, Pollern\r
Stalden VS, Bärgji\r
Stalden VS, Illas\r
Stalden VS, Mühlebach\r
Stalden VS, Merjen\r
Stalden VS, Stahlen\r
Stalden VS, Ackersand/Post\r
Stalden-Saas, Bahnhof\r
Stalden-Saas\r
Stalden-Saas (Talstation)\r
Staldenried, Räbwier\r
Staldenried\r
Staldenried Kirche\r
Stallikon, Bleiki\r
Stallikon, Gamlikon\r
Stallikon, Sellenbüren\r
Stallikon, Aegerten\r
Stallikon, Tägerst\r
Stallikon, Diebis\r
Stallikon, Loomatt\r
Stallikon, Wolfenhof\r
Stallikon, Langfuren\r
Stallikon, Aumüli\r
Stallikon, Dorf\r
Stammheim, Frohsinn\r
Stammheim, Bahnhof\r
Stammheim\r
Stampa, Val d'Arca\r
Stampa, Villaggio\r
Stampa, Palù\r
Stand\r
Stand (Rindertitlis)\r
Stans, Spital\r
Stans, Bahnhof\r
Stans, St. Josef\r
Stans\r
Stans, Kantonalbank\r
Stans, Spichermatt\r
Stans, Kreuzstrasse\r
Stans, Breiten\r
Stans, Galgenried\r
Stans, Mettenweg\r
Stans, Engelbergstrasse\r
Stans, Sportanlage Eichli\r
Stans, Oberstmühle\r
Stans, Hansmatt\r
Stans, Länderpark\r
Stans, Pilatuswerke\r
Stans (Talstation Stanserhorn)\r
Stanserhorn\r
Stansstad, Kilchlidossen\r
Stansstad, Seehof\r
Stansstad, Abzw. Fürigen\r
Stansstad, Schule\r
Stansstad, Abzw. Rotzloch\r
Stansstad, Schützen\r
Stansstad, Bahnhof\r
Stansstad, Seewli\r
Stansstad\r
Stansstad, Bürgenstockstrasse\r
Stansstad, Sommerweid\r
Stansstad (See)\r
Starrkirch, Rütli\r
Starrkirch-Wil,Gemeindezentrum\r
Starrkirch-Wil, Landhaus\r
Startgels\r
Stätzerhorn\r
Stätzertäli\r
Stauberen\r
Staufen, Lindenplatz\r
Staufen, Beyeler\r
Staufen, Zelgli\r
Staufen, Chrüzweg\r
Ste-Croix, Col-des-Etroits\r
Ste-Croix, place du Pont\r
Ste-Croix, av. de Neuchâtel\r
Ste-Croix, gare\r
Ste-Croix, poste\r
Ste-Croix, rue des Rasses\r
Ste-Croix, La Charmille\r
Ste-Croix, Les Replans\r
Ste-Croix\r
Ste-Croix, av. des Gittaz\r
Stechelberg, Hotel\r
Stechelberg, Schilthornbahn\r
Stechelberg, Post\r
Stechelberg, Stegmatte\r
Stechelberg, Sandbach\r
Stechelberg (Schilthornbahn)\r
Steckborn, Schulhaus Hub\r
Steckborn, Feldbach\r
Steckborn, Bahnhof\r
Steckborn, im Rank\r
Steckborn\r
Steckborn, Sportplatz Emmig\r
Steckborn, Eichhölzli\r
Steckborn, Haldenberg\r
Steckborn (See)\r
Steffisburg, Schule Bernstr.\r
Steffisburg, Sonnenfeld\r
Steffisburg, Alte Bernstrasse\r
Steffisburg, Schwäbis\r
Steffisburg, Schiessstand\r
Steffisburg, Glockenthalerhof\r
Steffisburg, Emberg\r
Steffisburg, Flühli\r
Steffisburg, Ziegeleistrasse\r
Steffisburg, Zulgbrücke\r
Steffisburg\r
Steffisburg, Schwandenbad\r
Steffisburg, Wendeplatte\r
Steffisburg, Dorf\r
Steffisburg, Platz\r
Steffisburg, Erlen\r
Steffisburg, Kirche\r
Steffisburg, Burgergut\r
Steffisburg, Schönau\r
Steffisburg, Oberes Flühli\r
Steffisburg, Haldeneggweg\r
Steffisburg, Ziegelei\r
Steffisburg, Brauerei\r
Steffisburg, Bösbach\r
Steffisburg, Engerain\r
Steffisburg, Zulgstrasse\r
Steffisburg, Musterplatz\r
Steffisburg, Bahnhof\r
Steffisburg, Fuchsloch\r
Steg\r
Steg FL, Hotel\r
Steg FL, Tunnel\r
Steg im Tösstal, Chlital\r
Steg im Tösstal, Bahnhof\r
Steg SG (Gebertingen)\r
Steg VS, Zentrum Metropol\r
Steg VS, Sand\r
Steg VS, Eggi\r
Steg VS, Kirche\r
Steg VS, Industriezone\r
Steg VS, Zanellahaus\r
Steg VS, Hallenbad\r
Steg VS, Feldegg\r
Steg VS, Bäckerei\r
Steg VS, Mittal\r
Stehrenberg, Dorf\r
Steigbach, Bahnhof\r
Steigbach\r
Stein (Obersaxen)\r
Stein AG, Kreuzstrasse\r
Stein AG, Novartis\r
Stein AG, Rüchligstrasse\r
Stein AG, Bahnhofstrasse\r
Stein am Rhein, Bahnhof\r
Stein am Rhein, Grenzstein\r
Stein am Rhein, Strandbad\r
Stein am Rhein, Untertor\r
Stein am Rhein, Schule\r
Stein am Rhein\r
Stein am Rhein, Rathaus\r
Stein am Rhein (Schifflände)\r
Stein AR, Schachen\r
Stein AR, Rämsen-Störgel\r
Stein AR, Hagtobel\r
Stein AR, Rose\r
Stein AR, Dorf\r
Stein Bergstation\r
Stein SG, Mühlewies\r
Stein SG, Dorf\r
Stein SG, Breitenau\r
Stein-Säckingen, Bahnhof\r
Stein-Säckingen\r
Steinach, Schule\r
Steinach\r
Steinach, Hafen\r
Steinach, Obersteinach Käserei\r
Steinach, Bifang\r
Steinach, Kirche\r
Steinach, Post\r
Steinboden\r
Steinböden\r
Steinebrunn, Dorf\r
Steinebrunn\r
Steinebrunn, Bahnhof\r
Steinebrunn, Erdhausen\r
Steinegg, Bahnhof\r
Steinegg\r
Steineloh, Sternen\r
Steinen, Rest. Löwen\r
Steinen, Wyler\r
Steinen, Hausmatt\r
Steinen, Spiegelberg\r
Steinen, Adelboden\r
Steinen, Oelberg\r
Steinen, Spiegelberg Schlag\r
Steinen, Dorfbrücke\r
Steinen, Bahnhof\r
Steinen\r
Steinen, Rigiblick\r
Steinerberg, St. Anna\r
Steinerberg, Diezigen\r
Steinerberg, Husmatt\r
Steinerberg\r
Steinerberg, Chornacher\r
Steingletscher, Susten\r
Steinhaus, Dorfplatz\r
Steinhaus\r
Steinhausen, Sumpfstrasse\r
Steinhausen, Birkenhalde\r
Steinhausen, Oele\r
Steinhausen, Eichholz\r
Steinhausen, Zentrum\r
Steinhausen, Hinterberg Bhf\r
Steinhausen, Turmstrasse\r
Steinhausen, Bahnhof\r
Steinhausen, Sennweid\r
Steinhausen, Rigiweg\r
Steinhausen\r
Steinhausen, Zugerland EKZ\r
Steinhausen Rigiblick\r
Steinhof SO\r
Steinibach\r
Steinibach, Bahnhof\r
Steinibach BE, Aarmattweg\r
Steinibach BE, Aarestrasse\r
Steinmatten\r
Steinmaur, Heitlig\r
Steinmaur, Sünikon\r
Steinmaur, Gemeindehaus\r
Steinmaur, Bahnhof\r
Steinmaur, Obersteinmaur\r
Steinmaur\r
Stels, Hof de Planis\r
Stels, Mottis\r
Stels, Prodavos\r
Stels, Lärweg\r
Stels, Crals\r
Sternen bei Teufen\r
Sternenberg, Gfell\r
Sternenberg, Rossweid\r
Sternenberg, Höchstock\r
Sternenberg, Sunnenbad\r
Sternenberg, Kirche\r
Stettbach, Bahnhof\r
Stettbach\r
Stetten AG, Dörndler\r
Stetten AG, Klosterfeld\r
Stetten AG, Künterstrasse\r
Stetten AG, Dorfplatz\r
Stetten AG, Mellingerstrasse\r
Stetten SH, Staaringelacker\r
Stetten SH, Vorderdorf\r
Stetten SH, Rietwis\r
Stetten SH, Sonne\r
Stetten SH, Braati\r
Stettfurt, Vorstadt\r
Stettfurt, Lettenstrasse\r
Stettfurt, Dorfzentrum\r
Stettfurt, Freudenberg\r
Stettfurt, Köll\r
Stettlen, Linde\r
Stettlen\r
Stierenberg\r
Stierenberg b. Grenchen\r
Stierva, vischnanca\r
Stilli, Aarebrücke\r
Stilli, Villigerstrasse\r
Stivetta\r
Stöckalp\r
Stockhorn\r
Stockhütte (Bergstation)\r
Stöckli\r
Stöfeli (Mittelstation)\r
Stoos (Klingenstockbahn)\r
Stoos Bergstat. (Luftseilb)\r
Stoos SZ\r
Stoos(Sesselbahn Fronalpstock)\r
Stoss AR, Bahnhof\r
Stoss AR\r
Stössi (Mörlialp)\r
Strada i. E., spv. Seraplana\r
Strada i. E., San Niclà\r
Strada i. E., Sclamischot\r
Strada i. E., Cuncalada\r
Strada i. E., spv. Chaflur\r
Strahlgand (Bergst. Oberalp)\r
Strahlholz, Bahnhof\r
Strahlholz\r
Strelaalp\r
Strengelbach, Gemeindehaus\r
Strengelbach, Hard\r
Strengelbach, Hardmattenweg\r
Strengelbach, Kath. Kirche\r
Strengelbach, Bifang\r
Strengelbach, Sägetstrasse\r
Strengelbach, Burgherr\r
Strengelbach, Kreuzplatz\r
Strengelbach, Schürliweg\r
Strengelbach, Seniorenzentrum\r
Strengelbach, Schleipfen\r
Striggen\r
Strohwilen, Dorf\r
Strohwilen-Wolfikon, Käserei\r
Studen BE, Wydenplatz\r
Studen BE, Grien\r
Studen BE, Schulhaus\r
Studen BE, Längacker\r
Studen BE, Sagi\r
Studen BE, Petinesca\r
Studen BE\r
Studen BE, 3 Tannen\r
Studen SZ, Adelmatt\r
Studen SZ, Ochsenboden\r
Studen SZ, Dörfli\r
Stugl/Stuls, Dorf\r
Stüsslingen, Kreuz\r
Stüsslingen, Muggenloch\r
Stüsslingen, Garage\r
Stüsslingen, Jura\r
Stüsslingen, Mühle\r
Suberg, Kosthofen\r
Suberg-Grossaffoltern, Bahnhof\r
Suberg-Grossaffoltern\r
Subingen, Dorf\r
Subingen, Schulzentrum\r
Subingen, Kirche\r
Subingen, Bahnhof\r
Suchy, Grande Salle\r
Suchy, village\r
Süderen, Oberei\r
Süderen, Dorf\r
Suen, Les Grands Praz\r
Suen, Sud\r
Suen, centre\r
Sufers, Underem Dorf\r
Sugiez, Nant\r
Sugiez, Centre sportif\r
Sugiez\r
Sugiez, poste\r
Sugiez, gare\r
Sugiez (bateau)\r
Sugnens, gare\r
Sugnens, village\r
Sugnens\r
Suhr, Bahnhof\r
Suhr, Lindenfeld\r
Suhr, Fliederweg\r
Suhr, Feld\r
Suhr, Bühlstrasse\r
Suhr, Mattenweg\r
Suhr, Waldhofweg\r
Suhr, Grillenweg\r
Suhr\r
Suhr, Schweizerhof\r
Suhr, Gemeindehaus\r
Sulgen, Bahnhof\r
Sulgen\r
Sullens, Auberge\r
Sulwald\r
Sulz AG, Mitteldorf\r
Sulz AG, Milchhüsli\r
Sulz AG, Bütz\r
Sulz AG, Leidikon\r
Sulz AG, Roos\r
Sulzbach\r
Sumiswald, Forum\r
Sumiswald, Ey\r
Sumiswald, Gammenthal\r
Sumiswald, Arch\r
Sumiswald, Dorfgasse\r
Sumiswald, Griesbach\r
Sumiswald, Mauer\r
Sumiswald, Post\r
Sumiswald-Grünen, Bahnhof\r
Sumiswald-Grünen\r
Summaprada, Schauenberg\r
Summaprada, Abzw. Hotel Reich\r
Summaprada, Dorf\r
Sumvitg, Plaun da Crusch\r
Sumvitg, Sogn Benedetg\r
Sumvitg, vitg\r
Sumvitg, spv S. Benedetg\r
Sumvitg-C., Bahnhof/Camping\r
Sumvitg-Cumpadials, staziun\r
Sumvitg-Cumpadials\r
Sundlauenen, Dorf\r
Sundlauenen, Geisskilche\r
Sundlauenen, Balmholz\r
Sundlauenen, Pilgerweg\r
Sunnbüel\r
Sunnegga\r
Sunnegga (Breitboden)\r
Sunnegga (Eisflue)\r
Sur, plazza dalla posta\r
Sur, baselgia\r
Sur GR Alp Flix, Tgalucas\r
Sur GR Alp Flix, Tigias Hotel\r
Sur GR Alp Flix, Truaschigna\r
Sur Roche\r
Sur-le-Buis\r
Surava, Dorf\r
Surava, Pro Quarta\r
Surava, Abzw. Bahnhof\r
Surava\r
Surcuolm, vitg\r
Surcuolm, Valata\r
Surcuolm, Camping\r
Surcuolm, spv. Canetg\r
Surcuolm, Cavrida\r
Sureggio, Al Loco\r
Sureggio\r
Surlej, Islas\r
Surlej, Punt\r
Surlej, Corvatschbahn\r
Surlej, Cristins\r
Surlej, Foppas\r
Surovas\r
Surpierre, poste\r
Surpierre, école\r
Surrein, Giachentrina\r
Surrein, Val\r
Surrein, Reits\r
Surrein, vitg\r
Sursee, Holzacherstrasse\r
Sursee, Mariazell\r
Sursee, Kotten\r
Sursee, Chommlibach\r
Sursee, Bahnhof\r
Sursee, Spital Fussweg\r
Sursee, Spital\r
Sursee, Park\r
Sursee, Waldegg\r
Sursee, Münchrüti\r
Sursee, Rothüsli\r
Sursee\r
Sursee, Altstadt\r
Sursee, Frieslirain\r
Sursee, Sappeurstrasse\r
Sursee, Rathaus\r
Sursee, Post\r
Sursee, Surentalstrasse\r
Sursee, Sonnhalde\r
Suscévaz, Au Coin\r
Suscévaz, village\r
Suscévaz, Les Vignes\r
Susch, staziun\r
Susch, Chantsura\r
Susch, Plaz\r
Susch\r
Susch, Abzw. Schwarzhorn\r
Susch, Röven\r
Süsom Givè (Passhöhe)\r
Susten, Schule\r
Susten, Abzw. St. Josef\r
Susten, Kreuzung Agarn\r
Susten, Kaplaneimatte\r
Susten, Kreuzmatten\r
Susten, Durannen\r
Susten, Unter Feithieren\r
Susten, Briannen\r
Susten, Gampinen\r
Susten, Ober Feithieren\r
Susten Passhöhe\r
Sutz\r
Sutz, Bahnhof\r
Suvigliana\r
Suvigliana, Funicolare\r
Syens, Clos du Château\r
Syens, Champ-du-Chêne\r
Tafers, Oberdorf\r
Tafers, Am Kreuz\r
Tafers, Dorf\r
Tafers, Muttacker\r
Tafers, Spital\r
Tafers, Abzw. Rohr\r
Tagelswangen, Gerenhalde\r
Tagelswangen, Dorf\r
Tagelswangen, Buckstrasse\r
Tagelswangen, Oberwis\r
Tagelswangen, Herdlen\r
Tägerig, Grüt\r
Tägerig, Dorfzentrum\r
Tägerig, Weidhof\r
Tägerschen\r
Tägerschen, Bahnhof\r
Tägertschi\r
Tägertschi, Dorf\r
Tägerwilen, Kirche\r
Tägerwilen, Ochsengarten\r
Tägerwilen, Guggenbühl\r
Tägerwilen, Glaserstrasse\r
Tägerwilen, Zentrum\r
Tägerwilen, Sportplatz\r
Tägerwilen, Ruet\r
Tägerwilen, Hertler\r
Tägerwilen, Ernst-Kreidolfstr.\r
Tägerwilen, Industrie\r
Tägerwilen Dorf, Bahnhof\r
Tägerwilen Dorf\r
Tägerwilen-Gottlieben, Bahnhof\r
Tägerwilen-Gottlieben\r
Tamatten\r
Tamboalp\r
Tamboalp, Abzw.\r
Tamins, Unterdorf\r
Tamins, Oberdorf\r
Tamins, Schlössli\r
Tanatzhöhi\r
Tanatzhöhi (Tamboalp Bergst.)\r
Tänikon, Forschungsanstalt\r
Tann, Härtiplatz\r
Tann, Blatt\r
Tann, Nauen\r
Tann, Sonnenberg\r
Tann-Dürnten\r
Tannay, village\r
Tannay\r
Tannay, giratoire\r
Tarasp, Florins\r
Tarasp, Vulpera\r
Tarasp, Fontana\r
Tarasp, Villa Maria\r
Tarasp, Sgnè\r
Tarnolgio\r
Tartar, Hof Foppa\r
Tartar, Valeina\r
Tartar, Sorts\r
Tartar, Dorf\r
Tartegnin, village\r
Tartegnin, La Vissenche\r
Täsch\r
Tatroz, En Franex\r
Tatroz, village\r
Täuffelen, Bahnhof\r
Täuffelen, Burrirain/Moosgasse\r
Täuffelen\r
Tavanasa-Breil/Brigels,staziun\r
Tavanasa-Breil/Brigels\r
Tavannes, gare\r
Tavannes, rte de Reconvilier\r
Tavannes\r
Taverne, Vignascia\r
Taverne, Casette\r
Taverne, Superiore\r
Taverne, Paese\r
Taverne, Via Puréca\r
Taverne, Carvina\r
Taverne, Solriposo\r
Taverne, Dosso\r
Taverne-Torricella, Stazione\r
Taverne-Torricella\r
Tecknau\r
Tecknau, Mitteldorf\r
Tecknau, Bahnhof\r
Tecknau, Dorf\r
Tegerfelden, Hochbrücke\r
Tegerfelden, Kirche\r
Tegna\r
Tegna, Paese\r
Tellsplatte\r
Tenero, Posta\r
Tenero, Piazza\r
Tenero, Stazione\r
Tenero, Scuole\r
Tenero, Chiesa\r
Tenero, Fraccia\r
Tenero, Stella d'Oro\r
Tenero, Centro Commerciale\r
Tenero\r
Tenero, Brere\r
Tenero (lago)\r
Tengia\r
Tenna, Solarskilift\r
Tenna, Abzw.\r
Tenna, Mitte\r
Tenna, Pflanzgarten\r
Tenniken, Dorf\r
Tennwil, Strandbad\r
Tennwil\r
Tentlingen, Dürrenberg\r
Tentlingen, Dorf\r
Termen, Feldgraben\r
Termen, Dorfplatz\r
Termine, Paese\r
Territet\r
Territet, av. Riviera\r
Territet, L'Eaudine\r
Territet, gare\r
Territet (funi)\r
Territet (lac)\r
Tersnaus, spv.\r
Tersnaus, vitg\r
Tesserete, Paese\r
Tesserete, Resega\r
Tesserete, Scuole\r
Tesserete, Al Ponte\r
Tesserete, Campestro\r
Tesserete, Stazione\r
Testa Grigia\r
Tête d'Aï\r
Tête de Savoleyres\r
Tête de Vaux\r
Tête-des-Creuses\r
Tête-du-Tronchey\r
Tête-Noire\r
Teufen AR, Schönenbühl\r
Teufen AR, Vorderhaus\r
Teufen AR, Stofel\r
Teufen AR\r
Teufen AR, Bahnhof\r
Teufen AR, Abzw. Obertobel\r
Teufen AR,Steinegg Feuerwehrh.\r
Teufen AR, Gählern\r
Teufen AR Stofel\r
Teufen ZH, Schulhaus\r
Teufen ZH, Schloss\r
Teufen ZH, Oberteufen\r
Teufen ZH, Unterteufen\r
Teufenthal AG, Bahnhof\r
Teufenthal AG, Moos\r
Teufenthal AG, Oberdorf\r
Teufenthal AG, Schulhaus\r
Teufenthal AG\r
Teuffenthal b. Thun, Halten\r
Teuffenthal b. Thun, Dorf\r
Teuffenthal b.Thun, Burghalten\r
Tgantieni\r
Thal, Löwen\r
Thal, Linde\r
Thal, Wiesentalstrasse\r
Thal, alte Post\r
Thal, Buriet\r
Thalbrücke\r
Thalheim AG, Dorfplatz\r
Thalheim AG, Unterdorf\r
Thalheim an der Thur\r
Thalheim-Altikon, Bahnhof\r
Thalheim-Altikon\r
Thalkirch, Abzw. Camana/Hof\r
Thalkirch, Untercamana\r
Thalkirch, Geissgada\r
Thalkirch, alte Post\r
Thalkirch, Bäch\r
Thalkirch, Turrahus\r
Thalkirch, Abzw. Innercamana\r
Thalkirch, Gassli\r
Thalkirch, Mura\r
Thalwil, Archstrasse\r
Thalwil, In Reben\r
Thalwil, Platte\r
Thalwil, Zehntenstrasse\r
Thalwil, Bahnhof\r
Thalwil, Feldstrasse\r
Thalwil, Rudishaldenstrasse\r
Thalwil, Seehaldenstrasse\r
Thalwil, Schwandelstrasse\r
Thalwil, Pilgerweg\r
Thalwil, Oeggisbüelplatz\r
Thalwil, Mettli\r
Thalwil, Rainstrasse\r
Thalwil, Gewerbestrasse\r
Thalwil, Aegertli\r
Thalwil, Alterszentrum\r
Thalwil\r
Thalwil, Zentrum\r
Thalwil, Böni\r
Thalwil, Trotte\r
Thalwil, Sonnenberg\r
Thalwil, Aubrigstrasse\r
Thalwil, Schützenhaus\r
Thalwil, Mühlebachplatz\r
Thalwil, Ebnet\r
Thalwil (See)\r
Thayngen, Bahnhof\r
Thayngen, Silberberg\r
Thayngen, Hüttenleben\r
Thayngen, Sägi\r
Thayngen\r
Thayngen, Fallenwiese\r
Thayngen, Schule\r
Thayngen, Weierli\r
Theilingen, Post\r
Theilingen, Schwemmrüti\r
Therwil, Känelmatt\r
Therwil, Mooswasen\r
Therwil, Jurastrasse\r
Therwil, Mittlerer Kreis\r
Therwil, Lindenfeld\r
Therwil, Blumenrain\r
Therwil, Birsmatt\r
Therwil, Wilacker\r
Therwil, Löwenkreisel\r
Therwil, Zentrum\r
Thielle, Le Verger\r
Thielle-Wavre\r
Thierachern, unterer Schwand\r
Thierachern, Räbgass\r
Thierachern, mittlerer Schwand\r
Thierachern, Niesenstrasse\r
Thierachern, Oberer Schwand\r
Thierachern, Egg\r
Thierachern, Wegweiser\r
Thierachern, Wahlen\r
Thierachern, Kirche\r
Thierachern, Sandbühl\r
Thierrens, En Tombaz\r
Thierrens, poste\r
Thierrens, La Croix\r
Thierrens, Fontana-Bion\r
Thierrens, Le Planchy\r
Thierrens, Prouty\r
Thierrens, gare routière\r
Thierrens, La Rapaz\r
Thierrens, Carron\r
Thônex, Belle-Terre Pl. Turin\r
Thônex, Belle-Terre Pl. Araire\r
Thônex, Pierre à Bochet\r
Thônex, Belle-Terre école\r
Thônex, Moillesulaz\r
Thônex, Pont-Bochet\r
Thônex, Tronchet\r
Thônex, Sous-Villette\r
Thônex, Jumelles\r
Thônex, Sillons\r
Thônex, Plein-Sud\r
Thônex, Sous-Moulin\r
Thônex, Graveson\r
Thônex, Fossard\r
Thônex, mairie\r
Thônex, Vallard\r
Thônex, Jeandin\r
Thônex, Mon-Idée\r
Thônex, Belle-Idée centre\r
Thônex, Hôpital Trois-Chêne\r
Thônex, Cyprès\r
Thônex, Belle-Idée réception\r
Thônex, Hameau de Villette\r
Thoracker, Schürmatt\r
Thörigen, Post\r
Thörishaus, Sensemattstrasse\r
Thörishaus, Stucki\r
Thörishaus, Camping\r
Thörishaus Dorf, Bahnhof\r
Thörishaus Dorf\r
Thörishaus Station, Bahnhof\r
Thörishaus Station\r
Thun, KKThun\r
Thun, Seepark\r
Thun, Bodmerstrasse\r
Thun, Jungfraustrasse\r
Thun, Zeughaus\r
Thun, Länggasse\r
Thun, Dufourkaserne\r
Thun, Spital\r
Thun, Lauitor\r
Thun, Militärstrasse\r
Thun, Burgerallee\r
Thun, Eigerplatz\r
Thun, Asterweg\r
Thun, Forstweg\r
Thun, Lerchenfeldstrasse\r
Thun, Schorenfriedhof\r
Thun, Feldheimstrasse\r
Thun, Untere Wart\r
Thun, Sternenplatz\r
Thun, Guisanplatz\r
Thun, Westquartier\r
Thun, Strättligenplatz\r
Thun, Sustenstrasse\r
Thun, Wartboden\r
Thun, Schulstrasse\r
Thun, Hauptkaserne\r
Thun, Kleine Allmend\r
Thun, Buchegg\r
Thun, Bubenbergstrasse\r
Thun, Freiestrasse\r
Thun, Mattenstrasse\r
Thun, Schönau\r
Thun, Waisenhausstrasse\r
Thun, Tellstrasse\r
Thun, Zentrum Oberland\r
Thun, Neufeld\r
Thun, Bahnhof\r
Thun, Lauenen\r
Thun, Rebgässli\r
Thun, Seeblick\r
Thun, Bächimatt\r
Thun, Postbrücke\r
Thun, Hofstetten\r
Thun, Bälliz\r
Thun, Dürrenast\r
Thun, Hohmad\r
Thun, Schorenstrasse\r
Thun, Hännisweg\r
Thun, Reitweg/Expo\r
Thun, Rösslimatte\r
Thun\r
Thun, Scherzligen/Schadau\r
Thun, Schorendörfli\r
Thun, Allmendstrasse/Polygon\r
Thun, Allmendhof\r
Thun, Lerchenfeld\r
Thun, Klosestrasse\r
Thun, Pfarrhausweg\r
Thun, Progymatte\r
Thun, Talacker\r
Thun, Langestrasse\r
Thun, Arena Thun\r
Thun, Zollhaus\r
Thun, Burgerallmend\r
Thun, Martinstrasse\r
Thun, Strandbad\r
Thun, Marktgasse\r
Thun, Waldeck\r
Thun, Thunerhof\r
Thun, Freienhof\r
Thun, Pfaffenbühl\r
Thun, Berntor\r
Thun (See)\r
Thundorf, Friedbergstrasse\r
Thundorf, Ildbach\r
Thundorf, Aufhofen\r
Thundorf, Brückenwaage\r
Thunstetten, Schloss\r
Thunstetten, Schorenmatte\r
Thunstetten, Wischberg\r
Thurnen, Bahnhof\r
Thurnen\r
Thürnen, Dorf\r
Thürnen, Langmatt\r
Thürnen, Grabacker\r
Thusis, Schützenweg\r
Thusis, Altersheim\r
Thusis, Dorf\r
Thusis, Oberplatz\r
Thusis, Ruvria\r
Thusis, Bahnhof\r
Thusis\r
Thusis, Caznerwiesen\r
Thyon\r
Thyon, Télémixte amont\r
Thyon 2000\r
Tiefenbach (Furka)\r
Tiefenbach DFB\r
Tiefencastel, vischnanca\r
Tiefencastel\r
Tiefencastel, staziun\r
Tignousa\r
Tinizong, Curtinatsch\r
Tinizong, Tga Communala\r
Tinizong, Vardaval\r
Tinizong, Cadras\r
Tirano\r
Titlis\r
Titlis (Rotstöckli)\r
Titterten, March\r
Titterten, Gemeindehaus\r
Tobel-Affeltrangen, Bahnhof\r
Tobel-Affeltrangen\r
Toffen, Gemeindeverwaltung\r
Toffen\r
Toffen, Breitlohn\r
Toffen, Bahnhof\r
Tolochenaz, Les Noyers\r
Tolochenaz, Les Saux\r
Tolochenaz, Le Portail\r
Tolochenaz,cimetière de Morges\r
Tolochenaz, Molliau\r
Tolochenaz, La Grillette\r
Tolochenaz, La Plantaz\r
Tolochenaz, pl. Audrey Hepburn\r
Törbel, Oberbrunnen\r
Törbel, Halmern\r
Törbel, Leischa\r
Törbel, Bina\r
Törbel, Unterflüh\r
Törbel, Furenmatten\r
Törbel, Eischbiel\r
Törbel, Site\r
Törbel, Oberdorf\r
Törbel, Ueberfeld\r
Törbel, Abzw. Zeneggen\r
Törbel, Burgen\r
Törbel, Zen Springen\r
Törbel, Biela\r
Törbel, Kirche\r
Törbel, Brunnen\r
Törbel, Chämbricheer\r
Törbel, Furen\r
Törbel, Bachtoli\r
Törbel, Skilift Z Niwwu\r
Törbel, Treichelboden\r
Torgon, douane\r
Torgon, Le Chêne\r
Torgon, La Cheurgne\r
Torgon, Planchamp\r
Torgon, village\r
Torgon, Les Foyards\r
Torgon, Bonne-Année\r
Torgon, La Lanche\r
Torgon, Sur Mayen\r
Torgon, La Jorette\r
Torny-le-Grand, village\r
Torre, alla Baracca\r
Torre, Paese\r
Torre, Portera\r
Torrentalp\r
Torricella, Chiesa\r
Torricella, Naravazz\r
Tortengo\r
Tortin (Col-des-Gentianes)\r
Tortin (Siviez)\r
Tössegg\r
Totalp Wasserscheide\r
Totalpsee\r
Toveyre\r
Trabanta\r
Trachselwald\r
Trachslau, alte Post\r
Trachslau, altes Schulhaus\r
Trachslau, alte Säge\r
Trachslau, Kirche\r
Tracouet (Haute-Nendaz)\r
Tracui d'en Bas\r
Trais Fluors\r
Tramelan, Chalet\r
Tramelan, Dessous\r
Tramelan\r
Tramelan, place du Marché\r
Tramelan, gare\r
Tramelan, garage CJ\r
Tramelan-Chalet\r
Tramelan-Dessous\r
Trans, Acla\r
Trans, Ramons\r
Trans, Dorf\r
Trans, Vegs\r
Trasadingen\r
Trasadingen, Langwis\r
Trasadingen, Dorf\r
Travers, Verger\r
Travers\r
Traversa (Marolta)\r
Treib\r
Treib (Talstation)\r
Treis Palas\r
Trélex\r
Trélex dépôt\r
Tremona, Gurnaga\r
Tremona, Teia\r
Trevano, Centro Studi\r
Trey, Les Folosses\r
Trey, Planche-à-Failly\r
Trey, village\r
Treycovagnes, village\r
Treycovagnes, Champ-Murat\r
Treycovagnes, Châtelard\r
Treytorrens, Les Molliettes\r
Treytorrens (Payerne), Nord\r
Treytorrens (Payerne), village\r
Treyvaux, Les Vernes\r
Treyvaux, Le Chêne\r
Treyvaux, village\r
Treyvaux, Rafour\r
Treyvaux, Le Pratzey\r
Treyvaux, Les Chaucisses\r
Triboltingen, Dorf\r
Triboltingen\r
Tribschen\r
Triel\r
Triengen, Grund\r
Triengen, Grossfeld\r
Triengen, Gisler\r
Triengen, Dorf\r
Triengen, Forum\r
Trient, Le Peuty\r
Trient, Betty\r
Trient, village\r
Trient, rte de Litroz\r
Trient, camping\r
Trient, Le Plan\r
Trient, bif. rte Finhaut\r
Triesen, Bächlegatter\r
Triesen, Meierhof\r
Triesen, Feldstrasse\r
Triesen, Langgasse\r
Triesen, Vaschiel\r
Triesen, Sonnenkreisel\r
Triesen, Alte Post\r
Triesen, Gartnetschhof\r
Triesen, Maschlina\r
Triesen, Matschils\r
Triesen, Vanetscha\r
Triesen, Schule\r
Triesen, Messina\r
Triesen, Argweg\r
Triesen, Säga\r
Triesen, Poska\r
Triesenberg, Rütelti\r
Triesenberg, Obergufer\r
Triesenberg, Täscherloch\r
Triesenberg, Sennwis\r
Triesenberg, Abzw. Masescha\r
Triesenberg, Dorfzentrum\r
Triesenberg, Rizlina\r
Triesenberg, Almeina\r
Triesenberg, Steinort\r
Triesenberg, Egga\r
Triesenberg, Tristel\r
Triesenberg, Guferwald\r
Triesenberg, Böda\r
Triesenberg, Eichholz\r
Triesenberg, Leitawis\r
Triesenberg, Balischguad\r
Triesenberg, Bühel\r
Triesenberg, Litzi\r
Triesenberg, Güetli\r
Triesenberg, Halda\r
Triesenberg, Chalberrüti\r
Triesenberg, Matteltiwald\r
Triesenberg, Gufer\r
Triesenberg, Sütigerwis\r
Triesenberg, Samina\r
Trift\r
Trimbach, Schilla\r
Trimbach\r
Trimbach, Rankwog\r
Trimbach, Hagmatt\r
Trimbach, Grossfeld\r
Trimbach, Eisenbahn\r
Trimbach, Rankbrünneli\r
Trimbach, Fähre\r
Trimbach, Leinfeld\r
Trimbach, Industrie\r
Trimbach, Brückenstrasse\r
Trimbach, Baselbieter\r
Trimbach, Rössli\r
Trimbach, Zentrum\r
Trimmis, Churweg\r
Trimmis, Gargällis\r
Trimmis, Alt Strass\r
Trimmis, Saliet\r
Trimmis, Platz\r
Trimmis, Schulhaus\r
Trimmis, Cholplatzweg\r
Trimstein, Dorf\r
Trimstein, Schule\r
Trimstein, Eichi\r
Trin, Porclis\r
Trin, Platta\r
Trin, Dorf\r
Trin, Quadris\r
Trin, Mulin\r
Trin\r
Trin, Portalavanda\r
Trin Mulin, Crestasee\r
Tripon, bisse du Torrent-Neuf\r
Tristelen\r
Trockener Steg\r
Trogen, Schopfacker\r
Trogen, Lindenbüel\r
Trogen, Hüttschwendi\r
Trogen\r
Trogen, Sandegg\r
Trogen, Bleiche\r
Trogen, Bahnhof\r
Trogen, Oberstall\r
Trogen, Eugst\r
Trogen, Landsgemeindeplatz\r
Trogne, d'Enhaut\r
Trogne, centre\r
Troinex, Rivolette\r
Troinex, ville\r
Troinex, Les Crêts\r
Troinex, Saussac\r
Troinex, Pont-de-Drize\r
Troinex, mairie\r
Trois-Lacs (camping)\r
Troistorrents, village\r
Troistorrents, Propéraz\r
Troistorrents, rte du Stade\r
Troistorrents, Lévaux\r
Troistorrents, Rte du Pas\r
Troistorrents, Croix-du-Nant\r
Troistorrents, Rt de la Crotaz\r
Troistorrents, Perraya\r
Troistorrents, Vers-Encier\r
Troistorrents, La Tine\r
Troistorrents, Les Neys\r
Troistorrents, Es-Cortaz\r
Troistorrents, St-André\r
Troistorrents, gare\r
Troistorrents, Bonnares\r
Troistorrents, Ch. des Bains\r
Troistorrents, Collaire\r
Troistorrents, rte des Neyres\r
Troistorrents, Thiésaz\r
Troistorrents\r
Trub, Hüseren\r
Trub, Grundsäge\r
Trub, Mülebachbrücke\r
Trub, Furenbrücke\r
Trub, Längengrund Säge\r
Trub, Dorf\r
Trub, Löwenplatz\r
Trub, Sägegasse\r
Trub, Weierhus Stöckli\r
Trub, Twärenbrücke\r
Trub, Ried\r
Trub, Mülihof\r
Trub, Miescheli\r
Trub, Loos\r
Trub, Unterfeld\r
Trübbach, Oberstufenzentrum\r
Trübbach, Seidenbaum\r
Trübbach, Fährhütte\r
Trübbach, Dorf\r
Trübbach, Dornau\r
Trubschachen, Hasenlee\r
Trubschachen\r
Trubschachen, Bahnhofstrasse\r
Trubschachen, Teufenbachsteg\r
Trubschachen, Oelibrücke\r
Trubschachen, Bahnhof\r
Trübsee\r
Trübsee (Jochpass)\r
Trübsee (Talst. Kabinenb.)\r
Trüllikon, Dorf\r
Trüllikon, Kindergarten\r
Trümmelbachfälle\r
Trun, staziun\r
Trun, Darvella\r
Trun, Flutginas\r
Trun, S. Catrina barriera\r
Trun, casa da scola\r
Trun, Campliun\r
Trun\r
Trun, Lumneins\r
Trun, Via Casa S. Martin\r
Trun, Lumneins Dado\r
Truttikon\r
Tsapé\r
Tschamerie\r
Tschamut, Via Alpsu\r
Tschamut-Selva\r
Tschäppel\r
Tschappina, Untertschappina\r
Tschappina, Glaspass\r
Tschappina, Pramal\r
Tschappina, Clesalenz\r
Tschappina, Börtli\r
Tschappina, Oberbutzweg\r
Tschappina, Abzw. Bruneir\r
Tschentenalp\r
Tscheppach, Post\r
Tscherlach, Dorf\r
Tscherlach, Steibünt\r
Tschiertschen, Dorf\r
Tschiertschen (Talstation)\r
Tschierv, plaz\r
Tschierv, Orasom\r
Tschierv, Süsom Tschierv\r
Tschierv, Biosfera\r
Tschierv, Talstation Minschuns\r
Tschierv, spv. Minschuns\r
Tschingel o.Gunt.,Förstner-Keh\r
Tschingel ob Gunten, Unterdorf\r
Tschingel ob Gunten, Dorf\r
Tschingel ob Gunten, Bösenzelg\r
Tschlin, cumün\r
Tschlin, Davo San Jon\r
Tschlin, Terza Storta\r
Tschugg, Mullen\r
Tschugg, Klinik\r
Tschugg, Unterdorf\r
Tschugg, Matte\r
Tschuggen (Arosa)\r
Tschuggen (Innerarosa)\r
Tübach, Mühlhof\r
Tübach, Schulstrasse\r
Tübach, Tennishalle\r
Tübach, Waldegg\r
Tübach, Sonne\r
Tuggen, Egg\r
Tuggen, Rüschenzopf\r
Tuggen, Rüteli\r
Tuggen, Mühlenen\r
Tuggen, Obstlager\r
Tuggen, Schlüsselweg\r
Tuggen, Kesmalon\r
Tuggen, Kapellhof\r
Tuggen, Linthhof\r
Tuggen, Grynau\r
Tuggen, Holeneich\r
Tuggen, Gallusplatz\r
Tuilerie\r
Tuileries-de-Grandson, Kiosque\r
Tumegl/Tomils, Rofna\r
Tumegl/Tomils, Ortenstein\r
Tumegl/Tomils, Mühle\r
Tumegl/Tomils, Abzw. Hof Moos\r
Tumegl/Tomils, Curschiglias\r
Turbach, Schwenterli\r
Turbach, Eigenmatte\r
Turbach, Rotengraben\r
Turbach, Höhe\r
Turbach, Relli\r
Turbach, Heimweid\r
Turbach, Post\r
Turbach, Pfündli\r
Turbach, Fängli\r
Turbach, Egg\r
Turbenthal, Oberhofen\r
Turbenthal, Freckmünd\r
Turbenthal, Tablat\r
Turbenthal, Girenbad\r
Turbenthal, Fridtal\r
Turbenthal, Kehlhof\r
Turbenthal, Usserdorfweg\r
Turbenthal, Gosswil\r
Turbenthal, Hutzikon\r
Turbenthal, Neubrunn\r
Turbenthal, Schloss\r
Turbenthal, Seelmatten\r
Turbenthal,Strandbad Bichelsee\r
Turbenthal\r
Turbenthal, Bahnhof\r
Turbenthal, Kellersacker\r
Turbenthal, Abzw. Auli\r
Turgi\r
Turgi, Sitten\r
Turgi, Gehling\r
Turgi, Bahnhof\r
Turgi, Wil\r
Turren\r
Turtmann, Abzw. Bahnhof\r
Turtmann, Bahnhof\r
Turtmann, Bini\r
Turtmann, Soleil\r
Turtmann\r
Turtmann, Seilbahn LTUO\r
Turtmann (Talstation)\r
Tüscherz, Dorfweg\r
Tüscherz, Alfermée\r
Tüscherz\r
Tüscherz (Schiff)\r
Tusinge\r
Twann, Bahnhof\r
Twann\r
Twann (Schiff)\r
Udligenswil, Neuheim\r
Udligenswil, Götzentalstrasse\r
Udligenswil, Dreiangel\r
Udligenswil, Schützenmatt\r
Udligenswil, Frohsinn\r
Udligenswil, alte Post\r
Ueberstorf, Hinterdorf\r
Ueberstorf, Albligenstrasse\r
Ueberstorf, Dorfstrasse\r
Ueberstorf, Niedermettlen\r
Ueberstorf, Abzw. Steinhaus\r
Ueberstorf, Abzw. Grossried\r
Uebeschi, Neurütti\r
Uebeschi, Dürrenbühl\r
Uebeschi, Kärselen\r
Uebeschi, Weiersbühl\r
Uebeschi, Neubau\r
Uebeschi, Dorf\r
Ueken, Unterdorf\r
Ueken, Gemeindehaus\r
Ueken, Zeihen Abzw.\r
Uerikon, Rietlirain\r
Uerikon, Ritterhaus\r
Uerikon, Töbeli\r
Uerikon, Moritzberg\r
Uerikon, Gsteig\r
Uerikon, Bahnhof\r
Uerikon\r
Uerikon (See)\r
Uerkheim, Unterdorf\r
Uerkheim, Säge\r
Uerkheim, Tannacker\r
Uerkheim, Kirche\r
Uerkheim, Abzw. Neudorf\r
Uerkheim, Post\r
Uerkheim, Schweizermatten\r
Uerkheim, Oberdorf\r
Uerzlikon, Weid\r
Uerzlikon, Dorf\r
Uerzlikon, Kappelerstrasse\r
Uesslingen, Thurbrücke\r
Uesslingen, Trüfelbach\r
Uesslingen, Zollhausweg\r
Uesslingen, Berlingerhof\r
Uetendorf, Schürhus\r
Uetendorf, Jungfraustrasse\r
Uetendorf, Bergschulhaus\r
Uetendorf, Kirche\r
Uetendorf, Thunstrasse\r
Uetendorf, Uttigenstrasse\r
Uetendorf, Allmendstrasse\r
Uetendorf, Walalpweg\r
Uetendorf, Hofmättli\r
Uetendorf, Stiftung U.-Berg\r
Uetendorf, Fliederweg\r
Uetendorf, TUS\r
Uetendorf, Buchshalte\r
Uetendorf\r
Uetendorf, Gibliz\r
Uetendorf, Bahnhof\r
Uetendorf, Mehrzweckhalle Bach\r
Uetendorf, Ischlag\r
Uetendorf, Berg\r
Uetendorf Allmend\r
Uetikon\r
Uetikon am See, Bergheim\r
Uetikon am See, Bahnhof\r
Uetikon am See, Talstrasse\r
Uetikon am See, Tramstrasse\r
Uetikon am See, Brandrain\r
Uetikon am See, Gemeindehaus\r
Uetikon am See, Oergelacher\r
Uetikon am See, Rundi\r
Uetikon am See, Kleindorf\r
Uetikon am See, Forbüelstrasse\r
Uetikon am See, Stötzli\r
Uetikon am See,Binzigerstrasse\r
Uetikon am See, Grossdorf\r
Uetikon am See (See)\r
Uetliberg\r
Uetliburg SG, Birkenhalde\r
Uetliburg SG, Berg-Sion-Str.\r
Uetliburg SG, Giegen\r
Uetliburg SG, Säge\r
Uetliburg SG, Ottenhofen\r
Uetliburg SG, Brunnacker\r
Uettligen, Dorf\r
Uettligen, Schüpfenried\r
Uettligen, Post\r
Uettligen, Abzw. Möriswil\r
Uettligen, Oberdettigen\r
Uettligen, Schule\r
Uezwil, im Letten\r
Uezwil, Waage\r
Uffikon, Kantonsstrasse\r
Ufhusen, Käserei Dorf\r
Ufhusen, Ruefswil\r
Ufhusen, Zollhus\r
Uhwiesen, Rebhof\r
Uhwiesen, Wassergasse\r
Uhwiesen, Unterdorf\r
Uhwiesen, Kapelle\r
Uitikon, Dorf\r
Uitikon, Gläseren\r
Uitikon, Wängi\r
Uitikon, Schlössli\r
Uitikon, Roracher\r
Uitikon, Halde\r
Uitikon Waldegg, Bahnhof\r
Uitikon Waldegg\r
Ulisbach, Traube\r
Ulisbach, Hegis\r
Ulmiz FR, Ausserdorf\r
Ulmiz FR, Dorf\r
Ulrichen, Abzw. Nufenen\r
Ulrichen\r
Ulrichen, Kittbrücke\r
Ulrichen, Kirche\r
Ulrichen, Bahnhof\r
Umbrail, Schweizer Zoll\r
Umiken, Abzw. Riniken\r
Umiken, Kirche\r
Umiken, Oberdorf\r
Umiken, Mühlehalde\r
Under Empächli\r
Underläger (Alp Grindel)\r
Undervelier, Forges\r
Undervelier, Halle des fêtes\r
Undervelier, poste\r
Undervelier, Corfontaine\r
Union-Prilly\r
Unter dem Birg (Talstation)\r
Unterägeri, Zimmel\r
Unterägeri, Buechli\r
Unterägeri, Klinik Adelheid\r
Unterägeri, Zentrum\r
Unterägeri, Chlösterli\r
Unterägeri, Seefeld\r
Unterägeri, Spinnerei\r
Unterägeri (See)\r
Unterbäch (Bergstation)\r
Unterbäch (Talstation Brand)\r
Unterbach BE, Flugplatz\r
Unterbach BE, Tremelmad\r
Unterbach BE, Unterheid\r
Unterbach BE, Waldey\r
Unterbach BE, Unterheidstrasse\r
Unterbach BE, Schulhaus\r
Unterbach BE, Rollfeld\r
Unterbach BE, Rössli\r
Unterbach BE, Stägmad\r
Unterbach BE, Garage Egger\r
Unterbach BE, Trutzenmeder\r
Unterbach BE, Guntleren\r
Untereggen, Vorderhof\r
Untereggen, Gemeindehaus\r
Untereggen, Mittlerhof\r
Untereggen, Vogelherd\r
Untereggen, Hinterhof\r
Unterems\r
Unterendingen, Dorf\r
Unterengstringen, Eckstein\r
Unterengstringen, Sennenbüel\r
Unterengstringen, Langacher\r
Unterengstringen, Aegelsee\r
Unterengstringen, Langwisen\r
Unterengstringen, Sennenbüel N\r
Unterentfelden, Post\r
Unterentfelden, Am Distelberg\r
Unterentfelden, Oberdorf\r
Unterentfelden Oberdorf\r
Unterentfelden Post\r
Unterhörstetten, Dorf\r
Unteriberg, Waag\r
Unteriberg, Jessenenbrücke\r
Unteriberg, Twingi\r
Unteriberg, hint.Schmalzgruben\r
Unteriberg, Nidlau\r
Unteriberg, Boden\r
Unteriberg, Herti\r
Unteriberg, vord.Schmalzgruben\r
Unteriberg, Guggelstrasse\r
Unteriberg Weglosen (Talst.)\r
Unterkulm, Bahnhof\r
Unterkulm\r
Unterkulm Nord, Bahnhof\r
Unterkulm Nord\r
Unterlangenegg, Kreuzweg\r
Unterlangenegg, Hänni\r
Unterlangenegg, Aebnit\r
Unterlunkhofen, Gemeindehaus\r
Unterlunkhofen, Breitenäcker\r
Unterlunkhofen, Mühlegg\r
Untermatt Talstation\r
Unterohringen, Wisental\r
Unterohringen, Dorf\r
Unterramsern, Post\r
Unterrechstein, Heilbad\r
Unterschächen, Stutz\r
Unterschächen, Frittertal\r
Unterschächen, Untere Balm\r
Unterschächen, Dorf\r
Unterschächen, Hältikehr\r
Unterschächen, Äbnet\r
Unterschächen, Ritzen\r
Unterschächen, Lehnacher\r
Unterschächen, Ribi\r
Unterseen, Birmse\r
Unterseen, Schiessstand Lehn\r
Unterseen, Neuhaus\r
Unterseen, Camping Jungfrau\r
Unterseen, Stadtfeld\r
Unterseen, Breite\r
Unterseen, St. Niklausen\r
Unterseen, Scheidgasse\r
Unterseen, Manor Farm\r
Unterseen, Gelbenbrunnen\r
Unterseen, Schulhaus Steindler\r
Unterseen, Friedhof\r
Unterseen, Gartenstrasse\r
Unterseen, Dorf\r
Unterseen, am Lauener\r
Unterseen, Ruchenbühl\r
Unterseen, Stedtlizentrum\r
Unterseen, Wellenacher\r
Unterseen, Spital Interlaken\r
Unterseen, Widimatt\r
Unterseen, Luegibrüggli\r
Unterseen, Stadthausplatz\r
Unterseen, Fussweg Spital\r
Unterseen, Seestrasse\r
Unterseen, Beatenbergstrasse\r
Unterseen, Hohmüedig\r
Untersiggenthal, Hölzli\r
Untersiggenthal, Hardacker\r
Untersiggenthal, Spiracher\r
Untersiggenthal, Schönegg\r
Untersiggenthal, Gemeindehaus\r
Untersiggenthal, Mühleweg\r
Unterstammheim, Adler\r
Unterstammheim, Neubr.-Ulmerh.\r
Unterterzen, Friedberg\r
Unterterzen\r
Unterterzen, Bahnhof\r
Unterterzen (See)\r
Unterterzen (Talstation)\r
Untervaz, Bahnhof\r
Untervaz, Dorf\r
Untervaz, Holcim\r
Untervaz, Gaidla\r
Untervaz, Kirchgasse\r
Untervaz, Giesacker\r
Untervaz-Trimmis\r
Unterwasser, Wäldli\r
Unterwasser, Dorf\r
Unterwasser, Chäserrugg Bahn\r
Unterwasser, Stofel\r
Unterwasser Chäserrugg Bahn\r
Unterzollikofen\r
Unterzollikofen, Bahnhof\r
Unterzollikofen, Reichenbach\r
Uors, vitg\r
Urdenfürggli (Bergstation)\r
Urdenfürggli (Hörnligrat)\r
Urdorf, Neumatt\r
Urdorf, Sonne\r
Urdorf, Rainweg\r
Urdorf, Spitzacker\r
Urdorf, Urdorf-Nord\r
Urdorf, Niederurdorf\r
Urdorf, Kantiallee\r
Urdorf, Schlierenstrasse\r
Urdorf, Feldegg\r
Urdorf, Neumattstrasse\r
Urdorf, Heinrich-Stutz-Strasse\r
Urdorf, Uitikonerstrasse\r
Urdorf, Oberurdorf\r
Urdorf\r
Urdorf Weihermatt, Bahnhof\r
Urdorf Weihermatt\r
Urigen\r
Urmein, Cazeschg\r
Urmein, Dorf\r
Urmein, Baltermeins\r
Urmein, Rünggli\r
Urmein, Coms\r
Urnäsch, Bahnhof\r
Urnäsch, Steinfluh\r
Urnäsch, Sonne Thal\r
Urnäsch, Kräzerli\r
Urnäsch, Frohsinn\r
Urnäsch, Hüsli\r
Urnäsch, Anker\r
Urnäsch, Hofbach\r
Urnäsch, Dürrenbach\r
Urnäsch\r
Urnäsch, Kleinwald\r
Urnäsch, Rossfall\r
Urnerboden, Vorfrutt\r
Urnerboden, Dorf\r
Urnerboden, Klus\r
Urnerboden, Sonne\r
Urnerboden, Argseeli\r
Ursenbach, Oberdorf\r
Ursenbach, Hofen\r
Ursenbach, Hirsern\r
Ursenbach, Breiten\r
Ursenbach, Unterdorf\r
Ursenbach, Post\r
Ursins, Le Battoir\r
Ursins, Grange-des-Bois\r
Ursy, La Scie\r
Ursy, Derrière la Grange\r
Ursy, village\r
Ursy, Au Clos\r
Urtenen, Schmiedgässli\r
Urtenen\r
Usser Isch (Bergstation)\r
Usser Isch (Talst. Jakobshorn)\r
Uster, Zentralstrasse\r
Uster, Meieracher\r
Uster, Dammstrasse\r
Uster, Buchholz\r
Uster, Himmelriich\r
Uster, Linde\r
Uster, Stadtpark\r
Uster, Turicum\r
Uster, Wil\r
Uster, Ackerstrasse\r
Uster, Sonnenberg\r
Uster, Seeweg\r
Uster, Apothekerstrasse\r
Uster, Jungholz\r
Uster, Nossikon\r
Uster, Talacker\r
Uster, Loren-Allee\r
Uster, Pfannenstielstrasse\r
Uster, Krämeracker\r
Uster, Burgstrasse\r
Uster, Krone\r
Uster, Herracher\r
Uster, Gschwaderstrasse\r
Uster, Strick\r
Uster, Weidli\r
Uster, Wageren\r
Uster, Talweg\r
Uster, Reithalle\r
Uster, Schlyffi\r
Uster, Burgreben\r
Uster, Florastrasse\r
Uster, Oberuster\r
Uster, Bahnhof\r
Uster, Stadthaus\r
Uster, Wildsbergstrasse\r
Uster, im Hölzli\r
Uster, Koppach\r
Uster, Loren\r
Uster, Oberlandstrasse\r
Uster, Haberweid\r
Uster, Bordacker\r
Uster, Gschwader\r
Uster, Brandschenke\r
Uster\r
Uster, Spital\r
Uster, Sportanlage\r
Uster, Bildungszentrum\r
Uster, Jugendhaus\r
Uster, Neufuhr\r
Uster, Hegetsberg\r
Uster, Niederuster\r
Uster, See\r
Uster (See)\r
Uttigen\r
Uttwil\r
Uttwil (See)\r
Utzenstorf\r
Utzenstorf, Mösli\r
Utzenstorf, Koppigenstrasse\r
Utzenstorf, Schloss Landshut\r
Utzenstorf, Poststrasse\r
Utzigen, Aebnit\r
Utzigen, Dorf\r
Utzigen, Wohn- und Pflegeheim\r
Uvrier, centre commercial\r
Uvrier, Lienne\r
Uvrier, Ecole\r
Uvrier, sud\r
Uvrier, Diva\r
Uvrier, Le Pont\r
Uznach, St. Josef\r
Uznach, Rotfarb\r
Uznach, Tor\r
Uznach, Burgerfeld\r
Uznach, Uznabergstrasse\r
Uznach, Spital Ost\r
Uznach, Sonnenhof\r
Uznach, Bahnhof\r
Uznach, Neumühle\r
Uznach, Kreuzkirche\r
Uznach\r
Uznach, Spital West\r
Uznach, St. Otmarsberg\r
Uznach, Speerblick\r
Uzwil, Gemeindehaus\r
Uzwil, Bahnhof\r
Uzwil, Mühlehof\r
Uzwil, Coop\r
Uzwil, Waldhof\r
Uzwil, Sonnenbergstrasse\r
Uzwil\r
Uzwil, Gupfenstrasse\r
Uzwil, Schöntal\r
Vacallo, Cimitero\r
Vacallo, Letra\r
Vacallo, Scuole\r
Vacallo, Ponte Picio\r
Vacallo, Via Spinee\r
Vacallo, S. Simone\r
Vacallo, Sovernigo\r
Vacallo, Piazza\r
Vacallo, Casa Materna\r
Vacallo, Vignola\r
Vadura, Abzw. Bläs\r
Vadura, Ragol\r
Vadura, Dorf\r
Vadura, Mapragg\r
Vaduz, Werkbetrieb\r
Vaduz, Schwefel\r
Vaduz, Post\r
Vaduz, Mitteldorf\r
Vaduz, Schalunstrasse\r
Vaduz, Am Schrägen Weg\r
Vaduz, Bartlegrosch\r
Vaduz, Freibad\r
Vaduz, Rütti\r
Vaduz, Quäderle\r
Vaduz, Alte Rheinbrücke\r
Vaduz, Rätikonstrasse\r
Vaduz, Ebenholz/Universität\r
Vaduz, Mühleholz\r
Vaduz, Lettstrasse\r
Vaduz, Rheinparkstadion\r
Vaduz, Gemeindesaal\r
Vaduz, Technopark\r
Vaduz, Rotes Haus\r
Vaduz, Schulzentrum\r
Vaduz, Hofkellerei\r
Vaduz, Spital\r
Vaduz, Wuhrstrasse\r
Vaduz, Spörry\r
Vaduz, Schlössle\r
Vaduz, Bannholzstr.\r
Vaduz, Altenbach\r
Vaduz, Jägerweg\r
Vaduz, Auring\r
Vaduz, Kirchstrasse\r
Vaduz, Lochgass\r
Vaduz, Egertastrasse\r
Vaduz, Rüfestrasse\r
Vaduz, Städtle\r
Vaduz, Au\r
Vaduzer Täli (Malbun)\r
Vaglio, Paese\r
Vaglio, Piccolo Vaglio\r
Vairano, Paese\r
Vairano, Bivio per S. Nazzaro\r
Val Segnas\r
Val Sinestra, plazza da parcar\r
Val Sinestra, hotel\r
Val Val\r
Val-d'Illiez, Ch. de Pommat\r
Val-d'Illiez, Rte des Crosets\r
Val-d'Illiez, Martenoy\r
Val-d'Illiez, La Cour\r
Val-d'Illiez, Les Grantys\r
Val-d'Illiez, Les Forneys\r
Val-d'Illiez, bif. Champoussin\r
Val-d'Illiez, Les Chables\r
Val-d'Illiez, Miévy\r
Val-d'Illiez, Route de Naula\r
Val-d'Illiez\r
Val-d'Illiez, Les Coteaux\r
Val-d'Illiez, Frâchette\r
Val-d'Illiez, gare\r
Val-d'Illiez,Ch. des Marmottes\r
Val-d'Illiez, Les Lisats\r
Val-d'Illiez, Les Ayers\r
Valangin, La Borcarderie\r
Valangin, La Cure\r
Valangin, centre\r
Valbella, Sartons\r
Valbella, Canols\r
Valbella, Seehof\r
Valbella, Posthotel\r
Valbella, Dorf\r
Valbella, Skilift/Kirche\r
Valbella Stätz (Stätzerhorn)\r
Valbella Stätz (Stätzertäli)\r
Valchava, cumün\r
Valchava, spv. Plazzaraun\r
Valendas, Dorf\r
Valendas, Carrera\r
Valendas, Carstulien\r
Valendas, Imschlacht\r
Valendas, Brün Dorf\r
Valendas, Abzw. Brün\r
Valendas-Sagogn, Bahnhof\r
Valendas-Sagogn\r
Valens, Sandgrueb\r
Valens, Duonig\r
Valens, Post\r
Valens, Klinik\r
Valeyres-s.-M., centre sportif\r
Valeyres-s.-Montagny, village\r
Valeyres-sous-Montagny\r
Valeyres-sous-Rances, rest.\r
Valeyres-sous-Rances, croisée\r
Valeyres-sous-Ursins, village\r
Vallamand\r
Vallamand-Dessous, Garinettes\r
Vallamand-Dessous, village\r
Vallamand-Dessus, cimetière\r
Vallamand-Dessus, pl. village\r
Vallon, Musée romain\r
Vallon, village\r
Vallorbe, rue de Lausanne\r
Vallorbe, Les Baraquettes\r
Vallorbe, grottes\r
Vallorbe, Eterpaz\r
Vallorbe, collège\r
Vallorbe, La Promenade\r
Vallorbe, Les Revinnoz\r
Vallorbe, La Raz\r
Vallorbe, gare\r
Vallorbe, Trésit\r
Vallorbe, Les Jurats\r
Vallorbe, poste\r
Vallorbe, Mont d'Orzeires\r
Vallorbe, Toscane\r
Vallorbe, place de la Liberté\r
Vallorbe, Le Day\r
Vallorbe, Le Creux\r
Vallorbe, Les Pontets\r
Vallorbe\r
Vallun Chafuol P3\r
Valmont\r
Vals, Post\r
Vals, Vallé\r
Vals, Therme\r
Vals, Zervreila\r
Vals, Ronastäg\r
Vals, Camp\r
Vals, Parkplatz Bergbahnen\r
Vals, Peilerrank\r
Vals (Talstation)\r
Valschameala\r
Valzeina, Engisch Gada\r
Valzeina, Ammengaden\r
Valzeina, Boden\r
Valzeina, Kirche\r
Valzeina, Geissgaden\r
Van-d'en-Haut, la Croix\r
Van-d'en-Haut, camping\r
Vandoeuvres, Centre communal\r
Vandoeuvres, Mazettes\r
Vandoeuvres, La Blonde\r
Vandoeuvres, La Blanche\r
Vandoeuvres, De-Westerweller\r
Vandoeuvres, Sous Pressy\r
Vandoeuvres, Planta\r
Vandoeuvres, Loveré\r
Vandoeuvres, Les Bougeries\r
Vandoeuvres, Chougny\r
Vandoeuvres, Cocuaz\r
Vandoeuvres, Crête\r
Vandoeuvres, village\r
Varen, Deliry\r
Varen, Frayen\r
Varenzo, Bivio\r
Varenzo, Paese\r
Varozzei\r
Vasön, Tschenner\r
Vasön, Dorf\r
Vättis, Dorf\r
Vattiz, Surval\r
Vattiz, vitg\r
Vauderens, gare\r
Vauderens, Route d'Ursy\r
Vauderens\r
Vauffelin, Dynamic Test Center\r
Vauffelin, Champs-Verlets\r
Vauffelin, Route de Plagne\r
Vauffelin, Les Oeuches\r
Vauffelin, poste\r
Vauffelin, bif. sur Plagne\r
Vaugondry, bif.\r
Vaulion, Les Rippes\r
Vaulion, centre\r
Vaulion, collège\r
Vaulion, Le Moulin\r
Vaulion, Nidau\r
Vaulion, Sur la Creusaz\r
Vaulion, poste\r
Vaulruz, Champ-Paccot\r
Vaulruz, Croix-Verte\r
Vaulruz, village\r
Vaulruz-Nord, gare\r
Vaulruz-Sud\r
Vaumarcus, milieu du village\r
Vaumarcus, bas du village\r
Vaumarcus, giratoire\r
Vaumarcus, haut du village\r
Vaumarcus, gare\r
Vaumarcus débarcadère\r
Vaux-sur-Morges, Bugnon\r
Vaux-sur-Morges, Petit-Vaux\r
Vaux-sur-Morges, village\r
Vaz/Obervaz, Lain\r
Vaz/Obervaz, Zorten\r
Vaz/Obervaz, Muldain\r
Vaz/Obervaz, Solis\r
Vaz/Obervaz, Tranter Moira\r
Vechigen\r
Veglia di Peccia\r
Vella, posta\r
Vella, Sumsiaras\r
Vella (pendicularas)\r
Vellano\r
Veltheim AG, Au\r
Veltheim AG, Vorerli\r
Veltheim AG, Kirchgemeindehaus\r
Veltheim AG, Unterdorf\r
Veltheim AG, Skin\r
Veltheim AG, Bären\r
Veltheim AG, Wildenstein\r
Vendlincourt\r
Vendlincourt, bif. gare\r
Vens, Centre\r
Vens (Conthey)\r
Venthône, village\r
Venthône, Rétana\r
Venthône, Anchettes\r
Venthône\r
Verbier, La Bergerie\r
Verbier, Centre Sportif\r
Verbier, Pleyeuse\r
Verbier, Camargue\r
Verbier, Planalui\r
Verbier, Médran\r
Verbier, Sonalon\r
Verbier, Hameau\r
Verbier, Parc Ermitage\r
Verbier, Esserts Milieu\r
Verbier, la Cot\r
Verbier, La Velle\r
Verbier, Périn\r
Verbier, Médières Haut\r
Verbier, Esserts Bas\r
Verbier, station poste\r
Verbier, La Tinte\r
Verbier, Les Colonnes\r
Verbier, Savoleyres\r
Verbier, Pra Michaud\r
Verbier, Plans Pras\r
Verbier, fromagerie\r
Verbier, Ransou\r
Verbier, Médières\r
Verbier, Rte de la Marlène\r
Verbier, Esserts Haut\r
Verbier, Mondzeu\r
Verbier, Patier\r
Verbier, Carrefour\r
Verbier, Brunet\r
Verbier, Alani\r
Verbier, La Marlénaz\r
Verbier, Montaney\r
Verbier, Les Esserts\r
Verbier, Nifortsié\r
Verbier, Crettaz Cô\r
Verbier, Route du Golf\r
Verbier (télécabine)\r
Verbier Les Creux\r
Vercorin, Les Ziettes\r
Vercorin, Vallon de Crouja\r
Vercorin, Rte d'Anniviers\r
Vercorin, poste\r
Vercorin (station amont)\r
Vercorin (station aval)\r
Verdabbio, Paese\r
Verdabbio, Piazza\r
Verdasio\r
Verdasio (Funivia)\r
Vergeletto, Villa Olandesi\r
Vergeletto, Chiesa\r
Vergeletto, Funivia Salei\r
Vergeletto, Piazza\r
Vergeletto, Bivio Gresso\r
Vergeletto, Alla Colletta\r
Vérines, Tsavedonde\r
Vérines, Pré du Mayen\r
Vérines, Camping\r
Verkehrshaus-Lido\r
Vermes, bif. Tiergarten\r
Vermes, école\r
Vernamiège, bif.\r
Vernamiège, Fond-Ville\r
Vernamiège, Les Prixes\r
Vernamiège, village\r
Vernand-Camarès\r
Vernate, Pianca\r
Vernate, Guasti di Vernate\r
Vernate, Paese\r
Vernate, Villa Bischoff\r
Vernate, Bivio per Cimo\r
Vernate, Bacino Acqua Potabile\r
Vernayaz\r
Vernayaz, gare\r
Vernayaz, village\r
Vernayaz MC\r
Vernéaz, croisée\r
Vernier, Bois-Chébé\r
Vernier, Avanchets-Casaï\r
Vernier, Sorbier\r
Vernier, Champ-Claude\r
Vernier, Avanchets-Etang\r
Vernier, Canada\r
Vernier, CO Renard\r
Vernier, Bouleaux\r
Vernier, Bois-des-Frères\r
Vernier, Châtelaine\r
Vernier, Verseuse\r
Vernier, SIG Lignon\r
Vernier, Progrès\r
Vernier, Usine à gaz\r
Vernier, Bouchet\r
Vernier, Avenue de l'Ain\r
Vernier, Château-Bloch\r
Vernier, Delay\r
Vernier, village\r
Vernier, Lignon Cité\r
Vernier, Balexert-Pailly\r
Vernier, Pont-Butin\r
Vernier, marché\r
Vernier, ZIMOGA\r
Vernier, Blandonnet\r
Vernier, Aïre\r
Vernier, Campanules\r
Vernier, Balexert\r
Vernier, Grand-Champ\r
Vernier, gare/Croisette\r
Vernier, Barde\r
Vernier, Parfumerie\r
Vernier\r
Vernier, Signal\r
Vernier, Etang Casa-Bamba\r
Vernier, Etang Place\r
Vernier, Lignon Tours\r
Vernier, Ecu\r
Vernier, Libellules\r
Vernier, De-Sauvage\r
Vernier, Sellieres\r
Vernier, gare/Renfile\r
Vernier, école\r
Vérossaz, Chavanne\r
Vérossaz, Rosaire\r
Vérossaz, Les Bassex\r
Vérossaz, La Doey place\r
Vérossaz, La Doey village\r
Vérossaz, Les Haussex\r
Vers-Chez-Grosjean\r
Vers-chez-Perrin, Etrabloz\r
Vers-chez-Perrin, bif.\r
Vers-l'Eglise\r
Versam, Grosshus\r
Versam, Under Acla\r
Versam, Islabord\r
Versam, Aclatobel\r
Versam, Post\r
Versam, Egschi\r
Versam, Ober Acla\r
Versam-Safien, Bahnhof\r
Versam-Safien\r
Verschiez\r
Verscio\r
Versegères, village\r
Versegères, Les Matteys\r
Versegères, Le Liappey\r
Versegères, La Montoz\r
Versegères, Fregnoley\r
Versmont\r
Versoix, Nant-de-Crève-Coeur\r
Versoix, gare\r
Versoix, Moulin-de-Richelien\r
Versoix, Stand de tir\r
Versoix, Lachenal\r
Versoix, Colombières\r
Versoix\r
Versoix, Argand\r
Versoix, La Pelotière\r
Versoix, Montfleury\r
Versoix, bourg\r
Versoix, Collège du Léman\r
Versoix, Richelien\r
Versoix, Saint-Loup\r
Versoix, Centre sportif\r
Versoix, La Scie\r
Versoix, Port Choiseul\r
Versoix, Machefer\r
Versoix, Champ-Barbon\r
Versoix, Canal de Versoix\r
Versoix,Observatoire de Genève\r
Versoix, Ecogia\r
Versoix (lac)\r
Versvey, Pl. Laiterie\r
Versvey, village\r
Versvey, Les Fannes\r
Versvey, Lac Vernay/campings\r
Vésenaz, Capite\r
Vésenaz, Mancy\r
Vésenaz, La Dame\r
Vésenaz, Californie\r
Vésenaz, La Bise\r
Vésenaz, église\r
Vésenaz, Bois-Galland\r
Vésenaz, Crêts-de-la-Capite\r
Vésenaz, village\r
Vésenaz, Saint-Maurice\r
Vésenaz, Repentance\r
Vésenaz, Petray\r
Vésenaz, Pallanterie\r
Vésenaz, Pointe à la Bise\r
Vésenaz, Princes\r
Vesin, cordonnerie\r
Vesin, village\r
Vessy, Grands-Esserts\r
Vessy, Place Verte\r
Vessy, Plateau\r
Vessy, Milière\r
Vessy, Marsillon\r
Vessy, Plateau de Pinchat\r
Vessy, Grand-Donzel\r
Vessy, Pinchat-la-Tour\r
Vessy, Bochère\r
Vessy, Vüy\r
Vessy, Combettes\r
Vessy, Muguets\r
Vessy, Drize\r
Vessy, Centre sportif\r
Vessy, Chemin Vert\r
Vessy, Stand de tir\r
Vétroz, La Millière\r
Vétroz, le Home\r
Vétroz, poste\r
Vétroz, Champs-y-Zou\r
Vevey, Savoie\r
Vevey, Ronjat\r
Vevey, Entre-Deux-Villes\r
Vevey, Berges-du-Léman\r
Vevey, Bergère\r
Vevey, Samaritain\r
Vevey, L'Union\r
Vevey, Biéler\r
Vevey, funiculaire/av. Reller\r
Vevey\r
Vevey, Gustave-Coindet\r
Vevey, gare\r
Vevey, Ateliers\r
Vevey, Cour-au-Chantre\r
Vevey, Ste-Claire\r
Vevey, Crosets\r
Vevey, Pra\r
Vevey, Point du Jour\r
Vevey, Marronniers\r
Vevey, Moulins\r
Vevey, Corseaux Plage\r
Vevey, Marché\r
Vevey, Dévin\r
Vevey, av. de Corsier\r
Vevey, Major-Davel\r
Vevey, Gilamont\r
Vevey, Beau-Séjour\r
Vevey, Mémise\r
Vevey, Charmontey\r
Vevey, Copet\r
Vevey, Hôtel de Ville\r
Vevey, Nord\r
Vevey, Palud\r
Vevey, Ancienne-Corderie\r
Vevey, Arabie\r
Vevey, Clara-Haskil\r
Vevey, Quatre-Vents\r
Vevey, funiculaire\r
Vevey, Gutenberg\r
Vevey (funi)\r
Vevey Vignerons\r
Vevey-La Tour (lac)\r
Vevey-Marché (lac)\r
Vex, poste\r
Vex, bif. d'Hérémence\r
Vex, Le Villard\r
Vex, bif. des Agettes\r
Vex, le Croux\r
Vex, Les Prasses d'en haut\r
Vex, La Tueille\r
Vex, Sindy\r
Veyras, Signèse\r
Veyras, Fontanettes\r
Veyras, Muzot\r
Veyras, Pontet\r
Veyrier, école\r
Veyrier, douane\r
Veyrier, Bois-Gourmand\r
Veyrier, village\r
Veyrier, La Mouille\r
Veyrier, La Salésienne\r
Veyrier, Petit-Veyrier\r
Veyrier, Chemin des Bois\r
Veyrier, Le Reposoir\r
Veyrier, Pont de Sierne\r
Veyrier, Tournettes\r
Veyrier, Les Quibières\r
Veyrier, Sierne\r
Veyrier, Rasses\r
Veyrier, Boqueteaux\r
Veysonnaz, Greppon Blanc\r
Veysonnaz, l'Arge\r
Veysonnaz, parking Magrappé\r
Veysonnaz, ch. de Pra\r
Veysonnaz, Tierpeu\r
Veysonnaz, Pranu\r
Veysonnaz, La Mière\r
Veysonnaz, télécabine\r
Veysonnaz, La Ramuge\r
Veysonnaz, bif. Clèbes\r
Veysonnaz, station\r
Veysonnaz, La Fantanette\r
Veysonnaz (télécabine)\r
Veytaux, gare\r
Veytaux, château de Chillon\r
Veytaux, Grandchamp\r
Veytaux, Bonivard\r
Veytaux-Chillon\r
Vezia, Villa Negroni\r
Vezia, Marnigo\r
Vezia, Paese\r
Vezia, Villa Recreatio\r
Vezio, Acquacalda\r
Vezio, Busgnone\r
Vezio, Paese\r
Viano, Paese\r
Vich, La Bichette\r
Vich, poste\r
Vico Morcote, Colombaio\r
Vico Morcote, Via Piana\r
Vico Morcote, Chiesa\r
Vico Morcote, Paese\r
Vico Morcote, Pradon\r
Vico Morcote, Olivella Vill.\r
Vico Morcote, Olivella Lago\r
Vicosoprano, Zocca\r
Vicosoprano, Helvetia\r
Vicosoprano, Camping\r
Vicosoprano, Nasciarina\r
Vicosoprano, Plazza\r
Vicques, bas du village\r
Vicques, Cras de la Velle\r
Vicques, poste\r
Vielbringen, Schulhaus\r
Vielbringen, Moosacker\r
Vielbringen, Chäsi\r
Vigana, Nucleo\r
Vigana, Al Sècch\r
Viganello, Bottogno\r
Viganello, Villa Costanza\r
Viganello, Centro\r
Viganello, La Santa\r
Viganello, S. Siro\r
Viganello, Scuola Media\r
Viganello, Meridiana\r
Vignogn, vitg\r
Vignogn, Baselgia\r
Vilars NE\r
Villa (Bedretto)\r
Villa Luganese, Vigna\r
Villa Luganese, Luss\r
Villa Luganese, Paese\r
Villaraboud, bif.\r
Villaraboud, Les Buissons\r
Villaraboud, école\r
Villaraboud, Beauregard\r
Villarbeney, village\r
Villard-sur-Chamby, La Cranche\r
Villard-sur-Chamby, P.-Forand\r
Villard-sur-Chamby, D'Zetiau\r
Villard-sur-Chamby, anc. poste\r
Villard-sur-Chamby, Saumont\r
Villarepos, La Tornalla\r
Villarepos, Fin de Plan\r
Villarepos, centre\r
Villargiroud, bif.\r
Villargiroud, village\r
Villariaz, Moulin Rouge\r
Villariaz, village\r
Villarimboud, village\r
Villarlod, La Forge\r
Villarlod, poste\r
Villarlod, Café\r
Villars-Bozon\r
Villars-Bramard, Farzin\r
Villars-Bramard, village\r
Villars-Burquin, La Forge\r
Villars-Burquin, Laiterie\r
Villars-Burquin, pl. fontaine\r
Villars-Burquin, Grange-Meule\r
Villars-Burquin, Les Oches\r
Villars-Burquin, Bassugnet\r
Villars-Burquin, Douvaz\r
Villars-Epeney, Fontaine\r
Villars-le-Comte, poste\r
Villars-le-Comte, Le Chalet\r
Villars-le-Grand, village\r
Villars-le-Terroir, pl. Eglise\r
Villars-le-Terroir, B.-Croix\r
Villars-le-Terroir, poste\r
Villars-le-Terroir, av. d'Orbe\r
Villars-le-Terroir, Le Buron\r
Villars-Mendraz, Petite Route\r
Villars-Mendraz, croisée\r
Villars-Mendraz, Praz-Longet\r
Villars-s.-O., Bois des Tines\r
Villars-s.-O., Col de la Croix\r
Villars-sous-Champvent\r
Villars-sous-Mont, gare\r
Villars-sous-Mont\r
Villars-sous-Yens, village\r
Villars-sous-Yens, Le Moulin\r
Villars-Ste-Croix, village\r
Villars-Ste-Croix, Le Sansy\r
Villars-Ste-Croix, En Coulaye\r
Villars-Ste-Croix, Colice\r
Villars-Ste-Croix, Croix-Péage\r
Villars-sur-Fontenais\r
Villars-sur-Glâne, Méridienne\r
Villars-sur-Glâne, Martinets\r
Villars-sur-Glâne, Derrey\r
Villars-sur-Glâne,Jean Paul II\r
Villars-sur-Glâne, Hôp. cant.\r
Villars-sur-Glâne, Marteray\r
Villars-sur-Glâne, Chênes\r
Villars-sur-Glâne, Coulat\r
Villars-sur-Glâne, Les Dailles\r
Villars-sur-Glâne, Fenetta\r
Villars-sur-Glâne, Blés-d'Or\r
Villars-sur-Glâne, église\r
Villars-sur-Glâne, Rte Soleil\r
Villars-sur-Glâne, Belle-Croix\r
Villars-sur-Glâne,Petit-Moncor\r
Villars-sur-Glâne, C. sportif\r
Villars-sur-Glâne, gare\r
Villars-sur-Glâne, Nuithonie\r
Villars-sur-Glâne,Rte Préalpes\r
Villars-sur-Glâne, Rochettes\r
Villars-sur-Glâne, Moncor\r
Villars-sur-Glâne, Berra\r
Villars-sur-Glâne, Cormanon\r
Villars-sur-Glâne\r
Villars-sur-Glâne, Daillettes\r
Villars-sur-Glâne, La Glâne\r
Villars-sur-Glâne, Le Moléson\r
Villars-sur-Glâne,Villars-Vert\r
Villars-sur-Glâne,R.de Payerne\r
Villars-sur-Glâne, Planafaye\r
Villars-sur-Ollon, rte Coufin\r
Villars-sur-Ollon, Hôtels\r
Villars-sur-Ollon, télécabine\r
Villars-sur-Ollon, centre\r
Villars-sur-Ollon, patinoire\r
Villars-sur-Ollon\r
Villars-sur-Ollon, Le Bristol\r
Villars-sur-Ollon, temple\r
Villars-sur-Ollon, Colonges\r
Villars-sur-Ollon, tennis\r
Villars-sur-Ollon, La Verneyre\r
Villars-sur-Ollon, gare\r
Villars-sur-Ollon, rte du Roc\r
Villars-sur-Ollon, La Roche\r
Villars-sur-Ollon (télécabine)\r
Villars-sur-Ollon Golf\r
Villars-sur-Ollon La Rasse\r
Villars-Tiercelin, village\r
Villars-Tiercelin, Fontaines\r
Villars-Tiercelin, La Sapelle\r
Villars-Tiercelin, sentier H&N\r
Villarsel-le-Gibloux, Bugnon\r
Villarsel-le-Gibloux, village\r
Villarsel-sur-Marly\r
Villarsiviriaux, village\r
Villarvolard, village\r
Villarvolard, Verchaux\r
Villarzel, village\r
Villarzel, Le Cachet\r
Villarzel, Planche-Perte\r
Villarzel, Les Râpes\r
Villaz-St-Pierre, gare\r
Villaz-St-Pierre, village\r
Villaz-St-Pierre, Battiaz\r
Villaz-St-Pierre, Le Vivier\r
Villaz-St-Pierre, bif.\r
Villaz-St-Pierre, Le Biolex\r
Villaz-St-Pierre, Le Renaillé\r
Villaz-St-Pierre\r
Villeneuve FR, Champs Abessaz\r
Villeneuve FR, grande salle\r
Villeneuve VD, Poterlaz\r
Villeneuve VD, Eau-Froide\r
Villeneuve VD, Clos du Moulin\r
Villeneuve VD, sous le viaduc\r
Villeneuve VD, Pré du Bruit\r
Villeneuve VD, route d'Arvel\r
Villeneuve VD, Pré au Comte\r
Villeneuve VD, Carroz-Derrière\r
Villeneuve VD, Pré Neuf\r
Villeneuve VD, Pré Jaquet\r
Villeneuve VD, rte des Paquays\r
Villeneuve VD, centres comm.\r
Villeneuve VD, rte du Grammont\r
Villeneuve VD, gare\r
Villeneuve VD, La Plage\r
Villeneuve VD, industrie\r
Villeneuve VD\r
Villeneuve VD (lac)\r
Villeret, rue Neuve\r
Villeret, Champs du Clos\r
Villeret, collège\r
Villeret\r
Villeret, rue du Brue\r
Villeret, centre\r
Villette VD\r
Villiers, La Champey\r
Villiers, centre\r
Villigen, Park Innovaare\r
Villigen, Vor Tor\r
Villigen, Gemeindehaus\r
Villigen, PSI West\r
Villigen, PSI Ost\r
Villigen, Husberg\r
Villmergen, Zentrum\r
Villmergen, Birkenweg\r
Villmergen, Feldblumenweg\r
Villmergen, Bullenberg\r
Villmergen, Schulzentrum Hof\r
Villmergen, Oberdorf\r
Villmergen, Bündtenstrasse\r
Villmergen, Wohlerstrasse\r
Villmergen, Unterzelg\r
Villnachern, Dorf\r
Villy\r
Villy, gare\r
Villy, village\r
Vilters, Oberdorf\r
Vilters, Härtistrasse\r
Vilters, Rosengarten\r
Vilters, Zentrum\r
Vinadi\r
Vinelz, Strand\r
Vinelz, Flachsern\r
Vinelz, Dorf\r
Vinzel, village\r
Vionnaz, gare\r
Vionnaz, Les Nayaz\r
Vionnaz, Village\r
Vionnaz, Crébellay\r
Vionnaz\r
Vionnaz, Ravines\r
Vionnaz, croisée d'Illarsaz\r
Vira (Gambarogno), La Riva\r
Vira (Gambarogno), Edifors\r
Vira (Gambarogno), Vignascia\r
Vira (Gambarogno), Bellavista\r
Vira (Gambarogno), Paese\r
Vira (Gambarogno) (lago)\r
Visnitz\r
Visp, Untere Albe\r
Visp, Hohlegasse\r
Visp, St. Jodern\r
Visp, Schlüsselacker\r
Visp, Stundhaus\r
Visp, Hubelstrasse\r
Visp, Tschill\r
Visp, Lonzawerke\r
Visp\r
Visp, Spital\r
Visp, Albe\r
Visp, Ried\r
Visp, Bahnhof Süd\r
Visp, Arena\r
Visp, Bahnhof Nord\r
Visp, Kulturzentrum La Poste\r
Visp, Litterna\r
Visp, Kleegärten\r
Visp, Fassji\r
Visp, Friedhof\r
Visp, Hubel-/St. Jodernstrasse\r
Visp, Forsthaus\r
Visp, Staldbach\r
Visp, Bella Vista\r
Visp, West\r
Visp, Sportplatz\r
Visp, Schwimmbad\r
Visp, Pomona West\r
Visperterminen, Toppi\r
Visperterminen, Chlei Derfji\r
Visperterminen, Dorfeingang\r
Visperterminen, Oberstalden\r
Visperterminen, Bächji\r
Visperterminen, Busterminal\r
Visperterminen, Kellerei\r
Visperterminen, Chrizji\r
Visperterminen, Schulhaus\r
Visperterminen, Unterstalden\r
Visperterminen (Talstation)\r
Vissoie, Mayoux-Frasses\r
Vissoie, Pinsec-Teinda\r
Vissoie, Pinsec-village\r
Vissoie, Mayoux-village\r
Vissoie, les Rotzecs\r
Vissoie, poste\r
Vissoie, Les Morands\r
Vissoie, Les Barmes\r
Vitznau\r
Vitznau, Unteraltdorf\r
Vitznau, Floralpina\r
Vitznau, Park Hotel\r
Vitznau, Unterwilen\r
Vitznau, Station\r
Vnà, Jalmèr\r
Vocaglia\r
Vögelinsegg, Bahnhof\r
Vögelinsegg\r
Vogorno, San Bartolomeo\r
Vogorno, Sant Antonio\r
Vogorno, di Dentro\r
Vogorno, Paese\r
Volken, Post\r
Volketswil, Gries\r
Volketswil, Hofwisen\r
Volketswil, Zentrum\r
Volketswil, Volkiland Chliriet\r
Volketswil, Chappeli\r
Volketswil, In der Höh\r
Volketswil, Huzlenstrasse\r
Volketswil, Milandia\r
Volketswil, Giessen\r
Volketswil, Chammwisen\r
Volketswil, Dorf\r
Volketswil, Chrummacher\r
Volketswil, Eichstrasse\r
Volketswil, Chapf\r
Volketswil, In der Au\r
Volketswil, Hölzliwisen\r
Volketswil, Wallberg\r
Volketswil, Zimikon\r
Volketswil, Hegnau\r
Vollèges, Cormayeur\r
Vollèges, centre\r
Vollèges, centre scolaire\r
Vorab Gletscher\r
Voralp, Kurhaus\r
Vordemwald, Weierdentsch\r
Vordemwald, Fischerweg\r
Vordemwald, Post\r
Vordemwald, Iselishof\r
Vordemwald, Schulhaus\r
Vordemwald, Rest. Tannenbaum\r
Vordemwald, Grubenweg\r
Vordemwald, Chratzernstrasse\r
Vordemwald, Pflegeheim Sennhof\r
Vorderfultigen, Abzw. Egg\r
Vorderfultigen, Käserei\r
Vorderrinderbach\r
Vorders Eggli\r
Vorderthal, Gfell\r
Vorderthal, Schweizerhof\r
Vorderthal, Schweig\r
Vorderthal, Einschnitt\r
Vorderthal, Bächweidstrasse\r
Vorderthal, Flühbödeli\r
Vorderthal, Post\r
Vorderthal, Rempen\r
Vorderthal, Sonne\r
Vorimholz, Wysserain\r
Vorimholz, Hof Aeschwald\r
Vorimholz, Spritzenhaus\r
Vorimholz, Kaltenbrunnen\r
Vounetse\r
Vouvry, piscine\r
Vouvry, Le Culat\r
Vouvry\r
Vouvry, Riond Vert\r
Vouvry, poste\r
Vouvry, Les Bovairons\r
Vouvry, gare\r
Vrin, Dado\r
Vrin, Mons Sut\r
Vrin, Cons\r
Vrin, vitg\r
Vrin, Puzzatsch\r
Vrin, Parvalsauns\r
Vrin, Ligiazun\r
Vrin, S. Giusep\r
Vuadens, Le Maupas\r
Vuadens, St-Vincent\r
Vuadens, Les Kâ\r
Vuadens, gare\r
Vuadens, Le Dally\r
Vuadens-Sud\r
Vuarennes\r
Vuarmarens, village\r
Vuarrengel, Orée du Bois\r
Vuarrengel, En Chollet\r
Vuarrengel, Laiterie\r
Vuarrens, poste\r
Vuarrens, gar. du Gros-de-Vaud\r
Vucherens, Closy\r
Vucherens, village\r
Vucherens, église\r
Vucherens, Bruvière\r
Vue-des-Alpes\r
Vufflens-Aclens, zone industr.\r
Vufflens-la-Ville, église\r
Vufflens-la-Ville, Cuvillard\r
Vufflens-la-Ville\r
Vufflens-la-Ville, gare\r
Vufflens-la-Ville,grande salle\r
Vufflens-le-Château\r
Vugelles, croisée\r
Vuibroye, Champacot\r
Vuibroye, village\r
Vuippens, village\r
Vuissens, école\r
Vuissens, poste\r
Vuissens, Les Forges\r
Vuisternens-dt-Romont, forge\r
Vuisternens-dt-Romont, village\r
Vuisternens-dt-Romont, Lanciau\r
Vuisternens-dt-Romont, école\r
Vuisternens-dt-Romont, foyer\r
Vuisternens-dt-Romont, Poyet\r
Vuisternens-en-Ogoz, Le Haut\r
Vuisternens-en-Ogoz, croisée\r
Vuisternens-en-Ogoz, Bouleyres\r
Vuiteboeuf, collège\r
Vuiteboeuf, gare\r
Vuiteboeuf\r
Vulliens, Praz-Botsard\r
Vulliens, Le Corria\r
Vulliens, village\r
Vullierens, Abbaye\r
Vullierens, village\r
Wabern, Bächtelen\r
Wabern, Weyergut\r
Wabern, Lindenweg\r
Wabern, Alpenstrasse\r
Wabern, Kleinwabern\r
Wabern, Morillon\r
Wabern, Gurtenbahn\r
Wabern, Weyerstrasse\r
Wabern, Camping Eichholz\r
Wabern, Eichholz\r
Wabern, Tram-Endstation\r
Wabern (Gurtenbahn)\r
Wabern bei Bern\r
Wachseldorn, Hof\r
Wachseldorn, Schulhaus\r
Wachseldorn, Feuerwehrmagazin\r
Wachseldorn, Dorf\r
Wädenswil, Giessen\r
Wädenswil, Weinrebe\r
Wädenswil, Oedischwend\r
Wädenswil, Gulmenmatt\r
Wädenswil, Schwanen\r
Wädenswil, Chotten\r
Wädenswil, Tiefenhofstrasse\r
Wädenswil, Frohmatt\r
Wädenswil, Beichlen\r
Wädenswil, Chalchtaren\r
Wädenswil, Hallenbad/Frohmatt\r
Wädenswil, Glärnisch\r
Wädenswil, Töbelibach\r
Wädenswil, Rötiboden\r
Wädenswil, Tiefenhof\r
Wädenswil, Tobelrain\r
Wädenswil, Friedhof\r
Wädenswil, Winterberg\r
Wädenswil, Schmiedstube\r
Wädenswil, Burstel\r
Wädenswil, Feld\r
Wädenswil, Schluchtal\r
Wädenswil, Mühlebach\r
Wädenswil, Boller\r
Wädenswil, Büelen\r
Wädenswil, Hintere Rüti West\r
Wädenswil, Hangenmoos\r
Wädenswil, Sandhof\r
Wädenswil, Forschungsanstalt\r
Wädenswil, Campus Reidbach\r
Wädenswil, Campus Rothus\r
Wädenswil, Neudorf\r
Wädenswil, Lätten\r
Wädenswil, Neubühl\r
Wädenswil, Herrlisberg\r
Wädenswil, Gisenrüti\r
Wädenswil, Campus Grüental\r
Wädenswil, Coop\r
Wädenswil, Bahnhof\r
Wädenswil, Sonnenrainstrasse\r
Wädenswil, Hintere Rüti Ost\r
Wädenswil, Baumgarten\r
Wädenswil, Eichweid\r
Wädenswil, Schlossbergstrasse\r
Wädenswil, Meierhof-Rain\r
Wädenswil, Reidbach\r
Wädenswil, Meierhof\r
Wädenswil, Tiefenhofweiher\r
Wädenswil, Staubeweidli\r
Wädenswil, Krähbach\r
Wädenswil, Mugern\r
Wädenswil\r
Wädenswil (See)\r
Wagen, Käserei\r
Wagen, alte Post\r
Wagen, St. Wendelin\r
Wagenhausen, Propstei\r
Wägerhus/Abzw. Jöriseen\r
Wagerswil, Dorf\r
Wahlen b. Laufen, Unterdorf\r
Wahlen b. Laufen, Traube\r
Wahlen b. Laufen, Oberdorf\r
Wahlen b. Laufen, Weihern\r
Wahlen b. Laufen, Petersplatz\r
Wahlendorf, Wendeplatz\r
Walchwil, Hörndlirain\r
Walchwil, St. Adrian\r
Walchwil, Lotenbach\r
Walchwil, Sagenbrugg\r
Walchwil, Chellen\r
Walchwil, Mütschi\r
Walchwil, Engel\r
Walchwil, Lido\r
Walchwil, Sternenmatt\r
Walchwil, Bahnhof\r
Walchwil, Blimoos\r
Walchwil, Lauihof\r
Walchwil, Oberdorf\r
Walchwil, Gerbi\r
Walchwil, Aesch\r
Walchwil, Usseregg\r
Walchwil, Grueb\r
Walchwil, Oberwihel\r
Walchwil, Hintermettlen\r
Walchwil, Obersagen\r
Walchwil, Hörndli\r
Walchwil, Zämattli\r
Walchwil, Oberhalten\r
Walchwil\r
Walchwil (See)\r
Walchwil Hörndli\r
Wald AR, Schweizerbund\r
Wald AR, Hopsbermoos\r
Wald AR, Dorf\r
Wald AR, Unterdorf\r
Wald AR, Grunholz\r
Wald ZH, Gemeindehaus\r
Wald ZH, Wabe\r
Wald ZH, Binzholz\r
Wald ZH, Ober-Feld\r
Wald ZH, Etzelstrasse\r
Wald ZH, Farnboden\r
Wald ZH, Tänler\r
Wald ZH, Hittenberg\r
Wald ZH, Pflegezentrum\r
Wald ZH, Nordeck\r
Wald ZH, Sonnenberg\r
Wald ZH, Dieterswil\r
Wald ZH, Blattenbach\r
Wald ZH, Bahnhof\r
Wald ZH, Abzw. Oberholz\r
Wald ZH, Jonatal\r
Wald ZH, Elbastrasse\r
Wald ZH, Riet\r
Wald ZH, Katholische Kirche\r
Wald ZH, Rehazentrum\r
Wald ZH, Sportstrasse\r
Wald ZH, Niederholz\r
Wald ZH\r
Waldburg, Station\r
Waldburg\r
Walde AG, Zentrum\r
Walde AG, Käserei\r
Walde SG, Widen\r
Walde SG, Rütihalde\r
Walde SG, Dorf\r
Walde SG, Oberricken\r
Waldegg, Katholische Kirche\r
Waldegg, Post\r
Waldegg, Birmensdorferstrasse\r
Waldegg, Leuen\r
Waldenburg, Revue Thommen\r
Waldenburg, Hauenstein\r
Waldenburg, Station\r
Waldenburg, Bürgerschopf\r
Waldhäusern AG, Burehof\r
Waldhäusern BE, Kurhaus\r
Wäldi, Dorfplatz\r
Waldibrücke, Bahnhof\r
Waldibrücke\r
Waldkirch, Edlischwil\r
Waldkirch, Gemeindehaus\r
Waldkirch, Ronwil\r
Waldkirch, Friedegg\r
Waldkirch, Locherhof\r
Waldkirch, Hohfirst\r
Waldkirch, Bisihus\r
Waldkirch, Bernhardsrüti\r
Waldkirch, Fillisweid\r
Waldkirch, Dorf\r
Waldkirch, Rickenhueb\r
Waldkirch, Werkhof\r
Waldkirch, Niederwil\r
Waldkirch, Obergrimm\r
Waldstafel\r
Waldstatt, Adler\r
Waldstatt, Hirschenkreuzung\r
Waldstatt, Scheidweg\r
Waldstatt\r
Waldstatt, Auerhof\r
Waldstatt, Dorf\r
Walenstadt\r
Walenstadt, Stutz\r
Walenstadt, Zollacher\r
Walenstadt, Schattenbach\r
Walenstadt, Rathausplatz\r
Walenstadt, Schnabelweid\r
Walenstadt, Tisa\r
Walenstadt, Bahnhof\r
Walenstadt, Hafen\r
Walenstadt, Fürscht\r
Walenstadt (See)\r
Walenstadtberg, Reha-Klinik\r
Walenstadtberg, alte Post\r
Walenstadtberg, Stauffacher\r
Walenstadtberg, Alpenblick\r
Wali\r
Walkringen, Niederwil\r
Walkringen, Rüttihubelbad\r
Walkringen\r
Walkringen, Zihlstrasse\r
Walkringen, Wikartswil\r
Walkringen, Dorni\r
Walkringen, Bahnhof\r
Wallbach, Rheinstrasse\r
Wallbach, Gemeindehaus\r
Wallbach, Friedhof\r
Wallegg\r
Wallenried, village\r
Wallenschwil, Weiler\r
Wallenwil, Schulhaus\r
Wallenwil, Frohsinn\r
Wallenwil, Schlangenzoo\r
Wallisellen, Kaserne\r
Wallisellen, Glatt (Bus)\r
Wallisellen, Alterszentrum\r
Wallisellen, Herti\r
Wallisellen, Schäfligraben\r
Wallisellen, Frohheimstrasse\r
Wallisellen, Steinacker\r
Wallisellen, Guyer-Weg\r
Wallisellen, Florastrasse\r
Wallisellen, Zielacker\r
Wallisellen, Bützacker\r
Wallisellen, Furtbach\r
Wallisellen, Bahnhof\r
Wallisellen, Blumenweg\r
Wallisellen, Rosenberg\r
Wallisellen, Riedenerstrasse\r
Wallisellen, Zentrum\r
Wallisellen, Sportzentrum\r
Wallisellen, Spitzacker\r
Wallisellen, Bodenackerstrasse\r
Wallisellen, Neugut\r
Wallisellen, Belair\r
Wallisellen, Stadthaus\r
Wallisellen, Ifang\r
Wallisellen, Hallenbad\r
Wallisellen, Lindenplatz\r
Wallisellen, Säntisstrasse\r
Wallisellen, Schulhaus Bürgli\r
Wallisellen, Glatt (Tram)\r
Wallisellen, Friedhof\r
Wallisellen, Guggenbühlstrasse\r
Wallisellen, Haldenstrasse\r
Wallisellen\r
Walliswil b. Wangen, Sonne\r
Walliswil b. Wangen, Stalden\r
Walliswil b. Wangen, Post\r
Walliswil b. Wangen, Tal\r
Walliswil b. Wangen, Seilerei\r
Walperswil, Gimmiz\r
Walperswil, Kleingimmiz\r
Walperswil, Burghubel\r
Walperswil, Post\r
Waltalingen\r
Waltensburg/Vuorz, Sumvitg\r
Waltensburg/Vuorz, Ucliva\r
Waltensburg/Vuorz, Demvitg\r
Waltensburg/Vuorz,Crap Bargias\r
Waltensburg/Vuorz, Cadruvi\r
Waltensburg/Vuorz, Crap Martin\r
Waltensburg/Vuorz, Mt. S.Gieri\r
Waltensburg/Vuorz\r
Waltensburg/Vuorz Curtginet\r
Waltenschwil, Büelisacker\r
Waltenschwil, Schulhausstrasse\r
Waltenschwil, Grossacher\r
Waltenschwil, Hofmatten\r
Waltenschwil, Maiächer\r
Waltenschwil, Hessel\r
Waltenschwil, Zentrum\r
Waltenschwil, altes Schulhaus\r
Walterswil BE, Kirche\r
Walterswil BE, Stampfe\r
Walterswil BE, Dorf\r
Walterswil BE, Neuweid\r
Walterswil BE, Höchi\r
Walterswil BE, Gassenwald\r
Walterswil BE, Mühleweg\r
Walterswil-Striegel\r
Waltikon, Station\r
Waltikon\r
Waltwil\r
Walzenhausen, Hasenbrunnen\r
Walzenhausen, Bild\r
Walzenhausen, Unterer Platz\r
Walzenhausen\r
Walzenhausen, Bahnhof\r
Walzenhausen, Leuchen\r
Walzenhausen, Moos\r
Walzenhausen, Ledi Schwimmbad\r
Walzenhausen, Lachen\r
Walzenhausen, Güetli\r
Walzenhausen, Almendsberg\r
Walzenhausen, Gaismoos\r
Walzenhausen, Wilen\r
Walzenhausen, Sonnenberg\r
Wangelen, Wendeplatz\r
Wangelen, Alte Post\r
Wangelen, Mühlematt\r
Wangelen, Bühl\r
Wangen a.d. Aare, Unterführung\r
Wangen a.d.Aare, Zytglogge\r
Wangen a.d.Aare, Aarenbrücke\r
Wangen an der Aare, Bahnhof\r
Wangen an der Aare\r
Wangen b D'dorf, Hätzelwisen\r
Wangen b D'dorf, Dorfplatz\r
Wangen b D'dorf, Weidli\r
Wangen b D'dorf, Flugsicherung\r
Wangen b D'dorf, Stierwisen\r
Wangen b D'dorf, Oberdorf\r
Wangen b D'dorf, Dürrbach\r
Wangen b. Olten, Neuhüsli\r
Wangen b. Olten, Dorf\r
Wangen b. Olten, Danzmatt\r
Wangen b. Olten, Kleider Frey\r
Wangen b. Olten, Gäuerstübli\r
Wangen b. Olten, Am Kreuzbach\r
Wangen b. Olten, Ochsen\r
Wangen bei Olten, Bahnhof\r
Wangen bei Olten\r
Wangen SZ, Zentrum\r
Wangen SZ, alte Post\r
Wangen SZ, Gätzibach\r
Wangen SZ, Lochgasse\r
Wangen SZ, Löwenfeld\r
Wangen SZ, Brunnenhof\r
Wangenried, Unterdorf\r
Wangenried, Sägerei\r
Wangenried, Linde\r
Wangenried, Schule\r
Wängi, Dorfschulhaus\r
Wängi, Froheggstrasse\r
Wängi, Rosental (Bus)\r
Wängi\r
Wangs, Sternen\r
Wangs, Pizolbahn\r
Wangs, Rathaus\r
Wangs, Parkhotel\r
Wangs Talstation Pizolbahnen\r
Wanzwil, Post\r
Warmesberg\r
Wart\r
Wartensee\r
Wartenstein\r
Warth, Gemeindehaus\r
Warth, Breite\r
Warth, Kartause Ittingen\r
Warth, Oberdorf\r
Warth, Kreuz\r
Warth, Rohr\r
Wasen i.E., Dangeli\r
Wasen i.E., Oberei\r
Wasen i.E., Kirche\r
Wasen i.E., Abzw. Churzenei\r
Wasen i.E., Aeschberg\r
Wasen i.E., Bahnhof\r
Wasen i.E., Sparenegg\r
Wasen i.E., Stegmatt\r
Wassen, Dorf\r
Wassen, Pfaffensprung\r
Wassen, Wattingen\r
Wassen, Post\r
Wasserauen\r
Wasserauen (Ebenalpbahn)\r
Wasserfallen\r
Wasserngrat\r
Wasterkingen,Ausserdorfstrasse\r
Wasterkingen, Gemeindehaus\r
Watt, Geerenweg\r
Watt, Dorf\r
Watt, Brünigstrasse\r
Watt, Laubisser\r
Watt, Schulhaus\r
Watt, Haldensteig\r
Wattenwil, Grundbach\r
Wattenwil, Hof\r
Wattenwil, Postgasse\r
Wattenwil, Pflegeheim\r
Wattenwil, Lischen\r
Wattenwil, Mettlen\r
Wattenwil, Rössli\r
Wattenwil, Ey\r
Wattenwil, Stockern\r
Wattenwil, Alpenblick\r
Wattenwil, Bären\r
Wattwil, Eggberg\r
Wattwil, Untereggberg\r
Wattwil, Brendi\r
Wattwil, Wanne\r
Wattwil, Bahnhof\r
Wattwil, Klinik\r
Wattwil, Vorderer Hummelwald\r
Wattwil, Hinterer Hummelwald\r
Wattwil, Mittlerer Hummelwald\r
Wattwil\r
Wattwil, Wis\r
Wattwil, Schmidenbach\r
Wattwil, Rietwis\r
Wattwil, Bunt\r
Wattwil, Bahnhof West\r
Wattwil, Post\r
Wattwil, ev. Kirche\r
Wattwil, Tüetlisberg\r
Wauwil, Zentrum\r
Wauwil\r
Wauwil, Sackmatt\r
Wavre, collège\r
Wavre, Les Motteresses\r
Weberei Matzingen\r
Weesen, See\r
Weesen, Autis\r
Weesen, Post\r
Weesen, Biäsche\r
Weesen, Restaurant Bahnhof\r
Weesen (See)\r
Wegenstetten, Oberdorf\r
Wegenstetten, Mitteldorf\r
Wegenstetten, Abzw. Schupfart\r
Weggis, Seilbahn\r
Weggis, Sunnerainstrasse\r
Weggis, Hertenstein\r
Weggis, Kreuzstrasse\r
Weggis, Tannenbergstrasse\r
Weggis, Neubüel\r
Weggis\r
Weggis, Unterdorf\r
Weggis, Bannholz\r
Weggis, Bodenberg\r
Weggis, Obstbaumstrasse\r
Weggis, Föhrenrain\r
Weggis, Schiffstation\r
Weggis, Langenzihl\r
Weggis, Zopf\r
Weggis, Acher\r
Weggis, Riedsort\r
Weggis, Zinnenstrasse\r
Weggis, Under Linde\r
Weggis, Buchenweg\r
Weggis, Dorfplatz\r
Weggis, Lützelau\r
Weggis, Paradiesweg\r
Weggis, Magnolienweg\r
Weggis, Lützelaustrasse\r
Weggis, Kastanienweg\r
Weggis, Lindenweg\r
Weggis, Lido\r
Weggis, Felsberg\r
Weggis, Rigistrasse\r
Weggis, Lorbeerweg\r
Weggis, Zingelistrasse\r
Weggis (Luftseilbahn)\r
Weiach, Gemeindehaus\r
Weiach, Oberdorfstrasse\r
Weiach, Alter Bahnhof\r
Weier i.E., Lehn\r
Weinfelden\r
Weinfelden, Schlossgasse\r
Weinfelden, Aeuli\r
Weinfelden, vorderes Bachtobel\r
Weinfelden, Bachtobelstrasse\r
Weinfelden, Felsenstrasse\r
Weinfelden, Güttingersreuti\r
Weinfelden, Wilerstrasse\r
Weinfelden, Maienrain\r
Weinfelden, Zedernpark\r
Weinfelden, Firehouse\r
Weinfelden, Dufourstrasse\r
Weinfelden, Sonnenplatz\r
Weinfelden, Dunantstrasse\r
Weinfelden, Giessen\r
Weinfelden, Bahnhof\r
Weinfelden, Thurland\r
Weinfelden, Alterszentrum\r
Weingarten, Brunnenwies\r
Weingarten, Brücke\r
Weingarten b. Märwil, Dorf\r
Weingarten-Kalthäusern,Dorfstr\r
Weiningen TG, Weckingen\r
Weiningen TG, Mehrzweckhalle\r
Weiningen TG, Dorfplatz\r
Weiningen ZH, Ausserdorf\r
Weiningen ZH, Aegelsee\r
Weiningen ZH, Schulhaus\r
Weiningen ZH, Lindenplatz\r
Weissbad, Zidler\r
Weissbad, Bötz\r
Weissbad, Bahnhof\r
Weissbad\r
Weissbad, Berg\r
Weissenbach, Bahnhof\r
Weissenbach, Dorf\r
Weissenbach\r
Weissenberge\r
Weissenboden Zopfen (Kinzig)\r
Weissenburg\r
Weissenstein\r
Weissfluhgipfel\r
Weissfluhjoch\r
Weisshorn\r
Weisslingen, Mühle\r
Weisslingen, Oberhof\r
Weisslingen, Widum\r
Weisslingen, Brauiweiher\r
Weisslingen, Lendikerstrasse\r
Weisslingen, Dorf\r
Weisslingen, Bergwiesenstrasse\r
Weisstannen, Oberdorf\r
Weisstannen, Vorsiez\r
Weisstannen, Gemse\r
Weisstannen, Holzbrücke\r
Weisstannen, Schulhaus\r
Weisstannen, Logs\r
Weite, Plattis\r
Weite, Weitegartenweg\r
Weite, alte Gasse\r
Weite, Lonna/Heuwiese\r
Wellhausen, Weinfelderstrasse\r
Welschenrohr, Abzw. Malsenhof\r
Welschenrohr, Hinterdorf\r
Welschenrohr, Unterdorf\r
Welschenrohr, Brisenmatt\r
Welschenrohr, Zentrum\r
Welschenrohr, Lochboden\r
Weng (Tschenten)\r
Wengen\r
Wengen (Männlichenbahn)\r
Wengernalp\r
Wengernalp Wixi\r
Wengi b. Büren, Friedhof\r
Wengi b. Büren, Dorfplatz\r
Wengi b. Frutigen, Dorf\r
Wengi b. Frutigen, Schlundbach\r
Wengwald\r
Wenslingen, Mooshof\r
Wenslingen, Vorderdorf\r
Wenslingen, Hinterdorf\r
Werdenberg, Städtli\r
Wergenstein, Dorf\r
Wergenstein, Dumagns\r
Wergenstein, Lavanos\r
Wergenstein, Tguma\r
Wermatswil, Stapferstrasse\r
Wermatswil, Post\r
Wermatswil, Ledi\r
Wermatswil, Chammerholzstrasse\r
Wernetshausen, Dorf\r
Wernetshausen, Letten\r
Werthenstein\r
Werthenstein, Dorf\r
Wettingen, Zirkuswiese\r
Wettingen, Rebstock\r
Wettingen, Märzengasse\r
Wettingen, Bahnhofstrasse\r
Wettingen, Albisstrasse\r
Wettingen, Bahnhof\r
Wettingen, Jurastrasse\r
Wettingen, Halbartenstrasse\r
Wettingen, Kreuzkapelle\r
Wettingen, Staffelstrasse\r
Wettingen, Rathaus\r
Wettingen, Busgarage\r
Wettingen, Bushof\r
Wettingen, Langenstein\r
Wettingen, Hardstrasse\r
Wettingen, Stadion\r
Wettingen, Brunnenwiese\r
Wettingen, Tägi\r
Wettingen, Bahnhofplatz\r
Wettingen, Zentrumsplatz\r
Wettingen\r
Wettingen, Sonne\r
Wettingen, Schönenbühlstrasse\r
Wettingen, Tägipark\r
Wettingen, Kloster\r
Wettingen, Ligusterweg\r
Wettingen, St. Sebastian\r
Wettingen, Winkelried\r
Wettswil a.A., Grund\r
Wettswil a.A., Industrie\r
Wettswil a.A., Bäumlisächer\r
Wettswil a.A., Beerimoos\r
Wettswil a.A., Rehweid\r
Wettswil a.A., Oberhusen\r
Wettswil a.A., Langächer\r
Wettswil a.A., Dettenbühl\r
Wettswil a.A., Moosstrasse\r
Wettswil a.A., Chilenholzstr.\r
Wettswil a.A., Strumbergächer\r
Wettswil a.A., Eggächer\r
Wettswil a.A., Heissächerstr.\r
Wettswil a.A., Dorf\r
Wettswil a.A., Schürli\r
Wettswil a.A., Heidenchilen\r
Wetzikon ZH, Stadion\r
Wetzikon ZH, Pflegezentrum\r
Wetzikon ZH, Spital\r
Wetzikon ZH, Alpenblick\r
Wetzikon ZH, Schloss\r
Wetzikon ZH, Buchgrindel\r
Wetzikon ZH, Binzackerstrasse\r
Wetzikon ZH, Ettenhausen\r
Wetzikon ZH, Medikon/Kulti\r
Wetzikon ZH, Robenhausen\r
Wetzikon ZH, Bachtelstrasse\r
Wetzikon ZH, Wildbach\r
Wetzikon ZH, Bahnhof\r
Wetzikon ZH, Färberwisen\r
Wetzikon ZH, Zentrum\r
Wetzikon ZH, Kastellstrasse\r
Wetzikon ZH, Widum\r
Wetzikon ZH, Uster-/Weststr.\r
Wetzikon ZH, Friedhof\r
Wetzikon ZH, Sonnenfeld\r
Wetzikon ZH, Schönau\r
Wetzikon ZH, Motorenstrasse\r
Wetzikon ZH, Bahnhof Süd\r
Wetzikon ZH, Walfershausen\r
Wetzikon ZH, Oberwetzikon\r
Wetzikon ZH\r
Wetzikon ZH, Haldenstrasse\r
Wichtrach, Käserei\r
Wichtrach\r
Wichtrach, Murachere\r
Wichtrach, Thalgutstrasse\r
Wichtrach, Bernstrasse\r
Wichtrach, Dorfplatz\r
Wichtrach, Bahnhof\r
Widen, Dorf\r
Widen, Burkertsmatt\r
Widen, Imbismatt\r
Widen Heinrüti\r
Widnau, Espenstrasse\r
Widnau, Girlen\r
Widnau, Rosenau\r
Widnau, Nöllenstrasse\r
Widnau, Bünteli\r
Widnau, Rheinstrasse\r
Widnau, Post\r
Widnau, Güetli\r
Widnau, Gemeindehaus\r
Widnau, Rhydorf\r
Widnau, Viscose-Park\r
Widnau, Auenstrasse\r
Widnau, Wiesenrain Zoll\r
Widnau, Unterdorf\r
Widnau, Schlatt\r
Wiedlisbach, Kirchgasse\r
Wiedlisbach\r
Wiedlisbach, Wangenstrasse\r
Wiedlisbach, Stockrain\r
Wiedlisbach, Bahnhof\r
Wiedlisbach, Pflegeheim\r
Wienacht-Tobel\r
Wiesendangen\r
Wiesendangen, Oberdorf\r
Wiesendangen, Ländli\r
Wiesendangen, Wasserfuri\r
Wiesendangen, Gemeindehaus\r
Wiesendangen, Dorf\r
Wiesendangen, Attikerstrasse\r
Wiesendangen, Bahnhof\r
Wiesendangen, Hinterdorf\r
Wiesendangen, Baumschulstrasse\r
Wiesengrund\r
Wiezikon b.Sirnach, Wies\r
Wiezikon b.Sirnach, Weingarten\r
Wiezikon b.Sirnach, Widenacker\r
Wiggen, Hilfernstrasse\r
Wiggen, Wittenmoos\r
Wiggen, Schächli\r
Wiggen, Unterbach\r
Wiggen, Egghus\r
Wiggen b. Göschenen\r
Wigoltingen, Schulweg\r
Wigoltingen, Fabrikstrasse\r
Wigoltingen, Dorf\r
Wigoltingen, Engwangerstrasse\r
Wikon, Kreuzung\r
Wikon, Hotel Adelboden\r
Wikon, Schlossberg\r
Wil AG, Mitteldorfstrasse\r
Wil AG, Ausserdorf\r
Wil AG, Steinhof\r
Wil SG, Rapp\r
Wil SG, Weidle\r
Wil SG, Langegg/Turm Hofberg\r
Wil SG, Breitenloo\r
Wil SG, Bienenstrasse\r
Wil SG, Gallusstrasse\r
Wil SG, Stelz\r
Wil SG\r
Wil SG, Spital\r
Wil SG, Rose\r
Wil SG, Schwanen\r
Wil SG, Kapuziner Kloster\r
Wil SG, Bahnhof Süd\r
Wil SG, Neulanden\r
Wil SG, Wilerwald\r
Wil SG, Neugruben\r
Wil SG, Ulrich-Röschstrasse\r
Wil SG, Hofberg\r
Wil SG, Rudenzburg\r
Wil SG, Gruben\r
Wil SG, Altgruben\r
Wil SG, Bahnhof\r
Wil SG, Lenzenbüel\r
Wil SG, Winkelriedstrasse\r
Wil SG, Wilenstrasse\r
Wil SG, Höhenstrasse\r
Wil SG, Krebsbachbrücke\r
Wil SG, Oelberg\r
Wil SG, Klosterwiese\r
Wil SG, Waldau\r
Wil SG, Kreuzackerstrasse\r
Wil SG, Psychiatrie\r
Wil SG, Allmend\r
Wil SG, Bergholz\r
Wil SG, Quellenstrasse\r
Wil SG, Hof zu Wil\r
Wil SG, Stadtmarkt\r
Wil SG, Buebenloo\r
Wil SG, Kantonsschule\r
Wil SG, Letten\r
Wil SG, STIHL\r
Wil SG, Rössli\r
Wil SG, Neualtwil\r
Wil SG, Schönengrundweg\r
Wil SG, Rosenberg\r
Wil SG, Reuttistrasse\r
Wil SG, Zürcherstrasse\r
Wil SG, Flurhof\r
Wil SG, Eggfeld\r
Wil SG, Grundstrasse\r
Wil SG, Sonnenberg\r
Wil SG, Städeli\r
Wil SG, Pflegezentrum\r
Wil SG, Friedberg\r
Wil SG, Lindenhof\r
Wil ZH, Dorf\r
Wil ZH, Breitenmatt\r
Wil ZH, Lirenhof\r
Wila, Talgarten\r
Wila, Zentrum\r
Wila, Geissackerstrasse\r
Wila\r
Wila, Espistrasse\r
Wila, Bahnhof\r
Wilchingen, Kapellenweg\r
Wilchingen, Dorf\r
Wilchingen-Hallau, Bahnhof\r
Wilchingen-Hallau\r
Wildberg, Alte Post\r
Wilde Maa\r
Wildegg, Zentrum\r
Wildegg\r
Wildegg, Bahnhof/Talstrasse\r
Wildegg, Bahnhofplatz\r
Wildensbuch, Dorf\r
Wilderswil\r
Wilderswil, Boden\r
Wilderswil, Kirchgasse\r
Wilderswil, Oberland Shopping\r
Wilderswil, Bir Müli\r
Wilderswil, Lehngasse\r
Wilderswil, Stutz\r
Wilderswil, Ried\r
Wilderswil, Ufem Sand\r
Wilderswil, Rosshag\r
Wilderswil, Eichelti\r
Wilderswil, Bahnhof\r
Wildhaus, Schönau\r
Wildhaus, Dorf\r
Wildhaus, Lisighaus\r
Wildhaus, Dusi\r
Wildhaus, Bären\r
Wildhaus (Talstation Gamplüt)\r
Wildhaus Freienalp\r
Wildhaus Oberdorf\r
Wildhaus Thur (Talstation)\r
Wildpark-Höfli\r
Wilen (Gottshaus), Lauften\r
Wilen (Gottshaus), Wilen\r
Wilen (Gottshaus), Rehalp\r
Wilen (Gottshaus), Mollishaus\r
Wilen (Gottshaus), Hoferberg\r
Wilen (Sarnen), Kurhaus am See\r
Wilen (Sarnen), Wilerbad\r
Wilen (Sarnen), Badmatt\r
Wilen (Sarnen), Bodenmattli\r
Wilen (Sarnen), Dorf\r
Wilen bei Wil, Scheidweg\r
Wilen bei Wil, Gemeindezentrum\r
Wilen bei Wil, Langwiesen\r
Wilen bei Wil, Lerchenfeld\r
Wilen bei Wil, Engi\r
Wilen bei Wil, Glärnischstr.\r
Wilen bei Wil, Sonnenplatz\r
Wilen bei Wollerau, Eulen\r
Wilen bei Wollerau, Obereulen\r
Wilen bei Wollerau, Bahnhof\r
Wilen bei Wollerau\r
Wilen bei Wollerau, Schlyffi\r
Wilen Waldheim\r
Wiler\r
Wiler, Bahnhof\r
Wiler (Lötschen), Talstation\r
Wiler (Lötschen), Gschteinät\r
Wiler (Lötschen), Dorf\r
Wiler (Lötschen) (Talstation)\r
Wiler bei Seedorf, Stücki\r
Wiler bei Seedorf, Grissenberg\r
Wiler bei Seedorf, Neuwiler\r
Wiler bei Seedorf, Dorf\r
Wileroltigen, Dorf\r
Wileroltigen, Feld\r
Wileroltigen, Kindergarten\r
Wileroltigen, Mösli\r
Willerzell, Tschuppmoos\r
Willerzell, Birchbühl\r
Willerzell, Langen\r
Willerzell, Gasse\r
Willerzell, Stöfeli\r
Willerzell, Schönbächli\r
Willerzell, Erlen\r
Willerzell, Bodenmattli\r
Willerzell, Mösli\r
Willerzell, Dimmerbach\r
Willerzell, Kirche\r
Willerzell, Grüene Aff\r
Willigen, Dorf\r
Willigen, Unterdorf\r
Willigen, Klinik Reichenbach\r
Willigen (Reichenbachfallbahn)\r
Willisau, Widenmatt\r
Willisau, Feldli\r
Willisau, Bahnhof\r
Willisau, Friedhof\r
Willisau\r
Willisau, Feldmatt-Kapelle\r
Willisau, Zopfmatt\r
Willisau, Feld\r
Willisau, Leuenplatz\r
Willisau, Chrüzhof\r
Willisau, Zehntenplatz\r
Willisau, Postplatz\r
Willisau, Geissburg\r
Willisau, Mohrenplatz\r
Willisau, Schlossfeld\r
Willisau, Schlüsselacher\r
Willisau, Breiten\r
Wimmis, Dorf\r
Wimmis, Brodhüsi\r
Wimmis\r
Wimmis, Bachtele\r
Wimmis, Bahnhof\r
Windegg\r
Windisch, Zelgli\r
Windisch, Kurve\r
Windisch, Reformierte Kirche\r
Windisch, Gemeindehaus\r
Windisch, Dammstrasse\r
Windisch, Kunzareal\r
Windisch, Garage Knecht\r
Windisch, Dägerli\r
Windisch, Zentrum\r
Windisch, Breiti\r
Windisch, Löwen\r
Windisch, Weiermatt\r
Windisch, Habsburgstrasse\r
Windisch, Kath. Kirche\r
Windlach, Kreuz\r
Windlach, Raat\r
Winikon, Post\r
Winistorf, Mösli\r
Winkel, Oberdorf\r
Winkel, Seebüel\r
Winkel, Wisental\r
Winkel, Zentrum\r
Winkel, Oberrüti\r
Winkel, Bühlhof\r
Winkel am Zürichsee\r
Winterberg ZH, Dorf\r
Winterberg ZH, Wältiwis\r
Winteregg\r
Winteregg (Talst. Maulerhubel)\r
Wintersingen, Oberdorf\r
Wintersingen, Breitenhof\r
Wintersingen, Unterdorf\r
Wintersingen, Abzw. Nusshof\r
Wintersingen, Steindler\r
Wintersingen, Blumatt\r
Winterswil, Abzw.\r
Winterthur, Hauptbahnhof\r
Winterthur, Steigmühle\r
Winterthur, Rudolf Diesel\r
Winterthur, Rosenau\r
Winterthur, Schulhaus Wyden\r
Winterthur, Oberfeld\r
Winterthur, Schloss\r
Winterthur, Pfaffenwiesen\r
Winterthur, St. Urban\r
Winterthur, Pflanzschulstrasse\r
Winterthur, Wülflingen\r
Winterthur, Waldheim\r
Winterthur, Strahlegg\r
Winterthur, Zentrum Seen\r
Winterthur, Bäumliweg\r
Winterthur, Bruderhaus\r
Winterthur, Freibad Wülflingen\r
Winterthur, Grüntal\r
Winterthur, Brühleck\r
Winterthur, Haldengut\r
Winterthur, Guggenbühl\r
Winterthur, Friedliweg\r
Winterthur, Eishalle\r
Winterthur, Ausserdorf\r
Winterthur, Hedy Hahnloser\r
Winterthur, Kantonsschule\r
Winterthur, Industriepark\r
Winterthur, Letten\r
Winterthur, Schulhaus Seen\r
Winterthur, Binzenloo\r
Winterthur, Langwiesen\r
Winterthur, Blumenau\r
Winterthur, Bachtelstrasse\r
Winterthur, Friedhof\r
Winterthur, Römertor\r
Winterthur, Schlossberg\r
Winterthur, Oberwinterthur\r
Winterthur, Technorama\r
Winterthur, Talacker\r
Winterthur, Stadtrain\r
Winterthur, Else Züblin\r
Winterthur, Zeughaus\r
Winterthur, Bezirksgebäude\r
Winterthur, Breite\r
Winterthur, Gaswerk\r
Winterthur, Autobahn\r
Winterthur, Tellstrasse\r
Winterthur, Grüzenstrasse\r
Winterthur, Taa\r
Winterthur, Hinterwiesli\r
Winterthur, Grüze-Märkte\r
Winterthur, Lindenplatz\r
Winterthur, Feldtal\r
Winterthur, Nägelsee\r
Winterthur, Musikschule\r
Winterthur, Spital\r
Winterthur, Auwiesen\r
Winterthur, Stadthaus\r
Winterthur, Gewerbeschule\r
Winterthur, Museumstrasse/HB\r
Winterthur, Sulzer\r
Winterthur, Töss\r
Winterthur, Oberes Büel\r
Winterthur, Seen\r
Winterthur, Reutlingen\r
Winterthur, Steig\r
Winterthur, Post Seen\r
Winterthur, Wylandbrücke\r
Winterthur, Obstgartenweg\r
Winterthur, Finken-Rain\r
Winterthur, Brunngasse\r
Winterthur, Gutschick\r
Winterthur, Hardau\r
Winterthur, Fachschule\r
Winterthur, Klinik Schlosstal\r
Winterthur, Hohlandweg\r
Winterthur, Irchelstrasse\r
Winterthur, Waser\r
Winterthur, Fotozentrum\r
Winterthur, Schmidgasse\r
Winterthur, Oberseen\r
Winterthur, Schöntal\r
Winterthur, Nussbaumweg\r
Winterthur, Ohrbühl\r
Winterthur, Tössfeld\r
Winterthur, Rebwiesen\r
Winterthur, Stäffelistrasse\r
Winterthur, Unterdorf\r
Winterthur, Turmstrasse\r
Winterthur, Ziegeleiweg\r
Winterthur, Etzberg\r
Winterthur, Brücke\r
Winterthur, Grafenstein\r
Winterthur, Brudertobel\r
Winterthur, Dättnau\r
Winterthur, Grubenstr.\r
Winterthur, Scheidegg\r
Winterthur, Palmstrasse\r
Winterthur, Schwimmbad Töss\r
Winterthur, Stocken\r
Winterthur, Swica\r
Winterthur, Storchenbrücke\r
Winterthur, Zinzikon\r
Winterthur, Freizeitanlage\r
Winterthur, Bolrebenweg\r
Winterthur, Haltenreben\r
Winterthur, Hammerweg\r
Winterthur, Im Geissacker\r
Winterthur, Niederfeld\r
Winterthur, Neubruch\r
Winterthur, Jonas Furrer\r
Winterthur, Chli-Hegi\r
Winterthur, Eidberg\r
Winterthur, Obertor\r
Winterthur, Zentrum Töss\r
Winterthur, Schützenbühl\r
Winterthur, Waldegg\r
Winterthur, Gotzenwil\r
Winterthur, Sennhof\r
Winterthur, Schiltwiesen\r
Winterthur, Technikum\r
Winterthur, Hinterdorf Seen\r
Winterthur, Endliker\r
Winterthur, Bettenplatz\r
Winterthur, Rosenberg\r
Winterthur, Loorstrasse\r
Winterthur\r
Winterthur, Minervaplatz\r
Winterthur, Im Link\r
Winterthur, Archstrasse/HB\r
Winterthur, Schlossacker\r
Winterthur, Hegifeld\r
Winterthur, Depot\r
Winterthur, Hegi im Gern\r
Winterthur, Schulhaus Neuhegi\r
Winterthur, Loki\r
Winterthur, Brüttenerfussweg\r
Winterthur, Ziegelhütte\r
Winterthur, Klösterli Iberg\r
Winterthur, Deutweg\r
Winterthur, Schützenhaus\r
Winterthur, Schachenweg\r
Winterthur Grüze, Bahnhof Süd\r
Winterthur Grüze\r
Winterthur Hegi\r
Winterthur Seen\r
Winterthur Töss\r
Winterthur Wallrüti\r
Winterthur Wülflingen, Bahnhof\r
Winterthur Wülflingen\r
Winznau, Huttler\r
Winznau, Säliblick\r
Winznau, Ausserdorf\r
Winznau, Dorf\r
Wirzweli\r
Wisen SO, Kirche\r
Wisen SO, Adliken\r
Wisen SO, Sonne\r
Wislikofen, Dorf\r
Wislisau, Wirtschaft\r
Wissi Stei\r
Wittenbach, Im Grüntal\r
Wittenbach, Zentrum\r
Wittenbach, Sportanlagen\r
Wittenbach, Hofen\r
Wittenbach, Gommenschwil\r
Wittenbach, Oberlören\r
Wittenbach, Bächi\r
Wittenbach\r
Wittenbach, Gemeindehaus\r
Wittenbach, Bahnhof\r
Wittenbach, Grünau\r
Wittenbach, Unterlören\r
Wittenbach, Abacus-Platz\r
Witterswil, Sonnenrain\r
Witterswil, Station\r
Wittinsburg, Chamber\r
Wittinsburg, Flugtage\r
Wittinsburg, Tschattnau\r
Wittinsburg, Bodenacher\r
Wittnau, Hofmatt\r
Wittnau, Obere Gasse\r
Wittnau, alte Post\r
Wittnau, Mitteldorf\r
Wittnau, Erlenhof\r
Wittwil, Käserei\r
Wohlen AG, Telliacher\r
Wohlen AG, Turmstrasse\r
Wohlen AG, Bünzstrasse\r
Wohlen AG, Sonnhalde\r
Wohlen AG, Allmend\r
Wohlen AG, Kantonsschule\r
Wohlen AG, Junkholzweg\r
Wohlen AG, Rigacker\r
Wohlen AG, Litzibuech\r
Wohlen AG, Dammweg\r
Wohlen AG, Sonnezyt\r
Wohlen AG, Zürcherhof\r
Wohlen AG, Luegisland\r
Wohlen AG, Gerstmatt\r
Wohlen AG, Höhenweg\r
Wohlen AG, Büttikerstrasse\r
Wohlen AG, Brünismatt\r
Wohlen AG, Bünzmattschulen\r
Wohlen AG, Altersheim Bifang\r
Wohlen AG, Freiämterstrasse\r
Wohlen AG, Brühlmattstrasse\r
Wohlen AG, Raimattstrasse\r
Wohlen AG, Postplatz\r
Wohlen AG, Gyrenhübelstrasse\r
Wohlen AG, Cellpack Werk 1\r
Wohlen AG, Haldenschulen\r
Wohlen AG\r
Wohlen AG, Bahnhof\r
Wohlen AG, Cheiblerrain\r
Wohlen AG, Rösslimatt\r
Wohlen AG, Nordstrasse\r
Wohlen AG, Industriestrasse\r
Wohlen AG, Guggimatt\r
Wohlen AG, Ringstrasse\r
Wohlen AG, Stegmatt\r
Wohlen AG, Reithalle\r
Wohlen AG, Kirchenplatz\r
Wohlen AG, Rummelring\r
Wohlen AG, Freihofweg\r
Wohlen AG, obere Haldenstrasse\r
Wohlen AG, Manor\r
Wohlen AG, Freiämterhof\r
Wohlen AG, Wehrlistrasse\r
Wohlen AG, Braunwalder\r
Wohlen AG, Gemeindehaus\r
Wohlen AG, Hubäckerweg\r
Wohlen AG, Gewerbering\r
Wohlen AG, Allmenweg\r
Wohlen AG, Bleichi\r
Wohlen AG, Durisolstrasse\r
Wohlen AG, Schützenmatt\r
Wohlen AG, Jurastrasse\r
Wohlen AG, untere Farnbühlstr.\r
Wohlen AG, Sustenweg\r
Wohlen AG, Vogelsang\r
Wohlen AG, Schulen Junkholz\r
Wohlen AG, Riedmatt\r
Wohlen AG, Allmendstrasse\r
Wohlen AG, Planzer\r
Wohlen AG, Coop\r
Wohlen AG, Rigistrasse\r
Wohlen AG, Migros\r
Wohlen AG, Friedhof\r
Wohlen AG, Harzer\r
Wohlen b. Bern, Gemeindehaus\r
Wohlen b. Bern, Illiswil\r
Wohlen b. Bern, Riedhaus\r
Wohlen b. Bern, Schaufelacker\r
Wohlen b. Bern, Oberwohlen\r
Wohlen Oberdorf\r
Wohlenschwil, Mühlematten\r
Wohlenschwil, Zentrum\r
Wolfenschiessen\r
Wolfenschiessen, Bahnhof\r
Wolfenschiessen, Zelgli\r
Wolfertswil, alte Post\r
Wolfertswil, Magdenau\r
Wolfhalden, Schönenbühl\r
Wolfhalden, Hinterbühle\r
Wolfhalden, Friedberg\r
Wolfhalden, Luchten\r
Wolfhalden, Mühltobel\r
Wolfhalden, Hueb\r
Wolfhalden, Hinteregg\r
Wolfhalden, Lindenberg\r
Wolfhalden, Wüschbach\r
Wolfhalden, Falken\r
Wolfhalden, Dorf\r
Wolfhalden, Bruggmühle\r
Wolfhalden, Zelg\r
Wolfhalden, Lippenreute\r
Wolfhausen, Bachstrasse\r
Wolfhausen, Neugut\r
Wolfhausen, Zentrum\r
Wolfhausen, Oberwolfhausen\r
Wolfhausen, Hüebli\r
Wolfikon SG, Engel\r
Wolfikon SG, Freihof\r
Wölflinswil, Mühlmatt\r
Wölflinswil, Dorfplatz\r
Wölflinswil, Unterdorf\r
Wolfwil, Schulhaus\r
Wolfwil, Fulenbacherstrasse\r
Wolfwil, Oberdorf\r
Wolfwil, Schweissacker\r
Wolfwil, Zentrum\r
Wolhusen, Kreisel\r
Wolhusen, Ankenberg\r
Wolhusen, Neuemsern-Rossei\r
Wolhusen\r
Wolhusen, Tropenhaus\r
Wolhusen, Bahnhof\r
Wolhusen, Hohrüti/Höchweid\r
Wolhusen, Viadukt\r
Wolhusen, Berghofstrasse\r
Wolhusen, Spital\r
Wolhusen, Markt\r
Wolhusen, Emsern\r
Wolhusen Weid\r
Wolhusen Weid, Bahnhof\r
Wollerau, Chüngentobel\r
Wollerau, Junkerweg\r
Wollerau, Ried\r
Wollerau, Oswäldli\r
Wollerau, Schwalbenboden\r
Wollerau, Oberblatt\r
Wollerau, Schollenmatt\r
Wollerau, Obermühle\r
Wollerau, Felsenrain\r
Wollerau, Fürti\r
Wollerau, Wyssenfluh\r
Wollerau, Hafen\r
Wollerau, Wächlen\r
Wollerau, Verenahof\r
Wollerau, Erlenmatte\r
Wollerau\r
Wollerau, Sonnenberg\r
Wollerau, Bahnhof\r
Wollerau, Erlenmoos\r
Wollerau, Studenbühl\r
Wollerau, Weingarten/Bellevue\r
Wollerau, Dorfplatz\r
Wollerau, Roos\r
Wollerau, Hermannsweid\r
Worb, Bleiche\r
Worb, Lindhalde\r
Worb, Längmatt\r
Worb, Wyden Schulhaus\r
Worb, Mühlestrasse\r
Worb, Erlenweg\r
Worb, Blümlisalpstrasse\r
Worb, Toggenburg\r
Worb Dorf, Bahnhof\r
Worb Dorf, Bahnhofstrasse\r
Worb Dorf\r
Worb SBB\r
Worb SBB, Bahnhof\r
Worbboden\r
Worben, Bad\r
Worben, Busswilstrasse\r
Worben, Post\r
Worben, Gemeindehaus\r
Worben, Tribey\r
Worblaufen\r
Worblaufen, Bahnhof\r
Worblaufen, Sandhof\r
Worblaufen, Bahnhofplatz\r
Worblaufen, Altikofen West\r
Worblaufen, Babimoosweg\r
Worblaufen, Altikofen Süd\r
Worblaufen, Fischrainweg\r
Worblaufen, Altikofen Nord\r
Wöschnau\r
Wünnewil, Hagnet\r
Wünnewil, Schule\r
Wünnewil, Felsenegg\r
Wünnewil, Dorf\r
Wünnewil\r
Wuppenau, Untermörenau\r
Wuppenau, Im Rank\r
Wuppenau, Obermörenau-Hasenloh\r
Wuppenau, Abzw. Welfensberg\r
Wuppenau, Gemeindehaus\r
Würenlingen, Breite-Lochacker\r
Würenlingen, Sonne\r
Würenlingen, Kuhgässli\r
Würenlingen, Altersheim\r
Würenlingen, Post\r
Würenlingen, Weissenstein\r
Würenlingen, Bachstrasse\r
Würenlingen, Stumpen\r
Würenlingen, Bären\r
Würenlos\r
Würenlos, Flüefeld\r
Würenlos, Raiffeisenbank\r
Würenlos, Bahnhofplatz\r
Würenlos, Büntenstrasse\r
Würenlos, Bahnhof\r
Würenlos, Rössliplatz\r
Würenlos, Steigass\r
Würenlos, Lärchenweg\r
Würenlos, Altwiesen\r
Würenlos, Brunnenweg\r
Würenlos, Bettlen\r
Würenlos, Spycher\r
Würenlos, Limmatbrücke\r
Wurzenbord\r
Wynigen, Grüttermatt\r
Wynigen\r
Wynigen, Bahnhof\r
Wynigen, Oberer Kasten\r
Wyssachen, Dürrenbühl\r
Wyssachen, Dorf\r
Wyssachen, Abzw. Roggengrat\r
Wyssachen, Mösli\r
Yens, Moulin au Loup\r
Yens\r
Yens, village\r
Yens, gare\r
Yverdon, 4 Marronniers\r
Yverdon, Quai de la Thièle\r
Yverdon, Y-Parc/Découvertes\r
Yverdon, rue du Milieu\r
Yverdon, Riants-Fleurs\r
Yverdon, Centre Professionnel\r
Yverdon, Les Chaînettes\r
Yverdon, rue de Chamblon\r
Yverdon, Pierre de Savoie\r
Yverdon, Champs-Lovats\r
Yverdon, Collège de Fontenay\r
Yverdon, Léon-Jaquier sud\r
Yverdon, Léon-Jaquier nord\r
Yverdon, Grands Champs\r
Yverdon, Y-Parc/Galilée\r
Yverdon, Moulins Dessus\r
Yverdon, Clairs-Logis\r
Yverdon, Général-Guisan\r
Yverdon, chemin de la Chèvre\r
Yverdon, J.-J. Rousseau\r
Yverdon, Théâtre Benno Besson\r
Yverdon, Zone industrielle sud\r
Yverdon, rue de Montagny\r
Yverdon, rue des Uttins\r
Yverdon, Pont du Buron\r
Yverdon, Centre Thermal\r
Yverdon, Maison Blanche\r
Yverdon, rue de Bullet\r
Yverdon, Petits-Champs\r
Yverdon, Y-Parc/Pythagore\r
Yverdon, Collège des Rives\r
Yverdon William Barbey\r
Yverdon-les-Bains, 14 Avril\r
Yverdon-les-Bains, Condémines\r
Yverdon-les-Bains, Clendy\r
Yverdon-les-Bains, Bel-Air\r
Yverdon-les-Bains, Philosophes\r
Yverdon-les-Bains, Mujon\r
Yverdon-les-Bains, Cheminet\r
Yverdon-les-Bains, Bellevue\r
Yverdon-les-Bains, patinoire\r
Yverdon-les-Bains, Prés-du-Lac\r
Yverdon-les-Bains, HEIG-VD\r
Yverdon-les-Bains\r
Yverdon-les-Bains, hôpital\r
Yverdon-les-Bains, rue du Midi\r
Yverdon-les-Bains, gare\r
Yverdon-les-Bains,Maison Rouge\r
Yverdon-les-Bains, Blancherie\r
Yverdon-les-Bains, Les Pins\r
Yverdon-les-Bains, La Plaine\r
Yverdon-les-Bains, St-Georges\r
Yverdon-les-Bains, Faïencerie\r
Yverdon-les-Bains, Valentin\r
Yverdon-les-Bains, 24 Janvier\r
Yverdon-les-Bains, Les Moulins\r
Yverdon-les-Bains, Plaisance\r
Yverdon-les-Bains, La Colline\r
Yverdon-les-Bains, rue d'Orbe\r
Yverdon-les-Bains, Le Bey\r
Yverdon-les-Bains, Les Bains\r
Yverdon-les-Bains, L'Orient\r
Yverdon-les-Bains, La Marive\r
Yverdon-les-Bains, cimetière\r
Yverdon-les-Bains, La Sallaz\r
Yverdon-les-Bains (bateau)\r
Yvonand, La Grand'Moille\r
Yvonand, Les Vursys\r
Yvonand, En Brit\r
Yvonand, Les Vergers\r
Yvonand, gare\r
Yvonand, Sur Priales\r
Yvonand\r
Yvonand, dessus-du-village\r
Yvorne, Clos de l'Ombren\r
Yvorne, Le Torrent\r
Yvorne, Vers Morey\r
Yvorne, Les Rennauds\r
Yvorne, Socrettaz\r
Yvorne, anc. poste\r
Yvorne, Vers-Chenaux\r
Zauggenried\r
Zäziwil, Kronenplatz\r
Zäziwil\r
Zeglingen, Oberdorf\r
Zeglingen, Unterdorf\r
Zeglingen, Sagi\r
Zeihen, Hohbächli\r
Zeihen, Stauftel\r
Zeihen, Dorf\r
Zeihen, Abzw. Station Effingen\r
Zeiningen, Bernet\r
Zeiningen, Ausserdorf\r
Zeiningen, Unterdorf\r
Zeiningen, Mitteldorf\r
Zell LU, St. Urbanstrasse\r
Zell LU\r
Zell LU, Bahnhof\r
Zell ZH, Mühliwies\r
Zell ZH, Dorf\r
Zell ZH, Hand\r
Zeneggen, Alt Zeneggen\r
Zeneggen, Mittlere Hellela\r
Zeneggen, Klettergarten\r
Zeneggen, Saal\r
Zeneggen, Sonnenberg\r
Zeneggen, Gstei\r
Zeneggen, Bänna\r
Zeneggen, Obere Hellela\r
Zeneggen, Kirche\r
Zeneggen, Tola\r
Zeneggen, Wicherried\r
Zeneggen, Schönegg\r
Zenstadlen\r
Zermatt, Vispa\r
Zermatt, Schlüematta\r
Zermatt, Wiestiboden\r
Zermatt\r
Zermatt, Getwingbrücke\r
Zermatt, Kapelle Winkelmatten\r
Zermatt, Wiestibrücke\r
Zermatt, Brücke zum Steg\r
Zermatt, Untere Matten\r
Zermatt, Luchre\r
Zermatt, Spiss\r
Zermatt, ZenStecken\r
Zermatt, Wichje\r
Zermatt, Matterhorn Talstation\r
Zermatt, Kirchbrücke\r
Zermatt, Bahnhof\r
Zermatt (Matterhorn Talstat.)\r
Zermatt (Talstation Sunnegga)\r
Zermatt Breitboden\r
Zermatt Eisflue\r
Zermatt Gant\r
Zermatt GGB\r
Zermatt Hohtälli\r
Zermatt Joscht\r
Zermatt Schwarzsee\r
Zermatt Schweigmatten\r
Zermatt Tufterchumme\r
Zermatt Tuftern\r
Zernez, scoula\r
Zernez, Center Parc Naziunal\r
Zernez\r
Zernez, staziun\r
Zetzwil, Bahnhof\r
Zetzwil, Mitte\r
Zetzwil\r
Ziefen, Mühlegasse\r
Ziefen, Zentrum\r
Ziefen, Untertal\r
Ziefen, Hofmatt\r
Ziefen, Diegmatt\r
Ziegelbrücke, Bahnhof Nord\r
Ziegelbrücke, Bahnhof Süd\r
Ziegelbrücke, Alte Post\r
Ziegelbrücke\r
Zielebach, Gemeindehaus\r
Zignau, vitg\r
Zignau, Via Principala\r
Zihlbrücke\r
Zihlschlacht, Rehaklinik\r
Zihlschlacht, Oberdorf\r
Zihlschlacht, Mitteldorf\r
Zillis, Dorf\r
Zillis, Viamala-Schlucht\r
Zillis, Schulhaus\r
Zillis, Rania\r
Zimeysa\r
ZIMEYSA, gare\r
Zimmerwald, Budelkehr\r
Zimmerwald, Eichacher\r
Zimmerwald, Weiermatt\r
Zimmerwald, Kirche\r
Zimmerwald, Post\r
Zinal, village de vacances\r
Zinal, Le Bouillet\r
Zinal, Les Plats de la Lé\r
Zinal, centre\r
Zinal, Pralong\r
Zinal, télécabine\r
Zinal (télépherique)\r
Zinal Chiesso\r
Zizers, Tennishalle\r
Zizers, Stutz\r
Zizers, Schule Feld\r
Zizers, Rappagugg\r
Zizers, Bild\r
Zizers, Rathaus\r
Zizers\r
Zofingen, Schwimmbad\r
Zofingen, Eisengrube\r
Zofingen, Wässermattenweg\r
Zofingen, Mühlethalstrasse\r
Zofingen, Falkeisenmatte\r
Zofingen, Tagblatt\r
Zofingen, Bifangstrasse\r
Zofingen, Untere Brühlstrasse\r
Zofingen, Heitere Hirschpark\r
Zofingen, Frikartstrasse\r
Zofingen, Bethge\r
Zofingen, Riedtalstrasse\r
Zofingen, Bleiche\r
Zofingen, Ackerstrasse\r
Zofingen, Spitalgasse\r
Zofingen, Industrie Brühl\r
Zofingen, Römerbad\r
Zofingen, Bergli Friedhof\r
Zofingen, Spital\r
Zofingen, Heitereplatz\r
Zofingen\r
Zofingen, JHCO\r
Zofingen, Altachen\r
Zofingen, Bahnhofplatz\r
Zofingen, Bahnhofunterführung\r
Zofingen, Mühlewiese\r
Zofingen, Henzmannstrasse\r
Zofingen, Oberer Stadteingang\r
Zofingen, Haldenweg\r
Zofingen, Bahnhof\r
Zollbrück\r
Zollbrück, Zentrum\r
Zollbrück, Frittenbachstrasse\r
Zollbrück, Bahnhof\r
Zollbrück, Sekundarschulhaus\r
Zollhaus FR\r
Zollikerb., Langägerten/Spital\r
Zollikerberg, Sennhof\r
Zollikerberg, Station\r
Zollikerberg, Spital\r
Zollikerberg, Hasenbart\r
Zollikerberg, Trichtenhauserm.\r
Zollikerberg\r
Zollikerberg, Station/Q'treff\r
Zollikofen, Lüftern\r
Zollikofen, Kreuz\r
Zollikofen, Schäferei\r
Zollikofen, Erlachplatz\r
Zollikofen, Schulhaus West\r
Zollikofen, Schulhaus Ost\r
Zollikofen, alte Post\r
Zollikofen, Geisshubel\r
Zollikofen, Meielen Süd\r
Zollikofen, Hirzenfeld\r
Zollikofen, Rütti-Hochschule\r
Zollikofen, Webergutstrasse\r
Zollikofen, Blindenschule\r
Zollikofen, Wydacker\r
Zollikofen, Bahnhof\r
Zollikofen\r
Zollikon, Gemeindehaus\r
Zollikon, Dufourplatz\r
Zollikon, Goldhaldenplatz\r
Zollikon, Bleulerstrasse\r
Zollikon, Höhestrasse\r
Zollikon, Allmend\r
Zollikon, Bahnhof\r
Zollikon, Schützenstrasse\r
Zollikon, Rebwiesstrasse\r
Zollikon, Felbenstrasse\r
Zollikon, Rotfluhstrasse\r
Zollikon, Niederhofenrain\r
Zollikon\r
Zollikon, Bahnübergang\r
Zollikon, Beugi\r
Zollikon (See)\r
Zuben, Kreuzstrasse\r
Zuben, Käserei\r
Züberwangen, Weieren\r
Züberwangen, Lindenbaum\r
Züberwangen, Schulhaus\r
Züberwangen, Zentrum\r
Züberwangen, St. Gallerstrasse\r
Zuchwil, Buchenweg\r
Zuchwil, Rainstrasse\r
Zuchwil, Zentrum\r
Zuchwil, Amselweg\r
Zuchwil, Juraplatz\r
Zuchwil, Sportzentrum\r
Zuchwil, Birchi\r
Zuchwil, Martinshof\r
Zuchwil, Langfeld\r
Zuchwil, Kornfeld\r
Zuchwil, Unterfeld\r
Zuchwil, Aarmatt\r
Zuckenriet, Sproochbrugg\r
Zuckenriet, Bläuel\r
Zuckenriet, Dorf\r
Zufikon, Emaus\r
Zufikon, Algier\r
Zufikon, Bachhalde\r
Zufikon, Volg\r
Zufikon, Schulanlage\r
Zufikon, Haldenstrasse\r
Zufikon\r
Zufikon Belvédère\r
Zufikon Hammergut\r
Zug, Steinhof\r
Zug, Feldstrasse\r
Zug, Athene\r
Zug, Dammstrasse/Bahnhof\r
Zug, Gimenen\r
Zug, Obmoos\r
Zug, Gartenstadt\r
Zug, Bundesplatz\r
Zug, Rankhof\r
Zug, Chollermüli\r
Zug, Schutzengel\r
Zug, Brüggli\r
Zug, Schützenmatt\r
Zug, Schulhaus Herti\r
Zug, Eichwaldstrasse\r
Zug, Roost\r
Zug, Feldhof\r
Zug, Aabachstrasse\r
Zug, Oberwiler Kirchweg\r
Zug, Rötelstrasse\r
Zug, Riedmatt\r
Zug, Stampfi\r
Zug, Schönegg\r
Zug, Oberallmend\r
Zug, Bibliothek\r
Zug, Burgbach\r
Zug, Göbli\r
Zug, Letzi\r
Zug, Gutschweg\r
Zug, Lüssirain\r
Zug, Hasenbüel\r
Zug, Fadenstrasse\r
Zug, Bleichi\r
Zug, Rank\r
Zug, Stadion\r
Zug, Obersack\r
Zug, Kistenfabrik\r
Zug, Hänggelisteig\r
Zug, Guggital\r
Zug, Hänibüel\r
Zug, Kantonsschule\r
Zug, Pulverhüsli\r
Zug, Meisenberg\r
Zug, Freudenberg\r
Zug, Bahnhofplatz\r
Zug, St. Johannes\r
Zug, Frauensteinmatt\r
Zug, Bellevueweg\r
Zug, Rütli\r
Zug, Metalli/Bahnhof\r
Zug\r
Zug, Kolinplatz\r
Zug, Theater Casino\r
Zug, Lorzen\r
Zug, Mänibach\r
Zug, Liebfrauenhof\r
Zug, Landis & Gyr/Bahnhof\r
Zug, V-Zug\r
Zug, Postplatz\r
Zug, Salesianum\r
Zug, Guthirt\r
Zug, Gutsch\r
Zug, Rüschenhof\r
Zug, Weidstrasse\r
Zug, Ammannsmatt\r
Zug, Grienbach\r
Zug, Sternwarte\r
Zug, St. Michael\r
Zug, Weinberghöhe\r
Zug Bahnhofsteg (See)\r
Zug Casino\r
Zug Chollermüli\r
Zug Fridbach\r
Zug Landsgemeindeplatz (See)\r
Zug Oberwil\r
Zug Postplatz\r
Zug Schutzengel\r
Zugerberg\r
Zullwil, Dorf\r
Zullwil, Gilgenberg\r
Zumhof\r
Zumholz, Abzweigung\r
Zumholz, Guggersbachbrücke\r
Zumholz, Dorf\r
Zumikon, Dorfzentrum\r
Zumikon, Gössikon\r
Zumikon\r
Zunzgen, Neumatt\r
Zunzgen, Dorf\r
Zunzgen, Büchel\r
Zuoz, Chaunt da Crusch\r
Zuoz, Aguêl\r
Zuoz, staziun\r
Zuoz\r
Zuoz Chastlatsch\r
Zuoz Chastlatsch (Pizzet)\r
Zuoz Chaunt da Crusch\r
Zuoz Crasta (Albanas)\r
Zürchersmühle\r
Zürich, Albisrank\r
Zürich, Appenzellerstrasse\r
Zürich, Aargauerstrasse\r
Zürich, Auzelg\r
Zürich, Albisriederplatz\r
Zürich, Bad Allenmoos\r
Zürich, Bäckeranlage\r
Zürich, Bertastrasse\r
Zürich, Billoweg\r
Zürich, Lerchenrain\r
Zürich, Lerchenhalde\r
Zürich, Leimgrübelstrasse\r
Zürich, Letzistrasse\r
Zürich, Letzipark West\r
Zürich, Micafil\r
Zürich, Central\r
Zürich, Neumarkt\r
Zürich, Neuaffoltern\r
Zürich, Mittelleimbach\r
Zürich, Militär-/Langstrasse\r
Zürich, Nordstrasse\r
Zürich, Milchbuck\r
Zürich, Leutschenbach\r
Zürich, Museum für Gestaltung\r
Zürich, Luchswiesen\r
Zürich, Mühlacker\r
Zürich, Oberwiesenstrasse\r
Zürich, Orionstrasse\r
Zürich, Rotbuchstrasse\r
Zürich, Regensbergbrücke\r
Zürich, Schlyfi\r
Zürich, Riedgraben\r
Zürich, Schumacherweg\r
Zürich, Rennweg\r
Zürich, Salzweg\r
Zürich, Dangelstrasse\r
Zürich, Schwert\r
Zürich, Ueberlandpark\r
Zürich, Schweizer Rück\r
Zürich, Dreiwiesen\r
Zürich, EPI-Klinik\r
Zürich, Seerose\r
Zürich, Flurstrasse\r
Zürich, Englischviertelstrasse\r
Zürich, Zentrum Witikon\r
Zürich, Ettenfeld\r
Zürich, Freiestrasse\r
Zürich, Frymannstrasse\r
Zürich, Fronwald\r
Zürich, Friedhof Hönggerberg\r
Zürich, Balgrist\r
Zürich, Würzgraben\r
Zürich, Farbhof\r
Zürich, Bachmattstrasse\r
Zürich, Auzelg Ost\r
Zürich, Am Börtli\r
Zürich, Beckenhof\r
Zürich, Aubrücke\r
Zürich, Baslerstrasse\r
Zürich, Bernoulli-Häuser\r
Zürich, Berghaldenstrasse\r
Zürich, Bezirksgebäude\r
Zürich, Bethanien\r
Zürich, Besenrainstrasse\r
Zürich, Birch-/Glatttalstrasse\r
Zürich, Blumenfeldstrasse\r
Zürich, Birchstrasse\r
Zürich, Bollingerweg\r
Zürich, Brunau/Mutschellenstr.\r
Zürich, Kronenstrasse\r
Zürich, Max-Bill-Platz\r
Zürich, Langensteinenstrasse\r
Zürich, Lochergut\r
Zürich, Neunbrunnen\r
Zürich, Oerlikerhus\r
Zürich, Nürenbergstrasse\r
Zürich, Mötteliweg\r
Zürich, Loogarten\r
Zürich, Probstei\r
Zürich, Maillartstrasse\r
Zürich, Rautistrasse\r
Zürich, Riedhofstrasse\r
Zürich, Rautihalde\r
Zürich, Platte\r
Zürich, Stodolastrasse\r
Zürich, Sackzelg\r
Zürich, Riedbach\r
Zürich, Saalsporthalle\r
Zürich, Rütihof\r
Zürich, Schaffhauserplatz\r
Zürich, Schulhaus Altweg\r
Zürich, Röntgenstrasse\r
Zürich, Löwenbräu\r
Zürich, Chinagarten\r
Zürich, Einfangstrasse\r
Zürich, Schäppiweg\r
Zürich, Segantinistrasse\r
Zürich, Fischerweg\r
Zürich, Fernsehstudio\r
Zürich, Hallenbad Oerlikon\r
Zürich, Herzogenmühlestrasse\r
Zürich, Höfliweg\r
Zürich, Hagenholz\r
Zürich, Germaniastrasse\r
Zürich, Hinterbergstrasse\r
Zürich, Friedhof Sihlfeld\r
Zürich, Hölderlinstrasse\r
Zürich, Helmhaus\r
Zürich, Glaubtenstrasse\r
Zürich, Hegianwandweg\r
Zürich, Geeringstrasse\r
Zürich, Grimselstrasse\r
Zürich, Hertensteinstrasse\r
Zürich, Hügelstrasse\r
Zürich, Helvetiaplatz\r
Zürich, Im Hagacker\r
Zürich, Sädlenweg\r
Zürich, Kirche Fluntern\r
Zürich, Kinkelstrasse\r
Zürich, Kalchbühlweg\r
Zürich, Kienastenwies\r
Zürich, Kappenbühlweg\r
Zürich, Kantonsschule\r
Zürich, Segeten\r
Zürich, Sihlquai/HB\r
Zürich, Spyristeig\r
Zürich, Sportweg\r
Zürich, Spyriplatz\r
Zürich, Untermoosstrasse\r
Zürich, Thujastrasse\r
Zürich, Toni-Areal\r
Zürich, Universität Irchel\r
Zürich, Waidspital\r
Zürich, Vogelsangstrasse\r
Zürich, Werd\r
Zürich, Waidbadstrasse\r
Zürich, Wartau\r
Zürich, Wieslergasse\r
Zürich, Widmerstrasse\r
Zürich, Zypressenstrasse\r
Zürich, Wollishoferplatz\r
Zürich, Binz\r
Zürich, Elektrowatt\r
Zürich, Leutschenpark\r
Zürich, Escher-Wyss-Platz\r
Zürich, Balgrist Ost\r
Zürich, Höschgasse\r
Zürich, Meierhofplatz\r
Zürich, Grünwald\r
Zürich, Hungerbergstrasse\r
Zürich, Albisgütli\r
Zürich, Am Suteracher\r
Zürich, Ausserdorfstrasse\r
Zürich, Berufswahlschule\r
Zürich, Grubenstrasse\r
Zürich, Bristenstrasse\r
Zürich, Buchholz\r
Zürich, Bucheggplatz\r
Zürich, Brunaustrasse\r
Zürich, Binz Center\r
Zürich, Bleulerstrasse\r
Zürich, Krematorium Nordheim\r
Zürich, Marbachweg\r
Zürich, Klusplatz\r
Zürich, Manesseplatz\r
Zürich, Messe/Hallenstadion\r
Zürich, Langgrütstrasse\r
Zürich, Letzigrund\r
Zürich, Landiwiese\r
Zürich, Neeserweg\r
Zürich, Paradeplatz\r
Zürich, Okenstrasse\r
Zürich, Rosengartenstrasse\r
Zürich, Schweighof\r
Zürich, SBB-Werkstätte\r
Zürich, Salersteig\r
Zürich, Schauenberg\r
Zürich, Seebacherplatz\r
Zürich, Seebach\r
Zürich, Dunkelhölzli\r
Zürich, ETH/Universitätsspital\r
Zürich, ETH Hönggerberg\r
Zürich, Glattwiesen\r
Zürich, Friedackerstrasse\r
Zürich, Giblenstrasse\r
Zürich, Friedhof Witikon\r
Zürich, Hardturm\r
Zürich, Hardplatz\r
Zürich, Friedhof Schwandenholz\r
Zürich, Hardhof\r
Zürich, Hohenklingensteig\r
Zürich, Hubertus\r
Zürich, Hottingerplatz\r
Zürich, Herdernstrasse\r
Zürich, Hadlaubstrasse\r
Zürich, Im Wingert\r
Zürich, Kanonengasse\r
Zürich,Kalkbreite/Bhf.Wiedikon\r
Zürich, Seidelhof\r
Zürich, Sihlcity\r
Zürich, Singlistrasse\r
Zürich, Stampfenbachplatz\r
Zürich, Siemens\r
Zürich, Sonneggstrasse\r
Zürich, Seilbahn Rigiblick\r
Zürich, Stierenried\r
Zürich, Waffenplatz-/Bederstr.\r
Zürich, Toblerplatz\r
Zürich, Waidhof\r
Zürich, Waidfussweg\r
Zürich, Verenastrasse\r
Zürich, Weihersteig\r
Zürich, Zwinglihaus\r
Zürich, Zürichbergstrasse\r
Zürich, Winzerhalde\r
Zürich, Schaufelbergerstrasse\r
Zürich, Besenrainweg\r
Zürich, Obere Hornhalde\r
Zürich, Arnikahof\r
Zürich, Goldackerweg\r
Zürich, Glockenacker\r
Zürich, Glaubtenstrasse Süd\r
Zürich, Hofstrasse\r
Zürich, Friesenberghalde\r
Zürich, Hedwigsteig\r
Zürich, Hürstholz\r
Zürich, Im Klösterli\r
Zürich, In der Ey\r
Zürich, Heubeeriweg\r
Zürich, Kempfhofsteig\r
Zürich, Klosbach\r
Zürich, Jugendherberge\r
Zürich, Kapfstrasse\r
Zürich, Sihlcity Nord\r
Zürich, Sihlweidstrasse\r
Zürich, Technopark\r
Zürich, Sprecherstrasse\r
Zürich, Stadtgrenze\r
Zürich, Talwiesenstrasse\r
Zürich, Sternen Oerlikon\r
Zürich, Trichtenhausenfussweg\r
Zürich, Unteraffoltern\r
Zürich, Strassenverkehrsamt\r
Zürich, Zwielplatz\r
Zürich, Waldhaus Dolder\r
Zürich, Werdhölzli\r
Zürich, Waldgarten\r
Zürich, Buchzelgstrasse\r
Zürich, Wipkingerplatz\r
Zürich, Zoo/Forrenweid\r
Zürich, Bärenbohlstrasse\r
Zürich, Aspholz\r
Zürich, Albisriederdörfli\r
Zürich, Albisrieden\r
Zürich, Althoos\r
Zürich, Altenhofstrasse\r
Zürich, Buhnstrasse\r
Zürich, Bircher-Benner\r
Zürich, Botanischer Garten\r
Zürich, Kantonalbank\r
Zürich, Laubegg\r
Zürich, Langmauerstrasse\r
Zürich, Lettenstrasse\r
Zürich, Michelstrasse\r
Zürich, Neubühl\r
Zürich, Morgental\r
Zürich, Lägernstrasse\r
Zürich, Limmatplatz\r
Zürich, Lehenstrasse\r
Zürich, Museum Rietberg\r
Zürich, Löwenplatz\r
Zürich, Brunnenhof\r
Zürich, Rathaus\r
Zürich, Rehalp\r
Zürich, Roswiesen\r
Zürich, Rebbergsteig\r
Zürich, Schürgistrasse\r
Zürich, Saatlenstrasse\r
Zürich, Butzenstrasse\r
Zürich, Rentenanstalt\r
Zürich, Scheuchzerstrasse\r
Zürich, Drusbergstrasse\r
Zürich, Schönauring\r
Zürich, Eschergutweg\r
Zürich, Dreispitz\r
Zürich, Felsenrainstrasse\r
Zürich, Fellenbergstrasse\r
Zürich, Flühgasse\r
Zürich, Feusisbergli\r
Zürich, Freihofstrasse\r
Zürich, Frankental\r
Zürich, Guggachstrasse\r
Zürich, Frohburg\r
Zürich, Haldenegg\r
Zürich, Friedhof Eichbühl\r
Zürich, Schanzackerstrasse\r
Zürich, Rote Fabrik\r
Zürich, Alte Trotte\r
Zürich, Bahnhofstrasse/HB\r
Zürich, Bändliweg\r
Zürich, Berninaplatz\r
Zürich, Birchdörfli\r
Zürich, Letzibach\r
Zürich, Luegisland\r
Zürich, Mattenhof\r
Zürich, Köschenrüti\r
Zürich, Manegg\r
Zürich, Kunsthaus\r
Zürich, Krönleinstrasse\r
Zürich, Altes Krematorium\r
Zürich, Letzipark\r
Zürich, Lindenplatz\r
Zürich, Nordheimstrasse\r
Zürich, Laubiweg\r
Zürich, Loorenstrasse\r
Zürich, Quellenstrasse\r
Zürich, Ottikerstrasse\r
Zürich, Renggerstrasse\r
Zürich, Maienweg\r
Zürich, Rudolf-Brun-Brücke\r
Zürich, Räffelstrasse\r
Zürich, Schmiede Wiedikon\r
Zürich, Röslistrasse\r
Zürich, Schulhaus Buchlern\r
Zürich, Bürkliplatz\r
Zürich, Burgwies\r
Zürich, Schwandenholz\r
Zürich, Schwamendingerplatz\r
Zürich, Schützenhaus Höngg\r
Zürich, Chaletweg\r
Zürich, Dorflinde\r
Zürich, Flobotstrasse\r
Zürich, Förrlibuckstrasse\r
Zürich, Friedhof Enzenbühl\r
Zürich, Bahnhofquai/HB\r
Zürich, Rigiblick\r
Zürich, Goldbrunnenplatz\r
Zürich, Hegibachplatz\r
Zürich, Kreuzplatz\r
Zürich, Hertersteg\r
Zürich, Feldeggstrasse\r
Zürich, Opernhaus\r
Zürich, Wildbachstrasse\r
Zürich, Heizenholz\r
Zürich, Zehntenhausplatz\r
Zürich, Altried\r
Zürich, Fröhlichstrasse\r
Zürich, Kinderspital\r
Zürich, Friedhof Uetliberg\r
Zürich, Hölderlinsteig\r
Zürich, Grünaustrasse\r
Zürich, Holzerhurd\r
Zürich, Im Gut\r
Zürich, Gutstrasse\r
Zürich, Güterbahnhof\r
Zürich, Im Hüsli\r
Zürich, Himmeri\r
Zürich, Juchhof\r
Zürich, Sihlstrasse\r
Zürich, Susenbergstrasse\r
Zürich, Titlisstrasse\r
Zürich, Tobelhof\r
Zürich, Tierspital\r
Zürich, Trichtisal\r
Zürich, Sukkulentensammlung\r
Zürich, Vulkanstrasse\r
Zürich, Voltastrasse\r
Zürich, Uetlihof\r
Zürich, Tunnelstrasse\r
Zürich, Stockerstrasse\r
Zürich, Wonnebergstrasse\r
Zürich, Wetlistrasse\r
Zürich, Winzerstrasse\r
Zürich, Römerhof\r
Zürich, Dolder\r
Zürich, Triemli\r
Zürich, Reckenholz\r
Zürich, Käferberg\r
Zürich, Glaubtenstrasse Nord\r
Zürich, Schiffbau\r
Zürich, Kantonsschule Enge\r
Zürich, Klinik Hirslanden\r
Zürich, Haldenbach\r
Zürich, Hirzenbach\r
Zürich, Hirschwiesenstrasse\r
Zürich, Friesenbergstrasse\r
Zürich, Friesenberg\r
Zürich, Friedrichstrasse\r
Zürich, Heerenwiesen\r
Zürich, Hönggerberg\r
Zürich, Im Ebnet\r
Zürich, Goldauerstrasse\r
Zürich, Herbstweg\r
Zürich, Heuried\r
Zürich, Im Walder\r
Zürich, Genossenschaftsstrasse\r
Zürich, Käshaldenstrasse\r
Zürich, Kappeli\r
Zürich, Kernstrasse\r
Zürich, Sihlpost/HB\r
Zürich, Signaustrasse\r
Zürich, Solidapark\r
Zürich, Stauffacher\r
Zürich, Tulpenstrasse\r
Zürich, Tüffenwies\r
Zürich, Staudenbühl\r
Zürich, Waffenplatzstrasse\r
Zürich, Triemlispital\r
Zürich, Strickhof\r
Zürich, Waserstrasse\r
Zürich, Zweiackerstrasse\r
Zürich, Winkelriedstrasse\r
Zürich, Wiesliacher\r
Zürich, Zoo\r
Zürich, Zielweg\r
Zürich, Hermetschloo\r
Zürich, Grünauring\r
Zürich, Kreuzstrasse\r
Zürich, Bellevue\r
Zürich, Bahnhofplatz/HB\r
Zürich Affoltern, Bahnhof\r
Zürich Affoltern\r
Zürich Altstetten, Bahnhof N\r
Zürich Altstetten, Bahnhof\r
Zürich Altstetten\r
Zürich Bellevue (See)\r
Zürich Binz\r
Zürich Brunau\r
Zürich Bürkliplatz (See)\r
Zürich Central (Polybahn)\r
Zürich Enge, Bahnhof\r
Zürich Enge, Bahnhof/Bederstr.\r
Zürich Enge\r
Zürich Flughafen, Bahnhof\r
Zürich Flughafen, Werft\r
Zürich Flughafen, REGA\r
Zürich Flughafen, Werkhof\r
Zürich Flughafen, Fracht\r
Zürich Flughafen, OPC\r
Zürich Flughafen\r
Zürich Friesenberg\r
Zürich Giesshübel\r
Zürich Hardbrücke, Bahnhof\r
Zürich Hardbrücke\r
Zürich HB\r
Zürich HB SZU\r
Zürich Landesmuseum (See)\r
Zürich Leimbach, Bahnhof\r
Zürich Leimbach\r
Zürich Limmatquai\r
Zürich Manegg\r
Zürich Oerlikon, Bahnhof Nord\r
Zürich Oerlikon, Bahnhof\r
Zürich Oerlikon, Bahnhof Ost\r
Zürich Oerlikon\r
Zürich Polyterrasse\r
Zürich Rehalp\r
Zürich Saalsporthalle\r
Zürich Schweighof\r
Zürich Seebach\r
Zürich Selnau, Bahnhof\r
Zürich Selnau\r
Zürich Stadelhofen, Bahnhof\r
Zürich Stadelhofen\r
Zürich Storchen\r
Zürich Tiefenbrunnen\r
Zürich Tiefenbrunnen, Bahnhof\r
Zürich Tiefenbrunnen (See)\r
Zürich Triemli\r
Zürich Wiedikon\r
Zürich Wiedikon, Bahnhof\r
Zürich Wipkingen, Bahnhof\r
Zürich Wipkingen\r
Zürich Wollishofen, Bhf/Werft\r
Zürich Wollishofen,Bhf/Staubst\r
Zürich Wollishofen\r
Zürich Wollishofen, Bahnhof\r
Zürich Wollishofen (See)\r
Zürichhorn (See)\r
Zurzacherberg, Passhöhe\r
Zuzgen, Gemeindezentrum\r
Zuzgen, Oberdorf\r
Zuzgen, Niederhofen\r
Zuzgen, Mühle\r
Zuzwil BE, Dorfplatz\r
Zuzwil BE, Bergacker\r
Zuzwil SG, Grünegg\r
Zuzwil SG, Gemeindehaus\r
Zuzwil SG, Industrie\r
Zuzwil SG, Schule\r
Zweibrücken, Bahnhof\r
Zweibrücken\r
Zweidlen, Riverside\r
Zweidlen, Bahnhof\r
Zweidlen, Zweidlergraben\r
Zweidlen\r
Zweilütschinen, Bahnhof\r
Zweilütschinen\r
Zweisimmen, Sparenmoos\r
Zweisimmen, Obegg\r
Zweisimmen, Site Alp\r
Zweisimmen, Heimchueweid\r
Zweisimmen, Burg Mannried\r
Zweisimmen, Spital\r
Zweisimmen, Bahnhof Ost\r
Zweisimmen, Talst. Rinderberg\r
Zweisimmen, Spitz Mannried\r
Zweisimmen, Forellensee\r
Zweisimmen\r
Zweisimmen, Zentrum\r
Zweisimmen (Talst. Rinderberg)\r
Zwieselberg, Glütsch\r
Zwieselberg, Hani\r
Zwillikon, Fehrenbach\r
Zwillikon, Lochhof\r
Zwillikon, Gemeindeplatz\r
Zwingen, Bahnhof\r
Zwingen, Schulhaus\r
Zwingen, Nenzlingenmatten\r
Zwingen, Schützenhaus\r
Zwingen, Laufenstrasse\r
Zwingen, Strengenfeld\r
Zwingen\r
Zwirgi\r
Zwischbergen, Bord\r
Zwischbergen, Belleggen\r
Zwischbergen, Sera\r
Zwischbergen, Hof\r
Zwischenflüh, Allmiried\r
Zwischenflüh, Anger\r
Zwischenflüh, Haueten\r
Zwischenflüh, Seebergstrasse`})),Id=t((()=>{n(),r(),ps(),xs(),Hs(),Sc(),dl(),ml(),Cl(),Bu(),Mc(),nd(),ld(),_d(),Nd(),Fd();var e=Pd.split(`
`).map(e=>e.trim().replace(/"/g,``)).filter(Boolean).slice(1);document.getElementById(`sbb-timetable-form-wrapper`)?(t(),i()):new MutationObserver(e=>{e.some(e=>e.target instanceof HTMLFormElement&&e.target.id===`sbb-timetable-form-wrapper`)&&(t(),i())}).observe(document.body,{subtree:!0,attributes:!0,attributeFilter:[`id`],childList:!0});function t(){let t=document.getElementById(`sbb-timetable-form-wrapper`),n=document.getElementById(`sbb-timetable-form-field-input-from`),r=document.getElementById(`sbb-timetable-form-field-input-to`),i=document.getElementById(`sbb-timetable-form-field-autocomplete-from`),a=document.getElementById(`sbb-timetable-form-field-autocomplete-to`),o=[[n,i],[r,a]];t.addEventListener(`submit`,e=>{e.preventDefault(),l(e)});for(let[e,t]of o)e.addEventListener(`input`,e=>{let n=e.target.value.trim(),r=s(n,t);if(!n||r.length===0){t.close();return}t.append(...r)}),e.addEventListener(`focusout`,()=>{setTimeout(()=>{t.close()},200)});function s(t,n){let r=c(t);return Array.from(n.children).forEach(e=>e.remove()),e.filter(e=>c(e).includes(r)).sort((e,t)=>e.length-t.length).slice(0,10).map(e=>{let t=document.createElement(`sbb-option`);return t.textContent=e,t.value=e,t})}function c(e){return e.toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[^a-z0-9]/gi,``)}function l(e){e.preventDefault();let t=u();window.open(t,`_blank`).focus()}function u(){let e=d(),t=p(),n=f(),r=m(),i=h(),a=new URL(`https://www.sbb.ch/${e}`);return a.searchParams.set(`moment`,`${t}`),n&&a.searchParams.set(`day`,`${n}`),r&&a.searchParams.set(`stops`,`${r}`),i&&a.searchParams.set(`time`,`${i}`),a.searchParams.set(`at_medium`,`affiliate`),a.searchParams.set(`at_campaign`,`b2p`),a.searchParams.set(`at_type`,`affiliate-tracking-type-placeholder`),a.toString()}function d(){return document.documentElement.lang||`de`}function f(){let e=(document.getElementById(`sbb-timetable-form-details-date-input`)?.value||``).match(/(\d{2})\.(\d{2})\.(\d{4})/);return e?`${e[3]}-${e[2]}-${e[1]}`:null}function p(){return document.getElementById(`sbb-timetable-form-details-toggle-option-arrival`).checked?`arr`:`dep`}function m(){let e=n.value,t=r.value;return!e&&!t?null:e+`~`+t}function h(){return(document.getElementById(`sbb-timetable-form-details-time-input`)?.value).replace(`:`,`_`)}}function i(){let e=new Date;document.getElementById(`sbb-timetable-form-details-date-input`).value=e.toLocaleDateString(`de-CH`)}}));n(),Id()});
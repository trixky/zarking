function y(){}function O(n,t){for(const e in t)n[e]=t[e];return n}function b(n){return n()}function k(){return Object.create(null)}function m(n){n.forEach(b)}function q(n){return typeof n=="function"}function z(n,t){return n!=n?t==t:n!==t||n&&typeof n=="object"||typeof n=="function"}function F(n){return Object.keys(n).length===0}function M(n,...t){if(n==null){for(const o of t)o(void 0);return y}const e=n.subscribe(...t);return e.unsubscribe?()=>e.unsubscribe():e}function P(n,t,e){n.$$.on_destroy.push(M(t,e))}function S(n,t,e,o){if(n){const r=x(n,t,e,o);return n[0](r)}}function x(n,t,e,o){return n[1]&&o?O(e.ctx.slice(),n[1](o(t))):e.ctx}function A(n,t,e,o){if(n[2]&&o){const r=n[2](o(e));if(t.dirty===void 0)return r;if(typeof r=="object"){const a=[],h=Math.max(t.dirty.length,r.length);for(let i=0;i<h;i+=1)a[i]=t.dirty[i]|r[i];return a}return t.dirty|r}return t.dirty}function B(n,t,e,o,r,a){if(r){const h=x(t,e,o,a);n.p(h,r)}}function C(n){if(n.ctx.length>32){const t=[],e=n.ctx.length/32;for(let o=0;o<e;o++)t[o]=-1;return t}return-1}let s;function l(n){s=n}function $(){if(!s)throw new Error("Function called outside component initialization");return s}function D(n){$().$$.on_mount.push(n)}function G(n){$().$$.after_update.push(n)}const u=[],p=[];let c=[];const w=[],j=Promise.resolve();let d=!1;function E(){d||(d=!0,j.then(v))}function H(){return E(),j}function _(n){c.push(n)}const g=new Set;let f=0;function v(){if(f!==0)return;const n=s;do{try{for(;f<u.length;){const t=u[f];f++,l(t),I(t.$$)}}catch(t){throw u.length=0,f=0,t}for(l(null),u.length=0,f=0;p.length;)p.pop()();for(let t=0;t<c.length;t+=1){const e=c[t];g.has(e)||(g.add(e),e())}c.length=0}while(u.length);for(;w.length;)w.pop()();d=!1,g.clear(),l(n)}function I(n){if(n.fragment!==null){n.update(),m(n.before_update);const t=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,t),n.after_update.forEach(_)}}function J(n){const t=[],e=[];c.forEach(o=>n.indexOf(o)===-1?t.push(o):e.push(o)),e.forEach(o=>o()),c=t}export{G as a,p as b,P as c,S as d,A as e,k as f,C as g,v as h,q as i,F as j,_ as k,J as l,s as m,y as n,D as o,l as p,b as q,m as r,z as s,H as t,B as u,u as v,E as w};

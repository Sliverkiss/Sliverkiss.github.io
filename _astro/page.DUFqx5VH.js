const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/mermaid.core.se8BdSrF.js","_astro/preload-helper.BlTxHScW.js","_astro/_commonjsHelpers.CqkleIqs.js","_astro/transform.B1W4q_4U.js","_astro/marked.esm.BSGMMIyL.js"])))=>i.map(i=>d[i]);
import{_ as h}from"./preload-helper.BlTxHScW.js";import{i as p}from"./index.2TnVP-z6.js";const c=()=>document.querySelectorAll("pre.mermaid").length>0;c()?(console.log("[astro-mermaid] Mermaid diagrams detected, loading mermaid.js..."),h(()=>import("./mermaid.core.se8BdSrF.js").then(a=>a.at),__vite__mapDeps([0,1,2,3,4])).then(async({default:a})=>{const n=[];if(n&&n.length>0){console.log("[astro-mermaid] Registering",n.length,"icon packs");const r=n.map(t=>({name:t.name,loader:new Function("return "+t.loader)()}));await a.registerIconPacks(r)}const m={startOnLoad:!1,theme:"default"},g={light:"default",dark:"dark"};async function s(){console.log("[astro-mermaid] Initializing mermaid diagrams...");const r=document.querySelectorAll("pre.mermaid");if(console.log("[astro-mermaid] Found",r.length,"mermaid diagrams"),r.length===0)return;let t=m.theme;{const e=document.documentElement.getAttribute("data-theme"),i=document.body.getAttribute("data-theme");t=g[e||i]||m.theme,console.log("[astro-mermaid] Using theme:",t,"from",e?"html":"body")}a.initialize({...m,theme:t,gitGraph:{mainBranchName:"main",showCommitLabel:!0,showBranches:!0,rotateCommitLabel:!0}});for(const e of r){if(e.hasAttribute("data-processed"))continue;e.hasAttribute("data-diagram")||e.setAttribute("data-diagram",e.textContent||"");const i=e.getAttribute("data-diagram")||"",o="mermaid-"+Math.random().toString(36).slice(2,11);console.log("[astro-mermaid] Rendering diagram:",o);try{const d=document.getElementById(o);d&&d.remove();const{svg:u}=await a.render(o,i);e.innerHTML=u,e.setAttribute("data-processed","true"),console.log("[astro-mermaid] Successfully rendered diagram:",o)}catch(d){console.error("[astro-mermaid] Mermaid rendering error for diagram:",o,d),e.innerHTML=`<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 0.5rem;">
            <strong>Error rendering diagram:</strong><br/>
            ${d.message||"Unknown error"}
          </div>`,e.setAttribute("data-processed","true")}}}s();{const r=new MutationObserver(t=>{for(const e of t)e.type==="attributes"&&e.attributeName==="data-theme"&&(document.querySelectorAll("pre.mermaid[data-processed]").forEach(i=>{i.removeAttribute("data-processed")}),s())});r.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),r.observe(document.body,{attributes:!0,attributeFilter:["data-theme"]})}document.addEventListener("astro:after-swap",()=>{c()&&s()})}).catch(a=>{console.error("[astro-mermaid] Failed to load mermaid:",a)})):console.log("[astro-mermaid] No mermaid diagrams found on this page, skipping mermaid.js load");const l=document.createElement("style");l.textContent=`
            /* Prevent layout shifts by setting minimum height */
            pre.mermaid {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 2rem 0;
              padding: 1rem;
              background-color: transparent;
              border: none;
              overflow: auto;
              min-height: 200px; /* Prevent layout shift */
              position: relative;
            }
            
            /* Loading state with skeleton loader */
            pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
            }
            
            /* Dark mode skeleton loader */
            [data-theme="dark"] pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
              background-size: 200% 100%;
            }
            
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            
            /* Show processed diagrams with smooth transition */
            pre.mermaid[data-processed] {
              animation: none;
              background: transparent;
              min-height: auto; /* Allow natural height after render */
            }
            
            /* Ensure responsive sizing for mermaid SVGs */
            pre.mermaid svg {
              max-width: 100%;
              height: auto;
            }
            
            /* Optional: Add subtle background for better visibility */
            @media (prefers-color-scheme: dark) {
              pre.mermaid[data-processed] {
                background-color: rgba(255, 255, 255, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            @media (prefers-color-scheme: light) {
              pre.mermaid[data-processed] {
                background-color: rgba(0, 0, 0, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            /* Respect user's color scheme preference */
            [data-theme="dark"] pre.mermaid[data-processed] {
              background-color: rgba(255, 255, 255, 0.02);
              border-radius: 0.5rem;
            }
            
            [data-theme="light"] pre.mermaid[data-processed] {
              background-color: rgba(0, 0, 0, 0.02);
              border-radius: 0.5rem;
            }
          `;document.head.appendChild(l);p();

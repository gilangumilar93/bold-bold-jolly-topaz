import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Arsyila’s Pebble Lane";

// Runs before the app modules. In the sandboxed preview, localStorage's getter
// throws an uncatchable SecurityError, so replace it before anything reads it.
const STORAGE_SHIM = `(function(){try{if(window.origin!=="null")return}catch(e){return}function store(){var data=Object.create(null);return{getItem:function(k){return Object.prototype.hasOwnProperty.call(data,k)?data[k]:null},setItem:function(k,v){data[String(k)]=String(v)},removeItem:function(k){delete data[String(k)]},clear:function(){data=Object.create(null)},key:function(i){return Object.keys(data)[i]||null},get length(){return Object.keys(data).length}}}try{var local=store(),session=store();Object.defineProperty(window,"localStorage",{configurable:true,get:function(){return local}});Object.defineProperty(window,"sessionStorage",{configurable:true,get:function(){return session}})}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "Permainan hitung untuk Arsyila: jumlah, kembalian, baris, dan angka yang hilang.",
      },
      { name: "theme-color", content: "#f4efe6" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Nunito:wght@500;700;800&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    scripts: [{ children: STORAGE_SHIM }],
  }),
  component: () => (
    <html lang="id" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});

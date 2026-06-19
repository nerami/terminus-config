// Side-effect module: restore the iframe location from the parent (HA) URL hash
// before anything reads window.location. Imported FIRST in main.tsx — ahead of
// "./router" — so the replaceState lands before createBrowserHistory() and nuqs
// read the initial location. Has no dependency on the router, so ES-module eval
// order guarantees it runs first.

import { restoreFromParentHash } from "./parent-url"

restoreFromParentHash()

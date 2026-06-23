// Side-effect module: when the iframe boots at a blank location (no parent-hash
// restore happened), seed the URL from the localStorage checkpoint BEFORE the
// router/nuqs read window.location. Imported in main.tsx right AFTER
// parent-url-restore, so a parent-hash location always takes precedence (it
// makes the location non-base, and resolveInitialLocation then returns null).

import { readCheckpoint, resolveInitialLocation } from './navigation-checkpoint';
import { relativeLocation } from './parent-url';

import { resolveBasePath } from '@/runtime-config';

const basepath = resolveBasePath(window.location);
const currentRel = relativeLocation(window.location, basepath);
const target = resolveInitialLocation(currentRel, readCheckpoint(window.localStorage));
if (target) {
  // basepath ends with "/"; target starts with "/" — join without doubling it.
  window.history.replaceState({}, '', basepath.replace(/\/$/, '') + target);
}

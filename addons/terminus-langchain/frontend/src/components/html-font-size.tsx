import { useEffect } from 'react';

import { useAtomValue } from 'jotai';

import { clampFontSize, fontSizeAtom } from '@/lib/settings';

/**
 * Applies the user's chosen base font size to the document root so the whole
 * (rem-based) UI scales with it. Renders nothing.
 */
export function HtmlFontSize() {
  const fontSize = useAtomValue(fontSizeAtom);

  useEffect(() => {
    document.documentElement.style.fontSize = `${clampFontSize(fontSize)}px`;
  }, [fontSize]);

  return null;
}

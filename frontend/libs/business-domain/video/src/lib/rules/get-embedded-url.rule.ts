import { inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { isYoutubeUrl } from './is-youtube-url.rule';

export function getEmbeddedUrlRule(url: string): SafeResourceUrl | null {
  if (!isYoutubeUrl(url)) {
    return null;
  }

  const sanitizer = inject(DomSanitizer);

  const urlParts = url.split('/');
  const videoId = urlParts[urlParts.length - 1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
}

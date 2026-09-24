# Search visibility

After changing `data/cv.json` or the CV template, run:

```sh
node scripts/build-seo.mjs
node scripts/build-seo.mjs --check
```

Commit the generated `index.html`, `robots.txt`, and `sitemap.xml` along with the source changes. GitHub Pages serves these files directly. The generator uses the existing renderer so the initial HTML and JavaScript-rendered CV share the same content. Contacts remain masked; their plaintext is not included in structured data. The original John Doe/Lorem ipsum fallback is preserved for local-file mode and failed JSON loads.

## Register after publishing

1. In [Google Search Console](https://search.google.com/search-console/), add a **URL-prefix** property for `https://lazlo-ola.github.io/`. Use an HTML verification file or meta tag; ownership of the shared `github.io` domain is not required. Add Google's exact file/tag to this repository, publish it, then click Verify. Keep the verification file/tag afterward.
2. Submit `sitemap.xml` in Search Console's Sitemaps report. Inspect `https://lazlo-ola.github.io/` with URL Inspection, test the live URL, and request indexing.
3. In [Bing Webmaster Tools](https://www.bing.com/webmasters/), add and verify the same site using the verification method it supplies, then submit `https://lazlo-ola.github.io/sitemap.xml`.
4. Check the public homepage, sitemap and robots file after deployment. Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate the published profile markup.

Registration needs the owner's Google/Microsoft account and the verification tokens supplied by those services. No registration or deployment has been performed by the generator. Submitting a sitemap or an indexing request does not guarantee indexing or a ranking position.

## Help employers find the CV

- Link this site from László's genuine professional profiles and use it in job applications. Add profile URLs to the CV only when they belong to him.
- Keep job dates, qualifications and contact details current. The page naturally mentions Vác, raktáros, targoncavezető, komissiózás and gépkezelő based on the CV; do not add unsupported qualifications or locations.
- If useful, add factual details about forklift licence categories, shift availability and commuting range once László confirms them.
- Use Search Console to see which searches produce impressions and clicks before making further changes.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [ownership verification](https://support.google.com/webmasters/answer/9008080), [sitemap submission](https://support.google.com/webmasters/answer/7451001), [Bing setup](https://www.bing.com/webmasters/help/getting-started-checklist-66a806de).

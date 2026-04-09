# Sitemap Staggered Release Schedule

Add each `<url>` block to `sitemap.xml` on or after the publish date shown.
Insert before the closing `</urlset>` tag. Also update the `/blog` lastmod each time.

---

## Already in sitemap

- `/` — 2026-03-21
- `/pricing` — 2026-03-21
- `/blog` — update lastmod each time a new post goes live
- `/contact` — 2026-03-21
- `/privacy` — 2026-03-21
- `/terms` — 2026-03-21

---

## Add on 2026-03-26

```xml
  <url>
    <loc>https://horizons-garden.com/blog/best-memory-keeping-app</loc>
    <lastmod>2026-03-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-04-02

```xml
  <url>
    <loc>https://horizons-garden.com/blog/long-distance-relationship-gift-ideas</loc>
    <lastmod>2026-04-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-04-08

```xml
  <url>
    <loc>https://horizons-garden.com/blog/how-to-preserve-family-memories</loc>
    <lastmod>2026-04-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-04-10 (two posts, same day)

```xml
  <url>
    <loc>https://horizons-garden.com/blog/gift-for-girlfriend</loc>
    <lastmod>2026-04-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://horizons-garden.com/blog/gift-for-boyfriend</loc>
    <lastmod>2026-04-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-04-15

```xml
  <url>
    <loc>https://horizons-garden.com/blog/digital-scrapbook-ideas</loc>
    <lastmod>2026-04-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-04-17

```xml
  <url>
    <loc>https://horizons-garden.com/blog/gifts-for-someone-grieving</loc>
    <lastmod>2026-04-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-04-22

```xml
  <url>
    <loc>https://horizons-garden.com/blog/problem-with-digital-time-capsules</loc>
    <lastmod>2026-04-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-04-27

```xml
  <url>
    <loc>https://horizons-garden.com/blog/what-to-write-letter-to-future-self</loc>
    <lastmod>2026-04-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-05-02

```xml
  <url>
    <loc>https://horizons-garden.com/blog/how-to-make-a-gift-feel-personal</loc>
    <lastmod>2026-05-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-05-14

```xml
  <url>
    <loc>https://horizons-garden.com/blog/gift-and-a-memory</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-05-21

```xml
  <url>
    <loc>https://horizons-garden.com/blog/how-to-remember-someone-who-passed-away</loc>
    <lastmod>2026-05-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-05-28

```xml
  <url>
    <loc>https://horizons-garden.com/blog/email-to-future-self</loc>
    <lastmod>2026-05-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-06-04

```xml
  <url>
    <loc>https://horizons-garden.com/blog/what-is-a-memory-garden</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-06-11

```xml
  <url>
    <loc>https://horizons-garden.com/blog/what-is-a-digital-time-capsule</loc>
    <lastmod>2026-06-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

## Add on 2026-06-19

```xml
  <url>
    <loc>https://horizons-garden.com/blog/what-is-a-blooming-flower</loc>
    <lastmod>2026-06-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

---

## /blog index entry — update lastmod on every release date

```xml
  <url>
    <loc>https://horizons-garden.com/blog</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
```

---

## Full release calendar at a glance

| Date   | Post(s)                                  |
| ------ | ---------------------------------------- |
| Mar 26 | best-memory-keeping-app                  |
| Apr 2  | long-distance-relationship-gift-ideas    |
| Apr 8  | how-to-preserve-family-memories          |
| Apr 10 | gift-for-girlfriend + gift-for-boyfriend |
| Apr 15 | digital-scrapbook-ideas                  |
| Apr 17 | gifts-for-someone-grieving               |
| Apr 22 | problem-with-digital-time-capsules       |
| Apr 27 | what-to-write-letter-to-future-self      |
| May 2  | how-to-make-a-gift-feel-personal         |
| May 14 | gift-and-a-memory                        |
| May 21 | how-to-remember-someone-who-passed-away  |
| May 28 | email-to-future-self                     |
| Jun 4  | what-is-a-memory-garden                  |
| Jun 11 | what-is-a-digital-time-capsule           |
| Jun 19 | what-is-a-blooming-flower                |

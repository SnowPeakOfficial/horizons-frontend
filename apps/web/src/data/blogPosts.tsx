import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  category: string;
  /** Defaults to 'Horizons Team' if not specified */
  author?: string;
  headerImage: string;
  ctaText: string;
  content: () => React.ReactNode;
}

/** The default author byline used across all Horizons blog posts */
export const DEFAULT_AUTHOR = 'Horizons Team';

// ─── Shared inline styles for blog post body ────────────────────────────────
const s = {
  p:  { fontSize: '18px', lineHeight: 1.9, color: '#4A3F48', marginBottom: '24px' } as React.CSSProperties,
  h2: { fontSize: '26px', fontFamily: 'Georgia, serif', fontWeight: 600, color: '#2C2028', marginTop: '48px', marginBottom: '16px', lineHeight: 1.3 } as React.CSSProperties,
  h3: { fontSize: '20px', fontFamily: 'Georgia, serif', fontWeight: 600, color: '#2C2028', marginTop: '36px', marginBottom: '12px', lineHeight: 1.4 } as React.CSSProperties,
  blockquote: { borderLeft: '3px solid #D4909A', paddingLeft: '24px', margin: '32px 0', fontStyle: 'italic', color: '#6B5B6E', fontSize: '19px', lineHeight: 1.8 } as React.CSSProperties,
  ul: { paddingLeft: '24px', marginBottom: '24px' } as React.CSSProperties,
  li: { fontSize: '18px', lineHeight: 1.9, color: '#4A3F48', marginBottom: '10px' } as React.CSSProperties,
  strong: { fontWeight: 700, color: '#2C2028' } as React.CSSProperties,
};

// ─── Blog Posts ─────────────────────────────────────────────────────────────

const post1: BlogPost = {
  slug: 'best-memory-keeping-app',
  title: 'The best memory keeping app in 2026 (and what most of them get wrong)',
  description: 'Most memory apps store your photos. Very few actually preserve them. Here\'s an honest look at what\'s out there — and what to look for.',
  publishedAt: '2026-03-26',
  readTime: '6 min',
  category: 'Memory',
  headerImage: '/images/blog-post1-memory-app.jpg',
  ctaText: 'Start keeping memories that actually last',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> The best memory keeping app in 2026 is the one that doesn't just store your photos — it preserves the meaning behind them. Most apps fail at this. Here's the honest breakdown.</p>
      <p style={s.p}>If you search "best memory keeping app," you'll find a dozen roundups that recommend the same five tools: Google Photos, iCloud, Notion, Day One, and whatever journaling app has the best App Store screenshots that week.</p>
      <p style={s.p}>Here's the problem: most of those apps do the same thing. They store. They don't preserve.</p>
      <p style={s.p}>Storing and preserving are not the same. A photo in iCloud is stored. A memory is preserved when it carries context, intention, and a destination — someone to give it to, a moment to arrive in.</p>
      <h2 style={s.h2}>What most memory apps get wrong</h2>
      <p style={s.p}><strong style={s.strong}>Google Photos / iCloud</strong> — excellent at storing, zero at meaning. Photos sit in a library nobody browses. Search is good. Emotional delivery is nonexistent.</p>
      <p style={s.p}><strong style={s.strong}>Day One / journey apps</strong> — great for personal journaling. But they're inward-facing. Your entries stay with you, for you, forever. There's no mechanism for sharing a memory with someone at the right moment.</p>
      <p style={s.p}><strong style={s.strong}>Shared albums (Google Photos, iCloud Shared)</strong> — better, but passive. You add photos and hope someone scrolls back and finds them. Nothing is timed. Nothing is anchored to a moment that matters.</p>
      <p style={s.p}><strong style={s.strong}>Scrapbooking apps</strong> — beautiful output, but the effort is high and the delivery is usually a printed book that takes six weeks to arrive.</p>
      <h2 style={s.h2}>Types of memory keeping apps (and who they're for)</h2>
      <p style={s.p}>Most memory apps fall into one of four categories. Understanding which is which makes it easier to choose the right tool for what you actually need.</p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Photo storage</strong> (Google Photos, iCloud) — best for bulk backup. Poor for meaning.</li>
        <li style={s.li}><strong style={s.strong}>Journaling</strong> (Day One, Notion) — best for personal reflection. Not built for sharing.</li>
        <li style={s.li}><strong style={s.strong}>Scrapbooking</strong> (Chatbooks, Artifact Uprising) — beautiful output, high effort, slow delivery.</li>
        <li style={s.li}><strong style={s.strong}>Timed delivery</strong> (Horizons) — built for memories with a recipient and a moment. The least common, and the most overlooked.</li>
      </ul>
      <h2 style={s.h2}>What actually makes a memory last</h2>
      <p style={s.p}>The research on memory and meaning points to the same things: context (the story behind the moment), relationship (who it's for), and timing (when it arrives). Strip any of those out and you have documentation, not memory.</p>
      <p style={s.p}>This is why a voice note from a parent feels irreplaceable while a folder of family photos doesn't. The voice note has all three. The folder has none.</p>
      <h2 style={s.h2}>What to look for in a memory keeping app</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Context layer</strong> — can you attach a written message or voice note to a photo?</li>
        <li style={s.li}><strong style={s.strong}>Intentional sharing</strong> — can you choose exactly who sees it and when?</li>
        <li style={s.li}><strong style={s.strong}>Timed delivery</strong> — can a memory arrive at a specific future moment, not just sit in a feed?</li>
        <li style={s.li}><strong style={s.strong}>Privacy</strong> — is it a private space, not a social feed?</li>
      </ul>
      <h2 style={s.h2}>Where Horizons fits</h2>
      <p style={s.p}>Horizons is built specifically around the third piece — timed, intentional delivery. You plant a memory (a message, a photo, a voice note) in a private garden, choose the exact date it opens, and it blooms for the person you chose. It's the only app we've found that treats delivery as a feature, not an afterthought.</p>
      <p style={s.p}>If you want a photo library, use Google Photos. If you want a journal, use Day One. If you want a memory to actually arrive — to land with someone, at the right moment, with the context that makes it mean something — that's what a blooming flower is for.</p>
    </div>
  ),
};

const post2: BlogPost = {
  slug: 'long-distance-relationship-gift-ideas',
  title: 'Long-distance relationship gift ideas that actually feel personal (not generic)',
  description: 'Shipping something across time zones rarely lands with the emotional weight the occasion deserves. Here are the ideas that actually work — and one that arrives exactly when you want it to.',
  publishedAt: '2026-04-02',
  readTime: '6 min',
  category: 'Gift Ideas',
  headerImage: '/images/blog-post2-video-call.jpg',
  ctaText: 'Plant a message for someone far away',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> The best long-distance gifts are the ones that prove you thought about them specifically — voice recordings, photos with context, and messages written ahead and timed to arrive on the day that matters.</p>
      <p style={s.p}>Long-distance relationships run on two things: trust and the feeling of being remembered. Distance doesn't break most couples. Being forgotten does.</p>
      <p style={s.p}>The problem with most long-distance gifts isn't the budget — it's that they feel like something anyone could have sent. A box of chocolates, a flower delivery, an e-gift card. Generic. Forgettable. Proof of effort, not proof of knowing.</p>
      <p style={s.p}>Here are the ideas that actually work — ranked roughly by how personal they feel.</p>
      <h2 style={s.h2}>1. A voice note, recorded and saved</h2>
      <p style={s.p}>Not a call. A recording — something they can return to at 2am, something that doesn't disappear. Say what you'd say if you were in the room. Keep it unedited. The stumbles and pauses are what make it feel close.</p>
      <h2 style={s.h2}>2. A shared photo album of the year</h2>
      <p style={s.p}>Pull together 15–20 photos from your time together — screenshots of calls, photos from visits, funny texts, anything. Build the album and go through it on a video call. The shared act of remembering is the gift.</p>
      <h2 style={s.h2}>3. Something local, sent from where you are</h2>
      <p style={s.p}>Not from Amazon — from a local bakery, a shop on your street, something that carries a sense of your actual place. It tells them where you are, not just that you thought of them.</p>
      <h2 style={s.h2}>4. A message written weeks ago, set to arrive today</h2>
      <p style={s.p}>This is the one that tends to hit hardest. Write your message before the date — really write it, with photos, a voice note, all of it — seal it, and set it to open on the day that matters.</p>
      <p style={s.p}>When it opens, they're not reading something you sent this morning. They're reading proof that this day has been on your mind for weeks. That's a different kind of gift.</p>
      <p style={s.p}>In Horizons, you can do more than plant one flower for someone far away — you can plant a whole garden for them. Arrange flowers in a constellation: one star per month you've been apart, each one blooming on the anniversary of a call, a trip, a moment that mattered between you. They watch the constellation grow from their side of the distance. One flower at a time, one memory at a time — a sky you built for them, from wherever you are.</p>
      <blockquote style={s.blockquote}>"I planted ours the day we hit one year. Six months later it bloomed and he called me. He goes — I didn't know you'd been holding onto that that long."</blockquote>
      <h2 style={s.h2}>5. A handwritten letter, mailed the slow way</h2>
      <p style={s.p}>Underrated. The physical arrival of something you touched and addressed and sealed carries weight that digital things can't fully replicate. Takes effort. That's the point.</p>
      <h2 style={s.h2}>6. A shared playlist built for them</h2>
<p style={s.p}>Not a playlist you already listen to — one you built specifically for this person. Songs that mean something between you, songs that remind you of a trip, songs you know they'd like. The act of curation is the gift. Spotify and Apple Music both make sharing easy.</p>
<h2 style={s.h2}>7. A subscription that keeps arriving</h2>
<p style={s.p}>A monthly delivery — coffee, a book club, a snack box from a place they love — keeps showing up long after the occasion. Each delivery is a reminder that you thought ahead. The best ones are local to where you are, so they carry a sense of place.</p>
<h2 style={s.h2}>8. "Open when" letters, written in advance</h2>
<p style={s.p}>Write a set of letters labeled for specific moments: "open when you miss me," "open when you're having a bad day," "open when you need to laugh." It's low-cost, high-effort in the right way, and almost universally described as the most memorable thing a long-distance partner has ever done.</p>
      <h2 style={s.h2}>The honest answer</h2>
      <p style={s.p}>The best long-distance gift is the one that proves you thought about them specifically — not just that you remembered the occasion. Timing, specificity, and a little planning go further than any budget.</p>
    </div>
  ),
};

const post3: BlogPost = {
  slug: 'how-to-preserve-family-memories',
  title: 'How to preserve family memories before they\'re gone',
  description: 'Most family memories live in people\'s heads, not on paper. Here\'s what actually works for capturing and keeping them — before the people who carry them aren\'t here to tell them.',
  publishedAt: '2026-04-08',
  readTime: '6 min',
  category: 'Memory',
  headerImage: '/images/blog-post3-family.jpg',
  ctaText: "Preserve a memory before it's gone",
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> Start with voice recordings, not photos. Attach context to everything. And give memories a destination — a specific person and a future date — or they risk being lost anyway.</p>
      <p style={s.p}>Every family has a version of this story: someone passes away, and a week later someone else says "I wish I'd recorded her telling that story about—" and then trails off, because the story is gone now.</p>
      <p style={s.p}>Family memories don't disappear because nobody cared. They disappear because nobody got around to it. Because the urgency of recording the past always loses to the urgency of the present.</p>
      <p style={s.p}>Here's what actually works — and why most approaches fail.</p>
      <h2 style={s.h2}>Why photos alone aren't enough</h2>
      <p style={s.p}>Most family preservation efforts start and stop with photos. The problem is that a photo without context is just an image. In one generation, it becomes "who is that?" In two generations, it becomes unidentifiable entirely.</p>
      <p style={s.p}>The photo preserves the face. It doesn't preserve the voice, the laugh, the story behind why that photo was taken, the feeling in the room. Those things live in people. And people don't last.</p>
      <h2 style={s.h2}>What actually works</h2>
      <h3 style={s.h3}>Voice recordings over video calls</h3>
      <p style={s.p}>The easiest thing most families never do: record a voice memo of a grandparent or parent telling a story. No setup. No camera anxiety. Just a phone on a table and someone saying "tell me about the house you grew up in." Even ten minutes is irreplaceable.</p>
      <h3 style={s.h3}>Story-first, photo-second</h3>
      <p style={s.p}>Go through old photos together and record the commentary, not just the images. The photo is the prompt. The recording is the memory. Save both.</p>
      <h3 style={s.h3}>Timed delivery for future generations</h3>
      <p style={s.p}>This is the piece most tools miss entirely. A memory preserved but never delivered is still at risk of being lost. The most powerful preservation is memory with a destination — something written or recorded today, addressed to someone specific, set to arrive at a moment that matters.</p>
      <p style={s.p}>In Horizons, you can plant a memory — a message, a voice note, a photo with context — in a private family garden, and set it to bloom for a grandchild on their 18th birthday, or for a child on a graduation day years away. As we explored in <a href="/blog/best-memory-keeping-app" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>best memory keeping apps 2026</a>, the difference between storage and preservation is anchoring: who it's for, and when they receive it.</p>
      <blockquote style={s.blockquote}>"My grandmother recorded a message for me the year I was born. I didn't hear it until I was 21. There's no way to explain what that does to you."</blockquote>
      <h2 style={s.h2}>Start smaller than you think</h2>
      <p style={s.p}>You don't need a project. You need one recording. One message. One photo with a voice note attached that explains why it matters. Do that once, and the habit follows.</p>
      <h2 style={s.h2}>Quick checklist: preserving family memories</h2>
<ul style={s.ul}>
  <li style={s.li}>Record one voice story from a parent or grandparent this month</li>
  <li style={s.li}>Go through old photos together and record the commentary</li>
  <li style={s.li}>Attach a voice note or written context to at least one photo per occasion</li>
  <li style={s.li}>Store everything in one place — not scattered across devices</li>
  <li style={s.li}>Assign at least one memory a future destination: a person and a date</li>
</ul>
      <p style={s.p}>The families who have rich records didn't build them all at once. They just didn't stop starting.</p>
    </div>
  ),
};

const post4: BlogPost = {
  slug: 'gifts-for-someone-grieving',
  title: 'Gifts for someone who is grieving that last longer than flowers',
  description: 'When someone is grieving, we reach for objects. But what they often need most isn\'t something to unwrap — it\'s to not be forgotten later. Here\'s what actually helps.',
  publishedAt: '2026-04-17',
  readTime: '5 min',
  category: 'Relationships',
  headerImage: '/images/blog-post4-community.jpg',
  ctaText: 'Send something that arrives when it matters most',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> The most meaningful gifts for grief are the ones timed for later — for the anniversaries and quiet dates when the support has stopped but the loss hasn't. Specific memory, specific date.</p>
      <p style={s.p}>What people often need isn't more support in the first week. It's to not be forgotten later.</p>
      <p style={s.p}>When someone we care about is grieving, the impulse is to do something immediately — send flowers, bring food, drop off a card. These gestures matter. But they're over fast. The flowers wilt. The food is eaten. The attention moves on.</p>
      <p style={s.p}>The absence — the person who isn't there anymore — doesn't end. But the support does.</p>
      <h2 style={s.h2}>The loneliness of later grief</h2>
      <p style={s.p}>Most grieving people receive an outpouring in the first two weeks. By week six, messages have slowed. By month three, nearly stopped. But grief doesn't stop at month three. It reshapes. It intensifies at anniversaries, birthdays, holidays — the dates that keep arriving without the person who used to be in them.</p>
      <p style={s.p}>The best gifts for grief aren't ones you give in the first week. They're ones designed for later — for the quiet, forgotten moments when the person is carrying the loss alone.</p>
      <h2 style={s.h2}>Traditional sympathy gifts (and when they help)</h2>
<p style={s.p}>The standard options — flowers, food, a card — do serve a purpose. They mark the moment. They signal that you're paying attention. They're appropriate in the first week, when presence is what's needed and the person can't absorb much else.</p>
<ul style={s.ul}>
  <li style={s.li}><strong style={s.strong}>Flowers</strong> — beautiful, impermanent, appropriate for the immediate days</li>
  <li style={s.li}><strong style={s.strong}>Food</strong> — genuinely useful when grief removes the capacity to cook</li>
  <li style={s.li}><strong style={s.strong}>Memory boxes or keepsake items</strong> — can be meaningful if tied to the person who was lost</li>
</ul>
<p style={s.p}>The limitation of all of these is timing: they arrive in the first week, when support is already abundant. The harder dates come later.</p>
      <h2 style={s.h2}>What actually helps</h2>
      <h3 style={s.h3}>Specific memories, not general condolences</h3>
      <p style={s.p}>Write something specific about the person who was lost. A real memory. A particular quality. Something you witnessed. "I'm so sorry for your loss" is kind. "I still think about the way he laughed at his own jokes" is something they'll hold onto.</p>
      <h3 style={s.h3}>A message timed for a hard date</h3>
      <p style={s.p}>This is the one most people never think to do. Plant a message now — write it carefully, with specificity — and set it to arrive at a date you know will be hard. The first anniversary of the loss. The deceased person's birthday. A holiday. A milestone they were supposed to be there for.</p>
      <p style={s.p}>In Horizons, you can plant a grief garden — not one flower, but a whole arrangement of flowers, each one set to bloom on a different hard date. The first anniversary of the loss. The deceased person's birthday. The holidays. The milestone they were supposed to be there for. The person receives a flower each time — proof, on every difficult date that keeps arriving, that you still haven't forgotten. As we covered in <a href="/blog/long-distance-relationship-gift-ideas" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>long-distance relationship gift ideas</a>, what makes a message land is specificity and timing — both together.</p>
      <blockquote style={s.blockquote}>"She planted one for me to open on my mom's first birthday after she passed. I was already having a hard day when it bloomed. Reading it — it felt like being caught before I fell."</blockquote>
      <h3 style={s.h3}>Something that does the ordinary for them</h3>
      <p style={s.p}>Grief is exhausting. Practical help — a meal delivery subscription, help with a task, a gift card to somewhere they go regularly — removes a small piece of friction from a period when everything takes more effort than it should.</p>
      <h2 style={s.h2}>What to avoid</h2>
      <p style={s.p}>Anything that requires energy to receive: elaborate setups, things that need assembling, experiences they have to schedule. Grief flattens capacity. The best gifts are low-friction and high-meaning.</p>
    </div>
  ),
};

const post5: BlogPost = {
  slug: 'problem-with-digital-time-capsules',
  title: 'The problem with digital time capsules (and how to fix it)',
  description: 'Most digital time capsules get lost, forgotten, or never opened at the right moment. Here\'s why — and what actually needs to be different.',
  publishedAt: '2026-04-22',
  readTime: '5 min',
  category: 'Guides',
  headerImage: '/images/blog-post5-time-capsule.jpg',
  ctaText: 'Plant one that actually gets delivered',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> Most digital time capsules fail because they rely on someone remembering to look. The fix is simple: a specific recipient, a specific date, and a delivery mechanism that doesn't require anyone to go looking.</p>
      <p style={s.p}>The idea of a digital time capsule is compelling: capture something now, open it later, feel something about who you were and what has changed. People write letters to their future selves. Teachers have students create them. Apps are built around the concept.</p>
      <p style={s.p}>Most of them fail. Not because the content wasn't meaningful — because the delivery never happened.</p>
      <h2 style={s.h2}>Why most digital time capsules get abandoned</h2>
      <p style={s.p}><strong style={s.strong}>They rely on memory.</strong> Most time capsule tools require you to remember where you put it. A folder on your desktop. A document in the cloud. An email you sent to a future address. If the platform changes, if you forget the password, if the service shuts down — it's gone. And more often than not, it's just quietly forgotten.</p>
      <p style={s.p}><strong style={s.strong}>The timing problem.</strong> Even when a time capsule is technically preserved, it usually opens at the wrong moment — or not at all. There's no mechanism to ensure the message finds you when it matters. You have to go looking for it. And the version of you that would most benefit from it is rarely the version who thinks to go looking.</p>
      <p style={s.p}><strong style={s.strong}>The delivery problem.</strong> Most time capsule apps are built for storage, not delivery. They hold the content. They don't send it anywhere. They don't bloom. They sit.</p>
      <h2 style={s.h2}>What actually needs to be different</h2>
      <p style={s.p}>A time capsule that works needs three things: a specific recipient, a specific date, and a delivery mechanism that doesn't rely on anyone remembering to look.</p>
      <p style={s.p}>This is what we built Horizons around. A blooming flower is planted with a recipient and a bloom date. On that date, it opens — for them, or for you, depending on who you planted it for. No one has to remember. No one has to go looking. It arrives.</p>
      <p style={s.p}>As we explored in <a href="/blog/how-to-preserve-family-memories" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>how to preserve family memories</a> and in <a href="/blog/best-memory-keeping-app" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>what most memory keeping apps get wrong</a>, the missing piece is almost always the same: anchoring. Without a destination and a delivery date, a memory is just storage.</p>
      <h2 style={s.h2}>What this looks like in practice</h2>
      <ul style={s.ul}>
        <li style={s.li}>A letter written to your child today, set to bloom when they graduate</li>
        <li style={s.li}>A message to yourself at the start of a hard year, set to open when it ends</li>
        <li style={s.li}>A note to a friend planted six months before a milestone you know is coming</li>
        <li style={s.li}>A recording from a grandparent, sealed until a grandchild turns 18</li>
      </ul>
      <p style={s.p}>The content matters. But the delivery is what makes it land. That's the fix.</p>
    </div>
  ),
};

const post6: BlogPost = {
  slug: 'what-to-write-letter-to-future-self',
  title: 'What to write in a letter to your future self (with real examples)',
  description: 'Writing a letter to your future self is one of the most clarifying things you can do. Here\'s what to actually put in it — and how to make sure you actually receive it.',
  publishedAt: '2026-04-27',
  readTime: '6 min',
  category: 'Wellness',
  headerImage: '/images/blog-post6-letter.jpg',
  ctaText: 'Write a letter your future self will actually receive',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> Write about where you are emotionally right now — not the facts, but the feeling. Name one fear, one thing you're proud of, and make one prediction. Then give it a delivery date so it actually finds you.</p>
      <p style={s.p}>Writing a letter to your future self sounds like a school assignment. It feels, when you actually do it, like something else entirely.</p>
      <p style={s.p}>Most people who try it report the same thing: the act of writing forces a kind of clarity that regular journaling doesn't. You're not processing — you're committing. You're telling the person you'll be what the person you are right now actually believes, fears, and hopes for. That's harder than it sounds. And more valuable.</p>
      <p style={s.p}>The problem isn't the writing. It's the delivery. Most future self letters get buried — in notebooks, in documents, in email drafts. The moment of reading never happens at the right time, if it happens at all.</p>
      <h2 style={s.h2}>What to actually write</h2>
      <p style={s.p}>The most useful letters aren't the ones that try to predict the future. They're the ones that capture the present honestly — so that when you read them later, you understand who you were.</p>
      <h3 style={s.h3}>Start with where you are, emotionally</h3>
      <p style={s.p}>Not "I live in Toronto and I'm 28." That's documentation. Start with: <em>I'm in the middle of something hard and I'm not sure I'm handling it right</em> — or — <em>I'm genuinely happy right now in a way I don't want to forget.</em></p>
      <p style={s.p}>The version of you reading this in a year or five will remember the circumstances. What they'll have forgotten is how it felt.</p>
      <h3 style={s.h3}>Name one thing you're afraid of</h3>
      <p style={s.p}>This is the part most people skip. It's also the most valuable. Writing your fear down — specifically, not vaguely — creates a reference point. Future you will know whether it happened. Whether it mattered as much as you thought. Whether the dread was proportional.</p>
      <h3 style={s.h3}>Name one thing you're proud of right now</h3>
      <p style={s.p}>Small or large. Something you did, something you chose, something you survived. This is the part that tends to make people emotional when they read it back — because future you has usually forgotten to credit the person they used to be.</p>
      <h3 style={s.h3}>Make one specific prediction</h3>
      <p style={s.p}>Not a hope — a prediction. "I think by the time you read this, [X] will have happened." It gives future you something concrete to respond to.</p>
      <h3 style={s.h3}>Give future you permission</h3>
      <p style={s.p}>To have changed your mind. To have moved on from something. To have become someone different. This is the line people remember most: <em>it's okay if you're not who I thought you'd be.</em></p>
      <h2 style={s.h2}>Real examples of what this looks like</h2>
      <blockquote style={s.blockquote}>"Right now I'm scared that I made the wrong call leaving that job. I think by the time you read this, either it'll have been clearly right or clearly wrong. I hope you're not still in the middle."</blockquote>
      <blockquote style={s.blockquote}>"I'm proud of the fact that I finally said the thing I'd been not saying for two years. I want you to remember that it felt like jumping off something, and that it was okay."</blockquote>
      <h2 style={s.h2}>How to make sure you actually receive it</h2>
      <p style={s.p}>This is where most future self letters fail. Written in a notebook, forgotten. Saved in a document, never opened. Emailed to yourself, lost in an inbox.</p>
      <p style={s.p}>In Horizons, you can go further than one letter — plant multiple flowers for different future versions of yourself. One for your next birthday. One for the end of this year. One for the milestone you're working toward right now. One for five years from now, from whoever you are today. Each one sealed. Each one arriving when the moment is ready. A garden that walks you through your own future, one bloom at a time. As we explored in <a href="/blog/problem-with-digital-time-capsules" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>the problem with digital time capsules</a>, the content is rarely the issue. The delivery is.</p>
      <p style={s.p}>Write the letters. Set the dates. Let them find you.</p>
      <h2 style={s.h2}>A simple template to follow</h2>
<p style={s.p}>Copy this if it helps:</p>
<ul style={s.ul}>
  <li style={s.li}><strong style={s.strong}>Where I am right now (emotionally):</strong> Not the facts — how it actually feels.</li>
  <li style={s.li}><strong style={s.strong}>One thing I'm afraid of:</strong> Be specific. Vague fears don't create useful reference points.</li>
  <li style={s.li}><strong style={s.strong}>One thing I'm proud of:</strong> Small counts. Something you did, chose, or survived.</li>
  <li style={s.li}><strong style={s.strong}>One prediction:</strong> Not a hope — something you actually think will happen.</li>
  <li style={s.li}><strong style={s.strong}>Permission:</strong> Tell future you it's okay to have changed. This is the line people remember most.</li>
</ul>
    </div>
  ),
};

const post7: BlogPost = {
  slug: 'how-to-make-a-gift-feel-personal',
  title: 'How to make any gift feel personal (without spending more)',
  description: 'Most gifts solve the practical side but miss the emotional one. Here\'s how to fix that — and why the memory matters more than the gift itself.',
  publishedAt: '2026-05-02',
  readTime: '5 min',
  category: 'Gift Ideas',
  headerImage: '/images/blog-post7-gift-card.jpg',
  ctaText: 'Add a memory to any gift',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> Pair any gift with a message that carries the meaning the gift can't. Write the why, the story, the feeling — and set it to arrive at the moment they'll most want to read it.</p>
      <p style={s.p}>A gift card is a practical object. It funds something — a dinner, an experience, a purchase the recipient will actually want. There's nothing wrong with that. The problem is that it doesn't mean anything.</p>
      <p style={s.p}>You hand it over, they say thank you, it goes in a wallet or an inbox. Six months later, it might still be sitting there, half-used or forgotten.</p>
      <p style={s.p}>Most gifts have this problem. They solve the practical side — something is exchanged, a gesture is made — but they don't solve the emotional side. They don't answer the question the recipient is quietly asking: <em>did this matter to you?</em></p>
      <h2 style={s.h2}>What a gift card can't do</h2>
      <p style={s.p}>A gift card funds an experience. It doesn't make the experience memorable. It doesn't tell the story of why you chose it, what you hope they do with it, what the occasion means to you. It arrives without context and leaves the same way.</p>
      <p style={s.p}>The memory — the part that stays — has to come from somewhere else.</p>
      <h2 style={s.h2}>What a blooming flower does instead</h2>
      <p style={s.p}>In Horizons, you can plant a flower alongside any gift. Write the message that the gift card can't carry — the why, the story, the feeling. Attach a photo. Record your voice. Set it to bloom on the day they're supposed to use the gift, or the day after, when the experience is fresh.</p>
      <p style={s.p}>The gift card funds the experience. The flower makes it permanent. Two years from now, they won't remember the dollar amount. They'll remember what you wrote.</p>
      <blockquote style={s.blockquote}>"I gave my sister a spa gift card for her birthday. Then I planted a flower with a voice note about why I wanted her to actually rest, properly, for once. She said the note meant more than the card. I think that's probably right."</blockquote>
      <h2 style={s.h2}>What to write inside the flower</h2>
      <ul style={s.ul}>
        <li style={s.li}>Why you chose this specific gift for this specific person</li>
        <li style={s.li}>What you hope they do with it — or how you hope it makes them feel</li>
        <li style={s.li}>A memory connected to the occasion</li>
        <li style={s.li}>Something you want them to know, that the gift itself can't say</li>
      </ul>
      <h2 style={s.h2}>When this works especially well</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Milestone birthdays</strong> — the gift funds a celebration; the flower holds the meaning</li>
        <li style={s.li}><strong style={s.strong}>Graduation</strong> — give them money toward the next chapter and a letter about why you believe in them</li>
        <li style={s.li}><strong style={s.strong}>Weddings</strong> — a cash gift toward something practical, paired with a message about the day</li>
        <li style={s.li}><strong style={s.strong}>Long-distance occasions</strong> — when you can't be there, a flower carries what a card cannot</li>
      </ul>
      <p style={s.p}>The gift card solves the practical problem. The flower solves the emotional one. You don't have to choose.</p>
    </div>
  ),
};

const post8: BlogPost = {
  slug: 'gift-and-a-memory',
  title: 'A gift card, and something to remember it by',
  description: 'A gift card funds an experience. A blooming flower makes it permanent. Here\'s why the memory matters more — and how to give both at once.',
  publishedAt: '2026-05-14',
  readTime: '5 min',
  category: 'Gift Ideas',
  headerImage: '/images/blog-post8-gift-box.jpg',
  ctaText: 'Give the gift and the memory',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> A gift card solves the practical problem. A blooming flower solves the emotional one. Horizons lets you do both — the gift funds the experience, and the flower makes it something they'll actually remember.</p>
      <p style={s.p}>Gift cards are a perfectly reasonable gift. They're flexible. They're practical. The recipient gets to choose what they actually want, which is often better than you guessing wrong.</p>
      <p style={s.p}>The problem isn't practicality. The problem is that a gift card doesn't feel like anything. It arrives in an envelope or an inbox, says "happy birthday" or "congratulations," and disappears into a wallet or an app. The occasion passes. The card gets used on a Tuesday for something unremarkable. The moment is gone.</p>
      <p style={s.p}>Two years later, they won't remember the gift card. They might not even remember the occasion. What they remember is whether you made them feel something.</p>
      <h2 style={s.h2}>What a gift card can't carry</h2>
      <p style={s.p}>A gift card funds an experience. It doesn't explain why you chose it. It doesn't say what the occasion means to you. It doesn't tell them what you hope they do with it, or what you want them to feel when they do.</p>
      <p style={s.p}>All of that has to come from somewhere else. That's where most people stop — they hand over the card and call it done. The meaning gets left out entirely.</p>
      <h2 style={s.h2}>What a blooming flower does instead</h2>
      <p style={s.p}>In Horizons, you plant a flower alongside the gift. Write the message the card can't carry — the why, the story, the feeling. Attach a photo. Record your voice. Set it to bloom on the day they use the gift, or the day after, when the experience is still fresh.</p>
      <p style={s.p}>When it opens, they're not receiving a generic card message. They're receiving something you wrote specifically for them, timed specifically for that moment.</p>
      <blockquote style={s.blockquote}>"I gave him a gift card for a cooking class for his birthday. Then planted a flower to open on the day of the class — wrote about why I thought he needed something just for himself. He said he read it on the way there. That note is what he remembers."</blockquote>
      <p style={s.p}>The gift funds the experience. The flower makes it permanent.</p>
      <h2 style={s.h2}>When this works especially well</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Experiences</strong> — a spa day, a cooking class, a concert: the flower arrives the morning of, adding intention to the occasion</li>
        <li style={s.li}><strong style={s.strong}>Milestone birthdays</strong> — the card is practical; the flower holds the meaning of the milestone itself</li>
        <li style={s.li}><strong style={s.strong}>Graduations</strong> — money toward the next chapter, plus a letter about why you believe in them</li>
        <li style={s.li}><strong style={s.strong}>Long distance</strong> — when you can't be there, a flower carries what a card and an envelope cannot</li>
        <li style={s.li}><strong style={s.strong}>Just because</strong> — sometimes the most memorable gifts are the ones with no occasion attached</li>
      </ul>
      <h2 style={s.h2}>What to write inside the flower</h2>
      <p style={s.p}>You don't need much. A few honest sentences beat a page of the right words.</p>
      <ul style={s.ul}>
        <li style={s.li}>Why you chose this specific gift for this specific person</li>
        <li style={s.li}>What you hope they feel when they use it</li>
        <li style={s.li}>One thing you want them to know, that the gift itself can't say</li>
      </ul>
      <p style={s.p}>That's it. The gift handles the practical side. The flower handles the rest.</p>
      <p style={s.p}>As we explored in <a href="/blog/how-to-make-a-gift-feel-personal" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>how to make any gift feel personal</a>, the memory matters more than the object. Give them both.</p>
    </div>
  ),
};

const post9: BlogPost = {
  slug: 'what-is-a-memory-garden',
  title: 'What is a memory garden?',
  description: 'A memory garden is a private digital space where you preserve meaningful moments — messages, photos, and voice notes — and set them to be shared at a specific future time.',
  publishedAt: '2026-06-04',
  readTime: '3 min',
  category: 'Memory',
  headerImage: '/images/blog-post9-memory-garden.jpg',
  ctaText: 'Plant your first memory',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>A memory garden is a private digital space where you preserve meaningful moments — messages, photos, and voice notes — and set them to bloom for a specific person at a specific future time.</strong></p>
      <p style={s.p}>The term combines two ideas: the intimacy of a garden (something you tend, something that grows) with the function of memory preservation (capturing moments before they're lost). Unlike a photo library or a journal, a memory garden is designed for delivery — every memory you plant has a recipient and a bloom date.</p>
      <h2 style={s.h2}>How a memory garden works</h2>
      <p style={s.p}>You plant a memory by attaching a message, photo, or voice note to a digital flower. You choose who it's for and when it opens. On that date, the flower blooms — the recipient receives the memory exactly when you intended them to.</p>
      <p style={s.p}>The key distinction from other memory tools: the garden is not a storage system. It's a delivery system. Memories aren't archived to be searched later — they're addressed to someone and timed to arrive.</p>
      <h2 style={s.h2}>What you can plant in a memory garden</h2>
      <ul style={s.ul}>
        <li style={s.li}>A written letter to a child, set to open on their 18th birthday</li>
        <li style={s.li}>A voice note from a grandparent, sealed until a grandchild graduates</li>
        <li style={s.li}>A message to a partner, timed for an anniversary you know is coming</li>
        <li style={s.li}>A note to your future self, set to open at the end of a hard year</li>
        <li style={s.li}>A message for a grieving friend, timed for the first anniversary of their loss</li>
      </ul>
      <h2 style={s.h2}>How Horizons uses the concept</h2>
      <p style={s.p}>Horizons is built around a private 3D memory garden. Each user has a garden where they plant blooming flowers — each flower holds a memory sealed until its bloom date. Gardens can be shared with specific people (a family, a partner, a friend group) and each flower opens only for the person it was planted for.</p>
      <p style={s.p}>The garden metaphor is intentional: memories grow. They're planted with intention, they take time, and when they bloom, they mean something.</p>
      <h2 style={s.h2}>Memory garden vs. other memory tools</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Photo storage</strong> (Google Photos, iCloud) — stores images, no delivery mechanism</li>
        <li style={s.li}><strong style={s.strong}>Journaling apps</strong> (Day One) — personal reflection, not built for sharing</li>
        <li style={s.li}><strong style={s.strong}>Digital time capsules</strong> — similar concept, but usually lack a reliable delivery mechanism</li>
        <li style={s.li}><strong style={s.strong}>Memory garden</strong> (Horizons) — private, timed, addressed to a specific person</li>
      </ul>
      <p style={s.p}>The difference is intention. A memory garden isn't where things go to be stored. It's where things go to be given.</p>
    </div>
  ),
};

const post10: BlogPost = {
  slug: 'what-is-a-digital-time-capsule',
  title: 'What is a digital time capsule?',
  description: 'A digital time capsule is a collection of messages, photos, or recordings preserved today and meant to be opened at a future date. Most fail because they rely on someone remembering to look.',
  publishedAt: '2026-06-11',
  readTime: '3 min',
  category: 'Guides',
  headerImage: '/images/blog-post10-floppy-disk.jpg',
  ctaText: 'Plant one that actually gets delivered',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>A digital time capsule is a collection of messages, photos, videos, or voice recordings preserved today and intended to be opened at a specific future date — either by yourself or by someone else.</strong></p>
      <p style={s.p}>The concept adapts the traditional physical time capsule (a buried box of artifacts, sealed for decades) to digital content. Instead of burying objects, you save files. Instead of digging them up, you open a folder, an email, or an app.</p>
      <h2 style={s.h2}>What goes into a digital time capsule</h2>
      <ul style={s.ul}>
        <li style={s.li}>Written letters to yourself or to someone else</li>
        <li style={s.li}>Photos with written or spoken context</li>
        <li style={s.li}>Voice or video recordings</li>
        <li style={s.li}>Predictions about the future</li>
        <li style={s.li}>Descriptions of everyday life — prices, routines, what mattered that year</li>
      </ul>
      <h2 style={s.h2}>How digital time capsules are typically used</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Letters to future self</strong> — written now, opened in a year or five</li>
        <li style={s.li}><strong style={s.strong}>Family archives</strong> — messages from a grandparent sealed for a grandchild's milestone</li>
        <li style={s.li}><strong style={s.strong}>Milestone markers</strong> — a message written at the start of a project, opened when it's complete</li>
        <li style={s.li}><strong style={s.strong}>Grief support</strong> — a message planted now, timed for a hard date in the future</li>
      </ul>
      <h2 style={s.h2}>Why most digital time capsules fail</h2>
      <p style={s.p}>The most common failure mode: the capsule is created but never opened at the right moment. It lives in a folder, a document, or an email draft — and no one remembers to look at the right time. The platform shuts down. The password is forgotten. The file is buried under three years of other things.</p>
      <p style={s.p}>The second failure mode: even when it's technically preserved, it opens without ceremony. The person has to go looking for it. That's not how meaningful moments work.</p>
      <p style={s.p}>As explored in <a href="/blog/problem-with-digital-time-capsules" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>the problem with digital time capsules</a>, what's missing in most tools is a delivery mechanism — something that actively sends the capsule to the right person at the right moment, without relying on anyone remembering.</p>
      <h2 style={s.h2}>What makes a digital time capsule work</h2>
      <p style={s.p}>Three things: a specific recipient, a specific date, and an active delivery mechanism. Without all three, a time capsule is just storage with a note attached.</p>
      <p style={s.p}>Horizons is built around this model. A blooming flower is planted with a recipient and a bloom date. On that date, it opens — delivered, not discovered. No one has to remember. No one has to go looking. It arrives.</p>
    </div>
  ),
};

const post11: BlogPost = {
  slug: 'what-is-a-blooming-flower',
  title: 'What is a blooming flower? (Horizons)',
  description: 'A blooming flower is a sealed memory — a message, photo, or voice note — that opens for a specific person on a date you choose. It\'s how Horizons delivers memories.',
  publishedAt: '2026-06-19',
  readTime: '3 min',
  category: 'Guides',
  headerImage: '/images/blog-post11-pink-flower.jpg',
  ctaText: 'Plant your first blooming flower',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>A blooming flower is a sealed memory — a message, photo, voice note, or combination — that you plant in a private Horizons garden and set to open for a specific person on a specific date.</strong></p>
      <p style={s.p}>When the bloom date arrives, the flower opens. The person you planted it for receives it exactly when you intended — not when they happen to go looking, not when they scroll back through a feed, but on the day you chose.</p>
      <h2 style={s.h2}>What a blooming flower contains</h2>
      <p style={s.p}>Each flower can hold:</p>
      <ul style={s.ul}>
        <li style={s.li}>A written message (as long or short as you want)</li>
        <li style={s.li}>Photos</li>
        <li style={s.li}>A voice recording</li>
        <li style={s.li}>Any combination of the above</li>
      </ul>
      <p style={s.p}>The flower itself is a visual object in the garden — a 3D flower that sits sealed until its bloom date. On that date, it opens and the memory inside becomes visible to the person it was planted for.</p>
      <h2 style={s.h2}>Who you can plant a flower for</h2>
      <ul style={s.ul}>
        <li style={s.li}>A partner — for an anniversary, a hard day you know is coming, a moment you want them to carry</li>
        <li style={s.li}>A child — for a birthday, graduation, or a future milestone years away</li>
        <li style={s.li}>A parent — for their birthday, or for a day you know they'll need to hear from you</li>
        <li style={s.li}>A grieving friend — timed for the anniversary of a loss, when support has usually long stopped</li>
        <li style={s.li}>Yourself — a letter to your future self, set to open at the end of a year or the start of something new</li>
      </ul>
      <h2 style={s.h2}>Why it's called a blooming flower</h2>
      <p style={s.p}>The metaphor is deliberate. A flower is planted before it blooms. It takes time. It's tended. And when it opens, it's because the conditions are right — not because someone forced it early. A memory planted in Horizons works the same way: you put the intention in now, and it arrives when the moment is ready.</p>
      <p style={s.p}>The opposite of a blooming flower is a message sent in the moment — reactive, responsive to what's happening right now. A blooming flower is something different: proof that you thought ahead, that you knew this moment was coming, that you were already thinking of them before the day arrived.</p>
      <h2 style={s.h2}>How it's different from a text message or an email</h2>
      <ul style={s.ul}>
        <li style={s.li}>A text is sent now. A flower is planted now and delivered later.</li>
        <li style={s.li}>A text disappears in a thread. A flower lives in a garden, permanently visible.</li>
        <li style={s.li}>A text is reactive. A flower is intentional.</li>
        <li style={s.li}>A text can be missed. A flower blooms — the recipient is notified when it opens.</li>
      </ul>
      <p style={s.p}>As we explored in <a href="/blog/what-is-a-memory-garden" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>what is a memory garden</a>, the goal isn't storage — it's delivery. A blooming flower is how that delivery happens.</p>
    </div>
  ),
};

const post12: BlogPost = {
  slug: 'gift-for-girlfriend',
  title: 'Gift ideas for your girlfriend that actually feel personal',
  description: 'Generic gifts are easy to find. Personal ones take something else. Here are the ideas that land — and one that arrives exactly when it should.',
  publishedAt: '2026-04-10',
  readTime: '5 min',
  category: 'Gift Ideas',
  headerImage: '/images/blog-post12-girlfriend-gift.jpg',
  ctaText: 'Plant something she will actually remember',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> The gifts that stick are the ones that feel like inside jokes made physical — something only you two would understand. Not a list. Evidence that you know her, specifically.</p>
      <p style={s.p}>Most gift guides for girlfriends optimize for objects. Jewellery, candles, skincare. All fine. All forgettable if they could have come from anyone. What actually lands is specificity — something that only makes sense for her.</p>
      <h2 style={s.h2}>Gift ideas that prove you were paying attention</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>A custom map of a place that means something</strong> — the street you met on, the city you visited, the neighbourhood from your first date. Printed and framed. She'll know immediately why you chose it.</li>
        <li style={s.li}><strong style={s.strong}>A "newspaper front page" from the day you met</strong> — services like Artifact Uprising or Newspaper Club let you design a front page around a specific date. The headline writes itself.</li>
        <li style={s.li}><strong style={s.strong}>Something engraved with a phrase only she'd understand</strong> — not "always and forever." The inside thing. The line from the text, the joke from that trip, the word you two use for something no one else knows.</li>
        <li style={s.li}><strong style={s.strong}>A blind tasting of something she loves, assembled by you</strong> — coffee, wine, chocolate, tea. Five options, numbered. You score them together. The experience is the gift; the curation is the proof.</li>
        <li style={s.li}><strong style={s.strong}>Booking the thing she mentioned once and never followed up on</strong> — the class she said sounded interesting, the restaurant she opened on her phone and closed. The fact that you remembered is the entire point.</li>
      </ul>
      <h2 style={s.h2}>The Horizons idea: a garden, not a flower</h2>
      <p style={s.p}>If you want to give something she'll carry for years — plant a whole garden for her in Horizons. Not one flower. A garden shaped like a heart, each petal holding a different memory from your relationship, set to bloom one per month for the next year.</p>
      <p style={s.p}>The first petal: the day you met. The next: the first trip. The third: the inside joke that became a whole thing. The fourth: the hard moment you got through together. Each one sealed, each one connected to the last — a journey unfolding over twelve months. She can see the full shape of the garden before a single petal opens. Then it delivers itself, one memory at a time.</p>
      <p style={s.p}>That's not a gift. That's a year of being remembered.</p>
      <blockquote style={s.blockquote}>"He built one before our anniversary — twelve flowers, one per month. The first one opened on the day. I didn't know the others were coming. By the third I understood what he'd done and I just sat with it for a while."</blockquote>
      <h2 style={s.h2}>What to write inside each flower</h2>
      <ul style={s.ul}>
        <li style={s.li}>The specific memory it's anchored to — not vague, the real moment</li>
        <li style={s.li}>What you want her to know that you don't usually say out loud</li>
        <li style={s.li}>What that memory means now, looking back</li>
      </ul>
      <p style={s.p}>The garden is the gift. Each flower is a chapter. The whole thing tells the story of you two — arranged, intentional, arriving one bloom at a time.</p>
      <p style={s.p}>More on this in <a href="/blog/how-to-make-a-gift-feel-personal" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>how to make any gift feel personal</a> — the memory matters more than the object. Give her both.</p>
    </div>
  ),
};

const post13: BlogPost = {
  slug: 'gift-for-boyfriend',
  title: 'Gift ideas for your boyfriend that actually mean something',
  description: "Most gift guides for boyfriends lean on objects. The ones that land lean on attention. Here's what to give — and how to make it last longer than the occasion.",
  publishedAt: '2026-04-10',
  readTime: '5 min',
  category: 'Gift Ideas',
  headerImage: '/images/blog-post13-headphones-gift.jpg',
  ctaText: 'Plant something he will actually remember',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> The gifts that mean something to boyfriends are the ones that prove you paid attention — to what he cares about, what he's said, what he'd never think to buy himself. Attention is the gift. Everything else is just the delivery.</p>
      <p style={s.p}>Most gift lists for boyfriends are built around categories: tech, grooming, experience. These aren't wrong. They're just generic in a way that makes them easy to forget.</p>
      <p style={s.p}>What makes a gift memorable isn't the category. It's the evidence inside it — that you were listening, that you noticed, that this was chosen for him and not for a placeholder version of a boyfriend.</p>
      <h2 style={s.h2}>The gifts that tend to work</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Book the obscure thing he mentioned once, six months ago</strong> — the brewery tour, the obscure film screening, the class he said sounded interesting and never followed up on. That you remembered proves you were actually listening. That's the gift.</li>
        <li style={s.li}><strong style={s.strong}>A blind tasting flight, assembled by you</strong> — whiskey, hot sauce, craft beer, coffee. Five options, numbered, no labels. You curate it, you taste it together. The experience is the point; the effort is the proof.</li>
        <li style={s.li}><strong style={s.strong}>A framed "permission slip" for something he keeps putting off</strong> — the trip, the purchase, the thing he's been saying "eventually" about for two years. Frame it. Give him actual written permission. It's funny and it's not.</li>
        <li style={s.li}><strong style={s.strong}>A playlist with liner notes, written by you</strong> — not a Spotify link. A playlist where every song has a handwritten note underneath explaining exactly why you chose it. The liner notes are the gift.</li>
        <li style={s.li}><strong style={s.strong}>A message written before the day, sealed, set to arrive</strong> — not sent the morning of. Written weeks ago, attached to a photo, set to open when it matters most.</li>
      </ul>
      <h2 style={s.h2}>The Horizons idea: build him a trail</h2>
      <p style={s.p}>If you want to give him something he'll carry — not just an occasion — plant a garden for him in Horizons. Not one flower. A trail of flowers, each one a chapter in your story together: the first date, the first trip, the moment you knew, the inside joke, the hard thing you got through together.</p>
      <p style={s.p}>Each one sealed. Each one blooming in sequence, weeks apart. He doesn't get the whole story at once — he walks the trail over months, one memory at a time. The whole garden is visible from the start, but he has to wait for it to unfold.</p>
      <blockquote style={s.blockquote}>"She gave me a card and then later that day a flower bloomed in the app. The card was fine. The flower was the thing I actually read twice."</blockquote>
      <h2 style={s.h2}>What to write inside each flower</h2>
      <ul style={s.ul}>
        <li style={s.li}>Something specific about him — not about the relationship in general, but about him</li>
        <li style={s.li}>The memory the flower is anchored to — specific, not vague</li>
        <li style={s.li}>What you want him to know that you don't usually say out loud</li>
      </ul>
      <p style={s.p}>The gift funds an experience or marks an occasion. The trail is what he'll still be walking through months from now.</p>
      <p style={s.p}>More on timing and intention in <a href="/blog/long-distance-relationship-gift-ideas" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>long-distance relationship gift ideas</a> — the same principles apply even when you're in the same city.</p>
    </div>
  ),
};

const post14: BlogPost = {
  slug: 'digital-scrapbook-ideas',
  title: 'Digital scrapbook ideas — and why a memory garden does it better',
  description: 'Digital scrapbooks look great. They\'re also passive — no one knows to look at them. Here\'s what works, and what to do instead if you want memories to actually land.',
  publishedAt: '2026-04-15',
  readTime: '5 min',
  category: 'Memory',
  headerImage: '/images/blog-post14-dollar-bill.jpg',
  ctaText: 'Plant memories that actually arrive',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> Digital scrapbooks are beautiful archives. The problem is they're passive — they sit until someone goes looking. If you want memories to actually reach people, you need delivery, not just storage.</p>
      <p style={s.p}>Digital scrapbooking has come a long way. Tools like Canva, Google Photos collages, and dedicated scrapbook apps make it easy to build something genuinely beautiful — layouts, captions, colour themes, the works.</p>
      <p style={s.p}>The question isn't whether digital scrapbooks look good. They do. The question is: does anyone actually go back and look at them?</p>
      <h2 style={s.h2}>The passive archive problem</h2>
      <p style={s.p}>A scrapbook — digital or physical — is an archive. It stores memories in a form that's more intentional than a raw photo dump, which is valuable. But it's still passive. It exists. It waits. It gets opened when someone thinks to open it, which is less often than you'd expect, and rarely at the right moment.</p>
      <p style={s.p}>The memories are there. The delivery isn't built in.</p>
      <h2 style={s.h2}>Digital scrapbook ideas that actually work</h2>
      <p style={s.p}>If you're building a digital scrapbook, these approaches make it more likely to be used:</p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>The "director's commentary" scrapbook</strong> — every photo gets a voice note underneath it explaining what was actually happening behind the camera. Not the caption. The real version. The one you'd only tell a close friend.</li>
        <li style={s.li}><strong style={s.strong}>A "year in numbers" page</strong> — miles driven together, meals cooked, 3am texts sent, inside jokes counted, cities visited. Numbers make abstract time concrete. It hits differently than photos.</li>
        <li style={s.li}><strong style={s.strong}>A "things we said" page</strong> — pull actual quotes from texts. The ones that made you laugh, the ones that were actually important, the ones that only make sense between you. A page of those is more alive than any photo.</li>
        <li style={s.li}><strong style={s.strong}>A milestone scrapbook shared at the event</strong> — graduation, retirement, a big birthday. Print it or pull it up at the table. Give it a moment, not just a folder.</li>
        <li style={s.li}><strong style={s.strong}>A trip scrapbook built during the trip</strong> — build it while you're still there, share it on the last night. The proximity to the memory makes it land differently than six months later.</li>
      </ul>
      <p style={s.p}>The pattern: give the scrapbook a moment and a format that has a point of view. Something that makes it land rather than sit.</p>
      <h2 style={s.h2}>What a memory garden does differently</h2>
      <p style={s.p}>A <a href="/blog/what-is-a-memory-garden" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>memory garden</a> is built around delivery. You don't build an archive and hope someone visits it. You plant a memory — a message, a photo, a voice note — with a specific recipient and a specific date. On that date, it blooms. It arrives. The person receives it whether or not they were thinking about it.</p>
      <p style={s.p}>The difference is orientation. A scrapbook faces inward — it's an archive of the past, for whoever finds it. A memory garden faces outward — it's a message to someone, arriving when you intended.</p>
      <p style={s.p}>As explored in <a href="/blog/best-memory-keeping-app" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>best memory keeping apps in 2026</a>, the missing piece in most tools is the same: the memory needs a destination. Storage is not the same as remembering.</p>
      <h2 style={s.h2}>Use both, for different things</h2>
      <p style={s.p}>A digital scrapbook is great for archiving a year, a trip, an era. A memory garden is great for making sure a specific person receives a specific memory at a specific moment. They're not competing — they're for different jobs.</p>
    </div>
  ),
};

const post15: BlogPost = {
  slug: 'how-to-remember-someone-who-passed-away',
  title: 'How to remember someone who passed away',
  description: 'Grief doesn\'t end. But the rituals of remembrance usually do. Here\'s how to keep someone present — in ways that feel like them, not like obligation.',
  publishedAt: '2026-05-21',
  readTime: '5 min',
  category: 'Relationships',
  headerImage: '/images/blog-post15-photo-frame.jpg',
  ctaText: 'Plant a flower in their memory',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> The most lasting forms of remembrance are the ones that make the person present again, not just commemorated. Stories, recordings, specific memories — shared at the right moments, with the right people.</p>
      <p style={s.p}>Grief has a first chapter and then a long middle that most people face quietly. The ceremonies end. The calls slow down. The casseroles stop arriving. And the person who is gone — the way they laughed, the way they said your name — starts to blur at the edges.</p>
      <p style={s.p}>Remembrance isn't about keeping grief alive. It's about keeping the person alive, in the ways that matter.</p>
      <h2 style={s.h2}>What actually keeps someone present</h2>
      <h3 style={s.h3}>Stories, told out loud</h3>
      <p style={s.p}>The most powerful form of remembrance is the one that requires nothing but someone willing to speak. Tell the stories. The specific ones. The ones that would make the person laugh, or roll their eyes, or feel known. Stories shared out loud are more alive than anything stored in a folder.</p>
      <h3 style={s.h3}>Recordings, if you have them</h3>
      <p style={s.p}>A voicemail. A video. A voice memo from a call. These are irreplaceable. If you have them, save them somewhere permanent and share them with the people who loved the person. Hearing someone's voice is different from reading their words.</p>
      <h3 style={s.h3}>Timed messages, planted before they were gone</h3>
      <p style={s.p}>Some people plant messages in Horizons for people they know they'll outlive — a parent writing to a child for future milestones, a grandparent recording messages to bloom at graduations and weddings they won't attend. These aren't morbid. They're the opposite: they're the person saying, I knew this day would come without me, and I wanted to still be there for it.</p>
      <h3 style={s.h3}>The dates that keep arriving</h3>
      <p style={s.p}>Their birthday. The anniversary of their death. Holidays they were always at. These dates come every year, and they're harder than most people admit to others. Mark them. Do something specific. Cook their recipe. Call someone who loved them too. Send a message to someone else who's holding the same date quietly.</p>
      <p style={s.p}>As we explored in <a href="/blog/gifts-for-someone-grieving" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>gifts for someone who is grieving</a>, the support that matters most is often the support that arrives on those later dates — not in the first week.</p>
      <h2 style={s.h2}>What to do with the things they left behind</h2>
      <p style={s.p}>Photos without context become unidentifiable in one generation. If you have photos of the person who passed, attach context now — who they were with, what was happening, what they were like. A voice note recorded while looking at an old photo is worth more than the photo alone.</p>
      <h2 style={s.h2}>Remembrance as something you do, not something you feel</h2>
      <p style={s.p}>The most meaningful acts of remembrance are chosen, not accidental. Grief is involuntary. Remembrance is a practice. The people who stay most present in a family or a friendship are the ones whose stories are told on purpose — not just when a photo surfaces unexpectedly.</p>
    </div>
  ),
};

const post16: BlogPost = {
  slug: 'email-to-future-self',
  title: 'Email to your future self — and why it usually doesn\'t work',
  description: 'The idea is right. The delivery method is wrong. Here\'s what actually happens to emails sent to future selves — and what to do instead.',
  publishedAt: '2026-05-28',
  readTime: '4 min',
  category: 'Wellness',
  headerImage: '/images/blog-post16-computer.jpg',
  ctaText: 'Send something your future self will actually receive',
  content: () => (
    <div>
      <p style={s.p}><strong style={s.strong}>Short answer:</strong> Emailing your future self is a good instinct and a fragile delivery method. Most future-self emails get lost, ignored, or arrive without ceremony. A blooming flower solves the same problem more reliably.</p>
      <p style={s.p}>The concept of writing to your future self is genuinely useful. It creates a record of who you are right now — your fears, your hopes, your predictions — and gives future you something to compare against. The act of writing it is clarifying. The act of reading it, years later, is often emotional in ways that are hard to anticipate.</p>
      <p style={s.p}>The problem is the email.</p>
      <h2 style={s.h2}>What actually happens to emails sent to your future self</h2>
      <p style={s.p}>Services like FutureMe and similar tools let you write an email now and schedule it to arrive in one, five, or ten years. The idea is sound. The execution has a few consistent failure modes:</p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>The email address changes.</strong> People switch providers, abandon old accounts, change their name. A message sent to an address you had at 24 may not reach you at 34.</li>
        <li style={s.li}><strong style={s.strong}>It lands in spam.</strong> An email from a service you signed up for years ago, arriving years later, has a high chance of being filtered before you see it.</li>
        <li style={s.li}><strong style={s.strong}>It arrives without ceremony.</strong> An email is one of hundreds you'll receive that day. The medium flattens the message. You read it between two work threads and close the tab.</li>
        <li style={s.li}><strong style={s.strong}>The service shuts down.</strong> Several future-self email services have discontinued. If they close before the send date, the message is gone.</li>
      </ul>
      <h2 style={s.h2}>What the email-to-future-self instinct is actually about</h2>
      <p style={s.p}>The instinct is right: you want to capture something now and have it arrive at a specific future moment. You want to feel, when you receive it, that past-you was thinking ahead. That's a meaningful thing to want.</p>
      <p style={s.p}>The email is just an imperfect container for it. As we explored in <a href="/blog/problem-with-digital-time-capsules" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>the problem with digital time capsules</a>, the delivery mechanism matters as much as the content.</p>
      <h2 style={s.h2}>What works better</h2>
      <p style={s.p}>A blooming flower in Horizons works on the same principle — write something now, set a date, let it arrive — but with more reliability and more ceremony. It lives in a private garden, not an inbox. It opens with intention. The recipient — you, or someone you love — receives it as a distinct moment, not a piece of email noise.</p>
      <p style={s.p}>For what to actually write, the structure in <a href="/blog/what-to-write-letter-to-future-self" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>what to write in a letter to your future self</a> applies here too: start with how it feels right now, name one fear, one thing you're proud of, one prediction. Then set it to arrive at a moment that will mean something.</p>
      <h2 style={s.h2}>The email is a good instinct</h2>
      <p style={s.p}>Don't abandon the idea because the method is fragile. The idea — that something you write today can land with your future self at exactly the right moment — is a good one. It just deserves a better container.</p>
    </div>
  ),
};

export const blogPosts: BlogPost[] = [post1, post2, post3, post12, post13, post14, post4, post5, post6, post7, post8, post15, post16, post9, post10, post11];


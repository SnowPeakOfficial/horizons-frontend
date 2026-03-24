import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  category: string;
  headerImage: string;
  ctaText: string;
  content: () => React.ReactNode;
}

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
      <p style={s.p}>In Horizons, this is called a blooming flower — a memory you plant in a private garden, sealed until the bloom date you choose. It links back to the idea we explored in <a href="/blog/best-memory-keeping-app" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>best memory keeping app 2026</a>: context, relationship, and timing — all three, in one thing.</p>
      <blockquote style={s.blockquote}>"I planted ours the day we hit one year. Six months later it bloomed and he called immediately. He goes — I didn't know you'd been holding onto that that long."</blockquote>
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
  publishedAt: '2026-04-09',
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
  publishedAt: '2026-04-16',
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
      <p style={s.p}>In Horizons, a blooming flower can be planted today and sealed until that future date. When it opens, the person isn't receiving something generic sent in the moment — they're receiving proof that you thought ahead, that you knew those days would be hard, that you didn't forget. As we covered in <a href="/blog/long-distance-relationship-gift-ideas" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>long-distance relationship gift ideas</a>, what makes a message land is specificity and timing — both together.</p>
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
  publishedAt: '2026-04-23',
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
  publishedAt: '2026-04-30',
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
      <p style={s.p}>In Horizons, a blooming flower gives the letter a delivery date. You write it, seal it, set the date — your next birthday, the end of the year, a specific moment you know is coming. When it arrives, it opens. You don't have to go looking for it. As we explored in <a href="/blog/problem-with-digital-time-capsules" style={{ color: '#D4909A', textDecoration: 'none', fontWeight: 600 }}>the problem with digital time capsules</a>, the content is rarely the issue. The delivery is.</p>
      <p style={s.p}>Write the letter. Set the date. Let it find you at the right moment.</p>
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
  publishedAt: '2026-05-07',
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
  publishedAt: '2026-06-10',
  readTime: '5 min',
  category: 'Gift Ideas',
  headerImage: '/images/blog-post7-gift-card.jpg',
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

export const blogPosts: BlogPost[] = [post1, post2, post3, post4, post5, post6, post7, post8];


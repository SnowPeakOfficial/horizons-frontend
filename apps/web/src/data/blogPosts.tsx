import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  category: string;
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
  cta: {
    display: 'inline-block', marginTop: '12px', padding: '14px 32px',
    background: 'linear-gradient(135deg, #C2475D 0%, #9B2D42 100%)',
    color: '#fff', borderRadius: '40px', textDecoration: 'none',
    fontWeight: 700, fontSize: '16px', letterSpacing: '0.3px',
  } as React.CSSProperties,
};

// ─── Blog Posts ─────────────────────────────────────────────────────────────

const post1: BlogPost = {
  slug: 'meaningful-gift-long-distance',
  title: 'The most meaningful gift you can give: a message that arrives exactly when they need it',
  description: 'Blooming flowers let you plant a message today and deliver it at a future moment that matters — a birthday, an anniversary, the end of a hard week. Here\'s why that idea is so powerful.',
  publishedAt: '2026-03-24',
  readTime: '5 min',
  category: 'Gift Ideas',
  content: () => (
    <div>
      <p style={s.p}>There is a specific kind of longing that comes with caring about someone who is far away — or even someone close, when life has made you both busy. You want to reach them. You want the moment to land right.</p>
      <p style={s.p}>Flowers get delivered and die. Cards get recycled. Most "digital gifts" feel like an afterthought — a gift card, an e-certificate, something you clearly bought in thirty seconds.</p>
      <p style={s.p}>But what if you could plant a message today — write it carefully, attach a photo or a voice note — and have it arrive on a specific date in the future, sealed until that moment?</p>
      <h2 style={s.h2}>That's what a blooming flower is</h2>
      <p style={s.p}>In Horizons, a blooming flower is a memory you seal. You write your message now — thoughtfully, with time — and choose the exact date it opens. Until then, the recipient sees a bud: a quiet teaser that something is growing, something is waiting.</p>
      <p style={s.p}>On the date you chose, it blooms. Your message, your photo, your voice — all of it revealed at once.</p>
      <blockquote style={s.blockquote}>"I planted it three months before her birthday. She knew something was waiting. When it opened, she cried."</blockquote>
      <h2 style={s.h2}>Why timing changes everything</h2>
      <p style={s.p}>A message that arrives on the right day feels different from one sent at random. The effort of planning — of thinking ahead, of choosing a date that means something — communicates care in a way that a spontaneous text simply cannot.</p>
      <p style={s.p}>A blooming flower planted for a partner's difficult work week, set to open on Friday evening. A message to a parent on their retirement date. A note to yourself at the start of a hard year, set to bloom when it's over.</p>
      <p style={s.p}>The gift isn't just the message. It's the proof that you thought about them far in advance.</p>
      <h2 style={s.h2}>What you can put inside</h2>
      <ul style={s.ul}>
        <li style={s.li}>A written message — as short or as long as you want</li>
        <li style={s.li}>A photo (upload one or take it in the app)</li>
        <li style={s.li}>A voice note — hearing your actual voice is irreplaceable</li>
        <li style={s.li}>A short video</li>
      </ul>
      <p style={s.p}>All of it sealed until the bloom date. All of it private — only visible to the people you invite into the garden.</p>
      <h2 style={s.h2}>The best occasions for a blooming flower</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Anniversaries</strong> — plant it months in advance; let them know something is waiting</li>
        <li style={s.li}><strong style={s.strong}>Birthdays</strong> — especially for people who live far away</li>
        <li style={s.li}><strong style={s.strong}>Hard periods</strong> — set a flower to bloom when a difficult thing ends</li>
        <li style={s.li}><strong style={s.strong}>New Year's</strong> — a message from your present self to your future self</li>
        <li style={s.li}><strong style={s.strong}>Baby arrivals</strong> — plant a letter to the baby before they're even born</li>
      </ul>
      <p style={s.p}>There are no wrong occasions. There is only the decision to be intentional about when something arrives.</p>
      <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
        <a href="/auth/register" style={s.cta}>Plant your first blooming flower →</a>
      </div>
    </div>
  ),
};

const post2: BlogPost = {
  slug: 'anniversary-gift-long-distance-couples',
  title: 'Anniversary gifts for long-distance couples that actually feel personal',
  description: 'Physical gifts shipped across time zones rarely land with the emotional weight the occasion deserves. Here are ideas — including one that arrives exactly when you want it to.',
  publishedAt: '2026-03-28',
  readTime: '6 min',
  category: 'Gift Ideas',
  content: () => (
    <div>
      <p style={s.p}>Long-distance relationships run on two things: trust and the feeling of being remembered. The hard part about anniversaries across distance isn't finding a gift — it's finding something that communicates "I thought about you, specifically, on this specific day."</p>
      <p style={s.p}>Here are the approaches that actually work — and one that we think is genuinely the most personal thing you can do.</p>
      <h2 style={s.h2}>What doesn't work (and why)</h2>
      <p style={s.p}><strong style={s.strong}>Generic delivery gifts.</strong> Flowers from a national delivery service are lovely, but they don't say much about you. They say "I thought of you" — not "I know you, and I chose this."</p>
      <p style={s.p}><strong style={s.strong}>E-gift cards.</strong> Convenient. Impersonal. Nobody keeps an e-gift card in their memory.</p>
      <p style={s.p}><strong style={s.strong}>A long text message sent on the day.</strong> Written in a rush. Sent without much thought. The day comes, the message goes out, and it gets buried under everything else in their phone.</p>
      <h2 style={s.h2}>What works</h2>
      <h3 style={s.h3}>1. A voice note they can keep</h3>
      <p style={s.p}>Record yourself saying what you'd say if you were there. Not a video call — a recording they can return to. The intimacy of hearing your actual voice, unprompted, is something no card can replicate. Keep it raw. Don't edit. That's what makes it real.</p>
      <h3 style={s.h3}>2. A shared photo album of the year</h3>
      <p style={s.p}>Collect 12–20 photos from your year together — screenshots of video calls, photos from visits, screenshots of funny texts. Put them somewhere private and shareable. Go through them together on a call.</p>
      <h3 style={s.h3}>3. A message planted weeks ago, set to bloom today</h3>
      <p style={s.p}>This is the one we think is the most personal thing you can do for an anniversary. Write your message weeks before the date. Attach a photo, record a voice note. Seal it. Set it to open on your anniversary.</p>
      <p style={s.p}>When it opens, they're not just reading a message you sent today. They're reading something you wrote in advance — something you thought about, constructed, chose carefully — proof that this day has been on your mind for a long time.</p>
      <blockquote style={s.blockquote}>"I planted our anniversary flower the day we passed the one-year mark. Six months later, when it bloomed, he called me immediately. He said he didn't know I'd been thinking about it that long."</blockquote>
      <h2 style={s.h2}>How to do it in Horizons</h2>
      <ul style={s.ul}>
        <li style={s.li}>Create a garden — your private shared space</li>
        <li style={s.li}>Invite your partner as a contributor</li>
        <li style={s.li}>Plant a blooming flower, set the bloom date to your anniversary</li>
        <li style={s.li}>Write your message, attach a photo or voice note</li>
        <li style={s.li}>Choose the Romantic letter theme</li>
        <li style={s.li}>Watch it bloom together on the day</li>
      </ul>
      <p style={s.p}>It's free to start. No subscription required for your first garden.</p>
      <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
        <a href="/auth/register" style={s.cta}>Create your shared garden →</a>
      </div>
    </div>
  ),
};

const post3: BlogPost = {
  slug: 'digital-memory-preservation',
  title: 'Why photos in your camera roll are not the same as preserved memories',
  description: 'You have thousands of photos. But do you have the stories behind them? Here is why context is the thing that makes a memory last.',
  publishedAt: '2026-04-01',
  readTime: '4 min',
  category: 'Memory',
  content: () => (
    <div>
      <p style={s.p}>The average person has 2,000+ photos on their phone. Most of them will never be seen again after the first week. Not because they don't matter — but because a photo, on its own, is incomplete.</p>
      <p style={s.p}>A memory is not the image. A memory is the image plus the feeling you had, the thing that was said, the way the light looked, the reason you were there at all.</p>
      <h2 style={s.h2}>What gets lost</h2>
      <p style={s.p}>Grandparents' photos sit in boxes unlabeled. Even digital albums become unidentifiable over time — who is that? Where was this? When? The photo remains. The meaning evaporates.</p>
      <p style={s.p}>The people who know the context are the ones who are here now. Every year that passes without recording it is a year of context that disappears.</p>
      <h2 style={s.h2}>What preservation actually means</h2>
      <p style={s.p}>A preserved memory has three things: the artifact (photo, audio, video), the story (what was happening, why it mattered), and the anchoring (who it's for, when it should be remembered).</p>
      <p style={s.p}>That third piece — anchoring — is what most tools miss. A photo in iCloud is preserved but unanchored. It exists. But it isn't pointed anywhere. It has no intended recipient, no moment of arrival.</p>
      <h2 style={s.h2}>What anchored preservation looks like</h2>
      <p style={s.p}>In Horizons, each flower is anchored by design. You choose who it's for. You write the context. You decide when it opens. The memory doesn't just sit there — it arrives. It blooms at the right moment, for the right person.</p>
      <blockquote style={s.blockquote}>'I planted a flower with photos from my dad's last healthy summer. Set it to bloom on his birthday, the year after he passed. My brother opened it. He said it was like hearing from Dad one more time.'</blockquote>
      <p style={s.p}>That is what preservation actually means. Not storage. Delivery. Intentional, human, timed delivery.</p>
      <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
        <a href='/auth/register' style={s.cta}>Start preserving your memories →</a>
      </div>
    </div>
  ),
};

const post4: BlogPost = {
  slug: 'gifts-for-grieving-friend',
  title: 'What to give someone who is grieving: the case for a message, not a thing',
  description: 'When someone we love is going through loss, we reach for objects — flowers, food, cards. But what they often need most is a message that tells them they are not forgotten.',
  publishedAt: '2026-04-05',
  readTime: '5 min',
  category: 'Relationships',
  content: () => (
    <div>
      <p style={s.p}>When someone we care about is grieving, the impulse is to do something — send flowers, bring food, drop off a card. These gestures are not wrong. But they are often over in a moment. The flowers wilt. The food is eaten. The card gets set aside.</p>
      <p style={s.p}>What most grieving people describe needing is not more things in the first week. It is the feeling of being remembered in the weeks and months after — when the casseroles stop and everyone else has moved on.</p>
      <h2 style={s.h2}>The loneliness of later grief</h2>
      <p style={s.p}>The acute phase of grief gets attention. The long tail does not. Most people receive an outpouring of support in the first two weeks. By week six, the messages have slowed. By month three, they've nearly stopped.</p>
      <p style={s.p}>But grief does not stop at month three. It reshapes. It moves. And the people moving through it often feel, quietly, that everyone else has returned to their lives.</p>
      <h2 style={s.h2}>A message timed for the hard moments</h2>
      <p style={s.p}>This is where a blooming flower can do something no physical gift can. You can plant a message today — writing it now, when you have the time and the words — and set it to arrive at a specific future moment.</p>
      <p style={s.p}>The first anniversary of the loss. The deceased person's birthday. A holiday that will be hard. A milestone the person was supposed to be there for.</p>
      <p style={s.p}>Your message, planted now, arrives then — proof that you thought ahead, that you knew those days would be hard, that you didn't forget.</p>
      <blockquote style={s.blockquote}>'She planted a flower for me set to bloom on my mother's first birthday after she passed. When it opened, I was already having a terrible day. Reading her message felt like being caught.'</blockquote>
      <h2 style={s.h2}>What to write</h2>
      <p style={s.p}>You do not need to say the right thing. There is no right thing. What matters is specificity. Say the person's name. Mention a specific memory. Say what you miss about them, not just that you're sorry for their loss.</p>
      <p style={s.p}>Write it the way you would if you had all the time in the world — because with a blooming flower, you do.</p>
      <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
        <a href='/auth/register' style={s.cta}>Plant a message for someone you love →</a>
      </div>
    </div>
  ),
};

const post5: BlogPost = {
  slug: 'family-memory-garden-guide',
  title: 'How to build a family memory garden: a guide for parents and grandparents',
  description: 'A shared garden in Horizons can become a living archive of your family — stories, photos, letters, and blooming messages for every milestone your children and grandchildren will reach.',
  publishedAt: '2026-04-10',
  readTime: '7 min',
  category: 'Guides',
  content: () => (
    <div>
      <p style={s.p}>One of the most powerful things a parent or grandparent can build is a record of the family as it was — the stories that don't make it into photos, the feelings that don't make it into conversation, the messages intended for moments that haven't happened yet.</p>
      <p style={s.p}>A family memory garden in Horizons is a way to do all of that in one private, beautiful place.</p>
      <h2 style={s.h2}>What a family memory garden contains</h2>
      <p style={s.p}>Each flower in the garden is a memory unit — a combination of message, media, and timing. You can plant flowers that open immediately for everyone in the garden to see. Or you can plant blooming flowers that stay sealed until a specific date.</p>
      <p style={s.p}>A typical family garden might contain:</p>
      <ul style={s.ul}>
        <li style={s.li}>Flowers with stories from the family's history — grandparents planting memories from decades ago</li>
        <li style={s.li}>Blooming flowers timed for children's future milestones — their 18th birthday, graduation, wedding</li>
        <li style={s.li}>Annual flowers planted on the same date each year, building a living timeline</li>
        <li style={s.li}>Collaborative flowers where multiple family members contribute</li>
      </ul>
      <h2 style={s.h2}>The letter to your future grandchild</h2>
      <p style={s.p}>One of the most common uses we see: grandparents planting a flower the day a grandchild is born, set to bloom on their 18th birthday. Inside: a letter written to someone who doesn't yet exist as the adult they'll become.</p>
      <p style={s.p}>Eighteen years from now, that grandchild opens a garden. A flower blooms. Inside is a voice note from someone who may no longer be alive — speaking directly to them, knowing this day would come.</p>
      <blockquote style={s.blockquote}>'My mother planted a flower for my daughter the week she was born. She passed two years later. That flower is scheduled to bloom on my daughter's graduation day. I can not explain what it means to know it will be there.'</blockquote>
      <h2 style={s.h2}>How to set it up</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Create the garden</strong> and name it something that signals its purpose — 'The Family Garden,' 'Our Story,' 'For the Kids'</li>
        <li style={s.li}><strong style={s.strong}>Invite family members</strong> as contributors or viewers depending on what you want them to see</li>
        <li style={s.li}><strong style={s.strong}>Start with one flower</strong> — something immediate, something that captures a moment from right now</li>
        <li style={s.li}><strong style={s.strong}>Plant one blooming flower</strong> for a future milestone you know is coming</li>
        <li style={s.li}><strong style={s.strong}>Make it a practice</strong> — plant something on every significant occasion going forward</li>
      </ul>
      <p style={s.p}>The garden grows over time. That is the point. Not a single gesture but a living archive that accumulates with every year, every visit, every milestone.</p>
      <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
        <a href='/auth/register' style={s.cta}>Start your family garden today →</a>
      </div>
    </div>
  ),
};

const post6: BlogPost = {
  slug: 'self-care-time-capsule',
  title: 'The self-care practice nobody talks about: writing to your future self',
  description: 'A letter to your future self is one of the most clarifying things you can write. Here is why the practice works, and how a blooming flower makes it something you can actually return to.',
  publishedAt: '2026-04-15',
  readTime: '5 min',
  category: 'Wellness',
  content: () => (
    <div>
      <p style={s.p}>There is a version of journaling that most people never try: writing not to process the present, but to send something forward. A message from the person you are now, addressed to the person you will be.</p>
      <p style={s.p}>This practice has a name — the future self letter — and the research behind it is surprisingly robust. People who write to their future selves report clearer goal-setting, greater self-compassion, and a stronger sense of identity continuity.</p>
      <p style={s.p}>The problem is that most future self letters get lost. Written in a notebook, buried in a document, never returned to. The act of writing matters. But the act of receiving — of actually opening the letter at the intended moment — matters just as much.</p>
      <h2 style={s.h2}>What a blooming flower solves</h2>
      <p style={s.p}>A blooming flower planted for yourself is a time capsule with a guaranteed delivery date. You write the message now. You set the bloom date — one year from now, on your next birthday, at the end of a hard season. On that date, it opens.</p>
      <p style={s.p}>You don't have to remember to look for it. You don't have to find the notebook. It arrives.</p>
      <h2 style={s.h2}>What to write</h2>
      <ul style={s.ul}>
        <li style={s.li}>Where you are right now — not just logistically but emotionally</li>
        <li style={s.li}>What you are afraid of, and what you are hoping for</li>
        <li style={s.li}>A specific goal you want to check in on</li>
        <li style={s.li}>Something you want your future self to remember about this period</li>
        <li style={s.li}>Permission to have changed your mind about everything</li>
      </ul>
      <h2 style={s.h2}>When to set it to bloom</h2>
      <p style={s.p}>The most powerful timing is just past a meaningful threshold — the end of a year, after a specific challenge is supposed to be complete, on a birthday that feels significant. The gap between writing and receiving is where the magic happens. You forget the exact words. Life moves. And then it arrives, and you meet the version of yourself that wrote it.</p>
      <blockquote style={s.blockquote}>'I planted a flower to myself at the start of a really hard year. Set it to bloom 12 months later. When it opened, I was in a completely different place — and reading what I had written then was one of the most emotional things I have ever experienced.'</blockquote>
      <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
        <a href='/auth/register' style={s.cta}>Plant a letter to your future self →</a>
      </div>
    </div>
  ),
};

export const blogPosts: BlogPost[] = [post1, post2, post3, post4, post5, post6];


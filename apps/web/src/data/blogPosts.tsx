import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  category: string;
  headerImage: string;
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
  slug: 'meaningful-gift-long-distance',
  title: 'The most meaningful gift you can give: a message that arrives exactly when they need it',
  description: 'Blooming flowers let you plant a message today and deliver it at a future moment that matters — a birthday, an anniversary, the end of a hard week. Here\'s why that idea is so powerful.',
  publishedAt: '2026-03-25',
  readTime: '5 min',
  category: 'Gift Ideas',
  headerImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80&auto=format&fit=crop',
  content: () => (
    <div>
      <p style={s.p}>There is a specific kind of longing that comes with caring about someone far away — or even someone close, when life has made you both busy. You want to reach them. You want the moment to land right.</p>
      <p style={s.p}>Some moments shouldn't arrive late.</p>
      <p style={s.p}>Flowers get delivered and die. Cards get recycled. Most digital gifts feel like an afterthought — something bought in thirty seconds, sent and forgotten the same day.</p>
      <p style={s.p}>But what if you could plant a message today — write it carefully, attach a photo or a voice note — and have it arrive on a specific date in the future, sealed until that moment?</p>
      <h2 style={s.h2}>That's what a blooming flower is</h2>
      <p style={s.p}>In Horizons, a blooming flower is a memory you seal. You write your message now — with time, with thought — and choose the exact date it opens. Until then, the recipient sees a bud: something growing, something waiting. The anticipation is part of the gift.</p>
      <p style={s.p}>On the date you chose, it blooms. Your message, your photo, your voice — all of it revealed at once.</p>
      <blockquote style={s.blockquote}>"I planted it three months out. She kept asking what it was. When it finally opened she just — yeah. She cried."</blockquote>
      <h2 style={s.h2}>Why timing changes everything</h2>
      <p style={s.p}>A message that arrives on the right day feels different from one sent at random. The effort of planning — of thinking ahead, of choosing a date that means something — communicates care in a way that a spontaneous text cannot.</p>
      <p style={s.p}>A flower planted for a partner's hard week, set to open on Friday evening. A message to a parent on their retirement date. A note to yourself at the start of a difficult year, set to bloom when it's over.</p>
      <p style={s.p}>The gift isn't just the message. It's the proof that you thought about them long before the day arrived.</p>
      <h2 style={s.h2}>What you can put inside</h2>
      <ul style={s.ul}>
        <li style={s.li}>A written message — as short or as long as you need</li>
        <li style={s.li}>A photo (upload one or take it in the app)</li>
        <li style={s.li}>A voice note — hearing your actual voice is irreplaceable</li>
        <li style={s.li}>A short video</li>
      </ul>
      <p style={s.p}>All of it sealed until the bloom date. All of it private — only visible to the people you invite into the garden.</p>
      <h2 style={s.h2}>When to use one</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Anniversaries</strong> — plant it months in advance; let them live with the anticipation</li>
        <li style={s.li}><strong style={s.strong}>Birthdays</strong> — especially for people who live far away</li>
        <li style={s.li}><strong style={s.strong}>Hard seasons</strong> — set a flower to bloom when a difficult thing ends</li>
        <li style={s.li}><strong style={s.strong}>New Year's</strong> — a message from your present self to your future self</li>
        <li style={s.li}><strong style={s.strong}>Baby arrivals</strong> — plant a letter before they're even born</li>
      </ul>
      <p style={s.p}>There are no wrong occasions. There is only the decision to be intentional about when something arrives.</p>
    </div>
  ),
};

const post2: BlogPost = {
  slug: 'anniversary-gift-long-distance-couples',
  title: 'Anniversary gifts for long-distance couples that actually feel personal',
  description: 'Physical gifts shipped across time zones rarely land with the emotional weight the occasion deserves. Here are ideas — including one that arrives exactly when you want it to.',
  publishedAt: '2026-04-05',
  readTime: '6 min',
  category: 'Gift Ideas',
  headerImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80&auto=format&fit=crop',
  content: () => (
    <div>
      <p style={s.p}>Long-distance relationships run on two things: trust and the feeling of being remembered. Distance doesn't break most couples. Being forgotten does.</p>
      <p style={s.p}>The hard part about anniversaries across distance isn't finding a gift — it's finding something that says "I thought about you specifically, on this specific day." Not because you had to. Because you wanted to.</p>
      <h2 style={s.h2}>What doesn't work</h2>
      <p style={s.p}><strong style={s.strong}>Generic delivery gifts</strong> say "I thought of you." They don't say "I know you." <strong style={s.strong}>E-gift cards</strong> are convenient and immediately forgotten. <strong style={s.strong}>A text sent on the day</strong> gets buried in their phone within hours.</p>
      <p style={s.p}>None of these are wrong. They just don't carry the weight the day deserves.</p>
      <h2 style={s.h2}>What works</h2>
      <h3 style={s.h3}>1. A voice note they can keep</h3>
      <p style={s.p}>Record yourself saying what you'd say if you were there. Not a call — a recording they can return to. Keep it raw. Don't edit. The imperfection is what makes it feel real and close, even across the distance.</p>
      <h3 style={s.h3}>2. A shared photo album of the year</h3>
      <p style={s.p}>Collect 12–20 photos from your year — screenshots of video calls, photos from visits, funny texts. Go through them together on a call. The act of reviewing it together does more than the album itself.</p>
      <h3 style={s.h3}>3. A message planted weeks ago, set to bloom today</h3>
      <p style={s.p}>Write your message weeks before the date. Attach a photo, record a voice note. Seal it. Set it to open on your anniversary.</p>
      <p style={s.p}>When it opens, they're not reading something you sent today. They're reading something you wrote across the distance — proof that this day has been on your mind for a long time.</p>
      <blockquote style={s.blockquote}>"I planted ours the day we hit one year. Six months later it bloomed and he called me right away. He goes, I didn't know you'd been holding onto that that long."</blockquote>
      <h2 style={s.h2}>How to do it in Horizons</h2>
      <ul style={s.ul}>
        <li style={s.li}>Create a garden — your private shared space</li>
        <li style={s.li}>Invite your partner as a contributor</li>
        <li style={s.li}>Plant a blooming flower, set the bloom date to your anniversary</li>
        <li style={s.li}>Write your message, attach a photo or voice note</li>
        <li style={s.li}>Choose the Romantic letter theme</li>
        <li style={s.li}>Watch it bloom together on the day</li>
      </ul>
      <p style={s.p}>Free to start. No subscription required for your first garden.</p>
    </div>
  ),
};

const post3: BlogPost = {
  slug: 'digital-memory-preservation',
  title: 'Why photos in your camera roll are not the same as preserved memories',
  description: 'You have thousands of photos. But do you have the stories behind them? Here is why context is the thing that makes a memory last.',
  publishedAt: '2026-04-17',
  readTime: '4 min',
  category: 'Memory',
  headerImage: 'https://images.unsplash.com/photo-1515965885361-f1e0095517ea?w=1200&q=80&auto=format&fit=crop',
  content: () => (
    <div>
      <p style={s.p}>The average person has 2,000+ photos on their phone. Most will never be seen again after the first week. Not because they don't matter — but because a photo, on its own, is incomplete.</p>
      <p style={s.p}>Storage is not the same as remembering.</p>
      <p style={s.p}>A memory is not the image. A memory is the image plus the feeling you had, the thing that was said, the way the light looked, the reason you were there.</p>
      <h2 style={s.h2}>What gets lost</h2>
      <p style={s.p}>Grandparents' photos sit in boxes, unlabeled. Digital albums become unidentifiable — who is that? Where was this? The photo survives. The meaning doesn't.</p>
      <p style={s.p}>The people who know the context are here now. Every year without recording it is a year of context gone.</p>
      <h2 style={s.h2}>What preservation actually means</h2>
      <p style={s.p}>A preserved memory has three things: the artifact (photo, audio, video), the story (what was happening, why it mattered), and anchoring — who it's for, when it should be remembered.</p>
      <p style={s.p}>Anchoring is what most tools miss entirely. A photo in iCloud is stored but unanchored. It exists. It isn't pointed anywhere. It has no intended recipient, no moment of arrival. It will sit there until the account lapses.</p>
      <h2 style={s.h2}>What anchored preservation looks like</h2>
      <p style={s.p}>In Horizons, each flower is anchored by design. You choose who it's for. You write the context. You decide when it opens. The memory doesn't just sit — it arrives. It blooms at the right moment, for the right person.</p>
      <blockquote style={s.blockquote}>"I planted a flower with photos from my dad's last healthy summer. Set it to bloom on his birthday, the year after he passed. My brother opened it and just — he said it felt like hearing from him again."</blockquote>
      <p style={s.p}>That is what preservation means. Not storage. Delivery. Intentional, timed, human delivery.</p>
    </div>
  ),
};

const post4: BlogPost = {
  slug: 'gifts-for-grieving-friend',
  title: 'What to give someone who is grieving: the case for a message, not a thing',
  description: 'When someone we love is going through loss, we reach for objects — flowers, food, cards. But what they often need most is a message that tells them they are not forgotten.',
  publishedAt: '2026-04-29',
  readTime: '5 min',
  category: 'Relationships',
  headerImage: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=1200&q=80&auto=format&fit=crop',
  content: () => (
    <div>
      <p style={s.p}>What people often need isn't more support in the first week. It's to not be forgotten later.</p>
      <p style={s.p}>When someone is grieving, the impulse is to do something — send flowers, bring food, drop off a card. These gestures aren't wrong. But they're over fast. The flowers wilt. The food is eaten. The card gets set aside.</p>
      <p style={s.p}>The absence — the person who is no longer there — doesn't end. But the attention does.</p>
      <h2 style={s.h2}>The loneliness of later grief</h2>
      <p style={s.p}>Most people receive an outpouring of support in the first two weeks. By week six, messages have slowed. By month three, nearly stopped.</p>
      <p style={s.p}>But grief doesn't stop at month three. It reshapes. It moves. And the people carrying it often feel, quietly, that everyone else has returned to their lives — as if the loss belongs only to them now.</p>
      <h2 style={s.h2}>A message timed for the hard moments</h2>
      <p style={s.p}>A blooming flower can do something no physical gift can. Plant a message today — write it now, when you have the time and the words — and set it to arrive at a specific future moment.</p>
      <p style={s.p}>The first anniversary of the loss. The deceased person's birthday. A holiday that will be hard. A milestone the person was supposed to be there for.</p>
      <p style={s.p}>Your message, planted now, arrives then — proof that you thought ahead, that you knew those days would be hard, that you didn't forget.</p>
      <blockquote style={s.blockquote}>"She planted one for me set to bloom on my mom's first birthday after she passed. I was already having a bad day when it opened. Reading it — I don't know. It felt like being caught before I fell."</blockquote>
      <h2 style={s.h2}>What to write</h2>
      <p style={s.p}>You don't need to say the right thing. There is no right thing. What matters is specificity — say the person's name, mention a real memory, say what you miss about them. Not just that you're sorry for their loss.</p>
      <p style={s.p}>Write it like you have all the time in the world. With a blooming flower, you do.</p>
    </div>
  ),
};

const post5: BlogPost = {
  slug: 'family-memory-garden-guide',
  title: 'How to build a family memory garden: a guide for parents and grandparents',
  description: 'A shared garden in Horizons can become a living archive of your family — stories, photos, letters, and blooming messages for every milestone your children and grandchildren will reach.',
  publishedAt: '2026-05-12',
  readTime: '7 min',
  category: 'Guides',
  headerImage: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&q=80&auto=format&fit=crop',
  content: () => (
    <div>
      <p style={s.p}>One of the most powerful things a parent or grandparent can build is a record of the family as it was — the stories that don't make it into photos, the feelings that never quite make it into conversation, the messages intended for moments that haven't happened yet.</p>
      <p style={s.p}>A family memory garden in Horizons is a way to do all of that in one private place. And unlike a box of photos or an unlabeled album, it's built to be found.</p>
      <h2 style={s.h2}>The letter to your future grandchild</h2>
      <p style={s.p}>One of the most common uses we see: a grandparent planting a flower the day a grandchild is born, set to bloom on their 18th birthday. Inside: a letter written to someone who doesn't yet exist as the adult they'll become.</p>
      <p style={s.p}>Eighteen years from now, that grandchild opens a garden. A flower blooms. Inside is a voice note from someone who may no longer be alive — speaking directly to them, knowing this day would come. That is what legacy actually looks like.</p>
      <blockquote style={s.blockquote}>"My mom planted one for my daughter the week she was born. She passed two years later. That flower is set to bloom on my daughter's graduation. I genuinely cannot explain what it means to know it's waiting there."</blockquote>
      <h2 style={s.h2}>How to set it up</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Create the garden</strong> — name it something that signals its purpose: "The Family Garden," "Our Story," "For the Kids"</li>
        <li style={s.li}><strong style={s.strong}>Invite family members</strong> as contributors or viewers depending on what you want them to see</li>
        <li style={s.li}><strong style={s.strong}>Start with one flower</strong> — something immediate that captures this moment</li>
        <li style={s.li}><strong style={s.strong}>Plant one blooming flower</strong> for a future milestone you know is coming</li>
        <li style={s.li}><strong style={s.strong}>Make it a practice</strong> — plant something on every significant occasion going forward</li>
      </ul>
      <p style={s.p}>The garden grows over time. That is the point. Not a single gesture but a living archive — accumulating with every year, every visit, every milestone. The people planting may not be here when the flowers open. That is exactly why they plant them.</p>
    </div>
  ),
};

const post6: BlogPost = {
  slug: 'self-care-time-capsule',
  title: 'The self-care practice nobody talks about: writing to your future self',
  description: 'A letter to your future self is one of the most clarifying things you can write. Here is why the practice works, and how a blooming flower makes it something you can actually return to.',
  publishedAt: '2026-05-26',
  readTime: '5 min',
  category: 'Wellness',
  headerImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop',
  content: () => (
    <div>
      <p style={s.p}>There is a version of journaling that most people never try: writing not to process the present, but to send something forward. A message from the person you are now, addressed to the person you will be.</p>
      <p style={s.p}>Most journaling is written and forgotten. This isn't.</p>
      <p style={s.p}>The practice has a name — the future self letter — and the research is surprisingly robust. People who write to their future selves report clearer goals, greater self-compassion, and a stronger sense of who they are across time.</p>
      <p style={s.p}>The problem is delivery. Most future self letters get lost — written in a notebook, buried in a document, never opened at the right moment. The writing matters. But so does the receiving.</p>
      <h2 style={s.h2}>What a blooming flower solves</h2>
      <p style={s.p}>A blooming flower planted for yourself is a time capsule with a guaranteed delivery date. Write the message now. Set the bloom date — one year from now, your next birthday, the end of a hard season. On that date, it opens.</p>
      <p style={s.p}>You don't have to remember to look for it. It arrives.</p>
      <h2 style={s.h2}>What to write</h2>
      <ul style={s.ul}>
        <li style={s.li}>Where you are right now — not logistically, emotionally</li>
        <li style={s.li}>What you're afraid of, and what you're hoping for</li>
        <li style={s.li}>A specific goal you want to check in on</li>
        <li style={s.li}>Something you want your future self to remember about this period</li>
        <li style={s.li}>Permission to have changed your mind about everything</li>
      </ul>
      <h2 style={s.h2}>When to set it to bloom</h2>
      <p style={s.p}>The most powerful timing is just past a meaningful threshold — the end of a hard year, after a specific challenge is supposed to be done, on a birthday that feels significant. The gap between writing and receiving is where it works. You forget the exact words. Life moves. Then it opens, and you meet the version of yourself that wrote it.</p>
      <blockquote style={s.blockquote}>"I planted one at the start of a really bad year. Set it to bloom twelve months later. When it opened I was in a completely different place. Reading what I'd written — honestly one of the most emotional things I've been through."</blockquote>
    </div>
  ),
};

const post7: BlogPost = {
  slug: 'gift-and-a-memory',
  title: 'A gift card, and something to remember it by',
  description: 'Gift cards solve the practical problem. Memories solve the emotional one. Here\'s how to give both at once.',
  publishedAt: '2026-06-10',
  readTime: '5 min',
  category: 'Gift Ideas',
  headerImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80&auto=format&fit=crop',
  content: () => (
    <div>
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

export const blogPosts: BlogPost[] = [post1, post2, post3, post4, post5, post6, post7];


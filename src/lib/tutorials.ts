import type { DrillType } from "./types";

export interface WorkedExample {
  source: { title: string; excerpt: string };
  responses: { label: string; value: string }[];
}

export interface Tutorial {
  drillType: DrillType;
  title: string;
  phase: number;
  what: string;
  why: string;
  steps: string[];
  tips: string[];
  workedExample: WorkedExample;
}

export const TUTORIALS: Tutorial[] = [
  {
    drillType: "argument-anatomy",
    title: "Argument Anatomy",
    phase: 1,
    what: "Break any argument into four parts: the Claim (what they're asserting), the Reason (why they believe it), the Evidence (data or examples backing it up), and the Hidden Assumption (the unstated belief the argument depends on).",
    why: "Most bad arguments survive because nobody stops to diagram them. Once you can see the skeleton — especially the hidden assumption — weak reasoning becomes obvious. This is the foundation every other skill builds on.",
    steps: [
      "Read the source material. Don't react yet — just read.",
      "Find the Claim: what is the author actually asserting? State it in one sentence.",
      "Find the Reason: what is their main justification? Not all reasons, just the load-bearing one.",
      "Find the Evidence: what concrete data, examples, or citations do they use? If it's another opinion, that's a reason, not evidence.",
      "Find the Hidden Assumption: what must be true for the reason to support the claim, but is never explicitly stated? This is the part most people miss.",
    ],
    tips: [
      "The claim is not always in the first sentence. Sometimes it's buried in the middle or implied.",
      "Don't confuse reasons with evidence. \"Studies show\" is a reason. \"A 2023 Stanford study of 16,000 workers found...\" is evidence.",
      "A good hidden assumption is one that, if false, collapses the entire argument. If removing it doesn't matter, dig deeper.",
      "Don't judge the argument while diagramming it. Analysis and evaluation are different skills.",
    ],
    workedExample: {
      source: {
        title: "Cities should ban cars from downtown areas",
        excerpt:
          "Urban planners increasingly argue that car-free city centers improve quality of life. European cities that have pedestrianized their downtowns report higher retail revenue, lower pollution, and more foot traffic. The data from Barcelona's superblocks program shows a 25% increase in local business revenue after cars were removed. It's time American cities followed suit.",
      },
      responses: [
        {
          label: "Claim",
          value: "American cities should ban cars from their downtown areas.",
        },
        {
          label: "Main reason given",
          value:
            "European cities that did this saw improvements in retail revenue, pollution, and foot traffic.",
        },
        {
          label: "Evidence used",
          value:
            "Barcelona's superblocks program: 25% increase in local business revenue after removing cars.",
        },
        {
          label: "Hidden assumption",
          value:
            "That results from compact, transit-rich European cities will transfer to sprawling, car-dependent American cities with different infrastructure and commuting patterns.",
        },
      ],
    },
  },
  {
    drillType: "model-apply",
    title: "Mental Model — Apply",
    phase: 2,
    what: "You're given a specific mental model (like Survivorship Bias, Opportunity Cost, or the Dunning-Kruger Effect). Your job is to find how that model explains or illuminates a piece of real-world content.",
    why: "Mental models are thinking shortcuts that experts use instinctively. By practicing deliberate application, you build a toolkit of lenses you can reach for instead of starting from scratch every time you encounter a new problem.",
    steps: [
      "Read the mental model's definition carefully. Make sure you understand the mechanism, not just the name.",
      "Read the source material.",
      "Ask: where in this content is the model's mechanism actually at work? Be specific.",
      "Write 3-4 sentences explaining the connection. Name what the model predicts and whether the content confirms or contradicts that prediction.",
    ],
    tips: [
      "Don't force it. If the model doesn't genuinely apply, say so — that's a valid insight too.",
      "Go beyond surface-level. \"This is an example of confirmation bias\" is not enough. Explain the mechanism: who is confirming what, and what would they need to see to change their mind?",
      "The best applications reveal something non-obvious. If everyone would see the connection, push for a less obvious angle.",
    ],
    workedExample: {
      source: {
        title: "Why most restaurant reviews are positive",
        excerpt:
          "Yelp data shows that the average restaurant rating is 3.8 out of 5. Critics argue this makes ratings useless — if everything is above average, how do you distinguish? But the pattern persists year after year: most listed restaurants cluster between 3.5 and 4.5 stars.",
      },
      responses: [
        {
          label: "Model: Survivorship Bias",
          value:
            "The high average isn't because reviewers are too generous — it's because bad restaurants don't survive long enough to accumulate reviews. Yelp's dataset is filtered by market selection: restaurants that are truly bad close within months, dropping off the platform. The 3.8 average reflects the survivors, not the full population of restaurants that ever opened. If you could include every restaurant that opened and closed within a year, the average would be much lower. This is the same mechanism that makes mutual fund track records look good — the terrible ones get shut down and disappear from the data.",
        },
      ],
    },
  },
  {
    drillType: "model-identify",
    title: "Mental Model — Identify",
    phase: 2,
    what: "You're given a piece of content with no model named. Your job is to figure out which mental model(s) from your library best explain what's happening — before being shown the answer.",
    why: "Applying a model you're handed is one skill. Recognizing which model is at work in the wild is a harder, more useful skill. This is what separates someone who has memorized models from someone who actually thinks with them.",
    steps: [
      "Read the source material carefully.",
      "Ask yourself: what pattern or mechanism is driving the situation described?",
      "Scan your mental model library mentally. Which models describe this kind of pattern?",
      "Write your guess — which model(s) and why.",
      "After revealing the suggested answer, reflect: were you close? What did you miss?",
    ],
    tips: [
      "Multiple models can apply simultaneously. Real situations are messy.",
      "If you're stuck, ask: is this about incentives? information? selection? timing? framing? That narrows the field.",
      "Wrong guesses are valuable. Reflecting on why you guessed wrong teaches you the boundaries of each model.",
    ],
    workedExample: {
      source: {
        title: "The productivity paradox of open-plan offices",
        excerpt:
          "Companies adopted open offices to increase collaboration, but a Harvard study found that face-to-face interactions dropped 70% after the switch. Employees compensated by putting on headphones and sending more emails. The very design meant to encourage spontaneous conversation made people retreat into digital communication.",
      },
      responses: [
        {
          label: "Your guess",
          value:
            "This looks like the Cobra Effect (perverse incentive). The intervention designed to solve a problem made it worse. It could also be Goodhart's Law — they optimized for the proxy (physical proximity) rather than the actual goal (collaboration), and the proxy broke down when it became the target.",
        },
        {
          label: "After revealing — reflection",
          value:
            "The suggested model was Cobra Effect, which I got. I missed that it's also an example of Second-Order Thinking failure — they considered the first-order effect (people sit closer → they talk more) but not the second-order effect (people who can't control their environment → they create barriers). The Harvard data was the key clue: the 70% drop is a classic perverse outcome.",
        },
      ],
    },
  },
  {
    drillType: "3-in-3",
    title: "3-in-3 Counter-Arguments",
    phase: 3,
    what: "Take any claim and generate three distinct counter-arguments in three minutes. Speed matters more than polish. This is about building the reflex to immediately see the other side.",
    why: "Most people can eventually think of a counter-argument if given enough time. The goal here is to make it automatic — a reflex, not a deliberate effort. Three minutes forces you to reach for objections quickly, which is exactly how you need to think in real conversations, meetings, and while reading.",
    steps: [
      "Read the claim. Understand what it's asserting.",
      "Start the 3-minute timer.",
      "Write your first counter-argument. Don't overthink — get something down.",
      "Write your second counter-argument. Make sure it attacks a different aspect of the claim than #1.",
      "Write your third counter-argument. Push for a genuinely different angle, not a variation of #1 or #2.",
      "Stop when the timer ends, even if you're mid-sentence.",
    ],
    tips: [
      "The three counter-arguments should be genuinely different, not three versions of the same objection.",
      "Attack different parts: one could challenge the evidence, one the logic, one the framing.",
      "Don't worry about being right. Worry about being distinct.",
      "If you're stuck, try these angles: Who loses from this? What if the opposite were true? What's the strongest precedent against it?",
    ],
    workedExample: {
      source: {
        title: "Claim to counter",
        excerpt:
          "Social media companies should be legally required to verify the age of all users.",
      },
      responses: [
        {
          label: "Counter-argument 1",
          value:
            "Age verification requires collecting government IDs or biometric data, creating massive privacy risks. A centralized database of children's identities linked to their online activity is exactly the kind of target that attracts hackers and state surveillance.",
        },
        {
          label: "Counter-argument 2",
          value:
            "It won't work — teenagers will use VPNs, their parents' accounts, or offshore platforms. Alcohol age verification laws haven't stopped underage drinking; digital verification is even easier to circumvent. You'd just push kids to less regulated spaces.",
        },
        {
          label: "Counter-argument 3",
          value:
            "The premise assumes the problem is access rather than design. Kids aren't harmed by having an account — they're harmed by algorithmic amplification of harmful content, infinite scroll, and engagement-maximizing design. You could regulate the product design without gatekeeping access.",
        },
      ],
    },
  },
  {
    drillType: "steelman",
    title: "Steelman First",
    phase: 3,
    what: "Pick a position you disagree with. Before attacking it, write the absolute strongest version of it — the version its smartest, most informed defender would give. Only then write your response.",
    why: "Most people argue against a weak version of what the other side believes (a straw man). Steelmanning forces you to genuinely understand the opposing view at its best. Your eventual critique becomes much sharper because you're attacking the strongest form, not the weakest.",
    steps: [
      "Find a position you genuinely disagree with.",
      "Set aside your disagreement. Pretend you're the world's best advocate for this position.",
      "Write the steelman: 4-5 sentences that present the position at its absolute strongest. Add reasoning and evidence the original source didn't even include.",
      "Now switch back to your own perspective. Write your response — but it has to engage with your steelman, not the original weaker version.",
    ],
    tips: [
      "If your steelman doesn't make you slightly uncomfortable, it isn't strong enough.",
      "Add evidence the original didn't use. The steelman should be better than the original argument.",
      "Your response should explicitly address the steelman, not sidestep it. If you can't beat the strongest version, that's important information.",
      "Notice if the exercise shifts your view even slightly. That's a sign you did it right.",
    ],
    workedExample: {
      source: {
        title: "Homework should be abolished in primary schools",
        excerpt:
          "Research shows homework in primary school has minimal academic benefit. Kids need unstructured play time. Parents end up doing the work anyway. Multiple countries have reduced or eliminated homework for young children with no measurable decline in outcomes.",
      },
      responses: [
        {
          label: "Steelman (strongest version of this position)",
          value:
            "The evidence is clear and consistent: meta-analyses by Cooper (2006) and Hattie (2009) show near-zero academic benefit from homework before age 12, while the costs are real — increased stress, reduced sleep, less family time, and widening inequality since well-resourced families can support homework while others can't. Countries like Finland assign virtually no homework to young children and consistently outperform homework-heavy nations. The time would be better spent on free play, which develops executive function, creativity, and social skills — exactly the capacities that predict long-term success better than test scores. The only argument for early homework is \"building habits,\" but you can build study habits in middle school when homework actually starts to help.",
        },
        {
          label: "Your response, now that you've steelmanned it",
          value:
            "The academic evidence is genuinely strong, and I find the inequality point hard to dismiss. But the steelman underestimates two things: homework is the primary way parents stay connected to what their child is learning (teacher-parent communication gaps are real), and the \"build habits later\" argument assumes a frictionless transition that most kids don't experience. The compromise might be: no graded homework, but optional \"family learning\" activities designed for shared engagement, not solo completion.",
        },
      ],
    },
  },
  {
    drillType: "devils-advocate",
    title: "Devil's Advocate for Yourself",
    phase: 3,
    what: "Pick something you actually, genuinely believe. Now write the best possible argument against it — 200-300 words — as if you were hired to argue the opposing case and needed to win.",
    why: "It's easy to argue against things you already disagree with. The hard version — and the most valuable one — is arguing against your own beliefs. This forces you to find the weaknesses in your own thinking before someone else does.",
    steps: [
      "Choose a belief you hold sincerely. Not something trivial — something you'd defend in conversation.",
      "Imagine you've been hired by the opposing side. Your job is to write the most persuasive 200-300 word case against your own belief.",
      "Use real evidence and reasoning. No straw men, no \"some people say.\" Argue to win.",
      "When you're done, notice: did you find anything that actually dents your confidence? That's the valuable part.",
    ],
    tips: [
      "If your argument wouldn't convince anyone, you're pulling punches. Try harder.",
      "Use specific evidence, not vague gestures. \"Research shows\" is weak. Name the study.",
      "The best devil's advocate arguments make you genuinely uncomfortable.",
      "This is not about changing your mind. It's about knowing exactly where your position is weakest.",
    ],
    workedExample: {
      source: {
        title: "My belief",
        excerpt: "Reading books is superior to consuming short-form content for intellectual development.",
      },
      responses: [
        {
          label: "The best case against it (arguing to win)",
          value:
            "The reverence for books is nostalgia masquerading as epistemology. The claim that long-form reading builds deeper understanding assumes that length correlates with quality — but anyone who has read a padded 300-page business book knows that's false. Many books contain one good chapter's worth of insight stretched with anecdotes and repetition.\n\nMeanwhile, the best short-form content — a well-crafted thread, a tight essay, a documentary clip — can deliver a precise insight in minutes that would take a mediocre book hours to reach. Naval Ravikant's tweets have arguably shifted more people's thinking frameworks than most popular nonfiction books.\n\nThe real variable isn't format length — it's engagement quality. A reader passively consuming a book on autopilot learns less than someone actively engaging with a challenging 10-minute podcast. The research on learning supports this: retention depends on active processing, spaced repetition, and application — none of which are format-dependent.\n\nBooks also carry a massive selection bias: we compare the best books ever written against average short-form content. Compare average books against the best short-form content and the picture reverses entirely. The honest comparison is medium-to-medium, and there, format length is a weak predictor of intellectual value.",
        },
      ],
    },
  },
  {
    drillType: "unusual-connection",
    title: "Unusual Connection",
    phase: 4,
    what: "Take two things you've encountered recently that seem completely unrelated. Find what they share structurally — not surface similarity, but a deeper pattern, mechanism, or dynamic they have in common.",
    why: "Original insight almost always comes from connecting things other people keep in separate mental buckets. This drill trains the \"huh, I hadn't connected those before\" move that produces novel analysis and writing angles.",
    steps: [
      "Pick Thing A: something you've read, discussed, or noticed this week.",
      "Pick Thing B: something completely unrelated from the same week.",
      "Ignore surface features. Ask: what structural pattern, mechanism, or dynamic do they share?",
      "Write 3-4 sentences explaining the connection. Could this connection generate a prediction or insight?",
    ],
    tips: [
      "Surface similarity doesn't count. \"Both involve technology\" is not a structural connection.",
      "Good structural connections sound like: \"Both are cases where optimizing for a proxy metric destroyed the thing the metric was supposed to measure.\"",
      "The more unrelated the two things seem, the more interesting the connection — if it's genuine.",
      "Test your connection: does it predict something? If so, it's structural. If it's just \"they're kinda similar,\" dig deeper.",
    ],
    workedExample: {
      source: {
        title: "Two unrelated observations",
        excerpt: "Thing A: an article about how Goodhart's Law ruined standardized testing. Thing B: a podcast about how dating apps optimized for matches, not relationships.",
      },
      responses: [
        {
          label: "Thing A",
          value: "Schools optimized for test scores, which were supposed to measure learning, until \"teaching to the test\" replaced actual education.",
        },
        {
          label: "Thing B",
          value: "Dating apps optimized for swipe-matches, which were supposed to indicate compatibility, until the matching algorithm favored attractive photos over genuine fit.",
        },
        {
          label: "What they share structurally",
          value:
            "Both are instances of the same failure mode: a system creates a measurable proxy for an unmeasurable goal, then optimizes the proxy so aggressively that it decouples from the original goal. The proxy becomes the product. This predicts that any domain where the true goal is hard to measure (education quality, relationship compatibility, employee performance) will eventually be eaten by its own metrics. The structural pattern suggests that the fix isn't better metrics — it's building in resistance to metric-gaming, like randomizing what gets measured.",
        },
      ],
    },
  },
  {
    drillType: "so-what",
    title: "The \"So What\" Pass",
    phase: 4,
    what: "Take one of your earlier drill entries from this week and push it one step further: so what does this insight actually mean? How should someone act or think differently because of it?",
    why: "Analysis without implication is half-finished thinking. The \"so what\" is what turns an observation into advice, an insight into an action, or a pattern into a prediction. This is the bridge between thinking and writing that actually matters to people.",
    steps: [
      "Pick a drill entry you completed earlier this week.",
      "Re-read your analysis or output.",
      "Ask: so what? If this is true, what changes? Who should care? What should they do differently?",
      "Write a concrete implication — specific enough that someone could act on it.",
    ],
    tips: [
      "\"People should think more carefully\" is not a useful so-what. Too vague.",
      "Good so-whats are specific: \"If you're hiring, stop asking 'culture fit' questions and instead...\"",
      "The so-what should follow logically from your original analysis, not be a generic platitude bolted on.",
      "If you can't find a meaningful so-what, your original analysis might have been too surface-level. That's useful feedback.",
    ],
    workedExample: {
      source: {
        title: "Earlier drill: Unusual Connection between test scores and dating apps",
        excerpt:
          "Both are cases where optimizing for a measurable proxy destroyed the unmeasurable goal it was supposed to track.",
      },
      responses: [
        {
          label: "So what does this actually mean?",
          value:
            "If you run a team or an organization, the implication is: any metric you tie to incentives will eventually be gamed, and the gaming will be invisible because the metric will look great while the underlying reality deteriorates. The actionable version: always pair quantitative metrics with qualitative checks that can't be gamed the same way. If you're tracking developer productivity by lines of code, also do random code reviews. If you're tracking customer satisfaction by NPS scores, also read the actual comments. The metric is the smoke alarm, not the fire.",
        },
      ],
    },
  },
  {
    drillType: "post-draft",
    title: "Write the Post",
    phase: 5,
    what: "Write a short post (150-250 words) using a 5-part structure: Hook (a specific, concrete claim), Tension (why the obvious take is wrong or incomplete), Insight (one sentence), Evidence (one concrete example), So What (what changes if this is true).",
    why: "This is where all the skills come together. Argument anatomy taught you structure. Mental models gave you lenses. Counter-arguments sharpened your reasoning. Now you package it into something someone else would actually want to read and share.",
    steps: [
      "Hook: Start with a specific, concrete claim that makes someone want to keep reading. Not a question. Not a setup. A claim.",
      "Tension: Show why the obvious take on this topic is wrong, incomplete, or misleading.",
      "Insight: State your actual insight in one clear sentence.",
      "Evidence: Give one piece of concrete evidence or a specific example that supports the insight.",
      "So What: End with what changes if this is true — what should the reader think or do differently?",
    ],
    tips: [
      "The hook should be bold enough that someone would disagree. \"Communication is important\" is not a hook. \"Most team communication is performance, not information transfer\" is.",
      "Tension is not just \"but actually.\" Show what specific thing the common view gets wrong and why.",
      "Your insight should be one sentence. If you can't compress it, you haven't found it yet.",
      "One piece of evidence is enough. Make it concrete and specific.",
      "The so-what should leave the reader thinking differently, not just nodding.",
    ],
    workedExample: {
      source: {
        title: "Topic: meetings and productivity",
        excerpt: "Drawing from observations about workplace culture and communication patterns.",
      },
      responses: [
        {
          label: "Hook",
          value: "The most productive person on your team probably has the fewest meetings on their calendar.",
        },
        {
          label: "Tension",
          value:
            "We treat meetings as collaboration, but most meetings are actually status updates that could be a document. The meeting-heavy culture isn't about alignment — it's about anxiety. Managers schedule meetings because they can't see work happening, and \"I had five meetings today\" feels more productive than \"I thought about a hard problem for three hours.\"",
        },
        {
          label: "The actual insight",
          value: "Meetings have become a visibility tool masquerading as a collaboration tool.",
        },
        {
          label: "Evidence",
          value:
            "Microsoft's Work Trend Index found that the average worker spends 57% of their time in meetings, email, and chat — and rates only 33% of meetings as valuable. But no one cancels them because the cost of a \"useless\" meeting is diffuse (everyone loses 30 minutes) while the cost of missing information is concentrated (one person looks out of the loop).",
        },
        {
          label: "So what",
          value:
            "If you lead a team, try this: cancel every recurring meeting for one week. See which ones anyone actually asks to bring back. Those are your real meetings. Everything else was theater.",
        },
      ],
    },
  },
];

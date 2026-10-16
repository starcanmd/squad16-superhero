import "server-only";

// Everything in this file is served only through /api/pack after an email check.
// VC-side people never receive the co-founder pack and vice versa.

export type Side = "vc" | "cofounder";

export type Section = { heading: string; paragraphs?: string[]; bullets?: string[] };

export type Person = {
  key: string;
  name: string;
  firstName: string;
  email: string;
  code: string; // private access code, handed to each person directly
  side: Side;
  isLead?: boolean;
  character: string; // the character they play
  playingRound: 1 | 2 | "both";
  partner: string; // who they pair with
  roleSummary: string;
  goals: { title: string; behaviors: string[]; accountability: string[] }[];
  tryThis: { when: string; items: string[] }[];
  askYourPartner: string[];
  fellowPrep?: string[];
};

export const PEOPLE: Person[] = [
  {
    key: "serim",
    code: "NW-UC3DXT",
    name: "Serim Tarcan",
    firstName: "Serim",
    email: "starcan@stanford.edu",
    side: "vc",
    isLead: true,
    character: "Casey Parker, Arrow Ventures Partner",
    playingRound: 1,
    partner: "Ellis Wilder",
    roleSummary:
      "You open the meeting as Casey in Round 1 and run the Lab as Meeting Lead. Ellis tags in as Casey for Round 2, so plan the arc together. Vanessa plays Quinn in both rounds.",
    goals: [
      {
        title: "Take up space and voice disagreement when assertive personalities are in the room",
        behaviors: [
          "State a disagreement out loud at least once per lab, starting with I see this differently",
          "Hold my position through at least one round of pushback before conceding anything",
          "Finish my point every time someone talks over me",
        ],
        accountability: [
          "Count my disagreements and tell me the number in the debrief",
          "Push back on me in role plays so I get the rep of holding my ground",
          "Flag the exact moment I gave in early or let myself get cut off",
        ],
      },
      {
        title: "Share ideas before I am 100% sure of them",
        behaviors: [
          "Offer one unfinished idea per lab, framed as half formed",
          "Speak first or second in at least one discussion or role play",
          "Ask once per lab how a half formed idea landed",
        ],
        accountability: ["Call on me when I am holding something back", "Tell me whether the idea moved the group forward"],
      },
    ],
    tryThis: [
      {
        when: "As Casey in Round 1",
        items: [
          "Speak first. Open with Arrow's assessment before Hayden can set the agenda",
          "When Hayden pushes for a yes on the $4M, say I see this differently and hold the line through at least one round of pushback before offering any option",
          "Name the tension about Hayden's behavior directly rather than hinting at it. Say what you observed and the impact it had",
          "If Ren or Hayden talk over you, finish the sentence. Then continue",
        ],
      },
      {
        when: "As Meeting Lead",
        items: [
          "Offer one half formed idea in the Team Assessment discussion and label it as such",
          "Ask the squad at the end how that idea landed",
          "Run transitions with short, declarative instructions. No apologizing for moving people along",
        ],
      },
    ],
    askYourPartner: [
      "Ellis, count how many times I state a disagreement in Round 1 and tell me the number",
      "Flag the moment if I concede to Hayden before pushing back once",
    ],
  },
  {
    key: "ellis",
    code: "NW-7ESHBM",
    name: "Ellis Wilder",
    firstName: "Ellis",
    email: "ewild@stanford.edu",
    side: "vc",
    character: "Casey Parker, Arrow Ventures Partner",
    playingRound: 2,
    partner: "Serim Tarcan",
    roleSummary:
      "You observe Serim as Casey in Round 1, then tag in as Casey for Round 2. Round 2 continues the same conversation, so you inherit whatever position Serim has staked out. Vanessa is your fellow VC as Quinn.",
    goals: [
      {
        title: "Be assertive and authoritative",
        behaviors: ["Avoid qualifying statements like I would say or I think", "Stay oriented around a specific goal"],
        accountability: ["Call me out if I am being passive", "Challenge me within the exercises, encourage conflict"],
      },
      {
        title: "Be a more structured thinker, communicate people's responsibilities",
        behaviors: [
          "Clarify and outline goals in advance so there is a framework for evaluating success",
          "Articulate expectations for what needs to be achieved and the steps required",
        ],
        accountability: ["Tell me if I lean on intuition or lack clarity", "Discuss larger goals and the steps to get there"],
      },
    ],
    tryThis: [
      {
        when: "As Casey in Round 2",
        items: [
          "Open your round by stating the structure. Here is where we are, here are the two things we need to settle, here is how we decide",
          "Drop every I think. Say Arrow's view is, or we will not fund, or the condition is",
          "Make the funding decision explicit by the end. Name the option, the conditions, and who does what next",
          "When Hayden pushes, hold the frame instead of softening. Restate the condition once, then move on",
        ],
      },
      {
        when: "Observing Round 1",
        items: [
          "Note each time Serim states a disagreement and whether she held it through pushback",
          "Track which VC concerns got raised and which are still open, so you know what Round 2 has to close",
        ],
      },
    ],
    askYourPartner: [
      "Serim, tell me every time I qualified a statement in Round 2",
      "Push me to be the one who names the decision, not Quinn",
    ],
  },
  {
    key: "vanessa",
    code: "NW-NZDE7V",
    name: "Vanessa Sims",
    firstName: "Vanessa",
    email: "vsims1@stanford.edu",
    side: "vc",
    character: "Quinn Nguyen, Arrow Ventures Partner",
    playingRound: "both",
    partner: "Serim Tarcan and Ellis Wilder",
    roleSummary:
      "You play Quinn in both rounds, so you are the thread of continuity in the meeting. Serim plays Casey in Round 1 and Ellis tags in as Casey for Round 2. The co-founders are Yash and Minyoung in Round 1, Cam and Yuhan in Round 2. You also close the Lab with the Fellow's wrap up.",
    goals: [],
    tryThis: [
      {
        when: "As Quinn in Round 1",
        items: [
          "Let Casey open with Arrow's assessment, then bring the feedback on each co-founder. Ren first and warmly, Hayden second and specifically",
          "Name the three observed behaviors as observations, not verdicts. The technical meeting, the push on funding, the cafe",
          "Watch how Hayden responds to feedback. Defensiveness, ownership, or deflection decides which option you lean toward",
          "Test the pricing wedge with one question to Ren about whether the subscription model is fully settled between them",
        ],
      },
      {
        when: "As Quinn in Round 2",
        items: [
          "Carry forward exactly where Round 1 ended. Restate the open concern in one sentence so Ellis and the new co-founders are anchored",
          "Push the decision toward a close. Name the option on the table and the conditions, and hold for a response",
          "If Option 1 is live, use your line about Skyler's absence. If Option 2, use your line about not reading the situation",
          "Give Ellis room to own the decision as Casey. Quinn supports and sharpens, Casey states the terms",
        ],
      },
    ],
    askYourPartner: [
      "Serim and Ellis, agree with you in the 30-minute prep on who raises which concern and which option you open with",
      "Agree on a signal for when Quinn should take the lead on the Hayden feedback",
    ],
    fellowPrep: [
      "Meet for 30 minutes with both students playing Casey Parker, Serim and Ellis, before the Lab. Serim schedules it",
      "Read both case documents, the VC version and the Co-Founders version",
      "Review the Agenda for Lab page on Canvas",
      "Participate in the Team Assessment as a squad member. Complete the Team Assessment and bring your top 2 strengths and top 2 areas to improve",
      "Close the Lab with a 5-minute wrap up",
    ],
  },
  {
    key: "yash",
    code: "NW-V763X5",
    name: "Yash Saraf",
    firstName: "Yash",
    email: "yashsrf@stanford.edu",
    side: "cofounder",
    character: "Ren Ito, Co-founder and Software Engineer",
    playingRound: 1,
    partner: "Cam Zahner",
    roleSummary:
      "You play Ren in Round 1 with Minyoung as Hayden. Cam observes you and tags in as Ren for Round 2. The VCs are Casey (Serim) and Quinn (Vanessa).",
    goals: [
      {
        title: "Balance my action bias",
        behaviors: [
          "Before proposing a plan, ask the group to make the strongest case for an alternative",
          "Ask a couple of genuine follow up questions about a differing view before stating my own",
          "Lay out all plausible alternatives before committing",
          "Play or invite the dissenting voice when the group converges quickly",
          "Use the full strategy time rather than rushing to execution",
        ],
        accountability: [
          "Point out when I moved to a plan before alternatives were explored",
          "Tell me whether I asked follow up questions before stating my position",
          "Flag when I rushed past strategy into execution",
        ],
      },
      {
        title: "Composed body language under pressure",
        behaviors: [
          "Sit upright with shoulders open under pressure",
          "Keep hand gestures below the chin so my face stays visible",
          "Take a few slow breaths before speaking in high pressure moments",
          "Remind myself there is no real time pressure",
        ],
        accountability: ["Watch for hand in front of face and stooping forward", "Tell me what triggered them", "Give specific examples"],
      },
      {
        title: "Be inclusive of others' ideas",
        behaviors: [
          "Ask open, curious questions instead of leading ones",
          "Accept a differing view for five minutes before judging it",
          "Try a non mover role for one session",
        ],
        accountability: ["Tell me whether I made room for others' ideas under pressure", "Point out leading questions"],
      },
    ],
    tryThis: [
      {
        when: "As Ren in Round 1",
        items: [
          "When the VCs raise a concern, ask two real questions about it before answering. What did you see, what would change your mind",
          "Use the whole 4 minute prep with Minyoung. Agree on two alternatives for how the meeting could end, not one plan",
          "Check your posture at the start and whenever a VC pushes. Shoulders open, hands low",
          "This is a chance to try the non mover role. Let Hayden drive the business conversation and add weight where it matters",
        ],
      },
      {
        when: "Observing Round 2",
        items: [
          "Note whether Cam slowed down to ask before advocating, since that is also your goal",
          "Track Cam's posture under pressure so you both get data on the same tell",
        ],
      },
    ],
    askYourPartner: [
      "Cam, count the follow up questions I ask before I state a position",
      "Tell me the moment my hands went above my chin or I leaned in, and what triggered it",
    ],
  },
  {
    key: "cam",
    code: "NW-7VSXGF",
    name: "Cam Zahner",
    firstName: "Cam",
    email: "czahner@stanford.edu",
    side: "cofounder",
    character: "Ren Ito, Co-founder and Software Engineer",
    playingRound: 2,
    partner: "Yash Saraf",
    roleSummary:
      "You observe Yash as Ren in Round 1, then tag in as Ren for Round 2 with Yuhan as Hayden. Round 2 picks up the same conversation, so track where Round 1 ends. The VCs in Round 2 are Casey (Ellis) and Quinn (Vanessa).",
    goals: [
      {
        title: "Build relationships across all personality types",
        behaviors: ["Get to know everyone in the squad, especially those less similar to me", "Schedule events outside class"],
        accountability: ["Push me to go deeper in individual relationships", "Keep me honest on community building outside class"],
      },
      {
        title: "Lead in new, less vocal ways",
        behaviors: ["Focus on listening and supporting, not forming my next words", "Learn from squad members who lead non vocally"],
        accountability: ["Interrupt and correct me when I speak too much or rush", "Use the role play to put me in situations that test this"],
      },
      {
        title: "Situational awareness in gray areas",
        behaviors: ["Prioritize the right objective, whether compromise, letting another solution win, or digging in to persuade"],
        accountability: ["Put me in situations that test all three", "Tell me if I lean toward always persuading or always compromising"],
      },
    ],
    tryThis: [
      {
        when: "As Ren in Round 2",
        items: [
          "Ren is the quieter founder. Play that. Let Hayden take the first response and speak when the technical case or the partnership needs you",
          "Before you answer a VC, pause and name what you heard. Then respond",
          "Decide in the midpoint check in which objective matters most for Ren in this meeting. Protect the partnership, protect the product, or get the money. Then play to that one",
          "If the VCs try to split you from Hayden, this is your gray area moment. Choose deliberately rather than by reflex",
        ],
      },
      {
        when: "Observing Round 1",
        items: [
          "Write down the two moments where Ren had the most leverage and whether Yash used them",
          "Notice how the VCs treat Ren versus Hayden. That shapes your Round 2",
        ],
      },
    ],
    askYourPartner: [
      "Yash, tell me if I talked more than Ren needed to, and when",
      "Tell me which objective it looked like I was playing for, and whether that was the right one",
    ],
  },
  {
    key: "minyoung",
    code: "NW-BJ8LQX",
    name: "Minyoung Hwang",
    firstName: "Minyoung",
    email: "myshwang@stanford.edu",
    side: "cofounder",
    character: "Hayden Mendez, Co-founder and CEO",
    playingRound: 1,
    partner: "Yuhan Wang",
    roleSummary:
      "You play Hayden in Round 1 with Yash as Ren. Yuhan observes you and tags in as Hayden for Round 2. The VCs are Casey (Serim) and Quinn (Vanessa). Hayden is the CEO and the one who has to land the funding.",
    goals: [
      {
        title: "Assert my opinion when in direct disagreement",
        behaviors: [
          "Seek out intellectual disagreement at least once per session",
          "Reassert my opinion through at least one full exchange rather than dropping it",
        ],
        accountability: ["Keep challenging me rather than letting me drop it", "Tell me afterwards when I dropped it"],
      },
      {
        title: "Build equanimity by keeping nerves in check",
        behaviors: ["Avoid jokes or mentions of what I am stressing about", "Take one deep breath or pause before proceeding when it gets stressful"],
        accountability: ["Counter my anxious comments with a grounded reaction", "Tell me what I said and the impact"],
      },
    ],
    tryThis: [
      {
        when: "As Hayden in Round 1",
        items: [
          "Hayden has the most at stake in the room. When a VC says something you disagree with, say so and come back to it a second time after they respond",
          "Pick one position to defend through a full exchange. You, them, you again. Do not let it drop after one try",
          "Hayden is under financial pressure. Play the pressure without the nervous jokes. One breath before each reply",
          "If the VCs criticize Hayden's behavior, do not fold immediately and do not get defensive. Ask what they saw, then respond with your view",
        ],
      },
      {
        when: "Observing Round 2",
        items: [
          "Count how many times Yuhan reasserts a position after pushback",
          "Note whether the VCs' tone shifts when Hayden stays calm versus when Hayden pushes",
        ],
      },
    ],
    askYourPartner: [
      "Yuhan, count my full exchanges where I came back a second time, and tell me where I dropped it",
      "If I joke about the stress, tell me afterwards what I said",
    ],
  },
  {
    key: "yuhan",
    code: "NW-43TZFG",
    name: "Yuhan Wang",
    firstName: "Yuhan",
    email: "bigdeal@stanford.edu",
    side: "cofounder",
    character: "Hayden Mendez, Co-founder and CEO",
    playingRound: 2,
    partner: "Minyoung Hwang",
    roleSummary:
      "You observe Minyoung as Hayden in Round 1, then tag in as Hayden for Round 2 with Cam as Ren. Round 2 continues the same conversation. The VCs in Round 2 are Casey (Ellis) and Quinn (Vanessa).",
    goals: [
      {
        title: "Resolve conflict and inspire consensus without butting heads",
        behaviors: [
          "Stay calm and patient when exploring opposing views. Listen fully",
          "When I hold an opposing view, speak at ease, slower, without coming on too strong",
          "Display patience even when it feels irritating",
        ],
        accountability: [
          "Give me raw feedback on how what I said landed",
          "Point out when your opinion felt unheard",
          "Point out body language changes that show irritation",
          "Give me indirect feedback sometimes so I practice reading between the lines",
        ],
      },
      {
        title: "Increase situational vulnerability",
        behaviors: ["Share vulnerability and emotions to let down the facade", "Make people feel they can be vulnerable with me"],
        accountability: ["Point out when I put my guard up", "Point out when I make you feel judged"],
      },
    ],
    tryThis: [
      {
        when: "As Hayden in Round 2",
        items: [
          "Hayden is being told, in some form, that the VCs have concerns. The role is a direct test of your first goal. Slow your pace by a third and let silences sit",
          "Before disagreeing with a VC, restate their concern in one sentence so they hear it landed. Then give your view",
          "Try one moment of real vulnerability as Hayden. Name the financial pressure, or name that the feedback is hard to hear, and ask what they need to see",
          "Watch your body. If you feel irritation, uncross, slow down, and ask a question instead of answering",
        ],
      },
      {
        when: "Observing Round 1",
        items: [
          "Note the exact moments the VCs seemed to warm up or cool down toward Hayden, and what Minyoung did right before",
          "Track what is still unresolved at the end of Round 1. That is your opening",
        ],
      },
    ],
    askYourPartner: [
      "Minyoung, tell me when my pace sped up or my body showed irritation",
      "Tell me whether the vulnerable moment felt real or performed",
    ],
  },
];

// ---------- Case content ----------

export const SHARED_CASE: Section[] = [
  {
    heading: "Summary",
    paragraphs: [
      "Ren Ito and Hayden Mendez are trying to secure seed funding for their start-up. Ren, who recently earned a master's degree in computer engineering, developed new software for VR video games that eliminated most motion sickness, a huge barrier to VR adoption. Hayden, Ren's roommate and friend from USC, saw the potential to build a better VR game on Ren's technology just as VR hardware prices dropped 40 to 50 percent. Hayden, close to finishing the Stanford MBA, joined Ren. They spent a year testing the technology and building the game Superhero View, which makes players feel like a superhero flying through space.",
      "They are running out of money. Friends and family funding carried them through the past year, including a part-time programmer. They are in talks with Arrow Ventures, which has expressed interest. With no other viable options, they must either convince Arrow Ventures to fund them or abandon Superhero View.",
    ],
  },
  {
    heading: "The meeting",
    paragraphs: [
      "Ren and Hayden have a 15-minute meeting with two partners from Arrow Ventures to answer outstanding questions and address concerns. The partners intend to make a recommendation on seed funding at the end of the meeting. Both sides have met several times before and have agreed on the technology specs, the business plan, and the viability of the game.",
    ],
    bullets: [
      "The co-founders have asked for $4 million",
      "Their goals are to confirm Arrow recognizes the viability of the business, convince Arrow they can lead the start-up, and address any concerns",
      "Funding must be settled at this meeting. There is no fallback",
    ],
  },
  {
    heading: "Ren Ito, Software Engineer",
    paragraphs: [
      "Born in Japan, moved to the US at 11. Gamer in high school, BS in computer science from USC where Ren founded a computer science club. Two years as an infrastructure engineer at Google, then back to USC for a master's. Became fascinated with VR during the second year and started prototyping with game engines.",
      "Ren believes as many people as possible should have access to new technology and wants mass adoption. Ren felt strongly about a free to download model with a $5 a month premium subscription with more levels and monthly updates, and believes enough serious gamers will subscribe to make this the superior revenue model. Direct in communication and laid back. Ren turned down a promising position at the large gaming company 123Go to co-found.",
    ],
  },
  {
    heading: "Hayden Mendez, MBA and CEO",
    paragraphs: [
      "Grew up on video games. BA in business economics and accounting from USC, where Hayden and Ren were dorm roommates. Three years in finance at Ernst & Young, then the Stanford GSB. Hayden eagerly took the CEO role, wrote the business plan, raised over $350,000 from friends and family, and has spent the last four months on seed funding and customer engagement.",
      "Hayden turned down returning to E&Y, which would have forgiven GSB tuition after two years, and has heard an earful about it. Hayden needs Superhero View to do well and feels that waiting would have been too late. Hayden is keenly aware of the financial compromises involved.",
    ],
  },
  {
    heading: "The product and the team",
    paragraphs: [
      "Superhero View is a VR game that simulates flying through space. It runs on the top-selling headsets from Oculus, Nintendo, Sony, and HTC and uses Ren's proprietary toolkit to reduce motion sickness, which affects 25 to 80 percent of VR users and women up to four times more often than men. The VR gaming market is valued at $2.27 billion with a projection of $24 billion in five years.",
      "Ren found a part-time VR programmer, Skyler Greer, who is several years older and previously worked at a VR start-up. Skyler has become a valued technical sounding board for Ren. A private beta is hoped for in three to four months.",
    ],
  },
  {
    heading: "History with Arrow Ventures",
    paragraphs: [
      "Hayden met Casey Parker at a Silicon Valley Directors' Exchange event and pitched after the panel. Casey agreed to coffee and liked the idea. Casey, Quinn, Ren, and Hayden have since had several detailed conversations about feasibility. At one meeting Quinn went deep on technical details with Ren and Skyler. Hayden gave them space, then after a few hours brought the conversation back to funding. At another meeting at a cafe, when the conversation turned social, Hayden repeatedly steered it back to next steps on seed funding.",
      "At a previous meeting both sides agreed on the product vision and business plan. The VCs were cautious about the free plus subscription model but accepted it based on first mover advantage and the adoption benefit of a free game.",
    ],
  },
  {
    heading: "Exhibit 1, Business plan highlights",
    bullets: [
      "Product: VR game using software that eliminates most motion sickness",
      "Strategy: volume, high penetration and adoption",
      "Revenue model: free to download, $5 a month premium subscription with more content and regular updates",
      "Market: VR unit shipments of 17.2M in year 1 growing to 241.2M in year 5, around 100 percent YoY growth, strongest in the US, Japan, and Europe",
      "Competitive advantages: innovative product, first mover on motion sickness, free basic product, works across popular consoles",
    ],
  },
];

export const VC_PACK: Section[] = [
  {
    heading: "Your characters",
    paragraphs: [
      "Casey Parker. Loves the risk and reward of transformational ideas. BS in physics, MBA from Duke. Research analyst at Guide Equities covering technology for entertainment and gaming, named a top analyst by Fortune and a Wall Street All-Star by the WSJ. Senior partner at AVE Partners, angel investor in almost 40 companies, joined Arrow Ventures in 2005 to focus on seed stage.",
      "Quinn Nguyen. Passion for businesses built on new technology. Born in France, educated in Israel and the US. BSc from Technion, MSc and PhD in computer engineering from Carnegie Mellon, published papers, one US patent. Former CEO of a digital video start-up that IPOed in 2008, former GM of a European subsidiary. Joined Arrow in 2010. Has tremendous respect for entrepreneurs.",
    ],
  },
  {
    heading: "Casey's thoughts",
    bullets: [
      "The technology is exciting and sound. Ren and Skyler work well together and the approach can scale. Technical hurdles are surmountable",
      "Casey is more concerned about Hayden. Limited career experience, no formal experience as a manager or in sales and marketing. Capable, with contagious passion, and the $350K raise is real",
      "When Hayden pushed on seed funding at the end of the technical meeting, Casey walked away disturbed and irritated. Hayden came on too strong and misread the timing",
      "Casey suspects the behavior comes from financial pressure. With guidance Hayden might serve as CEO through the early phase, but not the growth phase",
    ],
  },
  {
    heading: "Quinn's thoughts",
    bullets: [
      "Ren's engineering skills are solid, Ren identified the ongoing development needs early, and Quinn is positive about Ren's ability to build and lead an engineering team. Direct, laid back, does not get flustered",
      "Hayden is competent, intelligent, and engaging, but Quinn is less sure. Purely technical co-founders at this stage are increasingly common, with business experts brought in later",
      "Quinn's leadership philosophy: a leader must be relatable, communicate well, have situational awareness, and show interpersonal acumen. In hard times employees desert ill-disposed leaders",
      "Observed behavior: Hayden forcefully took control at the end of the technical meeting and dictated next steps to Ren. Hayden pressured Casey on funding and Casey felt rushed. At the cafe Hayden tried at least three times to bring a social conversation back to funding, missing or ignoring the cues",
      "Quinn's open questions: Is this a pattern? Would Hayden take responsibility when given feedback? Can Hayden be coached? Can Hayden stay focused on fixing it over five to eight years?",
    ],
  },
  {
    heading: "What Casey and Quinn want from this meeting",
    paragraphs: [
      "Use the meeting to focus on the concerns about Hayden. Give Ren and Hayden an honest assessment covering the technology, the execution, and both co-founders' abilities. Communicate the observations of Hayden directly, that Hayden has left others feeling irritated and uncomfortable and can be overly aggressive and intimidating. Evaluate how Ren and Hayden respond and handle the meeting, and use that to decide whether to recommend seed funding and on what terms. The funding options below have not been shared with the co-founders.",
    ],
  },
  {
    heading: "A possible way to start",
    bullets: [
      "Casey opens with Arrow's assessment of the business plan and technical execution (Exhibit 2)",
      "Quinn introduces feedback on each co-founder's capabilities and the concerns about Hayden",
      "Casey may explain that one option is to fund the technical team only (Option 1 below)",
      "Both Casey and Quinn participate actively throughout",
      "There is residual tension between Ren and Hayden over free plus subscription versus upfront pricing. The VCs suspect it is not fully resolved. This wedge is worth exploring, especially alongside the technical team only option",
    ],
  },
  {
    heading: "Exhibit 2, Arrow's assessment",
    bullets: [
      "Concept. Strengths: VR is growing, cheaper hardware accelerates it, real competitive advantage from eliminating motion sickness, good timing. Risks: competitors, and whether a model with no upfront revenue is sustainable",
      "Technical execution. Strengths: product vision, early identification of needed resources. Risks: technical challenges, attracting and affording specialized VR programmers",
      "Ren. Strengths: sound technical skills, strong product vision, good potential to lead engineering. Risk: limited career experience",
      "Hayden. Strengths: impressive background, raised $350K, passionate, competent, intelligent. Risks: no experience as a manager or in sales and marketing, has left people uncomfortable, can come across as a bully, may not meet Quinn's likability requirement",
    ],
  },
  {
    heading: "Exhibit 3, Funding options (not shared with the co-founders)",
    bullets: [
      "Option 1, fund the technical team only. Seed funding on condition that Hayden leaves, with a negotiated stock option grant as compensation. Invite Skyler to be Ren's partner. Rationale: unsure Hayden can address the leadership concerns, Hayden would likely be replaced at growth phase anyway, the company needs to focus on technology now and bring in an experienced CEO later, Ren has good leadership skills and business sense",
      "Option 1 lines to use. Quinn: There was such constructive energy when Ren, Skyler, and I met to discuss technology. I feel Skyler's absence at this meeting. Casey: We see more creativity, innovation, and your unique perspective on the business when Hayden isn't involved",
      "Option 2, fund both with conditions. Limited seed funding of 50 percent of the requested $4M, with the VCs monitoring Hayden closely, and an evaluation in four months to assess Hayden and additional investment. Rationale: Hayden has potential, pushing a founder out hurts morale and friendships",
      "Option 2 lines to use. Quinn: You can come across as overly aggressive and intimidating. I've experienced you not reading the situation well more than once. Casey: We would keep you on a tight leash, so to speak, to provide feedback and make sure these issues stay front and center",
    ],
  },
];

// The co-founder version of the case arrives separately. Until it is added, co-founders see
// the shared case material above plus the placeholder note below.
export const COFOUNDER_PACK: Section[] = [
  {
    heading: "Co-founder confidential section",
    paragraphs: [
      "Serim will add the co-founder version of the case here once it is shared. Until then, prepare from the shared material above, your character's background, and the meeting goals. Check back before Wednesday.",
    ],
  },
];

// ---------- Per-person checklists ----------

export type CheckItem = { id: string; title: string; detail?: string };

const COMMON_FIRST: CheckItem[] = [
  { id: "read-pack", title: "Read your case pack once, start to finish", detail: "It is in Individual view under Case pack. Twenty minutes." },
  { id: "read-role", title: "Reread your character's section twice", detail: "Know their background, what they want, and what they are worried about well enough to improvise." },
];

const COMMON_LAST: CheckItem[] = [
  { id: "pick-behavior", title: "Pick one behavior from Try this in the Lab, in Individual view, and tell your partner", detail: "One for the round you play, one for the round you observe." },
  { id: "video", title: "Watch the short video on playing yourself in a role play", detail: "Linked from the Week 5 Required Prep page on Canvas." },
  { id: "assessment", title: "Submit the Team Assessment on this site", detail: "The form is in Individual view. Takes about ten minutes. No paper needed on Wednesday." },
  { id: "rehearse", title: "Rehearse your 2.5 minute share out once", detail: "Top 2 strengths, top 2 areas to improve, one example each." },
  { id: "tpr", title: "Skim the TPR Model from Week 3", detail: "Task, Process, Relationship. Useful vocabulary for the discussion." },
];

const ROLE_ITEMS: Record<string, CheckItem[]> = {
  serim: [
    { id: "ml-guidelines", title: "Reread the Meeting Lead Week 5 Guidelines", detail: "Transitions, timekeepers, de-role, and the two-part structure." },
    { id: "prep-session", title: "Attend the optional Meeting Lead prep session with the Labs instructor" },
    { id: "vc-meeting", title: "Schedule the 30 minute VC prep with Vanessa and Ellis", detail: "Agree on the opening, who raises which concern about Hayden, and which funding option you lead with." },
    { id: "exhibits", title: "Read Exhibit 2 and Exhibit 3 until you can say the options without looking" },
    { id: "nudge", title: "Send the squad the link to this site and a short nudge to meet their partner" },
  ],
  ellis: [
    { id: "vc-meeting", title: "Join the 30 minute VC prep with Serim and Vanessa", detail: "Serim will schedule it. Come with your opening line for Round 2." },
    { id: "exhibits", title: "Read Exhibit 2 and Exhibit 3 until you can say the options without looking" },
    { id: "structure", title: "Write the three sentence structure you will open Round 2 with", detail: "Where we are, what we need to settle, how we decide. Your second goal in one move." },
  ],
  vanessa: [
    { id: "vc-meeting", title: "Hold the 30 minute prep with Serim and Ellis before the Lab" },
    { id: "cofounder-doc", title: "Read the Co-Founders version of the case as well", detail: "Fellows read both. Linked from the Fellows only Required Prep page on Canvas." },
    { id: "hayden-feedback", title: "Decide how you will deliver the three observations about Hayden", detail: "Technical meeting, the push on funding, the cafe. Observations, not verdicts." },
    { id: "wrap", title: "Plan the 5 minute wrap up" },
  ],
  yash: [
    { id: "partner", title: "Meet Cam for 20 minutes before Wednesday", detail: "Agree on how Ren opens, what Ren protects, and what Ren will not concede." },
    { id: "alternatives", title: "Write two alternatives for how the meeting could end, not one plan", detail: "Your first goal, done before the Lab so it is natural in the 4 minute prep." },
    { id: "posture", title: "Choose a physical cue to check posture during the role play", detail: "Hands below the chin, shoulders open." },
  ],
  cam: [
    { id: "partner", title: "Meet Yash for 20 minutes before Wednesday", detail: "Agree on how Ren opens, what Ren protects, and what Ren will not concede." },
    { id: "objective", title: "Decide which objective Ren plays for in Round 2", detail: "Protect the partnership, protect the product, or get the money. Choose deliberately." },
    { id: "listening", title: "Pick one listening move to use before every answer in Round 2", detail: "Name what you heard, then respond." },
  ],
  minyoung: [
    { id: "partner", title: "Meet Yuhan for 20 minutes before Wednesday", detail: "Agree on how Hayden opens and the one position Hayden will defend through a full exchange." },
    { id: "position", title: "Write the one position you will hold through pushback", detail: "You, them, you again. Decide it now so you do not drop it in the moment." },
    { id: "breath", title: "Decide your reset", detail: "One breath before each reply. No jokes about the pressure." },
  ],
  yuhan: [
    { id: "partner", title: "Meet Minyoung for 20 minutes before Wednesday", detail: "Agree on how Hayden opens and what is likely still open when you tag in." },
    { id: "restate", title: "Draft a one sentence restatement for each VC concern", detail: "So you can reflect it back before disagreeing." },
    { id: "vulnerable", title: "Choose the one vulnerable moment you will try as Hayden", detail: "Name the pressure, or name that the feedback is hard to hear." },
  ],
};

export function checklistFor(person: Person): CheckItem[] {
  return [...COMMON_FIRST, ...(ROLE_ITEMS[person.key] ?? []), ...COMMON_LAST];
}

export function findPerson(email: string): Person | undefined {
  const e = email.trim().toLowerCase();
  return PEOPLE.find((p) => p.email.toLowerCase() === e);
}

// The passcode alone identifies the person.
export function authPerson(code: string): Person | undefined {
  const c = String(code ?? "").trim().toUpperCase().replace(/\s+/g, "");
  if (!c) return undefined;
  return PEOPLE.find((p) => p.code.toUpperCase() === c);
}

export function packFor(person: Person): Section[] {
  return [...SHARED_CASE, ...(person.side === "vc" ? VC_PACK : COFOUNDER_PACK)];
}

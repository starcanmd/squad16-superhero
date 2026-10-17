// Content visible to anyone who opens the site. Nothing role-confidential lives here.

export const LAB = {
  title: "Superhero View case and team assessment",
  course: "OB 209 Leadership Laboratory, Fall 2026, week 5",
  squad: "Nightwalkers",
  date: "Wednesday, October 21, 2026",
  meetingLead: "Serim Tarcan",
  fellow: "Vanessa Sims",
  objectives: [
    "Understand the importance of inquiry, advocacy, and adjusting group dynamics",
    "Practice managing the dynamics of a group while achieving a business objective",
    "Review and assess our emergent squad dynamics",
    "Begin preparing the squad for Executive Challenge",
  ],
};

export type Detail = string | { text: string; sub: string[] };

export type AgendaItem = {
  id: string;
  part: 1 | 2;
  label: string;
  minutes: number;
  detail: Detail[];
  leadNotes?: string[];
};

export const AGENDA: AgendaItem[] = [
  {
    id: "prep",
    part: 1,
    label: "Case prep",
    minutes: 5,
    detail: [
      "Review objectives and agenda (1 minute)",
      "Co-founders and VCs confer in pairs to align on their strategy (4 minutes)",
    ],
    leadNotes: [
      "Place the squad tent on the table",
      "Assign a timekeeper for round 1",
      "Move people into their pairs fast. The 4 minutes go quickly",
    ],
  },
  {
    id: "r1",
    part: 1,
    label: "Role play, round 1",
    minutes: 12,
    detail: [
      "Ren (Yash) and Hayden (Minyoung) meet Casey (Serim) and Quinn (Vanessa). Cam, Yuhan, and Ellis observe their counterparts and take notes",
    ],
    leadNotes: ["Press RECORD on the camera before starting", "Reposition the camera if needed"],
  },
  {
    id: "mid",
    part: 1,
    label: "Midpoint check-in",
    minutes: 8,
    detail: [
      {
        text: "Strategize in pairs with the person playing the same role in the next round, using the following questions",
        sub: [
          "Which strategies and behaviors were most effective?",
          "Which were least effective?",
          "What 1 or 2 actions will you try in round 2?",
        ],
      },
    ],
    leadNotes: [
      "Round 2 continues the same conversation. The partner tags in, it is not a fresh start",
      "Assign a timekeeper for round 2",
    ],
  },
  {
    id: "r2",
    part: 1,
    label: "Role play, round 2",
    minutes: 12,
    detail: [
      "Ren (Cam) and Hayden (Yuhan) meet Casey (Ellis) and Quinn (Vanessa). Yash, Minyoung, and Serim observe their counterparts and take notes",
      "Pick up where round 1 left off",
    ],
    leadNotes: ["Press RECORD again", "Round 1 players now observe their partner"],
  },
  {
    id: "fb",
    part: 1,
    label: "Feedback in pairs",
    minutes: 8,
    detail: [
      "Take a moment to de-role and let go of the feelings the case generated",
      {
        text: "Provide feedback in pairs using the Action and Impact model and the following questions",
        sub: [
          "How well did the person handle the key leadership issues?",
          "Which behaviors were most effective, which least?",
          "What did we learn?",
        ],
      },
    ],
    leadNotes: ["Call the de-role explicitly before anyone speaks", "Ask the squad to take a few breaths before Part 2"],
  },
  {
    id: "obj",
    part: 2,
    label: "Objectives and agenda",
    minutes: 2,
    detail: ["Review objectives and agenda for the team assessment"],
    leadNotes: ["Press RECORD, reposition camera, squad tent on the table"],
  },
  {
    id: "share",
    part: 2,
    label: "Strengths and areas for improvement",
    minutes: 18,
    detail: [
      "Each person, including the fellow, shares their top 2 team strengths and top 2 areas for improvement with a brief explanation of why they chose them",
      "Each person will be given 2.5 minutes to share",
    ],
    leadNotes: ["Seven people at 2.5 minutes is 17.5 minutes. Keep a visible timer", "Go in a set order so nobody stalls"],
  },
  {
    id: "prio",
    part: 2,
    label: "Priority issues",
    minutes: 10,
    detail: [
      "Reflect individually on the data just generated. What stands out?",
      "Vote as a group on 1 strength and 1 area for improvement to discuss today",
    ],
    leadNotes: ["Tally the votes on the tracker below"],
  },
  {
    id: "disc",
    part: 2,
    label: "Group discussion",
    minutes: 20,
    detail: [
      "Discuss the squad's area of strength and ways to build on it",
      "Discuss the area for improvement and ways to address it",
    ],
    leadNotes: ["Watch for who has not spoken and invite them in", "Close with one concrete course correction"],
  },
  {
    id: "mlfb",
    part: 2,
    label: "Feedback to meeting lead (ML)",
    minutes: 5,
    detail: [
      {
        text: "Provide feedback to ML, using the Action and Impact model",
        sub: ["What did the ML do well in running the lab this week?", "What can the ML improve on?"],
      },
    ],
  },
  {
    id: "wrap",
    part: 2,
    label: "Fellow's wrap up",
    minutes: 5,
    detail: ["Vanessa closes the lab"],
  },
];

export type PrepTask = {
  id: string;
  title: string;
  detail: string;
  who: "everyone" | "roleplayers" | "ml";
  source: "canvas" | "optional";
  link?: { label: string; href: string };
  insights?: { title: string; text: string }[];
};

export const PREP_TASKS: PrepTask[] = [
  {
    id: "read-case",
    source: "canvas",
    title: "Read your version of the case",
    detail:
      "Open individual view, enter your passcode, and read the case pack for your side. VCs have the VC version, co-founders have the co-founder version. Read the whole thing once, then reread the section on your character.",
    who: "everyone",
  },
  {
    id: "goal-pick",
    source: "optional",
    title: "Pick one leadership behavior to try in the role play",
    detail:
      "individual view tab lists behaviors tied to your own leadership goals. Choose one for your playing round and one for your observing round, and tell your partner so they can hold you to it.",
    who: "everyone",
  },
  {
    id: "partner",
    source: "canvas",
    title: "Meet your role play partner before Wednesday",
    detail:
      "Twenty minutes is enough. Agree on how you will open, which concern you will raise first, and what you want the other side to walk away believing. Round 2 continues round 1, so your partner needs to know your plan.",
    who: "everyone",
  },
  {
    id: "video",
    source: "canvas",
    title: "Watch the short video on playing yourself in a role play",
    detail: "Click on the link below to open it on Canvas. Play the character as yourself, with your own instincts, not as an impression.",
    who: "everyone",
    link: {
      label: "Week 5 Required Prep on Canvas",
      href: "https://canvas.stanford.edu/courses/233561/pages/week-5-required-prep-superhero-view-case-and-team-assessment",
    },
  },
  {
    id: "assessment",
    source: "canvas",
    title: "Submit the team assessment here, no paper needed",
    detail:
      "The form is in the individual view tab. Mark each item as a strength, an area of improvement, or not sure. Then select the 2 areas you see as the squad's top strengths and the 2 most in need of improvement, with a brief explanation of why. The squad sees the consolidated results in the team assessment results tab on Wednesday. You will have 2.5 minutes to share, so think ahead about what you want to say.",
    who: "everyone",
  },
  {
    id: "tpr",
    source: "canvas",
    title: "Skim the TPR Model from week 3",
    detail:
      "Task, Process, Relationship. The behavior lists in it are useful language for the team assessment share out.",
    who: "everyone",
    link: {
      label: "TPR Model",
      href: "https://drive.google.com/file/d/14sO7n629YcTHDeUoo-BC4lmMudcolzbv/view",
    },
    insights: [
      {
        title: "Inquire before you advocate",
        text:
          "The model lists inquiring about solutions, versus advocating fiercely, as a core decision making behavior. In the meeting, the side that asks the first real question usually sets the frame. Before you make your case, ask the other side what they need to walk away with today.",
      },
      {
        title: "Name the kind of conflict you are in",
        text:
          "Task conflict is healthy and about the work. Interpersonal conflict is about the person. A funding conversation can slide from one to the other fast, and the room goes badly when either side hears an observation as a character attack. Keep it to what was observed and what the impact was.",
      },
      {
        title: "Be the participant observer",
        text:
          "The most effective group member contributes to the task while staying conscious of how the group is working. Both feedback partners and both players can do this. Notice who talks after whom, who interrupts, and who the VCs look at when they ask a hard question. Those cues decide who wins the room.",
      },
      {
        title: "Repair is a behavior, not an outcome",
        text:
          "Relational skills in the model include being receptive and non defensive to feedback and repairing relationships after conflict. Whichever side you are on, one visible moment of taking responsibility for something tends to move the room more than any rebuttal.",
      },
    ],
  },
];

export const ROSTER = [
  { name: "Serim Tarcan", r1: "Casey Parker (VC)", r2: "Feedback partner to Casey", side: "vc" },
  { name: "Ellis Wilder", r1: "Feedback partner to Casey", r2: "Casey Parker (VC)", side: "vc" },
  { name: "Vanessa Sims", r1: "Quinn Nguyen (VC)", r2: "Quinn Nguyen (VC)", side: "vc", extra: "Fellow" },
  { name: "Yash Saraf", r1: "Ren Ito (Co-founder)", r2: "Feedback partner to Ren", side: "cofounder" },
  { name: "Cam Zahner", r1: "Feedback partner to Ren", r2: "Ren Ito (Co-founder)", side: "cofounder" },
  { name: "Minyoung Hwang", r1: "Hayden Mendez (Co-founder)", r2: "Feedback partner to Hayden", side: "cofounder" },
  { name: "Yuhan Wang", r1: "Feedback partner to Hayden", r2: "Hayden Mendez (Co-founder)", side: "cofounder" },
] as const;

export type AssessmentItem = { id: string; text: string };
export type AssessmentCategory = { key: "task" | "relationship" | "process"; label: string; question: string; items: AssessmentItem[] };

export const ASSESSMENT: AssessmentCategory[] = [
  {
    key: "task",
    label: "Task",
    question: "How is the squad progressing towards successful accomplishment of its tasks?",
    items: [
      { id: "t1", text: "I am satisfied with the level of commitment and engagement of all squad members" },
      { id: "t2", text: "We hold each other to high standards of performance, and articulate these expectations" },
      { id: "t3", text: "Meeting Leads are prepared, organized and thoughtful" },
      { id: "t4", text: "Squad discussions stay on track and are productive in our Labs and OB206 project meetings" },
      { id: "t5", text: "Different points of view are valued and utilized" },
      { id: "t6", text: "When problems are addressed, alternatives are developed and evaluated" },
      { id: "t7", text: "We make good use of our squad" },
      { id: "t8", text: "Our interactions with each other provide useful data/insights for individual members to inform their reflection regarding “Why would anyone follow you?”" },
    ],
  },
  {
    key: "relationship",
    label: "Relationship",
    question: "How is the squad doing in building effective group relationships?",
    items: [
      { id: "r1", text: "Everyone participates in group discussions" },
      { id: "r2", text: "We listen to each other well" },
      { id: "r3", text: "Concern for one another is evidenced by the support all members provide to each other" },
      { id: "r4", text: "All squad members feel comfortable disagreeing and raising difficult topics" },
      { id: "r5", text: "We say to each other in Labs and OB206 project meetings what we are thinking in private" },
      { id: "r6", text: "Trust between squad members is high" },
      { id: "r7", text: "We have fun in our meetings" },
    ],
  },
  {
    key: "process",
    label: "Process",
    question: "Does the squad have processes in place that contribute to effective Task and Relationship outcomes?",
    items: [
      { id: "p1", text: "We have effective decision making processes" },
      { id: "p2", text: "There is clarity about roles and responsibilities in our squad for Labs and OB206 project meetings" },
      { id: "p3", text: "Decisions reflect the input of all members" },
      { id: "p4", text: "All squad members feel responsible for the effectiveness of our meetings" },
      { id: "p5", text: "All squad members pay attention to each other's Leadership Goals" },
      { id: "p6", text: "All squad members are committed to giving honest feedback to each other" },
    ],
  },
];

export const ALL_ITEMS: AssessmentItem[] = ASSESSMENT.flatMap((c) => c.items);
export const ITEM_TEXT: Record<string, string> = Object.fromEntries(ALL_ITEMS.map((i) => [i.id, i.text]));

export type Rating = "S" | "I" | "N";

export type Submission = {
  ratings: Record<string, Rating>;
  topStrengths: string[]; // item ids, 2
  topImprove: string[]; // item ids, 2
  examples: Record<string, string>; // item id -> example text
  other?: string;
  submittedAt: string;
};

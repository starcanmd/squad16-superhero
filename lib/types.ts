import type { Submission } from "@/lib/public";

export type Bullet = string | { text: string; sub: string[] };
export type Table = { head: string[]; rows: string[][]; note?: string };
export type Sub = { title: string; paragraphs?: string[]; bullets?: Bullet[]; after?: string[]; table?: Table; bulletsAfter?: Bullet[] };
export type Section = {
  heading: string;
  confidential?: boolean;
  small?: boolean;
  paragraphs?: string[];
  bullets?: Bullet[];
  table?: Table;
  bulletsAfter?: Bullet[];
  after?: string[];
  subsections?: Sub[];
};

export type Goal = { title: string; behaviors: string[]; accountability: string[] };

export type CheckItem = { id: string; title: string; detail?: string; source: "canvas" | "optional" };

export type SafePerson = {
  key: string;
  name: string;
  firstName: string;
  side: "vc" | "cofounder";
  isLead?: boolean;
  character: string;
  playingRound: 1 | 2 | "both";
  partner: string;
  roleSummary: string;
  goals: Goal[];
  tryThis: { when: string; items: string[] }[];
  askYourPartner: string[];
  fellowPrep?: string[];
};

export type SquadMember = Pick<
  SafePerson,
  "key" | "name" | "firstName" | "side" | "character" | "playingRound" | "partner" | "goals" | "tryThis"
>;

export type Payload = {
  person: SafePerson;
  pack: Section[];
  checklist: CheckItem[];
  checks: Record<string, boolean>;
  submission: Submission | null;
  storeConfigured: boolean;
  squad?: SquadMember[];
};

export type ResultsPerson = {
  key: string;
  name: string;
  firstName: string;
  submission: Submission | null;
  checks: Record<string, boolean>;
  checklistTotal: number;
};

export type Results = { people: ResultsPerson[]; storeConfigured: boolean };

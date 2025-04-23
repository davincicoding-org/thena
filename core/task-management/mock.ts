import { Economica } from "next/font/google";

import { Project, Tag } from "./types";

export const MOCK_PROJECTS: Project[] = [
  { id: "con", name: "ConcentrAID", color: "teal" },
  { id: "koc", name: "KOCO", color: "violet" },
  { id: "dvc", name: "DAVINCI CODING", image: "/dvc.png" },
  { id: "swi", name: "Swissinfluece" },
  { id: "t4c", name: "T4 Capital", color: "blue" },
];

export const MOCK_TAGS: Tag[] = [
  { id: "res", name: "Research", color: "yellow" },
  { id: "des", name: "Design", color: "green" },
  { id: "dev", name: "Development", color: "cyan" },
  { id: "mar", name: "Marketing", color: "grape" },
  { id: "man", name: "Management" },
];

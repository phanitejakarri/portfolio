// Mermaid diagrams in GitDiagram's format, one per project repo.
// `generated: true` means the file is GitDiagram's own output (pulled from gitdiagram.com);
// the rest were written by hand in the same format from each repo's actual files.
import ai from "./chatGPT-clone.mmd?raw";
import chat from "./teamschat-app.mmd?raw";
import linkedin from "./Linkedin-clone.mmd?raw";
import inpaint from "./taskdone.mmd?raw";
import humanizer from "./ProdYis.mmd?raw";
import workout from "./Workout-Application-Backend.mmd?raw";
import dashboard from "./react-dash.mmd?raw";
import spotify from "./spotify-clone.mmd?raw";
import coinflip from "./Bchain-H-T.mmd?raw";
import car from "./car-game.mmd?raw";

export type GitDiagram = { code: string; generated: boolean };

export const gitdiagrams: Record<string, GitDiagram> = {
  "chatGPT-clone": { code: ai, generated: false },
  "teamschat-app": { code: chat, generated: false },
  "Linkedin-clone": { code: linkedin, generated: false },
  taskdone: { code: inpaint, generated: false },
  ProdYis: { code: humanizer, generated: false },
  "Workout-Application-Backend": { code: workout, generated: false },
  "react-dash": { code: dashboard, generated: false },
  "spotify-clone": { code: spotify, generated: false },
  "Bchain-H-T": { code: coinflip, generated: false },
  "car-game": { code: car, generated: false },
};

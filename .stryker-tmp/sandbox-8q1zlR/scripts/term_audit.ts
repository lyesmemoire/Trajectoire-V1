// @ts-nocheck
// temp audit script for TermManager
import { TermManager } from "../src/watchdog/federation/TermManager";
import * as fs from "fs";
import * as path from "path";

const termFile = path.resolve(process.cwd(), "term.json");
// Ensure clean state
if (fs.existsSync(termFile)) fs.unlinkSync(termFile);

function log(step: string, val: any) { console.log(step, JSON.stringify(val)); }

const tm1 = new TermManager();
log("initialTerm", tm1.getTerm());

const election1 = tm1.startNewElection();
log("election1", election1);

tm1.observeTerm(5);
log("afterObserve5 maxSeen", "N/A"); // not exposed

const election2 = tm1.startNewElection();
log("election2", election2);

// simulate restart
const tm2 = new TermManager();
log("postRestartTerm", tm2.getTerm());

tm2.syncTerm(8);
log("afterSync8 term", tm2.getTerm());

const fs = require('fs');
const data = fs.readFileSync('./artifacts/analytics/robust_stability_map.csv', 'utf-8').trim().split('\n').slice(1);

const parsed = data.map(line => {
    const p = line.split(',');
    return {
        nodes: +p[0],
        exp: +p[1],
        damping: +p[2],
        stab: +p[3],
        std: +p[4],
        crash: +p[5]
    };
});

const dampSteps = [...new Set(parsed.map(x => x.damping))].sort((a,b)=>a-b);
const expSteps = [...new Set(parsed.map(x => x.exp))].sort((a,b)=>a-b);

console.log("HEATMAP (N=40) - Mean Stability Score with Dissipative Feedback");
console.log("Exp \\ Damp | " + dampSteps.map(c => c.toFixed(2).padStart(5)).join(' '));
console.log("-".repeat(70));

for(const exp of expSteps) {
    let row = exp.toFixed(2).padStart(10) + " | ";
    for(const damp of dampSteps) {
        const pt = parsed.find(x => x.nodes === 40 && x.exp === exp && x.damping === damp);
        if(pt) {
            row += pt.stab.toFixed(2).padStart(5) + " ";
        } else {
            row += "  ??? ";
        }
    }
    console.log(row);
}

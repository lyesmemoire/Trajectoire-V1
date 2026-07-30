const fs = require('fs');
const path = require('path');

const enrichedLots = JSON.parse(fs.readFileSync(path.join(__dirname, 'enriched-lots.json'), 'utf8'));

function createSprintRoadmap() {
  const sprints = [];
  let sprintId = 1;
  let lotIndex = 0;
  
  // Group lots into sprints (3-5 lots per sprint)
  while (lotIndex < enrichedLots.length) {
    const sprintLots = [];
    const sprintEffort = [];
    
    // Add up to 4 lots per sprint, prioritizing high criticality
    for (let i = 0; i < 4 && lotIndex < enrichedLots.length; i++) {
      sprintLots.push(enrichedLots[lotIndex]);
      sprintEffort.push(enrichedLots[lotIndex].estimatedEffort);
      lotIndex++;
    }
    
    sprints.push({
      id: sprintId++,
      lots: sprintLots.map(l => ({
        id: l.id,
        name: l.name,
        category: l.category,
        criticalityScore: l.criticalityScore,
        estimatedEffort: l.estimatedEffort
      })),
      totalEffort: sprintEffort.reduce((sum, e) => sum + e, 0),
      validationSteps: [
        `pnpm test`,
        `pnpm test --coverage`,
        `Correction immédiate des régressions`,
        `Mise à jour des rapports`,
        `Validation du lot`
      ]
    });
  }
  
  return sprints;
}

const sprintRoadmap = createSprintRoadmap();

fs.writeFileSync(
  path.join(__dirname, 'sprint-roadmap.json'),
  JSON.stringify(sprintRoadmap, null, 2)
);

console.log('Sprint roadmap saved to sprint-roadmap.json');

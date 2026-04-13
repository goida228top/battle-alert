import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf-8');
const startIndex = content.indexOf('      {/* Sidebar UI */}');
const endIndex = content.indexOf('      {/* Emergency Credits */}');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + 
    '      <GameHUD gameState={gameState} engineRef={engineRef} setGameState={setGameState} />\n\n' + 
    content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', newContent);
  console.log('Successfully replaced Sidebar UI with GameHUD');
} else {
  console.log('Could not find start or end index');
}

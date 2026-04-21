const fs = require('fs');

function processApp() {
  let filename = 'src/App.svelte';
  let content = fs.readFileSync(filename, 'utf-8');
  
  content = content.replace(
    '&copy; E. Ketterer Ortiz\n    </div>',
    `&copy; E. Ketterer Ortiz - \n      <a href="https://github.com/Arziel1992/cos30002-predictive-physics/" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: none; font-weight: 600;">\n        <svg height="11" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="11" style="fill: currentColor; vertical-align: middle; margin-top: -2px;">\n          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>\n        </svg> Repository\n      </a>\n    </div>`
  );

  let styleIdx = content.indexOf(':global(:root)');
  let endIdx = content.indexOf('/* Toggle buttons */');
  if (styleIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, styleIdx) + content.substring(endIdx);
  }
  
  // also clean hr if exists
  content = content.replace(/hr { border:(.*?) }\r?\n?/g, '');

  fs.writeFileSync(filename, content);
}

function processControls() {
  let filename = 'src/lib/Controls.svelte';
  let content = fs.readFileSync(filename, 'utf-8');
  
  let styleIdx = content.indexOf('.controls-panel { display: flex;');
  let endIdx = content.indexOf('.glossary-btn-small {');
  if (styleIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, styleIdx) + content.substring(endIdx);
  }

  let restIdx = content.indexOf('.control-group { display: flex;');
  let restEndIdx = content.indexOf('input[type="range"] { appearance: none;');
  if (restIdx !== -1 && restEndIdx !== -1) {
    let actionsMatch = content.indexOf('.label-row .actions', restIdx);
    if(actionsMatch !== -1 && actionsMatch < restEndIdx) {
       content = content.substring(0, restIdx) + content.substring(actionsMatch, actionsMatch + 72) + "\n\n  " + content.substring(restEndIdx);
    } else {
       content = content.substring(0, restIdx) + content.substring(restEndIdx);
    }
  }

  content = content.replace(/hr { border:(.*?) }\r?\n?/g, '');

  fs.writeFileSync(filename, content);
}

processApp();
processControls();

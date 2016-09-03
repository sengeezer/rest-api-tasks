// Inspired by Node JS API docs, brewed by me

const readline = require('readline');
const fs = require('fs');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'txt2JSON > '
});

rl.prompt();

rl.on('line', (line) => {
  let tline = line.trim();
  let filename = tline.match(/[^\\]*\.(\w+)$/);

  if(filename && filename[1] == 'txt') {
      console.log('valid filename: ' + filename[0]);
      const rlf = readline.createInterface({
        input: fs.createReadStream('./' + filename[0]),
        output: process.stdout,
        terminal: false
      });

      let targetFile = './' + filename[0] + '.json';

      let target = fs.openSync(targetFile, 'w');

      rlf.on('line', (line) => {
        let toWrite = line + '\n';
        fs.write(target, toWrite);
      });

      console.log('Completed conversion');
  }

  else {
      console.log(`Try again, you entered: '${line.trim()}'`);
  }

  rl.prompt();
}).on('close', () => {
  console.log('Exiting');
  process.exit(0);
});

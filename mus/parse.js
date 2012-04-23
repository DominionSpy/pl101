var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

fs.readFile('mus.peg', 'ascii', function(err, data)
{
  // Show the PEG grammar file
  console.log(data);
  // Create my parser
  var parse = PEG.buildParser(data).parse;
  // Do a test
  assert.deepEqual( parse("[a4(500) f#4(1000) e3(100) = [c4(250) = eb4(250)]] 3:d3(250) .(250):"),
  { tag: 'seq',
    left:
    { tag: 'par',
      left:
      { tag: 'seq',
        left: { tag: 'note', pitch: 'a4', dur: 500 },
        right:
        { tag: 'seq',
          left: { tag: 'note', pitch: 'f#4', dur: 1000 },
          right: { tag: 'note', pitch: 'e3', dur: 100 } } },
      right:
      { tag: 'par',
        left: { tag: 'note', pitch: 'c4', dur: 250 },
        right: { tag: 'note', pitch: 'eb4', dur: 250 } } },
    right:
    { tag: 'repeat',
      section:
      { tag: 'seq',
        left: { tag: 'note', pitch: 'd3', dur: 250 },
        right: { tag: 'rest', dur: 250 } },
      count: 3 } });
});
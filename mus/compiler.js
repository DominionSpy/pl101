var compile = function (musexpr)
{
  var stack = [musexpr];
  var notes = [];
  var times = [];
  var time = 0;
  var savedtime = 0;
  while (stack.length !== 0)
  {
    var curr = stack.pop();
    if (curr.tag === "rest")
    {
      time += curr.dur;
    }
    else if (curr.tag === "note")
    {
      var midi = 12 + {c:0,d:2,e:4,f:5,g:7,a:9,b:11}[curr.pitch.charAt(0)] + (12 * curr.pitch.charAt(1));
      notes.push({ tag: "note", pitch: midi, dur: curr.dur, start: time });
      time += curr.dur;
    }
    else if (curr.tag === "repeat")
    {
      for (var i = 0; i < curr.count; i++)
      {
        stack.push(curr.section);
      }
    }
    else if (curr.tag === "par")
    {
      times.push(time);
      stack.push({ tag: "endpar" });
      stack.push(curr.right);
      stack.push({ tag: "reset" });
      stack.push(curr.left);
    }
    else if (curr.tag === "seq")
    {
      stack.push(curr.right);
      stack.push(curr.left);
    }
    else if (curr.tag === "reset")
    {
      // Fix for nested "par"s thanks to ericbb
      savedtime = times.pop();
      times.push(time);
      time = savedtime;
    }
    else if (curr.tag === "endpar")
    {
      savedtime = times.pop();
      time = Math.max(time, savedtime);
    }
  }
  return notes;
};

var melody_mus = 
    { tag: 'seq',
      left:
       { tag: 'par',
         left:
         { tag: 'seq',
           left: { tag: 'note', pitch: 'c4', dur: 500 },
           right: { tag: 'note', pitch: 'f3', dur: 1000 } },
         right:
         { tag: 'par',
           left: { tag: 'note', pitch: 'd4', dur: 250 },
           right: { tag: 'note', pitch: 'e4', dur: 250 } } },
      right:
       { tag: 'repeat',
         section:
          { tag: 'seq',
            left: { tag: 'note', pitch: 'a4', dur: 250 },
            right: { tag: 'rest', dur: 250 } },
          count: 3 } };
var result_note =
  [ { tag: 'note', pitch: 60, dur: 500, start: 0 },
    { tag: 'note', pitch: 53, dur: 1000, start: 500 },
    { tag: 'note', pitch: 62, dur: 250, start: 0 },
    { tag: 'note', pitch: 64, dur: 250, start: 0 },
    { tag: 'note', pitch: 69, dur: 250, start: 1500 },
    { tag: 'note', pitch: 69, dur: 250, start: 2000 },
    { tag: 'note', pitch: 69, dur: 250, start: 2500 } ];

console.log(melody_mus);
console.log(compile(melody_mus));
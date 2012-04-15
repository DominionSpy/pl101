var endTime = function (time, expr) {
    if (expr.tag == "note" || expr.tag == "rest") return time + expr.dur;
    if (expr.tag == "repeat") return time + (endTime(0, expr.section) * expr.count);
    if (expr.tag == "par") return Math.max(endTime(time, expr.left), endTime(time, expr.right));
    return endTime(endTime(time, expr.left), expr.right);
};

var convertPitch = function(name) {
    var letterPitches = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
    return 12 + (12 * name.charAt(1)) + letterPitches[name.charAt(0)];
};

var getNote = function (time, expr) {
    var note = { tag: 'note' };
    note.start = time;
    note.dur = expr.dur;
    if (expr.tag == "note") {
        note.pitch = convertPitch(expr.pitch);
    }
    return note;
};

var getNotes = function (time, expr) {
    if (expr.tag == "note" || expr.tag == "rest") {
        return [getNote(time, expr)];
    }
    if (expr.tag == "repeat") {
        var notes = [];
        var end = time;
        for (var i = 0; i < expr.count; i++) {
            notes = notes.concat(getNotes(end, expr.section));
            end = endTime(end, expr.section);
        }
        return notes;
    }
    if (expr.tag == "par") {
        return getNotes(time, expr.left).concat(getNotes(time, expr.right));
    }
    return getNotes(time, expr.left).concat(getNotes(endTime(time, expr.left), expr.right));
};

var compile = function (musexpr) {
    var noteexpr = getNotes(0, musexpr);
    return noteexpr;
};

var melody_mus = 
    { tag: 'seq',
      left:
       { tag: 'repeat',
         section:
          { tag: 'seq',
            left: { tag: 'note', pitch: 'a4', dur: 250 },
            right: { tag: 'rest', dur: 250 } },
          count: 3 },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
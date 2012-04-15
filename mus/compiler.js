var endTime = function (time, expr) {
    if (expr.tag == "note") return time + expr.dur;
    if (expr.tag == "par") return Math.max(endTime(time, expr.left), endTime(time, expr.right));
    return endTime(endTime(time, expr.left), expr.right);
};

var getNotes = function (time, expr) {
    if (expr.tag == "note") {
        var note = expr;
        note.start = time;
        return [note];
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
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
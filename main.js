var A4, notes, totalWhiteOffsets, svg, piano, keys, DIMENSIONS, blackKeys;

totalWhiteOffsets = 0;

DIMENSIONS = {
  white: {
    width: 23,
    height: 120
  },
  black: {
    width: 13,
    height: 80
  }
};

A4 = {
  freq: 440,
  midi: 69,
  name: 'A4'
};

notes = [];

function log2(value) {
  return Math.log(value) * Math.LOG2E;
}

function getFrequency(a4offset) {
  return Math.pow(2, a4offset / 12) * A4.freq;
}

function getMidiNumber(frequency) {
  return 12 * log2(frequency / A4.freq) + A4.midi;
}

// populate notes array
function init() {
  var i, freq;
  notes.push(A4);
  for (i = 1; i <= 35; i++) {
    freq = getFrequency(i);
    notes.push({
      midi: getMidiNumber(freq),
      freq: freq
    });
  }
}
init();

function getKeyColor(note) {
  var offset = note.midi - A4.midi;

  while (offset > 12) {
    offset = offset % 12;
  }

  if ([1, 4, 6, 9, 11].indexOf(offset) >= 0) {
    return 'black';
  }
  return 'white';
}

function getXOffset(note, i) {
  var keyColor, keyWidth, xoffset;
  keyColor = getKeyColor(note);
  keyWidth = DIMENSIONS[keyColor].width;

  if (i === 0) {
    if (keyColor === 'white') {
      xoffset = 0;
      totalWhiteOffsets += keyWidth;
      return xoffset;
    }
    // todo: what if the 1st key is black?
  }

  if (keyColor === 'white') {
    xoffset = totalWhiteOffsets;
    totalWhiteOffsets += keyWidth;
  } else {
    xoffset = totalWhiteOffsets - Math.ceil(keyWidth / 2)
  }
  return xoffset;
}


svg = d3.select('body').append('svg');

piano = svg.append('g')
  .attr('class', 'piano');

keys = piano.selectAll('.key')
    .data(notes)
  .enter()
    .append('rect')
    .attr({
      'class': function(d) {
        return 'key ' + getKeyColor(d);
      },
      'x': function(d, i) {
        return getXOffset.call(this, d, i);
      },
      'y': 0,
      'width': function(d) {
        return DIMENSIONS[getKeyColor(d)].width;
      },
      'height': function(d, i) {
        return DIMENSIONS[getKeyColor(d)].height;
      }
    });
    //.append('text')
      //.text(function(d) {
        //return d.midi;
      //});

keys
  .on('mouseover', function() {
    d3.select(this).classed('hover', true);
  })
  .on('mouseout', function() {
    d3.select(this).classed('hover', false);
  })
  .on('click', function(d, i) {
    console.log('play note freq: ', d.freq);
  });


// At this stage everything is rendered, but they black keys need to be repositioned on top of the white keys in the DOM.

// remove black keys from DOM.
blackKeys = piano.selectAll('.key.black').remove();

// re-add black keys at end of piano DOM.
blackKeys.each(function(d, i) {
  piano.node().appendChild(this);
});





const question = document.getElementById('question')
const options = document.getElementsByClassName('option')

var chosen = []

function splitmix32(a) {
  a |= 0; a = a + 0x9e3779b9 | 0;
  var t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
      t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
  return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
}

function select(selected) {
  chosen.push(selected)
  loadQuestion(chosen.length)
}

function loadQuestion(questionIndex) {
  if (questionIndex <= 10) {
    var questionArray = questions[questionIndex]

    for (i=0;i<options.length;i++) {
      question.innerHTML = questionArray[0]
      options[i].innerHTML = questionArray[i+1]
    }
  } else {
    teacher = getTeacher()
    loadTeacher(teacher)
  }
}

function getTeacher() {
  var tally = [0,0,0,0,0,0,0,0,0,0,0]
  chosen.forEach((e, i) => {
    answers[i][e].forEach(answer => {
      tally[answer.i] += answer.v
    })
  })
  //console.log(tally)

  var maxIndex = []
  var maxValue = -1

  var seed = sum(tally)

  tally.forEach((e, i) => {
    if (maxValue < e) { maxValue=e; maxIndex=[i] } else if (maxValue === e) { maxIndex.push(i) }
  })

  //console.log(maxIndex)

  if (teachers[maxIndex[parseInt(Math.round((maxIndex.length - 1) * splitmix32(seed)))]] === undefined) {
    console.log(tally, maxIndex)
  } else {
    return teachers[maxIndex[parseInt(Math.round((maxIndex.length - 1) * splitmix32(seed)))]]
  }
}

function sum(a) {
  var s = 0
  a.forEach(e => { s += e })
  return s
}

function loadTeacher(teacherObj) {
  document.getElementById('interface-container').style.display = 'none';
  document.getElementsByClassName('result-container')[0].style.display = '';

  document.getElementsByClassName('small-span')[0].innerHTML = teacherObj.epithet + ','
  document.getElementsByClassName('big-span')[0].innerHTML = teacherObj.name + '.'
  document.getElementsByClassName('person-description')[0].innerHTML = teacherObj.description

  document.getElementById('stat-0').style.width = String(teacherObj.stats[0]) + '%'
  document.getElementById('stat-1').style.width = String(teacherObj.stats[1]) + '%'
  document.getElementById('stat-2').style.width = String(teacherObj.stats[2]) + '%'
  document.getElementById('stat-3').style.width = String(teacherObj.stats[3]) + '%'
  document.getElementById('stat-4').style.width = String(teacherObj.stats[4]) + '%'
  document.getElementById('stat-5').style.width = String(teacherObj.stats[5]) + '%'

  document.getElementById('person-photo').src = 'images/' + teacherObj.photo
};

//document.getElementById('interface-container').style.display = 'none';
//document.getElementsByClassName('result-container')[0].style.display = '';
//
//loadTeacher(teachers[10])

function weightTest() {
  var distribution = [0,0,0,0,0,0,0,0,0,0,0]
  for (i=0;i<100000;i++) {
    chosen = []
    for (j=0;j<11;j++) {
      chosen.push(parseInt(Math.round(3 * Math.random())))
    }
    if (teachers.indexOf(getTeacher())>-1) {
      distribution[teachers.indexOf(getTeacher())] += 1
    } else {
      console.log(chosen)
      console.log(getTeacher())
    }
  }
  distribution.forEach((e,i) => { distribution[i]=String(e/1000)+'%' })
  return distribution
}

loadQuestion(0);
var jsPsych = initJsPsych({
    display_element: 'display_stage',
});


var repo = 'https://jsmnrchtr.github.io/my_experiment/';

var preload = {
  type: jsPsychPreload,
  images: [repo + 'img/blue.png', repo + 'img/orange.png']
};


var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Welcome to the experiment. Press any key to start."
};


var instruction = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `Hallo.</p>`,
  post_trial_gap: 2000
};


var test_stimuli = [
  { stimulus: repo + 'img/blue.png',  correct_response: 'f'},
  { stimulus: repo + 'img/orange.png',  correct_response: 'j'}
];

var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: function(){
    return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
  },
  data: {
    task: 'fixation'
  }
};

var test_trial = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['f', 'j'],
  data: {
    task: 'response',
    correct_response: jsPsych.timelineVariable('correct_response')
  },
  on_finish: function(data){
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
  }
};

//run the test_procedure timeline one time for each entry in the test_stimuli array
var test_procedure = {
  timeline: [fixation, test_trial],
  timeline_variables: test_stimuli,
  randomize_order: true,
  repetitions: 2
};


var debrief_block = {
 type: jsPsychHtmlKeyboardResponse,
 stimulus: function() {
  var trials = jsPsych.data.get().filter({task: 'response'});
  var correct_trials = trials.filter({correct: true});
  var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
  var rt = Math.round(correct_trials.select('rt').mean());

  return `<p>You responded correctly on ${accuracy} % of the trials.</p>
  <p>Your average response time was ${rt} ms.</p>
  <p>Press any key to complete the experiment. Thank you!</p>`;
  }
};

// push all the procedures, which are defined in stop-it_main.js to the overall timeline
var timeline = []; // this array stores the events we want to run in the experiment
timeline.push(preload, welcome, instruction, test_procedure, debrief_block);


// run timeline
jsPsych.run(timeline);



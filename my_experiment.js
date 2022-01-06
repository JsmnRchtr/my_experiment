const jsPsych = initJsPsych(); //initialize jspsych
    
// define trial
const hello_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: 'Hello world!'
}

// run timeline
jsPsych.run([hello_trial]);
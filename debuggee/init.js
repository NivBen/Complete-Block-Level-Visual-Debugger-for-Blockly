export var window = {
    alert : function(msg) {
      postMessage({"type": "alert", "data" : msg});
    },
    prompt : async function (msg){
      postMessage({"type": "prompt", "data" : msg});
      while(flags.promptMsg == undefined){
        await next_message();
      }
      var tmp = flags.promptMsg;
      flags.promptMsg = undefined;
      return tmp;
    }
} ;  

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function next_message() { 
  return sleep(0); 
}

export var actions = {
  prompt : (promptMsg) => {
    flags.promptMsg = promptMsg;
  }
};

export var flags = {
  currNest : 0,
  currId : '',
  promptMsg : undefined,
  stepWait : false,
  in : false, 
  over : false,
  parent : false,
  out : false,
  continue: true,
  setTrue : (true_flag) =>{
    flags.in = false;
    flags.over = false;
    flags.out = false;
    flags.parent = false;
    flags.continue = false;
    flags[true_flag] = true;
  }
};
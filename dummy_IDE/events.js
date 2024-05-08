import '../debugger/debugger.js';
import '../generator/blockly/blockly.js';
import {Blockly_Debugger} from '../debugger/debugger.js'; 
import {Breakpoint_Icon} from '../generator/blockly/core/breakpoint.js';


addEventListener("updateTable",function (){
    let variables = Blockly_Debugger.actions["Variables"].getVariables();
    document.getElementById("variables").innerHTML = '';
    for(var i = 0; i<variables.length; ++i){
        var red_style = ``;
        if(variables[i].change === true) red_style = `style=\"color:red;\"`;
        document.getElementById("variables").innerHTML += `<tr>
                                                            <td ` + red_style + `>` + variables[i].name + `</td>
                                                            <td ` + red_style + `>` +  variables[i].value + `</td>
                                                            <td ` + red_style + `>` + typeof variables[i].value + `</td>
                                                          </tr>`;
    }
});


addEventListener("updateWatchesTable",function (){
    let watches = Blockly_Debugger.actions["Watch"].getWatches();
    document.getElementById("watches").innerHTML = '';
    for(var i = 0; i<watches.length; ++i){
        var red_style = ``;
        if(watches[i].change === true) red_style = `style=\"color:red;\"`;
        document.getElementById("watches").innerHTML += `<tr>
                                                            <td ` + red_style + `>` + watches[i].name + `</td>
                                                            <td ` + red_style + `>` + watches[i].code + `</td>
                                                            <td ` + red_style + `>` + watches[i].value + `</td>
                                                            <td ` + red_style + `>` + typeof watches[i].value + `</td>
                                                        </tr>`;
    }
});

addEventListener('keydown', (event) => { 
    switch (event.key.toUpperCase()) {
    case 'S':
        event.preventDefault();
        var blocks = Blockly.Xml.workspaceToDom(window.workspace["blockly1"],true).childNodes;
        var output = "";
        blocks.forEach(e => {
            if(e.localName == "block"){
                output += "\n";
                output += e.outerHTML;
            }
        });
        console.log(output);
        break;
    }
});

addEventListener("addBlocklyBreakpointFromGutter", function () {
    const block = event.detail.block;
    if(!Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=>{return obj.block_id;}).includes(block.id)){
        var new_br = {
          "block_id" : block.id,
          "enable" : true,
          "icon" : new Breakpoint_Icon(block),
          "change": false
        }
        Blockly_Debugger.actions["Breakpoint"].breakpoints.push(new_br);
        block.setCollapsed(false);
      } else{
        var index = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=>{return obj.block_id;}).indexOf(block.id);
        var icon = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=>{if(obj.block_id === block.id) return obj.icon})[index];
        icon.myDisable();
        if (index !== -1) Blockly_Debugger.actions["Breakpoint"].breakpoints.splice(index, 1);
      }
});


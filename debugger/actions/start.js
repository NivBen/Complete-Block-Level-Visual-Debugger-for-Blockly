import {Debuggee_Worker, Blockly_Debugger} from '../init.js';
import './watches.js';

Blockly_Debugger.actions["Start"] = {};

Blockly_Debugger.actions["Start"].handler = (cursorBreakpoint) => {
    if(Debuggee_Worker.hasInstance()) return;
    Blockly.JavaScript.STATEMENT_PREFIX = 'await $id(%1, 0);\n';
    var code1 = Blockly.JavaScript.workspaceToCode(window.workspace["blockly1"]);
    var code2 = Blockly.JavaScript.workspaceToCode(window.workspace["blockly2"]); 
    var code = code1 + code2;
    
    Blockly_Debugger.actions["Variables"].init();
    Blockly_Debugger.actions["Watch"].init();

    document.getElementById("val_table").innerHTML = `  <div class="watch">
                                                            <div class="title">Variables  
                                                            <!--i class="fa fa-bars"></i-->
                                                            </div>
                                                            <div class="watch-content">
                                                            <table style="width:100%">
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Value</th> 
                                                                <th>Type</th>
                                                            </tr>     

                                                            </table>
                                                            <table id="variables" style="width:100%"></table>
                                                        </div>
                                                        </div>

                                                        <div class="watch">
                                                            <div class="title">Watches</div>
                                                            <div class="watch-content">
                                                            <table style="width:100%">
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Code</th> 
                                                                <th>Value</th>
                                                                <th>Type</th>
                                                            </tr>     
                                                            </table>
                                                            <table id="watches" style="width:100%"></table>
                                                        </div>
                                                        </div>`;

    
    if(cursorBreakpoint instanceof MouseEvent) cursorBreakpoint = "";
    Debuggee_Worker.Instance().postMessage({"type":"start_debugging", "data": {"code": code, 
                                                                               "breakpoints": Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=>{return { "block_id" : obj.block_id,
                                                                                                                                                                      "enable" : obj.enable}}),
                                                                               "cursorBreakpoint": cursorBreakpoint,
                                                                               "watches": Blockly_Debugger.actions["Watch"].getWatches(),
                                                                               "variables": Blockly_Debugger.actions["Variables"].getVariables()
                                                                            }});
    console.log(code1 + code2);
}

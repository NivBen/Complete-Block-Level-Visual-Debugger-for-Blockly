import {Debuggee_Worker, Blockly_Debugger} from '../init.js';
import './watches.js';

// Check if the block's type is in the list of value block types
// function isValueBlock(block) {
//     var valueBlockTypes = ['math_number', 
//                             'text', 
//                             'logic_boolean', 
//                             'math_arithmetic', 
//                             'variables_get', 
//                             'math_modulo', 
//                             'logic_compare', 
//                             'lists_create_with',
//                             'lists_getIndex'];
//     return valueBlockTypes.includes(block.type);
// }

// Function to generate JSON object containing generated code and line number for each block in the workspace
function generate_code_line_mapping_for_workspace(workspace) {
    // Blockly.Python.variableDB_.setVariableMap(workspace.getVariableMap());
    var code_line_mapping = {};
    // Generate Python code for the entire workspace
    var generatedCode = Blockly.Python.workspaceToCode(workspace);
    Blockly.Python.variableDB_.setVariableMap(workspace.getVariableMap());
    // Iterate over all blocks in the workspace
    workspace.getAllBlocks().forEach(function(block) {
        var block_code = '';
        if(block.type === 'procedures_defnoreturn' || block.type === 'procedures_callnoreturn'){
            let func_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
            block_code = (block.type === 'procedures_defnoreturn') ? 'def ' + func_name : func_name+'()';
        } else {
            block_code = Blockly.Python.blockToCode(block);
            if(Array.isArray(block_code) /*isValueBlock(block)*/) {
                block_code = Blockly.Python.blockToCode(block)[0]; // code string only
            } else {
                block_code = Blockly.Python.blockToCode(block).split('\n')[0]; // code string only w/o proceeding blocks
                block_code = block_code.replace(/count[0-9]/g, "count");
            }
        }
        var lineNumber = 1; // Start line number at 1
        var lines = generatedCode.split('\n');
        var blockFound = false;
        // Iterate over lines to find the block
        for (var i = 0; i < lines.length; i++) {
            // Check if the current line contains the block's ID
            if (lines[i].includes(block_code)) {
                blockFound = true;
                break;
            }
            // Increment line number
            lineNumber++;
        }
        // Add block information to the code_line_mapping object
        code_line_mapping[block.id] = {
            "code": block_code,
            "lineNumber": blockFound ? lineNumber : null
        };
    });

    return code_line_mapping;
}

function extract_breakpoints_line_numbers(breakpoints) {
    const lineNumbersSet = new Set();
    breakpoints.forEach(obj => {
        const firstLine = obj.line[0];
        if (firstLine) {
            lineNumbersSet.add(firstLine.line);
        }
    });
    return Array.from(lineNumbersSet); // Convert Set back to array
}

function triggerBreakpoints(cm, lineNumbersSet) {
    lineNumbersSet.forEach(lineNumber => {
        var info = cm.lineInfo(lineNumber);
        cm.setGutterMarker(lineNumber, "breakpoints", info.gutterMarkers ? null : create_breakpoint_marker());
    });
}

function create_breakpoint_marker(markerClass) {
    const marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    return marker;
}

let breakpoints = {};

Blockly_Debugger.actions["Start"] = {};
Blockly_Debugger.actions["Start"].handler = (cursorBreakpoint) => {
    if(Debuggee_Worker.hasInstance()) return;
    Blockly.JavaScript.STATEMENT_PREFIX = 'await $id(%1, 0);\n';
    var code1 = Blockly.JavaScript.workspaceToCode(window.workspace["blockly1"]);
    var code2 = Blockly.JavaScript.workspaceToCode(window.workspace["blockly2"]); 
    var code = code1 + code2;
    code.replace(/__DOLLAR__/g, '\$');
    Blockly_Debugger.actions["Variables"].init();
    Blockly_Debugger.actions["Watch"].init();

    document.getElementById("val_table").innerHTML = `  <div class="watch">
                                                            <div class="title">&nbsp;Variables  
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
                                                            <div class="title">&nbsp;Watches</div>
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
    console.log("################# JavaScript Code Blockly2 ####################");
    console.log(code1);

    var workspace = Blockly.getMainWorkspace();
    Blockly.Python.init(workspace);
    // console.log(workspace.getAllBlocks());
    // console.log("#################  All Blocks  ####################");
    var code_line_mapping = generate_code_line_mapping_for_workspace(workspace);
    console.log("#################  Blocks Info ####################");
    console.log(code_line_mapping);
    
    breakpoints = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj)=> {
        return { 
            "location": "/dummy_IDE/sample_code.py",
            "block_id" : obj.block_id, 
            "line" : [{ "line": code_line_mapping[obj.block_id].lineNumber - 1, "character": 0}, 
                      { "line": code_line_mapping[obj.block_id].lineNumber - 1, "character": 0}],
            "enabled" : obj.enable, 
            "code": code_line_mapping[obj.block_id].code}
    });
    console.log("#################  breakpoints ####################");
    console.log(breakpoints);
    const breakpoints_line_numbers = extract_breakpoints_line_numbers(breakpoints);
    // console.log(breakpoints_line_numbers);
    triggerBreakpoints(CodeMirrorEditor, breakpoints_line_numbers);
}

function copyToClipboard(text) {
    // Create a temporary input element
    var tempInput = document.createElement("input");
    // Assign the text to be copied to the input element's value
    tempInput.value = text;
    // Append the input element to the document
    document.body.appendChild(tempInput);
    // Select the text inside the input element
    tempInput.select();
    // Copy the selected text to the clipboard
    document.execCommand("copy");
    // Remove the temporary input element
    document.body.removeChild(tempInput);
}

Blockly_Debugger.actions["ExportBreakpointsToClipboard"] = {};
Blockly_Debugger.actions["ExportBreakpointsToClipboard"].handler = () => { 
    copyToClipboard(JSON.stringify(breakpoints));
}

import { Debuggee_Worker, Blockly_Debugger } from '../init.js';
import './watches.js';

// Function to generate JSON object containing generated code and line number for each block in the workspace
function generate_code_line_mapping_for_workspace(workspace, language) {
    var code_line_mapping = {};
    // Generate code for the entire workspace
    var generatedCode = Blockly[language].workspaceToCode(workspace);
    Blockly[language].variableDB_.setVariableMap(workspace.getVariableMap());
    // Iterate over all blocks in the workspace
    workspace.getAllBlocks().forEach(function (block) {
        var block_code = '';
        if (block.type === 'procedures_defnoreturn' || block.type === 'procedures_callnoreturn') {
            let func_name = Blockly[language].variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
            block_code = (block.type === 'procedures_defnoreturn') ? 'def ' + func_name : func_name + '()';
        } else {
            block_code = Blockly[language].blockToCode(block);
            if (Array.isArray(block_code) /*isValueBlock(block)*/) {
                block_code = Blockly[language].blockToCode(block)[0]; // code string only
            } else {
                block_code = Blockly[language].blockToCode(block).split('\n')[0]; // code string only w/o proceeding blocks
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

function triggerGutterBreakpointsFromBlockly(cm, lineNumbersSet) {
    lineNumbersSet.forEach(lineNumber => {
        var info = cm.lineInfo(lineNumber);
        if (!info.gutterMarkers)
            cm.setGutterMarker(lineNumber, "breakpoints", create_breakpoint_marker());
    });
}


function trigger_gutter_breakpoints_from_blockly(workspace, language, editor) {
    Blockly[language].init(workspace);
    let code_line_mapping = generate_code_line_mapping_for_workspace(workspace, language);
    let breakpoints = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => {
        return {
            "location": "/dummy_IDE/sample_code.py",
            "block_id": obj.block_id,
            "line": [{ "line": code_line_mapping[obj.block_id].lineNumber - 1, "character": 0 },
            { "line": code_line_mapping[obj.block_id].lineNumber - 1, "character": 0 }],
            "enabled": obj.enable,
            "code": code_line_mapping[obj.block_id].code
        }
    });
    let breakpoints_line_numbers = extract_breakpoints_line_numbers(breakpoints);

    breakpoints_line_numbers.forEach(lineNumber => {
        var info = editor.lineInfo(lineNumber);
        if (!info.gutterMarkers)
            editor.setGutterMarker(lineNumber, "breakpoints", create_breakpoint_marker());
    });
}

function create_breakpoint_marker() {
    const marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    return marker;
}

let breakpoints = {};

Blockly_Debugger.actions["Start"] = {};
Blockly_Debugger.actions["Start"].handler = (cursorBreakpoint) => {
    if (Debuggee_Worker.hasInstance()) return;
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


    if (cursorBreakpoint instanceof MouseEvent) cursorBreakpoint = "";
    Debuggee_Worker.Instance().postMessage({
        "type": "start_debugging", "data": {
            "code": code,
            "breakpoints": Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => {
                return {
                    "block_id": obj.block_id,
                    "enable": obj.enable
                }
            }),
            "cursorBreakpoint": cursorBreakpoint,
            "watches": Blockly_Debugger.actions["Watch"].getWatches(),
            "variables": Blockly_Debugger.actions["Variables"].getVariables()
        }
    });

    let workspace = Blockly.getMainWorkspace();
    // Python Editor
    let language = "Python";
    let editor = PythonEditor;
    trigger_gutter_breakpoints_from_blockly(workspace, language, editor);

    // JavaScript Editor
    language = "UneditedJavaScript";
    editor = JavaScriptEditor;
    trigger_gutter_breakpoints_from_blockly(workspace, language, editor);

    // Dart Editor
    language = "Dart";
    editor = DartEditor;
    trigger_gutter_breakpoints_from_blockly(workspace, language, editor);
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

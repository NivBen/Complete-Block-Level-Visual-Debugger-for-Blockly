import './init_blockly.js';
import '../debugger/debugger.js';
import '../generator/blockly/blockly.js';
import { Blockly_Debugger } from '../debugger/debugger.js';
import { Blockly_Debuggee } from '../debuggee/init.js';
import { Breakpoint_Icon } from '../generator/blockly/core/breakpoint.js';

document.getElementById("ContinueButton").onclick = Blockly_Debugger.actions["Continue"].handler;
document.getElementById("StepInButton").onclick = Blockly_Debugger.actions["StepIn"].handler;
document.getElementById("StepOverButton").onclick = Blockly_Debugger.actions["StepOver"].handler;
document.getElementById("StepParentButton").onclick = Blockly_Debugger.actions["StepParent"].handler;
document.getElementById("StepOutButton").onclick = Blockly_Debugger.actions["StepOut"].handler;
document.getElementById("StopButton").onclick = Blockly_Debugger.actions["Stop"].handler;
document.getElementById("StartButton").onclick = Blockly_Debugger.actions["Start"].handler;
document.getElementById("ExportBreakpointsButton").onclick = Blockly_Debugger.actions["ExportBreakpointsToClipboard"].handler;

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('language_options');
    dropdown.selectedIndex = 0; // select first option
    let selectedOption = '';
    // const selectedOptionDisplay = document.getElementById('selected_language_option');

    function updateSelectedOption(event) { // Function to update the state and display the selected option
        selectedOption = event.target.value;
        // selectedOptionDisplay.textContent = `Selected option: ${selectedOption}`;
        Blockly_Debuggee.state.currProgrammingLanguage = selectedOption;

        document.querySelectorAll('.nav-link').forEach(link => { // Remove existing highlights
            link.classList.remove('highlightChosenLanguage');
            link.parentElement.style.backgroundColor = '#fff';
        });
        const link = Array.from(document.querySelectorAll('.nav-link')) // Highlight the specified selection
            .find(link => link.textContent.trim() === selectedOption);
        if (link) {
            link.classList.add('highlightChosenLanguage');
            link.parentElement.style.backgroundColor = '#fa2a2a';
        }
    }
    dropdown.addEventListener('change', updateSelectedOption); // Add event listener to the dropdown to handle selection changes
    updateSelectedOption({ target: dropdown }); // Initial display update
});

// document.addEventListener('DOMContentLoaded', () => {
//     const textBox = document.getElementById('textBox');
//     const saveButton = document.getElementById('saveButton');
//     const logSnapshotsButton = document.getElementById('logSnapshotsButton');
//     const savedButtonsContainer = document.getElementById('savedButtonsContainer');

//     // Make savedSnapshots a global variable
//     window.savedSnapshots = [];

//     // Function to format date and time
//     function formatDateTime(timestamp) {
//         const dd = String(timestamp.getDate()).padStart(2, '0');
//         const mm = String(timestamp.getMonth() + 1).padStart(2, '0'); // January is 0!
//         const hh = String(timestamp.getHours()).padStart(2, '0');
//         const min = String(timestamp.getMinutes()).padStart(2, '0');
//         return `${dd}/${mm} | ${hh}:${min}`;
//     }

//     saveButton.addEventListener('click', () => {
//         const currentText = textBox.value.trim();
//         if (currentText === '') {
//             alert('Text box is empty. Please enter some text.');
//             return;
//         }

//         const timestamp = new Date();
//         const snapshot = {
//             text: currentText,
//             time: timestamp
//         };

//         window.savedSnapshots.push(snapshot);
//         const savedButton = document.createElement('button');
//         savedButton.innerText = `Snapshot ${formatDateTime(timestamp)}`;
//         savedButton.addEventListener('click', () => {
//             textBox.value = snapshot.text;
//         });
//         savedButton.title = `Saved on: ${formatDateTime(timestamp)}`;
//         savedButtonsContainer.appendChild(savedButton);
//     });

//     logSnapshotsButton.addEventListener('click', () => {
//         console.log(window.savedSnapshots);
//         console.log(Blockly_Debuggee.state);
//         // Blockly_Debugger.actions["Breakpoint"].breakpoints = {}
//         console.log(Blockly_Debugger.actions["Breakpoint"].breakpoints);
//         console.log(window.workspace["blockly2"]);
//     });
// });

// Editors Definition - Start
export var PythonEditor = CodeMirror.fromTextArea(document.getElementById("python_code"), {
    mode: {
        name: "python",
        version: 3,
        singleLineStringErrors: false
    },
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
    gutters: ["breakpoints"],
});
PythonEditor.setValue('Generated Python Block formula will be here...');

export const JavaScriptEditor = CodeMirror.fromTextArea(document.getElementById("javascript_code"), {
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
    gutters: ["breakpoints"],
});
JavaScriptEditor.setValue('Generated JavaScript Block formula will be here...');

export const DartEditor = CodeMirror.fromTextArea(document.getElementById("dart_code"), {
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
    gutters: ["breakpoints"],
});
DartEditor.setValue('Generated Python Block formula will be here...');

// set initial editor code according to "startBlocks"
var python_code = Blockly.Python.workspaceToCode(window.workspace["blockly2"]);
var javascript_code = Blockly.UneditedJavaScript.workspaceToCode(window.workspace["blockly2"]);
var dart_code = Blockly.Dart.workspaceToCode(window.workspace["blockly2"]);
PythonEditor.setValue(python_code);
JavaScriptEditor.setValue(javascript_code);
DartEditor.setValue(dart_code);

var isUpdating_py = false;
var debouncedB2TUpdate_py = debounce_py(blockToTextUpdate_py, 1000);
function debounce_py(func, wait) {
    var timeout_py;
    return function () {
        clearTimeout(timeout_py);
        timeout_py = setTimeout(() => {
            func.apply(this, arguments);
        }, wait);
    }
}
function blockToTextUpdate_py() {
    if (isUpdating_py) {
        isUpdating_py = false;
    } else {
        isUpdating_py = true;
        var updated_python_code = Blockly.Python.workspaceToCode(window.workspace["blockly2"]);
        PythonEditor.setValue(updated_python_code);
        var updated_javascript_code = Blockly.UneditedJavaScript.workspaceToCode(window.workspace["blockly2"]);
        JavaScriptEditor.setValue(updated_javascript_code);
        var updated_dart_code = Blockly.Dart.workspaceToCode(window.workspace["blockly2"]);
        DartEditor.setValue(updated_dart_code);
    }
}
window.workspace["blockly2"].addChangeListener(debouncedB2TUpdate_py);
// Editors Definition - End

// Blockly XML Load Modal - Start
let modal = document.getElementById("XMLModal");

let displayBlocklyBtn = document.getElementById("DisplayBlocklyButton");
displayBlocklyBtn.onclick = function () {
    modal.style.display = "block";
    let blocks_workspace = window.workspace["blockly2"];
    var xml = Blockly.Xml.workspaceToDom(blocks_workspace);
    var xml_text = Blockly.Xml.domToPrettyText(xml);
    let input = document.getElementById("XML_paragraph");
    input.textContent = xml_text;
}

let LoadXMLtoBlocklyBtn = document.getElementById("LoadXMLtoBlocklyButton");
LoadXMLtoBlocklyBtn.onclick = function () {
    let input = document.getElementById('XML_paragraph');
    try {
        var xml = Blockly.Xml.textToDom(input.textContent);
        let blocks_workspace = window.workspace["blockly2"];
        blocks_workspace.clear(); // clear workspace before importing 
        Blockly.Xml.domToWorkspace(xml, blocks_workspace);
    } catch (error) {
        alert('Error parsing XML\n' + error);
    }
}

let span = document.getElementsByClassName("close")[0];  // Get the <span> element that closes the modal
span.onclick = function () { // When the user clicks on <span> (x), close the modal
    modal.style.display = "none";
}
window.onclick = function (event) {  // When the user clicks anywhere outside of the modal, close it
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Modal - Finish

// Breakpoint gutter definition
PythonEditor.on("gutterClick",
    function (editor, n) {
        let info = editor.lineInfo(n);
        let workspace = Blockly.getMainWorkspace();
        let chosen_language = "Python";
        let isMarked = info.gutterMarkers ? true : false;
        setBlockBreakpointFromGutter(workspace, chosen_language, editor.lineInfo(n).text, isMarked);
        editor.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeManualBreakpoint());
    });

function makeManualBreakpoint() {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    return marker;
}

function setBlockBreakpointFromGutter(workspace, language, input_code, isHighlighted) {
    let code_block_mapping = {};
    Blockly[language].variableDB_.setVariableMap(workspace.getVariableMap());
    workspace.getAllBlocks().forEach(function (block) {
        var block_code = '';
        if (block.type === 'procedures_defnoreturn' || block.type === 'procedures_callnoreturn') {
            let func_name = Blockly[language].variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
            block_code = (block.type === 'procedures_defnoreturn') ? 'def ' + func_name : func_name + '()';
        } else {
            block_code = Blockly[language].blockToCode(block);
            if (Array.isArray(block_code)) {
                block_code = Blockly[language].blockToCode(block)[0]; // code string only
            } else {
                block_code = Blockly[language].blockToCode(block).split('\n')[0]; // code string only w/o proceeding blocks
                block_code = block_code.replace(/count[0-9]/g, "count");
            }
        }
        code_block_mapping[block_code] = {
            "block_id": block.id,
            "block": block,
        };
    });

    input_code = input_code.trimStart(); // remove initial whitespaces (common in python)
    if (code_block_mapping[input_code]) {

        let block = code_block_mapping[input_code].block
        // if (block.type === "text_print") 
        // TODO: special case where id is "print"
        // dispatchEvent(new CustomEvent("addBlocklyBreakpointFromGutter", { detail: eventData }));

        if (Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => { return obj.block_id; }).includes(block.id)) { // matching block has breakpoint
            var index = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => { return obj.block_id; }).indexOf(block.id);
            var icon = Blockly_Debugger.actions["Breakpoint"].breakpoints.map((obj) => { if (obj.block_id === block.id) return obj.icon })[index];
            icon.myDisable();
            if (index !== -1) Blockly_Debugger.actions["Breakpoint"].breakpoints.splice(index, 1);
        } else {
            var new_br = {
                "block_id": block.id,
                "enable": true,
                "icon": new Breakpoint_Icon(block),
                "change": false
            }
            Blockly_Debugger.actions["Breakpoint"].breakpoints.push(new_br);
            block.setCollapsed(false);
        }

        // highlight breakpointed block
        if (!isHighlighted) {
            console.log("breakpointing block with $id: " + code_block_mapping[input_code].block_id);
            window.workspace["blockly2"].highlightBlock(code_block_mapping[input_code].block_id);
        } else {
            window.workspace["blockly2"].highlightBlock("");
        }
    } else
        console.log("did not find corresponding block to this code:\n " + input_code);
}

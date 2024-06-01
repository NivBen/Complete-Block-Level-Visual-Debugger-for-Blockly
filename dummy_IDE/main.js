// Breakpoint gutter definition
PythonEditor.on("gutterClick",
    function (editor, n) {
        let info = editor.lineInfo(n);
        let workspace = Blockly.getMainWorkspace();
        let isMarked = info.gutterMarkers ? true : false;
        setBlockBreakpointFromGutter(workspace, "Python", editor.lineInfo(n).text, isMarked);
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
        const eventData = {
            block: code_block_mapping[input_code].block
        };
        dispatchEvent(new CustomEvent("addBlocklyBreakpointFromGutter", { detail: eventData }));
        if (!isHighlighted) {
            console.log("breakpointing block with $id: " + code_block_mapping[input_code].block_id);
            window.workspace["blockly2"].highlightBlock(code_block_mapping[input_code].block_id);
        } else {
            window.workspace["blockly2"].highlightBlock("");
        }
    } else
        console.log("did not find corresponding block to this code:\n " + input_code);
}

// Blockly XML Load Modal - Start
let modal = document.getElementById("XMLModal");

let displayBlocklyBtn = document.getElementById("DisplayBlocklyButton");
displayBlocklyBtn.onclick = function() {
  modal.style.display = "block";
  let blocks_workspace = window.workspace["blockly2"];
  var xml = Blockly.Xml.workspaceToDom(blocks_workspace);
  var xml_text = Blockly.Xml.domToPrettyText(xml);
  let input = document.getElementById("XML_paragraph");
  input.textContent = xml_text;
}

let LoadXMLtoBlocklyBtn = document.getElementById("LoadXMLtoBlocklyButton");
LoadXMLtoBlocklyBtn.onclick = function() {
  let input = document.getElementById('XML_paragraph');
  try {
    var xml = Blockly.Xml.textToDom(input.textContent);
    let blocks_workspace = window.workspace["blockly2"];
    blocks_workspace.clear(); // clear workspace before importing 
    Blockly.Xml.domToWorkspace(xml, blocks_workspace);
  } catch {
      alert('invalid XML text for import');
  }
}

let span = document.getElementsByClassName("close")[0];  // Get the <span> element that closes the modal
let btn = document.getElementById("DisplayBlocklyButton");
span.onclick = function() { // When the user clicks on <span> (x), close the modal
  modal.style.display = "none";
}
window.onclick = function(event) {  // When the user clicks anywhere outside of the modal, close it
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Modal - Finish
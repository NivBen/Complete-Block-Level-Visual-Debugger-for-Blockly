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

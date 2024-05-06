// Breakpoint gutter definition
PythonEditor.on("gutterClick",
    function (cm, n) {
        let info = cm.lineInfo(n);
        let workspace = Blockly.getMainWorkspace();
        let isMarked = info.gutterMarkers ? true : false;
        block_highlight_from_code(workspace, cm.lineInfo(n).text, isMarked);
        cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeManualBreakpoint());
    });

function makeManualBreakpoint() {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    return marker;
}

function block_highlight_from_code(workspace, input_code, isHighlighted) {
    let code_block_mapping = {};
    Blockly.Python.variableDB_.setVariableMap(workspace.getVariableMap());
    workspace.getAllBlocks().forEach(function(block) {
        var block_code = '';
        if(block.type === 'procedures_defnoreturn' || block.type === 'procedures_callnoreturn'){
            let func_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
            block_code = (block.type === 'procedures_defnoreturn') ? 'def ' + func_name : func_name+'()';
        } else {
            block_code = Blockly.Python.blockToCode(block);
            if(Array.isArray(block_code)) {
                block_code = Blockly.Python.blockToCode(block)[0]; // code string only
            } else {
                block_code = Blockly.Python.blockToCode(block).split('\n')[0]; // code string only w/o proceeding blocks
                block_code = block_code.replace(/count[0-9]/g, "count");
            }
        }
        code_block_mapping[block_code] = {
            "block_id": block.id,
        };
    });

    if(code_block_mapping[input_code]){
        if(!isHighlighted) {
            console.log("highlighting block with $id: " + code_block_mapping[input_code].block_id);
            window.workspace["blockly2"].highlightBlock(code_block_mapping[input_code].block_id);
        } else
            window.workspace["blockly2"].highlightBlock("");
    } else
        console.log("did not find corresponding block to this code:\n " + input_code);
}

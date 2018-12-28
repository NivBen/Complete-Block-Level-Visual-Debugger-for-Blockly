!function(t){var e={};function a(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,a),o.l=!0,o.exports}a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},a.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=3)}([,,,function(t,e,a){"use strict";a.r(e);var n=function(){var t,e={};function a(){return void 0!==t}return{Instance:function(){return void 0===t&&(t=new Worker("./dist/debuggee.js"),e.alert=(t=>{window.alert(t),n.Instance().postMessage({type:"alert",data:""})}),e.prompt=(t=>{n.Instance().postMessage({type:"prompt",data:window.prompt(t)})}),e.highlightBlock=(t=>{window.workspace[t.CurrentSystemEditorId].traceOn_=!0,window.workspace[t.CurrentSystemEditorId].highlightBlock(t.id)}),e.execution_finished=(()=>{t=void 0,document.getElementById("val_table").innerHTML=""}),t.onmessage=function(t){let a=t.data,n=a.data;e[a.type](n)}),t},Stop:function(){a()&&(t.terminate(),t=void 0)},AddOnDispacher:function(t,a){e[t]=a},hasInstance:a}}(),o={actions:{}};o.actions.Continue={},o.actions.Continue.handler=(()=>{n.Instance().postMessage({type:"continue"})}),o.actions.StepIn={},o.actions.StepOver={},o.actions.StepParent={},o.actions.StepOut={},o.actions.StepIn.handler=(()=>{n.hasInstance()&&n.Instance().postMessage({type:"stepIn"})}),o.actions.StepOver.handler=(()=>{n.hasInstance()&&n.Instance().postMessage({type:"stepOver"})}),o.actions.StepParent.handler=(()=>{n.hasInstance()&&n.Instance().postMessage({type:"stepParent"})}),o.actions.StepOut.handler=(()=>{n.hasInstance()&&n.Instance().postMessage({type:"stepOut"})}),o.actions.Stop={},o.actions.Stop.handler=(()=>{n.Stop(),document.getElementById("val_table").innerHTML="",o.actions.Breakpoint.breakpoints.map(t=>{o.actions.Breakpoint.reset_view(t.block_id)}),window.workspace.blockly1.traceOn_=!0,window.workspace.blockly1.highlightBlock(""),window.workspace.blockly2.traceOn_=!0,window.workspace.blockly2.highlightBlock("")}),o.actions.Variables={},o.actions.Watch={},o.actions.Eval={},o.actions.Variables=function(){var t=[];return{update:function(e){for(var a=0;a<t.length;++a)t[a].value!==e[a].value?(t[a].value=e[a].value,t[a].change=!0):t[a].change=!1;dispatchEvent(new Event("updateTable"))},getVariables:function(){return t},init:function(){var e=[];e[0]=window.workspace.blockly1.getAllVariables().map(t=>t.name),e[1]=window.workspace.blockly2.getAllVariables().map(t=>t.name);for(var a=0;a<e.length;a++)for(var n=t.map(t=>t.name),o=0;o<e[a].length;++o)if(!n.includes(e[a][o])){var l={name:e[a][o],value:void 0,change:!1};t.push(l)}}}}(),o.actions.Watch=function(){var t=[];return{handler:function(){dispatchEvent(new Event("updateWatchesTable")),n.hasInstance()&&n.Instance().postMessage({type:"watch",data:t})},update:function(e){for(var a=0;a<t.length;++a)t[a].value!==e[a].value?(t[a].value=e[a].value,t[a].change=!0):t[a].change=!1;dispatchEvent(new Event("updateWatchesTable"))},getWatches:function(){return t},init:function(){for(var e=0;e<t.length;++e)t[e].value=void 0}}}(),o.actions.Eval.handler=function(t){n.hasInstance()&&n.Instance().postMessage({type:"eval",data:t})},n.AddOnDispacher("watches",o.actions.Watch.update),n.AddOnDispacher("variables",o.actions.Variables.update),o.actions.Start={},o.actions.Start.handler=(t=>{if(!n.hasInstance()){Blockly.JavaScript.STATEMENT_PREFIX="await $id(%1, 0);\n";var e=Blockly.JavaScript.workspaceToCode(window.workspace.blockly1),a=Blockly.JavaScript.workspaceToCode(window.workspace.blockly2),l=e+a;o.actions.Variables.init(),o.actions.Watch.init(),document.getElementById("val_table").innerHTML='  <div class="watch">\n                                                            <div class="title">&nbsp;Variables  \n                                                            \x3c!--i class="fa fa-bars"></i--\x3e\n                                                            </div>\n                                                            <div class="watch-content">\n                                                            <table style="width:100%">\n                                                            <tr>\n                                                                <th>Name</th>\n                                                                <th>Value</th> \n                                                                <th>Type</th>\n                                                            </tr>     \n\n                                                            </table>\n                                                            <table id="variables" style="width:100%"></table>\n                                                        </div>\n                                                        </div>\n\n                                                        <div class="watch">\n                                                            <div class="title">&nbsp;Watches</div>\n                                                            <div class="watch-content">\n                                                            <table style="width:100%">\n                                                            <tr>\n                                                                <th>Name</th>\n                                                                <th>Code</th> \n                                                                <th>Value</th>\n                                                                <th>Type</th>\n                                                            </tr>     \n                                                            </table>\n                                                            <table id="watches" style="width:100%"></table>\n                                                        </div>\n                                                        </div>',t instanceof MouseEvent&&(t=""),n.Instance().postMessage({type:"start_debugging",data:{code:l,breakpoints:o.actions.Breakpoint.breakpoints.map(t=>({block_id:t.block_id,enable:t.enable})),cursorBreakpoint:t,watches:o.actions.Watch.getWatches(),variables:o.actions.Variables.getVariables()}}),console.log(e+a)}}),o.actions.Breakpoint={},o.actions.RunToCursor={},o.actions.Breakpoint.breakpoints=[],o.actions.Breakpoint.handler=(()=>{n.hasInstance()&&n.Instance().postMessage({type:"breakpoint",data:o.actions.Breakpoint.breakpoints.map(t=>({block_id:t.block_id,enable:t.enable}))})}),o.actions.Breakpoint.wait_view=(t=>{for(var e=window.workspace.blockly1.getBlockById(t)?"blockly1":"blockly2",a=window.workspace[e].getBlockById(t);null!=a;)a.setCollapsed(!1),a=a.parentBlock_;window.workspace[e].traceOn_=!0,window.workspace[e].highlightBlock(t),document.getElementById(t).style.stroke="red",document.getElementById(t).style.fill="yellow",document.getElementById(t).style["stroke-width"]="5px"}),o.actions.Breakpoint.reset_view=(t=>{document.getElementById(t).style.stroke="yellow",document.getElementById(t).style.fill="red",document.getElementById(t).style["stroke-width"]="1px"}),o.actions.Breakpoint.disable=(t=>{var e=o.actions.Breakpoint.breakpoints.map(t=>t.block_id).indexOf(t);-1!=e&&(document.getElementById(t).style.stroke="yellow",document.getElementById(t).style.fill="#FA8258",document.getElementById(t).style["stroke-width"]="1px",o.actions.Breakpoint.breakpoints[e].enable=!1,n.hasInstance()&&n.Instance().postMessage({type:"breakpoint",data:o.actions.Breakpoint.breakpoints.map(t=>({block_id:t.block_id,enable:t.enable}))}))}),o.actions.Breakpoint.enable=(t=>{var e=o.actions.Breakpoint.breakpoints.map(t=>t.block_id).indexOf(t);-1!=e&&(document.getElementById(t).style.fill="red",o.actions.Breakpoint.breakpoints[e].enable=!0,n.hasInstance()&&n.Instance().postMessage({type:"breakpoint",data:o.actions.Breakpoint.breakpoints.map(t=>({block_id:t.block_id,enable:t.enable}))}))}),o.actions.RunToCursor.handler=(t=>{n.hasInstance()?n.Instance().postMessage({type:"runToCursor",data:t}):o.actions.Start.handler(t)}),n.AddOnDispacher("breakpoint_wait_view",o.actions.Breakpoint.wait_view),n.AddOnDispacher("breakpoint_reset_view",o.actions.Breakpoint.reset_view);var l={nest:-1,currentSystemEditorId:null};Blockly.JavaScript.lists_length=function(t){return["("+(Blockly.JavaScript.valueToCode(t,"VALUE",Blockly.JavaScript.ORDER_MEMBER)||"[]")+").length",Blockly.JavaScript.ORDER_MEMBER]},Blockly.JavaScript.lists_isEmpty=function(t){return["!("+(Blockly.JavaScript.valueToCode(t,"VALUE",Blockly.JavaScript.ORDER_MEMBER)||"[]")+").length",Blockly.JavaScript.ORDER_LOGICAL_NOT]},Blockly.JavaScript.lists_indexOf=function(t){var e="FIRST"==t.getFieldValue("END")?"indexOf":"lastIndexOf",a=Blockly.JavaScript.valueToCode(t,"FIND",Blockly.JavaScript.ORDER_NONE)||"''",n="("+(Blockly.JavaScript.valueToCode(t,"VALUE",Blockly.JavaScript.ORDER_MEMBER)||"[]")+")."+e+"("+a+")";return t.workspace.options.oneBasedIndex?[n+" + 1",Blockly.JavaScript.ORDER_ADDITION]:[n,Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.lists_getIndex=function(t){var e=t.getFieldValue("MODE")||"GET",a=t.getFieldValue("WHERE")||"FROM_START",n="RANDOM"==a?Blockly.JavaScript.ORDER_COMMA:Blockly.JavaScript.ORDER_MEMBER,o=Blockly.JavaScript.valueToCode(t,"VALUE",n)||"[]";switch(o="("+o+")",a){case"FIRST":if("GET"==e)return[c=o+"[0]",Blockly.JavaScript.ORDER_MEMBER];if("GET_REMOVE"==e)return[c=o+".shift()",Blockly.JavaScript.ORDER_MEMBER];if("REMOVE"==e)return o+".shift();\n";break;case"LAST":if("GET"==e)return[c=o+".slice(-1)[0]",Blockly.JavaScript.ORDER_MEMBER];if("GET_REMOVE"==e)return[c=o+".pop()",Blockly.JavaScript.ORDER_MEMBER];if("REMOVE"==e)return o+".pop();\n";break;case"FROM_START":var l=Blockly.JavaScript.getAdjusted(t,"AT");if("GET"==e)return[c=o+"["+l+"]",Blockly.JavaScript.ORDER_MEMBER];if("GET_REMOVE"==e)return[c=o+".splice("+l+", 1)[0]",Blockly.JavaScript.ORDER_FUNCTION_CALL];if("REMOVE"==e)return o+".splice("+l+", 1);\n";break;case"FROM_END":var c;l=Blockly.JavaScript.getAdjusted(t,"AT",1,!0);if("GET"==e)return[c=o+".slice("+l+")[0]",Blockly.JavaScript.ORDER_FUNCTION_CALL];if("GET_REMOVE"==e)return[c=o+".splice("+l+", 1)[0]",Blockly.JavaScript.ORDER_FUNCTION_CALL];if("REMOVE"==e)return o+".splice("+l+", 1);";break;case"RANDOM":if(c=Blockly.JavaScript.provideFunction_("listsGetRandomItem",["function "+Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_+"(list, remove) {","  var x = Math.floor(Math.random() * list.length);","  if (remove) {","    return list.splice(x, 1)[0];","  } else {","    return list[x];","  }","}"])+"("+o+", "+("GET"!=e)+")","GET"==e||"GET_REMOVE"==e)return[c,Blockly.JavaScript.ORDER_FUNCTION_CALL];if("REMOVE"==e)return c+";\n"}throw"Unhandled combination (lists_getIndex)."},Blockly.JavaScript.lists_setIndex=function(t){var e=Blockly.JavaScript.valueToCode(t,"LIST",Blockly.JavaScript.ORDER_MEMBER)||"[]",a=t.getFieldValue("MODE")||"GET",n=t.getFieldValue("WHERE")||"FROM_START",o=Blockly.JavaScript.valueToCode(t,"TO",Blockly.JavaScript.ORDER_ASSIGNMENT)||"null";function l(){if(e.match(/^\w+$/))return"";var t=Blockly.JavaScript.variableDB_.getDistinctName("tmpList",Blockly.Variables.NAME_TYPE),a="var "+t+" = "+e+";\n";return e=t,a}switch(e="("+e+")",n){case"FIRST":if("SET"==a)return e+"[0] = "+o+";\n";if("INSERT"==a)return e+".unshift("+o+");\n";break;case"LAST":if("SET"==a){var c=l();return c+=e+"["+e+".length - 1] = "+o+";\n"}if("INSERT"==a)return e+".push("+o+");\n";break;case"FROM_START":var i=Blockly.JavaScript.getAdjusted(t,"AT");if("SET"==a)return e+"["+i+"] = "+o+";\n";if("INSERT"==a)return e+".splice("+i+", 0, "+o+");\n";break;case"FROM_END":i=Blockly.JavaScript.getAdjusted(t,"AT",1,!1,Blockly.JavaScript.ORDER_SUBTRACTION),c=l();if("SET"==a)return c+=e+"["+e+".length - "+i+"] = "+o+";\n";if("INSERT"==a)return c+=e+".splice("+e+".length - "+i+", 0, "+o+");\n";break;case"RANDOM":c=l();var r=Blockly.JavaScript.variableDB_.getDistinctName("tmpX",Blockly.Variables.NAME_TYPE);if(c+="var "+r+" = Math.floor(Math.random() * "+e+".length);\n","SET"==a)return c+=e+"["+r+"] = "+o+";\n";if("INSERT"==a)return c+=e+".splice("+r+", 0, "+o+");\n"}throw"Unhandled combination (lists_setIndex)."},Blockly.JavaScript.lists_split=function(t){var e=Blockly.JavaScript.valueToCode(t,"INPUT",Blockly.JavaScript.ORDER_MEMBER),a=Blockly.JavaScript.valueToCode(t,"DELIM",Blockly.JavaScript.ORDER_NONE)||"''",n=t.getFieldValue("MODE");if("SPLIT"==n){e||(e="''");var o="split"}else{if("JOIN"!=n)throw"Unknown mode: "+n;e||(e="[]");o="join"}return["("+e+")."+o+"("+a+")",Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.lists_reverse=function(t){return["("+(Blockly.JavaScript.valueToCode(t,"LIST",Blockly.JavaScript.ORDER_FUNCTION_CALL)||"[]")+").slice().reverse()",Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.lists_sort=function(t){var e=Blockly.JavaScript.valueToCode(t,"LIST",Blockly.JavaScript.ORDER_FUNCTION_CALL)||"[]",a="1"===t.getFieldValue("DIRECTION")?1:-1,n=t.getFieldValue("TYPE");return["("+e+").slice().sort("+Blockly.JavaScript.provideFunction_("listsGetSortCompare",["function "+Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_+"(type, direction) {","  var compareFuncs = {",'    "NUMERIC": function(a, b) {',"        return parseFloat(a) - parseFloat(b); },",'    "TEXT": function(a, b) {',"        return a.toString() > b.toString() ? 1 : -1; },",'    "IGNORE_CASE": function(a, b) {',"        return a.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : -1; },","  };","  var compare = compareFuncs[type];","  return function(a, b) { return compare(a, b) * direction; }","}"])+'("'+n+'", '+a+"))",Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.procedures_defreturn=function(t){var e=Blockly.JavaScript.variableDB_.getName(t.getFieldValue("NAME"),Blockly.Procedures.NAME_TYPE),a=Blockly.JavaScript.statementToCode(t,"STACK");if(Blockly.JavaScript.STATEMENT_PREFIX){var n=t.id.replace(/\$/g,"$$$$");a=Blockly.JavaScript.prefixLines(Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,"eval(update_values()), await wait(0, '"+n+"', '"+l.currentSystemEditorId+"')"),Blockly.JavaScript.INDENT)+a}Blockly.JavaScript.INFINITE_LOOP_TRAP&&(a=Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,"'"+t.id+"'")+a);var o=Blockly.JavaScript.valueToCode(t,"RETURN",Blockly.JavaScript.ORDER_NONE)||"";o=o?"  return Blockly_Debuggee.function_return_decorator("+o+", caller_nest);\n":"  return Blockly_Debuggee.function_return_decorator( '', caller_nest);\n";for(var c=[],i=0;i<t.arguments_.length;i++)c[i]=Blockly.JavaScript.variableDB_.getName(t.arguments_[i],Blockly.Variables.NAME_TYPE);var r="async function "+e+"("+c.join(", ")+") {\n  let caller_nest = Blockly_Debuggee.state.currNest;\n  if(isStepOver() || isStepParent()) Blockly_Debuggee.state.currNest = -1;\n"+a+o+"}";return r=Blockly.JavaScript.scrub_(t,r),Blockly.JavaScript.definitions_["%"+e]=r,null},Blockly.JavaScript.procedures_defnoreturn=Blockly.JavaScript.procedures_defreturn,Blockly.JavaScript.procedures_callreturn=function(t){for(var e=Blockly.JavaScript.variableDB_.getName(t.getFieldValue("NAME"),Blockly.Procedures.NAME_TYPE),a=[],n=0;n<t.arguments_.length;n++)a[n]=Blockly.JavaScript.valueToCode(t,"ARG"+n,Blockly.JavaScript.ORDER_COMMA)||"null";return["await "+e+"("+a.join(", ")+")",Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.procedures_callnoreturn=function(t){for(var e=Blockly.JavaScript.variableDB_.getName(t.getFieldValue("NAME"),Blockly.Procedures.NAME_TYPE),a=[],n=0;n<t.arguments_.length;n++)a[n]=Blockly.JavaScript.valueToCode(t,"ARG"+n,Blockly.JavaScript.ORDER_COMMA)||"null";return"await "+e+"("+a.join(", ")+");\n"},Blockly.JavaScript.procedures_ifreturn=function(t){var e="if ("+(Blockly.JavaScript.valueToCode(t,"CONDITION",Blockly.JavaScript.ORDER_NONE)||"false")+") {\n";t.hasReturnValue_?e+="  return Blockly_Debuggee.function_return_decorator("+(Blockly.JavaScript.valueToCode(t,"VALUE",Blockly.JavaScript.ORDER_NONE)||"null")+", caller_nest);\n":e+="  return Blockly_Debuggee.function_return_decorator('', caller_nest);\n";return e+="}\n"};a(6);Blockly.Generator.prototype.blockToCode=function(t){if(!t)return"";if(t.disabled)return this.blockToCode(t.getNextBlock());var e=this[t.type];goog.asserts.assertFunction(e,'Language "%s" does not know how to generate code for block type "%s".',this.name_,t.type);var a=++l.nest,n=e.call(t,t);if(l.nest--,goog.isArray(n))return goog.asserts.assert(t.outputConnection,//!! New blockly 
'Expecting string from statement block "%s".',t.type),this.STATEMENT_PREFIX&&(n[0]="await $id(eval(update_values()), await wait("+a+", '"+t.id+"', '"+l.currentSystemEditorId+"'), "+n[0]+")"),[this.scrub_(t,n[0]),n[1]];if(goog.isString(n)){t.id.replace(/\$/g,"$$$$");return this.STATEMENT_PREFIX&&(n=this.STATEMENT_PREFIX.replace(/%1/g,"eval(update_values()), await wait("+a+", '"+t.id+"', '"+l.currentSystemEditorId+"') ")+n),this.scrub_(t,n)}if(null===n)return"";goog.asserts.fail("Invalid code generated: %s",n)},Blockly.Generator.prototype.addLoopTrap=function(t,e){return e=e.replace(/\$/g,"$$$$"),this.INFINITE_LOOP_TRAP&&(t=this.INFINITE_LOOP_TRAP.replace(/%1/g,"'"+e+"'")+t),this.STATEMENT_PREFIX&&(t+=this.prefixLines(this.STATEMENT_PREFIX.replace(/%1/g,"eval(update_values()), await wait("+l.nest+", '"+e+"', '"+l.currentSystemEditorId+"')"),this.INDENT)),t},Blockly.Generator.prototype.workspaceToCode=function(t){t||(console.warn("No workspace specified in workspaceToCode call.  Guessing."),t=Blockly.getMainWorkspace());var e=[];this.init(t);var a=t.getTopBlocks(!0);l.currentSystemEditorId=t.systemEditorId;var n="\n// start source code of another editor\n";e.push(n);for(var o,c=0;o=a[c];c++)n=this.blockToCode(o),goog.isArray(n)&&(n=n[0]),n&&(o.outputConnection&&this.scrubNakedValue&&(n=this.scrubNakedValue(n)),e.push(n));return e=e.join("\n"),e=(e=(e=(e=this.finish(e)).replace(/^\s+\n/,"")).replace(/\n\s+$/,"\n")).replace(/[ \t]+\n/g,"\n")},Blockly.Generator.prototype.myBlockToCode=function(t){if(!t||t.disabled)return"";this.init(t.workspace);var e=this[t.type],a=this.STATEMENT_PREFIX;this.STATEMENT_PREFIX=null,goog.asserts.assertFunction(e,'Language "%s" does not know how to generate code for block type "%s".',this.name_,t.type);var n=e.call(t,t);return goog.isArray(n)?(goog.asserts.assert(t.outputConnection,'Expecting string from statement block "%s".',t.type),this.STATEMENT_PREFIX=a,this.myscrub_(t,n[0])):goog.isString(n)?(this.STATEMENT_PREFIX=a,this.myscrub_(t,n)):null===n?(this.STATEMENT_PREFIX=a,""):void goog.asserts.fail("Invalid code generated: %s",n)},Blockly.JavaScript.myscrub_=function(t,e){var a="";if(!t.outputConnection||!t.outputConnection.targetConnection){var n=t.getCommentText();(n=Blockly.utils.wrap(n,Blockly.JavaScript.COMMENT_WRAP-3))&&(a=t.getProcedureDef?a+"/**\n"+Blockly.JavaScript.prefixLines(n+"\n"," * ")+" */\n":a+Blockly.JavaScript.prefixLines(n+"\n","// "));for(var o=0;o<t.inputList.length;o++)t.inputList[o].type==Blockly.INPUT_VALUE&&(n=t.inputList[o].connection.targetBlock())&&(n=Blockly.JavaScript.allNestedComments(n))&&(a+=Blockly.JavaScript.prefixLines(n,"// "))}return a+e},Blockly.JavaScript.finish=function(t){var e,a=[];for(e in Blockly.JavaScript.definitions_)"variables"!==e&&a.push(Blockly.JavaScript.definitions_[e]);return delete Blockly.JavaScript.definitions_,delete Blockly.JavaScript.functionNames_,Blockly.JavaScript.variableDB_.reset(),a.join("\n\n")+"\n\n\n"+t},Blockly.JavaScript.scrubNakedValue=function(t){return t+";\n"},Blockly.JavaScript.quote_=function(t){return"'"+(t=t.replace(/\\/g,"\\\\").replace(/\n/g,"\\\n").replace(/'/g,"\\'"))+"'"};var c=function(t){Blockly.Icon.call(this,t),this.createIcon()};(c.prototype=Object.create(Blockly.Icon.prototype)).width_=160,c.prototype.height_=80,c.prototype.drawIcon_=function(t){Blockly.utils.createSvgElement("circle",{class:"breakpoint_enable",id:this.block_.id,r:"6",cx:"8",cy:"8"},t)},c.prototype.setVisible=function(t){var e=o.actions.Breakpoint.breakpoints.map(t=>{if(t.block_id==this.block_.id)return t.enable});if(console.log(e),e[0])o.actions.Breakpoint.disable(this.block_.id);else{this.myDisable();var a=o.actions.Breakpoint.breakpoints.map(t=>t.block_id).indexOf(this.block_.id);-1!==a&&o.actions.Breakpoint.breakpoints.splice(a,1)}},c.prototype.myDisable=function(){goog.dom.removeNode(this.iconGroup_),this.iconGroup_=null},Blockly.utils.createSvgElement=function(t,e,a){for(var n in t=document.createElementNS(Blockly.SVG_NS,t),e)t.setAttribute(n,e[n]);return document.body.runtimeStyle&&(t.runtimeStyle=t.currentStyle=t.style),a&&a.appendChild(t),t},Blockly.BlockSvg.prototype.showContextMenu_=function(t){if(!this.workspace.options.readOnly&&this.contextMenu){var e=this,a=[];if(this.isDeletable()&&this.isMovable()&&!e.isInFlyout){if(a.push(Blockly.ContextMenu.blockDuplicateOption(e)),this.isEditable()&&!this.collapsed_&&this.workspace.options.comments&&a.push(Blockly.ContextMenu.blockCommentOption(e)),!this.collapsed_)for(var l=1;l<this.inputList.length;l++)if(this.inputList[l-1].type!=Blockly.NEXT_STATEMENT&&this.inputList[l].type!=Blockly.NEXT_STATEMENT){var i={enabled:!0},r=this.getInputsInline();i.text=r?Blockly.Msg.EXTERNAL_INPUTS:Blockly.Msg.INLINE_INPUTS,i.callback=function(){e.setInputsInline(!r)},a.push(i);break}if(this.workspace.options.collapse)if(this.collapsed_){var s={enabled:!0};s.text=Blockly.Msg.EXPAND_BLOCK,s.callback=function(){e.setCollapsed(!1)},a.push(s)}else{var p={enabled:!0};p.text=Blockly.Msg.COLLAPSE_BLOCK,p.callback=function(){e.setCollapsed(!0)},a.push(p)}if(this.workspace.options.disable){var u={text:this.disabled?Blockly.Msg.ENABLE_BLOCK:Blockly.Msg.DISABLE_BLOCK,enabled:!this.getInheritedDisabled(),callback:function(){e.setDisabled(!e.disabled)}};a.push(u)}a.push(Blockly.ContextMenu.blockDeleteOption(e));var d={text:o.actions.Breakpoint.breakpoints.map(t=>t.block_id).includes(e.id)?"Remove Breakpoint":"Add Breakpoint",enabled:!0,callback:function(){if(o.actions.Breakpoint.breakpoints.map(t=>t.block_id).includes(e.id)){o.actions.Breakpoint.breakpoints.map(t=>{if(t.block_id===e.id)return t.icon})[0].myDisable();var t=o.actions.Breakpoint.breakpoints.map(t=>t.block_id).indexOf(e.id);-1!==t&&o.actions.Breakpoint.breakpoints.splice(t,1)}else{var a={block_id:e.id,enable:!0,icon:new c(e),change:!1};o.actions.Breakpoint.breakpoints.push(a),e.setCollapsed(!1)}o.actions.Breakpoint.handler()}};a.push(d);var k={text:o.actions.Breakpoint.breakpoints.map(t=>{if(t.enable)return t.block_id}).includes(e.id)?"Disable Breakpoint":"Enable Breakpoint",enabled:!!o.actions.Breakpoint.breakpoints.map(t=>t.block_id).includes(e.id),callback:function(){o.actions.Breakpoint.breakpoints.map(t=>{if(t.enable)return t.block_id}).includes(e.id)?o.actions.Breakpoint.disable(e.id):o.actions.Breakpoint.enable(e.id)}};a.push(k);var v={text:"Run to cursor",enabled:!0,callback:function(){o.actions.RunToCursor.handler(e.id)}};if(a.push(v),n.hasInstance()){var y={text:o.actions.Watch.getWatches().map(t=>t.name).includes(e.toString())?"Remove Watch":"Add Watch",enabled:null!=e.outputConnection,callback:function(){var t=e.toString();if(o.actions.Watch.getWatches().map(t=>t.name).includes(t)){var a=o.actions.Watch.getWatches().map(t=>t.name).indexOf(t);-1!==a&&o.actions.Watch.getWatches().splice(a,1)}else{var n={name:t,code:Blockly.JavaScript.myBlockToCode(e),value:void 0};o.actions.Watch.getWatches().push(n)}o.actions.Watch.handler()}};a.push(y);var E={text:"Evaluate",enabled:"variables_set"===e.type||"math_change"===e.type,callback:function(){o.actions.Eval.handler(Blockly.JavaScript.myBlockToCode(e))}};a.push(E)}}var B={text:"block___",enabled:!0,callback:function(){console.log(e)}};a.push(B),a.push(Blockly.ContextMenu.blockHelpOption(e)),this.customContextMenu&&this.customContextMenu(a),Blockly.ContextMenu.show(t,a,this.RTL),Blockly.ContextMenu.currentBlock=this}};a(5);addEventListener("updateTable",function(){let t=o.actions.Variables.getVariables();document.getElementById("variables").innerHTML="";for(var e=0;e<t.length;++e){var a="";!0===t[e].change&&(a='style="color:red;"'),document.getElementById("variables").innerHTML+="<tr>\n                                                            <td "+a+">"+t[e].name+"</td>\n                                                            <td "+a+">"+t[e].value+"</td>\n                                                            <td "+a+">"+typeof t[e].value+"</td>\n                                                          </tr>"}}),addEventListener("updateWatchesTable",function(){let t=o.actions.Watch.getWatches();document.getElementById("watches").innerHTML="";for(var e=0;e<t.length;++e){var a="";!0===t[e].change&&(a='style="color:red;"'),document.getElementById("watches").innerHTML+="<tr>\n                                                            <td "+a+">"+t[e].name+"</td>\n                                                            <td "+a+">"+t[e].code+"</td>\n                                                            <td "+a+">"+t[e].value+"</td>\n                                                            <td "+a+">"+typeof t[e].value+"</td>\n                                                        </tr>"}}),window.workspace={},window.workspace.blockly1=Blockly.inject("blocklyDiv",{media:"../../media/",toolbox:document.getElementById("toolbox")}),window.workspace.blockly1.systemEditorId="blockly1",Blockly.Xml.domToWorkspace(document.getElementById("startBlocks"),window.workspace.blockly1),window.workspace.blockly2=Blockly.inject("blocklyDiv2",{media:"../../media/",toolbox:document.getElementById("toolbox")}),window.workspace.blockly2.systemEditorId="blockly2",Blockly.Xml.domToWorkspace(document.getElementById("startBlocks"),window.workspace.blockly2),document.getElementById("ContinueButton").onclick=o.actions.Continue.handler,document.getElementById("StepInButton").onclick=o.actions.StepIn.handler,document.getElementById("StepOverButton").onclick=o.actions.StepOver.handler,document.getElementById("StepParentButton").onclick=o.actions.StepParent.handler,document.getElementById("StepOutButton").onclick=o.actions.StepOut.handler,document.getElementById("StopButton").onclick=o.actions.Stop.handler,document.getElementById("StartButton").onclick=o.actions.Start.handler},,function(t,e){Blockly.Block.prototype.toString=function(t,e){var a=[],n=e||"?";if(this.collapsed_)a.push(this.getInput("_TEMP_COLLAPSED_INPUT").fieldRow[0].text_);else for(var o,l=0;o=this.inputList[l];l++){for(var c,i=0;c=o.fieldRow[i];i++)c instanceof Blockly.FieldDropdown&&!c.getValue()?a.push(n):a.push(c.getText());if(o.connection){var r=o.connection.targetBlock();if(r){var s=r.toString(void 0,e);s="("+s+")",a.push(s)}else a.push(n)}}return a=goog.string.trim(a.join(" "))||"???",t&&(a=goog.string.truncate(a,t)),a}},function(t,e){Blockly.JavaScript.text_length=function(t){return["("+(Blockly.JavaScript.valueToCode(t,"VALUE",Blockly.JavaScript.ORDER_FUNCTION_CALL)||"''")+").length",Blockly.JavaScript.ORDER_MEMBER]},Blockly.JavaScript.text_isEmpty=function(t){return["!("+(Blockly.JavaScript.valueToCode(t,"VALUE",Blockly.JavaScript.ORDER_MEMBER)||"''")+").length",Blockly.JavaScript.ORDER_LOGICAL_NOT]},Blockly.JavaScript.text_indexOf=function(t){var e="FIRST"==t.getFieldValue("END")?"indexOf":"lastIndexOf",a=Blockly.JavaScript.valueToCode(t,"FIND",Blockly.JavaScript.ORDER_NONE)||"''",n="("+(Blockly.JavaScript.valueToCode(t,"VALUE",Blockly.JavaScript.ORDER_MEMBER)||"''")+")."+e+"("+a+")";return t.workspace.options.oneBasedIndex?[n+" + 1",Blockly.JavaScript.ORDER_ADDITION]:[n,Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.text_charAt=function(t){var e=t.getFieldValue("WHERE")||"FROM_START",a="RANDOM"==e?Blockly.JavaScript.ORDER_NONE:Blockly.JavaScript.ORDER_MEMBER,n=Blockly.JavaScript.valueToCode(t,"VALUE",a)||"''";switch(n="("+n+")",e){case"FIRST":return[n+".charAt(0)",Blockly.JavaScript.ORDER_FUNCTION_CALL];case"LAST":return[n+".slice(-1)",Blockly.JavaScript.ORDER_FUNCTION_CALL];case"FROM_START":return[n+".charAt("+Blockly.JavaScript.getAdjusted(t,"AT")+")",Blockly.JavaScript.ORDER_FUNCTION_CALL];case"FROM_END":return[n+".slice("+Blockly.JavaScript.getAdjusted(t,"AT",1,!0)+").charAt(0)",Blockly.JavaScript.ORDER_FUNCTION_CALL];case"RANDOM":return[Blockly.JavaScript.provideFunction_("textRandomLetter",["function "+Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_+"(text) {","  var x = Math.floor(Math.random() * text.length);","  return text[x];","}"])+"("+n+")",Blockly.JavaScript.ORDER_FUNCTION_CALL]}throw"Unhandled option (text_charAt)."},Blockly.JavaScript.text_getSubstring=function(t){var e=Blockly.JavaScript.valueToCode(t,"STRING",Blockly.JavaScript.ORDER_FUNCTION_CALL)||"''",a=t.getFieldValue("WHERE1"),n=t.getFieldValue("WHERE2");if("FIRST"==a&&"LAST"==n)var o=e;else if(e.match(/^'?\w+'?$/)||"FROM_END"!=a&&"LAST"!=a&&"FROM_END"!=n&&"LAST"!=n){switch(e="("+e+")",a){case"FROM_START":var l=Blockly.JavaScript.getAdjusted(t,"AT1");break;case"FROM_END":l=e+".length - "+(l=Blockly.JavaScript.getAdjusted(t,"AT1",1,!1,Blockly.JavaScript.ORDER_SUBTRACTION));break;case"FIRST":l="0";break;default:throw"Unhandled option (text_getSubstring)."}switch(n){case"FROM_START":var c=Blockly.JavaScript.getAdjusted(t,"AT2",1);break;case"FROM_END":c=e+".length - "+(c=Blockly.JavaScript.getAdjusted(t,"AT2",0,!1,Blockly.JavaScript.ORDER_SUBTRACTION));break;case"LAST":c=e+".length";break;default:throw"Unhandled option (text_getSubstring)."}o=e+".slice("+l+", "+c+")"}else{e="("+e+")";l=Blockly.JavaScript.getAdjusted(t,"AT1"),c=Blockly.JavaScript.getAdjusted(t,"AT2");var i=Blockly.JavaScript.text.getIndex_,r={FIRST:"First",LAST:"Last",FROM_START:"FromStart",FROM_END:"FromEnd"};o=Blockly.JavaScript.provideFunction_("subsequence"+r[a]+r[n],["function "+Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_+"(sequence"+("FROM_END"==a||"FROM_START"==a?", at1":"")+("FROM_END"==n||"FROM_START"==n?", at2":"")+") {","  var start = "+i("sequence",a,"at1")+";","  var end = "+i("sequence",n,"at2")+" + 1;","  return sequence.slice(start, end);","}"])+"("+e+("FROM_END"==a||"FROM_START"==a?", "+l:"")+("FROM_END"==n||"FROM_START"==n?", "+c:"")+")"}return[o,Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.text_changeCase=function(t){var e={UPPERCASE:".toUpperCase()",LOWERCASE:".toLowerCase()",TITLECASE:null}[t.getFieldValue("CASE")],a=e?Blockly.JavaScript.ORDER_MEMBER:Blockly.JavaScript.ORDER_NONE,n=Blockly.JavaScript.valueToCode(t,"TEXT",a)||"''";if(e)var o="("+n+")"+e;else o=Blockly.JavaScript.provideFunction_("textToTitleCase",["function "+Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_+"(str) {","  return str.replace(/\\S+/g,","      function(txt) {return txt[0].toUpperCase() + txt.substring(1).toLowerCase();});","}"])+"(("+n+"))";return[o,Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.text_trim=function(t){var e={LEFT:".replace(/^[\\s\\xa0]+/, '')",RIGHT:".replace(/[\\s\\xa0]+$/, '')",BOTH:".trim()"}[t.getFieldValue("MODE")];return["("+(Blockly.JavaScript.valueToCode(t,"TEXT",Blockly.JavaScript.ORDER_MEMBER)||"''")+")"+e,Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.text_prompt_ext=function(t){if(t.getField("TEXT"))var e=Blockly.JavaScript.quote_(t.getFieldValue("TEXT"));else e=Blockly.JavaScript.valueToCode(t,"TEXT",Blockly.JavaScript.ORDER_NONE)||"''";var a="(await window.prompt("+e+"))";return"NUMBER"==t.getFieldValue("TYPE")&&(a="parseFloat("+a+")"),[a,Blockly.JavaScript.ORDER_FUNCTION_CALL]},Blockly.JavaScript.text_prompt=Blockly.JavaScript.text_prompt_ext,Blockly.JavaScript.text_print=function(t){return"await window.alert("+(Blockly.JavaScript.valueToCode(t,"TEXT",Blockly.JavaScript.ORDER_NONE)||"''")+");\n"}}]);
//# sourceMappingURL=bundle.js.map
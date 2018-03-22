if(!window.INIT_SCRIPT){$('head').prepend("<script src='/scripts/init.js'></script>");}
var jhmvcUID=0;controlTypes={};function getUID(){return window.jhmvcUID++;}
function dummyFunc(){};function extend(Child,Parent){var F=function(){};F.prototype=Parent.prototype;Child.prototype=new F();Child.prototype.constructor=Child;Child.superclass=Parent.prototype;Child.prototype.getAncestry=function(){arr=Child.superclass.getAncestry();arr.push(Child);return arr;}
if(!Parent.superclass)Parent.prototype.getAncestry=function(){return[Parent];}}
function no(){for(var i=0;i<arguments.length;i++){val=arguments[i];if(val==undefined||val==null)return true;}
return false}
function sprintf(){var iCount,iPadLength,aMatch,iMatchIndex=1;var bAlignLeft,sPad,iWidth,iPrecision,sType;var aArgs=sprintf.arguments;if(aArgs.length<2)return'';var sFormat=aArgs[0];var re=/%(-)?(0| |'.)?(\d+)?(\.\d*)?([bcdfosxX]{1})/;var i;while(re.test(sFormat)){aMatch=re.exec(sFormat);for(i=0;i<aMatch.length;i++){aMatch[i]=aMatch[i]?aMatch[i]:"";}
bAlignLeft=(aMatch[1]=='-');sPad=(aMatch[2]==''?' ':aMatch[2]);if(sPad.substring(0,1)=="'")sPad=sPad.substring(1);sPad="";iWidth=(aMatch[3]>0?parseInt(aMatch[3]):0);sType=aMatch[5];mArgument=(aArgs[iMatchIndex]!=null?aArgs[iMatchIndex]:'');++iMatchIndex;if(mArgument.toString().length){if('fbcdoxX'.indexOf(sType)!=-1&&isNaN(mArgument))mArgument=0;switch(sType){case'f':var iPower=Math.pow(10,iPrecision);mArgument=(Math.round(parseFloat(mArgument)*iPower)/iPower).toString();var aFloatParts=mArgument.split('.');iPrecision=(aMatch[4].length>1?parseInt(aMatch[4].substring(1)):6);if(iPrecision>0){if(aFloatParts.length==1)aFloatParts[1]='';for(iCount=aFloatParts[1].length;iCount<iPrecision;iCount++)
aFloatParts[1]+='0';mArgument=aFloatParts[0]+'.'+aFloatParts[1];}else mArgument=aFloatParts[0];iPadLength=aFloatParts[0].length;break;case'b':mArgument=parseInt(mArgument).toString(2);iPadLength=mArgument.length;break;case'c':mArgument=String.fromCharCode(parseInt(mArgument));break;case'd':mArgument=mArgument.toString();iPadLength=mArgument.length;break;case'o':mArgument=parseInt(mArgument).toString(8);iPadLength=mArgument.length;break;case'x':mArgument=parseInt(mArgument).toString(16);iPadLength=mArgument.length;break;case'X':mArgument=parseInt(mArgument).toString(16).toUpperCase();iPadLength=mArgument.length;break;default:mArgument=mArgument.toString();iPadLength=mArgument.length;}
if(sType=='b'||sType=='d'||sType=='o'||sType=='x'||sType=='X'){iPrecision=(aMatch[4].length>1?parseInt(aMatch[4].substring(1)):1);if(iPrecision>mArgument.length){zeros="";for(i=0;i<(iPrecision-mArgument.length);i++){zeros+="0";}
mArgument=zeros+mArgument;}}
if('fbdoxX'.indexOf(sType)!=-1){if(bAlignLeft)
for(iCount=iPadLength;iCount<iWidth;iCount++)
mArgument+=sPad;else
for(iCount=iPadLength;iCount<iWidth;iCount++)
mArgument=sPad+mArgument;}}
sFormat=sFormat.replace(re,mArgument);}
return sFormat;}
function jsModel(){this.ctrl=null;}
function jsView(ctrl,viewInx,options){if(no(ctrl,viewInx))return;this.viewInx=viewInx;this.ctrl=ctrl;this.options=options?options:{};jsView.prototype.updateModel=function(){var child=null;var children=null;var res=!this.statusCode;children=this.ctrl.children;for(var i in children){child=this.getChild(i);if(child instanceof jsView){res&=child.updateModel();}}
this.ctrl.event("updmodel",this.ctrl.model);return res;}
jsView.prototype.updateView=function(){var child=null;var children=null;children=this.ctrl.children;for(var i in children){child=this.getChild(i);if(child instanceof jsView)child.updateView();}}
jsView.prototype.bind=function(eventType,handler){this.ctrl.addEventHandler(eventType,handler,this.viewInx);}
this.getParent=function(arg){var obj=this.ctrl.getParent(arg);if(obj.views){obj=obj.views[this.viewInx];}
return obj;}
this.getChild=function(){var obj=this.ctrl.getChild.apply(this.ctrl,arguments);if(obj.views){obj=obj.views[this.viewInx];}
return obj;}
if(!options.plainIface){var children=this.ctrl.children;var child;for(var i in children){child=children[i];if(child instanceof jsController){child.changeIface(viewInx,this,this.options);}}}
jsView.prototype.validate=function(){var res=!this.statusCode;var obj=null;var children=this.ctrl.children;if(children.length){for(var i in children){obj=this.getChild(i);if(obj instanceof jsView){res&=obj.validate();}}}
return res;};jsView.prototype.setOption=function(name,value){var children=this.ctrl.children;var child;this.options[name]=value;for(var i=0;i<children.length;i++){child=this.getChild(i);if(child instanceof jsView)child.setOption(name,value);}}
this.statusCode=null;}
function jsController(){this.addIface=function(parentView,parentOptions){var viewInx=window.getUID();this.changeIface(viewInx,parentView,parentOptions);return viewInx;}
this.unlinkIface=function(viewInx){var children=this.children;var handlers=this.handlers;var child;for(var i in children){child=children[i];if(child instanceof jsController){child.unlinkIface(viewInx);}}
this.views[viewInx]=null;for(var i in handlers){handlers[i][viewInx]=null;}}
this.changeIface=function(viewInx,parentView,parentOptions){var options=new Object();var pOptions=parentOptions?parentOptions:{};var integrate=null;if(this.nextIface){iface=this.ifaceTypes[this.nextIface];this.lastIface=this.nextIface;this.nextIface=null;if(iface){$.extend(options,pOptions,iface.options?iface.options:{});this.views[viewInx]=new iface.type(this,viewInx,options);}}
else{if(this.parent){if(false){this.views[viewInx]=new parentView.constructor(this,viewInx,parentView.options);}
else{ancestors1=parentView.getAncestry();iface=null;ifaceTypes=this.ifaceTypes;for(var i=ancestors1.length-1;i>=0;i--){ancestor1=ancestors1[i];cmin=1000000;jj=-1;for(var j in ifaceTypes){ancestors2=ifaceTypes[j].type.prototype.getAncestry();inx=$.inArray(ancestor1,ancestors2);if(inx>=0){ccur=ancestors2.length-1-inx;if(ccur<=cmin){if(ccur==cmin){if(ifaceTypes[j].def){iface=ifaceTypes[j];}}
else{iface=ifaceTypes[j];cmin=ccur;}}}}
if(iface)break;}
if(iface){$.extend(options,pOptions,iface.options?iface.options:{});this.views[viewInx]=new iface.type(this,viewInx,options);}}}}}
this.changeChild=function(childInx,childObj,alias){this.children[childInx]=childObj;childObj.integrate(childInx,this);if(alias)this.children[childInx].setAlias(alias);if(this.active&&!childInx&&this.activateToBottom)childObj.activate();return childObj;}
this.setAlias=function(alias){this.alias=alias;if(this.parent){this.parent.children_refs[alias]=this;}}
this.addChild=function(){var j=-1;for(var i=0;i<arguments.length;i++){if(arguments[i]instanceof jsController){j=this.children.length;this.changeChild(j,arguments[i]);}
else if(j>=0){var obj=this.getChild(j);var alias=arguments[i];obj.setAlias(alias);}}
return arguments[0];}
this.changeModel=function(modelObj){this.model=modelObj;this.model.ctrl=this;}
this.deactivateChild=function(){if(this.childActiveInx>=0){var child=this.children[this.childActiveInx];if(!child.root){child.event("predeactivate");child.deactivateChild();child.active=false;child.activatedByIface=null;this.childActiveInx=-1;child.event("deactivate");}}}
this.unlinkChild=function(id){if(parseInt(id,10).toString()!="NaN"){var alias=this.children[id].alias;this.children.splice(id,1);if(alias){delete this.children_refs[alias];}
if(this.childActiveInx==id)this.childActiveInx=-1;}
else{var inx=this.getInxByAlias(id);this.children.splice(inx,1);delete this.children_refs[id];if(this.childActiveInx==inx)this.childActiveInx=-1;}}
this.activate=function(force){this.event("preactivate");if(!force){if(this.parent&&!this.root){if(this.parent.active){this.parent.deactivateChild();this.parent.childActiveInx=this.thisInx;}
else{this.parent.childActiveInx=this.thisInx;this.parent.activatedByIface=this.activatedByIface;this.parent.activate();}}}
this.active=true;this.event("activate");if(this.childActiveInx<0){if(this.activateToBottom){if(this.children.length){this.children[0].activatedByIface=this.activatedByIface;this.children[0].activate(true);this.childActiveInx=0;}}}
else if(this.children[this.childActiveInx].active&&!this.activateToBottom){this.deactivateChild();}}
this.event=function(eventType,eventObject,bubble){var handlers;var parent;var handler;var res=true;handlers=this.ctrlHandlers[eventType];if(handlers instanceof Array){for(var i in handlers){handler=handlers[i];if(handler instanceof Function){res&=handlers[i].call(this,eventObject);bubble=true;}}}
handlers=this.handlers[eventType];if(handlers){for(var i in handlers){handler=handlers[i];if(handler instanceof Function){res&=handlers[i].call(this.views[i],eventObject);bubble=true;}}}
if(res&&bubble){parent=this.getParent();if(parent instanceof jsController){parent.event(eventType,eventObject,bubble);}}}
this.addEventHandler=function(eventType,handler,viewInx){if(no(eventType)||no(handler))return;if(!no(viewInx)){if(!this.handlers[eventType]){this.handlers[eventType]=new Array();}
this.handlers[eventType][viewInx]=handler;}
else{if(!(this.ctrlHandlers[eventType]instanceof Array)){this.ctrlHandlers[eventType]=[];}
this.ctrlHandlers[eventType].push(handler);}}
this.getParent=function(arg){var type;var i;if(arg instanceof Object){i=-1;type=arg;obj=this;while(i){i--;obj=obj.parent;if(no(obj)){obj={};break;}
if(type&&obj instanceof type)break;}}
else{i=no(arg)?1:arg;obj=this;while(i&&!no(obj.parent)){i--;obj=obj.parent;}
if(i>0)obj={};}
return obj;}
this.getChild=function(gen){var l=arguments.length;var obj;var j;if(!l){obj=this.children[0];}
else{obj=this;for(var i=0;i<l;i++){j=arguments[i];if(parseInt(j).toString()=="NaN"){obj=obj.children_refs[j];}
else{obj=obj.children[j];}
if(!obj)break;}}
if(!obj)obj={};return obj;}
this.getInxByAlias=function(alias){var children=this.children;var inx=null;var child;for(var i in children){child=children[i];if((child instanceof jsController)&&child.alias==alias){inx=i;break;}}
return inx;}
jsController.prototype.integrate=function(childInx,parent){this.thisInx=childInx;this.parent=parent;this.activateToBottom=parent.activateToBottom;}
jsController.prototype.describe=function(obj){var child;var item;var typeParser;var children;var children_refs;for(var i in obj){typeParser=controlTypes[obj[i].type];if(typeParser)typeParser(obj[i]);if(obj instanceof Array){child=this.getChild(obj[i].alias);if(!(child instanceof jsController)){child=this.addChild(obj[i].ctrl,obj[i].alias);}}
else{child=this.getChild(obj[i].inx);if(!(child instanceof jsController)){child=this.changeChild(obj[i].inx,obj[i].ctrl,i);}}
child.nextIface=obj[i].nextIface;if(obj[i].options&&child.nextIface&&child.ifaceTypes[child.nextIface]){var srcOpt=child.ifaceTypes[child.nextIface].options;srcOpt=srcOpt?srcOpt:{};child.ifaceTypes[child.nextIface].options=$.extend(true,srcOpt,obj[i].options);}
if(obj[i].children_refs){children_refs=obj[i].children_refs;obj[i].children=[];children=obj[i].children;for(var j in children_refs){children[children_refs[j].inx]=children_refs[j];children[children_refs[j].inx].alias=j;}}
if(obj[i].children){this.getChild(i).describe(obj[i].children);}}}
this.ifaceTypes={}
jsController.prototype.privilege="admin";this.children=new Array();this.children_refs=new Object();this.parent=null;this.model=null;this.views=new Array();this.serverUrl=null;this.active=false;this.activatedByIface=null;this.childActiveInx=-1;this.thisInx=0;this.ctrlHandlers={};this.handlers=new Array();this.activateToBottom=true;this.nextIface=null;this.lastIface=null;this.totalIfaceCount=0;this.alias=null;this.root=false;}
function jsSSideView(ctrl,viewInx,options){options=options?options:{};if(options.action){this.sender=this;options.sender=this;this.action=options.action;options.action=null;}
else{this.sender=options.sender;}
if(options.method){this.method=options.method;options.method=null;}
jsSSideView.superclass.constructor.call(this,ctrl,viewInx,options);this.sendSuccess=function(data){this.xmlhttprequest=null;try{if(data){this.responseData=data;}
else{this.responseData={};}
if(!this.rootCtrl){this.rootCtrl=window.rootCtrl;}
if(this.rootCtrl.checkServerData instanceof Function){if(!this.rootCtrl.checkServerData(this.responseData)){return;}}}
catch(e){this.responseData={baddata:true};}
this.updateModel(true);if(this.refreshTime>0){this.refreshId=setTimeout(context(this).callback(this.updateView),this.refreshTime);}}
this.updateView=function(){if(this.action)this.requestData=null;if(this.prepareData instanceof Function)this.prepareData();jsSSideView.superclass.updateView.call(this);if(this.action&&!window.isIdle)this.sendRequest();}
this.updateModel=function(force){if((this.action&&force)||!this.action){if(this.pickData instanceof Function)this.pickData();return jsSSideView.superclass.updateModel.call(this);}
return true;}
this.sendRequest=function(){var url=ctrl.serverUrl?ctrl.serverUrl:"";$(window).bind("ajaxError",context(this).callback(this.onajaxerror));this.requestData+="&proxy=y";device.request(url+"/"+this.action,this.method,this.requestData,context(this).callback(this.sendSuccess));}
this.onajaxerror=function(){var isItMyError=this.xmlhttprequest&&this.xmlhttprequest.readyState==4&&this.xmlhttprequest.status!=200;if(isItMyError)this.xmlhttprequest=null;if(isItMyError&&this.refreshTime>0&&!this.stopOnAjaxError){this.refreshId=setTimeout(context(this).callback(this.updateView),this.refreshTime);}}
this.addToRequest=function(obj){var sender=this.sender;var splitter='';if(this.options.dataType&&this.options.dataType=="json"){sender.requestData=$.toJSON(obj);}
else{if(!sender.requestData){splitter="";sender.requestData="";}
else{splitter="&";}
if(!this.rootCtrl){this.rootCtrl=window.rootCtrl;}
for(var key in obj){if(this.rootCtrl.checkClientData instanceof Function){obj[key]=this.rootCtrl.checkClientData(obj[key]);}
sender.requestData+=splitter+key+"="+obj[key];splitter="&";}}}
this.startRefresh=function(delay,period,stopOnAjaxError){if(period>0){this.refreshTime=period;this.stopOnAjaxError=stopOnAjaxError;delay=delay?delay:0;this.refreshId=setTimeout(context(this).callback(this.updateView),delay);}}
this.stopRefresh=function(){clearTimeout(this.refreshId);this.refreshId=null;this.refreshTime=0;this.stopOnAjaxError=false;}
this.requestData=null;this.responseData=null;this.prepareData=null;this.refreshTime=0;this.rootCtrl=null;this.refreshId=null;this.xmlhttprequest=null;this.stopOnAjaxError=false;this.bind('stoprefreshrq',this.stopRefresh);}
extend(jsSSideView,jsView);function jsCSideView(ctrl,viewInx,options){if(options.hide){this.hidden=options.ishidden=options.hide;options.hide=false;}
jsCSideView.superclass.constructor.call(this,ctrl,viewInx,options);jsCSideView.prototype.drawView=function(){var child=null;var children=null;var options=this.options;var $viewbox=$(options.viewBoxSel);if(options.hide){this.hidden=options.hide;this.setOption("ishidden",options.hide);options.hide=false;}
this.bindDOMEvent("click",this.onclick);if(this.hidden)this.hide();if(no($viewbox.attr("id"))){$viewbox.attr("id","viewbox"+getUID());}
children=this.ctrl.children;for(var i in children){child=this.getChild(i);if(child instanceof jsCSideView)child.drawView();}}
this.correctModalOverlay=function(){$('#modalOverlayBox').css({'width':$(document).width(),'height':$(document).height()});}
jsCSideView.prototype.showModalOverlay=function(message){if($("#modalOverlayBox").length==0){$("body").append("<div id='modalOverlayBox' class='overlay' style='display: none;' ><input type='hidden' value='0' /><div class='message'><div></div></div></div>");}
if(this.isWin){var winCount=new Number($('#modalOverlayBox>input').val());$('#modalOverlayBox>input').val(winCount+1);}
$('body').css('overflow','hidden');$('#modalOverlayBox').css({'left':0,'top':0,'width':$(document).width(),'height':$(document).height(),'display':'block','opacity':0.7});if(message){$('#modalOverlayBox div.message').css('display','');$('#modalOverlayBox div.message>div').html(lng(message));var width=$('#modalOverlayBox div.message').width();var height=$('#modalOverlayBox div.message').height();$('#modalOverlayBox div.message').css({'left':$(document).width()/2-width/2,'top':$(document).height()/2-height/2});}
else{$('#modalOverlayBox div.message').css('display','none');$('#modalOverlayBox div.message>div').html("");}
$(window).bind('resize',context(this).callback(this.correctModalOverlay));$(window).trigger('overlay.core',{'visible':true,'obj':this});}
jsCSideView.prototype.hideModalOverlay=function(){var winCount=new Number($('#modalOverlayBox>input').val());if(this.isWin){$('#modalOverlayBox>input').val(--winCount);}
if($('#modalOverlayBox').is(':hidden')||winCount>0)return;$('#modalOverlayBox').fadeOut(600,function(){$(this).css({'width':'0px','height':'0px','display':'none'});$('body').css('overflow','auto');});$('#modalOverlayBox div.message').css('display','none');$(window).unbind('resize',context(this).callback(this.correctModalOverlay));$(window).trigger('overlay.core',{'visible':false,'obj':this});}
jsCSideView.prototype.hide=function(){this.hidden=true;this.setOption("ishidden",true);$(this.options.viewBoxSel).css("display","none");}
jsCSideView.prototype.show=function(){this.hidden=false;this.unSetOptionHidden();$(this.options.viewBoxSel).css("display","");}
jsCSideView.prototype.unSetOptionHidden=function(){var children=this.ctrl.children;var child;for(var i=0;i<children.length;i++){child=this.getChild(i);if(child&&!child.hidden){child.unSetOptionHidden();}}
this.options.ishidden=false;}
jsCSideView.prototype.bindDOMEvent=function(eventType,handler){$(this.myBoxSel).bind(eventType,{},context(this).callback(handler));}
jsCSideView.prototype.onblur=dummyFunc;jsCSideView.prototype.onchange=dummyFunc;jsCSideView.prototype.onclick=function(event){if(event.target==event.currentTarget){this.ctrl.activatedByIface=this.viewInx;this.ctrl.activate();}
return true;};jsCSideView.prototype.ondblclick=dummyFunc;jsCSideView.prototype.onerror=dummyFunc;jsCSideView.prototype.onfocus=dummyFunc;jsCSideView.prototype.onfocusin=dummyFunc;jsCSideView.prototype.onfocusout=dummyFunc;jsCSideView.prototype.onhover=dummyFunc;jsCSideView.prototype.onkeydown=dummyFunc;jsCSideView.prototype.onkeypress=dummyFunc;jsCSideView.prototype.onkeyup=dummyFunc;jsCSideView.prototype.onmousedown=dummyFunc;jsCSideView.prototype.onmouseenter=dummyFunc;jsCSideView.prototype.onmouseleave=dummyFunc;jsCSideView.prototype.onmousemove=dummyFunc;jsCSideView.prototype.onmouseout=dummyFunc;jsCSideView.prototype.onmouseover=dummyFunc;jsCSideView.prototype.onmouseup=dummyFunc;jsCSideView.prototype.onresize=dummyFunc;jsCSideView.prototype.onscroll=dummyFunc;jsCSideView.prototype.onselect=dummyFunc;jsCSideView.prototype.onsubmit=dummyFunc;if(!options.viewBoxSel)options.viewBoxSel=null;if(!options.myBoxSel)options.myBoxSel=options.viewBoxSel;if(!options.childBoxSel)options.childBoxSel=options.viewBoxSel;this.viewBoxSel=options.viewBoxSel;this.myBoxSel=options.myBoxSel;this.childBoxSel=options.childBoxSel;this.isWin=false;}
extend(jsCSideView,jsView);jsCSideViewOptions={rtl:false,pda:false,lng:"rus"
}
function jsViewTree(ctrl,viewInx,options){jsViewTree.superclass.constructor.call(this,ctrl,viewInx,options);if(!options)options={};jsViewTree.prototype.drawView=function(){var children;var lft;var rgt;var alias=this.ctrl.alias?this.ctrl.alias:"";var htmlToAppend="";var anchor_href="";var child;if(this.options.plainIface){children=[];}
else{children=this.ctrl.children;}
if(!(this.getParent(1)instanceof jsViewTree)){this.ctrl.root=true;this.path=alias;this.rootOfTree=this;}
else{this.path=this.getParent().path+"/"+alias;this.rootOfTree=this.getParent().rootOfTree;}
if(this.options.noPath){this.path="";anchor_href="";}else{anchor_href=" href='#"+this.path+"' ";}
if(this.style=="fastmenu"){if(this.ctrl.root){$(this.viewBoxSel).html("<div></div>");this.myBoxSel=this.viewBoxSel+">div";$(this.viewBoxSel).addClass("fastmenu");$(this.myBoxSel).css("display","none");}
else{$(this.viewBoxSel).html("<a "+anchor_href+"></a>");this.myBoxSel=this.viewBoxSel+">a";}
if(children.length){this.childBoxSel=this.viewBoxSel+">ul";$(this.viewBoxSel).append("<ul></ul>");}
else{this.childBoxSel=null;}
htmlToAppend="";for(var i=0;i<children.length;i++){htmlToAppend+="<li></li>";child=this.getChild(i);child.options.viewBoxSel=this.childBoxSel+">li:eq("+i+")";child.viewBoxSel=this.childBoxSel+">li:eq("+i+")";}
$(this.childBoxSel).append(htmlToAppend);}
else{if(this.ctrl.getParent(2).root){$(this.viewBoxSel).html("<a "+anchor_href+"></a>");this.myBoxSel=this.viewBoxSel+">a";}
else if(this.ctrl.root){$(this.viewBoxSel).html("<div></div>");this.myBoxSel=this.viewBoxSel+">div";if(this.style=="tabs1"){$(this.viewBoxSel).addClass("menu");}
else{$(this.viewBoxSel).addClass("menuvert1");}
$(this.myBoxSel).css("display","none");}
else{if(this.style=="tabs1"){lft="class = 'lft'";rgt="class = 'rgt'";$(this.viewBoxSel).html("<a "+anchor_href+"><em "+lft+"></em><b></b><em "+rgt+"></em></a>");this.myBoxSel=this.viewBoxSel+">a>b";}
else{$(this.viewBoxSel).html("<a "+anchor_href+"></a>");this.myBoxSel=this.viewBoxSel+">a";}}
if(children.length){this.childBoxSel=this.viewBoxSel+">ul";$(this.viewBoxSel).append("<ul></ul>");}
else{this.childBoxSel=null;}
htmlToAppend="";for(var i=0;i<children.length;i++){htmlToAppend+="<li></li>";child=this.getChild(i);child.options.viewBoxSel=this.childBoxSel+">li:eq("+i+")";child.viewBoxSel=this.childBoxSel+">li:eq("+i+")";}
$(this.childBoxSel).append(htmlToAppend);if(this.style!="tabs1"){if(this.ctrl.active){this.onactivate();}
else{this.ondeactivate();}}
if(!this.ctrl.active&&!this.open&&!this.ctrl.root){$(this.childBoxSel).css("display","none");}
else{$(this.childBoxSel).css("display","");}}
if(children.length){if(children.length==1){$(this.getChild(0).viewBoxSel).addClass("nodesingle");}
else{$(this.getChild(0).viewBoxSel).addClass("nodefirst");$(this.getChild(children.length-1).viewBoxSel).addClass("nodelast");}}
jsViewTree.superclass.drawView.call(this);if(this.ctrl.root&&this.style=="fastmenu"){$(this.viewBoxSel+' ul li').hover(function(){$(this).find('ul').stop(true,true);$(this).find('ul').slideDown('normal');},function(){$(this).find('ul').slideUp('normal');});}}
jsViewTree.prototype.onactivate=function(){$(this.viewBoxSel).addClass(this.getClasses());if(this.style!="fastmenu"){if(this.style!="tabs1")$(this.myBoxSel).css("font-weight","bold");if(!this.open)$(this.childBoxSel).css("display","");}
return false;}
jsViewTree.prototype.getClasses=function(){var classes="";var parent=this.ctrl.getParent();if(parent instanceof jsController){if(parent.children.length==1){classes+="nodesingleactive";}
else if(this.ctrl.thisInx<parent.children.length-1&&this.ctrl.thisInx>0){classes+="nodeactive";}
else{if(this.ctrl.thisInx==0){classes+=" nodefirstactive";}
if(this.ctrl.thisInx==parent.children.length-1){classes+=" nodelastactive";}}}
else{classes+="nodesingleactive";}
return classes;}
jsViewTree.prototype.ondeactivate=function(){$(this.viewBoxSel).removeClass(this.getClasses());if(this.style!="fastmenu"){if(this.style!="tabs1")$(this.myBoxSel).css("font-weight","normal");if(!this.open)$(this.childBoxSel).css("display","none");}
return false;}
this.bind("activate",this.onactivate);this.bind("deactivate",this.ondeactivate);this.style=options.style;this.open=(this.style=="tabs1")?true:options.open;this.rootOfTree=null;this.path="";}
extend(jsViewTree,jsCSideView);function jsMenuModel(nodeName){jsMenuModel.superclass.constructor.call(this);this.nodeName=nodeName;}
extend(jsMenuModel,jsModel);function jsMenuController(nodeName,options){if(no(nodeName))return;jsMenuController.superclass.constructor.call(this);if(!options)options={};if(!this.contentOptions)this.contentOptions=[];if(options.contentClass)this.contentClass=options.contentClass;if(options.contentOptions)this.contentOptions=options.contentOptions;this.changeModel(new jsMenuModel(nodeName));this.ifaceTypes.tree={type:jsMenuView,def:true};this.integrate=function(childInx,parent){jsMenuController.superclass.integrate.call(this,childInx,parent);if(!this.frame)this.frame=this.getParent(1).frame;parent=this.getParent(1);if(parent instanceof jsMenuController&&parent.level>=0)this.level=this.getParent(1).level+1;}
this.createContent=function(){if(this.contentClass){this.contentCtrl=new this.contentClass();this.contentClass.apply(this.contentCtrl,this.contentOptions);}
return this.contentCtrl;}
this.onactivate=function(){this.createContent();frame=this.frame
if(frame)frame.event("menuchange",this);return false;}
this.addEventHandler("activate",this.onactivate);this.level=0;this.frame=options.frame;this.contentCtrl=null;this.selectedByView=null;}
extend(jsMenuController,jsController);function jsMenuView(ctrl,viewInx,options){jsMenuView.superclass.constructor.call(this,ctrl,viewInx,options);jsMenuView.prototype.drawView=function(){jsMenuView.superclass.drawView.call(this);$(this.myBoxSel).html(lng(this.ctrl.model.nodeName));}
jsMenuView.prototype.onactivate=function(){jsMenuView.superclass.onactivate.call(this);this.ctrl.selectedByView=this.viewInx;}
this.bind("activate",this.onactivate);}
extend(jsMenuView,jsViewTree);function jsRecordSetModel(recordSet){jsRecordSetModel.superclass.constructor.call(this);this.recordSet=recordSet?recordSet:[];this.colsWidth={};}
extend(jsRecordSetModel,jsModel);function jsRecordSetController(){jsRecordSetController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsRecordSetClientView};this.changeModel(new jsRecordSetModel());jsRecordSetController.prototype.onrecselect=function(recordInx){this.activeRecordInx=recordInx;return true;}
this.addEventHandler("recselect",this.onrecselect);this.activeRecordInx=-1;}
extend(jsRecordSetController,jsController);function jsRecordSetClientView(ctrl,viewInx,options){jsRecordSetClientView.superclass.constructor.call(this,ctrl,viewInx,options);if(options.resizingOff==undefined){options.resizingOff=false;}
jsRecordSetClientView.prototype.drawView=function(){if(this.ctrl.activeRecordInx<0)this.drawShowView();else this.drawEditView();if(this.options.hide){this.hidden=this.options.hide;this.setOption("ishidden",this.options.hide);this.options.hide=false;}
if(this.hidden)this.hide();}
jsRecordSetClientView.prototype.setResizing=function(){var table=$(this.myBoxSel+'>table');var tds=$(table).find('tr:eq(0)>td');var colsWidth=this.ctrl.model.colsWidth;var rtlIndex=($('body').css('direction')!='rtl')?$(tds).length-1:0;document.extra={resizing:false,oldX:0,oldWidth:0,currentTD:null};$(tds).each(function(index){if(rtlIndex==index){return;}
if(colsWidth[index.toString()]!=undefined){$(this).css('width',colsWidth[index.toString()]);}
var thText=$(this).text();var divTh=$("<div />").css({'width':'100%','height':'100%','position':'relative'});var resizer=$("<div />").css({'cursor':'col-resize','height':'100%','left':'100%','position':'absolute','top':'0px','width':'5px'});$(resizer).mousedown(function(e){document.extra.resizing=true;document.extra.oldX=e.pageX;document.extra.oldWidth=$(this).parents('td').width();document.extra.currentTD=$(this).parents('td');$('body').css('cursor','col-resize');$(resizer).parents('table').fadeTo('fast',0.7);return false;});$(resizer).mouseup(function(e){document.extra.resizing=false;$('body').css('cursor','default');$(resizer).parents('table').fadeTo('slow',1);colsWidth[$(document.extra.currentTD).index().toString()]=$(document.extra.currentTD).width();return false;});$('body').mouseup(function(e){if(document.extra.resizing){$(resizer).mouseup();return false;}});$('body').mousemove(function(e){if(document.extra.resizing){var width=e.pageX-document.extra.oldX;$(document.extra.currentTD).css('width',document.extra.oldWidth+width);return false;}});$(divTh).text(thText)
$(divTh).append(resizer);$(this).html($(divTh));});}
jsRecordSetClientView.prototype.drawShowView=function(){var recordSet=this.ctrl.model.recordSet;var record=null;var header=null;var htmlToDraw="";var id;var idPrefix;htmlToDraw="<table class='gridTable' cellspacing='0' cellpadding='0'>";header=this.options.header;htmlToDraw+=this.drawTh();if(recordSet&&recordSet.length){idPrefix="rsShow"+getUID()+"_";for(var i=0;i<recordSet.length;i++){htmlToDraw+=this.drawTr(idPrefix,i);}}
htmlToDraw+="</table>";if(!this.options.viewBoxSel)this.options.viewBoxSel=this.viewBoxSel;this.options.myBoxSel=this.options.viewBoxSel;this.myBoxSel=this.options.myBoxSel;this.options.childBoxSel=this.options.viewBoxSel;this.childBoxSel=this.options.childBoxSel;$(this.myBoxSel).html(htmlToDraw);if(!this.options.resizingOff){this.setResizing();}
for(var i=0;i<recordSet.length;i++){$("#"+idPrefix+i).bind("click",{recordInx:i},context(this).callback(this.onrowclick));}
var rowSel;var cellSel;var curVal;for(var i=0;i<recordSet.length;i++){rowSel="#"+idPrefix+i;for(var j in header){curVal=recordSet[i][header[j].key];if(curVal instanceof Object){if(curVal.type=="radio"||curVal.type=="checkbox"){cellSel=rowSel+">td:eq("+j+")>input";$(cellSel).bind("click",{row:i,cell:j},context(this).callback(this.oncellclick));}}}}}
jsRecordSetClientView.prototype.drawTh=function(){var header=this.options.header;var htmlToDraw="<tr class='gridHeader'>";for(var i in header){htmlToDraw+="<td>"+lng(header[i].name)+"</td>";}
htmlToDraw+="</tr>";return htmlToDraw;}
jsRecordSetClientView.prototype.drawTr=function(idPrefix,i){var id=idPrefix+i;var record=this.ctrl.model.recordSet[i];var htmlToDraw="<tr id='"+id+"' class='";var header=this.options.header;if(i%2){htmlToDraw+="gridRow2";}
else{htmlToDraw+="gridRow1";}
htmlToDraw+="'>";if(record){for(var j in header){htmlToDraw+=this.drawTd(record,j);}}
htmlToDraw+="</tr>";return htmlToDraw;}
jsRecordSetClientView.prototype.drawTd=function(record,i){var curHeader=this.options.header[i];var htmlToDraw;var curVal=record[curHeader.key];if(curVal instanceof Object){if(curVal.type=="radio"||curVal.type=="checkbox"){var checked=curVal.value?"checked":"";var attr;extrattrs=curVal.extrattrs;htmlToDraw="<td><input name='"+curHeader.key+"' value='"+curVal.value+"' type='"+curVal.type+"' "+checked;if(extrattrs){for(var i in extrattrs){htmlToDraw+=i+"='"+extrattrs[i]+"' ";}}
htmlToDraw+=" ></td>";}}
else{if(no(curVal)||curVal=="")curVal="&nbsp;";htmlToDraw="<td>"+curVal+"</td>";}
return htmlToDraw;}
jsRecordSetClientView.prototype.drawEditView=function(){var childCtrls=this.ctrl.children;var options={};var header=this.options.header;var id;var editBoxSel=this.options.editBoxSel?this.options.editBoxSel:this.myBoxSel;$.extend(options,this.options);if(childCtrls.length)$(this.myBoxSel).html("");options.myBoxSel=null;options.childBoxSel=null;if(childCtrls.length>1){var htmlToAppend="";for(var i in childCtrls){id="rsEdit"+getUID();htmlToAppend+="<div id='"+id+"'></div>";htmlToAppend+="<div class='recordSetSpacer'></div>";options.viewBoxSel="#"+id;options.name=header[i];childCtrls[i].changeIface(this.viewInx,this,options);}
$(editBoxSel).append(htmlToAppend);}
else if(childCtrls.length){options.viewBoxSel=editBoxSel;options.name=header[0];childCtrls[0].changeIface(this.viewInx,this,options);}
jsRecordSetClientView.superclass.drawView.call(this);}
jsRecordSetClientView.prototype.onrowclick=function(event){this.ctrl.event("recselect",event.data.recordInx);}
jsRecordSetClientView.prototype.onrecselect=function(recordInx){return true;}
jsRecordSetClientView.prototype.oncellclick=function(event){this.ctrl.event("cellselect",event.data);event.stopPropagation();return true;}
this.bind("recselect",this.onrecselect);}
extend(jsRecordSetClientView,jsCSideView);function jsFieldSetController(){jsFieldSetController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsFieldSetClientView};this.ifaceTypes.popup={type:jsFieldSetPopUpClientView};this.ifaceTypes.server={type:jsSSideView};}
extend(jsFieldSetController,jsController);function jsFieldSetClientView(ctrl,viewInx,options){if(options){var title=options.title;var tabs=options.tabs;var wizard=options.wizard;options.title="";options.tabs=false;options.wizard=false;}
jsFieldSetClientView.superclass.constructor.call(this,ctrl,viewInx,options);if(options){this.options.title=title;this.options.tabs=tabs;this.options.wizard=wizard;}
jsFieldSetClientView.prototype.drawView=function(){var htmlToDraw;var childCtrls=this.ctrl.children;var button;var options=this.options;var title=options.title?options.title:"&nbsp;";var obj=null;var	htmlToDraw="";if(options.slider){if(options.nocollapse){htmlToDraw+="<div class='fieldSetSlider fieldSetSliderNoCollapse'>";}
else{if(options.collapsed){htmlToDraw+="<div class='fieldSetSlider fieldSetSliderCollapsed'>";}
else{htmlToDraw+="<div class='fieldSetSlider fieldSetSliderExpanded'>";}}
htmlToDraw+="<div>";if(options.title){htmlToDraw+=lng(options.title);}
htmlToDraw+="</div></div>";if(options.descClass){htmlToDraw+="<div class='"+options.descClass+"'>";}
else{htmlToDraw+="<div class='fieldSetSliderBottom'>";}
if(options.descText){htmlToDraw+="<div>"+lng(options.descText)+"</div>";}
htmlToDraw+="</div>";}
if(options.slider||options.nothing){if(options.slider&&options.collapsed&&!options.nocollapse){htmlToDraw+="<div style='display:none'></div>";}
else{htmlToDraw+="<div></div>";}
if(options.pages&&childCtrls.length>1){this.pageBarSel=this.viewBoxSel+">div.fieldSetPages";htmlToDraw+=this.drawPageBar();}
if(this.options.buttons){this.buttonBarSel=this.viewBoxSel+">div.fieldSetMainButtons";htmlToDraw+="<div class='fieldSetMainButtons'>";htmlToDraw+=this.drawButtons();htmlToDraw+="</div>";}
$(this.viewBoxSel).html(htmlToDraw);if(options.slider){this.childBoxSel=this.viewBoxSel+">div:eq(2)";}
else{this.childBoxSel=this.viewBoxSel+">div:eq(0)";}
this.options.childBoxSel=this.childBoxSel;if(options.pages&&childCtrls.length>1){this.setPageClicks();}
this.setButtonClicks();if(options.slider&&!options.nocollapse){$(this.viewBoxSel+">div.fieldSetSlider").bind("click",{},context(this).callback(this.toggleSlider));}}
else if(options.simple){if(options.tabs&&childCtrls.length>1){this.tabBarSel=this.viewBoxSel+">div.fieldSetMainTabsSimple"
htmlToDraw+="<div class='fieldSetMainTabsSimple'>";htmlToDraw+=this.drawTabBar();htmlToDraw+="</div>";}
htmlToDraw+="<div><fieldset></fieldset></div><div class='fieldSetMainButtons'>";htmlToDraw+=this.drawButtons();htmlToDraw+="</div>";if(options.pages&&childCtrls.length>1){this.pageBarSel=this.viewBoxSel+">div.fieldSetPages";htmlToDraw+=this.drawPageBar();}
$(this.viewBoxSel).html(htmlToDraw);if(options.tabs&&childCtrls.length>1){this.buttonBarSel=this.viewBoxSel+">div:eq(2)";}
else{this.buttonBarSel=this.viewBoxSel+">div:eq(1)";}
this.setButtonClicks();if(options.tabs){this.setTabClicks();}
else if(options.pages&&childCtrls.length>1){this.setPageClicks();}
this.childBoxSel=this.viewBoxSel+">div>fieldset";this.options.childBoxSel=this.childBoxSel;}
else{if(options.title){if(options.title.type=="link"){title="<font class='fieldSetTitleLink'>"+lng(options.title.name)+"</font>"}
else{title="<font class='fieldSetTitleText'>"+lng(options.title.name)+"</font>"}}
else{title="&nbsp;";}
htmlToDraw="<div class='fieldSetMainPath'><div style='display: inline; vertical-align: middle;'></div>"
+"<div style='margin-left: 4px; display: inline;'>"
+title
+"</div></div>"
+"<div class='fieldSetMainContentContainer'>";if(options.tabs&&childCtrls.length>1){this.tabBarSel=this.viewBoxSel+">div.fieldSetMainContentContainer>div.fieldSetMainTabs"
htmlToDraw+="<div class='fieldSetMainTabs'>";htmlToDraw+=this.drawTabBar();htmlToDraw+="</div>";}
htmlToDraw+="<div class='fieldSetMainContent'>"
+"<div class='fieldSetGeneral' style='display: block;'>"
+"</div></div>"
+"<div class='fieldSetMainButtons'>";if(options.pages&&childCtrls.length>1){this.pageBarSel=this.viewBoxSel+" div.fieldSetPages";htmlToDraw+=this.drawPageBar();}
htmlToDraw+=this.drawButtons();htmlToDraw+="</div></div>";$(this.viewBoxSel).html(htmlToDraw);this.buttonBarSel=this.viewBoxSel+">div.fieldSetMainContentContainer>div.fieldSetMainButtons";this.setButtonClicks();if(options.title&&options.title.type=="link"){$(this.viewBoxSel+">div.fieldSetMainPath>div>font").bind("click",{},context(this).callback(options.title.handler));}
if(options.tabs){this.setTabClicks();}
else if(options.pages&&childCtrls.length>1){this.setPageClicks();}
this.childBoxSel=this.viewBoxSel+">div.fieldSetMainContentContainer>div.fieldSetMainContent>div.fieldSetGeneral";this.options.childBoxSel=this.childBoxSel;}
if(options.pages&&childCtrls.length>1){this.switchPage(this.activeTab);}
if(options.wizard&&childCtrls.length>1){this.switchChild(this.activeTab);}
if(childCtrls.length)$(this.childBoxSel).html("");var htmlToAppend="";var j=0;if(childCtrls.length>1){for(var i in childCtrls){htmlToAppend+="<div style='margin: 3px 0px'></div>";obj=this.getChild(i);if(!(obj instanceof jsCSideView))continue;if(options.tabs||options.pages||options.wizard){obj.viewBoxSel=this.childBoxSel+">div:eq("+j+")";}
else{htmlToAppend+="<div class='fieldSetSpacer'></div>";obj.viewBoxSel=this.childBoxSel+">div:eq("+j*2+")";}
obj.options.viewBoxSel=obj.viewBoxSel;j++}
if(options.tabs||options.pages||options.wizard){for(var i=0;i<this.ctrl.children.length;i++){obj=this.getChild(i);if(obj instanceof jsCSideView){obj.options.hide=true;}}
this.getChild(this.activeTab).options.hide=false;}
$(this.childBoxSel).append(htmlToAppend);}
else if(childCtrls.length){obj=this.getChild(0);if(obj instanceof jsCSideView){obj.viewBoxSel=this.childBoxSel;obj.options.viewBoxSel=obj.viewBoxSel;}}
jsFieldSetClientView.superclass.drawView.call(this);}
this.toggleSlider=function(){var options=this.options;var obj=$(options.viewBoxSel+">div.fieldSetSlider");if(options.collapsed){obj.removeClass("fieldSetSliderCollapsed");obj.addClass("fieldSetSliderExpanded");$(options.childBoxSel).css("display","");options.collapsed=false;}
else{obj.removeClass("fieldSetSliderExpanded");obj.addClass("fieldSetSliderCollapsed");$(options.childBoxSel).css("display","none");options.collapsed=true;}}
jsFieldSetClientView.prototype.hideButton=function(name){if(this.buttons){$(this.buttons[name].sel).css("display","none");}}
jsFieldSetClientView.prototype.showButton=function(name){if(this.buttons){$(this.buttons[name].sel).css("display","");}}
jsFieldSetClientView.prototype.disableButton=function(name){if(this.buttons){$(this.buttons[name].sel).attr("disabled",true);}}
jsFieldSetClientView.prototype.enableButton=function(name){if(this.buttons){$(this.buttons[name].sel).attr("disabled",false);}}
jsFieldSetClientView.prototype.updateButtons=function(){if(this.options.buttons){$(this.buttonBarSel).html(this.drawButtons());this.setButtonClicks();}
else{$(this.buttonBarSel).html("");}}
jsFieldSetClientView.prototype.showTab=function(tabInx){var tabSel=this.tabBarSel+">span:eq("+tabInx+")";var prevTabInx=tabInx-1;var prevTabSel=this.tabBarSel+">span:eq("+prevTabInx+")";if(tabInx==0){$(tabSel).removeClass("tabStartOff");$(tabSel).addClass("tabStartOn");$(tabSel+">span:eq(1)").removeClass("tabBgOff");$(tabSel+">span:eq(1)").addClass("tabBgOn");$(tabSel+">span:eq(2)").removeClass("tabMidOff");$(tabSel+">span:eq(2)").addClass("tabMidLeftOn");}
else if(tabInx>0&&tabInx<this.ctrl.children.length-1){$(prevTabSel+">span:last").removeClass("tabMidRightOff");$(prevTabSel+">span:last").addClass("tabMidRightOn");$(tabSel+">span:eq(0)").removeClass("tabBgOff");$(tabSel+">span:eq(0)").addClass("tabBgOn");$(tabSel+">span:eq(1)").removeClass("tabMidOff");$(tabSel+">span:eq(1)").addClass("tabMidLeftOn");}
else if(tabInx==this.ctrl.children.length-1){$(prevTabSel+">span:last").removeClass("tabMidRightOff");$(prevTabSel+">span:last").addClass("tabMidRightOn");$(tabSel+">span:eq(0)").removeClass("tabBgOff");$(tabSel+">span:eq(0)").addClass("tabBgOn");$(tabSel+">span:eq(1)").removeClass("tabEndOff");$(tabSel+">span:eq(1)").addClass("tabEndOn");}
this.getChild(tabInx).show();}
jsFieldSetClientView.prototype.hideTab=function(tabInx){var tabSel=this.tabBarSel+">span:eq("+tabInx+")";var prevTabInx=tabInx-1;var prevTabSel=this.tabBarSel+">span:eq("+prevTabInx+")";if(tabInx==0){$(tabSel).removeClass("tabStartOn");$(tabSel).addClass("tabStartOff");$(tabSel+">span:eq(1)").removeClass("tabBgOn");$(tabSel+">span:eq(1)").addClass("tabBgOff");$(tabSel+">span:eq(2)").removeClass("tabMidLeftOn");$(tabSel+">span:eq(2)").addClass("tabMidOff");}
else if(tabInx>0&&tabInx<this.ctrl.children.length-1){$(prevTabSel+">span:last").removeClass("tabMidRightOn");$(prevTabSel+">span:last").addClass("tabMidRightOff");$(tabSel+">span:eq(0)").removeClass("tabBgOn");$(tabSel+">span:eq(0)").addClass("tabBgOff");$(tabSel+">span:eq(1)").removeClass("tabMidLeftOn");$(tabSel+">span:eq(1)").addClass("tabMidOff");}
else if(tabInx==this.ctrl.children.length-1){$(prevTabSel+">span:last").removeClass("tabMidRightOn");$(prevTabSel+">span:last").addClass("tabMidRightOff");$(tabSel+">span:eq(0)").removeClass("tabBgOn");$(tabSel+">span:eq(0)").addClass("tabBgOff");$(tabSel+">span:eq(1)").removeClass("tabEndOn");$(tabSel+">span:eq(1)").addClass("tabEndOff");}
this.getChild(tabInx).hide();}
jsFieldSetClientView.prototype.switchTab=function(tabInx){this.hideTab(this.activeTab);this.showTab(tabInx);this.activeTab=tabInx;}
jsFieldSetClientView.prototype.switchPage=function(pageInx){var pos=new Number(this.activeTab)+1;$(this.pageBarSel+">a:eq("+pos+")").removeClass("fieldSetPageActive");pos=new Number(pageInx)+1;$(this.pageBarSel+">a:eq("+new Number(pageInx+1)+")").addClass("fieldSetPageActive");pos=this.ctrl.children.length+1;if(pageInx==0){$(this.pageBarSel+">a:eq(0)").css("display","none");$(this.pageBarSel+">a:eq("+pos+")").css("display","");}
else if(pageInx==this.ctrl.children.length-1){$(this.pageBarSel+">a:eq(0)").css("display","");$(this.pageBarSel+">a:eq("+pos+")").css("display","none");}
else{$(this.pageBarSel+">a:eq(0)").css("display","");$(this.pageBarSel+">a:eq("+pos+")").css("display","");}
this.switchChild(pageInx);}
jsFieldSetClientView.prototype.switchChild=function(childId){this.getChild(this.activeTab).hide();var child=this.getChild(childId);child.show();this.activeTab=child.ctrl.thisInx;}
jsFieldSetClientView.prototype.drawTabBar=function(){var childrenLength=this.ctrl.children.length;var htmlToDraw="<span class='tabStart tabStartOn'>"
+"<span>"
+"</span>"
+"<span class='fieldSetTabText tabBgOn'>"
+"<a>"+lng(this.getChild(0).options.title)+"</a>"
+"</span>"
+"<span class='tabMidLeft tabMidLeftOn'>"
+"</span>"
+"</span>";for(var i=1;i<childrenLength-1;i++){htmlToDraw+="<span>"
+"<span class='fieldSetTabText tabBgOff'>"
+"<a>"+lng(this.getChild(i).options.title)+"</a>"
+"</span>"
+"<span class='tabMidLeft tabMidOff'>"
+"</span>"
+"</span>";}
htmlToDraw+="<span>"
+"<span class='fieldSetTabText tabBgOff'>"
+"<a>"+lng(this.getChild(childrenLength-1).options.title)+"</a>"
+"</span>"
+"<span class='tabEnd tabEndOff'>"
+"</span>"
+"</span>";return htmlToDraw;}
jsFieldSetClientView.prototype.drawPageBar=function(){var childrenLength=this.ctrl.children.length;var options=this.options;var	htmlToDraw="<div class='fieldSetPages'>";htmlToDraw+="<a class='fieldSetPrev'>";if(!no(options.prev)){htmlToDraw+=lng(this.options.prev);}
htmlToDraw+="</a>";for(var i in this.ctrl.children){htmlToDraw+="<a>"+(new Number(i)+1)+"</a>";}
htmlToDraw+="<a class='fieldSetNext'>";if(!no(options.next)){htmlToDraw+=lng(this.options.next);}
htmlToDraw+="</a>";htmlToDraw+="</div>";return htmlToDraw;}
this.drawButtons=function(){var options=this.options;var htmlToDraw="";if(options.buttons){for(var i=0;i<options.buttons.length-1;i++){button=options.buttons[i];if(button){htmlToDraw+="<input name='"+button.name+"' value='"+lng(button.value)+"' class='fieldSetButton' type='button'>&nbsp;";}}
button=options.buttons[i];if(button){htmlToDraw+="<input name='"+button.name+"' value='"+lng(button.value)+"' class='fieldSetButton' type='button'>";}}
return htmlToDraw;}
jsFieldSetClientView.prototype.ontabclick=function(event){this.switchTab(event.data.tabInx);}
jsFieldSetClientView.prototype.onpageclick=function(event){if(event.data.prev){this.switchPage(this.activeTab-1);}
else if(event.data.next){this.switchPage(this.activeTab+1);}
else{this.switchPage(event.data.pageInx);}}
jsFieldSetClientView.prototype.setTabClicks=function(){var tabLinkSel=this.tabBarSel+">span:eq(0)>span:eq(1)>a";for(var i=1;i<this.ctrl.children.length;i++){$(tabLinkSel).bind("click",{tabInx:i-1},context(this).callback(this.ontabclick));tabLinkSel=this.tabBarSel+">span:eq("+i+")>span:eq(0)>a";}
$(tabLinkSel).bind("click",{tabInx:this.ctrl.children.length-1},context(this).callback(this.ontabclick));}
jsFieldSetClientView.prototype.setPageClicks=function(){var pageLinkSel;var pos;$(this.pageBarSel+">a.fieldSetPrev").bind("click",{prev:true},context(this).callback(this.onpageclick));pos=this.ctrl.children.length+1;$(this.pageBarSel+">a.fieldSetNext").bind("click",{next:true},context(this).callback(this.onpageclick));for(var i=0;i<this.ctrl.children.length;i++){pos=i+1;pageLinkSel=this.pageBarSel+">a:eq("+pos+")";$(pageLinkSel).bind("click",{pageInx:i},context(this).callback(this.onpageclick));}}
jsFieldSetClientView.prototype.setButtonClicks=function(){var options=this.options;if(options.buttons){var buttonSel;this.buttons={};for(var i=0;i<options.buttons.length;i++){button=options.buttons[i];if(button){buttonSel=this.buttonBarSel+">input:eq("+i+")";this.buttons[button.name]={sel:buttonSel};$(buttonSel).bind("click",{},context(this).callback(button.handler));}}}}
jsFieldSetClientView.prototype.onerrstat=function(){var options=this.options;if(options.slider&&options.collapsed){this.toggleSlider();}
return true;}
this.activeTab=this.options.activeTab?this.options.activeTab:0;this.tabBarSel=null;this.pageBarSel=null;this.bind("errstat",this.onerrstat)}
extend(jsFieldSetClientView,jsCSideView);function jsFieldSetPopUpClientView(ctrl,viewInx,options){options.simple=false;options.nothing=false;jsFieldSetPopUpClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsFieldSetPopUpClientView.prototype.drawView=function(){jsFieldSetPopUpClientView.superclass.drawView.call(this);var dialog=this.viewBoxSel;var caption=this.viewBoxSel+">div.fieldSetMainPath";var options=this.options;if(!options.notCloser){$(caption).append("<div class='dialog_closer'></div>");}
$(caption).css('cursor','move');$(this.viewBoxSel+">div.fieldSetMainPath>div.dialog_closer").click(context(this).callback(this.hide));$(this.viewBoxSel).css({'display':'none','position':'absolute','z-index':'9999','box-shadow':'0px 0px 20px #000','-moz-box-shadow':'0px 0px 20px #000','-webkit-box-shadow':'0px 0px 20px #000'});$(this.viewBoxSel+'>div:last>div:eq(0)').css({'overflow':'auto','width':options.width,'height':options.height});document.extra={dragging:false,oldLeft:0,oldTop:0};$(caption).mousedown(function(e){document.extra.dragging=true;document.extra.oldLeft=e.pageX-$(this).offset().left;document.extra.oldTop=e.pageY-$(this).offset().top;$('body').css('cursor','move');return false;});$(caption).mouseup(function(e){document.extra.dragging=false;$('body').css('cursor','default');return false;});$('body').mouseup(function(e){if(document.extra.dragging){$(caption).mouseup();return false;}});$('body').mousemove(function(e){if(document.extra.dragging){var x=e.pageX-$(caption).offset().left;var y=e.pageY-$(caption).offset().top;$(dialog).css({'left':$(dialog).offset().left+x-document.extra.oldLeft,'top':$(dialog).offset().top+y-document.extra.oldTop});return false;}});return false;}
this.hnd=function(){return true;}
jsFieldSetPopUpClientView.prototype.show=function(){this.ctrl.event("showpopupdlg",this);$(this.viewBoxSel).css('left',$(document).scrollLeft()+$(window).width()/2-$(this.viewBoxSel).width()/2);$(this.viewBoxSel).css('top',$(document).scrollTop()+($(window).height()/2-$(this.viewBoxSel).height()/2));$(this.viewBoxSel).fadeIn("slow");}
jsFieldSetPopUpClientView.prototype.hide=function(){this.ctrl.event("hidepopupdlg",this);$('body').css('overflow','auto');this.hideModalOverlay();$(this.viewBoxSel).fadeOut("slow");}
jsFieldSetPopUpClientView.prototype.showModal=function(){this.ctrl.event("showpopupmodaldlg",this);$('body').css('overflow','hidden');this.showModalOverlay();this.show();}
this.isWin=true;this.bind("showpopupdlg",this.hnd);this.bind("showpopupmodaldlg",this.hnd);this.bind("hidepopupdlg",this.hnd);}
extend(jsFieldSetPopUpClientView,jsFieldSetClientView);function jsEditController(){jsEditController.superclass.constructor.call(this);this.modified=false;this.setModified=function(obj){this.modified=true;return true;}
this.addEventHandler("fieldchange",this.setModified);}
extend(jsEditController,jsController);function jsEditClientView(ctrl,viewInx,options){jsEditClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsEditClientView.prototype.drawView=function(){var htmlToDraw;var options=this.options;var statusCode=this.ctrl.model?this.ctrl.model.statusCode:null;var uid=getUID();var errorMessage=statusCode?lng(statusCode):"";var comment=options.comment?lng(options.comment):"";var inputBoxId="editInputBox"+uid;this.inputId="editInput"+uid;var errorId="editError"+uid;var commentId="editComment"+uid;var style=options.inputPadding?" style='width: "+options.inputPadding+"'":"";this.errorSel="#"+errorId;this.commentSel="#"+commentId;this.inputSel="#"+this.inputId;options.myBoxSel=null;options.childBoxSel="#"+inputBoxId;htmlToDraw="<div class='edit'>";htmlToDraw+="<div class='label'"+style+">";htmlToDraw+="<label for='"+this.inputId+"'>";if(options.humanName){htmlToDraw+=lng(options.humanName)+":"}
else{htmlToDraw+="&nbsp;"}
htmlToDraw+="</label>";htmlToDraw+="</div>";htmlToDraw+="<div id='"+inputBoxId+"' class='input'></div>";htmlToDraw+="<div id='"+errorId+"' class='error'>"+errorMessage+"</div>";htmlToDraw+="<div style='clear: both'></div>";htmlToDraw+="<div id='"+commentId+"'class='comment'>"+comment+"</div>";htmlToDraw+="<div style='clear: both'></div></div>";htmlToDraw+="<div style='clear: both'></div>";var child=this.getChild(0);if(child instanceof jsCSideView){child.options.viewBoxSel=options.childBoxSel;child.inputId=this.inputId;}
$(options.viewBoxSel).html(htmlToDraw);if(options.mandatory&&!options.optional&&!options.summary){this.setMandatory();}
if(!comment.length){this.cleanComment();}
jsEditClientView.superclass.drawView.call(this);}
jsEditClientView.prototype.disable=function(view){this.setOption("disabled",true);$(this.options.viewBoxSel).addClass("editDisabled");this.hideError();var obj=this.getChild(0);if(obj.disable instanceof Function){obj.disable();}
this.clearMandatory();}
jsEditClientView.prototype.enable=function(view){this.setOption("disabled",false);var options=this.options;$(options.viewBoxSel).removeClass("editDisabled");var obj=this.getChild(0);if(obj.statusCode){this.showError();}
if(obj.enable instanceof Function){obj.enable();}
if(options.mandatory&&!options.optional&&!options.summary){this.setMandatory();}}
jsEditClientView.prototype.onvalidate=function(view){if(this.viewInx==view.viewInx){this.setError();}
return false;}
jsEditClientView.prototype.setError=function(statusCode){var child=this.getChild(0);statusCode=statusCode?statusCode:(child.statusCode?child.statusCode:this.statusCode);if(statusCode){$(this.errorSel).html(lng(statusCode));this.showError();}
else{$(this.errorSel).html("");this.hideError();}}
jsEditClientView.prototype.showError=function(){$(this.errorSel).show();$(this.inputSel).addClass('validate');}
jsEditClientView.prototype.hideError=function(){$(this.errorSel).hide();$(this.inputSel).removeClass('validate');}
jsEditClientView.prototype.setComment=function(comment){$(this.commentSel).html(lng(comment));}
jsEditClientView.prototype.cleanComment=function(){$(this.commentSel).html("").hide();}
jsEditClientView.prototype.onfieldchange=function(obj){this.ctrl.getParent().event("fieldchange",{view:this,value:obj.value},true);return false;}
jsEditClientView.prototype.setMandatory=function(){this.clearMandatory();$(this.options.viewBoxSel+" div.label").append("<span class='mandatory'>*</span>");}
jsEditClientView.prototype.clearMandatory=function(){$(this.options.viewBoxSel+" span.mandatory").detach();}
this.bind("fieldchange",this.onfieldchange);this.bind("validate",this.onvalidate);this.errorSel=null;this.commentSel=null;this.inputId=null;this.inputSel=null;}
extend(jsEditClientView,jsCSideView);function jsInputModel(value){jsInputModel.superclass.constructor.call(this);this.value=value;jsInputModel.prototype.toString=function(){var value;if(no(this.value)){value="";}
else{value=this.value;}
return value;}}
extend(jsInputModel,jsModel);function jsInputController(value){jsInputController.superclass.constructor.call(this);jsInputController.prototype.addItem=function(){return this.addChild.apply(this.getChild("field"),arguments);}
this.ifaceTypes.input={type:jsInputSlotView};this.ifaceTypes.select={type:jsInputSlotView};this.ifaceTypes.selectex={type:jsInputSlotView};this.ifaceTypes.radio={type:jsInputSlotView};this.ifaceTypes.radio2={type:jsRadio2SlotView};this.ifaceTypes.checkbox={type:jsInputSlotView};this.ifaceTypes.number={type:jsInputSlotView};this.ifaceTypes.text={type:jsInputSlotView};this.addChild(new jsInputFieldController(value),"field");this.changeModel(this.getChild("field").model);}
extend(jsInputController,jsEditController);function jsInputSlotView(ctrl,viewInx,options){ctrl.getChild("field").nextIface=ctrl.lastIface;if(ctrl.lastIface=="number")options.mandatory=true;jsInputSlotView.superclass.constructor.call(this,ctrl,viewInx,options);jsInputSlotView.prototype.drawView=function(){try{switch(this.ctrl.model.value.__attrs__.mode){case 4:this.setOption("disabled",true);break;case 0:this.options.hide=true;break;}}
catch(e){}
jsInputSlotView.superclass.drawView.call(this);}}
extend(jsInputSlotView,jsEditClientView);function jsRadio2SlotView(ctrl,viewInx,options){ctrl.getChild("field").nextIface=ctrl.lastIface;jsRadio2SlotView.superclass.constructor.call(this,ctrl,viewInx,options);jsRadio2SlotView.prototype.drawView=function(){try{switch(this.ctrl.model.value.__attrs__.mode){case 4:this.setOption("disabled",true);break;case 0:this.options.hide=true;break;}}
catch(e){}
var htmlToDraw;var options=this.options;var statusCode=this.ctrl.model?this.ctrl.model.statusCode:null;var uid=getUID();var errorMessage=statusCode?lng(statusCode):"";var comment=options.comment?lng(options.comment):"";var inputBoxId="editInputBox"+uid;this.inputId="editInput"+uid;var errorId="editError"+uid;var commentId="editComment"+uid;var style=options.inputPadding?" style='padding-left: "+options.inputPadding+"'":"";this.errorSel="#"+errorId;this.commentSel="#"+commentId;this.inputSel="#"+this.inputId;options.myBoxSel=null;options.childBoxSel="#"+inputBoxId;if(options.summary){htmlToDraw="<div class='radio2smr'>";htmlToDraw+="<div class='name'> "+lng(options.humanName)+"</div>";}
else{htmlToDraw="<div class='radio2'>";htmlToDraw+="<div class='name'> "+lng(options.humanName)+":</div>";}
htmlToDraw+="<div class='input' id='"+inputBoxId+"' "+style+"></div>";htmlToDraw+="<div style='clear: both'></div>";htmlToDraw+="</div>";var child=this.getChild(0);if(child instanceof jsCSideView){child.options.viewBoxSel=options.childBoxSel;child.inputId=this.inputId;}
$(options.viewBoxSel).html(htmlToDraw);jsRadio2SlotView.superclass.drawView.call(this);}
jsRadio2SlotView.prototype.disable=function(view){this.setOption("disabled",true);$(this.options.viewBoxSel).addClass("radio2Disabled");this.getChild(0).disable();}
jsRadio2SlotView.prototype.enable=function(view){this.setOption("disabled",false);$(this.options.viewBoxSel).removeClass("radio2Disabled");this.getChild(0).enable();}
jsRadio2SlotView.prototype.setError=function(statusCode){var child=this.getChild(0);statusCode=statusCode?statusCode:(child.statusCode?child.statusCode:this.statusCode);if(statusCode){alert(lng(statusCode));this.showError();}}
this.inputId=null;this.inputSel=null;}
extend(jsRadio2SlotView,jsCSideView);function jsInputFieldController(value){jsInputFieldController.superclass.constructor.call(this);this.ifaceTypes.input={type:jsInputClientView};this.ifaceTypes.select={type:jsSelectClientView};if(!no(window.jsSelectExClientView)){this.ifaceTypes.selectex={type:jsSelectExClientView};}
this.ifaceTypes.radio={type:jsRadioClientView};this.ifaceTypes.radio2={type:jsRadio2ClientView};this.ifaceTypes.checkbox={type:jsCheckboxClientView};this.ifaceTypes.number={type:jsNumberClientView};this.ifaceTypes.text={type:jsStaticTextClientView};this.changeModel(new jsInputModel(value));this.modified=false;this.setModified=function(obj){this.modified=true;return true;}
this.addEventHandler("fieldchange",this.setModified);}
extend(jsInputFieldController,jsController);function jsBaseInputView(ctrl,viewInx,options){jsBaseInputView.superclass.constructor.call(this,ctrl,viewInx,options);jsBaseInputView.prototype.html=function(htmlToDraw){var options=this.options;$(options.viewBoxSel).html(htmlToDraw);this.$input=$(this.inputSel);this.updateView();for(var i in options.extrattrs){this.$input.attr(i,options.extrattrs[i]);}
if(options.title){this.$input.attr("title",lng(options.title));}
if(options.disabled)this.disable();this.$input.bind("blur",context(this).callback(this.onfieldchangejq));}
jsBaseInputView.prototype.onfieldchangejq=function(event){var value=this.val();if(this.lastValue!=value){this.ctrl.event("fieldchange",{view:this,value:value},true);event.stopPropagation();this.validate();this.lastValue=value;}
return true;}
this.val=function(value){if(!no(value)){if(this.options.summary){this.$input.html(value);}
else{this.$input.val(value);}}
if(this.options.summary){return this.$input.html();}
else{return this.$input.val();}}
jsBaseInputView.prototype.disable=function(){$(this.inputSel).attr("disabled",true);}
jsBaseInputView.prototype.enable=function(){$(this.inputSel).attr("disabled",false);}
jsBaseInputView.prototype.validate=function(){if(this.options.optional){var patt=/.*Empty$/;if(patt.test(this.statusCode))this.statusCode=null;}
this.ctrl.event("validate",this,true);return jsBaseInputView.superclass.validate.call(this);}
this.$input=null;this.lastValue=null;}
extend(jsBaseInputView,jsCSideView);function jsInputClientView(ctrl,viewInx,options){jsInputClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsInputClientView.prototype.drawView=function(){jsInputClientView.superclass.drawView.call(this);var htmlToDraw="";var options=this.options;if(options.summary){this.inputSel=options.viewBoxSel;delete this.inputId;}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel="#"+this.inputId;htmlToDraw="<input id='"+this.inputId+"' type='";htmlToDraw+=options.password?"password":"text";htmlToDraw+="'/>";}
this.html(htmlToDraw);}
jsInputClientView.prototype.updateModel=function(){this.ctrl.model.value=this.val();return jsInputClientView.superclass.updateModel.call(this);}
jsInputClientView.prototype.updateView=function(){this.val(this.ctrl.model.value);jsInputClientView.superclass.updateView.call(this);}}
extend(jsInputClientView,jsBaseInputView);function jsSelectClientView(ctrl,viewInx,options){jsSelectClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsSelectClientView.prototype.drawView=function(){jsSelectClientView.superclass.drawView.call(this);var htmlToDraw="";var attr;var options=this.options;var value=this.ctrl.model.value;var valset=options.valset;if(options.summary){this.inputSel=options.viewBoxSel;delete this.inputId;}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel="#"+this.inputId;htmlToDraw="<select id='"+this.inputId+"'>";if(valset){for(var i in valset){htmlToDraw+="<option value='"+valset[i]+"'>"+lng(i)+"</option>";}}
htmlToDraw+="</select>";}
this.html(htmlToDraw);this.$input.unbind("blur");this.$input.bind("change",context(this).callback(this.onfieldchangejq));}
this.val=function(value){var valset=this.options.valset;if(this.options.summary){if(!no(value)){var humanValue="";for(var i in valset){if(value==valset[i]){humanValue=i;break;}}
this.$input.html(lng(humanValue));}
return valset[this.$input.html()];}
else{if(!no(value)){this.$input.val(value);}
return this.$input.val();}}
this.updateModel=function(){this.ctrl.model.value=this.val();return jsSelectClientView.superclass.updateModel.call(this);}
this.updateView=function(){this.val(this.ctrl.model.value);jsSelectClientView.superclass.updateView.call(this);}}
extend(jsSelectClientView,jsBaseInputView);function jsRadioClientView(ctrl,viewInx,options){jsRadioClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsRadioClientView.superclass.drawView.call(this);var htmlToDraw="";var attr;var value=this.ctrl.model.value;var options=this.options;var valset=options.valset;if(options.summary){this.inputSel=options.viewBoxSel;delete this.inputId;var humanValue=value;if(valset){for(var i in valset){if(value==valset[i]){humanValue=i;break;}}}
htmlToDraw+=no(humanValue)?"":lng(humanValue);}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel=options.viewBoxSel+" input[name='"+this.inputId+"']";if(valset){for(var i in valset){htmlToDraw+="<div><label><input type='radio' name='"+this.inputId+"' value='"+valset[i]+"' ";if(value==valset[i]){htmlToDraw+="checked ";}
htmlToDraw+="/>"+lng(i)+"</label></div>";}}}
this.html(htmlToDraw);this.$input.unbind("blur");this.$input.bind("change",context(this).callback(this.onfieldchangejq));}
this.val=function(value){var valset=this.options.valset;if(this.options.summary){if(!no(value)){var humanValue="";for(var i in valset){if(value==valset[i]){humanValue=i;break;}}
this.$input.html(lng(humanValue));}
return valset[this.$input.html()];}
else{if(!no(value)){var j=0;for(var i in valset){if(value==valset[i]){this.$input.eq(j).attr("checked",true);}
else{this.$input.eq(j).attr("checked",false);}
j++;}}
if(this.$input.length>0&&!this.$input.filter(":checked").length){return this.$input.filter(":eq(0)").val();}
else{return this.$input.filter(":checked").val();}}}
this.updateModel=function(){this.ctrl.model.value=this.val();return jsRadioClientView.superclass.updateModel.call(this);}
this.updateView=function(){this.val(this.ctrl.model.value);jsRadioClientView.superclass.updateView.call(this);}}
extend(jsRadioClientView,jsBaseInputView);function jsRadio2ClientView(ctrl,viewInx,options){jsRadio2ClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsRadio2ClientView.superclass.drawView.call(this);var htmlToDraw="";var attr;var value=this.ctrl.model.value;var options=this.options;var valset=options.valset;var obj;var id;if(options.summary){this.inputSel=options.viewBoxSel;delete this.inputId;}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel=this.myBoxSel+" input[name='"+this.inputId+"']";if(valset){htmlToDraw+="<ul class='radio2'>";for(var i in valset){obj=valset[i];id=this.inputId+"_"+i;htmlToDraw+="<li onclick='var obj = $(this).children(\"input\"); obj.attr(\"checked\", true); obj.change();'>";htmlToDraw+="<input name='"+this.inputId+"' type='radio' value='"+i+"'>";htmlToDraw+=obj.value?lng(obj.value):"";htmlToDraw+="<div>";htmlToDraw+=obj.desc?lng(obj.desc):"";htmlToDraw+="</div>";htmlToDraw+="</li>";}
htmlToDraw+="</ul>";}}
this.html(htmlToDraw);this.$input.unbind("blur");this.$input.bind("change",context(this).callback(this.onfieldchangejq));}
this.val=function(value){var valset=this.options.valset;if(this.options.summary){if(!no(value)){this.$input.html(lng(valset[value].value));}
var humanValue=this.$input.html();for(var i in valset){if(humanValue==lng(valset[i])){return i;}}}
else{if(!no(value)){var j=0;for(var i in valset){if(value==i){this.$input.eq(j).attr("checked",true);}
else{this.$input.eq(j).attr("checked",false);}
j++;}}
if(this.$input.length>0&&!this.$input.filter(":checked").length){return this.$input.filter(":eq(0)").val();}
else{return this.$input.filter(":checked").val();}}}}
extend(jsRadio2ClientView,jsRadioClientView);function jsCheckboxClientView(ctrl,viewInx,options){jsCheckboxClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsCheckboxClientView.superclass.drawView.call(this);var htmlToDraw="";var options=this.options;if(options.summary){this.inputSel=options.viewBoxSel;delete this.inputId;}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel="#"+this.inputId;htmlToDraw+="<input type='checkbox' "
+"id='"+this.inputId+"' "
+"value='unimportant'>";}
this.html(htmlToDraw);this.$input.unbind("blur");this.$input.bind("change",context(this).callback(this.onfieldchangejq));}
this.val=function(value){var options=this.options;var valset=options.valset;if(options.summary){if(!no(value)){if(value==valset.on){this.$input.html(lng("yes"));}
else{this.$input.html(lng("no"));}}
if(this.$input.html()==lng("yes")){return valset.on;}
else{return valset.off;}}
else{if(!no(value)){if(value==options.valset.on){this.$input.attr("checked",true);}
else{this.$input.attr("checked",false);}}
if(this.$input.attr("checked")){return valset.on;}
else{return valset.off;}}}
this.updateModel=function(){this.ctrl.model.value=this.val();return jsCheckboxClientView.superclass.updateModel.call(this);}
this.updateView=function(){this.val(this.ctrl.model.value);jsCheckboxClientView.superclass.updateView.call(this);}}
extend(jsCheckboxClientView,jsBaseInputView);function jsNumberClientView(ctrl,viewInx,options){jsNumberClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsNumberClientView.superclass.drawView.call(this);}
this.updateView=function(){jsNumberClientView.superclass.updateView.call(this);}
this.updateModel=function(){var res=false;if(this.validate()){res=jsNumberClientView.superclass.updateModel.call(this);var value=this.ctrl.model.value;if(value&&value!=""){this.ctrl.model.value=parseInt(this.ctrl.model.value,10);}}
return res;}
this.validate=function(){var result=true;var value;var re=new RegExp("^[0-9]+(\.?[0-9]+|[0-9]*)$");var options=this.options;value=this.val();if(value.match(/^\s*$/)){this.statusCode="numEmpty";}
else if(!re.test(value)){this.statusCode="numNaN";}
else if(!no(options.minval)&&value<options.minval){this.statusCode="numLessThanMin";}
else if(!no(options.maxval)&&value>options.maxval){this.statusCode="numMoreThanMax";}
else{this.statusCode=null;}
if((this.options.ishidden||this.options.disabled)&&this.statusCode){this.val(undefined);this.statusCode=null;}
return jsNumberClientView.superclass.validate.call(this);}}
extend(jsNumberClientView,jsInputClientView);function jsStaticTextClientView(ctrl,viewInx,options){jsStaticTextClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsStaticTextClientView.prototype.drawView=function(){jsStaticTextClientView.superclass.drawView.call(this);var options=this.options;this.inputSel=options.viewBoxSel;delete this.inputId;this.html("");}
this.val=function(value){if(!no(value)){this.$input.html(value);}
return this.$input.html();}
jsStaticTextClientView.prototype.updateView=function(){this.val(this.ctrl.model.value);jsStaticTextClientView.superclass.updateView.call(this);}}
extend(jsStaticTextClientView,jsBaseInputView);controlTypes.input=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="input";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
controlTypes.password=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="input";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;opt.password=true;}
controlTypes.select=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="select";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;opt.valset=obj.valset;}
controlTypes.radio=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="radio";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;opt.valset=obj.valset;}
controlTypes.checkbox=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="checkbox";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;if(obj.valset){opt.valset=obj.valset;}
else{opt.valset={on:true,off:false};}}
controlTypes.number=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="number";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;opt.minval=obj.minval;opt.maxval=obj.maxval;}
controlTypes.text=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="text";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
controlTypes.selectex=function(obj){obj.ctrl=new jsInputController(obj.value);obj.nextIface="selectex";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;opt.editable=obj.editable;opt.width=obj.width;opt.height=obj.height;}
function jsSelectExClientView(ctrl,viewInx,options){jsSelectExClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsSelectExClientView.prototype.drawView=function(){var htmlToDraw="";var options=this.options;var elemID="elemID"+getUID();var childCtrls=this.ctrl.children;var childBoxSel=null;var obj;if(options.summary){this.inputSel=options.viewBoxSel+">div.selectex>div.s_ex_input";this.childBoxSel=options.viewBoxSel+">div.selectex>div.box";this.options.childBoxSel=this.childBoxSel;if(childCtrls.length>0){obj=this.getChild(0);obj.options.viewBoxSel=this.options.childBoxSel;obj.viewBoxSel=obj.options.viewBoxSel;}
htmlToDraw+="<div class='selectex'>";htmlToDraw+="<div class='s_ex_input'></div>";htmlToDraw+="<div class='box'></div>";htmlToDraw+="</div>";delete this.inputId;}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel="#"+this.inputId;this.childBoxSel=options.viewBoxSel+">div.selectex>div.box";this.options.childBoxSel=this.childBoxSel;if(childCtrls.length>0){obj=this.getChild(0);obj.options.viewBoxSel=this.options.childBoxSel;obj.viewBoxSel=obj.options.viewBoxSel;}
htmlToDraw+="<div class='selectex'>";htmlToDraw+="<div class='s_ex_input'>";htmlToDraw+="<input type='text' id='"+this.inputId+"'";if(!options.editable){htmlToDraw+=" readonly='readonly'";}
htmlToDraw+="/>";htmlToDraw+="</div>";htmlToDraw+="<div class='s_ex_btn'>&nbsp;</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="<div class='box'></div>";htmlToDraw+="</div>";}
this.html(htmlToDraw);jsSelectExClientView.superclass.drawView.call(this);if(!options.summary){if(options.width){$(this.childBoxSel).css('width',options.width);}
if(options.height){$(this.childBoxSel).css('height',options.height);}
if(childCtrls.length>0){$(this.childBoxSel).append("<div/>");}
if(!options.disabled){this.$input.click(context(this).callback(this.showBox));$(options.viewBoxSel+'>div.selectex>div.s_ex_btn').click(context(this).callback(this.setDisplayBox));this.$input.keypress(context(this).callback(this.keyPress));if($.browser.msie||$.browser.webkit){this.$input.keydown(context(this).callback(this.keyDown));}
$(window).click(context(this).callback(this.onbodyclick));$(options.viewBoxSel).click(context(this).callback(this.onviewboxclick));}
else{$(options.viewBoxSel+'>div.selectex>div.s_ex_btn').addClass("disabled");}
this.getChild(0).setItemSelected(this.ctrl.model.value);}}
this.onbodyclick=function(){if(!this.infocus){this.hideBox(this.getChild(0).selectedSelectExItem.length);}
this.infocus=false;return true;}
this.onviewboxclick=function(){this.infocus=true;}
this.setDisplayBox=function(e){this.$input.focus();if($(this.childBoxSel).is(':visible')){this.hideBox(false);}else{this.showBox();}
this.onviewboxclick(e);$(window).click();return false;}
this.showBox=function(){$(this.childBoxSel).slideDown();}
this.hideBox=function(isSelected){if(!isSelected){this.updateView();}
$(this.childBoxSel).slideUp();}
this.keyDown=function(event){if(event.keyCode==9||event.keyCode==38||event.keyCode==40){this.keyPress(event);return false;}}
this.keyPress=function(event){var rootOfList=this.getChild(0);var item;var name;if(event.keyCode==13){if($(this.childBoxSel).is(':visible')){if(rootOfList.currentSelectExItem){if(rootOfList.currentSelectExItem.getName()){this.onselectitem(rootOfList.currentSelectExItem);}
var i=this.$input.val().length;this.$input.caret(i,i);}}
else if(!$(this.childBoxSel).is(':visible')){this.showBox();}}
if(!isCharCode(event.which)&&event.keyCode!=9&&event.keyCode!=38&&event.keyCode!=40){return true;}
if(!$(this.childBoxSel).is(':visible')){this.showBox();}
if(event.keyCode==38){if(rootOfList.currentSelectExItem.ctrl.thisInx>0){item=rootOfList.currentSelectExItem.getParent().getChild(rootOfList.currentSelectExItem.ctrl.thisInx-1).setItemSelected();name=item.getName();if(name){this.$input.val(lng(name));}}
return true;}
if(event.keyCode==40){if(rootOfList.currentSelectExItem.ctrl.thisInx<rootOfList.currentSelectExItem.ctrl.getParent().children.length-1){item=rootOfList.currentSelectExItem.getParent().getChild(rootOfList.currentSelectExItem.ctrl.thisInx+1).setItemSelected();name=item.getName();if(name){this.$input.val(lng(name));}}
return true;}
var nchar='';var offset=0;if(event.keyCode!=9&&event.keyCode!=38&&event.keyCode!=40){rootOfList.clearVisited();nchar=String.fromCharCode(event.which);offset=1;}
var caret=$(event.target).caret();var leftText=this.$input.val().substring(0,caret.start)+nchar;var rightText=rootOfList.searchItem(leftText);if(rootOfList.selectedSelectExItem.length>0&&rightText==null){rootOfList.clearVisited();rightText=rootOfList.searchItem(leftText);}
if(rightText!=null){this.$input.val(rightText);this.$input.caret(caret.start+offset,rightText.length);}else{this.$input.caret(caret.start,this.$input.val().length);}
return false}
isCharCode=function(x){if(x>46&&x!=91&&x!=92||x==32){return true;}else{return false;}}
this.updateModel=function(){this.ctrl.model.value=this.val();return jsSelectExClientView.superclass.updateModel.call(this);}
this.updateView=function(){this.val(this.ctrl.model.value);jsSelectExClientView.superclass.updateView.call(this);}
this.onselectitem=function(obj){var name=lng(obj.getName());var val=obj.ctrl.model.getValue();this.tempValue=val;this.$input.val(name);obj.setItemSelected();this.hideBox(true);this.ctrl.event('fieldchange',{view:this,value:val},true);return false;}
this.val=function(value){if(!no(value)){var name=this.getChild(0).findItemName(value);if(this.options.summary){this.$input.html(lng(name));}
else{this.$input.val(lng(name));}
this.tempValue=value;}
return this.tempValue;}
this.bind("selectitem",this.onselectitem);this.tempValue=this.ctrl.model.value;this.infocus=false;}
extend(jsSelectExClientView,jsBaseInputView);function jsSelectExItemModel(itemInfo){jsSelectExItemModel.superclass.constructor.call(this);this.itemName=(itemInfo.name)?itemInfo.name:'';this.itemValue=(itemInfo.value)?itemInfo.value:null;this.getValue=function(){if(!this.ctrl.children.length){return this.ctrl.model.itemValue;}
return null;};}
extend(jsSelectExItemModel,jsModel);function jsSelectExItemController(itemInfo,options){jsSelectExItemController.superclass.constructor.call(this);if(itemInfo==undefined){itemInfo={};}
this.changeModel(new jsSelectExItemModel(itemInfo));this.ifaceTypes.tree={type:jsSelectExItemView,def:true,options:{style:null,open:false,noPath:true}};}
extend(jsSelectExItemController,jsController);function jsSelectExItemView(ctrl,viewInx,options){jsSelectExItemView.superclass.constructor.call(this,ctrl,viewInx,options);this.getName=function(){if(!this.ctrl.children.length){return this.ctrl.model.itemName;}
return null;};this.click=function(e){this.ctrl.event("selectitem",this,true);return true;}
jsSelectExItemView.prototype.drawView=function(){jsSelectExItemView.superclass.drawView.call(this);if(!this.ctrl.root){$(this.myBoxSel).html(lng(this.ctrl.model.itemName));$(this.viewBoxSel).parent().addClass('selectexItem');if(this.ctrl.children.length>0){$(this.viewBoxSel).addClass('branch_close');}else{$(this.viewBoxSel).addClass('leaf');$(this.viewBoxSel+'>a').bind('click',context(this).callback(this.click));}}}
jsSelectExItemView.prototype.onactivate=function(){jsSelectExItemView.superclass.onactivate.call(this);if(!this.ctrl.root){if(this.ctrl.children.length>0){$(this.viewBoxSel).removeClass('branch_close');$(this.viewBoxSel).addClass('branch_open');}else{$(this.viewBoxSel+'>a').css('font-weight','normal');}}
return false;}
jsSelectExItemView.prototype.ondeactivate=function(){jsSelectExItemView.superclass.ondeactivate.call(this);if(!this.ctrl.root){if(this.ctrl.children.length>0){$(this.viewBoxSel).removeClass('branch_open');$(this.viewBoxSel).addClass('branch_close');}}
return false;}
this.setItemSelected=function(value){if(no(value)||value==this.ctrl.model.itemValue){this.clearSelection();$(this.options.viewBoxSel).addClass('marked');this.ctrl.activate();this.rootOfTree.currentSelectExItem=this;this.rootOfTree.selectedSelectExItem.push(this);return this;}
else{var obj;for(var i in this.ctrl.children){obj=this.getChild(i).setItemSelected(value);if(obj){return obj;}}}
return null;}
this.clearSelection=function(){$(this.rootOfTree.options.viewBoxSel+' ul.selectexItem>li.marked').removeClass('marked');}
this.clearVisited=function(){this.rootOfTree.selectedSelectExItem=[];}
this.isNotVisited=function(){for(var i in this.rootOfTree.selectedSelectExItem){if(this.rootOfTree.selectedSelectExItem[i]==this){return false;}}
return true;}
this.searchItem=function(str){var result=null;var obj;var currName=lng(this.ctrl.model.itemName);if(this.isNotVisited()&&!no(this.ctrl.model.itemValue)&&currName.length>=str.length&&currName.substring(0,str.length).toLowerCase()==str.toLowerCase()){this.setItemSelected();return currName;}
else{for(var i in this.ctrl.children){result=this.getChild(i).searchItem(str);if(!no(result)){return result;}}}
return null;}
this.findItemName=function(value){var model=this.ctrl.model;if(model.itemValue==value){return model.itemName;}
else{var itemName;for(var i in this.ctrl.children){itemName=this.getChild(i).findItemName(value);if(!no(itemName)){return itemName;}}}
return null;}
this.selectedSelectExItem=[];this.bind("activate",this.onactivate);this.bind("deactivate",this.ondeactivate);}
extend(jsSelectExItemView,jsViewTree);function jsSubNetAddrModel(bits,addr,radix,delim,expandZero,omitFullMask){jsSubNetAddrModel.superclass.constructor.call(this);jsSubNetAddrModel.prototype.getMaskParts=function(){var i=0;var partCount=this.parts.length;var partMax=Math.pow(2,this.partBitCount)-1;var b=this.bitmask-this.partBitCount;var maskParts=new Array();while(b>=0&&i<partCount){maskParts[i++]=partMax;b-=this.partBitCount;}
if(i<partCount){if(b<0&&b<Math.abs(this.partBitCount)){maskParts[i++]=(~(Math.pow(2,Math.abs(b))-1))&(Math.pow(2,this.partBitCount)-1);}
while(i<partCount){maskParts[i++]=0;}}
return maskParts;}
jsSubNetAddrModel.prototype.applyMask=function(){var maskParts=this.getMaskParts();for(var i=0;i<this.parts.length;i++){this.parts[i]=this.parts[i]&maskParts[i];}}
jsSubNetAddrModel.prototype.setParts=function(addr,radix,delim){try{this.attrs=addr.__attrs__;}
catch(e){}
if(!(addr instanceof Array)){var addrArray=(new String(addr)).split('/');addr=addrArray[0];if(addrArray.length>1){this.bitmask=addrArray[1];}
else{this.bitmask=this.bits}}
this.radix=no(radix)?this.radix:radix;this.delim=no(delim)?this.delim:delim;if(!addr&&this.parts instanceof Array){for(var i in this.parts){this.parts[i]=null;}}
else if(addr){if(addr instanceof Array){this.parts=addr;}
else{if(this.radix&&this.delim){var strParts=addr.split(this.delim);this.partBitCount=this.bits/strParts.length;for(var i in strParts){this.parts[i]=this.parsePart(strParts[i],this.radix);}}}}
this.partBitCount=this.bits/this.parts.length;this.digitCount=Math.ceil(Math.log(Math.pow(2,this.partBitCount))/Math.log(this.radix));}
jsSubNetAddrModel.prototype.parsePart=function(part,radix){var res=null;if(!this.checkPart(part,Math.pow(2,this.partBitCount)-1)){res=parseInt(part,radix);}
return res;}
this.checkPart=function(part,maxval,radix){var res=null;var empty=(no(part)||part.toString().match(/^\s*$/));var isString=part instanceof String||typeof(part)=="string";var radix=radix?radix:this.radix;if(empty){res="Empty";}
else{if(isString){var p=parseInt(part,radix).toString(radix);if(!part.match(/^0+$/)&&(p=="NaN"||p.length!=part.replace(/^0*/,"").length)){res="NaN";}
else{part=parseInt(part,radix);}}
if(!res){if(part<0){res="OutOfScope";}
else if(part>maxval){res="OutOfScope";}}}
return res;}
jsSubNetAddrModel.prototype.toString=function(){var parts=this.parts;var addr="";var clear=false;var part;var format="%."+this.digitCount;switch(this.radix){case 2:format+="b";break;case 8:format+="o";break;case 10:format+="d";break;case 16:format+="X";break;default:format+="d";break;}
if(parts.length){var noPart;for(var i=0;i<parts.length-1;i++){part=parts[i];noPart=no(part)&&!this.optionalParts
if(!noPart&&!this.checkPart(part,Math.pow(2,this.partBitCount)-1)){if(no(part))part=0;if(this.expandZero){addr+=sprintf(format,part)+this.delim;}
else{addr+=part.toString(this.radix)+this.delim;}}
else{clear=true;break;}}
part=parts[parts.length-1];noPart=no(part)&&!this.optionalParts
if(!noPart&&!clear){if(no(part))part=0;if(this.expandZero){addr+=sprintf(format,part);}
else{addr+=part.toString(this.radix);}}
else{addr="";}}
if(this.omitFullMask){if(addr!=""&&this.bitmask&&this.bitmask<this.bits)addr+="/"+this.bitmask;}
else{if(addr!=""&&this.bitmask)addr+="/"+this.bitmask;}
return addr;}
this.bitmask=bits;this.omitFullMask=omitFullMask;this.parts=[];this.bits=bits;this.radix=radix;this.delim=delim;this.partBitCount=null;this.digitCount=null;if(addr instanceof Object){this.attrs=addr.__attrs__;}
this.setParts(addr,radix,delim);this.expandZero=expandZero;}
extend(jsSubNetAddrModel,jsModel);function jsSubNetAddrController(bits,addr,radix,delim,expandZero,omitFullMask){jsSubNetAddrController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsSubNetAddrSlotView,options:{}};this.addChild(new jsSubNetAddrFieldController(bits,addr,radix,delim,expandZero,omitFullMask),"field");this.changeModel(this.getChild("field").model);}
extend(jsSubNetAddrController,jsEditController);function jsSubNetAddrFieldController(bits,addr,radix,delim,expandZero,omitFullMask){jsSubNetAddrFieldController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsSubNetAddrClientView,options:{}};this.changeModel(new jsSubNetAddrModel(bits,addr,radix,delim,expandZero,omitFullMask));}
extend(jsSubNetAddrFieldController,jsController);function jsSubNetAddrSlotView(ctrl,viewInx,options){ctrl.getChild("field").nextIface=ctrl.lastIface;options.mandatory=true;jsSubNetAddrSlotView.superclass.constructor.call(this,ctrl,viewInx,options);jsSubNetAddrSlotView.prototype.drawView=function(){try{switch(this.ctrl.model.attrs.mode){case 4:this.setOption("disabled",true);break;case 0:this.options.hide=true;break;}}
catch(e){}
jsSubNetAddrSlotView.superclass.drawView.call(this);}}
extend(jsSubNetAddrSlotView,jsEditClientView);function jsSubNetAddrClientView(ctrl,viewInx,options){jsSubNetAddrClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsSubNetAddrClientView.prototype.drawView=function(){jsSubNetAddrClientView.superclass.drawView.call(this);var htmlToDraw;var model=this.ctrl.model;var options=this.options;if(options.summary){this.inputSel=options.viewBoxSel;delete this.inputId;}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel="#"+this.inputId;var	size=model.digitCount*model.parts.length+model.parts.length-1;htmlToDraw="<input id='"+this.inputId+"' type='";htmlToDraw+=options.password?"password":"text";htmlToDraw+="' maxlength='"+size+"'";htmlToDraw+="' size='"+size+"'";htmlToDraw+="/>";}
this.html(htmlToDraw);if(!options.summary&&(model.bitmask<model.bits||!model.omitFullMask)){var size=parseInt(this.$input.attr("size"));this.bitmaskDigitCount=Math.ceil(Math.log(this.ctrl.model.bits)/Math.log(10));size+=this.bitmaskDigitCount+1;this.$input.attr("size",size).attr("maxlength",size);}}
jsSubNetAddrClientView.prototype.validate=function(){this.statusCode=null;var notEmpty;value=this.val();if(value.match(/^\s*$/)){this.statusCode="netAddrEmpty";}
value=value.split("/")[0];var parts=value.split(this.ctrl.model.delim);for(var i=0;i<parts.length;i++){value=parts[i];if(!no(value)&&!value.toString().match(/^\s*$/)){notEmpty=true;}
this.statusCode=this.ctrl.model.checkPart(value,Math.pow(2,this.partBitCount)-1);if((this.options.ishidden||this.options.disabled)&&this.statusCode){this.val(undefined);this.statusCode=null;}
if(this.statusCode){if(this.statusCode=="Empty")this.statusCode="Invalid";this.statusCode="netAddr"+this.statusCode;break;}}
if(!this.options.ishidden&&!this.options.disabled&&!notEmpty)this.statusCode="netAddrEmpty";if(!this.statusCode){var arr=value.split("/");if(arr instanceof Array&&arr[1]){this.statusCode=this.ctrl.model.checkPart(arr[1],this.ctrl.model.bits,10);if(this.statusCode){this.statusCode="netAddr"+this.statusCode;}}}
return jsSubNetAddrClientView.superclass.validate.call(this);}
jsSubNetAddrClientView.prototype.updateModel=function(){if(this.validate()){this.ctrl.model.setParts(this.val());return jsSubNetAddrClientView.superclass.updateModel.call(this);}
else{return false;}}
jsSubNetAddrClientView.prototype.updateView=function(){this.val(this.ctrl.model.toString());jsSubNetAddrClientView.superclass.updateView.call(this);}
jsSubNetAddrClientView.prototype.onfieldchange=function(obj){if(this.ctrl.subIPController){this.ctrl.subIPController.getChild(0).event("guessmask",obj.value);}
return true;}
this.onguessmask=function(ip){function guessMask(ip){if(ip.indexOf('.')>0){var classX=parseInt(ip.substring(0,ip.indexOf('.')));if(classX>=1&&classX<=126){return'255.0.0.0';}
if(classX>=128&&classX<=191){return'255.255.0.0';}
if(classX>=192&&classX<=223){return'255.255.255.0';}
return'255.255.255.0';}
return null;}
var mask=guessMask(ip);if(mask){this.ctrl.model.setParts(mask);this.updateView();}
return true;}
this.partCount=this.ctrl.model.parts.length;this.partBitCount=this.ctrl.model.bits/this.partCount;this.bitmaskDigitCount=Math.ceil(Math.log(this.ctrl.model.bits)/Math.log(10));this.bind("fieldchange",this.onfieldchange);this.bind("guessmask",this.onguessmask);}
extend(jsSubNetAddrClientView,jsBaseInputView);controlTypes.mac=function(obj){obj.ctrl=new jsMAController(obj.value);obj.nextIface="client";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
function jsNetAddrController(bits,addr,radix,delim,expandZero){jsNetAddrController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsSubNetAddrSlotView,options:{}};this.addChild(new jsSubNetAddrFieldController(bits,addr,radix,delim,expandZero,true),"field");this.changeModel(this.getChild("field").model);}
extend(jsNetAddrController,jsEditController);function jsMAController(addr){if(!addr)addr=[null,null,null,null,null,null];jsMAController.superclass.constructor.call(this,48,addr,16,":",true);this.ifaceTypes.client.options={delim:":",radix:16};}
extend(jsMAController,jsNetAddrController);controlTypes.ipsubnet=function(obj){obj.ctrl=new jsSubNetIPController(obj.value,obj.version);obj.nextIface="client";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
controlTypes.ipv4subnet=function(obj){obj.ctrl=new jsSubNetIPv4Controller(obj.value);obj.nextIface="client";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
controlTypes.ipv6subnet=function(obj){obj.ctrl=new jsSubNetIPv6Controller(obj.value);obj.nextIface="client";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
function jsSubNetIPModel(bits,addr,radix,delim,expandZero,omitFullMask){jsSubNetIPModel.prototype.setParts=function(addr,radix,delim){if(this.bits==32){jsSubNetIPModel.superclass.setParts.call(this,addr,radix,delim);}
else{if(!addr||addr instanceof Array){jsSubNetIPModel.superclass.setParts.call(this,addr,radix,delim);}
else{this.radix=no(radix)?this.radix:radix;this.delim=no(delim)?this.delim:delim;this.partBitCount=16;var bitmask=addr.split("/")[1];if(no(bitmask)){this.bitmask=this.bits;}
else{this.bitmask=parseInt(bitmask);}
if(addr.match(/^::ffff:[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}/)){this.parts=this.parseIPv4MappedIPv6(addr);}
else if(addr.match(/::/)||addr.match(/^0+:0+/)||addr.match(/0+:0+$/)){this.parts=this.parseShortNotation(addr);}
else{jsSubNetIPModel.superclass.setParts.call(this,addr,radix,delim);}
this.partBitCount=this.bits/this.parts.length;this.digitCount=Math.ceil(Math.log(Math.pow(2,this.partBitCount))/Math.log(this.radix));}}}
this.parseShortNotation=function(addr){addr=addr.split(/\//)[0];addr=addr.replace(/^::/,"z:");addr=addr.replace(/::$/,":z");addr=addr.replace(/^0:0/,"z:");addr=addr.replace(/0:0$/,":z");addr=addr.replace(/::/,":z:");var arr=addr.split(/:/);var parts=[0,0,0,0,0,0,0,0];var j=0;for(var i in arr){if(arr[i]!="z"){parts[j++]=this.parsePart(arr[i],this.radix);}
else{break;}}
j=parts.length-1;for(var i=arr.length-1;i>=0;i--){if(arr[i]!="z"){parts[j--]=this.parsePart(arr[i],this.radix);;}
else{break;}}
return parts;}
this.parseIPv4MappedIPv6=function(addr){var parts=[0,0,0,0,0,0xffff,0,0];var ipv4=addr.match(/[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}/)[0];var arr=ipv4.split(".");var part7=sprintf("%.2X%.2X",parseInt(arr[0],10),parseInt(arr[1],10));parts[6]=this.parsePart(part7,this.radix);var part8=sprintf("%.2X%.2X",parseInt(arr[2],10),parseInt(arr[3],10));parts[7]=this.parsePart(part8,this.radix);return parts;}
jsSubNetIPModel.prototype.toString=function(noMappedIPv4){if(this.bits==32){return jsSubNetIPModel.superclass.toString.call(this);}
else{var addr="";var parts=this.parts;if(!noMappedIPv4&&parts[0]==0&&parts[1]==0&&parts[2]==0&&parts[3]==0&&parts[4]==0&&parts[5]==0xffff){if(!no(parts[6])&&!no(parts[7])){addr=sprintf("::ffff:%d.%d.%d.%d",(parts[6]&0xff00)>>>8,parts[6]&0x00ff,(parts[7]&0xff00)>>>8,parts[7]&0x00ff);if(this.bitmask<this.bits||!this.omitFullMask){addr+="/"+this.bitmask;}}
else{addr=="";}}
else{var z=0;var clear=false;var part=null
for(var i=0;i<parts.length-1;i++){part=parts[i];if(!no(part)&&!this.checkPart(part,Math.pow(2,this.partBitCount)-1)){if(part||(z>0&&z<=i)){addr+=part.toString(this.radix);}
else{z++;}
addr+=this.delim;}
else{clear=true;break;}}
if(!no(parts[parts.length-1])&&!clear){if(parts[parts.length-1]||(z>0&&z<=i)){addr+=parts[parts.length-1].toString(this.radix);}}
else{addr="";}
addr=addr.replace(/:[0:]+/,"::");addr=addr.replace(/::[0:]+/,"::");addr=addr.replace(/:::+/,"::");if(!clear&&(this.bitmask<this.bits||!this.omitFullMask)){addr+="/"+this.bitmask;}}
return addr;}}
jsSubNetIPModel.superclass.constructor.call(this,bits,addr,radix,delim,expandZero,omitFullMask);}
extend(jsSubNetIPModel,jsSubNetAddrModel);function jsSubNetIPController(addr,version,omitFullMask){jsSubNetIPController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsSubNetAddrSlotView,options:{}};this.addChild(new jsSubNetIPFieldController(addr,version,omitFullMask),"field");this.changeModel(this.getChild("field").model);this.setVersion=function(version){this.getChild("field").setVersion(version);}}
extend(jsSubNetIPController,jsEditController);function jsSubNetIPFieldController(addr,version,omitFullMask){jsSubNetIPFieldController.superclass.constructor.call(this);var radix=10;var delim=".";var bits=32;if(version&&version==6){if(!addr)addr=[null,null,null,null,null,null,null,null];radix=16;delim=":";bits=128;}
else{if(!addr)addr=[null,null,null,null];}
this.ifaceTypes.client={type:jsSubNetIPClientView,options:{}};this.changeModel(new jsSubNetIPModel(bits,addr,radix,delim,false,omitFullMask));this.setVersion=function(version){var model=this.model;if(version&&version==6){model.bits=128;model.radix=16;model.delim=":";model.setParts([null,null,null,null,null,null,null,null]);}
else{model.bits=32;model.radix=10;model.delim=".";model.setParts([null,null,null,null]);}
model.bitmask=model.bits;model.partBitCount=model.bits/model.parts.length;model.digitCount=Math.ceil(Math.log(Math.pow(2,model.partBitCount))/Math.log(model.radix));}}
extend(jsSubNetIPFieldController,jsController);function jsSubNetIPv4Controller(addr){jsSubNetIPv4Controller.superclass.constructor.call(this,addr,4);}
extend(jsSubNetIPv4Controller,jsSubNetIPController);function jsSubNetIPv6Controller(addr){jsSubNetIPv6Controller.superclass.constructor.call(this,addr,6,true);}
extend(jsSubNetIPv6Controller,jsSubNetIPController);function jsSubNetIPClientView(ctrl,viewInx,options){jsSubNetIPClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsSubNetIPClientView.prototype.validate=function(){this.statusCode=null;var value=this.val();var arr;if(this.options.ishidden||this.options.disabled)return jsSubNetAddrClientView.superclass.validate.call(this);if(value.match(/^$/)){this.statusCode="netAddrEmpty";return jsSubNetAddrClientView.superclass.validate.call(this);}
if(this.ctrl.model.bits==128){this.ctrl.model.partBitCount=16;if(value.match(/::/)||value.match(/^0+:0+/)||value.match(/0+:0+$/)){if(!value.match(/^::ffff:[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}/)){if(value.match(/^\s*$/)){this.statusCode="netAddrEmpty";}
if(!value.match(/^::$/)&&!value.match(/^::[0:]*$/)&&!value.match(/^[0:]*::$/)){var parts=this.ctrl.model.parseShortNotation(value);if(no(parts[0])||no(parts[1])||no(parts[2])||no(parts[3])||no(parts[4])||no(parts[5])||no(parts[6])||no(parts[7])){this.statusCode="netAddrInvalid";}
if(!this.statusCode){var arr=value.split("/");if(arr instanceof Array&&arr[1]){this.statusCode=this.ctrl.model.checkPart(arr[1],this.ctrl.model.bits,10);if(this.statusCode){this.statusCode="netAddr"+this.statusCode;}}}}}
return jsSubNetAddrClientView.superclass.validate.call(this);}
else{arr=value.split(":");if(arr.length==8){return jsSubNetIPClientView.superclass.validate.call(this);}
else{this.statusCode="netAddrInvalid";return jsSubNetAddrClientView.superclass.validate.call(this);}}}
else{this.ctrl.model.partBitCount=8;arr=value.split(".");if(arr.length==4){return jsSubNetIPClientView.superclass.validate.call(this);}
else{this.statusCode="netAddrInvalid";return jsSubNetAddrClientView.superclass.validate.call(this);}}}}
extend(jsSubNetIPClientView,jsSubNetAddrClientView);controlTypes.ip=function(obj){obj.ctrl=new jsIPController(obj.value,obj.version);obj.nextIface="client";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
controlTypes.ipv4=function(obj){obj.ctrl=new jsIPv4Controller(obj.value);obj.nextIface="client";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
controlTypes.ipv6=function(obj){obj.ctrl=new jsIPv6Controller(obj.value);obj.nextIface="client";if(!obj.options)obj.options={};var opt=obj.options;opt.humanName=obj.name;}
function jsIPController(addr,version,subIPController){jsIPController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsSubNetAddrSlotView,options:{}};this.addChild(new jsIPFieldController(addr,version,subIPController),"field");this.changeModel(this.getChild("field").model);this.setVersion=function(version){this.getChild("field").setVersion(version);}}
extend(jsIPController,jsEditController);function jsIPFieldController(addr,version,subIPController){jsIPFieldController.superclass.constructor.call(this);if(subIPController){this.subIPController=subIPController;}else this.subIPController=null;var radix=10;var delim=".";var bits=32;if(version&&version==6){if(!addr)addr=[null,null,null,null,null,null,null,null];radix=16;delim=":";bits=128;}
else{if(!addr)addr=[null,null,null,null];}
this.changeModel(new jsSubNetIPModel(bits,addr,radix,delim,false,true));this.ifaceTypes.client={type:jsSubNetIPClientView,options:{}};this.setVersion=function(version){var model=this.model;if(version&&version==6){model.bits=128;model.radix=16;model.delim=":";model.setParts([null,null,null,null,null,null,null,null]);}
else{model.bits=32;model.radix=10;model.delim=".";model.setParts([null,null,null,null]);}
model.bitmask=model.bits;model.partBitCount=model.bits/model.parts.length;model.digitCount=Math.ceil(Math.log(Math.pow(2,model.partBitCount))/Math.log(model.radix));}}
extend(jsIPFieldController,jsController);function jsIPv4Controller(addr,subIPv4Controller){jsIPv4Controller.superclass.constructor.call(this,addr,4,subIPv4Controller);}
extend(jsIPv4Controller,jsIPController);function jsIPv6Controller(addr){jsIPv6Controller.superclass.constructor.call(this,addr,6,null);}
extend(jsIPv6Controller,jsIPController);function jsDecorController(){jsDecorController.superclass.constructor.call(this);this.ifaceTypes.separator={type:jsSeparatorView};}
extend(jsDecorController,jsController);function jsSeparatorView(ctrl,viewInx,options){jsSeparatorView.superclass.constructor.call(this,ctrl,viewInx,options);jsSeparatorView.prototype.drawView=function(){jsSeparatorView.superclass.drawView.call(this);var htmlToDraw;var options=this.options?this.options:{};htmlToDraw="<div class='decorSeparator'>"
+"<div class='decorLabelImage'></div>"
+"<div class='decorLabelText'>"
if(options.label){htmlToDraw+="<font>"
+"&nbsp;&nbsp;"+lng(options.label)
+"</font>";}
htmlToDraw+="</font>"
+"</div>"
+"<div class='decorEndUpImage'>"
+"</div>"
+"</div>";htmlToDraw+="<div class='decorSection'>"
+"<div class='decorDescImage'></div>";htmlToDraw+="</div>";if(options.descText){htmlToDraw+="<div class='decorDescText'>"
+lng(options.descText)
+"</div>";}
htmlToDraw+="<div class='decorSpacer'></div>";$(options.viewBoxSel).html(htmlToDraw);}}
extend(jsSeparatorView,jsCSideView);(function(){var plugin=jQuery.sub();jQuery.fn.lightUIOverlay=function(){var $overlay=this.find(">.lightUI>.overlay");if(!$overlay.length){this.append("<div class='lightUI'><div class='overlay' style='display: none'></div></div>");this.css("position","relative");}
plugin.fn.extend({show:function(){if(this.is(":visible")){var $content=this.find(">.lightUI>.overlay");var nodeName=this.get(0).nodeName;this.find(">.lightUI>.overlay").css("display","");}
return this;},hide:function(){this.find(">.lightUI>.overlay").css("display","none");return this;}});return plugin(this);}})();(function(){var plugin=jQuery.sub();var rowPlugin=jQuery.sub();var colPlugin=jQuery.sub();var cellPlugin=jQuery.sub();var lockEditing=false;var checkUniqueFlag=function(index,flags){if(is.unset(flags))flags={};if(is.unset(flags.unique))return;if(is.unset(flags.re))flags.re=[];else if(is.func(flags.re)){var foo=flags.re;flags.re=[foo];}
flags.re.push(callbackEx(this,function(value,alias,index,matchCase){var $col=this.col(index);var $cell;if(matchCase){var val;for(var i=0;i<$col.length;i++){$cell=$col.row(i);val=$cell.html();if(is.unset($cell.data("$input"))&&val!=""&&alias==val)return"dup";}}
else{var alias=alias.toLowerCase();var val;for(var i=0;i<$col.length;i++){$cell=$col.row(i);val=$cell.html();if(is.unset($cell.data("$input"))&&val!=""&&alias==val.toLowerCase())return"dup";}}
return null;},index,flags.unique=="hard"?true:false));}
var getRowPattern=function(){var pattern="<tr>";var header=this.data("header");var colspan;for(var i=0;i<header.length;i++){pattern+="<td";colspan=header[i].colspan;if(is.set(colspan)&&colspan>1){pattern+=" colspan="+colspan;}
pattern+="></td>";}
pattern+="</tr>";return pattern;}
var getHeadRow=function(header){var pattern="<tr>";for(var i=0;i<header.length;i++){pattern+="<td";if(header[i].colspan){pattern+=" colspan='"+header[i].colspan+"'";}
if(header[i].rowspan){pattern+=" rowspan='"+header[i].rowspan+"'";}
if(is.set(header[i].name)){if(header[i].notranslate){pattern+=">"+header[i].name;}
else{pattern+=" langkey='"+header[i].name+"'>";pattern+=lng(header[i].name);}}
else{pattern+=">";}
pattern+="</td>";}
pattern+="</tr>";return pattern;}
var getHeadPattern=function(header){var pattern="<thead>";if(is.array(header[0])){for(var i=0;i<header.length;i++){pattern+=getHeadRow(header[i]);}}
else{pattern+=getHeadRow(header);}
pattern+="</thead>";return pattern;}
var getColInx=function(index){if(is.string(index)){var namedColumns=this.data("namedColumns");if(is.unset(namedColumns)){namedColumns=this.data("plugin").data("namedColumns");}
return namedColumns[index].inx;}
else{return index;}}
var zebra=function($grid){$grid.find("tbody tr:even").addClass("even").removeClass("odd");$grid.find("tbody tr:odd").removeClass("even").addClass("odd");}
var selectAll=function(event){$(this).closest("table").find(" tbody td.selectable>input").attr("checked",is.set($(this).attr("checked"))?$(this).attr("checked"):false).trigger("change");}
var selectRow=function(event){var $row=rowPlugin($(this).parent());if($(this).find("input").attr("checked")){$row.selectRow();}
else{$row.unselectRow();}}
var insSelCol=function(){var pattern="<td class='selectable' rowspan='"+this.data("headerHeight")+"'><input type='checkbox'/></td>";this.find("thead tr:first")
.find("td:first")
.before(pattern);this.find("thead tr:first td:first input")
.change(selectAll);this.find("tbody tr")
.find("td:first")
.before("<td class='selectable'><input type='checkbox'/></td>")
.prev()
.change(selectRow);}
var insDragCol=function(){this.find("thead tr:first")
.find("td:last")
.after("<td rowspan='"+this.data("headerHeight")+"'>&nbsp;</td>");this.find("thead tr:first td:last")
.addClass("draggable");this.find("tbody tr")
.find("td:last")
.after("<td class='draggable'>&nbsp;</td>");}
var createInput=function($inputBox,type,flags){var inputFlags;var $input=null;switch(type){case"ipv4":inputFlags=$.extend(true,{maxLength:18},flags);$input=$inputBox.lightUIIPv4(inputFlags);break;case"ipv6":inputFlags=$.extend(true,{maxLength:43},flags);$input=$inputBox.lightUIIPv6(inputFlags);break;case"mac":inputFlags=$.extend(true,{maxLength:17},flags);$input=$inputBox.lightUIMAC(inputFlags);break;case"host":$input=$inputBox.lightUIDomainName(flags);break;case"select":$input=$inputBox.lightUISelect(flags);break;case"combogrid":$input=$inputBox.lightUIComboGrid(flags);break;case"number":$input=$inputBox.lightUINumber(flags);break;case"checkbox":$input=$inputBox.lightUICheckbox(flags);break;case"text":default:if(is.func(type)){$input=type.call($inputBox,flags);}
else{$input=$inputBox.lightUIText(flags);}
break;}
return $input;}
var onedit=function(event){setTimeout(callback(this,function(){if(lockEditing)return;var $cell=cellPlugin(this);var $grid=$cell.data("plugin");var $activeCell=$grid.data("$activeCell");if(is.set($activeCell)){$activeCell.stopEditing();}
$cell.startEditing();var $input=$cell.data("$input");if(is.jquery($input)){var data={$cell:$cell,$input:$input};$input.bind("enter.input",data,ontab)
.bind("tab.input",data,ontab)
.bind("unfocus.input",data,onenter)
.bind("error.input",data,onerror)
.bind("esc.input",data,onescape)
.find("input, select")
.bind("keydown",function(event){$(this).removeClass("error")});if($cell.data("type")=="checkbox"){if(navigator.userAgent.match(/Chrome|Safari/)){$input.unbind("unfocus.input");$(window).bind("click",data,function(event){if(event.target.tagName!="INPUT"){onenter(event);}});}}}
var $buttonAdd=$grid.data("$buttonAdd");if($buttonAdd)$buttonAdd.disable();$grid.data("$activeCell",$cell)}),1);}
var onerror=function(event,errorCode){lockEditing=true;$(this).addClass("error");if(confirm(lng(errorCode)+". "+lng("edit_or_esc"))){setTimeout("$('#"+event.data.$input.find("input, select").attr("id")+"').focus()",1);}
else{onescape.call(this,event);}}
var onenter=function(event){lockEditing=false;$cell=event.data.$cell;$grid=$cell.data("plugin");$cell.applyEditing().stopEditing();$grid.data("editing",false);var $buttonAdd=$grid.data("$buttonAdd");if($buttonAdd)$buttonAdd.enable();}
var ontab=function(event){onenter.call(this,event);var $cell=event.data.$cell;var $editableCells=$cell.parents(".lightUI:eq(0)").find("table td.editable").not(".disabled");var nextInx=$editableCells.index($cell)+1;if(nextInx>=$editableCells.length)nextInx=0;var $next=$editableCells.eq(nextInx);$next.trigger("click");}
var onescape=function(event){lockEditing=false;$cell=event.data.$cell;$grid=$cell.data("plugin");$cell.stopEditing();$grid.data("editing",false);var $buttonAdd=$grid.data("$buttonAdd");if($buttonAdd)$buttonAdd.enable();}
var toggle=function(event){var $options=$(this).parents(".lightUI:eq(0)").find(".options");if($options.is(":visible")){$options.css("display","none");}
else{$options.css("display","block");}}
var clickWin=function(event){var $gridBox=$("#"+event.data.id).closest(".lightUI");if(!$gridBox.length)return;if(!$(event.target).closest(".options, .select .arrow").length){$gridBox.find(".options").css("display","none");}
if(!$(event.target).closest(".combo").length){$input=$gridBox.data("fieldPlugin");if(is.set($input)){var errorCode=$input.validate();if(is.string(errorCode)){$gridBox.trigger("error.input",errorCode);}
else{$gridBox.trigger("unfocus.input");}}}}
var selectOption=function(event,$row){var flags=$(this).data("flags");if(!is.string(flags.combobox.blank)){$(this).data("fieldPlugin").fieldval($row.col(flags.combobox.index).html()).find("input").focus();}
$(this).find(".options").css("display","none");}
var onrowclick=function(event){var $this=$(this);var $grid=$this.data("plugin");var $row=rowPlugin($this.parent());setCookie("viewmode","mobile");if($grid.data("hasEditable")&&getCookie("viewmode")=="mobile"){var formID=gID.get();var $form=$("<div class='lightUI gridMobileForm' id='"+formID+"'><div class='header'></div><div class='content'></div><div class='footer'></div></div>");var $col,$input,$edit,inputFlags,inputType,inputName;var flags=$grid.data("flags");var colBegin=flags.selectable?1:0;var header=$grid.data("header");var $footer=$form.find(".footer");var $content=$form.find(".content");for(var i=colBegin,ii=0;i<colBegin+$grid.ncol();i++,ii++){$cell=$row.col(i);inputName=header[ii].name;if($cell.hasClass("editable")){inputType=$cell.data("type");inputFlags=$cell.data("flags");$edit=$("<div></div>").lightUIEdit(inputName);var value=$cell.html();$input=createInput($edit.find(".input"),inputType,inputFlags).fieldval(value).data("lastRightValue",value);$content.append($edit);$cell.data("$input",$input);}}
function onsave(){$row.applyEditing();$form.remove();}
function oncancel(){$form.remove();$(window).unbind("resize",onresize);}
var $apply=$("<div></div>");$apply.lightUIButton("save").bind("click.button",onsave);$content.append($apply);var $cancel=$("<div></div>");$cancel.lightUIButton("cancel").bind("click.button",oncancel);$content.append($cancel);$form.bind("error.input",function(event,errorCode){var $input=$(event.target).getLightUIElem("input");if(confirm(lng(errorCode)+". "+lng("edit_or_esc"))){setTimeout(function(){$input.find("input, select").focus()},1);}
else{$input.fieldval($input.data("lastRightValue"));}});$form.bind("unfocus.input",function(event,errorCode){var $input=$(event.target).getLightUIElem("input");$input.data("lastRightValue",$input.fieldval());});var inForm;function onresize(event){if(id)clearTimeout(id);var id=setTimeout(function(){$form=$("#"+formID);$form.css({top:$(document).scrollTop(),left:$(document).scrollLeft()+($(window).width()-$form.width())/2});},100);}
function onrelease(event){if(inForm){inForm=false;$(document).one("click",onrelease);return;}
oncancel();}
function onformclick(event){inForm=true;}
$form.bind("enter.input",onsave);$form.bind("esc.input",onsave);$("body").append($form);$(window).resize(onresize).trigger("resize");setTimeout(function(){$(".gridMobileForm").bind("click",onformclick);$(document).one("click",onrelease);},5);}
if(!$row.data("editing"))$grid.trigger("rowclick.grid",[$row]);}
var ondragstart=function(event){event.preventDefault();event.stopImmediatePropagation();var $target=$(event.target);var $grid=$target.closest(".lightUI");var $rows=$target.closest("tbody").find("tr");$rows.mouseover(ondragstep);$("body").bind("mouseup",{$grid:$target.data("plugin")},ondragstop);$(event.target).data("row").startDragging();}
var ondragstop=function(event){event.preventDefault();event.stopImmediatePropagation();var $grid=event.data.$grid;if(!$grid.data("dragging"))return;var $rows=$grid.find("tbody tr");$rows.unbind("mouseover",ondragstep);$("body").unbind("mouseup",ondragstop);event.data.$grid.stopDragging();}
var ondragstep=function(event){event.preventDefault();event.stopImmediatePropagation();var $row=$(event.target).closest("table").find("tbody tr.draggable");if($row.length){rowPlugin($row).moveTo(rowPlugin(this).irow());}}
var applyAttrs=function(value){try{this.data("flags").accessMode=value.__attrs__.mode;}
catch(e){}}
jQuery.fn.lightUIGrid=function(header,nrow,flags){if(!is.array(header)){var $grid=this.data("light_ui_grid");if($grid){return $grid;}
else{return this;}}
if(!is.object(flags))flags={};var $this=plugin(this);var colBegin=flags.selectable?1:0;var _header=$.extend(true,[],header);if(is.array(_header[0])){for(var i=0;i<_header.length-1;i++){var h=_header[i];for(var j=0,c=0;j<h.length;j++){var h0=h[j];if(is.set(h0.rowspan)){var rowspan=h0.rowspan;delete h0.rowspan;h0.spaned={irow:i,icol:j+colBegin};for(var k=1;k<=rowspan;k++){if(is.unset(_header[i+k]))break;_header[i+k].splice(c,0,h0);}}
c+=is.set(h0.colspan)?h0.colspan:1;}}
var header0=_header[_header.length-1];}
else{var header0=_header;}
var namedColumns={};for(var i in header0){var h=header0[i];if(is.object(h)&&is.string(h.index)){namedColumns[h.index]={inx:colBegin+Number(i),name:h.name,header:h};}}
this.data("namedColumns",namedColumns)
.data("header",header0)
.data("headerHeight",is.array(header[0])?header.length:1)
.data("light_ui_grid",$this);var objID=gID.get();var pattern="<table cellspacing='0' cellpadding='0'>"+getHeadPattern(header)+"<tbody>";pattern+="</tbody></table><div class='grid-footer'><div class='grid-footer-left'></div><div class='grid-footer-right'></div></div>";if(is.object(flags.combobox)){flags.clickable=true;if(is.unset(flags.combobox.index))flags.combobox.index=0;pattern="<div class='combo'>"
+"<div class='select'>"
+"<div class='field'></div>"
+"<div class='arrow'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
+"<div class='icon'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
+"<div style='clear: both'></div>"
+"</div>"
+"<div class='options'>"+pattern+"</div>"
+"</div>"
+"</div>";this.html(pattern)
.find(".arrow")
.click(toggle);$(document).bind("click",{id:objID},clickWin);this.bind("rowclick.grid",selectOption);this.find(".select .icon").bind("click",function(event){$(event.target).closest(".lightUI").trigger("iconclick.grid")});var $field=this.find(".select .field");var validType=false;switch(flags.combobox.type){case"ipv4":var inputFlags=$.extend(true,{maxLength:18},flags.combobox.flags);this.data("fieldPlugin",$field.lightUIIPv4(inputFlags));validType=true;break;case"ipv6":var inputFlags=$.extend(true,{maxLength:43},flags.combobox.flags);this.data("fieldPlugin",$field.lightUIIPv6(inputFlags));validType=true;break;case"mac":var inputFlags=$.extend(true,{maxLength:17},flags.combobox.flags);this.data("fieldPlugin",$field.lightUIMAC(inputFlags));validType=true;break;case"host":this.data("fieldPlugin",$field.lightUIDomainName(flags.combobox.flags));validType=true;break;case"text":default:this.data("fieldPlugin",$field.lightUIText(flags.combobox.flags))
validType=true;break;}
if(validType){var blank=flags.combobox.blank;if(is.string(blank)){this.find(".field input").val(lng(blank))
.attr("langkey",blank)
.css("cursor","pointer")
.css("text-align","center")
.click(toggle)
.unbind("keypress")
.unbind("keydown")
.bind("keypress",function(event){event.preventDefault();})
.bind("keydown",function(event){event.preventDefault();});}
this.data("fieldPlugin").bind("unfocus.input",function(event){event.stopPropagation();}).bind("onfocus.input",function(event){event.stopPropagation();setTimeout(callback(this,function(){$(this).closest(".lightUI").trigger("onfocus.input");}),1);}).bind("error.input",function(event,errorCode,keyCode){event.stopPropagation();if(is.set(keyCode)){setTimeout(callback(this,function(){$(this).closest(".lightUI").trigger("error.input",errorCode);}),1);}});}
plugin.fn.extend({validate:function(){return this.data("fieldPlugin").validate();},fieldval:function(value){return this.data("fieldPlugin").fieldval(value);},isEmpty:function(){return this.data("fieldPlugin").isEmpty();},clean:function(){this.data("fieldPlugin").clean();},flags:function(){return this.data("flags");}});}
else{this.html(pattern);}
this.addClass("lightUI grid")
.data("flags",flags)
.find("table").attr("id",objID)
.find("tbody tr").data("plugin",$this)
.find("td").data("plugin",$this);zebra(this);if(flags.selectable)insSelCol.call(this);if(flags.clickable){var $rows=$("#"+objID+" tbody tr");$rows.addClass("clickable");$rows.find("td:not(.draggable,.selectable)").bind("click",onrowclick);}
if(flags.draggable){insDragCol.call(this);var $rows=this.find("tbody tr");var $dragCol=$rows.find("td:last");$dragCol.bind("mousedown",ondragstart);}
if(flags.addable){var $footerLeft=this.find(".grid-footer-left").append("<div></div>");this.data("$buttonAdd",$footerLeft.find(">div:last").lightUIButton("add").bind("button.click",callback($this,function(){this.addRow();})));}
plugin.fn.extend({row:function(i){if(i=="last"){i=this.nrow()-1;}
else if(i=="first"){i=0;}
var $row=rowPlugin(this.find("tbody tr:eq("+i+")"));return $row;},col:function(index){var icol=getColInx.call(this,index);var $col=colPlugin(this.find("tbody tr").find("td:eq("+icol+")"));return $col;},colEditable:function(index,type,inputFlags){if(is.unset(index)||is.unset(type))return this;if(is.unset(inputFlags))inputFlags={};var flags=this.data("flags");var $tbody=this.find("table tbody");var namedColumns=this.data("namedColumns");var header=namedColumns[index].header;var inx=namedColumns[index].inx;header.editable={type:type,flags:inputFlags};if(header.spaned){var $obj=this.find("thead tr").eq(header.spaned.irow).find("td").eq(header.spaned.icol);}
else{var $obj=this.find("thead tr:last td").eq(inx)}
var $col=this.col(index);$col.addClass("editable");$col.data("type",type).data("flags",inputFlags);if(inputFlags.mandatory){$obj.append("<span class='mandatory'>*</span>").addClass("mandatory");$col.addClass("mandatory");}
if(type=="select"&&inputFlags.options){for(var i in inputFlags.options){var def=i;break;}
var $cell;if(is.set(def)){for(var i=0;i<$col.length;i++){$cell=$col.row(i);if(!$cell.html().length){$cell.html(lng(def)).attr("langkey",def);}}}}
checkUniqueFlag.call(this,index,inputFlags);if(flags.clickable){this.data("hasEditable",true);}
else{$col.bind("click",onedit);}
return this;},addRow:function(n){if(is.unset(n))n=1;var flags=this.data("flags");var header=this.data("header");for(var k=0;k<n;k++){var nrow=this.nrow();this.find("table").append(getRowPattern.call(this));var $lastRow=this.row("last");var colBegin=0;if(flags.selectable){$lastRow.find("td:first")
.before("<td class='selectable'><input type='checkbox'/></td>")
.prev()
.change(selectRow);if(this.find("table thead tr:last td.selectable input").attr("checked")){$lastRow.find("td.selectable input")
.attr("checked",true)
.change();}
colBegin=1;}
if(flags.clickable){$lastRow.addClass("clickable");$lastRow.find("td:not(.draggable,.selectable)").bind("click",{$gridBox:this},onrowclick);}
if(flags.draggable){$lastRow.find("td:last")
.after("<td class='draggable'>&nbsp;</td>")
.next()
.mousedown(ondragstart);$lastRow.mouseover(ondragstep);}
$lastRow.addClass("new")
.data("plugin",this)
.find("td")
.data("plugin",this)
.data("row",$lastRow);for(var i=0;i<header.length;i++){var editable=header[i].editable;if(is.set(editable)){$lastRow.col(colBegin+i).editable(editable.type,editable.flags);}}}
zebra(this);this.trigger("addrow.grid",n);return this;},cleanTable:function(){this.find("table tbody tr").remove();return this;},selection:function(){return rowPlugin(this.find("tbody tr.selected"));},nrow:function(){return this.find("tbody tr").length;},ncol:function(){return this.data("header").length;},checkMandatory:function(checkSelected){var res=true;if(checkSelected){var $cellSet=this.find("tbody tr").not(".selected").find("td.mandatory").not(".disabled");}
else{var $cellSet=this.find("tbody td.mandatory").not(".disabled");}
$cellSet.each(function(index,elem){var $cell=cellPlugin($(elem));var $input=createInput($("<div></div>"),$cell.data("type"),$cell.data("flags")).fieldval($cell.html());if($input.isEmpty()){res=false;$cell.addClass("error");}});this.find("thead tr:last td").each(function(index,elem){if($(elem).hasClass("mandatory")){if($(this).parents("table")
.find("tbody tr")
.find("td:eq("+index+")")
.filter(".error")
.length){$(elem).addClass("error");}}});return res;},cleanErrors:function(){this.find("td.error").removeClass("error");return this;},changedRows:function(){return rowPlugin(this.find("tr.changed"));},newRows:function(){return rowPlugin(this.find("tr.new"));},resetNew:function(){this.find("tr.new").removeClass("new");return this;},resetChanged:function(){this.find("tr.changed").removeClass("changed");return this;},resetAll:function(){this.find("tr.changed, tr.new").removeClass("changed").removeClass("new");return this;},stopDragging:function(){var $table=this.find(">table");$table.removeClass("unselectable").find("tbody tr.draggable td").attr("unselectable",false);var $buttonAdd=this.data("$buttonAdd");if($buttonAdd)$buttonAdd.enable();var $row=rowPlugin($table.find("tr.draggable"));$row.removeClass("draggable");this.data("dragging",false).trigger("dragstop.grid",[$row]);return this;}});rowPlugin.fn.extend({col:function(index){var icol=getColInx.call(this,index);var $cell=cellPlugin(this.find("td:eq("+icol+")"));return $cell;},moveTo:function(i){if(!this.length)return this;var src=this.irow();var dst=i;if(is.set(i)){var $parent=this.parent();if(i=="last"){i=$parent.find("tr").length-1;}
else if(i=="first"){i=0;}
var irow=this.irow();if(i!=irow){this.detach();if(i>irow){$parent.find("tr:eq("+(i-1)+")").after(this);}
else{$parent.find("tr:eq("+i+")").before(this);}
zebra(this.data("plugin"));}}
else{this.detach();}
this.data("plugin").trigger("moverow.grid",[src,dst]);return this;},removeRow:function(){return this.moveTo();},selectRow:function(i){this.addClass("selected");var plugin=this.data("plugin");if(plugin.data("flags").selectable){this.find("td.selectable input").attr("checked",true);}
plugin.trigger("selection.grid")
return this;},unselectRow:function(i){this.removeClass("selected");var plugin=this.data("plugin");if(plugin.data("flags").selectable){this.find("td.selectable input").attr("checked",false);this.parents(".lightUI:eq(0)").find("table thead tr:last td.selectable input").attr("checked",false);}
plugin.trigger("selection.grid")
return this;},selected:function(){return this.hasClass("selected");},changed:function(){return this.hasClass("changed");},isNew:function(){return this.hasClass("new");},irow:function(){return this.parent().find("tr").index(this);},startEditing:function(){var $grid=this.data("plugin");var $buttonAdd=$grid.data("$buttonAdd");if($buttonAdd)$buttonAdd.disable();var $col;var flags=$grid.data("flags");var colBegin=flags.selectable?1:0;for(var i=colBegin;i<colBegin+$grid.ncol();i++){$col=this.col(i);if($col.hasClass("editable")){$col.startEditing();var editing=true;}}
if(editing){this.data("editing",true);$grid.data("editing",true);}
return this;},stopEditing:function(){var $col;var $grid=this.data("plugin");var flags=$grid.data("flags");var colBegin=flags.selectable?1:0;var editing=this.data("editing");for(var i=colBegin;i<colBegin+$grid.ncol();i++){$col=this.col(i);if($col.hasClass("editable")){$col.stopEditing();editing=false;}}
this.data("editing",editing);return this;},applyEditing:function(){var $col;var $grid=this.data("plugin");var flags=$grid.data("flags");var colBegin=flags.selectable?1:0;var editing=this.data("editing");for(var i=colBegin;i<colBegin+$grid.ncol();i++){$col=this.col(i);$col.applyEditing();editing=false;}
this.data("editing",editing);return this;},startDragging:function(){var $grid=this.data("plugin");var $table=$grid.find(">table");if($grid.data("editing"))return;this.addClass("draggable");$table.addClass("unselectable");this.find("td").attr("unselectable",true);var $buttonAdd=$grid.data("$buttonAdd");if($buttonAdd)$buttonAdd.disable();$grid.data("dragging",true).trigger("dragstart.grid",[this]);return this;}});colPlugin.fn.extend({row:function(i){var $cell=cellPlugin(this.filter("td:eq("+i+")"));return $cell;},icol:function(){return this.eq(0).parent().find("td").index(this.eq(0));}});cellPlugin.fn.extend({irow:function(){return $(this.parents()[1]).find("tr").index(this.parent());},icol:function(){return this.parent().find("td").index(this);},getColAlias:function(){var icol=this.icol();var namedColumns=this.parents(".lightUI:eq(0)").data("namedColumns");for(var i in namedColumns){if(namedColumns[i].inx==icol){return i;}}
return null;},editable:function(type,inputFlags){var $row=this.parent();this.addClass("editable");if(is.unset(inputFlags))inputFlags={};if(inputFlags.mandatory)this.addClass("mandatory");this.data("type",type).data("flags",inputFlags);if(type=="select"&&inputFlags&&inputFlags.options){for(var i in inputFlags.options){var def=i;break;}
if(is.set(def)&&!this.html().length){this.html(lng(def)).attr("langkey",def);}}
if(inputFlags.disabled){this.disable();}
else{this.enable();}
if($row.hasClass("clickable")){this.data("plugin").data("hasEditable",true);}
else{this.bind("click",onedit);}
return this;},startEditing:function(){var flags=this.data("flags");if(flags.disabled||flags.accessMode==4||flags.accessMode==0)return;var $table=this.closest("table");var $grid=this.data("plugin");var type=this.data("type");var objID=$table.attr("id");var inputID=objID+"_edit_"+this.irow()+"_"+this.icol();if(!$("#"+inputID).length){$grid.append("<div id='"+inputID+"' class='lightUI editable'></div>");}
var $inputBox=$("#"+inputID);var $input=createInput($inputBox,type,flags);if(is.jquery($input)){var $this=$(this);var width=$this.width();var innerWidth=$this.innerWidth();var height=$this.height();var innerHeight=$this.innerHeight();var borderLeft=(new Number($this.css("border-left-width").match(/\d*/)[0])).valueOf();var borderTop=(new Number($this.css("border-top-width").match(/\d*/)[0])).valueOf();var $field=$input.find("input,select");var paddingLeft=(new Number($field.css("padding-left").match(/\d*/)[0])).valueOf();var paddingRight=(new Number($field.css("padding-right").match(/\d*/)[0])).valueOf();if(type=="checkbox"){if(navigator.userAgent.match(/Chrome|Safari/)){$input.css({'position':'absolute','left':$(this).position().left,'top':$(this).position().top,'width':'21px','height':'21px'});}
else{var fieldWidth=$field.width();var fieldHeight=$field.height();$input.css({'position':'absolute','left':$(this).position().left,'top':$(this).position().top+(innerHeight-fieldHeight-1)/2+borderTop});}
$field.focus().select();debug($(this).position());debug($input.css('top'));debug($input.css('left'));var langkey=$this.attr("langkey");if(langkey=="yes"){$input.fieldval(true);}
else{$input.fieldval(false);}
$this.html("");}
else{$input.css({'position':'absolute','left':$(this).position().left+(innerWidth-width)/2+borderLeft,'top':$(this).position().top+(innerHeight-height)/2+borderTop});$field.width($this.width()-paddingLeft-paddingRight).focus().select();if(is.func($input.fieldalias)){$input.fieldalias($(this).attr("langkey"));}
else{$input.fieldval($(this).html());}}
$table.parent().trigger("startEditing.grid",[this,$input]);this.data("$input",$input);$input.data("$cell",this);this.data("editing",true);$grid.data("editing",true);}
return this;},stopEditing:function(){var $input=this.data("$input");if($input){var $grid=this.data("plugin");$grid.trigger("stopEditing.grid",[this,$input]);$input.remove();this.data("$input",null);this.removeClass("error").attr("title","");if(this.data("type")=="checkbox"){var langkey=this.attr("langkey");if(langkey){this.html(lng(langkey));}}}
this.data("editing",false);return this;},applyEditing:function(){var $input=this.data("$input");if($input){var isDataChanged=false;if(is.func($input.fieldalias)){var alias=$input.fieldalias();var lngAlias=lng(alias);var oldLngAlias=this.html();isDataChanged=lngAlias!=oldLngAlias;this.html(lngAlias);this.attr("langkey",alias);}
else{var value=$input.fieldval();if(this.data("type")=="checkbox"){if(value){isDataChanged=(this.attr("langkey")!="yes");this.attr("langkey","yes")
.html(lng("yes"));}
else{isDataChanged=(this.attr("langkey")!="no");this.attr("langkey","no")
.html(lng("no"));}}
else{isDataChanged=this.html()!=value;this.html(value);}}
if(isDataChanged){var $row=this.parent();$row.addClass("changed");this.data("plugin").trigger("cellChange.grid",[this,$input]);}}
return this;},enable:function(){var flags=$.extend(true,{},this.data("flags"));if(is.unset(flags.accessMode)||flags.accessMode!=4){this.removeClass("disabled");flags.disabled=false;this.data("flags",flags);}
return this;},disable:function(){this.addClass("disabled");var flags=$.extend(true,{},this.data("flags"));flags.disabled=true;this.data("flags",flags);return this;},fieldval:function(value){if(this.hasClass("editable")){if(is.set(value)){applyAttrs.call(this,value);var $input=createInput($("<div></div"),this.data("type"),this.data("flags"));if(is.func($input.fieldalias)){$input.fieldval(value);var alias=$input.fieldalias();this.html(lng(alias));this.attr("langkey",alias);}
else if(this.data("type")=="checkbox"){if(value){isDataChanged=(this.attr("langkey")!="yes");this.attr("langkey","yes")
.html(lng("yes"));}
else{isDataChanged=(this.attr("langkey")!="no");this.attr("langkey","no")
.html(lng("no"));}}
else{this.html(value);}
return this;}
else{var $input=createInput($("<div></div"),this.data("type"),this.data("flags"));if(is.func($input.fieldalias)){$input.fieldalias(this.attr("langkey"));return $input.fieldval();}
else if(this.data("type")=="checkbox"){return(this.attr("langkey")=="yes")?true:false;}
else{return this.html();}}}
else{if(is.set(value))return this.html(value);else return this.html();}
},__html__:this.html,html:function(value){if(value instanceof String){arguments[0]=value.valueOf();}
return this.__html__.apply(this,arguments);},validate:function(){if(this.hasClass("editable")){var $input=createInput($("<div></div"),this.data("type"),this.data("flags"));return $input.validate();}
return null;}});$this.addRow(nrow);$this.find("tbody tr.new").removeClass("new");return $this;};})();(function(){var plugin=jQuery.sub();jQuery.fn.lightUIEdit=function(name,comment,flags){if(is.unset(flags))flags={};var applyArgs=function(){if(is.string(comment))this.find(".comment").html(lng(comment)).attr("langkey",comment);if(is.string(flags.inputPadding))this.find(".label").css("width",flags.inputPadding);if(is.string(name)&&name.length){if(name.match(/[\.,;:?!]/)){this.find(".label>span:eq(0)").html("&nbsp;");}
var $label=this.find(".label>label");$label.html(lng(name));$label.attr("langkey",name);}
else{this.find(".label>span:eq(0)").html("&nbsp;");}
if(is.string(flags.altname))this.find(".altname").html(lng(flags.altname)).attr("langkey",flags.altname);this.data("flags",flags);}
var key="$"+this.find(".edit").attr("id");var pattern="<div class='edit'>";pattern+="<div class='label'><label></label><span>:</span></div>";pattern+="<div class='input'></div>";pattern+="<div class='altname'></div>";pattern+="<div class='error'></div>";pattern+="<div class='clear'>&nbsp;</div>";pattern+="<div class='comment'></div>";pattern+="<div class='clear'>&nbsp;</div></div>";pattern+="<div class='clear'>&nbsp;</div>";this.html(pattern);if(flags.mandatory){this.find(".label").append("<span class='mandatory'>*</span>");}
this.find(".error").css("display","none");var $input=this.find("input");if(is.unset(comment)){this.find(".comment").css("display","none");}
$input.live('focusin',function(){$(this).addClass('focus');}).live('focusout',function(){$(this).removeClass('focus');});var objID=gID.get();this.find(".edit").attr("id",objID);this.addClass("lightUI");plugin.fn.extend({enable:function(){this.find(".edit").removeClass("editDisabled");if(this.find("input").hasClass("validate")){this.find(".error").css("display","");}
this.find("input,select,textarea").attr("disabled",false);this.find(".label .mandatory").html("*");return this;},disable:function(){this.find(".edit").addClass("editDisabled");this.find(".error").css("display","none");this.find("input,select,textarea").attr("disabled",true);this.find(".label .mandatory").html("");return this;},isDisabled:function(){return this.find(".edit").hasClass("editDisabled");},setError:function(message){if(is.unset(message)){this.cleanError();}
else{var $error=this.find(".error");this.find("input").addClass("validate");$error.fadeIn('slow');$error.attr("langkey",message);$error.html(lng(message));}},cleanError:function(){var $error=this.find(".error");this.find("input").removeClass("validate");$error.css("display","none");$error.attr("langkey","");this.find(".error").html("");},setComment:function(message){comment=message;this.find(".comment").show()
.html(lng(comment))
.attr("langkey",comment);},cleanComment:function(){this.find(".comment").hide();},label:function(name){var $label=this.find(".label>label");if(is.string(name)){$label.html(lng(name));$label.attr("langkey",name);this.find(".label>span").html(":");return this;}
else{return $label.html(lng(name));}},altname:function(name){var $altname=this.find(".altname");if(is.string(name)){$altname.html(lng(name));$altname.attr("langkey",name);return this;}
else{return $altname.html(lng(name));}},mandatory:function(value){if(is.set(value)){if(value){var $manda=this.find(".label .mandatory");if($manda.length){$manda.html("*");}
else{this.find(".label").append("<span class='mandatory'>*</span>");}
this.flags().mandatory=true;}
else{this.find(".label .mandatory").remove();this.flags().mandatory=false;}
return this;}
else{return this.flags().mandatory;}},flags:function(){return this.data("flags");}});applyArgs.call(this);return plugin(this);}})();(function(){var pluginDomainName=jQuery.sub();var pluginIPv4=jQuery.sub();var pluginIPv6=jQuery.sub();var pluginMAC=jQuery.sub();var pluginText=jQuery.sub();var pluginNumber=jQuery.sub();var pluginSelect=jQuery.sub();var pluginStatic=jQuery.sub();var pluginCheckbox=jQuery.sub();var keyDown=function(event){if(event.keyCode==27||event.keyCode==9){if(!$.browser.opera){keyPress.call(this,event);}
return false;}}
var keyPress=function(event){if(navigator.userAgent.match('/Iceweasel/')&&event.keyCode==9)return;if(event.keyCode==13||event.keyCode==9){this.data("noblur",true);setTimeout(context(this).callback(function(){this.data("noblur",false);}),1);var $input=this.find("input");var errorCode=this.validate();if(is.string(errorCode)){this.trigger("error.input",[errorCode,event.keyCode]);return false;}
else{var obj={13:"enter",9:"tab"};this.trigger(obj[event.keyCode]+".input");}}
else if(event.keyCode==27){var $input=this.find("input");this.trigger("esc.input");}
return true;}
var onblur=function(event){if(this.data("noblur"))return;var errorCode=this.validate();if(is.string(errorCode)){var $input=this.find("input");this.trigger("error.input",errorCode);}
else{this.trigger("unfocus.input");}
event.stopPropagation();}
var onfocus=function(event){this.trigger("onfocus.input");event.stopPropagation();}
var bindEvents=function($obj){var $input=this.find("input, select");if($.browser.opera||$.browser.webkit||$.browser.msie){$input.keydown(context($obj).callback(keyDown));}
$input.keypress(context($obj).callback(keyPress));this.focusout(context($obj).callback(onblur));this.focusin(context($obj).callback(onfocus));}
var	fieldval=function(value){if(is.set(value)){applyAttrs.call(this,value);this.find("input").val(value);return this;}
else{return this.find("input").val();}};var checkRe=function(errorCode){if(!errorCode){var re=this.flags().re;var validater;var value=this.fieldval();var alias=value;if(is.func(this.fieldalias))alias=this.fieldalias();if(is.array(re)){for(var i=0;i<re.length;i++){validater=re[i];if(is.func(validater)){errorCode=validater(value,alias);if(errorCode){break;}}}}
else if(is.func(re)){errorCode=re(value,alias);}}
return errorCode;}
var	clean=function(){this.fieldval("");return this;};var initPlugin=function(flags){if(flags.password){this.append("<input type='password'/>");}
else{this.append("<input type='text'/>");}
var $input=this.find("input");objID=gID.get();$input.attr("id",objID);if(is.number(flags.size))$input.attr("size",flags.size);if(is.number(flags.maxLength))$input.attr("maxLength",flags.maxLength);if(flags.disabled)$input.attr("disabled",true);this.data("flags",flags);}
var validateIPv4=function(str){var patt=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;if(str.length){str=str.match(/\S+/)[0];if(!patt.test(str))return"netAddrInvalid";var arr=str.split(".");for(var i in arr){if(arr[i]>255){return"netAddrInvalid";}}}
return null;}
var isEmpty=function(){return!this.find("input").val().length;}
var enable=function(){var flags=this.data("flags");if(is.unset(flags.accessMode)||flags.accessMode!=4){this.find("input, select").attr("disabled",false);}
return this;}
var show=function(){var flags=this.data("flags");if(is.unset(flags.accessMode)||flags.accessMode!=0){this.__show__();}
return this;}
var isDisabled=function(){return this.find("input, select").attr("disabled")}
var disable=function(){this.find("input, select").attr("disabled",true);}
var applyAttrs=function(value){}
jQuery.fn.lightUIDomainName=function(flags){if(is.unset(flags))flags={};var objID;initPlugin.call(this,flags);pluginDomainName.fn.extend({validate:function(){if(!this.find("input").attr("disabled")){var pat=/^[\wа-яА-Я-]+$/;var host=this.find("input").val();if(host.length){host=host.match(/\S+/)[0];var labels=host.split(".");for(var i=0;i<labels.length;i++){if(!pat.test(labels[i]))
return"domainNameInvalid";}}
return checkRe.call(this);}
return null;},fieldval:fieldval,isEmpty:isEmpty,enable:enable,disable:disable,isDisabled:isDisabled,flags:function(){return this.data("flags");},clean:clean,show:show,__show__:this.show});var $obj=pluginDomainName(this);bindEvents.call(this,$obj);this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUIIPv4=function(flags){if(is.unset(flags))flags={};var objID;initPlugin.call(this,flags);pluginIPv4.fn.extend({validate:function(){if(!this.find("input").attr("disabled")){var str=this.find("input").val();var arr=str.split("/");var errorCode=null;var bitmask=arr[1];if(is.string(bitmask)){if(parseInt(bitmask).toString()=="NaN"||bitmask>32||bitmask<0){return"netAddrInvalid";}}
errorCode=validateIPv4(arr[0]);return checkRe.call(this,errorCode);}
return null;},fieldval:fieldval,isEmpty:isEmpty,enable:enable,disable:disable,isDisabled:isDisabled,flags:function(){return this.data("flags");},clean:clean,show:show,__show__:this.show});var $obj=pluginIPv4(this);bindEvents.call(this,$obj);this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUIIPv6=function(flags){if(is.unset(flags))flags={};var objID;initPlugin.call(this,flags);pluginIPv6.fn.extend({validate:function(){if(!this.find("input").attr("disabled")){var str=this.find("input").val();var errorCode=null;if(str.length){str=str.match(/\S+/)[0];var arr=str.split("/");var bitmask=arr[1];str=arr[0];if(str.match(/^::ffff:/)){errorCode=validateIPv4(str.replace(/^::ffff:/,""),flags);return checkRe.call(this,errorCode);}
else{var arr=str.split(":");if(arr.length>8){return"netAddrInvalid";}
else{var empty=0;for(var i in arr){if(arr[i]==""){empty++;}
else{if(arr[i].match(/^[0-9a-fA-F]{1,4}$/)){var hex=parseInt(arr[i],16);if(hex=="NaN"||hex>0xffff||hex<0){return"netAddrInvalid";}}
else{return"netAddrInvalid";}}}
if(empty>1){if(empty>2)return"netAddrInvalid";if(!(arr[0]==""&&arr[1]=="")&&!(arr[arr.length-1]==""&&arr[arr.length-2]=="")){return"netAddrInvalid";}}
else if(empty==1){if(!str.match(/.+::.+/))return"netAddrInvalid";}}}
if(is.string(bitmask)){if(parseInt(bitmask).toString()=="NaN"||bitmask>128||bitmask<0){return"netAddrInvalid";}}}
return checkRe.call(this);}
return null;},fieldval:fieldval,isEmpty:isEmpty,enable:enable,disable:disable,isDisabled:isDisabled,flags:function(){return this.data("flags");},clean:clean,show:show,__show__:this.show});var $obj=pluginIPv6(this);bindEvents.call(this,$obj);this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUIMAC=function(flags){if(is.unset(flags))flags={};var objID;initPlugin.call(this,flags);pluginMAC.fn.extend({validate:function(){if(!this.find("input").attr("disabled")){var patt=/^[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}$/;var str=this.find("input").val();if(str.length){str=str.match(/\S+/)[0];if(!patt.test(str))return"netAddrInvalid";var arr=str.split(".");for(var i in arr){if(arr[i]>255){return"netAddrInvalid";}}}
return checkRe.call(this);}
return null;},fieldval:fieldval,isEmpty:isEmpty,enable:enable,disable:disable,flags:function(){return this.data("flags");},clean:clean,show:show,__show__:this.show});var $obj=pluginMAC(this);bindEvents.call(this,$obj);this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUIText=function(flags){if(is.unset(flags))flags={};var objID;initPlugin.call(this,flags);pluginText.fn.extend({validate:function(){if(!this.find("input").attr("disabled")){return checkRe.call(this);}
return null;},fieldval:fieldval,isEmpty:isEmpty,enable:enable,disable:disable,isDisabled:isDisabled,flags:function(){return this.data("flags");},clean:clean,show:show,__show__:this.show});var $obj=pluginText(this);bindEvents.call(this,$obj);this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUIStatic=function(){this.data("flags",{});this.addClass("static");pluginStatic.fn.extend({validate:function(){return null;},fieldval:function(value){applyAttrs.call(this,value);if(is.set(value)){return this.html(value.valueOf());}
else{return this.html();}},isEmpty:function(){return!this.html().length;},enable:function(){return this;},disable:function(){return this;},isDisabled:function(){return false;},flags:function(){return this.data("flags");},clean:clean,show:show,__show__:this.show});var $obj=pluginStatic(this)
this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUINumber=function(flags){if(is.unset(flags))flags={};var objID;initPlugin.call(this,flags);pluginNumber.fn.extend({validate:function(){if(!this.find("input").attr("disabled")){var str=this.find("input").val();var flags=this.flags();if(str.length){str=str.match(/\S+/)[0];var patt=/^-*[0-9]+(\.?[0-9]+|[0-9]*)$/;if(!patt.test(str))return"numNaN";var num=new Number(str);if(is.number(flags.minval)&&num<flags.minval)return"numLessThanMin";if(is.number(flags.maxval)&&num>flags.maxval)return"numMoreThanMax";}
return checkRe.call(this);}
return null;},fieldval:function(value){if(is.set(value)){applyAttrs.call(this,value);this.find("input").val(value);return this;}
else{var val=this.find("input").val();if(val.length){return(new Number(this.find("input").val())).valueOf();}
else{return val;}}},isEmpty:isEmpty,enable:enable,disable:disable,isDisabled:isDisabled,flags:function(){return this.data("flags");},clean:clean,show:show,__show__:this.show});var $obj=pluginNumber(this);bindEvents.call(this,$obj);this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUISelect=function(flags){if(is.unset(flags))flags={};if(is.unset(flags.options))flags.options={};var $input=this.append("<select></select").find("select");if(flags.disabled)$input.attr("disabled",true);var options=flags.options;var optionArray=flags.optionArray;if(is.array(optionArray)){var opt;flags.options={};options=flags.options;for(var i=0;i<optionArray.length;i++){opt=optionArray[i];options[opt.name]=opt.value;$input.append("<option value='"+opt.value+"'>"+lng(opt.name)+"</option>")
.find("option:last").attr("langkey",opt.name);}}
else if(is.object(options)){for(var i in options){$input.append("<option value='"+options[i]+"'>"+lng(i)+"</option>")
.find("option:last").attr("langkey",i);}}
if(options.length){var value=this.find("option:eq(0)").attr(value);$input.val(value).data("value",value);}
$input.attr("id",gID.get());if(is.number(flags.size))$input.attr("size",flags.size);if(is.set(flags.multiple))$input.attr("multiple",flags.multiple);this.data("flags",flags);pluginSelect.fn.extend({validate:function(){if(!this.find("select").attr("disabled")){return checkRe.call(this);}
return null;},fieldval:function(value){var $select=this.find("select");if(is.set(value)){applyAttrs.call(this,value);$select.val(value.valueOf()).data("value",value.valueOf());return this;}
else{return $select.val();}},fieldalias:function(alias){var $select=this.find("select");var options=this.flags().options;if(is.set(alias)){var $option=this.find("option");for(var i=0;i<$option.length;i++){if($option.eq(i).attr("langkey")==alias){this.fieldval($option.eq(i).attr("value"));break}}
return this;}
else{return this.find("select option:selected").attr("langkey");}},addOption:function(__name,__value){var $select=this.find("select");var value=$select.data("value");$select.append("<option value='"+__value+"'>"+lng(__name)+"</option>")
.find("option:last").attr("langkey",__name);if(!this.data("flags").manualCorrection){var value=$select.data("value");if(is.unset(value)||value==__value){this.fieldval(__value);}}
return this;},correctValue:function(){var $options=this.find("select option");var value=this.find("select").data("value");for(var i=0;i<$options.length;i++){if($options.eq(i).attr("value")==value){this.fieldval(value);return this;}}
return this;},cleanOptions:function(){this.find("select").html("");},updateSelect:function(){this.html(this.html());return this;},isEmpty:function(){return false},enable:enable,disable:disable,isDisabled:isDisabled,flags:function(){return this.data("flags");},clean:function(){return this},show:show,__show__:this.show});var $obj=pluginSelect(this);bindEvents.call(this,$obj);this.data("light_ui_input",$obj);return $obj;}
jQuery.fn.lightUICheckbox=function(flags){if(is.unset(flags))flags={};if(is.unset(flags.options))flags.options={};var $input=this.append("<input type='checkbox'></checkbox").find("input");if(flags.disabled)$input.attr("disabled",true);$input.attr("id",gID.get());this.data("flags",flags);pluginCheckbox.fn.extend({validate:function(){return null;},fieldval:function(value){var $input=this.find("input");if(is.set(value)){applyAttrs.call(this,value);$input.attr("checked",value?true:false);return this;}
else{return $input.attr("checked")?true:false;}},isEmpty:function(){return false},enable:enable,disable:disable,isDisabled:isDisabled,flags:function(){return this.data("flags");},clean:function(){return this},show:show,__show__:this.show});var $obj=pluginCheckbox(this);bindEvents.call(this,$obj);return $obj;}})();(function(){var plugin=jQuery.sub();jQuery.fn.lightUIUpload=function(action,filename,options){this.iframename=gID.get();options=$.extend({'auto':true,'method':'post','browse':'Browse','cancel':'Cancel'},options);action=(action.indexOf('?')>=0)?action+'&proxy=y':action+'?proxy=y'
var $pattern=$("\
			<div class='upload normal'>\
				<div class='ustatus'></div>\
				<div class='ufile'>\
					<input type='text' class='path' readonly='readonly' value='' />\
				</div>\
				<div class='ubutton'>\
					<input type='button' class='browse' langkey='"+options.browse+"' value='"+lng(options.browse)+"' />\
					<input type='button' class='cancel' langkey='"+options.cancel+"' value='"+lng(options.cancel)+"' />\
				</div>\
				<div class='clear'></div>\
				<form action='"+action+"' id='"+gID.get()+"' enctype='multipart/form-data' target='"+this.iframename+"' method='"+options.method+"'>\
					<input type='file' name='"+filename+"' />\
					<input type='reset' />\
				</form>\
				<iframe frameborder='0' scrolling='no' name='"+this.iframename+"' id='"+this.iframename+"'></iframe>\
			</div>\
		");this.html($pattern);this.addClass("lightUI");this.uploading=false;this.auto=options.auto;this.find('>.upload input.browse').bind('click',callback(this,function(){this.find('>.upload input[type=file]').trigger('click');return false;}));this.find('>.upload input.cancel').bind('click',callback(this,function(){if(this.uploading){for(var i=0;i<window.frames.length;i++){if(window.frames[i].name==this.iframename){if(jQuery.browser.msie){window.frames[i].document.execCommand('Stop');}else{window.frames[i].stop();}}}
this.find('>.upload').removeClass('uploading').trigger('clear');this.uploading=false;this.trigger('break.upload');}
return false;}));this.find('>.upload iframe').bind('load',callback(this,function(e){if(this.uploading){this.find(">.upload").removeClass('uploading');this.uploading=false;this.trigger('end.upload',$(e.target).contents().find("body").html());}
return false;}));this.find('>.upload input[type=file]').bind('change',callback(this,function(e){var path=basename($(e.target).val());this.find('>.upload input.path').val(path);if(this.auto){this.find(">.upload").trigger('upload');}
this.trigger('change.upload');return false;}));this.find(">.upload").bind({'upload':callback(this,function(){if(!this.uploading&&this.find('>.upload input[type=file]').val()!=''){this.uploading=true;this.find(">.upload").addClass('uploading').find('form').submit();this.trigger('begin.upload');}
return false;}),'clear':callback(this,function(){this.find('>.upload input.path').val('');this.find('>.upload input[type=reset]').trigger('click');this.find('>.upload form').get(0).reset();return false;})});try{var ieversion=navigator.appVersion.match(/MSIE\s+\d+/)[0].replace('MSIE','')
if(ieversion){this.find('>.upload').addClass('upload-ie');}}
catch(e){}
plugin.fn.extend({enable:function(){this.find(">.upload").removeClass('disable').addClass('normal');this.find(">.upload :input").removeAttr('disabled');return this;},disable:function(){this.find(">.upload").removeClass('normal').addClass('disable');this.find(">.upload :input").attr('disabled','disabled');return this;},upload:function(){this.find(">.upload").trigger('upload');return this;},cancel:function(){this.find(">.upload input.cancel").trigger('click');return this;},clear:function(){this.find(">.upload").trigger('clear');return this;}});return plugin(this);}})();(function(){var plugin=jQuery.sub();jQuery.fn.lightUITrackbar=function(value,flags){var objID=gID.get();flags=$.extend({'minval':0,'maxval':100,'suffix':'%','direct':'horizontal'},flags);this.data('flags',flags);var $pattern=$("\
			<div class='trackbar unselectable'>\
				<div class='shell'>\
					<div class='rail'>\
						<div class='tail'></div>\
						<div class='toddler'></div>\
					</div>\
					<div class='value' unselectable='unselectable'></div>\
				</div>\
			</div>\
		");this.html($pattern);this.addClass("lightUI");this.find('>.trackbar').attr("id",objID).addClass(flags.direct=='horizontal'?'horizontal':'vertical');DRAGGER.add(this.find('.toddler').bind({'up.dragger':callback(this,function(){this.trigger('change.trackbar');return false;}),'down.dragger':callback(this,function(){return false;}),'move.dragger':callback(this,function(e,info){var flags=this.data('flags');var $trackbar=this.find('>.trackbar');var $rail=$trackbar.find('.rail');var $tail=$rail.find('>.tail');var $toddler=$rail.find('>.toddler');var $value=$trackbar.find('.value');if(flags.direct=='horizontal'){if(info.left>=0&&info.left<$rail.width()){var offset=100*info.left/$rail.width();$toddler.css({left:offset+'%'});$tail.width(offset+'%');$value.text(Math.ceil(offset*(flags.maxval-flags.minval)/100+flags.minval)+flags.suffix);}}else{if(info.top>=0&&info.top<$rail.height()){info.bottom=$rail.height()-info.top-1;var offset=100*info.bottom/$rail.height();$toddler.css({bottom:offset+'%'});$tail.height(offset+'%');$value.text(Math.ceil(offset*(flags.maxval-flags.minval)/100+flags.minval)+flags.suffix);}}
return false;})}));var	fieldval=function(value){var flags=this.data('flags');var $trackbar=this.find('>.trackbar');var $rail=$trackbar.find('.rail');var $tail=$rail.find('>.tail');var $toddler=$rail.find('>.toddler');var $value=$trackbar.find('.value');var offset=null;if(is.set(value)){if(value<flags.minval)value=flags.minval;if(value>flags.maxval)value=flags.maxval;offset=(value-flags.minval)*100/(flags.maxval-flags.minval);if(flags.direct=='horizontal'){$toddler.css({left:offset+'%'});$tail.width(offset+'%');}else{$toddler.css({bottom:offset+'%'});$tail.height(offset+'%');}
$value.text(value+flags.suffix);return this;}
if(flags.direct=='horizontal'){offset=100*$toddler.position().left/$rail.width();}else{offset=100*$toddler.position().bottom/$rail.height();}
return Math.ceil(offset*(flags.maxval-flags.minval)/100+flags.minval);};fieldval.call(this,is.number(value)?value:flags.minval);plugin.fn.extend({fieldval:fieldval,flags:function(){return this.data("flags");},enable:function(){this.find('>.trackbar').removeClass('disable');DRAGGER.add(this.find('.toddler'));return this;},disable:function(){this.find('>.trackbar').addClass('disable');DRAGGER.remove(this.find('.toddler'));return this;}});return plugin(this);}})();(function(){var pluginComboGrid=jQuery.sub();jQuery.fn.lightUIComboGrid=function(flags){if(is.unset(flags))flags={};pluginComboGrid.fn.extend({validate:function(){return this.getGrid().validate();},fieldval:function(value){return this.getGrid().fieldval(value);},addOption:function(obj){var $row=this.getGrid().addRow().row("last");if(is("Object",obj)){for(var i in obj){$row.col(i).html(lng(obj[i])).attr("langkey",obj[i]);}}
else{for(var i=0;i<arguments.length;i++){$col=$row.col(i);if($col.length){value=arguments[i];if(is.unset(value))value="";$col.html(lng(value)).attr("langkey",value);}}}
return this;},cleanOptions:function(){this.getGrid().cleanTable();return this;},cleanTable:function(){this.getGrid().cleanTable();return this;},isEmpty:function(){return!this.find("input").val().length;},isDisabled:function(){return this.find("input").attr("disabled");},flags:function(){return this.data("flags");},clean:function(){this.fieldval("");return this;},getGrid:function(){return this.data("grid");}});var $grid=this.lightUIGrid(flags.header,0,{combobox:{type:flags.type,index:flags.index,blank:flags.blank,flags:{maxLength:flags.maxLength,mandatory:flags.mandatory,re:flags.re}}});this.data("grid",$grid);var $obj=pluginComboGrid(this);this.data("light_ui_input",$obj);var optionArray=flags.optionArray;if(is.array(optionArray)){for(var i=0;i<optionArray.length;i++){var opt=optionArray[i];if(is.array(opt)){$obj.addOption.apply($obj,opt);}
else{$obj.addOption(opt);}}}
return $obj;}})();(function(){var plugin=jQuery.sub();jQuery.fn.lightUIButton=function(name,options){if(is.unset(options))options={};var pattern="<div class='button normal unselectable'>";if(is.set(options.icon)){pattern+="<div class='icon'>";pattern+="<img src='"+options.icon+"' />";pattern+="</div>";}
pattern+="<div class='title' unselectable='on' langkey='"+name+"'>"+lng(name)+"</div>";pattern+="<div class='clear'></div>";pattern+="</div>";this.html(pattern);this.addClass("lightUI");if(is.set(options.iconRightSide)){this.find(".icon").css('float','right');}
this.find(".button").mouseenter(function(){$(this).not('.disable').addClass('hover');}).mouseleave(function(){$(this).not('.disable').removeClass('hover');}).mousedown(function(){$(this).not('.disable').addClass('push');}).mouseup(function(){$(this).not('.disable').removeClass('push');}).click(function(event){if(!$(this).hasClass('disable')){$(this).trigger("click.button");$(this).trigger("button.click");}
event.stopPropagation();});plugin.fn.extend({enable:function(){this.find(".button").removeClass('disable').addClass('normal');return this;},disable:function(){this.find(".button").removeClass('normal push').addClass('disable');return this;},title:function(name){if(is.string(name)){this.find(".title").text(lng(name));return this;}
else{return this.find(".title").text();}},click:function(){this.find(".button").trigger("click");return this;}});return plugin(this);}})();(function(){var plugin=jQuery.sub();jQuery.fn.lightUISection=function(name,comment){var pattern="<div class='title'>"
+"<div class='name'><div></div></div>"
+"<div class='comment' style='display: none'><div></div></div>"
+"</div>"
+"<div class='content'></div>";this.addClass("lightUI section");this.html(pattern);if(comment)this.find(".comment").show();this.find(".name>div").attr("langkey",name);this.find(".comment>div").attr("langkey",comment);plugin.fn.extend({setName:function(name){if(is.string(name)){this.find(".title>.name>div")
.html(lng(name))
.attr("langkey",name);}
return this;},setComment:function(comment){if(is.string(comment)){this.find(".title>.comment>div")
.html(lng(comment))
.attr("langkey",comment);this.find(".title>.comment").show();}
return this;},setContent:function(content){if(is.string(content)){this.find(".content").html(content);}
return this;}});return plugin(this).setName(name).setComment(comment);}})();(function(){var plugin=jQuery.sub();plugin.fn.extend({addItem:function(name,html){if(is.unset(html))html="";if(name.match(/^[0-9a-zA-Z]+$/)){var nameClass="__iam__"+name;}
else{var id=gID.get();var nameClass="__iam__"+id;this.data("__iam__"+name,"__iam__"+id);}
var isEmpty=!this.find("li:last").removeClass("last").length;if(isEmpty){this.append("<ul><li>"+html+"</li></ul>");if(this.is("li")){this.prepend("<div class='hitarea'></div>")
.addClass("collapsed")
.find(">ul").hide();this.find(">.hitarea").bind("click",function(event){if(event.target==this){$(this).trigger("li.toggle");}});this.bind("li.toggle",function(event){event.stopPropagation();$(this).lightUIList().toggleList();});}
else{this.addClass("expanded");}
this.find("li:last").addClass("last")
.addClass(nameClass)
.data("options",this.data("options"));}
else{this.find("ul").append("<li>"+html+"</li>")
.find("li:last").addClass("last")
.addClass(nameClass)
.data("options",this.data("options"));}
return this;},childItem:function(name){var arr=name.split("/");var s="";var nameClass;for(var i=0;i<arr.length;i++){nameClass="__iam__"+arr[i];if(!arr[i].match(/^[0-9a-zA-Z]+$/)){nameClass=this.data("__iam__"+arr[i]);}
s+=">ul>li."+nameClass;}
return this.find(s).lightUIList();},parentItem:function(){if(this.is("li")){return this.parents("ul").eq(0).parent().lightUIList();}
else{return $();}},expandedItem:function(){return this.find(">ul>li.expanded").lightUIList();},collapsedItem:function(){return $parent.find(">ul>li.collapsed").lightUIList();},expandList:function(){var $parent=this.parentItem();if($parent.length&&this.listOptions().unique){$parent.expandedItem().collapseList();}
this.find(">ul").show(this.listOptions().speed);this.removeClass("collapsed")
.addClass("expanded");return this;},collapseList:function(){this.find(">ul").hide(this.listOptions().speed);this.removeClass("expanded")
.addClass("collapsed");return this;},toggleList:function(){if(this.hasClass("expanded")){this.collapseList();}
else{this.expandList();}
return this;},listOptions:function(options){if(is.set(options)){this.data("options",options);return this;}
else{var options=this.data("options");return options?options:{};}},cleanList:function(){this.unbind("li.toggle");this.find(".hitarea").remove();this.find("ul").eq(0).remove();return this;}});jQuery.fn.lightUIList=function(options){var pluginInstance=this.data("lightUIList")
if(pluginInstance)return pluginInstance;if(!this.is("li")){this.addClass("lightUI list");if(is.set(options)){this.data("options",options);}}
this.bind("click",function(event){if(event.target==this){var event0=jQuery.Event("li.click");event0.collapseMenu=function(){$(this.target).parents(".lightUI").eq(0).hide("fast");}
event0.menuTarget=function(){return $(this.target).parents(".lightUI").data("menuTarget");}
$(this).trigger(event0);}});pluginInstance=plugin(this)
this.data("lightUIList",pluginInstance);return pluginInstance;}
jQuery.fn.contextMenu=function(name){var $list=this.data("contextMenu");if(!is.jquery($list)&&is.unset(name)){var id="context_menu_"+gID.get();$("body").append("<div id='"+id+"'></div>");$list=$("#"+id).lightUIList({unique:true})
.addClass("context")
.hide();$list.live("mouseleave",function(event){event.stopPropagation();$(this).find(">li").lightUIList().collapseList();}).live("contextmenu",function(event){event.preventDefault();event.stopImmediatePropagation();return false;}).bind("click",function(event){event.stopPropagation();}).find("li").live("mouseenter",function(event){event.stopPropagation();if($(this).is(".collapsed")){$(this).lightUIList()
.expandList()
.find(">ul").css("left",($(this).parents("ul").eq(0).width()-20)+"px");}}).live("mouseleave",function(event){if($(this).is(".expanded")){$(this).lightUIList()
.collapseList();}});this.bind("contextmenu",function(event){event.preventDefault();event.stopImmediatePropagation();var $menu=$(this).data("contextMenu");if($menu.is(":hidden")){$menu.show("fast")
.offset({top:event.pageY,left:event.pageX})
.data("menuTarget",event.target);window.contextMenuActive=$menu;}
else{$menu.hide("fast");window.contextMenuActive=null;}
return false;}).data("contextMenu",$list);$("body").click(function(){if(is.set(window.contextMenuActive)){window.contextMenuActive.hide("fast");window.contextMenuActive=null;}}).bind("contextmenu",function(event){if(is.set(window.contextMenuActive)){window.contextMenuActive.hide("fast");window.contextMenuActive=null;}});}
else if(is.set(name)){if(is.jquery($list)){$list=$list.childItem(name);}
else{$list=$();}}
return $list;}})();(function(){var plugin=jQuery.sub();jQuery.fn.lightUIWizard=function(inx,n){var addStep=function(arg){if(is.string(arg)){var arr=arg.split(" ");for(var i=0;i<arr.length;i++){this.append(pattern)
.find("div:last")
.addClass(nameClass+arr[i]);}}
else{this.append(pattern);}
return this;}
var addFirstStep=function(arg){addStep.call(this,arg);if(!this.getActiveStep().length){this.switchStep("first");}
this.addStep=addStep;return this;}
plugin.fn.extend({addStep:addStep=function(arg){if(is.string(arg)){var arr=arg.split(" ");for(var i=0;i<arr.length;i++){this.append(pattern)
.find("div:last")
.addClass(nameClass+arr[i]);}}
else{this.append(pattern);}
if(!this.getActiveStep().length){this.switchStep("first");}
return this;},switchStep:function(arg,effect){var $cur=this.find(">div.active");var $next;if(arg=="next"){$next=this.getStep("next");}
else if(arg=="prev"){$next=this.getStep("prev");}
else if(arg=="last"||is.unset(arg)){$next=this.getStep("last");}
else if(arg=="first"){$next=this.getStep("first");}
else if(is.string(arg)){$next=this.find("."+nameClass+arg);}
else if(is.number(arg)){$next=this.find(">div").eq(arg);}
if(is.jquery($next)&&$next.length){if(is.func(effect)){effect.call(this,$cur,$next);}
else{$cur.hide().removeClass("active");$next.show().addClass("active");}}
return this;},removeStep:function(arg){if(arg=="next"){this.getStep("next").remove();}
else if(arg=="prev"){this.getStep("prev").remove();}
else if(arg=="last"||is.unset(arg)){this.getStep("last").remove();}
else if(arg=="first"){this.getStep("first").remove();}
else if(is.string(arg)){this.find("."+nameClass+arg).remove();}
else if(is.number(arg)){this.find(">div").eq(arg).remove();}
if(!this.find(">div").length){this.addStep=addFirstStep;}
return this;},getStep:function(arg){if(arg=="next"){var $step=this.find(">div.active").next();while($step.hasClass("skiped")){$step=$step.next();}
return $step;}
else if(arg=="prev"){var $step=this.find(">div.active").prev();while($step.hasClass("skiped")){$step=$step.prev();}
return $step;}
else if(arg=="last"||is.unset(arg)){return this.find(">div:not(.skiped):last");}
else if(arg=="first"){return this.find(">div:not(.skiped):first");}
else if(is.string(arg)){return this.find("."+nameClass+arg);}
else if(is.number(arg)){return this.find(">div").eq(arg);}
return $();},getStepIndex:function(arg){return this.getStep(arg).index();},getActiveIndex:function(){return this.getActiveStep().index();},getActiveStep:function(){return this.find(">div.active");},skipStepOn:function(arg){this.getStep(arg).addClass("skiped").removeClass("active").hide();return this;},skipStepOff:function(arg){this.getStep(arg).removeClass("skiped");return this;},isStepLast:function(arg){var $step=this.getStep(arg).next();while($step.hasClass("skiped")){$step=$step.next();}
return!$step.length;},isStepFirst:function(arg){var $step=this.getStep(arg).prev();while($step.hasClass("skiped")){$step=$step.prev();}
return!$step.length;}});var $plugin=plugin(this);var pattern="<div style='display: none'></div>";var nameClass="__iam__";if(is.number(n)){var n0=this.find(">div").length;if(n0<n){for(var i=0;i<(n-n0);i++){$plugin.addStep();}}}
if(is.set(inx)){$plugin.switchStep(inx);}
else{if(!$plugin.getActiveStep().length){$plugin.switchStep("first");}}
return $plugin;}})();function node(options){this.options=options?options:{};node.prototype.add=function(obj,alias,arg3){this.children.push(obj);obj.parent=this;obj.root=this.root;if(alias){this.childrenRefs[alias]=obj;}
if(is.set(arg3)){this.locate(this.children.length-1,arg3);}
return this;}
node.prototype.child=function(i){if(is.number(i)){return getChild.call(this,i);}
else if(is.string(i)){var arr=i.split("/");var begin=0;var obj=this;if(!arr[0].length){begin=1;obj=this.root;}
var num,item;for(var ii=begin;ii<arr.length;ii++){item=arr[ii];num=Number(item);if(num.toString()==arr[ii]){obj=getChild.call(obj,num);}
else if(item==".."){obj=obj.parent;}
else{obj=getChild.call(obj,arr[ii]);}}
return obj;}
return null;}
node.prototype.get=node.prototype.child;node.prototype.setAlias=function(i,alias){this.childrenRefs[alias]=this.child(i);return this;}
node.prototype.getAlias=function(){var brothers=this.parent.childrenRefs;for(var i in brothers){if(brothers[i]===this){return i;}}
return null;}
node.prototype.replace=function(i,obj){if(is.number(i)){var child=this.children[i];var parent=this;for(var j in this.childrenRefs){if(this.childrenRefs[j]==child){this.childrenRefs[j]=obj;break;}}
this.children[i]=obj;}
else if(is.string(i)){var child=this.get(i);var parent=child.get("..");var alias=child.getAlias();for(var j in parent.children){if(child==parent.children[j]){parent.children[j]=obj;break;}}
parent.childrenRefs[alias]=obj;}
if(obj instanceof node&&child instanceof node){obj.parent=parent;obj.boxid=child.boxid;if(child.$box.isRendered()){obj.locate(child.$outerBox).deep.updateView();}}
return this;}
node.prototype.set=function(obj,i,arg3){if(is.set(this.get(i))){this.replace(i,obj);}
else if(is.string(i)){this.add(obj,i,arg3);}
return this;}
node.prototype.index=function(){var arr=this.parent.children;for(var i=0;i<arr.length;i++){if(arr[i]==this){return i;}}
return-1;}
node.prototype.emit=function(arg){if(is.object(arg)){var status=arg;status.target=this;var type=status.type;}
else{var type=arg;var status={target:this,type:type,bubbling:true}}
if(is.set(type)){var event=this.events[type];var args=[status];args=args.concat(Array.prototype.slice.call(arguments,1));callHandlers.apply(this,args);}
return this;}
node.prototype.bind=function(typeList,handler){if(is.unset(typeList))return this;var arr=typeList.split(" ");for(var i=0;i<arr.length;i++){var type=arr[i];if(!is.object(this.events[type])){var event=this.events[type]={};event.handlers=[];}
this.events[type].handlers.push(handler);}
return this;}
node.prototype.unbind=function(type,handler){if(is.string(type)){if(is.func(handler)){var event=this.events[type];for(var i in event.handlers){if(event.handlers[i]==handler){event.handlers[i]=null;break;}}}
else{delete this.events[type];}}
else{this.events={};}
return this;}
node.prototype.listen=function(path,type,handler){var callback=context(this).callback(handler);this.listeners.push({handler:handler,callback:callback});this.get(path).bind(type,callback);return this;}
node.prototype.unbindListener=function(path,type,handler){var listeners=this.listeners;var obj;for(var i in listeners){obj=listeners[i];if(is.set(obj)&&obj.handler==handler){this.get(path).unbind(type,obj.callback);delete obj;break;}}}
node.prototype.updateView=function(phase){if(phase=="forward"){if(!this.$outerBox.isRendered()){if(this.parent&&this.parent.$box.length){var $pbox=this.parent.$box;}
else{var $pbox=$("body");}
this.$outerBox=$pbox.append("<div class='nodebox'></div>").find("div.nodebox:last");}
var id=this.$outerBox.attr("id");if(is.set(id)&&id.length){this.boxid=this.$outerBox.attr("id");}
else{this.$outerBox.attr("id",this.id);}
this.$outerBox.html("<div class='nodecontent'></div>");if(!this.$buttonBar.isRendered()){this.$outerBox.append("<div class='buttonbar' id='"+this.boxid+"ButtonBar'></div>");this.$buttonBar=$("#"+this.boxid+"ButtonBar");}
if(!this.parent)this.$outerBox.data("rootNode",this).attr("rootNode","yes");this.$box=this.$innerBox=this.$outerBox.find(">.nodecontent");if(this.options.hidden)this.hide();}
return this;};node.prototype.toHTML=function(){if(!this.$box.isRendered()){this.deep.updateView();}
return"<div class='nodebox'>"+this.$outerBox.html()+"</div>";}
node.prototype.jQuery=function(i){if(is.set(i)){return this.child(i).$box;}
else{return this.$box;}}
node.prototype.locate=function(arg1,arg2){if(is.set(arg2)){if(is.number(arg1)||is.string(arg1)){if(is.jquery(arg2)){this.child(arg1).$outerBox=arg2;}
else if(is.string(arg2)){this.child(arg1).$outerBox=this.$box.find(arg2);}}
else if(is.object(arg1)){for(var i in arg1){if(is.jquery(arg2)){this.child(i).$outerBox=arg1[i];}
else if(is.string(arg2)){this.child(i).$outerBox=this.$box.find(arg1[i]);}}}}
else{if(is.jquery(arg1)){this.$outerBox=arg1;}
else if(is.string(arg1)){this.$outerBox=$(arg1);}}
return this;}
node.prototype.addButton=function(name,options){var $buttonBar=this.$buttonBar;if(is.jquery($buttonBar)){this.buttons[name]=$buttonBar.append("<div class='buttonbox'></div>")
.find("div.buttonbox:last")
.lightUIButton(name,options);}
return this;}
node.prototype.getButton=function(name){return this.buttons[name];}
node.prototype.cleanButtonBar=function(){this.buttons=[];this.$buttonBar.find("*").remove();return this;}
node.prototype.initForm=function(){this.children=[];this.childrenRefs={};return this;}
node.prototype.startForm=node.prototype.initForm;node.prototype.endForm=function(){var child;for(var i=0;i<this.children.length;i++){child=this.get(i);child.emit({type:"endform",bubbling:false},child.val());}
return this;}
node.prototype.buttonBar=function($obj){if(is.jquery($obj)){this.$buttonBar=$obj;return this;}
else{return this.$buttonBar;}}
node.prototype.hide=function(){this.options.hidden=true;this.$outerBox.hide();return this;}
node.prototype.show=function(){this.options.hidden=false;this.$outerBox.show();return this;}
node.prototype.nchild=function(){return this.children.length;}
node.prototype.self=this;node.prototype.val=function(){};this.jq=null;this.model={};this.s=null;this.parent=null;this.events={};this.listeners=[];this.bubbling=true;this.$box=this.$outerBox=this.$innerBox=$();this.boxid=gID.get();this.id=this.boxid;this.buttons={};this.$buttonBar=$();this.root=this;this.initForm();var callHandlers=function(status){var event=this.events[status.type];if(is.object(event)){for(var i in event.handlers){if(is.func(event.handlers[i])){event.handlers[i].apply(this,arguments);}}}
if(status.bubbling){if(this.parent instanceof node)callHandlers.apply(this.parent,arguments);}}
var getChild=function(i){if(is.number(i)){return this.children[i];}
else if(is.string(i)){return this.childrenRefs[i];}
return null;}
this.deep=function(methodName,arg1){var method=this[methodName];method=is.func(method)?method:function(){};if(is.object(arg1)){var status=arg1;var phase=status.phase?status.phase:"back"}
else if(is.string(arg1)){var phase=arg1;var status=arg1={phase:phase};}
else{var phase="back";var status=arg1={phase:phase};}
var methodArgs=Array.prototype.slice.call(arguments,2).concat([status]);switch(phase){case"both":method.apply(this,["forward"].concat(methodArgs));if(!status.stop){this.deepInner.apply(this,arguments);method.apply(this,["back"].concat(methodArgs));}
break;case"forward":method.apply(this,methodArgs);if(!status.stop){this.deepInner.apply(this,arguments);}
break;case"back":this.deepInner.apply(this,arguments);method.apply(this,methodArgs);break;}
return this;}
this.deepInner=function(){var args=arguments;this.each(function(i,child){child.deep.apply(child,args);});return this;}
this.each=function(c){if(is.func(c)){for(var i in this.children){c(i,this.child(i));}}
else if(is.string(c)){var methodArgs=Array.prototype.slice.call(arguments,1);var child,method;for(var i in this.children){child=this.child(i);method=child[c];if(is.func(method))method.apply(child,methodArgs);}}
return this;}
var ext=node.extensions;for(var i in ext){for(var j in ext[i]){this[i][j]=ext[i][j];this[i].self=this;}}};node.extensions={};node.extendMethod=function(methodName,extName,extension){var ext=node.extensions;if(!is.object(ext[methodName]))ext[methodName]={};ext[methodName][extName]=extension;}
node.extendMethod("deep","updateModel",function(status){var status={error:false,nodes:[]};this.self.deep("updateModel","back",status);return!status.error;});node.extendMethod("deep","updateView",function($box){if(is.jquery($box))this.self.$outerBox=$box;return this.self.deep("updateView","both");});function nodeInputBase(name,value,options){this.value=value;this.name=name;nodeInputBase.superclass.constructor.call(this,options);this.enable=function(){var options=this.options;if(is.unset(options.accessMode)||options.accessMode!=4){options.disabled=false;if(this.pluginEdit)this.pluginEdit.enable();}
return this;}
this.disable=function(){this.options.disabled=true;if(this.pluginEdit)this.pluginEdit.disable();return this;}
this.show=function(){var options=this.options;if(is.unset(options.accessMode)||options.accessMode!=0){nodeInputBase.superclass.show.call(this);}
return this;}
this.isDisabled=function(){return this.pluginEdit.isDisabled();}
this.setError=function(message){this.pluginEdit.setError(message);return this;}
this.cleanError=function(){this.pluginEdit.cleanError();return this;}
this.setComment=function(message){this.options.comment=message;if(this.$box.isRendered()){this.pluginEdit.setComment(message);}
return this;}
this.cleanComment=function(){delete this.options.comment;if(this.$box.isRendered()){this.pluginEdit.cleanComment();}
return this;}
this.label=function(name){if(is.set(name)){if(this.$box.isRendered()){this.pluginEdit.label(name);}
else{this.name=name;}}
else{if(this.$box.isRendered()){return this.pluginEdit.label();}
else{return this.name;}}
return this;}
this.bind("fieldchange",function(){this.modified=(this.value!=this.val());});this.fieldchange=function(){this.emit("fieldchange",this.val());return this;}
this.mandatory=function(value){if(is.set(value)){if(this.pluginEdit)this.pluginEdit.mandatory(value);this.options.mandatory=value;return this;}
else{return this.options.mandatory;}}
nodeInputBase.prototype.toString=function(){var value=this.val();if(this.isDisabled()){return"[<span langkey='notreq'>"+lng("notreq")+"</span>]";}
else{if((is.string(value)&&value!="")||(!is.string(value)&&is.set(value))){return value;}
else{return"[<span langkey='notspec'>"+lng("notspec")+"</span>]";}}}
nodeInputBase.prototype.getSummary=function($box){var $summary=$();var options=this.options;var disabled=this.isDisabled();if(!$box||options.forceSummary||(this.modified&&!this.options.password&&!disabled&&!options.hidden)){var $obj=$("<div></div>").html(this.toHTML());$obj.find(".edit").removeClass("editDisabled");var value=this.toString();var $input=$obj.find(".input").addClass("static").html(value);$obj.find(".mandatory").remove();$obj.find(".comment").hide();$summary=$obj;if(is.jquery($box))$box.append($summary);}
return $summary;}
nodeInputBase.prototype.applyAttrs=function(value){function toDefaultMode(){delete this.options.accessMode;if(!this.options.disabled)this.enable();if(!this.options.hidden)this.show();}
try{var mode=this.options.accessMode=value.__attrs__.mode;switch(mode){case 4:if(this.pluginEdit)this.pluginEdit.disable();break;case 0:this.$outerBox.hide();break;default:toDefaultMode.call(this);break;}}
catch(e){toDefaultMode.call(this);}}
nodeInputBase.prototype.isModified=function(status){if(this.$box.isRendered()&&!this.isDisabled()&&this.$box.is(":visible")&&!this.isEqual(this.value,this.val())){status.modified=true;status.nodes.push(this);}}
nodeInputBase.prototype.isEqual=function(value1,value2){if(is.number(value1))value1=value1.toString();if(is.number(value2))value2=value2.toString();if(is.unset(value1)||value1=="")value1=null;if(is.unset(value2)||value2=="")value2=null;return value1==value2;}}
extend(nodeInputBase,node);node.extendMethod("deep","isModified",function(status){var status={modified:false,nodes:[]};this.self.deep("isModified","back",status);return status.modified;});function nodeInput(name,value,options){nodeInput.superclass.constructor.call(this,name,value,options);this.bindEvents=function(){this.pluginInput.find("input").bind("change",context(this).callback(function(event){this.pluginEdit.cleanError();this.fieldchange();event.stopPropagation();return true;}));this.pluginInput.bind("error.input",context(this).callback(function(event,errorCode){this.pluginEdit.setError(errorCode);}));this.pluginInput.bind("onfocus.input",context(this).callback(function(event){this.pluginEdit.cleanError();}));return this;}
nodeInput.prototype.val=function(value){if(is.set(value)){this.applyAttrs(value);if(this.pluginInput){this.pluginInput.fieldval(value);}
this.value=value;return this;}
else{if(this.pluginInput){return this.pluginInput.fieldval();}
else{return this.value;}}}
this.updateModel=function(status){if(this.pluginEdit.isDisabled()||this.pluginEdit.is(":hidden")){return;}
var errorCode;if(this.options.mandatory){errorCode=this.pluginInput.isEmpty()?"fieldEmpty":null;}
if(is.unset(errorCode)){errorCode=this.validate();}
if(is.set(errorCode)){this.pluginEdit.setError(errorCode);status.error=true;status.nodes.push(this);}
else{this.value=this.val();}
return this;}
this.validate=function(){this.pluginInput.flags().re=this.options.re;var errorCode=this.pluginInput.validate();if(errorCode){this.pluginEdit.setError(errorCode);}
else{this.pluginEdit.cleanError();}
return errorCode;}}
extend(nodeInput,nodeInputBase);function nodeip(name,value,options){nodeip.superclass.constructor.apply(this,arguments);this.updateView=function(phase){nodeip.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});var version=options.version;if(version&&version==6){this.pluginInput=this.pluginEdit.find(".input").lightUIIPv6({mandatory:options.mandatory,maxLength:43,re:options.re});}
else{this.pluginInput=this.pluginEdit.find(".input").lightUIIPv4({mandatory:options.mandatory,maxLength:18,re:options.re});}
this.val(this.value);this.bindEvents();if(options.disabled)this.disable();}
return this;}
this.setVersion=function(version){this.options.version=version;value=this.val();this.updateView("forward");return this;}}
extend(nodeip,nodeInput);function nodemac(name,value,options){nodemac.superclass.constructor.apply(this,arguments);this.updateView=function(phase){nodemac.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.pluginInput=this.pluginEdit.find(".input").lightUIMAC({mandatory:options.mandatory,maxLength:17,re:options.re});this.val(this.value);this.bindEvents();if(options.disabled)this.disable();}
return this;}}
extend(nodemac,nodeInput);function nodeDomainName(name,value,options){nodeDomainName.superclass.constructor.apply(this,arguments);this.updateView=function(phase){nodeDomainName.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.pluginInput=this.pluginEdit.find(".input").lightUIDomainName({mandatory:options.mandatory,re:options.re});this.val(this.value);this.bindEvents();if(options.disabled)this.disable();}
return this;}}
extend(nodeDomainName,nodeInput);function nodetext(name,value,options){nodetext.superclass.constructor.apply(this,arguments);this.updateView=function(phase){nodetext.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.pluginInput=this.pluginEdit.find(".input").lightUIText({mandatory:options.mandatory,password:options.password,re:options.re,maxLength:options.maxLength});this.val(this.value);this.bindEvents();if(options.disabled)this.disable();}
return this;}}
extend(nodetext,nodeInput);function nodestatic(name,value,options){nodestatic.superclass.constructor.apply(this,arguments);this.updateView=function(phase){nodestatic.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory,re:options.re});this.pluginInput=this.pluginEdit.find(".input").lightUIStatic();if(options.translate){this.pluginEdit.find(".input").html(lng(this.value)).attr("langkey",this.value);}
else{this.pluginEdit.find(".input").html(this.value);}
if(options.disabled)this.disable();}
return this;}
this.isModified=function(){};}
extend(nodestatic,nodeInput);function nodenum(name,value,options){nodenum.superclass.constructor.apply(this,arguments);this.updateView=function(phase){nodenum.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.pluginInput=this.pluginEdit.find(".input").lightUINumber({mandatory:options.mandatory,minval:options.minval,maxval:options.maxval,re:options.re});this.val(this.value);this.bindEvents();if(options.disabled)this.disable();}
return this;}
this.val=function(value){if(is.set(value)){return nodenum.superclass.val.call(this,(new Number(value)).valueOf());}
else{return nodenum.superclass.val.call(this)}}
this.minval=function(value){if(is.set(value)){this.options.minval=value;if(this.$box.isRendered()){this.pluginInput.flags().minval=value;}
return this;}
else{return this.options.minval;}}
this.maxval=function(value){if(is.set(value)){this.options.maxval=value;if(this.$box.isRendered()){this.pluginInput.flags().maxval=value;}
return this;}
else{return this.options.maxval;}}}
extend(nodenum,nodeInput);(function(){jQuery.fn.isModified=function(){var $obj=this.find("[rootnode]")
var modified=false;for(var i=0;i<$obj.length;i++){if($obj.eq(i).data("rootNode").deep.isModified()){modified=true;break;}}
return modified;}
return this;})();function nodeCheckBox(name,value,options){nodeCheckBox.superclass.constructor.call(this,name,value,options);this.updateView=function(phase){nodeCheckBox.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory,altname:options.optionName});this.pluginInput=this.pluginEdit.find(".input").lightUICheckbox();this.pluginInput.bind("change",context(this).callback(function(event){this.pluginEdit.cleanError();this.fieldchange();event.stopPropagation();return true;}));this.val(this.value);if(options.disabled)this.disable();}
return this;}
this.val=function(value){if(is.set(value)){this.applyAttrs(value);if(this.pluginInput){this.pluginInput.fieldval(value);}
this.value=value;return this;}
else{if(this.pluginInput){return this.pluginInput.fieldval();}
else{return this.value;}}}
this.toString=function(){return this.val()?"[<span langkey='yes'>"+lng("yes")+"</span>]":"[<span langkey='no'>"+lng("no")+"</span>]";}
this.updateModel=function(status){this.value=this.val();}}
extend(nodeCheckBox,nodeInputBase);function nodeComboGrid(name,value,options){nodeComboGrid.superclass.constructor.call(this,name,value,options);this.bindEvents=function(){if(is.string(this.options.blank)){this.pluginCombo.find("input").bind("change",context(this).callback(function(event){this.pluginEdit.cleanError();this.fieldchange()
event.stopPropagation();return true;}));this.pluginCombo.bind("rowclick.grid",context(this).callback(function(event,$row){this.pluginEdit.cleanError();this.emit("ruleselect",$row);event.stopPropagation();return true;}));}
else{this.pluginCombo.find("input").bind("change",context(this).callback(function(event){this.pluginEdit.cleanError();this.fieldchange()
event.stopPropagation();return true;}));}
this.pluginCombo.bind("error.input",context(this).callback(function(event,errorCode){this.pluginEdit.setError(errorCode);}));this.pluginCombo.bind("onfocus.input",context(this).callback(function(event){this.pluginEdit.cleanError();}));return this;}
nodeComboGrid.prototype.updateView=function(phase){nodeComboGrid.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});var $input=this.pluginEdit.find(".input");var flags={header:options.header,type:options.type,index:options.index,blank:options.blank,optionArray:options.optionArray,flags:{maxLength:options.maxLength,mandatory:options.mandatory,re:options.re}};this.pluginCombo=$input.lightUIComboGrid(flags);this.pluginCombo.find(".icon").css("display","none");this.bindEvents();this.val(this.value);if(options.disabled)this.disable();}
return this;}
this.val=function(value){if(is.set(value)){this.applyAttrs(value);if(this.pluginCombo){this.pluginCombo.fieldval(value);}
this.value=value;return this;}
else{if(this.pluginCombo){return this.pluginCombo.fieldval();}
else{return this.value;}}}
nodeComboGrid.prototype.addRow=function(header){var options=this.options;if(is('Object',header)){options.optionArray.push(header);}
if(this.pluginCombo){this.pluginCombo.addOption.apply(this.pluginCombo,arguments);}
return this;}
nodeComboGrid.prototype.cleanRows=function(){this.pluginCombo.cleanTable();return this;}
nodeComboGrid.prototype.updateModel=function(status){if(this.pluginEdit.isDisabled()||this.pluginEdit.is(":hidden"))return;var errorCode;if(this.options.mandatory){errorCode=this.pluginCombo.isEmpty()?"fieldEmpty":null;}
if(is.unset(errorCode)){errorCode=this.validate();}
if(is.set(errorCode)){this.pluginEdit.setError(errorCode);status.error=true;status.nodes.push(this);}
else{this.value=this.val();}
return this;}
this.fieldchange=function(){this.emit("fieldchange",this.pluginCombo.fieldval());return this;}
this.validate=function(){this.pluginCombo.flags().re=this.options.re;var errorCode=this.pluginCombo.validate();if(errorCode){this.pluginEdit.setError(errorCode);}
else{this.pluginEdit.cleanError();}
return errorCode;}
this.isModified=function(){if(!this.options.blank)nodeComboGrid.superclass.isModified.apply(this,arguments);}
if(!options.optionArray)options.optionArray=[];}
extend(nodeComboGrid,nodeInputBase);function nodeComboIP(name,value,options){this.setVersion=function(version){if(version==6){options.type="ipv6";}
else{options.type="ipv4";}
value=this.val();this.updateView("forward");return this;}
if(is.unset(options))options={};if(options.version==6){options.type="ipv6";}
else{options.type="ipv4";}
delete options.version;options.index="ip";nodeComboIP.superclass.constructor.call(this,name,value,options);}
extend(nodeComboIP,nodeComboGrid);function nodeComboMAC(name,value,options){if(is.unset(options))options={};options.type="mac";options.index="mac";nodeComboMAC.superclass.constructor.call(this,name,value,options);nodeComboMAC.prototype.updateView=function(phase){nodeComboMAC.superclass.updateView.apply(this,arguments);if(phase=="forward"){var userip=this.options.userip;if(is.set(userip)){this.pluginCombo
.addClass("node-combo-mac")
.bind("iconclick.grid",context(this).callback(function(){var $grid=this.pluginCombo;var userip=this.options.userip;var $row;for(var i=0;i<$grid.nrow();i++){$row=$grid.row(i);if($row.col("ip").html()==userip){this.val($row.col("mac").html());break;}}}))
.find(".icon")
.show()
.html("<span></span>")
.find("span")
.html(lng("clonemac"))
.attr("langkey","clonemac");}}
return this;}
this.addRow=function(){nodeComboMAC.superclass.addRow.apply(this,arguments);if(this.pluginCombo){var $grid=this.pluginCombo.getGrid();var $span=$grid.find(".icon span");if($span.is(":hidden")){if($grid.row("last").col("ip").html()==this.options.userip){$span.show();}}}
return this;}
this.cleanRows=function(){nodeComboMAC.superclass.cleanRows.apply(this,arguments);this.pluginCombo.find(".icon span").hide();return this;}}
extend(nodeComboMAC,nodeComboGrid);function nodeComboHost(name,value,options){if(is.unset(options))options={};options.type="host";options.index="host";nodeComboHost.superclass.constructor.call(this,name,value,options);}
extend(nodeComboHost,nodeComboGrid);function nodeComboText(name,value,options){if(is.unset(options))options={};options.type="text";nodeComboText.superclass.constructor.call(this,name,value,options);}
extend(nodeComboText,nodeComboGrid);function nodeSelect(name,value,options){nodeSelect.superclass.constructor.call(this,name,value,options);nodeSelect.prototype.updateView=function(phase){nodeSelect.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.pluginInput=this.pluginEdit.find(".input").lightUISelect({size:options.size,multiple:options.multiple,optionArray:options.optionArray,options:options.options,manualCorrection:options.manualCorrection});this.pluginInput.bind("change",context(this).callback(function(event){this.pluginEdit.cleanError();this.fieldchange();event.stopPropagation();return true;}));this.correctValue();this.val(this.value);if(options.disabled)this.disable();}
return this;}
this.val=function(value){if(is.set(value)){this.applyAttrs(value);if(this.pluginInput){this.pluginInput.fieldval(value);}
this.value=value;return this;}
else{if(this.pluginInput){return this.pluginInput.fieldval();}
else{return this.value;}}}
this.toString=function(){var value=this.val();var alias=value;var options=this.options.options;if(options){for(var i in options){if(options[i]==value){alias=i;break;}}}
return"<span langkey='"+alias+"'>"+lng(alias)+"</span>";}
this.addOption=function(name,value){if(is.unset(value))value=name;if(is.unset(this.value))this.value=value;var options=this.options;options.options[name]=value;options.optionArray.push({name:name,value:value});if(this.pluginInput){this.pluginInput.addOption(name,value);}
return this;}
this.cleanOptions=function(){this.options.options={};this.options.optionArray=[];if(this.pluginInput){this.pluginInput.cleanOptions();}
return this;}
this.correctValue=function(){var options=this.options;var isInList=false;var defValue;var optionArray=options.optionArray;var optionObject=options.options;var value=this.value;if(optionArray&&optionArray.length){defValue=optionArray[0].value;for(var i=0;i<optionArray.length;i++){if(value==optionArray[i].value){isInList=true;break;}}}
else if(optionObject){var j=0;for(var i in optionObject){if(!j++)defValue=optionObject[i];if(value==optionObject[i]){isInList=true;break;}}}
if(!isInList&&is.set(defValue))this.val(defValue);return this;}
this.updateModel=function(status){this.value=this.val();}
this.isModified=function(status){if(this.$box.isRendered()&&!this.isDisabled()&&this.$box.is(":visible")){var optionArray=this.options.optionArray;for(var i=0;i<optionArray.length;i++){if(this.isEqual(this.value,optionArray[i].value)){if(!this.isEqual(this.value,this.val())){status.modified=true;status.nodes.push(this);}
return;}}}}
this.bind("fieldchange",this.onfieldchange);var options=this.options;var opt;if(!options.options)options.options={};if(options.optionArray){for(var i=0;i<options.optionArray.length;i++){opt=options.optionArray[i];options.options[opt.name]=opt.value?opt.value:opt.name;}}
else{options.optionArray=[];for(var i in options.options){opt=options.options[i];options.optionArray.push({name:opt.name,value:opt.value?opt.value:opt.name});}}}
extend(nodeSelect,nodeInputBase);function nodemask(name,value,options){if(is.unset(options))options={};options.manualCorrection=true;nodemask.superclass.constructor.apply(this,arguments);this.bind("endform",function(){var ipath=this.options.bind;this.listen(ipath,"fieldchange",function(status,value){var version=status.target.options.version;if(is.set(version)&&version!=4)return;function getClass(ip){if(is.unset(ip))return null;if(ip.indexOf('.')>0){var classX=parseInt(ip.substring(0,ip.indexOf('.')));if(classX>=1&&classX<=126){return'A';}
if(classX>=128&&classX<=191){return'B';}
if(classX>=192&&classX<=223){return'C';}
if(classX>=224&&classX<=239){return'D';}
if(classX>=240&&classX<=247){return'E';}
return null;}}
this.setClass(getClass(value));}).get(ipath).fieldchange();});this.setClass=function(ipClass){var oldValue=this.val();switch(ipClass){case'A':this.cleanMasks()
.addClass('A');if($.browser.msie&&this.pluginInput){this.pluginInput.updateSelect();}
if(this.checkMask(oldValue)){this.val(oldValue);}
else{this.val('255.0.0.0');}
break;case'B':this.cleanMasks()
.addClass('B');if($.browser.msie&&this.pluginInput){this.pluginInput.updateSelect();}
if(this.checkMask(oldValue)){this.val(oldValue);}
else{this.val('255.255.0.0');}
break;case'C':this.cleanMasks()
.addClass('C');if($.browser.msie&&this.pluginInput){this.pluginInput.updateSelect();}
if(this.checkMask(oldValue)){this.val(oldValue);}
else{this.val('255.255.255.0');}
break;default:this.cleanMasks()
.addClass('A')
.addClass('B')
.addClass('C')
if($.browser.msie&&this.pluginInput){this.pluginInput.updateSelect();}
if(this.checkMask(oldValue)){this.val(oldValue);}
else{this.val('255.255.255.0');}}
this.ipClass=ipClass;return this;}
this.addMask=function(mask){this.addOption(mask);this.maskCheckList[mask]=true;return this;}
this.cleanMasks=function(){this.maskCheckList={};this.cleanOptions();return this;}
this.addClass=function(ipClass){switch(ipClass){case'A':this.addMask('255.0.0.0')
.addMask('254.0.0.0')
.addMask('252.0.0.0')
.addMask('248.0.0.0')
.addMask('240.0.0.0')
.addMask('224.0.0.0')
.addMask('192.0.0.0')
.addMask('128.0.0.0');break;case'B':this.addMask('255.255.0.0')
.addMask('255.254.0.0')
.addMask('255.252.0.0')
.addMask('255.248.0.0')
.addMask('255.240.0.0')
.addMask('255.224.0.0')
.addMask('255.192.0.0')
.addMask('255.128.0.0');break;case'C':this.addMask('255.255.255.255')
.addMask('255.255.255.254')
.addMask('255.255.255.252')
.addMask('255.255.255.248')
.addMask('255.255.255.240')
.addMask('255.255.255.224')
.addMask('255.255.255.192')
.addMask('255.255.255.128')
.addMask('255.255.255.0')
.addMask('255.255.254.0')
.addMask('255.255.252.0')
.addMask('255.255.248.0')
.addMask('255.255.240.0')
.addMask('255.255.224.0')
.addMask('255.255.192.0')
.addMask('255.255.128.0');break;}
return this;}
this.checkMask=function(value){return this.maskCheckList[value]}
this.maskCheckList={};}
extend(nodemask,nodeSelect);function nodeTextArea(name,value,options){nodeTextArea.superclass.constructor.call(this,name,value,options);this.updateView=function(phase){nodeTextArea.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});var $textarea=this.pluginEdit.find(".input").html("<textarea></textarea>").find("textarea");if(is.set(options.cols)){$textarea.attr("cols",options.cols);}
if(is.set(options.rows)){$textarea.attr("rows",options.rows);}
if(is.set(options.readonly)){$textarea.attr("readonly",options.readonly);}
$textarea.bind("change",context(this).callback(function(event){var errorCode=this.validate();if(errorCode){this.pluginEdit.setError(errorCode);}
else{this.pluginEdit.cleanError();this.fieldchange();}
event.stopPropagation();return true;}));this.val(this.value);if(options.disabled)this.disable();}
return this;}
this.val=function(value){var $textarea=this.$box.find("textarea");if(is.set(value)){this.applyAttrs(value);if($textarea.length){$textarea.val(value);}
this.value=value;return this;}
else{if(this.pluginEdit){return $textarea.val();}
else{return this.value;}}}
this.isEmpty=function(){return!this.val().length;}
this.validate=function(){var errorCode=null;var re=this.options.re;var validater;var value=this.val();if(is.array(re)){for(var i=0;i<re.length;i++){validater=re[i];if(is.func(validater)){errorCode=validater(value);if(errorCode){break;}}}}
else if(is.func(re)){errorCode=re(value);}
if(errorCode){this.pluginEdit.setError(errorCode);}
else{this.pluginEdit.cleanError(errorCode);}
return errorCode;}
this.updateModel=function(status){if(this.pluginEdit.isDisabled()||this.pluginEdit.is(":hidden"))return;var errorCode=(this.options.mandatory&&this.isEmpty())?"fieldEmpty":null;if(is.unset(errorCode)){errorCode=this.validate();}
if(is.set(errorCode)){this.pluginEdit.setError(errorCode);status.error=true;status.nodes.push(this);}
else{this.value=this.val();}
return this;}
this.toString=function(){var value=this.val();if(is.set(value)){return value.replace('\n',',');}
else{return nodeTextArea.superclass.toString.call(this);}}}
extend(nodeTextArea,nodeInputBase);function nodeCaption(name,comment){this.name=name;this.comment=comment;nodeCaption.superclass.constructor.call(this);this.updateView=function(phase){nodeCaption.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.pluginSection=this.$innerBox.lightUISection(this.name,this.comment);this.$box=this.pluginSection.find(".content");}
return this;}
this.setName=function(name){this.name=name;if(this.pluginSection){this.pluginSection.setName(name);}
return this;}
this.setContent=function(value){if(this.pluginSection){this.pluginSection.setContent(value);}
return this;}
this.setComment=function(value){this.comment=value;if(this.pluginSection){this.pluginSection.setComment(value);}
return this;}}
extend(nodeCaption,node);function nodeUpload(name,action,filename,options){if(is.unset(options))options={};this.name=name;this.action=action;this.filename=filename;this.options=options;nodeUpload.superclass.constructor.call(this,options);this.$upload=null;this.updateView=function(phase){nodeUpload.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.$upload=this.pluginEdit.find(".input").lightUIUpload(this.action,this.filename,options).bind({'begin.upload':callback(this,function(){this.emit("uploading",this.val());}),'end.upload':callback(this,function(e,data){this.emit("uploaded",this.val(),data);}),'change.upload':callback(this,function(){this.fieldchange();}),'break.upload':callback(this,function(){this.emit("cancel",this.val());})});if(options.disabled)this.disable();}
return this;}
this.val=function(value){if(this.$upload){return this.$upload.find("form input[type='file']").val();}
else{return"";}}
this.isEmpty=function(){return!this.val().length;}
this.validate=function(){var errorCode=null;var re=this.options.re;var validater;var value=this.val();if(is.array(re)){for(var i=0;i<re.length;i++){validater=re[i];if(is.func(validater)){errorCode=validater(value);if(errorCode){break;}}}}
else if(is.func(re)){errorCode=re(value);}
if(errorCode){this.pluginEdit.setError(errorCode);}
else{this.pluginEdit.cleanError(errorCode);}
return errorCode;}
this.updateModel=function(status){if(this.pluginEdit.isDisabled()||this.pluginEdit.is(":hidden"))return;var errorCode=(this.options.mandatory&&this.isEmpty())?"fieldEmpty":null;if(is.unset(errorCode)){errorCode=this.validate();}
if(is.set(errorCode)){this.pluginEdit.setError(errorCode);status.error=true;status.nodes.push(this);}
return this;}
this.fieldchange=function(){this.emit("fieldchange",this.val());return this;}
this.upload=function(){this.$upload.upload();return this;}
this.cancel=function(){this.$upload.cancel();return this;}
this.clear=function(){this.$upload.clear();return this;}
this.enable=function(){this.options.disabled=false;if(this.pluginEdit)this.pluginEdit.enable();if(this.$upload)this.$upload.enable();return this;}
this.disable=function(){this.options.disabled=true;if(this.pluginEdit)this.pluginEdit.disable();if(this.$upload)this.$upload.disable();return this;}
this.isDisabled=function(){return this.pluginEdit.isDisabled();}
this.setError=function(message){this.pluginEdit.setError(message);return this;}
this.cleanError=function(){this.pluginEdit.cleanError();return this;}
this.setComment=function(message){this.options.comment=message;this.pluginEdit.setComment(message);return this;}
this.cleanComment=function(){delete this.options.comment;this.pluginEdit.cleanComment();return this;}
this.label=function(name){if(is.set(name))this.name=name;return this.pluginEdit.label(name);}
this.onfieldchange=function(){this.modified=true;}
this.mandatory=function(value){if(is.set(value)){if(this.pluginEdit)this.pluginEdit.mandatory(value);this.options.mandatory=value;return this;}
else{return this.options.mandatory;}}
this.bind("fieldchange",this.onfieldchange);}
extend(nodeUpload,node);function nodeRadioBox(name,value,options){nodeRadioBox.superclass.constructor.call(this,name,value,options);this.updateView=function(phase){nodeRadioBox.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory,altname:options.optionName});var $input=this.pluginEdit.find(".input").html("<input type='radio' name='"+options.groupName+"' value='"+options.optionValue+"'/>").find("input");$input.bind("change",context(this).callback(function(event){this.pluginEdit.cleanError();this.emit("fieldchange",this.val());event.stopPropagation();return true;}));this.val(this.value);if(options.disabled)this.disable();}
return this;}
this.val=function(value){var $input=this.$box.find("input");if(is.bool(value)){this.applyAttrs(value);if($input.length){$input.attr("checked",value);}
this.value=value;return this;}
else{if(this.pluginEdit){return $input.attr("checked")?true:false;}
else{return this.value;}}}
this.optionValue=function(value){var $input=this.$box.find("input");if(is.set(value)){$input.attr("value",value);return this;}
else{if(this.pluginEdit){return $input.attr("value");}
else{return this.options.optionValue;}}}
this.updateModel=function(status){this.value=this.val();}}
extend(nodeRadioBox,nodeInputBase);function nodeOptionsBase(name,options){nodeOptionsBase.superclass.constructor.call(this,name,null,options);if(!this.options.options)this.options.options={};options=this.options;this.updateView=function(phase){nodeOptionsBase.superclass.updateView.call(this,phase);if(phase=="forward"){this.$box.addClass("node-options");}}
this.cleanOptions=function(){this.initForm();if(this.$box.isRendered()){this.deep.updateView();}
return this;}
this.enable=function(){for(var i=0;i<this.nchild();i++){this.child(i).enable();}
return this;}
this.disable=function(){for(var i=0;i<this.nchild();i++){this.child(i).disable();}
return this;}
this.isDisabled=function(){var child0=this.child(0);if(child0)return child0.isDisabled();return false;}
this.setError=function(message){return this;}
this.cleanError=function(){return this;}
this.setComment=function(message){return this;}
this.cleanComment=function(){return this;}
this.label=function(name){var child0=this.child(0);if(child0)child0.label(name);return this;}
delete this.isModified;this.name=name;this.options=options;var arr=options.options;if(is.array(arr)){for(var i=0;i<arr.length;i++){this.addOption(arr[i].name,arr[i].value,arr[i].checked,arr[i].comment);}}}
extend(nodeOptionsBase,nodeInputBase);function nodeOptions(name){this.addOption=function(name,value,checked,comment){var label=null;if(!this.nchild()){var label=this.name;}
this.add(new nodeCheckBox(label,checked,{optionName:name,comment:comment}),name);if(this.$box.isRendered()){this.child(this.nchild()-1).deep.updateView();}
return this;}
if(is.array(arguments[1])){var options={options:arguments[1]};}
else if(is.object(arguments[1])){var options=arguments[1];}
else if(is.object(arguments[2])){var options=arguments[2];}
nodeOptions.superclass.constructor.call(this,name,options);this.val=function(value){if(is.set(value)){return this;}
else{return null;}}
this.toString=function(){var child,name;var str="";var delim="";for(var i=0;i<this.children.length;i++){child=this.get(i);name=child.options.optionName;if(child.val()){str+=delim+"<span langkey='"+name+"'>"+lng(name)+"</span>";delim=",";}}
return str;}}
extend(nodeOptions,nodeOptionsBase);function nodeOptionsRadio(name,value,options){this.addOption=function(name,value,checked,comment){var label=null;if(!this.nchild()){var label=this.name;if(is.unset(this.value)){this.value=value;checked=true;}}
if(checked){this.value=value;}
else if(this.value==value){checked=true;}
this.add(new nodeRadioBox(label,checked,{optionName:name,groupName:this.groupName,optionValue:value,comment:comment}),value);this.listen(value,"fieldchange",function(status){status.bubbling=false;this.emit("fieldchange",status.target.options.optionValue);});if(this.$box.isRendered()){this.child(this.nchild()-1).deep.updateView();}
return this;}
if(name){this.groupName=name;}
else{this.groupName=gID.get();}
nodeOptionsRadio.superclass.constructor.call(this,name,options);this.val=function(value){if(is.set(value)){this.applyAttrs(value);var child;for(var i=0;i<this.nchild();i++){child=this.child(i);if(child.optionValue()==value){this.value=value;child.val(true);}
else{child.val(false);}}
return this;}
else{var child;for(var i=0;i<this.nchild();i++){child=this.child(i);if(child.val()){return child.optionValue();break;}}
return null;}}
this.toString=function(){var child;var str="";for(var i=0;i<this.children.length;i++){var child=this.get(i);var name=child.options.optionName;if(child.val())return"<span langkey='"+name+"'>"+lng(name)+"</span>";}
return"";}
this.updateModel=function(status){this.value=this.val();}
this.value=value;}
extend(nodeOptionsRadio,nodeOptionsBase);function nodeStepWizard(){nodeStepWizard.superclass.constructor.call(this);nodeStepWizard.prototype.updateView=function(phase,status){nodeStepWizard.superclass.updateView.apply(this,arguments);if(phase=="forward"){status.stop=true;if(is.set(this.lastActiveInx)){this.switchStep(this.lastActiveInx);}
else{this.switchStep("first");}}
return this;}
nodeStepWizard.prototype.addStep=function(obj,alias){this.add(obj,alias);return this;}
nodeStepWizard.prototype.removeStep=function(arg){this.skipStepOn(arg);return this;}
nodeStepWizard.prototype.switchStep=function(arg){var step=this.getStep(arg);if(step)step.deep.updateView(this.$box);return this;}
nodeStepWizard.prototype.getStep=function(arg){var step;function seekForward(inx){do{step=this.get(inx++);}
while(step&&step.options.skip)
return step;}
function seekBackward(inx){do{step=this.get(inx--);}
while(step&&step.options.skip)
return step;}
if(arg=="next"){return seekForward.call(this,this.getActiveIndex()+1);}
else if(arg=="prev"){return seekBackward.call(this,this.getActiveIndex()-1);}
else if(arg=="last"){return seekBackward.call(this,this.children.length-1);}
else if(arg=="first"){return seekForward.call(this,0);}
else if(arg=="active"||is.unset(arg)){return this.getActiveStep();}
else if(is.string(arg)||is.number(arg)){return this.get(arg);}
return null;}
nodeStepWizard.prototype.getActiveIndex=function(){var i;for(var i=0;i<this.children.length;i++){if(this.get(i).$box.isRendered())break;}
this.lastActiveInx=i;return i;}
nodeStepWizard.prototype.getActiveStep=function(){return this.get(this.getActiveIndex());;}
nodeStepWizard.prototype.skipStepOn=function(arg){this.getStep(arg).options.skip=true;return this;}
nodeStepWizard.prototype.skipStepOff=function(arg){delete this.getStep(arg).options.skip;return this;}
nodeStepWizard.prototype.isStepFirst=function(inx){return this.getStep("first")==this.getStep(inx);}
nodeStepWizard.prototype.isStepLast=function(inx){return this.getStep("last")==this.getStep(inx);}
function __next(stepDone,inx,__return){if(!is.func(__return))__return=function(){};function __stepUp(__return){this.switchStep("next");if(is.func(this.doAfter))this.doAfter(this.getActiveStep(),callbackEx(this,__return,true));else __return(true);}
if(!stepDone&&!this.isStepLast(inx)){if(is.func(this.doBefore))this.doBefore(this.getActiveStep(),callbackEx(this,__stepUp,__return));else __stepUp.call(this,__return)}
else{if(is.func(__return))__return(stepDone);}
return this;}
function __previous(stepDone,inx,__return){if(!is.func(__return))__return=function(){};if(!stepDone&&!this.isStepFirst(inx)){this.switchStep("prev");if(is.func(this.doAfter))this.doAfter(this.getActiveStep(),callbackEx(this,__return,true));else __return(true);}
else{__return(stepDone);}
return this;}
function __doStep(method,__return){var inx=this.getActiveIndex();var step=this.get(inx);if(step instanceof nodeStepWizard){__doStep.call(step,method,callbackEx(this,method,inx,__return));}
else method.call(this,false,inx,__return);return this;}
nodeStepWizard.prototype.next=function(__return){return __doStep.call(this,__next,__return);}
nodeStepWizard.prototype.previous=function(__return){return __doStep.call(this,__previous,__return);}
nodeStepWizard.prototype.checkNext=function(){var inx=this.getActiveIndex();var step=this.get(inx);if(!this.isStepLast(inx)){return true;}
else{if(step instanceof nodeStepWizard){return step.checkNext();}
else{return false;}}}
nodeStepWizard.prototype.checkPrevious=function(){var inx=this.getActiveIndex();var step=this.get(inx);if(!this.isStepFirst(inx)){return true;}
else{if(step instanceof nodeStepWizard){return step.checkPrevious();}
else{return false;}}}
this.activeIndex=0;}
extend(nodeStepWizard,node);function nodeWizard(){nodeWizard.superclass.constructor.call(this);nodeWizard.prototype.updateView=function(phase){nodeWizard.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;var child;this.pluginWizard=this.$box.lightUIWizard();for(var i=0;i<this.children.length;i++){child=this.child(i)
child.$outerBox=this.pluginWizard.addStep(this.child(i).getAlias()).getStep(i);if(child.options.skip)this.pluginWizard.skipStepOn(i);}}
return this;}
nodeWizard.prototype.addStep=function(obj,alias){this.add(obj,alias);if(is.jquery(this.pluginWizard)){var $obj=this.pluginWizard.addStep(alias).getStep(alias);if(is.set(alias)){this.child(alias).$outerBox=$obj;this.child(alias).deep.updateView();}
else{this.child(this.children.length-1).$outerBox=$obj;this.child(this.children.length-1).deep.updateView();}}
return this;}
nodeWizard.prototype.removeStep=function(arg){this.pluginWizard.removeStep(arg);for(var i=0;i<this.children.length;i++){if(!this.jQuery(i).length){this.replace(i);}}
return this;}
nodeWizard.prototype.switchStep=function(arg){this.pluginWizard.switchStep(arg);return this;}
nodeWizard.prototype.getActiveIndex=function(){return this.pluginWizard.getActiveIndex();}
nodeWizard.prototype.getActiveStep=function(){var inx=this.getActiveIndex();return this.get(inx);}
nodeWizard.prototype.skipStepOn=function(arg){var step=this.get(arg);var index=step.index();step.options.skip=true;if(is.jquery(this.pluginWizard))this.pluginWizard.skipStepOn(index);return this;}
nodeWizard.prototype.skipStepOff=function(arg){var step=this.get(arg);var index=step.index();delete step.options.skip;if(is.jquery(this.pluginWizard))this.pluginWizard.skipStepOff(index);return this;}
function __next(stepDone,inx,__return){if(!is.func(__return))__return=function(){};function __stepUp(__return){this.switchStep("next");if(is.func(this.doAfter))this.doAfter(this.getActiveStep(),callbackEx(this,__return,true));else __return(true);}
if(!stepDone&&!this.pluginWizard.isStepLast(inx)){if(is.func(this.doBefore))this.doBefore(this.getActiveStep(),callbackEx(this,__stepUp,__return));else __stepUp.call(this,__return)}
else{if(is.func(__return))__return(stepDone);}
return this;}
function __previous(stepDone,inx,__return){if(!is.func(__return))__return=function(){};if(!stepDone&&!this.pluginWizard.isStepFirst(inx)){this.switchStep("prev");if(is.func(this.doAfter))this.doAfter(this.getActiveStep(),callbackEx(this,__return,true));else __return(true);}
else{__return(stepDone);}
return this;}
function __doStep(method,__return){var inx=this.getActiveIndex();var step=this.get(inx);if(step instanceof nodeWizard){__doStep.call(step,method,callbackEx(this,method,inx,__return));}
else method.call(this,false,inx,__return);return this;}
nodeWizard.prototype.next=function(__return){return __doStep.call(this,__next,__return);}
nodeWizard.prototype.previous=function(__return){return __doStep.call(this,__previous,__return);}
nodeWizard.prototype.checkNext=function(){var inx=this.getActiveIndex();var step=this.get(inx);if(!this.pluginWizard.isStepLast(inx)){return true;}
else{if(step instanceof nodeWizard){return step.checkNext();}
else{return false;}}}
nodeWizard.prototype.checkPrevious=function(){var inx=this.getActiveIndex();var step=this.get(inx);if(!this.pluginWizard.isStepFirst(inx)){return true;}
else{if(step instanceof nodeWizard){return step.checkPrevious();}
else{return false;}}}
this.activeIndex=0;}
extend(nodeWizard,node);function nodeTrackbar(name,value,options){if(is.unset(options))options={};this.name=name;this.options=options;nodeTrackbar.superclass.constructor.call(this,options);this.$trackbar=null;this.updateView=function(phase){nodeTrackbar.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.$trackbar=this.pluginEdit.find(".input").lightUITrackbar(value,options).bind({'change.trackbar':callback(this,function(){this.fieldchange();})});if(options.disabled)this.disable();}
return this;}
this.val=function(value){if(is.set(value)){this.applyAttrs(value);this.$trackbar.fieldval(value);return this;}
return this.$trackbar.fieldval();}
this.updateModel=function(status){if(this.pluginEdit.isDisabled()||this.pluginEdit.is(":hidden"))return;return this;}
this.fieldchange=function(){this.emit("fieldchange",this.val());return this;}
this.enable=function(){this.options.disabled=false;if(this.pluginEdit)this.pluginEdit.enable();if(this.$trackbar)this.$trackbar.enable();return this;}
this.disable=function(){this.options.disabled=true;if(this.pluginEdit)this.pluginEdit.disable();if(this.$trackbar)this.$trackbar.disable();return this;}
this.isDisabled=function(){return this.pluginEdit.isDisabled();}
this.setComment=function(message){this.options.comment=message;this.pluginEdit.setComment(message);return this;}
this.cleanComment=function(){delete this.options.comment;this.pluginEdit.cleanComment();return this;}
this.label=function(name){if(is.set(name))this.name=name;return this.pluginEdit.label(name);}
this.onfieldchange=function(){this.modified=true;}
this.bind("fieldchange",this.onfieldchange);}
extend(nodeTrackbar,nodeInputBase);
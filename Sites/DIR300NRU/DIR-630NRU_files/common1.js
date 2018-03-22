function gridActionConverter(rm,ch,nw){function extract_index($rows){var temp=new Array();for(var i=0;i<$rows.length;i++){temp.push($rows.eq(i).irow());}
return temp;}
if(arguments.length==1){var grid=arguments[0];rm=grid.selection();ch=grid.changedRows();nw=grid.newRows();}
rm=extract_index(rm);ch=extract_index(ch);nw=extract_index(nw);var temp_rm=new Array();for(var i=0;i<rm.length;i++){var row=rm[i];var index_ch=$.inArray(row,ch);var index_nw=$.inArray(row,nw);if(index_ch>-1){ch.splice(index_ch,1);}
if(index_nw>-1){nw.splice(index_nw,1);}else{temp_rm.push(row);}}
rm=temp_rm;var temp_ch=new Array();for(var i=0;i<ch.length;i++){var row=ch[i];if($.inArray(row,nw)==-1){temp_ch.push(row);}}
ch=temp_ch;function real_index(value){var offset=0;for(var i=0;i<rm.length;i++){var temp=rm[i];if(temp<value){offset++;}else break;}
return value-offset;}
var real_ch=new Array();for(var i=0;i<ch.length;i++){real_ch.push(real_index(ch[i]));}
var real_nw=new Array();for(var i=0;i<nw.length;i++){real_nw.push(real_index(nw[i]));}
return{'deleted':rm.sort().reverse(),'changed':ch,'added':nw,'r_changed':real_ch,'r_added':real_nw,'count':rm.length+ch.length+nw.length};}
function jsWindowController(){jsWindowController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsWindowClientView};}
extend(jsWindowController,jsController);function jsWindowClientView(ctrl,viewInx,options){jsWindowClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsWindowClientView.prototype.show=function(){rootCtrl.getChild('startInfo').event('stoprefreshrq');var win=$(this.myBoxSel);if($(win).is(':hidden')){var topOffset=$(win).parent().offset().top-$(win).parent().position().top;var leftOffset=$(win).parent().offset().left-$(win).parent().position().left;$(win).css({'left':$(window).width()/2-$(win).width()/2-leftOffset,'top':$(window).height()/2-$(win).height()/2-topOffset});this.showModalOverlay();$(win).fadeIn('slow');this.ctrl.event("showpopupdlg",this,true);}}
jsWindowClientView.prototype.hide=function(){var win=$(this.myBoxSel);if($(win).is(':visible')){$(win).fadeOut('slow');this.hideModalOverlay();this.ctrl.event("hidepopupdlg",this,true);if($('#modalOverlayBox input').val()=='0'&&$('#wrapperNavigator>a:eq(0)').hasClass('selected')&&!$('#slideboard').is(':visible')){window.rootCtrl.getChild('startInfo').event('startrefreshrq');}}}
this.bounce=function(){$(this.myBoxSel).animate({left:"-=24px"},100).animate({left:"+=48px"},100).animate({left:"-=40px"},100).animate({left:"+=32px"},100).animate({left:"-=16px"},100);}
jsWindowClientView.prototype.drawView=function(){var htmlToDraw='';var options=this.options;var uid=getUID();var children=this.ctrl.children;var child;this.myBoxSel='#window'+uid;this.viewBoxSel=options.viewBoxSel;this.childBoxSel=this.myBoxSel+'>.windowContent';this.preloader=this.myBoxSel+'>.windowCaption>.windowPreloader';this.closer=this.myBoxSel+'>.windowCaption>.windowCloser';if(!no(options.title.name))options.title=options.title.name;htmlToDraw="<div class='window' id='window"+uid+"' style='display: none'>";htmlToDraw+="<div class='windowCaption unselectable'>";htmlToDraw+="<div class='windowTitle' unselectable='on'>"+lng(options.title)+"</div>";htmlToDraw+="<div class='windowPreloader' unselectable='on'><img src='' /></div>";htmlToDraw+="<div class='windowCloser' unselectable='on'><img src='/image/closer.gif' /></div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="<div class='windowContent'>";for(var i=0;i<children.length;i++){if(i!=children.length-1&&children.length>1){htmlToDraw+='<div class="windowSpacer"></div>';}else{htmlToDraw+='<div></div>';}
child=this.getChild(i);child.options.viewBoxSel=this.childBoxSel+">div:eq("+i+")";child.viewBoxSel=child.options.viewBoxSel;}
htmlToDraw+="</div>";htmlToDraw+="<div class='windowAction unselectable'></div>";htmlToDraw+="<div class='windowOverlay'></div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);if(!no(options.notCloser)){$(this.viewBoxSel+' .windowCloser>img').hide();}else{$(this.viewBoxSel+' .windowCloser>img').click(context(this).callback(function(){this.hide();this.ctrl.event('dialogclosed',this,true);}));}
if(!no(options.width)){$(this.viewBoxSel+' .windowContent').css('width',options.width);}
if(!no(options.height)){$(this.viewBoxSel+' .windowContent').css('height',options.height);}
if(!no(options.buttons)){options.action=[];for(var i=0;i<options.buttons.length;i++){options.action.push({'name':options.buttons[i].value,'func':options.buttons[i].handler});}}
if(!no(options.action)){for(var i=0;i<options.action.length;i++){var a=$("<a href='#' unselectable='on'>"+lng(options.action[i].name)+"</a>");$(this.myBoxSel+'>.windowAction').append($(a));$(a).bind('click',context(this).callback(options.action[i].func));}}
if(!no(options.draggable)||true){var caption=$(this.myBoxSel+'>.windowCaption');$(caption).mousedown(context(this).callback(this.startWindowDrag));$(caption).mouseup(context(this).callback(this.stopWindowDrag));$('body').bind('mousemove',context(this).callback(this.moveWindow));$('body').bind('mouseup',function(e){$(caption).mouseup();});}
$(this.preloader).bind("ajaxStart",function(){$(this).find('>img').attr('src','/image/preloader.gif');$(this).show();}).bind('ajaxError',function(){$(this).find('>img').attr('src','/image/errormarker.gif');$(this).show();}).bind('ajaxStop',function(){$(this).hide();});$(this.closer).bind("ajaxStart",function(){$(this).hide();}).bind('ajaxError',function(){$(this).hide();}).bind('ajaxStop',function(){$(this).show();});$(this.myBoxSel).bind("ajaxStart",function(){$(this).find('>.windowOverlay').fadeTo(200,0.7);}).bind('ajaxStop',function(){$(this).find('>.windowOverlay').fadeTo(600,0,function(){$(this).hide();});});jsWindowClientView.superclass.drawView.call(this);}
this.getActionIndex=function(name){for(var i=0;i<options.action.length;i++){if(options.action[i].name==name){return i}}
return-1;}
jsWindowClientView.prototype.hideAction=function(name){var index=this.getActionIndex(name);if(index>=0){$(this.myBoxSel+'>.windowAction>a:eq('+index+')').hide();}}
jsWindowClientView.prototype.showAction=function(name){var index=this.getActionIndex(name);if(index>=0){$(this.myBoxSel+'>.windowAction>a:eq('+index+')').show();}}
jsWindowClientView.prototype.disableAction=function(name){var index=this.getActionIndex(name);if(index>=0){$(this.myBoxSel+'>.windowAction>a:eq('+index+')').addClass('disable').unbind('click');}}
jsWindowClientView.prototype.enableAction=function(name){var index=this.getActionIndex(name);if(index>=0){$(this.myBoxSel+'>.windowAction>a:eq('+index+')').removeClass('disable').bind('click',context(this).callback(options.action[index].func));}}
jsWindowClientView.prototype.hideButton=this.hideAction;jsWindowClientView.prototype.showButton=this.showAction;jsWindowClientView.prototype.disableButton=this.disableAction;jsWindowClientView.prototype.enableButton=this.enableAction;this.startWindowDrag=function(e){var zindex=0;$('.window').each(function(){if($(this).css('z-index')>zindex){zindex=$(this).css('z-index');}});zindex++;$(this.myBoxSel).css('z-index',zindex);this.dragInfo.isDragging=true;this.dragInfo.oldLeft=e.pageX-getPosX(this.myBoxSel);this.dragInfo.oldTop=e.pageY-getPosY(this.myBoxSel);$('body').css('cursor','move');return false;}
this.moveWindow=function(e){if(this.dragInfo.isDragging){var x=e.pageX-getPosX(this.myBoxSel);var y=e.pageY-getPosY(this.myBoxSel);$(this.myBoxSel).css({'left':getPosX(this.myBoxSel)+x-this.dragInfo.oldLeft,'top':getPosY(this.myBoxSel)+y-this.dragInfo.oldTop});return false;}}
this.stopWindowDrag=function(){this.dragInfo.isDragging=false;$('body').css('cursor','default');return false;}
this.dragInfo={isDragging:false,oldLeft:0,oldTop:0};this.showModal=this.show;this.isWin=true;}
extend(jsWindowClientView,jsCSideView);jsFieldSetPopUpClientView=jsWindowClientView;function jsFieldSetController(){jsFieldSetController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsFieldSetClientView};this.ifaceTypes.server={type:jsSSideView};}
extend(jsFieldSetController,jsController);function jsFieldSetClientView(ctrl,viewInx,options){if(options){var title=options.title;var tabs=options.tabs;var wizard=options.wizard;var buttons=options.buttons;options.title="";options.tabs=false;options.wizard=false;options.buttons=null;}
jsFieldSetClientView.superclass.constructor.call(this,ctrl,viewInx,options);if(options){this.options.title=title;this.options.tabs=tabs;this.options.wizard=wizard;this.options.buttons=buttons;}
jsFieldSetClientView.prototype.drawView=function(){var childCtrls=this.ctrl.children;var options=this.options;var title=options.title?options.title:"&nbsp;";var obj=null;var htmlToDraw="";if(options.slider){if(options.nocollapse){htmlToDraw+="<div class='fieldSetSlider fieldSetSliderNoCollapse'>";}
else{if(options.collapsed){htmlToDraw+="<div class='fieldSetSlider fieldSetSliderCollapsed'>";}
else{htmlToDraw+="<div class='fieldSetSlider fieldSetSliderExpanded'>";}}
htmlToDraw+="<div>";if(options.title){htmlToDraw+=lng(options.title);}
htmlToDraw+="</div></div>";if(options.descClass){htmlToDraw+="<div class='"+options.descClass+"'>";}
else{htmlToDraw+="<div class='fieldSetSliderBottom'>";}
htmlToDraw+="<div>";if(options.descText){htmlToDraw+=lng(options.descText);}
htmlToDraw+="</div></div>";}
if(options.slider||options.nothing){if(options.slider&&options.collapsed&&!options.nocollapse){htmlToDraw+="<div style='display:none'></div>";}
else{htmlToDraw+="<div></div><div class='buttonsInline'></div>";}
$(this.viewBoxSel).html(htmlToDraw);if(options.slider){this.childBoxSel=this.viewBoxSel+">div:eq(2)";}
else{this.childBoxSel=this.viewBoxSel+">div:eq(0)";if(options.buttonsInline){this.buttonBarSel=this.viewBoxSel+">div.buttonsInline";}}
this.options.childBoxSel=this.childBoxSel;if(options.slider&&!options.nocollapse){$(this.viewBoxSel+">div.fieldSetSlider").bind("click",context(this).callback(this.toggleSlider));}}
else if(options.simple){htmlToDraw+="<div><fieldset></fieldset><div class='buttonsInline'></div></div>";$(this.viewBoxSel).html(htmlToDraw);this.childBoxSel=this.viewBoxSel+">div>fieldset";this.options.childBoxSel=this.childBoxSel;if(options.buttonsInline){this.buttonBarSel=this.viewBoxSel+">div>div.buttonsInline";}}
else{if(options.title){if(options.title.type=="link"){title="<font class='fieldSetTitleLink'>"+lng(options.title.name)+"</font>"}
else{title="<font class='fieldSetTitleText'>"+lng(options.title.name)+"</font>"}}
else{title="&nbsp;";}
htmlToDraw="<div class='fieldSetMainPath'><div style='display: inline; vertical-align: middle;'></div>"
+"<div style='margin-left: 4px; display: inline;'>"
+title
+"</div></div>"
+"<div class='fieldSetMainContentContainer'>";htmlToDraw+="<div class='fieldSetMainContent'>"
+"<div class='fieldSetGeneral' style='display: block;'>"
+"</div></div></div><div class='buttonsInline'></div>";$(this.viewBoxSel).html(htmlToDraw);if(options.title&&options.title.type=="link"){$(this.viewBoxSel+">div.fieldSetMainPath>div>font").bind("click",{},context(this).callback(options.title.handler));}
this.childBoxSel=this.viewBoxSel+">div.fieldSetMainContentContainer>div.fieldSetMainContent>div.fieldSetGeneral";this.options.childBoxSel=this.childBoxSel;if(options.buttonsInline){this.buttonBarSel=this.viewBoxSel+">div.buttonsInline";}}
if(options.wizard&&childCtrls.length>1){this.switchChild(this.activeTab);}
if(childCtrls.length)$(this.childBoxSel).html("");var htmlToAppend="";var j=0;if(childCtrls.length>1){for(var i in childCtrls){htmlToAppend+="<div style='margin: 3px 0px'></div>";obj=this.getChild(i);if(!(obj instanceof jsCSideView))continue;if(options.tabs||options.pages||options.wizard){obj.viewBoxSel=this.childBoxSel+">div:eq("+j+")";}
else{htmlToAppend+="<div class='fieldSetSpacer'></div>";obj.viewBoxSel=this.childBoxSel+">div:eq("+j*2+")";}
obj.options.viewBoxSel=obj.viewBoxSel;if(no(obj.options.buttonsInline)){if(options.buttons){obj.options.buttonsInline=(options.buttons.length>0);}else{obj.options.buttonsInline=true;}}
j++;}
if(options.tabs||options.pages||options.wizard){for(var i=0;i<this.ctrl.children.length;i++){obj=this.getChild(i);if(obj instanceof jsCSideView){obj.options.hide=true;}}
this.getChild(this.activeTab).options.hide=false;}
$(this.childBoxSel).append(htmlToAppend);}
else if(childCtrls.length){obj=this.getChild(0);if(obj instanceof jsCSideView){obj.viewBoxSel=this.childBoxSel;obj.options.viewBoxSel=obj.viewBoxSel;}}
this.drawTabBar();this.drawButtons();this.drawPageBar();jsFieldSetClientView.superclass.drawView.call(this);}
this.toggleSlider=function(time){var options=this.options;var obj=$(options.viewBoxSel+">div.fieldSetSlider");if(!time){time='slow';}
if(options.collapsed){obj.removeClass("fieldSetSliderCollapsed");obj.addClass("fieldSetSliderExpanded");$(options.childBoxSel).slideDown(time);options.collapsed=false;}
else{obj.removeClass("fieldSetSliderExpanded");obj.addClass("fieldSetSliderCollapsed");$(options.childBoxSel).slideUp(time);options.collapsed=true;}
return false;}
jsFieldSetClientView.prototype.hideButton=function(name){if(this.buttons&&name in this.buttons){$(this.buttons[name].sel).css("display","none");}}
jsFieldSetClientView.prototype.showButton=function(name){if(this.buttons&&name in this.buttons){$(this.buttons[name].sel).css("display","");}}
jsFieldSetClientView.prototype.disableButton=function(name){if(this.buttons&&name in this.buttons){$(this.buttons[name].sel).removeClass('normal push').addClass('disable');this.unsetButtonClick(name);}}
jsFieldSetClientView.prototype.enableButton=function(name){if(this.buttons&&name in this.buttons){$(this.buttons[name].sel).removeClass('disable').addClass('normal');this.unsetButtonClick(name);this.setButtonClick(name);}}
jsFieldSetClientView.prototype.updateButtons=function(){if(this.options.buttons){this.drawButtons();}}
jsFieldSetClientView.prototype.showTab=function(tabInx){$(this.tabBarSel+'>.pageTab:eq('+tabInx+')').addClass('active');this.getChild(tabInx).show();if(this.getChild(tabInx)instanceof jsFieldSetClientView){this.getChild(tabInx).drawButtons();this.getChild(tabInx).drawPageBar();}}
jsFieldSetClientView.prototype.hideTab=function(tabInx){$(this.tabBarSel+'>.pageTab:eq('+tabInx+')').removeClass('active');this.getChild(tabInx).hide();}
jsFieldSetClientView.prototype.switchTab=function(tabInx){if(this.activeTab!=tabInx){this.hideTab(this.activeTab);this.showTab(tabInx);this.activeTab=tabInx;}}
jsFieldSetClientView.prototype.switchPage=function(pageInx){$(this.pageBarSel+'>.pageLink:eq('+this.activeTab+')').removeClass('active');$(this.pageBarSel+'>.pageLink:eq('+pageInx+')').addClass('active');this.switchChild(pageInx);}
jsFieldSetClientView.prototype.switchChild=function(childId){this.getChild(this.activeTab).hide();var child=this.getChild(childId);child.show();this.activeTab=child.ctrl.thisInx;}
jsFieldSetClientView.prototype.drawTabBar=function(){var children=this.ctrl.children;var options=this.options;var htmlToDraw='';if(options.ishidden)return;if(this.isPage()){if(options.tabs&&children.length>1){$('#pageTitle>.pageTitle>span').show();for(var i=0;i<children.length;i++){htmlToDraw+="<div class='pageTab'><a href='#' langkey=\""+this.getChild(i).options.title+"\">"+lng(this.getChild(i).options.title)+"</a></div>";}}else if(!no(options.pageTitle)){htmlToDraw+="<div class='pageTab'><a href='#' langkey=\""+options.pageTitle+"\">"+lng(options.pageTitle)+"</a></div>";}else{return;}
htmlToDraw+="<div class='clear'></div>";$(this.tabBarSel).html(htmlToDraw);$(this.tabBarSel).find('>.pageTab:eq('+this.activeTab+')').addClass('active');this.setTabClicks();}}
jsFieldSetClientView.prototype.drawPageBar=function(){var children=this.ctrl.children;var options=this.options;var htmlToDraw='';if(options.ishidden)return;if(options.pages){$('#pageGeneral').addClass('frameStyle');$('#pageScrollShadowTop').hide();$('#pageScrollShadowBottom').hide();for(var i=0;i<children.length;i++){htmlToDraw+="<a href='#' class='pageLink'>";htmlToDraw+="<img src='/image/coner_master.png' />";htmlToDraw+="<span>"+(i+1)+"</span>";htmlToDraw+="</a>";}
$(this.pageBarSel).html(htmlToDraw);this.setPageClicks();this.switchPage(this.activeTab);}else{$('#pageGeneral').removeClass('frameStyle');$('#pageScrollShadowTop').show();$('#pageScrollShadowBottom').show();$(this.pageBarSel).html('');var obj;for(var i=0;i<children.length;i++){obj=this.getChild(i);if(obj instanceof jsFieldSetClientView)obj.drawPageBar();}}}
this.drawButtons=function(){var children=this.ctrl.children;var options=this.options;var htmlToDraw="";var button;if((options.ishidden||options.hide)&&!options.buttonsInline)return;if(options.buttons&&options.buttons.length>0){for(var i=0;i<options.buttons.length;i++){button=options.buttons[i];if(button){htmlToDraw+="<div class='buttoner normal unselectable'>";htmlToDraw+="<input name='"+button.name+"' value='"+lng(button.value)+"' type='hidden'>";htmlToDraw+="<div class='title' unselectable='on'>"+lng(button.value)+"</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";}}
$(this.buttonBarSel).html(htmlToDraw);$(this.buttonBarSel+'>.buttoner').mouseenter(function(){$(this).not('.disable').addClass('hover');}).mouseleave(function(){$(this).not('.disable').removeClass('hover');}).mousedown(function(){$(this).not('.disable').addClass('push');}).mouseup(function(){$(this).not('.disable').removeClass('push');});this.setButtonClicks();}}
this.cleanButtons=function(){$(this.buttonBarSel).html("");}
jsFieldSetClientView.prototype.ontabclick=function(event){for(var i=0;i<this.ctrl.children.length;i++){var tab=this.getChild(i);if(tab instanceof jsCSideView){if(!no(tab.ctrl.activeRecordInx)){tab.ctrl.activeRecordInx=-1;}
tab.constructor(tab.ctrl,tab.viewInx,tab.options);tab.drawView();tab.ctrl.event("updaterq");}}
this.switchTab(event.data.tabInx);return false;}
jsFieldSetClientView.prototype.onpageclick=function(event){this.switchPage(event.data.pageInx);return false;}
jsFieldSetClientView.prototype.setTabClicks=function(){var ontabclick=context(this).callback(this.ontabclick);$(this.tabBarSel+'>.pageTab').each(function(index){$(this).bind("click",{tabInx:index},ontabclick);});}
jsFieldSetClientView.prototype.setPageClicks=function(){for(var i=0;i<this.ctrl.children.length;i++){$(this.pageBarSel+">.pageLink:eq("+i+")").bind("click",{pageInx:i},context(this).callback(this.onpageclick));}}
jsFieldSetClientView.prototype.setButtonClicks=function(){var options=this.options;if(options.buttons&&options.buttons.length>0){var buttonSel;this.buttons={};for(var i=0;i<options.buttons.length;i++){var button=options.buttons[i];if(button){buttonSel=this.buttonBarSel+">.buttoner:eq("+i+")";this.buttons[button.name]={sel:buttonSel,handler:button.handler};$(buttonSel).bind("click",{},context(this).callback(button.handler));}}}}
jsFieldSetClientView.prototype.setButtonClick=function(name){if(this.buttons){$(this.buttons[name].sel).bind("click",{},context(this).callback(this.buttons[name].handler));}}
jsFieldSetClientView.prototype.unsetButtonClick=function(name){if(this.buttons){$(this.buttons[name].sel).unbind('click');}}
jsFieldSetClientView.prototype.onerrstat=function(){var options=this.options;if(options.slider&&options.collapsed){this.toggleSlider();}
return true;}
jsFieldSetClientView.prototype.isPage=function(){return!(this.getParent()instanceof jsFieldSetClientView);}
this.activeTab=this.options.activeTab?this.options.activeTab:0;this.tabBarSel='#pageTabs';this.pageBarSel='#pageToolbarMisc';this.buttonBarSel=(this.options.buttonBarSel?this.options.buttonBarSel:"#pageToolbarButtons");this.bind("errstat",this.onerrstat)}
extend(jsFieldSetClientView,jsCSideView);function js3GSettingsModel(ifnode){js3GSettingsModel.superclass.constructor.call(this);this.ifnode=ifnode;}
extend(js3GSettingsModel,jsModel);function js3GSettingsController(ifnode){js3GSettingsController.superclass.constructor.call(this);this.changeModel(new js3GSettingsModel(ifnode));this.ifaceTypes.client={type:js3GSettingsClientView};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:js3GSettingsClientView};this.ifaceTypes.summary.options={};this.addChild(new jsInputController(ifnode.mode),"mode");}
extend(js3GSettingsController,jsController);function js3GSettingsClientView(ctrl,viewInx,options){options=options?options:{};this.updateModel=function(){var res=js3GSettingsClientView.superclass.updateModel.call(this);if(res){var ifnode=this.ctrl.model.ifnode;ifnode.mode=this.getChild("mode").ctrl.model.toString();}
return res;}
this.onmodeswitch=function(value){if(this.options.brief){this.hide();}
else{this.show();}
return false;}
var obj;var ifnode=ctrl.model.ifnode;obj=ctrl.getChild("mode");obj.nextIface="select";if(ifnode.type=="3g"){obj.ifaceTypes.select.options={humanName:"g3_actual_mode",valset:{"auto":"32","3g":"3","2g":"2"}};}
else{obj.ifaceTypes.select.options={humanName:"g3_actual_mode",valset:{"auto":"0","4g":"4","3g":"3","2g":"2"}};}
js3GSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("modeswitch",this.onmodeswitch);if(ifnode.wizard){options.nothing=true;options.hide=this.options.brief;}
else{options.slider=true;options.title="menu_g3";options.collapsed=false;options.nocollapse=true;}}
extend(js3GSettingsClientView,jsFieldSetClientView);window.provs3g={russia:{tele2:{name:"provtele2",deftype:"3g",'3g':{any:{services:{create:{name:"tele2",noauth:true,apn:"internet.TELE2.ru",dial_num:"*99#",username:"",password:""}}}}},beeline:{deftype:"3g",'3g':{any:{services:{create:{name:"beeline",apn:"home.beeline.ru",dial_num:"*99#",username:"beeline",password:"beeline"}}}}},mts:{deftype:"3g",'3g':{any:{services:{create:{name:"mts",apn:"internet.mts.ru",dial_num:"*99#",username:"mts",password:"mts"}}}}},skylink:{deftype:"3g",'3g':{any:{services:{create:{name:"skylink",dial_num:"#777",username:"mobile",password:"internet"}}}}},megafon:{megafoncenter:{deftype:"3g",'3g':{any:{services:{create:{name:"megafon",apn:"internet",dial_num:"*99#",username:"gdata",password:"gdata"}}}}},megafonsib:{deftype:"3g",'3g':{any:{services:{create:{name:"megafonsib",noauth:true,apn:"internet.sib",dial_num:"*99#",username:"",password:""}}}}},megafonkvk:{deftype:"3g",'3g':{any:{services:{create:{name:"megafonkvk",apn:"internet.kvk",dial_num:"*99#",noauth:true,username:"",password:""}}}}},megafonugsm:{deftype:"3g",'3g':{any:{services:{create:{name:"megafonugsm",noauth:true,apn:"internet.ugsm",dial_num:"*99#",username:"",password:""}}}}},megafonmc:{deftype:"3g",'3g':{any:{services:{create:{name:"megafonmc",noauth:true,apn:"internet.mc",dial_num:"*99#",username:"",password:""}}}}}},altaysviaz:{deftype:"3g",'3g':{any:{services:{create:{name:"altaysviaz",noauth:true,apn:"internet.altaysv.ru",dial_num:"*99#",username:"",password:""}}}}},utel:{deftype:"3g",'3g':{any:{services:{create:{name:"utel",noauth:true,apn:"internet.usi.ru",dial_num:"*99#",username:"",password:""}}}}},ncc:{deftype:"3g",'3g':{any:{services:{create:{name:"ncc",noauth:true,apn:"internet",dial_num:"*99#",username:"",password:""}}}}},stekgsm:{deftype:"3g",'3g':{any:{services:{create:{name:"stekgsm",noauth:true,apn:"internet.stekgsm.ru",dial_num:"*99#",username:"",password:""}}}}},matrixmobile:{deftype:"3g",'3g':{any:{services:{create:{name:"matrixmobile",apn:"wap",dial_num:"*99#",username:"wap",password:"wap"}}}}},simtravel:{deftype:"3g",'3g':{any:{services:{create:{name:"simtravel",apn:"send.ee",dial_num:"*99#",username:"3725ХХХХХХХ",password:""}}}}},etk:{deftype:"3g",'3g':{any:{services:{create:{name:"etk",noauth:true,apn:"internet.etk.ru",dial_num:"*99#",username:"",password:""}}}}},bwc:{deftype:"3g",'3g':{any:{services:{create:{name:"bwc",noauth:true,apn:"inet.bwc.ru",dial_num:"*99#",username:"",password:""}}}}},tatincomncc:{deftype:"3g",'3g':{any:{services:{create:{name:"tatincomncc",apn:"internet.tatincom.ru",dial_num:"*99#",username:"tatincom",password:"tatincom"}}}}},novcc:{deftype:"3g",'3g':{any:{services:{create:{name:"novcc",noauth:true,apn:"internet",dial_num:"*99#",username:"",password:""}}}}},tambovgsm:{deftype:"3g",'3g':{any:{services:{create:{name:"tmb",noauth:true,apn:"internet.tmb.ru",dial_num:"*99#",username:"",password:""}}}}},diex:{deftype:"3g",'3g':{any:{services:{create:{name:"diex",apn:"inet.di-ex.com",dial_num:"*99#",username:"inet",password:"inet"}}}}},ulgsm:{deftype:"3g",'3g':{any:{services:{create:{name:"ulgsm",noauth:true,apn:"internet.ulgsm.ru",dial_num:"*99#",username:"",password:""}}}}},motiv:{deftype:"3g",'3g':{any:{services:{create:{name:"motiv",apn:"inet.ycc.ru",dial_num:"*99#",username:"motiv",password:"motiv"}}}}},smarts:{deftype:"3g",'3g':{any:{services:{create:{name:"smarts",noauth:true,apn:"internet.smarts.ru",dial_num:"*99#",username:"",password:""}}}}}},ukraine:{umc:{deftype:"3g",'3g':{any:{services:{create:{name:"umc",noauth:true,apn:"www.umc.ua",dial_num:"*99#",username:"",password:""}}}}},jeans:{deftype:"3g",'3g':{any:{services:{create:{name:"jeans",noauth:true,apn:"www.jeans.ua",dial_num:"*99#",username:"",password:""}}}}},kyivstar:{deftype:"3g",'3g':{any:{services:{create:{name:"kyivstar",apn:"www.kyivstar.net",dial_num:"*99#",username:"igprs",password:"internet"}}}}},abkyivstar:{deftype:"3g",'3g':{any:{services:{create:{name:"abkyivstar",noauth:true,apn:"www.ab.kyivstar.net",dial_num:"*99#",username:"",password:""}}}}},djuice:{deftype:"3g",'3g':{any:{services:{create:{name:"djuice",noauth:true,apn:"www.djuice.com.ua",dial_num:"*99#",username:"",password:""}}}}},life:{deftype:"3g",'3g':{any:{services:{create:{name:"life",noauth:true,apn:"internet",dial_num:"*99#",username:"",password:""}}}}},beeline:{deftype:"3g",'3g':{any:{services:{create:{name:"beeline",noauth:true,apn:"internet.beeline.ua",dial_num:"*99#",username:"",password:""}}}}}},kazakhstan:{kcell:{deftype:"3g",'3g':{any:{services:{create:{name:"kcell",noauth:true,apn:"internet",dial_num:"*99#",username:"",password:""}}}}},neo:{deftype:"3g",'3g':{any:{services:{create:{name:"neo",noauth:true,dial_num:"*99#",apn:"internet",username:"",password:""}}}}},pathword:{deftype:"3g",'3g':{any:{services:{create:{name:"pathword",apn:"AT+CRM=1",dial_num:"*99#",username:"PAThWORD",password:"pathword"}}}}},beeline:{deftype:"3g",'3g':{any:{services:{create:{name:"beeline",apn:"internet.beeline.kz",dial_num:"*99#",username:"@internet.beeline",password:"beeline"}}}}}},azerbaijan:{bakcell:{deftype:"3g",'3g':{any:{services:{create:{name:"bakcell",noauth:true,apn:"gprs",dial_num:"*99#",username:"",password:""}}}}},azercell:{deftype:"3g",'3g':{any:{services:{create:{name:"azercell",apn:"internet",dial_num:"*99#",username:"nar",password:"nar"}}}}},narmobile:{deftype:"3g",'3g':{any:{services:{create:{name:"narmobile",apn:"nar",dial_num:"*99#",username:"nar",password:"nar"}}}}}},latvia:{lmt:{deftype:"3g",'3g':{any:{services:{create:{name:"lmt",noauth:true,apn:"internet.lmt.lv",dial_num:"*99#",username:"",password:""}}}}},tele2:{deftype:"3g",'3g':{any:{services:{create:{name:"tele2",noauth:true,apn:"mobileinternet.tele2.lv",dial_num:"*99#",username:"",password:""}}}}},bite:{deftype:"3g",'3g':{any:{services:{create:{name:"bite",noauth:true,apn:"internet",dial_num:"*99#",username:"",password:""}}}}}},estonia:{emt:{deftype:"3g",'3g':{any:{services:{create:{name:"emt",noauth:true,apn:"internet.emt.ee",dial_num:"*99#",username:"",password:""}}}}},tele2:{deftype:"3g",'3g':{any:{services:{create:{name:"tele2",noauth:true,apn:"internet.tele2.ee",dial_num:"*99#",username:"",password:""}}}}},elisa:{deftype:"3g",'3g':{any:{services:{create:{name:"elisa",noauth:true,apn:"internet",dial_num:"*99#",username:"",password:""}}}}}},lithuania:{omnitel:{deftype:"3g",'3g':{any:{services:{create:{name:"omnitel",noauth:true,apn:"omnitel",dial_num:"*99#",username:"",password:""}}}}},tele2:{deftype:"3g",'3g':{any:{services:{create:{name:"tele2",apn:"mobileinternet.tele2.lt",dial_num:"*99#",username:"wap",password:"wap"}}}}},bite:{deftype:"3g",'3g':{any:{services:{create:{name:"bite",noauth:true,apn:"banga",dial_num:"*99#",username:"",password:""}}}}}}}
window.provs3g.russia.uucn=$.extend(true,{},provs3g.russia.bwc);window.provs3g.russia.uucn['3g'].any.services.create.name="uucn";var client_login=getCookie("client_login");var __rpc_index={};__rpc_index[somovdParams.CONFIG_ID_WIFI]="wifi";__rpc_index[somovdParams.CONFIG_ID_WIFI_WMM]="wifi.wmm";__rpc_index[somovdParams.CONFIG_ID_WIFI_CLI]="wifi.apcli";__rpc_index[somovdParams.CONFIG_ID_WAN_TEMP]="ifaces";__rpc_index[somovdParams.CONFIG_ID_NTP]="ntpclient";__rpc_index[somovdParams.CONFIG_ID_GET_URLF_CONFIG]="urlfilter.settings";__rpc_index[somovdParams.CONFIG_ID_GET_URL_LIST]="urlfilter.url_list";__rpc_index[somovdParams.CONFIG_ID_MAC_FILTER]="macfilter";__rpc_index[somovdParams.CONFIG_ID_DMZ]="dmz";__rpc_index[somovdParams.CONFIG_ID_IPFILTER]="ipfilter";__rpc_index[somovdParams.CONFIG_ID_UPNP]="upnp";__rpc_index[somovdParams.CONFIG_ID_ROUTING]="route";__rpc_index[somovdParams.CONFIG_ID_HTTPACCESS]="httpaccess";__rpc_index[somovdParams.CONFIG_ID_USERS]="users";__rpc_index[somovdParams.CONFIG_ID_PORT_STATUS]="CONFIG_ID_PORT_STATUS";__rpc_index[somovdParams.CONFIG_ID_PING]="CONFIG_ID_PING";__rpc_index[somovdParams.CONFIG_ID_TRACEROUTE]="CONFIG_ID_TRACEROUTE";__rpc_index[somovdParams.CONFIG_ID_SYSLOG_READ]="CONFIG_ID_SYSLOG_READ";__rpc_index[somovdParams.CONFIG_ID_WIFI_SCAN]="CONFIG_ID_WIFI_SCAN";__rpc_index[somovdParams.CMD_RESET_TO_DEFAULT]="CMD_RESET_TO_DEFAULT";__rpc_index[somovdParams.CMD_RESTORE_CONFIG]="CMD_RESTORE_CONFIG";__rpc_index[somovdParams.CMD_BACKUP_CONFIG]="CMD_BACKUP_CONFIG";__rpc_index[somovdParams.CONFIG_ID_SYSLOG_CONF]="syslog";debug('111');debug(window.access_rights);if(window.access_rights){debug('222');var putInto=function(path,data){if(path){var arr=path.split(".");var subObj=obj={};for(var i=0;i<arr.length-1;i++){subObj=subObj[arr[i]]={}}
subObj[arr[arr.length-1]]=data;return obj;}
else{return data;}}
var setObjAttrs=function(data,attrs,baseMode){var value,valueAttrs,mode;function body(key){value=data[key];if(is.unset(value))return;try{valueAttrs=attrs[key];if(is.number(valueAttrs)){mode=valueAttrs;}
else if(is.set(valueAttrs.__mode)){mode=valueAttrs.__mode;}
else{mode=baseMode;}}
catch(e){mode=baseMode;}
if(is.object(value)){setObjAttrs(value,valueAttrs,mode);}
else if(mode!=6){var valueWithAttrs;switch(typeof value){case"number":valueWithAttrs=data[key]=new Number(value);break;case"string":valueWithAttrs=data[key]=new String(value);break;case"boolean":valueWithAttrs=data[key]=new Boolean(value);break;}
valueWithAttrs.__attrs__={mode:mode};}}
if(baseMode==6){if(is.object(attrs)){for(var key in attrs){body(key);}}}
else{if(is.array(data)){for(var i=0;i<data.length;i++){body(i);}}
else{for(var key in data){body(key);}}}}
var setRPCAttrs=function(data,id){var path=access_rights.__rpc_index[id];var baseMode=is.set(access_rights.__mode)?access_rights.__mode:6;setObjAttrs(putInto(path,data),access_rights,baseMode);debug(data);}
var hideFlag=function(rpc){return disableFlag(rpc,0);}
var disableFlag=function(rpc,m){if(is.unset(m))m=4;try{if(is.string(rpc)){var key=rpc;var baseMode=is.set(access_rights.__mode)?access_rights.__mode:6;var data={__all:"__all"};setObjAttrs(putInto(key,data),access_rights,baseMode);var mode=data.__all.__attrs__.mode;return(is.set(mode)&&mode<=m);}
else{var data={__all:"__all"};setRPCAttrs(data,rpc);var mode=data.__all.__attrs__.mode;return(is.set(mode)&&mode<=m);}}
catch(e){return false;}};device.hook(device.signal.PROCESS,function(state,jqXHR){try{if(!state&&jqXHR.answer){var reArr=[];if(jqXHR.answer.resident)reArr=[jqXHR.answer];else if(jqXHR.answer.rq)reArr=jqXHR.answer.rq;var re;for(var i=0;i<reArr.length;i++){if(re=reArr[i])setRPCAttrs(re.resident,re.config_id);}
var mbssidRights=window.access_rights[__rpc_index[somovdParams.CONFIG_ID_WIFI]].mbssid;if(mbssidRights){var re=null;for(var i=0;i<reArr.length;i++){if(reArr[i]&&reArr[i].config_id==somovdParams.CONFIG_ID_WIFI){re=reArr[i];break;}}
if(re){var json=re.resident;var mbssidNum=json.mbssidNum;var mbssidCur=json.mbssidCur;var mbssid=json.mbssid;var mbssidNew=[];var obj,mode;for(var i=0,j=0;i<mbssid.length;i++){obj=mbssidRights[i];if(is.number(obj))mode=obj;else if(is.object(obj)&&is.number(obj.__mode))mode=obj.__mode;else mode=6;if(mode!=0)mbssidNew.push(mbssid[j++]);}
if(mbssid.length>mbssidNew.length){json.mbssidNum=mbssidNew.length;json.mbssidCur=1;json.mbssid=mbssidNew;}}}}}
catch(e){debug(e.message);}});}
else{debug('333');var hideFlag=function(){return false};var disableFlag=function(){return false};}
function pageActiveSessions(){pageActiveSessions.superclass.constructor.call(this);this.refreshTime=10000;this.rqId=-1;this.firstStart=true;this.refreshId=null;this.$grid=null;this.activeSessions=null;this.add(new nodeCaption("routingLabel","routingDescText"))
.add(new node(),"grid");this.updateView=function(phase){pageActiveSessions.superclass.updateView.apply(this,arguments);if(phase=="back"){this.$grid=this.$box.html("\
   <div class='grid'></div>\
    ").find('.grid').lightUIGrid([{index:"protocol",name:"protocol"},{index:"source_ip",name:"activeSessionsSourceIp"},{index:"source_port",name:"activeSessionsSourcePort"},{index:"dest_ip",name:"activeSessionsDestIp"},{index:"dest_port",name:"activeSessionsDestPort"}],0);if(this.activeSessions){var session;for(var i=0;i<this.activeSessions.length;i++){var session=this.activeSessions[i];var tcp=session.protocols.tcp;var udp=session.protocols.udp;if(tcp)for(var j=0;j<tcp.length;j++){var $row=this.$grid.addRow().row("last");$row.col("protocol").html("TCP");$row.col("source_ip").html(session.source_ip);$row.col("source_port").html(tcp[j].source_port);$row.col("dest_ip").html(tcp[j].dest_ip);$row.col("dest_port").html(tcp[j].dest_port);}
if(udp)for(var j=0;j<udp.length;j++){var $row=this.$grid.addRow().row("last");$row.col("protocol").html("UDP");$row.col("source_ip").html(session.source_ip);$row.col("source_port").html(udp[j].source_port);$row.col("dest_ip").html(udp[j].dest_ip);$row.col("dest_port").html(udp[j].dest_port);}}}}}
this.startRefresh=function(period){this.refreshId=setTimeout(callback(this,this.update),period);return this;}
this.update=function(){if(this.firstStart)rootView.showModalOverlay();this.rqId=device.config.read(somovdParams.CONFIG_ID_ACTIVE_SESSION,callback(this,function(data){this.activeSessions=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();this.firstStart=false;this.startRefresh(this.refreshTime);}));this.firstStart=false;}
this.bind("updaterq",function(){this.startRefresh(0);});}
extend(pageActiveSessions,node);function jsSubNetAddrWithLANController(bits,addr,radix,delim,expandZero,omitFullMask){jsSubNetAddrWithLANController.superclass.constructor.call(this,bits,addr,radix,delim,expandZero,omitFullMask);this.getChild("field").ifaceTypes.client={type:jsSubNetAddrWithLANClientView,options:{}};}
extend(jsSubNetAddrWithLANController,jsSubNetAddrController);function jsSubNetAddrWithLANClientView(ctrl,viewInx,options){jsSubNetAddrWithLANClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsSubNetAddrWithLANClientView.prototype.drawView=function(){jsSubNetAddrWithLANClientView.superclass.drawView.call(this);var options=this.options;var lanValset=options.lanValset;var htmlToDraw;if(lanValset){var elemID=this.$input.attr("id");htmlToDraw="<select id='lanCli"+elemID+"' ><option value='0' >&lt;"+lng("statLanClientsSel")+"&gt;</option>";for(var i in lanValset){if((this.ctrl.model.bits==128&&lanValset[i].match(/:/))||(this.ctrl.model.bits==32&&!lanValset[i].match(/:/))){htmlToDraw+="<option value='"+lanValset[i]+"' >"+i+"</option>";}}
htmlToDraw+="</select>";this.$input.after(htmlToDraw);if(options.disabled)
this.disable();var addition="";if(this.ctrl instanceof jsSubNetIPWithLANController&&this.partCount!=8){addition="/32";}
$("#lanCli"+elemID).bind("change",function(){var value=$(this).val();if(value!="0")$("#"+elemID).val(value+addition).trigger('change');});}}
this.disenList=function(){if(this.ctrl.model.bits==128){$(this.options.viewBoxSel+" select").attr("disabled",true);}
else{$(this.options.viewBoxSel+" select").attr("disabled",false);}}}
extend(jsSubNetAddrWithLANClientView,jsSubNetIPClientView);function jsMACWithLANClientView(ctrl,viewInx,options){jsMACWithLANClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsMACWithLANClientView.prototype.drawView=function(){jsMACWithLANClientView.superclass.drawView.call(this);var options=this.options;var lanValset=options.lanValset;var htmlToDraw;if(lanValset){var elemID=this.$input.attr("id");htmlToDraw="<select id='lanCli"+elemID+"' ><option value='0' >&lt;"+lng("statLanClientsSel")+"&gt;</option>";for(var i in lanValset){if((this.partCount==4&&lanValset[i].search(/\./)!=-1)||(this.partCount!=4&&lanValset[i].search(/:/)!=-1)){htmlToDraw+="<option value='"+lanValset[i]+"' >"+i+"</option>";}}
htmlToDraw+="</select>";this.$input.after(htmlToDraw);if(options.disabled)
this.disable();var addition="";if(this.ctrl instanceof jsSubNetIPWithLANController&&this.partCount!=8){addition="/32";}
$("#lanCli"+elemID).bind("change",function(){var value=$(this).val();if(value!="0")$("#"+elemID).val(value+addition).trigger('change');});}}}
extend(jsMACWithLANClientView,jsSubNetAddrClientView);function jsNetAddrWithLANController(bits,addr,radix,delim,expandZero){jsNetAddrWithLANController.superclass.constructor.call(this,bits,addr,radix,delim,expandZero);this.getChild("field").ifaceTypes.client={type:jsSubNetAddrWithLANClientView,options:{}};}
extend(jsNetAddrWithLANController,jsNetAddrController);function jsSubNetIPWithLANController(addr,version,omitFullMask){jsSubNetIPWithLANController.superclass.constructor.call(this,addr,version,omitFullMask);this.getChild("field").ifaceTypes.client={type:jsSubNetIPWithLANClientView,options:{}};}
extend(jsSubNetIPWithLANController,jsSubNetIPController);function jsSubNetIPWithLANClientView(ctrl,viewInx,options){jsSubNetIPWithLANClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsSubNetIPWithLANClientView.prototype.validate=function(){this.statusCode=null;var value=this.$input.attr("value");var arr;if(this.options.ishidden||this.options.disabled)return jsSubNetAddrWithLANClientView.superclass.validate.call(this);if(value.match(/^$/)){this.statusCode="netAddrEmpty";return jsSubNetAddrWithLANClientView.superclass.validate.call(this);}
if(this.ctrl.model.bits==128){this.ctrl.model.partBitCount=16;if(value.match(/::/)){if(!value.match(/^::ffff:[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}/)){if(value.match(/^\s*$/)){this.statusCode="netAddrEmpty";}
if(!value.match(/^::$/)&&!value.match(/^::[0:]*$/)&&!value.match(/^[0:]*::$/)){var parts=this.ctrl.model.parseShortNotation(value);if(no(parts[0])||no(parts[1])||no(parts[2])||no(parts[3])||no(parts[4])||no(parts[5])||no(parts[6])||no(parts[7])){this.statusCode="netAddrInvalid";}
if(!this.statusCode){var arr=value.split("/");if(arr instanceof Array&&arr[1]){this.statusCode=this.ctrl.model.checkPart(arr[1],this.ctrl.model.bits,10);if(this.statusCode){this.statusCode="netAddr"+this.statusCode;}}}}}
return jsSubNetAddrWithLANClientView.superclass.validate.call(this);}
else{arr=value.split(":");if(arr.length==8){return jsSubNetIPWithLANClientView.superclass.validate.call(this);}
else{this.statusCode="netAddrInvalid";return jsSubNetAddrWithLANClientView.superclass.validate.call(this);}}}
else{this.ctrl.model.partBitCount=8;arr=value.split(".");if(arr.length==4){return jsSubNetIPWithLANClientView.superclass.validate.call(this);}
else{this.statusCode="netAddrInvalid";return jsSubNetAddrWithLANClientView.superclass.validate.call(this);}}}}
extend(jsSubNetIPWithLANClientView,jsSubNetAddrWithLANClientView);function jsSubNetIPv4WithLANController(addr){jsSubNetIPv4WithLANController.superclass.constructor.call(this,addr,4);}
extend(jsSubNetIPv4WithLANController,jsSubNetIPWithLANController);function jsSubNetIPv6WithLANController(addr){jsSubNetIPv6WithLANController.superclass.constructor.call(this,addr,6);}
extend(jsSubNetIPv6WithLANController,jsSubNetIPWithLANController);function jsIPWithLANController(addr,version,subIPController){jsIPWithLANController.superclass.constructor.call(this,addr,version,subIPController);this.getChild("field").ifaceTypes.client={type:jsSubNetIPWithLANClientView,options:{}};}
extend(jsIPWithLANController,jsIPController);function jsIPv4WithLANController(addr){jsIPv4WithLANController.superclass.constructor.call(this,addr,4);}
extend(jsIPv4WithLANController,jsIPWithLANController);function jsIPv6WithLANController(addr){jsIPv6WithLANController.superclass.constructor.call(this,addr,6);}
extend(jsIPv6WithLANController,jsIPWithLANController);function jsMACWithLANController(addr){if(!addr)addr=[null,null,null,null,null,null];jsMACWithLANController.superclass.constructor.call(this,48,addr,16,":",true);this.getChild("field").ifaceTypes.client={type:jsMACWithLANClientView,options:{delim:":",radix:16}};}
extend(jsMACWithLANController,jsNetAddrWithLANController);function makeLANClientsValset(lanClients,field,additField){var valset=null;if(lanClients&&lanClients.length){valset={};var additionText="";for(var i in lanClients){additionText="";if(lanClients[i].hostname){additionText=lanClients[i].hostname;}
if(additField){if(additionText!="")
additionText+=", ";additionText+=lanClients[i][additField];}
if(additionText!=""){additionText=" ("+additionText+")";}
valset[lanClients[i][field]+additionText]=lanClients[i][field];}}
return valset;}
function jsComboModel(addr){jsComboModel.superclass.constructor.call(this.addr);this.setParts=function(addr){this.value=addr;}
this.setParts(addr);}
extend(jsComboModel,jsInputModel);function jsMACComboController(addr,LANClients,clone){jsMACComboController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsMACComboView,options:{}};this.LANClients=LANClients;this.clone=clone;this.changeModel(new jsComboModel(addr));}
extend(jsMACComboController,jsController);function jsComboView(ctrl,viewInx,options){jsComboView.superclass.constructor.call(this,ctrl,viewInx,options);this.val=function(value){if(is.set(value)){this.pluginCombo.fieldval(value);}
return this.pluginCombo.fieldval();}
this.disable=function(){this.pluginEdit.disable();}
this.enable=function(){this.pluginEdit.enable();}
this.setError=function(statusCode){this.pluginEdit.setError(statusCode);}
this.cleanError=function(){this.pluginEdit.cleanError();}
this.setMandatory=function(){this.pluginCombo.flags.mandatory=true;}
this.clearMandatory=function(){this.pluginCombo.flags.mandatory=false;}
this.updateModel=function(){this.statusCode=this.pluginCombo.validate();if(is.unset(this.statusCode)){this.ctrl.model.value=this.val();return true;}
else{this.pluginEdit.setError(this.statusCode);}
return false;}
this.updateView=function(){this.val(this.ctrl.model.value);}
this.onfieldchangejq=function(event){this.ctrl.modified=true;this.ctrl.event("fieldchange",{view:this,value:this.val()},true);event.stopPropagation();return true;}
jsComboView.prototype.bindEvents=function(){var options=this.options;this.pluginCombo.bind("unfocus.input enter.input tab.input",context(this).callback(function(event){this.pluginEdit.cleanError();this.ctrl.modified=true;this.ctrl.event("fieldchange",{view:this,value:this.val()},true);event.stopPropagation();return true;}));this.pluginCombo.bind("onfocus.input",context(this).callback(function(event){this.cleanError();}));this.pluginCombo.bind("error.input",context(this).callback(function(event,errorCode){if(this.pluginCombo.is(':hidden')){if(this.getParent()instanceof jsFieldSetClientView){if(this.getParent().options&&this.getParent().options.collapsed){this.getParent().toggleSlider(0);}}}
if(isInputIntoView(this.pluginCombo)){this.pluginCombo.find(".select").css('height',this.pluginCombo.find(".field").parent().height());var $input=this.pluginCombo.find("input");var $arrow=this.pluginCombo.find(".arrow");var $icon=this.pluginCombo.find(".icon");var arrowLeft=$arrow.css('left');var iconLeft=$icon.css('left');$arrow.css({'left':$input.width()+4,'position':'absolute'});$icon.css({'left':$input.width()+30,'position':'absolute'});$input.css({'left':$input.position().left,'top':$input.position().top,'position':'absolute'}).effect("bounce",{times:3,direction:'left',distance:8},300,context(this).callback(function(){$arrow.css({'left':arrowLeft,'position':'relative'});$icon.css({'left':iconLeft,'position':'relative'});$input.css({'left':'','top':'','position':'static'});this.pluginEdit.setError(errorCode);}));}
else{scrollToVisible(this.pluginCombo);this.pluginEdit.setError(errorCode);}}));}}
extend(jsComboView,jsCSideView);function jsMACComboView(ctrl,viewInx,options){jsMACComboView.superclass.constructor.call(this,ctrl,viewInx,options);this.disable=function(){this.pluginEdit.disable();if(this.ctrl.clone){this.pluginEdit.find(".icon").hide();}}
this.enable=function(){this.pluginEdit.enable();if(this.ctrl.clone){this.pluginEdit.find(".icon").show();}}
this.drawView=function(){jsMACComboView.superclass.drawView.call(this);var options=this.options;this.pluginEdit=$(options.viewBoxSel).lightUIEdit(options.humanName,null,{inputPadding:options.inputPadding,mandatory:options.mandatory});if(options.summary){this.pluginCombo=this.pluginEdit.find(".input").lightUIStatic();}
else{var header=[{index:"mac",name:"MAC"},{index:"ip",name:"IP"},{index:"host",name:"Host"}];this.pluginCombo=this.pluginEdit.find(".input").lightUIGrid(header,0,{combobox:{type:"mac",index:"mac",flags:{mandatory:options.mandatory}}});this.pluginCombo.fieldval(this.ctrl.model.value);var LANClients=this.ctrl.LANClients;var $row;var obj;for(var i in LANClients){obj=LANClients[i];$row=this.pluginCombo.addRow().row("last");$row.col("mac").html(obj.mac);$row.col("ip").html(obj.ip);$row.col("host").html(obj.hostname);}
this.bindEvents();if(this.ctrl.clone){var LANClients=this.ctrl.LANClients;var userIP=getCookie("user_ip");if(is.string(userIP)){for(var i in LANClients){var isCorrectIp=false;var pos_of_slash=-1;pos_of_slash=LANClients[i].ip.indexOf("/");if(pos_of_slash>-1){isCorrectIp=(LANClients[i].ip.indexOf(userIP)>-1);}
else{userIP=userIP.replace(/\[::ffff:/,'');userIP=userIP.replace(/\]/,'');isCorrectIp=(LANClients[i].ip==userIP);}
if(isCorrectIp){this.ctrl.userMAC=LANClients[i].mac;break;}}}
this.pluginCombo.bind("iconclick.grid",context(this).callback(function(){var userMAC=this.ctrl.userMAC;if(is.string(userMAC)){window.hasChanges=true;this.pluginCombo.fieldval(userMAC).find("input").blur();}})).attr("title",lng("cloneMACTip"));}
else{this.pluginCombo.find(".icon").css("display","none");}}}}
extend(jsMACComboView,jsComboView);function jsIPComboController(addr,LANClients,version){jsIPComboController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsIPComboView,options:{}};this.changeModel(new jsComboModel(addr));this.version=version;this.LANClients=LANClients;this.setVersion=function(version){this.version=version;}}
extend(jsIPComboController,jsController);function jsIPComboView(ctrl,viewInx,options){jsIPComboView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsIPComboView.superclass.drawView.call(this);var options=this.options;var version=this.ctrl.version;this.pluginEdit=$(options.viewBoxSel).lightUIEdit(options.humanName,null,{inputPadding:options.inputPadding,mandatory:options.mandatory});if(options.summary){this.pluginCombo=this.pluginEdit.find(".input").lightUIStatic();}
else{var header=[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}];if(version&&version==6){this.pluginCombo=this.pluginEdit.find(".input").lightUIGrid(header,0,{combobox:{type:"ipv6",index:"ip",flags:{mandatory:options.mandatory}}});}
else{this.pluginCombo=this.pluginEdit.find(".input").lightUIGrid(header,0,{combobox:{type:"ipv4",index:"ip",flags:{mandatory:options.mandatory}}});}
this.pluginCombo.fieldval(this.ctrl.model.value);var LANClients=this.ctrl.LANClients;var $row;var obj;for(var i in LANClients){obj=LANClients[i];$row=this.pluginCombo.addRow().row("last");$row.col("mac").html(obj.mac);$row.col("ip").html(obj.ip);$row.col("host").html(obj.hostname);}
this.pluginCombo.find(".icon").css("display","none");this.bindEvents();}}}
extend(jsIPComboView,jsComboView);function jsMACRuleController(LANClients){jsMACRuleController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsMACRuleView,options:{}};this.LANClients=LANClients;}
extend(jsMACRuleController,jsController);function jsMACRuleView(ctrl,viewInx,options){jsMACRuleView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsMACRuleView.superclass.drawView.call(this);var options=this.options;this.pluginEdit=$(options.viewBoxSel).lightUIEdit(options.humanName,null,{inputPadding:options.inputPadding});var header=[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}];this.pluginCombo=this.pluginEdit.find(".input").lightUIGrid(header,0,{combobox:{type:"text",blank:"dhcpMacClientsSel2",flags:{size:lng("dhcpMacClientsSel2").length+4}}});this.pluginCombo.find(".icon").css("display","none");this.pluginCombo.find("input").css({"width":"auto","text-align":"left"});var LANClients=this.ctrl.LANClients;var $row;var obj;for(var i in LANClients){obj=LANClients[i];$row=this.pluginCombo.addRow().row("last");$row.col("mac").html(obj.MACAddress);$row.col("ip").html(obj.ip);$row.col("host").html((obj.hostname!='*')?obj.hostname:'');}
this.pluginCombo.bind("rowclick.grid",context(this).callback(function(event,$row){this.ctrl.event("ruleselect",$row,true);}));}}
extend(jsMACRuleView,jsCSideView);function jsInputExModel(value){jsInputExModel.superclass.constructor.call(this);this.value=value;jsInputExModel.prototype.toString=function(){if(no(this.value)){return'';}else{return this.value;}}}
extend(jsInputExModel,jsModel);function jsInputExController(value){jsInputExController.superclass.constructor.call(this);this.ifaceTypes.switcher={type:jsSwitcherClientView};this.ifaceTypes.progresser={type:jsProgresserClientView};this.ifaceTypes.lister={type:jsListerClientView};this.ifaceTypes.buttoner={type:jsButtonerClientView};this.ifaceTypes.inputer={type:jsInputerClientView};this.ifaceTypes.texter={type:jsTexterClientView,def:true};this.ifaceTypes.textboxer={type:jsTextboxerClientView};this.changeModel(new jsInputExModel(value));}
extend(jsInputExController,jsController);function jsSwitcherClientView(ctrl,viewInx,options){jsSwitcherClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsSwitcherClientView.prototype.drawView=function(){jsSwitcherClientView.superclass.drawView.call(this);var htmlToDraw;var value=this.ctrl.model.value;var options=this.options;var uid=getUID();this.myBoxSel='#switcher'+uid;this.viewBoxSel=options.viewBoxSel;htmlToDraw="<div class='switcher normal unselectable' id='switcher"+uid+"'>";htmlToDraw+="<div class='slider'></div>";htmlToDraw+="<div class='text' unselectable='on'></div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);if(!no(options.widgetStyle)){$(this.myBoxSel).addClass('widgetStyle');}
if(!no(options.title)){$(this.myBoxSel).attr('title',lng(options.title));}
this.updateView();$(this.myBoxSel).bind("click",context(this).callback(this.onslide));if(options.disabled)this.disable();}
this.onslide=function(){if($(this.myBoxSel).is('.disable'))return;var slider=$(this.myBoxSel+'>.slider');var text=$(this.myBoxSel+'>.text');var on;var off;if($(slider).is('.on')){off=$(text).html();on=$(slider).html();$(slider).removeClass('on');$(slider).addClass('off');$(slider).html(off);$(text).html(on);}else{on=$(text).html();off=$(slider).html();$(slider).removeClass('off');$(slider).addClass('on');$(slider).html(on);$(text).html(off);}
this.ctrl.event("fieldchange",{view:this,value:this.getValue()},true);return false;}
this.disable=function(){this.options.disabled=true;$(this.myBoxSel).removeClass('normal').addClass('disable');}
this.enable=function(){this.options.disabled=false;$(this.myBoxSel).removeClass('disable').addClass('normal');}
this.getValue=function(){if($(this.myBoxSel+'>.slider').is('.on')){return options.valset.on;}else{return options.valset.off;}}
this.updateModel=function(){this.ctrl.model.value=this.getValue();return jsSwitcherClientView.superclass.updateModel.call(this);}
this.updateView=function(){var value=this.ctrl.model.value;var options=this.options;var on;var off;var align;var n;var slider=$(this.myBoxSel+'>.slider');var text=$(this.myBoxSel+'>.text');off=options.short_off?lng(options.short_off):lng('short_off');on=options.short_on?lng(options.short_on):lng('short_on');n=Math.abs(((on.length-off.length)/2).toFixed());align="";for(var i=0;i<n;i++)align+="&nbsp;";if(on.length>off.length){if(n*2+off.length>on.length)on="&nbsp;"+on;off=align+off+align;}
else{if(n*2+on.length>off.length)off="&nbsp;"+off;on=align+on+align;}
off="<tt>"+off+"</tt>";on="<tt>"+on+"</tt>";if(value==options.valset.on){$(slider).removeClass('off');$(slider).addClass('on');$(slider).html(off);$(text).html(on);}else{$(slider).removeClass('on');$(slider).addClass('off');$(slider).html(on);$(text).html(off);}
jsSwitcherClientView.superclass.updateView.call(this);}}
extend(jsSwitcherClientView,jsCSideView);function jsProgresserClientView(ctrl,viewInx,options){jsProgresserClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsProgresserClientView.prototype.drawView=function(){this.stopWait();jsProgresserClientView.superclass.drawView.call(this);var htmlToDraw;var value=(this.ctrl.model.value=='')?'0':this.ctrl.model.value;var options=this.options;var uid=getUID();this.isWaitStyle=!no(options.waitStyle);this.myBoxSel='#progresser'+uid;this.viewBoxSel=options.viewBoxSel;htmlToDraw="<div class='progresser unselectable' id='progresser"+uid+"'>";htmlToDraw+="<div class='underHeadway'></div>";htmlToDraw+="<div class='headway'></div>";htmlToDraw+="<div class='percent'></div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);$(this.myBoxSel+'>.underHeadway').css('opacity','0.2');if(this.isWaitStyle){$(this.myBoxSel).addClass('waitStyle');$(this.myBoxSel+'>.percent').text(lng(options.waitTitle));}else{this.setProgress(value);}}
this.updateModel=function(){return false;}
this.updateView=function(){return false;}
this.headwayBounce=function(){if(this.isWaiting){var pos=0;var progresser=$(this.myBoxSel);var headway=$(this.myBoxSel+'>.headway');var headwayBounce=context(this).callback(this.headwayBounce);if($(headway).position().left==0){pos=$(progresser).width()-$(headway).width();}
pos+="px";$(headway).animate({'left':pos},500,function(){headwayBounce();});}}
this.startWait=function(waitTitle){if(!no(waitTitle)){$(this.myBoxSel+'>.percent').text(waitTitle);}
if(this.isWaitStyle){this.isWaiting=true;$(this.myBoxSel+'>.headway').css({'width':(0.3*$(this.myBoxSel).width())+'px','left':'0px'});this.headwayBounce();}
$(this.myBoxSel+'>.underHeadway').css({'width':'0%'});}
this.stopWait=function(){this.isWaiting=false;}
this.getProgress=function(){if(!this.isWaitStyle){return this.ctrl.model.value;}}
this.setProgress=function(value){if(!this.isWaitStyle){this.ctrl.model.value=value;$(this.myBoxSel+'>.headway').css('width',value+'%');$(this.myBoxSel+'>.percent').text(value+'%');}}
this.isWaiting=false;}
extend(jsProgresserClientView,jsCSideView);function jsListerClientView(ctrl,viewInx,options){jsListerClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.selectItem=function(elem){$(this.childBoxSel+'>div.item:eq('+this.currentIndex+')').removeClass('selected');$(elem.currentTarget).addClass('selected');this.currentIndex=$(elem.currentTarget).index();}
this.fastSelectItem=function(elem){this.selectItem(elem);this.getParent().ctrl.event('doubleclick',this.getChild(this.currentIndex));}
jsListerClientView.prototype.drawView=function(){var htmlToDraw;var value=this.ctrl.model.value;var options=this.options;var uid=getUID();var children=this.ctrl.children;var child;this.myBoxSel='#lister'+uid;this.viewBoxSel=options.viewBoxSel;this.childBoxSel=this.myBoxSel+'>.list';htmlToDraw="<div class='lister' id='lister"+uid+"'>";htmlToDraw+="<div class='caption unselectable'>";htmlToDraw+="<div class='title'>"+lng(options.humanName)+"</div>";htmlToDraw+="<div class='tip'></div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="<div class='list'>";for(var i=0;i<children.length;i++){htmlToDraw+="<div class='item'></div>";child=this.getChild(i);child.options.viewBoxSel=this.childBoxSel+">div.item:eq("+i+")";child.viewBoxSel=child.options.viewBoxSel;if(child.ctrl.model.value==value){this.currentIndex=i;}}
htmlToDraw+="</div>";htmlToDraw+="<div class='info unselectable'>.: "+children.length+" :.</div>";htmlToDraw+="<div class='overlay'></div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);if(options.disabled)this.disable();if(!no(options.height)){$(this.myBoxSel+'>.list').css('height',options.height);}
if(!no(options.width)){$(this.myBoxSel+'>.list').css('width',options.width);}
jsListerClientView.superclass.drawView.call(this);$(this.childBoxSel+'>div.item').click(context(this).callback(this.selectItem));$(this.childBoxSel+'>div.item').dblclick(context(this).callback(this.fastSelectItem));$(this.childBoxSel+'>div.item:eq('+this.currentIndex+')').click();}
this.disable=function(){$(this.myBoxSel+'>.overlay').fadeTo(200,0.2)}
this.enable=function(){$(this.myBoxSel+'>.overlay').fadeTo(600,0,function(){$(this).hide();});}
this.updateModel=function(){var child=this.getChild(this.currentIndex);this.ctrl.model.value=child.ctrl.model.value;return jsListerClientView.superclass.updateModel.call(this);}
this.updateView=function(){var value=this.ctrl.model.value;var children=this.ctrl.children;var child;this.currentIndex=0;for(var i=0;i<children.length;i++){child=this.getChild(i);if(child.ctrl.model.value==value){this.currentIndex=i;}}
$(this.childBoxSel+'>div.item:eq('+this.currentIndex+')').click();jsListerClientView.superclass.updateView.call(this);}
this.currentIndex=0;}
extend(jsListerClientView,jsCSideView);function jsButtonerClientView(ctrl,viewInx,options){jsButtonerClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.click=function(){if(!$(this.myBoxSel).is('.disable')){this.getParent().ctrl.event('click',this);}}
jsButtonerClientView.prototype.drawView=function(){var htmlToDraw;var options=this.options;var uid=getUID();this.myBoxSel='#buttoner'+uid;this.viewBoxSel=options.viewBoxSel;htmlToDraw="<div class='buttoner normal unselectable' id='buttoner"+uid+"'>";if(!no(options.icon)){htmlToDraw+="<div class='icon'>";htmlToDraw+="<img src='"+options.icon+"' />";htmlToDraw+="</div>";}
htmlToDraw+="<div class='title' unselectable='on'>"+lng(options.humanName)+"</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);if(options.disabled)this.disable();if(!no(options.iconRightSide)){$(this.myBoxSel+'>.icon').css('float','right');}
$(this.myBoxSel).mouseenter(function(){$(this).not('.disable').addClass('hover');}).mouseleave(function(){$(this).not('.disable').removeClass('hover');}).mousedown(function(){$(this).not('.disable').addClass('push');}).mouseup(function(){$(this).not('.disable').removeClass('push');}).click(context(this).callback(this.click));jsButtonerClientView.superclass.drawView.call(this);}
jsButtonerClientView.prototype.disable=function(){$(this.myBoxSel).removeClass('normal push').addClass('disable');}
jsButtonerClientView.prototype.enable=function(){$(this.myBoxSel).removeClass('disable').addClass('normal');}
this.changeTitle=function(humanName){$(this.myBoxSel+'>.title').text(lng(humanName));}
this.updateModel=function(){return false;}
this.updateView=function(){return false;}}
extend(jsButtonerClientView,jsCSideView);function jsInputerClientView(ctrl,viewInx,options){jsInputerClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsInputerClientView.prototype.drawView=function(){jsInputerClientView.superclass.drawView.call(this);var htmlToDraw;var value=no(this.ctrl.model.value)?'':this.ctrl.model.value;var options=this.options;var uid=getUID();var type=(no(options.passwd))?'text':'password';var maxLength=(no(options.maxLength))?'':' maxlength="'+options.maxLength+'" ';this.myBoxSel='#inputer'+uid;this.viewBoxSel=options.viewBoxSel;htmlToDraw="<div class='inputer normal' id='inputer"+uid+"'>";htmlToDraw+="<div class='top unselectable'>";htmlToDraw+="<div class='title' unselectable='on'>"+lng(options.humanName)+"</div>";htmlToDraw+="<div class='caps' unselectable='on'>[Caps Lock]</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="<div class='bottom'>";htmlToDraw+="<div class='data'>";htmlToDraw+="<input type='"+type+"' value='"+value+"'"+maxLength+"/>";htmlToDraw+="</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);this.$controlSel=$(this.myBoxSel+' input');if(options.disabled)this.disable();$(this.$controlSel).bind('keypress',context(this).callback(this.checkCapsLock));$(this.myBoxSel+' .caps').bind('click',context(this).callback(this.switchCase));}
this.checkCapsLock=function(e){var c=String.fromCharCode(e.which);var isShiftKey=e.shiftKey;var isCapsLock=false;if(c.toLowerCase()!=c.toUpperCase()){if((c.toUpperCase()==c&&!isShiftKey)||(c.toLowerCase()==c&&isShiftKey)){isCapsLock=true;}
var caps=$(this.myBoxSel+' .caps');if(isCapsLock){$(caps).fadeIn('fast');}else{$(caps).fadeOut('fast');}}
return true;}
this.switchCase=function(e){var text=$(this.$controlSel).val();var newText='';for(var i=0;i<text.length;i++){if(text[i].toLowerCase()==text[i]){newText+=text[i].toUpperCase();}else{newText+=text[i].toLowerCase();}}
$(this.$controlSel).val(newText);}
this.disable=function(){$(this.$controlSel).attr('disabled','disabled');}
this.enable=function(){$(this.$controlSel).attr('disabled',null);}
this.updateModel=function(){this.ctrl.model.value=this.$controlSel.val();return jsInputerClientView.superclass.updateModel.call(this);}
this.updateView=function(){if(this.$controlSel){var value=this.ctrl.model.value;this.$controlSel.val(no(value)?'':value);}
jsInputerClientView.superclass.updateView.call(this);}}
extend(jsInputerClientView,jsCSideView);function jsTexterClientView(ctrl,viewInx,options){jsTexterClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsTexterClientView.prototype.drawView=function(){jsTexterClientView.superclass.drawView.call(this);var htmlToDraw;var value=no(this.ctrl.model.value)?'':this.ctrl.model.value;var options=this.options;var uid=getUID();this.myBoxSel='#texter'+uid;this.viewBoxSel=options.viewBoxSel;htmlToDraw="<div class='texter unselectable' id='texter"+uid+"'>";htmlToDraw+="<span>"+lng(options.humanName)+"</span>";htmlToDraw+="<span class='somethingValue'>"+lng(value)+"</span>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);this.$controlSel=$(this.myBoxSel+'>span.somethingValue');if(value==''){$(this.$controlSel).hide();}}
this.updateModel=function(){}
this.updateView=function(){if(this.$controlSel){var value=this.ctrl.model.value;this.$controlSel.html(no(value)?'':value);if(value==''){$(this.$controlSel).hide();}else{$(this.$controlSel).show();}}
jsTexterClientView.superclass.updateView.call(this);}}
extend(jsTexterClientView,jsCSideView);function jsTextboxerClientView(ctrl,viewInx,options){jsTextboxerClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsTextboxerClientView.prototype.drawView=function(){jsTextboxerClientView.superclass.drawView.call(this);var htmlToDraw;var value=no(this.ctrl.model.value)?'':this.ctrl.model.value;var options=this.options;var uid=getUID();this.myBoxSel='#textboxer'+uid;this.viewBoxSel=options.viewBoxSel;htmlToDraw="<div class='textboxer normal' id='textboxer"+uid+"'>";htmlToDraw+="<div class='top unselected'>";htmlToDraw+="<div class='title' unselectable='on'>"+lng(options.humanName)+"</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="<div class='bottom'>";htmlToDraw+="<div class='data'>";htmlToDraw+="<textarea rows='3'>"+value+"</textarea>";htmlToDraw+="</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);this.$controlSel=$(this.myBoxSel+' textarea');if(options.disabled)this.disable();}
this.disable=function(){$(this.$controlSel).attr('disabled','disabled');}
this.enable=function(){$(this.$controlSel).attr('disabled',null);}
this.updateModel=function(){this.ctrl.model.value=this.$controlSel.val();return jsTextboxerClientView.superclass.updateModel.call(this);}
this.updateView=function(){if(this.$controlSel){var value=this.ctrl.model.value;this.$controlSel.val(no(value)?'':value);}
jsTextboxerClientView.superclass.updateView.call(this);}}
extend(jsTextboxerClientView,jsCSideView);function jsATMSettingsModel(ifnode){jsATMSettingsModel.superclass.constructor.call(this);this.ifnode=ifnode;this.iftree=null;}
extend(jsATMSettingsModel,jsModel);function jsATMSettingsController(ifnode,isadding){jsATMSettingsController.superclass.constructor.call(this);this.changeModel(new jsATMSettingsModel(ifnode));this.ifaceTypes.client={type:jsATMSettingsClientView,def:true};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsATMSettingsSummaryView};this.ifaceTypes.summary.options={};this.addChild(new jsDecorController(),"desc");this.addChild(new jsInputController(ifnode.pvc_settings?ifnode.pvc_settings.vpi:0),"vpi");this.addChild(new jsInputController(ifnode.pvc_settings?ifnode.pvc_settings.vci:0),"vci");var advanced=this.addChild(new jsFieldSetController(),"advanced");advanced.addChild(new jsInputController(ifnode.pvc_settings?ifnode.pvc_settings.encap:0),"encap");advanced.addChild(new jsInputController(ifnode.pvc_settings?ifnode.pvc_settings.qos:0),"qos");var qos=advanced.addChild(new jsFieldSetController(),"divQos");qos.addChild(new jsInputController(ifnode.pvc_settings?ifnode.pvc_settings.pcr:0),"pcr");qos.addChild(new jsInputController(ifnode.pvc_settings?ifnode.pvc_settings.scr:0),"scr");qos.addChild(new jsInputController(ifnode.pvc_settings?ifnode.pvc_settings.mbs:0),"mbs");this.isadding=isadding;}
extend(jsATMSettingsController,jsController);function jsATMSettingsClientView(ctrl,viewInx,options){this.updateModel=function(){var vpi=this.getChild("vpi");var vci=this.getChild("vci");vpi.statusCode=null;vci.statusCode=null;var res=jsATMSettingsClientView.superclass.updateModel.call(this);if(res){var ifnode=this.ctrl.model.ifnode;var advanced=this.getChild("advanced");var pvcSettings;ifnode.pvc_settings.vpi=vpi.ctrl.model.value;ifnode.pvc_settings.vci=vci.ctrl.model.value;ifnode.pvc_settings.encap=advanced.getChild("encap").ctrl.model.value;ifnode.pvc_settings.qos=advanced.getChild("qos").ctrl.model.value;var divQos=advanced.getChild("divQos");var pcr=divQos.getChild("pcr").ctrl.model.value;var scr=divQos.getChild("scr").ctrl.model.value;var mbs=divQos.getChild("mbs").ctrl.model.value;switch(ifnode.pvc_settings.qos){case"ubr_pcr":case"cbr":ifnode.pvc_settings.pcr=pcr;break;case"nrtvbr":case"rtvbr":ifnode.pvc_settings.pcr=pcr;ifnode.pvc_settings.scr=scr;ifnode.pvc_settings.mbs=mbs;break;}
if(this.ctrl.isadding&&ifnode.ifname=="create"){var iftree=this.ctrl.model.iftree;for(var i in iftree){if(iftree[i].type=="atm"){pvcSettings=iftree[i].pvc_settings;if(pvcSettings.vpi==vpi.ctrl.model.value&&pvcSettings.vci==vci.ctrl.model.value){vpi.statusCode="wanPvcBusy";vci.statusCode="wanPvcBusy";res=false;break;}}}}}
vpi.setError();vci.setError();return res;}
this.onportchange=function(value){if(value=="create"){this.getChild("vpi").enable();this.getChild("vci").enable();}
else{this.getChild("vpi").disable();this.getChild("vci").disable();}
return false;}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;switch(alias){case"qos":var divQos=this.getChild("advanced","divQos");switch(obj.value){case"ubr":divQos.getChild("pcr").hide();divQos.getChild("scr").hide();divQos.getChild("mbs").hide();break;case"ubr_pcr":divQos.getChild("pcr").show();divQos.getChild("scr").hide();divQos.getChild("mbs").hide();break;case"cbr":divQos.getChild("pcr").show();divQos.getChild("scr").hide();divQos.getChild("mbs").hide();break;case"nrtvbr":divQos.getChild("pcr").show();divQos.getChild("scr").show();divQos.getChild("mbs").show();break;case"rtvbr":divQos.getChild("pcr").show();divQos.getChild("scr").show();divQos.getChild("mbs").show();break;}
break;case"vpi":case"vci":var vpi=this.getChild("vpi");var vci=this.getChild("vci");vpi.updateModel()
vci.updateModel()
var pvcSettings=this.ctrl.model.ifnode.pvc_settings;pvcSettings.vpi=vpi.ctrl.model.value;pvcSettings.vci=vci.ctrl.model.value;break;}
return true;}
this.onmodeswitch=function(value){if(this.options.brief){this.getChild("advanced").hide();this.getChild("desc").hide();}
else{this.getChild("advanced").show();this.getChild("desc").show();}
return false;}
this.drawView=function(){jsATMSettingsClientView.superclass.drawView.call(this);this.onmodeswitch();}
var obj;var opt;var ifnode=ctrl.model.ifnode;options.disabled=!ctrl.isadding;obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"ATM"};obj.ifaceTypes.separator.options.hide=ifnode.blocks;obj=ctrl.getChild("vpi");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanVpi",minval:0,maxval:255};opt=obj.ifaceTypes.number.options;opt.disabled=!ctrl.isadding||ifnode.ifname!="create";opt.hide=(ifnode.blocks&&!webadminParams.BLOCK_WAN_ATM_VPI)
obj=ctrl.getChild("vci");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanVci",minval:0,maxval:65535};opt=obj.ifaceTypes.number.options;opt.disabled=!ctrl.isadding||ifnode.ifname!="create";opt.hide=(ifnode.blocks&&!webadminParams.BLOCK_WAN_ATM_VCI)
var advanced=ctrl.getChild("advanced");advanced.nextIface="client";obj=advanced.getChild("encap");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"wanEncap",valset:{LLC:"llc",VC:"vcmux"}};obj.ifaceTypes.select.options.hide=(ifnode.blocks&&!webadminParams.BLOCK_WAN_ATM_ENCAP)
obj=advanced.getChild("qos");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"wanQos",valset:{UBR:"ubr","UBR with PCR":"ubr_pcr","CBR":"cbr","Non Realtime VBR":"nrtvbr","Realtime VBR":"rtvbr"}};var qos=obj.model.value;obj.ifaceTypes.select.options.hide=(ifnode.blocks&&!webadminParams.BLOCK_WAN_ATM_QOS)
var divQos=advanced.getChild("divQos");divQos.nextIface="client";divQos.ifaceTypes.client.options={nothing:true,slider:false};obj=divQos.getChild("pcr");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanPcr",minval:1,maxval:255000};obj.ifaceTypes.number.options.hide=(qos=="ubr");obj=divQos.getChild("scr");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanScr",minval:1,maxval:255000};obj.ifaceTypes.number.options.hide=(qos=="ubr"||qos=="ubr_pcr"||qos=="cbr");obj=divQos.getChild("mbs");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanMbs",minval:1,maxval:1000000};obj.ifaceTypes.number.options.hide=(qos=="ubr"||qos=="ubr_pcr"||qos=="cbr");this.brief=ifnode.wizard;jsATMSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("fieldchange",this.onfieldchange);this.bind("portchange",this.onportchange);this.bind("modeswitch",this.onmodeswitch);}
extend(jsATMSettingsClientView,jsFieldSetClientView);function jsATMSettingsSummaryView(ctrl,viewInx,options){jsATMSettingsSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){this.getChild("advanced","encap").options.hide=true;this.getChild("advanced").options.slider=false;jsATMSettingsSummaryView.superclass.drawView.call(this);}
this.bind("modeswitch",function(){return false;});}
extend(jsATMSettingsSummaryView,jsATMSettingsClientView);
var is_not_avail_hooking=false;
function device_not_avail(avail){

}
$(window).bind({'beforeunload':function(){device.unhook(device.signal.AVAILABLE,device_not_avail);is_not_avail_hooking=false;}});device.hook(device.signal.PROCESS,function(status){if(status&&!is_not_avail_hooking){is_not_avail_hooking=true;device.hook(device.signal.AVAILABLE,device_not_avail);}});var rebootCmdList=[somovdParams.CMD_REBOOT,somovdParams.CMD_SAVE_AND_REBOOT,somovdParams.CMD_RESET_TO_DEFAULT,somovdParams.CMD_RESET_AND_REBOOT,somovdParams.CMD_RESTORE_CONFIG];function checkInRebootCmdList(id){for(var i=0;i<rebootCmdList.length;i++){if(id==rebootCmdList[i])return true;}
return false;}
var rebootConfigList=[]
rebootConfigList.push(somovdParams.CONFIG_ID_AUTOUPDATE);function checkInRebootConfigList(id){for(var i=0;i<rebootConfigList.length;i++){if(id==rebootConfigList[i])return true;}
return false;}
$.ajaxPrefilter(function(options){var data=options.data;if(is.string(data)){var arr=data.match(/res_cmd\d*=\d+/g);if(is.array(arr)){for(var i=0;i<arr.length;i++){arr[i]=arr[i].replace(/res_cmd\d*=/,"");if(checkInRebootCmdList(arr[i])){device.unhook(device.signal.AVAILABLE,device_not_avail);return;}}}
var arr=data.match(/res_config_id\d*=\d+/g);if(is.array(arr)){for(var i=0;i<arr.length;i++){arr[i]=arr[i].replace(/res_config_id\d*=/,"");if(checkInRebootConfigList(arr[i])){device.unhook(device.signal.AVAILABLE,device_not_avail);return;}}}}});function jsBCMVlanSettingsModel(service){jsBCMVlanSettingsModel.superclass.constructor.call(this);this.service=service;}
extend(jsBCMVlanSettingsModel,jsModel);function jsBCMVlanSettingsController(service,isadding){jsBCMVlanSettingsController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsBCMVlanSettingsClientView};this.ifaceTypes.client.options={};this.changeModel(new jsBCMVlanSettingsModel(service));this.addChild(new jsDecorController(),"desc");this.addChild(new jsInputController(service.vlan.usempvc),"usempvc");this.addChild(new jsInputController(service.vlan.usevlan),"usevlan");this.addChild(new jsInputController(service.vlan.vlanid),"vlanid");this.addChild(new jsInputController(service.vlan.vlanpr),"vlanpr");this.isadding=isadding;}
extend(jsBCMVlanSettingsController,jsFieldSetController);function jsBCMVlanSettingsClientView(ctrl,viewInx,options){var obj;var service=ctrl.model.service;var opt;if(!service.vlan)service.vlan={};obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"VLAN"};obj.ifaceTypes.separator.options.hide=service.blocks;obj=ctrl.getChild("usempvc");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanUseMultiPVC",valset:{on:true,off:false}};opt=obj.ifaceTypes.checkbox.options;opt.disabled=!ctrl.isadding||service.vlan.usempvcro;opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_BCM_VLAN_USE_MPVC);obj=ctrl.getChild("usevlan");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanUseVlan",valset:{on:true,off:false}};var usevlan=obj.model.value;opt=obj.ifaceTypes.checkbox.options;opt.disabled=!ctrl.isadding||service.vlan.usevlanro;opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_BCM_VLAN_USE_VLAN);obj=ctrl.getChild("vlanpr");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanVlanPr",minval:-1,maxval:7};opt=obj.ifaceTypes.number.options;opt.optional=true;opt.hide=!usevlan||(service.blocks&&!webadminParams.BLOCK_WAN_BCM_VLAN_PR);obj=ctrl.getChild("vlanid");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanVlanId",minval:-1,maxval:4095};opt=obj.ifaceTypes.number.options;opt.optional=true;opt.hide=!usevlan||(service.blocks&&!webadminParams.BLOCK_WAN_BCM_VLAN_ID);this.updateModel=function(){var res=jsBCMVlanSettingsClientView.superclass.updateModel.call(this);if(res){var service=this.ctrl.model.service;if(service.vlan)delete service.vlan;if(this.getChild("usempvc").ctrl.model.value){service.vlan={};if(this.getChild("usevlan").ctrl.model.value){service.vlan.vlanid=this.getChild("vlanid").ctrl.model.value;service.vlan.vlanpr=this.getChild("vlanpr").ctrl.model.value;}}}
return res;}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;switch(alias){case"usevlan":var usempvc=this.getChild("usempvc");usempvc.ctrl.model.value=true;usempvc.updateView();if(obj.value){usempvc.disable();this.getChild("vlanid").show();this.getChild("vlanpr").show();}
else{if(!this.ctrl.model.service.vlan.usempvcro){usempvc.enable();}
this.getChild("vlanid").hide();this.getChild("vlanpr").hide();}
break;}
return false;}
this.onmodeswitch=function(value){if(this.options.brief){this.hide();}
else{this.show();}
return false;}
this.drawView=function(){jsBCMVlanSettingsClientView.superclass.drawView.call(this);this.onmodeswitch();}
this.brief=service.wizard;jsBCMVlanSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("fieldchange",this.onfieldchange);this.bind("modeswitch",this.onmodeswitch);}
extend(jsBCMVlanSettingsClientView,jsFieldSetClientView);function jsBubblerController(){jsBubblerController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsBubblerClientView,def:true};}
extend(jsBubblerController,jsController);function jsBubblerClientView(ctrl,viewInx,options){jsBubblerClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsBubblerClientView.prototype.drawView=function(){var htmlToDraw='';var options=this.options;var uid=getUID();var bubblerHtml='';this.myBoxSel='#bubbler'+uid;this.viewBoxSel=options.viewBoxSel;if(!no(options.content)){bubblerHtml=options.content;}
if(!no(options.flow)){if(options.flow instanceof jsCSideView){this.flowBoxSel=options.flow.viewBoxSel;}else{this.flowBoxSel=options.flow;}}
if(!no(options.delay)){this.timerDelay=options.delay;}
if(!no(options.direction)){this.direction=options.direction;}
htmlToDraw="<div class='bubbler' id='bubbler"+uid+"'>";htmlToDraw+="<div class='bone'>";htmlToDraw+="<div class='help unselectable' unselectable='on'>"+lng(bubblerHtml)+"</div>";htmlToDraw+="</div>";htmlToDraw+="<img src='' class='arrow' />";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);if(!options.manual){$(this.flowBoxSel).mouseenter(context(this).callback(this.autoShow));$(this.myBoxSel).mouseenter(context(this).callback(this.stopHide));}
$(this.flowBoxSel).mouseleave(context(this).callback(this.startHide));$(this.myBoxSel).mouseleave(context(this).callback(this.startHide));jsBubblerClientView.superclass.drawView.call(this);}
this.startHide=function(delay){this.timerID=setTimeout(context(this).callback(this.autoHide),this.timerDelay);}
this.stopHide=function(){clearTimeout(this.timerID);}
this.autoShow=function(){this.stopHide();var bubbler=$(this.myBoxSel);var arrow=$(bubbler).find('>.arrow');var flowElem=$(this.flowBoxSel);var bubblerShift=this.bubblerShift;var direction=this.direction;var L,T;function show(img,aL,aT,bL,bT,originL,originT){var offsetL=$(bubbler).parent().position().left-$(bubbler).parent().offset().left;var offsetT=$(bubbler).parent().position().top-$(bubbler).parent().offset().top;$(arrow).css({'left':aL,'top':aT}).attr('src',img);$(bubbler).css({'left':bL+offsetL+'px','top':bT+offsetT+'px'});$(bubbler).stop(false,true).animate({'left':originL+offsetL,'top':originT+offsetT,'opacity':'show'},400);}
switch(direction){case'right':L=$(flowElem).offset().left+$(flowElem).width()+$(arrow).width();T=$(flowElem).offset().top+($(flowElem).height()-$(bubbler).height())/2;show('image/bubbler_arrow_right.png',0-$(arrow).width(),($(bubbler).height()-$(arrow).height())/2,L-bubblerShift,T,L,T);break;case'left':L=$(flowElem).offset().left-$(bubbler).width()-$(arrow).width();T=$(flowElem).offset().top+($(flowElem).height()-$(bubbler).height())/2;show('image/bubbler_arrow_left.png',$(bubbler).width(),($(bubbler).height()-$(arrow).height())/2,L+bubblerShift,T,L,T);break;case'top':L=$(flowElem).offset().left+($(flowElem).width()-$(bubbler).width())/2;T=$(flowElem).offset().top-$(bubbler).height()-$(arrow).height();show('image/bubbler_arrow_top.png',($(bubbler).width()-$(arrow).width())/2,$(bubbler).height(),L,T+bubblerShift,L,T);break;case'bottom':L=$(flowElem).offset().left+($(flowElem).width()-$(bubbler).width())/2;T=$(flowElem).offset().top+$(flowElem).height()+$(arrow).height();show('image/bubbler_arrow_bottom.png',($(bubbler).width()-$(arrow).width())/2,0-$(arrow).height(),L,T-bubblerShift,L,T);break;}}
this.autoHide=function(){var bubbler=$(this.myBoxSel);var bubblerShift=this.bubblerShift;var direction=this.direction;function hide(bL,bT){var offsetL=$(bubbler).parent().position().left-$(bubbler).parent().offset().left;var offsetT=$(bubbler).parent().position().top-$(bubbler).parent().offset().top;$(bubbler).stop(false,true).animate({'left':bL+offsetL,'top':bT+offsetT,'opacity':'hide'},400);}
switch(direction){case'right':hide($(bubbler).offset().left+bubblerShift,'+=0');break;case'left':hide($(bubbler).offset().left-bubblerShift,'+=0');break;case'top':hide('+=0',$(bubbler).offset().top-bubblerShift);break;case'bottom':hide('+=0',$(bubbler).offset().top+bubblerShift);break;}}
this.bubblerShift=20;this.flowBoxSel=null;this.direction='top';this.timerDelay=0;this.timerID=null;}
extend(jsBubblerClientView,jsCSideView);function jsCheckWANController(wan){jsCheckWANController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsCheckWANView,options:{}};this.ifaceTypes.server={type:jsCheckWANServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();this.nextIface="client";this.addChild(new jsInputController("google.com"),"host");this.addChild(new jsFieldSetController(),"out");this.getWAN=function(){var wan=this.wan;if(wan){if(wan.ifname){this.ifnode=this.iftree[wan.ifname];}
else if(!no(wan.vpi)&&!no(wan.vci)){var ifnode;for(var i in this.iftree){ifnode=this.iftree[i];if(ifnode.type=="atm"&&ifnode.pvc_settings.vpi==wan.vpi&&ifnode.pvc_settings.vci==wan.vci){this.ifnode=ifnode;break;}}}}
if(this.ifnode){this.service=null;this.tunnel=null;var services=this.ifnode.services;for(var i in services){if(services[i].name==wan.serviceName){this.service=services[i];this.event("settodelete",i,true);if(wan.tunnelName){var tunnels=services[i].tunnels;for(var j in tunnels){if(tunnels[j].name==wan.tunnelName){this.tunnel=tunnels[j];}}}
break;}}
if(wan.serviceName2){for(var i in services){if(services[i].name==wan.serviceName2){this.service=services[i];this.event("settodelete",i,true);break;}}}}}
this.wan=wan;this.ifnode=null;this.service=null;this.tunnel=null;this.iftree=null;this.isCablePluged=null;this.ping=null;}
extend(jsCheckWANController,jsController);function jsCheckWANView(ctrl,viewInx,options){this.drawView=function(){jsCheckWANView.superclass.drawView.call(this);$(this.getChild("out").options.childBoxSel).addClass("checkwan");}
this.onstartcheckrq=function(){this.ctrl.event("disablebuttons",true,true);setTimeout(callback(this,function(){this.updateModel();var out=this.getChild("out");$(out.options.childBoxSel).html("");if(this.ctrl.wan.L2Type=="3g"){this.addOutItem(lng("checkusb")+char1);}
else{this.addOutItem(lng("checkcable")+char1);}
this.ctrl.event("checkcablerq");}),1500);return false;}
this.oncableready=function(){this.ctrl.getWAN();if(this.ctrl.isCablePluged){this.$curout.css("color","green");if(this.ctrl.wan.L2Type=="3g"){this.$curout.html(lng("g3_connection_success")+char2);}
else{this.$curout.html(lng("cableplugged")+char2);}
this.addOutItem(lng("connstat")+char1);var isConnected;if(this.ctrl.wan.isTunnel){isConnected=this.getStatus(this.ctrl.tunnel);}
else{isConnected=this.getStatus(this.ctrl.service);}
if(isConnected){this.addOutItem(lng("hostaccess")+char1);this.ctrl.event("pingrq");}
else{this.ctrl.event("enablebuttons",null,true);}}
else{this.$curout.css("color","red");if(!no(this.ctrl.wan.vpi)||!no(this.ctrl.wan.vci)||this.ctrl.wan.L2Type=="ptm"){this.$curout.html(lng("cablenotplugged")+char2);alert(lng("quickInfoDSL1"));this.addDescription(lng("quickInfoDSL1"));this.addDescription(lng("quickInfoDSL3"));}
else{if(this.ctrl.wan.L2Type=="3g"){this.$curout.html(lng("g3_connection_error")+char2);alert(lng("g3_connection_error"));this.addDescription(lng("wanNoUsbModemAvail"));}
else if(this.ctrl.wan.medium=="fiber"){this.$curout.html(lng("cablenotplugged")+char2);alert(lng("quickInfoFiber1"));this.addDescription(lng("quickInfoFiber1"));}
else{this.$curout.html(lng("cablenotplugged")+char2);alert(lng("quickInfoEth1"));this.addDescription(lng("quickInfoEth1"));}}
this.ctrl.event("enablebuttons",null,true);}
return false;}
this.onpingready=function(status){var out=this.getChild("out");if(status){var ping=this.ctrl.ping[0];if(ping&&ping.transmited>0&&(ping.transmited==ping.received)){this.$curout.css("color","green");this.$curout.html(lng("accessible")+char2);alert(lng("inetok"));this.addResume(lng("inetok"),true);}
else{this.$curout.css("color","red");this.$curout.html(lng("unaccessible")+char2);this.describeInetFail();}}
else{this.$curout.css("color","red");this.$curout.html(lng("unaccessible")+char2);this.describeInetFail();}
this.ctrl.event("enablebuttons",null,true);return false;}
this.describeInetFail=function(){alert(lng("inetfail"));this.addResume(lng("inetfail"));if(!this.ctrl.wan.isTunnel&&this.ctrl.service.type=="bridge"){this.addDescription(lng("pingfailbridge"));}
else{this.addDescription(lng("pingfail"));}}
this.addResume=function(text,res){var outSel=this.getChild("out").childBoxSel;$(outSel).append("<div class='resume'>"+text+"</div>");var $resume=$(outSel+" div.resume");if(res){$resume.addClass("inetok");}
else{$resume.addClass("inetfail");}}
this.addDescription=function(text){var outSel=this.getChild("out").childBoxSel;$(outSel).append("<div class='description'>"+text+"</div>");}
this.addOutItem=function(text){var id="out"+getUID();var htmlToDraw="<div id='"+id+"' class='out'><div class='edit'><div class='label' ";if(this.options.inputPadding){htmlToDraw+="style='width: "+this.options.inputPadding+"'";}
htmlToDraw+="><span>"+text+"</span></div>";htmlToDraw+="<div class='input'><img src='image/wait.gif' /></div></div></div><div style='clear:both'></div>";var out=this.getChild("out");$(out.options.childBoxSel).append(htmlToDraw);this.$curout=$("#"+id+" div.input");}
this.getStatus=function(obj){if(obj){if(obj.enable){if(obj&&obj.connection_status){if(obj.connection_status=="Connected"){this.$curout.css("color","green");this.$curout.html(lng("statWanUp")+char2);return true;}
else if(obj.connection_status=="Disconnected"){this.$curout.css("color","red");this.$curout.html(lng("statWanDown")+char2);alert(lng("wandownmes"));this.addResume(lng("wandownmes"));this.addDescription(lng("wanconnectingmes2"));return false;}
else{this.$curout.css("color","#FF8800");this.$curout.html(lng(obj.connection_status)+char2);alert(lng("wanconnectingmes"));this.addResume(lng("wanconnectingmes"));this.addDescription(lng("wanconnectingmes2"));return false;}}
else{this.$curout.css("color","red");this.$curout.html(lng("statWanDown")+char2);alert(lng("wandownmes"));this.addResume(lng("wandownmes"));this.addDescription(lng("wanconnectingmes2"));return false;}}
else{this.$curout.css("color","red");this.$curout.html(lng("disable")+char2);alert(lng("wandismes"));this.addResume(lng("wandismes"));return false;}}
else{this.$curout.css("color","red");this.$curout.html(lng("wanStatusNotCreated"));alert(lng("wancreatefailure")+char2);this.addResume(lng("wancreatefailure")+".");return false;}}
var obj=ctrl.getChild("host");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"checkwanhost"};obj=ctrl.getChild("out");obj.nextIface="client";obj.ifaceTypes.client.options={slider:true,nocollapse:true,title:"checkwanresult",descText:""};options.slider=true;options.nocollapse=true;options.title=lng("checkwantitle");options.descText="";var char1=":";var char2=".";jsCheckWANView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("startcheckrq",this.onstartcheckrq);this.bind("cableready",this.oncableready);this.bind("pingready",this.onpingready);}
extend(jsCheckWANView,jsFieldSetClientView);function jsCheckWANServerView(ctrl,viewInx,options){jsCheckWANServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;switch(this.mode){case"cable":if(data&&!data.baddata&&data.rq){if(data.rq[0]&&data.rq[0].resident){this.ctrl.iftree=data.rq[0].resident.iface_names;function checkEthWAN(){var rq=data.rq[1];isConnect=false;if(rq.status==20&&rq.resident){var port;var obj;var ifnode;for(var p in rq.resident){port=p;obj=rq.resident[p];ifnode=this.ctrl.iftree[obj.iface];if(obj.is_wan||(ifnode&&ifnode.is_wan)){break;}}
if(!no(rq.resident[port].status)){isConnect=rq.resident[port].status;}else{isConnect=rq.resident[port];}}
return isConnect;}
var wan=this.ctrl.wan;if(wan.L2Type=="3g"){var rq=data.rq[2];this.ctrl.isCablePluged=rq.status==20&&rq.resident;}
else{this.ctrl.isCablePluged=checkEthWAN.call(this);}
this.ctrl.event("cableready");}}
break;case"ping":if(data&&!data.baddata&&data.resident){this.ctrl.ping=data.resident;this.ctrl.event("pingready",true);}
else{this.ctrl.event("pingready",false);}
break;}}
this.prepareData=function(){var obj;switch(this.mode){case"cable":var obj={v2:"y",rq:2,res_json0:"y",res_config_action0:1,res_config_id0:1,res_struct_size0:1,res_json1:"y",res_config_action1:somovdParams.CONFIG_ACTION_READ,res_struct_size1:1,res_config_id1:somovdParams.CONFIG_ID_PORT_STATUS};var rqInx=2;if(this.ctrl.wan.L2Type=="3g"){obj["res_json"+rqInx]="y";obj["res_config_action"+rqInx]=somovdParams.CONFIG_ACTION_READ;obj["res_struct_size"+rqInx]=1;obj["res_config_id"+rqInx]=somovdParams.CONFIG_ID_3G_NEW;obj.rq=++rqInx;}
break;case"ping":var host=this.ctrl.getChild("host").model.value;obj={v2:"y",rq:"y",res_data_type:"json",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_EDIT,res_config_id:somovdParams.CONFIG_ID_PING,res_struct_size:1,res_buf:$.toJSON({ping_host:host,ping_count:1})};break;}
this.addToRequest(obj);}
this.mode="cable";this.oncheckcablerq=function(){this.mode="cable";this.updateView();}
this.onpingrq=function(){this.mode="ping";this.updateView();}
this.bind("checkcablerq",this.oncheckcablerq);this.bind("pingrq",this.onpingrq);}
extend(jsCheckWANServerView,jsSSideView);window.configParams={mainMenuStyle:"side"};function pageConfiguration(){pageConfiguration.superclass.constructor.call(this);this.add(new nodestatic("comment_save_current_config"),"current_config_save")
.add(new nodestatic("comment_factory_config"),"factory_config_save")
.add(new nodestatic("comment_download_config"),"config_download")
.add(new nodeUpload("comment_upload_config",'index.cgi','file_config',{mandatory:true,browse:'button_browse',cancel:'button_cancel'}),"upload_config");if(hideFlag(somovdParams.CMD_RESET_TO_DEFAULT))this.get("factory_config_save").hide();if(hideFlag(somovdParams.CMD_RESTORE_CONFIG))this.get("upload_config").hide();if(hideFlag(somovdParams.CMD_BACKUP_CONFIG))this.get("config_download").hide();this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageConfiguration.superclass.updateView.apply(this,arguments);if(phase=="forward"){}
if(phase=="back"){this.child("current_config_save").val($("\
    <div></div>\
   ").lightUIButton("button_conf_save").bind('click.button',callback(this,this.save)));this.child("factory_config_save").val($("\
    <div></div>\
   ").lightUIButton("button_factory").bind('click.button',callback(this,this.reset)));this.child("config_download").val($("\
    <div></div>\
   ").lightUIButton("button_config_download").bind('click.button',callback(this,this.backup)));if(disableFlag("CMD_BACKUP_CONFIG")){this.get("config_download").hide();}
if(disableFlag("CMD_RESET_AND_REBOOT")){this.get("factory_config_save").hide();}
if(disableFlag("CMD_RESTORE_CONFIG")){this.get("upload_config").hide();}}}
this.save=function(){rootView.showModalOverlay();device.system.save(callback(this,function(){rootView.hideModalOverlay();alert(lng("save_config_success"));}));}
this.reset=function(){rootCtrl.event("resetrebootrq");}
this.backup=function(){if(window.SAVEME)SAVEME.lock();device.system.backup(function(){if(window.SAVEME)SAVEME.unlock();});}
this.bind("updaterq",function(){this.deep.updateView();});this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"upload_config":break;}});this.bind("uploading",function(status,value){});this.bind("uploaded",function(status,value,data){if(is.RPC_SUCCESS(data)){rootCtrl.event("rebootrq");}
else{alert(lng("lng_config_upload_failed"));}});this.bind("cancel",function(status,value){});}
extend(pageConfiguration,node);function jsConnsMainTabModel(iftree,lanClients,dhcpClients,routes){jsConnsMainTabModel.superclass.constructor.call(this);this.iftree=iftree;this.lanClients=lanClients;this.dhcpClients=dhcpClients;this.routes=routes;}
extend(jsConnsMainTabModel,jsModel);function jsConnsMainTabController(iftree,ifname,srvname,tnlname,lanClients,dhcpClients,routes){jsConnsMainTabController.superclass.constructor.call(this);if(ifname&&iftree[ifname]){var ifnode=iftree[ifname];if(srvname&&ifnode.services&&ifnode.services[srvname]){var service=ifnode.services[srvname];if(!tnlname||!service.tunnels||!service.tunnels[tnlname]){tnlname=null;}}
else{ifname=null;srvname=null;tnlname=null;}}
else{ifname=null;srvname=null;tnlname=null;}
this.onblankchange=function(){var general=this.getChild("general");var ifnode=general.model.ifnode;var service=general.model.service;var srvname=general.model.srvname;var tunnel=general.model.tunnel;var tnlname=general.model.tnlname;var ifname=general.model.ifname;var other=this.getChild("other");var isadding=(srvname=="create"||tnlname=="create");var wizard=this.model.iftree.wizard;var L2L3=other.getChild("L2L3");var blocks=this.model.blocks;ifnode.wizard=wizard;ifnode.blocks=blocks;switch(ifnode.type){case"atm":if(!blocks||webadminParams.BLOCK_WAN_ATM){L2L3.changeChild(L2L3.getChild("L2").thisInx,new jsATMSettingsController(ifnode,isadding),"L2");L2L3.getChild("L2").model.iftree=this.model.iftree;}
else{L2L3.changeChild(L2L3.getChild("L2").thisInx,new jsController(),"L2");}
break;case"ethernet":case"ptm":case"bridge":if(ifnode.is_wan&&(webadminParams.BLOCK_WAN_ETH||!blocks)){L2L3.changeChild(L2L3.getChild("L2").thisInx,new jsEthSettingsController(ifnode,isadding),"L2");L2L3.getChild("L2").model.lanClients=this.model.lanClients;}
else{L2L3.changeChild(L2L3.getChild("L2").thisInx,new jsController(),"L2");}
break;case"3g":case"lte":L2L3.changeChild(L2L3.getChild("L2").thisInx,new js3GSettingsController(ifnode,isadding),"L2");break;case"auto":L2L3.changeChild(L2L3.getChild("L2").thisInx,new jsController(),"L2");break;}
service.contype=ifnode.contype?ifnode.contype:getConnType(ifnode,service,tunnel);service.is_wan=true;service.level=3;service.wizard=wizard;service.blocks=blocks;this.contype=service.contype;var miscL3=new jsMiscSettingsController(service,true);other.changeChild(other.getChild("routing").thisInx,new jsController(),"routing");if(wizard&&!tunnel){L2L3.changeChild(L2L3.getChild("name").thisInx,new jsInputController(service.name),"name");}
else{L2L3.changeChild(L2L3.getChild("name").thisInx,new jsController(),"name");}
switch(service.type){case"ppp":case"pppv6":case"pppdual":case"3g":if((blocks&&webadminParams.BLOCK_WAN_MISC_L3)||!blocks){var misc=new jsMiscSettingsController(service,true);L2L3.changeChild(L2L3.getChild("miscL3").thisInx,miscL3,"miscL3");}
else{L2L3.changeChild(L2L3.getChild("miscL3").thisInx,new jsController,"miscL3");}
L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsPPPSettingsController(service,isadding),"L3");break;case"ipv6":switch(service.contype){case"staticv6":if(!blocks||webadminParams.BLOCK_WAN_STATIPV6){L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsStatIPv6SettingsController(service,isadding),"L3");}
else{L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsController(),"L3");}
if((blocks&&webadminParams.BLOCK_WAN_MISC_L3)||!blocks){L2L3.changeChild(L2L3.getChild("miscL3").thisInx,miscL3,"miscL3");}
else{L2L3.changeChild(L2L3.getChild("miscL3").thisInx,new jsController(),"miscL3");}
break;case"dynamicv6":if((blocks&&webadminParams.BLOCK_WAN_DYNIPV6)||!blocks){L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsDinIPv6SettingsController(service,isadding),"L3");}
else{L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsController(),"L3");}
if((blocks&&webadminParams.BLOCK_WAN_MISC_L3)||!blocks){L2L3.changeChild(L2L3.getChild("miscL3").thisInx,miscL3,"miscL3");}
else{L2L3.changeChild(L2L3.getChild("miscL3").thisInx,new jsController(),"miscL3");}
break;}
break;case"ip":switch(service.contype){case"static":case"statpptp":case"statl2tp":case"statpppoe":case"statpptpv6":case"statl2tpv6":case"ipoa":case"statkab":if(!blocks||((service.contype=="ipoa")&&webadminParams.BLOCK_WAN_IPOA)||((service.contype!="ipoa")&&webadminParams.BLOCK_WAN_STATIP)){L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsStatIPSettingsController(service,isadding),"L3");}
else{L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsController(),"L3");}
if(wizard&&(service.contype=="statpptp"||service.contype=="statl2tp"||service.contype=="statpppoe"||service.contype=="statpptpv6"||service.contype=="statl2tpv6")){other.changeChild(other.getChild("routing").thisInx,new jsLocalResController(service,this.model.routes,4),"routing");}
if(!ifnode.is_wan){if(blocks){if(service&&service.dhcpd){service.dhcpd.blocks=service.blocks;if(webadminParams.BLOCK_LAN_DHCP){other.changeChild(other.getChild("DHCP").thisInx,new jsDhcpServerController(service.dhcpd),"DHCP");}
else{other.changeChild(other.getChild("DHCP").thisInx,new jsController(),"DHCP");}
if(webadminParams.BLOCK_LAN_STAT_DHCP){other.changeChild(other.getChild("statDHCP").thisInx,new jsDhcpServerMacController(service.dhcpd,this.model.lanClients,this.model.dhcpClients),"statDHCP");}
else{other.changeChild(other.getChild("statDHCP").thisInx,new jsController(),"statDHCP");}}}
else{if(service&&service.dhcpd){other.changeChild(other.getChild("DHCP").thisInx,new jsDhcpServerController(service.dhcpd),"DHCP");other.changeChild(other.getChild("statDHCP").thisInx,new jsDhcpServerMacController(service.dhcpd,this.model.lanClients,this.model.dhcpClients),"statDHCP");}}}
L2L3.changeChild(L2L3.getChild("miscL3").thisInx,miscL3,"miscL3");break;case"dynamic":case"dynpptp":case"dynpppoe":case"dynl2tp":case"dynpptpv6":case"dynl2tpv6":case"lte":case"dynkab":if((blocks&&webadminParams.BLOCK_WAN_DYNIP)||!blocks){L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsDinIPSettingsController(service,isadding),"L3");}
else{L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsController(),"L3");}
if((blocks&&webadminParams.BLOCK_WAN_MISC_L3)||!blocks){L2L3.changeChild(L2L3.getChild("miscL3").thisInx,miscL3,"miscL3");}
else{L2L3.changeChild(L2L3.getChild("miscL3").thisInx,new jsController(),"miscL3");}
break;}
break;case"bridge":case"auto":L2L3.changeChild(L2L3.getChild("L3").thisInx,new jsController(),"L3");L2L3.changeChild(L2L3.getChild("miscL3").thisInx,new jsController(),"miscL3");break;}
if(service.vlan&&getObjectLength(service.vlan)&&((blocks&&webadminParams.BLOCK_WAN_BCM_VLAN)||!blocks)){L2L3.changeChild(L2L3.getChild("VLAN").thisInx,new jsBCMVlanSettingsController(service,isadding),"VLAN");}
else{L2L3.changeChild(L2L3.getChild("VLAN").thisInx,new jsController(service,isadding),"VLAN");}
if(tunnel){tunnel.contype=service.contype;tunnel.is_wan=true;tunnel.level=4;tunnel.wizard=wizard;tunnel.blocks=blocks;var VPN=other.changeChild(other.getChild("VPN").thisInx,new jsFieldSetController(),"VPN");if(wizard){VPN.addChild(new jsInputController(tunnel.name),"name");}
switch(tunnel.type){case"ppp":tunnel.level=3;VPN.addChild(new jsPPPSettingsController(tunnel,isadding),"PPP");break;case"pptp":case"l2tp":case"ppp":VPN.addChild(new jsPPPSettingsController(tunnel,isadding),"PPP");break;case"624":VPN.addChild(new js624Controller(tunnel,isadding),"624");break;}
var miscVPN=new jsMiscSettingsController(tunnel,true);if((blocks&&webadminParams.BLOCK_WAN_MISC_L4)||!blocks){VPN.addChild(miscVPN,"misc");}}
else{other.changeChild(other.getChild("VPN").thisInx,new jsController(),"VPN");}
return true;}
this.getIfaceByName=function(ifname,layer){return this.model.iftree[ifname];}
this.changeModel(new jsConnsMainTabModel(iftree,lanClients,dhcpClients,routes));this.isadding=!ifname;var wizard=this.model.iftree.wizard;if(wizard){this.addChild(new jsCableStatController(),"cable");}
this.addChild(new jsGeneralSettingsController(iftree,ifname,srvname,tnlname,"services"),"general");var other=this.addChild(new jsFieldSetController(),"other");var L2L3=other.addChild(new jsFieldSetController(),"L2L3");L2L3.addChild(new jsController(),"name");L2L3.addChild(new jsController(),"L2");L2L3.addChild(new jsController(),"L3");L2L3.addChild(new jsController(),"miscL3");L2L3.addChild(new jsController(),"VLAN");other.addChild(new jsController(),"routing");other.addChild(new jsController(),"DHCP");other.addChild(new jsController(),"statDHCP");var VPN=other.addChild(new jsController(),"VPN");this.addChild(new jsFieldSetController(),"summary");if(wizard){this.addChild(new jsCheckWANController(),"checkwan");}
this.addChild(new jsDialogSetController(),"needPINDialog").addChild(new jsNeedPINDialogController(),"needPINDialogContent");if(window.engine&&window.engine.candyBlack){this.addChild(new jsBubblerController(),"tip");}
this.addEventHandler("blankchange",this.onblankchange);this.ifaceTypes.client={type:jsConnsMainTabClientView};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsConnsMainTabSummaryView};this.ifaceTypes.summary.options={nothing:true,inputPadding:"200px",summary:true};if(wizard){this.nextIface="summary";this.addIface();this.nextIface="client";}
this.contype=null;}
extend(jsConnsMainTabController,jsFieldSetController);function jsConnsMainTabClientView(ctrl,viewInx,options){var obj;var opt;var ifnode=ctrl.model.ifnode;var service=ctrl.model.service;var tunnel=ctrl.model.tunnel;var iftree=ctrl.model.iftree;var isadding=ctrl.model.isadding;this.onmodeswitch=function(value){var L2L3=this.ctrl.getChild("other","L2L3");L2L3.getChild("L2").event("modeswitch",value);L2L3.getChild("L3").event("modeswitch",value);L2L3.getChild("miscL3").event("modeswitch",value);L2L3.getChild("VLAN").event("modeswitch",value);var VPN=this.ctrl.getChild("other","VPN");for(var i in VPN.children){VPN.children[i].event("modeswitch",value);}
this.setOption("brief",value);return false;}
this.drawView=function(){if(!this.options.nooverlay){this.showModalOverlay("wanBuildForm");}
setTimeout(context(this).callback(function(){var general=this.getChild("general");general.options.hide=!general.ctrl.model.ifnode.is_wan;jsConnsMainTabClientView.superclass.drawView.call(this);this.ctrl.event("drawsummaryrq",this.getChild("summary").options.viewBoxSel);if(!this.ctrl.model.iftree.wizard){this.ctrl.event("blankchange");}
if(this.ctrl.model.iftree.wizard){this.goFirstStep();}
if(disableFlag(somovdParams.CONFIG_ID_WAN_TEMP)){var service=this.ctrl.getChild("general").model.service;var tunnel=this.ctrl.getChild("general").model.tunnel;if(tunnel){var contype=tunnel.contype;}
else{var contype=service.contype;}
var buttons=this.options.buttons;for(var i=0;i<buttons.length;i++){if((buttons[i].name=="save"&&contype!="pppoe")||buttons[i].name=="del"){this.disableButton(buttons[i].name);(function disableFields(){var child;for(var i=0;i<this.ctrl.children.length;i++){child=this.getChild(i);if(child&&is.func(child.disable)){var alias=child.ctrl.alias;if(alias=="userName"||alias=="noAuth"||alias=="password"||alias=="confirm"){continue;}
else{child.disable();}}
else if(child instanceof jsCSideView){disableFields.call(child);}}}).call(this);}}}
this.hideModalOverlay();if(window.engine&&window.engine.candyBlack){this.getChild("tip").show();}}),0);}
jsConnsMainTabClientView.prototype.onblankchange=function(){var other=this.getChild("other");var general=this.getChild("general");var name=other.ctrl.getChild("L2L3","name");if(name instanceof jsInputController){name.nextIface="input";name.ifaceTypes.input.options={humanName:"wanNameWiz",mandatory:true}}
var VPN=other.ctrl.getChild("VPN");if(VPN instanceof jsFieldSetController){VPN.nextIface="client";VPN.ifaceTypes.client.options={nothing:true}
if(this.ctrl.model.iftree.wizard){name=VPN.getChild("name");name.nextIface="input";name.ifaceTypes.input.options={humanName:"wanNameWiz",mandatory:true}}}
other.options.wizard=false;general.options.wizard=false;other.options.inwizard=this.options.wizard;other.options.brief=this.options.brief;other.options.buttonsInline=true;other.constructor(other.ctrl,other.viewInx,other.options?other.options:{});other.options.wizard=this.options.wizard;general.options.wizard=this.options.wizard;other.activeTab=0;other.drawView();this.ctrl.model.iftree.needPIN
this.ctrl.event("showneedpindialogrq");if(this.getChild("general").ctrl.model.ifnode.type=="3g"&&this.ctrl.model.iftree.needPIN){var needPINDialog=this.getChild("needPINDialog");if(needPINDialog instanceof jsFieldSetClientView){needPINDialog.show();}}
return true;}
this.onshowneedpindialogrq=function(){if(this.getChild("general").ctrl.model.ifnode.type=="3g"&&this.ctrl.model.iftree.needPIN){var needPINDialog=this.getChild("needPINDialog");if(needPINDialog instanceof jsFieldSetClientView){needPINDialog.show();}}
return false;}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;switch(alias){case"useipv6":var DHCP=this.getChild("other","DHCP");if(DHCP instanceof jsDhcpServerClientView){if(obj.value){}
else{}}
break;case"vpi":case"vci":this.getChild("general").autoname();this.getChild("general").updateModel();break;case"port":this.getChild("L2L3","L2").event("portchange",obj.value);break;}
return false;}
this.updateModel=function(){var res=jsConnsMainTabClientView.superclass.updateModel.call(this);var general=this.getChild("general");var model=general.ctrl.model;if(model.service.dhcpd){var DHCP=this.getChild("other","DHCP");var updateModelDHCP=DHCP.updateModel;DHCP.updateModel=function(){return true};}
if(res&&model.service.dhcpd){if(!model.ifnode.is_wan&&model.service.dhcpd){var IP=this.getChild("other","L2L3","L3");var DHCP=this.getChild("other","DHCP");var begin;var end;DHCP.getChild("mode").updateModel();var dhcpdmode=DHCP.getChild("mode").ctrl.model.value;if(dhcpdmode=="en"&&IP.ctrl.isIpOrMaskChanged){if(DHCP.correctDHCP(IP.getChild("ip").ctrl.model,IP.getChild("mask").ctrl.model)){var divMain=DHCP.getChild("divMain");begin=divMain.getChild("begin");end=divMain.getChild("end");if(confirm(lng("dhcpCorrectReq")+" "+lng("dhcpNewPool")+" "+begin.ctrl.model.toString()+" ... "+end.ctrl.model.toString())){begin.updateView();end.updateView();}
IP.ctrl.isIpOrMaskChanged=false;}}
var ipv6Support=model.ifnode.is_wan;ipv6Support=true;if(ipv6Support){var divIPv6=DHCP.getChild("divIPv6");var divIPv6Params=divIPv6.getChild("divIPv6Params");var ipv6Enable=divIPv6.getChild("ipv6Enable");var ipv6StateMode=divIPv6Params.getChild("ipv6StateMode");ipv6Enable.updateModel();ipv6StateMode.updateModel();var dhcpdenv6=ipv6Enable.ctrl.model.value;var dhcpdmodev6=ipv6StateMode.ctrl.model.value;if(dhcpdenv6&&dhcpdmodev6==1&&IP.ctrl.isIpOrMaskv6Changed){var divIPv6=IP.getChild("ipv6box","divIPv6");if(DHCP.correctDHCP(divIPv6.getChild("ip").ctrl.model,null,divIPv6Params)){begin=divIPv6Params.getChild("begin");end=divIPv6Params.getChild("end");if(confirm(lng("dhcpCorrectReqv6")+" "+lng("dhcpNewPool")+" "+begin.ctrl.model.toString()+" ... "+end.ctrl.model.toString())){begin.updateView();end.updateView();}
IP.ctrl.isIpOrMaskv6Changed=false;}}}}
DHCP.updateModel=updateModelDHCP;res&=DHCP.updateModel();}
return res;}
this.del=function(){this.showModalOverlay();this.ctrl.getParent(1).event("deleterq");}
this.ondisablebuttons=function(){var buttons=this.options.buttons;for(var i in buttons){this.disableButton(buttons[i].name);}
return false;}
this.onenablebuttons=function(){var buttons=this.options.buttons;for(var i in buttons){this.enableButton(buttons[i].name);}
return false;}
this.modeswitchshow=function(){if(window.engine&&window.engine.simpleAir){rootCtrl.event("modeswitchshowrq");};if(window.engine&&window.engine.candyBlack){rootCtrl.event("modeswitchshowrq");this.getChild("tip").autoShow();this.getChild("tip").startHide();}}
this.modeswitchhide=function(){if(window.engine&&window.engine.simpleAir){rootCtrl.event("modeswitchhiderq");};if(window.engine&&window.engine.candyBlack){rootCtrl.event("modeswitchhiderq");this.getChild("tip").autoHide();}}
this.setSummaryButtons=function(){var buttons=this.options.buttons=[];buttons.push({name:"prev",value:"button_prev",handler:this.summaryPrev});buttons.push({name:"save",value:"button_save",handler:this.save});this.ctrl.event("updatesummaryrq");}
this.setVPNButtons=function(){var buttons=this.options.buttons;buttons.push({name:"prev",value:"button_prev",handler:this.VPNPrev});buttons.push({name:"next",value:"button_next",handler:this.VPNNext});}
this.goFirstStep=function(){this.options.buttons=[{name:"next",value:"button_next",handler:this.cableNext}];this.switchChild("cable");this.updateButtons();}
this.cableNext=function(){this.ctrl.event("checkcable",null,true);}
this.oncableready=function(ready){if(!ready){if(!confirm(lng("wancablewarn"))){return;}}
var buttons=[];this.options.buttons=buttons;if(this.ctrl.isadding){var general=this.getChild("general");if(getObjectLength(provList)<2){buttons.push({name:"prev",value:"button_prev",handler:this.typePrev});buttons.push({name:"next",value:"button_next",handler:this.typeNext});general.switchChild("type");}
else{buttons.push({name:"prev",value:"button_prev",handler:this.provPrev});buttons.push({name:"next",value:"button_next",handler:this.provNext});general.switchChild("provstep");}
this.switchChild("general");this.updateButtons();this.modeswitchhide();}
else{switch(this.ctrl.contype){case"pptp":case"l2tp":case"624":var other=this.getChild("other");buttons.push({name:"next",value:"button_next",handler:this.L2L3Next});other.activeTab=other.getChild("L2L3").ctrl.thisInx;this.switchChild("other");this.updateButtons();this.modeswitchshow();break;}}
return false;}
this.provNext=function(){var general=this.getChild("general");var buttons=[];this.options.buttons=buttons;var provname=general.ctrl.model.templates.provname;if(!provname||provname=="man"){buttons.push({name:"prev",value:"button_prev",handler:this.typePrev});buttons.push({name:"next",value:"button_next",handler:this.typeNext});general.switchChild("type");this.modeswitchhide();}
else{if(this.getChild("general").updateModel()){this.ctrl.event("blankchange");buttons.push({name:"prev",value:"button_prev",handler:this.L2L3Prev});buttons.push({name:"next",value:"button_next",handler:this.L2L3Next});var other=this.getChild("other");other.ctrl.activeTab=other.ctrl.getChild("L2L3").thisInx;this.switchChild("other");this.modeswitchshow();}}
this.updateButtons();}
this.provPrev=function(){this.options.buttons=[{name:"next",value:"button_next",handler:this.cableNext}];this.switchChild("cable");this.updateButtons();}
this.typeNext=function(){var buttons=[];this.options.buttons=buttons;var general=this.getChild("general");var model=general.ctrl.model;if(getObjectLength(model.templates[model.ifnode.contype])>1){buttons.push({name:"prev",value:"button_prev",handler:this.portPrev});buttons.push({name:"next",value:"button_next",handler:this.portNext});general.switchChild("port");this.modeswitchhide();}
else{if(general.updateModel()){this.ctrl.event("blankchange");var other=this.getChild("other");switch(this.ctrl.contype){case"pptp":case"l2tp":case"624":this.setVPNButtons();other.switchChild("VPN");break;default:buttons.push({name:"prev",value:"button_prev",handler:this.L2L3Prev});buttons.push({name:"next",value:"button_next",handler:this.L2L3Next});other.switchChild("L2L3");break;}
this.switchChild("other");this.modeswitchshow();}}
this.updateButtons();}
this.typePrev=function(){var buttons=[];this.options.buttons=buttons;if(getObjectLength(provList)<2){buttons.push({name:"next",value:"button_next",handler:this.cableNext});this.switchChild("cable");}
else{buttons.push({name:"prev",value:"button_prev",handler:this.provPrev});buttons.push({name:"next",value:"button_next",handler:this.provNext});this.getChild("general").switchChild("provstep");}
this.updateButtons();}
this.portNext=function(){var general=this.getChild("general");var other=this.getChild("other");if(general.updateModel()){this.ctrl.event("blankchange");var buttons=[];this.options.buttons=buttons;switch(this.ctrl.contype){case"pppoe":case"pppoev6":case"pppoedual":case"pppoa":case"static":case"dynamic":case"staticv6":case"dynamicv6":case"ipoa":case"3g":case"lte":case"bridge":case"statpptp":case"statpppoe":case"statl2tp":case"statpptpv6":case"statl2tpv6":case"dynpptp":case"dynpppoe":case"dynl2tp":case"dynpptpv6":case"dynl2tpv6":case"dynkab":case"statkab":buttons.push({name:"prev",value:"button_prev",handler:this.L2L3Prev});buttons.push({name:"next",value:"button_next",handler:this.L2L3Next});other.ctrl.activeTab=other.ctrl.getChild("L2L3").thisInx;break;case"pptp":case"l2tp":case"624":buttons.push({name:"prev",value:"button_prev",handler:this.VPNPrev});buttons.push({name:"next",value:"button_next",handler:this.VPNNext});other.ctrl.activeTab=other.ctrl.getChild("VPN").thisInx;break;}
this.switchChild("other");this.updateButtons();this.modeswitchshow();}}
this.portPrev=function(){var buttons=[];this.options.buttons=buttons;if(getObjectLength(provList)>1){buttons.push({name:"prev",value:"button_prev",handler:this.typePrev});}
buttons.push({name:"next",value:"button_next",handler:this.typeNext});this.getChild("general").switchChild("type");this.updateButtons();}
this.L2L3Next=function(){var L2L3=this.getChild("other","L2L3");if(L2L3.updateModel()){var general=this.getChild("general");var model=general.ctrl.model;if(model.tunnel){if(model.service.type!="auto"&&!model.service.name){model.service.name=general.ctrl.autoname(getConnType(model.ifnode,model.service));}}
else{var name=L2L3.getChild("name");var value=name.ctrl.model.value;if(value==""){name.statusCode="wanNameEmpty";}
else{name.statusCode=null;general.ctrl.model.service.name=value;general.ctrl.event("updatenamerq");general.updateView();}
name.setError();}
var buttons=[];this.options.buttons=buttons;switch(this.ctrl.contype){case"pppoe":case"pppoev6":case"pppoedual":case"pppoa":case"static":case"dynamic":case"staticv6":case"dynamicv6":case"ipoa":case"3g":case"lte":case"bridge":case"dynkab":case"statkab":this.setSummaryButtons();this.switchChild("summary");this.modeswitchhide();break;case"statpptp":case"statpppoe":case"statl2tp":case"statpptpv6":case"statl2tpv6":buttons.push({name:"prev",value:"button_prev",handler:this.routingPrev});buttons.push({name:"next",value:"button_next",handler:this.routingNext});this.getChild("other").switchChild("routing");this.modeswitchhide();break;case"dynpptp":case"dynpppoe":case"dynl2tp":case"dynpptpv6":case"dynl2tpv6":buttons.push({name:"prev",value:"button_prev",handler:this.VPNPrev});buttons.push({name:"next",value:"button_next",handler:this.VPNNext});this.getChild("other").switchChild("VPN");this.modeswitchshow();break;}
this.updateButtons();}
else{alert(lng("wanErrorMes"));}}
this.L2L3Prev=function(){var buttons=[];this.options.buttons=buttons;var general=this.getChild("general");var model=general.ctrl.model;if(getObjectLength(model.templates[model.ifnode.contype])>1){buttons.push({name:"prev",value:"button_prev",handler:this.portPrev});buttons.push({name:"next",value:"button_next",handler:this.portNext});general.switchChild("port");}
else{if(getObjectLength(provList)>1){buttons.push({name:"prev",value:"button_prev",handler:this.typePrev});}
buttons.push({name:"next",value:"button_next",handler:this.typeNext});general.switchChild("type");}
this.switchChild("general");this.updateButtons();this.modeswitchhide();}
this.routingNext=function(){var routing=this.getChild("other","routing");if(routing.updateModel()){var buttons=[];this.options.buttons=buttons;buttons.push({name:"prev",value:"button_prev",handler:this.VPNPrev});buttons.push({name:"next",value:"button_next",handler:this.VPNNext});this.getChild("other").switchChild("VPN");this.updateButtons();this.modeswitchshow();}}
this.routingPrev=function(){var routing=this.getChild("other","routing");if(routing.updateModel()){var buttons=[];this.options.buttons=buttons;buttons.push({name:"prev",value:"button_prev",handler:this.L2L3Prev});buttons.push({name:"next",value:"button_next",handler:this.L2L3Next});this.getChild("other").switchChild("L2L3");this.updateButtons();this.modeswitchshow();}}
this.VPNNext=function(){var VPN=this.getChild("other","VPN");if(VPN.updateModel()){var general=this.getChild("general");var name=VPN.getChild("name");var value=name.ctrl.model.value;if(value==""){name.statusCode="wanNameEmpty";}
else{name.statusCode=null;general.ctrl.model.tunnel.name=value;general.ctrl.event("updatenamerq");general.updateView();}
name.setError();var buttons=[];this.options.buttons=buttons;this.setSummaryButtons();this.switchChild("summary");this.updateButtons();this.modeswitchhide();}}
this.VPNPrev=function(){var VPN=this.getChild("other","VPN");var buttons=[];this.options.buttons=buttons;switch(this.ctrl.contype){case"statpptp":case"statpppoe":case"statl2tp":case"statpptpv6":case"statl2tpv6":buttons.push({name:"prev",value:"button_prev",handler:this.routingPrev});buttons.push({name:"next",value:"button_next",handler:this.routingNext});this.getChild("other").switchChild("routing");this.updateButtons();this.modeswitchhide();break;case"dynpptp":case"dynpppoe":case"dynl2tp":case"dynpptpv6":case"dynl2tpv6":buttons.push({name:"prev",value:"button_prev",handler:this.L2L3Prev});buttons.push({name:"next",value:"button_next",handler:this.L2L3Next});this.getChild("other").switchChild("L2L3");this.updateButtons();this.modeswitchshow();break;case"pptp":case"l2tp":case"624":if(getObjectLength(provList)>1){buttons.push({name:"prev",value:"button_prev",handler:this.typePrev});}
buttons.push({name:"next",value:"button_next",handler:this.typeNext});var general=this.getChild("general");general.ctrl.activeTab=general.ctrl.getChild("type").thisInx;this.switchChild("general");this.updateButtons();this.modeswitchhide();break;}}
this.summaryPrev=function(){var other=this.getChild("other");var buttons=[];this.options.buttons=buttons;switch(this.ctrl.contype){case"statpptp":case"statpppoe":case"statl2tp":case"statpptpv6":case"statl2tpv6":case"dynpptp":case"dynpppoe":case"dynl2tp":case"dynpptpv6":case"dynl2tpv6":case"pptp":case"l2tp":case"624":buttons.push({name:"prev",value:"button_prev",handler:this.VPNPrev});buttons.push({name:"next",value:"button_next",handler:this.VPNNext});other.switchChild("VPN");break;case"pppoe":case"pppoev6":case"pppoedual":case"pppoa":case"static":case"dynamic":case"staticv6":case"dynamicv6":case"ipoa":case"3g":case"lte":case"bridge":case"dynkab":case"statkab":buttons.push({name:"prev",value:"button_prev",handler:this.L2L3Prev});buttons.push({name:"next",value:"button_next",handler:this.L2L3Next});other.switchChild("L2L3");break;}
this.switchChild("other");this.updateButtons();this.modeswitchshow();}
this.save=function(){var res=this.updateModel();if(res){var general=this.getChild("general");var model=general.ctrl.model;if(model.ifnode.needDelete){if(!confirm(lng("wandelwarn"))){return;}}
if(!this.ctrl.model.enIGMPGlobal&&(model.service.igmp||(model.tunnel&&model.tunnel.igmp))&&!this.ctrl.model.jsonIGMP.enable){if(confirm(lng("wanEnIGMPMes"))){this.ctrl.model.enIGMPGlobal=true;}}
this.showModalOverlay();clearJSON(model.blankConn);this.ctrl.getParent().event("saverq");}}
this.onsavecomplete=function(){var wan={};var model=this.ctrl.getChild("general").model;wan.L2Type=model.ifnode.type;wan.medium=model.ifnode.medium;if(wan.L2Type=="atm"){wan.vpi=model.ifnode.pvc_settings.vpi;wan.vci=model.ifnode.pvc_settings.vci;}
else{wan.ifname=model.ifname;}
wan.serviceName=model.service.name;if(!no(model.tunnel)&&getObjectLength(model.tunnel)>0){if(model.ifnode.contype=="statpppoe"||model.ifnode.contype=="dynpppoe"){wan.serviceName2=model.tunnel.name;}
else{wan.tunnelName=model.tunnel.name;}}
this.ctrl.getChild("checkwan").wan=wan;this.switchChild("checkwan");this.options.buttons=[{name:"checkwan",value:"button_recheck",handler:function(){this.ctrl.getChild("checkwan").event("startcheckrq")}},{name:"prev",value:"button_prev",handler:this.checkWANPrev}];this.options.buttons.push({name:"next",value:"button_next",handler:function(){this.ctrl.event("wanready",null,true)}});this.updateButtons();this.ctrl.getChild("checkwan").event("startcheckrq");}
this.checkWANPrev=function(){this.setSummaryButtons();this.switchChild("summary");this.updateButtons();}
this.onnophyiface=function(){this.disableButton("next");return false;}
this.onphyifacepresent=function(){this.enableButton("next");return false;}
this.viewInx=viewInx;this.ctrl=ctrl;this.options=options?options:{};this.blocks=ctrl.model.blocks;this.wizard=ctrl.model.iftree.wizard;this.options.brief=this.wizard;this.rejectDel=ctrl.model.rejectDel;var generalOpt=ctrl.getChild("general").ifaceTypes.client.options;generalOpt.wizard=this.wizard;generalOpt.hide=this.blocks;options.title="wanMain";options.nothing=true;obj=ctrl.getChild("needPINDialog");obj.ifaceTypes.client.options={width:'500px',height:'80px',hide:true};if(window.engine&&window.engine.candyBlack){obj=ctrl.getChild("tip");obj.ifaceTypes.client.options={flow:'#pageToolbarModeSwitch',delay:5000,direction:'right',manual:true,content:'modeswitchtip'};}
jsConnsMainTabClientView.superclass.constructor.call(this,ctrl,viewInx,options);obj=ctrl.getChild("summary");obj.nextIface="client";this.bind("fieldchange",this.onfieldchange);this.bind("blankchange",this.onblankchange);this.bind("showneedpindialogrq",this.onshowneedpindialogrq);this.bind("nophyiface",this.onnophyiface);this.bind("phyifacepresent",this.onphyifacepresent);this.bind("modeswitch",this.onmodeswitch);this.bind("cableready",this.oncableready);this.bind("disablebuttons",this.ondisablebuttons);this.bind("enablebuttons",this.onenablebuttons);this.bind("savecomplete",this.onsavecomplete);this.options.buttons=[];if(!this.wizard&&!this.blocks){this.options.buttons.push({name:"save",value:"button_save",handler:this.save});}
if(!ctrl.isadding&&ctrl.getChild("general").model.ifnode.is_wan&&!this.blocks){this.options.buttons.push({name:"del",value:"button_del",handler:this.del});}
if(this.wizard){this.options.wizard=true;this.options.buttons.push({name:"next",value:"button_next",handler:this.firstStep});}}
extend(jsConnsMainTabClientView,jsFieldSetClientView);function jsConnsMainTabSummaryView(ctrl,viewInx,options){ctrl.getChild("general").nextIface="summary";ctrl.getChild("needPINDialog").nextIface="stop";ctrl.getChild("cable").nextIface="stop";ctrl.getChild("checkwan").nextIface="stop";jsConnsMainTabSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsFieldSetClientView.prototype.drawView.call(this);}
this.ondrawsummaryrq=function(viewBoxSel){this.options.viewBoxSel=viewBoxSel;this.viewBoxSel=viewBoxSel;this.drawView();return false;}
this.onupdatesummaryrq=function(){this.updateView();}
this.onblankchange=function(){var other=this.getChild("other");for(var i in other.ctrl.children){other.ctrl.children[i].nextIface="summary";}
var L2L3=other.getChild("L2L3");L2L3.ctrl.nextIface="client";L2L3.ctrl.getChild("L2").nextIface="summary";L2L3.ctrl.getChild("L3").nextIface="summary";var VPN=other.ctrl.getChild("VPN");if(VPN instanceof jsFieldSetController){VPN.nextIface="client";VPN.getChild("PPP").nextIface="summary";VPN.getChild("misc").nextIface="summary";}
jsConnsMainTabSummaryView.superclass.onblankchange.call(this);var general=this.getChild("general");if(general.ctrl.model.tunnel){other.getChild("VPN").getChild("name").hide();}
else{L2L3.getChild("name").hide();}}
this.bind("drawsummaryrq",this.ondrawsummaryrq);this.bind("updatesummaryrq",this.onupdatesummaryrq);this.bind("blankchange",this.onblankchange);this.bind("fieldchange",function(){return false;});this.bind("cableready",function(){return false;});this.bind("savecomplete",function(){return false;});this.wizard=false;this.options.wizard=false;this.options.buttons=null;}
extend(jsConnsMainTabSummaryView,jsConnsMainTabClientView);function jsNeedPINDialogController(){jsNeedPINDialogController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsNeedPINDialogClientView};}
extend(jsNeedPINDialogController,jsController);function jsNeedPINDialogClientView(ctrl,viewInx,options){jsNeedPINDialogClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsNeedPINDialogClientView.superclass.drawView.call(this);$(this.viewBoxSel).css("text-align","left");$(this.viewBoxSel).html(lng("wanNeedPINMesPart1")+" <a href='/index.cgi?v2_view=index2.html#rootMenu/usbModem/pin'>"+lng("wanNeedPINMesPart2")+"</a> "+lng("wanNeedPINMesPart3"));}}
extend(jsNeedPINDialogClientView,jsFieldSetClientView);function jsCableStatController(){jsCableStatController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsCableStatClientView,options:{}};}
extend(jsCableStatController,jsController);function jsCableStatClientView(ctrl,viewInx,options){jsCableStatClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsCableStatClientView.superclass.drawView.call(this);var img='/image/master_ethernet.gif';var text=lng('quickInfoEth1');var text2=lng('quickInfoEth2');$(this.viewBoxSel).html('<div class="picable"><img src="'+img+'" /></div><div class="picableInfo1">'+text+'</div><div class="picableInfo2">'+text2+'</div><div class="clear"></div>');}}
extend(jsCableStatClientView,jsCSideView);function pageDDNS(){pageDDNS.superclass.constructor.call(this);this.ddns=null;this.ifacelist=null;this.$grid=null;this.updateModel=function(status){status.error|=!this.$grid.cleanErrors().checkMandatory(true);this.status=status;}
this.updateView=function(phase){pageDDNS.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar().$box.empty();this.$grid=this.$box.html("\
    <div class='grid rm'></div>\
    <div class='buttonsInline'>\
     <div class='button add'></div>\
    </div>\
   ").find('.grid').lightUIGrid([{index:"host_name",name:"ddnsHost"},{index:"usr_name",name:"ddnsUserName"},{index:"password",name:"ddnsUserPass"},{index:"period",name:"ddnsPeriod"}],0,{selectable:true});this.$grid.bind("stopEditing.grid",callback(this,function(event,$cell){this.$grid.cleanErrors();}));this.$grid.colEditable("host_name","host",{mandatory:true})
.colEditable("usr_name","text",{mandatory:true})
.colEditable("password","text",{mandatory:true})
.colEditable("period","number",{mandatory:true})
this.$box.find('.add')
.lightUIButton("add")
.bind("click.button",callback(this,function(){this.$grid.addRow().row("last").col("host_name").trigger("click");}));for(var i=0;this.ddns&&i<this.ddns.length;i++){var rule=this.ddns[i];var $row=this.$grid.addRow().row("last");$row.col("host_name").fieldval(rule.host_name);$row.col("usr_name").fieldval(rule.usr_name);$row.col("password").fieldval(rule.pass);$row.col("period").fieldval(rule.period);}
this.$grid.resetAll();this.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(gridActionConverter(this.$grid));this.$grid.selection().removeRow();}}));}}
this.save=function(actions){if(actions.count){rootView.showModalOverlay();var query={remove:[],write:[]};for(var i=0;i<actions.deleted.length;i++){query.remove.push([somovdParams.CONFIG_ID_DSL_DDNS,this.ddns[actions.deleted[i]],actions.deleted[i]]);}
var temp=actions.changed.concat(actions.added);var r_temp=actions.r_changed.concat(actions.r_added);for(var i=0;i<temp.length;i++){var $row=this.$grid.row(temp[i]);query.write.push([somovdParams.CONFIG_ID_DSL_DDNS,{"host_name":$row.col("host_name").fieldval(),"usr_name":$row.col("usr_name").fieldval(),"pass":$row.col("password").fieldval(),"period":$row.col("period").fieldval()},$row.isNew()?-1:r_temp[i]]);}
device.config.multi(query,callback(this,function(data){this.update();}));}}
this.update=function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_DSL_DDNS,somovdParams.CONFIG_ID_WAN_IFACES_LIST,],callback(this,function(data){this.ddns=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident.ddns:null;this.ifacelist=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.iface_names:{};this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);}
extend(pageDDNS,node);function jsDefPassController(){jsDefPassController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsDefPassClientView};this.ifaceTypes.server={type:jsDefPassServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();this.addChild(new jsInputExController(),"hint");this.addChild(new jsInputExController(),"password");this.addChild(new jsInputExController(),"confirm");this.onupdaterq=function(){return true;}
this.onupdmodel=function(){return true;}
this.addEventHandler("updaterq",this.onupdaterq);this.addEventHandler("updmodel",this.onupdmodel);}
extend(jsDefPassController,jsWindowController);function jsDefPassClientView(ctrl,viewInx,options){var obj;obj=ctrl.getChild('hint');obj.nextIface='texter';obj.ifaceTypes.texter.options={humanName:'passwDesc'};obj=ctrl.getChild('password');obj.nextIface='inputer';obj.ifaceTypes.inputer.options={humanName:'passwPassword',passwd:true,maxLength:31};obj=ctrl.getChild('confirm');obj.nextIface='inputer';obj.ifaceTypes.inputer.options={humanName:'passwConfirm',passwd:true,maxLength:31};this.save=function(){var res=true;this.disableAction("button_conf_save");this.updateModel();var conf=this.getChild("confirm");var passw=this.getChild("password");var password=passw.ctrl.model.toString();var confirm=conf.ctrl.model.toString();var re=new RegExp("[А-яЁё]+","g");if(re.test(password)||re.test(confirm))
{conf.statusCode="passwConfirmCirill";passw.statusCode="passwConfirmCirill";res=false;}
if(password!=''){if(confirm!=password){conf.statusCode="passwConfirmMismatch";passw.statusCode="passwConfirmMismatch";res=false;}}
else{passw.statusCode="passwPasswordEmpty";res=false;}
if(res){this.ctrl.event("saverq");this.hide();}
else{this.bounce();this.enableAction("button_conf_save");}}
this.cancel=function(){this.hide();}
options.title='menu_system_passw';options.draggable=true;options.action=[{name:'button_save',func:this.save},{name:'dialogClose',func:this.cancel}];this.onendrequest=function(){this.enableAction("save");}
jsDefPassClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsDefPassClientView.superclass.drawView.call(this);$(this.viewBoxSel+' input').keypress(context(this).callback(function(event){if(event.which==13){this.save();}}));}
this.bind("endrequest",this.onendrequest);}
extend(jsDefPassClientView,jsWindowClientView);function jsDefPassServerView(ctrl,viewInx,options){jsDefPassServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){this.ctrl.event("endrequest");var data=this.options.sender.responseData;if(data&&!data.baddata){if(data.rq[0].status==somovdParams.RPC_INVALID_VALUES){alert(lng('passwInvalid'));}else{if(this.options.defpassw){document.location.href="index.cgi";}}}}
this.prepareData=function(){var obj;var ctrl=this.ctrl;obj={v2:"y",rq:2,res_json0:"y",res_data_type0:"json",res_config_action0:somovdParams.CONFIG_ACTION_EDIT,res_config_id0:somovdParams.CONFIG_ID_SET_PASS,res_struct_size0:1,res_cmd1:20,res_buf1:null,res_cmd_type1:"bl"};var login;login="admin";jsonOutObj={login:login,pass:ctrl.getChild("password").model.value};obj.res_buf0=$.toJSON(jsonOutObj);this.addToRequest(obj);}
this.onsaverq=function(){this.updateView();}
this.bind("saverq",this.onsaverq);}
extend(jsDefPassServerView,jsSSideView);function pageDeviceInfo(){pageDeviceInfo.superclass.constructor.call(this);this.info=null;this.add(new nodestatic("devInfoName"),"name")
.add(new nodestatic("devInfoVersion"),"version")
.add(new nodestatic("devInfoBuildTime"),"buildtime")
.add(new nodestatic("devInfoVendor"),"vendor")
.add(new nodestatic("devInfoBugs"),"bugs")
.add(new nodestatic("devInfoSummary"),"summary")
.add(new nodestatic("devInfoBoardId",'',{hidden:true}),"boardid");this.add(new nodestatic("devInfoSoftRev"),"softrev");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageDeviceInfo.superclass.updateView.apply(this,arguments);}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_GET_DEVICE_INFO,callback(this,function(data){this.deep.updateView();var info=this.info=(is.RPC_SUCCESS(data))?data.resident:null;if(info){info.fw_bugs=info.fw_bugs.replace('<','').replace('>','');this.child("name").val(info.fw_name);this.child("version").val("<a onclick=\"window.location.hash='#system/firmware';return false;\" href='#'>"+info.fw_version+"</a>");this.child("buildtime").val(info.fw_date);this.child("vendor").val(info.fw_vendor);this.child("bugs").val("<a href='mailto:"+info.fw_bugs+"'>"+info.fw_bugs+"</a>");this.child("summary").val(info.fw_summary);}
this.child("softrev").val(webadminParams.SOFT_REVISION);rootView.hideModalOverlay();}));});}
extend(pageDeviceInfo,node);$.extend(true,devu.iptv,new function(){this.pull=function(__success,__fail){devu.vlan.pull(__success,__fail);return this;};this.push=function(__success,__fail){devu.vlan.push(__success,__fail);return this;}
this.getPortMap=function(__vid){return this.getPortMapEx({vid:__vid});}
this.getPortMapEx=function(__options){var portMap=makeLanPortMap.call(this);var parr;var pwan=devu.vlan.getWanPorts()[0];if(__options.vid){var v=selectBridge(__options.vid,__options.name);if(v){parr=pickLanPorts.call(this,pickFitPorts(v.ports));_.each(parr,function(__p){portMap[__p]=true});}}
else{var wanu=devu.vlan.groupByType().wanu;if(wanu&&wanu.length){var v=_.find(wanu,function(__v){return _.find(__v.ports,function(__p){return __p==pwan})});if(v){parr=pickLanPorts.call(this,pickFitPorts(v.ports));_.each(parr,function(__p){portMap[__p]=true});}}}
return portMap;}
this.setPortMap=function(__portMap,__vid){return this.setPortMapEx(__portMap,{vid:__vid});}
this.setPortMapEx=function(__portMap,__options){var portArrSelected=splitPortMap(__portMap,function(__value,__key){return __value?__key:''});var portArrUnselected=splitPortMap(__portMap,function(__value,__key){return __value?'':__key});if(__options.vid){var portArrWanToLan=cutFromBridge(portArrUnselected,__options);cutFromLan(portArrSelected);addToLan(portArrWanToLan);addToBridge(portArrSelected,__options);}
else{var portArrWanToLan=cutFromWan(portArrUnselected);cutFromLan(portArrSelected);addToLan(portArrWanToLan);addToWan(portArrSelected,__options);}
return null;}
var pickFitPorts=function(__parr){return _.filter(__parr,function(__p){return __p.match(/port\d+/)?true:false});}
var pickLanPorts=function(__parr){return _.filter(__parr,function(__p){return!devu.vlan.isWan(__p)},this);}
var makeLanPortMap=function(){var pmap={};var parr=devu.vlan.PORTS.sort();_.each(parr,function(__value){if(__value.match(/port\d+/)&&!devu.vlan.isWan(__value)){pmap[__value]=false;}},this);return pmap;}
var splitPortMap=function(__portMap,__iter){return _.filter(_.map(__portMap,__iter),function(__p){return __p})};var cutFromWan=function(__parr){var wanu=devu.vlan.groupByType().wanu;var pos,v,parr=[];if(wanu){for(var i=0;i<wanu.length;i++){pos=wanu[i].pos;v=devu.vlan.cut(pos);parr=parr.concat(_.intersection(v.ports,__parr));v.ports=_.difference(v.ports,__parr);;devu.vlan.set(pos,v);}}
return parr;}
var cutFromLan=function(__parr){var pos=devu.vlan.groupByType().lan[0].pos;var pos,v;v=devu.vlan.cut(pos);v.ports=_.difference(v.ports,__parr);devu.vlan.set(pos,v);}
var addToLan=function(__parr){var pos=devu.vlan.groupByType().lan[0].pos;var pos,v;v=devu.vlan.cut(pos);v.ports=_.uniq(v.ports.concat(__parr));devu.vlan.set(pos,v);}
var addToWan=function(__parr,__options){var wanu=devu.vlan.groupByType().wanu;var pos,v;var pwan=devu.vlan.getWanPorts()[0];if(wanu&&wanu.length){pos=wanu[0].pos;v=devu.vlan.cut(pos);v.ports.push(pwan);v.ports=_.uniq(v.ports.concat(__parr));if(__options.name)v.name=__options.name;devu.vlan.set(pos,v);}
else{v={name:"wan_auto_"+gID.get(),type:"wanu",en:true,ports:_.uniq(__parr)}
v.ports.push(pwan);if(__options.name)v.name=__options.name;devu.vlan.add(v);}}
var cutFromBridge=function(__parr,__options){var parr=[];var v=selectBridge(__options.vid,__options.name);if(v){var pos=v.pos;v=devu.vlan.cut(pos);parr=parr.concat(_.intersection(v.ports,__parr));v.ports=_.difference(v.ports,__parr);;devu.vlan.set(pos,v);}
return parr;}
var addToBridge=function(__parr,__options){var pwan=devu.vlan.getWanPorts()[0];var v=selectBridge(__options.vid,__options.name);if(v){var pos=v.pos;v=devu.vlan.cut(pos);v.port=pwan;v.ports=_.uniq(v.ports.concat(__parr));if(__options)setOptions();devu.vlan.set(pos,v);}
else{v={name:"wan_auto_"+gID.get(),type:"bridge",en:true,port:pwan,ports:_.uniq(__parr)}
if(__options)setOptions();devu.vlan.add(v);}
function setOptions(){if(__options.name)v.name=__options.name;if(__options.qos)v.qos=__options.qos;if(__options.vid)v.vid=__options.vid;}}
var selectBridge=function(__vid,__name){var bridge=devu.vlan.groupByType().bridge;var v=null;if(bridge){v=_.find(bridge,function(__v){return __v.vid==__vid});if(!v&&__name)v=_.find(bridge,function(__v){return __v.name==__name});}
return v;}});iptv=devu.iptv;$.extend(true,devu.vlan,new function(){this.pull=function(__success,__fail){device.config.read([somovdParams.CONFIG_ID_GROUP_VLAN,somovdParams.CONFIG_ID_PORT_STATUS],callback(this,function(data){if(!is.RPC_SUCCESS(data)){if(is.func(__fail))__fail();return this;}
this.RAW_DATA=data.rq[0].resident;this.DATA=twfAll(this.RAW_DATA.vlans);this.PORTS=this.RAW_DATA.avail_ports;this.PORT_STATUS=data.rq[1].resident;this.IFACE_NAMES=data.rpcWAN.iface_names;this.resetAll();debug("vlan.pull: Data received");if(is.func(__success))__success();}));return this;};this.push=function(__success,__fail){var actions=this.commit();if(actions.write||actions.remove){device.config.multi(actions,callback(this,function(data){if(is.RPC_SUCCESS(data)){debug("vlan.push: Data sent");if(is.func(__success))__success();}
else{debug("vlan.push: Sending error");if(is.func(__fail))__fail();}}));}
else{debug("vlan.push: Nothing to push");if(is.func(__success))__success();}
return this;};this.commit=function(){var actions={}
var groups=this.status();var rpc=somovdParams.CONFIG_ID_GROUP_VLAN;var vlansRaw=this.RAW_DATA.vlans;var v;if(this.RAW_DATA.version>=1){if(groups.edited||groups.added||groups.removed){var vlansRawOut=[];var vlans=devu.vlan.show();var v,vraw,vrawOut;for(var i=0,j=0;i<vlans.length;i++){v=vlans[i];if(v.status!='removed'){vraw=vlansRaw[v.pos];if(vraw){vrawOut=$.extend(false,vraw,trfAny(v))}
else{vrawOut=$.extend(false,{},trfAny(v));}
vrawOut.pos=j++;vlansRawOut.push(vrawOut);}}
actions.write=[[rpc,{vlans:vlansRawOut}]];}}
else{if(groups.edited||groups.added){actions.write=[];if(groups.edited){for(var i=0;i<groups.edited.length;i++){v=groups.edited[i];actions.write.push([rpc,$.extend(false,vlansRaw[v.pos],trfAny(v)),v.pos])}}
if(groups.added){for(var i=0;i<groups.added.length;i++){v=groups.added[i];actions.write.push([rpc,trfAny(v),v.pos])}}}
if(groups.removed){actions.remove=[];for(var i=0;i<groups.removed.length;i++){v=groups.removed[i];actions.remove.push([rpc,{pos:v.pos},v.pos])}}}
return actions;};this.resetAll=function(){this.WORK_COPY=_deepClone(this.DATA);return this;};this.cut=function(inx){var vlan=this.WORK_COPY[inx];var vlanCopy=_deepClone(vlan);delete vlanCopy.status;delete vlanCopy.pos;vlan.status='removed';return vlanCopy;};this.set=function(inx,__v){var vold=this.WORK_COPY[inx];if(vold&&vold.status!='removed')return'vlanCutFirst';var v=_deepClone(__v);v.pos=inx;var error=valAny.call(this,v);if(!error)this.WORK_COPY[inx]=v;return error;};this.add=function(__v){return this.set(this.WORK_COPY.length,__v);};this.factory=function(){var wports=this.getWanPorts();var lports=this.getLanPorts();varr=this.show();for(var i=0;i<varr.length;i++){this.cut(i)};this.set(0,{en:true,name:'lan',ports:lports,type:'lan'});this.set(1,{en:true,name:'wan',ports:wports,type:'wanu'});return this;}
this.testTransforms=function(){var vbefore=this.RAW_DATA.vlans;var vafter=trfAll(twfAll(this.RAW_DATA.vlans));if(vbefore.length!=vafter.length)return false;for(var i=0;i<vbefore.length;i++){delete vafter[i].pos;vafter[i]=$.extend(true,{},vbefore[i],vafter[i]);}
return _.isEqual(vbefore,vafter);}
this.getFreePorts=function(__type){return _.difference(this.PORTS,pickPorts(this.WORK_COPY));}
this.getFreePortsU=function(__type){var parr=this.getFreePorts();return parr;}
this.getFreePortsT=function(__type){var parr=this.getAvailPorts();return parr;}
this.getWanPorts=function(){return _.filter(this.PORTS,function(__p){return devu.vlan.isWan(__p)});}
this.getLanPorts=function(){return _.filter(this.PORTS,function(__p){return!devu.vlan.isWan(__p)});}
this.getAvailPorts=function(){return _deepClone(this.PORTS);}
this.status=function(){if(!this.RAW_DATA.version){debug("vlan.status: The guaranteed safe actions for device.utils.vlan in a single push request is: 1 editing or 1 removing or several adding.");debug("vlan.status: Check for the status to avoid collisions!");}
return _.groupBy(this.WORK_COPY,callback(this,function(__v,inx){if(__v.pos>=this.DATA.length){return __v.status=='removed'?'refused':'added';}
else if(__v.status=='removed'){return __v.status;}
else if(!_.isEqual(__v,this.DATA[inx])){return'edited';}
return'unchanged';}));}
this.show=function(){return this.WORK_COPY;}
this.groupByType=function(){return _.groupBy(this.WORK_COPY,callback(this,function(__v){return __v.type;}));}
this.isWan=function(__p){return _.find(this.PORT_STATUS,function(__value,__key){return __key==__p&&__value.is_wan})?true:false;}
this.hasServices=function(__v){if(__v.ifname){var L2=this.IFACE_NAMES[__v.ifname];if(L2&&L2.is_wan&&L2.services)return L2.services;}
return null}
var twfWanT=function(__v){var v={name:__v.name,type:"want",vid:__v.vid,en:__v.en};var ports=__v.ports;for(var i in ports){v.port=i;v.qos=ports[i].qos;break;}
return v;};var twfWanU=function(__v){var v={name:__v.name,type:"wanu",en:__v.en,ports:[]};var ports=__v.ports;for(var i in ports){v.ports.push(i);}
return v;};var twfLan=function(__v){var v=twfWanU(__v);v.type="lan";return v;}
var twfBridge=function(__v){var v={name:__v.name,type:"bridge",vid:__v.vid,en:__v.en,ports:[]};var ports=__v.ports;for(var i in ports){if(ports[i].tag){v.port=i;v.qos=ports[i].qos;}
else{v.ports.push(i);}}
return v;};var twfAny=function(__v){var v;switch(__v.dest){case"wan":for(var i in __v.ports){if(__v.ports[i].tag)v=twfWanT(__v);else v=twfWanU(__v);}
break;case"bridge":v=twfBridge(__v);break;case"lan":v=twfLan(__v);break}
if(__v.ifname)v.ifname=__v.ifname;return v;};var twfAll=function(__arr){var arr=[],v;for(var i=0;i<__arr.length;i++){v=twfAny(__arr[i]);v.pos=i;if(v)arr.push(v);}
return arr;};var trfWanT=function(__v){var v={name:__v.name,dest:"wan",vid:__v.vid,en:__v.en,pos:__v.pos,not_delete:true,ports:{}};v.ports[__v.port]={tag:true,qos:__v.qos};return v;};var trfWanU=function(__v){var v={name:__v.name,dest:"wan",en:__v.en,pos:__v.pos,not_delete:true,ports:{}};for(var i=0;i<__v.ports.length;i++){v.ports[__v.ports[i]]={tag:false};};return v;};var trfLan=function(__v){var v=trfWanU(__v);delete v.not_delete;v.dest="lan";return v;}
var trfBridge=function(__v){var v={name:__v.name,dest:"bridge",vid:__v.vid,en:__v.en,pos:__v.pos,ports:{}};v.ports[__v.port]={tag:true,qos:__v.qos};for(var i=0;i<__v.ports.length;i++){v.ports[__v.ports[i]]={tag:false,qos:__v.qos};};return v;};var trfAny=function(__v){switch(__v.type){case"wanu":return trfWanU(__v);case"want":return trfWanT(__v);case"bridge":return trfBridge(__v);case"lan":return trfLan(__v);}
return null;};var trfAll=function(__arr){var arr=[],v;for(var i=0;i<__arr.length;i++){v=trfAny(__arr[i]);if(v)arr.push(v);}
return arr;};var pickPorts=function(__varr){var parr=[],ports,v;for(var i=0;i<__varr.length;i++){v=__varr[i];ports=v.ports;if(v.status=='removed'||!_.isArray(ports))continue;parr=parr.concat(ports);}
return _.uniq(parr);}
var isUniqVid=function(__vid,__varr){var v;for(var i=0;i<__varr.length;i++){v=__varr[i];if(v.status!='removed'&&v.vid==__vid)return false;}
return true;}
var isUniqName=function(__name,__varr){var v;for(var i=0;i<__varr.length;i++){v=__varr[i];if(v.status!='removed'&&v.name==__name)return false;}
return true;}
var valWanT=function(__v){var varr=this.WORK_COPY;if(!isUniqVid(__v.vid,varr))return'vlanVidBusy';if(!isUniqName(__v.name,varr))return'vlanNameBusy';return null}
var valWanU=function(__v){var varr=this.WORK_COPY;if(!isUniqName(__v.name,varr))return'vlanNameBusy';return null}
var valBridge=function(__v){var varr=this.WORK_COPY;if(!isUniqVid(__v.vid,varr))return'vlanVidBusy';if(!isUniqName(__v.name,varr))return'vlanNameBusy';return null}
var valLan=function(__v){var varr=this.WORK_COPY;if(!isUniqName(__v.name,varr))return'vlanNameBusy';return null}
var valAny=function(__v){var varr=this.WORK_COPY;var errorCode=null;switch(__v.type){case'want':errorCode=valWanT.call(this,__v);break;case'wanu':errorCode=valWanU.call(this,__v);break;case'bridge':errorCode=valBridge.call(this,__v);break;case'lan':errorCode=valLan.call(this,__v);break;default:errorCode='vlanUnknownType';}
return errorCode;}});vlan=devu.vlan;devu.wan.ipoe=new function(){this.ports=function(){var parr=_.map(wan.WORK_COPY.L2,function(__value,__key){if(((__value.type=="atm"&&__value.link_type=="MDMVS_EOA")||__value.type=="ethernet"||__value.type=="bridge")){return __key;}
else{return'';}});return _.reject(parr,function(__p){return!__p});};this.static={ports:this.ports,conflicts:function(__s){var nodeKey=__s.__L2__
if(devu.wan.isMultiMode(nodeKey))return[];var sarr=devu.wan.servicesFor(function(__value){return __value.__status__!='removed'&&__value.__L2__==nodeKey&&!__value.__L3__&&!__value.type.match(/ppp/)});return _.map(sarr,getInx);},template:function(){return copyObject({enable:true,nat:true,firewall:true,igmp:true,type:"ip"});}};this.dynamic={ports:this.ports,conflicts:function(__s){var nodeKey=__s.__L2__;var multimode=devu.wan.isMultiMode(nodeKey);if(multimode){var sarr=devu.wan.servicesFor(function(__value){return __value.__status__!='removed'&&__value.__L2__==nodeKey&&!__value.__L3__&&devu.wan.contype(__value)=='dynamic'});}
else{var sarr=devu.wan.servicesFor(function(__value){return __value.__status__!='removed'&&!__value.__L3__&&__value.__L2__==nodeKey&&!__value.type.match(/ppp/)});}
return _.map(sarr,getInx);},template:function(){return copyObject({enable:true,nat:true,firewall:true,type:"ip",dhcp:true,igmp:true,dns_from_dhcp:true});}};function getInx(__s){return __s.__inx__}}
devu.wan.byContype.static=devu.wan.ipoe.static;devu.wan.byContype.dynamic=devu.wan.ipoe.dynamic;$.extend(true,devu.wan,new function(){this.pull=function(__success,__fail){devc.read(somovdParams.CONFIG_ID_WAN_TEMP,callback(this,function(data){if(!is.RPC_SUCCESS(data)){if(is.func(__fail))__fail();return this;}
this.RAW_DATA=data.resident;this.DATA={L2:pickWanL2(this.RAW_DATA),services:pickWanServices(this.RAW_DATA)}
this.resetAll();debug('wan.pull: Data received');if(is.func(__success))__success();}));return this;};this.pullTest=function(__success){this.RAW_DATA=this.TEST_DATA;this.DATA={L2:pickWanL2(this.RAW_DATA),services:pickWanServices(this.RAW_DATA)}
this.resetAll();debug('wan.pullTest: Test data received');if(is.func(__success))__success();return this;}
this.push=function(__success,__fail){var actions=this.commit();if(actions.write||actions.remove){device.config.multi(actions,callback(this,function(data){if(is.RPC_SUCCESS(data)){debug("wan.push: Data sent");if(is.func(__success))__success();}
else{debug("wan.push: Sending error");if(is.func(__fail))__fail();}}));}
else{debug("wan.push: Nothing to push");if(is.func(__success))__success();}
return this;};this.cut=function(__inx){var service=this.WORK_COPY.services[__inx];var serviceCopy=copyObject(service);delete serviceCopy.__inx__;service.__status__='removed';return serviceCopy;};this.set=function(__inx,__service){var sold=this.WORK_COPY.services[__inx];if(sold&&sold.__status__!='removed')return'wanCutFirst';var s=copyObject(__service);if(!s.__ifname__)s.__ifname__='create';var specConditions=this.byContype[this.contype(__service)];if(specConditions)_.each(specConditions.conflicts(s),function(__value){this.cut(__value)},this);if(!s.name)s.name=this.generateName(s);s.__inx__=__inx;delete s.__status__;var error=valAny.call(this,s);if(!error)this.WORK_COPY.services[__inx]=s;return error;};this.status=function(){return _.groupBy(this.WORK_COPY.services,callback(this,function(__s,__inx){var services=this.DATA.services;if(__s.__ifname__=='create'){return __s.__status__=='removed'?'refused':'added';}
else if(__s.__status__=='removed'){return __s.__status__;}
else if(!_.isEqual(__s,services[__inx])){return'edited';}
return'unchanged';}));}
this.statusL2=function(){return _.groupBy(this.WORK_COPY.L2,callback(this,function(__value,__key){var old=this.DATA.L2[__key]
if(!old){return'added';}
else if(!_.isEqual(__value,old)){return'edited';}
return'unchanged';}));}
this.commit=function(){var actions={}
var groups=this.status();var rpc=somovdParams.CONFIG_ID_WAN_TEMP;var s;if(groups.edited||groups.added){actions.write=[];function addWriteAction(group){for(var i=0;i<group.length;i++){s=group[i];if(_.find(group,function(__s){return!s.__L3__&&__s.__L3__==s.__ifname__}))continue;actions.write.push([rpc,makeRawConnection.call(this,s)]);}}
if(groups.edited)addWriteAction.call(this,groups.edited);if(groups.added)addWriteAction.call(this,groups.added);}
if(groups.removed){actions.remove=[];var arr=[];for(var i=0;i<groups.removed.length;i++){s=groups.removed[i];arr.push(s.__ifname__);}
actions.remove.push([rpc,arr]);}
return actions;}
this.add=function(__service){return this.set(this.WORK_COPY.services.length,__service);};this.resetAll=function(){this.WORK_COPY=copyObject(this.DATA);return this;}
this.services=function(__nodeKey){if(__nodeKey){return this.servicesFor(function(__value){return __value.__L2__==__nodeKey});}
else{return this.WORK_COPY.services;}}
this.servicesBy=function(fieldName){return _.groupBy(this.services(),function(__value){return __value[fieldName]});}
this.servicesFor=function(__iter){return _.filter(this.WORK_COPY.services,__iter);}
this.L2=function(){return this.WORK_COPY.L2;}
this.contype=function(__service){var L2=this.WORK_COPY.L2[__service.__L2__];switch(__service.type){case'ppp':if(L2.type=='atm'){switch(L2.link_type){case'MDMVS_EOA':return'pppoe';case'MDMVS_PPPOA':return'pppoa';default:return'pppoe';}}
else if(L2.type=='ethernet'||L2.type=='ptm')return'pppoe';else if(L2.type=='3g')return'3g';break;case'pppv6':if((L2.type=='atm'&&L2.link_type=='MDMVS_EOA')||L2.type=='ethernet'||L2.type=='ptm')return'pppoev6';break;case'ip':if(L2.type=='atm'||L2.link_type=='MDMVS_IPOA')return'ipoa';if(L2.type=='lte')return'lte';if(__service.kabinet){if(__service.dhcp)return'dynkab';else return'statkab';}
if(__service.dhcp)return'dynamic';else return'static';break;case'ipv6':if(__service.dhcp)return'dynamicv6';else return'staticv6';break;case'pptp':case'l2tp':if(__service.useipv6)return __service.type+'v6';break;}
return __service.type;}
this.generateName=function(__service){if(__service.__L2__){var L2=this.L2()[__service.__L2__];}
else{var L3=this.servicesBy('__ifname__')[__service.__L3__][0];var L2=this.L2()[L3.__L2__];}
var L2Part=L2.port||L2.__ifname__;return this.contype(__service)+'_'+L2Part+'_'+this.WORK_COPY.services.length;}
this.TEST_DATA={iface_names:{atm0:{type:'atm',link_type:'MDMVS_EOA',enable:true,connection_mode:'VlanMuxMode',is_wan:true,pvc_settings:{portId:0,vpi:0,vci:350,qos:'ubr',pcr:null,scr:null,mbs:null,encap:'llc'},services:{ppp0:{enable:true,name:'pppoe_0_350_0',type:'ppp',servicename:'',username:'',password:'',mtu:1492,nat:true,firewall:true,igmp:false,rip:true,keep_alive:{interval:30,fails:3},gwif:true,connection_status:'ууу бля!!!',ondemand:0},ppp1:{enable:false,name:'pppoe_0_350_1',type:'ppp',servicename:'',username:'',password:'',mtu:1492,nat:true,firewall:true,igmp:false,rip:true,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0},ppp0_6:{enable:true,name:'pppoev6_0_350_0',type:'pppv6',servicename:'',username:'',password:'',mtu:1492,nat:true,firewall:true,igmp:false,rip:true,keep_alive:{interval:30,fails:3},gwif:true,connection_status:'ууу бля!!!',ondemand:0},ppp1_6:{enable:false,name:'pppoev6_0_350_1',type:'pppv6',servicename:'',username:'',password:'',mtu:1492,nat:true,firewall:true,igmp:false,rip:true,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0}}},atm1:{type:'atm',link_type:'MDMVS_PPPOA',enable:true,is_wan:true,pvc_settings:{portId:0,vpi:8,vci:35,qos:'ubr',pcr:null,scr:null,mbs:null,encap:'llc'},services:{ppp2:{enable:true,name:'pppoa_8_35_0',type:'ppp',servicename:'',username:'',password:'',mtu:1492,nat:true,firewall:true,igmp:false,rip:false,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0}}},br0:{type:'bridge',enable:true,members:['eth1.1','eth1.2','eth1.3'],services:{br0:{enable:true,dhcpd:{enable:true,relay:{ip:'10.10.10.10'},start_ip:'192.168.1.2',end_ip:'192.168.1.100',enablev6:true,radvd:true,modev6:'1',start_ipv6:'::ffff:10.10.10.10',end_ipv6:'::ffff:10.10.10.20',leasev6:60,reserved:[{hostname:'host1',ip:'192.168.1.10',mac:'11:22:33:44:55:66'},{hostname:'host2',ip:'192.168.1.12',mac:'11:22:33:44:55:77'}],lease:86401},name:'LAN Bridge',type:'ip',ip:'192.168.1.37',mask:'255.255.255.0',useipv6:true,ipv6:'::ffff:10.10.10.9/96'}}},'eth1.1':{type:'ethernet',enable:true,port:'LAN1'},'eth1.2':{type:'ethernet',enable:true,port:'LAN2'},'eth1.3':{type:'ethernet',enable:true,port:'LAN3'},br1:{enable:true,is_wan:true,type:'bridge',members:['eth2.1','eth2.3']},'eth2.1':{enable:true,is_wan:true,type:'ethernet'},'eth2.3':{enable:true,is_wan:true,type:'ethernet'},'usb0':{type:'3g',enable:true,port:'USB',is_wan:true,services:{ppp4:{enable:true,name:'mts',type:'ppp',username:'',password:'',mtu:1492,nat:true,firewall:true,igmp:false,rip:false,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0,apn:'internet.mts.ru',dial_num:'*99^'}}},'usb1':{type:'lte',enable:true,port:'USB1',is_wan:true,services:{wan_lte:{'name':'vlan2','dhcp':true,'enable':true,'metric':101,'type':'ip','ip':'192.168.62.248','mask':'255.255.255.0','gwip':'192.168.62.1','dns_prim':'192.168.62.2','dns_sec':'192.168.100.1'}}},'vlan2':{'enable':true,'type':'ethernet','is_wan':true,'mtu':1500,'mac':'11:22:33:44:55:ff','port':'VLAN2','connection_mode':'VlanMuxMode','services':{'vlan2':{'tunnels':{'pptp0':{'auto':true,'enable':true,'type':'pptp','servicename':'myservice.ru','username':'login','password':'pass','keep_alive':{'lcp_interval':30,'lcp_fails':3},'extra_options':'--pizdec_option','ip':'10.10.10.10','name':'PPTP0','gwif':true,'connection_status':'Connected','metric':10,nat:true,firewall:true,igmp:false,rip:false,useipv6:true},'l2tp0':{'auto':true,'enable':true,'type':'l2tp','servicename':'myservice.ru','username':'login','password':'pass','keep_alive':{'lcp_interval':30,'lcp_fails':3},'extra_options':'--pizdec_option','ip':'10.10.10.10','name':'PPTP0','gwif':true,'connection_status':'Connected','metric':10,nat:true,firewall:true,igmp:false,rip:false}},'name':'vlan2','dhcp':true,'enable':true,'metric':101,'type':'ip','ip':'192.168.62.248','mask':'255.255.255.0','gwip':'192.168.62.1','dns_prim':'192.168.62.2','dns_sec':'192.168.100.1'},vlan2_6:{name:'dynipv6_vlan2_0',enable:true,nat:true,firewall:true,type:'ipv6',ipv6:'a::b/64',gwipv6:'a::c',dhcp:false}}},'auto':{'type':'auto','is_wan':true,'services':{'auto':{'type':'auto','tunnels':{'pptp0':{'auto':true,'enable':true,'type':'pptp','servicename':'myservice.ru','username':'login','password':'pass','keep_alive':{'lcp_interval':30,'lcp_fails':3}}}}}},'eth2.2':{'enable':true,'type':'ptm','is_wan':true,'mtu':1500,'mac':'11:22:33:44:55:ff','port':'WAN1','connection_mode':'DefaultMode',services:{'ppp2.2':{enable:true,name:'pppoa_8_35_0',type:'ppp',servicename:'',username:'',password:'',mtu:1492,nat:true,firewall:true,igmp:false,rip:false,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0}}}}};this.isMultiMode=function(__nodeKey){var iface=devu.wan.WORK_COPY.L2[__nodeKey];var multimode=iface.connection_mode&&(iface.connection_mode=="VlanMuxMode"||iface.connection_mode=="MultipleServiceMode");return multimode;};function pickWanL2(data){var listL2={},obj;_.each(data.iface_names,function(__value,__key){function isInBridge(__k){return false;}
if(__value.is_wan&&!isInBridge(__key)){obj=listL2[__key]={};obj.__ifname__=__key;_.each(__value,function(__v,__k){if(__k!='services')obj[__k]=copyObject(__v);});}});return listL2;}
function pickWanServices(data){var servArr=[],obj,L3;_.each(data.iface_names,function(__node,__nodeKey){if(!__node.is_wan||!__node.services)return;_.each(__node.services,function(__service,__serviceKey){obj=justService(__service);obj.__ifname__=__serviceKey;obj.__L2__=__nodeKey;obj.__inx__=servArr.length;servArr.push(obj);L3=__serviceKey;if(__service.tunnels){_.each(__service.tunnels,function(__tunnel,__tunnelKey){obj=copyObject(__tunnel);obj.__ifname__=__tunnelKey;obj.__L2__=__nodeKey;obj.__L3__=L3;obj.__inx__=servArr.length;servArr.push(obj);});}});});return servArr;}
function justL2(__obj){obj={};_.each(__obj,function(__value,__key){if(__key!='services'&&!__key.match(/^__.+__$/)){obj[__key]=copyObject(__value);}});return obj;}
function justService(__obj){obj={};_.each(__obj,function(__value,__key){if(__key!='tunnels'&&!__key.match(/^__.+__$/)){obj[__key]=copyObject(__value);}});return obj;}
function isUniqName(__name){return this.servicesFor(function(__value){return __value.name==__name&&__value.__status__!='removed'}).length?false:true;}
function valAny(__service){return isUniqName.call(this,__service.name)?null:'wanNameBusy';}
function makeRawConnection(__service){if(__service.__L3__){var c=makeRawConnection.call(this,this.servicesBy('__ifname__')[__service.__L3__][0]);var s=justService(__service);var tunnels=_.values(_.values(c)[0].services)[0].tunnels={};tunnels[__service.__ifname__]=s;return c;}
else if(__service.__L2__){var L2=this.WORK_COPY.L2[__service.__L2__];var n=justL2(L2);var c={};c[L2.__ifname__]=n;var s=justService(__service);n.services={};n.services[__service.__ifname__]=s;return c;}}});wan=devu.wan;devu.wan.pppoe=new function(){this.ports=function(){var parr=_.map(wan.WORK_COPY.L2,function(__value,__key){if(((__value.type=="atm"&&__value.link_type=="MDMVS_EOA")||__value.type=="ethernet"||__value.type=="bridge")){return __key;}
else{return'';}});return _.reject(parr,function(__p){return!__p});};this.conflicts=function(){return[]};this.template=function(){return copyObject({enable:true,type:"ppp",servicename:"",username:"",password:"",mtu:1492,nat:true,firewall:true,igmp:false,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0});}}
devu.wan.byContype.pppoe=devu.wan.pppoe;devu.wan.vpn=new function(){var template={enable:true,auto:true,servicename:'',username:'',password:'',mtu:1456,nat:true,firewall:true,igmp:false,keep_alive:{interval:30,fails:3},ondemand:0}
function conflicts(__s){var sarr=devu.wan.servicesFor(function(__value){return __value.__status__!='removed'&&__value.__L3__==__s.__L3__});return _.map(sarr,getInx);}
function getInx(__s){return __s.__inx__}
this.l2tp={conflicts:conflicts,template:function(){return $.extend(true,template,{type:'l2tp'})}};this.pptp={conflicts:conflicts,template:function(){return $.extend(true,template,{type:'pptp'})}};}
devu.wan.byContype.pptp=devu.wan.vpn.pptp;devu.wan.byContype.l2tp=devu.wan.vpn.l2tp;$.extend(true,devu.wifi,new function(){this.pull=function(__success,__fail){devc.read(somovdParams.CONFIG_ID_WIFI,callback(this,function(data){if(!is.RPC_SUCCESS(data)){if(is.func(__fail))__fail();return this;}
this.DATA=data.resident;this.resetAll();debug('wifi.pull: Data received');if(is.func(__success))__success();}));return this;};this.push=function(__success,__fail){var actions=this.commit();if(actions.write||actions.remove){device.config.multi(actions,callback(this,function(data){if(is.RPC_SUCCESS(data)){debug("wan.push: Data sent");if(is.func(__success))__success();}
else{debug("wan.push: Sending error");if(is.func(__fail))__fail();}}));}
else{debug("wan.push: Nothing to push");if(is.func(__success))__success();}
return this;};this.getWorkCopy=function(){return this.WORK_COPY;}
this.changes=function(){return diffObj(this.DATA,this.getWorkCopy());}
this.commit=function(){var actions={}
var cs=this.changes();var wc=this.getWorkCopy();if(cs){actions.write=[];actions.write=actions.write.concat(commitBasic(cs,wc));actions.write=actions.write.concat(commitSecurity(cs,wc));}
return actions;}
this.resetAll=function(){this.WORK_COPY=copyObject(this.DATA);return this;}
var TBasic=this.TBasic={CountryCode:'RU',Channel:'auto',WirelessMode:'9',MaxStaNum:'0',HideSSID:false};var TBasicMBSSID=this.TBasicMBSSID={SSID:'DLINK-ROUTER'};var TOnOff=this.TOnOff={Radio:true,mbssidNum:1,mbssidCur:1};var TSecurity=this.TSecurity={AuthMode:'WPAPSKWPA2PSK',WPAPSK:'76543210',Key1Str:'',Key1Type:'1',Key2Str:'',Key2Type:'1',Key3Str:'',Key3Type:'1',Key4Str:'',Key4Type:'1',DefaultKeyID:'1',PreAuth:false,EncrypType:'TKIPAES'};var TSecurityRadius=this.TSecurityRadius={RADIUS_Server:'1.1.1.1',RADIUS_Port:'1812',RADIUS_Key:'dlink',RekeyInterval:'3600'};function commitBasic(cs,wc){var actions=[];if(_.isArray(cs.mbssid)&&_.without(cs.mbssid,null).length){var csMbssid=copyObject(cs.mbssid);var curInx=wc.mbssidCur-1;var jsonBasic=maskObj(wc,TBasic);if(csMbssid[curInx]&&!_.isEmpty(maskObj(csMbssid[curInx],TBasicMBSSID))){var json=copyObject(jsonBasic);json.mbssid=[maskObj(wc.mbssid[curInx],TBasicMBSSID)];actions.push([somovdParams.CONFIG_ID_WIFI,json]);delete csMbssid[curInx];}
if(_.without(csMbssid,null).length){_.each(csMbssid,function(__value,__inx){if(__value&&!_.isEmpty(maskObj(__value,TBasicMBSSID))){var jsonOnOff=maskObj(wc,TOnOff);jsonOnOff.mbssidCur=__inx+1;actions.push([somovdParams.CONFIG_ID_WIFI_ONOFF,jsonOnOff]);var json=copyObject(jsonBasic);json.mbssid=[maskObj(__value,TBasicMBSSID)];actions.push([somovdParams.CONFIG_ID_WIFI,json]);}});}
else if(!_.isEmpty(maskObj(cs,TOnOff))){actions.push([somovdParams.CONFIG_ID_WIFI_ONOFF,maskObj(wc,TOnOff)]);}}
else{if(!_.isEmpty(maskObj(cs,TBasic))){actions.push([somovdParams.CONFIG_ID_WIFI,maskObj(wc,TBasic)]);}
if(!_.isEmpty(maskObj(cs,TOnOff))){actions.push([somovdParams.CONFIG_ID_WIFI_ONOFF,maskObj(wc,TOnOff)]);}}
return actions;}
function commitSecurity(cs,wc){var actions=[];if(_.isArray(cs.mbssid)&&_.without(cs.mbssid,null).length){var csMbssid=copyObject(cs.mbssid);var curInx=wc.mbssidCur-1;var jsonBasic=maskObj(wc,TSecurityRadius);jsonBasic.mbssid=[];_.each(wc.mbssid,function(__value,__inx){jsonBasic.mbssid.push(maskObj(__value,TSecurity));});if(csMbssid[curInx]&&!_.isEmpty(maskObj(csMbssid[curInx],TSecurity))){actions.push([somovdParams.CONFIG_ID_WIFI_ADV,jsonBasic]);delete csMbssid[curInx];}
if(_.without(csMbssid,null).length){_.each(csMbssid,function(__value,__inx){if(__value&&!_.isEmpty(maskObj(__value,TSecurity))){var jsonOnOff=maskObj(wc,TOnOff);jsonOnOff.mbssidCur=__inx+1;actions.push([somovdParams.CONFIG_ID_WIFI_ONOFF,jsonOnOff]);actions.push([somovdParams.CONFIG_ID_WIFI_ADV,jsonBasic]);}});}}
return actions;}});wifi=devu.wifi;function jsDhcpServerModel(dhcpd){jsDhcpServerModel.superclass.constructor.call(this);this.dhcpd=dhcpd;}
extend(jsDhcpServerModel,jsModel);function jsDhcpServerController(dhcpd){jsDhcpServerController.superclass.constructor.call(this);this.initForm=function(){var dhcpd=this.model.dhcpd;if(dhcpd.enable&&!dhcpd.relay){this.getChild("mode").model.value="en";}
else if(dhcpd.enable&&dhcpd.relay){this.getChild("mode").model.value="relay";this.getChild("divRelay","ip").model.setParts(dhcpd.relay.ip);}
else{this.getChild("mode").model.value="dis";}
divMain.getChild("dnsRelay").model.value=dhcpd.dns_relay;divMain=this.getChild("divMain");divMain.getChild("begin").model.setParts(dhcpd.start_ip);divMain.getChild("end").model.setParts(dhcpd.end_ip);if(dhcpd.lease&&parseInt(dhcpd.lease,10)!="NaN"){divMain.getChild("lease").model.value=dhcpd.lease/60;}
divMain.getChild("gwip").model.setParts(dhcpd.gwip);divMain.getChild("dns_prim").model.setParts(dhcpd.dns_prim);divMain.getChild("dns_sec").model.setParts(dhcpd.dns_sec);var divIPv6=this.getChild("divIPv6");if(this.ipv6Support){divIPv6.getChild("ipv6Enable").model.value=dhcpd.enablev6;divIPv6.getChild("ipv6DHCP6PD").model.value=dhcpd.dhcp6_pd;if(dhcpd.enablev6){divIPv6.getChild("divIPv6Params","ipv6StateMode").model.value=dhcpd.modev6;divIPv6.getChild("divIPv6Params","begin").model.setParts(dhcpd.start_ipv6);divIPv6.getChild("divIPv6Params","end").model.setParts(dhcpd.end_ipv6);if(dhcpd.leasev6&&parseInt(dhcpd.leasev6,10)!="NaN"){divIPv6.getChild("divIPv6Params","lease").model.value=dhcpd.leasev6/60;}}}
else{divIPv6.getChild("ipv6Enable").model.value=false;}}
this.changeModel(new jsDhcpServerModel(dhcpd));this.ifaceTypes.client={type:jsDhcpServerClientView};this.ifaceTypes.client.options={nothing:true};this.addChild(new jsDecorController(),"desc");this.addChild(new jsInputController(),"mode");var divRelay=this.addChild(new jsFieldSetController(),"divRelay");divRelay.addChild(new jsIPv4Controller(),"ip");var divMain=this.addChild(new jsFieldSetController(),"divMain");divMain.addChild(new jsInputController(),"dnsRelay");divMain.addChild(new jsIPv4Controller(),"begin");divMain.addChild(new jsIPv4Controller(),"end");divMain.addChild(new jsIPv4Controller(),"gwip");divMain.addChild(new jsIPv4Controller(),"dns_prim");divMain.addChild(new jsIPv4Controller(),"dns_sec");divMain.addChild(new jsInputController(),"lease");var divIPv6=this.addChild(new jsFieldSetController(),"divIPv6");divIPv6.addChild(new jsDecorController(),"separatorIPv6");divIPv6.addChild(new jsInputController(),"ipv6Enable");divIPv6.addChild(new jsInputController(),"ipv6DHCP6PD");var divIPv6Params=divIPv6.addChild(new jsFieldSetController(),"divIPv6Params");divIPv6Params.addChild(new jsInputController(),"ipv6StateMode");divIPv6Params.addChild(new jsIPv6Controller(),"begin");divIPv6Params.addChild(new jsIPv6Controller(),"end");divIPv6Params.addChild(new jsInputController(),"lease");this.ipv6Support=true;this.initForm();}
extend(jsDhcpServerController,jsFieldSetController);function jsDhcpServerClientView(ctrl,viewInx,options){var obj;this.drawView=function(){jsDhcpServerClientView.superclass.drawView.call(this);this.ctrl.event("drawn");}
this.ondrawn=function(){this.adaptForm();return false;}
this.disableIPv6=function(){this.getChild("divIPv6","ipv6Enable").ctrl.model.value=false;this.getChild("divIPv6","ipv6Enable").updateView();this.getChild("divIPv6","divIPv6Params").hide();this.getChild("divIPv6").hide();}
this.enableIPv6=function(){this.getChild("divIPv6","ipv6Enable").ctrl.model.value=true;this.getChild("divIPv6","ipv6Enable").updateView();this.getChild("divIPv6","divIPv6Params").show();this.getChild("divIPv6").show();}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;this.getChild("mode").updateModel();this.adaptForm();switch(alias){case"ipv6Enable":if(obj.value){this.getChild("divIPv6").getChild("divIPv6Params").show();}
else{this.getChild("divIPv6").getChild("divIPv6Params").hide();}
break;case"ipv6StateMode":var divIPv6Params=this.getChild("divIPv6").getChild("divIPv6Params");if(obj.value=="1"){divIPv6Params.getChild("begin").show();divIPv6Params.getChild("end").show();}
else{divIPv6Params.getChild("begin").hide();divIPv6Params.getChild("end").hide();}
break;case"ipv6DHCP6PD":var divIPv6Params=this.getChild("divIPv6").getChild("divIPv6Params");if(obj.value){divIPv6Params.getChild("lease").disable();this.getParent().getChild("statip").getChild("ipv6").disable();}else{divIPv6Params.getChild("lease").enable();this.getParent().getChild("statip").getChild("ipv6").enable();}
break;}
return false;}
this.adaptForm=function(){switch(this.ctrl.getChild("mode").model.value){case"en":this.getChild("divRelay").hide();this.getChild("divMain").show();break;case"dis":this.getChild("divRelay").hide();this.getChild("divMain").hide();break
case"relay":this.getChild("divRelay").show();this.getChild("divMain").hide();break;}}
this.correctDHCP=function(ipref,maskref,div){var res=false;var ip;var mode;if(div&&div.ctrl.alias=="divIPv6Params"){mode=this.getChild("divIPv6","divIPv6Params","ipv6StateMode");if(!mode.updateModel()||mode.ctrl.model.toString()!="1"){return res;}}
else{mode=this.getChild("mode");if(!mode.updateModel()||mode.ctrl.model.toString()!="en"){return res;}}
if((ipref instanceof jsSubNetIPModel)){ip=new jsSubNetIPModel(ipref.bits,ipref.toString(),ipref.radix,ipref.delim,ipref.expandZero);}
if(maskref){var mask=new jsSubNetIPModel(maskref.bits,maskref.toString(),maskref.radix,maskref.delim,maskref.expandZero);var subnet=new jsSubNetIPModel(ipref.bits,ipref.toString(),ipref.radix,ipref.delim,ipref.expandZero);var startPartInx=null;var i;var n;var partMask=Math.pow(2,mask.partBitCount)-1;for(i=subnet.parts.length-1;i>=0;i--){subnet.parts[i]=ip.parts[i]&mask.parts[i];n=Math.log((partMask&~(mask.parts[i]))+1)/Math.LN2;if(n.toFixed(0)!=n){alert(lng("dhcpMaskHoleRidden"));return;}}}
else{var subnet=new jsSubNetIPModel(ipref.bits,ipref.toString(),ipref.radix,ipref.delim,ipref.expandZero);subnet.applyMask();var mask=new jsSubNetIPModel(ipref.bits,ipref.toString());var m=mask.getMaskParts();mask.parts=m;mask.bimask=mask.bits;var startPartInx=null;var partMask=Math.pow(2,mask.partBitCount)-1;}
var rangeStart=new jsSubNetIPModel(subnet.bits,subnet.toString(),subnet.radix,subnet.delim,subnet.expandZero);var rangeEnd=new jsSubNetIPModel(subnet.bits,subnet.toString(),subnet.radix,subnet.delim,subnet.expandZero);for(i in mask.parts){rangeEnd.parts[i]=(partMask&~(mask.parts[i]))|subnet.parts[i];if(no(startPartInx)&&(mask.parts[i]<partMask)){startPartInx=i;}}
rangeEnd.parts[rangeEnd.parts.length-1]--;rangeStart.parts[rangeStart.parts.length-1]++;if(rangeEnd.parts[rangeEnd.parts.length-1]>rangeStart.parts[rangeStart.parts.length-1]){var divMain=div?div:this.getChild("divMain");var begin=divMain.ctrl.getChild("begin").model;var end=divMain.ctrl.getChild("end").model;if((ip.parts[startPartInx]-rangeStart.parts[startPartInx])>(rangeEnd.parts[startPartInx]-ip.parts[startPartInx])){for(i in begin.parts){begin.parts[i]=rangeStart.parts[i];end.parts[i]=ip.parts[i];}
end.parts[ip.parts.length-1]--;}
else{for(i in begin.parts){begin.parts[i]=ip.parts[i];end.parts[i]=rangeEnd.parts[i];}
begin.parts[ip.parts.length-1]++;}
res=true;}
else{alert(lng("dhcpCorrectImpos"));}
return res;}
this.updateModel=function(){var res=jsDhcpServerClientView.superclass.updateModel.call(this);if(res){var dhcpd=this.ctrl.model.dhcpd;dhcpd.relay=null;dhcpd.start_ip=null;dhcpd.end_ip=null;dhcpd.lease=null;dhcpd.dnsRelay=null;var dhmode=this.getChild("mode").ctrl.model.value;dhcpd.enable=(dhmode=="en"||dhmode=="relay");if(dhmode=="relay"){dhcpd.relay={ip:this.getChild("divRelay","ip").ctrl.model.toString()};}
else if(dhmode=="en"){var dhcpdDivMain=this.getChild("divMain");dhcpd.start_ip=dhcpdDivMain.getChild("begin").ctrl.model.toString();dhcpd.end_ip=dhcpdDivMain.getChild("end").ctrl.model.toString();dhcpd.lease=dhcpdDivMain.getChild("lease").ctrl.model.value;if(dhcpd.lease){dhcpd.lease=dhcpd.lease*60;}
dhcpd.dns_relay=dhcpdDivMain.getChild("dnsRelay").ctrl.model.value;dhcpd.gwip=dhcpdDivMain.getChild("gwip").ctrl.model.toString();dhcpd.dns_prim=dhcpdDivMain.getChild("dns_prim").ctrl.model.toString();dhcpd.dns_sec=dhcpdDivMain.getChild("dns_sec").ctrl.model.toString();}
var divIPv6=this.getChild("divIPv6");dhcpd.radvd=null;dhcpd.enablev6=null;dhcpd.dhcp6_pd=null;dhcpd.modev6=null;dhcpd.start_ipv6=null;dhcpd.end_ipv6=null;dhcpd.leasev6=null;dhcpd.enablev6=divIPv6.getChild("ipv6Enable").ctrl.model.value;dhcpd.dhcp6_pd=divIPv6.getChild("ipv6DHCP6PD").ctrl.model.value;if(dhcpd.enablev6){var divIPv6Params=divIPv6.getChild("divIPv6Params");dhcpd.modev6=divIPv6Params.getChild("ipv6StateMode").ctrl.model.value;dhcpd.start_ipv6=divIPv6Params.getChild("begin").ctrl.model.toString(true);dhcpd.end_ipv6=divIPv6Params.getChild("end").ctrl.model.toString(true);dhcpd.leasev6=divIPv6Params.getChild("lease").ctrl.model.toString();if(dhcpd.leasev6){dhcpd.leasev6=dhcpd.leasev6*60;}}}
return res;}
this.blocks=ctrl.model.dhcpd.blocks;options.title=lng("dhcpMain");obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"dhcpMain"};if(this.blocks){obj.ifaceTypes.separator.options.hide=true;}
var modeList={};modeList["dhcpModeEn"]="en";modeList["dhcpModeDis"]="dis";modeList["dhcpModeRelay"]="relay";obj=ctrl.getChild("mode");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"dhcpMode",valset:modeList};if(this.blocks){obj.ifaceTypes.select.options.humanName="dhcpModeBlock";}
var divRelay=ctrl.getChild("divRelay");divRelay.nextIface="client";divRelay.ifaceTypes.client.options={nothing:true};obj=divRelay.getChild("ip");opt=obj.ifaceTypes.client.options;opt.humanName="dhcpExtIp";var divMain=ctrl.getChild("divMain");divMain.nextIface="client";divMain.ifaceTypes.client.options={nothing:true};obj=divMain.getChild("dnsRelay");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"dnsRelay",valset:{on:true,off:false}};obj=divMain.getChild("begin");opt=obj.ifaceTypes.client.options;opt.humanName="dhcpBegin";obj=divMain.getChild("end");opt=obj.ifaceTypes.client.options;opt.humanName="dhcpEnd";obj=divMain.getChild("gwip");opt=obj.ifaceTypes.client.options;opt.humanName="wanGwIp";opt.optional=true;opt.hide=true;obj=divMain.getChild("dns_prim");opt=obj.ifaceTypes.client.options;opt.humanName="wanPrimDns";opt.optional=true;opt.hide=true;obj=divMain.getChild("dns_sec");opt=obj.ifaceTypes.client.options;opt.humanName="wanSecDns";opt.optional=true;opt.hide=true;obj=divMain.getChild("lease");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"dhcpLease",minval:2};var divIPv6=ctrl.getChild("divIPv6");if(!ctrl.ipv6Support){divIPv6.ifaceTypes.client.options={hide:true};}
obj=divIPv6.getChild("separatorIPv6");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"dhcp_v6_separator"};obj=divIPv6.getChild("ipv6Enable");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"dhcp_v6_enable",valset:{on:true,off:false}};var dhcpv6_on=obj.model.value;obj=divIPv6.getChild("ipv6DHCP6PD");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"dhcp6_pd",valset:{on:true,off:false}};var divIPv6Params=divIPv6.getChild("divIPv6Params");divIPv6Params.nextIface="client";divIPv6Params.ifaceTypes.client.options={nothing:true,hide:!dhcpv6_on};obj=divIPv6Params.getChild("ipv6StateMode");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"dhcp_v6_statemode",valset:{"dhcp_v6_stateless":"0","dhcp_v6_statefull":"1"}};var statefull_checked=(obj.model.value=="1");obj=divIPv6Params.getChild("begin");opt=obj.ifaceTypes.client.options;opt.humanName="dhcp_v6_begin";opt.hide=!statefull_checked;obj=divIPv6Params.getChild("end");opt=obj.ifaceTypes.client.options;opt.humanName="dhcp_v6_end";opt.hide=!statefull_checked;obj=divIPv6Params.getChild("lease");obj.nextIface="number";obj.ifaceTypes.number.options={disabled:ctrl.model.dhcpd.dhcp6_pd,humanName:"dhcp_v6_lease",minval:0};jsDhcpServerClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("drawn",this.ondrawn);this.bind("fieldchange",this.onfieldchange);}
extend(jsDhcpServerClientView,jsFieldSetClientView);function jsDhcpServerMacModel(dhcpd,lanClients,dhcpClients){jsDhcpServerMacModel.superclass.constructor.call(this);this.dhcpd=dhcpd;this.lanClients=lanClients;this.dhcpClients=dhcpClients;}
extend(jsDhcpServerMacModel,jsModel);function jsDhcpServerMacController(dhcpd,lanClients,dhcpClients){jsDhcpServerMacController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsDhcpServerMacClientView};this.ifaceTypes.client.options={inputPadding:"200px",simple:true};this.changeModel(new jsDhcpServerMacModel(dhcpd,lanClients,dhcpClients));this.addChild(new jsDecorController(),"desc");this.addChild(new jsMACRuleController(),"clients");}
extend(jsDhcpServerMacController,jsFieldSetController);function jsDhcpServerMacClientView(ctrl,viewInx,options){this.onruleselect=function($obj){var $row=$grid.addRow().row("last");$row.col("ip").html($obj.col("ip").html());$row.col("mac").html($obj.col("mac").html());$row.col("host").html($obj.col("host").html())
.click();return false;}
this.drawView=function(){jsDhcpServerMacClientView.superclass.drawView.call(this);this.updateView();}
this.updateView=function(){var reserved=[];var dhcpd=this.ctrl.model.dhcpd;if(is.object(dhcpd)&&is.array(dhcpd.reserved)){reserved=dhcpd.reserved;}
var gridID=gID.get();$(this.options.childBoxSel).append("<div id='"+gridID+"' class='dhcpd' style='padding: 15px 0pt 15px 0px;'></div>");var header=[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}];$grid=$("#"+gridID).lightUIGrid(header,reserved.length,{selectable:true});$grid.colEditable("ip","ipv4",{mandatory:true});$grid.colEditable("mac","mac");$grid.colEditable("host","host");$grid.bind("selection.grid",context(this).callback(this.updateRuleButtons));$grid.bind("stopEditing.grid",context(this).callback(this.updateRuleButtons));$grid.bind("startEditing.grid",context(this).callback(function(){this.disableButton("delRule");this.disableButton("addRule");}));this.disableButton("delRule");var $row;var obj;for(var i=0;i<reserved.length;i++){obj=reserved[i];$row=$grid.row(i);$row.col("ip").html(obj.ip);$row.col("mac").html(obj.mac);$row.col("host").html(obj.host);}}
this.updateModel=function(){this.statusCode=null;var res=jsDhcpServerMacClientView.superclass.updateModel.call(this);if(res){res=this.checkRule();var dhcpd=this.ctrl.model.dhcpd;if(res&&is.object(dhcpd)){dhcpd.reserved=[];var $row;var obj;for(var i=0;i<$grid.nrow();i++){obj={};$row=$grid.row(i);obj.ip=$row.col("ip").html();obj.mac=$row.col("mac").html();obj.host=$row.col("host").html();dhcpd.reserved.push(obj);}}}
return res;}
this.updateRuleButtons=function(){if($grid.selection().length){this.enableButton("delRule");}
else{this.disableButton("delRule");}
this.enableButton("addRule");}
this.checkRule=function(){var $row;var $ip;var $mac;var $host;for(var i=0;i<$grid.nrow();i++){$row=$grid.row(i);$ip=$row.col("ip");$mac=$row.col("mac");$host=$row.col("host");if($ip.html()==""){this.statusCode="dhcpMacHasEmpty";alert(lng(this.statusCode));$ip.click();return false;}
else if($mac.html()==""&&$host.html()==""){this.statusCode="dhcpMacHasEmpty";alert(lng(this.statusCode));$mac.click();return false;}}
this.statusCode=null;return true;}
this.addRule=function(){if(!this.checkRule()){return;}
$grid.addRow()
.row("last")
.col("ip")
.click();}
this.delRule=function(){$grid.selection().remove();this.updateRuleButtons();var obj=this.getChild("clients","field");obj.lastValue="blank";if(obj.$input){obj.$input.val("blank");}}
options.buttonsInline=true;options.buttons=[{name:"delRule",value:"dhcpMacDelRule",handler:this.delRule},{name:"addRule",value:"dhcpMacAddRule",handler:this.addRule}];var $grid;var obj;this.ctrl=ctrl;obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"dhcpMac"};obj=ctrl.getChild("clients");obj.nextIface="client";obj.ifaceTypes.client.options={humanName:"dhcpMacClients"};obj.LANClients=$.extend(true,{},ctrl.model.dhcpClients);var dhcpClients=ctrl.model.dhcpClients;jsDhcpServerMacClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("ruleselect",this.onruleselect);}
extend(jsDhcpServerMacClientView,jsFieldSetClientView);function jsDHCPOptPageController(){jsDHCPOptPageController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsDHCPOptPageClientView,options:{nothing:true}};this.ifaceTypes.server={type:jsDHCPOptPageServerView,options:{action:"index.cgi",plainIface:true}};this.addChild(new jsController(),"dhopt");this.ondataready=function(){this.changeChild(this.getChild("dhopt").thisInx,new jsDHCPOptMgrController(this.iftree.br0.services.br0.dhcpd.DHCPConditionalServingPool),"dhopt");return false;}
this.iftree=null;this.onceauth=false;this.nextIface="server";this.addIface();this.addEventHandler("dataready",this.ondataready);}
extend(jsDHCPOptPageController,jsController);function jsDHCPOptPageClientView(ctrl,viewInx,options){jsDHCPOptPageClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.onautherror=function(){this.getChild("passwd").authError();return false;}
this.ondataready=function(){this.getChild("passwd").hide();this.constructor(this.ctrl,this.viewInx,this.options?this.options:{});this.drawView();return false;}
this.save=function(){this.updateModel();this.ctrl.event("saverq");}
options.buttons=[{name:"save",value:"button_save",handler:this.save}];this.bind("dataready",this.ondataready);this.bind("autherror",this.onautherror);}
extend(jsDHCPOptPageClientView,jsFieldSetClientView);function jsDHCPOptPageServerView(ctrl,viewInx,options){jsDHCPOptPageServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;this.ctrl.iftree={};if(data){if(!data.baddata&&data.resident&&data.resident.iface_names){this.ctrl.iftree=data.resident.iface_names;if(!this.ctrl.iftree)this.ctrl.iftree={};}}
if(this.mode&&this.mode!="update"){this.ctrl.event("updaterq");}
else{if(data.status==somovdParams.RPC_PERMISSION_DENIED){this.ctrl.event("autherror");}
else{this.ctrl.event("dataready");}}}
this.prepareData=function(){var obj;var ctrl=this.ctrl;switch(this.mode){case"save":var obj=this.requestObj;obj.res_config_action=3;obj.res_pos=0;var jsonOutObj={br0:ctrl.iftree.br0};obj.res_buf=$.toJSON(jsonOutObj);obj.res_buf=obj.res_buf.replace(/%/g,"%25");obj.res_buf=obj.res_buf.replace(/#/g,"%23");obj.res_buf=obj.res_buf.replace(/&/g,"%26");this.addToRequest(obj);break;case"update":var obj=this.requestObj;obj.res_config_action=1;this.addToRequest(obj);break;}}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.onupdaterq=function(){this.mode="update";this.updateView();return false;}
this.bind("updaterq",this.onupdaterq);this.mode="update";this.requestObj={v2:"y",rq:"y",res_json:"y",res_config_id:somovdParams.CONFIG_ID_WAN2_TEMP,res_struct_size:36};this.bind("saverq",this.onsaverq);}
extend(jsDHCPOptPageServerView,jsSSideView);function jsDHCPOptMgrController(json){jsDHCPOptMgrController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsDHCPOptMgrView,options:{slider:true,title:"Опции DHCP",nocollapse:true}};this.addChild(new jsRootVendorController(json),"root");}
extend(jsDHCPOptMgrController,jsController);function jsDHCPOptMgrView(ctrl,viewInx,options){var leftSideID="left"+getUID();var rightSideID="right"+getUID();ctrl.getChild("root").nextIface="tree";options.formViewSel="#"+rightSideID;jsDHCPOptMgrView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){var htmlToDraw="<div class='dhcpopt'>";htmlToDraw+="<div class='leftside' id='"+leftSideID+"'></div>";htmlToDraw+="<div class='rightside' id='"+rightSideID+"'></div>";htmlToDraw+="<div class='bottom'></div></div>";var options=this.options;$(options.viewBoxSel).html(htmlToDraw);options.myBoxSel=options.viewBoxSel;var root=this.getChild("root");root.options.viewBoxSel="#"+leftSideID;root.viewBoxSel="#"+leftSideID;options.childBoxSel=root.options.viewBoxSel;jsDHCPOptMgrView.superclass.drawView.call(this);}}
extend(jsDHCPOptMgrView,jsCSideView);function jsRootVendorController(json){jsRootVendorController.superclass.constructor.call(this);this.ifaceTypes.tree={type:jsRootVendorTreeView,options:{noPath:true}};this.buildTree=function(){var vclassid;for(var i in this.json){vclassid=this.json[i].VendorClassID;if(!no(vclassid)){this.addChild(new jsVendorClassController(this.json[i]),vclassid);}}
this.addChild(new jsVendorClassController($.extend(true,{},classTemplate)));}
this.onaddclass=function(obj){delete obj.isNew;this.maxInstance++;this.json[this.maxInstance]=obj;this.getChild(this.children.length-1).json=this.json[this.maxInstance];this.activateToBottom=false;this.addChild(new jsVendorClassController($.extend(true,{},classTemplate)));return false;}
this.maxInstance=json.max_instance;delete json.max_instance;this.json=json;var classTemplate={isNew:true,Enable:true,DHCPOption:{max_instance:0}};this.activateToBottom=false;this.buildTree();this.addEventHandler("addclass",this.onaddclass);}
extend(jsRootVendorController,jsController);function jsRootVendorTreeView(ctrl,viewInx,options){for(var i in ctrl.children){ctrl.getChild(i).nextIface="tree";}
jsRootVendorTreeView.superclass.constructor.call(this,ctrl,viewInx,options);this.onaddclass=function(){var child=this.ctrl.getChild(this.ctrl.children.length-1);child.nextIface="tree";child.changeIface(this.viewInx,this,this.options);this.drawView();return false;}
this.updateModel=function(){jsRootVendorTreeView.superclass.updateModel.call(this);var ctrl=this.ctrl
var json=ctrl.json;for(var i in json){if(json[i].isNew||json[i].deleted){delete json[i];}}
json.max_instance=this.ctrl.maxInstance;return true;}
this.bind("addclass",this.onaddclass);}
extend(jsRootVendorTreeView,jsViewTree);function jsVendorClassController(json){jsVendorClassController.superclass.constructor.call(this);this.ifaceTypes.tree={type:jsVendorClassTreeView,options:{}};this.ifaceTypes.list={type:jsVendorClassListView,options:{plainIface:true}};this.buildTree=function(){for(var i in this.json.DHCPOption){this.addChild(new jsDHCPOptController(this.json.DHCPOption[i]));}
this.addChild(new jsDHCPOptController($.extend(true,{},optTemplate)));}
this.onaddopt=function(obj){delete obj.isNew;this.maxInstance++;this.json.DHCPOption[this.maxInstance]=obj;this.getChild(this.children.length-1).json=this.json.DHCPOption[this.maxInstance];this.addChild(new jsDHCPOptController($.extend(true,{},optTemplate)));return false;}
if(!json){json={max_instance:0};}
this.maxInstance=json.DHCPOption.max_instance;delete json.DHCPOption.max_instance;this.json=json;var optTemplate={isNew:true,Enable:true};this.buildTree();this.addEventHandler("addopt",this.onaddopt);}
extend(jsVendorClassController,jsController);function jsVendorClassTreeView(ctrl,viewInx,options){for(var i in ctrl.children){ctrl.getChild(i).nextIface="tree";}
jsVendorClassTreeView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=this.updateView=function(){if(this.ctrl.json.isNew){this.getChild(0).setOption("hide",true);}
jsVendorClassTreeView.superclass.drawView.call(this);var htmlToDraw;if(this.ctrl.json.isNew){htmlToDraw=lng("dhoptAddNewClass");}
else{htmlToDraw=this.ctrl.json.VendorClassID;}
$(this.myBoxSel).html(htmlToDraw);if(this.ctrl.json.isNew){$(this.viewBoxSel).addClass("folder_new");}
else if(this.ctrl.active){$(this.viewBoxSel).addClass("folder_open");}
else{$(this.viewBoxSel).addClass("folder_close");}}
this.onblurjq=function(event){var id=$(event.target).val();if(id!=""){var json=this.ctrl.json;delete json.isNew
json.VendorClassID=id;this.ctrl.event("addclass",json,true);this.getChild(0).show();}
else{this.getChild(0).setOption("hide",true);this.drawView();}}
this.onactivate=function(){if(this.ctrl.json.isNew){var htmlToDraw="<input value='' type='text'/>";$(this.myBoxSel).html(htmlToDraw);var $input=$(this.myBoxSel+">input");$input.focus();$input.blur(context(this).callback(this.onblurjq));$input.keypress(context(this).callback(this.onkeypressjq));if($.browser.msie||$.browser.webkit){$input.keydown(context(this).callback(this.onkeypressjq));}}
this.ctrl.nextIface="list";this.ctrl.ifaceTypes.list.options.viewBoxSel=this.options.formViewSel
this.ctrl.addIface();this.ctrl.event("drawlist");if(!this.ctrl.json.isNew){$(this.viewBoxSel).addClass("folder_open");$(this.viewBoxSel).removeClass("folder_close");}
this.onrevdel();return jsVendorClassTreeView.superclass.onactivate.call(this);}
this.ondeactivate=function(){$(this.viewBoxSel).addClass("folder_close");$(this.viewBoxSel).removeClass("folder_open");this.onrevdel();return jsVendorClassTreeView.superclass.ondeactivate.call(this);}
this.onaddopt=function(){var child=this.ctrl.getChild(this.ctrl.children.length-1);child.nextIface="tree";child.changeIface(this.viewInx,this,this.options);this.drawView();return false;}
this.onkeypressjq=function(event){if(event.keyCode==13){$(event.target).blur();}
else if(event.keyCode==27){$(event.target).val("");$(event.target).blur();}
return true;}
this.updateModel=function(){var ctrl=this.ctrl
var json=ctrl.json;for(var i in json.DHCPOption){if(json.DHCPOption[i].isNew||json.DHCPOption[i].deleted){delete json.DHCPOption[i];}}
json.DHCPOption.max_instance=this.ctrl.maxInstance;return true;}
this.onrevdel=function(){if(this.ctrl.json.deleted){$(this.viewBoxSel).removeClass("folder_open");$(this.viewBoxSel).removeClass("folder_close");$(this.viewBoxSel).addClass("folder_deleted");}
else{$(this.viewBoxSel).removeClass("folder_deleted");if(this.ctrl.active){$(this.viewBoxSel).addClass("folder_open");}
else{$(this.viewBoxSel).addClass("folder_close");}}
return false;}
this.bind("activate",this.onactivate);this.bind("deactivate",this.ondeactivate);this.bind("addopt",this.onaddopt);this.bind("revdel",this.onrevdel);}
extend(jsVendorClassTreeView,jsViewTree);function jsVendorClassListView(ctrl,viewInx,options){for(var i in ctrl.children){ctrl.getChild(i).nextIface="list";}
jsVendorClassListView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=this.updateView=function(){jsVendorClassListView.superclass.drawView.call(this);var ownerView=$(this.options.viewBoxSel).attr("ownerView");if(ownerView&&ownerView!="list")return;var children=this.ctrl.children;htmlToDraw="";var json;htmlToDraw="<table class='gridTable'>";htmlToDraw+=drawHeader();var j=1;var trSel;var odd=1;for(var i in children){json=children[i].json;if(!json.isNew){htmlToDraw+="<tr class='gridRow"+odd+"'>"
+"<td>"+json.Tag+"</td>"
+"<td>"+json.Value+"</td>"
+"<td><input type='checkbox' ";htmlToDraw+=json.Enable?"checked":"";htmlToDraw+="/></td>"
+"<td><input type='checkbox' ";htmlToDraw+=json.deleted?"checked":"";htmlToDraw+="/></td>"
+"</tr>";trSel=this.options.viewBoxSel+" tr:eq("+j+")";$(trSel).live("click",{childInx:i},context(this).callback(this.onrowclickjq));$(trSel+" td:eq(2) input").live("change",{childInx:i},context(this).callback(this.onchangeenablejq));$(trSel+" td:eq(3) input").live("change",{childInx:i},context(this).callback(this.onchangedeletedjq));j++;}
odd=odd%2;odd++;}
htmlToDraw+="</table>";$(this.options.viewBoxSel+" .fieldSetGeneral").html(htmlToDraw);$(".dhcpopt .buttonsInline").addClass("buttonsVendorClass");$(".dhcpopt .buttonsInline").removeClass("buttonsInline");this.buttonBarSel=".dhcpopt .buttonsVendorClass";this.changeState();}
this.onrowclickjq=function(event){var patt=/(input|INPUT)/;if(!patt.test(event.target.tagName)){this.ctrl.getChild(event.data.childInx).activate();}}
this.onchangeenablejq=function(event){this.ctrl.getChild(event.data.childInx).json.Enable=$(event.target).attr("checked");}
this.onchangedeletedjq=function(event){var child=this.ctrl.getChild(event.data.childInx);child.json.deleted=$(event.target).attr("checked");child.event("updateview");}
this.onaddopt=function(){var child=this.ctrl.getChild(this.ctrl.children.length-1);child.nextIface="list";child.changeIface(this.viewInx,this,this.options);return false;}
var drawHeader=function(){var htmlToDraw="<tr class='gridHeader'>"
+"<td>"+lng("dhoptTag")+"</td>"
+"<td>"+lng("dhoptValue")+"</td>"
+"<td>"+lng("dhoptEnable")+"</td>"
+"<td>"+lng("dhoptDelete")+"</td>"
+"</tr>";return htmlToDraw;}
this.ondrawlist=function(){$(this.options.viewBoxSel).attr("ownerView","list");this.drawView();return false;}
this.del=function(){this.ctrl.json.deleted=true;this.changeState();}
this.revert=function(){this.ctrl.json.deleted=false;this.changeState();}
this.disable=function(){this.ctrl.json.Enable=false;this.changeState();}
this.enable=function(){this.ctrl.json.Enable=true;this.changeState();}
this.changeState=function(){if(this.ctrl.json.deleted){this.options.buttons[0]={name:"revert",value:"button_revert",handler:this.revert};this.ctrl.event("revdel");}
else{this.options.buttons[0]={name:"del",value:"button_del",handler:this.del};this.ctrl.event("revdel");}
$(this.buttonBarSel).html(this.drawButtons());if(this.ctrl.json.Enable){this.options.buttons[1]={name:"disable",value:"button_disable",handler:this.disable};$(this.buttonBarSel).html(this.drawButtons());}
else{this.options.buttons[1]={name:"enable",value:"button_enable",handler:this.enable};$(this.buttonBarSel).html(this.drawButtons());}}
options.buttonsInline=true;options.buttons=[];this.options=options;this.bind("drawlist",this.ondrawlist);this.bind("addopt",this.onaddopt);}
extend(jsVendorClassListView,jsFieldSetClientView);function jsDHCPOptController(json){jsDHCPOptController.superclass.constructor.call(this);this.ifaceTypes.tree={type:jsDHCPOptIconView,options:{plainIface:true}};this.ifaceTypes.form={type:jsDHCPOptFormView,options:{inputPadding:"100px"}};this.describe([{name:"dhoptEnable",type:"checkbox",alias:"enable"},{name:"dhoptTag",type:"number",alias:"tag"},{name:"dhoptValue",type:"input",alias:"value"}]);this.json=json;}
extend(jsDHCPOptController,jsController);function jsDHCPOptIconView(ctrl,viewInx,options){jsDHCPOptIconView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsDHCPOptIconView.superclass.drawView.call(this);this.updateView();}
this.updateView=function(){var htmlToDraw="";if(this.ctrl.json.isNew){htmlToDraw+=lng("dhoptAddNewOpt");}
else{htmlToDraw+=this.ctrl.json.Tag;}
$(this.myBoxSel).html(htmlToDraw);if(this.ctrl.json.isNew){$(this.viewBoxSel).addClass("file_new");}
else if(this.ctrl.json.deleted){$(this.viewBoxSel).addClass("file_deleted");}
else{$(this.viewBoxSel).addClass("file");$(this.viewBoxSel).removeClass("file_deleted");}}
this.onactivate=function(){if(!formCreated){this.ctrl.nextIface="form";this.ctrl.ifaceTypes.form.options.viewBoxSel=this.options.formViewSel
this.ctrl.addIface();formCreated=true;}
this.ctrl.event("drawform");return jsDHCPOptIconView.superclass.onactivate.call(this);}
var formCreated=false;this.bind("activate",this.onactivate);this.bind("updateview",this.updateView);}
extend(jsDHCPOptIconView,jsViewTree);function jsDHCPOptFormView(ctrl,viewInx,options){jsDHCPOptFormView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=this.updateView=function(){var ownerView=$(this.options.viewBoxSel).attr("ownerView");if(ownerView&&ownerView!="form")return;this.options.buttonsInline=true;if(this.ctrl.json.isNew){this.options.buttons=[{name:"save",value:"button_save",handler:save}];}
else{this.options.buttons=[{name:"del",value:"button_del",handler:del},{name:"revert",value:"button_revert",handler:revert}];}
var enable=this.getChild("enable");var tag=this.getChild("tag");var value=this.getChild("value");var json=this.ctrl.json;enable.ctrl.model.value=json.Enable;tag.ctrl.model.value=json.Tag;value.ctrl.model.value=json.Value;jsDHCPOptFormView.superclass.drawView.call(this);if(this.ctrl.json.deleted){enable.disable();tag.disable();value.disable();if(!json.isNew){this.disableButton("del");this.enableButton("revert");}}
else{enable.enable();tag.enable();value.enable();if(!json.isNew){this.enableButton("del");this.disableButton("revert");}}}
this.updateModel=function(){var res=jsDHCPOptFormView.superclass.updateModel.call(this);if(res){var json=this.ctrl.json;json.Enable=this.getChild("enable").ctrl.model.value;json.Tag=this.getChild("tag").ctrl.model.value;json.Value=this.getChild("value").ctrl.model.value;}
return res;}
var del=function(){this.ctrl.json.deleted=true;this.ctrl.event("updateview");}
var save=function(){var res=this.updateModel();if(res){var ctrl=this.ctrl;ctrl.event("addopt",ctrl.json,true);}}
var revert=function(){delete this.ctrl.json.deleted;this.ctrl.event("updateview");}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;var json=this.ctrl.json;if(obj.view.updateModel()){var val=obj.view.ctrl.model.value;switch(alias){case"enable":json.Enable=val;break;case"tag":json.Tag=val;break;case"value":json.Value=val;break;}}
return false;}
this.ondrawform=function(){$(this.options.viewBoxSel).attr("ownerView","form");this.drawView();return false;}
this.bind("drawform",this.ondrawform);this.bind("updateview",this.updateView);this.bind("fieldchange",this.onfieldchange);this.boxBusy=true;}
extend(jsDHCPOptFormView,jsFieldSetClientView);function jsDialogSetController(){jsDialogSetController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsWindowClientView};this.ifaceTypes.server={type:jsSSideView};}
extend(jsDialogSetController,jsFieldSetController);function jsDinIPSettingsModel(service){jsDinIPSettingsModel.superclass.constructor.call(this);this.service=service;}
extend(jsDinIPSettingsModel,jsModel);function jsDinIPSettingsController(service,isadding){jsDinIPSettingsController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsDinIPSettingsClientView};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsDinIPSettingsSummaryView};this.ifaceTypes.summary.options={};this.changeModel(new jsDinIPSettingsModel(service));this.addChild(new jsDecorController(),"desc");this.addChild(new jsInputController(service.dns_from_dhcp),"dnsFromDhcp");var divDhcp=this.addChild(new jsFieldSetController(),"divDhcp");divDhcp.addChild(new jsIPv4Controller(service.dns_prim),"primaryDns");divDhcp.addChild(new jsIPv4Controller(service.dns_sec),"secondaryDns");var advanced=this.addChild(new jsFieldSetController(),"advanced");advanced.addChild(new jsInputController(service.vendor_id),"vendorID");advanced.addChild(new jsInputController(service.hostname),"hostname");}
extend(jsDinIPSettingsController,jsFieldSetController);function jsDinIPSettingsClientView(ctrl,viewInx,options){var obj;var service=ctrl.model.service;this.saveIP=function(v6){var postfix="";var box=this;var service={};var advanced=this.getChild("advanced");if(v6){postfix="v6";box=advanced.getChild("ipv6box","divIPv6");service["gwip"+postfix]=box.getChild("gwip").ctrl.model.toString();}
else{service["vendor_id"]=box.getChild("advanced","vendorID").ctrl.model.value;service["hostname"]=box.getChild("advanced","hostname").ctrl.model.value;}
service["dns_from_dhcp"+postfix]=box.getChild("dnsFromDhcp").ctrl.model.value;if(!service["dns_from_dhcp"+postfix]){var divDhcp=box.getChild("divDhcp");service["dns_prim"+postfix]=divDhcp.getChild("primaryDns").ctrl.model.toString();service["dns_sec"+postfix]=divDhcp.getChild("secondaryDns").ctrl.model.toString();}
return service;}
this.updateModel=function(){var res=jsDinIPSettingsClientView.superclass.updateModel.call(this);if(res){var service=this.ctrl.model.service;service.type="ip"
$.extend(true,service,this.saveIP(false));}
return res;}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;var advanced=this.getChild("advanced");switch(alias){case"dnsFromDhcp":if(obj.view.ctrl.parent.alias=="divIPv6"){var divIPv6=advanced.getChild("ipv6box","divIPv6");var divDhcp=divIPv6.getChild("divDhcp");}
else{var divDhcp=this.getChild("divDhcp");}
if(obj.value){divDhcp.hide();}
else{divDhcp.show();}
break;}
return false;}
this.onmodeswitch=function(value){if(this.options.brief){this.getChild("desc").hide();this.getChild("advanced").hide();}
else{this.getChild("desc").show();this.getChild("advanced").show();}
return false;}
this.drawView=function(){jsDinIPSettingsClientView.superclass.drawView.call(this);this.onmodeswitch();}
obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"IP"};obj.ifaceTypes.separator.options.hide=service.blocks;obj=ctrl.getChild("dnsFromDhcp");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanDnsFromDhcp",valset:{on:true,off:false}};dnsFromDhcp=obj.model.value;obj.ifaceTypes.checkbox.options.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_DYNIP_DNS_FROM_DHCP);var divDhcp=ctrl.getChild("divDhcp");divDhcp.nextIface="client";divDhcp.ifaceTypes.client.options={nothing:true};divDhcp.ifaceTypes.client.options.hide=dnsFromDhcp;obj=divDhcp.getChild("primaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanPrimDns";opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_DYNIP_PRIM_DNS);obj=divDhcp.getChild("secondaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanSecDns";opt.optional=true;opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_DYNIP_SEC_DNS);var advanced=ctrl.getChild("advanced");advanced.nextIface="client";obj=advanced.getChild("vendorID");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanVendorID",optional:true};obj=advanced.getChild("hostname");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"statDhcpHost",optional:true};opt=obj.ifaceTypes.input.options;opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_DYNIP_VENDOR_ID);jsDinIPSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("fieldchange",this.onfieldchange);this.bind("modeswitch",this.onmodeswitch);}
extend(jsDinIPSettingsClientView,jsFieldSetClientView);function jsDinIPSettingsSummaryView(ctrl,viewInx,options){jsDinIPSettingsSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){var advanced=this.getChild("advanced");advanced.options.slider=false;advanced.getChild("vendorID").options.hide=true;advanced.getChild("hostname").options.hide=true;jsDinIPSettingsSummaryView.superclass.drawView.call(this);}
this.updateView=function(){jsDinIPSettingsSummaryView.superclass.updateView.call(this);var vendorID=this.getChild("advanced","vendorID");if(vendorID.ctrl.modified)vendorID.show();var hostname=this.getChild("advanced","hostname");if(hostname.ctrl.modified)hostname.show();}
this.bind("modeswitch",function(){return false;});}
extend(jsDinIPSettingsSummaryView,jsDinIPSettingsClientView);function jsDinIPv6SettingsModel(service){jsDinIPv6SettingsModel.superclass.constructor.call(this);this.service=service;}
extend(jsDinIPv6SettingsModel,jsModel);function jsDinIPv6SettingsController(service,isadding){jsDinIPv6SettingsController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsDinIPv6SettingsClientView};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsDinIPv6SettingsClientView};this.ifaceTypes.summary.options={};this.changeModel(new jsDinIPv6SettingsModel(service));var ipv6_by="dhcpv6";if(service.ipv6_by_slaac){ipv6_by="slaac";}
else if(service.ipv6_by_dhcpv6_pd){ipv6_by="dhcpv6_pd";}
else if(service.ipv6_auto){ipv6_by="ipv6auto";}
this.addChild(new jsDecorController(),"desc");this.addChild(new jsInputController(ipv6_by),"ipv6_by");this.addChild(new jsInputController(service.slaac),"slaac");this.addChild(new jsIPv6Controller(service.gwipv6),"gwip");this.addChild(new jsInputController(is.set(service.dns_from_dhcpv6)?service.dns_from_dhcpv6:true),"dnsFromDhcp");var divDhcp=this.addChild(new jsFieldSetController(),"divDhcp");divDhcp.addChild(new jsIPv6Controller(service.dns_primv6),"primaryDns");divDhcp.addChild(new jsIPv6Controller(service.dns_secv6),"secondaryDns");}
extend(jsDinIPv6SettingsController,jsFieldSetController);function jsDinIPv6SettingsClientView(ctrl,viewInx,options){var obj;var service=ctrl.model.service;this.updateModel=function(){var res=jsDinIPv6SettingsClientView.superclass.updateModel.call(this);if(res){var divDhcp=this.getChild("divDhcp");var service=this.ctrl.model.service;service.slaac=this.getChild("slaac").ctrl.model.value;service.gwipv6=this.getChild("gwip").ctrl.model.toString();service.dns_primv6=divDhcp.getChild("primaryDns").ctrl.model.toString();service.dns_secv6=divDhcp.getChild("secondaryDns").ctrl.model.toString();service.dns_from_dhcpv6=this.getChild("dnsFromDhcp").ctrl.model.value;var ipv6_by=this.getChild("ipv6_by").ctrl.model.toString();if(ipv6_by=="ipv6auto"){service.ipv6_auto=true;service.ipv6_by_slaac=false;service.ipv6_by_dhcpv6=false;service.ipv6_by_dhcpv6_pd=false;}
else if(ipv6_by=="slaac"){service.ipv6_by_slaac=true;service.ipv6_by_dhcpv6=false;service.ipv6_by_dhcpv6_pd=false;service.ipv6_auto=false;}
else if(ipv6_by=="dhcpv6_pd"){service.ipv6_by_slaac=false;service.ipv6_by_dhcpv6=false;service.ipv6_by_dhcpv6_pd=true;service.ipv6_auto=false;}else{service.ipv6_by_slaac=false;service.ipv6_by_dhcpv6=true;service.ipv6_by_dhcpv6_pd=false;service.ipv6_auto=false;}}
return res;}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;switch(alias){case"slaac":var gwip=this.getChild("gwip");if(obj.value){gwip.clearMandatory();gwip.setOption("optional",true);gwip.disable();}
else{gwip.setMandatory();gwip.setOption("optional",false);gwip.enable();}
break;case"dnsFromDhcp":var divDhcp=this.getChild("divDhcp");if(obj.value){divDhcp.getChild("primaryDns").disable();divDhcp.getChild("secondaryDns").disable();}
else{divDhcp.getChild("primaryDns").enable();divDhcp.getChild("secondaryDns").enable();}
break;}
return false;}
this.onmodeswitch=function(value){var divDhcp=this.getChild("divDhcp");if(this.options.brief){this.getChild("desc").hide();this.getChild("slaac").hide();divDhcp.getChild("primaryDns").hide();divDhcp.getChild("secondaryDns").hide();}
else{this.getChild("desc").show();this.getChild("slaac").show();divDhcp.getChild("primaryDns").show();divDhcp.getChild("secondaryDns").show();}
return false;}
this.drawView=function(){jsDinIPSettingsClientView.superclass.drawView.call(this);this.onmodeswitch();}
obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"IP"};obj.ifaceTypes.separator.options.hide=service.blocks;obj=ctrl.getChild("ipv6_by");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"wanIpv6By",valset:{wanIpv6ByDhcpv6:"dhcpv6",wanIpv6BySlaac:"slaac",wanIpv6ByDhcpv6PD:"dhcpv6_pd",wanIpv6auto:"ipv6auto"}};obj.ifaceTypes.select.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_AUTH);obj=ctrl.getChild("slaac");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanIPv6GwBySlaac",valset:{on:true,off:false},hide:!service.is_wan||(service.blocks&&!webadminParams.BLOCK_WAN_DYNIPV6_GWIP)};var slaac=obj.model.value;obj=ctrl.getChild("gwip");opt=obj.ifaceTypes.client.options;opt.humanName="wanStatGwIpv6";opt.disabled=slaac;opt.optional=slaac;opt.hide=!service.is_wan||(service.blocks&&!webadminParams.BLOCK_WAN_DYNIPV6_GWIP);obj=ctrl.getChild("dnsFromDhcp");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanDnsFromDhcp",valset:{on:true,off:false}};dnsFromDhcp=obj.model.value;obj.ifaceTypes.checkbox.options.disabled|=(service.blocks&&!webadminParams.BLOCK_WAN_DYNIP_DNS_FROM_DHCP);var divDhcp=ctrl.getChild("divDhcp");divDhcp.nextIface="client";divDhcp.ifaceTypes.client.options={nothing:true};divDhcp.ifaceTypes.client.options.disabled=dnsFromDhcp;obj=divDhcp.getChild("primaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanStatPrimIPv6Dns";opt.optional=true;opt.disabled=!service.is_wan||(service.blocks&&!webadminParams.BLOCK_WAN_DYNIPV6_PRIM_DNS);obj=divDhcp.getChild("secondaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanStatSecIPv6Dns";opt.optional=true;opt.disabled=!service.is_wan||(service.blocks&&!webadminParams.BLOCK_WAN_DYNIPV6_SEC_DNS);jsDinIPv6SettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("fieldchange",this.onfieldchange);this.bind("modeswitch",this.onmodeswitch);}
extend(jsDinIPv6SettingsClientView,jsFieldSetClientView);var refreshId;function validate_domain_name(host){var pat=/^[a-z0-9][a-z0-9-]*$/;var labels=host.split(".");for(var i=0;i<labels.length;i++){if(!pat.test(labels[i]))
return false;}
return true;}
function validate_host(n){return validate_ip_address(n)||validate_domain_name(n);}
function validate_ip_address(ip_address){var address=ip_address.match("^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$");var digits;var i;if(address==null){return false;}else{digits=address[0].split(".");for(i=0;i<4;i++){if((Number(digits[i])>255)||(Number(digits[i])<0)||(Number(digits[0])>223)){return false;}}}
return true;}
function validate_mac_address(mac_address){var address=mac_address.match("^[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}:[0-9a-fA-F]{1,2}$");var digits;var i;if(address==null){return false;}
return true;}
function validate_ip_port(ip_port){var port=ip_port.match("^[0-9]{1,5}$");if(port==null){return false;}else{if((Number(port)>65535)||(Number(port)<1)){return false;}}
return true;}
function validate_ip_port_range(ports){result=true;if(ports){ranges=ports.split(",");if(ranges.length){for(i=0;i<ranges.length;i++){range=ranges[i].split(":");if(range){if(range.length==2){left=verifyInteger2(range[0]);right=verifyInteger2(range[1]);if(left&&right&&validate_ip_port(new String(range[0]))&&validate_ip_port(new String(range[1]))){if(parseInt(left)>=parseInt(right)){result=false;}}
else{result=false;}}
else{if(range.length==1){port=verifyInteger2(range);if(!port||!validate_ip_port(new String(range))){result=false;}}
else{result=false;}}}
else{result=false;}
if(!result)break;}}
else{result=false;}}
else{result=false;}
return result;}
function validate_mask(ip_mask){var mask=ip_mask.match("^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$");if(mask==null){return false;}else{mask=new String(mask);mask_array=mask.split('.');bmask=sprintf("0x%.2x%.2x%.2x%.2x",parseInt(mask_array[0],10),parseInt(mask_array[1],10),parseInt(mask_array[2],10),parseInt(mask_array[3],10));n=Math.log(~bmask+1)/Math.LN2;if(n.toFixed(0)!=n)return false;}
return true;}
function verifyInteger2(input_str){var pattern;var str;pattern=/^\s*(\d+)\s*$/g;str=new String(input_str);return str.match(pattern);}
function setCookie(name,value,expires,measure){var today;today=new Date();if(expires){switch(measure){case"min":expires=expires*1000*60;break;case"hour":expires=expires*1000*3600;break;default:expires=expires*1000*3600*24;}}
document.cookie=name+'='+escape(value)+((expires)?';expires='+new Date(today.getTime()+expires).toGMTString():'');}
function deleteCookie(name){setCookie(name,'',-30);}
function deleteAllCookies(){var cookies=document.cookie.split(";");for(var i in cookies){deleteCookie($.trim(cookies[i].split("=")[0]));}}
function getCookie(name){if(document.cookie.length>0){c_start=document.cookie.indexOf(name+"=");if(c_start!=-1){c_start=c_start+name.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1){c_end=document.cookie.length;}
return unescape(document.cookie.substring(c_start,c_end));}}
return"";}
function validate_net_addr(addr){check_res=false;if(addr){strings=addr.split("/");if(strings.length==2){if(validate_ip_address(strings[0])){bits=verifyInteger2(strings[1]);if(bits&&(bits<=32)&&(bits>0)){check_res=true;}
else{if(validate_mask(strings[1])){check_res=true;}}}}}
return check_res;}
function validate_password(password){words=password.split(" ");if(words&&words.length==1&&words[0]!=""){return true;}
return false;}
function modal_overlay(){var innerHeightsize=0;if(typeof(window.innerHeight)=='number'){innerHeightsize=window.innerHeight;}
else{if(document.documentElement&&document.documentElement.clientHeight){innerHeightsize=document.documentElement.clientHeight;}
else{if(document.body&&document.body.clientHeight){innerHeightsize=document.body.clientHeight;}}}
if(document.body.clientHeight>innerHeightsize)
document.getElementById("uiOverlayModal").style.height=document.body.clientHeight+"px";else
document.getElementById("uiOverlayModal").style.height=innerHeightsize+"px";document.getElementById("uiOverlayModal").style['display']="";}
function goto_page(url,noajax){if(url=="")
return;if(noajax){if(window.SAVEME)SAVEME.lock();document.location.href=url;if(window.SAVEME)SAVEME.unlock();}
else{$("#uiContentBody").load(url,"xml_http_request=yes",onPageLoad);}}
function getObjectLength(obj){var objLength=0;for(var i in obj)objLength++;return objLength;}
function getObjectFirstChild(obj){var child=null;for(var i in obj){child=obj[i];break;}
return child;}
function getObjectFirstKey(obj){var key=null;for(var i in obj){key=i;break;}
return key;}
function calcMaskByBits(bits){var bitsBinary=[];var res;for(var i=0;i<32;i++){bitsBinary[i]=0;}
for(var i=0;i<bits;i++){bitsBinary[i]=1;}
var firstPeace=0;var secondPeace=0;var thirdPeace=0;var fourPeace=0;for(var i=7;i>=0;i--){firstPeace+=bitsBinary[i]*(Math.pow(2,7-i));}
for(var i=15;i>=8;i--){secondPeace+=bitsBinary[i]*(Math.pow(2,(15-i)));}
for(var i=23;i>=16;i--){thirdPeace+=bitsBinary[i]*(Math.pow(2,(23-i)));}
for(var i=31;i>=24;i--){fourPeace+=bitsBinary[i]*(Math.pow(2,(31-i)));}
res=firstPeace+'.'+secondPeace+'.'+thirdPeace+'.'+fourPeace;return res;}
function calcBitsByMask(mask){var res=0;var firstPeace;var secondPeace;var thirdPeace;var fourPeace;if(no(mask))return res;maskSpl=mask.split(".");firstPeace=maskSpl[0];secondPeace=maskSpl[1];thirdPeace=maskSpl[2];fourPeace=maskSpl[3];num=parseInt(firstPeace);firstPeace=num.toString(2);num=parseInt(secondPeace);secondPeace=num.toString(2);num=parseInt(thirdPeace);thirdPeace=num.toString(2);num=parseInt(fourPeace);fourPeace=num.toString(2);var maskBinary=firstPeace+''+secondPeace+''+thirdPeace+''+fourPeace;for(var i in maskBinary){if(maskBinary[i]==1)res+=1;}
return res;}
function getKeyCode(evt){var code;try{code=event.keyCode;}
catch(e){try{if(evt==undefined){throw"error";}
code=evt.which;}
catch(e){code=-1;}}
return code;}
function controlCSS(cssURL,styleID,action){var styleElem="head>style#"+styleID;switch(action){case"add":if(!$(styleElem).html()){$.get(cssURL,function(data){var style=document.createElement('style');style.type='text/css';style.id=styleID;if(style.styleSheet)
style.styleSheet.cssText=data;else
style.appendChild(document.createTextNode(data));$("head")[0].appendChild(style);});}
break;case"del":if($(styleElem).html()){$(styleElem).remove();}
break;}}
function clearJSON(obj){var patt=/^__.*__$/;for(var i in obj){if(patt.test(i)||obj[i]==undefined){delete obj[i];}
else if(obj[i]instanceof Object&&!(obj[i]instanceof Array)&&!(obj[i]instanceof Boolean)&&!(obj[i]instanceof Date)&&!(obj[i]instanceof Number)&&!(obj[i]instanceof String)&&!(obj[i]instanceof RegExp)){clearJSON(obj[i]);}}}
function ISO8601Date(dateTime){if(is.string(dateTime)){if(dateTime.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/g)){return new Date(dateTime.substr(0,4),dateTime.substr(5,2)-1,dateTime.substr(8,2),dateTime.substr(11,2),dateTime.substr(14,2),dateTime.substr(17,2));}}
return null;}
function getConnArray(tree){var ifnode;var srvnode;var tnlnode;var arr=[];for(var i in tree){ifnode=tree[i];ifnode.ifname=i;if(ifnode.services){for(var j in ifnode.services){srvnode=ifnode.services[j];srvnode.L2=ifnode;srvnode.ifname=j;if(srvnode.type!="auto"){arr.push(srvnode);}
if(srvnode.tunnels){for(var k in srvnode.tunnels){tnlnode=srvnode.tunnels[k];tnlnode.L3=srvnode;tnlnode.L2=ifnode;tnlnode.ifname=k;arr.push(tnlnode);}}}}}
return arr;}
function getWanConn(tree,ipv6){var ipv6=is.set(ipv6)?ipv6:false;var ifnode;var srvnode;var tnlnode;var arrCandidates=[];for(var i in tree){ifnode=tree[i];if(ifnode.is_wan&&ifnode.services&&getObjectLength(ifnode.services)>0){for(var j in ifnode.services){srvnode=ifnode.services[j];if(srvnode['gwif'+(ipv6?'v6':'')]){srvnode.L2=ifnode;srvnode.ifname=i;srvnode.srvname=j;if(!srvnode.metric){srvnode.metric=1;srvnode.delMetric=true;}
arrCandidates.push(srvnode);}
if(srvnode.tunnels&&getObjectLength(srvnode.tunnels)>0){for(var k in srvnode.tunnels){tnlnode=srvnode.tunnels[k];if(tnlnode['gwif'+(ipv6?'v6':'')]){tnlnode.L3=srvnode;tnlnode.L2=ifnode;tnlnode.ifname=i;tnlnode.srvname=j;tnlnode.tnlname=k;if(!tnlnode.metric){tnlnode.metric=srvnode.metric-1;tnlnode.delMetric=true;}
arrCandidates.push(tnlnode);}}}}}}
var metric=100500;var candidate;var wanConn=null;for(var i=0;i<arrCandidates.length;i++){candidate=arrCandidates[i];if(candidate.metric&&candidate.metric<=metric){metric=candidate.metric;if(candidate.delMetric){delete candidate.delMetric;delete candidate.metric;}
wanConn=candidate;}}
return wanConn;}
is.RPC_SUCCESS=function(__res){function success(__r){if(!__r)return true;return __r.status==somovdParams.RPC_OK||__r.status==somovdParams.RPC_NEED_SAVE||__r.status==somovdParams.RPC_NEED_REBOOT;}
if(is.number(__res)||is.string(__res)){return success({status:__res});}
else{if(__res.rq){return _.all(__res.rq,success);}
else{return success(__res);}}}
is.RPC_PERMISSION_DENIED=function(response){if(response.status==somovdParams.RPC_PERMISSION_DENIED||!response.auth){return true;}
else{return false;}}
var DRAGGER=new function(){var self=this;var $$={list:new Array(),drag:null};this.add=function(obj){if(is.jquery(obj)){for(var i=0;i<obj.length;i++){if(indexOf($$.list,obj.get(i))==-1){$$.list.push(obj.get(i));}}}
return this;}
this.remove=function(obj){if(is.jquery(obj)){for(var i=0;i<obj.length;i++){var index=indexOf($$.list,obj.get(i));if(index>=0){$$.list.splice(index,1);}}}
return this;}
$(document).bind('mousedown.dragger',callback(this,function(e){if(e.isPropagationStopped()){return true;}
for(var i=0;i<$$.list.length;i++){if($$.list[i]==e.target||$($$.list[i]).has(e.target).length){var target=$($$.list[i]);var tPos=target.offset();var pPos=target.parent().offset();$$.drag={index:i,target:target,offsetX:pPos.left+e.pageX-tPos.left,offsetY:pPos.top+e.pageY-tPos.top,cursor:$('body').css('cursor')};$('body').css({'cursor':target.css('cursor')});target.trigger('down.dragger',{event:e.originalEvent,left:$$.drag.offsetX,top:$$.drag.offsetY});return false;}}})).bind('mouseup.dragger',callback(this,function(e){if($$.drag){$('body').css({'cursor':$$.drag.cursor});$$.drag.target.trigger('up.dragger',{event:e.originalEvent,left:e.pageX-$$.drag.offsetX,top:e.pageY-$$.drag.offsetY});$$.drag=null;return false;}})).bind('mousemove.dragger',callback(this,function(e){if($$.drag){$$.drag.target.trigger('move.dragger',{event:e.originalEvent,left:e.pageX-$$.drag.offsetX,top:e.pageY-$$.drag.offsetY});return false;}})).bind('mouseleave',function(){$(document).trigger('mouseup');});};function GLOBAL_VAR(name){return function(value){window[name]=value;}}
device.filter(function(url,type,data,cb){window.hasChanges=null;return true;});function modeAP(){return window.menu_postfix=="_ap";}
function copyObject(obj){if(is.array(obj)){return $.extend(true,[],obj);}
else if(is.object(obj)){return $.extend(true,{},obj);}
return obj;}
function httpIntercept(page){var hostname=document.location.hostname;var hash=window.location.hash.slice(1);if(!window.rpcWAN){debug('rpcWAN is not set!')}
if(hostname=="dlink-router"||hostname=="127.0.0.1"||hash=="skip-intercept"){console.log('skip-intercept');return;}
try{if(window.rpcWAN){var arr=getConnArray(window.rpcWAN.iface_names);var ret=false;var testDefaultConfOnly=false;for(var i=0;i<arr.length;i++){if(arr[i].ip==hostname)ret=true;if(arr[i].ipv6&&arr[i].ipv6.split('/')[0]==hostname)ret=true
if(arr[i].alias_ipv6&&arr[i].alias_ipv6.split('/')[0]==hostname)ret=true}
if(ret){testDefaultConfOnly=true;}
var lanIp=_.find(arr,function(value){return value.ifname=="br0"}).ip
device.config.read([somovdParams.CONFIG_ID_PORT_STATUS,somovdParams.CONFIG_ID_WAN_STATUS],callback(this,function(data){if(data.rq){if(data.defaultConf==20){document.location.href="http://"+lanIp+"/"+(page||"intercept.html")+'#'+document.location.href;return;}
if(testDefaultConfOnly){return;}
var ports=data.rq[0].resident;for(var p in ports){if(ports[p].is_wan){if(!ports[p].status){document.location.href='http://'+lanIp+'/error.html#error=cable&initial='+document.location.href;return;}
break;}}
if(data.rq[1].resident){var wan_status=data.rq[1].resident.wan_status;if(wan_status==2){document.location.href='http://'+lanIp+'/error.html#error=wan2&initial='+document.location.href;return;}else if(wan_status==1){document.location.href='http://'+lanIp+'/error.html#error=ppp4&initial='+document.location.href;return;}}else{}}}));}}
catch(e){debug("httpIntercept() exception:");debug(e.message);}}
function ttnetRedirect(){httpIntercept("user.html");}
function maskObj(__obj,__mask){var obj=_.clone(__obj);var objKeys=_.keys(obj),maskKeys=_.keys(__mask);if(_.isArray(obj))obj=obj.slice(0,__mask.length);else _.each(_.difference(objKeys,maskKeys),function(__key){delete obj[__key]});_.each(_.intersection(objKeys,maskKeys),function(__key){var m=__mask[__key];var o=obj[__key];if((is('Object',m)&&is('Object',o))||(is('Array',m)&&is('Array',o)))obj[__key]=maskObj(o,m)});return obj;}
function diffObj(__obj1,__obj2){if(_.isEqual(__obj1,__obj2))return;function compare(d,isArray){var karr=_.union(_.keys(__obj1),_.keys(__obj2));_.each(karr,function(__key){var __value=diffObj(__obj1[__key],__obj2[__key]);if(isArray)d[__key]=_.isUndefined(__value)?null:__value;else if(!_.isUndefined(__value))d[__key]=__value;});return d;}
if(is('Object',__obj1)&&is('Object',__obj2))return compare({});else if(is('Array',__obj1)&&is('Array',__obj2))return compare([],true);else return copyObject(__obj2);}
function _deepClone(__obj){var obj=_.clone(__obj);var o;for(var i in obj){o=obj[i];if(_.isObject(o))obj[i]=_deepClone(o);}
return obj;}
function makeValidJSONString(text){return text.replace(/[\\"]/g,"\\$&");}
function pageDMZ(){pageDMZ.superclass.constructor.call(this);this.dmz=null;this.lanClients=new Array();this.add(new nodeCaption("dmzLabel"))
.add(new nodeCheckBox("enable",false),"enable")
.add(new nodeComboIP("ip_address",'',{header:[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}],index:'ip',mandatory:true,disabled:true}),"ip");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageDMZ.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(this.child("enable").val(),this.child("ip").val());}}));}
if(phase=="back"){var ip=this.child("ip").cleanRows();for(var i=0;i<this.lanClients.length;i++){ip.addRow(this.lanClients[i].ip,this.lanClients[i].mac,this.lanClients[i].hostname);}}}
this.dmz_on_off=function(val){if(val)this.child('ip').enable();else this.child('ip').disable();}
this.save=function(enable,ip){rootView.showModalOverlay();this.dmz={'enable':enable,'ip':(enable)?ip:this.dmz.ip};device.config.write(somovdParams.CONFIG_ID_DMZ,this.dmz,callback(this,function(){rootView.hideModalOverlay();}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_DMZ,somovdParams.CONFIG_ID_NEIGHBOUR],callback(this,function(data){if(is.RPC_SUCCESS(data.rq[1])){this.lanClients=data.rq[1].resident;}
this.deep.updateView();if(is.RPC_SUCCESS(data.rq[0])){if(data.rq[0].resident.dmz){this.dmz=data.rq[0].resident.dmz;}
else{this.dmz=data.rq[0].resident;}
this.child("enable").val(this.dmz.enable);this.child("ip").val(this.dmz.ip);this.dmz_on_off(this.dmz.enable);}
rootView.hideModalOverlay();}));});this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"enable":this.dmz_on_off(value);break;}});}
extend(pageDMZ,node);(function(){jQuery.fn.errorBlock=function(title,shortDesc,longDesc,buttonTitle,callback){var pattern="";if(this.selector=='body'&&window.engine.simpleAir){pattern+='<div id="sky" class="unselectable"></div><div id="grass" class="unselectable"></div>';}
pattern+="<div class='error-block'>"
+"<div class='title'><h2 langkey='"+title+"'>"+lng(title)+"</h2></div>"
+"<div class='content'>"
+"<div class='short-desc'></div>"
+"<div class='long-desc'><ul></ul></div>"
+"<div class='tryagain' style='display: none'><button langkey='"+buttonTitle+"'>"+lng(buttonTitle)+"</button></div>"
+"</div></div>";this.html(pattern);if(shortDesc.match(/<|>/)){this.find(".short-desc").html(shortDesc);}
else{this.find(".short-desc").attr("langkey",shortDesc).html(lng(shortDesc));}
if(is.array(longDesc)){var $longDesc=this.find(".long-desc>ul");for(var i=0;i<longDesc.length;i++){$longDesc.append("<li>"+lng(longDesc[i])+"</li>")
.find("li:last")
.attr("langkey",longDesc[i]);}}
else if(is.string(longDesc)){this.find(".long-desc").html(longDesc);}
if(is.func(callback)){this.find(".tryagain")
.show()
.find("button")
.click(callback);}
return this;}})();function jsEthSettingsModel(ifnode){jsEthSettingsModel.superclass.constructor.call(this);this.ifnode=ifnode;this.lanClients=null;}
extend(jsEthSettingsModel,jsModel);function jsEthSettingsController(ifnode,isadding){jsEthSettingsController.superclass.constructor.call(this);this.changeModel(new jsEthSettingsModel(ifnode));this.ifaceTypes.client={type:jsEthSettingsClientView,def:true};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsEthSettingsSummaryView};this.ifaceTypes.summary.options={};this.oldMAC=ifnode.mac;this.addChild(new jsInputController(ifnode.mtu),"mtu");this.addChild(new jsMACComboController(ifnode.mac,this.model.lanClients,true),"mac");}
extend(jsEthSettingsController,jsController);function jsEthSettingsClientView(ctrl,viewInx,options){this.getmacs=function(){this.ctrl.event("getmacsrq");}
this.updateModel=function(){var res=jsEthSettingsClientView.superclass.updateModel.call(this);if(res){var ifnode=this.ctrl.model.ifnode;var macCtrl=this.getChild("mac").ctrl;ifnode.mtu=this.getChild("mtu").ctrl.model.value;ifnode.mac=macCtrl.model.toString();delete ifnode.mac_cloned;if(this.ctrl.oldMAC==ifnode.mac){delete ifnode.mac;}
else if(macCtrl.userMAC){if(ifnode.mac.toLowerCase()==macCtrl.userMAC.toLowerCase()){ifnode.mac_cloned=true;}}}
return res;}
this.onupdmodel=function(){this.getChild("mac").updateView();return false;}
this.onmodeswitch=function(value){if(this.options.brief){this.hide();}
else{this.show();}
return false;}
this.drawView=function(){jsEthSettingsClientView.superclass.drawView.call(this);this.onmodeswitch();if(this.ctrl.model.ifnode.type=="ptm"){this.getChild("mac").disable();this.getChild("mtu").disable();}}
var obj;var opt;var ifnode=ctrl.model.ifnode;this.blocks=ctrl.model.ifnode.blocks;obj=ctrl.getChild("mtu");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanMtu",minval:0};obj.ifaceTypes.number.options.hide=this.blocks&&!webadminParams.BLOCK_WAN_ETH_MTU;opt=ctrl.getChild("mac").ifaceTypes.client.options;opt.humanName="wanMac";ctrl.getChild("mac").LANClients=ctrl.model.lanClients;opt.hide=this.blocks&&!webadminParams.BLOCK_WAN_ETH_MAC;jsEthSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("updmodel",this.onupdmodel);this.bind("modeswitch",this.onmodeswitch);var wizard=ctrl.model.ifnode.wizard;if(this.blocks){options.nothing=true;}
else{options.slider=true;options.collapsed=false;options.nocollapse=true;if(this.ctrl.model.ifnode.type=="ptm"){options.title="";}
else{options.title="Ethernet";}}}
extend(jsEthSettingsClientView,jsFieldSetClientView);function jsEthSettingsSummaryView(ctrl,viewInx,options){jsEthSettingsSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){var options=this.options;options.nocollapse=true;this.getChild("mtu").options.hide=true;this.getChild("mac").options.hide=true;jsEthSettingsSummaryView.superclass.drawView.call(this);}
this.updateView=function(){jsEthSettingsSummaryView.superclass.updateView.call(this);var mtu=this.getChild("mtu");if(mtu.ctrl.modified)mtu.show();var mac=this.getChild("mac");if(mac.ctrl.modified)mac.show();if(!mtu.ctrl.modified&&!mac.ctrl.modified)this.hide();}
this.bind("modeswitch",function(){return false;});}
extend(jsEthSettingsSummaryView,jsEthSettingsClientView);function jsFastmenuModel(nodeInfo){jsFastmenuModel.superclass.constructor.call(this);if(no(nodeInfo)){var nodeInfo={name:null,image:null};}
this.nodeName=nodeInfo.name;this.nodeImg=nodeInfo.image;}
extend(jsFastmenuModel,jsModel);function jsFastmenuController(nodeInfo,options){jsFastmenuController.superclass.constructor.call(this);if(!options)options={};if(!this.contentOptions)this.contentOptions={};if(options.contentOptions)this.contentOptions=options.contentOptions;this.changeModel(new jsFastmenuModel(nodeInfo));this.ifaceTypes.tree={type:jsFastmenuView};this.integrate=function(childInx,parent){jsFastmenuController.superclass.integrate.call(this,childInx,parent);if(!this.frame){this.frame=this.getParent(1).frame;}
parent=this.getParent(1);if(parent instanceof jsFastmenuController&&parent.level>=0){this.level=this.getParent(1).level+1;}}
this.level=0;if(options.frame){this.frame=options.frame;}}
extend(jsFastmenuController,jsController);function jsFastmenuView(ctrl,viewInx,options){jsFastmenuView.superclass.constructor.call(this,ctrl,viewInx,options);if(!options)options={};this.slideDown=function(){$(this.childBoxSel).stop(false,true).slideDown(200);}
this.slideUp=function(){$(this.childBoxSel).stop(false,true).slideUp(200);}
this.clickItem=function(){this.ctrl.frame.event("menuchange",this);$(this.viewBoxSel).parent().stop(false,true);$(this.viewBoxSel).parent().slideUp(200);return false;}
jsFastmenuView.prototype.drawView=function(){var children=this.ctrl.children;var child;var model=this.ctrl.model;if(!(this.getParent(1)instanceof jsFastmenuView)){this.ctrl.root=true;}
this.childBoxSel=null;if(this.ctrl.root){$(this.viewBoxSel).html("<ul class='fastmenu' />");this.myBoxSel=this.viewBoxSel+">ul";this.childBoxSel=this.myBoxSel;}else{if(this.ctrl.level==1){$(this.viewBoxSel).addClass('fastmenu');$(this.viewBoxSel).html("<a href='#' class='fastmenu'>"+lng(model.nodeName)+"</a>");this.myBoxSel=this.viewBoxSel+">a";if(children.length>0){$(this.viewBoxSel).append("<div class='temp'><ul class='fastmenuItem'></ul></div>");}
this.childBoxSel=this.viewBoxSel+'>.temp>ul';$(this.viewBoxSel).unbind('mouseenter');$(this.viewBoxSel).unbind('mouseleave');$(this.viewBoxSel).mouseenter(context(this).callback(this.slideDown));$(this.viewBoxSel).mouseleave(context(this).callback(this.slideUp));}else{$(this.viewBoxSel).addClass('fastmenuItem');$(this.viewBoxSel).html("<a href='#' />");this.myBoxSel=this.viewBoxSel+">a";var img='';if(model.nodeImg){img=model.nodeImg;$(this.myBoxSel).html("<img src='"+img+"' /> "+lng(model.nodeName));}else{$(this.myBoxSel).html(lng(model.nodeName));}
$(this.myBoxSel).click(context(this).callback(this.clickItem));}}
for(var i=0;i<children.length;i++){$(this.childBoxSel).append("<li />");child=this.getChild(i);child.options.viewBoxSel=this.childBoxSel+">li:eq("+i+")";child.viewBoxSel=this.childBoxSel+">li:eq("+i+")";if(this.ctrl.level==0){if(children.length==1){$(child.viewBoxSel).addClass('single');}else{if(i==0)$(child.viewBoxSel).addClass('first');if(i==children.length-1)$(child.viewBoxSel).addClass('last');}}}
jsFastmenuView.superclass.drawView.call(this);}}
extend(jsFastmenuView,jsCSideView);function pageFirmwareRemoteConfig(){pageFirmwareRemoteConfig.superclass.constructor.call(this);this.auto_update=null;this.add(new nodetext("firmwareConfigUrl",'',{mandatory:true}),"update_url");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageFirmwareRemoteConfig.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(this.child("update_url").val());}}));}}
this.save=function(url){rootView.showModalOverlay();this.auto_update={'url':url,'enable':true,'fw_update':false};device.config.write(somovdParams.CONFIG_ID_FIRMWARE_REMOTE_UPDATE,{'auto_update':this.auto_update},callback(this,function(){rootView.hideModalOverlay();}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_FIRMWARE_REMOTE_UPDATE,callback(this,function(data){this.deep.updateView();if(is.RPC_SUCCESS(data)){this.auto_update=data.resident.auto_update;this.child("update_url").val(this.auto_update.url);}
rootView.hideModalOverlay();}));});}
extend(pageFirmwareRemoteConfig,node);function formLocalFwUpdate(){formLocalFwUpdate.superclass.constructor.call(this);this.updateView=function(phase){formLocalFwUpdate.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.startForm()
.add(new nodeUpload("firmwareUpload",'fwupdate.cgi','firmware',{mandatory:true,auto:false,browse:'button_browse',cancel:'button_cancel'}),"firmware_upload_form");this.endForm();this.cleanButtonBar()
.addButton("button_upload")
.getButton("button_upload")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){this.get("firmware_upload_form").upload();}}));}}
this.bind("uploading",function(status,value){this.getButton("button_upload").disable();rootCtrl.event("muterq");rootCtrl.event("startfwupdate");});this.bind("uploaded",function(status,value,data){if(data.indexOf("error")>=0){rootCtrl.event("badfwrq");this.getButton("button_upload").enable();}});this.bind("cancel",function(status,value){this.getButton("button_upload").enable();});}
extend(formLocalFwUpdate,node);function formRemoteFwUpdate(){formRemoteFwUpdate.superclass.constructor.call(this);this.updateView=function(phase){formRemoteFwUpdate.superclass.updateView.apply(this,arguments);if(phase=="forward"){var autoupd=this.autoupd;this.startForm()
.add(new nodeCheckBox("enable_auto_check",autoupd.enable),"enable")
.add(new nodetext("remote_server_url",autoupd.server),"server");if(autoupd.need_update){this.addButton("button_upload_remote")
.getButton("button_upload_remote")
.bind("button.click",function(event){rootCtrl.event("autoupdaterq");});}
this.addButton("check_updates")
.getButton("check_updates")
.bind("button.click",callback(this,function(){if(confirm(lng("check_wait_warn"))){rootView.showWaitScreen(lng("fw_update_checking"),30000,callback(this,function(){alert(lng("update_check_error"));}));device.config.write(somovdParams.CONFIG_ID_AUTOUPDATE,{check_updates:true,enable:this.get("enable").val(),server:this.get("server").val()},callback(this,this.ondataready));this.isManual=true;}}));this.addButton("apply_fw_settings")
.getButton("apply_fw_settings")
.bind("button.click",callback(this,callback(this,function(event){var server=this.get("server");var enable=this.get("enable");function __apply_settings(){if(this.deep.updateModel()){rootView.showModalOverlay();device.config.write(somovdParams.CONFIG_ID_AUTOUPDATE,{enable:enable.val(),server:server.val()},callback(this,this.ondataready));}}
if(server.deep.isModified()||(enable.deep.isModified()&&enable.val())){if(confirm(lng("check_wait_warn"))){rootView.showWaitScreen(lng("fw_update_checking"),30000,callback(this,function(){alert(lng("update_check_error"));}));__apply_settings.call(this);}}
else{__apply_settings.call(this);}})));this.endForm();}
else{var autoupd=this.autoupd;debug("status = ",autoupd.status);switch(autoupd.status){case"update_available":this.get("server")
.setComment("<span langkey='autoupdNewVersion'>"+lng("autoupdNewVersion")+"</span> ("+autoupd.version+")")
.pluginEdit.find(".comment").css("color","green");if(confirm(lng("update_avail_part1")+autoupd.version+lng("update_avail_part2"))){rootCtrl.event("autoupdaterq",true);}
break
case"device_is_not_supported":this.get("server")
.setComment("autoupdFileAbsent")
.pluginEdit.find(".comment").css("color","red");break
case"latest_fw_version":this.get("server")
.setComment("new_version_unavailable")
.pluginEdit.find(".comment").css("color","gray");break
case"update_not_checked":this.get("server")
.cleanComment();break
default:this.get("server")
.cleanComment();if(this.isManual){this.isManual=false;alert(lng("autoupdUnknownError"));}
if(autoupd.enable){this.get("server")
.setComment("autoupdUnknownError")
.pluginEdit.find(".comment").css("color","red");}}}}
this.ondataready=function(data){if(is.RPC_SUCCESS(data)){this.autoupd=data.resident;}
rootView.hideWaitScreen();rootView.hideModalOverlay();this.deep.updateView();}}
extend(formRemoteFwUpdate,node);function pageFirmware(){pageFirmware.superclass.constructor.call(this);this.startForm()
.add(new nodeCaption("local_update"),"local_update").get("local_update")
.add(new formLocalFwUpdate(),"form").get("..")
.add(new nodeCaption("remote_update"),"remote_update").get("remote_update")
.add(new formRemoteFwUpdate(),"form");this.endForm();this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_AUTOUPDATE,callback(this,function(data){if(is.RPC_SUCCESS(data)){this.get("remote_update/form").autoupd=data.resident;rootView.hideWaitScreen();rootView.hideModalOverlay();this.deep.updateView();}}));});}
extend(pageFirmware,node);function nodeButton(name,value,options){nodeButton.superclass.constructor.apply(this,arguments);this.updateView=function(phase){nodeButton.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(this.name,options.comment,{mandatory:options.mandatory});this.pluginButton=this.pluginEdit.find(".input").lightUIButton(this.val());if(options.disabled)this.disable();if(this.handler){this.buttonClick(this.handler);}}
return this;}
this.val=function(value){if(is.set(value)){this.value=value;if(this.pluginButton){this.pluginButton.title(value);}
return this;}
else{return this.value;}}
this.disable=function(){this.options.disabled=true;if(this.pluginEdit&&this.pluginButton){this.pluginEdit.disable();this.pluginButton.disable();}
return this;}
this.enable=function(){this.options.disabled=false;if(this.pluginEdit&&this.pluginButton){this.pluginEdit.enable();this.pluginButton.enable();}
return this;}
this.buttonClick=function(handler){if(this.pluginButton){this.pluginButton.bind("button.click",handler);}
this.handler=handler;}
this.validate=function(){return null;}
this.val(value);}
extend(nodeButton,nodeInputBase);function jsGeneralSettingsModel(iftree,ifname,srvname,tnlname,srvsname){jsGeneralSettingsModel.superclass.constructor.call(this);this.iftree=iftree;this.templates=null;this.blankConn=null;this.isadding=!ifname;this.availIfaces={};this.ifnode;this.ifname;this.service;this.srvname=srvname;this.tunnel;this.tnlname=tnlname;this.connum=0;this.selectTemplates=function(templates){this.templates=$.extend(true,{},provList.man,templates);}
this.fillInfoFields=function(){this.ifnode=null;this.ifname=null;this.ifnode=getObjectFirstChild(this.blankConn);this.ifname=getObjectFirstKey(this.blankConn);if(this.ifnode.services){this.service=getObjectFirstChild(this.ifnode.services);this.srvname=getObjectFirstKey(this.ifnode.services);}
this.tunnel=null;if(!this.tnlname){if(this.service.tunnels){this.tunnel=getObjectFirstChild(this.service.tunnels);this.tnlname=getObjectFirstKey(this.service.tunnels);}}
else if(this.service.tunnels){this.tunnel=this.service.tunnels[this.tnlname];}
var ifnode;var service;this.connum=0;for(var i in this.iftree){ifnode=this.iftree[i];if(ifnode.services){for(var j in ifnode.services){service=ifnode.services[j];this.connum++;if(service.tunnels){for(var k in service.tunnels){this.connum++;}}}}}}
this.expandTemplates=function(){var iftree=this.iftree;var templates=this.templates;var template;var services;var ifnode;var service;var tunnel;var ifname;var isTunnel;var key;for(var t in templates){if(t!="pppoe"&&t!="pppoev6"&&t!="pppoedual"&&t!="pppoa"&&t!="static"&&t!="statkab"&&t!="dynamic"&&t!="dynkab"&&t!="staticv6"&&t!="dynamicv6"&&t!="ipoa"&&t!="statpptp"&&t!="statl2tp"&&t!="dynpptp"&&t!="dynl2tp"&&t!="statpppoe"&&t!="dynpppoe"&&t!="statpptpv6"&&t!="statl2tpv6"&&t!="dynpptpv6"&&t!="dynl2tpv6"&&t!="3g"&&t!="lte"&&t!="bridge"&&t!="pptp"&&t!="l2tp"&&t!="624"&&t!="pptpv6"&&t!="l2tpv6")continue;template=templates[t];this.getAvailIfNames(t);for(var i in template){switch(i){case"any":template.any.contype=t;for(var j in this.availIfaces){template[j]=$.extend(true,{},this.availIfaces[j]);ifnode=template[j];ifnode.contype=t;this.setL2HumanName(ifnode);service=getObjectFirstChild(template.any.services);isTunnel=(service.tunnels||getObjectLength(service.tunnels));if(isTunnel&&ifnode.services&&getObjectLength(ifnode.services)){service=null;for(var k in ifnode.services){if(no(service)&&ifnode.services[k].type=="ip"){service=ifnode.services[k];}
else{delete ifnode.services[k];}}
if(service){service.tunnels={};key=getObjectFirstKey(template.any.services);service.tunnels=$.extend(true,service.tunnels,template.any.services[key].tunnels);}
else{ifnode.services={};ifnode.services=$.extend(true,ifnode.services,template.any.services);service=getObjectFirstChild(ifnode.services);}
service.dhcp=(t=="dynpppoe"||t=="dynpptp"||t=="dynl2tp"||t=="dynpptpv6"||t=="dynl2tpv6");}
else{ifnode.services={};ifnode.services=$.extend(true,ifnode.services,template.any.services);}}
if(getObjectLength(template)>1){delete template.any;}
break;}}}}
this.setVLAN=function(ifnode,service){if(ifnode.connection_mode){switch(ifnode.connection_mode){case"VlanMuxMode":service.vlan.usempvcro=true;service.vlan.usempvc=true;service.vlan.usevlanro=false;service.vlan.usevlan=!no(service.vlan)&&!no(service.vlan.vlanid)&&service.vlan.vlanid>=0;break;case"NewMode":service.vlan.usempvcro=false;service.vlan.usempvc=false;service.vlan.usevlanro=false;service.vlan.usevlan=false;break;case"DefaultMode":delete service.vlan;break;}}}
this.setL2HumanName=function(ifnode){if(no(ifnode))ifnode=this.ifnode;if(ifnode.type=="atm"){if(ifnode.ifname=="create"){if(ifnode.port){ifnode.__humanName__=ifnode.port+"("+lng("new_")+")";}
else{ifnode.__humanName__="DSL("+lng("new_")+")";}}
else{ifnode.__humanName__=ifnode.ifname+"("+ifnode.pvc_settings.vpi+"/"+ifnode.pvc_settings.vci+")";}}
else{ifnode.__humanName__=ifnode.port?ifnode.port:ifnode.ifname;}}
this.getAvailIfNames=function(contype){var iface;var tunnel=this.tunnel;var service=this.service;var ifnode=this.ifnode;var tree=this.iftree;var j=0;var condition;var services;var serviceLength;var srv;var tunnels;this.availIfaces={};var useless;var multmode;var needDelete;var c;if(!contype){contype=getConnType(this.ifnode,this.service);}
if(contype=="ipsec")return;if(!this.isadding){this.availIfaces[this.ifname]=$.extend(true,{},this.ifnode);this.setL2HumanName(this.availIfaces[this.ifname]);return;}
for(var i in tree){needDelete=[];iface=tree[i];if(!iface.is_wan)continue;condition=false;useless=false;services=iface.services?iface.services:[];serviceLength=getObjectLength(services);checkContype=true;multmode=iface.connection_mode&&(iface.connection_mode=="VlanMuxMode"||iface.connection_mode=="MultipleServiceMode");switch(contype){case"3g":useless=(iface.type!="3g")
condition=!useless&&!serviceLength;if(!condition){for(var i in services){needDelete.push(i);}}
break;case"lte":useless=(iface.type!="lte")
condition=!useless&&!serviceLength;if(!condition){for(var i in services){needDelete.push(i);}}
break;case"pppoe":case"pppoev6":case"pppoedual":useless=true;if(iface.is_wan){if(iface.type=="atm"&&iface.link_type=="MDMVS_EOA"){useless=false;condition=true;}else if(iface.type=="ethernet"||iface.type=="ptm"||iface.type=="bridge"){useless=false;condition=true;}}
break;case"pppoa":useless=(iface.type!="atm"&&iface.link_type!="MDMVS_PPPOA");condition=!useless&&!serviceLength;if(!condition){for(var i in services){needDelete.push(i);}}
break;case"static":case"statkab":case"dynamic":case"dynkab":useless=!((iface.type=="atm"&&iface.link_type=="MDMVS_EOA")||iface.type=="ethernet"||iface.type=="ptm"||iface.type=="bridge");condition=true;if(!multmode){for(var i in services){if(services[i].type!="ppp"&&services[i].type!="pppv6"&&services[i].type!="ipv6"){condition=false;needDelete.push(i);}}}
break;case"staticv6":case"dynamicv6":useless=!((iface.type=="atm"&&iface.link_type=="MDMVS_EOA")||iface.type=="ethernet"||iface.type=="ptm"||iface.type=="bridge");condition=true;if(!multmode){for(var i in services){if(services[i].type=="ipv6"&&services[i].dhcp&&contype=="dynamicv6"){condition=false;needDelete.push(i);}}}
break;case"statpptp":case"dynpptp":case"statl2tp":case"dynl2tp":case"statpptpv6":case"dynpptpv6":case"statl2tpv6":case"dynl2tpv6":useless=!(iface.type=="ethernet");condition=true;c=0;for(var i in services){srv=services[i];if(c>0&&srv.type=="ip"){condition=false;needDelete.push(i);}
if(!c&&(srv.tunnels&&getObjectLength(srv.tunnels))){condition=false;for(var j in srv.tunnels){needDelete.push(j);}}
if(srv.type=="ip")c++;}
break;case"pptp":case"l2tp":case"pptpv6":case"l2tpv6":case"624":if(iface.type=="auto"){useless=false;}
else{useless=true;}
condition=useless;break;case"ipoa":useless=(iface.type!="atm"&&iface.link_type!="MDMVS_IPOA");condition=!useless&&!serviceLength;if(!condition){for(var i in services){needDelete.push(i);}}
break;case"bridge":useless=!((iface.type=="atm"&&iface.link_type=="MDMVS_EOA")||iface.type=="ethernet"||iface.type=="ptm"||iface.type=="bridge");condition=iface.is_wan;if(!multmode){for(var i in services){if(services[i].type!="ppp"&&services[i].type!="pppv6"){condition=false;needDelete.push(i);}}}
break;}
if(iface.ifname&&!useless){this.availIfaces[iface.ifname]=$.extend(true,{},iface);this.setL2HumanName(this.availIfaces[iface.ifname]);this.availIfaces[iface.ifname].needDelete=needDelete.length?needDelete:null;}}
var L2=this.templates.L2;for(var i in L2){switch(i){case"atm":if(contype!="3g"&&contype!="lte"&&!contype.match(/pptp|l2tp/)){this.availIfaces.create=L2[i];this.availIfaces.create.ifname="create"
this.setL2HumanName(this.availIfaces.create);}
break;}}}
this.updateTemplates=function(){this.expandTemplates();var templatesOfType=this.templates[this.templates.deftype];var ifname=getObjectFirstKey(templatesOfType);this.blankConn={};this.blankConn[ifname]=templatesOfType[ifname];this.fillInfoFields();}
this.selectTemplates({});var blankConn;var srvnode;var srvname;if(!ifname){this.updateTemplates();}
else{var blankConn={};blankConn[ifname]=$.extend(true,{},iftree[ifname]);var services=srvsname?blankConn[ifname][srvsname]:blankConn[ifname].services;if(services){var service=blankConn[ifname].services[srvname];for(var i in services){if(services[i].ifname!=srvname){delete services[i];}}
var tunnels=services[srvname].tunnels;if(tunnels){for(var i in tunnels){if(tunnels[i].ifname!=tnlname){delete tunnels[i];}}}
var vlan=service.vlan;if(vlan){this.setVLAN(blankConn[ifname],service);}}
this.blankConn=blankConn;this.fillInfoFields();}}
extend(jsGeneralSettingsModel,jsModel);function jsGeneralSettingsController(iftree,ifname,srvname,tnlname,srvipv6){jsGeneralSettingsController.superclass.constructor.call(this);this.changeModel(new jsGeneralSettingsModel(iftree,ifname,srvname,tnlname,srvipv6));var model=this.model;var contype=getConnType(model.ifnode,model.service,model.tunnel);contype=contype?contype:model.ifnode.contype;this.autoname=function(contype,ifname){var ifnode=this.model.ifnode;if(ifname&&ifname!="create"){ifnode=this.model.iftree[ifname];}
else{ifname=this.model.ifname;}
if(!contype){contype=this.model.ifnode.contype;}
var L2;var inx=this.model.connum;switch(ifnode.type){case"atm":L2=ifnode.pvc_settings.vpi+"_"+ifnode.pvc_settings.vci;break;case"ethernet":case"ptm":case"bridge":case"3g":case"lte":L2=ifnode.port?ifnode.port:ifname;break;case"auto":return contype+"_"+inx;}
if(contype=="statpppoe"||contype=="dynpppoe"){return"pppoe_"+L2+"_"+inx;}
return contype+"_"+L2+"_"+inx;}
this.initProvList=function(ctrl,obj){var child;for(var i in obj){if(obj[i].deftype){obj[i].provname=i;ctrl.addChild(new jsProvListItemController({name:i,value:obj[i]}),i);}
else{child=ctrl.addChild(new jsProvListItemController({name:i}),i);this.initProvList(child,obj[i]);}}}
this.isadding=(model.srvname=="create"||model.tnlname=="create");var provstep=this.addChild(new jsFieldSetController(),"provstep");provstep.addChild(new jsDecorController(),"desc");var provs=provstep.addChild(new jsProvListController(provList.man),"provs");this.initProvList(provs.addItem(new jsProvListItemController(),"rootprov"),provList);var name=model.tunnel?model.tunnel.name:model.service.name?model.service.name:this.autoname();this.addChild(new jsInputController(contype),"type");this.addChild(new jsInputController(model.ifname),"port");var namestep=this.addChild(new jsFieldSetController(),"namestep");namestep.addChild(new jsInputController(name),"name");namestep.addChild(new jsInputController(model.service.enable),"enable");namestep.addChild(new jsInputController(model.service.gwif),"gwif");namestep.addChild(new jsInputController((model.ifnode.is_wan||this.isadding)?"WAN":"LAN"),"direction");this.ifaceTypes.client={type:jsGeneralSettingsClientView,def:true,options:{}};this.ifaceTypes.summary={type:jsGeneralSettingsSummaryView};}
extend(jsGeneralSettingsController,jsFieldSetController);function jsGeneralSettingsClientView(ctrl,viewInx,options){this.drawView=function(){jsGeneralSettingsClientView.superclass.drawView.call(this);}
this.updateView=function(){var model=this.ctrl.model;var name=model.tunnel?model.tunnel.name:model.service.name?model.service.name:this.autoname();this.getChild("namestep","name").ctrl.model.value=name;this.getChild("type").ctrl.model.value=model.ifnode.contype;this.getChild("port").ctrl.model.value=model.ifname;this.getChild("namestep","enable").ctrl.model.value=model.service.enable;this.getChild("namestep","gwif").ctrl.model.value=model.service.gwif;this.getChild("namestep","direction").ctrl.model.value=(model.ifnode.is_wan||this.ctrl.isadding)?"WAN":"LAN";jsGeneralSettingsClientView.superclass.updateView.call(this);}
this.updateModel=function(){var nameObj=this.getChild("namestep","name");nameObj.statusCode=null;var res=nameObj.updateModel();var enObj=this.getChild("namestep","enable");enObj.updateModel();if(!res)return false;var name=nameObj.ctrl.model.toString();if(name==""){nameObj.statusCode="wanNameEmpty";res=false;}
nameObj.setError();if(!res)return false;var model=this.ctrl.model;if(model.tunnel){model.tunnel.name=nameObj.ctrl.model.value;model.tunnel.enable=enObj.ctrl.model.value;}
else{model.service.name=nameObj.ctrl.model.value;model.service.enable=enObj.ctrl.model.value;}
var port=this.getChild("port");port.updateModel();if(no(port.ctrl.model.value)){res=false;var type=this.getChild("type");type.updateModel();switch(type.ctrl.model.value){case"3g":case"lte":port.statusCode="wanNoUsbModemAvail";break;default:port.statusCode="wanNoPhyIfaceAvail";}
port.setError();}
if(!res)return false;var model=this.ctrl.model;var obj=model.tunnel?model.tunnel:model.service;obj.name=name;obj.enable=this.getChild("namestep","enable").ctrl.model.value;return true;}
this.updateBlank=function(){this.getChild("type").updateModel();this.getChild("port").updateModel();var type=this.getChild("type").ctrl.model.toString();var ifname=this.getChild("port").ctrl.model.value;var model=this.ctrl.model;model.blankConn={};if(no(ifname)){ifname=getObjectFirstKey(model.templates[type]);}
model.blankConn[ifname]=model.templates[type][ifname];model.fillInfoFields();model.ifnode.contype=type;}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;var wizard=this.ctrl.model.iftree.wizard;switch(alias){case"type":this.initPortValset(obj.value);var port=this.getChild("port");port.drawView();this.updateBlank();if(wizard){port.drawView();port.updateModel();if(no(port.ctrl.model.value)){this.ctrl.event("nophyiface",null,true);if(obj.value=="3g"||obj.value=="lte"){alert(lng("wanNoUsbModemAvail"));}
else{alert(lng("wanNoPhyIfaceAvail"));}}
else{this.ctrl.event("phyifacepresent",null,true);}}
else{this.ctrl.getParent().event("blankchange");}
this.autoname(obj.value);if(obj.value=="dynpptp"||obj.value=="dynl2tp"||obj.value=="dynpppoe"){this.ctrl.model.service.name=this.ctrl.autoname("dynamic");}
else if(obj.value=="statl2tp"||obj.value=="statpptp"||obj.value=="statpppoe"){this.ctrl.model.service.name=this.ctrl.autoname("static");}
this.ctrl.event("showneedpindialogrq",null,true);break;case"port":this.updateBlank();if(!wizard){this.ctrl.getParent().event("blankchange");}
this.autoname(null,obj.value);this.getChild("type").updateModel();var contype=this.getChild("type").ctrl.model.value;if(obj.value=="dynpptp"||obj.value=="dynl2tp"||obj.value=="dynpppoe"){this.ctrl.model.service.name=this.ctrl.autoname("dynamic",obj.value);}
else if(obj.value=="statpptp"||obj.value=="statl2tp"||obj.value=="statpppoe"){this.ctrl.model.service.name=this.ctrl.autoname("static",obj.value);}
break;case"provs":obj.view.updateModel();this.ctrl.model.selectTemplates(obj.value);this.ctrl.model.updateTemplates();var model=this.ctrl.model;this.initPortValset(model.ifnode.contype);this.getChild("port").drawView();for(var i in this.ctrl.children){if(this.ctrl.children[i].alias!="provstep"){this.getChild(i).drawView();}}
this.updateView();if(!wizard){this.ctrl.getParent().event("blankchange");}
this.autoname();break;}
return false;}
this.initPortValset=function(contype){if(no(contype)){contype=getConnType(this.ctrl.model.ifnode,this.ctrl.model.service);}
var valset={};var t=this.ctrl.model.templates[contype];for(var i in t){if(i!="any"){if(this.wizard&&this.ctrl.isadding&&!options.summary){valset[i]={value:t[i].__humanName__};var obj=valset[i];switch(t[i].type){case"ethernet":obj.desc=lng("wanEthPort");break;case"ptm":obj.desc=lng("wanPtmPort");break;case"atm":if(i=="create"){obj.desc=lng("wanAddNew")+" "+lng("wanATMPort");}
else{obj.desc=lng("wanATMPort");}
break;case"3g":case"lte":obj.desc=lng("wan3GPort");break;case"auto":obj.desc=lng("wanAutoPort");break;}}
else{valset[t[i].__humanName__]=i;}}}
var port=this.getChild("port");port.setOption("valset",valset);var firstValue=getObjectFirstChild(valset);port.ctrl.model.value=firstValue;}
this.autoname=function(contype,ifname){var name=this.getChild("namestep","name");if(!name.ctrl.modified){name.ctrl.model.value=this.ctrl.autoname(contype,ifname);name.updateView();}}
this.drawView=function(){var ctrl=this.ctrl;var valset={};if(ctrl.isadding){this.initPortValset();}
else{ctrl.model.setL2HumanName();valset[ctrl.model.ifnode.__humanName__]=ctrl.model.ifname;this.getChild("port").options.valset=valset;}
jsGeneralSettingsClientView.superclass.drawView.call(this);}
var obj;var opt;this.wizard=ctrl.model.iftree.wizard;obj=ctrl.getChild("provstep");obj.nextIface="client";obj.ifaceTypes.client.options={nothing:true};obj=ctrl.getChild("provstep","provs");obj.nextIface="selectex";obj.ifaceTypes.selectex.options={humanName:"wanProv",editable:true};obj.ifaceTypes.selectex.options.hide=!ctrl.isadding||getObjectLength(provList)<2;obj=ctrl.getChild("namestep");obj.nextIface="client";if(this.wizard){obj.ifaceTypes.client.options={nothing:true,slider:true,title:"wanNameWiz",descText:"wanNameDesc",nocollapse:true};}
else{obj.ifaceTypes.client.options={nothing:true};}
obj=ctrl.getChild("namestep","name");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanName",mandatory:true};obj.ifaceTypes.input.options.disabled=!ctrl.isadding;if(this.wizard&&ctrl.isadding&&!options.summary){obj=ctrl.getChild("type");obj.nextIface="radio2";obj.ifaceTypes.radio2.options={humanName:"wanTypeWiz"};opt=obj.ifaceTypes.radio2.options;opt.valset={};opt.valset.pppoe={value:"PPPoE",desc:lng("pppoedesc")};opt.valset.pppoev6={value:"IPv6 PPPoE",desc:lng("pppoev6desc")};opt.valset.pppoedual={value:connTypeValSet.pppoedual,desc:lng("pppoedualdesc")};opt.valset.static={value:lng("static"),desc:lng("staticdesc")};opt.valset.dynamic={value:lng("dynamic"),desc:lng("dynamicdesc")};opt.valset.staticv6={value:lng("staticv6"),desc:lng("staticv6desc")};opt.valset.dynamicv6={value:lng("dynamicv6"),desc:lng("dynamicv6desc")};opt.valset.statpptp={value:lng("statpptp"),desc:lng("statpptpdesc")};opt.valset.dynpptp={value:lng("dynpptp"),desc:lng("dynpptpdesc")};opt.valset.statpppoe={value:lng("statpppoe"),desc:lng("statpppoedesc")};opt.valset.dynpppoe={value:lng("dynpppoe"),desc:lng("statpppoedesc")};opt.valset.pptp={value:"PPTP",desc:lng("pptpdesc")};opt.valset.statl2tp={value:lng("statl2tp"),desc:lng("statpptpdesc")}
opt.valset.dynl2tp={value:lng("dynl2tp"),desc:lng("dynpptpdesc")};opt.valset.l2tp={value:lng("L2TP"),desc:lng("pptpdesc")};opt.valset["3g"]={value:"3G",desc:lng("g3desc")};opt.valset["lte"]={value:"LTE",desc:lng("ltedesc")};}
else{obj=ctrl.getChild("type");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"wanType"};opt=obj.ifaceTypes.select.options;if(ctrl.model.ifnode.is_wan||ctrl.isadding){opt.valset={};opt.valset["PPPoE"]="pppoe";opt.valset["IPv6 PPPoE"]="pppoev6";opt.valset[connTypeValSet.pppoedual]="pppoedual";opt.valset[lng("static")]="static";opt.valset[lng("dynamic")]="dynamic";opt.valset[lng("staticv6")]="staticv6";opt.valset[lng("dynamicv6")]="dynamicv6";opt.valset[lng("statpptp")]="statpptp";opt.valset[lng("dynpptp")]="dynpptp";opt.valset[lng("statpppoe")]="statpppoe";opt.valset[lng("dynpppoe")]="dynpppoe";opt.valset["PPTP"]="pptp";opt.valset[lng("statl2tp")]="statl2tp";opt.valset[lng("dynl2tp")]="dynl2tp";opt.valset["L2TP"]="l2tp";opt.valset["3G"]="3g";opt.valset["LTE"]="lte";}
else{opt.valset={"Static IP":"static"};}}
if(!ctrl.isadding){opt.disabled=true;}
obj=ctrl.getChild("provstep","desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"wanGenSect"};if(this.wizard){obj.ifaceTypes.separator.options.label="wanProvSect";obj.ifaceTypes.separator.options.descText="wanProvDesc";}
obj=ctrl.getChild("port");if(this.wizard&&ctrl.isadding&&!options.summary){obj.nextIface="radio2";obj.ifaceTypes.radio2.options={humanName:"wanPortWiz"};opt=obj.ifaceTypes.radio2.options;}
else{obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"wanPort"};opt=obj.ifaceTypes.select.options;}
if(!ctrl.isadding){opt.disabled=true;}
obj=ctrl.getChild("namestep","enable");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanEnable",valset:{on:true,off:false}};obj.ifaceTypes.checkbox.options.hide=!ctrl.model.ifnode.is_wan||this.wizard;obj=ctrl.getChild("namestep","gwif");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanGwIf",valset:{on:true,off:false},hide:true};obj=ctrl.getChild("namestep","direction");obj.nextIface="text";obj.ifaceTypes.text.options={humanName:"wanDirection"};obj.ifaceTypes.text.options.hide=this.wizard;jsGeneralSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);if(ctrl.isadding){this.initPortValset();}
else{ctrl.model.setL2HumanName();var port=this.getChild("port");port.options.valset={};var valset={};valset[ctrl.model.ifnode.__humanName__]=ctrl.model.ifname;this.getChild("port").setOption("valset",valset);}
this.bind("fieldchange",this.onfieldchange);}
extend(jsGeneralSettingsClientView,jsFieldSetClientView);function jsGeneralSettingsSummaryView(ctrl,viewInx,options){jsGeneralSettingsSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.onupdatenamerq=function(){this.getChild("namestep","name").updateView();return false;}
this.drawView=function(){var namestep=this.getChild("namestep");namestep.options.nothing=true;namestep.options.slider=false;var desc=this.getChild("provstep","desc");desc.options.hide=false;desc.options.label="wanGenSect";desc.options.descText=null;jsGeneralSettingsSummaryView.superclass.drawView.call(this);}
this.bind("fieldchange",function(){});this.bind("updatenamerq",this.onupdatenamerq);}
extend(jsGeneralSettingsSummaryView,jsGeneralSettingsClientView);function jsProvListItemController(itemInfo,options){jsProvListItemController.superclass.constructor.call(this,itemInfo,options);if(itemInfo==undefined){itemInfo={};}
this.changeModel(new jsSelectExItemModel(itemInfo));this.ifaceTypes.tree={type:jsProvListItemView,def:true,options:{style:null,open:false,noPath:true}};}
extend(jsProvListItemController,jsController);function jsProvListItemView(ctrl,viewInx,options){jsProvListItemView.superclass.constructor.call(this,ctrl,viewInx,options);jsProvListItemView.prototype.drawView=function(){jsProvListItemView.superclass.drawView.call(this);if(!this.ctrl.root){var noimage=false;switch(this.ctrl.model.itemName){case"russia":img="ru.gif";break;case"ukraine":img="ua.gif";break;case"kazakhstan":img="kz.gif";break;case"azerbaijan":img="az.gif";break;case"latvia":img="lv.gif";break;case"estonia":img="ee.gif";break;case"lithuania":img="lt.gif";break;case"man":case"azercell":case"bakcell":case"etk":case"kcell":case"life":case"matrixmobile":case"narmobile":case"ncc":case"neo":case"pathword":case"simtravel":case"smarts":case"tambovgsm":case"tatincomncc":case"umc":case"utel":case"altaysviaz":case"bwc":case"kyivstar":case"megafon":case"motiv":case"mts":case"stekgsm":case"tele2":case"ulgsm":case"diex":case"uucn":case"djuice":case"beeline":img=this.ctrl.model.itemName+".gif";break;case"skylink":img="skylink.png";break;case"jeans":img="mts.gif";break;case"abkyivstar":img="kyivstar.gif";break;default:noimage=true;break;}
if(!noimage){$(this.myBoxSel).css("background","url(/image/"+img+") no-repeat");$(this.myBoxSel).css("font-size","14px");}}}}
extend(jsProvListItemView,jsSelectExItemView);function jsProvListController(value){jsProvListController.superclass.constructor.call(this,value);this.getChild("field").ifaceTypes.selectex={type:jsProvListView};}
extend(jsProvListController,jsInputController);function jsProvListView(ctrl,viewInx,options){jsProvListView.superclass.constructor.call(this,ctrl,viewInx,options);}
extend(jsProvListView,jsSelectExClientView);function jsHelpModel(key_page){jsHelpModel.superclass.constructor.call(this);this.key_page=key_page;}
extend(jsHelpModel,jsModel);function jsHelpController(key_page){jsHelpController.superclass.constructor.call(this);this.changeModel(new jsHelpModel(key_page));this.ifaceTypes.client={type:jsHelpClientView,def:true};}
extend(jsHelpController,jsController);function jsHelpClientView(ctrl,viewInx,options){jsHelpClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.onhelplink=function(){$(this.pageContent).animate({'opacity':'toggle'},200);$(this.pageHelpFull).animate({'opacity':'toggle','width':'toggle'},400,context(this).callback(this.setLinkText));return false;}
this.setLinkText=function(){var text=lng("read_more");if($(this.pageHelpFull).css('display')!='none'){text=lng('back_to_settings');}
$(this.viewBoxSel+'>.shortHelpBlock>.helpMore>a').text(text);}
jsHelpClientView.prototype.drawView=function(){var key_page=this.ctrl.model.key_page;var htmlToDraw='';$(this.viewBoxSel).html('');if(key_page&&lng("help_"+key_page)!="help_"+key_page){htmlToDraw="<div class='shortHelpBlock unselectable'>";htmlToDraw+="<div class='helpIcon'><img src='/image/helpme.gif' /></div>";htmlToDraw+="<div class='helpText'>"+lng("help_"+key_page)+"</div>";htmlToDraw+="<div class='helpMore'><a href='#'></a></div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);this.setLinkText();$(this.viewBoxSel+'>.shortHelpBlock>.helpMore>a').click(context(this).callback(this.onhelplink));htmlToDraw="<div>"+lng("help_ex_"+key_page)+"</div>";$(this.pageHelpFull+'>#helpGeneral').html(htmlToDraw);}else{htmlToDraw="<div class='shortHelpBlock unselectable'>";htmlToDraw+="<div class='helpIcon'><img src='/image/helpme.gif' /></div>";htmlToDraw+="<div class='helpText' style='color:#AAA'>"+lng("help_none")+"</div>";htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);$(this.pageHelpFull+'>#helpGeneral').html('');}
$('#pageHelpFull').css('display','none');$('#pageContent').css('display','block');jsHelpClientView.superclass.drawView.call(this);}
this.pageContent='#pageContent';this.pageHelpFull='#pageHelpFull';this.bind("updateHelp",this.drawView);}
extend(jsHelpClientView,jsCSideView);function jsIfListModel(json,value){jsIfListModel.superclass.constructor.call(this,value);this.json=json;}
extend(jsIfListModel,jsInputModel);function jsIfListController(json,value){jsIfListController.superclass.constructor.call(this);this.createValSet=function(){var services=null;var tunnels=null;var json=this.model.json;var valset={};for(var i in json){if(this.filter.onlyWANs&&!json[i].is_wan)continue;services=json[i].services;if(services){for(var j in services){tunnels=services[j].tunnels;if(tunnels){for(var k in tunnels){valset[tunnels[k].name]=k;}}
valset[services[j].name]=j;}}}
if(this.filter.drawAutoIface)valset["&lt;"+lng("type_start_auto")+"&gt;"]="auto";this.ifaceTypes.select.options.valset=valset;this.ifaceTypes.radio.options.valset=valset;return valset;}
this.ifaceTypes.select={type:jsInputSlotView,options:{}};this.ifaceTypes.radio={type:jsInputSlotView,options:{}};this.addChild(new jsInputFieldController(value),"field").changeModel(new jsIfListModel(json,value));this.changeModel(this.getChild("field").model);this.filter={onlyWANs:true};this.createValSet();}
extend(jsIfListController,jsEditController);function pageMisc(){pageMisc.superclass.constructor.call(this);this.updateView=function(phase){pageMisc.superclass.updateView.apply(this,arguments);if(phase=="forward"){try{this.startForm();var answerIgmp=this.rq[this.inxIgmp];if(is.RPC_SUCCESS(answerIgmp)){var jsonIgmp=this.jsonIgmp=$.extend(true,{},answerIgmp.resident);var version=jsonIgmp.enable?jsonIgmp.version:"off";this.add(new nodeSelect("IGMP",version,{optionArray:[{name:"IGMPv3",value:3},{name:"IGMPv2",value:2},{name:"igmpOff",value:"off"}]}),"igmp");}
var answerNetFilter=this.rq[this.inxNetFilter];if(is.RPC_SUCCESS(answerNetFilter)){var jsonNetFilter=this.jsonNetFilter=$.extend(true,{},answerNetFilter.resident.netfilter);this.add(new nodeCheckBox("SIP",jsonNetFilter.sip),"sip")
.add(new nodeCheckBox("RTSP",jsonNetFilter.rtsp),"rtsp");}
var answerPppPassThrow=this.rq[this.inxPppPassThrow];if(is.RPC_SUCCESS(answerPppPassThrow)){var jsonPppPassThrow=this.jsonPppPassThrow=$.extend(true,{},answerPppPassThrow.resident);this.add(new nodeCheckBox("wanPppoePassThrough",jsonPppPassThrow.enabled),"pppPassThrow");}
this.endForm();this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){var query=[];this.inxIgmp=query.length;query.push([somovdParams.CONFIG_ID_IGMP,this.jsonIgmp]);if(this.jsonNetFilter){this.inxNetFilter=query.length;query.push([somovdParams.CONFIG_ID_NETFILTER,{netfilter:this.jsonNetFilter}]);}
if(this.jsonPppPassThrow){this.inxPppPassThrow=query.length;query.push([somovdParams.CONFIG_ID_PPPOE_PASS_THROUGH,{enabled:this.get("pppPassThrow").val()}]);}
rootView.showModalOverlay();device.config.write(query,callback(this,function(data){rootView.hideModalOverlay();this.emit("updaterq");}));}}));}
catch(e){this.$box.errorBlock(lng("error"),e.message,null,lng("refresh"),callback(this,function(){this.emit("updaterq");}));}
rootView.hideModalOverlay();}}
this.updateModel=function(status){if(status.error)return;var jsonIgmp=this.jsonIgmp;var igmp=this.get("igmp").val();jsonIgmp.enable=(igmp=="off")?false:true;if(jsonIgmp.enable)jsonIgmp.version=parseInt(igmp);var jsonNetFilter=this.jsonNetFilter;if(jsonNetFilter){jsonNetFilter.rtsp=this.get("rtsp").val();jsonNetFilter.sip=this.get("sip").val();}}
this.bind("updaterq",function(){rootView.showModalOverlay();var RPC_LIST=[];this.inxIgmp=RPC_LIST.length;RPC_LIST.push(somovdParams.CONFIG_ID_IGMP);this.inxNetFilter=RPC_LIST.length;RPC_LIST.push(somovdParams.CONFIG_ID_NETFILTER);this.inxPppPassThrow=RPC_LIST.length;RPC_LIST.push(somovdParams.CONFIG_ID_PPPOE_PASS_THROUGH);device.config.read(RPC_LIST,callback(this,function(data){this.rq=data.rq;this.deep.updateView();}));});}
extend(pageMisc,node);function pageIPFilters(){pageIPFilters.superclass.constructor.call(this);this.updateView=function(phase){pageIPFilters.superclass.updateView.apply(this,arguments);if(phase=="forward"){var header=[];header.push([{name:"",colspan:2},{name:"ip_address",colspan:2},{name:"ipfltPort",colspan:2},{name:""}]);header.push([{index:"name",name:"name"},{index:"proto",name:"protocol"},{index:"ipsrc",name:"ipfltSource"},{index:"ipdst",name:"destination"},{index:"portsrc",name:"ipfltSource"},{index:"portdst",name:"destination"},{index:"action",name:"ipfltAction"}]);var $grid=this.$box.lightUIGrid(header,0,{clickable:true});function setParam($row,param,name,value){if(param){if(is.unset(value))value=param;$row.col(name).html(value).data("value",param);}
else{$row.col(name).html(lng("all_")).attr("langkey","all");}}
var $row;var rule;var json=this.json;var arr;var str;for(var i in json){rule=json[i];$row=$grid.addRow().row("last");$row.col("name").html(rule.name).data("name",rule.name);$row.col("proto").html(lng(ipfltProtoNames[rule.proto]))
.data("proto",rule.proto)
.attr("langkey",ipfltProtoNames[rule.proto]);if(rule.ips){arr=rule.ips.split("-");if(arr[1]){str=arr[0]+"<br>-<br>"+arr[1]}
else{str=rule.ips;}}
setParam($row,rule.ips,"ipsrc",str);if(rule.ipd){arr=rule.ipd.split("-");if(arr[1]){str=arr[0]+"<br>-<br>"+arr[1]}
else{str=rule.ipd;}}
setParam($row,rule.ipd,"ipdst",str);setParam($row,rule.ports,"portsrc");setParam($row,rule.portd,"portdst");$row.col("action").html(lng(ipfltActions[rule.action]))
.data("action",rule.action)
.attr("langkey",ipfltActions[rule.action]);}
this.cleanButtonBar()
.addButton("add")
.getButton("add")
.bind("click.button",context(this).callback(function(){this.edit();}));if(disableFlag(somovdParams.CONFIG_ID_IPFILTER))
this.getButton("add").children('div').addClass('disable');this.addButton("clearall")
.getButton("clearall")
.bind("click.button",context(this).callback(function(){this.clear();}));if(disableFlag(somovdParams.CONFIG_ID_IPFILTER))
this.getButton("clearall").children('div').addClass('disable');if(!json||!json.length)this.getButton("clearall").hide();$grid.bind("rowclick.grid",context(this).callback(function(event,$row){var rule={name:$row.col("name").data("name"),proto:$row.col("proto").data("proto"),ips:$row.col("ipsrc").data("value"),ipd:$row.col("ipdst").data("value"),ports:$row.col("portsrc").data("value"),portd:$row.col("portdst").data("value"),action:$row.col("action").data("action")}
this.edit(rule,$row.irow());}));}}
this.clear=function(){rootView.showModalOverlay();device.config.remove(somovdParams.CONFIG_ID_IPFILTER,{clear:true},context(this).callback(function(data){this.onupdaterq();}));}
this.edit=function(rule,pos){this.$box.unbind();var ruleNode=new ruleIPFilters(this.iftree,this.lanClients,this.json,rule);ruleNode.buttonBar(this.buttonBar())
.deep.updateView(this.$outerBox)
.cleanButtonBar()
.addButton("button_prev")
.getButton("button_prev")
.bind("click.button",context(this).callback(function(){if(!checkChanges()||confirm(lng("leavePageMes"))){this.emit("updaterq");}}));if(is.object(rule)){ruleNode.addButton("button_del")
.getButton("button_del")
.bind("click.button",context(this).callback(function(){rootView.showModalOverlay();device.config.remove(somovdParams.CONFIG_ID_IPFILTER,rule,pos,context(this).callback(function(){rootView.hideModalOverlay();this.emit("updaterq");}));}));if(disableFlag(somovdParams.CONFIG_ID_IPFILTER))
ruleNode.getButton("button_del").children('div').addClass('disable');}
ruleNode.addButton("button_save")
.getButton("button_save")
.bind("click.button",context(this).callback(function(){ruleNode.deep.updateModel()
if(ruleNode.status.error){}
else{rootView.showModalOverlay();device.config.write(somovdParams.CONFIG_ID_IPFILTER,ruleNode.rule,pos,context(this).callback(function(){rootView.hideModalOverlay();this.emit("updaterq");}));}}));if(disableFlag(somovdParams.CONFIG_ID_IPFILTER))
ruleNode.getButton("button_save").children('div').addClass('disable');}
this.onupdaterq=function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_IPFILTER,somovdParams.CONFIG_ID_WAN_TEMP,somovdParams.CONFIG_ID_NEIGHBOUR],context(this).callback(function(data){rootView.hideModalOverlay();if(is.RPC_SUCCESS(data.rq[0])){this.json=data.rq[0].resident.ipfilter;}
else{this.json=[];}
if(is.RPC_SUCCESS(data.rq[1])){this.iftree=data.rq[1].resident.iface_names;}
else{this.iftree={};}
if(is.RPC_SUCCESS(data.rq[2])){this.lanClients=data.rq[2].resident;}
else{this.lanClients=[];}
this.deep.updateView();}));}
this.bind("updaterq",this.onupdaterq);}
extend(pageIPFilters,node);function ruleIPFilters(iftree,lanClients,rules,rule){ruleIPFilters.superclass.constructor.call(this);if(is.unset(rule)){this.isadding=true;rule={};}
this.updateView=function(phase){ruleIPFilters.superclass.updateView.apply(this,arguments);if(phase=="forward"){}
else{var proto=this.child("general/proto");proto.cleanOptions();for(var i in ipfltProtoNames){proto.addOption(ipfltProtoNames[i],i);}
var action=this.child("general/action");action.cleanOptions();for(var i in ipfltActions){action.addOption(ipfltActions[i],i);}
var ipvers=this.child("general/ipvers");this.child("general/ipvers")
.cleanOptions()
.addOption("IPv4","4")
.addOption("IPv6","6");var obj;var ipsrc=this.child("ip/ipsrc");this.addIPRows(ipsrc);var ipdst=this.child("ip/ipdst");this.addIPRows(ipdst);this.child("general/proto").fieldchange();if(ipsrc.pluginDst.isEmpty()){this.child("ip/range").val(false).fieldchange();}
else{this.child("ip/range").val(true).fieldchange();}
this.jQuery("ip/range").hide();}}
this.addIPRows=function(control){var version=4;version=this.child("general/ipvers").val();control.cleanRows();for(var i=0;i<lanClients.length;i++){obj=lanClients[i];if(version==4){if(is.IPv4(obj.ip)){control.addRow(obj.ip,obj.mac,obj.hostname);}}
else{if(!is.IPv4(obj.ip)){control.addRow(obj.ip,obj.mac,obj.hostname);}}}
return this;}
this.updateModel=function(status){try{if(!status.error){var general=this.child("general");var ip=this.child("ip");var ports=this.child("ports");portsrc=ports.child("portsrc");portdst=ports.child("portdst");var patt=/^\d+:\d+$/;if(!portsrc.pluginInput.isEmpty()&&!portdst.pluginInput.isEmpty()){var srcArr=portsrc.val().split(",");var dstArr=portdst.val().split(",");var srcArr2,dstArr2;if(srcArr.length!=dstArr.length){throw new Error("ipfltWrongPortOrRange2");}
for(var i=0;i<srcArr.length;i++){if(patt.test(srcArr[i])){if(!patt.test(dstArr[i])){throw new Error("ipfltWrongPortOrRange2");}
else{srcArr2=srcArr[i].split(":");dstArr2=dstArr[i].split(":");for(var j=0;j<srcArr2.length;j++){if(!is.port(srcArr2[j])||!is.port(dstArr2[j])){throw new Error("ipfltWrongPortOrRange3");}}}}
else{if(patt.test(dstArr[i])){throw new Error("ipfltWrongPortOrRange2");}
if(!is.port(srcArr[i])||!is.port(dstArr[i])){throw new Error("ipfltWrongPortOrRange3");}}}}
else{if(!portsrc.pluginInput.isEmpty()){var srcArr=portsrc.val().split(",");var srcArr2;for(var i=0;i<srcArr.length;i++){if(patt.test(srcArr[i])){srcArr2=srcArr[i].split(":");for(var j=0;j<srcArr2.length;j++){if(!is.port(srcArr2[j])){throw new Error("ipfltWrongPortOrRange3");}}}else{if(!is.port(srcArr[i])){throw new Error("ipfltWrongPortOrRange3");}}}}
if(!portdst.pluginInput.isEmpty()){var dstArr=portdst.val().split(",");var dstArr2;for(var i=0;i<dstArr.length;i++){if(patt.test(dstArr[i])){dstArr2=dstArr[i].split(":");for(var j=0;j<dstArr2.length;j++){if(!is.port(dstArr2[j])){throw new Error("ipfltWrongPortOrRange3");}}}else{if(!is.port(dstArr[i])){throw new Error("ipfltWrongPortOrRange3");}}}}}
var name=general.child("name").val();if(this.isadding){for(var i=0;i<rules.length;i++){if(name==rules[i].name)throw new Error("ipfltExistRuleMessage");}}
if(this.child("ip/ipsrc").isRange()){if(is.set(this.child("ip/ipsrc").val().split("/")[1])){throw new Error("ipfltWrongStartIP");}
if(is.set(this.child("ip/ipdst").val().split("/")[1])){throw new Error("ipfltWrongStartIP");}}
this.rule={name:name,proto:(new Number(general.child("proto").val())).valueOf(),ips:ip.child("ipsrc").val(),ipd:ip.child("ipdst").val(),ports:ports.child("portsrc").val(),portd:ports.child("portdst").val(),action:(new Number(general.child("action").val())).valueOf()}}}
catch(e){status.error=true;status.nodes.push(this);alert(lng(e.message));}
this.status=status;}
this.onfieldchange=function(status,value){switch(status.target.getAlias()){case"proto":switch(value){case"3":case"4":this.child("ports/portsrc").disable();this.child("ports/portdst").disable();break;default:this.child("ports/portsrc").enable();this.child("ports/portdst").enable();break;}
break;case"range":if(value){this.child("ip/ipsrc").enableRange();this.child("ip/ipdst").enableRange();}
else{this.child("ip/ipsrc").disableRange();this.child("ip/ipdst").disableRange();}
break;case"ipvers":var ipsrc=this.child("ip/ipsrc");var ipdst=this.child("ip/ipdst");ipsrc.setVersion(value).validate();ipdst.setVersion(value).validate();this.addIPRows(ipsrc).addIPRows(ipdst);break;}}
this.onenrange=function(status,enable){this.child("ip/range").val(enable);var ipsrc=this.child("ip/ipsrc");var ipdst=this.child("ip/ipdst");if(ipsrc.isRange()!=enable)ipsrc.changeRangeStatus(enable);if(ipdst.isRange()!=enable)ipdst.changeRangeStatus(enable);}
var comboHeader=[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}];this.add(new node(),"general")
.add(new node(),"ip")
.add(new node(),"ports");this.child("general")
.add(new nodeCaption("ipfltGenSect"))
.add(new nodetext("name",rule.name,{mandatory:true}),"name")
.add(new nodeSelect("protocol",rule.proto),"proto")
.add(new nodeSelect("ipfltAction",rule.action),"action");this.child("general").add(new nodeSelect("ipswName",4),"ipvers");this.child("ip")
.add(new nodeCaption("ipfltSectIP","ipfltSectIPDesc2"))
.add(new nodeCheckBox("ipfltIPRange2",false),"range")
.add(new nodeComboIPRange("ipsrc",rule.ips,{header:comboHeader}),"ipsrc")
.add(new nodeComboIPRange("ipdst",rule.ipd,{header:comboHeader}),"ipdst");this.child("ports")
.add(new nodeCaption("ipfltSectPort","ipfltSectPortDesc2"))
.add(new nodetext("portsrc",rule.ports,{minval:1,maxval:65535}),"portsrc")
.add(new nodetext("portdst",rule.portd,{minval:1,maxval:65535}),"portdst");this.bind("fieldchange",this.onfieldchange)
.bind("enrange",this.onenrange);}
extend(ruleIPFilters,node);function nodeComboIPRange(name,range,options){nodeComboIPRange.superclass.constructor.apply(this,arguments);this.options=options?options:{};this.updateView=function(phase){nodeComboIPRange.superclass.updateView.apply(this,arguments);if(phase=="forward"){var options=this.options;this.pluginEdit=this.$box.lightUIEdit(name,options.comment,{mandatory:options.mandatory});var $input=this.pluginEdit.find(".input");$input.addClass("range")
.html("<div class='src'></div><div class='minus unselectable' unselectable='on'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class='dst'></div>");var onchange=function(event){$(event.target).find("input").removeClass("validate");this.fieldchange()
event.stopPropagation();return true;}
var onerror=function(event,errorCode){$(event.target).find("input").addClass("validate");}
var onfocus=function(event){$(event.target).find("input").removeClass("validate");}
var type=options.type||"ipv4";var flags={header:options.header,type:type,index:options.index,blank:options.blank,flags:{maxLength:options.maxLength,mandatory:options.mandatory,re:options.re}};this.pluginSrc=$input.find(".src").lightUIComboGrid(flags);this.pluginSrc.find(".icon").css("display","none");this.pluginSrc.bind("unfocus.input enter.input tab.input rowclick.grid",context(this).callback(onchange));this.pluginSrc.bind("error.input",onerror);this.pluginSrc.bind("onfocus.input",onfocus);if(type=="ipv6"){this.pluginDst=$input.find(".dst").lightUIIPv6({mandatory:options.mandatory,maxLength:43});}
else{this.pluginDst=$input.find(".dst").lightUIIPv4({mandatory:options.mandatory,maxLength:18});}
this.pluginDst.bind("unfocus.input enter.input tab.input",context(this).callback(onchange));this.pluginDst.bind("error.input",onerror);this.pluginDst.bind("onfocus.input",onfocus);this.val(range);if(is.set(range)&&range.split("-")[1]){this.enableRange();}
else{this.disableRange();}
if(options.rangeLocked)this.lockRange();else this.unlockRange();this.pluginEdit.find(".minus").click(context(this).callback(function(){if(this.options.rangeLocked)return;if(this.pluginDst.find("input").attr("disabled")){this.enableRange();this.emit("enrange",true);}
else{this.disableRange();this.emit("enrange",false);}}));}
return this;}
this.val=function(value){if(is.set(value)){this.applyAttrs(value);var arr=value.split("-");this.range=value;if(this.pluginSrc&&this.pluginDst){this.pluginSrc.fieldval(arr[0]);this.pluginDst.fieldval(arr[1]);}
return this;}
else{if(this.pluginSrc&&this.pluginDst){if(this.options.rangeLocked){return this.pluginSrc.fieldval();}
else{var src=this.pluginSrc.fieldval();var dst=this.pluginDst.fieldval();if(!this.pluginDst.find("input").attr("disabled")&&is.set(dst)&&dst!=""){return src+"-"+dst;}
else{return src;}}}
else{return this.range;}}}
this.addRow=function(){var options=this.options;options.optionArray.push(arguments);if(this.pluginSrc){this.pluginSrc.addOption.apply(this.pluginSrc,arguments);}
return this;}
this.cleanRows=function(){this.options.optionArray=[];this.pluginSrc.cleanOptions();return this;}
this.updateModel=function(status){if(this.pluginEdit.isDisabled()||this.pluginEdit.is(":hidden")){return;}
if(this.options.mandatory&&this.pluginSrc.isEmpty()){this.pluginSrc.find("input").addClass("validate");alert(lng("srcEmpty"));status.error=true;status.nodes.push(this);return;}
else if(this.pluginSrc.validate()){this.pluginSrc.find("input").addClass("validate");status.error=true;status.nodes.push(this);}
else if(this.pluginDst.validate()){this.pluginDst.find("input").addClass("validate");status.error=true;status.nodes.push(this);}
return this;}
this.fieldchange=function(){this.emit("fieldchange",this.val());return this;}
this.setVersion=function(version){if(version==6){options.type="ipv6";}
else{options.type="ipv4";}
range=this.val();this.updateView("forward");return this;}
this.disableRange=function(){if(this.$box.isRendered()){this.$box.find(".minus").addClass("break");this.pluginDst.disable();}
return this;}
this.enableRange=function(){if(this.$box.isRendered()){this.$box.find(".minus").removeClass("break");this.pluginDst.enable();}
return this;}
this.lockRange=function(){this.options.rangeLocked=true;if(this.$box.isRendered()){this.$box.find(".minus").removeClass("break").addClass("lock");this.pluginDst.disable();}}
this.unlockRange=function(){this.options.rangeLocked=false;if(this.$box.isRendered()){var $minus=this.$box.find(".minus");if($minus.hasClass("lock")){$minus.removeClass("lock").addClass("break");}}}
this.changeRangeStatus=function(enable){if(enable){this.enableRange();}
else{this.disableRange();}
return this;}
this.validate=function(){if(this.pluginSrc.validate()){this.pluginSrc.find("input").addClass("validate");}
if(this.pluginDst.validate()){this.pluginDst.find("input").addClass("validate");}
return this;}
this.isRange=function(){return!this.$box.find(".minus").hasClass("break");}}
extend(nodeComboIPRange,nodeInputBase);var ipfltProtoNames=["TCP/UDP","TCP","UDP","ICMP","all_"];var ipfltActions=["ACCEPT","DROP"];function jsIPSwitchController(version){jsIPSwitchController.superclass.constructor.call(this,version);this.ifaceTypes.ipswitch={type:jsIPSwitchSlotView,options:{humanName:"ipswName",valset:{IPv6:6,IPv4:4}}};this.nextIface="ipswitch";this.addChild(new jsInputFieldController(version),"field");this.changeModel(this.getChild("field").model);this.onfieldchange=function(obj){this.switchIP(this.getParent(),obj.value);return false;}
this.switchIP=function(obj,version){this.model.value=version;var child;for(var i in obj.children){child=obj.children[i];this.switchIP(child,version);if(child.lastIface)child.nextIface=child.lastIface;if(child instanceof jsSubNetIPController||child instanceof jsIPController||child instanceof jsSubNetIPWithLANController||child instanceof jsIPWithLANController||child instanceof jsIPComboController){child.setVersion(version);}}}
this.addEventHandler("fieldchange",this.onfieldchange);}
extend(jsIPSwitchController,jsEditController);function jsIPSwitchSlotView(ctrl,viewInx,options){ctrl.getChild("field").nextIface="radio";jsIPSwitchSlotView.superclass.constructor.call(this,ctrl,viewInx,options);this.onfieldchange=function(obj){this.updateModel();var parent=this.getParent();var child;var childCtrl;for(var i in parent.ctrl.children){child=parent.getChild(i);if(child.ctrl instanceof jsSubNetIPController||child.ctrl instanceof jsIPController||child.ctrl instanceof jsSubNetIPWithLANController||child.ctrl instanceof jsIPWithLANController){child.drawView();}}
this.ctrl.getParent().event("fieldchange",{view:this,value:obj.value},true);return false;}
this.bind("fieldchange",this.onfieldchange);}
extend(jsIPSwitchSlotView,jsEditClientView);function pageIPTV(){pageIPTV.superclass.constructor.call(this);this.add(new nodetext('VLAN ID',1,{mandatory:true}),'vid');this.add(new PortViewCtrl(false),"ctrl");this.bind('updaterq',function(){devu.iptv.pull(callback(this,function(){this.deep.updateView();}),callback(this,function(){node.prototype.updateView.call(this,'forward');this.$box.errorBlock(lng('error'),lng('rpcReadError'),null,lng('refresh'),callback(this,function(){this.emit('updaterq')}));}));});this.updateView=function(__phase){pageIPTV.superclass.updateView.apply(this,arguments);if(__phase=='forward'){this.get('vid').hide();this.get('ctrl').setPorts(devu.iptv.getPortMap());var htmlToDraw='<div id="uiSTBPortComment">'+lng('iptv_master_comment')+'</div>';this.$box.append(htmlToDraw);this.cleanButtonBar()
.addButton('save')
.getButton('save')
.bind('click.button',callback(this,function(){this.deep.updateModel();function onApply(){clearTimeout(tt);rootView.hideWaitScreen();this.emit('updaterq');}
if(!this.status.error){var tt=setTimeout(callback(this,onApply),webadminParams.VLAN_APPLY_TIME*2);rootView.showWaitScreen(lng("pleaseWait"),webadminParams.VLAN_APPLY_TIME*3);devu.iptv.push(callback(this,onApply),callback(this,function(){alert(lng('rpcWriteError'));this.emit('updaterq');}));}}));}}
this.updateModel=function(__status){this.status=__status;devu.iptv.setPortMap(this.get('ctrl').getPorts());}}
extend(pageIPTV,node);function PortViewCtrl(vid_show){PortViewCtrl.superclass.constructor.call(this);var pmap=[];this.setPorts=function(__pmap){pmap=__pmap;}
this.getPorts=function(){return pmap;}
this.updateView=function(__phase){PortViewCtrl.superclass.updateView.apply(this,arguments);if(__phase=='forward'){var htmlToDraw='<div id="uiSTBPort" style="text-align:center; margin-bottom: 35px; margin-top: 35px;"></div>'
+'<div id="uiSTBPortSign"></div>';this.$box.append(htmlToDraw);var port,i=0;function setPortStatus(__$box,__checked){if(__checked===true){__$box.find('input').attr('checked','checked');__$box.removeClass('off').removeClass('dis').addClass('on');}
else if(__checked===false){__$box.find('input').removeAttr('checked');__$box.removeClass('on').removeClass('dis').addClass('off');}
else if(__checked===null){__$box.removeClass('on').removeClass('off').addClass('dis');}}
for(var port in pmap){i++;htmlToDraw='<span class="customCheckbox '+(port.toLowerCase().indexOf('wifi')+1?' wifi ':'')+' off" style="position:relative" id=ui_iptv_'+port+' data-port="'+port+'">'
+'<input type="checkbox" value='+port+'></input>';if(port.match(/wifi/)){htmlToDraw+='<div style="position: absolute; bottom: -16px; width: 100%;">'+port+'</div>';}
else{htmlToDraw+='<div style="position: absolute; bottom: -16px; width: 100%;">LAN'+i+'</div>';}
htmlToDraw+='</span>';$('#uiSTBPort').append(htmlToDraw);setPortStatus($('#ui_iptv_'+port),pmap[port]);}
$('#uiSTBPort>.customCheckbox').click(function(){if(!$(this).is('.dis')){change=true;var ps=!getPortStatus($(this));setPortStatus($(this),ps);pmap[$(this).data('port')]=ps;}});}}
function getPortStatus(__$box){return __$box.is('.on')}}
extend(PortViewCtrl,node);var CONFIG_ID_LANG_LIST=73;function jsLangController(nodeInfo,frame){jsLangController.superclass.constructor.call(this,nodeInfo,{});var cookieLng=getCookie('cookie_lang');this.model.langs=window.langs;if(cookieLng!=''){this.model.lng=cookieLng;}
else{this.model.lng=window.curlang;setCookie("cookie_lang",this.model.lng);}
this.ifaceTypes.switchLang={type:jsSwitchLangView,options:{action:"will_change_run_time"}};this.ifaceTypes.listLang={type:jsListLangView,options:{action:"index.cgi?v2=y&res_config_id="+CONFIG_ID_LANG_LIST+"&res_struct_size=1"}};this.onmenuchange=function(menuItem){if(this.model.lng!=menuItem.ctrl.contentOptions.lng){this.model.lng=menuItem.ctrl.contentOptions.lng;switchDirection(this.model.lng);this.event("changelang",this.model.lng);}
return false;}
this.onchangelangs=function(langs){this.children=new Array();for(var i in this.model.langs){this.addChild(new jsFastmenuController({name:i,image:'/image/flags/lang_'+i+'.png'},{frame:this,contentOptions:{lng:i}}));}
return false;}
this.frame=frame;this.addEventHandler("menuchange",this.onmenuchange);this.addEventHandler("changelangs",this.onchangelangs);}
extend(jsLangController,jsFastmenuController);function jsSwitchLangView(ctrl,viewInx,options){jsSwitchLangView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data){if(this.mode=='update'){lang=data;this.ctrl.frame.event("changelang",this.ctrl.model.lng);this.onsaverq();}}}
this.prepareData=function(){switch(this.mode){case"save":var obj={v2:"y",rq:"y",res_json:"y",res_data_type:"json",res_config_action:somovdParams.CONFIG_ACTION_EDIT,res_config_id:67,res_struct_size:0}
jsonOutObj={lang:this.ctrl.model.lng};obj.res_buf=$.toJSON(jsonOutObj);this.addToRequest(obj);break;}}
this.onchangelang=function(lng){if(lng){this.action="scripts/"+lng+".lng.js";}
else{this.action="scripts/"+this.ctrl.model.lng+".lng.js";}
this.mode='update';this.updateView();return false;}
this.onsaverq=function(){this.action="../../index.cgi";this.mode="save";this.updateView();}
this.mode="update";this.bind("changelang",this.onchangelang);this.bind("savelang",this.onsaverq);}
extend(jsSwitchLangView,jsSSideView);function jsListLangView(ctrl,viewInx,options){jsListLangView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data){var langs=new Array();for(i=0;i<data.length;i++){langs[i]=data[i].val0;}
this.model.langs=langs;this.ctrl.event("changelangs",langs);}}}
extend(jsListLangView,jsSSideView);function jsLanModel(iftree){jsLanModel.superclass.constructor.call(this);this.iftree=iftree;}
extend(jsLanModel,jsModel);function jsLanController(blocks){jsLanController.superclass.constructor.call(this);this.changeModel(new jsLanModel());this.ifaceTypes.client={type:jsLanClientView};this.ifaceTypes.client.options={nothing:true};this.ifaceTypes.server={type:jsLanServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();this.ondataready=function(){var iftree=this.model.iftree;var c=0;for(var i in iftree){if(!iftree[i].is_wan&&iftree[i].services&&getObjectLength(iftree[i].services)){this.ifname=i;this.srvname=getObjectFirstKey(iftree[i].services);iftree[i].ifname=this.ifname;getObjectFirstChild(iftree[i].services).ifname=this.srvname;c++;}}
this.multyLAN=c>1;if(!this.multyLAN){this.event("lanselect");}
return false;}
this.onlanselect=function(){if(is.string(this.ifname)&&is.string(this.srvname)){var mainTab=this.changeChild(this.getChild("mainTab").thisInx,new jsLanSettingsController(this.model.iftree,this.ifname,this.srvname,this.model.lanClients,this.model.dhcpClients),"mainTab");mainTab.blocks=this.blocks;}
return false;}
this.addChild(new jsController(),"mainTab");this.blocks=blocks;this.addEventHandler("dataready",this.ondataready);this.addEventHandler("lanselect",this.onlanselect);}
extend(jsLanController,jsFieldSetController);function jsLanClientView(ctrl,viewInx,options){jsLanClientView.superclass.constructor.call(this,ctrl,viewInx,options);if(!options.inputPadding)options.inputPadding="200px";this.ondataready=function(){var iftree=this.ctrl.model.iftree;if(this.ctrl.multyLAN){var header=[{index:"name",name:"wanName"},{index:"ip",name:"IP"},{index:"mask",name:"wanMask"}];$grid=$(this.options.childBoxSel).lightUIGrid(header,0,{clickable:true});var $row;var service=null;var srvname=null;for(var i in iftree){if(!iftree[i].is_wan&&iftree[i].services&&getObjectLength(iftree[i].services)){srvname=getObjectFirstKey(iftree[i].services);;service=getObjectFirstChild(iftree[i].services);if(is.object(service)){$row=$grid.addRow().row("last");$row.col("name").html(service.name);$row.col("ip").html(service.ip);$row.col("mask").html(service.mask);$row.data("ifname",i)
.data("srvname",srvname);}}}
if(is.string(srvname)){$grid.bind("rowclick.grid",context(this).callback(function(event,$row){this.ctrl.ifname=$row.data("ifname");this.ctrl.srvname=$row.data("srvname");this.ctrl.event("lanselect");}));}}
return false;}
this.onredirectrq=function(ip){var root=this.getParent(-1);root.ctrl.changeServerUrl(ip);root.showWaitScreen(lng("change_ip_progress"),webadminParams.CHANGE_IP_TIME);}
this.save=function(){var res=this.updateModel();if(res){this.showModalOverlay();clearJSON(this.ctrl.model.iftree.br0);this.cleanButtons();this.ctrl.event("saverq");}}
this.onlanselect=function(){if(this.ctrl.ifname&&this.ctrl.srvname){this.constructor(this.ctrl,this.viewInx,this.options?this.options:{});this.options.buttons=[{name:"save",value:"button_save",handler:this.save}];this.drawView();if(disableFlag(somovdParams.CONFIG_ID_WAN_TEMP)){var buttons=this.options.buttons;for(var i=0;i<buttons.length;i++){if(buttons[i].name=="save"){this.disableButton(buttons[i].name);break;}}}}
return false;}
this.bind("dataready",this.ondataready);this.bind("redirectrq",this.onredirectrq);this.bind("lanselect",this.onlanselect);}
extend(jsLanClientView,jsFieldSetClientView);function jsLanServerView(ctrl,viewInx,options){jsLanServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;this.ctrl.model.iftree={};if(data){if(!data.baddata&&data.rq){if(data.rq[0]&&data.rq[0].resident&&data.rq[0].resident.iface_names){this.ctrl.model.iftree=data.rq[0].resident.iface_names;if(!this.ctrl.model.iftree)this.ctrl.model.iftree={};}
if(data.rq[1]&&data.rq[1].resident){this.ctrl.model.lanClients=data.rq[1].resident;}
if(data.rq[2]&&data.rq[2].resident){this.ctrl.model.dhcpClients=data.rq[2].resident;}}}
if(this.mode=="update"){this.ctrl.event("dataready");}
else{this.ctrl.event("updaterq");}}
this.prepareData=function(){var obj;var delim="|";var ctrl=this.ctrl;switch(this.mode){case"save":obj={v2:"y",rq:"y",res_config_id:1,res_config_action:3,res_json:"y",res_data_type:"json",res_struct_size:36};var jsonOutObj={};jsonOutObj[ctrl.ifname]=ctrl.model.iftree[ctrl.ifname];var ip=jsonOutObj[ctrl.ifname].services[ctrl.srvname].ip;setCookie("lan_ip",ip);obj.res_buf=$.toJSON(jsonOutObj);obj.res_buf=obj.res_buf.replace(/%/g,"%25");obj.res_buf=obj.res_buf.replace(/#/g,"%23");obj.res_pos=0;this.addToRequest(obj);break;case"update":obj={v2:"y",rq:1,res_json0:"y",res_config_action0:1,res_config_id0:1,res_struct_size0:36};obj["res_json"+obj.rq]="y";obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_READ;obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_NEIGHBOUR;obj["res_struct_size"+obj.rq]=0;obj.rq++;obj["res_json"+obj.rq]="y";obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_READ;obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_DHCP_LEASES;obj["res_struct_size"+obj.rq]=0;obj.rq++;this.addToRequest(obj);break;}}
this.onupdaterq=function(){window.hasChanges=null;this.mode="update";this.updateView();}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onsaverq);}
extend(jsLanServerView,jsSSideView);function jsLanSettingsController(iftree,ifname,srvname,LANClients,DHCPClients){jsLanSettingsController.superclass.constructor.call(this);this.iftree=iftree;this.ifnode=iftree[ifname];this.service=this.ifnode.services[srvname];this.dhcpd=this.service.dhcpd;setCookie("lan_ip",this.service.ip);this.ifaceTypes.client={type:jsLanSettingsView,options:{}};this.addChild(new jsInputController(this.service.name),"name");this.addChild(new jsStatIPSettingsController(this.service),"statip");this.addChild(new jsDhcpServerController(this.dhcpd),"dhcpd");this.addChild(new jsDhcpServerMacController(this.dhcpd,LANClients,DHCPClients),"macs");}
extend(jsLanSettingsController,jsFieldSetController);function jsLanSettingsView(ctrl,viewInx,options){this.updateModel=function(){var IP=this.getChild("statip");var DHCP=this.getChild("dhcpd");var divMain=DHCP.getChild("divMain");var begin=divMain.getChild("begin");var end=divMain.getChild("end");var oldStartIp=this.ctrl.service.dhcpd.start_ip;var oldEndIp=this.ctrl.service.dhcpd.end_ip;if(begin.statusCode=="dhcpBeginOutOfRange")begin.statusCode=null;if(end.statusCode=="dhcpEndOutOfRange")end.statusCode=null;var res=jsLanSettingsView.superclass.updateModel.call(this);if(res){var strIp=IP.getChild("ip").ctrl.model.toString();var strMask=IP.getChild("mask").ctrl.model.toString();if((new IPv4(strIp,strMask)).reserved()){alert(lng("lanIpReserved"));return false;}
DHCP.getChild("mode").updateModel();var dhcpdmode=DHCP.getChild("mode").ctrl.model.value;if(dhcpdmode=="en"){if(IP.ctrl.isIpOrMaskChanged&&begin.ctrl.model.toString()==oldStartIp&&end.ctrl.model.toString()==oldEndIp){if(DHCP.correctDHCP(IP.getChild("ip").ctrl.model,IP.getChild("mask").ctrl.model)){if(confirm(lng("dhcpCorrectReq")+" "+lng("dhcpNewPool")+" "+begin.ctrl.model.toString()+" ... "+end.ctrl.model.toString())){begin.updateView();end.updateView();DHCP.updateModel();}
IP.ctrl.isIpOrMaskChanged=false;}}
var bitmask=calcBitsByMask(IP.getChild("mask").ctrl.model.toString());var tmpBeginModel=begin.ctrl.model;var tmpEndModel=end.ctrl.model;var tmpIPModel=IP.getChild("ip").ctrl.model;tmpBeginModel.bitmask=bitmask;tmpEndModel.bitmask=bitmask;tmpIPModel.bitmask=bitmask;tmpBeginModel.applyMask();tmpEndModel.applyMask();tmpIPModel.applyMask();if(tmpBeginModel.toString()!=tmpIPModel.toString()){begin.statusCode="dhcpBeginOutOfRange";begin.setError();res&=false;}
if(tmpEndModel.toString()!=tmpIPModel.toString()){end.statusCode="dhcpEndOutOfRange";end.setError();res&=false;}}}
return res;}
ctrl.service.is_wan=ctrl.ifnode.is_wan;var c=0;for(var i in ctrl.iftree){if(!ctrl.iftree[i].is_wan)c++;}
var multyLAN=c>1;obj=ctrl.getChild("name");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanName",disabled:true,hide:!multyLAN};jsLanSettingsView.superclass.constructor.call(this,ctrl,viewInx,options);}
extend(jsLanSettingsView,jsFieldSetClientView);function jsListBoxModel(list){jsListBoxModel.superclass.constructor.call(this);this.list=list;}
extend(jsListBoxModel,jsModel);function jsListBoxController(list){jsListBoxController.superclass.constructor.call(this);this.ifaceTypes.changebox={type:jsInputSlotView};this.addChild(new jsListBoxFieldController(list),"field");this.changeModel(this.getChild("field").model);}
extend(jsListBoxController,jsController);function jsListBoxFieldController(list){jsListBoxFieldController.superclass.constructor.call(this);this.ifaceTypes.changebox={type:jsChangeBoxClientView};this.changeModel(new jsListBoxModel(list));}
extend(jsListBoxFieldController,jsController);function jsChangeBoxClientView(ctrl,viewInx,options){jsChangeBoxClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsChangeBoxClientView.superclass.drawView.call(this);var options=this.options;if(options.valset){for(var i in options.valset){this.ivalset[options.valset[i]]=i;}}
this.srcBoxSel=options.viewBoxSel+">table>tbody>tr:eq(0)>td:eq(0)>select";this.dstBoxSel=options.viewBoxSel+">table>tbody>tr:eq(0)>td:eq(2)>select";this.rightArrowSel=options.viewBoxSel+">table>tbody>tr:eq(0)>td:eq(1)>a";this.leftArrowSel=options.viewBoxSel+">table>tbody>tr:eq(1)>td:eq(0)>a";var htmlToDraw="";htmlToDraw+="<table border='0'><tr><td rowspan='2'>";htmlToDraw=this.drawBox(htmlToDraw);htmlToDraw+="</td><td class='changeBoxRight' unselectable='on'><a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></td><td rowspan='2'>";htmlToDraw=this.drawBox(htmlToDraw);htmlToDraw+="</td></tr><tr><td class='changeBoxLeft' unselectable='on'><a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></td></tr></table>";$(options.viewBoxSel).html(htmlToDraw);this.updateView();if(options.disabled)this.disable();$(this.srcBoxSel).addClass("changeBoxSrc").get(0).selectedIndex=0;$(this.dstBoxSel).addClass("changeBoxDst").get(0).selectedIndex=0;$(this.rightArrowSel).bind("click",context(this).callback(this.onrightclickjq));$(this.leftArrowSel).bind("click",context(this).callback(this.onleftclickjq));}
this.drawBox=function(htmlToDraw){htmlToDraw+="<select size=\""+options.size+"\"></select>";return htmlToDraw;}
this.updateModel=function(){this.ctrl.model.list=this.prepareModel();}
this.updateView=function(){var htmlToDraw="";var valsetTotal=this.options.valset;var valset={};for(var i in valsetTotal){valset[i]=valsetTotal[i];}
var list=this.ctrl.model.list;for(var i in list){delete valset[this.ivalset[list[i]]];htmlToDraw+="<option value='"+list[i]+"'>"+this.ivalset[list[i]]+"</option>";}
$(this.dstBoxSel).html(htmlToDraw);htmlToDraw="";for(var i in valset){htmlToDraw+="<option value='"+valset[i]+"'>"+i+"</option>";}
$(this.srcBoxSel).html(htmlToDraw);}
this.onrightclickjq=function(event){var selectedIndex=$(this.srcBoxSel).get(0).selectedIndex;if(selectedIndex>=0){var selectedSel=this.srcBoxSel+">option:eq("+selectedIndex+")";$(this.dstBoxSel).append("<option value="+$(selectedSel).get(0).value+">"+$(selectedSel).html()+"</option>");this.ctrl.event("additem",{view:this,value:$(selectedSel).get(0).value});$(selectedSel).remove();var srcBoxLength=$(this.srcBoxSel+">option").length;if(selectedIndex<srcBoxLength){$(this.srcBoxSel).get(0).selectedIndex=selectedIndex;}
else{if(srcBoxLength>0){$(this.srcBoxSel).get(0).selectedIndex=srcBoxLength-1;}}
$(this.dstBoxSel).get(0).selectedIndex=$(this.dstBoxSel+">option").length-1;}
event.stopPropagation();}
this.prepareModel=function(){var list=[];for(var i=0;i<$(this.dstBoxSel+">option").length;i++){list.push($(this.dstBoxSel+">option").get(i).value);}
return list;}
this.onleftclickjq=function(event){var selectedIndex=$(this.dstBoxSel).get(0).selectedIndex;if(selectedIndex>=0){var selectedSel=this.dstBoxSel+">option:eq("+selectedIndex+")";$(this.srcBoxSel).append("<option value="+$(selectedSel).get(0).value+">"+$(selectedSel).html()+"</option>");this.ctrl.event("removeitem",{view:this,value:$(selectedSel).get(0).value});$(selectedSel).remove();var dstBoxLength=$(this.dstBoxSel+">option").length;if(selectedIndex<dstBoxLength){$(this.dstBoxSel).get(0).selectedIndex=selectedIndex;}
else{if(dstBoxLength>0){$(this.dstBoxSel).get(0).selectedIndex=dstBoxLength-1;}}
$(this.srcBoxSel).get(0).selectedIndex=$(this.srcBoxSel+">option").length-1;}
event.stopPropagation();}
this.onremoveitem=function(obj){return true;}
this.onadditem=function(obj){return true;}
this.dstBoxSel=null;this.rightArrowSel=null;this.leftArrowSel=null;this.ivalset={};this.bind("additem",this.onadditem);this.bind("removeitem",this.onremoveitem);}
extend(jsChangeBoxClientView,jsEditClientView);function jsIfacesInputController(value){jsIfacesInputController.superclass.constructor.call(this);this.ifaceTypes.select={type:jsIfacesInputSlotView,options:{}};this.ifaceTypes.radio={type:jsIfacesInputSlotView,options:{}};this.ifaceTypes.server={type:jsIfacesInputServerView,options:{plainIface:true}};this.addChild(new jsInputFieldController(value),"field");this.changeModel(this.getChild("field").model);this.IfacesReady=function(obj){var valset=CreateIfacesValset(obj.ifaces,obj.onlyWans,obj.drawAutoIface,obj.serviceTypes);$.extend(this.ifaceTypes.select.options.valset,valset);$.extend(this.ifaceTypes.radio.options.valset,valset);this.event("updateValset",valset);this.parent.event("IfacesReady",obj.ifaces);return false;}
this.addEventHandler("IfacesReady",this.IfacesReady);}
extend(jsIfacesInputController,jsEditController);function jsIfacesInputSlotView(ctrl,viewInx,options){ctrl.getChild("field").nextIface=ctrl.lastIface;jsIfacesInputSlotView.superclass.constructor.call(this,ctrl,viewInx,options);this.updateValset=function(obj){this.setOption("valset",obj);this.drawView();return false;}
this.bind("updateValset",this.updateValset);}
extend(jsIfacesInputSlotView,jsEditClientView);function jsIfacesInputServerView(ctrl,viewInx,options){jsIfacesInputServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data&&!data.baddata&&data.resident&&data.resident.iface_names){this.ctrl.event("IfacesReady",{ifaces:data.resident.iface_names,onlyWans:this.options.onlyWans,drawAutoIface:this.options.drawAutoIface,serviceTypes:this.options.serviceTypes});}else
this.ctrl.event("IfacesReady",{ifaces:null,onlyWans:this.options.onlyWans,drawAutoIface:this.options.drawAutoIface,serviceTypes:this.options.serviceTypes});}
this.prepareData=function(){var obj;obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_struct_size:0};obj.res_config_id=somovdParams.CONFIG_ID_WAN_IFACES_LIST;this.addToRequest(obj);}
this.updaterq=function(){this.updateView();return false;}
this.bind("updaterq",this.updaterq);}
extend(jsIfacesInputServerView,jsSSideView);function jsIfacesListModel(){jsIfacesListModel.superclass.constructor.call(this);this.InterfacesListAsIs=null;this.InterfacesValset=null;}
extend(jsIfacesListModel,jsModel);function jsIfacesListServerView(ctrl,viewInx,options){jsIfacesListServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data&&!data.baddata&&data.resident&&data.resident.iface_names)
this.ctrl.model.InterfacesListAsIs=data.resident.iface_names;else
this.ctrl.model.InterfacesListAsIs=null;this.ctrl.model.InterfacesValset=CreateIfacesValset(this.ctrl.model.InterfacesListAsIs,this.options.onlyWans,this.options.drawAutoIface,this.options.serviceTypes);this.ctrl.event("IfacesListReady");}
this.prepareData=function(){var obj;obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_struct_size:0};obj.res_config_id=somovdParams.CONFIG_ID_WAN_IFACES_LIST;this.addToRequest(obj);}
this.updaterq=function(){this.updateView();return false;}
this.bind("updaterq",this.updaterq);}
extend(jsIfacesListServerView,jsSSideView);function CreateIfacesValset(IfacesList,onlyWans,drawAutoIface,serviceTypes){var valset={};var serviceFound=false;if(drawAutoIface)
valset["&lt;"+lng("type_start_auto")+"&gt;"]="auto";for(var i in IfacesList){if(onlyWans&&!IfacesList[i].is_wan)
continue;else
valset[IfacesList[i].name]=IfacesList[i].iface;}
return valset;}

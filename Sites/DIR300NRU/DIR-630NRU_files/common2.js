function jsLocalResController(service,routes,ipver){jsLocalResController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsLocalResView,options:{slider:true,nocollapse:true,title:"localres",descText:"localresDesc"}};this.service=service;this.routes=routes;this.newRoutes=[];var arr=[];var alias;this.n=10;for(var i=0;i<this.n;i++){alias="ip"+i;arr.push({alias:alias,name:lng("ipaddr")+" "+(i+1),type:"ip",version:ipver,options:{optional:true}});this.newRoutes.push({ip:"",netmask:service.mask,gw:"",iface:service.iface,pos:-1});}
var r;var j=0;for(var i=0;i<routes.length;i++){r=routes[i];if(r.iface==service.iface&&r.netmask==service.mask){arr[j].value=r.ip;this.newRoutes[j].ip=r.ip;this.newRoutes[j].pos=i;j++}
if(j==this.n)break;}
this.describe(arr);}
extend(jsLocalResController,jsFieldSetController);function jsLocalResView(ctrl,viewInx,options){jsLocalResView.superclass.constructor.call(this,ctrl,viewInx,options);this.updateModel=function(){var res=jsLocalResView.superclass.updateModel.call(this);if(res){var child;var value;for(var i=0;i<this.ctrl.n;i++){child=this.getChild("ip"+i);this.ctrl.newRoutes[i].ip=child.ctrl.model.toString();}}
return res;}}
extend(jsLocalResView,jsFieldSetClientView);function pageSyslog(){pageSyslog.superclass.constructor.call(this);this.loglist=null;this.add(new node(),"log");this.updateModel=function(status){this.status=status;}
this.exportlog=function(){device.system.log();}
this.updateView=function(phase){pageSyslog.superclass.updateView.apply(this,arguments);if(phase=="back"){this.cleanButtonBar()
.addButton("refresh")
.getButton("refresh")
.bind("click.button",callback(this,function(){this.update();}));if(this.loglist!=null){this.addButton("button_export")
.getButton("button_export")
.bind("click.button",callback(this,function(){this.exportlog();}));}else{this.loglist='Log not found!';}
var log=this.child("log");log.$box.html($("\
    <div class='console syslog'>\
     <pre>"+this.loglist+"</pre>\
    </div>\
   "));}}
this.update=function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_SYSLOG_READ,callback(this,function(data){this.loglist=(is.RPC_SUCCESS(data))?data.resident.list:null;this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);}
extend(pageSyslog,node);function pageMACFilter(){pageMACFilter.superclass.constructor.call(this);this.macfilter=null;this.lanClients=null;this.$grid=null;this.add(new nodeCaption("macfLabel","macfDescText"));if(!disableFlag(somovdParams.CONFIG_ID_MAC_FILTER)){this.add(new nodeComboText("dhcpMacClients",null,{header:[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}],index:"mac",blank:"dhcpMacClientsSel2"}),"mac")};this.add(new node(),"grid");if(disableFlag(somovdParams.CONFIG_ID_MAC_FILTER))
this.child("grid").$box.find('.add').children('div').addClass('disable');this.updateModel=function(status){status.error|=!this.$grid.cleanErrors().checkMandatory(true);this.status=status;}
this.updateView=function(phase){pageMACFilter.superclass.updateView.apply(this,arguments);if(phase=='back'){this.$grid=this.cleanButtonBar().child("grid").$box.html("\
    <div class='grid rm'></div>\
    <div class='buttonsInline'>\
     <div class='button add'></div>\
    </div>\
   ").find('.grid').lightUIGrid([{index:"address",name:"hwaddr"},{index:"enable",name:"action"}],0,{selectable:true});this.$grid.bind("stopEditing.grid",callback(this,function(event,$cell){this.$grid.cleanErrors();}));this.$grid.colEditable("address","mac",{mandatory:true,unique:'soft'})
.colEditable("enable","select",{options:{"macfAccept":"ACCEPT","macfDrop":"DROP"}});this.child("grid").$box.find('.add')
.lightUIButton("add")
.bind("click.button",callback(this,function(){this.$grid.addRow().row("last").col("address").trigger("click");}));if(disableFlag(somovdParams.CONFIG_ID_MAC_FILTER))
this.child("grid").$box.find('.add').children('div').addClass('disable');for(var i=0;this.macfilter&&i<this.macfilter.length;i++){var mfilter=this.macfilter[i];var $row=this.$grid.addRow().row("last");$row.col("address").fieldval(mfilter.mac);$row.col("enable").fieldval(mfilter.enable);}
this.$grid.resetAll();if(!disableFlag(somovdParams.CONFIG_ID_MAC_FILTER)){var mac=this.child('mac').cleanRows();for(var i=0;i<this.lanClients.length;i++){var obj=this.lanClients[i];mac.addRow(obj.ip,obj.mac,obj.hostname);}}
this.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(gridActionConverter(this.$grid));this.$grid.selection().removeRow();}}));if(disableFlag(somovdParams.CONFIG_ID_MAC_FILTER))
this.getButton("button_save").children('div').addClass('disable');}}
this.save=function(actions){if(actions.count){rootView.showModalOverlay();var query={remove:[],write:[]};if(actions.deleted.length&&actions.deleted.length==this.$grid.nrow()-this.$grid.newRows().length){query.remove.push([somovdParams.CONFIG_ID_MAC_FILTER,{clear:true}]);}else{for(var i=0;i<actions.deleted.length;i++){query.remove.push([somovdParams.CONFIG_ID_MAC_FILTER,this.macfilter[actions.deleted[i]],actions.deleted[i]]);}}
var temp=actions.changed.concat(actions.added);var r_temp=actions.r_changed.concat(actions.r_added);for(var i=0;i<temp.length;i++){var $row=this.$grid.row(temp[i]);query.write.push([somovdParams.CONFIG_ID_MAC_FILTER,{'mac':$row.col("address").fieldval(),'enable':$row.col("enable").fieldval()},$row.isNew()?-1:r_temp[i]]);}
device.config.multi(query,callback(this,function(data){this.update();}));}}
this.update=function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_MAC_FILTER,somovdParams.CONFIG_ID_NEIGHBOUR],callback(this,function(data){this.macfilter=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident.macfilter:null;this.lanClients=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident:[];this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);this.bind("ruleselect",function(status,value){switch(status.target.getAlias()){case"mac":var rule=value;var $row=this.$grid.addRow().row("last");$row.col("address").fieldval(rule.col("mac").fieldval()).trigger("click");break;}});}
extend(pageMACFilter,node);function jsQCMIPTVController(){jsQCMIPTVController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsQCMIPTVClientView,options:{}};this.addChild(new jsIptvMasterController(false,true),'iptv');this.addChild(new jsInputController(),'status');}
extend(jsQCMIPTVController,jsFieldSetController);function jsQCMIPTVClientView(ctrl,viewInx,options){var obj;options.nothing=true;options.simple=true;options.wizard=false;obj=ctrl.getChild("status");obj.nextIface="text";obj.ifaceTypes.text.options={humanName:"quickIPTVSave",hide:true,inputPadding:"250px"};obj.model.value="<img src='/image/wait.gif' style='vertical-align:top' />";jsQCMIPTVClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsQCMIPTVClientView.superclass.drawView.call(this);if($(this.childBoxSel).find('div.description').length==0){$(this.childBoxSel).append("<div class='description' style='margin-top: 30px;'></div>");}
$(this.childBoxSel).find('div.description').html("<h4>"+lng('quickDescIPtv')+"</h4>");}}
extend(jsQCMIPTVClientView,jsFieldSetClientView);function jsIptvMasterController(blockView,wizardView){jsIptvMasterController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsIptvMasterClientView};this.addIface();this.nextIface="client";}
extend(jsIptvMasterController,jsFieldSetController);function jsIptvMasterClientView(ctrl,viewInx,options){this.drawView=function(){jsIptvMasterClientView.superclass.drawView.call(this);var page=this.page=new pageIPTV();page.locate(this.viewBoxSel);page.$buttonBar=$('#pageToolbarButtons');page.emit('updaterq')}
jsIptvMasterClientView.superclass.constructor.call(this,ctrl,viewInx,options);}
extend(jsIptvMasterClientView,jsFieldSetClientView);function jsQCMFinishController(){jsQCMFinishController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsQCMFinishClientView,options:{}};this.addChild(new jsInputController(),'status');}
extend(jsQCMFinishController,jsFieldSetController);function jsQCMFinishClientView(ctrl,viewInx,options){var obj;options.nothing=true;options.simple=true;options.wizard=false;obj=ctrl.getChild("status");obj.nextIface="text";obj.ifaceTypes.text.options={humanName:"quickCompleting"};obj.model.value=lng('quickSaveConfirm');jsQCMFinishClientView.superclass.constructor.call(this,ctrl,viewInx,options);}
extend(jsQCMFinishClientView,jsFieldSetClientView);function jsQCMWifiController(){jsQCMWifiController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsQCMWifiClientView,options:{}};}
extend(jsQCMWifiController,jsFieldSetController);function jsQCMWifiClientView(ctrl,viewInx,options){jsQCMWifiClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsQCMWifiClientView.superclass.drawView.call(this);var wizard=window.wifiWizard=new pageWiFiWizard();wizard.locate(this.options.viewBoxSel).$buttonBar=$("#pageToolbarButtons");}}
extend(jsQCMWifiClientView,jsFieldSetClientView);function jsQuickConfigMasterController(){jsQuickConfigMasterController.superclass.constructor.call(this);this.changeModel(new jsModel());this.ifaceTypes.client={type:jsQuickConfigMasterClientView,options:{inputPadding:"200px"}};this.ifaceTypes.server={type:jsQuickConfigMasterServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();this.nextIface="client";this.onupdaterq=function(){this.getChild("inet").event("updaterq");return false;}
this.onmodeswitch=function(value){this.getChild("inet").event("modeswitch",value);return false;}
this.addChild(new jsPreMasterController(),'inet');this.addChild(new jsQCMWifiController(),'wifi');this.addChild(new jsQCMIPTVController(),'iptv');this.addChild(new jsQCMFinishController(),'finish');this.addEventHandler("updaterq",this.onupdaterq);this.addEventHandler("modeswitch",this.onmodeswitch);}
extend(jsQuickConfigMasterController,jsFieldSetController);function jsQuickConfigMasterClientView(ctrl,viewInx,options){var obj;options.nothing=true;options.simple=true;options.wizard=true;ctrl.getChild("inet").ifaceTypes.client.options.buttonsInline=false;jsQuickConfigMasterClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsQuickConfigMasterClientView.prototype.ontabclick=null;this.drawView=function(){if(!this.viewBoxSel){this.viewBoxSel=this.options.viewBoxSel;}
jsQuickConfigMasterClientView.superclass.drawView.call(this);this.hideButton('prev');this.hideButton('skip');this.hideButton('next');this.hideButton('save');}
this.enableButtons=function(on){if(on){this.enableButton('prev');this.enableButton('next');this.enableButton('skip');}else{this.disableButton('prev');this.disableButton('next');this.disableButton('skip');}}
this.beforeLogic=function(){this.showModalOverlay();this.enableButtons(false);switch(this.getChild(this.activeTab).ctrl.alias){case'iptv':function onApply(){clearTimeout(tt);rootView.hideWaitScreen();this.ctrl.event("iptvSaved");this.ctrl.event("iptvready",null,true);}
this.getChild('iptv','iptv').page.updateModel();var tt=setTimeout(callback(this,onApply),webadminParams.VLAN_APPLY_TIME*2);rootView.showWaitScreen(lng("pleaseWait"),webadminParams.VLAN_APPLY_TIME*3);devu.iptv.push(callback(this,onApply));break;}}
this.afterLogic=function(){var lastInx=this.ctrl.children.length-1;this.enableButtons(true);if(this.activeTab==lastInx){this.hideButton("next");this.hideButton("skip");this.showButton("save");}else{this.showButton("next");this.showButton("skip");this.hideButton("save");}
if(this.activeTab==1){this.hideButton("prev");}else{this.showButton("prev");}
switch(this.getChild(this.activeTab).ctrl.alias){case'iptv':if(!this.getChild('iptv','iptv').options.ishidden){$('#uiSTBPort>.customCheckbox>input').removeAttr('checked');$('#uiSTBPort>.customCheckbox').removeClass("on").addClass("off");}
this.getChild('iptv','iptv').show();this.getChild('iptv','status').hide();break;case'finish':this.getChild('iptv','status').show();break;}}
this.goNext=function(){this.switchChild(this.activeTab+1);this.afterLogic();}
this.goPrev=function(){this.switchChild(this.activeTab-1);this.afterLogic();}
this.goSkip=function(){switch(this.getChild(this.activeTab).ctrl.alias){case'iptv':$('#uiSTBPort>.customCheckbox>input').removeAttr('checked');this.beforeLogic();break;}}
this.goSave=function(){this.showModalOverlay();this.ctrl.event('saverq');}
this.options.buttons=[{name:"prev",value:"button_prev",handler:this.goPrev},{name:"next",value:"button_next",handler:this.beforeLogic},{name:"skip",value:"button_skip",handler:this.goSkip},{name:"save",value:"button_save",handler:this.goSave}];this.onupdaterq=function(){this.showModalOverlay();return true;}
this.onupdmodel=function(){this.hideModalOverlay();return true;}
this.onwanready=function(){window.wifiWizard.emit("updaterq");window.wifiWizard.quickMasterCtrl=this.ctrl;this.switchChild(1);return false;}
this.onwifiready=function(){if(!hideFlag(somovdParams.CONFIG_ID_GROUP_VLAN)){this.ctrl.event('updaterq2');this.drawButtons();this.switchChild("iptv");this.hideButton('prev');this.hideButton('save');}
else{this.drawButtons();this.switchChild("finish");this.hideButton('prev');this.hideButton('next');this.hideButton('skip');}}
this.oniptvready=function(){this.drawButtons();this.switchChild("finish");this.hideButton('prev');this.hideButton('next');this.hideButton('skip');}
this.activeTab=0;this.bind("updaterq",this.onupdaterq);this.bind("updaterq2",this.onupdaterq);this.bind("updmodel",this.onupdmodel);this.bind("wanready",this.onwanready);this.bind("wifiready",this.onwifiready);this.bind("iptvready",this.oniptvready);}
extend(jsQuickConfigMasterClientView,jsFieldSetClientView);function jsQuickConfigMasterServerView(ctrl,viewInx,options){jsQuickConfigMasterServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data&&!data.baddata){if(this.mode=="update"&&data.rq){}else if(this.mode=="save"){alert(lng('quickComplite'));document.location.href="index.cgi";}}}
this.prepareData=function(){var obj;var jsonOutObj;var ctrl=this.ctrl;switch(this.mode){case"update":var index=0;var i=0;index+=3;index+=1;obj={v2:"y",rq:index};obj['res_json'+i]='y';obj['res_config_action'+i]=somovdParams.CONFIG_ACTION_READ;obj['res_config_id'+i]=somovdParams.CONFIG_ID_WIFI;obj['res_struct_size'+i]=0;i++;obj['res_json'+i]='y';obj['res_config_action'+i]=somovdParams.CONFIG_ACTION_READ;obj['res_config_id'+i]=somovdParams.CONFIG_ID_GET_WIFI_COUNTRYS;obj['res_struct_size'+i]=0;i++;obj['res_json'+i]='y';obj['res_config_action'+i]=somovdParams.CONFIG_ACTION_READ;obj['res_config_id'+i]=somovdParams.CONFIG_ID_GET_WIFI_CHANELS;obj['res_struct_size'+i]=0;i++;obj['res_json'+i]='y';obj['res_config_action'+i]=somovdParams.CONFIG_ACTION_READ;obj['res_config_id'+i]=somovdParams.CONFIG_ID_GROUP_VLAN;obj['res_struct_size'+i]=0;this.addToRequest(obj);break;case"save":obj={v2:"y",rq:"y",res_cmd:20,res_buf:null,res_cmd_type:"bl"};this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.mode="update";this.updateView();}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.onwifirq=function(){this.mode="wifi";this.updateView();}
this.mode="update";this.bind("updaterq2",this.onupdaterq);this.bind("saverq",this.onsaverq);this.bind("wifirq",this.onwifirq);}
extend(jsQuickConfigMasterServerView,jsSSideView);function jsMainMenuController(nodeName,options){jsMainMenuController.superclass.constructor.call(this,nodeName,options);this.ifaceTypes.tree={type:jsMainMenuView,options:{hide:(options&&options.hide)?true:false}};}
extend(jsMainMenuController,jsMenuController);function jsMainMenuView(ctrl,viewInx,options){jsMainMenuView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){jsMainMenuView.superclass.drawView.call(this);var parent=this.getParent();if(parent instanceof jsMenuView&&parent.root&&this.ctrl.thisInx==(parent.ctrl.children.length-1)){$(this.viewBoxSel).addClass("last");}}}
extend(jsMainMenuView,jsMenuView);function jsMiscSettingsModel(service){jsMiscSettingsModel.superclass.constructor.call(this);this.service=service;}
extend(jsMiscSettingsModel,jsModel);function jsMiscSettingsController(service,isadding){jsMiscSettingsController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsMiscSettingsClientView};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsMiscSettingsSummaryView};this.ifaceTypes.summary.options={};this.changeModel(new jsMiscSettingsModel(service));this.addChild(new jsDecorController(),"desc");this.addChild(new jsInputController(service.table_alt),"table_alt");this.addChild(new jsInputController(service.rip),"rip");this.addChild(new jsWANIGMPController(service),"igmp");this.addChild(new jsInputController(service.nat),"nat");this.addChild(new jsInputController(service.firewall),"firewall");this.addChild(new jsInputController(service.ping_respond),"ping");this.getChild("igmp").nextIface="client";}
extend(jsMiscSettingsController,jsFieldSetController);function jsMiscSettingsClientView(ctrl,viewInx,options){var obj;var service=ctrl.model.service;var level=ctrl.model.service.level;var opt;obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={};opt=obj.ifaceTypes.separator.options;opt.label="wanMiscSect";opt.hide=service.blocks||!service.is_wan||(!options.inwizard&&(service.contype.match(/l2tp/)||service.contype.match(/pptp/)));var alt_contypes=['dynamic','dynamicv6','static','staticv6','pppoe','pppoev6','pppoedual','pptp','pptpv6','statpptp','statpptpv6','dynpptp','dynpptpv6','l2tp','l2tpv6','dynl2tp','dynl2tpv6','statl2tp','statl2tpv6'];obj=ctrl.getChild("table_alt");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanIsolation",valset:{on:true,off:false},hide:(alt_contypes.indexOf(service.contype)==-1)};obj=ctrl.getChild("igmp");obj.ifaceTypes.client.options={valset:{on:true,off:false}};opt=obj.ifaceTypes.client.options;opt.hide=(service.contype=="3g"||service.contype=="lte"||service.type=="pppv6"||service.type=="ipv6"||service.level==4);if(level==4){opt.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L4_IGMP);}
else{opt.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L4_IGMP);}
obj=ctrl.getChild("rip");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanRip",valset:{on:true,off:false},hide:!service.is_wan};obj.ifaceTypes.checkbox.options.hide|=(service.contype=="3g"||service.contype=="lte"||service.contype=="624");if(level==4){obj.ifaceTypes.checkbox.options.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L4_RIP);}
else{obj.ifaceTypes.checkbox.options.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L3_RIP);}
obj.ifaceTypes.checkbox.options.hide|=true;obj=ctrl.getChild("nat");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanNat",valset:{on:true,off:false},hide:!service.is_wan};obj.ifaceTypes.checkbox.options.hide|=(service.contype=="624"||service.type=="pppv6"||service.type=="ipv6");if(level==4){obj.ifaceTypes.checkbox.options.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L4_NAT);}
else{obj.ifaceTypes.checkbox.options.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L3_NAT);}
obj=ctrl.getChild("firewall");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanFirewall",valset:{on:true,off:false},hide:!service.is_wan};if(level==4){obj.ifaceTypes.checkbox.options.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L4_FIREWALL);}
else{obj.ifaceTypes.checkbox.options.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_MISC_L3_FIREWALL);}
obj=ctrl.getChild("ping");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanPingRespond",valset:{on:true,off:false},hide:!service.is_wan};this.updateModel=function(){var res=jsMiscSettingsClientView.superclass.updateModel.call(this);if(res){var service=this.ctrl.model.service;service.rip=this.getChild("rip").ctrl.model.value;service.table_alt=this.getChild("table_alt").ctrl.model.value;service.nat=this.getChild("nat").ctrl.model.value;service.firewall=this.getChild("firewall").ctrl.model.value;service.ping_respond=this.getChild("ping").ctrl.model.value;}
return res;}
this.onmodeswitch=function(value){if(this.options.brief){this.hide();}
else{this.show();}
return false;}
this.drawView=function(){jsMiscSettingsClientView.superclass.drawView.call(this);this.onmodeswitch();}
this.brief=service.wizard;jsMiscSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("modeswitch",this.onmodeswitch);}
extend(jsMiscSettingsClientView,jsFieldSetClientView);function jsMiscSettingsSummaryView(ctrl,viewInx,options){var obj=ctrl.getChild("igmp");obj.nextIface="summary";obj.ifaceTypes.summary.options={valset:{on:true,off:false}};var service=ctrl.model.service;var level=ctrl.model.service.level;obj.ifaceTypes.summary.options.hide=(service.contype=="3g"||service.contype=="lte"||service.type=="pppv6"||service.type=="ipv6"||service.level==4);jsMiscSettingsSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.drawView=function(){this.getChild("desc").options.hide=true;jsMiscSettingsSummaryView.superclass.drawView.call(this);}
this.updateView=function(){jsMiscSettingsSummaryView.superclass.updateView.call(this);this.getChild("desc").hide();}
this.bind("modeswitch",function(){return false;});}
extend(jsMiscSettingsSummaryView,jsMiscSettingsClientView);function jsNeedPinModel(){jsNeedPinModel.superclass.constructor.call(this);this.pinInfo=null;}
extend(jsNeedPinModel,jsModel);function jsNeedPinController(){jsNeedPinController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsNeedPinClientView};this.ifaceTypes.server={type:jsNeedPinServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.changeModel(new jsNeedPinModel());this.nextIface="server";this.addIface();this.addChild(new jsInputExController(),"hint");this.addChild(new jsInputExController(),"pin");this.addChild(new jsInputExController(),"new_pin");this.onupdaterq=function(){return true;}
this.onupdmodel=function(){return true;}
this.firstSave=false;this.addEventHandler("updaterq",this.onupdaterq);this.addEventHandler("updmodel",this.onupdmodel);}
extend(jsNeedPinController,jsWindowController);function jsNeedPinClientView(ctrl,viewInx,options){var obj;obj=ctrl.getChild('hint');obj.nextIface='texter';obj.ifaceTypes.texter.options={humanName:'g3_pin_puk_attempt',hide:true};obj=ctrl.getChild('pin');obj.nextIface='inputer';obj.ifaceTypes.inputer.options={humanName:'PIN-код'};obj=ctrl.getChild('new_pin');obj.nextIface='inputer';obj.ifaceTypes.inputer.options={humanName:'g3_pin_code_new',hide:true};this.enter=function(){var pinInfo=this.ctrl.model.pinInfo;var rePin=new RegExp('^[0-9]{4}$','g');var rePuk=new RegExp('^[0-9]{8}$','g');this.getChild("pin").updateModel();this.getChild("new_pin").updateModel();var pin=this.getChild("pin").ctrl.model.value;var new_pin=this.getChild("new_pin").ctrl.model.value;if((pinInfo.pinstatus==1&&rePin.test(pin))||(pinInfo.pinstatus>1&&rePuk.test(pin)&&rePin.test(new_pin))){this.ctrl.event("saverq");this.hide();}else{this.bounce();}}
this.cancel=function(){this.hide();}
this.showMessage=function(s,text){$(s).html(lng(text));$(s).fadeIn(1000,function(){setTimeout(function(){$(s).fadeOut(10000);},10000);});}
this.showError=function(text){this.showMessage("#pincodeError",text);}
this.showSuccess=function(text){this.showMessage("#pincodeSuccess",text);}
options.title='menu_g3pin_';options.draggable=true;options.action=[{name:'button_input',func:this.enter},{name:'Отмена',func:this.cancel}];jsNeedPinClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.onupdmodel=function(model){var pinInfo=this.ctrl.model.pinInfo;if(pinInfo&&!no(pinInfo.pin_off)){var code='';var att_total;var att_left;var text=null
switch(pinInfo.pinstatus){case 1:code='g3_pin_code';att_total=3;att_left=pinInfo.pin_att_left;if(is.set(att_total)&&is.set(att_left)){text="g3PinWrongPin";}
else{text="g3PinNeedPin";}
this.show();break;case 2:code='g3_puk';att_total=pinInfo.puk_att_total;att_left=pinInfo.puk_att_left;this.getChild("new_pin").show();if(is.set(att_total)&&is.set(att_left)){if(att_left==att_total){text="g3PinWrongPin";}
else{text="g3PinWrongPuk";}}
else{text="g3PinNeedPuk";}
this.show();break;case 4:code='g3_puk2';att_total=pinInfo.puk2_att_total;att_left=pinInfo.puk2_att_left;if(is.set(att_total)&&is.set(att_left)){text="g3PinWrongPuk2";}
else{text="g3PinNeedPuk2";}
this.show();break;case-1:alert(lng("g3_pin_modem_not_accessible"));this.disableAction('button_input');return false;break;}
if(this.ctrl.firstSave){if(text){this.showError(text);}
else{this.showSuccess("g3PinSuccess");}}
var hint=this.getChild('hint');if(is.set(att_total)){hint.show();hint.ctrl.model.value=att_left+'/'+att_total;hint.updateView();}
else{hint.hide();}
this.getChild('pin').options.humanName=code;this.getChild('pin').drawView();}
return false;}
this.bind("updmodel",this.onupdmodel);}
extend(jsNeedPinClientView,jsWindowClientView);function jsNeedPinServerView(ctrl,viewInx,options){jsNeedPinServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;this.ctrl.model.pinInfo=null;if(data&&!data.baddata&&data.resident){this.ctrl.model.pinInfo=data.resident;}
if(this.mode&&this.mode!="update"){this.ctrl.event("updaterq");}}
this.prepareData=function(){var obj;var jsonOutObj;var ctrl=this.ctrl;switch(this.mode){case"save":obj={v2:"y",rq:"y",res_json:"y",res_data_type:"json",res_config_action:somovdParams.CONFIG_ACTION_EDIT,res_config_id:somovdParams.CONFIG_ID_3G_PIN_NEW,res_struct_size:0};var newpin='';if(ctrl.model.pinInfo.pinstatus==2){newpin=ctrl.getChild("new_pin").model.value;}
ctrl.firstSave=true;jsonOutObj={pin:ctrl.getChild("pin").model.value,newpin:newpin,pinoff:ctrl.model.pinInfo.pin_off};obj.res_buf=$.toJSON(jsonOutObj);this.addToRequest(obj);break;case"update":obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_config_id:somovdParams.CONFIG_ID_3G_PIN_NEW,res_struct_size:0};this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.mode="update";this.updateView();}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onsaverq);}
extend(jsNeedPinServerView,jsSSideView);function pageNetStat(){pageNetStat.superclass.constructor.call(this);this.netlist=null;this.rqId=-1;this.virgin=true;this.refreshTime=3000;this.refreshId=null;this.updateView=function(phase){pageNetStat.superclass.updateView.apply(this,arguments);if(phase=='back'){this.$grid=this.$box.html("\
    <div class='grid'></div>\
   ").find('.grid').lightUIGrid([{index:"name",name:"nstName"},{index:"ip",name:"nstIp"},{index:"gw",name:"nstGw"},{index:"mac",name:"nstMac"},{index:"mtu",name:"nstMtu"},{index:"rxtx",name:"nstRxTx"}],0);if(this.netlist){for(var i in this.netlist){var stateStr,stateImg,stateColor,rxtx='-',empty='-',name='-';var iface=this.netlist[i];name=iface.name?iface.name:iface.port?iface.port:i;if(!iface.state||iface.state=="down"){stateStr=lng("nstStateDown");stateImg="<img src=\"image/ledred.gif\" />";stateColor="red";}
else if(iface.state=="up"){stateStr=lng("nstStateUp");stateImg="<img src=\"image/ledgreen.gif\" />";stateColor="green";rxtx=lookSize(iface.rx).toString()+" / "+lookSize(iface.tx).toString();}
else{stateStr=iface.state;stateImg="<img src=\"image/ledyellow.gif\" />";stateColor="yellow";}
var shortName=name;if(is.string(name)){if(name.length>15){shortName=name.substr(0,13)+"..";}}
if(is.string(iface.mask)&&is.string(iface.ip)&&!iface.ip.match(/:/)){var ipv4=new IPv4(iface.ip,iface.mask);ip=ipv4.toString(true);}
else{ip=iface.ip?iface.ip:empty;}
var $row=this.$grid.addRow().row("last");$row.col("name").attr("title",name+" ("+stateStr+")")
.html("<span>"+shortName+"</span>")
.find("span")
.css("color",stateColor);$row.col("ip").html(ip);$row.col("gw").html(iface.gw?iface.gw:empty);$row.col("mac").html(iface.mac?iface.mac:empty);$row.col("mtu").html(no(iface.mtu)?empty:iface.mtu.toString());$row.col("rxtx").html(rxtx);}}}}
this.update=function(){if(this.virgin)rootView.showModalOverlay();this.rqId=device.config.read(somovdParams.CONFIG_ID_NET_STAT,callback(this,function(data){this.netlist=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();this.startRefresh(this.refreshTime);}));this.virgin=false;}
this.startRefresh=function(period){this.refreshId=setTimeout(callback(this,this.update),period);return this;}
this.stopRefresh=function(){device.stop(this.rqId);clearTimeout(this.refreshId);this.virgin=true;return this;}
this.bind("updaterq",function(){this.stopRefresh().startRefresh(0);});this.bind("stoprefreshrq",function(){this.stopRefresh();});if(!window.engine||!window.engine.candyBlack){this.onupdaterq=function(){this.updateView();}
this.bind("updaterq",this.onupdaterq);}}
extend(pageNetStat,node);function jsNotifierModel(){jsNotifierModel.superclass.constructor.call(this);this.list=[];this.isMSGExist=function(notifierInfo){for(var i=0;i<this.list.length;i++){if(this.list[i].msg==notifierInfo.msg&&this.list[i].event==notifierInfo.event){return true;}}
return false;}
this.remove=function(from,to){var rest=this.list.slice((to||from)+1||this.list.length);this.list.length=from<0?this.list.length+from:from;return this.list.push.apply(this.list,rest);}}
extend(jsNotifierModel,jsModel);function jsNotifierController(){jsNotifierController.superclass.constructor.call(this,null,{});this.ifaceTypes.tree={type:jsNotifierView,options:{}};this.ifaceTypes.getinfo={type:jsNotifierGetInfoView,options:{action:"index.cgi"}};this.changeModel(new jsNotifierModel());this.addMsg=function(notifierInfo,name){if(window.DISABLE_NOTIFIER)return;if(!this.model.isMSGExist(notifierInfo)){this.model.list.push(notifierInfo);this.addChild(new jsNotifierItemController(notifierInfo,{frame:this}),name);}}
this.removeMsg=function(name){this.event("deleteitem",this.getInxByAlias(name));}}
extend(jsNotifierController,jsFastmenuController);function jsNotifierView(ctrl,viewInx,options){jsNotifierView.superclass.constructor.call(this,ctrl,viewInx,options);this.collapseAll=function(){var drawParentView=context(this).callback(this.drawParentView);$(this.viewBoxSel).unbind('mouseleave');$(this.viewBoxSel+' ul.fastmenuItem>li.notifierItem').fadeOut(400,function(){if($(this).is('.last')){drawParentView();}else{$(this).remove();}});this.rolledUp=true;return false;}
this.ondeleteitem=function(index){var drawParentView=context(this).callback(this.drawParentView);this.ctrl.unlinkChild(index);this.ctrl.model.remove(index);$(this.viewBoxSel).unbind('mouseleave');$(this.viewBoxSel+' ul.fastmenuItem>li.notifierItem:eq('+index+')').fadeOut('slow',function(){drawParentView();});}
this.blink=function(){if($(this.myBoxSel+'>img').attr('src').indexOf('off')>=0){$(this.myBoxSel+'>img').attr('src','../image/light_on.gif')}else{$(this.myBoxSel+'>img').attr('src','../image/light_off.gif')}}
this.startBlink=function(){this.intervalID=setInterval(context(this).callback(this.blink),250);}
this.stopBlink=function(){clearInterval(this.intervalID);this.intervalID=null;}
jsNotifierView.prototype.drawView=function(){this.stopBlink();this.constructor(this.ctrl,this.viewInx,this.options?this.options:{});jsNotifierView.superclass.drawView.call(this);if(this.ctrl.level==1){$(this.viewBoxSel).addClass('notifier');$(this.myBoxSel).html("<img src='../image/light_off.gif' />&nbsp;");var lastItem=$("<li class='notifierItem last' />");if(this.ctrl.children.length>0){this.startBlink();var span=$("<span class='msgCount'>"+this.ctrl.children.length+"</span>");$(this.viewBoxSel+'>.temp').append($(span));var a=$("<a href='#'>"+lng('rollup_notifications')+"</a>");$(this.viewBoxSel+' ul.fastmenuItem').append($(lastItem).append($(a)));$(a).click(context(this).callback(this.collapseAll));}else{$(this.viewBoxSel).append("<div class='temp'><ul class='fastmenuItem'></ul></div>")
var span=$("<span>"+lng('empty_notifications')+"</span>");$(this.viewBoxSel+' ul.fastmenuItem').append($(lastItem).append($(span)));}
$(this.myBoxSel).bind("mouseenter",callback(this,function(){this.rolledUp=false;}));if(this.showAlways&&!this.rolledUp){$(this.viewBoxSel).trigger("mouseenter");$(this.viewBoxSel).off("mouseleave");}else{$(this.viewBoxSel).mouseenter(function(){$(this).addClass('selected');}).mouseleave(function(){$(this).removeClass('selected');}).click(function(){$(this).find('.action>a').click();});}}}
this.onshowalways=function(){$(this.viewBoxSel).trigger("mouseenter");$(this.viewBoxSel).off("mouseleave");this.showAlways=true;this.rolledUp=false;return false;}
this.oncancelshowalways=function(){$(this.viewBoxSel).mouseleave(function(){$(this).removeClass('selected');});this.showAlways=false;this.drawParentView();return false;}
this.onupdmodel=function(model){this.drawView();}
this.ondeleteall=function(){$(this).remove();}
this.drawParentView=function(){this.stopBlink();this.getParent().drawView();}
this.intervalID=null;this.bind("deleteitem",this.ondeleteitem);this.bind("updmodel",this.onupdmodel);this.bind("showalways",this.onshowalways);this.bind("cancelshowalways",this.oncancelshowalways);this.bind("deleteall",this.ondeleteall);}
extend(jsNotifierView,jsFastmenuView);function jsNotifierGetInfoView(ctrl,viewInx,options){jsNotifierGetInfoView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var id=this.options.sender.responseData.status;switch(id){case 12:this.ctrl.addMsg({icon:'../image/notifiers/reboot.png',event:"cfgsaverebootrq",msg:'conf_change_warning',time:new Date(),action:{name:'button_save_reboot',func:function(){rootCtrl.event("cfgsaverebootrq");}}});break;case 13:this.ctrl.addMsg({icon:'../image/notifiers/save.png',msg:'conf_change_warning_save',event:"cfgsaverq",time:new Date(),action:{name:'button_deflang_save',func:function(){rootCtrl.event("cfgsaverq");}}});break;}}
this.prepareData=function(){var obj=new Object();obj["res_cmd"]=19;obj["res_cmd_type"]="bl";obj["v2"]="y";obj["rq"]="y";this.addToRequest(obj);}
this.onmuterq=function(){this.stopRefresh();return false;}
this.bind("muterq",this.onmuterq);}
extend(jsNotifierGetInfoView,jsSSideView);function jsNotifierItemModel(notifierInfo){jsNotifierItemModel.superclass.constructor.call(this);this.notifierInfo=notifierInfo;}
extend(jsNotifierItemModel,jsModel);function jsNotifierItemController(notifierInfo,options){jsNotifierItemController.superclass.constructor.call(this);this.changeModel(new jsNotifierItemModel(notifierInfo));this.ifaceTypes.tree={type:jsNotifierItemView};}
extend(jsNotifierItemController,jsController);function jsNotifierItemView(ctrl,viewInx,options){jsNotifierItemView.superclass.constructor.call(this,ctrl,viewInx,options);this.clickItem=function(elem){var index=$(this.viewBoxSel).index();this.ctrl.getParent().event('deleteitem',index);return false;}
this.doAction=function(action){action.data();return false;}
jsNotifierItemView.prototype.drawView=function(){var notifierInfo=this.ctrl.model.notifierInfo;var time=notifierInfo.time.getHours()+':'+notifierInfo.time.getMinutes()+':'+notifierInfo.time.getSeconds();var htmlToDraw='';htmlToDraw="<div class='icon'><img src="+notifierInfo.icon+" /></div>";htmlToDraw+="<div class='info'>";htmlToDraw+="<div class='caption'>";htmlToDraw+="<div class='action'><a href='#'>"+lng(notifierInfo.action.name)+"</a></div>";htmlToDraw+="<div class='time'>("+time+")</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="<div class='message'>"+lng(notifierInfo.msg)+"</div>";htmlToDraw+="</div><div class='clear'></div>";$(this.viewBoxSel).addClass('notifierItem');$(this.viewBoxSel).html(htmlToDraw);$(this.viewBoxSel+' .action>a').bind('click',notifierInfo.action.func,context(this).callback(this.doAction));$(this.viewBoxSel+' .action>a').bind('click',context(this).callback(this.clickItem));jsNotifierItemView.superclass.drawView.call(this);}}
extend(jsNotifierItemView,jsCSideView);function pageNTP(){pageNTP.superclass.constructor.call(this);this.ntp=null;var timezone={};for(var i=12;i>=-12;i--){timezone[((i>0)?"ntpTzMinus"+i:"ntpTz"+Math.abs(i))]=i;switch(i){case 5:case 4:timezone["ntpTzMinus"+(i-1)+"30"]=(i-1)+":30";break;case-3:case-4:case-5:case-6:case-9:timezone["ntpTz"+Math.abs(i)+"30"]=i+":30";if(i==-5)timezone["ntpTz"+Math.abs(i)+"45"]=i+":45";break;default:break;}}
this.add(new nodeSelect("ntpMode"),"mode");var auto=this.add(new node(),"auto")
.child("auto")
.add(new nodeSelect("ntpTz",''),"hour")
.add(new nodeTextArea("ntpServers",'pool.ntp.org',{rows:5,mandatory:true,re:[callback(this,function(value){var err=null;var list=new Array();var errlist=new Array();var tmplist=value.replace(/(,|;|\ )/g,'\n').split('\n');for(var i=0;i<tmplist.length;i++){var addr=$.trim(tmplist[i]);if(addr!=''){if(validate_domain_name(addr)){list.push(addr);}else{err=true;errlist.push(addr);}}}
if(err){err=lng("ntpAddressWrong")+" "+errlist.join(", ");}else{auto.child("servers").val(list.join('\n'));}
return err;})]}),"servers");auto.add(new nodeCheckBox("ntpUseDhcp"),"use_dhcp");var manual=this.add(new node({hidden:true}),"manual")
.child("manual")
.add(new nodeSelect("ntpMonth"),"month")
.add(new nodeSelect("ntpDay"),"day")
.add(new nodeSelect("ntpYear"),"year")
.add(new nodeSelect("ntpHour"),"hour")
.add(new nodeSelect("ntpMinute"),"minute");this.listen("mode","endform fieldchange",function(status,value){var detectTZ=this.getButton("ntpDetectTZ");if(value=='auto'){auto.show();manual.hide();detectTZ.show();}else{auto.hide();manual.show();detectTZ.hide();}});this.child("manual").listen("month","endform fieldchange",function(status,value){var count=new Date(new Date().getFullYear(),value,0).getDate();var mday=manual.child("day").cleanOptions();for(var i=1;i<=count;i++){mday.addOption(i,i);}});auto.listen("use_dhcp","endform fieldchange",function(status,value){var servers=auto.child("servers");if(value)
servers.disable();else
servers.enable();});this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageNTP.superclass.updateView.apply(this,arguments);var auto=this.child("auto");var manual=this.child("manual");if(phase=="forward"){this.cleanButtonBar()
.addButton("ntpDetectTZ")
.getButton("ntpDetectTZ")
.bind("click.button",callback(this,function(){auto.child("hour").val(new Date().getTimezoneOffset()/60);}));if(disableFlag(somovdParams.CONFIG_ID_NTP))
this.getButton("ntpDetectTZ").children('div').addClass('disable');this.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save();}}));if(disableFlag(somovdParams.CONFIG_ID_NTP))
this.getButton("button_save").children('div').addClass('disable');}
if(phase=="back"){var mode=this.child("mode").cleanOptions().addOption("ntpModeAuto","auto").addOption("ntpModeManual","manual");var ahour=auto.child("hour").cleanOptions();for(var tz in timezone){ahour.addOption(lng(tz),timezone[tz]);}
var mmonth=manual.child("month").cleanOptions();var mday=manual.child("day").cleanOptions();for(var i=1;i<13;i++){mmonth.addOption(lng("ntpMonth"+i),i);}
var myear=manual.child("year").cleanOptions();for(var i=2012;i<2038;i++){myear.addOption(i,i);}
var mhour=manual.child("hour").cleanOptions();for(var i=0;i<24;i++){mhour.addOption(i,i);}
var mminute=manual.child("minute").cleanOptions();for(var i=0;i<60;i++){mminute.addOption(i,i);}
var date=new Date();mmonth.val(date.getMonth()+1)
mday.val(date.getDate());myear.val(date.getFullYear());mhour.val(date.getHours());mminute.val(date.getMinutes());if(this.ntp){auto.child("hour").val(this.ntp.hour);auto.child("servers").val(this.ntp.servers.join("\n"));this.child("mode").val((this.ntp.enable)?"auto":"manual");if(this.ntp.time){var time=this.ntp.time;manual.child("month").val(time.tm_mon);manual.child("day").val(time.tm_mday);manual.child("year").val(time.tm_year);manual.child("hour").val(time.tm_hour);manual.child("minute").val(time.tm_min);}
auto.child("use_dhcp").val(this.ntp.use_dhcp);}
this.endForm();manual.endForm();auto.endForm();}}
this.save=function(){rootView.showModalOverlay();var enable=(this.child("mode").val()=="auto");var auto=this.child("auto");var manual=this.child("manual");this.ntp.enable=enable;this.ntp.hour=(enable)?auto.child("hour").val():this.ntp.hour;this.ntp.servers=(enable)?auto.child("servers").val().split('\n'):this.ntp.servers;this.ntp.time={};this.ntp.time.tm_mon=parseInt(manual.child("month").val());this.ntp.time.tm_mday=parseInt(manual.child("day").val());this.ntp.time.tm_year=parseInt(manual.child("year").val());this.ntp.time.tm_hour=parseInt(manual.child("hour").val());this.ntp.time.tm_min=parseInt(manual.child("minute").val());this.ntp.use_dhcp=(enable)?auto.child("use_dhcp").val():this.ntp.use_dhcp;device.config.write(somovdParams.CONFIG_ID_NTP,this.ntp,callback(this,function(){this.emit("updaterq");rootView.hideModalOverlay();}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_NTP,callback(this,function(data){try{if(is.RPC_SUCCESS(data)){this.ntp=data.resident.ntpclient;this.deep.updateView();rootView.hideModalOverlay();}}
catch(e){this.deep.updateView().$box.errorBlock(lng("error"),e.message);}}));});}
extend(pageNTP,node);function pagePasswd(defpass){pagePasswd.superclass.constructor.call(this);this.defpassmode=defpass;this.add(new nodeCaption("passwDescText","passwDesc"))
.add(new nodeSelect("passwLogin"),"login")
.add(new nodetext("passwPassword",'',{password:true,mandatory:true,maxLength:31,re:[function(value){return(new RegExp("[А-яЁё]+","g").test(value))?'passwConfirmCirill':null;}]}),"password")
.add(new nodetext("passwConfirm",'',{password:true,mandatory:true,maxLength:31,re:[callback(this,function(value){return(this.child("password").val()==value)?null:'passwConfirmMismatch';})]}),"confirm");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pagePasswd.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,this.trysave));}
if(phase=="back"){this.child("login").cleanOptions().addOption('admin','admin');this.$box.find(':input[type=password]').bind('keypress',callback(this,function(e){if(e.keyCode==13){this.trysave();return false;}}));}}
this.trysave=function(){this.deep.updateModel();if(!this.status.error){this.save(this.child("login").val(),this.child("password").val());}}
this.save=function(login,passwd,autologin){rootView.showModalOverlay();outArr=[];outArr=[[somovdParams.CONFIG_ID_SET_PASS,{'login':login,'pass':passwd}]];device.config.write(outArr,callback(this,function(data){rootView.hideModalOverlay();if(data.rq[0].status==somovdParams.RPC_INVALID_VALUES){alert(lng('passwInvalid'));}else{if(is.RPC_SUCCESS(data)){alert(lng('passChanged'));}
if(this.defpassmode){if(window.SAVEME)SAVEME.lock();document.location.href="index.cgi";if(window.SAVEME)SAVEME.unlock();}}}));}
this.bind("updaterq",function(){this.deep.updateView();});}
extend(pagePasswd,node);function pagePing(){pagePing.superclass.constructor.call(this);this.updateView=function(phase){pagePing.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_start")
.getButton("button_start")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(this.status&&!this.status.error){this.ping();}}));var options={1:1,2:2,3:3,4:4,5:5};this.startForm()
.add(new nodetext("ping_host","",{mandatory:true}),"pingHost")
this.add(new nodeSelect("ping_count"),"pingCount");this.add(new nodeCheckBox("ping_v6",''),"pingV6");this.add(new node(),"pingLog")
.endForm();var pingCount=this.child("pingCount").cleanOptions();for(var i in options)
pingCount.addOption(i,options[i]);}}
this.updateModel=function(status){this.status=status;}
this.ping=function(){rootView.showModalOverlay();var outObj={host:this.child('pingHost').val(),count:parseInt(this.child('pingCount').val(),10)};outObj.is_ipv6=this.child('pingV6').val();window.DISABLE_NOTIFIER=true;device.config.write(somovdParams.CONFIG_ID_PING46,outObj,callback(this,function(answer){if(answer.resident){rootView.hideModalOverlay();var textLog=null;if(answer.resident.ping)
textLog=answer.resident.ping;if(answer.resident.ping6)
textLog=answer.resident.ping6;var log=this.child("pingLog");log.$box.html($("\
     <div class='console syslog'>\
      <pre>"+textLog+"</pre>\
     </div>\
    "));}
device.system.save();window.rootCtrl.getChild('fastmenu','notifier').event('cancelshowalways');window.DISABLE_NOTIFIER=false;}));}
this.bind("updaterq",function(){this.deep.updateView();});}
extend(pagePing,node);function jsPopupmenuModel(itemState){jsPopupmenuModel.superclass.constructor.call(this);this.itemName=(itemState)?itemState.name:'';this.itemImage=null;this.itemType=null;this.itemIndex=0;this.itemSelected=false;this.itemDisabled=false;if(itemState==null)return;if(itemState.img){this.itemImage=itemState.img;}
if(itemState.type){this.itemType=(itemState.type=='radio')?'radio':'check';}
if(itemState.index){this.itemIndex=itemState.index;}
if(itemState.selected){this.itemSelected=itemState.selected;}
if(itemState.disabled){this.itemDisabled=itemState.disabled;}}
extend(jsPopupmenuModel,jsModel);function jsPopupmenuController(itemState,options){jsPopupmenuController.superclass.constructor.call(this);this.changeModel(new jsPopupmenuModel(itemState));this.ifaceTypes.tree={type:jsPopupmenuView,def:true,options:{style:null,open:true,noPath:true}};this.integrate=function(childInx,parent){jsPopupmenuController.superclass.integrate.call(this,childInx,parent);}
if(options){this.frame=options.frame;this.popupmenuCtrl=options.target
this.rootItem=this;}}
extend(jsPopupmenuController,jsController);function jsPopupmenuView(ctrl,viewInx,options){jsPopupmenuView.superclass.constructor.call(this,ctrl,viewInx,options);this.click=function(e){if(this.ctrl.model.itemDisabled)return false;var info=this.ctrl.model;var isNeedHide=true;var rootItem=this.ctrl.rootItem;if(info.itemType){if(info.itemType=='check'){info.itemSelected=!info.itemSelected;var state=(info.itemSelected)?'full':'empty';$(this.viewBoxSel+'>img').attr('src','../image/checkbox_'+state+'.png');}else{if(!info.itemSelected){var items=this.ctrl.getParent().children;for(var i in items){if(items[i].model.itemType=='radio'&&items[i].model.itemIndex==info.itemIndex){items[i].model.itemSelected=false;}}
info.itemSelected=true;$(this.viewBoxSel).parent().find('img.index_'+info.itemIndex).attr('src','../image/radiobtn_empty.png');$(this.viewBoxSel+'>img').attr('src','../image/radiobtn_full.png');}}
isNeedHide=false;}
rootItem.frame.event("clickpopupmenu",{item:this,target:rootItem.target});if(isNeedHide){$('body').click();}
return false;}
this.showPopupmenu=function(e){var popupmenu=$(this.viewBoxSel+'>ul.popupmenu');if($(popupmenu).is(':visible')){$(popupmenu).find('ul.popupmenu').hide();$(popupmenu).hide();this.ctrl.frame.event("hidepopupmenu",this.ctrl.rootItem.target);}
this.ctrl.rootItem.target=e.target;this.findSubmenu($(popupmenu));var topOffset=$(popupmenu).parent().offset().top-$(popupmenu).parent().position().top;var leftOffset=$(popupmenu).parent().offset().left-$(popupmenu).parent().position().left;$(popupmenu).css({'left':(e.pageX-leftOffset)+'px','top':(e.pageY-topOffset)+'px'});$(popupmenu).fadeIn("slow");this.ctrl.frame.event("showpopupmenu",e.target);return false;}
this.hidePopupmenu=function(e){var popupmenu=$(this.viewBoxSel+'>ul.popupmenu');$(popupmenu).find('ul.popupmenu').hide();this.ctrl.frame.event("hidepopupmenu",this.ctrl.rootItem.target);$(popupmenu).fadeOut("fast");}
this.findSubmenu=function(popupmenu){var findSubmenu=this.findSubmenu;$(popupmenu).find('>li>ul.popupmenu').each(function(index){var item=$(this).parent();var submenu=$(this);$(item).mouseenter(function(){if($(this).find('>a').hasClass('disabled'))return true;$(submenu).css({'left':($(this).width()+parseInt($(this).css('padding-left'))+parseInt($(this).css('padding-right'))).toString()+'px','top':($(this).offset().top-$(this).parent().offset().top).toString()+'px'});findSubmenu($(submenu));$(this).parent().find('ul.popupmenu').hide();$(submenu).show('fast');});$(item).mouseleave(function(){if($(this).find('>a').hasClass('disabled'))return true;$(submenu).find('ul.popupmenu').hide();$(submenu).hide();});});}
jsPopupmenuView.prototype.drawView=function(){if(!this.ctrl.rootItem)this.ctrl.rootItem=this.getParent().ctrl.rootItem;jsPopupmenuView.superclass.drawView.call(this);$(this.myBoxSel).html(lng(this.ctrl.model.itemName));if(!this.ctrl.root){var info=this.ctrl.model;$(this.viewBoxSel).parent().addClass('popupmenu').css('z-index',999999);if(info.itemName!='-'){$(this.viewBoxSel).addClass('item');var img=$("<img width='16px' height='16px' src='' />").css({'display':'inline-block'});if(info.itemImage){$(img).attr('src',info.itemImage);}
if(info.itemType){var type=(info.itemType=='check')?'checkbox':'radiobtn';var state=(info.itemSelected)?'full':'empty';$(img).attr('src','../image/'+type+'_'+state+'.png');$(img).addClass('index_'+info.itemIndex);}
$(this.viewBoxSel).prepend(img);if(!info.itemDisabled){$(this.viewBoxSel).bind('click',context(this).callback(this.click));}else{$(this.viewBoxSel+'>img').css('opacity',0.3);$(this.viewBoxSel+'>a').addClass('disabled');}}else{$(this.viewBoxSel).addClass('separator');$(this.viewBoxSel).html('');}}else{var popupmenuCtrl=this.ctrl.popupmenuCtrl;for(var i in popupmenuCtrl.views){$(popupmenuCtrl.views[i].viewBoxSel).bind("contextmenu",context(this).callback(this.showPopupmenu));}
$('body').bind('click',context(this).callback(this.hidePopupmenu));$('html').bind('click',context(this).callback(this.hidePopupmenu));}}
this.disable=function(){this.ctrl.model.itemDisabled=true;this.drawView();}
this.enable=function(){this.ctrl.model.itemDisabled=false;this.drawView();}
jsPopupmenuView.prototype.onactivate=function(){return false;}
jsPopupmenuView.prototype.ondeactivate=function(){return false;}
this.bind("activate",this.onactivate);this.bind("deactivate",this.ondeactivate);}
extend(jsPopupmenuView,jsViewTree);function jsPPPSettingsModel(service){jsPPPSettingsModel.superclass.constructor.call(this);this.service=service;}
extend(jsPPPSettingsModel,jsModel);function jsPPPSettingsController(service,isadding){jsPPPSettingsController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsPPPSettingsClientView,def:true};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsPPPSettingsSummaryView};this.ifaceTypes.summary.options={};this.changeModel(new jsPPPSettingsModel(service));this.addChild(new jsDecorController(),"desc");this.addChild(new jsInputController(service.auto),"auto");this.addChild(new jsInputController(service.username),"userName");this.addChild(new jsInputController(service.noauth),"noAuth");this.addChild(new jsInputController("dlink"),"password");this.addChild(new jsInputController("dlink"),"confirm");if((service.type=="pppv6"||service.type=="pppdual")&&service.wizard){this.addChild(new jsIPv6Controller(service.gwipv6),"pppGwIpv6");this.addChild(new jsInputController(service.slaac),"slaac");}
this.addChild(new jsInputController(service.apn),"apn");this.addChild(new jsInputController(service.dial_num?service.dial_num.replace(/\^/g,"#"):service.dial_num),"dialNumber");this.addChild(new jsInputController(service.servicename),"serviceName");var advanced=this.addChild(new jsFieldSetController(),"advanced");advanced.addChild(new jsInputController(service.servicename),"serviceNamePPPoE");advanced.addChild(new jsInputController(service.encrypt),"encrypt");advanced.addChild(new jsInputController(service.auth),"auth");advanced.addChild(new jsInputController(service.mtu),"mtu");advanced.addChild(new jsInputController((service.keep_alive&&service.keep_alive.interval)?true:false),"keepAlive");advanced.addChild(new jsInputController(service.keep_alive?service.keep_alive.interval:30),"lcpInterval");advanced.addChild(new jsInputController(service.keep_alive?service.keep_alive.fails:3),"lcpFails");advanced.addChild(new jsInputController(service.extra_options?service.extra_options:""),"extraOptions");advanced.addChild(new jsInputController((service.ondemand>0)?true:false),"onDemand");advanced.addChild(new jsInputController(service.ondemand),"idleTimeout");advanced.addChild(new jsInputController(service.ppp_ip_ext),"pppIpExt");advanced.addChild(new jsIPv4Controller(service.static_ip),"pppStaticIp");advanced.addChild(new jsIPv4Controller(service.dns_prim),"primaryDns");advanced.addChild(new jsIPv4Controller(service.dns_sec),"secondaryDns");if(service.type=="pppv6"||service.type=="pppdual"){advanced.addChild(new jsDecorController(),"ip_sect");var ipv6_by="dhcpv6";if(service.ipv6_by_slaac){ipv6_by="slaac";}
else if(service.ipv6_by_dhcpv6_pd){ipv6_by="dhcpv6_pd";}
else if(service.ipv6_auto){ipv6_by="ipv6auto";}
advanced.addChild(new jsInputController(ipv6_by),"ipv6_by");advanced.addChild(new jsIPv6Controller(service.static_ipv6),"pppStaticIpv6");if(!service.wizard){advanced.addChild(new jsDecorController(),"gw_sect");advanced.addChild(new jsInputController(service.slaac),"slaac");advanced.addChild(new jsIPv6Controller(service.gwipv6),"pppGwIpv6");}
advanced.addChild(new jsDecorController(),"dns_sect");advanced.addChild(new jsInputController(is.set(service.dns_from_dhcpv6)?service.dns_from_dhcpv6:true),"dnsFromDhcp");advanced.addChild(new jsIPv6Controller(service.dns_primv6),"pppStaticPrimDnsv6");advanced.addChild(new jsIPv6Controller(service.dns_secv6),"pppStaticSecDnsv6");}
advanced.addChild(new jsInputController(service.ppp_debug),"pppDebug");advanced.addChild(new jsInputController(service.ip),"ip");}
extend(jsPPPSettingsController,jsFieldSetController);function jsPPPSettingsClientView(ctrl,viewInx,options){var obj;var opt;var contype=ctrl.model.service.contype;var ifnode=ctrl.model.ifnode;var service=ctrl.model.service;var tree=ctrl.model.iftree;var level=ctrl.model.service.level;var dnsFromDhcp;obj=ctrl.getChild("desc");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"PPP"};if(level==4){obj.ifaceTypes.separator.options.label="VPN";}
obj.ifaceTypes.separator.options.hide=service.blocks;obj=ctrl.getChild("auto");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanPPTPAuto",valset:{on:true,off:false}};obj.ifaceTypes.checkbox.options.hide=(level==3)||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_AUTO);var advanced=ctrl.getChild("advanced");advanced.nextIface="client";obj=ctrl.getChild("serviceName");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanPPTPSName",mandatory:true}
obj.ifaceTypes.input.options.hide=(level==3)||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_SERVICE_NAME);obj=ctrl.getChild("userName");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanUserName",mandatory:true};obj=ctrl.getChild("noAuth");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanNoAuth",valset:{on:true,off:false}};var noauth=obj.model.value;obj=ctrl.getChild("password");obj.nextIface="input";obj.ifaceTypes.input.options={password:true,humanName:"wanPassword",mandatory:true};obj.ifaceTypes.input.options.disabled=noauth;obj=ctrl.getChild("confirm");obj.nextIface="input";obj.ifaceTypes.input.options={password:true,humanName:"wanConfirm",mandatory:true};obj.ifaceTypes.input.options.disabled=noauth;obj=advanced.getChild("serviceNamePPPoE");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanPPPoESName"};obj.ifaceTypes.input.options.hide=(contype!="pppoe"&&contype!="pppoev6"&&contype!="pppoedual"&&contype!="dynpppoe"&&contype!="statpptp")||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_SERVICE_NAME_PPPOE);obj=ctrl.getChild("apn");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanApn",optional:true};obj.ifaceTypes.input.options.hide=(contype!="3g")||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_APN);obj=ctrl.getChild("dialNumber");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanDialNumber",mandatory:true};obj.ifaceTypes.input.options.hide=(contype!="3g")||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_DIAL_NUMBER);obj=advanced.getChild("encrypt");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"pptp_encr",valset:{no_encrypt:"0",mppe_40_128:"1",mppe_40:"2",mppe_128:"3"}};obj.ifaceTypes.select.options.hide=(level==3)||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_ENCRYPT);obj=advanced.getChild("auth");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"wanAuth",valset:{AUTO:"0",PAP:"1",CHAP:"2","MS-CHAP":"3","MS-CHAP-V2":"4"}};obj.ifaceTypes.select.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_AUTH);obj=advanced.getChild("mtu");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanMtu",minval:0};obj.ifaceTypes.number.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_MTU);obj=advanced.getChild("keepAlive");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanKeepAlive",valset:{on:true,off:false}};var keepAlive=obj.model.value;obj.ifaceTypes.checkbox.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_KEEP_ALIVE);obj=advanced.getChild("lcpInterval");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanLcpInterval",minval:0};obj.ifaceTypes.number.options.hide=!keepAlive||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_LCP_INTERVAL);obj=advanced.getChild("lcpFails");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanLcpFails",minval:0,maxval:255};obj.ifaceTypes.number.options.hide=!keepAlive||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_LCP_FAILS);obj=advanced.getChild("extraOptions");obj.nextIface="input";obj.ifaceTypes.input.options={humanName:"wanExtraOptions"};obj.ifaceTypes.input.options.hide=(contype!="3g"&&(level==3))||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_EXTRA_OPTIONS);obj=advanced.getChild("onDemand");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanOnDemand",valset:{on:true,off:false}};obj.ifaceTypes.checkbox.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_ON_DEMAND);var ondemand=obj.model.value;obj=advanced.getChild("idleTimeout");obj.nextIface="number";obj.ifaceTypes.number.options={humanName:"wanIdleTimeout",minval:0};obj.ifaceTypes.number.options.hide=!ondemand||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_IDLE_TIMEOUT);obj=advanced.getChild("pppIpExt");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanPppIpExt",valset:{on:true,off:false}};obj.ifaceTypes.checkbox.options.hide=(contype=="3g"||(level==4))||(service.blocks&&!webadminParams.BLOCK_WAN_PPP_IP_EXT);obj=advanced.getChild("pppStaticIp");opt=obj.ifaceTypes.client.options;opt.humanName="wanPppStaticIp";opt.optional=true;opt.hide=service.type=="pppv6"||service.contype=="3g"
opt.hide|=service.blocks&&!webadminParams.BLOCK_WAN_PPP_STATIC_IP;obj=advanced.getChild("primaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanPrimDns";opt.optional=true;opt.hide=true;obj=advanced.getChild("secondaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanSecDns";opt.optional=true;opt.hide=true;if(service.type=="pppv6"||service.type=="pppdual"){obj=advanced.getChild("ip_sect");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"IPv6"};if(!service.wizard){obj=advanced.getChild("gw_sect");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"wanIPv6GwSect"};}
obj=advanced.getChild("dns_sect");obj.nextIface="separator";obj.ifaceTypes.separator.options={label:"wanIPv6DnsSect"};obj=advanced.getChild("ipv6_by");obj.nextIface="select";obj.ifaceTypes.select.options={humanName:"wanIpv6By",valset:{wanIpv6ByDhcpv6:"dhcpv6",wanIpv6BySlaac:"slaac",wanIpv6ByDhcpv6PD:"dhcpv6_pd",wanIpv6auto:"ipv6auto"}};obj.ifaceTypes.select.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_AUTH);if(service.wizard){obj=ctrl.getChild("slaac");}
else{obj=advanced.getChild("slaac");}
obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"SLAAC",valset:{on:true,off:false}};obj.ifaceTypes.checkbox.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_GWIPV6&&!webadminParams.BLOCK_WAN_PPP_STATIC_IPV6);var slaac=obj.model.value;if(service.wizard){obj=ctrl.getChild("pppGwIpv6");}
else{obj=advanced.getChild("pppGwIpv6");}
opt=obj.ifaceTypes.client.options;opt.humanName="wanStatGwIpv6";opt.disabled=slaac;opt.optional=slaac;opt.hide=service.blocks&&!webadminParams.BLOCK_WAN_PPP_GWIPV6;obj=advanced.getChild("pppStaticIpv6");opt=obj.ifaceTypes.client.options;opt.humanName="wanStatIpv6";opt.optional=true;opt.hide=service.blocks&&!webadminParams.BLOCK_WAN_PPP_STATIC_IPV6;opt.hide=true;obj=advanced.getChild("dnsFromDhcp");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanDnsFromDhcp",valset:{on:true,off:false}};dnsFromDhcp=obj.model.value;obj=advanced.getChild("pppStaticPrimDnsv6");opt=obj.ifaceTypes.client.options;opt.humanName="wanStatPrimIPv6Dns";opt.optional=true;opt.disabled=dnsFromDhcp&&!webadminParams.BLOCK_WAN_PPP_STATIC_PRIM_DNSV6;obj=advanced.getChild("pppStaticSecDnsv6");opt=obj.ifaceTypes.client.options;opt.humanName="wanStatSecIPv6Dns";opt.optional=true;opt.disabled=dnsFromDhcp&&!webadminParams.BLOCK_WAN_PPP_STATIC_SEC_DNSV6;}
obj=advanced.getChild("pppDebug");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanPppDebug",valset:{on:true,off:false}};obj.ifaceTypes.checkbox.options.hide=(service.blocks&&!webadminParams.BLOCK_WAN_PPP_DEBUG);obj=advanced.getChild("ip");obj.nextIface="text";obj.ifaceTypes.text.options={humanName:"wanPPTPIp"}
opt=obj.ifaceTypes.text.options;opt.hide=(level==3)||service.blocks;jsPPPSettingsClientView.prototype.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;var advanced=this.getChild("advanced");var blocks=this.ctrl.model.service.blocks;switch(alias){case"dnsFromDhcp":if(obj.value){advanced.getChild("pppStaticPrimDnsv6").disable();advanced.getChild("pppStaticSecDnsv6").disable();}
else{advanced.getChild("pppStaticPrimDnsv6").enable();advanced.getChild("pppStaticSecDnsv6").enable();}
break;case"noAuth":if(obj.value){this.getChild("password").disable();this.getChild("confirm").disable();this.getChild("userName").clearMandatory();}
else{this.getChild("password").enable();this.getChild("confirm").enable();this.getChild("userName").setMandatory();}
this.getChild("noAuth").updateModel();break;case"onDemand":if(obj.value){if(blocks){}
else{advanced.getChild("idleTimeout").show();}}
else{advanced.getChild("idleTimeout").hide();}
advanced.getChild("onDemand").updateModel();break;case"keepAlive":if(obj.value){if(blocks){}
else{advanced.getChild("lcpInterval").show();advanced.getChild("lcpFails").show();}}
else{advanced.getChild("lcpInterval").hide();advanced.getChild("lcpFails").hide();}
advanced.getChild("keepAlive").updateModel();break;case"type":switch(obj.value){case"3g":this.getChild("apn").show();this.getChild("dialNumber").show();break;case"pppoe":case"pppoa":this.getChild("apn").hide();this.getChild("dialNumber").hide();break;}
break;case"slaac":var gwip;if(this.ctrl.model.service.wizard){gwip=this.getChild("pppGwIpv6");}
else{gwip=this.getChild("advanced","pppGwIpv6");}
if(obj.value){gwip.clearMandatory();gwip.setOption("optional",true);gwip.disable();}
else{gwip.setMandatory();gwip.setOption("optional",false);gwip.enable();}
break;}}
this.updateModel=function(){var conf=this.getChild("confirm");var passw=this.getChild("password");var user=this.getChild("userName");var password;var confirm_;var noauth;var apn=this.getChild("apn");var dialNumber=this.getChild("dialNumber");var advanced=this.getChild("advanced");var serviceName=this.getChild("serviceName");conf.statusCode=null;passw.statusCode=null;user.statusCode=null;apn.statusCode=null;dialNumber.statusCode=null;serviceName.statusCode=null;serviceName.setError();if(!passw.ctrl.modified){passw.ctrl.model.value=this.ctrl.model.service.password;conf.ctrl.model.value=this.ctrl.model.service.password;passw.updateView();conf.updateView();}
var res=jsPPPSettingsClientView.superclass.updateModel.call(this);if(res){noauth=this.getChild("noAuth").ctrl.model.value;if(noauth){passw.ctrl.model.value="";conf.ctrl.model.value="";}
else{password=passw.ctrl.model.value;if(user.ctrl.model.value==""){user.statusCode="wanUserNameEmpty";res=false;}
if(password!=""){confirm_=conf.ctrl.model.value;if(confirm_!=password){conf.statusCode="wanConfirmMismatch";res=false;}}
else{passw.statusCode="wanPasswordEmpty";res=false;}}
conf.setError();passw.setError();user.setError();if(this.ctrl.model.service.contype=="3g"){if(dialNumber.ctrl.model.toString()==""){dialNumber.statusCode="wanDialNumberEmpty";dialNumber.setError();res=false;}}
if(res){var service=this.ctrl.model.service;service.auto=this.getChild("auto").ctrl.model.value;service.noauth=noauth;service.username=this.getChild("userName").ctrl.model.toString();service.password=this.getChild("password").ctrl.model.toString();service.encrypt=advanced.getChild("encrypt").ctrl.model.toString();service.auth=advanced.getChild("auth").ctrl.model.value;if(service.level==3){service.servicename=advanced.getChild("serviceNamePPPoE").ctrl.model.toString();}
else{if(validate_host(serviceName.ctrl.model.value)){service.servicename=this.getChild("serviceName").ctrl.model.toString();}
else{serviceName.statusCode="netAddrOrDomainInvalid";serviceName.setError();res=false;}}
service.apn=this.getChild("apn").ctrl.model.toString();service.dial_num=this.getChild("dialNumber").ctrl.model.toString().replace(/#/g,"^");if(advanced.getChild("onDemand").ctrl.model.value){service.ondemand=advanced.getChild("idleTimeout").ctrl.model.toString();}
else if(!no(service.ondemand)){delete service.ondemand;}
service.mtu=advanced.getChild("mtu").ctrl.model.value;service.ppp_ip_ext=advanced.getChild("pppIpExt").ctrl.model.value;if(advanced.getChild("keepAlive").ctrl.model.value){service.keep_alive={interval:advanced.getChild("lcpInterval").ctrl.model.value,fails:advanced.getChild("lcpFails").ctrl.model.value}}
else{service.keep_alive=null;}
service.extra_options=advanced.getChild("extraOptions").ctrl.model.toString();service.static_ip=advanced.getChild("pppStaticIp").ctrl.model.toString();service.dns_prim=advanced.getChild("primaryDns").ctrl.model.toString();service.dns_sec=advanced.getChild("secondaryDns").ctrl.model.toString();if(service.type=="pppv6"||service.type=="pppdual"){if(service.wizard){service.slaac=this.getChild("slaac").ctrl.model.value;service.gwipv6=this.getChild("pppGwIpv6").ctrl.model.toString();}
else{service.slaac=advanced.getChild("slaac").ctrl.model.value;service.gwipv6=advanced.getChild("pppGwIpv6").ctrl.model.toString();}
service.static_ipv6=advanced.getChild("pppStaticIpv6").ctrl.model.toString();service.dns_primv6=advanced.getChild("pppStaticPrimDnsv6").ctrl.model.toString();service.dns_secv6=advanced.getChild("pppStaticSecDnsv6").ctrl.model.toString();service.dns_from_dhcpv6=advanced.getChild("dnsFromDhcp").ctrl.model.value;var ipv6_by=advanced.getChild("ipv6_by").ctrl.model.toString();if(ipv6_by=="ipv6auto"){service.ipv6_auto=true;service.ipv6_by_slaac=false;service.ipv6_by_dhcpv6=false;service.ipv6_by_dhcpv6_pd=false;}
else if(ipv6_by=="slaac"){service.ipv6_by_slaac=true;service.ipv6_by_dhcpv6=false;service.ipv6_by_dhcpv6_pd=false;service.ipv6_auto=false;}
else if(ipv6_by=="dhcpv6_pd"){service.ipv6_by_slaac=false;service.ipv6_by_dhcpv6=false;service.ipv6_by_dhcpv6_pd=true;service.ipv6_auto=false;}else{service.ipv6_by_slaac=false;service.ipv6_by_dhcpv6=true;service.ipv6_by_dhcpv6_pd=false;service.ipv6_auto=false;}}
service.ppp_debug=advanced.getChild("pppDebug").ctrl.model.value;}}
else{passw.ctrl.model.value="";conf.ctrl.model.value="";passw.updateView();conf.updateView();}
return res;}
this.drawView=function(){jsPPPSettingsClientView.superclass.drawView.call(this);this.onmodeswitch();}
this.onmodeswitch=function(value){if(this.options.brief){this.getChild("auto").hide();this.getChild("noAuth").hide();this.getChild("advanced").hide();this.getChild("desc").hide();}
else{if(this.ctrl.model.service.level==4){this.getChild("auto").show();}
this.getChild("noAuth").show();this.getChild("advanced").show();this.getChild("desc").show();}
return false;}
jsPPPSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("fieldchange",this.onfieldchange);this.bind("modeswitch",this.onmodeswitch);}
extend(jsPPPSettingsClientView,jsFieldSetClientView);function jsPPPSettingsSummaryView(ctrl,viewInx,options){jsPPPSettingsSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.onfieldchange=function(obj){jsPPPSettingsSummaryView.superclass.onfieldchange.call(this,obj);var alias=obj.view.ctrl.alias;switch(alias){case"noAuth":if(obj.value){this.getChild("password").hide();this.getChild("confirm").hide();}
else{this.getChild("password").show();this.getChild("confirm").show();}
break;}}
this.drawView=function(){var advanced=this.getChild("advanced");advanced.options.slider=false;this.getChild("password").options.hide=true;this.getChild("confirm").options.hide=true;advanced.getChild("auth").options.hide=true;advanced.getChild("onDemand").options.hide=true;this.getChild("serviceName").options.hide=true;this.getChild("auto").options.hide=true;advanced.getChild("encrypt").options.hide=true;advanced.getChild("mtu").options.hide=true;advanced.getChild("pppIpExt").options.hide=true;advanced.getChild("keepAlive").options.hide=true;advanced.getChild("extraOptions").options.hide=true;;advanced.getChild("ip").options.hide=true;advanced.getChild("pppStaticIp").options.hide=true;var service=this.ctrl.model.service;if(service.type=="pppv6"||service.type=="pppdual"){if(this.ctrl.model.service.wizard){this.getChild("pppGwIpv6").options.hide=true;}
else{advanced.getChild("pppGwIpv6").options.hide=true;}
advanced.getChild("pppStaticIpv6").options.hide=true;advanced.getChild("pppStaticPrimDnsv6").options.hide=true;advanced.getChild("pppStaticSecDnsv6").options.hide=true;}
advanced.getChild("pppDebug").options.hide=true;advanced.getChild("serviceNamePPPoE").options.hide=true;jsPPPSettingsSummaryView.superclass.drawView.call(this);}
this.updateView=function(){jsPPPSettingsSummaryView.superclass.updateView.call(this);var advanced=this.getChild("advanced");var service=this.ctrl.model.service;var auto=this.getChild("auto");if(auto.ctrl.modified)auto.show();var encrypt=advanced.getChild("encrypt");if(encrypt.ctrl.modified)encrypt.show();var auth=advanced.getChild("auth");if(auth.ctrl.modified)auth.show();var onDemand=advanced.getChild("onDemand");if(service.ondemand>0||onDemand.ctrl.modified){onDemand.show();}
var mtu=advanced.getChild("mtu");if(mtu.ctrl.modified)mtu.show();var pppIpExt=advanced.getChild("pppIpExt");if(pppIpExt.ctrl.modified)pppIpExt.show();var keepAlive=advanced.getChild("keepAlive");if((service.keep_alive&&service.keep_alive.interval>0)||keepAlive.ctrl.modified){keepAlive.show();}
var extraOptions=advanced.getChild("extraOptions");if(extraOptions.ctrl.modified)extraOptions.show();var pppStaticIp=advanced.getChild("pppStaticIp");if(pppStaticIp.ctrl.modified)pppStaticIp.show();if(service.type=="pppv6"||service.type=="pppdual"){if(service.wizard){var pppGwIpv6=this.getChild("pppGwIpv6");}
else{var pppGwIpv6=advanced.getChild("pppGwIpv6");}
if(pppGwIpv6.ctrl.modified)pppGwIpv6.show();var pppStaticIpv6=advanced.getChild("pppStaticIpv6");if(pppStaticIpv6.ctrl.modified)pppStaticIpv6.show();var pppStaticPrimDnsv6=advanced.getChild("pppStaticPrimDnsv6");if(pppStaticPrimDnsv6.ctrl.modified)pppStaticPrimDnsv6.show();var pppStaticSecDnsv6=advanced.getChild("pppStaticSecDnsv6");if(pppStaticSecDnsv6.ctrl.modified)pppStaticSecDnsv6.show();}
var pppDebug=advanced.getChild("pppDebug");if(pppDebug.ctrl.modified)pppDebug.show();var serviceNamePPPoE=advanced.getChild("serviceNamePPPoE");if(serviceNamePPPoE.ctrl.modified)serviceNamePPPoE.show();}
this.bind("fieldchange",this.onfieldchange);this.bind("modeswitch",function(){return false;});}
extend(jsPPPSettingsSummaryView,jsPPPSettingsClientView);function jsPreMasterModel(iftree){jsPreMasterModel.superclass.constructor.call(this);this.iftree=iftree;}
extend(jsPreMasterModel,jsModel);function jsPreMasterController(){jsPreMasterController.superclass.constructor.call(this);this.changeModel(new jsPreMasterModel());this.ifaceTypes.client={type:jsPreMasterClientView};this.ifaceTypes.client.options={inputPadding:"200px"};this.ifaceTypes.server={type:jsPreMasterServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();this.ondataready=function(){var services;var tunnels;var iftree=this.model.iftree;for(var i in iftree){iftree[i].ifname=i;services=iftree[i].services;if(services){for(var j in services){services[j].ifname=j;tunnels=services[j].tunnels;if(tunnels){for(var k in tunnels){tunnels[k].ifname=k;}}}}}
var mainTab=this.addChild(new jsConnsMainTabController(this.model.iftree,null,null,null,this.model.lanClients,null,this.model.routes),"mainTab");mainTab.model.lanClients=this.model.lanClients;mainTab.model.jsonIGMP=this.model.jsonIGMP;return false;}
this.onedit=function(obj){var mainTab=this.changeChild(this.getChild("mainTab").thisInx,new jsConnsMainTabController(this.model.iftree,obj.ifname,obj.srvname,obj.tnlname,this.model.lanClients,null,this.model.routes),"mainTab");return false;}
this.onmodeswitch=function(value){this.getChild("mainTab").event("modeswitch",value);return false;}
this.addEventHandler("dataready",this.ondataready);this.addEventHandler("edit",this.onedit);this.addEventHandler("modeswitch",this.onmodeswitch);}
extend(jsPreMasterController,jsFieldSetController);function jsPreMasterClientView(ctrl,viewInx,options){jsPreMasterClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.options.nothing=true;this.ondataready=function(){this.constructor(this.ctrl,this.viewInx,this.options?this.options:{});this.drawView();return false;}
this.drawView=function(){jsPreMasterClientView.superclass.drawView.call(this);}
this.bind("dataready",this.ondataready);this.bind("edit",this.ondataready);}
extend(jsPreMasterClientView,jsFieldSetClientView);function jsPreMasterServerView(ctrl,viewInx,options){jsPreMasterServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(this.mode=="update"){this.ctrl.model.iftree={};if(data){if(!data.baddata&&data.rq){if(data.rq[0]&&data.rq[0].resident&&data.rq[0].resident.iface_names){this.ctrl.model.iftree=data.rq[0].resident.iface_names;if(!this.ctrl.model.iftree)this.ctrl.model.iftree={};}
var n=1;if(data.rq[n]&&data.rq[n].resident){this.ctrl.model.lanClients=data.rq[n].resident;}
n++;if(data.rq[n]&&data.rq[n].resident&&data.rq[n].resident.route){this.ctrl.model.routes=data.rq[n].resident.route;}
n++;if(data.rq[n]&&data.rq[n].resident){this.ctrl.model.jsonIGMP=data.rq[n].resident;}
n++;}}
this.ctrl.model.iftree.wizard=true;this.ctrl.event("dataready");}
else if(this.mode=="checkcable"){var isConnect;isConnect=false;if(data.status==20&&data.resident){var port;var obj;var ifnode;for(var p in data.resident){port=p;obj=data.resident[p];ifnode=this.ctrl.model.iftree[obj.iface];if(obj.is_wan||(ifnode&&ifnode.is_wan)){break;}}
if(!no(data.resident[port].status)){isConnect=data.resident[port].status;}else{isConnect=data.resident[port];}}
this.ctrl.getChild("mainTab").event('cableready',isConnect);}
else{delete this.ctrl.getChild("mainTab","general").model.ifnode.needDelete;this.ctrl.getChild("mainTab").event('savecomplete');}}
this.prepareData=function(){var obj;var delim="|";var ctrl=this.ctrl;var needDelete=[];switch(this.mode){case"add":case"save":var general=ctrl.getChild("mainTab","general");var model=general.model;var contype=general.model.ifnode.contype;obj={v2:"y",rq:0};var res_pos;if(this.mode=="add"){res_pos=-1;}
else{res_pos=0;}
if(this.needDelete||model.ifnode.needDelete){obj.rq++;obj.res_config_id0=somovdParams.CONFIG_ID_WAN_TEMP;obj.res_config_action0=somovdParams.CONFIG_ACTION_DELETE,obj.res_json0="y";obj.res_data_type0="json";obj.res_struct_size0=1;if(model.ifnode.needDelete instanceof Array){for(var i in model.ifnode.needDelete){needDelete.push(model.ifnode.needDelete[i]);}}
if(this.needDelete instanceof Array){for(var i in this.needDelete){needDelete.push(this.needDelete[i]);}}
obj.res_buf0=$.toJSON(needDelete);}
if(contype=="statpppoe"||contype=="dynpppoe"){var blankConn1=$.extend(true,{},model.blankConn);var ifnode1=getObjectFirstChild(blankConn1);var service1=getObjectFirstChild(ifnode1.services);delete service1.tunnels;var service2=$.extend(true,{},getObjectFirstChild(model.service.tunnels));var srvname2=getObjectFirstKey(model.service.tunnels);var blankConn2=$.extend(true,{},model.blankConn);var services=getObjectFirstChild(blankConn2).services={};services[srvname2]=service2;var jsonOutStr=$.toJSON(blankConn1);jsonOutStr=jsonOutStr.replace(/%/g,"%25");jsonOutStr=jsonOutStr.replace(/#/g,"%23");}
else{var jsonOutStr=$.toJSON(model.blankConn);jsonOutStr=jsonOutStr.replace(/%/g,"%25");jsonOutStr=jsonOutStr.replace(/#/g,"%23");}
obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_WAN_TEMP;obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_EDIT;obj["res_json"+obj.rq]="y";obj["res_struct_size"+obj.rq]=1;obj["res_buf"+obj.rq]=jsonOutStr;obj["res_pos"+obj.rq]=res_pos;obj.rq++;if(is.object(blankConn2)){obj["res_config_id"+obj.rq]=1;obj["res_config_action"+obj.rq]=3;obj["res_json"+obj.rq]="y";obj["res_data_type"+obj.rq]="json";obj["res_struct_size"+obj.rq]=36;obj["res_pos"+obj.rq]=res_pos;var res_buf=$.toJSON(blankConn2);res_buf=res_buf.replace(/%/g,"%25");res_buf=res_buf.replace(/#/g,"%23");res_buf=res_buf.replace(/&/g,"%26");obj["res_buf"+obj.rq]=res_buf;obj.rq++;}
if(contype=="statpptp"||contype=="statl2tp"||contype=="statpppoe"||contype=="statpptpv6"||contype=="statl2tpv6"){var newRoutes=ctrl.getChild("mainTab","other","routing").newRoutes;var j=obj.rq;for(var i in newRoutes){if(newRoutes[i].ip){obj["res_config_id"+j]=somovdParams.CONFIG_ID_ROUTING;obj["res_config_action"+j]=somovdParams.CONFIG_ACTION_EDIT;obj["res_json"+j]="y";obj["res_data_type"+j]="json";obj["res_struct_size"+j]=1;obj["res_buf"+j]=$.toJSON(newRoutes[i]);j++;}}
obj.rq=j;}
this.needDelete=[];if(this.ctrl.getChild("mainTab").model.enIGMPGlobal){obj["res_json"+obj.rq]="y";obj["res_data_type"+obj.rq]="json";obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_EDIT;obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_IGMP;obj["res_struct_size"+obj.rq]=0;obj["res_buf"+obj.rq]=$.toJSON({enable:true,version:2});obj.rq++;}
this.addToRequest(obj);break;case"update":obj={v2:"y",rq:1,res_json0:"y",res_config_action0:1,res_config_id0:1,res_struct_size0:36};var n=1;obj.rq=n+1;obj['res_json'+n]="y";obj['res_config_action'+n]=somovdParams.CONFIG_ACTION_READ;obj['res_config_id'+n]=somovdParams.CONFIG_ID_NEIGHBOUR;obj['res_struct_size'+n]=0;n++;obj.rq=n+1;obj['res_json'+n]="y";obj['res_config_action'+n]=somovdParams.CONFIG_ACTION_READ;obj['res_config_id'+n]=somovdParams.CONFIG_ID_ROUTING;obj['res_struct_size'+n]=0;obj["res_json"+obj.rq]="y";obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_READ;obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_IGMP;obj["res_struct_size"+obj.rq]=0;obj.rq++;this.addToRequest(obj);break;case"delete":obj={v2:"y",rq:"y",res_config_id:1,res_config_action:2,res_json:"y",res_struct_size:36,res_delex:"y",res_data_type:"json"};jsonOutObj=[];var general=ctrl.getChild("mainTab","general");if(general.model.tnlname){jsonOutObj.push(general.model.tnlname);}
else if(general.model.srvname){jsonOutObj.push(general.model.srvname);}
obj.res_buf=$.toJSON(jsonOutObj);this.addToRequest(obj);break;case"checkcable":obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_config_id:somovdParams.CONFIG_ID_PORT_STATUS,res_struct_size:1};this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.mode="update";this.updateView();}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.onaddrq=function(){this.mode="add";this.updateView();}
this.oncheckcable=function(){this.mode="checkcable";this.updateView();}
this.ondeleterq=function(){this.mode="delete";this.updateView();}
this.onsettodelete=function(ifname){this.needDelete.push(ifname);return false;}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onsaverq);this.bind("addrq",this.onaddrq);this.bind("deleterq",this.ondeleterq);this.bind("checkcable",this.oncheckcable);this.bind("settodelete",this.onsettodelete);}
extend(jsPreMasterServerView,jsSSideView);function jsInetFirstStepController(iftree){jsInetFirstStepController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsInetFirstStepClientView};this.ifaceTypes.client.options={};this.iftree=iftree;}
extend(jsInetFirstStepController,jsController);function jsInetFirstStepClientView(ctrl,viewInx,options){jsInetFirstStepClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.getwans=function(){var iface;var service;var tunnel;var wans=[];var port;var obj;var iftree=this.ctrl.iftree;var services;for(var i in iftree){iface=iftree[i];if(!iface.is_wan)continue;if(iface.type=="atm"){port=lng("onpvc")+" "+iface.pvc_settings.vpi+"/"+iface.pvc_settings.vci;}
else if(iface.type=="ethernet"||iface.type=="ptm"||iface.type=="3g"||iface.type=="lte"||iface.type=="bridge"){if(iface.port){port=lng("onport")+" "+iface.port;}
else{port=lng("oniface")+" "+iface.port;}}
else if(iface.type=="auto"){port=lng("wanAuto");}
this.addServices(wans,iface,"services",port);}
return wans;}
this.addServices=function(wans,iface,srvsname,port){var service;var services=iface[srvsname];var tunnel;if(services){for(var j in services){service=services[j];if(service.tunnels&&getObjectLength(service.tunnels)){for(var k in service.tunnels){tunnel=service.tunnels[k];wans.push({ifname:iface.ifname,srvname:service.ifname,tnlname:k,name:tunnel.name?tunnel.name:tunnel.ifname,type:getConnType(iface,service,tunnel),port:port,srvsname:srvsname});}}
else{wans.push({ifname:iface.ifname,srvname:j,name:service.name?service.name:service.ifname,type:getConnType(iface,service),port:port,srvsname:srvsname});}}}}
this.drawView=function(){jsInetFirstStepClientView.superclass.drawView.call(this);var wans=this.getwans();var obj;var id;var htmlToDraw=lng("inetwizphrase1")+"<br>";if(wans.length){htmlToDraw+=lng("inetwizphrase2");htmlToDraw+="<ul>";for(var i in wans){htmlToDraw+="<li>";obj=wans[i];id=obj.ifname+"_"+obj.srvname;if(obj.tnlname){id+="_"+obj.tnlname;}
id=id.replace(/\./g,"_");id=id.replace(/,/g,"_");obj.id=id;htmlToDraw+="<a href='#' id='"+id+"'>"+obj.name+" ("+connTypeValSet[obj.type]+" "+obj.port+")</a>";htmlToDraw+="</li>"}
htmlToDraw+="</ul>";htmlToDraw+=lng("inetwizphrase3")+" <a href='#' id='addnew'>"+lng("inetwizphrase4")+"</a>."}
else{htmlToDraw+=lng("inetwizphrase8")+" <a href='#' id='addnew'>"+lng("inetwizphrase9")+"</a> "+lng("inetwizphrase10");}
htmlToDraw+="<br><br>"+lng("inetwizphrase5")+" <a href='/index.cgi'>"+lng("inetwizphrase6")+"</a> "+lng("inetwizphrase7");$(this.viewBoxSel).html(htmlToDraw);var id;for(var i in wans){obj=wans[i];$("#"+obj.id).bind("click",{ifname:obj.ifname,srvname:obj.srvname,tnlname:obj.tnlname,srvsname:obj.srvsname},context(this).callback(this.oneditjq));}
$("#addnew").bind("click",{},context(this).callback(this.oneditjq));}
this.oneditjq=function(event){this.ctrl.event("edit",event.data,true);return false;}}
extend(jsInetFirstStepClientView,jsFieldSetClientView);window["prov_list_dir.js"]={man:{name:"wanProvMan",deftype:"pppoe",L2:{},pppoe:{any:{is_wan:true,services:{create:{enable:true,type:"ppp",servicename:"",username:"",password:"",mtu:1492,nat:true,firewall:true,igmp:false,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0}}}},pppoev6:{any:{is_wan:true,services:{create:{enable:true,type:"pppv6",servicename:"",username:"",password:"",mtu:1492,nat:true,firewall:true,igmp:false,keep_alive:{interval:30,fails:3},gwif:true,ipv6_by_slaac:false,ipv6_by_dhcpv6:true,slaac:true,ondemand:0}}}},pppoedual:{any:{is_wan:true,services:{create:{enable:true,type:"pppdual",servicename:"",username:"",password:"",mtu:1492,nat:true,firewall:true,igmp:true,keep_alive:{interval:30,fails:3},gwif:true,ipv6_by_slaac:false,ipv6_by_dhcpv6:true,slaac:true,ondemand:0}}}},static:{any:{type:"ethernet",is_wan:true,services:{create:{enable:true,nat:true,firewall:true,igmp:true,type:"ip"}}}},statkab:{any:{type:"ethernet",is_wan:true,services:{create:{enable:true,nat:true,firewall:true,igmp:true,type:"ip",kabinet:{enable:true}}}}},dynamic:{any:{type:"ethernet",is_wan:true,services:{create:{enable:true,nat:true,firewall:true,type:"ip",dhcp:true,igmp:true,dns_from_dhcp:true}}}},dynkab:{any:{type:"ethernet",is_wan:true,services:{create:{enable:true,nat:true,firewall:true,type:"ip",dhcp:true,igmp:true,dns_from_dhcp:true,kabinet:{enable:true}}}}},staticv6:{any:{type:"ethernet",is_wan:true,services:{create:{enable:true,firewall:true,igmp:false,type:"ipv6"}}}},dynamicv6:{any:{type:"ethernet",is_wan:true,services:{create:{enable:true,firewall:true,type:"ipv6",dhcp:true,igmp:false,ipv6_by_slaac:false,ipv6_by_dhcpv6:true,slaac:true,dns_from_dhcp:true}}}},pptp:{any:{is_wan:true,services:{auto:{type:"auto",tunnels:{create:{enable:true,auto:true,type:"pptp",servicename:"",username:"",password:"",mtu:1456,nat:true,firewall:true,igmp:false,gwif:false,keep_alive:{interval:30,fails:3},ondemand:0}}}}}},"624":{any:{is_wan:true,services:{auto:{type:"auto",tunnels:{create:{enable:true,auto:true,type:"624"}}}}}},statpptp:{any:{type:"ethernet",is_wan:true,services:{create:{enable:true,type:"ip",nat:true,firewall:true,tunnels:{create:{enable:true,auto:true,type:"pptp",servicename:"",username:"",password:"",mtu:1456,nat:true,firewall:true,igmp:true,keep_alive:{interval:30,fails:3},ondemand:0}}}}}},dynpptp:{any:{type:"ethernet",port:"auto",is_wan:true,services:{create:{enable:true,type:"ip",dhcp:true,dns_from_dhcp:true,nat:true,firewall:true,tunnels:{create:{enable:true,auto:true,type:"pptp",servicename:"",username:"",password:"",mtu:1456,nat:true,firewall:true,gwif:true,keep_alive:{interval:30,fails:3},ondemand:0}}}}}},statpppoe:{any:{type:"ethernet",services:{create:{enable:true,type:"ip",nat:true,firewall:true,tunnels:{create:{enable:true,type:"ppp",servicename:"",username:"",password:"",mtu:1492,nat:true,firewall:true,igmp:false,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0}}}}}},dynpppoe:{any:{type:"ethernet",port:"auto",services:{create:{enable:true,type:"ip",dhcp:true,dns_from_dhcp:true,nat:true,firewall:true,tunnels:{create:{enable:true,type:"ppp",servicename:"",username:"",password:"",mtu:1492,nat:true,firewall:true,igmp:false,keep_alive:{interval:30,fails:3},gwif:true,ondemand:0}}}}}},'3g':{any:{type:"3g",is_wan:true,services:{create:{enable:true,type:"ppp",servicename:"",username:"",password:"",mtu:1370,nat:true,firewall:true,igmp:false,keep_alive:{interval:20,fails:10},gwif:true,ondemand:0}}}},'lte':{any:{type:"lte",is_wan:true,services:{create:{enable:true,nat:true,firewall:true,type:"ip",dhcp:true,igmp:true,dns_from_dhcp:true,gwif:true}}}}}};window["prov_list_dir.js"]=$.extend(true,window["prov_list_dir.js"],window.provs3g);var provdlink=window["prov_list_dir.js"].man;provdlink.l2tp=$.extend(true,{},provdlink.pptp);provdlink.l2tp.any.services.auto.tunnels.create.type="l2tp";provdlink.statl2tp=$.extend(true,{},provdlink.statpptp);provdlink.statl2tp.any.services.create.tunnels.create.type="l2tp";provdlink.dynl2tp=$.extend(true,{},provdlink.dynpptp);provdlink.dynl2tp.any.services.create.tunnels.create.type="l2tp";provdlink.statpptpv6=$.extend(true,{},provdlink.statpptp);tunnel=provdlink.statpptpv6.any.services.create.tunnels.create;tunnel.useipv6=true;provdlink.dynpptpv6=$.extend(true,{},provdlink.dynpptp);tunnel=provdlink.dynpptpv6.any.services.create.tunnels.create;tunnel.useipv6=true;provdlink.statl2tpv6=$.extend(true,{},provdlink.statl2tp);tunnel=provdlink.statl2tpv6.any.services.create.tunnels.create;tunnel.useipv6=true;provdlink.dynl2tpv6=$.extend(true,{},provdlink.dynl2tp);tunnel=provdlink.dynl2tpv6.any.services.create.tunnels.create;tunnel.useipv6=true;provdlink.l2tpv6=$.extend(true,{},provdlink.l2tp);tunnel=provdlink.l2tpv6.any.services.auto.tunnels.create;tunnel.useipv6=true;provdlink.pptpv6=$.extend(true,{},provdlink.pptp);tunnel=provdlink.pptpv6.any.services.auto.tunnels.create;tunnel.useipv6=true
function jsDeviceModeServerView(ctrl,viewInx,options){jsDeviceModeServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data){if(!data.baddata&&data.resident){this.ctrl.json=data.resident;this.ctrl.event("dataready");}}}
this.prepareData=function(){var obj;var jsonOutObj;var ctrl=this.ctrl;switch(this.mode){case"save":obj={v2:"y",rq:"y",res_json:"y",res_data_type:"json",res_config_action:somovdParams.CONFIG_ACTION_EDIT,res_config_id:somovdParams.CONFIG_ID_DEVICE_PARAMS,res_struct_size:0};obj.res_buf=$.toJSON(ctrl.json);obj.res_pos=0;this.addToRequest(obj);this.ctrl.event("startreboot",null,true);break;case"update":obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_config_id:somovdParams.CONFIG_ID_DEVICE_PARAMS,res_struct_size:0};this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.mode="update";this.updateView();}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onsaverq);}
extend(jsDeviceModeServerView,jsSSideView);function jsQuickDevModeController(value){jsQuickDevModeController.superclass.constructor.call(this);this.changeModel(new jsInputExModel(value));this.model.WiFiData=null;this.ifaceTypes.client={type:jsQuickDevModeClientView,options:{}};this.nextIface="client";this.ifaceTypes.server={type:jsDeviceModeServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();}
extend(jsQuickDevModeController,jsController);function jsQuickDevModeClientView(ctrl,viewInx,options){options.valset={on:"router",off:"ap"};options.short_on="rmode";options.short_off="apmode";options.widgetStyle=true;options.title='devmodetip';jsQuickDevModeClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsQuickDevModeClientView.prototype.drawView=function(){jsQuickDevModeClientView.superclass.drawView.call(this);$(this.viewBoxSel).append("<img src='/image/preloader.gif' class='preloader' />")
.find(".switcher")
.css("width","80px");this.ctrl.event('updaterq');}
this.onfieldchange=function(inf){this.ctrl.json.device_mode=inf.value;if(confirm(lng("confirm_savereboot"))){this.ctrl.event('saverq');}
else{this.ctrl.model.value=inf.value=="router"?"ap":"router";this.updateView();}}
this.onupdaterq=function(){$(this.myBoxSel).hide();$(this.viewBoxSel+'>img').show();}
this.ondataready=function(){var json=this.ctrl.json;$(this.myBoxSel).show();$(this.viewBoxSel+'>img').hide();if(json){this.ctrl.model.value=json.device_mode;this.updateView();this.enable();$(this.myBoxSel).css('cursor','pointer');}else{this.hide();$(this.myBoxSel).css('cursor','default');}
return false;}
this.bind("fieldchange",this.onfieldchange);this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onupdaterq);this.bind("dataready",this.ondataready);}
extend(jsQuickDevModeClientView,jsSwitcherClientView);function jsQuickTransmissionSettingsController(value){jsQuickTransmissionSettingsController.superclass.constructor.call(this);this.changeModel(new jsInputExModel(value));this.model.Settings=null;this.ifaceTypes.client={type:jsQuickTransmissionSettingsClientView,def:true};this.ifaceTypes.server={type:jsQuickTransmissionSettingsServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();}
extend(jsQuickTransmissionSettingsController,jsController);function jsQuickTransmissionSettingsClientView(ctrl,viewInx,options){options.valset={on:true,off:false};options.widgetStyle=true;options.title='switch_transmission';jsQuickTransmissionSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsQuickTransmissionSettingsClientView.prototype.drawView=function(){jsQuickTransmissionSettingsClientView.superclass.drawView.call(this);$(this.viewBoxSel).append("<img src='/image/preloader.gif' class='preloader' />");this.ctrl.event('updaterq');}
this.onfieldchange=function(inf){this.ctrl.model.value=inf.value;this.ctrl.event('saverq');}
this.onupdaterq=function(){$(this.myBoxSel).hide();$(this.viewBoxSel+'>img').show();}
this.onupdmodel=function(model){var Settings=this.ctrl.model.Settings;$(this.myBoxSel).show();$(this.viewBoxSel+'>img').hide();if(Settings&&!no(Settings.enable)){this.ctrl.model.value=Settings.enable;this.updateView();this.enable();$(this.myBoxSel).css('cursor','pointer');$("a[href='\\#transmission\\/webiface']").attr("href","http://"+document.location.host+":"+Settings["rpc-port"]).attr("target","_blank");$("a[href='\\#transmission\\/webiface']").show();}else{this.disable();$(this.myBoxSel).css('cursor','default');$("a[href='\\#transmission\\/webiface']").hide();}
return false;}
this.bind("fieldchange",this.onfieldchange);this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onupdaterq);this.bind("updmodel",this.onupdmodel);}
extend(jsQuickTransmissionSettingsClientView,jsSwitcherClientView);function jsQuickTransmissionSettingsServerView(ctrl,viewInx,options){jsQuickTransmissionSettingsServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data&&!data.baddata&&data.resident){if(data.resident.transmission)
this.ctrl.model.Settings=data.resident.transmission;else
this.ctrl.model.Settings=data.resident;}else
this.ctrl.model.Settings=null;if(this.mode&&this.mode!="update"){this.ctrl.event("updaterq");}}
this.prepareData=function(){var obj;var jsonOutObj;var ctrl=this.ctrl;switch(this.mode){case"save":obj={v2:"y",rq:"y",res_json:"y",res_data_type:"json",res_config_action:somovdParams.CONFIG_ACTION_EDIT,res_config_id:somovdParams.CONFIG_ID_TRANSMISSION,res_struct_size:0};jsonOutObj=ctrl.model.Settings;jsonOutObj.enable=ctrl.model.value;obj.res_buf=$.toJSON(jsonOutObj);this.addToRequest(obj);break;case"update":obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_config_id:somovdParams.CONFIG_ID_TRANSMISSION,res_struct_size:0};this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.mode="update";this.updateView();}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onsaverq);}
extend(jsQuickTransmissionSettingsServerView,jsSSideView);function jsQuickWiFiController(value,fiveG){jsQuickWiFiController.superclass.constructor.call(this);this.fiveG=fiveG;this.changeModel(new jsInputExModel(value));this.model.WiFiData=null;this.ifaceTypes.client={type:jsQuickWiFiClientView,def:true};this.ifaceTypes.server={type:jsQuickWiFiServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();}
extend(jsQuickWiFiController,jsController);function jsQuickWiFi5GController(value){jsQuickWiFi5GController.superclass.constructor.call(this,value,true);}
extend(jsQuickWiFi5GController,jsQuickWiFiController);function jsQuickWiFiClientView(ctrl,viewInx,options){options.valset={on:true,off:false};options.widgetStyle=true;options.title='switch_wifi';jsQuickWiFiClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsQuickWiFiClientView.prototype.drawView=function(){jsQuickWiFiClientView.superclass.drawView.call(this);$(this.viewBoxSel).append("<img src='/image/preloader.gif' class='preloader' />");this.ctrl.event('updaterq');}
this.onfieldchange=function(inf){this.ctrl.model.value=inf.value;this.ctrl.event('saverq');}
this.onupdaterq=function(){$(this.myBoxSel).hide();$(this.viewBoxSel+'>img').show();}
this.onupdmodel=function(model){var wifiData=this.ctrl.model.WiFiData;$(this.myBoxSel).show();$(this.viewBoxSel+'>img').hide();if(wifiData&&(!no(wifiData.Radio)||!no(wifiData['5G_Radio']))){if(ctrl.fiveG){this.ctrl.model.value=wifiData['5G_Radio'];}
else{this.ctrl.model.value=wifiData.Radio;}
this.updateView();this.enable();$(this.myBoxSel).css('cursor','pointer');}else{this.disable();$(this.myBoxSel).css('cursor','default');};try{var key=window.access_rights.__rpc_index[somovdParams.CONFIG_ID_WIFI];var value=window.access_rights[key].Radio;}catch(e){var value=6;}
if(is.set(value)&&value!=6){this.disable();$(this.myBoxSel).css('cursor','default');};return false;}
this.bind("fieldchange",this.onfieldchange);this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onupdaterq);this.bind("updmodel",this.onupdmodel);}
extend(jsQuickWiFiClientView,jsSwitcherClientView);function jsQuickWiFiServerView(ctrl,viewInx,options){jsQuickWiFiServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;if(data&&!data.baddata&&data.resident){this.ctrl.model.WiFiData=data.resident;}else
this.ctrl.model.WiFiData=null;if(this.mode&&this.mode!="update"){this.ctrl.event("updaterq");}}
this.prepareData=function(){var obj;var jsonOutObj;var ctrl=this.ctrl;switch(this.mode){case"save":obj={v2:"y",rq:"y",res_json:"y",res_data_type:"json",res_config_action:somovdParams.CONFIG_ACTION_EDIT,res_config_id:somovdParams.CONFIG_ID_WIFI_ONOFF,res_struct_size:0};if(this.ctrl.fiveG){jsonOutObj={'5G_Radio':ctrl.model.value};}
else{jsonOutObj={Radio:ctrl.model.value};}
if(this.ctrl.fiveG){jsonOutObj['5G_mbssidNum']=parseInt(ctrl.model.WiFiData['5G_mbssidNum']);jsonOutObj['5G_mbssidCur']=parseInt(ctrl.model.WiFiData['5G_mbssidCur']);}
else{jsonOutObj.mbssidNum=parseInt(ctrl.model.WiFiData.mbssidNum);jsonOutObj.mbssidCur=parseInt(ctrl.model.WiFiData.mbssidCur);}
obj.res_buf=$.toJSON(jsonOutObj);this.addToRequest(obj);break;case"update":obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_config_id:somovdParams.CONFIG_ID_WIFI,res_struct_size:0};this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.mode="update";this.updateView();}
this.onsaverq=function(){this.mode="save";this.updateView();}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onsaverq);}
extend(jsQuickWiFiServerView,jsSSideView);function pageRemoteAccess(){pageRemoteAccess.superclass.constructor.call(this);this.bind("updaterq",function(){try{rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_NEIGHBOUR,somovdParams.CONFIG_ID_HTTPACCESS],callback(this,function(data){this.lanClients=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:[];this.rmaccess=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.httpaccess:null;this.startForm()
.add(new nodeCaption("rmtAccessLabel"))
.add(new formRemoteAccess(this.rmaccess,this.lanClients,this.ifacelist),"form")
.endForm();this.deep.updateView();rootView.hideModalOverlay();}));}
catch(e){this.deep.updateView().$box.errorBlock(lng("error"),e.message);}});this.updateView=function(phase){pageRemoteAccess.superclass.updateView.apply(this,arguments);if(phase=="back"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){var query=this.get("form").query;if(query&&(query.remove.length||query.write.length)){rootView.showModalOverlay();device.config.multi(this.get("form").query,callback(this,function(data){this.emit("updaterq");}));}}}));if(disableFlag(somovdParams.CONFIG_ID_ROUTING)){this.getButton("button_save").disable();}}}}
extend(pageRemoteAccess,node);function formRemoteAccess(rmaccess,lanClients,ifacelist){formRemoteAccess.superclass.constructor.call(this);this.rmaccess=rmaccess;this.ifacelist=ifacelist;this.lanClients=lanClients;this.$grid=null;this.add(new node(),"grid");this.updateModel=function(status){status.error|=!this.$grid.cleanErrors().checkMandatory(true);this.status=status;if(!status.error){var query=this.query={remove:[],write:[]};var actions=gridActionConverter(this.$grid);if(actions.count){for(var i=0;i<actions.deleted.length;i++){query.remove.push([somovdParams.CONFIG_ID_HTTPACCESS,this.rmaccess[actions.deleted[i]],actions.deleted[i]]);}
var temp=actions.changed.concat(actions.added);var r_temp=actions.r_changed.concat(actions.r_added);for(var i=0;i<temp.length;i++){var $row=this.$grid.row(temp[i]);var ips=$row.col("ips").fieldval().split("/");var json={'ips':ips[0],'source_mask':$row.col("source_mask").fieldval(),'dport':$row.col("dport").fieldval()};json.sport=parseInt($row.col("sport").fieldval());query.write.push([somovdParams.CONFIG_ID_HTTPACCESS,json,$row.isNew()?-1:r_temp[i]]);}}}
return!status.error;}
this.updateView=function(phase){formRemoteAccess.superclass.updateView.apply(this,arguments);if(phase=="back"){this.cleanButtonBar().child("grid").$box.empty();this.$grid=this.child("grid").$box.html("\
    <div class='grid rm'></div>\
    <div class='buttonsInline'>\
     <div class='button add'></div>\
    </div>\
   ").find('.grid').lightUIGrid([{index:"ips",name:"ip_address"},{index:"source_mask",name:"masq"},{index:"sport",name:"rmtAccessPortS"},{index:"dport",name:"protocol"}],0,{selectable:true});this.$grid.bind("stopEditing.grid",callback(this,function(event,$cell){this.$grid.cleanErrors();var row=this.$grid.row($cell.irow());var alias=$cell.getColAlias();if($cell.getColAlias()=='ips'&&$cell.fieldval()!=''){row.col("source_mask").fieldval(new IPv4($cell.fieldval()).netmask().toString());}}));this.$grid
.colEditable("ips","ipv4",{mandatory:true})
.colEditable("source_mask","ipv4",{mandatory:true})
.colEditable("sport","number",{mandatory:true,minval:1,maxval:65535})
.colEditable("dport","select",{options:{"HTTP":"80"}});this.get("grid")
.addButton("add")
.getButton("add")
.bind("click.button",callback(this,function(){this.$grid.addRow();var $row=this.$grid.row("last");$row.col("dport").fieldval("80").disable();$row.col("ips").trigger("click");}));for(var i=0;this.rmaccess&&i<this.rmaccess.length;i++){var access=this.rmaccess[i];var $row=this.$grid.addRow().row("last");$row.col("sport").fieldval(access.sport);$row.col("ips").fieldval(access.ips);$row.col("source_mask").fieldval(access.source_mask);$row.col("dport").fieldval(access.dport).disable();}
this.$grid.resetAll();if(disableFlag(somovdParams.CONFIG_ID_ROUTING)){this.get("grid").getButton("add").disable();}}}
this.bind("ruleselect",function(status,value){switch(status.target.getAlias()){}});}
extend(formRemoteAccess,node);function pageDNS(v6){pageDNS.superclass.constructor.call(this);this.ifacelist=null;this.dns=null;this.v6=v6;this.add(new nodeCaption("dnsLabel"))
.add(new nodeCheckBox("manual",false),"manual")
.add(new nodeCheckBox("dnsDefRoute",true),"defroute")
.add(new nodeSelect("iface",'',{disabled:true}),"iface")
.add(new nodeTextArea("dnsServers",'8.8.8.8',{rows:5,disabled:true,mandatory:true,re:[callback(this,function(value){var err=null;var list=new Array();var errlist=new Array();var tmplist=value.replace(/(,|;|\ )/g,'\n').split('\n');for(var i=0;i<tmplist.length;i++){var addr=$.trim(tmplist[i]);if(addr!=''){var valid=(!this.v6)?is.IPv4(addr):is.IPv6(addr);if(valid){list.push(addr);}else{err=true;errlist.push(addr);}}}
if(err){err=lng("dnsAddressWrong")+" "+errlist.join(", ");}else{this.child("servers").val(list.join('\n'));}
return err;})]}),"servers");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageDNS.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(this.child("manual").val(),this.child("defroute").val(),this.child("iface").val(),this.convertIP(this.child("servers").val().split('\n'),true).split('\n'));}}));}
if(phase=="back"){var iface=this.child("iface").cleanOptions();var ifacelist=CreateIfacesValset(this.ifacelist,true,false);for(var i in ifacelist){if(i)iface.addOption(i,ifacelist[i]);}}
return false;}
this.onupdmodel=function(){window.hasChanges=null;this.updateView();return false;}
this.save=function(manual,defroute,ifname,servers){rootView.showModalOverlay();this.dns={'manual':manual,'defroute':defroute,'ifname':(defroute)?ifname:this.dns.ifname,'servers':(manual)?servers.join('|'):this.dns.servers};device.config.write((!this.v6)?somovdParams.CONFIG_ID_DSL_DNS:somovdParams.CONFIG_ID_DSL_DNS_IPV6,this.dns,callback(this,function(){rootView.hideModalOverlay();}));}
this.convertIP=function(rows,noMappedIPv4){if(this.v6){var temp=new Array();for(var i in rows){if(!rows[i].match(/^\n*$/)){temp.push(new jsSubNetIPModel(128,rows[i],16,":",false,true).toString(noMappedIPv4));}}
rows=temp;}
return rows.join('\n');}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WAN_IFACES_LIST,(!this.v6)?somovdParams.CONFIG_ID_DSL_DNS:somovdParams.CONFIG_ID_DSL_DNS_IPV6],callback(this,function(data){this.ifacelist=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident.iface_names:{};this.deep.updateView();this.dns=null;if(is.RPC_SUCCESS(data.rq[1])){if(data.rq[1].resident.dns){this.dns=data.rq[1].resident.dns;}else{this.dns=data.rq[1].resident;}}
if(this.dns){this.child("manual").val(this.dns.manual).fieldchange();this.child("defroute").val(this.dns.defroute).fieldchange();if(this.dns.ifname&&this.dns.ifname!="")
this.child("iface").val(this.dns.ifname);if(this.dns.servers){this.child("servers").val(this.convertIP(this.dns.servers.replace(/\|/g,'\n').split('\n')));}}
rootView.hideModalOverlay();}));});this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"manual":var defroute=this.child("defroute");var iface=this.child("iface");var servers=this.child("servers");if(value){defroute.disable();iface.disable();servers.enable();}else{servers.disable();iface.enable();defroute.enable().fieldchange();}
break;case"defroute":var iface=this.child("iface");if(value)iface.disable();else iface.enable();break;}});}
extend(pageDNS,node);function pageRouting(v6){pageRouting.superclass.constructor.call(this);this.route=null;this.ifacelist=null;this.$grid=null;this.add(new nodeCaption("routingLabel","routingDescText"))
.add(new node(),"grid");this.updateModel=function(status){status.error|=!this.$grid.cleanErrors().checkMandatory(true);this.status=status;}
this.getIfaceName=function(ifname){var ifaces=(this.ifacelist)?this.ifacelist:{};for(var i in ifaces){if(ifaces[i]&&ifaces[i].iface==ifname)return ifaces[i].name;}
return null;}
this.updateView=function(phase){pageRouting.superclass.updateView.apply(this,arguments);try{if(phase=="back"){var route=this.route=[];var r=this.routeAll;var isIPv6;for(var i=0;i<r.length;i++){isIPv6=r[i].ip.match(/:/);if((v6&&isIPv6)||(!v6&&!isIPv6)){route.push(r[i]);}}
var header=[];if(v6){header.push({index:"net_dest",name:"routingNetDestv6"});}
else{header.push({index:"net_dest",name:"routingNetDest"});header.push({index:"net_dest_mask",name:"routingNetDestMask"});}
header.push({index:"gateway",name:"routingGateway"});header.push({index:"metric",name:"metric"});header.push({index:"iface",name:"routingViaIface"});header.push({index:"notavail",name:"routingAvail"});this.cleanButtonBar().child("grid").$box.empty();this.$grid=this.child("grid").$box.html("\
     <div class='grid rm'></div>\
     <div class='buttonsInline'>\
      <div class='button add'></div>\
     </div>\
    ").find('.grid').lightUIGrid(header,0,{selectable:true});this.$grid.bind("stopEditing.grid",callback(this,function(event,$cell){this.$grid.cleanErrors();var row=this.$grid.row($cell.irow());var alias=$cell.getColAlias()
if(!v6){if(alias=='net_dest'&&$cell.fieldval()!=''){row.col("net_dest_mask").fieldval(new IPv4($cell.fieldval()).netmask().toString());row.col("gateway").fieldval(new IPv4($cell.fieldval()).hostmin().toString());}}
if(alias=='iface'||alias=='net_dest'){if(row.col("iface").fieldval()!='auto'){row.col("gateway").fieldval('').disable();}else{row.col("gateway").enable();}}}));if(v6){this.$grid
.colEditable("net_dest","ipv6",{mandatory:true})
.colEditable("gateway","ipv6",{mandatory:true});}
else{this.$grid
.colEditable("gateway","ipv4",{mandatory:true})
.colEditable("net_dest","ipv4",{mandatory:true})
.colEditable("net_dest_mask","ipv4",{mandatory:true});}
this.$grid
.colEditable("metric","number")
.colEditable("iface","select",{options:CreateIfacesValset(this.ifacelist,true,true)});this.get("grid")
.addButton("add")
.getButton("add")
.bind("click.button",callback(this,function(){this.$grid.addRow().row("last").col("net_dest").trigger("click");}));for(var i=0;this.route&&i<this.route.length;i++){var route=this.route[i];var $row=this.$grid.addRow().row("last");var led=(route.notavail)?"ledred.gif":"ledgreen.gif";if(v6){$row.col("net_dest").fieldval((route.ip.match(/:/))?route.ip:route.ip+"/"+calcBitsByMask(route.netmask));}
else{$row.col("net_dest").fieldval(route.ip);$row.col("net_dest_mask").fieldval(route.netmask);}
if(route.iface=='auto'){$row.col("gateway").fieldval(route.gw);}else{$row.col("gateway").disable();}
$row.col("metric").fieldval(route.met);$row.col("iface").fieldval(route.iface);$row.col("notavail").fieldval("<img src='/image/"+led+"' width='6' height='6' alt='' />");}
this.$grid.resetAll();this.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(gridActionConverter(this.$grid));this.$grid.selection().removeRow();}}));if(disableFlag(somovdParams.CONFIG_ID_ROUTING)){this.getButton("button_save").disable();this.get("grid").getButton("add").disable();}}}
catch(e){this.$box.errorBlock(lng("error"),e.message,null,lng("refresh"),callback(this,function(){this.emit("updaterq")}));}}
this.save=function(actions){if(actions.count){rootView.showModalOverlay();var query={remove:[],write:[]};for(var i=0;i<actions.deleted.length;i++){query.remove.push([somovdParams.CONFIG_ID_ROUTING,this.route[actions.deleted[i]],actions.deleted[i]]);}
var temp=actions.changed.concat(actions.added);var r_temp=actions.r_changed.concat(actions.r_added);var json,met;for(var i=0;i<temp.length;i++){var $row=this.$grid.row(temp[i]);var json={'ip':$row.col("net_dest").fieldval(),'gw':$row.col("gateway").fieldval(),'iface':$row.col("iface").fieldval()};if(!v6){json.netmask=$row.col("net_dest_mask").fieldval();}
var met=$row.col("metric").fieldval();parseInt();if(met)json.met=parseInt(met);query.write.push([somovdParams.CONFIG_ID_ROUTING,json,$row.isNew()?-1:r_temp[i]]);}
device.config.multi(query,callback(this,function(data){this.update();}));}}
this.update=function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WAN_IFACES_LIST,somovdParams.CONFIG_ID_ROUTING],callback(this,function(data){this.ifacelist=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident.iface_names:{};this.routeAll=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.route:null;this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);}
extend(pageRouting,node);function pageRoutingIPv6(){pageRoutingIPv6.superclass.constructor.call(this,true);}
extend(pageRoutingIPv6,pageRouting);function jsSearcherModel(defenitions){jsSearcherModel.superclass.constructor.call(this);this.defenitions=defenitions;}
extend(jsSearcherModel,jsModel);function jsSearcherController(defenitions){jsSearcherController.superclass.constructor.call(this);this.changeModel(new jsSearcherModel(defenitions));this.ifaceTypes.client={type:jsSearcherClientView,def:true};}
extend(jsSearcherController,jsController);function jsSearcherClientView(ctrl,viewInx,options){jsSearcherClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.click=function(a){this.ctrl.event('selectpage',{item:a.data,tab:null},true);}
this.onkeyup=function(e){var str=$(this.viewInputSel).val();if(str.toLowerCase()!=this.prevStr){this.findResults(str);this.prevStr=str.toLowerCase();}}
this.findResults=function(str){var defenitions=this.ctrl.model.defenitions;var resultList=[];str=str.toLowerCase();if(str==''){$(this.viewBoxSel+'>h2').html('');this.deleteResults();return;}
function createResultBone(){var htmlToDraw='';htmlToDraw="<div class='searchItem'>";htmlToDraw+="<div class='caption'>";htmlToDraw+="<a href='#'></a>";htmlToDraw+="<span class='group'></span>"
htmlToDraw+="</div>";htmlToDraw+="<div class='description'></div>";htmlToDraw+="<div class='separator'></div>";htmlToDraw+="</div>";return $(htmlToDraw).css('display','none');}
for(var i=0;i<defenitions.length;i++){var list=defenitions[i].list;var group=defenitions[i].name;if(no(list))continue;for(var j=0;j<list.length;j++){if(isObjEmpty(list[j])||list[j].hide)continue;var description=list[j].description||'';if(lng(list[j].item).toLowerCase().search(str)>=0||lng(description).toLowerCase().search(str)>=0){resultList[resultList.length]={'group':group,'list':list[j]};}}}
this.deleteResults();$(this.viewBoxSel+'>h2').html(lng('search_results')+' <i>"'+str+'"</i>');for(var i=0;i<resultList.length;i++){var searchItem=createResultBone();var description=resultList[i].list.description||'';$(searchItem).find('a').attr('href','#'+resultList[i].list.path).text(lng(resultList[i].list.item));$(searchItem).find('span.group').text('('+lng(resultList[i].group)+')');$(searchItem).find('.description').html(lng(description).replace(new RegExp(str,"gi"),"<span class='searchMark'>"+str+"</span>"));$(this.viewBoxSel).append($(searchItem));$(searchItem).find('a').bind('click',resultList[i].list,context(this).callback(this.click));if(i!=resultList.length-1){$(searchItem).fadeIn(200);}else{$(searchItem).fadeIn(200,function(){setTimeout(function(){setScrollbarSize();},200);});}}
if(resultList.length==0){var searchItem=createResultBone();$(searchItem).find('span.group').text(lng('search_empty'));$(this.viewBoxSel).append($(searchItem));$(searchItem).fadeIn(200,function(){setScrollbarSize();});}}
this.deleteResults=function(){$(this.viewBoxSel+'>.searchItem').animate({'opacity':0,'height':0},200,function(){$(this).remove();});}
jsSearcherClientView.prototype.drawView=function(){var options=this.options;this.myBoxSel=options.viewBoxSel;this.viewBoxSel=options.viewBoxSel;this.viewInputSel=options.viewInputSel;$(this.viewBoxSel).html("<h2></h2>");$(this.viewInputSel).bind('keyup',context(this).callback(this.onkeyup));jsSearcherClientView.superclass.drawView.call(this);}
this.prevStr='';}
extend(jsSearcherClientView,jsCSideView);function pageServiceUsers(){pageServiceUsers.superclass.constructor.call(this);this.sysusers=null;this.$grid=null;this.updateView=function(phase){pageServiceUsers.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar().$box.empty();this.$grid=this.$box.html("\
    <div class='grid'></div>\
   ").find('.grid').lightUIGrid([{index:"login",name:"serviceLogin"},{index:"password",name:"servicePass"},{index:"rule",name:"serviceRules"}],0,{clickable:true});for(var i=0;this.sysusers&&i<this.sysusers.length;i++){var user=this.sysusers[i];var $row=this.$grid.addRow().row("last");$row.col("login").fieldval(user.user);$row.col("password").fieldval(new Array(user.password.length+1).join('*'));$row.col("rule").fieldval(lng((user.rule=='1')?'yes':'no'));}
this.$grid.unbind("rowclick.grid")
.bind("rowclick.grid",callback(this,function(event,$row){this.edit(this.sysusers[$row.irow()],$row.irow());}));this.addButton("add")
.getButton("add")
.bind("click.button",callback(this,function(){this.edit();}));this.addButton("clearall")
.getButton("clearall")
.bind("click.button",callback(this,function(){this.clear();}));if(!this.sysusers||!this.sysusers.length)this.getButton("clearall").hide();}}
this.clear=function(){var rmlist=new Array();for(var i=this.sysusers.length;this.sysusers&&i>0;i--){rmlist.push([somovdParams.CONFIG_ID_SYSUSERS,this.sysusers[i-1],i-1]);}
if(rmlist.length){rootView.showModalOverlay();device.config.remove(rmlist,callback(this,function(data){this.emit("updaterq");}));}}
this.edit=function(user,pos){if(is.unset(pos))pos=-1;this.$box.unbind();var formUser=new formServiceUser(user,pos);formUser.buttonBar(this.buttonBar())
.deep.updateView(this.$outerBox)
.cleanButtonBar()
.addButton("button_prev")
.getButton("button_prev")
.bind("click.button",callback(this,function(){this.emit("updaterq");}));if(is.object(user)){formUser.addButton("button_del")
.getButton("button_del")
.bind("click.button",callback(this,function(){rootView.showModalOverlay();device.config.remove(somovdParams.CONFIG_ID_SYSUSERS,user,pos,callback(this,function(){this.emit("updaterq");}));}));}
formUser.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(formUser.deep.updateModel()){rootView.showModalOverlay();device.config.write(somovdParams.CONFIG_ID_SYSUSERS,formUser.user,pos,callback(this,function(){rootView.hideModalOverlay();this.emit("updaterq");}));}}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_SYSUSERS,callback(this,function(data){this.sysusers=(is.RPC_SUCCESS(data))?data.resident.sysusers:null;this.deep.updateView();rootView.hideModalOverlay();}));});}
extend(pageServiceUsers,node);function formServiceUser(user,pos){formServiceUser.superclass.constructor.call(this);if(is.unset(user)){user={};this.adding=true;}
this.user=user;this.pos=pos;this.add(new nodetext("serviceLogin",user.user,{mandatory:true,re:[function(value){value=value.toLowerCase();return(value=="admin"||value=="support"||value=="user"||value=="nobody")?'sambaUserError':null;}]}),"login")
.add(new nodetext("servicePass",user.password,{password:true}),"password")
.add(new nodetext("wanConfirm",user.password,{password:true,re:[callback(this,function(value){return(this.child("password").val()!=value)?'wanConfirmMismatch':null})]}),"confirm")
.add(new nodeCheckBox("serviceRules",user.rule=='1'),"rule");this.updateView=function(phase){formServiceUser.superclass.updateView.apply(this,arguments);}
this.updateModel=function(status){this.user=(!status.error)?{user:this.child('login').val(),password:this.child('password').val(),rule:this.child('rule').val()?'1':'0'}:{};}}
extend(formServiceUser,node);function onClickInfoVersionOnStart(obj){rootCtrl.event('selectpage',pFirmware);}
function onClickEditLanOnStart(obj){rootCtrl.event('selectpage',pageLAN);}
function onClickEditWifiOnStart(obj){rootCtrl.event('selectpage',pWiFiBasic);}
function jsStartModel(json){jsStartModel.superclass.constructor.call(this);this.json=json;}
extend(jsStartModel,jsModel);function jsStartController(){jsStartController.superclass.constructor.call(this);this.changeModel(new jsStartModel(null));this.ifaceTypes.client={type:jsStartClientView};this.ifaceTypes.server={type:jsStartServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();}
extend(jsStartController,jsController);function jsStartClientView(ctrl,viewInx,options){jsStartClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.info={'devInfoName':null,'devInfoVersion':null,'devInfoBuildTime':null,'devInfoVendor':null,'devInfoBugs':null,'devInfoSummary':null};this.params={'devInfoLanIp':null,'devInfoLanMac':null,'SSID':null};if(window.menu_postfix!="_ap"){this.params.LLA=null;this.params.devInfoWanStatus_v4=null;this.params.devInfoWanStatus_v6=null;}
jsStartClientView.prototype.drawView=function(){jsStartClientView.superclass.drawView.call(this);function createItem(name,value){return $("<div class='editCell'><div class='name'>"+lng(name)+":</div><div class='value'>"+value+"</div><div class='clear'></div></div>")}
$(this.viewBoxSel).html('<div id="devinfo"></div>');$(this.viewBoxSel).find('#devinfo').html('<h2 class="titlePage">'+lng('startSepDevInfo')+'</h2>');for(var i in this.info){this.info[i]=createItem(i,'');$(this.viewBoxSel).find('#devinfo').append(this.info[i]);}
$(this.viewBoxSel).find('#devinfo').append(createItem('devInfoSoftRev',webadminParams.SOFT_REVISION));$(this.viewBoxSel).find('#devinfo').append('<h2 class="titlePage">'+lng('netInfo')+'</h2>');for(var i in this.params){this.params[i]=createItem(i,'');$(this.viewBoxSel).find('#devinfo').append(this.params[i]);}}
this.onupdmodel=function(model){var json=this.ctrl.model.json;this.rqInx=0;if(json){if(json[this.rqInx]&&json[this.rqInx].resident){var devinfo=json[this.rqInx].resident;this.info['devInfoName'].find('.value').html(devinfo.fw_name);if(!hideFlag(somovdParams.CMD_FIRMWARE_UPDATE)){var fw_version=devinfo.fw_version;this.info['devInfoVersion'].find('.value').html($("<a href='#'>"+fw_version+"</a>"));this.info['devInfoVersion'].find('.value>a').click(context(this).callback(function(){onClickInfoVersionOnStart(this);}));}
else{this.info['devInfoVersion'].find('.value').html(devinfo.fw_version);}
if(!devinfo.fw_date){this.info["devInfoBuildTime"].hide();}
else{this.info["devInfoBuildTime"].find('.value').html(devinfo.fw_date);}
if(!devinfo.fw_vendor){this.info["devInfoVendor"].hide();}
else{this.info["devInfoVendor"].find('.value').html(devinfo.fw_vendor);}
if(!devinfo.fw_bugs){this.info["devInfoBugs"].hide();}
else{var mail=devinfo.fw_bugs.replace("<","").replace(">","");this.info["devInfoBugs"].find('.value').html("<a href='mailto:"+mail+"'>"+mail+"</a>");}
if(!devinfo.fw_summary){this.info["devInfoSummary"].hide();}
else{this.info["devInfoSummary"].find('.value').html(lng(devinfo.fw_summary));}}
this.rqInx++;if(json[this.rqInx]&&json[this.rqInx].resident&&json[this.rqInx].resident.iface_names){var ifaces=json[this.rqInx].resident.iface_names;this.params["devInfoLanIp"].find('.value').html($("<a href='#'>"+ifaces.br0.services.br0.ip+"</a>").click(context(this).callback(function(){setCookie('editLAN','"+json.ifaces.br0.services.br0.ip+"');onClickEditLanOnStart(this);})));this.params["devInfoLanMac"].find('.value').html($("<a href='#'>"+ifaces.br0.mac+"</a>").click(context(this).callback(function(){setCookie('editLAN','"+json.ifaces.br0.services.br0.ip+"');onClickEditLanOnStart(this);})));if(window.menu_postfix!="_ap"){var wanIpV=''
for(var i=0;i<2;i++){if(i==1)wanIpV='_v6';else wanIpV='_v4';var isWan=false;var wanip=null;var ipv6lla=null;var wanOn=false;var conType=null;var ifTunnel=false;var wanStatus='';var status;var portOn=false;var ports=this.ctrl.model.json[2].resident;var wanConn=getWanConn(ifaces,wanIpV=='_v6');if(wanConn){wanOn=(wanConn.connection_status=="Connected");if(wanConn.L3)
conType=getConnType(wanConn.L2,wanConn.L3,wanConn);else
conType=getConnType(wanConn.L2,wanConn);var ifname=wanConn.iface;var iconPrefix="inet";var iconTitle;iconTitle="Ethernet";if(wanConn.L2.port=="WiFiClient"){iconPrefix="wifi";iconTitle="Wi-Fi";portOn=wanOn;}else if(wanConn.L2.port=="USB"){if(wanConn.L2.type=="3g")iconTitle="3G";if(wanConn.L2.type=="lte")iconTitle="LTE";iconPrefix="3g";portOn=wanOn;}
else if(wanConn.L2.port=="USB-WIMAX"){iconPrefix="3g";portOn=wanOn;iconTitle="WiMax"}
else{for(port in ports){if(ports[port].iface&&ifname==ports[port].iface){status=ports[port].status;isWan=ports[port].is_wan;if(status){portOn=true;break;}}}}
function wanStatusImg(status){return"<img class='wan-status-img' src=\"image/icons/"+iconPrefix+"_"+status+".png \" title=\""+iconTitle+"\"/>";}
wanip=wanConn['ip'+(wanIpV=="_v6"?'v6':'')];if(wanIpV=="_v6"&&is.set(wanConn.ipv6lla)){ipv6lla=wanConn.ipv6lla;}
if(!portOn&&conType!="pppoe"&&(conType=="ip"||conType=="ipv6")){if(menu_postfix=="_ap"){wanStatus+=wanStatusImg("off");}
else{wanStatus+=wanStatusImg("off")+" ; "+lng("wanStatuscableDisconnect")+";";}}else{if(menu_postfix=="_ap"){wanStatus+=wanStatusImg("on");}
else{if(wanOn){wanStatus+=wanStatusImg("on");if(wanip){wanStatus+=" "+wanip+";";}
if(conType){wanStatus+=" "+lng("devInfoWanType")+": "+lng(conType)+"; ";}}else{wanStatus+=wanStatusImg("off");if(conType){wanStatus+=lng("devInfoWanType")+": "+lng(conType);}
var wanCauseDown=this.causeWanDown(conType,wanConn);if(wanCauseDown){wanStatus+="; "+lng(wanCauseDown)+"; ";}}}}
if(is.set(ipv6lla)){wanStatus+=' LLA: '+ipv6lla+"; ";}
var v6prefix=ifaces.br0.services.br0.dhcpd.prefix;if(v6prefix&&wanIpV=='_v6'){wanStatus+=" "+lng("devInfoWanPrefix")+": "+v6prefix+"; ";}}else
wanStatus=lng("wanStatusNotCreated");if(wanStatus){this.params["devInfoWanStatus"+wanIpV].find('.value').html(wanStatus);}else{this.params["devInfoWanStatus"+wanIpV].hide();}}}}
this.rqInx=this.rqInx+2;if(json[this.rqInx]&&json[this.rqInx].resident){var wifi_info=json[this.rqInx].resident;if(wifi_info){var mbssidCur=wifi_info.mbssidCur-1;if(wifi_info.mbssid&&wifi_info.mbssid[mbssidCur]){if(wifi_info.mbssid[mbssidCur].SSID!=undefined)
if(hideFlag("wifi.mbssid_all.SSID")){this.params["SSID"].find('.value').html(wifi_info.mbssid[mbssidCur].SSID);}
else{this.params["SSID"].find('.value').html($("<a href='#'>"+wifi_info.mbssid[mbssidCur].SSID+"</a>").click(context(this).callback(function(){onClickEditWifiOnStart(this);})));}}}}
this.rqInx++;}
if(!window.engine||!window.engine.candyBlack){this.hideModalOverlay();}
return false;}
this.causeWanDown=function(contype,wanConn){var ports=this.ctrl.model.json[2].resident;var result=null;var service=wanConn.L2.services[wanConn.srvname];if(wanConn.L2&&wanConn.L2.services&&getObjectLength(wanConn.L2.services)<1){return"wanStatusNotCreated";}else{var status="wanStatusNotCreated";for(var port in ports){if(wanConn.ifname==ports[port].iface){status=ports[port].status;if(status){if(wanConn.enable){var con_status=null;switch(contype){case"static":case"dinamic":case"statkab":case"dinkab":con_status=null;break;case"pppoe":case"pppoa":if(service){con_status=service.ppp_state;}
break;case"dynpptp":case"dynl2tp":case"statpptp":case"statl2tp":con_status=wanConn.ppp_state;break;}
if(con_status)
switch(con_status){case-1:case 0:result="wanStatusUnknown";break;case 1:result="wanStatusServerNotAvailable";break;case 2:result="wanStatusPeerNegotiationFailed";break;case 3:result="wanStatusPeerNotResponding";break;case 4:result="wanStatusAuthFailed";break;case 100:result="wanStatusRtNotSameNet";break;}
else result="wanStatusUnknown";}
else{result="disable";}}
else{result="wanStatuscableDisconnect";}
break;}}}
return result;}
this.bind("updmodel",this.onupdmodel);}
extend(jsStartClientView,jsCSideView);function jsStartServerView(ctrl,viewInx,options){jsStartServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;var j=1;if(data&&data.rq){this.ctrl.model.json=data.rq;}}
this.prepareData=function(){var rqInx=3;var obj={v2:"y",rq:rqInx,res_json0:"y",res_config_action0:somovdParams.CONFIG_ACTION_READ,res_config_id0:somovdParams.CONFIG_ID_GET_DEVICE_INFO,res_struct_size0:1,res_json1:"y",res_config_action1:somovdParams.CONFIG_ACTION_READ,res_config_id1:somovdParams.CONFIG_ID_WAN_TEMP,res_struct_size1:36,res_json2:"y",res_config_action2:somovdParams.CONFIG_ACTION_READ,res_config_id2:somovdParams.CONFIG_ID_PORT_STATUS,res_struct_size2:1,res_json3:"y",res_config_action3:somovdParams.CONFIG_ID_YANDEXDNS,res_config_id3:somovdParams.CONFIG_ID_YANDEXDNS,res_struct_size3:1,res_json4:"y",res_config_action4:somovdParams.CONFIG_ACTION_READ,res_config_id4:somovdParams.CONFIG_ID_NEIGHBOUR,res_struct_size4:1};obj.rq=rqInx+1;obj["res_json"+rqInx]="y";obj["res_config_action"+rqInx]=somovdParams.CONFIG_ACTION_READ;obj["res_config_id"+rqInx]=somovdParams.CONFIG_ID_WIFI;obj["res_struct_size"+rqInx]=1;rqInx++;this.addToRequest(obj);}
this.startRefresh(0,3000);this.bind("stoprefreshrq",function(){this.stopRefresh();return false;});this.bind("startrefreshrq",function(){this.startRefresh(0,3000);return false;});if(!window.engine||!window.engine.candyBlack){this.onupdaterq=function(){this.updateView();}
this.bind("updaterq",this.onupdaterq);}}
extend(jsStartServerView,jsSSideView);function pageDHCPStat(){pageDHCPStat.superclass.constructor.call(this);this.leases=null;this.rqId=-1;this.virgin=true;this.refreshTime=10000;this.refreshId=null;this.updateView=function(phase){pageDHCPStat.superclass.updateView.apply(this,arguments);if(phase=='back'){this.$grid=this.$box.html("\
    <div class='grid'></div>\
   ").find('.grid').lightUIGrid([{index:"host",name:"statDhcpHost"},{index:"ip",name:"ip_address"},{index:"mac",name:"hwaddr"},{index:"lease",name:"statDhcpExpires"}],0);if(this.leases){for(var i=0;i<this.leases.length;i++){var $row=this.$grid.addRow().row("last");var lease=this.leases[i];$row.col("host").html((lease.hostname!='')?lease.hostname:"<center>-</center>");$row.col("ip").html(lease.ip);$row.col("mac").html(lease.MACAddress);$row.col("lease").html((lease.lease=='')?lng("statDhcpExpired"):lookTime(lease.lease).toString());}}}}
this.update=function(){if(this.virgin)rootView.showModalOverlay();this.rqId=device.config.read(somovdParams.CONFIG_ID_DHCP_LEASES,callback(this,function(data){this.leases=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();this.startRefresh(this.refreshTime);}));this.virgin=false;}
this.startRefresh=function(period){this.refreshId=setTimeout(callback(this,this.update),period);return this;}
this.stopRefresh=function(){device.stop(this.rqId);clearTimeout(this.refreshId);this.virgin=true;return this;}
this.bind("updaterq",function(){this.stopRefresh().startRefresh(0);});this.bind("stoprefreshrq",function(){this.stopRefresh();});}
extend(pageDHCPStat,node);function jsStatIPSettingsModel(service){jsStatIPSettingsModel.superclass.constructor.call(this);this.service=service;}
extend(jsStatIPSettingsModel,jsModel);function jsStatIPSettingsController(service,isadding,disabled){jsStatIPSettingsController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsStatIPSettingsClientView,def:true};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsStatIPSettingsSummaryView};this.ifaceTypes.summary.options={};this.changeModel(new jsStatIPSettingsModel(service));this.isIpOrMaskChanged=false;this.isIpOrMaskv6Changed=false;this.addChild(new jsDecorController(),"desc");var mask=new jsIPv4Controller(service.mask);this.addChild(new jsIPv4Controller(service.ip,mask),"ip");this.addChild(mask,"mask");if(!service.is_wan){this.addChild(new jsIPv6Controller(service.ipv6),"ipv6");}
this.addChild(new jsIPv4Controller(service.gwip),"gwip");this.addChild(new jsIPv4Controller(service.dns_prim),"primaryDns");this.addChild(new jsIPv4Controller(service.dns_sec),"secondaryDns");}
extend(jsStatIPSettingsController,jsFieldSetController);function jsStatIPSettingsClientView(ctrl,viewInx,options){var obj;var service=ctrl.model.service;this.saveIP=function(){var postfix="";var box=this;var service={};service.ip=box.getChild("ip").ctrl.model.toString();service.mask=box.getChild("mask").ctrl.model.toString();if(!this.ctrl.model.service.is_wan){service.ipv6=box.getChild("ipv6").ctrl.model.toString();if(service.ipv6.length){service.useipv6=true;}
else{service.useipv6=false;}}
service.gwip=box.getChild("gwip").ctrl.model.toString();service.dns_prim=box.getChild("primaryDns").ctrl.model.toString();service.dns_sec=box.getChild("secondaryDns").ctrl.model.toString();return service;}
this.updateModel=function(){var res=jsStatIPSettingsClientView.superclass.updateModel.call(this);if(this.ctrl.model.service.is_wan){res&=this.checkGateway();}
if(res){var service=this.ctrl.model.service;service.type="ip";$.extend(true,service,this.saveIP());}
return res;}
this.checkGateway=function(v6){var postfix="";var box=this;var res=true;var doCheck=false;var gwip=box.getChild("gwip");var ip=box.getChild("ip");var mask=box.getChild("mask");if(gwip.statusCode=="wanWrongGwip"){gwip.statusCode=null;}
doCheck=!ip.statusCode&&!gwip.statusCode;if(!v6){doCheck&=!mask.statusCode;}
if(doCheck){var ipModel=ip.ctrl.model;var tmpIPModel=new jsSubNetIPModel(ipModel.bits,ipModel.toString(),ipModel.radix,ipModel.delim,ipModel.expandZero,ipModel.omitFullMask);var gwipModel=gwip.ctrl.model;var tmpGwipModel=new jsSubNetIPModel(gwipModel.bits,gwipModel.toString(),gwipModel.radix,gwipModel.delim,gwipModel.expandZero,gwipModel.omitFullMask);if(!v6){var bitmask=calcBitsByMask(mask.ctrl.model.toString());tmpIPModel.bitmask=bitmask;tmpGwipModel.bitmask=bitmask;}
tmpGwipModel.bitmask=tmpIPModel.bitmask;tmpIPModel.applyMask();tmpGwipModel.applyMask();res=(tmpIPModel.toString()==tmpGwipModel.toString());if(!res){gwip.statusCode="wanWrongGwip";gwip.setError();}}
return res;}
this.onfieldchange=function(obj){var alias=obj.view.ctrl.alias;switch(alias){case"ip":case"mask":this.ctrl.isIpOrMaskChanged=true;break;case"ipv6":this.ctrl.isIpOrMaskv6Changed=true;break;}
return true;}
this.onmodeswitch=function(value){if(this.options.brief){this.getChild("desc").hide();this.getChild("secondaryDns").hide();}
else{this.getChild("desc").show();this.getChild("secondaryDns").show();}
return false;}
this.drawView=function(){jsStatIPSettingsClientView.superclass.drawView.call(this);this.ctrl.event("modeswitch");}
this.blocks=service.blocks;obj=ctrl.getChild("desc");obj.ifaceTypes.separator.options={};opt=obj.ifaceTypes.separator.options;opt.label=service.is_wan?"IP":null;opt.hide=this.blocks||!service.is_wan;obj=ctrl.getChild("ip");opt=obj.ifaceTypes.client.options;opt.humanName="wanIp";opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_STATIP_IP);obj=ctrl.getChild("mask");opt=obj.ifaceTypes.client.options;opt.humanName="wanMask";opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_STATIP_MASK);if(!service.is_wan){obj=ctrl.getChild("ipv6");opt=obj.ifaceTypes.client.options;opt.humanName="wanIpv6";opt.optional=true;opt.disabled=service.dhcpd.dhcp6_pd;}
obj=ctrl.getChild("gwip");opt=obj.ifaceTypes.client.options;opt.humanName="wanGwIp";opt.hide=service.blocks&&!webadminParams.BLOCK_WAN_STATIP_GWIP;if(window.menu_postfix!="_ap"){opt.hide|=!service.is_wan;}
obj=ctrl.getChild("primaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanPrimDns";opt.hide=!service.is_wan;opt.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_STATIP_PRIM_DNS);obj=ctrl.getChild("secondaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanSecDns";opt.optional=true;opt.hide=!service.is_wan;opt.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_STATIP_SEC_DNS);jsStatIPSettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("fieldchange",this.onfieldchange);if(service.wizard){this.bind("modeswitch",this.onmodeswitch);}}
extend(jsStatIPSettingsClientView,jsFieldSetClientView);function jsStatIPSettingsSummaryView(ctrl,viewInx,options){jsStatIPSettingsSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);this.updateView=function(){this.getChild("desc").show();jsStatIPSettingsSummaryView.superclass.drawView.call(this);}}
extend(jsStatIPSettingsSummaryView,jsStatIPSettingsClientView);function jsStatIPv6SettingsModel(service){jsStatIPv6SettingsModel.superclass.constructor.call(this);this.service=service;}
extend(jsStatIPv6SettingsModel,jsModel);function jsStatIPv6SettingsController(service,isadding){jsStatIPv6SettingsController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsStatIPv6SettingsClientView,def:true};this.ifaceTypes.client.options={};this.ifaceTypes.summary={type:jsStatIPv6SettingsClientView};this.ifaceTypes.summary.options={};this.changeModel(new jsStatIPv6SettingsModel(service));this.isIpOrMaskChanged=false;this.addChild(new jsDecorController(),"desc");this.addChild(new jsSubNetIPv6Controller(service.ipv6),"ip");this.addChild(new jsIPv6Controller(service.gwipv6),"gwip");this.addChild(new jsIPv6Controller(service.dns_primv6),"primaryDns");this.addChild(new jsIPv6Controller(service.dns_secv6),"secondaryDns");}
extend(jsStatIPv6SettingsController,jsFieldSetController);function jsStatIPv6SettingsClientView(ctrl,viewInx,options){var obj;var service=ctrl.model.service;this.updateModel=function(){var res=jsStatIPv6SettingsClientView.superclass.updateModel.call(this);if(res){var service=this.ctrl.model.service;service.gwipv6=this.getChild("gwip").ctrl.model.toString();service.ipv6=this.getChild("ip").ctrl.model.toString();service.dns_primv6=this.getChild("primaryDns").ctrl.model.toString();service.dns_secv6=this.getChild("secondaryDns").ctrl.model.toString();service.dns_from_dhcpv6=(service.dns_primv6||service.dns_secv6)?false:true;}
return res;}
this.onmodeswitch=function(value){if(this.options.brief){this.getChild("desc").hide();this.getChild("secondaryDns").hide();}
else{this.getChild("desc").show();this.getChild("secondaryDns").show();}
return false;}
this.drawView=function(){jsStatIPv6SettingsClientView.superclass.drawView.call(this);this.onmodeswitch();}
this.blocks=service.blocks;obj=ctrl.getChild("desc");obj.ifaceTypes.separator.options={label:"IP"};if(this.blocks){obj.ifaceTypes.separator.options.hide=true;}
obj=ctrl.getChild("ip");opt=obj.ifaceTypes.client.options;opt.humanName="wanIpv6";opt.hide=(service.blocks&&!webadminParams.BLOCK_WAN_STATIPV6_IP);obj=ctrl.getChild("gwip");opt=obj.ifaceTypes.client.options;opt.humanName="wanGwIpv6";opt.hide=!service.is_wan||(service.blocks&&!webadminParams.BLOCK_WAN_STATIPV6_GWIP);obj=ctrl.getChild("primaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanPrimIPv6Dns";opt.optional=true;opt.hide=!service.is_wan;opt.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_STATIPV6_PRIM_DNS);obj=ctrl.getChild("secondaryDns");opt=obj.ifaceTypes.client.options;opt.humanName="wanSecIPv6Dns";opt.optional=true;opt.hide=!service.is_wan;opt.hide|=(service.blocks&&!webadminParams.BLOCK_WAN_STATIPV6_SEC_DNS);jsStatIPv6SettingsClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.bind("modeswitch",this.onmodeswitch);}
extend(jsStatIPv6SettingsClientView,jsFieldSetClientView);function pageLANClientsStat(){pageLANClientsStat.superclass.constructor.call(this);this.arplist=null;this.ifacelist=null;this.rqId=-1;this.virgin=true;this.refreshTime=10000;this.refreshId=null;this.updateView=function(phase){pageLANClientsStat.superclass.updateView.apply(this,arguments);if(phase=='forward'){}
if(phase=='back'){var header=[{index:"ip",name:"ip_address"},{index:"flags",name:"statLanClientsFlags"},{index:"mac",name:"hwaddr"},{index:"iface",name:"iface"}];this.$grid=this.$box.html("\
    <div class='grid'></div>\
   ").find('.grid').lightUIGrid(header,0);if(this.arplist){for(var i=0;i<this.arplist.length;i++){var $row=this.$grid.addRow().row("last");var iface_name=null;var client=this.arplist[i];if(client.name){iface_name=client.name;}
else{for(var iface in this.ifacelist){if(this.ifacelist[iface].iface==client.iface){iface_name=this.ifacelist[iface].name;break;}}}
$row.col("ip").html(client.ip);$row.col("flags").html(client.flags);$row.col("mac").html(client.mac);$row.col("iface").html((iface_name)?iface_name:client.iface);}}}}
this.update=function(){if(this.virgin)rootView.showModalOverlay();this.rqId=device.config.read([somovdParams.CONFIG_ID_WAN_IFACES_LIST,somovdParams.CONFIG_ID_NEIGHBOUR],callback(this,function(data){this.ifacelist=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident.iface_names:{};this.arplist=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident:null;this.deep.updateView();rootView.hideModalOverlay();this.startRefresh(this.refreshTime);}));this.virgin=false;}
this.startRefresh=function(period){this.refreshId=setTimeout(callback(this,this.update),period);return this;}
this.stopRefresh=function(){device.stop(this.rqId);clearTimeout(this.refreshId);this.virgin=true;return this;}
this.clealAll=function(){device.config.write(somovdParams.CONFIG_ID_NEIGHBOUR,{clear_all:true},context(this).callback(function(data){rootView.hideModalOverlay();this.emit("updaterq");}));}
this.bind("updaterq",function(){this.stopRefresh().startRefresh(0);});this.bind("stoprefreshrq",function(){this.stopRefresh();});}
extend(pageLANClientsStat,node);function pageRouteStat(){pageRouteStat.superclass.constructor.call(this);this.routetable=null;this.ifacelist=null;this.rqId=-1;this.virgin=true;this.refreshTime=10000;this.refreshId=null;this.updateView=function(phase){pageRouteStat.superclass.updateView.apply(this,arguments);if(phase=='back'){this.$grid=this.$box.html("\
    <div class='grid'></div>\
   ").find('.grid').lightUIGrid([{index:"iface",name:"iface"},{index:"dest",name:"destination"},{index:"gw",name:"statRouteGateway"},{index:"mask",name:"masq"},{index:"flags",name:"statRouteFlags"},{index:"metric",name:"metric"}],0);if(this.routetable){for(var i=0;i<this.routetable.length;i++){var $row=this.$grid.addRow().row("last");var iface_name=null;var rule=this.routetable[i];for(var iface in this.ifacelist){if(this.ifacelist[iface].iface==rule.iface){iface_name=this.ifacelist[iface].name;break;}}
$row.col("iface").html((iface_name)?iface_name:rule.iface);$row.col("dest").html(rule.dest);$row.col("gw").html(rule.gw);$row.col("mask").html(rule.mask);$row.col("flags").html(rule.flags);$row.col("metric").html(rule.metric);$row.col("dest").html(rule.dest);}}}}
this.update=function(){if(this.virgin)rootView.showModalOverlay();this.rqId=device.config.read([somovdParams.CONFIG_ID_WAN_IFACES_LIST,somovdParams.CONFIG_ID_ROUTE_TABLE],callback(this,function(data){this.ifacelist=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident.iface_names:{};this.routetable=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident:null;this.deep.updateView();rootView.hideModalOverlay();this.startRefresh(this.refreshTime);}));this.virgin=false;}
this.startRefresh=function(period){this.refreshId=setTimeout(callback(this,this.update),period);return this;}
this.stopRefresh=function(){device.stop(this.rqId);clearTimeout(this.refreshId);this.virgin=true;return this;}
this.bind("updaterq",function(){this.stopRefresh().startRefresh(0);});this.bind("stoprefreshrq",function(){this.stopRefresh();});}
extend(pageRouteStat,node);function jsSysComController(nodeInfo,frame){jsSysComController.superclass.constructor.call(this,nodeInfo,{});this.model.cmd='';this.model.buf=null;this.model.nonblocking=false;this.ifaceTypes.apply={type:jsSysComApplyView,options:{action:"index.cgi"}};this.onbuildsyscmd=function(){this.children=new Array();this.addChild(new jsFastmenuController({name:'button_reboot',image:null},{frame:this,contentOptions:{cmd:6}}));this.addChild(new jsFastmenuController({name:'button_save_reboot',image:null},{frame:this,contentOptions:{cmd:8}}));this.addChild(new jsFastmenuController({name:'button_conf_save',image:null},{frame:this,contentOptions:{cmd:20}}));if(!disableFlag("CMD_RESTORE_CONFIG")){this.addChild(new jsFastmenuController({name:'button_config_download',image:null},{frame:this,contentOptions:{cmd:12}}));}
if(!disableFlag("CMD_RESET_AND_REBOOT")){this.addChild(new jsFastmenuController({name:'button_factory',image:null},{frame:this,contentOptions:{cmd:10}}));}
this.addChild(new jsFastmenuController({name:'logout',image:null},{frame:this,contentOptions:{cmd:'logout'}}));return false;}
this.onmenuchange=function(menuCtrl){switch(menuCtrl.ctrl.contentOptions.cmd){case"logout":this.fillModel(null);this.frame.event("logoutrq");break;case 6:this.fillModel(menuCtrl);this.frame.event("rebootrq");break;case 10:this.fillModel(menuCtrl);this.frame.event("resetrebootrq");break;default:this.fillModel(menuCtrl);break;}
return false;}
this.fillModel=function(menuCtrl){if(menuCtrl){this.model.cmd=menuCtrl.ctrl.contentOptions.cmd;this.model.buf=menuCtrl.ctrl.contentOptions.buf;this.model.nonblocking=menuCtrl.ctrl.contentOptions.nonblocking;}
else{this.model.cmd=null;this.model.buf=null;this.model.nonblocking=false;}}
this.frame=frame;this.addEventHandler("menuchange",this.onmenuchange);this.addEventHandler("buildsyscmd",this.onbuildsyscmd);}
extend(jsSysComController,jsFastmenuController);function jsSysComApplyView(ctrl,viewInx,options){jsSysComApplyView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var frame=this.ctrl.frame;var status=this.options.sender.responseData.status;if(status==20||status==12){switch(this.ctrl.model.cmd){case 6:break;case 8:break;case 20:frame.event("save");break;case 14:break;case 11:frame.event("cfgrestoreok",status);break;case 12:goto_page("index.cgi?v2_action=givemeconfig",true);break;case 10:break;case somovdParams.CMD_CHECK_DEFAULT_PASS:break;default:frame.event("syscmdcomplete",status);break;}}
else{switch(this.ctrl.model.cmd){case 6:break;case 8:break;case 14:break;case 11:break;case 10:break;default:frame.event("syscmdcomplete",status);break;}}}
this.prepareData=function(){var obj=new Object();var frame=this.ctrl.frame;var model=this.ctrl.model;obj["res_cmd"]=model.cmd;obj["res_buf"]=model.buf;obj["res_cmd_type"]=model.nonblocking?"nbl":"bl";obj["v2"]="y";obj["rq"]="y";this.addToRequest(obj);switch(this.ctrl.model.cmd){case 6:frame.event("startreboot");break;case 8:frame.event("startsavereboot");break;case 10:frame.event("startresetreboot");break;case 14:frame.event("startfwupdate");break;}}
this.onmenuchange=function(menuCtrl){switch(menuCtrl.ctrl.contentOptions.cmd){case"logout":break;case 6:break;case 10:break;case 8:if(confirm(lng("confirm_savereboot"))){this.updateView();}
break;default:this.updateView();break;}
return false;}
this.oncmdcfm=function(){this.updateView();return false;}
this.bind("menuchange",this.onmenuchange);this.bind("cmdcfm",this.oncmdcfm);}
extend(jsSysComApplyView,jsSSideView);function pageSyslogConf(){pageSyslogConf.superclass.constructor.call(this);this.conf=null;var types={slLocal:"local",slRemote:"remote",slBoth:"both"};var levels={"slLevel0":0,"slLevel1":1,"slLevel2":2,"slLevel3":3,"slLevel4":4,"slLevel5":5,"slLevel6":6,"slLevel7":7};this.add(new nodeCheckBox("slLogging",false),"enable")
.add(new node({hidden:true}),"settings")
.child("settings")
.add(new nodeSelect("slType","local"),"type")
.add(new nodeSelect("slLevel",0),"level")
.add(new nodetext("slServer","",{mandatory:true,hidden:true,re:[function(value){return(new RegExp("^([a-z][a-z0-9\-]+(\.|\-*\.))+[a-z]{2,6}$").test(value)||validate_ip_address(value))?null:'slServerWrong';}]}),"server")
.add(new nodenum("port",514,{minval:1,maxval:65535,mandatory:true,hidden:true}),"port");var settings=this.child("settings");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageSyslogConf.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){this.save(this.child("enable").val(),settings.child("type").val(),parseInt(settings.child("level").val()),null,settings.child("server").val(),settings.child("port").val());}}));}
if(phase=="back"){var type=this.child("settings/type").cleanOptions();for(var t in types){if(t)type.addOption(t,types[t]);}
var level=this.child("settings/level").cleanOptions();for(var l in levels){if(l)level.addOption(l,levels[l]);}}}
this.save=function(enable,type,level,rlevel,server,port){rootView.showModalOverlay();this.conf={'enable':enable,'type':(enable)?type:this.conf.type,'level':(enable)?level:this.conf.level,'server':(enable&&type!='local')?server:this.conf.server,'port':(enable&&type!='local')?port:this.conf.port};device.config.write(somovdParams.CONFIG_ID_SYSLOG_CONF,this.conf,callback(this,function(){rootView.hideModalOverlay();}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_SYSLOG_CONF,callback(this,function(data){this.deep.updateView();this.conf=(is.RPC_SUCCESS(data))?data.resident:null;if(this.conf){this.child("enable").val(this.conf.enable).fieldchange();settings.child("level").val(this.conf.level);settings.child("type").val(this.conf.type).fieldchange();settings.child("server").val(this.conf.server);settings.child("port").val(this.conf.port);}
rootView.hideModalOverlay();}));});this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"enable":if(value)settings.show();else settings.hide();break;case"type":switch(value){case'local':settings.child("level").enable();settings.child("server").hide();settings.child("port").hide();break;case'remote':settings.child("server").show();settings.child("port").show();settings.child("level").enable();break;case'both':settings.child("level").enable();settings.child("server").show();settings.child("port").show();break;}
break;}});}
extend(pageSyslogConf,node);function pageTelnet(){pageTelnet.superclass.constructor.call(this);this.json=null;this.CONFIG_ID=somovdParams.CONFIG_ID_TELNETD;this.updateModel=function(status){this.status=status;if(!status.error){this.json={'enable':this.get("enable").val()};this.json.port=parseInt(this.child("port").val());}
if(this.CONFIG_ID==somovdParams.CONFIG_ID_SSHD){this.jsonOutObj={ssh:this.json};}
else{this.jsonOutObj={telnet:this.json};}
return!status.error;}
this.updateView=function(phase){pageTelnet.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(this.child("enable").val(),parseInt(this.child("port").val()));}}));}}
this.save=function(enable,port){if(this.deep.updateModel()){var query=this.query={write:[]};query.write.push([this.CONFIG_ID,this.jsonOutObj]);rootView.showModalOverlay();device.config.multi(query,callback(this,function(data){rootView.hideModalOverlay();this.emit("updaterq");}));}}
this.bind("updaterq",function(){rootView.showModalOverlay();var query=[this.CONFIG_ID];device.config.read(query,callback(this,function(data){try{if(this.CONFIG_ID==somovdParams.CONFIG_ID_SSHD){this.json=data.rq[0].resident.ssh;}
else{this.json=data.rq[0].resident.telnet;}
this.startForm()
.add(new nodeCaption("telnetLabel"))
.add(new nodeCheckBox("telnetOn",this.json.enable),"enable");this.add(new nodenum("telnetPort",this.json.port,{minval:1,maxval:65535,disabled:true,mandatory:true}),"port");this.listen("enable","endform fieldchange",function(status,value){var port=this.child("port");if(value)port.enable();else port.disable();});this.endForm();this.deep.updateView();rootView.hideModalOverlay();}
catch(e){this.deep.updateView().$box.errorBlock(lng("error"),e.message);}}));});}
extend(pageTelnet,node);function jsTextareaController(value){jsTextareaController.superclass.constructor.call(this);this.ifaceTypes.textarea={type:jsInputSlotView};this.addChild(new jsTextareaFieldController(value),"field");this.changeModel(this.getChild("field").model);}
extend(jsTextareaController,jsEditController);function jsTextareaFieldController(value){jsTextareaFieldController.superclass.constructor.call(this);this.ifaceTypes.textarea={type:jsTextareaClientView};this.changeModel(new jsInputModel(value));this.modified=false;this.setModified=function(obj){this.modified=true;return true;}
this.addEventHandler("fieldchange",this.setModified);}
extend(jsTextareaFieldController,jsController);function jsTextareaClientView(ctrl,viewInx,options){jsTextareaClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsTextareaClientView.prototype.drawView=function(){jsTextareaClientView.superclass.drawView.call(this);var htmlToDraw="";var options=this.options;if(options.summary){this.inputSel=options.viewBoxSel;delete this.inputId;}
else{if(no(this.inputId)){this.inputId="elemId"+getUID();}
this.inputSel="#"+this.inputId;htmlToDraw="<textarea id='"+this.inputId+"' type='";htmlToDraw+=options.password?"password":"text";htmlToDraw+="'/>";}
this.html(htmlToDraw);this.$input.bind("keyup",context(this).callback(this.onfieldchangejq));}
jsTextareaClientView.prototype.updateModel=function(){this.ctrl.model.value=this.val();return jsTextareaClientView.superclass.updateModel.call(this);}
jsTextareaClientView.prototype.updateView=function(){this.val(this.ctrl.model.value);jsTextareaClientView.superclass.updateView.call(this);}}
extend(jsTextareaClientView,jsBaseInputView);function tr69AuthForm(){tr69AuthForm.superclass.constructor.apply(this,arguments);this.tr69=null;this.add(new nodeCaption("authTitle","authComment"))
.add(new nodetext("hs_login",'support',{hidden:true}),"login")
.add(new nodetext("hs_password",'',{password:true,}),"password")
.add(new node(),'btn');this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){tr69AuthForm.superclass.updateView.apply(this,arguments);if(phase=="back"){this.child("btn").cleanButtonBar()
.addButton("button_enter")
.getButton("button_enter")
.bind("click.button",callback(this,function(){this.auth();}));}}
this.auth=function(){rootView.showModalOverlay();device
.setAuthData(somovdParams.CONFIG_ID_TR69,this.child("login").val(),this.child("password").val())
.config.read(somovdParams.CONFIG_ID_TR69,callback(this,function(answer){rootView.hideModalOverlay();if(is.RPC_PERMISSION_DENIED(answer)){alert(lng("autherror"));}else{this.emit("auth_ok.tr69",answer.resident);}}));}}
extend(tr69AuthForm,node);function pageTR69(){pageTR69.superclass.constructor.call(this);this.tr69=null;this.ifacelist=null;this.conns={};var authform=this.add(new tr69AuthForm(),"authform").child("authform");var settings=this.add(new node({hidden:true}),"settings").child("settings");settings.add(new nodeSelect("iface"),"iface");settings.add(new nodeCheckBox("tr69OnOff"),"onoff");settings.add(new nodeCaption("tr69LabelInform"))
.add(new nodeCheckBox("tr69Enable"),"enable")
.add(new nodenum("tr69Interval",86400),"interval");settings.add(new nodeCaption("tr69LabelAcs"))
.add(new nodetext("tr69URL"),"acs_url");settings.add(new nodetext("tr69UserName"),"acs_user")
.add(new nodetext("tr69Password",'',{password:true}),"acs_password")
.add(new nodeCaption("tr69LabelConn"))
.add(new nodetext("tr69UserName"),"conn_user")
.add(new nodetext("tr69Password",'',{password:true}),"conn_password");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageTR69.superclass.updateView.apply(this,arguments);if(phase=="back"){var iface=this.child("settings/iface").cleanOptions();var connArr=getConnArray(this.ifacelist);var obj;iface.addOption("wanAuto","ANY_WAN")
for(var i in connArr){obj=connArr[i];iface.addOption(obj.name,obj.iface);this.conns[obj.iface]=obj;}
var tr69=this.tr69;if(tr69){settings.child("iface").val(tr69.iface);settings.child("acs_url").val(tr69.AcsURL);settings.child("onoff").val(tr69.Enable);settings.child("enable").val(tr69.InformEnable);settings.child("interval").val(tr69.InformInterval);settings.child("acs_user").val(tr69.AcsUser);settings.child("acs_password").val(tr69.AcsPwd);settings.child("conn_user").val(tr69.ConnReqUser);settings.child("conn_password").val(tr69.ConnReqPwd);}
this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){this.save();}}));}}
this.save=function(){rootView.showModalOverlay();this.tr69={'Enable':settings.child("onoff").val(),'InformEnable':settings.child("enable").val(),'InformInterval':settings.child("interval").val(),'AcsURL':settings.child("acs_url").val(),'AcsUser':settings.child("acs_user").val(),'AcsPwd':settings.child("acs_password").val(),'ConnReqUser':settings.child("conn_user").val(),'ConnReqPwd':settings.child("conn_password").val()};var iface=settings.child("iface").val()
this.tr69.iface=iface;var conn=this.conns[iface];if(conn){this.tr69.l2_key=conn.L2.ifname;if(conn.L3)
this.tr69.l3_key=conn.L3.ifname;else
this.tr69.l3_key=conn.ifname;}
device.config.write(somovdParams.CONFIG_ID_TR69,this.tr69,callback(this,function(){rootView.hideModalOverlay();this.emit("updaterq");}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WAN_TEMP,callback(this,function(data){this.ifacelist=(is.RPC_SUCCESS(data))?data.resident.iface_names:{};}));device.config.read(somovdParams.CONFIG_ID_TR69,callback(this,function(data){this.tr69=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();if(is.RPC_PERMISSION_DENIED(data)){authform.show();settings.hide();this.getButton("button_save").hide();}
rootView.hideModalOverlay();}));});this.bind("auth_ok.tr69",function(e,tr69){this.tr69=tr69;this.deep.updateView();authform.hide();settings.show();this.getButton("button_save").show();});}
extend(pageTR69,node);function pageTraceroute(){pageTraceroute.superclass.constructor.call(this);this.updateView=function(phase){pageTraceroute.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_start")
.getButton("button_start")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(this.status&&!this.status.error){this.traceroute();}}));this.startForm()
.add(new nodetext("troHost","",{mandatory:true}),"troHost")
this.add(new nodeCheckBox("troV6",''),"troV6");this.add(new node(),"troLog")
.endForm();}}
this.updateModel=function(status){this.status=status;}
this.traceroute=function(){rootView.showModalOverlay();var outObj={host:this.child('troHost').val()};outObj.is_ipv6=this.child('troV6').val();device.config.write(somovdParams.CONFIG_ID_TRACEROUTE,outObj,callback(this,function(answer){if(answer.resident){rootView.hideModalOverlay();var textLog=null;if(answer.resident.traceroute)
textLog=answer.resident.traceroute;if(answer.resident.traceroute6)
textLog=answer.resident.traceroute6;var log=this.child("troLog");log.$box.html($("\
     <div class='console syslog'>\
      <pre>"+textLog+"</pre>\
     </div>\
    "));}}));}
this.bind("updaterq",function(){this.deep.updateView();});}
extend(pageTraceroute,node);function jsTunnelModel(tunnel,service,ifnode,isadding,iftree){jsTunnelModel.superclass.constructor.call(this);this.tunnel=tunnel;this.service=service;this.ifnode=ifnode;this.iftree=iftree;this.isadding=isadding;}
extend(jsTunnelModel,jsModel);function jsTunnelController(tunnel,service,ifnode,isadding,iftree){jsTunnelController.superclass.constructor.call(this);this.changeModel(new jsTunnelModel(tunnel,service,ifnode,isadding,iftree));var divTunnel=this.addChild(new jsFieldSetController(),"divTunnel");divTunnel.addChild(new jsPPPController(tunnel,service,ifnode,iftree,isadding),"PPP");this.ifaceTypes.client={type:jsTunnelClientView};this.ifaceTypes.client.options={inputPadding:"200px"};}
extend(jsTunnelController,jsFieldSetController);function jsTunnelClientView(ctrl,viewInx,options){var obj;var ifnode=ctrl.model.ifnode;var service=ctrl.model.service;var tunnel=ctrl.model.tunnel;var tree=ctrl.model.iftree;var type;if(tunnel)type=tunnel.type;else type=ctrl.model.service.contype;var divTunnel=ctrl.getChild("divTunnel");divTunnel.nextIface="client";divTunnel.ifaceTypes.client.options={nothing:true};if(type=="pptp"||type=="l2tp")divTunnel.ifaceTypes.client.options.hide=false;else divTunnel.ifaceTypes.client.options.hide=true;obj=divTunnel.getChild("PPP");obj.nextIface="client";opt=obj.ifaceTypes.client.options;this.updateView=function(){if(service.contype=="l2tp"||service.contype=="pptp")this.getChild("divTunnel").show();else this.getChild("divTunnel").hide();jsTunnelClientView.superclass.updateView.call(this);}
this.updateModel=function(){ctrl.model.service=ctrl.getChild("divTunnel").getChild("PPP").model.service;return 1;}
jsTunnelClientView.superclass.constructor.call(this,ctrl,viewInx,options);}
extend(jsTunnelClientView,jsFieldSetClientView);function jsUMountController(){jsUMountController.superclass.constructor.call(this);this.model={'devList':[]};this.ifaceTypes.client={type:jsUMountClientView,def:true};this.ifaceTypes.server={type:jsUMountServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.nextIface="server";this.addIface();}
extend(jsUMountController,jsController);function jsUMountClientView(ctrl,viewInx,options){jsUMountClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.eject=function(){if(this.ctrl.model.devList.length||this.mounted){if(confirm(lng("storInfoUnmountConfirm"))){this.ctrl.event("umountrq");}}}
jsUMountClientView.prototype.drawView=function(){jsUMountClientView.superclass.drawView.call(this);var htmlToDraw='';var options=this.options;this.myBoxSel=this.viewBoxSel+'>img:eq(0)';this.preloaderSel=this.viewBoxSel+'>img:eq(1)';htmlToDraw="<img src='/image/eject.gif' title='"+lng('umount_usb')+"' class='umount unselectable' />";htmlToDraw+="<img src='/image/preloader.gif' class='preloader' />";$(this.viewBoxSel).html(htmlToDraw);this.ctrl.event('updaterq');}
this.setEjectAction=function(){$(this.myBoxSel).fadeTo(0,1);$(this.myBoxSel).css('cursor','pointer');$(this.myBoxSel).unbind('click');$(this.myBoxSel).bind('click',context(this).callback(this.eject));}
this.unsetEjectAction=function(){$(this.myBoxSel).fadeTo(0,0.2);$(this.myBoxSel).css('cursor','default');$(this.myBoxSel).unbind('click');}
this.onupdaterq=function(){$(this.myBoxSel).hide();$(this.preloaderSel).show();}
this.onupdmodel=function(model){var devList=this.ctrl.model.devList=[];var usb_storage=this.ctrl.model.usb_storage;if(usb_storage){for(var dev in usb_storage){devList.push(dev);}}
$(this.preloaderSel).hide();$(this.myBoxSel).show();if(this.ctrl.model.devList.length){this.setEjectAction();}else{this.unsetEjectAction();}
return false;}
this.onsetaction=function(mounted){if(mounted){this.mounted=true;this.setEjectAction();}else{this.mounted=false;this.unsetEjectAction();}
return false;}
this.bind("updaterq",this.onupdaterq);this.bind("umountrq",this.onupdaterq);this.bind("updmodel",this.onupdmodel);this.bind("setaction",this.onsetaction);}
extend(jsUMountClientView,jsCSideView);function jsUMountServerView(ctrl,viewInx,options){jsUMountServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;this.ctrl.model.StorageData=[];delete this.ctrl.model.usb_storage;if(data&&!data.baddata&&data.resident){this.ctrl.model.usb_storage=data.resident.usb_storage;}
if(this.mode&&this.mode!="update"){this.ctrl.event("updaterq");}}
this.prepareData=function(){var obj;var jsonOutObj;switch(this.mode){case"update":obj={v2:"y",rq:"y",res_json:"y",res_config_action:somovdParams.CONFIG_ACTION_READ,res_config_id:somovdParams.CONFIG_ID_USB_VOLUME,res_struct_size:0};this.addToRequest(obj);break;case"umount":var devList=this.ctrl.model.devList;obj={v2:"y",rq:devList.length};for(var i=0;i<devList.length;i++){obj['res_json'+i]='y';obj['res_config_action'+i]=somovdParams.CONFIG_ACTION_EDIT;obj['res_config_id'+i]=somovdParams.CONFIG_ID_USB_UMOUNT;obj['res_struct_size'+i]=1;obj['res_buf'+i]=$.toJSON({name:devList[i]});}
this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.mode="update";this.updateView();}
this.onumountrq=function(){this.mode="umount";this.updateView();}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("umountrq",this.onumountrq);}
extend(jsUMountServerView,jsSSideView);(function(){function q(a,c,d){if(a===c)return a!==0||1/a==1/c;if(a==null||c==null)return a===c;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return false;switch(e){case"[object String]":return a==String(c);case"[object Number]":return a!=+a?c!=+c:a==0?1/a==1/c:a==+c;case"[object Date]":case"[object Boolean]":return+a==+c;case"[object RegExp]":return a.source==c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if(typeof a!="object"||typeof c!="object")return false;for(var f=d.length;f--;)if(d[f]==a)return true;d.push(a);var f=0,g=true;if(e=="[object Array]"){if(f=a.length,g=f==c.length)for(;f--;)if(!(g=f in a==f in c&&q(a[f],c[f],d)))break}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return false;for(var h in a)if(b.has(a,h)&&(f++,!(g=b.has(c,h)&&q(a[h],c[h],d))))break;if(g){for(h in c)if(b.has(c,h)&&!f--)break;g=!f}}d.pop();return g}var r=this,G=r._,n={},k=Array.prototype,o=Object.prototype,i=k.slice,H=k.unshift,l=o.toString,I=o.hasOwnProperty,w=k.forEach,x=k.map,y=k.reduce,z=k.reduceRight,A=k.filter,B=k.every,C=k.some,p=k.indexOf,D=k.lastIndexOf,o=Array.isArray,J=Object.keys,s=Function.prototype.bind,b=function(a){return new m(a)};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports)exports=module.exports=b;exports._=b}else r._=b;b.VERSION="1.3.1";var j=b.each=b.forEach=function(a,c,d){if(a!=null)if(w&&a.forEach===w)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(d,a[e],e,a)===n)break}else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===n)break};b.map=b.collect=function(a,c,b){var e=[];if(a==null)return e;if(x&&a.map===x)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});if(a.length===+a.length)e.length=a.length;return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(y&&a.reduce===y)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);j(a,function(a,b,i){f?d=c.call(e,d,a,b,i):(d=a,f=true)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(z&&a.reduceRight===z)return e&&(c=b.bind(c,e)),f?a.reduceRight(c,d):a.reduceRight(c);var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,c,b){var e;E(a,function(a,g,h){if(c.call(b,a,g,h))return e=a,true});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(A&&a.filter===A)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(B&&a.every===B)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h)))return n});return e};var E=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(C&&a.some===C)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return n});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;return p&&a.indexOf===p?a.indexOf(c)!=-1:b=E(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(b.isFunction(c)?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var b=[],d;j(a,function(a,f){f==0?b[0]=a:(d=Math.floor(Math.random()*(f+1)),b[f]=b[d],b[d]=a)});return b};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?i.call(a):b.isArguments(a)?i.call(a):b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];b.reduce(d,function(d,g,h){if(0==h||(c===true?b.last(d)!=g:!b.include(d,g)))d[d.length]=g,e[e.length]=a[h];return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1));return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(p&&a.indexOf===p)return a.indexOf(c);for(d=0,e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(D&&a.lastIndexOf===D)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};var F=function(){};b.bind=function(a,c){var d,e;if(a.bind===s&&s)return s.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));F.prototype=a.prototype;var b=new F,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i=b.debounce(function(){h=g=false},c);return function(){d=this;e=arguments;var b;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);i()},c));g?h=true:a.apply(d,e);i();g=true}};b.debounce=function(a,b){var d;return function(){var e=this,f=arguments;clearTimeout(d);d=setTimeout(function(){d=null;a.apply(e,f)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments,0));return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=J||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return q(a,b,[])};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(b.has(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=o||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};if(!b.isArguments(arguments))b.isArguments=function(a){return!(!a||!b.has(a,"callee"))};b.isFunction=function(a){return l.call(a)=="[object Function]"};b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)=="[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.has=function(a,b){return I.call(a,b)};b.noConflict=function(){r._=G;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.mixin=function(a){j(b.functions(a),function(c){K(c,b[c]=a[c])})};var L=0;b.uniqueId=function(a){var b=L++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var t=/.^/,u=function(a){return a.replace(/\\\\/g,"\\").replace(/\\'/g,"'")};b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.escape||t,function(a,b){return"',_.escape("+
u(b)+"),'"}).replace(d.interpolate||t,function(a,b){return"',"+u(b)+",'"}).replace(d.evaluate||t,function(a,b){return"');"+u(b).replace(/[\r\n\t]/g," ")+";__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",e=new Function("obj","_",d);return c?e(c,b):function(a){return e.call(this,a,b)}};b.chain=function(a){return b(a).chain()};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var v=function(a,c){return c?b(a).chain():a},K=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);H.call(a,this._wrapped);return v(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];m.prototype[a]=function(){var d=this._wrapped;b.apply(d,arguments);var e=d.length;(a=="shift"||a=="splice")&&e===0&&delete d[0];return v(d,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return v(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=true;return this};m.prototype.value=function(){return this._wrapped}}).call(this);function pageUPnP(){pageUPnP.superclass.constructor.call(this);this.upnp=null;this.iftree=null;this.ports=null;this.$grid=null;this.updateView=function(phase){pageUPnP.superclass.updateView.apply(this,arguments);if(phase=="back"){if(this.upnp.enable){var header=[];header.push({index:"protocol",name:"protocol"});header.push({index:"ip",name:"IP"});header.push({index:"port",name:"vserversPortDst"});header.push({index:"ext_port",name:"vserversPortFw"});header.push({index:"comment",name:"comment"});this.$grid=this.child("grid").$box.html("\
     <div class='grid rm'></div>\
     ").find('.grid').lightUIGrid(header,0,{selectable:false});for(var i in this.ports){var $row=this.$grid.addRow().row("last");$row.col("protocol").fieldval(this.ports[i].protocol);$row.col("ip").fieldval(this.ports[i].addr);$row.col("port").fieldval(this.ports[i].port);$row.col("ext_port").fieldval(this.ports[i].ext_port);$row.col("comment").fieldval(this.ports[i].descr);}}}
if(phase=="forward"){var upnp=this.upnp;this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){var enable=this.get("enable").val();this.upnp={enable:enable}
rootView.showModalOverlay();device.config.write(somovdParams.CONFIG_ID_UPNP,this.upnp,callback(this,function(){this.upnp=null;rootView.hideModalOverlay();this.emit("updaterq");}));}}));this.startForm()
.add(new nodeCheckBox("enable",upnp.enable),"enable")
.add(new node(),"grid");this.endForm();}}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_UPNP,somovdParams.CONFIG_ID_UPNP_LEASES],callback(this,function(data){if(is.RPC_SUCCESS(data.rq[0])){if(data.rq[0].resident.upnp){this.upnp=data.rq[0].resident.upnp;}
else{this.upnp=data.rq[0].resident;}}
if(is.RPC_SUCCESS(data.rq[1])){this.ports=data.rq[1].resident;}
this.deep.updateView();rootView.hideModalOverlay();}));});}
extend(pageUPnP,node);function pageURLFilterConfig(){pageURLFilterConfig.superclass.constructor.call(this);this.settings=null;var types={"urlfConfTypeExc":"Exclude","urlfConfTypeInc":"Include"};this.add(new nodeCaption("urlfConfLabel"))
.add(new nodeCheckBox("urlfConfEnable",false),"url_enable")
.add(new nodeSelect("urlfConfType",'',{disabled:true}),"url_type");this.updateView=function(phase){pageURLFilterConfig.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.save(this.child("url_enable").val(),this.child("url_type").val());}));if(disableFlag(somovdParams.CONFIG_ID_GET_URLF_CONFIG)){this.getButton("button_save").disable();}}
if(phase=="back"){var url_type=this.child("url_type").cleanOptions();for(var t in types){if(t)url_type.addOption(t,types[t]);}}}
this.save=function(enable,type){rootView.showModalOverlay();this.deep.updateModel();this.settings={'enable':enable,'type':(enable)?type:this.settings.type};device.config.write(somovdParams.CONFIG_ID_GET_URLF_CONFIG,this.settings,callback(this,function(){rootView.hideModalOverlay();}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_GET_URLF_CONFIG,callback(this,function(data){this.deep.updateView();this.settings=null;if(is.RPC_SUCCESS(data)){this.settings=(data.resident.urlsetting)?data.resident.urlsetting:data.resident;}
if(this.settings){this.child("url_enable").val(this.settings.enable);this.child("url_enable").fieldchange();this.child("url_type").val(this.settings.type);}
rootView.hideModalOverlay();}));});this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"url_enable":var url_type=this.child("url_type");if(value)url_type.enable();else url_type.disable();break;}});}
extend(pageURLFilterConfig,node);function pageURLFilter(){pageURLFilter.superclass.constructor.call(this);this.urlist=null;this.$grid=null;this.add(new nodeCaption("urlfAddrLabel","urlfAddrDescText"))
.add(new node(),"grid");this.updateModel=function(status){status.error|=!this.$grid.cleanErrors().checkMandatory(true);this.status=status;}
this.updateView=function(phase){pageURLFilter.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar().$box.empty();this.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(gridActionConverter(this.$grid));this.$grid.selection().removeRow();}}));}
if(phase=='back'){this.$grid=this.child("grid").$box.html("\
    <div class='grid rm'></div>\
    <div class='buttonsInline'>\
     <div class='button add'></div>\
    </div>\
   ").find('.grid').lightUIGrid([{index:"address",name:"urlfAddress"},{index:"favicon",name:""}],0,{selectable:true});this.$grid.bind("stopEditing.grid",callback(this,function(event,$cell){this.$grid.cleanErrors();}));this.$grid.bind("cellChange.grid",callback(this,function(event,$cell){this.$grid.row($cell.irow()).col("favicon").css({'background':"url('http://"+$cell.fieldval()+"/favicon.ico') no-repeat center center"});}));this.$grid.colEditable("address","text",{mandatory:true,unique:'soft',re:function(value){var isHttp=false;if(value.substr(0,5)=='http:')
isHttp=true;var a=document.createElement('a');a.href=value;if(a.protocol=='http:'&&!isHttp){return null;}else{return"urlfSchemaError";}}});this.get("grid")
.addButton("add")
.getButton("add")
.bind("click.button",callback(this,function(){var $row=this.$grid.addRow().row("last");$row.col("address").trigger("click");}));for(var i=0;this.urlist&&i<this.urlist.length;i++){var $row=this.$grid.addRow().row("last");var ufilter=this.urlist[i];$row.col("address").fieldval(ufilter.url);$row.col("favicon").css({'background':"url('http://"+ufilter.url+"/favicon.ico') no-repeat center center"});}
this.$grid.resetAll();if(disableFlag(somovdParams.CONFIG_ID_GET_URL_LIST)){this.get("grid").getButton("add").disable();this.getButton("button_save").disable();}}}
this.save=function(actions){if(actions.count){rootView.showModalOverlay();var query={remove:[],write:[]};if(actions.deleted.length&&actions.deleted.length==this.$grid.nrow()-this.$grid.newRows().length){query.remove.push([somovdParams.CONFIG_ID_GET_URL_LIST,{clear:true}]);}else{for(var i=0;i<actions.deleted.length;i++){query.remove.push([somovdParams.CONFIG_ID_GET_URL_LIST,this.urlist[actions.deleted[i]],actions.deleted[i]]);}}
var temp=actions.changed.concat(actions.added);var r_temp=actions.r_changed.concat(actions.r_added);for(var i=0;i<temp.length;i++){var $row=this.$grid.row(temp[i]);query.write.push([somovdParams.CONFIG_ID_GET_URL_LIST,{'url':$row.col("address").fieldval()},$row.isNew()?-1:r_temp[i]]);}
device.config.multi(query,callback(this,function(data){this.update();}));}}
this.update=function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_GET_URL_LIST,callback(this,function(data){this.urlist=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);}
extend(pageURLFilter,node);function pageVirtServ(){pageVirtServ.superclass.constructor.call(this);this.updateView=function(phase){pageVirtServ.superclass.updateView.apply(this,arguments);if(phase=="forward"){var header=[{index:"name",name:"vserversName"},{index:"iface",name:"vserversIface"},{index:"protocol",name:"vserversProtocol"},{index:"port_fw",name:"vserversPortFw"},{index:"port_dst",name:"vserversPortDst"},{index:"ip_dst",name:"vserversIPDst"},{index:"remote_ip",name:"vserversRemoteIp"}];var $grid=this.$box.lightUIGrid(header,0,{clickable:true});var $row;var rule;var json=this.json;var connections=getConnArray(this.iftree);var iflist={};var iface;for(var i=0;i<connections.length;i++){iface=connections[i].iface;if(iface)iflist[iface]=connections[i];}
function getConnName(iface){var connection=iflist[iface];return connection?connection.name:iface;}
for(var i in json){rule=json[i];$row=$grid.addRow().row("last");$row.col("name").html(rule.name);if(rule.source_iface=="all"){$row.col("iface")
.html(lng("all_"))
.attr("langkey","all_")
.data("iface","all");}
else{$row.col("iface")
.html(getConnName(rule.source_iface))
.data("iface",rule.source_iface);}
if(rule.type=="ipsec"){$row.col("protocol").html("UDP,UDP").data("proto","udp");$row.col("port_fw").html("500,4500");$row.col("port_dst").html("500,4500");}else if(rule.type=="sftp"){$row.col("protocol").html("TCP,TCP");$row.col("port_fw").html("22,115");$row.col("port_dst").html("22,115");}else if(rule.type=="pcanywhere"){$row.col("protocol").html("TCP,UDP");$row.col("port_fw").html("5631,5632");$row.col("port_dst").html("5631,5632");}else{$row.col("protocol").html(vservProtoNames[rule.proto])
.data("proto",rule.proto);var sign=rule.ports_end?":":"";$row.col("port_fw").html(rule.ports_begin+sign+rule.ports_end);sign=rule.portd_end?":":"";$row.col("port_dst").html(rule.portd_begin+sign+rule.portd_end);}
$row.col("ip_dst").html(rule.ipd);$row.col("remote_ip").html(rule.remote_ip);}
this.cleanButtonBar()
.addButton("add")
.getButton("add")
.unbind("click.button")
.bind("click.button",context(this).callback(function(){this.edit(this.iftree,this.lanClients);}));this.addButton("clearall")
.getButton("clearall")
.bind("click.button",context(this).callback(function(){this.clear();}));if(!json||!json.length)this.getButton("clearall").hide();$grid.unbind("rowclick.grid")
.bind("rowclick.grid",context(this).callback(function(event,$row){var rule={name:$row.col("name").html(),source_iface:$row.col("iface").data("iface"),proto:$row.col("protocol").data("proto"),ports_begin:$row.col("port_fw").html().split(":")[0],ports_end:$row.col("port_fw").html().split(":")[1],portd_begin:$row.col("port_dst").html().split(":")[0],portd_end:$row.col("port_dst").html().split(":")[1],ipd:$row.col("ip_dst").html(),remote_ip:$row.col("remote_ip").html(),type:this.json[$row.irow()].type?this.json[$row.irow()].type:""}
this.edit(this.iftree,this.lanClients,rule,$row.irow());}));}}
this.clear=function(){if(confirm(lng("vserversClear"))){rootView.showModalOverlay();device.config.remove(somovdParams.CONFIG_ID_DSL_VSERVERS,{clear:true},context(this).callback(function(data){this.onupdaterq();}));}}
this.edit=function(iftree,lanClients,rule,pos){if(is.unset(pos))pos=-1;this.$box.unbind();var ruleNode=new ruleVirtServ(iftree,lanClients,rule);ruleNode.buttonBar(this.buttonBar())
.deep.updateView(this.$outerBox)
.cleanButtonBar()
.addButton("button_prev")
.getButton("button_prev")
.bind("click.button",context(this).callback(function(){if(!checkChanges()||confirm(lng("leavePageMes"))){this.emit("updaterq");}}));if(is.object(rule)){ruleNode.addButton("button_del")
.getButton("button_del")
.bind("click.button",context(this).callback(function(){device.config.remove(somovdParams.CONFIG_ID_DSL_VSERVERS,ruleNode.rule,pos,context(this).callback(function(){this.emit("updaterq");}));}));}
ruleNode.addButton("button_save")
.getButton("button_save")
.bind("click.button",context(this).callback(function(){ruleNode.deep.updateModel()
if(ruleNode.status.error){}
else{rootView.showModalOverlay();device.config.write(somovdParams.CONFIG_ID_DSL_VSERVERS,ruleNode.rule,pos,context(this).callback(function(){rootView.hideModalOverlay();this.emit("updaterq");}));}}));}
this.onupdaterq=function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_DSL_VSERVERS,somovdParams.CONFIG_ID_WAN_TEMP,somovdParams.CONFIG_ID_NEIGHBOUR],context(this).callback(function(data){rootView.hideModalOverlay();if(is.RPC_SUCCESS(data.rq[0])){this.json=data.rq[0].resident.vserver;}
else{this.json=[];}
if(is.RPC_SUCCESS(data.rq[1])){this.iftree=data.rq[1].resident.iface_names;}
else{this.iftree={};}
if(is.RPC_SUCCESS(data.rq[2])){this.lanClients=data.rq[2].resident;}
else{this.lanClients=[];}
this.deep.updateView();}));}
this.bind("updaterq",this.onupdaterq);}
extend(pageVirtServ,node);function wizardVirtServ(){wizardVirtServ.superclass.constructor.call(this);this.updateView=function(phase){pageVirtServ.superclass.updateView.apply(this,arguments);if(phase=="forward"){var ruleNode=new ruleVirtServ(this.iftree,this.lanClients,null,null);ruleNode.buttonBar(this.buttonBar())
.deep.updateView(this.$outerBox)
.cleanButtonBar()
.addButton("apply")
.getButton("apply")
.bind("click.button",context(this).callback(function(){ruleNode.deep.updateModel()
if(ruleNode.status.error){}
else{rootView.showModalOverlay();device.config.write(somovdParams.CONFIG_ID_DSL_VSERVERS,ruleNode.rule,-1,context(this).callback(function(){rootView.hideModalOverlay();alert(lng("wzVSSaveOk")+' '+lng("wzwifiDone"));window.hasChanges=null;}));}}));}}}
extend(wizardVirtServ,pageVirtServ);function ruleVirtServ(iftree,lanClients,rule,pos,shortForm){ruleVirtServ.superclass.constructor.call(this);if(is.unset(rule)){rule={};this.adding=true;}
this.iftree=iftree;this.lanClients=lanClients;this.rule=rule;this.pos=pos;this.shortForm=shortForm;this.updateView=function(phase){ruleVirtServ.superclass.updateView.apply(this,arguments);if(phase=="back"){var rule=this.rule;var lanClients=this.lanClients;var iftree=this.iftree;this.child("template").cleanOptions();for(var i=0;i<templateList.length;i++){this.child("template").addOption(templateList[i].name,i);}
if(this.adding){this.applyTemplate(templateList[this.child("template").val()],this.child("protocol").val());}
else{this.child("template").disable();}
var ifarrey=getConnArray(iftree);var iface=this.child("iface");iface.cleanOptions()
.addOption("all_","all");var obj;for(var i=0;i<ifarrey.length;i++){obj=ifarrey[i];if(obj.L2.is_wan){iface.addOption(obj.name,obj.iface);}}
this.child("protocol").cleanOptions();for(var i in vservProtoNames){this.child("protocol").addOption(vservProtoNames[i],i);}
var ipd=this.child("ipd");var obj;for(var i=0;i<lanClients.length;i++){obj=lanClients[i];ipd.addRow(obj.ip,obj.mac,obj.hostname);}
if(shortForm){this.get("protocol").hide();}}}
this.updateModel=function(status){if(!status.error){var type=templateList[this.child("template").val()].type?templateList[this.child("template").val()].type:"";portfwb=this.child("portfwb").val();portfwe=this.child("portfwe").val();portdstb=this.child("portdstb").val();portdste=this.child("portdste").val();if(portfwb==portfwe)portfwe="";if(portdstb==portdste)portdste="";this.rule={name:this.child("name").val(),source_iface:this.child("iface").val(),proto:this.child("protocol").val(),ports_begin:portfwb.toString(),ports_end:portfwe.toString(),portd_begin:portdstb.toString(),portd_end:portdste.toString(),ipd:this.child("ipd").val(),remote_ip:this.child("ipr").val(),type:type}}
this.status=status;}
this.onfieldchange=function(status,value){switch(status.target.getAlias()){case"template":this.applyTemplate(templateList[value]);this.applyProtocol((templateList[value].protocol).split(',')[0]);break;case"protocol":this.applyProtocol(value);break;}}
this.applyTemplate=function(template){if(template.name!="Custom"){this.child("protocol").val(template.protocol);this.child("protocol").cleanOptions();for(var i in vservProtoNames){if((template.protocol.split(',')).indexOf(i)!=-1){this.child("protocol").addOption(vservProtoNames[i],i);}}}else{this.child("protocol").cleanOptions();for(var i in vservProtoNames){this.child("protocol").addOption(vservProtoNames[i],i);}}}
this.portsVisible=function(visible){if(visible){this.get("protocol").hide();this.get("portfwb").hide();this.get("portfwe").hide();this.get("portdstb").hide();this.get("portdste").hide();}else{if(!this.shortForm){this.child("protocol").show();}
this.get("portfwb").show();this.get("portfwe").show();this.get("portdstb").show();this.get("portdste").show();}}
this.applyProtocol=function(protocol){var template=templateList[this.child("template").val()];$(this.child("portfwb").$box).find('input').val('');$(this.child("portfwe").$box).find('input').val('');$(this.child("portdstb").$box).find('input').val('');$(this.child("portdste").$box).find('input').val('');if(template.name!="Custom"){if(typeof template.ports[protocol]!="undefined"){this.child("portfwb").val(template.ports[protocol].port_fw.split(":")[0]);this.child("portfwe").val(template.ports[protocol].port_fw.split(":")[1]);this.child("portdstb").val(template.ports[protocol].port_dst.split(":")[0]);this.child("portdste").val(template.ports[protocol].port_dst.split(":")[1]);}}
this.portsVisible(template.hide_ports);}
if(shortForm){value=1;}
else{var obj;var value=0;for(var i in templateList){obj=templateList[i]
if(obj.protocol==rule.proto&&obj.ports.port_fw==rule.ports_begin&&obj.ports.port_dst==rule.portd_begin||obj.type==rule.type){value=i;break;}}}
this.add(new nodeSelect("vserversTemplate",value),"template")
.add(new nodetext("vserversName",rule.name,{mandatory:true}),"name")
.add(new nodeSelect("vserversIface",rule.source_iface),"iface")
.add(new nodeSelect("vserversProtocol",rule.proto),"protocol")
.add(new nodenum("vserversPortFwB",rule.ports_begin,{minval:1,maxval:65535,mandatory:true}),"portfwb")
.add(new nodenum("vserversPortFwE",rule.ports_end,{minval:1,maxval:65535}),"portfwe")
.add(new nodenum("vserversPortDstB",rule.portd_begin,{minval:1,maxval:65535,mandatory:true}),"portdstb")
.add(new nodenum("vserversPortDstE",rule.portd_end,{minval:1,maxval:65535}),"portdste")
.add(new nodeComboIP("vserversIPDst",rule.ipd,{header:[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}],mandatory:true}),"ipd")
.add(new nodeip("vserversRemoteIp",rule.remote_ip),"ipr");if(!this.adding)this.get("template").disable();for(var i in templateList){if(templateList[i].type==rule.type){this.portsVisible(templateList[i].hide_ports);break;}}
this.bind("fieldchange",this.onfieldchange);}
extend(ruleVirtServ,node);var vservProtoNames={tcp:"TCP",udp:"UDP","tcp/udp":"TCP/UDP"};window.templateList=[{name:"Custom",protocol:"",type:"custom",ports:{}},{name:"Virtual Server HTTP",protocol:"tcp",type:"http",ports:{"tcp":{port_fw:"80",port_dst:"80"}}},{name:"Virtual Server HTTPS",protocol:"tcp",type:"https",ports:{"tcp":{port_fw:"443",port_dst:"443"}}},{name:"Virtual Server DNS",protocol:"udp",type:"dns",ports:{"udp":{port_fw:"53",port_dst:"53"}}},{name:"Virtual Server SMTP",protocol:"tcp",type:"smtp",ports:{"tcp":{port_fw:"25",port_dst:"25"}}},{name:"Virtual Server POP3",protocol:"tcp",type:"pop3",ports:{"tcp":{port_fw:"110",port_dst:"110"}}},{name:"Virtual Server SSH",protocol:"tcp",type:"ssh",ports:{"tcp":{port_fw:"22",port_dst:"22"}}},{name:"Virtual Server IPSec",protocol:"udp",type:"ipsec",hide_ports:true,ports:{}},{name:"Virtual Server FTP",protocol:"tcp",type:"ftp",ports:{"tcp":{port_fw:"20:21",port_dst:"20:21"}}},{name:"Virtual Server SFTP",protocol:"tcp",type:"sftp",hide_ports:true,ports:{}},{name:"Virtual Server Telnet",protocol:"tcp,udp,tcp/udp",type:"telnet",ports:{"tcp":{port_fw:"23",port_dst:"23"},"udp":{port_fw:"23",port_dst:"23"},"tcp/udp":{port_fw:"23",port_dst:"23"}}},{name:"Virtual Server PPTP",protocol:"tcp,udp,tcp/udp",type:"pptp",ports:{"tcp":{port_fw:"1723",port_dst:"1723"},"udp":{port_fw:"1723",port_dst:"1723"},"tcp/udp":{port_fw:"1723",port_dst:"1723"}}},{name:"Virtual Server PCAnyWhere",protocol:"tcp/udp",type:"pcanywhere",hide_ports:true,ports:{}},{name:"Virtual Server VNC",protocol:"tcp,udp,tcp/udp",type:"vnc",ports:{"tcp":{port_fw:"5900",port_dst:"5900"},"udp":{port_fw:"5900",port_dst:"5900"},"tcp/udp":{port_fw:"5900",port_dst:"5900"}}},{name:"Virtual Server TFTP",protocol:"udp",type:"tftp",ports:{"udp":{port_fw:"69",port_dst:"69"}}},{name:"Virtual Server RDP",protocol:"tcp,udp,tcp/udp",type:"rdp",ports:{"tcp":{port_fw:"3389",port_dst:"3389"},"udp":{port_fw:"3389",port_dst:"3389"},"tcp/udp":{port_fw:"3389",port_dst:"3389"}}}]
function formVlanBridge(__vlan){formVlanBridge.superclass.constructor.call(this);this.startForm()
.add(new nodenum('vlanVid',__vlan.vid,{minval:0,maxval:4094,mandatory:true}),"vid")
.add(new nodeCheckBox('vlanMulticast',__vlan.multicast,{hidden:true}),"multicast")
.add(new nodeSelect('vlanQos',__vlan.qos),"qos")
.add(new nodeSelect('vlanPortsT',__vlan.port),"port");for(var i=0;i<8;i++)this.get("qos").addOption(i);var availPorts=devu.vlan.getFreePortsT('bridge');var freePorts=devu.vlan.getFreePortsU('bridge');if(freePorts.length){this.add(new nodeOptions('vlanPortsU'),"ports");var ports=__vlan.ports;var p;for(var i=0;i<freePorts.length;i++){p=freePorts[i];this.get("ports").addOption(p,p,_.indexOf(ports,p)>=0);}}
else{this.add(new nodestatic('vlanPortsU','vlanNoFreePortsU',{translate:true}),"ports");}
for(var i=0;i<availPorts.length;i++)this.get("port").addOption(availPorts[i]);this.endForm();this.updateModel=function(__status){if(__status.error)return false;var ports=[];if(freePorts.length){this.get("ports").each(callback(this,function(__inx,__child){if(__child.val())ports.push(__child.getAlias());}));}
var port=this.get("port").val();if(_.indexOf(ports,port)>=0){__status.error='vlanErrPortsT';alert(lng(__status.error));return;}
if(!ports.length){__status.error='vlanErrNoPorts';alert(lng(__status.error));return;}
__vlan.ports=ports
__vlan.port=port;__vlan.vid=this.get("vid").val();__vlan.qos=parseInt(this.get("qos").val());}}
extend(formVlanBridge,node);function formVlan(__vlan,__pos){formVlan.superclass.constructor.call(this);this.startForm()
.add(new nodetext('vlanName',__vlan.name,{mandatory:true}),"name")
.add(new nodeCheckBox('vlanEnable',__vlan.en),"enable")
.add(new nodeSelect('vlanType',__vlan.type),"type")
.add(new node(),"body");this.get("type")
.addOption('vlan_wanu',"wanu")
.addOption('vlan_want',"want")
.addOption('vlan_bridge',"bridge");if(is.set(__pos))this.get("type").disable().addOption('vlan_lan',"lan");this.listen("type",'endform fieldchange',function(__status,__value){switch(__value){case'lan':case'wanu':this.replace("body",new formVlanWanU(__vlan));break
case'want':this.replace("body",new formVlanWanT(__vlan));break
case'bridge':this.replace("body",new formVlanBridge(__vlan));break}});this.endForm();this.updateModel=function(__status){if(__status.error)return false;__vlan.name=this.get("name").val();__vlan.en=this.get("enable").val();__vlan.type=this.get("type").val();}}
extend(formVlan,node);function formVlanWanT(__vlan){formVlanWanT.superclass.constructor.call(this);this.startForm()
.add(new nodenum('vlanVid',__vlan.vid,{minval:0,maxval:4094,mandatory:true}),"vid")
.add(new nodeSelect('vlanQos',__vlan.qos),"qos")
.add(new nodeSelect('vlanPortsT',__vlan.port),"port");for(var i=0;i<8;i++)this.get("qos").addOption(i);var availPorts=devu.vlan.getAvailPorts();for(var i=0;i<availPorts.length;i++)this.get("port").addOption(availPorts[i]);this.endForm();this.updateModel=function(__status){if(__status.error)return false;__vlan.port=this.get("port").val();__vlan.vid=this.get("vid").val();__vlan.qos=parseInt(this.get("qos").val());}}
extend(formVlanWanT,node);function formVlanWanU(__vlan){formVlanWanU.superclass.constructor.call(this);this.startForm()
.add(new nodeCheckBox('vlanMulticast',__vlan.multicast,{hidden:true}),"multicast");var freePorts=devu.vlan.getFreePortsU();if(freePorts.length){this.add(new nodeOptions('vlanPortsU'),"ports");var ports=__vlan.ports;var p;for(var i=0;i<freePorts.length;i++){p=freePorts[i];this.get("ports").addOption(p,p,_.indexOf(ports,p)>=0);}}
else{this.add(new nodestatic('vlanPortsU','vlanNoFreePortsU',{translate:true}),"ports");}
this.endForm();this.updateModel=function(__status){if(__status.error)return false;var ports=[];if(freePorts.length){this.get("ports").each(callback(this,function(__inx,__child){if(__child.val())ports.push(__child.getAlias());}));}
if(!ports.length){__status.error='vlanErrNoPorts';alert(lng(__status.error));}
__vlan.ports=ports;}}
extend(formVlanWanU,node);function pageVlan(){pageVlan.superclass.constructor.call(this);this.bind('updaterq',function(){rootView.showModalOverlay();devu.vlan.pull(callback(this,function(){rootView.hideWaitScreen();rootView.hideModalOverlay();this.deep.updateView();}),callback(this,function(){rootView.hideModalOverlay();node.prototype.updateView.call(this,'forward');this.$box.errorBlock(lng('error'),lng('rpcReadError'),null,lng('refresh'),callback(this,function(){this.emit('updaterq')}));}));});this.updateView=function(__phase){pageVlan.superclass.updateView.apply(this,arguments);if(__phase=='forward'){var wc=devu.vlan.show();var header=[{index:'name',name:"vlanName"},{index:'type',name:"vlanType"},{index:'portsU',name:"vlanPortsU"},{index:'portT',name:"vlanPortT"},{index:'vid',name:"vlanVid"},{index:'enable',name:"vlanEnable"}];var $grid0=this.$box.lightUIGrid(header,wc.length,{clickable:true});for(var i=0;i<wc.length;i++){var $row=$grid0.row(i);var v=wc[i];var en=v.en?'yes':'no';var type='vlan_'+v.type;$row.col('name').html(v.name);$row.col('type').html(lng(type)).attr('langkey',v.type);$row.col('portsU').html(v.ports?v.ports.toString():'');$row.col('portT').html(v.port?v.port:'');$row.col('vid').html(v.vid||'');$row.col('enable').html(lng(en)).attr('langkey',en);$row.data('pos',v.pos);}
$grid0.bind('rowclick.grid',callback(this,function(__event,__$row){var pos=__$row.data('pos');var v=devu.vlan.cut(pos);var form=new formVlan(v,pos);addButtonsToForm.call(this,form,v,pos);form.deep.updateView(this.$box);}));this.cleanButtonBar()
.addButton('add')
.getButton('add')
.bind('click.button',callback(this,function(){var v={type:'want',en:true};var form=new formVlan(v);addButtonsToForm.call(this,form,v);form.deep.updateView(this.$box);}));function addButtonsToForm(__form,__v,__pos){function onApply(){this.emit('updaterq');}
function applyVlan(){rootView.showModalOverlay();devu.vlan.push(callback(this,onApply),callback(this,function(){alert(lng('rpcWriteError'));this.emit('updaterq');}));}
this.cleanButtonBar()
.addButton('button_prev')
.getButton('button_prev')
.bind('click.button',callback(this,function(){if(!checkChanges()||confirm(lng('leavePageMes')))this.emit('updaterq');}));if(is.set(__pos)){this.addButton('button_del');var services=devu.vlan.hasServices(__v);if(services&&_.size(services)){function getNames(services){return _.map(services,function(__value){if(__value.tunnels&&_.size(__value.tunnels)){return _.values(__value.tunnels)[0].name;}
else return __value.name;});}
this.getButton('button_del')
.bind('click.button',callback(this,function(){alert(lng('vlanKillAllConns3')+' '+getNames(services).toString()+'.');}));}else{this.getButton('button_del')
.bind('click.button',callback(this,function(){if(confirm(lng('vlanDelConfirm'))){applyVlan.call(this);}}));}}
if(__v.type=='lan'){this.getButton('button_del').disable();}
this.addButton('save')
.getButton('save')
.bind('click.button',callback(this,function(){if(__form.deep.updateModel()){if(is.set(__pos)){var err=devu.vlan.set(__pos,__v);}
else{var err=devu.vlan.add(__v);}
if(err){switch(err){case'vlanLimitWanU':alert(lng(err)+' '+devu.vlan.VLAN_WANU_LIMIT+'.');break;case'vlanLimitWanT':alert(lng(err)+' '+devu.vlan.VLAN_WANT_LIMIT+'.');break;case'vlanLimitWan':alert(lng(err)+' '+devu.vlan.VLAN_WAN_LIMIT+'.');break;default:alert(lng(err));}}
else{debug(devu.vlan.commit());applyVlan.call(this);}}}));}}}}
extend(pageVlan,node);device.hook(device.signal.PROCESS,function(state,jqXHR){if(!state){if(jqXHR.answer&&jqXHR.answer.rpcWAN){window.rpcWanAnswer=jqXHR.answer.rpcWAN.iface_names;}}});device.filter(function(url,type,data,cb){var lockByIface={};var locker;if(data)
if(typeof(data)=='string'){var str=data;var arrForJson=str.split("&");var jsonFromStr={};for(var i=0;i<arrForJson.length;i++){var pair=arrForJson[i].split("=");jsonFromStr[pair[0]]=pair[1];}
var iface='';var res_buf='';if(jsonFromStr["res_config_id"]&&jsonFromStr["res_config_id"]==somovdParams.CONFIG_ID_WAN_TEMP&&jsonFromStr["res_config_action"]==somovdParams.CONFIG_ACTION_DELETE){res_buf=jsonFromStr["res_buf"];var re=/.*(?=\"\])/;iface=re.exec(res_buf.substring(2))[0];locker=getLockers(window.rpcWanAnswer,iface);if(locker)lockByIface[iface]=locker;}else{var lock;for(var i in jsonFromStr){if(i.indexOf("res_config_id")!=-1&&jsonFromStr[i]==1){var id=i.substring(13,i.length);if(jsonFromStr["res_config_action"+id]==somovdParams.CONFIG_ACTION_DELETE){res_buf=jsonFromStr["res_buf"+id];var re=/.*(?=\"\])/;iface=re.exec(res_buf.substring(2))[0];locker=getLockers(window.rpcWanAnswer,iface);if(locker)lockByIface[iface]=locker;break;}}}}}else if(typeof(data)=='object'){jsonFromJqXHR=data;if(jsonFromJqXHR["res_config_id"]&&jsonFromJqXHR["res_config_id"]==somovdParams.CONFIG_ID_WAN_TEMP&&jsonFromJqXHR["res_config_action"]==somovdParams.CONFIG_ACTION_DELETE){res_buf=jsonFromJqXHR["res_buf"];if(is.string(res_buf)){var re=/.*(?=\"\])/;iface=re.exec(res_buf.substring(2))[0];locker=getLockers(window.rpcWanAnswer,iface);if(locker)lockByIface[iface]=locker;}}else{for(var i in jsonFromJqXHR){if(i.indexOf("res_config_id")!=-1&&jsonFromJqXHR[i]==1){var id=i.substring(13,i.length);if(jsonFromJqXHR["res_config_action"+id]==somovdParams.CONFIG_ACTION_DELETE){res_buf=jsonFromJqXHR["res_buf"+id];if(is.string(res_buf)){var re=/.*(?=\"\])/;iface=re.exec(res_buf.substring(2))[0];locker=getLockers(window.rpcWanAnswer,iface);if(locker)lockByIface[iface]=locker;}}}}}}
var lockers={};var lock;for(var ii in lockByIface){lock=lockByIface[ii];for(var j=0;j<lock.length;j++){lockers[lock[j]]=true;}}
var lockersLength=getObjectLength(lockers);if(lockersLength){var menus="";var locker,menu;for(var i in lockers){switch(i){case"voip":lockers[i]="voice/voip_basic";menus+=" "+lng("menu_voice")+",";break;case"tr":lockers[i]="advanced/tr69";menus+=" "+lng("menu_tr69")+",";break;}}
menus=menus.substr(0,menus.length-1);if(lockersLength>1){alert(lng("rejectDelCon0")
+"\n"
+menus
+"."
+"\n"
+" "+lng("rejectDelCon2")+".");}
else{if(confirm(lng("rejectDelCon0")
+"\n"
+menus
+"."
+"\n"
+" "+lng("rejectDelCon2")+"."
+" "+lng("rejectDelCon3"))){window.location.hash=getObjectFirstChild(lockers);}}
rootView.hideModalOverlay();return false;}
return true;});function getLockers(iftree,ifname){for(var i in iftree){var services=iftree[i].services;if(services){if(!iftree[i].is_wan)continue;for(var j in services){var service=services[j];var tunnels=service.tunnels
if(tunnels&&getObjectLength(tunnels)){for(var t in tunnels){if(t==ifname){var lock=service.lock;if(lock)return lock;}}}
if(j==ifname){var lock=service.lock;if(lock)return lock;}}}}}
function jsWANIGMPModel(service){jsWANIGMPModel.superclass.constructor.call(this);this.service=service;}
extend(jsWANIGMPModel,jsModel);function jsWANIGMPController(service){jsWANIGMPController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsWANIGMPClientView};this.ifaceTypes.summary={type:jsWANIGMPSummaryView};this.changeModel(new jsWANIGMPModel(service));var snoopmode=service.snoop?service.snoop_mode:"off";var obj=[];var hide;var wp=webadminParams;if(service.is_wan){this.addChild(new jsInputController(service.igmp),"igmp");}
else{}}
extend(jsWANIGMPController,jsFieldSetController);function jsWANIGMPClientView(ctrl,viewInx,options){var service=ctrl.model.service;var wp=webadminParams;if(service.is_wan){hide=wp.BLOCKS&&!wp["BLOCK_WAN_MISC_L"+service.level+"_IGMP"];obj=ctrl.getChild("igmp");obj.nextIface="checkbox";obj.ifaceTypes.checkbox.options={humanName:"wanIgmp",valset:{on:true,off:false},hide:hide};}
else{}
jsWANIGMPClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.updateModel=function(){var res=jsWANIGMPClientView.superclass.updateModel.call(this);if(res){var service=this.ctrl.model.service;if(service.is_wan){service.igmp=this.getChild("igmp").ctrl.model.value;}
else{}}
return res;}}
extend(jsWANIGMPClientView,jsFieldSetClientView);function jsWANIGMPSummaryView(ctrl,viewInx,options){var obj=ctrl.getChild("igmp");obj.nextIface="checkbox";var opt=obj.ifaceTypes.checkbox.options={humanName:"wanIgmp"}
var service=ctrl.model.service;opt.hide=(service.contype=="3g"||service.type=="lte"||service.type=="pppv6"||service.type=="ipv6"||service.level==4);jsWANIGMPSummaryView.superclass.constructor.call(this,ctrl,viewInx,options);}
extend(jsWANIGMPSummaryView,jsWANIGMPClientView);function jsWansController(){jsWansController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsWansClientView};this.ifaceTypes.client.options={inputPadding:"200px"};this.addChild(new jsWanSetController(),"wanset");this.onupdaterq=function(){window.hasChanges=null;this.getChild("wanset").event("updaterq");}
this.addEventHandler("updaterq",this.onupdaterq);}
extend(jsWansController,jsFieldSetController);function jsWansClientView(ctrl,viewInx,options){jsWansClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.options.title={name:"menu_ethernet",type:"text"}
this.options.nothing=true;this.onrecselect=function(recordInx){this.isadding=(recordInx<0);this.getChild("wanset").options.editBoxSel=this.viewBoxSel;this.getChild("wanset").drawView();return false;}
this.onupdmodel=function(model){this.options.buttons=[{name:"add",value:"add",handler:this.add}];this.drawView()
if(disableFlag(somovdParams.CONFIG_ID_WAN_TEMP)){var buttons=this.options.buttons;for(var i=0;i<buttons.length;i++){if(buttons[i].name=="add"){this.disableButton(buttons[i].name);break;}}}
this.hideModalOverlay();return false;}
this.add=function(){this.disableButton("add");this.ctrl.getChild("wanset").event("recselect",-1);}
this.disgw=function(){this.ctrl.getChild("wanset").event("disgw");}
this.bind("recselect",this.onrecselect);this.bind("updmodel",this.onupdmodel);}
extend(jsWansClientView,jsFieldSetClientView);function jsWanSetController(){jsWanSetController.superclass.constructor.call(this);this.ifaceTypes.client={type:jsWanSetClientView};this.ifaceTypes.client.options={header:[{key:"name",name:"wanName"},{key:"srvType",name:"wanType"},{key:"l2Param",name:"wanPort"},{key:"statusText",name:"wanStatus"},{key:"direction",name:"wanDirection"},{key:"gwif",name:"wanGwIf"}]};this.ifaceTypes.client.options.header.push({key:"gwifv6",name:"wanGwIfv6"});this.ifaceTypes.server={type:jsWanSetServerView};this.ifaceTypes.server.options={action:"index.cgi",plainIface:true};this.ifaceTypes.serverGwif={type:jsWanSetGwifServerView};this.ifaceTypes.serverGwif.options={action:"index.cgi",plainIface:true};this.changeModel(new jsRecordSetModel());this.nextIface="server";this.addIface();this.nextIface="serverGwif";this.addIface();this.addServices=function(ifnode,srvsname){var jj;var service;var services=ifnode[srvsname];var obj;var contype;var patt;var typeisv6;if(services){for(var j in services){service=services[j];service.ifname=j=="create"?"":j;if(service.ifname=="br0"){setCookie("lan_ip",service.ip);}
if(!ifnode.is_wan)continue;var tunnels=service.tunnels;if(tunnels&&getObjectLength(tunnels)){for(var t in tunnels){tunnel=tunnels[t];tunnel.ifname=t=="create"?"":t;jj=this.model.recordSet.length;this.model.recordSet.push({});obj=this.model.recordSet[jj];obj.name=tunnel.name?tunnel.name:tunnel.ifname;obj.typeL2=service.type;obj.ifaceL2=service.ifname;contype=getConnType(ifnode,service,tunnel);obj.srvType=connTypeValSet[contype];obj.enableText=tunnel.enable?lng("yes"):lng("no");if(contype!="pptp"&&contype!="l2tp"&&contype!="624"){obj.gwif={value:(tunnel.gwif||service.gwif),type:"radio",extrattrs:{}};if(tunnel.useipv6){obj.gwifv6={value:tunnel.gwifv6,type:"radio",extrattrs:{}};}}
obj.l2Param=this.getL2Param(ifnode);obj.ifaceL3=tunnel.ifname;obj.ifnode=ifnode;obj.srvnode=service;obj.tnlnode=tunnel;if(tunnel.gwif&&service.gwif){if(tunnel.metric<service.metric){obj.statusText=this.getStatus(tunnel);}else{obj.statusText=this.getStatus(service);}}else{if(tunnel.gwif){obj.statusText=this.getStatus(tunnel);}else{obj.statusText=this.getStatus(service);}}
obj.direction=ifnode.is_wan?"WAN":"LAN";}}
else if(service.type!="auto"){jj=this.model.recordSet.length;this.model.recordSet.push({});obj=this.model.recordSet[jj];obj.srvsname=srvsname;obj.name=service.name?service.name:service.ifname;obj.typeL2=ifnode.type;obj.srvType=connTypeValSet[getConnType(ifnode,service)];obj.enableText=service.enable?lng("yes"):lng("no");patt=/.*v6$/;typeisv6=patt.test(service.type);if(!typeisv6){obj.gwif={value:service.gwif,type:"radio",extrattrs:{}};if(service.type=="bridge"){obj.gwif.extrattrs.disabled=true;}}
if(typeisv6||service.type=="pppdual"){obj.gwifv6={value:service.gwifv6,type:"radio",extrattrs:{}};}
if(this.model.recordSet[jj].srvType=="bridge"||!ifnode.is_wan){obj.gwif.extrattrs.disabled="";obj.gwifv6.extrattrs.disabled="";}
obj.ifaceL2=ifnode.ifname;obj.l2Param=this.getL2Param(ifnode);obj.ifaceL3=service.ifname;obj.ifnode=ifnode;obj.srvnode=service;obj.statusText=this.getStatus(service);obj.direction=ifnode.is_wan?"WAN":"LAN";}}}}
this.addRecord=function(obj){this.addServices(obj,"services");}
this.getL2Param=function(ifnode){var l2Param="";if(ifnode.type=="atm"){l2Param=ifnode.ifname+"("+ifnode.pvc_settings.vpi+"/"+ifnode.pvc_settings.vci+")";}
else if(ifnode.type=="ethernet"||ifnode.type=="ptm"||ifnode.type=="3g"||ifnode.type=="lte"){l2Param=ifnode.port?ifnode.port:"";}
else if(ifnode.type=="bridge"){if(ifnode.port){l2Param=ifnode.port;}
else if(ifnode.members){l2Param="";var memberNode;var desc;for(var i=0;i<ifnode.members.length-1;i++){memberNode=this.getIfaceByName(ifnode.members[i]);desc=(memberNode&&memberNode.port)?memberNode.port:ifnode.members[i];l2Param+=desc+",";}
memberNode=this.getIfaceByName(ifnode.members[ifnode.members.length-1]);desc=(memberNode&&memberNode.port)?memberNode.port:ifnode.members[ifnode.members.length-1];l2Param+=desc;}
else{l2Param=ifnode.ifname;}}
else if(ifnode.type=="auto"){l2Param=lng("wanAuto");}
return l2Param;}
this.getStatus=function(obj){var statusText="";if(obj.enable){if(obj&&obj.connection_status){if(obj.connection_status=="Connected"){statusText=lng("statWanUp")+"<img src='image/ledgreen.gif'/>";}
else if(obj.connection_status=="Disconnected"){statusText=lng("statWanDown")+"<img src='image/ledred.gif'/>";}
else{statusText=lng(obj.connection_status)+"<img src='image/ledyellow.gif'/>";}}
else{statusText=lng("statWanDown")+"<img src='image/ledred.gif'/>";}}
else{statusText=lng("disable")+"<img src='image/ledgrey.gif'/>";}
return statusText;}
this.prepareRecordSet=function(){var service;var services;var jj=0;var obj=this.model.ifTree;var memberNode;this.model.recordSet=new Array();if(obj.baddata)return;for(var i in obj){obj[i].ifname=i=="create"?"":i;if(obj[i].type=="bridge"){for(var j in obj[i].members){memberNode=this.getIfaceByName(obj[i].members[j]);if(memberNode)memberNode.inbridge=true;}}
this.addRecord(obj[i]);}}
this.onrecselect=function(recordInx){var isadding=false;var ifnode;var ifname=null;var srvname=null;var tnlname=null;var srvsname=null;if(recordInx<0){recordInx=this.activeRecordInx=9999;}
else{var record=this.model.recordSet[recordInx];ifname=record.ifnode.ifname;srvname=record.srvnode.ifname;srvsname=record.srvsname;record.ifnode.ismyiface=true;record.srvnode.ismyiface=true;if(record.tnlnode){tnlname=record.tnlnode.ifname;record.tnlnode.ismyiface=true;}
this.recordInx=recordInx;}
this.children=[];this.children_refs={};this.childActiveInx=-1;var mainTab=this.addChild(new jsConnsMainTabController(this.model.ifTree,ifname,srvname,tnlname),"mainTab");mainTab.model.lanClients=this.model.lanClients;mainTab.model.jsonIGMP=this.model.jsonIGMP;return jsWanSetController.superclass.onrecselect.call(this,recordInx);}
this.getIfaceByName=function(ifname){return this.model.ifTree[ifname];}
this.addEventHandler("recselect",this.onrecselect);this.updateTable=function(){device.config.read([1],callback(this,function(data){obj=data.rq[0].resident.iface_names;for(var i in obj){if(obj[i].services){for(var j in obj[i].services){var name=obj[i].services[j].name;var self=this;$('.gridTable tbody tr').each(function(){if($(this).find('td:eq(0)').text()==name){$(this).find('td:eq(3)').html(self.getStatus(obj[i].services[j]));}});}}}}));}
setInterval(context(this).callback(this.updateTable),5000);}
extend(jsWanSetController,jsRecordSetController);function jsWanSetClientView(ctrl,viewInx,options){var opt;jsWanSetClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsWanSetClientView.prototype.onupdmodel=function(model){this.drawView();return false;}
this.checkQos=function(qos){var divQos=this.getChild("divQos");switch(qos){case"ubr":divQos.getChild("pcr").hide();divQos.getChild("scr").hide();divQos.getChild("mbs").hide();break;case"ubr_pcr":divQos.getChild("pcr").show();divQos.getChild("scr").hide();divQos.getChild("mbs").hide();break;case"cbr":divQos.getChild("pcr").show();divQos.getChild("scr").hide();divQos.getChild("mbs").hide();break;case"nrtvbr":divQos.getChild("pcr").show();divQos.getChild("scr").show();divQos.getChild("mbs").show();break;case"rtvbr":divQos.getChild("pcr").show();divQos.getChild("scr").show();divQos.getChild("mbs").show();break;}}
this.onupdmodel=function(model){return true;}
this.onrecselect=function(recordInx){var isadding=false;if(recordInx<0){isadding=true;}
this.ctrl.getChild("mainTab").ifaceTypes.client.options={nothing:true};return jsWanSetClientView.superclass.onrecselect.call(this,recordInx);}
this.bind("updmodel",this.onupdmodel);this.bind("recselect",this.onrecselect);}
extend(jsWanSetClientView,jsRecordSetClientView);function jsWanSetServerView(ctrl,viewInx,options){jsWanSetServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){var data=this.options.sender.responseData;this.ctrl.model.ifTree={};if(data){if(!data.baddata&&data.rq){var i=0;if(data.rq[i]&&data.rq[i].resident&&data.rq[i].resident.iface_names){this.ctrl.model.ifTree=data.rq[i].resident.iface_names;if(!this.ctrl.model.ifTree)this.ctrl.model.ifTree={};}
i++;if(data.rq[i]&&data.rq[i].resident){this.ctrl.model.lanClients=data.rq[i].resident;}
i++;if(data.rq[i]&&data.rq[i].resident){this.ctrl.model.jsonIGMP=data.rq[i].resident;}
i++;}}
if(this.mode&&this.mode!="update"){this.ctrl.event("updaterq");}
else{this.ctrl.prepareRecordSet();var editLan=getCookie("editLAN");if(editLan!=""){deleteCookie("editLAN");var recs=this.ctrl.model.recordSet;for(var i in recs){if(recs[i].ifaceL2=="br0"&&recs[i].srvnode.ip==editLan){this.ctrl.event("recselect",i);break;}}}}}
this.prepareData=function(){var obj;var delim="|";var ctrl=this.ctrl;switch(this.mode){case"add":case"save":var general=ctrl.getChild("mainTab","general");var model=general.model;var res_buf;var res_pos;if(this.mode=="add"){res_pos=-1;}
else{res_pos=0;}
obj={v2:"y",rq:0}
if(model.ifnode.needDelete instanceof Array){obj["res_config_id"+obj.rq]=1;obj["res_config_action"+obj.rq]=2;obj["res_json"+obj.rq]="y";obj["res_data_type"+obj.rq]="json";obj["res_struct_size"+obj.rq]=36;obj["res_buf"+obj.rq]=$.toJSON(model.ifnode.needDelete);obj.rq++;delete model.ifnode.needDelete;}
var contype=model.ifnode.contype;if(contype=="statpppoe"||contype=="dynpppoe"){var service2=$.extend(true,{},getObjectFirstChild(model.service.tunnels));var srvname2=getObjectFirstKey(model.service.tunnels);delete model.service.tunnels;var blankConn2=$.extend(true,{},model.blankConn);var services=getObjectFirstChild(blankConn2).services={};services[srvname2]=service2;}
obj["res_config_id"+obj.rq]=1;obj["res_config_action"+obj.rq]=3;obj["res_json"+obj.rq]="y";obj["res_data_type"+obj.rq]="json";obj["res_struct_size"+obj.rq]=36;obj["res_pos"+obj.rq]=res_pos;res_buf=$.toJSON(general.model.blankConn);res_buf=res_buf.replace(/%/g,"%25");res_buf=res_buf.replace(/#/g,"%23");res_buf=res_buf.replace(/&/g,"%26");obj["res_buf"+obj.rq]=res_buf;obj.rq++;if(is.object(blankConn2)){obj["res_config_id"+obj.rq]=1;obj["res_config_action"+obj.rq]=3;obj["res_json"+obj.rq]="y";obj["res_data_type"+obj.rq]="json";obj["res_struct_size"+obj.rq]=36;obj["res_pos"+obj.rq]=res_pos;res_buf=$.toJSON(blankConn2);res_buf=res_buf.replace(/%/g,"%25");res_buf=res_buf.replace(/#/g,"%23");res_buf=res_buf.replace(/&/g,"%26");obj["res_buf"+obj.rq]=res_buf;obj.rq++;}
if(this.ctrl.getChild("mainTab").model.enIGMPGlobal){obj["res_json"+obj.rq]="y";obj["res_data_type"+obj.rq]="json";obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_EDIT;obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_IGMP;obj["res_struct_size"+obj.rq]=0;obj["res_buf"+obj.rq]=$.toJSON({enable:true,version:2});obj.rq++;}
this.addToRequest(obj);break;case"update":obj={v2:"y",rq:1,res_json0:"y",res_config_action0:1,res_config_id0:1,res_struct_size0:36};obj["res_json"+obj.rq]="y";obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_READ;obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_NEIGHBOUR;obj["res_struct_size"+obj.rq]=0;obj.rq++;obj["res_json"+obj.rq]="y";obj["res_config_action"+obj.rq]=somovdParams.CONFIG_ACTION_READ;obj["res_config_id"+obj.rq]=somovdParams.CONFIG_ID_IGMP;obj["res_struct_size"+obj.rq]=0;obj.rq++;this.addToRequest(obj);break;case"delete":obj={v2:"y",rq:"y",res_config_id:1,res_config_action:2,res_json:"y",res_struct_size:36,res_delex:"y",res_data_type:"json"};jsonOutObj=[];var general=ctrl.getChild("mainTab","general");if(general.model.tnlname){jsonOutObj.push(general.model.tnlname);}
else if(general.model.srvname){jsonOutObj.push(general.model.srvname);}
obj.res_buf=$.toJSON(jsonOutObj);this.addToRequest(obj);break;}}
this.onupdaterq=function(){this.ctrl.activeRecordInx=-1;this.mode="update";this.updateView();}
this.onsaverq=function(){this.ctrl.activeRecordInx=-1;this.mode="save";this.updateView();}
this.onaddrq=function(){this.ctrl.activeRecordInx=-1;this.mode="add";this.updateView();}
this.ondeleterq=function(){this.ctrl.activeRecordInx=-1;this.mode="delete";this.updateView();}
this.mode="update";this.bind("updaterq",this.onupdaterq);this.bind("saverq",this.onsaverq);this.bind("addrq",this.onaddrq);this.bind("deleterq",this.ondeleterq);}
extend(jsWanSetServerView,jsSSideView);function jsWanSetGwifServerView(ctrl,viewInx,options){jsWanSetGwifServerView.superclass.constructor.call(this,ctrl,viewInx,options);this.pickData=function(){if(webadminParams.GWIF_DELAY>0){setTimeout(context(this).callback(this.delaiedrq),webadminParams.GWIF_DELAY);}
else{this.ctrl.event("updaterq");}}
this.delaiedrq=function(){this.ctrl.event("updaterq");}
this.prepareData=function(){var obj;var delim="|";var ctrl=this.ctrl;obj={v2:"y",rq:"y",res_config_id:this.rpc,res_config_action:3,res_json:"y",res_struct_size:36,res_pos:0,res_data_type:"json"};jsonOutObj=[];if(is.set(this.ifname)){jsonOutObj.push(this.ifname);}
else{jsonOutObj.push("nogwiface");}
obj.res_buf=$.toJSON(jsonOutObj);this.addToRequest(obj);}
this.oncellselect=function(obj){if(obj.cell==5){this.ifname=this.ctrl.model.recordSet[obj.row].ifaceL3;this.rpc=somovdParams.CONFIG_ID_WAN_DEFAULTGW;this.updateView();}
if(obj.cell==6){this.ifname=this.ctrl.model.recordSet[obj.row].ifaceL3;this.rpc=somovdParams.CONFIG_ID_WAN_DEFAULTGW_IPV6;this.updateView();}}
this.ondisgw=function(){delete this.ifname;this.rpc=somovdParams.CONFIG_ID_WAN_DEFAULTGW;this.updateView();if(obj.cell==6){this.rpc=somovdParams.CONFIG_ID_WAN_DEFAULTGW_IPV6;this.updateView();}
return false;}
this.rpc=somovdParams.CONFIG_ID_WAN_DEFAULTGW;this.bind("cellselect",this.oncellselect);this.bind("disgw",this.ondisgw);}
extend(jsWanSetGwifServerView,jsSSideView);function getConnType(ifnode,service,tunnel){var userType=null;switch(service.type.valueOf()){case"ppp":switch(ifnode.type.valueOf()){case"atm":switch(ifnode.link_type){case"MDMVS_EOA":userType="pppoe";break;case"MDMVS_PPPOA":userType="pppoa";break;default:userType="pppoe";}
break;case"ethernet":case"ptm":userType="pppoe";break;case"3g":userType="3g";break;}
break;case"pppv6":userType="pppoev6";break;case"pppdual":userType="pppoedual";break;case"ip":case"ipv6":switch(ifnode.type.valueOf()){case"atm":switch(ifnode.link_type){case"MDMVS_EOA":userType=getIPType(service,tunnel);break;case"MDMVS_IPOA":userType="ipoa";break;default:userType="static";}
break;case"lte":userType="lte";break;default:userType=getIPType(service,tunnel);}
break;case"bridge":userType="bridge";break;case"auto":userType=tunnel?tunnel.type:service.type;break;default:userType="bridge";}
return userType;}
function getIPType(service,tunnel){var userType=null;if(service.dhcp){if(service.type=="ipv6"){userType="dynamicv6";}
else{userType=service.kabinet?"dynkab":"dynamic";}
if(tunnel){switch(tunnel.type){case"pptp":userType=tunnel.useipv6?"dynpptpv6":"dynpptp";break;case"l2tp":userType=tunnel.useipv6?"dynl2tpv6":"dynl2tp";break;}}}
else{if(service.type=="ipv6"){userType="staticv6";}
else{userType=service.kabinet?"statkab":"static";}
if(tunnel){switch(tunnel.type){case"pptp":userType=tunnel.useipv6?"statpptpv6":"statpptp";break;case"l2tp":userType=tunnel.useipv6?"statl2tpv6":"statl2tp";break;}}}
return userType;}
var connTypeValSet={pppoe:"PPPoE",pppoev6:"IPv6 PPPoE",pppoedual:"PPPoE Dual Stack",bridge:"Bridge",pppoa:"PPPoA",static:lng("static"),dynamic:lng("dynamic"),statkab:lng("statkab"),dynkab:lng("dynkab"),staticv6:lng("staticv6"),dynamicv6:lng("dynamicv6"),ipoa:"IPoA","3g":"3G","lte":"LTE",pptp:"PPTP",l2tp:"L2TP",statpptp:lng("statpptp"),statpppoe:lng("statpppoe"),dynpptp:lng("dynpptp"),dynpppoe:lng("dynpppoe"),statl2tp:lng("statl2tp"),dynl2tp:lng("dynl2tp"),pptpv6:lng("pptpv6"),l2tpv6:lng("l2tpv6"),statpptpv6:lng("statpptpv6"),dynpptpv6:lng("dynpptpv6"),statl2tpv6:lng("statl2tpv6"),dynl2tpv6:lng("dynl2tpv6"),"624":lng("624")};function jsWidgetGridModel(definitions){jsWidgetGridModel.superclass.constructor.call(this);this.definitions=definitions;}
extend(jsWidgetGridModel,jsModel);function jsWidgetGridController(definitions){jsWidgetGridController.superclass.constructor.call(this);this.changeModel(new jsWidgetGridModel(definitions));this.ifaceTypes.client={type:jsWidgetGridClientView,def:true};for(var i=0;i<definitions.length;i++){if(!isObjEmpty(definitions[i])){if(!definitions[i].hide){this.addChild(new jsWidgetController(definitions[i]),definitions[i].alias);}else{for(var l in definitions[i].list){definitions[i].list[l]['menu']=definitions[i].name;definitions[i].list[l]['path']=definitions[i].alias+'/'+definitions[i].list[l].alias;if(definitions[i].list[l].tabs){for(var t in definitions[i].list[l].tabs){definitions[i].list[l].tabs[t]['menu']=definitions[i].name;definitions[i].list[l].tabs[t]['path']=definitions[i].list[l].path+'/'+definitions[i].list[l].tabs[t].alias;}}}}}}}
extend(jsWidgetGridController,jsController);function jsWidgetGridClientView(ctrl,viewInx,options){jsWidgetGridClientView.superclass.constructor.call(this,ctrl,viewInx,options);jsWidgetGridClientView.prototype.drawView=function(){var rowCount=3;var htmlToDraw='';var grid;var options=this.options;var uid=getUID();var childCtrls=this.ctrl.children;var child;this.myBoxSel='#widgetGrid'+uid;this.viewBoxSel=options.viewBoxSel;htmlToDraw="<center><table class='widgetGrid unselectable' id='widgetGrid"+uid+"' unselectable='on'></table></center>";$(this.viewBoxSel).html(htmlToDraw);grid=$(this.viewBoxSel+'>center>table');for(var i=0;i<Math.ceil(childCtrls.length/rowCount);i++){var tr=$("<tr />");$(grid).append($(tr));for(var index=i*rowCount;index<i*rowCount+rowCount&&index<childCtrls.length;index++){var td=$("<td />");$(tr).append($(td));if(i==0){$(td).css('padding-top','0');}else if(i==Math.ceil(childCtrls.length/rowCount)-1){$(td).css('padding-bottom','0');}
if(index==i*rowCount){$(td).css('padding-left','0');}else if(index==i*rowCount+rowCount-1){$(td).css('padding-right','0');}
child=this.getChild(index);child.viewBoxSel=this.myBoxSel+' tr:eq('+i+')>td:eq('+(index%rowCount)+')';child.options.viewBoxSel=child.viewBoxSel;}}
jsWidgetGridClientView.superclass.drawView.call(this);var speed=700;if($.browser.mozilla)speed=0;$(grid).find('.widget').show(speed,function(){setScrollbarSize();});}
this.ondragdrop=function(info){var dst=info.dst;var src;var child;for(var i=0;i<this.ctrl.children.length;i++){child=this.getChild(i);if(child.myBoxSel==info.src){src=child;break;}}
var srcL=$(src.myBoxSel).position().left;var srcT=$(src.myBoxSel).position().top;var dstL=$(dst.myBoxSel).position().left;var dstT=$(dst.myBoxSel).position().top;$(src.myBoxSel).css({'position':'absolute','left':srcL,'top':srcT});$(dst.myBoxSel).css({'position':'absolute','left':dstL,'top':dstT});$(src.myBoxSel).fadeTo(0,1);$(src.myBoxSel).animate({'left':dstL,'top':dstT},400);$(dst.myBoxSel).animate({'left':srcL,'top':srcT},400);var tempPattern=src.ctrl.model.pattern;src.ctrl.model.pattern=dst.ctrl.model.pattern;dst.ctrl.model.pattern=tempPattern;setTimeout(context(this).callback(function(){src.drawView(false);dst.drawView(false);}),500);}
this.bind("drag&drop",this.ondragdrop);}
extend(jsWidgetGridClientView,jsCSideView);function jsWidgetModel(pattern){jsWidgetModel.superclass.constructor.call(this);if(isObjEmpty(pattern.list[pattern.list.length-1])){pattern.list.pop();}
if(no(pattern.extraBar)){pattern.extraBar=null;}
if(no(pattern.freakBar)){pattern.freakBar=null;}
if(no(pattern.freakBar2)){pattern.freakBar2=null;}
this.pattern=pattern;}
extend(jsWidgetModel,jsModel);function jsWidgetController(pattern){jsWidgetController.superclass.constructor.call(this);this.changeModel(new jsWidgetModel(pattern));this.ifaceTypes.client={type:jsWidgetClientView,def:true};if(this.model.pattern.extraBar){this.addChild(new pattern.extraBar(),"extraBar");}
if(this.model.pattern.freakBar){this.addChild(new pattern.freakBar(),"freakBar");}
if(this.model.pattern.freakBar2){this.addChild(new pattern.freakBar2(),"freakBar2");}}
extend(jsWidgetController,jsController);function jsWidgetClientView(ctrl,viewInx,options){jsWidgetClientView.superclass.constructor.call(this,ctrl,viewInx,options);this.click=function(a){this.ctrl.event('selectpage',a.data,true);}
this.nextList=function(){var currentList=$(this.viewBoxSel+' .lists>.list:visible');var nextList;if($(currentList).next().length){nextList=$(currentList).next();}else{nextList=$(this.viewBoxSel+' .lists>.list:first');}
nextList.css({'left':$(currentList).width(),'top':0,'display':'block','opacity':0});$(this.viewBoxSel+' .menu>.panel').addClass('sliding');$(currentList).animate({left:0-$(currentList).width(),opacity:0},500,function(){$(currentList).css('display','none');});$(nextList).animate({left:0,opacity:1},600,function(){$(this).parents('.panel').removeClass('sliding');});return false;}
jsWidgetClientView.prototype.drawView=function(isHideDraw){var rowCount=3;var htmlToDraw='';var options=this.options;var uid=getUID();var pattern=this.ctrl.model.pattern;var child;var style="style='display: none'";this.myBoxSel='#widget'+uid;this.viewBoxSel=options.viewBoxSel;if(!no(isHideDraw)){if(!isHideDraw){style='';}}
htmlToDraw="<div class='widget unselectable' id='widget"+uid+"' "+style+">";htmlToDraw+="<div class='grand'>";htmlToDraw+="<div class='icon'><img src='"+pattern.icon+"' /></div>"
htmlToDraw+="<div class='content'>";htmlToDraw+="<div class='caption'>";htmlToDraw+="<div class='title' unselectable='on'>"+lng(pattern.name)+"</div>";if(pattern.freakBar){htmlToDraw+="<div class='freak'></div>";}
if(pattern.freakBar2){htmlToDraw+="<div class='freak'></div>";}
htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="<div class='menu'>";htmlToDraw+="<div class='panel'><div class='lists'></div></div>";htmlToDraw+="<div class='next'>";if(pattern.list.length>rowCount){htmlToDraw+="<span unselectable='on'>»</span>";}
htmlToDraw+="</div>";htmlToDraw+="<div class='clear'></div>";htmlToDraw+="</div>";htmlToDraw+="</div>";htmlToDraw+="<div class='clear'></div>"
htmlToDraw+="</div>";if(pattern.extraBar){htmlToDraw+="<div class='extra'></div>";}
htmlToDraw+="</div>";$(this.viewBoxSel).html(htmlToDraw);var lists=$(this.viewBoxSel+' .panel>.lists');for(var i=0;i<Math.ceil(pattern.list.length/rowCount);i++){var list=$("<div class='list' />");if(i!=0)$(list).css('display','none');$(lists).append(list);for(var index=i*rowCount;index<i*rowCount+rowCount&&index<pattern.list.length;index++){if(pattern.list[index].alias.substr(0,4)=='http'){var a=$("<a href='"+pattern.list[index].alias+"'>"+lng(pattern.list[index].item)+"</a>");$(list).append(a);}else{var a=$("<a href='#"+pattern.alias+'/'+pattern.list[index].alias+"'>"+lng(pattern.list[index].item)+"</a>");$(list).append(a);var item=pattern.list[index];item['menu']=pattern.name;item['path']=pattern.alias+'/'+item.alias;var tabs=item.tabs;if(tabs){for(var t=0;t<tabs.length;t++){tabs[t].path=pattern.alias+'/'+item.alias+'/'+tabs[t].alias;}}
$(a).bind('click',item,context(this).callback(this.click));if(pattern.list[index].hide){$(a).remove();continue;}}}
if($(list).find('a').length==0)$(list).remove();}
$(this.myBoxSel+' .next').click(context(this).callback(this.nextList));if(pattern.freakBar){child=this.getChild('freakBar');child.viewBoxSel=this.viewBoxSel+' .freak:eq(0)';child.options.viewBoxSel=child.viewBoxSel;}
if(pattern.freakBar2){child=this.getChild('freakBar2');child.viewBoxSel=this.viewBoxSel+' .freak:eq(1)';child.options.viewBoxSel=child.viewBoxSel;}
if(pattern.extraBar){$(this.myBoxSel).addClass('extraStyle')
child=this.getChild('extraBar');child.viewBoxSel=this.myBoxSel+' .extra';child.options.viewBoxSel=child.viewBoxSel;}else{$(this.myBoxSel).addClass('standartStyle')}
$(this.myBoxSel+' .title').attr('draggable','true').bind('dragstart',context(this).callback(this.dragStart)).bind('dragend',context(this).callback(function(){$(this.myBoxSel).fadeTo(600,1);}));$(this.myBoxSel).bind('dragenter',context(this).callback(this.dragEnter)).bind('dragleave',context(this).callback(this.dragLeave)).bind('dragover',context(this).callback(this.dragOver)).bind('drop',context(this).callback(this.drop));jsWidgetClientView.superclass.drawView.call(this);}
this.dragStart=function(event){$(this.myBoxSel).fadeTo(600,0.2);event.originalEvent.dataTransfer.setData('text/plain',this.myBoxSel);event.originalEvent.dataTransfer.effectAllowed='move';return true;}
this.dragEnter=function(event){return false;}
this.dragLeave=function(event){var widget=event.originalEvent.dataTransfer.getData('text/plain');if(this.myBoxSel!=widget){}
return false;}
this.dragOver=function(event){var widget=event.originalEvent.dataTransfer.getData('text/plain');if(this.myBoxSel!=widget){}
return false;}
this.drop=function(event){var widget=event.originalEvent.dataTransfer.getData('text/plain');if(this.myBoxSel!=widget){this.getParent().ctrl.event('drag&drop',{src:widget,dst:this});}
return false;}}
extend(jsWidgetClientView,jsCSideView);function pageWiFiAdvanced(GHz){pageWiFiAdvanced.superclass.constructor.apply(this,Array.prototype.slice.call(arguments,1));this.wifi=null;this.GHz=is.set(GHz)?GHz:'';var bg_prots={"Auto":0,"Always On":1,"Always Off":2};var short_gis={"Enable":"enable","Disable":"disable"};this.add(new nodenum("addonKeepAlive",0,{mandatory:true}),"keep_alive");this.add(new nodenum("addonBeacon",0,{mandatory:true}),"beacon")
.add(new nodenum("addonRts",0,{mandatory:true}),"rts")
.add(new nodenum("addonFrag",0,{mandatory:true}),"frag")
.add(new nodenum("addonDtim",0,{mandatory:true}),"dtim")
.add(new nodenum("addonTxPwr",0,{mandatory:true,minval:0,maxval:100}),"tx_pwr");this.add(new nodeSelect("addonBgProt"),"bg_prot");this.add(new nodeSelect("addonBand"),"band");this.add(new nodeSelect("addonShortGI"),"short_gi");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageWiFiAdvanced.superclass.updateView.apply(this,arguments);if(phase=="back"){var bg_prot=this.child("bg_prot").cleanOptions();for(var prot in bg_prots){bg_prot.addOption(prot,bg_prots[prot]);}
var short_gi=this.child("short_gi").cleanOptions();for(var gi in short_gis){short_gi.addOption(gi,short_gis[gi]);}
var settings=this.wifi[this.GHz+'addon_settings'];if(settings){this.child("keep_alive").val(settings.StationKeepAlive);bg_prot.val(settings.BGProtection);this.child("beacon").val(settings.BeaconPeriod);this.child("rts").val(settings.RTSThreshold);this.child("frag").val(settings.FragThreshold);this.child("dtim").val(settings.DtimPeriod);this.child("tx_pwr").val(settings.TxPower);var band=this.child("band").cleanOptions();var bandlist=this.wifi[this.GHz+'BandwidthAvailable'];for(var i=0;i<bandlist.length;i++){band.addOption(bandlist[i].Name,bandlist[i].Id);}
var bw=parseInt(settings.BandWidth)||0;band.val(bw);this.child("short_gi").val(settings.HTGI);}
this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){this.save();}}));}}
this.save=function(){rootView.showModalOverlay();var data={'BeaconPeriod':this.child("beacon").val().toString(),'RTSThreshold':this.child("rts").val().toString(),'FragThreshold':this.child("frag").val().toString(),'DtimPeriod':this.child("dtim").val().toString(),'TxPower':this.child("tx_pwr").val().toString(),'StationKeepAlive':this.child("keep_alive").val().toString(),'BGProtection':this.child("bg_prot").val().toString(),'BandWidth':this.child("band").val().toString(),'HTGI':this.child("short_gi").val()};$.extend(this.wifi[this.GHz+'addon_settings'],data);var data_GHz={};data_GHz[this.GHz+'addon_settings']=data;device.config.write(somovdParams.CONFIG_ID_WIFI_ADVANCED,data_GHz,callback(this,function(){rootView.hideModalOverlay();}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WIFI,callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();}));});}
extend(pageWiFiAdvanced,node);function bestWirelessMode(ModeAvailable){function find(value){for(var i=ModeAvailable.length;i>0;i--){var mode=ModeAvailable[i-1];if(mode.Name.toUpperCase().search(value.toUpperCase())>=0){return mode.Id;}}
return null;}
var bestlist=["B/G/N","G/N","B/G","mixed"];for(var i=0;i<bestlist.length;i++){var id=find(bestlist[i]);if(is.set(id)){return id;}}
return ModeAvailable[ModeAvailable.length-1].Id;}
function wifiBasicForm(GHz){wifiBasicForm.superclass.constructor.apply(this,Array.prototype.slice.call(arguments,1));this.wifi=null;this.countries=null;this.channels=null;this.GHz=is.set(GHz)?GHz:'';this.add(new nodeCheckBox("commonEnableWiFi"),"enable");this.add(new nodeCheckBox("commonEnableWds"),"wifi_broadcast");this.add(new node(),"advanced")
.child("advanced")
.add(new nodeSelect("MBSSID",'',{disabled:true}),"mbssid")
.add(new nodeSelect("BSSID",'',{disabled:true}),"bssid");this.add(new nodeCheckBox("basicHideAP"),"hideap")
.add(new nodetext("SSID",'',{mandatory:true}),"ssid");this.add(new nodeSelect("basicCountry",'',{}),"country")
.add(new nodeSelect("basicChannel"),"channel");this.add(new nodeSelect("basicMode",'',{comment:"basicModeComment"}),"wl_mode")
.add(new nodenum("basicClientMax",0,{mandatory:true,comment:"basicClientMaxTitle"}),"max_clients");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){wifiBasicForm.superclass.updateView.apply(this,arguments);if(phase=="back"){if(this.wifi){var wifi=this.wifi;var mbssidCurItem=wifi[this.GHz+'mbssid'][wifi.mbssidCur-1];var modes=this.wifi[this.GHz+'ModeAvailable'];var country=this.child("country").cleanOptions();var channel=this.child("channel").cleanOptions();this.child("enable").val(wifi[this.GHz+'Radio']).fieldchange();this.child("wifi_broadcast").val(wifi["WifiBroadcast"]==1);var mbssid=this.child("advanced/mbssid").cleanOptions();var bssid=this.child("advanced/bssid").cleanOptions();mbssid.addOption('wifiCommonOff',1);var startMbssid=2;for(var i=startMbssid;is.number(wifi[this.GHz+'mbssidMax'])&&i<=wifi[this.GHz+'mbssidMax'];i++){mbssid.addOption(i,i);}
for(var i=0;is.number(wifi[this.GHz+'mbssidNum'])&&i<wifi[this.GHz+'mbssidNum'];i++){if(wifi[this.GHz+'mbssid'][i])
bssid.addOption(wifi[this.GHz+'mbssid'][i].BSSID,i+1);}
mbssid.val(wifi[this.GHz+'mbssidNum']).fieldchange();bssid.val(wifi[this.GHz+'mbssidCur']);for(var i=0;i<this.countries.length;i++){country.addOption(this.countries[i].name,this.countries[i].code);}
for(var i=0;i<this.channels.length;i++){channel.addOption(this.channels[i],this.channels[i]);}
var wl_mode=this.child("wl_mode").cleanOptions();for(var i=0;i<modes.length;i++){wl_mode.addOption(modes[i].Name,modes[i].Id);}
this.child("hideap").val(wifi[this.GHz+'HideSSID']);this.child("ssid").val(mbssidCurItem?mbssidCurItem.SSID:'');this.child("country").val(wifi.CountryCode);this.child("channel").val(wifi[this.GHz+'Channel']);this.child("wl_mode").val(wifi[this.GHz+'WirelessMode']);this.child("max_clients").val(wifi[this.GHz+'MaxStaNum']);}}}
this.save=function(cb){var enable=this.child("enable").val();var data_c={};data_c[this.GHz+'Radio']=enable;data_c[this.GHz+'mbssidNum']=(enable)?parseInt(this.child("advanced/mbssid").val()):this.wifi[this.GHz+'mbssidNum'];data_c[this.GHz+'mbssidCur']=(enable)?parseInt(this.child("advanced/bssid").val()):this.wifi[this.GHz+'mbssidCur'];var data_b={'CountryCode':this.child("country").val()};data_b[this.GHz+'Channel']=this.child("channel").val();data_b[this.GHz+'mbssid']=[{}];data_b[this.GHz+'mbssid'][0]['SSID']=makeValidJSONString(this.child("ssid").val());data_b[this.GHz+'WirelessMode']=this.child("wl_mode").val();data_b[this.GHz+'MaxStaNum']=this.child("max_clients").val().toString();data_b[this.GHz+'HideSSID']=this.child("hideap").val();var data_d={};data_b["WifiBroadcast"]=this.child("wifi_broadcast").val()?true:false;$.extend(this.wifi,data_c,data_b);device.config.write([[somovdParams.CONFIG_ID_WIFI,data_b],[somovdParams.CONFIG_ID_WIFI_ONOFF,data_c],],cb);}
this.autosave=function(autoupdate){this.deep.updateModel();if(!this.status.error){rootView.showModalOverlay();this.save(callback(this,function(autoupdate){rootView.hideModalOverlay();if(autoupdate)this.update();},autoupdate));}}
this.update=function(wifi,countries,channels){window.hasChanges=null;if(wifi&&countries&&channels){this.wifi=wifi;this.countries=countries;this.channels=channels;this.deep.updateView();}else{rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_GET_WIFI_COUNTRYS,somovdParams.CONFIG_ID_GET_WIFI_CHANELS],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.countries=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.CountryList:[];this.channels=(is.RPC_SUCCESS(data.rq[2]))?data.rq[2].resident[this.GHz+'ChannelList']:[];this.deep.updateView();if(this.GHz){rootCtrl.event("changewifi5G",this.wifi[this.GHz+'Radio']);}
else{rootCtrl.event("changewifi",this.wifi.Radio);}
rootView.hideModalOverlay();}));}}
this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"enable":var mbssid=this.child("advanced/mbssid");var bssid=this.child("advanced/bssid");if(value){mbssid.enable();bssid.enable();}else{mbssid.disable();bssid.disable();}
break;case"country":case"bssid":this.autosave(true);break;}});}
extend(wifiBasicForm,node);function pageWiFiBasic(GHz){pageWiFiBasic.superclass.constructor.apply(this,Array.prototype.slice.call(arguments,1));var basic=this.add(new wifiBasicForm(GHz),"basic").child("basic");this.updateView=function(phase){pageWiFiBasic.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){basic.autosave(true);}));}}
this.bind("updaterq",function(){this.deep.updateView();basic.update();});}
extend(pageWiFiBasic,node);function wifiHotspotList(GHz){wifiHotspotList.superclass.constructor.apply(this,arguments);this.hlist=null;this.apcli=null;this.wifi=null;this.$grid=null;var $selrow=null;var siglist=['g3_1.gif','g3_2.gif','g3_3.gif','g3_4.gif','g3_5.gif'];var secure_list=["NONE","WEP","OPEN","SHARED","WPAPSK","WPA2PSK","WPA1PSKWPA2PSK","WPAPSKWPA2PSK"];this.GHz=is.set(GHz)?GHz:'';this.updateView=function(phase){wifiHotspotList.superclass.updateView.apply(this,arguments);if(phase=="forward"){$selrow=null;this.cleanButtonBar().$box.empty();this.$grid=this.$box.html("\
    <div class='grid'></div>\
   ").find('.grid').lightUIGrid([{index:"ssid",name:"SSID"},{index:"bssid",name:"BSSID"},{index:"wmode",name:"clientWMode"},{index:"channel",name:"clientChannel"},{index:"sec",name:"clientAuthMode"},{index:"sig",name:"clientSignal"}],this.hlist?this.hlist.length:0,{clickable:true});this.$grid.bind("rowclick.grid",callback(this,function(event,$row){if($selrow)$selrow.unselectRow();$selrow=$row.selectRow();this.emit('hotspotchange',this.hlist[$selrow.irow()],GHz?GHz:'');}));for(var i=0;this.hlist&&i<this.hlist.length;i++){var hotspot=this.hlist[i];var $row=this.$grid.row(i);var ssid="<span>"+hotspot.ssid+" </span>";if(this.apcli.ApCliBssid!=''&&this.apcli.ApCliBssid.toUpperCase()==hotspot.bssid.toUpperCase()){ssid+="<img src='image/ledgreen.gif' />";$selrow=$row.selectRow();}
$row.col("ssid").fieldval(ssid);$row.col("wmode").fieldval("802."+hotspot.wmode);$row.col("channel").fieldval(hotspot.channel);$row.col("bssid").fieldval(hotspot.bssid.toUpperCase());if(hotspot.sig){var sigval=Math.ceil(parseInt(hotspot.sig)/20),imgs='';for(var j=0;j<sigval;j++){imgs+="<img src='image/"+siglist[j]+"' style='margin:0' />";}
$row.col("sig").fieldval(imgs+"<span> ("+hotspot.sig+"%)</span>");}else{$row.col("sig").fieldval("["+lng("clientDataUnknown")+"]");}
hotspot.security=(hotspot.sec)?hotspot.sec.split("/"):["UNKNOWN"];if(hotspot.security[0]=="WPA1PSKWPA2PSK"){hotspot.security[0]="WPAPSKWPA2PSK";}
var secstr="["+hotspot.security[0]+"]";switch(hotspot.security[0]){case"NONE":case"OPEN":secstr="["+lng("clientSecureOpen")+"]";break;case"WEP":case"SHARED":secstr="["+lng("clientSecureOpen")+"]"+" "+"[WEP]";break;case"WPAPSK":secstr="[WPA-PSK]";break;case"WPA2PSK":secstr="[WPA2-PSK]";break;case"WPAPSKWPA2PSK":secstr="[WPA-PSK/WPA2-PSK mixed]";break;}
if(hotspot.security[1]){switch(hotspot.security[1]){case"TKIPAES":secstr+=" [TKIP+AES]";break;default:secstr+=" ["+hotspot.security[1]+"]";}}
$row.col("sec").fieldval(secstr);}
this.addButton("clientScanBtn")
.getButton("clientScanBtn")
.bind("click.button",callback(this,function(){this.update();}));}}
this.getActive=function(){if($selrow){return this.hlist[$selrow.irow()];}
return null;}
this.turn_on=function(){rootView.showModalOverlay();var data={'mbssidNum':this.wifi.mbssidNum,'mbssidCur':this.wifi.mbssidCur,'Radio':true};$.extend(this.wifi,data);device.config.write(somovdParams.CONFIG_ID_WIFI_ONOFF,data,callback(this,function(){rootView.hideModalOverlay();}));}
this.update=function(wifi,hlist){if(hlist){this.wifi=wifi;this.hlist=hlist;this.apcli=(wifi&&wifi.apcli)?wifi.apcli:null;this.deep.updateView();}else{device.config.read([somovdParams.CONFIG_ID_WIFI,(this.GHz=='5G_'?somovdParams.CONFIG_ID_WIFI_SCAN_5G:somovdParams.CONFIG_ID_WIFI_SCAN)],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.hlist=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident:null;this.apcli=(this.wifi&&this.wifi.apcli)?this.wifi.apcli:{};this.deep.updateView();if(!is.RPC_SUCCESS(data.rq[1]))alert(lng("clientListNotAvail"));if(this.wifi&&!this.wifi.Radio){if(confirm(lng("clientConfTurnOn"))){this.turn_on();}}}));}}}
extend(wifiHotspotList,node);function pageWiFiClient(){pageWiFiClient.superclass.constructor.apply(this,arguments);this.wifi=null;this.hotspot=null;var net_auths={"Open":"OPEN","Shared":"SHARED","WPA-PSK":"WPAPSK","WPA2-PSK":"WPA2PSK","WPA-PSK/WPA2-PSK mixed":"WPAPSKWPA2PSK"};var scan=this.add(new nodeCheckBox("clientEnable",false),"enable")
.add(new node({hidden:true}),"scan")
.child("scan")
.add(new nodeCaption("clientMasterSectScanData"))
.add(new wifiHotspotList(),"hlist")
.add(new nodeCaption("clientSectParams"))
.add(new nodeCheckBox("commonEnableWds"),"wifi_broadcast")
.add(new nodetext("SSID"),"ssid")
.add(new nodemac("BSSID",'',{mandatory:false}),"bssid")
.add(new nodeSelect("clientAuthMode"),"netauth")
.add(new nodetext("clientKeyPSK",'',{mandatory:true,hidden:true,re:[callback(this,function(value){return check_wifi_keypsk(value)?null:"wifiPSKKeyWrong";})]}),"key_psk")
.add(new wifiWEPForm(),"wep")
.add(new wifiWPAForm({hidden:true}),"wpa");var hlist=scan.child("hlist");var wep=scan.child("wep");var wpa=scan.child("wpa");var keys=wep.child("keys");this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageWiFiClient.superclass.updateView.apply(this,arguments);if(phase=="back"){var netauth=scan.child("netauth").cleanOptions();for(var auth in net_auths){netauth.addOption(auth,net_auths[auth]);}
wpa.child("wpa_ren").hide();if(this.wifi){var apcli=this.wifi.apcli;var wep_encr=wep.child("wep_encr");this.child("enable").val(apcli.ApCliEnable).fieldchange();this.child("scan").child("wifi_broadcast").val(this.wifi.WifiBroadcast);scan.child("ssid").val(apcli.ApCliSsid);scan.child("bssid").val(apcli.ApCliBssid);scan.child("netauth").val(apcli.ApCliAuthMode).fieldchange();scan.child("key_psk").val(apcli.ApCliWPAPSK);if(apcli.ApCliEncrypType=="WEP"||apcli.ApCliAuthMode=="SHARED"){wep_encr.val(true).fieldchange();}else{wep_encr.val(false).fieldchange();if(apcli.ApCliEncrypType=="TKIP"||apcli.ApCliEncrypType=="AES")
wpa.child("wpa_enc").val(apcli.ApCliEncrypType)}
keys.child("key_id").val((apcli.ApCliDefaultKeyId=="")?"0":(parseInt(apcli.ApCliDefaultKeyId)-1).toString());keys.child("key_type").val((apcli.Key1Type!="")?apcli.ApCliKey1Type=="0":false);keys.child("key1").val(apcli.ApCliKey1Str);keys.child("key2").val(apcli.ApCliKey2Str);keys.child("key3").val(apcli.ApCliKey3Str);keys.child("key4").val(apcli.ApCliKey4Str);var multipler=1;if(keys.child("key_type").val()){multipler=2;}
var keylen=keys.child('key1').val().length;if(keylen>=6*multipler){keys.child('key_bit').val(128);}else{keys.child('key_bit').val(64);}}
this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){var channel=null;if(is.set(this.hotspot)&&this.wifi.Channel!=this.hotspot.channel){if(!confirm(lng("confirm_change_channel")))return;channel=this.hotspot.channel;}
this.save(channel);}}));}}
this.save=function(channel){rootView.showModalOverlay();var query=new Array();var key_type=(keys.child("key_type").val())?"0":"1";var wpa_encr=wpa.child("wpa_enc").val();var wep_encr=wep.child("wep_encr").val();var auth=scan.child("netauth").val();var data1={'apcli':{'ApCliEnable':this.child("enable").val(),'ApCliSsid':scan.child("ssid").val(),'ApCliBssid':scan.child("bssid").val(),'ApCliAuthMode':auth,'ApCliKey1Type':key_type,'ApCliKey2Type':key_type,'ApCliKey3Type':key_type,'ApCliKey4Type':key_type,'ApCliKey1Str':keys.child("key1").val(),'ApCliKey2Str':keys.child("key2").val(),'ApCliKey3Str':keys.child("key3").val(),'ApCliKey4Str':keys.child("key4").val(),'ApCliDefaultKeyId':(parseInt(keys.child("key_id").val())+1).toString(),'ApCliWPAPSK':scan.child("key_psk").val(),'ApCliEncrypType':(auth!="OPEN"&&auth!="SHARED")?wpa_encr:(wep_encr)?"WEP":"NONE"}};$.extend(this.wifi,data1);query.push([(this.GHz=='5G_'?somovdParams.CONFIG_ID_WIFI_CLI_5G:somovdParams.CONFIG_ID_WIFI_CLI),data1]);var data2={};data2.WifiBroadcast=scan.child("wifi_broadcast").val()?true:false;if(channel){data2.Channel=channel;}
if(Object.keys(data2).length>0){$.extend(this.wifi,data2);query.push([somovdParams.CONFIG_ID_WIFI,data2]);}
device.config.write(query,callback(this,function(){this.emit("updaterq");}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_WIFI_SCAN],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.deep.updateView();hlist.update(this.wifi,(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident:null);this.hotspot=hlist.getActive();rootView.hideModalOverlay();}));});this.bind("hotspotchange",function(status,hotspot,GHz){window.hasChanges="page";this.hotspot=hotspot;scan.child("ssid").val(hotspot.ssid);scan.child("bssid").val(hotspot.bssid.toUpperCase());scan.child("netauth").val((hotspot.security[0]=="NONE"||hotspot.security[0]=="WEP")?"OPEN":hotspot.security[0]).fieldchange();if(hotspot.security[1]){wpa.child("wpa_enc").val(hotspot.security[1]);}
this.GHz=GHz;});this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"enable":if(value)scan.show();else scan.hide();break;case"netauth":var wep_encr=wep.child("wep_encr");var key_psk=scan.child("key_psk");wep.hide();wpa.hide();key_psk.hide();keys.hide();switch(value){case"OPEN":wep_encr.enable().val(false);wep.show();break;case"SHARED":wep_encr.disable().val(true);keys.show();wep.show();break;case"WPAPSK":case"WPA2PSK":case"WPAPSKWPA2PSK":key_psk.show();wpa.show();break;}
break;}});}
extend(pageWiFiClient,node);function jsWiFiModel(){jsWiFiModel.superclass.constructor.call(this);this.WiFiData=null;this.WiFiAdditData=null;this.mbssidSelectedObj=0;}
extend(jsWiFiModel,jsModel);function check_wifi_key_ex(str,hexKeys,bit){var min=1;var max=13;if(bit==64){min=1;max=5;}else if(bit==128){min=6;max=13;}
var multiplier=1;if(hexKeys)
multiplier=2;if(str.length>=min*multiplier&&str.length<=max*multiplier)
return true;return false;}
function check_wifi_key_hex(str){var pat=/^[0-9a-fA-F]+$/;if(!pat.test(str))
return false;return true;}
function check_wifi_keypsk(str){if(str.length<8||str.length>63)
return false;return true;}
function pageWiFiMACFilterMode(){pageWiFiMACFilterMode.superclass.constructor.call(this);this.wifi=null;var modes={"wifiMacModeDis":0,"wifiMacModeAlw":1,"wifiMacModeDen":2};this.add(new nodeSelect("wifiMacMode"),"mode");this.updateView=function(phase){pageWiFiMACFilterMode.superclass.updateView.apply(this,arguments);if(phase=="back"){var mode=this.child("mode").cleanOptions();for(var m in modes){if(m)mode.addOption(m,modes[m]);}
var wifi=this.wifi;if(wifi){this.child("mode").val(wifi.mbssid[wifi.mbssidCur-1].AccessPolicy);}
this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.save(parseInt(this.child("mode").val()));}));}}
this.save=function(mode){rootView.showModalOverlay();this.deep.updateModel();var data={'mbssid':[{'AccessPolicy':mode}]};$.extend(this.wifi,data);device.config.write(somovdParams.CONFIG_ID_WIFI_FL_MODE,data,callback(this,function(){rootView.hideModalOverlay();}));}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WIFI,callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();}));});}
extend(pageWiFiMACFilterMode,node);function pageWiFiMACFilter(){pageWiFiMACFilter.superclass.constructor.call(this);this.wifi=null;this.lanClients=null;this.maclist=[];this.$grid=null;this.add(new nodeCaption("wifiMacViewLabel"))
.add(new nodeComboText("dhcpMacClients",null,{header:[{index:"ip",name:"IP"},{index:"mac",name:"MAC"},{index:"host",name:"Host"}],index:"mac",blank:"dhcpMacClientsSel2"}),"mac")
.add(new node(),"grid");this.updateModel=function(status){status.error|=!this.$grid.cleanErrors().checkMandatory(true);this.status=status;}
this.updateView=function(phase){pageWiFiMACFilter.superclass.updateView.apply(this,arguments);if(phase=='back'){this.$grid=this.child("grid").$box.empty().html("\
    <div class='grid rm'></div>\
    <div class='buttonsInline'>\
     <div class='button add'></div>\
    </div>\
   ").find('.grid').lightUIGrid([{index:"mac",name:"hwaddr"}],0,{selectable:true});this.$grid.bind("stopEditing.grid",callback(this,function(event,$cell){this.$grid.cleanErrors();}));this.$grid.colEditable("mac","mac",{mandatory:true,unique:'soft'});this.$grid.bind("cellChange.grid",callback(this,function(event,$cell){$cell.fieldval($cell.fieldval().toUpperCase());}));this.child("grid").$box.find('.add')
.lightUIButton("add")
.bind("click.button",callback(this,function(){var $row=this.$grid.addRow().row("last");$row.col("mac").trigger("click");}));this.maclist=(this.wifi)?this.wifi.mbssid[this.wifi.mbssidCur-1].AccessControlList:[];for(var i=0;i<this.maclist.length;i++){var $row=this.$grid.addRow().row("last");$row.col("mac").fieldval(this.maclist[i]);}
this.$grid.resetAll();this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.deep.updateModel();if(!this.status.error){this.save(gridActionConverter(this.$grid));this.$grid.selection().removeRow();}}));var mac=this.child('mac').cleanRows();for(var i=0;i<this.lanClients.length;i++){var obj=this.lanClients[i];mac.addRow(obj.ip,obj.mac.toUpperCase(),obj.hostname);}}}
this.save=function(actions){if(actions.count){rootView.showModalOverlay();var query=new Array();var rmlist=new Array();var addlist=new Array();var temp=actions.deleted.concat(actions.changed);for(var i=0;i<temp.length;i++){rmlist.push(this.maclist[temp[i]]);}
if(rmlist.length){query.push([somovdParams.CONFIG_ID_DEL_FL_MAC,rmlist]);}
temp=actions.changed.concat(actions.added);for(var i=0;i<temp.length;i++){var $row=this.$grid.row(temp[i]);addlist.push($row.col("mac").fieldval());}
if(addlist.length){query.push([somovdParams.CONFIG_ID_WIFI_FL_ADD,addlist]);}
device.config.write(query,callback(this,function(data){this.update();}));}}
this.update=function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_NEIGHBOUR],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.lanClients=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident:[];this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);this.bind("ruleselect",function(status,value){switch(status.target.getAlias()){case"mac":var rule=value;if(this.$grid.find("td:contains('"+rule.col("mac").fieldval()+"')").length==0){var $row=this.$grid.addRow().row("last");$row.col("mac").fieldval(rule.col("mac").fieldval());}else{alert(lng('dup'));}
break;}});}
extend(pageWiFiMACFilter,node);function _doSaveReboot(){if(confirm(lng("wzwifiSaveOk")+'\n'+lng("wzwifiNeedReboot")+'\n'+lng("wzwifiRebooting")+'\n'+lng("wzwifiReboot"))){device.system.reboot(true);rootView.showWaitScreen(lng("rebooting"),webadminParams.REBOOT_TIME,function(){rootView.hideWaitScreen();});}}
function wizardWiFiRouter(){wizardWiFiRouter.superclass.constructor.apply(this,arguments);this.wifi=null;this.ifacelist=null;this.step=null;var auth_to_encrypt={'WPAPSK':'AES','WPA2PSK':'AES','WPAPSKWPA2PSK':'AES'};this.add(new node(),'basic')
.child("basic")
.add(new nodeCaption("wzwifiDescSSID"))
.add(new nodetext("SSID",'',{mandatory:true}),"ssid");this.add(new node(),'security')
.child("security")
.add(new nodeCaption("wzwifiDescSecurity"))
.add(new nodeSelect("securityAuthMode"),"authmode")
.add(new nodetext("clientMasterSecurityKey",'',{disabled:true,mandatory:true,re:[function(value){return check_wifi_keypsk(value)?null:"wifiPSKKeyWrong";}]}),"key");this.add(new node(),'finish')
.child("finish")
.add(new nodeCaption("clientMasterSectSummary"))
.add(new nodestatic("wzwifiMode"),"mode")
.add(new nodestatic("SSID"),"ssid")
.add(new nodestatic("securityAuthMode"),"authmode")
.add(new nodestatic("clientMasterSecurityKey"),"key")
.add(new nodeCaption("wzwifiAtt","wzwifiNeedReboot",{hidden:true}),"attention");this.updateModel=function(status){this.status=status;}
this.checkNext=function(){return!this.pluginWizard.isStepLast(this.getActiveIndex());}
this.checkPrevious=function(){return!this.pluginWizard.isStepFirst(this.getActiveIndex());}
this.checkSave=function(){return this.pluginWizard.isStepLast(this.getActiveIndex());}
this.next=function(){if(this.checkNext()&&this.step.deep.updateModel()&&this.do_before()){this.switchStep("next");this.do_after();}}
this.previous=function(){if(this.checkPrevious()){this.switchStep("prev");this.do_after();}}
this.do_before=function(){return true;}
this.do_after=function(){this.step=this.getActiveStep();if(this.step.getAlias()=='finish'){var stat=this.child("finish");stat.child("mode").val(lng("wzwifiRouter"));stat.child("ssid").val(this.child("basic/ssid").val());stat.child("authmode").val((this.child("security/authmode").val()=='OPEN')?lng("wzwifiOpen"):lng("wzwifiClose"));stat.child("key").val((this.child("security/authmode").val()=='OPEN')?lng("wzwifiNo"):this.child("security/key").val());if(this.ifacelist.br0.services.br0.dhcpd.enable){stat.child("attention").hide();}else{stat.child("attention").show();}}}
this.save=function(){rootView.showModalOverlay();var ssid=makeValidJSONString(this.child("basic/ssid").val());var key=(this.child("security/authmode").val()!='OPEN')?this.child("security/key").val():null;var query=new Array();var wifi=this.wifi;var auth=bestAuthMode(wifi.AuthAvailable);var create={basic:function(GHz){GHz=is.set(GHz)?GHz:'';var obj={'CountryCode':wifi.CountryCode};obj[GHz+'mbssid']=[{'SSID':ssid}];obj[GHz+'Channel']='auto';obj[GHz+'WirelessMode']=bestWirelessMode(wifi[GHz+'ModeAvailable']);obj[GHz+'MaxStaNum']="0";obj[GHz+'HideSSID']=false;if(GHz.length){obj[GHz+'mbssid'][0]['SSID']+='_5GHz';}
return obj;},security:function(GHz){GHz=is.set(GHz)?GHz:'';var mbssid=wifi[GHz+'mbssid'][wifi[GHz+'mbssidCur']-1];var obj={};obj[GHz+'mbssid']=[{'AuthMode':(key)?auth:'OPEN','WPAPSK':(key)?key:mbssid.WPAPSK,'Key1Str':mbssid.Key1Str,'Key1Type':mbssid.Key1Type,'Key2Str':mbssid.Key2Str,'Key2Type':mbssid.Key1Type,'Key3Str':mbssid.Key3Str,'Key3Type':mbssid.Key1Type,'Key4Str':mbssid.Key4Str,'Key4Type':mbssid.Key1Type,'DefaultKeyID':mbssid.DefaultKeyID,'PreAuth':false,'EncrypType':(key)?auth_to_encrypt[auth]:'NONE'}];obj[GHz+'RADIUS_Server']=wifi[GHz+'RADIUS_Server'];obj[GHz+'RADIUS_Port']=wifi[GHz+'RADIUS_Port'];obj[GHz+'RADIUS_Key']=wifi[GHz+'RADIUS_Key'];obj[GHz+'RekeyInterval']=3600;return obj;},common:function(GHz){GHz=is.set(GHz)?GHz:'';var obj={};obj[GHz+'mbssidNum']=1;obj[GHz+'mbssidCur']=1;obj[GHz+'Radio']=true;return obj;}};var data_basic=create.basic();var data_security=create.security();var dhcpd=this.ifacelist.br0.services.br0.dhcpd;if(window.menu_postfix!="_ap"&&!dhcpd.enable){dhcpd.enable=true;query.push([somovdParams.CONFIG_ID_WAN_TEMP,{'br0':this.ifacelist.br0}]);}
if(wifi.apcli&&wifi.apcli.ApCliEnable==true){wifi.apcli.ApCliEnable=false;query.push([somovdParams.CONFIG_ID_WIFI_CLI,{'apcli':wifi.apcli}]);}
query.push([somovdParams.CONFIG_ID_WIFI_ADV,data_security]);query.push([somovdParams.CONFIG_ID_WIFI,data_basic]);$.extend(this.wifi,data_basic,data_security);if(wifi.Radio==false){var data_common=create.common();query.push([somovdParams.CONFIG_ID_WIFI_ONOFF,data_common]);$.extend(this.wifi,data_common);}
device.config.write(query,callback(this,function(answer){if(window.wifiWizard&&wifiWizard.quickMasterCtrl){wifiWizard.quickMasterCtrl.event("wifiready");}
else{this.emit("wzsaved.wifi",answer.rq[0]&&answer.rq[0].status==somovdParams.RPC_NEED_REBOOT);}
rootView.hideModalOverlay();}));}
this.updateView=function(phase){wizardWiFiRouter.superclass.updateView.apply(this,arguments);if(phase=="back"){this.child("security/authmode")
.cleanOptions()
.addOption('wzwifiOpen','OPEN')
.addOption('wzwifiClose','CLOSE')
.fieldchange();if(this.wifi){this.get("basic/ssid").val(this.wifi.mbssid[0].SSID);}
this.do_after();}}
this.update=function(wifi,ifacelist){if(wifi&&ifacelist){this.wifi=wifi;this.ifacelist=ifacelist;this.deep.updateView();}else{rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_WAN_TEMP],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.ifacelist=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.iface_names:{};this.deep.updateView();rootView.hideModalOverlay();}));}}
this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"authmode":var key=this.child("security/key");if(value!='OPEN')key.enable();else key.disable();break;}});}
extend(wizardWiFiRouter,nodeWizard);function wizardWiFiClient(){wizardWiFiClient.superclass.constructor.apply(this,arguments);this.wifi=null;this.step=null;this.hotspot=null;this.ifacelist=null;this.add(new node(),'scanner')
.child("scanner")
.add(new nodeCaption("clientMasterSectScanData"))
.add(new wifiHotspotList(),"hlist");this.add(new node(),'security')
.child("security")
.add(new nodeCaption("clientMasterSectAccessKey"))
.add(new nodetext("clientMasterSecurityKey",'',{mandatory:true,disabled:true,re:[callback(this,function(value){if(this.hotspot.security[0]=='WEP'||this.hotspot.security[0]=='SHARED'){return check_wifi_key(value)?null:"wifiWEPKeyWrong";}
return check_wifi_keypsk(value)?null:"wifiPSKKeyWrong";})]}),"key_for_access");this.add(new node(),'broadcast')
.child("broadcast")
.add(new nodeCaption("clientMasterBroadcast"))
.add(new nodeCheckBox("wifiBroadcastEnable",true),"enable");this.add(new node(),'finish')
.child("finish")
.add(new nodeCaption("clientMasterSectSummary"))
.add(new nodestatic("wzwifiMode"),"mode")
.add(new nodestatic("wzwifiHotspot"),"hotspot")
.add(new nodestatic("clientMasterBroadcast"),"broadcast")
.add(new nodestatic("securityAuthMode"),"authmode")
.add(new nodestatic("clientMasterSecurityKey"),"key")
.add(new nodestatic("basicChannel"),"channel")
.add(new nodestatic("securityWPAEnc"),"encrypt");_
if(!window.menu_postfix||window.menu_postfix&&window.menu_postfix!="_ap")
this.add(new nodeCaption("wzwifiAtt","wzwifiAttWAN"));this.updateModel=function(status){this.status=status;}
this.checkNext=function(){return(this.getActiveIndex()<this.children.length-1);}
this.checkPrevious=function(){return(this.getActiveIndex()>0);}
this.checkSave=function(){return(this.getActiveIndex()==this.children.length-1);}
this.next=function(){if(this.checkNext()&&this.step.deep.updateModel()&&this.do_before()){this.switchStep(this.getActiveIndex()+1);this.do_after();}}
this.previous=function(){if(this.checkPrevious()){this.switchStep(this.getActiveIndex()-1);this.do_after();}}
this.do_before=function(){var alias=this.step.getAlias();if(alias=='scanner'){var hlist=this.step.child("hlist");var key_for_access=this.child("security/key_for_access");var hotspot=this.hotspot=hlist.getActive();var key_for_access=this.child("security/key_for_access");if(!hotspot){alert(lng("clientMasterClientNotSelected"));return false;}else{if(hotspot.security[0]=="NONE"||hotspot.security[0]=="OPEN"){key_for_access.disable().val('');}else{key_for_access.enable();}}}
return true;}
this.do_after=function(){this.step=this.getActiveStep();var alias=this.step.getAlias();if(alias=='finish'){var is_open=this.hotspot.security[0]=='NONE';var stat=this.child("finish");stat.child("mode").val(lng("wzwifiClient"));stat.child("hotspot").val(this.hotspot.ssid+' ['+this.hotspot.bssid+']');stat.child("broadcast").val(this.child("broadcast/enable").val()?lng('yes'):lng('no'));stat.child("authmode").val((is_open)?lng("wzwifiOpen"):lng("wzwifiClose"));stat.child("key").val((is_open)?lng("wzwifiNo"):this.child("security/key_for_access").val());stat.child("channel").val(this.hotspot.channel);stat.child("encrypt").val((this.hotspot.security[1])?lng("wzwifiYes"):lng("wzwifiNo"));}
if(alias=='scanner'){var hlist=this.step.child("hlist");hlist.update();}}
this.save=function(){rootView.showModalOverlay();var hotspot=this.hotspot;var accesskey=this.child("security/key_for_access").val();var query=new Array();var wifi=this.wifi;var auth=hotspot.security[0];var data_apcli={'apcli':{'ApCliEnable':true,'ApCliSsid':hotspot.ssid,'ApCliBssid':hotspot.bssid,'ApCliDefaultKeyId':"1",'ApCliWPAPSK':'','ApCliKey1Str':'','ApCliKey2Str':'','ApCliKey3Str':'','ApCliKey4Str':''}};data_apcli.apcli.ApCliAuthMode=(hotspot.security[0]=="NONE"||hotspot.security[0]=="WEP")?"OPEN":hotspot.security[0];data_apcli.apcli.ApCliEncrypType=(hotspot.security[1])?hotspot.security[1]:"NONE";switch(hotspot.security[0]){case"WEP":data_apcli.apcli.ApCliKey1Str=data_apcli.apcli.ApCliKey2Str=data_apcli.apcli.ApCliKey3Str=data_apcli.apcli.ApCliKey4Str=accesskey;break;case"NONE":break;default:data_apcli.apcli.ApCliWPAPSK=accesskey;break;}
var dhcpd=this.ifacelist.br0.services.br0.dhcpd;if(window.menu_postfix=="_ap"){if(dhcpd.enable){dhcpd.enable=false;query.push([somovdParams.CONFIG_ID_WAN_TEMP,{'br0':this.ifacelist.br0}]);}}else{if(!dhcpd.enable){dhcpd.enable=true;query.push([somovdParams.CONFIG_ID_WAN_TEMP,{'br0':this.ifacelist.br0}]);}}
query.push([somovdParams.CONFIG_ID_WIFI_CLI,data_apcli]);$.extend(this.wifi,data_apcli);var data_basic={WifiBroadcast:this.child("broadcast/enable").val(),'Channel':hotspot.channel};$.extend(this.wifi,data_basic);query.push([somovdParams.CONFIG_ID_WIFI,data_basic]);device.config.write(query,callback(this,function(){this.emit("wzsaved.wifi");rootView.hideModalOverlay();}));}
this.updateView=function(phase){wizardWiFiClient.superclass.updateView.apply(this,arguments);if(phase=="back"){this.do_after();}}
this.update=function(wifi,ifacelist){if(wifi&&ifacelist){this.ifacelist=ifacelist;this.wifi=wifi;this.deep.updateView();}else{rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WIFI,callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();}));}}}
extend(wizardWiFiClient,nodeWizard);function wizardWiFiDisabler(){wizardWiFiDisabler.superclass.constructor.apply(this,arguments);this.wifi=null;this.step=null;this.add(new node(),'finish')
.child("finish")
.add(new nodeCaption("clientMasterSectSummary"))
.add(new nodestatic("wzwifiMode"),"mode");this.updateModel=function(status){this.status=status;}
this.checkNext=function(){return(this.getActiveIndex()<this.children.length-1);}
this.checkPrevious=function(){return(this.getActiveIndex()>0);}
this.checkSave=function(){return(this.getActiveIndex()==this.children.length-1);}
this.next=function(){if(this.checkNext()&&this.step.deep.updateModel()&&this.do_before()){this.switchStep(this.getActiveIndex()+1);this.do_after();}}
this.previous=function(){if(this.checkPrevious()){this.switchStep(this.getActiveIndex()-1);this.do_after();}}
this.do_before=function(){return true;}
this.do_after=function(){this.step=this.getActiveStep();}
this.save=function(){var wifi=this.wifi;var create={common:function(GHz){GHz=is.set(GHz)?GHz:'';var obj={};obj[GHz+'mbssidNum']=1;obj[GHz+'mbssidCur']=1;obj[GHz+'Radio']=false;return obj;}};if(wifi.Radio||parseInt(wifi.mbssidCur)!=1){rootView.showModalOverlay();var query=new Array();var data_common=create.common();query.push([somovdParams.CONFIG_ID_WIFI_ONOFF,data_common]);$.extend(this.wifi,data_common);device.config.write(query,callback(this,function(){this.emit("wzsaved.wifi");rootView.hideModalOverlay();}));}else{this.emit("wzsaved.wifi");}}
this.updateView=function(phase){wizardWiFiDisabler.superclass.updateView.apply(this,arguments);if(phase=="back"){this.child("finish/mode").val(lng("wzwifiDisableWiFi"));this.do_after();}}
this.update=function(wifi){if(wifi){this.wifi=wifi;this.deep.updateView();}else{rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WIFI,callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();}));}}}
extend(wizardWiFiDisabler,nodeWizard);function wizardWiFiMulti(){wizardWiFiMulti.superclass.constructor.apply(this,arguments);this.wifi=null;this.ifacelist=null;this.step=null;this.subwz=null;this.add(new node(),"mode")
.child("mode")
.add(new nodeCaption("wzwifiGenMode"));var radioOpt=[];radioOpt.push({name:"wzwifiRouter",value:"router",comment:"wzwifiDescRouter",checked:true});if(!hideFlag(somovdParams.CONFIG_ID_WIFI_CLI)){radioOpt.push({name:"wzwifiClient",value:"client",comment:"wzwifiDescClient"});}
if(!hideFlag("wifi.Radio")){radioOpt.push({name:"wzwifiDisable",value:"off",comment:"wzwifiDescDisable"});}
this.child("mode").add(new nodeOptionsRadio("wzwifiMode","",{options:radioOpt}),"mode");this.add(new wizardWiFiRouter(),"router");this.add(new wizardWiFiClient(),"client");this.add(new wizardWiFiDisabler(),"off");this.updateModel=function(status){this.status=status;}
this.checkNext=function(){return(this.step.checkNext)?this.step.checkNext():this.getActiveIndex()<this.children.length-1;}
this.checkPrevious=function(){return(this.getActiveIndex()>0);}
this.checkSave=function(){return(this.step.checkSave&&this.step.checkSave());}
this.next=function(){if(this.checkNext()&&this.do_before()){if(this.step.getAlias()=='mode'){this.subwz=this.child("mode/mode").val();this.switchStep(this.subwz);this.child(this.subwz).update(this.wifi,this.ifacelist);}else{this.step.next();}
this.do_after();}}
this.previous=function(){if(this.checkPrevious()){if(this.step instanceof nodeWizard){if(this.step.checkPrevious()){this.step.previous();}else{this.switchStep('mode');}}else{this.switchStep(this.subwz);}
this.do_after();}}
this.do_before=function(){return true;}
this.do_after=function(){this.step=this.getActiveStep();}
this.save=function(){if(this.checkSave())this.step.save();}
this.updateView=function(phase){wizardWiFiMulti.superclass.updateView.apply(this,arguments);if(phase=="back"){this.do_after();}}
this.update=function(wifi,ifacelist){if(wifi&&ifacelist){this.wifi=wifi;this.ifacelist=ifacelist;this.deep.updateView();}else{rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_WAN_TEMP],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.ifacelist=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.iface_names:{};this.deep.updateView();rootView.hideModalOverlay();}));}}
this.bind("wzsaved.wifi",function(e,needreboot){});}
extend(wizardWiFiMulti,nodeWizard);function pageWiFiWizard(){pageWiFiWizard.superclass.constructor.apply(this,arguments);this.wifi=null;this.ifacelist=null;var wizard=this.add(new wizardWiFiMulti(),"wizard").child("wizard");this.updateModel=function(status){this.status=status;}
this.do_logic=function(){if(wizard.checkPrevious()){this.getButton("button_prev").show();}else{this.getButton("button_prev").hide();}
if(wizard.checkNext()){this.getButton("button_next").show();}else{this.getButton("button_next").hide();}
if(wizard.checkSave()){this.getButton("button_save").show();}else{this.getButton("button_save").hide();}}
this.next=function(){wizard.next();this.do_logic();}
this.previous=function(){wizard.previous();this.do_logic();}
this.save=function(){wizard.save();}
this.reboot=function(){rootCtrl.event("cfgsaverebootrq");}
this.updateView=function(phase){pageWiFiWizard.superclass.updateView.apply(this,arguments);if(phase=="back"){this.cleanButtonBar()
.addButton("button_prev")
.getButton("button_prev")
.bind("click.button",callback(this,this.previous)).hide();this.addButton("button_next")
.getButton("button_next")
.bind("click.button",callback(this,this.next)).hide();this.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,this.save)).hide();this.do_logic();}}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_WAN_TEMP],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.ifacelist=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.iface_names:{};this.deep.updateView();wizard.update(this.wifi,this.ifacelist);rootView.hideModalOverlay();}));});this.bind("wzsaved.wifi",function(e,needreboot){if(window.wifiWizard&&wifiWizard.quickMasterCtrl){wifiWizard.quickMasterCtrl.event("wifiready");}
else{this.getButton("button_prev").hide();this.getButton("button_next").hide();this.getButton("button_save").hide();if(needreboot){}else{alert(lng("wzwifiSaveOk"));document.location.href="index.cgi";}}});}
extend(pageWiFiWizard,node);function pageWiFiRepeaterWizard(){pageWiFiRepeaterWizard.superclass.constructor.apply(this,arguments);this.wifi=null;this.ifacelist=null;var wizard=this.add(new wizardWiFiRepeater(),"wizard").child("wizard");this.updateModel=function(status){this.status=status;}
this.do_logic=function(){if(wizard.checkPrevious()){this.getButton("button_prev").show();this.getButton("button_cancel").hide();}else{this.getButton("button_prev").hide();this.getButton("button_cancel").show();}
if(wizard.checkNext()){this.getButton("button_next").show();}else{this.getButton("button_next").hide();}
if(wizard.checkSave()){this.getButton("button_save").show();}else{this.getButton("button_save").hide();}}
this.next=function(){wizard.next();this.do_logic();}
this.previous=function(){wizard.previous();this.do_logic();}
this.save=function(){wizard.save();}
this.reboot=function(){rootCtrl.event("cfgsaverebootrq");}
this.updateView=function(phase){pageWiFiRepeaterWizard.superclass.updateView.apply(this,arguments);if(phase=="back"){this.cleanButtonBar()
.addButton("button_prev")
.getButton("button_prev")
.bind("click.button",callback(this,this.previous)).hide();this.addButton("button_next")
.getButton("button_next")
.bind("click.button",callback(this,this.next)).hide();this.addButton("button_cancel")
.getButton("button_cancel")
.bind("click.button",callback(this,function(){document.location.href="index.cgi"})).hide();this.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,this.save)).hide();this.do_logic();}}
this.bind("updaterq",function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_WAN_TEMP],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.ifacelist=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident.iface_names:{};this.deep.updateView();wizard.update(this.wifi,this.ifacelist);rootView.hideModalOverlay();}));});this.bind("wzsaved.wifi",function(e,needreboot){if(window.wifiWizard&&wifiWizard.quickMasterCtrl){wifiWizard.quickMasterCtrl.event("wifiready");}
else{this.getButton("button_prev").hide();this.getButton("button_next").hide();this.getButton("button_save").hide();if(needreboot){}else{alert(lng("wzwifiSaveOk"));document.location.href="index.cgi";}}});}
extend(pageWiFiRepeaterWizard,node);function bestAuthMode(AuthAvailable){function find(value){for(var i=AuthAvailable.length;i>0;i--){var auth=AuthAvailable[i-1];if(auth.Id.toUpperCase().search(value.toUpperCase())>=0){return auth.Id;}}
return null;}
var bestlist=['WPAPSKWPA2PSK','WPA2PSK','WPAPSK'];for(var i=0;i<bestlist.length;i++){var id=find(bestlist[i]);if(is.set(id)){return id;}}
return'WPAPSK';}
function wifiWEPForm(){wifiWEPForm.superclass.constructor.apply(this,arguments);var wep_keys={"1":"0","2":"1","3":"2","4":"3"};var checkWEP=callback(this,function(value){var hexKeys=keys.child("key_type").val();var status=null;var wepBit=keys.child("key_bit").val();var wepCheck=check_wifi_key_ex(value,hexKeys,wepBit);if(!wepCheck){status=hexKeys?("wifiWEPKeyWrongHEXSize"+wepBit):("wifiWEPKeyWrong"+wepBit);}
if((!status&&hexKeys&&!check_wifi_key_hex(value))||value.match(/\s/)){status="wifiWEPKeyWrongHEX";}
return status;});this.add(new nodeCaption("securitySectWEP"))
.add(new nodeCheckBox("securityWEP",false),"wep_encr")
.add(new node({hidden:true}),"keys");var keys=this.child("keys")
.add(new nodeSelect("securityWEPKeyID"),"key_id")
.add(new nodeCheckBox("securityWEPKeyHEX",false),"key_type")
.add(new nodeSelect("securityWEPKeyLength"),"key_bit")
.add(new nodetext(lng("securityWEPKey")+" (1)",'',{mandatory:true,re:[checkWEP]}),"key1");keys.child("key_bit").addOption('64bit',64);keys.child("key_bit").addOption('128bit',128);for(var i=2;i<=4;i++){keys.add(new nodetext(lng("securityWEPKey")+" ("+i+")",'',{mandatory:true,re:[checkWEP]}),"key"+i);}
this.updateView=function(phase){wifiWEPForm.superclass.updateView.apply(this,arguments);if(phase=="back"){var key_id=keys.child("key_id").cleanOptions();for(var i in wep_keys){key_id.addOption(i,wep_keys[i]);}}}
this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"wep_encr":if(value)keys.show();else keys.hide();break;}});}
extend(wifiWEPForm,node);function wifiWPAForm(){wifiWPAForm.superclass.constructor.apply(this,arguments);var wpa_encrypts={"TKIP":"TKIP","AES":"AES","TKIP+AES":"TKIPAES"};this.add(new nodeCaption("securitySectWPA"))
.add(new nodeSelect("securityWPAEnc"),"wpa_enc")
.add(new nodenum("securityWPARen",3600,{minval:0,maxval:1000000,mandatory:true}),"wpa_ren");this.setEncryption=function(exceptions){if(!is.array(exceptions))exceptions=new Array();var wpa_enc=this.child("wpa_enc").cleanOptions();for(var i in wpa_encrypts){if($.inArray(i,exceptions)==-1)
wpa_enc.addOption(i,wpa_encrypts[i]);}
wpa_enc.correctValue();}
this.updateView=function(phase){wifiWPAForm.superclass.updateView.apply(this,arguments);if(phase=="back"){this.setEncryption();}}}
extend(wifiWPAForm,node);function wifiSecurityForm(GHz){wifiSecurityForm.superclass.constructor.apply(this,Array.prototype.slice.call(arguments,1));this.wifi=null;this.mbssidIndex=null;this.modeN=false;this.GHz=is.set(GHz)?GHz:'';this.add(new nodeSelect("securityAuthMode",'OPEN'),"netaut")
.add(new nodetext("securityKeyPSK",'',{hidden:true,mandatory:true,re:[callback(this,function(value){return check_wifi_keypsk(value)?null:"wifiPSKKeyWrong";})]}),"key_psk")
.add(new nodeCheckBox("securityPreAuth",false,{hidden:true}),"pre_auth")
.add(new wifiWEPForm({hidden:true}),"wep");var wep=this.child("wep");var keys=wep.child("keys");var radius=this.add(new node({hidden:true}),"radius")
.child("radius")
.add(new nodeCaption("securitySectRadius"))
.add(new nodeip("ip_address",'192.168.0.254',{mandatory:true}),"rad_ip")
.add(new nodenum("port",1812,{minval:1,maxval:65535,mandatory:true}),"rad_port")
.add(new nodetext("securityRadiusKey",'dlink',{mandatory:true}),"rad_key")
var wpa=this.add(new wifiWPAForm({hidden:true}),"wpa").child("wpa");this.updateModel=function(status){this.status=status;}
this.updateWPAEncryption=function(){var auth=this.child("netaut").val();var exceptions=new Array();if(this.modeN){exceptions=["TKIP+AES","TKIP"];}
switch(auth){case"WPA":if(!this.modeN)exceptions=["TKIP+AES","AES"];break;case"WPA2":case"WPA1WPA2":if(!this.modeN&&auth=="WPA2")exceptions=["TKIP+AES","TKIP"];if(auth=="WPA1WPA2")exceptions=["AES","TKIP"];break;case"WPAPSKWPA2PSK":case"WPA2PSK":if(auth=="WPAPSKWPA2PSK")exceptions=["AES","TKIP"];break;}
wpa.setEncryption(exceptions);}
this.updateView=function(phase){wifiSecurityForm.superclass.updateView.apply(this,arguments);if(phase=="back"){if(this.wifi){var wifi=this.wifi;var mbssidIndex=(this.mbssidIndex)?this.mbssidIndex:wifi[this.GHz+'mbssidCur']-1;var mbssid=this.wifi[this.GHz+'mbssid'][mbssidIndex];this.wifi[this.GHz+'mbssid'][mbssidIndex]=mbssid;var wep_encr=wep.child("wep_encr");var wpa_enc=wpa.child("wpa_enc");if(wifi[this.GHz+'WirelessMode']&&parseInt(wifi[this.GHz+'WirelessMode'])>=6){this.modeN=true;wep_encr.val(false);if(mbssid.AuthMode=="OPEN-IEEE8021X"||mbssid.AuthMode=="SHARED"||mbssid.AuthMode=="WEPAUTO"){mbssid.AuthMode="OPEN";}else{}}else{this.modeN=false;}
var netaut=this.child("netaut").cleanOptions();var exceptions=(this.modeN)?["Open-IEEE8021X","Shared","WEPAUTO"]:[];for(var i in wifi.AuthAvailable){if($.inArray(wifi.AuthAvailable[i].Name,exceptions)==-1)
netaut.addOption(wifi.AuthAvailable[i].Name,wifi.AuthAvailable[i].Id);}
netaut.val(mbssid.AuthMode).fieldchange();this.updateWPAEncryption();if(mbssid.EncrypType=="WEP"||(mbssid.AuthMode=="SHARED"||mbssid.AuthMode=="WEPAUTO")){wep_encr.val(true).fieldchange();}else{wep_encr.val(false).fieldchange();if(mbssid.EncrypType=="TKIP"||mbssid.EncrypType=="AES"||mbssid.EncrypType=="TKIPAES"){wpa_enc.val(mbssid.EncrypType).correctValue();}}
if(this.modeN)wep.hide();keys.child("key_type").val((mbssid.Key1Type!="")?mbssid.Key1Type=="0":false);keys.child("key1").val(mbssid.Key1Str);var multipler=1;if(keys.child("key_type").val()){multipler=2;}
var keylen=keys.child('key1').val().length;if(keylen>=6*multipler){keys.child('key_bit').val(128);}else{keys.child('key_bit').val(64);}
keys.child("key2").val(mbssid.Key2Str);keys.child("key3").val(mbssid.Key3Str);keys.child("key4").val(mbssid.Key4Str);keys.child("key_id").val(mbssid.DefaultKeyID);radius.child("rad_ip").val(wifi[this.GHz+'RADIUS_Server']);radius.child("rad_port").val(wifi[this.GHz+'RADIUS_Port']);radius.child("rad_key").val(wifi[this.GHz+'RADIUS_Key']);this.child("key_psk").val(mbssid.WPAPSK);this.child("pre_auth").val(mbssid.PreAuth);wpa.child("wpa_ren").val(wifi[this.GHz+'RekeyInterval']);}}}
this.save=function(cb){var mbssidIndex=(this.mbssidIndex)?this.mbssidIndex:this.wifi[this.GHz+'mbssidCur']-1;var auth=this.child("netaut").val();var key_type=(keys.child("key_type").val())?"0":"1";var data={};data[this.GHz+'mbssid']=this.wifi[this.GHz+'mbssid'];data[this.GHz+'mbssid'][mbssidIndex]={'AuthMode':auth,'WPAPSK':this.child("key_psk").val(),'Key1Str':keys.child("key1").val(),'Key1Type':key_type,'Key2Str':keys.child("key2").val(),'Key2Type':key_type,'Key3Str':keys.child("key3").val(),'Key3Type':key_type,'Key4Str':keys.child("key4").val(),'Key4Type':key_type,'DefaultKeyID':keys.child("key_id").val(),'PreAuth':this.child("pre_auth").val(),'EncrypType':(auth!="OPEN"&&auth!="OPEN-IEEE8021X"&&auth!="SHARED"&&auth!="WEPAUTO")?wpa.child("wpa_enc").val():(wep.child("wep_encr").val())?"WEP":"NONE"};data[this.GHz+'RADIUS_Server']=radius.child("rad_ip").val();data[this.GHz+'RADIUS_Port']=radius.child("rad_port").val().toString();data[this.GHz+'RADIUS_Key']=radius.child("rad_key").val();data[this.GHz+'RekeyInterval']=wpa.child("wpa_ren").val().toString();$.extend(this.wifi,data);if(auth=="OPEN"&&data[this.GHz+'mbssid'][mbssidIndex].EncrypType=="NONE"){alert(lng('securityAuthModeWarningOpen'));}
device.config.write(somovdParams.CONFIG_ID_WIFI_ADV,data,cb);}
this.autosave=function(autoupdate){if(this.deep.updateModel()){rootView.showModalOverlay();this.save(callback(this,function(autoupdate){rootView.hideModalOverlay();if(autoupdate)this.update();},autoupdate));}}
this.update=function(wifi){if(wifi){this.wifi=wifi;this.deep.updateView();}else{rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WIFI,callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();rootView.hideModalOverlay();}));}}
this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"netaut":wep.hide();wpa.hide();var key_psk=this.child("key_psk").hide();var pre_auth=this.child("pre_auth").hide();var wep_encr=wep.child("wep_encr");radius.hide();switch(value){case"OPEN":if(!this.modeN){wep_encr.enable().val(false).fieldchange();wep.show();}
break;case"OPEN-IEEE8021X":wep_encr.enable();wep.show();radius.show();break;case"SHARED":case"WEPAUTO":wep_encr.disable().val(true).fieldchange();wep.show();break;case"WPA":radius.show();wpa.show();break;case"WPA2":case"WPA1WPA2":radius.show();pre_auth.show();wpa.show();break;case"WPAPSKWPA2PSK":case"WPA2PSK":key_psk.show();pre_auth.show();wpa.show();break;case"WPAPSK":key_psk.show();wpa.show();break;}
this.updateWPAEncryption();break;}});}
extend(wifiSecurityForm,node);function pageWiFiSecurity(GHz){pageWiFiSecurity.superclass.constructor.apply(this,Array.prototype.slice.call(arguments,1));var basic=this.add(new wifiSecurityForm(GHz),"basic").child("basic");this.updateView=function(phase){pageWiFiSecurity.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){basic.autosave(true);}));}}
this.bind("updaterq",function(){this.deep.updateView();basic.update();});}
extend(pageWiFiSecurity,node);function pageWiFiStationList(){pageWiFiStationList.superclass.constructor.call(this);this.wifi=null;this.stations=null;this.$grid=null;this.updateView=function(phase){pageWiFiStationList.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar().$box.empty();var table=[];var params=this.wifi.StaListParamsAvailable;for(var i=0;i<params.length;i++){table.push({index:params[i],name:"staList"+params[i]});}
this.$grid=this.$box.html("\
    <div class='grid rm'></div>\
   ").find('.grid').lightUIGrid(table,this.stations.length,{selectable:true});for(var i=0;this.stations&&i<this.stations.length;i++){for(var j=0;j<params.length;j++){var $row=this.$grid.row(i);$row.col(params[j]).fieldval(this.stations[i][params[j]]);}}
this.addButton("stalstDisas")
.getButton("stalstDisas")
.bind("click.button",callback(this,function(){var selection=this.$grid.selection();if(selection.length){var maclist=new Array();for(var i=0;i<selection.length;i++){var $row=this.$grid.row(i);if($row.col("mac"))
maclist.push($row.col("mac").fieldval());}
selection.moveTo();this.disconnect(maclist);}else{alert(lng("staListForDelEmpty"));}}));this.addButton("refresh")
.getButton("refresh")
.bind("click.button",callback(this,function(){this.update();}));}}
this.disconnect=function(maclist){rootView.showModalOverlay();device.config.write(somovdParams.CONFIG_ID_WIFI_DISASSOC,maclist,callback(this,function(){rootView.hideModalOverlay();}));}
this.update=function(){rootView.showModalOverlay();device.config.read([somovdParams.CONFIG_ID_WIFI,somovdParams.CONFIG_ID_WIFI_STATION],callback(this,function(data){this.wifi=(is.RPC_SUCCESS(data.rq[0]))?data.rq[0].resident:null;this.stations=(is.RPC_SUCCESS(data.rq[1]))?data.rq[1].resident:null;this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);}
extend(pageWiFiStationList,node);function wifiWMMGrid(mode){wifiWMMGrid.superclass.constructor.apply(this,Array.prototype.slice.call(arguments,1));this.settings=null;this.$grid=null;this.mode=mode;var valset1_2={"1":1,"3":2};var valset1_3={"1":1,"3":2,"7":3};var valset1_4={"1":1,"3":2,"7":3,"15":4};var valset1_6={"1":1,"3":2,"7":3,"15":4,"31":5,"63":6};var valset1_10={"1":1,"3":2,"7":3,"15":4,"31":5,"63":6,"127":7,"255":8,"511":9,"1023":10};var header=[{index:"ac",name:"AC"},{index:"aifsn",name:"Aifsn (1~15)"},{index:"cwmin",name:"CWMin"},{index:"cwmax",name:"CWMax"},{index:"txop",name:"Txop"},{index:"acm",name:"ACM"}];if(this.mode=='ap'){header.push({index:"ack",name:"Ack"});}
this.updateModel=function(status){status.error&=!this.$grid.cleanErrors().checkMandatory();this.status=status;}
this.updateView=function(phase){wifiWMMGrid.superclass.updateView.apply(this,arguments);if(phase=="back"){this.$grid=this.$box.empty().html("\
    <div class='grid'></div>\
   ").find('.grid').lightUIGrid(header,this.settings?this.settings.length:0);this.$grid.colEditable("aifsn","number",{mandatory:true,minval:1,maxval:15})
.colEditable("txop","number",{mandatory:true,minval:0,maxval:9999})
.colEditable("acm","select",{options:{'wmmOff':"0",'wmmOn':"1"}});if(this.mode=='ap'){this.$grid.colEditable("ack","select",{options:{'wmmOff':"0",'wmmOn':"1"}});}
for(var i=0;this.settings&&i<this.settings.length;i++){var settings=this.settings[i];var $row=this.$grid.row(i);switch(i){case 0:$row.col("ac").fieldval("AC_BK");$row.col("cwmin").editable("select",{options:valset1_4});$row.col("cwmax").editable("select",{options:valset1_10});break;case 1:$row.col("ac").fieldval("AC_BE");$row.col("cwmin").editable("select",{options:valset1_4});$row.col("cwmax").editable("select",{options:(this.mode=='ap')?valset1_6:valset1_10});break;case 2:$row.col("ac").fieldval("AC_VI");$row.col("cwmin").editable("select",{options:valset1_3});$row.col("cwmax").editable("select",{options:valset1_4});break;case 3:$row.col("ac").fieldval("AC_VO");$row.col("cwmin").editable("select",{options:valset1_2});$row.col("cwmax").editable("select",{options:valset1_3});break;}
$row.col("aifsn").fieldval(settings.aifsn);$row.col("cwmin").fieldval(settings.cwmin);$row.col("cwmax").fieldval(settings.cwmax);$row.col("txop").fieldval(settings.txop);$row.col("acm").fieldval(settings.acm);if(this.mode=='ap'){$row.col("ack").fieldval(settings.ack);}}}}
this.data=function(){this.deep.updateModel();if(!this.status.error){var settings=new Array();for(var i=0;i<this.$grid.nrow();i++){var $row=this.$grid.row(i);var obj={'aifsn':$row.col("aifsn").fieldval(),'cwmin':$row.col("cwmin").fieldval(),'cwmax':$row.col("cwmax").fieldval(),'txop':$row.col("txop").fieldval(),'acm':$row.col("acm").fieldval()};if(this.mode=='ap'){obj['ack']=$row.col("ack").fieldval();}
settings.push(obj);}
return settings;}
return null;}
this.update=function(settings){this.settings=settings;this.deep.updateView();}}
extend(wifiWMMGrid,node);function pageWiFiWMM(){pageWiFiWMM.superclass.constructor.call(this);this.wmm=null;this.add(new nodeCheckBox("wmmEnable",false),"enable")
.add(new node({hidden:true}),"settings")
.child("settings")
.add(new nodeCaption("wmmSectAP"))
.add(new wifiWMMGrid("ap"),"ap")
.add(new nodeCaption("wmmSectSta"))
.add(new wifiWMMGrid("sta"),"sta")
this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageWiFiWMM.superclass.updateView.apply(this,arguments);if(phase=="forward"){this.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){var ap=this.child("settings/ap").data();var sta=this.child("settings/sta").data();if(ap&&sta){this.save(this.child("enable").val(),ap,sta);}}));}}
this.save=function(enable,ap,sta){rootView.showModalOverlay();this.wmm={'WmmCapable':enable,'ap':(enable)?ap:this.wmm.ap,'sta':(enable)?sta:this.wmm.sta};device.config.write(somovdParams.CONFIG_ID_WIFI_WMM,this.wmm,callback(this,function(){this.update();}));}
this.update=function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WIFI_WMM,callback(this,function(data){this.wmm=(is.RPC_SUCCESS(data))?data.resident:null;this.deep.updateView();if(this.wmm){this.child("enable").val(this.wmm.WmmCapable).fieldchange();this.child("settings/ap").update(this.wmm.ap);this.child("settings/sta").update(this.wmm.sta);}
rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"enable":var settings=this.child("settings");if(value)settings.show();else settings.hide();break;}});}
extend(pageWiFiWMM,node);function pageWiFiWPS(GHz){pageWiFiWPS.superclass.constructor.call(this);this.wps=null;this.GHz=is.set(GHz)?GHz:'';var methods={"PBC":"PBC","PIN":"PIN"};var general=this.add(new node(),"general")
.child("general")
.add(new nodeCaption("wpsSectEnable"))
.add(new nodeCheckBox("wpsEnable",false),"enable");var info=this.add(new node({hidden:true}),"info")
.child("info")
.add(new nodeCaption("wpsSectInfo"))
.add(new nodestatic("wpsPinDefault",'',{}),"def_pin")
.add(new nodestatic("wpsStatus"),"status")
.add(new nodestatic("SSID"),"ssid")
.add(new nodestatic("wpsAuth"),"auth")
.add(new nodestatic("wpsEncr"),"encr")
.add(new nodestatic("wpsEncrKey"),"encr_key");var connect=this.add(new node({hidden:true}),"connect")
.child("connect")
.add(new nodeCaption("wpsSectConnect"));connect.add(new nodeSelect("wpsMethod"),"method")
.add(new nodetext("wpsPin",'',{hidden:true,mandatory:true,re:[function(value){value=value.replace(/(\-|\ )/g,'');if(!(new RegExp("^[0-9]+(\.?[0-9]+|[0-9]*)$").test(value)))return"numNaN";if(value.length!=4&&value.length!=8)return"wpsPinError";if(value.length==8){var pin=parseInt(value);var accum=0;accum+=3*(parseInt(pin/10000000)%10);accum+=1*(parseInt(pin/1000000)%10);accum+=3*(parseInt(pin/100000)%10);accum+=1*(parseInt(pin/10000)%10);accum+=3*(parseInt(pin/1000)%10);accum+=1*(parseInt(pin/100)%10);accum+=3*(parseInt(pin/10)%10);accum+=1*(parseInt(pin/1)%10);if((accum%10)!=0)return"wpsPinError";}
return null;}]}),"pin");this.wps_on_off=function(value){if(value){info.show();connect.show();}else{info.hide();connect.hide();}}
this.updateModel=function(status){this.status=status;}
this.updateView=function(phase){pageWiFiWPS.superclass.updateView.apply(this,arguments);if(phase=="back"){general.cleanButtonBar()
.addButton("button_save")
.getButton("button_save")
.bind("click.button",callback(this,function(){this.enable(this.child("general/enable").val());}));info.cleanButtonBar()
.addButton("refresh")
.getButton("refresh")
.bind("click.button",callback(this,function(){this.update();}));info.addButton("wpsReset")
.getButton("wpsReset")
.bind("click.button",callback(this,function(){this.reset();}));connect.cleanButtonBar()
.addButton("wpsConnect")
.getButton("wpsConnect")
.bind("click.button",callback(this,function(){if(this.deep.updateModel()){this.connect(connect.child("method").val(),connect.child("pin").val());}}));var method=connect.child("method").cleanOptions();for(var i in methods){method.addOption(i,methods[i]);}
var wps=null;var wds=null;var data=this.data;if(is.set(this.data)&&is.set(this.data.resident[this.GHz+'wps'])){wps=this.data.resident[this.GHz+'wps'];}
if(is.set(this.data)&&is.set(this.data.resident[this.GHz+'wds'])){wds=this.data.resident[this.GHz+'wds'];}
if(wps){this.wps_on_off(wps.WscEnable);general.child("enable").val(wps.WscEnable&&wps.WscCheck);if(wps.WscEnable){info.child("status").val(wps.WscConfigured?lng("wpsConf"):lng("wpsUnconf"));if(is.set(wps.WscSSID)){info.child("ssid").val(wps.WscSSID);}else{info.child("ssid").val(data.resident[this.GHz+'mbssid'][0].SSID);}
info.child("def_pin").val(wps.WscDefaultPin);var authAvailableCache=[];for(var i=0;i<data.resident.AuthAvailable.length;i++){authAvailableCache[data.resident.AuthAvailable[i].Id]=data.resident.AuthAvailable[i].Name;}
if(is.set(wps.WscAuth)){info.child("auth").val(wps.WscAuth);}else{for(var i=0;i<data.resident.AuthAvailable.length;i++){if(data.resident.AuthAvailable[i].Id==data.resident[this.GHz+'mbssid'][0].AuthMode){info.child("auth").val(data.resident.AuthAvailable[i].Name);break;}}}
var wpa_encrypts={"TKIP":"TKIP","AES":"AES","TKIPAES":"TKIP+AES"};if(is.set(wps.WscEncrypType)){info.child("encr").val(wps.WscEncrypType);}else{if(data.resident[this.GHz+'mbssid'][0].EncrypType!="NONE"){info.child("encr").val(wpa_encrypts[data.resident[this.GHz+'mbssid'][0].EncrypType]);}else{info.child("encr").val(lng('not_appointed'));}}
if(is.set(wps.WscEncKey)){info.child("encr_key").val(wps.WscEncKey);}else{if(data.resident[this.GHz+'mbssid'][0].EncrypType!="NONE"){info.child("encr_key").val(data.resident[this.GHz+'mbssid'][0].WPAPSK);}else{info.child("encr_key").val(lng('not_appointed'));}}}}
if((wds&&wds.WdsEnable!="0")||(wps&&!wps.WscCheck)){general.child("enable").disable();general.getButton("button_save").disable();}else{general.child("enable").enable();general.getButton("button_save").enable();}}}
this.reset=function(){rootView.showModalOverlay();var data={};data[this.GHz+'wps']={'WscEnable':true,'WscConfigured':false};device.config.write(somovdParams.CONFIG_ID_WIFI_WPS,data,callback(this,function(){this.update();}));}
this.enable=function(enable){rootView.showModalOverlay();var data={};data[this.GHz+'wps']={'WscEnable':enable};device.config.write(somovdParams.CONFIG_ID_WIFI_WPS,data,callback(this,function(){this.update();}));}
this.connect=function(method,pin){rootView.showModalOverlay();var data={};data[this.GHz+'wps']={'WscEnable':true,'WscMethod':method};if(method=='PIN'){data[this.GHz+'wps'].WscPin=pin;}
device.config.write(somovdParams.CONFIG_ID_WIFI_WPS_CONNECT,data,callback(this,function(){this.update();}));}
this.update=function(){rootView.showModalOverlay();device.config.read(somovdParams.CONFIG_ID_WIFI,callback(this,function(data){this.data=(is.RPC_SUCCESS(data))?data:null;this.deep.updateView();rootView.hideModalOverlay();}));}
this.bind("updaterq",this.update);this.bind("fieldchange",function(status,value){switch(status.target.getAlias()){case"method":var pin=connect.child("pin");if(value=='PIN')pin.show();else pin.hide();break;}});}
extend(pageWiFiWPS,node);
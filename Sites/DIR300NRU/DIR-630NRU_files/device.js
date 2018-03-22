var CGI_URL="http://"+document.location.host+'/index.cgi';var device=new function(){var self=this;var $$={};var UINT_MAX=4294967295;$$.state={hold:false,available:true,stripping:false};$$.tasks={list:new Array(),queue:new Array(),limit:UINT_MAX};$$.subscribers=new Array();$$.filters=new Array();$$.ID={__N:0,get:function(){return++this.__N;}};$$.authData={};this.signal=$$.signal={SUCCESS:'s_success',PROCESS:'s_process',ERROR:'s_error',LOCK:'s_lock',AVAILABLE:'s_available',ABORT:'s_abort'};this.notify=$$.notify={AUTH:'n_auth',PASSWD:'n_passwd',REBOOT:'n_reboot',SAVE:'n_save',RESET:'n_reset',PIN:'n_pin',SMS:'n_sms',MODE:'n_mode',UPDATE:'n_update',MOUNT:'n_mount'};this.lock=function(__lock){if(is.bool(__lock)){$$.state.hold=__lock;$$.emit(this.signal.LOCK,__lock);return this;}
return $$.state.hold;}
this.strip=function(__stripping){if(is.bool(__stripping)){$$.state.stripping=__stripping;return this;}
return $$.state.stripping;}
this.available=function(){return $$.state.available;}
this.count=function(){return $$.tasks.list.length+$$.tasks.queue.length;}
this.limit=function(__length){if(is.number(__length)){$$.tasks.limit=(__length>0)?__length:UINT_MAX;return this;}
return($$.tasks.limit==UINT_MAX)?0:$$.tasks.limit;}
$$.parseData=function(__data){var answer=null;if(is.set(__data)){try{eval('answer = '+__data);if(is.object(answer)&&is.set(answer.deviceResponse)){this.emit(this.notify.AUTH,is.bool(answer.auth)&&answer.auth==true);this.emit(this.notify.PASSWD,is.number(answer.passwStatus)&&answer.passwStatus==somovdParams.RPC_NEED_CHANGE_PASS);this.emit(this.notify.REBOOT,is.number(answer.getConfigStatus)&&answer.getConfigStatus==somovdParams.RPC_NEED_REBOOT);this.emit(this.notify.SAVE,is.number(answer.getConfigStatus)&&answer.getConfigStatus==somovdParams.RPC_NEED_SAVE);this.emit(this.notify.RESET,is.number(answer.needReset)&&answer.needReset==somovdParams.RPC_NEED_RESET);this.emit(this.notify.PIN,is.number(answer.pinstatus)&&answer.pinstatus>0&&answer.pinstatus<5,answer.pinstatus);this.emit(this.notify.SMS,is.number(answer.newSmsStatus)&&answer.newSmsStatus==somovdParams.RPC_OK);this.emit(this.notify.MODE,is.set(answer.deviceModeChange));this.emit(this.notify.UPDATE,is.object(answer.autoupdate)&&answer.autoupdate.enable&&answer.autoupdate.available,answer.autoupdate);var mounted=false;if(answer.usb_volume&&answer.usb_volume.usb_storage){for(var i in answer.usb_volume.usb_storage){mounted=true;break;}}
if(this.mounted!=mounted){this.mounted=mounted;this.emit(this.notify.MOUNT,mounted,mounted?answer.usb_volume.usb_storage:{});}}}
catch(e){answer={baddata:true};}}
return answer;}
$$.prepareData=function(__data){var data='';if(is.object(__data)){var auth=$$.authData[__data.res_config_id];if(auth){data+="onceauth=y"
+"&login="+auth.login
+"&password="+auth.password
+"&";}
var value;for(var key in __data){if(is.string(__data[key])){value=escape(__data[key]);}else if(is.object(__data[key])){value=$.toJSON(escape(__data[key]));}else{value=__data[key];}
data+=key+'='+value+'&';}}else if(is.string(__data)){data=__data;}
return data;}
this.request=function(__url,__type,__data,__callback,__id){if(!$$.state.hold&&$$.filtering(__url,__type,__data,__callback)){if($$.state.stripping){var __dataTemp=$.toJSON(__data);for(var i=0;i<$$.tasks.list.length;i++){if($$.tasks.list[i].stamp[3]===__callback&&$.toJSON($$.tasks.list[i].stamp[2])==__dataTemp){return $$.tasks.list[i].stamp[4];}}
for(var i=0;i<$$.tasks.queue.length;i++){if($$.tasks.queue[i][3]===__callback&&$.toJSON($$.tasks.queue.list[i][2])==__dataTemp){return $$.tasks.queue[i][4];}}}
var argv=Array.prototype.slice.call(arguments);if(is.unset(__id)){__id=argv[4]=$$.ID.get();}
if($$.tasks.list.length<$$.tasks.limit){var xhr=$.ajax({url:__url,type:__type,data:$$.prepareData(__data),cache:false,timeout:180000,context:this,global:false,beforeSend:function(jqXHR,settings){jqXHR.stamp=argv;jqXHR.callback=__callback;$$.tasks.list.push(jqXHR);$$.emit(this.signal.PROCESS,true,jqXHR);},success:function(data,textStatus,jqXHR){jqXHR.answer=$$.parseData(data);},error:function(jqXHR,textStatus,errorThrown){jqXHR.answer=null;},complete:function(jqXHR,textStatus){$$.tasks.list.splice(indexOf($$.tasks.list,jqXHR),1);$$.state.available=!(textStatus=='error'&&jqXHR.readyState==0&&jqXHR.status==0);$$.emit(this.signal.PROCESS,false,jqXHR);$$.emit(this.signal.AVAILABLE,$$.state.available);$$.emit(this.signal.ERROR,textStatus=='error');$$.emit(this.signal.ABORT,textStatus=='abort');while($$.tasks.queue.length>0&&$$.tasks.list.length<$$.tasks.limit){this.request.apply(this,$$.tasks.queue.shift());}
switch(textStatus){case'success':$$.emit(this.signal.SUCCESS,jqXHR.answer);if(is.func(jqXHR.callback))jqXHR.callback(jqXHR.answer);break;case'error':break;case'timeout':break;case'abort':break;case'parsererror':break;case'notmodified':break;}}});}else{$$.tasks.queue.push(argv);}
return __id;}
return null;}
this.stop=function(__id){if(is.set(__id)){for(var i=0;i<$$.tasks.queue.length;){if($$.tasks.queue[i][4]===__id){$$.tasks.queue[i].splice(i,1);}else i++;}
for(var i=0;i<$$.tasks.list.length;){if($$.tasks.list[i].stamp[4]===__id){$$.tasks.list[i].abort();}else i++;}}else{$$.tasks.queue=new Array();while($$.tasks.list.length){$$.tasks.list[0].abort();}}
return this;}
this.hook=function(event,func){if(is.string(event)&&is.func(func)){if(is.unset($$.subscribers[event]))$$.subscribers[event]=new Array();$$.subscribers[event].push(func);}
return this;}
this.unhook=function(event,func){if(is.string(event)){if(is.set($$.subscribers[event])){if(is.set(func)){for(var i=0;i<$$.subscribers[event].length;){if($$.subscribers[event][i]===func){$$.subscribers[event].splice(i,1);}else i++;}}else{delete $$.subscribers[event];}}}
return this;}
this.filter=function(func){if(is.set(func)){$$.filters.push(func);}
return this;}
this.unfilter=function(func){if(is.set(func)){for(var i=0;i<$$.filters.length;){if($$.filters[i]===func){$$.filters.splice(i,1);}else i++;}}
return this;}
this.setAuthData=function(__id,__login,__password){$$.authData[__id]={login:__login,password:__password};return this;}
this.clearAuthData=function(__id,__login,__password){delete $$.authData[__id];return this;}
$$.emit=function(event){if(is.string(event)){if(is.set($$.subscribers[event])){for(var i=0;i<$$.subscribers[event].length;i++){$$.subscribers[event][i].apply(this,Array.prototype.slice.call(arguments,1));}}}
return this;}
$$.filtering=function(){var flag=true;for(var i=0;i<$$.filters.length;i++){flag=flag&&$$.filters[i].apply(this,arguments);}
return flag;}
this.system={reboot:callback(this,function(save,__callback){var cmd=(save==true)?somovdParams.CMD_SAVE_AND_REBOOT:somovdParams.CMD_REBOOT;if(is.func(arguments[0])){__callback=arguments[0];}
return this.request(CGI_URL,'get',{res_cmd:cmd,res_cmd_type:'nbl',rq:'y',v2:'y',proxy:'y'},__callback);}),save:callback(this,function(__callback){return this.request(CGI_URL,'get',{res_cmd:somovdParams.CMD_SAVE_CONFIG,res_cmd_type:'bl',rq:'y',v2:'y',proxy:'y'},__callback);}),reset:callback(this,function(__callback){return this.request(CGI_URL,'get',{res_cmd:somovdParams.CMD_RESET_AND_REBOOT,res_cmd_type:'bl',rq:'y',v2:'y',proxy:'y'},__callback);}),backup:callback(this,function(__callback){return this.request(CGI_URL,'get',{res_cmd:somovdParams.CMD_BACKUP_CONFIG,res_cmd_type:'bl',rq:'y',v2:'y',proxy:'y'},callback(window,function(__callback){document.location.href=CGI_URL+'?v2_action=givemeconfig&proxy=y';if(is.func(__callback))__callback.call(window);},__callback));}),log:callback(this,function(mail,__callback){if(mail==true){}else{document.location.href=CGI_URL+'?v2_action=exportlog&proxy=y';}
return self;}),restore:callback(this,function(){})};this.config={read:callback(this,function(){var index='';var Q={v2:'y',proxy:'y'};var args=new argSchema(arguments);if(args.checkin('array __id','opt function __callback')){index=0;var __id=args.__id;Q.rq=__id.length;}else if(args.checkin('number __id','opt function __callback')){var __id=[args.__id];Q.rq='y';}
for(var i=0;i<__id.length;i++){Q['res_json'+index]='y';Q['res_config_action'+index]=somovdParams.CONFIG_ACTION_READ;Q['res_config_id'+index]=__id[i];Q['res_struct_size'+index]=0;index+=1;}
return this.request(CGI_URL,'get',Q,args.__callback);}),write:callback(this,function(){var index='';var Q={v2:'y',proxy:'y'};var args=new argSchema(arguments);if(args.checkin('array __id','opt bool __save','opt function __callback')){index=0;var __id=args.__id;Q.rq=__id.length;}else if(args.checkin('number __id','object __data','opt number __pos','opt bool __save','opt function __callback')){var __id=[[args.__id,args.__data,args.__pos]];Q.rq='y';}
for(var i=0;i<__id.length;i++){Q['res_json'+index]='y';Q['res_data_type'+index]='json';Q['res_config_action'+index]=somovdParams.CONFIG_ACTION_EDIT;Q['res_config_id'+index]=__id[i][0];Q['res_buf'+index]=__id[i][1],Q['res_struct_size'+index]=0;Q['res_pos'+index]=(is.number(__id[i][2]))?__id[i][2]:-1;index+=1;}
if(args.__save)Q.res_save='y';return this.request(CGI_URL,'get',Q,args.__callback);}),remove:callback(this,function(){var index='';var Q={v2:'y',proxy:'y'};var args=new argSchema(arguments);if(args.checkin('array __id','opt bool __save','opt function __callback')){index=0;var __id=args.__id;Q.rq=__id.length;}else if(args.checkin('number __id','object __data','opt number __pos','opt bool __save','opt function __callback')){var __id=[[args.__id,args.__data,args.__pos]];Q.rq='y';}
for(var i=0;i<__id.length;i++){Q['res_json'+index]='y';Q['res_data_type'+index]='json';Q['res_delex'+index]='y';Q['res_config_action'+index]=somovdParams.CONFIG_ACTION_DELETE;Q['res_config_id'+index]=__id[i][0];Q['res_buf'+index]=__id[i][1],Q['res_struct_size'+index]=0;Q['res_pos'+index]=(is.number(__id[i][2]))?__id[i][2]:-1;index+=1;}
if(args.__save)Q.res_save='y';return this.request(CGI_URL,'get',Q,args.__callback);}),multi:callback(this,function(__list,__callback){var index=0;var Q={v2:'y',proxy:'y',rq:0};if('remove'in __list){for(var i=0;i<__list.remove.length;i++){Q['res_json'+index]='y';Q['res_data_type'+index]='json';Q['res_delex'+index]='y';Q['res_config_action'+index]=somovdParams.CONFIG_ACTION_DELETE;Q['res_config_id'+index]=__list.remove[i][0];Q['res_buf'+index]=__list.remove[i][1],Q['res_struct_size'+index]=0;Q['res_pos'+index]=(is.number(__list.remove[i][2]))?__list.remove[i][2]:-1;index+=1;}
Q.rq+=__list.remove.length;}
if('write'in __list){for(var i=0;i<__list.write.length;i++){Q['res_json'+index]='y';Q['res_data_type'+index]='json';Q['res_config_action'+index]=somovdParams.CONFIG_ACTION_EDIT;Q['res_config_id'+index]=__list.write[i][0];Q['res_buf'+index]=__list.write[i][1],Q['res_struct_size'+index]=0;Q['res_pos'+index]=(is.number(__list.write[i][2]))?__list.write[i][2]:-1;index+=1;}
Q.rq+=__list.write.length;}
if('read'in __list){for(var i=0;i<__list.read.length;i++){Q['res_json'+index]='y';Q['res_config_action'+index]=somovdParams.CONFIG_ACTION_READ;Q['res_config_id'+index]=__list.read[i];Q['res_struct_size'+index]=0;index+=1;}
Q.rq+=__list.read.length;}
return this.request(CGI_URL,'get',Q,__callback);}),manual:callback(this,function(__query,__callback){return this.request(CGI_URL,'get',__query,__callback);})};this.config.write.and={save:callback(this,function(){var args=new argSchema(arguments);if(args.checkin('array __id','opt bool __save','opt function __callback')){return this.config.write(args.__id,true,args.__callback);}
else if(args.checkin('number __id','object __data','opt number __pos','opt bool __save','opt function __callback')){return this.config.write(args.__id,args.__data,args.__pos,true,args.__callback);}})};this.config.remove.and={save:callback(this,function(){var args=new argSchema(arguments);if(args.checkin('array __id','opt bool __save','opt function __callback')){return this.config.remove(args.__id,true,args.__callback);}
else if(args.checkin('number __id','object __data','opt number __pos','opt bool __save','opt function __callback')){return this.config.remove(args.__id,args.__data,args.__pos,true,args.__callback);}})};this.utils={vlan:{},iptv:{},wan:{byContype:{}},wifi:{}};};$(window).bind('keydown',function(e){if(e.keyCode==27)e.preventDefault();});devu=device.utils;devc=device.config;devsys=device.system;
var SAVEME=new function(){var self=this;var locking=false;var $$={save:false,reboot:false};function beforeunload(){return lng('saveme');}
this.lock=function(){locking=true;this.disable();return this;}
this.unlock=function(){locking=false;this.enable();return this;}
this.disable=function(){$(window).unbind('beforeunload',beforeunload);return this;}
this.enable=function(){if(!locking){$(window).unbind('beforeunload',beforeunload).bind('beforeunload',beforeunload);}
return this;}
this.enabling=function(){if($$.save||$$.reboot)this.enable();else this.disable();return this;}
this.trigger={save:callback(self,function(need){$$.save=need;this.enabling();}),reboot:callback(self,function(need){$$.reboot=need;this.enabling();})};$(document).bind({'ready':callback(this,function(){device.hook(device.notify.SAVE,callback(this,this.trigger.save));device.hook(device.notify.REBOOT,callback(this,this.trigger.reboot));}),'keydown':callback(this,function(e){if(e.which==116)this.lock();return true;})});};
window.isIdle=false;window.idleTimeout=null;function startIdle(){window.isIdle=true;$(window).trigger('beginIdle');}
function stopIdle(){window.isIdle=false;$(window).trigger('endIdle');}
function resetIdleHook(){if(window.isIdle){stopIdle();}
clearTimeout(window.idleTimeout);window.idleTimeout=oldSetTimeout(startIdle,webadminParams.IDLE_TIME);}
function setIdleHook(){resetIdleHook();$(document).bind('mousemove.idle',resetIdleHook).bind('keypress.idle',resetIdleHook);}
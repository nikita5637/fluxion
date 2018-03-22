var pFirmware={item:'menu_system_firmware',tabs:[{subitem:'menu_system_firmware',page:new pageFirmware(),alias:'upload',description:''}],description:'help_menu_system_firmware',alias:'firmware',menu:'menu_system'};var pageLAN={item:'LAN',page:jsLanController,alias:'lan',menu:'menu_net'}
var MENULIST=document.menuDefinitions=[];var menuStatus={name:'menu_status',alias:'status',icon:'/image/icons/status.png',list:[]};if(!hideFlag(somovdParams.CONFIG_ID_NET_STAT)){menuStatus.list.push({item:'menu_stat',page:new pageNetStat(),description:'help_menu_stat',alias:'network'});}
if(!hideFlag(somovdParams.CONFIG_ID_DHCP_LEASES)){menuStatus.list.push({item:'menu_statDhcp',page:new pageDHCPStat(),alias:'dhcp'});}
if(!hideFlag(somovdParams.CONFIG_ID_ROUTE_TABLE)&&!modeAP()){menuStatus.list.push({item:'menu_statRoute',page:new pageRouteStat(),alias:'route'});}
if(!hideFlag(somovdParams.CONFIG_ID_ARP)){menuStatus.list.push({item:'menu_statClients',page:new pageLANClientsStat(),alias:'clients'});}
if(!hideFlag(somovdParams.CONFIG_ID_ACTIVE_SESSION)&&!modeAP()){menuStatus.list.push({item:'menu_activeSessions',page:new pageActiveSessions(),description:'help_menu_activeSessions',alias:'sessions'});}
if(menuStatus.list.length)MENULIST.push(menuStatus);var menuNet={name:'menu_net',alias:'network',icon:'/image/icons/network.png',list:[]};if(!hideFlag(somovdParams.CONFIG_ID_WAN_TEMP)&&!modeAP()){menuNet.list.push({item:'WAN',page:jsWansController,alias:'wan'});}
if(!hideFlag(somovdParams.CONFIG_ID_WAN_TEMP)){menuNet.list.push(pageLAN);}
if(menuNet.list.length)MENULIST.push(menuNet);var menuWifi={name:'menu_wifi',alias:'wifi',icon:'/image/icons/wifi.png',list:[]};if(!hideFlag(somovdParams.CONFIG_ID_WIFI)){menuWifi.freakBar=jsQuickWiFiController;}
if(!hideFlag(somovdParams.CONFIG_ID_WIFI)){var pWiFiBasic={item:'menu_wifi_basic',description:'help_menu_wifi_basic',alias:'basic'};pWiFiBasic.page=new pageWiFiBasic();menuWifi.list.push(pWiFiBasic);}
if(!hideFlag('wifi.mbssid_all.AuthMode')){var pWifiSec={item:'menu_wifi_security',description:'help_menu_wifi_security',alias:'security'}
pWifiSec.page=new pageWiFiSecurity();menuWifi.list.push(pWifiSec);}
if(!hideFlag('wifi.mbssid_all.AccessControlList')){menuWifi.list.push({item:'menu_wifi_mac',description:'help_menu_wifi_mac',alias:'mac',tabs:[{subitem:'wifiMacModeTab',page:new pageWiFiMACFilterMode(),description:'',alias:'mode'},{subitem:'wifiMacAddrTab',page:new pageWiFiMACFilter(),description:'',alias:'filter'}]});}
if(!hideFlag('wifi.StaListParamsAvailable')){menuWifi.list.push({item:'menu_wifi_station_list',page:new pageWiFiStationList(),description:'help_menu_wifi_station_list',alias:'stations'});}
if(!hideFlag('wifi.wps')){var pWifiWps={item:'menu_wifi_wps',description:'help_menu_wifi_wps',alias:'wps'};pWifiWps.page=new pageWiFiWPS();menuWifi.list.push(pWifiWps);}
if(!hideFlag('wifi.addon_settings')){var pWifiAddon={item:'menu_wifi_addon',description:'menu_wifi_addon',alias:'addons'};pWifiAddon.page=new pageWiFiAdvanced();menuWifi.list.push(pWifiAddon);}
if(!hideFlag(somovdParams.CONFIG_ID_WIFI_WMM)){menuWifi.list.push({item:'menu_wifi_wmm',page:new pageWiFiWMM(),description:'help_menu_wifi_wmm',alias:'wmm'});}
if(!hideFlag(somovdParams.CONFIG_ID_WIFI_SCAN)){menuWifi.list.push({item:'menu_wifi_client',page:new pageWiFiClient(),description:'help_menu_wifi_client',alias:'client'});}
if(menuWifi.list.length)MENULIST.push(menuWifi);var menuAdv={name:'menu_dsl_advanced',alias:'advanced',icon:'/image/icons/extra.png',list:[]};if(!hideFlag(somovdParams.CONFIG_ID_GROUP_VLAN)&&!modeAP()){menuAdv.list.push({item:'menu_vlan',page:new pageVlan(),description:'help_menu_vlan',alias:'vlan'});}
if(!hideFlag(somovdParams.CONFIG_ID_UPNP)&&!modeAP()){menuAdv.list.push({item:'menu_upnp',page:new pageUPnP(),description:'help_menu_upnp',alias:'upnp'});}
if(!hideFlag(somovdParams.CONFIG_ID_DSL_DDNS)&&!modeAP()){menuAdv.list.push({item:'menu_ddns',page:new pageDDNS(),description:'help_menu_ddns',alias:'ddns'});}
if(!hideFlag(somovdParams.CONFIG_ID_DSL_DNS)&&!modeAP()){menuAdv.list.push({item:'menu_dns',page:new pageDNS(),description:'help_menu_dns',alias:'dns'});}
if(!hideFlag(somovdParams.CONFIG_ID_ROUTING)&&!modeAP()){menuAdv.list.push({item:'menu_routing',page:new pageRouting(),description:'help_menu_routing',alias:'routing'});menuAdv.list.push({item:'menu_routing_ipv6',page:new pageRoutingIPv6(),description:'help_menu_routing_ipv6',alias:'routing_ipv6'});}
if(!hideFlag(somovdParams.CONFIG_ID_HTTPACCESS)&&!modeAP()){menuAdv.list.push({item:'menu_rmtAccess',page:new pageRemoteAccess(),description:'help_menu_rmtAccess',alias:'remoteaccess'});}
if(!hideFlag(somovdParams.CONFIG_ID_IGMP)&&!modeAP()){var pMisc={page:new pageMisc(),alias:'misc'}
pMisc.item='menu_misc';menuAdv.list.push(pMisc);}
if(!hideFlag(somovdParams.CONFIG_ID_TR69)&&!modeAP()){var pTR69={item:'menu_tr69',page:new pageTR69(),alias:'tr69'};pTR69.hide=true;menuAdv.list.push(pTR69);}
if(menuAdv.list.length)MENULIST.push(menuAdv);var menuFire={name:'menu_firewall',alias:'firewall',icon:'/image/icons/firewall.png',list:[]};if(!hideFlag(somovdParams.CONFIG_ID_IPFILTER)&&!modeAP()){menuFire.list.push({item:'menuIPFilter',page:new pageIPFilters(),description:'help_menuIPFilter',alias:'ipfilter'});}
if(!hideFlag(somovdParams.CONFIG_ID_DSL_VSERVERS)&&!modeAP()){menuFire.list.push({item:'vserversMenu',page:new pageVirtServ(),description:'help_vserversMenu',alias:'vservers'});}
if(!hideFlag(somovdParams.CONFIG_ID_DMZ)&&!modeAP()){menuFire.list.push({item:'menu_dmz',page:new pageDMZ(),description:'help_menu_dmz',alias:'dmz'});}
if(!hideFlag(somovdParams.CONFIG_ID_MAC_FILTER)){var pMacFilter={item:'menu_macfilter',tabs:[],description:'help_menu_macfilter',alias:'macfilter'};pMacFilter.tabs.push({subitem:'macfAddrTab',page:new pageMACFilter(),description:'',alias:'filter'});menuFire.list.push(pMacFilter);}
if(menuFire.list.length)MENULIST.push(menuFire);var menuControl={name:'menu_control',alias:'control',icon:'/image/icons/control.png',list:[]};var pUrlFilter={item:'menu_urlfilter',tabs:[],description:'help_menu_urlfilter',alias:'urlfilter'};if(!hideFlag(somovdParams.CONFIG_ID_GET_URLF_CONFIG)){pUrlFilter.tabs.push({subitem:'urlfConfigTab',page:new pageURLFilterConfig(),alias:'config'});}
if(!hideFlag(somovdParams.CONFIG_ID_URL_FILTER)){pUrlFilter.tabs.push({subitem:'urlfAddrTab',page:new pageURLFilter(),alias:'filter'});}
menuControl.list.push(pUrlFilter);if(menuControl.list.length)MENULIST.push(menuControl);var menuSystem={name:'menu_system',alias:'system',icon:'/image/icons/system.png',list:[]};var pSysPass={page:new pagePasswd(),description:'help_menu_system_passw',alias:'password'}
if(!hideFlag(somovdParams.CONFIG_ID_SET_PASS)){pSysPass.item='menu_system_passw';menuSystem.list.push(pSysPass);}
menuSystem.list.push({item:'menu_system_config',page:new pageConfiguration(),description:'help_menu_system_config',alias:'sysconf'});if(!hideFlag(somovdParams.CONFIG_ID_SYSLOG_READ)){var pSysLog={item:'menu_system_log',tabs:[{subitem:'slConfigTab',page:new pageSyslogConf(),alias:'config',description:''}],description:'help_menu_system_log',alias:'syslog'}
pSysLog.tabs.push({subitem:'slLogTab',page:new pageSyslog(),alias:'log'});menuSystem.list.push(pSysLog);}
if(!hideFlag(somovdParams.CMD_FIRMWARE_UPDATE)){menuSystem.list.push(pFirmware);}
if(!hideFlag(somovdParams.CONFIG_ID_NTP)){menuSystem.list.push({item:'menu_ntp',page:new pageNTP(),description:'help_menu_ntp',alias:'ntp'});}
if(!hideFlag(somovdParams.CONFIG_ID_PING)){menuSystem.list.push({item:'menu_ping',page:new pagePing(),alias:'ping'});}
if(!hideFlag(somovdParams.CONFIG_ID_TRACEROUTE)){menuSystem.list.push({item:'menu_traceroute',page:new pageTraceroute(),alias:'traceroute'});}
if(!hideFlag(somovdParams.CONFIG_ID_TELNETD)){menuSystem.list.push({item:'menu_telnet',page:new pageTelnet(),alias:'telnet'});}
if(!hideFlag(somovdParams.CONFIG_ID_SYSUSERS)){menuSystem.list.push({item:'menu_service_users',page:new pageServiceUsers(),alias:'users'});}
if(menuSystem.list.length)MENULIST.push(menuSystem);document.menuDefinitionsWZ=[];if(!hideFlag(somovdParams.CONFIG_ID_WAN_TEMP)&&!disableFlag(somovdParams.CONFIG_ID_WAN_TEMP)&&!modeAP()){document.menuDefinitionsWZ.push({name:'menu_net',alias:'wizard',icon:'/image/icons/network.png',list:[{item:"Click'n'Connect",page:jsQuickConfigMasterController,description:'',alias:'quick'}]});}
if(!hideFlag(somovdParams.CONFIG_ID_WIFI)||!hideFlag("wifi.mbssid_all.AuthMode")){var pWifiWizard={name:'menu_wifi',alias:'wizard',icon:'/image/icons/wifi.png',list:[]};pWifiWizard.list.push({item:'title_wifi',page:new pageWiFiWizard(),description:'',alias:'wifi'});document.menuDefinitionsWZ.push(pWifiWizard);}
if(!hideFlag(somovdParams.CONFIG_ID_DSL_VSERVERS)&&!modeAP()){document.menuDefinitionsWZ.push({name:'menu_firewall',alias:'wizard',icon:'/image/icons/firewall.png',list:[{item:'title_virtual',page:new wizardVirtServ(),description:'',alias:'vservers'}]});}
if(!hideFlag(somovdParams.CONFIG_ID_GROUP_VLAN)&&!modeAP()){document.menuDefinitionsWZ.push({name:'menu_iptv',alias:'wizard',icon:'/image/icons/iptv.png',list:[{item:'title_iptv',page:new pageIPTV(),description:'',alias:'iptv'}]});}
var allMenuDef=document.menuDefinitions.concat(document.menuDefinitionsWZ);
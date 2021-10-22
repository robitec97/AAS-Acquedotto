/* dati della centrale di Avigliana (semplificata) per popolare il database */

insert into serbatoio(capienza_max) values(5000);
insert into serbatoio(capienza_max) values(8000);
insert into serbatoio(capienza_max) values(3000); 

insert into tubatura(SP,EP,Lenght) values(0.00000,13.45555,30);
insert into tubatura(SP,EP,Lenght) values(21.00386979063822,79.98083437254499,50);
insert into tubatura(SP,EP,Lenght) values(89.77588633840371,55.85334528589536,40);
insert into tubatura(SP,EP,Lenght) values(58.59648554298922,97.26527836942212,60);
insert into tubatura(SP,EP,Lenght) values(0.7155418980448358,11.223770992553384,35); 

insert into pompa(power_max,power_actual,current_status,tubatura) values(100,50,true,2);
insert into pompa(power_max,power_actual,current_status,tubatura) values(150,60,false,3);
insert into pompa(power_max,power_actual,current_status,tubatura) values(200,70,true,4);


insert into valvola(tipo_valvola,current_status,serbatoio,tubatura) values("UNI",true,1,2);
insert into valvola(tipo_valvola,current_status,serbatoio,tubatura) values("RPO",true,3,2);
insert into valvola(tipo_valvola,current_status,serbatoio,tubatura) values("RPR",false,2,3);


insert into ews(ip_address,token,current_status) values("192.168.1.1","DEFAULT_TOKEN",true);
insert into ews(ip_address,token,current_status) values("192.168.1.2","DEFAULT_TOKEN",true);
insert into ews(ip_address,token,current_status) values("192.168.1.3","DEFAULT_TOKEN",true);



insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("PR",10.5,1,1);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("PO",20,2,1);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("LV",300,3,1);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("PR",60,1,2);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("PO",10.5,2,2);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("LV",200,3,2);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("PR",10.5,1,1);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("PO",40.5,1,1);
insert into sensore(tipo_sensore,valore,serbatoio,monitored_by) values("LV",200,1,1);



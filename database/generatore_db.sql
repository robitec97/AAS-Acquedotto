

CREATE TABLE Serbatoio(
	id integer not null auto_increment primary key,
    capienza_max integer not null,
	coordinate float not null
    );
CREATE TABLE Tubatura(
	id integer not null auto_increment primary key,
    SP float not null,
    EP float not null,
    Lenght float not null
    );
CREATE TABLE Pompa(
	id integer not null auto_increment primary key,
    power_max float not null,
    power_actual float not null,
    current_status boolean,
    tubatura integer,
	coordinate float not null,
    foreign key (tubatura) references Tubatura(id)
    );
CREATE TABLE Valvola(
	id integer not null auto_increment primary key,
    tipo_valvola varchar(3) not null,
    current_status boolean,
    serbatoio integer,
    tubatura integer,
    foreign key (serbatoio) references Serbatoio(id),
    foreign key (tubatura) references Tubatura(id)
    ); */
CREATE TABLE EWS(
	id integer not null auto_increment primary key,
    ip_address varchar(15) not null,
    token varchar(50) not null,
    current_status boolean not null,
	coordinate float not null,
    );
CREATE TABLE Sensore(
	id integer not null auto_increment primary key,
    tipo_sensore varchar(2) not null,
    valore float not null,
    serbatoio integer,
    monitored_by integer,
    foreign key (serbatoio) references Serbatoio(id),
    foreign key (monitored_by) references EWS(id)
    );

    
    
    
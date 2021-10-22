const { coreaasXmlFile, nodesets, LocalizedText, CoreServer, IdentifierType, AssetKind, KeyType, KeyElements, DataType,DataQueryType, makeAccessLevelFlag, StatusCodes, VariantArrayType, Variant} = require("./node_modules/node-opcua-coreaas");
//Richiedo il modulo database 
const { Database} = require("./database");
const {AssetAdministrationShellAcquedotto} = require("./InformationModelAcquedotto");
//Configurazione del database
const config = {
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'acquedotto'
}; 

//Connessione al database con la configurazione
const db=new Database(config);


let xmlFiles = [nodesets.standard, coreaasXmlFile]


let server = new CoreServer({
    nodeset_filename: xmlFiles,
    port: 4848
})

let informationModelDict={
    "Tanks": [],
    "Pumps": [],
    "Pipes": [],
    "Sensors": [],
    "Valve": [],
    "Ews": [],
};


function post_initialize() {
    
    console.log("Starting post initialize")
    let admin = server.coreaas.addAdministrativeInformation({
        version: "1",
        revision: "0"
    });

    var asq = new AssetAdministrationShellAcquedotto(server,admin);
    console.log("ASQ CREATED");
    let aqshell = asq.addShellAcquedotto("Avigliana");
    let aqasset = asq.addAssetAcquedotto("Avigliana",aqshell);
    // ----------------------------------------- POPOLAMENTO SUBMODEL WATER TANKS ------------------------------------------------------------
    db.query("select id from serbatoio").then(
        result => {
            for(let i=1;i<=result.length;i++){
                let submodelWaterTanks1 = asq.addSubModelWaterTanks(i,aqshell)
                let capienzaMaxProperty = asq.addPropertyCapienzaMax(i,submodelWaterTanks1,db,"select capienza_max from serbatoio where id ="+i)
                let coordinateGeoTankProperty1 = asq.addPropertyCoordinataGeoTank(i,submodelWaterTanks1,db,"select coordinate from serbatoio where id="+i)
                
            }
        }
    )
    //----------------------------------------------------------------------------------------------------------------------------------------

    //--------------------------------------POPOLAMENTO SUBMODEL PUMPS------------------------------------------------------------------------
    db.query("select id from pompa").then(
        result => {
            for(let i=1;i<=result.length;i++){
                let submodelPumps = asq.addSubModelPumps(i,aqshell)
                asq.addPropertyPowerMax(i,submodelPumps,db,"select power_max from pompa where id ="+i)
                asq.addPropertyPowerActual(i,submodelPumps,db,"select power_actual from pompa where id="+i)
                asq.addPropertyCurrentStatus(i,submodelPumps,db,"select current_status from pompa where id="+i)
                asq.addPropertyPipe(i,submodelPumps,db,"select tubatura from pompa where id ="+i)
                asq.addPropertyPumpCoordinate(i,submodelPumps,db,"select coordinate from pompa where id="+i)
            }
        }
    )
    //----------------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------POPOLAMENTO SUBMODEL SENSORS---------------------------------------------------------------
    db.query("select id from sensore").then(
        result => {
            for(let i=1;i<=result.length;i++){
                let submodelSensors = asq.addSubModelSensors(i,aqshell)
                let propertySensorType = asq.addPropertySensorType(i,submodelSensors,db,"select tipo_sensore from sensore where id="+i)
                let propertySensorValue = asq.addPropertySensorValue(i,submodelSensors,db,"select valore from sensore where id="+i)
                let propertySensorTank = asq.addPropertySensorTank(i,submodelSensors,db,"select serbatoio from sensore where id ="+i)
                let propertySensorEws = asq.addPropertySensorEws(i,submodelSensors,db,"select monitored_by from sensore where id="+i)
            }
        }
    )
    //-----------------------------------------------------------------------------------------------------------------------------------------

    //------------------------------------POPOLAMENTO SUBMODEL VALVE--------------------------------------------------------------------------
    db.query("select id from valvola").then(
        result => {
            for(let i=1;i<=result.length;i++){
                let submodelValve = asq.addSubModelValve(i,aqshell)
                let propertyValveType = asq.addPropertyValveType(i,submodelValve,db,"select tipo_valvola from valvola where id="+i)
                let propertyValveStatus = asq.addPropertyValveStatus(i,submodelValve,db,"select current_status from valvola where id="+i)
                let propertyValveTank = asq.addPropertyValveTank(i,submodelValve,db,"select serbatoio from valvola where id="+i)
                let propertyValvePipe = asq.addPropertyValvePipe(i,submodelValve,db,"select tubatura from pompa where id="+i)
            }
        }
    )
    //--------------------------------------POPOLAMENTO SUBMODEL PIPES---------------------------------------------------------
    db.query("select id from tubatura").then(
        result => {
            for(let i=1;i<=result.length;i++){
                let submodelPipe = asq.addSubModelPipe(i,aqshell);
                let propertyPipeLength = asq.addPropertyPipeLength(i,submodelPipe,db,"select lenght from tubatura where id="+i)
                let propertyPipeSP = asq.addPropertyPipeSP(i,submodelPipe,db,"select SP from tubatura where id="+i)
                let propertyPipeEP = asq.addPropertyPipeEP(i,submodelPipe,db,"select EP from tubatura where id="+i)
            }
        }
    )
    //-----------------------------------------------------------------------------------------------------------------------------------------

    //-------------------------------------------POPOLAMENTO EWS SUBMODEL---------------------------------------------------------------------
    db.query("select id from ews").then(
        result => {
            for(let i=1;i<=result.length;i++){
                let submodelEws = asq.addSubModelEWS(i,aqshell)
                let propertyEwsIp = asq.addPropertyEWSIp(i,submodelEws,db,"select ip_address from ews where id="+i)
                let propertyEwsToken = asq.addPropertyEWSToken(i,submodelEws,db,"select token from ews where id="+i)
                let propertyEwsStatus = asq.addPropertyEWSStatus(i,submodelEws,db,"select current_status from ews where id="+i)
                const addressSpace = server.engine.addressSpace;
           }   
        }
    )
    //----------------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------------------METODI-----------------------------------------------------------------------------
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    const myDevice = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "Methods"
    });
    const ActivatePump = namespace.addMethod(myDevice,{

        browseName: "Activate Pump",
    
        inputArguments:  [
            {
                name:"Pump Id",
                description: { text: "specifies the id of the pump to activate" },
                dataType: DataType.UInt32        
            }
         ],
    
        outputArguments: [{
             name:"Result",
             description:{ text: "Result of the operation" },
             dataType: DataType.String ,
             valueRank: 1
        }]
    });

    ActivatePump.bindMethod((inputArguments,context,callback) => {

        const pumpId = inputArguments[0].value;
        
    
        console.log("setting pump"+pumpId+"to active");
    
        db.query("update pompa set current_status = true where id="+pumpId);
    
        const callMethodResult = {
            statusCode: StatusCodes.Good,
            outputArguments: [{
                    dataType: DataType.String,
                    arrayType: VariantArrayType.arrayType,
                    value :"Pompa attivata!"
            }]
        };
        callback(null,callMethodResult);
    });
    const DeactivatePump = namespace.addMethod(myDevice,{

        browseName: "Dectivate Pump",
    
        inputArguments:  [
            {
                name:"Pump Id",
                description: { text: "specifies the id of the pump to deactivate" },
                dataType: DataType.UInt32        
            }
         ],
    
        outputArguments: [{
             name:"Result",
             description:{ text: "Result of the operation" },
             dataType: DataType.String ,
             valueRank: 1
        }]
    });

    DeactivatePump.bindMethod((inputArguments,context,callback) => {

        const pumpId = inputArguments[0].value;
        
    
        console.log("setting pump"+pumpId+"to deactive");
    
        db.query("update pompa set current_status = false where id="+pumpId);
    
        const callMethodResult = {
            statusCode: StatusCodes.Good,
            outputArguments: [{
                    dataType: DataType.String,
                    arrayType: VariantArrayType.arrayType,
                    value :"Pompa disattivata!"
            }]
        };
        callback(null,callMethodResult);
    });
    const SetToken = namespace.addMethod(myDevice,{

        browseName: "Set Token",
    
        inputArguments:  [
            {
                name:"EWS id",
                description: { text: "specifies the id of the ews to set the token" },
                dataType: DataType.UInt32        
            },
            {
                name: "token",
                description: {text: "the token"},
                dataType: DataType.String
            }
         ],
    
        outputArguments: [{
             name:"Result",
             description:{ text: "Result of the operation" },
             dataType: DataType.String ,
             valueRank: 1
        }]
    });

    SetToken.bindMethod((inputArguments,context,callback) => {

        const ewsId = inputArguments[0].value;
        const token = inputArguments[1].value;
    
        console.log("setting token on ews"+ewsId);
    
        db.query("update ews set token =\'"+token+"\' where id="+ewsId);
    
        const callMethodResult = {
            statusCode: StatusCodes.Good,
            outputArguments: [{
                    dataType: DataType.String,
                    arrayType: VariantArrayType.arrayType,
                    value :"Token settato"
            }]
        };
        callback(null,callMethodResult);
    });

    const EwsFunction = namespace.addMethod(myDevice,{

        browseName: "Early Warning Function",
    
        inputArguments:  [
            {
                name:"Portata target",
                description: { text: "specifica la portata target" },
                dataType: DataType.UInt32        
            },

            {
                name: "Pressione in entrata",
                description: {text: "specifica la pressione in entrata"},
                dataType: DataType.UInt32
            },
            {
                name: "filename_db",
                description: {text: "file del database con storico dati"},
                dataType: DataType.String
            
            }
         ],
    
        outputArguments: [{
             name:"Result",
             description:{ text: "Anomalia o non anomalia" },
             dataType: DataType.String ,
             valueRank: 1
        }]
    });

    //---------------------------------------------------------------------------------------------------------------------------------------


    server.start(function () {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

server.initialize(post_initialize);

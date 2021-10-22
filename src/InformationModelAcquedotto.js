const { coreaasXmlFile,OPCUACertificateManager, ModelingKind,
    nodesets, LocalizedText, CoreServer, IdentifierType,
    AssetKind, KeyType, KeyElements, PropertyCategory,PropertyValueType,
    Variant, DataType,DataValue,StatusCodes} = require("./node_modules/node-opcua-coreaas");

var xmlFiles = [nodesets.standard, coreaasXmlFile]

class AssetAdministrationShellAcquedotto{
    constructor(server,admin ) {
        this.server=server;
        this.admin=admin;
        this.Identifier=this.server.coreaas.Identifier;
        this.Key=this.server.coreaas.Key;
    }


    addShellAcquedotto(id){
        let aqshell= this.server.coreaas.addAssetAdministrationShell({
            browseName:"AssetShellAcquedotto "+id,
            description:[new LocalizedText({locale: "en", text: "Asset Shell Hydroplant"}),
                new LocalizedText({locale: "it", text: "Asset Shell Acquedotto"})],
            identification: new this.Identifier({
                id: "www.admin-shell.io/aq/aas/"+id,
                idType: IdentifierType.IRI
            }),
            idShort:id,
            derivedFromRef: [ new this.Key({
                idType: KeyType.IRDI,
                local: false,
                type: KeyElements.AssetAdministrationShell,
                value: "AAA#1234-454#123456789"
            }) ],
            assetRef: [new this.Key({
                idType: KeyType.IRI,
                local: true,
                type: KeyElements.Asset,
                value: String(id)
            })],
            administration: this.admin
        });

        aqshell.addSubmodelRef([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/water_tanks"
        })]).addSubmodelRef([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pumps"
        })]).addSubmodelRef([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/sensors"
        })]).addSubmodelRef([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/valve"
        })]).addSubmodelRef([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pipes"
        })]).addSubmodelRef([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/ews"
        })]);
        return aqshell;
    }

    addAssetAcquedotto(id,administrationShell){

        let assetaq=this.server.coreaas.addAsset({
            browseName:"Asset Acquedotto "+id,
            identification: new this.Identifier({
                id: String(id),
                idType: IdentifierType.Custom
            }),
            idShort:String(id),
            kind: AssetKind.Instance,
            description: "Asset Acquedotto",

        });
        administrationShell.hasAsset(assetaq);
        return assetaq;
    }

    addSubModelWaterTanks(id,administrationShell){
        let watertanks=this.server.coreaas.addSubmodel({
            browseName:"water_tanks "+id,
            kind: ModelingKind.Instance,
            idShort: "aas_water_tanks "+String(id),
            identification: new this.Identifier({
                id: "//aq/aas/"+String(id)+"/subs/water_tanks",
                idType: IdentifierType.IRI
            })
        }).submodelOf(administrationShell);
        return watertanks;
    }

    addPropertyCapienzaMax(id,subModelWaterTanks,database,capienzaMaxQuery){
        let capienzaMax =this.server.coreaas.addSubmodelProperty({
            browseName:"CapienzaMax",
            idShort: "CapienzaMax/"+id,
            description: "la capienza massima del serbatoio in litri",
            submodelElementOf: subModelWaterTanks,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( capienzaMaxQuery)
                            .then( result=> {
                                console.log(result[0].capienza_max)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].capienza_max}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/water_tanks",
        })]);

        return capienzaMax;
    }

    addPropertyCoordinataGeoTank(id,subModelWaterTanks,database,coordinataGeoQuery){
        let capienzaMax =this.server.coreaas.addSubmodelProperty({
            browseName:"Coordinate",
            idShort: "Coordinate/"+id,
            description: "le coordinate geografiche del serbatoio",
            submodelElementOf: subModelWaterTanks,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( coordinataGeoQuery)
                            .then( result=> {
                                console.log(result[0].coordinate)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].coordinate}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/water_tanks",
        })]);

        return capienzaMax;
    }

    
    addSubModelPumps(id,administrationShell){
        let pumpsubmodel =this.server.coreaas.addSubmodel({
            browseName:"Pumps "+id,
            kind: ModelingKind.Instance,
            idShort: "aas_pumps"+String(id),
            identification: new this.Identifier({
                id: "//aq/aas/"+String(id)+"/subs/pumps",
                idType: IdentifierType.IRI
            })
        }).submodelOf(administrationShell);

        return pumpsubmodel;
    }

    addPropertyPowerMax(id,subModelPumps,database,PowerMaxQuery){
        let powerMax =this.server.coreaas.addSubmodelProperty({
            browseName:"PowerMax",
            idShort: "PowerMax/"+id,
            submodelElementOf: subModelPumps,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( PowerMaxQuery)
                            .then( result=> {
                                console.log(result[0].power_max)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].power_max}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pumps",
        })]);

        return powerMax;
    }

    addPropertyPowerActual(id,subModelPumps,database,PowerActualQuery){
        let powerAct =this.server.coreaas.addSubmodelProperty({
            browseName:"PowerActual",
            idShort: "PowerActual/"+id,
            submodelElementOf: subModelPumps,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( PowerActualQuery)
                            .then( result=> {
                                console.log(result[0].power_actual)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].power_actual}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pumps",
        })]);

        return powerAct;
    }

    addPropertyCurrentStatus(id,subModelPumps,database,CurrentStatusQuery){
        let currentStatus =this.server.coreaas.addSubmodelProperty({
            browseName:"CurrentStatus",
            idShort: "CurrentStatus/"+id,
            submodelElementOf: subModelPumps,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( CurrentStatusQuery)
                            .then( result=> {
                                console.log(result[0].current_status)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].current_status}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pumps",
        })]);

        return currentStatus;
    }

    addPropertyPipe(id,subModelPumps,database,PipeQuery){
        let pipe =this.server.coreaas.addSubmodelProperty({
            browseName:"Pipe",
            idShort: "Pipe/"+id,
            submodelElementOf: subModelPumps,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( PipeQuery)
                            .then( result=> {
                                console.log(result[0].tubatura)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].tubatura}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pumps",
        })]);

        return pipe;
    }

    addPropertyPumpCoordinate(id,subModelPumps,database,PumpCoordinateQuery){
        let coordinate =this.server.coreaas.addSubmodelProperty({
            browseName:"Coordinate",
            idShort: "Coordinate/"+id,
            submodelElementOf: subModelPumps,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( PumpCoordinateQuery)
                            .then( result=> {
                                console.log(result[0].coordinate)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].coordinate}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pumps",
        })]);

        return coordinate;
    }

    addSubModelSensors(id,administrationShell){
        let sensors =this.server.coreaas.addSubmodel({
            browseName:"Sensors"+id,
            kind: ModelingKind.Instance,
            idShort: "aas_sensors"+String(id),
            identification: new this.Identifier({
                id: "//aq/aas/"+String(id)+"/subs/sensors",
                idType: IdentifierType.IRI
            })
        }).submodelOf(administrationShell);

        return sensors;
    }

    addPropertySensorType(id,subModelSensors,database,SensorTypeQuery){
        let sensorType =this.server.coreaas.addSubmodelProperty({
            browseName:"Sensor type",
            idShort: "Sensor type/"+id,
            submodelElementOf: subModelSensors,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.String,
            value: {
                dataType: "String",
                value:{
                    refreshFunc : function(callback) {
                        database.query( SensorTypeQuery)
                            .then( result=> {
                                console.log(result[0].tipo_sensore)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.String, value:result[0].tipo_sensore}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/sensors",
        })]);

        return sensorType;
    }

    addPropertySensorValue(id,subModelSensors,database,SensorValueQuery){
        let sensorValue =this.server.coreaas.addSubmodelProperty({
            browseName:"Sensor value",
            idShort: "Sensor value/"+id,
            submodelElementOf: subModelSensors,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( SensorValueQuery)
                            .then( result=> {
                                console.log(result[0].valore)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].valore}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/sensors",
        })]);

        return sensorValue;
    }

    addPropertySensorTank(id,subModelSensors,database,SensorTankQuery){
        let sensorTank =this.server.coreaas.addSubmodelProperty({
            browseName:"Sensor Tank",
            idShort: "Sensor Tank/"+id,
            submodelElementOf: subModelSensors,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( SensorTankQuery)
                            .then( result=> {
                                console.log(result[0].serbatoio)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].serbatoio}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/sensors",
        })]);

        return sensorTank;
    }


    addPropertySensorEws(id,subModelSensors,database,SensorEwsQuery){
        let sensorEws =this.server.coreaas.addSubmodelProperty({
            browseName:"Sensor EWS",
            idShort: "Sensor EWS/"+id,
            submodelElementOf: subModelSensors,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( SensorEwsQuery)
                            .then( result=> {
                                console.log(result[0].monitored_by)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].monitored_by}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/sensors",
        })]);

        return sensorEws;
    }

    addSubModelValve(id,administrationShell){
        let valve =this.server.coreaas.addSubmodel({
            browseName:"Valve"+id,
            kind: ModelingKind.Instance,
            idShort: "aas_valve"+String(id),
            identification: new this.Identifier({
                id: "//aq/aas/"+String(id)+"/subs/valve",
                idType: IdentifierType.IRI
            })
        }).submodelOf(administrationShell);

        return valve;
    }

    addPropertyValveType(id,subModelValve,database,ValveTypeQuery){
        let valveType =this.server.coreaas.addSubmodelProperty({
            browseName:"Valve Type",
            idShort: "Valve Type/"+id,
            submodelElementOf: subModelValve,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.String,
            value: {
                dataType: "String",
                value:{
                    refreshFunc : function(callback) {
                        database.query( ValveTypeQuery)
                            .then( result=> {
                                console.log(result[0].tipo_valvola)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.String, value:result[0].tipo_valvola}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/valve",
        })]);

        return valveType;
    }


    addPropertyValveStatus(id,subModelValve,database,ValveStatusQuery){
        let valveStatus =this.server.coreaas.addSubmodelProperty({
            browseName:"Valve Status",
            idShort: "Valve Status/"+id,
            submodelElementOf: subModelValve,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( ValveStatusQuery)
                            .then( result=> {
                                console.log(result[0].current_status)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].current_status}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/valve",
        })]);

        return valveStatus;
    }

    addPropertyValveTank(id,subModelValve,database,ValveTankQuery){
        let valveTank =this.server.coreaas.addSubmodelProperty({
            browseName:"Valve Tank",
            idShort: "Valve Tank/"+id,
            submodelElementOf: subModelValve,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( ValveTankQuery)
                            .then( result=> {
                                console.log(result[0].serbatoio)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].serbatoio}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/valve",
        })]);

        return valveTank;
    }

    addPropertyValvePipe(id,subModelValve,database,ValvePipeQuery){
        let valvePipe =this.server.coreaas.addSubmodelProperty({
            browseName:"Valve Pipe",
            idShort: "Valve Pipe/"+id,
            submodelElementOf: subModelValve,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( ValvePipeQuery)
                            .then( result=> {
                                console.log(result[0].tubatura)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].tubatura}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/valve",
        })]);

        return valvePipe;
    }

    addSubModelPipe(id,administrationShell){
        let pipe =this.server.coreaas.addSubmodel({
            browseName:"Pipe"+id,
            kind: ModelingKind.Instance,
            idShort: "aas_pipe"+String(id),
            identification: new this.Identifier({
                id: "//aq/aas/"+String(id)+"/subs/pipe",
                idType: IdentifierType.IRI
            })
        }).submodelOf(administrationShell);

        return pipe;
    }

    addPropertyPipeLength(id,subModelPipe,database,PipeLengthQuery){
        let pipeLength =this.server.coreaas.addSubmodelProperty({
            browseName:"Pipe Length",
            idShort: "Pipe Length/"+id,
            submodelElementOf: subModelPipe,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( PipeLengthQuery)
                            .then( result=> {
                                console.log(result[0].lenght)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].lenght}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pipes",
        })]);

        return pipeLength;
    }

    addPropertyPipeSP(id,subModelPipe,database,PipeSPQuery){
        let pipeSP =this.server.coreaas.addSubmodelProperty({
            browseName:"Pipe Starting Point",
            idShort: "Pipe Starting Point/"+id,
            submodelElementOf: subModelPipe,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( PipeSPQuery)
                            .then( result=> {
                                console.log(result[0].SP)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].SP}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pipes",
        })]);

        return pipeSP;
    }

    addPropertyPipeEP(id,subModelPipe,database,PipeEPQuery){
        let pipeEP =this.server.coreaas.addSubmodelProperty({
            browseName:"Pipe Ending Point",
            idShort: "Pipe Ending Point/"+id,
            submodelElementOf: subModelPipe,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( PipeEPQuery)
                            .then( result=> {
                                console.log(result[0].EP)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].EP}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/pipes",
        })]);

        return pipeEP;
    }

    addSubModelEWS(id,administrationShell){
        let ews =this.server.coreaas.addSubmodel({
            browseName:"EWS"+id,
            kind: ModelingKind.Instance,
            idShort: "aas_ews"+String(id),
            identification: new this.Identifier({
                id: "//aq/aas/"+String(id)+"/subs/ews",
                idType: IdentifierType.IRI
            })
        }).submodelOf(administrationShell);

        return ews;
    }

    addPropertyEWSIp(id,submodelEws,database,EwsIpQuery){
        let ewsIp =this.server.coreaas.addSubmodelProperty({
            browseName:"EWS Ip address",
            description: "L'ip dell'early warning system",
            idShort: "EWS Ip address/"+id,
            submodelElementOf: submodelEws,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.String,
            value: {
                dataType: "String",
                value:{
                    refreshFunc : function(callback) {
                        database.query( EwsIpQuery)
                            .then( result=> {
                                console.log(result[0].ip_address)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.String, value:result[0].ip_address}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/ews",
        })]);

        return ewsIp;
    }

    addPropertyEWSToken(id,submodelEws,database,EwsTokenQuery){
        let ewsToken =this.server.coreaas.addSubmodelProperty({
            browseName:"EWS Token",
            idShort: "EWS Token/"+id,
            submodelElementOf: submodelEws,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.String,
            value: {
                dataType: "String",
                value:{
                    refreshFunc : function(callback) {
                        database.query( EwsTokenQuery)
                            .then( result=> {
                                console.log(result[0].token)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.String, value:result[0].token}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/ews",
        })]);

        return ewsToken;
    }

    addPropertyEWSStatus(id,submodelEws,database,EwsStatusQuery){
        let ewsStatus =this.server.coreaas.addSubmodelProperty({
            browseName:"EWS Status",
            idShort: "EWS Status/"+id,
            submodelElementOf: submodelEws,
            kind: ModelingKind.Instance,
            category: PropertyCategory.VARIABLE,
            vaueType: PropertyValueType.Double,
            value: {
                dataType: "Double",
                value:{
                    refreshFunc : function(callback) {
                        database.query( EwsStatusQuery)
                            .then( result=> {
                                console.log(result[0].current_status)
                                var dataValue = new DataValue({
                                    value: new Variant({dataType: DataType.Double, value:result[0].current_status}),
                                    statusCode: StatusCodes.Good,
                                    sourceTimestamp: new Date()
                                });
                                callback(null,dataValue);
                            } ).catch(function(err){
                            console.log("Promise rejection error: "+err);
                        })
                    }
                }
            },
        }).addParent([new this.Key({
            idType: KeyType.IRI,
            local: true,
            type: KeyElements.Submodel,
            value: "//aq/aas/"+String(id)+"/subs/ews",
        })]);

        return ewsStatus;
    }


}

module.exports = {
    AssetAdministrationShellAcquedotto,
};

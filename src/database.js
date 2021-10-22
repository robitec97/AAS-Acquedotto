var mysql = require("mysql")

class Database{
    constructor(config){
        this.conn = mysql.createConnection(config)
    }

    connect(){
        this.conn.connect(function(err){
            if(err){
                console.log("error connecting");
                return;
            }
            console.log("connected succesfully");
        })
    }
    query(sql,args){
        return new Promise( (resolve, reject) => {
            this.conn.query(sql, args, (err,rows) => {
                if(err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
   close(){
       this.conn.end();
   }
}

module.exports = {
    Database,
};
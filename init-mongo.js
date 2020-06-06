db.createUser(
   {
     user: "root",
     pwd: "localdev", 
     roles: [ "readWrite", "dbAdmin", { w: "majority" , wtimeout: 5000 }]
     
   }
)

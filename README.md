# Cat Read Update Delete
[![Open in Coder](https://ixdcoder.com/open-in-coder.svg)](https://ixdcoder.com/templates/Node/workspace?name=CRUD&mode=auto&param.git_repo=https://bender.sheridanc.on.ca/system-design/crud&param.code_template=custom)

This NodeJS App uses Express and Mongoose to let users manage a database of cats. It allows for a full lifecycle of data including operations for Create Read Update and Delete.
  
# Setup
To use this demo, you must have a MongoDB Atlas instance. You must create an environment variable, containing the connection string that points to your own particular MongoDB Atlas Cluster. The example below shows what it may look like. Note that the trailing end of this string `mycats` refers to the name of a database. If it doesn't exist yet, that's ok (MongoDB will create it for us automatically).
                                  
```MONGODB=mongodb+srv://<userName>:<password>@cluster0.kto5g.mongodb.net/mycats?retryWrites=true&w=majority```
Change <password> for your password
Change <userName> for your username

## Connection String
You can retrieve your own connection string from the MongoDB Atlas dashboard. TIP: You may be able to retrieve your connection string from the MongoDB Compass Desktop client if you're already connected there.
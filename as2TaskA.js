//Task A-1
//mongoimport -d fit5148_db -c fire --type csv --file /home/student/Documents/FireData-Part1.csv --headerline

//2018-09-25T23:02:12.478+1000	connected to: localhost
//2018-09-25T23:02:12.541+1000	imported 2668 documents

//mongoimport -d fit5148_db -c climate --type csv --file /home/student/Documents/ClimateData-Part1.csv --headerline

//2018-09-25T23:03:06.981+1000	connected to: localhost
//2018-09-25T23:03:06.997+1000	imported 366 documents

//use fit_5148_db
use fit5148_db

//Task A-2 - find climate data on 15th December 2017 
db.climate.find({"Date": "2017-12-15"})
//{ "_id" : ObjectId("5baa320afa3c2e011bb73679"), "Station" : 948702, "Date" : "2017-12-15", "Air_Temperature_Celcius" : 18, "Relative_Humidity" : 52, "WindSpeed_knots" : 7.1, "Max_Wind_Speed" : 14, "Precipitation" : "0.00I" }

//Task A3 - Find Lat, Long, Surface Temp, Confidence where Surface Temp in between 65 and 100 degrees.
db.fire.find({"$and":[{"Surface_Temperature_Celcius":{"$gte":65}}, {"Surface_Temperature_Celcius":{"$lte":100}}]}, {"Latitude":1, "Longitude":1, "Surface_Temperature_Celcius":1, "Confidence":1})

//Task A4 - find Surface Temp, Air Temp, Rel Humidity and Max Wind Speed on 15th and 16th Dec 2017
db.fire.aggregate(  
      {$lookup:    
              {      
                from: "climate",
                localField: "Date",      
                foreignField: "Date",      
                as: "climate"   
              } 
      }, 
      {$match:
              {"Date":{"$in":["2017-12-15", "2017-12-16"]}}
      },
      {$project:
              {"Surface_Temperature_Celcius":1,
               "climate.Air_Temperature_Celcius":1,
               "climate.Relative_Humidity":1,
               "climate.Max_Wind_Speed":1
              } 
      }
).pretty()

//Task A-5 - find datetime, air temp, surface temp and confidence where confidence is between 80 and 100 
db.fire.aggregate( 
      {$lookup:        
              {          
               from: "climate",
               localField: "Date",          
               foreignField: "Date",          
               as: "climate"        
              } 
       }, 
       {$match:        
              {"$and":[{"Confidence":{"$gte":80}}, {"Confidence":{"$lte":100}}]}
       },
       {$project:
             {"Datetime":1,
              "climate.Air_Temperature_Celcius":1,
              "Surface_Temperature_Celcius":1,
              "Confidence":1
             }
       }
).pretty()

//Task A-6 Find top 10 records with highest surface temperature
db.fire.aggregate(
     {"$sort":
             {"Surface_Temperature_Celcius":-1}
     },
     {"$limit":10}
).pretty()


//Task A-7 Find the number of fires in each day
db.fire.aggregate(
     {$group:{_id:{Date:"$Date"}, Number_Of_Fires:{$sum:1}}},
     {$sort:{"_id.Date":1}}
)


//Task A-8 - Find the average surface temperature for each day 
db.fire.aggregate(
     {$group:{_id:{Date:"$Date"}, Avg_Surface_Temp:{$avg:"$Surface_Temperature_Celcius"}}},
     {$sort:{"_id.Date":1}}
)


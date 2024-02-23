require('dotenv').config();

const express = require('express');
const app = express();
const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');

const path = require('path');
const { on } = require('events');

app.use(express.static(__dirname + '/public'));
const filePath = path.resolve(__dirname, 'public/index.html');

// Uri til MongoDb
const uri = 'mongodb://localhost:27017';
const dbName = 'MAIN';

// MQTT Forbindelses parametre
const mqttHost = 'mqtt://10.71.202.234';
const mqttOptions = {
    clientId: 'rfid_handler',
    port: 1883
};
const topic = 'ScannedCardTopic';

// Her laver vi en MQTT Client
const client = mqtt.connect(mqttHost, mqttOptions);

// Her forbinder vi til MongoDB
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoClient.connect()
    .then(() => {
        console.log('Connected to MongoDB server');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// MQTT client errors
client.on("error", error => {
    console.error('MQTT client error:', error);
});

// Forbinder til MQTT broker
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic);
});

// Her håndtere vi message
client.on('message', async (topic, message) => {
    const user = message.toString();
    console.log(`Received message on topic ${topic}: ${user}`);
    // Query MongoDB for brugeren
    try {
        const db = mongoClient.db(dbName);
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ Employee_ID: user });
        if (existingUser) {
            let timeStamp = new Date();
            await collection.findOneAndUpdate({ Employee_ID: user }, {$push: {Login_Time: timeStamp}}); 
            io.emit('Verified', existingUser.Name);
            console.log(`User ${user} logged in at: ${timeStamp}`);
        } else {
            io.emit('Notverified')
            console.log(`User ${user} does not exist in the database`);
        }
    } catch (err) {
        console.error('Error querying MongoDB:', err);
    }
});

// Express route til at håndtere requests
app.get('/', (req, res) => {
    res.render(filePath);
});

// Start Express server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});

const io = require('socket.io')(server); 

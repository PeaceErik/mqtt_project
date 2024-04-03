# School project: MQTT, Linux and Embedded Programming.

In this project i worked alongside a classmate.
We made a RFID card reader app, that lets workers get into a company building.

* This is only the backend + frontend for the login screen, that ran on a screen next to the door.

We made a script in C++ that ran on a Arduino R4 wifi, with a RFID card reader soldered on top of it.
Then we encodded af couple of RFID cards, and stored the data in a MongoDB database.
When a card was scanned, the Arduino published info to MQTT topic, we then had a Raspberry pi 4, running linux,
setup with Mosquitto (MQTT broker).

The JS backend then handled the verification process and sent the data to the frontend.

The whole thing centret around a pretty cool design i made for the frontend, when a person scanned a card.


** If the code look like it was done in a rush, it is because it is 8)...
We originally had a whole other setup that failed us days before we had to present and demo the thing, so
we ended up starting from scratch, with 2 days to spare.

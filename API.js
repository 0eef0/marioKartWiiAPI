const express = require('express');
const app = express();
const path = require('path');
const { tracks, vehicles, characters } = require('./data');

// Home Page
app.get('/Oswald.ttf', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/Oswald.ttf'));
})
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/index.html'));
});

// All tracks and their times
app.get('/api/v1/tracks', (req, res) => {
    const tracksArr = tracks.map((trck) => {
        const { id, track, times, nscTimes } = trck;
        return { id, track, times, nscTimes }
    })

    res.json(tracksArr);
});

// Individual tracks and their times
app.get('/api/v1/tracks/:trackID', (req, res) => {
    const { trackID } = req.params;
    console.log(trackID);
    const singleTrack = tracks.find(
        (track) => track.id === Number(trackID) || track.track.split(' ').join('').replace("'",'').toLowerCase() === trackID
    );
    if(!singleTrack){
        return res.status(404).send('Track Does Not Exist');
    }
    return res.json(singleTrack);
});

// All vehicles and their stats
app.get('/api/v1/vehicles', (req, res) => {
    const vehiclesArr = vehicles.map((vehicle) => {
        const { id, name, type, weightClass, driftStyle, speed, weight, acceleration, handling, drift, offRoad, miniTurbo, total } = vehicle;
        return { id, name, type, weightClass, driftStyle, speed, weight, acceleration, handling, drift, offRoad, miniTurbo, total };
    });
    
    res.json(vehiclesArr);
});

// Random vehicle
app.get('/api/v1/vehicles/random', (req, res) => {
    const rand = vehicles[Math.floor(Math.random() * vehicles.length + 1)];
    return res.json(rand);
})

// Individual vehicles and their stats
app.get('/api/v1/vehicles/:vehicleID', (req, res) => {
    const { vehicleID } = req.params;
    const singleVehicle = vehicles.find(
        (vehicle) => vehicle.id === Number(vehicleID) || vehicle.name.split(' ').join('').replace("'",'').toLowerCase() === vehicleID
    );
    if(!singleVehicle){
        return res.status(400).send('Vehicle Does Not Exist');
    }
    return res.json(singleVehicle);
});

// Vehicles filtered by weight class, vehicle type, and drift style
app.get('/api/v1/vehicles/query', (req, res) => {
    const { weightClass, type, driftStyle, limit } = req.query;
    let sortedVehicles = [...vehicles];

    if(weightClass || type || driftStyle) {
        sortedVehicles = sortedVehicles.filter((vehicle) => {
            return (!weightClass || weightClass == vehicle.weightClass) && (!type || type == vehicle.type) && (!driftStyle || driftStyle == vehicle.driftStyle);
        })
    }
    if(limit) {
        sortedVehicles = sortedVehicles.slice(0, Number(limit));
    }
    if(sortedVehicles.length < 1) {
        return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json(sortedVehicles);
});

// All characters and their stats
app.get('/api/v1/characters', (req, res) => {
    const charactersArr = characters.map((character) => {
        const { id, name, weightClass, speed, weight, acceleration, handling, drift, offRoad, miniTurbo, total } = character;
        return { id, name, weightClass, speed, weight, acceleration, handling, drift, offRoad, miniTurbo, total };
    })

    res.json(charactersArr);
});

// Random character
app.get('/api/v1/characters/random', (req, res) => {
    const rand = characters[Math.floor(Math.random() * characters.length + 1)];
    res.json(rand);
})

// Individual characters and their stats
app.get('/api/v1/characters/:characterID', (req, res) => {
    const { characterID } = req.params;
    const singleCharacter = characters.find(
        (character) => character.id == Number(characterID) || character.name.split(' ').join('').replace("'",'').toLowerCase() === characterID
    )

    res.json(singleCharacter);
});

app.listen(5000,() => {
    console.log('Server is listening on Port 5000....')
});
const fs = require("fs")
const csv = require('csv-parser');


const maps = "src/maps"
const zoom = 13

// check for mapping post directory
try {
  if (fs.existsSync(maps)) {
    console.log(`${maps} Directory exists.`)
  } else {
    console.log(`${maps} Directory does not exist. Creating`)
  }
} catch(e) {
  console.log("An error occurred.")
}

const cities = [];

fs.createReadStream('cities.csv')
  .pipe(csv())
  .on('data', (data) => cities.push(data))
  .on('end', () => {
    createMapPosts(cities)
  });

function createMapPosts(cities) {
  for (var i = 0; i < 10; i++) {
    // city post markdown file path
    let cityName = cities[i].nameascii
    let countryName = cities[i].sov0name
    let mapPostPath = `${maps}/${cityName}-${countryName}.md`

    // see if it exists
    try {
      if (fs.existsSync(mapPostPath)) {
        console.log(`${mapPostPath} post exists.`)
        cities.splice(cities[i])
      } else {
        console.log(`${mapPostPath} post does not exist. Creating`)

const template = `---
title: ${cityName}, ${countryName}
description: A map of ${cityName} showing the result of ~50m of sealevel rise.
author: Stephen R Smith
tags:
  - ${countryName}
city: ${cityName}
country: ${countryName}
centerx: ${cities[i].longitude}
centery: ${cities[i].latitude}
zoom: ${zoom}
---
`

        fs.writeFileSync(mapPostPath, template, err => {
          if (err) {
            console.log("error in creating city file:");
            console.log(err);
            return
          }
          console.log(`created ${mapPostPath}`);
        })
      }
    } catch(e) {
      console.log("An error occurred in checking for a city post.")
    }

    // create the post
  }
}

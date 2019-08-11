import axios from 'axios'

let logger = global.logger
let siteProps = global.siteProps

export async function getAplace (placeType, longitude, latitude) {
  let geoCodes = { Longitude: longitude, Latitude: latitude }
  let results = await getListByPlace(placeType, geoCodes)
  return results
}

export async function getPlace (address) {
  let geoCodes = await getGeoCodes(address)
  let results = { geoCodes }
  let places = [
    'Restaurants',
    'Hospitals',
    'Schools',
    'Banks',
    'Malls',
    'Churches',
    'Hotels',
    'pubs',
    'supermarket'
  ]
  logger.info('geocodes', geoCodes)
  await Promise.all(places.map(async place => {
    results[place] = await getListByPlace(place, geoCodes)
  }))
  return results
}

async function getGeoCodes (address) {
  address = address.replace(/\s/g, '+')
  let url = `${siteProps.googleGeocodeUrl}?app_id=${siteProps.googleAppId}&app_code=${siteProps.googleAppCode}&searchtext=${address}`
  return axios.get(url)
    .then(result => {
      return result.data.Response.View[0].Result[0].Location.DisplayPosition
    })
    .catch(error => {
      logger.error('geocodes', error.message)
      return error
    })
}

async function getListByPlace (place, geoCodes) {
  let url = `${siteProps.googlePlaceUrl}?at=${geoCodes.Latitude},${geoCodes.Longitude}&q=${place}&app_id=${siteProps.googleAppId}&app_code=${siteProps.googleAppCode}`
  logger.info('url:', url)
  return axios.get(url)
    .then(response => response.data)
    .catch(error => {
      logger.error(error.message)
      throw error
    })
}

export function distance (lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0
  } else {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
  }
}

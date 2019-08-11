import express from 'express'
import bodyParser from 'body-parser'
import * as GetPlace from './GetPlace'

let logger = global.logger
let siteProps = global.siteProps
let app = express()
let start = () => {
  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
      extended: false
    }))
    .post('/address/neighbourhood', async (req, res) => {
      let address = req.body.address
      try {
        let places = await GetPlace.getPlace(address)
        res.json(places)
      } catch (err) {
        if (err.statusCode) {
          res.status(err.statusCode).send('error: ' + err.statusCode + ', message: ' + err.statusText)
        } else {
          res.status(404).send(err.message || err)
        }
      }
    })
    .get('/place/:placetype/:longitude/:latitude', async (req, res) => {
      let address = req.params.placetype
      let longitude = req.params.longitude
      let latitude = req.params.latitude
      try {
        let places = await GetPlace.getAplace(address, longitude, latitude)
        res.json(places)
      } catch (err) {
        if (err.statusCode) {
          res.status(err.statusCode).send('error: ' + err.statusCode + ', message: ' + err.statusText)
        } else {
          res.status(404).send(err.message || err)
        }
      }
    })
    .listen(siteProps.port, (error) => {
      if (error) {
        logger.error(error.message)
        throw error
      }
      logger.info('Application running on port 3002')
    })
}

start()

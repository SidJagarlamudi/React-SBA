import { combineReducers } from 'redux'
import auth from './auth'
import locations from './locations'
import stats from './stats'
import cities from './cities'
import coords from './search'

export default combineReducers({
  auth: auth,
  locations,
  stats,
  cities,
  coords
})

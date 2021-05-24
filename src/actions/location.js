export const fetchLocationsSuccess = (locations) => {
  return {
    type: 'FETCH_LOCATIONS_SUCCESS',
    locations
  }
}

export const createLocationSuccess = (newLocation) => {
  return {
    type: 'CREATE_LOCATION_SUCCESS',
    newLocation
  }
}

export const deleteLocationSuccess = (id) => {
  return {
    type: 'DELETE_LOCATION_SUCCESS',
    id
  }
}
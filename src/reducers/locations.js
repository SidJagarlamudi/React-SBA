export default function locations(state=[], action) {
  switch(action.type) {
    case 'FETCH_LOCATIONS_SUCCESS':
      return [...action.locations]
    case 'CREATE_LOCATION_SUCCESS':
      return [...state, action.newLocation]
    case 'DELETE_LOCATION_SUCCESS':
      return state.filter(location => location.id !== action.id)
    default: 
      return state
  }
}
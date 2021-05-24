export default function cities(state=[], action) {
  switch(action.type) {
    case 'FETCH_CITIES_SUCCESS':
      return [...action.cities]
    default: 
      return state
  }
}
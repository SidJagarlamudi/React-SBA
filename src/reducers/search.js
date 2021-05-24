export default function coords(state=null, action) {
  switch(action.type) {
    case 'FETCH_SEARCH_SUCCESS':
      return action.coords
    default: 
      return state
  }
}
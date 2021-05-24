export default function stats(state=[], action) {
  switch(action.type) {
    case 'FETCH_STAT_SUCCESS':
      return [...action.stats]
    default: 
      return state
  }
}
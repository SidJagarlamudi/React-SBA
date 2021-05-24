import React from 'react';
import { connect } from 'react-redux'
import { currentUser } from '../actions/auth'
import NewsCard from './NewsCard';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import GridListTile from '@material-ui/core/GridListTile';
import Particles from 'react-particles-js';



class NewsFeed extends React.Component {

  state = {
    newsArticles: []
  }
  
  componentDidMount(){
      fetch("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=false&pageNumber=1&pageSize=50&q=climate%20change&safeSearch=false", {
	      "method": "GET",
      	"headers": {
	    	"x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
	    	"x-rapidapi-key": "c5855f8358mshe884588b34ae70ep1a1627jsn5e1e97c23a80"
	    }
      })
      .then(resp => resp.json())
      .then(newss => {
        let articlesWithImgs = newss.value.filter((article)=>{
          return article.image.url !== ""
        })
        this.setState({
          newsArticles: articlesWithImgs
        })
      })
  }

  handleSelect = (e) => {
    if (e.target.value === 1){
      const ascendingArr = this.state.newsArticles.sort((a, b) => {
        let firstDate = new Date(a.datePublished)
        let secondDate = new Date(b.datePublished)
        return firstDate - secondDate
      })
      this.setState({
        newsArticles: ascendingArr
      })
    } else {
      const decArr = this.state.newsArticles.sort((a, b) => {
        let firstDate = new Date(a.datePublished)
        let secondDate = new Date(b.datePublished)
        return secondDate - firstDate
      })
      this.setState({
        newsArticles: decArr
      })
    }
  }

  test = () => {
    return this.state.newsArticles.map((art)=>{
      return <GridListTile key={art.id}>
      {art.image.url}
    </GridListTile>
    })
  }

  render(){ 
      return (
        <div style={{backgroundColor: '#000000', color: '#FFFFFF'}}>
          
          <p>&nbsp;</p>
        <FormControl>
        <InputLabel style={{color:'white', zIndex: 4, left: '4%'}} htmlFor="grouped-native-select">Filter By:</InputLabel>
        <Select style={{color:'white', zIndex: 3, backgroundColor: '#303030', borderRadius: '8px'}} className='news-filter' native defaultValue="" id="grouped-native-select" onChange={this.handleSelect}>
          <option aria-label="None" value="" />
          <optgroup label="Date Published" className='maybe'>
            <option value={1}>↑ Ascending (Oldest to Newest)</option>
            <option value={2}>↓ Descending (Newest to Oldest)</option>
          </optgroup>
        </Select>
      </FormControl>
      <p>&nbsp;</p>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            >
          {this.state.newsArticles.map(article => (
            <Grid item xs={4} style={{zIndex: 2}}>
              <NewsCard article={article}/>
            </Grid>
          ))}
  </Grid>
  <Particles
      width='100vw'
      height='4000px'
    canvasClassName={'particles2'}
    params={{
	    "particles": {
	        "number": {
	            "value": 200,
	            "density": {
	                "enable": true,
	                "value_area": 2000
	            }
	        },
	        "line_linked": {
	            "enable": true,
	            "opacity": 0.1
	        },
	        "move": {
	            "direction": "right",
	            "speed": 0.20
	        },
	        "size": {
	            "value": 1
	        },
	        "opacity": {
	            "anim": {
	                "enable": true,
	                "speed": 1,
	                "opacity_min": 0.05
	            }
	        }
	    },
	    "retina_detect": true
	}} />
  
  
        </div>)
  };
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    current_user: state.currentUser,
  }
}

const mapDispatchToProps = {
  currentUser
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
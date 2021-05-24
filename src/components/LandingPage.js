import React from "react";
import { Fade } from "react-reveal";
import Clymanew from '../images/Clymanew.png'
import Particles from 'react-particles-js';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Geocode from "react-geocode";



class LandingPage extends React.Component {

	state={
		address: ''
	}

	handleSubmit = (value) => {
		Geocode.setApiKey("AIzaSyDmc1KD6Xr80d3hduc4Q2MObw1uotQuY-8");
    Geocode.fromAddress(`${value.description}`).then((response) => {
			const { lat, lng } = response.results[0].geometry.location;
			localStorage.setItem("searchLat", lat)
			localStorage.setItem("searchLng", lng)
			this.props.history.push("/map");
		})
	}
	
  render(){
    return <div style={{display: 'flex', justifyContent: 'center'}}>
      <Fade left duration={2000} distance="40px">
				<div className='intro'>
					<h1 style={{fontFamily: 'Audiowide', fontSize: '35pt'}}>Introducing</h1>
				</div>
        <div className='lp-logo'>
         
        </div>
      </Fade>
			<div className='slogan'>
			<Fade left duration={2000}>
				<h2>Access real-time air quality readings and forecasts for anywhere in the world.</h2>
			</Fade>
			</div>
		
			<Fade right duration={1000}>
			<div className="search-lp">
              <GooglePlacesAutocomplete
                ref={(search) => (this._search = search)}
                onSelect={this.handleSubmit}
                inputStyle={{
									border: '#FFFFFF',
                  background: "none",
                  color: "#FFFFFF",
                  "border-radius": "1px",
                }}
                placeholder="🔎 Search Anywhere!"
                suggestionsStyles={{
                  background: "none",
                  "border-radius": "1px",
                }}
              />
            </div>
			</Fade>
      <div class='part-cntr'>
      <Particles
      style={{width: '100%', height: '100%'}}
    canvasClassName={'particles'}
    params={{
	    "particles": {
	        "number": {
	            "value": 60,
	            "density": {
	                "enable": true,
	                "value_area": 1500
	            }
	        },
	        "line_linked": {
	            "enable": true,
	            "opacity": 0.1
	        },
	        "move": {
	            "direction": "right",
	            "speed": 0.10
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
	    "interactivity": {
	        "events": {
            "onhover": {
              "enable": true,
              "mode": "connect"
          },
	            "onclick": {
	                "enable": true,
	                "mode": "push"
	            }
	        },
	        "modes": {
	            "push": {
	                "particles_nb": 1
              },
              "connect": {
                'opacity': 5,
            }
          }
	    },
	    "retina_detect": true
	}} />
    </div>
    <img src='https://www.tmrow.com/static/5c33e6e4f32b13a7a70c2a4612f31647/097fa/climatestage-background1.jpg' alt='bg'></img>
    </div>
  }
}


export default (LandingPage)
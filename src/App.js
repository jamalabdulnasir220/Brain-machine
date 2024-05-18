import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


  const returnClarifaiRequestOptions = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = 'd86eae173fe9422daa25841f33d6a51c';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'jamal123';       
  const APP_ID = 'brain';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';    
  const IMAGE_URL = imageUrl;

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  return requestOptions;

  }

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }
}

class App extends Component {

  constructor() {
    super();

    this.state = initialState
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {

    const clarifaiData = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiData.left_col * width,
      topRow:  clarifaiData.top_row * height,
      rightCol: width - (clarifaiData.right_col * width),
      bottomRow: height - (clarifaiData.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }
  

 onInputChange = (event) => {
  this.setState({input: event.target.value})
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});

  fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
  .then(response => response.json())
  .then(result => {
    if (result) {
      fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
      .then( response => response.json())
      .then( count => {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
      .catch(console.log)
    } 
    this.displayFaceBox(this.calculateFaceLocation(result))
  })
  .catch(error => console.log('clarifai api fails'));
}

onRouteChange = (route) => {
  if( route === 'signout') {
    this.setState(initialState)
  }
  else if( route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}




  render() {

    const { isSignedIn } = this.state
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

        { this.state.route === 'home' 
        ?
        <div>
        <Logo />
        {/* <Rank  name={this.state.user.name} entries={this.state.user.entries}/> */}
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition  imageUrl={this.state.imageUrl} box={this.state.box}/>
    </div>
        
        :
        (
          this.state.route === 'signin' ?
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />  
           :
           <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
              
       
       
    }
      </div>
    );
  }
 
}

export default App;





//   render() {
//   return (
//     <div className="App">
//       <ParticlesBg type="circle" bg={true} />
//       <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
//       { this.state.route === 'signin' 
//       ?
//       <div>
//         <Logo />
//         {/* <Rank  name={this.state.user.name} entries={this.state.user.entries}/> */}
//         <Rank name='jamal' entries='0' />
//         <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
//         <FaceRecognition  imageUrl={this.state.imageUrl} box={this.state.box}/>
//     </div>
//       :
//       (
//         this.state.route === 'signin'
//         ?
//         <Signin onRouteChange={this.onRouteChange} /> 
//         :
//         <Register onRouteChange={this.onRouteChange} /> 
//       )
     
//   }
//     </div>
//   );
// }
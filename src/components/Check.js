import React, { useEffect, useState } from 'react';
import './App.scss';
import firebase from './utils/firebase';
import { useForm } from 'react-hook-form';
import Checkbox from './components/checkbox'


const PlantDropdown = () => {
  let [vegetable, setVegetable] = useState("tomato");

  const handleSubmit = (event) => {
    // TO-DO: ping API using "vegetable"
    const ref = firebase.database().ref("Vegetable");
    
    const push = (vegData) => {
      ref.push(vegData);
      console.log("Pushed successfully");
      event.preventDefault();
    }

    if (vegetable = "lettuce") {
      const vegData = {
        name: vegetable,
        sciname: "Lactuca sativa",
        season: "spring",
        waterdescription: "Lettuce need a constant, \
        moderate supply of water.",
        numwater: 2,
        tips: 
        "Start germinating lettuce seeds a few weeks \
        before the last frost. The seedlings should be kept \
        under direct sunlight, and they can be transplanted \
        in spring. For hot weather, a thin layer of mulch \
        can help retain water.",
      }
      push(vegData);
    }

    if (vegetable = "tomato") {
      const vegData = {
        name: vegetable,
        sciname: "Solanum lycopersicum",
        season: "late spring to early summer",
        waterdescription: "Tomatoes should be watered \
        slowly and deeply. They also need to be watered \
        regularly, and it is the most efficient to water \
        straight to the roots.",
        numwater: 7,
        tips: 
        "Tomatoes run on warmth, so they should be planted \
        in the late spring and early summer. They need at \
        least 6-8 hours of sun every day, and a stake, \
        trellis, or cage can help keep the plant off the \
        ground.",
      }
      push(vegData);
    }
  }

  const handleChange = (event) => {
    setVegetable(event.target.value);
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>Pick your vegetable:  
        <select value={vegetable} onChange={handleChange}>
          <option value="tomato">Tomato</option>
          <option value="squash">Squash</option>
          <option value="lettuce">Lettuce</option>
          <option value="pea">Peas</option>
          <option value="cucumber">Cucumber</option>
          <option value="bell pepper">Bell Pepper</option>
        </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}



const MyGarden = () => {
  const [garden, setGarden] = useState([]);
  const ref = firebase.database().ref('Vegetable');

  useEffect(() => {
    ref.on('value', (snapshot) => {
      let snap = snapshot.val();
  
      if (snap === null) {
        snap = 2;
        console.log("null value");
      } else {
        const arraysnap = Object.values(snap);
        setGarden(arraysnap);
        console.log(arraysnap);
      }

    });
  }, [])

  const printVegetables = garden.map((vegetable, index) => {
    return (
      <div key={index}>
        <p>{vegetable.name}</p>
        <p>{vegetable.waterdescription}</p>
        <p>{vegetable.numwater}</p>
        <p>{vegetable.tips}</p>
      </div>
    )
  })

  return (
    <div className="showGarden">
      <h1>Your Garden:</h1>
      {printVegetables}
    </div>
  );
}
 
const clicked = () => {
  console.log("clicked")
} 

const makeButton = () => {
  return(
    <body>   
      <form>
        <input type = "radio" name="question" value ="yes" onclick = "clicked()"/>Yes
        <input type = "radio" name="question" value ="no" />No
      </form>
    </body>
  );
}

const App = () => {

  return (
    <div className="outer-box">
      <header className="header">
        <p className="title">PlantFriend</p>       
      </header>

      <PlantDropdown />
      <div className="garden">
        <MyGarden/>
      </div>
      <div>
        <Checkbox/>
      </div>
      <div>
        <makeButton/>
      </div>
    </div>
    
  );
};

export default App;
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
import React, { useEffect, useState } from "react";
import "./App.scss";

import firebase from "./utils/firebase";
import "firebase/auth";
import "firebase/database";

import { Container } from "react-bootstrap";
import Signup from "./components/Signup";
import { AuthProvider } from "./components/contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Logout from "./components/Logout"
import { useFieldArray } from "react-hook-form";

const PlantDropdown = ({uid}) => {
  let [vegetable, setVegetable] = useState("tomato");
  const ref = firebase.database().ref(uid);

  const handleSubmit = (event) => {
    const push = (vegData) => {
      ref.push(vegData);
      console.log("Pushed successfully");
      event.preventDefault();
    };

    if (vegetable === "lettuce") {
      const vegData = {
        name: vegetable,
        sciname: "Lactuca sativa",
        season: "spring",
        waterdescription: "Lettuce need a constant, moderate supply of water.",
        numwater: 2,
        tips:
          "Start germinating lettuce seeds a few weeks before the last frost. The seedlings should be kept under direct sunlight, and they can be transplanted in spring. For hot weather, a thin layer of mulch can help retain water.",
      };
      push(vegData);
    } else if (vegetable === "tomato") {
      const vegData = {
        name: vegetable,
        sciname: "Solanum lycopersicum",
        season: "late spring to early summer",
        waterdescription:
          "Tomatoes should be watered slowly and deeply. They also need to be watered regularly, and it is the most efficient to water straight to the roots.",
        numwater: 7,
        tips:
          "Tomatoes run on warmth, so they should be planted in the late spring and early summer. They need at least 6 to 8 hours of sun every day, and a stake, trellis, or cage can help keep the plant off the ground.",
      };
      push(vegData);
    }
  };

  
  const handleChange = (event) => {
    setVegetable(event.target.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pick your vegetable:
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
  );
};

// Garden gets garden data 
const Garden = ({uid}) => {
  const [garden, setGarden] = useState([]);
  const ref = firebase.database().ref(uid);
  
  useEffect(() => {
    ref.on("value", (snapshot) => {
      let snap = snapshot.val();
      if (snap !== null) {
        const arraysnap = Object.values(snap);
        setGarden(arraysnap);
      }
    });
  }, []);

  const printVegetables = garden.map((vegetable, index) => {
    return (
      <div key={index}>
        <p>{vegetable.name}</p>
        <p>{vegetable.waterdescription}</p>
        <p>{vegetable.numwater}</p>
        <p>{vegetable.tips}</p>
      </div>
    );

  });

  return (
    <div className="showGarden">
      <h1>Your Garden:</h1>
      {printVegetables}
    </div>
  );
};

const WaterPlants = ({uid, points, setPoints}) => {
  const [wateredPlants, setWateredPlants] = useState(false);

  const handleSubmit = (e) => {
    const ref = firebase.database().ref(uid);
    e.preventDefault();
    if (wateredPlants) {
      ref.once("value").then(function(snapshot){
        if (!snapshot.child("points").exists()) {
          setPoints(10);
          ref.push({
            "points": 10
          });
        } else {
          setPoints(points+10);
          ref.update({
            "points": points+10
          });
        }
        
        // return points
      }
    )
  }}
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="radio"
            name="question"
            value="yes"
            checked={wateredPlants}
            onChange={() => {
              setWateredPlants(true);
            }}
          />
          Yes
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="question"
            value="no"
            checked={!wateredPlants}
            onChange={() => {
              setWateredPlants(false);
            }}
          />
          No
        </label>
      </div>
      <div>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

const PlantFriend = () => {
  return (
    <p>TEMP</p>
  )
}

const ProgressBar = ({points}) => {
  let i = 0
  const update = () => {
    if (i===0) {
      let elem = document.getElementById("progress-bar");
      let width = 1;
      let id = setInterval(frame, 10);

      const frame = () => {
        if (width>= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%"
          elem.innerHTML = width + "%";
        }
      }
    }
  }

  return (
    <div className = "progress-status">
      <div className = "progress-bar"></div>
      <button onclick = "update()">Click Me</button>
    </div>
  )
}

const App = () => {
  const [points, setPoints] = useState(0);
  const user = firebase.auth().currentUser;

  return (
    <div>
      <div className="outer-box">
        <div className='header-bar'>
          <div className="placeholder"/>
          <header className="header">
            <p className="title">PlantFriend</p>
          </header>
          {!user && <Login className="log"/>}
          {user && <Logout className="log"/>}
        </div>
        {!user && (
          <div className='signup-wrapper'>
            <div>
              <Signup />
            </div>
          </div>
        )}
        {user && 
          <div className='body'>
            <div className='plant-friend-wrapper'>
              <p>PLANTFRIEND</p>
              <PlantFriend />
              <ProgressBar points={points}/>
            </div>
            <div className='garden-wrapper'>
              <p>GARDEN</p>
              <Garden uid={String(user.uid)} />
              <WaterPlants uid={String(user.uid)} points={points} setPoints={setPoints} />
            </div>
          </div>
      }
      </div>
    </div>
  );
};

export default App;

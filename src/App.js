import React, { useEffect, useState } from "react";
import "./App.scss";

import firebase from "./utils/firebase";
import "firebase/auth";
import "firebase/database";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout"

const PlantDropdown = ({uid}) => {
  let [vegetable, setVegetable] = useState("tomato");

  const handleSubmit = (event) => {
    event.preventDefault();

    let ref = null;
    if (uid == null) {
      const currentUser = firebase.auth().currentUser;
      ref = firebase.database().ref(currentUser.uid);
    }
    else {
      ref = firebase.database().ref(uid);
    }

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
    <form className="add-veggie" onSubmit={handleSubmit}>
      <label>
        Add a vegetable to your garden: 
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

const Vegetable = ({vegetable}) => {
  const getImage = (name) => {
    if (name == 'tomato') {
      return <img src='tomato.png'/>
    } else if (name == 'peas') {
      return <img src='peas.png'/>
    } else if (name == 'lettuce') {
      return <img src='lettuce.png'/>
    } else if (name == 'bell pepper') {
      return <img src='bell_pepper.png'/>
    } else if (name == 'cucumber') {
      return <img src='cucumber.png'/>
    } else if (name == 'squash') {
      return <img src='squash.png'/>
    } 
  }

  return (
    <div className='vegetable'>
      <div className='image'>
        {getImage(vegetable.name)}
        <p><span className='start'>Vegetable:</span> {vegetable.name[0].toUpperCase() + vegetable.name.slice(1)}</p>
      </div>
      <p><span className='start'>Scientific Name:</span> {vegetable.sciname}</p>
      <p><span className='start'>Watering Schedule:</span> {vegetable.waterdescription}</p>
      <p><span className='start'>Care Tips:</span> {vegetable.tips}</p>
    </div>
  )
}

// Garden gets garden data 
const Garden = ({uid}) => {
  const [garden, setGarden] = useState([]);
  
  useEffect(() => {
    let ref = null;
    if (uid == null) {
      const currentUser = firebase.auth().currentUser;
      ref = firebase.database().ref(currentUser.uid);
    }
    else {
      ref = firebase.database().ref(uid);
    }

    ref.on("value", (snapshot) => {
      let snap = snapshot.val();
      if (snap !== null) {
        const arraysnap = Object.values(snap);
        setGarden(arraysnap);
      }
    });
  }, []);

  const printVegetables = garden.map((vegetable, index) => {
    if (!vegetable.name) {
      return;
    }

    return (
      <div key={index}>
        <Vegetable vegetable={vegetable} />
      </div>
    );

  });

  return (
    <div className="garden">
      <div className="garden-header">
        <h1>Your Garden:</h1>
        <PlantDropdown />
      </div>
      <div className='veggie-garden'>
        {printVegetables}
      </div>
    </div>
  );
};

const WaterPlants = ({uid, points, setPoints}) => {
  const [wateredPlants, setWateredPlants] = useState(false);

  const handleSubmit = (e) => {
    let ref = null;
    if (uid == null) {
      const currentUser = firebase.auth().currentUser;
      ref = firebase.database().ref(currentUser.uid);
    }
    else {
      ref = firebase.database().ref(uid);
    }

    e.preventDefault();
    if (wateredPlants) {
      ref.once("value").then(()=>{
        setPoints(points+10);
        ref.update({
          "points": points+10
        });
      }
    )
  }}
  return (
    <div className="buttons">
      <p>Did you water your plants today?</p>
      <form className="radio-buttons" onSubmit={handleSubmit}>
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
    </div>
  );
};

const PlantFriend = ({level}) => {
  return (
    <div className='plant'>
      <img
        src='plant.png'
        style={{ width: `${(level+1)*75}px` }}
      />
      <img id='pot' src='pot.png' />
    </div>
  )
}

const ProgressBar = ({points, level}) => {
  return (
    <div className = "progress-status">
      <progress value={points} max="100" />
      <p style={{fontWeight: '800'}}>Level {level}</p>
    </div>
  )
}

const App = () => {
  const [level, setLevel] = useState(0)
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState(false);
  const [vegetable, setVegetable] = useState({});

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser == null) {
      return;
    }

    setUser(currentUser);
    const userRef = firebase.database().ref(String(currentUser.uid));

    userRef.once("value").then(function(snapshot) {
      const val = snapshot.child("points").val();
      if (val === null) {
        setPoints(0);
        userRef.set({
          "points": 0
        });
      } else {
        setPoints(val % 100);
        setLevel(val / 100);
      }
    })
  }, [])

  useEffect(() => {
    if (points >= 100) {
      setLevel(level+1);
      setPoints(0);
    }
  }, [points])

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    setUser(currentUser);
  }, [user])

  return (
    <div>
      <div className="outer-box">
        <div className='header-bar'>
          <header className="header">
            <p className="title">PlantFriend</p>
          </header>
        </div>
        {!user && (
          <div className='signup-wrapper'>
            <div className='signup-login'>
              <Signup />
              <Login />
            </div>
          </div>
        )}
        {user && 
          <div className='body-wrapper'>
            <div className='body'>
              <div className='plant-friend-wrapper'>
                <PlantFriend level={level} />
                <ProgressBar points={points} level={level+1}/>
                <WaterPlants
                  uid={String(user.uid)}
                  points={points}
                  setPoints={setPoints}
                  level={level}
                />
              </div>
              <div className='garden-wrapper'>
                <Garden uid={String(user.uid)} />
              </div>
              <div id='plant-card-wrapper'>
                <div id='plant-title'>
                </div>
                <div id='plant-description'>
                </div>
              </div>
            </div>
          </div>
      }
      {user &&
            <div className='logout-button'>
              <Logout></Logout>
            </div>
          }
      </div>
    </div>
  );
};

export default App;

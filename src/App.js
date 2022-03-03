import './App.css';
import {useEffect, useState} from "react";
import {sortBy} from 'lodash'

const cc = 'Cross-Country'
const dirt = 'Dirt'
const road = 'Road'

const s = 'S1-900'
const a = 'A-800'
const b = 'B-700'
const c = 'C-600'
const d = 'D-500'

const classicRally = 'Classic Rally';
const pickups4X4s = 'Pickups & 4X4s';
const classicRacers = 'Classic Racers';
const hoonigan = 'Hoonigan';
const heavyHitters = 'Heavy Hitters';
const modernMuscle = 'Modern Muscle';
const ruleBritannia = 'Rule Britannia';
const anythingGoes = 'Anything Goes';
const upgradeHeroes = 'Upgrade Heroes';
const superSaloons = 'Super Saloons';
const evoVsImpreza = 'Evo vs Impreza';
const suvs = 'SUVs';
const unlimitedOffroad = 'Unlimited Offroad';
const bmw = "BMW";
const retroRally = 'Retro Rally';
const chevyVsDodge = 'Chevy vs Dodge';
const buggies = 'Buggies';
const reasonablyPriced = 'Reasonably Priced';
const landRover = 'Land Rover';

let pickupsCc = {"carType": pickups4X4s, "classType": c, "raceType": cc};
let classicRacersS = {"carType": classicRacers, "classType": s, "raceType": road};
const anythingDirtS = {"carType": anythingGoes, "classType": s, "raceType": dirt};
const anythingRoadA = {"carType": anythingGoes, "classType": a, "raceType": road};
const anythingCcA = {"carType": anythingGoes, "classType": s, "raceType": cc};
const tours = [
  anythingRoadA,
  {"carType": reasonablyPriced, "classType": b, "raceType": road},
  anythingDirtS,
  {"carType": anythingGoes, "classType": b, "raceType": cc},
  {"carType": landRover, "classType": a, "raceType": dirt},
  {"carType": unlimitedOffroad, "classType": a, "raceType": cc},
  anythingRoadA,
  {"carType": classicRally, "classType": b, "raceType": dirt},
  pickupsCc,
  classicRacersS,
  {"carType": hoonigan, "classType": s, "raceType": dirt},
  {"carType": heavyHitters, "classType": a, "raceType": cc},
  {"carType": modernMuscle, "classType": s, "raceType": road},
  {"carType": ruleBritannia, "classType": a, "raceType": dirt},
  anythingCcA,
  {"carType": upgradeHeroes, "classType": s, "raceType": road},
  anythingDirtS,
  pickupsCc,
  {"carType": superSaloons, "classType": a, "raceType": road},
  {"carType": evoVsImpreza, "classType": b, "raceType": dirt},
  {"carType": suvs, "classType": a, "raceType": cc},
  classicRacersS,
  {"carType": unlimitedOffroad, "classType": a, "raceType": dirt},
  anythingCcA,
  {"carType": bmw, "classType": a, "raceType": road},
  {"carType": retroRally, "classType": c, "raceType": dirt},
  pickupsCc,
  {"carType": anythingGoes, "classType": s, "raceType": road},
  {"carType": chevyVsDodge, "classType": s, "raceType": dirt},
  {"carType": buggies, "classType": d, "raceType": cc},
];

const tourIndexToSecondsPastHour = index => index * 120;

const formatSecondsToMMSS = seconds => `${Math.floor(seconds / 60)}:${seconds % 60}`

function App() {
  const [now, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000)
    return () => {
      clearInterval(timer);
    }
  }, [])

  const secondsPastHour = now.getMinutes() * 60 + now.getSeconds();

  const sortedTours = sortBy(
    tours.map((tour, index) => {
      const tourTime = tourIndexToSecondsPastHour(index);
      const secondsUntil = tourTime - secondsPastHour;
      return ({
        ...tour,
        tourTime,
        secondsUntil: secondsUntil < 0 ? secondsUntil + 3600 : secondsUntil,
      });
    }),
    'secondsUntil'
  )

  return (
    <div className="App">
      <p>{now.toLocaleTimeString()}</p>
      {sortedTours.map(tour => <div>
        {tour.classType} {tour.raceType} {tour.carType} {formatSecondsToMMSS(tour.secondsUntil)}
      </div> )}
    </div>
  );
}

export default App;

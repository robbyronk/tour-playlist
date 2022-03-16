import './App.css';
import {useEffect, useState} from "react";
import {filter, includes, padStart, sortBy, xor} from 'lodash'
import clsx from 'clsx'

const cc = 'Cross-Country'
const dirt = 'Dirt'
const road = 'Road'

const s = 'S1'
const a = 'A'
const b = 'B'
const c = 'C'
const d = 'D'
const pi = {
  [s]: 900,
  [a]: 800,
  [b]: 700,
  [c]: 600,
  [d]: 500,
};

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

const formatSecondsToMMSS = seconds =>
  `${padStart(Math.floor(seconds / 60), 2, '0')}:${padStart(seconds % 60, 2, '0')}`

function ClassType({classType, className, onClick}) {
  return <button
    onClick={onClick}
    className={clsx('class-type', {
      's1': s === classType,
      'a': a === classType,
      'b': b === classType,
      'c': c === classType,
      'd': d === classType,
    }, className)}
  >
    {classType} <span className="pi">{pi[classType]}</span>
  </button>
}

function RaceType({raceType, className, onClick}) {
  return <button
    onClick={onClick}
    className={clsx(className, 'race-type', {
      'cc': cc === raceType,
      'dirt': dirt === raceType,
      'road': road === raceType,
    })}
  >
    {raceType}
  </button>
}

function Tour({tour, setRaces, setClasses}) {
  return <div className={clsx( 'flex-center',{'queue-now': tour.secondsUntil < 120, 'next-up': tour.secondsUntil < 240 && !(tour.secondsUntil < 120)})}>
    <div className={'tour flex-center'}>
      <ClassType classType={tour.classType} onClick={() => setClasses([tour.classType])}/>
      <RaceType raceType={tour.raceType} onClick={() => setRaces([tour.raceType])}/>
      <span className={'mr-2'}>{tour.carType}</span>
      <span className={clsx({'text-red': tour.secondsUntil < 60})}>{formatSecondsToMMSS(tour.secondsUntil)}</span>
    </div>
  </div>
}

const allClasses = [s, a, b, c, d];

function ClassPicker({classes, set}) {
  return <div className={'picker'}>
    {
      allClasses.map(cls => <ClassType
        key={cls}
        classType={cls}
        className={clsx({'disabled': !includes(classes, cls)})}
        onClick={() => set(xor(classes, [cls]))}
      />)
    }
  </div>
}

const allRaces = [road, dirt, cc];

function RacePicker({races, set}) {
  return <div className={'picker'}>
    {
      allRaces.map(race => <RaceType
        key={race}
        raceType={race}
        className={clsx({'disabled': !includes(races, race)})}
        onClick={() => set(xor(races, [race]))}
      />)
    }
  </div>
}

function App() {
  const [now, setTime] = useState(new Date());
  const [shownRaces, setShownRaces] = useState(allRaces);
  const [shownClasses, setShownClasses] = useState(allClasses);

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
        key: index
      });
    }),
    'secondsUntil'
  );
  const filteredTours = filter(
    sortedTours,
    tour => includes(shownRaces, tour.raceType) && includes(shownClasses, tour.classType)
  );

  return (
    <div className="App">
      <p>{now.toLocaleTimeString()}</p>
      <ClassPicker classes={shownClasses} set={setShownClasses}/>
      <RacePicker races={shownRaces} set={setShownRaces}/>
      <div className="tours">
        {filteredTours.map(tour => <Tour key={tour.key} tour={tour} setRaces={setShownRaces} setClasses={setShownClasses}/>)}
      </div>
    </div>
  );
}

export default App;

import './App.css';
import {useEffect, useState} from "react";
import {filter, includes, map, padStart, sortBy, split, uniq, xor} from 'lodash'
import clsx from 'clsx'
import papa from 'papaparse';

const clsToPi = {
  x: 999,
  s2: 998,
  s1: 900,
  a: 800,
  b: 700,
  c: 600,
  d: 500,
};

const formatSecondsToHHMMSS = seconds => {
  const formatted = `${padStart(Math.floor(seconds / 60) % 60, 2, '0')}:${padStart(seconds % 60, 2, '0')}`;
  const hours = seconds > 3600 ? `${padStart(Math.floor(seconds / 3600), 2, '0')}:` : '';
  return hours + formatted;
}

function ClassType({cls, className, onClick}) {
  const pi = clsToPi[cls.toLowerCase()];
  return <button
    onClick={onClick}
    className={clsx('class-type', `pi-${pi}`, className)}
  >
    {cls} <span className="pi">{pi}</span>
  </button>
}

function RaceType({raceType, className, onClick}) {
  return <button
    onClick={onClick}
    className={clsx(className, 'race-type', raceType.toLowerCase())}
  >
    {raceType}
  </button>
}

function Tour({tour, setRaces, setClasses}) {
  return <div className={clsx(
    'flex-center',
    {
      'queue-now': tour.secondsUntil < 120,
      'next-up': tour.secondsUntil < 240 && !(tour.secondsUntil < 120)
    }
  )}
  >
    <div className='tour flex-center'>
      <ClassType cls={tour.cls} pi={tour.pi} onClick={() => setClasses([tour.cls])}/>
      <RaceType raceType={tour.type} onClick={() => setRaces([tour.type])}/>
      <span className={'mr-2'}>{tour.theme}</span>
      <span className={clsx({'text-red': tour.secondsUntil < 60})}>{formatSecondsToHHMMSS(tour.secondsUntil)}</span>
    </div>
  </div>
}

function ClassPicker({allClasses, classes, set}) {
  return <div className='picker'>
    {
      map(sortBy(allClasses, cls => -clsToPi[cls.toLowerCase()]), cls => <ClassType
        key={cls}
        cls={cls}
        className={clsx({'disabled': !includes(classes, cls)})}
        onClick={() => set(xor(classes, [cls]))}
      />)
    }
  </div>
}

function RacePicker({allRaces, races, set}) {
  return <div className='picker'>
    {
      map(allRaces, race => <RaceType
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
  const [allRaces, setAllRaces] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [shownRaces, setShownRaces] = useState([]);
  const [shownClasses, setShownClasses] = useState([]);
  const [tours, setParsed] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000)
    return () => {
      clearInterval(timer);
    }
  }, [])

  useEffect(() => {
    papa.parse('/tour-schedule.csv', {
      download: true,
      complete: (results) => {
        const cleaned = filter(results.data, (row) => row[0])
        setParsed(cleaned);
        const races = uniq(map(cleaned, row => row[4]));
        setAllRaces(races);
        setShownRaces(races);
        const classes = uniq(map(cleaned, row => row[1]));
        setAllClasses(classes);
        setShownClasses(classes);
      }
    })
  }, [])

  const sortedTours = sortBy(
    tours.map(([time, cls, pi, theme, type, ...tracks]) => {
      const [tourHour, tourMinute] = split(time, ':');
      const nowHour = now.getUTCHours();
      const nowMinute = now.getUTCMinutes();
      const nowSeconds = now.getUTCSeconds();
      const secondsUntil = (tourHour - nowHour) * (60 * 60) + (tourMinute - nowMinute) * 60 - nowSeconds;
      return ({
        time,
        cls,
        pi,
        theme,
        type,
        tracks,
        secondsUntil: secondsUntil < 0 ? secondsUntil + (24 * 60 * 60) : secondsUntil,
        key: time
      });
    }),
    'secondsUntil'
  );
  const filteredTours = filter(
    sortedTours,
    tour => includes(shownRaces, tour.type) && includes(shownClasses, tour.cls)
  );

  return (
    <div className="App">
      <p>{now.toUTCString()} - - {now.toLocaleTimeString()}</p>
      <a href="https://www.reddit.com/r/ForzaHorizon/comments/uf9l7o/list_of_all_720_horizon_tours_in_the_new_24_hour/">
        Special thanks to u/aqx for documenting the tour playlist
      </a>
      <ClassPicker allClasses={allClasses} classes={shownClasses} set={setShownClasses}/>
      <RacePicker allRaces={allRaces} races={shownRaces} set={setShownRaces}/>
      <div className="tours">
        {filteredTours.map((t) => <Tour key={t.time} tour={t} setClasses={setShownClasses} setRaces={setShownRaces}/>)}
      </div>
    </div>
  );
}

export default App;

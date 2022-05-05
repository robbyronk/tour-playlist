import './App.css';
import {useEffect, useState} from "react";
import {filter, includes, map, sortBy, split, uniq} from 'lodash'
import papa from 'papaparse';
import {Tour} from "./Tour";
import {ClassPicker} from "./ClassPicker";
import {RacePicker} from "./RacePicker";
import {padTime, wrapHours, wrapMinSecs} from "./time";

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
        const cleaned = filter(results.data, row => row[0])
        setParsed(cleaned);
        const races = uniq(map(cleaned, row => row[4]));
        setAllRaces(races);
        setShownRaces(races);
        const classes = uniq(map(cleaned, row => row[1]));
        setAllClasses(classes);
        setShownClasses(classes);
      }
    })
  }, []);

  const sortedTours = sortBy(
    tours.map(([time, cls, pi, theme, type, ...tracks]) => {
      const [tourHour, tourMinute] = split(time, ':');
      const nowHour = now.getUTCHours();
      const nowMinute = now.getUTCMinutes();
      const nowSeconds = now.getUTCSeconds();
      const secondsUntil = (tourHour - nowHour) * (60 * 60) + (tourMinute - nowMinute) * 60 - nowSeconds;
      const timezoneOffset = now.getTimezoneOffset();
      const localHour = tourHour - Math.floor(timezoneOffset / 60);
      const localMinute = tourMinute - (timezoneOffset % 60);
      return ({
        time,
        cls,
        pi,
        theme,
        type,
        tracks,
        secondsUntil: secondsUntil < 0 ? secondsUntil + (24 * 60 * 60) : secondsUntil,
        localTime: `${padTime(wrapHours(localHour))}:${padTime(wrapMinSecs(localMinute))}`,
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
      <p>{padTime(now.getUTCHours())}:{padTime(now.getUTCMinutes())} UTC - - {now.toLocaleTimeString()}</p>
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

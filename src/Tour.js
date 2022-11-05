import clsx from "clsx";
import ClassButton from "./ClassButton";
import RaceButton from "./RaceButton";
import {formatSecondsToHHMMSS, tourQueueTime} from "./time";
import LocationDot from "./location-dot-solid.svg"
import LocationXmark from "./location-xmark-solid.svg"


function TimeLeft({seconds}) {
  if (seconds > (tourQueueTime * 2)) {
    return null;
  }
  return <span className={clsx({'text-red': seconds < 60})}>
    {formatSecondsToHHMMSS(seconds)}
  </span>;
}

function StartsAt({time, seconds}) {
  if (seconds > (tourQueueTime * 2)) {
    return <div className={'gray-300 mt-0'}>Starts at {time}</div>
  }
  return null;
}

export function Tour({tour, setRaces, setClasses, pinTour, isPinned}) {
  return <div className={clsx(
    'flex-center',
    {
      'queue-now': tour.secondsUntil < tourQueueTime,
      'next-up': tour.secondsUntil < (tourQueueTime * 2) && !(tour.secondsUntil < tourQueueTime),
      'pinned': isPinned
    }
  )}
  >
    <div className='tour flex-center'>
      <div className="tour-pin">
        <span onClick={pinTour}>{
          isPinned
            ? <img className="pin" src={LocationXmark} alt="unpin tour from top"/>
            : <img className="pin" src={LocationDot} alt="pin tour to top"/>
        }</span>
      </div>
      <div className="tour-time">
        <TimeLeft seconds={tour.secondsUntil}/>
        <StartsAt time={tour.localTime} seconds={tour.secondsUntil}/>
      </div>
      <div className="tour-theme">
        {tour.theme}
      </div>
      <div className="tour-tracks">
        {tour.tracks.map(track => <div>{track}</div>)}
      </div>
      <div className="tour-class-race">
        <ClassButton cls={tour.cls} pi={tour.pi} onClick={() => setClasses([tour.cls])}/>
        <RaceButton raceType={tour.type} onClick={() => setRaces([tour.type])}/>
      </div>
    </div>
  </div>;
}

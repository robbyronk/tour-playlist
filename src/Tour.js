import clsx from "clsx";
import ClassButton from "./ClassButton";
import RaceButton from "./RaceButton";
import {formatSecondsToHHMMSS, tourQueueTime} from "./time";


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

export function Tour({tour, setRaces, setClasses}) {
  return <div className={clsx(
    'flex-center',
    {
      'queue-now': tour.secondsUntil < tourQueueTime,
      'next-up': tour.secondsUntil < (tourQueueTime * 2) && !(tour.secondsUntil < tourQueueTime)
    }
  )}
  >
    <div className='tour flex-center'>
      <div style={{
        display: 'flex',
        alignItems: "center",
        marginBottom: '0.25rem'
      }}>
        <div className='class-race'>
          <ClassButton cls={tour.cls} pi={tour.pi} onClick={() => setClasses([tour.cls])}/>
          <RaceButton raceType={tour.type} onClick={() => setRaces([tour.type])}/>
        </div>
        <div className={'mr-2'}>
          <span>{tour.theme}</span>
          <StartsAt time={tour.localTime} seconds={tour.secondsUntil} />
        </div>
        <TimeLeft seconds={tour.secondsUntil} />
      </div>
      {tour.tracks.map(track => <span>{track}</span>)}
    </div>
  </div>;
}

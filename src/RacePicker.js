import {includes, map, xor} from "lodash";
import RaceButton from "./RaceButton";
import clsx from "clsx";

export function RacePicker({allRaces, races, set}) {
  return <div className='picker'>
    {
      map(allRaces, race => <RaceButton
        key={race}
        raceType={race}
        className={clsx({'disabled': !includes(races, race)})}
        onClick={() => set(xor(races, [race]))}
      />)
    }
  </div>
}

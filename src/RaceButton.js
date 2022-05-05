import clsx from "clsx";

function RaceButton({raceType, className, onClick}) {
  return <button
    onClick={onClick}
    className={clsx(className, 'race-type', raceType.toLowerCase())}
  >
    {raceType}
  </button>
}

export default RaceButton;

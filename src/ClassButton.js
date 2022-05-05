import clsx from "clsx";
import clsToPi from "./clsToPi";

function ClassButton({cls, className, onClick}) {
  const pi = clsToPi[cls.toLowerCase()];
  return <button
    onClick={onClick}
    className={clsx('class-type', `pi-${pi}`, className)}
  >
    <div>{cls}</div>
    <div className="ml-1 pi">{pi}</div>
  </button>
}

export default ClassButton;

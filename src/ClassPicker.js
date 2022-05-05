import {includes, map, sortBy, xor} from "lodash";
import clsToPi from "./clsToPi";
import ClassButton from "./ClassButton";
import clsx from "clsx";

export function ClassPicker({allClasses, classes, set}) {
  const sorted = sortBy(allClasses, cls => clsToPi[cls.toLowerCase()]);
  return <div className='picker'>
    {
      map(sorted, cls => <ClassButton
        key={cls}
        cls={cls}
        className={clsx({'disabled': !includes(classes, cls)})}
        onClick={() => set(xor(classes, [cls]))}
      />)
    }
  </div>
}

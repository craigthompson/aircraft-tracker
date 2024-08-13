import React from "react";

import {
  FaAngleUp,
  FaAngleDoubleUp,
  FaAngleDown,
  FaAngleDoubleDown,
} from "react-icons/fa";

const AircraftMarkerLabel = ({
  callsign,
  onGround,
  threeDigitAltitude,
  climbRateFpm
}) => {


  return (
    <span className="flex flex-col items-center w-fit p-0.5 rounded filter-none text-secondary-600 bg-secondary-0 bg-opacity-70 shadow-[0_0_6px_rgba(255,255,255,0.6)] shadow-secondary-0">
            <span className="px-1">{callsign}</span>
            {threeDigitAltitude != null && (
              <span className="flex items-center">
                {climbRateFpm !== 0 && (
                  <span className="mr-1">
                    <span>
                      {climbRateFpm > 0 && climbRateFpm < 500 && <FaAngleUp />}
                    </span>
                    <span>{climbRateFpm >= 500 && <FaAngleDoubleUp />}</span>
                    <span>
                      {climbRateFpm < 0 && climbRateFpm > -500 && (
                        <FaAngleDown />
                      )}
                    </span>
                    <span>{climbRateFpm <= -500 && <FaAngleDoubleDown />}</span>
                  </span>
                )}
                {onGround !== true && (
                  <span>
                    {threeDigitAltitude}
                  </span>
                )}
              </span>
            )}
          </span>
  )

}

export default AircraftMarkerLabel;
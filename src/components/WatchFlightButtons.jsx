import { MdModeEdit } from "react-icons/md";

function WatchFlightButtons({ clickedButton }) {
  return (
    <div className="inline-block content-center">
      <button onClick={clickedButton}>
        <MdModeEdit className="text-xl" />
      </button>
    </div>
  );
}

export default WatchFlightButtons;

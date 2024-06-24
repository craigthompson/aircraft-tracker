import { RiDeleteBin6Line } from "react-icons/ri";

function WatchFlightDeleteButton({ clickedDeleteButton }) {
  return (
    <div className="inline-block content-start">
      <button onClick={clickedDeleteButton}>
        <RiDeleteBin6Line className="text-lg" />
      </button>
    </div>
  );
}

export default WatchFlightDeleteButton;

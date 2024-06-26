import { RiDeleteBin6Line } from "react-icons/ri";

function WatchFlightDeleteButton({ clickedDeleteButton }) {
  return (
    <div className="inline-block content-start">
      <button
        onClick={clickedDeleteButton}
        className="text-secondary-500 hover:text-primary-600 hover:shadow hover"
      >
        <RiDeleteBin6Line className="text-lg" />
      </button>
    </div>
  );
}

export default WatchFlightDeleteButton;

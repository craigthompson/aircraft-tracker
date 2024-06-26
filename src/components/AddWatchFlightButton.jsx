import { MdAddCircleOutline } from "react-icons/md";

function AddWatchFlightButton({ clickedButton }) {
  return (
    <td className="w-full px-1 text-gray-500">
      <button
        className="w-full min-h-7 bg-white hover:bg-secondary-200 border border-dashed hover:border-solid border-secondary-500 hover:border-primary-600 hover:text-primary-600 rounded-md shadow-md flex flex-row justify-center items-center"
        onClick={clickedButton}
      >
        <MdAddCircleOutline className="mr-1" />
        Add Flight
      </button>
    </td>
  );
}

export default AddWatchFlightButton;

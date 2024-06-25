import { MdAddCircleOutline } from "react-icons/md";

function AddWatchFlightButton({ clickedButton }) {
  return (
    <td className="w-full px-1 text-gray-800">
      <button
        className="w-full bg-white hover:bg-gray-100 border-2 border-dashed hover:border-solid border-gray-400 hover:border-cyan-600 hover:text-cyan-600 rounded-md shadow-md flex flex-row justify-center items-center"
        onClick={clickedButton}
      >
        <MdAddCircleOutline className="mr-1" />
        Add Flight
      </button>
    </td>
  );
}

export default AddWatchFlightButton;

function AddWatchFlightButton({ clickedButton }) {
  return (
    <td className="w-full px-1">
      <button className="w-full bg-gray-400 rounded" onClick={clickedButton}>
        + Add Flight
      </button>
    </td>
  );
}

export default AddWatchFlightButton;

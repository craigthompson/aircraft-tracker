import { useState } from "react";
import WatchedFlight from "./WatchedFlight";

function WatchList() {
  const [watchListData, setWatchListData] = useState([]);

  const addWatchFlight = async () => {
    const newWatchFlight = {
      // TODO: change to correct data for watch list flights
      mission: "",
      vehicle: "",
      location: "",
      days_till_launch: 0,
      isEditing: true,
    };
    const { data } = await axios.post("/api/launches", newWatchFlight); // TODO: change to new endpoint
    setWatchListData(data);
  };

  return (
    <div className="min-h-screen w-2/12 bg-gray-200 border-l-2 border-gray-500">
      Watch List
      <table className="w-full">
        <tbody>
          <WatchedFlight />
        </tbody>
        <tfoot>
          <tr className="">
            <td className="px-1">
              <button
                className="w-full bg-gray-600 rounded"
                onClick={addWatchFlight}
              >
                Add Flight
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default WatchList;

import Map from "./components/Map";
import "./App.css";
import WatchList from "./components/WatchList";

function App() {
  return (
    <div className="flex flex-row min-w-full">
      <Map />
      <WatchList />
    </div>
  );
}

export default App;

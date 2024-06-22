import { useState, useEffect, useRef } from "react";
import { BsFan } from "react-icons/bs";

function InputWatchFlight({
  addWatchFlight,
  isAddingFlight,
  setIsAddingFlight,
}) {
  const [inputValue, setInputValue] = useState([]);
  const [isScrapingFlight, setScrapingFlight] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    try {
      if (event.key === "Enter") {
        setScrapingFlight(true);
        await addWatchFlight(inputValue);
        setInputValue(""); // Clear the input field after adding the flight
        setIsAddingFlight(false);
        setScrapingFlight(false);
      }
    } catch (error) {
      console.error("Error adding watch flight:", error);
    }
  };

  const handleInputBlur = () => {
    setInputValue(""); // Clear the input field after adding the flight
    setIsAddingFlight(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingFlight]);

  return (
    <td className="w-full px-1 flex justify-center items-center">
      {isScrapingFlight ? (
        <BsFan className="animate-spinFastToFaster text-gray-600 text-4xl" />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder="Flight #"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          className="pl-1 w-full"
        />
      )}
    </td>
  );
}

export default InputWatchFlight;

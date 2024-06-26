import { useState, useEffect, useRef } from "react";
import { BsFan } from "react-icons/bs";

function InputWatchFlight({
  addWatchFlight,
  isAddingFlight,
  setIsAddingFlight,
  isScrapingFlight,
  setIsScrapingFlight,
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    try {
      if (event.key === "Enter") {
        if (true) {
          if (inputValue.length <= 8) {
            setIsScrapingFlight(true);
            await addWatchFlight(inputValue);
          } else {
            alert(
              "Invalid flight # or aircraft Registration. " +
                "Cannot exceed 8 characters long. " +
                "Please try again."
            );
          }
        }
        setInputValue(""); // Clear the input field after adding the flight
        setIsAddingFlight(false);
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
    <td className="w-full px-1 min-h-6 flex justify-center items-center">
      {isScrapingFlight ? (
        <BsFan className="animate-spinFastToFaster text-secondary-600 text-4xl" />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={inputValue.toUpperCase().replace(/\s/g, "")}
          placeholder="Callsign / Flight"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          className="pl-2 w-full min-h-7 shadow-md ring-inset focus:ring-1 focus:ring-primary-600 focus:outline-none appearance-none rounded-md text-primary-600"
        />
      )}
    </td>
  );
}

export default InputWatchFlight;

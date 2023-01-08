import CustomCalendar from "./components/CustomCalendar";

function App() {
  const weekSelect = (dates) => {
    console.log(dates);
  };

  const currentWeekSelect = (dates) => {
    console.log(dates);
  };
  const dateSelect = (date) => {
    console.log(date);
  };

  const dateRangeSelect = (dates) => {
    console.log(dates);
  };
  return (
    <>
      <CustomCalendar
        dateSelect={dateSelect}
        dateRangeSelect={dateRangeSelect}
        // weekSelect={weekSelect}
        currentWeekSelect={currentWeekSelect}
      />
    </>
  );
}

export default App;

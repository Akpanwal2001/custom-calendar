import React, { useEffect, useState } from "react";
import "./CustomCalendar.css";

// Functions that needs to pass in props
// 1. dateSelect, if need only selected date
// 2. weekSelect, if need only start date and end date
// 3. currentWeekSelect, if need start date of current week
// 4. dateRangeSelect, if need start_date and end date of selected date range

const CustomCalendar = ({
  dateSelect,
  weekSelect,
  currentWeekSelect,
  dateRangeSelect,
}) => {
  // weeks name
  const weekDays = [
    { day: "Sunday", id: 0 },
    { day: "Monday", id: 1 },
    { day: "Tuesday", id: 2 },
    { day: "Wednesday", id: 3 },
    { day: "Thursday", id: 4 },
    { day: "Friday", id: 5 },
    { day: "Saturday", id: 6 },
  ];

  // const weekDayIds = {
  //   Sunday: 0,
  //   Monday: 1,
  //   Tuesday: 2,
  //   Wednesday: 3,
  //   Thursday: 4,
  //   Friday: 5,
  //   Saturday: 6,
  // };

  // months name
  const months = [
    { monthName: "January", id: 0 },
    { monthName: "February", id: 1 },
    { monthName: "March", id: 2 },
    { monthName: "April", id: 3 },
    { monthName: "May", id: 4 },
    { monthName: "June", id: 5 },
    { monthName: "July", id: 6 },
    { monthName: "August", id: 7 },
    { monthName: "September", id: 8 },
    { monthName: "October", id: 9 },
    { monthName: "November", id: 10 },
    { monthName: "December", id: 11 },
  ];

  // Months Ids
  const monthsIds = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [activeDates, setActiveDates] = useState();
  const [changeYear, setChangeYear] = useState(false);
  const [firstDateSelect, setFirstDateSelect] = useState(false);
  const [lastDateSelect, setLastDateSelect] = useState(false);
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [showCalendar, setShowCalendar] = useState(false);

  const daysInMonth = (month, year) => {
    const dayInMonth = {
      January: 31,
      February: year % 4 ? 28 : 29,
      March: 31,
      April: 30,
      May: 31,
      June: 30,
      July: 31,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };

    return dayInMonth[month];
  };

  // get next month
  const getNextMonth = (monthId, year) => {
    if (monthId < 11) {
      return { monthId: monthId + 1, year };
    } else {
      return {
        monthId: 0,
        year: year + 1,
      };
    }
  };

  const getDateObject = (date) => {
    return {
      date: new Date(date).getDate(),
      monthName: months[new Date(date).getMonth()].monthName,
      year: new Date(date).getFullYear(),
    };
  };

  // get prev month
  const getPrevMonth = (monthId, year) => {
    if (monthId > 0) {
      return { monthId: monthId - 1, year };
    } else {
      return {
        monthId: 11,
        year: year - 1,
      };
    }
  };

  // get Week Day name and Id in any date
  const getWeekDayName = (date) => {
    const day = new Date(date).getDay();
    return weekDays[day];
  };

  // days in Current Month
  const daysInCurrentMonth = (array, monthId, year) => {
    for (let i = 1; i <= daysInMonth(months[monthId].monthName, year); i++) {
      array.push({
        class: "curr_month",
        date: i,
        monthName: months[monthId].monthName,
        year: year,
      });
    }
  };

  // days in Previous Month to show in current month
  const daysOfPreviousMonthToShowInCurrentMonth = (
    array,
    currentMonthId,
    year
  ) => {
    // previous month id
    const prevMonthId = getPrevMonth(currentMonthId, year).monthId;

    // previous month year
    const prevMonthYear = getPrevMonth(currentMonthId, year).year;

    // days in previous month
    const daysInPrevMonth = daysInMonth(
      months[prevMonthId].monthName,
      prevMonthYear
    );

    // previous month's days to show in current month
    for (
      let i =
        daysInPrevMonth -
        new Date(`1 ${months[currentMonthId].monthName} ${year}`).getDay() +
        1;
      i <= daysInPrevMonth;
      i++
    ) {
      array.push({
        class: "prev_month",
        date: i,
        monthName: months[prevMonthId].monthName,
        year: prevMonthYear,
      });
    }
  };

  // days in Next Month to show in current month
  const daysOfNextMonthToShowInCurrentMonth = (array, currentMonthId, year) => {
    // next month id
    const nextMonthId = getNextMonth(currentMonthId, year).monthId;
    // next month year
    const nextMonthYear = getNextMonth(currentMonthId, year).year;

    // get next month's day to show in current month
    if (array.length > 35) {
      var nextMonthDaysToShow = 42 - array.length;
    } else {
      var nextMonthDaysToShow = 35 - array.length;
    }

    // next month days
    for (let i = 1; i <= nextMonthDaysToShow; i++) {
      array.push({
        class: "next_month",
        date: i,
        monthName: months[nextMonthId].monthName,
        year: nextMonthYear,
      });
    }
  };

  // get All Days in any month of year
  const getAllDaysInMonth = (monthId, year) => {
    const AllDaysList = [];
    // previous month days
    daysOfPreviousMonthToShowInCurrentMonth(AllDaysList, monthId, year);
    // current month days
    daysInCurrentMonth(AllDaysList, monthId, year);
    // next month days
    daysOfNextMonthToShowInCurrentMonth(AllDaysList, monthId, year);

    return AllDaysList;
  };

  // select previous month
  const selectPreviousMonth = (monthId, year) => {
    setSelectedMonth(getPrevMonth(monthId, year).monthId);
    setSelectedYear(getPrevMonth(monthId, year).year);
  };

  // select next month
  const selectNextMonth = (monthId, year) => {
    setSelectedMonth(getNextMonth(monthId, year).monthId);
    setSelectedYear(getNextMonth(monthId, year).year);
  };

  // select next year
  const selectNextYear = (year) => {
    setSelectedYear(selectedYear + 1);
  };
  // select previous year
  const selectPreviousYear = (year) => {
    setSelectedYear(selectedYear - 1);
  };

  // get full day
  const getFullDate = (date, monthName, year) => {
    return `${date < 10 ? `0${date}` : date} ${monthName}, ${year}`;
  };

  // change selected date
  const changeSelectedDate = (date, month, year) => {
    setSelectedDate(date);
    setSelectedMonth(monthsIds[month]);
    setSelectedYear(year);
    return getFullDate(date, month, year);
  };

  // select full week
  const selectFullWeek = (date, month, year, current) => {
    const weekAllDays = [];
    var firstOfWeek =
      new Date(getFullDate(date, month, year)).getDate() -
      new Date(getFullDate(date, month, year)).getDay();
    var lastOfWeek = firstOfWeek + 6;

    // get the week dates when first date of week is from previous month
    if (firstOfWeek < 1) {
      const previousMonthId = getPrevMonth(monthsIds[month], year).monthId;
      const previousYear = getPrevMonth(monthsIds[month], year).year;
      const dayInPrevMonth = daysInMonth(
        months[previousMonthId].monthName,
        previousYear
      );
      for (let i = dayInPrevMonth + firstOfWeek; i <= dayInPrevMonth; i++) {
        weekAllDays.push({
          date: i,
          monthName: months[previousMonthId].monthName,
          year: previousYear,
        });
      }
      for (let i = 1; i <= lastOfWeek; i++) {
        weekAllDays.push({
          date: i,
          monthName: month,
          year: year,
        });
      }
    }
    // get the week dates when last date of week is from next month
    else if (lastOfWeek > daysInMonth(month, year)) {
      const nextMonthId = getNextMonth(monthsIds[month], year).monthId;
      const nextYear = getNextMonth(monthsIds[month], year).year;
      const daysInNextMonth = daysInMonth(
        months[nextMonthId].monthName,
        nextYear
      );

      for (let i = firstOfWeek; i <= daysInMonth(month, year); i++) {
        weekAllDays.push({
          date: i,
          monthName: month,
          year: year,
        });
      }
      for (let i = 1; i <= lastOfWeek - daysInMonth(month, year); i++) {
        weekAllDays.push({
          date: i,
          monthName: months[nextMonthId].monthName,
          year: nextYear,
        });
      }
    }
    // get the week dates when first date and last date of week is from same month
    else {
      for (let i = firstOfWeek; i <= lastOfWeek; i++) {
        weekAllDays.push({
          date: i,
          monthName: month,
          year: year,
        });
      }
    }
    if (!current) {
      setActiveDates(weekAllDays);
    }
    return weekAllDays;
  };

  // get selected week start date and end date
  const selectedRangeStartAndEndDate = (array) => {
    if (array) {
      return {
        start_date: getFullDate(
          array[0]?.date,
          array[0]?.monthName,
          array[0]?.year
        ),
        end_date: getFullDate(
          array[array.length - 1]?.date,
          array[array.length - 1]?.monthName,
          array[array.length - 1]?.year
        ),
      };
    }
  };

  // get current week first and last date
  useEffect(() => {
    if (currentWeekSelect) {
      currentWeekSelect(
        selectedRangeStartAndEndDate(
          selectFullWeek(
            currentDate,
            months[currentMonth].monthName,
            currentYear,
            true
          )
        )
      );
    }
  }, [currentDate, currentMonth, currentYear]);

  // get next date
  const getNextDate = (date, month, year) => {
    if (date < daysInMonth(month, year)) {
      return { date: date + 1, monthName: month, year };
    } else {
      return {
        date: 1,
        monthName:
          months[getNextMonth(monthsIds[month], year).monthId].monthName,
        year: getNextMonth(monthsIds[month], year).year,
      };
    }
  };

  // get All dates between two dates
  // first date and last date object formate = {date, monthName,  year}
  const getDatesInRange = (firstDateObj, lastDateObj) => {
    const DatesList = [];
    var currentDate = getFullDate(
      firstDateObj.date,
      firstDateObj.monthName,
      firstDateObj.year
    );
    const lastDate = getFullDate(
      lastDateObj.date,
      lastDateObj.monthName,
      lastDateObj.year
    );

    while (new Date(currentDate) <= new Date(lastDate)) {
      DatesList.push(getDateObject(currentDate));
      let nextDateObj = getDateObject(currentDate);
      let nextDate = getNextDate(
        nextDateObj.date,
        nextDateObj.monthName,
        nextDateObj.year
      );
      currentDate = getFullDate(
        nextDate.date,
        nextDate.monthName,
        nextDate.year
      );
    }
    setActiveDates(DatesList);

    return DatesList;
  };

  // when one range is selected and want to select new date range
  const onSelectNewDateRange = (obj) => {
    setFirstDateSelect(obj);
    setLastDateSelect(false);
    setActiveDates();
  };

  // all condition for run functions on click on any date
  const runOnClick = (item) => {
    weekSelect
      ? weekSelect(selectFullWeek(item.date, item.monthName, item.year))
      : dateRangeSelect && !firstDateSelect
      ? setFirstDateSelect({
          date: item.date,
          monthName: item.monthName,
          year: item.year,
        })
      : firstDateSelect &&
        new Date(
          getFullDate(
            firstDateSelect.date,
            firstDateSelect.monthName,
            firstDateSelect.year
          )
        ) > new Date(getFullDate(item.day, item.monthName, item.year))
      ? setFirstDateSelect({
          date: item.date,
          monthName: item.monthName,
          year: item.year,
        })
      : firstDateSelect && !lastDateSelect
      ? setLastDateSelect({
          date: item.date,
          monthName: item.monthName,
          year: item.year,
        })
      : firstDateSelect && lastDateSelect
      ? onSelectNewDateRange({
          date: item.date,
          monthName: item.monthName,
          year: item.year,
        })
      : dateSelect
      ? dateSelect(changeSelectedDate(item.date, item.monthName, item.year))
      : console.log(getFullDate(item.date, item.monthName, item.year));
  };

  const runOnHover = (item) => {
    firstDateSelect &&
    !lastDateSelect &&
    new Date(
      getFullDate(
        firstDateSelect.date,
        firstDateSelect.monthName,
        firstDateSelect.year
      )
    ) < new Date(getFullDate(item.date, item.monthName, item.year))
      ? getDatesInRange(
          {
            date: firstDateSelect.date,
            monthName: firstDateSelect.monthName,
            year: firstDateSelect.year,
          },
          {
            date: item.date,
            monthName: item.monthName,
            year: item.year,
          }
        )
      : console.log(getFullDate(item.date, item.monthName, item.year));
  };
  return (
    <>
      <div className="custom_calendar">
        <div className="date_input">
          <input
            type="text"
            onFocus={() => setShowCalendar(true)}
            value={
              weekSelect && activeDates
                ? `${selectedRangeStartAndEndDate(activeDates)?.start_date} - ${
                    selectedRangeStartAndEndDate(activeDates)?.end_date
                  }`
                : getFullDate(
                    selectedDate,
                    months[selectedMonth].monthName,
                    selectedYear
                  )
            }
          />
        </div>
        {showCalendar ? (
          <div className="calendar">
            <div className="change_year_month">
              <div
                className="prev_btn"
                onClick={() => {
                  changeYear
                    ? selectPreviousYear(selectedYear)
                    : selectPreviousMonth(selectedMonth, selectedYear);
                }}
              >
                &lt;
              </div>
              <div className="selected_month_year">
                {!changeYear ? (
                  <div className="month">{months[selectedMonth].monthName}</div>
                ) : null}
                <div
                  className="year"
                  onClick={() => setChangeYear(!changeYear)}
                >
                  {selectedYear}
                </div>
              </div>
              <div
                className="next_btn"
                onClick={() => {
                  changeYear
                    ? selectNextYear(selectedYear)
                    : selectNextMonth(selectedMonth, selectedYear);
                }}
              >
                &gt;
              </div>
            </div>
            <div className="week_days">
              {weekDays?.map((item, index) => (
                <div
                  key={item.id}
                  className={`week_day ${
                    item.id ==
                    new Date(
                      getFullDate(
                        selectedDate,
                        months[selectedMonth].monthName,
                        selectedYear
                      )
                    ).getDay()
                      ? "ActiveWeek"
                      : ""
                  }`}
                >
                  {item?.day?.charAt(0)}
                </div>
              ))}
            </div>
            <div className="days">
              {getAllDaysInMonth(selectedMonth, selectedYear)?.map(
                (item, index) => (
                  <div
                    key={index}
                    className={`day ${item.class} ${
                      weekSelect || dateRangeSelect
                        ? activeDates?.find(
                            (ele) =>
                              ele.date == item.date &&
                              ele.monthName == item.monthName &&
                              ele.year == item.year
                          )
                          ? "ActiveDate"
                          : ""
                        : dateSelect
                        ? item.date == selectedDate &&
                          item.monthName == months[selectedMonth].monthName &&
                          item.year == selectedYear
                          ? "ActiveDate"
                          : ""
                        : ""
                    }`}
                    title={`${
                      getWeekDayName(
                        getFullDate(item.date, item.monthName, item.year)
                      ).day
                    }, ${getFullDate(item.date, item.monthName, item.year)}`}
                    onClick={() => runOnClick(item)}
                    onMouseEnter={() => {
                      dateRangeSelect ? runOnHover(item) : console.log();
                    }}
                  >
                    {item.date}
                  </div>
                )
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CustomCalendar;

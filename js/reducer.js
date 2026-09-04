// =====================================================
// REDUCER
// =====================================================

const SEAT_PRICE = 50000;

const makeSeats = () => {
  const reserved = [
    "A4", "A5", "B8", "C3", "C10",
    "D6", "E2", "F11", "G5", "H9",
    "I4", "J7"
  ];

  const rows = "ABCDEFGHIJ";
  const result = [];

  rows.split("").forEach((row) => {
    for (let number = 1; number <= 12; number++) {
      const id = row + number;

      result.push({
        id: id,
        row: row,
        number: number,
        reserved: reserved.includes(id),
        selected: false
      });
    }
  });

  return result;
};

const initialState = {
  name: "",
  numberOfSeats: 0,
  seats: makeSeats(),
  selectedSeats: [],
  confirmed: false,
  message: "Fill the required details below and select your seats.",
  messageType: ""
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {

    case START_SELECTING:
      return {
        ...state,
        name: action.payload.name,
        numberOfSeats: action.payload.numberOfSeats,
        selectedSeats: [],
        confirmed: false,
        seats: state.seats.map((seat) => ({
          ...seat,
          selected: false
        })),
        message:
          "Please select " + action.payload.numberOfSeats + " seat(s).",
        messageType: "success"
      };

    case TOGGLE_SEAT: {
      const id = action.payload;
      const seat = state.seats.find((item) => item.id === id);

      if (!seat || seat.reserved) {
        return state;
      }

      const isSelected = state.selectedSeats.includes(id);

      if (!isSelected &&
          state.selectedSeats.length >= state.numberOfSeats) {
        return {
          ...state,
          message:
            "You can only select " + state.numberOfSeats + " seat(s).",
          messageType: "error"
        };
      }

      const newSelectedSeats = isSelected
        ? state.selectedSeats.filter((seatId) => seatId !== id)
        : [...state.selectedSeats, id];

      return {
        ...state,
        selectedSeats: newSelectedSeats,
        confirmed: false,
        seats: state.seats.map((item) =>
          item.id === id
            ? { ...item, selected: !isSelected }
            : item
        ),
        message:
          "Selected " +
          newSelectedSeats.length +
          "/" +
          state.numberOfSeats +
          " seat(s).",
        messageType: "success"
      };
    }

    case CONFIRM_SELECTION:
      if (!state.name || state.numberOfSeats === 0) {
        return {
          ...state,
          message: "Please enter Name and Number of Seats first.",
          messageType: "error"
        };
      }

      if (state.selectedSeats.length !== state.numberOfSeats) {
        return {
          ...state,
          message:
            "Please select exactly " +
            state.numberOfSeats +
            " seat(s).",
          messageType: "error"
        };
      }

      return {
        ...state,
        confirmed: true,
        message: "Booking completed successfully!",
        messageType: "success"
      };

    case RESET_SELECTION:
      return {
        ...initialState,
        seats: makeSeats()
      };

    default:
      return state;
  }
};

// =====================================================
// ACTION CREATOR
// =====================================================

const START_SELECTING = "START_SELECTING";
const TOGGLE_SEAT = "TOGGLE_SEAT";
const CONFIRM_SELECTION = "CONFIRM_SELECTION";
const RESET_SELECTION = "RESET_SELECTION";

const startSelecting = (name, numberOfSeats) => ({
  type: START_SELECTING,
  payload: {
    name,
    numberOfSeats
  }
});

const toggleSeat = (seatId) => ({
  type: TOGGLE_SEAT,
  payload: seatId
});

const confirmSelection = () => ({
  type: CONFIRM_SELECTION
});

const resetSelection = () => ({
  type: RESET_SELECTION
});

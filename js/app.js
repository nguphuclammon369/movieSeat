// =====================================================
// UI
// =====================================================

const nameInput = document.getElementById("nameInput");
const seatNumberInput = document.getElementById("seatNumberInput");
const startBtn = document.getElementById("startBtn");
const confirmBtn = document.getElementById("confirmBtn");

const seatMap = document.getElementById("seatMap");
const messageBox = document.getElementById("message");

const resultName = document.getElementById("resultName");
const resultQuantity = document.getElementById("resultQuantity");
const resultSeats = document.getElementById("resultSeats");
const resultTotal = document.getElementById("resultTotal");

const formatMoney = (number) =>
  new Intl.NumberFormat("vi-VN").format(number) + " VNĐ";

const renderMessage = (state) => {
  const type = state.messageType
    ? " " + state.messageType
    : "";

  messageBox.innerHTML = state.message
    ? `<div class="message${type}">${state.message}</div>`
    : "";
};

const renderSeats = (state) => {
  const rows = "ABCDEFGHIJ";

  let html = `<div class="seat-map">`;

  // Header
  html += `
    <div class="seat-row">
      <div></div>
      ${[1,2,3,4,5].map(n => `<div class="seat-header">${n}</div>`).join("")}
      <div class="spacer"></div>
      ${[6,7,8,9,10,11,12].map(n => `<div class="seat-header">${n}</div>`).join("")}
    </div>
  `;

  rows.split("").forEach((row) => {
    html += `<div class="seat-row">`;
    html += `<div class="row-name">${row}</div>`;

    for (let number = 1; number <= 12; number++) {
      const id = row + number;
      const seat = state.seats.find(item => item.id === id);

      if (number === 6) {
        html += `<div class="spacer"></div>`;
      }

      let classes = "seat";

      if (seat.reserved) classes += " reserved";
      if (seat.selected) classes += " selected";

      html += `
        <button
          type="button"
          class="${classes}"
          data-seat="${id}"
          ${seat.reserved ? "disabled" : ""}
          title="${seat.reserved ? "Reserved Seat" : "Seat " + id}">
          ${number}
        </button>
      `;
    }

    html += `</div>`;
  });

  html += `</div>`;

  seatMap.innerHTML = html;

  document.querySelectorAll(".seat:not(.reserved)").forEach((button) => {
    button.addEventListener("click", () => {
      movieStore.dispatch(toggleSeat(button.dataset.seat));
    });
  });
};

const renderResult = (state) => {
  resultName.textContent = state.name || "---";
  resultQuantity.textContent =
    state.numberOfSeats || "---";
  resultSeats.textContent =
    state.selectedSeats.length
      ? state.selectedSeats.join(", ")
      : "---";

  resultTotal.textContent = formatMoney(
    state.selectedSeats.length * SEAT_PRICE
  );
};

const render = () => {
  const state = movieStore.getState();

  renderMessage(state);
  renderSeats(state);
  renderResult(state);

  // Đồng bộ input với state sau khi reset.
  if (!state.name) {
    nameInput.value = "";
  }

  if (!state.numberOfSeats) {
    seatNumberInput.value = 2;
  }
};

startBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const numberOfSeats = Number(seatNumberInput.value);

  if (!name) {
    movieStore.dispatch({
      type: CONFIRM_SELECTION,
    });
    return;
  }

  if (
    !Number.isInteger(numberOfSeats) ||
    numberOfSeats < 1 ||
    numberOfSeats > 20
  ) {
    movieStore.dispatch({
      type: TOGGLE_SEAT,
      payload: "__invalid__"
    });

    // Hiển thị lỗi qua dispatch action hợp lệ bằng cách bắt đầu
    // với giá trị ngoài phạm vi.
    movieStore.dispatch({
      type: START_SELECTING,
      payload: {
        name: name,
        numberOfSeats: 0
      }
    });
    return;
  }

  movieStore.dispatch(startSelecting(name, numberOfSeats));
});

confirmBtn.addEventListener("click", () => {
  movieStore.dispatch(confirmSelection());
});

movieStore.subscribe(render);

render();

import Calendar from "./contracts/Calendar.json";
import Reservation from "./contracts/Reservation.json";

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545",
    },
  },
  contracts: [Calendar, Reservation],
  events: {
    Calendar: ["Transfer"],
    Reservation: ["Transfer", "Creation", "Cancellation"],
  },
  polls: {
    accounts: 1000,
  },
  // syncAlways: true,
};

export default drizzleOptions;

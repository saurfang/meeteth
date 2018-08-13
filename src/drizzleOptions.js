import SimpleStorage from "contracts/SimpleStorage.json";
import TutorialToken from "contracts/TutorialToken.json";
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
  contracts: [SimpleStorage, TutorialToken, Calendar, Reservation],
  events: {
    SimpleStorage: ["StorageSet"],
    Calendar: ["Transfer"],
    Reservation: ["Transfer", "Creation", "Cancellation"],
  },
  polls: {
    accounts: 2000,
  },
};

export default drizzleOptions;

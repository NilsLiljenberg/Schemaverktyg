import React, { useState, useEffect } from "react";
import MainTabs from "./MainTabs";
import { loadData, saveData } from "../utils/storage";
import defaultBalances from "../data/defaultBalances.json";
import "../styles.css";

function App() {
  const [staff, setStaff] = useState(() => loadData("staff", []));
  const [schedules, setSchedules] = useState(() => loadData("schedules", {}));
  const [balances, setBalances] = useState(() => loadData("balances", defaultBalances));
  const [contacts, setContacts] = useState(() => loadData("contacts", {
    groupLeader: { name: "", phone: "" },
    quality: { name: "", phone: "" },
  }));

  useEffect(() => { saveData("staff", staff); }, [staff]);
  useEffect(() => { saveData("schedules", schedules); }, [schedules]);
  useEffect(() => { saveData("balances", balances); }, [balances]);
  useEffect(() => { saveData("contacts", contacts); }, [contacts]);

  return (
    <div className="app-container">
      <MainTabs
        staff={staff} setStaff={setStaff}
        schedules={schedules} setSchedules={setSchedules}
        balances={balances} setBalances={setBalances}
        contacts={contacts} setContacts={setContacts}
      />
    </div>
  );
}

export default App;

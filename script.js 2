import React, { useState } from "react";
import AddStaff from "./AddStaff";
import ScheduleCreator from "./ScheduleCreator";
import Settings from "./Settings";

export default function MainTabs(props) {
  const [tab, setTab] = useState("schedule");

  return (
    <div>
      <div className="main-tabs">
        <button onClick={() => setTab("schedule")}>Skapa schema</button>
        <button onClick={() => setTab("add")}>Lägg till</button>
        <button onClick={() => setTab("settings")}>Admin</button>
      </div>
      <div>
        {tab === "schedule" && <ScheduleCreator {...props} />}
        {tab === "add" && <AddStaff {...props} />}
        {tab === "settings" && <Settings {...props} />}
      </div>
    </div>
  );
}

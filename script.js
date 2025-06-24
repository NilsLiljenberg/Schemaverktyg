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

import React, { useState } from "react";
import StaffList from "./StaffList";
import StaffForm from "./StaffForm";

const shifts = ["Dag", "Kväll", "Natt", "Flex/Bemanning"];

export default function AddStaff({ staff, setStaff, balances }) {
  const [tab, setTab] = useState(shifts[0]);
  const [editing, setEditing] = useState(null);

  const byShift = (shift) => staff.filter(p => p.shift === shift);

  return (
    <div>
      <div className="subtabs">
        {shifts.map(s => (
          <button key={s} onClick={() => setTab(s)}>{s}</button>
        ))}
      </div>
      <StaffList
        staff={byShift(tab)}
        balances={balances}
        onEdit={setEditing}
        onDelete={person =>
          setStaff(staff.filter(p => p.id !== person.id))
        }
      />
      <StaffForm
        visible={!!editing}
        person={editing}
        balances={balances}
        onSave={person => {
          setStaff(prev => {
            if (person.id) {
              return prev.map(p => p.id === person.id ? person : p);
            }
            return [...prev, { ...person, id: Date.now() }];
          });
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
      <button onClick={() => setEditing({ shift: tab, balances: [] })}>Lägg till ny person</button>
    </div>
  );
}

import React, { useState } from "react";

export default function StaffList({ staff, balances, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <table>
      <tbody>
        {staff.map(person => (
          <React.Fragment key={person.id}>
            <tr>
              <td>
                <button onClick={() => setExpanded(expanded === person.id ? null : person.id)}>
                  ▶
                </button>
                {person.name}
              </td>
              <td>
                <button onClick={() => onEdit(person)}>Ändra</button>
                <button onClick={() => onDelete(person)}>Ta bort</button>
              </td>
            </tr>
            {expanded === person.id && (
              <tr>
                <td colSpan="2">
                  <ul>
                    {person.balances.map(bal => <li key={bal}>{bal}</li>)}
                  </ul>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

import React, { useState, useEffect } from "react";
export default function StaffForm({ visible, person, balances, onSave, onCancel }) {
  const [form, setForm] = useState(person || { name: "", shift: "", balances: [] });

  useEffect(() => { setForm(person || { name: "", shift: "", balances: [] }); }, [person]);

  if (!visible) return null;

  const toggleBalance = (bal) => {
    setForm(f =>
      f.balances.includes(bal)
        ? { ...f, balances: f.balances.filter(b => b !== bal) }
        : { ...f, balances: [...f.balances, bal] }
    );
  };

  return (
    <div className="modal">
      <label>
        Namn:
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </label>
      <div>
        <strong>Balanser:</strong>
        {balances.map(bal => (
          <label key={bal}>
            <input
              type="checkbox"
              checked={form.balances.includes(bal)}
              onChange={() => toggleBalance(bal)}
            />
            {bal}
          </label>
        ))}
      </div>
      <button onClick={() => onSave(form)}>Spara</button>
      <button onClick={onCancel}>Avbryt</button>
    </div>
  );
}

export function loadData(key, def) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : def;
  } catch {
    return def;
  }
}

export function saveData(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

[
  "Maskering TS",
  "Kontrollering 1",
  "Avs 1",
  "Avs 2",
  "Avs 3",
  "Nedre Förlast",
  "Nedre Pålast",
  "Nedre VTC",
  "Nedre Avs",
  "SLUTKONTROLL",
  "Sillar",
  "Avplock",
  "Takspoiler"
]
import * as XLSX from 'xlsx';

const colorMap = {
  "Avs 1": "FFFF00", "Avs 2": "FFFF00", "Avs 3": "FFFF00",
  "Nedre Förlast": "808000", "Nedre Pålast": "808000", "Nedre VTC": "808000", "Nedre Avs": "808000",
  "SLUTKONTROLL": "FFA500",
  "Sillar": "ADD8E6", "Avplock": "ADD8E6", "Takspoiler": "ADD8E6"
};

export function exportScheduleToExcel(schedule, contacts, fileName = "schema.xlsx") {
  // Skapa data-array enligt schemavisning
  const wsData = [
    ["Namn", ...schedule.passes], // pass-titlar
    ...schedule.rows.map(row =>
      [row.name, ...row.passes]
    ),
    [],
    [`Gruppledare: ${contacts.groupLeader.name} ${contacts.groupLeader.phone}`],
    [`Kvalité: ${contacts.quality.name} ${contacts.quality.phone}`]
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  // Färgkoda (valfritt, kräver xlsx-style eller liknande)
  // ...färgkodning här...
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Schema");
  XLSX.writeFile(wb, fileName);
}


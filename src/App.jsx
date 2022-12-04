import React from "react";

import { read, utils } from "xlsx";
import { Modal } from "./Modal";
import { DataTable } from "./DataTable";

import "./App.css";

function App() {
  const [isOpen, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);

  const onClickHandler = React.useCallback(async (e) => {
    const url = e.currentTarget.href;

    const res = await fetch(url);
    const f = await res.arrayBuffer();
    const wb = read(f);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = utils.sheet_to_json(ws);

    if (0 < data.length) {
      setOpen(true);
      setData(data);
    }
  }, []);

  return (
    <div className="App">
      <a href="http://localhost:5173/People.xlsx" onClick={onClickHandler}>
        Download XLSX
      </a>
      {" | "}
      <a href="http://localhost:5173/People.csv" onClick={onClickHandler}>
        Download CSV
      </a>
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <DataTable data={data} />
      </Modal>
    </div>
  );
}

export default App;

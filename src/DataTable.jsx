import React from "react";

const PAGE_SIZE = 20;

export const DataTable = ({ data }) => {
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(PAGE_SIZE);

  const handlePrevious = (e) => {
    e.preventDefault();
    if (0 < start) {
      setStart(start - PAGE_SIZE);
    }
    setEnd(end - PAGE_SIZE);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (end !== data.length) {
      setStart(start + PAGE_SIZE);
      setEnd(end + PAGE_SIZE);
    }
  };

  const options = [start, end];

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(data[0]).map((columnName) => (
              <th key={columnName}>{columnName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(...options).map((row, key) => (
            <tr key={key}>
              {Object.values(row).map((value, innerKey) => (
                <td key={`${key}-${innerKey}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="pagination">
        <button onClick={handlePrevious} disabled={start === 0}>
          Previous
        </button>
        <span>
          Showing row <strong>{start}</strong> to <strong>{end}</strong> of{" "}
          <strong>{data.length}</strong>
        </span>
        <button onClick={handleNext} disabled={data.length <= end}>
          Next
        </button>
      </footer>
    </>
  );
};

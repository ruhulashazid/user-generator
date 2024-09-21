import React from "react";
import { createRandomUsers, Region, User } from "./helper";

function App() {
  const pageRef = React.useRef(0);
  const tableRef = React.useRef<HTMLTableElement>(null!);

  const [seed, setSeed] = React.useState<number>(
    () => Date.now() ^ (Math.random() * 0x100000000)
  );
  const [region, setRegion] = React.useState<Region>("en");
  const [errorCount, setErrorCount] = React.useState<number>(0);
  const [errorCountField, setErrorCountField] = React.useState<number>(0);
  const [users, setUsers] = React.useState<User[]>(() =>
    createRandomUsers(20, region, seed, pageRef.current, errorCount)
  );

  React.useEffect(() => {
    function handlePageChange() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if the user has scrolled to the bottom
      if (scrollTop + windowHeight >= documentHeight) {
        pageRef.current++;
        setUsers((prev) =>
          prev.concat(
            createRandomUsers(10, region, seed, pageRef.current, errorCount)
          )
        );
      }
    }

    window.addEventListener("scroll", handlePageChange);

    return () => {
      window.removeEventListener("scroll", handlePageChange);
    };
  }, [errorCount, region, seed]);

  React.useEffect(() => {
    setUsers(createRandomUsers(20, region, seed, pageRef.current, errorCount));
  }, [seed, region, errorCount]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2 flex gap-x-2 justify-between">
        <select
          value={region}
          className="border border-1 border-black p-1.5 rounded-sm "
          onChange={(e) => {
            const newRegion = e.target.value as Region;
            setRegion(newRegion);
          }}
        >
          <option value={"random"}>Random</option>
          <option value={"en"}>USA</option>
          <option value={"pl"}>Poland</option>
          <option value={"fr"}>France</option>
        </select>

        <div className="flex items-center gap-x-2">
          <p>Seed: </p>

          <input
            type="number"
            value={seed}
            className="p-1.5 border border-1 border-black rounded-sm"
            onChange={(e) => {
              const newSeed = e.target.valueAsNumber;

              if (/\d+/.test(`${newSeed}`)) {
                setSeed(newSeed);
              }
            }}
          />

          <button
            onClick={() => {
              const newSeed = Date.now() ^ (Math.random() * 0x100000000);
              setSeed(newSeed);
            }}
          >
            random seed
          </button>
        </div>

        <div className="flex items-center gap-x-2">
          <label>Error Count: </label>

          <input
            min={0}
            max={10}
            step={0.5}
            type={"range"}
            value={errorCount}
            onChange={(e) => {
              const newErrorCount = e.target.valueAsNumber;
              setErrorCount(newErrorCount);
              setErrorCountField(newErrorCount * 100);
            }}
          />

          <input
            type="number"
            value={errorCountField}
            onChange={(e) => {
              const newErrorCountField = e.target.valueAsNumber;

              setErrorCountField(newErrorCountField);

              setErrorCount(newErrorCountField / 100);
            }}
            className="border border-1 border-black p-1.5 rounded-sm "
          />
        </div>
      </div>

      <table
        ref={tableRef}
        className="table-auto border-collapse border border-slate-400 w-full"
      >
        <thead>
          <tr>
            <th className="border border-slate-300 p-2">Index</th>
            <th className="border border-slate-300 p-2">Id</th>
            <th className="border border-slate-300 p-2">Name</th>
            <th className="border border-slate-300 p-2">Address</th>
            <th className="border border-slate-300 p-2">Phone</th>
          </tr>
        </thead>

        <tbody>
          {users.map((eachUser, index) => (
            <tr key={eachUser.id}>
              <td className="border border-slate-300 p-3">{index + 1}</td>
              <td className="border border-slate-300 p-3">{eachUser.id}</td>
              <td className="border border-slate-300 p-3">
                {eachUser.firstName} {eachUser.middleName} {eachUser.lastName}
              </td>
              <td className="border border-slate-300 p-3">
                {eachUser.country} {eachUser.city} {eachUser.street}{" "}
                {eachUser.house}
              </td>
              <td className="border border-slate-300 p-3">{eachUser.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

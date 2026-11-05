import React, { useState, useRef, useEffect } from "react";
import './../styles/App.css';

const LEVELS = { easy: 8, normal: 16, hard: 32 };

function buildTiles(count) {
  const values = [];
  for (let i = 1; i <= count / 2; i++) values.push(i, i);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = values[i];
    values[i] = values[j];
    values[j] = t;
  }
  return values.map((value, id) => ({ id, value, matched: false }));
}

const App = () => {
  const [level, setLevel] = useState("easy");
  const [tiles, setTiles] = useState(() => buildTiles(LEVELS.easy));
  const [flipped, setFlipped] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const changeLevel = (name) => {
    clearTimeout(timer.current);
    setLevel(name);
    setTiles(buildTiles(LEVELS[name]));
    setFlipped([]);
    setAttempts(0);
  };

  const handleClick = (tile) => {
    if (flipped.length >= 2) return;
    if (tile.matched) return;
    if (flipped.includes(tile.id)) return;

    const next = flipped.concat(tile.id);
    setFlipped(next);

    if (next.length === 2) {
      setAttempts((a) => a + 1);
      const first = tiles[next[0]];
      if (first.value === tile.value) {
        setTiles((prev) =>
          prev.map((t) =>
            t.id === first.id || t.id === tile.id ? { ...t, matched: true } : t
          )
        );
        setFlipped([]);
      } else {
        timer.current = setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const solved = tiles.every((t) => t.matched);

  return (
    <div>
      {/* Do not remove the main div */}
      <div className="levels_container">
        {Object.keys(LEVELS).map((name) => (
          <label key={name} htmlFor={name}>
            <input
              type="radio"
              id={name}
              name="level"
              checked={level === name}
              onChange={() => changeLevel(name)}
            />
            {name}
          </label>
        ))}
      </div>

      <p className="attempts">Attempts: {attempts}</p>
      {solved && <p className="solved">All solved in {attempts} attempts!</p>}

      <div className={"cells_container " + level}>
        {tiles.map((tile) => {
          const open = tile.matched || flipped.includes(tile.id);
          return (
            <div
              key={tile.id}
              className={
                "cell" + (open ? " flipped" : "") + (tile.matched ? " matched" : "")
              }
              onClick={() => handleClick(tile)}
            >
              {open ? tile.value : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
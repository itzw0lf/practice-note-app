import { useState, useEffect } from "react";
import "./App.css";

export default function Notes() {
  const [addNotes, setAddNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || [],
  );
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(addNotes));
  }, [addNotes]);
  return (
    <>
      <div className="sidebar">
        <h1>
          Notes <em>App</em>
        </h1>
        <div className="sidebar-dot"></div>
      </div>
      <div className="main">
        <div className="search-wrapper">
          <input
            placeholder="Search For Your Notes"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
        <div className="add-wrapper">
          <input
            placeholder="Type Your Notes"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAddNotes([...addNotes, inputValue]);
                setInputValue("");
              }
            }}
          />
          <button
            onClick={() => {
              setAddNotes([...addNotes, inputValue]);
              setInputValue("");
            }}
          >
            Add
          </button>
        </div>

        <div className="notes-list">
          {addNotes
            .filter((note) => note.includes(searchValue))
            .map((note, index) => (
              <div
                className={
                  dragIndex === index ? "note-card dragging" : "note-card"
                }
                key={index}
                draggable={true}
                onDragStart={() => {
                  setDragIndex(index);
                }}
                onDragOver={(e) => {
                  if (index === dragIndex) return;
                  e.preventDefault();
                  const updated = [...addNotes];
                  const [moved] = updated.splice(dragIndex, 1);
                  updated.splice(index, 0, moved);
                  setDragIndex(index);
                  setAddNotes(updated);
                }}
                onDrop={() => {
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
              >
                <p>{note}</p>
                <button
                  onClick={() => {
                    setAddNotes(addNotes.filter((note, i) => i !== index));
                  }}
                >
                  delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

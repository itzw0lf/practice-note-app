import { useState, useEffect } from "react";
import "./App.css";

export default function Notes() {
  const [addNotes, setAddNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || [],
  );
  const [titleValue, setTitleValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

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
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (titleValue.trim() !== "") {
                  setAddNotes([
                    ...addNotes,
                    {
                      title: titleValue.split(" ").slice(0, 2).join(" "),
                      content: titleValue,
                    },
                  ]);
                  setTitleValue("");
                }
              }
            }}
          />
          <button
            onClick={() => {
              if (titleValue.trim() !== "") {
                setAddNotes([
                  ...addNotes,
                  {
                    title: titleValue.split(" ").slice(0, 2).join(" "),
                    content: titleValue,
                  },
                ]);
                setTitleValue("");
              }
            }}
          >
            Add
          </button>
        </div>

        <div className="notes-list">
          {addNotes
            .filter(
              (note) =>
                note.title.includes(searchValue) ||
                note.content.includes(searchValue),
            )
            .map((note, index) => (
              <div
                className={
                  dragIndex === index
                    ? "note-card dragging"
                    : openIndex === index
                      ? "note-card open"
                      : "note-card"
                }
                key={index}
                draggable={true}
                onClick={() => {
                  if (editIndex === index) return;
                  if (note.title !== note.content) {
                    setOpenIndex(openIndex === index ? null : index);
                  }
                }}
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
                {editIndex === index ? (
                  <input
                    value={editValue}
                    onChange={(e) => {
                      setEditValue(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (editValue.trim() !== "") {
                          setAddNotes(
                            addNotes.map((n, i) =>
                              i === index
                                ? {
                                    title: editValue
                                      .split(" ")
                                      .slice(0, 2)
                                      .join(" "),
                                    content: editValue,
                                  }
                                : n,
                            ),
                          );
                          setEditIndex(null);
                        }
                      }
                    }}
                  />
                ) : (
                  <p>{note.title}</p>
                )}
                {openIndex === index && <p>{note.content}</p>}
                {editIndex !== index && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditIndex(index);
                      setEditValue(note.content);
                    }}
                  >
                    Edit
                  </button>
                )}
                {editIndex === index && (
                  <button
                    className="save-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddNotes(
                        addNotes.map((n, i) =>
                          i === index
                            ? {
                                title: editValue
                                  .split(" ")
                                  .slice(0, 2)
                                  .join(" "),
                                content: editValue,
                              }
                            : n,
                        ),
                      );
                      setEditIndex(null);
                    }}
                  >
                    Save
                  </button>
                )}
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

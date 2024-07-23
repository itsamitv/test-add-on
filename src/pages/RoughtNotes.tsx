import React, { useEffect, useRef, useState } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button } from "@fluentui/react-components";

dayjs.extend(timezone);
dayjs.extend(utc);

function MeetingRoughNotes({ onSave, startTimestamp, roughNotes }) {
  const [meetingRoughNotes, setMeetingRoughNotes] = useState(roughNotes);
  const editorRef = useRef(null);
  const userTimeZone = dayjs.tz.guess();
  const startTimestampDateObj = dayjs(startTimestamp * 1000).tz(userTimeZone, true);

  const getAllContents = () => {
    const allContents = [];
    // Iterate over all child elements of the parent
    Array.from(editorRef.current.children).forEach((child) => {
      // get timestamp from data attribute
      const timestamp = child.getAttribute("data-timestamp");
      const content = child.innerText;
      allContents.push({ timestamp, content });
    });
    return allContents;
  };

  function setCursorPosition() {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  const updateRoughNotes = (event) => {
    // Prevent default behavior (like creating a new line)
    event.preventDefault();
    const allContents = getAllContents();

    setMeetingRoughNotes((prev) => {
      for (const { timestamp, content } of allContents) {
        const contentIndex = prev.findIndex((note) => note.timestamp == timestamp);
        if (contentIndex !== -1 && prev[contentIndex].content !== content) {
          prev[contentIndex].content = content;
          // prev[contentIndex].timestamp = Math.round(new Date().getTime() / 1000);
        }
      }
      return prev;
    });
  };

  const handleNewContent = () => {
    let allNotes = null;
    if (meetingRoughNotes.length > 0) {
      allNotes = [
        ...meetingRoughNotes,
        {
          content: "",
          timestamp: Date.now(),
        },
      ];
    } else {
      allNotes = [
        {
          content: "",
          timestamp: Date.now(),
        },
      ];
    }

    setMeetingRoughNotes(allNotes);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleNewPastedContent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let pastedData = e.clipboardData.getData("text/plain") || e.clipboardData.getData("text/html");
    pastedData = pastedData.replace(/(<([^>]+)>)/gi, "");
    const splittedData = pastedData.split("\n");

    for (let idx = 0; idx < splittedData.length; idx++) {
      const content = splittedData[idx];
      let timestamp = dayjs().tz(userTimeZone, true).diff(startTimestampDateObj, "seconds").toFixed(2) || "0.00";
      if (idx === 0) {
        timestamp = e.target.getAttribute("data-timestamp");
        setMeetingRoughNotes((prev) => {
          const contentIndex = prev.findIndex((note) => note.timestamp == timestamp);
          if (contentIndex !== -1) {
            prev[contentIndex].content = prev[contentIndex].content + content;
          }
          return prev;
        });
      } else {
        setMeetingRoughNotes((prev) => {
          return [
            ...prev,
            {
              content,
              timestamp,
            },
          ];
        });
      }
    }
    const finalContent = getAllContents();
    onSave(finalContent);
    setTimeout(() => {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }, 100);
  };

  useEffect(() => {
    setCursorPosition();
  }, []);

  return (
    <div className="flex flex-col px-2 pb-7 w-full h-screen border border-zinc-100 mx-auto text-zinc-900">
      <main className="flex flex-col justify-between h-full">
        <section className="h-full w-full flex flex-col">
          <header className="flex justify-between mt-4 cursor-auto">
            <h2 className="text-lg font-semibold">Notes</h2>
            <div className="flex gap-1">
              <span className="shrink-0 w-4 aspect-square">
                <i className="ri-loop-left-line text-base text-neutral-400"></i>
              </span>
              <div className="my-auto text-neutral-400 ">Auto save</div>
            </div>
          </header>
          <article className="mt-2.5  overflow-auto text-zinc-900 max-md:pb-10 max-md:max-w-full cursor-auto border border-zinc-100 rounded h-full text-base">
            {meetingRoughNotes && meetingRoughNotes.length > 0 && (
              <ul
                className="list-disc px-8 pt-7 pb-8 min-h-full focus:outline-none"
                contentEditable
                suppressContentEditableWarning
                onInput={updateRoughNotes}
                ref={editorRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleNewContent();
                    const finalContent = getAllContents();
                    onSave(finalContent);
                  }
                }}
              >
                {meetingRoughNotes.map((note) => {
                  return (
                    <li
                      contentEditable
                      suppressContentEditableWarning
                      key={note.timestamp}
                      data-timestamp={note.timestamp}
                      onPaste={handleNewPastedContent}
                    >
                      {note.content}
                    </li>
                  );
                })}
              </ul>
            )}
          </article>
        </section>
        <footer className="flex gap-5 justify-between mt-4 max-md:flex-wrap max-md:max-w-full">
          <Button
            type="primary"
            className="justify-center items-center px-16 py-4 text-base font-medium rounded-lg max-md:px-5 text-white bg-orange-500 w-full"
            onClick={() => {
              const finalContent = getAllContents();
              onSave(finalContent);
            }}
          >
            Save
          </Button>
        </footer>
      </main>
    </div>
  );
}

export default MeetingRoughNotes;

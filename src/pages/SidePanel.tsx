import React, { useState, useEffect, useCallback } from "react";


import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import MeetingRoughNotes from "./RoughtNotes";


dayjs.extend(timezone);
dayjs.extend(utc);



const SidePanel = () => {
  const userTimeZone = dayjs.tz.guess();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [meetingStartTimestamp, setMeetingStartTimestamp] = useState(Date.now());
  const [meetingRoughNotes, setMeetingRoughNotes] = useState<any[]>([{content: "", timestamp:Date.now()}]);




  console.log(meetingRoughNotes);



  return( <div>
      <MeetingRoughNotes
        roughNotes={meetingRoughNotes}
        startTimestamp={meetingStartTimestamp}
        onSave={(roughNotes) => {
          if (roughNotes) {
            setMeetingRoughNotes(roughNotes);
          }
        }}
      />
    </div>)
  
};

export default SidePanel;

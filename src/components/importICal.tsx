import { useEffect, useState } from "react";

export const ImportICalPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [iCalURL, setICalURL] = useState("");
  const [calendarICalData, setCalendarICalData] = useState(
    null as string | null
  );
  useEffect(() => {
    // check if iCalURL is valid
    if (
      iCalURL.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
      )
    ) {
      // fetch the iCal file using proxy to avoid CORS issues
      fetch(`https://corsproxy.io/?${iCalURL}`).then(async (response) => {
        if (response.ok) {
          // invalid iCal URL
          return;
        }
        let data = await response.text();
        setCalendarICalData(data);
      });
    }
  }, [iCalURL]);
};

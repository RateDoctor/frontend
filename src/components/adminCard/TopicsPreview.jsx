import React, { useRef, useState, useEffect } from "react";

const TopicsPreview = ({ topics }) => {
  const containerRef = useRef(null);
  const [visibleTopics, setVisibleTopics] = useState([]);
  const [hiddenCount, setHiddenCount] = useState(0);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    if (!topics || topics.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const maxWidth = container.offsetWidth; // 185px
    const testSpan = document.createElement("span");
    testSpan.style.visibility = "hidden";
    testSpan.style.whiteSpace = "nowrap";
    testSpan.style.position = "absolute";
    container.appendChild(testSpan);

    let currentWidth = 0;
    const fitted = [];

    topics.forEach((t, index) => {
      const text = capitalize(typeof t === "string" ? t : t.name || "");
      const textWithComma = index < topics.length - 1 ? `${text}, ` : text;

      testSpan.textContent = textWithComma;
      const wordWidth = testSpan.offsetWidth;

      if (currentWidth + wordWidth <= maxWidth - 35) { // keep space for “+N more”
        fitted.push(text);
        currentWidth += wordWidth;
      } else {
        setHiddenCount(topics.length - fitted.length);
        return;
      }
    });

    setVisibleTopics(fitted);
    container.removeChild(testSpan);
  }, [topics]);

  return (
    <p className="topics" ref={containerRef} style={{ maxWidth: "185px", overflow: "hidden", whiteSpace: "nowrap" }}>
      {topics && topics.length > 0 ? (
        <>
          {visibleTopics.map((t, i) => (
            <React.Fragment key={i}>
              {t}
              {i < visibleTopics.length - 1 ? ", " : ""}
            </React.Fragment>
          ))}
          {hiddenCount > 0 && (
            <span className="topic-more"> +{hiddenCount} more</span>
          )}
        </>
      ) : (
        <span>No topic</span>
      )}
    </p>
  );
};

export default TopicsPreview;

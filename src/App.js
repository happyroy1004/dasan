// 모바일 대응: 표 가로 스크롤 처리 (스와이프 가능)
import React, { useState, useRef } from "react";
import data from "./약물데이터.json";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [sameDoseOnly, setSameDoseOnly] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = data
      .filter((item) =>
        item["약품명"]?.toLowerCase().startsWith(lower)
      )
      .slice(0, 10);
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item["약품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
  };

  const handleSearchClick = () => {
    const selected = data.find((item) => item["약품명"] === query);
    if (selected) {
      setSelectedDrug(selected);
      setSuggestions([]);
      setSameDoseOnly(false);
    }
  };

  const getFilteredDrugs = () => {
    if (!selectedDrug) return [];
    const baseIngredient = selectedDrug["성분"]?.replace(/,$/, "").trim();
    const baseDose = selectedDrug["용량"]?.trim();

    return data.filter((item) => {
      const sameIngredient =
        item["성분"]?.replace(/,$/, "").trim() === baseIngredient;
      const sameDose = item["용량"]?.trim() === baseDose;
      return sameIngredient && (!sameDoseOnly || sameDose);
    });
  };

  return (
    <div style={{
      padding: "20px",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "600px",
      margin: "0 auto",
      position: "relative"
    }}>
      <h1 style={{ textAlign: "center" }}>약물 검색기</h1>
      <div style={{ display: "flex", flexDirection: "row", width: "100%", maxWidth: "400px", position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="약품명을 입력하세요"
          style={{ flex: 1, padding: "10px", fontSize: "16px" }}
        />
        <button
          onClick={handleSearchClick}
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            marginLeft: "5px",
            backgroundColor: "#2F75B5",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          검색
        </button>
        <ul
          style={{
            listStyle: "none",
            paddingLeft: 0,
            maxHeight: "160px",
            overflowY: "auto",
            border: suggestions.length > 0 ? "1px solid #ccc" : "none",
            margin: 0,
            width: "100%",
            background: "white",
            position: "absolute",
            top: "45px",
            zIndex: 2
          }}
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(item)}
              style={{ cursor: "pointer", padding: "8px" }}
            >
              {item["약품명"]}
            </li>
          ))}
        </ul>
      </div>

      {selectedDrug && (
        <div style={{ marginTop: "40px", width: "100%" }}>
          <h2>동일 성분 제품</h2>
          <label>
            <input
              type="checkbox"
              checked={sameDoseOnly}
              onChange={() => setSameDoseOnly(!sameDoseOnly)}
            />
            &nbsp;동일 용량만 보기
          </label>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                minWidth: "600px",
                width: "100%",
                marginTop: "15px",
                borderCollapse: "collapse",
                fontSize: "13px",
                wordBreak: "keep-all",
                tableLayout: "fixed"
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap" }}>약품명</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px", fontSize: "12px", whiteSpace: "nowrap" }}>성분</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap" }}>용량</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap" }}>제약사</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap" }}>약가</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredDrugs().map((drug, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{drug["약품명"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px", fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{drug["성분"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap" }}>{drug["용량"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap" }}>{drug["제약사"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px", whiteSpace: "nowrap" }}>{drug["약가"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

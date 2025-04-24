import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./약물데이터.json";

const categories = ["소화기계", "진통제", "호흡기계", "항생제", "순환기계", "당뇨병용제"];

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [sameDoseOnly, setSameDoseOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedDrug(null);
    setSelectedCategory(null);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = data.filter((item) =>
      item["약품명"]?.toLowerCase().startsWith(lower)
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item["약품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
    setSelectedCategory(null);
  };

  const handleSearchClick = () => {
    const selected = data.find((item) => item["약품명"] === query);
    if (selected) {
      setSelectedDrug(selected);
      setSuggestions([]);
      setSameDoseOnly(false);
      setSelectedCategory(null);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setQuery("");
    setSelectedDrug(null);
    setSuggestions([]);
  };

  const getFilteredDrugs = () => {
    if (selectedDrug) {
      const baseIngredient = selectedDrug["성분"]?.replace(/,$/, "").trim();
      const baseDose = selectedDrug["용량"]?.trim();

      return data.filter((item) => {
        const sameIngredient = item["성분"]?.replace(/,$/, "").trim() === baseIngredient;
        const sameDose = item["용량"]?.trim() === baseDose;
        return sameIngredient && (!sameDoseOnly || sameDose);
      });
    }

    if (selectedCategory) {
      return data.filter((item) => item["분류"] === selectedCategory);
    }

    return [];
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

      {/* 검색창 */}
      <div style={{ display: "flex", flexDirection: "row", width: "100%", maxWidth: "400px", position: "relative" }}>
        <FaSearch style={{ fontSize: "20px", marginRight: "8px", alignSelf: "center", color: "#2F75B5" }} />
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

      {/* 설명창 + 카테고리 버튼 */}
      {!selectedDrug && !selectedCategory && (
        <>
          <div style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "15px",
            marginTop: "20px",
            fontSize: "14px",
            lineHeight: "1.6",
            width: "100%"
          }}>
            <p>💊 다산팜에서 거래하는 약물 리스트를 검색할 수 있습니다.</p>
            <p>💊 제품명으로 검색하시면 동일 성분의 약물들을 확인할 수 있습니다.</p>
            <p>💊 약가는 매일 영업일 10시 경에 업데이트됩니다.</p>
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px"
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                  background: "#f0f0f0",
                  cursor: "pointer"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 결과 테이블 */}
      {(selectedDrug || selectedCategory) && (
        <div style={{ marginTop: "40px", width: "100%" }}>
          <h2>{selectedDrug ? "동일 성분 제품" : `📂 ${selectedCategory} 카테고리`}</h2>
          {selectedDrug && (
            <label>
              <input
                type="checkbox"
                checked={sameDoseOnly}
                onChange={() => setSameDoseOnly(!sameDoseOnly)}
              />
              &nbsp;동일 용량만 보기
            </label>
          )}
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                minWidth: "700px",
                width: "100%",
                marginTop: "15px",
                borderCollapse: "collapse",
                fontSize: "13px",
                tableLayout: "auto"
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>약품명</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>성분</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>용량</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>제약사</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>약가</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredDrugs().map((drug, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["약품명"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["성분"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["용량"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["제약사"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["약가"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer style={{ marginTop: "60px", fontSize: "13px", color: "#888" }}>
        HSY © 2025 | netizenlily@naver.com
      </footer>
    </div>
  );
}

export default App;

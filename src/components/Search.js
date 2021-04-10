import React from "react";
import SearchIcon from "@material-ui/icons/Search";

export default function Search({ input, setInput }) {
  return (
    <div className="mainSearch">
      {!input && <SearchIcon className="icon"/>}
      <input
        type="text"
        value={input}
        placeholder="Search"
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}

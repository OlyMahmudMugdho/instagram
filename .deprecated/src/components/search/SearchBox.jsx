
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";




const SearchBox = (props) => {




    return (
        <input
            type="text"
            name="search"
            className="border border-solid border-zinc-600 py-1 w-10/12 lg:w-2/3 px-2 lg:px-3 text-lg"
            placeholder="search for user"
            onChange={e => setQuery(e.target.value)}
        />
    )
}

export default SearchBox
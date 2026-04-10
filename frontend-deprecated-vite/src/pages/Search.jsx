import { useEffect, useRef, useState } from "react";
import Menu from "./Menu"
import Loading from "../components/layout/Loading";
import Single from "../components/layout/suggested/Single";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";




const Search = () => {

    const [accessToken, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [names, setNames] = useState([]);
    const [userIDs, setUserIDs] = useState([]);
    const [usernames, setUserNames] = useState([]);
    const [query, setQuery] = useState(null);
    const [empty, setEmpty] = useState(false);
    const [result, setResult] = useState(null);
    const [fetching,setFetching] = useState(false);
    const [suggestedClassName, setSuggestedClassName] = useState("w-full flex flex-col justify-center items-center lg:w-10/12 ");

    const [resultClassName, setResultClassName] = useState("hidden w-full lg:w-10/12 flex flex-col justify-center items-center");

    const [notFoundClassName,setNotFoundClassName] = useState("hidden py-10");

    const [clearButtonClass,setClearButtonClass] = useState("absolute right-48 hidden");


    const searchField = useRef(null);

    const search = (event) => {
        event.preventDefault();
        console.log(query)
    }

    const clearQuery = (event) => {
        event.preventDefault();
        setQuery(null);
        searchField.current.value = ""
    }

    useEffect(() => {
        fetch("https://instagram-cx9j.onrender.com/token", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setToken(data.accessToken)
                localStorage.setItem('accessToken', JSON.stringify(data.accessToken))
                fetch('https://instagram-cx9j.onrender.com/users', {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setNames([...data.data.names]);
                        setUserNames([...data.data.usernames]);
                        setUserIDs([...data.data.userIDs]);
                    })
            })
    }, [accessToken])





    useEffect(() => {
        if (query) {
            setLoading(true);
            setSuggestedClassName(("hidden w-full flex flex-col justify-center items-center"));
            setResultClassName("w-full flex flex-col justify-center items-center lg:ml-40");
            if(empty){
                setNotFoundClassName("py-10")
            }
            setFetching(true)
            setClearButtonClass("absolute right-48");
        }
        if ((!query)) {
            setLoading(false);
            setSuggestedClassName("w-full flex flex-col justify-center items-center  lg:absolute lg:top-24 lg:left-28 ");
            setResultClassName("hidden w-full flex flex-col justify-center items-center");
            if(!empty) {
                setNotFoundClassName("hidden py-10")
            }
            setFetching(false);
            setClearButtonClass("absolute right-48 hidden");
        }
    }, [query])



    useEffect(() => {
        fetch('https://instagram-cx9j.onrender.com/token', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data.accessToken);
                fetch(`https://instagram-cx9j.onrender.com/search?q=${query}`, {
                    headers: {
                        'authorization': `Bearer ${data.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'

                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data.success && (!data.empty)) {
                            setResult(data.result);
                            setNotFoundClassName("hidden py-10");
                            setEmpty(false)
                        }
                        if(data.success && data.empty) {
                            setEmpty(true)
                            setResult(null);
                            setNotFoundClassName("py-10")
                        }
                    })
                    .then(setLoading(false))
            })
    }, [query])

    return (
        <div className="flex flex-col py-8 w-full lg:w-10/12 justify-center items-center lg:relative lg:ml-24 ">

            <div className="w-full lg:w-10/12 lg:ml-40 lg:mb-10">
                <form className="flex flex-row justify-center items-center gap-1 w-full relative" onSubmit={search}>
                    <input
                        type="text"
                        name="search"
                        className="border border-solid border-zinc-600 py-1 w-10/12 lg:w-2/3 px-2 lg:px-3 text-lg"
                        placeholder="search for user"
                        onChange={e => setQuery(e.target.value)}
                        ref={searchField}
                    />
                    <button onClick={clearQuery} className={clearButtonClass}>
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    <button className="flex justify-center items-center">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl text-zinc-600  h-6 py-1 px-2" />
                    </button>
                </form>
            </div>


            {(loading) ? <Loading /> :
                <div className={suggestedClassName}>
                    {names.map((item, id) => <Single key={id} accessToken={accessToken} name={item} userID={userIDs[id] } username={usernames[id]}
                    />)}
                </div>
            }

            {(result) ?
                <div className={resultClassName}>
                    {result.names.map((item, id) => <Single key={id} accessToken={accessToken} name={item} userID={result.userIDs[id] } username={result.usernames[id]}
                    />)}
                </div> : null }

             { (empty && fetching) ? <h1 className="py-40 text-2xl font-medium text-center lg:ml-20 ">no user found</h1> : null }

            <Menu />
        </div>
    )
}

export default Search
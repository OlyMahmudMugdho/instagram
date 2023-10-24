
const fetchAccessToken = async (url) => {
    const data = await fetch(url, {
       /*  headers : {
            authorization : `Bearer ${refreshToken}`
        }, */
        headers : { "Content-Type" : "application/json"},
        credentials: 'include'
    });
    const response = await data.json();
    return await response;
}

export default fetchAccessToken;


const like = (userID, postID) => {
    let acccessToken;
    fetch("https://instagram-cx9j.onrender.com/token", {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => acccessToken = data.acccessToken)
        .then(() => console.log(acccessToken))
        .then(
            () => {
                fetch(`https://instagram-cx9j.onrender.com/like/${userID}/${postID}`, {
                    headers: {
                        'authorization': `Bearer ${acccessToken}`,
                        'Content-Type' : 'application/json'
                    },
                    credentials: 'include'
                })
                    .then(res => console.log(res.json()))
                    .then(() => null)
            }
        )
}

export default like
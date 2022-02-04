const axios = require("axios")

const getDataByTags = async (urls) => {

    //fetching data from URL's may not work, so we have to either resolve or reject.
    return new Promise((resolve, reject) => {
        //get a list of URL's that are passed thru the function. They are then converted to a list of axios requests. Allow us to perform a GET request.
        const axiosRequests = urls.map(url => (axios.get(url)))
        //create an empty object to store Id's of posts previously seen. Removes duplicate Id's.
        const existingIds = {}
        //storing the posts themselves, if they're not duplicates.
        const uniquePostList = []

        //call all the requests, then get responses from all the requests.
        axios.all(axiosRequests).then(axios.spread((...responses) => {
            //get an array of responses.
            responses.forEach(res => {
                //loop thru list of responses that gives a list of id's and a new list of posts.
                res.data.posts.forEach(post => {
                    //loop thru list of posts and see if it already exists in id list. 
                    if (!existingIds.hasOwnProperty(post.id)) {
                        uniquePostList.push(post)
                        existingIds[post.id] = true
                    }
                })
                // console.log(res.data.posts)

            })
            //no errors, so we return the post list.
            resolve(uniquePostList)
        }
            //if we get errors, we reject them.
        )).catch(errors => {
            reject(errors)
        })
    }) //return promise
} //close getDataByTags

exports.getDataByTags = getDataByTags
const registerUser = async (req , res ) => {
    res.send("User Register....")
}


const loginUser = async (req , res ) => {
    res.send("User loggedin....")
}




const authService = {
    registerUser,
    loginUser
}


export default authService
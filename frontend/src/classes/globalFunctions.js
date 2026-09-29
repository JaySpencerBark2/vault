class GlobalFunctions {

    static async getCurrentLoggedInUser() {
        try{
            let response = await fetch("http://localhost:3000/login/get/current/user/", 
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }
            )

            if(!response.ok){
                throw new Error("Unauthorized");
            }

            return await response.json();
        }catch(e){
            console.log(e);
        }
    }
}

export default GlobalFunctions;
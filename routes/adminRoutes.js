const {Router} = require("express")
const verifyAdmin = require("../middlewares/verifyAdmin")
const {adminLogin , deleteUser , updateUser , createUser , getUsersByAdmin , getUserById} = require("../controllers/adminControllers")

const router = Router()


router.post("/login" , adminLogin)

router.get("/getUsersByAdmin" , verifyAdmin , getUsersByAdmin)

router.get("/getUserById/:userId" , verifyAdmin , getUserById)

router.post("/createUser" , verifyAdmin , createUser)

router.delete("/deleteUser/:userId" , verifyAdmin , deleteUser)

router.put("/updateUser/:userId" , verifyAdmin , updateUser)


module.exports = router
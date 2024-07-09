import express from "express"
import "dotenv/config"
import { PORT } from "./config"
import {main} from "./bot"
import interfaceRoute from "./routes/interfaceRoute"
import cors from "cors"
const app = express();

app.use(cors())

app.use(interfaceRoute)
main()

app.listen(PORT, () => {
    console.log(`Server is Running in port ${PORT}`)
})
import { Request, Response } from "express-serve-static-core"
import { readCsv } from "../utils"

export const showWallets = async (req: Request, res: Response) => {
    try {
        const wallets = await readCsv()
        res.status(200).json({ wallets })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal server error" })
    }
}

import "dotenv/config";
import { getEmbeddings } from "./lib/OpenAi";

export async function UserQuery(req: any, res: any) {
  try {
    // get user msg
    const userQueryMsg = req.body;
    if (!userQueryMsg || !userQueryMsg.trim()) { 
      return res.status(400).json("Send Valid Msg !")
    }
    // embded the msg into vector 
    const embededResult = await getEmbeddings(userQueryMsg)
    // get the vector match in the db 
    
    // returh chunks that match the msg embded vector
    // build the General prompt => Strong Model 
    // send the msg to ai with chunks
    // send the res back to user 
  } catch (err) {
    console.log("Server Error", err);
    res.status(500).json("Error in User Query Message");
  }
}

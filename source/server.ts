import https from "http";
import ExpressApp from "./app";
import { AppConfig } from "./config/Constants";

const httpServer = https.createServer(ExpressApp);
httpServer.listen(AppConfig.PORT, () => {
    //Basic Details for server
    const serverObject: Object = {
        port: AppConfig.PORT,
    }
    console.log(`The server is running.\n`, serverObject)
});
httpServer.timeout = 1200000;  // 2 Minutes
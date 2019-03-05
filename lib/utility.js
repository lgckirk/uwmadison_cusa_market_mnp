import Product from "../models/Product";
import wxp from "utility_module/wxp";
import URL from "utility_module/URL";
import productExplorer from "utility_module/productExplorer";
import userID from "utility_module/userID";
import info from "utility_module/info";
import contact from "utility_module/contact";
import type from "utility_module/type";
// NOTE: local variables and function names should start with "_" (不要删这条注释)
const modules = [URL, wxp, productExplorer, contact, type, userID, info];
let handlers = {};
for (let i=0;i<modules.length;i++){
  for (let handle in modules[i]){
    if (handle.indexOf("_")!=0) // not a private function
      handlers[handle] = modules[i][handle];
  }
}

export default handlers;

// exports = module.exports = handlers;

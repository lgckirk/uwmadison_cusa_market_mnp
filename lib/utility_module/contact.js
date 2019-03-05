import Product from "../../models/Product";
import URL from "URL";
import wxp from "wxp";
import userID from "userID";
/**
 * Let user pick qr code from photo gallery
 * and upload as the user's contact info
 * If multiple images are uploaded, the latest qr code is recorded
 * @return Promisified action
 * resolve with true if images chosen are chosen and uploaded successfully
 * resolve with false if no image is chosen
 */ 
function uploadMyContact(){
  let data = {
    "Action": "PostUserContact"
  }
  let imageChosen = true;
  return userID.getUserId()
         .then(id=>data["UserId"] = id)
         .then(()=>console.log("Start choose image"))
         .then(wxp.chooseImagePromise)
         .then(qrCode=>{
          console.log(qrCode);
          return qrCode;
         })
         .then(qrCode=>qrCode && qrCode.length>0?
          wxp._requestPromise(URL._marketUrl, data, qrCode[0], "ContactImage")
          :imageChosen = false) // Determine if images are chosen
         .then(_=>{
          // Update if the user has contact info
          getMyContact._hasContact = getMyContact._hasContact||imageChosen
          return imageChosen;
         })
}

/**
 * Get url of the contact qr code of the user with specific id
 * @param usedId
 * @return Promisified acion
 * resolve with url when contact info is found
 * resolve with null if the user does not have contact info
 */
function getContactById(userId){
  let config = {
    "Action": "CheckContact",
    "UserId": userId
  };
  return wxp._requestPromise(URL._marketUrl, config)
  .then(data=>{
    if (data.Contact == 0) return null;
    return URL._contactInfoUrl.replace("[UserId]", userId) + "?" + Math.random()/9999;
  });
}

/**
 * Though the name indicates it should return url or something similar,
 * in practice, it is often only necessary to determine if the user has uploaded contact info
 * Thus, the function returns boolean implying if contact info has been uploaded before
 *
 */
function getMyContact(){
  if (getMyContact._hasContact!=undefined)
    return new Promise(res=>res(getMyContact._hasContact));
  return userID.getUserId()
        .then(userId => getContactById(userId))
        .then(contactURL => getMyContact._hasContact = (contactURL!=null))
} 

export default {
 uploadMyContact,
 getContactById,
 getMyContact 
}
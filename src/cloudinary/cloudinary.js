import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize'; 
// import { format } from '@cloudinary/url-gen/actions/format'; // Correct import 
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import conf from "../conf/conf.js";
import axios from "axios";

const uploadFile = async (file) => {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", conf.cloudinaryUploadPreset);
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${conf.cloudinaryName}/image/upload`,
      formData
    );
    const url = getFile(response.data.public_id)
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const deleteFile = async ({publicId}) => {
  if (!publicId) return alert("Public ID is required to delete an asset");
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${conf.cloudinaryName}/image/destroy`,
      {
        api_key: conf.cloudinaryApiKey,
        api_secret: conf.cloudinaryApiSecret,
        public_id: publicId,
        invalidate: true,
      }
    );
    console.log("File deleted successfully:", response.data);
    alert("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    alert("Error deleting file");
  }
};

const getFile = async (publicId) => {
  const cld = new Cloudinary({ cloud: { cloudName: conf.cloudinaryName } });
  const img = cld.image(publicId) 
  // .format(format().auto()) // Correct usage 
  .quality("auto") .resize(fill().gravity(autoGravity()).width(300).height(300))

  return img.toURL();
};

export { uploadFile, deleteFile, getFile };

// import { AdvancedImage } from '@cloudinary/react';

import axios from "axios";
export const upload = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uid", "92637f6f565f6f34de32c0435603d134");
        formData.append("token", "ea478013eb4d470a1b910a4642db69ea")
        const res = await axios.post("https://www.imgurl.org/api/v2/upload", formData);
        return res.data.data.url;
    } catch (err) {
        console.log(err);
    }
}; 
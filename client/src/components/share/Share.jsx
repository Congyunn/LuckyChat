import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Button } from "antd";
import axios from "axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  const upload = async (file) => {
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

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    setSendLoading(true);
    let imgUrl = "";
    if (file) imgUrl = await upload(file);
    console.log(imgUrl)
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
    setSendLoading(false);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <Button type="primary" loading={sendLoading} onClick={handleClick}>Share</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;

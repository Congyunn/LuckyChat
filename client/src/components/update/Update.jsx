import { useState, useContext } from "react";
import {Button} from 'antd'
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });
  const {currentUser, setCurrentUser} = useContext(AuthContext);

  const upload = async (file) => {
    console.log(file)
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

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const coverUrl = cover ? await upload(cover) : user.coverPic;
    const profileUrl = profile ? await upload(profile) : user.profilePic;
    const userAuth = { ...texts, coverPic: coverUrl, profilePic: profileUrl, id: currentUser.id }
    mutation.mutate(userAuth);
    setCurrentUser(userAuth || null)
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
    setUpdateLoading(false)
  }
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <Button onClick={handleClick} type="primary" loading={updateLoading} >Update</Button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;

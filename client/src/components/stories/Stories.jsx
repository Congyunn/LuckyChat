import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories?userId=" + currentUser.id).then((res) => {
      return res.data;
    })
  );

  //TODO Add story using react-query mutations and use upload function.

  return (
    <div className="stories">
      <div className="story">
        <img src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
        <span>Add your stroy：{currentUser.name}</span>
        <button>+</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
          ? "loading"
          : data.map((story) => (
            <div className="story" key={story.id}>
              <img src={story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;

import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Modal, Spin, Form, Alert, Image } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { upload } from '../../utils/uploadImg'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Stories = () => {

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const [isAddStoryModalVisible, setIsAddStoryModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [addStoryLoading, setAddStoryLoading] = useState(false);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories?userId=" + currentUser.id).then((res) => {
      return res.data;
    })
  );

  const showModal = () => {
    setIsAddStoryModalVisible(true);
  }
  const hideModal = () => {
    setIsAddStoryModalVisible(false);
    setFile(null);
    form.resetFields();
  }

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );
  const handleAddStory = async (e) => {
    e.preventDefault();
    setAddStoryLoading(true);
    let imgUrl = "";
    if (file) imgUrl = await upload(file);
    mutation.mutate({ img: imgUrl });
    setFile(null);
    setAddStoryLoading(false);
    setIsAddStoryModalVisible(false);
  }

  const jumpToProfile = (story) => {
    navigate(`profile/${story.userId}`)
  }

  return (
    <div className="stories">
      <Modal title="My story!" open={isAddStoryModalVisible}
        onCancel={hideModal} onOk={handleAddStory}
        okText="发布" cancelText="取消" confirmLoading={addStoryLoading} >
        <hr /><br />
        <Form
          name="basic"
          autoComplete="off"
          form={form}
        >
          {/* <Form.Item
            label="Story Description"
            name="desc"
            rules={[{ required: true, message: '请填写故事描述' }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="img"
            label="Upload Image"
            rules={[{ required: true, message: '分享故事要分享照片奥' }]} >
            <div>
              <input
                type="file"
                id="storyFile"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="storyFile">
                <div className="item">
                  <UploadOutlined />
                </div>
              </label>
            </div>
          </Form.Item>
          <Form.Item>
            {file ? <Image alt="" style={{ width: '200px', height: '200px' }} src={URL.createObjectURL(file)} /> : <div />}
          </Form.Item>
        </Form>
      </Modal>
      <div className="story">
        <img src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
        <span>Add your stroy：{currentUser.name}</span>
        <button onClick={showModal}>+</button>
      </div>
      {error
        ? <Alert message="获取故事出现错误" type="error" />
        : isLoading
          ? <Spin />
          : data.map((story) => (
            <div className="story" key={story.id}>
              <img src={story.img} alt="" onClick={() => jumpToProfile(story)} />
              <span onClick={() => jumpToProfile(story)}>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;

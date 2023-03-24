import { useState, useContext } from "react";
import { message, Form, Image, Input, Modal } from 'antd'
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upload } from '../../utils/uploadImg'
import { AuthContext } from "../../context/authContext";

const Update = ({ openUpdate, setOpenUpdate, user }) => {

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

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
    form.validateFields().then(async (values) => {
      setUpdateLoading(true);
      const coverUrl = cover ? await upload(cover) : user.coverPic;
      const profileUrl = profile ? await upload(profile) : user.profilePic;
      const userAuth = { ...values, coverPic: coverUrl, profilePic: profileUrl, id: currentUser.id }
      mutation.mutate(userAuth);
      messageApi.open({
        type: 'success',
        content: '信息修改成功！',
      });
      setTimeout(() => {
        setCurrentUser(userAuth || null)
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
        setUpdateLoading(false)
      }, 1000);
    }).catch((e) => {
      messageApi.open({
        type: 'error',
        content: `信息修改失败，失败原因：${e}`,
      });
    });
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        initialValues={{
          email: currentUser?.email,
          name: currentUser?.name,
          city: currentUser?.city,
          website: currentUser?.website,
          desc: currentUser?.desc
        }}>
        <Modal
          open={openUpdate}
          okButtonProps={{
            loading: updateLoading
          }}
          onOk={handleClick}
          onCancel={() => setOpenUpdate(false)}
        >
          <div className="update">
            <div className="wrapper">
              <h1>Update Your Profile</h1>
              <br />
              <form>
                <div className="files">
                  <h3>Cover Picture</h3>
                  <div className="imgContainer">
                    <Image
                      src={
                        cover
                          ? URL.createObjectURL(cover)
                          : user?.coverPic
                      }
                      alt=""
                      width={'200px'}
                      height={'200px'}
                    />
                  </div>
                  <Input
                    type="file"
                    id="cover"
                    onChange={(e) => setCover(e.target.files[0])}
                  />
                  <br /><br />
                  <h3>Profile Picture</h3>
                  <div className="imgContainer">
                    <Image
                      src={
                        profile
                          ? URL.createObjectURL(profile)
                          : user?.profilePic
                      }
                      alt=""
                      width={'200px'}
                      height={'200px'}
                    />
                  </div>
                  <Input
                    type="file"
                    id="profile"
                    onChange={(e) => setProfile(e.target.files[0])}
                  />
                  <br /><br />
                </div>
                <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Country/City" name="city">
                  <Input />
                </Form.Item>
                <Form.Item label="Website" name="website">
                  <Input />
                </Form.Item>
                <Form.Item label="Description" name="desc">
                  <Input />
                </Form.Item>
              </form>
            </div>
          </div>
        </Modal>
      </Form >
    </>
  );
};

export default Update;

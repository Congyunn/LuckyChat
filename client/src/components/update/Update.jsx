import { useState, useContext, useRef } from "react";
import {
  message, Form, Image,
  Input, Modal, DatePicker,
  Radio, Button, Drawer,
  Card, Col, Row
} from 'antd'
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upload } from '../../utils/uploadImg'
import { AuthContext } from "../../context/authContext";
import { chinaDateToDatetime } from "../../utils/chinaDateToDatetime";
import dayjs from "dayjs";

const { Meta } = Card;

const Update = ({ openUpdate, setOpenUpdate, user }) => {

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const interestRef = useRef(new Array(12).fill(false));

  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const interestArr = JSON.parse(currentUser?.interest) || [];
  const [selectInterest, setSelectInterest] = useState({
    bianchengxuexi: interestArr[0],
    diannaozhuangji: interestArr[1],
    qiuzhimianshi: interestArr[2],
    liuxuezhinan: interestArr[3],
    qiuleiyundong: interestArr[4],
    kexuekepu: interestArr[5],
    sheying: interestArr[6],
    meishi: interestArr[7],
    chuanda: interestArr[8],
    gaoxiaorichang: interestArr[9],
    yundongjianshen: interestArr[10],
    chuidiao: interestArr[11]
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        messageApi.open({
          type: 'success',
          content: '信息修改成功！',
        });
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
      const userAuth = {
        ...values, coverPic: coverUrl, profilePic: profileUrl,
        id: currentUser.id, brithday: chinaDateToDatetime(form.getFieldValue('brithday')),
        interest: JSON.stringify(interestRef.current)
      }
      mutation.mutate(userAuth);
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

  const changeBrithday = () => {
    form.setFieldValue('age',
      (new Date().getFullYear() -
        chinaDateToDatetime(form.getFieldValue('brithday')).split('-')[0] + 1)
      || 0)
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        initialValues={{
          email: currentUser?.email,
          name: currentUser?.name,
          brithday: dayjs(currentUser?.brithday, 'YYYY-MM-DD'),
          age: currentUser?.age,
          gender: Number(currentUser?.gender),
          interest: currentUser?.interest,
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
          destroyOnClose
        >
          <div className="update">
            <div className="wrapper">
              <h1>Update Your Profile</h1>
              <br />
              <form>
                <div className="files">
                  <h3>背景图片</h3>
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
                  <h3>头像</h3>
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
                  <Input disabled />
                </Form.Item>
                <Form.Item label="昵称" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="生日" name="brithday">
                  <DatePicker onChange={changeBrithday} />
                </Form.Item>
                <Form.Item label="年龄" name="age">
                  <Input disabled bordered={false} />
                </Form.Item>
                <Form.Item label="性别" name="gender">
                  <Radio.Group name="genderGroup" >
                    <Radio value={1}>男</Radio>
                    <Radio value={0}>女</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="兴趣" name="interest">
                  <Button type="primary" onClick={() => setDrawerVisible(true)} >选择兴趣领域（可多选）</Button>
                  <Drawer title="选择您的兴趣领域" placement="right"
                    onClose={() => setDrawerVisible(false)} open={drawerVisible}>
                    <Row>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.bianchengxuexi ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, bianchengxuexi: !selectInterest.bianchengxuexi }); interestRef.current[0] = !interestRef.current[0] }}
                        >
                          <Meta description="编程学习" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.diannaozhuangji ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, diannaozhuangji: !selectInterest.diannaozhuangji }); interestRef.current[1] = !interestRef.current[1] }}
                        >
                          <Meta description="电脑领域" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.qiuzhimianshi ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, qiuzhimianshi: !selectInterest.qiuzhimianshi }); interestRef.current[2] = !interestRef.current[2] }}
                        >
                          <Meta description="求职面试" />
                        </Card>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.liuxuezhinan ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/7579319/pexels-photo-7579319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, liuxuezhinan: !selectInterest.liuxuezhinan }); interestRef.current[3] = !interestRef.current[3] }}
                        >
                          <Meta description="留学指南" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.qiuleiyundong ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, qiuleiyundong: !selectInterest.qiuleiyundong }); interestRef.current[4] = !interestRef.current[4] }}
                        >
                          <Meta description="球类运动" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.kexuekepu ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, kexuekepu: !selectInterest.kexuekepu }); interestRef.current[5] = !interestRef.current[5] }}
                        >
                          <Meta description="科学科普" />
                        </Card>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.sheying ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, sheying: !selectInterest.sheying }); interestRef.current[6] = !interestRef.current[6] }}
                        >
                          <Meta description="摄影" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.meishi ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, meishi: !selectInterest.meishi }); interestRef.current[7] = !interestRef.current[7] }}
                        >
                          <Meta description="美食" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.chuanda ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, chuanda: !selectInterest.chuanda }); interestRef.current[8] = !interestRef.current[8] }}
                        >
                          <Meta description="穿搭" />
                        </Card>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.gaoxiaorichang ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/4658105/pexels-photo-4658105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, gaoxiaorichang: !selectInterest.gaoxiaorichang }); interestRef.current[9] = !interestRef.current[9] }}
                        >
                          <Meta description="搞笑日常" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.yundongjianshen ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, yundongjianshen: !selectInterest.yundongjianshen }); interestRef.current[10] = !interestRef.current[10] }}
                        >
                          <Meta description="运动健身" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card
                          hoverable
                          style={{ width: 110, backgroundColor: selectInterest.chuidiao ? '#FFE5B4' : 'white' }}
                          cover={<img alt="example" src="https://images.pexels.com/photos/294674/pexels-photo-294674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />}
                          onClick={() => { setSelectInterest({ ...selectInterest, chuidiao: !selectInterest.chuidiao }); interestRef.current[11] = !interestRef.current[11] }}
                        >
                          <Meta description="垂钓🎣" />
                        </Card>
                      </Col>
                    </Row>
                  </Drawer>
                </Form.Item>
                <Form.Item label="位置" name="city">
                  <Input />
                </Form.Item>
                <Form.Item label="网站" name="website">
                  <Input />
                </Form.Item>
                <Form.Item label="个人简介" name="desc">
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

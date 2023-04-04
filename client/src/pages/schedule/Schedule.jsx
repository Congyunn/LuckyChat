import './Schedule.scss'
import { Badge, Calendar, Tooltip } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import { makeRequest } from "../../axios";
import { AuthContext } from '../../context/authContext'
import { scheduleTime } from '../../utils/chinaDateToDatetime'

const Schedule = () => {
    const { currentUser } = useContext(AuthContext);
    const [friendData, setFriendData] = useState([]);
    useEffect(() => {
        const effectFunc = async () => {
            makeRequest.get(`/chat/${currentUser.id}`).then((res) => {
                setFriendData(res.data);
            }).catch((e) => {
                console.log('获取好友失败！', e);
            });
        }
        effectFunc();
    }, [currentUser?.id]);
    const getListData = (value) => {
        const renderDate = scheduleTime(value);
        const friendsBrithday = friendData.map(item => {
            const list = item?.brithday?.split('-');
            return {
                month: Number(list[1]),
                day: Number(list[2]),
                name: item?.name
            }
        })
        return friendsBrithday.map(friendBrithday => {
            if (friendBrithday.month === renderDate.month && friendBrithday.day === renderDate.day) {
                return {
                    type: 'success',
                    content: `${friendBrithday?.name} 的生日`
                }
            } else {
                return undefined;
            }
        })
    };
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item?.content} >
                        <Tooltip title={item?.content}>
                            <Badge status={item?.type} text={item?.content} />
                        </Tooltip>
                    </li>
                ))}
            </ul>
        );
    };
    return (
        <Calendar dateCellRender={dateCellRender} />
    );
};
export default Schedule;
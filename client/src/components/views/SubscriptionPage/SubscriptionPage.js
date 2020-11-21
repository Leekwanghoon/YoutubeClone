import React, { useEffect, useState } from 'react';
import { Typography, Card, Col, Row, Avatar } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography
const { Meta } = Card;
function SubscriptionPage() {

    const [Videos, setVideos] = useState([]);

    useEffect(() => {

        //조건을 가지고 db에서 가져와야함
        const subscriptionVariables = {
            userFrom: localStorage.getItem('userId')
        }

        axios.post('/api/video/getSubscriptionVideos',subscriptionVariables)
            .then(response => {
                if (response.data.success) {
                    console.log("videos", response.data)
                    setVideos(response.data.videos)
                } else {
                    alert("비디오 가져오기 실패!")
                }
            })
    }, [])

    const renderCards = Videos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return (
            <Col lg={6} md={8} xs={24} key={index}>
                <div><a href={`/video/post/${video._id}`}>
                <div style={{ position: 'relative' }}>
                <a href={`/video/${video._id}`}>
                <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                <div className="duration">
                <span>{minutes}:{seconds}</span>
                </div>
                </a>
                </div>
                </a></div>
                <br />
                <Meta
                    avatar={
                            <Avatar src={video.writer.image} />
                    }
                    title={video.title}
                    description=""
                />
                <span>{video.writer.name}</span>
                <span style={{marginLeft:'3rem'}}>{video.views} views</span> - <span>{moment(video.createAt).format("MMM Do YY")}</span>
            </Col>
        )
    })


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>Subscription</Title>
            <hr />
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default SubscriptionPage

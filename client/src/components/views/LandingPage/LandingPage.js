import React, { useEffect, useState } from 'react';
import { Typography, Card, Col, Row, Avatar } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography
const { Meta } = Card;
function LandingPage() {

    const [Videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get('/api/video/getVideos')
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
                <a href={`/video/post/${video._id}`}>
                    <div style={{ position: 'relative' }}>
                        <a href={`/video/${video._id}`}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumnail" />
                        <div className="duration">
                            <span>{minutes}:{seconds}</span>
                        </div>
                        </a>
                    </div>
                </a>
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
            <Title level={2}>Recommended</Title>
            <hr />
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage

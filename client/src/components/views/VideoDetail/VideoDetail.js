import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar,  } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo/SideVideo';
import Subscribe from './Sections/SideVideo/Subscribe';
import Comment from './Sections/Comment';
function VideoDetail(props) {

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComment] = useState([])
    const videoId = props.match.params.videoId;
    
    useEffect(() => {

        const variable = { videoId: videoId }

        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data, "videodetail");
                    setVideoDetail(response.data.video);
                    
                } else {
                    alert("비디오 받아오는거 실패")
                }
            })
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success) {
                    setComment(response.data.comment)
                } else {
                    alert("코멘트정보를 가져오는데 실패!")
                }
            })

    }, [videoId])

    

    if (VideoDetail.writer) {
        console.log(Comments,"commentListsInVideoDetail")
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') &&
        <Subscribe userTo={VideoDetail.writer._id}
                                userFrom={localStorage.getItem("userId")} />
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        <List.Item
                            actions={[subscribeButton]}
                        >
                                <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item >
                        {/* Comments */}
                        <Comment />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                   <SideVideo />
            </Col>
            </Row>
        )
    } else {
        return (
            <div style={{ justifyContent:'center', display:'flex', fontSize:'30px'}}>Loading...</div>
        )
    }
}

export default VideoDetail

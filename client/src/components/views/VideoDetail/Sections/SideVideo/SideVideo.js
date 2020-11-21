import React, { useEffect, useState } from 'react'
import axios from 'axios'
function SideVideo() {

    const [sideVideos, setSideVideos] = useState([]);

    useEffect(() => {
        axios.get("/api/video/getVideos")
            .then(response => {
                if (response.data.success) {
                    console.log(response.data, "sideVideo")
                    setSideVideos(response.data.videos)
                } else {
                    alert("sideVideo가져오기 실패")
                }
            })
    }, [])

    const renderSideVideos = sideVideos.map(((sideVideo, index) => {

        var minutes = Math.floor(sideVideo.duration / 60);
        var seconds = Math.floor((sideVideo.duration - minutes * 60));

        return (
            <div key={index} style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}>
                <div style={{ width: '40%', marginRight: '1rem' }}>
                    <a href={`/video/${sideVideo._id}`} style={{color:'gray'}}>
                        <img style={{ width: '100%', height:'100%' }} src={`http://localhost:5000/${sideVideo.thumbnail}`} alt="thumbnail" />
                    </a>
                </div>

                <div style={{ width: '50%' }}>
                    <a href={`/video/${sideVideo._id}`} style={{ color: 'gray' }}>
                        <span style={{ fontSize: '1rem', color: 'black' }}>{sideVideo.title}</span><br />
                        <span>{sideVideo.writer.name}</span><br />
                        <span>{sideVideo.views}</span><br />
                        <span>{minutes}:{seconds}</span><br />
                    </a>
                </div>
            </div>
        );
    }))

    return (
        <React.Fragment>
            <div style={{marginTop:'3rem'}} />
            {renderSideVideos}
        </React.Fragment>
    )
}

export default SideVideo

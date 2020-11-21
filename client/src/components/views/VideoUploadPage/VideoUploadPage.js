import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';
const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {
        value: 0,
        label: "Private"
    },
    {
        value: 1,
        label: "Public"
    }
]

const CategoryOptions = [
    {
        value: 0,
        label: "Film & Animation"
    },
    {
        value: 1,
        label: "Autos & Vehicles"
    },
    {
        value: 2,
        label: "Music"
    },
    {
        value: 3,
        label: "Pets & Animals"
    }
]

function VideoUploadPage(props) {

    const user = useSelector(state => state.user);

    const [VideoTitle, setVideoTitle] = useState("")
    const [VideoDescription, setVideoDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Thumbnail, setThumbnail] = useState("");
    const [Duration, setDuration] = useState("");

    const VideoTitleChangeHandler = (e) => {
        setVideoTitle(e.target.value);
    }

    const VideoDescriptionChangeHandler = (e) => {
        setVideoDescription(e.target.value);
    }

    const PrivateChangeHandler = (e) => {
        setPrivate(e.target.value);
    }

    const CategoryChangeHandler = (e) => {
        setCategory(e.target.value);
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {
                'content-type': 'multipart/form-data'
            }
        }
        console.log(files[0], "front")
        formData.append("file", files[0])    //req.file에 태워서 보내다~
        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    setFilePath(response.data.filePath)
                    let variable = {
                        url: response.data.filePath,
                        fileName: response.data.fileName
                    }

                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setThumbnail(response.data.url)
                                setDuration(response.data.fileDuration)
                            } else {
                                alert("썸네일 생성에 실패 했습니다.")
                            }
                        })
                } else {
                    console.log("데이터가져오기 실패")
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: VideoDescription,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: Thumbnail
        }

        axios.post('/api/video/uploadVideo', variables)
                    .then(response => {
                if (response.data.success) {
                    message.success('성공적으로 업로드를 했습니다.')
                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000);

                } else {
                    alert("업로드에 실패!")
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone */}

                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={10000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}

                    </Dropzone>
                    {/* thumbnail */}
                    {Thumbnail &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="thumbnail" />
                        </div>
                    }

                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    value={VideoTitle}
                    onChange={VideoTitleChangeHandler}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    value={VideoDescription}
                    onChange={VideoDescriptionChangeHandler}
                />
                <br />
                <br />

                <select
                    value={Private}
                    onChange={PrivateChangeHandler}
                >
                    {PrivateOptions.map(item => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <select
                    value={Category}
                    onChange={CategoryChangeHandler}
                >
                    {CategoryOptions.map(item => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <Button onClick={onSubmit} type="primary" size="large" >Submit</Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage

import React,{useState} from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import {MenuUnfoldOutlined,
    MenuFoldOutlined} from '@ant-design/icons';
import Dropzone from 'react-dropzone'
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;


function VideoUploadPage (){

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Anime")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [Thumbnail, setThumbnail] = useState("")

    const PrivateOptions = [
        {value: 0, label: "Private"},
        {value: 1, label: "Public"}
    ]
    const CategoryOptions = [
        {value: 0, label: "Film & Anime"},
        {value: 1, label: "TV Series"},
        {value: 2, label: "Music & Opera"},
        {value: 3, label: "Game"}
    ]
    const onTitleChange= (e) => {
        console.log(e)
        setVideoTitle(e.currentTarget.value)
    }
    const onDescriptionChange = (e)=>{
        setDescription(e.currentTarget.value)
    }
    
    const onPrivateChange = (e)=>{
        setPrivate(e.currentTarget.value)
    }
    
    const onCategoryChange = (e)=>{
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
        console.log(files)

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    setFilePath(response.data.url)

                    //gerenate thumbnail with this filepath ! 

                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration)
                                setThumbnail(response.data.url)
                            } else {
                                alert('Failed to make the thumbnails');
                            }
                        })


                } else {
                    alert('failed to save the video in server')
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>

                    {Thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title </label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={(onDescriptionChange)}
                    value={Description}
                />  
                <br />
                <br />
                <select onChange={onPrivateChange}>
                            {PrivateOptions.map((item, index)=>(
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                {CategoryOptions.map((item, index)=>(
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
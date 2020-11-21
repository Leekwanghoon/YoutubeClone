import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import {Button, Input} from 'antd';
import axios from 'axios';

const {TextArea} = Input;

function Comment(props) {
    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }
    }

    return (
        <div>
            <br />
            <p> replies </p>
            <hr />

            {/* Root Comment Form */}
            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <TextArea 
                    style={{width:'100%', borderRadius:'5px'}}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="write some Comments"
                />
                <br />
                <Button onClick={onSubmit} style={{width: '20%', height:'52px'}}>Submit</Button>
            </form>
        </div>
    )
}

export default Comment

import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);
    useEffect(() => {
        let body = {
            userTo: props.userTo
        }
        axios.post('/api/subscribe/subscribeNumber', body)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert("구독자수 가져오기 실패!")
                }
            })

        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert("등록된거 구독자")
                }
            })
    }, [props.userFrom,props.userTo])

    const onSubscribe = () => {
        //이미구독중

        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        if (Subscribed) {
            axios.post('/api/subscribe/unsubscribe', subscribedVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert("구독 취소하는데 실패")
                    }
                })
        } else {
            //구독아님
            axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert("구독 하는데 실패")
                    }
                })
        }
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
            </button>
        </div>
    )
}

export default Subscribe

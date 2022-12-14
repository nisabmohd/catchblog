import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../App'
import { url } from '../baseurl'
import { PostCard } from '../components/PostCard'
import { UserCard } from '../components/UserCard'
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, } from '@mui/material'
import { PostCradSkeleton } from '../components/PostCradSkeleton'

const loadingarr = [1, 2, 3, 4]

export const User = () => {
    const context = useContext(AppContext)
    const params = useParams()
    const [user, setUser] = useState()
    const [post, setPosts] = useState([])
    const [page, setPage] = useState(0)
    const [more, setMore] = useState(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetch() {
            const resp = await axios.get(`${url}/user/${params.uid}`)
            setUser(resp.data)
        }
        params.uid && fetch();
    }, [params])

    useEffect(() => {
        if (!user) return
        async function fetch() {
            const resp = await axios.get(`${url}/post/userpost/${params.uid}?page=0&limit=5`)
            // console.log(resp.data);
            setPosts(resp.data.data)
            if (resp.data.next) {
                setPage(resp.data.next.pageNumber)
                setMore(true)

            }
            setLoading(false)
        }
        fetch();
    }, [params.uid, user])

    async function fetchMoreData() {
        const resp = await axios.get(`${url}/post/userpost/${params.uid}?page=${page}&limit=5`)
        if (!resp.data.next) {
            setMore(false)
        }
        else {
            setPage(resp.data.next.pageNumber)
        }
        setPosts(prev => {
            return [...prev, ...resp.data.data]
        })
    }
    return (
        <div className='container homecontainer' style={{ marginTop: '28px' }}>
            <div className="container-left">
                <div className="user" style={{ width: '100%', backgroundColor: context.dark ? '#282828' : '#ffff', borderRadius: '11px', padding: '10px 20px' }}>
                    <UserCard uid={user?.uid} />
                </div>
                <h3 style={{ marginTop: '3vh', marginBottom: '-5px', marginLeft: '1vw' }}>Posts</h3>
                {
                    loading && loadingarr.map(item => <PostCradSkeleton key={item} />)

                }
                {
                    loading === false && post.length === 0 ? <Box style={{ width: '100%', height: '10vh', display: 'flex', alignContent: 'center', marginTop: '10px' }}><h4 style={{ margin: 'auto' }} >Nothing to see here</h4></Box> : <></>
                }
                <InfiniteScroll
                    dataLength={post.length}
                    next={fetchMoreData}
                    hasMore={more}
                    loader={<></>}
                >
                    {
                        post && post.map(item => {
                            return <PostCard summary={item.summary} key={item.postid} id={item.postid} uid={item.uid} date={item.timestamp} content={item.title} tags={item.tags} />
                        })
                    }
                </InfiniteScroll>
            </div>
        </div>
    )
}

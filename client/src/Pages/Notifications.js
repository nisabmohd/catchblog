import { Box } from '@mui/system'
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { AppContext } from '../App'
import { url } from '../baseurl'
import { Notify } from '../components/Notify'
import { NotifySkeleton } from '../components/NotifySkeleton'

const loadingarr = [1, 2, 3, 4,5,6,7,8,9]
export const Notifications = () => {
  const context = useContext(AppContext)
  const [not, setNot] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const resp = await axios.get(`${url}/user/notifications/${context.auth.uid}`)
      const resp1 = await axios.put(`${url}/user/readnotification/${context.auth.uid}`)
      setLoading(false)
      if (resp1.data.message) context.setHaveNotification(false)
      setNot(resp.data)
    }
    fetch();
  }, [context])


  return (
    <div className='container' style={{marginTop:'22px'}}>
      <div className="container-left">
        <h3 style={{ marginBottom: '33px' }}>Notifications</h3>
        {
          loading &&
          loadingarr.map(item=><NotifySkeleton />)
        }
        {
          loading === false && not.length === 0 ? <Box style={{ width: '100%', height: '10vh', display: 'flex', alignContent: 'center', marginTop: '10px' }}><h4 style={{ margin: 'auto' }} >Nothing to see here</h4></Box> : <></>
        }
        {
          not.map(item => {
            return <Notify key={item.id} type={item.type} postid={item.postid} date={item.date} uid={item.uid} />
          })
        }
      </div>
    </div>
  )
}

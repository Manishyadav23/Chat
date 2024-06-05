import React, { useEffect, useState } from 'react';
import './Side.css';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set } from 'firebase/database'; 

function Side() {
  const [userdet, setUserDet] = useState({
    name: '',
    imgurl: '',
  });

  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [channelDetail, setChannelDetail] = useState('');
  const [model, setModel] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const db = getDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserDet({
          name: user.displayName || '',
          imgurl: user.photoURL || '',
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const channelsRef = ref(db, 'channels');

    const unsubscribe = onValue(channelsRef, (snapshot) => {
      const channelsData = [];
      snapshot.forEach((childSnapshot) => {
        channelsData.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      setChannels(channelsData);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    const usersRef = ref(db, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData && userData.username) {
          usersData.push({
            id: childSnapshot.key,
            ...userData
          });
        }
      });
      setUsers(usersData);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    signOut(getAuth())
      .then(() => {
        console.log('User signed out successfully');
        navigate('/Login');
      })
      .catch((error) => {
        console.error('Error signing out:', error.message);
      });
  };

  const handleChannelSelection = (channelId) => {
    setSelectedChannel(channelId);
    navigate(`/chat/${channelId}`);
  };

  const handleUserSelection = (userId) => {
    setSelectedUser(userId);
    navigate(`/chat/direct/${userId}`);
  };

  const handleModel = () => {
    const channelsRef = ref(db, 'channels');
    const newChannelRef = push(channelsRef);
    set(newChannelRef, {
      channel_name: channelName,
      channel_detail: channelDetail,
      created_by: {
        name: userdet.name,
        image: userdet.imgurl
      }
    })
    .then(() => {
      console.log("Channel added successfully");
      setChannelName('');
      setChannelDetail('');
      setModel(false);
    })
    .catch(error => {
      console.error("Error adding channel: ", error);
    });
  };

  const openModel = () => {
    setModel(!model);
  };

  return (
    <>
      <div className="sid">
        <h1>Slack 2OO</h1>
        <div className="drop">
          <div>
            <img className='userig' src={userdet.imgurl} alt="" />
          </div>
          <select onChange={(e) => e.target.value === 'signout' && handleSignOut()}>
            <option value="user">{userdet.name}</option>
            <option value="avtar">avtar</option>
            <option value="signout"><Link to='/Login'>Sign out</Link></option>
          </select>
        </div>
        <div className="oother">
          <h4>Create channel <button onClick={openModel}>+</button></h4>
          <div className="sc">
            {channels.map(channel => (
              <p key={channel.id} onClick={() => handleChannelSelection(channel.id)} className={selectedChannel === channel.id ? 'selected' : ''}>#{channel.channel_name}</p>
            ))}
          </div>
        </div>

        <div className='dmsg'>
          <h4>Direct Message ❤️</h4>
          <div className="sc">
            {users.map(user => (
              <p key={user.id} onClick={() => handleUserSelection(user.id)} className={selectedUser === user.id ? 'selected' : ''}>{user.username}</p>
            ))}
          </div>
        </div>
      </div>

      {model && (
        <>
          <div className="overlay"></div>
          <div className="mod">
            <div className="up">
              <h1>Add a channel</h1>
            </div>
            <div className="bot">
              <span>Name of Channel : <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} /></span>
              <span>About the Channel:<input type="text" value={channelDetail} onChange={(e) => setChannelDetail(e.target.value)} /></span>
            </div>
            <div className="mbtn">
              <button className='notdanger' onClick={handleModel}>Add</button>
              <button className='danger' onClick={openModel}>Close</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Side;

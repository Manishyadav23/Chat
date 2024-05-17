import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, push, onValue, serverTimestamp } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './Message.css';

function Message() {
  const { channelId, userId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [txt, settxt] = useState('');
  const [msgtxt, setmsgtxt] = useState([]);
  const [filteredMsgTxt, setFilteredMsgTxt] = useState([]);
  const [chdetail, setchdetail] = useState({
    chaname: '',
    chndetail: '',
    createdby: {
      name: '',
    }
  });
  const [userdetail, setuserdetail] = useState({
    username: "",
    id: "",
    userprofile: ""
  });
  const [selectedChannelName, setSelectedChannelName] = useState('');
  const [omodel, setomodel] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setuserdetail({
          username: user.displayName,
          id: user.uid,
          userprofile: user.photoURL
        });
      } else {
        setuserdetail({
          username: "",
          id: "",
          userprofile: ""
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();

    const channelsRef = ref(db, 'channels');
    const unsubscribe = onValue(channelsRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const channel = childSnapshot.val();
        if (childSnapshot.key === channelId) {
          setSelectedChannelName(channel.channel_name);
          setchdetail({
            chaname: channel.channel_name,
            chndetail: channel.channel_detail,
            createdby: {
              name: channel.created_by.name,
            }
          });
        }
      });
    });

    return () => unsubscribe();
  }, [channelId]);

  useEffect(() => {
    const db = getDatabase();

    const messagesRef = ref(db, userId ? `messages/${userId}` : `messages/${channelId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      if (messages) {
        const messageArray = Object.entries(messages).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setmsgtxt(messageArray);
        
        const filteredMessages = messageArray.filter(message =>
          (message.recipientId === userId && message.senderId === userdetail.id) || 
          !userId 
        );
        setFilteredMsgTxt(filteredMessages);

        // Update recipient's UI when a new message is received
        // For example, you could trigger a state update to refresh the UI
        // You might also scroll the message list to show the latest message
      } else {
        setmsgtxt([]);
        setFilteredMsgTxt([]);
      }
    });

    return () => unsubscribe();
  }, [channelId, userId, userdetail.id]);

  function savetxt() {
    const db = getDatabase();
    if (selectedFile) {
      const storage = getStorage();
      const fileRef = storageRef(storage, `files/${userId}/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(fileRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error('Error uploading file:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              const messageData = {
                photoURL: downloadURL,
                senderId: userdetail.id,
                senderName: userdetail.username,
                senderprofile: userdetail.userprofile,
                timestamp: serverTimestamp(),
              };
              if (userId) {
                messageData.recipientId = userId;
                push(ref(db, `messages/${userId}`), messageData);
                sendMessageToRecipient(messageData);
              } else {
                push(ref(db, `messages/${channelId}`), messageData);
              }
              setSelectedFile(null);
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
            });
        }
      );
    } else if (txt.trim() !== '') {
      const messageData = {
        text: txt,
        senderId: userdetail.id,
        senderName: userdetail.username,
        senderprofile: userdetail.userprofile,
        timestamp: serverTimestamp(),
      };
      if (userId) {
        messageData.recipientId = userId;
        push(ref(db, `messages/${userId}`), messageData);
        sendMessageToRecipient(messageData);
      } else {
        push(ref(db, `messages/${channelId}`), messageData);
      }
      settxt('');
    }
  }
  
  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMessages = msgtxt.filter(message =>
      message && message.text && message.text.toLowerCase().includes(searchTerm)
    );
    setFilteredMsgTxt(filteredMessages);
  }

  const openModel = () => {
    setomodel(true);
  };

  function sendPhotoes() {
    openModel();
    savetxt();
  }

  // Function to send message to recipient
  function sendMessageToRecipient(messageData) {
    // Implement sending message to recipient here
    // For example, you can send a notification or update the recipient's message list
    console.log("Message sent to recipient:", messageData);
  }

  return (
    <div className="mg">
      <div className="mess">
        <div className="sub">
          <div className="msghead">
            <div className="name">
              <h4>{userId ? `Direct Messages with ${userdetail.username}` : `Channel: ${selectedChannelName}`}</h4>
            </div>
            <div className="msgsearch">
              <input type="text" placeholder="Search messages" onChange={handleSearch} />
            </div>
          </div>

          <div className="txt">
            <ul>
              {filteredMsgTxt.map((message, index) => (
                <li key={index}>
                  <div className="message-info">
                    <img className='msgimg' src={message.senderprofile} alt="" />
                    <strong>{message.senderName}</strong>
                    <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
                  </div>
                  {message.text && <div className="message-text">{message.text}</div>}
                  {message.photoURL && <img src={message.photoURL} alt="Uploaded" className='uploadimg' />}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bcont">
          <div className="in">
            <input
              type="text"
              placeholder="Write your message"
              value={selectedFile ? selectedFile.name : txt}
              onChange={(e) => settxt(e.target.value)}
            />
          </div>
          <div className="btnn">
            <button className='adr' onClick={savetxt}>Add reply</button>
            <button className='sendbtn' onClick={openModel}>Send Photos</button>
          </div>
        </div>
      </div>
      <div className="ri">
        <div className="chn">
          <h4>{userId ? 'Direct Messages' : `About # ${selectedChannelName}`}</h4>
          <p>{userId ? 'Direct Messages are private conversations between you and another user.' : 'Channel Details'}</p>
          <p>{userId ? 'Only you and the recipient can see direct messages.' : chdetail.chndetail}</p>
        </div>
        <div className="top">
          <img src={userdetail.userprofile} alt="" /><span>{userId ? 'Direct Messages' : 'Top Posters'}</span>
        </div>
        {!userId && (
          <div className="cb">
            <p>Created by {chdetail?.createdby.name}</p>
          </div>
        )}
      </div>

      {omodel && (
        <>
          <div className="pplay"></div>
          <div className="inph">
            <div className="phosend">
              <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>
            <div className="phbttn">
              <button onClick={sendPhotoes}>Send</button>
              <button className='cncl' onClick={() => setomodel(false)}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Message;

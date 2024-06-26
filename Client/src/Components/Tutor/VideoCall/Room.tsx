import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function Room() {
  const { roomId } = useParams<{ roomId: string }>(); 
  const meetingContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId && meetingContainer.current) {
      const myMeeting = async (element: HTMLDivElement) => {
        const appID = 1824595563;
        const serverSecret = "2ca07310338cb3297452a4a8d7ca7df3";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID, 
          serverSecret, 
          roomId, 
          Date.now().toString(), 
          "Sruthy Sheen"
        );

        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Copy Link',
              url: `https://learnworld.online/room/${roomId}`
            }
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
        });
      };

      myMeeting(meetingContainer.current);
    }
  }, [roomId]);

  return <div ref={meetingContainer} />;
}

export default Room;

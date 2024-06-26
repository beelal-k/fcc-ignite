import { useState, useRef, useEffect } from "react";
import SimplePeer from "simple-peer";
import useSocketStore from "@/store/socketStore";
import { Button } from "@/components/ui/button";

const VideoCall = () => {
  const { socket } = useSocketStore();
  const [me, setMe] = useState(socket?.id);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<SimplePeer.Instance | null>(null);

  useEffect(() => {
    setMe(socket?.id);
  }, [socket]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket?.on("callUser", (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id: any) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: caller,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
  };

  return (
   <div className="flex flex-col items-center justify-center p-5 space-y-4">
  <div className="flex flex-row space-x-4 mt-20">
    {stream && (
      <video
        className="w-[530px] h-[400px] rounded-lg shadow-lg"
        playsInline
        muted
        ref={myVideo}
        autoPlay
      />
    )}
    {callAccepted && !callEnded && (
      <video
      className="w-[530px] h-[400px] rounded-lg shadow-lg"
        playsInline
        ref={userVideo}
        autoPlay
      />
    )}
  </div>
  <div className="text-lg font-semibold">My meeting id: {me}</div>
  <div className="flex flex-col space-y-2 w-full max-w-[500px]">
    <input
      className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
      type="text"
      value={idToCall}
      onChange={(e) => setIdToCall(e.target.value)}
      placeholder="ID to call"
    />
    <input
      className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Your name"
    />
    <Button
     
      onClick={() => callUser(idToCall)}
    >
      Call
    </Button>
  </div>
  {receivingCall && !callAccepted ? (
    <div className="flex flex-col items-center justify-center space-y-2">
      <h1 className="text-lg font-semibold">{name} is calling...</h1>
      <button
        className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
        onClick={answerCall}
      >
        Answer
      </button>
    </div>
  ) : null}
  {callAccepted && !callEnded ? (
    <button
      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
      onClick={leaveCall}
    >
      Hang up
    </button>
  ) : null}
</div>

  );
};

export default VideoCall;

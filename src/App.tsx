import "./App.css";
import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import { ConnectionData, RoomData, baseUrl, useData } from "./useData";

const App: React.FC = () => {
  const [roomInFocusId, setRoomInFocusId] = useState<string | undefined>(
    undefined
  );
  const [connectionInFocus, setConnectionInFocus] = useState<
    ConnectionData | undefined
  >(undefined);
  const [diographInFocus, setDiographInFocus] = useState<
    object | null | undefined
  >(null);

  const { rooms, loading, error, fetchRoomsData, fetchRoomData } = useData();

  const handleRoomClick = (roomId: string) => {
    const room = rooms[roomId];
    if (!room) {
      fetchRoomData(roomId);
    }
    if (room) {
      setRoomInFocusId(roomId);
      setConnectionInFocus(undefined);
      setDiographInFocus(room.diograph);
    }
  };

  // const handleConnectionClick = (connectionData: ConnectionData) => {
  //   if (connectionData.address === connectionInFocus?.address) {
  //     handleRoomClick(roomInFocusId || "never-gonna-happe");
  //     return;
  //   }
  //   setConnectionInFocus(connectionData);
  //   setDiographInFocus(connectionData.diograph);
  // };

  useEffect(() => {
    fetchRoomsData();
  }, []);

  useEffect(() => {
    const roomKeys = Object.keys(rooms);
    if (roomKeys.length > 0) {
      console.log(roomKeys[0]);
      handleRoomClick(roomKeys[0]);
    }
  }, [rooms]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        Rooms
        <div>
          {rooms &&
            Object.keys(rooms).map((roomId) => (
              <button
                onClick={() => handleRoomClick(roomId)}
                key={roomId}
                className={roomInFocusId === roomId ? "in-focus" : ""}
              >
                {roomId}
              </button>
            ))}
        </div>
      </div>

      {/* <div>
        Connections
        <div>
          {rooms[roomInFocusId || "never-gonna-happen"]?.connections.map(
            (connectionData) => (
              <button
                key={connectionData.address}
                onClick={() => handleConnectionClick(connectionData)}
                className={
                  (connectionInFocus && connectionInFocus.address) ==
                  connectionData.address
                    ? "in-focus"
                    : ""
                }
              >
                {connectionData.address}
              </button>
            )
          )}
        </div>
      </div> */}

      <div>
        <Grid
          diograph={diographInFocus}
          baseUrl={`${baseUrl}/${roomInFocusId}`}
        />
      </div>
    </div>
  );
};

export default App;

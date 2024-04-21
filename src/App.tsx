import "./App.css";
import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import { baseUrl, useData } from "./useData";
import { ConnectionData, IDiographObject } from "@diograph/diograph/types";

const App: React.FC = () => {
  const [roomInFocusId, setRoomInFocusId] = useState<string | undefined>(
    undefined
  );
  const [connectionInFocus, setConnectionInFocus] = useState<
    ConnectionData | undefined
  >(undefined);
  const [diographInFocus, setDiographInFocus] = useState<
    IDiographObject | null | undefined
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

  const handleConnectionClick = (connectionData: ConnectionData) => {
    if (connectionData.address === connectionInFocus?.address) {
      handleRoomClick(roomInFocusId || "never-gonna-happe");
      return;
    }
    setConnectionInFocus(connectionData);
    setDiographInFocus(connectionData.diograph);
  };

  useEffect(() => {
    fetchRoomsData();
  }, []);

  // This is a silly way to set initial roomInFocus (after fetching rooms data...)
  useEffect(() => {
    const roomKeys = Object.keys(rooms);
    if (roomKeys.length > 0 && !roomInFocusId) {
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

      {roomInFocusId && (
        <div>
          Connections
          <div>
            {(rooms[roomInFocusId]?.connections || []).map((connectionData) => (
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
            ))}
          </div>
        </div>
      )}

      {roomInFocusId && (
        <div>
          <Grid
            diograph={diographInFocus}
            baseUrl={`${baseUrl}/${roomInFocusId}`}
          />
        </div>
      )}
    </div>
  );
};

export default App;

import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const getData = async () => {
  const response = await axios.get<Data>("http://localhost:3000/rooms/room-1");
  const diographResponse = await axios.get<Data>(
    "http://localhost:3000/rooms/room-1/diograph"
  );

  response.data.rooms[0].diograph = diographResponse.data;

  return response;
};

interface ConnectionData {
  address: string;
  contentUrls: object;
  contentClientType: string;
  diograph?: object;
}

interface RoomData {
  id: string;
  connections: ConnectionData[];
  diograph?: object;
}

interface Data {
  rooms: RoomData[];
}

const App: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomInFocus, setRoomInFocus] = useState<RoomData | null>(null);
  const [connectionInFocus, setConnectionInFocus] =
    useState<ConnectionData | null>(null);
  const [diographInFocus, setDiographInFocus] = useState<
    object | null | undefined
  >(null);

  const handleRoomClick = (roomData: RoomData) => {
    setRoomInFocus(roomData);
    setConnectionInFocus(null);
    setDiographInFocus(roomData.diograph);
  };

  const handleConnectionClick = (connectionData: ConnectionData) => {
    if (connectionData.address === connectionInFocus?.address) {
      setConnectionInFocus(null);
      setDiographInFocus(roomInFocus && roomInFocus.diograph);
      return;
    }
    setConnectionInFocus(connectionData);
    setDiographInFocus(connectionData.diograph);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getData();
        setData(response.data);
      } catch (error) {
        setError("Error fetching data: " + error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData2 = async () => {
      setLoading(true);
      try {
        const response = await getData();
        setRoomInFocus(response.data.rooms[0]);
        setDiographInFocus(response.data.rooms[0].diograph);
      } catch (error) {
        setError("Error fetching data2: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then(() => {
      fetchData2();
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        Rooms
        <div>
          {data &&
            data.rooms.map((roomData) => (
              <button
                onClick={() => handleRoomClick(roomData)}
                key={roomData.id}
                className={
                  (roomInFocus && roomInFocus.id) == roomData.id
                    ? "in-focus"
                    : ""
                }
              >
                {roomData.id}
              </button>
            ))}
        </div>
      </div>
      <div>
        Connections
        <div>
          {roomInFocus &&
            roomInFocus.connections &&
            roomInFocus.connections.map((connectionData) => (
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
      <div>
        Grid
        <div>
          {diographInFocus &&
            Object.values(diographInFocus).map((diory) => (
              <div key={diory.id} className="diory">
                {diory &&
                  diory.data &&
                  diory.data[0].contentId &&
                  diory.data[0].encodingFormat && (
                    <div>
                      <a
                        href={`http://localhost:3000/room-1/content?cid=${diory.data[0].contentId}&mime=${diory.data[0].encodingFormat}`}
                      >
                        CONTENT
                      </a>
                    </div>
                  )}
                {diory.image && (
                  <a
                    href={`http://localhost:3000/room-1/thumbnail?dioryId=${diory.id}`}
                  >
                    <img height="100" src={diory.image} alt={diory.id} />
                  </a>
                )}
                <div>{diory.text || diory.id}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;

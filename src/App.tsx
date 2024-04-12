import "./App.css";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import data from "./data.json";
import dataDiograph from "./data-diograph.json";

const getData = () => {
  data.rooms[0].diograph = dataDiograph;
  return data;
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
      try {
        // const response = await axios.get<Data>("https://api.example.com/data");
        const response = { data: getData() };
        setData(response.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const data = getData();
    setRoomInFocus(data && data.rooms[0]);
    setDiographInFocus(data && data.rooms[0].diograph);
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
                {diory.image && (
                  <img height="100" src={diory.image} alt={diory.id} />
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

import axios from "axios";
import { useState } from "react";

interface RoomIndexData {
  id: string;
  address: string;
  clientType: string;
}
const baseUrl = "http://localhost:3000";

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

interface RoomsData {
  [index: string]: RoomData | null;
}

const useData = () => {
  const [rooms, setRooms] = useState<RoomsData>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<RoomIndexData[]>(`${baseUrl}/rooms`);
      const roomsIndexData: RoomsData = {};
      response.data.forEach((roomIndexData) => {
        roomsIndexData[roomIndexData.id] = null;
      });
      setRooms(roomsIndexData);
    } catch (error) {
      setError("Error fetching data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomData = async (roomId: string) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axios.get<any>(`${baseUrl}/rooms/${roomId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const diographResponse = await axios.get<any>(
        `${baseUrl}/rooms/${roomId}/diograph`
      );

      response.data.diograph = diographResponse.data;

      rooms[roomId] = response.data;
      setRooms(rooms);
    } catch (error) {
      setError("Error fetching more data: " + error);
    } finally {
      setLoading(false);
    }
  };

  return { rooms, loading, error, fetchRoomsData, fetchRoomData };
};

export { useData, baseUrl };

export type { RoomData, ConnectionData };

import React from "react";

interface Diory {
  id: string;
  image?: string;
  text?: string;
  data?: {
    contentUrl: string;
    encodingFormat: string;
  }[];
}

interface GridProps {
  diograph: { [key: string]: Diory };
  baseUrl: string;
}

const Grid: React.FC<GridProps> = ({ diograph, baseUrl }) => (
  <div>
    {diograph &&
      Object.values(diograph).map((diory) => (
        <div key={diory.id} className="diory">
          {diory &&
            diory.data &&
            diory.data[0].contentUrl &&
            diory.data[0].encodingFormat && (
              <div>
                <a
                  href={`${baseUrl}/content?cid=${diory.data[0].contentUrl}&mime=${diory.data[0].encodingFormat}`}
                >
                  CONTENT
                </a>
              </div>
            )}
          {diory.image && (
            <a href={`${baseUrl}/thumbnail?dioryId=${diory.id}`}>
              <img height="100" src={diory.image} alt={diory.id} />
            </a>
          )}
          <div>{diory.text || diory.id}</div>
        </div>
      ))}
  </div>
);

export default Grid;

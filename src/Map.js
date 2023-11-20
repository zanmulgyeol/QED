import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, Marker, TileLayer, Popup, CircleMarker } from "react-leaflet";
import geometricMedian from "./GeoMedian"
import axios from "axios"


function GeoMedianMarker({ geoMedianPos, mode, setMode }){
  const gotoFacility = (event) => {
    event.preventDefault();
    if (mode === "setMap") setMode("viewFacility");
    else setMode("setMap")
  }

  return( geoMedianPos === null?null:
    <CircleMarker center={geoMedianPos} radius={20}>
      <Popup>
        <div>기하 중앙값</div>
        <div>위도: {(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}</div>
        <div>경도: {(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}</div>
        <div><a href="#"
        onClick={gotoFacility}
        >{mode === "setMap"?"주변 문화시설 확인하기":"기하 중앙값 다시 구하러 가기"}</a></div>
      </Popup>
    </CircleMarker>
  )
}

function DraggableMarker({ position, setPosition, index, marker }){
  const markerRef = useRef(null);
  const eventHandlers = useMemo(() => ({
    dragend() {
      const currentMarker = markerRef.current;
      if (currentMarker != null) {
        const newPosition = [...position];
        const foundIndex = newPosition.findIndex(item => item.id === marker.id);
        newPosition[foundIndex].pos = [currentMarker.getLatLng().lat, currentMarker.getLatLng().lng];
        // console.log(currentMarker.getLatLng());
        setPosition(newPosition);
      }
    },
  }), [position, marker, setPosition]);

  return(
    <Marker key={index} position={marker.pos} draggable={true} eventHandlers={eventHandlers} ref={markerRef}>
      <Popup>
        <div>{marker.id}번 마커</div>
        <div>위도: {(Math.round(marker.pos[0] * 1000000) / 1000000).toFixed(6)}</div>
        <div>경도: {(Math.round(marker.pos[1] * 1000000) / 1000000).toFixed(6)}</div>
      </Popup>
    </Marker>
  )
}

function Map() {
  const [currentPos, setCurrentPos] = useState(null);
  const [position, setPosition] = useState([]);
  const [geoMedianPos, setGeoMedianPos] = useState(null);
  const [mode, setMode] = useState("setMap");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataNum, setDataNum] = useState(0);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPos([latitude, longitude]);
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response12 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=3000&contentTypeId=12`);
        const data12 = await response12.data.response.body.items.item;
        const response14 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=3000&contentTypeId=14`);
        const data14 = await response14.data.response.body.items.item;
        const response32 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=3000&contentTypeId=32`);
        const data32 = await response32.data.response.body.items.item;
        const response38 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=3000&contentTypeId=38`);
        const data38 = await response38.data.response.body.items.item;
        const response39 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=3000&contentTypeId=39`);
        const data39 = await response39.data.response.body.items.item;
        const data = [];
        if(data12 !== undefined) data.push(...Object.values(data12));
        if(data14 !== undefined) data.push(...Object.values(data14));
        if(data32 !== undefined) data.push(...Object.values(data32));
        if(data38 !== undefined) data.push(...Object.values(data38));
        if(data39 !== undefined) data.push(...Object.values(data39));
        if(data !== null) data.sort((a, b) => a.dist - b.dist);
        setData(data);
        let dataNum = 0;
        dataNum += response12.data.response.body.totalCount;
        dataNum += response14.data.response.body.totalCount;
        dataNum += response32.data.response.body.totalCount;
        dataNum += response38.data.response.body.totalCount;
        dataNum += response39.data.response.body.totalCount;
        setDataNum(dataNum);
        setLoading(false);
      }catch(error){
        console.error("Error!", error);
        setLoading(false);
      }
    }

    if (mode === "viewFacility") fetchData();

  }, [mode])

  const mapRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const center = mapRef.current.getCenter();
      const newMarker = {
        id: position.length+1,
        pos: [center.lat, center.lng],
      };
      setPosition([...position, newMarker]);
    }
    if (e.keyCode === 32) {
      if (position.length >= 3) {
        const result = geometricMedian(position);
        setGeoMedianPos(result);
        console.log(result);
      } else if (position.length === 2){
        const result = [(position[0].pos[0]+position[1].pos[0])/2, (position[0].pos[1]+position[1].pos[1])/2];
        setGeoMedianPos(result);
        console.log(result);
      } else {
        console.log("아직 부족해");
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [position]);

  // OSM: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  // OSM_kor: https://tiles.osm.kr/hot/{z}/{x}/{y}.png
  // VWorld: http://xdworld.vworld.kr:8080/2d/Base/202002/{z}/{x}/{y}.png

  if (mode === "setMap"){
    return (
      <MapContainer
        key={currentPos}
        className="map"
        center={currentPos || [37.75591102502985, 126.8586195451645]}
        zoom={16}
        ref={mapRef}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.osm.kr/hot/{z}/{x}/{y}.png"
        />
        {position.map((marker, index) => (
          <DraggableMarker
          key={index}
          position={position}
          setPosition={setPosition}
          index={index}
          marker={marker}
          ></DraggableMarker>
        ))}
        <GeoMedianMarker
          geoMedianPos={geoMedianPos}
          mode={mode}
          setMode={setMode}
        />
      </MapContainer>
    );
  } else if (mode === "viewFacility"){
    return (
      <div className="view-facility">
        <MapContainer
          key={currentPos}
          className="map-small"
          center={geoMedianPos}
          zoom={16}
          ref={mapRef}
          worldCopyJump
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.osm.kr/hot/{z}/{x}/{y}.png"
          />
          {
            data !== null && data.map((item, index) => (
              <Marker key={index} position={[item.mapy,item.mapx]}>
                <Popup>
                  <div>{item.title}</div>
                  <div>{item.addr1}</div>
                  <div>거리: {Math.round(item.dist)}m</div>
                </Popup>
              </Marker>
            ))
          }
          <GeoMedianMarker
            geoMedianPos={geoMedianPos}
            mode={mode}
            setMode={setMode}
          />
        </MapContainer>
        {
          loading?
          <div>데이터를 불러오는 중입니다.</div>:
          (
            data === null?
            <div>데이터를 불러오는 중에 에러가 발생했습니다.</div>:
            <>
              <h3>문화 시설 정보</h3>
              <h4>문화 시설의 개수: {dataNum}</h4>
              {
                data.map((item, index) => (
                  <div key={index}>
                    <div>{item.title}</div>
                    <div>{item.addr1}</div>
                    <div>거리: {Math.round(item.dist)}m</div>
                    <br></br>
                  </div>
                ))
              }
            </>
          )
        }
      </div>
    );
  }
}

export default Map;

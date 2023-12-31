import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, Marker, TileLayer, Popup, CircleMarker, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import geometricMedian from "./GeoMedian"
import axios from "axios"
import { Link } from "react-scroll"


function GeoMedianMarker({ geoMedianPos, mode, setMode, setFacilityMapPos=null }){
  const gotoFacility = (event) => {
    event.preventDefault();
    if (mode === "setMap"){
      setMode("viewFacility");
      setFacilityMapPos(geoMedianPos);
    }
    else setMode("setMap")
  }

  return( geoMedianPos === null?null:
    <CircleMarker center={geoMedianPos} radius={20}>
      <Popup position={geoMedianPos}>
        <div>기하 중앙값</div>
        <div>위도: {(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}</div>
        <div>경도: {(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}</div>
        <div><a href="#"
        onClick={gotoFacility}
        >{mode === "setMap"?"주변 문화시설 확인하기":"기하 중앙값 다시 구하기"}</a></div>
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

  const removeMarker = (event) => {
    event.preventDefault();
    closePopup();
    const newPosition = [...position];
    newPosition.splice(index, 1);
    setPosition(newPosition);
  }

  const closePopup = (event) => {
    const newPosition = [...position];
    newPosition[index].popupOpened = false;
    setPosition(newPosition);
  }

  const clickMarker = (event) => {
    const newPosition = [...position];
    newPosition[index].popupOpened = true;
    setPosition(newPosition);
  }

  return(
    <Marker key={index} position={marker.pos} draggable={true} eventHandlers={eventHandlers} ref={markerRef} onClick={clickMarker}>
      <Popup position={marker.pos} isOpen={marker.popupOpened}>
        <div>{index+1}번 마커</div>
        <div>위도: {(Math.round(marker.pos[0] * 1000000) / 1000000).toFixed(6)}</div>
        <div>경도: {(Math.round(marker.pos[1] * 1000000) / 1000000).toFixed(6)}</div>
        <div><a href="#" onClick={removeMarker}>이 마커 삭제하기</a></div>
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
  const [facilityMapPos, setFacilityMapPos] = useState(null);
  const [searchDist, setSearchDist] = useState(3000);

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
        const response12 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=${searchDist}&contentTypeId=12`);
        console.log(response12.data);
        const data12 = await response12.data.response.body.items.item;
        const response14 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=${searchDist}&contentTypeId=14`);
        const data14 = await response14.data.response.body.items.item;
        const response32 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=${searchDist}&contentTypeId=32`);
        const data32 = await response32.data.response.body.items.item;
        const response38 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=${searchDist}&contentTypeId=38`);
        const data38 = await response38.data.response.body.items.item;
        const response39 = await axios.get(`https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&numOfRows=100000&pageNo=1&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&listYN=Y&arrange=E&mapX=${(Math.round(geoMedianPos[1] * 1000000) / 1000000).toFixed(6)}&mapY=${(Math.round(geoMedianPos[0] * 1000000) / 1000000).toFixed(6)}&radius=${searchDist}&contentTypeId=39`);
        const data39 = await response39.data.response.body.items.item;
        const data = [];
        if(data12 !== undefined) data.push(...Object.values(data12));
        if(data14 !== undefined) data.push(...Object.values(data14));
        if(data32 !== undefined) data.push(...Object.values(data32));
        if(data38 !== undefined) data.push(...Object.values(data38));
        if(data39 !== undefined) data.push(...Object.values(data39));
        if(data !== null) data.sort((a, b) => a.dist - b.dist);
        setData(data);
        console.log(data);
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

  }, [mode, searchDist])

  const mapRef = useRef(null);

  const handleKeyDown = (e) => {
    if (mode === "setMap"&&e.key === 'Enter') {
      const center = mapRef.current.getCenter();
      const newMarker = {
        id: position.length+1,
        pos: [center.lat, center.lng],
        popupOpened: false,
      };
      setPosition([...position, newMarker]);
    }
    if (mode === "setMap"&&e.keyCode === 32) {
      if (position.length >= 3) {
        const result = geometricMedian(position);
        setGeoMedianPos(result);
        console.log(result);
      } else if (position.length === 2){
        const result = [(position[0].pos[0]+position[1].pos[0])/2, (position[0].pos[1]+position[1].pos[1])/2];
        setGeoMedianPos(result);
        console.log(result);
      } else {
        const result = position[0].pos;
        setGeoMedianPos(result);
        console.log(result);
      }
    }
    if (e.code === 'KeyQ') {
      let newSearchDist = prompt(`새로운 탐색 거리를 숫자로 입력하세요.\n탐색 거리는 500m부터 5000m까지의 값이 가능합니다.\n현재 탐색 거리는 ${searchDist}m입니다.`);
      if(newSearchDist === null||isNaN(parseInt(newSearchDist))) newSearchDist = searchDist;
      else{
        if(parseInt(newSearchDist) < 500) newSearchDist = 500;
        else if(parseInt(newSearchDist) > 5000) newSearchDist = 5000;
      }
      setSearchDist(parseInt(newSearchDist));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [position]);

  useEffect(() => {
    console.log("!!!");
  }, [position]);

  const loadDetails = async (index) => {
    const newData = [...data];
    const item = newData[index];
    try{
      if(data[index].detail_added !== true){
        const response_detail = await axios.get(`https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&contentId=${item.contentid}&contentTypeId=${item.contenttypeid}&defaultYN=Y&firstImageYN=N&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=N&overviewYN=Y&numOfRows=10&pageNo=1`);
        const data_detail = response_detail.data.response.body.items.item[0];
        item.telname = data_detail.telname;
        item.zipcode = data_detail.zipcode;
        item.overview = data_detail.overview;
        item.homepage = data_detail.homepage;
        item.detail_added = true;
      }
    }catch(error){
      console.error('Error!', error);
    }
    try{
      if(data[index].images_added !== true){
        const response_images = await axios.get(`https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=aMat5cuUbFNFhyobZylKAgyEgVGjbYe9MNjhWwx6jvm%2BAOvMa9GuhE8QPf4EQnAARslaft9vJXynH0Y1IK0tGw%3D%3D&MobileOS=ETC&MobileApp=WhereShallWeMeet&_type=json&contentId=${item.contentid}&imageYN=Y&subImageYN=Y&numOfRows=100&pageNo=1`);
        const data_images = response_images.data.response.body.items.item;
        item.images = data_images;
        item.images_added = true;
      }
    }catch(error){
      console.error('Error!', error)
    }
    if(item.contenttypeid === "39"){
      try{
        const response_menu_images = await axios.get(``);
        const data_menu_images = response_menu_images.data.response.body.items.item;
        item.menu_images = data_menu_images;
        item.menu_images_added = true;
      }catch(error){
        console.error('Error!', error)
      }
    }
    setData(newData);
  }

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
          attribution={`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors<br>엔터 키를 눌러 마커 생성<br>스페이스 바를 눌러 기하 중앙값 마커 표시<br>마커를 드래그해 이동, 클릭해 동작 수행<br>현재 탐색 거리는 ${searchDist}m입니다.<br>q 키를 눌러 다시 설정할 수 있습니다.`}
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
          setFacilityMapPos={setFacilityMapPos}
        />
      </MapContainer>
    );
  } else if (mode === "viewFacility"){
    return (
      <div>
        <MapContainer
          key={facilityMapPos}
          className="map-small"
          center={facilityMapPos}
          zoom={16}
          ref={mapRef}
          id="map"
          worldCopyJump
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.osm.kr/hot/{z}/{x}/{y}.png"
          />
          {
            data !== null && data.map((item, index) => (
              <Marker key={index} position={[item.mapy,item.mapx]}>
                <Popup position={[item.mapy, item.mapx]}>
                  <div>{item.title} ({Math.round(item.dist)}m)</div>
                  <div>
                    {item.contenttypeid === "12"&&"관광지"}
                    {item.contenttypeid === "14"&&"문화시설"}
                    {item.contenttypeid === "32"&&"숙박"}
                    {item.contenttypeid === "38"&&"쇼핑"}
                    {item.contenttypeid === "39"&&"음식점"}
                  </div>
                  <div>{item.addr1}</div>
                  {item.firstimage && <img src={item.firstimage} alt="" className="facility-small-image" style={{marginTop: ".5rem", marginBottom: ".5rem"}}></img>}
                  <div>
                    <Link
                    to={item.contentid}
                    spy={true}
                    smooth={true}
                    duration={500}
                    style={{cursor: "pointer"}}
                    onClick={() => loadDetails(index)}
                    >상세 정보 확인하기</Link>
                  </div>
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
        <main>
          {
            loading?
            <h3 className="facility-title">데이터를 불러오는 중입니다.</h3>:
            (
              data === null?
              <h3 className="facility-title">데이터를 불러오는 중에 에러가 발생했습니다.</h3>:
              <>
                <h3 className="facility-title">{dataNum!==0?`${searchDist/1000}㎞ 이내에 문화 시설 ${dataNum}개가 검색되었습니다.`:`${searchDist/1000}㎞ 이내에 검색된 문화 시설이 없습니다.`}</h3>
                {
                  data.map((item, index) => (
                    <article key={index} className="facility-article" style={{backgroundColor: `hsl(0, 80%, ${Math.round(item.dist)/searchDist*60+20}%)`,
                    color: Math.round(item.dist)/searchDist*60+20>66?"#000000":"#efefef"}} id={item.contentid}>
                      <div>{item.title} ({Math.round(item.dist)}m)</div>
                      <div>
                        {item.contenttypeid === "12"&&"관광지"}
                        {item.contenttypeid === "14"&&"문화시설"}
                        {item.contenttypeid === "32"&&"숙박"}
                        {item.contenttypeid === "38"&&"쇼핑"}
                        {item.contenttypeid === "39"&&"음식점"}
                      </div>
                      <div>{item.addr1}</div>
                      {item.firstimage&&<img src={item.firstimage} alt="" className="facility-image" style={{marginTop: ".5rem", marginBottom: ".5rem"}}></img>}
                      {item.tel !== ""&&<div>전화번호: {item.tel} ({item.telname!==undefined&&item.telname})</div>}
                      {item.zipcode !== undefined&&item.zipcode !== ""&&<div>우편번호: {item.zipcode}</div>}
                      {item.homepage !== undefined&&item.homepage !== ""&&<>
                        <div>홈페이지</div>
                        <div dangerouslySetInnerHTML={{__html: item.homepage}}></div>
                      </>}
                      {item.overview !== undefined&&<p dangerouslySetInnerHTML={{ __html: item.overview }}></p>}
                      {item.images_added === true&&item.images !== undefined&&item.images.map((imageitem, imageindex) => (
                        <div key={imageindex} className="facility-sub-image-container">
                          <img src={imageitem.originimgurl} alt="" className="facility-sub-image"></img>
                          {imageitem.imgname !== ""&&<div className="facility-sub-image-label">{imageitem.imgname}</div>}
                        </div>
                      ))}
                      {item.menu_images_added === true&&item.menu_images !== undefined&&item.menu_images.map((menuimageitem, menuimageindex) => (
                        <div key={menuimageindex} className="facility-sub-image-container">
                          <img src={menuimageitem.originimgurl} alt="" className="facility-sub-image"></img>
                          {menuimageitem.imgname !== ""&&<div className="facility-sub-image-label">{menuimageitem.imgname}</div>}
                        </div>
                      ))}
                      <div><Link to="map" spy={true} smooth={true} duration={500} onClick={() => setFacilityMapPos([item.mapy, item.mapx])} style={{cursor: "pointer"}}>지도에서 해당 장소 확인하기</Link></div>
                      {!item.detail_added&&<div><button className="facility-button" onClick={() => loadDetails(index)}>자세히 보기</button></div>}
                    </article>
                  ))
                }
              </>
            )
          }
        </main>
        <div className="goto-top">
          <Link
          to="map"
          spy={true}
          smooth={true}
          duration={500}
          >
            <div style={{fontSize: "2rem", fontWeight: "bold"}}>↑</div>
          </Link>
        </div>
      </div>
    );
  }
}

export default Map;

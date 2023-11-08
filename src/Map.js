import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, Marker, TileLayer, Popup, CircleMarker } from "react-leaflet";
import geometricMedian from "./GeoMedian"


function GeoMedianMarker({ geoMedianPos }){
  return( geoMedianPos === null?null:
    <CircleMarker center={geoMedianPos} radius={20}>
      <Popup>
        <div>기하 중앙값</div>
        <div>위도: {geoMedianPos[0]}</div>
        <div>경도: {geoMedianPos[1]}</div>
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
        <div>위도: {marker.pos[0]}</div>
        <div>경도: {marker.pos[1]}</div>
      </Popup>
    </Marker>
  )
}

function Map() {
  const [currentPos, setCurrentPos] = useState(null);
  const [position, setPosition] = useState([]);
  const [geoMedianPos, setGeoMedianPos] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPos([latitude, longitude]);
      });
    }
  }, []);

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

  return (
    <MapContainer
      key={currentPos}
      className={"map"}
      center={currentPos || [37.75591102502985, 126.8586195451645]}
      zoom={16}
      ref={mapRef}
      worldCopyJump
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
      />
    </MapContainer>
  );
}

export default Map;

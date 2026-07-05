"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { company } from "@/lib/content";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#7dd3fc;box-shadow:0 0 0 8px rgba(125,211,252,0.25)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function LeafletMap() {
  const { lat, lng } = company.mapCoords;
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      attributionControl={false}
      className="h-full w-full"
      style={{ background: "transparent" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      <Marker position={[lat, lng]} icon={pinIcon} />
    </MapContainer>
  );
}

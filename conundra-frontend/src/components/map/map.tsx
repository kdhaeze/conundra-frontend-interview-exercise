import L, { LatLng, Marker as MarkerType } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import Order from '../../types/order';
import './map.scss';

interface Props {
    items: Order[],
    setClicked: (order: Order) => void,
    clickedOrder?: Order,
    listItems?: MutableRefObject<HTMLLIElement[]>
    setMarkers: (markers: MutableRefObject<MarkerType[]>) => void
}

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map: React.FC<Props> = ({ items, setClicked, setMarkers, clickedOrder, listItems }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [centerLat, setCenterLat] = useState<number>(0);
    const [centerLong, setCenterLong] = useState<number>(0);
    const [allLatLong, setAllLatLong] = useState<LatLng[]>([]);
    const markerRefs = useRef<MarkerType[]>([])

    useEffect(() => {
        setOrders(items);
        if (items.length) {
            calcCenter(items);
            setAllLongLat(items);
            //To pass to parent
            setMarkers(markerRefs);
        }
    }, [items])

    useEffect(() => {
        //Remove the .selected class from the other listitem if it exists
        listItems?.current.forEach(listItem => {
            if (listItem.classList.contains('selected')) {
                listItem.classList.remove('selected');
            }
        });

        let index = items.findIndex(item => item === clickedOrder)
        //If the order exists
        if (index !== -1) {
            listItems?.current[index].classList.add('selected')
        }
    }, [clickedOrder])

    // Calculate center of all longitudes and latitudes
    const calcCenter = (orders: Order[]) => {
        let lat = 0;
        let long = 0;

        orders.forEach(order => {
            lat += order.latitude;
            long += order.longitude;
        });

        let centerLat = lat / orders.length
        let centerLong = long / orders.length

        setCenterLat(centerLat)
        setCenterLong(centerLong)
    }

    // Make an array of all the long & lat
    const setAllLongLat = (orders: Order[]) => {
        let totalLatLong: LatLng[] = [];

        orders.forEach(order => {
            totalLatLong.push(L.latLng(order.latitude, order.longitude));
        });

        setAllLatLong(totalLatLong);
    }

    return (
        centerLat !== 0 && centerLong !== 0
            ?
            (<MapContainer center={[centerLat, centerLong]} zoom={10} scrollWheelZoom={false} style={{ height: '100vh' }} className="map-container" zoomControl={false}  >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    orders
                        ? (orders.map(
                            (order) => (
                                <Marker key={order.id} position={L.latLng(order.latitude, order.longitude)} eventHandlers={{
                                    click: () => {
                                        setClicked(order);
                                    }
                                }}
                                    ref={ref => {
                                        if (!markerRefs.current.includes(ref!) && ref !== null) {
                                            markerRefs.current.push(ref!)
                                        }
                                    }}
                                >
                                    <Popup>
                                        {order.address}
                                    </Popup>
                                </Marker>
                            )
                        ))
                        : null
                }
                {
                    <Polyline pathOptions={{ color: '#3e6ca2' }} positions={allLatLong} smoothFactor={10} />
                }
                <ZoomControl position="topright"/>
            </MapContainer>)
            : null
    );
}

export default Map;
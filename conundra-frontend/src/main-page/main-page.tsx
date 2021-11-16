import { Marker as MarkerType } from 'leaflet';
import { MutableRefObject, useEffect, useState } from "react";
import List from '../components/list/list';
import Map from '../components/map/map';
import Order from '../types/order';
import './main-page.scss';

const MainPage = () => {
  const orderURL = "http://localhost:3004/orders"

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [clickedOrder, setClickedOrder] = useState<Order>();
  const [mapMarkers, setMapMarkers] = useState<MutableRefObject<MarkerType[]>>();
  const [listItems, setListItems] = useState<MutableRefObject<HTMLLIElement[]>>();

  useEffect(() => {
    const fetchOrders = async () => {
      const resp = await fetch(orderURL);
      const orders = await resp.json();
      setAllOrders(orders);
    }
    fetchOrders();
  }, [])

  //Set clickedOrder to pass to children
  const setClicked = (order: Order) => {
    setClickedOrder(order);
  }

  //Set map markers to pass to list component
  const setMarkers = (markers: MutableRefObject<MarkerType[]>) => {
    setMapMarkers(markers);
  }

  //Set list items to pass to pass to map component
  const setListitemsRefs = (listItems: MutableRefObject<HTMLLIElement[]>) => {
    setListItems(listItems);
  }

  return (
    <div className="main">
      <div className="container">
        {
          allOrders.length ? <List items={allOrders} setListitemRefs={setListitemsRefs} setClicked={setClicked} mapMarkers={mapMarkers} clickedOrder={clickedOrder}/> : <div></div>
        }
        <Map items={allOrders} setMarkers={setMarkers} setClicked={setClicked} listItems={listItems} clickedOrder={clickedOrder}/>
      </div>
    </div>
  );
}


export default MainPage;

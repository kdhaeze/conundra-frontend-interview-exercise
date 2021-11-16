import { Marker as MarkerType } from 'leaflet';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import Order from '../../types/order';
import './list.scss';

interface Props {
    items: Order[],
    setClicked: (order: Order) => void,
    clickedOrder?: Order,
    mapMarkers?: MutableRefObject<MarkerType[]>;
    setListitemRefs: (listItems: MutableRefObject<HTMLLIElement[]>) => void
}

const List: React.FC<Props> = ({items, setClicked, setListitemRefs, clickedOrder, mapMarkers}) => {
    const [listItems, setListItems] = useState<Order[]>([]);
    const listItemRefs = useRef<HTMLLIElement[]>([])

    useEffect(() => {
        setListItems(items);
        //To pass to parent
        setListitemRefs(listItemRefs)
    }, [items])

    useEffect(()=>{
        let index = items.findIndex(item => item === clickedOrder)
        //If the order exists
        if(index !== -1) {
            mapMarkers?.current[index].openPopup()
        }
    },[clickedOrder])

    return (
        <div className="list">
            <h2>Orders</h2>
            {
                listItems
                    ? (
                        <ul>
                            {listItems.map(
                                l => (
                                    <li key={l.id} onClick={() => setClicked(l)} ref={
                                        ref => {
                                            if(!listItemRefs.current.includes(ref!) && ref !== null){
                                                listItemRefs.current.push(ref!)
                                            }
                                        }
                                    }>
                                        <p className="businessid">{l.businessId}</p>
                                        <p className="address">{l.address}</p>
                                    </li>
                                )
                            )}
                        </ul>
                    )
                    : <h2>empty</h2>
            }
        </div>

    );
}

export default List;
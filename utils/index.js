import {nanoid} from "nanoid"


/**
 *
 * @param initState
 * @returns {{}}
 */
export default function generateInventorySliceData(initState = null) {
    console.log(initState)
    const initPackState = (params) => {
        const defaultValues = {
            id: `pack-${nanoid(5)}`,
            armor:{
                isArmorSlot:false,
                type:''
            },
            status: 'equipped',
            maxSize: 3,
            currentSize: 0,
            items: [],
            isFull: false
        }
        return {...defaultValues, ...params}
    }
    ///test
    const initItem = (params) => {
        const defaultValues = {
            id: `item-${nanoid(6)}`,
            size: 1,
            startSlot:0, //zero-index
            imgURL: '',
            currentStackCount: 1,
            maxStackCount:1,
            tooltip:'',
            packId: null
        }
        return {
            ...defaultValues, ...params
        }
    }


    function placeItemInPack(data) {
        //init item
        const item = initItem(data)
        //init pack
        const pack = initPackState({currentSize: item.size})
        //add packid to item parentI
        item.packId = pack.id
        // change current size based on item created
        pack.items.push(item)

        return pack
    }

    return [
            placeItemInPack({size:1, startSlot:2}), //TODO: remove startSlot maybe?
            placeItemInPack({size:2, startSlot:1}),
            placeItemInPack({size:3, startSlot:0}),
            initPackState({armor:{isArmorSlot: true, type:'heavy'}}),
            initPackState({armor:{isArmorSlot: true, type:'medium'}}),
            initPackState({armor:{isArmorSlot: true, type:'light'}}),
        ]
                // ,

}
//GOAL TO ADD PARENT ID OF BAG TO INIT ITEMS CREATED
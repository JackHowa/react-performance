// React.memo for reducing unnecessary re-renders
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import { useCombobox } from '../use-combobox'
import { getItems } from '../workerized-filter-cities'
import { useAsync, useForceRerender } from '../utils'

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => {

        const isHighlighted = highlightedIndex === index;
        const isSelected = selectedItem?.id === item.id
        return (
          <ListItem
            isSelected={isSelected}
            isHighlighted={isHighlighted}
            key={item.id}
            getItemProps={getItemProps}
            item={item}
            index={index}
          >
            {item.name}
          </ListItem>
        )
      })}
    </ul>
  )
}
Menu = React.memo(Menu)

function ListItem({
  getItemProps,
  item,
  index,
  selectedItem,
  isSelected,
  isHighlighted,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          fontWeight: isSelected ? 'bold' : 'normal',
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
        },
        ...props,
      })}
    />
  )
}


/*
 
children: "Foley"
getItemProps: ƒ (_temp3)
highlightedIndex: 0
index: 99
item: {country: "US", name: "Foley", lat: "30.40659", lng: "-87.6836", id: "99"}
selectedItem: null


03.js:73 
{item: {…}, index: 2, selectedItem: {…}, highlightedIndex: -1, getItemProps: ƒ, …}
children: "Upper Bear Creek"
getItemProps: ƒ (_temp3)
highlightedIndex: -1
index: 2
item: {country: "US", name: "Upper Bear Creek", lat: "39.62385", lng: "-105.4178", id: "16465"}
selectedItem: {country: "US", name: "Bear Creek", lat: "34.27482", lng: "-87.70058", id: "5"}
key: (...)
get key: ƒ ()
__proto__: Object
 "prev"
03.js:74 
{item: {…}, index: 2, selectedItem: {…}, highlightedIndex: -1, getItemProps: ƒ, …}
children: "Upper Bear Creek"
getItemProps: ƒ (_temp3)
highlightedIndex: -1
index: 2
item: {country: "US", name: "Upper Bear Creek", lat: "39.62385", lng: "-105.4178", id: "16465"}
selectedItem: {country: "US", name: "Bear Creek", lat: "60.16417", lng: "-149.395", id: "16087"}
key: (...)
get key: ƒ ()
__proto__: Object
 

*/

// function shouldListItemRerender(prevProps, nextProps) {
//   // 
//   console.log(prevProps, 'prev')
//   console.log(nextProps, 'next')
//   // for next 
//   return nextProps?.selectedItem?.id === prevProps.item.id;

//   // return true;
//   // return prevProps.highlightedIndex 
//   // !== prevProps.index || nextProps.highlightedIndex !== nextProps.index;

//   // return prevProps.selectedItem !== nextProps.selectedItem;
// }
ListItem = React.memo(ListItem)

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const { data: allItems, run } = useAsync({ data: [], status: 'pending' })
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])
  const items = allItems.slice(0, 100)

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({ inputValue: newValue }) => setInputValue(newValue),
    onSelectedItemChange: ({ selectedItem }) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({ type: 'text' })} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  )
}

export default App

/*
eslint
  no-func-assign: 0,
*/

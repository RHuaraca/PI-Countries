import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    getAllCountries, 
    setOrderName, 
    setOrderPopulation,
    getAllContinents,
    getAllActivities,
    setActualPage,
    setFilters,
    resetName
} from '../redux/actions.js';
import style from './filter-order-bar.module.css'

function FiltersAndOrderBar (){
    const dispatch = useDispatch()
    const {
        orderName, 
        orderPopulation, 
        continents, 
        errorHandler, 
        activities,
        filterByContinent,
        filterByActivity
    }=useSelector(state=>state)
    const [internalState, setInternalState]= useState({
        orderName:orderName,
        orderPopulation:orderPopulation,
        filterByContinent:filterByContinent,
        filterByActivity:filterByActivity
    });
    useEffect(()=>{
        if(!continents.length) dispatch(getAllContinents())
        if (!activities.length) dispatch(getAllActivities())
    },[]);

    function selectHandler(e){
        setInternalState({
            ...internalState,
            [e.target.name]:e.target.value
        })
        if(e.target.name==="orderName"){
            dispatch(resetName());
            dispatch(setOrderName(e.target.value));
            dispatch(getAllCountries(e.target.value, internalState.orderPopulation, internalState.filterByContinent, internalState.filterByActivity));
        } else if (e.target.name === "orderPopulation"){
            dispatch(resetName());
            dispatch(setOrderPopulation(e.target.value));
            dispatch(getAllCountries(internalState.orderName, e.target.value, internalState.filterByContinent, internalState.filterByActivity));
        } else if (e.target.name === "filterByContinent"){
            dispatch(resetName());
            dispatch(setFilters(e.target.value, internalState.filterByActivity))
            dispatch(setActualPage(1))
            dispatch(getAllCountries(internalState.orderName, internalState.orderPopulation, e.target.value, internalState.filterByActivity));
        } else if (e.target.name === "filterByActivity") {
            dispatch(resetName());
            dispatch(setFilters(internalState.filterByContinent, e.target.value))
            dispatch(setActualPage(1))
            dispatch(getAllCountries(internalState.orderName, internalState.orderPopulation, internalState.filterByContinent, e.target.value));
        }
    }
    return(
        <div className={style.content}>
            <div className={style.ordersAndFiltersContent}>
                <h4 className={style.title}>Orders</h4>
                <div className={style.nameAndSelect}>
                    <div className={style.orderFilterSelect}>
                        <span>By name</span>
                        <select defaultValue={orderName} name="orderName" onChange={(e) => selectHandler(e)}>
                            <option value="AZ">from A to Z</option>
                            <option value="ZA">from Z to A</option>
                        </select>
                    </div>
                    <div className={style.orderFilterSelect}>
                        <span>By population</span>
                        <select defaultValue={orderPopulation} name="orderPopulation" onChange={(e) => selectHandler(e)}>
                            <option value="Not">No order</option>
                            <option value="Max">Max to Min</option>
                            <option value="Min">Min to Max</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={style.ordersAndFiltersContent}>
                <h4 className={style.title}>Filters</h4>
                <div className={style.nameAndSelect}>
                    <div className={style.orderFilterSelect}>
                        <span>By continent</span>
                        <select defaultValue={filterByContinent} name="filterByContinent" onChange={(e) => selectHandler(e)}>
                            {!continents.length ?
                                errorHandler.length ?
                                    <option>Failed</option>
                                    : <option>Cargando...</option>
                                : <>
                                    <option value='Not'>All</option>
                                    {continents.map(continent =>
                                        <option
                                            key={continent.id}
                                            value={continent.name}>
                                            {continent.name}
                                        </option>)
                                    }
                                </>
                            }
                        </select>
                    </div>
                    <div className={style.orderFilterSelect}>
                        <span>By activity</span>
                        <select defaultValue={filterByActivity} name="filterByActivity" onChange={(e) => selectHandler(e)}>
                            {!activities.length ? errorHandler.length ?
                                <option>Failed</option>
                                : <option>Cargando...</option> :
                                <>
                                    <option value='Not'>All</option>
                                    {activities.map(activity =>
                                        <option
                                            key={activity.id}
                                            value={activity.name}>
                                            {activity.name}
                                        </option>)
                                    }
                                </>
                            }
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FiltersAndOrderBar;
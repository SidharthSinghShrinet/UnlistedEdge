import React, { useEffect, useState } from 'react'
import Papa from "papaparse";
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCompanies } from '@/redux/companySlice';
import AllCompanies from '@/components/AllCompanies';
function Marketplace() {
    const companies = useSelector((state)=>state.company.allCompanies);
    const dispatch = useDispatch();
    useEffect(()=>{
        Papa.parse("/data/fundamentals_clean_core.csv",{
            download:true,
            header:true,
            complete:(result)=>{
                dispatch(setAllCompanies(result.data));
            }
        })
    },[]);
  return (
    <div className='w-full h-fit flex flex-col items-center'>
        <Header/>
        <SearchBar/>
        <AllCompanies/>
    </div>    
  )
}

export default Marketplace
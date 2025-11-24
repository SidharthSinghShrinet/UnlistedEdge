import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        allCompanies:[],
        selectedCompany:"",
        revenueData:[],
        profitLossData:[],
        networth:[],
        searchedCompanies:[]
    },
    reducers:{
        setAllCompanies:(state,action)=>{
            state.allCompanies = action.payload
        },
        setSelectedCompany:(state,action)=>{
            state.selectedCompany = action.payload
        },
        setRevenueData:(state,action)=>{
            state.revenueData = action.payload
        },
        setProfitLossData:(state,action)=>{
            state.profitLossData = action.payload
        },
        setNetWorth:(state,action)=>{
            state.networth = action.payload
        },
        setSearchedCompanies:(state,action)=>{
            state.searchedCompanies = action.payload
        }
    }
})

export const {setAllCompanies,setSelectedCompany,setRevenueData,setProfitLossData,setNetWorth,setSearchedCompanies} = companySlice.actions;
export default companySlice.reducer;
"use client"

import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowRight, Bookmark, Layers2, Pencil, Pin, Search, ArrowDown, ChevronLeft, ChevronRight, ArrowUp, Cloud } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { HiEllipsisVertical } from 'react-icons/hi2'
import { FaSort } from 'react-icons/fa'

const Table = ({data}) => {
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });
    const [showAll, setShowAll] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const pageOptions = [10, 15, 20, 30, 60]

    const [filtering, setFiltering] = useState(null)

    const columnHelper = createColumnHelper()
    const columns = useMemo(() => [
        columnHelper.display({
            id: 'select',
            header: ({table}) => (
                <div className='flex items-center justify-center'>
                    <Checkbox 
                        className='h-4 w-4'
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomePageRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    ></Checkbox>
                </div> 
            ),
            cell: ({row}) => (
                <div className='flex items-center justify-center'>
                    <Checkbox
                        className='h-4 w-4'
                        checked={row.getIsSelected()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    >
                    </Checkbox>
                </div>
            ) 
        }),
        columnHelper.accessor('cardholder',{
            header: "Cardholder",
            enableSorting: false,
            cell: ({cell}) => (
                <p className='text-white'>{cell.getValue()}</p>
            )
        }),
        columnHelper.accessor('cardNumber',{
            header: "Card Number",
            enableSorting: false,
            cell: ({cell}) => (
                <p className='roboto'>{cell.getValue()}</p>
            )
        }),
        columnHelper.accessor('merchant',{
            header: "Merchant",
            enableSorting: false
        }),
        columnHelper.accessor('amount',{
            header: ({header}) => (
                <div className='flex flex-row items-center justify-between'>
                    <p>Amount</p>
                    <FaSort className='cursor-pointer' size={16} onClick={header.column.getToggleSortingHandler()} ></FaSort>
                </div>
            ),
            cell: ({cell}) => (
                <p className='roboto'>{cell.getValue()}</p>
            ),
            enableSorting: true,
        }),
        columnHelper.accessor('status',{
            header: "Status",
            cell: ({cell}) => (
                <SystemSelect initialValue={cell.getValue} options={['Approved', 'Open', 'Rejected']}></SystemSelect>
            ),
            enableSorting: false,
            filterFn: 'equalsString'
        }),
        columnHelper.accessor('date',{
            header: ({header}) => (
                <div className='flex flex-row items-center justify-between'>
                    <p>Date</p>
                    <FaSort className='cursor-pointer' size={16} onClick={header.column.getToggleSortingHandler()}></FaSort>
                </div>
            ),
            cell: ({ cell }) => {
                const dateValue = cell.getValue();
                let date = new Date(dateValue)
                const dateString = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                return <p className='roboto'>{dateString}</p>;
              },
            enableSorting: true,
            sortingFn: (rowA, rowB, columnId) => {
                let dateA = new Date(rowA.original.date);
                let dateB = new Date(rowB.original.date);
                return dateA - dateB;
            }
        }),
        columnHelper.display({
            id: 'actions',
            cell: <div><HiEllipsisVertical strokeWidth={1} size={20} color='white'></HiEllipsisVertical></div>,
        }),
    ],[])

    
    const table = useReactTable({columns, data, 
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        state: {
            globalFilter: filtering,
            pagination,
            rowSelection,  // bind local state to table state
        },
        onGlobalFilterChange: setFiltering,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        getFilteredRowModel: getFilteredRowModel(),
        enableRowPinning: true,
    })

    // show actions depending on if rows are selected
    useEffect(() => {
        const isSelected = Object.keys(rowSelection).length > 0;
        setShowActions(isSelected);
    }, [rowSelection])

    // pin or unpin
    function handlePin(){
        let hasPinnedRows = false
        table.getSelectedRowModel().rows.forEach((row) => {
            if (row.getIsPinned()) hasPinnedRows = true
        })
        
        const oneRow = table.getSelectedRowModel().rows.length == 1

        table.getSelectedRowModel().rows.forEach((row) => {
            // toggle pin/unpinned for selected row of one
            if (oneRow && row.getIsPinned()!= false){
                row.pin(false)
            }
            else if(oneRow && row.getIsPinned() == false){
                row.pin('top')
            }
            // toggle all pinned/unpinned for more than one selected row
            else if(hasPinnedRows){
                row.pin(false)
            }
            else if(!hasPinnedRows){
                row.pin('top')
            }
            
            row.toggleSelected(false)
        })
        setShowActions(!showActions)
    }

  return (
    <div className=' w-full flex flex-col text-white bg-cover bg-[#1b1d22]' >
        <div className='w-full bg-[#1b1d22] fixed '>
            {/* header */}
            <div className='p-5 border-b border-1 border-nimbus rounded-tl-md rounded-tr-md'>
                <div className='items-center flex flex-row justify-between'>
                    <div>
                        <div className='inline-flex flex-row items-center justify-center '>
                            <h1 className=' text-xl mr-2 font-semibold roboto'>Marketing Team</h1>
                            <div className='rounded-full bg-[#28296a] inline-flex flex-row h-[32px] w-[120px] p-2 items-center justify-evenly text-xs'>
                                <p className=''>Submitted</p>
                                <div className='rounded-full h-[22px] w-[30px] px-[2px] py-2 bg-[#4a4cc2] text-center flex items-center justify-center font-medium'>
                                    <p>10</p>
                                </div>
                            </div>
                        </div>
                        <div className='h-5 mt-[2px]'>
                            <p className='text-sm h-5 font-light'>Review and approve team expenses.</p>
                        </div>
                    </div>
                    <div className='inline-flex items-center gap-x-2'>
                        <h1 className=' font-extrabold text-3xl'>Nimbus</h1>
                        <Cloud size={48}></Cloud>
                    </div>
                </div>

                
            </div>
            {/* tabs */}
            <div className='flex flex-row items-center justify-start px-5  border-b border-1 border-nimbus gap-x-6'>
                <div className=' inline-flex flex-row items-center justify-evenly py-3 border-b-2 border-[#4a4cc2] gap-x-2 cursor-pointer'>
                    <Layers2 size={16} color='gray'></Layers2>
                    <p className='text-sm font-semibold'>Q1 Campaign</p>
                    <div className='rounded-md h-[22px] w-[30px] px-[2px] py-2 bg-[#4a4cc2] text-center flex items-center justify-center text-xs font-medium'>
                        <p>{data.length}</p>
                    </div>
                </div>
                <div className='inline-flex flex-row items-center justify-evenly py-3  gap-x-2 cursor-pointer hover:border-b-2 border-gray-400'>
                    <Layers2 size={16} color='gray'></Layers2>
                    <p className='text-sm font-semibold'>re:Invent</p>
                    <div className='rounded-md h-[22px] w-[30px] px-[2px] py-2  bg-[#4a4cc2] text-center flex items-center justify-center text-xs font-medium'>
                        <p>29</p>
                    </div>
                </div>
            </div>
            {/* actions */}
            <div className='flex flex-row items-center justify-start p-5 h-16 gap-x-5'>
                {/* search */}
                <div className='h-10 w-52 border border-nimbus flex items-center justify-center p-3 rounded-md text-sm'>
                    <div className='inline-flex flex-row items-center '>
                        <Search size={16} color='gray'></Search>
                        <input className='h-6 px-2  bg-transparent outline-none truncate' type='text' placeholder='Search name, merchant...' onChange={(e) => setFiltering(e.target.value)}></input>
                    </div>
                </div>
                <div className='flex flex-row justify-between items-center h-6 text-sm font-normal w-full'>
                    <div className={`flex flex-row gap-x-4 items-center transition-opacity duration-100 ease-in-out ${showActions? 'visible opacity-100': 'invisible opacity-0'} `}>
                        <button className='inline-flex flex-row gap-x-[2px] items-center' disabled>
                            <Bookmark size={16} color='white'></Bookmark>
                            <p>Bookmark</p>
                        </button>
                        <button className='inline-flex flex-row gap-x-[2px] items-center delay-[25ms]' onClick={handlePin}>
                            <Pin size={16} color='white' className=' rotate-45'></Pin>
                            <p>Pin</p>
                        </button>
                        <button className='inline-flex flex-row gap-x-[2px] items-center delay-[30ms]' disabled>
                            <ArrowRight size={16} color='white'></ArrowRight>
                            <p>Open</p>
                        </button>
                        <button className='inline-flex flex-row gap-x-[2px] items-center delay-[35ms]' disabled>
                            <Pencil size={16} color='white'></Pencil>
                            <p>Edit</p>
                        </button>
                    </div>
                    <div className='flex flex-row items-center relative'>
                        {/* filter */}
                        <div className='inline-flex relative justify-center p-2 mr-[3px] items-center  '>
                            <p>Filter by</p>      
                        </div>
                        <select value={filtering} className='rounded text-white bg-gradient-to-b from-[#222328] to-[#191b20] border border-[#3f414a] outline-none py-1' onChange={((e) => {
                            if(e.target.value == 'None'){
                                table.resetGlobalFilter()
                            }
                            else{
                                setFiltering(e.target.value)
                            }
                        })}>
                            <option>None</option>
                            <option>Approved</option>
                            <option>Open</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>
                
            </div>
        </div>
        {/* table */}
        <div className='w-full fixed top-[208px] overflow-y-scroll z-0 bg-[#1b1d22]' style={{ maxHeight: 'calc(100vh - 203px)' }} id='portal'>
            <table className=' w-full h-full'>
                <thead className='sticky top-0 h-[42px] bg-[#24252a] shadow z-[550]'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className='text-sm text-nimbus'>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className={`text-left font-normal px-2 py-4 bg-[#24252a] `}>
                                    {header.isPlaceholder
                                    ? null
                                    : (
                                        <>
                                            {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                            )}
                                        </>
                                        
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className=''>
                    {table.getFilteredRowModel().rows.length > 0 ? (
                        <>
                            {table.getTopRows().map(row => (
                                <PinnedRow key={row.id} row={row}></PinnedRow>
                            ))}
                            {table.getCenterRows().map(row => (
                                // TODO: on click, select row (currently, conflicting with checkbox selection) -- PROPAGATION ISSUE
                                <tr key={row.id} className={`h-16 text-sm text-[#d9dded] transition-all duration-200 ease-in-out border-b border-[#3f414a]  ${row.getIsSelected() ? 'bg-[#317589]': ''} `} >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className=' text-left px-2'>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </>
                        
                    ): (
                        <tr>
                           <td colSpan={table.getAllColumns().length} className='text-center p-4'>No results found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* footer */}
            <div className={`h-14 px-4 flex flex-row items-center justify-between ${table.getRowModel().rows.length < 10 ? 'fixed':'sticky'} w-full bottom-0 border-t border-t-[#3f414a] bg-[#1b1d22] z-[550]`}>
                <div> 
                    <p>Total <span className='font-semibold'>{table.getRowCount()}</span></p>
                </div>
                <div className='flex flex-row items-center justify-evenly'>
                    {/* showing... */}
                    <div className=' flex flex-row items-center gap-x-2 justify-center'>
                        <p className='text-sm'>Lines per page</p>
                        <div className=' relative'>
                            <select value={pagination.pageSize} className='bg-gradient-to-b from-[#222328] to-[#191b20] border border-nimbus px-1 py-1 rounded cursor-default text-sm font-semibold focus:outline-none' onChange={((event) => {
                                table.setPageSize(event.target.value)
                            })}>
                                {pageOptions.map((option, index) => {
                                        return (
                                            <option key={index} >{option}</option>
                                        )
                                })}
                            </select>
                        </div>
                        <button className='inline-flex items-center justify-center gap-x-1 mr-4 py-4 text-sm' onClick={(() => {
                                if(!showAll){
                                    table.setPageSize(table.getRowCount())
                                    setShowAll(true)
                                }
                                else if (showAll){
                                    table.setPageSize(10)
                                    setShowAll(false)
                                }
                            }
                        )}>
                            {showAll? <p>Show less</p> : <p>Show all</p>}
                            {showAll? <ArrowUp size={16}></ArrowUp> : <ArrowDown size={16}></ArrowDown>}
                        </button>
                    </div>
                    {/* pagination */}
                    <div className='h-8 w-28 flex flex-row items-center justify-evenly divide-x divide-[#3f414a] bg-gradient-to-b from-[#222328] to-[#191b20] border border-nimbus rounded'>
                        <button className='h-full w-full flex items-center justify-center' onClick={(() => table.previousPage())} disabled={!table.getCanPreviousPage()}>
                            <ChevronLeft size={16}></ChevronLeft>
                        </button>
                        <div className='h-full w-full flex items-center justify-center px-3 text-sm'>
                            {table.getPageCount() > 0 ? (
                                <>
                                    <p>{table.getState().pagination.pageIndex + 1}<span className=' text-gray-500'>/{table.getPageCount()}</span></p>
                                </>
                            ):(
                                <>
                                    <p>1<span className=' text-gray-500'>/1</span></p>
                                </>
                            )}
                            
                        </div>
                        <button className='h-full w-full flex items-center justify-center' onClick={(() => table.nextPage())} disabled={!table.getCanNextPage()}>
                            <ChevronRight size={16}></ChevronRight>
                        </button>
                    </div>
                </div>
            </div>
        </div>  
    </div>
    
  )
}

export default Table

function Checkbox({indeterminate, className='', ...rest}){
    const ref = useRef(null)

    // sync indeterminant state
    useEffect(() => {
        if(typeof indeterminate === 'boolean'){
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [indeterminate])


    return(
        <label className='custom-checkbox-label relative'>
            <input
                type="checkbox"
                ref={ref}
                className={className + ' hidden'}
                {...rest}
            />
            <span className='checkmark'></span>
        </label>
    )
}

function PinnedRow({row}){
    const rowRef = useRef(null)

    return (
        <tr ref={rowRef} className={`sticky h-16 text-sm z-30 transition-all duration-200 ease-in-out border-b border-[#3f414a] ${row.getIsSelected() ? 'bg-[#317589]': 'bg-[#32323d]'} `} style={{top:`${row.getPinnedIndex() * 60 + 51}px`}}  id={row.id}>
            {row.getVisibleCells().map(cell => {
                return (
                    <td key={cell.id} className='text-left px-2'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                )
            })}
        </tr>
    )
}

function SystemSelect({initialValue, options}){
    const [selected, setSelected] = useState(initialValue)

    const handleChange = (event) => {
        setSelected(event.target.value)
    }

    return (
        <select value={selected} onChange={handleChange} className={`rounded border py-1 font-medium focus:outline-none ${selected === 'Approved' ? 'bg-[#084836]  bg-opacity-100 text-[#18DBA0] border-none': selected === 'Open' ? 'bg-dark-rust text-[#ff6d24] border-none' : selected === 'Rejected' ? 'bg-[#480808] bg-opacity-100 text-[#ff1b32] border-none' : 'text-black'}`}>
            {options.map((option, index) => {
                return (
                    <option key={index} value={option}>{option}</option>
                )
            })}
        </select>
    )
}
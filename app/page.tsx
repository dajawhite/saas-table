"use client"

import Table from "@/components/Table"
import { useState } from 'react'
import {agents} from '@/constants/data'

export default function Home() {
  const [data, setData] = useState(agents)

  return (
    <div>
      <Table data={data}></Table>
    </div>
  );
}

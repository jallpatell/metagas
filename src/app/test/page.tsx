import React from 'react'
import MainPage from '@/components/MainPage'
const page = () => {
  const gasPrice = '29.350430045'
  return (
      <MainPage gasPrice={gasPrice} blockchainName={'Ethereum Gas'} />
  )
}

export default page
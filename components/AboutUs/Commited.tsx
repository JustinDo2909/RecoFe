import React from 'react'
import CustomIntro from '../CustomIntro'
import Image from 'next/image'
import pic from '@/images/tui6.jpg'
const Commited = () => {
  return (
    <div className='flex flex-col justify-center gap-10 items-center'>
          <CustomIntro
            cusTitle="Sứ Mệnh Của Chúng Tôi"
          />
          <Image src={pic} alt="alt" width={2000} height={500} />
    </div>
  )
}

export default Commited
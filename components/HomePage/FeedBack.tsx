import React from 'react'
import Title from '../Title'
import Image from 'next/image'

interface FeedBack {
  image: string
  rate: number
  title: string
  name: string
}

const FeedBackComponent = ({ feedbackList }: { feedbackList: FeedBack[] }) => {
  return (
    <div className='bg-[#A0BBA7] p-6 rounded-md'>
      <Title>Đánh Giá Từ Khách Hàng</Title>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {feedbackList.map((feedback, index) => (
          <div key={index} className='p-4'>
            <div className='h-[200px] w-full'>
              <Image
                alt='feedback image'
                src={feedback.image}
                width={270}
                height={200}
                className='object-cover h-full w-full rounded-lg shadow-lg'
              />
            </div>
            <div className='flex mt-2 text-lg'>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < feedback.rate ? 'text-black' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <h3 className='text-lg mt-2 font-semibold'>{feedback.title}</h3>
            <p className='text-sm text-black uppercase tracking-widest flex items-center gap-3 font-semibold mt-4'>
              <span className='w-4 h-0 border-t border-black'></span> {feedback.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeedBackComponent

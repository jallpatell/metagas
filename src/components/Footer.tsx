import React from 'react'
import GlassCard from './GlassCard'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {

  return (
    <section className='flex justify-center max-w mb-10 scale-70'>
        <GlassCard className='flex align-middle h-30 mt-10  p-10'>
            <div className='flex gap-10 font-sans text-2xl font-extralight mt-1'>
            <div>
                Privacy Policy
            </div>
            <div>
                Terms of Service
            </div>
            <div className='ml-30 -mr-30 text-2xl'>
                Contact
            </div> 
        </div>
        <GlassCard className='flex gap-100 p-5 w-100 h-20 -mt-5 ml-37'>
            <div className='flex gap-20'>
                <div className='flex justify-baseline gap-10 ml-20'>
                    <Link href="https://x.com/jallpatell" target="_blank" rel="noopener noreferrer">
                        <Image src="/icons/x_logo.png" alt="X logo" width={40} height={40} className='invert hover:scale-125 cursor-pointer' />
                    </Link>
                    <Link href="https://github.com/jallpatell" target="_blank" rel="noopener noreferrer">
                        <Image src="/icons/github_logo.png" alt="GitHub logo" width={40} height={30} className='invert hover:scale-125 cursor-pointer' />
                    </Link>
                    <Link href="https://www.linkedin.com/in/jallpatell" target="_blank" rel="noopener noreferrer">
                        <Image src="/icons/linkedin_logo.png" alt="LinkedIn logo" width={40} height={40} className='hover:scale-125 cursor-pointer' />
                    </Link>
                </div>
            </div>
        </GlassCard>

        </GlassCard> 
    </section>
  )
}

export default Footer
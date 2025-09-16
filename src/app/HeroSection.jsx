import React from 'react';

const HeroSection = () => {
    return (
        <div className='bg-gradient-to-r min-h-[80vh] from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% pt-32 pb-16'>
            <div className='max-w-7xl mx-auto px-6 text-center'>
                <h1 className='text-4xl md:text-6xl font-bold mb-6'>Dev First Steps</h1>

                <p className='text-lg md:text-xl mb-8 max-w-2xl mx-auto'> Discover modern solutions to boost your productivity and simplify your workflow. 
          Built with the latest technologies and a clean design.</p>

          <div className='justify-center'>
            <button className='bg-black rounded-lg text-white p-2'>Get Started</button>
          </div>
            </div>
            
        </div>
    );
};

export default HeroSection;
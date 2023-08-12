import { Theme } from '@/lib/models/theme';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import TaskItem from '../TaskItem';

type AccordionProps = {
  theme: Theme;
}

const ThemeAccordion: React.FC<AccordionProps> = ({ theme }) => {

  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setOpen(open => !open);
  }

  return (
    <>
      {theme ?
        <article>
          <div className={cn(`flex justify-between items-center border-2 border-black py-1 px-3 peer`)} aria-expanded={open} onClick={handleToggle}>
            <div className='flex items-center gap-2'>
              <p className="text-lg font-bold ">{theme.name}</p>
              <p><span className='text-md font-medium'>Tasks: </span>{theme.tasks.length}</p>
            </div>

            <div className={
              cn({ '-rotate-90': !open, }, 'transition-transform')
            }>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
          </div >

          <div className={cn(`border-2 border-black py-1 border-t-0 peer-aria-expanded:hidden px-3`)}>
            <ul>
              {theme && theme.tasks.length > 0 && theme.tasks.map(task => <li key={task.id}>

                <TaskItem task={task} />

              </li>)}
            </ul>
          </div>
        </article >
        : <div className='p-1 border-2 border-black'>

          <p className='text-lg font-bold'>Theme not found</p>
        </div>
      }
    </>
  )
}

export default ThemeAccordion
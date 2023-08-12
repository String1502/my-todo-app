import { COLLECTION_NAME } from '@/lib/enums/collectionName'
import { db } from '@/lib/firebase'
import { Tag } from '@/lib/models/tag'
import { Task } from '@/lib/models/task'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

type TaskItemProps = {
  task: Task
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {

    const getData = async () => {
      const path = `${COLLECTION_NAME.ACCOUNTS}/`
      const tagSnapshot = await getDocs(collection(db, COLLECTION_NAME.ACCOUNTS))
    }

    getData();

  }, []);

  return (
    <section className='border-2 py-1 px-3 border-black rounded-md'>
      <div className='flex justify-between'>
        <p className='font-medium'>{task.title}</p>

        <div className='flex gap-1'>
          {task.tags.map(tag => <div key={tag}>
            <p>#{tag}</p>
          </div>)}
        </div>


      </div>

      <div className='bg-black h-0.5'></div>
      <p>{task.content}</p>
    </section>
  )
}

export default TaskItem
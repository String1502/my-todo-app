import AddTaskButon from "@/components/AddTaskButton/AddTaskButton";
import IntervalButtonBar from "@/components/IntervalButtonBar";
import NewTaskModal from "@/components/NewTaskModal";
import TaskItem from "@/components/TaskItem";
import { useTaskItems } from "@/lib/hooks/useTaskItems";
import { useState } from "react";
import IntervalState from "./lib/types/IntervalState";

const App = () => {
  const [taskItemPropsList, loading, error] = useTaskItems();
  const [selectedIntervalState, setSelectedIntervalState] = useState<IntervalState>('inbox');
  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const handleIntervalOptionChange = (intervalValue: IntervalState) => {
    if (intervalValue) {
      setSelectedIntervalState(intervalValue);
    }
  }

  const handleAddTask = () => {
    setNewTaskModalOpen(prev => !prev);
  }

  const handleCloseModal = () => setNewTaskModalOpen(false);

  console.log(taskItemPropsList);

  return (
    <>
      <div className="container py-8 mx-auto flex-col">

        <section className="flex justify-between">
          <IntervalButtonBar value={selectedIntervalState} onChange={handleIntervalOptionChange} />

          <AddTaskButon onClick={handleAddTask} />
        </section>

        <div className="w-full h-1 bg-slate-900 my-2"></div>

        {
          taskItemPropsList && taskItemPropsList.length > 0 ?
            <ul className="flex-col space-y-2">
              {taskItemPropsList.map(props => <TaskItem key={props.task.id} task={props.task} theme={props.theme} tags={props.tags} />)}
            </ul > :
            <p>No Tasks</p>}
      </div>

      {
        newTaskModalOpen ? <NewTaskModal handleClose={handleCloseModal} /> : null
      }
    </>
  )
}



export default App;
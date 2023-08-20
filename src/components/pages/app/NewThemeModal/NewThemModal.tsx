import { Modal } from '@/components/common';
import { addTheme } from '@/data/api/theme';
import useAccountContext from '@/hooks/useAccountContext';
import { Theme } from '@/types/models/theme';
import cn from '@/utils/tailwind';
import {
  ChangeEventHandler,
  DialogHTMLAttributes,
  forwardRef,
  useState,
} from 'react';

type NewThemeModalProps = DialogHTMLAttributes<HTMLDialogElement> & {
  onClose: () => void;
};

const NewThemModal = forwardRef<HTMLDialogElement, NewThemeModalProps>(
  ({ onClose }, ref) => {
    //#region Custom Hooks

    const account = useAccountContext();

    //#endregion

    //#region States

    const [themeName, setThemeName] = useState('');

    //#endregion

    //#region Functions

    /**
     * Clear modal information
     *
     * For example: name.
     */
    const clearModal = () => {
      setThemeName('');
    };

    const closeModal = () => {};

    //#endregion

    //#region Handlers

    const handleThemeNameChange: ChangeEventHandler<HTMLInputElement> = (e) =>
      setThemeName(e.target.value);

    const handleAdd = async () => {
      if (!account) {
        alert('Invalid account');
        return;
      }

      const theme: Omit<Theme, 'id'> = {
        name: themeName,
      };

      try {
        await addTheme(account.id, theme);

        clearModal();
        closeModal();
      } catch (error) {
        console.log(error);
      }
    };

    //#endregion

    return (
      <Modal
        title="Add New Theme"
        onClose={onClose}
        ref={ref}
        actions={[
          <button
            key="add-btn"
            className="bg-green-500 border-2 border-black text-white hover:bg-red-600 rounded-lg px-2 font-bold flex justify-between items-center"
            onClick={handleAdd}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>
            <span>Add</span>
          </button>,
        ]}
      >
        <label htmlFor="themeName" className="font-bold text-sm">
          Theme name
        </label>
        <br />
        <input
          id="themeName"
          value={themeName}
          onChange={handleThemeNameChange}
          placeholder="Theme name"
          type="text"
          name="name"
          className={cn(
            `block outline-none outline-2 rounded-lg px-2 outline-black py-1  
          focus:outline-blue-500 w-full mt-1`
          )}
        />
      </Modal>
    );
  }
);

export default NewThemModal;

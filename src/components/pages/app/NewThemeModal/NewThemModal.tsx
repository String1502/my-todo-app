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
import { toast } from 'react-toastify';

type NewThemeModalProps = DialogHTMLAttributes<HTMLDialogElement> & {
  onClose: () => void;
};

const NewThemeModal = forwardRef<HTMLDialogElement, NewThemeModalProps>(
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

    //#endregion

    //#region Handlers

    const handleThemeNameChange: ChangeEventHandler<HTMLInputElement> = (e) =>
      setThemeName(e.target.value);

    const handleAdd: React.FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();

      if (!account) {
        alert('Invalid account');
        return;
      }

      if (!themeName) {
        toast('Please enter theme name', {
          theme: 'colored',
          type: 'warning',
          position: 'bottom-left',
        });
        return;
      }

      const theme: Omit<Theme, 'id'> = {
        name: themeName,
      };

      try {
        await addTheme(account.id, theme);

        clearModal();
        toast('New theme added!', {
          position: 'bottom-left',
          type: 'success',
          theme: 'colored',
        });
        onClose();
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
            type="submit"
            form="newThemeForm"
            key="add-btn"
            className="flex items-center justify-between px-2 font-bold text-white bg-green-500 border-2 border-black rounded-lg hover:bg-red-600"
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
        <form id="newThemeForm" onSubmit={handleAdd}>
          <label htmlFor="themeName" className="text-sm font-bold">
            Theme name
          </label>
          <br />
          <input
            id="themeName"
            value={themeName}
            onChange={handleThemeNameChange}
            placeholder="Theme name"
            type="text"
            name="themeName"
            autoComplete="off"
            className={cn(
              `block outline-none outline-2 rounded-lg px-2 outline-black py-1  
          focus:outline-blue-500 w-full mt-1`
            )}
          />
        </form>
      </Modal>
    );
  }
);

export default NewThemeModal;

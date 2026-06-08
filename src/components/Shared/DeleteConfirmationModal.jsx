import { RxCross2 } from "react-icons/rx";
import Modal from "./Modal";
import Button from "./Button";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure ?",
  message = "Do you want to delete this item ?",
  confirmText = "Delete",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 max-w-sm w-full flex flex-col items-center text-center relative">
          {/* Close icon */}
          <div onClick={onClose}>
            <RxCross2 className="absolute top-4 right-4 cursor-pointer text-xl" />
          </div>

          {/* Warning message */}
          <h2 className="text-red-500 font-semibold text-xl mt-6 mb-8">
            {title}
          </h2>

          {/* Confirmation question */}
          <p className="text-primary text-lg mb-8">{message}</p>

          <div onClick={onConfirm}>
            <Button>{confirmText}</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
